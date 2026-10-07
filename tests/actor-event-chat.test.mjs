import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {postActorEvent} from "../modules/actor-event-chat.mjs";
import {applyDamageToActor} from "../modules/damage-application.mjs";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const set = (object, path, value) => {
  const keys = path.split("."), leaf = keys.pop();
  keys.reduce((parent, key) => parent[key] ??= {}, object)[leaf] = value;
};
globalThis.foundry = {documents: {Actor: class {
  async update(changes) {
    for (const [key, value] of Object.entries(changes)) { set(this, key, value); set(this._source, key, value); }
    return this;
  }
}, ActiveEffect: class {}}, applications: {handlebars: {renderTemplate: async () => ""}},
data: {ActiveEffectTypeDataModel: class {}}};
globalThis.Hooks = {call: () => true};
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const users = [{id: "gm", isGM: true}, {id: "offline-gm", isGM: true, active: false},
  {id: "owner", active: true}, {id: "offline-owner", active: false}, {id: "observer"}, {id: "other-player"}];

function runtime(t, code = "fr") {
  const previous = {game: globalThis.game, ChatMessage: globalThis.ChatMessage};
  t.after(() => { globalThis.game = previous.game; globalThis.ChatMessage = previous.ChatMessage; });
  const lang = JSON.parse(readFileSync(new URL(`../lang/${code}.json`, import.meta.url), "utf8"));
  const messages = [];
  globalThis.game = {users, user: users[0], i18n: {
    localize: key => get(lang, key),
    format: (key, data) => get(lang, key).replace(/\{(\w+)\}/g, (_, key) => data[key] ?? "")
  }};
  globalThis.ChatMessage = {getSpeaker: ({actor, alias, token}) => ({actor: actor.id, alias, token: token?.id}),
    create: async data => { messages.push(data); return data; }};
  const actor = Object.assign(new TrudvangActor(), {id: "actor", name: "Test", type: "character", isOwner: true,
    testUserPermission: (user, level) => level === "OWNER" && ["owner", "offline-owner"].includes(user.id),
    items: [], system: {resources: {body: {current: 20, value: 20}, fear: {value: 3}}, fearFactorModifier: -2},
    _source: {system: {resources: {body: {value: 20}, fear: {value: 3}}}}});
  return {actor, messages};
}

for (const code of ["fr", "en"]) {
  test(`${code}: direct damage and fear applications have one discreet public notice`, async t => {
    const {actor, messages} = runtime(t, code);
    for (const kind of ["damage", "fear"]) {
      await postActorEvent({actor, kind, amount: 8675309});
      const announcement = messages.at(-1);
      assert.deepEqual(announcement.whisper, []);
      assert.match(announcement.content, /8675309/);
      assert.equal(announcement.blind, false);
      assert.doesNotMatch(announcement.content, /chat-card|<div|<header/);
    }
    assert.equal(messages.length, 2);
  });

  test(`${code}: movement has only one discreet public notice, including its CP cost`, async t => {
    const {actor, messages} = runtime(t, code);
    actor.token = {id: "token", name: "Token name"};
    const mode = game.i18n.localize("TRUDVANG.Npc.MovementModes.flight");
    await postActorEvent({actor, kind: "movement", amount: 8675309, mode, meters: 12.5});
    assert.ok(messages[0].content.includes(mode));
    assert.match(messages[0].content, /12\.5 m/);
    assert.equal(messages.length, 1);
    assert.match(messages[0].content, new RegExp(`8675309 ${code === "fr" ? "PC" : "CP"}`));
    assert.doesNotMatch(messages[0].content, /chat-card|<div|<header/);
    assert.deepEqual(messages[0].speaker, {actor: "actor", alias: "Token name", token: "token"});
  });
}

test("unowned actors cannot publish events", async t => {
  const {actor, messages} = runtime(t);
  actor.isOwner = false;
  assert.equal(await postActorEvent({actor, kind: "fear", amount: 3}), null);
  assert.equal(messages.length, 0);
});

test("event content escapes actor names and uses the namespaced ChatMessage implementation", async t => {
  const {actor, messages} = runtime(t);
  const previous = foundry.documents.ChatMessage;
  t.after(() => { foundry.documents.ChatMessage = previous; });
  foundry.documents.ChatMessage = {implementation: globalThis.ChatMessage};
  globalThis.ChatMessage = {create: () => assert.fail("the global fallback must not run")};
  actor.name = '<img src=x onerror="alert(1)">&';
  await postActorEvent({actor, kind: "damage", amount: 1});
  assert.doesNotMatch(messages[0].content, /<img/);
  assert.match(messages[0].content, /&lt;img.*&quot;.*&gt;&amp;/);
});

test("damage application reports the actual health loss after armor and natural protection", async t => {
  const {actor, messages} = runtime(t);
  actor.system.protection = 6;
  actor.items = [{id: "armor", type: "armor", system: {equipped: true, breach: {value: 50}}}];
  let armorUpdate;
  actor.updateEmbeddedDocuments = async (_type, updates) => { armorUpdate = updates; };
  const result = await applyDamageToActor({actor, damage: 8});
  assert.equal(result.bodyDamage, 2);
  assert.equal(actor.system.resources.body.value, 18);
  assert.equal(armorUpdate[0]["system.breach.value"], 47);
  assert.equal(messages.length, 1);
  assert.match(messages[0].content, /2 PS perdus/);
});

test("damage bypassing armor reports the full loss, while a blocked hit reports zero", async t => {
  const {actor, messages} = runtime(t);
  actor.system.protection = 100;
  await applyDamageToActor({actor, damage: 8, ignoreArmor: true});
  assert.match(messages.at(-1).content, /8 PS perdus/);
  await applyDamageToActor({actor, damage: 8});
  assert.match(messages.at(-1).content, /0 PS perdus/);
});

test("fear application announces each character and reports the gain after mitigation", async t => {
  const {actor, messages} = runtime(t);
  const result = await actor.applyFearFactor(10);
  assert.equal(result.applied, 8);
  assert.equal(actor._source.system.resources.fear.value, 11);
  assert.equal(messages.length, 1);
  assert.match(messages[0].content, /\+8 point/);
  actor.system.fearFactorModifier = -20;
  await actor.applyFearFactor(10);
  assert.match(messages.at(-1).content, /\+0 point/);
  actor.type = "npc";
  assert.equal(await actor.applyFearFactor(10), null);
  assert.equal(messages.length, 2);
});

test("token-bar losses announce damage once, including negative health, but healing and vetoed updates do not", async t => {
  const {actor, messages} = runtime(t);
  await actor.modifyTokenAttribute("resources.body", -25, true);
  assert.equal(actor.system.resources.body.value, -5);
  assert.equal(messages.length, 1);
  assert.match(messages[0].content, /25 PS perdus/);
  await actor.modifyTokenAttribute("resources.body", 3, true);
  assert.equal(messages.length, 1);
  const call = Hooks.call;
  t.after(() => { Hooks.call = call; });
  Hooks.call = () => false;
  await actor.modifyTokenAttribute("resources.body", -2, true);
  assert.equal(actor.system.resources.body.value, -2);
  assert.equal(messages.length, 1);
});

test("failed resource updates cannot announce damage or fear that was never applied", async t => {
  const {actor, messages} = runtime(t);
  actor.update = async () => { throw new Error("update failed"); };
  await assert.rejects(applyDamageToActor({actor, damage: 3, ignoreArmor: true}), /update failed/);
  await assert.rejects(actor.applyFearFactor(3), /update failed/);
  await assert.rejects(actor.modifyTokenAttribute("resources.body", -3, true), /update failed/);
  assert.equal(messages.length, 0);
});

test("token-bar damage reports the final update when a module changes the requested loss", async t => {
  const {actor, messages} = runtime(t);
  const call = Hooks.call;
  t.after(() => { Hooks.call = call; });
  Hooks.call = (_hook, _request, updates) => { updates["system.resources.body.value"] = 17; return true; };
  await actor.modifyTokenAttribute("resources.body", -10, true);
  assert.equal(actor.system.resources.body.value, 17);
  assert.match(messages[0].content, /3 PS perdus/);
});

test("source-card applications can suppress standalone notices without changing damage or fear", async t => {
  const {actor, messages} = runtime(t);
  assert.equal((await applyDamageToActor({actor, damage: 3, announce: false})).bodyDamage, 3);
  assert.equal((await actor.applyFearFactor(10, {announce: false})).applied, 8);
  assert.equal(actor.system.resources.body.value, 17);
  assert.equal(actor._source.system.resources.fear.value, 11);
  assert.equal(messages.length, 0);
});
