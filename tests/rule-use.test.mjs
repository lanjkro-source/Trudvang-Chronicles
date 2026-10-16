import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import Handlebars from "handlebars";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";

const messages = [];
let die = 10;
const handlebars = Handlebars.create();
handlebars.registerHelper("localize", key => key);
handlebars.registerHelper("eq", (a, b) => a === b);
handlebars.registerHelper("concat", (...args) => args.slice(0, -1).join(""));
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) =>
  handlebars.compile(readFileSync(new URL(`../${path.replace("systems/trudvang-chronicles/", "")}`, import.meta.url), "utf8"))(data)}}};
globalThis.game = {user: {id: "user"}, i18n: {lang: "fr", localize: key => key}};
globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.uuid}), create: async data => {messages.push(data); return data;}};
globalThis.Roll = class {async evaluate() {this.total = die; return this;}};
globalThis.ui = {notifications: {warn: () => null}};
globalThis.canvas = {tokens: {controlled: []}};

const {rollUnder} = await import("../modules/dice.mjs");
const {useCreatureAbility} = await import("../modules/rule-use.mjs");
const actor = {name: "Acteur <A>", uuid: "Actor.A", type: "npc", isOwner: true, canPerformAction: () => true};
const catalogue = "vitner-vitner-craft:vitner-pouch:1";

test("successful magic exposes source actions, while failed casts and shared descriptions have no extra list", async () => {
  for (const [kind, catalogId] of [["spell", catalogue], ["divine", catalogue],
    ["skill", "holy-thuuldom-stoneshape:stoneshape:0"]]) {
    const item = {uuid: "Actor.A.Item.power", type: kind === "spell" ? "spell" : "divineFeat", system: {catalogId, isRune: kind === "skill"}};
    for (const success of [true, false]) {
      die = success ? 10 : 20;
      await rollUnder({actor, item, kind, target: 15, label: "Pouvoir"});
      const html = messages.at(-1).content;
      assert.equal(html.includes("rule-action-tests"), success);
      if (success) {
        assert.match(html, /data-rule-document-uuid="Actor.A.Item.power"/);
        const actions = RULE_TESTS_BY_CATALOG_ID[catalogId];
        assert.equal((html.match(/data-action="roll-rule-test"/g) ?? []).length, actions.length);
        for (const action of actions) assert.ok(html.includes(handlebars.escapeExpression(action.action)));
      }
    }
  }
  for (const template of ["item-card", "effect-card"]) {
    const html = handlebars.compile(readFileSync(new URL(`../templates/chat/${template}.hbs`, import.meta.url), "utf8"))({description: "Description"});
    assert.doesNotMatch(html, /rule-action-tests|rule-test-list/);
  }
});

test("using owned and catalogue creature abilities announces only performer, ability and all response actions", async () => {
  const catalogId = CREATURE_ABILITY_REFERENCES["Charge"].id;
  for (const legacy of [false, true]) {
    const ability = {name: "Charge <test>", uuid: "Actor.A.Item.ability", type: legacy ? "effect" : "creatureAbility",
      parent: {documentName: "Actor", ...actor}, system: {catalogId}};
    await useCreatureAbility(ability);
    const message = messages.at(-1);
    assert.equal(message.speaker.actor, actor.uuid);
    assert.match(message.content, /Acteur &lt;A&gt;/);
    assert.match(message.content, /Charge &lt;test&gt;/);
    assert.equal((message.content.match(/data-action="roll-rule-test"/g) ?? []).length, RULE_TESTS_BY_CATALOG_ID[catalogId].length);
    assert.doesNotMatch(message.content, /shared-description|roll-result/);
  }
  canvas.tokens.controlled = [{actor}];
  await useCreatureAbility({name: "Charge", uuid: "Compendium.ability", type: "creatureAbility", system: {catalogId}});
  assert.equal(messages.at(-1).speaker.actor, actor.uuid);
  const before = messages.length;
  await useCreatureAbility({actor: {...actor, isOwner: false}, system: {catalogId}});
  assert.equal(messages.length, before);
  canvas.tokens.controlled = [];
});

test("one attack die gives target-specific outcomes and keeps critical outcomes for every size", async () => {
  const targets = [{name: "Small", modifier: -2, tokenUuid: "Scene.s.Token.small"}, {name: "Large", modifier: 4, tokenUuid: "Scene.s.Token.large"}];
  die = 10;
  const mixed = await rollUnder({actor, kind: "attack", target: 6, attackTargets: targets, label: "Attack", item: {uuid: "Actor.A.Item.axe"}});
  assert.deepEqual(mixed.attackTargets.map(row => [row.target, row.success]), [[6, false], [12, true]]);
  assert.equal(mixed.success, true);
  assert.equal(messages.at(-1).rolls.length, 1);
  assert.equal(messages.at(-1).flags["trudvang-chronicles"].attackTargets[1].success, true);
  assert.match(messages.at(-1).content, /attack-target-result failure/);
  assert.match(messages.at(-1).content, /attack-target-result success/);
  assert.match(messages.at(-1).content, /data-action="damage"/);
  assert.deepEqual(mixed.attackTargets.map(row => row.attackMargin), ["-4", "+2"]);
  assert.doesNotMatch(messages.at(-1).content, /success-margin/);
  assert.match(messages.at(-1).content, /Small<\/strong>: TRUDVANG\.Roll\.Failure \(-4\)/);
  for (const [target, margin] of [[16, "+6"], [9, "-1"]]) {
    await rollUnder({actor, kind: "attack", target, label: "Attack", attackTargets: [{name: "Solo", modifier: 0}]});
    assert.ok(messages.at(-1).content.includes(`(${margin})`));
    assert.doesNotMatch(messages.at(-1).content, /success-margin/);
  }
  for (const value of [1, 20]) {
    die = value;
    const result = await rollUnder({actor, kind: "attack", target: 6, attackTargets: targets, label: "Attack"});
    assert.ok(result.attackTargets.every(row => row.success === (value === 1)));
  }
});
