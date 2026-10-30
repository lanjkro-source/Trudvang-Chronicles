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
const {applyTransformation,transformationRequest,registerTransformationHooks}=await import("../modules/transformations.mjs");
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

test("War Cry tracks ally and enemy targets separately from its chat card",async()=>{
 const previous=foundry.applications.api.DialogV2,war="holy-gerbanis-wrath-of-tyrd:war-cry:4";
 try{
  foundry.applications.api.DialogV2={wait:async()=>({duration:"3 rounds",boost0:1,boost4:1,boost5:1})};
  const caster={uuid:"Actor.war-priest",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={uuid:"Actor.war-priest.Item.cry",type:"divineFeat",system:{catalogId:war}};
  await rollUnder({actor:caster,item,kind:"divine",label:"Cri de guerre",target:12,castingId:"war-cast",powerLevelCounts:[2,1,0,0,1,1]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,isOwner:false,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.war`,data};documents.set(effect.uuid,effect);return effect;}});
  const a=makeTarget("Actor.war-a"),b=makeTarget("Actor.war-b"),enemy=makeTarget("Actor.war-enemy"),other=makeTarget("Actor.war-other");
  for(const target of [a,b,enemy,other])documents.set(target.uuid,target);
  const ally=await applyTransformation(a,`${war}#ally`,{source:item,context});
  const foe=await applyTransformation(enemy,`${war}#enemy`,{source:item,context});
  assert.equal(ally.data.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,"4");
  assert.equal(foe.data.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,"-4");
  foundry.applications.api.DialogV2={wait:async()=>({duration:"3 rounds",boost0:0,boost4:0,boost5:0})};
  await applyTransformation(b,`${war}#ally`,{source:item,context});
  await assert.rejects(()=>applyTransformation(other,`${war}#enemy`,{source:item,context}),/MagicTargetLimit/);
  assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,3);
 }finally{foundry.applications.api.DialogV2=previous;}
});

test("Thunder of Victory shares purchased enhancements with all allies and enemies",async()=>{
 const previous=foundry.applications.api.DialogV2,power="holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7";
 try{
  const dialogs=[];foundry.applications.api.DialogV2={wait:async options=>{dialogs.push(options.content);return {duration:"5 rounds",boost0:2,boost2:1,boost3:1};}};
  const caster={uuid:"Actor.thunder-priest",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={uuid:"Actor.thunder-priest.Item.cry",type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",label:"Tonnerre",target:12,castingId:"thunder-cast",powerLevelCounts:[2,0,1,1]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,isOwner:false,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.thunder`,data};documents.set(effect.uuid,effect);return effect;}});
  for(const [n,variant] of [[1,"ally"],[2,"ally"],[3,"enemy"],[4,"enemy"]]){
   const actor=makeTarget(`Actor.thunder-${n}`);documents.set(actor.uuid,actor);
   const effect=await applyTransformation(actor,`${power}#${variant}`,{source:item,context});
   assert.equal(effect.data.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,variant==="ally"?"5":"-5");
   assert.equal(effect.data.duration.value,7);
  }
  assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,4);
  assert.match(dialogs[0],/∞/);assert.match(dialogs[0],/name="boost0"[^>]*readonly/);
 }finally{foundry.applications.api.DialogV2=previous;}
});

test("one click applies a shared area effect to every controlled actor without dialogs",async()=>{
 const previous={dialog:foundry.applications.api.DialogV2,listener:document.addEventListener,Hooks:globalThis.Hooks,canvas:globalThis.canvas};
 try{
  const power="holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7",caster={uuid:"Actor.area-caster",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={uuid:"Actor.area-caster.Item.cry",type:"divineFeat",system:{catalogId:power}};documents.set(item.uuid,item);
  await rollUnder({actor:caster,item,kind:"divine",label:"Tonnerre",target:12,castingId:"area-cast",powerLevelCounts:[2,0,1,0]});
  const message=Array.from(messages.values()).at(-1),created=[];
  const makeTarget=uuid=>({uuid,isOwner:false,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{created.push({uuid,data});const effect={uuid:`${uuid}.ActiveEffect.area`,data};documents.set(effect.uuid,effect);return effect;}});
  const a=makeTarget("Actor.area-a"),b=makeTarget("Actor.area-b");documents.set(a.uuid,a);documents.set(b.uuid,b);
  globalThis.canvas={tokens:{controlled:[{name:"A",actor:a},{name:"Copie",actor:a},{name:"B",actor:b}]}};
  const handlers={};document.addEventListener=(name,fn)=>{handlers[name]=fn;};globalThis.Hooks={on(){}};
  foundry.applications.api.DialogV2={wait:async()=>{throw Error("area effect must not show a dialog");}};
  registerTransformationHooks();
  const button={dataset:{transformationKey:`${power}#ally`,transformationSource:item.uuid,ruleTestContext:JSON.stringify(message.flags[scope].ruleTestContext)},closest:()=>({dataset:{messageId:message.id}})};
  await handlers.click({target:{closest:()=>button},preventDefault(){},stopPropagation(){}});
  assert.deepEqual(created.map(row=>row.uuid),[a.uuid,b.uuid]);
  for(const row of created){assert.equal(row.data.system.changes.find(c=>c.key==="system.modifiers.rolls.combatActions").value,"5");assert.equal(row.data.duration.value,7);}
 }finally{foundry.applications.api.DialogV2=previous.dialog;document.addEventListener=previous.listener;globalThis.Hooks=previous.Hooks;globalThis.canvas=previous.canvas;}
});

test("one click distributes a limited invocation sequentially and reports an excess target",async()=>{
 const previous={dialog:foundry.applications.api.DialogV2,listener:document.addEventListener,Hooks:globalThis.Hooks,canvas:globalThis.canvas,error:ui.notifications.error};
 try{
  const caster={uuid:"Actor.batch-priest",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={uuid:"Actor.batch-priest.Item.cry",type:"divineFeat",system:{catalogId:id}};documents.set(item.uuid,item);
  await rollUnder({actor:caster,item,kind:"divine",label:"Cri",target:12,castingId:"batch-cast",powerLevelCounts:[1,2,0,2]});
  const message=Array.from(messages.values()).at(-1),created=[],errors=[],titles=[];
  const makeTarget=uuid=>({uuid,isOwner:false,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{created.push({uuid,data});const effect={uuid:`${uuid}.ActiveEffect.cry`,data};documents.set(effect.uuid,effect);return effect;}});
  const targets=[makeTarget("Actor.batch-a"),makeTarget("Actor.batch-b"),makeTarget("Actor.batch-c")];for(const actor of targets)documents.set(actor.uuid,actor);
  globalThis.canvas={tokens:{controlled:targets.map((actor,index)=>({name:`Cible ${index+1}`,actor}))}};
  const handlers={};document.addEventListener=(name,fn)=>{handlers[name]=fn;};globalThis.Hooks={on(){}};ui.notifications.error=message=>errors.push(message);
  let open=false;foundry.applications.api.DialogV2={wait:async options=>{assert.equal(open,false);open=true;titles.push(options.window.title);await new Promise(resolve=>setImmediate(resolve));open=false;return {duration:"2 rounds",boost1:1,boost3:1};}};
  registerTransformationHooks();
  const button={dataset:{transformationKey:`${id}#ally`,transformationSource:item.uuid,ruleTestContext:JSON.stringify(message.flags[scope].ruleTestContext)},closest:()=>({dataset:{messageId:message.id}})};
  const priorLog=console.error;console.error=()=>{};
  try{await handlers.click({target:{closest:()=>button},preventDefault(){},stopPropagation(){}});}finally{console.error=priorLog;}
  assert.equal(titles.length,3);for(let i=0;i<3;i++)assert.match(titles[i],new RegExp(`Cible ${i+1}`));
  assert.deepEqual(created.map(row=>row.uuid),targets.slice(0,2).map(actor=>actor.uuid));
  assert.deepEqual(errors,["TRUDVANG.Warning.MagicTargetLimit"]);
 }finally{foundry.applications.api.DialogV2=previous.dialog;document.addEventListener=previous.listener;globalThis.Hooks=previous.Hooks;globalThis.canvas=previous.canvas;ui.notifications.error=previous.error;}
});

test("Stormi strength powers each permit one target per invocation",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"2 minutes",boost0:1})};
  for(const [index,power] of ["holy-gerbanis-strength-of-stormi:troll-strength:0","holy-gerbanis-strength-of-stormi:hinji-strength:3"].entries()) {
   const caster={uuid:`Actor.strength-caster-${index}`,name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
   const item={type:"divineFeat",system:{catalogId:power}};
   await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Strength",castingId:`strength-${index}`,powerLevelCounts:[1,0]});
   const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
   const makeTarget=uuid=>({uuid,name:uuid,isOwner:false,items:[],getTraitValue:()=>0,canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.strength`,data};documents.set(effect.uuid,effect);return effect;}});
   const first=makeTarget(`Actor.strength-first-${index}`),second=makeTarget(`Actor.strength-second-${index}`);documents.set(first.uuid,first);documents.set(second.uuid,second);
   const effect=await applyTransformation(first,`${power}#${index===0?"force-du-troll":"force-de-hinje"}`,{source:item,context});
   assert.ok(effect);
   await assert.rejects(()=>applyTransformation(second,`${power}#${index===0?"force-du-troll":"force-de-hinje"}`,{source:item,context}),/MagicTargetLimit/);
   assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,1);
  }
 } finally {foundry.applications.api.DialogV2=previous;}
});

test("Jotun Strength shares duration and ally enhancement while limiting chosen recipients",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"2 minutes",boost0:1,boost4:1})};
  const power="holy-gerbanis-strength-of-stormi:jotun-strength:6",caster={uuid:"Actor.jotun-caster",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Jotun",castingId:"jotun",powerLevelCounts:[1,0,0,0,1]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,name:uuid,isOwner:false,items:[],getTraitValue:()=>0,canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.jotun`,data};documents.set(effect.uuid,effect);return effect;}});
  const targets=["chosen","extra","ally1","ally2"].map(n=>makeTarget(`Actor.jotun-${n}`));for(const t of targets)documents.set(t.uuid,t);
  const chosen=await applyTransformation(targets[0],`${power}#force-du-jotun`,{source:item,context});
  assert.equal(chosen.data.system.changes.find(row=>row.key==="system.effective.traits.strength").value,"8");
  await assert.rejects(()=>applyTransformation(targets[1],`${power}#force-du-jotun`,{source:item,context}),/MagicTargetLimit/);
  for(const t of targets.slice(2)) {
   const ally=await applyTransformation(t,`${power}#force-du-jotun-allies`,{source:item,context});
   assert.equal(ally.data.system.changes.find(row=>row.key==="system.effective.traits.strength").value,"6");
  }
  assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,3);
 } finally {foundry.applications.api.DialogV2=previous;}
});

test("Heart of Enken permits the caster and two friends in addition to the chosen targets",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"2 minutes",boost0:1,boost4:1})};
  const power="holy-gerbanis-power-of-enken:heart-of-enken:6";
  const makeTarget=uuid=>({uuid,name:uuid,isOwner:false,items:[],getTraitValue:()=>0,canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.enken`,data};documents.set(effect.uuid,effect);return effect;}});
  const caster=makeTarget("Actor.enken-caster"),chosen=makeTarget("Actor.enken-chosen"),friends=[1,2,3].map(n=>makeTarget(`Actor.enken-friend-${n}`));for(const t of [caster,chosen,...friends])documents.set(t.uuid,t);
  const item={type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Enken",castingId:"enken",powerLevelCounts:[1,0,0,0,1]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const effect=await applyTransformation(chosen,`${power}#c-ur-d-enken`,{source:item,context});
  assert.equal(effect.data.system.changes.find(row=>row.key==="system.effective.traits.psyche").value,"8");
  for(const t of friends.slice(0,2)) {
   const ally=await applyTransformation(t,`${power}#c-ur-d-enken-allies`,{source:item,context});
   assert.equal(ally.data.system.changes.find(row=>row.key==="system.effective.traits.psyche").value,"6");
  }
  await assert.rejects(()=>applyTransformation(friends[2],`${power}#c-ur-d-enken-allies`,{source:item,context}),/MagicTargetLimit/);
  const casterEffect=await applyTransformation(caster,`${power}#c-ur-d-enken-allies`,{source:item,context});assert.ok(casterEffect);
  assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,4);
 } finally {foundry.applications.api.DialogV2=previous;}
});

test("Enken Night Vision can only be given to someone else when contact is bought",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"1 minute"})};
  const power="holy-gerbanis-power-of-enken:night-vision:0";
  const caster={uuid:"Actor.vision-caster",name:"Priest",items:[],canUserModify:()=>true},target={uuid:"Actor.vision-target",name:"Friend",items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:"Actor.vision-target.ActiveEffect.effect",data};documents.set(effect.uuid,effect);return effect;}};
  documents.set(caster.uuid,caster);documents.set(target.uuid,target);
  const item={type:"divineFeat",system:{catalogId:power}};
  for(const bought of [0,1]){
   await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Vision",castingId:`vision-${bought}`,powerLevelCounts:[0,0,bought]});
   const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
   if(!bought)await assert.rejects(()=>applyTransformation(target,`${power}#vision-nocturne`,{source:item,context}),/MagicCasterOnly/);
   else assert.ok(await applyTransformation(target,`${power}#vision-nocturne`,{source:item,context}));
  }
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("Bark Skin has one beneficiary and preserves purchased extra temporary health",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"1 minute",boost2:2})};
  const power="holy-tenetnid-tablet-of-the-shield:bark-skin:4",caster={uuid:"Actor.bark-caster",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Bark",castingId:"bark",powerLevelCounts:[0,0,2]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.bark`,data};documents.set(effect.uuid,effect);return effect;}});
  const first=makeTarget("Actor.bark-first"),second=makeTarget("Actor.bark-second");documents.set(first.uuid,first);documents.set(second.uuid,second);
  const result=await applyTransformation(first,`${power}#peau-d-ecorce`,{source:item,context});
  assert.equal(result.data.system.changes.find(c=>c.key==="system.resources.body.temporaryMax").value,"12");
  await assert.rejects(()=>applyTransformation(second,`${power}#peau-d-ecorce`,{source:item,context}),/MagicTargetLimit/);
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("Limb of Stone cannot target a second limb or a second creature from one invocation",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"3 rounds"})};
  const power="holy-haminges-power-of-the-scale:limb-of-stone:5",caster={uuid:"Actor.limb-caster",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Limb",castingId:"limb",powerLevelCounts:[0,0,0,0]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.limb`,data};documents.set(effect.uuid,effect);return effect;}});
  const first=makeTarget("Actor.limb-first"),second=makeTarget("Actor.limb-second");documents.set(first.uuid,first);documents.set(second.uuid,second);
  assert.ok(await applyTransformation(first,`${power}#membre-de-pierrebras-gauche`,{source:item,context}));
  await assert.rejects(()=>applyTransformation(first,`${power}#membre-de-pierrebras-droit`,{source:item,context}),/MagicTargetAlreadyAffected/);
  await assert.rejects(()=>applyTransformation(second,`${power}#membre-de-pierrebras-droit`,{source:item,context}),/MagicTargetLimit/);
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("healing powers grant the selected daily recovery and duration to one beneficiary",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"1 day",boost0:1,boost1:2})};
  for(const [index,power] of ["holy-gerbanis-warmth-of-sunvei:healing:0","holy-joaringfaith-power-of-sille:healing:0"].entries()){
   const caster={uuid:`Actor.healer-${index}`,name:"Healer",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
   const item={type:"divineFeat",system:{catalogId:power}};
   await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Healing",castingId:`healing-${index}`,powerLevelCounts:[1,2]});
   const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
   const makeTarget=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.healing`,data};documents.set(effect.uuid,effect);return effect;}});
   const a=makeTarget(`Actor.healed-${index}`),b=makeTarget(`Actor.extra-${index}`);documents.set(a.uuid,a);documents.set(b.uuid,b);
   const effect=await applyTransformation(a,`${power}#guerison`,{source:item,context});
   assert.equal(effect.data.system.changes.find(c=>c.key==="system.modifiers.recovery").value,"3");
   assert.equal(effect.data.duration.value,2);assert.equal(effect.data.duration.units,"days");
   await assert.rejects(()=>applyTransformation(b,`${power}#guerison`,{source:item,context}),/MagicTargetLimit/);
  }
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("Voice of Stormi divides duration and resistance modifiers among chosen targets",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  const forms=[{duration:"3 rounds",boost0:1,boost1:1},{duration:"3 rounds",boost0:1,boost1:1},{duration:"3 rounds",boost0:0,boost1:0},{duration:"3 rounds",boost0:0,boost1:0},{duration:"3 rounds",boost0:0,boost1:0}];
  foundry.applications.api.DialogV2={wait:async()=>forms.shift()};
  const power="holy-gerbanis-strength-of-stormi:voice-of-stormi:7",caster={uuid:"Actor.voice-caster",name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);
  const item={type:"divineFeat",system:{catalogId:power}};
  await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Voice",castingId:"voice",powerLevelCounts:[2,2,0,1]});
  const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
  const makeTarget=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.voice`,data};documents.set(effect.uuid,effect);return effect;}});
  const targets=Array.from({length:5},(_,i)=>makeTarget(`Actor.voice-${i}`));for(const t of targets)documents.set(t.uuid,t);
  const effects=[];for(const target of targets.slice(0,4))effects.push(await applyTransformation(target,`${power}#voix-de-storme`,{source:item,context}));
  assert.equal(effects[0].data.flags[scope].transformation.ruleTestContext.countsById[`${power}:1`],1);
  assert.equal(effects[2].data.flags[scope].transformation.ruleTestContext.countsById[`${power}:1`],0);
  assert.equal(effects[0].data.duration.value,4);assert.equal(effects[2].data.duration.value,3);
  await assert.rejects(()=>applyTransformation(targets[4],`${power}#voix-de-storme`,{source:item,context}),/MagicTargetLimit/);
  assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,4);
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("Stone Senses and Shattered Mind scale both combat and initiative penalties",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({duration:"3 rounds",boost0:1,boost2:2})};
  const cases=[["holy-tenetnid-tablet-of-anger:stone-senses:2","sens-petrifies"],["holy-haminges-power-of-the-scale:shattered-mind:1","esprit-brise"]];
  for(const [index,[power,key]] of cases.entries()){
   const caster={uuid:`Actor.stone-caster-${index}`,name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);const item={type:"divineFeat",system:{catalogId:power}};
   await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Stone",castingId:`stone-${index}`,powerLevelCounts:[1,0,2]});
   const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
   const makeTarget=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,createTrudvangEffect:async data=>{const effect={uuid:`${uuid}.ActiveEffect.stone`,data};documents.set(effect.uuid,effect);return effect;}});
   const a=makeTarget(`Actor.stone-a-${index}`),b=makeTarget(`Actor.stone-b-${index}`);documents.set(a.uuid,a);documents.set(b.uuid,b);
   const result=await applyTransformation(a,`${power}#${key}`,{source:item,context});
   assert.equal(result.data.system.changes.find(c=>c.key==="system.modifiers.rolls.initiative").value,"-6");
   assert.equal(result.data.system.changes.find(c=>c.key==="system.modifiers.rolls.combatActions").value,"-3");
   assert.equal(result.data.duration.value,4);
   await assert.rejects(()=>applyTransformation(b,`${power}#${key}`,{source:item,context}),/MagicTargetLimit/);
  }
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("instant healing is applied once, uses purchased levels and reserves one target",async()=>{
 const previous=foundry.applications.api.DialogV2;
 try {
  foundry.applications.api.DialogV2={wait:async()=>({boost0:2})};
  const cases=[["holy-gerbanis-warmth-of-sunvei:healing-glow:2","lumiere-guerisseuse",1,1],["holy-gerbanis-warmth-of-sunvei:firon-power:4","pouvoir-de-firon",5,2],["holy-gerbanis-warmth-of-sunvei:healing-sun:8","soleil-guerisseur",10,3],["holy-joaringfaith-power-of-sille:healing-glow:3","lumiere-guerisseuse",1,1],["holy-joaringfaith-power-of-sille:firon-power:5","pouvoir-de-firon",5,2],["holy-joaringfaith-power-of-sille:healing-sun:8","soleil-guerisseur",10,3]];
  for(const [index,[power,key,base,bonus]] of cases.entries()){
   const caster={uuid:`Actor.instant-caster-${index}`,name:"Priest",items:[],canUserModify:()=>true};documents.set(caster.uuid,caster);const item={type:"divineFeat",system:{catalogId:power}};
   await rollUnder({actor:caster,item,kind:"divine",target:12,label:"Healing",castingId:`instant-${index}`,powerLevelCounts:[2]});
   const message=Array.from(messages.values()).at(-1),context={...message.flags[scope].ruleTestContext,messageId:message.id};
   const makeTarget=uuid=>({uuid,name:uuid,items:[],isOwner:true,canUserModify:()=>true,system:{resources:{body:{current:-3,max:100}},modifiers:{}},_source:{system:{resources:{body:{value:-3}}}},async update(data){this.system.resources.body.current=data["system.resources.body.value"];this._source.system.resources.body.value=this.system.resources.body.current;}});
   const a=makeTarget(`Actor.instant-a-${index}`),b=makeTarget(`Actor.instant-b-${index}`);documents.set(a.uuid,a);documents.set(b.uuid,b);
   const result=await applyTransformation(a,`${power}#${key}`,{source:item,context});assert.equal(result.instant,true);
   assert.equal(a.system.resources.body.current,-3+base+2*bonus);
   await assert.rejects(()=>applyTransformation(a,`${power}#${key}`,{source:item,context}),/MagicInstantAlreadyApplied/);
   await assert.rejects(()=>applyTransformation(b,`${power}#${key}`,{source:item,context}),/MagicTargetLimit/);
   assert.equal(a.system.resources.body.current,-3+base+2*bonus);
   assert.equal(message.flags[scope].divineAllocation.targetAllocations.length,1);
  }
 }finally {foundry.applications.api.DialogV2=previous;}
});

test("concurrent immediate applications cannot heal the same target twice",async()=>{
 const power="holy-gerbanis-warmth-of-sunvei:healing-glow:2",caster={uuid:"Actor.instant-race",canUserModify:()=>true};
 const target={uuid:"Actor.instant-race-target",name:"Target",items:[],isOwner:true,canUserModify:()=>true,system:{resources:{body:{current:0,max:2}},modifiers:{}},_source:{system:{resources:{body:{value:0}}}},updates:0,async update(data){this.updates++;this.system.resources.body.current=data["system.resources.body.value"];}};
 documents.set(caster.uuid,caster);documents.set(target.uuid,target);
 const allocation={castingId:"instant-race",casterUuid:caster.uuid,sourceId:power,selected:{[`${power}:0`]:5},targetAllocations:[]};
 const message={id:"instant-race-message",flags:{[scope]:{divineAllocation:allocation}},async update(changes){allocation.targetAllocations=structuredClone(changes[`flags.${scope}.divineAllocation.targetAllocations`]);}};messages.set(message.id,message);
 const data={flags:{[scope]:{transformation:{key:`${power}#lumiere-guerisseuse`,ruleTestContext:{kind:"divine",casterUuid:caster.uuid,castingId:"instant-race",sourceId:power}}}}};
 const payload={casterUuid:caster.uuid,castingId:"instant-race",messageId:message.id,targetUuid:target.uuid,countsById:{[`${power}:0`]:5},data,userId:"gm"};
 const result=await Promise.all([applyAllocatedEffectOnGM(payload),applyAllocatedEffectOnGM(payload)]);
 assert.deepEqual(result.map(x=>x.status),["ok","already-applied"]);assert.equal(target.updates,1);assert.equal(target.system.resources.body.current,2);
});

test("failed immediate healing releases the reservation without changing the target",async()=>{
 const power="holy-gerbanis-warmth-of-sunvei:healing-glow:2",caster={uuid:"Actor.instant-fail-caster",canUserModify:()=>true};
 const target={uuid:"Actor.instant-fail-target",name:"Target",isOwner:true,canUserModify:()=>true,system:{resources:{body:{current:0,max:10}},modifiers:{}},_source:{system:{resources:{body:{value:0}}}},async update(){throw Error("denied");}};
 documents.set(caster.uuid,caster);documents.set(target.uuid,target);
 const allocation={castingId:"instant-fail",casterUuid:caster.uuid,sourceId:power,selected:{[`${power}:0`]:0},targetAllocations:[]};
 const message={id:"instant-fail-message",flags:{[scope]:{divineAllocation:allocation}},async update(changes){allocation.targetAllocations=structuredClone(changes[`flags.${scope}.divineAllocation.targetAllocations`]);}};messages.set(message.id,message);
 const data={flags:{[scope]:{transformation:{key:`${power}#lumiere-guerisseuse`,ruleTestContext:{kind:"divine",casterUuid:caster.uuid,castingId:"instant-fail",sourceId:power}}}}};
 const previous=console.error;console.error=()=>{};
 try{assert.equal(await applyAllocatedEffectOnGM({casterUuid:caster.uuid,castingId:"instant-fail",messageId:message.id,targetUuid:target.uuid,countsById:{[`${power}:0`]:0},data,userId:"gm"}),false);}finally{console.error=previous;}
 assert.equal(target.system.resources.body.current,0);assert.deepEqual(allocation.targetAllocations,[]);
});
