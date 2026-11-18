import test from 'node:test';import assert from 'node:assert/strict';import {windProjectionProfile,minimumDamageAfterArmor} from '../modules/rules/impact.mjs';
test('all wind size boundaries select exactly one row, including fractional creatures and giants',()=>{
 for(const [size,dice,faces,threshold]of [[.2,3,10,10],[1/3,2,10,10],[.49,2,10,10],[.5,1,10,10],[1,1,10,10],[1.5,1,10,0],[3,1,6,0],[5,1,3,0],[10,0,10,0]])assert.deepEqual(windProjectionProfile(size),{dice,faces,threshold,...(size===10?{modifier:1}:{})});
});
test('soil damage floor follows stable option identities and additional recipients keep the base version',()=>{
 const d={minimumAfterArmor:{base:1,optionId:'soil:2'}};assert.equal(minimumDamageAfterArmor(d,{countsById:{'soil:2':4}}),5);assert.equal(minimumDamageAfterArmor(d,{countsById:{'soil:2':4}},true),1);assert.equal(minimumDamageAfterArmor(d,{counts:[0,0,2]}),3);assert.equal(minimumDamageAfterArmor({}),0);
});
