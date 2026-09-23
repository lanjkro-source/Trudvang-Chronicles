import { TRUDVANG } from "./config.mjs";
import { escapeHtml, renderTemplate } from "./helpers.mjs";

const STAGES = [
  {id: "mild", maximum: 5, next: ""},
  {id: "moderate", maximum: 10, next: "mild"},
  {id: "strong", maximum: 15, next: "moderate"},
  {id: "total", maximum: Infinity, next: "strong"}
];

function stageFor(result) {
  return STAGES.find(stage => result <= stage.maximum) ?? STAGES.at(-1);
}

function traitValue(actor, traitKey) {
  return Number(actor.getTraitValue?.(traitKey) ?? actor.system?.effective?.traits?.[traitKey] ?? actor.system?.traits?.[traitKey] ?? 0);
}

async function resolveDuration(duration) {
  const text = String(duration || "");
  const formula = text.match(/\b\d+d\d+\b/i)?.[0];
  if (!formula) return {label: text, roll: null};
  const roll = await new Roll(formula).evaluate();
  return {label: text.replace(formula, String(roll.total)), roll};
}

/** Resolve the effect level of an extract for an actor. */
export async function useExtract(item, actor) {
  if (!item || item.type !== "potion" || !actor) return;
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const traits = Object.entries(TRUDVANG.traits).map(([id, label]) => ({id, label: game.i18n.localize(label)}));
  const traitOptions = traits.map(trait => `<option value="${escapeHtml(trait.id)}" ${trait.id === "constitution" ? "selected" : ""}>${escapeHtml(trait.label)} (${traitValue(actor, trait.id) >= 0 ? "+" : ""}${traitValue(actor, trait.id)})</option>`).join("");
  const traitKey = await DialogClass.wait({
    window: {title: game.i18n.format("TRUDVANG.Extract.UseTitle", {item: item.name, actor: actor.name})},
    content: `<div class="trudvang roll-dialog"><p>${escapeHtml(game.i18n.format("TRUDVANG.Extract.UsePrompt", {strength: Number(item.system.strength || 0)}))}</p><div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Extract.Trait"))}</label><select name="trait">${traitOptions}</select></div></div>`,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => (button.form ?? dialog.element).querySelector("[name=trait]")?.value || "constitution"},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
  if (traitKey === false || traitKey === null || traitKey === undefined) return;
  const dieRoll = await new Roll("1d20").evaluate();
  const strength = Number(item.system.strength || 0);
  const modifier = traitValue(actor, traitKey);
  const result = Number(dieRoll.total) + strength - modifier;
  const stage = stageFor(result);
  const duration = await resolveDuration(item.system.duration);
  const stageLabel = game.i18n.localize(`TRUDVANG.Efficacy.${stage.id[0].toUpperCase()}${stage.id.slice(1)}`).toLocaleLowerCase(game.i18n.lang);
  const nextStageLabel = stage.next ? game.i18n.localize(`TRUDVANG.Efficacy.${stage.next[0].toUpperCase()}${stage.next.slice(1)}`).toLocaleLowerCase(game.i18n.lang) : "";
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
