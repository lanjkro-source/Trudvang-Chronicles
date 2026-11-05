import {escapeHtml} from "./helpers.mjs";

const S = "trudvang-chronicles";
const announced = new WeakSet();

/** Only explicit lifetime completion announces a disappearance. Manual deletion,
 * replacement, aura departure and intermediate stages remain silent. */
export async function announceEffectExpiration(effect, options = {}) {
  if (!options.trudvangExpired || !game.users?.activeGM?.isSelf
    || !game.settings?.get(S, "announceEffectExpiration") || announced.has(effect)) return;
  const parent = effect.parent;
  const actor = parent?.documentName === "Actor" ? parent
    : parent?.documentName === "Item" && parent.parent?.documentName === "Actor" ? parent.parent : null;
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
