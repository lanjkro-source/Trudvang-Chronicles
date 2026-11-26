import {recordedRoll,recordedRollFlag} from "./chat-roll-privacy.mjs";
import {dispelCandidate,dispelFingerprint,vitnerIdentity} from './rules/dispel.mjs';
import {RULE_TESTS_BY_CATALOG_ID} from './rule-test-data.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {magicResistanceRows,localizeResistanceRows} from './rules/magic-resistance.mjs';
const S='trudvang-chronicles',channel='system.'+S,jobs=new Map(),replies=new Map();let registered=false;
const t=key=>game.i18n.localize('TRUDVANG.Dispel.'+key);
const authority=()=>game.users?.activeGM?.isSelf||game.users?.activeGM?.id===game.user.id;
function candidates(caster,spec){
 const tokens=Array.from(game.user.targets??[]);if(!tokens.length)tokens.push(...globalThis.canvas?.tokens?.controlled??[]);
 const actors=new Map(tokens.filter(token=>token.actor).map(token=>[token.actor.uuid,token.actor]));
 if(!actors.size)actors.set(caster.uuid,caster);
 const seen=new Set(),rows=[];
 const collect=(effect,label)=>{const info=dispelCandidate(effect,spec);if(!info||seen.has(effect.uuid))return;seen.add(effect.uuid);rows.push({...info,label:label+' — '+effect.name});};
 for(const actor of actors.values()){
  for(const effect of actor.effects??[])collect(effect,actor.name);
  for(const item of actor.items??[])for(const effect of item.effects??[])collect(effect,actor.name+' / '+item.name);
 }
 if(!tokens.length)for(const item of game.items??[])if(item.isOwner&&item.type!=='effect')for(const effect of item.effects??[])collect(effect,item.name);
 return rows;
}
async function chooseEffect(caster,rows,spec,sourceName,vitnerType){
 const known=row=>Boolean(row.vitnerType&&vitnerType);
 const same=row=>known(row)&&vitnerIdentity(row.vitnerType)===vitnerIdentity(vitnerType);
 const preview=row=>game.i18n.format('TRUDVANG.Dispel.Level',{level:row.level,value:row.base});
 const first=rows[0],Base=foundry.applications.api.DialogV2;
 const DialogClass=typeof Base!=='function'?Base:class extends Base{
  _onRender(context,options){super._onRender(context,options);const root=this.element;
   const refresh=()=>{const row=rows.find(row=>row.effect.uuid===root.querySelector('[name=effect]')?.value)??first;
    const text=root.querySelector('[data-dispel-preview]');if(text)text.textContent=preview(row);
    const note=root.querySelector('[data-dispel-unknown]');if(note)note.hidden=known(row);
    const choice=root.querySelector('[data-dispel-same-choice]');if(choice)choice.hidden=known(row);
    const automatic=root.querySelector('[data-dispel-same-automatic]');if(automatic)automatic.hidden=!same(row);
    const input=root.querySelector('[name=sameVitner]');if(input){input.checked=same(row);input.disabled=known(row);}
   };root.querySelector('[name=effect]')?.addEventListener('change',refresh);refresh();
  }
 };
 const sameBlock=spec.sameVitnerBonus?'<div data-dispel-same-automatic'+(same(first)?'':' hidden')+'><ul class="roll-state-modifiers"><li><span>'+escapeHtml(t('SameVitner'))+'</span><b>+'+spec.sameVitnerBonus+'</b></li></ul></div><div data-dispel-same-choice'+(known(first)?' hidden':'')+'><label class="checkbox"><input type="checkbox" name="sameVitner" '+(same(first)?'checked ':'')+(known(first)?'disabled ':'')+'>'+escapeHtml(t('SameVitner'))+' (+'+spec.sameVitnerBonus+')</label></div><p data-dispel-unknown'+(known(first)?' hidden':'')+'>'+escapeHtml(t('UnknownVitner'))+'</p>':'';
 const content='<div class="trudvang roll-dialog"><div class="form-group"><label>'+escapeHtml(t('Effect'))+'</label><select name="effect">'+rows.map(row=>'<option value="'+escapeAttribute(row.effect.uuid)+'">'+escapeHtml(row.label)+'</option>').join('')+'</select></div><p data-dispel-preview>'+escapeHtml(preview(first))+'</p>'+sameBlock+'</div>';
 return DialogClass.wait({window:{title:sourceName},classes:['trudvang'],position:{width:560},content,buttons:[{action:'continue',label:game.i18n.localize('TRUDVANG.Action.Continue'),default:true,callback:(_event,button)=>({effectUuid:button.form.querySelector('[name=effect]').value,sameVitner:Boolean(button.form.querySelector('[name=sameVitner]')?.checked)})},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],close:()=>false,rejectClose:false});
}
export async function performDispelTest({document,test,index,actor,context,originMessage}={}){
 if(!actor?.isOwner)return null;
 const rows=candidates(actor,test.dispel);if(!rows.length){ui.notifications.warn(t('NoEffect'));return null;}
 const choice=await chooseEffect(actor,rows,test.dispel,document.name,context.vitnerType);if(!choice||typeof choice!=='object')return null;
 const row=rows.find(row=>row.effect.uuid===choice.effectUuid);if(!row)return null;
 const current=dispelCandidate(row.effect,test.dispel);if(!current||current.fingerprint!==row.fingerprint){ui.notifications.warn(t('Changed'));return null;}
 const recipient=row.effect.parent?.documentName==='Actor'?row.effect.parent:row.effect.parent?.actor;
 if(originMessage&&recipient){
  const {magicBlockedForTarget}=await import('./spell-zones.mjs');
  if(await magicBlockedForTarget(originMessage,recipient))return null;
 }
 const known=Boolean(row.vitnerType&&context.vitnerType);
 const same=known?vitnerIdentity(row.vitnerType)===vitnerIdentity(context.vitnerType):Boolean(choice.sameVitner);
 const modifiers=localizeResistanceRows(magicResistanceRows(test,{context,actor}));
 if(same&&test.dispel.sameVitnerBonus)modifiers.push({labelKey:'TRUDVANG.Dispel.SameVitner',value:test.dispel.sameVitnerBonus});
 const {rollConfiguredTraitSituation}=await import('./dice.mjs');
 const result=await rollConfiguredTraitSituation({actor,test:{...test,sv:row.base},sourceName:document.name+' — '+row.label,castingModifierRows:modifiers,
  resolveProcedure:outcome=>({flags:{dispelAttempt:{sourceId:context.sourceId,sourceUuid:document.uuid,testIndex:Number(index),casterUuid:actor.uuid,effectUuid:row.effect.uuid,fingerprint:row.fingerprint,target:outcome.target,success:outcome.success,result:outcome.result,resolved:false}}})});
 if(result?.success){const status=await requestDispel(result.messageId);if(!['removed','gone'].includes(status))ui.notifications.warn(t(status==='changed'?'Changed':'Unavailable'));}
 return result;
}
export function resolveDispelOnAuthority(payload){
 const key=game.messages?.get(payload.messageId)?.flags?.[S]?.dispelAttempt?.originMessageId||payload.messageId;
 const previous=jobs.get(key)??Promise.resolve(),job=previous.catch(()=>{}).then(()=>resolveNow(payload));jobs.set(key,job);
 return job.finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});
}
async function resolveNow({messageId,userId}){
 const message=game.messages?.get(messageId),attempt=recordedRollFlag(message,"dispelAttempt"),user=game.users?.get(userId);
 const caster=attempt?await foundry.utils.fromUuid(attempt.casterUuid):null;
 if(!attempt||!user?.active||!caster)return 'unavailable';
 const recipient=attempt.recipientUuid?await foundry.utils.fromUuid(attempt.recipientUuid):null;
 if(!user.isGM&&!caster.testUserPermission?.(user,'OWNER')&&!recipient?.testUserPermission?.(user,'OWNER'))return 'unavailable';
 const source=await foundry.utils.fromUuid(attempt.sourceUuid),test=RULE_TESTS_BY_CATALOG_ID[attempt.sourceId]?.[attempt.testIndex];
 if(!source||!['spell','divineFeat'].includes(source.type)||source.system?.catalogId!==attempt.sourceId||!test?.dispel||!attempt.success||!Number.isFinite(attempt.target))return 'unavailable';
 const cleansing=test.dispel.mode==='cleanse';
 const automatic=cleansing&&(test.dispel.roll==='none'||test.dispel.roll==='self'&&recipient?.uuid!==caster.uuid);
 if(automatic!==Boolean(attempt.automatic))return 'unavailable';
 if(automatic&&!user.isGM&&!caster.testUserPermission?.(user,'OWNER'))return 'unavailable';
 if(!automatic){const die=Number(recordedRoll(message)?.total);if(!Number.isInteger(die)||die<1||die>19||(die!==1&&die>attempt.target))return 'unavailable';}
 if(attempt.resolved)return attempt.status??'removed';
 const effect=await foundry.utils.fromUuid(attempt.effectUuid);
 if(!authority()&&(!message.canUserModify?.(game.user,'update')||(effect&&!effect.canUserModify?.(game.user,'delete'))))return 'unavailable';
 let status='gone';
 if(cleansing&&effect&&effect.parent?.uuid!==recipient?.uuid)return 'unavailable';
 if(effect){const info=dispelCandidate(effect,test.dispel);if(!info||dispelFingerprint(effect)!==attempt.fingerprint)return 'changed';
 if(cleansing&&attempt.originMessageId){
  const origin=game.messages.get(attempt.originMessageId),cast=origin?.flags?.[S]?.ruleTestContext;
  if(cast?.sourceId!==attempt.sourceId||cast?.casterUuid!==caster.uuid)return 'unavailable';
  const recipients=origin.flags[S].cleansingRecipients??[],extra=test.dispel.roll==='self'?Math.max(0,Math.floor(Number(cast.countsById?.[attempt.sourceId+':2']??cast.counts?.[2])||0)):0;
  if(!recipients.includes(recipient.uuid)){if(recipients.length>=1+extra)return 'unavailable';await origin.update({['flags.'+S+'.cleansingRecipients']:[...recipients,recipient.uuid]});}
 }
 await effect.delete();status='removed';}
 const line='<p class="dispel-result">'+escapeHtml(game.i18n.format(status==='removed'?(cleansing?'TRUDVANG.Cleansing.Removed':'TRUDVANG.Dispel.Removed'):'TRUDVANG.Dispel.Gone',{effect:effect?.name??''}))+'</p>';
 const content=String(message.content).replace(/<\/article>\s*$/,line+'</article>');
 await message.update({content,['flags.'+S+'.dispelAttempt']:{...(message.flags?.[S]?.dispelAttempt??{}),resolved:true,status}});return status;
}
export function registerDispelSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='dispelReply'&&payload.userId===game.user.id){const pending=replies.get(payload.requestId);if(pending){clearTimeout(pending.timer);replies.delete(payload.requestId);pending.resolve(payload.status);}return;}
  if(payload?.type!=='dispelEffect'||!authority())return;
  let status;try{status=await resolveDispelOnAuthority(payload);}catch(error){console.error('Trudvang | Dispel failed',error);status='unavailable';}
  game.socket.emit(channel,{type:'dispelReply',userId:payload.userId,requestId:payload.requestId,status});
 });
}
export async function requestDispel(messageId){
 const payload={type:'dispelEffect',requestId:crypto.randomUUID(),messageId,userId:game.user.id};
 if(authority()||!game.users?.activeGM)return resolveDispelOnAuthority(payload);
 if(!game.socket)return 'unavailable';registerDispelSocket();
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve('unavailable');},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(channel,payload);});
}
