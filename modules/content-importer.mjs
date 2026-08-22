import { powerItemData, TABLET_CATALOG, tabletItemData } from "./tablet-catalog.mjs";

const CONTENT_VERSION = 8;
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

const starterKey = (nameKey) => nameKey.replace(/\.Name$/, "");
const flagOf = (document, key = "starterId") => document.getFlag(SYSTEM_ID, key);

// Names this i18n key takes across shipped languages plus the active one — used to adopt
// documents created before imports were tracked by stable ids.
async function loadTranslations(keys) {
  const langs = [...new Set(["en", "fr", game.i18n.lang()])];
  const packs = [];
  for (const lang of langs) {
    try {
      const response = await fetch(`systems/${SYSTEM_ID}/lang/${lang}.json`);
      if (response.ok) packs.push(await response.json());
    } catch (error) {
      console.warn(`Trudvang Chronicles | Could not load ${lang}.json for content adoption`, error);
    }
  }
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
    return game.folders.get(existing.id);
  }
  return Folder.create({name: localized, type: config.type, sorting: "a", flags: {[SYSTEM_ID]: {starterId: slug}}});
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
    let actor = game.actors.find(candidate => flagOf(candidate, "starterId") === key)
      ?? game.actors.find(candidate => !flagOf(candidate, "starterId") && translations?.has(candidate.name));
    if (!actor) {
      const children = (payload.items ?? []).map(child => ({...child, flags: {[SYSTEM_ID]: {starterId: starterKey(child.nameKey)}}}));
      await Actor.createDocuments([{...payload, items: children, flags: {[SYSTEM_ID]: {starterId: key}}}]);
      continue;
    }
    const update = {img: payload.img, folder: payload.folder, [`flags.${SYSTEM_ID}.starterId`]: key};
    if (!renamedOrCustom(actor, translations)) update.name = payload.name;
    await actor.update(update);

    for (const child of payload.items ?? []) {
      const childKey = starterKey(child.nameKey);
      const childTranslations = translationsByKey.get(child.nameKey);
      const embedded = actor.items.find(item => flagOf(item, "starterId") === childKey)
        ?? actor.items.find(item => !flagOf(item, "starterId") && item.type === child.type && childTranslations?.has(item.name));
      if (embedded) {
        const childUpdate = {img: child.img, [`flags.${SYSTEM_ID}.starterId`]: childKey};
        if (!renamedOrCustom(embedded, childTranslations)) childUpdate.name = child.name;
        if (child.system?.description !== undefined) childUpdate["system.description"] = child.system.description;
        await actor.updateEmbeddedDocuments("Item", [{_id: embedded.id, ...childUpdate}]);
      } else {
        await actor.createEmbeddedDocuments("Item", [{...child, flags: {[SYSTEM_ID]: {starterId: childKey}}}]);
      }
    }
    updated++;
  }
  return updated;
}

export async function importStarterContent({force = false} = {}) {
  const installed = Number(game.settings.get(SYSTEM_ID, "starterContentVersion") || 0);
  const importedLocale = String(game.settings.get(SYSTEM_ID, "starterContentLocale") || "");
  const currentLocale = game.i18n.lang();
  if (!force && installed >= CONTENT_VERSION && importedLocale === currentLocale) return false;

  ui.notifications.info(game.i18n.localize("TRUDVANG.Import.Started"));
  try {
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

    const {created} = await upsertBaseItems(source, folders, translationsByKey);

    const obsoleteCatalog = game.items.filter(item => item.getFlag(SYSTEM_ID, "catalogId"));
    if (obsoleteCatalog.length) await Item.deleteDocuments(obsoleteCatalog.map(item => item.id));
    const catalogDocuments = TABLET_CATALOG.flatMap(tablet => [tabletItemData(tablet), ...tablet.powers.map(power => powerItemData(power, tablet))]);
    await Item.createDocuments(catalogDocuments.map(document => ({...document, folder: folders.magic?.id})));

    await rebuildTables(source, folders, translationsByKey);
    await upsertActors(source, folders, translationsByKey);

    const obsoleteWorldKnowledge = game.items.filter(item => item.type === "ability" && item.system.catalogId === "vitnerWeavers");
    if (obsoleteWorldKnowledge.length) await Item.deleteDocuments(obsoleteWorldKnowledge.map(item => item.id));

    const catalogById = new Map(catalogDocuments.map(document => [document.system.catalogId, document]));
    for (const actor of game.actors) {
      const updates = actor.items.map(item => {
        const match = catalogById.get(item.system.catalogId || item.getFlag(SYSTEM_ID, "catalogId"));
        return match ? {_id: item.id, "system.description": match.system.description, "system.source": match.system.source} : null;
      }).filter(Boolean);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

    await game.settings.set(SYSTEM_ID, "starterContentVersion", CONTENT_VERSION);
    await game.settings.set(SYSTEM_ID, "starterContentLocale", currentLocale);
    ui.notifications.info(game.i18n.format("TRUDVANG.Import.Complete", {
      items: created + catalogDocuments.length,
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
