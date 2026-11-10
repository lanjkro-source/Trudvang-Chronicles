import {equipmentGrantActive} from './granted-equipment.mjs';
import {rulesFromChanges} from './effect-rule-changes.mjs';
import {itemQuality,equipmentDecimal} from './item-quality.mjs';
import {activeConjuredConsumable} from '../conjured-consumables.mjs';

const active=effect=>!effect.disabled&&!effect.isSuppressed&&!effect.duration?.expired;
export function itemMagicEffects(item){return item?.flags?.['trudvang-chronicles']?.inventoryTransfer||!equipmentGrantActive(item)?[]:Array.from(item?.effects??[]).filter(active);}
export function preparedItemProtection(item){
 const hasLocalValue=itemMagicEffects(item).some(effect=>!effect.transfer&&Array.from(effect.system?.changes??[]).some(change=>change.key==='system.protection'));
 return hasLocalValue&&Number.isFinite(Number(item?.system?.protection))?Math.max(0,Number(item.system.protection)):Math.ceil(Math.max(0,Number(item?.system?.breach?.value)||0)/10);
}
const localPath=/^system\.(?:quality|damage|damageBonus|openRoll|combatPointBonus|weaponActions|initiativeModifier|movementModifier|passiveProtection|protection|weight|value|heft|material|breach\.(?:value|max)|range\.(?:short|long)|damageQualification\.[a-z]+)$/;
const priorities={multiply:10,add:20,subtract:20,downgrade:30,upgrade:40,override:50};
const preparations=new WeakMap();
const integritySpentPath='flags.trudvang-chronicles.integritySpent';
const integritySignature=effect=>JSON.stringify([effect.origin??'',effect._source?.duration?.start??effect.duration?.start??null,effect.flags?.['trudvang-chronicles']?.transformation?.castingId??'',Array.from(effect.system?.changes??[])]);
const at=(object,path)=>path.split('.').reduce((value,key)=>value?.[key],object);
const assign=(object,path,value)=>{const keys=path.split('.'),last=keys.pop();keys.reduce((target,key)=>target[key]??={},object)[last]=value;};
/** Item-local effects do not participate in Actor#applyActiveEffects. Apply
 * scalar changes to the prepared Item in the two normal preparation phases,
 * using Foundry's public change handlers, never a database update. */
export function prepareItemLocalEffects(item,phase){
 if(!['weapon','shield','armor','gear','potion'].includes(item?.type))return;
 if(phase==='initial'){
  // Foundry may prepare the same initialized document more than once. Undo
  // only our previous in-memory patches, in reverse order, if no reset or
  // external change has replaced their values. Never change persisted data.
  for(const row of [...(preparations.get(item)??[])].reverse())if(row.system===item.system
    &&Object.is(at(item._source,row.key),row.source)&&Object.is(at(item,row.key),row.after))assign(item,row.key,row.before);
  preparations.set(item,[]);
 }
 const rows=itemMagicEffects(item).filter(effect=>!effect.transfer).flatMap(effect=>Array.from(effect.system?.changes??[])
  .filter(change=>localPath.test(change.key)&&(change.phase??'final')===phase)
  .map(change=>({effect,key:change.key,type:change.type??'add',value:change.value,priority:change.priority??priorities[change.type]??0,phase})));
 rows.sort((a,b)=>a.priority-b.priority);
 const records=preparations.get(item)??[];preparations.set(item,records);
 for(const change of rows){
  const before=at(item,change.key);
  foundry.documents.ActiveEffect.implementation.applyChange(item,change,{modifyTarget:true});
  const integrityGrant=change.key==='system.breach.value'?Math.max(0,Number(at(item,change.key))-Number(before)):0;
  const effectId=change.effect.id,signature=integritySignature(change.effect),stored=at(item._source,integritySpentPath)?.[effectId];
  const alreadySpent=records.filter(row=>row.effectId===effectId).reduce((sum,row)=>sum+(row.integritySpent||0),0);
  const integritySpent=integrityGrant&&stored?.signature===signature?Math.min(integrityGrant,Math.max(0,Number(stored.spent||0)-alreadySpent)):0;
  if(integritySpent)assign(item,change.key,Number(at(item,change.key))-integritySpent);
  records.push({system:item.system,key:change.key,type:change.type,operand:Number(change.value),source:at(item._source,change.key),before,after:at(item,change.key),effectId,signature,integrityGrant,integritySpent});
 }
 if(phase==='final')for(const key of ['system.weight','system.value']){
  const before=at(item,key),after=equipmentDecimal(before);
  if(typeof before==='number'&&before!==after){assign(item,key,after);records.push({system:item.system,key,type:'round',source:at(item._source,key),before,after});}
 }
 if(phase==='final'&&item.flags?.['trudvang-chronicles']?.conjuredConsumable){
  const key='system.magical',before=item.system.magical,after=Boolean(activeConjuredConsumable(item));
  if(before!==after){item.system.magical=after;records.push({system:item.system,key,type:'override',source:at(item._source,key),before,after});}
 }
}
/** Snapshot the values displayed by a sheet, so saving the full form does not
 * persist temporary bonuses, including fields the user did not change. */
export function itemEffectEditState(item){
 const rows=preparations.get(item)??[];
 return [...new Set(rows.map(row=>row.key))].map(key=>({key,source:at(item._source,key),displayed:at(item,key),changes:rows.filter(row=>row.key===key).map(row=>({...row})),...(key==='system.breach.value'?{integrity:itemIntegrityState(item)}:{})}));
}
export function intrinsicItemSheetUpdate(update,state=[]){
 for(const {key,source,displayed,changes,integrity} of state){
  const submitted=at(update,key);if(submitted===undefined)continue;
  if(String(submitted)===String(displayed)){assign(update,key,source);continue;}
  if(integrity){for(const [path,value] of Object.entries(integrityUpdate(integrity,submitted)))assign(update,path,value);continue;}
  let value=Number(submitted);
  if(Number.isFinite(value)&&typeof displayed==='number'&&typeof source==='number'){
   for(const row of [...changes].reverse()){
    if(row.type==='add')value-=row.operand;
    else if(row.type==='subtract')value+=row.operand;
    else if(row.type==='multiply'&&row.operand)value/=row.operand;
    else value-=Number(row.after)-Number(row.before);
   }
   assign(update,key,value);
  }
 }
 return update;
}
export function itemUseBonuses(actor,{castingType,action}={}){
 return Array.from(actor?.items??[]).filter(item=>Number(item.system?.quantity??1)>0).flatMap(item=>{
 if(item.flags?.['trudvang-chronicles']?.inventoryTransfer)return [];
 if(castingType&&['weapon','armor','shield'].includes(item.type)&&!item.system?.equipped)return [];
 const quality=itemQuality(item.system?.quality),qualityEffect=itemMagicEffects(item).find(effect=>!effect.transfer&&Array.from(effect.system?.changes??[]).some(row=>row.key==='system.quality'));
 const special=item.system?.specialUse??'none';
 const eligible=castingType?['weapon','gear','armor','shield'].includes(item.type)&&special===(castingType==='divine'?'votive':'vitner'):['gear','potion'].includes(item.type)&&special==='none';
 const qualityRows=eligible&&quality.modifier?[{id:`${item.uuid??item.id}:quality`,item,effect:qualityEffect??{id:'quality',name:game.i18n.localize(castingType?`TRUDVANG.Quality.Special.${special}`:'TRUDVANG.Quality.Label')},value:quality.modifier,qualityLevel:quality.id,automatic:Boolean(castingType)}]:[];
 return [...qualityRows,...itemMagicEffects(item).flatMap(effect=>{
  const value=Number(rulesFromChanges(effect.system?.changes).objectUse)||0;
  const outnumbered=action==='parry'?Number(rulesFromChanges(effect.system?.changes).objectParryOutnumbered)||0:0;
  return [...(outnumbered?[{id:(effect.uuid??effect.id)+':outnumbered',item,effect:{name:game.i18n.localize('TRUDVANG.Transformation.OutnumberedParry')},value:outnumbered,optional:true}]:[]),...(value?[{id:effect.uuid??`${item.id}:${effect.id}`,item,effect,value}]:[])];
 })];});
}
export function itemProtectionModifiers(item){
 return itemMagicEffects(item).flatMap(effect=>{
  const amount=Number(rulesFromChanges(effect.system?.changes).itemProtection)||0;
  return amount?[{id:`item-magic:${effect.id}`,target:'protection',operation:'add',phase:'effect',amount,source:{kind:'effect',id:effect.id,name:effect.name},explanationKey:'TRUDVANG.DamageRoll.ItemEffects'}]:[];
 });
}
function itemIntegrityState(item){
 const grants=new Map();
 for(const row of preparations.get(item)??[])if(row.integrityGrant){
  const grant=grants.get(row.effectId)??{id:row.effectId,signature:row.signature,maximum:0,spent:0};
  grant.maximum+=row.integrityGrant;grant.spent+=row.integritySpent;grants.set(row.effectId,grant);
 }
 return {current:Number(item.system?.breach?.value)||0,source:Number(item._source?.system?.breach?.value??item.system?.breach?.value)||0,grants:[...grants.values()]};
}
function integrityUpdate(state,value){
 const requested=Number(value);if(!Number.isFinite(requested))return {};
 let loss=Math.max(0,state.current-requested);
 const spent={};
 for(const grant of state.grants){
  const used=Math.min(loss,Math.max(0,grant.maximum-grant.spent));loss-=used;
  spent[grant.id]={signature:grant.signature,spent:grant.spent+used};
 }
 return {'system.breach.value':state.source-loss+Math.max(0,requested-state.current),
  ...(state.grants.length?{[integritySpentPath]:spent}:{})};
}
/** Temporary integrity absorbs losses first; persist its expenditure separately
 * from the intrinsic balance so preparation and effect expiry cannot refill it. */
export function itemIntegrityUpdate(item,effectiveValue){return integrityUpdate(itemIntegrityState(item),effectiveValue);}
export function intrinsicIntegrityValue(item,effectiveValue){
 return itemIntegrityUpdate(item,effectiveValue)['system.breach.value'];
}
