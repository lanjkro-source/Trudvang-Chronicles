import test from "node:test";
import assert from "node:assert/strict";
import {conditionalSkillModifiers,withConditionalEffectConsumption} from "../modules/rules/effect-conditional-tests.mjs";
const S="trudvang-chronicles",id="holy-gerbanis-wisdom-of-windinna:inspiration:0";
globalThis.game={i18n:{localize:key=>key}};
const warnings=[];globalThis.ui={notifications:{warn:value=>warnings.push(value)}};
function fixture(){
 const actor={effects:[]};const effect={id:"e",name:"Inspiration",flags:{[S]:{transformation:{key:`${id}#effect`,sourceId:id,ruleTestContext:{countsById:{}}}}},async delete(){actor.effects=[];}};
 actor.effects=[effect];return {actor,effect};
}
test("creation bonus is optional and is consumed even on an unsuccessful completed test",async()=>{
 const {actor}=fixture(),rows=conditionalSkillModifiers(actor,"knowledge");
 assert.equal(rows.length,1);assert.equal(rows[0].value,3);assert.equal(rows[0].consumeEffectId,"e");
 await withConditionalEffectConsumption(actor,[],async()=>({success:true}));assert.equal(actor.effects.length,1);
 await withConditionalEffectConsumption(actor,rows,async()=>({success:false}));assert.equal(actor.effects.length,0);
});
test("cancelled or failed rolls retain the effect and concurrent use cannot roll twice",async()=>{
 const {actor}=fixture(),rows=conditionalSkillModifiers(actor,"knowledge");
 await withConditionalEffectConsumption(actor,rows,async()=>null);assert.equal(actor.effects.length,1);
 await assert.rejects(withConditionalEffectConsumption(actor,rows,async()=>{throw Error("failed")}));assert.equal(actor.effects.length,1);
 let count=0;const roll=async()=>{count++;return {success:true};};
 const [a,b]=await Promise.all([withConditionalEffectConsumption(actor,rows,roll),withConditionalEffectConsumption(actor,rows,roll)]);
 assert.equal(count,1);assert.ok(a);assert.equal(b,null);assert.ok(warnings.length);
});
test("Accomplished and Mastery apply their selected improvement to one chosen skill roll",async()=>{
 for(const [power,base] of [['accomplished:1',1],['mastery:3',3]]){
  const source=`holy-haminges-power-of-men:${power}`,actor={effects:[]};
  const effect={id:'once',name:power,flags:{[S]:{transformation:{key:`${source}#effect`,sourceId:source,ruleTestContext:{countsById:{[`${source}:2`]:2}}}}},async delete(){actor.effects=[];}};
  actor.effects=[effect];const rows=conditionalSkillModifiers(actor,'knowledge');
  assert.equal(rows.length,1);assert.equal(rows[0].value,base+2);assert.equal(rows[0].consumeEffectId,'once');
  await withConditionalEffectConsumption(actor,rows,async()=>({success:true}));assert.equal(actor.effects.length,0);
 }
});
