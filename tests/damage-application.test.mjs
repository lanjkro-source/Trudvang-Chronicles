import assert from "node:assert/strict";
import test from "node:test";
import { applyDamageToActor, calculateArmoredDamage, defensiveItem } from "../modules/damage-application.mjs";

const armor = (id, integrity) => ({id, type: "armor", system: {equipped: true, breach: {value: integrity}}});

test("normal damage reduces armor integrity and only the excess reaches Body Points", () => {
  const result = calculateArmoredDamage({damage: 8, totalProtection: 5, armor: [armor("mail", 50)]});
  assert.equal(result.bodyDamage, 3);
  assert.deepEqual(result.armorDamage.map(entry => ({id: entry.item.id, loss: entry.integrityLoss, integrity: entry.integrity})), [{id: "mail", loss: 3, integrity: 47}]);
});

test("natural protection absorbs the remainder after worn armor", () => {
  const result = calculateArmoredDamage({damage: 8, totalProtection: 6, armor: [armor("mail", 50)]});
  assert.equal(result.bodyDamage, 2);
  assert.equal(result.armorDamage[0].integrityLoss, 3);
});

test("an outer barrier protects both the wearer and worn armor without counting twice",()=>{
 const mail=armor("mail",50);
 const result=calculateArmoredDamage({damage:8,totalProtection:8,outerProtection:3,armor:[mail]});
 assert.equal(result.bodyDamage,0);assert.equal(result.armorDamage[0].integrityLoss,0);
 const penetrating=calculateArmoredDamage({damage:11,totalProtection:8,outerProtection:3,armor:[mail]});
 assert.equal(penetrating.bodyDamage,3);assert.equal(penetrating.armorDamage[0].integrityLoss,3);
});

test("Air Armor protects worn armor when applying damage and is bypassed with armor",async()=>{
 const changes=[],armorUpdates=[];
 const barrier={system:{changes:[{key:"system.transformation.outerProtection",type:"override",value:"3"}]}};
 const actor={isOwner:true,items:[armor("mail",50)],effects:[barrier],system:{protection:8,resources:{body:{current:20,max:20}}},
  updateEmbeddedDocuments:async(_type,updates)=>armorUpdates.push(updates),update:async data=>changes.push(data)};
 const hit=await applyDamageToActor({actor,damage:8,announce:false});
 assert.equal(hit.bodyDamage,0);assert.equal(armorUpdates.length,0);assert.equal(changes.length,0);
 const bypass=await applyDamageToActor({actor,damage:8,ignoreArmor:true,announce:false});
 assert.equal(bypass.bodyDamage,8);assert.equal(armorUpdates.length,0);assert.equal(changes.at(-1)["system.resources.body.value"],12);
});

test("damage that ignores armor bypasses every source of protection", async () => {
  const updates = [];
  const actor = {
    isOwner: true,
    items: [armor("mail", 50)],
    system: {protection: 6, resources: {body: {current: 20}}},
    updateEmbeddedDocuments: async () => { throw new Error("armor must not be damaged"); },
    update: async update => updates.push(update)
  };
  const result = await applyDamageToActor({actor, damage: 8, ignoreArmor: true});
  assert.equal(result.bodyDamage, 8);
  assert.deepEqual(updates, [{"system.resources.body.value": 12}]);
});

test("a shield is preferred over an off-hand or two-handed weapon for defense damage", () => {
  const shield = {id: "shield", type: "shield", system: {equipped: true}};
  const offHand = {id: "off", type: "weapon", system: {equipped: true, hand: "offHand"}};
  const twoHanded = {id: "two", type: "weapon", system: {equipped: true, combatSpecialty: "twoHandedWeapons"}};
  assert.equal(defensiveItem({items: [offHand, twoHanded, shield]}), shield);
  assert.equal(defensiveItem({items: [twoHanded, offHand]}), offHand);
  assert.equal(defensiveItem({items: [twoHanded]}), twoHanded);
});
