const S = "trudvang-chronicles";

export function quagmireRecipient(effect) {
  if (effect.disabled || effect.isSuppressed || effect.duration?.expired) return null;
  return effect.flags?.[S]?.spellZoneRecipient?.quagmire ?? null;
}

export function quagmireMovement(land, effects) {
  const bogs = Array.from(effects ?? [], quagmireRecipient).filter(Boolean);
  if (!land || !bogs.length) return null;
  if (land.max <= 0) return {land, trapped: false};
  const trapped = bogs.some(bog => !bog.rescued && bog.depth >= land.max);
  const max = Math.max(0, Math.min(...bogs.map(bog => bog.rescued
    ? Math.min(1,land.max)
    : land.max - bog.depth)));
  const assisted = !trapped && bogs.some(bog => bog.rescued);
  return {trapped, baseMax:land.max,land:{max, metersPerTwo:assisted ? max : land.metersPerTwo}};
}

export function quagmireTravelBudget(actor, combat) {
  if (!actor.quagmireMovement) return null;
  const stored = actor.flags?.[S]?.quagmireTravel;
  const combatId = combat?.id ?? "", round = Number(combat?.round) || 0;
  const spent = stored?.combatId === combatId && stored?.round === round ? Number(stored.meters) || 0 : 0;
  return {combatId, round, spent, remaining:Math.max(0, actor.quagmireMovement.land.max - spent)};
}
