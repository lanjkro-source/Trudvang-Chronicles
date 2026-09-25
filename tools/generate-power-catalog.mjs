/** Generate the entire power catalogue from the two reviewed source JSON files.
 *
 * FR is the rules authority. EN must have the same identities and all mechanical
 * fields; its prose is independent English text. Never infer or repair either
 * source from lang/*.json or from an earlier generated module.
 *
 * Usage: node tools/generate-power-catalog.mjs [--check]
 */
import {readFileSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {englishPowerField} from "./power-source-fields.mjs";

const root = process.cwd();
const check = process.argv.includes("--check");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const fr = read("game doc/fr/trudvang-powers-fr.json");
const en = read("game doc/en/trudvang-powers-en.json");
const types = new Map([
  ["persistant", ["Lasting", "lasting"]],
  ["soutenu", ["Preserving", "sustained"]],
  ["instantané", ["Instant", "instant"]],
  ["permanent", ["Permanent", "permanent"]]
]);
const fail = message => { throw new Error(`Power catalogue: ${message}`); };
const mapById = (entries, language) => {
  if (entries.length !== 394) fail(`${language}: expected 394 entries, found ${entries.length}`);
  const map = new Map();
  for (const entry of entries) {
    if (!entry.catalogId || map.has(entry.catalogId)) fail(`${language}: missing/duplicate catalogId ${entry.catalogId}`);
    map.set(entry.catalogId, entry);
  }
  return map;
};
const french = mapById(fr, "FR"), english = mapById(en, "EN");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!same([...french.keys()].sort(), [...english.keys()].sort())) fail("FR and EN catalogId sets differ");

const powerDetails = {};
const powersByTablet = {};
const localized = {fr: {}, en: {}};
let optionCount = 0;
for (const id of [...french.keys()].sort()) {
  const f = french.get(id), e = english.get(id);
  const tabletId = id.split(":")[0];
  const order = Number(id.slice(id.lastIndexOf(":") + 1));
  if (!Number.isInteger(order) || order < 0) fail(`${id}: invalid order suffix`);
  const rune = Boolean(f.isRune);
  const matching = ["level", "cost", "modifier", "swedishName"];
  for (const field of matching) if (!same(e[field] ?? null, f[field] ?? null)) fail(`${id}: EN ${field} differs from FR`);
  if (Boolean(e.isRune) !== rune) fail(`${id}: rune status differs`);
  if (!types.has(f.type) || e.type !== types.get(f.type)[0]) fail(`${id}: EN type does not translate FR type`);
  if (!Number.isInteger(f.source?.page) || !Number.isInteger(e.source?.page)) fail(`${id}: missing source page`);
  for (const field of ["duration", "range", "castingTime"]) {
    if ((e[field] ?? "") !== englishPowerField(f[field])) fail(`${id}: EN ${field} differs from FR mechanics`);
  }
  if (rune && Boolean(e.dailyActivation) !== Boolean(f.dailyActivation)) fail(`${id}: rune daily activation differs`);
  if (!rune && (!Number.isInteger(f.cost) || !Number.isInteger(f.modifier))) fail(`${id}: missing base cost/modifier`);
  if (!Number.isInteger(f.level) || f.level < 1 || f.level > 5) fail(`${id}: invalid power level`);
  if (!Array.isArray(f.powerLevels) || !Array.isArray(e.powerLevels) || f.powerLevels.length !== e.powerLevels.length) {
    fail(`${id}: power-level count differs`);
  }
  for (let index = 0; index < f.powerLevels.length; index++) {
    const a = f.powerLevels[index], b = e.powerLevels[index];
    if (!Number.isInteger(a.cost) || !same([b.cost, b.maxCount ?? null], [a.cost, a.maxCount ?? null])) {
      fail(`${id}: EN improvement ${index} cost/limit differs from FR`);
    }
    if (!a.effect?.trim() || !b.effect?.trim()) fail(`${id}: empty improvement ${index}`);
    if (a.effect === b.effect && /[À-ÿ]|\b(?:Augmente|Réduit|Affecte|Permet|Ajoute|Invoque|Soigne)\b/u.test(a.effect)) {
      fail(`${id}: EN improvement ${index} still copies French text`);
    }
  }
  optionCount += f.powerLevels.length;
  powerDetails[id] = {
    isRune: rune,
    powerLevels: f.powerLevels.map((level, index) => ({id: `${id}:${index}`, cost: level.cost, maxCount: level.maxCount ?? null})),
    spellType: types.get(f.type)[1],
    page: e.source.page,
    pageFr: f.source.page
  };
  const powers = powersByTablet[tabletId] ??= [];
  powers.push({id, name: e.name, level: f.level, type: tabletId.startsWith("vitner-") ? "spell" : "divineFeat",
    cost: rune ? 0 : f.cost, modifier: f.modifier ?? 0, order});
  for (const [language, source] of [["fr", f], ["en", e]]) {
    for (const field of ["name", "description", "summary"]) {
      if (!String(source[field] ?? "").trim()) fail(`${id}: ${language} ${field} is empty`);
    }
    if (language === "en" && /^(?:HOLY\b|TRADITION.S HOLY\b|OF NID.S HOLY\b|\d+: [A-Z][^\n]+ \d+:)/u.test(source.description)) {
      fail(`${id}: English description appears to contain a table of contents instead of the power`);
    }
    localized[language][id] = {
      Name: source.name,
      Summary: source.summary,
      Description: source.description,
      SwedishName: source.swedishName ?? "",
      Duration: source.duration ?? "",
      Range: source.range ?? "",
      CastingTime: source.castingTime ?? "",
      DailyActivation: source.dailyActivation ?? "",
      PowerLevels: Object.fromEntries(source.powerLevels.map((level, index) => [index, level.effect]))
    };
  }
}
for (const [tabletId, powers] of Object.entries(powersByTablet)) {
  powers.sort((a, b) => a.order - b.order);
  if (!same(powers.map(power => power.order), powers.map((_, index) => index))) fail(`${tabletId}: non-contiguous power order`);
  powersByTablet[tabletId] = powers.map(({order, ...power}) => power);
}

const modulePath = resolve(root, "modules/power-catalog-data.mjs");
const moduleText = `// Generated by tools/generate-power-catalog.mjs from game doc/{fr,en}/trudvang-powers-*.json.\n// Do not edit this file directly.\nexport const POWER_DETAILS_BY_ID = ${JSON.stringify(powerDetails, null, 2)};\n\nexport const POWER_CATALOG_BY_TABLET = ${JSON.stringify(powersByTablet, null, 2)};\n`;
const outputs = new Map([[modulePath, moduleText]]);
for (const language of ["fr", "en"]) {
  const path = resolve(root, `lang/${language}.json`);
  const pack = read(`lang/${language}.json`);
  pack.TRUDVANG.Content.Power = localized[language];
  outputs.set(path, `${JSON.stringify(pack, null, 2)}\n`);
}
for (const [path, content] of outputs) {
  if (check) {
    if (readFileSync(path, "utf8") !== content) fail(`${path} is stale; regenerate from the source JSON files`);
  } else writeFileSync(path, content, "utf8");
}
console.log(`${check ? "Validated" : "Generated"} ${french.size} powers and ${optionCount} improvements from FR/EN source JSON.`);
