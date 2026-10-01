import {weaponType} from "./rules/combat-pool-resolver.mjs";

export const NPC_EQUIPMENT_TYPES = new Set(["weapon", "armor", "shield", "gear", "potion"]);
export const isNpcEquipment = item => NPC_EQUIPMENT_TYPES.has(item?.type) && weaponType(item) !== "natural";

// TEMPORARY WORLD MIGRATION — attach stable knowledge identifiers to old book
// rows without replacing their names, levels, ordering or GM-customized content.
export async function initializeNpcCombatKnowledge(actor, referenceRows) {
  if (actor.type !== "npc") return false;
  const current = Array.from(actor.system.skillTree ?? []);
  let changed = false;
  const rows = current.map(row => {
    const reference = referenceRows?.find(entry => entry.name === row.name && entry.kind === row.kind);
    if (!reference) return row;
    const identifiers = {};
    for (const key of ["skillId", "catalogId"]) if (!row[key] && reference[key]) {
      identifiers[key] = reference[key]; changed = true;
    }
    return {...row, ...identifiers};
  });
  if (changed) await actor.update({"system.skillTree": rows});
  return changed;
}

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
