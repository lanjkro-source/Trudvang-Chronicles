import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {rebuildCompendiumFromBlueprints} from "../modules/content-importer.mjs";
import {buildSkillPackDocuments, deterministicId} from "../modules/skill-pack-data.mjs";
import {buildTabletPackDocuments} from "../modules/tablet-pack-data.mjs";
import {findTabletPower} from "../modules/tablet-power-links.mjs";

const french = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const lookup = key => key.split(".").reduce((value, part) => value?.[part], french) ?? "";
const resolvers = {localize: lookup, format: (key, params) => Object.entries(params ?? {})
  .reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), lookup(key)), isFrench: () => true};

test("a tablet and its powers share one folder at the proper religion depth", () => {
  for (const tabletType of ["vitner", "holy"]) {
    const {folders, items} = buildTabletPackDocuments({...resolvers, tabletType, strict: true});
    const folderById = new Map(folders.map(folder => [folder._id, folder]));
    const tablets = items.filter(item => item.type === "tablet");
    const powers = items.filter(item => ["spell", "divineFeat"].includes(item.type));
    assert.equal(tablets.length, tabletType === "vitner" ? 14 : 44);
    for (const tablet of tablets) {
      assert.ok(folderById.has(tablet.folder), `${tablet.system.catalogId} has a folder`);
      const siblings = powers.filter(power => power.system.tabletId === tablet.system.catalogId);
      assert.ok(siblings.length, `${tablet.system.catalogId} has powers`);
      assert.ok(siblings.every(power => power.folder === tablet.folder));
      assert.equal(Boolean(folderById.get(tablet.folder).folder), tabletType === "holy");
      assert.ok(tablet.sort < Math.min(...siblings.map(power => power.sort)));
    }
  }
});

test("rebuilding replaces polluted folders and preserves stable item/folder ids on repeated runs", async () => {
  const before = globalThis.foundry;
  try {
    for (const [name, blueprints] of [
      ["skills-fr", buildSkillPackDocuments({localize: lookup, strict: true})],
      ["religion-fr", buildTabletPackDocuments({...resolvers, tabletType: "holy", strict: true})]
    ]) {
      const folders = new Map([["legacyFolder", {id: "legacyFolder", name: "Duplicate", folder: null}]]);
      const items = new Map([["legacyItem", {id: "legacyItem", folder: "legacyFolder"}]]);
      const pack = {collection: `trudvang-chronicles.${name}`, folders,
        async getDocuments() { return [...items.values()]; }};
      const makeClass = collection => class {
        static async deleteDocuments(ids, options) {
          assert.equal(options.pack, pack.collection);
          ids.forEach(id => collection.delete(id));
        }
        static async createDocuments(data, options) {
          assert.equal(options.pack, pack.collection);
          assert.equal(options.keepId, true);
          if (collection === folders) assert.ok(data.every(entry => !entry.folder || folders.has(entry.folder)));
          for (const entry of data) collection.set(entry._id, {...entry, id: entry._id});
        }
      };
      const FolderClass = makeClass(folders), ItemClass = makeClass(items);
      globalThis.foundry = {utils: {getDocumentClass: type => type === "Folder" ? FolderClass : ItemClass}};
      await rebuildCompendiumFromBlueprints(pack, blueprints);
      await rebuildCompendiumFromBlueprints(pack, blueprints);
      assert.deepEqual(new Set(folders.keys()), new Set(blueprints.folders.map(folder => folder._id)));
      assert.deepEqual(new Set(items.keys()), new Set(blueprints.items.map(item => item._id)));
      assert.ok([...items.values()].every(item => folders.has(item.folder)));
    }
  } finally {
    globalThis.foundry = before;
  }
});

test("a compendium tablet opens the power from its own pack before any world copy", async () => {
  const catalogId = "vitner-flame-craft:burning-hand:2";
  const powerId = deterministicId(`power:${catalogId}`);
  const frenchPower = {id: powerId, system: {catalogId}, name: "Main brûlante"};
  const worldPower = {id: "world", system: {catalogId}, name: "World copy"};
  const packs = new Map([["trudvang-chronicles.vitner-fr", {
    async getDocument(id) { return id === powerId ? frenchPower : null; },
    async getDocuments() { return [frenchPower]; }
  }]]);
  const tablet = {pack: "trudvang-chronicles.vitner-fr", system: {tabletType: "vitner"}};
  assert.equal(await findTabletPower({tablet, catalogId, packs, worldItems: [worldPower], language: "en"}), frenchPower);
});
