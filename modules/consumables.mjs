import {useExtract} from "./extract-roll.mjs";
import {escapeHtml} from "./helpers.mjs";
import {applyConsumableConsequences} from "./consumable-effects.mjs";
import {consequenceResultText} from "./consequences.mjs";

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
    const consequences = item.type !== "potion" ? await applyConsumableConsequences(item, actor) : null;
    // Re-read after the extract prompt; another client may have changed the stack.
    if (!Array.from(actor.items ?? []).includes(item) || Number(item.system.quantity ?? 1) <= 0) return null;
    const remaining = Number(item.system.quantity ?? 1) - 1;
    if (remaining <= 0) await actor.deleteEmbeddedDocuments("Item", [item.id]);
    else await actor.updateEmbeddedDocuments("Item", [{_id: item.id, "system.quantity": remaining}]);
    if (item.type !== "potion") {
      const text = game.i18n.format("TRUDVANG.Consumable.Used", {actor: actor.token?.name || actor.name, item: name});
      const tests = consequences.tests;
      await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), whisper: [], blind: false, rolls: consequences.rolls,
        flags: {"trudvang-chronicles": {consequenceTests: tests, consequenceActor: actor.uuid, consequenceSource: name}},
        content: `<div class="trudvang consumable-notice"><p>${escapeHtml(text)}</p>${consequences.rows.map(row=>`<p>${escapeHtml(consequenceResultText(row))}</p>`).join("")}${consequences.description?`<p>${escapeHtml(consequences.description)}</p>`:""}${tests.map((test,index)=>`<button type="button" data-action="consequence-resistance" data-test-index="${index}"><i class="fas fa-dice-d20" aria-hidden="true"></i> ${escapeHtml(test.action)}</button>`).join("")}</div>`});
    }
    return {remaining};
  } finally {
    pendingUses.delete(item);
  }
}
