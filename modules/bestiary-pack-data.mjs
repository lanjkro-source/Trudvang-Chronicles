import {deterministicId} from "./skill-pack-data.mjs";
import {CREATURE_ABILITY_ENTRIES} from "./creature-ability-data.mjs";
import {BESTIARY_ENTRIES} from "./bestiary-catalog-data.mjs";
import {TABLET_BY_ID, powerItemData, tabletItemData} from "./tablet-catalog.mjs";

// Pure builders: the same stable identities survive a later move to a content module.
export const BESTIARY_PACKS = [
  {code: "fr", packName: "bestiary-fr", label: "Bestiaire (fr)"},
  {code: "en", packName: "bestiary-en", label: "Bestiary (en)"}
];
export const CREATURE_ABILITY_PACKS = [
  {code: "fr", packName: "feats-fr", label: "Capacités (fr)"},
  {code: "en", packName: "feats-en", label: "Feats (en)"}
];

function localizedTree(value, localize) {
  if (Array.isArray(value)) return value.map(child => localizedTree(child, localize));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => key.endsWith("Key")
    ? [key.slice(0, -3), localize(child)] : [key, localizedTree(child, localize)]));
}

export function creatureAbilityItemData(entry, {code, localize, strict = false}) {
  const text = suffix => {
    const key = `TRUDVANG.Content.CreatureAbility.${entry.id}.${suffix}`;
    const value = localize(key);
    if (strict && (!value || value === key)) throw new Error(`Missing capacity text: ${key} (${code})`);
    return value;
  };
  return {_id: entry.id, name: text("Name"), type: "creatureAbility", img: "icons/svg/aura.svg",
    system: {catalogId: entry.id, summary: text("Summary"), description: text("Description"),
      source: {book: text("SourceBook"), page: entry.pages[code]}, ignoreWoundPenalties: entry.ignoreWoundPenalties},
    effects: []};
}

export function buildCreatureAbilityPackDocuments(options) {
  return {folders: [], items: CREATURE_ABILITY_ENTRIES.map(entry => {
    const item = creatureAbilityItemData(entry, options);
    return {...item, _key: `!items!${item._id}`, folder: null};
  })};
}

export function buildBestiaryPackDocuments({code, localize, format, isFrench, strict = false}) {
  const families = [...new Set(BESTIARY_ENTRIES.map(entry => entry.family))];
  const folders = families.map(family => {
    const id = deterministicId(`folder:bestiary:${family}`);
    return {_id: id, _key: `!folders!${id}`, name: localize(`TRUDVANG.Npc.CreatureTypes.${family}`),
      type: "Actor", folder: null, sorting: "a", sort: 0};
  });
  const abilities = new Map(CREATURE_ABILITY_ENTRIES.map(entry => [entry.id, entry]));
  const actors = BESTIARY_ENTRIES.map(entry => {
    const actor = localizedTree(entry.actor, key => {
      const value = localize(key);
      if (strict && (!value || value === key)) throw new Error(`Missing creature text: ${key} (${code})`);
      return value;
    });
    actor.system.details.source.page = entry.pages[code];
    actor.items.push(...entry.featIds.map(id => creatureAbilityItemData(abilities.get(id), {code, localize, strict})));
    for (const {id, level} of entry.tablets) {
      const tablet = TABLET_BY_ID.get(id);
      if (!tablet) throw new Error(`Unknown tablet ${id} for creature ${entry.id}`);
      const resolvers = {localize, format, isFrench};
      const tabletItem = tabletItemData(tablet, resolvers);
      actor.items.push({...tabletItem, _id: deterministicId(`tablet:${id}`),
        system: {...tabletItem.system, level}},
      ...tablet.powers.map(power => ({...powerItemData(power, tablet, resolvers), _id: deterministicId(`power:${power.id}`)})));
    }
    actor.items = actor.items.map(item => ({...item, _key: `!actors.items!${entry.id}.${item._id}`, effects: item.effects ?? []}));
    return {...actor, _id: entry.id, _key: `!actors!${entry.id}`,
      folder: deterministicId(`folder:bestiary:${entry.family}`)};
  });
  return {folders, actors};
}
