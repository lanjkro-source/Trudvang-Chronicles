import assert from "node:assert/strict";
import test from "node:test";

globalThis.foundry = {applications: {}};
const {combatPointDialog} = await import("../modules/dice.mjs");

function runtime(t) {
  const previous = {game: globalThis.game, foundry: globalThis.foundry, document: globalThis.document};
  t.after(() => Object.assign(globalThis, previous));
  const dialogs = [];
  globalThis.document = {createElement: () => ({
    set textContent(value) { this.value = value; },
    get innerHTML() { return this.value; }
  })};
  globalThis.game = {i18n: {localize: key => key}};
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
  }});
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
