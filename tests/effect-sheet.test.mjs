import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

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
  get isSuppressed() { return this._superSuppressed ?? false; }
  async _preCreate() { return true; }
}
StubActiveEffect.implementation = {getEffectStart: () => 777};

class StubActiveEffectConfig {
  static PARTS = {header: {template: "header.hbs"}, tabs: {template: "tabs.hbs"}, footer: {template: "footer.hbs"}};
  constructor({document} = {}) { this.document = document; this.isEditable = document?.isOwner ?? true; }
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

const {TrudvangEffectSheet} = await import("../modules/sheets/effect-sheet.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActiveEffect, EFFECT_ITEM_TYPES} = await import("../modules/effects.mjs");

function sheetFor(document) {
  return new TrudvangEffectSheet({document});
}

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
        if (key === "system" && value && typeof value === "object") existing.system = {...existing.system, ...deepClone(value)};
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
        update: async () => {},
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

test("createTrudvangEffect stacking matrix keeps current stack/refresh/replace/highest semantics", async () => {
  const matrix = [
    {stacking: "stack", incoming: 7, survivor: "both", potency: 7},
    {stacking: "stack", incoming: 5, survivor: "both", potency: 5},
    {stacking: "stack", incoming: 3, survivor: "both", potency: 3},
    {stacking: "refresh", incoming: 7, survivor: "existing", potency: 7},
    {stacking: "refresh", incoming: 5, survivor: "existing", potency: 5},
    {stacking: "refresh", incoming: 3, survivor: "existing", potency: 3},
    {stacking: "replace", incoming: 7, survivor: "new", potency: 7},
    {stacking: "replace", incoming: 5, survivor: "new", potency: 5},
    {stacking: "replace", incoming: 3, survivor: "new", potency: 3},
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
    if (survivor === "both") {
      assert.equal(actor.effects.length, 2, label);
      assert.ok(actor.effects.includes(existing), label);
      assert.equal(result.system.potency, potency, label);
      assert.notEqual(result.id, existing.id, label);
    } else if (survivor === "existing") {
      assert.equal(result.id, existing.id, label);
      assert.equal(actor.effects.length, 1, label);
      assert.equal(existing.system.potency, potency, label);
      assert.equal(existing._source.duration.expired, false, label);
      if (stacking === "refresh") assert.equal(existing._source.duration.value, 9, label);
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
      [{key: "system.effective.traits.strength", type: "add", value: "1", priority: null, phase: "final"}]);
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
  assert.ok(template.includes('data-document-uuid="{{documentUuid}}"'), "prose-mirror must bind the document or it stays inert");
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
