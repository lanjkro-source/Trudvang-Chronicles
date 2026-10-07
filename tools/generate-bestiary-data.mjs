// FR is the mechanics authority; EN provides names, prose and edition page references.
// Generated runtime blueprints make builds reproducible without the private source repo.
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {join, extname} from "node:path";
import {deterministicId} from "../modules/skill-pack-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";
import {TABLET_CATALOG} from "../modules/tablet-catalog.mjs";
import {TRUDVANG} from "../modules/config.mjs";
import {npcBookSkillRows} from "../modules/rules/npc-summary.mjs";
import {creatureTokenDimensions} from "../modules/rules/creature-token-size.mjs";
import {weaponType, weaponUsesSeparateHands} from "../modules/rules/combat-pool-resolver.mjs";

const check = process.argv.includes("--check");
const load = path => JSON.parse(readFileSync(path, "utf8"));
const sources = Object.fromEntries(["fr", "en"].map(code => [code, load(`game doc/${code}/trudvang-creatures-${code}.json`)]));
if (sources.fr.length !== sources.en.length) throw new Error("Bilingual creature references must be aligned.");
const languages = Object.fromEntries(["fr", "en"].map(code => [code, load(`lang/${code}.json`)]));
for (const language of Object.values(languages)) language.TRUDVANG.Content.Creature = {};
const localize = (code, key) => key.split(".").reduce((value, part) => value?.[part], languages[code]);
const normalize = value => String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/&/g, "et").replace(/[^a-z0-9]/g, "");
const content = load("data/starter-content.json");
const equipment = content.items.filter(item => ["weapon", "armor", "shield"].includes(item.type));
const armorIds = {cuir: "FurLeather", fourrure: "FurLeather", armuredefourrure: "FurLeather", armuredecuir: "HardenedLeather",
  cottedemailles: "ChainMail", tissuepais: "ThickFabric", cuirrenforcedemetal: "MetalReinforcedLeather"};
const weaponIds = {branchesdarbre: "Stafur", branchedarbre: "Stafur", arbrederacineourocher: "TveiKlubb", glaaf: "Glaaf"};
const naturalNames = {morsure: "Bite", defenses: "Tusks", defense: "Tusks", griffes: "Claws", griffure: "Claws",
  cornes: "Horns", mainsnues: "Unarmed", patteempaleuse: "Impaling leg", sabots: "Hooves", ruade: "Kick", balayage: "Sweep",
  souffledeglace: "Ice breath", soufflemagmatique: "Magma breath", souffledefeu: "Fire breath"};
const traitKeys = {force: "strength", dextérité: "dexterity", constitution: "constitution", intelligence: "intelligence",
  charisme: "charisma", psychisme: "psyche", perception: "perception"};
const families = {beast: ["Beasts", "Bêtes"], mist: ["Mist creatures", "Créatures des brumes"], nature: ["Nature beings", "Êtres de la nature"],
  troll: ["Trolls", "Trolls"], wurm: ["Wurms", "Wurms"], jotunTursir: ["Jotuns and thurses", "Jotuns et thurses"], animal: ["Animals", "Animaux"]};
for (const code of ["fr", "en"]) languages[code].TRUDVANG.Npc.CreatureTypes = Object.fromEntries(Object.entries(families).map(([id, names]) => [id, names[code === "fr" ? 1 : 0]]));
const knowledge = Object.entries(TRUDVANG.knowledgeTree).flatMap(([skillKey, disciplines]) => disciplines.flatMap(d =>
  [{...d, skillKey}, ...d.specialties.map(s => ({...s, skillKey}))]));

function parseDamage(text) {
  // An orphan '+' in the Lyktgubbe reference is the former +1 Strength suffix:
  // Strength is now stored in traits and applied by the shared damage resolver.
  const match = String(text).trim().replace(/\+$/, "").match(/^(\d+d\d+)(?:\s*\(JO\s*(\d+)(?:[-–]\d+)?\))?\s*([+-]\s*\d+)?$/i);
  if (!match) throw new Error(`Unsupported bestiary damage: ${text}`);
  return {damage: match[1].toLowerCase(), openRoll: Number(match[2] ?? 0), damageBonus: Number((match[3] ?? "0").replaceAll(" ", ""))};
}
const stripItem = item => {
  const data = structuredClone(item);
  for (const key of ["folder", "folderOverride", "flags", "_id"]) delete data[key];
  return data;
};
const entries = sources.fr.map((creature, index) => {
  const english = sources.en[index];
  const id = deterministicId(`creature:${creature.name}`);
  const texts = {fr: {}, en: {}};
  const key = (field, fr, en) => {
    if (typeof fr !== "string" || typeof en !== "string") throw new Error(`Missing bilingual text: ${creature.name}/${field}`);
    texts.fr[field] = fr; texts.en[field] = en;
    return `TRUDVANG.Content.Creature.${id}.${field}`;
  };
  const itemName = (field, fr, en) => ({nameKey: key(field, fr, en)});
  const rawRows = npcBookSkillRows(creature.skills, {skills: TRUDVANG.skills, knowledgeTree: TRUDVANG.knowledgeTree, localize: k => localize("fr", k)});
  // Book spellings differ slightly from the skill catalogue, without changing identity.
  const aliases = {morkvitalja: "darkhwitalja", hwitvitalja: "hwitalja", vaagrivitalja: "vaagritalja",
    galda: "galding", sejda: "sejding", vyrda: "vyrding"};
  for (const row of rawRows) if (!row.catalogId) {
    const label = normalize(row.name.split(/[:(]/)[0]);
    const reference = knowledge.find(k => normalize(localize("fr", k.label)) === label);
    row.catalogId = aliases[label] ?? reference?.id ?? ({religion: "religion", extraitsetpotions: "extractsPotions", dramaturge: "acting", connaissancesdescreatures: "raceKnowledge", orientation: "orienteeringCartography"}[label] ?? "");
  }
  const enRows = npcBookSkillRows(english.skills, {skills: TRUDVANG.skills, knowledgeTree: TRUDVANG.knowledgeTree, localize: k => localize("en", k)});
  const skillTree = rawRows.map((row, rowIndex) => {
    const translated = enRows.find(r => r.kind === row.kind && (row.catalogId ? r.catalogId === row.catalogId : row.kind === "skill" && r.skillKey === row.skillKey));
    const reference = knowledge.find(k => k.id === row.catalogId);
    const enName = translated?.name ?? (reference ? localize("en", reference.label) : null)
      ?? (english.skills[rowIndex]?.kind === row.kind ? english.skills[rowIndex].name : null);
    if (!enName) throw new Error(`Missing English skill row: ${creature.name}/${row.name}`);
    return {nameKey: key(`Skill${rowIndex}`, row.name, enName), skillId: row.skillKey, catalogId: row.catalogId, value: row.value, kind: row.kind};
  });
  const items = [];
  for (const [weaponIndex, weapon] of creature.weapons.entries()) {
    const components = weapon.name.split("/");
    const natural = components.every(name => naturalNames[normalize(name)]);
    if (natural) {
      for (const [componentIndex, name] of components.entries()) {
        const normalized = normalize(name);
        const reserve = creature.combatReserves.find(pool => normalize(pool.name) === normalized
          || (naturalNames[normalize(pool.name)] === naturalNames[normalized]))
          ?? creature.combatReserves.find(pool => normalize(pool.name) === "armesnaturelles");
        const shared = reserve && normalize(reserve.name) === "armesnaturelles";
        const isUnarmed = normalized === "mainsnues";
        items.push({_id: deterministicId(`${id}:weapon:${weaponIndex}:${componentIndex}`),
          ...itemName(`Weapon${weaponIndex}Part${componentIndex}`, name, naturalNames[normalized]),
          type: "weapon", img: "icons/svg/combat.svg", system: {category: "natural", combatSpecialty: "natural", isUnarmed,
            equipped: true, quantity: 1, strengthApplies: true, ...parseDamage(weapon.damage), initiativeModifier: Number(weapon.initiative || 0),
            naturalCombatPool: shared && !isUnarmed ? "natural" : normalize(naturalNames[normalized]),
            naturalCombatPoints: shared && isUnarmed ? 0 : Number(reserve?.reserve ?? 0), naturalCombatPointsSpent: 0, weaponActionsSpent: 0}});
      }
    } else {
      const short = normalize(weapon.name.split(" (")[0]);
      const alias = weaponIds[normalize(weapon.name)];
      const base = equipment.find(item => alias ? item.nameKey === `TRUDVANG.Content.Item.${alias}.Name`
        : item.type !== "armor" && normalize(localize("fr", item.nameKey).split(" (")[0]) === short && !item.system.isThrowingWeapon);
      if (!base) throw new Error(`Unmatched creature weapon: ${creature.name}/${weapon.name}`);
      const data = stripItem(base);
      items.push({...data, _id: deterministicId(`${id}:weapon:${weaponIndex}`),
        ...itemName(`Weapon${weaponIndex}`, weapon.name, localize("en", base.nameKey)),
        system: {...data.system, ...parseDamage(weapon.damage), initiativeModifier: Number(weapon.initiative || 0), quantity: 1,
          combatSpecialty: base.type === "weapon" ? weaponType(base) : undefined, equipped: false, hand: "weapon"}});
    }
  }
  for (const [armorIndex, armor] of creature.armor.entries()) {
    const base = equipment.find(item => item.nameKey === `TRUDVANG.Content.Item.${armorIds[normalize(armor.name)]}.Name`);
    if (!base) throw new Error(`Unmatched creature armor: ${creature.name}/${armor.name}`);
    const data = stripItem(base);
    items.push({...data, _id: deterministicId(`${id}:armor:${armorIndex}`), ...itemName(`Armor${armorIndex}`, armor.name, localize("en", base.nameKey)),
      system: {...data.system, protection: armor.protection, initiativeModifier: armor.initiative, quantity: 1, equipped: true}});
  }
  // A deterministic legal initial hand combination. Other inventory weapons can be drawn in play.
  let weaponHand = false, shieldHand = false;
  for (const item of items.filter(item => item.type === "shield")) if (!shieldHand) {item.system.equipped = true; shieldHand = true;}
  for (const item of items.filter(item => item.type === "weapon" && weaponType(item) !== "natural")) {
    const twoHands = !weaponUsesSeparateHands(item);
    if (!weaponHand && (!twoHands || !shieldHand)) {item.system.equipped = true; weaponHand = true; if (twoHands) shieldHand = true;}
  }
  const attacks = creature.attacks.map((combo, comboIndex) => combo.map((attack, attackIndex) => {
    if (attack.action === "movement") return {...attack};
    const matched = items.find(item => normalize(texts.fr[item.nameKey?.split(".").at(-1)]) === normalize(attack.attack));
    const alias = matched ?? (attack.attack.includes("/") ? items.find(item => attack.attack.split("/")
      .some(name => normalize(texts.fr[item.nameKey?.split(".").at(-1)]) === normalize(name))) : null);
    const old = english.attacks[comboIndex]?.[attackIndex];
    const fallback = normalize(attack.attack).startsWith("mouvement") ? "Movement" : ["lutte", "glima"].includes(normalize(attack.attack)) ? "Wrestling" : normalize(attack.attack) === "saisie" ? "Grapple" : null;
    const attackKey = matched?.nameKey ?? key(`Attack${comboIndex}Step${attackIndex}`, attack.attack, fallback ?? old?.attack ?? attack.attack);
    const action = attack.action || (alias ? alias.type === "shield" ? "parry" : "attack"
      : fallback === "Wrestling" ? "glima" : fallback === "Grapple" ? "grapple"
        : creature.feats.some(name => normalize(name) === normalize(attack.attack)) ? "special" : "");
    return {attackKey, itemId: alias?._id ?? "", ...(action ? {action} : {}), value: attack.value};
  }));
  const tablets = creature.tablets.map(row => {
    const tablet = TABLET_CATALOG.find(t => normalize(localize("fr", `TRUDVANG.Content.Tablet.${t.id}.Name`)) === normalize(row.name));
    if (!tablet) throw new Error(`Unmatched creature tablet: ${creature.name}/${row.name}`);
    return {id: tablet.id, level: row.level};
  });
  const portraits = creature.images.map((image, imageIndex) => {
    const imageSource = join("game doc/fr", image);
    // Preserve the first portrait's 0.65.0 path; additional images get stable numbered paths.
    const imageTarget = `assets/bestiary/${id}${imageIndex ? `-${imageIndex + 1}` : ""}${extname(imageSource).toLowerCase()}`;
    if (check) {
      if (!existsSync(imageTarget) || !readFileSync(imageSource).equals(readFileSync(imageTarget))) throw new Error(`Creature portrait needs generation: ${creature.name}/${imageIndex + 1}`);
    } else {mkdirSync("assets/bestiary", {recursive: true}); copyFileSync(imageSource, imageTarget);}
    return `systems/trudvang-chronicles/${imageTarget}`;
  });
  const img = portraits[0];
  const body = Math.floor((creature.bodyPoint.min + creature.bodyPoint.max) / 2);
  const actor = {nameKey: key("Name", creature.name, english.name), type: "npc", img, items, effects: [],
    flags: {"trudvang-chronicles": {bestiaryId: id, inventoryInitialized: true}},
    prototypeToken: {actorLink: false, ...creatureTokenDimensions(creature.size), texture: {src: img}},
    system: {portraits, traits: Object.fromEntries(Object.entries(creature.traits).map(([trait, value]) => {
      if (!traitKeys[trait]) throw new Error(`Unknown trait ${trait}`); return [traitKeys[trait], value];
    })), skills: Object.fromEntries(rawRows.filter(row => row.kind === "skill" && row.skillKey).map(row => [row.skillKey, {value: row.value, bonus: 0}])),
    skillTree, attacks, resources: {body: {value: body, max: body}}, combatPools: {free: {spent: 0, weaponSpent: 0, offHandSpent: 0}},
    initiative: {base: creature.initiativeBase}, movement: {base: Number.parseFloat(creature.move.find(m=>m.mode === "terrestre")?.max || "0") || 0},
    descriptionKey: key("Description", creature.description, english.description),
    details: {creatureTypeKey: `TRUDVANG.Npc.CreatureTypes.${creature.creatureType}`, type: creature.type, size: String(creature.size),
      ageKey: key("Age", String(creature.age), String(english.age)), naturalArmor: creature.naturalArmor,
      fearFactor: creature.fearFactor === "-" ? "" : creature.fearFactor, bodyMin: creature.bodyPoint.min, bodyMax: creature.bodyPoint.max,
      move: creature.move.map(row => ({...row, mode: row.mode})), armor: [],
      summaryKey: key("Summary", creature.quickDesc, english.quickDesc), environmentKey: key("Environment", creature.environment, english.environment),
      source: {bookKey: key("SourceBook", creature.source.book, english.source.book), page: creature.source.page}}}};
  const featIds = creature.feats.map(name => {
    const reference = CREATURE_ABILITY_REFERENCES[name];
    if (!reference) throw new Error(`Unknown capacity: ${creature.name}/${name}`);
    return reference.id;
  });
  for (const code of ["fr", "en"]) languages[code].TRUDVANG.Content.Creature[id] = texts[code];
  return {id, family: creature.creatureType, pages: {fr: creature.source.page, en: english.source.page}, actor, featIds, tablets};
});
const moduleText = `// Generated by tools/generate-bestiary-data.mjs from FR mechanics and bilingual text.\n// Display strings live in lang/*.json. Do not edit this generated catalogue.\nexport const BESTIARY_ENTRIES = ${JSON.stringify(entries, null, 2)};\n`;
if (check) {
  if (readFileSync("modules/bestiary-catalog-data.mjs", "utf8") !== moduleText) throw new Error("Bestiary catalogue needs regeneration.");
  for (const code of ["fr", "en"]) if (JSON.stringify(load(`lang/${code}.json`).TRUDVANG.Content.Creature) !== JSON.stringify(languages[code].TRUDVANG.Content.Creature)) throw new Error(`Bestiary language needs regeneration: ${code}`);
  if (content.actors.length || content.folders.creatures) throw new Error("Starter creatures must be supplied by the Bestiary compendiums only.");
} else {
  writeFileSync("modules/bestiary-catalog-data.mjs", moduleText);
  for (const code of ["fr", "en"]) writeFileSync(`lang/${code}.json`, JSON.stringify(languages[code], null, 2) + "\n");
  content.actors = [];
  delete content.folders.creatures;
  writeFileSync("data/starter-content.json", JSON.stringify(content, null, 2) + "\n");
}
console.log(`${check ? "Verified" : "Generated"} ${entries.length} bilingual bestiary creatures and portraits.`);
