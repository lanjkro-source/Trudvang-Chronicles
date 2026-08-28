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
      const actor = await foundry.utils.fromUuid(button.dataset.actorUuid);
      if (button.dataset.naturalDamage === "true") {
        if (actor?.isOwner) await actor.rollNaturalDamage();
        return;
      }
      const item = await foundry.utils.fromUuid(button.dataset.itemUuid);
      if (actor?.isOwner && item) await actor.rollDamage(item);
    });
  });
  html.querySelectorAll("[data-action='apply-effects']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const item = await foundry.utils.fromUuid(button.dataset.itemUuid);
      if (item?.isOwner) await item.applyEffects();
    });
  });
}
