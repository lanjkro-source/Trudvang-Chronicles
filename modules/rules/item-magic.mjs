import {rulesFromChanges} from './effect-rule-changes.mjs';

const active=effect=>!effect.disabled&&!effect.isSuppressed&&!effect.duration?.expired;
export function itemMagicEffects(item){return Array.from(item?.effects??[]).filter(active);}
export function preparedItemProtection(item){
 const hasLocalValue=itemMagicEffects(item).some(effect=>!effect.transfer&&Array.from(effect.system?.changes??[]).some(change=>change.key==='system.protection'));
 return hasLocalValue&&Number.isFinite(Number(item?.system?.protection))?Math.max(0,Number(item.system.protection)):Math.ceil(Math.max(0,Number(item?.system?.breach?.value)||0)/10);
}
const localPath=/^system\.(?:damage|damageBonus|openRoll|combatPointBonus|weaponActions|initiativeModifier|movementModifier|passiveProtection|protection|weight|value|heft|material|breach\.(?:value|max)|range\.(?:short|long)|damageQualification\.[a-z]+)$/;
const priorities={multiply:10,add:20,subtract:20,downgrade:30,upgrade:40,override:50};
const preparations=new WeakMap();
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
  records.push({system:item.system,key:change.key,source:at(item._source,change.key),before,after:at(item,change.key)});
 }
}
export function itemUseBonuses(actor){
 return Array.from(actor?.items??[]).filter(item=>Number(item.system?.quantity??1)>0).flatMap(item=>itemMagicEffects(item).flatMap(effect=>{
  const value=Number(rulesFromChanges(effect.system?.changes).objectUse)||0;
  return value?[{id:effect.uuid??`${item.id}:${effect.id}`,item,effect,value}]:[];
 }));
}
export function itemProtectionModifiers(item){
 return itemMagicEffects(item).flatMap(effect=>{
  const amount=Number(rulesFromChanges(effect.system?.changes).itemProtection)||0;
  return amount?[{id:`item-magic:${effect.id}`,target:'protection',operation:'add',phase:'effect',amount,source:{kind:'effect',id:effect.id,name:effect.name},explanationKey:'TRUDVANG.DamageRoll.ItemEffects'}]:[];
 });
}
/** Persist the intrinsic balance, without folding a prepared integrity bonus back
 * into the source on every hit. The effect remains the only owner of its bonus. */
export function intrinsicIntegrityValue(item,effectiveValue){
 const prepared=Number(item?.system?.breach?.value)||0;
 const original=item?._source?.system?.breach?.value;
 return Number(effectiveValue)-(original==null?0:prepared-Number(original));
}
