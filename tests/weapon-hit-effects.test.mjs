import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import Handlebars from 'handlebars';
import {weaponHitOffers,weaponHitExpired} from '../modules/rules/weapon-hit-effects.mjs';
import {itemEffectRemainingSeconds} from '../modules/rules/effect-duration.mjs';
const S='trudvang-chronicles',id='holy-thuuldom-anvil-shock:anvil-shock:0',key=id+'#shock',docs=new Map(),messages=new Map(),cards=[];
const languages=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));let die=4,serial=0;
const tpl=Handlebars.compile(fs.readFileSync(new URL('../templates/chat/roll-card.hbs',import.meta.url),'utf8'));Handlebars.registerHelper('localize',(key,options)=>game.i18n.format(key,options.hash));Handlebars.registerHelper('eq',(a,b)=>a===b);Handlebars.registerHelper('concat',(...xs)=>xs.slice(0,-1).join(''));
class NativeEffect{};NativeEffect.implementation={getEffectStart:()=>({time:game.time.worldTime,combat:game.combat?.id,round:game.combat?.round})};
globalThis.foundry={documents:{Actor:class{},ActiveEffect:NativeEffect},applications:{api:{DialogV2:{wait:async()=>false}},handlebars:{renderTemplate:async(_,card)=>tpl(card)}},utils:{deepClone:structuredClone,randomID:()=>crypto.randomUUID(),fromUuid:async uuid=>docs.get(uuid)},data:{ActiveEffectTypeDataModel:class{},operators:{ForcedReplacement:{create:v=>v},ForcedDeletion:{create:()=>null}}}};
globalThis.Hooks={call:()=>true};globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('"','&quot;');}})};globalThis.ui={notifications:{warn:()=>{}}};globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=die;return this;}};
function assign(o,values){for(const [path,value]of Object.entries(values)){const keys=path.split('.');let target=o;for(const k of keys.slice(0,-1))target=target[k]??={};target[keys.at(-1)]=structuredClone(value);}}
globalThis.ChatMessage={getSpeaker:()=>({}),async create(data){const m={...data,id:'m'+serial++,author:game.user,async update(changes){assign(this,changes);}};messages.set(m.id,m);cards.push(m);return m;}};
const {TrudvangActor}=await import('../modules/documents/actor.mjs');
const {syncPermanentRunes}=await import('../modules/sacred-objects.mjs');
const {rollUnder}=await import('../modules/dice.mjs');const {applyTransformation,transformationLinks}=await import('../modules/transformations.mjs');
const {applyEffectForCasterOnGM,updateEffectTargetsOnGM}=await import('../modules/effect-targets.mjs');
function setup(c='fr'){
 docs.clear();messages.clear();cards.length=0;die=4;serial=0;const gm={id:'gm',isGM:true,active:true},owner={id:'owner',active:true},users=new Map([[gm.id,gm],[owner.id,owner]]);users.activeGM={isSelf:true};const lookup=k=>k.split('.').reduce((v,k)=>v?.[k],languages[c])??k;
 globalThis.game={user:gm,users,messages,actors:[],scenes:[],time:{worldTime:100},combat:{id:'combat',started:true,round:3},i18n:{lang:c,localize:lookup,format:(k,d={})=>String(lookup(k)).replace(/\{(\w+)\}/g,(_,k)=>d[k])}};
 function actor(name){const a={uuid:'Actor.'+name,name,documentName:'Actor',type:'character',isOwner:true,items:[],effects:[],system:{modifiers:{},resources:{}},canUserModify:()=>true,testUserPermission:()=>true,getActiveTokens:()=>[],async createEmbeddedDocuments(type,rows){assert.equal(type,'ActiveEffect');return rows.map(row=>effect(a,row));}};a.createTrudvangEffect=TrudvangActor.prototype.createTrudvangEffect;a._createTrudvangEffectNow=TrudvangActor.prototype._createTrudvangEffectNow;a.canPerformAction=TrudvangActor.prototype.canPerformAction;Object.defineProperty(a,'statuses',{get:()=>new Set(a.effects.filter(e=>!e.disabled).flatMap(e=>e.statuses??[]))});docs.set(a.uuid,a);game.actors.push(a);return a;}
 const caster=actor('caster'),victim=actor('victim'),other=actor('other');
 const weapon={uuid:caster.uuid+'.Item.hammer',name:'Hammer',type:'weapon',parent:caster,actor:caster,isOwner:true,canUserModify:()=>true,effects:[],system:{damageQualification:{type:'bludgeoning'},sacred:{enabled:true,creatorUuid:caster.uuid,runes:[{id:'inscription',sourceId:id,level:3,invested:3,current:3,uses:0}]}},async createEmbeddedDocuments(type,rows){assert.equal(type,'ActiveEffect');return rows.map(row=>effect(this,row));}};docs.set(weapon.uuid,weapon);caster.items.push(weapon);
 const token={documentName:'Token',id:'target',uuid:'Scene.s.Token.victim',name:'Victim',actor:victim};docs.set(token.uuid,token);game.user.targets=new Set([token]);return {caster,victim,other,weapon,token,owner};
}
function effect(parent,row){const e={...structuredClone(row),documentName:'ActiveEffect',parent,id:'e'+serial++,get actor(){return parent.documentName==='Actor'?parent:parent.parent;},async update(changes){assign(this,changes);},async delete(){parent.effects=parent.effects.filter(row=>row!==this);docs.delete(this.uuid);},toObject(){const {parent,actor,update,delete:del,toObject,...data}=this;return structuredClone(data);}};e.uuid=parent.uuid+'.ActiveEffect.'+e.id;e._source={duration:structuredClone(e.duration)};parent.effects.push(e);docs.set(e.uuid,e);return e;}
async function bind(f,level=3){const row=f.weapon.system.sacred.runes[0];row.level=level;row.invested=row.current=level;await syncPermanentRunes(f.weapon);return f.weapon.effects[0];}
async function attack(f,{kind='attack',target=15}={}){await rollUnder({actor:f.caster,item:f.weapon,kind,label:'Hammer attack',target});return cards.at(-1);}
async function apply(message,target,answers){const hit=message.flags[S].weaponHitEffects[key];return applyTransformation(target,key,{source:await foundry.utils.fromUuid(hit.sourceUuid),context:{...hit.context,messageId:message.id},...(answers?{preselectedAnswers:answers}:{skipDialog:true})});}

test('permanent inscription installs only its weapon marker once, never incapacitates the bearer and does not offer premature victim links',async()=>{
 const f=setup();await Promise.all([bind(f,4),syncPermanentRunes(f.weapon),syncPermanentRunes(f.weapon)]);assert.equal(f.weapon.effects.length,1);const marker=f.weapon.effects[0];assert.equal(marker.transfer,false);assert.equal(marker.duration.value,null);assert.deepEqual(marker.statuses,[]);assert.deepEqual(marker.system.changes,[]);assert.equal(marker.flags[S].transformation.runeLevel,4);assert.equal(f.caster.effects.length,0);assert.equal(transformationLinks(marker),'');
});
test('a real successful weapon attack offers its shock and snapshots rank, targets and source; parries, failures and invalid inscriptions do not',async()=>{
 const f=setup();await bind(f,3);const m=await attack(f);assert.match(m.content,/data-transformation-key="holy-thuuldom-anvil-shock:anvil-shock:0#shock"/);assert.equal(m.flags[S].weaponHitEffects[key].runeLevel,3);assert.equal(m.flags[S].transformationTargets[key][0].actorUuid,f.victim.uuid);assert.ok(m.content.includes('data-action="damage"'));
 const parry=await attack(f,{kind:'parry'});assert.equal(parry.flags?.[S]?.weaponHitEffects,undefined);die=20;const failure=await attack(f);assert.equal(failure.flags?.[S]?.weaponHitEffects,undefined);die=4;
 const marker=f.weapon.effects[0];marker.disabled=true;assert.equal((await attack(f)).flags?.[S]?.weaponHitEffects,undefined);marker.disabled=false;f.weapon.system.sacred.runes[0].current=0;assert.equal(weaponHitOffers(f.weapon,f.caster,{success:true,kind:'attack'}).length,0);
});
test('all five inscription ranks apply their actual bilingual penalty or native incapacity, for exactly the current and following rounds',async()=>{
 for(const c of ['fr','en'])for(let level=1;level<=5;level++){
  const f=setup(c);await bind(f,level);const m=await attack(f),hit=m.flags[S].weaponHitEffects[key];const result=await apply(m,f.victim);assert.ok(result);const e=f.victim.effects[0];assert.equal(e.flags[S].transformation.runeLevel,level);assert.doesNotMatch(e.description,/undefined|TRUDVANG\./);assert.equal(e.duration.value,level===5?3:2);assert.deepEqual(e.statuses,level<=3?[]:['stun']);assert.equal(e.system.changes[0]?.value,level<=3?String(-2*level):undefined);assert.equal(f.victim.canPerformAction(),level<=3);
  game.combat.round=4;assert.ok(itemEffectRemainingSeconds(e,{time:100,combat:game.combat})>0);game.combat.round=level===5?6:5;assert.equal(itemEffectRemainingSeconds(e,{time:100,combat:game.combat}),0);assert.equal(weaponHitExpired(key,hit,{time:100,combat:game.combat}),true);
 }
});
test('one attack cannot be applied twice to the same victim, including concurrent attempts, while a later attack renews without stacking penalties',async()=>{
 const f=setup();await bind(f);const first=await attack(f);const attempts=await Promise.allSettled([apply(first,f.victim),apply(first,f.victim)]);assert.equal(attempts.filter(a=>a.status==='fulfilled').length,1);assert.equal(f.victim.effects.length,1);
 game.time.worldTime=103;game.combat.round=4;const second=await attack(f);game.time.worldTime=104;await apply(second,f.victim,{runeLevel:3,duration:'100 years'});assert.equal(f.victim.effects.length,1);assert.equal(f.victim.effects[0].start.time,103);assert.equal(f.victim.effects[0].start.round,4);assert.equal(f.victim.effects[0].duration.value,2);assert.equal(f.victim.effects[0].system.changes.length,1);
});
test('a rank change after the attack cannot change that hit, and old or unproven hits cannot restart a shock',async()=>{
 const f=setup();await bind(f,2);const m=await attack(f);await bind(f,5);await apply(m,f.victim);assert.equal(f.victim.effects[0].system.changes[0].value,'-4');
 await assert.rejects(applyTransformation(f.other,key,{skipDialog:true}));game.combat.round=5;await assert.rejects(apply(m,f.other));
});
test('GM delegation and target editing work from the real weapon hit card, even after the source item effect no longer exists',async()=>{
 const f=setup();await bind(f);const m=await attack(f);f.victim.canUserModify=user=>Boolean(user.isGM);
 const changed=await updateEffectTargetsOnGM({messageId:m.id,userId:f.owner.id,key,add:[f.token.uuid]});assert.equal(changed.status,'unchanged');
 const sourceUuid=m.flags[S].weaponHitEffects[key].sourceUuid;docs.delete(sourceUuid);
 const r=await applyEffectForCasterOnGM({messageId:m.id,userId:f.owner.id,key,sourceUuid,tokenUuid:f.token.uuid,answers:{runeLevel:3,duration:'2 rounds'}});assert.equal(r.status,'applied');assert.equal(f.victim.effects.length,1);
});
test('the actual expiration manager deletes the victim shock at its round boundary and restores action access without removing the weapon rune',async()=>{
 const {expireAppliedEffects}=await import('../modules/effects.mjs');
 for(const level of [3,5]){
  const f=setup();await bind(f,level);const m=await attack(f);await apply(m,f.victim);
  game.combat.round=level===5?5:4;await expireAppliedEffects({time:100,combat:game.combat,managedClocksOnly:true});assert.equal(f.victim.effects.length,1);
  game.combat.round++;await expireAppliedEffects({time:100,combat:game.combat,managedClocksOnly:true});assert.equal(f.victim.effects.length,0);assert.equal(f.victim.canPerformAction(),true);assert.equal(f.weapon.effects.length,1);
 }
});
