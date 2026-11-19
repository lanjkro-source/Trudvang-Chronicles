import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {ruleTestCastingContext,ruleTestSourceId,withCastingCounts} from './rules/magic-resistance.mjs';
import {fearRecipientEligible} from './rules/fear-protection.mjs';
import {zonePixelScale} from './rules/spell-zones.mjs';
import {auraCasterToken} from './aura.mjs';

export function fearTargetRow(token) {
 const actor = token?.actor;
 if (!actor?.uuid || !['character','npc'].includes(actor.type)) return null;
 return {actorUuid:actor.uuid, tokenUuid:token.uuid, hidden:!!token.hidden,
  name:token.hidden ? '' : token.name};
}

export function automaticFearTargets(tokens, policy, contains) {
 const targets = new Map();
 for (const token of tokens) {
  if ((policy.hostileOnly && Number(token.disposition) !== Number(globalThis.CONST?.TOKEN_DISPOSITIONS?.HOSTILE ?? -1))
      || !fearRecipientEligible(token.actor,policy) || !contains(token)) continue;
  const row = fearTargetRow(token);
  if (row && (!targets.has(row.actorUuid) || targets.get(row.actorUuid).hidden)) targets.set(row.actorUuid,row);
 }
 return [...targets.values()];
}

export function fearAreaPolicy(sourceId,casterUuid) {
 const fear = POWER_DETAILS_BY_ID[sourceId]?.fearRoll;
 return {casterUuid,hostileOnly:fear?.area?.hostileOnly!==false,eligibility:fear?.eligibility??{excludeCaster:true}};
}

export function fearTargetsInCircle(area,scene,policy) {
 const {level,origin,radiusPixels} = area;
 return automaticFearTargets(scene.tokens?.values?.() ?? [],policy,token => {
  if (level && (token.includedInLevel?.(level) ?? (token.level == null || token.level === '' || token.level === level)) === false) return false;
  const points = token.getContainmentTestPoints?.();
  return (points?.length ? points : [tokenCenter(token,scene)]).some(point =>
   Math.hypot(point.x - origin.x, point.y - origin.y) <= radiusPixels + .01);
 });
}

function tokenCenter(token,scene) {
 return token.getCenterPoint?.() ?? token.object?.center ?? {
  x: token.x + token.width * scene.grid.size / 2,
  y: token.y + token.height * scene.grid.size / 2
 };
}

export function magicFearArea(document, context, casterToken, scene, viewedLevel) {
 const sourceId = ruleTestSourceId(document);
 const details = POWER_DETAILS_BY_ID[sourceId];
 const definition = details?.fearRoll;
 const area = definition?.area;
 if (!area || !casterToken?.actor || !scene || (casterToken.parent && casterToken.parent.id !== scene.id)) return null;
 const index = details.powerLevels.findIndex(option => option.id === area.radiusOptionId);
 const count = Math.max(0, Math.trunc(Number(context.countsById?.[area.radiusOptionId] ?? context.counts?.[index]) || 0));
 const radius = area.radius + count * area.radiusStep;
 const {x,y} = tokenCenter(casterToken,scene);
 const level = viewedLevel && casterToken.includedInLevel?.(viewedLevel) !== false ? viewedLevel : casterToken.level;
 const radiusPixels = radius * zonePixelScale(scene);
 const shape = {sceneId:scene.id, level:level ?? null, casterTokenUuid:casterToken.uuid,origin:{x,y},radius,radiusPixels};
 return {...shape,targets:fearTargetsInCircle(shape,scene,fearAreaPolicy(sourceId,casterToken.actor.uuid))};
}

export function captureMagicFearArea(document, context, actor, speaker) {
 if (!POWER_DETAILS_BY_ID[ruleTestSourceId(document)]?.fearRoll?.area) return null;
 const board = globalThis.canvas;
 const scene = board?.scene;
 const speakingToken = speaker?.token && speaker.scene === scene?.id ? scene.tokens.get(speaker.token) : null;
 const casterToken = speakingToken?.actor?.uuid === actor.uuid
  ? speakingToken : auraCasterToken(actor, board?.tokens?.controlled, scene?.tokens?.values?.());
 return magicFearArea(document, context, casterToken, scene, board?.level?.id);
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

export async function rollMagicFear({document,actor,context,baseOnly=false,speaker,castArea,casterUserId}={}){
 if(!actor?.isOwner||baseOnly&&!magicFearHasBaseTargets(document,context))return null;
 const profile=magicFearProfile(document,context);if(!profile)return null;
 const definition=POWER_DETAILS_BY_ID[ruleTestSourceId(document)].fearRoll;
 const {rollGenericImpact}=await import('./generic-rolls.mjs');
 const {ruleTestsForDocument}=await import('./rule-tests.mjs');
 const initial=ruleTestCastingContext(document,{caster:actor,context});
 const casting=baseOnly?withCastingCounts(initial,[]):initial;
 const base=baseOnly?definition.steps[0]:profile;
 const resistance=definition.resistance?{test:ruleTestsForDocument(document)[definition.resistance.testIndex],casting,sourceName:document.name,successProfile:definition.resistance.successProfile}:null;
 const area = castArea?.nativeRegion ? castArea : captureMagicFearArea(document, casting, actor, speaker);
 if (definition.area && !area) {
  ui.notifications.warn(game.i18n.localize('TRUDVANG.MagicFear.AreaNeedsCaster'));
  return null;
 }
 if (area && context?.originMessageId && Array.from(game.messages?.values?.() ?? []).some(message => {
  const fear = message.flags?.['trudvang-chronicles']?.fearContext;
  return fear?.grouped && fear.originMessageId === context.originMessageId;
 })) return null;
 const notice = area ? game.i18n.format('TRUDVANG.MagicFear.AreaRadius',{radius:area.radius})
  : resistance ? game.i18n.localize(resistance.successProfile?'TRUDVANG.MagicFear.PartialFear':'TRUDVANG.MagicFear.ResistFirst')
  : game.i18n.localize('TRUDVANG.MagicFear.EligibleRecipients');
 return rollGenericImpact('fear',{...base,actor,title:document.name,notice,fearArea:area,fearContext:{sourceId:casting.sourceId,casterUuid:actor.uuid,originMessageId:context?.originMessageId??"",casting,baseOnly,eligibility:definition.eligibility??{},profile:base,...(area?{grouped:true,areaSceneId:area.sceneId,casterUserId:casterUserId??game.user.id}:{}),...(resistance?{resistance}:{})}});
}
