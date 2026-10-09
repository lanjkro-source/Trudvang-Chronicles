import assert from "node:assert/strict";
import {test} from "node:test";

const chatMessages = [];
let dialogConfig;
let dialogResult = null;
let dialogCalls = 0;

globalThis.document = {
  createElement: () => {
    let text = "";
    return {set textContent(value) { text = String(value); }, get innerHTML() { return text; }};
  }
};
class MockDialogV2 {
  static async wait(config) {
    dialogConfig = config;
    dialogCalls++;
    return dialogResult;
  }
}
globalThis.foundry = {
  applications: {api: {DialogV2: MockDialogV2},   handlebars: {renderTemplate: async (_template, data) => `<article><h3>${data.title}</h3><button data-action="roll-trait-situation" data-trait="${data.traitKey}" data-sv="${data.sv}">${data.buttonLabel}</button><p>${data.success}</p><p>${data.failure}</p></article>`},
  getFlag: () => undefined},
  documents: {Actor: class {}, ActiveEffect: class {}},
  data: {fields: {}, ActiveEffectTypeDataModel: class {}}
};
globalThis.game = {
  user: {id: "gm", name: "TestGM", isGM: true, avatar: "avatar.png"},
  i18n: {
    localize: key => key,
    format: (key, data) => `${key} ${JSON.stringify(data)}`
  },
  modules: new Map([["dice-so-nice", {active: true}]]),
  dice3d: {showForRoll: async () => {}},
  traits: {
    charisma: "Charisma", constitution: "Constitution", dexterity: "Dexterity",
    intelligence: "Intelligence", perception: "Perception", psyche: "Psyche", strength: "Strength"
  }
};
globalThis.Roll = class MockRoll {
  constructor(formula) { this.formula = formula; }
  async evaluate() { this.total = 12; return this; }
};
globalThis.ChatMessage = {
  getSpeaker: () => ({actor: "actor-id"}),
  create: async data => {
    chatMessages.push(data);
    return {id: `message-${chatMessages.length}`, whisper: [], blind: false, speaker: data.speaker};
  }
};
globalThis.CONST = {CHAT_MESSAGE_STYLES: {OTHER: "other"}};
globalThis.ui = {notifications: {warn: () => {}, info: () => {}}};
globalThis.canvas = {tokens: {controlled: []}};
globalThis.SYSTEM_ID = "trudvang-chronicles";
globalThis.TRUDVANG = {
  traits: {
    charisma: "Charisma", constitution: "Constitution", dexterity: "Dexterity",
    intelligence: "Intelligence", perception: "Perception", psyche: "Psyche", strength: "Strength"
  }
};

const {gmTraitSituationDialog, requestTraitSituationRoll, playerTraitSituationDialog} = await import("../modules/dice.mjs");

test("gmTraitSituationDialog returns trait and SV from dialog", async () => {
  dialogResult = {traitKey: "perception", situationValue: 12, title: "Resist the call", success: "Keep control", failure: "Follow the voice"};
  const result = await gmTraitSituationDialog();
  assert.equal(result.traitKey, "perception");
  assert.equal(result.situationValue, 12);
  assert.equal(result.title, "Resist the call");
  assert.equal(result.success, "Keep control");
  assert.equal(result.failure, "Follow the voice");
  assert.match(dialogConfig.content, /value="aucun"/);
  assert.match(dialogConfig.content, /name="title"/);
  assert.match(dialogConfig.content, /name="success"/);
  assert.match(dialogConfig.content, /name="failure"/);
  assert.equal(dialogConfig.window.title, "TRUDVANG.Dialog.TraitSituationTitle");
});

test("gm dialog submits its title and both consequences", async () => {
  dialogResult = null;
  await gmTraitSituationDialog();
  const values = new Map([
    ["[name=trait]", "aucun"], ["[name=sv]", "8"], ["[name=title]", "Résister à l’appel"],
    ["[name=success]", "Garde son libre arbitre"], ["[name=failure]", "Suit la voix"]
  ]);
  const form = {querySelector: selector => ({value: values.get(selector)})};
  const result = dialogConfig.buttons.find(button => button.action === "roll").callback(null, {form}, {});
  assert.deepEqual(result, {
    traitKey: "aucun", situationValue: 8, title: "Résister à l’appel",
    success: "Garde son libre arbitre", failure: "Suit la voix"
  });
});

test("gmTraitSituationDialog cancel returns null", async () => {
  dialogResult = null;
  const result = await gmTraitSituationDialog();
  assert.equal(result, null);
});

test("requestTraitSituationRoll posts the title and consequences on the card", async () => {
  chatMessages.length = 0;
  const result = await requestTraitSituationRoll({
    traitKey: "strength", situationValue: 15, title: "Resist the command", success: "Keeps control", failure: "Obeys"
  });
  assert.equal(result.traitKey, "strength");
  assert.equal(result.sv, 15);
  assert.equal(result.title, "Resist the command");
  assert.equal(chatMessages.length, 1);
  const msg = chatMessages[0];
  assert.equal(msg.style, "other");
  assert.ok(!msg.rolls, "Request card must not have rolls (no DSN for GM)");
  assert.ok(msg.content.includes("roll-trait-situation"));
  assert.ok(msg.content.includes("data-trait=\"strength\""));
  assert.ok(msg.content.includes("data-sv=\"15\""));
  assert.match(msg.content, /<h3>Resist the command<\/h3>/);
  assert.match(msg.content, /<p>Keeps control<\/p>/);
  assert.match(msg.content, /<p>Obeys<\/p>/);
  assert.equal(msg.flags["trudvang-chronicles"].traitSituation.traitKey, "strength");
  assert.equal(msg.flags["trudvang-chronicles"].traitSituation.sv, 15);
  assert.equal(msg.flags["trudvang-chronicles"].traitSituation.success, "Keeps control");
  assert.equal(msg.flags["trudvang-chronicles"].traitSituation.failure, "Obeys");
  assert.deepEqual(msg.flags["trudvang-chronicles"].traitSituation.responses, []);
});

test("a resistance request may have no trait", async () => {
  chatMessages.length = 0;
  const result = await requestTraitSituationRoll({traitKey: "aucun", situationValue: 8});
  assert.equal(result.traitKey, "aucun");
  assert.ok(chatMessages[0].content.includes('data-trait="aucun"'));
  assert.equal(chatMessages[0].flags["trudvang-chronicles"].traitSituation.traitKey, "aucun");
});

test("requestTraitSituationRoll with no args opens GM dialog", async () => {
  chatMessages.length = 0;
  dialogResult = {traitKey: "aucun", situationValue: 10, title: "Test sans trait", success: "Réussite", failure: "Échec"};
  const result = await requestTraitSituationRoll();
  assert.equal(result.traitKey, "aucun");
  assert.equal(result.title, "Test sans trait");
  assert.equal(chatMessages[0].flags["trudvang-chronicles"].traitSituation.failure, "Échec");
  assert.equal(dialogCalls > 0, true);
});

test("requestTraitSituationRoll rejects invalid trait", async () => {
  chatMessages.length = 0;
  const result = await requestTraitSituationRoll({traitKey: "invalid", situationValue: 10});
  assert.equal(result, null);
  assert.equal(chatMessages.length, 0);
});

test("requestTraitSituationRoll rejects non-integer SV", async () => {
  chatMessages.length = 0;
  const result = await requestTraitSituationRoll({traitKey: "strength", situationValue: 10.5});
  assert.equal(result, null);
  assert.equal(chatMessages.length, 0);
});

test("playerTraitSituationDialog returns modifier", async () => {
  dialogResult = {modifier: 3};
  const result = await playerTraitSituationDialog({
    title: "Test",
    traitLabel: "Strength",
    traitValue: 2,
    effect: 1,
    sv: 10
  });
  assert.equal(result.modifier, 3);
  assert.ok(dialogConfig.content.includes("readonly"));
  assert.ok(dialogConfig.content.includes("data-final-target"));
});

test("playerTraitSituationDialog cancel returns null", async () => {
  dialogResult = null;
  const result = await playerTraitSituationDialog({
    title: "Test",
    traitLabel: "Strength",
    traitValue: 2,
    effect: 1,
    sv: 10
  });
  assert.equal(result, null);
});
