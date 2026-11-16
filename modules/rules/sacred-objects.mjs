import {PUBLIC_STARTER_CRAFTS,PUBLIC_STARTER_FOLDERS} from '../sacred-equipment-data.mjs';
import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
export const SACRED_TYPES=['weapon','armor','shield','gear'];
export const CRAFT_MATERIALS=['hardMaterials','softMaterials'];
const n=v=>Math.max(0,Math.trunc(Number(v)||0));
export const sacredState=item=>item?.system?.sacred;
export const isSacredObject=item=>SACRED_TYPES.includes(item?.type)&&sacredState(item)?.enabled===true;
export function equipmentCraftMaterial(item){
 const s=item?.system??{};if(CRAFT_MATERIALS.includes(s.craftMaterial))return s.craftMaterial;
 const id=String(item?.flags?.['trudvang-chronicles']?.starterId??'').split('.').at(-1);
 if(['Slingu','StafurSlingu','AverageClothes','PoorClothes','RichClothes','SlaveClothes','RoyalAttire','SpiderSilkBraidedRope','SpiderSilkBowstring','SpiderSilk','MinokksHeart','LindwurmRegeneratingHeart'].includes(id))return 'softMaterials';
 return ['leather','cloth'].includes(s.material)?'softMaterials':'hardMaterials';
}
export const sacredCapacity=(actor,material)=>['invoke','handicraft'].reduce((sum,id)=>sum+n(actor.findRuleKnowledge?.(id)?.system?.level),0)+2*n(actor.findRuleKnowledge?.('thuulForging')?.system?.level)+2*n(actor.findRuleKnowledge?.(material)?.system?.level);
export function sacredObjects(actor){return Array.from(actor?.items??[]).filter(item=>isSacredObject(item)&&(!sacredState(item).creatorUuid||sacredState(item).creatorUuid===actor.uuid));}
export function sacredBalance(actor){
 const invested=sacredObjects(actor).reduce((sum,item)=>sum+n(sacredState(item).invested),0),total=n(actor?.system?.resources?.divinity?.max);
 return {total,invested,free:Math.max(0,total-invested),overdrawn:Math.max(0,invested-total)};
}
export function runeDefinition(id){return POWER_DETAILS_BY_ID[id]?.isRune?POWER_DETAILS_BY_ID[id]:null;}
export function runeDailyLimit(id,level){const d=runeDefinition(id);if(!d||d.spellType==='permanent')return null;return d.runeActivation?.dailyPerLevel?n(level)*d.runeActivation.dailyPerLevel:n(d.runeActivation?.daily??0);}
export function runeRow(row){
 const d=runeDefinition(row.sourceId),permanent=d?.spellType==='permanent',level=Math.min(5,Math.max(1,n(row.level))),daily=runeDailyLimit(row.sourceId,level);
 const max=permanent?null:Math.min(daily,Math.floor(n(row.invested)/level));
 const remaining=permanent?null:Math.max(0,Math.min(daily-n(row.uses),Math.floor(n(row.current)/level)));
 return {...row,level,permanent,max,remaining,canUse:Boolean(d&&!permanent&&remaining>0)};
}
export function validSacredState(s){
 if(!s||!Number.isInteger(s.invested)||s.invested<0||!Number.isInteger(s.current)||s.current<0||s.current>s.invested)return false;
 const ids=new Set();let invested=0,current=0;
 for(const row of s.runes??[]){if(ids.has(row.id)||!runeDefinition(row.sourceId)||!Number.isInteger(row.level)||row.level<1||row.level>5||!Number.isInteger(row.invested)||row.invested<row.level||!Number.isInteger(row.current)||row.current<0||row.current>row.invested||!Number.isInteger(row.uses)||row.uses<0)return false;ids.add(row.id);invested+=row.invested;current+=row.current;}
 return invested<=s.invested&&current<=s.current&&s.current-current<=s.invested-invested;
}
/** Public starter identities do not require explicit ownership: normal imports inherit
 * NONE from core defaults. GM catalogue entries and private folder branches remain excluded. */
export function publicSacredTemplates(items){
 return Array.from(items??[]).filter(item=>{
  if(!SACRED_TYPES.includes(item.type)||isSacredObject(item)||!item.flags?.['trudvang-chronicles']?.starterId||item.inCompendium)return false;
  if(!Object.hasOwn(PUBLIC_STARTER_CRAFTS,item.flags['trudvang-chronicles'].starterId))return false;
  for(let folder=item.folder;folder;folder=folder.folder){
   const id=folder.flags?.['trudvang-chronicles']?.starterId;
   if(/^gm/i.test(id??'')||folder.flags?.['trudvang-chronicles']?.gmOnly||folder.ownership&&Number(folder.ownership.default??0)<2&&!PUBLIC_STARTER_FOLDERS.includes(id))return false;
  }
  return true;
 });
}

export function runeObjectEligible(item,sourceId){
 const restriction=runeDefinition(sourceId)?.runeActivation?.objectRestriction;
 if(restriction==='metalSlashing')return item.type==='weapon'&&item.system.damageQualification?.type==='slashing'&&['steel','iron','bronze','silver','grindsilver'].includes(item.system.material);
 if(restriction==='bludgeoningWeapon')return item.type==='weapon'&&item.system.damageQualification?.type==='bludgeoning';
 if(restriction==='pairedGear')return item.type==='gear';
 return true;
}
