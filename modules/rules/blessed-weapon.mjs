import {TRANSFORMATION_TEMPLATES} from "../transformation-data.mjs";

/** Resolve only applied, active blessings attached to this particular weapon. */
export function blessedWeaponEffects(item) {
  return Array.from(item?.effects ?? []).flatMap(effect => {
    const meta = effect.flags?.["trudvang-chronicles"]?.transformation;
    const definition = TRANSFORMATION_TEMPLATES[meta?.key]?.weaponDamage;
    if (!meta?.resolved || !definition || effect.disabled || effect.isSuppressed || effect.duration?.expired) return [];
    const extra = Math.max(0, Math.trunc(Number(meta.ruleTestContext?.countsById?.[definition.optionId]
      ?? meta.ruleTestContext?.counts?.[2]) || 0));
    return [{effect, normal: definition.normal + extra, undead: definition.undead + extra, demon: definition.demon + extra}];
  });
}
