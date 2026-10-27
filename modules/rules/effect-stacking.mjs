export const FATIGUED_ITEM = "trudvang-fatigued";
export const GRADED_EFFECT_IDS = new Set([FATIGUED_ITEM, "trudvang-hungry", "trudvang-thirsty"]);
export const isGradedEffect = effect => GRADED_EFFECT_IDS.has(effect?.system?.stackId);
export const effectDegree = effect => Math.max(1, Math.trunc(Number(effect?.system?.potency) || 1));

/** A stable identity is required even for effects authored without a stack ID. */
export function effectStackId(effect) {
  return String(effect.system?.stackId || "").trim()
    || (effect.name ? `${effect.origin || ""}:${effect.name}` : "");
}
