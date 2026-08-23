import { TRUDVANG } from "./config.mjs";

// Shared, environment-agnostic source of truth for the bilingual Skills compendium packs.
// Consumed by tools/build-packs.mjs (Node, at package build time) and by the runtime
// repair path in modules/content-importer.mjs so both always produce identical documents.
// This module must stay free of any Foundry or browser global.

export const SKILL_PACKS = [
  {code: "en", packName: "skills-en", label: "Skills (en)"},
  {code: "fr", packName: "skills-fr", label: "Compétences (fr)"}
];

// Deterministic FNV-based id: pack document ids must never change between releases,
// otherwise compendium links and imported copies in user worlds go stale.
export function deterministicId(seed) {
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

// Builds every Folder and ability Item of a Skills pack as plain source objects.
// localize(keyPath) resolves a localization key to its text; a missing translation
// must yield an empty string. With strict=true a missing text throws instead of
// being skipped — the package build must never ship an incomplete pack.
// The returned documents carry the LevelDB `_key` used by @foundryvtt/foundryvtt-cli
// (`!folders!<id>` / `!items!<id>`); strip it with toCreateData() before passing them
// to Foundry's creation APIs.
export function buildSkillPackDocuments({localize, strict = false} = {}) {
  if (typeof localize !== "function") throw new Error("buildSkillPackDocuments requires a localize(keyPath) callback");
  const folders = [];
  const items = [];
  const folderIds = new Map();
  let folderSort = 0;

  for (const skillKey of Object.keys(TRUDVANG.knowledgeTree)) {
    const id = deterministicId(`folder:${skillKey}`);
    folderIds.set(skillKey, id);
    folders.push({
      _key: `!folders!${id}`,
      _id: id,
      name: localize(TRUDVANG.skills[skillKey]),
      type: "Item",
      folder: null,
      sorting: "a",
      sort: (folderSort += 1) * 100000,
      description: "",
      flags: {},
      ownership: {default: 0}
    });
  }

  let itemSort = 0;
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    for (const discipline of disciplines) {
      const entries = [{...discipline, kind: "discipline"}, ...discipline.specialties.map(specialty => ({...specialty, kind: "specialty"}))];
      for (const entry of entries) {
        const description = localize(`TRUDVANG.Content.Ability.${entry.id}.Description`);
        const summary = localize(`TRUDVANG.Content.Ability.${entry.id}.Summary`);
        if (!description || !summary) {
          if (strict) throw new Error(`Missing Description/Summary text for knowledge "${entry.id}"`);
          continue;
        }
        items.push({
          _key: `!items!${deterministicId(`ability:${entry.id}`)}`,
          _id: deterministicId(`ability:${entry.id}`),
          name: localize(entry.label),
          type: "ability",
          img: "icons/svg/book.svg",
          folder: folderIds.get(skillKey),
          sort: (itemSort += 1) * 100000,
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
          flags: {},
          ownership: {default: 0}
        });
      }
    }
  }
  return {folders, items};
}

// Strips compile-only fields so blueprints can feed Foundry's createDocuments APIs.
export function toCreateData(document) {
  const {_key, ...data} = document;
  return data;
}
