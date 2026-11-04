import test from 'node:test';
import assert from 'node:assert/strict';
import {magicFearProfile,magicFearHasBaseTargets} from '../modules/magic-fear.mjs';
const cases=[['vitner-power-of-thought:fear:3',3,[[10,0,0],[10,10,0],[10,9,0],[10,8,0],[10,8,1]]],['holy-gerbanis-wrath-of-tyrd:wolf-tongue:2',1,[[10,0,0],[10,10,0],[10,9,0],[10,8,0],[10,8,1]]],['holy-gerbanis-wrath-of-tyrd:dark-visage:5',2,[[10,10,0],[10,9,0],[10,8,0],[10,7,0],[10,6,0]]],['holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8',1,[[10,9,0],[10,8,0],[10,8,1]]],['holy-haminges-power-of-the-scale:dreadful-screech:0',1,[[5,0,0],[10,0,0],[10,10,0],[10,9,0],[10,8,0],[10,8,1]]],['holy-haminges-power-of-the-scale:terrifying-howl:2',1,[[10,0,0],[10,10,0],[10,9,0],[10,8,0],[10,8,1]]],['holy-haminges-power-of-the-scale:scream-of-the-devouress:6',1,[[10,10,0],[10,9,0],[10,8,0],[10,8,1]]]];
test('all seven magical fear profiles match every French step and freeze choices by identity',()=>{
 for(const [sourceId,index,steps] of cases){const document={system:{catalogId:sourceId}};
  for(let n=0;n<steps.length;n++){
   const result=magicFearProfile(document,{sourceId,countsById:{[sourceId+':'+index]:n},counts:[99,99,99,99]});
   assert.deepEqual([result.faces,result.threshold,result.modifier],steps[n],sourceId+' '+n);assert.equal(result.dice,1);
  }
  const final=magicFearProfile(document,{sourceId,countsById:{[sourceId+':'+index]:99}});
  assert.deepEqual([final.faces,final.threshold,final.modifier],steps.at(-1));
 }
});
test('additional recipients can use the base fear profile only when bought',()=>{
 const id='holy-gerbanis-wrath-of-tyrd:dark-visage:5',document={system:{catalogId:id}};
 assert.equal(magicFearHasBaseTargets(document,{sourceId:id,countsById:{[id+':2']:4}}),false);
 assert.equal(magicFearHasBaseTargets(document,{sourceId:id,countsById:{[id+':1']:1,[id+':2']:4}}),true);
 assert.equal(magicFearProfile({system:{catalogId:'unknown'}}),null);
 assert.equal(magicFearProfile({system:{catalogId:cases[0][0]}}).requiresResistance,true);
});
