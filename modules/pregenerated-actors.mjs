import {TRUDVANG} from "./config.mjs";
import {PREGENERATED_ACTORS} from "./pregenerated-actor-data.mjs";
import {powerItemData, TABLET_BY_ID, tabletItemData} from "./tablet-catalog.mjs";
import {resolveArmorProfile} from "./rules/equipment-resolver.mjs";
import {CUSTOM_SPECIALTY_PREFIX} from "./rules/custom-specialties.mjs";

const scope = "trudvang-chronicles";
const labelRoot = "TRUDVANG.Content.Pregenerated";
const equipmentKey = key => `TRUDVANG.Content.Item.${key}.Name`;

const knowledge = new Map(Object.entries(TRUDVANG.knowledgeTree).flatMap(([skill, disciplines]) =>
  disciplines.flatMap(discipline => [
    [discipline.id, {skill, entry: discipline}],
    ...discipline.specialties.map(entry => [entry.id, {skill, entry, discipline}])
  ])));

function knowledgeItems(profile, localize) {
  return profile.knowledge.split(" ").map(field => {
    const [id, value, qualifier] = field.split(":");
    const {skill, entry, discipline} = knowledge.get(id);
    const offHand = qualifier?.startsWith("off=");
    const custom = qualifier && !offHand;
    const suffix = custom ? localize(`${labelRoot}.Qualifier.${qualifier}`) : "";
    const catalogId = custom ? `${CUSTOM_SPECIALTY_PREFIX}${id}-${qualifier}` : id;
    const culture = id === "cultureKnowledge" ? localize(`${labelRoot}.Qualifier.${profile.race ?? profile.culture}`) : "";
    const baseName = localize(entry.label);
    return {
      name: suffix || culture ? `${baseName} — ${suffix || culture}` : baseName,
      type: "ability", img: "icons/svg/book.svg",
      ...(custom ? {flags: {[scope]: {customSpecialty: {added: true, sourceCatalogId:id, parentCatalogId:discipline.id}}}} : {}),
      system: {kind: discipline ? "specialty" : "discipline", catalogId, parentSkill: skill,
        parentDiscipline: discipline ? localize(discipline.label) : "", level: Number(value),
        offHandLevel: offHand ? Number(qualifier.slice(4)) : 0, rollBonus: discipline ? 2 : 1}
    };
  });
}

function equipment(profile, sourceItems, localize, localizeTree, randomID) {
  const items = new Map();
  for (const [key, initiativeModifier, slot, variant, hand] of profile.gear) {
    const base = sourceItems.get(equipmentKey(key));
    if (!base) throw Error(`Missing equipment ${key} for ${profile.id}`);
    const item = localizeTree(base);
    delete item.folder;
    item._id = randomID();
    item.system.equipped = Boolean(slot);
    if (initiativeModifier != null) item.system.initiativeModifier = initiativeModifier;
    if (item.type === "weapon") item.system.hand = hand ?? (slot === "shield" ? "shield" : "weapon");
    if (variant) item.name = localize(`${labelRoot}.Equipment.${variant}`);
    items.set(key, item);
  }
  items.set("unarmed", {_id: randomID(), name:localize("TRUDVANG.Combat.HumanoidNaturalWeapons"), type:"weapon",
    img:"icons/svg/combat.svg", system:{isUnarmed:true, category:"natural", damage:"1d5", openRoll:0,
      strengthApplies:true, weaponActions:4, material:"natural", equipped:true,
      damageQualification:{nature:"normal", delivery:"melee", type:"bludgeoning", protection:"normal"}}});
  return items;
}

export function pregeneratedActorPayload(profile, sourceItems, {localize, format, localizeTree, randomID, folder}) {
  const name = localize(`${labelRoot}.${profile.id}`);
  const gear = equipment(profile, sourceItems, localize, localizeTree, randomID);
  const attacks = profile.attacks.map(combo => {
    const steps = [];
    for (let i = 0; i < combo.length; i += 2) {
      const item = gear.get(combo[i]);
      steps.push({attack:item.name, itemId:item._id, action:item.type === "shield" ? "parry" : "attack", value:combo[i+1]});
    }
    return steps;
  });
  const learned = knowledgeItems(profile, localize);
  const magicItems = Object.entries(profile.tablets ?? {}).flatMap(([id, level]) => {
    const tablet = TABLET_BY_ID.get(id);
    const item = tabletItemData(tablet);
    item.system.level = level;
    return [item, ...tablet.powers.filter(power => power.level <= level).map(power => powerItemData(power, tablet))];
  });
  const race = profile.race ?? "human";
  const armor = [...gear.values()].find(item => item.type === "armor" && item.system.equipped);
  const armorInitiative = armor ? resolveArmorProfile({item:armor, actor:{items:learned}}).initiativeModifier.value : 0;
  const ranks = new Map(profile.knowledge.split(" ").map(field => field.split(":")));
  const initiativeBonus = Number(ranks.get("battleExperience") ?? 0) + 2 * Number(ranks.get("combatReaction") ?? 0);
  const resource = value => ({value, max:value});
  return {
    name, type:"npc", img:"icons/svg/mystery-man.svg", folder, ownership:{default:0},
    flags:{[scope]:{starterId:`pregen-${profile.id}`, inventoryInitialized:true}},
    prototypeToken:{name, actorLink:false, disposition:0},
    items:[...learned, ...gear.values(), ...magicItems],
    system:{
      details:{race, culture:profile.culture, religion:profile.religion, age:String(profile.age),
        size:"1t", type:"humanoid", creatureType:localize(`${labelRoot}.Qualifier.${race}`),
        move:[{mode:"land", cost:"2", distance:"1 m", max:`${profile.move} m`}],
        bodyMin:profile.hp, bodyMax:profile.hp,
        source:{book:localize(`${labelRoot}.Rulebook`), page:profile.page}},
      description:`<p>${format(`${labelRoot}.ProfileSource`, {page:profile.page})}</p><p>${localize(`${labelRoot}.Age`)} · ${profile.age}</p>`,
      movement:{base:profile.move},
      initiative:{base:profile.initiative - (profile.traits.dexterity ?? 0) - initiativeBonus - armorInitiative},
      traits:profile.traits, skills:Object.fromEntries(Object.entries(profile.skills).map(([key,value]) => [key,{value}])),
      resources:{body:resource(profile.hp),vitner:resource(profile.vitner ?? 0),divinity:resource(profile.divinity ?? 0)},
      attacks
    }
  };
}

export async function installPregeneratedActors(items, folder, localizeTree) {
  const equipment = new Map(items.map(item => [item.nameKey, item]));
  const known = new Set(game.actors.map(actor => actor.getFlag(scope, "starterId")));
  const resolvers = {localize:key => game.i18n.localize(key), format:(key,data) => game.i18n.format(key,data),
    randomID:() => foundry.utils.randomID(), folder:folder.id, localizeTree};
  const profiles = PREGENERATED_ACTORS.filter(profile => !known.has(`pregen-${profile.id}`));
  if (!profiles.length) return 0;
  // The prepared combinations reference the IDs of the embedded weapons.
  await Actor.createDocuments(profiles.map(profile => pregeneratedActorPayload(profile, equipment, resolvers)), {keepEmbeddedIds:true});
  return profiles.length;
}
