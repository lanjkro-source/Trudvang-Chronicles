import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {DIVINE_FAILURE_ROWS, divineFailurePowers, planDivineFailure, divineFailureRestriction} from "../modules/rules/divine-failure.mjs";
globalThis.foundry = {};
const {spellAvailability} = await import("../modules/rules/spell-availability.mjs");
const {applyDivineFailure} = await import("../modules/fatal-result-chat.mjs");

const scope = "trudvang-chronicles";
const rules = "TRUDVANG.DivineFailure.";
const candidates = ["a", "b", "c"].map(id => ({id, name: id.toUpperCase()}));
const effect = (kind, powerIds = [], extra = {}) => ({flags: {[scope]: {divineFailure: {kind, powerIds}}}, ...extra});

test("all actionable divine table rows use their own duration and selection", async () => {
  const {tables} = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url)));
  const table = tables.find(table => table.flags[scope].starterId === "fatal-failure-effects");
  assert.deepEqual(Object.keys(DIVINE_FAILURE_ROWS).map(Number), table.results.slice(1,-1).map(row => row.range[0]));
  const expected = [
    [21, "link", "1d6", "minutes", []], [31, "link", "1d6", "hours", []],
    [36, "powers", "1d6", "days", ["b","c"]], [41, "powers", "2d6", "days", ["a"]],
    [46, "powers", "2d6", "days", ["b","c"]], [51, "link", "1d6", "days", []],
    [55, "powers", null, "rounds", ["a"]], [57, "powers", null, "rounds", ["b","c"]],
    [59, "wrath", null, "rounds", []]
  ];
  for (const [row, kind, formula, units, ids] of expected) {
    const calls = [];
    const plan = await planDivineFailure(row, {power: candidates[0], candidates, roll: async formula => {
      calls.push(formula);
      return formula === "1d6" || formula === "2d6" ? 4 : 2;
    }});
    assert.deepEqual(plan, {kind, powers: ids.map(id => candidates.find(power => power.id === id)), duration: {value: formula ? 4 : null, units}});
    assert.deepEqual(calls, [...(ids.length > 1 ? ["1d3","1d3","1d2"] : []), ...(formula ? [formula] : [])]);
  }
  assert.equal(await planDivineFailure(60, {}), null);
});

test("the random pool contains learned, still accessible powers and runes exactly once", () => {
  const tablet = {type: "tablet", system: {catalogId: "t", level: 2}};
  const feat = (id, level, type = "divineFeat", isRune = false) =>
    ({type, name: id, system: {catalogId: id, level, tabletId: "t", isRune}});
  const actor = {type: "character", items: [tablet, feat("a", 2), feat("a", 2),
    feat("b", 3), feat("c", 1), feat("d", 1, "spell"), feat("r", 1, "divineFeat", true)],
    effects: [effect("powers", ["c"])]};
  assert.deepEqual(divineFailurePowers(actor).map(row => row.id), ["a", "r"]);
});

test("active divine restrictions only block the relevant power or divine expenditure", () => {
  const actor = {type: "character", effects: [effect("powers", ["a"]), effect("link", [], {duration: {expired: true}})]};
  const power = {type: "divineFeat", system: {catalogId: "a"}};
  assert.equal(spellAvailability(actor, power).reason, rules + "PowerLost");
  assert.equal(divineFailureRestriction(actor, "b"), "");
  actor.effects.push(effect("link"));
  assert.equal(divineFailureRestriction(actor, "b"), rules + "LinkLost");
  assert.equal(divineFailureRestriction(actor, "b", {spending: false}), "");
  actor.effects.push(effect("wrath"));
  assert.equal(divineFailureRestriction(actor, "new-power"), rules + "Wrath");
});

test("applying a result binds to the original actor and writes only one timed effect", async () => {
  const flag = {row: 41, actorUuid: "Scene.test.Token.caster.Actor.caster", power: candidates[0]};
  const message = {id: "message000000001", isAuthor: true, isContentVisible: false,
    getFlag: () => flag, update: async update => {flag.applied = Object.values(update)[0];}};
  let created = 0;
  const actor = {isOwner: true, effects: new Map(), createTrudvangEffect: async (data, options) => {
    created++;
    assert.equal(data._id, message.id);
    assert.equal(options.keepId, true);
    assert.deepEqual(data.duration, {value: 4, units: "days"});
    assert.deepEqual(data.flags[scope].divineFailure.powerIds, ["a"]);
    actor.effects.set(data._id, data);
    return data;
  }};
  globalThis.game = {user: {isGM: false}, i18n: {localize: key => key, format: (key, data) => key + data.powers}};
  globalThis.foundry = {utils: {fromUuid: async uuid => {assert.equal(uuid, flag.actorUuid); return actor;}}};
  globalThis.Roll = class {async evaluate() {return {total: 4};}};
  globalThis.document = {createElement: () => ({set textContent(value) {this.innerHTML = value;}})};
  assert.equal(await applyDivineFailure(message), false);
  message.isContentVisible = true;
  assert.deepEqual(await Promise.all([applyDivineFailure(message), applyDivineFailure(message)]), [true,false]);
  assert.equal(await applyDivineFailure(message), false);
  assert.equal(created, 1);
});
