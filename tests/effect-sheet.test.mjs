import assert from "node:assert/strict";
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
