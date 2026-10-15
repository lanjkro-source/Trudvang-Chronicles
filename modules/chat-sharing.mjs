import {renderTemplate} from "./helpers.mjs";
import {TRUDVANG} from "./config.mjs";
import {deterministicId} from "./skill-pack-data.mjs";
import {findTabletPower} from "./tablet-power-links.mjs";
import {isCreatureAbility} from "./creature-ability.mjs";

/** Reuse the frame's existing icon; do not add controls to the sheet body. */
export function bindTitleSharing(sheet) {
  const icon = sheet.window?.icon;
  if (!icon || icon.parentElement?.classList.contains("trudvang-share-title")) return;
  const button = icon.ownerDocument.createElement("button");
  button.type = "button";
  button.className = "trudvang-share-title";
  const label = game.i18n.localize("TRUDVANG.Action.ShareInChat");
  button.title = label;
  button.setAttribute("aria-label", label);
  const bubble = icon.ownerDocument.createElement("i");
  bubble.className = "fas fa-comment-dots trudvang-share-bubble";
  bubble.setAttribute("aria-hidden", "true");
  icon.replaceWith(button);
  button.append(icon, bubble);
  button.addEventListener("pointerdown", event => event.stopPropagation());
  button.addEventListener("click", async event => {
    event.preventDefault(); event.stopPropagation();
    if (button.disabled) return;
    button.disabled = true;
    try { await shareDocumentInChat(sheet.document ?? sheet.actor ?? sheet.item); }
    finally { button.disabled = false; }
  });
}

const sheetRowSelector = "[data-item-id], [data-catalog-id], .effect-row, [data-action='capacity-edit'], .skill-row.tree-root, .npc-skill-root, [data-action='show-skill-detail'], .npc-book-skill, [data-action='tablet-power-open']";
const rowValue = (row, key) => row?.dataset?.[key] ?? row?.querySelector(`[data-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}]`)?.dataset?.[key];

/** Resolve embedded documents and unlearned/book knowledge without creating world data. */
export async function sheetEntry(sheet, row) {
  if (!row) return null;
  const actor = sheet.actor;
  const effectUuid = rowValue(row, "effectUuid");
  if (effectUuid) return {document: await foundry.utils.fromUuid(effectUuid)};
  const effectId = rowValue(row, "effectId");
  if (effectId) return {document: (sheet.document ?? sheet.item)?.effects?.get(effectId)};
  const itemId = rowValue(row, "itemId");
  const item = itemId ? actor?.items?.get(itemId) : null;
  if (item) return {document: item};
  const bookIndex = rowValue(row, "index");
  const bookRow = row.matches?.(".npc-book-skill") ? sheet._npcBookSkillRows?.()[Number(bookIndex)] : null;
  const skillKey = rowValue(row, "skill") ?? (bookRow?.kind === "skill" ? bookRow.skillKey : null);
  if (skillKey && TRUDVANG.skills[skillKey]) return {actor, skillKey,
    name: bookRow?.name ?? game.i18n.localize(TRUDVANG.skills[skillKey]),
    description: game.i18n.localize(TRUDVANG.skillDescriptions[skillKey])};
  const catalogId = rowValue(row, "catalogId") ?? bookRow?.catalogId;
  if (catalogId) {
    const embedded = actor?.items?.find(item => item.system.catalogId === catalogId);
    if (embedded) return {document: embedded};
    if (sheet.item?.type === "tablet") return {document: await findTabletPower({tablet: sheet.item, catalogId,
      packs: game.packs, worldItems: game.items, language: game.i18n.lang})};
    const pack = game.packs?.get(`trudvang-chronicles.skills-${game.i18n.lang === "fr" ? "fr" : "en"}`);
    const document = await pack?.getDocument(deterministicId(`ability:${catalogId}`));
    if (document) return {document};
  }
  if (bookRow) return {actor, bookIndex: Number(bookIndex), name: bookRow.name,
    description: game.i18n.format("TRUDVANG.Npc.BookSkillValue", {value: bookRow.value})};
  return null;
}

export async function shareSheetEntry(entry) {
  if (entry?.document) return shareDocumentInChat(entry.document);
  if (!entry?.actor) return null;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/skill-card.hbs", {
    ...entry, description: await foundry.applications.ux.TextEditor.implementation.enrichHTML(entry.description || "", {async: true})
  });
  return ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: entry.actor}), content});
}

/** One delegated native menu per rendered container, including read-only sheets. */
export function bindSheetListMenus(sheet) {
  const root = sheet.element;
  if (!root || !sheet._createContextMenu) return;
  root.querySelectorAll(sheetRowSelector).forEach(row => row.classList.add("trudvang-share-row"));
  if (sheet._trudvangShareMenuRoot === root) return;
  sheet._trudvangShareMenuRoot = root;
  const rowFrom = args => {
    for (const arg of args) {
      const element = arg?.target ?? arg;
      const row = element?.closest?.(".trudvang-share-row");
      if (row) return row;
    }
    return null;
  };
  sheet._createContextMenu(() => [
    {label: game.i18n.localize("TRUDVANG.Action.ShowDetails"), icon: '<i class="fas fa-circle-info"></i>',
      onClick: async (...args) => {
        const entry = await sheetEntry(sheet, rowFrom(args));
        if (entry?.document?.documentName === "ActiveEffect" && isCreatureAbility(entry.document)) {
          const {openCreatureAbilitySheet} = await import("./sheets/creature-ability-sheet.mjs");
          return openCreatureAbilitySheet(entry.document);
        }
        if (entry?.document) return entry.document.sheet.render({force: true});
        if (entry?.actor) return sheet._showDetail(entry.name, entry.description);
      }},
    {label: game.i18n.localize("TRUDVANG.Action.ShareInChat"), icon: '<i class="fas fa-comment-dots"></i>',
      onClick: async (...args) => shareSheetEntry(await sheetEntry(sheet, rowFrom(args)))}
  ], ".trudvang-share-row", {container: root});
}

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
