import {escapeHtml, escapeAttribute} from "./helpers.mjs";
import {DIVINE_FAILURE_ROWS, divineFailurePowers, planDivineFailure} from "./rules/divine-failure.mjs";
import {normalizeEffectDuration} from "./rules/effect-duration.mjs";

const SCOPE = "trudvang-chronicles";
const FLAG = "divineFailureResult";
const i18n = (key, data) => data
  ? game.i18n.format(`TRUDVANG.DivineFailure.${key}`, data)
  : game.i18n.localize(`TRUDVANG.DivineFailure.${key}`);
const canApply = message => message.isContentVisible && (game.user.isGM || message.isAuthor);
const applying = new Set();

async function choosePower(powers) {
  if (!powers.length) return null;
  const choices = powers.map(power => `<option value="${escapeAttribute(power.id)}">${escapeHtml(power.name)}</option>`).join("");
  const id = await foundry.applications.api.DialogV2.wait({
    window: {title: i18n("ChoosePower")},
    content: `<div class="trudvang roll-dialog"><label>${escapeHtml(i18n("ChoosePower"))} <select name="power">${choices}</select></label></div>`,
    buttons: [
      {action: "apply", default: true, label: i18n("Apply"),
        callback: (_event, button, dialog) => (button.form ?? dialog.element).querySelector('[name="power"]')?.value},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => null}
    ],
    rejectClose: false
  });
  return powers.find(power => power.id === id) ?? null;
}

export async function applyDivineFailure(message) {
  if (!canApply(message) || applying.has(message.id)) return false;
  const result = message.getFlag(SCOPE, FLAG);
  const rule = DIVINE_FAILURE_ROWS[result?.row];
  if (!rule || !result.actorUuid || result.applied) return false;
  applying.add(message.id);
  try {
    const actor = await foundry.utils.fromUuid(result.actorUuid);
    if (!actor?.isOwner) return false;
    const existing = actor.effects.get(message.id);
    if (existing?.flags?.[SCOPE]?.divineFailure?.resultId === message.id) {
      await message.update({[`flags.${SCOPE}.${FLAG}.applied`]: existing.name});
      return true;
    }
    const candidates = rule.kind === "powers" ? divineFailurePowers(actor) : [];
    let power = result.power;
    if (rule.kind === "powers" && !rule.random && !power?.id) {
      if (!candidates.length) return ui.notifications.warn(i18n("NoPowers"));
      power = await choosePower(candidates);
      if (!power) return false;
    }
    const plan = await planDivineFailure(result.row, {
      power, candidates, roll: async formula => Number((await new Roll(formula).evaluate()).total)
    });
    if (!plan) return ui.notifications.warn(i18n("NoPowers"));
    const powers = plan.powers.map(power => power.name).join(", ");
    const name = plan.kind === "powers" ? i18n("PowersEffect", {powers})
      : i18n(plan.kind === "wrath" ? "WrathEffect" : "LinkEffect");
    const text = game.i18n.localize(`TRUDVANG.Content.Table.FatalFailure.E${result.row}`);
    const effect = await actor.createTrudvangEffect({
      _id: message.id, name, img: "icons/svg/holy-shield.svg",
      description: `<p>${escapeHtml(text)}</p>`,
      duration: normalizeEffectDuration(plan.duration),
      system: {stackId: `divine-failure:${message.id}`, changes: []},
      flags: {[SCOPE]: {summary: text, divineFailure: {
        resultId: message.id, kind: plan.kind, powerIds: plan.powers.map(power => power.id)
      }}}
    }, {keepId: true});
    if (!effect) return false;
    await message.update({[`flags.${SCOPE}.${FLAG}.applied`]: name});
    return true;
  } finally {
    applying.delete(message.id);
  }
}

export function renderDivineFailureAction(message, html) {
  if (!message.isContentVisible) return;
  const result = message.getFlag(SCOPE, FLAG);
  const content = html.querySelector(".message-content");
  if (!result || !content) return;
  if (result.applied) {
    const note = document.createElement("p");
    note.textContent = i18n("Applied", {effect: result.applied});
    content.append(note);
    return;
  }
  if (!result.actorUuid || !DIVINE_FAILURE_ROWS[result.row] || !canApply(message)) return;
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = i18n("Apply");
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await applyDivineFailure(message);
    } catch (error) {
      console.error("Trudvang Chronicles | Divine failure application failed", error);
      ui.notifications.warn(i18n("ApplyFailed"));
    } finally {
      button.disabled = false;
    }
  });
  content.append(button);
}
