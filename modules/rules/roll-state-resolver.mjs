import {ignoresWoundPenalties} from "./npc-summary.mjs";

/** Skill and Situation Rolls: FR Rules, pp. 332, 335; EN GM Guide, damage/fear levels.
 * Initiative already includes these states in its prepared value. Open trait
 * comparisons, damage, fear-factor and table rolls are not skill/situation tests.
 */
export function actorStateRollModifiers(actor, {combat = typeof actor.isInCombatActive === "function" ? actor.isInCombatActive() : Boolean(actor.isInActiveCombat)} = {}) {
  const surprised = actor.statuses?.has?.("trudvang-surprised") || Array.from(actor.allApplicableEffects?.() ?? actor.effects ?? []).some(effect =>
    !effect.disabled && !effect.isSuppressed && !effect.duration?.expired && effect.active !== false
    && Array.from(effect.statuses ?? []).includes("trudvang-surprised"));
  return [
    ...(combat && surprised ? [{labelKey: "TRUDVANG.Status.SurprisedPenalty", value: -5}] : []),
    {labelKey: "TRUDVANG.Dialog.WoundPenalty", value: ignoresWoundPenalties(actor) ? 0 : Number(actor.system?.damage?.penalty || 0)},
    {labelKey: "TRUDVANG.Resource.FearPenalty", value: Number(actor.system?.fearPenalty || 0)}
  ].filter(row => row.value !== 0);
}

export function rollModifierTotal(rows) {
  return rows.reduce((total, row) => total + (row.included ? 0 : Number(row.value || 0)), 0);
}
