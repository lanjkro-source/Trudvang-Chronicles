/** Independent qualifiers: a spell's origin never implies magic or armor bypass.
 * Material means the striking surface/projectile, not the grip or bow stock.
 * Extend these lists here (or CONFIG.TRUDVANG.weaponMaterials) as needed. */
export const WEAPON_MATERIALS = {
  wood: "fa-tree", steel: "fa-link", stone: "fa-mountain"
};
export const DAMAGE_ICONS = {
  magical: "fa-wand-magic-sparkles",
  melee: "fa-hand-fist", ranged: "fa-bullseye", other: "fa-ellipsis",
  slashing: "sword", piercing: "spearhead", bludgeoning: "fa-hammer",
  fire: "fa-fire", cold: "fa-snowflake", lightning: "fa-bolt",
  acid: "fa-vial", poison: "fa-skull-crossbones"
};
// Small native vectors avoid depending on optional FontAwesome weapon glyphs.
// Both show the weapon's working end; the spearhead retains a visible shaft.
export const DAMAGE_VECTOR_PATHS = {
  sword: "M12 1 15 4 14 14H10L9 4Z M6 14H18V17H6Z M10.5 17H13.5V21H10.5Z M10 21H14V23H10Z",
  spearhead: "M12 1C11 3 7 6 7 9L10.5 12H13.5L17 9C17 6 13 3 12 1Z M10 11H14V14H10Z M10.8 14H13.2V23H10.8Z"
};
export const DAMAGE_TYPES = ["slashing", "piercing", "bludgeoning", "fire", "cold", "lightning", "acid", "poison", "other"];
export const DAMAGE_NATURES = ["normal", "magical"];
export const DAMAGE_DELIVERIES = ["melee", "ranged", "other"];
export const DAMAGE_PROTECTIONS = ["normal", "magical", "magicalOrGrindsilver", "none"];

/** Stable catalog identities, never guessed from localized names at roll time. */
export const WEAPON_QUALIFICATIONS = {
  Glaaf: ["steel", "slashing"], HringSeax: ["steel", "slashing"], Klubb: ["wood", "bludgeoning"],
  KrumSwerd: ["steel", "slashing"], LillSpjot: ["steel", "piercing"], NagliKlubb: ["steel", "piercing"],
  Seax: ["steel", "piercing"], SplitAxi: ["steel", "slashing"], Stafur: ["wood", "bludgeoning"],
  BardaFaldir: ["steel", "bludgeoning"], BardaHammri: ["steel", "bludgeoning"], BardaKlot: ["steel", "bludgeoning"],
  BardaMakir: ["steel", "bludgeoning"], BardaSwerd: ["steel", "slashing"], BastjurKedja: ["steel", "bludgeoning"],
  BattleAxe: ["steel", "slashing"], BeardedAxe: ["steel", "slashing"], Broadsword: ["steel", "slashing"],
  DropiAxi: ["steel", "slashing"], Hakk: ["steel", "piercing"], Miekka: ["steel", "piercing"],
  StaafSpjot: ["steel", "piercing"], StakkSwerd: ["steel", "slashing"], StjornMakir: ["steel", "piercing"],
  BreidSpjot: ["steel", "piercing"], LongSpear: ["steel", "piercing"], TveiFaldir: ["steel", "bludgeoning"],
  TveiHakk: ["steel", "piercing"], TveiHammri: ["steel", "bludgeoning"], TveiKlubb: ["wood", "bludgeoning"],
  TwoHandedAxe: ["steel", "slashing"], TwoHandedSword: ["steel", "slashing"],
  Crossbow: ["steel", "piercing"], HuntingBow: ["steel", "piercing"], Longbow: ["steel", "piercing"],
  Slingu: ["stone", "bludgeoning"], StafurSlingu: ["stone", "bludgeoning"],
  TunkurKrossbogur: ["steel", "piercing"], TveBogi: ["steel", "piercing"], VolkKrossbogur: ["steel", "piercing"]
};
for (const key of ["LillSpjot", "Seax", "Miekka", "SplitAxi", "StaafSpjot"]) WEAPON_QUALIFICATIONS[`${key}Thrown`] = WEAPON_QUALIFICATIONS[key];
for (const size of ["Small", "Medium", "Large"]) {
  WEAPON_QUALIFICATIONS[`${size}Shield`] = ["wood", "bludgeoning"];
  WEAPON_QUALIFICATIONS[`${size}FurShield`] = ["wood", "bludgeoning"];
  WEAPON_QUALIFICATIONS[`${size}MetalShield`] = ["steel", "bludgeoning"];
}

export function damageQualification({item, context = {}, usage = ""} = {}) {
  const stored = item?.system?.damageQualification ?? {};
  const override = context.qualification ?? {};
  const delivery = ["throwing", "ranged"].includes(usage) ? "ranged"
    : ["melee", "natural", "unarmed"].includes(usage) ? "melee" : "other";
  const merged = {...stored, ...override};
  return {
    nature: DAMAGE_NATURES.includes(override.nature) ? override.nature : context.magicalWeapon ? "magical" : DAMAGE_NATURES.includes(stored.nature) ? stored.nature : "normal",
    delivery: DAMAGE_DELIVERIES.includes(override.delivery) ? override.delivery
      : ["", "magic"].includes(usage) && DAMAGE_DELIVERIES.includes(stored.delivery) ? stored.delivery : delivery,
    type: DAMAGE_TYPES.includes(merged.type) ? merged.type : "other",
    material: String(override.material ?? item?.system?.material ?? stored.material ?? ""),
    protection: DAMAGE_PROTECTIONS.includes(merged.protection) ? merged.protection : "normal"
  };
}

/** Future effects can supply independent, conjunctive resistance predicates.
 * Matching factors multiply once each; no resistance is invented from a name.
 * The application pipeline defaults to afterArmor, with an explicit beforeArmor
 * stage for barriers. The old consumable policy retains its existing order. */
export function qualifyDamage(amount, qualification, rules = []) {
  let value = Math.max(0, Number(amount) || 0);
  const applied = [];
  for (const rule of rules) {
    if (!rule || typeof rule !== "object" || rule.disabled || !["nature", "delivery", "type", "material"].every(key => !rule[key] || rule[key] === qualification[key])) continue;
    const factor = Number(rule.factor);
    if (rule.factor === null || rule.factor === "" || !Number.isFinite(factor) || factor < 0) continue;
    const before = value;
    value *= factor;
    applied.push({source: String(rule.source ?? ""), factor, before, after: value});
  }
  return {amount: Math.ceil(value), applied};
}
