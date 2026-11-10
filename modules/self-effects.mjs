import {initialSelfEffectKeys,selfEffectNeedsChoice} from './rules/self-effects.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
/** Targeting is automatic; ask only for a genuine language/form/weapon choice. */
export async function applyPersonalCasting(actor,item,{context,counts,messageId}={}){
 const keys=initialSelfEffectKeys(item.system.catalogId);
 if(!keys.length)return [];
 let key=keys[0];
 if(keys.length>1){
  key=await foundry.applications.api.DialogV2.wait({window:{title:game.i18n.localize('TRUDVANG.Transformation.ChoosePersonalEffect')},content:'<div class="trudvang"><label>'+escapeHtml(item.name)+'<select name="effect">'+keys.map(key=>'<option value="'+escapeAttribute(key)+'">'+escapeHtml(game.i18n.localize('TRUDVANG.Content.Transformation.'+key+'.Name'))+'</option>').join('')+'</select></label></div>',buttons:[{action:'apply',default:true,label:game.i18n.localize('TRUDVANG.Transformation.Apply'),callback:(_event,button)=>button.form.querySelector('[name=effect]').value},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],rejectClose:false,close:()=>false});
  if(!keys.includes(key))return [];
 }
 const {applyTransformation}=await import('./transformations.mjs');
 const effect=await applyTransformation(actor,key,{source:item,counts,skipDialog:!selfEffectNeedsChoice(key),context:{...context,messageId,selfSource:true},targetName:actor.name});
 return effect?[effect]:[];
}
