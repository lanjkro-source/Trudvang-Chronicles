import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {followupPolicy,followupFingerprint,followupAvailability,followupRollTest} from '../modules/rules/followup-tests.mjs';
import {TRANSFORMATION_TEMPLATES} from '../modules/transformation-data.mjs';
const S='trudvang-chronicles',docs=new Map(),messages=new Map();let warnings=[],renderedCard;
const languages=Object.fromEntries(['fr','en'].map(lang=>[lang,JSON.parse(fs.readFileSync(new URL('../lang/'+lang+'.json',import.meta.url)))]));
globalThis.foundry={applications:{handlebars:{renderTemplate:async(_path,data)=>(renderedCard=data,'<article>Result</article>')}},utils:{fromUuid:async uuid=>docs.get(uuid),deepClone:structuredClone}};
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
globalThis.ui={notifications:{warn:message=>warnings.push(message)}};
const {withFollowupTest,resolveFollowupOnAuthority}=await import('../modules/followup-tests.mjs');
const {ruleTestsForDocument,performRuleTest}=await import('../modules/rule-tests.mjs');
const {applyTransformation}=await import('../modules/transformations.mjs');
function setup(language='fr'){
 docs.clear();messages.clear();warnings=[];
 const owner={id:'owner'},gm={id:'gm',isGM:true},users=new Map([[owner.id,owner],[gm.id,gm],['observer',{id:'observer'}]]);
 const lookup=key=>key.split('.').reduce((v,k)=>v?.[k],languages[language])??key;
 globalThis.game={user:owner,users,time:{worldTime:0},messages,i18n:{lang:language,localize:lookup,format:(key,data)=>lookup(key).replace(/\{(\w+)\}/g,(_,k)=>String(data[k]))}};
 const actor={documentName:'Actor',uuid:'Actor.target',type:'character',name:'Target',isOwner:true,items:[],effects:[],canUserModify:user=>user.id==='owner'||user.isGM};
 return actor;
}
function effect(actor,key='vitner-witchcraft:amnesia:4#effect',extra={}){
 const sourceId=key.split('#')[0],template=TRANSFORMATION_TEMPLATES[key];
 const e={documentName:'ActiveEffect',uuid:actor.uuid+'.ActiveEffect.'+crypto.randomUUID(),parent:actor,name:'Effect',description:'Description',duration:{value:null,units:'rounds'},system:{changes:[{key:'system.modifiers.rolls.allActions',type:'add',value:'-1',phase:'initial',priority:30}]},flags:{[S]:{transformation:{key,sourceId,summary:'Original summary',appliedAt:0,resolved:true,editableChanges:true,related:[]},...(template.initialResistance?{initialResistance:{id:'initial',resolved:true,payload:{name:'Effect',description:'Description',summary:'Original summary',summaryResolved:true,changes:[],statuses:[]}}}:{})}},...extra};
 e.update=async changes=>{for(const [path,value]of Object.entries(changes)){const keys=path.split('.');let target=e;for(const k of keys.slice(0,-1))target=target[k]??={};target[keys.at(-1)]=structuredClone(value);}return e;};
 e.delete=async()=>{e.deleted=true;docs.delete(e.uuid);actor.effects=actor.effects.filter(row=>row!==e);};
 actor.effects.push(e);docs.set(e.uuid,e);return e;
}
const success=target=>async()=>({success:true,target}),failure=async()=>({success:false,target:8});
function payload(e,index,result={success:true,target:8}){return {effectUuid:e.uuid,index,fingerprint:followupFingerprint(e),day:Math.floor(game.time.worldTime/86400),userId:game.user.id,...result};}

test('the five policies are aligned in the catalogue and distinguish recovery, recognition and removal',()=>{
 const policies=Object.values(TRANSFORMATION_TEMPLATES).flatMap(row=>row.followupTests??[]);
 assert.equal(policies.length,5);assert.equal(policies.filter(row=>row.success==='memory').length,2);assert.equal(policies.filter(row=>row.success==='reveal').length,2);assert.equal(policies.filter(row=>row.success==='remove').length,1);
});
test('memory begins the following day, adds two per success and never loses its bonus on failure',async()=>{
 const actor=setup(),e=effect(actor);let rolls=0;
 assert.equal(await withFollowupTest(e,1,actor,()=>{rolls++;return {success:true,target:8};}),null);assert.equal(rolls,0);
 game.time.worldTime=86400;
 await withFollowupTest(e,1,actor,success(8));assert.equal(ruleTestsForDocument(e)[1].followupBonus,2);assert.match(e.flags[S].transformation.summary,/\+2/);
 assert.equal(await withFollowupTest(e,1,actor,()=>assert.fail('one roll per day')),null);
 game.time.worldTime+=86400;await withFollowupTest(e,1,actor,failure);assert.equal(ruleTestsForDocument(e)[1].followupBonus,2);
 game.time.worldTime+=86400;await withFollowupTest(e,1,actor,success(10));assert.equal(ruleTestsForDocument(e)[1].followupBonus,4);
 assert.equal(e.flags[S].ruleTestProgress.tests[1].lastDay,3);assert.equal((e.description.match(/class="rule-test-progress"/g)??[]).length,1);assert.equal(e.duration.value,null);assert.equal(e.flags[S].transformation.appliedAt,0);
});
test('successful SV20 recovery deletes only its own amnesia; failure at SV20 leaves it and consumes the day',async()=>{
 const actor=setup(),a=effect(actor),b=effect(actor);game.time.worldTime=86400;
 await withFollowupTest(a,1,actor,async()=>({success:false,target:20}));assert.ok(actor.effects.includes(a));
 assert.equal(followupAvailability(a,1,game.time.worldTime),'daily');
 await withFollowupTest(b,1,actor,success(20));assert.ok(b.deleted);assert.ok(actor.effects.includes(a));
});
test('recognizing either phantom plague retains visible symptoms and social modifiers but removes further personal attempts',async()=>{
 for(const key of ['vitner-witchcraft:phantom-plague:1#effect','holy-joaringfaith-curses-of-sonntag:phantom-plague:1#effect']){
  const actor=setup(),e=effect(actor,key),before=structuredClone(e.system.changes);
  await withFollowupTest(e,0,actor,success(8));assert.ok(!e.deleted);assert.deepEqual(e.system.changes,before);assert.equal(ruleTestsForDocument(e)[0].disabled,true);
  assert.match(e.flags[S].transformation.summary,/symptômes visibles/);assert.match(e.description,/symptômes visibles/);
  assert.equal(await withFollowupTest(e,0,actor,()=>assert.fail()),null);
 }
});
test('failed plague recognition allows one attempt per new day; cancellation does not consume an attempt',async()=>{
 const actor=setup(),e=effect(actor,'vitner-witchcraft:phantom-plague:1#effect');
 await withFollowupTest(e,0,actor,async()=>null);assert.equal(followupAvailability(e,0,0),'');
 await withFollowupTest(e,0,actor,failure);assert.equal(followupAvailability(e,0,0),'daily');
 game.time.worldTime=86400;await withFollowupTest(e,0,actor,success(9));assert.equal(followupAvailability(e,0,game.time.worldTime),'revealed');
});
test('the mountain suggestion can break on its second resistance while its initial resistance stays separate',async()=>{
 const actor=setup(),e=effect(actor,'holy-haminges-power-of-trolls:taken-by-the-mountain:8#effect');
 assert.equal(followupPolicy(e,0),undefined);assert.equal(followupPolicy(e,1).success,'remove');
 await withFollowupTest(e,1,actor,failure);assert.ok(!e.deleted);
 await withFollowupTest(e,1,actor,success(12));assert.equal(e.deleted,true);
});
test('simultaneous owner/GM results advance memory once; observers cannot write any consequence',async()=>{
 const actor=setup(),e=effect(actor);game.time.worldTime=86400;const request=payload(e,1);
 assert.equal(await resolveFollowupOnAuthority({...request,userId:'observer'}),'unavailable');
 assert.deepEqual(await Promise.all([resolveFollowupOnAuthority(request),resolveFollowupOnAuthority({...request,userId:'gm'})]),['resolved','changed']);
 assert.equal(e.flags[S].ruleTestProgress.tests[1].successes,1);
});
test('local double clicks, expired effects, renewed effects and midnight transitions cannot replay consequences',async()=>{
 const actor=setup(),e=effect(actor);game.time.worldTime=86400;let finish;
 const waiting=withFollowupTest(e,1,actor,()=>new Promise(resolve=>finish=resolve));assert.equal(await withFollowupTest(e,1,actor,()=>assert.fail()),null);
 e.flags[S].transformation.appliedAt=86401;finish({success:true,target:20});await waiting;assert.ok(!e.deleted);assert.equal(e.flags[S].ruleTestProgress,undefined);
 e.flags[S].transformation.appliedAt=0;
 await withFollowupTest(e,1,actor,async()=>{game.time.worldTime=2*86400;return {success:true,target:20};});assert.ok(!e.deleted);
 e.duration={value:1,units:'rounds'};assert.equal(await withFollowupTest(e,1,actor,()=>assert.fail()),null);
});
test('failed authority communication retries the same result without a second roll',async()=>{
 const actor=setup(),e=effect(actor);game.time.worldTime=86400;game.users.activeGM={id:'gm',isSelf:false};let rolls=0;
 await withFollowupTest(e,1,actor,async()=>{rolls++;return {success:true,target:8};});assert.equal(e.flags[S].ruleTestProgress,undefined);
 game.users.activeGM=null;
 await withFollowupTest(e,1,actor,async()=>{rolls++;return {success:true,target:20};});assert.equal(rolls,1);assert.equal(e.flags[S].ruleTestProgress.tests[1].successes,1);
});
test('progress stays with the same recipient on copy, but a different recipient starts from the original summary',async()=>{
 const actor=setup(),e=effect(actor);game.time.worldTime=86400;await withFollowupTest(e,1,actor,success(8));let created;
 actor.createTrudvangEffect=async data=>(created=data,null);
 await applyTransformation(actor,e.flags[S].transformation.key,{source:e,skipDialog:true});assert.equal(created.flags[S].ruleTestProgress.tests[1].successes,1);assert.match(created.flags[S].transformation.summary,/\+2/);
 const other={...actor,uuid:'Actor.other'};
 await applyTransformation(other,e.flags[S].transformation.key,{source:e,skipDialog:true});assert.equal(created.flags[S].ruleTestProgress,undefined);assert.equal(created.flags[S].initialResistance.resolved,false);assert.equal(created.flags[S].initialResistance.payload.summary,'Original summary');
});
test('the result receives a compact progress note without another chat message, in FR and EN',async()=>{
 for(const language of ['fr','en']){
  const actor=setup(language),e=effect(actor);game.time.worldTime=86400;
  const message={content:'<article>Result</article>',update:async change=>Object.assign(message,change)};messages.set('roll',message);
  await withFollowupTest(e,1,actor,async()=>({success:true,target:8,messageId:'roll'}));
  assert.match(message.content,/rule-test-outcome/);assert.match(message.content,/\+2/);assert.doesNotMatch(message.content,/undefined|TRUDVANG\./);assert.equal(messages.size,1);
 }
});

test('the real recovery dialog and chat use the saved bonus once, for the recipient, then persist the next bonus',async()=>{
 const actor=setup();Object.assign(actor,{system:{damage:{penalty:0},fearPenalty:0},getTraitValue:()=>1,getRollModifier:()=>0,rollEffectRows:()=>[],traitEffectRows:()=>[],findRuleKnowledge:()=>null,canPerformAction:()=>true,allApplicableEffects:()=>actor.effects});
 actor.clone=async changed=>({...actor,effects:changed.effects,allApplicableEffects:()=>changed.effects});
 const e=effect(actor);game.time.worldTime=86400;await withFollowupTest(e,1,actor,success(8));game.time.worldTime+=86400;
 const old={api:foundry.applications.api,render:foundry.applications.handlebars.renderTemplate,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage,CONFIG:globalThis.CONFIG};let dialog,card;
 foundry.applications.api={DialogV2:class{_onRender(){}static async wait(options){dialog=options;return options.buttons[0].callback(null,{form:{querySelector:selector=>({value:selector.includes('[name=sv]')?'6':'0'})}});}}};
 foundry.applications.handlebars.renderTemplate=async(_path,data)=>(card=data,'<article>Result</article>');
 globalThis.CONFIG={TRUDVANG:{}};globalThis.Roll=class{async evaluate(){this.total=5;return this;}};
 globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.uuid}),create:async data=>{const message={...data,id:'rolled',update:async change=>Object.assign(message,change)};messages.set(message.id,message);return message;}};
 try{
  const result=await performRuleTest({document:e,index:1,actor:{...actor,uuid:'Actor.other'}});card=renderedCard;
  assert.equal(result.target,9,'6 base + 1 Psyche + 2 recovered memory');assert.equal(result.success,true);
  assert.match(dialog.content,/Récupération des souvenirs/);assert.match(card.flavor,/Récupération des souvenirs/);
  assert.equal(messages.get('rolled').speaker.actor,actor.uuid);assert.match(messages.get('rolled').content,/\+4/);
  assert.equal(ruleTestsForDocument(e)[1].followupBonus,4);assert.equal(messages.size,1);
 }finally{foundry.applications.api=old.api;foundry.applications.handlebars.renderTemplate=old.render;globalThis.Roll=old.Roll;globalThis.ChatMessage=old.ChatMessage;globalThis.CONFIG=old.CONFIG;}
});
