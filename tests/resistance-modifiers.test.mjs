import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const S='trudvang-chronicles',lang=JSON.parse(fs.readFileSync('lang/fr.json')),get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
const dialogs=[],messages=[];
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
globalThis.foundry={documents:{Actor:class{},ActiveEffect:class{}},data:{ActiveEffectTypeDataModel:class{}},applications:{api:{DialogV2:class{_onRender(){}static async wait(options){dialogs.push(options.content);return {situationValue:8,modifier:0};}}},handlebars:{renderTemplate:async(_path,data)=>JSON.stringify(data)}},utils:{}};
globalThis.game={user:{id:'owner'},time:{worldTime:0},i18n:{lang:'fr',localize:key=>get(lang,key)??key,format:(key,data)=>String(get(lang,key)??key).replace(/\{(\w+)\}/g,(_,k)=>data[k]??'')}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{messages.push(data);return {id:'roll'};}};
globalThis.Roll=class{async evaluate(){this.total=4;return this;}};
const {TrudvangActor}=await import('../modules/documents/actor.mjs');
const {rollConfiguredTraitSituation}=await import('../modules/dice.mjs');
function actor(){
 const a={uuid:'Actor.a',name:'A',type:'character',items:[],effects:[],system:{modifiers:{rolls:{allActions:-3}},damage:{penalty:0},fearPenalty:0,effective:{traits:{psyche:0}},traits:{psyche:0}},canPerformAction:()=>true,isInCombatActive:()=>false,getTraitValue:()=>0,allApplicableEffects(){return this.effects;}};
 for(const key of ['getRollModifier','rollEffectRows','traitEffectRows'])a[key]=TrudvangActor.prototype[key];
 a.effects.push({name:'Corbeaux',system:{changes:[{key:'system.modifiers.rolls.allActions',type:'add',value:'-3'}]}});return a;
}
test('a generic effect is applied numerically once in a configured resistance, before source exclusion',async()=>{
 const result=await rollConfiguredTraitSituation({actor:actor(),test:{sv:8,trait:['psyche','aucun'],traitMethod:'first'},sourceName:'Autre sort'});
 assert.equal(result.target,5);assert.match(dialogs.at(-1),/data-final-target>5</);assert.equal(JSON.parse(messages.at(-1).content).target,5);
});

const {actorForResistance}=await import('../modules/resistance-actor.mjs');
function clonableActor(){
 const a=actor();a.documentName='Actor';a.isOwner=true;a.cloneCount=0;
 a.effects[0].uuid='Actor.a.ActiveEffect.ravens';a.effects[0].id='ravens';a.effects[0].documentName='ActiveEffect';
 a.effects.push({id:'fatigue',uuid:'Actor.a.ActiveEffect.fatigue',name:'Fatigue',system:{changes:[{key:'system.modifiers.rolls.allActions',type:'add',value:'-2'}]}});
 a.system.modifiers.rolls.allActions=-5;
 a.clone=async function(changes,options){
  assert.equal(options.keepId,true);this.cloneCount++;
  const copy={...this,system:structuredClone(this.system),effects:changes.effects,items:changes.items??this.items};
  copy.system.modifiers.rolls.allActions=copy.effects.reduce((sum,e)=>sum+e.system.changes.filter(c=>c.key==='system.modifiers.rolls.allActions').reduce((n,c)=>n+Number(c.value),0),0);
  return copy;
 };
 return a;
}
test('resisting an existing effect excludes its modifiers, retains other effects and never edits the live actor',async()=>{
 const a=clonableActor(),effect=a.effects[0],before=JSON.stringify(a.system);
 const result=await rollConfiguredTraitSituation({actor:a,test:{sv:8,trait:['psyche','aucun'],traitMethod:'first'},resistedEffect:effect});
 assert.equal(result.target,6);assert.equal(a.cloneCount,1);assert.equal(JSON.stringify(a.system),before);assert.equal(a.effects.length,2);
 assert.doesNotMatch(dialogs.at(-1),/Corbeaux|name="effect"/);assert.match(dialogs.at(-1),/Fatigue/);
 assert.match(messages.at(-1).content,/Fatigue/);assert.doesNotMatch(messages.at(-1).content,/Corbeaux/);
});
test('a source UUID excludes the exact recurring effect, not another casting of the same spell',async()=>{
 const a=clonableActor();a.effects[1].flags={[S]:{transformation:{sourceId:'ravens'}}};
 const view=await actorForResistance(a,{effectUuid:a.effects[0].uuid});assert.equal(view.effects.length,1);assert.equal(view.effects[0].id,'fatigue');
 const other=await actorForResistance(a,{effectUuid:'Actor.b.ActiveEffect.ravens'});assert.equal(other,a);
});
test('a spell card matches only the captured casting and keeps other casters or castings',async()=>{
 const a=clonableActor(),cast={sourceId:'ravens',castingId:'one',casterUuid:'Actor.mage'};
 a.effects[0].flags={[S]:{transformation:{ruleTestContext:cast}}};a.effects[1].flags={[S]:{transformation:{ruleTestContext:{...cast,castingId:'two'}}}};
 const view=await actorForResistance(a,{effect:{uuid:'Actor.mage.Item.spell'},context:cast});assert.equal(view.effects.length,1);assert.equal(view.effects[0].id,'fatigue');
});
test('shared modifiers apply once across first, second, sum, average and best two-trait tests',async()=>{
 for(const method of ['first','second','sum','average','best']){
  const a=actor();a.system.modifiers.rolls.traits={psyche:2,strength:-1};a.getTraitValue=key=>key==='psyche'?1:4;
  const result=await rollConfiguredTraitSituation({actor:a,test:{sv:8,trait:['psyche','strength'],traitMethod:method}});
  assert.equal(result.target,method==='sum'?11:8,method);
 }
});

test('exclusion re-prepares traits and passes updated defender knowledge into resistance calculations',async()=>{
 const a=clonableActor(),old=a.clone;
 a.clone=async function(changes,options){const view=await old.call(this,changes,options);view.getTraitValue=()=>3;view.findRuleKnowledge=id=>({system:{level:id==='potency'?1:0}});return view;};
 const result=await rollConfiguredTraitSituation({actor:a,test:{sv:8,trait:['psyche','aucun'],traitMethod:'first',magicResistance:true,powerLevelModifiers:[{index:0,value:-1}]},resistedEffect:a.effects[0],resistanceContext:{kind:'spell',sourceId:'ravens',counts:[2],casterName:'Caster',specialtyLevel:0}});
 // 8 + Psyche 3 - fatigue 2 - purchased resistance 2 + defender Potency 2.
 assert.equal(result.target,9);assert.equal(a.system.modifiers.rolls.allActions,-5);
});
test('an effect transferred by an owned object is excluded only from the ephemeral item data',async()=>{
 const a=clonableActor(),effect={id:'curse',uuid:'Actor.a.Item.ring.ActiveEffect.curse',name:'Malédiction',system:{changes:[]}},ring={id:'ring',effects:[effect],toObject:()=>({_id:'ring',name:'Anneau',effects:[{_id:'curse'}]})};
 a.items=[ring];a.allApplicableEffects=function*(){yield* this.effects;yield* this.items.flatMap(i=>i.effects??[]);};
 let copied;
 a.clone=async(data,options)=>{copied=data;return {...a,system:structuredClone(a.system)};};
 await actorForResistance(a,{effectUuid:effect.uuid});
 assert.equal(copied.effects.length,2);assert.deepEqual(copied.items[0].effects,[]);assert.equal(ring.effects.length,1);
});
