import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {ruleTestCastingContext,ruleTestSourceId} from './rules/magic-resistance.mjs';

export function magicFearProfile(document,context){
 const id=ruleTestSourceId(document),definition=POWER_DETAILS_BY_ID[id]?.fearRoll;if(!definition)return null;
 const casting=ruleTestCastingContext(document,{context});
 const index=POWER_DETAILS_BY_ID[id].powerLevels.findIndex(option=>option.id===definition.optionId);
 const count=Math.max(0,Math.trunc(Number(casting.countsById?.[definition.optionId]??casting.counts?.[index])||0));
 return {...definition.steps[Math.min(count,definition.steps.length-1)],requiresResistance:definition.requiresResistance===true};
}

export function magicFearHasBaseTargets(document,context){
 const id=ruleTestSourceId(document),definition=POWER_DETAILS_BY_ID[id]?.fearRoll;if(!definition?.baseTargetOptionId)return false;
 const casting=ruleTestCastingContext(document,{context}),index=POWER_DETAILS_BY_ID[id].powerLevels.findIndex(option=>option.id===definition.baseTargetOptionId);
 return Number(casting.countsById?.[definition.baseTargetOptionId]??casting.counts?.[index]??0)>0;
}

export async function rollMagicFear({document,actor,context,baseOnly=false}={}){
 if(!actor?.isOwner)return null;const profile=magicFearProfile(document,context);if(!profile)return null;
 const {rollGenericImpact}=await import('./generic-rolls.mjs');
 const notice=profile.requiresResistance?game.i18n.localize('TRUDVANG.MagicFear.ResistanceFirst'):game.i18n.localize('TRUDVANG.MagicFear.EligibleRecipients');
 const base=baseOnly?POWER_DETAILS_BY_ID[ruleTestSourceId(document)].fearRoll.steps[0]:profile;
 return rollGenericImpact('fear',{...base,actor,title:document.name,notice});
}
