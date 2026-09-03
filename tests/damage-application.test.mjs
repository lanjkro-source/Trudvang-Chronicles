import assert from "node:assert/strict";
import test from "node:test";
import { calculateArmoredDamage, defensiveItem } from "../modules/damage-application.mjs";

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

test("a shield is preferred over an off-hand or two-handed weapon for defense damage", () => {
  const shield = {id: "shield", type: "shield", system: {equipped: true}};
  const offHand = {id: "off", type: "weapon", system: {equipped: true, hand: "offHand"}};
  const twoHanded = {id: "two", type: "weapon", system: {equipped: true, combatSpecialty: "twoHandedWeapons"}};
  assert.equal(defensiveItem({items: [offHand, twoHanded, shield]}), shield);
  assert.equal(defensiveItem({items: [twoHanded, offHand]}), offHand);
  assert.equal(defensiveItem({items: [twoHanded]}), twoHanded);
});
