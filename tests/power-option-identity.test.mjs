import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePowerOptionIdentities} from '../tools/power-option-identity.mjs';
const levels=()=>[{optionId:'power:0',referenceIndex:0},{optionId:'power:1',referenceIndex:1}];
test('stable power-option identities match across languages and reject unsafe reorder or duplication',()=>{
 const fr=levels(),en=levels();assert.doesNotThrow(()=>validatePowerOptionIdentities('power',fr,en));
 assert.throws(()=>validatePowerOptionIdentities('power',[...fr].reverse(),[...en].reverse()),/reordered/);
 assert.throws(()=>validatePowerOptionIdentities('power',fr,[en[1],en[0]]),/differ/);
 assert.throws(()=>validatePowerOptionIdentities('power',[fr[0],fr[0]],[en[0],en[0]]),/duplicate/);
});
