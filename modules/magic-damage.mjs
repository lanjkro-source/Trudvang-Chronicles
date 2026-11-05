import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {ruleTestCastingContext,ruleTestSourceId} from "./rules/magic-resistance.mjs";

/** Resolve damage from the selected power-level snapshot of this casting. */
export function magicDamageProfile(document,context) {
  const id=ruleTestSourceId(document),definition=POWER_DETAILS_BY_ID[id]?.damageRoll;
  if(!definition)return null;
  const casting=ruleTestCastingContext(document,{context});
  const index=definition.optionId ? (POWER_DETAILS_BY_ID[id]?.powerLevels??[]).findIndex(option=>option.id===definition.optionId) : -1;
  const count=definition.optionId ? Math.max(0,Math.trunc(Number(casting.countsById?.[definition.optionId] ?? (index>=0?casting.counts?.[index]:0))||0)) : 0;
  const step={...definition.steps[Math.min(count,definition.steps.length-1)]};
  if(definition.scaling){
    const scaling=definition.scaling;
    const scalingIndex=(POWER_DETAILS_BY_ID[id]?.powerLevels??[]).findIndex(option=>option.id===scaling.optionId);
    const levels=Math.max(0,Math.trunc(Number(casting.countsById?.[scaling.optionId]??casting.counts?.[scalingIndex])||0));
    const parts=step.formula.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i);
    const dice=Number(parts[1])+levels*(scaling.dice??0);
    const bonus=Number(parts[3]??0)+levels*(scaling.modifier??0);
    step.formula=`${dice}d${parts[2]}${bonus?` + ${bonus}`:''}`;
  }
  return {...step, qualification:definition.qualification};
}

/** Use the same confirmation and target application card as weapon damage. */
export async function rollMagicDamage({document,actor,context,targets}={}) {
  if(!actor?.isOwner)return null;
  const damage=magicDamageProfile(document,context);if(!damage)return null;
  const item={name:document.name,img:document.img,system:{category:"magic",damage:damage.formula,openRoll:damage.openRoll,damageBonus:0,strengthApplies:false,damageQualification:document.system?.damageQualification ?? damage.qualification}};
  const {rollDamage}=await import("./dice.mjs");
  const base=POWER_DETAILS_BY_ID[ruleTestSourceId(document)].damageRoll.steps[0];
  const definition=POWER_DETAILS_BY_ID[ruleTestSourceId(document)].damageRoll;
  const damageExplanations=base.formula!==damage.formula||base.openRoll!==damage.openRoll
    ? [{labelKey:"TRUDVANG.Power.Levels",value:`${base.formula} → ${damage.formula}`,source:base.openRoll!==damage.openRoll?`${game.i18n.localize("TRUDVANG.DamageRoll.OpenRoll")} : ${base.openRoll} → ${damage.openRoll}`:""}]:[];
  if(definition.targetTags?.length)damageExplanations.push({labelKey:"TRUDVANG.Damage.TargetRestriction",value:game.i18n.localize(definition.targetLabelKey)});
  return rollDamage({actor,item,context:{usage:"magic",targets,targetTags:definition.targetTags,damageExplanations,qualification:document.system?.damageQualification ?? damage.qualification,qualificationNote:document.system?.damageQualificationNote}});
}
