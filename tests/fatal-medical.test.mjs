import assert from "node:assert/strict";
import test from "node:test";
import {fatalAmnesia, fatalVitnerState, fatalNegationAppearance, planFatalMedical} from "../modules/rules/fatal-magic.mjs";
import {applyFatalMedical, lowerIntelligence} from "../modules/fatal-medical.mjs";

const scope = "trudvang-chronicles";

test("the five personal results use the correct dice, timing and failed spell cost", async () => {
  for (const [row, formulas, condition, days, damage] of [
    [48, ["1d3"], "amnesia", 0, 0],
    [52, ["1d10"], "unconscious", 7, 28],
    [54, ["1d10", "2d10x>=10"], "coma", 0, 3],
    [56, ["1d10", "2d10x>=9"], "unconscious", 0, 3],
    [57, ["1d10x>=6"], null, 14, 3]
  ]) {
    const calls = [];
    const plan = await planFatalMedical(row, async formula => {calls.push(formula); return 3;}, 28);
    assert.deepEqual(calls, formulas);
    assert.equal(plan.condition, condition);
    assert.equal(plan.depletionDays, days);
    assert.equal(plan.damage, damage);
    assert.equal(plan.intellect, row === 56);
  }
  assert.equal(await planFatalMedical(52, null, null), null);
  assert.deepEqual([4, 2, 1, 0, -1, -2, -4].map(lowerIntelligence), [2, 1, 0, -1, -2, -4, -4]);
});

test("amnesia and French cosmetic negation track independent durations", () => {
  const amnesia = {flags: {[scope]: {fatalMagic: {amnesia: true}}}};
  const negation = {flags: {[scope]: {fatalMagic: {third: true}}}};
  const actor = {effects: [amnesia, negation]};
  assert.equal(fatalAmnesia(actor), true);
  assert.deepEqual(fatalVitnerState(actor, 29), {max: 20, withheld: 9, depleted: false});
  assert.deepEqual([1, 3, 5, 7, 9, 10].map(fatalNegationAppearance), ["Bark", "Fingers", "Grass", "Fur", "", ""]);
  amnesia.duration = {expired: true};
  assert.equal(fatalAmnesia(actor), false);
  assert.equal(fatalVitnerState(actor, 29).max, 20);
});

test("52 persists independent unconsciousness and recovery timers and records damage once", async () => {
  const id = "medical000000001";
  const result = {row: 52, cost: 12};
  const writes = [];
  const receipts = {};
  const actor = {
    system: {resources: {body: {max: 20, current: 20}, vitner: {current: 8}}},
    _source: {system: {traits: {intelligence: 2}, resources: {body: {temporary: 3, temporaryMax: 3}}}},
    effects: new Map(), getFlag: () => receipts,
    createTrudvangEffect: async data => {actor.effects.set(data.system.stackId, data); return data;},
    update: async data => {writes.push(data); receipts[id] = data[`flags.${scope}.fatalVitnerLoss.${id}`];}
  };
  globalThis.game = {i18n: {localize: key => key, format: (key, data) => key + data.points}};
  globalThis.Roll = class {async evaluate() {return {total: 5};}};
  const update = async data => {
    for (const [path,value] of Object.entries(data)) {
      if (path.endsWith(".applied")) throw Error("chat offline");
      result[path.split(".").at(-1)] = value;
    }
  };
  const message = {id, update};
  await assert.rejects(applyFatalMedical(actor, message, result), /chat offline/);
  const [unconscious, depletion] = actor.effects.values();
  assert.deepEqual(unconscious.duration, {value: 60, units: "rounds"});
  assert.deepEqual(unconscious.statuses, ["unconscious"]);
  assert.deepEqual(depletion.duration, {value: 7, units: "days"});
  assert.equal(writes[0]["system.resources.body.temporary"], 0);
  assert.equal(writes[0]["system.resources.body.value"], 11);
  assert.equal(writes[0]["system.resources.vitner.value"], 1);
  message.update = async () => {};
  assert.equal(await applyFatalMedical(actor, message, result), true);
  assert.equal(writes.length, 1);
});
