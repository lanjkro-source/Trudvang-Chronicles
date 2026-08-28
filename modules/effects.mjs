const fields = foundry.data.fields;
const BaseActiveEffect = foundry.documents.ActiveEffect;

export const EFFECT_ITEM_TYPES = new Set(["weapon", "armor", "shield", "gear", "potion"]);

const string = (initial = "") => new fields.StringField({required: true, nullable: false, initial});
const integer = (initial = 0, options = {}) => new fields.NumberField({
  required: true,
  nullable: false,
  integer: true,
  initial,
  ...options
});

function stagedChangesField() {
  return foundry.data.ActiveEffectTypeDataModel.defineSchema().changes;
}

/** Trudvang metadata layered on top of Foundry V14's native ActiveEffect changes. */
export class TrudvangEffectData extends foundry.data.ActiveEffectTypeDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      stackId: string(),
      stacking: new fields.StringField({
        required: true,
        nullable: false,
        initial: "stack",
        choices: ["stack", "refresh", "replace", "highest"]
      }),
      potency: integer(0),
      stage: integer(0, {min: 0}),
      stages: new fields.ArrayField(new fields.SchemaField({
        label: string(),
        durationValue: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0}),
        durationUnit: string("seconds"),
        changes: stagedChangesField()
      }))
    };
  }
}

/** Suppress transferred effects when their source item is not currently usable. */
export class TrudvangActiveEffect extends BaseActiveEffect {
  get isSuppressed() {
    if (super.isSuppressed) return true;
    if (!this.item || !this.transfer) return false;
    const item = this.item;
    if (!EFFECT_ITEM_TYPES.has(item.type)) return true;
    if (["weapon", "armor", "shield", "gear"].includes(item.type)) return !item.system.equipped;
    if (item.type === "potion") return true;
    return false;
  }

  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;
    const stages = Array.from(this.system.stages || []);
    if (stages.length && !this.system.changes.length) {
      const first = stages[0];
      this.updateSource({
        "system.stage": 0,
        "system.changes": foundry.utils.deepClone(first.changes || []),
        duration: {value: Number(first.durationValue || 0), units: first.durationUnit || "seconds", expired: false}
      });
    }
    return allowed;
  }
}

export const INCAPACITATING_STATUSES = new Set(["dead", "unconscious", "sleep", "stun", "paralysis"]);
export const IMMOBILIZING_STATUSES = new Set([...INCAPACITATING_STATUSES, "restrain"]);

export function configureEffects() {
  CONFIG.ActiveEffect.documentClass = TrudvangActiveEffect;
  CONFIG.ActiveEffect.dataModels.effect = TrudvangEffectData;
  CONFIG.ActiveEffect.defaultType = "effect";
  CONFIG.ActiveEffect.typeLabels.effect = "TYPES.ActiveEffect.effect";
  CONFIG.ActiveEffect.typeIcons.effect = "fa-solid fa-person-rays";
  CONFIG.time.roundTime = 5;
}

/** Advance staged extracts and poisons once Foundry expires the current stage. */
export function registerEffectHooks() {
  Hooks.on("updateActiveEffect", async (effect, changed, options) => {
    if (options?.trudvangStageTransition || changed.duration?.expired !== true) return;
    if (!game.users.activeGM?.isSelf || effect.type !== "effect") return;
    const stages = Array.from(effect.system.stages || []);
    const nextIndex = Number(effect.system.stage || 0) + 1;
    const next = stages[nextIndex];
    if (!next) return;
    const implementation = foundry.documents.ActiveEffect.implementation;
    await effect.update({
      "system.stage": nextIndex,
      "system.changes": foundry.utils.deepClone(next.changes || []),
      duration: {
        value: Number(next.durationValue || 0),
        units: next.durationUnit || "seconds",
        expiry: null,
        expired: false
      },
      start: implementation.getEffectStart()
    }, {trudvangStageTransition: true});
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.EffectStageAdvanced", {
      effect: effect.name,
      stage: next.label || String(nextIndex + 1)
    }));
  });
}

export function isIncapacitated(actor) {
  for (const status of INCAPACITATING_STATUSES) {
    if (actor.statuses.has(status)) return true;
  }
  return false;
}

export function isImmobilized(actor) {
  for (const status of IMMOBILIZING_STATUSES) {
    if (actor.statuses.has(status)) return true;
  }
  return false;
}

export function effectChangeSummary(effect) {
  return Array.from(effect.system.changes || []).map(change => {
    const value = typeof change.value === "string" ? change.value : JSON.stringify(change.value);
    return `${change.key} ${change.type} ${value}`;
  }).join(" · ");
}
