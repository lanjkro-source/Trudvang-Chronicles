import {TRUDVANG} from "../config.mjs";
import {CREATURE_ABILITY_ENTRIES} from "../creature-ability-data.mjs";

const feats = new Map(CREATURE_ABILITY_ENTRIES.map(entry => [entry.id, entry]));

/** Explicit feat mechanics also work on previously imported catalogue items. */
export function creatureMagicTraits(items = []) {
  const learned = Array.from(items).filter(item => item.type === "creatureAbility");
  // TEMPORARY WORLD MIGRATION — pre-0.67.0 imported feat Items have neither
  // magic mechanic. Read their stable catalogue identity without replacing the
  // user's embedded description. Remove catalogue fallbacks with old worlds.
  return {unlimitedVitner: learned.some(item => item.system.unlimitedVitner
      || feats.get(item.system.catalogId)?.unlimitedVitner),
    vitnerBonus: learned.reduce((sum, item) => sum + Number(item.system.vitnerCapacityBonus
      || feats.get(item.system.catalogId)?.vitnerCapacityBonus || 0), 0)};
}

/** Shared by prepared actors and pack builders; FR rules, Vitner/Faith chapters. */
export function magicCapacities({skill, level, vitnerBonus = 0, hasReligion = null}) {
  const vitnerType = Object.entries(TRUDVANG.vitnerTypes).find(([id]) => level(id) > 0);
  const religion = hasReligion ?? Object.values(TRUDVANG.religions).some(entry => level(entry.specialty) > 0);
  return {vitner: vitnerType && level("callVitner") > 0
    ? skill("vitnerCraft") + 5 * level("callVitner") + vitnerType[1].capacityPerLevel * level(vitnerType[0])
      + 10 * level("vitnerHabit") + vitnerBonus : null,
  divinity: religion && level("divinePower") > 0
    ? skill("faith") + 3 * level("divinePower") + 7 * level("faithful") + 7 * level("powerful") : null};
}
