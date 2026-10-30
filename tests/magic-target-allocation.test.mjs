import test from "node:test";
import assert from "node:assert/strict";
import {magicTargetCapacity,validateMagicAllocations} from "../modules/rules/magic-target-allocation.mjs";

const targeting={baseTargets:1,additionalTargets:[{optionId:"extra",count:1}]};
const selected={extra:1,duration:2,range:1};
const target=(targetUuid,countsById)=>({targetUuid,countsById});
test("two improvements can be spent on one target or split across both targets",()=>{
 assert.equal(magicTargetCapacity(targeting,selected),2);
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{duration:2}),target("b",{})]}).ok,true);
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{duration:1}),target("b",{duration:1})]}).ok,true);
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{duration:2}),target("b",{duration:1})]}).reason,"exceeds-improvements");
});
test("target limits, unique targets and valid option counts are enforced",()=>{
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{}),target("b",{}),target("c",{})]}).reason,"exceeds-targets");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{}),target("a",{})]}).reason,"duplicate-target");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{extra:1})]}).reason,"invalid-allocation");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[target("a",{duration:-1})]}).reason,"invalid-allocation");
 assert.equal(validateMagicAllocations({targeting:null,selected,allocations:[]}).reason,"unknown-targeting");
});

test("ally and enemy limits are separate while improvements share the purchased budget",()=>{
 const targeting={groups:[{id:"ally",baseTargets:1,variants:["ally"],additionalTargets:[{optionId:"extraAlly",count:1}],allocatableOptions:["duration","bonus"]},
  {id:"enemy",baseTargets:1,variants:["enemy"],additionalTargets:[{optionId:"extraEnemy",count:1}],allocatableOptions:["duration","penalty"]}]};
 const selected={extraAlly:1,extraEnemy:0,duration:2,bonus:1,penalty:1};
 const row=(targetUuid,effectKey,countsById)=>({targetUuid,effectKey,countsById});
 const allocations=[row("a","power#ally",{duration:1,bonus:1}),row("b","power#ally",{}),row("c","power#enemy",{duration:1,penalty:1})];
 assert.equal(validateMagicAllocations({targeting,selected,allocations}).ok,true);
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[...allocations,row("d","power#enemy",{})]}).reason,"exceeds-targets");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[...allocations.slice(0,2),row("c","power#enemy",{duration:2})]}).reason,"exceeds-improvements");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[row("a","power#enemy",{bonus:1})]}).reason,"invalid-allocation");
 assert.equal(validateMagicAllocations({targeting,selected,allocations:[row("a","power#unknown",{})]}).reason,"invalid-allocation");
});
