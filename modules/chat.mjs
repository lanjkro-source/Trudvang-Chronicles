import { applyDamageToActor, applyDamageToDefenseItem } from "./damage-application.mjs";
import { useExtract } from "./extract-roll.mjs";
import { rollPackageAvailability } from "./package-roll.mjs";

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
  html.querySelectorAll("[data-action='open-item-sheet']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const item = await foundry.utils.fromUuid(button.closest("[data-item-uuid]")?.dataset.itemUuid);
      item?.sheet.render({force: true});
    });
  });
  html.querySelectorAll("[data-action='use-extract']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const actor = Array.from(canvas.tokens?.controlled || []).map(token => token.actor).find(Boolean);
      if (!actor) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledActor"));
      const item = await foundry.utils.fromUuid(button.closest("[data-item-uuid]")?.dataset.itemUuid);
      await useExtract(item, actor);
    });
  });
  html.querySelectorAll(".package-availability-roll").forEach(control => {
    const rollAvailability = async event => {
      event.preventDefault();
      event.stopPropagation();
      const item = await foundry.utils.fromUuid(control.closest("[data-item-uuid]")?.dataset.itemUuid);
      const situationValue = Number(control.dataset.packageSv ?? control.textContent.match(/\bSV\s+(\d+)/i)?.[1]);
      await rollPackageAvailability(item, situationValue);
    };
    control.addEventListener("click", rollAvailability);
    control.addEventListener("keydown", event => {
      if (["Enter", " "].includes(event.key)) rollAvailability(event);
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
  html.querySelectorAll("[data-action='apply-fear']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      const controlledActors = Array.from(canvas.tokens?.controlled || []).map(token => token.actor).filter(actor => actor?.type === "character" && actor.isOwner);
      if (!controlledActors.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledFearCharacters"));
      const results = await Promise.all(controlledActors.map(actor => actor.applyFearFactor(button.dataset.fear)));
      const applied = results.reduce((total, result) => total + Number(result?.applied || 0), 0);
      ui.notifications.info(game.i18n.format("TRUDVANG.Notification.FearApplied", {targets: results.filter(Boolean).length, amount: applied}));
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
