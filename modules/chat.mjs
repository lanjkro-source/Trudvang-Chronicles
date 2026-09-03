import { applyDamageToActor, applyDamageToDefenseItem } from "./damage-application.mjs";

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
  html.querySelectorAll("[data-action='toggle-roll-details']").forEach(button => {
    const details = button.closest(".chat-card")?.querySelector("[data-roll-details]");
    if (details) {
      details.classList.add("is-collapsed");
      details.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
    button.addEventListener("click", event => {
      event.preventDefault();
      const details = button.closest(".chat-card")?.querySelector("[data-roll-details]");
      if (!details) return;
      const collapsed = details.classList.toggle("is-collapsed");
      details.hidden = collapsed;
      button.setAttribute("aria-expanded", String(!collapsed));
    });
  });
  html.querySelectorAll("[data-action='damage']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const actor = await foundry.utils.fromUuid(button.dataset.actorUuid);
      if (button.dataset.naturalDamage === "true") {
        if (actor?.isOwner) await actor.rollNaturalDamage();
        return;
      }
      const item = await foundry.utils.fromUuid(button.dataset.itemUuid);
      if (actor?.isOwner && item) await actor.rollDamage(item, {usage: button.dataset.usage || "", longRange: button.dataset.longRange === "true"});
    });
  });
  html.querySelectorAll("[data-action='apply-effects']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const item = await foundry.utils.fromUuid(button.dataset.itemUuid);
      if (item?.isOwner) await item.applyEffects();
    });
  });
  html.querySelectorAll("[data-action='apply-damage']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const actor = await foundry.utils.fromUuid(button.dataset.targetActorUuid);
      const result = await applyDamageToActor({actor, damage: button.dataset.damage, ignoreArmor: button.dataset.ignoreArmor === "true"});
      if (!result) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CannotApplyDamage"));
      ui.notifications.info(game.i18n.format("TRUDVANG.Notification.DamageApplied", {target: actor.name, damage: result.bodyDamage}));
    });
  });
  html.querySelectorAll("[data-action='apply-defense-damage']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const item = await foundry.utils.fromUuid(button.dataset.targetItemUuid);
      const result = await applyDamageToDefenseItem({item, damage: button.dataset.damage});
      if (!result) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CannotApplyDamage"));
      ui.notifications.info(game.i18n.format("TRUDVANG.Notification.DefenseDamageApplied", {item: item.name, damage: result.integrityLoss}));
    });
  });
}
