import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TRANSFORMATION_TEMPLATES} from '../modules/transformation-data.mjs';
import {rulesFromChanges,validProfileChange} from '../modules/rules/effect-rule-changes.mjs';
import {equipmentGrantActive,equipmentGrantItems} from '../modules/rules/granted-equipment.mjs';
import {itemUseBonuses} from '../modules/rules/item-magic.mjs';

import {prepareDamageRoll,damageRollChoice} from '../modules/rules/damage-roll-resolver.mjs';
import {effectDurationSeconds} from '../modules/rules/effect-duration.mjs';

const S='trudvang-chronicles',keys=['bloodfangsbane:2','bolgemek:4','roggdrasil:8'].map(id=>'holy-ealdtradition-halawen-s-offering:'+id+'#weapon');
const language=JSON.parse(fs.readFileSync('lang/fr.json')),localize=key=>key.split('.').reduce((v,k)=>v?.[k],language)??key;
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>''}},utils:{randomID:()=>crypto.randomUUID()}};
globalThis.ui={notifications:{warn:message=>assert.fail(message)}};
const {conditionalChoices}=await import('../modules/blessing-dialog.mjs');
const {calculateArmoredDamage,applyDamageToDefenseItem}=await import('../modules/damage-application.mjs');
const {applyTransformation,syncEffectGrants,cleanGrants,transformationItemActive}=await import('../modules/transformations.mjs');
let serial=0;
function actor(name='A'){
 const items=[],effects=[];items.get=id=>items.find(item=>item.id===id);effects.get=id=>effects.find(effect=>effect.id===id);
 const a={uuid:'Actor.'+name,id:name,name,documentName:'Actor',type:'character',items,effects,isOwner:true,canUserModify:()=>true,getTraitValue:()=>2,getActiveTokens:()=>[],system:{effective:{traits:{strength:2}}},
  allApplicableEffects(){return effects;},
  async createTrudvangEffect(data){const effect={...structuredClone(data),id:'e'+(++serial),uuid:this.uuid+'.ActiveEffect.e'+serial,parent:this};effects.push(effect);return effect;},
  async createEmbeddedDocuments(_,rows){return rows.map(row=>{const item={...structuredClone(row),id:'i'+(++serial),uuid:this.uuid+'.Item.i'+serial,parent:this,actor:this,isOwner:true};item.effects=item.effects.map((e,index)=>({...e,id:'local'+index,uuid:item.uuid+'.ActiveEffect.local'+index}));item.delete=async()=>items.splice(items.indexOf(item),1);items.push(item);return item;});},
  async deleteEmbeddedDocuments(_,ids){for(const id of ids){const item=items.get(id);if(item)await item.delete();}}
 };
 return a;
}
function setup(){
 const a=actor();game.actors=[a];game.items=[];game.scenes=[];return a;
}
globalThis.game={user:{id:'gm',isGM:true},time:{worldTime:0},i18n:{lang:'fr',localize,format:(key,data)=>localize(key).replace(/\{(\w+)\}/g,(_,k)=>data[k])}};
test('all three powers grant actual two-handed weapons with their French-reference statistics',async()=>{
 for(const [index,key]of keys.entries()){
  const a=setup();const e=await applyTransformation(a,key,{skipDialog:true,counts:[2,1]});const w=a.items[0];
  assert.equal(a.items.length,1);assert.equal(w.system.combatSpecialty,'twoHandedWeapons');assert.equal(w.system.category,'twoHanded');assert.equal(w.system.equipped,true);assert.equal(w.system.openRoll,[8,7,7][index]);assert.equal(w.system.damage,'1d10 + '+[4,6,8][index]);assert.equal(w.system.breach.value,[150,200,300][index]);assert.equal(w.system.protection,[15,20,30][index]);assert.equal(w.system.initiativeModifier,[-4,-4,-2][index]);assert.equal(w.system.weaponActions,[3,3,4][index]);assert.equal(w.system.combatPointBonus,0);assert.equal(w.effects.find(e=>e.transfer).system.changes[0].value,String([2,4,6][index]));assert.equal(effectDurationSeconds(e.duration),4320);
  const damage=prepareDamageRoll({item:w,actor:a});assert.equal(damage.fixedModifier,[6,8,10][index]);assert.equal(damage.qualification.nature,'magical');assert.equal(damage.qualification.armorReduction,index===2?3:undefined);if(index===2){assert.ok(damage.rows.some(row=>row.labelKey==='TRUDVANG.DamageRoll.ArmorReduction'));assert.equal(damageRollChoice(damage,{}).qualification.armorReduction,3);}
  assert.equal(itemUseBonuses(a).find(row=>row.item===w).value,[2,2,4][index]);assert.doesNotMatch(w.name,/TRUDVANG/);assert.doesNotMatch(w.system.description,/TRUDVANG/);
 }
});
test('repeated synchronization preserves AA use and integrity, and never duplicates an invoked spear',async()=>{
 const a=setup(),e=await applyTransformation(a,keys[0],{skipDialog:true}),w=a.items[0];w.system.weaponActionsSpent=2;w.system.breach.value=123;
 await Promise.all([syncEffectGrants(e),syncEffectGrants(e)]);assert.equal(a.items.length,1);assert.equal(a.items[0],w);assert.equal(w.system.breach.value,123);assert.equal(w.system.weaponActionsSpent,2);
 e.disabled=true;assert.equal(transformationItemActive(w),false);assert.deepEqual(itemUseBonuses(a),[]);e.disabled=false;assert.equal(transformationItemActive(w),true);
});
test('invocation keeps occupied hands and existing equipment intact',async()=>{
 const a=setup();a.items.push({id:'old',type:'weapon',system:{category:'twoHanded',equipped:true}});await applyTransformation(a,keys[0],{skipDialog:true});assert.equal(a.items[0].system.equipped,true);assert.equal(a.items[1].system.equipped,false);
});
test('a transfer neither recreates the spear nor escapes cleanup when the source ends',async()=>{
 const a=setup(),b=actor('B');game.actors.push(b);const e=await applyTransformation(a,keys[1],{skipDialog:true}),w=a.items.pop();w.parent=b;w.actor=b;w.delete=async()=>b.items.splice(b.items.indexOf(w),1);b.items.push(w);
 assert.equal(equipmentGrantActive(w),true);assert.equal(transformationItemActive(w),true);await syncEffectGrants(e);assert.equal(a.items.length,0);assert.equal(b.items.length,1);assert.equal(equipmentGrantItems(e)[0],w);
 a.effects.splice(a.effects.indexOf(e),1);assert.equal(equipmentGrantActive(w),false);await cleanGrants(e);assert.equal(b.items.length,0);
});
test('Bolgomek adds one unchecked conditional option only on parries; ordinary use bonus is automatic',async()=>{
 const a=setup();await applyTransformation(a,keys[1],{skipDialog:true});const w=a.items[0];const parry=conditionalChoices(a,{item:w,action:'parry'}),attack=conditionalChoices(a,{item:w,action:'attack'});
 assert.equal(parry.length,2);assert.equal(attack.length,1);assert.equal(attack[0].fixed,true);assert.equal(attack[0].value,2);assert.equal(Boolean(parry.find(row=>row.label.includes('infériorité')).fixed),false);assert.equal(parry.find(row=>row.label.includes('infériorité')).value,2);
});
test('Roggdrasil reduces combined protection once, never three points per armor layer',()=>{
 const armor=[{system:{breach:{value:50}}},{system:{breach:{value:20}}}];const result=calculateArmoredDamage({damage:12,totalProtection:9,armor,armorReduction:3});assert.equal(result.bodyDamage,6);assert.deepEqual(result.armorDamage.map(row=>row.protection),[2,2]);
 assert.equal(calculateArmoredDamage({damage:12,totalProtection:2,armorReduction:3}).bodyDamage,12);assert.equal(calculateArmoredDamage({damage:12,totalProtection:7,outerProtection:2,armor:[armor[0]],armorReduction:3}).bodyDamage,8);
});
test('penetration also applies when damage is assigned to the parrying shield or weapon',async()=>{
 const item={isOwner:true,type:'shield',system:{breach:{value:50}},async update(changes){this.loss=changes['system.breach.value'];}};const result=await applyDamageToDefenseItem({item,damage:8,qualification:{armorReduction:3}});assert.equal(result.integrityLoss,6);
});
test('equipment grants are editable profile changes with validation, and an absent source UUID matches nothing',()=>{
 for(const key of keys)for(const change of TRANSFORMATION_TEMPLATES[key].changes)assert.equal(validProfileChange(change),true);
 assert.equal(validProfileChange({key:'system.transformation.equipment',value:'[{}]'}),false);setup();assert.deepEqual(equipmentGrantItems({parent:game.actors[0]}),[]);
});
