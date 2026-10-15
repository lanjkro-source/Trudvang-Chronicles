import {renderTemplate} from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";

function contextElement(args) {
  for (const arg of args) {
    if (arg instanceof HTMLElement) return arg.closest("[data-entry-id], [data-document-id], [data-item-id], [data-document-uuid]") ?? arg;
    if (arg?.target instanceof HTMLElement) return arg.target.closest("[data-entry-id], [data-document-id], [data-item-id], [data-document-uuid]");
    if (arg?.currentTarget instanceof HTMLElement) return arg.currentTarget.closest("[data-entry-id], [data-document-id], [data-item-id], [data-document-uuid]");
  }
  return null;
}

function directDocument(args, documentName) {
  return args.find(arg => arg?.documentName === documentName)
    ?? args.map(arg => arg?.document).find(document => document?.documentName === documentName)
    ?? null;
}

function hasContextEntry(args) {
  return Boolean(directDocument(args, "Item") || directDocument(args, "ActiveEffect") || contextElement(args));
}

async function resolveContextDocument(application, args, documentName) {
  const direct = directDocument(args, documentName);
  if (direct) return direct;
  const element = contextElement(args);
  const uuid = element?.dataset?.documentUuid;
  if (uuid) {
    const resolved = await foundry.utils.fromUuid(uuid);
    if (resolved?.documentName === documentName) return resolved;
  }
  const id = element?.dataset?.documentId ?? element?.dataset?.entryId ?? element?.dataset?.itemId;
  if (!id) return null;
  const collection = application?.collection;
  if (collection?.getDocument) {
    try {
      const document = await collection.getDocument(id);
      if (document?.documentName === documentName) return document;
    } catch (error) {
      // The application may be a directory rather than a compendium pack.
    }
  }
  const packName = collection?.collection;
  const pack = packName ? game.packs?.get(packName) : null;
  if (pack) {
    const document = await pack.getDocument(id);
    if (document?.documentName === documentName) return document;
  }
  if (documentName === "Item") return game.items?.get(id) ?? null;
  if (documentName === "Actor") return game.actors?.get(id) ?? null;
  return null;
}

export async function shareDocumentInChat(document) {
  if (!document || !["Item", "ActiveEffect", "Actor"].includes(document.documentName)) {
    return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoShareableDocument"));
  }
  if (typeof document.toChat === "function") return document.toChat();
  if (document.documentName === "Actor") {
    const description = document.system.description || document.system.notes || "";
    const enriched = await foundry.applications.ux.TextEditor.implementation.enrichHTML(description, {async: true});
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/actor-card.hbs", {
      actor: document,
      description: enriched
    });
    return ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: document}), content});
  }
  return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoShareableDocument"));
}

export function registerShareContextMenus() {
  Hooks.on("getItemContextOptions", (application, menuItems) => {
    if (!Array.isArray(menuItems)) return;
    menuItems.push({
      label: game.i18n.localize("TRUDVANG.Action.ShareInChat"),
      icon: '<i class="fas fa-comment-dots" aria-hidden="true"></i>',
      visible: (...args) => hasContextEntry(args),
      onClick: async (...args) => shareDocumentInChat(await resolveContextDocument(application, args, "Item"))
    });
  });
  Hooks.on("getActiveEffectContextOptions", (application, menuItems) => {
    if (!Array.isArray(menuItems)) return;
    menuItems.push({
      label: game.i18n.localize("TRUDVANG.Action.ShareInChat"),
      icon: '<i class="fas fa-comment-dots" aria-hidden="true"></i>',
      visible: (...args) => hasContextEntry(args),
      onClick: async (...args) => shareDocumentInChat(await resolveContextDocument(application, args, "ActiveEffect"))
    });
  });
  Hooks.on("getActorContextOptions", (application, menuItems) => {
    if (!Array.isArray(menuItems)) return;
    menuItems.push({
      label: game.i18n.localize("TRUDVANG.Action.ShareInChat"),
      icon: '<i class="fas fa-comment-dots" aria-hidden="true"></i>',
      visible: (...args) => hasContextEntry(args),
      onClick: async (...args) => shareDocumentInChat(await resolveContextDocument(application, args, "Actor"))
    });
  });
}
