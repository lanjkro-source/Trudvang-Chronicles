import {useExtract} from "./extract-roll.mjs";
import {escapeHtml} from "./helpers.mjs";

export const isConsumable = item => item?.type === "potion" || (item?.type === "gear" && item.system?.consumable === true);
const pendingUses = new WeakSet();

/** Consume one actor-owned unit. Repeated clicks while a prompt is open are ignored. */
export async function consumeInventoryItem(item, actor = item?.actor) {
  if (!actor?.isOwner || !isConsumable(item) || !Array.from(actor.items ?? []).includes(item) || pendingUses.has(item)) return null;
  const quantity = Number(item.system.quantity ?? 1);
  if (!Number.isInteger(quantity) || quantity <= 0) return null;
  pendingUses.add(item);
  try {
    const name = item.name;
    if (item.type === "potion" && !await useExtract(item, actor)) return null;
    // Re-read after the extract prompt; another client may have changed the stack.
    if (!Array.from(actor.items ?? []).includes(item) || Number(item.system.quantity ?? 1) <= 0) return null;
    const remaining = Number(item.system.quantity ?? 1) - 1;
    if (remaining <= 0) await actor.deleteEmbeddedDocuments("Item", [item.id]);
    else await actor.updateEmbeddedDocuments("Item", [{_id: item.id, "system.quantity": remaining}]);
    if (item.type !== "potion") {
      const text = game.i18n.format("TRUDVANG.Consumable.Used", {actor: actor.token?.name || actor.name, item: name});
      await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), whisper: [], blind: false,
        content: `<p class="trudvang consumable-notice">${escapeHtml(text)}</p>`});
    }
    return {remaining};
  } finally {
    pendingUses.delete(item);
  }
}
