import test from "node:test";
import assert from "node:assert/strict";
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

