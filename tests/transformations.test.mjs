import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {transformationProfile,transformedTrait,movementProfile,consumeTemporaryHealth,transformationRollRows,TRANSFORMATION_SCOPE as S} from "../modules/rules/transformation-profile.mjs";
import {TRANSFORMATION_TEMPLATES as templates,TRANSFORMATIONS_BY_SOURCE as sources} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {resolveCombatPools} from "../modules/rules/combat-pool-resolver.mjs";
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
const {annotateRuleTestDescription}=await import("../modules/rule-tests.mjs");
const {applyTransformation,resolveDuration,transformationLinks,syncTransformationTokens}=await import("../modules/transformations.mjs");
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");},innerHTML:""})};
const effect=(rules,extra={})=>({id:"form",name:"Form",flags:{[S]:{transformation:{rules,temporaryHP:10}}},...extra});
test("all generated effect offers have bilingual text, valid numeric changes and resolvable manual successors",()=>{
 for(const code of ["fr","en"]){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  for(const [key,t]of Object.entries(templates)){
   assert.ok(language.TRUDVANG.Content.Transformation[key].Name,key);
   assert.ok(language.TRUDVANG.Content.Transformation[key].Description,key);
   for(const c of t.changes)assert.ok(Number.isFinite(Number(c.value)),key);
   if(t.priority!==undefined){
    assert.ok([10,20,30,40,50].includes(t.priority),key);
    for(const c of t.changes)assert.equal(c.priority,t.priority,key);
   }
   for(const id of t.related)assert.ok(templates[`${t.sourceId}#${id}`],`${key} -> ${id}`);
  }
 }
 assert.equal(Object.keys(sources).length,73);
});
test("forms compose without modifying source data and disabled or expired effects do not contribute",()=>{
 const actor={type:"character",system:{effective:{traits:{strength:1,dexterity:0}}},effects:[effect({size:7,traits:[{trait:"strength",method:"highest",value:6}],suspendEquipment:true}),effect({size:10},{disabled:true}),effect({size:3},{duration:{expired:true}})]};
 const before=structuredClone(actor);
 const profile=transformationProfile(actor);
 assert.equal(profile.size,7);assert.equal(profile.traits.strength,6);
 assert.deepEqual(actor,before);
 actor.effects=[];assert.equal(transformationProfile(actor).size,1);
 assert.equal(transformedTrait(4,{method:"degrees",value:1}),6);
 assert.equal(transformedTrait(4,{method:"add",value:4,max:6}),6);
});
test("movement offers add flight/swim and reductions without overwriting the original modes",()=>{
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"multiply",value:0.5},{mode:"flight",method:"baseMultiple",value:4}]),{land:5,flight:40});
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"replace",value:0},{mode:"swim",method:"baseMultiple",value:2}]),{land:0,swim:20});
});
test("temporary health is spent first and only unabsorbed damage reaches ordinary health",()=>{
 const a=effect({});const b=effect({},{id:"second"});
 const result=consumeTemporaryHealth([{effect:a,remaining:5},{effect:b,remaining:3}],10);
 assert.equal(result.damage,2);assert.equal(result.updates.length,2);
 assert.equal(result.updates[0][`flags.${S}.transformation.temporaryHP`],0);
 assert.equal(a.flags[S].transformation.temporaryHP,10);
});
test("the seven Joaring powers have all eight generated tests and a link for each test",()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={i18n:{lang:"fr",localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key}};
 globalThis.CONFIG={TRUDVANG:{}};
 const ids=Object.keys(RULE_TESTS_BY_CATALOG_ID).filter(id=>id.startsWith("holy-joaringfaith"));
 assert.equal(ids.length,7);assert.equal(ids.reduce((n,id)=>n+RULE_TESTS_BY_CATALOG_ID[id].length,0),8);
 for(const id of ids){
  const description=language.TRUDVANG.Content.Power[id].Description;
  const html=annotateRuleTestDescription(description,{system:{catalogId:id}});
  for(let i=0;i<RULE_TESTS_BY_CATALOG_ID[id].length;i++)assert.ok(html.includes(`data-test-index="${i}"`),id);
 }
});
test("applying a form creates independent owned grants and native trait changes, keeping original items intact",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"player"},time:{worldTime:100},i18n:{localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key}};
 globalThis.foundry={utils:{deepClone:structuredClone},applications:{api:{DialogV2:{wait:async()=>({duration:"1 minute"})}}}};
 const items=[];let created;
 const actor={system:{},canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>(created=data,{...data,id:"new-form"}),createEmbeddedDocuments:async(type,data)=>items.push(...data),getActiveTokens:()=>[],isOwner:true};
 const key=Object.keys(templates).find(k=>k.endsWith("#aspect-du-corbeau"));
 assert.ok(key);
 await applyTransformation(actor,key);
 assert.equal(created.duration.value,60);assert.equal(created.transfer,false);
 assert.ok(created.system.changes.some(c=>c.key==="system.effective.traits.dexterity"&&c.value==="4"));
 assert.ok(created.system.changes.length>0);
 assert.ok(created.system.changes.every(c=>c.priority===50),"level 5 applies priority 50 to dynamically generated trait changes");
 assert.equal(created.flags[S].transformation.rules.traitsApplied,true);
 assert.equal(items[0].flags[S].transformationGrant,"new-form");
 assert.equal(items[0].system.damage,"1d10");
 assert.equal(items[0].system.weaponActions,4);
 assert.deepEqual(await resolveDuration("3 jours"),{value:259200,units:"seconds"});
 const diseaseKey=Object.keys(templates).find(k=>k.endsWith("#warg-disease"));
 assert.ok(transformationLinks({uuid:"Actor.a.ActiveEffect.disease",flags:{[S]:{transformation:{sourceId:templates[diseaseKey].sourceId,related:templates[diseaseKey].related}}}}).includes("warg-garou"));
});
test("recovery penalties name their contributor, apply once, and leave unrelated tests alone",()=>{
 const actor={effects:[effect({testFactor:{dexterity:0.5}})]};
 assert.deepEqual(transformationRollRows(actor,{target:15,skillKey:"agility"}),[{label:"Form",value:-8}]);
 assert.deepEqual(transformationRollRows(actor,{target:15,skillKey:"knowledge"}),[]);
 actor.effects[0].disabled=true;
 assert.deepEqual(transformationRollRows(actor,{target:15,traitKey:"dexterity"}),[]);
});
test("vision is restored after removal, while later manual token edits remain intact",async()=>{
 const token={sight:{visionMode:"basic"},flags:{},async update(data){
  if(data["sight.visionMode"])this.sight.visionMode=data["sight.visionMode"];
  if(data[`flags.${S}.transformationVision`])this.flags[S]={transformationVision:data[`flags.${S}.transformationVision`]};
  if(data[`flags.${S}.-=transformationVision`]!==undefined)delete this.flags[S].transformationVision;
 }};
 const actor={isOwner:true,system:{},getActiveTokens:()=>[token],effects:[effect({vision:"darkvision"})]};
 await syncTransformationTokens(actor);assert.equal(token.sight.visionMode,"darkvision");
 actor.effects=[];await syncTransformationTokens(actor);assert.equal(token.sight.visionMode,"basic");
 actor.effects=[effect({vision:"darkvision"})];await syncTransformationTokens(actor);
 token.sight.visionMode="tremorsense";actor.effects=[];await syncTransformationTokens(actor);
 assert.equal(token.sight.visionMode,"tremorsense");
});
test("a PC may use a granted reserve only for its granted attack; disabling the effect removes the reserve",()=>{
 const weapon={id:"extra",name:"Extra attack",type:"weapon",system:{category:"natural",combatSpecialty:"natural",naturalCombatPoints:5,naturalCombatPool:"extra"},flags:{[S]:{transformationGrant:"form"}}};
 const actor={type:"character",system:{skills:{fighting:{value:1}},combatPools:{},resources:{combat:{}}},items:[weapon],effects:[effect({})],getSkillValue:()=>1,findRuleKnowledge:()=>null};
 const pool=resolveCombatPools({actor,item:weapon,context:{action:"attack"}}).pools.find(p=>p.id==="natural:extra");
 assert.equal(pool.max,5);assert.equal(pool.eligible,true);
 const other=resolveCombatPools({actor,item:{id:"other",type:"weapon",system:{category:"natural"}},context:{action:"attack"}}).pools.find(p=>p.id==="natural:extra");
 assert.equal(other.eligible,false);
 actor.effects[0].disabled=true;
 assert.ok(!resolveCombatPools({actor,item:weapon,context:{action:"attack"}}).pools.some(p=>p.id==="natural:extra"));
});
