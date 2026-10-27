import assert from "node:assert/strict";
import test from "node:test";
import {ensureUtilityMacros} from "../modules/content-importer.mjs";

test("existing GM macros replace the ownership mapping without deprecated per-user deletion syntax", async t => {
  const previous = {game: globalThis.game, foundry: globalThis.foundry, CONST: globalThis.CONST, Macro: globalThis.Macro};
  t.after(() => Object.assign(globalThis, previous));
  class Replacement {
    constructor(value) {this.value = value;}
    static create(value) {return new Replacement(value);}
  }
  globalThis.foundry = {data: {operators: {ForcedReplacement: Replacement}}};
  globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS: {NONE: 0, OWNER: 3}};
  const folders = ["macros", "gm-macros"].map(id => ({id, type: "Macro", name: id,
    ownership: {default: 3, player: 3}, getFlag: () => id,
    async update(data) {
      assert.ok(!JSON.stringify(data).includes("-="));
      if (data.ownership instanceof Replacement) this.ownership = data.ownership.value;
      else if (data.ownership) Object.assign(this.ownership, data.ownership);
    }
  }));
  folders.get = id => folders.find(folder => folder.id === id);
  const macro = {getFlag: () => "trait-situation", ownership: {default: 3, player: 3},
    async update(data) {
      assert.ok(data.ownership instanceof Replacement);
      assert.ok(!JSON.stringify(data).includes("-="));
      this.ownership = data.ownership.value;
      this.folder = data.folder;
    }};
  const created = [];
  globalThis.Macro = {createDocuments: async data => created.push(...data)};
  globalThis.game = {folders, macros: [macro], i18n: {localize: key => key}};
  await ensureUtilityMacros();
  assert.deepEqual(macro.ownership, {default: 0});
  assert.equal(macro.folder, "gm-macros");
  assert.deepEqual(folders.get("gm-macros").ownership, {default: 0});
  assert.equal(created.length, 6);
  const environment = created.find(data => data.flags["trudvang-chronicles"].macro === "request-environment");
  assert.equal(environment.ownership.default, 0);
  assert.equal(environment.folder, "gm-macros");
  const day = created.find(data => data.flags["trudvang-chronicles"].macro === "advance-day");
  assert.equal(day.ownership.default, 0);
  assert.equal(day.folder, "gm-macros");
  assert.equal(day.command, "await game.trudvang.advanceDay();");
  assert.equal(created.find(data => data.flags["trudvang-chronicles"].macro === "request-situation").ownership.default, 0);
  assert.equal(created.find(data => data.flags["trudvang-chronicles"].macro === "generic-damage").ownership.default, 3);
});
