import assert from "node:assert/strict";
import test from "node:test";
import {powerLevelUnitCost, resolvePowerLevelCost, resolveVitnerSacrifice, spentMagicPoints} from "../modules/rules/magic-power-resolver.mjs";

test("Vitner affinity changes each chosen power level, never the base cost", () => {
  const levels = [{id: "duration", cost: 2, maxCount: null}, {id: "range", cost: 1, maxCount: 2}];
  const resolve = affinity => resolvePowerLevelCost({baseCost: 4, powerLevels: levels, counts: [2, 1], affinity});
  assert.deepEqual([-1, 0, 1, 2].map(affinity => resolve(affinity).total), [7, 9, 12, 14]);
  assert.equal(powerLevelUnitCost(1, -1), 1);
  assert.equal(resolve(1).entries[0].total, 6);
});

test("Power-level limits and counts are validated before spending", () => {
  const options = {baseCost: 2, powerLevels: [{cost: 3, maxCount: 1}]};
  assert.throws(() => resolvePowerLevelCost({...options, counts: [2]}), RangeError);
  assert.throws(() => resolvePowerLevelCost({...options, counts: [-1]}), RangeError);
  assert.throws(() => resolvePowerLevelCost({...options, counts: [0.5]}), RangeError);
  assert.equal(resolvePowerLevelCost({...options, counts: [1], strenuousBonus: 2}).total, 9);
});

test("Divine ordinary failures spend base cost, critical failures spend full cost", () => {
  assert.equal(spentMagicPoints({isDivine: true, success: false, baseCost: 4, totalCost: 11}), 4);
  assert.equal(spentMagicPoints({isDivine: true, success: false, critical: "failure", baseCost: 4, totalCost: 11}), 11);
  assert.equal(spentMagicPoints({isDivine: false, success: false, baseCost: 4, totalCost: 11}), 11);
});

test("Health-for-vitner sacrifice needs no offer while the reserve covers the cost", () => {
  assert.equal(resolveVitnerSacrifice({totalCost: 6, currentVitner: 6, currentHP: 10, maxHP: 10}), null);
  assert.equal(resolveVitnerSacrifice({totalCost: 4, currentVitner: 10, currentHP: 10, maxHP: 10}), null);
});

test("Health-for-vitner sacrifice grants two vitner per sacrificed health, rounding odd shortfalls up", () => {
  assert.deepEqual(resolveVitnerSacrifice({totalCost: 8, currentVitner: 2, currentHP: 10, maxHP: 10}),
    {shortfall: 6, health: 3, vitner: 6, resultingHP: 7, feasible: true});
  assert.deepEqual(resolveVitnerSacrifice({totalCost: 7, currentVitner: 2, currentHP: 10, maxHP: 10}),
    {shortfall: 5, health: 3, vitner: 6, resultingHP: 7, feasible: true});
});

test("Health-for-vitner sacrifice is blocked below -max HP and allowed exactly at -max HP", () => {
  assert.equal(resolveVitnerSacrifice({totalCost: 90, currentVitner: 0, currentHP: 2, maxHP: 40}).feasible, false);
  assert.deepEqual(resolveVitnerSacrifice({totalCost: 20, currentVitner: 0, currentHP: 0, maxHP: 10}),
    {shortfall: 20, health: 10, vitner: 20, resultingHP: -10, feasible: true});
  assert.equal(resolveVitnerSacrifice({totalCost: 22, currentVitner: 0, currentHP: 0, maxHP: 10}).feasible, false);
});
