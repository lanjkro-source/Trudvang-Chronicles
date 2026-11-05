import {escapeHtml} from "./helpers.mjs";

const S = "trudvang-chronicles";
const announced = new WeakSet();
const bearer = effect => effect.parent?.documentName === "Actor" ? effect.parent
  : effect.parent?.documentName === "Item" && effect.parent.parent?.documentName === "Actor" ? effect.parent.parent : null;

/** Called after a real clock transition, never while editing or refreshing a tick. */
export async function announceEffectStage(effect, {stage, name = effect.name} = {}) {
  if (!game.users?.activeGM?.isSelf || !game.settings?.get(S, "announceEffectStages")) return;
  const actor = bearer(effect);
  if (!actor || effect.inCompendium) return;
  return ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}),
    content: `<p class="trudvang effect-expiration-notice">${escapeHtml(game.i18n.format("TRUDVANG.Notification.EffectStageAdvanced", {effect: name, stage}))}</p>`});
}

/** Only explicit lifetime completion announces a disappearance. Manual deletion,
 * replacement, aura departure and intermediate stages remain silent. */
export async function announceEffectExpiration(effect, options = {}) {
  if (!options.trudvangExpired || !game.users?.activeGM?.isSelf
    || !game.settings?.get(S, "announceEffectExpiration") || announced.has(effect)) return;
  const actor = bearer(effect);
  if (!actor || effect.inCompendium) return;
  announced.add(effect);
  try {
    return await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}),
      content: `<p class="trudvang effect-expiration-notice">${escapeHtml(game.i18n.format("TRUDVANG.Notification.EffectExpired", {effect: effect.name}))}</p>`});
  } catch (error) {
    announced.delete(effect);
    throw error;
  }
}
