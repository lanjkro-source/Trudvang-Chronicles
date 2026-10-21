import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {transformationProfile,transformedTrait,movementDetails,movementProfile,transformationRollRows,effectRules,TRANSFORMATION_SCOPE as S} from "../modules/rules/transformation-profile.mjs";
import {EFFECT_RULE_PREFIX,changesFromRules,rulesFromChanges,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";
import {temporaryHealthGrants,temporaryHealthState,temporaryHealthUpdate,setTemporaryHealth} from "../modules/rules/transformation-profile.mjs";
import {effectStatus} from "../modules/rules/effect-status.mjs";
import {TRANSFORMATION_TEMPLATES as templates,TRANSFORMATIONS_BY_SOURCE as sources} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {resolveCombatPools} from "../modules/rules/combat-pool-resolver.mjs";
import {buildEffectPackDocuments} from "../modules/effect-pack-data.mjs";
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
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"multiply",value:0.5},{mode:"flight",method:"baseMultiple",value:4}]),{land:10,flight:10});
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"replace",value:0},{mode:"swim",method:"baseMultiple",value:2}]),{land:0,swim:10});
});

test("fear profiles upgrade the native factor and disabling the effect restores it unchanged",()=>{
 const source="2d10 (JO 8-10)";
 const form=effect({fearFactor:"3d10"});
 const actor={type:"npc",system:{details:{fearFactor:source}},effects:[form]};
 assert.equal(transformationProfile(actor).fearFactor,"3d10 (JO 8-10)");
 assert.equal(actor.system.details.fearFactor,source);
 form.disabled=true;
 assert.equal(transformationProfile(actor).fearFactor,undefined);
 assert.equal(actor.system.details.fearFactor,source);
});
test("legacy temporary health balances initialize one shared reserve without restoring consumed points",()=>{
 const a=effect({temporaryHP:5},{system:{changes:changesFromRules({temporaryHP:5})},flags:{[S]:{transformation:{editableChanges:true,temporaryHPSpent:2}}}});
 const actor={effects:[a],_source:{system:{resources:{body:{temporary:0}}}}};
 assert.deepEqual(temporaryHealthState(actor),{current:3,maximum:5,reference:-1});
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

test("Hasten and its reverse resolve the book's separate skill-VC table from spell and compendium sources",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"player"},time:{worldTime:100},i18n:{localize}};
 globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>({duration:"5 tours de jeu"})}}}};
 const references=buildEffectPackDocuments({localize}).items;
 for(const [id,base,trait,bonus]of [["hate",0,1,1],["hate",2,4,3],["hate",8,8,5],["hate-inverse",0,-1,-1],["hate-inverse",-4,-6,-4],["hate-inverse",-8,-8,-5]]){
  const key=`vitner-body-vitner:hasten:9#${id}`;
  const item=references.find(i=>i.system.catalogId===key);
  assert.ok(item.effects[0].system.changes.length,"compendium reference must retain its embedded change rows");
  item.documentName="Item";
  for(const source of [null,item]){
   let created;
   const actor={canUserModify:()=>true,getTraitValue:()=>base,createTrudvangEffect:async data=>{created=data;return null;}};
   await applyTransformation(actor,key,{source});
   const rows=created.system.changes;
   assert.equal(rows.find(c=>c.key==="system.effective.traits.dexterity").value,String(trait));
   for(const skill of ["agility","fighting"]){
    const changes=rows.filter(c=>c.key===`system.effective.skills.${skill}`);
    assert.equal(changes.length,1);
    assert.equal(changes[0].value,String(bonus));
    assert.equal(changes[0].type,"add");assert.equal(changes[0].phase,"initial");assert.equal(changes[0].priority,40);
   }
  }
 }
});

test("the reported V14.369 compendium Hasten with an array value creates all three resolved modifications",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key,{path})=>`${key}: ${path}`}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const typed=structuredClone(templates[key].changes);typed[0].value=JSON.parse(typed[0].value);
 const exported={name:"Hâte",system:{changes:typed},flags:{[S]:{transformation:{key,sourceId:templates[key].sourceId,editableChanges:true}}}};
 const model={documentName:"ActiveEffect",...exported,toObject:()=>structuredClone(exported)};
 for(const source of [model,{documentName:"Item",type:"effect",system:{catalogId:key},effects:[model]}]){
  let created;
  const actor={canUserModify:()=>true,getTraitValue:()=>2,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key,{source});
  assert.deepEqual(created.system.changes.map(c=>[c.key,c.value]),[
   ["system.effective.traits.dexterity","4"],["system.effective.skills.agility","3"],["system.effective.skills.fighting","3"]
  ]);
  assert.ok(created.system.changes.every(c=>c.priority===40));
 }
});

test("legacy compendium Hasten stores its dynamic rules in flags and must not become an empty effect on drop",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 // Exact storage used by the v0.96.2 effect compendium: no scalar changes,
 // with the dynamic DEX step in transformation.rules instead.
 const effect={documentName:"ActiveEffect",name:"Hâte",system:{changes:[]},statuses:[],
  flags:{[S]:{transformation:{key,sourceId:templates[key].sourceId,rules:{traits:[{trait:"dexterity",method:"degrees",value:1}]}}}}};
 for(const source of [effect,{documentName:"Item",type:"effect",system:{catalogId:key},effects:[effect]}]){
  let created;
  const actor={canUserModify:()=>true,getTraitValue:()=>2,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key,{source});
  assert.equal(created.system.changes.find(c=>c.key==="system.effective.traits.dexterity")?.value,"4");
  for(const skill of ["agility","fighting"])assert.equal(created.system.changes.find(c=>c.key===`system.effective.skills.${skill}`)?.value,"3");
  assert.equal(created.flags[S].transformation.editableChanges,true);
  assert.equal(created.flags[S].transformation.rules,undefined);
 }
});

test("legacy drop compatibility preserves resolved traits and current references deliberately cleared by the GM",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const rules={traits:[{trait:"dexterity",method:"degrees",value:1}],traitsApplied:true};
 const source={documentName:"ActiveEffect",system:{changes:[{key:"system.effective.traits.dexterity",type:"override",value:"4",phase:"initial",priority:40}]},
  flags:{[S]:{transformation:{key,rules}}}};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>4,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key,{source});
 assert.deepEqual(created.system.changes.map(c=>[c.key,c.value]),[["system.effective.traits.dexterity","4"]]);
 source.system.changes=[];
 source.flags[S].transformation.editableChanges=true;
 await applyTransformation(actor,key,{source});
 assert.deepEqual(created.system.changes,[]);
});

test("compendium drops read persisted source rows and reject malformed dynamic rules before creating an effect",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key,{path})=>`${key}: ${path}`}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const saved={name:"Hâte",system:{changes:structuredClone(templates[key].changes)}};
 const source={documentName:"ActiveEffect",system:{changes:[]},toObject:()=>structuredClone(saved)};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key,{source});
 assert.equal(created.system.changes.find(c=>c.key==="system.effective.traits.dexterity").value,"1");
 saved.system.changes[0].value="invalid JSON";created=null;
 await assert.rejects(()=>applyTransformation(actor,key,{source}),/InvalidProfileChange.*system.transformation.traits/);
 assert.equal(created,null);
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

test("size effects resize linked tokens across scenes and restore their original footprint",async()=>{
 const makeToken=()=>({width:1,height:2,flags:{},async update(data){
  for(const key of ["width","height"])if(data[key]!==undefined)this[key]=data[key];
  this.flags[S]??={};
  if(data[`flags.${S}.transformationSize`])this.flags[S].transformationSize=structuredClone(data[`flags.${S}.transformationSize`]);
  if(data[`flags.${S}.-=transformationSize`]!==undefined)delete this.flags[S].transformationSize;
 }});
 const previousGame=globalThis.game;
 try{
  const token=makeToken(),offScene=Object.assign(makeToken(),{actorLink:true,actorId:"a"}),other=Object.assign(makeToken(),{actorLink:false,actorId:"a"});
  globalThis.game={user:{id:"gm"},scenes:[{tokens:[offScene,other]}]};
  const actor={id:"a",isOwner:true,type:"npc",system:{details:{size:"1/3"}},getActiveTokens:()=>[token],effects:[effect({size:2})]};
  await syncTransformationTokens(actor);
  for(const t of [token,offScene])assert.deepEqual([t.width,t.height],[2,2]);
  assert.deepEqual([other.width,other.height],[1,2]);
  actor.effects=[effect({size:7})];await syncTransformationTokens(actor);assert.equal(token.width,4);
  actor.effects[0].disabled=true;await syncTransformationTokens(actor);
  assert.deepEqual([token.width,token.height],[1,2]);assert.equal(token.flags[S].transformationSize,undefined);
  assert.equal(transformationProfile(actor).size,"1/3","fractions survive preparation");
  actor.effects=[effect({size:0.25})];await syncTransformationTokens(actor);assert.equal(token.width,0.5);
  token.width=3;actor.effects=[];await syncTransformationTokens(actor);assert.equal(token.width,3,"later manual edits are preserved");
  actor.isToken=true;actor.token=token;actor.effects=[effect({size:2})];await syncTransformationTokens(actor);assert.equal(token.width,2);
  actor.effects[0].duration={expired:true};await syncTransformationTokens(actor);assert.equal(token.width,3);
 }finally{globalThis.game=previousGame;}
});

test("Rage adds height and mass without assigning a creature Size",()=>{
 const rages=Object.values(templates).filter(t=>t.id==="rage");assert.equal(rages.length,2);
 for(const t of rages){const rules=rulesFromChanges(t.changes);assert.equal(rules.size,undefined);assert.equal(rules.heightBonus,0.5);assert.equal(rules.weightBonus,30);}
});

test("reapplying a dynamic trait effect excludes its old copy but retains other bonuses",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 for(const [suffix,trait]of [["#hate","dexterity"],["#vigueur","strength"]]){
  const key=Object.keys(templates).find(k=>k.endsWith(suffix));assert.ok(key);
  const old={id:"old",system:{stackId:key,changes:[{key:`system.effective.traits.${trait}`,type:"override",value:"2"}]}},other={id:"other",system:{stackId:"other",changes:[]}};
  let created,clones=0;
  const actor={effects:[old,other],canUserModify:()=>true,getTraitValue:()=>2,
   clone:async(data,options)=>{clones++;assert.equal(options.keepId,true);assert.deepEqual(data.effects.map(e=>e.id),["other"]);return {getTraitValue:()=>1};},
   createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key);
  assert.equal(clones,1);assert.deepEqual(actor.effects,[old,other]);
  assert.equal(created.system.changes.find(c=>c.key===`system.effective.traits.${trait}`).value,"2","must not increase to 4 from the previous effect's effective 2");
 }
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
 assert.equal(rage.system.changes.find(c=>c.key==="system.resources.body.temporaryMax").value,"5");assert.equal(rules.fearFactor,"1d10");
 assert.equal(rules.noParry,true);assert.equal(rules.noDodge,true);assert.equal(rules.ignoreFear,true);
 assert.equal(rules.damage,undefined);
 assert.ok(rage.system.changes.some(c=>c.key==="system.modifiers.damageByUsage.melee"&&c.type==="add"&&c.value==="2"));
 actor.transformationProfile=transformationProfile(actor);
 assert.equal(effectStatus(actor).temporaryHP,5);
 let result=await applyDamageToActor({actor,damage:3,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,3);assert.equal(result.bodyDamage,0);
 assert.equal(actor.system.resources.body.value,32);assert.equal(effectStatus(actor).temporaryHP,2);
 result=await applyDamageToActor({actor,damage:4,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,2);assert.equal(result.bodyDamage,2);assert.equal(actor.system.resources.body.value,30);
 assert.equal(effectStatus(actor).temporaryHP,0);
 rage.disabled=true;assert.equal(temporaryHealthGrants(actor).length,0);
 rage.disabled=false;assert.equal(temporaryHealthState(actor).current,0,"a reprepare without a maximum transition cannot refill health");
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
  assert.equal(temporaryHealthGrants({effects:[created]}).reduce((n,r)=>n+r.remaining,0),5);
 }
});


test("raven movement multipliers change metres per 2 CP without changing maxima",()=>{
 const changes=[{mode:"land",method:"multiply",value:0.5},{mode:"flight",method:"baseMultiple",value:4}];
 assert.deepEqual(movementDetails(14,[],changes),{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}});
 const rows=[{mode:"terrestre",distance:"1 m",max:"14 m"}];
 assert.deepEqual(movementDetails(14,rows,changes),{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}});
 assert.deepEqual(movementDetails(14,rows,[]),{land:{max:14,metersPerTwo:1}});
 assert.deepEqual(movementDetails(14,[{mode:"terrestre",distance:"1,5 m",max:"14 m"}],changes),{land:{max:14,metersPerTwo:0.75},flight:{max:14,metersPerTwo:6}});
});


test("both shipped raven forms preserve movement maxima on PJ and PNJ profiles",()=>{
 for(const template of Object.values(templates).filter(t=>["aspect-du-corbeau","aspect-animal-corbeau"].includes(t.id))){
  const rules=rulesFromChanges(template.changes);
  for(const rows of [[],[{mode:"terrestre",distance:"1 m",max:"14 m"}]]){
   const movement=movementDetails(14,rows,rules.movement);
   assert.deepEqual(movement,{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}},template.id);
  }
 }
});


test("effect names identify their source in both languages and decimal movement has at most two places",()=>{
 for(const code of ["fr","en"]){
  const lang=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  const names=Object.values(lang.TRUDVANG.Content.Transformation).map(row=>row.Name);
  assert.equal(new Set(names).size,names.length);
 }
 assert.equal(movementDetails(10,[],[{mode:"land",method:"multiply",value:1/3}]).land.metersPerTwo,0.33);
 assert.equal(movementDetails(10,[],[{mode:"land",method:"multiply",value:2/3}]).land.metersPerTwo,0.67);
 assert.equal(movementDetails(10,[],[{mode:"land",method:"replace",value:12.3456}]).land.max,12.35);
 assert.equal(rulesFromChanges([{key:"system.transformation.defense",type:"override",value:3},{key:"system.transformation.defense",type:"multiply",value:0.555}]).defense,1.67);
});


test("linked effects apply the requested successor rather than copying their originating effect",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:120},i18n:{localize}};
 const dialogs=[];
 globalThis.foundry.applications.api.DialogV2.wait=async options=>{dialogs.push(options);return {duration:"1 minute"};};
 for(const [parentId,childId]of [["rage","frenzy-exhaustion"],["warg-disease","warg-garou"],["petrification-recovery-half","petrification-recovery-two-thirds"]]){
  const parentKey=Object.keys(templates).find(k=>k.endsWith("#"+parentId));
  const childKey=templates[parentKey].sourceId+"#"+childId;
  assert.ok(templates[childKey]);
  const parent={documentName:"ActiveEffect",uuid:"Actor.a.ActiveEffect.parent",name:"Effet initial modifié",description:"Description de l’origine",system:{stackId:parentKey,changes:[{key:"system.modifiers.rolls.attack",type:"add",value:"999"}]},statuses:["prone"],flags:{[S]:{transformation:{key:parentKey,sourceId:templates[parentKey].sourceId,related:[childId],summary:"Résumé de l’origine",appliedAt:100,editableChanges:true}}}};
  const before=structuredClone(parent);
  for(const source of [parent,{documentName:"Item",type:"effect",uuid:"Item.reference",effects:[parent]}]){
   let created;
   const actor={canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
   await applyTransformation(actor,childKey,{source,elapsed:20});
   assert.equal(dialogs.at(-1).window.title,localize("TRUDVANG.Content.Transformation."+childKey+".Name"));
   assert.equal(created.name,localize("TRUDVANG.Content.Transformation."+childKey+".Name"));
   assert.equal(created.description,localize("TRUDVANG.Content.Transformation."+childKey+".Description"));
   assert.equal(created.flags[S].transformation.summary,localize("TRUDVANG.Content.Transformation."+childKey+".Summary"));
   assert.equal(created.flags[S].transformation.key,childKey);
   assert.equal(created.origin,source.uuid);
   assert.deepEqual(created.statuses,templates[childKey].statuses);
   assert.ok(!created.system.changes.some(c=>c.value==="999"));
   if(childId==="frenzy-exhaustion"){
    assert.equal(effectRules(created).durationFromElapsed,0.5);
    assert.match(dialogs.at(-1).content,/value="10 seconds"/);
   }
  }
  assert.deepEqual(parent,before);
 }
});


test("one temporary reserve clamps to either remaining maximum and persists each transition",async()=>{
 for(const removed of ["first","second"]){
  const first={id:"first",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"5"}]}},second={id:"second",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"7"}]}};
  const actor={effects:[first],_source:{system:{resources:{body:{temporary:0,temporaryMaxAtValue:-1}}}}};
  const set=(o,path,value)=>{const keys=path.split("."),leaf=keys.pop();keys.reduce((o,k)=>o[k]??={},o)[leaf]=value;};
  actor.update=async changes=>{for(const [k,v]of Object.entries(changes))set(actor._source,k,v);};
  const sync=async()=>{actor.temporaryHealthState=temporaryHealthState(actor);const {bodyHealthPersistence}=await import("../modules/rules/body-health.mjs");await actor.update(bodyHealthPersistence(actor)||{});};
  await sync();assert.equal(temporaryHealthState(actor).current,5);
  actor.effects.push(second);await sync();assert.equal(temporaryHealthState(actor).current,12);
  await setTemporaryHealth(actor,9);
  actor.effects=actor.effects.filter(e=>e.id!==removed);await sync();
  const maximum=removed==="first"?7:5;
  assert.equal(temporaryHealthState(actor).maximum,maximum);assert.equal(temporaryHealthState(actor).current,maximum);
  assert.equal(actor._source.system.resources.body.temporaryMaxAtValue,maximum);
  await sync();assert.equal(temporaryHealthState(actor).current,maximum,"reload cannot alter the reserve");
  await setTemporaryHealth(actor,2);await sync();assert.equal(temporaryHealthState(actor).current,2);
  actor.effects=[];await sync();assert.equal(temporaryHealthState(actor).current,0);
  actor.effects=[first];await sync();assert.equal(temporaryHealthState(actor).current,5);
  await setTemporaryHealth(actor,8);assert.equal(temporaryHealthState(actor).current,8);assert.equal(temporaryHealthState(actor).maximum,8);
 }
});

test("rolled vitality posts the actual dice to the normal chat pipeline for Dice So Nice",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize}};
 const previousRoll=globalThis.Roll,previousChat=globalThis.ChatMessage;
 const posted=[];let created;
 try{
  globalThis.Roll=class {constructor(formula){this.formula=formula;}async evaluate(){this.total=13;return this;}async toMessage(options){posted.push({roll:this,options});}};
  globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.id})};
  globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
  const key=Object.keys(templates).find(k=>k.endsWith("#boiling-blood"));
  const actor={id:"target",canUserModify:()=>true,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key);
  assert.equal(posted.length,1);assert.equal(posted[0].roll.formula,"2d10");assert.equal(posted[0].roll.total,13);
  assert.equal(posted[0].options.speaker.actor,"target");
  assert.ok(created.system.changes.some(c=>c.key==="system.modifiers.bodyMax"&&c.value==="13"));
  assert.ok(created.system.changes.some(c=>c.key==="system.modifiers.bodyValue"&&c.value==="13"));
  const vitalityTemplates=Object.entries(templates).filter(([,t])=>rulesFromChanges(t.changes).vitality);
  assert.equal(vitalityTemplates.length,6);
  for(const [vitalityKey,template]of vitalityTemplates){
   const boost=template.parameters.find(p=>p.target==="vitality");assert.ok(boost,vitalityKey);
   globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",[`boost${boost.index}`]:3});
   await applyTransformation(actor,vitalityKey);
   for(const field of ["bodyMax","bodyValue"]){
    const rows=created.system.changes.filter(c=>c.key===`system.modifiers.${field}`);
    assert.equal(rows.length,1,vitalityKey);assert.equal(rows[0].value,"16");assert.equal(rows[0].type,"add");
   }
   assert.ok(!created.system.changes.some(c=>/temporary/.test(c.key)),vitalityKey);
  }
  globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1d6 + 2 jours"});
  posted.length=0;await applyTransformation(actor,key);
  assert.deepEqual(posted.map(p=>p.roll.formula.trim()),["1d6 + 2","2d10"]);
  assert.equal(created.duration.value,13*86400);
  assert.match(posted[0].options.flavor,/Durée/);
  for(const p of posted)assert.equal(p.options.speaker.actor,"target");
  posted.length=0;
  assert.equal((await resolveDuration("1d10 (JO 7-10) jours",{actor,name:"Pétrification"})).value,13*86400);
  assert.equal(posted[0].roll.formula.trim(),"1d10 xo>=7");
  for(const template of Object.values(templates).filter(t=>/\dd\d/i.test(t.duration??""))){
   posted.length=0;
   await resolveDuration(template.duration,{actor,name:template.id});
   assert.equal(posted.length,1,template.id);
  }
 }finally{globalThis.Roll=previousRoll;globalThis.ChatMessage=previousChat;}
});
