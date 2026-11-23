import {TRUDVANG} from "./config.mjs";
import {normalizeEffectDuration} from "./rules/effect-duration.mjs";
import {fatalBodyLossUpdates} from "./rules/fatal-body-loss.mjs";
import {planFatalMedical, storedVitnerForCurrent} from "./rules/fatal-magic.mjs";

const SCOPE = "trudvang-chronicles";
const RESULT = `flags.${SCOPE}.fatalMagicResult`;
const local = key => game.i18n.localize(`TRUDVANG.FatalMagic.${key}`);
const labels = {amnesia: "Amnesia", unconscious: "Unconscious", coma: "Coma"};
const roll = async formula => Number((await new Roll(formula).evaluate()).total);

export const lowerIntelligence = value => TRUDVANG.traitChoices.findLast(choice => choice < Number(value)) ?? Number(value);

export async function askFatalSpellCost() {
  return foundry.applications.api.DialogV2.wait({
    window: {title: game.i18n.localize("TRUDVANG.Dialog.FatalCost")},
    content: `<div class="trudvang roll-dialog"><label>${game.i18n.localize("TRUDVANG.Dialog.FatalCost")} <input type="number" name="cost" min="0" step="1" required></label></div>`,
    buttons: [
      {action: "apply", default: true, label: game.i18n.localize("TRUDVANG.DivineFailure.Apply"),
        callback: (_event, button, dialog) => {
          const value = (button.form ?? dialog.element).querySelector('[name="cost"]')?.value;
          return value?.trim() ? Number(value) : null;
        }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => null}
    ],
    rejectClose: false
  });
}

async function ensureMedicalEffect(actor, message, {condition, duration, depleted}) {
  const role = depleted ? "depletion" : condition;
  const stackId = `fatal-magic:${message.id}:${role}`;
  const existing = Array.from(actor.effects.values()).find(effect => effect.system?.stackId === stackId);
  if (existing) return existing;
  const name = local(depleted ? "Depletion" : labels[condition]);
  const description = local(depleted ? "NoRecovery" : condition === "amnesia" ? "AmnesiaRule" : "UnconsciousRule");
  return actor.createTrudvangEffect({
    name, img: "icons/svg/daze.svg", description,
    ...(condition && condition !== "amnesia" ? {statuses: ["unconscious"]} : {}),
    duration: normalizeEffectDuration(duration),
    system: {stackId, changes: []},
    flags: {[SCOPE]: {summary: description, fatalMagic: {resultId: message.id, depleted, amnesia: condition === "amnesia"}}}
  });
}

export async function applyFatalMedical(actor, message, result) {
  let plan = result.medical;
  if (!plan) {
    const cost = result.row === 52 ? result.cost ?? await askFatalSpellCost() : undefined;
    plan = await planFatalMedical(result.row, roll, cost);
    if (!plan) return false;
    await message.update({[`${RESULT}.medical`]: plan});
  }

  if (!await commitFatalMedical(actor, message, plan)) return false;
  const descriptions = [
    ...(plan.condition ? [local(labels[plan.condition])] : []),
    ...(plan.damage ? [game.i18n.format("TRUDVANG.FatalMagic.MedicalDamage", {points: plan.damage})] : []),
    ...(plan.intellect ? [local("IntellectLost")] : []),
    ...(plan.depletionDays ? [local("Depletion")] : [])
  ];
  await message.update({[`${RESULT}.applied`]: descriptions.join(" · ")});
  return true;
}

export async function commitFatalMedical(actor, message, plan) {
  const receipt = actor.getFlag(SCOPE, "fatalVitnerLoss")?.[message.id];
  if (!receipt) {
    if (plan.condition && !await ensureMedicalEffect(actor, message, plan)) return false;
    if (plan.depletionDays && !await ensureMedicalEffect(actor, message, {depleted: true,
      duration: {value: plan.depletionDays, units: "days"}})) return false;
    const intelligence = actor._source.system.traits?.intelligence ?? 0;
    const current = actor._source.system.traitCurrent?.intelligence;
    const updates = {
      ...fatalBodyLossUpdates(actor, plan.damage),
      ...(plan.depletionDays ? {"system.resources.vitner.value": storedVitnerForCurrent(actor,
        Math.min(1, actor.system.resources.vitner.current))} : {}),
      ...(plan.intellect ? {
        "system.traits.intelligence": lowerIntelligence(intelligence),
        ...(current == null ? {} : {"system.traitCurrent.intelligence": lowerIntelligence(current)})
      } : {}),
      [`flags.${SCOPE}.fatalVitnerLoss.${message.id}`]: true
    };
    await actor.update(updates);
  }
  return true;
}
