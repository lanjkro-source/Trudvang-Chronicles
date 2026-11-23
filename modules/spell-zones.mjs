import {fireEvadeItem,canEvadeZoneFire,zoneFireInitiativePenalty,applyZoneFireDamage,syncSpellZoneFireLight,cleanupOrphanSpellZoneLights} from './fire-zones.mjs';
import {magicDamageProfile} from './magic-damage.mjs';
import {deleteEffectOnce} from './effect-deletion.mjs';
import {TABLET_BY_ID,powerItemData} from './tablet-catalog.mjs';
import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {earthquakeProfile,earthquakeTest,fixedLightProfile,fogRadius,spellZoneExpired,spellZonePhase,spellZoneRange,zonePixelScale} from './rules/spell-zones.mjs';
import {createSpellZoneRangeGuide} from './spell-zone-range-guide.mjs';
import {addSpellWallBlock,spellWallBlockPoint,spellWallColumns} from './rules/spell-walls.mjs';
import {cleanupOrphanSpellWalls,spellWallInfo,syncSpellWall} from './spell-walls.mjs';
import {impactSize} from './rules/impact.mjs';
import {resolveRollUnderOutcome} from './rules/roll-under-resolver.mjs';
import {rollOutcomeText} from './rules/roll-outcome-view.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {auraCasterToken,auraColor} from './aura.mjs';
import {darknessPlacementShape} from './rules/jorn-darkness.mjs';
import {quagmireRecipient} from './rules/quagmire.mjs';
import {trackSpellZoneRemoval,withMaintainedZoneCasting} from './maintained-spell-tracking.mjs';
const S='trudvang-chronicles',TYPE='trudvangSpellZone',channel='system.'+S,jobs=new Map(),locks=new Map(),replies=new Map();let socketReady=false;
const values=c=>Array.from(c?.values?.()??c??[]),local=(k,d)=>d?game.i18n.format('TRUDVANG.SpellZone.'+k,d):game.i18n.localize('TRUDVANG.SpellZone.'+k);
const canRead=(message,user)=>user.isGM||(!message.blind&&(!message.whisper?.length||(message.author?.id??message._source?.author)===user.id||values(message.whisper).some(u=>(typeof u==='string'?u:u.id)===user.id)));
const writer=()=>Boolean(game.users?.activeGM?.isSelf||game.users?.activeGM?.id===game.user?.id),infoOf=r=>r?.flags?.[S]?.spellZone;
const clock=info=>({time:Number(game.time?.worldTime)||0,combat:game.combats?.get?.(info.combatId)??(game.combat?.id===info.combatId?game.combat:null)});
const serial=(key,work)=>{const job=(jobs.get(key)??Promise.resolve()).catch(()=>{}).then(work);jobs.set(key,job);return job.finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});};
const responseKey=uuid=>encodeURIComponent(uuid).replaceAll('.','%2E');
const nameOf=info=>game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name');
const eligible=(actor,info)=>actor&&['character','npc'].includes(actor.type)&&(!info.profile.excludeCaster||actor.uuid!==info.context.casterUuid)&&(['fire','fog','darkness'].includes(info.profile.kind)||(!['fly','hover','flying','hovering'].some(s=>actor.statuses?.has?.(s))&&(info.profile.kind==='quagmire'||!earthquakeTest(info.profile,impactSize(actor)).immune)));
const lastsAfterCombat=profile=>['fog','darkness','quagmire','earthWall','fixedLight'].includes(profile.kind);
// Region.tokens can still be empty while native creation events are being processed.
// Query the public containment API against scene documents before freezing a burst.
const members=(region,{entering,leaving}={})=>{
 const info=infoOf(region),sceneTokens=values(region.parent?.tokens);
 if(info.profile.instant&&info.initialTokens)return new Map(info.initialTokens.map(row=>[row.actorUuid,sceneTokens.find(t=>t.uuid===row.tokenUuid)]).filter(([,t])=>t?.actor));
 const inside=sceneTokens.filter(t=>typeof t.testInsideRegion==='function'?t.testInsideRegion(region):values(region.tokens).some(r=>r.uuid===t.uuid));
 return new Map([...inside.filter(t=>t.uuid!==leaving?.uuid),...(entering?[entering]:[])].filter(t=>eligible(t.actor,info)).map(t=>[t.actor.uuid,t]));
};
const enabled=region=>!region.behaviors||values(region.behaviors).some(b=>b.type===TYPE&&!b.disabled);
const effectsFor=(actor,region)=>values(actor.effects).filter(e=>e.flags?.[S]?.spellZoneRecipient?.regionUuid===region.uuid);
function ropeRecipient(region,actor){
 const max=actor.quagmireMovement?.baseMax;
 return max>0 ? effectsFor(actor,region).find(effect=>{
  const mud=quagmireRecipient(effect);
  return mud&&!mud.rescued&&mud.depth>=max;
 }) : null;
}
function center(token,scene){return token.object?.center??{x:Number(token.x||0)+Number(token.width||1)*scene.grid.size/2,y:Number(token.y||0)+Number(token.height||1)*scene.grid.size/2};}
function placementLimit(scene,token,profile,movingFog){
 return {
  origin:movingFog ? values(movingFog.shapes)[0] : center(token,scene),
  range:movingFog ? 5 : profile.range,
  scale:zonePixelScale(scene)
 };
}
const pointInRange = (limit,point) => spellZoneRange(limit,point)?.inRange === true;
// Lighting failures must not prevent a victim's damage or Evade decision.
async function syncZoneLight(region,options){try{await syncSpellZoneFireLight(region,options);}catch(error){console.error('Trudvang | Fire area lighting failed',error);}}
const regionDeletions=new WeakMap();
function regionPresent(region){return !region.id||!region.parent?.regions?.get||region.parent.regions.get(region.id)===region;}
function deleteZoneOnce(region){
 if(regionDeletions.has(region))return regionDeletions.get(region);
 const job=Promise.resolve().then(async()=>{
  await syncZoneLight(region,{removed:true});
  await syncSpellWall(region,{removed:true});
  if(!regionPresent(region))return false;
  const result=await region.delete();
  await finishSpellWallCard(region).catch(error=>console.error('Trudvang | Wall card update failed',error));
  // The caster queue can itself be waiting on this region during manual removal.
  void trackSpellZoneRemoval(infoOf(region)?.context);
  return result;
 }).finally(()=>regionDeletions.delete(region));
 regionDeletions.set(region,job);
 return job;
}
async function finishInstantZone(region,state){
 const info=infoOf(region);
 if(!info?.profile.instant||!regionPresent(region))return;
 const resolved=state?.recipients.every(row=>state.responses[responseKey(row.actorUuid)]?.resolved);
 if(resolved||(info.initialTokens?.length===0&&!state))await deleteZoneOnce(region);
}
async function removeRecipients(region,{expired=false}={}){
 const actors=new Map([...values(game.actors),...values(region.parent?.tokens).map(t=>t.actor)].filter(Boolean).map(a=>[a.uuid,a]));
 for(const actor of actors.values())for(const effect of effectsFor(actor,region))await deleteEffectOnce(effect,expired?{trudvangExpired:true}:{});
}
async function clearSpellZoneRecipients(region,info,options){
 await removeRecipients(region,options);
 if(info.profile.kind==='quagmire')await promptMembers(region,info,new Map());
}
export function removeSpellZone(region){
 return serial(region.uuid,async()=>{
  await clearSpellZoneRecipients(region,infoOf(region));
  await deleteZoneOnce(region);
 });
}
function promptHTML(info,recipients,responses){
 const mud=info.profile.kind==='quagmire';
 return '<article class="trudvang chat-card spell-zone-card"><header><h3>'+escapeHtml(nameOf(info))+'</h3></header><p>'+escapeHtml(local(mud?'QuagmireInstruction':'Instruction'))+'</p><ul class="trait-situation-results">'+recipients.map(row=>{
  const response=responses[responseKey(row.actorUuid)],outcome=response?.outcome;
  if(info.profile.kind==='fire')return '<li class="trait-situation-result"><span>'+escapeHtml(row.name)+'</span>'+(response?.resolved?'<strong>'+escapeHtml(local(response.avoided?'FireAvoided':'FireApplied'))+'</strong>':(row.canEvade?'<button type="button" data-action="spell-zone-test" data-zone-choice="evade" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'">'+escapeHtml(local('FireEvade'))+'</button>':'')+'<button type="button" data-action="spell-zone-test" data-zone-choice="accept" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'">'+escapeHtml(local('FireAccept'))+'</button>')+'</li>';
  const result=response?.resolved?'<strong class="test-outcome '+(outcome.success?'success':'failure')+'">'+escapeHtml(rollOutcomeText(outcome,k=>game.i18n.localize(k)))+'</strong>':'';
  const showTest=mud ? row.trapped&&(!response?.resolved||!outcome.success) : !response?.resolved;
  return '<li class="trait-situation-result"><button type="button" class="trait-situation-token" data-action="locate-trait-situation-token" data-token-uuid="'+escapeAttribute(row.tokenUuid)+'" title="'+escapeAttribute(game.i18n.localize('TRUDVANG.Dialog.TraitSituationTokenHint'))+'">'+escapeHtml(row.name)+'</button>'+result+(showTest?'<button type="button" data-action="spell-zone-test" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'"><i class="fas fa-dice-d20"></i> '+escapeHtml(local(mud?'QuagmireRope':'Test'))+'</button>':'')+'</li>';
 }).join('')+'</ul></article>';
}
async function updatePrompt(message,info,state,region){
 await message.update({content:promptHTML(info,state.recipients,state.responses),['flags.'+S+'.spellZoneTest']:state});
 if(region)await finishInstantZone(region,state);
}
async function promptMembers(region,info,tokens){
 const mud=info.profile.kind==='quagmire';
 if(!tokens.size&&!mud)return;
 const phase=mud?'rope':spellZonePhase(info,clock(info));
 let message=values(game.messages).find(m=>m.flags?.[S]?.spellZoneTest?.regionUuid===region.uuid&&m.flags[S].spellZoneTest.phase===phase);
 if(!message&&!tokens.size)return;
 const state=structuredClone(message?.flags?.[S]?.spellZoneTest??{regionUuid:region.uuid,phase,recipients:[],responses:{},...(info.profile.instant?{instantInfo:structuredClone(info)}:{})});
 if(mud){
  const alreadyTrapped=state.recipients.filter(row=>row.trapped).map(row=>row.actorUuid);
  if(message&&alreadyTrapped.length===tokens.size&&alreadyTrapped.every(uuid=>tokens.has(uuid)))return message;
  for(const row of state.recipients){
   if(!row.trapped&&tokens.has(row.actorUuid))delete state.responses[responseKey(row.actorUuid)];
   row.trapped=tokens.has(row.actorUuid);
  }
 }
 for(const [uuid,token]of tokens)if(!state.recipients.some(r=>r.actorUuid===uuid))state.recipients.push({actorUuid:uuid,name:token.name??token.actor.name,tokenUuid:token.uuid,...(info.profile.kind==='fire'?{canEvade:Number(fireEvadeItem(token.actor)?.system?.level)>0&&token.actor.canPerformAction?.({movement:true,skill:true})!==false}:{})});
 if(mud)for(const row of state.recipients)row.trapped=tokens.has(row.actorUuid);
 const actors=state.recipients.map(r=>tokens.get(r.actorUuid)?.actor).filter(Boolean),whisper=values(game.users).filter(u=>u.isGM||actors.some(a=>a.testUserPermission(u,'OWNER'))).map(u=>u.id);
 if(!message){message=await ChatMessage.create({speaker:{alias:nameOf(info)},whisper,content:promptHTML(info,state.recipients,state.responses),flags:{[S]:{spellZoneTest:state}}});}
 else await message.update({whisper:[...new Set([...message.whisper??[],...whisper])],content:promptHTML(info,state.recipients,state.responses),['flags.'+S+'.spellZoneTest']:state});
 return message;
}
export function reconcileSpellZone(region,{removed=false,entering,leaving}={}){
 return serial(region.uuid,async()=>{
  if(!writer()||!infoOf(region))return;
  const info=infoOf(region);
  if(removed||!regionPresent(region)){await clearSpellZoneRecipients(region,info);await syncZoneLight(region,{removed:true});await syncSpellWall(region,{removed:true});return;}
  if(spellZoneExpired(info,clock(info))){await clearSpellZoneRecipients(region,info,{expired:true});await deleteZoneOnce(region);return;}
  if(!enabled(region)){await clearSpellZoneRecipients(region,info);await syncZoneLight(region,{removed:true});await syncSpellWall(region,{removed:true});return;}
  if(info.wall){
   if(info.wall.sections.every(section=>section.hp<=0))await deleteZoneOnce(region);
   else await syncSpellWall(region);
   return;
  }
  if(info.profile.kind==='fog'){
   const shape=values(region.shapes)[0],radius=fogRadius(info,clock(info))*zonePixelScale(region.parent);
   if(shape&&Math.abs(shape.radius-radius)>.01)await region.update({shapes:[{type:'circle',x:shape.x,y:shape.y,radius}]});
  }
  await syncZoneLight(region);
  if(info.profile.kind==='fixedLight')return;
  let tokens=members(region,{entering,leaving});
  if(info.profile.instant&&!info.initialTokens){info.initialTokens=[...tokens].map(([actorUuid,t])=>({actorUuid,tokenUuid:t.uuid}));await region.update({['flags.'+S+'.spellZone.initialTokens']:info.initialTokens});}
  const actors=new Map([...values(game.actors),...values(region.parent?.tokens).map(t=>t.actor)].filter(Boolean).map(a=>[a.uuid,a]));
  for(const actor of actors.values())if(!tokens.has(actor.uuid))for(const effect of effectsFor(actor,region))await deleteEffectOnce(effect);
  if(['earthquake','fog','darkness','quagmire'].includes(info.profile.kind)||info.profile.kind==='fire'&&info.profile.penalty&&!info.profile.instant)for(const [uuid,token]of tokens){
   if(effectsFor(token.actor,region).length)continue;
   const remaining=Math.max(.01,(info.until-(Number(game.time?.worldTime)||0))/5),combat=clock(info).combat;
   const rounds=combat?Math.max(.01,info.expiresRound-Number(combat.round)):remaining;
   const fog=info.profile.kind==='fog',fire=info.profile.kind==='fire',darkness=info.profile.kind==='darkness';
   const mud=info.profile.kind==='quagmire';
   const changes=darkness||mud?[]:fog ? [
    {key:'system.modifiers.rolls.fogCombat',type:'downgrade',value:String(info.profile.penalty),phase:'initial'},
    {key:'system.modifiers.fogRangeDivisor',type:'upgrade',value:String(info.profile.rangeDivisor),phase:'initial'}
   ] : [{key:fire?'system.modifiers.rolls.visibility':'system.modifiers.rolls.allActions',type:fire?'downgrade':'add',value:String(info.profile.penalty),phase:'initial',priority:10*Number(info.context.sourceLevel||1)}];
   await token.actor.createTrudvangEffect({name:nameOf(info),img:fire?'icons/svg/fire.svg':fog||darkness?'icons/svg/aura.svg':'systems/trudvang-chronicles/assets/icons/earthquake.svg',type:'effect',transfer:false,origin:region.uuid,
    description:local(mud?'QuagmireEffect':darkness?'DarknessVisibility':fog?'FogVisibility':fire?'FireVisibility':'PenaltyDescription',{penalty:info.profile.penalty,nightPenalty:info.profile.nightPenalty,divisor:info.profile.rangeDivisor,depth:info.profile.depth}),
    duration:lastsAfterCombat(info.profile)?{value:null,units:'seconds'}:{value:rounds,units:'rounds'},start:foundry.documents.ActiveEffect.implementation.getEffectStart(),
    system:{stackId:'spell-zone:'+region.uuid,stacking:'replace',changes},flags:{[S]:{spellZoneRecipient:{regionUuid:region.uuid,...(fire?{visibility:true}:{}),
     ...(darkness?{darkness:{penalty:info.profile.penalty,nightPenalty:info.profile.nightPenalty}}:{}),...(mud?{quagmire:{depth:info.profile.depth}}:{})}}}});
  }
  if(info.profile.kind==='quagmire'){await promptMembers(region,info,new Map([...tokens].filter(([,token])=>ropeRecipient(region,token.actor))));return;}
  if(lastsAfterCombat(info.profile))return;
  const prompt=await promptMembers(region,info,tokens);
  if(info.profile.instant){
   const saved=prompt??values(game.messages).find(m=>m.flags?.[S]?.spellZoneTest?.regionUuid===region.uuid);
   await finishInstantZone(region,saved?.flags?.[S]?.spellZoneTest);
   return;
  }
  if(info.profile.kind==='fire'){if(prompt){const state=structuredClone(prompt.flags[S].spellZoneTest);for(const [id,token]of tokens){const row=state.recipients.find(r=>r.actorUuid===id);if(!row?.canEvade&&!state.responses[responseKey(id)]?.resolved){await applyZoneFireDamage({actor:token.actor,token,info,message:prompt});state.responses[responseKey(id)]={resolved:true,avoided:false};await updatePrompt(prompt,info,state);}}}
  }
 });
}
/** A casting is single-use even after its instantaneous region has disappeared. */
async function previousPlacement(ready){
 if(!ready?.regionUuid)return null;
 const region=await foundry.utils.fromUuid(ready.regionUuid),info=infoOf(region);
 const finished=!info||!regionPresent(region)||spellZoneExpired(info,clock(info));
 const wall=info?.wall;
 const reason=finished?'CastingFinished':wall?.origin
  ? (wall.sections.length>=info.profile.volume?'WallComplete':null)
  : !info.profile.movable?'AlreadyPlaced':info.lastMovedPhase===spellZonePhase(info,clock(info))?'MoveNextRound':null;
 return {region,reason};
}
function placementFeedback(result){
 if(result.reason)ui.notifications.warn(local(result.reason));
 else if(!['placed','alreadyPlaced'].includes(result.status))ui.notifications.warn(local(result.status==='invalidArea'?'DarknessAreaInvalid':result.status==='fogMoveTooFar'?'FogMoveTooFar':result.status==='outOfRange'?'OutOfRange':'Unavailable'));
}
export async function createSpellZoneOnAuthority(payload){
 const message=game.messages.get(payload.messageId),cast=message?.flags?.[S]?.ruleTestContext,ready=message?.flags?.[S]?.spellZoneCasting,user=game.users.get(payload.userId);
 const actor=cast?.casterUuid?await foundry.utils.fromUuid(cast.casterUuid):null,definition=POWER_DETAILS_BY_ID[cast?.sourceId]?.spellZone,profile=earthquakeProfile(definition,cast)??fixedLightProfile(cast);
 const die=Number(message?.rolls?.[0]?.total);
 if(!writer()||!user?.active||!message||!canRead(message,user)||!actor?.testUserPermission(user,'OWNER')||!ready||!profile||!Number.isInteger(die)||die<1||die>19||(die!==1&&die>ready.target))return {status:'unavailable'};
 return withMaintainedZoneCasting(actor,cast,()=>placeSpellZoneOnAuthority(payload,{message,cast,ready,user,actor,profile}));
}
async function placeSpellZoneOnAuthority(payload,{message,cast,ready,user,actor,profile}){
 if(ready.regionUuid){
  const previous=await previousPlacement(ready),existing=previous.region,info=infoOf(existing);
  if(previous.reason)return {status:'alreadyPlaced',reason:previous.reason,regionUuid:ready.regionUuid};
  const scene=existing.parent,token=scene.tokens.get(payload.tokenId),point=payload.point??{},fog=profile.kind==='fog';
  if(scene.id!==payload.sceneId||token?.actor?.uuid!==actor.uuid)return {status:'outOfRange'};
  if(!pointInRange(placementLimit(scene,token,profile,fog?existing:null),point))return {status:fog?'fogMoveTooFar':'outOfRange'};
  if(info.wall?.origin)return placeNextWallBlock(existing,profile,point,token,message,ready);
  const radius=(fog?fogRadius(info,clock(info)):profile.radius)*zonePixelScale(scene);
  await existing.update({shapes:[{type:'circle',x:point.x,y:point.y,radius}],['flags.'+S+'.spellZone.lastMovedPhase']:spellZonePhase(info,clock(info))});
  await reconcileSpellZone(existing);return {status:'placed',regionUuid:existing.uuid};
 }
 const scene=game.scenes.get(payload.sceneId),token=scene?.tokens?.get(payload.tokenId);
 const solar=profile.requiresDaylight?cast.lightSite:null;
 if(profile.requiresDaylight&&(!payload.daylight||!solar||solar.sceneId!==scene?.id||solar.tokenId!==token?.id))
  return {status:'unavailable'};
 const point=solar??payload.point;
 if(!scene||scene.testUserPermission&&!scene.testUserPermission(user,'OBSERVER')||token?.actor?.uuid!==actor.uuid||(!solar&&!pointInRange(placementLimit(scene,token,profile),point)))return {status:'outOfRange'};
 const darkness=profile.kind==='darkness',scale=zonePixelScale(scene);
 const footprint=darkness?darknessPlacementShape(payload.shape,profile.area,scale):null;
 if(darkness&&(!footprint||footprint.x!==payload.point.x||footprint.y!==payload.point.y))return {status:'invalidArea'};
 const wall=profile.kind==='earthWall'?addSpellWallBlock(null,payload.point,scale,profile,scene.grid):null;
 if(wall&&!pointInRange(placementLimit(scene,token,profile),wall.origin))return {status:'outOfRange'};
 const time=Number(game.time?.worldTime)||0,combat=game.combat?.started&&(!game.combat.scene||game.combat.scene.id===scene.id)?game.combat:null;
 if(profile.kind==='earthquake'){const d=POWER_DETAILS_BY_ID[cast.sourceId].damageRoll;profile.damageFormula=d.steps[profile.severity].formula;profile.qualification=structuredClone(d.qualification);}
 if(profile.kind==='fire'){const damage=magicDamageProfile({system:{catalogId:cast.sourceId}},cast);profile.damageFormula=damage.formula;profile.openRoll=damage.openRoll;profile.qualification=structuredClone(damage.qualification);}
 const info={context:structuredClone(cast),profile,elevation:Number(solar?.elevation??token.elevation)||0,createdAt:time,until:time+5*profile.rounds,combatId:combat?.id??null,expiresRound:combat?Number(combat.round)+profile.rounds:null,messageId:message.id};
 if(wall)info.wall=wall;
 info.createdRound=Number(combat?.round)||0;
 info.lastMovedPhase=spellZonePhase(info,clock(info));
 let region=values(scene.regions).find(r=>infoOf(r)?.messageId===message.id);
 const darkMode=darkness?globalThis.CONFIG?.RegionBehavior?.dataModels?.adjustDarknessLevel?.MODES?.OVERRIDE:undefined;
 if(!region)[region]=await scene.createEmbeddedDocuments('Region',[{name:nameOf(info),color:auraColor(),highlightMode:darkness||wall?'shapes':'coverage',visibility:CONST.REGION_VISIBILITY.ALWAYS,
  levels:(solar?.level??token.level)?[solar?.level??token.level]:[],shapes:wall?wall.sections.map(section=>section.shape):[footprint??{type:'circle',x:point.x,y:point.y,radius:(profile.kind==='fog'?fogRadius(info,clock(info)):profile.radius)*scale}],flags:{[S]:{spellZone:info}},
  behaviors:[{type:TYPE,name:nameOf(info),system:{}},...(darkMode===undefined?[]:[{type:'adjustDarknessLevel',name:nameOf(info),system:{mode:darkMode,modifier:1}}])]}]);
 if(!region)throw Error('Spell zone creation failed');
 if(wall)await reconcileSpellZone(region);
 const placed=spellWallInfo(region)?.sections.length;
 await message.update({['flags.'+S+'.spellZoneCasting']:{...ready,regionUuid:region.uuid,...(wall?{wallBlocksPlaced:placed}:{})}});
 if(payload.underground===true&&profile.kind==='earthquake'&&!infoOf(region).collapseRolled){
  const {openDice}=await import('./dice.mjs');const result=await openDice({dice:1,faces:20,threshold:0});
  await region.update({['flags.'+S+'.spellZone.collapseRolled']:true});
  await ChatMessage.create({speaker:{alias:nameOf(info)},rolls:result.diceRolls,content:'<p class="trudvang consequence-notice">'+escapeHtml(local(result.total<=profile.collapseChance/5?'Collapse':'NoCollapse',{chance:profile.collapseChance}))+'</p>'});
 }
 if(!wall)await reconcileSpellZone(region);
 return {status:'placed',regionUuid:region.uuid,finished:!regionPresent(region),...(wall?{wallBlocksPlaced:placed}:{})};
}
function placeNextWallBlock(region,profile,point,token,message,ready){
 return serial(region.uuid,async()=>{
  const info=infoOf(region),scene=region.parent;
  if(!regionPresent(region)||!enabled(region)||spellZoneExpired(info,clock(info)))return {status:'unavailable',reason:'CastingFinished'};
  if(!values(region.levels).includes(token.level)&&values(region.levels).length)return {status:'outOfRange'};
  const scale=zonePixelScale(scene),blockPoint=spellWallBlockPoint(info.wall,point,scale);
  if(!pointInRange(placementLimit(scene,token,profile),blockPoint))return {status:'outOfRange'};
  const wall=addSpellWallBlock(info.wall,blockPoint,scale,profile);
  if(!wall)return {status:'alreadyPlaced',reason:'WallComplete'};
  await region.update({['flags.'+S+'.spellZone.wall']:wall,shapes:spellWallColumns(wall).map(column=>column.shape)});
  await syncSpellWall(region);
  const wallBlocksPlaced=wall.sections.length;
  await message.update({['flags.'+S+'.spellZoneCasting']:{...ready,wallBlocksPlaced}});
  return {status:'placed',regionUuid:region.uuid,wallBlocksPlaced};
 });
}
export async function resolveSpellZoneTestOnAuthority(payload){
 const message=game.messages.get(payload.messageId),state=message?.flags?.[S]?.spellZoneTest,user=game.users.get(payload.userId);
 const region=state?await foundry.utils.fromUuid(state.regionUuid):null,info=state?.instantInfo??infoOf(region),actor=await foundry.utils.fromUuid(payload.actorUuid);
 const row=state?.recipients.find(r=>r.actorUuid===actor?.uuid),instant=info?.profile.instant===true;
 if(!writer()||!state||!info||!user?.active||!canRead(message,user)||!actor?.testUserPermission(user,'OWNER')||!row)return {status:'unavailable'};
 const mud=info.profile.kind==='quagmire',phase=spellZonePhase(info,clock(info));
 if(!instant&&(!enabled(region)||spellZoneExpired(info,clock(info))||(!mud&&state.phase!==phase)||!members(region).has(actor.uuid)))return {status:'unavailable'};
 const rope=mud?ropeRecipient(region,actor):null;
 if(mud&&(!row.trapped||!rope))return {status:'unavailable'};
 const victimToken=instant?(await foundry.utils.fromUuid(row.tokenUuid)??{uuid:row.tokenUuid,actor,name:row.name}):members(region).get(actor.uuid);
 const stored=state.responses[responseKey(actor.uuid)],old=mud&&stored?.phase!==phase?null:stored;
 if(old?.resolved)return {status:'alreadyRolled'};
 const key=message.id+':'+actor.uuid,lock=locks.get(key);
 if(payload.action==='begin'){
  if(lock&&lock.until>Date.now()&&(!mud||lock.phase===phase))return {status:'busy'};
  const token=crypto.randomUUID();locks.set(key,{token,userId:user.id,phase,until:Date.now()+120000});return {status:'reserved',token,proofId:old?.proofId};
 }
 if(!lock||lock.token!==payload.token||lock.userId!==user.id)return {status:'unavailable'};
 if(payload.action==='cancel'){locks.delete(key);return {status:'cancelled'};}
 if(mud&&lock.phase!==phase){locks.delete(key);return {status:'unavailable'};}
 if(info.profile.kind==='fire'&&payload.choice==='accept'&&payload.action==='finish'){const next=structuredClone(state);await applyZoneFireDamage({actor,token:victimToken,info,message});next.responses[responseKey(actor.uuid)]={resolved:true,avoided:false};await updatePrompt(message,info,next,region);locks.delete(key);return {status:'resolved'};}
 const proof=game.messages.get(payload.proofId),test=proof?.flags?.[S]?.spellZoneProof,die=Number(proof?.rolls?.[0]?.total),target=Number(test?.target);
 if(payload.action!=='finish'||(proof?.author?.id??proof?._source?.author)!==user.id||test?.messageId!==message.id||test?.actorUuid!==actor.uuid||test.token!==lock.token&&old?.proofId!==payload.proofId||proof?.rolls?.[0]?.formula!=='1d20'||!Number.isInteger(die)||die<1||die>20||!Number.isFinite(target))return {status:'unavailable'};
 const next=structuredClone(state);
 if(mud&&!old)delete next.responses[responseKey(actor.uuid)];
 const response=next.responses[responseKey(actor.uuid)]??={outcome:{...resolveRollUnderOutcome(die,target),result:die,target},proofId:payload.proofId,resolved:false};
 if(mud){
  if(response.outcome.success){
   await rope.update({['flags.'+S+'.spellZoneRecipient.quagmire.rescued']:true,description:local('QuagmireRescued')});
   next.recipients.find(recipient=>recipient.actorUuid===actor.uuid).trapped=false;
  }
  response.phase=phase;
  response.resolved=true;
  await updatePrompt(message,info,next);
  locks.delete(key);
  return {status:'resolved'};
 }
 await updatePrompt(message,info,next);
 if(info.profile.kind==='fire'){if(!response.outcome.success)await applyZoneFireDamage({actor,token:victimToken,info,message});response.avoided=response.outcome.success;response.resolved=true;await updatePrompt(message,info,next,region);locks.delete(key);return {status:'resolved'};}
 if(!response.outcome.success){
  if(info.profile.kind==='runeEarthquake'){
   const stackId='quake-stun:'+message.id;
   if(!values(actor.effects).some(e=>e.system?.stackId===stackId))await actor.createTrudvangEffect({name:nameOf(info),type:'effect',img:'systems/trudvang-chronicles/assets/icons/earthquake.svg',transfer:false,statuses:['stun'],duration:{value:info.profile.stunRounds,units:'rounds'},start:foundry.documents.ActiveEffect.implementation.getEffectStart(),system:{stackId,stacking:'replace',changes:[]},description:local('RuneFailure'),flags:{[S]:{spellZoneStun:{combatId:info.combatId}}}});
  }else{
   await actor.toggleStatusEffect('prone',{active:true});
   const event='zone-fall:'+message.id+':'+actor.uuid;
   let damage=values(game.messages).find(m=>m.flags?.[S]?.persistentDamageEvent===event);
   if(!damage){const {rollDamage}=await import('./dice.mjs');const result=await rollDamage({actor,item:{name:nameOf(info),img:'systems/trudvang-chronicles/assets/icons/earthquake.svg',system:{category:'magic',damage:info.profile.damageFormula,openRoll:0,strengthApplies:false,damageBonus:0}},context:{usage:'magic',ignoreActorDamage:true,automatic:true,returnMessage:true,boundActorUuid:actor.uuid,persistentDamageEvent:event,qualification:info.profile.qualification,targets:[members(region).get(actor.uuid)]}});damage=result?.message;}
   if(!damage)throw Error('Earthquake fall damage failed');const {requestChatApplication}=await import('./chat-application.mjs');const applied=await requestChatApplication({message:damage,actor,channel:'body'});if(!['applied','alreadyApplied','ineligibleTarget'].includes(applied.status))throw Error('Earthquake damage application failed');
  }
 }
 response.resolved=true;await updatePrompt(message,info,next);locks.delete(key);return {status:'resolved'};
}
async function endFogOnAuthority(payload){
 const message=game.messages.get(payload.messageId),user=game.users.get(payload.userId),ready=message?.flags?.[S]?.spellZoneCasting;
 if(!writer()||!user?.active||!message||!canRead(message,user)||!ready?.regionUuid)return {status:'unavailable'};
 const region=await foundry.utils.fromUuid(ready.regionUuid),info=infoOf(region);
 if(info?.profile.kind!=='fog'||info.messageId!==message.id||!regionPresent(region))return {status:'unavailable'};
 const actor=await foundry.utils.fromUuid(info.context.casterUuid);
 if(!user.isGM&&!actor?.testUserPermission(user,'OWNER'))return {status:'unavailable'};
 await removeSpellZone(region);
 return {status:'removed'};
}
async function damageSpellWallOnAuthority(payload){
 const user=game.users.get(payload.userId),message=game.messages.get(payload.messageId);
 if(!writer()||!user?.active||!user.isGM||!Number.isInteger(payload.damage)||payload.damage<=0)return {status:'unavailable'};
 const uuid=message?.flags?.[S]?.spellZoneCasting?.regionUuid;
 if(!uuid)return {status:'unavailable'};
 const region=await foundry.utils.fromUuid(uuid);
 const info=infoOf(region);
 if(info?.messageId!==message?.id||!info?.wall)return {status:'unavailable'};
 return serial(region.uuid,async()=>{
  if(!regionPresent(region)||spellZoneExpired(info,clock(info)))return {status:'unavailable'};
  const sections=structuredClone(spellWallInfo(region).sections);
  const section=sections.find(row=>row.index===payload.index);
  if(!section?.hp)return {status:'unavailable'};
  section.hp=Math.max(0,section.hp-payload.damage);
  const remaining=sections.filter(row=>row.hp>0);
  const wall={...info.wall,sections};
  const footprints=wall.origin?spellWallColumns(wall).map(column=>column.shape):remaining.map(row=>row.shape);
  await region.update({['flags.'+S+'.spellZone.wall']:wall,...(remaining.length?{shapes:footprints}:{})});
  if(!remaining.length)await deleteZoneOnce(region);
  else await syncSpellWall(region);
  return {status:'damaged',index:section.index,hp:section.hp,max:section.max,destroyed:!remaining.length};
 });
}
export function resolveSpellZoneRequest(payload){return serial('request:'+(payload.messageId??''),()=>{
 if(payload.type==='createSpellZone')return createSpellZoneOnAuthority(payload);
 if(payload.type==='endFog')return endFogOnAuthority(payload);
 if(payload.type==='damageSpellWall')return damageSpellWallOnAuthority(payload);
 return resolveSpellZoneTestOnAuthority(payload);
});}
function registerSocket(){
 if(socketReady||!game.socket)return;socketReady=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='spellZoneReply'&&payload.userId===game.user.id){const p=replies.get(payload.requestId);if(p){clearTimeout(p.timer);replies.delete(payload.requestId);p.resolve(payload.result);}return;}
  if(!['createSpellZone','spellZoneTest','endFog'].includes(payload?.type)||!writer())return;
  let result;try{result=await resolveSpellZoneRequest(payload);}catch(error){console.error('Trudvang | Spell zone failed',error);result={status:'unavailable'};}
  game.socket.emit(channel,{type:'spellZoneReply',requestId:payload.requestId,userId:payload.userId,result});
 });
}
async function request(payload){
 payload={...payload,userId:game.user.id,requestId:crypto.randomUUID()};if(writer()){try{return await resolveSpellZoneRequest(payload);}catch(error){console.error('Trudvang | Spell zone failed',error);return {status:'unavailable'};}}
 if(!game.users?.activeGM||!game.socket)return {status:'unavailable'};registerSocket();
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:'unavailable'});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(channel,payload);});
}
export async function endFog(message){
 const result=await request({type:'endFog',messageId:message.id});
 if(result.status!=='removed')ui.notifications.warn(local('Unavailable'));
 return result;
}

async function chooseDarknessShape(profile,scene){
 const field=(name,label,value)=>'<div class="form-group"><label>'+escapeHtml(local(label))+'</label><input type="number" name="'+name+'" min="0.01" step="any" value="'+value+'" required></div>';
 const content='<div class="trudvang roll-dialog"><p>'+escapeHtml(local('DarknessAreaBudget',{area:profile.area}))+'</p>'
  +field('width','DarknessWidth',profile.area/5)+field('height','DarknessLength',5)
  +field('radius','DarknessRadius',Math.floor(Math.sqrt(profile.area/Math.PI)*100)/100)+'</div>';
 const scale=zonePixelScale(scene);
 const shapeFor=(type,button)=>{
  const length=name=>Number(button.form.querySelector('[name='+name+']').value)*scale;
  const shape=type==='circle'?{type,x:0,y:0,radius:length('radius')}:{type,x:0,y:0,width:length('width'),height:length('height')};
  const value=darknessPlacementShape(shape,profile.area,scale);
  if(!value)ui.notifications.warn(local('DarknessAreaInvalid'));
  return value;
 };
 return foundry.applications.api.DialogV2.wait({window:{title:local('DarknessShape')},classes:['trudvang','dialog'],content,
  buttons:[{action:'rectangle',label:local('DarknessRectangle'),default:true,callback:(_event,button)=>shapeFor('rectangle',button)},
   {action:'circle',label:local('DarknessCircle'),callback:(_event,button)=>shapeFor('circle',button)},
   {action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>null}],rejectClose:false});
}
export function spellWallCardState(message){
 const flags=message.flags?.[S],context=flags?.ruleTestContext,ready=flags?.spellZoneCasting;
 const definition=POWER_DETAILS_BY_ID[context?.sourceId]?.spellZone;
 if(definition?.kind!=='earthWall'||!ready)return null;
 const {volume}=earthquakeProfile(definition,context);
 // TEMPORARY WORLD MIGRATION — cards of rectangular walls had no incremental placement counter.
 const placed=ready.wallBlocksPlaced??(ready.regionUuid?volume:0);
 return {text:ready.wallFinished?local('WallClosed',{volume}):local('WallBlockVolume',{volume,remaining:Math.max(0,volume-placed)}),complete:ready.wallFinished||placed>=volume,finished:Boolean(ready.wallFinished)};
}
async function finishSpellWallCard(region){
 if(!spellWallInfo(region))return;
 const message=game.messages.get(infoOf(region).messageId),ready=message?.flags?.[S]?.spellZoneCasting;
 if(!ready||ready.wallFinished||ready.regionUuid!==region.uuid)return;
 await message.update({['flags.'+S+'.spellZoneCasting']:{...ready,wallFinished:true}});
}
export async function openSpellWallDamage(message){
 if(!game.user.isGM)return null;
 if(!writer())return ui.notifications.warn(local('Unavailable'));
 const uuid=message.flags?.[S]?.spellZoneCasting?.regionUuid,region=uuid?await foundry.utils.fromUuid(uuid):null;
 const wall=spellWallInfo(region);
 const sections=wall?.sections.filter(section=>section.hp>0);
 if(!sections?.length)return ui.notifications.warn(local('CastingFinished'));
 const heights=new Map(wall.origin?spellWallColumns(wall).flatMap(column=>column.blocks.map((block,i)=>[block.index,i+1])):[]);
 const options=sections.map(({index,hp,max})=>`<option value="${index}">${escapeHtml(local(heights.has(index)?'WallBlockSection':'WallSection',{n:index+1,hp,max,height:heights.get(index)}))}</option>`).join('');
 const choice=await foundry.applications.api.DialogV2.wait({window:{title:local('WallDamage')},classes:['trudvang','dialog'],
  content:`<div class="trudvang roll-dialog"><div class="form-group"><label for="wall-section">${escapeHtml(local('WallSectionLabel'))}</label><select id="wall-section" name="section">${options}</select></div><div class="form-group"><label for="wall-damage">${escapeHtml(local('WallDamageAmount'))}</label><input id="wall-damage" name="damage" type="number" min="1" step="1" value="1" required></div></div>`,
  buttons:[{action:'damage',label:local('WallDamage'),default:true,callback:(_event,button)=>({index:Number(button.form.elements.section.value),damage:button.form.elements.damage.valueAsNumber})},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],rejectClose:false});
 if(!choice||typeof choice!=='object')return null;
 const result=await request({type:'damageSpellWall',messageId:message.id,...choice});
 if(result.status!=='damaged')return ui.notifications.warn(local('Unavailable'));
 ui.notifications.info(local(result.destroyed?'WallDestroyed':'WallSection',{n:result.index+1,hp:result.hp,max:result.max}));
 return result;
}
export async function placeSpellZone(message){
 const context=message.flags?.[S]?.ruleTestContext,definition=POWER_DETAILS_BY_ID[context?.sourceId]?.spellZone,profile=earthquakeProfile(definition,context)??fixedLightProfile(context),actor=context?.casterUuid?await foundry.utils.fromUuid(context.casterUuid):null;
 const board=globalThis.canvas,scene=board?.scene;
 if(!profile||!actor?.isOwner||!scene){ui.notifications.warn(local('Unavailable'));return null;}
 const previous=await previousPlacement(message.flags?.[S]?.spellZoneCasting);if(previous?.reason){const result={status:'alreadyPlaced',reason:previous.reason};placementFeedback(result);return result;}
 const token=auraCasterToken(actor,board.tokens?.controlled,actor.getActiveTokens?.(false,true));if(!token||token.parent?.id!==scene.id){ui.notifications.warn(local('SelectCaster'));return null;}
 let underground=false,daylight=false;
 if(profile.requiresDaylight){
  const site=context.lightSite;
  if(!site||site.sceneId!==scene.id||site.tokenId!==token.id){ui.notifications.warn(local('Unavailable'));return null;}
  daylight=await foundry.applications.api.DialogV2.confirm({
   window:{title:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name')},
   content:'<p>'+escapeHtml(local('ConfirmOutdoorDaylight'))+'</p>'
  });
  if(!daylight)return null;
 }
 if(profile.kind==='earthquake'){
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name')},classes:['trudvang','dialog'],content:'<div class="trudvang roll-dialog"><p>'+escapeHtml(local('Profile',{radius:profile.radius,rounds:profile.rounds}))+'</p><label class="checkbox"><input type="checkbox" name="underground">'+escapeHtml(local('Underground',{chance:profile.collapseChance}))+'</label></div>',buttons:[{action:'continue',label:game.i18n.localize('TRUDVANG.Action.Continue'),default:true,callback:(_e,b)=>({underground:b.form.querySelector('[name=underground]').checked})},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],close:()=>false,rejectClose:false});
  if(!choice||typeof choice!=='object')return null;underground=choice.underground;
 }
 let point=center(token,scene),footprint;
 if(!profile.centered){
  const movingFog=profile.kind==='fog'&&previous?.region;
  if(movingFog&&movingFog.parent.id!==scene.id){placementFeedback({status:'outOfRange'});return null;}
  const darkness=profile.kind==='darkness';
  const wall=profile.kind==='earthWall';
  if(wall&&previous?.region&&previous.region.parent.id!==scene.id){placementFeedback({status:'outOfRange'});return null;}
  const radius=profile.kind==='fog'?(movingFog?fogRadius(infoOf(movingFog),clock(infoOf(movingFog))):profile.radius/3):profile.radius;
  const scale=zonePixelScale(scene),wallState=spellWallInfo(previous?.region);
  const shape=wall?{type:'rectangle',x:0,y:0,width:scale,height:scale,anchorX:.5,anchorY:.5}
   :darkness?await chooseDarknessShape(profile,scene):{type:'circle',x:0,y:0,radius:radius*scale};
  if(!shape||board.scene!==scene)return null;
  const guide=createSpellZoneRangeGuide(board);
  const limit=()=>placementLimit(scene,token,profile,movingFog);
  let pointer,preview,confirmed;
  try {
   preview=await board.regions.placeRegion({
    name:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name'),shapes:[shape],color:auraColor(),
    levels:token.level?[token.level]:[],highlightMode:darkness||wall?'shapes':'coverage',visibility:CONST.REGION_VISIBILITY.ALWAYS
   },{
    create:false,attachToToken:false,allowRotation:darkness&&shape.type==='rectangle',
    onMove:({position,snap,shape,preview})=>{
     pointer={x:position.x,y:position.y};
     const range=limit(),snapped=wall?spellWallBlockPoint(wallState,pointer,scale,scene.grid):snap?board.regions.getSnappedPoint?.(position):null;
     guide?.draw(range,pointer,pointInRange(range,pointer)&&(!snapped||pointInRange(range,snapped)));
     if(wall){
      Object.assign(shape,snapped);
      preview.document.updateSource({shapes:[shape]});
      preview.renderFlags.set({refreshShapes:true});
      return false;
     }
    },
    preConfirm:({shape,event})=>{
     const range=limit(),clicked=event?.getLocalPosition?.(board.stage)??pointer??shape;
     const destination=wall?spellWallBlockPoint(wallState,clicked,scale,scene.grid):shape;
     const valid=pointInRange(range,clicked)&&pointInRange(range,destination);
     guide?.draw(range,clicked,valid);
     if(valid){confirmed=destination;return true;}
     ui.notifications.warn(local(movingFog?'FogMoveTooFar':'OutOfRange'));
     return false;
    }
   });
  }finally{guide?.destroy();}
  if(!preview)return null;
  if(wall&&!confirmed)return null;
  point=wall?confirmed:{x:preview.shapes[0].x,y:preview.shapes[0].y};
  if(darkness)footprint=darknessPlacementShape(preview.shapes[0],profile.area,scale);
 }
 if(board.scene!==scene)return null;
 const result=await request({type:'createSpellZone',messageId:message.id,sceneId:scene.id,tokenId:token.id,point,underground,daylight,...(footprint?{shape:footprint}:{})});placementFeedback(result);return result;
}
export async function requestSpellZoneTest(message,actorUuid,choice='test'){
 const state=message.flags?.[S]?.spellZoneTest,region=state?await foundry.utils.fromUuid(state.regionUuid):null,info=state?.instantInfo??infoOf(region),actor=await foundry.utils.fromUuid(actorUuid);
 if(!info||!actor?.isOwner)return null;
 const base={type:'spellZoneTest',messageId:message.id,actorUuid,choice};const begin=await request({...base,action:'begin'});
 if(begin.status!=='reserved'){
  if(info.profile.kind==='quagmire')ui.notifications.warn(local(begin.status==='alreadyRolled'?'QuagmireRetry':'Unavailable'));
  return begin;
 }
 try{
  if(info.profile.kind==='fire'&&choice==='accept')return await request({...base,action:'finish',token:begin.token});
  if(info.profile.kind==='fire'&&!begin.proofId&&!canEvadeZoneFire(actor)){ui.notifications.warn(local('FireCannotEvade'));return {status:'unavailable'};}
  let proofId=begin.proofId;
  if(!proofId){
   const spec=['fire','quagmire'].includes(info.profile.kind)?{}:earthquakeTest(info.profile,impactSize(actor)),effect=region?effectsFor(actor,region)[0]:null;
   const procedure=outcome=>({flags:{spellZoneProof:{messageId:message.id,actorUuid,token:begin.token,target:outcome.target}}});let result;
   if(info.profile.kind==='fire'){const evade=fireEvadeItem(actor),options={resistedEffect:effect,reactive:true,modifierRows:[{labelKey:'TRUDVANG.SpellZone.FireInitiative',value:zoneFireInitiativePenalty(actor)}],resolveProcedure:procedure};result=(actor.isInActiveCombat??actor.isInCombatActive?.())?await actor.rollDodge(options):await actor.rollAbility(evade,options);}
   else if(info.profile.kind==='runeEarthquake'){const {rollConfiguredTraitSituation}=await import('./dice.mjs');result=await rollConfiguredTraitSituation({actor,resistedEffect:effect,reactive:true,test:{sv:spec.sv,trait:['dexterity','aucun'],traitMethod:'first',action:local('Test')},sourceName:nameOf(info)+' — '+actor.name,resolveProcedure:procedure});}
   else if(info.profile.kind==='quagmire'){const {rollConfiguredTraitSituation}=await import('./dice.mjs');result=await rollConfiguredTraitSituation({actor,reactive:true,test:{sv:12,trait:['strength'],traitMethod:'first',action:local('QuagmireRope')},sourceName:nameOf(info)+' — '+actor.name,resolveProcedure:procedure});}
   else result=await actor.rollAbility({name:game.i18n.localize('TRUDVANG.Skill.Agility'),type:'ability',system:{catalogId:'agility',parentSkill:'agility',kind:'skill',level:0,rollBonus:1}},{reactive:true,resistedEffect:effect,label:nameOf(info)+' — '+actor.name,modifierRows:[{labelKey:'TRUDVANG.SpellZone.SizeModifier',value:spec.modifier}],resolveProcedure:procedure});
   if(!result)return {status:'cancelled'};proofId=result.messageId;
  }
  return await request({...base,action:'finish',token:begin.token,proofId});
 }finally{await request({...base,action:'cancel',token:begin.token});}
}
export function registerSpellZoneSupport(){
 const Base=foundry.data?.regionBehaviors?.RegionBehaviorType;if(!Base)return;
 class SpellZoneBehavior extends Base{static defineSchema(){return {};};static events={tokenEnter:async function(e){await reconcileSpellZone(e.region,{entering:e.data.token});},tokenExit:async function(e){await reconcileSpellZone(e.region,{leaving:e.data.token});},behaviorActivated:async function(e){await reconcileSpellZone(e.region);},behaviorDeactivated:async function(e){await reconcileSpellZone(e.region,{removed:true});}};}
 CONFIG.RegionBehavior.dataModels[TYPE]=SpellZoneBehavior;CONFIG.RegionBehavior.typeLabels[TYPE]='TRUDVANG.SpellZone.Behavior';CONFIG.RegionBehavior.typeIcons[TYPE]='fa-solid fa-house-crack';
 const safely=()=>{if(writer())for(const scene of values(game.scenes)){void cleanupOrphanSpellZoneLights(scene).catch(error=>console.error('Trudvang | Orphan area light cleanup failed',error));for(const region of values(scene.regions))if(infoOf(region))void reconcileSpellZone(region).catch(error=>console.error('Trudvang | Zone reconciliation failed',error));}};
 const flightChanged=(effect,changes={})=>{if(changes.statuses!==undefined||values(effect.statuses).some(id=>['fly','hover','flying','hovering'].includes(id)))safely();};
 for(const hook of ['createActiveEffect','updateActiveEffect','deleteActiveEffect'])Hooks.on(hook,flightChanged);
 Hooks.on('updateRegion',region=>{if(infoOf(region))void reconcileSpellZone(region).catch(error=>console.error('Trudvang | Zone update failed',error));});
 Hooks.on('deleteRegion',region=>{
  const info=infoOf(region);
  if(!info)return;
  void reconcileSpellZone(region,{removed:true}).catch(error=>console.error('Trudvang | Zone cleanup failed',error));
  void trackSpellZoneRemoval(info.context);
 });
 for(const hook of ['updateCombat','updateWorldTime','canvasReady','updateUser'])Hooks.on(hook,safely);
 Hooks.on('updateScene',(_scene,changes)=>{
  if(changes.environment?.darknessLevel!==undefined||changes['environment.darknessLevel']!==undefined)safely();
 });
 Hooks.on('deleteCombat',combat=>{if(writer()){
  const actors=new Map([...values(game.actors),...values(game.scenes).flatMap(s=>values(s.tokens).map(t=>t.actor))].filter(Boolean).map(a=>[a.uuid,a]));
  for(const actor of actors.values())for(const effect of values(actor.effects))if(effect.flags?.[S]?.spellZoneStun?.combatId===combat.id)void deleteEffectOnce(effect,{trudvangExpired:true}).catch(error=>console.error('Trudvang | Zone stun cleanup failed',error));
 } if(writer())for(const scene of values(game.scenes))for(const region of values(scene.regions)){
  const info=infoOf(region);
  if(info?.combatId!==combat.id||info.profile.instant)continue;
  const end=continueAreaOutsideCombat(region,combat);
  void end.catch(error=>console.error('Trudvang | Combat area cleanup failed',error));
 }});
 Hooks.once('ready',async()=>{registerSocket();
  // TEMPORARY WORLD MIGRATION — remove with the pre-zone development worlds.
  try{await migrateToikalokkeEarthquake();}catch(error){console.error('Trudvang | Earthquake catalogue migration failed',error);}
  if(writer())for(const scene of values(game.scenes))try{await cleanupOrphanSpellWalls(scene);}catch(error){console.error('Trudvang | Orphan magical wall cleanup failed',error);}
  safely();});
}

async function continueAreaOutsideCombat(region,combat){
 await serial(region.uuid,async()=>{
  const info=infoOf(region),time=Number(game.time?.worldTime)||0;
  if(!regionPresent(region)||info?.combatId!==combat.id)return;
  const initialRound=info.createdRound??(Number(info.expiresRound)-info.profile.rounds);
  const elapsed=Math.max(time-info.createdAt,5*(Number(combat.round)-initialRound));
  const path='flags.'+S+'.spellZone.';
  await region.update({
   [path+'createdAt']:time-elapsed,
   [path+'until']:time-elapsed+5*info.profile.rounds,
   [path+'combatId']:null,
   [path+'lastMovedPhase']:'time:'+Math.floor(elapsed/5)
  });
 });
 await reconcileSpellZone(region);
}

/** TEMPORARY WORLD MIGRATION — harmonize old catalogue-owned Toikalokke copies.
 * The old level/cost/modifier tuple identifies the previous development profile;
 * completed casts and their saved costs are deliberately not rewritten. */
export async function migrateToikalokkeEarthquake(){
 if(!writer())return;
 const id='holy-toikalokke-master-of-elements:earthquake:7',tablet=TABLET_BY_ID.get(id.split(':')[0]),power=tablet?.powers.find(p=>p.id===id);
 if(!power)return;const canonical=powerItemData(power,tablet);
 const actors=new Map([...values(game.actors),...values(game.scenes).flatMap(scene=>values(scene.tokens).map(t=>t.actor))].filter(Boolean).map(a=>[a.uuid,a]));
 const items=new Map([...values(game.items),...[...actors.values()].flatMap(a=>values(a.items))].filter(Boolean).map(i=>[i.uuid,i]));
 for(const item of items.values()){
  const original=item._source?.system??item.system;
  if(!['spell','divineFeat'].includes(item.type)||original?.catalogId!==id||Number(original.level)!==3||Number(original.cost)!==6||Number(original.modifier)!==-6)continue;
  const update={};for(const field of ['level','cost','modifier','duration','range','weavingTime','powerLevels','summary','description','source'])update['system.'+field]=canonical.system[field];
  await item.update(update);
 }
}
