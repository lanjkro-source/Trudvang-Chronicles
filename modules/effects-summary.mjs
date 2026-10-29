/**
 * Dependency-light effect summary helpers, shared by the item/actor sheets and
 * the combat dock. Kept free of any import so test environments that mock only
 * a small slice of Foundry (combat-dock.test.mjs) can evaluate them, while
 * effects.mjs re-exports them for the rest of the system.
 */

export function isCarriedTransferredEffect(effect) {
  const item = effect?.item ?? (effect?.parent?.documentName === "Item" ? effect.parent : null);
  return Boolean(effect?.transfer && item && (item.actor || item.parent?.documentName === "Actor"));
}

export function effectChangeSummary(effect) {
  return Array.from(effect.system.changes || []).map(change => {
    const value = typeof change.value === "string" ? change.value : JSON.stringify(change.value);
    return `${change.key} ${change.type} ${value}`;
  }).join(" · ");
}

/** Short descriptive tooltip supplied by a catalogue effect, with a useful fallback for hand-made effects. */
export function effectTooltipSummary(effect) {
  const parentSummary = effect?.parent?.type === "effect" ? effect.parent.system?.summary : "";
  const meta=effect?.flags?.["trudvang-chronicles"]?.transformation;
  const summary=meta?.summary
    || effect?.system?.summary
    || parentSummary;
  // Catalogue wording also updates the tooltip of existing world copies;
  // their descriptions and mechanical changes remain untouched.
  if(!effect?.system?.summary&&meta?.key){
    const key=`TRUDVANG.Content.Transformation.${meta.key}.Summary`;
    const current=globalThis.game?.i18n?.localize(key);
    if(current&&current!==key)return current;
  }
  // Raw change paths and values belong to the effect's detailed sheet.
  return summary || effect?.name || "";
}
