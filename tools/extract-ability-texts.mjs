// Extract official ability (discipline/specialty) descriptions from the game-doc text mirrors.
// Usage: node tools/extract-ability-texts.mjs [--write]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { TRUDVANG } from "../modules/config.mjs";

const ROOT = process.cwd();
const FR_FILE = path.join(ROOT, "game doc", "markdown-fr", "Trudvang - 01 - Livre des Regles.md");
const EN_FILES = [
  path.join(ROOT, "game doc", "markdown", "trudvang-chronicles-players-handbook.md"),
  path.join(ROOT, "game doc", "markdown", "trudvang-chronicles-game-masters-guide.md")
];

const enLang = JSON.parse(readFileSync(path.join(ROOT, "lang/en.json"), "utf8"));
const frLang = JSON.parse(readFileSync(path.join(ROOT, "lang/fr.json"), "utf8"));
const resolveKey = (pack, keyPath) => keyPath.split(".").reduce((node, part) => node?.[part], pack);

const normalize = (value) => String(value).toLowerCase()
  .replace(/œ/g, "oe").replace(/æ/g, "ae")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[&]|\b(and|et)\b/g, "")
  .replace(/[^a-z0-9]/g, "");

const stripHeadingMarks = (value) => value
  .replace(/\(\s*[^()]{0,30}\)/g, "")
  .replace(/[.:,;!?\s]+$/, "")
  .replace(/\s{2,}/g, " ")
  .trim();
const isFlameMeta = (line) => /^\s*.{0,2}\s*(Niveau|Level|Niv\.?)s?\s*\d/i.test(line);
const hasFlameAfter = (lines, index) => {
  for (let scan = index + 1; scan <= Math.min(index + 4, lines.length - 1); scan += 1) {
    if (isFlameMeta(lines[scan])) return true;
  }
  return false;
};
const isTocNoise = (line) => /\.{3,}/.test(line) || /\.{2}/.test(line);

// Headings that differ from the localized labels (book spellings/abbreviations).
const NAME_ALIASES = {
  oneHandedLightWeapons: {en: ["One-Handed Light Weapons", "Light Weapons One Hand"]},
  oneHandedHeavyWeapons: {en: ["One-Handed Heavy Weapons", "Heavy Weapons One Hand"]},
  throwingWeapons: {en: ["Throwing Weapon"]},
  readWrite: {en: ["Reading & Writing", "Reading and Writing"], fr: []},
  extractsPotions: {fr: ["Extraits et potions"], en: ["Extracts and Potions"]},
  singingPlayingInstruments: {fr: ["Chants et instruments de musique", "Chant et instruments de musique", "Chant & Instruments", "Chants & instruments"], en: ["Singing and Playing Instruments"]},
  religion: {fr: ["Religion"]},
  silvertongue: {fr: ["Éloquence et baratin"]}
};

function catalogEntries() {
  const rows = [];
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    for (const discipline of disciplines) {
      rows.push({id: discipline.id, kind: "discipline", skillKey,
        fr: resolveKey(frLang, discipline.label), en: resolveKey(enLang, discipline.label),
        aliases: {fr: [], en: [], ...(NAME_ALIASES[discipline.id] ?? {})}});
      for (const specialty of discipline.specialties) {
        rows.push({id: specialty.id, kind: "specialty", skillKey, parentDiscipline: discipline.id,
          fr: resolveKey(frLang, specialty.label), en: resolveKey(enLang, specialty.label),
          aliases: {fr: [], en: [], ...(NAME_ALIASES[specialty.id] ?? {})}});
      }
    }
  }
  return rows;
}

function extractLanguage(file, languageField) {
  const raw = readFileSync(file, "utf8");
  const lines = raw.split(/\r?\n/);
  const byName = new Map();
  for (const entry of catalogEntries()) {
    const names = [entry[languageField], ...(entry.aliases[languageField] ?? [])];
    for (const name of names) {
      const key = normalize(name);
      if (key && !byName.has(key)) byName.set(key, entry);
    }
  }
  const found = [];
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed || isTocNoise(lines[index])) continue;
    let candidateLine = stripHeadingMarks(trimmed);
    let headingLines = 1;
    if (lines[index + 1] !== undefined) {
      const joined = stripHeadingMarks(`${trimmed} ${lines[index + 1].trim()}`);
      if (byName.has(normalize(joined)) && !byName.has(normalize(candidateLine))) {
        candidateLine = joined;
        headingLines = 2;
      }
    }
    const entry = byName.get(normalize(candidateLine));
    if (!entry || entry[languageField]?.length < 4) continue;
    if (!hasFlameAfter(lines, index + (headingLines - 1))) continue;
    found.push({entry, start: index, headingLines});
  }

  // Every detected heading bounds the previous section; each entry tries its candidates
  // in order and keeps the first span holding substantial text.
  const traceIds = process.argv.includes("--trace-ids")
    ? new Set(process.argv[process.argv.indexOf("--trace-ids") + 1].split(","))
    : null;
  const boundaries = [...new Set(found.map(candidate => candidate.start))].sort((a, b) => a - b);
  const results = {};
  for (const entry of catalogEntries()) {
    const candidates = found.filter(candidate => candidate.entry.id === entry.id).sort((a, b) => a.start - b.start);
    for (const candidate of candidates) {
      const nextStart = boundaries.find(boundary => boundary > candidate.start) ?? Math.min(lines.length, candidate.start + 400);
      const windowEnd = Math.min(nextStart, candidate.start + candidate.headingLines + 120);
      const bodyLines = [];
      for (let scan = candidate.start + candidate.headingLines; scan < windowEnd; scan += 1) {
        const line = lines[scan];
        if (isFlameMeta(line)) continue;
        const trimmed = line.trim();
        bodyLines.push(trimmed);
      }
      let text = bodyLines.join("\n");
      text = text.replace(/(\p{Ll})\s*[-\u2010\u2011]\r?\n\s*(\p{Ll})/gu, "$1$2");
      text = text.replace(/(\p{Ll})[-\u2010\u2011]\n\s*(\p{L})/gu, "$1-$2");
      text = text.replace(/[ \t]*\r?\n[ \t]*/g, " ").replace(/\s{2,}/g, " ").trim();
      text = text.replace(/##\s*PDF page \d+/gi, "").replace(/\d{1,3}\s*\|\s*(chapter|chapitre)[^|]*/gi, "");
      text = text.replace(/^\((?:[^)]{0,45})\)\s*/, "");
      text = text.replace(/\((?:à préciser|to be specified|left or right hand|main gauche ou main droite)\)\s*/gi, "");
      text = text.replace(/(\p{Ll})\s-\s(\p{Ll})/gu, "$1$2");
      text = text.replace(/c'està-dire/gi, "c’est-à-dire").replace(/\s([,;.])/g, "$1").replace(/\s{2,}/g, " ").trim();
      if (/^,/.test(text)) text = text.slice(1).trim();
      if (text.length > 2800) {
        const cutoff = text.lastIndexOf(".", 2800);
        text = (cutoff > 400 ? text.slice(0, cutoff + 1) : text.slice(0, 2800)).trim();
      }
      if (text.length > 40) { results[entry.id] = text; break; }
      if (traceIds?.has(entry.id)) console.log(`[trace] ${entry.id}@${candidate.start}: span rejected (${text.length} chars)`);
    }
  }
  return results;
}

const fr = existsSync(FR_FILE) ? extractLanguage(FR_FILE, "fr") : {};
let en = {};
for (const file of EN_FILES) {
  if (!existsSync(file)) continue;
  en = {...extractLanguage(file, "en"), ...en};
}

const report = catalogEntries().map(entry => ({...entry, hasFr: Boolean(fr[entry.id]), hasEn: Boolean(en[entry.id])}));
const coveredFr = report.filter(row => row.hasFr).length;
const coveredEn = report.filter(row => row.hasEn).length;
console.log(`FR coverage: ${coveredFr}/${report.length}`);
console.log(`EN coverage: ${coveredEn}/${report.length}`);
for (const row of report.filter(row => !row.hasFr || !row.hasEn)) {
  console.log(`MISSING ${row.id} [${row.kind}/${row.skillKey}] fr:${row.hasFr ? "ok" : "—"} en:${row.hasEn ? "ok" : "—"} (${row.fr} / ${row.en})`);
}
if (process.argv.includes("--write")) {
  const payload = {generatedAt: new Date().toISOString(), entries: Object.fromEntries(report.map(({id, ...rest}) => [id, {...rest, descriptionFr: fr[id] ?? "", descriptionEn: en[id] ?? ""}]))};
  writeFileSync(path.join(ROOT, "tmp", "abilities-extracted.json"), JSON.stringify(payload, null, 2), "utf8");
  console.log("written tmp/abilities-extracted.json");
}
