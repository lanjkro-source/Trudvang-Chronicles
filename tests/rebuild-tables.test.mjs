import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

globalThis.foundry = {data: {operators: {ForcedReplacement: class {static create(value) {return {value};}}}},
  applications: {handlebars: {renderTemplate: async () => ""}}};
globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS: {NONE: 0, OWNER: 3}};

const {importStarterContent, rebuildTables} = await import("../modules/content-importer.mjs");

function runtime(t, {created = []} = {}) {
  const previous = {game: globalThis.game, RollTable: globalThis.RollTable};
  t.after(() => Object.assign(globalThis, previous));
  globalThis.RollTable = {deleteDocuments: async () => {}, createDocuments: async data => {created.push(...data);}};
  globalThis.game = {tables: [], folders: new Map([["characterCreationTables", {id: "folder-1"}]]),
    i18n: {localize: key => key}};
  return created;
}

test("rebuildTables keeps the flags an entry declares, alongside the starter bookkeeping", async t => {
  const created = runtime(t);
  const source = {
    folders: {characterCreationTables: {nameKey: "TRUDVANG.Content.Folder.CharacterCreationTables", type: "RollTable"}},
    tables: [{
      nameKey: "TRUDVANG.Content.Table.StormlanderNames.Name",
      folder: "characterCreationTables",
      formula: "1d30",
      displayRoll: true,
      replacement: false,
      flags: {"trudvang-chronicles": {"starterId": "stormlander-names", "nameTable": true}},
      results: [{type: "text", range: [1, 1], text: "As-",
        flags: {"trudvang-chronicles": {"namePart": "prefix"}}}]
    }]
  };
  await rebuildTables(source, {characterCreationTables: {id: "folder-1", defaultRole: undefined}}, new Map());
  assert.equal(created.length, 1);
  const flags = created[0].flags["trudvang-chronicles"];
  assert.equal(flags.nameTable, true, "the name table flag survives the import");
  assert.equal(flags.tableKey, "TRUDVANG.Content.Table.StormlanderNames", "the table key is recorded");
  assert.equal(flags.starterId, "TRUDVANG.Content.Table.StormlanderNames",
    "the starter id follows the starter key, as for every table");
  assert.equal(created[0].folder, "folder-1");
  assert.equal(created[0].results[0].flags["trudvang-chronicles"].namePart, "prefix",
    "the result metadata survives too");
});

test("rebuildTables localizes the table name and description", async t => {
  const created = runtime(t);
  const source = {
    folders: {characterCreationTables: {nameKey: "TRUDVANG.Content.Folder.CharacterCreationTables", type: "RollTable"}},
    tables: [{
      nameKey: "TRUDVANG.Content.Table.StormlanderNames.Name",
      descriptionKey: "TRUDVANG.Content.Table.StormlanderNames.Description",
      folder: "characterCreationTables",
      formula: "1d30",
      displayRoll: true,
      replacement: false,
      flags: {},
      results: []
    }]
  };
  const translations = new Map([["TRUDVANG.Content.Table.StormlanderNames.Name", new Set(["Noms Stormlanders"])]]);
  globalThis.game.i18n.localize = key => (key === "TRUDVANG.Content.Table.StormlanderNames.Name" ? "Noms Stormlanders" : key);
  await rebuildTables(source, {characterCreationTables: {id: "folder-1", defaultRole: undefined}}, translations);
  assert.equal(created[0].name, "Noms Stormlanders");
  assert.equal(created[0].description, "TRUDVANG.Content.Table.StormlanderNames.Description");
});

test("version 75 refreshes only existing starter archetype and religion pages in place", async t => {
  const previous = globalThis.game;
  t.after(() => {globalThis.game = previous;});
  const locale = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
  const scope = "trudvang-chronicles";
  const changed = new Map();
  const settings = new Map([["starterContentVersion", 74], ["starterContentLocale", "fr"]]);
  const localize = key => get(locale, key) ?? key;
  const format = (key, fields) => localize(key).replace(/\{(\w+)\}/g, (_, field) => fields[field]);
  function journal(id) {
    const name = locale.TRUDVANG.Content.Journal[id].Name;
    return {getFlag:() => `journal-${id}`,
      pages: [
        {id:`${id}-notes`, name:"Notes du MJ", type:"text", text:{content:"notes"},
          update:async () => assert.fail("Extra page must be preserved")},
        {id:`${id}-main`, name, type:"text", text:{content:"previous version"},
          update:async data => changed.set(id, data["text.content"])}
      ]};
  }
  globalThis.game = {i18n:{lang:"fr",localize,format}, journal:["warrior","joaringFaith","human","environment"].map(journal),
    settings:{get:(_scope,key)=>settings.get(key), async set(namespace,key,value) {
      assert.equal(namespace,scope);
      settings.set(key,value);
    }}};
  assert.equal(await importStarterContent(), true);
  assert.equal(settings.get("starterContentVersion"),75);
  assert.deepEqual([...changed.keys()], ["warrior","joaringFaith"]);
  assert.match(changed.get("warrior"), /50 points de création supplémentaires/);
  assert.match(changed.get("joaringFaith"), /<h2>Panthéon<\/h2>/);
  assert.equal(await importStarterContent(),false);
});
