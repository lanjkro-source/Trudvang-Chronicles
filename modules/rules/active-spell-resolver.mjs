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
      powerLevelCounts: Array.from(casting.powerLevelCounts ?? [], count => Number(count) || 0),
      ...(casting.powerLevelSnapshot?.length ? {powerLevelSnapshot: Array.from(casting.powerLevelSnapshot, row => ({id: row.id, index: row.index, description: row.description, count: row.count, unitCost: row.unitCost}))} : {})}];
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
  return activeSpellInstances(actor).map(({id, item, cost, startedAt, duration, powerLevelCounts, powerLevelSnapshot}) =>
    ({id, itemId: item.id, cost, startedAt, duration, powerLevelCounts, ...(powerLevelSnapshot?.length ? {powerLevelSnapshot} : {})}));
}

export function activeSpellCosts(actor, item) {
  return activeSpellInstances(actor).filter(casting => casting.item.id === item?.id).map(casting => casting.cost);
}

export function fatalActiveSpellCost(actor) {
  return activeSpellInstances(actor).reduce((sum, casting) => sum + casting.cost, 0);
}

/** Find extant effects by the provenance stored on them, including synthetic
 * token actors on inactive scenes. An empty result does not prove that a cast
 * has ended: it may not have been applied yet or a document may be unavailable. */
export function maintainedSpellEffects({actors = [], scenes = []} = {}, {casterUuid, castingId} = {}) {
  if (!casterUuid || !castingId) return [];
  const candidates = [...actors];
  for (const scene of scenes) for (const token of scene.tokens ?? []) if (token.actor) candidates.push(token.actor);
  const seenActors = new Set(), seenEffects = new Set(), result = [];
  for (const actor of candidates) {
    if (!actor?.uuid || seenActors.has(actor.uuid)) continue;
    seenActors.add(actor.uuid);
    for (const effect of actor.effects ?? []) {
      const context = effect.flags?.["trudvang-chronicles"]?.transformation?.ruleTestContext;
      if (context?.casterUuid !== casterUuid || context?.castingId !== castingId || effect.duration?.expired) continue;
      if (!effect.uuid || seenEffects.has(effect.uuid)) continue;
      seenEffects.add(effect.uuid);
      result.push({actorUuid: actor.uuid, effectUuid: effect.uuid});
    }
  }
  return result;
}
