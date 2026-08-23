import { powerItemData, TABLET_CATALOG, tabletItemData } from "./tablet-catalog.mjs";
import { TRUDVANG } from "./config.mjs";
import { buildSkillPackDocuments, SKILL_PACKS, toCreateData } from "./skill-pack-data.mjs";
import { TABLET_PACKS, buildTabletPackDocuments } from "./tablet-pack-data.mjs";

const CONTENT_VERSION = 16;
const SYSTEM_ID = "trudvang-chronicles";
const LEGACY_TABLE_KEYS = ["StormlanderMale", "StormlanderFemale", "ExtractEffect", "FearLevel", "StartingExperience", "RandomExtract", "TraitCost", "DisciplineCost", "WeaponDamage", "RaceStats"];

function localizeTree(value) {
  if (Array.isArray(value)) return value.map(localizeTree);
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (key.endsWith("Key") && typeof child === "string") result[key.slice(0, -3)] = game.i18n.localize(child);
    else result[key] = localizeTree(child);
  }
  return result;
}

const starterKey = (nameKey) => typeof nameKey === "string" ? nameKey.replace(/\.Name$/, "") : undefined;
const flagOf = (document, key = "starterId") => document.getFlag(SYSTEM_ID, key);
const normalizeLabel = (value) => String(value).toLowerCase()
  .replace(/œ/g, "oe").replace(/æ/g, "ae")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]/g, "");

function activeLanguage() {
  return String(game.i18n.lang ?? "");
}

// Names this i18n key takes across shipped languages plus the active one — used to adopt
// documents created before imports were tracked by stable ids.
const langPackCache = new Map();
async function fetchLangPack(lang) {
  if (langPackCache.has(lang)) return langPackCache.get(lang);
  try {
    const response = await fetch(`systems/${SYSTEM_ID}/lang/${lang}.json`);
    const pack = response.ok ? await response.json() : {};
    langPackCache.set(lang, pack);
    return pack;
  } catch (error) {
    console.warn(`Trudvang Chronicles | Could not load ${lang}.json`, error);
    langPackCache.set(lang, {});
    return {};
  }
}
function resolveNested(pack, keyPath) {
  let node = pack;
  for (const part of keyPath.split(".")) {
    node = node?.[part];
    if (node === undefined) return undefined;
  }
  return typeof node === "string" ? node : undefined;
}

async function loadTranslations(keys) {
  const langs = [...new Set(["en", "fr", activeLanguage()].filter(Boolean))];
  const packs = [];
  for (const lang of langs) packs.push(await fetchLangPack(lang));
  const map = new Map();
  for (const key of keys) {
    const names = new Set();
    for (const pack of packs) {
      let node = pack;
      for (const part of key.split(".")) {
        node = node?.[part];
        if (node === undefined) break;
      }
      if (typeof node === "string" && node) names.add(node);
    }
    map.set(key, names);
  }
  return map;
}

const renamedOrCustom = (document, translations) => !translations.has(document.name);

async function upsertFolder(slug, config, translations) {
  const localized = game.i18n.localize(config.nameKey);
  const existing = game.folders.find(folder => folder.type === config.type && flagOf(folder, "starterId") === slug)
    ?? game.folders.find(folder => folder.type === config.type && !flagOf(folder, "starterId") && translations.has(folder.name));
  if (existing) {
    const update = {[`flags.${SYSTEM_ID}.starterId`]: slug};
    if (existing.name !== localized) update.name = localized;
    await existing.update(update);
  }
  const canonical = existing ?? await Folder.create({name: localized, type: config.type, sorting: "a", flags: {[SYSTEM_ID]: {starterId: slug}}});

  // Previous imports could leave empty duplicates named in another language — fold them into the canonical folder.
  const duplicates = game.folders.filter(folder => folder.id !== canonical.id
    && folder.type === config.type
    && !flagOf(folder, "starterId")
    && translations.has(folder.name));
  for (const duplicate of duplicates) {
    for (const child of duplicate.contents) await child.update({folder: canonical.id});
    await Folder.deleteDocuments([duplicate.id]);
  }
  return game.folders.get(canonical.id);
}

// Refreshes only presentation text/images on an existing document; numeric rules stay untouched.
function presentationUpdate(payload, key) {
  const update = {
    name: payload.name,
    img: payload.img,
    [`flags.${SYSTEM_ID}.starterId`]: key
  };
  if (payload.system?.description !== undefined) update["system.description"] = payload.system.description;
  if (payload.system?.source !== undefined) update["system.source"] = payload.system.source;
  if (payload.system?.summary !== undefined) update["system.summary"] = payload.system.summary;
  return update;
}

async function upsertBaseItems(source, folders, translationsByKey) {
  const skippedTypes = ["tablet", "spell", "divineFeat"];
  const byKey = new Map(game.items.filter(item => flagOf(item)).map(item => [flagOf(item), item]));
  let updated = 0;
  let created = 0;
  for (const entry of source.items.filter(entry => !skippedTypes.includes(entry.type))) {
    const key = starterKey(entry.nameKey);
    const payload = localizeTree(entry);
    payload.folder = folders[entry.folder]?.id;
    const translations = translationsByKey.get(entry.nameKey);
    let existing = byKey.get(key)
      // Adopt documents imported before imports were tracked by stable ids.
      ?? game.items.find(item => !flagOf(item) && item.type === entry.type && translations?.has(item.name));
    if (existing) {
      const update = presentationUpdate(payload, key);
      update.folder = payload.folder;
      // Leave player-renamed copies alone apart from artwork and wording refresh.
      if (renamedOrCustom(existing, translations)) delete update.name;
      await existing.update(update);
      updated++;
    } else {
      await Item.createDocuments([{...payload, flags: {[SYSTEM_ID]: {starterId: key}}}]);
      created++;
    }
  }
  return {updated, created};
}

async function rebuildTables(source, folders, translationsByKey) {
  const sourceKeys = new Set(source.tables.map(entry => starterKey(entry.nameKey)));
  const sourceNames = new Set(source.tables.flatMap(entry => [...(translationsByKey.get(entry.nameKey) ?? [])]));
  const stale = game.tables.filter(table => {
    const key = table.getFlag(SYSTEM_ID, "tableKey");
    if (key && sourceKeys.has(key)) return true;
    if (sourceNames.has(table.name)) return true;
    return !key && LEGACY_TABLE_KEYS.some(legacy => table.name === game.i18n.localize(`TRUDVANG.Content.Table.${legacy}.Name`));
  }).map(table => table.id);
  if (stale.length) await RollTable.deleteDocuments(stale);

  const tables = source.tables.map(entry => ({
    ...localizeTree(entry),
    folder: folders[entry.folder]?.id,
    flags: {[SYSTEM_ID]: {starterId: starterKey(entry.nameKey), tableKey: starterKey(entry.nameKey)}}
  }));
  await RollTable.createDocuments(tables);
}

async function upsertActors(source, folders, translationsByKey) {
  let updated = 0;
  for (const entry of source.actors) {
    const key = starterKey(entry.nameKey);
    const payload = localizeTree(entry);
    payload.folder = folders[entry.folder]?.id;
    const translations = translationsByKey.get(entry.nameKey);
    // Raw children carry the stable nameKeys; localizeTree strips them, so pair both lists by index.
    const rawChildren = entry.items ?? [];
    let actor = game.actors.find(candidate => flagOf(candidate, "starterId") === key)
      ?? game.actors.find(candidate => !flagOf(candidate, "starterId") && translations?.has(candidate.name));
    if (!actor) {
      const children = rawChildren.map((rawChild, index) => ({
        ...(payload.items?.[index] ?? localizeTree(rawChild)),
        flags: {[SYSTEM_ID]: {starterId: starterKey(rawChild.nameKey)}}
      }));
      await Actor.createDocuments([{...payload, items: children, flags: {[SYSTEM_ID]: {starterId: key}}}]);
      continue;
    }
    const update = {img: payload.img, folder: payload.folder, [`flags.${SYSTEM_ID}.starterId`]: key};
    if (!renamedOrCustom(actor, translations)) update.name = payload.name;
    await actor.update(update);

    for (const [index, childPayload] of (payload.items ?? []).entries()) {
      const rawChild = rawChildren[index];
      if (!rawChild) break;
      const childKey = starterKey(rawChild.nameKey);
      const childTranslations = translationsByKey.get(rawChild.nameKey);
      const embedded = actor.items.find(item => flagOf(item, "starterId") === childKey)
        ?? actor.items.find(item => !flagOf(item, "starterId") && item.type === rawChild.type && childTranslations?.has(item.name));
      if (embedded) {
        const childUpdate = {img: childPayload.img, [`flags.${SYSTEM_ID}.starterId`]: childKey};
        if (!renamedOrCustom(embedded, childTranslations)) childUpdate.name = childPayload.name;
        if (childPayload.system?.description !== undefined) childUpdate["system.description"] = childPayload.system.description;
        await actor.updateEmbeddedDocuments("Item", [{_id: embedded.id, ...childUpdate}]);
      } else {
        await actor.createEmbeddedDocuments("Item", [{...childPayload, flags: {[SYSTEM_ID]: {starterId: childKey}}}]);
      }
    }
    updated++;
  }
  return updated;
}

// Repairs a bilingual Skills compendium by rebuilding it from the shared blueprints in
// modules/skill-pack-data.mjs, healing any stale LevelDB state left behind by earlier
// NEDB migrations or interrupted system updates. Not part of the normal startup path:
// shipped packs already contain this data, so this is a GM-triggered repair only.
// Shared wipe-and-recreate core for blueprint-driven compendium repairs. Folders and
// items are rebuilt from scratch on every repair: legacy NEDB migrations can strand
// documents (including misplaced Folder copies) inside the primary sublevel, which no
// API surface cleans up. Blueprints carry stable deterministic ids, so repairs never
// invalidate compendium links from previously imported copies.
async function rebuildCompendiumFromBlueprints(pack, blueprints) {
  const FolderClass = foundry.utils.getDocumentClass("Folder");
  const ItemClass = foundry.utils.getDocumentClass("Item");
  for (const folder of [...pack.folders.values()]) {
    await folder.delete().catch((error) => console.warn(`Trudvang Chronicles | Could not delete pack folder "${folder.name}"`, error));
  }
  const existing = await pack.getDocuments();
  if (existing.length) {
    try {
      await ItemClass.deleteDocuments(existing.map(document => document.id), {pack: pack.collection});
    } catch (error) {
      console.warn("Trudvang Chronicles | Bulk pack wipe failed, falling back per document", error);
      for (const document of existing) {
        await document?.delete().catch(() => {});
      }
    }
  }
  await FolderClass.createDocuments(blueprints.folders.map(toCreateData), {pack: pack.collection});
  await ItemClass.createDocuments(blueprints.items.map(toCreateData), {pack: pack.collection});
}

// Language text resolvers built from the fetched translation JSONs — not game.i18n,
// whose active locale may differ from the language pack being rebuilt.
function langResolvers(lang, fallback) {
  const localize = (keyPath, defaultValue = "") => {
    const value = resolveNested(lang, keyPath) ?? resolveNested(fallback, keyPath);
    return typeof value === "string" ? value : defaultValue;
  };
  const format = (key, params) => Object.entries(params ?? {}).reduce((text, [name, value]) => text.split(`{${name}}`).join(String(value)), key);
  return {localize, format};
}

async function unlockPackWhile(pack, work) {
  // System-shipped packs are locked by default in v14+; unlock for the duration of the rebuild.
  const wasLocked = pack.locked;
  if (wasLocked) await pack.configure({locked: false});
  try {
    await work();
  } finally {
    if (wasLocked) await pack.configure({locked: true}).catch((error) => {
      console.warn(`Trudvang Chronicles | Could not re-lock compendium ${pack.collection}`, error);
    });
  }
}

export async function syncSkillPack(packId, language) {
  const pack = game.packs.get(`${SYSTEM_ID}.${packId}`);
  if (!pack) return;
  await unlockPackWhile(pack, async () => {
    const {localize} = langResolvers(await fetchLangPack(language), await fetchLangPack("en"));
    await rebuildCompendiumFromBlueprints(pack, buildSkillPackDocuments({localize}));
  });
}

// Repairs one bilingual Vitner or Religion compendium from the shared blueprints in
// modules/tablet-pack-data.mjs. Not part of the normal startup path: shipped packs
// already contain this data, so this is a GM-triggered repair only.
export async function syncTabletPack(packId, language, tabletType) {
  const pack = game.packs.get(`${SYSTEM_ID}.${packId}`);
  if (!pack) return;
  await unlockPackWhile(pack, async () => {
    const {localize, format} = langResolvers(await fetchLangPack(language), await fetchLangPack("en"));
    await rebuildCompendiumFromBlueprints(pack, buildTabletPackDocuments({localize, format, tabletType}));
  });
}

// Manual GM repair entry point: rebuilds every knowledge compendium (Skills, Vitner,
// Religion) from the shared blueprints.
export async function repairKnowledgePacks() {
  ui.notifications.info(game.i18n.localize("TRUDVANG.Import.PacksRebuildStarted"));
  let rebuilt = 0;
  for (const {code, packName} of SKILL_PACKS) {
    await syncSkillPack(packName, code);
    rebuilt += 1;
  }
  for (const {code, packName, tabletType} of TABLET_PACKS) {
    await syncTabletPack(packName, code, tabletType);
    rebuilt += 1;
  }
  ui.notifications.info(game.i18n.format("TRUDVANG.Import.PacksRebuilt", {packs: rebuilt}));
}

// Bumped independently of CONTENT_VERSION whenever the knowledge refresh matching or
// scope changes, so worlds that already ran an earlier pass re-run it exactly once.
// 17: first scope covering actor-embedded abilities and legacy copies without
// compendium provenance (items bought through the sheet were invisible to earlier runs).
const KNOWLEDGE_SYNC_VERSION = 17;

const normalizedLabel = (value) => String(value ?? "").trim().toLocaleLowerCase();

// One-time refresh of ability knowledge items living in the world: presentation text is
// healed against the current compendium contents and stale provenance ids are stamped
// or repointed at the current documents. Numeric rule state (levels, bonuses) stays
// untouched. This must cover far more than packs imports:
// - knowledge bought through the sheet (adjustCatalogKnowledge) is created without any
//   compendium provenance and lives embedded in actors, not in game.items;
// - pre-catalogue creations may even lack system.catalogId and are only recognisable
//   by their name and kind.
export async function syncImportedKnowledgeItems({force = false} = {}) {
  try {
    const done = Number(game.settings.get(SYSTEM_ID, "knowledgeSyncVersion") || 0);
    if (!force && done >= KNOWLEDGE_SYNC_VERSION) return false;

    // Index pack documents by catalogId (preferring the active language), plus every known
    // label across languages: labels detect user-renamed copies and also identify legacy
    // items that never carried a catalogId.
    const currentLocale = activeLanguage();
    const documentsByCatalog = new Map();
    const namesByCatalog = new Map();
    const documentsByName = new Map();
    for (const {code, packName} of SKILL_PACKS) {
      const pack = game.packs.get(`${SYSTEM_ID}.${packName}`);
      if (!pack) continue;
      for (const document of await pack.getDocuments()) {
        const catalogId = document.system?.catalogId;
        if (!catalogId) continue;
        if (!documentsByCatalog.has(catalogId) || code === currentLocale) documentsByCatalog.set(catalogId, document);
        if (!namesByCatalog.has(catalogId)) namesByCatalog.set(catalogId, new Set());
        namesByCatalog.get(catalogId).add(document.name);
        const nameKey = normalizedLabel(document.name);
        if (!documentsByName.has(nameKey)) documentsByName.set(nameKey, document);
      }
    }

    // Match every owned copy: unowned world items plus each ability embedded in an actor.
    const targets = [];
    const collect = (container) => {
      const items = container.items ?? container;
      for (const item of items) {
        if (item.type !== "ability") continue;
        let match = null;
        if (item.system.catalogId) {
          match = documentsByCatalog.get(item.system.catalogId) ?? null;
        } else {
          const candidate = documentsByName.get(normalizedLabel(item.name));
          // Kind equality keeps same-named custom entries of other kinds untouched.
          if (candidate && candidate.system.kind === item.system.kind) match = candidate;
        }
        if (match) targets.push({item, match});
      }
    };
    collect(game.items);
    for (const actor of game.actors) collect(actor);

    let updated = 0;
    for (const {item, match} of targets) {
      const changes = {
        img: match.img,
        "system.description": match.system.description,
        "system.summary": match.system.summary,
        "_stats.compendiumSource": match.uuid
      };
      if (!item.system.catalogId) changes["system.catalogId"] = match.system.catalogId;
      if (item.getFlag("core", "sourceId")) changes["flags.core.sourceId"] = match.uuid;
      // Leave player-renamed copies alone apart from artwork and wording refresh.
      if (namesByCatalog.get(match.system.catalogId)?.has(item.name)) changes.name = match.name;
      // Skip fields that already carry the target value so healthy content is not rewritten.
      for (const key of Object.keys(changes)) {
        if (String(foundry.utils.getProperty(item, key) ?? "") === String(changes[key] ?? "")) delete changes[key];
      }
      if (!Object.keys(changes).length) continue;
      await item.update(changes);
      updated++;
    }
    await game.settings.set(SYSTEM_ID, "knowledgeSyncVersion", KNOWLEDGE_SYNC_VERSION);
    if (updated) ui.notifications.info(game.i18n.format("TRUDVANG.Notification.KnowledgeSynced", {count: updated}));
    return updated > 0;
  } catch (error) {
    console.error("Trudvang Chronicles | Knowledge import sync failed", error);
    return false;
  }
}

export async function importStarterContent({force = false} = {}) {
  try {
    const installed = Number(game.settings.get(SYSTEM_ID, "starterContentVersion") || 0);
    const importedLocale = String(game.settings.get(SYSTEM_ID, "starterContentLocale") || "");
    const currentLocale = activeLanguage();
    if (!force && installed >= CONTENT_VERSION && importedLocale === currentLocale) return false;

    ui.notifications.info(game.i18n.localize("TRUDVANG.Import.Started"));
    const response = await fetch(`systems/${SYSTEM_ID}/data/starter-content.json`);
    if (!response.ok) throw new Error(`Starter content request failed: ${response.status}`);
    const source = await response.json();

    const folderKeys = Object.values(source.folders).map(config => config.nameKey);
    const docKeys = [
      ...source.items.filter(entry => !["tablet", "spell", "divineFeat"].includes(entry.type)).map(entry => entry.nameKey),
      ...source.tables.map(entry => entry.nameKey),
      ...source.actors.flatMap(entry => [entry.nameKey, ...(entry.items ?? []).map(child => child.nameKey)])
    ];
    const translationsByKey = await loadTranslations([...folderKeys, ...docKeys]);

    const folders = {};
    for (const [slug, config] of Object.entries(source.folders)) folders[slug] = await upsertFolder(slug, config, translationsByKey.get(config.nameKey));

    const {created, updated} = await upsertBaseItems(source, folders, translationsByKey);

    const obsoleteCatalog = game.items.filter(item => item.getFlag(SYSTEM_ID, "catalogId"));
    if (obsoleteCatalog.length) await Item.deleteDocuments(obsoleteCatalog.map(item => item.id));
    const catalogDocuments = TABLET_CATALOG.flatMap(tablet => [tabletItemData(tablet), ...tablet.powers.map(power => powerItemData(power, tablet))]);
    await Item.createDocuments(catalogDocuments.map(document => ({...document, folder: folders.magic?.id})));

    await rebuildTables(source, folders, translationsByKey);
    await upsertActors(source, folders, translationsByKey);

    const obsoleteWorldKnowledge = game.items.filter(item => item.type === "ability" && item.system.catalogId === "vitnerWeavers");
    if (obsoleteWorldKnowledge.length) await Item.deleteDocuments(obsoleteWorldKnowledge.map(item => item.id));

    // Refresh world ability texts (descriptions/summaries) against the current localization.
    // Each field is healed independently: a legacy item can carry an up-to-date description
    // with an empty/collapsed summary (the pre-0.2.8 shape), which must still be repaired.
    const catalogText = (catalogId, suffix) => {
      const key = `TRUDVANG.Content.Ability.${catalogId}.${suffix}`;
      const text = game.i18n.localize(key);
      return text === key ? "" : text;
    };
    const abilityTextChanges = (item) => {
      const description = catalogText(item.system.catalogId, "Description");
      const summary = catalogText(item.system.catalogId, "Summary");
      const changes = {};
      if (description && description !== item.system.description) changes["system.description"] = description;
      if (summary && (!item.system.summary || item.system.summary === item.system.description)) changes["system.summary"] = summary;
      return Object.keys(changes).length ? changes : null;
    };
    for (const item of game.items.filter(item => item.type === "ability" && item.system.catalogId)) {
      const changes = abilityTextChanges(item);
      if (changes) await item.update(changes);
    }

    // Fold orphaned ability copies (no catalogId but an official label) into the catalog:
    // the first occurrence gets linked, exact duplicates of a linked knowledge are removed.
    const labelIndex = new Map();
    for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
      for (const discipline of disciplines) {
        const entries = [
          {...discipline, kind: "discipline", parentSkill: skillKey},
          ...discipline.specialties.map(specialty => ({...specialty, kind: "specialty", parentSkill: skillKey, parentDiscipline: discipline.name}))
        ];
        for (const entry of entries) {
          for (const language of ["fr", "en"]) {
            const name = resolveNested(await fetchLangPack(language), entry.label);
            if (name) labelIndex.set(normalizeLabel(name), entry);
          }
        }
      }
    }
    for (const scope of [game.items, ...game.actors.map(actor => actor.items)]) {
      const linked = new Map([...scope].filter(item => item.type === "ability" && item.system.catalogId).map(item => [item.system.catalogId, item]));
      for (const item of [...scope]) {
        if (item.type !== "ability" || item.system.catalogId) continue;
        const entry = labelIndex.get(normalizeLabel(item.name));
        if (!entry) continue;
        const canonical = linked.get(entry.id);
        if (canonical && canonical.id !== item.id) { await item.delete(); continue; }
        const changes = {"system.catalogId": entry.id, "system.kind": entry.kind, "system.parentSkill": entry.parentSkill, "system.rollBonus": entry.rollBonus ?? (entry.kind === "specialty" ? 2 : 1)};
        if (entry.parentDiscipline) changes["system.parentDiscipline"] = entry.parentDiscipline;
        await item.update(changes);
        linked.set(entry.id, item);
      }
    }

    const catalogById = new Map(catalogDocuments.map(document => [document.system.catalogId, document]));
    for (const actor of game.actors) {
      const updates = actor.items.map(item => {
        const match = catalogById.get(item.system.catalogId || item.getFlag(SYSTEM_ID, "catalogId"));
        if (match) {
          const changes = {_id: item.id};
          if (match.system.description !== item.system.description) changes["system.description"] = match.system.description;
          if (match.system.source !== item.system.source) changes["system.source"] = match.system.source;
          return Object.keys(changes).length > 1 ? changes : null;
        }
        if (item.type !== "ability") return null;
        const changes = abilityTextChanges(item);
        return changes ? {_id: item.id, ...changes} : null;
      }).filter(Boolean);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

    // The Skills compendiums ship as compiled packs with the system and update with it;
    // they are no longer rebuilt at runtime (see syncSkillPack / repairKnowledgePacks).

    // Persist the version only after every repair step succeeded, so a partial
    // failure re-runs the whole pass on the next world entry.
    await game.settings.set(SYSTEM_ID, "starterContentVersion", CONTENT_VERSION);
    await game.settings.set(SYSTEM_ID, "starterContentLocale", currentLocale);
    ui.notifications.info(game.i18n.format("TRUDVANG.Import.Complete", {
      items: updated + created + catalogDocuments.length,
      tables: source.tables.length,
      actors: source.actors.length
    }));
    return true;
  } catch (error) {
    console.error("Trudvang Chronicles | Starter content import failed", error);
    ui.notifications.error(game.i18n.localize("TRUDVANG.Import.Failed"));
    return false;
  }
}
