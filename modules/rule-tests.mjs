import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";
import {escapeHtml} from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const legacyAbilityIdByName = new Map(Object.entries(CREATURE_ABILITY_REFERENCES).map(([name, ref]) => [name, ref.id]));

function flag(document, key) {
  return document?.getFlag?.(SYSTEM_ID, key) ?? document?.flags?.[SYSTEM_ID]?.[key];
}

export function ruleTestsForDocument(document) {
  if (game.i18n?.lang && game.i18n.lang !== "fr") return [];
  const id = document?.system?.catalogId
    || legacyAbilityIdByName.get(flag(document, "feat"))
    || legacyAbilityIdByName.get(document?.name);
  return id ? RULE_TESTS_BY_CATALOG_ID[id] ?? [] : [];
}

export function ruleTestValueLabel(test, localize = key => game.i18n.localize(key)) {
  const tree = CONFIG.TRUDVANG?.knowledgeTree ?? {};
  const skill = Object.values(tree).flatMap(rows => rows.flatMap(row => [row, ...(row.specialties || [])]))
    .find(entry => entry.id === test.skill);
  if (test.kind === "skill") {
    const modifier = Number(test.sv || 0);
    const sign = modifier > 0 ? "+" : "";
    return `${localize("TRUDVANG.RuleTest.SkillShort")}${skill ? ` · ${localize(skill.label)}` : ""} ${sign}${modifier}`;
  }
  const sv = Number.isInteger(test.sv) ? test.sv : localize("TRUDVANG.RuleTest.VariableValue");
  const trait = test.trait && test.trait !== "aucun" && CONFIG.TRUDVANG?.traits?.[test.trait]
    ? localize(CONFIG.TRUDVANG.traits[test.trait]) : localize("TRUDVANG.Dialog.TraitSituationNoTrait");
  return `${localize("TRUDVANG.RuleTest.ResistanceShort")} · ${trait} · SV ${sv}`;
}

export function ruleTestViews(document, localize = key => game.i18n.localize(key)) {
  return ruleTestsForDocument(document).map((test, index) => ({
    index,
    kind: test.kind,
    label: ruleTestValueLabel(test, localize),
    title: localize(test.kind === "skill" ? "TRUDVANG.RuleTest.RollSkill" : "TRUDVANG.RuleTest.RollResistance")
  }));
}

/** Wrap the description's matching test phrase in its corresponding configured button. */
export function annotateRuleTestDescription(description, document) {
  const tests = ruleTestsForDocument(document);
  if (!tests.length) return String(description ?? "");
  const queues = {
    resist: tests.map((test, index) => ({test, index})).filter(row => row.test.kind === "resist"),
    skill: tests.map((test, index) => ({test, index})).filter(row => row.test.kind === "skill")
  };
  const pattern = /\btests?\s+(?:de\s+)?(situation|comp[eé]tence)s?\b/giu;
  return String(description ?? "").replace(pattern, (phrase, label) => {
    const kind = label.toLocaleLowerCase().startsWith("situ") ? "resist" : "skill";
    const row = queues[kind].shift();
    if (!row) return phrase;
    const buttonTitle = game.i18n.localize(kind === "resist"
      ? "TRUDVANG.RuleTest.RollResistance" : "TRUDVANG.RuleTest.RollSkill");
    return `<button type="button" class="trudvang-inline-rule-test" data-action="roll-rule-test" data-test-index="${row.index}" title="${escapeHtml(buttonTitle)}">${phrase}</button>`;
  });
}

export function testActorForUser(user = game.user) {
  const controlled = Array.from(globalThis.canvas?.tokens?.controlled ?? [])
    .find(token => ["character", "npc"].includes(token.actor?.type) && token.actor.isOwner);
  if (controlled) return controlled.actor;
  if (["character", "npc"].includes(user?.character?.type) && user.character.isOwner) return user.character;
  return null;
}

function abilityEntryFor(actor, catalogId) {
  if (actor.getCatalogEntry) return actor.getCatalogEntry(catalogId);
  const tree = CONFIG.TRUDVANG?.knowledgeTree ?? {};
  for (const [skillKey, disciplines] of Object.entries(tree)) {
    for (const discipline of disciplines) {
      if (discipline.id === catalogId) return {...discipline, skillKey, kind: "discipline", parentCatalogId: ""};
      const specialty = discipline.specialties?.find(entry => entry.id === catalogId);
      if (specialty) return {...specialty, skillKey, kind: "specialty", parentCatalogId: discipline.id};
    }
  }
  return null;
}

export async function performRuleTest({document, index, actor = testActorForUser()} = {}) {
  const test = ruleTestsForDocument(document)[Number(index)];
  if (!test || !actor || !["character", "npc"].includes(actor.type)) {
    if (!actor) ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledActorForTraitRoll"));
    return null;
  }
  if (test.kind === "resist") {
    const {rollConfiguredTraitSituation} = await import("./dice.mjs");
    return rollConfiguredTraitSituation({actor, test, sourceName: document?.name ?? ""});
  }
  const entry = abilityEntryFor(actor, test.skill);
  const skillKey = entry?.skillKey || (CONFIG.TRUDVANG?.skills?.[test.skill] ? test.skill : "");
  if (!skillKey) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.InvalidRuleTestSkill"));
    return null;
  }
  const item = actor.findRuleKnowledge?.(test.skill) ?? actor.findKnowledgeItem?.(test.skill);
  const discipline = entry?.parentCatalogId ? actor.findRuleKnowledge?.(entry.parentCatalogId) : null;
  const rollItem = item ?? {
    name: entry ? game.i18n.localize(entry.label) : game.i18n.localize(CONFIG.TRUDVANG.skills[skillKey]),
    type: "ability",
    system: {
      catalogId: test.skill,
      kind: entry?.kind ?? "discipline",
      parentSkill: skillKey,
      parentDiscipline: entry?.parentDiscipline ?? "",
      level: 0,
      rollBonus: entry?.rollBonus ?? (entry?.kind === "specialty" ? 2 : 1)
    }
  };
  const modifier = Number(test.sv || 0);
  return actor.rollAbility(rollItem, {
    disciplineLevel: Number(discipline?.system?.level || 0),
    bonus: modifier,
    label: game.i18n.format("TRUDVANG.RuleTest.SkillAction", {source: document?.name ?? "", action: test.action || ""}),
    successConsequence: test.success || "",
    failureConsequence: test.failure || ""
  });
}
