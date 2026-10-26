import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {applySurprised, expireRoundEffects, SURPRISED_STATUS} from "../modules/combat-effects.mjs";
import {actorStateRollModifiers, rollModifierTotal} from "../modules/rules/roll-state-resolver.mjs";
import {mountedCombatValues, mountedCombatCost} from "../modules/rules/mounted-combat.mjs";

test("Surprised penalizes combat tests once, stacks with wounds/fear and ignores expired markers", () => {
  const actor = {system: {damage: {penalty: -3}, fearPenalty: -1}, isInCombatActive: () => true,
    effects: [{statuses: [SURPRISED_STATUS]}, {statuses: [SURPRISED_STATUS]}]};
  assert.equal(rollModifierTotal(actorStateRollModifiers(actor)), -9);
  assert.equal(rollModifierTotal(actorStateRollModifiers(actor, {combat: false})), -4);
  actor.effects.forEach(e => e.duration = {expired: true});
  assert.equal(rollModifierTotal(actorStateRollModifiers(actor)), -4);
});
test("round-bound surprise expires after the whole initiative cycle, including unlinked recipients", async () => {
  const combat = {id: "c", round: 3, started: true, combatants: []};
  const effect = {id: "s", statuses: [SURPRISED_STATUS], flags: {"trudvang-chronicles": {combatRoundExpiry: {combatId: "c", round: 3}}}};
  const removed = [];
  const actor = {effects: [effect], async deleteEmbeddedDocuments(type, ids) {
    assert.equal(type, "ActiveEffect"); removed.push(...ids);
  }};
  globalThis.game = {user: {}, users: {activeGM: {isSelf: true}}, actors: [], scenes: [{tokens: [{actor}]}]};
  await expireRoundEffects(combat); assert.deepEqual(removed, []);
  combat.round = 4;
  await expireRoundEffects(combat); assert.deepEqual(removed, ["s"]);
  removed.length = 0;
  effect.flags["trudvang-chronicles"].combatRoundExpiry.combatId = "other";
  await expireRoundEffects(combat); assert.deepEqual(removed, []);
  effect.flags["trudvang-chronicles"].combatRoundExpiry.combatId = "c";
  effect.disabled = true; effect.duration = {expired: true};
  await expireRoundEffects(combat, {ended: true}); assert.deepEqual(removed, ["s"], "old disabled markers are removed too");
});
test("applying the GM reference starts its lifetime at the current round", async () => {
  let data;
  globalThis.game.combat = {id: "active", round: 7, started: true};
  globalThis.game.i18n = {localize: key => key};
  const actor = {canUserModify: () => true, createTrudvangEffect: async d => (data = d)};
  await applySurprised(actor, {uuid: "Item.reference", effects: []});
  assert.deepEqual(data.statuses, [SURPRISED_STATUS]);
  assert.deepEqual(data.flags["trudvang-chronicles"].combatRoundExpiry, {combatId: "active", round: 7});
  assert.deepEqual(data.system.changes, [], "the status resolver owns the penalty, avoiding doubled −5");
});
test("all GM starter folders share the accent role and the reference is GM-only", () => {
  const source = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url)));
  for (const id of ["gmItems", "gmTables", "gm-macros"]) {
    assert.equal(source.folders[id].colorRole, "accent"); assert.equal(source.folders[id].defaultRole, "NONE");
  }
  const item = source.items.find(item => item.system?.catalogId === SURPRISED_STATUS);
  assert.equal(item.folder, "gmItems"); assert.equal(item.type, "effect");
  assert.deepEqual(item.effects[0].statuses, [SURPRISED_STATUS]);
});
test("mounted combat pays the Riding-adjusted CP cost while only the mount bonus modifies VC", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(mountedCombatCost), [15, 12, 9, 6, 3, 0]);
  assert.equal(mountedCombatValues({enabled: true, bonus: 4}).total, 4);
  assert.equal(mountedCombatValues({enabled: true}).bonus, 2);
  assert.deepEqual(mountedCombatValues({enabled: false, bonus: 9}), {enabled: false, bonus: 2, total: 0});
});
