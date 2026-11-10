import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const S='trudvang-chronicles',lang=JSON.parse(fs.readFileSync('lang/fr.json')),docs=new Map();
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}})};
globalThis.foundry={utils:{fromUuid:async uuid=>docs.get(uuid)}};
const users=new Map([['gm',{id:'gm',active:true,isGM:true}],['owner',{id:'owner',active:true}],['offline',{id:'offline',active:false}],['observer',{id:'observer',active:true}]]);users.activeGM=users.get('gm');
globalThis.game={users,user:users.get('gm'),messages:new Map(),time:{worldTime:0},i18n:{localize:key=>key.split('.').reduce((v,k)=>v?.[k],lang)??key,format(key,data){return this.localize(key).replace(/\{(\w+)\}/g,(_,k)=>data[k]);}}};
globalThis.Roll=class{static fromData(data){return {...data};}};
const {diseaseRecipients,recordDiseaseResistance,diseaseResultPublisher,diseaseRecordedResult}=await import('../modules/disease-resistance-chat.mjs');
function fixture(){
 const actor={uuid:'Actor.a',name:'<A>',testUserPermission:(user,level)=>level==='OWNER'&&['owner','offline'].includes(user.id)};
 const effect={uuid:actor.uuid+'.ActiveEffect.incubation',parent:actor,flags:{[S]:{diseaseIncubation:{messageId:'notice'},consequenceClock:{stage:0,stageStartedAt:0,stages:[{seconds:60}]}}}};
 const message={id:'notice',content:'<div class="trudvang consequence-notice" data-rule-document-uuid="'+effect.uuid+'"><p>Incubation</p><button type="button" data-action="roll-rule-test">Résister</button></div>',rolls:[{total:3}],flags:{[S]:{diseaseResistance:{actorUuid:actor.uuid,effectUuid:effect.uuid}}},updates:[],async update(data){this.updates.push(data);for(const [path,value]of Object.entries(data)){const keys=path.split('.'),last=keys.pop(),target=keys.reduce((o,k)=>o[k]??={},this);target[last]=value;}}};
 docs.set(actor.uuid,actor);docs.set(effect.uuid,effect);game.messages.set(message.id,message);game.time.worldTime=0;game.user=users.get('gm');
 const payload={messageId:message.id,userId:'owner',actorUuid:actor.uuid,effectUuid:effect.uuid,result:4,target:8,roll:{total:4}};
 return {actor,effect,message,payload};
}
test('only GMs and owners, including offline owners, receive the disease card',()=>{const {actor}=fixture();assert.deepEqual(diseaseRecipients(actor),['gm','owner','offline']);});
test('an owner updates the original GM card with its named result, preserving the notice and dice',async()=>{
 const {effect,message,payload}=fixture();const result=await recordDiseaseResistance(payload);
 assert.equal(result.response.success,true);assert.equal(message.updates.length,1);assert.match(message.content,/<p>Incubation<\/p>/);assert.match(message.content,/&lt;A&gt;/);assert.match(message.content,/D20 : 4 \/ VC : 8/);assert.match(message.content,/Succès/);assert.match(message.content,/<button disabled/);assert.equal(message.rolls.length,2);assert.deepEqual(message.whisper,['gm','owner','offline']);assert.equal(diseaseRecordedResult(effect).result,4);
});
test('observers cannot submit a result for someone else',async()=>{const {message,payload}=fixture();await assert.rejects(recordDiseaseResistance({...payload,userId:'observer'}));assert.equal(message.updates.length,0);});
test('simultaneous GM and owner submissions record exactly one response, including after the effect disappears',async()=>{
 const {message,payload,effect}=fixture();const results=await Promise.all([recordDiseaseResistance(payload),recordDiseaseResistance({...payload,userId:'gm',result:20})]);
 assert.equal(message.updates.length,1);assert.equal(results[1].animate,false);assert.equal(results[1].response.result,4);docs.delete(effect.uuid);assert.equal((await recordDiseaseResistance(payload)).response.result,4);
});
test('failed resistance and late success remain visible without pretending to cure the disease',async()=>{
 let f=fixture();await recordDiseaseResistance({...f.payload,result:20});assert.match(f.message.content,/Échec/);assert.equal(f.message.flags[S].diseaseResistance.response.success,false);
 f=fixture();game.time.worldTime=61;const result=await recordDiseaseResistance(f.payload);assert.equal(result.response.late,true);assert.match(f.message.content,/après la fin/);
});
test('the publisher updates one message and never creates a second chat card',async()=>{
 const {actor,effect,message}=fixture();globalThis.ChatMessage={create(){assert.fail('Must update the existing card');}};
 const publish=diseaseResultPublisher(effect,actor);const result=await publish({rolls:[{toJSON:()=>({total:5})}]},{result:5,target:8});assert.equal(result.message,message);assert.equal(message.updates.length,1);
});
test('a card bound to a different actor or effect rejects the submission',async()=>{const {message,payload}=fixture();message.flags[S].diseaseResistance.actorUuid='Actor.other';await assert.rejects(recordDiseaseResistance(payload));assert.equal(message.updates.length,0);});

