export function registerChatListeners() {
  // renderChatMessageHTML exists since V13 and receives a native HTMLElement; the legacy
  // renderChatMessage (jQuery) variant is deprecated and removed in V16, so only the HTML
  // hook is registered.
  Hooks.on("renderChatMessageHTML", attachListeners);
}

function attachListeners(message, html) {
  if (!(html instanceof HTMLElement)) return;
  if (html.dataset.trudvangBound === "true") return;
  html.dataset.trudvangBound = "true";
  html.querySelectorAll("[data-action='damage']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const actor = await fromUuid(button.dataset.actorUuid);
      const item = await fromUuid(button.dataset.itemUuid);
      if (actor?.isOwner && item) await actor.rollDamage(item);
    });
  });
}
