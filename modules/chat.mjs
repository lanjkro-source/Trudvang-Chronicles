import {hasChatApplication, registerChatApplicationSocket, requestChatApplication, requestDamageTargets, requestDamageTargetRemoval} from "./chat-application.mjs";
import { useExtract } from "./extract-roll.mjs";
import { rollPackageAvailability } from "./package-roll.mjs";
import {playerTraitSituationDialog} from "./dice.mjs";
import {openPortraitPopout} from "./portrait.mjs";
import {hasTraitSituationResponse, registerTraitSituationSocket, requestTraitSituationResponse} from "./trait-situation-request.mjs";

const indicatedTraitTokens = new Map();

function clearIndicatedTraitToken(messageId) {
  const token = indicatedTraitTokens.get(messageId);
  if (token) token.setTarget(false);
  indicatedTraitTokens.delete(messageId);
}

export function registerChatListeners() {
  // renderChatMessageHTML exists since V13 and receives a native HTMLElement; the legacy
  // renderChatMessage (jQuery) variant is deprecated and removed in V16, so only the HTML
  // hook is registered.
  Hooks.on("renderChatMessageHTML", attachListeners);
  Hooks.on("updateChatMessage", message => clearIndicatedTraitToken(message.id));
  Hooks.on("deleteChatMessage", message => clearIndicatedTraitToken(message.id));
  registerTraitSituationSocket();
  registerChatApplicationSocket();
}

/**
 * Fallback for forced portraits: clients that missed the live socket emit
 * (stale code, late join) open the popout once when the flagged chat card
 * renders. Guarded to skip the author (already shown live), already-seen
 * messages (session), and old scrollback (2-minute freshness).
 */
function autoShowForcedPortrait(message, html) {
  if (!message.getFlag("trudvang-chronicles", "forceShowPortrait")) return;
  const seenKey = `trudvang-portrait-seen-${message.id}`;
  try {
    if (sessionStorage.getItem(seenKey)) return;
    sessionStorage.setItem(seenKey, "1");
  } catch (error) {
    return;
  }
  if (message.author?.id === game.user?.id) return;
  if (Date.now() - Number(message.timestamp ?? 0) > 120000) return;
  const control = html.querySelector("[data-action='show-portrait']");
  if (!control) return;
  openPortraitPopout({
    src: control.dataset.src || control.querySelector("img")?.src || "",
    title: control.dataset.title || "",
    uuid: control.dataset.uuid || ""
  });
}

function attachListeners(message, html) {
  if (!(html instanceof HTMLElement)) return;
  if (html.dataset.trudvangBound === "true") return;
  html.dataset.trudvangBound = "true";
  clearIndicatedTraitToken(message.id);
  autoShowForcedPortrait(message, html);
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
  html.querySelectorAll("[data-action='roll-fatal-effect']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const kind = button.dataset.fatalKind;
      const threshold = Number(button.dataset.fatalThreshold);
      const modifier = Number(button.dataset.fatalModifier);
      if (!["faith", "vitner"].includes(kind) || !Number.isInteger(threshold) || !Number.isInteger(modifier)) return;
      const actor = await foundry.utils.fromUuid(button.dataset.actorUuid);
      if (!actor?.isOwner) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CannotRollForActor"));
      button.disabled = true;
      try {
        const draw = await actor.rollFatalEffect(kind, {threshold, modifier});
        if (!draw?.results?.length) button.disabled = false;
      } catch (error) {
        button.disabled = false;
        throw error;
      }
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
  html.querySelectorAll("[data-action='add-damage-targets']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const tokens = Array.from(canvas.tokens?.controlled ?? []).filter(token => token.actor?.isOwner);
      if (!tokens.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Damage.NoSelectedTokens"));
      button.disabled = true;
      try {
        const result = await requestDamageTargets({message, tokens});
        if (result.status === "unavailable") ui.notifications.warn(game.i18n.localize("TRUDVANG.ChatApplication.Unavailable"));
      } finally { button.disabled = false; }
    });
  });
  html.querySelectorAll("[data-action='remove-damage-target']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      try {
        const result = await requestDamageTargetRemoval({message, actorUuid: button.dataset.targetActorUuid});
        if (result.status === "unavailable") ui.notifications.warn(game.i18n.localize("TRUDVANG.ChatApplication.Unavailable"));
      } finally { button.disabled = false; }
    });
  });
  html.querySelectorAll("[data-action='apply-damage']").forEach(button => {
    if (hasChatApplication(message, button.dataset.targetActorUuid, "body")) button.disabled = true;
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const actor = await foundry.utils.fromUuid(button.dataset.targetActorUuid);
      button.disabled = true;
      try {
        const token = button.dataset.targetTokenUuid ? await foundry.utils.fromUuid(button.dataset.targetTokenUuid) : null;
        const result = await requestChatApplication({message, actor, token, channel: "body", ignoreArmor: button.dataset.ignoreArmor === "true"});
        if (!["applied", "alreadyApplied"].includes(result.status)) {
          button.disabled = false;
          ui.notifications.warn(game.i18n.localize("TRUDVANG.ChatApplication.Unavailable"));
        }
      } catch (error) { button.disabled = false; throw error; }
    });
  });
  html.querySelectorAll("[data-action='apply-fear']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const controlled = [...new Map(Array.from(canvas.tokens?.controlled || [])
        .filter(token => token.actor?.type === "character" && token.actor.isOwner).map(token => [token.actor.uuid, token])).values()];
      if (!controlled.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledFearCharacters"));
      button.disabled = true;
      try {
        const results = await Promise.all(controlled.map(token => requestChatApplication({message, actor: token.actor, token, channel: "fear"})));
        if (results.some(result => result.status === "unavailable")) ui.notifications.warn(game.i18n.localize("TRUDVANG.ChatApplication.Unavailable"));
        else if (results.every(result => result.status === "alreadyApplied")) ui.notifications.info(game.i18n.localize("TRUDVANG.ChatApplication.AlreadyApplied"));
      } finally { button.disabled = false; }
    });
  });
  html.querySelectorAll("[data-action='apply-defense-damage']").forEach(button => {
    const actorUuid = button.closest(".damage-target")?.querySelector("[data-target-actor-uuid]")?.dataset.targetActorUuid;
    if (hasChatApplication(message, actorUuid, "defense", button.dataset.targetItemUuid)) button.disabled = true;
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const item = await foundry.utils.fromUuid(button.dataset.targetItemUuid);
      button.disabled = true;
      try {
        const result = await requestChatApplication({message, actor: item?.parent, channel: "defense", itemUuid: item?.uuid});
        if (!["applied", "alreadyApplied"].includes(result.status)) {
          button.disabled = false;
          ui.notifications.warn(game.i18n.localize("TRUDVANG.ChatApplication.Unavailable"));
        }
      } catch (error) { button.disabled = false; throw error; }
    });
  });
  html.querySelectorAll("[data-action='roll-trait-situation']").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      if (button.disabled) return;
      const request = message.getFlag("trudvang-chronicles", "traitSituation");
      const traitKey = request?.traitKey;
      const sv = Number(request?.sv);
      if (!traitKey || !Number.isInteger(sv)) return;
      const controlled = Array.from(canvas.tokens?.controlled || []).find(token =>
        ["character", "npc"].includes(token.actor?.type) && token.actor.isOwner);
      const actor = controlled?.actor ?? game.user.character;
      if (!actor) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledActorForTraitRoll"));
      if (hasTraitSituationResponse(message, actor.uuid)) {
        return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TraitSituationAlreadyRolled"));
      }
      const token = controlled ?? canvas.tokens?.placeables?.find(entry => entry.actor?.uuid === actor.uuid);
      const trait = actor.getTraitValue(traitKey);
      const effect = actor.getRollModifier({kind: "trait", traitKey});
      const traitLabel = game.i18n.localize(CONFIG.TRUDVANG?.traits?.[traitKey] ?? traitKey);
      const title = game.i18n.format("TRUDVANG.Dialog.TraitSituationPlayerTitle", {trait: traitLabel});
      button.disabled = true;
      try {
        const options = await playerTraitSituationDialog({title, traitLabel, traitValue: trait, effect, sv});
        if (!options) return;
        const status = await requestTraitSituationResponse({message, actor, token, modifier: options.modifier});
        if (status !== "recorded") ui.notifications.warn(game.i18n.localize(
          status === "alreadyRolled" ? "TRUDVANG.Warning.TraitSituationAlreadyRolled" : "TRUDVANG.Warning.TraitSituationUnavailable"));
      } finally {
        button.disabled = false;
      }
    });
  });
  html.querySelectorAll("[data-action='show-portrait']").forEach(control => {
    control.addEventListener("click", event => {
      event.preventDefault();
      openPortraitPopout({
        src: control.dataset.src || control.querySelector("img")?.src || "",
        title: control.dataset.title || "",
        uuid: control.dataset.uuid || ""
      });
    });
  });
  html.querySelectorAll("[data-action='locate-trait-situation-token']").forEach(control => {
    const resolveToken = () => canvas.tokens?.placeables?.find(token => token.document?.uuid === control.dataset.tokenUuid);
    const indicate = () => {
      const token = resolveToken();
      if (!token || token.isTargeted) return;
      clearIndicatedTraitToken(message.id);
      token.setTarget(true, {releaseOthers: false});
      indicatedTraitTokens.set(message.id, token);
    };
    const clear = () => clearIndicatedTraitToken(message.id);
    control.addEventListener("mouseenter", indicate);
    control.addEventListener("mouseleave", clear);
    control.addEventListener("focus", indicate);
    control.addEventListener("blur", clear);
    control.addEventListener("click", async event => {
      event.preventDefault();
      const token = resolveToken();
      if (token) await canvas.animatePan({x: token.center.x, y: token.center.y});
    });
  });
}
