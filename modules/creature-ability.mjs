import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const flag = (document, key) => document.getFlag?.(SYSTEM_ID, key) ?? document.flags?.[SYSTEM_ID]?.[key];
export const isCreatureAbility = document => Boolean(flag(document, "feat"));

/** Presentation metadata belongs to the capacity, separately from actual effect changes. */
export function creatureAbilityDetails(document, {language = "fr", localize}) {
  const reference = CREATURE_ABILITY_REFERENCES[flag(document, "feat")];
  const code = language === "fr" ? "fr" : "en";
  const summary = flag(document, "capacitySummary") ?? (reference ? localize(`TRUDVANG.Content.CreatureAbility.${reference.id}.Summary`) : "");
  const source = flag(document, "capacitySource") ?? (reference ? {
    book: localize(`TRUDVANG.Content.CreatureAbility.${reference.id}.SourceBook`), page: reference.pages[code]
  } : {book: "", page: ""});
  return {name: document.name, img: document.img, summary, description: document.description || "", source};
}
