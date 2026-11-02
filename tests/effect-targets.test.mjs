import test from "node:test";
import assert from "node:assert/strict";
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
const {initialEffectTargets,effectTargetsFor,updateEffectTargetsOnGM,canManageEffectTargets,effectTargetListHTML,applyEffectForCasterOnGM}=await import("../modules/effect-targets.mjs");

const S="trudvang-chronicles",id="vitner-body-vitner:hasten:9",key=`${id}#hate`;
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}})};
test("target lists are per effect, deduplicated and safely escaped",()=>{
 const actor={uuid:"Actor.a",name:"A"},rows=initialEffectTargets([key,`${id}#reverse`],[{uuid:"Token.a",actor,name:"<A>"},{uuid:"Token.b",actor}]);
 assert.equal(rows[key].length,1);rows[key].push({name:"B"});assert.equal(rows[`${id}#reverse`].length,1);
 globalThis.game={i18n:{localize:key=>key}};assert.match(effectTargetListHTML(rows[`${id}#reverse`],{editable:true}),/&lt;A&gt;/);
});

test("only caster or GM may change a card's targets; updates preserve other effect lists",async()=>{
 const user={id:"caster",active:true},other={id:"other",active:true},actor={uuid:"Actor.a",name:"A"};
 const token={uuid:"Scene.s.Token.a",documentName:"Token",actor,name:"A"};
 const message={author:{id:"caster"},flags:{[S]:{ruleTestContext:{sourceId:id,casterUuid:"Actor.caster"},transformationTargets:{[key]:[],[`${id}#other`]:[{actorUuid:"Actor.old"}]}}},async update(data){this.flags[S].transformationTargets=data[`flags.${S}.transformationTargets`];}};
 globalThis.game={user:{id:"gm",isGM:true},messages:new Map([["m",message]]),users:{get:id=>id==="caster"?user:other},i18n:{localize:key=>key}};
 globalThis.foundry={utils:{fromUuid:async uuid=>uuid===token.uuid?token:null}};
 assert.equal(await canManageEffectTargets(message,other),false);
 assert.equal((await updateEffectTargetsOnGM({messageId:"m",userId:"other",key,add:[token.uuid]})).status,"unavailable");
 assert.equal((await updateEffectTargetsOnGM({messageId:"m",userId:"caster",key,add:[token.uuid,token.uuid]})).status,"updated");
 assert.equal(effectTargetsFor(message,key).length,1);assert.equal(effectTargetsFor(message,`${id}#other`).length,1);
 assert.equal((await updateEffectTargetsOnGM({messageId:"m",userId:"caster",key,remove:actor.uuid})).status,"updated");
 assert.equal(effectTargetsFor(message,key).length,0);
});

test("delegated application rejects a non-caster and tokens absent from the effect list",async()=>{
 const author={id:"caster",active:true},stranger={id:"stranger",active:true},caster={uuid:"Actor.caster",testUserPermission:user=>user.id==="caster"};
 const target={uuid:"Actor.target"},token={uuid:"Scene.s.Token.t",actor:target},source={uuid:"Item.spell",type:"spell",system:{catalogId:id}};
 const message={author:{id:"caster"},content:`<button data-transformation-key="${key}" data-transformation-source="${source.uuid}">`,flags:{[S]:{ruleTestContext:{sourceId:id,casterUuid:caster.uuid,counts:[]},transformationTargets:{[key]:[{tokenUuid:token.uuid,actorUuid:target.uuid}]}}}};
 const docs=new Map([caster,token,source].map(doc=>[doc.uuid,doc]));
 globalThis.game={users:{activeGM:{isSelf:true},get:id=>id==="caster"?author:stranger},messages:new Map([["m",message]])};globalThis.foundry={utils:{fromUuid:async uuid=>docs.get(uuid)}};
 assert.equal((await applyEffectForCasterOnGM({messageId:"m",userId:"stranger",key,tokenUuid:token.uuid,sourceUuid:source.uuid,answers:{}})).status,"unavailable");
 assert.equal((await applyEffectForCasterOnGM({messageId:"m",userId:"caster",key,tokenUuid:"Scene.s.Token.other",sourceUuid:source.uuid,answers:{}})).status,"unavailable");
});
