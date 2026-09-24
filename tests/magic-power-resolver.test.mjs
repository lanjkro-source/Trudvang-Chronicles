import assert from "node:assert/strict";
import test from "node:test";
import {powerLevelUnitCost, resolvePowerLevelCost, spentMagicPoints} from "../modules/rules/magic-power-resolver.mjs";

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
