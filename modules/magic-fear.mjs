import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {ruleTestCastingContext,ruleTestSourceId,withCastingCounts} from './rules/magic-resistance.mjs';
import {fearRecipientEligible} from './rules/fear-protection.mjs';
import {zonePixelScale} from './rules/spell-zones.mjs';
import {auraCasterToken} from './aura.mjs';

export function fearAreaTarget(token, policy) {
 const actor = token?.actor;
 if (!actor?.uuid || !['character','npc'].includes(actor.type)
     || Number(token.disposition) !== Number(globalThis.CONST?.TOKEN_DISPOSITIONS?.HOSTILE ?? -1)
     || !fearRecipientEligible(actor, policy)) return null;
 return {actorUuid:actor.uuid, tokenUuid:token.uuid, hidden:!!token.hidden,
  name:token.hidden ? '' : token.name, canApply:actor.type === 'character'};
}

export function magicFearArea(document, context, casterToken, scene, viewedLevel) {
 const details = POWER_DETAILS_BY_ID[ruleTestSourceId(document)];
 const definition = details?.fearRoll;
 const area = definition?.area;
 if (!area || !casterToken?.actor || !scene || (casterToken.parent && casterToken.parent.id !== scene.id)) return null;
 const index = details.powerLevels.findIndex(option => option.id === area.radiusOptionId);
 const count = Math.max(0, Math.trunc(Number(context.countsById?.[area.radiusOptionId] ?? context.counts?.[index]) || 0));
 const radius = area.radius + count * area.radiusStep;
 const center = token => token.getCenterPoint?.() ?? token.object?.center ?? {
  x: token.x + token.width * scene.grid.size / 2,
  y: token.y + token.height * scene.grid.size / 2
 };
 const origin = center(casterToken);
 const level = viewedLevel && casterToken.includedInLevel?.(viewedLevel) !== false ? viewedLevel : casterToken.level;
 const policy = {casterUuid: casterToken.actor.uuid, eligibility: definition.eligibility};
 const radiusPixels = radius * zonePixelScale(scene);
 const targets = new Map();
 for (const token of scene.tokens?.values?.() ?? []) {
  if (level && (token.includedInLevel?.(level) ?? (token.level == null || token.level === '' || token.level === level)) === false) continue;
  const point = center(token);
  if (Math.hypot(point.x - origin.x, point.y - origin.y) > radiusPixels + .01) continue;
  const row = fearAreaTarget(token, policy);
  if (row && (!targets.has(row.actorUuid) || targets.get(row.actorUuid).hidden)) targets.set(row.actorUuid, row);
 }
 return {sceneId:scene.id, level:level ?? null, casterTokenUuid:casterToken.uuid,
  origin:{x:origin.x,y:origin.y}, radius, radiusPixels, targets:[...targets.values()]};
}

export function captureMagicFearArea(document, context, actor, speaker) {
 if (!POWER_DETAILS_BY_ID[ruleTestSourceId(document)]?.fearRoll?.area) return null;
 const board = globalThis.canvas;
 const scene = board?.scene;
 const speakingToken = speaker?.token && speaker.scene === scene?.id ? scene.tokens.get(speaker.token) : null;
 const casterToken = speakingToken?.actor?.uuid === actor.uuid
  ? speakingToken : auraCasterToken(actor, board?.tokens?.controlled, board?.tokens?.placeables ?? actor.getActiveTokens?.(false, true));
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
 const area = castArea ?? captureMagicFearArea(document, casting, actor, speaker);
 if (definition.area && !area) {
  ui.notifications.warn(game.i18n.localize('TRUDVANG.MagicFear.AreaNeedsCaster'));
  return null;
 }
 const notice = area ? game.i18n.format('TRUDVANG.MagicFear.AreaRadius',{radius:area.radius})
  : resistance ? game.i18n.localize(resistance.successProfile?'TRUDVANG.MagicFear.PartialFear':'TRUDVANG.MagicFear.ResistFirst')
  : game.i18n.localize('TRUDVANG.MagicFear.EligibleRecipients');
 return rollGenericImpact('fear',{...base,actor,title:document.name,notice,fearArea:area,fearContext:{sourceId:casting.sourceId,casterUuid:actor.uuid,originMessageId:context?.originMessageId??"",casting,baseOnly,eligibility:definition.eligibility??{},profile:base,...(area?{areaSceneId:area.sceneId,casterUserId:casterUserId??game.user.id}:{}),...(resistance?{resistance}:{})}});
}
