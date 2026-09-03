import assert from "node:assert/strict";
import test from "node:test";
import {freeCombatPoolScope, resolveCombatPools, weaponForUsage} from "../modules/rules/combat-pool-resolver.mjs";

function actor({weaponSpent = 4, offHandSpent = 0} = {}) {
  return {
    type: "character",
    items: [],
    system: {skills: {fighting: {value: 8}}, modifiers: {}},
    _source: {system: {combatPools: {free: {spent: 0, weaponSpent, offHandSpent}}}}
  };
}

function freePool(options) {
  return resolveCombatPools(options).pools.find(pool => pool.id === "free");
}

test("Free CP for an action that needs both hands is limited by the lower hand reserve", () => {
  const character = actor();
  const movement = freePool({actor: character, context: {action: "movement"}});
  assert.equal(movement.freeScope, "both");
  assert.equal(movement.current, 4);
  assert.equal(resolveCombatPools({actor: character, context: {action: "movement"}}).eligibleCurrent, 4);
});

test("hand-bound weapon, shield, and draw actions use only their matching Free CP reserve", () => {
  const character = actor();
  const weapon = {type: "weapon", system: {combatSpecialty: "oneHandedLightWeapons", hand: "weapon"}};
  const offHandWeapon = {type: "weapon", system: {combatSpecialty: "oneHandedHeavyWeapons", hand: "offHand"}};
  const shield = {type: "shield", system: {}};

  assert.equal(freeCombatPoolScope(weapon, {action: "attack"}), "weapon");
  assert.equal(freeCombatPoolScope(weapon, {action: "drawWeapon"}), "weapon");
  assert.equal(freeCombatPoolScope(offHandWeapon, {action: "parry"}), "offHand");
  assert.equal(freeCombatPoolScope(shield, {action: "drawWeapon"}), "offHand");
  assert.equal(freePool({actor: character, item: weapon, context: {action: "attack"}}).current, 4);
  assert.equal(freePool({actor: character, item: shield, context: {action: "parry"}}).current, 8);
});

test("off-hand one-handed throws use only the shield-hand Free CP, while natural attacks use both", () => {
  const offHandWeapon = {type: "weapon", system: {combatSpecialty: "oneHandedLightWeapons", hand: "offHand"}};
  const thrown = weaponForUsage(offHandWeapon, {throwing: true});
  const naturalWeapon = {type: "weapon", system: {combatSpecialty: "natural", hand: "offHand"}};
  assert.equal(freeCombatPoolScope(thrown, {action: "attack"}), "offHand");
  assert.equal(freeCombatPoolScope(offHandWeapon, {action: "drawWeapon"}), "offHand");
  assert.equal(freeCombatPoolScope(naturalWeapon, {action: "attack"}), "both");
});

test("two-handed weapons and ordinary actions consume both Free CP hand uses", () => {
  const twoHanded = {type: "weapon", system: {combatSpecialty: "twoHandedWeapons"}};
  assert.equal(freeCombatPoolScope(twoHanded, {action: "attack"}), "both");
  assert.equal(freeCombatPoolScope(null, {action: "glima"}), "both");
  assert.equal(freeCombatPoolScope(null, {action: "other"}), "both");
});
