/** Whether Foundry advanced to a combatant's turn rather than rewinding the tracker. */
export function isCombatTurnStart(previous = {}, current = {}) {
  if (!current.combatantId) return false;
  if (Number(current.round) > Number(previous.round)) return true;
  if (Number(current.round) !== Number(previous.round)) return false;
  if (Number(current.turn) > Number(previous.turn)) return true;
  return Number(current.turn) === Number(previous.turn) && current.combatantId !== previous.combatantId;
}

/** Whether Foundry advanced to a new combat round rather than rewinding the tracker. */
export function isCombatRoundStart(previous = {}, current = {}) {
  return Number(current.round) > Number(previous.round);
}

/** Clear every combatant's initiative at the start of a new round. */
export async function resetCombatInitiatives(combat, previous, current, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started || !isCombatRoundStart(previous, current) || typeof combat.resetAll !== "function") return false;
  await combat.resetAll();
  return true;
}

/** Whether every combatant has supplied the initiative required to start the round. */
export function combatInitiativesAreReady(combat) {
  const combatants = Array.from(combat?.combatants?.values?.() ?? combat?.combatants ?? []);
  return combatants.length > 0 && combatants.every(combatant => combatant.initiative !== null
    && combatant.initiative !== undefined && Number.isFinite(Number(combatant.initiative)));
}

/** Activate the highest-initiative combatant once every participant has rolled. */
export async function activateHighestInitiativeCombatant(combat, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started || !combatInitiativesAreReady(combat)) return false;
  const combatant = Array.from(combat.turns ?? [])[0];
  if (!combatant || typeof combatant.actor?.resetCombatPoints !== "function") return false;
  const turn = Array.from(combat.turns).findIndex(candidate => candidate.id === combatant.id);
  if (combat.current?.combatantId !== combatant.id && turn >= 0) await combat.update({turn});
  await combatant.actor.resetCombatPoints();
  return true;
}

/** Refresh the cached combat-tracker resource for every combatant representing an updated actor. */
export function refreshCombatantResources(combat, actor) {
  const combatants = Array.from(combat?.combatants?.values?.() ?? combat?.combatants ?? []);
  const matching = combatants.filter(combatant => combatant.actor === actor || combatant.actor?.uuid === actor?.uuid || combatant.actorId === actor?.id);
  for (const combatant of matching) combatant.updateResource?.();
  return matching.length;
}

/** Reset per-turn combat resources for the combatant whose turn has just begun. */
export async function resetCurrentCombatantResources(combat, current, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started || !current?.combatantId) return false;
  const combatant = combat.combatants?.get?.(current.combatantId)
    ?? Array.from(combat.combatants?.values?.() ?? combat.combatants ?? []).find(candidate => candidate.id === current.combatantId);
  if (typeof combatant?.actor?.resetCombatPoints !== "function") return false;
  await combatant.actor.resetCombatPoints();
  return true;
}

/** Register the Foundry lifecycle hook after the active combatant changes. */
export function registerCombatHooks() {
  Hooks.on("combatTurnChange", async (combat, previous, current) => {
    const roundStarted = isCombatRoundStart(previous, current);
    await resetCombatInitiatives(combat, previous, current);
    if (roundStarted || !isCombatTurnStart(previous, current)) return;
    await resetCurrentCombatantResources(combat, current);
  });
  Hooks.on("updateCombatant", async (combatant, changed) => {
    if (!("initiative" in changed)) return;
    await activateHighestInitiativeCombatant(combatant.parent);
  });
  Hooks.on("updateActor", actor => {
    if (refreshCombatantResources(game.combat, actor)) ui.combat?.render();
  });
}
