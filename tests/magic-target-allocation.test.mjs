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
