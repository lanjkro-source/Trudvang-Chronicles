import {TRANSFORMATION_TEMPLATES} from './transformation-data.mjs';
import {createConsequenceEffect} from './consequences.mjs';
import {escapeHtml} from './helpers.mjs';
const S='trudvang-chronicles',pending=new WeakMap();
function activeOutcome(actor,sourceId){
 const now=Number(game.time?.worldTime)||0;
 return Array.from(actor.effects??[]).some(effect=>{
  if(effect.disabled||effect.isSuppressed||effect.flags?.[S]?.diseaseOutcome?.sourceId!==sourceId)return false;
  const clock=effect.flags?.[S]?.consequenceClock;
  return clock&&clock.stageStartedAt+clock.stages.slice(clock.stage).reduce((sum,stage)=>sum+stage.seconds,0)>now;
 });
}
/** One exposure result per person and ability until disease/immunity expires.
 * Result effects are independent of the aura, so exit never cures a disease. */
export async function withDiseaseResistance(document,index,actor,roll){
 const meta=document?.flags?.[S]?.transformation,template=TRANSFORMATION_TEMPLATES[meta?.key],spec=template?.disease;
 if(!spec||spec.testIndex!==index)return roll();
 if(!actor?.isOwner)return null;
 const sourceId=template.sourceId;
 if(activeOutcome(actor,sourceId)){ui.notifications.info(game.i18n.localize('TRUDVANG.Disease.Already'));return null;}
 const locks=pending.get(actor)??new Set();pending.set(actor,locks);
 if(locks.has(sourceId)){ui.notifications.warn(game.i18n.localize('TRUDVANG.Disease.Pending'));return null;}
 locks.add(sourceId);
 try{
  const result=await roll();if(!result)return result;
  // Another client may have resolved this exposure while the dialog was open.
  if(activeOutcome(actor,sourceId))return result;
  const local=key=>game.i18n.localize('TRUDVANG.Disease.'+key),flags={[S]:{diseaseOutcome:{sourceId,kind:result.success?'immunity':'disease'}}};
  const sourceName=game.i18n.localize(`TRUDVANG.Content.Power.${sourceId}.Name`),name=sourceName,img=document.img??template.icon;
  const rolls=[];let text;
  if(result.success){
   await createConsequenceEffect(actor,{name,img,description:local('ImmuneDescription'),stackId:`disease-immunity:${sourceId}`,flags,stages:[{seconds:86400,label:local('Immunity'),description:local('ImmuneDescription'),changes:[]}]});
   text=game.i18n.format('TRUDVANG.Disease.ImmuneNotice',{actor:actor.name,source:sourceName});
  }else{
   const incubation=await new Roll(spec.incubation).evaluate(),duration=await new Roll(spec.duration).evaluate();rolls.push(incubation,duration);
   const description=game.i18n.format('TRUDVANG.Disease.FeverDescription',{penalty:spec.penalty});
   await createConsequenceEffect(actor,{name,img,description:local('IncubationDescription'),stackId:`disease:${sourceId}`,flags,stages:[
    {seconds:Math.max(1,Number(incubation.total))*60,label:local('Incubation'),description:local('IncubationDescription'),changes:[]},
    {seconds:Math.max(1,Number(duration.total))*86400,label:local('Fever'),description,changes:[{key:'system.modifiers.rolls.allActions',type:'add',value:String(spec.penalty),phase:'initial',priority:template.priority}]}
   ]});
   text=game.i18n.format('TRUDVANG.Disease.InfectedNotice',{actor:actor.name,minutes:incubation.total,days:duration.total,penalty:spec.penalty});
  }
  await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),content:`<p class="trudvang consequence-notice">${escapeHtml(text)}</p>`,rolls});
  return result;
 }finally{locks.delete(sourceId);if(!locks.size)pending.delete(actor);}
}
