import test from "node:test";
import assert from "node:assert/strict";

import {
  parseSimpleDamageFormula,
  resolveCombatActionModifier,
  resolveDamage,
  resolveEquipment,
  resolveNumericEquipmentStat,
  resolveWeaponActions
} from "../modules/rules/equipment-resolver.mjs";
import {
  actorParticipatesInCombat,
  categoryForWeaponType,
  normalizeCombatAllocation,
  readiedHandConflicts,
  readiedItemHands,
  resolveCombatPools,
  suggestCombatAllocation,
  weaponCombatSpecialty,
  weaponType,
  weaponUsesTwoHands,
  weaponUsesSeparateHands
} from "../modules/rules/combat-pool-resolver.mjs";

function combatActor(levels = {}, {fighting = 9, spent = {}} = {}) {
  const actor = actorWithKnowledge(levels);
  actor.type = "character";
  actor.system = {
    skills: {fighting: {value: fighting}},
    modifiers: {combatMax: 0, combatValue: 0},
    combatPools: Object.fromEntries(Object.entries(spent).map(([id, value]) => [id, {spent: value}]))
  };
  actor._source = {system: {combatPools: actor.system.combatPools}};
  actor.getSkillValue = key => key === "fighting" ? fighting : 0;
  return actor;
}

function actorWithKnowledge(levels = {}) {
  const items = Object.entries(levels).map(([catalogId, level]) => ({
    uuid: `Actor.actor-id.Item.${catalogId}`,
    name: catalogId,
    system: {catalogId, ...(typeof level === "object" ? level : {level})}
  }));
  return {
    id: "actor-id",
    uuid: "Actor.actor-id",
    name: "Test wearer",
    items,
    findKnowledgeItem: id => items.find(item => item.system.catalogId === id) ?? null
  };
}

function shield() {
  return {
    id: "shield-id",
    uuid: "Actor.actor-id.Item.shield-id",
    name: "Test shield",
    type: "shield",
    system: {weaponActions: 2, attackValue: 5, equipped: true}
  };
}

function weapon({category = "twoHanded", weaponActions = 2, equipped = false, ...system} = {}) {
  return {
    id: "weapon-id",
    uuid: "Actor.actor-id.Item.weapon-id",
    name: "Test weapon",
    type: "weapon",
    system: {category, weaponActions, equipped, ...system}
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

test("a standalone damage profile preserves its intrinsic formula and bonus", () => {
  const item = weapon();
  item.system.damage = "2d10 + 3";
  item.system.damageBonus = 2;
  item.system.openRoll = 9;
  const result = resolveDamage({item});
  assert.equal(result.formula, "2d10+3");
  assert.deepEqual(result.parsed, {formula: "2d10+3", dice: 2, faces: 10, modifier: 3});
  assert.equal(result.modifier.base, 2);
  assert.equal(result.modifier.value, 2);
  assert.equal(result.openRoll.value, 9);
  assert.equal(result.minimumTotal, 1);
});

test("melee Strength is a traceable contextual damage contribution", () => {
  const item = weapon({category: "oneHandedHeavy"});
  item.system.strengthApplies = true;
  item.system.damageBonus = 1;
  const actor = {...actorWithSpecialty(0), getTraitValue: key => key === "strength" ? 2 : 0};
  const result = resolveDamage({item, actor});
  assert.equal(result.modifier.base, 1);
  assert.equal(result.modifier.value, 3);
  assert.equal(result.modifier.steps[0].id, "strength-damage");
  assert.equal(result.modifier.steps[0].before, 1);
  assert.equal(result.modifier.steps[0].after, 3);
  assert.equal(result.modifier.steps[0].source.id, "strength");
});

test("weapons that opt out of Strength keep only their intrinsic damage bonus", () => {
  const item = weapon({category: "ranged"});
  item.system.strengthApplies = false;
  item.system.damageBonus = 1;
  const actor = {...actorWithSpecialty(0), getTraitValue: () => 4};
  const result = resolveDamage({item, actor});
  assert.equal(result.modifier.value, 1);
  assert.deepEqual(result.modifier.steps, []);
});

test("ranged weapon damage ignores Strength even when legacy data enables it", () => {
  const item = weapon({category: "ranged"});
  item.system.strengthApplies = true;
  const actor = {...actorWithSpecialty(0), getTraitValue: () => 4};
  const result = resolveDamage({item, actor});
  assert.equal(result.modifier.value, 0);
  assert.deepEqual(result.modifier.steps, []);
});

test("negative Strength remains visible while the roll contract enforces one minimum damage", () => {
  const item = weapon();
  item.system.strengthApplies = true;
  const actor = {...actorWithSpecialty(0), getTraitValue: () => -4};
  const result = resolveDamage({item, actor});
  assert.equal(result.modifier.value, -4);
  assert.equal(result.modifier.steps[0].delta, -4);
  assert.equal(result.minimumTotal, 1);
});

test("damage effects are ordered after the wearer's Strength", () => {
  const item = weapon();
  item.system.strengthApplies = true;
  const actor = {...actorWithSpecialty(0), getTraitValue: () => 2};
  const result = resolveDamage({item, actor, modifiers: [{
    id: "blessing",
    target: "damageModifier",
    operation: "add",
    amount: 3,
    phase: "effect",
    source: {kind: "effect", id: "blessing"}
  }]});
  assert.equal(result.modifier.value, 5);
  assert.deepEqual(result.modifier.steps.map(step => step.id), ["strength-damage", "blessing"]);
});

test("the standard damage parser accepts signed fixed terms and rejects arbitrary formulas", () => {
  assert.deepEqual(parseSimpleDamageFormula("1d10 - 2"), {formula: "1d10-2", dice: 1, faces: 10, modifier: -2});
  assert.equal(parseSimpleDamageFormula("max(1, 1d10)"), null);
});

test("a shield-hand action has a traceable -15 SV penalty", () => {
  const result = resolveCombatActionModifier({item: shield()});
  assert.equal(result.base, 0);
  assert.equal(result.value, -15);
  assert.equal(result.steps[0].id, "shield-hand-penalty");
  assert.equal(result.steps[0].rule.printedPage, 318);
});

test("Body Control and Ambidexterity reduce the shield-hand penalty", () => {
  const result = resolveCombatActionModifier({
    item: shield(),
    actor: actorWithKnowledge({bodyControl: 2, ambidexterity: 3})
  });
  assert.equal(result.value, -7);
  assert.deepEqual(result.steps.map(step => [step.id, step.before, step.after]), [
    ["shield-hand-penalty", 0, -15],
    ["body-control-shield-hand", -15, -13],
    ["ambidexterity-shield-hand", -13, -7]
  ]);
});

test("Shield Bearer level 1 cancels the penalty when using a shield", () => {
  const result = resolveCombatActionModifier({
    item: shield(),
    actor: actorWithKnowledge({bodyControl: 2, ambidexterity: 3, shieldBearer: 1})
  });
  assert.equal(result.value, 0);
  assert.equal(result.steps.at(-1).id, "shield-bearer-shield-hand");
  assert.equal(result.steps.at(-1).before, -7);
  assert.equal(result.steps.at(-1).after, 0);
});

test("Shield Bearer does not cancel the penalty for an off-hand weapon", () => {
  const item = weapon({category: "oneHandedLight"});
  const result = resolveCombatActionModifier({
    item,
    actor: actorWithKnowledge({bodyControl: 2, ambidexterity: 3, shieldBearer: 5}),
    context: {hand: "offHand"}
  });
  assert.equal(result.value, -7);
  assert.equal(result.steps.some(step => step.id === "shield-bearer-shield-hand"), false);
});

test("a weapon in the weapon hand has no contextual action modifier", () => {
  const result = resolveCombatActionModifier({item: weapon(), actor: actorWithKnowledge({})});
  assert.equal(result.value, 0);
  assert.deepEqual(result.steps, []);
});

test("natural weapons are exempt even when an off-hand context is supplied", () => {
  const item = weapon({category: "natural"});
  const result = resolveCombatActionModifier({item, context: {hand: "offHand"}});
  assert.equal(result.value, 0);
  assert.deepEqual(result.steps, []);
});

test("two-handed weapons, bows and crossbows never expose a hand choice or shield-hand penalty", () => {
  for (const item of [
    weapon({category: "twoHanded"}),
    weapon({category: "ranged"}),
    Object.assign(weapon({category: "ranged"}), {system: {...weapon({category: "ranged"}).system, combatSpecialty: "crossbow"}})
  ]) {
    assert.equal(weaponUsesSeparateHands(item), false);
    assert.equal(resolveCombatActionModifier({item, context: {hand: "offHand"}}).value, 0);
  }
});

test("canonical weapon types preserve legacy data and synchronize its category", () => {
  assert.equal(weaponType(weapon({category: "ranged"})), "bowsSlings");
  assert.equal(weaponType(weapon({category: "ranged", combatSpecialty: "crossbow"})), "crossbow");
  assert.equal(categoryForWeaponType("crossbow"), "ranged");
  assert.equal(categoryForWeaponType("twoHandedWeapons"), "twoHanded");
});

test("two-handed weapons, bows, and crossbows occupy both hands", () => {
  for (const combatSpecialty of ["twoHandedWeapons", "bowsSlings", "crossbow"]) {
    const item = weapon({combatSpecialty});
    assert.equal(weaponUsesTwoHands(item), true);
    assert.deepEqual(readiedItemHands(item), ["weapon", "offHand"]);
  }
});

test("readied equipment conflicts only when it shares a required hand", () => {
  const sword = {...weapon({combatSpecialty: "oneHandedLightWeapons", hand: "weapon", equipped: true}), id: "sword", name: "Sword"};
  const shieldItem = {...shield(), id: "shield", name: "Shield", system: {...shield().system, equipped: true}};
  const bow = {...weapon({combatSpecialty: "bowsSlings"}), id: "bow", name: "Bow"};
  assert.deepEqual(readiedHandConflicts([sword, shieldItem], bow).map(item => item.id), ["sword", "shield"]);
  const dagger = {...weapon({combatSpecialty: "oneHandedLightWeapons", hand: "weapon"}), id: "dagger"};
  assert.deepEqual(readiedHandConflicts([shieldItem], dagger), []);
});

test("linked Combat Point pools retain their distinct maxima", () => {
  const actor = combatActor({
    battleExperience: 1,
    armedFighting: 1,
    fighter: 2,
    combatActions: 3,
    oneHandedLightWeapons: 2,
    shieldBearer: 2
  });
  const result = resolveCombatPools({actor});
  assert.equal(result.pools.find(pool => pool.id === "free").max, 9);
  assert.equal(result.pools.find(pool => pool.id === "attacksParries").max, 4);
  assert.equal(result.pools.find(pool => pool.id === "combatActions").max, 6);
  assert.equal(result.pools.find(pool => pool.id === "shieldParry").max, 4);
});

test("a light-weapon attack exposes only compatible pools", () => {
  const actor = combatActor({battleExperience: 1, armedFighting: 1, fighter: 2, combatActions: 3, oneHandedLightWeapons: 2, shieldBearer: 2});
  const item = weapon({category: "oneHandedLight"});
  const result = resolveCombatPools({actor, item, context: {action: "attack"}});
  assert.deepEqual(result.eligible.map(pool => pool.id), [
    "free", "battleExperience", "armedFighting", "attacksParries", "oneHandedLightWeapons"
  ]);
  assert.equal(result.eligibleCurrent, 19);
});

test("shield-only points are eligible for shield parries but not shield attacks", () => {
  const actor = combatActor({battleExperience: 1, armedFighting: 1, fighter: 2, shieldBearer: 2});
  const parry = resolveCombatPools({actor, item: shield(), context: {action: "parry"}});
  const attack = resolveCombatPools({actor, item: shield(), context: {action: "attack"}});
  assert.equal(parry.eligible.some(pool => pool.id === "shieldParry"), true);
  assert.equal(attack.eligible.some(pool => pool.id === "shieldParry"), false);
  assert.equal(parry.eligibleCurrent - attack.eligibleCurrent, 4);
});

test("positioning actions use Combat Actions but not attack pools", () => {
  const actor = combatActor({battleExperience: 1, fighter: 2, combatActions: 3, oneHandedLightWeapons: 2});
  const result = resolveCombatPools({actor, context: {action: "movement"}});
  assert.deepEqual(result.eligible.map(pool => pool.id), ["free", "battleExperience", "combatActions"]);
  assert.equal(result.eligibleCurrent, 16);
});

test("spending one linked pool does not consume another", () => {
  const actor = combatActor({fighter: 2, oneHandedLightWeapons: 2}, {spent: {oneHandedLightWeapons: 3, free: 2}});
  const result = resolveCombatPools({actor, item: weapon({category: "oneHandedLight"}), context: {action: "attack"}});
  assert.equal(result.pools.find(pool => pool.id === "oneHandedLightWeapons").current, 1);
  assert.equal(result.pools.find(pool => pool.id === "attacksParries").current, 4);
  assert.equal(result.pools.find(pool => pool.id === "free").current, 7);
});

test("allocation helpers prioritize restricted pools and reject overspending", () => {
  const actor = combatActor({battleExperience: 1, armedFighting: 1, fighter: 2, oneHandedLightWeapons: 2});
  const pools = resolveCombatPools({actor, item: weapon({category: "oneHandedLight"}), context: {action: "attack"}}).eligible;
  const suggested = suggestCombatAllocation(pools, 7);
  assert.deepEqual(suggested, {oneHandedLightWeapons: 4, armedFighting: 1, attacksParries: 2});
  const normalized = normalizeCombatAllocation(pools, {free: 99, combatActions: 99, oneHandedLightWeapons: -2});
  assert.equal(normalized.total, 9);
  assert.equal(normalized.allocation.free, 9);
  assert.equal(Object.hasOwn(normalized.allocation, "combatActions"), false);
});

test("an explicit ranged specialty distinguishes crossbows from bows", () => {
  const item = weapon({category: "ranged"});
  assert.equal(weaponCombatSpecialty(item), "bowsSlings");
  item.system.combatSpecialty = "crossbow";
  assert.equal(weaponCombatSpecialty(item), "crossbow");
});

test("legacy NPC Combat Points remain a single free pool with their current spending", () => {
  const actor = {
    type: "npc",
    system: {resources: {combat: {value: 7, max: 20}}, modifiers: {}},
    _source: {system: {resources: {combat: {value: 7, max: 20}}}}
  };
  const result = resolveCombatPools({actor});
  assert.equal(result.totalMax, 20);
  assert.equal(result.totalCurrent, 7);
  assert.deepEqual(result.active.map(pool => pool.id), ["free"]);
});

test("combat participation is based on the active encounter's combatants", () => {
  const actor = {id: "actor-id", uuid: "Actor.actor-id"};
  assert.equal(actorParticipatesInCombat(actor, null), false);
  assert.equal(actorParticipatesInCombat(actor, {started: false, combatants: [{actorId: "actor-id"}]}), false);
  assert.equal(actorParticipatesInCombat(actor, {started: true, combatants: []}), false);
  assert.equal(actorParticipatesInCombat(actor, {started: true, combatants: [{actorId: "actor-id"}]}), true);
  assert.equal(actorParticipatesInCombat(actor, {started: true, combatants: [{actor: {id: "other"}}]}), false);
});

test("out-of-combat pool resolution ignores spending without erasing it", () => {
  const actor = combatActor({fighter: 2, oneHandedLightWeapons: 2}, {spent: {free: 7, attacksParries: 3, oneHandedLightWeapons: 4}});
  const item = weapon({category: "oneHandedLight"});
  const inCombat = resolveCombatPools({actor, item, context: {action: "attack"}});
  const outsideCombat = resolveCombatPools({actor, item, context: {action: "attack", ignoreSpent: true}});
  assert.equal(inCombat.eligibleCurrent, 3);
  assert.equal(outsideCombat.eligibleCurrent, 17);
  assert.equal(outsideCombat.pools.find(pool => pool.id === "free").spent, 0);
  assert.equal(actor.system.combatPools.free.spent, 7);
});

test("manual brawling and wrestling actions expose their own linked pools", () => {
  const actor = combatActor({battleExperience: 1, unarmedFighting: 2, fighter: 1, brawling: 3, wrestling: 4});
  const brawling = resolveCombatPools({actor, context: {action: "brawling"}});
  const wrestling = resolveCombatPools({actor, context: {action: "wrestling"}});
  assert.deepEqual(brawling.eligible.map(pool => pool.id), ["free", "battleExperience", "unarmedFighting", "attacksParries", "brawling"]);
  assert.deepEqual(wrestling.eligible.map(pool => pool.id), ["free", "unarmedFighting", "wrestling"]);
});

test("Combat Point allocations are always whole numbers", () => {
  const actor = combatActor({fighter: 2});
  const pools = resolveCombatPools({actor, item: weapon(), context: {action: "attack"}}).eligible;
  const normalized = normalizeCombatAllocation(pools, {free: 2.9, attacksParries: 1.8});
  assert.deepEqual(normalized.allocation, {free: 2, attacksParries: 1});
  assert.equal(normalized.total, 3);
});

test("hand-specific weapon specialties expose independent combat pools", () => {
  const actor = combatActor({armedFighting: 1, oneHandedLightWeapons: {level: 2, offHandLevel: 3}});
  const weaponHand = weapon({category: "oneHandedLight"});
  weaponHand.system.hand = "weapon";
  const shieldHand = weapon({category: "oneHandedLight"});
  shieldHand.system.hand = "offHand";
  const weaponPools = resolveCombatPools({actor, item: weaponHand, context: {action: "attack"}}).eligible;
  const shieldPools = resolveCombatPools({actor, item: shieldHand, context: {action: "attack"}}).eligible;
  assert.equal(weaponPools.find(pool => pool.id === "oneHandedLightWeapons")?.max, 4);
  assert.equal(weaponPools.some(pool => pool.id === "oneHandedLightWeaponsOffHand"), false);
  assert.equal(shieldPools.find(pool => pool.id === "oneHandedLightWeaponsOffHand")?.max, 6);
  assert.equal(shieldPools.some(pool => pool.id === "oneHandedLightWeapons"), false);
});

test("ranged weapon parries may spend only free combat points", () => {
  const actor = combatActor({battleExperience: 2, armedFighting: 2, bowsSlings: 2});
  const eligible = resolveCombatPools({actor, item: weapon({category: "ranged"}), context: {action: "parry"}}).eligible.map(pool => pool.id);
  assert.deepEqual(eligible, ["free"]);
});

test("glima uses only free, unarmed and wrestling pools", () => {
  const actor = combatActor({battleExperience: 2, unarmedFighting: 2, fighter: 2, wrestling: 3});
  const eligible = resolveCombatPools({actor, context: {action: "glima"}}).eligible.map(pool => pool.id);
  assert.deepEqual(eligible, ["free", "unarmedFighting", "wrestling"]);
});
