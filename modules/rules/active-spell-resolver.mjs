/** One entry per successful casting, so repeated castings retain their own vitner cost. */
export function activeSpellCosts(item) {
  if (item?.type !== "spell" || item.system?.spellType !== "lasting") return [];
  const costs = Array.from(item.system.activeCastCosts ?? [], value => Math.max(0, Number(value) || 0));
  if (costs.length) return costs;
  // TEMPORARY WORLD MIGRATION: old worlds stored one active casting as a boolean and cost.
  return item.system.active ? [Math.max(0, Number(item.system.activeCost ?? item.system.cost) || 0)] : [];
}

export function activeSpellInstances(items) {
  return Array.from(items).flatMap(item => activeSpellCosts(item).map((cost, index) => ({item, index, cost})));
}

export function fatalActiveSpellCost(items) {
  return activeSpellInstances(items).reduce((sum, instance) => sum + instance.cost, 0);
}
