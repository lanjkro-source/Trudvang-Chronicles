import assert from "node:assert/strict";
import test from "node:test";
import { isCombatTurnStart, resetCurrentCombatantResources } from "../modules/combat.mjs";

test("combat resource resets occur only when the tracker advances to a turn", () => {
  assert.equal(isCombatTurnStart({round: 0, turn: null, combatantId: null}, {round: 1, turn: 0, combatantId: "combatant-id"}), true);
  assert.equal(isCombatTurnStart({round: 1, turn: 0, combatantId: "first"}, {round: 1, turn: 1, combatantId: "second"}), true);
  assert.equal(isCombatTurnStart({round: 2, turn: 0, combatantId: "first"}, {round: 1, turn: 2, combatantId: "last"}), false);
});

test("the active GM resets the resources of the combatant whose turn begins", async () => {
  let resets = 0;
  const actor = {resetCombatPoints: async () => { resets += 1; }};
  const combat = {started: true, combatants: new Map([["combatant-id", {id: "combatant-id", actor}]])};
  const result = await resetCurrentCombatantResources(combat, {combatantId: "combatant-id"}, {isActiveGM: true});
  assert.equal(result, true);
  assert.equal(resets, 1);
});

test("turn resource resets ignore inactive combats, missing combatants, and non-GMs", async () => {
  let resets = 0;
  const actor = {resetCombatPoints: async () => { resets += 1; }};
  const combat = {started: true, combatants: new Map([["combatant-id", {id: "combatant-id", actor}]])};
  assert.equal(await resetCurrentCombatantResources(combat, {combatantId: "combatant-id"}, {isActiveGM: false}), false);
  assert.equal(await resetCurrentCombatantResources({...combat, started: false}, {combatantId: "combatant-id"}, {isActiveGM: true}), false);
  assert.equal(await resetCurrentCombatantResources(combat, {combatantId: "missing"}, {isActiveGM: true}), false);
  assert.equal(resets, 0);
});
