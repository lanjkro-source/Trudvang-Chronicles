/**
 * Dependency-light effect summary helpers, shared by the item/actor sheets and
 * the combat dock. Kept free of any import so test environments that mock only
 * a small slice of Foundry (combat-dock.test.mjs) can evaluate them, while
 * effects.mjs re-exports them for the rest of the system.
 */

export function effectChangeSummary(effect) {
  return Array.from(effect.system.changes || []).map(change => {
    const value = typeof change.value === "string" ? change.value : JSON.stringify(change.value);
    return `${change.key} ${change.type} ${value}`;
  }).join(" · ");
}

/** Short descriptive tooltip supplied by a catalogue effect, with a useful fallback for hand-made effects. */
export function effectTooltipSummary(effect) {
  const parentSummary = effect?.parent?.type === "effect" ? effect.parent.system?.summary : "";
  return effect?.flags?.["trudvang-chronicles"]?.transformation?.summary
    || effect?.system?.summary
    || parentSummary
    || effectChangeSummary(effect);
}
