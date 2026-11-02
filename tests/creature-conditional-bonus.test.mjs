import test from 'node:test';import assert from 'node:assert/strict';
import {creatureConditionalBonuses,matchingCreatureBonus} from '../modules/rules/creature-conditional-bonus.mjs';
test('target categories overlap and power levels increase both bonuses',()=>{
 const id='holy-ealdtradition-heritage-of-majne:giantslayer:2',e={name:'Tueur de géants',system:{changes:[]},flags:{'trudvang-chronicles':{transformation:{sourceId:id,ruleTestContext:{countsById:{[`${id}:1`]:2}}}}}};
 const rows=creatureConditionalBonuses({effects:[e]});assert.equal(rows[0].attack,4);assert.equal(rows[0].damage,6);
 assert.equal(matchingCreatureBonus(rows[0],{system:{tags:['troll','géant']}}),true);assert.equal(matchingCreatureBonus(rows[0],{system:{tags:['dragon']}}),false);
 e.disabled=true;assert.equal(creatureConditionalBonuses({effects:[e]}).length,0);
});
