import test from "node:test";
import assert from "node:assert/strict";

globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}})};
globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>({duration:"2 rounds",boost1:1,boost3:1})}},handlebars:{renderTemplate:async()=>"card"}},utils:{}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=7;return this;}};
globalThis.ui={notifications:{warn(){},error(){}}};
const documents=new Map(),messages=new Map(),gm={id:"gm"};
globalThis.game={user:gm,users:{activeGM:{isSelf:true},get:id=>id==="gm"?gm:null},messages,actors:[],scenes:[],time:{worldTime:0},i18n:{localize:key=>key,format:(key,data)=>`${key}:${JSON.stringify(data)}`}};
foundry.utils.fromUuid=async uuid=>documents.get(uuid);
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{const m={...data,id:`message-${messages.size}`,async update(changes){for(const [path,value]of Object.entries(changes)){if(path==="flags.trudvang-chronicles.divineAllocation.targetAllocations")this.flags["trudvang-chronicles"].divineAllocation.targetAllocations=structuredClone(value);}}};messages.set(m.id,m);return m;}};
const {rollUnder}=await import("../modules/dice.mjs");
const {applyTransformation,transformationRequest}=await import("../modules/transformations.mjs");
const {applyAllocatedEffectOnGM,requestAllocatedEffect,registerMaintainedSpellTracking}=await import("../modules/maintained-spell-tracking.mjs");
const id="holy-gerbanis-wrath-of-tyrd:battle-cry:1",scope="trudvang-chronicles";

test("a divine invocation stores its own budget in chat without creating a maintained spell",async()=>{
 const caster={uuid:"Actor.priest",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
 const item={uuid:"Actor.priest.Item.cry",type:"divineFeat",system:{catalogId:id}};
 await rollUnder({actor:caster,item,kind:"divine",label:"Cri",target:12,castingId:"invocation",powerLevelCounts:[1,2,0,2]});
 const message=messages.get("message-0"),saved=message.flags[scope].divineAllocation;
 assert.equal(saved.castingId,"invocation");assert.equal(saved.selected[`${id}:0`],1);assert.equal(saved.selected[`${id}:3`],2);
 assert.equal(caster.system,undefined,"divine invocations do not create a maintained spell");
 const button={dataset:{transformationKey:`${id}#ally`,ruleTestContext:JSON.stringify(message.flags[scope].ruleTestContext)},closest:()=>({dataset:{messageId:message.id}})};
 const context=transformationRequest(button).context;assert.equal(context.messageId,message.id);
 const makeTarget=uuid=>({uuid,name:uuid,isOwner:false,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.test`,data};documents.set(effect.uuid,effect);return effect;}});
 const a=makeTarget("Actor.a"),b=makeTarget("Actor.b"),c=makeTarget("Actor.c");for(const target of [a,b,c])documents.set(target.uuid,target);
 const first=await applyTransformation(a,`${id}#ally`,{source:item,context});
 const second=await applyTransformation(b,`${id}#ally`,{source:item,context});
 assert.equal(first.data.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,"2");
 assert.equal(second.data.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,"2");
 assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,2);
 await assert.rejects(()=>applyTransformation(c,`${id}#ally`,{source:item,context}),/MagicTargetLimit/);
});

test("a failed divine invocation does not create a target budget",async()=>{
 const previous=globalThis.Roll;
 try{
  globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=20;return this;}};
  const caster={uuid:"Actor.failed",name:"Priest",items:[]},item={type:"divineFeat",system:{catalogId:id}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Cri",castingId:"failed",powerLevelCounts:[1,0,0,0]});
  const message=Array.from(messages.values()).at(-1);
  assert.equal(message.flags[scope].divineAllocation,undefined);
 }finally{globalThis.Roll=previous;}
});

test("concurrent divine applications cannot exceed the targets reserved on the chat card",async()=>{
 const caster={uuid:"Actor.second-priest",canUserModify:()=>true},makeTarget=uuid=>({uuid,canUserModify:()=>true,createTrudvangEffect:async()=>({uuid:`${uuid}.ActiveEffect.effect`})});
 const targets=[makeTarget("Actor.d"),makeTarget("Actor.e"),makeTarget("Actor.f")];
 for(const entry of [caster,...targets])documents.set(entry.uuid,entry);
 const allocation={castingId:"second",casterUuid:caster.uuid,sourceId:id,selected:{[`${id}:0`]:1,[`${id}:1`]:0,[`${id}:2`]:0,[`${id}:3`]:0},targetAllocations:[]};
 const message={id:"second-message",flags:{[scope]:{divineAllocation:allocation}},async update(changes){allocation.targetAllocations=structuredClone(changes["flags.trudvang-chronicles.divineAllocation.targetAllocations"]);}};messages.set(message.id,message);
 const data={flags:{[scope]:{transformation:{key:`${id}#ally`,ruleTestContext:{kind:"divine",casterUuid:caster.uuid,castingId:"second",sourceId:id}}}}};
 const results=await Promise.all(targets.map(target=>applyAllocatedEffectOnGM({casterUuid:caster.uuid,castingId:"second",messageId:message.id,targetUuid:target.uuid,countsById:{},data,userId:"gm"})));
 assert.deepEqual(results.map(result=>result.status),["ok","ok","exceeds-targets"]);
 assert.equal(allocation.targetAllocations.length,2);
});

test("failed divine effect creation restores the target budget",async()=>{
 const caster={uuid:"Actor.third-priest",canUserModify:()=>true},target={uuid:"Actor.failure",canUserModify:()=>true,createTrudvangEffect:async()=>{throw Error("creation failed");}};
 documents.set(caster.uuid,caster);documents.set(target.uuid,target);
 const allocation={castingId:"third",casterUuid:caster.uuid,sourceId:id,selected:{[`${id}:0`]:0,[`${id}:1`]:1,[`${id}:2`]:0,[`${id}:3`]:0},targetAllocations:[]};
 const message={id:"third-message",flags:{[scope]:{divineAllocation:allocation}},async update(changes){allocation.targetAllocations=structuredClone(changes["flags.trudvang-chronicles.divineAllocation.targetAllocations"]);}};messages.set(message.id,message);
 const data={flags:{[scope]:{transformation:{key:`${id}#ally`,ruleTestContext:{kind:"divine",casterUuid:caster.uuid,castingId:"third",sourceId:id}}}}};
 const prior=console.error;console.error=()=>{};
 try{assert.equal(await applyAllocatedEffectOnGM({casterUuid:caster.uuid,castingId:"third",messageId:message.id,targetUuid:target.uuid,countsById:{[`${id}:1`]:1},data,userId:"gm"}),false);}
 finally{console.error=prior;}
 assert.deepEqual(allocation.targetAllocations,[]);
});

test("a player can request an allocation from the GM without owning the caster",async()=>{
 const old={user:game.user,users:game.users,socket:game.socket,Hooks:globalThis.Hooks};
 try{
  const player={id:"player"},caster={uuid:"Actor.remote-priest",canUserModify:user=>user?.id==="gm"};
  const target={uuid:"Actor.player",canUserModify:user=>user?.id==="player",createTrudvangEffect:async()=>({uuid:"Actor.player.ActiveEffect.result"})};
  documents.set(caster.uuid,caster);documents.set(target.uuid,target);
  const allocation={castingId:"remote",casterUuid:caster.uuid,sourceId:id,selected:{[`${id}:0`]:0,[`${id}:1`]:1,[`${id}:2`]:0,[`${id}:3`]:0},targetAllocations:[]};
  const message={id:"remote-message",flags:{[scope]:{divineAllocation:allocation}},async update(changes){allocation.targetAllocations=structuredClone(changes["flags.trudvang-chronicles.divineAllocation.targetAllocations"]);}};messages.set(message.id,message);
  const handlers={},emitted=[];globalThis.Hooks={on:(name,fn)=>{handlers[name]=fn;}};
  game.user=player;game.users={activeGM:{isSelf:false},get:id=>id==="player"?player:id==="gm"?gm:null};
  game.socket={on:(_channel,handler)=>{handlers.socket=handler;},emit:(_channel,payload)=>{emitted.push(payload);}};
  registerMaintainedSpellTracking();handlers.ready();
  const data={flags:{[scope]:{transformation:{key:`${id}#ally`,ruleTestContext:{kind:"divine",casterUuid:caster.uuid,castingId:"remote",sourceId:id}}}}};
  const pending=requestAllocatedEffect({casterUuid:caster.uuid,castingId:"remote",messageId:message.id,targetUuid:target.uuid,countsById:{[`${id}:1`]:1},data});
  game.user=gm;game.users.activeGM.isSelf=true;await handlers.socket(emitted[0]);
  game.user=player;game.users.activeGM.isSelf=false;await handlers.socket(emitted[1]);
  assert.equal((await pending).status,"ok");assert.equal(allocation.targetAllocations[0].targetUuid,target.uuid);
 }finally{game.user=old.user;game.users=old.users;game.socket=old.socket;globalThis.Hooks=old.Hooks;}
});
