import {nidBlessingBonus} from './rules/nid-blessings.mjs';
import {escapeHtml} from './helpers.mjs';
/** Add the conditional choice to the existing dialog, without another prompt. */
export function blessingDialog(Base,actor,mode='modifier'){
 const blessing=nidBlessingBonus(actor);if(!blessing)return Base;
 return class extends Base{
  static wait(config){
   const buttons=config.buttons.map(button=>!button.callback||button.action==='cancel'?button:{...button,callback:async(event,control,dialog)=>{
    const result=await button.callback(event,control,dialog);if(!result||typeof result!=='object'||!dialog.element?.querySelector('[data-nid-blessing]')?.checked)return result;
    const current=nidBlessingBonus(actor);if(current?.effectId!==blessing.effectId)return result;
    const value=current.value;
    if(mode==='magic')result.target+=value;
    else if(mode==='concentration')result.modifier=value;
    else if(mode==='trait'){const field=result.mode==='open'?'bonus':'situationValue';result[field]=Number(result[field]||0)+value;}
    else result.modifier=Number(result.modifier||0)+value;
    result.blessing={label:game.i18n.format('TRUDVANG.Blessing.Contributes',{goal:current.goal||current.label}),value};
    return result;
   }});
   return super.wait({...config,buttons});
  }
  _onRender(context,options){
   super._onRender(context,options);const root=this.element;if(!root?.querySelector||root.querySelector('[data-nid-blessing]'))return;
   const label=document.createElement('label');label.className='checkbox';label.innerHTML='<input type="checkbox" data-nid-blessing> '+escapeHtml(game.i18n.format('TRUDVANG.Blessing.Contributes',{goal:blessing.goal||blessing.label}))+' (+'+blessing.value+')';
   const outputSelector='[data-final-target], [data-combat-final-target], [data-combat-target-final], [data-concentration-total], [data-fixed-attack-final], [data-fixed-attack-no-target-final], [data-open-modifier], [data-procedure-target], [data-animal-final]';
   (root.querySelector('.roll-dialog')??root).prepend(label);
   const refresh=()=>{const enabled=label.querySelector('input').checked;for(const output of root.querySelectorAll(outputSelector)){
    let extra=output.nextElementSibling;if(!extra?.hasAttribute('data-nid-final')){extra=document.createElement('strong');extra.setAttribute('data-nid-final','');output.after(extra);}
    output.hidden=enabled;extra.hidden=!enabled;extra.textContent=String(Number(output.textContent)+blessing.value);
   }};
   root.addEventListener('input',()=>queueMicrotask(refresh));root.addEventListener('change',()=>queueMicrotask(refresh));root.addEventListener('click',()=>queueMicrotask(refresh));refresh();
  }
 };
}
