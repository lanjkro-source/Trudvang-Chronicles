import assert from "node:assert/strict";
import test from "node:test";
import {activeSpellCosts, activeSpellInstances, fatalActiveSpellCost} from "../modules/rules/active-spell-resolver.mjs";

const spell = (type, costs, active = false, activeCost = 0) => ({type: "spell", system: {
  spellType: type, activeCastCosts: costs, active, activeCost, cost: 3
}});

test("repeated castings count separately and add their actual vitner costs to fatal magic", () => {
  const items = [spell("lasting", [7, 11]), spell("lasting", [4])];
  assert.deepEqual(activeSpellCosts(items[0]), [7, 11]);
  assert.equal(activeSpellInstances(items).length, 3);
  assert.equal(fatalActiveSpellCost(items), 22);
});

test("instantaneous and legacy active spells are handled without creating extra instances", () => {
  const items = [spell("instant", [9], true, 9), spell("lasting", [], true, 5)];
  assert.equal(activeSpellInstances(items).length, 1);
  assert.equal(fatalActiveSpellCost(items), 5);
});
