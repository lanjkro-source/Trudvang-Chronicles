import assert from "node:assert/strict";
import test from "node:test";

const rendered = [];
const messages = [];
let nextDie = 20;
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, context) => {
  rendered.push({path, context});
  return "<article></article>";
}}}};
globalThis.Roll = class {
  constructor(formula) { this.formula = formula; }
  async evaluate() { this.total = nextDie; return this; }
};
globalThis.ChatMessage = {
  getSpeaker: ({actor}) => ({alias: actor.name}),
  create: async data => { messages.push(data); return data; }
};

const {rollUnder} = await import("../modules/dice.mjs");
const actor = {name: "Caster", img: "caster.webp", uuid: "Actor.caster"};

test("a magical 20 puts an actor-bound fatal-table action on the roll card", async () => {
  nextDie = 20;
  const fatalEffect = {kind: "vitner", threshold: 8, modifier: 23};
  const outcome = await rollUnder({actor, label: "Spell", target: 12, kind: "spell", fatalEffect});
  assert.equal(outcome.critical, "failure");
  assert.deepEqual(rendered.at(-1).context.fatalEffect, fatalEffect);
  assert.equal(rendered.at(-1).context.actorUuid, actor.uuid);
  assert.equal(messages.at(-1).speaker.alias, actor.name);
});

test("a divine 1 is an ordinary automatic success and carries no fatal action", async () => {
  nextDie = 1;
  const outcome = await rollUnder({actor, label: "Divine power", target: -3, kind: "divine",
    perfectSuccessMax: 0, automaticSuccessMax: 1,
    fatalEffect: {kind: "faith", threshold: 9, modifier: 11}});
  assert.equal(outcome.success, true);
  assert.equal(outcome.critical, "");
  assert.equal(rendered.at(-1).context.fatalEffect, null);
});
