import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";

export function purificationConsequence(context) {
  const profile = POWER_DETAILS_BY_ID[context?.sourceId]?.purification;
  if (!profile) return "";
  const count = id => Math.max(0, Number(context.countsById?.[id]) || 0);
  const litres = Object.entries(profile.increments)
    .reduce((total, [id, perLevel]) => total + count(id) * perLevel, profile.litres);
  const value = profile.lakeOptionId && count(profile.lakeOptionId)
    ? game.i18n.localize("TRUDVANG.WaterPurification.Lake")
    : litres + " L";
  return game.i18n.format("TRUDVANG.WaterPurification.Capacity", {value});
}

// TEMPORARY WORLD MIGRATION — remove object markers generated in 0.227.1.
export async function removeObsoletePurificationMarkers() {
  if (!game.users?.activeGM?.isSelf) return;
  const actors = new Map(Array.from(game.actors ?? [], actor => [actor.uuid, actor]));
  for (const scene of game.scenes ?? []) {
    for (const token of scene.tokens ?? []) if (token.actor) actors.set(token.actor.uuid, token.actor);
  }
  const items = new Set(game.items ?? []);
  for (const actor of actors.values()) for (const item of actor.items ?? []) items.add(item);
  for (const item of items) {
    const ids = Array.from(item.effects ?? []).filter(effect => {
      const meta = effect.flags?.["trudvang-chronicles"]?.transformation;
      return POWER_DETAILS_BY_ID[meta?.sourceId]?.purification && meta.key === meta.sourceId + "#purified-water";
    }).map(effect => effect.id);
    if (ids.length) await item.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}
