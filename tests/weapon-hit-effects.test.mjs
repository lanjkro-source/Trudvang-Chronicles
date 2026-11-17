import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import Handlebars from 'handlebars';
import {weaponDamageEffects} from '../modules/rules/weapon-hit-effects.mjs';
import {itemEffectRemainingSeconds} from '../modules/rules/effect-duration.mjs';
const S='trudvang-chronicles',id='holy-thuuldom-anvil-shock:anvil-shock:0',key=id+'#shock',docs=new Map(),messages=new Map(),cards=[];
const languages=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync(new URL('../lang/'+c+'.json',import.meta.url)))]));let die=4,serial=0,damageDice=[];
const tpl=Handlebars.compile(fs.readFileSync(new URL('../templates/chat/roll-card.hbs',import.meta.url),'utf8'));Handlebars.registerHelper('localize',(key,options)=>game.i18n.format(key,options.hash));Handlebars.registerHelper('eq',(a,b)=>a===b);Handlebars.registerHelper('concat',(...xs)=>xs.slice(0,-1).join(''));
class NativeEffect{};NativeEffect.implementation={getEffectStart:()=>({time:game.time.worldTime,combat:game.combat?.id,round:game.combat?.round})};
globalThis.foundry={documents:{Actor:class{},ActiveEffect:NativeEffect},applications:{api:{DialogV2:{wait:async()=>false}},handlebars:{renderTemplate:async(path,card)=>Handlebars.compile(fs.readFileSync(new URL('../'+path.replace('systems/trudvang-chronicles/',''),import.meta.url),'utf8'))(card)}},utils:{deepClone:structuredClone,randomID:()=>crypto.randomUUID(),fromUuid:async uuid=>docs.get(uuid)},data:{ActiveEffectTypeDataModel:class{},operators:{ForcedReplacement:{create:v=>v},ForcedDeletion:{create:()=>null}}}};
globalThis.Hooks={call:()=>true};globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('"','&quot;');}})};globalThis.ui={notifications:{warn:()=>{}}};globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=this.formula==='1d20'?die:(damageDice.shift()??4);return this;}};
function assign(o,values){for(const [path,value]of Object.entries(values)){const keys=path.split('.');let target=o;for(const k of keys.slice(0,-1))target=target[k]??={};target[keys.at(-1)]=structuredClone(value);}}
globalThis.ChatMessage={getSpeaker:()=>({}),async create(data){const m={...data,id:'m'+serial++,author:game.user,getFlag(_s,key){return this.flags?.[S]?.[key];},async update(changes){assign(this,changes);}};messages.set(m.id,m);cards.push(m);return m;}};
const {TrudvangActor}=await import('../modules/documents/actor.mjs');
const {syncPermanentRunes}=await import('../modules/sacred-objects.mjs');
const {rollUnder,rollDamage}=await import('../modules/dice.mjs');const {applyTransformation,transformationLinks}=await import('../modules/transformations.mjs');
const {applyChatApplication}=await import('../modules/chat-application.mjs');
function setup(c='fr'){
 docs.clear();messages.clear();cards.length=0;die=4;serial=0;damageDice=[];const gm={id:'gm',isGM:true,active:true},owner={id:'owner',active:true},users=new Map([[gm.id,gm],[owner.id,owner]]);users.activeGM={isSelf:true};const lookup=k=>k.split('.').reduce((v,k)=>v?.[k],languages[c])??k;
 globalThis.game={user:gm,users,messages,actors:[],scenes:[],time:{worldTime:100},combat:{id:'combat',started:true,round:3},i18n:{lang:c,localize:lookup,format:(k,d={})=>String(lookup(k)).replace(/\{(\w+)\}/g,(_,k)=>d[k])}};
 function actor(name){const a={uuid:'Actor.'+name,name,documentName:'Actor',type:'character',isOwner:true,items:[],effects:[],system:{protection:0,modifiers:{},resources:{body:{value:100,current:100,max:100}}},canUserModify:()=>true,testUserPermission:()=>true,getActiveTokens:()=>[],async createEmbeddedDocuments(type,rows){assert.equal(type,'ActiveEffect');return rows.map(row=>effect(a,row));}};a._source={system:structuredClone(a.system)};a.update=async data=>{assign(a,data);assign(a._source,data);a.system.resources.body.current=a.system.resources.body.value;};a.createTrudvangEffect=TrudvangActor.prototype.createTrudvangEffect;a._createTrudvangEffectNow=TrudvangActor.prototype._createTrudvangEffectNow;a.canPerformAction=TrudvangActor.prototype.canPerformAction;Object.defineProperty(a,'statuses',{get:()=>new Set(a.effects.filter(e=>!e.disabled).flatMap(e=>e.statuses??[]))});docs.set(a.uuid,a);game.actors.push(a);return a;}
 const caster=actor('caster'),victim=actor('victim'),other=actor('other');
 const weapon={uuid:caster.uuid+'.Item.hammer',name:'Hammer',type:'weapon',parent:caster,actor:caster,isOwner:true,canUserModify:()=>true,effects:[],system:{damage:'1d10',openRoll:9,strengthApplies:false,equipped:true,damageQualification:{type:'bludgeoning'},sacred:{enabled:true,creatorUuid:caster.uuid,runes:[{id:'inscription',sourceId:id,level:3,invested:3,current:3,uses:0}]}},async createEmbeddedDocuments(type,rows){assert.equal(type,'ActiveEffect');return rows.map(row=>effect(this,row));}};docs.set(weapon.uuid,weapon);caster.items.push(weapon);
 const token={documentName:'Token',id:'target',uuid:'Scene.s.Token.victim',name:'Victim',actor:victim};docs.set(token.uuid,token);game.user.targets=new Set([token]);return {caster,victim,other,weapon,token,owner};
}
function effect(parent,row){const e={...structuredClone(row),documentName:'ActiveEffect',parent,id:'e'+serial++,get actor(){return parent.documentName==='Actor'?parent:parent.parent;},async update(changes){assign(this,changes);},async delete(){parent.effects=parent.effects.filter(row=>row!==this);docs.delete(this.uuid);},toObject(){const {parent,actor,update,delete:del,toObject,...data}=this;return structuredClone(data);}};e.uuid=parent.uuid+'.ActiveEffect.'+e.id;e._source={duration:structuredClone(e.duration)};parent.effects.push(e);docs.set(e.uuid,e);return e;}
async function bind(f,level=3){const row=f.weapon.system.sacred.runes[0];row.level=level;row.invested=row.current=level;await syncPermanentRunes(f.weapon);return f.weapon.effects[0];}
async function attack(f,{kind='attack',target=15}={}){await rollUnder({actor:f.caster,item:f.weapon,kind,label:'Hammer attack',target});return cards.at(-1);}
async function damage(f,values=[9,4]){damageDice=[...values];const {message}=await rollDamage({actor:f.caster,item:f.weapon,context:{automatic:true,returnMessage:true}});return message;}
function apply(message,target,extra={}){return applyChatApplication({messageId:message.id,userId:game.user.id,actorUuid:target.uuid,channel:'body',...extra});}

test('permanent inscription installs only its weapon marker once, never incapacitates the bearer and does not offer premature victim links',async()=>{
 const f=setup();await Promise.all([bind(f,4),syncPermanentRunes(f.weapon),syncPermanentRunes(f.weapon)]);assert.equal(f.weapon.effects.length,1);const marker=f.weapon.effects[0];assert.equal(marker.transfer,false);assert.equal(marker.duration.value,null);assert.deepEqual(marker.statuses,[]);assert.deepEqual(marker.system.changes,[]);assert.equal(marker.flags[S].transformation.runeLevel,4);assert.equal(f.caster.effects.length,0);assert.equal(transformationLinks(marker),'');
});
test('attack cards have no shock button or second target list; actual exploded damage shows only the compact trigger',async()=>{
 const f=setup();await bind(f,3);const attackCard=await attack(f);assert.doesNotMatch(attackCard.content,/data-transformation-key/);assert.equal(attackCard.flags?.[S]?.weaponHitEffects,undefined);
 const m=await damage(f);assert.match(m.content.replaceAll('&#x27;',String.fromCharCode(39)),/Choc de l'enclume déclenché !/);assert.equal((m.content.match(/data-damage-targets/g)??[]).length,1);assert.doesNotMatch(m.content,/data-transformation-key/);assert.equal(m.flags[S].weaponDamageEffects.length,1);
 const ordinary=await damage(f,[8]);assert.doesNotMatch(ordinary.content,/déclenché/);assert.equal(ordinary.flags[S].weaponDamageEffects,undefined);
 f.weapon.system.damage='2d10';const high=await damage(f,[8,8]);assert.equal(high.flags[S].weaponDamageEffects,undefined,'two base dice and a large total are not an open roll');
 f.weapon.system.damage='1d10';f.weapon.system.openRoll=0;const maximum=await damage(f,[10]);assert.equal(maximum.flags[S].weaponDamageEffects,undefined,'maximum die value without open rolls does not trigger');
 f.weapon.system.openRoll=9;const chain=await damage(f,[9,10,4]);assert.equal(chain.flags[S].weaponDamageEffects.length,1,'multiple explosions still offer only one shock');
});
test('both body-damage choices apply a shock once, while defense-item damage never affects the bearer',async()=>{
 for(const ignoreArmor of [false,true]){const f=setup();await bind(f,3);f.victim.system.protection=5;const m=await damage(f);const r=await apply(m,f.victim,{ignoreArmor});assert.equal(r.status,'applied');assert.equal(f.victim.effects.length,1);assert.equal(f.victim.effects[0].system.changes[0].value,'-6');assert.equal(f.victim.system.resources.body.current,ignoreArmor?87:92);assert.equal((await apply(m,f.victim,{ignoreArmor:!ignoreArmor})).status,'alreadyApplied');assert.equal(f.victim.effects.length,1);}
 const f=setup();await bind(f);const shield={uuid:f.victim.uuid+'.Item.shield',name:'Shield',type:'shield',isOwner:true,parent:f.victim,system:{equipped:true,breach:{value:50,max:50}},async update(data){assign(this,data);}};docs.set(shield.uuid,shield);f.victim.items.push(shield);
 const m=await damage(f);const r=await apply(m,f.victim,{channel:'defense',itemUuid:shield.uuid});assert.equal(r.status,'applied');assert.equal(f.victim.effects.length,0);assert.equal(f.victim.system.resources.body.current,100);assert.ok(shield.system.breach.value<50);
});
test('one shared damage target list applies the shock independently to every recipient with their own application time',async()=>{
 const f=setup();await bind(f);const token={documentName:'Token',uuid:'Scene.s.Token.other',actor:f.other,name:'Other'};docs.set(token.uuid,token);game.user.targets.add(token);
 const m=await damage(f);assert.equal(m.flags[S].damageTargets.length,2);assert.equal(f.victim.effects.length,0);assert.equal(f.other.effects.length,0);
 await apply(m,f.victim);game.time.worldTime=107;game.combat.round=4;await apply(m,f.other,{ignoreArmor:true});assert.equal(f.victim.effects.length,1);assert.equal(f.other.effects.length,1);assert.equal(f.victim.effects[0].start.time,100);assert.equal(f.other.effects[0].start.time,107);assert.equal(m.flags[S].applications.length,2);
});
test('all five ranks are frozen on the damage card and start their real duration only when each recipient takes damage',async()=>{
 for(const c of ['fr','en'])for(let rank=1;rank<=5;rank++){const f=setup(c);await bind(f,rank);const m=await damage(f);const snapshot=m.flags[S].weaponDamageEffects[0];assert.equal(snapshot.runeLevel,rank);await bind(f,rank===5?1:5);
 game.time.worldTime=150;game.combat.round=8;await apply(m,f.victim);const e=f.victim.effects[0];assert.equal(e.start.time,150);assert.equal(e.start.round,8);assert.equal(e.duration.value,rank===5?3:2);assert.deepEqual(e.statuses,rank<=3?[]:['stun']);assert.equal(e.system.changes[0]?.value,rank<=3?String(-2*rank):undefined);assert.equal(f.victim.canPerformAction(),rank<=3);assert.doesNotMatch(e.description,/undefined|TRUDVANG\./);
 game.combat.round=rank===5?11:10;const {expireAppliedEffects}=await import('../modules/effects.mjs');await expireAppliedEffects({time:150,combat:game.combat,managedClocksOnly:true});assert.equal(f.victim.effects.length,0);assert.equal(f.weapon.effects.length,1);
 }
});
test('a retry after card-update failure does not deal damage or apply a shock twice, including simultaneous clicks',async()=>{
 const f=setup();await bind(f);const m=await damage(f),original=m.update;let fail=true;m.update=async changes=>{if(fail){fail=false;throw Error('network');}return original.call(m,changes);};
 await assert.rejects(apply(m,f.victim),/network/);assert.equal(f.victim.system.resources.body.current,87);assert.equal(f.victim.effects.length,1);
 const results=await Promise.all([apply(m,f.victim),apply(m,f.victim)]);assert.deepEqual(results.map(r=>r.status),['applied','alreadyApplied']);assert.equal(f.victim.system.resources.body.current,87);assert.equal(f.victim.effects.length,1);
});
test('a failed effect write can be retried without spending health twice; a new damage card renews the same shock',async()=>{
 const f=setup();await bind(f);const m=await damage(f),create=f.victim.createTrudvangEffect;let fail=true;f.victim.createTrudvangEffect=async function(data){if(fail){fail=false;throw Error('effect write');}return create.call(this,data);};
 await assert.rejects(apply(m,f.victim),/effect write/);assert.equal(f.victim.system.resources.body.current,87);await apply(m,f.victim);assert.equal(f.victim.system.resources.body.current,87);assert.equal(f.victim.effects.length,1);
 const next=await damage(f);game.time.worldTime=155;game.combat.round=9;await apply(next,f.victim);assert.equal(f.victim.effects.length,1);assert.equal(f.victim.effects[0].start.time,155);
});
test('invalid or disabled inscriptions cannot trigger, and the old manual effect path is refused',async()=>{
 const f=setup();await bind(f);const marker=f.weapon.effects[0];marker.disabled=true;assert.equal(weaponDamageEffects(f.weapon,f.caster,{explosions:1}).length,0);marker.disabled=false;f.weapon.system.sacred.runes[0].current=0;assert.equal(weaponDamageEffects(f.weapon,f.caster,{explosions:2}).length,0);
 await assert.rejects(applyTransformation(f.victim,key,{skipDialog:true}));
});
test('normal permanent-rune reconciliation refreshes an existing marker rule text without duplicating it or changing its level',async()=>{
 const f=setup();await bind(f,3);const marker=f.weapon.effects[0];marker.description='Outdated trigger rule';await syncPermanentRunes(f.weapon);assert.equal(f.weapon.effects.length,1);assert.equal(f.weapon.effects[0].id,marker.id);assert.equal(marker.flags[S].transformation.runeLevel,3);assert.match(marker.description,/jet ouvert/);
});
test('every d20 test card shares signed outcomes, automatic one/twenty labels and no duplicate success margin',async()=>{
 for(const c of ['fr','en'])for(const kind of ['skill','situation','parry','concentration','spell','divine','rune']){
  const f=setup(c);
  for(const [value,target,success,margin]of [[4,9,true,'+5'],[15,9,false,'-6'],[1,0,true,''],[20,40,false,'']]){
   die=value;await rollUnder({actor:f.caster,kind,label:'Test',target,targetName:'Should not appear'});const m=cards.at(-1),html=m.content.match(/<p class="outcome[\s\S]*?<\/p>/)[0];
   assert.ok(html.includes(success?'success':'failure'));assert.doesNotMatch(html,/Should not appear/);
   if(margin)assert.ok(html.includes('('+margin+')'),html);else{assert.match(html,c==='fr'?/auto\./:/Automatic/);assert.doesNotMatch(html,/\([+-]\d+\)/);}
   assert.doesNotMatch(m.content,/success-margin/);
  }
 }
});
test('attack target rows also hide margins for automatic results while keeping individual names and colors',async()=>{
 const f=setup();die=1;await rollUnder({actor:f.caster,kind:'attack',label:'Attack',target:10,attackTargets:[{name:'One',modifier:0},{name:'Two',modifier:0}]});
 const html=cards.at(-1).content.match(/<ul class="attack-target-results">[\s\S]*?<\/ul>/)[0];assert.match(html,/One/);assert.match(html,/Two/);assert.match(html,/Succès auto\./);assert.doesNotMatch(html,/\([+-]\d+\)/);
});
