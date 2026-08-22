// Builds the bilingual Skills compendium packs (legacy NEDB .db format, auto-migrated by Foundry on load).
// Usage: node tools/build-skill-pack.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { TRUDVANG } from "../modules/config.mjs";

const ROOT = process.cwd();
const enLang = JSON.parse(readFileSync(path.join(ROOT, "lang/en.json"), "utf8"));
const frLang = JSON.parse(readFileSync(path.join(ROOT, "lang/fr.json"), "utf8"));
const resolveKey = (pack, keyPath) => keyPath.split(".").reduce((node, part) => node?.[part], pack);

const summaries = {};
for (const batch of ["batch-1", "batch-2", "batch-3", "batch-4"]) {
  Object.assign(summaries, JSON.parse(readFileSync(path.join(ROOT, `tmp/abilities-batches/summaries-${batch}.json`), "utf8")));
}

function deterministicId(seed) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  let value = hash >>> 0;
  while (result.length < 16) {
    result += charset[value % charset.length];
    value = Math.floor(value / charset.length) + hash % 97 + result.length * 31;
  }
  return result.slice(0, 16);
}

const LANGUAGES = [
  {code: "en", packName: "skills-en", label: "Skills"},
  {code: "fr", packName: "skills-fr", label: "Compétences"}
];

mkdirSync(path.join(ROOT, "packs"), {recursive: true});
for (const {code, packName, label} of LANGUAGES) {
  const langPack = code === "fr" ? frLang : enLang;
  const localize = (key) => resolveKey(langPack, key) ?? resolveKey(enLang, key) ?? key;
  const lines = [];
  const folders = {};
  for (const skillKey of Object.keys(TRUDVANG.knowledgeTree)) {
    const folderId = deterministicId(`folder:${skillKey}`);
    folders[skillKey] = folderId;
    lines.push(JSON.stringify({
      _id: folderId,
      name: localize(TRUDVANG.skills[skillKey]),
      type: "Item",
      sorting: "a",
      description: "",
      flags: {}
    }));
  }
  let count = 0;
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    for (const discipline of disciplines) {
      const entries = [{...discipline, kind: "discipline"}, ...discipline.specialties.map(specialty => ({...specialty, kind: "specialty"}))];
      for (const entry of entries) {
        const description = resolveKey(langPack, `TRUDVANG.Content.Ability.${entry.id}.Description`) ?? "";
        const summary = resolveKey(langPack, `TRUDVANG.Content.Ability.${entry.id}.Summary`) ?? "";
        if (!description || !summary) throw new Error(`Missing text for ${entry.id} (${code})`);
        lines.push(JSON.stringify({
          _id: deterministicId(`ability:${entry.id}`),
          name: localize(entry.label),
          type: "ability",
          img: "icons/svg/book.svg",
          folder: folders[skillKey],
          system: {
            description,
            summary,
            catalogId: entry.id,
            kind: entry.kind,
            parentSkill: skillKey,
            parentDiscipline: entry.kind === "specialty" ? discipline.name : "",
            level: 0,
            rollBonus: entry.kind === "specialty" ? 2 : 1,
            freeLevels: 0
          },
          flags: {}
        }));
        count += 1;
      }
    }
  }
  writeFileSync(path.join(ROOT, "packs", `${packName}.db`), lines.join("\n") + "\n", "utf8");
  console.log(`${packName}.db (${label}): ${lines.length} documents (${count} abilities, ${Object.keys(folders).length} folders)`);
}
