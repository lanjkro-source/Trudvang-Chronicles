import {activeTransformations} from "./transformation-profile.mjs";
import {blessedWeaponEffects} from "./blessed-weapon.mjs";

const definitions={
 "holy-ealdtradition-heritage-of-majne:trollslayer:1":{tags:["troll"],attack:1,damage:2,index:1},
 "holy-ealdtradition-heritage-of-majne:giantslayer:2":{tags:["géant","giant"],attack:2,damage:4,index:1},
 "holy-ealdtradition-heritage-of-majne:dragonslayer:6":{tags:["dragon"],attack:3,damage:6,index:1},
 "holy-haminges-power-of-the-beast:mind-of-the-predator:1":{tags:["bête","beast","animal"],attack:1,damage:0,index:2,parry:true}
};
export function creatureConditionalBonuses(actor,item=null){
 const regular=activeTransformations(actor).flatMap(effect=>{
  const meta=effect.flags?.["trudvang-chronicles"]?.transformation,definition=definitions[meta?.sourceId];
  if(!definition)return [];
  const id=`${meta.sourceId}:${definition.index}`,counts=meta.ruleTestContext??{};
  const extra=Math.max(0,Number(counts.countsById?.[id]??counts.counts?.[definition.index])||0);
  return [{tags:definition.tags,name:effect.name,attack:definition.attack+extra,damage:definition.damage?definition.damage+extra:0,parry:Boolean(definition.parry)}];
 });
 return [...regular,...blessedWeaponEffects(item).flatMap(({effect,normal,undead,demon},index)=>[
  {tags:["mort-vivant","undead"],name:effect.name,damage:undead-normal,group:`weapon-blessing-${index}`},
  {tags:["démon","demon"],name:effect.name,damage:demon-normal,group:`weapon-blessing-${index}`}
 ])];
}
export function matchingCreatureBonus(bonus,actor){
 const tags=new Set((actor?.system?.tags??[]).map(tag=>String(tag).trim().toLocaleLowerCase()));
 return bonus.tags.some(tag=>tags.has(tag));
}
/** Mutually exclusive categories of a single effect use the highest bonus. */
export function conditionalDamageBonus(rows,actor){
 const groups=new Map();let total=0;
 for(const row of rows)if(Array.isArray(row.tags)&&matchingCreatureBonus(row,actor)){
  const value=Math.max(0,Number(row.damage)||0);
  if(row.group)groups.set(row.group,Math.max(groups.get(row.group)??0,value));else total+=value;
 }
 return total+[...groups.values()].reduce((sum,value)=>sum+value,0);
}
