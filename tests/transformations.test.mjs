import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {transformationProfile,transformedTrait,movementProfile,consumeTemporaryHealth,transformationRollRows,effectRules,TRANSFORMATION_SCOPE as S} from "../modules/rules/transformation-profile.mjs";
import {EFFECT_RULE_PREFIX,changesFromRules,rulesFromChanges,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";
import {temporaryHealthLayers} from "../modules/rules/transformation-profile.mjs";
import {effectStatus} from "../modules/rules/effect-status.mjs";
import {TRANSFORMATION_TEMPLATES as templates,TRANSFORMATIONS_BY_SOURCE as sources} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {resolveCombatPools} from "../modules/rules/combat-pool-resolver.mjs";
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
const {annotateRuleTestDescription}=await import("../modules/rule-tests.mjs");
const {applyTransformation,resolveDuration,transformationLinks,syncTransformationTokens,syncEffectGrants}=await import("../modules/transformations.mjs");
const {applyDamageToActor}=await import("../modules/damage-application.mjs");
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");},innerHTML:""})};
const effect=(rules,extra={})=>({id:"form",name:"Form",flags:{[S]:{transformation:{rules,temporaryHP:10}}},...extra});
test("all generated effect offers have bilingual text, valid numeric changes and resolvable manual successors",()=>{
 for(const code of ["fr","en"]){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  for(const [key,t]of Object.entries(templates)){
   assert.ok(language.TRUDVANG.Content.Transformation[key].Name,key);
   assert.ok(language.TRUDVANG.Content.Transformation[key].Description,key);
   for(const c of t.changes.filter(c=>!c.key.startsWith(EFFECT_RULE_PREFIX)))assert.ok(Number.isFinite(Number(c.value)),key);
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
 assert.equal(created.flags[S].transformation.rules,undefined,"configuration is editable changes, never hidden flags");
 assert.equal(effectRules(created).traits,undefined,"resolved traits are native scalar changes and cannot apply twice");
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

test("a hand-created rage effect exposes all consequences and spends its temporary health before ordinary health",async()=>{
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 const rage={id:"rage",name:"Rage",system:{changes:structuredClone(templates[key].changes)}};
 const actor={type:"character",isOwner:true,items:[],effects:[rage],system:{effective:{traits:{}},resources:{body:{value:32,max:43}},modifiers:{}},_source:{system:{resources:{body:{value:32}}}}};
 const set=(object,path,value)=>{const parts=path.split('.'),last=parts.pop();parts.reduce((o,k)=>o[k]??={},object)[last]=value;};
 actor.updateEmbeddedDocuments=async(type,rows)=>{assert.equal(type,"ActiveEffect");for(const row of rows)for(const [key,value]of Object.entries(row))if(key!=="_id")set(rage,key,value);};
 actor.update=async updates=>{for(const [key,value]of Object.entries(updates)){set(actor,key,value);set(actor._source,key,value);}};
 const rules=effectRules(rage);
 assert.equal(rules.temporaryHP,5);assert.equal(rules.fearFactor,"1d10");
 assert.equal(rules.noParry,true);assert.equal(rules.noDodge,true);assert.equal(rules.ignoreFear,true);
 assert.deepEqual(rules.damage,{value:2,usages:["melee","throwing","natural"]});
 actor.transformationProfile=transformationProfile(actor);
 assert.equal(effectStatus(actor).temporaryHP,5);
 let result=await applyDamageToActor({actor,damage:3,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,3);assert.equal(result.bodyDamage,0);
 assert.equal(actor.system.resources.body.value,32);assert.equal(effectStatus(actor).temporaryHP,2);
 result=await applyDamageToActor({actor,damage:4,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,2);assert.equal(result.bodyDamage,2);assert.equal(actor.system.resources.body.value,30);
 assert.equal(effectStatus(actor).temporaryHP,0);
 rage.disabled=true;assert.equal(temporaryHealthLayers(actor).length,0);
 rage.disabled=false;assert.equal(temporaryHealthLayers(actor).length,0,"reenabling never refills spent health");
 actor.effects=[];assert.equal(actor.system.resources.body.value,30,"removing Rage cannot erase wounds");
});

test("state panels reflect movement, named fear immunity and editable restrictions for characters and NPCs",()=>{
 for(const type of ["character","npc"]){
  const form={id:"custom",name:"Effet du MJ",system:{changes:changesFromRules({movement:[{mode:"flight",method:"replace",value:24}],ignoreFear:true,noParry:true})}};
  const actor={type,system:{effective:{traits:{}},modifiers:{movement:2}},effects:[form]};
  actor.transformationProfile=transformationProfile(actor);
  actor.transformationMovement=movementProfile(12,[{mode:"terrestre",max:"10 m"}],actor.transformationProfile.movements,2);
  const state=effectStatus(actor);
  assert.deepEqual(state.movement.map(row=>row.value),[12,24]);
  assert.equal(state.immunity,"Effet du MJ");assert.match(state.notes[0].details,/noParry/);
  form.system.changes=changesFromRules({movement:[{mode:"swim",method:"replace",value:8}]});
  actor.transformationProfile=transformationProfile(actor);
  assert.equal(effectStatus(actor).immunity,"");assert.equal(actor.transformationProfile.noParry,false);
 }
});

test("cancel and close never validate a duration or apply an effect",async()=>{
 globalThis.game={user:{},i18n:{localize:key=>key}};
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 for(const answer of [null,false,"cancel","close",{action:"cancel"}]){
  globalThis.foundry.applications.api.DialogV2.wait=async()=>answer;
  const actor={canUserModify:()=>true,createTrudvangEffect:()=>assert.fail("cancel cannot create an effect")};
  assert.equal(await applyTransformation(actor,key),null);
 }
});

test("manually edited attack changes update granted items and concurrent hooks cannot duplicate them",async()=>{
 globalThis.game={i18n:{localize:key=>key}};
 let next=0;
 const actor={uuid:"Actor.custom",isOwner:true,items:[],async createEmbeddedDocuments(type,items){
  for(const item of items)this.items.push({...item,id:String(++next)});
 },async deleteEmbeddedDocuments(type,ids){this.items=this.items.filter(i=>!ids.includes(i.id));}};
 const form={id:"custom",parent:actor,system:{changes:changesFromRules({attacks:[{name:"Griffes",damage:"1d10",combatPoints:5}]})}};
 await Promise.all([syncEffectGrants(form),syncEffectGrants(form)]);
 assert.equal(actor.items.length,1);assert.equal(next,1);
 form.system.changes=changesFromRules({attacks:[{name:"Morsure",damage:"2d10",combatPoints:10}]});
 await syncEffectGrants(form);assert.equal(actor.items.length,1);assert.equal(actor.items[0].system.damage,"2d10");
 form.system.changes=[];await syncEffectGrants(form);assert.equal(actor.items.length,0);
});

test("profile values round-trip through editable changes without hidden configuration",()=>{
 const rules={temporaryHP:5,ignoreFear:true,fearFactor:"1d10",movement:[{mode:"flight",method:"replace",value:24}],damage:{value:2,usages:["melee"]}};
 assert.deepEqual(rulesFromChanges(changesFromRules(rules,{priority:20})),rules);
 const legacy=effect({ignoreFear:true},{system:{changes:[]}});
 assert.equal(effectRules(legacy).ignoreFear,true);
 legacy.flags[S].transformation.editableChanges=true;
 assert.deepEqual(effectRules(legacy),{},"clearing migrated rows cannot revive old hidden properties");
 assert.equal(validProfileChange({key:"system.transformation.movement",value:"not JSON"}),false);
 assert.deepEqual(rulesFromChanges([{key:"system.transformation.movement",type:"override",value:"not JSON"}]),{},"invalid module data cannot break actor preparation");
});

test("dropping an edited reference keeps the GM's changes rather than resetting to the catalogue",async()=>{
 globalThis.game={user:{id:"owner"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 let result;
 const actor={isOwner:true,system:{},items:[],canUserModify:()=>true,getActiveTokens:()=>[],createTrudvangEffect:async data=>(result=data,{...data,id:"edited"})};
 const source={documentName:"ActiveEffect",name:"Rage ajustée",uuid:"Actor.a.ActiveEffect.rage",description:"Description du MJ",
  system:{changes:changesFromRules({temporaryHP:9,ignoreFear:false},{priority:7})},statuses:new Set(["prone"])};
 await applyTransformation(actor,key,{source});
 assert.equal(result.name,"Rage ajustée");assert.equal(result.description,"Description du MJ");
 assert.equal(effectRules(result).temporaryHP,9);assert.equal(effectRules(result).ignoreFear,false);
 assert.ok(result.system.changes.every(c=>c.priority===7));assert.deepEqual(result.statuses,["prone"]);
});

test("only the elected GM synchronizes grants when a player applies an effect",async()=>{
 const users=[];users.activeGM={id:"gm",isSelf:false};
 globalThis.game={user:{id:"player"},users,i18n:{localize:key=>key}};
 let creations=0;
 const actor={uuid:"Actor.authority",isOwner:true,items:[],createEmbeddedDocuments:async()=>{creations++;}};
 const form={id:"effect",parent:actor,system:{changes:changesFromRules({attacks:[{name:"Bec",damage:"1d10"}]})}};
 await syncEffectGrants(form);assert.equal(creations,0,"the applying player must defer to the GM's creation hook");
 game.user={id:"gm"};users.activeGM.isSelf=true;
 await syncEffectGrants(form);assert.equal(creations,1);
});

test("compendium and chat effect references with cyclic native changes produce plain creation payloads",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 for(const kind of ["ActiveEffect","Item"]){
  const system={changes:[]};
  class ChangeModel{constructor(data){Object.assign(this,data);this.parent=system;}}
  system.changes=templates[key].changes.map(c=>new ChangeModel(c));
  const effect={documentName:"ActiveEffect",name:"Rage du MJ",system,statuses:new Set(),flags:{[S]:{transformation:{key}}}};
  const source=kind==="ActiveEffect"?effect:{documentName:"Item",type:"effect",effects:[effect]};
  let created;
  const actor={isOwner:true,system:{},items:[],canUserModify:()=>true,getActiveTokens:()=>[],
   createTrudvangEffect:async data=>{
    // JSON cannot serialize a DataModel's parent graph. Foundry's deepClone
    // hits its maximum depth first; this boundary must contain only source data.
    assert.doesNotThrow(()=>JSON.stringify(data));
    created=data;return {...data,id:"rage"};
   }};
  await applyTransformation(actor,key,{source});
  assert.equal(created.name,"Rage du MJ");
  assert.equal(created.system.changes.find(c=>c.key==="system.modifiers.rolls.attack").value,"1");
  assert.equal(effectRules(created).temporaryHP,5);
 }
});
