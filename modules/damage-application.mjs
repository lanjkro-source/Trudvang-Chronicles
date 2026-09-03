import { weaponUsesTwoHands } from "./rules/combat-pool-resolver.mjs";

const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integrity = item => number(item?.system?.breach?.value);
const protection = item => Math.ceil(Math.max(0, integrity(item)) / 10);

/** The shield-hand item (or a two-handed weapon) which can receive a parried hit. */
export function defensiveItem(actor) {
  const equipment = Array.from(actor?.items || []).filter(item => item?.system?.equipped);
  return equipment.find(item => item.type === "shield")
    ?? equipment.find(item => item.type === "weapon" && item.system?.hand === "offHand")
    ?? equipment.find(item => item.type === "weapon" && weaponUsesTwoHands(item))
    ?? null;
}

/** Snapshot the roller's currently targeted actors for inclusion in a damage card. */
export function prepareDamageTargets(targets) {
  const seen = new Set();
  return Array.from(targets || []).flatMap(token => {
    const actor = token?.actor;
    if (!actor?.uuid || seen.has(actor.uuid)) return [];
    seen.add(actor.uuid);
    const defense = defensiveItem(actor);
    return [{
      actorUuid: actor.uuid,
      name: token.name || actor.name,
      img: token.document?.texture?.src || actor.img,
      defenseItemUuid: defense?.uuid || "",
      defenseItemName: defense?.name || ""
    }];
  });
}

/**
 * Resolve physical damage through every worn armor item, then the target's
 * remaining protection (natural armor and effects). Each armor item loses the
 * excess that passes through its current VP; the remainder reaches Body Points.
 */
export function calculateArmoredDamage({damage, totalProtection, armor = []} = {}) {
  let remaining = Math.max(0, Math.trunc(number(damage)));
  const armorProtection = armor.reduce((total, item) => total + protection(item), 0);
  const armorDamage = armor.map(item => {
    const excess = Math.max(0, remaining - protection(item));
    remaining = excess;
    return {item, integrityLoss: excess, integrity: integrity(item) - excess};
  });
  const otherProtection = Math.max(0, Math.trunc(number(totalProtection)) - armorProtection);
  return {bodyDamage: Math.max(0, remaining - otherProtection), armorDamage};
}

/** Apply damage to the target's Body Points, optionally resolving worn armor first. */
export async function applyDamageToActor({actor, damage, ignoreArmor = false} = {}) {
  if (!actor?.isOwner) return null;
  const amount = Math.max(0, Math.trunc(number(damage)));
  const wornArmor = Array.from(actor.items || []).filter(item => item.type === "armor" && item.system?.equipped);
  const armor = ignoreArmor ? [] : wornArmor;
  const wornArmorProtection = wornArmor.reduce((total, item) => total + protection(item), 0);
  const totalProtection = ignoreArmor
    ? Math.max(0, number(actor.system?.protection) - wornArmorProtection)
    : actor.system?.protection;
  const result = calculateArmoredDamage({damage: amount, totalProtection, armor});
  const armorUpdates = result.armorDamage
    .filter(entry => entry.integrityLoss > 0)
    .map(entry => ({_id: entry.item.id, "system.breach.value": entry.integrity}));
  if (armorUpdates.length) await actor.updateEmbeddedDocuments("Item", armorUpdates);
  const body = number(actor.system?.resources?.body?.current ?? actor.system?.resources?.body?.value);
  if (result.bodyDamage) await actor.update({"system.resources.body.value": body - result.bodyDamage});
  return result;
}

/** Apply a parried hit to a shield-hand or two-handed weapon, never to its bearer. */
export async function applyDamageToDefenseItem({item, damage} = {}) {
  if (!item?.isOwner) return null;
  const amount = Math.max(0, Math.trunc(number(damage)));
  const integrityLoss = Math.max(0, amount - protection(item));
  const nextIntegrity = integrity(item) - integrityLoss;
  if (integrityLoss) await item.update({"system.breach.value": nextIntegrity});
  return {integrityLoss, integrity: nextIntegrity};
}
