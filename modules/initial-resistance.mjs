import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {itemEffectRemainingSeconds} from './rules/effect-duration.mjs';
const S='trudvang-chronicles',channel='system.'+S,pending=new WeakSet(),outcomes=new WeakMap(),jobs=new Map(),replies=new Map();
let registered=false;
const local=key=>game.i18n.localize('TRUDVANG.InitialResistance.'+key);
const stateOf=effect=>effect?.flags?.[S]?.initialResistance;
const authority=()=>Boolean(game.users?.activeGM?.isSelf);
/** Preserve the resolved payload, never put live native changes on a pending target.
 * A copy to another recipient needs its own resistance; renewing on the same
 * recipient preserves its decision and cannot provide another saving throw. */
export function prepareInitialResistance(data,spec,actor,source){
 const old=source?.parent?.uuid===actor.uuid?stateOf(source):null;
 const payload={name:data.name,description:data.description,summary:data.flags[S].transformation.summary,summaryResolved:data.flags[S].transformation.summaryResolved,changes:structuredClone(data.system.changes),statuses:[...data.statuses]};
 const state=old?structuredClone(old):{id:crypto.randomUUID(),testIndex:spec.testIndex,resolved:false,messageId:'',payload};
 data.flags[S].initialResistance=state;
 if(state.resolved)return;
 data.name=game.i18n.format('TRUDVANG.InitialResistance.PendingName',{effect:payload.name});
 data.description='<p>'+escapeHtml(local('PendingDescription'))+'</p>'+payload.description;
 data.flags[S].transformation.summary=local('PendingSummary');data.flags[S].transformation.summaryResolved=true;
 data.system.changes=[];data.statuses=[];
}
export function initialResistanceTestDisabled(document,index,spec){
 if(!spec)return false;
 const state=stateOf(document);
 return index===spec.testIndex?(!state||state.resolved):Boolean(state&&!state.resolved);
}
function live(effect){
 if(!effect||effect.disabled||effect.isSuppressed||effect.duration?.expired)return false;
 const remaining=itemEffectRemainingSeconds(effect,{time:Number(game.time?.worldTime)||0,combat:game.combat});
 return remaining===null||remaining>0;
}
export async function announceInitialResistance(effect,actor){
 const state=stateOf(effect);if(!state||state.resolved||state.messageId||!actor.canUserModify?.(game.user,'update'))return;
 const recipients=Array.from(game.users?.values?.()??game.users??[]).filter(user=>user.isGM||actor.testUserPermission?.(user,'OWNER')).map(user=>user.id);
 if(!recipients.length)return;
 const text=game.i18n.format('TRUDVANG.InitialResistance.Notice',{actor:actor.name,effect:state.payload.name});
 const message=await ChatMessage.create({whisper:recipients,speaker:ChatMessage.getSpeaker({actor}),content:'<div class="trudvang consequence-notice" data-rule-document-uuid="'+escapeAttribute(effect.uuid)+'"><p>'+escapeHtml(text)+'</p><button type="button" data-action="roll-rule-test" data-test-index="'+state.testIndex+'"><i class="fas fa-dice-d20"></i> '+escapeHtml(local('Resist'))+'</button></div>'});
 if(message?.id)await effect.update({['flags.'+S+'.initialResistance.messageId']:message.id});
}
/** Resolution is serialized on the active GM, including concurrent owner/GM rolls.
 * A renewed effect has a different identity; an old result cannot activate it. */
export function resolveInitialResistanceOnAuthority(payload){
 const previous=jobs.get(payload.effectUuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const effect=await foundry.utils.fromUuid(payload.effectUuid),state=stateOf(effect),user=game.users?.get(payload.userId)??(game.user?.id===payload.userId?game.user:null);
  if(!user||(!authority()&&game.users?.activeGM)||!effect?.parent?.canUserModify?.(user,'update'))return 'unavailable';
  if(!state||state.id!==payload.id||state.resolved||!live(effect)||typeof payload.success!=='boolean')return 'changed';
  if(payload.success){await effect.delete();return 'resisted';}
  await effect.update({name:state.payload.name,description:state.payload.description,statuses:state.payload.statuses,'system.changes':state.payload.changes,['flags.'+S+'.transformation.summary']:state.payload.summary,['flags.'+S+'.transformation.summaryResolved']:state.payload.summaryResolved,['flags.'+S+'.initialResistance.resolved']:true});
  return 'activated';
 });
 jobs.set(payload.effectUuid,job);return job.finally(()=>{if(jobs.get(payload.effectUuid)===job)jobs.delete(payload.effectUuid);});
}
export function registerInitialResistanceSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='initialResistanceReply'&&payload.userId===game.user.id){const entry=replies.get(payload.requestId);if(entry){clearTimeout(entry.timer);replies.delete(payload.requestId);entry.resolve(payload.status);}return;}
  if(payload?.type!=='resolveInitialResistance'||!authority())return;
  let status;try{status=await resolveInitialResistanceOnAuthority(payload);}catch(error){console.error('Trudvang | Initial resistance failed',error);status='unavailable';}
  game.socket.emit(channel,{type:'initialResistanceReply',userId:payload.userId,requestId:payload.requestId,status});
 });
}
async function requestResolution(effect,state,result){
 const payload={type:'resolveInitialResistance',requestId:crypto.randomUUID(),effectUuid:effect.uuid,id:state.id,userId:game.user.id,success:result.success};
 if(authority()||!game.users?.activeGM)return resolveInitialResistanceOnAuthority(payload);
 if(!game.socket)return 'unavailable';registerInitialResistanceSocket();
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve('unavailable');},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(channel,payload);});
}
export async function withInitialResistance(effect,index,actor,roll){
 const current=stateOf(effect);
 if(!current||index!==current.testIndex)return roll();
 const state=structuredClone(current);
 if(!actor?.isOwner||state.resolved||!live(effect))return null;
 if(pending.has(effect)){ui.notifications.warn(local('Busy'));return null;}
 pending.add(effect);
 try{
  const previous=outcomes.get(effect),result=previous?.id===state.id?previous.result:await roll();
  if(!result)return null;
  outcomes.set(effect,{id:state.id,result});
  const status=await requestResolution(effect,state,result);
  if(status==='unavailable')ui.notifications.warn(local('Unavailable'));
  else outcomes.delete(effect);
  return result;
 }finally{pending.delete(effect);}
}
