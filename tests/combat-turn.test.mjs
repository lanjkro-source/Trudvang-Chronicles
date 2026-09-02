import assert from "node:assert/strict";
import test from "node:test";
import { activateHighestInitiativeCombatant, combatInitiativesAreReady, decrementSurvivalRounds, isCombatRoundStart, isCombatTurnStart, refreshCombatantResources, resetCombatInitiatives, resetCurrentCombatantResources } from "../modules/combat.mjs";

test("combat resource resets occur only when the tracker advances to a turn", () => {
  assert.equal(isCombatTurnStart({round: 0, turn: null, combatantId: null}, {round: 1, turn: 0, combatantId: "combatant-id"}), true);
  assert.equal(isCombatTurnStart({round: 1, turn: 0, combatantId: "first"}, {round: 1, turn: 1, combatantId: "second"}), true);
  assert.equal(isCombatTurnStart({round: 2, turn: 0, combatantId: "first"}, {round: 1, turn: 2, combatantId: "last"}), false);
});

test("a new round clears the initiatives of every combatant once through Foundry's reset API", async () => {
  let resets = 0;
  const combat = {started: true, resetAll: async () => { resets += 1; }};
  assert.equal(isCombatRoundStart({round: 1}, {round: 2}), true);
  assert.equal(await resetCombatInitiatives(combat, {round: 1}, {round: 2}, {isActiveGM: true}), true);
  assert.equal(await resetCombatInitiatives(combat, {round: 2}, {round: 1}, {isActiveGM: true}), false);
  assert.equal(await resetCombatInitiatives(combat, {round: 2}, {round: 3}, {isActiveGM: false}), false);
  assert.equal(resets, 1);
});

test("once every initiative is rolled, the new leader becomes active and receives refreshed resources", async () => {
  let turn = 1;
  let resets = 0;
  const leader = {id: "leader", initiative: 18, actor: {resetCombatPoints: async () => { resets += 1; }}};
  const follower = {id: "follower", initiative: 12, actor: {resetCombatPoints: async () => { throw new Error("wrong actor"); }}};
  const combat = {
    started: true,
    combatants: new Map([[leader.id, leader], [follower.id, follower]]),
    turns: [leader, follower],
    current: {combatantId: follower.id},
    update: async update => { turn = update.turn; }
  };
  assert.equal(combatInitiativesAreReady(combat), true);
  assert.equal(await activateHighestInitiativeCombatant(combat, {isActiveGM: true}), true);
  assert.equal(turn, 0);
  assert.equal(resets, 1);
  follower.initiative = null;
  assert.equal(combatInitiativesAreReady(combat), false);
  assert.equal(await activateHighestInitiativeCombatant(combat, {isActiveGM: true}), false);
});

test("actor updates refresh only their matching combatant resources", () => {
  let updates = 0;
  const actor = {id: "actor-id", uuid: "Actor.actor-id"};
  const combat = {combatants: new Map([
    ["matching", {actor, updateResource: () => { updates += 1; }}],
    ["other", {actor: {id: "other"}, updateResource: () => { throw new Error("wrong combatant"); }}]
  ])};
  assert.equal(refreshCombatantResources(combat, actor), 1);
  assert.equal(updates, 1);
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

test("a new round consumes one life-spark round for each unique dying combatant", async () => {
  const updates = [];
  const dying = {
    id: "dying", system: {resources: {body: {current: -2}}, survivalRounds: 3},
    update: async change => updates.push(change)
  };
  const stable = {
    id: "stable", system: {resources: {body: {current: 4}}, survivalRounds: 3},
    update: async () => { throw new Error("living actor must not be updated"); }
  };
  const expired = {
    id: "expired", system: {resources: {body: {current: 0}}, survivalRounds: 0},
    update: async () => { throw new Error("expired timer must not become negative"); }
  };
  const combat = {started: true, combatants: new Map([["first", {actor: dying}], ["duplicate", {actor: dying}], ["stable", {actor: stable}], ["expired", {actor: expired}]])};
  assert.equal(await decrementSurvivalRounds(combat, {isActiveGM: true}), 1);
  assert.deepEqual(updates, [{"system.survivalRounds": 2}]);
  assert.equal(await decrementSurvivalRounds(combat, {isActiveGM: false}), 0);
});
