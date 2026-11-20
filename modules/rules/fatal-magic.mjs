const SCOPE = "trudvang-chronicles";

// Livre des règles pp. 144–145 / Player's Handbook pp. 84–85.
export const FATAL_MAGIC_ROWS = Object.freeze({
  21: {duration: "1d3", lethargy: true},
  23: {duration: "1d3", reduction: "1d10"},
  25: {duration: "1d3", reduction: "1d10", lethargy: true},
  29: {duration: "1d6", reduction: "1d10", lethargy: true},
  31: {days: 1, reduction: "1d10x>=9"},
  49: {days: 7, depleted: true}
});

export async function planFatalMagic(row, roll) {
  const rule = FATAL_MAGIC_ROWS[row];
  if (!rule) return null;
  const duration = rule.days ? {value: rule.days, units: "days"}
    : {value: await roll(rule.duration), units: "hours"};
  return {
    duration, lethargy: Boolean(rule.lethargy), depleted: Boolean(rule.depleted),
    reduction: rule.reduction ? await roll(rule.reduction) : 0
  };
}

export function fatalVitnerState(actor, normalMaximum) {
  const effects = Array.from(actor?.effects ?? []).filter(effect =>
    !effect.disabled && !effect.isSuppressed && !effect.duration?.expired)
    .map(effect => effect.flags?.[SCOPE]?.fatalMagic).filter(Boolean);
  if (effects.some(effect => effect.depleted)) return {max: 1, withheld: 0, depleted: true};
  const losses = effects.reduce((sum, effect) => sum + Math.max(0, Number(effect.reduction) || 0), 0);
  const withheld = Math.min(losses, Math.max(0, normalMaximum - 1));
  return {max: normalMaximum - withheld, withheld, depleted: false};
}

/** The stored value includes inaccessible points, so each point spent during
 * the reduction leaves one fewer point when the effect expires. */
export function storedVitnerForCurrent(actor, current) {
  return Math.max(0, current + (actor.fatalVitnerState?.withheld ?? 0) - Number(actor.system.modifiers?.vitnerValue || 0));
}
