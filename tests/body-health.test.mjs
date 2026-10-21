import test from "node:test";
import assert from "node:assert/strict";
import {resolveBodyHealth,bodyHealthPersistence,bodyHealthUpdate,maximumOnlyHealth} from "../modules/rules/body-health.mjs";

test("maximum-only gains heal by the same amount; expiration only clamps excess health",()=>{
 assert.equal(resolveBodyHealth({value:30,referenceMaximum:40,maximum:45}).current,35);
 assert.equal(resolveBodyHealth({value:35,referenceMaximum:45,maximum:40}).current,35);
 assert.equal(resolveBodyHealth({value:44,referenceMaximum:45,maximum:40}).current,40);
 assert.equal(resolveBodyHealth({value:0,referenceMaximum:40,maximum:45}).current,5);
 assert.equal(resolveBodyHealth({value:-4,referenceMaximum:40,maximum:45}).current,1);
 assert.equal(resolveBodyHealth({value:30,referenceMaximum:40,maximum:35}).current,30);
});

test("paired vitality adds once, survives reloads and can kill on expiration",()=>{
 const state=resolveBodyHealth({value:30,referenceMaximum:40,referenceModifier:0,maximum:53,modifier:13});
 assert.equal(state.current,43);
 const actor={bodyHealthState:state,_source:{system:{resources:{body:{value:30,maxAtValue:40,modifierAtValue:0}}}}};
 const updates=bodyHealthPersistence(actor);
 assert.equal(updates["system.resources.body.value"],30);
 assert.equal(updates["system.resources.body.maximumOnlyAtValue"],40);
 const reload=resolveBodyHealth({value:30,referenceMaximum:53,referenceModifier:13,maximum:53,modifier:13});
 assert.equal(reload.current,43);assert.equal(reload.adjusted,false);
 // 43 - 35 damage = 8 effective HP; intrinsic value is 8 - 13 = -5.
 assert.equal(resolveBodyHealth({value:-5,referenceMaximum:53,referenceModifier:13,maximum:40,modifier:0}).current,-5);
});

test("maximum-only and paired grants can be added, removed or swapped together",()=>{
 assert.equal(resolveBodyHealth({value:30,referenceMaximum:40,referenceModifier:0,maximum:58,modifier:13}).current,48);
 assert.equal(resolveBodyHealth({value:35,referenceMaximum:58,referenceModifier:13,maximum:45,modifier:0}).current,35);
 assert.equal(resolveBodyHealth({value:35,referenceMaximum:58,referenceModifier:13,maximum:53,modifier:13}).current,48);
 assert.equal(resolveBodyHealth({value:30,referenceMaximum:45,referenceModifier:5,maximum:45,modifier:0}).current,35);
});

test("damage before synchronization records the new baseline even if the stored value has not changed",()=>{
 const actor={system:{resources:{body:{current:35,max:45}},modifiers:{bodyValue:0}}};
 assert.deepEqual(bodyHealthUpdate(actor,30),{"system.resources.body.value":30,"system.resources.body.maxAtValue":45,"system.resources.body.modifierAtValue":0,"system.resources.body.maximumOnlyAtValue":45});
 assert.equal(resolveBodyHealth({value:30,maximum:45,referenceMaximum:45}).current,30);
 assert.equal(resolveBodyHealth({value:30,maximum:40,referenceMaximum:45}).current,30);
});

test("value-only effects stay independent of maximum-only health grants",()=>{
 const effect=(paired,value)=>({system:{changes:[{key:"system.modifiers.bodyValue",type:"add",value:String(value)},...paired?[{key:"system.modifiers.bodyMax",type:"add",value:String(value)}]:[]]}});
 const actor={system:{resources:{body:{max:53}},modifiers:{bodyValue:18}},effects:[effect(true,13),effect(false,5)]};
 assert.equal(maximumOnlyHealth(actor),40);
 assert.equal(resolveBodyHealth({value:30,modifier:18,maximum:53,maximumOnly:40,referenceMaximum:40,referenceModifier:0,referenceMaximumOnly:40}).current,48);
 actor.effects.pop();assert.equal(maximumOnlyHealth(actor),40);
 assert.equal(resolveBodyHealth({value:30,modifier:13,maximum:53,maximumOnly:40,referenceMaximum:53,referenceModifier:18,referenceMaximumOnly:40}).current,43);
 assert.equal(resolveBodyHealth({value:30,maximum:45}).current,30,"initial load never retroactively heals an existing effect");
});
