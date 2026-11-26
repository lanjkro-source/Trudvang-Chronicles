import { escapeHtml } from "./helpers.mjs";
import {createActorRollMessage,isNpcRoll,renderRollCard} from "./chat-roll-privacy.mjs";

/** Open and resolve a package availability check from a sheet or chat message. */
export async function rollPackageAvailability(item, situationValue) {
  if (!item || !Number.isFinite(situationValue)) return;
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const modifier = await DialogClass.wait({
    window: {title: game.i18n.format("TRUDVANG.Content.PackageRoll.Title", {item: item.name})},
    content: `<div class="trudvang roll-dialog"><p>${escapeHtml(game.i18n.format("TRUDVANG.Content.PackageRoll.Prompt", {sv: situationValue}))}</p><div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.SituationalModifier"))}</label><input name="situational" type="number" value="0"></div></div>`,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => Number((button.form ?? dialog.element).querySelector("[name=situational]")?.value || 0)},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
  if (modifier === false || modifier === null || modifier === undefined) return;
  const target = situationValue + (Number(modifier) || 0);
  const roll = await new Roll("1d20").evaluate();
  const result = Number(roll.total);
  const success = result === 1 || (result !== 20 && result <= target);
  const view = {
    itemName: item.name,
    itemImg: item.img,
    result,
    target,
    modifier: Number(modifier) || 0,
    success
  };
  const actor = item.actor;
  await createActorRollMessage(actor,{speaker:ChatMessage.getSpeaker({actor}),content:await renderRollCard("package-roll-card",view),rolls:[roll]},
    {resultContent:isNpcRoll(actor)?await renderRollCard("package-roll-card",view,{resultOnly:true}):undefined});
}
