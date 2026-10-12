const NO_TRAIT = "none";

/** Resolve a fixed attack's per-target VC while keeping a stable target reference
 * for any future effect application after a successful roll.
 */
export function resolveFixedAttackTargets({baseVC = 0, targetTrait = NO_TRAIT, targets = []} = {}) {
  const base = Number.isFinite(Number(baseVC)) ? Math.trunc(Number(baseVC)) : 0;
  const trait = String(targetTrait || NO_TRAIT);
  const resolve = token => {
    const actor = token?.actor ?? null;
    const value = trait === NO_TRAIT || !actor ? 0 : Number(actor.getTraitValue?.(trait)
      ?? actor.system?.effective?.traits?.[trait] ?? actor.system?.traits?.[trait] ?? 0);
    const traitValue = Number.isFinite(value) ? value : 0;
    return {
      token,
      actor,
      name: String(token?.name || actor?.name || token?.document?.name || ""),
      trait,
      traitValue,
      target: base - traitValue,
      effectTarget: actor ? {actorUuid: actor.uuid ?? "", tokenUuid: token?.document?.uuid ?? token?.uuid ?? ""} : null
    };
  };
  const rows = Array.from(targets ?? []).map(resolve);
  return rows.length ? rows : [resolve(null)];
}
