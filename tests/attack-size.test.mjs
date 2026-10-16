import assert from "node:assert/strict";
import test from "node:test";
import {ATTACK_SIZE_BANDS, attackSizeBand, attackSizeModifier, attackSizeTargets, allocatedCombatVC} from "../modules/rules/attack-size.mjs";

test("all 81 attack modifiers match the French Bestiary table, p. 10", () => {
  const table = [
    [0,0,1,2,3,4,5,6,7], [0,0,0,1,2,3,4,5,6], [-1,0,0,0,1,2,3,4,5],
    [-2,-1,0,0,0,1,2,3,4], [-3,-2,-1,0,0,0,1,2,3], [-4,-3,-2,-1,0,0,0,1,2],
    [-5,-4,-3,-2,-1,0,0,0,1], [-6,-5,-4,-3,-2,-1,0,0,0], [-7,-6,-5,-4,-3,-2,-1,0,0]
  ];
  ATTACK_SIZE_BANDS.forEach((attacker, row) => ATTACK_SIZE_BANDS.forEach((target, column) =>
    assert.equal(attackSizeModifier(attacker, target), table[row][column], `${row},${column}`)));
});

test("size bands handle French fractions, open bounds and the rule's nearest-size examples", () => {
  for (const [size, band] of [["<1/3",0], ["1/3t",1], ["0.33",1], ["<0.33",0], ["1/2",2], ["1,5t",4], ["2t",5], [7,7], [8,8], ["10+",8], [">10",8], ["",3], ["unknown",3]]) {
    assert.equal(attackSizeBand(size), band, String(size));
  }
  const pc = {type: "character", system: {details: {height: 200}}};
  const rows = attackSizeTargets(pc, [{name: "Giant", document: {uuid: "Scene.s.Token.g"}, actor: {uuid: "Actor.g", system: {details: {size: "10+"}}}},
    {actor: {uuid: "Actor.t", system: {details: {size: "<1/3"}}}}]);
  assert.deepEqual(rows.map(row => row.modifier), [4, -2]);
  assert.deepEqual(attackSizeTargets(pc), []);
});

test("size modifies VC after allocation and feint, without changing the allocation", () => {
  assert.equal(allocatedCombatVC(10, 2, 4), 12);
  assert.equal(allocatedCombatVC(10, 2, -3), 5);
  assert.equal(allocatedCombatVC(6, 0, 0, 2), 3);
  assert.equal(allocatedCombatVC(1, 0, -3), -2);
});
