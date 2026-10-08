import assert from "node:assert/strict";
import test from "node:test";

const rows = [{labelKey: "wounds", value: -3}, {labelKey: "fear", value: -1}];
const cards = [];
let config, dialog, form;
function node(value = "") {
  return {value, textContent: "", listeners: {}, addEventListener(event, listener) { this.listeners[event] = listener; },
    toggleAttribute(name, enabled) { this[name] = enabled; }};
}
function fields(inputs, outputs = []) {
  const nodes = Object.fromEntries(Object.entries(inputs).map(([selector, value]) => [selector, node(value)]));
  for (const selector of outputs) nodes[selector] = node();
  return {nodes, querySelector: selector => nodes[selector], querySelectorAll: () => []};
}
class MockDialog {
  _onRender() {}
  static async wait(options) {
    config = options;
    dialog = new this(); dialog.element = form;
    dialog._onRender({}, {});
    return null;
  }
}
globalThis.document = {createElement: () => ({
  set textContent(value) { this.value = value; },
  get innerHTML() { return String(this.value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
})};
globalThis.foundry = {applications: {api: {DialogV2: MockDialog},
  handlebars: {renderTemplate: async (_path, data) => {cards.push(data); return "card"; }}}};
globalThis.game = {i18n: {localize: key => key, format: (key, data) => `${key}: ${data.target}`}};
const {modifierDialog, magicDialog, concentrationDialog, traitRollDialog, playerTraitSituationDialog, genericSituationDialog, rollGenericSituation, rollModifierFlavor} = await import("../modules/dice.mjs");
const output = selector => Number(form.nodes[selector].textContent);
function input(selector, value, event = "input") {
  form.nodes[selector].value = value;
  form.nodes[selector].listeners[event]();
}
function confirm() { return config.buttons[0].callback({}, {form}, dialog); }
function assertRows() {
  assert.match(config.content, /wounds<\/span><b>-3<|wounds<\/dt><dd>-3</);
  assert.match(config.content, /fear<\/span><b>-1<|fear<\/dt><dd>-1</);
}

test("skill dialogs explain the already-applied states and update the final VC without applying them twice", async () => {
  form = fields({"[name=modifier]": "0"}, ["[data-final-target]"]);
  await modifierDialog({title: "Skill", target: 4, modifierRows: rows});
  assert.match(config.content, /TRUDVANG.Dialog.BaseTarget: 8/);
  assertRows();
  assert.equal(output("[data-final-target]"), 4);
  input("[name=modifier]", "2");
  assert.equal(output("[data-final-target]"), 6);
  assert.equal(confirm().modifier, 2);
});

test("magic dialogs keep method VC intrinsic, then combine states, power, maintenance, effort and situation", async () => {
  form = fields({"[name=method]": "first", "[name=modifier]": "0", "[name=strenuous]": "0"},
    ["[data-final-target]", "[data-final-cost]", "[data-level-cost]", ".magic-breakdown"]);
  await magicDialog({title: "Magic", methods: [{id: "first", label: "First", target: 10}, {id: "second", label: "Second", target: 14}],
    defaultCost: 3, spellModifier: -2, activeSpellCount: 1, strenuousMax: 2, modifierRows: rows});
  assert.match(config.content, /First — VC 10/);
  assertRows();
  assert.equal(output("[data-final-target]"), 2);
  input("[name=method]", "second", "change");
  input("[name=strenuous]", "2", "change");
  input("[name=modifier]", "3");
  assert.equal(output("[data-final-target]"), 11);
  assert.equal(confirm().target, 11);
  assert.equal(confirm().cost, 7, "state penalties never affect the point cost");
});

test("concentration shows the same states in both tracks and recomputes after changing its base", async () => {
  form = fields({"[name=concentration-type]": "spell", "[name=concentration-base]": "6"},
    ["[data-concentration-discipline-name]", "[data-concentration-discipline-value]", "[data-concentration-specialty-name]", "[data-concentration-specialty-value]", "[data-concentration-total]"]);
  await concentrationDialog({title: "Concentration", psycheModifier: 2, effectModifier: 1,
    spellDisciplineLevel: 1, spellSpecialtyLevel: 2, divineDisciplineLevel: 2, divineSpecialtyLevel: 3, modifierRows: rows});
  assertRows();
  assert.equal(output("[data-concentration-total]"), 10);
  input("[name=concentration-type]", "divine", "change");
  input("[name=concentration-base]", "8");
  assert.equal(output("[data-concentration-total]"), 15);
  assert.deepEqual(confirm(), {type: "divine", base: 8});
});

test("trait dialogs apply states to situations only, not the separate open-trait comparison", async () => {
  form = fields({"[name=mode]": "situation", "[name=situationValue]": "10", "[name=bonus]": "0"},
    ["[data-final-target]", "[data-open-modifier]", "[data-roll-mode=situation]", "[data-roll-mode=open]"]);
  await traitRollDialog({title: "Constitution", traitLabel: "Constitution", traitValue: 2, effect: 1, modifierRows: rows});
  assertRows();
  assert.equal(output("[data-final-target]"), 9);
  input("[name=situationValue]", "12");
  assert.equal(output("[data-final-target]"), 11);
  input("[name=mode]", "open", "change");
  input("[name=bonus]", "2");
  assert.equal(form.nodes["[data-roll-mode=situation]"].hidden, true);
  assert.equal(output("[data-open-modifier]"), 5);
});

test("a requested resistance shows both states and applies the player's situational modifier once", async () => {
  form = fields({"[name=modifier]": "0"}, ["[data-final-target]"]);
  await playerTraitSituationDialog({title: "Resistance", traitLabel: "Psyche", traitValue: 2, effect: 1, sv: 10, modifierRows: rows});
  assertRows();
  assert.equal(output("[data-final-target]"), 9);
  input("[name=modifier]", "-2");
  assert.equal(output("[data-final-target]"), 7);
  assert.deepEqual(confirm(), {modifier: -2}, "the GM recomputes the actor's states, rather than receiving them as a manual modifier");
});

test("healthy actors omit zero state rows and modifier labels cannot inject HTML into chat", async () => {
  form = fields({"[name=modifier]": "0"}, ["[data-final-target]"]);
  await modifierDialog({title: "Healthy", target: 8});
  assert.doesNotMatch(config.content, /roll-state-modifiers/);
  assert.equal(output("[data-final-target]"), 8);
  assert.equal(rollModifierFlavor([{label: "<script>", value: -3}]), "&lt;script&gt;: -3");
});

test("generic situation dialogs explain states and recompute after changing the base or modifier", async () => {
  form = fields({"[name=target]": "10", "[name=modifier]": "0"}, ["[data-final-target]"]);
  await genericSituationDialog({modifierRows: rows});
  assertRows();
  assert.equal(output("[data-final-target]"), 6);
  input("[name=target]", "12"); input("[name=modifier]", "2");
  assert.equal(output("[data-final-target]"), 10);
  assert.equal(confirm().target, 12, "the input remains the intrinsic SV, not an already-penalized SV");
});

test("the generic situation macro applies states from the controlled actor or assigned PC, but works without an actor", async () => {
  const messages = [];
  globalThis.Roll = class {constructor(formula) {this.formula = formula;} async evaluate() {this.total = 8;}};
  globalThis.ChatMessage = {getSpeaker: ({actor} = {}) => ({actor: actor?.uuid}), create: async data => {messages.push(data);}};
  const actor = {name: "Test", uuid: "Actor.test", items: [], system: {damage: {penalty: -3}, fearPenalty: -1}};
  game.user = {name: "User", character: null};
  globalThis.canvas = {tokens: {controlled: [{actor}]}};
  assert.equal((await rollGenericSituation({target: 10, modifier: 2})).target, 8);
  assert.match(cards.at(-1).flavor, /TRUDVANG.Dialog.WoundPenalty: -3/);
  assert.match(cards.at(-1).flavor, /TRUDVANG.Resource.FearPenalty: -1/);
  canvas.tokens.controlled = []; game.user.character = actor;
  assert.equal((await rollGenericSituation({target: 10, modifier: 2})).target, 8);
  actor.items = [{type: "creatureAbility", system: {ignoreWoundPenalties: true}}];
  assert.equal((await rollGenericSituation({target: 10, modifier: 2})).target, 11);
  game.user.character = null;
  assert.equal((await rollGenericSituation({target: 10, modifier: 2})).target, 12);
  assert.equal(cards.at(-1).flavor, "");
  assert.ok(messages.every(message => message.rolls[0].formula === "1d20"));
});
