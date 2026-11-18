import {combatPoolsAreFull} from './rules/combat-pool-resolver.mjs';
const S='trudvang-chronicles';
export const fireEvadeItem=actor=>actor.findRuleKnowledge?.('evade')??actor.findKnowledgeItem?.('evade');
export function canEvadeZoneFire(actor){
 if(actor.transformationProfile?.noDodge||!(Number(fireEvadeItem(actor)?.system?.level)>0)||actor.canPerformAction?.({movement:true})===false)return false;
 const inCombat=actor.isInActiveCombat??actor.isInCombatActive?.()??false;
 return !inCombat||combatPoolsAreFull(actor)&&!Number(actor.system?.unarmedActionsSpent)&&!Array.from(actor.items??[]).some(i=>Number(i.system?.weaponActionsSpent)>0);
}
export function zoneFireInitiativePenalty(actor,combat=globalThis.game?.combat){
 const participant=Array.from(combat?.combatants??[]).find(c=>c.actor?.uuid===actor.uuid),current=combat?.combatant;
 const own=participant?.initiative,active=current?.initiative;return Number.isFinite(own)&&Number.isFinite(active)?-Math.abs(own-active):0;
}
/** The event key is shared with the normal damage application ledger. */
export async function applyZoneFireDamage({actor,token,info,message}){
 const event='zone-fire:'+message.id+':'+actor.uuid;
 let damage=Array.from(game.messages?.values?.()??game.messages??[]).find(m=>m.flags?.[S]?.persistentDamageEvent===event);
 if(!damage){const {rollDamage}=await import('./dice.mjs');const result=await rollDamage({actor,item:{name:game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name'),img:'icons/svg/fire.svg',system:{category:'magic',damage:info.profile.damageFormula,openRoll:info.profile.openRoll,strengthApplies:false,damageBonus:0}},context:{usage:'magic',automatic:true,ignoreActorDamage:true,returnMessage:true,boundActorUuid:actor.uuid,persistentDamageEvent:event,qualification:info.profile.qualification,targets:[token]}});damage=result?.message;}
 if(!damage)throw Error('Fire zone damage card missing');
 const {requestChatApplication}=await import('./chat-application.mjs');const result=await requestChatApplication({message:damage,actor,channel:'body'});if(!['applied','alreadyApplied','ineligibleTarget'].includes(result.status))throw Error('Fire zone damage application failed');
}
