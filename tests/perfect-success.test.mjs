import test from "node:test";
import assert from "node:assert/strict";

globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}})};
const cards=[],messages=[];
globalThis.foundry={applications:{api:{},handlebars:{renderTemplate:async(_path,data)=>{cards.push(structuredClone(data));return JSON.stringify(data);}}}};
globalThis.game={i18n:{localize:key=>key,format:(key,values)=>`${key}:${JSON.stringify(values)}`}};
globalThis.ui={notifications:{warn:()=>{}}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=1;return this;}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{const message={...data,async update(changes){this.content=changes.content;this.updatedContext=changes["flags.trudvang-chronicles.ruleTestContext"];}};messages.push(message);return message;}};
const {rollUnder,perfectSuccessDialog}=await import("../modules/dice.mjs");
const id="vitner-body-vitner:hasten:9";

test("a perfect spell publishes its roll then activates the improved effect links and resistance context",async()=>{
 const actor={name:"Mage",uuid:"Actor.mage",items:[]},item={uuid:"Actor.mage.Item.haste",type:"spell",system:{catalogId:id}};
 let sawPending=false;
 const result=await rollUnder({actor,item,kind:"spell",target:12,label:"Hâte",castingId:"cast",powerLevelCounts:[0,0,0,0,0,0,0],resolvePerfectSuccess:async()=>{
  sawPending=messages.length===1 && !cards.at(-1).transformationLinks;
  return {counts:[0,0,0,0,0,0,1],flavor:"bonus"};
 }});
 assert.equal(sawPending,true);assert.equal(result.perfectSelection.counts[6],1);
 assert.equal(messages[0].updatedContext.castingId,"cast");assert.equal(messages[0].updatedContext.countsById[`${id}:6`],1);
 assert.match(cards.at(-1).transformationLinks,/data-transformation-key/);assert.match(cards.at(-1).flavor,/bonus/);
});

test("perfect-success dialog retries invalid budgets and allows cancellation",async()=>{
 const levels=[{effect:"Durée",cost:2,maxCount:3}],entries=[{count:1,unitCost:2}];let calls=0;
 foundry.applications.api.DialogV2=class{static async wait(options){calls++;const value=calls===1?"3":"1";return options.buttons[0].callback(null,{form:{querySelector:()=>({value})}});}};
 assert.deepEqual(await perfectSuccessDialog({title:"Hâte",powerLevels:levels,entries,bonus:3}),{counts:[2],spent:2,remaining:1});
 assert.equal(calls,2);
 foundry.applications.api.DialogV2=class{static async wait(){return null;}};
 assert.deepEqual(await perfectSuccessDialog({title:"Hâte",powerLevels:levels,entries,bonus:3}),{counts:[1],spent:0,remaining:3});
});
