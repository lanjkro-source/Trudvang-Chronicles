export const FATIGUED_ITEM = "trudvang-fatigued";
export const GRADED_EFFECT_IDS = new Set([FATIGUED_ITEM, "trudvang-hungry", "trudvang-thirsty"]);
export const isGradedState = effect => GRADED_EFFECT_IDS.has(effect?.system?.stackId);
export const isGradedEffect = effect => effect?.system?.stacking === "stack" || isGradedState(effect) || Number(effect?.system?.degree) > 1;
export const effectDegree = effect => {
  const degree = effect?.system?.degree;
  if (degree === null || degree === undefined) {
    // TEMPORARY WORLD MIGRATION — the first three graded GM states stored their
    // degree in potency before the general degree field existed. They always
    // keep at least one degree.
    return Math.max(1, Math.trunc(Number(isGradedState(effect) ? effect?.system?.potency : 1)) || 1);
  }
  // An explicit 0 is a real degree (the permanent religion effects start there);
  // only a missing/null degree falls back to the default of 1.
  const truncated = Math.trunc(Number(degree));
  return Number.isFinite(truncated) ? truncated : 1;
};
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

/** Stack ids of the permanent religion effects (Serment de sang / Parjure). They
 * are added at degree 0 to every Ancienne Tradition actor, never expire, and can
 * never be deleted or disabled. */
export const PERMANENT_RELIGION_EFFECT_IDS = new Set(["trudvang-serment-de-sang", "trudvang-parjure"]);

/** Reference items the GM can drop on an actor to raise the degree of a graded
 * state. The three GM states are graded states (their own per-degree roll
 * penalty); the permanent religion effects scale their max-HP penalty by
 * degree like any other cumulative effect. */
export const STACKABLE_EFFECT_IDS = new Set([...GRADED_EFFECT_IDS, ...PERMANENT_RELIGION_EFFECT_IDS]);

/** Permanent religion effects carry the trudvang-chronicles.permanent flag and
 * are guarded wherever they can be edited or removed. */
export const isPermanentEffect = effect => PERMANENT_RELIGION_EFFECT_IDS.has(effect?.system?.stackId)
  || Boolean(effect?.flags?.["trudvang-chronicles"]?.permanent);

/** A permanent mark applied to an actor: it may never be deleted, disabled or
 * given an expiry. The world reference item stays editable, since it is only a
 * template the GM reads and drags from. */
export const isPermanentMark = effect => isPermanentEffect(effect) && effect?.parent?.documentName === "Actor";

/** Same test for an effect being created: the incoming data carries the
 * permanent flag before the document exists, so both are inspected. */
export const isPermanentMarkData = (effect, data) =>
  (isPermanentEffect(effect) || isPermanentEffect({flags: data?.flags})) && effect?.parent?.documentName === "Actor";

/** Actors being deleted take their permanent marks with them: the marks are
 * removed with their owner, never by their own deletion. */
const deletingActors = new WeakSet();
export const markActorDeleting = actor => { if (actor) deletingActors.add(actor); };
export const isActorDeleting = actor => Boolean(actor && deletingActors.has(actor));
