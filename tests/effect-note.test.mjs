import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveEffectNote} from '../modules/rules/effect-note.mjs';
test('combined effect notes prefer frozen option identities and add every term exactly once',()=>{
 const p={index:0,optionId:'a',base:20,value:20,extraTerms:[{index:1,optionId:'b',value:100},{index:2,optionId:'c',value:500}]};
 assert.equal(resolveEffectNote(p,{countsById:{a:2,b:3,c:1},counts:[99,99,99]}),860);
 assert.equal(resolveEffectNote(p,{counts:[2,3,1]}),860);
 assert.equal(resolveEffectNote(p),20);
 assert.equal(resolveEffectNote({index:0,base:-5,value:-1},{counts:[2]}),-7);
});
