import {weaponType} from "./rules/combat-pool-resolver.mjs";

export const NPC_EQUIPMENT_TYPES = new Set(["weapon", "armor", "shield", "gear", "potion"]);
export const isNpcEquipment = item => NPC_EQUIPMENT_TYPES.has(item?.type) && weaponType(item) !== "natural";

// Book skill-tree preservation rule: the importer only ever seeds an EMPTY tree.
// A non-empty tree always carries potential GM book edits (name/value inputs on the
// NPC sheet), so reimports and repairs must never overwrite or merge into it —
// not even when it exactly matches another starter's book tree (duplicate repair).
// Returns the cloned baked tree when seeding, otherwise null (preserve as-is).
export function resolveNpcSkillTreeSync(current, baked) {
  if (!baked?.length) return null;
  if (!(current ?? []).length) return foundry.utils.deepClone(baked);
  return null;
}

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
