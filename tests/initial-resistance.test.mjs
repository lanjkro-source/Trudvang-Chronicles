import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {effectRules} from '../modules/rules/transformation-profile.mjs';
const S='trudvang-chronicles',languages=Object.fromEntries(['fr','en'].map(lang=>[lang,JSON.parse(fs.readFileSync(new URL('../lang/'+lang+'.json',import.meta.url)))]));
const lookup=(lang,key)=>key.split('.').reduce((v,k)=>v?.[k],languages[lang])??key;
const entities=new Map();let notices=[],warnings=[];
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>''}},utils:{deepClone:structuredClone,fromUuid:async uuid=>entities.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:100})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};
globalThis.ui={notifications:{warn:message=>warnings.push(message)}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>(notices.push(data),{id:'notice'})};
function setup(lang='fr'){
 entities.clear();notices=[];warnings=[];
 const user={id:'owner'},gm={id:'gm',isGM:true};const users=new Map([[user.id,user],[gm.id,gm]]);
 globalThis.game={user,users,time:{worldTime:100},i18n:{lang,localize:key=>lookup(lang,key),format:(key,data)=>lookup(lang,key).replace(/\{(\w+)\}/g,(_,k)=>String(data[k]))}};
 return {documentName:'Actor',uuid:'Actor.target',name:'Target',type:'character',isOwner:true,system:{},effects:[],items:[],canUserModify:u=>u.id==='owner'||u.isGM,testUserPermission:u=>u.id==='owner'};
}
function data(){return {name:'Control',description:'Actual effect',statuses:['restrain'],duration:{value:3,units:'rounds'},system:{changes:[{key:'system.transformation.noParry',type:'add',value:'true',phase:'initial',priority:30}]},flags:{[S]:{transformation:{key:'test',editableChanges:true,summary:'Actual consequences',summaryResolved:true,appliedAt:100}}}};}
function effect(actor,input){
 const e={...structuredClone(input),uuid:'Actor.target.ActiveEffect.'+crypto.randomUUID(),documentName:'ActiveEffect',parent:actor,isOwner:true};
 e.update=async change=>{for(const [path,v] of Object.entries(change)){const keys=path.split('.');let target=e;for(const key of keys.slice(0,-1))target=target[key]??={};target[keys.at(-1)]=structuredClone(v);}return e;};
 e.delete=async()=>{entities.delete(e.uuid);actor.effects=actor.effects.filter(row=>row!==e);};
 entities.set(e.uuid,e);actor.effects.push(e);return e;
}
const spec={testIndex:0};
const {prepareInitialResistance,resolveInitialResistanceOnAuthority,withInitialResistance,announceInitialResistance}=await import('../modules/initial-resistance.mjs');
const {ruleTestsForDocument,ruleTestActionViews,performRuleTest,annotateRuleTestDescription}=await import('../modules/rule-tests.mjs');
const {applyTransformation}=await import('../modules/transformations.mjs');
test('all nine FR/EN templates create pending effects with no active consequences or raw localization keys',async()=>{
 const original=['ecstasy','imagining','creature-control','possess-creature','immobilize','blood-brothers','grace-of-gave','divine-pact','paralyzing-gaze'];
 const entries=Object.entries(templates).filter(([,t])=>t.initialResistance&&original.includes(t.sourceId.split(':')[1]));assert.equal(entries.length,9);
 for(const lang of ['fr','en'])for(const [key,template] of entries){
  const actor=setup(lang);let created;
  actor.createTrudvangEffect=async input=>(created=input,null);
  await applyTransformation(actor,key,{skipDialog:true});
  assert.ok(created,key);assert.equal(created.flags[S].initialResistance.testIndex,0);
  assert.deepEqual(created.statuses,[]);assert.deepEqual(created.system.changes,[]);
  assert.deepEqual(created.flags[S].initialResistance.payload.statuses,template.statuses);
  assert.doesNotMatch(created.name+created.description+created.flags[S].transformation.summary,/undefined|TRUDVANG\./);
  assert.ok(created.duration.value>0);
 }
});
test('failure activates native changes and statuses without restarting duration; success deletes natively',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);
 assert.deepEqual(effectRules(e),{});assert.deepEqual(e.statuses,[]);
 const result=await withInitialResistance(e,0,actor,async()=>({success:false}));
 assert.equal(result.success,false);assert.equal(e.name,'Control');assert.deepEqual(e.statuses,['restrain']);assert.equal(effectRules(e).noParry,true);
 assert.deepEqual(e.duration,{value:3,units:'rounds'});assert.equal(e.flags[S].transformation.appliedAt,100);
 assert.equal(await withInitialResistance(e,0,actor,()=>assert.fail('no reroll')),null);
 const next=data();prepareInitialResistance(next,spec,actor);const second=effect(actor,next);
 await withInitialResistance(second,0,actor,async()=>({success:true}));assert.ok(!actor.effects.includes(second));
});
test('cancel leaves a pending effect; a second local click cannot open a duplicate roll',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);
 assert.equal(await withInitialResistance(e,0,actor,async()=>null),null);assert.equal(e.flags[S].initialResistance.resolved,false);
 let finish;const job=withInitialResistance(e,0,actor,()=>new Promise(resolve=>finish=resolve));
 assert.equal(await withInitialResistance(e,0,actor,()=>assert.fail()),null);assert.equal(warnings.length,1);
 finish({success:false});await job;
});
test('expiry and renewal while a dialog is open do not activate an old payload',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);
 await withInitialResistance(e,0,actor,async()=>{game.time.worldTime=115;return {success:false};});assert.equal(e.flags[S].initialResistance.resolved,false);assert.deepEqual(e.statuses,[]);
 game.time.worldTime=100;
 await withInitialResistance(e,0,actor,async()=>{e.flags[S].initialResistance.id='new-application';return {success:false};});assert.equal(e.flags[S].initialResistance.resolved,false);
});
test('GM resolution serializes owner and GM decisions, rejects observers and acts only on the chosen effect',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input),id=e.flags[S].initialResistance.id;
 game.users.set('observer',{id:'observer'});const request={effectUuid:e.uuid,id,success:false,userId:'observer'};
 assert.equal(await resolveInitialResistanceOnAuthority(request),'unavailable');
 const statuses=await Promise.all([resolveInitialResistanceOnAuthority({...request,userId:'owner'}),resolveInitialResistanceOnAuthority({...request,userId:'gm',success:true})]);
 assert.deepEqual(statuses,['activated','changed']);assert.ok(actor.effects.includes(e));
});
test('copies rearm for a new recipient; same-recipient renewal preserves resolution and notifications',()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);e.flags[S].initialResistance.resolved=true;
 const same=data();prepareInitialResistance(same,spec,actor,e);assert.equal(same.flags[S].initialResistance.resolved,true);assert.deepEqual(same.statuses,['restrain']);
 const other=data();prepareInitialResistance(other,spec,{uuid:'Actor.other'},e);assert.equal(other.flags[S].initialResistance.resolved,false);assert.notEqual(other.flags[S].initialResistance.id,e.flags[S].initialResistance.id);assert.deepEqual(other.statuses,[]);
});
test('pending and failed initial resistance expose only the appropriate stable test indexes in both languages',async()=>{
 for(const lang of ['fr','en']){
  const actor=setup(lang),sourceId='vitner-power-of-thought:ecstasy:5',input=data();input.flags[S].transformation.sourceId=sourceId;
  prepareInitialResistance(input,spec,actor);const e=effect(actor,input);
  assert.deepEqual(ruleTestActionViews(e).map(row=>row.index),[0]);
  assert.deepEqual(ruleTestActionViews({system:{catalogId:sourceId}}).map(row=>row.index),[1,2]);
  await withInitialResistance(e,0,actor,async()=>({success:false}));
  assert.deepEqual(ruleTestActionViews(e).map(row=>row.index),[1,2]);
  assert.equal(await performRuleTest({document:e,index:0,actor}),null);
  assert.equal(ruleTestsForDocument(e)[0].disabled,true);
 }
});
test('private resistance notices identify their actual effect and do not duplicate on renewal',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);
 await announceInitialResistance(e,actor);await announceInitialResistance(e,actor);
 assert.equal(notices.length,1);assert.deepEqual(notices[0].whisper,['owner','gm']);assert.ok(notices[0].content.includes(e.uuid));assert.match(notices[0].content,/data-test-index="0"/);
});
test('the actual resistance rolls for the recipient, uses frozen power improvements and consumes the pending effect once',async()=>{
 const actor=setup(),key='vitner-power-of-thought:imagining:6#pensee',sourceId=templates[key].sourceId;
 Object.assign(actor,{getTraitValue:()=>1,getRollModifier:()=>0,rollEffectRows:()=>[],traitEffectRows:()=>[],allApplicableEffects:()=>actor.effects,canPerformAction:()=>true,findRuleKnowledge:()=>({system:{level:1}})});
 actor.clone=async changes=>({...actor,effects:changes.effects,allApplicableEffects:()=>changes.effects});
 let created;actor.createTrudvangEffect=async data=>(created=data,null);
 await applyTransformation(actor,key,{skipDialog:true,context:{sourceId,kind:'spell',casterUuid:'Actor.caster',casterName:'Caster',specialtyLevel:2,counts:[0,0,2],countsById:{[sourceId+':2']:2}}});
 const e=effect(actor,created),messages=[],dialogs=[];
 globalThis.CONFIG={TRUDVANG:{}};
 foundry.applications.api={DialogV2:class{_onRender(){}static async wait(options){dialogs.push(options);return options.buttons[0].callback(null,{form:{querySelector:selector=>({value:selector.includes('[name=sv]')?'8':'0'})}});}}};
 foundry.applications.handlebars.renderTemplate=async()=>'<article>result</article>';
 globalThis.Roll=class{async evaluate(){this.total=20;return this;}};
 ChatMessage.getSpeaker=({actor:a})=>({actor:a.uuid});ChatMessage.create=async data=>(messages.push(data),{id:'roll'});
 const result=await performRuleTest({document:e,index:0,actor:{...actor,uuid:'Actor.wrong-selection'}});
 assert.equal(result.target,5);assert.equal(result.success,false);assert.equal(messages.at(-1).speaker.actor,actor.uuid);
 assert.equal(e.flags[S].initialResistance.resolved,true);assert.match(dialogs.at(-1).content,/2 × -1/);
 assert.equal(await performRuleTest({document:e,index:0,actor}),null);assert.equal(messages.length,1);
});

test('an unavailable GM connection retains the roll for retry instead of rolling a second die',async()=>{
 const actor=setup(),input=data();prepareInitialResistance(input,spec,actor);const e=effect(actor,input);let rolls=0;
 game.users.activeGM={id:'gm',isSelf:false};game.socket=null;
 await withInitialResistance(e,0,actor,async()=>{rolls++;return {success:false};});
 assert.equal(e.flags[S].initialResistance.resolved,false);assert.equal(warnings.length,1);
 game.users.activeGM=null;
 await withInitialResistance(e,0,actor,async()=>{rolls++;return {success:true};});
 assert.equal(rolls,1);assert.equal(e.flags[S].initialResistance.resolved,true);
});

test('all 32 recipient-resistance templates defer their native consequences in both languages, including chosen forms',async()=>{
 const {BESTIARY_ENTRIES}=await import('../modules/bestiary-catalog-data.mjs');
 const entries=Object.entries(templates).filter(([,row])=>row.initialResistance);assert.equal(entries.length,32);
 for(const lang of ['fr','en'])for(const [key,template] of entries){
  const actor=setup(lang);actor.getTraitValue=()=>0;actor.system.resources={body:{max:20}};let created;
  actor.createTrudvangEffect=async input=>(created=input,null);
  await applyTransformation(actor,key,{preselectedAnswers:{duration:'1 minute',resistApplication:true,form:BESTIARY_ENTRIES[0].id}});
  assert.ok(created.flags[S].initialResistance,key);assert.deepEqual(created.system.changes,[],key);assert.deepEqual(created.statuses,[],key);
  assert.doesNotMatch(created.name+created.description,/undefined|TRUDVANG\./,key);
 }
});
test('all five beneficial/reversed pairs resist only the impaired version, with blindness and deafness deferred',async()=>{
 for(const [source,good,bad]of [['hearing-deafness:2','ameliore','affaibli'],['sense-of-smell:3','ameliore','affaibli'],['vision-blindness:4','ameliore','affaibli'],['hasten:9','hate','hate-inverse'],['strengthen:8','vigueur','vigueur-inverse']]){
  const actor=setup();actor.getTraitValue=()=>0;let created;actor.createTrudvangEffect=async input=>(created=input,null);
  const id='vitner-body-vitner:'+source,counts=[];counts[5]=8;
  await applyTransformation(actor,id+'#'+good,{skipDialog:true,counts});
  assert.equal(created.flags[S].initialResistance,undefined,good);assert.equal(ruleTestActionViews(created).length,0);
  await applyTransformation(actor,id+'#'+bad,{skipDialog:true,counts});
  const e=effect(actor,created);assert.deepEqual(e.statuses,[]);assert.deepEqual(e.system.changes,[]);
  await withInitialResistance(e,0,actor,async()=>({success:false}));
  if(source.startsWith('vision-'))assert.deepEqual(e.statuses,['blind']);
  if(source.startsWith('hearing-'))assert.deepEqual(e.statuses,['deaf']);
  if(source.startsWith('hasten')||source.startsWith('strengthen'))assert.ok(e.system.changes.length>0);
 }
});
test('five consent-sensitive effects apply directly when accepted and wait only when explicitly resisted',async()=>{
 const {BESTIARY_ENTRIES}=await import('../modules/bestiary-catalog-data.mjs');
 for(const [key,template]of Object.entries(templates).filter(([,row])=>row.initialResistance?.optional)){
  const actor=setup();actor.getTraitValue=()=>0;actor.system.resources={body:{max:20}};let created;actor.createTrudvangEffect=async input=>(created=input,null);
  for(const consent of [false,true,'on']){
   await applyTransformation(actor,key,{preselectedAnswers:{duration:'1 minute',resistApplication:consent,form:BESTIARY_ENTRIES[0].id}});
   assert.equal(Boolean(created.flags[S].initialResistance),Boolean(consent),key);
  }
 }
});
test('the optional resistance preview follows the actual checkbox and the application dialog cancels cleanly',async()=>{
 const actor=setup(),prior=foundry.applications.api;let options,root;
 const fields={duration:{value:'1 minute'},resistApplication:{checked:false}};
 root={querySelector:selector=>selector==='[data-resistance-preview]'?root.output:fields[selector.match(/name="([^"]+)"/)?.[1]],output:{innerHTML:''},addEventListener:(name,callback)=>root[name]=callback};
 foundry.applications.api={DialogV2:class{_onRender(){}static async wait(config){options=config;const dialog=new this();dialog.element=root;dialog._onRender({},{});assert.equal(root.output.innerHTML,'');fields.resistApplication.checked=true;root.input();assert.match(root.output.innerHTML,/résister à la modification/);return false;}}};
 try{
  assert.equal(await applyTransformation(actor,'vitner-delusion-vitner:ghost-voice:5#voix',{counts:[0,0,0,2]}),null);
  assert.match(options.content,/name="resistApplication" type="checkbox"/);assert.doesNotMatch(options.content,/name="resistApplication" type="checkbox" checked/);
 }finally{foundry.applications.api=prior;}
});
test('permanent amnesia remains resistible after time advances and exposes recovery only after failure',async()=>{
 const actor=setup();let created;actor.createTrudvangEffect=async input=>(created=input,null);
 await applyTransformation(actor,'vitner-witchcraft:amnesia:4#effect',{skipDialog:true});assert.equal(created.duration.value,null);
 const e=effect(actor,created);game.time.worldTime+=86400;
 await withInitialResistance(e,0,actor,async()=>({success:false}));assert.equal(e.flags[S].initialResistance.resolved,true);
 assert.deepEqual(ruleTestActionViews(e).map(row=>row.index),[1]);
});
test('petrification recovery links are unavailable while resistance is pending, then retained without their own initial resistance',async()=>{
 const {transformationKeys}=await import('../modules/transformations.mjs'),actor=setup();let created;actor.createTrudvangEffect=async input=>(created=input,null);
 const key='holy-tenetnid-tablet-of-anger:statue:5#statue';
 await applyTransformation(actor,key,{preselectedAnswers:{duration:'5 rounds'}});const e=effect(actor,created);
 assert.deepEqual(transformationKeys(e),[]);await withInitialResistance(e,0,actor,async()=>({success:false}));
 assert.equal(transformationKeys(e).length,2);assert.deepEqual(e.statuses,['paralysis']);
 const child=transformationKeys(e)[0];await applyTransformation(actor,child,{source:e,preselectedAnswers:{duration:'3 days'}});assert.equal(created.flags[S].initialResistance,undefined);
});
test('wind-control follow-up belongs to the original caster even when its recipient is not owned by the clicker',async()=>{
 const recipient=setup();recipient.isOwner=false;
 let called=false;const caster={documentName:'Actor',uuid:'Actor.caster',type:'character',isOwner:true,effects:[],canPerformAction:()=>{called=true;return false;}};
 entities.set(caster.uuid,caster);
 const sourceId='vitner-wind-craft:lift:5',e={documentName:'ActiveEffect',parent:recipient,flags:{[S]:{transformation:{sourceId,ruleTestContext:{sourceId,kind:'spell',casterUuid:caster.uuid,counts:[]}}}}};
 assert.equal(await performRuleTest({document:e,index:1,actor:recipient}),null);assert.equal(called,true);
});
