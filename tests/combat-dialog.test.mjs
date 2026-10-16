import assert from "node:assert/strict";
import test from "node:test";

globalThis.foundry = {applications: {}};
const {combatPointDialog, fixedAttackDialog} = await import("../modules/dice.mjs");

function runtime(t) {
  const previous = {game: globalThis.game, foundry: globalThis.foundry, document: globalThis.document};
  t.after(() => Object.assign(globalThis, previous));
  const dialogs = [];
  globalThis.document = {createElement: () => ({
    set textContent(value) { this.value = value; },
    get innerHTML() { return this.value; }
  })};
  globalThis.game = {i18n: {localize: key => key,
    format: (key, data = {}) => key.replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")}};
  globalThis.foundry = {applications: {api: {DialogV2: class {
    static async wait(options) { dialogs.push(options); return false; }
  }}}};
  return dialogs;
}

const pools = [{id: "free", label: "Free", current: 10, max: 12}];

test("combat final skill value is highlighted after the situational modifier in every weapon mode", async t => {
  const dialogs = runtime(t);
  await combatPointDialog({title: "Attack / parry", pools, combatModes: {
    uncheckedMode: "melee", checkedMode: "throwing", defaultMode: "melee",
    modes: [{id: "melee", pools}, {id: "throwing", pools}]
  }, targetLabels: ["Troll", "Wolf", "Dragon"]});
  assert.match(dialogs[0].content, /TRUDVANG\.Dialog\.AttackTargets[\s\S]*Troll/);
  assert.match(dialogs[0].content, /class="combat-target-names">Troll, Wolf, Dragon<\/span>/);
  const sections = [...dialogs[0].content.matchAll(/<section data-combat-mode="[^"]+"[^>]*>([\s\S]*?)<\/section>/g)];
  assert.equal(sections.length, 2);
  for (const [, content] of sections) {
    assert.ok(content.indexOf('name="modifier"') < content.indexOf('class="combat-final-target"'));
    assert.match(content, /<p class="combat-final-target"><span>TRUDVANG\.Dialog\.FinalTarget<\/span><strong data-combat-final-target><\/strong><\/p>\s*$/);
  }
});

test("combat final skill value remains last when only fixed modifiers are shown", async t => {
  const dialogs = runtime(t);
  await combatPointDialog({title: "Draw", pools, showModifier: false, combatPointBonus: 2});
  assert.doesNotMatch(dialogs[0].content, /name="modifier"/);
  assert.match(dialogs[0].content, /<p class="combat-final-target">[\s\S]*?<\/p>\s*<\/section>\s*<\/div>$/);
});

test("plain combat-point spending still omits the unused skill value", async t => {
  const dialogs = runtime(t);
  await combatPointDialog({title: "Other action", pools, showModifier: false});
  assert.doesNotMatch(dialogs[0].content, /combat-final-target|name="modifier"/);
});

test("an empty target selection is explicit in ordinary attack dialogs", async t => {
  const dialogs = runtime(t);
  await combatPointDialog({title: "Attack", pools, targetLabels: []});
  assert.match(dialogs[0].content, /TRUDVANG\.Dialog\.NoAttackTargets/);
});

test("fixed attacks show their target-specific VC and keep no-target attacks available", async t => {
  const dialogs = runtime(t);
  await fixedAttackDialog({title: "Fixed attack", baseVC: 12, targetTraitLabel: "Dextérité",
    targets: [{name: "Défenseur", actor: {}, token: {}, trait: "dexterity", traitValue: 3}]});
  assert.match(dialogs[0].content, /Défenseur/);
  assert.match(dialogs[0].content, /data-fixed-attack-final>9</);
  await fixedAttackDialog({title: "Fixed attack", baseVC: 12,
    targets: [{name: "", actor: null, token: null, trait: "none", traitValue: 0}]});
  assert.match(dialogs[1].content, /FixedAttackNoTargets/);
  assert.match(dialogs[1].content, /data-fixed-attack-no-target-final>12</);
  assert.ok(dialogs[1].buttons.some(button => button.action === "roll"));
});

test("size is below feint, omitted at zero, and updates allocated and final VC for each target", async t => {
  const dialogs = runtime(t);
  await combatPointDialog({title: "Attack", pools, feintMax: 5, defaultAllocation: {free: 10}, sizeTargets: [{name: "Large", modifier: 4}]});
  const html = dialogs[0].content;
  assert.ok(html.indexOf('name="feint"') < html.indexOf('class="combat-modifier-breakdown combat-size-modifiers"'));
  assert.match(html, /data-combat-total>14</);
  await combatPointDialog({title: "Attack", pools, sizeTargets: [{name: "Same", modifier: 0}]});
  assert.doesNotMatch(dialogs[1].content, /combat-size-modifiers/);

  const node = (value = "", dataset = {}) => ({value, dataset, textContent: "", addEventListener(_event, handler) {this.handler = handler;}});
  const allocation = node("10", {poolId: "free"}), feint = node("2"), modifier = node("1");
  const allocated = [-3, 4].map(size => node("", {sizeModifier: String(size)}));
  const final = [-3, 4].map(size => node("", {sizeModifier: String(size)}));
  const section = {
    querySelector: selector => ({'[name=feint]': feint, '[name=modifier]': modifier})[selector] ?? null,
    querySelectorAll: selector => ({'[data-pool-id]': [allocation], '[data-combat-target-total]': allocated, '[data-combat-target-final]': final})[selector] ?? []
  };
  const root = {querySelector: () => section, querySelectorAll: selector => selector.startsWith("[data-pool-id],") ? [allocation, feint, modifier] : []};
  foundry.applications.api.DialogV2 = class {
    _onRender() {}
    static async wait() {const dialog = new this(); dialog.element = root; dialog._onRender({}, {}); return null;}
  };
  await combatPointDialog({title: "Attack", pools, feintMax: 5, modifierRows: [{label: "Blessing", value: 2}], sizeTargets: [{name: "Small", modifier: -3}, {name: "Large", modifier: 4}]});
  assert.deepEqual(allocated.map(row => row.textContent), ["5", "12"]);
  assert.deepEqual(final.map(row => row.textContent), ["8", "15"]);
  allocation.value = "6"; allocation.handler();
  assert.deepEqual(allocated.map(row => row.textContent), ["1", "8"]);
  assert.deepEqual(final.map(row => row.textContent), ["4", "11"]);
});
