import assert from "node:assert/strict";
import test from "node:test";
import { fatalRollFormula, fatalTableId } from "../modules/rules/fatal-table.mjs";

test("all fatal JO formulas explode at or above the chosen threshold", () => {
  assert.equal(fatalRollFormula(8, -3), "1d10x>=8 - 3");
  assert.equal(fatalRollFormula(9), "1d10x>=9");
  assert.equal(fatalRollFormula(10, 4), "1d10x>=10 + 4");
});

test("both current and legacy starter-table flags are recognized", () => {
  const table = flags => ({getFlag: (namespace, key) => flags[key]});
  assert.equal(fatalTableId(table({starterId: "TRUDVANG.Content.Table.FatalMagic"})), "fatal-magic-effects");
  assert.equal(fatalTableId(table({tableKey: "TRUDVANG.Content.Table.FatalFailure"})), "fatal-failure-effects");
  assert.equal(fatalTableId(table({starterId: "unrelated"})), null);
});

class BaseTable {
  getFlag(namespace, key) { return this.flags?.[key]; }
  getResultsForRoll(value) { return this.results.filter(result => !result.drawn && value >= result.range[0] && value <= result.range[1]); }
  async roll(options) { return {ordinary: true, options}; }
}
globalThis.foundry = {documents: {RollTable: BaseTable}, applications: {api: {DialogV2: {wait: async () => null}}}};
globalThis.canvas = {tokens: {controlled: []}};
globalThis.game = {i18n: {localize: key => key, format: key => key}};
globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
const {TrudvangRollTable} = await import("../modules/documents/roll-table.mjs");

test("fatal table uses a real roll and clamps only result lookup", async () => {
  const table = new TrudvangRollTable();
  table.flags = {starterId: "TRUDVANG.Content.Table.FatalMagic"};
  table.results = [{range: [1, 20]}, {range: [21, 999]}];
  const roll = {total: -5, _evaluated: true};
  assert.deepEqual(await table.roll({roll}), {roll, results: [table.results[0]]});
  assert.deepEqual(table.getResultsForRoll(1200), [table.results[1]]);
});

test("ordinary tables retain Foundry's regular roll path", async () => {
  const table = new TrudvangRollTable();
  table.flags = {starterId: "unrelated"};
  assert.deepEqual(await table.roll(), {ordinary: true, options: {}});
});

test("direct magic-table draws use the selected actor's JO unless changed in the dialog", async () => {
  const table = new TrudvangRollTable();
  table.flags = {starterId: "TRUDVANG.Content.Table.FatalMagic"};
  table.results = [{range: [1, 20]}];
  table.name = "Magic";
  canvas.tokens.controlled = [{actor: {
    name: "Mage",
    selectedVitnerType: {fatalThreshold: 10},
    fatalEffectModifier: () => -2
  }}];
  foundry.applications.api.DialogV2.wait = async options => {
    assert.match(options.content, /value="10" selected/);
    return {threshold: 10, modifier: 3};
  };
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; this._evaluated = false; }
    async evaluate() { this._evaluated = true; this.total = 12; }
  };
  const draw = await table.roll();
  assert.equal(draw.roll.formula, "1d10x>=10 + 3");
  assert.equal(draw.results.length, 1);
  canvas.tokens.controlled = [];
});

test("the divine critical-failure table defaults to JO 9 even for a JO 10 vitner actor", async () => {
  const table = new TrudvangRollTable();
  table.flags = {starterId: "TRUDVANG.Content.Table.FatalFailure"};
  table.results = [{range: [1, 20]}];
  table.name = "Divine";
  canvas.tokens.controlled = [{actor: {
    name: "Priest",
    selectedVitnerType: {fatalThreshold: 10},
    fatalEffectModifier: () => 0
  }}];
  foundry.applications.api.DialogV2.wait = async options => {
    assert.match(options.content, /value="9" selected/);
    return {threshold: 9, modifier: 0};
  };
  assert.equal((await table.roll()).roll.formula, "1d10x>=9");
  canvas.tokens.controlled = [];
});
