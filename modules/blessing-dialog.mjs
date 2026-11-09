import {activeConditionalModifierSection} from "./conditional-modifier-ui.mjs";
import {nidBlessingBonus} from './rules/nid-blessings.mjs';
import {escapeHtml} from './helpers.mjs';
import {itemUseBonuses} from './rules/item-magic.mjs';
function conditionalChoices(actor,{item}={}){
 const blessing=nidBlessingBonus(actor);
 return [...(blessing?[{id:`nid:${blessing.effectId}`,selector:'[data-nid-blessing]',attribute:'data-nid-blessing',value:blessing.value,label:game.i18n.format('TRUDVANG.Blessing.Contributes',{goal:blessing.goal||blessing.label})}]:[]),
  ...itemUseBonuses(actor).filter(row=>!item||row.item===item||(row.item.uuid&&row.item.uuid===item.uuid)).map((row,index)=>({id:`item:${row.id}`,selector:`[data-item-use="${index}"]`,attribute:`data-item-use="${index}"`,fixed:Boolean(item),value:row.value,label:game.i18n.format('TRUDVANG.Transformation.UseEnchantedItem',{item:row.item.name,effect:row.effect.name})}))];
}
/** Add the conditional choice to the existing dialog, without another prompt. */
export function blessingDialog(Base,actor,mode='modifier',context={}){
 const choices=conditionalChoices(actor,context);if(!choices.length)return Base;
 return class extends Base{
  static wait(config){
   const buttons=config.buttons.map(button=>!button.callback||button.action==='cancel'?button:{...button,callback:async(event,control,dialog)=>{
    const result=await button.callback(event,control,dialog);if(!result||typeof result!=='object')return result;
    const current=conditionalChoices(actor,context),selected=choices.filter(choice=>choice.fixed||dialog.element?.querySelector(choice.selector)?.checked).map(choice=>current.find(row=>row.id===choice.id)).filter(Boolean);
    if(!selected.length)return result;
    const value=selected.reduce((sum,row)=>sum+row.value,0);
    if(mode==='magic')result.target+=value;
    else if(mode==='concentration')result.modifier=Number(result.modifier||0)+value;
    else if(mode==='trait'){const field=result.mode==='open'?'bonus':'situationValue';result[field]=Number(result[field]||0)+value;}
    else result.modifier=Number(result.modifier||0)+value;
    result.blessing={label:selected.map(row=>row.label).join(' ; '),value};
    return result;
   }});
   return super.wait({...config,buttons});
  }
  _onRender(context,options){
   super._onRender(context,options);const root=this.element;if(!root?.querySelector||choices.some(row=>root.querySelector(row.selector)))return;
   const labels=choices.map(row=>{
    const label=document.createElement('label');label.className=row.fixed?'conditional-modifier-applied':'checkbox';
    label.innerHTML=`${row.fixed?`<i class="fas fa-circle-check" ${row.attribute} aria-hidden="true"></i>`:`<input type="checkbox" ${row.attribute}>`} ${escapeHtml(row.label)} (${row.value>0?'+':''}${row.value})`;
    return label;
   });
   const outputSelector='[data-final-target], [data-combat-final-target], [data-combat-target-final], [data-concentration-total], [data-fixed-attack-final], [data-fixed-attack-no-target-final], [data-open-modifier], [data-procedure-target], [data-animal-final]';
   const section=activeConditionalModifierSection(root);if(!section)return;for(const label of labels)section.append(label);
   const refresh=()=>{const activeSection=activeConditionalModifierSection(root);for(const label of labels)if(activeSection&&label.parentNode!==activeSection)activeSection.append(label);const selected=labels.map((label,index)=>({row:choices[index],checked:choices[index].fixed||label.querySelector('input')?.checked})).filter(entry=>entry.checked),enabled=selected.length>0,value=selected.reduce((sum,entry)=>sum+entry.row.value,0);for(const output of root.querySelectorAll(outputSelector)){
    let extra=output.nextElementSibling;if(!extra?.hasAttribute('data-nid-final')){extra=document.createElement('strong');extra.setAttribute('data-nid-final','');output.after(extra);}
    output.hidden=enabled;extra.hidden=!enabled;extra.textContent=String(Number(output.textContent)+value);
   }};
   root.addEventListener('input',()=>queueMicrotask(refresh));root.addEventListener('change',()=>queueMicrotask(refresh));root.addEventListener('click',()=>queueMicrotask(refresh));refresh();
  }
 };
}
