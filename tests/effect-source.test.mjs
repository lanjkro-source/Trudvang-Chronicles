import test from "node:test";
import assert from "node:assert/strict";
import {effectChangesSource,effectSource} from "../modules/rules/effect-source.mjs";
import {TRANSFORMATION_TEMPLATES} from "../modules/transformation-data.mjs";
import {rulesFromChanges,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";

class ChangeModel {
 constructor(data,parent){Object.assign(this,data);this.parent=parent;}
 toObject(){const {parent,...source}=this;return source;}
}
const liveSystem=changes=>{
 const system={stackId:"test",changes:[],stages:[]};
 system.changes=changes.map(change=>new ChangeModel(change,system));
 return system;
};
function strictClone(value,parents=new Set()){
 if(value===null||typeof value!=="object")return value;
 if(parents.has(value))throw Error("Maximum depth exceeded. Be sure your object does not contain cyclical data structures.");
 parents.add(value);
 const copy=Array.isArray(value)?value.map(v=>strictClone(v,parents)):Object.fromEntries(Object.entries(value).map(([k,v])=>[k,strictClone(v,parents)]));
 parents.delete(value);return copy;
}

test("all 110 effect variants serialize native model changes without their cyclic parents",()=>{
 for(const [key,template]of Object.entries(TRANSFORMATION_TEMPLATES)){
  const system=liveSystem(template.changes);
  if(system.changes.length)assert.throws(()=>strictClone(structuredClone(system.changes)),/Maximum depth exceeded/,key);
  const result=effectChangesSource(system.changes);
  assert.doesNotThrow(()=>strictClone(result),key);
  assert.deepEqual(result.map(c=>[c.key,c.type,c.value,c.priority]),template.changes.map(c=>[c.key,c.type,c.value,c.priority]),key);
  for(const row of result)assert.equal(row.parent,undefined);
  assert.equal(system.changes[0]?.parent,system.changes.length?system:undefined);
 }
});

test("the creation boundary and staged effects remove native models while preserving editable values",()=>{
 const system=liveSystem([{key:"system.modifiers.rolls.attack",type:"add",value:"3",priority:17,phase:"final"}]);
 const stage={label:"Second stage",durationValue:2,durationUnit:"rounds",changes:system.changes};
 system.stages=[stage];
 const source={name:"Custom",system,flags:{"trudvang-chronicles":{transformation:{editableChanges:true}}}};
 const data=effectSource(source);
 assert.doesNotThrow(()=>strictClone(data));
 assert.equal(data.system.changes[0].priority,17);
 assert.equal(data.system.changes[0].value,"3");
 assert.equal(data.system.changes[0].phase,"initial");
 assert.equal(data.system.stages[0].changes[0].parent,undefined);
 assert.equal(system.changes[0].phase,"final","serializing cannot mutate the native model");
 assert.equal(data.flags,source.flags);
});

test("V14.369 typed JSON change values round-trip for every effect, including nested Hasten's VC table",()=>{
 for(const [key,template]of Object.entries(TRANSFORMATION_TEMPLATES)){
  const typed=template.changes.map(change=>{
   let value=change.value;try{value=JSON.parse(value);}catch{}
   return {...change,value};
  });
  const system=liveSystem(typed);
  const result=effectSource({system}).system.changes;
  assert.ok(result.every(validProfileChange),key);
  assert.deepEqual(rulesFromChanges(result),rulesFromChanges(template.changes),key);
  assert.doesNotThrow(()=>strictClone(result),key);
  assert.ok(result.every(c=>typeof c.value==="string"),key);
 }
});

test("already parsed JSON arrays must not be coerced back into scalar values",()=>{
 for(const senses of [["0"],["true"],["null"],[]]){
  assert.deepEqual(rulesFromChanges([{key:"system.transformation.senses",type:"override",value:senses}]).senses,senses);
 }
});
