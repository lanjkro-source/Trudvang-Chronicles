import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {prepareDamageRoll, damageRollChoice} from "../modules/rules/damage-roll-resolver.mjs";

const lang = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const get = path => path.split(".").reduce((value, key) => value?.[key], lang);
const format = (key, data = {}) => String(get(key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
Handlebars.registerHelper("localize", (key, options) => format(key, options.hash));
const templates = new Map();
globalThis.foundry = {applications: {api: {}, handlebars: {renderTemplate: async (path, data) => {
  const relative = path.replace("systems/trudvang-chronicles/", "");
  if (!templates.has(relative)) templates.set(relative, Handlebars.compile(readFileSync(new URL(`../${relative}`, import.meta.url), "utf8")));
  return templates.get(relative)(data);
}}}};
const {rollDamage, damageRollDialog} = await import("../modules/dice.mjs");

const effect = (name, key, value, type = "add", extra = {}) => ({name, system: {changes: [{key, type, value}]}, ...extra});
function actor(strength = 2, damage = 0, effects = []) {
  return {uuid: "Actor.actor", name: "Guerrier", system: {traits: {strength}, modifiers: {damage}},
    getTraitValue: key => key === "strength" ? strength : 0, allApplicableEffects: () => effects,
    update: () => assert.fail("a damage roll must not consume resources")};
}
function weapon(extra = {}) {
  return {name: "Seax", type: "weapon", system: {damage: "1d10", damageBonus: 0, openRoll: 9,
    category: "oneHandedLight", strengthApplies: true, ...extra},
    update: () => assert.fail("roll adjustments must not edit the weapon")};
}

function runtime(t, {response = {}, results = [4]} = {}) {
  const previous = {game: globalThis.game, Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage, ui: globalThis.ui};
  const previousDialog = foundry.applications.api.DialogV2;
  t.after(() => {Object.assign(globalThis, previous); foundry.applications.api.DialogV2 = previousDialog;});
  const cards = [], rolls = [], dialogs = [], warnings = [];
  globalThis.game = {user: {targets: new Set()}, i18n: {localize: key => get(key) ?? key, format}};
  globalThis.ui = {notifications: {warn: text => warnings.push(text)}};
  globalThis.Roll = class {
    constructor(formula) {this.formula = formula; rolls.push(this);}
    async evaluate() {this.total = results.shift(); assert.notEqual(this.total, undefined, "unexpected extra die");}
  };
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.uuid}), create: async data => {cards.push(data); return data;}};
  foundry.applications.api.DialogV2 = class {
    _onRender() {}
    static async wait(options) {dialogs.push(options); return response;}
  };
  return {cards, rolls, dialogs, warnings};
}

test("the damage snapshot explains intrinsic, item, wearer and named actor effects once", () => {
  const item = weapon({damage: "2d10+3", damageBonus: 5, openRoll: 8});
  item._source = {system: {...item.system, damage: "1d10+1", damageBonus: 2, openRoll: 9}};
  item.effects = [effect("Lame enchantée", "system.damageBonus", 3), effect("Blessure accrue", "system.damage", "2d10+3", "override"),
    effect("Jet ouvert amélioré", "system.openRoll", 8, "override"), effect("Désactivé", "system.damageBonus", 20, "add", {disabled: true})];
  const wearer = actor(4, 2, [effect("Force du géant", "system.effective.traits.strength", 2), effect("Bénédiction", "system.modifiers.damage", 3),
    effect("Malédiction", "system.modifiers.damage", 1, "subtract")]);
  const profile = prepareDamageRoll({item, actor: wearer});
  assert.equal(profile.fixedModifier, 14); // 3 in the formula + 5 on the item + 4 Strength + 2 actor effects.
  assert.equal(profile.openRoll, 8);
  assert.equal(profile.rows.find(row => row.labelKey.endsWith("Intrinsic")).amount, 3);
  const itemEffects = profile.rows.find(row => row.labelKey.endsWith("ItemEffects"));
  assert.equal(itemEffects.amount, 5);
  assert.match(itemEffects.source, /Lame enchantée \(\+3\)/);
  assert.doesNotMatch(itemEffects.source, /Désactivé/);
  const strength = profile.rows.find(row => row.labelKey.endsWith("Strength"));
  assert.equal(strength.amount, 4); assert.match(strength.source, /Force du géant/);
  const actorEffects = profile.rows.find(row => row.labelKey.endsWith("ActorEffects"));
  assert.equal(actorEffects.amount, 2); assert.match(actorEffects.source, /Bénédiction \(\+3\).*Malédiction \(-1\)/);
  assert.ok(profile.rows.some(row => row.value === "9 → 8"));
});

test("cancelling actor damage effects remain explained without adding damage", () => {
  const profile = prepareDamageRoll({item: weapon(), actor: actor(0, 0,
    [effect("Bonus", "system.modifiers.damage", 2), effect("Malus", "system.modifiers.damage", -2)])});
  assert.equal(profile.fixedModifier, 0);
  assert.equal(profile.rows.find(row => row.labelKey.endsWith("ActorEffects")).amount, 0);
});

test("ranged defaults, explicit attack range and improvised throwing all use the proper damage context", () => {
  for (const combatSpecialty of ["bowsSlings", "crossbow"]) {
    const bow = weapon({combatSpecialty, category: "ranged", rangeSelection: "long"});
    const profile = prepareDamageRoll({item: bow, actor: actor(8)});
    assert.equal(profile.fixedModifier, 0); assert.equal(profile.ranged, true); assert.equal(profile.longRange, true);
    assert.equal(prepareDamageRoll({item: bow, actor: actor(), context: {usage: "ranged", longRange: false}}).longRange, false);
  }
  const thrown = prepareDamageRoll({item: {...weapon({designedForThrowing: false, isThrowingWeapon: false}), name: "Lang sverd"}, actor: actor(2), context: {usage: "throwing"}});
  assert.equal(thrown.ranged, true); assert.equal(thrown.fixedModifier, -3);
  assert.equal(thrown.rows.find(row => row.labelKey.endsWith("ImprovisedThrow")).value, "-5");
  const designed = prepareDamageRoll({item: weapon({isThrowingWeapon: true, designedForThrowing: true}), actor: actor(2)});
  assert.equal(designed.usage, "throwing"); assert.equal(designed.fixedModifier, 2);
});

test("confirmation adjustments are validated without changing any source", () => {
  const item = weapon(), wearer = actor();
  const before = JSON.stringify({item, wearer});
  const profile = prepareDamageRoll({item, actor: wearer});
  const choice = damageRollChoice(profile, {dice: 3, openRoll: 8, modifier: -1, longRange: true});
  assert.equal(choice.fixedModifier, 1); assert.equal(choice.longRange, false); // A melee weapon cannot accidentally halve damage.
  for (const invalid of [{dice: 0}, {dice: -2}, {dice: 1.5}, {dice: 101}, {openRoll: 11}, {openRoll: -1}, {modifier: NaN}])
    assert.equal(damageRollChoice(profile, invalid), null);
  for (const invalid of [null, false, "cancel", "roll", 1, []]) assert.equal(damageRollChoice(profile, invalid), null);
  assert.equal(JSON.stringify({item, wearer}), before);
});

test("no die, animation or chat card is created while confirming, closing or cancelling", async t => {
  const {rolls, cards} = runtime(t);
  let dialogOptions, finishDialog, dialogOpened;
  const opened = new Promise(resolve => {dialogOpened = resolve;});
  foundry.applications.api.DialogV2 = class {static wait(options) {
    dialogOptions = options; dialogOpened(); return new Promise(resolve => {finishDialog = resolve;});
  }};
  const pending = rollDamage({actor: actor(), item: weapon()});
  await opened;
  assert.equal(rolls.length, 0); assert.equal(cards.length, 0);
  finishDialog(dialogOptions.buttons.find(button => button.action === "cancel").callback());
  assert.equal(await pending, null);
  assert.equal(rolls.length, 0); assert.equal(cards.length, 0);
  finishDialog = undefined;
  const closed = rollDamage({actor: actor(), item: weapon()});
  await new Promise(resolve => setImmediate(resolve)); finishDialog(null);
  assert.equal(await closed, null); assert.equal(rolls.length, 0);
});

test("cancelling through Foundry V14's nullish callback fallback never rolls", async t => {
  const {rolls, cards, warnings} = runtime(t);
  foundry.applications.api.DialogV2 = class {
    static async wait(options) {
      const button = options.buttons.find(button => button.action === "cancel");
      // DialogV2 substitutes the button action for a null/undefined callback result.
      return (await button.callback({}, {}, {})) ?? button.action;
    }
  };
  assert.equal(await rollDamage({actor: actor(), item: weapon()}), null);
  assert.equal(rolls.length, 0); assert.equal(cards.length, 0); assert.equal(warnings.length, 0);
});

test("button action strings and other non-object results cannot confirm a damage roll", async t => {
  const {rolls, cards, warnings} = runtime(t);
  for (const response of ["cancel", "roll", true, 1, []]) {
    foundry.applications.api.DialogV2 = class {static async wait() {return response;}};
    assert.equal(await rollDamage({actor: actor(), item: weapon()}), null);
  }
  assert.equal(rolls.length, 0); assert.equal(cards.length, 0); assert.equal(warnings.length, 0);
});

test("the V2 button reads edited fields, while native validity rejects invalid dice and thresholds", async t => {
  const {dialogs} = runtime(t, {response: null});
  const profile = prepareDamageRoll({item: weapon({combatSpecialty: "bowsSlings"}), actor: actor()});
  await damageRollDialog({item: weapon(), profile});
  const inputs = {"damage-dice": {value: "2"}, "damage-open-roll": {value: "8"}, "damage-modifier": {value: "-3"}, "damage-long-range": {checked: true}};
  const root = {querySelector: selector => inputs[selector.match(/name=([^\]]+)/)[1]]};
  const callback = dialogs[0].buttons[0].callback;
  const choice = callback({}, {form: root}, {});
  assert.equal(choice.dice, 2); assert.equal(choice.openRoll, 8); assert.equal(choice.modifier, -3); assert.equal(choice.longRange, true);
  assert.match(dialogs[0].content, /name="damage-dice"[^>]*min="1"[^>]*required/);
  assert.match(dialogs[0].content, /name="damage-open-roll"[^>]*max="10"[^>]*required/);
  inputs["damage-dice"].value = "0";
  assert.equal(callback({}, {form: root}, {}), false);
});

test("edited dice and JO explode at or above the threshold, and all adjustments appear in chat", async t => {
  const {cards, rolls, dialogs} = runtime(t, {response: {dice: 2, openRoll: 8, modifier: 3}, results: [10, 8, 2, 4]});
  const result = await rollDamage({actor: actor(2), item: weapon({damageBonus: 1})});
  assert.equal(result, 30); // 10+8+2+4 + intrinsic1 + Strength2 + extra3.
  assert.equal(rolls.length, 4); assert.deepEqual(cards[0].rolls, rolls); // Dice So Nice receives every real roll.
  assert.match(dialogs[0].content, /Force/);
  assert.match(cards[0].content, /Force : \+2/);
  assert.match(cards[0].content, /supplémentaire : \+3/);
  assert.match(cards[0].content, /Nombre de dés modifié[^<]*1 → 2/);
  assert.match(cards[0].content, /Seuil de jet ouvert modifié[^<]*9 → 8/);
  assert.match(cards[0].content, /8-10/);
});

test("zero JO disables explosions, natural d5 damage and minimum 1 are preserved", async t => {
  const {rolls, cards} = runtime(t, {response: {openRoll: 0, modifier: -20}, results: [5]});
  const result = await rollDamage({actor: actor(0), item: weapon({category: "natural", damage: "1d5", openRoll: 0})});
  assert.equal(result, 1); assert.equal(rolls.length, 1); assert.equal(rolls[0].formula, "1d5");
  assert.match(cards[0].content, /moins de 1 dégât/);
});

test("long range halves the confirmed full calculation only after modifiers and minimum damage", async t => {
  const {cards} = runtime(t, {response: {modifier: 2}, results: [7]});
  const item = weapon({combatSpecialty: "bowsSlings", rangeSelection: "long", openRoll: 0});
  assert.equal(await rollDamage({actor: actor(8), item}), 5); // (7 + 2) / 2, no Strength.
  assert.match(cards[0].content, /9 → 5 dégâts/);
  assert.match(cards[0].content, /data-damage="5"/);
});

test("external damage and JO modifiers appear before rolling and in the resulting card", async t => {
  const {cards, dialogs} = runtime(t, {response: {}, results: [5]});
  const modifiers = [{id: "test-effect", target: "damageModifier", operation: "add", phase: "effect", amount: -2,
    source: {kind: "effect", name: "Engourdissement"}},
  {id: "test-jo", target: "openRoll", operation: "subtract", amount: 1, phase: "effect", source: {kind: "effect", name: "Rune"}}];
  assert.equal(await rollDamage({actor: actor(2), item: weapon(), context: {modifiers}}), 5);
  assert.match(dialogs[0].content, /Engourdissement/); assert.match(dialogs[0].content, /9 → 8/);
  assert.match(cards[0].content, /Effets : -2 \(Engourdissement\)/); assert.match(cards[0].content, /Rune/);
});

test("custom multi-term formulas remain editable without pretending a single JO applies to them", async t => {
  const {cards, dialogs, rolls} = runtime(t, {response: {formula: "2d10x>=9+1d5", modifier: 2}, results: [15]});
  assert.equal(await rollDamage({actor: actor(3), item: weapon({damage: "1d10+1d5", damageBonus: 1})}), 15);
  assert.match(dialogs[0].content, /name="damage-formula"/); assert.doesNotMatch(dialogs[0].content, /name="damage-open-roll"/);
  assert.equal(rolls[0].formula, "(2d10x>=9+1d5) + (6)");
  assert.match(cards[0].content, /Formule modifiée/);
});

test("invalid confirmation data never launches dice even if native form validation is bypassed", async t => {
  const {rolls, cards, warnings} = runtime(t, {response: {dice: 0}});
  assert.equal(await rollDamage({actor: actor(), item: weapon()}), null);
  assert.equal(rolls.length, 0); assert.equal(cards.length, 0); assert.equal(warnings.length, 1);
});
