import test from 'node:test';
import assert from 'node:assert/strict';
import {itemQualityChanges,intrinsicQualityUpdate,itemUseModifierTotal} from '../modules/rules/item-quality.mjs';
test('gear quality changes never invent integrity or change weapon damage',()=>{
 const item={type:'gear',_source:{system:{quality:2,value:100,weight:2}}};
 const update=intrinsicQualityUpdate(item,{system:{quality:1}});
 assert.equal(update.system.value,50);assert.equal(update.system.breach,undefined);assert.equal(update.system.weight,2);
 const rows=itemQualityChanges({type:'weapon',system:{breach:{value:50,max:50}}},2,0).changes;
 assert.equal(rows.some(row=>/damage/.test(row.key)),false);
 assert.equal(rows.find(row=>row.key==='system.combatPointBonus').value,'-2');
});
test('tool quality bonuses stack only from masterful quality and remain capped separately from magical bonuses',()=>{
 const q=(qualityLevel,value)=>({qualityLevel,value});
 assert.equal(itemUseModifierTotal([q(3,1),q(3,1)]),1);
 assert.equal(itemUseModifierTotal([q(4,2),q(4,2),q(5,3)]),6);
 assert.equal(itemUseModifierTotal([q(4,2),q(5,3),q(3,1)]),5);
 assert.equal(itemUseModifierTotal([q(5,3),q(5,3),q(5,3),{value:2},q(1,-1)]),7);
});
