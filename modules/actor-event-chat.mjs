const EVENT_ICONS = {damage: "fa-heart-crack", fear: "fa-face-grimace", movement: "fa-person-walking"};
const escapeText = value => String(value ?? "").replace(/[&<>"']/g,
  character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[character]);

/** Include offline owners too, so the private log remains available on reconnect.
 * In particular, a token's synthetic actor supplies its own effective ownership.
 */
export function actorEventRecipients(actor, users) {
  return [...new Set(Array.from(users ?? []).filter(user => user.id
    && (user.isGM || actor.testUserPermission?.(user, "OWNER"))).map(user => user.id))];
}

/** Never put the exact amount in a public message, not even in flags or hidden HTML.
 * Foundry whispers carry the detailed message only to GMs and the actor's owners.
 */
export async function postActorEvent({actor, kind, amount, mode = "", meters = 0}) {
  if (!actor?.isOwner || !EVENT_ICONS[kind]) return null;
  const Chat = globalThis.foundry?.documents?.ChatMessage?.implementation ?? globalThis.ChatMessage;
  if (!Chat) return null;
  const name = actor.token?.name || actor.name;
  const speaker = Chat.getSpeaker({actor, token: actor.token, alias: name});
  const prefix = `TRUDVANG.ChatEvent.${kind[0].toUpperCase()}${kind.slice(1)}`;
  const content = text => `<div class="trudvang chat-card event-notice"><p class="card-flavor"><i class="fas ${EVENT_ICONS[kind]}" aria-hidden="true"></i> ${escapeText(text)}</p></div>`;
  const publicData = kind === "movement" ? {actor: name, mode, meters} : {actor: name};
  const announcement = await Chat.create({speaker, whisper: [], blind: false,
    content: content(game.i18n.format(`${prefix}Public`, publicData))});
  const whisper = actorEventRecipients(actor, game.users);
  // An empty whisper array is public in Foundry: fail closed when no recipient exists.
  const detail = whisper.length ? await Chat.create({speaker, whisper, blind: false,
    content: content(game.i18n.format(`${prefix}Private`, {...publicData, amount}))}) : null;
  return {announcement, detail};
}
