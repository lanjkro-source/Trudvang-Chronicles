import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {TRUDVANG} from "../modules/config.mjs";
import {npcBookSkillRows} from "../modules/rules/npc-summary.mjs";
import {COMBAT_POOL_IDS} from "../modules/rules/combat-pool-resolver.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";

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

function abilityItem(id, catalogId, kind, level, extra = {}) {
  const item = {id, type: "ability", name: catalogId, uuid: `Actor.npc.Item.${id}`,
    system: {catalogId, kind, parentSkill: "fighting", parentDiscipline: "", level, offHandLevel: 0, freeLevels: 0, rollBonus: kind === "specialty" ? 2 : 1, ...extra},
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

test("NPC catalogue +/- adjusts learned rows with the PC hierarchy gates and no XP cost", async () => {
  warnings.length = 0;
  const armed = abilityItem("d1", "armedFighting", "discipline", 1);
  const npc = npcActor([armed]);
  const before = structuredClone(npc.system.experience);
  await npc.adjustCatalogKnowledge("armedFighting", 1);
  assert.equal(armed.system.level, 2);
  assert.deepEqual(npc.system.experience, before, "no XP/adventure-point bookkeeping for NPC GM-fiat edits");
  await npc.adjustCatalogKnowledge("armedFighting", -1);
  assert.equal(armed.system.level, 1);
});

test("NPC specialty increase requires its parent discipline at level 1+", async () => {
  warnings.length = 0;
  const npc = npcActor([]);
  await npc.adjustCatalogKnowledge("wrestling", 1);
  assert.match(warnings.at(-1), /discipline parente|Parent discipline/i);
  assert.equal(npc.items.length, 0);
  const parent = abilityItem("p1", "unarmedFighting", "discipline", 1);
  npc.items.push(parent);
  await npc.adjustCatalogKnowledge("wrestling", 1);
  const created = npc.findKnowledgeItem("wrestling");
  assert.ok(created);
  assert.equal(created.system.level, 1);
  assert.equal(created.system.kind, "specialty");
});

test("NPC knowledge decrease to zero deletes the embedded item and leaves book rows untouched", async () => {
  warnings.length = 0;
  const book = [{name: "Combat", kind: "skill", value: 8},
    {name: "Combat armé", kind: "discipline", value: 2}];
  const bookBefore = structuredClone(book);
  const armed = abilityItem("d1", "armedFighting", "discipline", 1);
  const npc = npcActor([armed], book);
  await npc.adjustCatalogKnowledge("armedFighting", -1);
  assert.equal(armed.deleted, true);
  assert.deepEqual(npc.system.skillTree, bookBefore, "system.skillTree stays an importer-written reference");
  assert.deepEqual(npcBookSkillRows(npc.system.skillTree, {skills: TRUDVANG.skills,
    knowledgeTree: TRUDVANG.knowledgeTree, localize: game.i18n.localize}).map(row => row.catalogId),
  npcBookSkillRows(bookBefore, {skills: TRUDVANG.skills,
    knowledgeTree: TRUDVANG.knowledgeTree, localize: game.i18n.localize}).map(row => row.catalogId));
});

test("NPC knowledge picker cascades skill/discipline/specialty and enforces the parent gate", async () => {
  warnings.length = 0;
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  let createdAtLevel = null;
  sheet._createNpcKnowledgeAtLevel = async (catalogId, level) => { createdAtLevel = {catalogId, level}; return catalogId; };
  const DialogClass = foundry.applications.api.DialogV2;
  const previous = DialogClass.wait;
  // Capture the dialog definition and drive its Add callback with a fake root.
  let captured = null;
  DialogClass.wait = async definition => { captured = definition; return null; };
  try {
    await sheet._openNpcKnowledgePicker();
    assert.ok(captured, "cascading picker dialog is shown");
    assert.match(captured.content, /name="skillKey"/);
    assert.match(captured.content, /name="disciplineId"/);
    assert.match(captured.content, /name="specialtyId"/);
    assert.match(captured.content, /name="level"/);
    const add = captured.buttons.find(button => button.action === "add");
    const rootFor = values => ({querySelector: selector =>
      ({'[name="skillKey"]': {value: values.skillKey ?? "fighting"},
        '[name="disciplineId"]': {value: values.disciplineId ?? ""},
        '[name="specialtyId"]': {value: values.specialtyId ?? ""},
        '[name="level"]': {value: values.level ?? "1"}}[selector] ?? null)});
    // Specialty blocked without its parent discipline at level 1+.
    await add.callback({}, {form: rootFor({specialtyId: "wrestling", level: "2"})}, {element: rootFor({})});
    assert.match(warnings.at(-1), /discipline parente|Parent discipline/i);
    assert.equal(createdAtLevel, null);
    // Discipline creates at the picked level once selectable.
    await add.callback({}, {form: rootFor({disciplineId: "unarmedFighting", level: "3"})}, {element: rootFor({})});
    assert.deepEqual(createdAtLevel, {catalogId: "unarmedFighting", level: 3});
    // A bare skill selection sets the base skill value instead (1-10).
    createdAtLevel = null;
    await add.callback({}, {form: rootFor({skillKey: "fighting", level: "9"})}, {element: rootFor({})});
    assert.equal(createdAtLevel, null);
    assert.equal(npc.system.skills.fighting.value, 9);
  } finally { DialogClass.wait = previous; }
});

test("NPC _createNpcKnowledgeAtLevel reuses the knowledge-sheet path at the picked level", async () => {
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  let rendered = 0;
  npc.createEmbeddedDocuments = async (embedded, data) => {
    assert.equal(data[0].type, "ability");
    assert.equal(data[0].system.catalogId, "evade");
    assert.equal(data[0].system.level, 0);
    const doc = {...data[0], id: "ev0",
      sheet: {render: () => { rendered += 1; return doc; }},
      update: async changes => { for (const [path, value] of Object.entries(changes)) set(doc, path, value); return doc; }};
    npc.items.push(doc);
    return [doc];
  };
  await sheet._createNpcKnowledgeAtLevel("evade", 3);
  assert.equal(npc.findKnowledgeItem("evade").system.level, 3);
  assert.equal(rendered, 1);
});

test("NPC _openKnowledgeSheet-equivalent creates a level-0 catalogue-linked ability", async () => {
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  let rendered = 0;
  npc.createEmbeddedDocuments = async (embedded, data) => {
    assert.equal(data[0].type, "ability");
    assert.equal(data[0].system.catalogId, "evade");
    assert.equal(data[0].system.level, 0);
    const doc = {...data[0], id: "ev0", sheet: {render: () => { rendered += 1; }}};
    npc.items.push(doc);
    return [doc];
  };
  await sheet._openKnowledgeSheet("evade");
  assert.equal(rendered, 1);
});

test("NPC capacity add creates a catalogue-linked item and delete routes items vs legacy effects", async () => {
  warnings.length = 0;
  const npc = npcActor([]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  const firstId = Object.values(CREATURE_ABILITY_REFERENCES)[0].id;
  const created = [];
  npc.createEmbeddedDocuments = async (embedded, data) => {
    assert.equal(embedded, "Item");
    created.push(...data);
    return data.map((entry, index) => ({...entry, id: `cap${index}`}));
  };
  const DialogClass = foundry.applications.api.DialogV2;
  const previous = DialogClass.wait;
  DialogClass.wait = async ({buttons}) => buttons.find(button => button.action === "add")
    .callback({}, {form: null}, {element: {querySelector: () => ({value: firstId})}});
  try {
    await sheet._openNpcCapacityPicker();
  } finally { DialogClass.wait = previous; }
  assert.equal(created.length, 1);
  assert.equal(created[0].type, "creatureAbility");
  assert.equal(created[0].system.catalogId, firstId);

  const registry = new Map();
  const itemDoc = {documentName: "Item", uuid: "Item.cap", deleted: false, delete: async function () { this.deleted = true; return this; }};
  const legacy = {documentName: "ActiveEffect", uuid: "Effect.legacy", deleted: false, delete: async function () { this.deleted = true; return this; }};
  registry.set("Item.cap", itemDoc);
  registry.set("Effect.legacy", legacy);
  globalThis.__uuidRegistry = registry;
  const action = TrudvangActorSheet.DEFAULT_OPTIONS.actions["capacity-delete"];
  const targetFor = uuid => ({dataset: {action: "capacity-delete", effectUuid: uuid}, closest: () => null});
  await action.call(sheet, {preventDefault() {}, stopPropagation() {}}, targetFor("Item.cap"));
  assert.equal(itemDoc.deleted, true);
  await action.call(sheet, {preventDefault() {}, stopPropagation() {}}, targetFor("Effect.legacy"));
  assert.equal(legacy.deleted, true);
  delete globalThis.__uuidRegistry;
});

for (const name of ["eq", "and", "or", "not", "concat", "checked", "editor", "selectOptions", "localize", "signed"]) {
  Handlebars.registerHelper(name, (...args) => {
    const options = args.pop();
    if (name === "eq") return args[0] === args[1];
    if (name === "and") return args.every(Boolean);
    if (name === "or") return args.some(Boolean);
    if (name === "not") return !args[0];
    if (name === "concat") return args.join("");
    if (name === "checked") return args[0] ? "checked" : "";
    if (name === "localize") return game.i18n.format(args[0], options.hash);
    if (name === "signed") return Number(args[0]) > 0 ? `+${Number(args[0])}` : `${Number(args[0])}`;
    return "";
  });
}

test("NPC sheet renders +/- and delete only on learned embedded rows, never on book rows", async () => {
  const book = [{name: "Combat", kind: "skill", value: 8},
    {name: "Combat armé", kind: "discipline", value: 2}];
  const armed = abilityItem("d1", "armedFighting", "discipline", 2);
  armed.img = "icons/svg/book.svg";
  const npc = npcActor([armed], book);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true; sheet._npcEditMode = true;
  const context = await sheet._prepareContext({});
  context.editable = true;
  context.npcEditMode = true;
  const render = Handlebars.compile(readFileSync(new URL("../templates/actor/npc-sheet.hbs", import.meta.url), "utf8"));
  const html = render(context);
  const bookBlock = html.split("npc-book-skills")[1].split("npc-knowledge-tree")[0];
  assert.doesNotMatch(bookBlock, /adjust-catalog-knowledge|item-delete/);
  const learnedBlock = html.split("npc-knowledge-tree")[1].split("npc-abilities-panel")[0];
  assert.match(learnedBlock, /data-action="adjust-catalog-knowledge" data-catalog-id="armedFighting" data-direction="-1"/);
  assert.match(learnedBlock, /data-action="adjust-catalog-knowledge" data-catalog-id="armedFighting" data-direction="1"/);
  assert.match(learnedBlock, /data-action="item-delete"/);
  assert.match(html, /data-action="add-npc-knowledge"/);
  assert.match(html, /data-action="add-npc-capacity"/);
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
});
