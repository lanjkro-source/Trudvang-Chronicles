import {POWER_CATALOG_BY_TABLET, POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {deterministicId} from "./skill-pack-data.mjs";

const normalize = value => String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

// Catalog ids are shared by the French and English packs, so icons stay consistent
// when switching between editions.
const POWER_ICON_RULES = [
  [/healing|heal|curative|remedial|medicine|soin|guerison/, "fa-heart-pulse"],
  [/blood|sang/, "fa-droplet"],
  [/fang|tusk|claw/, "fa-tooth"],
  [/dragon|lindwurm/, "fa-dragon"],
  [/fish|salmon|blackfish|gill/, "fa-fish"],
  [/water|wave|rain|precipitation|gill|breathe|purify-water|eau|vague/, "fa-water"],
  [/wolf|stag|deer|salmon|fish|blackfish|raven|crow|owl|horse|griffon|swine|boar|animal|bestial|beast|mastomant|spider|troll|thurse/, "fa-paw"],
  [/tree|forest|root|pine|harvest|leaf|wood|arbre|foret|racine/, "fa-leaf"],
  [/sun|sunray|summer|warmth|heat|fire|flame|spark|pyre|burn|feu|chaleur/, "fa-fire-flame-curved"],
  [/wind|gust|breeze|storm|hurricane|air|fog|mist|cloud|thunder|tempest|vent|brume|brouillard/, "fa-wind"],
  [/earthquake|stoneshape|stoneling|soil|stone|rock|mountain|quagmire|petrif|earth|seisme|pierre|terre/, "fa-mountain-sun"],
  [/shield|armor|armour|barrier|protection|guard|wall|coat|bouclier|armure/, "fa-shield-halved"],
  [/scales|scale|balance/, "fa-scale-balanced"],
  [/vision|sight|seeing|eye|gaze|detect|scan|perceiv|regard|vue|oeil/, "fa-eye"],
  [/hearing|ear|sound|voice|song|melody|anthem|cry|bellow|shout|shriek|roar|parole|chant|voix|cri/, "fa-volume-high"],
  [/mind|thought|memory|willpower|courage|fearless|bold|inspiration|telepath|understanding|script|amnesia|esprit|memoire|peur/, "fa-brain"],
  [/death|dead|undead|wight|ghost|phantom|dimhall|soul|necrom|mort|fantome|ame/, "fa-skull"],
  [/night|dark|dusk|shadow|invisible|gloom|darkness|nuit|ombre|tenebre/, "fa-moon"],
  [/rage|battle|war|weapon|sword|slayer|attack|fist|strength|rampage|combat|arme|force/, "fa-hand-fist"],
  [/travel|journey|trail|track|walk|movement|lift|hasten|rider|path|orientation|voyage|chemin|piste|deplacement/, "fa-person-running"],
  [/shape|change|transform|creature|appearance|form|possess|bind|immobil|enlarge|reduce|alter|metamorph|forme|apparence/, "fa-dna"],
  [/map|find-home|compass|navigate|cartograph|carte/, "fa-map"],
  [/brew|beer|ale|potion|draught|elixir|drink|biere/, "fa-flask"],
  [/smith|forge|hammer|anvil|repair|object|craft|marteau|enclume|objet/, "fa-hammer"],
  [/mark/, "fa-stamp"],
  [/hand/, "fa-hand-fist"],
  [/message|messenger|communication|command|call|telepathy|speech|messager/, "fa-comment-dots"],
  [/curse|plague|fever|disease|infection|madness|terror|fear|malediction|fievre|maladie/, "fa-biohazard"],
  [/vitner|magic|magical|spell|enchant|dispel|channel|weave|magie|sort|enchant/, "fa-wand-magic-sparkles"],
  [/king|crown|militia|knight|royal|jarl|roi|couronne|chevalier/, "fa-crown"],
  [/time|duration|hour|season|year|temps|saison|annee/, "fa-hourglass-half"],
  [/create|conjure|summon|manifest|creation|conjuration|invocation/, "fa-sparkles"]
];
const MATCHABLE_POWER_ICON_RULES = POWER_ICON_RULES.map(([pattern, icon]) => [new RegExp(`\\b(?:${pattern.source})\\b`), icon]);

const TABLET_FALLBACKS = [
  ["animal-vitner", "fa-paw"], ["body-vitner", "fa-person"], ["delusion-vitner", "fa-masks-theater"],
  ["dimvitner", "fa-skull"], ["flame-craft", "fa-fire-flame-curved"], ["perceiving", "fa-eye"],
  ["power-of-thought", "fa-brain"], ["power-of-vision", "fa-eye"], ["soil-craft", "fa-mountain-sun"],
  ["vitner-craft", "fa-wand-magic-sparkles"], ["vitner-of-objects", "fa-gears"], ["water-craft", "fa-water"],
  ["wind-craft", "fa-wind"], ["witchcraft", "fa-moon"], ["thuuldom", "fa-gem"],
  ["ealdtradition", "fa-leaf"], ["haminges", "fa-paw"], ["gerbanis", "fa-bolt"],
  ["tenetnid", "fa-scale-balanced"], ["toikalokke", "fa-feather-pointed"]
];

function iconForPower({id = "", name = "", type = "", isRune = false} = {}) {
  const key = normalize(id);
  const title = normalize(name);
  const match = MATCHABLE_POWER_ICON_RULES.find(([pattern]) => pattern.test(title));
  if (match) return match[1];
  if (isRune) return "fa-gem";
  const tabletTheme = TABLET_FALLBACKS.find(([theme]) => key.includes(theme));
  if (tabletTheme) return tabletTheme[1];
  return type === "spell" ? "fa-wand-magic-sparkles" : "fa-hands-praying";
}

const POWER_BY_ID = new Map(Object.values(POWER_CATALOG_BY_TABLET).flat().map(power => [power.id, power]));

export function powerIconClassForId(id) {
  const power = POWER_BY_ID.get(id);
  if (!power) return null;
  return iconForPower({...power, isRune: Boolean(POWER_DETAILS_BY_ID[id]?.isRune)});
}

export function powerIconClassForItem(item) {
  const id = item?.system?.catalogId ?? item?.flags?.["trudvang-chronicles"]?.catalogId;
  const catalogIcon = id && powerIconClassForId(id);
  if (catalogIcon) return catalogIcon;
  return iconForPower({id, name: item?.name, type: item?.type, isRune: Boolean(item?.system?.isRune)});
}

export const POWER_COMPENDIUM_ICON_BY_ITEM_ID = new Map(
  [...POWER_BY_ID.values()].map(power => [deterministicId(`power:${power.id}`), powerIconClassForId(power.id)])
);
