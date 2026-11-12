import assert from "node:assert/strict";
import {test} from "node:test";
import {effectDegree, isGradedEffect, cumulativeChangeValue, PERMANENT_RELIGION_EFFECT_IDS, isPermanentEffect} from "../modules/rules/effect-stacking.mjs";

test("effectDegree returns 0 for an explicit degree 0, and 1 for a missing degree", () => {
  assert.equal(effectDegree({system: {degree: 0}}), 0);
  assert.equal(effectDegree({system: {degree: 1}}), 1);
  assert.equal(effectDegree({system: {degree: 3}}), 3);
  assert.equal(effectDegree({system: {}}), 1, "missing degree defaults to 1");
  assert.equal(effectDegree({system: {degree: null}}), 1, "null degree defaults to 1");
  assert.equal(effectDegree({system: {degree: undefined}}), 1, "undefined degree defaults to 1");
  assert.equal(effectDegree({system: {degree: "2"}}), 2, "numeric string degree is parsed");
  assert.equal(effectDegree({}), 1, "no system defaults to 1");
});

test("cumulativeChangeValue scales bodyMax by degree, yielding no change at degree 0", () => {
  const change = {key: "system.modifiers.bodyMax", type: "add", value: "-1"};
  const degreeZero = {system: {stackId: "trudvang-serment-de-sang", stacking: "stack", degree: 0}};
  const degreeOne = {system: {stackId: "trudvang-serment-de-sang", stacking: "stack", degree: 1}};
  const degreeTwo = {system: {stackId: "trudvang-serment-de-sang", stacking: "stack", degree: 2}};

  assert.equal(cumulativeChangeValue(degreeZero, change), "0", "degree 0 adds no max HP");
  assert.equal(cumulativeChangeValue(degreeOne, change), "-1", "degree 1 adds -1 max HP");
  assert.equal(cumulativeChangeValue(degreeTwo, change), "-2", "degree 2 adds -2 max HP");
  assert.equal(change.value, "-1", "the source change value is not rewritten");
});

test("graded GM states keep their fixed value and are not scaled by degree", () => {
  const change = {key: "system.modifiers.rolls.allActions", type: "add", value: "-1"};
  const fatigued = {system: {stackId: "trudvang-fatigued", stacking: "stack", degree: 4}};
  assert.equal(cumulativeChangeValue(fatigued, change), "-1", "graded states are not scaled");
  assert.equal(isGradedEffect(fatigued), true);
  assert.equal(isGradedEffect(degreeZero()), true);
});

function degreeZero() {
  return {system: {stackId: "trudvang-serment-de-sang", stacking: "stack", degree: 0}};
}

test("PERMANENT_RELIGION_EFFECT_IDS and isPermanentEffect recognize both religion effects", () => {
  assert.ok(PERMANENT_RELIGION_EFFECT_IDS.has("trudvang-serment-de-sang"));
  assert.ok(PERMANENT_RELIGION_EFFECT_IDS.has("trudvang-parjure"));
  assert.equal(PERMANENT_RELIGION_EFFECT_IDS.size, 2);

  assert.equal(isPermanentEffect({system: {stackId: "trudvang-serment-de-sang"}}), true);
  assert.equal(isPermanentEffect({system: {stackId: "trudvang-parjure"}, flags: {}}), true);
  assert.equal(isPermanentEffect({system: {stackId: "trudvang-fatigued"}}), false);
  assert.equal(isPermanentEffect({system: {stackId: "trudvang-fatigued"}, flags: {"trudvang-chronicles": {permanent: true}}}), true);
  assert.equal(isPermanentEffect({}), false);
});
