import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {ignoresWoundPenalties, npcCurrentTrait, npcSkillTrees, npcTraitEdit} from "../modules/rules/npc-summary.mjs";
import {COMBAT_POOL_IDS} from "../modules/rules/combat-pool-resolver.mjs";
import {TRUDVANG} from "../modules/config.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";

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
  documents: {Actor: class { prepareDerivedData() {} getFlag() { return null; } }, ActiveEffect: class {}},
  applications: {
    api: {HandlebarsApplicationMixin: Base => Base},
    sheets: {ActorSheetV2: class { async _prepareContext() { return {}; } }, ItemSheetV2: class {}},
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

function actor(items = []) {
  const traits = Object.fromEntries(Object.keys(TRUDVANG.traits).map(key => [key, 0]));
  traits.constitution = 2;
  const skills = Object.fromEntries(Object.keys(TRUDVANG.skills).map(key => [key, {value: 1, bonus: 0}]));
  skills.fighting.value = 8;
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
  assert.equal((html.match(/name="system\.traitCurrent\./g) || []).length, 0, "trait values are static, not editable");
  assert.ok(html.indexOf("npc-health-panel") < html.indexOf("npc-stats-grid"));
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
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

test("NPC capacities list only imported feats, and opens their effect sheet", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()]);
  sheet.actor.effects = [
    {uuid: "Actor.npc.ActiveEffect.vision", name: "Vision nocturne", img: "icons/svg/eye.svg", description: "<p>Vision en faible lumière.</p>", flags: {"trudvang-chronicles": {feat: "Vision nocturne"}}},
    {uuid: "Actor.npc.ActiveEffect.manual", name: "Charge", img: "icons/svg/aura.svg", description: "Un véritable effet ajouté à la main.", flags: {}}
  ];
  const context = await sheet._prepareContext({});
  assert.deepEqual(context.npcAbilities.map(entry => entry.name), ["Vision nocturne"]);
  const html = render(context).split('<div class="tab actions"')[0];
  assert.match(html, /data-action="effect-edit" data-effect-uuid="Actor.npc.ActiveEffect.vision"/);
  assert.match(html, /Vision en faible lumière\./);
  assert.doesNotMatch(html, /data-effect-uuid="Actor.npc.ActiveEffect.manual"/);
  let opened = false;
  const resolveUuid = foundry.utils.fromUuidSync;
  foundry.utils.fromUuidSync = uuid => {
    assert.equal(uuid, "Actor.npc.ActiveEffect.vision");
    return {sheet: {render: options => { assert.equal(options.force, true); opened = true; }}};
  };
  try {
    await TrudvangActorSheet.DEFAULT_OPTIONS.actions["effect-edit"].call(sheet,
      {preventDefault() {}, stopPropagation() {}},
      {dataset: {action: "effect-edit", effectUuid: context.npcAbilities[0].effectUuid}, closest: () => null});
    assert.equal(opened, true);
  } finally { foundry.utils.fromUuidSync = resolveUuid; }
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
