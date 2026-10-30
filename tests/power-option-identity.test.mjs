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

test('option references resolve by identity after a reorder, independently of their historic index', async()=>{
 const {resolvePowerOptionReference}=await import('../tools/power-option-identity.mjs');
 const entry={catalogId:'power',powerLevels:[{optionId:'power:1'},{optionId:'power:0'}]};
 assert.equal(resolvePowerOptionReference(entry,{index:0,optionId:'power:0',value:2}).index,1);
 assert.throws(()=>resolvePowerOptionReference(entry,{index:0,optionId:'missing'}),/unknown power option/);
});

test('target metadata must agree across languages and refer to a real option',async()=>{
 const {validatePowerTargeting}=await import('../tools/power-option-identity.mjs');
 const entry={catalogId:'power',powerLevels:levels(),targeting:{baseTargets:1,additionalTargets:[{optionId:'power:1',count:1}]}};
 assert.doesNotThrow(()=>validatePowerTargeting(entry,structuredClone(entry)));
 assert.throws(()=>validatePowerTargeting(entry,{...entry,targeting:{...entry.targeting,baseTargets:2}}),/differ/);
 const wrong=structuredClone(entry);wrong.targeting.additionalTargets[0].optionId='missing';
 assert.throws(()=>validatePowerTargeting(wrong,structuredClone(wrong)),/unknown/);
});
