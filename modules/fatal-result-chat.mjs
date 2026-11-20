import {escapeHtml, escapeAttribute} from "./helpers.mjs";
import {DIVINE_FAILURE_ROWS, divineFailurePowers, planDivineFailure} from "./rules/divine-failure.mjs";
import {normalizeEffectDuration} from "./rules/effect-duration.mjs";
import {FATAL_MAGIC_ROWS, planFatalMagic, storedVitnerForCurrent} from "./rules/fatal-magic.mjs";
import {requestFatalVitnerArea} from "./chat-application.mjs";

const SCOPE = "trudvang-chronicles";
const FLAG = "divineFailureResult";
const i18n = (key, data) => data
  ? game.i18n.format(`TRUDVANG.DivineFailure.${key}`, data)
  : game.i18n.localize(`TRUDVANG.DivineFailure.${key}`);
const canApply = message => message.isContentVisible && (game.user.isGM || message.isAuthor);
const applying = new Set();
const roll = async formula => Number((await new Roll(formula).evaluate()).total);

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
      power, candidates, roll
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

export async function applyFatalMagic(message) {
  if (!canApply(message) || applying.has(message.id)) return false;
  const result = message.getFlag(SCOPE, "fatalMagicResult");
  const rule = FATAL_MAGIC_ROWS[result?.row];
  if (!rule || !result.actorUuid || result.applied) return false;
  if (rule.drain) {
    const response = await requestFatalVitnerArea(message);
    if (["applied", "alreadyApplied"].includes(response.status)) return true;
    ui.notifications.warn(game.i18n.localize(response.status === "noOrigin"
      ? "TRUDVANG.FatalMagic.NoOrigin" : "TRUDVANG.FatalMagic.AreaUnavailable"));
    return false;
  }
  applying.add(message.id);
  try {
    const actor = await foundry.utils.fromUuid(result.actorUuid);
    if (!actor?.isOwner) return false;
    let effect = actor.effects.get(message.id);
    if (!effect) {
      const plan = await planFatalMagic(result.row, roll);
      const name = game.i18n.localize(plan.depleted ? "TRUDVANG.FatalMagic.Depletion"
        : plan.lethargy ? "TRUDVANG.FatalMagic.Lethargy" : "TRUDVANG.FatalMagic.ReducedVitner");
      const details = [
        ...(plan.lethargy ? [game.i18n.localize("TRUDVANG.FatalMagic.Penalty")] : []),
        ...(plan.reduction ? [game.i18n.format("TRUDVANG.FatalMagic.Loss", {points: plan.reduction})] : []),
        ...(plan.depleted ? [game.i18n.localize("TRUDVANG.FatalMagic.NoRecovery")] : [])
      ].join(" · ");
      effect = await actor.createTrudvangEffect({
        _id: message.id, name, img: "icons/svg/daze.svg",
        description: `<p>${escapeHtml(details)}</p>`,
        duration: normalizeEffectDuration(plan.duration),
        system: {stackId: `fatal-magic:${message.id}`, changes: plan.lethargy
          ? ["allActions", "initiative"].map(key => ({key: `system.modifiers.rolls.${key}`, type: "add", value: "-2", phase: "initial"}))
          : []},
        flags: {[SCOPE]: {summary: details, fatalMagic: {resultId: message.id, reduction: plan.reduction, depleted: plan.depleted}}}
      }, {keepId: true});
    }
    const applied = effect?.flags?.[SCOPE]?.fatalMagic;
    if (applied?.resultId !== message.id) return false;
    if (applied.depleted && !actor.getFlag(SCOPE, "fatalVitnerLoss")?.[message.id]) {
      // Record the one-time point loss in the same write as the pool change.
      await actor.update({
        "system.resources.vitner.value": storedVitnerForCurrent(actor, Math.min(1, actor.system.resources.vitner.current)),
        [`flags.${SCOPE}.fatalVitnerLoss.${message.id}`]: true
      });
    }
    await message.update({[`flags.${SCOPE}.fatalMagicResult.applied`]: effect.name});
    return true;
  } finally {
    applying.delete(message.id);
  }
}

function renderAreaOutcome(result, content) {
  const summary = document.createElement("p");
  summary.textContent = game.i18n.format("TRUDVANG.FatalMagic.AreaApplied", {radius: result.radius});
  content.append(summary);
  for (const outcome of result.outcomes ?? []) {
    const actor = foundry.utils.fromUuidSync(outcome.actorUuid);
    if (outcome.hidden && !game.user.isGM && !actor?.isOwner) continue;
    const row = document.createElement("p");
    const receipt = game.user.isGM || actor?.isOwner ? actor?.getFlag(SCOPE, "fatalVitnerLoss")?.[result.messageId] : null;
    const key = receipt ? (receipt.resource === "vitner" ? "VitnerDrained" : "HealthDrained") : "Affected";
    row.textContent = game.i18n.format(`TRUDVANG.FatalMagic.${key}`, {...outcome, amount: receipt?.amount});
    content.append(row);
  }
}

export function renderFatalResultAction(message, html) {
  if (!message.isContentVisible) return;
  const divine = message.getFlag(SCOPE, FLAG);
  const result = divine ?? message.getFlag(SCOPE, "fatalMagicResult");
  const content = html.querySelector(".message-content");
  if (!result || !content) return;
  if (!divine && !result.applied && FATAL_MAGIC_ROWS[result.row]?.drain) {
    const note = document.createElement("p");
    const key = FATAL_MAGIC_ROWS[result.row].excludeCaster ? "AreaExceptCaster" : "AreaIncludesCaster";
    note.textContent = game.i18n.localize(`TRUDVANG.FatalMagic.${key}`);
    content.append(note);
  }
  if (result.applied) {
    if (!divine && result.radius) return renderAreaOutcome({...result, messageId: message.id}, content);
    const note = document.createElement("p");
    note.textContent = i18n("Applied", {effect: result.applied});
    content.append(note);
    return;
  }
  if (!result.actorUuid || !(divine ? DIVINE_FAILURE_ROWS[result.row] : FATAL_MAGIC_ROWS[result.row]) || !canApply(message)) return;
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = i18n("Apply");
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await (divine ? applyDivineFailure(message) : applyFatalMagic(message));
    } catch (error) {
      console.error("Trudvang Chronicles | Fatal table consequence application failed", error);
      ui.notifications.warn(i18n("ApplyFailed"));
    } finally {
      button.disabled = false;
    }
  });
  content.append(button);
}
