import assert from "node:assert/strict";
import test from "node:test";

globalThis.foundry = {
  documents: {
    Combat: class {
      async rollInitiative(ids, options) {
        this.fallback = {ids, options};
        return this;
      }
    }
  }
};

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
