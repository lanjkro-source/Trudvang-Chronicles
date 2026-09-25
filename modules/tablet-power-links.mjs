import {deterministicId} from "./skill-pack-data.mjs";

// Prefer the tablet's own compendium: a French tablet must open its French
// powers even when the UI language is English (and vice versa).
export async function findTabletPower({tablet, catalogId, packs, worldItems, language}) {
  const findInPack = async packId => {
    const pack = packs.get(packId);
    if (!pack) return null;
    const stableId = deterministicId(`power:${catalogId}`);
    const direct = await pack.getDocument(stableId);
    if (direct?.system?.catalogId === catalogId) return direct;
    return (await pack.getDocuments()).find(item => item.system?.catalogId === catalogId) ?? null;
  };
  if (tablet.pack) {
    const power = await findInPack(tablet.pack);
    if (power) return power;
  }
  const actorPower = tablet.parent?.documentName === "Actor"
    ? tablet.parent.items.find(item => item.system?.catalogId === catalogId) : null;
  if (actorPower) return actorPower;
  const worldPower = worldItems.find(item => item.system?.catalogId === catalogId);
  if (worldPower) return worldPower;
  const suffix = tablet.system.tabletType === "vitner" ? "vitner" : "religion";
  return findInPack(`trudvang-chronicles.${suffix}-${language === "fr" ? "fr" : "en"}`);
}
