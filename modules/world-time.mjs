import {appliedWorldEffects, expireAppliedEffects} from "./effects.mjs";
import {processWorldConsequences} from "./consequences.mjs";
import {escapeHtml} from "./helpers.mjs";

const TIME_UNITS = {minutes: 60, hours: 3600, days: 86400};
const t = key => game.i18n.localize(`TRUDVANG.Macro.${key}`);
let advancingTime, choosingDuration;

function canAdvanceTime() {
  if (game.user.isGM) return true;
  ui.notifications.warn(t("AdvanceDurationGMOnly"));
  return false;
}

/** Advance shared time and await recurring consequences before reporting completion. */
export function advanceWorldTime({value = 1, unit = "days"} = {}) {
  if (!canAdvanceTime()) return Promise.resolve(null);
  if (advancingTime) return advancingTime;
  value = Number(value);
  const seconds = value * TIME_UNITS[unit];
  if (!Number.isFinite(value) || value <= 0 || !Object.hasOwn(TIME_UNITS, unit) || !Number.isFinite(seconds)) {
    ui.notifications.warn(t("InvalidDuration"));
    return Promise.resolve(null);
  }
  advancingTime = (async () => {
    const registry = foundry.documents.ActiveEffect.implementation.registry;
    // Register synthetic actors on inactive scenes too; library templates remain excluded.
    for (const effect of appliedWorldEffects()) registry.add(effect);
    const time = await game.time.advance(seconds);
    await processWorldConsequences(time);
    await registry.refresh("updateWorldTime");
    await expireAppliedEffects({time: Number(time ?? game.time.worldTime)});
    const unitLabel = t(`TimeUnits.${unit}.${value === 1 ? "one" : "other"}`);
    const text = game.i18n.format("TRUDVANG.Macro.TimeElapsed", {
      value: new Intl.NumberFormat(game.i18n.lang || "en", {maximumFractionDigits: 10}).format(value), unit: unitLabel
    });
    await ChatMessage.create({speaker: ChatMessage.getSpeaker(), whisper: [], blind: false,
      content: `<p class="trudvang time-elapsed">${escapeHtml(text)}</p>`});
    return time;
  })().finally(() => {advancingTime = null;});
  return advancingTime;
}

/** GM macro: one dialog per invocation, defaulting to one day. */
export function advanceDuration() {
  if (!canAdvanceTime()) return Promise.resolve(null);
  if (choosingDuration) return choosingDuration;
  choosingDuration = (async () => {
    const choice = await foundry.applications.api.DialogV2.wait({
      window: {title: t("AdvanceDuration")}, classes: ["dialog", "trudvang"], position: {width: 400},
      content: `<div class="roll-dialog"><div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Field.Duration"))}</label><input name="value" type="number" step="any" min="0.000001" value="1"><select name="unit">${Object.keys(TIME_UNITS).map(unit => `<option value="${unit}"${unit === "days" ? " selected" : ""}>${escapeHtml(t(`TimeUnits.${unit}.other`))}</option>`).join("")}</select></div></div>`,
      buttons: [{action: "advance", label: t("AdvanceDurationConfirm"), default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return {value: Number(root.querySelector('[name="value"]').value), unit: root.querySelector('[name="unit"]').value};
        }}, {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}],
      rejectClose: false, modal: false
    });
    return choice && typeof choice === "object" ? advanceWorldTime(choice) : null;
  })().finally(() => {choosingDuration = null;});
  return choosingDuration;
}

// TEMPORARY WORLD MIGRATION — old/custom development macros may still call this
// entry point. The managed macro now calls advanceDuration() instead.
export const advanceDay = () => advanceWorldTime();
