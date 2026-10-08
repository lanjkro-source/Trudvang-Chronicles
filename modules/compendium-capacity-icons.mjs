import {creatureAbilityIconClassForId} from "./creature-ability.mjs";
import {POWER_COMPENDIUM_ICON_BY_ITEM_ID} from "./power-icons.mjs";

const CAPACITY_PACKS = new Set([
  "trudvang-chronicles.feats-en",
  "trudvang-chronicles.feats-fr"
]);
const POWER_PACKS = new Set([
  "trudvang-chronicles.vitner-en",
  "trudvang-chronicles.vitner-fr",
  "trudvang-chronicles.religion-en",
  "trudvang-chronicles.religion-fr"
]);

function entryId(element) {
  const id = element.dataset.entryId ?? element.dataset.documentId ?? element.dataset.itemId;
  if (id) return id;
  const uuid = element.dataset.documentUuid;
  return uuid?.split(".").at(-1) ?? "";
}

export function registerCompendiumIcons() {
  Hooks.on("renderApplicationV2", (application, element) => {
    const collection = application.collection?.collection;
    const isCapacityPack = CAPACITY_PACKS.has(collection);
    const isPowerPack = POWER_PACKS.has(collection);
    if (!isCapacityPack && !isPowerPack) return;
    for (const entry of element.querySelectorAll("[data-entry-id], [data-document-id], [data-item-id], [data-document-uuid]")) {
      const id = entryId(entry);
      const iconClass = isCapacityPack ? creatureAbilityIconClassForId(id) : POWER_COMPENDIUM_ICON_BY_ITEM_ID.get(id);
      if (!iconClass) continue;
      const image = entry.matches("img") ? entry : entry.querySelector("img");
      if (!image) continue;
      const icon = document.createElement("i");
      icon.className = `fas ${iconClass} trudvang-compendium-icon`;
      icon.setAttribute("aria-hidden", "true");
      image.replaceWith(icon);
    }
  });
}
