import test from "node:test";
import assert from "node:assert/strict";
import {applyItemTransformation} from "../modules/item-effect-application.mjs";

globalThis.foundry={utils:{deepClone:structuredClone},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:42})}}}};
function fixture(){
 const effects=[];let created=0;
 const item={effects,async createEmbeddedDocuments(type,rows){assert.equal(type,"ActiveEffect");created++;const effect={...structuredClone(rows[0]),_source:structuredClone(rows[0]),async update(data){Object.assign(this,structuredClone(data));},async delete(){effects.splice(effects.indexOf(this),1);}};effects.push(effect);return [effect];}};
 return {item,effects,get created(){return created;}};
}
const source=(stackId,duration=2)=>({name:"Hâte",type:"effect",duration:{value:duration,units:"rounds"},system:{stackId,stacking:"replace",changes:[]}});
test("reapplying an item effect renews it and preserves independent castings",async()=>{
 const f=fixture(),first=await applyItemTransformation(f.item,source("cast-a"));
 await applyItemTransformation(f.item,source("cast-b"));
 assert.equal(await applyItemTransformation(f.item,source("cast-a",5)),first);
 assert.equal(f.created,2);assert.equal(f.effects.length,2);assert.equal(first.duration.value,5);assert.equal(first.duration.expired,false);assert.equal(first.start.time,42);
});
test("concurrent applications are serialized and existing duplicates are removed",async()=>{
 const f=fixture();await Promise.all([applyItemTransformation(f.item,source("same")),applyItemTransformation(f.item,source("same",4))]);
 assert.equal(f.created,1);assert.equal(f.effects.length,1);
 await f.item.createEmbeddedDocuments("ActiveEffect",[source("same")]);assert.equal(f.effects.length,2);
 await applyItemTransformation(f.item,source("same",6));assert.equal(f.effects.length,1);assert.equal(f.effects[0].duration.value,6);
});
