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

/** Free perfect-success points buy additional levels at the original unit costs. */
export function resolvePerfectBonusSelection({powerLevels=[], entries=[], bonus=0, increments=[]}={}) {
 const budget=Number(bonus);
 if(!Number.isInteger(budget)||budget<0)throw new RangeError("Invalid perfect-success budget");
 let spent=0;
 const counts=powerLevels.map((level,index)=>{
  const previous=Number(entries[index]?.count??0),addition=Number(increments[index]??0),cost=Number(entries[index]?.unitCost??level.cost);
  if(!Number.isInteger(previous)||previous<0||!Number.isInteger(addition)||addition<0||!Number.isInteger(cost)||cost<0||(level.maxCount!=null&&previous+addition>Number(level.maxCount)))throw new RangeError("Invalid perfect-success level");
  spent+=addition*cost;return previous+addition;
 });
 if(spent>budget)throw new RangeError("Perfect-success budget exceeded");
 return {counts,spent,remaining:budget-spent};
}

/**
 * Health-for-vitner sacrifice (FR Rules, pp. 141-142, "Se sacrifier pour du vitner"):
 * 2 temporary vitner per 1 sacrificed health point. Returns null when the current
 * reserve already covers the total cost. Otherwise the missing vitner requires
 * ceil(shortfall / 2) health; the sacrifice is feasible only while the resulting
 * health stays at or above -maxHP, and the sacrificed health heals normally
 * afterwards because it is an ordinary Body Point loss.
 */
export function resolveVitnerSacrifice({totalCost = 0, currentVitner = 0, currentHP = 0, maxHP = 1} = {}) {
  const cost = Math.max(0, Number(totalCost) || 0);
  const reserve = Math.max(0, Number(currentVitner) || 0);
  const shortfall = cost - reserve;
  if (shortfall <= 0) return null;
  const health = Math.ceil(shortfall / 2);
  const hp = Number(currentHP) || 0;
  const max = Math.max(1, Number(maxHP) || 1);
  const resultingHP = hp - health;
  return {shortfall, health, vitner: 2 * health, resultingHP, feasible: resultingHP >= -max};
}
