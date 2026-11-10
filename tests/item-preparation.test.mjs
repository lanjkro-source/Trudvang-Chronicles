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
 constructor(source,parent){this._source=structuredClone(source);this.flags=this._source.flags??{};this.type=source.type;this.name=source.name;this.id='i';this.uuid='Actor.a.Item.i';this.documentName='Item';this.parent=parent;this.isOwner=true;this.effects=[];this.prepareData();}
 prepareData(){this.system=new models[this.type](this._source.system,{parent:this});this.effects=(this._source.effects??[]).map((row,i)=>({...structuredClone(row),_source:row,id:row._id??'e'+i,uuid:this.uuid+'.ActiveEffect.'+(row._id??'e'+i),parent:this,active:false,update:async data=>{this._source.effects[i]={...row,...structuredClone(data)};this.prepareData();return this.effects[i];}}));this.prepareEmbeddedDocuments();this.system.prepareDerivedData();this.prepareDerivedData();}
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
  const next=change.type==='add'?Number(before??0)+value:change.type==='subtract'?Number(before??0)-value:change.type==='multiply'?Number(before)*value:change.type==='upgrade'?Math.max(Number(before),value):change.type==='override'?(Number.isFinite(value)?value:change.value):before;
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
const {WeaponData,ShieldData,ArmorData,GearData}=await import('../modules/data-models.mjs');models={weapon:WeaponData,shield:ShieldData,armor:ArmorData,gear:GearData};
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

test('Rust lowers quality, CP and integrity without changing damage; expiry preserves actual wear',async()=>{
 const data=source();Object.assign(data.system,{quality:2,value:100});const item=new TrudvangItem(data,actor);actor.items=[item];
 await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,counts:[2,1],skipDialog:true});
 assert.equal(item.system.quality,1);assert.equal(item.system.combatPointBonus,0);assert.equal(item.system.damageBonus,0);assert.equal(item.system.value,50);assert.deepEqual(item.system.breach,{value:40,max:70});
 assert.deepEqual(item.effects[0].duration,{value:19,units:'rounds'});assert.match(item.effects[0].flags['trudvang-chronicles'].transformation.summary,/Normale → Médiocre/);
 const sheet=new TrudvangItemSheet({document:item}),context=await sheet._prepareContext({});
 assert.equal(context.system.protection,4);assert.equal(context.qualityLocked,true);assert.equal(context.equipmentInspection.stats.find(row=>row.key==='quality').comparison,'Normale → Médiocre');
 await applyDamageToDefenseItem({item,damage:9});assert.equal(item.system.breach.value,35);assert.equal(item._source.system.breach.value,45);
 item._source.effects=[];item.prepareData();assert.equal(item.system.breach.value,45);assert.equal(item.system.quality,2);assert.equal(item.system.combatPointBonus,1);assert.equal(item.system.value,100);
});

test('Rust improvements stop at the lowest quality, adjust armor weight and encumbrance, and reject magical items',async()=>{
 const data=source();data.type='armor';Object.assign(data.system,{quality:2,heft:3,weight:20,value:100});const armor=new TrudvangItem(data,actor);actor.items=[armor];
 await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:armor,counts:[0,0,0,0,9],skipDialog:true});
 assert.equal(armor.system.quality,0);assert.equal(armor.system.heft,5);assert.equal(armor.system.weight,30);assert.equal(armor.system.value,20);assert.deepEqual(armor.system.breach,{value:30,max:60});
 for(let i=0;i<3;i++){armor.prepareData();assert.equal(armor.system.heft,5);assert.equal(armor.system.weight,30);}
 armor._source.effects=[];armor.prepareData();assert.equal(armor.system.heft,3);assert.equal(armor.system.weight,20);
 for(const fields of [{magical:true},{magicalProtection:true},{damageQualification:{nature:'magical'}}]){
  const magical=source();Object.assign(magical.system,fields);const item=new TrudvangItem(magical,actor);actor.items=[item];
  assert.equal(await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,skipDialog:true}),null);assert.equal(item.effects.length,0);
 }
 const item=new TrudvangItem(source(),actor);actor.items=[item];await applyTransformation(actor,'vitner-vitner-craft:enchant-object:2#effect',{destinationItem:item,skipDialog:true});
 assert.equal(await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,skipDialog:true}),null);assert.equal(item.effects.length,1);
});

test('intrinsic quality edits update stored characteristics once, and unmodified sheet submissions do not repeat the change',async()=>{
 const data=source();Object.assign(data.system,{quality:2,value:100});const item=new TrudvangItem(data,actor),sheet=new TrudvangItemSheet({document:item});actor.items=[item];
 await sheet._prepareContext({});await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet,{},null,{object:{'system.quality':4,'system.breach.value':50,'system.breach.max':80,'system.combatPointBonus':1,'system.value':100}});
 assert.equal(item.system.quality,4);assert.equal(item.system.combatPointBonus,3);assert.deepEqual(item.system.breach,{value:60,max:90});assert.equal(item.system.value,300);
 await sheet._prepareContext({});await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet,{},null,{object:{'system.quality':4,'system.breach.value':60,'system.breach.max':90,'system.combatPointBonus':3,'system.value':300}});
 assert.equal(item.system.value,300);assert.equal(item.system.combatPointBonus,3);
});

test('renewing Rust replaces its quality adjustment without applying the degradation twice',async()=>{
 const data=source();Object.assign(data.system,{quality:2,value:100});const item=new TrudvangItem(data,actor);actor.items=[item];
 for(let i=0;i<3;i++){
  await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,skipDialog:true});
  assert.equal(item.effects.length,1);assert.equal(item.system.quality,1);assert.equal(item.system.breach.value,40);assert.equal(item.system.value,50);
 }
 await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,counts:[0,0,0,0,1],skipDialog:true});
 assert.equal(item.effects.length,1);assert.equal(item.system.quality,0);assert.equal(item.system.breach.value,30);assert.equal(item.system.value,20);
});

test('weight and price round to one decimal after multipliers without accumulating rounding or saving effects into source',async()=>{
 const data=source();data.type='armor';Object.assign(data.system,{quality:4,heft:3,weight:10.5,value:100});const item=new TrudvangItem(data,actor);actor.items=[item];
 await applyTransformation(actor,'vitner-vitner-of-objects:rust:3#effect',{destinationItem:item,counts:[0,0,0,0,2],skipDialog:true});
 assert.equal(item.system.weight,16.4);assert.equal(item.system.value,16.7);
 for(let i=0;i<3;i++){item.prepareEmbeddedDocuments();item.system.prepareDerivedData();item.prepareDerivedData();assert.equal(item.system.weight,16.4);assert.equal(item.system.value,16.7);}
 const sheet=new TrudvangItemSheet({document:item});await sheet._prepareContext({});
 await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet,{},null,{object:{'system.weight':16.4,'system.value':16.7}});
 assert.equal(item._source.system.weight,10.5);assert.equal(item._source.system.value,100);
 item._source.effects=[];item.prepareData();assert.equal(item.system.weight,10.5);assert.equal(item.system.value,100);
 const raw=source();Object.assign(raw.system,{weight:1.234567,value:123.45678});const plain=new TrudvangItem(raw,actor);
 assert.equal(plain.system.weight,1.2);assert.equal(plain.system.value,123.5);assert.equal(plain._source.system.weight,1.234567);
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

test('automatic ritual quality appears as an ordinary modifier row with no checkbox, icon or special hint',async t=>{
 const old=document;t.after(()=>{globalThis.document=old;});
 globalThis.document={createElement:type=>['label','li'].includes(type)?{tagName:type,html:'',set innerHTML(value){this.html=value;},querySelector:()=>null}:type==='div'?old.createElement(type):{attrs:{},setAttribute(k,v){this.attrs[k]=v;},hasAttribute(k){return k in this.attrs;}}};
 const data=source();Object.assign(data.system,{quality:4,specialUse:'vitner',equipped:true});const item=new TrudvangItem(data,actor);actor.items=[item];
 const existing={html:'state modifier'},section={children:[],closest:()=>null,append(node){this.children.push(node);node.parentNode=this;}},list={...section,className:'roll-state-modifiers',children:[existing]};
 const output={textContent:'12',nextElementSibling:null,after(node){this.nextElementSibling=node;}};
 const root={querySelector:()=>null,querySelectorAll:selector=>selector==='[data-conditional-modifiers]'?[section]:selector==='[data-applied-item-modifiers]'?[list]:[output],addEventListener:()=>{}};
 class Base{_onRender(){}}
 const Dialog=blessingDialog(Base,actor,'magic',{castingType:'vitner'}),dialog=new Dialog();dialog.element=root;dialog._onRender({},{});
 assert.deepEqual(section.children,[]);assert.equal(list.children.length,2);assert.equal(list.children[0],existing);assert.equal(list.children[1].tagName,'li');
 assert.match(list.children[1].html,/>Épée - Tissage de vitner<\/span><b>\+2<\/b>/);assert.doesNotMatch(list.children[1].html,/<input|<i\b|checkbox/);
 assert.equal(output.nextElementSibling.textContent,'14');
});

test('a conjured consumable is magical only while its potency effect remains active, including after a sheet save',async()=>{
 const data={type:'gear',name:'Potion',flags:{'trudvang-chronicles':{conjuredConsumable:{sourceId:'potion'}}},system:{magical:false,description:'',quantity:1},effects:[{type:'effect',transfer:false,duration:{value:1,units:'days'},flags:{'trudvang-chronicles':{transformation:{resolved:true,appliedAt:0},consumablePayload:{operations:[{operation:'heal',formula:'1d10+1'}]}}},system:{changes:[]}}]};
 const item=new TrudvangItem(data,actor);actor.items=[item];assert.equal(item.system.magical,true);
 const sheet=new TrudvangItemSheet({document:item});await sheet._prepareContext({});await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet,{},null,{object:{'system.magical':true}});
 assert.equal(item._source.system.magical,false);assert.equal(item.system.magical,true);
 item._source.effects=[];item.prepareData();assert.equal(item.system.magical,false);
});
