import { escapeHtml, renderTemplate } from "./helpers.mjs";

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
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/package-roll-card.hbs", {
    itemName: item.name,
    itemImg: item.img,
    result,
    target,
    modifier: Number(modifier) || 0,
    success
  });
  await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: item.parent}), content, rolls: [roll]});
}
