/** Portrait selection is independent from the prototype token's texture. */
export function normalizePortraitSources(sources) {
  return [...new Set(Array.from(sources ?? []).filter(src => typeof src === "string").map(src => src.trim()).filter(Boolean))];
}

export function sharedActorPortrait(actor) {
  return actor?.system?.sharedPortrait?.trim() || actor?.img || "";
}

export function actorPortraitSources(actor) {
  return normalizePortraitSources([actor?.img, ...(actor?.system?.portraits ?? []), actor?.system?.sharedPortrait]);
}

/** Validate both selections against the saved gallery, preserving a single portrait at minimum. */
export function actorPortraitSelectionUpdate(actor, {sources, sheet, share}) {
  const portraits = normalizePortraitSources(sources);
  if (!portraits.length) return null;
  const img = portraits.includes(sheet) ? sheet : portraits.includes(actor?.img) ? actor.img : portraits[0];
  const shared = portraits.includes(share) ? share : img;
  return {img, "system.portraits": portraits, "system.sharedPortrait": shared};
}
