// Livre des règles, p.106 (PDF p.108): Quality and specialty level.
export const ITEM_QUALITIES=[
 {id:0,key:'Worthless',modifier:-2,heft:2,protection:-2,price:.2,weight:1.5},
 {id:1,key:'Poor',modifier:-1,heft:1,protection:-1,price:.5,weight:1.25},
 {id:2,key:'Normal',modifier:0,heft:0,protection:0,price:1,weight:1},
 {id:3,key:'Good',modifier:1,heft:-1,protection:0,price:2,weight:.9},
 {id:4,key:'Masterful',modifier:2,heft:-2,protection:1,price:3,weight:.8},
 {id:5,key:'Legendary',modifier:3,heft:-3,protection:2,price:5,weight:.7}
];
export const itemQuality=value=>ITEM_QUALITIES[Math.min(5,Math.max(0,Math.trunc(Number(value??2))||0))];
export const equipmentDecimal=value=>Math.round((Number(value||0)+Number.EPSILON)*10)/10;
/** Only masterful/legendary tools stack; their combined quality bonus is +6
 * at most (p.106). Penalties and unrelated magical modifiers remain separate. */
export function itemUseModifierTotal(rows){
 const ordinary=rows.filter(row=>row.qualityLevel===undefined).reduce((sum,row)=>sum+row.value,0);
 const quality=rows.filter(row=>row.qualityLevel!==undefined);
 const penalties=quality.filter(row=>row.value<0).reduce((sum,row)=>sum+row.value,0);
 const stacked=quality.filter(row=>row.value>0&&row.qualityLevel>=4).reduce((sum,row)=>sum+row.value,0);
 const single=Math.max(0,...quality.filter(row=>row.value>0&&row.qualityLevel<4).map(row=>row.value));
 return ordinary+penalties+Math.min(6,Math.max(stacked,single));
}
export function isMagicalItem(item){
 return Boolean(item.system?.magical||item.system?.magicalProtection||item.system?.damageQualification?.nature==='magical'||Array.from(item.effects??[]).some(effect=>!effect.disabled&&!effect.isSuppressed&&!effect.duration?.expired&&effect.flags?.['trudvang-chronicles']?.transformation?.key==='vitner-vitner-craft:enchant-object:2#effect'));
}
/** Differential changes: the stored characteristics already describe the item's
 * intrinsic quality. Never reapply its full quality bonus at preparation. */
export function itemQualityChanges(item,from,to){
 const before=itemQuality(from),after=itemQuality(to),changes=[];
 const add=(key,value,type='add')=>{if(value!==0&&(type!=='multiply'||value!==1))changes.push({key:`system.${key}`,type,value:String(value),phase:'initial',priority:20});};
 add('value',after.price/before.price,'multiply');
 if(['weapon','shield'].includes(item.type))add('combatPointBonus',after.modifier-before.modifier);
 if(item.system?.breach){
  for(const field of ['value','max'])add(`breach.${field}`,10*(after.protection-before.protection));
  changes.push({key:'system.breach.max',type:'upgrade',value:'0',phase:'initial',priority:40});
 }
 if(item.type==='armor'){
  add('heft',after.heft-before.heft);
  add('weight',after.weight/before.weight,'multiply');
 }
 changes.push({key:'system.quality',type:'override',value:String(after.id),phase:'initial',priority:20});
 return {changes,use:['gear','potion'].includes(item.type)?after.modifier-before.modifier:0,from:before,to:after};
}
/** Changing intrinsic quality updates the stored current characteristics once. */
export function intrinsicQualityUpdate(item,update){
 const system=update.system;if(!system||system.quality===undefined)return update;
 const before=itemQuality(item._source?.system?.quality),after=itemQuality(system.quality);
 if(before.id===after.id)return update;
 const base={...item._source.system,...system,...(item._source.system?.breach||system.breach?{breach:{...item._source.system?.breach,...system.breach}}:{})};
 const delta=itemQualityChanges({type:item.type,system:base},before.id,after.id);
 for(const row of delta.changes){
  const path=row.key.split('.').slice(1),last=path.pop();
  const target=path.reduce((value,key)=>value[key]??={},base);
  target[last]=row.type==='multiply'?Number(target[last]||0)*Number(row.value):row.type==='override'?Number(row.value):Number(target[last]||0)+Number(row.value);
 }
 if(base.breach)base.breach.max=Math.max(0,base.breach.max);
 if(item.type==='armor')base.heft=Math.max(0,base.heft);
 update.system=base;return update;
}
