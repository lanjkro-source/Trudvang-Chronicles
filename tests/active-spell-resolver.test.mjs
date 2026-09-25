import assert from "node:assert/strict";
import test from "node:test";
import {activeSpellCosts, activeSpellInstances, activeSpellRecords, fatalActiveSpellCost} from "../modules/rules/active-spell-resolver.mjs";

const spell = (id, type = "lasting", legacyCosts = [], active = false, activeCost = 0) => ({
  id, type: "spell", system: {spellType: type, activeCastCosts: legacyCosts,
    active, activeCost, duration: "1 hour"}
});
const actor = (items, castings = [], migrated = true) => ({
  items, system: {activeSpellCastings: castings, activeSpellCastingsMigrated: migrated}
});

test("each casting of the same spell is a separate actor record with its own cost and duration", () => {
  const item = spell("flame");
  const character = actor([item], [
    {id: "first", itemId: item.id, cost: 20, duration: "1 hour", powerLevelCounts: [0, 2]},
    {id: "second", itemId: item.id, cost: 7, duration: "3 rounds", powerLevelCounts: [0, 0]},
    {id: "third", itemId: item.id, cost: 3, duration: "1 round", powerLevelCounts: [1, 0]}
  ]);
  assert.deepEqual(activeSpellCosts(character, item), [20, 7, 3]);
  assert.equal(activeSpellInstances(character).length, 3);
  assert.equal(fatalActiveSpellCost(character), 30);
  const withoutSecond = actor([item], activeSpellRecords(character).filter(casting => casting.id !== "second"));
  assert.deepEqual(activeSpellCosts(withoutSecond, item), [20, 3]);
  assert.deepEqual(activeSpellRecords(withoutSecond).map(casting => casting.duration), ["1 hour", "1 round"]);
});

test("known persistent spells do not appear as active just because their old boolean is set", () => {
  const neverCast = spell("never", "lasting", [], true, 0);
  const active = spell("cast", "lasting", [8, 4], true, 12);
  const instant = spell("instant", "instant", [9], true, 9);
  const oldWorld = actor([neverCast, active, instant], [], false);
  assert.deepEqual(activeSpellInstances(oldWorld).map(casting => casting.item.id), ["cast", "cast"]);
  assert.deepEqual(activeSpellCosts(oldWorld, active), [8, 4]);
  const migrated = actor([neverCast, active, instant], activeSpellRecords(oldWorld));
  assert.equal(activeSpellInstances(migrated).length, 2);
  assert.equal(activeSpellInstances(actor([neverCast, active, instant])).length, 0);
});

test("one old aggregate cost may be adopted, then cannot reappear after migration", () => {
  const item = spell("old", "lasting", [], true, 11);
  const oldWorld = actor([item], [], false);
  assert.deepEqual(activeSpellCosts(oldWorld, item), [11]);
  assert.equal(activeSpellInstances(actor([item])).length, 0);
});
