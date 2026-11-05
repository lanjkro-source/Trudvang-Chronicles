/** Independent qualifiers: a spell's origin never implies magic or armor bypass.
 * Material means the striking surface/projectile, not the grip or bow stock.
 * Extend these lists here (or CONFIG.TRUDVANG.weaponMaterials) as needed. */
export const WEAPON_MATERIALS = {
  natural: "fa-leaf", wood: "fa-tree", steel: "fa-link", bronze: "fa-ring", stone: "fa-mountain"
};
const naturalWeaponProfiles = {
  bite: {type: "piercing"}, morsure: {type: "piercing"},
  tusks: {type: "piercing"}, defense: {type: "piercing"}, defenses: {type: "piercing"}, defense: {type: "piercing"},
  horns: {type: "piercing"}, cornes: {type: "piercing"},
  claws: {type: "slashing"}, griffes: {type: "slashing"}, griffure: {type: "slashing"},
  griffesduloup: {type: "slashing"},
  defensesdumastomant: {type: "piercing"},
  impalingleg: {type: "piercing"}, patteempaleuse: {type: "piercing"},
  beak: {type: "piercing"}, bec: {type: "piercing"},
  hooves: {type: "bludgeoning"}, sabots: {type: "bludgeoning"}, kick: {type: "bludgeoning"}, ruade: {type: "bludgeoning"},
  sweep: {type: "bludgeoning"}, balayage: {type: "bludgeoning"},
  unarmed: {type: "bludgeoning"}, mainsnues: {type: "bludgeoning"},
  icebreath: {type: "cold", delivery: "ranged", material: "", protection: "normal"}, souffledeglace: {type: "cold", delivery: "ranged", material: "", protection: "normal"},
  magmabreath: {type: "fire", delivery: "ranged", material: "", protection: "normal"}, soufflemagmatique: {type: "fire", delivery: "ranged", material: "", protection: "normal"}, souffledemagma: {type: "fire", delivery: "ranged", material: "", protection: "normal"},
  firebreath: {type: "fire", delivery: "ranged", material: "", protection: "normal"}, souffledefeu: {type: "fire", delivery: "ranged", material: "", protection: "normal"}
};
const normalizeNaturalWeaponName = value => String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
export function naturalWeaponQualification(name) {
  const profile = naturalWeaponProfiles[normalizeNaturalWeaponName(name)];
  if (!profile) return null;
  const breath = profile.delivery === "ranged";
  return {material: breath ? "" : "natural", damageQualification: {
    nature: "normal", delivery: profile.delivery ?? "melee", type: profile.type, protection: profile.protection ?? "normal", ...(profile.material ? {material: profile.material} : {})
  }};
}
export const DAMAGE_ICONS = {
  magical: "fa-wand-magic-sparkles",
  melee: "fa-hand-fist", ranged: "fa-bullseye", other: "fa-ellipsis",
  slashing: "sword", piercing: "spearhead", bludgeoning: "fa-hammer",
  fire: "fa-fire", cold: "fa-snowflake", lightning: "fa-bolt",
  acid: "fa-vial", poison: "fa-skull-crossbones"
};
// External masked vectors work in sanitized dialogs as well as sheet templates.
export const DAMAGE_VECTOR_CLASSES = {
  sword: "damage-vector-sword", spearhead: "damage-vector-spearhead"
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
  const natural = item?.system?.category === "natural" ? naturalWeaponQualification(item.name) : null;
  const stored = item?.system?.damageQualification ?? {};
  const override = context.qualification ?? {};
  const delivery = ["throwing", "ranged"].includes(usage) ? "ranged"
    : ["melee", "natural", "unarmed"].includes(usage) ? "melee" : "other";
  const merged = {...natural?.damageQualification, ...stored, ...override};
  if (natural && stored.type === "other" && override.type === undefined) merged.type = natural.damageQualification.type;
  if (natural && stored.delivery === "other" && override.delivery === undefined) merged.delivery = natural.damageQualification.delivery;
  return {
    nature: DAMAGE_NATURES.includes(override.nature) ? override.nature : context.magicalWeapon ? "magical" : DAMAGE_NATURES.includes(stored.nature) ? stored.nature : "normal",
    delivery: DAMAGE_DELIVERIES.includes(override.delivery) ? override.delivery
      : ["", "magic"].includes(usage) && DAMAGE_DELIVERIES.includes(stored.delivery) ? stored.delivery : delivery,
    type: DAMAGE_TYPES.includes(merged.type) ? merged.type : "other",
    material: String(override.material ?? (item?.system?.material || stored.material || natural?.material || "")),
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
