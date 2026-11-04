import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {damageQualification, qualifyDamage, WEAPON_QUALIFICATIONS, DAMAGE_TYPES, DAMAGE_NATURES, DAMAGE_DELIVERIES, DAMAGE_PROTECTIONS} from "../modules/rules/damage-qualifications.mjs";
import {prepareDamageRoll, damageRollChoice} from "../modules/rules/damage-roll-resolver.mjs";
import {applyDamageToActor} from "../modules/damage-application.mjs";
import {damageIcons,damageQualificationFields} from "../modules/damage-icons.mjs";
import {POWER_DETAILS_BY_ID} from "../modules/power-catalog-data.mjs";

test("spell origin, magic, ranged delivery and armor bypass are independent", () => {
  assert.deepEqual(damageQualification({context:{},usage:"magic"}),{nature:"normal",delivery:"other",type:"other",material:"",protection:"normal"});
  const arrow=POWER_DETAILS_BY_ID["holy-ealdtradition-tribute-of-morgu:battle-arrow:1"].damageRoll.qualification;
  assert.equal(arrow.nature,"magical");assert.equal(arrow.protection,"normal");
  const rock=POWER_DETAILS_BY_ID["vitner-soil-craft:rock-throw:0"].damageRoll.qualification;
  assert.deepEqual(rock,{nature:"normal",delivery:"ranged",type:"bludgeoning",protection:"normal",material:"stone"});
  assert.equal(POWER_DETAILS_BY_ID["vitner-flame-craft:flame-burst:3"].damageRoll.qualification.protection,"magical");
});

test("throwing changes delivery without losing the weapon material, type or nature", () => {
  const item={type:"weapon",system:{category:"oneHandedHeavy",damage:"1d10",openRoll:10,material:"steel",damageQualification:{nature:"magical",type:"slashing",delivery:"melee",protection:"normal"}}};
  const profile=prepareDamageRoll({item,context:{usage:"throwing"}});
  assert.equal(profile.qualification.delivery,"ranged");
  assert.equal(profile.qualification.material,"steel");
  const choice=damageRollChoice(profile,{qualification:{nature:"normal",type:"piercing"}});
  assert.equal(choice.qualification.type,"piercing");assert.equal(choice.qualification.nature,"normal");
  assert.equal(item.system.damageQualification.nature,"magical");
});

test("every catalog weapon and shield has a damage-surface material and a valid primary type", () => {
  const source=JSON.parse(readFileSync(new URL("../data/starter-content.json",import.meta.url),"utf8"));
  for(const entry of source.items.filter(item=>["weapon","shield"].includes(item.type))){
    const [material,type]=WEAPON_QUALIFICATIONS[entry.nameKey.split(".").at(-2)];
    assert.equal(entry.system.material,material);assert.equal(entry.system.damageQualification.type,type);
    assert.ok(DAMAGE_TYPES.includes(type));
  }
  assert.deepEqual(WEAPON_QUALIFICATIONS.Longbow,["steel","piercing"]);
  assert.deepEqual(WEAPON_QUALIFICATIONS.Slingu,["stone","bludgeoning"]);
});

test("conjunctive resistance rules match each target and round only after their combined factors", () => {
  const q=damageQualification({context:{qualification:{nature:"magical",type:"fire"}}});
  const rules=[{nature:"normal",factor:0},{nature:"magical",type:"fire",factor:.5},{type:"fire",factor:.5}];
  assert.equal(qualifyDamage(5,q,rules).amount,2);
  assert.equal(qualifyDamage(5,q,[{material:"steel",factor:0}]).amount,5);
  assert.equal(qualifyDamage(5,q,[{factor:0,disabled:true},{factor:-1}]).amount,5);
});

const armor=(id,magicalProtection=false,material="steel")=>({id,type:"armor",system:{equipped:true,breach:{value:30,max:30},magicalProtection,material}});
function target(items=[],extra={}){const updates=[];return {isOwner:true,items,effects:[],system:{protection:items.length*3,resources:{body:{value:40}},...extra},updates,async update(data){updates.push(data);},async updateEmbeddedDocuments(type,data){updates.push(data);}};}

test("selective armor bypass ignores ordinary and natural protection but preserves eligible armor and its integrity",async()=>{
  const items=[armor("ordinary"),armor("magic",true),armor("silver",false,"grindsilver")],actor=target(items);
  actor.system.protection+=8;
  const result=await applyDamageToActor({actor,damage:12,qualification:{protection:"magical"},announce:false});
  assert.equal(result.bodyDamage,9);assert.deepEqual(result.armorDamage.map(row=>row.item.id),["magic"]);
  assert.equal(result.armorDamage[0].integrityLoss,9);
  const silver=await applyDamageToActor({actor,damage:12,qualification:{protection:"magicalOrGrindsilver"},announce:false});
  assert.equal(silver.bodyDamage,6);assert.deepEqual(silver.armorDamage.map(row=>row.item.id),["magic","silver"]);
  const ignored=await applyDamageToActor({actor,damage:12,ignoreArmor:true,qualification:{protection:"magicalOrGrindsilver"},announce:false});
  assert.equal(ignored.bodyDamage,12);assert.deepEqual(ignored.armorDamage,[]);
});

test("armor blessings use their magic bonus separately from the armor's own eligibility",async()=>{
  const coat=armor("coat");
  coat.effects=[{name:"Cuirasse des gardiens du Rortan",flags:{"trudvang-chronicles":{transformation:{key:"holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3#armor",resolved:true}}}}];
  const actor=target([coat]);actor.system.protection=6;
  const normal=await applyDamageToActor({actor,damage:10,qualification:{nature:"normal"},announce:false});
  assert.equal(normal.bodyDamage,4);
  const magic=await applyDamageToActor({actor,damage:10,qualification:{nature:"magical"},announce:false});
  assert.equal(magic.bodyDamage,6);
  const spell=await applyDamageToActor({actor,damage:10,qualification:{protection:"magical"},announce:false});
  assert.equal(spell.bodyDamage,9);
});

test("typed damage reaches target resistances, including the chat application path",async()=>{
  const actor=target([],{damageDefenses:[{type:"fire",factor:.5}]});
  const result=await applyDamageToActor({actor,damage:9,qualification:{type:"fire"},announce:false});
  assert.equal(result.bodyDamage,5);assert.equal(result.resistances.length,1);
  const code=readFileSync(new URL("../modules/chat-application.mjs",import.meta.url),"utf8");
  assert.match(code,/qualification: message\.getFlag\(SYSTEM_ID,"damageContext"\)\?\.qualification/);
});

test("a body's resistance does not spare worn armor; explicit barriers act before armor",async()=>{
  const actor=target([armor("coat")],{damageDefenses:[{type:"piercing",factor:.5}]});
  const result=await applyDamageToActor({actor,damage:10,qualification:{type:"piercing"},announce:false});
  assert.equal(result.armorDamage[0].integrityLoss,7);assert.equal(result.bodyDamage,4);
  actor.system.damageDefenses[0].stage="beforeArmor";
  const barrier=await applyDamageToActor({actor,damage:10,qualification:{type:"piercing"},announce:false});
  assert.equal(barrier.armorDamage[0].integrityLoss,2);assert.equal(barrier.bodyDamage,2);
});

test("existing consumable policies receive the new type and armor bypass also skips stone barriers",async()=>{
  const actor=target();
  actor.effects=[{name:"Resistance",flags:{"trudvang-chronicles":{consumablePolicy:{damageFactors:{fire:.5,disease:.5}}}}}];
  const result=await applyDamageToActor({actor,damage:9,qualification:{type:"fire"},announce:false});
  assert.equal(result.bodyDamage,5);
  const disease=await applyDamageToActor({actor,damage:9,damageType:"disease",announce:false});assert.equal(disease.bodyDamage,5);
  actor.effects=[{flags:{"trudvang-chronicles":{transformation:{stoneIntegrity:20}}},async update(){assert.fail("ignore-all must not consume the stone barrier");}}];
  const ignored=await applyDamageToActor({actor,damage:9,ignoreArmor:true,announce:false});assert.equal(ignored.bodyDamage,9);
});

test("qualifier glyphs have localized accessible tooltips and do not show raw type labels",()=>{
  const old=globalThis.game;
  const fr=JSON.parse(readFileSync(new URL("../lang/fr.json",import.meta.url),"utf8"));
  globalThis.game={i18n:{localize:key=>key.split(".").reduce((node,part)=>node?.[part],fr)??key}};
  try{
    const html=damageIcons({nature:"magical",delivery:"ranged",type:"fire",material:"steel",protection:"normal"});
    assert.match(html,/title="Feu"/);assert.match(html,/aria-label="Dégâts magiques"/);assert.doesNotMatch(html,/>Feu</);
    const fields=damageQualificationFields({nature:"normal",delivery:"melee",type:"slashing",protection:"normal",material:"wood"});
    assert.equal((fields.match(/type="radio"/g)??[]).length,DAMAGE_NATURES.length+DAMAGE_DELIVERIES.length+DAMAGE_TYPES.length+DAMAGE_PROTECTIONS.length);
    assert.match(fields,/value="slashing" checked/);
  }finally{globalThis.game=old;}
});
