import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {resolveRollUnderOutcome} from './rules/roll-under-resolver.mjs';
const S='trudvang-chronicles',channel='system.'+S,jobs=new Map(),replies=new Map();
let registered=false;
/** Whisper to owners (including offline owners) and every GM, never observers. */
export function diseaseRecipients(actor){
 return Array.from(game.users?.values?.()??game.users??[]).filter(user=>user.isGM||actor.testUserPermission?.(user,'OWNER')).map(user=>user.id);
}
export function diseaseResultMessage(effect,preferred){
 if(preferred?.content?.includes('data-rule-document-uuid="'+escapeAttribute(effect.uuid)+'"'))return preferred;
 return game.messages?.get(effect.flags?.[S]?.diseaseIncubation?.messageId)
  ??Array.from(game.messages?.values?.()??game.messages??[]).find(message=>message.flags?.[S]?.diseaseResistance?.effectUuid===effect.uuid);
}
export function diseaseRecordedResult(effect,preferred){
 return diseaseResultMessage(effect,preferred)?.flags?.[S]?.diseaseResistance?.response??null;
}
const responder=()=>game.users?.activeGM;
/** Serialized by message: simultaneous owner/GM submissions cannot overwrite a result. */
export function recordDiseaseResistance(payload){
 const previous=jobs.get(payload.messageId)??Promise.resolve();
 const job=previous.catch(()=>{}).then(()=>recordNow(payload));jobs.set(payload.messageId,job);
 return job.finally(()=>{if(jobs.get(payload.messageId)===job)jobs.delete(payload.messageId);});
}
async function recordNow(payload){
 const message=game.messages?.get(payload.messageId),user=game.users?.get(payload.userId);
 const actor=await foundry.utils.fromUuid(payload.actorUuid);
 if(!message||!user?.active||!actor||(!user.isGM&&!actor.testUserPermission(user,'OWNER'))
  ||(game.user.id!==responder()?.id&&!message.canUserModify?.(game.user,'update')))throw new Error('Unauthorized disease resistance');
 const data=message.flags?.[S]?.diseaseResistance;
 if(data?.actorUuid&&data.actorUuid!==actor.uuid)throw new Error('Wrong resistance actor');
 if(data?.effectUuid&&data.effectUuid!==payload.effectUuid)throw new Error('Wrong resistance effect');
 if(!message.content.includes('data-rule-document-uuid="'+escapeAttribute(payload.effectUuid)+'"'))throw new Error('Wrong resistance card');
 if(data?.response)return {response:data.response,animate:false};
 const effect=await foundry.utils.fromUuid(payload.effectUuid),incubation=effect?.flags?.[S]?.diseaseIncubation;
 if(!incubation||effect.parent?.uuid!==actor.uuid||!Number.isInteger(payload.result)||payload.result<1||payload.result>20||!Number.isFinite(payload.target))throw new Error('Invalid disease resistance');
 const clock=effect.flags[S].consequenceClock;
 const late=clock?.stage!==0||clock.stageStartedAt+clock.stages[0].seconds<=Number(game.time?.worldTime||0);
 const response={actorUuid:actor.uuid,name:actor.name,result:payload.result,target:payload.target,...resolveRollUnderOutcome(payload.result,payload.target),late};
 const label=game.i18n.localize(response.success?'TRUDVANG.Roll.Success':'TRUDVANG.Roll.Failure');
 const detail=game.i18n.format('TRUDVANG.Disease.ResistanceResult',response);
 const row='<div class="disease-resistance-result disease-resistance-result--'+(response.success?'success':'failure')+'"><span>'+escapeHtml(actor.name)+'</span><span>'+escapeHtml(detail)+'</span><strong>'+escapeHtml(label)+'</strong>'+(late?'<em>'+escapeHtml(game.i18n.localize('TRUDVANG.Disease.ResistanceLate'))+'</em>':'')+'</div>';
 const content=message.content.replace(/<button\b([^>]*data-action="roll-rule-test"[^>]*)>/,'<button disabled$1>').replace(/<\/div>\s*$/,row+'</div>');
 // Preserve the notice and its original dice; the resistance is part of this card.
 const rolls=payload.roll?[...message.rolls,Roll.fromData(payload.roll)]:message.rolls;
 await message.update({content,rolls,whisper:diseaseRecipients(actor),blind:false,
  ['flags.'+S+'.diseaseResistance']:{effectUuid:effect.uuid,actorUuid:actor.uuid,response},
  'flags.dice-so-nice.skip':true});
 return {response,animate:true};
}
export function registerDiseaseResistanceSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='diseaseResistanceReply'&&payload.userId===game.user.id){
   const pending=replies.get(payload.requestId);if(!pending)return;
   clearTimeout(pending.timeout);replies.delete(payload.requestId);
   payload.error?pending.reject(new Error(payload.error)):pending.resolve(payload.result);return;
  }
  if(payload?.type!=='diseaseResistanceSubmit'||game.user.id!==responder()?.id)return;
  let result,error;try{result=await recordDiseaseResistance(payload);}catch(e){console.error('Trudvang | Disease resistance result failed',e);error=game.i18n.localize('TRUDVANG.ChatApplication.Unavailable');}
  game.socket.emit(channel,{type:'diseaseResistanceReply',requestId:payload.requestId,userId:payload.userId,result,error});
 });
}
export function diseaseResultPublisher(effect,actor,preferred){
 const message=diseaseResultMessage(effect,preferred);if(!message)return null;
 return async(messageData,outcome)=>{
  const payload={type:'diseaseResistanceSubmit',requestId:crypto.randomUUID(),userId:game.user.id,messageId:message.id,effectUuid:effect.uuid,actorUuid:actor.uuid,result:outcome.result,target:outcome.target,roll:messageData.rolls[0].toJSON()};
  let result;
  if(responder()?.id===game.user.id||(!responder()&&message.canUserModify?.(game.user,'update')))result=await recordDiseaseResistance(payload);
  else{
   if(!responder()||!game.socket)throw new Error(game.i18n.localize('TRUDVANG.ChatApplication.Unavailable'));
   registerDiseaseResistanceSocket();
   result=await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{replies.delete(payload.requestId);reject(new Error(game.i18n.localize('TRUDVANG.ChatApplication.Unavailable')));},30000);
    replies.set(payload.requestId,{resolve,reject,timeout});game.socket.emit(channel,payload);
   });
  }
  return {...result,message,whisper:diseaseRecipients(actor)};
 };
}
