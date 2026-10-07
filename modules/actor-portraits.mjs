/** Portrait selection is independent from the prototype token's texture. */
export function normalizePortraitSources(sources) {
  return [...new Set(Array.from(sources ?? []).filter(src => typeof src === "string").map(src => src.trim()).filter(Boolean))];
}

export function actorPortraitSources(actor) {
  return normalizePortraitSources([actor?.img, ...(actor?.system?.portraits ?? [])]);
}

/** Validate the sheet portrait against the saved gallery, preserving a single portrait at minimum. */
export function actorPortraitSelectionUpdate(actor, {sources, sheet}) {
  const portraits = normalizePortraitSources(sources);
  if (!portraits.length) return null;
  const img = portraits.includes(sheet) ? sheet : portraits.includes(actor?.img) ? actor.img : portraits[0];
  return {img, "system.portraits": portraits};
}
