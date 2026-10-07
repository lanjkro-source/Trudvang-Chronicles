import assert from "node:assert/strict";
import {test} from "node:test";
import {defaultConcentrationType} from "../modules/rules/concentration-resolver.mjs";

const chatMessages = [];
const diceSoNiceCalls = [];
let dialogConfig;
let dialogResult = null;

globalThis.document = {
  createElement: () => {
    let text = "";
    return {set textContent(value) { text = String(value); }, get innerHTML() { return text; }};
  }
};
class MockDialogV2 {
  static async wait(config) {
    dialogConfig = config;
    return dialogResult;
  }
}
globalThis.foundry = {
  applications: {api: {DialogV2: MockDialogV2}, handlebars: {renderTemplate: async (_template, data) => JSON.stringify(data)}},
  documents: {Actor: class {}, ActiveEffect: class {}},
  data: {fields: {}, ActiveEffectTypeDataModel: class {}}
};
globalThis.game = {
  user: {id: "roller"},
  i18n: {localize: key => key},
  modules: new Map([["dice-so-nice", {active: true}]]),
  dice3d: {showForRoll: async (...args) => { diceSoNiceCalls.push(args); }}
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

const {concentrationDialog, rollUnder} = await import("../modules/dice.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");

test("concentration defaults to the track with the larger maximum reserve; ties favor divine", () => {
  assert.equal(defaultConcentrationType({vitnerMax: 20, divinityMax: 10}), "spell");
  assert.equal(defaultConcentrationType({vitnerMax: 10, divinityMax: 20}), "divine");
  assert.equal(defaultConcentrationType({vitnerMax: 10, divinityMax: 10}), "divine");
});

test("the concentration dialog selects the requested track and returns its values when rolled", async () => {
  await concentrationDialog({title: "Concentration", defaultType: "divine"});
  assert.match(dialogConfig.content, /value="divine" selected/);
  assert.match(dialogConfig.buttons[0].icon, /fa-dice-d20/);
  const fields = {"[name=concentration-type]": {value: "divine"}, "[name=concentration-base]": {value: "7"}};
  const form = {querySelector: selector => fields[selector]};
  assert.deepEqual(dialogConfig.buttons[0].callback({}, {form}, {element: form}), {type: "divine", base: 7});
});

test("a concentration roll posts its d20 to chat and animates it through Dice So Nice", async () => {
  const actor = {name: "Test", img: "actor.webp", uuid: "Actor.actor-id"};
  const result = await rollUnder({actor, label: "Concentration", target: 6, modifier: 2, kind: "situation", animateWithDiceSoNice: true});
  const message = chatMessages.at(-1);
  assert.equal(result.result, 12);
  assert.equal(message.rolls[0], result.roll);
  assert.equal(message.flags["dice-so-nice"].skip, true);
  assert.equal(diceSoNiceCalls.at(-1)[0], result.roll);
  assert.equal(diceSoNiceCalls.at(-1)[5], `message-${chatMessages.length}`);
});

test("a concentration roll still posts to chat when Dice So Nice is not active", async () => {
  game.modules.set("dice-so-nice", {active: false});
  const callsBefore = diceSoNiceCalls.length;
  const result = await rollUnder({actor: {name: "Test", img: "actor.webp", uuid: "Actor.actor-id"}, label: "Concentration", target: 6, animateWithDiceSoNice: true});
  const message = chatMessages.at(-1);
  assert.equal(message.rolls[0], result.roll);
  assert.equal(message.flags, undefined);
  assert.equal(diceSoNiceCalls.length, callsBefore);
});

test("the actor concentration action rolls, posts to chat, and animates after dialog confirmation", async () => {
  dialogResult = {type: "spell", base: 6};
  game.modules.set("dice-so-nice", {active: true});
  const actor = {
    name: "Test", img: "actor.webp", uuid: "Actor.actor-id",
    system: {resources: {vitner: {max: 20}, divinity: {max: 5}}},
    canPerformAction: () => true,
    getTraitValue: () => 2,
    getRollModifier: () => -1,
    findRuleKnowledge: key => ({system: {level: {vitnerFocus: 1, safeWeaving: 2}[key] || 0}})
  };
  const messagesBefore = chatMessages.length;
  const animationsBefore = diceSoNiceCalls.length;
  const result = await TrudvangActor.prototype.rollConcentration.call(actor);
  assert.equal(result.target, 12);
  assert.equal(chatMessages.length, messagesBefore + 1);
  assert.equal(chatMessages.at(-1).rolls[0], result.roll);
  assert.equal(diceSoNiceCalls.length, animationsBefore + 1);
  assert.equal(diceSoNiceCalls.at(-1)[0], result.roll);
});
