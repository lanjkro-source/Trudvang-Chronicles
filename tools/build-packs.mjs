// Builds the bilingual Skills compendium packs shipped with the system.
//
// 1. Generates reviewable JSON sources under packs/_source/<pack>/ from the single
//    source of truth (modules/config.mjs knowledgeTree + lang/*.json).
// 2. Compiles them into Foundry LevelDB pack directories (packs/skills-en, packs/skills-fr)
//    with @foundryvtt/foundryvtt-cli.
// 3. Verifies every compiled pack by extracting it back and comparing against the sources,
//    so a corrupted build fails loudly instead of shipping silently broken data.
//
// Usage: node tools/build-packs.mjs [--sources-only]
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {compilePack, extractPack} from "@foundryvtt/foundryvtt-cli";
import {tmpdir} from "node:os";
import {SKILL_PACKS, buildSkillPackDocuments} from "../modules/skill-pack-data.mjs";

const root = process.cwd();
const sourcesOnly = process.argv.includes("--sources-only");

const enLang = JSON.parse(readFileSync(join(root, "lang/en.json"), "utf8"));
const frLang = JSON.parse(readFileSync(join(root, "lang/fr.json"), "utf8"));
const resolveKey = (pack, keyPath) => keyPath.split(".").reduce((node, part) => node?.[part], pack);

// Defensive cleanup: provenance fields must never leak into published packs — a stale
// sourceId/compendiumSource would point at a document that does not exist in user worlds.
function sanitize(document) {
  if (document.flags?.core?.sourceId) delete document.flags.core.sourceId;
  if (document._stats?.compendiumSource) delete document._stats.compendiumSource;
  return document;
}

// Order-independent deep comparison of parsed JSON documents.
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

// The extractor materializes empty embedded collections (`effects: []`); mirror that on
// the expectation side so a clean round-trip compares strictly equal.
function expectedDocument(sourceDocument) {
  const expectation = structuredClone(sanitize(structuredClone(sourceDocument)));
  if (expectation.effects === undefined && !expectation._key.startsWith("!folders")) expectation.effects = [];
  delete expectation._key;
  return expectation;
}

for (const {code, packName, label} of SKILL_PACKS) {
  const langPack = code === "fr" ? frLang : enLang;
  const localize = (keyPath) => {
    const value = resolveKey(langPack, keyPath) ?? resolveKey(enLang, keyPath);
    return typeof value === "string" ? value : "";
  };
  const {folders, items} = buildSkillPackDocuments({localize, strict: true});
  const documents = [...folders, ...items].map(sanitize);

  // 1. Sources (tracked in git): one file per document so diffs stay reviewable.
  const sourceDir = join(root, "packs", "_source", packName);
  rmSync(sourceDir, {recursive: true, force: true});
  for (const document of documents) {
    const filename = document._key.startsWith("!folders")
      ? `folders/${document._id}.json`
      : `items/${document.system.catalogId}.json`;
    const target = join(sourceDir, filename);
    mkdirSync(join(target, ".."), {recursive: true});
    writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  }

  if (sourcesOnly) continue;

  // 2. Compiled LevelDB pack (build artifact, gitignored): full rebuild each run.
  const packDir = join(root, "packs", packName);
  rmSync(packDir, {recursive: true, force: true});
  await compilePack(sourceDir, packDir, {log: false, recursive: true});

  // 3. Round-trip verification: extract the compiled pack and diff against the sources.
  const verifyDir = join(tmpdir(), "trudvang-pack-verify", packName);
  rmSync(verifyDir, {recursive: true, force: true});
  await extractPack(packDir, verifyDir, {log: false});
  const extracted = new Map();
  for (const filename of readdirRecursive(verifyDir)) {
    const document = JSON.parse(readFileSync(filename, "utf8"));
    extracted.set(document._key ?? document._id, document);
  }
  let failures = 0;
  for (const document of documents) {
    const actual = extracted.get(document._key);
    if (!actual) {
      console.error(`  ${packName}: missing ${document._key} after round-trip`);
      failures += 1;
      continue;
    }
    const expectation = expectedDocument(document);
    delete actual._key;
    if (stableStringify(actual) !== stableStringify(expectation)) {
      console.error(`  ${packName}: content drift on ${document._key} (${document.name})`);
      failures += 1;
    }
  }
  if (extracted.size !== documents.length || failures) {
    console.error(`Build verification failed for ${packName}: ${failures} drifted, ${extracted.size}/${documents.length} extracted.`);
    process.exit(1);
  }
  console.log(`${packName} (${label}): ${documents.length} documents (${items.length} abilities, ${folders.length} folders) — compiled and verified.`);
}

function readdirRecursive(directory) {
  const files = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...readdirRecursive(path));
    else files.push(path);
  }
  return files;
}
