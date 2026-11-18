import {cleansingCandidate} from './rules/dispel.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {ruleTestCastingContext,magicResistanceRows,localizeResistanceRows} from './rules/magic-resistance.mjs';
const S='trudvang-chronicles';
const t=key=>game.i18n.localize('TRUDVANG.Cleansing.'+key);
export async function performCleansing({document,test,index,actor,context,originMessage}={}){
 const casterUuid=context?.casterUuid??document.actor?.uuid;
 const caster=casterUuid?await foundry.utils.fromUuid(casterUuid):actor;
 const tokens=[...game.user.targets??[]];
 if(!tokens.length)tokens.push(...globalThis.canvas?.tokens?.controlled??[]);
 const actors=new Map(tokens.filter(t=>t.actor).map(t=>[t.actor.uuid,t.actor]));
 if(!actors.size&&actor)actors.set(actor.uuid,actor);
 const rows=[...actors.values()].flatMap(a=>Array.from(a.effects??[]).flatMap(effect=>{
  const info=cleansingCandidate(effect,test.dispel);return info?[{...info,actor:a}]:[];
 }));
 if(!rows.length){ui.notifications.warn(t('NoEffect'));return null;}
 const content='<div class="trudvang roll-dialog"><p>'+escapeHtml(t('Scope'))+'</p><p>'+test.dispel.categories.map(c=>escapeHtml(t('Category.'+c))).join(' · ')+'</p><div class="form-group"><label>'+escapeHtml(t('Effect'))+'</label><select name="effect">'+rows.map(r=>'<option value="'+escapeAttribute(r.effect.uuid)+'">'+escapeHtml(r.actor.name+' — '+r.effect.name)+'</option>').join('')+'</select></div><label class="checkbox"><input type="checkbox" name="confirm">'+escapeHtml(t('Confirm'))+'</label></div>';
 const choice=await foundry.applications.api.DialogV2.wait({window:{title:document.name},classes:['trudvang'],position:{width:560},content,buttons:[{action:'continue',label:game.i18n.localize('TRUDVANG.Action.Continue'),default:true,callback:(_e,button)=>({uuid:button.form.querySelector('[name=effect]').value,confirmed:button.form.querySelector('[name=confirm]').checked})},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],close:()=>false,rejectClose:false});
 if(!choice?.confirmed)return null;
 const row=rows.find(r=>r.effect.uuid===choice.uuid);
 if(!row||cleansingCandidate(row.effect,test.dispel)?.fingerprint!==row.fingerprint)return null;
 const recipients=originMessage?.flags?.[S]?.cleansingRecipients??[];
 if(recipients.length&&recipients[0]!==row.actor.uuid&&test.dispel.roll==='self')context={...context,counts:[],countsById:{}};
 const rollNeeded=test.dispel.roll==='recipient'||test.dispel.roll==='self'&&row.actor.uuid===caster?.uuid;
 const roller=test.dispel.roll==='recipient'?row.actor:caster;
 if(!roller?.isOwner){ui.notifications.warn(t('Permission'));return null;}
 const attempt={sourceId:document.system.catalogId,sourceUuid:document.uuid,testIndex:Number(index),casterUuid:caster?.uuid,recipientUuid:row.actor.uuid,effectUuid:row.effect.uuid,fingerprint:row.fingerprint,target:0,success:true,automatic:!rollNeeded,resolved:false,originMessageId:originMessage?.id??''};
 const {requestDispel}=await import('./dispel.mjs');
 if(!rollNeeded){
  const message=await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:caster}),content:'<article class="trudvang"><p>'+escapeHtml(document.name+' — '+row.actor.name)+'</p></article>',flags:{[S]:{dispelAttempt:attempt}}});
  const status=await requestDispel(message.id);if(!['removed','gone'].includes(status))ui.notifications.warn(t('Unavailable'));
  return {success:['removed','gone'].includes(status),messageId:message.id};
 }
 const {rollConfiguredTraitSituation}=await import('./dice.mjs');
 const result=await rollConfiguredTraitSituation({actor:roller,test,reactive:test.dispel.roll==='recipient',sourceName:document.name+' — '+row.actor.name+' — '+row.effect.name,resistedEffect:row.effect,
  castingModifierRows:localizeResistanceRows(magicResistanceRows(test,{context:ruleTestCastingContext(document,{context}),actor:roller})),
  resolveProcedure:outcome=>({flags:{dispelAttempt:{...attempt,target:outcome.target,success:outcome.success}}})});
 if(result?.success){const status=await requestDispel(result.messageId);if(!['removed','gone'].includes(status))ui.notifications.warn(t('Unavailable'));}
 else if(result&&test.dispel.roll==='recipient'){
  const message=game.messages.get(result.messageId);if(message)await message.update({content:String(message.content).replace(/<\/article>\s*$/,'<p><em>'+escapeHtml(t('TemporaryRelief'))+'</em></p></article>')});
 }
 return result;
}
