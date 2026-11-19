import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {ruleTestCastingContext,ruleTestSourceId,withCastingCounts} from './rules/magic-resistance.mjs';
import {fearRecipientEligible} from './rules/fear-protection.mjs';
import {zonePixelScale} from './rules/spell-zones.mjs';
import {auraCasterToken} from './aura.mjs';

export function magicFearArea(document, context, casterToken, scene) {
 const details = POWER_DETAILS_BY_ID[ruleTestSourceId(document)];
 const definition = details?.fearRoll;
 const area = definition?.area;
 if (!area || !casterToken?.actor || !scene || (casterToken.parent && casterToken.parent.id !== scene.id)) return null;
 const index = details.powerLevels.findIndex(option => option.id === area.radiusOptionId);
 const count = Math.max(0, Math.trunc(Number(context.countsById?.[area.radiusOptionId] ?? context.counts?.[index]) || 0));
 const radius = area.radius + count * area.radiusStep;
 const center = token => token.object?.center ?? {
  x: token.x + token.width * scene.grid.size / 2,
  y: token.y + token.height * scene.grid.size / 2
 };
 const origin = center(casterToken);
 const hostile = globalThis.CONST?.TOKEN_DISPOSITIONS?.HOSTILE ?? -1;
 const policy = {casterUuid: casterToken.actor.uuid, eligibility: definition.eligibility};
 const radiusPixels = radius * zonePixelScale(scene);
 const recipients = Array.from(scene.tokens?.values?.() ?? []).filter(token => {
  if (token.actor?.type !== "character" || token.disposition !== hostile
      || token.level !== casterToken.level || !fearRecipientEligible(token.actor, policy)) return false;
  const point = center(token);
  return Math.hypot(point.x - origin.x, point.y - origin.y) <= radiusPixels + .01;
 });
 return {
  radius,
  actorUuids: [...new Set(recipients.map(token => token.actor.uuid))],
  visibleNames: [...new Map(recipients.filter(token => !token.hidden).map(token => [token.actor.uuid, token.name])).values()]
 };
}

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

export async function rollMagicFear({document,actor,context,baseOnly=false,speaker}={}){
 if(!actor?.isOwner||baseOnly&&!magicFearHasBaseTargets(document,context))return null;
 const profile=magicFearProfile(document,context);if(!profile)return null;
 const definition=POWER_DETAILS_BY_ID[ruleTestSourceId(document)].fearRoll;
 const {rollGenericImpact}=await import('./generic-rolls.mjs');
 const {ruleTestsForDocument}=await import('./rule-tests.mjs');
 const initial=ruleTestCastingContext(document,{caster:actor,context});
 const casting=baseOnly?withCastingCounts(initial,[]):initial;
 const base=baseOnly?definition.steps[0]:profile;
 const resistance=definition.resistance?{test:ruleTestsForDocument(document)[definition.resistance.testIndex],casting,sourceName:document.name,successProfile:definition.resistance.successProfile}:null;
 const scene = globalThis.canvas?.scene;
 const speakingToken = speaker?.token && speaker.scene === scene?.id ? scene.tokens.get(speaker.token) : null;
 const casterToken = definition.area && (speakingToken?.actor?.uuid === actor.uuid
  ? speakingToken : auraCasterToken(actor, globalThis.canvas?.tokens?.controlled, actor.getActiveTokens?.(false, true)));
 const area = magicFearArea(document, casting, casterToken, scene);
 if (definition.area && !area) {
  ui.notifications.warn(game.i18n.localize('TRUDVANG.MagicFear.AreaNeedsCaster'));
  return null;
 }
 const notice = area ? game.i18n.format('TRUDVANG.MagicFear.AreaRadius',{radius:area.radius})
  : resistance ? game.i18n.localize(resistance.successProfile?'TRUDVANG.MagicFear.PartialFear':'TRUDVANG.MagicFear.ResistFirst')
  : game.i18n.localize('TRUDVANG.MagicFear.EligibleRecipients');
 return rollGenericImpact('fear',{...base,actor,title:document.name,notice,fearArea:area,fearContext:{sourceId:casting.sourceId,casterUuid:actor.uuid,originMessageId:context?.originMessageId??"",casting,baseOnly,eligibility:definition.eligibility??{},profile:base,...(area?{areaActorUuids:area.actorUuids}:{}),...(resistance?{resistance}:{})}});
}
