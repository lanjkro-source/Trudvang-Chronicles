import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {ruleTestCastingContext,ruleTestSourceId} from "./rules/magic-resistance.mjs";

/** Resolve damage from the selected power-level snapshot of this casting. */
export function magicDamageProfile(document,context) {
  const id=ruleTestSourceId(document),definition=POWER_DETAILS_BY_ID[id]?.damageRoll;
  if(!definition)return null;
  const casting=ruleTestCastingContext(document,{context});
  const index=definition.optionId ? (POWER_DETAILS_BY_ID[id]?.powerLevels??[]).findIndex(option=>option.id===definition.optionId) : -1;
  const count=definition.optionId ? Math.max(0,Math.trunc(Number(casting.countsById?.[definition.optionId] ?? (index>=0?casting.counts?.[index]:0))||0)) : 0;
  return {...definition.steps[Math.min(count,definition.steps.length-1)]};
}

/** Use the same confirmation and target application card as weapon damage. */
export async function rollMagicDamage({document,actor,context,targets}={}) {
  if(!actor?.isOwner)return null;
  const damage=magicDamageProfile(document,context);if(!damage)return null;
  const item={name:document.name,img:document.img,system:{category:"magic",damage:damage.formula,openRoll:damage.openRoll,damageBonus:0,strengthApplies:false}};
  const {rollDamage}=await import("./dice.mjs");
  return rollDamage({actor,item,context:{usage:"magic",targets}});
}
