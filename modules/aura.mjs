import {TRANSFORMATION_TEMPLATES} from "./transformation-data.mjs";
import {effectSource} from "./rules/effect-source.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {magicDamageProfile} from './magic-damage.mjs';
import {itemEffectRemainingSeconds,normalizeEffectDuration} from './rules/effect-duration.mjs';
import {weatherWard} from './rules/weather-wards.mjs';
import {syncSpellZoneFireLight} from "./fire-zones.mjs";
import {fixedLightProfile} from "./rules/spell-zones.mjs";

const S="trudvang-chronicles", TYPE="trudvangAura";
const jobs=new Map();
const burningLightStatus="trudvangBurning";
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

export function auraSite(token) {
 if(!token?.parent)return null;
 const size=Number(token.parent.grid?.size||1);
 const center=token.object?.center??{x:Number(token.x||0)+Number(token.width||1)*size/2,y:Number(token.y||0)+Number(token.height||1)*size/2};
 return {sceneId:token.parent.id,level:token.level??null,x:center.x,y:center.y};
}
export function auraRadius(effect){
 const aura=getAura(effect),context=sourceMeta(effect)?.ruleTestContext;
 if(!aura)return 0;
 return Math.max(0,Number(aura.radius)||0)+Math.max(0,Number(context?.countsById?.[aura.radiusOptionId])||0)*Number(aura.radiusStep??1);
}
function auraForRegion(region){return region?.flags?.[S]?.aura;}
function childFlags(effect){return effect?.flags?.[S]?.auraRecipient;}
function actorEffects(actor){return Array.from(actor?.effects??[]);}
function sameActor(a,b){return Boolean(a?.actor?.uuid&&a.actor.uuid===b?.actor?.uuid);}
const friendly=token=>Number(token.disposition)===Number(globalThis.CONST?.TOKEN_DISPOSITIONS?.FRIENDLY??1);
async function removeAuraRecipients(actor,children){
 // Settle earned full minutes before removing their clock. The global clock
 // queue also prevents a world-time update from replaying the same tick.
 if(children.some(child=>child.flags?.[S]?.consequenceClock))await (await import('./consequences.mjs')).processConsequenceEffects(children,Number(game.time?.worldTime??0));
 const ids=children.filter(child=>actorEffects(actor).some(row=>row.id===child.id)).map(child=>child.id);
 if(ids.length)await actor.deleteEmbeddedDocuments('ActiveEffect',ids);
}
function healingClock(source,name,periodic){
 const now=Number(game.time?.worldTime??0),seconds=itemEffectRemainingSeconds(source,{time:now,combat:game.combat});
 if(!(seconds>0))return null;
 return {name,stage:0,stageStartedAt:now,ticks:[],stages:[{seconds,periodic:[{interval:periodic.interval,operations:[{
  operation:periodic.operation,formula:String(periodic.amount),...(periodic.dailyLimit?{dailyLimit:{key:sourceMeta(source).sourceId,maximum:periodic.dailyLimit}}:{})
 }]}]}]};
}
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
 const allies=self||(!leaving&&friendly(token))||others.some(friendly);
 const eligible=inside&&active(source)&&!(self&&getAura(source)?.excludeSource)
  &&(getAura(source)?.recipients!=='allies'||allies)&&(!getAura(source)?.requiresHearing||(!actor.statuses?.has('deaf')&&!actor.statuses?.has('deafened')&&!source.parent?.statuses?.has('silenced')));
 if(!eligible){if(children.length)await removeAuraRecipients(actor,children);return;}
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
  const periodic=TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.periodic;
  description=game.i18n.format(aura.recipientDescriptionKey,{damage,winter:Math.ceil(damage/2),sv,penalty:spec?.penalty,amount:periodic?.amount,limit:periodic?.dailyLimit});
 }
 if(fearLight&&allies){const bonus=auraBonusDescription(changes);if(bonus)description+=`<p>${bonus}</p>`;}
 const weather=aura.weather?weatherWard(aura.weather,sourceMeta(source)?.ruleTestContext):null;
 if(weather)description=game.i18n.localize(`TRUDVANG.Aura.WeatherRecipient.${weather.kind}`);
 if(weather?.temperature)description+=`<p>${game.i18n.format("TRUDVANG.Aura.WeatherTemperature",{value:weather.temperature})}</p>`;
 const name=game.i18n.format(fearLight&&allies?"TRUDVANG.Aura.AllyName":"TRUDVANG.Aura.RecipientName",{name:source.name});
 const disease=TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.disease;
 if(disease){
  const {beginDiseaseIncubation}=await import("./disease-resistance.mjs");
  await beginDiseaseIncubation(source,actor);
  if(!changes.length){if(children.length)await actor.deleteEmbeddedDocuments("ActiveEffect",children.map(effect=>effect.id));return;}
 }
 const data={name,img:source.img,type:"effect",origin:region.uuid,transfer:false,start:source.toObject().start,description,statuses:sourceMeta(source)?.auraStatuses??[],
  system:{stackId:`aura:${region.uuid}`,stacking:"replace",changes:effectSource({system:{changes}}).system.changes},
  flags:{[S]:{auraRecipient:{regionUuid:region.uuid,sourceEffectUuid:source.uuid,...(weather?{weather}:{})},...(TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.persistentDamage?{transformation:{...structuredClone(sourceMeta(source)),auraSource:false,...(TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.disease?{summary:description,summaryResolved:true}:{})}}:{})}}};
 const existing=children[0];
 const periodic=TRANSFORMATION_TEMPLATES[sourceMeta(source)?.key]?.periodic;
 if(periodic){
  const clock=existing?.flags?.[S]?.consequenceClock??healingClock(source,name,periodic);
  if(!clock)return;
  if(!existing?.flags?.[S]?.consequenceClock)data.flags[S].consequenceClock=clock;
  data.duration=normalizeEffectDuration({value:clock.stages[0].seconds,units:'seconds'});
  data.start={...source.toObject().start,time:clock.stageStartedAt};
  // This recipient may have joined after the source's combat start. Its own
  // elapsed world-time clock is authoritative, with no inherited old round.
  delete data.start.combat;delete data.start.round;delete data.start.turn;
 }
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
export function equippedLightRadii(actor, scene) {
 const equipped = Array.from(actor?.items ?? []).filter(item =>
  item.type === "gear" && item.system?.equipped && Number(item.system.quantity ?? 1) > 0);
 return {
  bright: metresToSceneUnits(scene, Math.max(0,...equipped.map(item => Number(item.system.lightBright) || 0))),
  dim: metresToSceneUnits(scene, Math.max(0,...equipped.map(item => Number(item.system.lightDim) || 0)))
 };
}

const knightLights = new Set([
 "blessed-armor:0", "blessed-spear:1", "rowthguard-cuirass:3",
 "rowthguard-s-battle-scourge:5", "belo-seoth-s-white-armor:6", "belo-seoth-s-axe:7"
].map(id => "holy-tenetnid-tablet-of-the-knight:" + id));
const sparkId = "vitner-flame-craft:spark:1";
const personalGlow = "vitner-flame-craft:burning-hand:2";
const demonicImpotence = "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5";
const healingRune = "holy-thuuldom-healing-rune:healing-rune:0";
const fireBodies = new Set(["9MMfvcE9EaGbHcId", "n85BQGaGbHcIdJeK"]);
const nocturnalGlow = new Set(["yhighfHcIdJeKfLg", "SCJYHSnToUpVqWrX"]);
const lightEffect = effect => {
 const id = sourceMeta(effect)?.sourceId;
 return knightLights.has(id) || id === sparkId || id === personalGlow || id === demonicImpotence || id === healingRune;
};

/** Radii from active magic and visible creature abilities, in scene units. */
export function carriedMagicLightRadii(token, {time, combat} = {}) {
 const {actor, parent: scene} = token;
 let bright = 0, dim = 0;
 if(actor?.statuses?.has(burningLightStatus)){bright=3;dim=6;}
 const night = Number(scene?.environment?.darknessLevel) >= 0.5;
 if(night && nocturnalGlow.has(actor?.flags?.[S]?.bestiaryId)) dim = 1;
 const emitting = effect => active(effect) && itemEffectRemainingSeconds(effect, {time, combat}) !== 0;
 for(const effect of actorEffects(actor)) {
  if(!lightEffect(effect) || !emitting(effect)) continue;
  const meta = sourceMeta(effect);
  if(meta.sourceId === personalGlow) dim = Math.max(dim, 1);
  if(meta.sourceId === demonicImpotence) {
   // The luminous touch is available for ten rounds. The stolen ability stays suppressed longer.
   const touch = {duration: {value: 10, units: "rounds"}, start: effect.start, flags: effect.flags};
   if(itemEffectRemainingSeconds(touch, {time, combat}) > 0) dim = Math.max(dim, 1);
  }
  if(meta.sourceId !== sparkId) continue;
  const context = meta.ruleTestContext;
  const count = index => Number(context?.counts?.[index] ?? context?.countsById?.[sparkId + ":" + index]) || 0;
  // A detached flame needs its own scene source; it cannot remain on the caster.
  if(count(4) > 0) continue;
  const torch = count(3) > 0;
  bright = Math.max(bright, torch ? 3 : 1);
  dim = Math.max(dim, torch ? 6 : 3);
 }
 for(const item of actor?.items ?? []) {
  if(item.type === "creatureAbility" && fireBodies.has(item.system?.catalogId)) {
   bright = Math.max(bright, 3);
   dim = Math.max(dim, 6);
  }
  if(night && item.type === "creatureAbility" && item.system?.catalogId === "LTLHNqSnToUpVqWr") dim = Math.max(dim, 3);
  const effects = Array.from(item.effects ?? []);
  if(effects.some(effect => sourceMeta(effect)?.sourceId === healingRune && emitting(effect))) dim = Math.max(dim, 1);
  if(!item.flags?.[S]?.inventoryTransfer&&Number(item.system?.quantity??1)>0){
   for(const effect of effects){
    if(!effect.flags?.[S]?.sparkInventoryLight||!emitting(effect))continue;
    const profile=fixedLightProfile(sourceMeta(effect)?.ruleTestContext);
    if(!profile?.attachable)continue;
    bright=Math.max(bright,profile.illumination.bright);
    dim=Math.max(dim,profile.illumination.dim);
   }
  }
  if(!item.system?.equipped || Number(item.system.quantity ?? 1) <= 0) continue;
  if(effects.some(effect => knightLights.has(sourceMeta(effect)?.sourceId) && emitting(effect))) {
   dim = Math.max(dim, 1);
  }
 }
 return {bright: metresToSceneUnits(scene, bright), dim: metresToSceneUnits(scene, dim)};
}
export function auraLightUpdate(token, radii, gear = {}){
 const key=`flags.${S}.auraLight`,saved=token.flags?.[S]?.auraLight,current={bright:Number(token.light?.bright)||0,dim:Number(token.light?.dim)||0};
 const radius=Math.max(0,...radii.map(Number).filter(Number.isFinite));
 if(radius>0 || gear.bright>0 || gear.dim>0){
  const before=saved?.before??current;
  // Preserve deliberate edits made while an effect is active.
  const bright=Math.max(Number(before.bright)||0,radius,gear.bright??0);
  const desired={bright,dim:Math.max(Number(before.dim)||0,bright,gear.dim??0)};
  const changes={};for(const prop of ["bright","dim"])if(!saved||current[prop]===saved.applied[prop])if(current[prop]!==desired[prop])changes[`light.${prop}`]=desired[prop];
  const applied={...desired};for(const prop of ["bright","dim"])if(saved&&current[prop]!==saved.applied[prop])applied[prop]=saved.applied[prop];
  const state={before,applied};if(JSON.stringify(saved)!==JSON.stringify(state))changes[key]=state;return changes;
 }
 if(!saved)return {};
 const changes={};for(const prop of ["bright","dim"])if(current[prop]===saved.applied[prop])changes[`light.${prop}`]=saved.before[prop];
 changes[key]=foundry.data.operators.ForcedDeletion.create();return changes;
}
function refreshLight(token){
 if(!isWriter())return Promise.resolve();
 const previous=lightJobs.get(token.uuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const radii=actorEffects(token.actor).filter(effect=>active(effect)&&getAura(effect)?.light&&sourceTokenUuid(effect)===token.uuid).map(effect=>metresToSceneUnits(token.parent,auraRadius(effect)));
  const gear = equippedLightRadii(token.actor, token.parent);
  const magic = carriedMagicLightRadii(token, {time:game.time?.worldTime, combat:game.combat});
  const updates = auraLightUpdate(token, radii, {
   bright: Math.max(gear.bright, magic.bright),
   dim: Math.max(gear.dim, magic.dim)
  });
  if(Object.keys(updates).length) await token.update(updates);
 }).finally(()=>{if(lightJobs.get(token.uuid)===job)lightJobs.delete(token.uuid);});
 lightJobs.set(token.uuid,job);return job;
}
function sourceTokenUuid(effect){
 const context=sourceMeta(effect)?.ruleTestContext??{};
 if(childFlags(effect)||sourceMeta(effect)?.auraSource===false||(context.casterUuid&&context.casterUuid!==effect.parent?.uuid))return null;
 return context.casterTokenUuid??auraCasterToken(effect.parent,[],globalThis.canvas?.tokens?.placeables??effect.parent?.getActiveTokens?.(true,true))?.uuid??auraCasterToken(effect.parent,[],Array.from(game.scenes??[]).flatMap(scene=>Array.from(scene.tokens??[])))?.uuid;
}
function activeSource(effect){return active(effect)&&getAura(effect)&&(getAura(effect).fixed?sourceMeta(effect)?.ruleTestContext?.auraSite:sourceTokenUuid(effect));}
export async function synchronizeAuraSource(effect,{removed=false}={}){
 if(!isWriter())return;
 const context=sourceMeta(effect)?.ruleTestContext,fixed=getAura(effect)?.fixed,site=fixed?context?.auraSite:null;
 const tokenUuid=sourceTokenUuid(effect),token=tokenUuid?await foundry.utils.fromUuid(tokenUuid):null;
 const scene=fixed?game.scenes?.get(site?.sceneId):token?.parent;
 if(!scene)return;
 const regions=Array.from(scene.regions??[]).filter(region=>auraForRegion(region)?.sourceEffectUuid===effect.uuid);
 if(removed||!activeSource(effect)){
  for(const region of regions){
   if(sourceMeta(effect)?.sourceId==="holy-ealdtradition-magh-s-gift:elf-summer:3")
    await syncSpellZoneFireLight(region,{removed:true});
   // Clean by provenance even when the scene is not currently viewed.
   const actors=new Map(Array.from(scene.tokens??[]).filter(row=>row.actor?.uuid).map(row=>[row.actor.uuid,row.actor]));
   for(const actor of actors.values()){
    await removeAuraRecipients(actor,actorEffects(actor).filter(child=>childFlags(child)?.regionUuid===region.uuid));
   }
   await region.delete();
  }
  if(token)await refreshLight(token);return;
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
 const location=site??auraSite(token);
 const shapes=[{type:"circle",x:location.x,y:location.y,radius:radius*scale}];
 const summerLight=async region=>{
  const context=sourceMeta(effect)?.ruleTestContext;
  if(sourceMeta(effect)?.sourceId!=="holy-ealdtradition-magh-s-gift:elf-summer:3")return;
  try{
   await syncSpellZoneFireLight(region,{illuminationSource:{context:{...context,sourceId:sourceMeta(effect).sourceId},
    elevation:location.elevation,profile:{kind:"fixedLight",radius,illumination:{bright:radius,dim:radius}}}});
  }catch(error){console.error("Trudvang | Summer light synchronization failed",error);}
 };
 const syncMembers=async region=>{
  const members=fixed?Array.from(scene.tokens??[]).filter(target=>target.testInsideRegion?.(region)??region.tokens?.has(target)):region.tokens??[];
  for(const target of members)await reconcileAuraToken(region,target);
  if(!fixed&&!Array.from(region.tokens??[]).some(target=>target.id===token.id))await reconcileAuraToken(region,token);
 };
 if(!regions.length){
  const [region]=await scene.createEmbeddedDocuments("Region",[{name:effect.name,color:auraColor(),highlightMode:"coverage",visibility:CONST.REGION_VISIBILITY.ALWAYS,...(!fixed?{attachment:{token:token.id}}:{}),levels:location.level?[location.level]:[],restriction:{enabled:true,type:"light"},shapes,flags:{[S]:{aura:{sourceEffectUuid:effect.uuid,casterUuid:effect.parent.uuid}}},behaviors:[{type:TYPE,name:effect.name,system:{}}]}]);
  if(region){await summerLight(region);await syncMembers(region);}
 }else {
  const update={};
  if(Number(regions[0].shapes?.[0]?.radius)!==radius*scale)update.shapes=shapes;
  if(regions[0].highlightMode!=="coverage")update.highlightMode="coverage";
  if(regions[0].visibility!==CONST.REGION_VISIBILITY.ALWAYS)update.visibility=CONST.REGION_VISIBILITY.ALWAYS;
  if(String(regions[0].color??"").toLowerCase()!==auraColor())update.color=auraColor();
  if(Object.keys(update).length)await regions[0].update(update);
  for(const region of regions.slice(1))await region.delete();
  await syncMembers(regions[0]);
  await summerLight(regions[0]);
 }
 if(token)await refreshLight(token);
}

/** V14 Region behavior: Foundry determines entry/exit; only the elected GM writes. */
export function registerAuraSupport(){
 const Base=foundry.data?.regionBehaviors?.RegionBehaviorType;if(!Base)return;
 if(CONFIG.statusEffects)CONFIG.statusEffects[burningLightStatus]={
  id:burningLightStatus,name:"TRUDVANG.SpellZone.BurningStatus",img:"icons/svg/fire.svg"
 };
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
 const hearingStatus=effect=>Array.from(effect.statuses??[]).some(id=>['deaf','deafened','silenced'].includes(id));
 const refreshHearing=actor=>{
  if(!isWriter()||actor?.documentName!=='Actor')return;
  const key='hearing:'+actor.uuid,previous=jobs.get(key)??Promise.resolve();
  const job=previous.catch(()=>{}).then(async()=>{
   for(const scene of game.scenes??[])for(const region of scene.regions??[]){
    const info=auraForRegion(region),source=info?await foundry.utils.fromUuid(info.sourceEffectUuid):null;
    if(!getAura(source)?.requiresHearing)continue;
    for(const token of region.tokens??[])if(actor.uuid===info.casterUuid||token.actor?.uuid===actor.uuid)await reconcileAuraToken(region,token);
   }
  }).catch(error=>console.error('Trudvang | Hearing aura synchronization failed',error)).finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});jobs.set(key,job);
 };
 Hooks.on("createActiveEffect",effect=>{if(activeSource(effect))schedule(effect);if(hearingStatus(effect))refreshHearing(effect.parent);return refreshEffectLight(effect);});
 Hooks.on("updateActiveEffect",(effect,changes)=>{if(getAura(effect)&&!childFlags(effect))schedule(effect);if(!childFlags(effect)&&(hearingStatus(effect)||changes?.statuses!==undefined))refreshHearing(effect.parent);return refreshEffectLight(effect,changes);});
 Hooks.on("deleteActiveEffect",effect=>{if(getAura(effect)&&!childFlags(effect))schedule(effect,true);if(hearingStatus(effect))refreshHearing(effect.parent);return refreshEffectLight(effect);});
 Hooks.on("updateToken",(token,changes)=>{if(!isWriter()||changes.disposition===undefined)return;for(const region of token.parent?.regions??[])if(auraForRegion(region)&&region.tokens?.has(token))void reconcileAuraToken(region,token);});
 const scheduleLight=token=>refreshLight(token).catch(error=>console.error("Trudvang | Token light synchronization failed",error));
 const refreshActorLight=actor=>{
  if(!isWriter()||actor?.documentName!=="Actor")return;
  const tokens=Array.from(game.scenes??[]).flatMap(scene=>Array.from(scene.tokens??[]));
  return Promise.all(tokens.filter(token=>token.actor?.uuid===actor.uuid).map(scheduleLight));
 };
 const refreshItemLight=item=>{
  if(["gear","armor","weapon","shield","creatureAbility"].includes(item.type)) return refreshActorLight(item.parent);
 };
 const refreshEffectLight=(effect,changes)=>{
  if(!lightEffect(effect)&&!Array.from(effect.statuses??[]).includes(burningLightStatus)&&changes?.statuses===undefined)return;
  const owner=effect.parent;
  return refreshActorLight(owner?.documentName==="Item"?owner.parent:owner);
 };
 for(const hook of ["createItem","updateItem","deleteItem"])Hooks.on(hook,refreshItemLight);
 const refreshTimedLights=()=>{
  if(!isWriter())return;
  for(const scene of game.scenes??[])for(const token of scene.tokens??[]){
   const actor=token.actor;
   if(actorEffects(actor).some(lightEffect)||Array.from(actor?.items??[]).some(item=>Array.from(item.effects??[]).some(lightEffect)))scheduleLight(token);
  }
 };
 Hooks.on("updateWorldTime",refreshTimedLights);
 Hooks.on("updateCombat",refreshTimedLights);
 Hooks.on("deleteCombat",refreshTimedLights);
 Hooks.on("updateScene",(scene,changes)=>{
  if(changes.environment?.darknessLevel!==undefined || changes["environment.darknessLevel"]!==undefined)
   for(const token of scene.tokens??[]) scheduleLight(token);
 });
 Hooks.on("updateToken",(token,change)=>{
  if(change.actorId!==undefined||change.actorLink!==undefined||change.delta!==undefined)scheduleLight(token);
 });
 Hooks.on("createToken",token=>{
  if(!isWriter())return;
  scheduleLight(token);
  for(const effect of actorEffects(token.actor))if(activeSource(effect))schedule(effect);
 });
 Hooks.once("ready",()=>{
  if(!isWriter())return;
  for(const scene of game.scenes??[]) for(const token of scene.tokens??[]) scheduleLight(token);
  const actors=new Set([...(game.actors??[]),...Array.from(game.scenes??[]).flatMap(scene=>Array.from(scene.tokens??[],token=>token.actor))]);
  for(const actor of actors)for(const effect of actorEffects(actor))if(getAura(effect)?.fixed&&activeSource(effect))schedule(effect);
 });
 Hooks.on("canvasReady",()=>{
  if(!isWriter())return;
  for(const token of canvas.scene?.tokens??[]){
   scheduleLight(token);
   for(const effect of actorEffects(token.actor))if(activeSource(effect))schedule(effect);
  }
 });
}
