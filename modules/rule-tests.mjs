import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";
import {escapeHtml} from "./helpers.mjs";
import {annotateTransformationDescription} from "./transformations.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const legacyAbilityIdByName = new Map(Object.entries(CREATURE_ABILITY_REFERENCES).map(([name, ref]) => [name, ref.id]));

function flag(document, key) {
  return document?.getFlag?.(SYSTEM_ID, key) ?? document?.flags?.[SYSTEM_ID]?.[key];
}

export function ruleTestsForDocument(document) {
  if (game.i18n?.lang && game.i18n.lang !== "fr") return [];
  const id = document?.flags?.[SYSTEM_ID]?.transformation?.sourceId || document?.system?.catalogId
    || legacyAbilityIdByName.get(flag(document, "feat"))
    || legacyAbilityIdByName.get(document?.name);
  return id ? RULE_TESTS_BY_CATALOG_ID[id] ?? [] : [];
}

/** Usage cards label each response with the action from the French source data. */
export function ruleTestActionViews(document) {
  return ruleTestsForDocument(document).map((test, index) => ({index, action: test.action,
    title: game.i18n.localize(test.kind === "skill" ? "TRUDVANG.RuleTest.RollSkill" : "TRUDVANG.RuleTest.RollResistance")}));
}

export function ruleTestValueLabel(test, localize = key => game.i18n.localize(key)) {
  const config = globalThis.CONFIG?.TRUDVANG ?? {};
  const tree = config.knowledgeTree ?? {};
  const skill = Object.values(tree).flatMap(rows => rows.flatMap(row => [row, ...(row.specialties || [])]))
    .find(entry => entry.id === test.skill);
  if (test.kind === "skill") {
    const modifier = Number(test.sv || 0);
    const sign = modifier > 0 ? "+" : "";
    return `${localize("TRUDVANG.RuleTest.SkillShort")}${skill ? ` · ${localize(skill.label)}` : ""} ${sign}${modifier}`;
  }
  const sv = Number.isInteger(test.sv) ? test.sv : localize("TRUDVANG.RuleTest.VariableValue");
  const traitKeys = (Array.isArray(test.trait) ? test.trait : [test.trait]).filter(key => key && key !== "aucun" && config.traits?.[key]);
  const trait = traitKeys.length
    ? traitKeys.map(key => localize(config.traits[key])).join(" / ")
    : localize("TRUDVANG.Dialog.TraitSituationNoTrait");
  return `${localize("TRUDVANG.RuleTest.ResistanceShort")} · ${trait} · SV ${sv}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function descriptionAnchors(description, tests) {
  const source = String(description ?? "");
  const anchors = [];
  const addMatches = (pattern, classify) => {
    for (const match of source.matchAll(pattern)) {
      const anchor = classify(match);
      if (anchor) anchors.push({...anchor, start: match.index, end: match.index + match[0].length, phrase: match[0]});
    }
  };

  addMatches(/\b(?:tests?|jets?|épreuves?)\s+(?:de\s+)?(situation|comp[eé]tence)s?\b/giu, match => ({
    kind: match[1].toLocaleLowerCase().startsWith("situ") ? "resist" : "skill"
  }));
  addMatches(/\b(?:tests?|jets?|épreuves?|résistance)\s+(?:de\s+)?VS\b/giu, () => ({kind: "resist"}));

  const config = globalThis.CONFIG?.TRUDVANG ?? {};
  const tree = config.knowledgeTree ?? {};
  const localizedNames = [];
  for (const [id, label] of Object.entries(config.traits ?? {})) {
    const name = game.i18n.localize(label);
    if (name && name !== label) localizedNames.push({id, kind: "resist", name});
  }
  for (const [skillKey, label] of Object.entries(config.skills ?? {})) {
    const name = game.i18n.localize(label);
    if (name && name !== label) localizedNames.push({id: skillKey, skillKey, kind: "skill", name});
  }
  for (const [skillKey, disciplines] of Object.entries(tree)) {
    for (const discipline of disciplines) {
      localizedNames.push({id: discipline.id, skillKey, kind: "skill", name: game.i18n.localize(discipline.label)});
      for (const specialty of discipline.specialties ?? []) {
        localizedNames.push({id: specialty.id, skillKey, kind: "skill", name: game.i18n.localize(specialty.label)});
      }
    }
  }
  const namedTerms = [...new Map(localizedNames
    .filter(entry => entry.name && !entry.name.startsWith("TRUDVANG."))
    .map(entry => [`${entry.kind}:${entry.id}:${entry.name}`, entry])).values()]
    .sort((a, b) => b.name.length - a.name.length);
  if (namedTerms.length) {
    const terms = namedTerms.map(entry => escapeRegExp(entry.name)).join("|");
    addMatches(new RegExp(`\\b(?:tests?|jets?|épreuves?)\\s+(?:(?:avec\\s+(?:la\\s+)?comp[eé]tence\\s+(?:de|d['’])\\s*)|(?:de|d['’])\\s*)(${terms})(?![\\p{L}\\p{N}_])`, "giu"), match => {
      const name = match[1].toLocaleLowerCase();
      const entry = namedTerms.find(candidate => candidate.name.toLocaleLowerCase() === name);
      return entry ? {kind: entry.kind, namedId: entry.id, skillKey: entry.skillKey} : null;
    });
  }

  anchors.sort((a, b) => a.start - b.start || b.end - a.end);
  return anchors.filter((anchor, index) => !anchors.slice(0, index).some(previous => anchor.start < previous.end && previous.start < anchor.end));
}

function testMatchesAnchor(test, anchor) {
  if (anchor.kind && test.kind !== anchor.kind) return false;
  if (!anchor.namedId) return true;
  if (test.kind === "resist") return (Array.isArray(test.trait) ? test.trait : [test.trait]).includes(anchor.namedId);
  if (test.skill === anchor.namedId || test.skill === anchor.skillKey) return true;
  return Boolean(anchor.skillKey && Object.entries(globalThis.CONFIG?.TRUDVANG?.knowledgeTree ?? {}).some(([skillKey, rows]) =>
    skillKey === anchor.skillKey && rows.some(row => row.id === test.skill || row.specialties?.some(specialty => specialty.id === test.skill))));
}

function inlineTestButton(test, index, phrase, label = phrase) {
  const kind = test.kind;
  const buttonTitle = game.i18n.localize(kind === "resist"
    ? "TRUDVANG.RuleTest.RollResistance" : "TRUDVANG.RuleTest.RollSkill");
  return `<button type="button" class="trudvang-inline-rule-test" data-action="roll-rule-test" data-test-index="${index}" title="${escapeHtml(buttonTitle)}"><i class="fas fa-dice-d20" aria-hidden="true"></i> ${escapeHtml(label)}</button>`;
}

/** Link configured tests to the closest matching situation, skill, trait or resistance wording. */
export function annotateRuleTestDescription(description, document) {
  return annotateTransformationDescription(annotateTests(description, document), document);
}

function annotateTests(description, document) {
  const tests = ruleTestsForDocument(document);
  if (!tests.length) return String(description ?? "");
  const anchors = descriptionAnchors(description, tests).map(anchor => ({...anchor, rows: []}));
  const remaining = new Set(tests.map((test, index) => index));

  for (const anchor of anchors) {
    const index = [...remaining].find(candidate => testMatchesAnchor(tests[candidate], anchor));
    if (index === undefined) continue;
    anchor.rows.push(index);
    remaining.delete(index);
  }

  // A single phrase can describe several configured variants (for example, one test per distance band).
  // Keep every variant reachable beside the shared phrase, with its value visible as the link label.
  for (const index of remaining) {
    const anchor = anchors.find(candidate => testMatchesAnchor(tests[index], candidate));
    if (!anchor) continue;
    anchor.rows.push(index);
    remaining.delete(index);
  }

  let result = String(description ?? "");
  for (const anchor of [...anchors].reverse()) {
    if (!anchor.rows.length) continue;
    const buttons = anchor.rows.map((index, position) => inlineTestButton(
      tests[index], index, anchor.phrase,
      position === 0 ? anchor.phrase : `(${ruleTestValueLabel(tests[index])})`
    )).join(" ");
    result = `${result.slice(0, anchor.start)}${buttons}${result.slice(anchor.end)}`;
  }
  return result;
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
  const notes = [test.condition, test.modifier].filter(Boolean);
  if (Number.isFinite(Number(test.base))) notes.push(game.i18n.format("TRUDVANG.Dialog.RuleTestBaseVC", {value: Number(test.base)}));
  return actor.rollAbility(rollItem, {
    disciplineLevel: Number(discipline?.system?.level || 0),
    bonus: modifier,
    notes,
    label: game.i18n.format("TRUDVANG.RuleTest.SkillAction", {source: document?.name ?? "", action: test.action || ""}),
    successConsequence: test.success || "",
    failureConsequence: test.failure || "",
    criticalSuccessConsequence: test.criticalSuccess || "",
    criticalFailureConsequence: test.criticalFailure || ""
  });
}
