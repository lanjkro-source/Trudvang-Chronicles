// Bake only the eight shipped starter inventories, from the authoritative FR reference.
import {readFileSync, writeFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {creatureDataForStarter} from "../modules/creature-feats.mjs";
import {isNpcEquipment} from "../modules/npc-inventory.mjs";

const normalize = text => String(text).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const naturalWeapons = new Set(["Morsure", "Morsure/défenses", "Griffes", "Cornes", "Mains nues", "Patte empaleuse"].map(normalize));
const armorAliases = {cuir: "FurLeather", armuredefourrure: "FurLeather"};
const weaponAliases = {splitaxi: "SplitAxi", bardamakir: "BardaMakir", tveiklubb: "TveiKlubb", grandbouclierenbois: "LargeShield"};

export function withNpcInventories(content, creatures, french) {
  const output = structuredClone(content);
  const localize = key => key.split(".").reduce((value, part) => value?.[part], french);
  const equipment = content.items.filter(isNpcEquipment);
  for (const actor of output.actors.filter(actor => actor.type === "npc")) {
    const starterId = actor.nameKey.replace(/\.Name$/, "");
    const creature = creatures.find(entry => entry.name === creatureDataForStarter(starterId)?.creature);
    if (!creature) throw new Error(`No creature reference for ${starterId}`);
    const inventory = [];
    let weaponHand = false;
    let shieldHand = false;
    for (const entry of [...(creature.weapons ?? []), ...(creature.armor ?? [])]) {
      if (naturalWeapons.has(normalize(entry.name))) continue;
      const armor = (creature.armor ?? []).includes(entry);
      const alias = (armor ? armorAliases : weaponAliases)[normalize(entry.name)];
      const base = equipment.find(item => alias ? item.nameKey === `TRUDVANG.Content.Item.${alias}.Name`
        : !armor && item.type !== "armor" && normalize(localize(item.nameKey)) === normalize(entry.name));
      if (!base) throw new Error(`Unmatched equipment: ${creature.name} / ${entry.name}`);
      const item = structuredClone(base);
      delete item.folder;
      delete item.folderOverride;
      item.system.quantity = 1;
      if (armor) {
        if (item.system.protection !== entry.protection) throw new Error(`Armor protection mismatch: ${creature.name} / ${entry.name}`);
        item.system.equipped = true;
      } else {
        const damage = entry.damage.match(/^(\d+d\d+)(?:\s*\((?:JO|OR)\s+(\d+)(?:[-–]\d+)?\))?$/i);
        if (!damage) throw new Error(`Unsupported weapon damage: ${entry.damage}`);
        item.system.damage = damage[1].toLowerCase();
        item.system.openRoll = Number(damage[2] ?? 0);
        item.system.initiativeModifier = Number(entry.initiative);
        const twoHands = item.system.combatSpecialty === "twoHandedWeapons";
        item.system.equipped = item.type === "shield" ? !shieldHand : !weaponHand && (!twoHands || !shieldHand);
        if (item.system.equipped) {
          if (item.type === "shield" || twoHands) shieldHand = true;
          if (item.type === "weapon") weaponHand = true;
        }
        if (item.type === "weapon") item.system.hand = "weapon";
      }
      inventory.push(item);
    }
    actor.items = [...(actor.items ?? []).filter(item => !isNpcEquipment(item)), ...inventory];
    actor.prototypeToken = {...actor.prototypeToken, actorLink: false};
  }
  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = "data/starter-content.json";
  const content = JSON.parse(readFileSync(path, "utf8"));
  const creatures = JSON.parse(readFileSync("game doc/fr/trudvang-creatures-fr.json", "utf8"));
  const french = JSON.parse(readFileSync("lang/fr.json", "utf8"));
  const updated = withNpcInventories(content, creatures, french);
  if (process.argv.includes("--check")) {
    if (JSON.stringify(updated) !== JSON.stringify(content)) throw new Error("Starter NPC inventories differ from the FR source; run npm run generate:npc-inventories.");
    console.log("Starter NPC inventories match the FR source.");
  } else {
    writeFileSync(path, JSON.stringify(updated, null, 2) + "\n");
    console.log(`Generated ${updated.actors.reduce((count, actor) => count + actor.items.filter(isNpcEquipment).length, 0)} equipment items for the starter NPCs.`);
  }
}
