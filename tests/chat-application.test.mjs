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
const template = name => Handlebars.compile(readFileSync(new URL(`../templates/${name === "damage-roll-dialog" ? "app" : "chat"}/${name}.hbs`, import.meta.url), "utf8"));
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) => template(path.split("/").at(-1).replace(".hbs", ""))(data)}},
  utils: {fromUuid: async uuid => documents.get(uuid)}};
globalThis.ChatMessage = {create: () => assert.fail("applications must update the source card, never create another message")};
const {applyChatApplication, hasChatApplication, registerChatApplicationSocket, requestChatApplication, requestDamageTargets, requestDamageTargetRemoval,requestDamageImpact} = await import("../modules/chat-application.mjs");
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

test("area fear edits are limited to the original caster and GM and application follows the revised list", async t => {
 const {message,flags,makeActor,makeToken,payload} = runtime(t,"fear");
 const first = makeActor("Original target"), added = makeActor("Added target"), friend = makeActor("Friend");
 const hostile = Object.assign(makeToken("hostile",added),{parent:{id:"scene"},disposition:-1});
 const ally = Object.assign(makeToken("ally",friend),{parent:{id:"scene"},disposition:1});
 flags.fearContext = {areaSceneId:"scene",casterUserId:player.id,casterUuid:"Actor.caster",eligibility:{excludeCaster:true,intelligentOnly:true}};
 flags.fearTargets = [{actorUuid:first.uuid,name:first.name,canApply:true}];
 message.content = template("fear-card")({actorName:"Caster",total:10,fearArea:{notice:"5 m"},
  fearTargetsHTML:template("fear-targets")({total:10,targets:flags.fearTargets})});
 const edit = (type, data, user=player) => applyChatApplication({type,messageId:message.id,userId:user.id,...data});
 assert.deepEqual(await edit("chatAddFearTargets",{tokenUuids:[hostile.uuid]},observer),{status:"unavailable"});
 assert.deepEqual(await edit("chatAddFearTargets",{tokenUuids:[ally.uuid]}),{status:"updated"});
 assert.deepEqual(await applyChatApplication(payload(friend)),{status:"applied",amount:10});
 assert.deepEqual(await edit("chatAddFearTargets",{tokenUuids:[hostile.uuid,hostile.uuid]}),{status:"updated"});
 assert.equal(flags.fearTargets.length,3);
 assert.match(message.content,/hostile token/);
 assert.doesNotMatch(message.content,/data-action="apply-fear"/);
 assert.deepEqual(await edit("chatRemoveFearTarget",{actorUuid:first.uuid},gm),{status:"updated"});
 assert.deepEqual(await applyChatApplication(payload(first)),{status:"ineligibleTarget"});
 assert.deepEqual(await applyChatApplication(payload(added)),{status:"applied",amount:10});
 assert.deepEqual(await edit("chatRemoveFearTarget",{actorUuid:added.uuid}),{status:"updated"});
 assert.deepEqual(await edit("chatAddFearTargets",{tokenUuids:[hostile.uuid]}),{status:"updated"});
 assert.deepEqual(await applyChatApplication(payload(added)),{status:"alreadyApplied"});
 const troll = makeActor("Troll");
 troll.type = "npc";
 const trollToken = Object.assign(makeToken("troll",troll),{parent:{id:"scene"},disposition:-1});
 assert.deepEqual(await edit("chatAddFearTargets",{tokenUuids:[trollToken.uuid]}),{status:"updated"});
 assert.doesNotMatch(message.content,/data-action="resolve-manual-fear"/);
 assert.deepEqual(await edit("chatRemoveFearTarget",{actorUuid:troll.uuid},gm),{status:"updated"});
 assert.ok(!flags.fearTargets.some(row=>row.actorUuid===troll.uuid));
});

test("restricted damage checks the actual target tags on the GM even with armor bypass or forged payload tags",async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);
 flags.damageContext={targetTags:['mort-vivant','undead']};
 const living=makeActor('Living'),undead=makeActor('Undead');undead.system.tags=['Mort-vivant'];
 addDamageTarget(living);addDamageTarget(undead);
 assert.deepEqual(await applyChatApplication(payload(living,{ignoreArmor:true,targetTags:[]})),{status:'ineligibleTarget'});
 assert.equal(living.system.resources.body.value,20);assert.equal(flags.applications,undefined);
 assert.deepEqual(await applyChatApplication(payload(living,{channel:'defense'})),{status:'ineligibleTarget'});
 assert.deepEqual(await applyChatApplication(payload(undead)),{status:'applied',amount:8});
 assert.equal(undead.system.resources.body.value,12);
});

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
test('damage resistance reserves one roll, rejects foreign proofs, and a success cancels only this card’s damage',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t),actor=makeActor('Resistant');addDamageTarget(actor);
 flags.damageContext={boundActorUuid:actor.uuid,resistance:{scope:'damage',successFactor:0}};
 const request={...payload(actor),type:'chatDamageResistance',action:'begin'};
 const [first,second]=await Promise.all([applyChatApplication(request),applyChatApplication(request)]);
 assert.equal(first.status,'reserved');assert.equal(second.status,'resistancePending');
 assert.equal((await applyChatApplication(payload(actor))).status,'resistancePending');
 game.messages.set('proof',{id:'proof',author:player,flags:{'trudvang-chronicles':{damageResistanceFor:{messageId:'wrong',actorUuid:actor.uuid},rollOutcome:{success:true}}}});
 const finish={...request,action:'finish',token:first.token,proofId:'proof'};
 assert.equal((await applyChatApplication(finish)).status,'unavailable');
 game.messages.get('proof').flags['trudvang-chronicles'].damageResistanceFor.messageId=message.id;
 assert.equal((await applyChatApplication(finish)).status,'resolved');
 assert.deepEqual(await applyChatApplication(payload(actor)),{status:'applied',amount:0});
 assert.equal(actor.system.resources.body.value,20);
});
test('clothing variants use the source card’s factors, round upward, and share the normal damage application lock',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t),actor=makeActor('Winter');addDamageTarget(actor);
 flags.damageContext={boundActorUuid:actor.uuid,alternatives:[{id:'winter',factor:.5},{id:'mastomant',factor:0}]};
 assert.equal((await applyChatApplication(payload(actor,{variant:'invented',factor:0}))).status,'unavailable');
 assert.deepEqual(await applyChatApplication(payload(actor,{variant:'winter',factor:0})),{status:'applied',amount:4});
 assert.equal((await applyChatApplication(payload(actor,{variant:'mastomant'}))).status,'alreadyApplied');
 assert.equal(actor.system.resources.body.value,16);
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
  const removing = requestDamageTargetRemoval({message, actorUuid: actor.uuid});
  const removal = emitted.shift();
  assert.equal(removal.type, "chatRemoveDamageTarget");
  game.user = gm; await handler(removal);
  game.user = player; await handler(emitted.shift());
  assert.deepEqual(await removing, {status: "removed", removed: 1});
  assert.match(message.content, /−8 PS/, "removing a target preserves its recorded damage");
  assert.equal(actor.system.resources.body.value, 12);
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

test("a minus removes only its target and preserves damage history even if the target is re-added", async t => {
  const {message, flags, makeActor, makeToken, payload} = runtime(t);
  const first = makeActor("First"), second = makeActor("Second");
  const token = makeToken("first", first);
  await requestDamageTargets({message, tokens: [token, makeToken("second", second)]});
  await applyChatApplication(payload(first));
  assert.deepEqual(await requestDamageTargetRemoval({message, actorUuid: first.uuid}), {status: "removed", removed: 1});
  assert.deepEqual(flags.damageTargets.map(target => target.actorUuid), [second.uuid]);
  assert.equal(flags.applications.length, 1);
  assert.match(message.content, /−8 PS/);
  assert.equal(first.system.resources.body.value, 12);
  assert.equal(second.system.resources.body.value, 20);
  assert.deepEqual(await requestDamageTargets({message, tokens: [token]}), {status: "added", added: 1});
  assert.equal((await applyChatApplication(payload(first))).status, "alreadyApplied");
  assert.equal(first.system.resources.body.value, 12);
});

test("removing targets serializes with additions and damage applications on the same card", async t => {
  const {message, flags, makeActor, makeToken, payload} = runtime(t);
  const first = makeActor("First"), second = makeActor("Second");
  await requestDamageTargets({message, tokens: [makeToken("first", first)]});
  const results = await Promise.all([applyChatApplication(payload(first)),
    requestDamageTargetRemoval({message, actorUuid: first.uuid}),
    requestDamageTargets({message, tokens: [makeToken("second", second)]})]);
  assert.deepEqual(results.map(result => result.status), ["applied", "removed", "added"]);
  assert.deepEqual(flags.damageTargets.map(target => target.actorUuid), [second.uuid]);
  assert.equal(flags.applications.length, 1);
  assert.match(message.content, /−8 PS/);
  assert.equal((await applyChatApplication(payload(first))).status, "unavailable");
});

test("target removal checks ownership, message access, card type and the existing target list", async t => {
  const {message, flags, makeActor, makeToken, updates} = runtime(t);
  const actor = makeActor("Target");
  await requestDamageTargets({message, tokens: [makeToken("target", actor)]});
  const request = {type: "chatRemoveDamageTarget", messageId: message.id, userId: observer.id, actorUuid: actor.uuid};
  assert.equal((await applyChatApplication(request)).status, "unavailable");
  request.userId = player.id; message.blind = true;
  assert.equal((await applyChatApplication(request)).status, "unavailable");
  message.blind = false; request.actorUuid = "Actor.notListed";
  assert.deepEqual(await applyChatApplication(request), {status: "unchanged", removed: 0});
  request.actorUuid = actor.uuid;
  const original = message.content;
  message.content = template("fear-card")({total: 10});
  assert.equal((await applyChatApplication(request)).status, "unavailable");
  message.content = original;
  assert.equal(updates.length, 1);
  assert.equal(flags.damageTargets.length, 1);
  assert.deepEqual(await applyChatApplication(request), {status: "removed", removed: 1});
  assert.deepEqual(await applyChatApplication(request), {status: "unchanged", removed: 0});
  assert.equal(updates.length, 2);
});

test("the card author can remove deleted targets and removing the last target keeps the plus", async t => {
  const {message, flags, makeActor, makeToken} = runtime(t);
  const actor = makeActor("Target"), token = makeToken("target", actor);
  await requestDamageTargets({message, tokens: [token]});
  message.author = observer;
  documents.delete(actor.uuid); documents.delete(token.uuid);
  assert.deepEqual(await applyChatApplication({type: "chatRemoveDamageTarget", messageId: message.id,
    userId: observer.id, actorUuid: actor.uuid}), {status: "removed", removed: 1});
  assert.deepEqual(flags.damageTargets, []);
  assert.match(message.content, /data-action="add-damage-targets"/);
  assert.doesNotMatch(message.content, /class="damage-target"/);
});

test("damage target names use the shared hover/centering control and both editing icons are compact", async t => {
  const {message, makeActor, makeToken} = runtime(t);
  const token = makeToken("target", makeActor("Target"));
  token.name = '<img src=x onerror="attack()">';
  await requestDamageTargets({message, tokens: [token]});
  assert.match(message.content, /class="trait-situation-token damage-target-name" data-action="locate-trait-situation-token" data-token-uuid="Scene\.scene\.Token\.target"/);
  assert.match(message.content, /&lt;img/);
  assert.doesNotMatch(message.content, /<img src=x/);
  assert.match(message.content, /class="damage-target-edit" data-action="add-damage-targets"/);
  assert.match(message.content, /class="damage-target-edit" data-action="remove-damage-target"/);
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  assert.match(css, /\.damage-target-edit\s*\{[^}]*width: 18px;[^}]*background: transparent; border: 0; box-shadow: none/);
});

test("applied damage rows stay compact and ignore native button height", () => {
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  assert.match(css, /\.trudvang\.chat-card \.application-result \{[^}]*padding: 1px 6px;[^}]*line-height: 1\.2/);
  assert.match(css, /\.trudvang\.chat-card \.application-result :is\(\.trait-situation-token, \.trait-situation-token-name\) \{[^}]*min-height: 0;[^}]*height: auto/);
});

test("a real damage roll stores its initial targets and the final halved amount on the expandable card", async t => {
  const {makeActor, makeToken} = runtime(t);
  const previous = {Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage};
  t.after(() => Object.assign(globalThis, previous));
  const previousApi = foundry.applications.api;
  t.after(() => {foundry.applications.api = previousApi;});
  foundry.applications.api = {DialogV2: class {static async wait() {return {dice: 1, openRoll: 0, modifier: 0, longRange: true};}}};
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
  const hit = makeToken("hit", makeActor("Hit"));
  await rollDamage({actor: makeActor("Attacker"), item: {type: "weapon", name: "Bow",
    system: {damage: "1d10", openRoll: 0, category: "ranged", strengthApplies: true}}, context: {usage: "ranged", targets: [hit]}});
  assert.deepEqual(cards[1].flags["trudvang-chronicles"].damageTargets.map(row => row.actorUuid), [hit.actor.uuid], "damage from an attack keeps only the hit targets even if another token is currently targeted");
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

test("conditional damage applies only to matching tags and is halved with the base at long range",async t=>{
 const {flags,makeActor,addDamageTarget,payload}=runtime(t);
 const troll=makeActor('Troll'),other=makeActor('Other');troll.system.tags=['troll','géant'];other.system.tags=['dragon'];
 flags.conditionalDamage=[{name:'Tueur de trolls',tags:['troll'],damage:3}];
 addDamageTarget(troll);addDamageTarget(other);
 assert.deepEqual(await applyChatApplication(payload(troll)),{status:'applied',amount:11});
 assert.deepEqual(await applyChatApplication(payload(other)),{status:'applied',amount:8});
});

test("conditional long-range damage rounds after adding the target-specific bonus",async t=>{
 const {flags,makeActor,addDamageTarget,payload}=runtime(t);const troll=makeActor('Troll');troll.system.tags=['troll'];addDamageTarget(troll);
 flags.conditionalDamage=[{tags:['troll'],damage:3}];flags.conditionalDamageBeforeRange=15;flags.conditionalDamageLongRange=true;
 assert.deepEqual(await applyChatApplication(payload(troll)),{status:'applied',amount:9});
});

test('Fearless reduces each recipient’s dice factor on the same source card before flat mitigation without rerolls',async t=>{
 const {message,flags,makeActor,payload}=runtime(t,'fear');message.content=message.content.replace('data-fear="10"','data-fear="23"');
 flags.fearContext={profile:{dice:1,faces:10,threshold:9,modifier:0},values:[9,10,4],adjustment:0};
 const protectedActor=makeActor('Protected',2),ordinary=makeActor('Ordinary',1);protectedActor.transformationProfile={fearReductionDegrees:2};
 assert.deepEqual(await applyChatApplication(payload(protectedActor)),{status:'applied',amount:7});assert.deepEqual(await applyChatApplication(payload(ordinary)),{status:'applied',amount:22});
 assert.match(flags.applications[0].calculation,/1d10.*9/);assert.equal(flags.applications.length,2);assert.equal(protectedActor.system.resources.fear.value,7);
 assert.deepEqual(await applyChatApplication(payload(protectedActor)),{status:'alreadyApplied'});
});
test('fear recipient rules reject a deaf hearer, the excluded caster and lower-intelligence victims on the GM',async t=>{
 const {flags,makeActor,payload}=runtime(t,'fear');const target=makeActor('Target');flags.fearContext={eligibility:{excludeCaster:true,requiresHearing:true},casterUuid:target.uuid};
 assert.equal((await applyChatApplication(payload(target))).status,'ineligibleTarget');flags.fearContext.casterUuid='Actor.someone';target.statuses=new Set(['deafened']);assert.equal((await applyChatApplication(payload(target))).status,'ineligibleTarget');
 assert.equal(target.system.resources.fear.value,0);
});
test('Peur and Lindwurm require a real reserved resistance, publish compact results on the same card, and distinguish zero from partial fear',async t=>{
 const oldDocument=globalThis.document;t.after(()=>{globalThis.document=oldDocument;});
 globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}})};
 const {message,flags,makeActor,payload}=runtime(t,'fear');const target=makeActor('Resister');
 flags.fearContext={profile:{dice:1,faces:10,threshold:9,modifier:0},values:[9,10,4],adjustment:0,resistance:{test:{sv:4,trait:['psyche']},successProfile:{dice:1,faces:5,threshold:0,modifier:0}}};
 assert.equal((await applyChatApplication(payload(target))).status,'resistanceRequired');assert.equal(target.system.resources.fear.value,0);
 const ask=action=>({type:'chatFearResistance',messageId:message.id,userId:player.id,actorUuid:target.uuid,action});
 const reservation=await applyChatApplication(ask('begin'));assert.equal(reservation.status,'reserved');assert.equal((await applyChatApplication(ask('begin'))).status,'resistancePending');
 const proof={id:'fear-proof',author:player,speaker:{alias:target.name},flags:{'trudvang-chronicles':{damageResistanceFor:{messageId:message.id,actorUuid:target.uuid},rollOutcome:{result:1,target:4,success:true}}}};game.messages.set(proof.id,proof);
 assert.equal((await applyChatApplication({...ask('finish'),token:'wrong',proofId:proof.id})).status,'unavailable');
 assert.equal((await applyChatApplication({...ask('finish'),token:reservation.token,proofId:proof.id})).status,'resolved');
 assert.match(message.content,/Resister.*Succès auto\./);assert.doesNotMatch(message.content,/Succès auto\. \(/);
 assert.deepEqual(await applyChatApplication(payload(target)),{status:'applied',amount:5});assert.equal(flags.fearResistanceResults.length,1);
 const second=makeActor('Avoided');second.applyFearFactor=()=>assert.fail('successful resistance must not generate points from a bad Psyche');delete flags.fearContext.resistance.successProfile;flags.fearResistanceResults.push({actorUuid:second.uuid,success:true,proofId:'proof2'});
 assert.deepEqual(await applyChatApplication(payload(second)),{status:'applied',amount:0});assert.equal(second.system.resources.fear.value,0);
});
test('cancelled fear resistance releases the reservation and applies nothing, while forged direct success is ignored',async t=>{
 const {message,flags,makeActor,payload}=runtime(t,'fear'),target=makeActor('Cancel');flags.fearContext={resistance:{test:{sv:8}},profile:{dice:1,faces:10,threshold:0,modifier:0},values:[8]};
 const begin={type:'chatFearResistance',messageId:message.id,userId:player.id,actorUuid:target.uuid,action:'begin'},reservation=await applyChatApplication(begin);
 assert.equal((await applyChatApplication({...begin,action:'cancel',token:reservation.token})).status,'cancelled');
 assert.equal((await applyChatApplication(payload(target,{success:true}))).status,'resistanceRequired');assert.equal(target.system.resources.fear.value,0);
 assert.equal((await applyChatApplication(begin)).status,'reserved');
});

test('fear resistance publishes and animates on its source card without creating another chat message',async t=>{
 Handlebars.registerHelper('eq',(a,b)=>a===b);
 const {message,flags,makeActor}=runtime(t,'fear'),target=makeActor('Inline');
 const previous={Roll:globalThis.Roll,document:globalThis.document,ChatMessage:globalThis.ChatMessage,api:foundry.applications.api,ui:globalThis.ui};
 t.after(()=>{Object.assign(globalThis,{Roll:previous.Roll,document:previous.document,ChatMessage:previous.ChatMessage,ui:previous.ui});foundry.applications.api=previous.api;});
 globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}})};
 globalThis.ui={notifications:{warn:v=>assert.fail(v)}};
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=3;return this;}toJSON(){return {formula:this.formula,total:this.total};}static fromData(data){return {...data};}};
 globalThis.ChatMessage={getSpeaker:()=>({}),create:()=>assert.fail('resistance must stay on the source fear card')};
 foundry.applications.api={DialogV2:class{static async wait(){return {modifier:0,situationValue:8,traitModifier:0};}}};
 Object.assign(target,{getTraitValue:()=>0,getRollModifier:()=>0,effects:[],items:[],statuses:new Set()});
 flags.fearContext={profile:{dice:1,faces:10,threshold:0,modifier:0},values:[8],resistance:{test:{sv:8,trait:['psyche','aucun']},sourceName:'Peur'}};
 let animations=0;game.modules=new Map([['dice-so-nice',{active:true}]]);game.dice3d={showForRoll:async()=>{animations++;}};
 const result=await requestChatApplication({message,actor:target,channel:'fear'});
 assert.deepEqual(result,{status:'applied',amount:0});assert.equal(animations,1);assert.equal(message.rolls?.length??flags.fearResistanceResults.length,1);assert.equal(flags.fearResistanceResults[0].outcome.result,3);
 assert.match(message.content,/Inline[\s\S]*Succès \(\+5\)/);assert.equal(target.system.resources.fear.value,0);
});
test('Peur shares one primary and its bought base recipients across separate fear cards from the same casting',async t=>{
 const {message,flags,makeActor,payload}=runtime(t,'fear'),sid='vitner-power-of-thought:fear:3';
 const rootFlags={ruleTestContext:{sourceId:sid,casterUuid:'Actor.caster',countsById:{[sid+':0']:1}}};
 const root={id:'casting',getFlag:(_s,key)=>rootFlags[key],async update(changes){for(const [path,value]of Object.entries(changes))rootFlags[path.split('.').at(-1)]=structuredClone(value);}};game.messages.set(root.id,root);
 const definition={sourceId:sid,casterUuid:'Actor.caster',originMessageId:root.id,profile:{dice:1,faces:10,threshold:0,modifier:0},values:[8]};flags.fearContext=definition;
 const first=makeActor('Primary'),second=makeActor('Secondary'),third=makeActor('Extra');
 assert.equal((await applyChatApplication(payload(first))).status,'applied');assert.equal((await applyChatApplication(payload(second))).status,'targetLimit');
 const secondFlags={fearContext:{...definition,baseOnly:true}},base={...message,id:'base-fear',getFlag:(_s,key)=>secondFlags[key],async update(changes){if(changes.content!==undefined)this.content=changes.content;for(const [path,value]of Object.entries(changes))if(path.startsWith('flags.trudvang-chronicles.'))secondFlags[path.split('.').at(-1)]=value;}};game.messages.set(base.id,base);
 const results=await Promise.all([second,third].map(actor=>applyChatApplication({...payload(actor),messageId:base.id})));
 assert.deepEqual(results.map(row=>row.status),['applied','targetLimit']);assert.equal(rootFlags.fearRecipients.length,2);
 assert.equal((await applyChatApplication({...payload(first),messageId:base.id})).status,'alreadyApplied');
});

test('wind impact uses actual per-recipient damage, Strength, and a single validated skill response',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);flags.damageContext={impact:{kind:'windKnockback'}};
 const actor=makeActor('Wind victim',3);actor.getTraitValue=()=>3;let testContext;
 actor.rollAbility=async(item,context)=>{testContext=context;assert.equal(item.system.parentSkill,'agility');assert.equal(item.system.level,0);assert.equal(context.reactive,true);const proof={id:'wind-proof',author:gm,rolls:[{formula:'1d20',total:6}],flags:{'trudvang-chronicles':context.resolveProcedure({target:10}).flags}};game.messages.set(proof.id,proof);return {messageId:proof.id};};
 addDamageTarget(actor);await applyChatApplication(payload(actor));assert.equal(flags.applications[0].impactDamage,5);assert.match(message.content,/resist-impact/);
 assert.equal((await requestDamageImpact({message,actor})).status,'resolved');assert.deepEqual(testContext.modifierRows.map(r=>r.value),[3,-5]);assert.equal(flags.applications[0].impact.resolved,true);assert.match(message.content,/Succès/);assert.doesNotMatch(message.content,/resist-impact/);
 assert.equal((await requestDamageImpact({message,actor})).status,'alreadyRolled');assert.equal(actor.system.resources.body.value,15);
});
test('failed wind impact throws a giant one metre and cannot affect a parrying weapon or replay the status',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);flags.damageContext={impact:{kind:'windKnockback'}};const actor=makeActor('Giant');actor.type='npc';actor.system.details={size:10};let statuses=0;actor.toggleStatusEffect=async(id,{active})=>{assert.equal(id,'prone');assert.equal(active,true);statuses++;};addDamageTarget(actor);await applyChatApplication(payload(actor));
 const base={type:'chatImpactTest',messageId:message.id,userId:player.id,actorUuid:actor.uuid},begin=await applyChatApplication({...base,action:'begin'});assert.equal(begin.status,'reserved');assert.equal((await applyChatApplication({...base,action:'begin'})).status,'resistancePending');
 game.messages.set('impact-proof',{id:'impact-proof',author:player,rolls:[{formula:'1d20',total:20}],flags:{'trudvang-chronicles':{impactTestFor:{messageId:message.id,actorUuid:actor.uuid,token:begin.token,target:99}}}});
 const finish={...base,action:'finish',token:begin.token,proofId:'impact-proof'};assert.equal((await applyChatApplication(finish)).status,'resolved');assert.equal(flags.applications[0].impact.distance,1);assert.match(message.content,/projection : 1 m/);assert.equal((await applyChatApplication(finish)).status,'alreadyRolled');assert.equal(statuses,1);
});
test('impact cancellation, missing damage application and forged proof never add a consequence',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);flags.damageContext={impact:{kind:'windKnockback'}};const actor=makeActor('Victim');const base={type:'chatImpactTest',messageId:message.id,userId:player.id,actorUuid:actor.uuid};assert.equal((await applyChatApplication({...base,action:'begin'})).status,'unavailable');addDamageTarget(actor);await applyChatApplication(payload(actor));const begin=await applyChatApplication({...base,action:'begin'});assert.equal((await applyChatApplication({...base,action:'finish',token:begin.token,proofId:'missing'})).status,'unavailable');await applyChatApplication({...base,action:'cancel',token:begin.token});assert.equal(flags.applications[0].impact,undefined);
});
test('soil blast minimum is applied after armor from the immutable card rather than a supplied socket value',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);flags.damageContext={minimumAfterArmor:3};const actor=makeActor('Armored',20);addDamageTarget(actor);const result=await applyChatApplication(payload(actor,{minimumAfterArmor:100}));assert.equal(result.amount,3);assert.equal(actor.system.resources.body.value,17);
});

test('human wind projection rolls open d10s and animates each distance die once',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t);flags.damageContext={impact:{kind:'windKnockback'}};const actor=makeActor('Human');actor.toggleStatusEffect=async()=>{};addDamageTarget(actor);await applyChatApplication(payload(actor));
 const previous=globalThis.Roll;t.after(()=>globalThis.Roll=previous);const values=[10,3];globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=values.shift();assert.notEqual(this.total,undefined);}};let animations=0;game.dice3d={showForRoll:async()=>animations++};
 const base={type:'chatImpactTest',messageId:message.id,userId:player.id,actorUuid:actor.uuid},begin=await applyChatApplication({...base,action:'begin'});game.messages.set('projection-proof',{author:player,rolls:[{formula:'1d20',total:20}],flags:{'trudvang-chronicles':{impactTestFor:{messageId:message.id,actorUuid:actor.uuid,token:begin.token,target:10}}}});
 assert.equal((await applyChatApplication({...base,action:'finish',token:begin.token,proofId:'projection-proof'})).status,'resolved');assert.equal(flags.applications[0].impact.distance,13);assert.equal(animations,2);assert.equal(values.length,0);
});

test('a composed hit is applied once from its shared chat target row and retains separate fire immunity',async t=>{
 const {message,flags,makeActor,addDamageTarget,payload}=runtime(t),a=makeActor('Burning target',5);a.system.damageDefenses=[{type:'fire',factor:0}];addDamageTarget(a);flags.damageContext={usage:'natural',components:[{name:'Poing',damage:6,qualification:{nature:'normal',delivery:'melee',type:'blunt',protection:'normal'}},{name:'Feu',damage:2,qualification:{nature:'normal',delivery:'melee',type:'fire',protection:'normal'}}]};assert.equal((await applyChatApplication(payload(a))).status,'applied');assert.equal(a.system.resources.body.value,19);assert.equal((await applyChatApplication(payload(a))).status,'alreadyApplied');assert.equal(a.system.resources.body.value,19);
});
