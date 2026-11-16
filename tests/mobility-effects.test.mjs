import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {leapDistances,castingCooldownRemaining,effectTargetRestriction} from '../modules/rules/mobility-effects.mjs';
import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {RULE_TESTS_BY_CATALOG_ID as tests} from '../modules/rule-test-data.mjs';
import {conditionalSituationBonuses} from '../modules/rules/effect-conditional-tests.mjs';
import {spellAvailability} from '../modules/rules/spell-availability.mjs';
const S='trudvang-chronicles',trip='vitner-body-vitner:tipping:1',roar='vitner-delusion-vitner:roar:0',snare='holy-tenetnid-tablet-of-the-shield:snares-of-the-holy-ground:0',leap='holy-toikalokke-lynx-power:feline-leap:3';
const docs=new Map(),messages=new Map();let warnings=[],rolls=0;
const languages=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>'<article>Card</article>'},api:{DialogV2:{wait:async()=>false}}},utils:{deepClone:structuredClone,fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};
globalThis.ui={notifications:{warn:message=>(warnings.push(message),null)}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){rolls++;this.total=4;return this;}async toMessage(){}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>({id:'notice',...data})};
const {applyTransformation}=await import('../modules/transformations.mjs');
const {performRuleTest}=await import('../modules/rule-tests.mjs');
const {applyAllocatedEffectOnGM}=await import('../modules/maintained-spell-tracking.mjs');
const {withInitialResistance}=await import('../modules/initial-resistance.mjs');
const {conditionalChoices,blessingDialog}=await import('../modules/blessing-dialog.mjs');
const {rollUnder}=await import('../modules/dice.mjs');
function setup(c='fr'){
 docs.clear();messages.clear();warnings=[];rolls=0;
 const owner={id:'owner'},gm={id:'gm',isGM:true},users=new Map([[owner.id,owner],[gm.id,gm]]),lookup=key=>key.split('.').reduce((v,k)=>v?.[k],languages[c])??key;
 globalThis.game={user:owner,users,messages,time:{worldTime:0},i18n:{lang:c,localize:lookup,format:(key,data)=>lookup(key).replace(/\{(\w+)\}/g,(_,k)=>String(data[k]))}};
 globalThis.CONFIG={TRUDVANG:{skills:{agility:'TRUDVANG.Skill.Agility'},knowledgeTree:{}}};
 const actor={uuid:'Actor.target',documentName:'Actor',name:'Target',type:'character',isOwner:true,items:[],effects:[],system:{tags:['démon']},statuses:new Set(),async toggleStatusEffect(id,{active}){if(active)this.statuses.add(id);else this.statuses.delete(id);},canUserModify:()=>true,getTraitValue:()=>0};docs.set(actor.uuid,actor);return actor;
}
function create(actor,data){
 const e={...structuredClone(data),documentName:'ActiveEffect',id:crypto.randomUUID(),uuid:actor.uuid+'.ActiveEffect.'+crypto.randomUUID(),parent:actor};
 e.update=async changes=>{for(const [path,value]of Object.entries(changes)){const keys=path.split('.');let target=e;for(const k of keys.slice(0,-1))target=target[k]??={};target[keys.at(-1)]=structuredClone(value);}return e;};
 e.delete=async()=>{docs.delete(e.uuid);actor.effects=actor.effects.filter(row=>row!==e);};
 actor.effects.push(e);docs.set(e.uuid,e);return e;
}
function context(sourceId,counts=[]){return {sourceId,kind:sourceId.startsWith('vitner-')?'spell':'divine',casterUuid:'Actor.caster',counts,countsById:Object.fromEntries(counts.map((v,i)=>[sourceId+':'+i,v]))};}

test('four models apply from their bilingual sources with the correct recipient, bounds and effective descriptions',async()=>{
 for(const c of ['fr','en'])for(const [key,counts,answers]of [[trip+'#trip',[0,2],{}],[roar+'#hearing',[1,0,1],{}],[snare+'#snared',[2,0,4],{}],[leap+'#leap',[4,3],{effectInput:'1,8'}]]){
  const actor=setup(c);let data;actor.createTrudvangEffect=async input=>(data=input,null);
  await applyTransformation(actor,key,{counts,preselectedAnswers:{duration:templates[key].duration,...answers}});assert.ok(data,key);assert.doesNotMatch(data.description,/undefined|TRUDVANG\./);
  if(key.includes('#trip')){assert.deepEqual(data.statuses,[]);assert.deepEqual(data.flags[S].initialResistance.payload.statuses,['prone']);assert.equal(data.duration.value,null);}
  if(key.includes('#hearing')){assert.deepEqual(data.duration,{value:48,units:'rounds'});assert.equal(conditionalSituationBonuses(data)[0].value,-4);assert.match(data.flags[S].transformation.summary,/-4/);}
  if(key.includes('#snared')){assert.deepEqual(data.duration,{value:5,units:'rounds'});assert.equal(conditionalSituationBonuses(data)[0].value,-5);}
  if(key.includes('#leap')){assert.deepEqual(data.duration,{value:3,units:'rounds'});assert.deepEqual(data.flags[S].transformation.leap,{bodyHeight:1.8,length:7.4,height:3.9});}
 }
});
test('Croche-pied uses Agility, paid penalty and reactive skill routing; success preserves an existing posture and repeated failures set one native prone status',async()=>{
 const actor=setup();let data,request;actor.createTrudvangEffect=async input=>(data=input,null);
 await applyTransformation(actor,trip+'#trip',{counts:[0,3],skipDialog:true});const e=create(actor,data);
 actor.rollAbility=async(item,options)=>{request={item,options};return {success:false,target:5};};
 await performRuleTest({document:e,index:0,actor:{...actor,uuid:'Actor.wrong'}});
 assert.equal(request.item.system.parentSkill,'agility');assert.equal(request.options.reactive,true);assert.deepEqual(request.options.modifierRows.map(row=>row.value),[-3]);assert.ok(actor.statuses.has('prone'));assert.ok(!docs.has(e.uuid));
 assert.equal(e.duration.value,null);
 const repeated=create(actor,data);await performRuleTest({document:repeated,index:0,actor});assert.deepEqual([...actor.statuses],['prone']);assert.ok(!docs.has(repeated.uuid));
 const other=create(actor,data);actor.rollAbility=async()=>({success:true,target:12});await performRuleTest({document:other,index:0,actor});assert.ok(!docs.has(other.uuid));assert.deepEqual([...actor.statuses],['prone']);
 assert.equal(tests[trip][0].kind,'skill');assert.equal(tests[trip][0].magicResistance,false);
});
test('hearing and physical movement penalties are optional in the common section and never affect open trait comparisons',async()=>{
 const actor=setup();actor.createTrudvangEffect=async input=>{create(actor,input);return null;};
 await applyTransformation(actor,roar+'#hearing',{preselectedAnswers:{duration:'2 minutes'}});await applyTransformation(actor,snare+'#snared',{counts:[0,0,2],skipDialog:true});
 const choices=conditionalChoices(actor);assert.deepEqual(choices.map(row=>row.value),[-4,-3]);assert.ok(choices.every(row=>row.testOnly&&!row.fixed));
 let selected=false;const root={querySelector:()=>({checked:selected})};class Base{static async wait(options){return options.buttons[0].callback(null,{form:root},{element:root});}}
 const dialog=blessingDialog(Base,actor),config=()=>({buttons:[{action:'roll',callback:()=>({modifier:0})}]});
 assert.equal((await dialog.wait(config())).modifier,0);selected=true;assert.equal((await dialog.wait(config())).modifier,-7);
 const open=blessingDialog(Base,actor,'trait');const result=await open.wait({buttons:[{action:'roll',callback:()=>({mode:'open',bonus:0})}]});assert.equal(result.bonus,0);assert.equal(result.blessing,undefined);
});
test('no conditional modifier is offered while an effect awaits initial resistance',()=>{
 setup();const source='vitner-body-vitner:vision-blindness:4',e={flags:{[S]:{transformation:{key:source+'#affaibli',sourceId:source,ruleTestContext:context(source,[0,0,0,0,0,7])},initialResistance:{resolved:false}}}};
 assert.deepEqual(conditionalSituationBonuses(e),[]);e.flags[S].initialResistance.resolved=true;assert.ok(conditionalSituationBonuses(e).length>0);
});
test('creature restrictions recognize French and English demon tags and exclude the source of Roar',async()=>{
 const actor=setup();actor.system.tags=['humain'];assert.ok(effectTargetRestriction(templates[snare+'#snared'],actor));
 assert.equal(await applyTransformation(actor,snare+'#snared',{skipDialog:true}),null);assert.equal(warnings.length,1);
 actor.system.tags=['demon'];assert.equal(effectTargetRestriction(templates[snare+'#snared'],actor),'');
 assert.ok(effectTargetRestriction(templates[roar+'#hearing'],actor,{casterUuid:actor.uuid}));
});
test('leap distances use frozen option identities, real height and the maximum horizontal/vertical distances',()=>{
 setup();const def=templates[leap+'#leap'].leap;
 assert.deepEqual(leapDistances(def,'1,8',{counts:[4,3]}),{bodyHeight:1.8,length:7.4,height:3.9});
 assert.deepEqual(leapDistances(def,'1.8',{counts:[100,100]}),{bodyHeight:1.8,length:15,height:8});
 assert.equal(leapDistances(def,'0',{}),null);assert.equal(leapDistances(def,'oops',{}),null);
 assert.equal(leapDistances(def,2,{counts:[100,100],countsById:{[def.lengthOptionId]:0,[def.heightOptionId]:0}}).length,6);
});
test('muscular recovery prevents casting before spending points, advances by rounds or time and cannot be bypassed by disabling the effect',async()=>{
 const actor=setup();actor.type='npc';actor.system.magic={castingTarget:10};actor.system.resources={divinity:{current:20}};actor.createTrudvangEffect=async input=>(create(actor,input),null);
 await applyTransformation(actor,leap+'#leap',{preselectedAnswers:{effectInput:'1.8',duration:'1 hour'}});const e=actor.effects[0];
 assert.deepEqual(e.duration,{value:3,units:'rounds'});assert.equal(castingCooldownRemaining(actor,leap),15);
 const item={type:'divineFeat',system:{catalogId:leap,level:2,cost:4}};assert.equal(spellAvailability(actor,item).ok,false);
 e.disabled=true;game.time.worldTime=10;assert.equal(castingCooldownRemaining(actor,leap),5);
 game.time.worldTime=15;assert.equal(spellAvailability(actor,item).ok,true);
 game.time.worldTime=0;e.start={combat:'fight',round:1};game.combat={id:'fight',round:4};assert.equal(castingCooldownRemaining(actor,leap),0);delete game.combat;
});
test('instant spell successes publish a bounded allocation without creating a maintained instance',async()=>{
 const actor=setup();actor.system.activeSpellCastings=[];
 const old=globalThis.ChatMessage;let data;globalThis.ChatMessage={getSpeaker:()=>({}),create:async input=>(data=input,{id:'cast',...input})};
 try{
  await rollUnder({actor,item:{type:'spell',name:'Croche-pied',system:{catalogId:trip,spellType:'instant'}},label:'Spell',kind:'spell',target:15,powerLevelCounts:[0,2,1],castingId:'one'});
  assert.equal(data.flags[S].instantAllocation.selected[trip+':1'],2);assert.equal(data.flags[S].instantAllocation.castingId,'one');assert.equal(data.flags[S].divineAllocation,undefined);assert.deepEqual(actor.system.activeSpellCastings,[]);
 }finally{globalThis.ChatMessage=old;}
});

test('instant spell allocations serialize targets and improvements, reject reapplication and authorize only explicitly delegated targets',async()=>{
 const caster=setup(),owner=game.user,gm=game.users.get('gm');caster.uuid='Actor.caster';caster.testUserPermission=user=>user.id===owner.id;docs.set(caster.uuid,caster);
 game.user=gm;game.users.activeGM={isSelf:true};caster.update=()=>assert.fail('instant allocations never write a maintained casting');
 const targets=['a','b','c'].map(id=>({documentName:'Actor',type:'character',uuid:'Actor.'+id,effects:[],system:{},canUserModify:user=>user.isGM,createTrudvangEffect:async function(data){return create(this,data);}}));targets.forEach(actor=>docs.set(actor.uuid,actor));
 const key=trip+'#trip',cast={castingId:'one',casterUuid:caster.uuid,sourceId:trip,selected:{[trip+':1']:3,[trip+':2']:1},targetAllocations:[]};
 const message={id:'cast',author:owner,flags:{[S]:{instantAllocation:cast,ruleTestContext:{casterUuid:caster.uuid},transformationTargets:{[key]:targets.slice(0,2).map(actor=>({actorUuid:actor.uuid,tokenUuid:'Token.'+actor.uuid}))}}},async update(change){for(const [path,value]of Object.entries(change)){const keys=path.split('.');let target=this;for(const k of keys.slice(0,-1))target=target[k];target[keys.at(-1)]=structuredClone(value);}}};messages.set(message.id,message);
 const data={name:'Trip',duration:{value:null,units:'rounds'},statuses:[],system:{changes:[]},flags:{[S]:{transformation:{key,sourceId:trip,appliedAt:0,ruleTestContext:{casterUuid:caster.uuid,castingId:'one',sourceId:trip,kind:'spell'}},initialResistance:{id:'pending',resolved:false,testIndex:0,payload:{name:'Trip',summary:'Trip',description:'Trip',summaryResolved:true,statuses:['prone'],changes:[]}}}}};
 const apply=(target,count)=>applyAllocatedEffectOnGM({casterUuid:caster.uuid,castingId:'one',messageId:message.id,targetUuid:target.uuid,userId:owner.id,countsById:{[trip+':1']:count},data});
 const results=await Promise.all([apply(targets[0],2),apply(targets[1],1)]);assert.deepEqual(results.map(row=>row.status),['ok','ok']);
 assert.equal((await apply(targets[2],0)).status,'unavailable','an unlisted unowned actor is never a delegated target');
 await targets[0].effects[0].delete();assert.equal((await apply(targets[0],2)).status,'already-applied');
 assert.equal(message.flags[S].instantAllocation.targetAllocations.length,2);
});
