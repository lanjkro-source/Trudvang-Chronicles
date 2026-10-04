import { escapeHtml, renderTemplate } from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const SOCKET_CHANNEL = `system.${SYSTEM_ID}.showPortrait`;
let socketRegistered = false;

/**
 * Open an actor portrait in a large popout window.
 *
 * V14 form: `new foundry.applications.apps.ImagePopout(src, {title, uuid})`
 * with a `globalThis.ImagePopout` fallback kept in a dead branch for older
 * clients. `render({force: true})` forces the render on both the AppV1 and
 * ApplicationV2 stacks (AppV1 treats the truthy object as `force`).
 */
export function openPortraitPopout({ src, title = "", uuid = "" } = {}) {
  if (!src) return null;
  const NamespacedPopout = foundry.applications?.apps?.ImagePopout;
  const popout = NamespacedPopout
    ? new NamespacedPopout(src, { title, uuid })
    : new globalThis.ImagePopout({ src, title, uuid });
  popout.render({ force: true });
  return popout;
}

/**
 * Post an actor portrait to chat and, when requested by the GM, force the
 * large popout on every connected client. A non-GM `forceAll` request only
 * posts the chat card: the socket emit is silently skipped.
 */
export async function showActorPortrait(actor, { forceAll = false } = {}) {
  if (!actor) return null;
  const src = actor.img;
  const title = actor.name;
  const uuid = actor.uuid;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/portrait-card.hbs", {
    actorName: title,
    actorImg: src,
    actorUuid: uuid
  });
  const message = await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
  if (forceAll && game.user?.isGM) {
    openPortraitPopout({ src, title, uuid });
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
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const content = `
    <div class="trudvang roll-dialog portrait-dialog">
      <p class="portrait-preview"><img src="${escapeHtml(actor.img)}" alt="${escapeHtml(actor.name)}"></p>
      <label class="checkbox"><input type="checkbox" name="forceAll"> ${escapeHtml(game.i18n.localize("TRUDVANG.Portrait.ForceAll"))}</label>
    </div>`;
  const answered = await DialogClass.wait({
    window: { title: game.i18n.format("TRUDVANG.Portrait.DialogTitle", { actor: actor.name }) },
    content,
    buttons: [
      {
        action: "share",
        icon: "fas fa-image",
        label: game.i18n.localize("TRUDVANG.Portrait.Send"),
        default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return { forceAll: Boolean(root.querySelector("[name=forceAll]")?.checked) };
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
    try {
      openPortraitPopout({ src: payload.src, title: payload.title ?? "", uuid: payload.uuid ?? "" });
    } catch (error) {
      console.error("Trudvang Chronicles | Actor portrait could not be displayed", error);
    }
  });
}
