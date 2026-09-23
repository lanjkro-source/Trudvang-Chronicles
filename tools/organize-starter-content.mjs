import fs from "node:fs";

const path = "data/starter-content.json";
const content = JSON.parse(fs.readFileSync(path, "utf8"));
const removed = new Set(["ThrowingAxe", "Rope", "Torch", "AdventureKit"]);
const keyOf = entry => entry.nameKey.split(".").at(-2);

content.items = content.items.filter(entry => !removed.has(keyOf(entry)));
for (const entry of content.items.filter(entry => entry.type === "potion")) {
  // Values on character sheets always represent one usable dose, not a harvested plant.
  if (keyOf(entry) === "Gaveblom") entry.system.value = 90; // 3 stems at 30 pa each make one dose.
  if (keyOf(entry) === "Tornrot") entry.system.value = 7 / 3; // one root costs 7 pa and yields 3 doses.
}

const originalFolders = content.folders;
content.folders = {
  weapons: originalFolders.weapons,
  weaponsLight: originalFolders.weaponsLight,
  weaponsHeavy: originalFolders.weaponsHeavy,
  weaponsTwoHanded: originalFolders.weaponsTwoHanded,
  weaponsRanged: originalFolders.weaponsRanged,
  protections: {nameKey: "TRUDVANG.Content.Folder.Protections", type: "Item"},
  armor: {...originalFolders.armor, parent: "protections"},
  shields: {nameKey: "TRUDVANG.Content.Folder.Shields", type: "Item", parent: "protections"},
  equipment: originalFolders.equipment,
  packages: originalFolders.packages,
  extracts: originalFolders.extracts,
  tables: originalFolders.tables,
  creatures: originalFolders.creatures
};

const rank = entry => {
  const itemKey = keyOf(entry);
  if (entry.type === "weapon") return [0, {oneHandedLight: 0, oneHandedHeavy: 1, twoHanded: 2, ranged: 3}[entry.folderOverride ? "ranged" : entry.system.category] ?? 9, itemKey];
  if (entry.type === "armor") return [1, 0, itemKey];
  if (entry.type === "shield") return [1, 1, itemKey];
  if (entry.type === "gear" && itemKey.endsWith("Clothes")) return [2, 0, itemKey];
  if (entry.type === "gear" && itemKey.includes("Kit")) return [2, 1, itemKey];
  if (entry.type === "potion") return [3, 0, itemKey];
  return [9, 0, itemKey];
};
content.items.sort((left, right) => rank(left).join("|").localeCompare(rank(right).join("|")));
fs.writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`);
