import { TRUDVANG } from "./config.mjs";
import { escapeHtml, renderTemplate } from "./helpers.mjs";

const STAGES = [
  {id: "mild", maximum: 5, next: ""},
  {id: "moderate", maximum: 10, next: "mild"},
  {id: "strong", maximum: 15, next: "moderate"},
  {id: "total", maximum: Infinity, next: "strong"}
];

export function stageLabelFor(stage) {
  return game.i18n.localize(`TRUDVANG.Efficacy.${stage.id[0].toUpperCase()}${stage.id.slice(1)}`).toLocaleLowerCase(game.i18n.lang);
}

export function stageFor(result) {
  return STAGES.find(stage => result <= stage.maximum) ?? STAGES.at(-1);
}

export function traitValue(actor, traitKey) {
  return Number(actor.getTraitValue?.(traitKey) ?? actor.system?.effective?.traits?.[traitKey] ?? actor.system?.traits?.[traitKey] ?? 0);
}

async function resolveDuration(duration) {
  const text = String(duration || "");
  const formula = text.match(/\b\d+d\d+\b/i)?.[0];
  if (!formula) return {label: text, roll: null};
  const roll = await new Roll(formula).evaluate();
  return {label: text.replace(formula, String(roll.total)), roll};
}

/**
 * Shared drink-style prompt: trait select (+ editable extract-strength input
 * for the Divers table path). Returns `{traitKey, strength}` or `null` when
 * the user cancels/closes. Missing `TRUDVANG.Extract.StrengthLabel` falls back
 * to the closest existing key (`TRUDVANG.Field.Strength`) — reported by the
 * caller, never invented inline.
 */
export async function promptExtractStageRoll({actor = null, strength = 0, strengthEditable = false, title, prompt} = {}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const traits = Object.entries(TRUDVANG.traits).map(([id, label]) => ({id, label: game.i18n.localize(label)}));
  const modifierOf = trait => actor ? traitValue(actor, trait.id) : 0;
  const traitOptions = traits.map(trait => `<option value="${escapeHtml(trait.id)}" ${trait.id === "constitution" ? "selected" : ""}>${escapeHtml(trait.label)} (${modifierOf(trait) >= 0 ? "+" : ""}${modifierOf(trait)})</option>`).join("");
  const strengthLabel = game.i18n.has?.("TRUDVANG.Extract.StrengthLabel")
    ? game.i18n.localize("TRUDVANG.Extract.StrengthLabel")
    : game.i18n.localize("TRUDVANG.Field.Strength");
  const strengthRow = strengthEditable
    ? `<div class="form-group"><label>${escapeHtml(strengthLabel)}</label><input name="strength" type="number" value="${Number(strength) || 0}"></div>`
    : "";
  const promptRow = prompt ? `<p>${escapeHtml(prompt)}</p>` : "";
  const choice = await DialogClass.wait({
    window: {title},
    content: `<div class="trudvang roll-dialog">${promptRow}${strengthRow}<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Extract.Trait"))}</label><select name="trait">${traitOptions}</select></div></div>`,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        return {
          traitKey: root.querySelector("[name=trait]")?.value || "constitution",
          strength: strengthEditable ? Number(root.querySelector("[name=strength]")?.value || 0) : Number(strength || 0)
        };
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
  if (choice === false || choice === null || choice === undefined) return null;
  return choice;
}

/** Resolve the effect level of an extract for an actor. */
export async function useExtract(item, actor) {
  if (!item || item.type !== "potion" || !actor) return;
  const strength = Number(item.system.strength || 0);
  const choice = await promptExtractStageRoll({
    actor,
    strength,
    strengthEditable: false,
    title: game.i18n.format("TRUDVANG.Extract.UseTitle", {item: item.name, actor: actor.name}),
    prompt: game.i18n.format("TRUDVANG.Extract.UsePrompt", {strength})
  });
  if (!choice) return;
  const traitKey = choice.traitKey;
  const dieRoll = await new Roll("1d20").evaluate();
  const modifier = traitValue(actor, traitKey);
  const result = Number(dieRoll.total) + strength - modifier;
  const stage = stageFor(result);
  const duration = await resolveDuration(item.system.duration);
  const stageLabel = stageLabelFor(stage);
  const nextStageLabel = stage.next ? stageLabelFor(STAGES.find(entry => entry.id === stage.next) ?? stage) : "";
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/extract-use-card.hbs", {
    itemName: item.name,
    itemImg: item.img,
    actorName: actor.name,
    die: Number(dieRoll.total),
    strength,
    traitName: game.i18n.localize(TRUDVANG.traits[traitKey]),
    traitModifier: modifier,
    result,
    stageLabel,
    stageEffect: item.system.efficacy?.[stage.id] || "",
    duration: duration.label || game.i18n.localize("TRUDVANG.Extract.UnknownDuration"),
    nextStageLabel,
    ends: !stage.next
  });
  await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content, rolls: [dieRoll, ...(duration.roll ? [duration.roll] : [])]});
}
