import assert from "node:assert/strict";
import test from "node:test";
import {effectChangePhase, effectContributions, rollEffectKeys} from "../modules/rules/effect-contributions.mjs";

test("every derived actor input uses the initial phase, while item and token changes retain theirs", () => {
  for (const key of ["effective.traits.strength", "effective.skills.faith", ...[
    "movement", "protection", "damage", "fearFactor", "bodyMax", "combatMax", "vitnerMax", "divinityMax",
    "bodyValue", "combatValue", "vitnerValue", "divinityValue", "raudValue", "fearValue",
    "rolls.allActions", "rolls.combatActions", "rolls.movementActions", "rolls.attack", "rolls.parry", "rolls.magic",
    "rolls.initiative", "rolls.traits.psyche", "rolls.skills.agility"].map(key => `modifiers.${key}`)]) {
    assert.equal(effectChangePhase({key: `system.${key}`, phase: "final"}), "initial", key);
  }
  assert.equal(effectChangePhase({key: "system.damageBonus", phase: "final"}), "final");
  assert.equal(effectChangePhase({key: "sight.range", phase: "initial"}), "initial");
});

const effect = (name, type, value, extra = {}) => ({name, ...extra, system: {changes: [{key: "stat", type, value}]}});
test("contributions explain each native operation, cancelling effects and suppressed sources without modifying data", () => {
  const actor = {stat: 8, effects: [effect("Double", "multiply", 2), effect("Blessing", "add", 3),
    effect("Curse", "subtract", 1), effect("Disabled", "add", 99, {disabled: true}),
    effect("Suppressed", "add", 99, {isSuppressed: true})]};
  assert.deepEqual(effectContributions(actor, "stat", {base: 3}), [
    {label: "Double", value: 3}, {label: "Blessing", value: 3}, {label: "Curse", value: -1}]);
  assert.equal(actor.stat, 8);
  actor.effects = [effect("Minimum", "upgrade", 6), effect("Maximum", "downgrade", 5), effect("Replace", "override", 8)];
  assert.equal(effectContributions(actor, "stat", {base: 3}).reduce((total, row) => total + row.value, 3), 8);
  actor.stat = 0; actor.effects = [effect("Bonus", "add", 2), effect("Malus", "add", -2)];
  assert.deepEqual(effectContributions(actor, "stat"), [{label: "Bonus", value: 2}, {label: "Malus", value: -2}]);
});

test("all roll contexts select only their applicable modifier paths", () => {
  for (const combat of [false, true]) {
    const actor = {isInCombatActive: () => combat};
    for (const kind of ["skill", "ability", "magic", "attack", "parry", "trait", "situation"]) {
      const keys = rollEffectKeys(actor, {kind, skillKey: "agility", traitKey: "dexterity", movement: true});
      assert.ok(keys.includes("system.modifiers.rolls.allActions"));
      assert.ok(keys.includes("system.modifiers.rolls.movementActions"));
      assert.ok(keys.includes("system.modifiers.rolls.skills.agility"));
      assert.ok(keys.includes("system.modifiers.rolls.traits.dexterity"));
      assert.equal(keys.includes("system.modifiers.rolls.combatActions"), ["ability", "magic", "attack", "parry"].includes(kind) || (combat && kind === "skill"));
      assert.equal(keys.includes("system.modifiers.rolls.magic"), kind === "magic");
    }
  }
});
