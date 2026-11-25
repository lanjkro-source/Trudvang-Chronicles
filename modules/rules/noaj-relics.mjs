import {BESTIARY_ENTRIES} from "../bestiary-catalog-data.mjs";

export const NOAJ_DRAGON_TABLET = "holy-haminges-power-of-the-dragon";
const sources = new Map(BESTIARY_ENTRIES.map(entry=>[entry.id,entry.actor.nameKey]));
for(const [id,key] of Object.entries({human:"TRUDVANG.Race.Human",elf:"TRUDVANG.Race.Elf",
  dwarf:"TRUDVANG.NoajRelic.Dwarf",caveBoar:"TRUDVANG.NoajRelic.CaveBoar"})) sources.set(id,key);
export const noajOrigins = sources;

// Livre des règles, tablettes de Haminges, p. 268–279. Variants of the same
// species share a slot, for instance the young and old hrimtroll.
const allowed = new Map(Object.entries({
  beast:["wYxOQTmSnToUpVqW","YjHk2sXsYtZu0v1w","caveBoar"],
  dragon:["LY49GIcIdJeKfLgM","i4meLKfLgMhNiOjP","CjkhIYqWrXsYtZu0"],
  men:["human","dwarf","elf"],
  scale:["LDvVaVmSnToUpVqW","AOI0ZaC7C8D9EaGb"],
  thurses:["lfC0p0tZu0v1w2x3","P1vAjhJeKfLgMhNi","cRrA21u0v1w2x3y4","mH3DrVnToUpVqWrX"],
  trolls:["pAbCZpRmSnToUpVq","fXocmhLgMhNiOjPk","4aJbFSmSnToUpVqW"]
}).map(([name,ids])=>[`holy-haminges-power-of-${["men","trolls"].includes(name)?"":"the-"}${name}`,new Set(ids)]));
const species = id => id==="mH3DrVnToUpVqWrX"?"cRrA21u0v1w2x3y4":id;

export const noajRelic = item => item?.type==="gear" && item.system?.noajRelic?.enabled ? item.system.noajRelic : null;
export const isNoajTablet = item => item?.type==="tablet" && (item.system?.religion==="haminges" ||
  item.system?.catalogId?.startsWith("holy-haminges-"));
export const relicStatus = item => !item?"absent":noajRelic(item)?.broken?"broken":item.system.equipped?"worn":"stored";

export function relicFitsTablet(creatureId,tabletCatalogId) {
  if(!sources.has(creatureId))return false;
  const options=allowed.get(tabletCatalogId);
  return options?options.has(creatureId):true;
}

export function noajRelics(actor) {
  return actor?.id?Array.from(actor.items??[]).filter(item=>noajRelic(item)?.ownerId===actor.id):[];
}

export function noajRelicForTablet(actor,tabletId) {
  const matches=noajRelics(actor).filter(item=>noajRelic(item).tabletId===tabletId);
  return matches.find(item=>!noajRelic(item).broken)??matches[0]??null;
}

export function noajRelicConflict(actor,item,tabletId) {
  const origin=noajRelic(item)?.creatureId;
  return noajRelics(actor).some(other=>{
    const relic=noajRelic(other);
    return other.id!==item.id&&!relic.broken&&(relic.tabletId===tabletId||species(relic.creatureId)===species(origin));
  });
}

export function relicsAtRisk(actor) {
  return noajRelics(actor).filter(item=>relicStatus(item)==="worn"
    && isNoajTablet(actor.items.get?.(noajRelic(item).tabletId)
      ??Array.from(actor.items).find(tablet=>tablet.id===noajRelic(item).tabletId)));
}

export function relicAttackResult(relics,die,damage) {
  if(!Number.isInteger(die)||die<1||die>20)return null;
  const relic=relics[die-1];
  return {die,count:relics.length,itemId:relic?.id??"",name:relic?.name??"",broken:Boolean(relic&&damage>=5)};
}
