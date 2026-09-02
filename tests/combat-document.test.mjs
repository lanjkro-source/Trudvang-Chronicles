import assert from "node:assert/strict";
import test from "node:test";

globalThis.foundry = {
  documents: {
    Combat: class {
      async createEmbeddedDocuments(embeddedName, data, options) {
        this.created = {embeddedName, data, options};
        return data;
      }
      async rollInitiative(ids, options) {
        this.fallback = {ids, options};
        return this;
      }
    }
  }
};
globalThis.game = {i18n: {localize: key => key}};

const { TrudvangCombat } = await import("../modules/documents/combat.mjs");

test("combat tracker initiative rolls use the actor's Trudvang initiative dialog", async () => {
  const calls = [];
  const combat = new TrudvangCombat();
  combat.combatants = new Map([
    ["trudvang", {actor: {rollInitiativeTrudvang: async options => { calls.push(options); }}}],
    ["other", {actor: {}}]
  ]);
  await combat.rollInitiative(["trudvang", "other"], {updateTurn: false});
  assert.equal(calls.length, 1);
  assert.equal(calls[0].combatant, combat.combatants.get("trudvang"));
  assert.deepEqual(combat.fallback, {ids: ["other"], options: {updateTurn: false}});
});

test("combatants can join only before every initiative for the current round is set", async () => {
  const combat = new TrudvangCombat();
  combat.started = true;
  combat.combatants = new Map([
    ["waiting", {initiative: null}],
    ["ready", {initiative: 12}]
  ]);
  await combat.createEmbeddedDocuments("Combatant", [{actorId: "new"}]);
  assert.deepEqual(combat.created, {embeddedName: "Combatant", data: [{actorId: "new"}], options: {}});
  combat.combatants.get("waiting").initiative = 4;
  await assert.rejects(() => combat.createEmbeddedDocuments("Combatant", [{actorId: "late"}]), /CombatantAdditionLocked/);
});
