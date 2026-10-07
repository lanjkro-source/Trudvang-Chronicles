import {npcCombatActionRounds} from "./npc-summary.mjs";

/** A phase is anchored to this creature's first turn, not to the world's round 1.
 * Repeated initiative/turn hooks in the same round must never refill or tick twice.
 * FR Bestiary p. 9: sizes >2–5 / >5–10 / >10 share CP over 2 / 3 / 4 rounds.
 */
export function nextNpcCombatCycle(previous = {}, {combatId = "", round = 0, size} = {}) {
  const max = npcCombatActionRounds(size);
  const currentRound = Math.max(0, Math.trunc(Number(round) || 0));
  const state = {combatId, round: currentRound, remaining: max, max,
    generation: Number(previous.generation || 0)};
  if (previous.combatId !== combatId || !previous.remaining || previous.max !== max) {
    return {state, refresh: true, changed: true};
  }
  const elapsed = currentRound - Number(previous.round || 0);
  if (elapsed <= 0) return {state: previous, refresh: false, changed: false};
  const refresh = elapsed >= previous.remaining;
  state.remaining = refresh ? max - ((elapsed - previous.remaining) % max) : previous.remaining - elapsed;
  return {state, refresh, changed: true};
}

export function npcCombatCycleDisplay(actor, combat) {
  const max = npcCombatActionRounds(actor.system.details?.size);
  const state = actor.system.combatCycle;
  return {max, remaining: state?.combatId === combat?.id && state?.max === max && state?.remaining > 0
    ? state.remaining : max};
}
