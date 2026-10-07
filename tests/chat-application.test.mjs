import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";

const documents = new Map();
const gm = {id: "gm", isGM: true, active: true};
const player = {id: "player", active: true};
const observer = {id: "observer", active: true};
const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const lang = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
Handlebars.registerHelper("localize", (key, options) => {
  const data = options.hash ?? {};
  return String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, key) => data[key] ?? "");
});
const template = name => Handlebars.compile(readFileSync(new URL(`../templates/chat/${name}.hbs`, import.meta.url), "utf8"));
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) => template(path.split("/").at(-1).replace(".hbs", ""))(data)}},
  utils: {fromUuid: async uuid => documents.get(uuid)}};
globalThis.ChatMessage = {create: () => assert.fail("applications must update the source card, never create another message")};
const {applyChatApplication, hasChatApplication, registerChatApplicationSocket, requestChatApplication, requestDamageTargets} = await import("../modules/chat-application.mjs");
const {rollDamage} = await import("../modules/dice.mjs");

function runtime(t, kind = "damage") {
  const previous = globalThis.game;
  t.after(() => { globalThis.game = previous; });
  const users = new Map([gm, player, observer].map(user => [user.id, user]));
  const messages = new Map();
  globalThis.game = {user: gm, users, messages, i18n: {
    localize: key => get(lang, key) ?? key,
    format: (key, data) => String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, key) => data[key] ?? "")
  }};
  const flags = {};
  const updates = [];
  const message = {id: crypto.randomUUID(), author: gm, whisper: [], content: kind === "fear"
    ? template("fear-card")({actorName: "Monster", total: 10})
    : template("damage-card")({actorName: "Attacker", itemName: "Sword", total: 8,
      targetsHTML: template("damage-targets")({total: 8, targets: []})}),
    getFlag: (_scope, key) => flags[key], update: async changes => {
      updates.push(changes); message.content = changes.content;
      for (const [key, value] of Object.entries(changes)) if (key.startsWith("flags.trudvang-chronicles.")) flags[key.split(".").at(-1)] = value;
    }};
  messages.set(message.id, message);
  const makeActor = (id, protection = 0) => {
    const actor = {uuid: `Actor.${id}`, type: "character", name: id, isOwner: true, items: [],
      testUserPermission: user => user.id === player.id || user.isGM,
      system: {protection, resources: {body: {value: 20, current: 20}, fear: {value: 0}}},
      update: async changes => { actor.system.resources.body.value = changes["system.resources.body.value"]; },
      applyFearFactor: async (amount, {announce}) => {
        assert.equal(announce, false);
        const applied = Math.max(0, amount - protection);
        actor.system.resources.fear.value += applied; return {applied};
      }};
    documents.set(actor.uuid, actor);
    return actor;
  };
  const addDamageTarget = actor => {
    message.content = message.content.replace("</article>", `<div class="damage-target"><button data-action="apply-damage" data-target-actor-uuid="${actor.uuid}" data-damage="8"></button></div></article>`);
  };
  const payload = (actor, extra = {}) => ({messageId: message.id, userId: player.id, actorUuid: actor.uuid,
    channel: kind === "fear" ? "fear" : "body", ...extra});
  const makeToken = (id, actor) => {
    const token = {uuid: `Scene.scene.Token.${id}`, documentName: "Token", actor, name: `${id} token`, texture: {src: `${id}.webp`}};
    documents.set(token.uuid, token); return token;
  };
  return {message, flags, updates, makeActor, makeToken, addDamageTarget, payload};
}

test("damage rows grow on the original roll card, with the actual loss after each target's protection", async t => {
  const {message, flags, updates, makeActor, addDamageTarget, payload} = runtime(t);
  const first = makeActor("First", 5), second = makeActor("Second", 2);
  addDamageTarget(first); addDamageTarget(second);
  assert.deepEqual(await applyChatApplication(payload(first)), {status: "applied", amount: 3});
  assert.equal(first.system.resources.body.value, 17);
  assert.equal(flags.applications.length, 1);
  assert.match(message.content, /First/); assert.match(message.content, /−3 PS/);
  assert.deepEqual(await applyChatApplication(payload(second)), {status: "applied", amount: 6});
  assert.equal(flags.applications.length, 2);
  assert.match(message.content, /−3 PS/); assert.match(message.content, /−6 PS/);
  assert.equal((message.content.match(/data-application-results/g) ?? []).length, 1);
  assert.equal((message.content.match(/class="trait-situation-result application-result"/g) ?? []).length, 2);
  assert.match(message.content, /<h3>Sword<\/h3>/, "the original roll, buttons and details are preserved");
  assert.equal(updates.length, 2);
});

test("simultaneous fear applications preserve all rows and apply each shared actor only once", async t => {
  const {message, flags, makeActor, payload} = runtime(t, "fear");
  const first = makeActor("First", 3), second = makeActor("Second", 20);
  const results = await Promise.all([applyChatApplication(payload(first)), applyChatApplication(payload(second)), applyChatApplication(payload(first))]);
  assert.deepEqual(results.map(result => result.status), ["applied", "applied", "alreadyApplied"]);
  assert.equal(first.system.resources.fear.value, 7);
  assert.equal(second.system.resources.fear.value, 0);
  assert.equal(flags.applications.length, 2);
  assert.match(message.content, /\+7 peur/); assert.match(message.content, /\+0 peur/);
});

test("armor bypass and normal damage are mutually exclusive applications of one roll to one actor", async t => {
  const {message, makeActor, addDamageTarget, payload} = runtime(t);
  const actor = makeActor("Target", 100); addDamageTarget(actor);
  assert.deepEqual(await applyChatApplication(payload(actor, {ignoreArmor: true, damage: 9999})), {status: "applied", amount: 8});
  assert.equal(actor.system.resources.body.value, 12, "damage comes from the source card, not the socket payload");
  assert.equal((await applyChatApplication(payload(actor))).status, "alreadyApplied");
  assert.equal(actor.system.resources.body.value, 12);
  assert.equal(hasChatApplication(message, actor.uuid, "body"), true);
});

test("equipped defense items get their own row and can never masquerade as another actor's equipment", async t => {
  const {message, makeActor, payload} = runtime(t);
  const actor = makeActor("Target"), other = makeActor("Other");
  const item = {uuid: `${actor.uuid}.Item.shield`, type: "shield", name: "Shield", parent: actor, isOwner: true,
    system: {breach: {value: 30}}, update: async changes => { item.system.breach.value = changes["system.breach.value"]; }};
  documents.set(item.uuid, item);
  message.content = message.content.replace("</article>", `<button data-target-item-uuid="${item.uuid}" data-damage="8"></button></article>`);
  const request = payload(actor, {channel: "defense", itemUuid: item.uuid});
  assert.deepEqual(await applyChatApplication(request), {status: "applied", amount: 5});
  assert.equal(item.system.breach.value, 25);
  assert.match(message.content, /Target — Shield/); assert.match(message.content, /−5 VI/);
  assert.equal((await applyChatApplication(request)).status, "alreadyApplied");
  assert.equal((await applyChatApplication({...request, actorUuid: other.uuid})).status, "unavailable");
});

test("unowned actors, inaccessible messages, unknown targets and invalid cards cannot apply points", async t => {
  const {message, makeActor, payload, addDamageTarget, updates} = runtime(t);
  const actor = makeActor("Target"); addDamageTarget(actor);
  assert.equal((await applyChatApplication(payload(actor, {userId: observer.id}))).status, "unavailable");
  actor.isOwner = false;
  assert.equal((await applyChatApplication(payload(actor))).status, "unavailable");
  actor.isOwner = true;
  message.whisper = [gm.id];
  assert.equal((await applyChatApplication(payload(actor))).status, "unavailable");
  message.whisper = []; message.content = "<article>No damage action here</article>";
  assert.equal((await applyChatApplication(payload(actor))).status, "unavailable");
  assert.equal((await applyChatApplication(payload(actor, {channel: "other"}))).status, "unavailable");
  assert.equal(actor.system.resources.body.value, 20); assert.equal(updates.length, 0);
});

test("a failed actor update cannot create an applied row", async t => {
  const {makeActor, payload, addDamageTarget, updates} = runtime(t);
  const actor = makeActor("Target"); addDamageTarget(actor);
  actor.update = async () => { throw new Error("update failed"); };
  await assert.rejects(applyChatApplication(payload(actor)), /update failed/);
  assert.equal(updates.length, 0);
});

test("retrying a failed source-card update records the result without applying points again", async t => {
  const {message, makeActor, addDamageTarget, payload, flags} = runtime(t);
  const actor = makeActor("Target"); addDamageTarget(actor);
  const update = message.update;
  message.update = async () => { throw new Error("chat update failed"); };
  await assert.rejects(applyChatApplication(payload(actor)), /chat update failed/);
  assert.equal(actor.system.resources.body.value, 12);
  assert.equal(flags.applications, undefined);
  message.update = update;
  assert.deepEqual(await applyChatApplication(payload(actor)), {status: "applied", amount: 8});
  assert.equal(actor.system.resources.body.value, 12);
  assert.equal(flags.applications.length, 1);
});

test("the requesting GM can update the source directly, while a player without a GM leaves resources intact", async t => {
  const {message, makeActor, addDamageTarget} = runtime(t);
  const actor = makeActor("Target"); addDamageTarget(actor);
  assert.deepEqual(await requestChatApplication({message, actor, channel: "body"}), {status: "applied", amount: 8});
  game.user = player;
  const other = makeActor("Other"); addDamageTarget(other);
  game.users = new Map([[player.id, player]]);
  assert.deepEqual(await requestChatApplication({message, actor: other, channel: "body"}), {status: "unavailable"});
  assert.equal(other.system.resources.body.value, 20);
});

test("a player's click is relayed to one GM and appends a row without creating any message", async t => {
  const {message, makeActor, makeToken} = runtime(t);
  const actor = makeActor("Target"), token = makeToken("target", actor);
  const emitted = []; let handler;
  game.socket = {on: (_channel, callback) => { handler = callback; }, emit: (_channel, data) => { emitted.push(data); }};
  registerChatApplicationSocket();
  game.user = player;
  const adding = requestDamageTargets({message, tokens: [{actor, document: token}]});
  const addition = emitted.shift();
  assert.equal(addition.type, "chatDamageTargets");
  game.user = gm; await handler(addition);
  game.user = player; await handler(emitted.shift());
  assert.deepEqual(await adding, {status: "added", added: 1});
  const pending = requestChatApplication({message, actor, channel: "body"});
  const request = emitted.shift();
  assert.equal(request.type, "chatApplication");
  assert.equal(actor.system.resources.body.value, 20);
  game.user = gm; await handler(request);
  assert.equal(actor.system.resources.body.value, 12);
  game.user = player; await handler(emitted.shift());
  assert.deepEqual(await pending, {status: "applied", amount: 8});
  assert.match(message.content, /−8 PS/);
});

test("the plus button exists even with no initial target and deduplicates linked tokens by actor", async t => {
  const {message, flags, updates, makeActor, makeToken} = runtime(t);
  assert.match(message.content, /data-action="add-damage-targets"/);
  const actor = makeActor("Target"), first = makeToken("first", actor), linked = makeToken("linked", actor);
  assert.deepEqual(await requestDamageTargets({message, tokens: [first, linked, first]}), {status: "added", added: 1});
  assert.equal(flags.damageTargets.length, 1);
  assert.equal((message.content.match(/class="damage-target"/g) ?? []).length, 1);
  assert.equal(flags.damageTargets[0].tokenUuid, first.uuid);
  assert.match(message.content, /first.webp/);
  assert.deepEqual(await requestDamageTargets({message, tokens: [linked]}), {status: "unchanged", added: 0});
  assert.equal(updates.length, 1);
  assert.equal(actor.system.resources.body.value, 20, "adding a target does not apply damage");
});

test("adding targets serializes with applications without losing prior targets or results", async t => {
  const {message, flags, makeActor, makeToken, payload} = runtime(t);
  const first = makeActor("First"), second = makeActor("Second");
  await requestDamageTargets({message, tokens: [makeToken("first", first)]});
  await Promise.all([applyChatApplication(payload(first)), requestDamageTargets({message, tokens: [makeToken("second", second)]})]);
  assert.equal(flags.damageTargets.length, 2); assert.equal(flags.applications.length, 1);
  assert.match(message.content, /−8 PS/);
  assert.equal((message.content.match(/data-application-results/g) ?? []).length, 1);
  assert.equal((message.content.match(/class="damage-target"/g) ?? []).length, 2);
  await applyChatApplication(payload(second));
  assert.equal(flags.applications.length, 2);
});

test("target addition checks token identity, ownership and message access on the GM", async t => {
  const {message, makeActor, makeToken, updates} = runtime(t);
  const actor = makeActor("Target"), token = makeToken("target", actor);
  const payload = {type: "chatDamageTargets", messageId: message.id, userId: observer.id, tokenUuids: [token.uuid]};
  assert.equal((await applyChatApplication(payload)).added, 0);
  payload.userId = player.id; message.blind = true;
  assert.equal((await applyChatApplication(payload)).status, "unavailable");
  message.blind = false; payload.tokenUuids = [actor.uuid, "Scene.missing.Token.missing"];
  assert.equal((await applyChatApplication(payload)).added, 0);
  assert.equal(updates.length, 0);
});

test("a real damage roll stores its initial targets and the final halved amount on the expandable card", async t => {
  const {makeActor, makeToken} = runtime(t);
  const previous = {Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage};
  t.after(() => Object.assign(globalThis, previous));
  const target = makeActor("Target"), token = makeToken("first", target), linked = makeToken("linked", target);
  game.user = {...gm, targets: new Set([token, linked])};
  const cards = [];
  globalThis.Roll = class {constructor(formula) {this.formula = formula;} async evaluate() {this.total = 8;}};
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.uuid}), create: async data => {cards.push(data); return data;}};
  const result = await rollDamage({actor: makeActor("Attacker"), item: {type: "weapon", name: "Bow",
    system: {damage: "1d10", openRoll: 0, category: "ranged", strengthApplies: true}}, context: {usage: "ranged", longRange: true}});
  assert.equal(result, 4); assert.equal(cards.length, 1);
  assert.match(cards[0].content, /data-damage="4"/);
  assert.match(cards[0].content, /data-action="add-damage-targets"/);
  assert.equal(cards[0].flags["trudvang-chronicles"].damageTargets.length, 1);
  assert.equal(cards[0].flags["trudvang-chronicles"].damageTargets[0].actorUuid, target.uuid);
});

test("application rows escape custom token names and provide the same map-location control as resistance rows", async t => {
  const {message, makeActor, payload, addDamageTarget} = runtime(t);
  const actor = makeActor("Target"); addDamageTarget(actor);
  const token = {uuid: "Scene.scene.Token.token", documentName: "Token", actor, name: '<img src=x onerror="attack()">'};
  documents.set(token.uuid, token);
  await applyChatApplication(payload(actor, {tokenUuid: token.uuid}));
  assert.match(message.content, /data-action="locate-trait-situation-token"/);
  assert.match(message.content, /data-token-uuid="Scene.scene.Token.token"/);
  assert.match(message.content, /&lt;img/);
  assert.doesNotMatch(message.content, /<img src=x/);
});
