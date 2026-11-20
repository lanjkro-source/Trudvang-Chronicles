import {combatPoolsAreFull} from './rules/combat-pool-resolver.mjs';
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
export async function applyZoneFireDamage({actor,token,info,message}){
 const event='zone-fire:'+message.id+':'+actor.uuid;
 let damage=Array.from(game.messages?.values?.()??game.messages??[]).find(m=>m.flags?.[S]?.persistentDamageEvent===event);
 if(!damage){const {rollDamage}=await import('./dice.mjs');const result=await rollDamage({actor,item:{name:game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name'),img:'icons/svg/fire.svg',system:{category:'magic',damage:info.profile.damageFormula,openRoll:info.profile.openRoll,strengthApplies:false,damageBonus:0}},context:{usage:'magic',automatic:true,ignoreActorDamage:true,returnMessage:true,boundActorUuid:actor.uuid,persistentDamageEvent:event,qualification:info.profile.qualification,targets:[token]}});damage=result?.message;}
 if(!damage)throw Error('Fire zone damage card missing');
 const {requestChatApplication}=await import('./chat-application.mjs');const result=await requestChatApplication({message:damage,actor,channel:'body'});if(!['applied','alreadyApplied','ineligibleTarget'].includes(result.status))throw Error('Fire zone damage application failed');
}

const lightJobs=new Map(),lightDeletions=new WeakMap();
const collectionValues=rows=>Array.from(rows?.values?.()??rows??[]);
const lightRegion=light=>light.flags?.[S]?.spellZoneLight?.regionUuid;
/** Radius is converted from the actual circle's pixels to the scene's units. */
export function spellZoneFireLightData(region){
 const info=region.flags?.[S]?.spellZone,shape=Array.from(region.shapes??[]).find(shape=>shape.type==='circle');
 if(info?.profile.kind!=='fire'||!shape)return null;
 const radius=Number(shape.radius)*Number(region.parent.grid?.distance||1)/Number(region.parent.grid?.size||1);
 // Physical fire colour requested by the GM, independent of the interface palette.
 return {name:game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name'),x:Number(shape.x),y:Number(shape.y),elevation:Number(info.elevation)||0,hidden:false,walls:true,vision:false,
  config:{bright:radius,dim:0,angle:360,color:'#ffb347',alpha:0.1,attenuation:0,animation:{type:'flame',speed:3,intensity:4}},flags:{[S]:{spellZoneLight:{regionUuid:region.uuid}}}};
}
function deleteLightOnce(light){
 if(lightDeletions.has(light))return lightDeletions.get(light);
 const job=Promise.resolve().then(()=>light.parent.lights.get(light.id)===light?light.delete():false).finally(()=>lightDeletions.delete(light));lightDeletions.set(light,job);return job;
}
function includesLightValues(actual,wanted){return Object.entries(wanted).every(([key,value])=>value&&typeof value==='object'?includesLightValues(actual?.[key]??{},value):actual?.[key]===value);}
/** Called by the active GM; serializing also covers overlapping native region hooks. */
export function syncSpellZoneFireLight(region,{removed=false}={}){
 const previous=lightJobs.get(region.uuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const scene=region.parent,lights=collectionValues(scene.lights).filter(light=>lightRegion(light)===region.uuid),data=removed?null:spellZoneFireLightData(region);
  if(!data){for(const light of lights)await deleteLightOnce(light);return null;}
  let light=lights[0];for(const duplicate of lights.slice(1))await deleteLightOnce(duplicate);
  if(!light){[light]=await scene.createEmbeddedDocuments('AmbientLight',[data]);if(!light)throw Error('Fire area light creation failed');}
  else if(['x','y','elevation','hidden','walls','vision'].some(key=>light[key]!==data[key])||!includesLightValues(light.config,data.config))await light.update(data);
  return light;
 }).finally(()=>{if(lightJobs.get(region.uuid)===job)lightJobs.delete(region.uuid);});lightJobs.set(region.uuid,job);return job;
}
export async function cleanupOrphanSpellZoneLights(scene){
 const regions=new Set(collectionValues(scene.regions).map(region=>region.uuid));
 for(const light of collectionValues(scene.lights))if(lightRegion(light)&&!regions.has(lightRegion(light)))await deleteLightOnce(light);
}
