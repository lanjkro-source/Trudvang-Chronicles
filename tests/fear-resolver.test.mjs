import assert from "node:assert/strict";
import test from "node:test";
import { formatFearFactor, parseFearFactor, resolveFearStatus, resolveInsanityState, upgradeFearFactor } from "../modules/rules/fear-resolver.mjs";

test("fear can exceed the meter maximum and becomes madness above 50", () => {
  assert.deepEqual(resolveFearStatus({fear: 51}), {level: "mad", penalty: -7, insane: true});
  assert.equal(resolveInsanityState({fear: 51}), true);
});

test("madness remains active from 41 through 50, then clears at 40", () => {
  assert.deepEqual(resolveFearStatus({fear: 45, insane: true}), {level: "mad", penalty: -7, insane: true});
  assert.equal(resolveInsanityState({fear: 45, insane: true}), true);
  assert.deepEqual(resolveFearStatus({fear: 40, insane: true}), {level: "four", penalty: -5, insane: false});
  assert.equal(resolveInsanityState({fear: 40, insane: true}), false);
});

test("fear-factor notation supports ordinary and open rolls in the NPC sheet format", () => {
  assert.deepEqual(parseFearFactor("1d6"), {dice: 1, faces: 6, threshold: 0, valid: true});
  assert.deepEqual(parseFearFactor("1d10 (JO 8-10)"), {dice: 1, faces: 10, threshold: 8, valid: true});
  assert.equal(formatFearFactor({dice: "1d6", threshold: 0}), "1d6");
  assert.equal(formatFearFactor({dice: "1d10", threshold: 8}), "1d10 (JO 8-10)");
});

test("fear effects can only increase dice or strengthen the open roll, without weakening another component",()=>{
 assert.equal(upgradeFearFactor("2d10 (JO 8-10)","1d10"),"2d10 (JO 8-10)");
 assert.equal(upgradeFearFactor("2d10 (JO 8-10)","3d10"),"3d10 (JO 8-10)");
 assert.equal(upgradeFearFactor("2d10 (JO 8-10)","1d10 (JO 6-10)"),"2d10 (JO 6-10)");
 assert.equal(upgradeFearFactor("2d10 (JO 6-10)","1d10 (JO 9-10)"),"2d10 (JO 6-10)");
 assert.equal(upgradeFearFactor("","1d10 (JO 9-10)"),"1d10 (JO 9-10)");
 assert.equal(upgradeFearFactor("1d5","1d10"),"1d10");
 assert.equal(upgradeFearFactor("2d10","3d10","1d10 (JO 8-10)"),upgradeFearFactor("2d10","1d10 (JO 8-10)","3d10"));
});
