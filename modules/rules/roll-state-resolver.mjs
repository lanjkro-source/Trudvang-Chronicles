import {ignoresWoundPenalties} from "./npc-summary.mjs";

/** Skill and Situation Rolls: FR Rules, pp. 332, 335; EN GM Guide, damage/fear levels.
 * Initiative already includes these states in its prepared value. Open trait
 * comparisons, damage, fear-factor and table rolls are not skill/situation tests.
 */
export function actorStateRollModifiers(actor) {
  return [
    {labelKey: "TRUDVANG.Dialog.WoundPenalty", value: ignoresWoundPenalties(actor) ? 0 : Number(actor.system?.damage?.penalty || 0)},
    {labelKey: "TRUDVANG.Resource.FearPenalty", value: Number(actor.system?.fearPenalty || 0)}
  ].filter(row => row.value !== 0);
}

export function rollModifierTotal(rows) {
  return rows.reduce((total, row) => total + Number(row.value || 0), 0);
}
