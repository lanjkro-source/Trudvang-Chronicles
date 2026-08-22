// Cross-checks French/English ability description pairs for extraction anomalies.
// Usage: node tools/check-ability-pairs.mjs
import { readFileSync } from "node:fs";
import path from "node:path";
import { TRUDVANG } from "../modules/config.mjs";

const ROOT = process.cwd();
const overrides = JSON.parse(readFileSync(path.join(ROOT, "tools/ability-text-overrides.json"), "utf8"));
const rawEntries = JSON.parse(readFileSync(path.join(ROOT, "tmp/abilities-extracted.json"), "utf8")).entries;
const extracted = {};
for (const [id, entry] of Object.entries(rawEntries)) {
  const override = overrides[id] ?? {};
  const copy = {...entry};
  if (override.trimFrBefore && copy.descriptionFr?.includes(override.trimFrBefore)) {
    copy.descriptionFr = copy.descriptionFr.slice(0, copy.descriptionFr.indexOf(override.trimFrBefore)).trim();
  }
  if (override.trimEnBefore && copy.descriptionEn?.includes(override.trimEnBefore)) {
    copy.descriptionEn = copy.descriptionEn.slice(0, copy.descriptionEn.indexOf(override.trimEnBefore)).trim();
  }
  if (override.descriptionFr) copy.descriptionFr = override.descriptionFr;
  if (override.descriptionEn) copy.descriptionEn = override.descriptionEn;
  extracted[id] = copy;
}

const frLang = JSON.parse(readFileSync(path.join(ROOT, "lang/fr.json"), "utf8"));
const enLang = JSON.parse(readFileSync(path.join(ROOT, "lang/en.json"), "utf8"));
const resolveKey = (pack, keyPath) => keyPath.split(".").reduce((node, part) => node?.[part], pack);

const names = [];
for (const disciplines of Object.values(TRUDVANG.knowledgeTree)) {
  for (const d of disciplines) {
    names.push({id: d.id, fr: resolveKey(frLang, d.label), en: resolveKey(enLang, d.label)});
    for (const s of d.specialties) names.push({id: s.id, fr: resolveKey(frLang, s.label), en: resolveKey(enLang, s.label)});
  }
}

const issues = [];
// Entries the source books deliberately keep terse — length rules don't apply.
const LENGTH_EXCEPTIONS = new Set(["cook"]);
// Entries reviewed by hand: complete content, the book simply omits the final period.
const VERIFIED_ENDINGS = new Set(["bodyControl", "composed", "shadowing"]);
for (const [id, entry] of Object.entries(extracted)) {
  const meta = names.find((n) => n.id === id) ?? {fr: id, en: id};
  const fr = entry.descriptionFr ?? "";
  const en = entry.descriptionEn ?? "";
  const flags = [];

  if (LENGTH_EXCEPTIONS.has(id)) continue;
  if (fr.length < 100 || en.length < 40) flags.push(`too-short (fr:${fr.length} en:${en.length})`);
  const ratio = fr.length / Math.max(1, en.length);
  if (ratio < 0.4 || ratio > 2.6) flags.push(`length-ratio ${ratio.toFixed(2)}`);
  if (!VERIFIED_ENDINGS.has(id)) {
    if (!/[.!?»”)]\s*$/.test(fr)) flags.push("fr-no-final-sentence");
    if (!/[.!?”)]\s*$/.test(en)) flags.push("en-no-final-sentence");
  }
  if (/[\w.'+-]+@[\w.-]+\.\w+|##\s*PDF page|\|\s*\d{1,3}\s*$/.test(fr + en)) flags.push("page-furniture");
  const shoutyRuns = (text) => (text.match(/\b(?:[A-ZÀ-Þ][A-ZÀ-Þ'’ &]{5,})\b/g) ?? []).filter((w) => !["VC", "SV", "PC"].includes(w.trim()));
  const frShouty = shoutyRuns(fr);
  if (frShouty.length >= 2 || (frShouty.length === 1 && frShouty[0].length > 14)) flags.push(`caps-runs: ${frShouty.slice(0, 3).join(" / ")}`);
  if (flags.length) issues.push({id, kind: entry.kind, skillKey: entry.skillKey, frName: meta.fr, enName: meta.en, flags});
}

console.log(`${issues.length}/${Object.keys(extracted).length} pairs flagged:`);
for (const issue of issues) console.log(`- ${issue.id} (${issue.frName}) [${issue.flags.join("; ")}]`);
