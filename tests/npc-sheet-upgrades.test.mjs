import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {TRUDVANG} from "../modules/config.mjs";
import {clampPickerLevel, matchesPickerFilter, npcKnowledgeAddGate, normalizePickerText,
  disciplinePickerOptions, unlearnedSpecialtyOptions} from "../modules/rules/npc-summary.mjs";
import {resolveNpcSkillTreeSync} from "../modules/npc-inventory.mjs";
import {COMBAT_POOL_IDS} from "../modules/rules/combat-pool-resolver.mjs";

globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const set = (object, path, value) => {
  const keys = path.split(".");
  const leaf = keys.pop();
  const parent = keys.reduce((value, key) => value[key] ??= {}, object);
  parent[leaf] = value;
};
class Field { constructor(options) { this.options = options; } }
globalThis.foundry = {
  abstract: {TypeDataModel: class { prepareBaseData() {} }},
  data: {ActiveEffectTypeDataModel: class {}, fields: {
    NumberField: Field, StringField: Field, HTMLField: Field, BooleanField: Field, ArrayField: Field,
    SchemaField: class { constructor(fields) { this.fields = fields; } }
  }},
  documents: {Actor: class {
    prepareDerivedData() {}
    getFlag() { return null; }
    async _preCreate() { return true; }
    async getTokenDocument(data, options) { return {data, options}; }
  }, ActiveEffect: class {}},
  applications: {
    api: {HandlebarsApplicationMixin: Base => Base,
      DocumentSheetV2: class {
        constructor({document}) { this.document = document; this.isEditable = document.isOwner; }
        async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
        render(options) { this.renderOptions = options; return this; }
      },
      DialogV2: class { static async prompt() { return null; } static async wait() { return null; } }},
    sheets: {ActorSheetV2: class { async _prepareContext() { return {}; } async _onRender() {} _getHeaderControls() { return []; } }, ItemSheetV2: class {
      constructor({document} = {}) { this.document = document; this.item = document; }
      async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
    }},
    ux: {TextEditor: {implementation: {enrichHTML: async value => value}}},
    handlebars: {renderTemplate: async () => ""}
  },
  utils: {getProperty: get, setProperty: set, hasProperty: (object, path) => get(object, path) !== undefined,
    expandObject: flat => { const output = {}; for (const [key, value] of Object.entries(flat)) set(output, key, value); return output; },
    deepClone: structuredClone, fromUuidSync: uuid => globalThis.__uuidRegistry?.get(uuid) ?? null}
};
const fr = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
globalThis.game = {user: {isGM: true}, combat: null, packs: {get: () => null}, i18n: {
  lang: "fr", localize: key => get(fr, key) ?? key,
  format: (key, data) => String(get(fr, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
}};
const warnings = [];
globalThis.ui = {notifications: {warn: text => { warnings.push(text); return text; }, info: () => {}, error: () => {}}};
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActorSheet, TrudvangNpcSheet} = await import("../modules/sheets/actor-sheet.mjs");

test("direct effect drops use the actor stacking pipeline and clear template lifetime", async () => {
  let saved;
  const actor = {canUserModify: () => true, createTrudvangEffect: async data => {saved = data; return data;}};
  const source = {uuid: "Item.source.ActiveEffect.effect", toObject: () => ({_id: "effect", name: "Same source", transfer: true,
    system: {stacking: "refresh", changes: []}, start: {time: 12}, duration: {value: 2, units: "hours", expired: true}})};
  await TrudvangActorSheet.prototype._onDropActiveEffect.call({actor}, {}, source);
  assert.equal(saved._id, undefined);
  assert.equal(saved.origin, source.uuid);
  assert.equal(saved.transfer, false);
  assert.equal(saved.start, null);
  assert.equal(saved.duration.expired, false);
  assert.equal(saved.system.stacking, "refresh");
});

test("picker filter matches names case- and diacritic-insensitively", () => {
  assert.equal(matchesPickerFilter("Saisie", "saisie"), true);
  assert.equal(matchesPickerFilter("Épée bâtarde", "epee"), true);
  assert.equal(matchesPickerFilter("Lutte (saisie)", "lutte"), true);
  assert.equal(matchesPickerFilter("Vision nocturne", ""), true);
  assert.equal(matchesPickerFilter("Vision nocturne", "   "), true);
  assert.equal(matchesPickerFilter("Vision nocturne", "tenace"), false);
  assert.equal(normalizePickerText("Âmes Sœurs (esprit)"), "ames soeurs");
});

test("capacity filter parity: the same helper filters localized capacity names", () => {
  assert.equal(matchesPickerFilter("Saisie", "SAISIE"), true);
  assert.equal(matchesPickerFilter("Durable", "durable"), true);
  assert.equal(matchesPickerFilter("Durable", "saisie"), false);
});

test("picker levels clamp to the skill (1-10) and knowledge (1-5) bounds", () => {
  assert.equal(clampPickerLevel(9, "skill"), 9);
  assert.equal(clampPickerLevel(42, "skill"), 10);
  assert.equal(clampPickerLevel(0, "skill"), 1);
  assert.equal(clampPickerLevel(3, "discipline"), 3);
  assert.equal(clampPickerLevel(9, "discipline"), 5);
  assert.equal(clampPickerLevel(9, "specialty"), 5);
  assert.equal(clampPickerLevel("not-a-number", "skill"), 1);
  assert.equal(clampPickerLevel(2.9, "discipline"), 2);
});

test("cascading options keep learned disciplines as specialty parents", () => {
  const learned = new Set(["armedFighting", "wrestling"]);
  const find = id => learned.has(id) ? {system: {level: 2}} : null;
  const localize = key => key;
  const disciplines = disciplinePickerOptions("fighting", TRUDVANG.knowledgeTree, find, localize);
  assert.ok(disciplines.length > 0);
  assert.ok(disciplines.some(option => option.id === "armedFighting"), "learned discipline stays selectable as parent");
  const ids = disciplines.map(option => option.id);
  const firstLearned = ids.findIndex(id => learned.has(id));
  assert.ok(firstLearned === -1 || ids.slice(0, firstLearned).every(id => !learned.has(id)), "unlearned first, learned parents after");
  const specialties = unlearnedSpecialtyOptions("fighting", "unarmedFighting", TRUDVANG.knowledgeTree, find, localize);
  assert.ok(!specialties.some(option => option.id === "wrestling"));
  assert.ok(specialties.every(option => option.parentId === "unarmedFighting"));
  assert.deepEqual(unlearnedSpecialtyOptions("fighting", "unknown-discipline", TRUDVANG.knowledgeTree, find, localize), []);
});

test("knowledge Add gates block parentless specialties, weak skills and religions without auto-creating parents", () => {
  const fighting = id => id === "unarmedFighting" ? {system: {level: 1}} : null;
  const none = () => null;
  const entry = {id: "wrestling", kind: "specialty", skillKey: "fighting", parentCatalogId: "unarmedFighting"};
  const base = {kind: "specialty", skillKey: "fighting", catalogId: "wrestling", level: 1, entry,
    findKnowledgeItem: none, getSkillValue: () => 10, getRequiredSkillValue: () => 4, catalogRestriction: null};
  assert.deepEqual(npcKnowledgeAddGate(base).key, "TRUDVANG.Warning.ParentDisciplineRequired");
  assert.equal(npcKnowledgeAddGate({...base, findKnowledgeItem: fighting}), null);
  assert.deepEqual(npcKnowledgeAddGate({...base, findKnowledgeItem: fighting, getSkillValue: () => 1,
    getRequiredSkillValue: rank => rank >= 2 ? 7 : 4, level: 2}),
  {key: "TRUDVANG.Warning.SkillRequirement", data: {sv: 7}});
  assert.deepEqual(npcKnowledgeAddGate({...base, findKnowledgeItem: fighting,
    catalogRestriction: "TRUDVANG.Warning.ReligionExclusive"}).key, "TRUDVANG.Warning.ReligionExclusive");
  assert.equal(npcKnowledgeAddGate({kind: "skill", skillKey: "fighting", catalogId: "", level: 9}), null);
  assert.ok(npcKnowledgeAddGate({kind: "skill", skillKey: "", catalogId: "", level: 9}).key);
});

test("importer preservation: only an empty skill tree is seeded, GM edits are never clobbered", () => {
  const baked = [{name: "Combat", kind: "skill", value: 8}];
  const seeded = resolveNpcSkillTreeSync([], baked);
  assert.deepEqual(seeded, baked);
  assert.notEqual(seeded, baked, "seeded trees are cloned, never shared references");
  assert.equal(resolveNpcSkillTreeSync([{name: "Custom", kind: "skill", value: 3}], baked), null);
  // A GM-tuned tree that happens to match another starter exactly is still preserved.
  assert.equal(resolveNpcSkillTreeSync(structuredClone(baked), [{name: "Other", kind: "skill", value: 1}]), null);
  assert.equal(resolveNpcSkillTreeSync([], []), null);
  assert.equal(resolveNpcSkillTreeSync([{name: "Custom", kind: "skill", value: 3}], []), null);
});

function abilityItem(id, catalogId, kind, level) {
  const item = {id, type: "ability", name: catalogId, uuid: `Actor.npc.Item.${id}`,
    system: {catalogId, kind, parentSkill: "fighting", parentDiscipline: "", level, offHandLevel: 0, freeLevels: 0, rollBonus: kind === "specialty" ? 2 : 1},
    sheet: {render: () => item}};
  item.update = async changes => { for (const [path, value] of Object.entries(changes)) set(item, path, value); return item; };
  item.delete = async () => { item.deleted = true; return item; };
  return item;
}

function npcActor(items = [], skillTree = []) {
  const traits = Object.fromEntries(Object.keys(TRUDVANG.traits).map(key => [key, 0]));
  const skills = Object.fromEntries(Object.keys(TRUDVANG.skills).map(key => [key, {value: 10, bonus: 0}]));
  const instance = new TrudvangActor();
  Object.assign(instance, {type: "npc", name: "Test creature", id: "npc", img: "", items, statuses: new Set(),
    system: {traits, traitCurrent: {}, skills,
      effective: {traits: {...traits}, skills: Object.fromEntries(Object.entries(skills).map(([key, skill]) => [key, skill.value]))},
      resources: {body: {value: 10, max: 40}, combat: {value: 20, max: 20}, fear: {value: 0, max: 50},
        vitner: {value: 0, max: 0}, divinity: {value: 0, max: 0}},
      combatPools: Object.fromEntries(COMBAT_POOL_IDS.map(id => [id, {spent: -1}])),
      movement: {base: 10, current: 10}, initiative: {base: 3, current: 3},
      modifiers: {rolls: {}}, details: {naturalArmor: 0}, survivalRounds: -1, skillTree,
      experience: {}, damage: {level: "unhurt", penalty: 0}, fearInsane: false},
    calculateBuildCost: () => 0, calculateCreationCosts: () => ({}), getKnowledgeLevelCost: () => 0,
    canChooseCatalogKnowledge: () => true, allApplicableEffects: () => [],
    isOwner: true});
  instance._source = {system: structuredClone(instance.system)};
  instance.createEmbeddedDocuments = async (embedded, data) => {
    assert.equal(embedded, "Item");
    return data.map((entry, index) => {
      const doc = {id: `new${index}`, uuid: `Actor.npc.Item.new${index}`, name: entry.name, type: entry.type,
        img: "icons/svg/book.svg", system: {...entry.system}, sheet: {render: () => doc}};
      doc.update = async changes => { for (const [path, value] of Object.entries(changes)) set(doc, path, value); return doc; };
      doc.delete = async () => { doc.deleted = true; return doc; };
      instance.items.push(doc);
      return doc;
    });
  };
  instance.update = async changes => { for (const [path, value] of Object.entries(changes)) set(instance, path, value); return instance; };
  return instance;
}

for (const name of ["eq", "and", "or", "not", "concat", "checked", "editor", "selectOptions", "localize", "signed"]) {
  Handlebars.registerHelper(name, (...args) => {
    const options = args.pop();
    if (name === "eq") return args[0] === args[1];
    if (name === "and") return args.every(Boolean);
    if (name === "or") return args.some(Boolean);
    if (name === "not") return !args[0];
    if (name === "checked") return args[0] ? "checked" : "";
    if (name === "localize") return game.i18n.format(args[0], options.hash);
    if (name === "signed") return Number(args[0]) > 0 ? `+${Number(args[0])}` : `${Number(args[0])}`;
    return "";
  });
}
const render = Handlebars.compile(readFileSync(new URL("../templates/actor/npc-sheet.hbs", import.meta.url), "utf8"));

test("NPC sheets default to view mode with a mode toggle; the toggle flips sheet-local state", async () => {
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  assert.equal((await sheet._prepareContext({})).npcEditMode, false);
  const action = TrudvangActorSheet.DEFAULT_OPTIONS.actions["toggle-npc-edit-mode"];
  let rendered = 0;
  sheet.render = async () => { rendered += 1; return sheet; };
  await action.call(sheet, {preventDefault() {}, stopPropagation() {}},
    {dataset: {action: "toggle-npc-edit-mode"}, closest: () => null});
  assert.equal(sheet._npcEditMode, true);
  assert.equal(rendered, 1);
  assert.equal((await sheet._prepareContext({})).npcEditMode, true);
  assert.ok(!("npcEditMode" in npc.system), "edit mode never leaks into actor data");
});

test("view mode rolls only: no mutating controls, but rolls/damage/toggles/movement stay active", async () => {
  const book = [{name: "Combat", kind: "skill", value: 8}];
  const npc = npcActor([abilityItem("d1", "armedFighting", "discipline", 2),
    {id: "g1", type: "gear", name: "Corde", uuid: "Actor.npc.Item.g1", img: "icons/svg/book.svg",
      system: {quantity: 1, equipped: false}}], book);
  npc.system.resources.vitner = {value: 0, max: 6};
  npc.allApplicableEffects = () => [{uuid: "Effect.1", name: "Bénédiction", img: "icons/svg/aura.svg",
    sourceName: "MJ", duration: {}, active: true, disabled: false, isSuppressed: false,
    parent: {documentName: "Actor"}, system: {changes: []}, canUserModify: () => true}];
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  const html = render(await sheet._prepareContext({}));
  assert.match(html, /data-action="toggle-npc-edit-mode"/);
  assert.match(html, /Mode édition/);
  for (const action of ["adjust-catalog-knowledge", "adjust-item-level", "add-npc-knowledge", "add-npc-capacity",
    "capacity-delete"]) {
    assert.doesNotMatch(html, new RegExp(`data-action="${action}"(?!-)`), `${action} must stay hidden in view mode`);
  }
  assert.match(html, /data-action="effect-add"/, "effect add stays available outside edit mode, like PCs");
  for (const action of ["item-create", "item-delete", "effect-delete", "reset-traits", "restore-vitner"]) {
    assert.match(html, new RegExp(`data-action="${action}"`), `${action} is back outside edit mode`);
  }
  assert.doesNotMatch(html, /data-action="reset-combat"[^>]*disabled/, "combat reset usable outside edit mode");
  assert.match(html, /data-action="add-tablet"[^>]*disabled/, "tablet add stays visible but disabled in view mode");
  assert.doesNotMatch(html, /name="system\.skillTree\.0\.name"/);
  assert.doesNotMatch(html, /name="system\.skillTree\.0\.value"/);
  for (const action of ["roll-skill", "roll-npc-book-skill", "roll-npc-health", "item-roll",
    "movement-action", "generic-combat-action", "roll-fear-factor", "roll-concentration", "effect-toggle"]) {
    assert.match(html, new RegExp(`data-action="${action}"`), `${action} must stay usable in view mode`);
  }
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
});

test("edit mode unlocks mutating controls and editable book-reference rows", async () => {
  const book = [{name: "Combat", kind: "skill", value: 8},
    {name: "Combat armé", kind: "discipline", value: 2}];
  const npc = npcActor([abilityItem("d1", "armedFighting", "discipline", 2),
    {type: "creatureAbility", name: "Saisie", uuid: "Actor.npc.Item.cap1", img: "icons/svg/aura.svg",
      system: {catalogId: "saisie", summary: "", description: "", source: {book: "", page: 0}}}], book);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true; sheet._npcEditMode = true;
  const html = render(await sheet._prepareContext({}));
  assert.match(html, /Mode vue/);
  assert.match(html, /creation-mode-button active/);
  for (const action of ["adjust-catalog-knowledge", "add-npc-knowledge", "add-npc-capacity",
    "capacity-delete", "item-delete", "effect-add"]) {
    assert.match(html, new RegExp(`data-action="${action}"`), `${action} must be present in edit mode`);
  }
  assert.match(html, /name="system\.skillTree\.0\.name"/);
  assert.match(html, /name="system\.skillTree\.0\.value"/);
  assert.match(html, /name="system\.skillTree\.1\.name"/);
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
});

test("book name/value inputs persist to system.skillTree through the plain submit path", async () => {
  const book = [{name: "Combat", kind: "skill", value: 8}];
  const npc = npcActor([], book);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true; sheet._npcEditMode = true;
  const submit = TrudvangActorSheet.DEFAULT_OPTIONS.form.handler;
  const updates = [];
  npc.update = async changes => { updates.push(changes); return npc; };
  await submit.call(sheet, {target: {name: "system.skillTree.0.value"}}, {},
    {object: {"system.skillTree.0.name": "Combat retouché", "system.skillTree.0.value": 9}});
  assert.equal(updates[0].system.skillTree["0"].name, "Combat retouché");
  assert.equal(updates[0].system.skillTree["0"].value, 9);
});

test("capacity picker ships a live name filter; knowledge picker ships cascading selects plus level", async () => {
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  const DialogClass = foundry.applications.api.DialogV2;
  const previous = DialogClass.wait;
  const captured = [];
  DialogClass.wait = async definition => { captured.push(definition); return null; };
  try {
    await sheet._openNpcCapacityPicker();
    await sheet._openNpcKnowledgePicker();
  } finally { DialogClass.wait = previous; }
  assert.equal(captured.length, 2);
  assert.match(captured[0].content, /name="capacityFilter"/);
  assert.match(captured[0].content, /Filtrer les capacités par nom/);
  assert.match(captured[0].content, /data-capacity-name/);
  assert.match(captured[1].content, /name="skillKey"/);
  assert.match(captured[1].content, /name="disciplineId"/);
  assert.match(captured[1].content, /name="specialtyId"/);
  assert.match(captured[1].content, /name="level"/);
  assert.match(captured[1].content, /data-parent-hint/);
  assert.doesNotMatch(captured[0].content + captured[1].content, /TRUDVANG\.[A-Za-z]/, "picker chrome uses localized strings");
});
