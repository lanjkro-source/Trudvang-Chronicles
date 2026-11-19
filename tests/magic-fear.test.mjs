import test from 'node:test';
import assert from 'node:assert/strict';
import {magicFearProfile,magicFearHasBaseTargets,magicFearArea,captureMagicFearArea} from '../modules/magic-fear.mjs';
import {registerMagicFearPreview} from '../modules/magic-fear-preview.mjs';
import {fearRecipientEligible} from '../modules/rules/fear-protection.mjs';
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

test('Wolf Tongue snapshots hostile intelligent targets within its improved radius', () => {
 const id = 'holy-gerbanis-wrath-of-tyrd:wolf-tongue:2';
 const document = {system:{catalogId:id}};
 const token = (name, x, overrides={}) => ({
  name, uuid:'Token.'+name, actor:{type:'character',uuid:name}, x, y:0, width:1, height:1, level:'ground', disposition:-1, ...overrides
 });
 const caster = token('caster',0);
 const near = token('near',250,{level:'adjacent',disposition:'-1',includedInLevel:level=>level==='ground'});
 const far = token('far',500);
 const hidden = token('hidden',500,{hidden:true});
 const scene = {grid:{size:100,distance:2,units:'m'},tokens:[
  caster, near, far, hidden, token('beyond',501), token('friend',50,{disposition:1}),
  token('other floor',50,{level:'upper'}), token('linked copy',100,{actor:near.actor}),
  token('beast',100,{actor:{type:'npc',uuid:'beast',system:{tags:['bête']}}}),
  token('troll',100,{actor:{type:'npc',uuid:'troll',system:{tags:['troll']}}})
 ]};
 const base = magicFearArea(document,{},caster,scene);
 assert.equal(base.radius,5);
 assert.deepEqual(base.targets.map(row=>row.actorUuid),['near','troll']);
 const improved = magicFearArea(document,{countsById:{[id+':0']:1}},caster,scene);
 assert.equal(improved.radius,10);
 assert.equal(improved.radiusPixels,500);
 assert.deepEqual(improved.targets.map(row=>row.actorUuid),['near','far','hidden','troll']);
 assert.deepEqual(improved.targets.map(row=>row.name),['near','far','','troll']);
 assert.equal(improved.targets.at(-1).canApply,false);
 const context = {areaActorUuids:improved.targets.map(row=>row.actorUuid)};
 assert.equal(fearRecipientEligible(far.actor,context),true);
 assert.equal(fearRecipientEligible(caster.actor,context),false);
 assert.equal(fearRecipientEligible(near.actor,{areaActorUuids:[]}),false);
});

test('the successful cast preview persists and redraws until the last fear target is resolved', t => {
 const previous = {canvas:globalThis.canvas,game:globalThis.game,PIXI:globalThis.PIXI,Hooks:globalThis.Hooks};
 t.after(() => Object.assign(globalThis,previous));
 const hooks = new Map(), drawn = [];
 globalThis.Hooks = {on:(name,fn) => hooks.set(name,fn)};
 globalThis.PIXI = {Graphics:class {
  lineStyle() { return this; }
  beginFill() { return this; }
  drawCircle(...args) { drawn.push(['circle',...args]); return this; }
  endFill() { return this; }
  drawRoundedRect(...args) { drawn.push(['target',...args]); }
  destroy() { drawn.push(['destroy']); }
 }};
 const token = (id,x,disposition,hidden=false) => ({
  id,uuid:'Token.'+id,name:id,x,y:0,width:1,height:1,disposition,hidden,actor:{type:'character',uuid:id}
 });
 const caster = token('caster',0,1), hostile = token('hostile',100,-1);
 const hidden = token('hidden',200,-1,true), friendly = token('friendly',300,1);
 const tokens = new Map([caster,hostile,hidden,friendly].map(row => [row.id,row]));
 const scene = {id:'scene',grid:{size:100,distance:2,units:'m'},tokens};
 globalThis.canvas = {scene,ready:true,tokens:{placeables:[...tokens.values()].map(document => ({
  document,x:document.x,y:document.y,w:100,h:100,isVisible:!document.hidden
 }))},interface:{addChild:graphic => assert.equal(graphic.eventMode,'none')}};
 const messages = new Map();
 globalThis.game = {user:{id:'player'},messages};
 registerMagicFearPreview();
 const area = captureMagicFearArea({system:{catalogId:cases[1][0]}},{},caster.actor,{scene:scene.id,token:caster.id});
 const system = 'trudvang-chronicles';
 const message = {id:'cast',flags:{[system]:{magicFearArea:area}}};
 messages.set(message.id,message);
 hooks.get('createChatMessage')(message);
 assert.deepEqual(drawn.slice(0,2),[['circle',50,50,250],['target',97,-3,106,106,8]]);
 hooks.get('canvasTearDown')();
 assert.deepEqual(drawn.at(-1),['destroy']);
 hooks.get('canvasReady')();
 assert.deepEqual(drawn.at(-1),['target',97,-3,106,106,8]);
 const fear = {id:'fear',flags:{[system]:{fearContext:{areaSceneId:scene.id,originMessageId:message.id},fearTargets:area.targets}}};
 messages.set(fear.id,fear);
 hooks.get('createChatMessage')(fear);
 assert.deepEqual(drawn.at(-1),['target',97,-3,106,106,8]);
 fear.flags[system].applications = [{channel:'fear',actorUuid:'hostile'}];
 hooks.get('updateChatMessage')(fear);
 assert.deepEqual(drawn.at(-1),['circle',50,50,250]);
 fear.flags[system].fearManualResolutions = ['hidden'];
 hooks.get('updateChatMessage')(fear);
 assert.deepEqual(drawn.at(-1),['destroy']);
 const completed = drawn.length;
 hooks.get('canvasReady')();
 assert.equal(drawn.length,completed);
});
