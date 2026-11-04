import {WEAPON_QUALIFICATIONS} from "./rules/damage-qualifications.mjs";
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";

/** TEMPORARY WORLD MIGRATION: pre-qualification development worlds have neither
 * weapon materials nor the catalog's explicit damage metadata. Seed once, only
 * on identifiable catalog copies; never overwrite a later manual choice. */
export async function migrateDamageQualifications() {
  if (!game.user.isGM || game.users?.activeGM?.id && game.users.activeGM.id !== game.user.id) return;
  const actors = new Map(Array.from(game.actors ?? [], actor => [actor.uuid, actor]));
  for (const scene of game.scenes ?? []) for (const token of scene.tokens ?? []) {
    if (token.actor) actors.set(token.actor.uuid, token.actor);
  }
  const items = [...(game.items ?? []), ...Array.from(actors.values()).flatMap(actor => Array.from(actor.items ?? []))];
  for (const item of items) {
    if (!item.isOwner || item.getFlag("trudvang-chronicles", "damageQualificationVersion")) continue;
    const flags = item.flags?.["trudvang-chronicles"] ?? {};
    const powerId = item.system?.catalogId || flags.catalogId;
    const power = POWER_DETAILS_BY_ID[powerId]?.damageRoll?.qualification;
    const key = String(flags.starterId ?? "").split(".").at(-1);
    const weapon = ["weapon", "shield"].includes(item.type) ? WEAPON_QUALIFICATIONS[key] : null;
    if (!power && !weapon) continue;
    const stored = item.system?.damageQualification ?? {};
    const update = {"flags.trudvang-chronicles.damageQualificationVersion": 1};
    if (weapon) {
      if (!item.system.material) update["system.material"] = weapon[0];
      if (!stored.type || stored.type === "other") update["system.damageQualification.type"] = weapon[1];
      if (!stored.delivery || stored.delivery === "other") update["system.damageQualification.delivery"] = ["ranged","bowsSlings","crossbow"].includes(item.system.category) || item.system.isThrowingWeapon ? "ranged" : "melee";
    } else {
      // A non-default profile already represents a deliberate user choice.
      if ((!stored.type || stored.type === "other") && (!stored.protection || stored.protection === "normal") && stored.nature !== "magical") {
        update["system.damageQualification"] = power;
      }
      const note = game.i18n.localize(`TRUDVANG.Content.Power.${powerId}.DamageQualificationNote`);
      if (note && !note.startsWith("TRUDVANG.") && !item.system.damageQualificationNote) update["system.damageQualificationNote"] = note;
    }
    await item.update(update);
  }
}
