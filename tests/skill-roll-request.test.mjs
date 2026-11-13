import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const lang = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
Handlebars.registerHelper("localize", (key, options) => {
  const data = options.hash ?? {};
  return String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
});
const cardTemplate = Handlebars.compile(readFileSync(new URL("../templates/chat/skill-roll-request-card.hbs", import.meta.url), "utf8"));

// The shared helper shim reads the Foundry globals at import time.
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) => cardTemplate(data)}}};

const {
  proposedKnowledgeOptions,
  proposedKnowledgeFor,
  proposedKnowledgeLabel,
  proposedKnowledgePath,
  resolveProposedRoll,
  rollProposedSkill,
  requestSkillRoll
} = await import("../modules/skill-roll-request.mjs");

function mockGame(overrides = {}) {
  return {
    user: {id: "gm", isGM: true, name: "GM", avatar: "avatar.png"},
    i18n: {
      localize: key => get(lang, key) ?? key,
      format: (key, data) => String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
    },
    messages: [],
    ...overrides
  };
}

test("the proposed knowledge covers every skill, discipline and specialty", () => {
  const previous = globalThis.game;
  globalThis.game = mockGame();
  try {
    const options = proposedKnowledgeOptions();
    // The nine skills are always offered.
    for (const skill of ["agility", "care", "faith", "fighting", "knowledge", "shadowArts", "vitnerCraft", "wilderness", "entertainment"]) {
      assert.ok(options.some(option => option.kind === "skill" && option.skillKey === skill), `${skill} is offered`);
    }
    // A discipline and one of its specialties are both offered.
    const discipline = options.find(option => option.kind === "discipline" && option.catalogId === "handicraft");
    assert.ok(discipline, "the Handicraft discipline is offered");
    const specialty = options.find(option => option.kind === "specialty" && option.catalogId === "hardMaterials");
    assert.ok(specialty, "the Hard Materials specialty is offered");
    assert.equal(specialty.skillKey, "care", "a specialty keeps its parent skill");
    assert.equal(specialty.group, "Artisanat", "a specialty is grouped under its discipline");
    assert.equal(discipline.group, "Savoir-faire", "a discipline is grouped under its skill");
    // Every catalog id is unique.
    const ids = options.filter(option => option.catalogId).map(option => option.catalogId);
    assert.equal(new Set(ids).size, ids.length, "catalog ids are unique");
  } finally {
    globalThis.game = previous;
  }
});

test("a proposed knowledge resolves back to its option and label", () => {
  const previous = globalThis.game;
  globalThis.game = mockGame();
  try {
    const specialty = proposedKnowledgeFor("care", "hardMaterials");
    assert.equal(specialty.kind, "specialty");
    assert.equal(specialty.catalogId, "hardMaterials");
    assert.equal(proposedKnowledgeLabel(specialty), "Matériaux durs");
    assert.equal(proposedKnowledgePath(specialty), "Savoir-faire · Artisanat · Matériaux durs",
      "a specialty shows its skill and discipline, which the chat card needs");
    const skill = proposedKnowledgeFor("care");
    assert.equal(skill.kind, "skill");
    assert.equal(proposedKnowledgeLabel(skill), "Savoir-faire");
    assert.equal(proposedKnowledgePath(skill), "Savoir-faire");
    const discipline = proposedKnowledgeFor("care", "handicraft");
    assert.equal(proposedKnowledgePath(discipline), "Savoir-faire · Artisanat");
    assert.equal(proposedKnowledgeFor("care", "unknown"), null, "an unknown catalog id is refused");
  } finally {
    globalThis.game = previous;
  }
});

test("a character rolls the proposed specialty it knows, and the plain skill otherwise", () => {
  const previous = globalThis.game;
  globalThis.game = mockGame();
  try {
    const item = {name: "Matériaux durs", img: "book.png", type: "ability",
      system: {catalogId: "hardMaterials", kind: "specialty", parentSkill: "care", level: 3, rollBonus: 2}};
    const known = {
      findKnowledgeItem: id => id === "hardMaterials" ? item : null,
      findRuleKnowledge: id => id === "handicraft" ? {system: {level: 2}} : null
    };
    const resolved = resolveProposedRoll(known, {skillKey: "care", catalogId: "hardMaterials"});
    assert.equal(resolved.label, "Matériaux durs");
    assert.equal(resolved.ability, item, "a character rolls with its own knowledge item");
    assert.equal(resolved.disciplineLevel, undefined, "the discipline is computed from the item itself");

    // An NPC has no item: the book row is rebuilt like the NPC sheet does.
    const npc = {
      findKnowledgeItem: () => null,
      findRuleKnowledge: id => id === "hardMaterials"
        ? {name: "Matériaux durs", uuid: "", type: "ability", system: {catalogId: "hardMaterials", kind: "specialty", parentSkill: "care", level: 3}}
        : id === "handicraft" ? {system: {level: 2}} : null
    };
    const npcResolved = resolveProposedRoll(npc, {skillKey: "care", catalogId: "hardMaterials"});
    assert.equal(npcResolved.ability.system.catalogId, "hardMaterials");
    assert.equal(npcResolved.ability.system.level, 3);
    assert.equal(npcResolved.ability.system.rollBonus, 2);
    assert.equal(npcResolved.disciplineLevel, 2, "the parent discipline level is read");

    const unknown = {findKnowledgeItem: () => null, findRuleKnowledge: () => null};
    const fallback = resolveProposedRoll(unknown, {skillKey: "care", catalogId: "hardMaterials"});
    assert.equal(fallback.ability, null, "a character who does not know it falls back to the skill");
    assert.equal(fallback.label, "Savoir-faire");
  } finally {
    globalThis.game = previous;
  }
});

test("the proposed roll prefills the situation modifier and the knowledge label", async () => {
  const previous = globalThis.game;
  globalThis.game = mockGame();
  try {
    const calls = [];
    const actor = {
      rollSkill: (skillKey, options) => {calls.push({kind: "skill", skillKey, options}); return "rolled";},
      rollAbility: (item, context) => {calls.push({kind: "ability", item, context}); return "rolled";}
    };
    assert.equal(await rollProposedSkill(actor, {skillKey: "care", catalogId: "", modifier: -2}), "rolled");
    assert.equal(calls[0].kind, "skill");
    assert.equal(calls[0].skillKey, "care");
    assert.equal(calls[0].options.bonus, -2, "the situation modifier prefills the roll");
    assert.ok(calls[0].options.bonusLabel, "the modifier is labelled as a situation modifier");

    const knows = {
      findKnowledgeItem: id => id === "hardMaterials"
        ? {name: "Matériaux durs", img: "book.png", system: {catalogId: "hardMaterials", kind: "specialty", parentSkill: "care", level: 3, rollBonus: 2}}
        : null,
      findRuleKnowledge: () => null,
      rollAbility: (item, context) => {calls.push({kind: "ability", item, context}); return "rolled";}
    };
    await rollProposedSkill(knows, {skillKey: "care", catalogId: "hardMaterials", modifier: 3});
    assert.equal(calls[1].kind, "ability");
    assert.equal(calls[1].item.system.catalogId, "hardMaterials");
    assert.equal(calls[1].context.bonus, 3);
  } finally {
    globalThis.game = previous;
  }
});

test("only the GM may post a skill-roll request", async () => {
  const previous = {game: globalThis.game, ui: globalThis.ui};
  const warnings = [];
  globalThis.ui = {notifications: {warn: message => warnings.push(message)}};
  try {
    globalThis.game = mockGame({user: {id: "pc", isGM: false, name: "PC"}});
    assert.equal(await requestSkillRoll({skillKey: "care", modifier: 0}), null);
    assert.equal(warnings.length, 1, "the refusal is reported");
  } finally {
    globalThis.game = previous.game;
    globalThis.ui = previous.ui;
  }
});

test("a skill-roll request is posted as a chat card carrying the knowledge and the modifier", async () => {
  const previous = {game: globalThis.game, CONST: globalThis.CONST};
  const created = [];
  try {
    globalThis.CONST = {CHAT_MESSAGE_STYLES: {OTHER: 4}};
    globalThis.game = mockGame();
    globalThis.game.messages = created;
    globalThis.ChatMessage = {
      getSpeaker: () => ({alias: "GM"}),
      create: async data => {created.push(data); return data;}
    };
    const result = await requestSkillRoll({skillKey: "care", catalogId: "hardMaterials", modifier: -2, title: "Porte condamnée"});
    assert.equal(result.skillKey, "care");
    assert.equal(result.catalogId, "hardMaterials");
    assert.equal(result.modifier, -2);
    assert.equal(result.title, "Porte condamnée");
    assert.equal(created.length, 1, "a single chat card is posted");
    const request = created[0].flags["trudvang-chronicles"].skillRollRequest;
    assert.equal(request.catalogId, "hardMaterials");
    assert.equal(request.modifier, -2);
    assert.equal(request.title, "Porte condamnée");
    // The card offers a button every player can use.
    const html = created[0].content;
    assert.match(html, /data-action="roll-skill-request"/, "the card carries the roll button");
    assert.match(html, /Matériaux durs/, "the card names the proposed knowledge");
    assert.match(html, /Porte condamnée/, "the card shows the requested title");
  } finally {
    globalThis.game = previous.game;
    globalThis.CONST = previous.CONST;
    delete globalThis.ChatMessage;
  }
});
