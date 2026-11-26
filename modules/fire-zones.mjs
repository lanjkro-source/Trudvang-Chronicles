import {darknessSourceGeometry} from "./rules/jorn-darkness.mjs";
import {combatPoolsAreFull} from './rules/combat-pool-resolver.mjs';
import {applyZoneDamage} from './zone-damage.mjs';
const S='trudvang-chronicles';
export const fireEvadeItem=actor=>actor.findRuleKnowledge?.('evade')??actor.findKnowledgeItem?.('evade');
export function canEvadeZoneFire(actor){
 if(actor.transformationProfile?.noDodge||!(Number(fireEvadeItem(actor)?.system?.level)>0)||actor.canPerformAction?.({movement:true,skill:true})===false)return false;
 const inCombat=actor.isInActiveCombat??actor.isInCombatActive?.()??false;
 return !inCombat||combatPoolsAreFull(actor)&&!Number(actor.system?.unarmedActionsSpent)&&!Array.from(actor.items??[]).some(i=>Number(i.system?.weaponActionsSpent)>0);
}
export function zoneFireInitiativePenalty(actor,combat=globalThis.game?.combat){
 const participant=Array.from(combat?.combatants??[]).find(c=>c.actor?.uuid===actor.uuid),current=combat?.combatant;
 const own=participant?.initiative,active=current?.initiative;return Number.isFinite(own)&&Number.isFinite(active)?-Math.abs(own-active):0;
}
/** The event key is shared with the normal damage application ledger. */
export function applyZoneFireDamage({actor,info,message}){
 return applyZoneDamage({actor,message,formula:info.profile.damageFormula,openRoll:info.profile.openRoll,
  qualification:info.profile.qualification,legacyEvent:'zone-fire:'+message.id+':'+actor.uuid});
}

const lightJobs=new Map(),lightDeletions=new WeakMap();
const collectionValues=rows=>Array.from(rows?.values?.()??rows??[]);
const lightRegion=light=>light.flags?.[S]?.spellZoneLight?.regionUuid;
/** Radius is converted from the actual circle's pixels to the scene's units. */
export function spellZoneFireLightData(region, info=region.flags?.[S]?.spellZone){
 const shape=Array.from(region.shapes??[]).find(shape=>shape.type==='circle');
 if(!shape||!['fire','fixedLight'].includes(info?.profile.kind))return null;
 const support=info.lightTokenId?region.parent.tokens?.get(info.lightTokenId):null;
 if(info.lightTokenId&&!support)return null;
 const radius=Number(shape.radius)*Number(region.parent.grid?.distance||1)/Number(region.parent.grid?.size||1);
 const illumination=info.profile.illumination;
 const scale=illumination?radius/info.profile.radius:1;
 const flame=illumination?.flame??info.profile.kind==='fire';
 // Physical fire colour requested by the GM, independent of the interface palette.
 const hidden=Boolean(info.lightExtinguished||support?.hidden||info.profile.requiresDaylight&&Number(region.parent.environment?.darknessLevel)>=0.5);
 const size=Number(region.parent.grid?.size||1);
 const x=support?Number(support.x)+Number(support.width??1)*size/2:Number(shape.x);
 const y=support?Number(support.y)+Number(support.height??1)*size/2:Number(shape.y);
 return {name:game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name'),x,y,elevation:Number(support?.elevation??info.elevation)||0,hidden,walls:true,vision:false,
  config:{bright:illumination?illumination.bright*scale:radius,dim:illumination?illumination.dim*scale:0,angle:360,
   ...(flame?{color:'#ffb347',alpha:0.1,attenuation:0,animation:{type:'flame',speed:3,intensity:4}}:{color:null,attenuation:0})},
  flags:{[S]:{spellZoneLight:{regionUuid:region.uuid}}}};
}
export function spellZoneDarknessLightData(region, info=region.flags?.[S]?.spellZone) {
 if (info?.profile?.kind !== "darkness") return null;
 const geometry = darknessSourceGeometry(collectionValues(region.shapes)[0]);
 if (!geometry) return null;
 const {x,y,radius,boundary} = geometry;
 const {penalty,nightPenalty} = info.profile;
 const pixelsToUnits = Number(region.parent.grid?.distance || 1) / Number(region.parent.grid?.size || 1);
 return {
  name:game.i18n.localize("TRUDVANG.Content.Power."+info.context.sourceId+".Name"),
  x,y,elevation:info.elevation,levels:collectionValues(region.levels),hidden:false,walls:false,vision:false,
  config:{negative:true,priority:100,bright:(radius+(boundary ? 1 : 0))*pixelsToUnits,dim:0,angle:360,gradual:false,attenuation:0},
  flags:{[S]:{spellZoneLight:{regionUuid:region.uuid,darkness:{penalty,nightPenalty,boundary:boundary??null}}}}
 };
}
function deleteLightOnce(light){
 if(lightDeletions.has(light))return lightDeletions.get(light);
 const job=Promise.resolve().then(()=>light.parent.lights.get(light.id)===light?light.delete():false).finally(()=>lightDeletions.delete(light));lightDeletions.set(light,job);return job;
}
function includesLightValues(actual,wanted){return Object.entries(wanted).every(([key,value])=>value&&typeof value==='object'?includesLightValues(actual?.[key]??{},value):actual?.[key]===value);}
/** Called by the active GM; serializing also covers overlapping native region hooks. */
export function syncSpellZoneLight(region,{removed=false,illuminationSource}={}){
 const previous=lightJobs.get(region.uuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const scene=region.parent,lights=collectionValues(scene.lights).filter(light=>lightRegion(light)===region.uuid),data=removed?null:spellZoneDarknessLightData(region)??spellZoneFireLightData(region,illuminationSource);
  if(!data){for(const light of lights)await deleteLightOnce(light);return null;}
  let light=lights[0];for(const duplicate of lights.slice(1))await deleteLightOnce(duplicate);
  if(!light){[light]=await scene.createEmbeddedDocuments('AmbientLight',[data]);if(!light)throw Error('Spell area light creation failed');}
  else if(['x','y','elevation','hidden','walls','vision'].some(key=>light[key]!==data[key])||!includesLightValues(light.config,data.config)
    ||(data.levels && (data.levels.length !== collectionValues(light.levels).length || data.levels.some(id => !collectionValues(light.levels).includes(id))))
    ||JSON.stringify(light.flags?.[S]?.spellZoneLight?.darkness)!==JSON.stringify(data.flags[S].spellZoneLight.darkness))await light.update(data);
  return light;
 }).finally(()=>{if(lightJobs.get(region.uuid)===job)lightJobs.delete(region.uuid);});lightJobs.set(region.uuid,job);return job;
}
export async function cleanupOrphanSpellZoneLights(scene){
 const regions=new Set(collectionValues(scene.regions).map(region=>region.uuid));
 for(const light of collectionValues(scene.lights))if(lightRegion(light)&&!regions.has(lightRegion(light)))await deleteLightOnce(light);
}
