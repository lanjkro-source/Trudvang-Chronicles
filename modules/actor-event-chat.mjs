const EVENT_ICONS = {damage: "fa-heart-crack", fear: "fa-face-grimace", movement: "fa-person-walking"};
const escapeText = value => String(value ?? "").replace(/[&<>"']/g,
  character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[character]);

/** Discreet public notices for actions without a source roll card to update. */
export async function postActorEvent({actor, kind, amount, mode = "", meters = 0}) {
  if (!actor?.isOwner || !EVENT_ICONS[kind]) return null;
  const Chat = globalThis.foundry?.documents?.ChatMessage?.implementation ?? globalThis.ChatMessage;
  if (!Chat) return null;
  const name = actor.token?.name || actor.name;
  const speaker = Chat.getSpeaker({actor, token: actor.token, alias: name});
  const key = `TRUDVANG.ChatEvent.${kind[0].toUpperCase()}${kind.slice(1)}`;
  const text = game.i18n.format(key, {actor: name, mode, meters, amount});
  const announcement = await Chat.create({speaker, whisper: [], blind: false,
    content: `<p class="trudvang ${kind}-notice"><i class="fas ${EVENT_ICONS[kind]}" aria-hidden="true"></i> ${escapeText(text)}</p>`});
  return {announcement, detail: null};
}
