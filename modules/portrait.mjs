import { escapeHtml, renderTemplate } from "./helpers.mjs";
import {actorPortraitSelectionUpdate, actorPortraitSources, normalizePortraitSources} from "./actor-portraits.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const SOCKET_CHANNEL = `system.${SYSTEM_ID}.showPortrait`;
let socketRegistered = false;

function canEditPortraits(actor) {
  return Boolean(actor?.isOwner && !(actor.compendium ?? game.packs?.get(actor.pack))?.locked);
}

async function availablePortraits(actor) {
  const sources = actorPortraitSources(actor);
  // TEMPORARY WORLD MIGRATION — Bestiary actors imported in 0.65.0 only stored
  // the first portrait. Offer their remaining source images without changing
  // the saved avatar, token texture or any customized gallery.
  const bestiaryId = actor.flags?.[SYSTEM_ID]?.bestiaryId;
  if (bestiaryId && !actor.system?.portraits?.length) {
    const {BESTIARY_ENTRIES} = await import("./bestiary-catalog-data.mjs");
    const entry = BESTIARY_ENTRIES.find(row => row.id === bestiaryId);
    return normalizePortraitSources([...sources, ...(entry?.actor.system.portraits ?? [])]);
  }
  return sources;
}

function portraitGalleryHTML(actor, sources, {managing = false, sheet = actor.img} = {}) {
  const text = key => escapeHtml(game.i18n.localize(`TRUDVANG.Portrait.${key}`));
  const attribute = value => escapeHtml(value).replaceAll('"', "&quot;");
  return sources.map((src, index) => {
    const name = escapeHtml(game.i18n.format("TRUDVANG.Portrait.Numbered", {number: index + 1}));
    const selected = src === sheet;
    return `<div class="portrait-choice${selected ? " selected" : ""}" data-portrait-index="${index}">
      ${managing ? `<img src="${attribute(src)}" alt="${name}" loading="lazy">`
        : `<label class="portrait-choice-preview"><input type="radio" name="sharePortrait" value="${index}" ${selected ? "checked" : ""}><img src="${attribute(src)}" alt="${name}" loading="lazy"></label>`}
      <span class="portrait-choice-name" title="${attribute(src)}">${name}</span>
      ${managing ? `<div class="portrait-use-options">
        <label><input type="radio" name="sheetPortrait" value="${index}" ${src === sheet ? "checked" : ""}>${text("Sheet")}</label>
      </div><button type="button" class="portrait-remove" data-remove-portrait="${index}" title="${text("Remove")}" aria-label="${text("Remove")}" ${sources.length === 1 ? "disabled" : ""}><i class="fas fa-trash" aria-hidden="true"></i></button>` : ""}
    </div>`;
  }).join("");
}

/** Manage the sheet portrait and gallery; cancellation does not save any change. */
export async function manageActorPortraits(actor) {
  if (!canEditPortraits(actor)) return false;
  let sources = await availablePortraits(actor);
  let sheet = actor.img;
  const DialogClass = foundry.applications.api.DialogV2;
  class PortraitGalleryDialog extends DialogClass {
    async _onRender(context, options) {
      await super._onRender(context, options);
      const root = this.element;
      const grid = root.querySelector(".portrait-grid");
      const readSelections = () => {
        sheet = sources[Number(root.querySelector('[name="sheetPortrait"]:checked')?.value)] ?? sheet;
      };
      const refresh = () => { grid.innerHTML = portraitGalleryHTML(actor, sources, {managing: true, sheet}); };
      grid.addEventListener("change", () => {
        readSelections();
        grid.querySelectorAll(".portrait-choice").forEach(card => card.classList.toggle("selected", sources[Number(card.dataset.portraitIndex)] === sheet));
      });
      grid.addEventListener("click", event => {
        const button = event.target.closest("[data-remove-portrait]");
        if (!button || sources.length <= 1) return;
        readSelections();
        sources.splice(Number(button.dataset.removePortrait), 1);
        if (!sources.includes(sheet)) sheet = sources[0];
        refresh();
      });
      root.querySelector("[data-add-portrait]").addEventListener("click", () => {
        const Picker = foundry.applications.apps.FilePicker.implementation;
        new Picker({type: "image", current: sheet, callback: src => {
          readSelections();
          sources = normalizePortraitSources([...sources, src]);
          refresh();
        }}).browse();
      });
    }
  }
  const answered = await PortraitGalleryDialog.wait({
    window: {title: game.i18n.format("TRUDVANG.Portrait.GalleryTitle", {actor: actor.name}), resizable: true},
    classes: ["trudvang", "portrait-picker-window"], position: {width: 640},
    content: `<div class="trudvang roll-dialog portrait-dialog portrait-manager">
      <p>${escapeHtml(game.i18n.localize("TRUDVANG.Portrait.GalleryHint"))}</p>
      <div class="portrait-grid">${portraitGalleryHTML(actor, sources, {managing: true, sheet})}</div>
      <button type="button" data-add-portrait><i class="fas fa-plus" aria-hidden="true"></i> ${escapeHtml(game.i18n.localize("TRUDVANG.Portrait.Add"))}</button>
    </div>`,
    buttons: [{action: "save", label: game.i18n.localize("TRUDVANG.Portrait.Save"), default: true,
      callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        return actorPortraitSelectionUpdate(actor, {sources,
          sheet: sources[Number(root.querySelector('[name="sheetPortrait"]:checked')?.value)]});
      }}, {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}],
    modal: false, rejectClose: false
  });
  if (!answered || !canEditPortraits(actor)) return false;
  return actor.update(answered);
}

/**
 * Open an actor portrait in a large popout window.
 *
 * V14 form is a single options object: `new ImagePopout({src, uuid,
 * window: {title}})` — the old positional `(src, {...})` form is deprecated
 * since V13 and removed in V15. The `globalThis.ImagePopout` fallback is kept
 * in a dead branch for older clients.
 */
export function openPortraitPopout({ src, title = "", uuid = "" } = {}) {
  if (!src) return null;
  const NamespacedPopout = foundry.applications?.apps?.ImagePopout;
  const popout = NamespacedPopout
    ? new NamespacedPopout({ src, uuid, window: { title } })
    : new globalThis.ImagePopout(src, { title, uuid });
  popout.render({ force: true });
  return popout;
}

/**
 * Post an actor portrait to chat and, when requested by the GM, force the
 * large popout on every connected client. A non-GM `forceAll` request only
 * posts the chat card: the socket emit is silently skipped.
 */
export async function showActorPortrait(actor, { forceAll = false, src = actor?.img } = {}) {
  if (!actor) return null;
  if (!src) return null;
  forceAll = Boolean(forceAll && game.user?.isGM);
  const title = actor.name;
  const uuid = actor.uuid;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/portrait-card.hbs", {
    actorName: title,
    actorImg: src,
    actorUuid: uuid
  });
  // The flag doubles as a persistent fallback: clients that miss the live
  // socket emit (stale code, late join) still open the popout once when the
  // chat card renders (see attachListeners in chat.mjs).
  const message = await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    flags: { [SYSTEM_ID]: { forceShowPortrait: forceAll } }
  });
  if (forceAll && game.user?.isGM) {
    openPortraitPopout({ src, title, uuid });
    console.info(`Trudvang Chronicles | Sharing portrait "${title}" with all connected players.`);
    game.socket?.emit(SOCKET_CHANNEL, { src, title, uuid });
  }
  return message;
}

/**
 * Ask which portrait to share: preview plus an opt-in checkbox that forces
 * the large display on every connected player. Cancel (or closing the
 * dialog) resolves false and posts nothing.
 */
export async function showActorPortraitDialog(actor) {
  if (!actor) return false;
  const sources = await availablePortraits(actor);
  if (!sources.length) return false;
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const content = `
    <div class="trudvang roll-dialog portrait-dialog">
      <p>${escapeHtml(game.i18n.localize("TRUDVANG.Portrait.ShareHint"))}</p>
      <div class="portrait-grid">${portraitGalleryHTML(actor, sources)}</div>
      ${game.user?.isGM ? `<label class="checkbox"><input type="checkbox" name="forceAll"> ${escapeHtml(game.i18n.localize("TRUDVANG.Portrait.ForceAll"))}</label>` : ""}
    </div>`;
  const answered = await DialogClass.wait({
    window: { title: game.i18n.format("TRUDVANG.Portrait.DialogTitle", { actor: actor.name }) },
    classes: ["trudvang", "portrait-picker-window"], position: {width: 560},
    content,
    buttons: [
      {
        action: "share",
        icon: "fas fa-image",
        label: game.i18n.localize("TRUDVANG.Portrait.Send"),
        default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return {src: sources[Number(root.querySelector('[name="sharePortrait"]:checked')?.value)] ?? actor.img,
            forceAll: Boolean(root.querySelector("[name=forceAll]")?.checked) };
        }
      },
      { action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false }
    ],
    modal: false,
    rejectClose: false
  });
  if (!answered) return false;
  return showActorPortrait(actor, answered);
}

function actorFromDirectoryEntry(...args) {
  // V14 calls visible(li) but onClick(event, li): scan every argument for a
  // usable directory row instead of assuming a fixed position.
  for (const arg of args) {
    const element = arg instanceof HTMLElement ? arg
      : arg?.target instanceof HTMLElement
        ? arg.target.closest("[data-entry-id], [data-document-id]") ?? arg.currentTarget ?? null
        : null;
    const id = element?.dataset?.documentId ?? element?.dataset?.entryId;
    const actor = id ? game.actors?.get(id) : null;
    if (actor) return actor;
  }
  return null;
}

export function registerPortraitDirectoryHook() {
  // V13+ dispatches per-document hooks built by template literal:
  // Hooks.callAll(`get${documentName}ContextOptions`, application, menuItems).
  // For the Actors tab that is getActorContextOptions — the generic
  // getDocumentContextOptions name is never dispatched (it only appears in
  // JSDoc), and the V12 getActorDirectoryEntryContext no longer fires either.
  //
  // V14 also renamed the ContextMenuEntry fields — {name, condition, callback}
  // became {label, visible, onClick}, with `label` now required. Entries still
  // using the old names fail silently here, so keep the shapes below.
  //
  // Register at init (see trudvang.mjs), never in ready: these menus are built
  // once at first render, so a late listener never runs.
  Hooks.on("getActorContextOptions", (application, menuItems) => {
    if (!Array.isArray(menuItems)) return;
    menuItems.push({
      label: game.i18n.localize("TRUDVANG.Portrait.ShareMenu"),
      icon: '<i class="fas fa-image" aria-hidden="true"></i>',
      visible: (...args) => Boolean(actorFromDirectoryEntry(...args)),
      onClick: async (...args) => {
        const actor = actorFromDirectoryEntry(...args);
        if (actor) await showActorPortraitDialog(actor);
      }
    });
  });
}

export function registerPortraitSocket() {
  if (socketRegistered || !game.socket) return;
  socketRegistered = true;
  game.socket.on(SOCKET_CHANNEL, payload => {
    if (!payload?.src) return;
    console.info(`Trudvang Chronicles | Received shared portrait "${payload.title ?? ""}".`);
    try {
      openPortraitPopout({ src: payload.src, title: payload.title ?? "", uuid: payload.uuid ?? "" });
    } catch (error) {
      console.error("Trudvang Chronicles | Actor portrait could not be displayed", error);
    }
  });
}
