import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {activeTransformations} from './transformation-profile.mjs';

/** Conditional barriers protect against weapon hits, before worn armor. */
export function conditionalProtectionRows(actor,{usage='',magicalWeapon=false,qualification}={}){
 if(qualification){
  usage=qualification.delivery==='ranged'?'ranged':qualification.delivery==='melee'?'melee':usage;
  magicalWeapon=qualification.nature==='magical';
 }
 const ranged=['ranged','throwing'].includes(usage);
 if(!ranged&&!['melee','natural','unarmed'].includes(usage))return [];
 return activeTransformations(actor).flatMap(effect=>{
  const meta=effect.flags?.['trudvang-chronicles']?.transformation;
  const def=TRANSFORMATION_TEMPLATES[meta?.key]?.conditionalProtection;
  if(!meta?.resolved||!def)return [];
  const base=def[magicalWeapon?(ranged?'magicRanged':'magicMelee'):(ranged?'ranged':'melee')];
  if(base===null)return [];
  const index=(TRANSFORMATION_TEMPLATES[meta.key].parameters??[]).find(p=>p.optionId===def.optionId)?.index;
  const count=Math.max(0,Math.trunc(Number(meta.ruleTestContext?.countsById?.[def.optionId]??meta.ruleTestContext?.counts?.[index])||0));
  return [{effect:effect.name,amount:base+(def.baseOnly?0:count)}];
 });
}
