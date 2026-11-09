import {rulesFromChanges} from './effect-rule-changes.mjs';

const active=effect=>!effect.disabled&&!effect.isSuppressed&&!effect.duration?.expired;
export function itemMagicEffects(item){return Array.from(item?.effects??[]).filter(active);}
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
