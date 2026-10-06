import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {ignoresWoundPenalties, npcCombatMovementModes, npcCurrentTrait, npcHealthRange, npcMovementRows, npcSkillTrees, npcTraitEdit} from "../modules/rules/npc-summary.mjs";
import {CREATURE_NPC_DATA} from "../modules/creature-feats.mjs";
import {COMBAT_POOL_IDS, normalizeCombatAllocation, resolveCombatPools, suggestCombatAllocation} from "../modules/rules/combat-pool-resolver.mjs";
import {TRUDVANG} from "../modules/config.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";
import {creatureAbilityDetails} from "../modules/creature-ability.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";

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
    async _preCreate() { return this.creationAllowed; }
    async getTokenDocument(data, options) { return {data, options}; }
  }, ActiveEffect: class {}},
  applications: {
    api: {HandlebarsApplicationMixin: Base => Base,
      DocumentSheetV2: class {
        constructor({document}) { this.document = document; this.isEditable = document.isOwner; }
        async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
        render(options) { this.renderOptions = options; return this; }
      }},
    sheets: {ActorSheetV2: class { async _prepareContext() { return {}; } async _onRender() {} }, ItemSheetV2: class {
      constructor({document} = {}) { this.document = document; this.item = document; }
      async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
    }},
    ux: {TextEditor: {implementation: {enrichHTML: async value => value}}},
    handlebars: {renderTemplate: async () => ""}
  },
  utils: {getProperty: get, setProperty: set, hasProperty: (object, path) => get(object, path) !== undefined,
    expandObject: flat => { const output = {}; for (const [key, value] of Object.entries(flat)) set(output, key, value); return output; }}
};
const fr = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
globalThis.game = {user: {isGM: true}, combat: null, i18n: {
  lang: "fr", localize: key => get(fr, key) ?? key,
  format: (key, data) => String(get(fr, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
}};
const {NpcData, CharacterData, AbilityData} = await import("../modules/data-models.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActorSheet, TrudvangNpcSheet} = await import("../modules/sheets/actor-sheet.mjs");
const {TrudvangItemSheet} = await import("../modules/sheets/item-sheet.mjs");
const feat = (enabled = true, level = 1) => ({type: "ability", name: "Tenace",
  system: {kind: "feat", ignoreWoundPenalties: enabled, level}});
const knowledge = (kind, level, name, extra = {}) => ({level, item: {id: name, name, type: "ability",
  system: {kind, level, ...extra}}, specialties: []});
const tree = (level, disciplines = [], unassigned = []) => ({key: "fighting", level, disciplines, unassigned});

function actor(items = [], {fighting = 8} = {}) {
  const traits = Object.fromEntries(Object.keys(TRUDVANG.traits).map(key => [key, 0]));
  traits.constitution = 2;
  const skills = Object.fromEntries(Object.keys(TRUDVANG.skills).map(key => [key, {value: 1, bonus: 0}]));
  skills.fighting.value = fighting;
  const instance = new TrudvangActor();
  Object.assign(instance, {type: "npc", name: "Test creature", id: "npc", img: "", items, statuses: new Set(),
    system: {traits, traitCurrent: {constitution: null}, skills,
      effective: {traits: {...traits}, skills: Object.fromEntries(Object.entries(skills).map(([key, skill]) => [key, skill.value]))},
      resources: {body: {value: 10, max: 40}, combat: {value: 20, max: 20}, fear: {value: 0, max: 50},
        vitner: {value: 0, max: 0}, divinity: {value: 0, max: 0}},
      combatPools: Object.fromEntries(COMBAT_POOL_IDS.map(id => [id, {spent: -1}])),
      movement: {base: 10}, initiative: {base: 3}, modifiers: {rolls: {}}, details: {naturalArmor: 4}, survivalRounds: -1},
    calculateBuildCost: () => 0, calculateCreationCosts: () => ({}), getKnowledgeLevelCost: () => 0,
    canChooseCatalogKnowledge: () => true, allApplicableEffects: () => []});
  instance._source = {system: structuredClone(instance.system)};
  instance.prepareDerivedData();
  return instance;
}

test("NPC current traits follow intrinsic traits by default, but accept zero and negatives", () => {
  assert.equal(npcCurrentTrait({traits: {strength: 4}}, "strength"), 4);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: null}}, "strength"), 4);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: 0}}, "strength"), 0);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: -8}}, "strength"), -8);
});

test("NPC creation initializes its prototype dimensions and generated tokens follow the current size", async () => {
  const npc = actor(); npc.system.details.size = "5t";
  const updates = [];
  npc.updateSource = data => updates.push(data);
  await npc._preCreate({}, {}, {id: "gm"});
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false, "prototypeToken.width": 4, "prototypeToken.height": 4}]);
  const options = {parent: {id: "isolated-scene"}};
  const data = {x: 20, y: 40, actorLink: false, texture: {src: "token.webp"}};
  assert.deepEqual(await npc.getTokenDocument(data, options), {data: {...data, width: 4, height: 4}, options});
  assert.deepEqual(data, {x: 20, y: 40, actorLink: false, texture: {src: "token.webp"}}, "caller data is not mutated");
  npc.system.details.size = "1/2";
  assert.deepEqual((await npc.getTokenDocument()).data, {actorLink: false, width: 1, height: 1});
  assert.deepEqual((await npc.getTokenDocument({width: 2, height: 1})).data, {actorLink: false, width: 2, height: 1}, "explicit sizing overrides the automatic default");
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false, "prototypeToken.width": 4, "prototypeToken.height": 4}], "generating a token never rewrites the actor or existing scene tokens");
  const delta = {items: [{_id: "axe", system: {quantity: 2}}]};
  assert.deepEqual((await npc.getTokenDocument({actorLink: true, delta})).data, {actorLink: true, width: 1, height: 1, delta}, "explicit linking and per-token inventory overrides remain available");
});

test("token auto-sizing leaves PCs, unknown sizes and cancelled actor creations alone", async () => {
  const instance = actor();
  const updates = [];
  instance.updateSource = data => updates.push(data);
  instance.system.details.size = "3t";
  instance.type = "character";
  await instance._preCreate({}, {}, {});
  assert.deepEqual((await instance.getTokenDocument({x: 12})).data, {x: 12});
  instance.type = "npc"; instance.system.details.size = "unknown";
  await instance._preCreate({}, {}, {});
  assert.deepEqual((await instance.getTokenDocument({width: 2})).data, {actorLink: false, width: 2});
  instance.system.details.size = "10+"; instance.creationAllowed = false;
  assert.equal(await instance._preCreate({}, {}, {}), false);
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false}]);
});

test("the NPC schema preserves intrinsic traits and prepares current traits before effects", () => {
  const schema = NpcData.defineSchema();
  for (const field of Object.values(schema.traitCurrent.fields)) {
    assert.equal(field.options.initial, null);
    assert.equal(field.options.nullable, true);
    assert.equal(field.options.integer, true);
    assert.equal(field.options.min, undefined);
  }
  const model = {traits: {strength: 4, psyche: 2}, traitCurrent: {strength: -1},
    effective: {traits: {strength: 0, psyche: 0}, skills: {}}, resources: {}};
  NpcData.prototype.prepareBaseData.call(model);
  assert.deepEqual(model.effective.traits, {strength: -1, psyche: 2});
  assert.equal(model.traits.strength, 4);
  assert.equal(CharacterData.defineSchema().traitCurrent, undefined);
  assert.equal(AbilityData.defineSchema().ignoreWoundPenalties.options.initial, false);
  assert.equal(schema.details.fields.bodyMin.options.initial, 0);
  assert.equal(schema.details.fields.bodyMax.options.initial, 0);
});

test("NPC health bounds do not shrink when the played maximum changes", () => {
  const npc = actor();
  npc.system.details.bodyMin = 21;
  npc.system.details.bodyMax = 26;
  npc._source.system.resources.body.max = 23;
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 26, valid: true});
  npc._source.system.resources.body.max = 21;
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 26, valid: true});
  npc.system.details.bodyMax = 19;
  assert.equal(npcHealthRange(npc).valid, false);
  npc.system.details = {};
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 21, valid: true});
});

test("all starter NPCs retain both book bounds independently of their initial BP", () => {
  const content = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
  for (const entry of content.actors) {
    const reference = CREATURE_NPC_DATA[entry.nameKey.replace(/\.Name$/, "")];
    assert.equal(entry.system.details.bodyMin, reference.bodyMin);
    assert.equal(entry.system.details.bodyMax, reference.bodyMax);
    assert.ok(entry.system.resources.body.max >= reference.bodyMin);
    assert.ok(entry.system.resources.body.max <= reference.bodyMax);
  }
});

test("NPC movement displays every recorded mode, including fractional or conditional distances", () => {
  const rows = npcMovementRows({details: {move: [
    {mode: "terrestre", distance: "1,5 m", max: "15 m ou 13 m avec armure"},
    {mode: "vol", distance: "3 m", max: "30 m"},
    {mode: "nage", distance: "0,75 m", max: "8 m"}
  ]}}, {localize: game.i18n.localize});
  assert.deepEqual(rows, [
    {mode: "Terrestre", distance: "1,5 m", max: "15 m ou 13 m avec armure"},
    {mode: "Vol", distance: "3 m", max: "30 m"},
    {mode: "Nage", distance: "0,75 m", max: "8 m"}
  ]);
  assert.deepEqual(npcMovementRows({details: {}, movement: {current: 12}}, {localize: game.i18n.localize}),
    [{mode: "Terrestre", distance: "—", max: "12 m"}]);
});

test("the health dice action rolls inclusive bounds, fills health and preserves the reference range", async t => {
  const previous = {document: globalThis.document, Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage};
  t.after(() => Object.assign(globalThis, previous));
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const totals = [21, 26];
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; }
    async evaluate() { this.total = totals.shift(); }
  };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => messages.push(data)};
  const npc = actor(); npc.isOwner = true;
  npc.system.details.bodyMin = 21;
  npc.system.details.bodyMax = 26;
  npc.system.modifiers.bodyMax = 3;
  npc.system.modifiers.bodyValue = 1;
  const updates = [];
  npc.update = async data => {
    updates.push(data);
    for (const [path, value] of Object.entries(data)) set(npc._source, path, value);
  };
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const action = TrudvangActorSheet.DEFAULT_OPTIONS.actions["roll-npc-health"];
  for (const health of [21, 26]) {
    const result = await action.call(sheet, {preventDefault() {}, stopPropagation() {}},
      {dataset: {action: "roll-npc-health"}, closest: () => null});
    assert.equal(result.roll.formula, "1d6 + 20");
    assert.equal(result.health, health);
    assert.equal(updates.at(-1)["system.resources.body.max"], health);
    assert.equal(updates.at(-1)["system.resources.body.value"], health + 2, "prepared current PS equals prepared maximum after effects");
    assert.equal(updates.at(-1)["system.details.bodyMax"], 26);
    assert.equal(updates.at(-1)["system.survivalRounds"], -1);
  }
  assert.equal(messages.length, 2);
  assert.ok(messages[0].content.includes("21 PS"));
  assert.equal(messages[0].rolls[0].formula, "1d6 + 20");
  npc.isOwner = false;
  assert.equal(await npc.rollNpcHealth(), null);
  npc.isOwner = true; npc.type = "character";
  assert.equal(await npc.rollNpcHealth(), null);
  assert.equal(updates.length, 2);
});

test("editing an effective trait removes its temporary effect without changing the reference", () => {
  const source = {traits: {strength: 4}, traitCurrent: {strength: 1}};
  assert.equal(npcTraitEdit({_source: {system: source}, getTraitValue: () => 3}, "strength", -2), -4);
  assert.equal(source.traits.strength, 4);
});

test("unrelated form submissions do not persist effect bonuses or break the intrinsic fallback", async () => {
  const npc = actor();
  npc.system.effective.traits.constitution = 5;
  const changes = [];
  npc.update = async update => changes.push(update);
  const submit = TrudvangActorSheet.DEFAULT_OPTIONS.form.handler;
  const values = {"system.traitCurrent.constitution": 5};
  await submit.call({actor: npc}, {target: {name: "name"}}, {}, {object: values});
  assert.equal(changes.at(-1).system.traitCurrent.constitution, null);
  await submit.call({actor: npc}, {target: {name: "system.traitCurrent.constitution"}}, {}, {object: values});
  assert.equal(changes.at(-1).system.traitCurrent.constitution, 2);
});

test("Durable requires an explicit active feat mechanic, never a translated name", () => {
  assert.equal(ignoresWoundPenalties({items: [feat()]}), true);
  assert.equal(ignoresWoundPenalties({items: [feat(false)]}), false);
  assert.equal(ignoresWoundPenalties({items: [feat(true, 0)]}), false);
  const other = feat(); other.system.kind = "specialty";
  assert.equal(ignoresWoundPenalties({items: [other]}), false);
  const renamed = feat(); renamed.name = "Anything";
  assert.equal(ignoresWoundPenalties({items: [renamed]}), true);
});

test("Durable cancels wound penalties without changing damage, health or the dying state", () => {
  const ordinary = actor();
  const durable = actor([feat()]);
  assert.equal(ordinary.system.damage.penalty, -3);
  assert.equal(durable.system.damage.penalty, 0);
  assert.equal(durable.system.damage.taken, 30);
  assert.equal(durable.system.damage.level, ordinary.system.damage.level);
  assert.equal(durable.system.initiative.current, ordinary.system.initiative.current + 3);
  durable.system.resources.body.value = -12;
  durable.prepareDerivedData();
  assert.equal(durable.system.resources.body.current, -12);
  assert.equal(durable.system.damage.level, "dying");
  assert.equal(durable.system.damage.penalty, 0);
});

test("NPC skills show only skills above 1 and positive disciplines and specialties", () => {
  const discipline = knowledge("discipline", 2, "Armed combat");
  discipline.specialties = [knowledge("specialty", 0, "Unknown"), knowledge("specialty", 3, "Known")];
  const input = [tree(1), tree(8, [knowledge("discipline", 0, "Unknown"), discipline])];
  const result = npcSkillTrees(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].visible, true);
  assert.equal(result[0].disciplines.length, 1);
  assert.equal(result[0].disciplines[0].specialties.length, 1);
  assert.equal(discipline.specialties.length, 2, "filter must not mutate the source tree");
});

test("learned children remain visible even if their ancestor is unlearned", () => {
  const parent = knowledge("discipline", 0, "Parent");
  parent.specialties = [knowledge("specialty", 1, "Child")];
  const [result] = npcSkillTrees([tree(1, [parent])]);
  assert.equal(result.visible, false);
  assert.equal(result.disciplines[0].visible, false);
  assert.equal(result.disciplines[0].specialties.length, 1);
});

test("custom knowledge retains hierarchy and off-hand levels; creature feats are excluded", () => {
  const custom = [knowledge("discipline", 0, "Parent"),
    knowledge("specialty", 0, "Off-hand", {parentDiscipline: "Parent", offHandLevel: 3}),
    knowledge("feat", 1, "Durable"), knowledge("specialty", 2, "Orphan")];
  const [result] = npcSkillTrees([tree(1, [], custom)]);
  assert.equal(result.disciplines[0].visible, false);
  assert.equal(result.disciplines[0].specialties[0].offHandLevel, 3);
  assert.equal(result.disciplines[0].specialties[0].separateHands, true);
  assert.deepEqual(result.unassigned.map(node => node.item.name), ["Orphan"]);
});

test("NPC catalogue ability levels stay editable independently of character advancement", () => {
  const sheet = new TrudvangItemSheet();
  sheet.item = {type: "ability", system: {catalogId: "fighter", level: 3}, parent: {type: "npc"}};
  assert.equal(sheet.advancementLocked, false);
  assert.equal(sheet.levelManaged, false);
  sheet.item.parent = {type: "character", system: {experience: {creationMode: false}}};
  assert.equal(sheet.advancementLocked, true);
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
const render = Handlebars.compile(readFileSync(new URL("../templates/actor/npc-sheet.hbs", import.meta.url), "utf8"));

test("the real NPC sheet context and template render natural armor without integrity", async () => {
  const npc = actor([feat()]);
  const sheet = new TrudvangNpcSheet();
  sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.armorStatus.protection, 4);
  assert.equal(context.armorStatus.hasIntegrity, false);
  assert.equal(context.armorStatus.integrityCurrent, 0);
  assert.equal(context.npcSkillTrees.length, 1);
  const html = render(context);
  assert.match(html, /dont 4 VP naturels/);
  assert.match(html, /Intégrité.*—/);
  assert.match(html, /Tenace : aucun malus de blessures/);
  assert.doesNotMatch(html, /−3 aux VC/);
  assert.equal((html.match(/name="system\.traitCurrent\./g) || []).length, 7, "each current trait has its compact input");
  assert.ok(html.indexOf("npc-health-panel") < html.indexOf("npc-stats-grid"));
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
});

test("the NPC header has only health and read-only movement, and compact traits can be edited", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  sheet.actor.system.details.move = [{mode: "terrestre", distance: "3 m", max: "24 m"}, {mode: "nage", distance: "3 m", max: "24 m"}];
  const html = render(await sheet._prepareContext({}));
  const header = html.split('<nav class="sheet-tabs')[0];
  assert.doesNotMatch(header, /resources\.combat|reset-combat|Resource\.Protection|name="system\.movement/);
  assert.match(header, /data-action="roll-npc-health"/);
  assert.match(header, /Terrestre/);
  assert.match(header, /Nage/);
  assert.equal((header.match(/3 m \/ 24 m/g) || []).length, 2);
  assert.match(header, /Terrestre : <strong>3 m \/ 24 m<\/strong>/);
  assert.match(header, /Nage : <strong>3 m \/ 24 m<\/strong>/);
  assert.equal((header.match(/class="npc-movement-separator"/g) || []).length, 1);
  const fields = html.match(/<input class="npc-trait-current[^>]+>/g);
  assert.equal(fields.length, 7);
  for (const field of fields) assert.doesNotMatch(field, /readonly|min=|max=/);
});

test("a single NPC movement mode has no separator and keeps its conditional distances", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  sheet.actor.system.details.move = [{mode: "vol", distance: "4 m", max: "24 m ou 18 m avec armure"}];
  const html = render(await sheet._prepareContext({})).split('<nav class="sheet-tabs')[0];
  assert.match(html, /Vol : <strong>4 m \/ 24 m ou 18 m avec armure<\/strong>/);
  assert.doesNotMatch(html, /npc-movement-separator/);
});

test("NPC combat movement parses the book's per-2-CP rate, including fractional metres", () => {
  assert.deepEqual(npcCombatMovementModes({details: {move: [
    {mode: "vol", distance: "4 m", max: "32 m"},
    {mode: "nage", distance: "1,5 m", max: "12 m"},
    {mode: "spécial", distance: "—", max: "10 m"}
  ]}}), [
    {id: "0", mode: "vol", metersPerTwo: 4},
    {id: "1", mode: "nage", metersPerTwo: 1.5}
  ]);
});

function inventoryItem(type, id, extra = {}) {
  return {type, id, name: id, uuid: `Actor.npc.Item.${id}`, img: "icons/svg/sword.svg",
    system: {quantity: 1, weight: 1, equipped: false, damage: "1d10", openRoll: 10, combatSpecialty: "oneHandedLightWeapons",
      breach: {value: 20, max: 20}, heft: 2, ...extra}};
}

test("the NPC equipment tab displays only material equipment and its editable controls", async () => {
  const items = [inventoryItem("weapon", "Axe"), inventoryItem("armor", "Leather"), inventoryItem("shield", "Shield"),
    {id: "rope", name: "Rope", type: "gear", system: {}}, inventoryItem("weapon", "Bite", {combatSpecialty: "natural"}), feat()];
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(items); sheet.isEditable = true;
  const context = await sheet._prepareContext({});
  const inventory = render(context).split('<div class="tab equipment')[1].split('<div class="tab actions')[0];
  for (const name of ["Axe", "Leather", "Shield", "rope"]) assert.match(inventory, new RegExp(`data-item-id="${name}"`));
  assert.doesNotMatch(inventory, /Bite|Tenace|item-parry|item-damage/);
  assert.equal((inventory.match(/data-item-field="quantity"/g) || []).length, 4);
  assert.equal((inventory.match(/data-action="item-ready"/g) || []).length, 2);
  assert.equal((inventory.match(/data-action="item-equip"/g) || []).length, 2);
  assert.equal((inventory.match(/data-action="inspect-item"/g) || []).length, 4);
  assert.match(inventory, /Inventaire par défaut/);
  assert.ok(context.npcCombatItems.every(row => ["weapon", "shield"].includes(row.item.type)));
  assert.doesNotMatch(inventory, /TRUDVANG\./);
});

test("NPC token inventories have a local hint and no mutable controls for read-only viewers", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([inventoryItem("weapon", "Axe")]); sheet.actor.isToken = true; sheet.isEditable = false;
  const inventory = render(await sheet._prepareContext({})).split('<div class="tab equipment')[1].split('<div class="tab actions')[0];
  assert.match(inventory, /Inventaire de cet exemplaire/);
  assert.doesNotMatch(inventory, /data-action="item-create"/);
  for (const tag of inventory.match(/<(?:input|button)[^>]+(?:data-item-field="quantity"|data-action="item-(?:delete|ready|equip)")[^>]*>/g)) assert.match(tag, /disabled/);
  assert.match(inventory, /data-action="item-edit"/);
  assert.match(inventory, /data-action="inspect-item"/);
});

test("empty creature inventories are usable and show three properly localized empty states", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  const inventory = render(await sheet._prepareContext({})).split('<div class="tab equipment')[1].split('<div class="tab actions')[0];
  assert.match(inventory, /Aucune arme dans l’inventaire/);
  assert.match(inventory, /Aucune armure ni aucun bouclier/);
  assert.match(inventory, /Aucun autre équipement/);
  assert.equal((inventory.match(/data-action="item-create"/g) || []).length, 5);
});

test("inventory drops clone external equipment with fresh IDs and reject other item types", async t => {
  const previous = {ui: globalThis.ui, deepClone: foundry.utils.deepClone};
  t.after(() => { globalThis.ui = previous.ui; foundry.utils.deepClone = previous.deepClone; });
  foundry.utils.deepClone = structuredClone;
  const warnings = []; globalThis.ui = {notifications: {warn: text => warnings.push(text)}};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor();
  const created = []; sheet.actor.createEmbeddedDocuments = async (type, data) => { assert.equal(type, "Item"); created.push(...data); return data; };
  const source = {_id: "external", ...inventoryItem("weapon", "External axe")};
  await sheet._handleDrop(source, {equipmentOnly: true});
  assert.equal(created[0]._id, undefined);
  created[0].system.quantity = 4;
  assert.equal(source.system.quantity, 1);
  assert.equal(source._id, "external");
  await sheet._handleDrop({type: "gear", system: {}}, {equipmentOnly: true});
  await sheet._handleDrop({type: "potion", system: {}}, {equipmentOnly: true});
  assert.equal(created.length, 3);
  await sheet._handleDrop({type: "ability", system: {}}, {equipmentOnly: true});
  assert.match(warnings[0], /équipement/);
  await sheet._handleDrop({type: "ability", system: {level: 2}});
  assert.equal(created.length, 4, "abilities can still be added elsewhere on the NPC sheet");
});

test("an item with the same ID from another token is copied, not mistaken for an internal sort", async t => {
  const previous = foundry.utils.deepClone; t.after(() => { foundry.utils.deepClone = previous; }); foundry.utils.deepClone = structuredClone;
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.actor.uuid = "Scene.test.Token.first.Actor.npc"; sheet._activeTab = "equipment";
  sheet.actor.items.has = () => true;
  sheet._onSortItem = async () => { throw new Error("Must not sort a different token's item"); };
  const created = []; sheet.actor.createEmbeddedDocuments = async (type, data) => created.push(...data);
  const data = {_id: "sameId", ...inventoryItem("weapon", "Axe")};
  const external = {documentName: "Item", id: "sameId", parent: {uuid: "Scene.test.Token.second.Actor.npc"}, toObject: () => data};
  await sheet._onDropItem({}, external);
  assert.equal(created.length, 1);
  let sorted = false; sheet._onSortItem = async () => { sorted = true; };
  await sheet._onDropItem({}, {...external, parent: sheet.actor});
  assert.equal(sorted, true);
  assert.equal(created.length, 1);
});

test("equipment quantity and equip actions update only the actor on the token sheet", async () => {
  const prototypeItem = inventoryItem("armor", "Leather");
  const localItem = structuredClone(prototypeItem);
  localItem.update = async changes => { for (const [key, value] of Object.entries(changes)) set(localItem, key, value); };
  const npc = actor([localItem]); npc.isToken = true; npc.items.get = id => npc.items.find(item => item.id === id);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const input = {value: "3", dataset: {itemField: "quantity"}, closest: () => ({dataset: {itemId: "Leather"}}), addEventListener(type, listener) { this.listener = listener; }};
  sheet.element = {querySelectorAll: selector => selector === "input[data-item-field]" ? [input] : []};
  sheet._activateTabs = () => {}; sheet._restoreViewState = () => {}; sheet._captureViewState = () => {};
  await sheet._onRender({}, {});
  await input.listener({currentTarget: input});
  const target = {dataset: {action: "item-equip"}, closest: selector => selector === "[data-item-id]" ? {dataset: {itemId: "Leather"}} : null};
  await TrudvangActorSheet.DEFAULT_OPTIONS.actions["item-equip"].call(sheet, {preventDefault() {}, stopPropagation() {}}, target);
  assert.equal(localItem.system.quantity, 3);
  assert.equal(localItem.system.equipped, true);
  assert.equal(prototypeItem.system.quantity, 1);
  assert.equal(prototypeItem.system.equipped, false);
});

test("NPC pools are calculated from book levels, effects and embedded overrides rather than a preset maximum", () => {
  const npc = actor([], {fighting: 1});
  npc.system.skillTree = [{name: "Combat", kind: "skill", value: 10},
    {name: "Combat armé", kind: "discipline", value: 3},
    {name: "Armes lourdes à une main", kind: "specialty", value: 4},
    {name: "Expérience du combat", kind: "discipline", value: 1},
    {name: "Combattant", kind: "specialty", value: 2}];
  npc.system.effective.skills.fighting = 3; // +2 effect on the stored skill of 1.
  npc.system.modifiers.combatMax = 2;
  let pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.free.max, 15); // Book 10, effect 2, experience 1, CP modifier 2.
  assert.equal(pools.armedFighting.max, 3);
  assert.equal(pools.oneHandedHeavyWeapons.max, 8);
  assert.equal(pools.attacksParries.max, 4);
  assert.equal(pools.oneHandedHeavyWeaponsOffHand.max, 0);
  npc.items.push({type: "ability", name: "Modified expertise", system: {catalogId: "armedFighting", level: 5}});
  pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.armedFighting.max, 5, "an actual embedded item takes precedence over a book row");
  assert.equal(npc.items.length, 1, "rule resolution never creates ability items");
});

test("book knowledge identifiers work independently of translated row names", () => {
  const npc = actor([], {fighting: 1});
  npc.system.skillTree = [{name: "Fighting", kind: "skill", value: 9, skillId: "fighting"},
    {name: "Armed Fighting", kind: "discipline", value: 2, catalogId: "armedFighting"},
    {name: "Two-handed Weapons", kind: "specialty", value: 3, catalogId: "twoHandedWeapons"}];
  const pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.free.max, 9); assert.equal(pools.armedFighting.max, 2); assert.equal(pools.twoHandedWeapons.max, 6);
  const item = inventoryItem("weapon", "Club", {combatSpecialty: "twoHandedWeapons", weaponActions: 2});
  assert.equal(npc.getWeaponActionState(item).max, 3, "book specialty also modifies the weapon's AA");
});

function naturalItem(id, pool, max) {
  return inventoryItem("weapon", id, {combatSpecialty: "natural", category: "natural", equipped: true,
    weaponActions: 4, naturalCombatPool: pool, naturalCombatPoints: max, naturalCombatPointsSpent: 0});
}

function spendableNpc(items) {
  const npc = actor(items); npc.isOwner = true; npc.uuid = "Actor.test";
  npc._source.system.combatPools.free = {spent: 0, weaponSpent: 4, offHandSpent: 0};
  npc.system.combatPools.free = {...npc._source.system.combatPools.free};
  npc.prepareDerivedData();
  npc.update = async changes => {
    for (const [key, value] of Object.entries(changes)) { set(npc, key, value); set(npc._source, key, value); }
  };
  npc.updateEmbeddedDocuments = async (type, updates) => {
    assert.equal(type, "Item");
    for (const {_id, ...changes} of updates) for (const [key, value] of Object.entries(changes)) set(npc.items.find(item => item.id === _id), key, value);
  };
  return npc;
}

test("natural pools are contextual, shared once, and use the lower remaining Free CP hand", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const horns = naturalItem("Horns", "natural", 8), fists = naturalItem("Fists", "natural", 8), bite = naturalItem("Bite", "bite", 6);
  const npc = spendableNpc([horns, fists, bite]); game.combat = {started: true, combatants: [{actor: npc}]};
  const resolution = resolveCombatPools({actor: npc, item: horns, context: {action: "attack"}});
  assert.equal(resolution.totalMax, 22); // 8 Free, one shared 8, separate bite 6.
  assert.equal(resolution.freeScope, "both");
  assert.equal(resolution.eligibleCurrent, 12); // min(4,8) + shared natural 8.
  assert.equal(resolution.eligible.some(pool => pool.id === "natural:bite"), false);
  assert.equal(resolveCombatPools({actor: npc, context: {action: "other"}}).eligibleCurrent, 4);
  assert.equal(resolveCombatPools({actor: npc, context: {action: "movement"}}).eligibleCurrent, 4);
  const suggested = suggestCombatAllocation(resolution.eligible, 10);
  assert.deepEqual(suggested, {"natural:natural": 8, free: 2});
  assert.deepEqual(normalizeCombatAllocation(resolution.eligible, suggested).allocation, normalizeCombatAllocation(resolution.eligible, {free: 2, "natural:natural": 8}).allocation);
  await npc.spendCombatPoints(suggested, {freeScope: resolution.freeScope});
  assert.equal(horns.system.naturalCombatPointsSpent, 8); assert.equal(fists.system.naturalCombatPointsSpent, 8);
  assert.equal(bite.system.naturalCombatPointsSpent, 0);
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 2);
  assert.equal(resolveCombatPools({actor: npc, item: fists, context: {action: "parry"}}).eligibleCurrent, 2);
  await npc.resetCombatPoints();
  assert.equal(horns.system.naturalCombatPointsSpent, 0); assert.equal(fists.system.naturalCombatPointsSpent, 0);
  assert.equal(resolveCombatPools({actor: npc, item: horns, context: {action: "attack"}}).eligibleCurrent, 16);
});

test("NPC weapon spends only its hand, generic actions spend both, and outside combat nothing is spent", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const axe = inventoryItem("weapon", "Axe", {combatSpecialty: "oneHandedLightWeapons", hand: "offHand"});
  const npc = spendableNpc([axe]); game.combat = {started: true, combatants: [{actor: npc}]};
  const scope = resolveCombatPools({actor: npc, item: axe, context: {action: "attack"}}).freeScope;
  await npc.spendCombatPoints({free: 3}, {freeScope: scope});
  assert.equal(npc.system.combatPools.free.weaponSpent, 4); assert.equal(npc.system.combatPools.free.offHandSpent, 3);
  await npc.spendCombatPoints({free: 2});
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 5);
  game.combat = null;
  await npc.spendCombatPoints({free: 2});
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 5);
});

test("NPC movement spends both Free hands and uses the selected bestiary movement mode", async t => {
  const previous = {combat: game.combat, ui: globalThis.ui, document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.ui = previous.ui; globalThis.document = previous.document;
    foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const notices = [];
  globalThis.ui = {notifications: {info: message => notices.push(message), warn: message => assert.fail(message)}};
  let dialog;
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialog = options;
    return {allocation: {free: 4}, movementMode: "1"};
  }};
  const npc = spendableNpc([]);
  npc.system.details.move = [{mode: "terrestre", distance: "2 m", max: "16 m"},
    {mode: "vol", distance: "4 m", max: "32 m"}];
  game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollCombatMovement();
  assert.match(dialog.content, /Terrestre : 2 m pour 2 PC/);
  assert.match(dialog.content, /Vol : 4 m pour 2 PC/);
  assert.equal(result.paidMeters, 8);
  assert.equal(npc.system.combatPools.free.weaponSpent, 8);
  assert.equal(npc.system.combatPools.free.offHandSpent, 4);
  assert.match(notices[0], /8 mètre/);
});

test("a wrestling roll ignores Combat Actions and never spends an odd total", async t => {
  const previous = {combat: game.combat, ui: globalThis.ui, document: globalThis.document,
    Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.ui = previous.ui; globalThis.document = previous.document;
    globalThis.Roll = previous.Roll; globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.ui = {notifications: {warn: message => assert.fail(message)}};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = 1; } };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor: source}) => ({actor: source.id}),
    create: async data => { messages.push(data); return data; }};
  let dialog;
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialog = options;
    return {allocation: {free: 3, unarmedFighting: 1, wrestling: 1, combatActions: 2}, modifier: 0};
  }};
  const npc = spendableNpc([
    {type: "ability", name: "Combat à mains nues", system: {catalogId: "unarmedFighting", kind: "discipline", level: 1}},
    {type: "ability", name: "Lutte", system: {catalogId: "wrestling", kind: "specialty", level: 1}},
    {type: "ability", name: "Actions de combat", system: {catalogId: "combatActions", kind: "specialty", level: 1}}
  ]);
  game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollWrestlingAction("grapple");
  assert.doesNotMatch(dialog.content, /data-pool-id="combatActions"/);
  assert.match(dialog.content, /data-combat-slider min="0" max="[0-9]+" step="2"/);
  assert.equal(result.target, 2);
  assert.equal(npc.system.combatPools.free.weaponSpent, 6);
  assert.equal(npc.system.combatPools.free.offHandSpent, 2);
  assert.equal(messages.length, 1);
});

test("NPC actions show sticky reserve data, material weapons, natural profiles, then Other without inventory clutter", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const axe = inventoryItem("weapon", "Axe", {combatSpecialty: "oneHandedLightWeapons", weaponActions: 2, equipped: true});
  const spare = inventoryItem("weapon", "Spare", {combatSpecialty: "twoHandedWeapons", weaponActions: 0, equipped: false});
  const bite = naturalItem("Bite", "bite", 6);
  const sheet = new TrudvangNpcSheet(); sheet.actor = spendableNpc([axe, spare, bite, inventoryItem("gear", "Rope"), feat()]); sheet.isEditable = true;
  game.combat = {started: true, combatants: [{actor: sheet.actor}]};
  const context = await sheet._prepareContext({});
  const actions = render(context).split('<div class="tab actions"')[1].split('<div class="tab effects"')[0];
  assert.ok(actions.indexOf("combat-reserves-panel") < actions.indexOf('data-item-id="Axe"'));
  assert.ok(actions.indexOf('data-item-id="Spare"') < actions.indexOf('data-item-id="Bite"'));
  assert.ok(actions.indexOf('data-item-id="Bite"') < actions.indexOf('data-action="generic-combat-action"'));
  assert.ok(actions.indexOf('data-action="movement-action"') < actions.indexOf('data-action="generic-combat-action"'));
  assert.match(actions, /aria-valuenow="4" aria-valuemax="8"/);
  assert.match(actions, /aria-valuenow="6" aria-valuemax="6"/);
  assert.doesNotMatch(actions, /Rope|Tenace|item-delete|TRUDVANG\./);
  const spareRow = actions.split('data-item-id="Spare"')[1].split('</li>')[0];
  assert.match(spareRow, /data-action="item-roll"[^>]+disabled/);
  assert.match(spareRow, /data-action="item-parry"[^>]+disabled/);
});

test("NPC wrestling actions appear only when the creature can use them", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  let context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, false);
  assert.equal(context.npcWrestling.glima, false);
  sheet.actor.system.attacks = [[{attack: "Lutte", value: 10}]];
  context = await sheet._prepareContext({});
  const actions = render(context).split('<div class="tab actions"')[1].split('<div class="tab effects"')[0];
  assert.equal(context.npcWrestling.grapple, true);
  assert.equal(context.npcWrestling.glima, true);
  assert.match(actions, /data-action="wrestling-action" data-kind="grapple"/);
  assert.match(actions, /data-action="wrestling-action" data-kind="glima"/);
  sheet.actor.system.attacks = [];
  sheet.actor.effects = [{name: "Saisie", disabled: false, flags: {"trudvang-chronicles": {feat: "Saisie"}}}];
  context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, true, "a creature's Saisie capability also grants the action");
  assert.equal(context.npcWrestling.glima, false);
  sheet.actor.effects = [];
  sheet.actor.items.push({type: "creatureAbility", name: "Catch", img: "icons/svg/aura.svg",
    system: {catalogId: CREATURE_ABILITY_REFERENCES.Saisie.id, summary: "", description: "", source: {book: "", page: 0}}});
  context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, true, "the compendium Item keeps the action in either language");
  assert.equal(context.npcWrestling.glima, false);
});

test("a natural attack dialog spends its reserve and both Free hands, rolls a D20 and posts its result", async t => {
  const previous = {combat: game.combat, document: globalThis.document, Roll: globalThis.Roll,
    ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.document = previous.document; globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = 1; } };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => { messages.push(data); return data; }};
  const dialogs = [];
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialogs.push(options);
    return {modifier: 0, feint: 0, allocation: {"natural:bite": 6, free: 2}};
  }};
  const bite = naturalItem("Bite", "bite", 6);
  bite.update = async changes => { for (const [key, value] of Object.entries(changes)) set(bite, key, value); };
  const npc = spendableNpc([bite]); game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollWeaponAction(bite, "attack");
  assert.match(dialogs[0].content, /data-pool-id="natural:bite"/);
  assert.match(dialogs[0].content, /Bite/);
  assert.equal(result.roll.formula, "1d20"); assert.equal(result.result, 1);
  assert.equal(messages.length, 1); assert.equal(messages[0].rolls[0], result.roll);
  assert.equal(bite.system.naturalCombatPointsSpent, 6);
  assert.equal(bite.system.weaponActionsSpent, 1);
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 2);
});

test("worn armor adds protection and VI while natural armor never acquires VI", async () => {
  const armor = {id: "mail", name: "Mail", type: "armor", uuid: "Item.mail",
    system: {equipped: true, heft: 1, breach: {value: 40, max: 50}, weight: 2}};
  const npc = actor([armor]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.armorStatus.protection, 8);
  assert.equal(context.armorStatus.integrityCurrent, 40);
  assert.equal(context.armorStatus.integrityMax, 50);
  assert.match(render(context), /40 \/ 50 VI/);
});

test("catalogue disciplines and specialties render on separate linked rows, not as duplicate orphans", async () => {
  const parent = {id: "parent", name: "Combat armé", type: "ability",
    system: {kind: "discipline", catalogId: "armedFighting", parentSkill: "fighting", level: 2}};
  const child = {id: "child", name: "Armes légères à une main", type: "ability",
    system: {kind: "specialty", catalogId: "oneHandedLightWeapons", parentSkill: "fighting", level: 3, offHandLevel: 2}};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([parent, child]);
  const context = await sheet._prepareContext({});
  const [root] = context.npcSkillTrees;
  assert.equal(root.disciplines.length, 1);
  assert.equal(root.disciplines[0].specialties.length, 1);
  assert.equal(root.unassigned.length, 0);
  const html = render(context).split('<div class="tab actions"')[0];
  assert.equal((html.match(/data-item-id="parent"/g) || []).length, 1);
  assert.equal((html.match(/data-item-id="child"/g) || []).length, 1);
  assert.match(html, /3 \| 2/);
});

test("book knowledge opens its reference without creating an ability on the NPC", async () => {
  const sheet = new TrudvangNpcSheet();
  sheet.actor = actor();
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"},
    {name: "Connaissances", value: 5, kind: "skill"},
    {name: "Langage", value: 1, kind: "discipline"},
    {name: "Langue maternelle (bastjumal)", value: 2, kind: "specialty"}
  ];
  const rows = sheet._npcBookSkillRows();
  assert.equal(rows[0].skillKey, "fighting");
  assert.equal(rows[1].catalogId, "armedFighting");
  assert.equal(rows[2].catalogId, "oneHandedLightWeapons");
  assert.equal(rows[5].catalogId, "motherTongue");
  const opened = [];
  game.packs = new Map([["trudvang-chronicles.skills-fr", {
    getDocument: async id => {
      assert.equal(id, deterministicId("ability:oneHandedLightWeapons"));
      return {sheet: {render: options => opened.push(options)}};
    }
  }]]);
  try {
    await sheet._openNpcBookSkill(2);
    assert.deepEqual(opened, [{force: true}]);
    assert.equal(sheet.actor.items.length, 0);
    const html = render(await sheet._prepareContext({}));
    assert.match(html, /data-action="show-npc-book-skill" data-index="2"/);
  } finally { delete game.packs; }
});

test("NPC capacities open a dedicated sheet and never appear among actual effects", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()]);
  sheet.actor.effects = [
    {uuid: "Actor.npc.ActiveEffect.vision", name: "Vision nocturne", isOwner: true, img: "icons/svg/eye.svg", description: "<p>Vision en faible lumière.</p>", flags: {"trudvang-chronicles": {feat: "Vision nocturne"}}, sheet: {render() { throw new Error("Must not open the effect sheet"); }}},
    {uuid: "Actor.npc.ActiveEffect.manual", name: "Charge", img: "icons/svg/aura.svg", description: "Un véritable effet ajouté à la main.", flags: {}, system: {changes: []}, canUserModify: () => true}
  ];
  sheet.actor.allApplicableEffects = () => sheet.actor.effects;
  const context = await sheet._prepareContext({});
  assert.deepEqual(context.npcAbilities.map(entry => entry.name), ["Vision nocturne"]);
  assert.deepEqual(context.effects.map(entry => entry.name), ["Charge"]);
  const html = render(context).split('<div class="tab actions"')[0];
  assert.match(html, /data-action="capacity-edit" data-effect-uuid="Actor.npc.ActiveEffect.vision"/);
  assert.equal(context.npcAbilities[0].summary, creatureAbilityDetails(sheet.actor.effects[0], {localize: key => game.i18n.localize(key)}).summary);
  assert.doesNotMatch(html, /data-effect-uuid="Actor.npc.ActiveEffect.manual"/);
  const resolveUuid = foundry.utils.fromUuidSync;
  foundry.utils.fromUuidSync = uuid => {
    assert.equal(uuid, "Actor.npc.ActiveEffect.vision");
    return sheet.actor.effects[0];
  };
  try {
    const opened = await TrudvangActorSheet.DEFAULT_OPTIONS.actions["capacity-edit"].call(sheet,
      {preventDefault() {}, stopPropagation() {}},
      {dataset: {action: "capacity-edit", effectUuid: context.npcAbilities[0].effectUuid}, closest: () => null});
    assert.equal(opened.constructor.name, "TrudvangCreatureAbilitySheet");
    assert.deepEqual(opened.renderOptions, {force: true});
    const capacity = await opened._prepareContext({});
    assert.equal(capacity.ability.source.book, "Bestiaire de Jorge");
    assert.equal(typeof capacity.ability.source.page, "number");
    assert.equal(capacity.enrichedDescription, "<p>Vision en faible lumière.</p>");
    const template = Handlebars.compile(readFileSync(new URL("../templates/item/creature-ability-sheet.hbs", import.meta.url), "utf8"));
    assert.match(template(capacity), /<prose-mirror name="description"/);
    assert.doesNotMatch(template(capacity), /name="(duration|system.changes|disabled|transfer)/);
  } finally { foundry.utils.fromUuidSync = resolveUuid; }
});

test("capacity fields save independently of effect changes and preserve custom values", async () => {
  const {TrudvangCreatureAbilitySheet} = await import("../modules/sheets/creature-ability-sheet.mjs");
  let update;
  const document = {isOwner: true, name: "Vision nocturne", description: "<p>Description personnalisée.</p>",
    flags: {"trudvang-chronicles": {feat: "Vision nocturne", capacitySummary: "Résumé personnalisé", capacitySource: {book: "Livre personnel", page: 8}}},
    update: async value => { update = value; }};
  const sheet = new TrudvangCreatureAbilitySheet({document});
  const context = await sheet._prepareContext({});
  assert.equal(context.ability.summary, "Résumé personnalisé");
  assert.deepEqual(context.ability.source, {book: "Livre personnel", page: 8});
  const fields = {name: "Vision modifiée", description: "<p>Nouvelle description.</p>",
    "flags.trudvang-chronicles.capacitySummary": "Nouveau résumé", "flags.trudvang-chronicles.capacitySource.book": "Nouveau livre",
    "flags.trudvang-chronicles.capacitySource.page": "12", "system.changes": [{key: "bad"}], disabled: true};
  await TrudvangCreatureAbilitySheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: fields});
  assert.equal(update["flags.trudvang-chronicles.capacitySource.page"], 12);
  assert.equal(update.description, "<p>Nouvelle description.</p>");
  assert.equal(update["system.changes"], undefined);
  assert.equal(update.disabled, undefined);
  update = null;
  sheet.isEditable = false;
  await TrudvangCreatureAbilitySheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: fields});
  assert.equal(update, null);
});

test("compendium capacity Items use their dedicated sheet and appear apart from active effects", async () => {
  const {TrudvangCreatureAbilityItemSheet, openCreatureAbilitySheet} = await import("../modules/sheets/creature-ability-sheet.mjs");
  let changes, rendered;
  const capacity = {id: "tenace", uuid: "Actor.npc.Item.tenace", type: "creatureAbility", name: "Tenace", img: "icons/svg/aura.svg", isOwner: true,
    system: {catalogId: "tenace", summary: "Aucun malus de blessures", description: "<p>Texte détaillé.</p>",
      source: {book: "Bestiaire de Jorge", page: 40}, ignoreWoundPenalties: true},
    sheet: {render: value => { rendered = value; }}, update: async value => {changes = value;}};
  const actorSheet = new TrudvangNpcSheet(); actorSheet.actor = actor([capacity]);
  const context = await actorSheet._prepareContext({});
  assert.equal(context.npcAbilities.length, 1); assert.equal(context.npcAbilities[0].effectUuid, capacity.uuid);
  assert.equal(context.effects.length, 0); assert.ok(ignoresWoundPenalties(actorSheet.actor));
  openCreatureAbilitySheet(capacity); assert.deepEqual(rendered, {force: true});
  const sheet = new TrudvangCreatureAbilityItemSheet({document: capacity}); sheet.isEditable = true;
  const fields = await sheet._prepareContext({});
  assert.equal(fields.descriptionField, "system.description"); assert.equal(fields.summaryField, "system.summary");
  assert.equal(fields.sourceBookField, "system.source.book");
  const template = Handlebars.compile(readFileSync(new URL("../templates/item/creature-ability-sheet.hbs", import.meta.url), "utf8"));
  const html = template({...fields, editable: true});
  assert.match(html, /prose-mirror name="system.description"/); assert.match(html, /name="system.source.book"/);
  assert.doesNotMatch(html, /system\.level|system\.changes|capacitySummary/);
  await TrudvangCreatureAbilityItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {
    "system.summary": "Modifié", "system.source.page": "41", "system.changes": [], "system.ignoreWoundPenalties": false}});
  assert.deepEqual(changes, {"system.summary": "Modifié", "system.source.page": 41});
});

test("book skill D20 buttons use the PJ roll dialog and the correct discipline/specialty levels", async t => {
  const previousDocument = globalThis.document;
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  t.after(() => { globalThis.document = previousDocument; });
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: 1});
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"}
  ];
  const dialogs = [];
  foundry.applications.api.DialogV2 = {wait: async options => { dialogs.push(options); return null; }};
  try {
    for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
    assert.deepEqual(dialogs.map(dialog => dialog.window.title), ["Combat", "Combat armé", "Armes légères à une main"]);
    for (const [index, target] of [8, 10, 16].entries()) assert.match(dialogs[index].content, new RegExp(`\\b${target}\\b`));
    const html = render(await sheet._prepareContext({}));
    assert.match(html, /data-action="roll-npc-book-skill" data-index="2"/);
    assert.equal(sheet.actor.items.length, 1, "rolling book knowledge creates no embedded item");
  } finally { delete foundry.applications.api.DialogV2; }
});

test("validating a book specialty roll evaluates a D20 and creates a chat message", async t => {
  const previous = {document: globalThis.document, Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage,
    dialog: foundry.applications.api.DialogV2};
  t.after(() => {
    globalThis.document = previous.document;
    globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage;
    foundry.applications.api.DialogV2 = previous.dialog;
  });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; }
    async evaluate() { this.total = 7; }
  };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}),
    create: async data => { messages.push(data); return data; }};
  foundry.applications.api.DialogV2 = {wait: async () => ({modifier: -2})};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: 1});
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"}
  ];
  const result = await TrudvangActorSheet.DEFAULT_OPTIONS.actions["roll-npc-book-skill"].call(sheet,
    {preventDefault() {}, stopPropagation() {}},
    {dataset: {action: "roll-npc-book-skill", index: "2"}, closest: () => null});
  assert.equal(result.target, 14);
  assert.equal(result.result, 7);
  assert.equal(result.success, true);
  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0].speaker, {actor: "npc"});
  assert.equal(messages[0].rolls[0].formula, "1d20", "chat roll uses the normal Dice So Nice-compatible pipeline");
});

test("book skill rolls keep bonuses and effects without adding the actor base twice", async t => {
  const previous = {document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => { globalThis.document = previous.document; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const dialogs = [];
  foundry.applications.api.DialogV2 = {wait: async options => { dialogs.push(options); return null; }};
  for (const base of [1, 8]) {
    const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: base});
    sheet.actor.system.skills.fighting.bonus = 2;
    sheet.actor.system.effective.skills.fighting = base + 2 + 3;
    sheet.actor.system.modifiers.rolls.skills = {fighting: -2};
    sheet.actor.system.skillTree = [
      {name: "Combat", value: 8, kind: "skill"},
      {name: "Combat armé", value: 2, kind: "discipline"},
      {name: "Armes légères à une main", value: 3, kind: "specialty"}
    ];
    dialogs.length = 0;
    for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
    for (const [index, target] of [11, 13, 19].entries()) assert.match(dialogs[index].content, new RegExp(`Cible de base: ${target}\\b`));
    assert.equal(sheet.actor.system.skills.fighting.value, base, "rolling never rewrites the actor's base skill");
  }
});

test("unmatched book skill names still use their own parent values", async t => {
  const previous = {document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => { globalThis.document = previous.document; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const dialogs = [];
  foundry.applications.api.DialogV2 = {wait: async options => { dialogs.push(options); return null; }};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()]);
  sheet.actor.system.skillTree = [
    {name: "Compétence personnalisée", value: 7, kind: "skill"},
    {name: "Discipline personnalisée", value: 2, kind: "discipline"},
    {name: "Spécialité personnalisée", value: 1, kind: "specialty"}
  ];
  for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
  for (const [index, target] of [7, 9, 11].entries()) assert.match(dialogs[index].content, new RegExp(`Cible de base: ${target}\\b`));
});

test("negative health and death remain visible with a bounded gauge", async () => {
  const npc = actor([feat()]);
  npc.system.resources.body.value = -12;
  npc.system.survivalRounds = 0;
  npc.prepareDerivedData();
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.healthStatus.percent, 0);
  assert.equal(context.healthStatus.meterValue, 0);
  assert.match(render(context), /-12 \/ 40/);
  assert.match(render(context), /fa-skull-crossbones/);
});
