import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {TRANSFORMATION_TEMPLATES as templates} from '../modules/transformation-data.mjs';
import {auraRadius,reconcileAuraToken,registerAuraSupport,settleAuraJobs,synchronizeAuraSource} from '../modules/aura.mjs';

const S='trudvang-chronicles',prefix='holy-ealdtradition-magh-s-gift:',ids=['rider-s-melody:1','hero-s-song:4','king-s-anthem:6'].map(s=>prefix+s);
const docs=new Map(),notices=[];let serial=0;
const langs=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));
function assign(o,changes){for(const [path,value]of Object.entries(changes)){const k=path.split('.');let at=o;for(const key of k.slice(0,-1))at=at[key]??={};at[k.at(-1)]=structuredClone(value);}}
globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>false}}},utils:{deepClone:structuredClone,fromUuid:async uuid=>docs.get(uuid)},data:{operators:{ForcedDeletion:{create:()=>null},ForcedReplacement:{create:v=>v}}},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime})}}}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};globalThis.CONST={TOKEN_DISPOSITIONS:{FRIENDLY:1,HOSTILE:-1}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async d=>(notices.push(d),d)};
const {processConsequenceEffects,executeConsequences}=await import('../modules/consequences.mjs');
const {applyTransformation}=await import('../modules/transformations.mjs');
function setup(code='fr'){
 docs.clear();notices.length=0;serial=0;const lookup=k=>k.split('.').reduce((v,k)=>v?.[k],langs[code])??k;
 globalThis.game={user:{id:'gm',isGM:true},users:{activeGM:{isSelf:true}},time:{worldTime:0},actors:[],scenes:[],i18n:{lang:code,localize:lookup,format:(k,v)=>lookup(k).replace(/\{(\w+)\}/g,(_,k)=>v[k])}};
 function actor(id){const a={uuid:'Actor.'+id,documentName:'Actor',type:'character',name:id,isOwner:true,canUserModify:()=>true,getActiveTokens:()=>[],statuses:new Set(),items:[],effects:[],flags:{},system:{resources:{body:{current:0,value:0,max:100}}},async update(data){assign(this,data);this.system.resources.body.current=this.system.resources.body.value;},async createEmbeddedDocuments(type,rows){assert.equal(type,'ActiveEffect');return rows.map(row=>createEffect(this,row));},async deleteEmbeddedDocuments(type,ids){assert.equal(type,'ActiveEffect');for(const id of ids){const e=this.effects.find(e=>e.id===id);assert.ok(e,'never delete an already-expired ID');await e.delete();}},async createTrudvangEffect(row){return createEffect(this,row);}};docs.set(a.uuid,a);game.actors.push(a);return a;}
 const caster=actor('caster'),ally=actor('ally'),enemy=actor('enemy'),neutral=actor('neutral');
 const tokens=[caster,ally,enemy,neutral].map((actor,i)=>({id:String(i),uuid:'Scene.s.Token.'+i,disposition:[-1,1,-1,0][i],actor}));for(const token of tokens)docs.set(token.uuid,token);
 const region={uuid:'Scene.s.Region.chant',tokens:new Set(tokens),flags:{[S]:{aura:{casterUuid:caster.uuid}}},async delete(){game.scenes[0].regions=[];}};game.scenes=[{tokens,regions:[region]}];for(const token of tokens)token.parent=game.scenes[0];
 return {caster,ally,enemy,neutral,tokens,region};
}
function createEffect(actor,row){const e={...structuredClone(row),id:'e'+serial++,parent:actor,documentName:'ActiveEffect'};e.uuid=actor.uuid+'.ActiveEffect.'+e.id;e.toObject=()=>({start:structuredClone(e.start)});e.update=async changes=>{const {flags,...other}=changes;assign(e,other);if(flags)for(const [scope,values]of Object.entries(flags))e.flags[scope]={...e.flags[scope],...structuredClone(values)};};e.delete=async()=>{actor.effects=actor.effects.filter(row=>row!==e);docs.delete(e.uuid);};actor.effects.push(e);docs.set(e.uuid,e);return e;}
async function source(f,id=ids[0],counts=[5,2]){const context={sourceId:id,kind:'divine',casterUuid:f.caster.uuid,casterTokenUuid:f.tokens[0].uuid,castingId:'cast'+serial++,auraSource:true,counts,countsById:Object.fromEntries(counts.map((n,i)=>[id+':'+i,n]))};const e=await applyTransformation(f.caster,id+'#effect',{counts,context,skipDialog:true});assert.ok(e);f.region.flags[S].aura.sourceEffectUuid=e.uuid;return e;}
async function enter(f,i=1){await reconcileAuraToken(f.region,f.tokens[i]);return f.tokens[i].actor.effects.find(e=>e.flags[S]?.auraRecipient);}
async function advance(f,time){game.time.worldTime=time;await processConsequenceEffects(game.actors.flatMap(a=>a.effects),time,{announce:false});}

test('three real bilingual source effects carry a radius and no healing clock, while allied aura recipients get the correct periodic clock',async()=>{
 for(const code of ['fr','en'])for(const [i,id]of ids.entries()){
  const f=setup(code),e=await source(f,id,[1,2]);assert.equal(e.flags[S].consequenceClock,undefined);assert.equal(auraRadius(e),[5,10,10][i]+10);assert.match(e.description,new RegExp(String(auraRadius(e))));
  for(let n=0;n<4;n++)await enter(f,n);assert.ok(f.caster.effects.some(e=>e.flags[S]?.auraRecipient));assert.equal(f.ally.effects.length,1);assert.equal(f.enemy.effects.length,0);assert.equal(f.neutral.effects.length,0);
  const child=f.ally.effects[0];assert.match(child.name,/aura/i);assert.doesNotMatch(child.description,/undefined|TRUDVANG\./);assert.ok(child.description.includes(String([1,2,4][i])));assert.equal(child.flags[S].consequenceClock.stages[0].periodic[0].operations[0].dailyLimit.maximum,[5,10,20][i]);
  await advance(f,60);assert.equal(f.ally.system.resources.body.current,[1,2,4][i]);assert.equal(f.caster.system.resources.body.current,[1,2,4][i]);
 }
});
test('leaving settles full minutes, never grants a partial minute, and re-entry starts a fresh exposure without losing the daily allowance',async()=>{
 const f=setup();await source(f);await enter(f);await advance(f,59);assert.equal(f.ally.system.resources.body.current,0);
 await reconcileAuraToken(f.region,f.tokens[1],{leaving:true});assert.equal(f.ally.effects.length,0);
 game.time.worldTime=60;await enter(f);await advance(f,120);assert.equal(f.ally.system.resources.body.current,1);
 game.time.worldTime=125;await enter(f);await advance(f,180);assert.equal(f.ally.system.resources.body.current,2,'ordinary reconciliation does not reset the minute clock');
 game.time.worldTime=245;await reconcileAuraToken(f.region,f.tokens[1],{leaving:true});assert.equal(f.ally.system.resources.body.current,3,'last completed minute is applied on exit');assert.equal(f.ally.effects.length,0);
});
test('repeated casts and different singers share the recipient daily cap; a new day restores it',async()=>{
 const f=setup();await source(f);await enter(f);await advance(f,300);assert.equal(f.ally.system.resources.body.current,5);
 const old=f.ally.effects[0];await reconcileAuraToken(f.region,f.tokens[1],{leaving:true});assert.ok(!f.ally.effects.includes(old));
 await source(f);await enter(f);await advance(f,360);assert.equal(f.ally.system.resources.body.current,5);
 const other={...f.caster,uuid:'Actor.otherSinger'};docs.set(other.uuid,other);const secondSource=await source(f);secondSource.parent=other;secondSource.flags[S].transformation.ruleTestContext.casterUuid=other.uuid;
 await reconcileAuraToken(f.region,f.tokens[1],{leaving:true});await enter(f);await advance(f,420);assert.equal(f.ally.system.resources.body.current,5);
 game.time.worldTime=86400;await reconcileAuraToken(f.region,f.tokens[1],{leaving:true});await source(f);await enter(f);await advance(f,86460);assert.equal(f.ally.system.resources.body.current,6);
});
test('large advances process the final full-minute tick once and delete recipients without stale IDs',async()=>{
 const f=setup();await source(f,ids[1],[3,0]);const child=await enter(f);await Promise.all([advance(f,600),reconcileAuraToken(f.region,f.tokens[1],{leaving:true})]);assert.equal(f.ally.system.resources.body.current,10);assert.ok(!docs.has(child.uuid));
 await advance(f,1000);assert.equal(f.ally.system.resources.body.current,10);
});
test('daily accounting uses actual healing, is atomic across callers, and dates ticks at the event even across midnight',async()=>{
 const f=setup(),a=f.ally,operation={operation:'heal',formula:'4',dailyLimit:{key:ids[2],maximum:5},at:86399};a.system.resources.body.max=2;
 await executeConsequences({actor:a,operations:[operation]});assert.equal(a.flags[S].consequenceDailyUsage[0].amount,2);
 a.system.resources.body.max=100;const r=await Promise.all([executeConsequences({actor:a,operations:[operation]}),executeConsequences({actor:a,operations:[operation]})]);assert.equal(a.system.resources.body.current,5);assert.equal(r.reduce((sum,r)=>sum+r.rows[0].amount,0),3);
 game.time.worldTime=90000;await executeConsequences({actor:a,operations:[{...operation,at:86400}]});assert.equal(a.system.resources.body.current,9);assert.deepEqual(a.flags[S].consequenceDailyUsage.map(r=>[r.day,r.amount]),[[0,5],[1,4]]);
});
test('one large time advance across midnight processes the old and new daily allowances at their actual minute timestamps',async()=>{
 const f=setup();await executeConsequences({actor:f.ally,operations:[{operation:'heal',formula:'5',dailyLimit:{key:ids[0],maximum:5},at:86200}]});
 game.time.worldTime=86300;await source(f);await enter(f);await advance(f,90000);
 assert.equal(f.ally.system.resources.body.current,10);assert.deepEqual(f.ally.flags[S].consequenceDailyUsage.map(row=>[row.day,row.amount]),[[0,5],[1,5]]);
});
test('removing the aura source settles earned minutes and removes every recipient clock before any later advance',async()=>{
 const f=setup(),e=await source(f);await enter(f);game.time.worldTime=65;await e.delete();await synchronizeAuraSource(e,{removed:true});
 assert.equal(f.ally.system.resources.body.current,1);assert.equal(f.ally.effects.length,0);assert.equal(game.scenes[0].regions.length,0);
 await advance(f,360);assert.equal(f.ally.system.resources.body.current,1);
});
test('deaf recipients and a silenced singer receive no healing aura; hearing status hooks reconcile the existing scene',async()=>{
 const f=setup();await source(f);f.ally.statuses.add('deaf');assert.equal(await enter(f),undefined);f.ally.statuses.clear();await enter(f);assert.equal(f.ally.effects.length,1);
 const callbacks={};globalThis.Hooks={on:(name,fn)=>callbacks[name]=fn};globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};foundry.data.regionBehaviors={RegionBehaviorType:class{}};registerAuraSupport();
 f.ally.statuses.add('deaf');callbacks.createActiveEffect({parent:f.ally,statuses:new Set(['deaf'])});await settleAuraJobs();assert.equal(f.ally.effects.length,0);
 f.ally.statuses.clear();callbacks.deleteActiveEffect({parent:f.ally,statuses:new Set(['deaf'])});await settleAuraJobs();assert.equal(f.ally.effects.length,1);
 f.caster.statuses.add('silenced');callbacks.createActiveEffect({parent:f.caster,statuses:new Set(['silenced'])});await settleAuraJobs();assert.equal(f.ally.effects.length,0);
});

