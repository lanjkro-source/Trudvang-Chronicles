import {windProjectionProfile,impactSize} from './rules/impact.mjs';
import {resolveRollUnderOutcome} from './rules/roll-under-resolver.mjs';
import {rollOutcomeText} from './rules/roll-outcome-view.mjs';
const S='trudvang-chronicles',locks=new Map(),pending=new Map();
export async function resolveImpactTest(payload,{refresh,canReadMessage}={}){
 const message=game.messages.get(payload.messageId),user=game.users.get(payload.userId),actor=await foundry.utils.fromUuid(payload.actorUuid);
 if(!game.user?.isGM||!message||!user?.active||!actor?.isOwner||!actor.testUserPermission(user,'OWNER')||!canReadMessage(message,user)||message.getFlag(S,'damageContext')?.impact?.kind!=='windKnockback')return {status:'unavailable'};
 const rows=structuredClone(message.getFlag(S,'applications')??[]),row=rows.find(r=>r.actorUuid===actor.uuid&&r.channel==='body');if(!row)return {status:'unavailable'};
 if(row.impact?.resolved)return {status:'alreadyRolled'};
 const key=message.id+':'+actor.uuid,lock=locks.get(key);
 if(payload.action==='begin'){
  if(lock&&lock.until>Date.now())return {status:'resistancePending'};
  const token=crypto.randomUUID();locks.set(key,{token,userId:user.id,until:Date.now()+120000});return {status:'reserved',token};
 }
 if(!lock||lock.token!==payload.token||lock.userId!==user.id)return {status:'unavailable'};
 if(payload.action==='cancel'){locks.delete(key);return {status:'cancelled'};}
 if(payload.action!=='finish')return {status:'unavailable'};
 const proof=game.messages.get(payload.proofId),meta=proof?.flags?.[S]?.impactTestFor;
 const die=Number(proof?.rolls?.[0]?.total),target=Number(meta?.target);
 if((proof?.author?.id??proof?._source?.author)!==user.id||meta?.messageId!==message.id||meta?.actorUuid!==actor.uuid||meta?.token!==lock.token||proof?.rolls?.[0]?.formula!=='1d20'||!Number.isInteger(die)||die<1||die>20||!Number.isFinite(target))return {status:'unavailable'};
 const remembered=pending.get(key);
 const outcome=remembered?.outcome??{...resolveRollUnderOutcome(die,target),result:die,target};row.impact??={};
 row.impact.outcome=outcome;
 if(!outcome.success){
  // Retain the distance before changing statuses: a retried write never rerolls it.
  if(remembered){lock.distance=remembered.distance;lock.rolls=remembered.rolls;}
  if(lock.distance===undefined){const p=windProjectionProfile(impactSize(actor));const {openDice}=await import('./dice.mjs');const result=p.dice?await openDice(p):{total:1,diceRolls:[]};lock.distance=result.total;lock.rolls=result.diceRolls;}
  pending.set(key,{outcome,distance:lock.distance,rolls:lock.rolls});
  row.impact.distance=lock.distance;
  await actor.toggleStatusEffect('prone',{active:true});
 }
 row.impact.resolved=true;
 await refresh(message,rows,{rolls:lock.rolls??[]});
 pending.delete(key);locks.delete(key);return {status:'resolved'};
}
export async function requestImpactTest({message,actor,request}={}){
 if(!actor?.isOwner)return {status:'unavailable'};
 const row=(message.getFlag(S,'applications')??[]).find(r=>r.actorUuid===actor.uuid&&r.channel==='body');if(!row)return {status:'unavailable'};
 const payload={type:'chatImpactTest',messageId:message.id,userId:game.user.id,actorUuid:actor.uuid};
 const begin=await request(message,{...payload,action:'begin'});if(begin.status!=='reserved')return begin;
 try{
  const strength=Number(actor.getTraitValue('strength'))||0,damage=Number(row.impactDamage??row.amount)||0;
  const item={name:game.i18n.localize('TRUDVANG.Skill.Agility'),type:'ability',system:{parentSkill:'agility',catalogId:'agility',kind:'skill',level:0,rollBonus:1}};
  const result=await actor.rollAbility(item,{reactive:true,label:game.i18n.localize('TRUDVANG.Impact.Resist')+' — '+actor.name,
   modifierRows:[{labelKey:'TRUDVANG.Trait.Strength',value:strength},{labelKey:'TRUDVANG.Impact.DamagePenalty',value:-damage}],
   resolveProcedure:outcome=>({flags:{impactTestFor:{messageId:message.id,actorUuid:actor.uuid,token:begin.token,target:outcome.target}}})});
  if(!result)return {status:'cancelled'};
  return await request(message,{...payload,action:'finish',token:begin.token,proofId:result.messageId});
 }finally{await request(message,{...payload,action:'cancel',token:begin.token});}
}
export function impactResultText(row){
 if(!row.impact?.resolved)return '';
 const outcome=rollOutcomeText(row.impact.outcome,key=>game.i18n.localize(key));
 return outcome+(row.impact.distance!==undefined?' · '+game.i18n.format('TRUDVANG.Impact.Projected',{distance:row.impact.distance}):'');
}
