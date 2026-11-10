import {TRANSFORMATION_TEMPLATES} from './transformation-data.mjs';
import {RULE_TESTS_BY_CATALOG_ID} from './rule-test-data.mjs';
import {createConsequenceEffect} from './consequences.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
const S='trudvang-chronicles',pending=new WeakSet(),creations=new WeakMap();
export function activeDiseaseOutcome(actor,sourceId){
 const now=Number(game.time?.worldTime)||0;
 return Array.from(actor.effects??[]).find(effect=>{
  if(effect.disabled||effect.isSuppressed||effect.flags?.[S]?.diseaseOutcome?.sourceId!==sourceId)return false;
  const clock=effect.flags?.[S]?.consequenceClock;
  return clock&&clock.stageStartedAt+clock.stages.slice(clock.stage).reduce((sum,stage)=>sum+stage.seconds,0)>now;
 });
}
/** Entry into the zone contracts incubation immediately. Its clock and its
 * resistance are independent of the aura, including after leaving the zone. */
export async function beginDiseaseIncubation(source,actor){
 const meta=source?.flags?.[S]?.transformation,template=TRANSFORMATION_TEMPLATES[meta?.key],spec=template?.disease;
 if(!spec||!actor?.isOwner)return null;
 const work=async()=>{
  if(activeDiseaseOutcome(actor,template.sourceId))return null;
  const local=key=>game.i18n.localize('TRUDVANG.Disease.'+key),sourceId=template.sourceId;
  const name=game.i18n.localize(`TRUDVANG.Content.Power.${sourceId}.Name`),incubation=await new Roll(spec.incubation).evaluate();
  const amount=await new Roll(spec.kind==='sores'?spec.lesions:spec.duration).evaluate();
  const context=structuredClone(meta.ruleTestContext??{sourceId}),raw=RULE_TESTS_BY_CATALOG_ID[sourceId]?.[spec.testIndex];
  const test={...structuredClone(raw),actionKey:'TRUDVANG.Disease.Resist',success:local('ImmuneDescription'),failure:local('ResistanceFailure')};
  const count=Math.max(1,Math.trunc(Number(amount.total))),minutes=Math.max(1,Number(incubation.total));
  const second=spec.kind==='sores'?{
   seconds:count*86400,label:game.i18n.format('TRUDVANG.Disease.SoresLabel',{remaining:count}),description:game.i18n.format('TRUDVANG.Disease.SoresDescription',{remaining:count}),changes:[],
   periodic:[{interval:86400,operations:[],budget:{remaining:count,formula:spec.daily,operation:'damage',perUnit:spec.damagePer,ignoreArmor:true,descriptionKey:'TRUDVANG.Disease.SoresDescription',labelKey:'TRUDVANG.Disease.SoresLabel'}}]
  }:{seconds:count*86400,label:local('Fever'),description:game.i18n.format('TRUDVANG.Disease.FeverDescription',{penalty:spec.penalty}),changes:[{key:'system.modifiers.rolls.allActions',type:'add',value:String(spec.penalty),phase:'initial',priority:template.priority}]};
  const flags={[S]:{diseaseOutcome:{sourceId,kind:'incubation'},diseaseIncubation:{sourceId,context,resolved:false},transformation:{sourceId}}};
  const effect=await createConsequenceEffect(actor,{name,img:source.img??template.icon,description:local('IncubationDescription'),stackId:`disease:${sourceId}`,flags,stages:[
   {seconds:minutes*60,label:local('Incubation'),description:local('IncubationDescription'),changes:[],tests:[test]},second
  ]});
  if(effect){
   const text=game.i18n.format(spec.kind==='sores'?'TRUDVANG.Disease.SoresNotice':'TRUDVANG.Disease.IncubationNotice',{actor:actor.name,minutes,days:count,remaining:count,penalty:spec.penalty});
   await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),rolls:[incubation,amount],content:`<div class="trudvang consequence-notice" data-rule-document-uuid="${escapeAttribute(effect.uuid??'')}"><p>${escapeHtml(text)}</p><button type="button" data-action="roll-rule-test" data-test-index="0"><i class="fas fa-dice-d20"></i> ${escapeHtml(local('Resist'))}</button></div>`});
  }
  return effect;
 };
 const job=(creations.get(actor)??Promise.resolve()).catch(()=>{}).then(work);creations.set(actor,job);
 try{return await job;}finally{if(creations.get(actor)===job)creations.delete(actor);}
}
export async function withDiseaseResistance(document,index,actor,roll){
 const incubation=document?.flags?.[S]?.diseaseIncubation;
 if(!incubation||index!==0)return roll();
 if(!actor?.isOwner)return null;
 const clock=document.flags[S].consequenceClock,now=Number(game.time?.worldTime)||0;
 if(incubation.resolved||clock?.stage!==0||clock.stageStartedAt+clock.stages[0].seconds<=now)return null;
 if(pending.has(document)){ui.notifications.warn(game.i18n.localize('TRUDVANG.Disease.Pending'));return null;}
 pending.add(document);
 try{
  const result=await roll();if(!result)return null;
  const liveClock=document.flags[S].consequenceClock;
  if(document.flags[S].diseaseIncubation.resolved||liveClock?.stage!==0||liveClock.stageStartedAt+liveClock.stages[0].seconds<=Number(game.time?.worldTime)||!Array.from(actor.effects??[]).includes(document))return result;
  if(result.success){
   const sourceId=incubation.sourceId,name=game.i18n.localize(`TRUDVANG.Content.Power.${sourceId}.Name`),description=game.i18n.localize('TRUDVANG.Disease.ImmuneDescription');
   const immunity=await createConsequenceEffect(actor,{name,img:document.img,description,stackId:`disease-immunity:${sourceId}`,flags:{[S]:{diseaseOutcome:{sourceId,kind:'immunity'}}},stages:[{seconds:86400,label:game.i18n.localize('TRUDVANG.Disease.Immunity'),description,changes:[]}]});
   try{await document.delete();}catch(error){await immunity?.delete();throw error;}
  }else await document.update({[`flags.${S}.diseaseIncubation.resolved`]:true,[`flags.${S}.consequenceTests`]:[]});
  return result;
 }finally{pending.delete(document);}
}
