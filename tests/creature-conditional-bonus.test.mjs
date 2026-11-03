import test from 'node:test';import assert from 'node:assert/strict';
import {creatureConditionalBonuses,matchingCreatureBonus,conditionalDamageBonus} from '../modules/rules/creature-conditional-bonus.mjs';
import {prepareDamageRoll} from '../modules/rules/damage-roll-resolver.mjs';
test('target categories overlap and power levels increase both bonuses',()=>{
 const id='holy-ealdtradition-heritage-of-majne:giantslayer:2',e={name:'Tueur de géants',system:{changes:[]},flags:{'trudvang-chronicles':{transformation:{sourceId:id,ruleTestContext:{countsById:{[`${id}:1`]:2}}}}}};
 const rows=creatureConditionalBonuses({effects:[e]});assert.equal(rows[0].attack,4);assert.equal(rows[0].damage,6);
 assert.equal(matchingCreatureBonus(rows[0],{system:{tags:['troll','géant']}}),true);assert.equal(matchingCreatureBonus(rows[0],{system:{tags:['dragon']}}),false);
 e.disabled=true;assert.equal(creatureConditionalBonuses({effects:[e]}).length,0);
});
test('weapon blessings add their improved base once and choose the highest creature bonus per effect',()=>{
 const id='holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5';
 const effect={id:'one',name:'Blessing',flags:{'trudvang-chronicles':{transformation:{key:`${id}#weapon`,resolved:true,ruleTestContext:{countsById:{[`${id}:2`]:2}}}}}};
 const item={type:'weapon',system:{damage:'1d10',damageBonus:0,openRoll:10},effects:[effect]};
 const rows=creatureConditionalBonuses(null,item);
 assert.equal(prepareDamageRoll({item}).fixedModifier,5);
 assert.equal(conditionalDamageBonus(rows,{system:{tags:['mort-vivant']}}),2);
 assert.equal(conditionalDamageBonus(rows,{system:{tags:['demon']}}),4);
 assert.equal(conditionalDamageBonus(rows,{system:{tags:['mort-vivant','demon']}}),4);
 item.effects.push({...effect,id:'two'});
 assert.equal(prepareDamageRoll({item}).fixedModifier,10);
 assert.equal(conditionalDamageBonus(creatureConditionalBonuses(null,item),{system:{tags:['undead','demon']}}),8);
 effect.disabled=true;
 assert.equal(prepareDamageRoll({item}).fixedModifier,5);
 item.effects[1].duration={expired:true};
 assert.equal(prepareDamageRoll({item}).fixedModifier,0);
});
