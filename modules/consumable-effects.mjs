import {EXTRACT_EFFECTS,CONSUMABLE_EFFECTS} from "./rules/consumable-effects.mjs";
import {executeConsequences,createConsequenceEffect} from "./consequences.mjs";
const SCOPE="trudvang-chronicles",levels=["Mild","Moderate","Strong","Total"];
const localize=key=>game.i18n.localize(key);
const testViews=tests=>tests.map(t=>({...t,action:t.actionKey?localize(t.actionKey):t.action}));
export function consumableEffectId(item){
 return item.system?.consequenceId||item.getFlag?.(SCOPE,"starterId")?.split(".").at(-1)||item.flags?.[SCOPE]?.starterId?.split(".").at(-1)||"";
}
export async function applyConsumableConsequences(item,actor,{stage=null,durationRoll=null}={}){
 const id=consumableEffectId(item),rows=[],rolls=[],effects=[],tests=[];
 const name=item.name,img=item.img;
 const execute=async operations=>{const result=await executeConsequences({actor,operations,source:name});rows.push(...result.rows);rolls.push(...result.rolls);};
 await execute(CONSUMABLE_EFFECTS[id]??[]);
 if(id==="MinokksHeart"){
  const resistance={kind:"resist",sv:10,trait:"psyche",actionKey:"TRUDVANG.Consequence.ResistCharge"};
  effects.push(await actor.createTrudvangEffect({name,img,type:"effect",transfer:false,description:localize("TRUDVANG.Consequence.MinokksDescription"),
   duration:{value:null,units:"rounds"},system:{stackId:"consumable:MinokksHeart",stacking:"refresh",changes:[]},flags:{[SCOPE]:{consequenceTests:[resistance]}}}));
 }
 if(id==="FairyDust"){
  const bonus=new Roll("1d3+1"),duration=new Roll("1d5");await bonus.evaluate();await duration.evaluate();rolls.push(bonus,duration);
  const description=game.i18n.format("TRUDVANG.Consequence.FairyDust",{bonus:bonus.total,hours:duration.total});
  effects.push(await createConsequenceEffect(actor,{name,img,description,stackId:"consumable:FairyDust",stages:[{seconds:Number(duration.total)*3600,description,changes:[{key:"system.modifiers.rolls.allActions",type:"add",value:String(bonus.total),phase:"initial"}]}]}));
 }
 if(id==="LindwurmRegeneratingHeart")tests.push({kind:"resist",sv:16,trait:"constitution",actionKey:"TRUDVANG.Consequence.ResistLindwurm"});
 const config=EXTRACT_EFFECTS[id];
 if(config&&stage){
  const index=["mild","moderate","strong","total"].indexOf(stage.id);
  let seconds=config.seconds;
  if(typeof seconds==="string"){
   let rolled=durationRoll;if(!rolled){rolled=new Roll(seconds);await rolled.evaluate();rolls.push(rolled);}seconds=Number(rolled.total)*config.scale;
  }
  const stages=[];
  for(let i=index;i>=0;i--){const template=config.stages[i],description=localize(`TRUDVANG.Content.Item.${id}.${levels[i]}`);
   stages.push({...template,seconds,label:localize(`TRUDVANG.Efficacy.${levels[i]}`),description});}
  if(stages.length){
   effects.push(await createConsequenceEffect(actor,{name,img,description:stages[0].description,stackId:`consumable:${id}`,stages}));
   await execute(stages[0].onEnter??[]);
  }
  if(id==="Svartljunghed"&&index===3){
   const sleep=new Roll("1d6");await sleep.evaluate();rolls.push(sleep);
   effects.push(await createConsequenceEffect(actor,{name:localize("TRUDVANG.Consequence.Sleep"),img,description:localize("TRUDVANG.Content.Item.Svartljunghed.Total"),stackId:"consumable:Svartljunghed:sleep",stages:[{seconds:Number(sleep.total)*3600,statuses:["sleep"],changes:[]}]}));
  }
 }
 return {rows,rolls,effects:effects.filter(Boolean),tests:testViews(tests),description:id==="LindwurmRegeneratingHeart"?localize("TRUDVANG.Content.Item.LindwurmRegeneratingHeart.Description"):""};
}
