import {fireEvadeItem,canEvadeZoneFire,zoneFireInitiativePenalty,applyZoneFireDamage} from './fire-zones.mjs';
import {magicDamageProfile} from './magic-damage.mjs';
import {deleteEffectOnce} from './effect-deletion.mjs';
import {TABLET_BY_ID,powerItemData} from './tablet-catalog.mjs';
import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {earthquakeProfile,earthquakeTest,spellZoneExpired,spellZonePhase,zonePixelScale} from './rules/spell-zones.mjs';
import {impactSize} from './rules/impact.mjs';
import {resolveRollUnderOutcome} from './rules/roll-under-resolver.mjs';
import {rollOutcomeText} from './rules/roll-outcome-view.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
import {auraCasterToken,auraColor} from './aura.mjs';
const S='trudvang-chronicles',TYPE='trudvangSpellZone',channel='system.'+S,jobs=new Map(),locks=new Map(),replies=new Map();let socketReady=false;
const values=c=>Array.from(c?.values?.()??c??[]),local=(k,d)=>d?game.i18n.format('TRUDVANG.SpellZone.'+k,d):game.i18n.localize('TRUDVANG.SpellZone.'+k);
const canRead=(message,user)=>user.isGM||(!message.blind&&(!message.whisper?.length||(message.author?.id??message._source?.author)===user.id||values(message.whisper).some(u=>(typeof u==='string'?u:u.id)===user.id)));
const writer=()=>Boolean(game.users?.activeGM?.isSelf||game.users?.activeGM?.id===game.user?.id),infoOf=r=>r?.flags?.[S]?.spellZone;
const clock=info=>({time:Number(game.time?.worldTime)||0,combat:game.combats?.get?.(info.combatId)??(game.combat?.id===info.combatId?game.combat:null)});
const serial=(key,work)=>{const job=(jobs.get(key)??Promise.resolve()).catch(()=>{}).then(work);jobs.set(key,job);return job.finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});};
const responseKey=uuid=>encodeURIComponent(uuid).replaceAll('.','%2E');
const nameOf=info=>game.i18n.localize('TRUDVANG.Content.Power.'+info.context.sourceId+'.Name');
const eligible=(actor,info)=>actor&&['character','npc'].includes(actor.type)&&(!info.profile.excludeCaster||actor.uuid!==info.context.casterUuid)&&(info.profile.kind==='fire'||!['fly','hover','flying','hovering'].some(s=>actor.statuses?.has?.(s)))&&(info.profile.kind==='fire'||!earthquakeTest(info.profile,impactSize(actor)).immune);
const members=(region,{entering,leaving}={})=>new Map([...values(region.tokens).filter(t=>t.uuid!==leaving?.uuid),...(entering?[entering]:[])].filter(t=>eligible(t.actor,infoOf(region))).map(t=>[t.actor.uuid,t]));
const enabled=region=>!region.behaviors||values(region.behaviors).some(b=>b.type===TYPE&&!b.disabled);
const effectsFor=(actor,region)=>values(actor.effects).filter(e=>e.flags?.[S]?.spellZoneRecipient?.regionUuid===region.uuid);
function center(token,scene){return token.object?.center??{x:Number(token.x||0)+Number(token.width||1)*scene.grid.size/2,y:Number(token.y||0)+Number(token.height||1)*scene.grid.size/2};}
function allowedPoint(point,token,scene,profile){const p=center(token,scene);return Number.isFinite(point.x)&&Number.isFinite(point.y)&&Math.hypot(point.x-p.x,point.y-p.y)<=profile.range*zonePixelScale(scene)+.01;}
const regionDeletions=new WeakMap();
function regionPresent(region){return !region.id||!region.parent?.regions?.get||region.parent.regions.get(region.id)===region;}
function deleteZoneOnce(region){
 if(regionDeletions.has(region))return regionDeletions.get(region);
 const job=Promise.resolve().then(()=>regionPresent(region)?region.delete():false).finally(()=>regionDeletions.delete(region));regionDeletions.set(region,job);return job;
}
async function removeRecipients(region,{expired=false}={}){
 const actors=new Map([...values(game.actors),...values(region.parent?.tokens).map(t=>t.actor)].filter(Boolean).map(a=>[a.uuid,a]));
 for(const actor of actors.values())for(const effect of effectsFor(actor,region))await deleteEffectOnce(effect,expired?{trudvangExpired:true}:{});
}
function promptHTML(info,recipients,responses){
 return '<article class="trudvang chat-card spell-zone-card"><header><h3>'+escapeHtml(nameOf(info))+'</h3></header><p>'+escapeHtml(local('Instruction'))+'</p><ul class="trait-situation-results">'+recipients.map(row=>{
  const response=responses[responseKey(row.actorUuid)],outcome=response?.outcome;
  if(info.profile.kind==='fire')return '<li class="trait-situation-result"><span>'+escapeHtml(row.name)+'</span>'+(response?.resolved?'<strong>'+escapeHtml(local(response.avoided?'FireAvoided':'FireApplied'))+'</strong>':(row.canEvade?'<button type="button" data-action="spell-zone-test" data-zone-choice="evade" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'">'+escapeHtml(local('FireEvade'))+'</button>':'')+'<button type="button" data-action="spell-zone-test" data-zone-choice="accept" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'">'+escapeHtml(local('FireAccept'))+'</button>')+'</li>';
  return '<li class="trait-situation-result"><button type="button" class="trait-situation-token" data-action="locate-trait-situation-token" data-token-uuid="'+escapeAttribute(row.tokenUuid)+'" title="'+escapeAttribute(game.i18n.localize('TRUDVANG.Dialog.TraitSituationTokenHint'))+'">'+escapeHtml(row.name)+'</button>'+(response?.resolved?'<strong class="test-outcome '+(outcome.success?'success':'failure')+'">'+escapeHtml(rollOutcomeText(outcome,k=>game.i18n.localize(k)))+'</strong>':'<button type="button" data-action="spell-zone-test" data-actor-uuid="'+escapeAttribute(row.actorUuid)+'"><i class="fas fa-dice-d20"></i> '+escapeHtml(local('Test'))+'</button>')+'</li>';
 }).join('')+'</ul></article>';
}
async function updatePrompt(message,info,state){await message.update({content:promptHTML(info,state.recipients,state.responses),['flags.'+S+'.spellZoneTest']:state});}
async function promptMembers(region,info,tokens){
 if(!tokens.size)return;
 const phase=spellZonePhase(info,clock(info));
 let message=values(game.messages).find(m=>m.flags?.[S]?.spellZoneTest?.regionUuid===region.uuid&&m.flags[S].spellZoneTest.phase===phase);
 const state=structuredClone(message?.flags?.[S]?.spellZoneTest??{regionUuid:region.uuid,phase,recipients:[],responses:{}});
 for(const [uuid,token]of tokens)if(!state.recipients.some(r=>r.actorUuid===uuid))state.recipients.push({actorUuid:uuid,name:token.name??token.actor.name,tokenUuid:token.uuid,...(info.profile.kind==='fire'?{canEvade:Number(fireEvadeItem(token.actor)?.system?.level)>0&&token.actor.canPerformAction?.({movement:true})!==false}:{})});
 const actors=state.recipients.map(r=>tokens.get(r.actorUuid)?.actor).filter(Boolean),whisper=values(game.users).filter(u=>u.isGM||actors.some(a=>a.testUserPermission(u,'OWNER'))).map(u=>u.id);
 if(!message){message=await ChatMessage.create({speaker:{alias:nameOf(info)},whisper,content:promptHTML(info,state.recipients,state.responses),flags:{[S]:{spellZoneTest:state}}});}
 else await message.update({whisper:[...new Set([...message.whisper??[],...whisper])],content:promptHTML(info,state.recipients,state.responses),['flags.'+S+'.spellZoneTest']:state});
 return message;
}
export function reconcileSpellZone(region,{removed=false,entering,leaving}={}){
 return serial(region.uuid,async()=>{
  if(!writer()||!infoOf(region))return;
  const info=infoOf(region);
  if(removed||!regionPresent(region)||!enabled(region)){await removeRecipients(region);return;}
  if(spellZoneExpired(info,clock(info))){await removeRecipients(region,{expired:true});await deleteZoneOnce(region);return;}
  let tokens=members(region,{entering,leaving});
  if(info.profile.instant){if(!info.initialActors){info.initialActors=[...tokens.keys()];await region.update({['flags.'+S+'.spellZone.initialActors']:info.initialActors});}tokens=new Map([...tokens].filter(([id])=>info.initialActors.includes(id)));}
  const actors=new Map([...values(game.actors),...values(region.parent?.tokens).map(t=>t.actor)].filter(Boolean).map(a=>[a.uuid,a]));
  for(const actor of actors.values())if(!tokens.has(actor.uuid))for(const effect of effectsFor(actor,region))await deleteEffectOnce(effect);
  if(info.profile.kind==='earthquake'||info.profile.kind==='fire'&&info.profile.penalty&&!info.profile.instant)for(const [uuid,token]of tokens){
   if(effectsFor(token.actor,region).length)continue;
   const remaining=Math.max(.01,(info.until-(Number(game.time?.worldTime)||0))/5),combat=clock(info).combat;
   const rounds=combat?Math.max(.01,info.expiresRound-Number(combat.round)):remaining;
   await token.actor.createTrudvangEffect({name:nameOf(info),img:info.profile.kind==='fire'?'icons/svg/fire.svg':'systems/trudvang-chronicles/assets/icons/earthquake.svg',type:'effect',transfer:false,origin:region.uuid,description:local(info.profile.kind==='fire'?'FireVisibility':'PenaltyDescription',{penalty:info.profile.penalty}),
    duration:{value:rounds,units:'rounds'},start:foundry.documents.ActiveEffect.implementation.getEffectStart(),system:{stackId:'spell-zone:'+region.uuid,stacking:'replace',changes:[{key:info.profile.kind==='fire'?'system.modifiers.rolls.visibility':'system.modifiers.rolls.allActions',type:info.profile.kind==='fire'?'downgrade':'add',value:String(info.profile.penalty),phase:'initial',priority:10*Number(info.context.sourceLevel||1)}]},flags:{[S]:{spellZoneRecipient:{regionUuid:region.uuid,...(info.profile.kind==='fire'?{visibility:true}:{})}}}});
  }
  const prompt=await promptMembers(region,info,tokens);
  if(info.profile.kind==='fire'){if(prompt){const state=structuredClone(prompt.flags[S].spellZoneTest);for(const [id,token]of tokens){const row=state.recipients.find(r=>r.actorUuid===id);if(!row?.canEvade&&!state.responses[responseKey(id)]?.resolved){await applyZoneFireDamage({actor:token.actor,token,info,message:prompt});state.responses[responseKey(id)]={resolved:true,avoided:false};await updatePrompt(prompt,info,state);}}}
   if(info.profile.instant&&(!prompt||prompt.flags[S].spellZoneTest.recipients.every(r=>prompt.flags[S].spellZoneTest.responses[responseKey(r.actorUuid)]?.resolved))){await removeRecipients(region);await deleteZoneOnce(region);}
  }
 });
}
export async function createSpellZoneOnAuthority(payload){
 const message=game.messages.get(payload.messageId),cast=message?.flags?.[S]?.ruleTestContext,ready=message?.flags?.[S]?.spellZoneCasting,user=game.users.get(payload.userId);
 const actor=cast?.casterUuid?await foundry.utils.fromUuid(cast.casterUuid):null,definition=POWER_DETAILS_BY_ID[cast?.sourceId]?.spellZone,profile=earthquakeProfile(definition,cast);
 const die=Number(message?.rolls?.[0]?.total);
 if(!writer()||!user?.active||!message||!canRead(message,user)||!actor?.testUserPermission(user,'OWNER')||!ready||!profile||!Number.isInteger(die)||die<1||die>19||(die!==1&&die>ready.target))return {status:'unavailable'};
 if(ready.regionUuid){const existing=await foundry.utils.fromUuid(ready.regionUuid),info=infoOf(existing);if(!info?.profile.movable||spellZoneExpired(info,clock(info))||info.lastMovedPhase===spellZonePhase(info,clock(info)))return {status:'alreadyPlaced',regionUuid:ready.regionUuid};const scene=existing.parent,token=scene.tokens.get(payload.tokenId);if(scene.id!==payload.sceneId||token?.actor?.uuid!==actor.uuid||!allowedPoint(payload.point??{},token,scene,profile))return {status:'outOfRange'};await existing.update({shapes:[{type:'circle',...payload.point,radius:profile.radius*zonePixelScale(scene)}],['flags.'+S+'.spellZone.lastMovedPhase']:spellZonePhase(info,clock(info))});await reconcileSpellZone(existing);return {status:'placed',regionUuid:existing.uuid};}
 const scene=game.scenes.get(payload.sceneId),token=scene?.tokens?.get(payload.tokenId);
 if(!scene||scene.testUserPermission&&!scene.testUserPermission(user,'OBSERVER')||token?.actor?.uuid!==actor.uuid||!allowedPoint(payload.point??{},token,scene,profile))return {status:'outOfRange'};
 const time=Number(game.time?.worldTime)||0,combat=game.combat?.started&&(!game.combat.scene||game.combat.scene.id===scene.id)?game.combat:null;
 if(profile.kind==='earthquake'){const d=POWER_DETAILS_BY_ID[cast.sourceId].damageRoll;profile.damageFormula=d.steps[profile.severity].formula;profile.qualification=structuredClone(d.qualification);}
 if(profile.kind==='fire'){const damage=magicDamageProfile({system:{catalogId:cast.sourceId}},cast);profile.damageFormula=damage.formula;profile.openRoll=damage.openRoll;profile.qualification=structuredClone(damage.qualification);}
 const info={context:structuredClone(cast),profile,createdAt:time,until:time+5*profile.rounds,combatId:combat?.id??null,expiresRound:combat?Number(combat.round)+profile.rounds:null,messageId:message.id};
 info.lastMovedPhase=spellZonePhase(info,clock(info));
 let region=values(scene.regions).find(r=>infoOf(r)?.messageId===message.id);
 if(!region)[region]=await scene.createEmbeddedDocuments('Region',[{name:nameOf(info),color:auraColor(),highlightMode:'coverage',visibility:CONST.REGION_VISIBILITY.ALWAYS,
  levels:token.level?[token.level]:[],shapes:[{type:'circle',x:payload.point.x,y:payload.point.y,radius:profile.radius*zonePixelScale(scene)}],flags:{[S]:{spellZone:info}},behaviors:[{type:TYPE,name:nameOf(info),system:{}}]}]);
 if(!region)throw Error('Spell zone creation failed');
 await message.update({['flags.'+S+'.spellZoneCasting']:{...ready,regionUuid:region.uuid}});
 if(payload.underground===true&&profile.kind==='earthquake'&&!infoOf(region).collapseRolled){
  const {openDice}=await import('./dice.mjs');const result=await openDice({dice:1,faces:20,threshold:0});
  await region.update({['flags.'+S+'.spellZone.collapseRolled']:true});
  await ChatMessage.create({speaker:{alias:nameOf(info)},rolls:result.diceRolls,content:'<p class="trudvang consequence-notice">'+escapeHtml(local(result.total<=profile.collapseChance/5?'Collapse':'NoCollapse',{chance:profile.collapseChance}))+'</p>'});
 }
 await reconcileSpellZone(region);return {status:'placed',regionUuid:region.uuid};
}
export async function resolveSpellZoneTestOnAuthority(payload){
 const message=game.messages.get(payload.messageId),state=message?.flags?.[S]?.spellZoneTest,user=game.users.get(payload.userId);
 const region=state?await foundry.utils.fromUuid(state.regionUuid):null,info=infoOf(region),actor=await foundry.utils.fromUuid(payload.actorUuid);
 if(!writer()||!state||!info||!enabled(region)||!user?.active||!canRead(message,user)||!actor?.testUserPermission(user,'OWNER')||spellZoneExpired(info,clock(info))||state.phase!==spellZonePhase(info,clock(info))||!members(region).has(actor.uuid)||!state.recipients.some(r=>r.actorUuid===actor.uuid))return {status:'unavailable'};
 const old=state.responses[responseKey(actor.uuid)];if(old?.resolved)return {status:'alreadyRolled'};
 const key=message.id+':'+actor.uuid,lock=locks.get(key);
 if(payload.action==='begin'){
  if(lock&&lock.until>Date.now())return {status:'busy'};
  const token=crypto.randomUUID();locks.set(key,{token,userId:user.id,until:Date.now()+120000});return {status:'reserved',token,proofId:old?.proofId};
 }
 if(!lock||lock.token!==payload.token||lock.userId!==user.id)return {status:'unavailable'};
 if(payload.action==='cancel'){locks.delete(key);return {status:'cancelled'};}
 if(info.profile.kind==='fire'&&payload.choice==='accept'&&payload.action==='finish'){const next=structuredClone(state);await applyZoneFireDamage({actor,token:members(region).get(actor.uuid),info,message});next.responses[responseKey(actor.uuid)]={resolved:true,avoided:false};await updatePrompt(message,info,next);locks.delete(key);if(info.profile.instant&&next.recipients.every(r=>next.responses[responseKey(r.actorUuid)]?.resolved))await deleteZoneOnce(region);return {status:'resolved'};}
 const proof=game.messages.get(payload.proofId),test=proof?.flags?.[S]?.spellZoneProof,die=Number(proof?.rolls?.[0]?.total),target=Number(test?.target);
 if(payload.action!=='finish'||(proof?.author?.id??proof?._source?.author)!==user.id||test?.messageId!==message.id||test?.actorUuid!==actor.uuid||test.token!==lock.token&&old?.proofId!==payload.proofId||proof?.rolls?.[0]?.formula!=='1d20'||!Number.isInteger(die)||die<1||die>20||!Number.isFinite(target))return {status:'unavailable'};
 const next=structuredClone(state),response=next.responses[responseKey(actor.uuid)]??={outcome:{...resolveRollUnderOutcome(die,target),result:die,target},proofId:payload.proofId,resolved:false};
 await updatePrompt(message,info,next);
 if(info.profile.kind==='fire'){if(!response.outcome.success)await applyZoneFireDamage({actor,token:members(region).get(actor.uuid),info,message});response.avoided=response.outcome.success;response.resolved=true;await updatePrompt(message,info,next);locks.delete(key);if(info.profile.instant&&next.recipients.every(r=>next.responses[responseKey(r.actorUuid)]?.resolved))await deleteZoneOnce(region);return {status:'resolved'};}
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
export function resolveSpellZoneRequest(payload){return serial('request:'+(payload.messageId??''),()=>payload.type==='createSpellZone'?createSpellZoneOnAuthority(payload):resolveSpellZoneTestOnAuthority(payload));}
function registerSocket(){
 if(socketReady||!game.socket)return;socketReady=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='spellZoneReply'&&payload.userId===game.user.id){const p=replies.get(payload.requestId);if(p){clearTimeout(p.timer);replies.delete(payload.requestId);p.resolve(payload.result);}return;}
  if(!['createSpellZone','spellZoneTest'].includes(payload?.type)||!writer())return;
  let result;try{result=await resolveSpellZoneRequest(payload);}catch(error){console.error('Trudvang | Spell zone failed',error);result={status:'unavailable'};}
  game.socket.emit(channel,{type:'spellZoneReply',requestId:payload.requestId,userId:payload.userId,result});
 });
}
async function request(payload){
 payload={...payload,userId:game.user.id,requestId:crypto.randomUUID()};if(writer()){try{return await resolveSpellZoneRequest(payload);}catch(error){console.error('Trudvang | Spell zone failed',error);return {status:'unavailable'};}}
 if(!game.users?.activeGM||!game.socket)return {status:'unavailable'};registerSocket();
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:'unavailable'});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(channel,payload);});
}
export async function placeSpellZone(message){
 const context=message.flags?.[S]?.ruleTestContext,definition=POWER_DETAILS_BY_ID[context?.sourceId]?.spellZone,profile=earthquakeProfile(definition,context),actor=context?.casterUuid?await foundry.utils.fromUuid(context.casterUuid):null;
 if(!profile||!actor?.isOwner||!globalThis.canvas?.scene)return null;
 const token=auraCasterToken(actor,canvas.tokens?.controlled,actor.getActiveTokens?.(false,true));if(!token||token.parent?.id!==canvas.scene.id){ui.notifications.warn(local('SelectCaster'));return null;}
 let underground=false;
 if(profile.kind==='earthquake'){
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name')},classes:['trudvang','dialog'],content:'<div class="trudvang roll-dialog"><p>'+escapeHtml(local('Profile',{radius:profile.radius,rounds:profile.rounds}))+'</p><label class="checkbox"><input type="checkbox" name="underground">'+escapeHtml(local('Underground',{chance:profile.collapseChance}))+'</label></div>',buttons:[{action:'continue',label:game.i18n.localize('TRUDVANG.Action.Continue'),default:true,callback:(_e,b)=>({underground:b.form.querySelector('[name=underground]').checked})},{action:'cancel',label:game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false}],close:()=>false,rejectClose:false});
  if(!choice||typeof choice!=='object')return null;underground=choice.underground;
 }
 let point=center(token,canvas.scene);
 if(!profile.centered){
  const preview=await canvas.regions.placeRegion({name:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name'),shapes:[{type:'circle',x:0,y:0,radius:profile.radius*zonePixelScale(canvas.scene)}],color:auraColor(),levels:token.level?[token.level]:[],highlightMode:'coverage',visibility:CONST.REGION_VISIBILITY.ALWAYS},{create:false,attachToToken:false,allowRotation:false,preConfirm:({shape})=>{if(allowedPoint(shape,token,canvas.scene,profile))return true;ui.notifications.warn(local('OutOfRange'));return false;}});
  if(!preview)return null;point={x:preview.shapes[0].x,y:preview.shapes[0].y};
 }
 const result=await request({type:'createSpellZone',messageId:message.id,sceneId:canvas.scene.id,tokenId:token.id,point,underground});if(!['placed','alreadyPlaced'].includes(result.status))ui.notifications.warn(local('Unavailable'));return result;
}
export async function requestSpellZoneTest(message,actorUuid,choice='test'){
 const state=message.flags?.[S]?.spellZoneTest,region=state?await foundry.utils.fromUuid(state.regionUuid):null,info=infoOf(region),actor=await foundry.utils.fromUuid(actorUuid);
 if(!info||!actor?.isOwner)return null;
 const base={type:'spellZoneTest',messageId:message.id,actorUuid,choice};const begin=await request({...base,action:'begin'});if(begin.status!=='reserved')return begin;
 try{
  if(info.profile.kind==='fire'&&choice==='accept')return await request({...base,action:'finish',token:begin.token});
  if(info.profile.kind==='fire'&&!begin.proofId&&!canEvadeZoneFire(actor)){ui.notifications.warn(local('FireCannotEvade'));return {status:'unavailable'};}
  let proofId=begin.proofId;
  if(!proofId){
   const spec=info.profile.kind==='fire'?{}:earthquakeTest(info.profile,impactSize(actor)),effect=effectsFor(actor,region)[0];
   const procedure=outcome=>({flags:{spellZoneProof:{messageId:message.id,actorUuid,token:begin.token,target:outcome.target}}});let result;
   if(info.profile.kind==='fire'){const evade=fireEvadeItem(actor),options={resistedEffect:effect,reactive:true,modifierRows:[{labelKey:'TRUDVANG.SpellZone.FireInitiative',value:zoneFireInitiativePenalty(actor)}],resolveProcedure:procedure};result=(actor.isInActiveCombat??actor.isInCombatActive?.())?await actor.rollDodge(options):await actor.rollAbility(evade,options);}
   else if(info.profile.kind==='runeEarthquake'){const {rollConfiguredTraitSituation}=await import('./dice.mjs');result=await rollConfiguredTraitSituation({actor,resistedEffect:effect,reactive:true,test:{sv:spec.sv,trait:['dexterity','aucun'],traitMethod:'first',action:local('Test')},sourceName:nameOf(info)+' — '+actor.name,resolveProcedure:procedure});}
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
 const safely=()=>{if(writer())for(const scene of values(game.scenes))for(const region of values(scene.regions))if(infoOf(region))void reconcileSpellZone(region).catch(error=>console.error('Trudvang | Zone reconciliation failed',error));};
 const flightChanged=(effect,changes={})=>{if(changes.statuses!==undefined||values(effect.statuses).some(id=>['fly','hover','flying','hovering'].includes(id)))safely();};
 for(const hook of ['createActiveEffect','updateActiveEffect','deleteActiveEffect'])Hooks.on(hook,flightChanged);
 Hooks.on('deleteRegion',region=>{if(infoOf(region))void reconcileSpellZone(region,{removed:true}).catch(error=>console.error('Trudvang | Zone cleanup failed',error));});
 for(const hook of ['updateCombat','updateWorldTime','canvasReady'])Hooks.on(hook,safely);
 Hooks.on('deleteCombat',combat=>{if(writer()){
  const actors=new Map([...values(game.actors),...values(game.scenes).flatMap(s=>values(s.tokens).map(t=>t.actor))].filter(Boolean).map(a=>[a.uuid,a]));
  for(const actor of actors.values())for(const effect of values(actor.effects))if(effect.flags?.[S]?.spellZoneStun?.combatId===combat.id)void deleteEffectOnce(effect,{trudvangExpired:true}).catch(error=>console.error('Trudvang | Zone stun cleanup failed',error));
 } if(writer())for(const scene of values(game.scenes))for(const region of values(scene.regions))if(infoOf(region)?.combatId===combat.id)void deleteZoneOnce(region).catch(error=>console.error('Trudvang | Zone deletion failed',error));});
 Hooks.once('ready',async()=>{registerSocket();
  // TEMPORARY WORLD MIGRATION — remove with the pre-zone development worlds.
  try{await migrateToikalokkeEarthquake();}catch(error){console.error('Trudvang | Earthquake catalogue migration failed',error);}
  safely();});
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
