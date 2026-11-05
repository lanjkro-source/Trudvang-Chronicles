import {naturalWeaponQualification, WEAPON_QUALIFICATIONS} from "./rules/damage-qualifications.mjs";
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {CREATURE_ABILITY_ENTRIES} from "./creature-ability-data.mjs";

const legacyPowerProfiles = {
  "vitner-dimvitner:hand-of-death:1": {nature:"magical",delivery:"ranged",type:"other",protection:"magicalOrGrindsilver"},
  "holy-gerbanis-influence-of-jorn:death-gust:0": {"nature":"magical","delivery":"ranged","type":"other","protection":"none"},
  "holy-gerbanis-influence-of-jorn:the-breath-of-mogunda:5": {"nature":"magical","delivery":"ranged","type":"other","protection":"none"},
  "holy-gerbanis-influence-of-jorn:will-of-bodvildur:7": {"nature":"magical","delivery":"ranged","type":"other","protection":"none"},
  "holy-tenetnid-tablet-of-anger:power-of-blood:0": {"nature":"magical","delivery":"ranged","type":"other","protection":"normal"},
  "holy-tenetnid-tablet-of-anger:visions-of-the-oak:3": {"nature":"magical","delivery":"ranged","type":"other","protection":"normal"},
  "holy-tenetnid-tablet-of-anger:memory-of-a-martyr:7": {"nature":"magical","delivery":"ranged","type":"other","protection":"normal"},
  "vitner-dimvitner:darkness-of-dimhall:8": {nature:"magical",delivery:"other",type:"other",protection:"magicalOrGrindsilver"},
  "vitner-soil-craft:earthquake:2": {nature:"normal",delivery:"other",type:"bludgeoning",protection:"normal"},
  "vitner-flame-craft:flame-burst:3": {nature:"normal",delivery:"other",type:"fire",protection:"magical"},
  "vitner-flame-craft:sea-of-fire:7": {nature:"normal",delivery:"other",type:"fire",protection:"magical"},
  "holy-toikalokke-master-of-elements:earthquake:7": {nature:"normal",delivery:"other",type:"bludgeoning",protection:"normal"}
};

const sameQualification = (left = {}, right = {}) => ["nature", "delivery", "type", "protection", "material"]
  .every(key => String(left[key] ?? "") === String(right[key] ?? ""));

/** TEMPORARY WORLD MIGRATION: pre-qualification development worlds have neither
 * natural-weapon materials nor the catalog's reviewed damage metadata. Version 4
 * updates only profiles that still match the exact pre-review defaults. It never
 * overwrites a qualification that differs from those defaults. */
export async function migrateDamageQualifications() {
  if (!game.user.isGM || game.users?.activeGM?.id && game.users.activeGM.id !== game.user.id) return;
  const actors = new Map(Array.from(game.actors ?? [], actor => [actor.uuid, actor]));
  for (const scene of game.scenes ?? []) for (const token of scene.tokens ?? []) {
    if (token.actor) actors.set(token.actor.uuid, token.actor);
  }
  const items = [...(game.items ?? []), ...Array.from(actors.values()).flatMap(actor => Array.from(actor.items ?? []))];
  const abilityById = new Map(CREATURE_ABILITY_ENTRIES.map(entry => [entry.id, entry]));
  for (const item of items) {
    if (!item.isOwner || Number(item.getFlag("trudvang-chronicles", "damageQualificationVersion") ?? 0) >= 4) continue;
    const flags = item.flags?.["trudvang-chronicles"] ?? {};
    const powerId = item.system?.catalogId || flags.catalogId;
    const power = POWER_DETAILS_BY_ID[powerId];
    const key = String(flags.starterId ?? "").split(".").at(-1);
    const weapon = ["weapon", "shield"].includes(item.type) ? WEAPON_QUALIFICATIONS[key] : null;
    const natural = item.type === "weapon" && item.system?.category === "natural" ? naturalWeaponQualification(item.name) : null;
    const ability = item.type === "creatureAbility" ? abilityById.get(item.system?.catalogId) : null;
    if (!power && !weapon && !natural && !ability) continue;
    const sourceSystem = item._source?.system ?? {};
    const stored = sourceSystem.damageQualification ?? (natural
      ? {nature:"normal",delivery:"other",type:"other",protection:"normal",material:""}
      : item.system?.damageQualification ?? {});
    const update = {"flags.trudvang-chronicles.damageQualificationVersion": 4};
    if (natural) {
      const oldNaturalDefault = {nature:"normal",delivery:"other",type:"other",protection:"normal",material:""};
      if (sameQualification(stored, oldNaturalDefault)) {
        if (!sourceSystem.material) update["system.material"] = natural.material || "";
        update["system.damageQualification"] = natural.damageQualification;
      }
    } else if (weapon) {
      // Keep v1's equipment backfill, but only fill blanks/defaults; never replace a
      // field that a GM has already changed.
      if (!sourceSystem.material) update["system.material"] = weapon[0];
      if (!stored.type || stored.type === "other") update["system.damageQualification.type"] = weapon[1];
      if (!stored.delivery || stored.delivery === "other") update["system.damageQualification.delivery"] = ["ranged","bowsSlings","crossbow"].includes(item.system.category) || item.system.isThrowingWeapon ? "ranged" : "melee";
    } else if (power) {
      const target = power.damageQualification ?? power.damageRoll?.qualification;
      if (target) {
        const legacy = legacyPowerProfiles[powerId] ?? power.damageRoll?.qualification ?? {nature:"magical",delivery:/^(personal|personnelle|contact|touch)/i.test(item.system?.range ?? "") ? "melee" : "ranged",type:"other",protection:"normal"};
        const legacyWithMaterial = {nature:legacy.nature,delivery:legacy.delivery,type:legacy.type,protection:legacy.protection,material:legacy.material ?? ""};
        const targetWithMaterial = {nature:target.nature,delivery:target.delivery,type:target.type,protection:target.protection,material:target.material ?? ""};
        if ((!sourceSystem.damageQualification || sameQualification(stored, legacyWithMaterial))
          && !sameQualification(legacyWithMaterial, targetWithMaterial)) {
          update["system.damageQualification"] = target;
        }
      }
      const note = game.i18n.localize(`TRUDVANG.Content.Power.${powerId}.DamageQualificationNote`);
      if (note && !note.startsWith("TRUDVANG.") && !item.system.damageQualificationNote) update["system.damageQualificationNote"] = note;
    } else if (ability) {
      const target = ability.damageQualification;
      const oldDefault = {nature:"normal",delivery:"other",type:"other",protection:"normal",material:""};
      const sourceQualification = sourceSystem.damageQualification;
      if (target && !sameQualification(target, oldDefault) && (!sourceQualification || sameQualification(sourceQualification, oldDefault))) update["system.damageQualification"] = target;
    }
    await item.update(update);
  }
}
