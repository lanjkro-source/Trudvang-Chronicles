import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {creatureTokenDimensions} from "../modules/rules/creature-token-size.mjs";

test("creature size maps to the requested square token footprint", () => {
  const cases = [[0.1, 0.5], [0.33, 0.5], [0.49, 0.5], [0.5, 1], [0.75, 1], [1, 1], [1.5, 1], [2, 2],
    [3, 3], [4, 3], [5, 4], [6, 4], [7, 4], [8, 5], [9, 5], [10, 5], [12, 6], [13, 6], [15, 6], [100, 6]];
  for (const [size, side] of cases) assert.deepEqual(creatureTokenDimensions(size), {width: side, height: side}, `size ${size}`);
});

test("fractional, decimal-comma, suffixed and open-ended book sizes are accepted", () => {
  for (const size of ["1/3", "<1/3", "<1/2"]) {
    assert.deepEqual(creatureTokenDimensions(size), {width: 0.5, height: 0.5}, size);
  }
  for (const size of ["1/2", "≤1/2", ".5", "0,5", " 1 / 2 t "]) {
    assert.deepEqual(creatureTokenDimensions(size), {width: 1, height: 1}, size);
  }
  assert.deepEqual(creatureTokenDimensions("1,5"), {width: 1, height: 1});
  assert.deepEqual(creatureTokenDimensions("3t"), {width: 3, height: 3});
  assert.deepEqual(creatureTokenDimensions("10t"), {width: 5, height: 5});
  for (const size of ["10+", "10t+", ">10"]) assert.deepEqual(creatureTokenDimensions(size), {width: 6, height: 6});
});

test("invalid or missing sizes leave normal Foundry token defaults intact", () => {
  for (const size of [null, undefined, "", "unknown", "3 metres", "3t extra", "1/0", 0, -1, Infinity, NaN]) {
    assert.equal(creatureTokenDimensions(size), null, String(size));
  }
});

test("the eight starter prototypes use the same footprint as automatic token creation", () => {
  const content = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
  for (const actor of content.actors) {
    const dimensions = creatureTokenDimensions(actor.system.details.size);
    assert.equal(actor.prototypeToken.width, dimensions.width, actor.nameKey);
    assert.equal(actor.prototypeToken.height, dimensions.height, actor.nameKey);
  }
});
