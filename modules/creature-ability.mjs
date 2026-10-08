import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const flag = (document, key) => document.getFlag?.(SYSTEM_ID, key) ?? document.flags?.[SYSTEM_ID]?.[key];
const creatureAbilityNameById = new Map(Object.entries(CREATURE_ABILITY_REFERENCES).map(([name, reference]) => [reference.id, name]));
// TEMPORARY WORLD MIGRATION — keep historical flagged ActiveEffect capacities readable.
export const isCreatureAbility = document => document?.type === "creatureAbility" || Boolean(flag(document, "feat"));

const abilityIconRules = [
  [/^apparence$/, "fa-masks-theater"],
  [/absorption de vie|coeur|regener|curative|sacrifice vital|perception de la vie|suceur de sang/, "fa-heart-pulse"],
  [/aile|hauteur/, "fa-feather-pointed"],
  [/camouflage|camoufle|hylja|illusion|imitation|guide trompeur/, "fa-eye-slash"],
  [/chance|superstitieux/, "fa-clover"],
  [/chant/, "fa-music"],
  [/hurlement|mugissement/, "fa-volume-high"],
  [/cocon|toile|araignee/, "fa-spider"],
  [/communication avec les animaux|controle des animaux/, "fa-paw"],
  [/connaissances de la magie|manipulation du vitner|morkvitner|poudre de fee|pouvoirs|vitner|enchanteur|envoutement|danse feerique/, "fa-wand-magic-sparkles"],
  [/noyade|controle de l'eau/, "fa-water"],
  [/constriction|empoignement|saisie/, "fa-hand"],
  [/tempete/, "fa-cloud-bolt"],
  [/immunite|protection|resistant|robuste|intrepide|tenace|corps herisse/, "fa-shield-halved"],
  [/souffle de glace|corps de glace|froid|glace/, "fa-snowflake"],
  [/feu|magmat|lave|surchauffe/, "fa-fire-flame-curved"],
  [/fumee|brume|brouillard/, "fa-cloud"],
  [/explosif/, "fa-burst"],
  [/maladie|infection|vecteur|venin|anesthesiante|acide|spores/, "fa-biohazard"],
  [/soleil|lumiere/, "fa-sun"],
  [/creation d.?une pierre de savoir/, "fa-gem"],
  [/lancer de rocher|pierre|petrification/, "fa-mountain-sun"],
  [/attaque des hauteurs|aile|charge|attaque|balayage|coup de cornes|projection|frenesie/, "fa-hand-fist"],
  [/danse curative|coeur de minokks|seve curative/, "fa-heart"],
  [/danse|magie|sort/, "fa-wand-magic-sparkles"],
  [/deplacement dans|nappe de brume|levee de brouillard/, "fa-cloud"],
  [/detection des reseaux souterrains/, "fa-radar"],
  [/vision dans le noir|vision nocturne|yeux de lune|reve de dimhall/, "fa-moon"],
  [/thermique/, "fa-temperature-high"],
  [/detection|perception|regard|vision|vue|yeux/, "fa-eye"],
  [/elements corporels/, "fa-bone"],
  [/corps|changement de forme|metamorphose|transformation/, "fa-dna"],
  [/hantise|terrif|peur|frayeur|fantome/, "fa-ghost"],
  [/faconnage des arbres|racines|seve protectrice/, "fa-tree"],
  [/parole|persuasion|telepathie/, "fa-comment-dots"],
  [/apparence|humeur/, "fa-masks-theater"],
  [/nom de l'ame/, "fa-signature"],
  [/tetes nombreuses|tete de huvfurwurm/, "fa-dragon"],
  [/rapide|vif|pattes/, "fa-person-running"],
  [/ventre d'or/, "fa-coins"],
  [/puanteur|odeur/, "fa-wind"],
  [/transfert des degats/, "fa-right-left"],
  [/telekinesie/, "fa-hand-sparkles"],
  [/sang|salive/, "fa-droplet"],
  [/racines|arbres/, "fa-tree"],
  [/deplacement|danse/, "fa-person-running"],
  [/souffle/, "fa-wind"],
];

function iconForAbility(label) {
  const normalized = String(label ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return abilityIconRules.find(([pattern]) => pattern.test(normalized))?.[1] ?? "fa-sparkles";
}

export function creatureAbilityIconClassForId(id) {
  const name = creatureAbilityNameById.get(id);
  return name ? iconForAbility(name) : null;
}

function catalogNameFor(document, name) {
  if (document.type === "creatureAbility") {
    return creatureAbilityNameById.get(document.system.catalogId) ?? name;
  }
  return flag(document, "feat") ?? name;
}

/** Presentation metadata belongs to the capacity, separately from actual effect changes. */
export function creatureAbilityDetails(document, {language = "fr", localize}) {
  if (document.type === "creatureAbility") return {name: document.name, img: document.img,
    iconClass: iconForAbility(catalogNameFor(document, document.name)),
    summary: document.system.summary || "", description: document.system.description || "", source: document.system.source};
  const reference = CREATURE_ABILITY_REFERENCES[flag(document, "feat")];
  const code = language === "fr" ? "fr" : "en";
  const summary = flag(document, "capacitySummary") ?? (reference ? localize(`TRUDVANG.Content.CreatureAbility.${reference.id}.Summary`) : "");
  const source = flag(document, "capacitySource") ?? (reference ? {
    book: localize(`TRUDVANG.Content.CreatureAbility.${reference.id}.SourceBook`), page: reference.pages[code]
  } : {book: "", page: ""});
  return {name: document.name, img: document.img, iconClass: iconForAbility(catalogNameFor(document, document.name)),
    summary, description: document.description || "", source};
}
