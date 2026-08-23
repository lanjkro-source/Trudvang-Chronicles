import { TABLET_CATALOG, tabletItemData, powerItemData } from "./tablet-catalog.mjs";
import { TRUDVANG } from "./config.mjs";
import { deterministicId } from "./skill-pack-data.mjs";

// Shared, environment-agnostic source of truth for the bilingual Vitner and Religion
// compendium packs. Consumed by tools/build-packs.mjs (Node, at package build time) and
// by the runtime repair path in modules/content-importer.mjs so both always produce
// identical documents. This module must stay free of any Foundry or browser global.
//
// Pack layout mirrors the books:
// - Vitner packs: the list of vitner tablets at the root, then one folder per tablet
//   containing the spells inscribed on that tablet.
// - Religion packs: one folder per religion, containing that religion's holy tablets
//   plus a subfolder per tablet holding its divine powers.

export const TABLET_PACKS = [
  {code: "en", packName: "vitner-en", label: "Vitner", tabletType: "vitner"},
  {code: "fr", packName: "vitner-fr", label: "Vitner", tabletType: "vitner"},
  {code: "en", packName: "religion-en", label: "Religion", tabletType: "holy"},
  {code: "fr", packName: "religion-fr", label: "Religion", tabletType: "holy"}
];

function folderDocument({id, name, parent = null, sort}) {
  return {
    _key: `!folders!${id}`,
    _id: id,
    name,
    type: "Item",
    folder: parent,
    sorting: "a",
    sort,
    description: "",
    flags: {},
    ownership: {default: 0}
  };
}

// Attaches compile-only identity fields to an item blueprint produced by
// tabletItemData/powerItemData.
function packItem(data, {id, folder = null, sort}) {
  return {...data, _key: `!items!${id}`, _id: id, folder, sort, ownership: {default: 0}};
}

// Builds every Folder and Item of one tablet compendium as plain source objects.
// localize(keyPath[, fallback]) resolves a localization key; format(key, params)
// interpolates {placeholders}. With strict=true a missing essential name throws —
// the package build must never ship an incomplete pack.
export function buildTabletPackDocuments({localize, format, tabletType, strict = false} = {}) {
  if (typeof localize !== "function" || typeof format !== "function") throw new Error("buildTabletPackDocuments requires localize(keyPath) and format(key, params) callbacks");
  if (!["vitner", "holy"].includes(tabletType)) throw new Error(`Unknown tablet type: ${tabletType}`);
  const resolvers = {localize, format};
  const tablets = TABLET_CATALOG.filter(tablet => tablet.tabletType === tabletType);
  if (!tablets.length) throw new Error(`No ${tabletType} tablets found in the catalogue`);

  const folders = [];
  const items = [];
  let sortCounter = 0;
  const nextSort = () => (sortCounter += 1) * 100000;

  // One deterministic id per document; ids must never change between releases or
  // imported copies and compendium links in user worlds go stale.
  const tabletItemId = tablet => deterministicId(`tablet:${tablet.id}`);
  const powerItemId = power => deterministicId(`power:${power.id}`);
  const vitnerFolderId = tablet => deterministicId(`folder:vitner-tablet:${tablet.id}`);
  const holyTabletFolderId = tablet => deterministicId(`folder:holy-tablet:${tablet.id}`);

  if (tabletType === "vitner") {
    // Root level: the full tablet list, then one spell folder per tablet.
    for (const tablet of tablets) {
      items.push(packItem(tabletItemData(tablet, resolvers), {id: tabletItemId(tablet), sort: nextSort()}));
    }
    for (const tablet of tablets) {
      const name = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
      if (!name) {
        if (strict) throw new Error(`Missing Name text for tablet "${tablet.id}"`);
        continue;
      }
      const folderId = vitnerFolderId(tablet);
      folders.push(folderDocument({id: folderId, name, sort: nextSort()}));
      for (const power of tablet.powers) {
        items.push(packItem(powerItemData(power, tablet, resolvers), {id: powerItemId(power), folder: folderId, sort: nextSort()}));
      }
    }
    return {folders, items};
  }

  // Holy tablets: one folder per religion; inside it the religion's tablets plus a
  // subfolder per tablet holding its divine powers.
  const religions = [...new Set(tablets.map(tablet => tablet.religion).filter(Boolean))];
  for (const religion of religions) {
    const labelKey = TRUDVANG.religions[religion]?.label ?? `TRUDVANG.Religion.${religion}`;
    const resolvedLabel = localize(labelKey, "");
    if (!resolvedLabel && strict) throw new Error(`Missing religion label "${labelKey}"`);
    const religionName = resolvedLabel || religion;
    const religionFolder = deterministicId(`folder:religion:${religion}`);
    folders.push(folderDocument({id: religionFolder, name: religionName, sort: nextSort()}));
    for (const tablet of tablets.filter(candidate => candidate.religion === religion)) {
      items.push(packItem(tabletItemData(tablet, resolvers), {id: tabletItemId(tablet), folder: religionFolder, sort: nextSort()}));
      const name = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
      if (!name) {
        if (strict) throw new Error(`Missing Name text for tablet "${tablet.id}"`);
        continue;
      }
      const folderId = holyTabletFolderId(tablet);
      folders.push(folderDocument({id: folderId, name, parent: religionFolder, sort: nextSort()}));
      for (const power of tablet.powers) {
        items.push(packItem(powerItemData(power, tablet, resolvers), {id: powerItemId(power), folder: folderId, sort: nextSort()}));
      }
    }
  }
  return {folders, items};
}
