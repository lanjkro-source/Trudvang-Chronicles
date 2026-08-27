import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveEquipment,
  resolveNumericEquipmentStat,
  resolveWeaponActions
} from "../modules/rules/equipment-resolver.mjs";

function weapon({category = "twoHanded", weaponActions = 2, equipped = false} = {}) {
  return {
    id: "weapon-id",
    uuid: "Actor.actor-id.Item.weapon-id",
    name: "Test weapon",
    type: "weapon",
    system: {category, weaponActions, equipped}
  };
}

function actorWithSpecialty(level) {
  const specialty = {
    uuid: "Actor.actor-id.Item.specialty-id",
    name: "Two-Handed Weapons",
    system: {catalogId: "twoHandedWeapons", level}
  };
  return {
    id: "actor-id",
    uuid: "Actor.actor-id",
    name: "Test wearer",
    items: [specialty],
    findKnowledgeItem: id => id === "twoHandedWeapons" ? specialty : null
  };
}

test("an intrinsic weapon profile keeps its persisted weapon actions", () => {
  const result = resolveWeaponActions({item: weapon({weaponActions: 4})});
  assert.equal(result.base, 4);
  assert.equal(result.value, 4);
  assert.equal(result.modified, false);
  assert.deepEqual(result.steps, []);
});

test("Two-Handed Weapons level 3 grants one traceable weapon action", () => {
  const result = resolveWeaponActions({item: weapon(), actor: actorWithSpecialty(3)});
  assert.equal(result.value, 3);
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].id, "twoHandedWeapons-3");
  assert.equal(result.steps[0].before, 2);
  assert.equal(result.steps[0].after, 3);
  assert.equal(result.steps[0].delta, 1);
  assert.equal(result.steps[0].explanationKey, "TRUDVANG.Calculation.Equipment.TwoHandedWeaponActions");
  assert.equal(result.steps[0].source.level, 3);
  assert.equal(result.steps[0].rule.printedPage, 81);
});

test("Two-Handed Weapons level 5 grants two separately explained actions", () => {
  const result = resolveWeaponActions({item: weapon(), actor: actorWithSpecialty(5)});
  assert.equal(result.value, 4);
  assert.deepEqual(result.steps.map(step => [step.id, step.before, step.after]), [
    ["twoHandedWeapons-3", 2, 3],
    ["twoHandedWeapons-5", 3, 4]
  ]);
});

test("other weapon categories do not inherit the two-handed specialty rule", () => {
  for (const category of ["oneHandedLight", "oneHandedHeavy", "ranged", "natural"]) {
    const result = resolveWeaponActions({item: weapon({category, weaponActions: 4}), actor: actorWithSpecialty(5)});
    assert.equal(result.value, 4, category);
    assert.equal(result.steps.length, 0, category);
  }
});

test("explicit power and effect contributions share the ordered trace", () => {
  const result = resolveWeaponActions({
    item: weapon(),
    actor: actorWithSpecialty(3),
    modifiers: [{
      id: "huvfurwurm-power",
      target: "weaponActions",
      operation: "add",
      amount: 1,
      phase: "effect",
      source: {kind: "divinePower", id: "rampageOfTheHuvfurwurm", name: "Rampage"}
    }]
  });
  assert.equal(result.value, 4);
  assert.deepEqual(result.steps.map(step => step.id), ["twoHandedWeapons-3", "huvfurwurm-power"]);
});

test("the generic pipeline orders phases and retains ignored contributions", () => {
  const result = resolveNumericEquipmentStat({
    key: "example",
    base: 2,
    modifiers: [
      {id: "effect", target: "example", operation: "multiply", amount: 2, phase: "effect"},
      {id: "wearer", target: "example", operation: "add", amount: 1, phase: "wearer"},
      {id: "ignored", target: "example", operation: "add", amount: 10, applies: false}
    ]
  });
  assert.equal(result.value, 6);
  assert.deepEqual(result.steps.map(step => step.id), ["wearer", "effect"]);
  assert.equal(result.ignored[0].id, "ignored");
  assert.equal(result.ignored[0].reasonKey, "TRUDVANG.Calculation.Equipment.IgnoredCondition");
});

test("the public equipment contract separates characteristics from wearer impacts", () => {
  const item = weapon({equipped: true});
  const actor = actorWithSpecialty(3);
  const result = resolveEquipment({item, actor, context: {hand: "right", usage: "attack"}});
  assert.equal(result.version, 1);
  assert.equal(result.characteristics.weaponActions.value, 3);
  assert.deepEqual(result.context, {equipped: true, hand: "right", usage: "attack"});
  assert.deepEqual(result.wearerImpacts, {});
});
