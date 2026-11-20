import assert from "node:assert/strict";
import test from "node:test";
import {planFatalMagic, fatalVitnerState, storedVitnerForCurrent} from "../modules/rules/fatal-magic.mjs";

const scope = "trudvang-chronicles";
const effect = (metadata, options = {}) => ({flags: {[scope]: {fatalMagic: metadata}}, ...options});
globalThis.foundry = {};
const {applyFatalMagic} = await import("../modules/fatal-result-chat.mjs");

test("personal fatal magic applies the proper duration die, loss die and JO", async () => {
  for (const [row, lethargy, expected, duration, loss] of [
    [21, true, ["1d3"], {value: 3, units: "hours"}, 0],
    [23, false, ["1d3", "1d10"], {value: 3, units: "hours"}, 7],
    [25, true, ["1d3", "1d10"], {value: 3, units: "hours"}, 7],
    [29, true, ["1d6", "1d10"], {value: 3, units: "hours"}, 7],
    [31, false, ["1d10x>=9"], {value: 1, units: "days"}, 7],
    [49, false, [], {value: 7, units: "days"}, 0]
  ]) {
    const rolled = [];
    const plan = await planFatalMagic(row, async formula => {
      rolled.push(formula);
      return formula.startsWith("1d10") ? 7 : 3;
    });
    assert.deepEqual(rolled, expected);
    assert.deepEqual(plan, {lethargy, duration, reduction: loss, depleted: row === 49});
  }
  assert.equal(await planFatalMagic(33), null);
});

test("a temporary vitner reduction withholds points without erasing or replenishing spending", () => {
  const actor = {system: {modifiers: {vitnerValue: 0}}, effects: [effect({reduction: 7})]};
  actor.fatalVitnerState = fatalVitnerState(actor, 20);
  assert.deepEqual(actor.fatalVitnerState, {max: 13, withheld: 7, depleted: false});
  const storedAfterSpending = storedVitnerForCurrent(actor, 13 - 3);
  assert.equal(storedAfterSpending, 17);
  actor.effects[0].duration = {expired: true};
  actor.fatalVitnerState = fatalVitnerState(actor, 20);
  assert.deepEqual(actor.fatalVitnerState, {max: 20, withheld: 0, depleted: false});
  assert.equal(storedVitnerForCurrent(actor, storedAfterSpending), 17);
});

test("reductions keep an existing reserve above zero, and depletion temporarily overrides the cap", () => {
  const actor = {effects: [effect({reduction: 10}), effect({reduction: 16})]};
  assert.deepEqual(fatalVitnerState(actor, 20), {max: 1, withheld: 19, depleted: false});
  assert.deepEqual(fatalVitnerState(actor, 0), {max: 0, withheld: 0, depleted: false});
  actor.effects.push(effect({depleted: true}));
  assert.deepEqual(fatalVitnerState(actor, 20), {max: 1, withheld: 0, depleted: true});
});

test("retrying a depleted vitner card does not reset points twice", async () => {
  const id = "result0000000001";
  const flag = {row: 49, actorUuid: "Actor.original"};
  let writes = 0;
  const receipts = {};
  const actor = {isOwner: true, effects: new Map(), system: {resources: {vitner: {current: 10}}},
    createTrudvangEffect: async data => {
      assert.equal(data._id, id);
      assert.deepEqual(data.duration, {value: 7, units: "days"});
      actor.effects.set(id, data);
      return data;
    },
    getFlag: () => receipts,
    update: async changes => {
      writes++;
      assert.equal(changes["system.resources.vitner.value"], 1);
      receipts[id] = changes[`flags.${scope}.fatalVitnerLoss.${id}`];
    }
  };
  globalThis.game = {user: {isGM: false}, i18n: {localize: key => key}};
  globalThis.foundry = {utils: {fromUuid: async uuid => {assert.equal(uuid, flag.actorUuid); return actor;}}};
  globalThis.document = {createElement: () => ({set textContent(value) {this.innerHTML = value;}})};
  const message = {id, isAuthor: true, isContentVisible: true, getFlag: () => flag,
    update: async () => {throw Error("chat unavailable");}};
  await assert.rejects(applyFatalMagic(message), /chat unavailable/);
  message.update = async update => {flag.applied = Object.values(update)[0];};
  assert.equal(await applyFatalMagic(message), true);
  assert.equal(writes, 1);
  assert.equal(actor.effects.size, 1);
});
