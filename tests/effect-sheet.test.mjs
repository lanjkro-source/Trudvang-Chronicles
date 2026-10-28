import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const set = (object, path, value) => {
  const keys = path.split(".");
  const leaf = keys.pop();
  const parent = keys.reduce((value, key) => value[key] ??= {}, object);
  parent[leaf] = value;
};
const deepClone = value => structuredClone(value);
class Field { constructor(options) { this.options = options; } }

class StubActiveEffect {
  static applyChange(target, change) {target.applied = change.value; return {[change.key]: Number(change.value)};}
  prepareBaseData() {}
  canUserModify(user) { return Boolean(user?.isGM || this.parent?.isOwner); }
  get isSuppressed() { return this._superSuppressed ?? false; }
  async _preCreate() { return true; }
  async _preUpdate() { return true; }
}
StubActiveEffect.implementation = {getEffectStart: () => 777};

class StubActiveEffectConfig {
  static PARTS = {header: {template: "header.hbs"}, tabs: {template: "tabs.hbs"}, footer: {template: "footer.hbs"}};
  constructor({document} = {}) { this.document = document; }
  get isEditable() { return this.document?.isOwner ?? true; }
  get isVisible() { return this.document?.visible ?? true; }
  async _prepareContext() { return {editable: false, isEditable: false}; }
  async _preparePartContext(partId, context) {
    return {tabs: {
      details: {id: "details", cssClass: "tab", group: "sheet"},
      durationChanges: {id: "durationChanges", cssClass: "tab", group: "sheet"},
      trudvang: {id: "trudvang", cssClass: "tab", group: "sheet"}
    }};
  }
  _processFormData(event, form, formData) { return {}; }
  async _onChangeForm(formConfig, event) { return "base-called"; }
}

globalThis.foundry = {
  abstract: {TypeDataModel: class { prepareBaseData() {} }},
  data: {ActiveEffectTypeDataModel: class { static defineSchema() { return {changes: []}; } }, fields: {
    NumberField: Field, StringField: Field, HTMLField: Field, BooleanField: Field, ArrayField: Field,
    SchemaField: class { constructor(fields) { this.fields = fields; } }
  }},
  documents: {Actor: class {
    prepareDerivedData() {}
    getFlag() { return null; }
    async _preCreate() { return this.creationAllowed; }
    async getTokenDocument(data, options) { return {data, options}; }
  }, ActiveEffect: StubActiveEffect},
  applications: {
    api: {HandlebarsApplicationMixin: Base => Base,
      DocumentSheetV2: class {
        constructor({document}) { this.document = document; this.isEditable = document.isOwner; }
        async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
        render(options) { this.renderOptions = options; return this; }
      }},
    sheets: {ActorSheetV2: class {}, ItemSheetV2: class {}, ActiveEffectConfig: StubActiveEffectConfig},
    ux: {TextEditor: {implementation: {enrichHTML: async value => value}}},
    handlebars: {renderTemplate: async () => ""}
  },
  utils: {getProperty: get, setProperty: set, hasProperty: (object, path) => get(object, path) !== undefined,
    expandObject: flat => { const output = {}; for (const [key, value] of Object.entries(flat)) set(output, key, value); return output; },
    deepClone, isPlainObject: value => typeof value === "object" && value !== null && value.constructor === Object}
};
globalThis.game = {user: {id: "tester"}, combat: null, i18n: {
  localize: key => key,
  format: (key, data) => String(key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
}};
globalThis.ui = {notifications: {warn: () => undefined, error: () => undefined, info: () => undefined}};
globalThis.CONFIG = {statusEffects: {}};

const {TrudvangEffectSheet} = await import("../modules/sheets/effect-sheet.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActiveEffect, EFFECT_ITEM_TYPES, registerEffectHooks, expireAppliedEffects} = await import("../modules/effects.mjs");
const {advanceDay} = await import("../modules/world-time.mjs");
const {applyGradedEffect} = await import("../modules/graded-effects.mjs");

function sheetFor(document) {
  return new TrudvangEffectSheet({document});
}

test("Hasten's compendium effect exposes its trait and skill table in the modifications editor",async()=>{
 const item=JSON.parse(readFileSync(new URL("../packs/_source/effects-fr/items/vitner-body-vitner_hasten_9_hate.json",import.meta.url)));
 const document=item.effects[0];document._source=structuredClone(document);document.duration={};document.isOwner=true;
 const context=await sheetFor(document)._preparePartContext("durationChanges",{});
 assert.equal(context.changes.length,1);
 assert.equal(context.changes[0].key,"system.transformation.traits");
 const trait=JSON.parse(context.changes[0].value)[0];
 assert.equal(trait.trait,"dexterity");
 assert.deepEqual(trait.skillBonus.skills,["agility","fighting"]);
 assert.equal(trait.skillBonus.values["4"],3);
 document.system.changes[0].value=[trait];
 const typedContext=await sheetFor(document)._preparePartContext("durationChanges",{});
 assert.deepEqual(JSON.parse(typedContext.changes[0].value),[trait]);
 assert.doesNotMatch(typedContext.changes[0].value,/\[object Object\]/);
});

test("effect edit permissions agree in the document, sheet and every tab", async t => {
  const originalUser = game.user;
  const originalPacks = game.packs;
  t.after(() => {game.user = originalUser; game.packs = originalPacks;});
  game.packs = new Map([["locked", {locked: true}], ["unlocked", {locked: false}]]);
  const effect = new TrudvangActiveEffect();
  Object.assign(effect, {flags: {"trudvang-chronicles": {creatorId: "creator"}},
    parent: {isOwner: false}, visible: false, description: "", statuses: new Set(),
    system: {changes: [], stages: []}, duration: {}, _source: {}});
  for (const [user, expected] of [[{id: "gm", isGM: true}, true],
    [{id: "creator", isGM: false}, true], [{id: "other", isGM: false}, false]]) {
    game.user = user;
    assert.equal(effect.canUserModify(user, "update"), expected);
    const sheet = sheetFor(effect);
    assert.equal(sheet.isEditable, expected);
    assert.equal(sheet.isVisible, expected);
    const context = await sheet._prepareContext({});
    assert.equal(context.editable, expected);
    assert.equal(context.isEditable, expected);
    for (const part of ["header", "details", "durationChanges", "trudvang", "footer"]) {
      const prepared = await sheet._preparePartContext(part, {editable: !expected});
      assert.equal(prepared.editable, expected, `${user.id}: ${part}`);
      assert.equal(prepared.isEditable, expected);
    }
  }
  game.user = {id: "owner", isGM: false};
  effect.parent.isOwner = true;
  assert.equal(sheetFor(effect).isEditable, true, "existing parent owners retain access without creator metadata");
  effect.pack = "locked";
  game.user = {id: "gm", isGM: true};
  assert.equal(sheetFor(effect).isEditable, false, "compendium locking remains enforced");
  effect.pack = "unlocked";
  assert.equal(sheetFor(effect).isEditable, true);
});

test("new and copied effects record the current creator, never the template author", async () => {
  const {TrudvangEffectData} = await import("../modules/effects.mjs");
  assert.equal(TrudvangEffectData.defineSchema().stacking.options.initial, "refresh");
  for (const flags of [{}, {"trudvang-chronicles": {creatorId: "template-author"}}]) {
    const effect = new TrudvangActiveEffect();
    effect.flags = flags;
    effect.system = {stages: []};
    const updates = [];
    effect.updateSource = data => updates.push(data);
    await effect._preCreate({}, {}, {id: "new-creator"});
    assert.deepEqual(updates, [{"flags.trudvang-chronicles.creatorId": "new-creator"},
      {duration: {value: null, units: "rounds"}}]);
  }
});

test("legacy effect configuration appears in editable rows and saving preserves spent reserves",async()=>{
 const document={isOwner:true,duration:{},_source:{},system:{changes:[{key:"system.modifiers.rolls.attack",type:"add",value:"1"}]},
  flags:{"trudvang-chronicles":{transformation:{rules:{temporaryHP:5,noParry:true,ignoreFear:true},temporaryHP:2}}}};
 const sheet=sheetFor(document),context=await sheet._preparePartContext("durationChanges",{});
 assert.equal(context.changes.find(c=>c.key==="system.transformation.temporaryHP").value,"5");
 assert.equal(context.changes.find(c=>c.key==="system.transformation.noParry").value,"true");
 assert.ok(context.supportedPaths.includes("system.transformation.movement"));
 const restore=stubCoreFormTransform();
 try{
  const data=sheet._processFormData({}, {}, {object:{"system.changes":context.changes}});
  const meta=data.flags["trudvang-chronicles"].transformation;
  assert.equal(meta.editableChanges,true);assert.equal(meta.temporaryHPSpent,3);
  assert.equal(meta["-=rules"],null);
 }finally{restore();}
});

test("TrudvangEffectSheet durationChanges stays finite for indefinite and finite durations", async () => {
  const indefinite = {
    isOwner: true,
    duration: {value: Infinity, units: "rounds", expiry: ""},
    _source: {duration: {value: null, units: "rounds"}},
    system: {changes: []}
  };
  const indefiniteCtx = await sheetFor(indefinite)._preparePartContext("durationChanges", {});
  assert.ok(Number.isFinite(indefiniteCtx.duration.value), "indefinite duration must not render Infinity");
  assert.equal(indefiniteCtx.duration.value, 0);

  const finite = {
    isOwner: true,
    duration: {value: Infinity, units: "rounds", expiry: ""},
    _source: {duration: {value: 5, units: "rounds"}},
    system: {changes: []}
  };
  const finiteCtx = await sheetFor(finite)._preparePartContext("durationChanges", {});
  assert.ok(Number.isFinite(finiteCtx.duration.value));
  assert.equal(finiteCtx.duration.value, 5);

  const proto = Object.getPrototypeOf(TrudvangEffectSheet.prototype);
  const original = proto._onChangeForm;
  try {
    proto._onChangeForm = async () => { throw new TypeError("Cannot read properties of null (reading 'querySelector')"); };
    assert.equal(await sheetFor(finite)._onChangeForm({}, {}), undefined, "core DOM mismatch must be swallowed");
    proto._onChangeForm = async () => { throw new Error("boom"); };
    await assert.rejects(() => sheetFor(finite)._onChangeForm({}, {}), /boom/, "non-DOM errors must rethrow");
  } finally {
    proto._onChangeForm = original;
  }
});

function makeStackActor({existingPotency = 5, existingDuration = {value: 3, units: "rounds"}} = {}) {
  const actor = new TrudvangActor();
  actor.canUserModify = () => true;
  const existing = {
    id: "existing-1",
    _id: "existing-1",
    type: "effect",
    name: "Existing",
    system: {stackId: "fire", stacking: "stack", potency: existingPotency},
    _source: {duration: deepClone(existingDuration)},
    duration: deepClone(existingDuration),
    start: 111,
    update: async changes => {
      for (const [key, value] of Object.entries(changes)) {
        if (key.includes(".")) set(existing, key, deepClone(value));
        else if (key === "system" && value && typeof value === "object") existing.system = {...existing.system, ...deepClone(value)};
        else if (key === "duration" && value && typeof value === "object") {
          existing._source.duration = deepClone(value);
          existing.duration = deepClone(value);
        }
        else if (key === "start") existing.start = value;
        else existing[key] = deepClone(value);
      }
    },
    delete: async () => {
      const index = actor.effects.indexOf(existing);
      if (index >= 0) actor.effects.splice(index, 1);
    }
  };
  actor.effects = [existing];
  let counter = 0;
  actor.createEmbeddedDocuments = async (type, docs) => {
    assert.equal(type, "ActiveEffect");
    return docs.map(data => {
      counter += 1;
      const doc = {
        id: `new-${counter}`,
        _id: `new-${counter}`,
        type: data.type ?? "effect",
        name: data.name ?? "Incoming",
        system: deepClone(data.system ?? {}),
        _source: {duration: deepClone(data.duration ?? {value: 0, units: "rounds"})},
        duration: deepClone(data.duration ?? {value: 0, units: "rounds"}),
        start: data.start,
        update: async changes => {
          for (const [key, value] of Object.entries(changes)) {
            if (key.includes(".")) set(doc, key, deepClone(value));
            else if (key === "system") doc.system = {...doc.system, ...deepClone(value)};
            else if (key === "duration") {doc.duration = deepClone(value); doc._source.duration = deepClone(value);}
            else doc[key] = deepClone(value);
          }
        },
        delete: async () => {
          const index = actor.effects.indexOf(doc);
          if (index >= 0) actor.effects.splice(index, 1);
        }
      };
      actor.effects.push(doc);
      return doc;
    });
  };
  return {actor, existing};
}

test("createTrudvangEffect stacking matrix replaces atomically without an intermediate effect expiration", async () => {
  const matrix = [
    {stacking: "stack", incoming: 7, survivor: "degree", potency: 5},
    {stacking: "stack", incoming: 5, survivor: "degree", potency: 5},
    {stacking: "stack", incoming: 3, survivor: "degree", potency: 5},
    {stacking: "refresh", incoming: 7, survivor: "existing", potency: 7},
    {stacking: "refresh", incoming: 5, survivor: "existing", potency: 5},
    {stacking: "refresh", incoming: 3, survivor: "existing", potency: 3},
    {stacking: "replace", incoming: 7, survivor: "existing", potency: 7},
    {stacking: "replace", incoming: 5, survivor: "existing", potency: 5},
    {stacking: "replace", incoming: 3, survivor: "existing", potency: 3},
    {stacking: "highest", incoming: 7, survivor: "new", potency: 7},
    {stacking: "highest", incoming: 5, survivor: "new", potency: 5},
    {stacking: "highest", incoming: 3, survivor: "existing", potency: 5}
  ];
  for (const {stacking, incoming, survivor, potency} of matrix) {
    const {actor, existing} = makeStackActor();
    const result = await actor.createTrudvangEffect({
      name: "Incoming",
      system: {stackId: "fire", stacking, potency: incoming},
      duration: {value: 9, units: "rounds"}
    });
    const label = `stacking=${stacking} incoming=${incoming}`;
    if (survivor === "degree") {
      assert.equal(actor.effects.length, 1, label);
      assert.ok(actor.effects.includes(existing), label);
      assert.equal(result.system.degree, 2, label);
      assert.equal(result.id, existing.id, label);
    } else if (survivor === "existing") {
      assert.equal(result.id, existing.id, label);
      assert.equal(actor.effects.length, 1, label);
      assert.equal(existing.system.potency, potency, label);
      assert.equal(existing._source.duration.expired, false, label);
      if (["refresh", "replace"].includes(stacking)) assert.equal(existing._source.duration.value, 9, label);
      else assert.equal(existing._source.duration.value, 3, label);
    } else {
      assert.equal(actor.effects.length, 1, label);
      assert.ok(!actor.effects.includes(existing), label);
      assert.equal(result.system.potency, potency, label);
      assert.notEqual(result.id, existing.id, label);
      assert.equal(result.duration.value, 9, label);
    }
  }
});

test("graded GM states accumulate independently without lost degrees on simultaneous drops", async () => {
  const {actor} = makeStackActor();
  actor.effects = [];
  for (const id of ["trudvang-fatigued", "trudvang-hungry", "trudvang-thirsty"]) {
    const data = {name: id, duration: {value: null, units: "rounds"}, system: {stackId: id, stacking: "stack", potency: 1, changes: []}};
    await Promise.all([actor.createTrudvangEffect(data), actor.createTrudvangEffect(data), actor.createTrudvangEffect(data)]);
    const matches = actor.effects.filter(effect => effect.system.stackId === id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].system.degree, 3);
  }
  assert.equal(actor.effects.length, 3);
});

test("every cumulative effect keeps one degree counter and scales numeric contributions without rewriting its source", async () => {
  const {actor} = makeStackActor(); actor.effects = [];
  const data = {name: "Blessing 2026", system: {stackId: "blessing", stacking: "stack", degree: 1, changes: [{key: "system.modifiers.rolls.allActions", type: "add", value: "2"}]}};
  const effects = await Promise.all([actor.createTrudvangEffect(data), actor.createTrudvangEffect(data), actor.createTrudvangEffect(data)]);
  assert.equal(actor.effects.length, 1); assert.equal(effects[0].system.degree, 3);
  const effect = new TrudvangActiveEffect();
  effect.name = data.name; effect._source = {name: data.name}; effect.system = deepClone(effects[0].system);
  effect.prepareBaseData(); effect.prepareBaseData();
  assert.equal(effect.name, "Blessing 2026 3");
  const change = {...effect.system.changes[0], effect}, target = {system: {traits: {strength: 4}}};
  assert.deepEqual(TrudvangActiveEffect.applyChange(target, change), {"system.modifiers.rolls.allActions": 6});
  assert.equal(change.value, "2");
  effect.system.degree = 2;
  assert.deepEqual(TrudvangActiveEffect.applyChange(target, {...change, value: "-@traits.strength"}), {"system.modifiers.rolls.allActions": -8});
  const context = await sheetFor({...effect, isOwner: true, duration: {}})._preparePartContext("durationChanges", {});
  assert.equal(context.graded, true); assert.equal(context.degree, 2);
  const saved = {name: effect.name, system: {degree: 4}};
  await effect._preUpdate(saved, {}, {});
  assert.equal(saved.name, "Blessing 2026", "saving the displayed name must not store its derived degree suffix");
});

test("refresh works without an authored stack ID, resets the clock and does not add bonuses", async () => {
  const {actor} = makeStackActor(); actor.effects = [];
  const data = {name: "Same source", origin: "Item.source", duration: {value: 6, units: "rounds"}, system: {stacking: "refresh", potency: 2, changes: [{key: "system.modifiers.rolls.allActions", type: "add", value: "2"}]}};
  const first = await actor.createTrudvangEffect(data);
  first.disabled = true; first.start = 123;
  await actor.createTrudvangEffect({...data, duration: {value: 2, units: "hours"}});
  assert.equal(actor.effects.length, 1);
  assert.equal(first.start, 777);
  assert.equal(first.duration.value, 2);
  assert.equal(first.duration.units, "hours");
  assert.equal(first.system.changes[0].value, "2");
  assert.equal(first.disabled, false);
});

test("three GM states prepare exactly minus one per degree without changing their source", async () => {
  const source = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url)));
  const graded = source.items.filter(item => ["trudvang-fatigued", "trudvang-hungry", "trudvang-thirsty"].includes(item.system?.catalogId));
  assert.equal(graded.length, 3);
  for (const item of graded) {
    assert.equal(item.folder, "gmItems");
    const effect = new TrudvangActiveEffect();
    effect.system = deepClone(item.effects[0].system);
    effect.name = "Fatigué"; effect._source = {name: "Fatigué"};
    effect.system.degree = 4;
    effect.prepareBaseData(); effect.prepareBaseData();
    assert.equal(effect.name, "Fatigué 4");
    assert.deepEqual(effect.system.changes.map(row => row.value), ["-4", "-4"]);
    effect.system.degree = 2; effect.prepareBaseData();
    assert.equal(effect.name, "Fatigué 2");
    assert.deepEqual(effect.system.changes.map(row => row.value), ["-2", "-2"]);
    assert.deepEqual(item.effects[0].system.changes.map(row => row.value), ["-1", "-1"]);
    const context = await sheetFor({isOwner: true, system: effect.system, duration: {}, _source: {}})._preparePartContext("durationChanges", {});
    assert.equal(context.graded, true); assert.equal(context.degree, 2);
    assert.deepEqual(Object.keys(context.reapplicationChoices), ["refresh", "stack"]);
  }
});

test("custom specialty copies reset all ranks, retain their parent/cost and cannot masquerade as base knowledge", async t => {
  const previous = {randomID: foundry.utils.randomID, format: game.i18n.format};
  t.after(() => {foundry.utils.randomID = previous.randomID; game.i18n.format = previous.format;});
  let serial = 0, opened = 0;
  foundry.utils.randomID = () => `copy${++serial}`;
  game.i18n.format = (_key, data) => `${data.name} (copy)`;
  const actor = new TrudvangActor();
  actor.type = "character";
  actor.system = {experience: {creationMode: true}, traits: {intelligence: 2}, skills: {knowledge: {value: 4}}};
  actor.canUserModify = () => true;
  actor.items = []; actor.items.get = id => actor.items.find(item => item.id === id);
  const add = data => {
    const item = {...data, id: `item${actor.items.length}`, toObject: () => deepClone(data), sheet: {render: () => {opened++;}},
      update: async changes => {for (const [key, value] of Object.entries(changes)) set(item, key, value);},
      delete: async () => {actor.items.splice(actor.items.indexOf(item), 1); return item;}};
    actor.items.push(item); return item;
  };
  actor.createEmbeddedDocuments = async (_kind, rows) => rows.map(add);
  const parent = add({name: "Language", type: "ability", system: {catalogId: "language", kind: "discipline", parentSkill: "knowledge", level: 1}});
  const base = add({name: "Foreign Tongue", img: "book.webp", type: "ability", system: {catalogId: "foreignTongue", kind: "specialty", parentSkill: "knowledge", parentDiscipline: "Language", level: 3, offHandLevel: 2, freeLevels: 3, rollBonus: 2, description: "Description", summary: "Summary"}});
  const copy = await actor.duplicateSpecialty(base.id);
  assert.equal(opened, 1);
  assert.equal(copy.system.level, 0); assert.equal(copy.system.freeLevels, 0); assert.equal(copy.system.offHandLevel, 0);
  assert.notEqual(copy.system.catalogId, base.system.catalogId);
  assert.equal(copy.system.description, "Description"); assert.equal(copy.img, "book.webp");
  assert.equal(actor.findParentDiscipline(copy), parent);
  assert.equal(actor.getKnowledgeLevelCost(copy, 1), actor.getKnowledgeLevelCost(base, 1));
  actor.system.skills.knowledge.value = 1;
  await actor.adjustCatalogKnowledge(copy.system.catalogId, 1);
  assert.equal(copy.system.level, 0, "copies still require the normal parent skill value");
  actor.system.skills.knowledge.value = 4; parent.system.level = 0;
  await actor.adjustCatalogKnowledge(copy.system.catalogId, 1);
  assert.equal(copy.system.level, 0, "copies cannot bypass the parent discipline");
  parent.system.level = 1;
  copy.name = base.name;
  actor.items.splice(actor.items.indexOf(base), 1);
  assert.equal(actor.findKnowledgeItem("foreignTongue"), undefined, "a renamed copy cannot replace the base catalogue entry");
  actor.items.push(base);
  copy.system.level = 1;
  await actor.adjustCatalogKnowledge(copy.system.catalogId, -1);
  assert.equal(copy.system.level, 0); assert.ok(actor.items.includes(copy), "zero-rank copies stay until explicitly deleted");
  assert.equal(await actor.deleteCustomSpecialty(base.id), null);
  copy.system.level = 1; assert.equal(await actor.deleteCustomSpecialty(copy.id), null);
  copy.system.level = 0; copy.system.offHandLevel = 1; assert.equal(await actor.deleteCustomSpecialty(copy.id), null);
  copy.system.offHandLevel = 0;
  await actor.deleteCustomSpecialty(copy.id);
  assert.ok(!actor.items.includes(copy)); assert.ok(actor.items.includes(base));
});

test("graded reference application preserves the edited degree, duration and reapplication choice", async () => {
  let applied;
  const actor = {canUserModify: () => true, createTrudvangEffect: async data => {applied = data; return data;}};
  const template = {_id: "reference", name: "Hungry", system: {stackId: "trudvang-hungry", stacking: "refresh", potency: 3, changes: []},
    duration: {value: 2, units: "days", expired: true}, start: {time: 3}, transfer: true};
  await applyGradedEffect(actor, {uuid: "Item.hunger", effects: [template]});
  assert.equal(applied._id, undefined);
  assert.equal(applied.system.potency, 3);
  assert.equal(applied.system.stacking, "refresh");
  assert.equal(applied.duration.value, 2);
  assert.equal(applied.duration.units, "days");
  assert.equal(applied.duration.expired, false);
  assert.equal(applied.start, null);
  assert.equal(applied.transfer, false);
  assert.equal(applied.origin, "Item.hunger");
});

// P1-1 intent lock: suppressing transferred effects parented to item types
// outside EFFECT_ITEM_TYPES is deliberate, not a bug. Only
// weapon/armor/shield/gear can author transfer:true effects (TrudvangItemSheet
// gates supportsEffects/creation on EFFECT_ITEM_TYPES and forces potion
// templates to transfer:false; applyEffects copies with transfer:false), so a
// transferred spell/divineFeat/tablet/ability effect can only come from
// foreign or migrated data and has no equipped/active transfer path.
test("TrudvangActiveEffect.isSuppressed matrix follows item type, equipped, and transfer", () => {
  const effectFor = ({superSuppressed = false, item, transfer = false} = {}) => {
    const effect = new TrudvangActiveEffect();
    effect._superSuppressed = superSuppressed;
    effect.item = item;
    effect.transfer = transfer;
    return effect;
  };
  assert.equal(effectFor({superSuppressed: true, item: {type: "weapon", system: {equipped: true}}, transfer: true}).isSuppressed, true, "core suppression dominates");
  assert.equal(effectFor({transfer: true}).isSuppressed, false, "no item is never suppressed");
  assert.equal(effectFor({item: {type: "weapon", system: {equipped: true}}, transfer: false}).isSuppressed, false, "no transfer is never suppressed");
  assert.ok(!EFFECT_ITEM_TYPES.has("spell"), "spell is outside EFFECT_ITEM_TYPES");
  assert.equal(effectFor({item: {type: "spell", system: {}}, transfer: true}).isSuppressed, true, "out-of-set type is suppressed when equipped");
  assert.equal(effectFor({item: {type: "spell", system: {}}, transfer: true}).isSuppressed, true, "out-of-set type is suppressed when unequipped");
  for (const type of ["weapon", "armor", "shield", "gear"]) {
    assert.equal(effectFor({item: {type, system: {equipped: true}}, transfer: true}).isSuppressed, false, `${type} equipped transfers`);
    assert.equal(effectFor({item: {type, system: {equipped: false}}, transfer: true}).isSuppressed, true, `${type} unequipped is suppressed`);
  }
  assert.equal(effectFor({item: {type: "potion", system: {equipped: true}}, transfer: true}).isSuppressed, true, "potion is always suppressed");
  assert.equal(effectFor({item: {type: "potion", system: {}}, transfer: true}).isSuppressed, true, "potion without equipped is suppressed");
});

test("TrudvangEffectSheet save drops legacy top-level changes from the core path", () => {
  const proto = Object.getPrototypeOf(TrudvangEffectSheet.prototype);
  const original = proto._processFormData;
  try {
    proto._processFormData = () => ({
      changes: [{key: "legacy.path", type: "add", value: "99"}],
      system: {changes: {0: {key: "system.effective.traits.strength", type: "add", value: "1", priority: "", phase: "final"}}},
      duration: {value: 1, units: "rounds", expiry: ""}
    });
    const document = {_source: {duration: {}, system: {stages: []}}, system: {stages: []}};
    const formData = {object: {
      "system.changes.0.key": "system.effective.traits.strength",
      "system.changes.0.type": "add",
      "system.changes.0.value": "1",
      "system.changes.0.priority": "",
      "system.changes.0.phase": "final"
    }};
    const submitData = sheetFor(document)._processFormData({}, {}, formData);
    assert.ok(!("changes" in submitData), "legacy top-level changes must not reach the document update");
    assert.deepEqual(submitData.system.changes,
      [{key: "system.effective.traits.strength", type: "add", value: "1", priority: null, phase: "initial"}]);
  } finally {
    proto._processFormData = original;
  }
});

test("TrudvangEffectSheet save warns and ignores a malformed system.stage", () => {
  const proto = Object.getPrototypeOf(TrudvangEffectSheet.prototype);
  const originalProcess = proto._processFormData;
  const originalWarn = globalThis.ui.notifications.warn;
  const warnings = [];
  globalThis.ui.notifications.warn = message => warnings.push(message);
  const saveWithStage = stage => {
    const document = {
      _source: {duration: {value: 1, units: "rounds", expiry: null, expired: false}, system: {stages: []}},
      system: {stages: []}
    };
    const formData = {object: {
      "system.stage": stage,
      "system.stages.0.label": "First",
      "system.stages.0.durationValue": 1,
      "system.stages.0.durationUnit": "rounds",
      "system.changes.0.key": "system.modifiers.protection",
      "system.changes.0.type": "add",
      "system.changes.0.value": "1",
      "system.changes.0.priority": "",
      "system.changes.0.phase": "final",
      "duration.value": 1,
      "duration.units": "rounds",
      "duration.expiry": "",
      "trudvang.stageChanges.0": "[]"
    }};
    return sheetFor(document)._processFormData({}, {}, formData);
  };
  try {
    proto._processFormData = (event, form, formData) =>
      foundry.utils.expandObject(foundry.utils.deepClone(formData.object || {}));
    const malformed = saveWithStage("bogus");
    assert.equal(malformed.system.stage, 0, "malformed stage falls back to the first stage");
    assert.equal(warnings.length, 1, "malformed stage warns once instead of throwing");
    const valid = saveWithStage("0");
    assert.equal(valid.system.stage, 0, "valid stage keeps the success path");
    assert.equal(warnings.length, 1, "valid stage does not warn");
  } finally {
    proto._processFormData = originalProcess;
    globalThis.ui.notifications.warn = originalWarn;
  }
});

test("TrudvangEffectSheet details exposes raw description and prose-mirror template", async () => {
  const document = {
    isOwner: true,
    uuid: "Effect.abc123",
    _source: {description: "<p>Raw typed</p>"},
    description: "<p>Raw typed</p>",
    origin: "actor-1"
  };
  const ctx = await sheetFor(document)._preparePartContext("details", {});
  assert.equal(ctx.description, "<p>Raw typed</p>", "details context must expose the raw description source");
  assert.equal(ctx.documentUuid, "Effect.abc123", "details context must expose the document uuid for prose-mirror");

  const fallback = {
    isOwner: true,
    description: "<p>Fallback</p>",
    origin: ""
  };
  const fallbackCtx = await sheetFor(fallback)._preparePartContext("details", {});
  assert.equal(fallbackCtx.description, "<p>Fallback</p>", "missing _source falls back to document.description");

  const template = readFileSync(new URL("../templates/effect/details.hbs", import.meta.url), "utf8");
  assert.ok(template.includes('<prose-mirror name="description"'), "details template must use prose-mirror for description");
  assert.ok(template.includes("{{{enrichedDescription}}}"), "prose-mirror must render the enriched description");
  assert.ok(template.includes("{{#if editable}}"), "house pattern: static fallback when read-only");
  assert.ok(template.includes('data-action="saveDescription"'), "save button must use camelCase to match the core actions map");
  assert.ok(template.includes("data-document-uuid=\"{{documentUuid}}\""), "prose-mirror must bind the document or it stays inert");
  assert.ok(template.includes("editor-container"), "description needs a sized container");
  assert.ok(!template.includes("{{editor"), "V12 {{editor}} helper must be gone from the details template");
});

function stubCoreFormTransform() {
  const proto = Object.getPrototypeOf(TrudvangEffectSheet.prototype);
  const original = proto._processFormData;
  // Mimic the core ActiveEffectConfig path: it only transforms the live
  // formData into a nested object; our override then processes it.
  proto._processFormData = function (event, form, formData) {
    return foundry.utils.expandObject(foundry.utils.deepClone(formData.object || {}));
  };
  return () => { proto._processFormData = original; };
}

function sheetWithTypedForm(document, flatObject) {
  const sheet = sheetFor(document);
  sheet.element = {querySelector: () => ({_testObject: flatObject, elements: {}})};
  sheet.renderCalls = 0;
  sheet.render = async function (options) { this.renderCalls += 1; this.renderOptions = options; return this; };
  return sheet;
}

const TYPED_FLAT = () => ({
  description: "Typed description",
  "duration.value": 4,
  "duration.units": "rounds",
  "duration.expiry": "",
  "system.changes.0.key": "system.modifiers.protection",
  "system.changes.0.type": "add",
  "system.changes.0.value": "2",
  "system.changes.0.priority": "",
  "system.changes.0.phase": "final"
});

function typedDocument() {
  const document = {
    isOwner: true,
    _source: {description: "", duration: {value: 0, units: "rounds"}, system: {stages: [], changes: []}},
    description: "",
    duration: {value: 0, units: "rounds"},
    system: {stages: [], changes: [], stage: 0},
    updates: [],
    update: async function (payload) { this.updates.push(deepClone(payload)); return this; }
  };
  return document;
}

test("TrudvangEffectSheet onAddChange preserves typed content with a single update", async () => {
  const restoreCore = stubCoreFormTransform();
  const originalFDE = globalThis.foundry.applications.ux.FormDataExtended;
  globalThis.foundry.applications.ux.FormDataExtended = class { constructor(form) { this.object = form._testObject; } };
  try {
    const document = typedDocument();
    const sheet = sheetWithTypedForm(document, TYPED_FLAT());
    await TrudvangEffectSheet.onAddChange.call(sheet);
    assert.equal(document.updates.length, 1, "structural action must persist through ONE document.update");
    const payload = document.updates[0];
    assert.ok(!Object.keys(payload).some(key => key.includes(".")), "payload must use nested assignments, never dotted keys");
    assert.equal(payload.description, "Typed description", "typed description must survive the row button");
    assert.equal(payload.duration?.value, 4, "typed duration must survive the row button");
    assert.equal(payload.system.changes.length, 2, "typed row plus one appended blank row");
    assert.equal(payload.system.changes[0].key, "system.modifiers.protection", "typed row key must be kept");
    assert.equal(payload.system.changes[0].value, "2", "typed row value must be kept");
    assert.deepEqual(payload.system.changes[1], {key: "", type: "add", value: "0", priority: null, phase: "final"});
    assert.equal(sheet.renderCalls, 1, "sheet must re-render once after the update");
  } finally {
    restoreCore();
    if (originalFDE === undefined) delete globalThis.foundry.applications.ux.FormDataExtended;
    else globalThis.foundry.applications.ux.FormDataExtended = originalFDE;
  }
});

test("TrudvangEffectSheet row buttons stay inert without any form instead of throwing", async () => {
  const document = typedDocument();
  const sheet = sheetFor(document);
  sheet.renderCalls = 0;
  sheet.render = async function () { this.renderCalls += 1; return this; };
  await TrudvangEffectSheet.onAddChange.call(sheet);
  assert.equal(document.updates.length, 0, "no form means no update");
  assert.equal(sheet.renderCalls, 0, "no form means no re-render");
});

test("TrudvangEffectSheet onDeleteChange preserves typed content and keeps other rows", async () => {
  const restoreCore = stubCoreFormTransform();
  const originalFDE = globalThis.foundry.applications.ux.FormDataExtended;
  globalThis.foundry.applications.ux.FormDataExtended = class { constructor(form) { this.object = form._testObject; } };
  try {
    const document = typedDocument();
    const flat = {
      ...TYPED_FLAT(),
      "system.changes.1.key": "system.modifiers.movement",
      "system.changes.1.type": "add",
      "system.changes.1.value": "3",
      "system.changes.1.priority": "",
      "system.changes.1.phase": "final"
    };
    const sheet = sheetWithTypedForm(document, flat);
    const target = {closest: () => ({dataset: {changeIndex: "0"}})};
    await TrudvangEffectSheet.onDeleteChange.call(sheet, {}, target);
    assert.equal(document.updates.length, 1, "structural action must persist through ONE document.update");
    const payload = document.updates[0];
    assert.equal(payload.description, "Typed description", "typed description must survive the row button");
    assert.equal(payload.duration?.value, 4, "typed duration must survive the row button");
    assert.equal(payload.system.changes.length, 1, "deleting one of two rows keeps the other");
    assert.equal(payload.system.changes[0].key, "system.modifiers.movement", "the surviving row must be kept");
    assert.equal(payload.system.changes[0].value, "3", "the surviving row value must be kept");
    assert.equal(sheet.renderCalls, 1, "sheet must re-render once after the update");
  } finally {
    restoreCore();
    if (originalFDE === undefined) delete globalThis.foundry.applications.ux.FormDataExtended;
    else globalThis.foundry.applications.ux.FormDataExtended = originalFDE;
  }
});

test("TrudvangEffectSheet onSaveDescription saves and collapses through the element", async () => {
  let saved = 0;
  const updates = [];
  const document = {_source: {description: "<p>Old</p>"},
    update: async changes => { updates.push(changes); return document; }};
  const sheet = {isEditable: true, document, element: {querySelector: selector =>
    (selector === 'prose-mirror[name="description"]'
      ? {save: async () => { saved += 1; }, value: "<p>New</p>"} : null)}};
  await TrudvangEffectSheet.onSaveDescription.call(sheet);
  assert.equal(saved, 1, "element.save() must run (same as the core menu save button)");
  assert.deepEqual(updates, [{description: "<p>New</p>"}], "changed text must persist to the document without closing");
  await TrudvangEffectSheet.onSaveDescription.call({...sheet, isEditable: false});
  assert.equal(saved, 1, "a read-only sheet cannot save through its action handler");
  const bare = {};
  await assert.doesNotReject(TrudvangEffectSheet.onSaveDescription.call(bare), "missing editor must stay inert");
  const unupgraded = {isEditable: true, element: {querySelector: () => ({})}};
  await assert.doesNotReject(TrudvangEffectSheet.onSaveDescription.call(unupgraded),
    "non-upgraded element without save() must stay inert instead of throwing");
  const unchanged = {isEditable: true, document: {_source: {description: "<p>Same</p>"},
    update: async changes => { updates.push(changes); return document; }},
    element: {querySelector: () => ({save: async () => {}, value: "<p>Same</p>"})}};
  const count = updates.length;
  await TrudvangEffectSheet.onSaveDescription.call(unchanged);
  assert.equal(updates.length, count, "unchanged text must not trigger a document update");
});

test("TrudvangEffectSheet onDeleteChange removes a just-added blank row", async () => {
  const restoreCore = stubCoreFormTransform();
  const originalFDE = globalThis.foundry.applications.ux.FormDataExtended;
  globalThis.foundry.applications.ux.FormDataExtended = class { constructor(form) { this.object = form._testObject; } };
  try {
    const document = typedDocument();
    const flat = {
      ...TYPED_FLAT(),
      "system.changes.1.key": "",
      "system.changes.1.type": "add",
      "system.changes.1.value": "0",
      "system.changes.1.priority": "",
      "system.changes.1.phase": "final"
    };
    const sheet = sheetWithTypedForm(document, flat);
    const target = {closest: () => ({dataset: {changeIndex: "1"}})};
    await TrudvangEffectSheet.onDeleteChange.call(sheet, {}, target);
    assert.equal(document.updates.length, 1, "deleting the blank row must persist");
    assert.deepEqual(document.updates[0].system.changes.map(row => row.key),
      ["system.modifiers.protection"], "blank row gone, typed row kept");
    assert.equal(document.updates[0].description, "Typed description", "typed content must survive");
  } finally {
    restoreCore();
    if (originalFDE === undefined) delete globalThis.foundry.applications.ux.FormDataExtended;
    else globalThis.foundry.applications.ux.FormDataExtended = originalFDE;
  }
});
test("TrudvangEffectSheet trudvang tab exposes no stacking UI", async () => {
  const template = readFileSync(new URL("../templates/effect/effect-rules.hbs", import.meta.url), "utf8");
  assert.ok(!template.includes("system.stacking"), "no stacking select may remain in the Trudvang tab");
  assert.ok(!template.includes("stackId"), "no stackId input may remain in the Trudvang tab");
  assert.ok(!template.includes("potency"), "no potency input may remain in the Trudvang tab");
  assert.ok(!template.includes("stackingChoices"), "no stacking choices binding may remain in the Trudvang tab");

  const document = {isOwner: true, system: {stages: [], stacking: "stack", stackId: "fire", potency: 5}};
  const ctx = await sheetFor(document)._preparePartContext("trudvang", {});
  assert.ok(!("stackingChoices" in ctx), "trudvang context must drop the now-unused stackingChoices");
});

for (const type of ["base", "effect"]) {
  test(`${type}: Details offers multiple states below the origin, preserving hidden and unknown states`, async t => {
    const previous = CONFIG.statusEffects;
    t.after(() => {CONFIG.statusEffects = previous;});
    CONFIG.statusEffects = {sleep: {id: "sleep", name: "Sleep"}, blind: {id: "blind", name: "Blind"},
      hidden: {id: "hidden", name: "Hidden from HUD", hud: false}};
    const document = {type, isOwner: true, statuses: new Set(["sleep", "custom-state"]), description: "", origin: "Actor.test"};
    const sheet = sheetFor(document);
    const context = await sheet._preparePartContext("details", {});
    assert.equal(context.statusChoices.find(row => row.id === "sleep").selected, true);
    assert.equal(context.statusChoices.find(row => row.id === "blind").selected, false);
    assert.equal(context.statusChoices.find(row => row.id === "custom-state").selected, true);
    assert.ok(context.statusChoices.some(row => row.id === "hidden"));
    const hbs = Handlebars.create(); hbs.registerHelper("localize", key => key);
    const template = hbs.compile(readFileSync(new URL("../templates/effect/details.hbs", import.meta.url), "utf8"));
    const html = template(context);
    assert.ok(html.indexOf("EFFECT.StatusConditions") > html.indexOf("EFFECT.Origin"));
    assert.match(html, /<multi-select name="statuses"/);
    assert.match(html, /value="sleep" selected/);
    assert.match(html, /value="custom-state" selected/);
    const readOnly = await sheetFor({...document, isOwner: false})._preparePartContext("details", {});
    assert.match(template(readOnly), /<multi-select name="statuses" disabled/);
    const restore = stubCoreFormTransform();
    try {
      for (const statuses of [["blind", "sleep", "blind"], [], ["custom-state"]]) {
        const result = sheet._processFormData({}, {}, {object: {statuses, "system.changes": [{key: "system.modifiers.protection", type: "add", value: "2"}]}});
        assert.deepEqual(result.statuses, [...new Set(statuses)]);
        assert.equal(result.system.changes[0].value, "2");
        assert.equal(result.type, undefined, "editing states must not convert existing document types");
      }
      const partial = sheet._processFormData({}, {}, {object: {description: "New description"}});
      assert.equal(partial.statuses, undefined, "partial edits must not erase statuses");
    } finally {restore();}
  });
}

test("native and custom effect types advance stages through the same lifecycle", async t => {
  const previousHooks = globalThis.Hooks, previousUsers = game.users;
  t.after(() => {globalThis.Hooks = previousHooks; game.users = previousUsers;});
  let hook;
  globalThis.Hooks = {on: (event, callback) => {if (event === "updateActiveEffect") hook = callback;}};
  game.users = {activeGM: {isSelf: true}};
  registerEffectHooks();
  for (const type of ["base", "effect"]) {
    let saved;
    const effect = {type, name: "Effect", parent: {documentName: "Actor"}, disabled: true, isExpiryTrackable: false,
      system: {stage: 0, stages: [{}, {label: "Next", durationValue: 2, durationUnit: "rounds", changes: []}]},
      update: async data => {saved = data;}};
    await hook(effect, {duration: {expired: true}}, {});
    assert.equal(saved["system.stage"], 1);
    assert.equal(saved.duration.expired, false);
    assert.equal(saved.disabled, false, "the next stage must become active again");
  }
});

test("expiration deletes the final applied effect once and preserves library references", async t => {
  const previousHooks = globalThis.Hooks, previousUsers = game.users;
  t.after(() => {globalThis.Hooks = previousHooks; game.users = previousUsers;});
  let hook;
  globalThis.Hooks = {on: (event, callback) => {if (event === "updateActiveEffect") hook = callback;}};
  game.users = {activeGM: {isSelf: true}};
  registerEffectHooks();
  for (const type of ["base", "effect"]) {
    let deleted = 0;
    const applied = {type, parent: {documentName: "Actor", type: "character"}, isExpiryTrackable: false, disabled: true,
      system: {stage: 1, stages: [{}, {}]},
      delete: async () => {deleted++; await Promise.resolve();}};
    await Promise.all([hook(applied, {duration: {expired: true}}, {}), hook(applied, {"duration.expired": true}, {})]);
    assert.equal(deleted, 1, "duplicate notifications must not delete an effect twice");
    for (const attributes of [{parent: {documentName: "Item", type: "effect"}}, {inCompendium: true},
      {parent: {documentName: "Item", type: "gear"}},
      {parent: {documentName: "Item", type: "potion", parent: applied.parent}, transfer: false}]) {
      await hook({...applied, ...attributes}, {duration: {expired: true}}, {});
    }
    assert.equal(deleted, 1, "templates must survive expiry on an actor");
    game.users.activeGM.isSelf = false;
    await hook({...applied}, {duration: {expired: true}}, {});
    assert.equal(deleted, 1, "only the elected GM handles expiry");
    game.users.activeGM.isSelf = true;
  }
});

test("advance-day moves shared time once, refreshes long durations and deletes expired effects on unlinked tokens", async t => {
  const previous = {game: globalThis.game, registry: StubActiveEffect.implementation.registry, info: ui.notifications.info};
  t.after(() => {globalThis.game = previous.game; StubActiveEffect.implementation.registry = previous.registry; ui.notifications.info = previous.info;});
  const day = 86400, registered = new Set();
  const actor = {documentName: "Actor", type: "character", effects: []}, tokenActor = {documentName: "Actor", type: "npc", effects: []};
  function effect(parent, value, units, seconds) {
    const row = {type: "effect", parent, system: {stages: []}, isExpiryTrackable: true,
      duration: {value, units, expired: false, remaining: value}, seconds,
      async delete() {parent.effects.splice(parent.effects.indexOf(this), 1);}};
    parent.effects.push(row);
    return row;
  }
  const short = effect(actor, 12, "hours", 43200), long = effect(actor, 48, "hours", 172800);
  const days = effect(tokenActor, 3, "days", 3 * day), tokenShort = effect(tokenActor, 6, "hours", 21600);
  const year = effect(actor, 1, "years", 365 * day), permanent = effect(actor, null, "rounds", null);
  const template = effect(actor, 1, "hours", 3600); template.parent = {type: "effect"}; template.isExpiryTrackable = false;
  let advances = 0, notices = 0;
  globalThis.game = {user: {isGM: true}, users: {activeGM: {isSelf: true}}, actors: [actor],
    scenes: [{tokens: [{actor}, {actor: tokenActor}]}], i18n: {localize: key => key},
    time: {worldTime: 0, async advance(delta) {advances++; assert.equal(delta, day); await Promise.resolve(); return this.worldTime += delta;}}};
  ui.notifications.info = () => {notices++;};
  StubActiveEffect.implementation.registry = {
    add(row) {if (row.isExpiryTrackable) registered.add(row);},
    async refresh(event) {
      assert.equal(event, "updateWorldTime");
      assert.equal(game.time.worldTime, day, "refresh must follow the clock update");
      for (const row of registered) if (row.seconds !== null) {
        row.duration.remaining = row.duration.value * (row.seconds - day) / row.seconds;
        row.duration.expired = row.seconds <= day;
        if (row.duration.expired) row.isExpiryTrackable = false;
      }
    }
  };
  assert.deepEqual(await Promise.all([advanceDay(), advanceDay()]), [day, day]);
  assert.equal(advances, 1, "double clicks must not advance two days");
  assert.equal(notices, 1);
  assert.ok(!actor.effects.includes(short));
  assert.ok(!tokenActor.effects.includes(tokenShort));
  assert.equal(long.duration.remaining, 24);
  assert.equal(days.duration.remaining, 2);
  assert.equal(year.duration.remaining, 364 / 365);
  assert.ok(actor.effects.includes(permanent));
  assert.ok(actor.effects.includes(template), "library templates are never consumed");
  assert.equal(registered.size, 6, "linked actors are processed once, inactive-scene tokens are included");
});

test("advance-day rejects players and releases its lock after a failed clock update", async t => {
  const previous = {game: globalThis.game, registry: StubActiveEffect.implementation.registry, warn: ui.notifications.warn};
  t.after(() => {globalThis.game = previous.game; StubActiveEffect.implementation.registry = previous.registry; ui.notifications.warn = previous.warn;});
  let calls = 0, warnings = 0;
  globalThis.game = {user: {isGM: false}, actors: [], scenes: [], i18n: {localize: key => key},
    time: {async advance(delta) {calls++; if (calls === 1) throw new Error("Clock unavailable"); return delta;}}};
  StubActiveEffect.implementation.registry = {refresh: async () => {}};
  ui.notifications.warn = () => {warnings++;};
  assert.equal(await advanceDay(), null);
  assert.equal(calls, 0);
  assert.equal(warnings, 1);
  game.user.isGM = true;
  await assert.rejects(advanceDay(), /Clock unavailable/);
  assert.equal(await advanceDay(), 86400);
  assert.equal(calls, 2);
});

test("cleanup deletes already-greyed actor and equipment instances even when the applicable list omits them", async t => {
  const previous = globalThis.game;
  t.after(() => {globalThis.game = previous;});
  const deleted = [];
  const actor = {documentName: "Actor", effects: [], items: [], allApplicableEffects: () => []};
  const gear = {documentName: "Item", type: "gear", parent: actor, effects: []};
  const instance = (id, parent, transfer = false) => ({id, type: "effect", parent, transfer, system: {stages: []},
    duration: {expired: true}, disabled: true, isExpiryTrackable: false, async delete() {deleted.push(id);}});
  actor.effects.push(instance("direct", actor));
  gear.effects.push(instance("equipment", gear, true), instance("reference", gear));
  actor.items.push(gear);
  globalThis.game = {actors: [actor], scenes: [{tokens: [{actor}]}], users: {activeGM: {isSelf: true}}};
  await expireAppliedEffects();
  assert.deepEqual(deleted, ["direct", "equipment"]);
});

test("managed consequence clocks keep native expiry from suppressing intermediate stages",async()=>{
 const e=new TrudvangActiveEffect();e.flags={"trudvang-chronicles":{consequenceClock:{name:"X",stage:0,stageStartedAt:0,ticks:[],stages:[{seconds:10,changes:[]}]}}};e.system={changes:[],stages:[]};e._source={name:"X",duration:{value:2,units:"rounds"}};
 const data={duration:{expired:true}};await e._preUpdate(data,{},{});assert.equal(data.duration.expired,false);
});
test("Tornrot suppresses fatigue without deleting its accumulated degree",()=>{
 const fatigue=new TrudvangActiveEffect();fatigue.system={stackId:"trudvang-fatigued",degree:3};fatigue.parent={documentName:"Actor",effects:[{disabled:false,flags:{"trudvang-chronicles":{consumablePolicy:{ignoreFatigue:true}}}}]};
 assert.equal(fatigue.isSuppressed,true);assert.equal(fatigue.system.degree,3);
 fatigue.parent.effects[0].disabled=true;assert.equal(fatigue.isSuppressed,false);
});
