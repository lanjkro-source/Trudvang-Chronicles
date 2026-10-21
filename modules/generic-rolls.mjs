import {openDice, requestTraitSituationRoll} from "./dice.mjs";
import {escapeHtml, renderTemplate} from "./helpers.mjs";
import {prepareDamageTargets} from "./damage-application.mjs";

/** Standalone rolls retain the normal chat-card application controls. */
export async function rollGenericImpact(kind = "damage") {
  const fear = kind === "fear";
  const localize = key => game.i18n.localize(key);
  const title = localize(`TRUDVANG.Macro.${fear ? "FearRoll" : "DamageRoll"}`);
  const field = (name, label, input) => `<div class="form-group"><label>${escapeHtml(localize(label))}</label>${input}</div>`;
  const choice = await foundry.applications.api.DialogV2.wait({
    window: {title}, classes: ["dialog", "trudvang"],
    content: `<div class="trudvang roll-dialog">
      ${field("title", "TRUDVANG.Dialog.SituationLabel", `<input name="title" value="${escapeHtml(title)}">`)}
      ${field("dice", "TRUDVANG.Macro.DiceCount", '<input name="dice" type="number" min="1" step="1" value="1" required>')}
      ${field("faces", "TRUDVANG.Macro.DieType", `<select name="faces">${[3,4,5,6,10].map(n => `<option value="${n}" ${n === 10 ? "selected" : ""}>D${n}</option>`).join("")}</select>`)}
      ${field("threshold", "TRUDVANG.Field.OpenRoll", '<input name="threshold" type="number" min="0" step="1" value="0" required>')}
      ${field("bonus", "TRUDVANG.Field.Bonus", '<input name="bonus" type="number" step="1" value="0" required>')}
    </div>`,
    buttons: [{action: "roll", label: localize("TRUDVANG.Action.Roll"), default: true,
      callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        const value = name => root.querySelector(`[name="${name}"]`).value;
        const result = {title: value("title").trim() || title, dice: Number(value("dice")), faces: Number(value("faces")), threshold: Number(value("threshold")), modifier: Number(value("bonus"))};
        if (!Number.isInteger(result.dice) || result.dice < 1 || ![3,4,5,6,10].includes(result.faces)
          || !Number.isInteger(result.threshold) || (result.threshold !== 0 && (result.threshold < 2 || result.threshold > result.faces))
          || !Number.isInteger(result.modifier)) {
          ui.notifications.warn(localize("TRUDVANG.Macro.InvalidDice"));
          return false;
        }
        return result;
      }}, {action: "cancel", label: localize("TRUDVANG.Action.Cancel"), callback: () => false}],
    rejectClose: false, modal: false
  });
  if (!choice || typeof choice !== "object") return null;
  const actor = globalThis.canvas?.tokens?.controlled?.[0]?.actor ?? game.user.character;
  const rolled = await openDice(choice);
  const total = Math.max(0, rolled.total);
  const factor = `${choice.dice}d${choice.faces}${choice.threshold ? ` ${localize("TRUDVANG.Roll.OpenRoll")} ${choice.threshold}+` : ""}`;
  const detail = `${rolled.rolls.join(" + ")}${choice.modifier ? ` ${choice.modifier > 0 ? "+" : "−"} ${Math.abs(choice.modifier)}` : ""}`;
  const targets = prepareDamageTargets(game.user.targets);
  const targetsHTML = fear ? "" : await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-targets.hbs", {total, targets});
  const content = await renderTemplate(`systems/trudvang-chronicles/templates/chat/${fear ? "fear" : "damage"}-card.hbs`, {
    actorName: actor?.name ?? game.user.name, actorImg: actor?.img ?? game.user.avatar,
    title: choice.title, itemName: choice.title, itemImg: "icons/svg/d20.svg", total, detail: fear ? detail : `${factor} : ${detail}`, factor, targetsHTML
  });
  await ChatMessage.create({speaker: actor ? ChatMessage.getSpeaker({actor}) : ChatMessage.getSpeaker(), content,
    rolls: rolled.diceRolls, flags: {"trudvang-chronicles": fear ? {} : {damageTargets: targets}}});
  return rolled;
}

export const rollGenericDamage = () => rollGenericImpact("damage");
export const rollGenericFear = () => rollGenericImpact("fear");
export const requestGenericSituationRoll = () => requestTraitSituationRoll({generic: true});
