import {openDice, damageRollDialog, requestTraitSituationRoll} from "./dice.mjs";
import {escapeHtml, renderTemplate} from "./helpers.mjs";
import {prepareDamageTargets} from "./damage-application.mjs";

/** Standalone rolls retain the normal chat-card application controls. */
export async function rollGenericImpact(kind = "damage", {actor: requestedActor, title: requestedTitle, dice=1, faces=10, threshold=0, modifier=0, notice=""} = {}) {
  if(kind!=="fear")return rollStandaloneDamage({actor:requestedActor,title:requestedTitle,dice,faces,threshold,modifier});
  const fear = true;
  const localize = key => game.i18n.localize(key);
  const title = requestedTitle || localize(`TRUDVANG.Macro.${fear ? "FearRoll" : "DamageRoll"}`);
  const actor = requestedActor ?? globalThis.canvas?.tokens?.controlled?.[0]?.actor ?? game.user.character;
  const field = (name, label, input) => `<div class="form-group"><label>${escapeHtml(localize(label))}</label>${input}</div>`;
  const choice = await foundry.applications.api.DialogV2.wait({
    window: {title}, classes: ["dialog", "trudvang"],
    content: `<div class="trudvang roll-dialog">
      ${notice?`<p class="rule-test-notes">${escapeHtml(notice)}</p>`:""}
      ${field("title", "TRUDVANG.Dialog.SituationLabel", `<input name="title" value="${escapeHtml(title)}">`)}
      ${field("dice", "TRUDVANG.Macro.DiceCount", `<input name="dice" type="number" min="1" step="1" value="${Number(dice)}" required>`)}
      ${field("faces", "TRUDVANG.Macro.DieType", `<select name="faces">${[3,4,5,6,10].map(n => `<option value="${n}" ${n === Number(faces) ? "selected" : ""}>D${n}</option>`).join("")}</select>`)}
      ${field("threshold", "TRUDVANG.Field.OpenRoll", `<input name="threshold" type="number" min="0" step="1" value="${Number(threshold)}" required>`)}
      ${field("bonus", "TRUDVANG.Field.Bonus", `<input name="bonus" type="number" step="1" value="${Number(modifier)}" required>`)}
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
  const rolled = await openDice(choice);
  const total = Math.max(0, rolled.total);
  const factor = `${choice.dice}d${choice.faces}${choice.threshold ? ` ${localize("TRUDVANG.Roll.OpenRoll")} ${choice.threshold}+` : ""}`;
  const detail = `${rolled.rolls.join(" + ")}${choice.modifier ? ` ${choice.modifier > 0 ? "+" : "−"} ${Math.abs(choice.modifier)}` : ""}`;
  const targets = prepareDamageTargets(game.user.targets);
  const targetsHTML = fear ? "" : await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-targets.hbs", {total, targets});
  const content = await renderTemplate(`systems/trudvang-chronicles/templates/chat/${fear ? "fear" : "damage"}-card.hbs`, {
    actorName: actor?.name ?? game.user.name, actorImg: actor?.img ?? game.user.avatar,
    modifierDetails: notice?[notice]:[], title: choice.title, itemName: choice.title, itemImg: "icons/svg/d20.svg", total, detail: fear ? detail : `${factor} : ${detail}`, factor, targetsHTML
  });
  await ChatMessage.create({speaker: actor ? ChatMessage.getSpeaker({actor}) : ChatMessage.getSpeaker(), content,
    rolls: rolled.diceRolls, flags: {"trudvang-chronicles": fear ? {} : {damageTargets: targets,damageContext:{usage:choice.damageUsage,magicalWeapon:choice.magicalWeapon}}}});
  return rolled;
}

export const rollGenericDamage = () => rollGenericImpact("damage");
export const rollGenericFear = options => rollGenericImpact("fear",options);
export const requestGenericSituationRoll = () => requestTraitSituationRoll({generic: true});

/** Generic damage shares the weapon confirmation without importing actor bonuses. */
async function rollStandaloneDamage({actor:requestedActor,title:requestedTitle,dice,faces,threshold,modifier}){
 const title=requestedTitle||game.i18n.localize('TRUDVANG.Macro.DamageRoll');
 const actor=requestedActor??globalThis.canvas?.tokens?.controlled?.[0]?.actor??game.user.character;
 const profile={generic:true,title,allowZeroDice:true,editableFaces:true,parsed:{dice:Number(dice),faces:Number(faces)},formula: dice+'d'+faces,openRoll:Number(threshold),fixedModifier:0,situational:Number(modifier),rows:[],weaponHit:true,ranged:false,minimumTotal:0};
 const choice=await damageRollDialog({item:{name:title},profile});if(!choice)return null;
 const rolled=await openDice({dice:choice.dice,faces:choice.faces,threshold:choice.openRoll,modifier:choice.fixedModifier});
 const total=Math.max(0,rolled.total),targets=prepareDamageTargets(game.user.targets);
 const factor=choice.dice?choice.dice+'d'+choice.faces+(choice.openRoll?' '+game.i18n.localize('TRUDVANG.Roll.OpenRoll')+' '+choice.openRoll+'+':''):'';
 const detail=choice.dice?factor+' : '+rolled.rolls.join(' + ')+(choice.fixedModifier?' '+(choice.fixedModifier>0?'+':'−')+' '+Math.abs(choice.fixedModifier):''):String(choice.fixedModifier);
 const targetsHTML=await renderTemplate('systems/trudvang-chronicles/templates/chat/damage-targets.hbs',{total,targets});
 const content=await renderTemplate('systems/trudvang-chronicles/templates/chat/damage-card.hbs',{actorName:actor?.name??game.user.name,actorImg:actor?.img??game.user.avatar,itemName:choice.title,itemImg:'icons/svg/d20.svg',total,detail,targetsHTML,modifierDetails:choice.magicalWeapon?[game.i18n.localize('TRUDVANG.DamageRoll.MagicalWeapon')]:[]});
 await ChatMessage.create({speaker:actor?ChatMessage.getSpeaker({actor}):ChatMessage.getSpeaker(),content,rolls:rolled.diceRolls,flags:{'trudvang-chronicles':{damageTargets:targets,damageContext:{usage:choice.damageUsage,magicalWeapon:choice.magicalWeapon}}}});
 return rolled;
}
