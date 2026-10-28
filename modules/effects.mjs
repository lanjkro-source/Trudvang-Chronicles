import {ACTOR_STATE_STATUSES} from "./rules/actor-status-resolver.mjs";
import {effectChangePhase} from "./rules/effect-contributions.mjs";
import {effectChangesSource} from "./rules/effect-source.mjs";
import {processWorldConsequences, registerConsequenceHooks} from "./consequences.mjs";
import {editedConsequenceClock} from "./rules/consumable-effects.mjs";

import {renderTemplate} from "./helpers.mjs";
import {annotateRuleTestDescription} from "./rule-tests.mjs";
import {currentRoundExpiry, registerCombatEffectHooks} from "./combat-effects.mjs";
import {normalizeEffectDuration, normalizeEffectStage} from "./rules/effect-duration.mjs";
import {isGradedEffect, isGradedState, effectDegree, gradedEffectName, cumulativeChangeValue} from "./rules/effect-stacking.mjs";

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
        initial: "refresh",
        choices: ["stack", "refresh", "replace", "highest"]
      }),
      potency: integer(0),
      degree: new fields.NumberField({required: true, nullable: true, initial: null, min: 1, integer: true}),
      stage: integer(0, {min: 0}),
      stages: new fields.ArrayField(new fields.SchemaField({
        label: string(),
        durationValue: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0}),
        durationUnit: string("rounds"),
        changes: stagedChangesField()
      }))
    };
  }
}

/** Suppress transferred effects when their source item is not currently usable.
 * Only weapon/armor/shield/gear author transfer:true effects (see
 * TrudvangItemSheet, which gates supportsEffects and effect creation on
 * EFFECT_ITEM_TYPES, and forces potion templates to transfer:false); the
 * applyEffects path copies with transfer:false. A transferred effect parented
 * to any other type (spell/divineFeat/tablet/ability) can only come from
 * foreign or migrated data and has no equipped/active transfer path, so it is
 * intentionally always suppressed. Potion templates are likewise always
 * suppressed because they never transfer. */
export class TrudvangActiveEffect extends BaseActiveEffect {
  canUserModify(user, action, data = {}) {
    if (action === "update" && user && (user.isGM
      || (user.id && this.flags?.["trudvang-chronicles"]?.creatorId === user.id))) return true;
    return super.canUserModify(user, action, data);
  }

  prepareBaseData() {
    super.prepareBaseData();
    if (isGradedEffect(this)) this.name = gradedEffectName(this);
    for (const change of this.system?.changes ?? []) {
      change.phase = effectChangePhase(change);
      if (isGradedState(this) && ["system.modifiers.rolls.allActions", "system.modifiers.rolls.initiative"].includes(change.key)) change.value = String(-effectDegree(this));
    }
  }

  static applyChange(targetDoc, change, options = {}) {
    const value = cumulativeChangeValue(change.effect, change, targetDoc, options.replacementData);
    if (value === change.value) return super.applyChange(targetDoc, change, options);
    return super.applyChange(targetDoc, {key: change.key, type: change.type, phase: change.phase, priority: change.priority, effect: change.effect, value}, options);
  }

  async toChat() {
    const description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.description || "", {async: true});
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/effect-card.hbs", {
      effect: this,
      description: annotateRuleTestDescription(description, this)
    });
    return ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: this.parent?.documentName === "Actor" ? this.parent : null}), content});
  }

  get isSuppressed() {
    if (super.isSuppressed) return true;
    if (this.system?.stackId === "trudvang-fatigued" && this.parent?.documentName === "Actor"
      && Array.from(this.parent.effects ?? []).some(effect => !effect.disabled && !effect.duration?.expired
        && effect.flags?.["trudvang-chronicles"]?.consumablePolicy?.ignoreFatigue)) return true;
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
    // A copied template belongs to the user creating this instance, not its
    // original author. Never infer authorship from lastModifiedBy.
    if (user?.id) this.updateSource({"flags.trudvang-chronicles.creatorId": user.id});
    if (isGradedEffect(this)) this.updateSource({showIcon: foundry.CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS, "system.degree": effectDegree(this)});
    this.updateSource({duration: normalizeEffectDuration(data.duration ?? {value: null, units: "rounds"})});
    if (data.system?.stages) this.updateSource({"system.stages": data.system.stages.map(normalizeEffectStage)});
    if (this.parent?.documentName === "Actor" && data.flags?.["trudvang-chronicles"]?.untilRoundEnd) {
      const expiry = currentRoundExpiry();
      if (!expiry) {ui.notifications.warn(game.i18n.localize("TRUDVANG.Status.SurprisedNeedsCombat")); return false;}
      this.updateSource({"flags.trudvang-chronicles.combatRoundExpiry": expiry,
        showIcon: foundry.CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS});
    }
    const stages = Array.from(this.system.stages || []);
    if (stages.length && !this.system.changes.length) {
      const first = stages[0];
      this.updateSource({
        "system.stage": 0,
        "system.changes": effectChangesSource(first.changes),
        duration: normalizeEffectDuration({value: Number(first.durationValue || 0), units: first.durationUnit || "rounds", expired: false})
      });
    }
    return allowed;
  }

  async _preUpdate(data, options, user) {
    if (!options?.trudvangStageTransition) {
      const clock = editedConsequenceClock(this, data);
      if (clock !== undefined) data["flags.trudvang-chronicles.consequenceClock"] = clock;
    }
    // Managed clocks process every elapsed tick and stage before deleting the
    // instance. Native expiry must not suppress its changes halfway through a
    // multi-stage catch-up; updateWorldTime drives the authoritative clock.
    if (this.flags?.["trudvang-chronicles"]?.consequenceClock && !options?.trudvangStageTransition) {
      if (data.duration?.expired === true) data.duration.expired = false;
      if (data["duration.expired"] === true) data["duration.expired"] = false;
    }
    // The editable header displays the prepared name, including its degree.
    // Keep that display suffix out of the stored base name on ordinary saves.
    if (isGradedEffect(this) && data.name === this.name && this._source.name !== this.name) data.name = this._source.name;
    if (data.duration) data.duration = normalizeEffectDuration({...this._source.duration, ...data.duration});
    if (Array.isArray(data.system?.stages)) data.system.stages = data.system.stages.map(normalizeEffectStage);
    return super._preUpdate(data, options, user);
  }
}

export const INCAPACITATING_STATUSES = new Set(["dead", "unconscious", "sleep", "stun", "paralysis"]);
export const IMMOBILIZING_STATUSES = new Set([...INCAPACITATING_STATUSES, "restrain"]);
const TOKEN_HUD_HIDDEN_STATUSES = ["shock", "corrode", "regen", "degen", "fireShield", "coldShield", "holyShield"];

export function configureEffects() {
  CONFIG.ActiveEffect.documentClass = TrudvangActiveEffect;
  CONFIG.ActiveEffect.dataModels.effect = TrudvangEffectData;
  // Native status effects keep their base type and gain the same editing schema.
  CONFIG.ActiveEffect.dataModels.base = TrudvangEffectData;
  CONFIG.ActiveEffect.defaultType = "effect";
  CONFIG.ActiveEffect.typeLabels.effect = "TYPES.ActiveEffect.effect";
  CONFIG.ActiveEffect.typeIcons.effect = "fa-solid fa-person-rays";
  // Persist native expiry so our hook can advance a stage or delete the final
  // applied instance. Direct native deletion would skip intermediate stages.
  CONFIG.ActiveEffect.expiryAction = "update";
  CONFIG.time.roundTime = 5;

  // Hide only the manual Token HUD shortcuts. Keep the status definitions so
  // ActiveEffects can still apply them and display their icons on actors/tokens.
  for (const id of TOKEN_HUD_HIDDEN_STATUSES) {
    const status = CONFIG.statusEffects[id];
    if (status) status.hud = false;
  }
  for (const status of ACTOR_STATE_STATUSES) CONFIG.statusEffects[status.id] = {...status};
}

const expirationJobs = new WeakMap();
/** Keep intermediate stages, delete applied effects when their final duration ends.
 * Library references are never consumed by expiration on a character. */
export function finishExpiredEffect(effect, options = {}) {
  if (expirationJobs.has(effect)) return expirationJobs.get(effect);
  const job = (async () => {
    if (options?.trudvangStageTransition) return;
    // isExpiryTrackable is a registration predicate, not an ownership check:
    // Foundry may unregister an effect as soon as it has expired. Determine
    // whether this is an applied instance from its document ancestry instead.
    const parent = effect.parent;
    const applied = parent?.documentName === "Actor"
      || (parent?.documentName === "Item" && parent.parent?.documentName === "Actor" && effect.transfer);
    if (!game.users?.activeGM?.isSelf || !["base", "effect"].includes(effect.type)
      || !applied || parent?.type === "effect" || effect.inCompendium) return;
    if (effect.flags?.["trudvang-chronicles"]?.consequenceClock) {
      return processWorldConsequences();
    }
    const stages = Array.from(effect.system.stages || []);
    const nextIndex = Number(effect.system.stage || 0) + 1;
    const next = stages[nextIndex];
    if (!next) {
      await effect.delete();
      return;
    }
    const implementation = foundry.documents.ActiveEffect.implementation;
    await effect.update({
      "system.stage": nextIndex,
      "system.changes": effectChangesSource(next.changes),
      duration: normalizeEffectDuration({
        value: Number(next.durationValue || 0),
        units: next.durationUnit || "rounds",
        expiry: null,
        expired: false
      }),
      disabled: false,
      start: implementation.getEffectStart()
    }, {trudvangStageTransition: true});
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.EffectStageAdvanced", {
      effect: effect.name,
      stage: next.label || String(nextIndex + 1)
    }));
  })().finally(() => expirationJobs.delete(effect));
  expirationJobs.set(effect, job);
  return job;
}

export function registerEffectHooks() {
  registerConsequenceHooks(appliedWorldEffects);
  registerCombatEffectHooks();
  Hooks.on("updateActiveEffect", (effect, changed, options) => {
    if (changed.duration?.expired === true || changed["duration.expired"] === true) return finishExpiredEffect(effect, options);
  });
  Hooks.on("ready", expireAppliedEffects);
}

/** Include unlinked tokens on inactive scenes, without duplicating linked actors. */
export function appliedWorldEffects() {
  const actors = new Set(Array.from(game.actors ?? []));
  for (const scene of game.scenes ?? []) for (const token of scene.tokens ?? []) if (token.actor) actors.add(token.actor);
  const effects = new Set();
  for (const actor of actors) {
    // Prepared applicable lists can omit suppressed/expired entries. Include
    // the stored collections so previously greyed-out instances are removed.
    for (const effect of actor.effects ?? []) effects.add(effect);
    for (const effect of actor.allApplicableEffects?.() ?? []) effects.add(effect);
    for (const item of actor.items ?? []) for (const effect of item.effects ?? []) if (effect.transfer) effects.add(effect);
  }
  return effects;
}

/** Complete pending expiry on world actors and unlinked tokens on every scene. */
export async function expireAppliedEffects() {
  for (const effect of appliedWorldEffects()) if (effect.duration?.expired) await finishExpiredEffect(effect);
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

// Summary helpers live in effects-summary.mjs so the combat dock (a Foundry-free
// test environment) can import them without dragging the ActiveEffect schema along.
export {effectChangeSummary, effectTooltipSummary} from "./effects-summary.mjs";
