import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const get=(object,path)=>path.split('.').reduce((v,k)=>v?.[k],object);
const set=(object,path,value)=>{const parts=path.split('.'),last=parts.pop();parts.reduce((v,k)=>v[k]??={},object)[last]=value;};
class Model{constructor(data,{parent}={}){Object.assign(this,structuredClone(data));this.parent=parent;}toObject(){return structuredClone(Object.fromEntries(Object.entries(this).filter(([key])=>key!=='parent')));}prepareDerivedData(){}static defineSchema(){return {};}}
class Field{constructor(options){this.options=options;}}
let models;
const applications=[];
class CoreItem{
 constructor(source,parent){this._source=structuredClone(source);this.type=source.type;this.name=source.name;this.id='i';this.uuid='Actor.a.Item.i';this.documentName='Item';this.parent=parent;this.isOwner=true;this.effects=[];this.prepareData();}
 prepareData(){this.system=new models[this.type](this._source.system,{parent:this});this.effects=(this._source.effects??[]).map((row,i)=>({...structuredClone(row),id:row._id??'e'+i,uuid:this.uuid+'.ActiveEffect.'+(row._id??'e'+i),parent:this,active:false}));this.prepareEmbeddedDocuments();this.system.prepareDerivedData();this.prepareDerivedData();}
 prepareEmbeddedDocuments(){}
 prepareDerivedData(){}
 getFlag(){return null;}canUserModify(){return true;}
 async createEmbeddedDocuments(_,rows){this._source.effects??=[];this._source.effects.push(...structuredClone(rows));this.prepareData();return this.effects.slice(-rows.length);}
 async update(data){const merge=(target,changes)=>{for(const [key,value] of Object.entries(changes))if(key.includes('.'))set(target,key,value);else if(value&&typeof value==='object'&&!Array.isArray(value))merge(target[key]??={},value);else target[key]=value;};merge(this._source,data);this.prepareData();}
}
class CoreEffect{
 static applyChange(item,change,options){
  assert.equal(options.modifyTarget,true);assert.equal(change.effect.parent,item);
  applications.push(change.key);
  const before=get(item,change.key),value=Number(change.value);
  const next=change.type==='add'?Number(before??0)+value:change.type==='subtract'?Number(before??0)-value:change.type==='multiply'?Number(before)*value:change.type==='override'?(Number.isFinite(value)?value:change.value):before;
  set(item,change.key,next);return {[change.key]:next};
 }
}
CoreEffect.implementation=CoreEffect;CoreEffect.getEffectStart=()=>({time:0});
class Sheet{constructor({document}){this.document=this.item=document;this.isEditable=true;this.element={};}async _prepareContext(){return {};}}
globalThis.foundry={abstract:{TypeDataModel:Model},data:{ActiveEffectTypeDataModel:Model,fields:new Proxy({},{get:()=>Field})},documents:{Item:CoreItem,ActiveEffect:CoreEffect},
 applications:{handlebars:{renderTemplate:async()=>''},api:{HandlebarsApplicationMixin:Base=>Base},sheets:{ItemSheetV2:Sheet},ux:{TextEditor:{implementation:{enrichHTML:async value=>value}}}},utils:{deepClone:structuredClone,getProperty:get,setProperty:set,expandObject:flat=>{const result={};for(const [key,value] of Object.entries(flat))set(result,key,value);return result;}}};
globalThis.document={createElement:()=>({set textContent(value){this.value=String(value).replaceAll('<','&lt;');},get innerHTML(){return this.value;}})};
const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url))),localize=key=>get(language,key)??key;
globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize,format:(key,data)=>localize(key).replace(/\{(\w+)\}/g,(_,key)=>data[key])}};
globalThis.ui={notifications:{warn:()=>{}}};
const {WeaponData,ShieldData,ArmorData}=await import('../modules/data-models.mjs');models={weapon:WeaponData,shield:ShieldData,armor:ArmorData};
const {TrudvangItem}=await import('../modules/documents/item.mjs');
const {TrudvangItemSheet}=await import('../modules/sheets/item-sheet.mjs');
const {applyTransformation}=await import('../modules/transformations.mjs');
const {prepareDamageRoll}=await import('../modules/rules/damage-roll-resolver.mjs');
const {prepareEquipmentInspection}=await import('../modules/equipment-inspection.mjs');
const {blessingDialog}=await import('../modules/blessing-dialog.mjs');
const {applyDamageToDefenseItem}=await import('../modules/damage-application.mjs');
const actor={documentName:'Actor',type:'character',uuid:'Actor.a',name:'A',system:{effective:{traits:{}},traits:{},details:{},modifiers:{}},items:[],effects:[],isOwner:true,canUserModify:()=>true,getActiveTokens:()=>[]};
const source=()=>({type:'weapon',name:'Épée',system:{description:'',source:'',category:'oneHandedLight',quantity:1,breach:{value:50,max:80},damage:'1d10',damageBonus:0,openRoll:10,weaponActions:3,combatPointBonus:1,hand:'weapon',strengthApplies:false,weight:1},effects:[]});

test('the real item preparation/model/sheet/damage pipeline displays current enchanted values without altering their source',async()=>{
 const item=new TrudvangItem(source(),actor);actor.items=[item];
 await applyTransformation(actor,'vitner-vitner-craft:enchant-object:2#effect',{destinationItem:item,skipDialog:true});
 assert.equal(item.system.damageBonus,1);assert.deepEqual(item.system.breach,{value:60,max:90});assert.equal(item.system.protection,6);
 assert.equal(item.system.combatPointBonus,1,'a VC bonus is not a CP reserve bonus');
 assert.equal(item._source.system.damageBonus,0);assert.deepEqual(item._source.system.breach,{value:50,max:80});
 const profile=prepareDamageRoll({item});assert.equal(profile.fixedModifier,1);assert.match(profile.rows.find(row=>row.labelKey==='TRUDVANG.DamageRoll.ItemEffects').source,/Enchantement/);
 const sheet=new TrudvangItemSheet({document:item}),context=await sheet._prepareContext({});
 assert.equal(context.system.damageBonus,1);assert.equal(context.system.breach.value,60);assert.equal(context.system.breach.max,90);assert.equal(context.system.protection,6);
 assert.equal(context.equipmentInspection.stats.find(row=>row.key==='protection').comparison,'5 → 6');
 assert.equal(context.equipmentInspection.stats.find(row=>row.key==='integrity').comparison,'50/80 → 60/90');
 const damage=context.equipmentInspection.stats.find(row=>row.key==='damage');assert.equal(damage.modified,true);assert.match(damage.comparison,/\+1/);assert.ok(damage.steps.some(step=>step.label==='Enchantement d’objet'));
 assert.ok(context.equipmentInspection.impacts.some(row=>row.key==='objectUse'&&row.value==='+2'&&row.mode==='conditional'));
 for(let i=0;i<3;i++){item.prepareData();assert.equal(item.system.damageBonus,1);assert.equal(item.system.breach.value,60);}
 for(let i=0;i<3;i++){item.prepareEmbeddedDocuments();item.system.prepareDerivedData();item.prepareDerivedData();assert.equal(item.system.damageBonus,1);assert.equal(item.system.breach.value,60);assert.equal(item.system.protection,6);}
 item._source.effects[0].disabled=true;item.prepareData();assert.equal(item.system.damageBonus,0);assert.equal(item.system.breach.value,50);assert.equal(prepareEquipmentInspection(item).modified,false);
 item._source.effects=[];item.prepareData();assert.equal(prepareDamageRoll({item}).fixedModifier,0);
});

test('item-local preparation honors phase, priority and all scalar fields without applying transferred actor effects',()=>{
 const data=source();data.effects=[{name:'Local',transfer:false,system:{changes:[
  {key:'system.damageBonus',type:'add',value:'2',phase:'initial',priority:20},{key:'system.damageBonus',type:'multiply',value:'3',phase:'initial',priority:10},
  {key:'system.combatPointBonus',type:'add',value:'2',phase:'initial'},
  {key:'system.damageBonus',type:'add',value:'1',phase:'final'},
  {key:'system.protection',type:'add',value:'4',phase:'final'},
  {key:'system.modifiers.rolls.allActions',type:'add',value:'99',phase:'initial'}]}},
  {name:'Carried',transfer:true,system:{changes:[{key:'system.damageBonus',type:'add',value:'99',phase:'initial'}]}}];
 data.system.damageBonus=1;const item=new TrudvangItem(data,actor);
 assert.equal(item.system.damageBonus,6);assert.equal(item.system.combatPointBonus,3);assert.equal(item.system.protection,9);assert.equal(item.system.modifiers,undefined);
 assert.equal(prepareEquipmentInspection(item).stats.find(row=>row.key==='protection').effectiveDisplay,'9');
 for(let i=0;i<3;i++){item.prepareEmbeddedDocuments();item.system.prepareDerivedData();item.prepareDerivedData();assert.equal(item.system.damageBonus,6);assert.equal(item.system.protection,9);}
 const last=applications.lastIndexOf('system.combatPointBonus');assert.ok(last>=0);
 item._source.effects[0].duration={expired:true};item.prepareData();assert.equal(item.system.damageBonus,1);assert.equal(item.system.protection,5);
});

test('submitting current item fields preserves bonuses and spends temporary integrity before intrinsic integrity',async()=>{
 const item=new TrudvangItem(source(),actor);actor.items=[item];
 await applyTransformation(actor,'vitner-vitner-craft:enchant-object:2#effect',{destinationItem:item,skipDialog:true});
 const sheet=new TrudvangItemSheet({document:item});
 const submit=async values=>TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet,{},null,{object:values});
 await sheet._prepareContext({});
 await submit({name:'Nouvelle épée','system.breach.value':60,'system.breach.max':90,'system.damageBonus':1,'system.combatPointBonus':1});
 assert.equal(item.system.breach.value,60);assert.equal(item._source.system.breach.value,50);assert.equal(item._source.system.damageBonus,0);
 await sheet._prepareContext({});
 await submit({'system.breach.value':55,'system.breach.max':95,'system.damageBonus':3});
 assert.deepEqual(item.system.breach,{value:55,max:95});assert.deepEqual(item._source.system.breach,{value:50,max:85});assert.equal(item.system.damageBonus,3);assert.equal(item._source.system.damageBonus,2);
 await sheet._prepareContext({});await submit({'system.breach.value':55,'system.breach.max':95,'system.damageBonus':3});
 assert.deepEqual(item._source.system.breach,{value:50,max:85});assert.equal(item.system.damageBonus,3);
 item._source.effects=[];item.prepareData();
 assert.deepEqual(item.system.breach,{value:50,max:85});assert.equal(item.system.damageBonus,2);
});

test('temporary integrity absorbs defensive hits first, persists through reload and expires without restoring spent integrity',async()=>{
 for(const losses of [[5],[12],[5,7]]){
  let item=new TrudvangItem(source(),actor);actor.items=[item];
  await applyTransformation(actor,'vitner-vitner-craft:enchant-object:2#effect',{destinationItem:item,skipDialog:true});
  let lost=0;
  for(const loss of losses){
   await applyDamageToDefenseItem({item,damage:item.system.protection+loss});lost+=loss;
   assert.equal(item.system.breach.value,60-lost);assert.equal(item._source.system.breach.value,50-Math.max(0,lost-10));
   item=new TrudvangItem(item._source,actor);actor.items=[item];
   assert.equal(item.system.breach.value,60-lost,'reloading never replenishes the temporary pool');
  }
  item._source.effects=[];item.prepareData();assert.equal(item.system.breach.value,50-Math.max(0,lost-10));
 }
});

test('independent temporary integrity grants keep their own spending when another effect expires',async()=>{
 const data=source();data.effects=['first','second'].map(_id=>({_id,name:_id,transfer:false,system:{changes:[{key:'system.breach.value',type:'add',value:'10',phase:'initial'},{key:'system.breach.max',type:'add',value:'10',phase:'initial'}]}}));
 const item=new TrudvangItem(data,actor);assert.equal(item.system.breach.value,70);
 await applyDamageToDefenseItem({item,damage:item.system.protection+12});assert.equal(item.system.breach.value,58);assert.equal(item._source.system.breach.value,50);
 item._source.effects.shift();item.prepareData();assert.equal(item.system.breach.value,58,'only the unspent eight points of the second grant remain');
 await applyDamageToDefenseItem({item,damage:item.system.protection+9});assert.equal(item.system.breach.value,49);assert.equal(item._source.system.breach.value,49);
 item._source.effects=[];item.prepareData();assert.equal(item.system.breach.value,49);
});

test('known weapon use joins the ordinary modifier list without an icon or checkbox and updates the visible final VC',async t=>{
 const old=document;t.after(()=>{globalThis.document=old;});
 globalThis.document={createElement:type=>['label','li'].includes(type)?{tagName:type,html:'',set innerHTML(value){this.html=value;},querySelector:()=>null}:type==='div'?old.createElement(type):{attrs:{},setAttribute(k,v){this.attrs[k]=v;},hasAttribute(k){return k in this.attrs;}}};
 const data=source();data.effects=[{name:'Enchantement',transfer:false,system:{changes:[{key:'system.transformation.objectUse',type:'override',value:'2',phase:'initial'}]}}];
 const item=new TrudvangItem(data,actor);actor.items=[item];
 const section={children:[],closest:()=>null,append(node){this.children.push(node);node.parentNode=this;}},list={...section,children:[]},events={};
 const output={textContent:'12',hidden:false,nextElementSibling:null,after(node){this.nextElementSibling=node;}};
 const root={querySelector:()=>null,querySelectorAll:selector=>selector==='[data-conditional-modifiers]'?[section]:selector==='[data-applied-item-modifiers]'?[list]:[output],addEventListener:(key,fn)=>events[key]=fn};
 class Base{_onRender(){}}
 const Dialog=blessingDialog(Base,actor,'modifier',{item}),dialog=new Dialog();dialog.element=root;dialog._onRender({},{});
 assert.equal(section.children.length,0);assert.equal(list.children.length,1);assert.equal(list.children[0].tagName,'li');assert.doesNotMatch(list.children[0].html,/<input|disabled|<i\b|utiliser/i);assert.match(list.children[0].html,/>Épée - Enchantement<\/span><b>\+2<\/b>/);
 assert.equal(output.hidden,true);assert.equal(output.nextElementSibling.textContent,'14');
 output.textContent='15';events.input();await Promise.resolve();assert.equal(output.nextElementSibling.textContent,'17');
});
