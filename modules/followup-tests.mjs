import {followupPolicy,followupState,followupFingerprint,followupAvailability,isVitnerPrison,worldDay} from './rules/followup-tests.mjs';
import {itemEffectRemainingSeconds} from './rules/effect-duration.mjs';
import {escapeHtml} from './helpers.mjs';
import {magicDamageProfile} from './magic-damage.mjs';
import {applyZoneDamage,zoneDamageReceipt} from './zone-damage.mjs';
import {resolveRollUnderOutcome} from './rules/roll-under-resolver.mjs';
import {deterministicId} from './skill-pack-data.mjs';
const S='trudvang-chronicles',channel='system.'+S,jobs=new Map(),replies=new Map(),pending=new WeakSet(),cached=new WeakMap();let registered=false;
const t=(key,data)=>data?game.i18n.format('TRUDVANG.FollowupTest.'+key,data):game.i18n.localize('TRUDVANG.FollowupTest.'+key);
const authority=()=>Boolean(game.users?.activeGM?.isSelf||game.users?.activeGM?.id===game.user?.id);
function live(effect){
 if(effect?.documentName!=='ActiveEffect'||effect.parent?.documentName!=='Actor'||effect.disabled||effect.isSuppressed||effect.active===false||effect.duration?.expired)return false;
 const duration=effect._source?.duration??effect.duration;
 return duration?.value==null||itemEffectRemainingSeconds(effect,{time:Number(game.time?.worldTime)||0,combat:game.combat})>0;
}
export const canPullPrisoner=effect=>Boolean(game.user?.isGM&&isVitnerPrison(effect)&&live(effect));

async function resolvePrisonDamage(effect,message,escape,profile){
 const actor=effect.parent,previous=zoneDamageReceipt(actor,message.id);
 await applyZoneDamage({actor,message,...profile});
 if(escape)await effect.delete();
 if(previous)return;
 await annotateResult(message.id,t(escape?'PrisonEscaped':'PrisonHeld'))
  .catch(error=>console.error('Trudvang | Prison result notification failed',error));
}

function escapeRollMatches(message,user,effect,payload){
 const roll=message?.rolls?.[0],reference=message?.getFlag?.(S,'followupTest')??message?.flags?.[S]?.followupTest;
 const die=Number(roll?.total);
 return message?.author?.id===user.id&&reference?.effectUuid===effect.uuid&&reference.index===0
  && roll?.formula==='1d20'&&Number.isInteger(die)&&die>=1&&die<=20
  && Number.isFinite(reference.target)&&reference.target===payload.target
  && resolveRollUnderOutcome(die,reference.target).success===payload.success;
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
  if(payload.index==='pull'){
   if(!user.isGM||!isVitnerPrison(effect)||!live(effect)||followupFingerprint(effect)!==payload.fingerprint)return 'changed';
   const Chat=foundry.documents?.ChatMessage?.implementation??globalThis.ChatMessage;
   const id=deterministicId(`prison-pull:${effect.uuid}`);
   const message=game.messages.get(id)??await Chat.create({_id:id,speaker:Chat.getSpeaker({actor:effect.parent}),
    content:`<p class="trudvang rule-test-outcome">${escapeHtml(t('PrisonPulled',{actor:effect.parent.name}))}</p>`},
    {keepId:true});
   await resolvePrisonDamage(effect,message,true,{formula:'1d10',qualification:magicDamageProfile(effect)?.qualification});
   return 'resolved';
  }
  const policy=followupPolicy(effect,payload.index),now=Number(game.time?.worldTime)||0;
  if(!policy||!live(effect)||followupFingerprint(effect)!==payload.fingerprint||typeof payload.success!=='boolean'||followupAvailability(effect,payload.index,now)||policy.frequency==='day'&&payload.day!==worldDay(now))return 'changed';
  const meta=effect.flags[S].transformation,progress=structuredClone(followupState(effect)??{baseSummary:meta.summary??'',baseDescription:effect.description??'',tests:{}});
  const state=progress.tests[payload.index]??{successes:0};state.successes=Math.max(0,Math.trunc(Number(state.successes)||0));
  const complete=payload.success&&policy.success==='memory'&&Number.isFinite(payload.target)&&payload.target>=policy.completeAt;
  let note='';
  if(policy.success==='escapePrison'){
   const message=game.messages?.get(payload.messageId),profile=magicDamageProfile(effect);
   if(!profile||!escapeRollMatches(message,user,effect,payload))return 'changed';
   await resolvePrisonDamage(effect,message,payload.success,payload.success?profile:{...profile,formula:'1d10',openRoll:0});
   if(payload.success)return 'resolved';
   state.attempts=(state.lastDay===worldDay(now)?state.attempts??0:0)+1;
  }
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
export async function pullPrisoner(effect){
 if(!canPullPrisoner(effect))return null;
 const fingerprint=followupFingerprint(effect);
 const confirmed=await foundry.applications.api.DialogV2.confirm({
  window:{title:t('PrisonPull')},
  content:`<p>${escapeHtml(t('PrisonPullConfirm',{actor:effect.parent.name}))}</p>`
 });
 if(confirmed!==true)return null;
 const status=await requestResolution({type:'resolveFollowupTest',requestId:crypto.randomUUID(),
  userId:game.user.id,effectUuid:effect.uuid,index:'pull',fingerprint});
 if(status!=='resolved')ui.notifications.warn(t(status==='changed'?'Changed':'Unavailable'));
 return status;
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
 if(availability){
  if(availability!=='revealed')ui.notifications.warn(t(availability==='wait'?'WaitNextDay':isVitnerPrison(effect)?'PrisonDailyLimit':'DailyLimit'));
  return null;
 }
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
