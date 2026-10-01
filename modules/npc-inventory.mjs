import {weaponType} from "./rules/combat-pool-resolver.mjs";

export const NPC_EQUIPMENT_TYPES = new Set(["weapon", "armor", "shield"]);
export const isNpcEquipment = item => NPC_EQUIPMENT_TYPES.has(item?.type) && weaponType(item) !== "natural";

// TEMPORARY WORLD MIGRATION — old starter NPCs had no material inventory. Seed
// it once, never refill deleted loot or merge defaults into a customized inventory.
export async function initializeNpcInventory(actor, items) {
  if (actor.type !== "npc" || actor.getFlag("trudvang-chronicles", "inventoryInitialized")) return false;
  if (!Array.from(actor.items ?? []).some(isNpcEquipment)) {
    const equipment = items.filter(isNpcEquipment);
    if (equipment.length) await actor.createEmbeddedDocuments("Item", equipment);
  }
  await actor.setFlag("trudvang-chronicles", "inventoryInitialized", true);
  return true;
}
