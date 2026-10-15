import test from "node:test";
import assert from "node:assert/strict";
import {calculateTraitModifier} from "../modules/rules/trait-roll-resolver.mjs";

test("resistance trait calculations support first, second, average, sum and best", () => {
  const values = [2, -1];
  assert.equal(calculateTraitModifier(values, "first"), 2);
  assert.equal(calculateTraitModifier(values, "second"), -1);
  assert.equal(calculateTraitModifier(values, "average"), 0.5);
  assert.equal(calculateTraitModifier(values, "sum"), 1);
  assert.equal(calculateTraitModifier(values, "best"), 2);
  assert.equal(calculateTraitModifier([], "sum"), 0);
});
