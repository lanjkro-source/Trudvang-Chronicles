import test from 'node:test';
import assert from 'node:assert/strict';
import {NID_BLESSINGS,nidBlessingRestriction,nidBlessingBonus} from '../modules/rules/nid-blessings.mjs';
const ids=Object.keys(NID_BLESSINGS),scope='trudvang-chronicles';
const effect=(id,caster='Actor.caster')=>({id:'effect',name:id,flags:{[scope]:{transformation:{sourceId:id,ruleTestContext:{casterUuid:caster}}}}});
test('all three blessings exclude their caster and cannot coexist, even when disabled',()=>{
 for(const id of ids){assert.equal(nidBlessingRestriction({uuid:'Actor.caster',effects:[]},effect(id)),'TRUDVANG.Blessing.NoSelf');
  for(const other of ids)assert.equal(nidBlessingRestriction({uuid:'Actor.target',effects:[{...effect(other),disabled:true}]},effect(id)),'TRUDVANG.Blessing.AlreadyBlessed');
  assert.equal(nidBlessingRestriction({uuid:'Actor.target',effects:[{...effect(id),duration:{expired:true}}]},effect(id)),'');
 }
});
test('an inactive blessing supplies no bonus and each source retains its own improvements',()=>{
 for(const id of ids){let e=effect(id);const def=NID_BLESSINGS[id];e.flags[scope].transformation.ruleTestContext.countsById={[id+':'+def.index]:2};
  assert.equal(nidBlessingBonus({effects:[e]}).value,def.base+(def.index===null?0:2));
  assert.equal(nidBlessingBonus({effects:[{...e,disabled:true}]}),null);
 }
});
