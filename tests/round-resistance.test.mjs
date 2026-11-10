import test from 'node:test';
import assert from 'node:assert/strict';
import {applyRoundResistanceRelief,resetRoundResistances} from '../modules/round-resistance.mjs';
const S='trudvang-chronicles',key='system.modifiers.rolls.allActions';
function setup(){
 globalThis.game={time:{worldTime:0},combat:{id:'c',round:1,started:true},users:{activeGM:{isSelf:true}},actors:[],scenes:[],i18n:{format:(_,data)=>`Malus : ${data.value}`}};
 const actor={uuid:'Actor.a',documentName:'Actor',isOwner:true,effects:[]};game.actors.push(actor);
 const source={system:{changes:[{key,type:'add',value:'-5',phase:'initial'}]}};
 const effect={id:'e',parent:actor,_source:source,system:source.system,flags:{[S]:{transformation:{summary:'Malus : -5',roundResistance:{testIndex:0,key,relief:2,summaryKey:'TRUDVANG.Transformation.RavenPenalty'}}}},updates:0};
 effect.update=async changes=>{effect.updates++;for(const [path,value]of Object.entries(changes)){if(path==='system.changes'){effect.system.changes=value;continue;}const parts=path.split('.'),last=parts.pop(),target=parts.reduce((o,k)=>o[k]??={},effect);if(last.startsWith('-='))delete target[last.slice(2)];else target[last]=structuredClone(value);}};
 actor.effects.push(effect);return {actor,effect};
}
test('ravens retain purchased tenacity: successful resistance changes -5 to -3 only for this round',async()=>{
 const {effect}=setup();assert.equal(await applyRoundResistanceRelief(effect,0,{success:false}),false);assert.equal(effect.system.changes[0].value,'-5');
 assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),true);assert.equal(effect.system.changes[0].value,'-3');
 assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),false);assert.equal(effect.system.changes[0].value,'-3');
 await resetRoundResistances();assert.equal(effect.system.changes[0].value,'-3');game.combat.round++;
 await Promise.all([resetRoundResistances(),resetRoundResistances()]);assert.equal(effect.system.changes[0].value,'-5');assert.equal(effect.flags[S].roundResistanceRelief,undefined);
 assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),true);
});
test('relief ends after five seconds outside combat and immediately on combat end',async()=>{
 const {effect}=setup();game.combat=null;await applyRoundResistanceRelief(effect,0,{success:true});game.time.worldTime=4;await resetRoundResistances();assert.equal(effect.system.changes[0].value,'-3');game.time.worldTime=5;await resetRoundResistances();assert.equal(effect.system.changes[0].value,'-5');
 game.combat={id:'c',round:2,started:true};await applyRoundResistanceRelief(effect,0,{success:true});await resetRoundResistances({ended:true});assert.equal(effect.system.changes[0].value,'-5');
});
test('disabled, expired, removed and non-owned effects cannot gain relief; other combats cannot reset it',async()=>{
 const {actor,effect}=setup();for(const prop of ['disabled','isSuppressed']){effect[prop]=true;assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),false);effect[prop]=false;}
 actor.isOwner=false;assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),false);actor.isOwner=true;
 assert.equal(await applyRoundResistanceRelief(effect,1,{success:true}),false);
 await applyRoundResistanceRelief(effect,0,{success:true});await resetRoundResistances({combat:{id:'other',round:10,started:true}});assert.equal(effect.system.changes[0].value,'-3');
 actor.effects=[];const updates=effect.updates;await resetRoundResistances({ended:true});assert.equal(effect.updates,updates);assert.equal(await applyRoundResistanceRelief(effect,0,{success:true}),false);
});
test('a manually edited modifier is preserved when the round relief ends',async()=>{
 const {effect}=setup();await applyRoundResistanceRelief(effect,0,{success:true});effect.system.changes[0].value='-8';game.combat.round++;await resetRoundResistances();assert.equal(effect.system.changes[0].value,'-8');
});

test('the actual raven application freezes duration, tenacity, resistance rules and a translated resistance button',async()=>{
 const fs=await import('node:fs');setup();
 globalThis.foundry={utils:{deepClone:structuredClone},applications:{handlebars:{renderTemplate:async()=>''}},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}}};
 globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};
 globalThis.ui={notifications:{warn:()=>{}}};game.user={id:'owner'};
 const {applyTransformation}=await import('../modules/transformations.mjs');
 const {annotateRuleTestDescription}=await import('../modules/rule-tests.mjs');
 for(const code of ['fr','en']){
  const lang=JSON.parse(fs.readFileSync(`lang/${code}.json`)),lookup=key=>key.split('.').reduce((o,k)=>o?.[k],lang)??key;
  game.i18n={lang:code,localize:lookup,format:(key,args)=>lookup(key).replace(/\{(\w+)\}/g,(_,k)=>args[k]??'')};
  let data;const actor={uuid:'Actor.target',name:'Target',documentName:'Actor',isOwner:true,items:[],effects:[],canUserModify:()=>true,createTrudvangEffect:async d=>{data=d;return null;}};
  await applyTransformation(actor,'vitner-animal-vitner:conjure-ravens:3#ravens',{skipDialog:true,counts:[2,0,1,2,0]});
  assert.equal(data.system.changes.find(row=>row.key===key).value,'-5');assert.equal(data.duration.value,5);
  assert.equal(data.flags[S].transformation.roundResistance.relief,2);assert.match(data.flags[S].transformation.summary,/-5/);
  const html=annotateRuleTestDescription(data.description,{...data,parent:actor});assert.match(html,/data-action="roll-rule-test"/);assert.doesNotMatch(html,/undefined/);
 }
});

test('copying an effect never grants the old recipient’s temporary resistance to its new recipient',async()=>{
 const fs=await import('node:fs');setup();game.user={id:'gm'};
 const lang=JSON.parse(fs.readFileSync('lang/fr.json')),lookup=key=>key.split('.').reduce((o,k)=>o?.[k],lang)??key;
 game.i18n={lang:'fr',localize:lookup,format:(key,args)=>lookup(key).replace(/\{(\w+)\}/g,(_,k)=>args[k]??'')};
 const {applyTransformation}=await import('../modules/transformations.mjs');let data;
 const actor={uuid:'Actor.new',name:'New',documentName:'Actor',isOwner:true,items:[],effects:[],canUserModify:()=>true,createTrudvangEffect:async d=>{data=d;return null;}};
 const config={key:'vitner-animal-vitner:conjure-ravens:3#ravens',sourceId:'vitner-animal-vitner:conjure-ravens:3',resolved:true,summary:'Malus : -3',roundResistance:{testIndex:0,relief:2,key,summaryKey:'TRUDVANG.Transformation.RavenPenalty'}};
 const original={name:'Corbeaux',type:'effect',duration:{value:3,units:'rounds'},system:{changes:[{key,type:'add',value:'-3',phase:'initial',priority:20}]},flags:{[S]:{transformation:config,roundResistanceRelief:{index:0,key,before:'-5',after:'-3',summary:'Malus : -5'}}}};
 const supplied={...original,documentName:'ActiveEffect',uuid:'Actor.old.ActiveEffect.r',toObject:()=>structuredClone(original)};
 await applyTransformation(actor,config.key,{source:supplied,skipDialog:true});
 assert.equal(data.system.changes[0].value,'-5');assert.equal(data.flags[S].roundResistanceRelief,undefined);assert.equal(original.system.changes[0].value,'-3');
});
