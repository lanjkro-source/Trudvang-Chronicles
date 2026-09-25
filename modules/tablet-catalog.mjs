import { tabletAffinity } from "./rules/tablet-affinity.mjs";
import { POWER_CATALOG_BY_TABLET, POWER_DETAILS_BY_ID } from "./power-catalog-data.mjs";

const slug = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const isFrench = () => globalThis.game?.i18n?.lang === "fr";
const localized = (key, fallback) => {
  const i18n = globalThis.game?.i18n;
  return i18n && typeof i18n.has === "function" && i18n.has(key) ? i18n.localize(key) : fallback;
};

// Runtime text resolvers. The compendium pack builder injects Node-side equivalents via
// {localize, format} so shipped packs and runtime-created items resolve text identically.
const defaultLocalize = (key, fallback = "") => localized(key, fallback);
const defaultFormat = (key, params) => {
  const i18n = globalThis.game?.i18n;
  if (i18n && typeof i18n.format === "function") return i18n.format(key, params);
  return Object.entries(params ?? {}).reduce((text, [name, value]) => text.split(`{${name}}`).join(String(value)), String(key));
};

// Page references are edition-specific: the official French « Livre des règles » has its
// own pagination, so a tablet may carry a separate pageFr next to the English page. The
// resolver hook lets Node-side pack builds pick the edition explicitly instead of relying
// on the active UI language.
const tabletPage = (tablet, resolvers) => ((resolvers?.isFrench ?? isFrench)() && tablet.pageFr) || tablet.page;

export const getPowerSummary = power => localized(`TRUDVANG.Content.Power.${power.id}.Summary`, "");

export const tabletName = tablet => localized(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
export const tabletSummary = tablet => localized(`TRUDVANG.Content.Tablet.${tablet.id}.Summary`, "");
export const powerName = power => localized(`TRUDVANG.Content.Power.${power.id}.Name`, power.name);

export function sortTabletPowers(powers, tabletId = "") {
  const catalogOrder = new Map((TABLET_BY_ID.get(tabletId)?.powers ?? []).map((power, index) => [power.id, index]));
  const level = power => Number(power.system?.level) || 1;
  return [...powers].sort((a, b) => level(a) - level(b)
    || (catalogOrder.get(a.system?.catalogId) ?? Number.MAX_SAFE_INTEGER) - (catalogOrder.get(b.system?.catalogId) ?? Number.MAX_SAFE_INTEGER)
    || a.name.localeCompare(b.name));
}

// The compact source below mirrors the master tablet lists in the rulebooks. Pages are
// printed book pages verified against each edition's own table of contents and running
// folios (August 2026): `page` cites the English Player's Handbook, `pageFr` the official
// French « Livre des règles », whose pagination — and even tablet ordering — differs.
// Tablet identity and page metadata are kept here; the powers themselves are
// generated from the bilingual power source JSON into POWER_CATALOG_BY_TABLET.
const DEFINITIONS = [
  ["Animal Vitner","vitner","",92,187],
  ["Body Vitner","vitner","",96,192],
  ["Delusion Vitner","vitner","",101,197],
  ["Dimvitner","vitner","",105,155],
  ["Flame Craft","vitner","",109,166],
  ["Perceiving","vitner","",112,173],
  ["Power of Thought","vitner","",116,176],
  ["Power of Vision","vitner","",120,180],
  ["Soil Craft","vitner","",123,158],
  ["Vitner Craft","vitner","",129,152],
  ["Vitner of Objects","vitner","",132,200],
  ["Water Craft","vitner","",135,163],
  ["Wind Craft","vitner","",139,169],
  ["Witchcraft","vitner","",143,184],
  ["Influence of Jorn","holy","gerbanis",160,222],
  ["Power of Enken","holy","gerbanis",162,224],
  ["Strength of Stormi","holy","gerbanis",164,218],
  ["Warmth of Sunvei","holy","gerbanis",166,216],
  ["Wisdom of Windinna","holy","gerbanis",168,226],
  ["Wrath of Tyrd","holy","gerbanis",171,220],
  ["Gift of Thanja","holy","ealdTradition",176,234],
  ["Halawen's Offering","holy","ealdTradition",178,239],
  ["Heritage of Majne","holy","ealdTradition",181,236],
  ["Magh's Gift","holy","ealdTradition",183,232],
  ["Nema's Usefulness","holy","ealdTradition",185,244],
  ["Tribute of Morgu","holy","ealdTradition",187,241],
  ["Tablet of Anger","holy","tenetNid",194,250],
  ["Tablet of Grace","holy","tenetNid",197,253],
  ["Tablet of the Knight","holy","tenetNid",199,259],
  ["Tablet of the Shield","holy","tenetNid",201,257],
  ["Tablet of the Sun","holy","tenetNid",203,262],
  ["Tablet of Voices","holy","tenetNid",206,255],
  ["Power of the Beast","holy","haminges",212,268],
  ["Power of the Dragon","holy","haminges",214,277],
  ["Power of Men","holy","haminges",216,272],
  ["Power of the Scale","holy","haminges",218,270],
  ["Power of the Thurses","holy","haminges",221,275],
  ["Power of Trolls","holy","haminges",223,274],
  ...[["Anvil Shock",229,285],["Borjorn's Hand",229,287],["Cave Spider's Grip",229,287],["Earthquake",229,288],["Fang of Yukk",230,286],["Gills of the Blackfish",231,285],["Hammer Fists",231,287],["Healing Rune",231,287],["Heat of the Depths",231,285],["Labyrinth Blood",231,288],["Mark of Brokk",231,287],["Power of Repair",231,287],["Scales",232,286],["Stoneling",232,286],["Stone to Clay",232,288],["Stoneshape",232,285],["Well of Water",232,288]].map(([name, page, pageFr]) => [name,"holy","thuuldom",page,pageFr]),
  ["Animal Mind","holy","toikalokke",237,295],
  ["Lynx Power","holy","toikalokke",239,293],
  ["Master of Elements","holy","toikalokke",241,297]
];

export const TABLET_CATALOG = DEFINITIONS.map(([name, tabletType, religion, page, pageFr]) => {
  const id = `${tabletType}-${religion ? `${slug(religion)}-` : ""}${slug(name)}`;
  const powers = POWER_CATALOG_BY_TABLET[id];
  if (!powers?.length) throw new Error(`Missing generated powers for tablet ${id}`);
  return {
    id, name, tabletType, religion, page, pageFr,
    powers
  };
});

export const TABLET_BY_ID = new Map(TABLET_CATALOG.map(tablet => [tablet.id, tablet]));

export function tabletItemData(tablet, resolvers = {}) {
  const localize = resolvers.localize ?? defaultLocalize;
  const format = resolvers.format ?? defaultFormat;
  const runeSummary = tablet.religion === "thuuldom" && tablet.powers[0] ? localize(`TRUDVANG.Content.Power.${tablet.powers[0].id}.Summary`) : "";
  const name = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
  const theme = localize(`TRUDVANG.Content.Theme.${tablet.id}`);
  const description = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Description`)
    || theme
    || (runeSummary ? format("TRUDVANG.Content.ThuulRunePrefix", {summary: runeSummary.charAt(0).toLowerCase() + runeSummary.slice(1)}) : "")
    || format("TRUDVANG.Description.TabletSummary", {name});
  return {
    name,
    type: "tablet",
    img: tablet.tabletType === "vitner" ? "icons/svg/book.svg" : "icons/svg/holy-shield.svg",
    flags: {"trudvang-chronicles": {catalogId: tablet.id}},
    system: {
      catalogId: tablet.id,
      description,
      summary: localize(`TRUDVANG.Content.Tablet.${tablet.id}.Summary`) || theme,
      swedishName: localize(`TRUDVANG.Content.Tablet.${tablet.id}.SwedishName`),
      negation: localize(`TRUDVANG.Content.Tablet.${tablet.id}.Negation`),
      affinity: tablet.tabletType === "vitner" ? tabletAffinity(tablet.id) : tabletAffinity(""),
      source: format("TRUDVANG.Description.SourcePage", {page: tabletPage(tablet, resolvers)}),
      level: 1, tabletType: tablet.tabletType, religion: tablet.religion
    }
  };
}

export function powerItemData(power, tablet, resolvers = {}) {
  const localize = resolvers.localize ?? defaultLocalize;
  const format = resolvers.format ?? defaultFormat;
  const language = (resolvers.isFrench ?? isFrench)() ? "fr" : "en";
  const details = POWER_DETAILS_BY_ID[power.id];
  const name = localize(`TRUDVANG.Content.Power.${power.id}.Name`, power.name);
  const tabletLabel = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
  const powerLevels = (details?.powerLevels ?? []).map((entry, index) => ({
    ...entry, effect: localize(`TRUDVANG.Content.Power.${power.id}.PowerLevels.${index}`)
  }));
  return {
    name,
    type: power.type,
    img: power.type === "spell" ? "icons/svg/daze.svg" : "icons/svg/angel.svg",
    flags: {"trudvang-chronicles": {catalogId: power.id, tabletId: tablet.id}},
    system: {
      catalogId: power.id, tabletId: tablet.id, tablet: tabletLabel,
      description: localize(`TRUDVANG.Content.Power.${power.id}.Description`) || localize(`TRUDVANG.Content.Power.${power.id}.Summary`) || format("TRUDVANG.Description.PowerSummary", {name, tablet: tabletLabel}),
      summary: localize(`TRUDVANG.Content.Power.${power.id}.Summary`),
      swedishName: localize(`TRUDVANG.Content.Power.${power.id}.SwedishName`),
      duration: localize(`TRUDVANG.Content.Power.${power.id}.Duration`),
      range: localize(`TRUDVANG.Content.Power.${power.id}.Range`),
      weavingTime: localize(`TRUDVANG.Content.Power.${power.id}.CastingTime`),
      dailyActivation: localize(`TRUDVANG.Content.Power.${power.id}.DailyActivation`),
      spellType: details?.spellType ?? "instant",
      isRune: details?.isRune ?? false,
      powerLevels,
      source: format("TRUDVANG.Description.SourcePage", {page: (language === "fr" ? details?.pageFr : details?.page) ?? tabletPage(tablet, resolvers)}),
      level: power.level, cost: details?.isRune ? 0 : power.cost, modifier: power.modifier
    }
  };
}
