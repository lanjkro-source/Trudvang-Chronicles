/** Resolve one independently terminable casting per entry on the actor. */
export function activeSpellInstances(actor) {
  const items = Array.from(actor?.items ?? []);
  const byId = new Map(items.map(item => [item.id, item]));
  const castings = actor?.system?.activeSpellCastingsMigrated
    ? Array.from(actor.system.activeSpellCastings ?? [])
    : legacyActiveSpellCastings(items);
  return castings.flatMap(casting => {
    const item = byId.get(casting.itemId);
    if (item?.type !== "spell" || item.system?.spellType !== "lasting") return [];
    return [{id: casting.id, item, cost: Math.max(0, Number(casting.cost) || 0),
      startedAt: Number(casting.startedAt) || 0, duration: String(casting.duration || ""),
      powerLevelCounts: Array.from(casting.powerLevelCounts ?? [], count => Number(count) || 0)}];
  });
}

function legacyActiveSpellCastings(items) {
  // TEMPORARY WORLD MIGRATION: adopt explicit costs saved on spell items by v0.41.
  // An `active` boolean alone is unreliable and must not activate every known spell.
  return items.flatMap(item => {
    if (item.type !== "spell" || item.system?.spellType !== "lasting") return [];
    const costs = Array.from(item.system.activeCastCosts ?? []);
    if (costs.length) return costs.map((cost, index) => ({id: `legacy:${item.id}:${index}`,
      itemId: item.id, cost, duration: item.system.duration}));
    return item.system.active && Number(item.system.activeCost) > 0
      ? [{id: `legacy:${item.id}:0`, itemId: item.id, cost: item.system.activeCost, duration: item.system.duration}]
      : [];
  });
}

export function activeSpellRecords(actor) {
  return activeSpellInstances(actor).map(({id, item, cost, startedAt, duration, powerLevelCounts}) =>
    ({id, itemId: item.id, cost, startedAt, duration, powerLevelCounts}));
}

export function activeSpellCosts(actor, item) {
  return activeSpellInstances(actor).filter(casting => casting.item.id === item?.id).map(casting => casting.cost);
}

export function fatalActiveSpellCost(actor) {
  return activeSpellInstances(actor).reduce((sum, casting) => sum + casting.cost, 0);
}
