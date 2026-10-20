import test from "node:test";
import assert from "node:assert/strict";
import {proportionalBodyHealth,bodyHealthPersistence,bodyHealthUpdate} from "../modules/rules/body-health.mjs";

test("maximum changes preserve the current health ratio, rounding upwards on entry and exit",()=>{
 const apply=proportionalBodyHealth({value:30,referenceMaximum:40,maximum:45});
 assert.equal(apply.current,34);
 assert.equal(proportionalBodyHealth({value:34,referenceMaximum:45,maximum:40}).current,31);
 assert.equal(proportionalBodyHealth({value:40,referenceMaximum:40,maximum:45}).current,45);
 assert.equal(proportionalBodyHealth({value:0,referenceMaximum:40,maximum:45}).current,0);
 assert.equal(proportionalBodyHealth({value:-4,referenceMaximum:40,maximum:45}).current,-4);
 assert.equal(proportionalBodyHealth({value:30,referenceMaximum:40,maximum:35}).current,27);
});

test("paired maximum/current bonuses cannot add health a second time, and reloads cannot reapply scaling",()=>{
 const state=proportionalBodyHealth({value:30,referenceMaximum:40,referenceModifier:0,maximum:45,modifier:5});
 assert.equal(state.current,34);
 const actor={bodyHealthState:state,_source:{system:{resources:{body:{value:30,maxAtValue:40,modifierAtValue:0}}}}};
 const updates=bodyHealthPersistence(actor);
 assert.equal(updates["system.resources.body.value"],29);
 assert.equal(updates["system.resources.body.maxAtValue"],45);
 assert.equal(updates["system.resources.body.modifierAtValue"],5);
 const reload=proportionalBodyHealth({value:29,referenceMaximum:45,referenceModifier:5,maximum:45,modifier:5});
 assert.equal(reload.current,34);assert.equal(reload.rescaled,false);
 assert.equal(proportionalBodyHealth({value:29,referenceMaximum:45,referenceModifier:5,maximum:40,modifier:0}).current,31);
});

test("damage before synchronization rebases even when its new stored value matches the previous source value",()=>{
 const actor={system:{resources:{body:{current:34,max:45}},modifiers:{bodyValue:0}}};
 const update=bodyHealthUpdate(actor,30);
 assert.deepEqual(update,{"system.resources.body.value":30,"system.resources.body.maxAtValue":45,"system.resources.body.modifierAtValue":0});
 assert.equal(proportionalBodyHealth({value:30,maximum:45,referenceMaximum:45}).current,30);
 assert.equal(proportionalBodyHealth({value:30,maximum:40,referenceMaximum:45}).current,27);
});

test("an ordinary value-only effect does not rewrite the intrinsic health, and initial baselines preserve existing actors",()=>{
 const state=proportionalBodyHealth({value:30,referenceMaximum:40,maximum:40,modifier:20});
 const actor={bodyHealthState:state,_source:{system:{resources:{body:{value:30,maxAtValue:40,modifierAtValue:0}}}}};
 assert.equal(state.current,40);
 assert.equal(bodyHealthPersistence(actor)["system.resources.body.value"],undefined);
 assert.equal(proportionalBodyHealth({value:30,maximum:45}).current,30,"initial load does not retroactively scale an existing active effect");
});
