import {TRANSFORMATION_TEMPLATES} from "./transformation-data.mjs";
import {effectSource} from "./rules/effect-source.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {magicDamageProfile} from './magic-damage.mjs';

const S="trudvang-chronicles", TYPE="trudvangAura";
const jobs=new Map();
const recipientJobs=new Map();
const lightJobs=new Map();
const sourceMeta=effect=>effect?.flags?.[S]?.transformation;
const isWriter=()=>Boolean(game.users?.activeGM?.isSelf);
const getAura=effect=>TRANSFORMATION_TEMPLATES[sourceMeta(effect)?.key]?.aura;
const active=effect=>effect && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired;
const tokenDocument=token=>token?.document??token;

/** Select an unambiguous source; a token selected for a different actor is never used. */
export function auraCasterToken(actor, controlled=[], activeTokens=[]) {
 const matching=rows=>Array.from(rows??[],tokenDocument).filter(token=>token?.actor?.uuid===actor?.uuid);
 const selected=matching(controlled);if(selected.length===1)return selected[0];
 if(selected.length>1)return null;
 if(actor?.isToken&&actor.token)return actor.token;
 const available=matching(activeTokens);return available.length===1?available[0]:null;
}
export function auraRadius(effect){
 const aura=getAura(effect),context=sourceMeta(effect)?.ruleTestContext;
 if(!aura)return 0;
 return Math.max(0,Number(aura.radius)||0)+Math.max(0,Number(context?.countsById?.[aura.radiusOptionId])||0);
}
function auraForRegion(region){return region?.flags?.[S]?.aura;}
function childFlags(effect){return effect?.flags?.[S]?.auraRecipient;}
function actorEffects(actor){return Array.from(actor?.effects??[]);}
function sameActor(a,b){return Boolean(a?.actor?.uuid&&a.actor.uuid===b?.actor?.uuid);}
const friendly=token=>Number(token.disposition)===Number(globalThis.CONST?.TOKEN_DISPOSITIONS?.FRIENDLY??1);
export function auraBonusDescription(changes){
 const value=Number(Array.from(changes??[]).find(row=>row.key==="system.modifiers.rolls.allActions")?.value);
 if(!Number.isFinite(value))return "";
 return game.i18n.format("TRUDVANG.Aura.EffectiveBonus",{value:value>=0?`+${value}`:String(value)});
}
export function auraColor(){
 const style=globalThis.getComputedStyle?.(globalThis.document?.documentElement);
 const grayscale=(property,fallback)=>{
  const hex=style?.getPropertyValue(property)?.trim();
  if(!/^#[\da-f]{6}$/i.test(hex??""))return fallback;
  const rgb=[1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16));
  return Math.round(rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722);
 };
 const value=Math.round((grayscale("--trudvang-muted",100)+grayscale("--trudvang-paper-light",235))/2);
 const channel=value.toString(16).padStart(2,"0");return `#${channel}${channel}${channel}`;
}
function metresToSceneUnits(scene,value){const units=String(scene?.grid?.units??"m").toLowerCase();return value*(/^(ft|feet|foot|pi|pieds?)$/.test(units)?1/0.3048:/^(km|kilom)/.test(units)?0.001:1);}

/** Reconcile a single actor with the current region membership. */
async function reconcileAuraTokenNow(region, token, {leaving=false,force=false}={}){
 if(!isWriter()||!token?.actor)return;
 const info=auraForRegion(region);if(!info)return;
 const actor=token.actor,source=await foundry.utils.fromUuid(info.sourceEffectUuid);
 const children=actorEffects(actor).filter(effect=>childFlags(effect)?.regionUuid===region.uuid);
 if(getAura(source)?.recipientMode==="none"){
  if(children.length)await actor.deleteEmbeddedDocuments("ActiveEffect",children.map(effect=>effect.id));
  return;
 }
 const others=Array.from(region.tokens??[]).filter(candidate=>candidate.id!==token.id&&sameActor(candidate,token));
 const inside=!force&&(!leaving||others.length>0);
 const self=actor.uuid===info.casterUuid;
 const eligible=inside&&active(source)&&!(self&&getAura(source)?.excludeSource);
 if(!eligible){if(children.length)await actor.deleteEmbeddedDocuments("ActiveEffect",children.map(effect=>effect.id));return;}
 const allies=self||(!leaving&&friendly(token))||others.some(friendly);
 const aura=getAura(source),fearLight=aura?.light===true;
 const changes=Array.from(sourceMeta(source)?.auraChanges??source.system?.changes??[]).filter(row=>!fearLight||row.key==="system.transformation.ignoreFearPenalty"||(allies&&row.key==="system.modifiers.rolls.allActions"));
 const descriptionKey=!fearLight||allies?sourceMeta(source)?.key:`${sourceMeta(source)?.sourceId}#fear-only`;
 let description=game.i18n.localize(`TRUDVANG.Content.Transformation.${descriptionKey}.Description`);
 if(aura.recipientDescriptionKey){
  const profile=magicDamageProfile(source);
  const damage=Number(profile?.formula?.match(/^0d\d+\s*\+\s*(\d+)$/)?.[1]??0);
  const spec=TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.disease;
  const test=spec?RULE_TESTS_BY_CATALOG_ID[sourceMeta(source)?.sourceId]?.[spec.testIndex]:null;
  const context=sourceMeta(source)?.ruleTestContext??{};
  const sv=Number(test?.sv??0)+(test?.powerLevelModifiers??[]).reduce((sum,p)=>sum+Number(p.value)*Number(context.countsById?.[p.optionId]??context.counts?.[p.index]??0),0);
  description=game.i18n.format(aura.recipientDescriptionKey,{damage,winter:Math.ceil(damage/2),sv,penalty:spec?.penalty});
 }
 if(fearLight&&allies){const bonus=auraBonusDescription(changes);if(bonus)description+=`<p>${bonus}</p>`;}
 const name=game.i18n.format(fearLight&&allies?"TRUDVANG.Aura.AllyName":"TRUDVANG.Aura.RecipientName",{name:source.name});
 const data={name,img:source.img,type:"effect",origin:region.uuid,transfer:false,start:source.toObject().start,description,statuses:sourceMeta(source)?.auraStatuses??[],
  system:{stackId:`aura:${region.uuid}`,stacking:"replace",changes:effectSource({system:{changes}}).system.changes},
  flags:{[S]:{auraRecipient:{regionUuid:region.uuid,sourceEffectUuid:source.uuid},...(TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.persistentDamage||TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.disease?{transformation:{...structuredClone(sourceMeta(source)),auraSource:false,...(TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.disease?{summary:description,summaryResolved:true}:{})}}:{})}}};
 const existing=children[0];
 if(existing){await existing.update(data);if(children.length>1)await actor.deleteEmbeddedDocuments("ActiveEffect",children.slice(1).map(effect=>effect.id));}
 else await actor.createEmbeddedDocuments("ActiveEffect",[data]);
}
export function reconcileAuraToken(region,token,options={}){
 const key=`${region?.uuid}:${token?.actor?.uuid}`;
 const previous=recipientJobs.get(key)??Promise.resolve();
 const job=previous.catch(()=>{}).then(()=>reconcileAuraTokenNow(region,token,options)).finally(()=>{if(recipientJobs.get(key)===job)recipientJobs.delete(key);});
 recipientJobs.set(key,job);return job;
}
export async function settleAuraJobs(){
 while(jobs.size||recipientJobs.size)await Promise.all([...jobs.values(),...recipientJobs.values()]);
}

/** Light state is restored only where it still equals the value we set. */
export function auraLightUpdate(token, radii){
 const key=`flags.${S}.auraLight`,saved=token.flags?.[S]?.auraLight,current={bright:Number(token.light?.bright)||0,dim:Number(token.light?.dim)||0};
 const radius=Math.max(0,...radii.map(Number).filter(Number.isFinite));
 if(radius>0){
  const before=saved?.before??current;
  // Preserve deliberate edits made while an effect is active.
  const bright=Math.max(Number(before.bright)||0,radius);
  const desired={bright,dim:Math.max(Number(before.dim)||0,bright,radius)};
  const changes={};for(const prop of ["bright","dim"])if(!saved||current[prop]===saved.applied[prop])if(current[prop]!==desired[prop])changes[`light.${prop}`]=desired[prop];
  const applied={...desired};for(const prop of ["bright","dim"])if(saved&&current[prop]!==saved.applied[prop])applied[prop]=saved.applied[prop];
  const state={before,applied};if(JSON.stringify(saved)!==JSON.stringify(state))changes[key]=state;return changes;
 }
 if(!saved)return {};
 const changes={};for(const prop of ["bright","dim"])if(current[prop]===saved.applied[prop])changes[`light.${prop}`]=saved.before[prop];
 changes[key]=foundry.data.operators.ForcedDeletion.create();return changes;
}
function refreshLight(token){
 const previous=lightJobs.get(token.uuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const radii=actorEffects(token.actor).filter(effect=>active(effect)&&getAura(effect)?.light&&sourceMeta(effect)?.ruleTestContext?.casterTokenUuid===token.uuid).map(effect=>metresToSceneUnits(token.parent,auraRadius(effect)));
  const updates=auraLightUpdate(token,radii);if(Object.keys(updates).length)await token.update(updates);
 }).finally(()=>{if(lightJobs.get(token.uuid)===job)lightJobs.delete(token.uuid);});
 lightJobs.set(token.uuid,job);return job;
}
function activeSource(effect){const context=sourceMeta(effect)?.ruleTestContext;return active(effect)&&getAura(effect)&&context?.auraSource===true&&context.casterUuid===effect.parent?.uuid&&context.casterTokenUuid;}
export async function synchronizeAuraSource(effect,{removed=false}={}){
 if(!isWriter())return;
 const context=sourceMeta(effect)?.ruleTestContext,tokenUuid=context?.casterTokenUuid;if(!tokenUuid)return;
 const token=await foundry.utils.fromUuid(tokenUuid),scene=token?.parent;if(!token||!scene)return;
 const regions=Array.from(scene.regions??[]).filter(region=>auraForRegion(region)?.sourceEffectUuid===effect.uuid);
 if(removed||!activeSource(effect)){
  for(const region of regions){
   // Clean by provenance even when the scene is not currently viewed.
   const actors=new Map(Array.from(scene.tokens??[]).filter(row=>row.actor?.uuid).map(row=>[row.actor.uuid,row.actor]));
   for(const actor of actors.values()){
    const ids=actorEffects(actor).filter(child=>childFlags(child)?.regionUuid===region.uuid).map(child=>child.id);
    if(ids.length)await actor.deleteEmbeddedDocuments("ActiveEffect",ids);
   }
   await region.delete();
  }
  await refreshLight(token);return;
 }
 // TEMPORARY WORLD MIGRATION: move pre-0.170 aura changes off the source so
 // the caster receives the same separate recipient effect as everyone else.
 if(!Array.isArray(sourceMeta(effect)?.auraChanges)){
  const auraChanges=Array.from(effect.system?.changes??[],change=>({...change}));
  const auraStatuses=Array.from(effect.statuses??[]);
  const details=[game.i18n.format("TRUDVANG.Aura.Radius",{value:auraRadius(effect)}),...(getAura(effect)?.light&&getAura(effect)?.recipientMode!=="none"?[game.i18n.localize("TRUDVANG.Aura.LightRecipients")]:[])];
  const description=String(effect.description??"")+details.map(detail=>`<p>${String(detail).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char])}</p>`).join("");
  await effect.update({[`flags.${S}.transformation.auraChanges`]:auraChanges,[`flags.${S}.transformation.auraStatuses`]:auraStatuses,"system.changes":[],statuses:[],description});
 }
 const radius=auraRadius(effect),scale=Number(scene.grid?.size||1)/Number(scene.grid?.distance||1)*metresToSceneUnits(scene,1);
 const center=token.object?.center??{x:Number(token.x||0)+Number(token.width||1)*Number(scene.grid?.size||1)/2,y:Number(token.y||0)+Number(token.height||1)*Number(scene.grid?.size||1)/2};
 const shapes=[{type:"circle",x:center.x,y:center.y,radius:radius*scale}];
 if(!regions.length){
  const [region]=await scene.createEmbeddedDocuments("Region",[{name:effect.name,color:auraColor(),highlightMode:"coverage",visibility:CONST.REGION_VISIBILITY.ALWAYS,attachment:{token:token.id},levels:token.level?[token.level]:[],restriction:{enabled:true,type:"light"},shapes,flags:{[S]:{aura:{sourceEffectUuid:effect.uuid,casterUuid:effect.parent.uuid}}},behaviors:[{type:TYPE,name:effect.name,system:{}}]}]);
  if(region)await reconcileAuraToken(region,token);
 }else {
  const update={};
  if(Number(regions[0].shapes?.[0]?.radius)!==radius*scale)update.shapes=shapes;
  if(regions[0].highlightMode!=="coverage")update.highlightMode="coverage";
  if(regions[0].visibility!==CONST.REGION_VISIBILITY.ALWAYS)update.visibility=CONST.REGION_VISIBILITY.ALWAYS;
  if(String(regions[0].color??"").toLowerCase()!==auraColor())update.color=auraColor();
  if(Object.keys(update).length)await regions[0].update(update);
  for(const region of regions.slice(1))await region.delete();
  for(const target of regions[0].tokens??[])await reconcileAuraToken(regions[0],target);
  if(!Array.from(regions[0].tokens??[]).some(target=>target.id===token.id))await reconcileAuraToken(regions[0],token);
 }
 await refreshLight(token);
}

/** V14 Region behavior: Foundry determines entry/exit; only the elected GM writes. */
export function registerAuraSupport(){
 const Base=foundry.data?.regionBehaviors?.RegionBehaviorType;if(!Base)return;
 class TrudvangAuraBehavior extends Base {
  static defineSchema(){return {};}
  static events={
   tokenEnter:async function(event){await reconcileAuraToken(event.region,event.data.token);},
   tokenExit:async function(event){await reconcileAuraToken(event.region,event.data.token,{leaving:true});},
   behaviorActivated:async function(event){for(const token of event.region.tokens??[])await reconcileAuraToken(event.region,token);},
   behaviorDeactivated:async function(event){for(const token of event.region.parent?.tokens??[])await reconcileAuraToken(event.region,token,{leaving:true,force:true});}
  };
 }
 CONFIG.RegionBehavior.dataModels[TYPE]=TrudvangAuraBehavior;
 CONFIG.RegionBehavior.typeLabels[TYPE]="TRUDVANG.Aura.Behavior";
 CONFIG.RegionBehavior.typeIcons[TYPE]="fa-solid fa-sun";
 const schedule=(effect,removed=false)=>{
  const key=effect.uuid,previous=jobs.get(key)??Promise.resolve();
  const job=previous.catch(()=>{}).then(()=>synchronizeAuraSource(effect,{removed})).catch(error=>console.error("Trudvang | Aura synchronization failed",error)).finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});jobs.set(key,job);
 };
 Hooks.on("createActiveEffect",effect=>{if(activeSource(effect))schedule(effect);});
 Hooks.on("updateActiveEffect",effect=>{if(sourceMeta(effect)?.ruleTestContext?.auraSource)schedule(effect);});
 Hooks.on("deleteActiveEffect",effect=>{if(sourceMeta(effect)?.ruleTestContext?.auraSource)schedule(effect,true);});
 Hooks.on("updateToken",(token,changes)=>{if(!isWriter()||changes.disposition===undefined)return;for(const region of token.parent?.regions??[])if(auraForRegion(region)&&region.tokens?.has(token))void reconcileAuraToken(region,token);});
 Hooks.on("canvasReady",()=>{if(!isWriter())return;for(const token of canvas.scene?.tokens??[])for(const effect of actorEffects(token.actor))if(activeSource(effect))schedule(effect);});
}
