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

function actorFromDirectoryEntry(element) {
  const id = element?.dataset?.documentId ?? element?.dataset?.entryId;
  return id ? game.actors?.get(id) : null;
}

export function registerPortraitDirectoryHook() {
  // V13+: per-document directory hooks were replaced by the single
  // getDocumentContextOptions hook (verified present in the V14 client
  // source; neither getActorDirectoryEntryContext nor getActorContextOptions
  // exists there). Filter to the Actors directory; per-entry visibility still
  // resolves the target in game.actors, so other directories stay unaffected.
  Hooks.on("getDocumentContextOptions", (application, menuItems) => {
    if (!Array.isArray(menuItems)) return;
    const docName = application?.documentName ?? application?.collection?.documentName;
    if (docName && docName !== "Actor") return;
    menuItems.push({
      label: game.i18n.localize("TRUDVANG.Portrait.ShareMenu"),
      icon: '<i class="fas fa-image" aria-hidden="true"></i>',
      visible: element => Boolean(actorFromDirectoryEntry(element)),
      onClick: async element => {
        const actor = actorFromDirectoryEntry(element);
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

export function registerPortraitHooks() {
  registerPortraitDirectoryHook();
  registerPortraitSocket();
}
