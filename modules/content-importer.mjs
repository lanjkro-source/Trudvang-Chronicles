import { powerItemData, TABLET_CATALOG, tabletItemData } from "./tablet-catalog.mjs";
import { TRUDVANG } from "./config.mjs";
import { buildSkillPackDocuments, SKILL_PACKS, toCreateData } from "./skill-pack-data.mjs";
import { TABLET_PACKS, buildTabletPackDocuments } from "./tablet-pack-data.mjs";
import { JOURNAL_FOLDERS, journalDocuments } from "./journal-catalog.mjs";

const CONTENT_VERSION = 28;
const SYSTEM_ID = "trudvang-chronicles";
const LEGACY_TABLE_KEYS = ["StormlanderMale", "StormlanderFemale", "ExtractEffect", "FearLevel", "StartingExperience", "RandomExtract", "TraitCost", "DisciplineCost", "WeaponDamage", "RaceStats"];
const REMOVED_STARTER_ITEM_KEYS = new Set([
  "TRUDVANG.Content.Item.ThrowingAxe",
  "TRUDVANG.Content.Item.Rope",
  "TRUDVANG.Content.Item.Torch",
  "TRUDVANG.Content.Item.AdventureKit"
]);

function destinationFolder(entry) {
  if (entry.folderOverride) return entry.folderOverride;
  if (entry.type === "weapon") return {
    oneHandedLight: "weaponsLight",
    oneHandedHeavy: "weaponsHeavy",
    twoHanded: "weaponsTwoHanded",
    ranged: "weaponsRanged"
  }[entry.system?.category] ?? entry.folder;
  if (entry.type === "shield") return "shields";
  if (entry.type === "gear" && (entry.nameKey.includes("Kit") || entry.nameKey.endsWith("AdventureKit.Name"))) return "packages";
  return entry.folder;
}

const STARTER_IMAGES = {
  Seax: "icons/weapons/thrown/dagger-simple.webp", HringSeax: "icons/weapons/thrown/dagger-ringed-steel.webp", Glaaf: "icons/weapons/swords/shortsword-guard.webp", Klubb: "icons/weapons/maces/mace-spiked-simple.webp", KrumSwerd: "icons/weapons/swords/scimitar-guard-brown.webp", LillSpjot: "icons/weapons/polearms/javelin-simple.webp", NagliKlubb: "icons/weapons/maces/mace-spiked-cube-wood.webp", SplitAxi: "icons/weapons/axes/axe-battle-simple.webp", Stafur: "icons/weapons/polearms/spear-simple-engraved.webp",
  BattleAxe: "icons/weapons/axes/axe-battle-blackened.webp", BeardedAxe: "icons/weapons/axes/axe-crooked-blackened.webp", BardaFaldir: "icons/weapons/maces/flail-cube-grey.webp", BardaHammri: "icons/weapons/hammers/hammer-war-rounding.webp", BardaKlot: "icons/weapons/maces/flail-ball-grey.webp", BardaMakir: "icons/weapons/maces/mace-flanged-steel-grey.webp", BardaSwerd: "icons/weapons/swords/sword-broad-worn.webp", BastjurKedja: "icons/weapons/maces/flail-spiked-grey.webp", Broadsword: "icons/weapons/swords/sword-broad-worn.webp", DropiAxi: "icons/weapons/axes/axe-battle-broad-nooks.webp", Hakk: "icons/weapons/thrown/throwing-pick.webp", Miekka: "icons/weapons/swords/sword-runed-glowing.webp", StaafSpjot: "icons/weapons/polearms/spear-flared-steel.webp", StakkSwerd: "icons/weapons/swords/sword-guard-worn.webp", StjornMakir: "icons/weapons/maces/flail-morning-star.webp",
  BreidSpjot: "icons/weapons/polearms/glaive-simple.webp", LongSpear: "icons/weapons/polearms/pike-flared-brown.webp", TwoHandedAxe: "icons/weapons/axes/axe-double-simple-brown.webp", TveiFaldir: "icons/weapons/maces/flail-spiked.webp", TveiHakk: "icons/weapons/polearms/halberd-crescent-steel.webp", TveiHammri: "icons/weapons/hammers/hammer-war-rounding.webp", TveiKlubb: "icons/weapons/maces/mace-spiked-steel-wood.webp", TwoHandedSword: "icons/weapons/swords/greatsword-guard.webp",
  HuntingBow: "icons/weapons/bows/shortbow-recurve.webp", Longbow: "icons/weapons/bows/longbow-recurve-brown.webp", TveBogi: "icons/weapons/bows/bow-ornamental-carved-brown.webp", Slingu: "icons/weapons/thrown/throwing-stone.webp", StafurSlingu: "icons/weapons/thrown/throwing-rock.webp", Crossbow: "icons/weapons/crossbows/crossbow-heavy.webp", VolkKrossbogur: "icons/weapons/crossbows/crossbow-simple-brown.webp", TunkurKrossbogur: "icons/weapons/crossbows/crossbow-heavy-black.webp",
  SmallShield: "icons/equipment/shield/buckler-wooden-boss-brown.webp", MediumShield: "icons/equipment/shield/round-wooden-boss-steel-brown.webp", LargeShield: "icons/equipment/shield/kite-wooden-boss-steel-brown.webp", SmallFurShield: "icons/equipment/shield/buckler-boss-iron-wood-brown.webp", MediumFurShield: "icons/equipment/shield/round-wooden-reinforced-boss-steel.webp", LargeFurShield: "icons/equipment/shield/kite-wooden-boss-steel-red.webp", SmallMetalShield: "icons/equipment/shield/buckler-iron-cross-gray.webp", MediumMetalShield: "icons/equipment/shield/heater-steel-gray.webp", LargeMetalShield: "icons/equipment/shield/scutum-steel-worn.webp",
  Argmurkla: "icons/consumables/potions/conical-mushroom-poison-red.webp", Gaveblom: "icons/consumables/plants/leaf-herb-green.webp", FrostboarFat: "icons/consumables/potions/bottle-bulb-corked-green.webp", Grindblom: "icons/consumables/plants/leaf-hastate-white-green.webp", Manetter: "icons/consumables/potions/bottle-conical-corked-labeled-skull-poison-green.webp", Pustartobak: "icons/consumables/plants/dried-herb-bundle-brown.webp", DragonBlood: "icons/consumables/potions/bottle-round-corked-red.webp", Svartljunghed: "icons/consumables/plants/grass-bundle-green.webp", Tornrot: "icons/consumables/plants/dried-stem-vine-root-bramble-brown.webp", Trollilles: "icons/consumables/plants/leaf-maple-green-purple.webp", Tungelin: "icons/consumables/plants/leaf-serrated-pink.webp"
};

const PACKAGE_IMAGES = {
  Armament: "icons/containers/bags/case-simple-leather-brown.webp", Craft: "icons/containers/bags/pack-leather-brown.webp", Burglary: "icons/containers/bags/pack-leather-black-brown.webp", Camping: "icons/containers/bags/pack-simple-leather-fur-tan.webp", Hunting: "icons/containers/bags/pack-leather-strapped-tan.webp", Writing: "icons/containers/bags/case-scroll-leather-tan.webp", Music: "icons/containers/bags/pack-engraved-leather-tan.webp", Fishing: "icons/containers/bags/duffel-simple-leather.webp", Healing: "icons/containers/bags/case-embossed-leather-tan.webp"
};

function starterImage(entry) {
  const key = entry.nameKey.split(".").at(-2).replace(/Thrown$/, "");
  if (STARTER_IMAGES[key]) return STARTER_IMAGES[key];
  const packageType = Object.keys(PACKAGE_IMAGES).find(type => key.startsWith(type));
  if (packageType) return PACKAGE_IMAGES[packageType];
  if (entry.type === "armor") return entry.system?.heft <= 3
    ? "icons/equipment/chest/breastplate-collared-leather-brown.webp"
    : entry.system?.heft <= 8
      ? "icons/equipment/chest/breastplate-banded-steel-grey.webp"
      : "icons/equipment/chest/breastplate-cuirass-steel-grey.webp";
  return entry.img;
}

function starterSourceKey(entry) {
  if (entry.type === "weapon") return {
    oneHandedLight: "TRUDVANG.Content.Source.Rulebook111",
    oneHandedHeavy: "TRUDVANG.Content.Source.Rulebook112",
    twoHanded: "TRUDVANG.Content.Source.Rulebook114",
    ranged: "TRUDVANG.Content.Source.Rulebook116"
  }[entry.system?.category];
  if (entry.type === "shield") return "TRUDVANG.Content.Source.Rulebook118";
  if (entry.type === "armor") return "TRUDVANG.Content.Source.Rulebook119";
  const key = entry.nameKey.split(".").at(-2);
  if (["SlaveClothes", "PoorClothes", "AverageClothes", "RichClothes", "RoyalAttire"].includes(key)) return "TRUDVANG.Content.Source.Rulebook126";
  if (key.includes("Kit") || key === "AdventureKit") return "TRUDVANG.Content.Source.Rulebook127";
  return entry.system?.sourceKey;
}

function localizedField(itemKey, field) {
  const key = `TRUDVANG.Content.Item.${itemKey}.${field}`;
  const value = game.i18n.localize(key);
  return value === key ? undefined : value;
}

function fallbackDescription(entry) {
  const itemKey = entry.nameKey.split(".").at(-2);
  const direct = game.i18n.localize(`TRUDVANG.Content.ItemDescription.${itemKey}`);
  if (direct !== `TRUDVANG.Content.ItemDescription.${itemKey}`) return direct;
  const key = entry.type === "weapon" ? `Weapon.${entry.system?.category}`
    : entry.type === "shield" ? "Shield"
      : entry.type === "armor" ? "Armor"
        : entry.type === "potion" ? "Extract"
          : itemKey.includes("Kit") || itemKey === "AdventureKit" ? `Package.${itemKey.replace(/(Small|Ordinary|Large|Basic|Standard|Complete|AdventureKit).*$/, "")}`
            : "Gear";
  const localized = game.i18n.localize(`TRUDVANG.Content.GenericDescription.${key}`);
  return localized === `TRUDVANG.Content.GenericDescription.${key}` ? "" : localized;
}

/**
 * Return the book paragraph recorded for a starter item, when one exists.
 * Throwing copies deliberately share the source paragraph of their base weapon.
 */
function documentedDescription(entry) {
  const itemKey = entry.nameKey?.split(".").at(-2)?.replace(/Thrown$/, "");
  if (!itemKey) return undefined;
  const baseKey = itemKey.replace(/(Small|Ordinary|Large)$/, "");
  const path = `TRUDVANG.Content.ItemDescription.${baseKey}`;
  const description = game.i18n.localize(path);
  if (description === path) return undefined;
  const size = itemKey.match(/(Small|Ordinary|Large)$/)?.[1];
  if (!size) return description;
  const penaltyPath = `TRUDVANG.Content.PackagePenalty.${size}`;
  const penalty = game.i18n.localize(penaltyPath);
  const availabilityPath = `TRUDVANG.Content.PackageAvailability.${size}`;
  const availability = game.i18n.localize(availabilityPath);
  const additions = [
    penalty === penaltyPath ? "" : penalty,
    availability === availabilityPath ? "" : availability
  ].filter(Boolean);
  return additions.length ? `${description}\n\n${additions.join("\n\n")}` : description;
}

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
const isLegacyWorldMagicCatalogItem = (item) => ["tablet", "spell", "divineFeat"].includes(item.type)
  && Boolean(item.system?.catalogId || flagOf(item, "catalogId"));
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

async function upsertFolder(slug, config, translations, parent) {
  const localized = game.i18n.localize(config.nameKey);
  const legacySlugs = {equipment: ["gear"], protections: ["armor"]};
  const existing = game.folders.find(folder => folder.type === config.type && flagOf(folder, "starterId") === slug)
    ?? game.folders.find(folder => folder.type === config.type && legacySlugs[slug]?.includes(flagOf(folder, "starterId")))
    ?? game.folders.find(folder => folder.type === config.type && !flagOf(folder, "starterId") && translations.has(folder.name));
  if (existing) {
    const update = {[`flags.${SYSTEM_ID}.starterId`]: slug, folder: parent?.id ?? null};
    if (existing.name !== localized) update.name = localized;
    await existing.update(update);
  }
  const canonical = existing ?? await Folder.create({name: localized, type: config.type, folder: parent?.id ?? null, sorting: "a", flags: {[SYSTEM_ID]: {starterId: slug}}});

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
  for (const field of ["description", "source", "summary", "effect", "appearance", "preparation", "usage", "efficacy", "application", "duration"]) {
    if (payload.system?.[field] !== undefined) update[`system.${field}`] = payload.system[field];
  }
  return update;
}

async function upsertBaseItems(source, folders, translationsByKey) {
  const skippedTypes = ["tablet", "spell", "divineFeat"];
  const byKey = new Map(game.items.filter(item => flagOf(item)).map(item => [flagOf(item), item]));
  const obsolete = [...byKey.values()].filter(item => REMOVED_STARTER_ITEM_KEYS.has(flagOf(item)));
  if (obsolete.length) await Item.deleteDocuments(obsolete.map(item => item.id));
  let updated = 0;
  let created = 0;
  for (const entry of source.items.filter(entry => !skippedTypes.includes(entry.type) && !REMOVED_STARTER_ITEM_KEYS.has(starterKey(entry.nameKey)))) {
    const key = starterKey(entry.nameKey);
    const payload = localizeTree(entry);
    delete payload.folderOverride;
    payload.img = starterImage(entry);
    payload.folder = folders[destinationFolder(entry)]?.id;
    const bookDescription = documentedDescription(entry);
    const descriptionKey = entry.nameKey?.replace(/\.Name$/, ".Description");
    const description = descriptionKey ? game.i18n.localize(descriptionKey) : "";
    if (bookDescription) payload.system.description = bookDescription;
    else if (!payload.system?.description && description && description !== descriptionKey) payload.system.description = description;
    if (!payload.system?.description) payload.system.description = fallbackDescription(entry);
    const keyName = entry.nameKey.split(".").at(-2);
    const sourceKey = starterSourceKey(entry);
    if (sourceKey) payload.system.source = game.i18n.localize(sourceKey);
    if (entry.type === "potion") {
      for (const field of ["appearance", "preparation", "usage", "effect"]) {
        const value = localizedField(keyName, field[0].toUpperCase() + field.slice(1));
        if (value) payload.system[field] = value;
      }
      payload.system.efficacy ??= {};
      for (const [field, suffix] of Object.entries({mild: "Mild", moderate: "Moderate", strong: "Strong", total: "Total"})) {
        const value = localizedField(keyName, suffix);
        if (value) payload.system.efficacy[field] = value;
      }
    }
    const translations = translationsByKey.get(entry.nameKey);
    let existing = byKey.get(key)
      // Adopt documents imported before imports were tracked by stable ids.
      ?? game.items.find(item => !flagOf(item) && item.type === entry.type && translations?.has(item.name));
    if (existing) {
      const update = presentationUpdate(payload, key);
      update.folder = payload.folder;
      if (payload.system?.combatSpecialty && !existing.system?.combatSpecialty) update["system.combatSpecialty"] = payload.system.combatSpecialty;
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

// Keep recognized extract copies in character and NPC inventories in the selected language.
// Their rules and quantities remain individual to each inventory.
async function syncActorExtracts(source, translationsByKey) {
  const extracts = source.items.filter(entry => entry.type === "potion");
  const byKey = new Map(extracts.map(entry => [starterKey(entry.nameKey), entry]));
  const byName = new Map(extracts.flatMap(entry => [...(translationsByKey.get(entry.nameKey) ?? [])].map(name => [name, entry])));
  const byUuid = new Map(game.items.filter(item => item.type === "potion" && byKey.has(flagOf(item))).map(item => [item.uuid, byKey.get(flagOf(item))]));
  for (const actor of game.actors) {
    const updates = actor.items.filter(item => item.type === "potion").map(item => {
      const sourceUuid = item.getFlag("core", "sourceId") || item._stats?.compendiumSource;
      const entry = byKey.get(flagOf(item)) ?? byUuid.get(sourceUuid) ?? byName.get(item.name);
      if (!entry) return null;
      const canonical = game.items.find(candidate => candidate.type === "potion" && flagOf(candidate) === starterKey(entry.nameKey));
      if (!canonical) return null;
      const changes = {_id: item.id};
      const translations = translationsByKey.get(entry.nameKey);
      if (translations?.has(item.name) && item.name !== canonical.name) changes.name = canonical.name;
      for (const field of ["description", "source", "effect", "appearance", "preparation", "usage", "application", "duration"]) {
        if (canonical.system[field] !== item.system[field]) changes[`system.${field}`] = canonical.system[field];
      }
      for (const stage of ["mild", "moderate", "strong", "total"]) {
        if (canonical.system.efficacy?.[stage] !== item.system.efficacy?.[stage]) changes[`system.efficacy.${stage}`] = canonical.system.efficacy?.[stage] ?? "";
      }
      return Object.keys(changes).length > 1 ? changes : null;
    }).filter(Boolean);
    if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  }
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

async function upsertJournals() {
  const folders = {};
  const translations = await loadTranslations(Object.values(JOURNAL_FOLDERS).map(config => config.nameKey));
  for (const [slug, config] of Object.entries(JOURNAL_FOLDERS)) folders[slug] = await upsertFolder(slug, config, translations.get(config.nameKey));
  for (const payload of journalDocuments(folders)) {
    const existing = game.journal.find(entry => flagOf(entry) === payload.flags[SYSTEM_ID].starterId);
    if (existing) {
      await existing.update({name: payload.name, folder: payload.folder, [`flags.${SYSTEM_ID}.starterId`]: payload.flags[SYSTEM_ID].starterId});
      if (existing.pages.size) await existing.deleteEmbeddedDocuments("JournalEntryPage", [...existing.pages.keys()]);
      await existing.createEmbeddedDocuments("JournalEntryPage", payload.pages);
    }
    else await JournalEntry.create(payload);
  }
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
function langResolvers(lang, fallback, {isFrench} = {}) {
  const localize = (keyPath, defaultValue = "") => {
    const value = resolveNested(lang, keyPath) ?? resolveNested(fallback, keyPath);
    return typeof value === "string" ? value : defaultValue;
  };
  // Resolve the key to its template before interpolating params, mirroring game.i18n.format.
  const format = (key, params) => {
    const template = resolveNested(lang, key) ?? resolveNested(fallback, key);
    const text = typeof template === "string" ? template : key;
    return Object.entries(params ?? {}).reduce((acc, [name, value]) => acc.split(`{${name}}`).join(String(value)), text);
  };
  return {localize, format, isFrench};
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
    const {localize, format, isFrench} = langResolvers(await fetchLangPack(language), await fetchLangPack("en"), {isFrench: () => language === "fr"});
    await rebuildCompendiumFromBlueprints(pack, buildTabletPackDocuments({localize, format, isFrench, tabletType}));
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
    for (const [slug, config] of Object.entries(source.folders)) folders[slug] = await upsertFolder(slug, config, translationsByKey.get(config.nameKey), config.parent ? folders[config.parent] : undefined);

    const {created, updated} = await upsertBaseItems(source, folders, translationsByKey);
    await syncActorExtracts(source, translationsByKey);

    // TEMPORARY WORLD MIGRATION — documented in docs/development-world-migrations.md.
    // Tablettes and their powers are now supplied by the Vitner/Religion compendiums;
    // remove only the obsolete world-level catalogue copies, never actor-owned magic.
    const obsoleteCatalog = game.items.filter(isLegacyWorldMagicCatalogItem);
    if (obsoleteCatalog.length) await Item.deleteDocuments(obsoleteCatalog.map(item => item.id));
    const catalogDocuments = TABLET_CATALOG.flatMap(tablet => [tabletItemData(tablet), ...tablet.powers.map(power => powerItemData(power, tablet))]);

    await rebuildTables(source, folders, translationsByKey);
    await upsertActors(source, folders, translationsByKey);
    await upsertJournals();

    // TEMPORARY WORLD MIGRATION: before v0.23.0, purpose-built throwing weapons
    // were stored as the throwing specialty itself. Restore their melee profile
    // and mark them with the dedicated flag used by the current attack modes.
    const meleeSpecialtyForCategory = category => ({
      oneHandedLight: "oneHandedLightWeapons",
      oneHandedHeavy: "oneHandedHeavyWeapons",
      twoHanded: "twoHandedWeapons"
    })[category] || "oneHandedLightWeapons";
    const throwingWeaponChanges = item => item.type === "weapon" && item.system.combatSpecialty === "throwingWeapons"
      ? {"system.combatSpecialty": meleeSpecialtyForCategory(item.system.category), "system.isThrowingWeapon": true}
      : null;
    for (const item of game.items) {
      const changes = throwingWeaponChanges(item);
      if (changes) await item.update(changes);
    }
    for (const actor of game.actors) {
      const updates = actor.items.map(item => {
        const changes = throwingWeaponChanges(item);
        return changes ? {_id: item.id, ...changes} : null;
      }).filter(Boolean);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

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

    // Structural classification added with linked Combat Point pools. Only canonical
    // starter weapons are repaired automatically; custom ranged weapons remain a GM choice.
    const starterWeaponPools = new Map([
      ["TRUDVANG.Content.Item.HuntingBow", "bowsSlings"],
      ["TRUDVANG.Content.Item.Longbow", "bowsSlings"],
      ["TRUDVANG.Content.Item.Crossbow", "crossbow"]
    ]);
    for (const actor of game.actors) {
      const updates = actor.items.filter(item => item.type === "weapon" && !item.system.combatSpecialty)
        .map(item => ({_id: item.id, "system.combatSpecialty": starterWeaponPools.get(flagOf(item))}))
        .filter(update => update["system.combatSpecialty"]);
      if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    }

    // The Skills compendiums ship as compiled packs with the system and update with it;
    // they are no longer rebuilt at runtime (see syncSkillPack / repairKnowledgePacks).

    // Persist the version only after every repair step succeeded, so a partial
    // failure re-runs the whole pass on the next world entry.
    await game.settings.set(SYSTEM_ID, "starterContentVersion", CONTENT_VERSION);
    await game.settings.set(SYSTEM_ID, "starterContentLocale", currentLocale);
    ui.notifications.info(game.i18n.format("TRUDVANG.Import.Complete", {
      items: updated + created,
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
