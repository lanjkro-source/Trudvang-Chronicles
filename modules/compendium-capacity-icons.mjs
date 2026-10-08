import {creatureAbilityIconClassForId} from "./creature-ability.mjs";

const CAPACITY_PACKS = new Set([
  "trudvang-chronicles.feats-en",
  "trudvang-chronicles.feats-fr"
]);

function entryId(element) {
  const id = element.dataset.entryId ?? element.dataset.documentId ?? element.dataset.itemId;
  if (id) return id;
  const uuid = element.dataset.documentUuid;
  return uuid?.split(".").at(-1) ?? "";
}

export function registerCompendiumCapacityIcons() {
  Hooks.on("renderApplicationV2", (application, element) => {
    if (!CAPACITY_PACKS.has(application.collection?.collection)) return;
    for (const entry of element.querySelectorAll("[data-entry-id], [data-document-id], [data-item-id], [data-document-uuid]")) {
      const iconClass = creatureAbilityIconClassForId(entryId(entry));
      if (!iconClass) continue;
      const image = entry.matches("img") ? entry : entry.querySelector("img");
      if (!image) continue;
      const icon = document.createElement("i");
      icon.className = `fas ${iconClass} trudvang-capacity-compendium-icon`;
      icon.setAttribute("aria-hidden", "true");
      image.replaceWith(icon);
    }
  });
}
