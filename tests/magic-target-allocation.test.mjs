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

test("unlimited area targets share the same enhancements without consuming them again",()=>{
 const targeting={groups:[{id:"ally",baseTargets:null,variants:["ally"],additionalTargets:[],allocatableOptions:["duration","bonus"],sharedOptions:["duration","bonus"]},
  {id:"enemy",baseTargets:null,variants:["enemy"],additionalTargets:[],allocatableOptions:["duration","penalty"],sharedOptions:["duration","penalty"]}]};
 const selected={duration:2,bonus:1,penalty:3};
 const allocations=Array.from({length:10},(_,i)=>({targetUuid:`a${i}`,effectKey:"power#ally",countsById:{duration:2,bonus:1}}));
 allocations.push({targetUuid:"enemy",effectKey:"power#enemy",countsById:{duration:2,penalty:3}});
 assert.equal(magicTargetCapacity(targeting,selected,"ally"),Infinity);
 assert.equal(validateMagicAllocations({targeting,selected,allocations}).ok,true);
 allocations[0].countsById.bonus=0;
 assert.equal(validateMagicAllocations({targeting,selected,allocations}).reason,"invalid-allocation");
});

test("personal powers reject other targets unless the contact improvement is purchased",()=>{
 const self={baseTargets:1,additionalTargets:[],casterOnly:true};
 const target=uuid=>({targetUuid:uuid,effectKey:"power#effect",countsById:{}});
 assert.equal(validateMagicAllocations({targeting:self,selected:{},allocations:[target("Actor.caster")],casterUuid:"Actor.caster"}).ok,true);
 assert.equal(validateMagicAllocations({targeting:self,selected:{},allocations:[target("Actor.friend")],casterUuid:"Actor.caster"}).reason,"caster-only");
 assert.equal(validateMagicAllocations({targeting:self,selected:{},allocations:[target("Actor.caster")]}).reason,"invalid-allocation");
 const contact={...self,contactOptionId:"contact"};
 assert.equal(validateMagicAllocations({targeting:contact,selected:{contact:0},allocations:[target("Actor.friend")],casterUuid:"Actor.caster"}).reason,"caster-only");
 assert.equal(validateMagicAllocations({targeting:contact,selected:{contact:1},allocations:[target("Actor.friend")],casterUuid:"Actor.caster"}).ok,true);
 assert.equal(validateMagicAllocations({targeting:contact,selected:{contact:1},allocations:[target("Actor.friend"),target("Actor.caster")],casterUuid:"Actor.caster"}).reason,"exceeds-targets");
});

test("catalogued personal divine powers restrict their target, without treating the equipment rune as caster-only",async()=>{
 const {POWER_DETAILS_BY_ID}=await import("../modules/power-catalog-data.mjs");
 for(const id of ["holy-ealdtradition-gift-of-thanja:stagshape:2","holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4","holy-joaringfaith-fury-of-ogon:rage:2","holy-toikalokke-animal-mind:animal-shape:6"]){
  assert.equal(POWER_DETAILS_BY_ID[id].targeting.casterOnly,true,id);
 }
 assert.notEqual(POWER_DETAILS_BY_ID["holy-thuuldom-hammer-fists:hammer-fists:0"].targeting?.casterOnly,true);
});

test("petrification and tree curses reserve one target while recovery remains a linked consequence",async()=>{
 const {POWER_DETAILS_BY_ID}=await import("../modules/power-catalog-data.mjs");
 for(const id of ["vitner-soil-craft:petrify-remove-petrification:8","vitner-witchcraft:tree-curse:7","holy-tenetnid-tablet-of-anger:statue:5","holy-tenetnid-tablet-of-anger:stone-monument:8","holy-haminges-power-of-the-scale:petrify:7","holy-joaringfaith-curses-of-sonntag:tree-curse:7"]){
  const targeting=POWER_DETAILS_BY_ID[id].targeting;
  const row=targetUuid=>({targetUuid,effectKey:`${id}#effect`,countsById:{}});
  assert.equal(validateMagicAllocations({targeting,selected:{},allocations:[row("Actor.one")]}).ok,true,id);
  assert.equal(validateMagicAllocations({targeting,selected:{},allocations:[row("Actor.one"),row("Actor.two")]}).reason,"exceeds-targets",id);
 }
});
