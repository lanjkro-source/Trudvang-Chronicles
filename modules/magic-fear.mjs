import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {ruleTestCastingContext,ruleTestSourceId,withCastingCounts} from './rules/magic-resistance.mjs';

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
 if(!actor?.isOwner||baseOnly&&!magicFearHasBaseTargets(document,context))return null;
 const profile=magicFearProfile(document,context);if(!profile)return null;
 const definition=POWER_DETAILS_BY_ID[ruleTestSourceId(document)].fearRoll;
 const {rollGenericImpact}=await import('./generic-rolls.mjs');
 const {ruleTestsForDocument}=await import('./rule-tests.mjs');
 const initial=ruleTestCastingContext(document,{caster:actor,context});
 const casting=baseOnly?withCastingCounts(initial,[]):initial;
 const base=baseOnly?definition.steps[0]:profile;
 const resistance=definition.resistance?{test:ruleTestsForDocument(document)[definition.resistance.testIndex],casting,sourceName:document.name,successProfile:definition.resistance.successProfile}:null;
 const notice=resistance?game.i18n.localize(resistance.successProfile?'TRUDVANG.MagicFear.PartialFear':'TRUDVANG.MagicFear.ResistFirst'):game.i18n.localize('TRUDVANG.MagicFear.EligibleRecipients');
 return rollGenericImpact('fear',{...base,actor,title:document.name,notice,fearContext:{sourceId:casting.sourceId,casterUuid:actor.uuid,originMessageId:context?.originMessageId??"",casting,baseOnly,eligibility:definition.eligibility??{},profile:base,...(resistance?{resistance}:{})}});
}
