import fs from "node:fs";

const entries = [
  ["Glaaf", "Glaaf (épée courte)", "Glaaf (Short Sword)"], ["HringSeax", "Hring seax (couteau à anneau)", "Hring Seax (Ring Knife)"],
  ["Klubb", "Klubb (massue)", "Klubb (Club)"], ["KrumSwerd", "Krum swerd (cimeterre)", "Krum Sword (Scimitar)"],
  ["LillSpjot", "Lill spjót (lance courte)", "Lill Spjót (Short Spear)"], ["NagliKlubb", "Nagli Klubb (massue à pointes)", "Nagli Klubb (Spiked Club)"],
  ["Seax", "Seax (dague ou couteau)", "Seax (Dagger or Knife)"], ["SplitAxi", "Split Axi (hache à une main)", "Split Axi (Hand Axe)"],
  ["Stafur", "Stafur (bâton)", "Stafur (Staff)"], ["BattleAxe", "Barda axi (hache de bataille)", "Barda Axi (Battle Axe)"],
  ["BardaFaldir", "Barda faldir (fléau de bataille)", "Barda Faldir (Battle Flail)"], ["BardaHammri", "Barda hammri (marteau de\nbataille)", "Barda Hammri (Battle Hammer)"],
  ["BardaKlot", "Barda klót (chaîne de bataille)", "Barda Klót (Battle Chain)"], ["BardaMakir", "Barda makir (masse de bataille)", "Barda Makir (Battle Mace)"],
  ["BardaSwerd", "Barda swerd (épée de bataille)", "Barda Swerd (Battle Sword)"], ["BastjurKedja", "Bastjur kedjá (chaîne troll)", "Bastjur kedjá (Troll Chain)"],
  ["Broadsword", "Breid swerd (épée large)", "Breid swerd (Broadsword)"], ["DropiAxi", "Dropi axi (hache pendule)", "Dropi Axi (Pendulum Axe)"],
  ["Hakk", "Hakk (bec-de-corbeau)", "Hakk (Raven Beak)"], ["Miekka", "Miekka", "Miekka"],
  ["StaafSpjot", "Staaf spjót (lance de chasse)", "Staaf Spjót (Hunting Spear)"], ["StakkSwerd", "Stakk swerd (épée d’armes)", "Stakk Swerd (Arming Sword)"],
  ["StjornMakir", "Stjorn makir (étoile du matin)", "Stjorn makir (Morning Star)"], ["BeardedAxe", "Villtur axi (hache courbée)", "Villtur Axi (Bearded Axe)"],
  ["BreidSpjot", "Breid spjót (lance à lame large)", "Breid Spjót (Broad-bladed Spear)"], ["LongSpear", "Spjót (lance longue)", "Spjót (Long Spear)"],
  ["TwoHandedAxe", "Tvei axi (hache à deux mains)", "Tvei Axi (Two-handed Axe)"], ["TveiFaldir", "Tvei faldir (fléau à deux mains)", "Tvei Faldir (Two-handed Flail)"],
  ["TveiHakk", "Tvei hakk (pioche à deux mains)", "Tvei Hakk (Two-handed Pick)"], ["TveiHammri", "Tvei hammri (merlin)", "Tvei Hammri (Maul)"],
  ["TveiKlubb", "Tvei klubb (massue à deux mains)", "Tvei Klubb (Two-handed Club)"], ["TwoHandedSword", "Tvei swerd (épée à deux mains)", "Tvei Swerd (Two-handed Sword)"],
  ["Longbow", "Lang bogi (arc long)", "Lang Bogi (Longbow)"], ["TveBogi", "Tve bogi (arc composite)", "Tve Bogi (Compound Bow)"],
  ["HuntingBow", "Veidi bogi (arc de chasse)", "Veidi Bogi (Hunting Bow)"], ["Slingu", "Slingu (fronde)", "Slingu (Sling)"],
  ["StafurSlingu", "Stafur slingu (fronde à manche)", "Stafur Slingu (Staff-Sling)"], ["Crossbow", "Krossbogur (arbalète)", "Krossbogur (Crossbow)"],
  ["TunkurKrossbogur", "Tunkur krossbogur (arbalète\nlourde)", "Tunkur Krossbogur (Heavy\ncrossbow)"], ["VolkKrossbogur", "Volk krossbogur (arbalète légère)", "Volk Krossbogur (Light crossbow)"],
  ["ThickFabric", "Vêtement matelassé", "Thick Fabric"], ["FurLeather", "Fourrure/Cuir", "Fur/Leather"],
  ["HardenedLeather", "Cuir rigide", "Hardened leather"], ["MetalReinforcedLeather", "Cuir renforcé de métal", "Metal-reinforced leather"],
  ["ChainMail", "Cotte de mailles", "Chain mail"], ["ScaleReinforcedChainMail", "Cotte de mailles à écailles", "Scale reinforced chain mail"],
  ["ScalePlating", "Armure d’écailles", "Scale plating"], ["DoubleChainMail", "Cotte de mailles double", "Double chain mail"],
  ["BandedArmor", "Armure à bandes", "Banded armor"], ["PlateArmor", "Armure de plate", "Plate armor"],
  ["SlaveClothes", "Vêtements d’esclaves", "Slave Clothes"], ["PoorClothes", "Vêtements de pauvres", "Poor Clothes"],
  ["AverageClothes", "Vêtements moyens", "Average Clothes"], ["RichClothes", "Vêtements de riches", "Rich Clothes"], ["RoyalAttire", "Atours royaux", "Royal Attire"],
  ["AdventureKit", "Paquetage d’aventure", "Adventure Kits"], ["ArmamentKit", "Paquetage d’entretien des armes", "Weapon Kit"],
  ["CraftKit", "Paquetage d’artisanat", "Craft Kit"], ["BurglaryKit", "Paquetage de cambriolage", "Thief Kit"],
  ["CampingKit", "Paquetage de campement", "Camp Kit"], ["HuntingKit", "Paquetage de chasse", "Hunting Kit"],
  ["WritingKit", "Paquetage d’écriture", "Writer Kit"], ["MusicKit", "Paquetage de musique", "Folk Musician Kit"],
  ["FishingKit", "Paquetage de pêche", "Fishing Kit"], ["HealingKit", "Paquetage de soin", "Healing Kit"]
];

const clean = value => {
  const boundary = value.search(/\n(?:Armes lourdes à une main|Armes à deux mains|ARMES À DISTANCE|Armes de lancer|Frondes|Arbalètes| F Veidi bogi|Klubb Seax \(type|Objets magiques|autres  Biens|One-handed Heavy Weapons|Two-handed Weapons|Ranged Weapons|Slings|Crossbows|THROWING WEAPONS|Klubb Seax \(Dagger|Magic Items|Other Goods)/);
  if (boundary >= 0) value = value.slice(0, boundary);
  return value.replace(/## PDF page \d+/g, "").replace(/([\p{L}])\s*-\s*\n\s*([\p{Ll}])/gu, "$1$2")
    .replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
};

function position(source, heading) {
  const index = source.indexOf(`${heading}\n`);
  if (index < 0) throw new Error(`Heading not found: ${heading}`);
  return index;
}

function paragraphs(source, column) {
  const headings = entries.map(entry => [entry[0], entry[column]]);
  const starts = headings.map(([key, heading]) => [key, position(source, heading), heading.length]);
  const result = Object.fromEntries(starts.map(([key, start, length]) => {
    const next = starts.map(([, candidate]) => candidate).filter(candidate => candidate > start).sort((a, b) => a - b)[0];
    return [key, clean(source.slice(start + length, next))];
  }));
  return result;
}

function objectRange(text, key) {
  const start = text.indexOf(`"${key}":`);
  const open = text.indexOf("{", start);
  let depth = 0, quoted = false, escaped = false;
  for (let index = open; index < text.length; index++) {
    const character = text[index];
    if (quoted) { if (!escaped && character === '"') quoted = false; escaped = !escaped && character === "\\"; continue; }
    if (character === '"') { quoted = true; continue; }
    if (character === "{") depth++;
    if (character === "}" && --depth === 0) return [start, index + 1];
  }
  throw new Error(`Unclosed object: ${key}`);
}

function writeDescriptions(languagePath, markdownPath, column) {
  const source = fs.readFileSync(markdownPath, "utf8");
  const descriptions = paragraphs(source, column);
  // The two-column PDF extraction places the next chapter alongside the last armour
  // entry.  These hard page/heading limits keep that unrelated material out.
  const plateHeading = entries.find(entry => entry[0] === "PlateArmor")[column];
  const plateStart = position(source, plateHeading) + plateHeading.length;
  const plateEnd = column === 1 ? source.indexOf("## PDF page 121", plateStart) : source.indexOf("Armor Quality", plateStart);
  descriptions.PlateArmor = clean(source.slice(plateStart, plateEnd));
  if (column === 1) {
    const twoHandedSwordHeading = entries.find(entry => entry[0] === "TwoHandedSword")[column];
    const twoHandedSwordStart = position(source, twoHandedSwordHeading) + twoHandedSwordHeading.length;
    descriptions.TwoHandedSword = clean(source.slice(twoHandedSwordStart, source.indexOf("## PDF page 111", twoHandedSwordStart)));
    const adventureHeading = entries.find(entry => entry[0] === "AdventureKit")[column];
    const adventureStart = position(source, adventureHeading) + adventureHeading.length;
    descriptions.AdventureKit = clean(source.slice(adventureStart, source.indexOf("EXEMPLE : PAQUETAGE", adventureStart)));
    const healingHeading = entries.find(entry => entry[0] === "HealingKit")[column];
    const healingStart = position(source, healingHeading) + healingHeading.length;
    descriptions.HealingKit = clean(source.slice(healingStart, source.indexOf("Animaux\n", healingStart)));
  }
  if (column === 2) {
    const adventureHeading = entries.find(entry => entry[0] === "AdventureKit")[column];
    const adventureStart = position(source, adventureHeading) + adventureHeading.length;
    descriptions.AdventureKit = clean(source.slice(adventureStart, source.indexOf("If a character wants", adventureStart)));
    const weaponKitHeading = entries.find(entry => entry[0] === "ArmamentKit")[column];
    const weaponKitStart = position(source, weaponKitHeading) + weaponKitHeading.length;
    descriptions.ArmamentKit = clean(source.slice(weaponKitStart, source.indexOf("Animals\n", weaponKitStart)));
    const richHeading = entries.find(entry => entry[0] === "RichClothes")[column];
    const richStart = position(source, richHeading) + richHeading.length;
    descriptions.RichClothes = clean(source.slice(richStart, source.indexOf("EXAMPLE: ADVENTURE KIT", richStart)));
    descriptions.RichClothes = descriptions.RichClothes.replace(/\s+However,?$/, "");
    const huntingHeading = entries.find(entry => entry[0] === "HuntingKit")[column];
    const huntingStart = position(source, huntingHeading) + huntingHeading.length;
    descriptions.HuntingKit = clean(source.slice(huntingStart, source.indexOf("## PDF page 85", huntingStart)));
    const volkHeading = entries.find(entry => entry[0] === "VolkKrossbogur")[column];
    const volkStart = position(source, volkHeading) + volkHeading.length;
    descriptions.VolkKrossbogur = clean(source.slice(volkStart, source.indexOf("RANGED WEAPONS", volkStart)));
    const stakkHeading = entries.find(entry => entry[0] === "StakkSwerd")[column];
    const stakkStart = position(source, stakkHeading) + stakkHeading.length;
    descriptions.StakkSwerd = clean(source.slice(stakkStart, source.indexOf("Klubb\n", stakkStart)));
    const hardenedHeading = entries.find(entry => entry[0] === "HardenedLeather")[column];
    const hardenedStart = position(source, hardenedHeading) + hardenedHeading.length;
    descriptions.HardenedLeather = clean(source.slice(hardenedStart, source.indexOf("and passes 3", hardenedStart)));
  }
  const shieldStart = column === 1 ? "Boucliers" : "Shields are items which are specifically";
  const shieldEnd = column === 1 ? "Modificateur d’initiative" : "Initiative Modifier";
  const shields = clean(source.slice(position(source, shieldStart), source.indexOf(shieldEnd, position(source, shieldStart))));
  for (const key of ["SmallShield", "MediumShield", "LargeShield", "SmallFurShield", "MediumFurShield", "LargeFurShield", "SmallMetalShield", "MediumMetalShield", "LargeMetalShield"]) descriptions[key] = shields;
  const original = fs.readFileSync(languagePath, "utf8");
  const serialized = `"ItemDescription": ${JSON.stringify(descriptions)}`;
  const existing = original.indexOf('"ItemDescription":');
  let content;
  if (existing >= 0) {
    const [start, end] = objectRange(original, "ItemDescription");
    content = original.slice(0, start) + serialized + original.slice(end);
  } else {
    const [, end] = objectRange(original, "GenericDescription");
    content = `${original.slice(0, end)},\n      ${serialized}${original.slice(end)}`;
  }
  fs.writeFileSync(languagePath, content);
}

writeDescriptions("lang/fr.json", "game doc/markdown-fr/Trudvang - 01 - Livre des Regles.md", 1);
writeDescriptions("lang/en.json", "game doc/markdown/trudvang-chronicles-game-masters-guide.md", 2);
