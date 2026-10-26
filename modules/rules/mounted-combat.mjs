// FR Rules p. 321: pay once at the start of each action round.
export const MOUNTED_STATUS = "trudvang-mounted";
export function mountedCombatCost(ridingLevel = 0) {
  return 15 - 3 * Math.max(0, Math.min(5, Math.trunc(Number(ridingLevel) || 0)));
}
export function isMounted(actor) {
  return Boolean(actor.statuses?.has?.(MOUNTED_STATUS) || Array.from(actor.allApplicableEffects?.() ?? actor.effects ?? []).some(effect =>
    !effect.disabled && !effect.isSuppressed && !effect.duration?.expired && effect.active !== false
    && Array.from(effect.statuses ?? []).includes(MOUNTED_STATUS)));
}
export function mountedCombatValues(choice) {
  const enabled = Boolean(choice?.enabled);
  const bonus = Number.isFinite(Number(choice?.bonus)) ? Number(choice.bonus) : 2;
  return {enabled, bonus: enabled ? bonus : 2, total: enabled ? bonus : 0};
}
