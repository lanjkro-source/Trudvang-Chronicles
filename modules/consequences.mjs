import {bodyHealthUpdate} from "./rules/body-health.mjs";
import {applyDamageToActor} from "./damage-application.mjs";
import {nextConsequenceEvent} from "./rules/consumable-effects.mjs";
import {escapeHtml} from "./helpers.mjs";
const SCOPE="trudvang-chronicles";
const number=v=>Number.isFinite(Number(v))?Number(v):0;
const current=(actor,key)=>number(actor.system.resources[key].current??actor.system.resources[key].value);

/** Explicit operations, never actor preparation or formula evaluation hooks.
 * Callers choose the recipient and whether to announce the collected results. */
export async function executeConsequences({actor,operations=[],source=""}={}){
 if(!actor?.isOwner)return {rows:[],rolls:[]};
 const rows=[],rolls=[];
 for(const op of operations){
  if(!["heal","damage","fearReduction","resourceGain","risk"].includes(op.operation))throw new Error(`Unknown consequence operation: ${op.operation}`);
  let value;
  if(/^\d+(?:\.\d+)?$/.test(String(op.formula??"0")))value=Number(op.formula??0);
  else{const roll=new Roll(String(op.formula));await roll.evaluate();rolls.push(roll);value=number(roll.total);}
  value=Math.max(0,Math.trunc(value));let amount=0;
  if(op.operation==="heal"){
   const before=current(actor,"body"),after=Math.min(number(actor.system.resources.body.max),before+value);amount=Math.max(0,after-before);
   if(amount)await actor.update(bodyHealthUpdate(actor,after));
  }else if(op.operation==="fearReduction"){
   const before=current(actor,"fear");amount=Math.min(Math.max(0,before),value);
   if(amount)await actor.update({"system.resources.fear.value":number(actor._source?.system.resources.fear.value??actor.system.resources.fear.value)-amount});
  }else if(op.operation==="damage"){
   const result=await applyDamageToActor({actor,damage:value,ignoreArmor:op.ignoreArmor===true,damageType:op.damageType??"",announce:false});amount=number(result?.bodyDamage)+number(result?.temporaryDamage);
  }else if(op.operation==="resourceGain"){
   if(!["vitner","divinity","raud"].includes(op.resource))throw new Error("Unsupported consequence resource");
   const before=current(actor,op.resource),after=Math.min(number(actor.system.resources[op.resource].max),before+value);amount=Math.max(0,after-before);
   if(amount)await actor.update({[`system.resources.${op.resource}.value`]:number(actor._source?.system.resources[op.resource].value??actor.system.resources[op.resource].value)+amount});
  }else amount=value<=number(op.threshold)?1:0;
  rows.push({operation:op.operation,resource:op.resource??"",amount,rolled:value,source});
 }
 return {rows,rolls};
}
export function consequenceResultText(row){
 return game.i18n.format(`TRUDVANG.Consequence.Result.${row.operation}`,{amount:row.amount,rolled:row.rolled,source:row.source,resource:row.resource?game.i18n.localize(`TRUDVANG.Resource.${row.resource[0].toUpperCase()+row.resource.slice(1)}`):"",outcome:game.i18n.localize(row.amount?"TRUDVANG.Consequence.RiskTriggered":"TRUDVANG.Consequence.RiskAvoided")});
}
export async function announceConsequences(actor,{rows=[],rolls=[]},source=""){
 if(!rows.length)return null;
 const grouped=new Map();
 for(const row of rows){const key=`${row.source}:${row.operation}:${row.resource}`;if(row.operation==="risk"||!grouped.has(key))grouped.set(row.operation==="risk"?`${key}:${grouped.size}`:key,{...row});else grouped.get(key).amount+=row.amount;}
 return ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),rolls,
  content:`<div class="trudvang consequence-notice"><strong>${escapeHtml(actor.token?.name||actor.name)}${source?` — ${escapeHtml(source)}`:""}</strong>${[...grouped.values()].map(row=>`<p>${escapeHtml(consequenceResultText(row))}</p>`).join("")}</div>`});
}
const duration=seconds=>seconds>=86400&&seconds%86400===0?{value:seconds/86400,units:"days",expired:false}:seconds>=3600?{value:seconds/3600,units:"hours",expired:false}:{value:seconds/5,units:"rounds",expired:false};
const clockFlag=effect=>effect.flags?.[SCOPE]?.consequenceClock;
export async function createConsequenceEffect(actor,{name,img,description="",stackId,stages,tests=[]}){
 const first=stages[0],now=Number(game.time?.worldTime??0);
 const clock={name,stage:0,stageStartedAt:now,ticks:[],stages};
 const data={name:first.label?`${name} — ${first.label}`:name,img,type:"effect",description,transfer:false,
  duration:duration(first.seconds),system:{stackId,stacking:"refresh",stage:0,changes:first.changes??[],stages:stages.map(s=>({label:s.label??name,durationValue:duration(s.seconds).value,durationUnit:duration(s.seconds).units,changes:s.changes??[]}))},
  flags:{[SCOPE]:{consequenceClock:clock,consumablePolicy:first.policy??{},consequenceTests:first.tests??tests}},statuses:first.statuses??[]};
 const effect=await actor.createTrudvangEffect(data);
 return effect;
}
let worldEffects=()=>[],processing;
export function registerConsequenceHooks(provider){
 worldEffects=provider;
 Hooks.on("updateWorldTime",()=>processWorldConsequences());
 Hooks.on("ready",()=>processWorldConsequences());
}
export function processWorldConsequences(now=Number(game.time?.worldTime??0)){
 if(!game.users?.activeGM?.isSelf)return Promise.resolve();
 if(processing)return processing.then(()=>processWorldConsequences(now));
 processing=processConsequenceEffects([...worldEffects()],now).finally(()=>{processing=null;});return processing;
}
/** Process all clocks together in chronological order; boundary ticks precede
 * transitions. Persist each cursor so reloads and native expiry cannot replay it. */
export async function processConsequenceEffects(effects,now,{announce=true}={}){
 const active=new Set(effects.filter(e=>e.parent?.documentName==="Actor"&&clockFlag(e)));
 const results=new Map();let count=0;
 while(active.size){
  const next=[...active].map(effect=>({effect,event:nextConsequenceEvent(clockFlag(effect))})).filter(r=>r.event&&r.event.at<=now).sort((a,b)=>a.event.at-b.event.at||((a.event.kind==="tick"?0:1)-(b.event.kind==="tick"?0:1)))[0];
  if(!next)break;if(++count>10000)throw new Error("Too many consequence events in one time advance");
  const {effect,event}=next,actor=effect.parent,clock=structuredClone(clockFlag(effect));
  const previous=results.get(actor)??{rows:[],rolls:[]};results.set(actor,previous);
  if(event.kind==="tick"){
   const result=await executeConsequences({actor,operations:effect.disabled?[]:event.operations,source:effect.name});previous.rows.push(...result.rows);previous.rolls.push(...result.rolls);
   clock.ticks[event.index]=(clock.ticks[event.index]??0)+1;
   await effect.update({[`flags.${SCOPE}.consequenceClock`]:clock},{trudvangStageTransition:true});
  }else{
   clock.stage++;clock.stageStartedAt=event.at;clock.ticks=[];const stage=clock.stages[clock.stage];
   if(!stage){active.delete(effect);await effect.delete();continue;}
   const result=await executeConsequences({actor,operations:effect.disabled?[]:stage.onEnter??[],source:effect.name});previous.rows.push(...result.rows);previous.rolls.push(...result.rolls);
   const start=foundry.documents.ActiveEffect.implementation.getEffectStart();
   await effect.update({name:stage.label?`${clock.name} — ${stage.label}`:clock.name,"system.stage":clock.stage,"system.changes":stage.changes??[],description:stage.description??effect.description,statuses:stage.statuses??[],
    duration:duration(stage.seconds),start:{...start,time:event.at},disabled:Boolean(effect.disabled),
    [`flags.${SCOPE}.consequenceClock`]:clock,[`flags.${SCOPE}.consumablePolicy`]:foundry.data.operators.ForcedReplacement.create(stage.policy??{}),[`flags.${SCOPE}.consequenceTests`]:stage.tests??[]},{trudvangStageTransition:true});
  }
 }
 if(announce)for(const [actor,result]of results)await announceConsequences(actor,result);
 return results;
}
