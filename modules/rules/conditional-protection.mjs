import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {activeTransformations} from './transformation-profile.mjs';

/** The same resolved values feed damage absorption and the actor's armor detail. */
export function conditionalProtectionProfiles(actor){
 return activeTransformations(actor).flatMap(effect=>{
  const meta=effect.flags?.['trudvang-chronicles']?.transformation;
  const template=TRANSFORMATION_TEMPLATES[meta?.key];
  const def=template?.conditionalProtection;
  if(!meta?.resolved||!def)return [];
  const index=(template.parameters??[]).find(p=>p.optionId===def.optionId)?.index;
  const count=Math.max(0,Math.trunc(Number(meta.ruleTestContext?.countsById?.[def.optionId]??meta.ruleTestContext?.counts?.[index])||0));
  return [{effect:effect.name,...Object.fromEntries(['melee','ranged','magicMelee','magicRanged'].map(key=>[key,def[key]==null?null:def[key]+(def.baseOnly?0:count)]))}];
 });
}

/** Conditional barriers protect against weapon hits, before worn armor. */
export function conditionalProtectionRows(actor,{usage='',magicalWeapon=false,qualification}={}){
 if(qualification){
  usage=qualification.delivery==='ranged'?'ranged':qualification.delivery==='melee'?'melee':usage;
  magicalWeapon=qualification.nature==='magical';
 }
 const ranged=['ranged','throwing'].includes(usage);
 if(!ranged&&!['melee','natural','unarmed'].includes(usage))return [];
 return conditionalProtectionProfiles(actor).flatMap(profile=>{
  const amount=profile[magicalWeapon?(ranged?'magicRanged':'magicMelee'):(ranged?'ranged':'melee')];
  return amount===null?[]:[{effect:profile.effect,amount}];
 });
}
