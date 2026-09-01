/** Whether Foundry advanced to a combatant's turn rather than rewinding the tracker. */
export function isCombatTurnStart(previous = {}, current = {}) {
  if (!current.combatantId) return false;
  if (Number(current.round) > Number(previous.round)) return true;
  if (Number(current.round) !== Number(previous.round)) return false;
  if (Number(current.turn) > Number(previous.turn)) return true;
  return Number(current.turn) === Number(previous.turn) && current.combatantId !== previous.combatantId;
}

/** Reset per-turn combat resources for the combatant whose turn has just begun. */
export async function resetCurrentCombatantResources(combat, current, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started || !current?.combatantId) return false;
  const combatant = combat.combatants?.get?.(current.combatantId)
    ?? Array.from(combat.combatants ?? []).find(candidate => candidate.id === current.combatantId);
  if (typeof combatant?.actor?.resetCombatPoints !== "function") return false;
  await combatant.actor.resetCombatPoints();
  return true;
}

/** Register the Foundry lifecycle hook after the active combatant changes. */
export function registerCombatHooks() {
  Hooks.on("combatTurnChange", async (combat, previous, current) => {
    if (!isCombatTurnStart(previous, current)) return;
    await resetCurrentCombatantResources(combat, current);
  });
}
