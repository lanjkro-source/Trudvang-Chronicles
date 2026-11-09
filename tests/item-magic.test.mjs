import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {itemUseBonuses,intrinsicIntegrityValue,itemProtectionModifiers} from '../modules/rules/item-magic.mjs';
import {changesFromRules} from '../modules/rules/effect-rule-changes.mjs';
import {resolveArmorProfile,resolveEquipment} from '../modules/rules/equipment-resolver.mjs';

const S='trudvang-chronicles';
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>''}},utils:{deepClone:structuredClone},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}}};
globalThis.document={createElement:()=>({set textContent(value){this.value=String(value).replaceAll('<','&lt;');},get innerHTML(){return this.value;}})};
let warnings=0;
globalThis.ui={notifications:{warn:()=>warnings++}};
const lang=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url))),localize=key=>key.split('.').reduce((v,k)=>v?.[k],lang)??key;
globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize,format:(key,data)=>localize(key).replace(/\{(\w+)\}/g,(_,key)=>data[key])}};
const {applyTransformation}=await import('../modules/transformations.mjs');
const {blessingDialog}=await import('../modules/blessing-dialog.mjs');
const {applyDamageToDefenseItem}=await import('../modules/damage-application.mjs');
function fixture(type='weapon'){
 let created;
 const actor={uuid:'Actor.a',documentName:'Actor',name:'A',items:[],effects:[],canUserModify:()=>true};
 const item={uuid:'Actor.a.Item.i',id:'i',parent:actor,type,name:'Hache',system:{quantity:1,breach:{value:50,max:80}},effects:[],canUserModify:()=>true,createEmbeddedDocuments:async(_,data)=>(created=data[0],[])};
 actor.items=[item];return {actor,item,get created(){return created;}};
}

test('enchantment improvements affect only the destination item, including VP through integrity and no permanent scalar writes',async()=>{
 const f=fixture(),key='vitner-vitner-craft:enchant-object:2#effect';
 const prior=structuredClone(f.item.system);
 await applyTransformation(f.actor,key,{destinationItem:f.item,counts:[2,1,0,0,0,2,2],skipDialog:true});
 const rows=f.created.system.changes;
 assert.equal(rows.find(c=>c.key==='system.damageBonus').value,'3');
 assert.equal(rows.find(c=>c.key==='system.breach.value').value,'30');
 assert.equal(rows.find(c=>c.key==='system.breach.max').value,'30');
 assert.equal(rows.find(c=>c.key==='system.transformation.objectUse').value,'4');
 assert.deepEqual(f.created.duration,{value:20,units:'rounds'});
 assert.deepEqual(f.item.system,prior);assert.equal(f.actor.effects.length,0);
 assert.match(f.created.flags[S].transformation.summary,/VC\/SV \+4/);
 assert.match(f.created.description,/VP \+3/);
 const copy={documentName:'ActiveEffect',...structuredClone(f.created)};
 await applyTransformation(f.actor,key,{destinationItem:f.item,source:copy,counts:[9,9,9,9,9,9,9],skipDialog:true});
 assert.deepEqual(f.created.system.changes,copy.system.changes,'resolved copies never reapply object improvements');
 assert.deepEqual(f.created.duration,copy.duration);
});

test('both object curses preserve weapon and armor distinctions; extra targets keep the base duration',async()=>{
 for(const id of ['vitner-witchcraft:curse-object:3','holy-joaringfaith-curses-of-sonntag:curse-object:3'])for(const type of ['weapon','armor']){
  const f=fixture(type);await applyTransformation(f.actor,id+'#base',{destinationItem:f.item,counts:[9,9,9,0,1],skipDialog:true});
  assert.deepEqual(f.created.duration,{value:5,units:'rounds'});
  assert.equal(f.created.system.changes.find(c=>c.key==='system.transformation.objectUse').value,'-2');
  assert.equal(f.created.system.changes.find(c=>c.key==='system.damageBonus')?.value,type==='weapon'?'-1':undefined);
  assert.equal(f.created.system.changes.find(c=>c.key==='system.transformation.itemProtection')?.value,type==='armor'?'-1':undefined);
 }
});

test('appearance, softening and reinforcement are separate; combined alteration requires its purchased option',async()=>{
 const f=fixture('armor'),id='vitner-vitner-of-objects:alter-object:7';
 for(const variant of ['appearance','physical']){
  await applyTransformation(f.actor,id+'#'+variant,{destinationItem:f.item,counts:[0,0,0,0,0,0,3],preselectedAnswers:{duration:'5 minutes',effectInput:'Souple'}});
  assert.equal(f.created.system.changes.length,0);assert.match(f.created.description,/Souple/);
 }
 await applyTransformation(f.actor,id+'#properties',{destinationItem:f.item,counts:[0,0,0,0,0,0,2],skipDialog:true});
 assert.equal(f.created.system.changes.find(c=>c.key==='system.breach.value').value,'30');
 const before=warnings;
 assert.equal(await applyTransformation(f.actor,id+'#combined',{destinationItem:f.item,skipDialog:true}),null);assert.equal(warnings,before+1);
 await applyTransformation(f.actor,id+'#combined',{destinationItem:f.item,counts:[0,0,0,0,0,0,0,1],skipDialog:true});
 assert.equal(f.created.system.changes.find(c=>c.key==='system.breach.value').value,'10');
});

test('item-only spells reject actor drops; non-equipment has no fabricated integrity, damage or protection fields',async()=>{
 const f=fixture('gear');delete f.item.system.breach;
 assert.equal(await applyTransformation(f.actor,'vitner-vitner-craft:enchant-object:2#effect',{skipDialog:true}),null);
 await applyTransformation(f.actor,'vitner-vitner-craft:enchant-object:2#effect',{destinationItem:f.item,skipDialog:true});
 assert.deepEqual(f.created.system.changes.map(c=>c.key),['system.transformation.objectUse']);
});

test('all roll dialogs offer optional item use with both signs and recheck the current inventory on validation',async()=>{
 const f=fixture();const e={id:'e',uuid:'Effect.e',name:'Curse',system:{changes:changesFromRules({objectUse:-2})}};f.item.effects=[e];
 let checked=false;
 const root={querySelector:()=>({checked})};
 class Base{static wait(config){return config.buttons[0].callback({}, {form:root},{element:root});}}
 const Dialog=blessingDialog(Base,f.actor),config=()=>({buttons:[{action:'roll',callback:()=>({modifier:1})}]});
 assert.equal((await Dialog.wait(config())).modifier,1);
 checked=true;let answer=await Dialog.wait(config());assert.equal(answer.modifier,-1);assert.match(answer.blessing.label,/Hache/);
 e.disabled=true;assert.equal((await Dialog.wait(config())).modifier,1);e.disabled=false;
 checked=false;
 const WeaponDialog=blessingDialog(Base,f.actor,'modifier',{item:f.item});
 assert.equal((await WeaponDialog.wait(config())).modifier,-1,'known weapon use enforces its curse even without an optional checkbox');
 const other={...f.item,id:'other',uuid:'Item.other',effects:[]};
 assert.equal(blessingDialog(Base,f.actor,'modifier',{item:other}),Base,'another weapon never inherits this curse');
 f.actor.items=[];assert.equal((await Dialog.wait(config())).modifier,1);
});

test('local armor penalties appear in resolution and protection never goes below zero; temporary integrity stays out of persisted balances',()=>{
 const f=fixture('armor');f.item.effects=[{id:'e',name:'Curse',system:{changes:changesFromRules({itemProtection:-2})}}];
 assert.equal(resolveArmorProfile({item:f.item}).protection.value,3);
 assert.equal(itemProtectionModifiers(f.item)[0].amount,-2);
 f.item.type='weapon';assert.equal(resolveEquipment({item:f.item}).characteristics.protection.value,3);
 f.item.system.breach.value=0;assert.equal(resolveEquipment({item:f.item}).characteristics.protection.value,0);
 f.item.system.breach.value=80;f.item._source={system:{breach:{value:50,max:80}}};
 assert.equal(intrinsicIntegrityValue(f.item,68),38);
 const e=f.item.effects[0];e.system.changes=changesFromRules({objectUse:3});
 assert.equal(itemUseBonuses(f.actor)[0].value,3);f.item.system.quantity=0;assert.deepEqual(itemUseBonuses(f.actor),[]);
});

test('repeated real defensive hits never absorb a temporary integrity bonus into the intrinsic weapon',async()=>{
 const item={isOwner:true,type:'weapon',_source:{system:{breach:{value:50,max:80}}},system:{breach:{value:80,max:110}},effects:[],
  async update(data){this._source.system.breach.value=data['system.breach.value'];this.system.breach.value=this._source.system.breach.value+30;}};
 await applyDamageToDefenseItem({item,damage:20});
 assert.equal(item.system.breach.value,68);assert.equal(item._source.system.breach.value,38);
 await applyDamageToDefenseItem({item,damage:20});
 assert.equal(item.system.breach.value,55);assert.equal(item._source.system.breach.value,25);
 item.system.breach.value=item._source.system.breach.value;
 assert.equal(item.system.breach.value,25,'ending the enchantment reveals the damaged intrinsic balance, never an inflated balance');
});
