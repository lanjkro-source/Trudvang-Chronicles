export const FATIGUED_ITEM = "trudvang-fatigued";
export const GRADED_EFFECT_IDS = new Set([FATIGUED_ITEM, "trudvang-hungry", "trudvang-thirsty"]);
export const isGradedState = effect => GRADED_EFFECT_IDS.has(effect?.system?.stackId);
export const isGradedEffect = effect => effect?.system?.stacking === "stack" || isGradedState(effect) || Number(effect?.system?.degree) > 1;
export const effectDegree = effect => Math.max(1, Math.trunc(Number(effect?.system?.degree
  // TEMPORARY WORLD MIGRATION — the first three graded GM states stored their
  // degree in potency before the general degree field existed.
  ?? (isGradedState(effect) ? effect?.system?.potency : 1)) || 1));
export function gradedEffectName(effect) {
  const base = String(effect._source?.name ?? effect.name ?? "").trim();
  return `${base} ${effectDegree(effect)}`.trim();
}

/** Prepare a numeric contribution without changing its per-degree source value. */
export function cumulativeChangeValue(effect, change, actor, replacementData = actor?.system) {
  if (!effect || isGradedState(effect)) return change.value;
  const degree = effectDegree(effect);
  if (degree === 1) return change.value;
  const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
  const resolved = String(change.value ?? "").replace(/@([\w.]+)/gu, (_, path) => get(replacementData, path) ?? get(actor?.system, path) ?? get(actor, path) ?? 0);
  const value = Number(resolved);
  if (!Number.isFinite(value)) return change.value;
  if (["add", "subtract"].includes(change.type)) return String(value * degree);
  if (change.type === "multiply") return String(value ** degree);
  return change.value;
}

/** A stable identity is required even for effects authored without a stack ID. */
export function effectStackId(effect) {
  return String(effect.system?.stackId || "").trim()
    || ((effect._source?.name ?? effect.name) ? `${effect.origin || ""}:${effect._source?.name ?? effect.name}` : "");
}
