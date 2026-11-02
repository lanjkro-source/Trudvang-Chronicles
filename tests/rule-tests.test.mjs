import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";

test("the French rule-test catalogue maps powers and creature abilities by stable catalogue id", () => {
  assert.equal(RULE_TESTS_BY_CATALOG_ID["vitner-vitner-craft:vitner-pouch:1"][0].sv, 8);
  const absorptionId = CREATURE_ABILITY_REFERENCES["Absorption de vie"].id;
  assert.deepEqual(RULE_TESTS_BY_CATALOG_ID[absorptionId][0].trait, ["psyche", "aucun"]);
  assert.equal(RULE_TESTS_BY_CATALOG_ID[absorptionId][0].traitMethod, "first");
  assert.equal(RULE_TESTS_BY_CATALOG_ID[absorptionId][0].sv.by.length, 2);
  const howlId = CREATURE_ABILITY_REFERENCES["Hurlement sauvage"].id;
  const howl = RULE_TESTS_BY_CATALOG_ID[howlId][0];
  assert.deepEqual(howl.sv, {base: 8, modifiers: [{condition: "la cible n’est pas surprise", value: 5}]});
  assert.equal(howl.criticalFailure, "lâche ses armes et perd 1d3 tours.");
  assert.equal(RULE_TESTS_BY_CATALOG_ID["a0A7iPhNiOjPkQlR"][0].traitMethod, "average");
  assert.equal(RULE_TESTS_BY_CATALOG_ID["WKMBG3v1w2x3y4z5"][0].traitMethod, "sum");
  assert.equal(RULE_TESTS_BY_CATALOG_ID[CREATURE_ABILITY_REFERENCES["Noyade (lyktgubbe)"].id][0].traitMethod, "best");
});

test("every resistance test has two trait slots and an explicit method", () => {
  const resistTests = Object.values(RULE_TESTS_BY_CATALOG_ID).flat().filter(test => test.kind === "resist");
  assert.equal(resistTests.length, 179);
  for (const test of resistTests) {
    assert.equal(test.trait.length, 2, test.action);
    assert.ok(test.trait.every(trait => typeof trait === "string"), test.action);
    assert.ok(["first", "second", "average", "sum", "best"].includes(test.traitMethod), test.action);
  }
});

test("English offers mechanically identical tests with neutral localized labels",async()=>{
 const fr=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url))),en=JSON.parse(fs.readFileSync(new URL("../lang/en.json",import.meta.url)));
 const get=(o,key)=>key.split(".").reduce((v,k)=>v?.[k],o);
 globalThis.game={i18n:{lang:"en",localize:key=>get(en,key)??key,format:(key,data)=>String(get(en,key)??key).replace(/\{(\w+)\}/g,(_,name)=>data[name]??"")}};
 globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
 globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
 const {ruleTestsForDocument,annotateRuleTestDescription}=await import("../modules/rule-tests.mjs");
 const document={system:{catalogId:"vitner-vitner-craft:vitner-pouch:1"}},test=ruleTestsForDocument(document)[0];
 assert.equal(test.sv,8);assert.deepEqual(test.trait,["psyche","aucun"]);assert.match(test.action,/Resistance 1/);assert.match(test.note,/description/);
 assert.match(annotateRuleTestDescription("<p>A creature can resist the spell.</p>",document),/data-test-index="0"/);
 assert.ok(fr.TRUDVANG.RuleTest.ConsultDescription);
});

test("rule-test annotations follow test-of-situation and skill-test order", async () => {
  globalThis.foundry = {applications: {handlebars: {renderTemplate: async () => ""}}};
  globalThis.document = {createElement: () => {
    let value = "";
    return {set textContent(next) { value = String(next); }, get innerHTML() {
      return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
    }};
  }};
  globalThis.CONFIG = {TRUDVANG: {
    traits: {psyche: "Trait.Psyche", strength: "Trait.Strength", dexterity: "Trait.Dexterity"},
    skills: {},
    knowledgeTree: {agility: [{id: "jumpingClimbingBalancing", label: "Skill.Jump", kind: "specialty", specialties: []}]}
  }};
  globalThis.game = {i18n: {lang: "fr", localize: key => ({
    "TRUDVANG.RuleTest.RollResistance": "Lancer la résistance",
    "TRUDVANG.RuleTest.RollSkill": "Lancer la compétence",
    "Trait.Strength": "Force",
    "Trait.Dexterity": "Dextérité"
  })[key] ?? key}};
  const {annotateRuleTestDescription} = await import(`../modules/rule-tests.mjs?test=${Date.now()}`);
  const document = {system: {catalogId: "vitner-vitner-craft:vitner-pouch:1"}};
  const html = "<p>La cible fait un test de situation pour se libérer.</p>";
  const annotated = annotateRuleTestDescription(html, document);
  assert.match(annotated, /data-test-index="0"/);
  assert.match(annotated, /<i class="fas fa-dice-d20" aria-hidden="true"><\/i> test de situation<\/button>/);
  assert.match(annotateRuleTestDescription("<p>Aucun jet indiqué.</p>", document), /Aucun jet indiqué/);
  const multiTrait = annotateRuleTestDescription("<p>test de Force</p>", {system: {catalogId: "a0A7iPhNiOjPkQlR"}});
  assert.match(multiTrait, /data-test-index="0"/);
});

function buttonsIn(html) {
  return [...String(html).matchAll(/<button[^>]*data-test-index="(\d+)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g)]
    .map(match => ({index: Number(match[1]), title: match[2], label: match[3].replace(/<[^>]*>/g, "").trim()}));
}

test("configured anchors place every test beside its own rule sentence", async () => {
  globalThis.foundry = {applications: {handlebars: {renderTemplate: async () => ""}}};
  globalThis.document = {createElement: () => {
    let value = "";
    return {set textContent(next) { value = String(next); }, get innerHTML() {
      return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
    }};
  }};
  globalThis.CONFIG = {TRUDVANG: {traits: {}, skills: {}, knowledgeTree: {}}};
  const fr = JSON.parse(fs.readFileSync(new URL("../lang/fr.json", import.meta.url)));
  globalThis.game = {i18n: {
    lang: "fr",
    localize: key => key.split(".").reduce((value, part) => value?.[part], fr) ?? key
  }};
  const {annotateRuleTestDescription} = await import(`../modules/rule-tests.mjs?anchors=${Date.now()}`);
  const content = fr.TRUDVANG.Content;

  const hylja = content.CreatureAbility.a3RzraE9EaGbHcId;
  const hyljaButtons = buttonsIn(annotateRuleTestDescription(hylja.Description, {system: {catalogId: "a3RzraE9EaGbHcId"}}));
  assert.deepEqual(hyljaButtons.map(button => button.label), [
    "test d’Arts des ombres avec un modificateur de -10 pour repérer le serpent s’il reste immobile",
    "le modificateur passe alors à -5"
  ]);
  assert.equal(hyljaButtons[1].title, "Trouver &amp; remarquer à -5");

  const landscape = content.Power["vitner-delusion-vitner:landscape-illusion:8"];
  const landscapeButtons = buttonsIn(annotateRuleTestDescription(landscape.Description, {system: {catalogId: "vitner-delusion-vitner:landscape-illusion:8"}}));
  assert.deepEqual(landscapeButtons.map(button => button.label), ["+5", "+2", "+0", "-2", "-5", "-10"]);
  assert.deepEqual(landscapeButtons.map(button => button.index), [0, 1, 2, 3, 4, 5]);

  assert.equal(RULE_TESTS_BY_CATALOG_ID["holy-toikalokke-master-of-elements:gift-of-water:3"], undefined);
  const gift = content.Power["holy-toikalokke-master-of-elements:gift-of-water:3"];
  assert.deepEqual(buttonsIn(annotateRuleTestDescription(gift.Description, {system: {catalogId: "holy-toikalokke-master-of-elements:gift-of-water:3"}})), []);
});

