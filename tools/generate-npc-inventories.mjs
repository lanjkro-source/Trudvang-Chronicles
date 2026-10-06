// Bake only the eight shipped starter inventories, from the authoritative FR reference.
import {readFileSync, writeFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {creatureDataForStarter} from "../modules/creature-feats.mjs";
import {isNpcEquipment} from "../modules/npc-inventory.mjs";
import {npcBookSkillRows} from "../modules/rules/npc-summary.mjs";
import {TRUDVANG} from "../modules/config.mjs";

const normalize = text => String(text).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const naturalWeapons = new Set(["Morsure", "Morsure/défenses", "Défenses", "Griffes", "Cornes", "Mains nues", "Patte empaleuse"].map(normalize));
const armorAliases = {cuir: "FurLeather", armuredefourrure: "FurLeather"};
const weaponAliases = {splitaxi: "SplitAxi", bardamakir: "BardaMakir", tveiklubb: "TveiKlubb", grandbouclierenbois: "LargeShield"};
const naturalIds = {morsure: "Bite", defense: "Tusks", griffes: "Claws", cornes: "Horns", mainsnues: "Unarmed", patteempaleuse: "ImpalingLeg"};
const parseDamage = text => {
  const match = text.match(/^(\d+d\d+)(?:\s*\((?:JO|OR)\s+(\d+)(?:[-–]\d+)?\))?$/i);
  if (!match) throw new Error(`Unsupported weapon damage: ${text}`);
  return {damage: match[1].toLowerCase(), openRoll: Number(match[2] ?? 0)};
};

export function withNpcInventories(content, creatures, french) {
  const output = structuredClone(content);
  const localize = key => key.split(".").reduce((value, part) => value?.[part], french);
  const equipment = content.items.filter(isNpcEquipment);
  for (const actor of output.actors.filter(actor => actor.type === "npc")) {
    const starterId = actor.nameKey.replace(/\.Name$/, "");
    const creature = creatures.find(entry => entry.name === creatureDataForStarter(starterId)?.creature);
    if (!creature) throw new Error(`No creature reference for ${starterId}`);
    const inventory = [];
    const natural = [];
    let weaponHand = false;
    let shieldHand = false;
    for (const entry of [...(creature.weapons ?? []), ...(creature.armor ?? [])]) {
      if (naturalWeapons.has(normalize(entry.name))) {
        const normName = normalize(entry.name);
        const names = normName === "morsuredefenses" ? ["Morsure", "Défense"] : normName === "defenses" ? ["Défense"] : [entry.name];
        for (const name of names) {
          const id = naturalIds[normalize(name)];
          if (!id) throw new Error(`Unknown natural weapon: ${name}`);
          const isUnarmed = id === "Unarmed";
          const reserve = (creature.combatReserves ?? []).find(pool => normalize(pool.name) === normalize(name))
            ?? (creature.combatReserves ?? []).find(pool => normalize(pool.name) === "armesnaturelles");
          const sharedNatural = reserve && normalize(reserve.name) === "armesnaturelles";
          natural.push({nameKey: `TRUDVANG.Content.NaturalWeapon.${id}.Name`, type: "weapon", img: "icons/svg/combat.svg",
            system: {category: "natural", combatSpecialty: "natural", isUnarmed, equipped: true, quantity: 1, strengthApplies: true,
              ...parseDamage(entry.damage), initiativeModifier: Number(entry.initiative),
              naturalCombatPool: sharedNatural && !isUnarmed ? "natural" : id,
              naturalCombatPoints: sharedNatural && isUnarmed ? 0 : Number(reserve?.reserve ?? 0)}});
        }
        continue;
      }
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
        Object.assign(item.system, parseDamage(entry.damage));
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
    // Preserve ordinary gear; replace only the source-generated combat profiles.
    actor.items = [...(actor.items ?? []).filter(item => !["weapon", "armor", "shield"].includes(item.type)), ...inventory, ...natural];
    actor.system.skillTree = npcBookSkillRows(creature.skills, {skills: TRUDVANG.skills, knowledgeTree: TRUDVANG.knowledgeTree, localize})
      .map(({name, value, kind, skillKey, catalogId}) => ({name, value, kind, skillId: skillKey, catalogId}));
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
