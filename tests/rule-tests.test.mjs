import test from "node:test";
import assert from "node:assert/strict";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";

test("the French rule-test catalogue maps powers and creature abilities by stable catalogue id", () => {
  assert.equal(RULE_TESTS_BY_CATALOG_ID["vitner-vitner-craft:vitner-pouch:1"][0].sv, 8);
  const absorptionId = CREATURE_ABILITY_REFERENCES["Absorption de vie"].id;
  assert.equal(RULE_TESTS_BY_CATALOG_ID[absorptionId][0].trait, "psyche");
  assert.equal(RULE_TESTS_BY_CATALOG_ID[absorptionId][0].sv.by.length, 2);
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
    traits: {psyche: "Trait.Psyche"},
    skills: {},
    knowledgeTree: {agility: [{id: "jumpingClimbingBalancing", label: "Skill.Jump", kind: "specialty", specialties: []}]}
  }};
  globalThis.game = {i18n: {lang: "fr", localize: key => ({
    "TRUDVANG.RuleTest.RollResistance": "Lancer la résistance",
    "TRUDVANG.RuleTest.RollSkill": "Lancer la compétence"
  })[key] ?? key}};
  const {annotateRuleTestDescription} = await import(`../modules/rule-tests.mjs?test=${Date.now()}`);
  const document = {system: {catalogId: "vitner-vitner-craft:vitner-pouch:1"}};
  const html = "<p>La cible fait un test de situation pour se libérer.</p>";
  const annotated = annotateRuleTestDescription(html, document);
  assert.match(annotated, /data-test-index="0"/);
  assert.match(annotated, />test de situation<\/button>/);
  assert.match(annotateRuleTestDescription("<p>Aucun jet indiqué.</p>", document), /Aucun jet indiqué/);
});

