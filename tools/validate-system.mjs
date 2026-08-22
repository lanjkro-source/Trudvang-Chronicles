import {readFileSync, readdirSync, statSync} from "node:fs";
import {join, relative} from "node:path";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const failures = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(join(root, path), "utf8"));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return {};
  }
}

function flattenValues(object, prefix = "", output = new Map()) {
  for (const [key, value] of Object.entries(object || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flattenValues(value, path, output);
    else output.set(path, value);
  }
  return output;
}

function walkFiles(directory, suffix) {
  const found = [];
  for (const entry of readdirSync(join(root, directory))) {
    const path = join(root, directory, entry);
    if (statSync(path).isDirectory()) found.push(...walkFiles(relative(root, path), suffix));
    else if (path.endsWith(suffix)) found.push(path);
  }
  return found;
}

function flatten(object, prefix = "", output = new Set()) {
  for (const [key, value] of Object.entries(object || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, path, output);
    else output.add(path);
  }
  return output;
}

function collectKeyFields(value, output = []) {
  if (Array.isArray(value)) value.forEach(child => collectKeyFields(child, output));
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key.endsWith("Key") && typeof child === "string") output.push(child);
      collectKeyFields(child, output);
    }
  }
  return output;
}

const system = readJson("system.json");
const language = readJson("lang/en.json");
const french = readJson("lang/fr.json");
const content = readJson("data/starter-content.json");
const localization = flatten(language);
const frenchLocalization = flatten(french);

const languageValues = flattenValues(language);
globalThis.game = {
  i18n: {
    lang: "en",
    has: key => languageValues.has(key),
    localize: key => languageValues.get(key) ?? key,
    format: (key, params) => Object.entries(params || {}).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      languageValues.get(key) ?? key
    )
  }
};
const {getPowerSummary, TABLET_CATALOG} = await import("../modules/tablet-catalog.mjs");

const expectedTabletCounts = {vitner: 14, gerbanis: 6, ealdTradition: 6, tenetNid: 6, haminges: 6, thuuldom: 17, toikalokke: 3};
const actualTabletCounts = {};
const catalogIds = new Set();
for (const tablet of TABLET_CATALOG) {
  const family = tablet.religion || "vitner";
  actualTabletCounts[family] = (actualTabletCounts[family] || 0) + 1;
  if (catalogIds.has(tablet.id)) failures.push(`Duplicate tablet catalogue id: ${tablet.id}`);
  catalogIds.add(tablet.id);
  for (const power of tablet.powers) {
    if (catalogIds.has(power.id)) failures.push(`Duplicate power catalogue id: ${power.id}`);
    catalogIds.add(power.id);
    if (power.level < 1 || power.level > 5) failures.push(`Invalid level for ${power.name}: ${power.level}`);
    const summary = getPowerSummary(power);
    if (!summary || summary.length < 20 || summary.length > 280 || /Produces the magical effect|TYPES OF ANIMALS|SIZE MODIFIERS|PDF page/i.test(summary)) failures.push(`Invalid quick summary for ${power.name}: ${summary}`);
  }
}
for (const [family, count] of Object.entries(expectedTabletCounts)) if (actualTabletCounts[family] !== count) failures.push(`${family} must contain ${count} tablets, found ${actualTabletCounts[family] || 0}.`);
if (TABLET_CATALOG.reduce((total, tablet) => total + tablet.powers.length, 0) !== 394) failures.push("The complete tablet catalogue must contain 394 spell/divine-power entries.");

try {
  readFileSync(join(root, "template.json"));
  failures.push("template.json must not be present; use native System Data Models instead.");
} catch {
  // Expected: template.json was removed in favor of registered TypeDataModel classes.
}

for (const documentName of ["Actor", "Item"]) {
  if (!system.documentTypes?.[documentName]) failures.push(`system.json is missing documentTypes.${documentName}`);
}

for (const key of collectKeyFields(content)) {
  if (!localization.has(key)) failures.push(`Missing localization key: ${key}`);
  if (!frenchLocalization.has(key)) failures.push(`Missing French localization key: ${key}`);
}

for (const key of localization) if (!frenchLocalization.has(key)) failures.push(`Missing French localization key: ${key}`);
for (const key of frenchLocalization) if (!localization.has(key)) failures.push(`Missing English localization key: ${key}`);

const requiredTables = new Map([["fatal-magic-effects", 29], ["fatal-failure-effects", 11]]);
if (content.tables?.length !== requiredTables.size) failures.push(`Starter content must contain exactly ${requiredTables.size} rule tables.`);
for (const table of content.tables || []) {
  const id = table.flags?.["trudvang-chronicles"]?.starterId;
  const expectedResults = requiredTables.get(id);
  if (!expectedResults) failures.push(`Unexpected starter Roll Table: ${id || table.nameKey || "unknown"}`);
  else if (table.results?.length !== expectedResults) failures.push(`${id} must contain ${expectedResults} results.`);
  const sorted = [...(table.results || [])].sort((a, b) => a.range[0] - b.range[0]);
  let next = 0;
  for (const result of sorted) {
    if (result.range?.[0] !== next) failures.push(`${id} has a gap or overlap before ${result.range?.[0]}.`);
    next = Number(result.range?.[1]) + 1;
  }
  if (next !== 1000) failures.push(`${id} must cover every total from 0 through 999.`);
}

const glossary = readFileSync(join(root, "lang/GLOSSARY.md"), "utf8");
function collectGlossaryKeys(object, prefix = "") {
  const output = [];
  for (const [key, value] of Object.entries(object || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) output.push(...collectGlossaryKeys(value, path));
    else if (!(path.startsWith("TRUDVANG.Content.") && path.endsWith(".Summary"))) output.push(path);
  }
  return output;
}
for (const key of collectGlossaryKeys(language)) {
  if (!glossary.includes(`\`${key}\``)) failures.push(`Glossary is missing localization key: ${key}`);
}

const localAssetPattern = /systems\/trudvang-chronicles\/([^"']+)/g;
const contentText = readFileSync(join(root, "data/starter-content.json"), "utf8");
const modelText = readFileSync(join(root, "modules/data-models.mjs"), "utf8");
const characterSheetText = readFileSync(join(root, "templates/actor/character-sheet.hbs"), "utf8");
if (!characterSheetText.includes('data-action="adjust-trait"') || characterSheetText.includes("lookup ../system.traits key")) {
  failures.push("Character traits must use the validated creation controls and the root sheet data.");
}
for (const [documentName, types] of Object.entries(system.documentTypes || {})) {
  const exportedMap = documentName === "Actor" ? "ACTOR_DATA_MODELS" : documentName === "Item" ? "ITEM_DATA_MODELS" : null;
  if (!exportedMap) continue;
  const mapStart = modelText.indexOf(`export const ${exportedMap}`);
  if (mapStart < 0) {
    failures.push(`Missing ${exportedMap} export for documentTypes.${documentName}`);
    continue;
  }
  const mapText = modelText.slice(mapStart, modelText.indexOf(";", mapStart) + 1);
  for (const type of Object.keys(types)) {
    if (!new RegExp(`\\b${type}\\s*:`).test(mapText)) failures.push(`No registered data model found for ${documentName}.${type}`);
  }
}
for (const match of contentText.matchAll(localAssetPattern)) {
  try { readFileSync(join(root, match[1])); }
  catch { failures.push(`Missing asset: ${match[1]}`); }
}

for (const path of [...walkFiles("modules", ".mjs"), join(root, "trudvang.mjs")]) {
  const result = spawnSync(process.execPath, ["--check", path], {encoding: "utf8"});
  if (result.status !== 0) failures.push(`${relative(root, path)}: ${result.stderr.trim()}`);
}

for (const configured of [...(system.esmodules || []), ...(system.styles || []), ...((system.languages || []).map(entry => entry.path))]) {
  try { readFileSync(join(root, configured)); }
  catch { failures.push(`Missing system.json target: ${configured}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated Trudvang system ${system.version}: ${content.items.length} items, ${content.tables.length} tables, ${content.actors.length} actors.`);
