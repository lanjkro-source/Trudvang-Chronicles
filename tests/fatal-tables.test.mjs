import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const {tables} = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));

for (const table of tables) {
  test(`${table.nameKey} can pass Foundry's range preflight`, () => {
    // Match the V14 RollTable#roll reduction: a zero lower bound is treated as
    // unset and overwritten by the next result, so the first range must start at 1.
    const availableRange = table.results.reduce((range, result) => {
      const [min, max] = result.range;
      if (!range[0] || min < range[0]) range[0] = min;
      if (!range[1] || max > range[1]) range[1] = max;
      return range;
    }, [null, null]);
    assert.deepEqual(availableRange, [1, 999]);
    for (const total of [1, 10, 20, 21, 60, 999]) {
      assert.equal(table.results.filter(result => total >= result.range[0] && total <= result.range[1]).length, 1);
    }
  });
}
