import test from "node:test";
import assert from "node:assert/strict";

globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
// Match textContent/innerHTML: quotes remain literal in a text node. Older
// mocks escaped quotes too, hiding invalid quoted attributes from these tests.
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}})};
const {escapeHtml,escapeAttribute}=await import("../modules/helpers.mjs");
const {transformationLinks,transformationRequest,registerTransformationHooks}=await import("../modules/transformations.mjs");
const scope="trudvang-chronicles",id="vitner-body-vitner:hasten:9";
const context={sourceId:id,kind:"spell",counts:[0,0,0,3],casterName:'Mage "Éric" & <compagnie> d’Ymir',casterUuid:"Actor.mage",specialty:"potency",specialtyLevel:2};
globalThis.game={i18n:{localize:key=>key},messages:new Map([["cast",{flags:{[scope]:{ruleTestContext:context}}}]])};
const button=(data={})=>({dataset:{transformationKey:id+"#hate",transformationSource:"Actor.mage.Item.haste",transformationCounts:"[0,0,0,3]",...data},closest:selector=>selector==="[data-message-id]"?{dataset:{messageId:"cast"}}:null});

test("text escaping and quoted-attribute escaping have different quote contracts",()=>{
 assert.equal(escapeHtml('"'), '"');
 assert.equal(escapeAttribute('"<&\''),"&quot;&lt;&amp;&#39;");
});

test("effect links serialize the complete context safely into a quoted HTML attribute",()=>{
 const html=transformationLinks({uuid:"Actor.mage.Item.haste",system:{catalogId:id}},context.counts,{context});
 const match=html.match(/data-rule-test-context="([^"]*)"/);assert.ok(match);
 assert.ok(match[1].startsWith("{&quot;sourceId&quot;:"));
 const decoded=match[1].replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&");
 const saved=JSON.parse(decoded);
 assert.deepEqual({...saved,countsById:undefined},{...context,countsById:undefined});
 assert.equal(saved.countsById[`${id}:3`],3);
 assert.deepEqual(transformationRequest(button({ruleTestContext:decoded})).context,saved);
});

test("effect links preserve captured identities when positional counts have become stale",()=>{
 const captured={...context,counts:[3,0,0,0],countsById:{[`${id}:3`]:3}};
 const html=transformationLinks({uuid:"Actor.mage.Item.haste",system:{catalogId:id}},captured.counts,{context:captured});
 const encoded=html.match(/data-rule-test-context="([^"]*)"/)[1];
 const decoded=encoded.replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&");
 const saved=JSON.parse(decoded);
 assert.equal(saved.countsById[`${id}:3`],3);
 assert.equal(saved.counts[3],3);assert.equal(saved.counts[0],0);
});

test("already published truncated JSON recovers the original casting context, including its improvements",()=>{
 const recovered=transformationRequest(button({ruleTestContext:"{"}));
 assert.deepEqual(recovered.context,context);assert.deepEqual(recovered.counts,context.counts);
 const absentCounts=transformationRequest(button({ruleTestContext:"{",transformationCounts:"[broken"}));
 assert.deepEqual(absentCounts.counts,context.counts);
 const unbound=button({ruleTestContext:"{"});unbound.closest=()=>null;
 assert.equal(transformationRequest(unbound).context,null);
});

test("the real dragstart hook serializes recoverable old buttons without throwing",()=>{
 const previous={Hooks:globalThis.Hooks,listener:document.addEventListener};const handlers={};
 try{
  document.addEventListener=(name,fn)=>{handlers[name]=fn;};globalThis.Hooks={on(){}};
  registerTransformationHooks();
  let payload;
  handlers.dragstart({target:{closest:()=>button({ruleTestContext:"{"})},dataTransfer:{setData:(type,value)=>{assert.equal(type,"text/plain");payload=JSON.parse(value);}}});
  assert.deepEqual(payload.context,context);assert.deepEqual(payload.counts,context.counts);
 }finally{globalThis.Hooks=previous.Hooks;document.addEventListener=previous.listener;}
});

test("clicking an effect applies it to the controlled actor, never implicitly to the caster",async()=>{
 const previous={Hooks:globalThis.Hooks,listener:document.addEventListener,canvas:globalThis.canvas,ui:globalThis.ui,game:globalThis.game,utils:foundry.utils,api:foundry.applications.api};
 const handlers={};let applied=0,warnings=0;
 try{
  document.addEventListener=(name,fn)=>{handlers[name]=fn;};globalThis.Hooks={on(){}};
  const caster={documentName:"Actor",canUserModify:()=>true,createTrudvangEffect:async()=>{throw Error("caster must not receive effect");}};
  const selected={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async()=>{applied++;return null;}};
  globalThis.game={user:{id:"player"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key},messages:new Map()};
  globalThis.canvas={tokens:{controlled:[{actor:selected}]}};globalThis.ui={notifications:{warn:()=>warnings++,error:message=>{throw Error(message);}}};
  foundry.utils={fromUuid:async()=>({parent:caster,system:{catalogId:id}})};
  foundry.applications.api={DialogV2:{wait:async()=>({duration:"1 minute"})}};
  registerTransformationHooks();
  const event={target:{closest:()=>button()},preventDefault(){},stopPropagation(){}};
  await handlers.click(event);assert.equal(applied,1);
  canvas.tokens.controlled=[];await handlers.click(event);assert.equal(applied,1);assert.equal(warnings,1);
 }finally{globalThis.Hooks=previous.Hooks;document.addEventListener=previous.listener;globalThis.canvas=previous.canvas;globalThis.ui=previous.ui;globalThis.game=previous.game;foundry.utils=previous.utils;foundry.applications.api=previous.api;}
});

test("one click opens target-labelled allocation dialogs sequentially and skips duplicate tokens",async()=>{
 const previous={Hooks:globalThis.Hooks,listener:document.addEventListener,canvas:globalThis.canvas,ui:globalThis.ui,game:globalThis.game,utils:foundry.utils,api:foundry.applications.api};
 const handlers={},titles=[],created=[];let open=false;
 try{
  document.addEventListener=(name,fn)=>{handlers[name]=fn;};globalThis.Hooks={on(){}};
  const makeActor=uuid=>({uuid,name:uuid,items:[],canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async()=>{created.push(uuid);return null;}});
  const first=makeActor("Actor.first"),second=makeActor("Actor.second");
  globalThis.game={user:{id:"player"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key},messages:new Map()};
  globalThis.canvas={tokens:{controlled:[{name:"Premier",actor:first},{name:"Doublon",actor:first},{name:"Second",actor:second}]}};
  globalThis.ui={notifications:{warn:()=>{},error:message=>{throw Error(message);}}};
  foundry.utils={fromUuid:async()=>({system:{catalogId:id}})};
  foundry.applications.api={DialogV2:{wait:async options=>{assert.equal(open,false);open=true;titles.push(options.window.title);await new Promise(resolve=>setImmediate(resolve));open=false;return {duration:"1 minute"};}}};
  registerTransformationHooks();const event={target:{closest:()=>button()},preventDefault(){},stopPropagation(){}};
  await handlers.click(event);
  assert.equal(titles.length,2);assert.match(titles[0],/Premier/);assert.match(titles[1],/Second/);
  assert.deepEqual(created,[first.uuid,second.uuid]);
 }finally{globalThis.Hooks=previous.Hooks;document.addEventListener=previous.listener;globalThis.canvas=previous.canvas;globalThis.ui=previous.ui;globalThis.game=previous.game;foundry.utils=previous.utils;foundry.applications.api=previous.api;}
});
