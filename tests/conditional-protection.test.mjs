import test from 'node:test';
import assert from 'node:assert/strict';
import {conditionalProtectionRows} from '../modules/rules/conditional-protection.mjs';
import {applyDamageToActor} from '../modules/damage-application.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {validateMagicAllocations} from '../modules/rules/magic-target-allocation.mjs';
const scope='trudvang-chronicles';
function effect(suffix,boost=2,base=false){const sourceId='holy-gerbanis-power-of-enken:'+suffix,index=suffix==='hurricane-armor:7'?4:3;return {name:suffix,flags:{[scope]:{transformation:{key:sourceId+'#'+(base?'base':'protection'),sourceId,resolved:true,ruleTestContext:{countsById:{[sourceId+':'+index]:boost}}}}}};}
test('wind protections distinguish melee, ranged, magical weapons and base recipients',()=>{
 for(const [suffix,values] of [['wind-shield:3',[3,5,0,0]],['storm-armor:5',[4,6,3,5]],['hurricane-armor:7',[6,8,5,7]]]){
  const e=effect(suffix),actor={effects:[e]};
  const amount=(usage,magicalWeapon=false)=>conditionalProtectionRows(actor,{usage,magicalWeapon}).reduce((sum,row)=>sum+row.amount,0);
  assert.deepEqual([amount('melee'),amount('ranged'),amount('melee',true),amount('throwing',true)],values);
  assert.equal(amount('magic'),0);assert.equal(amount(''),0);
  e.disabled=true;assert.equal(amount('melee'),0);
 }
 assert.equal(conditionalProtectionRows({effects:[effect('storm-armor:5',99,true)]},{usage:'ranged'})[0].amount,4);
});
test('conditional barriers absorb hits before armor integrity and are bypassed with all other protection',async()=>{
 const armor={id:'mail',type:'armor',system:{equipped:true,breach:{value:50}}},updates=[];
 const actor={isOwner:true,effects:[effect('storm-armor:5')],items:[armor],system:{protection:5,resources:{body:{value:20,max:20}}},async update(){},async updateEmbeddedDocuments(type,data){updates.push(data);}};
 let hit=await applyDamageToActor({actor,damage:6,usage:'melee',announce:false});
 assert.equal(hit.conditionalProtection,4);assert.equal(hit.bodyDamage,0);assert.equal(updates.length,0);
 hit=await applyDamageToActor({actor,damage:10,usage:'melee',announce:false});
 assert.equal(hit.bodyDamage,1);assert.equal(hit.armorDamage[0].integrityLoss,1);
 hit=await applyDamageToActor({actor,damage:10,usage:'melee',ignoreArmor:true,announce:false});
 assert.equal(hit.conditionalProtection,0);assert.equal(hit.bodyDamage,10);assert.deepEqual(hit.armorDamage,[]);
});
test('additional base protection recipients require a purchased target and cannot receive upgrades',()=>{
 const id='holy-gerbanis-power-of-enken:storm-armor:5',targeting=POWER_DETAILS_BY_ID[id].targeting;
 const allocate=selected=>validateMagicAllocations({targeting,selected,allocations:[{effectKey:id+'#base',targetUuid:'Actor.ally',countsById:{}}],casterUuid:'Actor.caster'});
 assert.equal(allocate({}).ok,false);assert.equal(allocate({[id+':4']:1}).ok,true);
 assert.equal(validateMagicAllocations({targeting,selected:{[id+':4']:1,[id+':3']:1},allocations:[{effectKey:id+'#base',targetUuid:'Actor.ally',countsById:{[id+':3']:1}}],casterUuid:'Actor.caster'}).ok,false);
});
