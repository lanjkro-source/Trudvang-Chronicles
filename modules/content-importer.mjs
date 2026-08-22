import { powerItemData, TABLET_CATALOG, tabletItemData } from "./tablet-catalog.mjs";

const CONTENT_VERSION = 7;
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

async function getFolder(folderKey, type) {
  const name = game.i18n.localize(folderKey);
  return game.folders.find(folder => folder.type === type && folder.name === name)
    ?? Folder.create({name, type, sorting: "a"});
}

export async function importStarterContent() {
  const installed = Number(game.settings.get(SYSTEM_ID, "starterContentVersion") || 0);
  if (installed >= CONTENT_VERSION) return;
  ui.notifications.info(game.i18n.localize("TRUDVANG.Import.Started"));
  try {
    const response = await fetch(`systems/${SYSTEM_ID}/data/starter-content.json`);
    if (!response.ok) throw new Error(`Starter content request failed: ${response.status}`);
    const source = await response.json();
    const folders = {};
    for (const [slug, config] of Object.entries(source.folders)) folders[slug] = await getFolder(config.nameKey, config.type);

    const fullInstall = installed === 0;
    if (!fullInstall) {
      const obsoleteCatalog = game.items.filter(item => item.getFlag(SYSTEM_ID, "catalogId"));
      if (obsoleteCatalog.length) await Item.deleteDocuments(obsoleteCatalog.map(item => item.id));
    }
    const baseEntries = fullInstall ? source.items.filter(entry => !["tablet", "spell", "divineFeat"].includes(entry.type)) : [];
    const items = baseEntries.map(entry => {
      const data = localizeTree(entry);
      data.folder = folders[entry.folder]?.id;
      return data;
    });
    const catalogDocuments = TABLET_CATALOG.flatMap(tablet => [tabletItemData(tablet), ...tablet.powers.map(power => powerItemData(power, tablet))]);
    for (const document of catalogDocuments) items.push({...document, folder: folders.magic?.id});
    const createdItems = await Item.createDocuments(items);

    if (!fullInstall) {
      const legacyNames = new Set(LEGACY_TABLE_KEYS.map(key => game.i18n.localize(`TRUDVANG.Content.Table.${key}.Name`)));
      const obsolete = game.tables.filter(table => legacyNames.has(table.name) || ["fatal-magic-effects", "fatal-failure-effects"].includes(table.getFlag(SYSTEM_ID, "starterId")));
      if (obsolete.length) await RollTable.deleteDocuments(obsolete.map(table => table.id));
    }

    const tables = source.tables.map(entry => {
      const data = localizeTree(entry);
      data.folder = folders[entry.folder]?.id;
      return data;
    });
    const createdTables = await RollTable.createDocuments(tables);

    const actors = (fullInstall ? source.actors : []).map(entry => {
      const data = localizeTree(entry);
      data.folder = folders[entry.folder]?.id;
      return data;
    });
    const createdActors = await Actor.createDocuments(actors);

    const obsoleteWorldKnowledge = game.items.filter(item => item.type === "ability" && item.system.catalogId === "vitnerWeavers");
    if (obsoleteWorldKnowledge.length) await Item.deleteDocuments(obsoleteWorldKnowledge.map(item => item.id));
    for (const actor of game.actors) {
      const obsolete = actor.items.filter(item => item.type === "ability" && item.system.catalogId === "vitnerWeavers");
      if (obsolete.length) await actor.deleteEmbeddedDocuments("Item", obsolete.map(item => item.id));
    }

    const catalogById = new Map(catalogDocuments.map(document => [document.system.catalogId, document]));
    for (const actor of game.actors) {
      const updates = actor.items.map(item => {
        const source = catalogById.get(item.system.catalogId || item.getFlag(SYSTEM_ID, "catalogId"));
        return source ? {_id: item.id, "system.description": source.system.description, "system.source": source.system.source} : null;
      }).filter(Boolean);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

    await game.settings.set(SYSTEM_ID, "starterContentVersion", CONTENT_VERSION);
    ui.notifications.info(game.i18n.format("TRUDVANG.Import.Complete", {
      items: createdItems.length,
      tables: createdTables.length,
      actors: createdActors.length
    }));
  } catch (error) {
    console.error("Trudvang Chronicles | Starter content import failed", error);
    ui.notifications.error(game.i18n.localize("TRUDVANG.Import.Failed"));
  }
}
