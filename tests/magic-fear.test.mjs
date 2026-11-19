import test from 'node:test';
import assert from 'node:assert/strict';
import {magicFearProfile,magicFearHasBaseTargets,magicFearArea,captureMagicFearArea} from '../modules/magic-fear.mjs';
import {nativeFearTargets,registerMagicFearPreview,synchronizeMagicFearRegion} from '../modules/magic-fear-preview.mjs';
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

test('Wolf Tongue detects hostile tokens within its improved radius', () => {
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
 assert.deepEqual(base.targets.map(row=>row.actorUuid),['near','beast','troll']);
 const improved = magicFearArea(document,{countsById:{[id+':0']:1}},caster,scene);
 assert.equal(improved.radius,10);
 assert.equal(improved.radiusPixels,500);
 assert.deepEqual(improved.targets.map(row=>row.actorUuid),['near','far','hidden','beast','troll']);
 assert.deepEqual(improved.targets.map(row=>row.name),['near','far','','beast','troll']);
 const context = {areaActorUuids:improved.targets.map(row=>row.actorUuid)};
 assert.equal(fearRecipientEligible(far.actor,context),true);
 assert.equal(fearRecipientEligible(caster.actor,context),false);
 assert.equal(fearRecipientEligible(near.actor,{areaActorUuids:[]}),false);
});

test('the GM creates a native region once and removes it after application and target edits', async t => {
 const previous = {canvas:globalThis.canvas,game:globalThis.game,PIXI:globalThis.PIXI,Hooks:globalThis.Hooks,CONST:globalThis.CONST};
 t.after(() => Object.assign(globalThis,previous));
 const hooks = new Map(), drawn = [];
 globalThis.Hooks = {on:(name,fn) => hooks.set(name,fn)};
 globalThis.PIXI = {Graphics:class {
  lineStyle() { return this; }
  drawRoundedRect(...args) { drawn.push(['target',...args]); }
  destroy() { drawn.push(['destroy']); }
 }};
 const token = (id,x,disposition,hidden=false) => ({
  id,uuid:'Token.'+id,name:id,x,y:0,width:1,height:1,disposition,hidden,actor:{type:'character',uuid:id}
 });
 const caster = token('caster',0,1), hostile = token('hostile',100,-1);
 caster.actor.testUserPermission = () => true;
 const hidden = token('hidden',200,-1,true), friendly = token('friendly',300,1);
 const tokens = new Map([caster,hostile,hidden,friendly].map(row => [row.id,row]));
 const regions = new Map(), created = [];
 const scene = {id:'scene',grid:{size:100,distance:2,units:'m'},tokens,regions,
  async createEmbeddedDocuments(type,[data]) {
   assert.equal(type,'Region');
   const region = {...data,parent:this,id:'region',async delete() {regions.delete(this.id);}};
   regions.set(region.id,region);
   created.push(data);
   return [region];
  }};
 globalThis.canvas = {scene,ready:true,tokens:{placeables:[...tokens.values()].map(document => ({
  document,x:document.x,y:document.y,w:100,h:100,isVisible:!document.hidden
 }))},interface:{addChild:graphic => assert.equal(graphic.eventMode,'none')}};
 const messages = new Map();
 const gm = {id:'gm',isGM:true};
 globalThis.game = {user:gm,users:{activeGM:gm},messages,scenes:new Map([[scene.id,scene]]),i18n:{localize:key=>key}};
 globalThis.CONST = {REGION_VISIBILITY:{ALWAYS:2}};
 registerMagicFearPreview();
 const area = captureMagicFearArea({system:{catalogId:cases[1][0]}},{},caster.actor,{scene:scene.id,token:caster.id});
 const system = 'trudvang-chronicles';
 const message = {id:'cast',author:gm,rolls:[{total:7}],flags:{[system]:{
  magicFearArea:{...area,nativeRegion:true,target:12},ruleTestContext:{sourceId:cases[1][0],casterUuid:caster.actor.uuid}
 }}};
 messages.set(message.id,message);
 hooks.get('createChatMessage')(message);
 await Promise.all([synchronizeMagicFearRegion(message.id),synchronizeMagicFearRegion(message.id)]);
 assert.equal(created.length,1);
 assert.equal(created[0].visibility,2);
 assert.deepEqual(created[0].shapes,[{type:'circle',x:50,y:50,radius:250}]);
 assert.deepEqual(nativeFearTargets({...area,targets:[]},message.id,caster.actor.uuid).map(row=>row.actorUuid),['hostile','hidden']);
 hostile.x=900;
 assert.deepEqual(nativeFearTargets(area,message.id,caster.actor.uuid).map(row=>row.actorUuid),['hidden']);
 hostile.x=100;
 assert.deepEqual(drawn[0],['target',97,-3,106,106,8]);
 hooks.get('canvasTearDown')();
 assert.deepEqual(drawn.at(-1),['destroy']);
 hooks.get('canvasReady')();
 assert.deepEqual(drawn.at(-1),['target',97,-3,106,106,8]);
 const fear = {id:'fear',flags:{[system]:{fearContext:{grouped:true,areaSceneId:scene.id,originMessageId:message.id},fearTargets:area.targets}}};
 messages.set(fear.id,fear);
 hooks.get('createChatMessage')(fear);
 assert.deepEqual(drawn.at(-1),['target',97,-3,106,106,8]);
 fear.flags[system].applications = [{channel:'fear',actorUuid:'hostile'}];
 hooks.get('updateChatMessage')(fear);
 await synchronizeMagicFearRegion(message.id);
 assert.equal(regions.size,1);
 fear.flags[system].fearTargets = area.targets.filter(row=>row.actorUuid!=='hidden');
 hooks.get('updateChatMessage')(fear);
 await synchronizeMagicFearRegion(message.id);
 assert.equal(regions.size,1);
 fear.flags[system].fearBatchApplied = true;
 hooks.get('updateChatMessage')(fear);
 await synchronizeMagicFearRegion(message.id);
 assert.equal(regions.size,0);
 assert.deepEqual(drawn.at(-1),['destroy']);
 const completed = drawn.length;
 hooks.get('canvasReady')();
 await synchronizeMagicFearRegion(message.id);
 assert.equal(drawn.length,completed);
 assert.equal(created.length,1);
});
