export function registerChatListeners() {
  Hooks.on("renderChatMessageHTML", attachListeners);
  Hooks.on("renderChatMessage", attachListeners);
}

function attachListeners(message, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  if (root.dataset.trudvangBound === "true") return;
  root.dataset.trudvangBound = "true";
  root.querySelectorAll("[data-action='damage']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const actor = await fromUuid(button.dataset.actorUuid);
      const item = await fromUuid(button.dataset.itemUuid);
      if (actor?.isOwner && item) await actor.rollDamage(item);
    });
  });
}
