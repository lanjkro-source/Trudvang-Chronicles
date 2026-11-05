import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";

const locales = Object.fromEntries(["fr", "en"].map(lang => [lang, JSON.parse(readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8"))]));
const messages = [];
let enabled = true;
let stagesEnabled = false;
globalThis.game = {users: {activeGM: {isSelf: true}}, settings: {get: (_, key) => key === "announceEffectStages" ? stagesEnabled : enabled}, i18n: {
  lang: "fr", format(key, data) {
    return key.split(".").reduce((v, k) => v[k], locales[this.lang]).replace(/\{(\w+)\}/g, (_, key) => data[key]);
  }
}};
globalThis.document = {createElement: () => ({set textContent(value) {this.value = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");}, get innerHTML() {return this.value;}})};
globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => {messages.push(data); return data;}};
globalThis.foundry = {};
const {announceEffectExpiration, announceEffectStage} = await import("../modules/effect-expiration-notice.mjs");
const actor = {documentName: "Actor", id: "recipient"};
const effect = parent => ({parent: parent ?? actor, name: "Lumière <allié>"});

test("expiration notices are optional, GM-authored, escaped and emitted once per deleted instance", async () => {
  const e = effect();
  await announceEffectExpiration(e);
  enabled = false; await announceEffectExpiration(e, {trudvangExpired: true});
  enabled = true; game.users.activeGM.isSelf = false; await announceEffectExpiration(e, {trudvangExpired: true});
  assert.equal(messages.length, 0);
  game.users.activeGM.isSelf = true;
  await Promise.all([announceEffectExpiration(e, {trudvangExpired: true}), announceEffectExpiration(e, {trudvangExpired: true})]);
  assert.equal(messages.length, 1);
  assert.match(messages[0].content, /Lumière &lt;allié&gt; se termine\./);
  assert.deepEqual(messages[0].speaker, {actor: "recipient"});
});

test("carried item notices use the bearer; library templates and manual removals stay silent", async () => {
  const before = messages.length;
  game.i18n.lang = "en";
  await announceEffectExpiration(effect({documentName: "Item", parent: actor}), {trudvangExpired: true});
  assert.equal(messages.length, before + 1);
  assert.match(messages.at(-1).content, / ends\./);
  await announceEffectExpiration(effect({documentName: "Item"}), {trudvangExpired: true});
  await announceEffectExpiration({...effect(), inCompendium: true}, {trudvangExpired: true});
  await announceEffectExpiration(effect(), {trudvangStageTransition: true});
  assert.equal(messages.length, before + 1);
});

test("stage announcements are independent of expiry, localized, escaped and GM-authored", async () => {
  const before = messages.length, e = effect({documentName: "Item", parent: actor});
  game.i18n.lang = "fr"; enabled = false;
  await announceEffectStage(e, {stage: "Léger"});
  assert.equal(messages.length, before);
  stagesEnabled = true; game.users.activeGM.isSelf = false;
  await announceEffectStage(e, {stage: "Léger"});
  assert.equal(messages.length, before);
  game.users.activeGM.isSelf = true;
  await announceEffectStage(e, {stage: "Léger <2>", name: "Extrait"});
  assert.equal(messages.length, before + 1);
  assert.match(messages.at(-1).content, /Extrait passe au palier Léger &lt;2&gt;\./);
  assert.deepEqual(messages.at(-1).speaker, {actor: "recipient"});
  await announceEffectStage(effect({documentName: "Item"}), {stage: "Léger"});
  assert.equal(messages.length, before + 1);
});
