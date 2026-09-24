// Pure casting-cost calculation. Rune activations deliberately use a separate,
// item-bound resource model and must never be passed through this resolver.
export function powerLevelUnitCost(cost, affinity = 0) {
  const base = Math.max(0, Number(cost) || 0);
  if (affinity === -1) return Math.max(1, base - 1);
  if (affinity === 1) return base + 1;
  if (affinity === 2) return base * 2;
  return base;
}

export function resolvePowerLevelCost({baseCost = 0, powerLevels = [], counts = [], affinity = 0, strenuousBonus = 0} = {}) {
  const base = Math.max(0, Number(baseCost) || 0);
  const entries = powerLevels.map((level, index) => {
    const count = Number(counts[index] ?? 0);
    const maxCount = level.maxCount == null ? null : Number(level.maxCount);
    if (!Number.isInteger(count) || count < 0 || (maxCount != null && count > maxCount)) {
      throw new RangeError(`Invalid power-level count at index ${index}`);
    }
    const unitCost = powerLevelUnitCost(level.cost, affinity);
    return {id: level.id, effect: level.effect, count, baseUnitCost: Number(level.cost) || 0, unitCost, total: count * unitCost};
  });
  const bonus = Number(strenuousBonus);
  if (!Number.isInteger(bonus) || bonus < 0) throw new RangeError("Invalid strenuous bonus");
  const extra = entries.reduce((total, entry) => total + entry.total, 0);
  const strenuousCost = bonus * 2;
  return {base, entries, extra, strenuousCost, total: base + extra + strenuousCost};
}

export function spentMagicPoints({isDivine = false, success = false, critical = "", baseCost = 0, totalCost = 0} = {}) {
  return isDivine && !success && critical !== "failure" ? Number(baseCost) : Number(totalCost);
}
