import {test} from "node:test";
import assert from "node:assert/strict";

let values, cancelled = false, messages = [], renders = [], dice = [];
globalThis.document = {createElement: () => ({set textContent(v) {this.innerHTML = String(v);}})};
globalThis.foundry = {applications: {api: {DialogV2: class {
  static async wait(config) {
    if (cancelled) return config.buttons[1].callback();
    return config.buttons[0].callback(null, {form: {querySelector: selector => ({value: values[selector.match(/"(.*?)"/)[1]]})}}, null);
  }
}}, handlebars: {renderTemplate: async (path, data) => {renders.push({path, data}); return "card";}}},
documents: {Actor: class {}, ActiveEffect: class {}}, data: {fields: {}, ActiveEffectTypeDataModel: class {}}};
globalThis.game = {user: {name: "Player", targets: []}, i18n: {localize: key => key}};
globalThis.ui = {notifications: {warn() {}}};
globalThis.Roll = class {
  constructor(formula) {this.formula = formula;}
  async evaluate() {this.total = dice.shift(); return this;}
};
globalThis.ChatMessage = {getSpeaker: () => ({}), create: async data => messages.push(data)};
const {rollGenericDamage, rollGenericFear} = await import("../modules/generic-rolls.mjs");

test("standalone dice chain on every result at or above the chosen JO and retain the custom title", async () => {
  values = {title: "Falling stones", dice: "1", faces: "3", threshold: "2", bonus: "2"};
  dice = [2, 3, 1];
  const roll = await rollGenericDamage();
  assert.equal(roll.total, 8);
  assert.deepEqual(messages.at(-1).rolls.map(r => r.formula), ["1d3", "1d3", "1d3"]);
  assert.equal(renders.at(-1).data.itemName, "Falling stones");
  assert.equal(renders.at(-1).data.total, 8);
  assert.ok(renders.some(r => r.path.endsWith("damage-targets.hbs")));
});

test("generic fear uses the normal actionable fear card, with bonus and custom title", async () => {
  values = {title: "Haunted house", dice: "2", faces: "5", threshold: "0", bonus: "-1"};
  dice = [4, 3];
  await rollGenericFear();
  assert.ok(renders.at(-1).path.endsWith("fear-card.hbs"));
  assert.equal(renders.at(-1).data.title, "Haunted house");
  assert.equal(renders.at(-1).data.total, 6);
});

test("cancel and invalid explosive thresholds never roll or post", async () => {
  const before = messages.length;
  cancelled = true;
  assert.equal(await rollGenericDamage(), null);
  cancelled = false;
  values.threshold = "1";
  assert.equal(await rollGenericFear(), null);
  assert.equal(messages.length, before);
});
