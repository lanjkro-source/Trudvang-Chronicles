import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {actorPortraitSelectionUpdate, actorPortraitSources, normalizePortraitSources, sharedActorPortrait} from "../modules/actor-portraits.mjs";

const lang = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const localize = key => key.split(".").reduce((value, part) => value?.[part], lang) ?? key;
const messages = [], popouts = [], sockets = [], dialogs = [];
let answerDialog = () => false;
globalThis.document = {createElement: () => ({
  set textContent(value) { this.value = String(value); },
  get innerHTML() { return this.value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
})};
globalThis.game = {user: {isGM: true}, i18n: {localize, format: (key, values) => localize(key).replace(/\{(\w+)\}/g, (_, k) => values[k])},
  socket: {emit: (...args) => sockets.push(args)}};
globalThis.foundry = {applications: {
  handlebars: {renderTemplate: async (path, context) => {
    const template = readFileSync(new URL(`../${path.replace("systems/trudvang-chronicles/", "")}`, import.meta.url), "utf8");
    return Handlebars.compile(template)(context);
  }},
  api: {DialogV2: class {
    static async wait(options) { dialogs.push(options); return answerDialog(options, this); }
    async _onRender() {}
  }},
  apps: {ImagePopout: class {
    constructor(options) { popouts.push(options); }
    render(options) { this.renderOptions = options; }
  }}
}};
Handlebars.registerHelper("localize", localize);
globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => { messages.push(data); return data; }};
const {manageActorPortraits, showActorPortrait, showActorPortraitDialog, registerPortraitDirectoryHook} = await import("../modules/portrait.mjs");
const actor = extra => ({id: "actor", uuid: "Actor.actor", name: "Portrait <test>", img: "sheet.webp", isOwner: true,
  system: {portraits: ["sheet.webp", "shared.webp", "third.webp"], sharedPortrait: "shared.webp"},
  updates: [], async update(changes) { this.updates.push(changes); return changes; }, ...extra});
const selectionRoot = (sheet = "0", share = "1", forceAll = false) => ({querySelector: selector =>
  selector.includes("sheetPortrait") ? {value: sheet} : selector.includes("sharePortrait") ? {value: share}
    : selector.includes("forceAll") ? {checked: forceAll} : null});

test("single-portrait actors need no migration and gallery sources are deduplicated", () => {
  assert.deepEqual(actorPortraitSources({img: "existing.webp", system: {}}), ["existing.webp"]);
  assert.equal(sharedActorPortrait({img: "existing.webp", system: {}}), "existing.webp");
  assert.deepEqual(normalizePortraitSources(["a", " a ", "", null, 12, "b"]), ["a", "b"]);
  assert.deepEqual(actorPortraitSources(actor()), ["sheet.webp", "shared.webp", "third.webp"]);
});

test("independent choices never update the token texture, and invalid selections fall back safely", () => {
  const changes = actorPortraitSelectionUpdate(actor(), {sources: ["shared.webp", "third.webp"], sheet: "third.webp", share: "shared.webp"});
  assert.deepEqual(changes, {img: "third.webp", "system.portraits": ["shared.webp", "third.webp"], "system.sharedPortrait": "shared.webp"});
  assert.deepEqual(actorPortraitSelectionUpdate(actor(), {sources: ["third.webp"], sheet: "missing", share: "missing"}),
    {img: "third.webp", "system.portraits": ["third.webp"], "system.sharedPortrait": "third.webp"});
  assert.equal(actorPortraitSelectionUpdate(actor(), {sources: []}), null);
});

test("the chat card, local popout and socket all use the selected shared image", async () => {
  const npc = actor();
  await showActorPortrait(npc, {forceAll: true});
  assert.match(messages.at(-1).content, /data-src="shared.webp"/);
  assert.doesNotMatch(messages.at(-1).content, /sheet.webp/);
  assert.equal(popouts.at(-1).src, "shared.webp");
  assert.equal(sockets.at(-1)[1].src, "shared.webp");
  assert.equal(npc.updates.length, 0);
});

test("share picker remembers its selection without changing the sheet portrait", async () => {
  const npc = actor();
  answerDialog = options => {
    assert.equal((options.content.match(/name="sharePortrait"/g) ?? []).length, 3);
    assert.match(options.content, /value="1" checked/);
    assert.doesNotMatch(options.content, /Portrait <test>/);
    return options.buttons[0].callback(null, {form: selectionRoot("0", "2")}, {});
  };
  await showActorPortraitDialog(npc);
  assert.deepEqual(npc.updates, [{"system.sharedPortrait": "third.webp"}]);
  assert.match(messages.at(-1).content, /data-src="third.webp"/);
});

test("cancelling either picker leaves portraits and chat unchanged", async () => {
  answerDialog = () => false;
  const npc = actor(), count = messages.length;
  assert.equal(await showActorPortraitDialog(npc), false);
  assert.equal(await manageActorPortraits(npc), false);
  assert.equal(messages.length, count); assert.equal(npc.updates.length, 0);
});

test("gallery saves both choices together, and a synthetic token actor is the update target", async () => {
  const npc = actor({uuid: "Scene.scene.Token.token.Actor.actor", isToken: true});
  answerDialog = options => {
    assert.match(options.content, /name="sheetPortrait"/);
    assert.match(options.content, /data-add-portrait/);
    return options.buttons[0].callback(null, {form: selectionRoot("2", "1")}, {});
  };
  await manageActorPortraits(npc);
  assert.deepEqual(npc.updates, [{img: "third.webp", "system.portraits": ["sheet.webp", "shared.webp", "third.webp"], "system.sharedPortrait": "shared.webp"}]);
});

test("read-only actors and locked compendiums can share but cannot change stored portraits", async () => {
  for (const npc of [actor({isOwner: false}), actor({compendium: {locked: true}})]) {
    const count = dialogs.length;
    assert.equal(await manageActorPortraits(npc), false);
    assert.equal(dialogs.length, count);
    answerDialog = options => options.buttons[0].callback(null, {form: selectionRoot("0", "2")}, {});
    await showActorPortraitDialog(npc);
    assert.match(messages.at(-1).content, /data-src="third.webp"/);
    assert.equal(npc.updates.length, 0);
  }
});

test("players cannot force other clients to open portraits through the chat fallback", async () => {
  game.user.isGM = false;
  const count = sockets.length;
  try {
    await showActorPortrait(actor(), {forceAll: true});
    assert.equal(messages.at(-1).flags["trudvang-chronicles"].forceShowPortrait, false);
    assert.equal(sockets.length, count);
    answerDialog = options => {
      assert.doesNotMatch(options.content, /name="forceAll"/);
      return false;
    };
    await showActorPortraitDialog(actor());
  } finally { game.user.isGM = true; }
});

test("old Bestiary imports offer their full gallery without overwriting customized avatars", async () => {
  const {BESTIARY_ENTRIES} = await import("../modules/bestiary-catalog-data.mjs");
  const reference = BESTIARY_ENTRIES.find(entry => entry.actor.system.portraits.length > 1);
  const npc = actor({img: "custom.webp", system: {}, flags: {"trudvang-chronicles": {bestiaryId: reference.id}}});
  answerDialog = options => {
    assert.match(options.content, /custom.webp/);
    for (const src of reference.actor.system.portraits) assert.ok(options.content.includes(src));
    return false;
  };
  await manageActorPortraits(npc);
  assert.equal(npc.img, "custom.webp"); assert.equal(npc.updates.length, 0);
});

test("actor directory registration still uses the current construction-time context hook", () => {
  let registration;
  globalThis.Hooks = {on: (name, callback) => registration = {name, callback}};
  registerPortraitDirectoryHook();
  assert.equal(registration.name, "getActorContextOptions");
  const entries = []; registration.callback({}, entries);
  assert.equal(entries[0].label, localize("TRUDVANG.Portrait.ShareMenu"));
  assert.equal(typeof entries[0].onClick, "function");
});
