import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import test from "node:test";
import {initializeNpcInventory, isNpcEquipment} from "../modules/npc-inventory.mjs";
import {withNpcInventories} from "../tools/generate-npc-inventories.mjs";

const content = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
const french = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const byName = id => content.actors.find(actor => actor.nameKey === `TRUDVANG.Content.Actor.${id}.Name`);

test("NPC material inventories accept weapons, armor and shields, not feats or other items", () => {
  for (const type of ["weapon", "armor", "shield"]) assert.equal(isNpcEquipment({type}), true);
  for (const type of ["ability", "spell", "divineFeat", "tablet", "gear", "potion"]) assert.equal(isNpcEquipment({type}), false);
  assert.equal(isNpcEquipment(null), false);
  assert.equal(isNpcEquipment({type: "weapon", system: {combatSpecialty: "natural"}}), false);
  assert.equal(isNpcEquipment({type: "weapon", system: {category: "natural"}}), false);
});

test("all starter creatures have an inventory and independent tokens, while natural weapons are not loot", () => {
  for (const actor of content.actors) {
    assert.ok(Array.isArray(actor.items));
    assert.equal(actor.prototypeToken.actorLink, false);
    assert.ok(actor.items.every(isNpcEquipment));
  }
  assert.equal(byName("Galtir").items.length, 2);
  assert.equal(byName("TrollBull").items.length, 4);
  for (const id of ["GiantSnake", "GiantSpider", "Gryphon", "NightUlm", "ThornBeast", "Warg"]) assert.deepEqual(byName(id).items, []);
});

test("starter weapons keep creature-specific damage and only a valid hand configuration is readied", () => {
  const items = byName("TrollBull").items;
  const mace = items.find(item => item.nameKey.includes("BardaMakir"));
  const club = items.find(item => item.nameKey.includes("TveiKlubb"));
  const shield = items.find(item => item.type === "shield");
  assert.equal(mace.system.damage, "1d10"); assert.equal(mace.system.openRoll, 8);
  assert.equal(club.system.damage, "2d10"); assert.equal(club.system.openRoll, 7);
  assert.equal(mace.system.equipped, true); assert.equal(shield.system.equipped, true);
  assert.equal(club.system.equipped, false);
  assert.equal(shield.system.openRoll, 10);
  for (const actor of content.actors) for (const item of actor.items) {
    assert.equal(item.system.quantity, 1);
    assert.equal(item.folder, undefined);
    if (item.type === "armor") assert.equal(item.system.equipped, true);
  }
});

test("NPC inventories are reproducibly generated from the French reference without changing its source", {skip: !existsSync(new URL("../game doc/fr/trudvang-creatures-fr.json", import.meta.url))}, () => {
  const creatures = JSON.parse(readFileSync(new URL("../game doc/fr/trudvang-creatures-fr.json", import.meta.url), "utf8"));
  const before = structuredClone(creatures);
  assert.deepEqual(withNpcInventories(content, creatures, french), content);
  assert.deepEqual(creatures, before);
});

function oldActor(items = [], type = "npc") {
  const flags = {};
  const actor = {type, items: structuredClone(items), getFlag: (scope, key) => flags[key],
    async setFlag(scope, key, value) { flags[key] = value; },
    async createEmbeddedDocuments(kind, data) { assert.equal(kind, "Item"); this.items.push(...structuredClone(data)); }};
  return actor;
}

test("old empty starter inventories are initialized only once, even after all loot is removed", async () => {
  const actor = oldActor([{type: "ability", name: "Durable"}]);
  assert.equal(await initializeNpcInventory(actor, byName("Galtir").items), true);
  assert.equal(actor.items.filter(isNpcEquipment).length, 2);
  actor.items = actor.items.filter(item => !isNpcEquipment(item));
  assert.equal(await initializeNpcInventory(actor, byName("Galtir").items), false);
  assert.equal(actor.items.length, 1);
});

test("inventory migration preserves customized inventories completely and ignores PCs", async () => {
  const custom = [{type: "weapon", name: "Custom knife", system: {quantity: 2, equipped: false, breach: {value: 3}}}];
  const npc = oldActor(custom);
  await initializeNpcInventory(npc, byName("TrollBull").items);
  assert.deepEqual(npc.items, custom);
  const pc = oldActor([], "character");
  assert.equal(await initializeNpcInventory(pc, byName("Galtir").items), false);
  assert.deepEqual(pc.items, []);
});

test("an empty animal inventory is marked initialized without creating any item", async () => {
  const npc = oldActor();
  assert.equal(await initializeNpcInventory(npc, []), true);
  assert.deepEqual(npc.items, []);
  assert.equal(await initializeNpcInventory(npc, byName("Galtir").items), false);
});

test("failed inventory initialization can be retried instead of marking it completed", async () => {
  const npc = oldActor();
  npc.createEmbeddedDocuments = async () => { throw new Error("Permission denied"); };
  await assert.rejects(initializeNpcInventory(npc, byName("Galtir").items), /Permission denied/);
  assert.equal(npc.getFlag("trudvang-chronicles", "inventoryInitialized"), undefined);
});
