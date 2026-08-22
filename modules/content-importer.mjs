import { powerItemData, TABLET_CATALOG, tabletItemData } from "./tablet-catalog.mjs";
import { TRUDVANG } from "./config.mjs";

const CONTENT_VERSION = 11;
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

// Foundry <=12 exposed game.i18n.lang() as a method, newer versions as a plain property.
function activeLanguage() {
  return typeof game.i18n.lang === "function" ? String(game.i18n.lang()) : String(game.i18n.lang ?? "");
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

// Repairs/refreshes a bilingual Skills compendium through official document APIs, healing
// any stale LevelDB state left behind by earlier NEDB migrations.
async function syncSkillPack(packId, language) {
  const pack = game.packs.get(`${SYSTEM_ID}.${packId}`);
  if (!pack) return;
  const lang = await fetchLangPack(language);
  const text = (keyPath) => {
    const value = resolveNested(lang, keyPath);
    return typeof value === "string" ? value : keyPath;
  };
  const FolderClass = foundry.utils.getDocumentClass("Folder");
  const ItemClass = foundry.utils.getDocumentClass("Item");

  const folderIds = new Map();
  const existingFolders = [...pack.folders.values()];
  const desiredSkillKeys = Object.keys(TRUDVANG.knowledgeTree);
  for (const skillKey of desiredSkillKeys) {
    const name = text(TRUDVANG.skills[skillKey]);
    let folder = existingFolders.find((f) => f.name === name);
    if (!folder) {
      const [created] = await FolderClass.createDocuments([{name, type: "Item", sorting: "a", description: "", flags: {}}], {pack: pack.collection});
      folder = created;
    }
    folderIds.set(skillKey, folder.id);
  }
  const keptFolderIds = new Set(folderIds.values());
  for (const folder of existingFolders) {
    if (!keptFolderIds.has(folder.id)) await folder.delete();
  }

  const blueprints = [];
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    for (const discipline of disciplines) {
      const entries = [{...discipline, kind: "discipline"}, ...discipline.specialties.map(specialty => ({...specialty, kind: "specialty"}))];
      for (const entry of entries) {
        const description = text(`TRUDVANG.Content.Ability.${entry.id}.Description`);
        const summary = text(`TRUDVANG.Content.Ability.${entry.id}.Summary`);
        if (!description || !summary) continue;
        blueprints.push({
          name: text(entry.label),
          type: "ability",
          img: "icons/svg/book.svg",
          folder: folderIds.get(skillKey),
          system: {
            description, summary,
            catalogId: entry.id,
            kind: entry.kind,
            parentSkill: skillKey,
            parentDiscipline: entry.kind === "specialty" ? discipline.name : "",
            level: 0,
            rollBonus: entry.kind === "specialty" ? 2 : 1,
            freeLevels: 0
          },
          flags: {}
        });
      }
    }
  }

  const documents = await pack.getDocuments();
  const byCatalogId = new Map(documents.map(document => [document.system?.catalogId, document]));
  const staleIds = documents.filter(document => !blueprints.some(blueprint => blueprint.system.catalogId === document.system?.catalogId)).map(document => document.id);
  if (staleIds.length) await ItemClass.deleteDocuments(staleIds, {pack: pack.collection});

  const remaining = await pack.getDocuments();
  const survivors = new Map(remaining.map(document => [document.system?.catalogId, document]));
  for (const blueprint of blueprints) {
    const existing = survivors.get(blueprint.system.catalogId);
    if (existing) {
      const changes = {name: blueprint.name, img: blueprint.img, folder: blueprint.folder, "system.description": blueprint.system.description, "system.summary": blueprint.system.summary};
      await existing.update(changes);
    } else {
      await ItemClass.createDocuments([blueprint], {pack: pack.collection});
    }
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
    const catalogText = (catalogId, suffix) => {
      const key = `TRUDVANG.Content.Ability.${catalogId}.${suffix}`;
      const text = game.i18n.localize(key);
      return text === key ? "" : text;
    };
    for (const item of game.items.filter(item => item.type === "ability" && item.system.catalogId)) {
      const description = catalogText(item.system.catalogId, "Description");
      if (!description || description === item.system.description) continue;
      const changes = {"system.description": description};
      if (!item.system.summary || item.system.summary === item.system.description) changes["system.summary"] = catalogText(item.system.catalogId, "Summary");
      await item.update(changes);
    }

    const catalogById = new Map(catalogDocuments.map(document => [document.system.catalogId, document]));
    for (const actor of game.actors) {
      const updates = actor.items.map(item => {
        const match = catalogById.get(item.system.catalogId || item.getFlag(SYSTEM_ID, "catalogId"));
        if (match) return {_id: item.id, "system.description": match.system.description, "system.source": match.system.source};
        if (item.type !== "ability") return null;
        const description = catalogText(item.system.catalogId, "Description");
        if (!description || description === item.system.description) return null;
        const update = {_id: item.id, "system.description": description};
        if (!item.system.summary || item.system.summary === item.system.description) update["system.summary"] = catalogText(item.system.catalogId, "Summary");
        return update;
      }).filter(Boolean);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

    await game.settings.set(SYSTEM_ID, "starterContentVersion", CONTENT_VERSION);
    await game.settings.set(SYSTEM_ID, "starterContentLocale", currentLocale);
    try {
      await syncSkillPack("skills-en", "en");
      await syncSkillPack("skills-fr", "fr");
    } catch (packError) {
      console.error("Trudvang Chronicles | Skills compendium sync failed", packError);
    }
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
