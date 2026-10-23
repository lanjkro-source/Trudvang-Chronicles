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
 assert.deepEqual(JSON.parse(decoded),context);
 assert.deepEqual(transformationRequest(button({ruleTestContext:decoded})).context,context);
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
