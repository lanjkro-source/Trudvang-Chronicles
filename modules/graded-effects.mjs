import {effectDegree} from "./rules/effect-stacking.mjs";
import {effectSource} from "./rules/effect-source.mjs";

export async function applyGradedEffect(actor, source) {
  if (!actor?.canUserModify(game.user, "update")) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.EffectPermission"));
  const template = source?.documentName === "ActiveEffect" ? source : Array.from(source?.effects ?? []).find(effect => !effect.disabled);
  if (!template) return null;
  const data = foundry.utils.deepClone(effectSource(template));
  delete data._id;
  data.origin = source.uuid ?? null;
  data.transfer = false;
  data.start = null;
  data.duration = {...data.duration, expired: false};
  data.system.degree = effectDegree(data);
  return actor.createTrudvangEffect(data);
}
