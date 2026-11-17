import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {reduceFearProfile,fearProfileTotal,adjustedFearFactor,fearRecipientEligible,isLesserIntelligence} from '../modules/rules/fear-protection.mjs';
import {transformationProfile} from '../modules/rules/transformation-profile.mjs';
import {rulesFromChanges} from '../modules/rules/effect-rule-changes.mjs';
import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {magicFearProfile} from '../modules/magic-fear.mjs';import {magicDamageProfile} from '../modules/magic-damage.mjs';
const S='trudvang-chronicles',id='holy-haminges-power-of-trolls:fearless:3',key=id+'#protection',lind='vitner-delusion-vitner:lindwurm-illusion:10';
const languages=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));let warnings=[],created;
globalThis.foundry={utils:{deepClone:structuredClone},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}},applications:{api:{DialogV2:{wait:async()=>false}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};globalThis.ui={notifications:{warn:v=>warnings.push(v)}};
const {applyTransformation}=await import('../modules/transformations.mjs');
function actor(c='fr'){
 warnings=[];created=null;const lookup=k=>k.split('.').reduce((v,k)=>v?.[k],languages[c])??k;globalThis.game={user:{id:'owner'},time:{worldTime:0},i18n:{lang:c,localize:lookup,format:(k,d)=>lookup(k).replace(/\{(\w+)\}/g,(_,k)=>String(d[k]))}};
 return {uuid:'Actor.test',name:'Test',type:'character',effects:[],items:[],system:{resources:{fear:{value:15}}},canUserModify:()=>true,createTrudvangEffect:async data=>(created=structuredClone(data),null)};
}
const profile=(faces=10,threshold=0,modifier=0,dice=1)=>({dice,faces,threshold,modifier});
test('fear degrees follow every spell rung, including bonus, open threshold, D5 and zero',()=>{
 const steps=[profile(5),profile(),profile(10,10),profile(10,9),profile(10,8),profile(10,8,1)];
 for(let i=0;i<steps.length;i++)for(let n=0;n<=2;n++)assert.deepEqual(reduceFearProfile(steps[i],n),i-n<0?{...profile(5),dice:0}:steps[i-n]);
 assert.deepEqual(reduceFearProfile(profile(10,6),2),profile(10,8));assert.equal(reduceFearProfile(profile(6),1).dice,0);
});
test('reductions reuse existing dice, truncate explosions, keep adjustments and map a uniform D10 to D5 without rerolling',()=>{
 const context={profile:profile(10,9),values:[9,10,4],adjustment:-1};
 assert.equal(fearProfileTotal(context,profile(10,10)),8);assert.equal(fearProfileTotal(context,profile()),8);assert.equal(fearProfileTotal(context,profile(5)),4);
 for(let die=1;die<=10;die++)assert.equal(fearProfileTotal({profile:profile(),values:[die]},profile(5)),Math.ceil(die/2));
 assert.equal(fearProfileTotal(context,{...profile(5),dice:0}),0);
 const multiple={profile:profile(10,9,0,2),values:[9,3,10,4]};assert.equal(fearProfileTotal(multiple,profile(10,10,0,2)),23);
 assert.equal(fearProfileTotal({profile:profile(),values:[]},profile()),null);
});
test('the strongest active reduction is used once, after resistance and before personal mitigation',()=>{
 const a={system:{effective:{traits:{}}},effects:[1,2].map(value=>({system:{changes:[{key:'system.transformation.fearReductionDegrees',type:'override',value:String(value)}]}}))};
 const p=transformationProfile(a);assert.equal(p.fearReductionDegrees,2);a.transformationProfile=p;
 const context={profile:profile(10,9),values:[9,10,4],adjustment:0,resistance:{successProfile:profile(5)}};
 assert.equal(adjustedFearFactor(a,context).amount,9);assert.equal(adjustedFearFactor(a,context,{success:true}).amount,0);
 assert.equal(adjustedFearFactor(a,{...context,resistance:{}},{success:true}).amount,0);
});
test('all Haminges and Tyrd recipient restrictions distinguish hearing, caster and animal intelligence',()=>{
 const c={casterUuid:'Actor.caster',eligibility:{requiresHearing:true,excludeCaster:true}};
 assert.equal(fearRecipientEligible({uuid:'Actor.caster'},c),false);assert.equal(fearRecipientEligible({uuid:'Actor.other',statuses:new Set(['deaf'])},c),false);
 assert.equal(fearRecipientEligible({uuid:'Actor.other',statuses:new Set()},c),true);
 assert.equal(isLesserIntelligence({type:'npc',system:{tags:['bête']}}),true);assert.equal(isLesserIntelligence({type:'npc',system:{tags:['beast','troll']}}),false);
 assert.equal(isLesserIntelligence({type:'character',system:{tags:['animal']}}),false);
 assert.equal(fearRecipientEligible({type:'npc',system:{tags:['beast']}},{eligibility:{intelligentOnly:true}}),false);
});
test('Fearless applies both FR/EN durations and exactly one or two native degrees, and does not remove existing fear',async()=>{
 for(const c of ['fr','en'])for(const count of [0,1,7]){
  const a=actor(c),before=structuredClone(a.system);await applyTransformation(a,key,{counts:[2,1,count],skipDialog:true});
  assert.deepEqual(created.duration,{value:756,units:'rounds'});const rules=rulesFromChanges(created.system.changes);assert.equal(rules.fearReductionDegrees,count?2:1);assert.equal(rules.ignoreFearThrough,1);
  assert.match(created.flags[S].transformation.summary,new RegExp(String(count?2:1)));assert.doesNotMatch(created.description,/undefined|TRUDVANG\./);assert.deepEqual(a.system,before);
  const first=structuredClone(created);await applyTransformation(a,key,{source:{documentName:'ActiveEffect',...first},counts:[99,99,99],skipDialog:true});assert.deepEqual(created.system.changes,first.system.changes);assert.deepEqual(created.duration,first.duration);
 }
});
test('Tyrd fleeing consequences expire after one hour or seven days and never impose a global penalty or a moving aura',async()=>{
 for(const c of ['fr','en'])for(const [sid,value,units]of [['holy-gerbanis-wrath-of-tyrd:dark-visage:5',1,'hours'],["holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8",7,'days']]){
  const a=actor(c);await applyTransformation(a,sid+'#flight',{skipDialog:true});assert.equal(created,null);
  a.type='npc';a.system.tags=['bête'];await applyTransformation(a,sid+'#flight',{skipDialog:true});assert.deepEqual(created.duration,{value,units});assert.deepEqual(created.statuses,[]);assert.deepEqual(created.system.changes,[]);assert.equal(templates[sid+'#flight'].aura,undefined);
 }
});
test('Lindwurm Illusion freezes all fear and bite power levels separately and gives no universal skill bonus or false invisibility',async()=>{
 for(let i=0;i<3;i++){const p=magicFearProfile({system:{catalogId:lind}},{sourceId:lind,countsById:{[lind+':3']:i}});assert.equal(p.threshold,9-i);assert.equal(p.requiresResistance,true);}
 for(let i=0;i<4;i++){const p=magicDamageProfile({system:{catalogId:lind}},{sourceId:lind,countsById:{[lind+':4']:i}});assert.equal(p.formula,'2d10');assert.equal(p.openRoll,[0,10,9,8][i]);}
 for(const c of ['fr','en']){const a=actor(c);await applyTransformation(a,lind+'#illusion',{counts:[1,2,3,1,2,2],skipDialog:true});assert.deepEqual(created.duration,{value:5,units:'rounds'});assert.deepEqual(created.system.changes,[]);assert.deepEqual(created.statuses,[]);assert.doesNotMatch(created.description,/TRUDVANG\.|undefined/);}
});
