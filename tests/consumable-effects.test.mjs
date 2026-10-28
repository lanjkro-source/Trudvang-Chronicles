import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const locales=Object.fromEntries(["fr","en"].map(l=>[l,JSON.parse(readFileSync(new URL(`../lang/${l}.json`,import.meta.url),"utf8"))]));
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
const set=(o,p,v)=>{const parts=p.split("."),last=parts.pop();const parent=parts.reduce((v,k)=>v[k]??={},o);parent[last]=v?.replaceValue??v;};
const cards=[],messages=[],formulas=[];let results=[];
globalThis.foundry={applications:{handlebars:{renderTemplate:async(path,data)=>{cards.push({path,data});return "card";}}},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime})}}},data:{operators:{ForcedReplacement:{create:v=>({replaceValue:v})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.value=String(v).replaceAll("<","&lt;");},get innerHTML(){return this.value;}})};
globalThis.game={time:{worldTime:0},i18n:{lang:"fr",localize:key=>get(locales[game.i18n.lang],key)??key,format:(key,args)=>String(get(locales[game.i18n.lang],key)??key).replace(/\{(\w+)\}/g,(_,k)=>args[k]??"")}};
globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.id}),create:async data=>{messages.push(data);return data;}};
globalThis.Roll=class{constructor(formula){this.formula=formula;formulas.push(formula);}async evaluate(){this.total=results.shift()??2;return this;}};
const {executeConsequences,createConsequenceEffect,processConsequenceEffects}=await import("../modules/consequences.mjs");
const {applyConsumableConsequences}=await import("../modules/consumable-effects.mjs");
const {EXTRACT_EFFECTS,consumablePolicy}=await import("../modules/rules/consumable-effects.mjs");
const {consumeInventoryItem}=await import("../modules/consumables.mjs");
const {ruleTestsForDocument,annotateRuleTestDescription}=await import("../modules/rule-tests.mjs");
function actor(){
 const a={id:"a",uuid:"Actor.a",name:"A",documentName:"Actor",type:"character",isOwner:true,effects:[],items:[],system:{resources:{body:{current:10,value:10,max:100},fear:{current:12,value:12,max:50},vitner:{current:0,value:0,max:20}},modifiers:{}},allApplicableEffects(){return this.effects;}};
 a._source={system:structuredClone(a.system)};
 a.update=async data=>{for(const[k,v]of Object.entries(data)){set(a,k,v);set(a._source,k,v);if(k==="system.resources.body.value")a.system.resources.body.current=v;if(k==="system.resources.fear.value")a.system.resources.fear.current=v;if(k==="system.resources.vitner.value")a.system.resources.vitner.current=v;}};
 a.createTrudvangEffect=async data=>{let e=a.effects.find(e=>e.system.stackId===data.system.stackId);if(e){Object.assign(e,structuredClone(data));return e;}e={...structuredClone(data),parent:a};e.update=async data=>{for(const[k,v]of Object.entries(data))set(e,k,v);};e.delete=async()=>{a.effects.splice(a.effects.indexOf(e),1);e.deleted=true;};a.effects.push(e);return e;};
 a.deleteEmbeddedDocuments=async(type,ids)=>{a.items=a.items.filter(i=>!ids.includes(i.id));};
 a.updateEmbeddedDocuments=async(type,updates)=>{for(const u of updates)for(const[k,v]of Object.entries(u))if(k!=="_id")set(a.items.find(i=>i.id===u._id),k,v);};
 return a;
}
const item=id=>({id,name:id,img:"",type:EXTRACT_EFFECTS[id]?"potion":"gear",system:{consequenceId:id,quantity:1,consumable:true}});
test("generic immediate consequences clamp healing and fear, permit negative health and use threshold-open formulas",async()=>{
 const a=actor();a.system.resources.body.current=-10;a.system.resources.body.value=-10;
 results=[5,30];formulas.length=0;
 const result=await executeConsequences({actor:a,operations:[{operation:"heal",formula:"1d10x>=6"},{operation:"fearReduction",formula:"1d10x>=10"}]});
 assert.equal(a.system.resources.body.current,-5);assert.equal(a.system.resources.fear.current,0);assert.deepEqual(formulas,["1d10x>=6","1d10x>=10"]);assert.equal(result.rows[1].amount,12);
 await executeConsequences({actor:a,operations:[{operation:"heal",formula:"999"},{operation:"resourceGain",resource:"vitner",formula:"30"}]});
 assert.equal(a.system.resources.body.current,100);assert.equal(a.system.resources.vitner.current,20);
 await assert.rejects(executeConsequences({actor:a,operations:[{operation:"arbitrary-code",formula:"0"}]}));
});
test("minokks reduces fear and creates only a descriptive resistance effect; lindwurm only describes and offers resistance",async()=>{
 const a=actor();results=[4];const result=await applyConsumableConsequences(item("MinokksHeart"),a);
 assert.equal(a.system.resources.fear.current,8);assert.equal(result.effects.length,1);const effect=result.effects[0];
 assert.equal(effect.duration.value,null);assert.equal(effect.system.changes.length,0);
 assert.equal(ruleTestsForDocument(effect)[0].sv,10);assert.equal(ruleTestsForDocument(effect)[0].trait,"psyche");assert.match(annotateRuleTestDescription(effect.description,effect),/roll-rule-test/);
 const lind=item("LindwurmRegeneratingHeart");a.items=[lind];messages.length=0;
 await consumeInventoryItem(lind,a);assert.equal(a.items.length,0);assert.equal(a.system.resources.body.current,10);assert.equal(a.effects.length,1);
 assert.equal(messages[0].flags["trudvang-chronicles"].consequenceTests[0].sv,16);assert.match(messages[0].content,/consequence-resistance/);
 game.i18n.lang="en";assert.match(annotateRuleTestDescription(effect.description,effect),/roll-rule-test/);game.i18n.lang="fr";
});
test("fairy dust uses one dose, rolls its bonus and duration once and never resolves wishes",async()=>{
 const a=actor(),dust=item("FairyDust");dust.system.quantity=7;a.items=[dust];results=[3,4];formulas.length=0;
 await consumeInventoryItem(dust,a);
 assert.equal(dust.system.quantity,6);assert.deepEqual(formulas,["1d3+1","1d5"]);assert.equal(a.effects[0].system.changes[0].value,"3");assert.equal(a.effects[0].duration.value,4);
});
test("all twelve extracts create selected-to-mild stages with equal durations and stage-specific descriptions",async()=>{
 for(const id of Object.keys(EXTRACT_EFFECTS)){
  const a=actor();results=[3,2];const r=await applyConsumableConsequences(item(id),a,{stage:{id:"strong"},durationRoll:{total:3}});
  const effect=r.effects[0],clock=effect.flags["trudvang-chronicles"].consequenceClock;
  assert.equal(clock.stages.length,3,id);assert.ok(clock.stages.every(s=>s.seconds===clock.stages[0].seconds),id);
  assert.equal(effect.description,game.i18n.localize(`TRUDVANG.Content.Item.${id}.Strong`));assert.ok(clock.stages.every(s=>!s.description.startsWith("TRUDVANG.")));
 }
});
test("a whole-day jump processes seven Gaveblom ticks across all three stages once, then deletes the effect",async()=>{
 const a=actor();game.time.worldTime=0;results=Array(7).fill(2);
 const r=await applyConsumableConsequences(item("Gaveblom"),a,{stage:{id:"strong"}});const effect=r.effects[0];
 const outcome=await processConsequenceEffects(a.effects,86400,{announce:false});
 assert.equal(a.system.resources.body.current,24);assert.equal(outcome.get(a).rows.length,7);assert.equal(effect.deleted,true);
 await processConsequenceEffects(a.effects,86400,{announce:false});assert.equal(a.system.resources.body.current,24);
});
test("poison bypasses armor, boundary ticks precede expiration and policy stages replace previous flags",async()=>{
 const a=actor();a.system.protection=99;results=[];
 const p=await createConsequenceEffect(a,{name:"Poison",stackId:"p",stages:[{seconds:10,changes:[],policy:{damageFactors:{poison:0}},periodic:[{interval:10,operations:[{operation:"damage",formula:"2",ignoreArmor:true,damageType:"poison"}]}]},{seconds:10,changes:[],policy:{},periodic:[{interval:10,operations:[{operation:"damage",formula:"2",ignoreArmor:true,damageType:"poison"}]}]}]});
 await processConsequenceEffects(a.effects,10,{announce:false});assert.equal(a.system.resources.body.current,10);assert.equal(consumablePolicy(a).damageFactors.poison,undefined);
 await processConsequenceEffects(a.effects,20,{announce:false});assert.equal(a.system.resources.body.current,8);assert.equal(p.deleted,true);
});
test("clock cursors survive reload, early native expiry does not prematurely advance a stage, disabled clocks skip consequences and still expire",async()=>{
 const a=actor();const e=await createConsequenceEffect(a,{name:"Heal",stackId:"heal",stages:[{seconds:10,changes:[],periodic:[{interval:5,operations:[{operation:"heal",formula:"1"}]}]}]});
 await processConsequenceEffects(a.effects,5,{announce:false});assert.equal(a.system.resources.body.current,11);
 e.flags=JSON.parse(JSON.stringify(e.flags));await processConsequenceEffects(a.effects,5,{announce:false});assert.equal(a.system.resources.body.current,11);
 e.disabled=true;await processConsequenceEffects(a.effects,10,{announce:false});assert.equal(a.system.resources.body.current,11);assert.equal(e.deleted,true);
});

test("environment protection neutralizes covered cold and sleepless penalties without erasing other conditions",async()=>{
 const {environmentActorValues}=await import("../modules/rules/environment.mjs");
 const a=actor();a.findKnowledgeItem=()=>null;
 await applyConsumableConsequences(item("FrostboarFat"),a,{stage:{id:"mild"}});
 const protectedValue=environmentActorValues(a,{temperature:"freezing",temperatureClothing:false});assert.equal(protectedValue.protection,4);assert.equal(protectedValue.frostbite,0);assert.equal(protectedValue.modifier,0);
 const intense=environmentActorValues(a,{temperature:"intense",temperatureClothing:false});assert.equal(intense.protection,0);assert.equal(intense.modifier,-6);
 await applyConsumableConsequences(item("Tungelin"),a,{stage:{id:"total"}});
 const sleepless=environmentActorValues(a,{sleep:"sleepless",wind:"storm"});assert.equal(sleepless.protection,2);assert.equal(sleepless.modifier,-2);
});
test("the native effect editor updates clock duration and changes without replaying entry operations",async()=>{
 const {editedConsequenceClock}=await import("../modules/rules/consumable-effects.mjs");
 const a=actor(),e=await createConsequenceEffect(a,{name:"X",stackId:"x",stages:[{seconds:10,changes:[],onEnter:[{operation:"heal",formula:"1"}]}]});
 const clock=editedConsequenceClock(e,{system:{stage:0,stages:[{label:"Edited",durationValue:3,durationUnit:"days",changes:[{key:"system.modifiers.protection",type:"add",value:"2"}]}]},duration:{value:3,units:"days"},start:{time:7}});
 assert.equal(clock.stages[0].seconds,259200);assert.equal(clock.stageStartedAt,7);assert.equal(clock.stages[0].changes[0].value,"2");assert.equal(a.system.resources.body.current,10);
 assert.equal(editedConsequenceClock(e,{duration:{value:null}}),null);
});
