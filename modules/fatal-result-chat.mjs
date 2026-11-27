import {npcRollDetailMarker} from "./chat-roll-privacy.mjs";
import {escapeHtml, escapeAttribute} from "./helpers.mjs";
import {DIVINE_FAILURE_ROWS, divineFailurePowers, planDivineFailure} from "./rules/divine-failure.mjs";
import {normalizeEffectDuration} from "./rules/effect-duration.mjs";
import {FATAL_MAGIC_ROWS, fatalMagicHasArea, planFatalMagic, storedVitnerForCurrent} from "./rules/fatal-magic.mjs";
import {requestFatalVitnerArea} from "./chat-application.mjs";
import {applyFatalMedical, askFatalSpellCost} from "./fatal-medical.mjs";
import {zoneAction, zoneOutcome, zoneTargetList} from "./zone-chat.mjs";
import {zoneDamageReceipt} from "./zone-damage.mjs";

const SCOPE = "trudvang-chronicles";
const FLAG = "divineFailureResult";
const i18n = (key, data) => data
  ? game.i18n.format(`TRUDVANG.DivineFailure.${key}`, data)
  : game.i18n.localize(`TRUDVANG.DivineFailure.${key}`);
const canApply = message => message.isContentVisible && (game.user.isGM || message.isAuthor);
const applying = new Set();
const roll = async formula => Number((await new Roll(formula).evaluate()).total);
const areaWarnings = {
  noOrigin: "TRUDVANG.FatalMagic.NoOrigin",
  invalidResult: "TRUDVANG.FatalMagic.InvalidResult"
};

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
  if (rule.portal) {
    const response = await requestFatalVitnerArea(message);
    if (["applied", "alreadyApplied"].includes(response.status)) return true;
    ui.notifications.warn(game.i18n.localize(areaWarnings[response.status] ?? "TRUDVANG.FatalMagic.AreaUnavailable"));
    return false;
  }
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
  if (rule.enclosure) {
    const pulse = Boolean(result.enclosure);
    const cost = pulse ? undefined : result.cost ?? await askFatalSpellCost();
    if (!pulse && (!Number.isInteger(cost) || cost < 0)) return false;
    const response = await requestFatalVitnerArea(message, {pulse, cost, sequence: result.enclosure?.sequence});
    if (["applied", "alreadyApplied"].includes(response.status)) return true;
    ui.notifications.warn(game.i18n.localize(areaWarnings[response.status] ?? "TRUDVANG.FatalMagic.AreaUnavailable"));
    return false;
  }
  if (fatalMagicHasArea(rule)) {
    const cost = rule.burst?.costDamage && result.preview ? result.cost ?? await askFatalSpellCost() : undefined;
    if (rule.burst?.costDamage && result.preview && (!Number.isInteger(cost) || cost < 0)) return false;
    const response = await requestFatalVitnerArea(message, {prepareOnly: !result.preview, cost});
    if (["prepared", "applied", "alreadyApplied"].includes(response.status)) return true;
    ui.notifications.warn(game.i18n.localize(areaWarnings[response.status] ?? "TRUDVANG.FatalMagic.AreaUnavailable"));
    return false;
  }
  applying.add(message.id);
  try {
    const actor = await foundry.utils.fromUuid(result.actorUuid);
    if (!actor?.isOwner) return false;
    if (rule.medical) return await applyFatalMedical(actor, message, result);
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

function areaDetails(result, message, row) {
  const actor = foundry.utils.fromUuidSync(row.actorUuid);
  const own = game.user.isGM || actor?.isOwner;
  const receipt = own ? actor?.getFlag(SCOPE, "fatalVitnerLoss")?.[message.id] : null;
  const damage = own ? zoneDamageReceipt(actor, message.id, row.pulse ?? 0) : null;
  const amount = damage?.amount ?? (receipt?.resource ? receipt.amount : null);
  const resource = receipt?.resource === "vitner" ? "VitnerLoss" : "HealthLoss";
  const additionalVitner = own && result.row === 51 && row.actorUuid === result.actorUuid
    ? actor?.getFlag(SCOPE, "fatalRecoveryLoss")?.[message.id]?.amount : receipt?.lostVitner;
  const consequence = (amount == null ? "" : zoneOutcome(game.i18n.format(`TRUDVANG.AreaChat.${resource}`, {amount})))
    + (damage?.temporary ? zoneOutcome(game.i18n.format("TRUDVANG.AreaChat.TemporaryHealthLoss", {amount: damage.temporary})) : "")
    + npcRollDetailMarker(damage?.detailId)
    + (additionalVitner > 0 ? zoneOutcome(game.i18n.format("TRUDVANG.AreaChat.VitnerLoss", {amount: additionalVitner})) : "");
  if (result.row !== 53) return consequence + (row.consequenceKeys?.map(key => zoneOutcome(game.i18n.localize(key))).join("")
    || (!consequence ? zoneOutcome(game.i18n.localize("TRUDVANG.AreaChat.Affected")) : ""));
  const flash = actor?.getFlag(SCOPE, "fatalFlash")?.[message.id];
  const key = encodeURIComponent(row.actorUuid).replaceAll(".", "%2E");
  const resisted = result.flashResults?.[key] ?? flash?.success;
  if (typeof resisted === "boolean") return consequence + zoneOutcome(game.i18n.localize(
    resisted ? "TRUDVANG.AreaChat.Resisted" : "TRUDVANG.AreaChat.Blinded"
  ), resisted) + npcRollDetailMarker(result.flashRollDetails?.[key]);
  const effectUuid = flash?.effectUuid ?? actor?.effects.get(message.id)?.uuid;
  if (!own || !effectUuid) return consequence + zoneOutcome(game.i18n.localize("TRUDVANG.AreaChat.PendingResistance"));
  return consequence + zoneAction(game.i18n.localize("TRUDVANG.AreaChat.Resist"), {
    action: "roll-rule-test", "rule-document-uuid": effectUuid, "test-index": 0
  });
}

function renderAreaRows(message, result, content) {
  const enclosure = result.enclosure;
  const pending = enclosure?.targets ?? result.preview?.targets ?? [];
  const outcomes = enclosure?.outcomes ?? (result.applied ? result.outcomes : null) ?? [];
  const rows = [
    ...pending.filter(row => !result.applied).map(row => ({...row, pending: true})),
    ...outcomes.filter(row => !pending.some(target => !result.applied && (target.actorUuid || target.tokenUuid) === (row.actorUuid || row.tokenUuid)))
  ].filter(row => !row.hidden || game.user.isGM || foundry.utils.fromUuidSync(row.actorUuid)?.isOwner);
  content.insertAdjacentHTML("beforeend", zoneTargetList(rows, row => row.pending ? "" : areaDetails(result, message, row)));
}

export function renderFatalResultAction(message, html) {
  if (!message.isContentVisible) return;
  const divine = message.getFlag(SCOPE, FLAG);
  const result = divine ?? message.getFlag(SCOPE, "fatalMagicResult");
  const content = html.querySelector(".message-content");
  if (!result || !content) return;
  const rule = !divine && FATAL_MAGIC_ROWS[result.row];
  if (rule?.enclosure && result.enclosure) {
    const summary = document.createElement("p");
    summary.textContent = result.enclosure.live
      ? game.i18n.format("TRUDVANG.FatalMagic.EnclosureStatus", result.enclosure)
      : game.i18n.localize("TRUDVANG.FatalMagic.EnclosureEnded");
    content.append(summary);
    if (rule.enclosure.automatic || !result.enclosure.live || !result.enclosure.pending) {
      renderAreaRows(message, result, content);
      return;
    }
  }
  if (!result.applied && fatalMagicHasArea(rule)) {
    const note = document.createElement("p");
    const key = rule.orb ? "OrbRule" : rule.burst ? "BurstRule"
      : rule.negation ? "ThirdLost" : rule.excludeCaster ? "AreaExceptCaster" : "AreaIncludesCaster";
    note.textContent = game.i18n.localize(`TRUDVANG.FatalMagic.${key}`);
    content.append(note);
    if (result.preview) {
      const summary = document.createElement("p");
      if (result.preview.radius) {
        const areaKey = rule.orb ? result.preview.inner < result.preview.radius
          ? "OrbBands" : "OrbRadius" : "AreaPending";
        summary.textContent = game.i18n.format(`TRUDVANG.FatalMagic.${areaKey}`, result.preview);
        content.append(summary);
      }
      if (rule.orb && result.preview.remaining > 0) {
        const countdown = document.createElement("p");
        countdown.textContent = game.i18n.format("TRUDVANG.FatalMagic.OrbCountdown", result.preview);
        content.append(countdown);
        return;
      }
    }
  }
  if (result.applied) {
    if (fatalMagicHasArea(rule)) {
      renderAreaRows(message, result, content);
      if (!rule.orb) return;
    }
    const note = document.createElement("p");
    note.textContent = i18n("Applied", {effect: result.applied});
    content.append(note);
    return;
  }
  if (!result.actorUuid || !(divine ? DIVINE_FAILURE_ROWS[result.row] : FATAL_MAGIC_ROWS[result.row]) || !canApply(message)) {
    if (fatalMagicHasArea(rule) || result.enclosure) renderAreaRows(message, result, content);
    return;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = rule?.orb ? game.i18n.localize(`TRUDVANG.FatalMagic.${result.preview ? "OrbDetonate" : "StartOrb"}`)
    : rule?.enclosure ? game.i18n.localize(result.enclosure
    ? "TRUDVANG.FatalMagic.Discharge" : "TRUDVANG.FatalMagic.CreateEnclosure") : fatalMagicHasArea(rule) && !result.preview
    ? game.i18n.localize("TRUDVANG.FatalMagic.ShowArea")
    : fatalMagicHasArea(rule) ? game.i18n.localize("TRUDVANG.AreaChat.Apply") : i18n("Apply");
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
  if (fatalMagicHasArea(rule) || result.enclosure) renderAreaRows(message, result, content);
}
