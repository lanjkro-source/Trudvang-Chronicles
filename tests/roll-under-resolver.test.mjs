import assert from "node:assert/strict";
import test from "node:test";
import {resolveRollUnderOutcome} from "../modules/rules/roll-under-resolver.mjs";

test("a divine 1 always succeeds, even below the target, without a perfect success", () => {
  assert.deepEqual(resolveRollUnderOutcome(1, -4, {perfectSuccessMax: 0, automaticSuccessMax: 1}),
    {success: true, critical: "", margin: 0});
});

test("vitner perfect successes retain their specialty threshold", () => {
  assert.equal(resolveRollUnderOutcome(2, -4, {perfectSuccessMax: 2}).critical, "success");
  assert.equal(resolveRollUnderOutcome(2, 10, {perfectSuccessMax: 1}).critical, "");
  assert.equal(resolveRollUnderOutcome(1, 10, {perfectSuccessMax: 0}).critical, "");
});

test("a 20 fails critically for both spells and divine powers regardless of target", () => {
  for (const options of [{perfectSuccessMax: 2}, {perfectSuccessMax: 0, automaticSuccessMax: 1}]) {
    assert.deepEqual(resolveRollUnderOutcome(20, 30, options),
      {success: false, critical: "failure", margin: null});
  }
});
