import {durationUntilDayEnd} from './rules/effect-duration.mjs';
const S='trudvang-chronicles';
const clone=value=>structuredClone(value);
const text=key=>key?game.i18n.localize(key):'';

/** Freeze random durations before modifying effects. A retry reuses the plan and
 * identifies each created consequence, including independently expiring statuses. */
export async function applyDamageOutcome({message,actor,success,proofId}){
 const context=message.getFlag(S,'damageContext'),outcomes=context?.resistance?.outcomes;
 if(!outcomes)return;
 if(context.boundActorUuid!==actor.uuid)throw Error('Damage outcome target mismatch');
 if(message.getFlag(S,'damageResistanceResults')?.some(row=>row.actorUuid===actor.uuid))return;
 const definition=outcomes[success?'success':'failure'];if(!definition)return;
 const savedPlan=message.getFlag(S,'damageOutcomePlan');
 let plan=savedPlan?clone(savedPlan):null;
 if(plan&&(plan.success!==success||plan.proofId!==proofId))throw Error('Damage outcome proof mismatch');
 if(!plan){
  const origin=await foundry.utils.fromUuid(context.sourceEffectUuid).catch(()=>null);
  const meta=origin?.flags?.[S]?.transformation??context.effectSnapshot?.meta??{};
  const time=Number(game.time.worldTime);
  const start=foundry.documents?.ActiveEffect?.implementation?.getEffectStart?.()??{time};
  plan={success,proofId,time,start:{...start,time},entries:[],origin:{name:origin?.name??context.resistance.sourceName,img:origin?.img??context.effectSnapshot?.img,stackId:origin?.system?.stackId??`outcome:${message.id}`,meta:clone(meta)}};
  await message.update({content:message.content,[`flags.${S}.damageOutcomePlan`]:plan});
 }
 const parts=[definition,...(definition.extras??[])];
 for(let index=0;index<parts.length;index++){
  if(plan.entries[index])continue;
  const part=parts[index];
  let duration;
  if(!part.remove){
   if(part.duration==='endOfDay')duration=durationUntilDayEnd(plan.time);
   else {const {resolveDuration}=await import('./transformations.mjs');duration=await resolveDuration(part.duration,{actor,name:text(part.nameKey)||plan.origin.name});}
  }
  plan.entries[index]={remove:Boolean(part.remove),name:text(part.nameKey)||plan.origin.name,description:text(part.descriptionKey),duration,changes:clone(part.changes??[]),statuses:clone(part.statuses??[])};
  await message.update({content:message.content,[`flags.${S}.damageOutcomePlan`]:clone(plan)});
 }
 for(const [index,entry] of plan.entries.entries()){
  const marked=Array.from(actor.effects??[]).find(effect=>effect.flags?.[S]?.damageOutcome?.messageId===message.id&&effect.flags[S].damageOutcome.part===index);
  const origin=index===0?await foundry.utils.fromUuid(context.sourceEffectUuid).catch(()=>null):null;
  if(origin&&origin.parent?.uuid!==actor.uuid)throw Error('Damage outcome belongs to another actor');
  if(entry.remove){if(origin)await origin.delete();continue;}
  const data={name:entry.name,type:'effect',img:plan.origin.img,description:entry.description,transfer:false,disabled:false,
   duration:{...entry.duration,expired:false,expiry:null},start:clone(plan.start),statuses:entry.statuses,
   system:{stackId:index===0?plan.origin.stackId:`outcome:${message.id}:${index}`,stacking:'replace',changes:clone(entry.changes)},
   flags:{[S]:{damageOutcome:{messageId:message.id,part:index},transformation:{...clone(plan.origin.meta),summary:entry.name,summaryResolved:false,resistanceConsequence:true,appliedAt:plan.time}}}};
  if(marked??origin)await (marked??origin).update(data);
  else await actor.createTrudvangEffect(data);
 }
}
