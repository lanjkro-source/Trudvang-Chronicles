/** FR Livre des règles pp.130–135; Bestiaire pp.24,73,118,142.
 * Structure only: descriptions and names remain in the language catalogues. */
const change=(key,value,type="add")=>({key:`system.${key}`,value:String(value),type,phase:"initial"});
const roll=(key,value)=>change(`modifiers.rolls.${key}`,value);
const profile=(key,value)=>change(`transformation.${key}`,JSON.stringify(value),"override");
const tick=(interval,operation,formula)=>({interval,operations:[{operation,formula,damageType:"poison",ignoreArmor:true}]});
const row=(changes=[],extra={})=>({changes,...extra});
export const EXTRACT_EFFECTS={
 Argmurkla:{seconds:"1d6",scale:5,stages:[row([roll("attack",1)]),row([change("effective.traits.strength",1,"upgrade"),roll("attack",1),roll("parry",-1)]),row([change("effective.traits.strength",2,"upgrade"),roll("attack",1),roll("parry",-1)]),row([change("effective.traits.strength",4,"upgrade"),roll("attack",2),roll("parry",-2)])]},
 DragonBlood:{seconds:86400,stages:[2,4,8,12].map(n=>row([change("modifiers.protection",n)]))},
 FrostboarFat:{seconds:7200,stages:[row([],{policy:{temperature:[-20,30]}}),row([],{policy:{temperature:[-40,50],magicalTemperature:true}}),row([],{policy:{temperature:[-40,50],magicalTemperature:true,damageFactors:{fire:.75,cold:.75}}}),row([],{policy:{temperature:[-40,50],magicalTemperature:true,damageFactors:{fire:.5,cold:.5}}})]},
 Gaveblom:{seconds:28800,stages:[28800,14400,7200,3600].map(interval=>row([],{periodic:[tick(interval,"heal","1d3")]}))},
 Grindblom:{seconds:"1d6",scale:60,stages:[3,0,-2,-5].map((modifier,i)=>row([],{tests:[{kind:"resist",sv:15+modifier,trait:"aucun",actionKey:"TRUDVANG.Consequence.FindWay"},...(i<2?[{kind:"skill",skill:"shadowArts",sv:i===0?-5:-10,actionKey:"TRUDVANG.Consequence.Detect"}]:[])]}))},
 Manetter:{seconds:86400,stages:[28800,14400,7200,3600].map((interval,i)=>row([],{periodic:[tick(interval,"damage","1"),...(i>=2?[{interval:3600,once:true,operations:[{operation:"risk",formula:"1d20",threshold:i===2?1:2}]}]:[])]}))},
 Pustartobak:{seconds:240,stages:[row([],{onEnter:[{operation:"damage",formula:"1",damageType:"poison",ignoreArmor:true}]}),...[1,2,3].map(n=>row([],{periodic:[tick(60,"damage",String(n))]}))]},
 Svartljunghed:{seconds:3600,stages:[row(),row([roll("initiative",-2),roll("skills.knowledge",-2),change("modifiers.fearValue",-4)]),row([roll("initiative",-4),roll("skills.knowledge",-4),change("modifiers.fearValue",-8)]),row()]},
 Tornrot:{seconds:7200,stages:[0,.5,0,0].map((factor,i)=>row([profile("ignoreWounds",true),...(i>=2?[change("modifiers.damageByUsage.melee",i-1),change("modifiers.damageByUsage.throwing",i-1),roll("parry",1-i)]:[])],{policy:{ignoreFatigue:true,...(i?{fearFactor:factor}:{})}}))},
 Trollilles:{seconds:21600,stages:[1,.75,.5,0].map(factor=>row([],{policy:{damageFactors:{poison:factor,disease:factor},diseaseFactor:factor}}))},
 Tungelin:{seconds:86400,stages:[6,4,2,0].map(hours=>row([],{policy:{sleepHours:hours}}))},
 WoundBalm:{seconds:86400,stages:[row(),...[1,2,3].map((n,i)=>row([change("modifiers.recovery",n),roll("movementActions",[-2,-5,-10][i])]))]}
};
export const CONSUMABLE_EFFECTS={
 FreshVidrjotunSap:[{operation:"heal",formula:"1d10x>=6"}],
 HardenedVidrjotunSap:[{operation:"heal",formula:"1d10x>=8"}],
 MinokksHeart:[{operation:"fearReduction",formula:"1d10x>=10"}]
};
export function nextConsequenceEvent(clock){
 const stage=clock.stages[clock.stage];if(!stage)return null;
 const end=clock.stageStartedAt+stage.seconds;
 const events=(stage.periodic??[]).flatMap((p,index)=>p.once&&(clock.ticks?.[index]??0)>0?[]:[{kind:"tick",index,at:clock.stageStartedAt+p.interval*((clock.ticks?.[index]??0)+1),operations:p.operations}]).filter(e=>e.at<=end);
 events.push({kind:"stage",at:end});
 return events.sort((a,b)=>a.at-b.at||((a.kind==="tick"?0:1)-(b.kind==="tick"?0:1)))[0];
}
export function consumablePolicy(actor){
 const result={damageFactors:{},names:[]};
 for(const effect of actor?.allApplicableEffects?.()??actor?.effects??[]){
  if(effect.disabled||effect.isSuppressed||effect.duration?.expired&&!effect.flags?.["trudvang-chronicles"]?.consequenceClock)continue;
  const p=effect.flags?.["trudvang-chronicles"]?.consumablePolicy??{};
  if(Object.keys(p).length)result.names.push(effect.name);
  for(const [kind,factor] of Object.entries(p.damageFactors??{}))result.damageFactors[kind]=Math.min(result.damageFactors[kind]??1,factor);
  if(p.fearFactor!==undefined)result.fearFactor=Math.min(result.fearFactor??1,p.fearFactor);
  if(p.sleepHours!==undefined)result.sleepHours=Math.min(result.sleepHours??8,p.sleepHours);
  if(p.ignoreFatigue)result.ignoreFatigue=true;
  if(p.temperature)result.temperature=result.temperature?[Math.min(result.temperature[0],p.temperature[0]),Math.max(result.temperature[1],p.temperature[1])]:p.temperature;
  if(p.magicalTemperature)result.magicalTemperature=true;
 }
 return result;
}

/** Keep the existing effect editor authoritative for a managed clock. Saving
 * stages restarts the active stage just as it does for ordinary staged effects,
 * without replaying its entry consequences. */
export function editedConsequenceClock(effect,data,now=Number(game.time?.worldTime??0)){
 const existing=effect.flags?.["trudvang-chronicles"]?.consequenceClock;
 if(!existing||data.flags?.["trudvang-chronicles"]?.consequenceClock||data["flags.trudvang-chronicles.consequenceClock"])return undefined;
 if(!data.system?.stages&&!data.duration&&!data.start&&data.system?.stage===undefined)return undefined;
 if(data.duration?.value===null)return null;
 const clock=structuredClone(existing),scale={rounds:5,turns:5,seconds:1,minutes:60,hours:3600,days:86400,weeks:604800,months:2592000,years:31536000};
 if(Array.isArray(data.system?.stages)){
  clock.stages=data.system.stages.map((s,i)=>({...clock.stages[i],label:s.label,changes:s.changes,seconds:Number(s.durationValue)*scale[s.durationUnit]}));
 }
 if(!clock.stages.length)return null;
 clock.stage=Math.min(Math.max(0,Number(data.system?.stage??clock.stage)),clock.stages.length-1);
 if(data.duration?.value!==undefined)clock.stages[clock.stage].seconds=Number(data.duration.value)*scale[data.duration.units??effect.duration?.units??"rounds"];
 if(data.start){clock.stageStartedAt=Number(data.start.time??now);clock.ticks=[];}
 return clock;
}
