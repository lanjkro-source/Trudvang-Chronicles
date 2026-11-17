import fs from 'node:fs';import assert from 'node:assert/strict';import test from 'node:test';
import {waterMovementValues,waterMovementDegree,waterMovementBase,waterMovementBudget} from '../modules/rules/water-movement.mjs';
import {movementDetails} from '../modules/rules/transformation-profile.mjs';
import {rulesFromChanges} from '../modules/rules/effect-rule-changes.mjs';
import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {validateMagicAllocations,magicSharedTargetCapacity} from '../modules/rules/magic-target-allocation.mjs';
import {validatePowerTargeting} from '../tools/power-option-identity.mjs';
const S='trudvang-chronicles',id='vitner-water-craft:wave-master:8',oid=n=>id+':'+n,docs=new Map(),lang=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));let warnings=[],created;
globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>false}}},utils:{deepClone:structuredClone,fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};globalThis.ui={notifications:{warn:m=>warnings.push(m)}};
const {applyTransformation}=await import('../modules/transformations.mjs');const {applyAllocatedEffectOnGM}=await import('../modules/maintained-spell-tracking.mjs');
function setup(c='fr'){
 docs.clear();warnings=[];created=null;const lookup=k=>k.split('.').reduce((v,k)=>v?.[k],lang[c])??k,gm={id:'gm',isGM:true};
 globalThis.game={user:gm,users:new Map([['gm',gm]]),time:{worldTime:0},messages:new Map(),i18n:{lang:c,localize:lookup,format:(k,d)=>lookup(k).replace(/\{(\w+)\}/g,(_,key)=>String(d[key]))}};game.users.activeGM={isSelf:true};
 const actor={uuid:'Actor.patient',name:'Patient',documentName:'Actor',type:'npc',items:[],effects:[],system:{details:{move:[{mode:'nage',distance:'2',max:'12'},{mode:'terrestre',distance:'1',max:'18'}]}},canUserModify:()=>true,createTrudvangEffect:async data=>(created=structuredClone(data),null)};docs.set(actor.uuid,actor);return actor;
}
const key=(group='creatures',adverse=false)=>id+'#'+group+'-'+(adverse?'adverse':'favorable');

test('all seven water degrees obey the rule table and leave land and flight unchanged',()=>{
 const base={max:12,metersPerTwo:2},expected=[[0,0],[1,1],[6,1],[12,2],[24,4],[36,6],[48,8]];
 for(let degree=-3;degree<=3;degree++){
  const value=waterMovementValues(base,degree);assert.deepEqual([value.max,value.metersPerTwo],expected[degree+3]);
  const result=movementDetails(18,[{mode:'terrestre',max:'18',distance:'1'},{mode:'vol',max:'24',distance:'3'},{mode:'nage',max:'12',distance:'2'}],[{mode:'swim',method:'waterDegrees',value:degree,base:{max:999,metersPerTwo:999}}]);
  assert.deepEqual(result.swim,value);assert.deepEqual(result.land,{max:18,metersPerTwo:1});assert.deepEqual(result.flight,{max:24,metersPerTwo:3});
 }
 assert.equal(waterMovementDegree({direction:1,degreeIndex:4,degreeOptionId:oid(4)},{counts:[0,0,0,0,100]}),3);
 assert.equal(waterMovementDegree({direction:-1,degreeIndex:4,degreeOptionId:oid(4)},{counts:[0,0,0,0,100],countsById:{[oid(4)]:0}}),-1);
 const missing=movementDetails(18,[],[{mode:'swim',method:'waterDegrees',value:1}]);assert.deepEqual(missing.swim,{max:18,metersPerTwo:1});
 const supplied=movementDetails(18,[],[{mode:'swim',method:'waterDegrees',value:1,base:{max:10,metersPerTwo:0.5}}]);assert.deepEqual(supplied.swim,{max:18,metersPerTwo:1});
});
test('explicit swimming is preserved and default swimming uses half land movement without leaking to carried objects',()=>{
 const actor=setup();actor._source={system:{details:{move:[{mode:'swim',max:'8,5',distance:'0,5'}]}}};assert.deepEqual(waterMovementBase(actor),{max:8.5,metersPerTwo:0.5});
 assert.deepEqual(waterMovementBase({type:'character',system:{movement:{current:18}}}),{max:9,metersPerTwo:0.5});assert.equal(waterMovementBase({type:'gear',parent:actor}),null);
});
test('both bilingual creature variants calculate duration, exact degree, effective water values and range without doubling on copies',async()=>{
 for(const c of ['fr','en'])for(const adverse of [false,true]){
  const actor=setup(c);await applyTransformation(actor,key('creatures',adverse),{counts:[2,1,1,1,1],skipDialog:true});const first=structuredClone(created);
  assert.deepEqual(first.duration,{value:27,units:'hours'});assert.equal(first.flags[S].transformation.waterMovement.degree,adverse?-2:2);
  assert.deepEqual(rulesFromChanges(first.system.changes).movement,[{mode:'swim',method:'waterDegrees',value:adverse?-2:2,base:{max:12,metersPerTwo:2}}]);
  assert.match(first.description,/1200/);assert.doesNotMatch(first.description,/undefined|TRUDVANG\.|\{\w+\}/);assert.equal(first.transfer,false);
  await applyTransformation(actor,key('creatures',adverse),{source:{documentName:'ActiveEffect',...first},counts:[100,100,100,100,100],skipDialog:true});assert.deepEqual(created.system.changes,first.system.changes);assert.deepEqual(created.duration,first.duration);assert.equal(warnings.length,0);
 }
});
test('missing land and swimming values require explicit input; boats keep their own effect without changing passengers',async()=>{
 const actor=setup();actor.system.details.move=[];await applyTransformation(actor,key(),{skipDialog:true});assert.equal(created,null);assert.equal(warnings.length,1);
 await applyTransformation(actor,key(),{preselectedAnswers:{duration:'1 hour',water_max:'8,5',water_metersPerTwo:'0,5'}});assert.deepEqual(created.flags[S].transformation.waterMovement,{base:{max:8.5,metersPerTwo:0.5},degree:1,max:17,metersPerTwo:1});
 for(const value of ['',-1,'no']){created=null;await applyTransformation(actor,key(),{preselectedAnswers:{duration:'1 hour',water_max:value,water_metersPerTwo:1}});assert.equal(created,null);}
 const item={type:'gear',documentName:'Item',uuid:actor.uuid+'.Item.boat',name:'Boat',parent:actor,effects:[],canUserModify:()=>true,createEmbeddedDocuments:async(_kind,rows)=>(created=rows[0],[{...rows[0],uuid:'Effect.boat'}])};
 created=null;await applyTransformation(actor,key(),{destinationItem:item,skipDialog:true});assert.equal(created,null);
 await applyTransformation(actor,key('objects'),{destinationItem:item,preselectedAnswers:{duration:'1 hour',water_max:20,water_metersPerTwo:4}});assert.equal(created.transfer,false);assert.equal(created.flags[S].transformation.waterMovement.max,40);assert.equal(actor.effects.length,0);
});
test('one free recipient is shared between creatures and objects; paid recipients retain their own type and base degree',()=>{
 const targeting=POWER_DETAILS_BY_ID[id].targeting;
 const allocation=(uuid,group,countsById={})=>({targetUuid:uuid,effectKey:key(group),countsById});const a=allocation('Actor.a','creatures'),b=allocation('Item.b','objects');
 const check=(selected,allocations)=>validateMagicAllocations({targeting,selected,allocations});
 assert.equal(magicSharedTargetCapacity(targeting,{}),1);assert.equal(check({},[a,b]).reason,'exceeds-targets');assert.equal(check({[oid(6)]:1},[a,b]).ok,true);
 assert.equal(check({[oid(5)]:1},[a,allocation('Actor.c','creatures')]).ok,true);assert.equal(check({[oid(6)]:1},[a,allocation('Actor.c','creatures')]).reason,'exceeds-targets');
 const swarm=Array.from({length:11},(_,i)=>allocation('Actor.'+i,'creatures'));assert.equal(check({[oid(7)]:1},swarm).ok,true);assert.equal(check({[oid(7)]:1},[...swarm,b]).reason,'exceeds-targets');
 assert.equal(check({[oid(5)]:1,[oid(4)]:1},[{...a,countsById:{[oid(4)]:1}},allocation('Actor.c','creatures')]).ok,true);
 assert.equal(check({[oid(5)]:1,[oid(4)]:1},[a,allocation('Actor.c','creatures',{[oid(4)]:1})]).reason,'invalid-allocation');
 const source=JSON.parse(fs.readFileSync('game doc/fr/trudvang-powers-fr.json')).find(row=>row.catalogId===id);assert.doesNotThrow(()=>validatePowerTargeting(source,structuredClone(source)));
 const bad=structuredClone(source);bad.targeting.sharedCapacity.additionalTargets.pop();assert.throws(()=>validatePowerTargeting(bad,structuredClone(bad)),/incomplete/);
});
test('water movement spends one round allowance, resets next round and never constrains land movement',()=>{
 const actor=setup();actor.transformationProfile={movements:[{mode:'swim',method:'waterDegrees',value:-2}]};actor.transformationMovement={swim:1};
 const combat={id:'fight',round:3};assert.equal(waterMovementBudget(actor,'swim',{combat}).remaining,1);actor.flags={[S]:{waterMovementTravel:{combatId:'fight',round:3,meters:1}}};
 assert.equal(waterMovementBudget(actor,'swim',{combat}).remaining,0);assert.equal(waterMovementBudget(actor,'swim',{combat:{id:'fight',round:4}}).remaining,1);assert.equal(waterMovementBudget(actor,'land',{combat}),null);
 actor.transformationProfile.movements=[];assert.equal(waterMovementBudget(actor,'swim',{combat}),null);
});
test('GM allocation preserves the first recipient on renewal and serializes the shared free creature-or-object slot',async()=>{
 const actor=setup(),caster={...actor,uuid:'Actor.caster',system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:'cast',itemId:'spell',powerLevelSnapshot:[{id:oid(4),count:1},{id:oid(5),count:1}],targetAllocations:[]}]},items:[{id:'spell',type:'spell',system:{catalogId:id,spellType:'lasting'}}],async update(changes){this.system.activeSpellCastings=structuredClone(changes['system.activeSpellCastings']);}};docs.set(caster.uuid,caster);
 const b={...actor,uuid:'Actor.second'};docs.set(b.uuid,b);let serial=0;for(const a of [actor,b])a.createTrudvangEffect=async data=>({...data,uuid:'Effect.'+(serial++)});
 const data={name:'Waves',system:{changes:[]},flags:{[S]:{transformation:{key:key(),sourceId:id,ruleTestContext:{casterUuid:caster.uuid,castingId:'cast',sourceId:id,kind:'spell'}}}}};
 const apply=(target,count)=>applyAllocatedEffectOnGM({casterUuid:caster.uuid,castingId:'cast',targetUuid:target.uuid,userId:'gm',countsById:{[oid(4)]:count},data});
 assert.equal((await apply(actor,1)).status,'ok');assert.equal((await apply(b,0)).status,'ok');assert.equal((await apply(actor,1)).status,'ok');assert.equal(caster.system.activeSpellCastings[0].targetAllocations[0].targetUuid,actor.uuid);
 const extra={...actor,uuid:'Actor.extra'};docs.set(extra.uuid,extra);assert.equal((await apply(extra,0)).status,'exceeds-targets');assert.equal((await apply(b,1)).status,'invalid-allocation');
 const fresh={...caster,uuid:'Actor.fresh',system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:'cast',itemId:'spell',powerLevelSnapshot:[],targetAllocations:[]}]}};docs.set(fresh.uuid,fresh);
 const payload={casterUuid:fresh.uuid,castingId:'cast',userId:'gm',countsById:{},data:structuredClone(data)};payload.data.flags[S].transformation.ruleTestContext.casterUuid=fresh.uuid;
 const results=await Promise.all([actor,b].map(target=>applyAllocatedEffectOnGM({...payload,targetUuid:target.uuid})));assert.deepEqual(results.map(r=>r.status),['ok','exceeds-targets']);
});

test('FR/EN characters and land creatures accept Wave Master without swimming input and gain only a temporary half-land swimming mode',async()=>{
 for(const c of ['fr','en'])for(const type of ['character','npc']){
  const actor=setup(c);actor.type=type;
  actor.system={movement:{current:12},details:{move:type==='npc'?[{mode:'terrestre',distance:'1',max:'12'}]:[]}};
  const before=structuredClone(actor.system);
  await applyTransformation(actor,key(),{counts:[0,0,0,0,1],skipDialog:true});assert.ok(created);assert.equal(warnings.length,0);
  assert.deepEqual(created.flags[S].transformation.waterMovement,{base:{max:6,metersPerTwo:0.5},degree:2,max:18,metersPerTwo:1.5});
  const changes=rulesFromChanges(created.system.changes).movement;
  const active=movementDetails(12,actor.system.details.move,changes);assert.deepEqual(active.swim,{max:18,metersPerTwo:1.5});assert.deepEqual(active.land,{max:12,metersPerTwo:1});
  const removed=movementDetails(12,actor.system.details.move,[]);assert.equal(removed.swim,undefined);assert.deepEqual(actor.system,before);
  await applyTransformation(actor,key('creatures',true),{skipDialog:true});assert.deepEqual(created.flags[S].transformation.waterMovement,{base:{max:6,metersPerTwo:0.5},degree:-1,max:3,metersPerTwo:0.25});
 }
});
test('implicit swimming follows current land modifiers, leaves explicit swimming authoritative and never uses flight',()=>{
 const actor=setup();actor.system.details.move=[{mode:'terrestre',max:'12',distance:'1'}];actor.transformationMovement={land:30};actor.transformationMovementRows=[{mode:'land',metersPerTwo:3}];
 assert.deepEqual(waterMovementBase(actor),{max:15,metersPerTwo:1.5});
 const rows=movementDetails(12,actor.system.details.move,[{mode:'land',method:'replace',value:30,metersPerTwo:3},{mode:'swim',method:'waterDegrees',value:1,base:{max:6,metersPerTwo:0.5}}]);assert.deepEqual(rows.swim,{max:30,metersPerTwo:3});
 actor.system.details.move.push({mode:'nage',max:'8',distance:'2'});assert.deepEqual(waterMovementBase(actor),{max:8,metersPerTwo:2});
 const flight={type:'npc',system:{movement:{current:12},details:{move:[{mode:'vol',max:'24',distance:'2'}]}}};assert.equal(waterMovementBase(flight),null);
});
