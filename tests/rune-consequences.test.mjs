import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POWER_DETAILS_BY_ID as powers} from '../modules/power-catalog-data.mjs';
import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {runeConsequenceAllocation,runeConsequenceExpired,runeConsequenceAmount} from '../modules/rules/rune-consequences.mjs';
import {instantConsequenceOperation} from '../modules/conjured-consumables.mjs';
const S='trudvang-chronicles',healing='holy-thuuldom-healing-rune:healing-rune:0',repair='holy-thuuldom-power-of-repair:power-of-repair:0',water='holy-thuuldom-well-of-water:well-of-water:0';
const docs=new Map(),messages=new Map(),announcements=[],formulas=[];
const languages=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));
globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>false}},handlebars:{renderTemplate:async()=>'<article>Roll</article>'}},utils:{deepClone:structuredClone,randomID:()=>crypto.randomUUID(),fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:100,combat:'combat',round:3})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};
globalThis.ui={notifications:{warn:()=>{}}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){formulas.push(this.formula);this.total=this.formula==='1d20'?4:Number(this.formula.split('d')[0])*3;return this;}};
function assign(target,changes){for(const [path,value]of Object.entries(changes)){const keys=path.split('.');let obj=target;for(const k of keys.slice(0,-1))obj=obj[k]??={};obj[keys.at(-1)]=structuredClone(value);}}
globalThis.ChatMessage={getSpeaker:()=>({}),async create(data){const m={...data,id:crypto.randomUUID(),async update(changes){assign(this,changes);}};messages.set(m.id,m);announcements.push(m);return m;}};
const {applyTransformation}=await import('../modules/transformations.mjs');
const {applyAllocatedEffectOnGM}=await import('../modules/maintained-spell-tracking.mjs');
const {rollUnder}=await import('../modules/dice.mjs');
const {executeConsequences}=await import('../modules/consequences.mjs');
function setup(code='fr'){
 docs.clear();messages.clear();announcements.length=formulas.length=0;
 const gm={id:'gm',isGM:true,active:true},users=new Map([[gm.id,gm]]);users.activeGM={isSelf:true};
 const lookup=k=>k.split('.').reduce((v,p)=>v?.[p],languages[code])??k;
 globalThis.game={user:gm,users,messages,actors:[],scenes:[],time:{worldTime:100},combat:{id:'combat',started:true,round:3},i18n:{lang:code,localize:lookup,format:(k,d)=>lookup(k).replace(/\{(\w+)\}/g,(_,n)=>d[n])}};
 const actor=(id)=>{const a={documentName:'Actor',type:'character',uuid:'Actor.'+id,name:id,isOwner:true,canUserModify:()=>true,items:[],effects:[],system:{resources:{body:{value:5,current:5,max:30}},modifiers:{}},async update(changes){assign(this,changes);this.system.resources.body.current=this.system.resources.body.value;},async createTrudvangEffect(){assert.fail('Instant healing must not create an effect');}};docs.set(a.uuid,a);game.actors.push(a);return a;};
 const caster=actor('caster'),a=actor('a'),b=actor('b'),c=actor('c');
 const item={uuid:caster.uuid+'.Item.rune',name:'Inscribed object',type:'weapon',parent:caster,isOwner:true,canUserModify:()=>true,effects:[],async createEmbeddedDocuments(_kind,rows){return rows.map(row=>{const e={...structuredClone(row),uuid:this.uuid+'.ActiveEffect.'+crypto.randomUUID(),parent:this};docs.set(e.uuid,e);this.effects.push(e);return e;});}};docs.set(item.uuid,item);caster.items.push(item);
 return {caster,a,b,c,item};
}
async function activate(f,id,level=3){
 const item={uuid:f.caster.uuid+'.Item.learned',type:'divineFeat',system:{catalogId:id,isRune:true,level},flags:{[S]:{runeActivation:{level,objectUuid:f.item.uuid}}},actor:f.caster};docs.set(item.uuid,item);
 await rollUnder({actor:f.caster,item,label:id,kind:'rune',target:18,powerLevelCounts:Array.from({length:5},(_,i)=>i===level-1?1:0)});
 const message=announcements.at(-1),context={...message.flags[S].ruleTestContext,messageId:message.id};return {message,context,source:item};
}
function apply(activation,target,units,item=null){return applyTransformation(target,activation.context.sourceId+'#effect',{source:activation.source,context:activation.context,destinationItem:item,preselectedAnswers:{boost0:units}});}
test('rune ranks produce absolute effects, a shared dice pool, independent activation IDs and two-round expiry',()=>{
 for(let level=1;level<=5;level++){
  const p=powers[healing],r=runeConsequenceAllocation(p,{sourceId:healing,runeLevel:level,castingId:'cast',casterUuid:'Actor.c',runeObjectUuid:'Item.i'},{time:100,combat:{id:'combat',started:true,round:3}});
  assert.equal(r.selected[healing+':0'],level);assert.equal(r.expiresAt,110);assert.equal(r.expiresRound,5);
  assert.equal(runeConsequenceExpired(r,{time:109,combat:{id:'combat',round:4}}),false);assert.equal(runeConsequenceExpired(r,{time:110}),true);assert.equal(runeConsequenceExpired(r,{time:100,combat:{id:'combat',round:5}}),true);
  assert.equal(instantConsequenceOperation(templates[repair+'#effect'],[],{runeLevel:level}).formula,String(level*10));
 }
 assert.throws(()=>runeConsequenceAmount({perLevel:1},0));
});
test('real successful rune cards distribute healing dice once across recipients in both languages',async()=>{
 for(const code of ['fr','en']){const f=setup(code),cast=await activate(f,healing,3);assert.ok(cast.message.flags[S].runeAllocation);assert.match(cast.message.content,/Roll/);
 const results=await Promise.all([apply(cast,f.a,2),apply(cast,f.b,1)]);assert.ok(results.every(r=>r?.instant));assert.deepEqual(formulas,['1d20','2d6','1d6']);assert.equal(f.a.system.resources.body.current,11);assert.equal(f.b.system.resources.body.current,8);
 await assert.rejects(apply(cast,f.a,1));await assert.rejects(apply(cast,f.c,1));await assert.rejects(apply(cast,f.c,0));
 const second=await activate(f,healing,3);assert.notEqual(second.context.castingId,cast.context.castingId);await apply(second,f.a,1);assert.equal(f.a.system.resources.body.current,14);
 assert.ok(announcements.filter(m=>m.rolls?.some(r=>r.formula==='2d6')).length,'actual healing rolls attached for Dice So Nice');
 }
});
test('expired or forged healing activations cannot spend again, nor can a compendium link heal freely',async()=>{
 const f=setup(),cast=await activate(f,healing,2);game.combat.round=5;await assert.rejects(apply(cast,f.a,1));assert.equal(f.a.system.resources.body.current,5);
 game.combat.round=3;const original=cast.context.runeLevel;cast.context.runeLevel=5;await assert.rejects(apply(cast,f.a,1));cast.context.runeLevel=original;
 await assert.rejects(applyTransformation(f.a,healing+'#effect',{source:cast.source,skipDialog:true}));
 game.time.worldTime=110;await assert.rejects(apply(cast,f.a,1));
});
test('the caster can allocate several healing dice to a listed actor they do not own through the GM',async()=>{
 const f=setup(),cast=await activate(f,healing,3),owner={id:'owner',active:true};game.users.set(owner.id,owner);
 f.caster.testUserPermission=()=>true;f.a.canUserModify=user=>Boolean(user.isGM);
 const token={documentName:'Token',uuid:'Scene.s.Token.patient',actor:f.a};docs.set(token.uuid,token);
 const key=healing+'#effect';cast.message.flags[S].transformationTargets={[key]:[{actorUuid:f.a.uuid,tokenUuid:token.uuid}]};
 cast.message.content=`<button data-transformation-key="${key}" data-transformation-source="${cast.source.uuid}"></button>`;
 const {applyEffectForCasterOnGM}=await import('../modules/effect-targets.mjs');
 const result=await applyEffectForCasterOnGM({messageId:cast.message.id,userId:owner.id,key,tokenUuid:token.uuid,sourceUuid:cast.source.uuid,answers:{boost0:2}});
 assert.equal(result.status,'applied');assert.equal(f.a.system.resources.body.current,11);
});
test('repairs affect one real item and restore intrinsic wear without refilling temporary VI',async()=>{
 const f=setup(),cast=await activate(f,repair,2);
 const damaged={uuid:f.a.uuid+'.Item.sword',name:'Sword',type:'weapon',parent:f.a,isOwner:true,canUserModify:()=>true,_source:{system:{breach:{value:38,max:50}}},system:{breach:{value:43,max:60}},flags:{[S]:{integritySpent:{grant:{spent:5}}}},async update(data){assign(this._source,data);}};docs.set(damaged.uuid,damaged);
 assert.ok((await apply(cast,f.a,0,damaged)).instant);assert.equal(damaged._source.system.breach.value,50);assert.equal(damaged.flags[S].integritySpent.grant.spent,5);
 await assert.rejects(apply(cast,f.a,0,damaged));
 const another={...damaged,uuid:f.a.uuid+'.Item.other'};docs.set(another.uuid,another);await assert.rejects(apply(cast,f.a,0,another));
 const noVI={...damaged,_source:{system:{}},uuid:f.a.uuid+'.Item.noVI'};await assert.rejects(executeConsequences({actor:f.a,item:noVI,operations:[{operation:'repair',formula:'10'}]}));
});
test('Well of Water creates an expiring item source, heals a recipient once and cannot heal from a deleted or expired source',async()=>{
 const f=setup(),cast=await activate(f,water,2),ledger=cast.message.flags[S].runeAllocation;
 assert.equal(f.item.effects.length,1);const source=f.item.effects[0];assert.deepEqual(source.duration,{value:72,units:'rounds'});assert.match(source.description,/6 minutes/);assert.doesNotMatch(source.description,/undefined|\{\w+\}|TRUDVANG\./);assert.equal(ledger.sourceEffectUuid,source.uuid);
 await apply(cast,f.a,0);assert.equal(f.a.system.resources.body.current,7);await assert.rejects(apply(cast,f.a,0));
 docs.delete(source.uuid);await assert.rejects(apply(cast,f.b,0));docs.set(source.uuid,source);game.time.worldTime=460;await assert.rejects(apply(cast,f.b,0));assert.equal(f.b.system.resources.body.current,5);
});
