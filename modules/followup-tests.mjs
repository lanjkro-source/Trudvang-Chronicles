import {followupPolicy,followupState,followupFingerprint,followupAvailability,worldDay} from './rules/followup-tests.mjs';
import {itemEffectRemainingSeconds} from './rules/effect-duration.mjs';
import {escapeHtml} from './helpers.mjs';
const S='trudvang-chronicles',channel='system.'+S,jobs=new Map(),replies=new Map(),pending=new WeakSet(),cached=new WeakMap();let registered=false;
const t=(key,data)=>data?game.i18n.format('TRUDVANG.FollowupTest.'+key,data):game.i18n.localize('TRUDVANG.FollowupTest.'+key);
const authority=()=>Boolean(game.users?.activeGM?.isSelf||game.users?.activeGM?.id===game.user?.id);
function live(effect){
 if(effect?.documentName!=='ActiveEffect'||effect.parent?.documentName!=='Actor'||effect.disabled||effect.isSuppressed||effect.active===false||effect.duration?.expired)return false;
 const duration=effect._source?.duration??effect.duration;
 return duration?.value==null||itemEffectRemainingSeconds(effect,{time:Number(game.time?.worldTime)||0,combat:game.combat})>0;
}
async function annotateResult(messageId,note){
 const message=game.messages?.get(messageId);if(!message?.update)return;
 const line='<p class="rule-test-outcome">'+escapeHtml(note)+'</p>',content=String(message.content??'');
 await message.update({content:/<\/article>\s*$/.test(content)?content.replace(/<\/article>\s*$/,line+'</article>'):content+line});
}
/** Native effect writes run on the elected GM and are serialized per recipient.
 * A stale roll cannot consume another day, advance recovery twice, or remove
 * an effect renewed while its dialog was open. */
export function resolveFollowupOnAuthority(payload){
 const previous=jobs.get(payload.effectUuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const effect=await foundry.utils.fromUuid(payload.effectUuid),user=game.users?.get(payload.userId)??(game.user?.id===payload.userId?game.user:null);
  if(!effect)return 'changed';
  if(!user||(!authority()&&game.users?.activeGM)||!effect?.parent?.canUserModify?.(user,'update'))return 'unavailable';
  const policy=followupPolicy(effect,payload.index),now=Number(game.time?.worldTime)||0;
  if(!policy||!live(effect)||followupFingerprint(effect)!==payload.fingerprint||typeof payload.success!=='boolean'||followupAvailability(effect,payload.index,now)||policy.frequency==='day'&&payload.day!==worldDay(now))return 'changed';
  const meta=effect.flags[S].transformation,progress=structuredClone(followupState(effect)??{baseSummary:meta.summary??'',baseDescription:effect.description??'',tests:{}});
  const state=progress.tests[payload.index]??{successes:0};state.successes=Math.max(0,Math.trunc(Number(state.successes)||0));
  const complete=payload.success&&policy.success==='memory'&&Number.isFinite(payload.target)&&payload.target>=policy.completeAt;
  let note='';
  if(complete||payload.success&&policy.success==='remove'){
   note=t(complete?'Recovered':'Removed',{effect:effect.name});await effect.delete();
  }else{
   if(policy.frequency==='day')state.lastDay=worldDay(now);
   if(policy.success==='memory'){
    if(payload.success)state.successes++;
    note=t(payload.success?'MemorySuccess':'MemoryFailure',{bonus:state.successes*policy.increment});
   }else if(payload.success&&policy.success==='reveal'){state.revealed=true;note=t('Revealed');}
   progress.tests[payload.index]=state;progress.revision=crypto.randomUUID();
   const summaries=Object.entries(progress.tests).flatMap(([index,row])=>{
    const spec=followupPolicy(effect,Number(index));
    return spec?.success==='memory'?[t('MemoryBonus',{bonus:row.successes*spec.increment})]:row.revealed?[t('Revealed')]:[];
   });
   await effect.update({description:(progress.baseDescription??effect.description??'')+(summaries.length?'<p class="rule-test-progress">'+escapeHtml(summaries.join(' '))+'</p>':''),['flags.'+S+'.ruleTestProgress']:progress,['flags.'+S+'.transformation.summary']:[progress.baseSummary,...summaries].filter(Boolean).join(' '),['flags.'+S+'.transformation.summaryResolved']:true});
  }
  if(note)await annotateResult(payload.messageId,note).catch(error=>console.error('Trudvang | Follow-up result note failed',error));
  return 'resolved';
 });
 jobs.set(payload.effectUuid,job);return job.finally(()=>{if(jobs.get(payload.effectUuid)===job)jobs.delete(payload.effectUuid);});
}
export function registerFollowupSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='followupTestReply'&&payload.userId===game.user.id){const entry=replies.get(payload.requestId);if(entry){clearTimeout(entry.timer);replies.delete(payload.requestId);entry.resolve(payload.status);}return;}
  if(payload?.type!=='resolveFollowupTest'||!authority())return;
  let status;try{status=await resolveFollowupOnAuthority(payload);}catch(error){console.error('Trudvang | Follow-up test failed',error);status='unavailable';}
  game.socket.emit(channel,{type:'followupTestReply',userId:payload.userId,requestId:payload.requestId,status});
 });
}
async function requestResolution(payload){
 if(authority()||!game.users?.activeGM)return resolveFollowupOnAuthority(payload);
 if(!game.socket)return 'unavailable';registerFollowupSocket();
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve('unavailable');},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(channel,payload);});
}
export async function withFollowupTest(effect,index,actor,roll){
 if(effect?.documentName!=='ActiveEffect'||!followupPolicy(effect,index))return roll();
 if(!actor?.isOwner||!live(effect))return null;
 const now=Number(game.time?.worldTime)||0,availability=followupAvailability(effect,index,now);
 if(availability){if(availability!=='revealed')ui.notifications.warn(t(availability==='wait'?'WaitNextDay':'DailyLimit'));return null;}
 if(pending.has(effect)){ui.notifications.warn(t('Busy'));return null;}
 pending.add(effect);
 try{
  const fingerprint=followupFingerprint(effect),day=worldDay(now),previous=cached.get(effect);
  const result=previous?.fingerprint===fingerprint&&previous?.index===index&&previous?.day===day?previous.result:await roll();
  if(!result)return null;cached.set(effect,{fingerprint,index,day,result});
  const status=await requestResolution({type:'resolveFollowupTest',requestId:crypto.randomUUID(),userId:game.user.id,effectUuid:effect.uuid,index,fingerprint,day,success:result.success,target:result.target,messageId:result.messageId});
  if(status==='unavailable')ui.notifications.warn(t('Unavailable'));
  else{cached.delete(effect);if(status==='changed')ui.notifications.warn(t('Changed'));}
  return result;
 }finally{pending.delete(effect);}
}
