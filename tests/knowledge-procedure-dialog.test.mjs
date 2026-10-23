import {test} from "node:test";
import assert from "node:assert/strict";
let choice, cancelled = false, dice = [], messages = [], renders = [];
globalThis.document = {createElement: () => ({set textContent(v) {this.innerHTML = String(v);}})};
globalThis.foundry = {applications: {api: {DialogV2: class {
  static async wait(config) {
    if (cancelled) return config.buttons[1].callback();
    const form = {querySelectorAll: () => Object.entries(choice).map(([name, value]) => ({name,
      type: typeof value === "boolean" ? "checkbox" : typeof value === "number" ? "number" : "text", value, checked: value}))};
    return config.buttons[0].callback(null, {form}, null);
  }
}}, handlebars: {renderTemplate: async (path, data) => {renders.push(data); return "card";}}},
documents: {Actor: class {}, ActiveEffect: class {}}, data: {fields: {}, ActiveEffectTypeDataModel: class {}}};
globalThis.game = {user: {}, i18n: {localize: key => key, format: (key, data) => `${key} ${JSON.stringify(data)}`}};
globalThis.ui = {notifications: {warn() {}}};
globalThis.Roll = class {constructor(formula) {this.formula = formula;} async evaluate() {this.total = dice.shift(); return this;}};
globalThis.ChatMessage = {getSpeaker: () => ({}), create: async data => {messages.push(data); return data;}};
const {performKnowledgeProcedure, knowledgeProcedureDescription} = await import("../modules/knowledge-procedures.mjs");
const actor = {isOwner: true, name: "Artisan", canPerformAction: () => true,
  findRuleKnowledge: id => ({type: "ability", system: {catalogId: id, level: 3}}),
  getAbilityBreakdown: () => ({base: 14, modifierRows: [{label: "Wound", value: -3}], skillLabel: "Care 7"}),
  getSkillValue: () => 7, system: {}};
const item = {type: "ability", actor, system: {catalogId: "hardMaterials"}};
test("a repair uses the actual wound and toolkit modifiers and posts loss dice in the same card", async () => {
  choice = {material: "hardMaterials", tools: -5, modifier: 1}; dice = [20, 4];
  await performKnowledgeProcedure(item);
  assert.equal(renders.at(-1).target, 7);
  assert.match(renders.at(-1).failureConsequence, /RepairDamage/);
  assert.match(renders.at(-1).failureConsequence, /"amount":4/);
  assert.deepEqual(messages.at(-1).rolls.map(r => r.formula), ["1d20", "1d6"]);
});
test("cancel never rolls, and unrelated descriptions remain untouched", async () => {
  cancelled = true; const before = messages.length;
  assert.equal(await performKnowledgeProcedure(item), null);
  assert.equal(messages.length, before);
  assert.equal(knowledgeProcedureDescription("description", {type: "ability", system: {catalogId: "spiritLore"}}), "description");
  assert.match(knowledgeProcedureDescription("description", item), /knowledge-procedure/);
});
