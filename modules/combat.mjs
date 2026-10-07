import {nextNpcCombatCycle} from "./rules/npc-combat-cycle.mjs";

const resourceUpdates = new WeakMap();

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

/** PCs and weapon actions of a large NPC last for its entire size-based cycle. */
export function combatResourcesRefreshIsDue(actor, round, combatId = actor?.system?.combatCycle?.combatId ?? "") {
  if (actor?.type !== "npc") return true;
  return nextNpcCombatCycle(actor.system.combatCycle, {combatId, round, size: actor.system.details?.size}).refresh;
}

/** Activate the highest-initiative combatant once every participant has rolled. */
export async function activateHighestInitiativeCombatant(combat, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started || !combatInitiativesAreReady(combat)) return false;
  // The updateCombatant hook can fire before Foundry rebuilds combat.turns.
  // Select from the current initiatives, then rebuild turns before activating it.
  const combatant = Array.from(combat.combatants?.values?.() ?? combat.combatants ?? [])
    .sort((left, right) => Number(right.initiative) - Number(left.initiative))[0];
  if (!combatant || typeof combatant.actor?.resetCombatPoints !== "function") return false;
  combat.setupTurns?.();
  const turn = Array.from(combat.turns ?? []).findIndex(candidate => candidate.id === combatant.id);
  if (combat.current?.combatantId !== combatant.id) await combat.update({turn: turn >= 0 ? turn : 0});
  await resetCurrentCombatantResources(combat, {combatantId: combatant.id, round: combat.round ?? combat.current?.round}, {isActiveGM});
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
  const actor = combatant.actor;
  if (actor.type !== "npc") {
    await actor.resetCombatPoints();
    return true;
  }
  // Leader activation and Foundry's turn hook can overlap. Serialize them and
  // read the persisted phase only after the preceding actor update completed.
  const pending = (resourceUpdates.get(actor) ?? Promise.resolve()).catch(() => {}).then(async () => {
    const cycle = nextNpcCombatCycle(actor.system.combatCycle, {combatId: combat.id ?? "",
      round: current.round ?? combat.round, size: actor.system.details?.size});
    if (!cycle.changed) return false;
    if (cycle.refresh) await actor.resetCombatPoints({cycle: cycle.state});
    else await actor.update({"system.combatCycle": cycle.state});
    return true;
  });
  resourceUpdates.set(actor, pending);
  try { return await pending; } finally {
    if (resourceUpdates.get(actor) === pending) resourceUpdates.delete(actor);
  }
}

/** Decrease the remaining life-spark duration of every dying combatant once per round. */
export async function decrementSurvivalRounds(combat, {isActiveGM = game.user.isActiveGM} = {}) {
  if (!isActiveGM || !combat?.started) return 0;
  const combatants = Array.from(combat.combatants?.values?.() ?? combat.combatants ?? []);
  const actors = [...new Map(combatants
    .map(combatant => [combatant.actor?.uuid ?? combatant.actor?.id, combatant.actor])
    .filter(([id, actor]) => id && actor)).values()];
  const dying = actors.filter(actor => Number(actor.system?.resources?.body?.current ?? actor.system?.resources?.body?.value ?? 1) <= 0
    && Number(actor.system?.survivalRounds ?? -1) > 0 && typeof actor.update === "function");
  await Promise.all(dying.map(actor => actor.update({"system.survivalRounds": Number(actor.system.survivalRounds) - 1})));
  return dying.length;
}

/** Register the Foundry lifecycle hook after the active combatant changes. */
export function registerCombatHooks() {
  Hooks.on("combatTurnChange", async (combat, previous, current) => {
    const roundStarted = isCombatRoundStart(previous, current);
    await resetCombatInitiatives(combat, previous, current);
    if (roundStarted) {
      await decrementSurvivalRounds(combat);
      return;
    }
    if (!isCombatTurnStart(previous, current)) return;
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
