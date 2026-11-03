import {TRANSFORMATION_TEMPLATES} from "../transformation-data.mjs";

/** Protection conferred by active blessings on this specific armor. */
export function blessedArmorEffects(item) {
  return Array.from(item?.effects ?? []).flatMap(effect => {
    const meta=effect.flags?.["trudvang-chronicles"]?.transformation;
    const definition=TRANSFORMATION_TEMPLATES[meta?.key]?.armorBlessing;
    if(!meta?.resolved || !definition || effect.disabled || effect.isSuppressed || effect.duration?.expired)return [];
    const extra=Math.max(0,Math.trunc(Number(meta.ruleTestContext?.countsById?.[definition.optionId] ?? meta.ruleTestContext?.counts?.[2])||0));
    return [{effect,normal:definition.normal+extra,magic:definition.magic===null?null:definition.magic+extra}];
  });
}
