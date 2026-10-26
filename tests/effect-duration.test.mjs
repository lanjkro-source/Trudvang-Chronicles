import assert from "node:assert/strict";
import test from "node:test";
import {normalizeEffectDuration, normalizeEffectStage, addDurationSeconds} from "../modules/rules/effect-duration.mjs";
test("short durations use exact five-second rounds; long durations keep their named units", () => {
  for (const [value, units, expected, normalized] of [[1,"minutes",12,"rounds"],[10,"seconds",2,"rounds"],
    [1,"seconds",0.2,"rounds"],[2,"weeks",14,"days"],[3,"centuries",300,"years"],
    [4,"hours",4,"hours"],[7,"days",7,"days"],[2,"years",2,"years"],[1,"months",1,"months"]]) {
    assert.deepEqual(normalizeEffectDuration({value, units}), {value: expected, units: normalized});
  }
  assert.deepEqual(normalizeEffectDuration({value: null, units: "seconds"}), {value: null, units: "seconds"});
});
test("power-level duration bonuses remain measured in seconds without corrupting days or rounds", () => {
  assert.deepEqual(addDurationSeconds({value: 12, units: "rounds"}, 35), {value: 19, units: "rounds"});
  assert.deepEqual(addDurationSeconds({value: 3, units: "days"}, 2 * 86400), {value: 5, units: "days"});
  assert.deepEqual(addDurationSeconds({value: 1, units: "years"}, 31536000), {value: 2, units: "years"});
  assert.deepEqual(normalizeEffectStage({label: "Next", durationValue: 2, durationUnit: "minutes"}),
    {label: "Next", durationValue: 24, durationUnit: "rounds"});
});
