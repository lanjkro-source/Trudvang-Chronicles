import {normalizeEffectDuration,itemEffectRemainingSeconds} from './rules/effect-duration.mjs';
const SCOPE='trudvang-chronicles',jobs=new Map();
const count=(counts,index)=>Number.isFinite(Number(counts[index]))?Math.max(0,Math.trunc(Number(counts[index]))):0;
export function instantConsequenceOperation(template,counts=[],context={}){
 const instant=template.instant;
 if(instant.operation==='createConsumable')return {operation:'createConsumable',definition:instant.consumable,sourceId:template.sourceId,counts,context};
 const bonus=(template.parameters??[]).filter(row=>row.target==='instant').reduce((sum,row)=>sum+Number(row.value)*count(counts,row.index),0);
 return {operation:instant.operation,formula:String(instant.base+bonus)};
}
/** Recheck time even before the GM has deleted the expired native effect. */
export function activeConjuredConsumable(item,{time=Number(game.time?.worldTime),combat=game.combat,forCapacity=false}={}){
 if(!item.flags?.[SCOPE]?.conjuredConsumable)return null;
 const effect=Array.from(item.effects??[]).find(effect=>!effect.disabled&&(!effect.isSuppressed||(forCapacity&&item.flags[SCOPE]?.inventoryTransfer))&&!effect.duration?.expired&&effect.flags?.[SCOPE]?.consumablePayload&&itemEffectRemainingSeconds(effect,{time,combat})>0);
 return effect?.flags[SCOPE].consumablePayload??null;
}
export function countConjuredConsumables(actor,sourceId){
 const actors=new Map(Array.from(game.actors??[],entry=>[entry.uuid,entry]));actors.set(actor.uuid,actor);
 for(const scene of game.scenes??[])for(const token of scene.tokens??[])if(token.actor)actors.set(token.actor.uuid,token.actor);
 const items=new Map([...Array.from(game.items??[]),...[...actors.values()].flatMap(entry=>Array.from(entry.items??[]))].map(item=>[item.uuid??item,item]));
 return [...items.values()].reduce((sum,item)=>{
  const origin=item.flags?.[SCOPE]?.conjuredConsumable;
  return sum+(origin?.creatorUuid===actor.uuid&&origin.sourceId===sourceId&&activeConjuredConsumable(item,{forCapacity:true})?Math.max(0,Number(item.system?.quantity??1)):0);
 },0);
}
export async function createConjuredConsumable(actor,{definition,sourceId,counts=[],context={}}){
 if(!actor?.isOwner)return null;
 const work=async()=>{
  const capacity=definition.capacity,maximum=Math.min(capacity.max,capacity.base+count(counts,capacity.index)*capacity.increment);
  if(countConjuredConsumables(actor,sourceId)>=maximum)throw Object.assign(new Error(game.i18n.localize('TRUDVANG.ConjuredConsumable.CapacityReached')),{code:'consumable-capacity'});
  const duration=normalizeEffectDuration({value:definition.duration.value+count(counts,definition.duration.index)*definition.duration.increment,units:definition.duration.units});
  const name=game.i18n.localize(definition.nameKey),now=Number(game.time?.worldTime)||0;
  const details=game.i18n.format('TRUDVANG.ConjuredConsumable.PreparedDetails',{duration:duration.value,unit:game.i18n.localize(`EFFECT.DURATION.UNITS.${duration.units}`),maximum});
  const description=`<p>${game.i18n.localize(definition.descriptionKey)}</p><p>${details}</p>`;
  const origin={creatorUuid:actor.uuid,sourceId,preparation:{duration,capacity:maximum,counts:[...counts],castingId:context.castingId??''}};
  const data={name,type:'gear',img:'icons/svg/regen.svg',system:{description,quantity:1,consumable:true,magical:false,consequenceId:'ConjuredConsumable'},flags:{[SCOPE]:{conjuredConsumable:origin}},effects:[{
   name,type:'effect',img:'icons/svg/regen.svg',transfer:false,start:foundry.documents.ActiveEffect.implementation.getEffectStart(),duration,description,
   system:{stacking:'replace',changes:[]},flags:{[SCOPE]:{consumablePayload:{...origin,operations:structuredClone(definition.operations)},transformation:{resolved:true,appliedAt:now,sourceId,summaryResolved:true,summary:`${game.i18n.localize(definition.descriptionKey)} ${details}`,...(context.kind==='spell'&&context.casterUuid&&context.castingId?{ruleTestContext:structuredClone(context)}:{})}}}
  }]};
  return (await actor.createEmbeddedDocuments('Item',[data]))[0];
 };
 const previous=jobs.get(actor.uuid)??Promise.resolve(),job=previous.catch(()=>{}).then(work);jobs.set(actor.uuid,job);
 try{return await job;}finally{if(jobs.get(actor.uuid)===job)jobs.delete(actor.uuid);}
}
