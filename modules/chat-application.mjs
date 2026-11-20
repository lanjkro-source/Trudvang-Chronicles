import {resolveImpactTest,impactResultText,requestImpactTest} from './impact-tests.mjs';
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {resolveRollUnderOutcome} from "./rules/roll-under-resolver.mjs";
import {adjustedFearFactor,fearRecipientEligible} from "./rules/fear-protection.mjs";
import {applyDamageToActor, applyDamageToDefenseItem, prepareDamageTargets} from "./damage-application.mjs";
import {renderTemplate,escapeHtml} from "./helpers.mjs";
import {magicResistanceRows,localizeResistanceRows} from './rules/magic-resistance.mjs';
import {conditionalDamageBonus,damageCanAffect} from "./rules/creature-conditional-bonus.mjs";
import {applyWeaponDamageEffects} from './weapon-damage-effects.mjs';
import {rollOutcomeText} from './rules/roll-outcome-view.mjs';
import {fearTargetRow} from './magic-fear.mjs';
import {applyFatalVitnerArea, cleanupFatalVitnerPreviews, clearFatalVitnerPreview} from "./fatal-vitner-area.mjs";
import {FATAL_MAGIC_ROWS, fatalMagicHasArea} from "./rules/fatal-magic.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const SOCKET_CHANNEL = `system.${SYSTEM_ID}`;
const queues = new Map();
const unrecorded = new Map();
const replies = new Map();
const resistanceLocks=new Map();
let registered = false;
const authorId = message => message?.author?.id ?? message?._source?.author;
const rowsFor = message => message.getFlag(SYSTEM_ID, "applications") ?? [];
function pendingFearResults(results,applied=[]){
 return '<section data-fear-resistance-results>'+results.filter(row=>!applied.some(a=>a.channel==='fear'&&a.actorUuid===row.actorUuid)).map(row=>'<p>'+escapeHtml(row.name??'')+' — <strong class="test-outcome '+(row.success?'success':'failure')+'">'+escapeHtml(rollOutcomeText(row.outcome??{},key=>game.i18n.localize(key)))+'</strong></p>').join('')+'</section>';
}
const damageTargetsSection = /<section\b[^>]*\bdata-damage-targets(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/;
const fearTargetsSection = /<section\b[^>]*\bdata-fear-targets(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/;

export function hasChatApplication(message, actorUuid, channel, itemUuid = "") {
  return rowsFor(message).some(row => row.actorUuid === actorUuid && row.channel === channel
    && (channel !== "defense" || row.itemUuid === itemUuid));
}

function responderFor(message) {
  const users = Array.from(game.users?.values?.() ?? game.users ?? []);
  const author = users.find(user => user.id === authorId(message));
  if (author?.active && author.isGM) return author;
  return users.filter(user => user.active && user.isGM).sort((a, b) => a.id.localeCompare(b.id))[0];
}

function sourceAmount(message, channel) {
  // The roll card's action attributes are the contract, including custom cards;
  // never trust a numerical value supplied by a player's socket payload.
  const attribute = channel === "fear" ? "fear" : "damage";
  const match = String(message.content ?? "").match(new RegExp(`\\bdata-${attribute}=["']([\\d.]+)["']`));
  const amount = match ? Number(match[1]) : NaN;
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function canReadMessage(message, user) {
  const whispers = Array.from(message.whisper ?? [], recipient => typeof recipient === "string" ? recipient : recipient.id);
  return user.isGM || (!message.blind && (!whispers.length || authorId(message) === user.id || whispers.includes(user.id)));
}

async function applyFatalVitnerAreaOnGM(payload) {
  const message = game.messages.get(payload.messageId);
  const user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message, user)
      || (!user.isGM && authorId(message) !== user.id)) return {status: "unavailable"};
  const result = message.getFlag(SYSTEM_ID, "fatalMagicResult");
  const actor = result?.actorUuid ? await foundry.utils.fromUuid(result.actorUuid) : null;
  if (!actor?.canUserModify?.(user, "update")) return {status: "unavailable"};
  return applyFatalVitnerArea(message, {prepareOnly: payload.prepareOnly === true});
}

export function canManageFearTargets(message,user) {
  const context = message.getFlag(SYSTEM_ID,"fearContext");
  return Boolean(context?.areaSceneId && !message.getFlag(SYSTEM_ID,"fearBatchApplied") && (user.isGM || user.id === context.casterUserId));
}

function canReceiveFear(message,actor) {
  const targets = message.getFlag(SYSTEM_ID,"fearTargets");
  if (targets) return targets.some(row => row.actorUuid === actor.uuid);
  return fearRecipientEligible(actor,message.getFlag(SYSTEM_ID,"fearContext"));
}

async function editFearTargetsOnGM(payload) {
  const message = game.messages.get(payload.messageId), user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message,user)
      || !canManageFearTargets(message,user) || !fearTargetsSection.test(message.content)) return {status:"unavailable"};
  const total = sourceAmount(message,"fear");
  if (total === null) return {status:"unavailable"};
  const targets = new Map((message.getFlag(SYSTEM_ID,"fearTargets") ?? []).map(row => [row.actorUuid,row]));
  let changed = false;
  if (payload.type === "chatRemoveFearTarget") {
    changed = targets.delete(payload.actorUuid);
  } else {
    let eligible = false;
    for (const uuid of new Set(payload.tokenUuids ?? [])) {
      const token = await foundry.utils.fromUuid(uuid);
      if (token?.documentName !== "Token" || (!user.isGM && token.hidden)) continue;
      const row = fearTargetRow(token);
      if (!row) continue;
      eligible = true;
      if (targets.has(row.actorUuid)) continue;
      targets.set(row.actorUuid,row);
      changed = true;
    }
    if (!eligible) return {status:"ineligibleTarget"};
  }
  if (!changed) return {status:"unchanged"};
  const rows = [...targets.values()];
  const html = await renderTemplate("systems/trudvang-chronicles/templates/chat/fear-targets.hbs",{total,targets:rows});
  await message.update({content:message.content.replace(fearTargetsSection,() => html),[`flags.${SYSTEM_ID}.fearTargets`]:rows});
  return {status:"updated"};
}

async function applyFearBatchOnGM(payload) {
  const message = game.messages.get(payload.messageId), user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message,user)) return {status:"unavailable"};
  if (message.getFlag(SYSTEM_ID,"fearBatchApplied")) return {status:"alreadyApplied"};
  const context = message.getFlag(SYSTEM_ID,"fearContext");
  if (!canManageFearTargets(message,user) || !context?.grouped
      || !fearTargetsSection.test(message.content) || sourceAmount(message,"fear") === null) return {status:"unavailable"};
  // Two clients can finish the fear-roll dialog for the same casting concurrently.
  // Only the first card that writes fear may finish that casting.
  if (context.originMessageId && Array.from(game.messages.values()).some(card =>
    card.id !== message.id && card.getFlag(SYSTEM_ID,"fearContext")?.grouped
    && card.getFlag(SYSTEM_ID,"fearContext").originMessageId === context.originMessageId
    && (card.getFlag(SYSTEM_ID,"fearBatchApplied") || rowsFor(card).some(row=>row.channel==="fear")))) return {status:"alreadyApplied"};
  const targets = message.getFlag(SYSTEM_ID,"fearTargets") ?? [];
  for (const target of targets) {
    if (hasChatApplication(message,target.actorUuid,"fear")) continue;
    const actor = await foundry.utils.fromUuid(target.actorUuid);
    if (!actor) continue;
    const result = await applyOnGM({...payload,channel:"fear",actorUuid:target.actorUuid,tokenUuid:target.tokenUuid},{grouped:true});
    if (!["applied","alreadyApplied"].includes(result.status)) return {status:"unavailable"};
  }
  const content = message.content.replace('data-action="apply-fear-batch"','data-action="apply-fear-batch" data-fear-batch-applied');
  await message.update({content,[`flags.${SYSTEM_ID}.fearBatchApplied`]:true});
  return {status:"applied"};
}

async function addDamageTargetsOnGM(payload) {
  const message = game.messages.get(payload.messageId), user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message, user)) return {status: "unavailable"};
  const total = sourceAmount(message, "body");
  if(message.getFlag(SYSTEM_ID,'damageContext')?.boundActorUuid)return {status:'unavailable'};
  if (total === null || !damageTargetsSection.test(message.content)) return {status: "unavailable"};
  const targets = [...(message.getFlag(SYSTEM_ID, "damageTargets") ?? [])];
  const seen = new Set(targets.map(target => target.actorUuid));
  let added = 0;
  for (const uuid of new Set(payload.tokenUuids ?? [])) {
    const token = await foundry.utils.fromUuid(uuid);
    if (token?.documentName !== "Token" || !["character", "npc"].includes(token.actor?.type)
      || !token.actor.testUserPermission(user, "OWNER")) continue;
    const [target] = prepareDamageTargets([token]);
    if (!target || seen.has(target.actorUuid)) continue;
    targets.push(target); seen.add(target.actorUuid); added++;
  }
  if (!added) return {status: "unchanged", added: 0};
  await updateDamageTargets(message, total, targets);
  return {status: "added", added};
}

async function updateDamageTargets(message, total, targets) {
  const html = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-targets.hbs", {total, targets});
  await message.update({content: message.content.replace(damageTargetsSection, () => html), [`flags.${SYSTEM_ID}.damageTargets`]: targets});
}

async function removeDamageTargetOnGM(payload) {
  const message = game.messages.get(payload.messageId), user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message, user)) return {status: "unavailable"};
  const total = sourceAmount(message, "body");
  if (total === null || !damageTargetsSection.test(message.content)) return {status: "unavailable"};
  const targets = message.getFlag(SYSTEM_ID, "damageTargets") ?? [];
  if (!targets.some(target => target.actorUuid === payload.actorUuid)) return {status: "unchanged", removed: 0};
  // The GM/card author can remove any listed target, including a deleted token.
  // Other readers may remove only targets whose actor they control.
  if (!user.isGM && authorId(message) !== user.id) {
    const actor = await foundry.utils.fromUuid(payload.actorUuid);
    if (!actor?.testUserPermission(user, "OWNER")) return {status: "unavailable"};
  }
  const remaining = targets.filter(target => target.actorUuid !== payload.actorUuid);
  // Retain application records: removing/re-adding a target must never undo
  // damage or make the same roll applicable twice.
  await updateDamageTargets(message, total, remaining);
  return {status: "removed", removed: targets.length - remaining.length};
}

async function reserveFearRecipient(message,actor){
 const context=message.getFlag(SYSTEM_ID,'fearContext'),definition=POWER_DETAILS_BY_ID[context?.sourceId]?.fearRoll;
 if(!definition?.targetLimitOptionId)return null;
 const origin=context.originMessageId?game.messages.get(context.originMessageId):message;
 const casting=context.originMessageId?origin?.getFlag(SYSTEM_ID,'ruleTestContext'):context.casting;
 if(!origin||casting?.sourceId!==context.sourceId||casting?.casterUuid!==context.casterUuid)return {status:'unavailable'};
 const records=origin.getFlag(SYSTEM_ID,'fearRecipients')??[],existing=records.find(row=>row.actorUuid===actor.uuid);
 if(existing)return existing.cardId===message.id?null:{status:'alreadyApplied'};
 const option=definition.targetLimitOptionId,index=POWER_DETAILS_BY_ID[context.sourceId].powerLevels.findIndex(row=>row.id===option);
 const extra=Math.max(0,Math.trunc(Number(casting.countsById?.[option]??casting.counts?.[index])||0));
 if(records.length>=1+extra||!context.baseOnly&&records.some(row=>!row.baseOnly))return {status:'targetLimit'};
 const entry={actorUuid:actor.uuid,cardId:message.id,baseOnly:Boolean(context.baseOnly)};
 await origin.update({[`flags.${SYSTEM_ID}.fearRecipients`]:[...records,entry]});
 return {rollback:()=>origin.update({[`flags.${SYSTEM_ID}.fearRecipients`]:records})};
}

async function applyOnGM(payload,{grouped=false}={}) {
  const message = game.messages.get(payload.messageId);
  const user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !["body", "fear", "defense"].includes(payload.channel)) return {status: "unavailable"};
  if (!canReadMessage(message, user)) return {status: "unavailable"};
  let amount = sourceAmount(message, payload.channel);
  if (amount === null) return {status: "unavailable"};
  const actor = await foundry.utils.fromUuid(payload.actorUuid);
  if (!actor?.isOwner || !["character", "npc"].includes(actor.type)
    || (!grouped && !actor.testUserPermission(user, "OWNER"))) return {status: "unavailable"};
  let fearAdjustment=null;
  if(payload.channel==="fear"){
   const context=message.getFlag(SYSTEM_ID,'fearContext');
   if(context?.grouped&&!grouped)return {status:'unavailable'};
   if(!canReceiveFear(message,actor))return {status:'ineligibleTarget'};
   const result=message.getFlag(SYSTEM_ID,'fearResistanceResults')?.find(row=>row.actorUuid===actor.uuid);
   if(context?.resistance&&!result&&!actor.transformationProfile?.ignoreFear&&!actor.transformationProfile?.ignoreFearGain)return {status:'resistanceRequired'};
   if(context?.profile){
    fearAdjustment=adjustedFearFactor(actor,context,{success:result?.success===true});
    if(!fearAdjustment)return {status:'unavailable'};
    amount=fearAdjustment.amount;
   }
  }
  if(payload.channel!=="fear"){
    let applicationFactor=1;
    const context=message.getFlag(SYSTEM_ID,'damageContext')??{};
    if(context.boundActorUuid&&context.boundActorUuid!==actor.uuid)return {status:'ineligibleTarget'};
    if(context.boundActorUuid&&payload.channel==='defense')return {status:'ineligibleTarget'};
    const lock=resistanceLocks.get(`${message.id}:${actor.uuid}`);
    if(lock&&lock.until>Date.now())return {status:'resistancePending'};
    const resolution=message.getFlag(SYSTEM_ID,'damageResistanceResults')?.find(row=>row.actorUuid===actor.uuid);
    if(context.resistance&&resolution)applicationFactor*=resolution.success?context.resistance.successFactor:context.resistance.failureFactor??1;
    if(payload.variant){
      const variant=context.alternatives?.find(row=>row.id===payload.variant);
      if(!variant)return {status:'unavailable'};
      applicationFactor*=variant.factor;
    }
    if(!damageCanAffect(actor,message.getFlag(SYSTEM_ID,"damageContext")?.targetTags))return {status:"ineligibleTarget"};
    const rows=message.getFlag(SYSTEM_ID,"conditionalDamage")??[];
    const bonus=conditionalDamageBonus(rows,actor);
    const before=Number(message.getFlag(SYSTEM_ID,"conditionalDamageBeforeRange"));
    amount=message.getFlag(SYSTEM_ID,"conditionalDamageLongRange")&&Number.isFinite(before)?Math.ceil((before+bonus)/2):amount+bonus;
    amount=Math.ceil(amount*applicationFactor);
  }
  let item = null;
  if (payload.channel === "body" && !String(message.content).includes(`data-target-actor-uuid="${actor.uuid}"`)) return {status: "unavailable"};
  if (payload.channel === "defense") {
    item = await foundry.utils.fromUuid(payload.itemUuid);
    if (!item?.isOwner || !["weapon", "shield"].includes(item.type) || item.parent?.uuid !== actor.uuid
      || !String(message.content).includes(`data-target-item-uuid="${item.uuid}"`)) return {status: "unavailable"};
  }
  if (hasChatApplication(message, actor.uuid, payload.channel, item?.uuid)) return {status: "alreadyApplied"};
  // Retain an applied result until the source update succeeds. A retry after a
  // chat/network failure must record the row, not take the points a second time.
  const pending = unrecorded.get(message.id) ?? [];
  let appliedRow = pending.find(row => row.actorUuid === actor.uuid && row.channel === payload.channel
    && (payload.channel !== "defense" || row.itemUuid === item?.uuid));
  if (!appliedRow) {
    const reservation=payload.channel==='fear'?await reserveFearRecipient(message,actor):null;
    if(reservation?.status)return reservation;
    let result;
    try{result = payload.channel === "fear" ? (fearAdjustment?.profile.dice===0?{applied:0}:await actor.applyFearFactor(amount, {announce: false}))
      : payload.channel === "defense" ? await applyDamageToDefenseItem({item, damage: amount,qualification:message.getFlag(SYSTEM_ID,"damageContext")?.qualification})
        : await applyDamageToActor({actor, damage: amount, components:message.getFlag(SYSTEM_ID,"damageContext")?.components, ignoreArmor: payload.ignoreArmor === true, qualification: message.getFlag(SYSTEM_ID,"damageContext")?.qualification, usage: message.getFlag(SYSTEM_ID,"damageContext")?.usage??"", magicalWeapon: message.getFlag(SYSTEM_ID,"damageContext")?.magicalWeapon===true, minimumAfterArmor:Number(message.getFlag(SYSTEM_ID,"damageContext")?.minimumAfterArmor)||0, announce: false});
    }catch(error){if(reservation?.rollback)await reservation.rollback();throw error;}
    if(!result&&reservation?.rollback)await reservation.rollback();
    if (!result) return {status: "unavailable"};
    appliedRow = {actorUuid: actor.uuid, tokenUuid: "", name: actor.name, channel: payload.channel,
      itemUuid: item?.uuid ?? "", itemName: item?.name ?? "",
      calculation: payload.channel === "body" ? [game.i18n.format("TRUDVANG.Damage.Application",{before:amount,after:result.bodyDamage,temporary:result.temporaryDamage??0}),
        ...(result.armorDamage??[]).map(row=>game.i18n.format("TRUDVANG.Damage.ArmorApplied",{name:row.item.name??"",protection:row.protection})),
        ...(result.resistances??[]).map(row=>`${row.source} ×${row.factor}`)].join(" · ") : "",
      ...(payload.channel==='fear'&&fearAdjustment?{calculation:game.i18n.format('TRUDVANG.MagicFear.ProtectedFactor',{factor:fearAdjustment.profile.dice?`${fearAdjustment.profile.dice}d${fearAdjustment.profile.faces}${fearAdjustment.profile.threshold?' '+game.i18n.localize('TRUDVANG.Field.OpenRollShort')+' '+fearAdjustment.profile.threshold:''}${fearAdjustment.profile.modifier?' + '+fearAdjustment.profile.modifier:''}`:'0',amount:fearAdjustment.amount})}:{}),
      impactDamage:Number(result.bodyDamage??0)+Number(result.temporaryDamage??0),amount: Number(result.applied ?? result.integrityLoss ?? result.bodyDamage), ignoreArmor: payload.ignoreArmor === true};
    pending.push(appliedRow); unrecorded.set(message.id, pending);
    const token = payload.tokenUuid ? await foundry.utils.fromUuid(payload.tokenUuid) : actor.token;
    if (token?.documentName === "Token" && token.actor?.uuid === actor.uuid) {
      appliedRow.tokenUuid = token.uuid; appliedRow.name = token.name || actor.name;
    }
  }
  if(payload.channel==='body')await applyWeaponDamageEffects(message,actor,appliedRow);
  const rows = [...rowsFor(message), ...pending.filter(row => !hasChatApplication(message, row.actorUuid, row.channel, row.itemUuid))];
  await refreshApplications(message,rows);
  unrecorded.delete(message.id);
  return {status: "applied", amount: appliedRow.amount};
}

async function damageResistanceOnGM(payload){
 const message=game.messages.get(payload.messageId),user=game.users.get(payload.userId);
 if(!game.user.isGM||!message||!user?.active||!canReadMessage(message,user))return {status:'unavailable'};
 const fear=payload.type==='chatFearResistance',resultKey=fear?'fearResistanceResults':'damageResistanceResults';
 const context=message.getFlag(SYSTEM_ID,fear?'fearContext':'damageContext'),actor=await foundry.utils.fromUuid(payload.actorUuid);
 if(!context?.resistance||(!fear&&context.boundActorUuid!==actor?.uuid)||!actor?.testUserPermission(user,'OWNER')||(fear?!canReceiveFear(message,actor)||hasChatApplication(message,actor.uuid,'fear'):!['presence','consequence'].includes(context.resistance.scope)&&hasChatApplication(message,actor.uuid,'body')))return {status:'unavailable'};
 const existing=message.getFlag(SYSTEM_ID,resultKey)?.find(row=>row.actorUuid===actor.uuid);
 if(existing)return {status:'alreadyRolled'};
 const key=`${message.id}:${actor.uuid}`,lock=resistanceLocks.get(key);
 if(payload.action==='begin'){
  if(lock&&lock.until>Date.now())return {status:'resistancePending'};
  const token=crypto.randomUUID();resistanceLocks.set(key,{token,userId:user.id,until:Date.now()+300000});return {status:'reserved',token,proofId:message.getFlag(SYSTEM_ID,'damageOutcomePlan')?.proofId};
 }
 if(!lock||lock.userId!==user.id||lock.token!==payload.token)return {status:'unavailable'};
 if(payload.action==='cancel'){resistanceLocks.delete(key);return {status:'cancelled'};}
 let proof=game.messages.get(payload.proofId),flags=proof?.flags?.[SYSTEM_ID],inlineRoll=null;
 if(fear&&payload.roll){
  try{inlineRoll=Roll.fromData(payload.roll);}catch{return {status:'unavailable'};}
  const die=Number(inlineRoll.total),target=Number(payload.target);
  if(inlineRoll.formula!=='1d20'||!Number.isInteger(die)||die<1||die>20||!Number.isFinite(target))return {status:'unavailable'};
  flags={damageResistanceFor:{messageId:message.id,actorUuid:actor.uuid},rollOutcome:{...resolveRollUnderOutcome(die,target),result:die,target}};
  proof={id:message.id,author:user,flags:{[SYSTEM_ID]:flags}};
 }
 if(message.getFlag(SYSTEM_ID,'damageOutcomePlan')&&message.getFlag(SYSTEM_ID,'damageOutcomePlan').proofId!==proof?.id)return {status:'unavailable'};
 const resume=message.getFlag(SYSTEM_ID,'damageOutcomePlan')?.proofId===proof?.id;
 if((authorId(proof)!==user.id&&!resume)||flags?.damageResistanceFor?.messageId!==message.id||flags.damageResistanceFor.actorUuid!==actor.uuid||typeof flags.rollOutcome?.success!=='boolean')return {status:'unavailable'};
 if(context.resistance.outcomes){const {applyDamageOutcome}=await import('./damage-outcomes.mjs');await applyDamageOutcome({message,actor,success:flags.rollOutcome.success,proofId:proof.id});}
 const results=[...(message.getFlag(SYSTEM_ID,resultKey)??[]),{actorUuid:actor.uuid,success:flags.rollOutcome.success,proofId:proof.id,...(fear?{name:actor.name,outcome:structuredClone(flags.rollOutcome)}:{})}];
 const outcomeLabel=context.resistance.outcomes?.[flags.rollOutcome.success?'success':'failure']?.labelKey;
 const label=game.i18n.localize(outcomeLabel??(context.resistance.scope==='presence'
  ? flags.rollOutcome.success?'TRUDVANG.PersistentDamage.Stay':'TRUDVANG.PersistentDamage.Flee'
  : flags.rollOutcome.success?'TRUDVANG.PersistentDamage.Resisted':'TRUDVANG.PersistentDamage.NotResisted'));
 if(fear){
  const previous=String(message.content),section=/<section data-fear-resistance-results>[\s\S]*?<\/section>/;
  const html=pendingFearResults(results,rowsFor(message));
  await message.update({content:section.test(previous)?previous.replace(section,()=>html):previous.replace(/<\/article>\s*$/,html+'</article>'),...(inlineRoll?{rolls:[...(message.rolls??[]),inlineRoll],'flags.dice-so-nice.skip':true}:{}),[`flags.${SYSTEM_ID}.${resultKey}`]:results});
 }else{
 await message.update({content:String(message.content).replace(/(<span\b[^>]*data-damage-resistance-result[^>]*>)[\s\S]*?<\/span>/,(_,open)=>`${open}<strong class="test-outcome ${flags.rollOutcome.success?'success':'failure'}">${escapeHtml(rollOutcomeText(flags.rollOutcome,key=>game.i18n.localize(key)))}</strong> — ${escapeHtml(label)}</span>`).replace(/(<button\b[^>]*data-action="resist-damage"[^>]*)(>)/,'$1 disabled$2'),[`flags.${SYSTEM_ID}.damageResistanceResults`]:results});
 }
 resistanceLocks.delete(key);
 if(context.resistance.scope==='continuation'&&((flags.rollOutcome.success&&context.resistance.successEndsEffect)||(!flags.rollOutcome.success&&context.resistance.failureEndsEffect))){
  const effect=await foundry.utils.fromUuid(context.sourceEffectUuid);if(effect?.parent?.uuid===actor.uuid)await effect.delete();
 }
 return {status:'resolved'};
}

/** One writer per source card serializes simultaneous clients: no lost rows and
 * no second application when the same actor's owners click at the same time.
 */
export async function applyChatApplication(payload) {
  const queueKey=game.messages.get(payload.messageId)?.getFlag(SYSTEM_ID,"fearContext")?.originMessageId||payload.messageId;
  const previous = queues.get(queueKey) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => payload.type === "chatDamageTargets" ? addDamageTargetsOnGM(payload)
    : payload.type === "chatApplyFearBatch" ? applyFearBatchOnGM(payload)
    : payload.type === "chatApplyFatalVitnerArea" ? applyFatalVitnerAreaOnGM(payload)
    : ["chatAddFearTargets","chatRemoveFearTarget"].includes(payload.type) ? editFearTargetsOnGM(payload)
    : payload.type==='chatImpactTest'?resolveImpactTest(payload,{refresh:refreshApplications,canReadMessage}):payload.type === "chatRemoveDamageTarget" ? removeDamageTargetOnGM(payload) : ['chatDamageResistance','chatFearResistance'].includes(payload.type)?damageResistanceOnGM(payload):applyOnGM(payload));
  queues.set(queueKey, next);
  try { return await next; }
  finally { if (queues.get(queueKey) === next) queues.delete(queueKey); }
}

export function registerChatApplicationSocket() {
  if (registered || !game.socket) return;
  registered = true;
  const prepare = message => {
    const result = message?.getFlag?.(SYSTEM_ID, "fatalMagicResult");
    if (!fatalMagicHasArea(FATAL_MAGIC_ROWS[result?.row]) || result.applied || !result.tokenUuid
        || !game.user.isGM || responderFor(message)?.id !== game.user.id) return;
    void applyChatApplication({type: "chatApplyFatalVitnerArea", prepareOnly: true,
      messageId: message.id, userId: authorId(message)}).catch(error => console.error("Trudvang | Fatal area preview failed", error));
  };
  const restorePreviews = () => {
    if (game.user.isGM) for (const message of game.messages?.values?.() ?? []) prepare(message);
    if (game.users?.activeGM?.id === game.user.id) {
      void cleanupFatalVitnerPreviews().catch(error => console.error("Trudvang | Fatal area cleanup failed", error));
    }
  };
  globalThis.Hooks?.on("createChatMessage", prepare);
  globalThis.Hooks?.on("updateUser", restorePreviews);
  globalThis.Hooks?.on("deleteChatMessage", message => {
    if (game.users?.activeGM?.id === game.user.id && message.getFlag(SYSTEM_ID, "fatalMagicResult")?.tokenUuid) {
      void (message.getFlag(SYSTEM_ID, "fatalMagicResult")?.preview
        ? clearFatalVitnerPreview(message) : cleanupFatalVitnerPreviews())
        .catch(error => console.error("Trudvang | Fatal area cleanup failed", error));
    }
  });
  restorePreviews();
  game.socket.on(SOCKET_CHANNEL, async payload => {
    if (payload?.type === "chatApplicationReply" && payload.userId === game.user.id) {
      const pending = replies.get(payload.requestId);
      if (!pending) return;
      clearTimeout(pending.timeout); replies.delete(payload.requestId); pending.resolve(payload.result);
      return;
    }
    if (!["chatApplication", "chatDamageTargets", "chatRemoveDamageTarget", "chatDamageResistance", "chatFearResistance","chatImpactTest","chatAddFearTargets","chatRemoveFearTarget","chatApplyFearBatch","chatApplyFatalVitnerArea"].includes(payload?.type) || !game.user.isGM
      || responderFor(game.messages.get(payload.messageId))?.id !== game.user.id) return;
    let result;
    try { result = await applyChatApplication(payload); }
    catch (error) { console.error("Trudvang | Chat application failed", error); result = {status: "unavailable"}; }
    game.socket.emit(SOCKET_CHANNEL, {type: "chatApplicationReply", requestId: payload.requestId, userId: payload.userId, result});
  });
}

export async function requestChatApplication({message, actor, token, channel, itemUuid = "", ignoreArmor = false,variant=""}) {
  if (!actor?.isOwner) return {status: "unavailable"};
  if(channel!=="fear"&&!damageCanAffect(actor,message.getFlag(SYSTEM_ID,"damageContext")?.targetTags))return {status:"ineligibleTarget"};
  if (hasChatApplication(message, actor.uuid, channel, itemUuid)) return {status: "alreadyApplied"};
  if(channel==='fear'){
   const context=message.getFlag(SYSTEM_ID,'fearContext');
   if(!canReceiveFear(message,actor))return {status:'ineligibleTarget'};
   if(context?.resistance&&!message.getFlag(SYSTEM_ID,'fearResistanceResults')?.some(row=>row.actorUuid===actor.uuid)&&!actor.transformationProfile?.ignoreFear&&!actor.transformationProfile?.ignoreFearGain)return requestFearResistance({message,actor,token});
  }
  const payload = {type: "chatApplication", requestId: crypto.randomUUID(), messageId: message.id,
    userId: game.user.id, actorUuid: actor.uuid, tokenUuid: token?.document?.uuid ?? token?.uuid ?? actor.token?.uuid ?? "",
    channel, itemUuid, ignoreArmor,variant};
  return requestChatUpdate(message, payload);
}

export async function requestFearResistance({message,actor,token}){
 if(!actor?.isOwner)return {status:'unavailable'};
 const context=message.getFlag(SYSTEM_ID,'fearContext');
 const payload={type:'chatFearResistance',messageId:message.id,userId:game.user.id,actorUuid:actor.uuid};
 const begin=await requestChatUpdate(message,{...payload,action:'begin'});
 if(begin.status==='alreadyRolled')return requestChatApplication({message,actor,token,channel:'fear'});
 if(begin.status!=='reserved')return begin;
 try{
  const {rollConfiguredTraitSituation}=await import('./dice.mjs');
  let resolution;
  const publishMessage=async(data,outcome)=>{
   resolution=await requestChatUpdate(message,{...payload,action:'finish',token:begin.token,roll:data.rolls[0].toJSON(),target:outcome.target});
   if(!['resolved','alreadyRolled'].includes(resolution.status))throw Error(game.i18n.localize('TRUDVANG.ChatApplication.Unavailable'));
   return {message,animate:resolution.status==='resolved'};
  };
  const result=await rollConfiguredTraitSituation({actor,reactive:true,test:context.resistance.test,sourceName:context.resistance.sourceName+' — '+actor.name,resistanceContext:context.resistance.casting,publishMessage});
  if(!result)return {status:'cancelled'};
  return requestChatApplication({message,actor,token,channel:'fear'});
 }finally{await requestChatUpdate(message,{...payload,action:'cancel',token:begin.token});}
}

export async function requestDamageResistance({message,actor}){
 if(!actor?.isOwner)return {status:'unavailable'};
 const context=message.getFlag(SYSTEM_ID,'damageContext');
 const payload={type:'chatDamageResistance',messageId:message.id,userId:game.user.id,actorUuid:actor.uuid};
 const begin=await requestChatUpdate(message,{...payload,action:'begin'});
 if(begin.status!=='reserved')return begin;
 try{
  const resistance=context.resistance;
  let result=begin.proofId?{messageId:begin.proofId}:null;
  if(!result){const {rollConfiguredTraitSituation}=await import('./dice.mjs');result=await rollConfiguredTraitSituation({actor,reactive:resistance.scope!=='presence',test:resistance.test,sourceName:resistance.sourceName,damageResistanceFor:{messageId:message.id,actorUuid:actor.uuid},resistedEffectUuid:context.sourceEffectUuid??"",resistanceContext:resistance.casting});}
  if(!result)return {status:'cancelled'};
  const response=await requestChatUpdate(message,{...payload,action:'finish',token:begin.token,proofId:result.messageId});
  if(response.status==='resolved'&&!context.alternatives?.length)return requestChatApplication({message,actor,channel:'body'});
  return response;
 }finally{await requestChatUpdate(message,{...payload,action:'cancel',token:begin.token});}
}

export async function requestDamageTargets({message, tokens}) {
  const tokenUuids = Array.from(tokens ?? []).filter(token => token.actor?.isOwner)
    .map(token => token.document?.uuid ?? token.uuid).filter(Boolean);
  if (!tokenUuids.length) return {status: "unavailable"};
  return requestChatUpdate(message, {type: "chatDamageTargets", requestId: crypto.randomUUID(),
    messageId: message.id, userId: game.user.id, tokenUuids});
}

export async function requestDamageTargetRemoval({message, actorUuid}) {
  if (!actorUuid) return {status: "unavailable"};
  return requestChatUpdate(message, {type: "chatRemoveDamageTarget", requestId: crypto.randomUUID(),
    messageId: message.id, userId: game.user.id, actorUuid});
}

export async function requestFearTargetEdit({message, tokens, actorUuid}) {
  if (!canManageFearTargets(message,game.user)) return {status:"unavailable"};
  const tokenUuids = Array.from(tokens ?? [], token => token.document?.uuid ?? token.uuid).filter(Boolean);
  return requestChatUpdate(message,{type:actorUuid?"chatRemoveFearTarget":"chatAddFearTargets",
    requestId:crypto.randomUUID(),messageId:message.id,userId:game.user.id,actorUuid,tokenUuids});
}

export async function requestFearBatch(message) {
  if (!canManageFearTargets(message,game.user)) return {status:"unavailable"};
  return requestChatUpdate(message,{type:"chatApplyFearBatch",requestId:crypto.randomUUID(),messageId:message.id,userId:game.user.id});
}

export function requestFatalVitnerArea(message, {prepareOnly = false} = {}) {
  return requestChatUpdate(message, {type: "chatApplyFatalVitnerArea", requestId: crypto.randomUUID(), messageId: message.id, userId: game.user.id, prepareOnly});
}

async function requestChatUpdate(message, payload) {
  const responder = responderFor(message);
  if (!responder || (responder.id !== game.user.id && !game.socket)) return {status: "unavailable"};
  if (responder.id === game.user.id) return applyChatApplication(payload);
  return new Promise(resolve => {
    const timeout = setTimeout(() => { replies.delete(payload.requestId); resolve({status: "unavailable"}); }, 30000);
    replies.set(payload.requestId, {resolve, timeout});
    game.socket.emit(SOCKET_CHANNEL, payload);
  });
}

async function refreshApplications(message,rows,{rolls=[]}={}){
  const html = await renderTemplate("systems/trudvang-chronicles/templates/chat/application-results.hbs", {
    rows: rows.map(row => {
      const resistance=row.channel==='fear'?message.getFlag(SYSTEM_ID,'fearResistanceResults')?.find(r=>r.actorUuid===row.actorUuid):null;
      return {...row,actorUuid:row.actorUuid,impactPending:row.channel==='body'&&message.getFlag(SYSTEM_ID,'damageContext')?.impact?.kind==='windKnockback'&&!row.impact?.resolved,impactText:impactResultText(row),...(resistance?{outcomeText:rollOutcomeText(resistance.outcome??{},key=>game.i18n.localize(key)),outcomeClass:resistance.success?'success':'failure'}:{}),
      label: row.channel === "defense" ? game.i18n.format("TRUDVANG.ChatApplication.DefenseName", {actor: row.name, item: row.itemName}) : row.name,
      icon: row.channel === "fear" ? "fa-face-grimace" : row.channel === "defense" ? "fa-shield" : "fa-heart-crack",
      result: game.i18n.format(`TRUDVANG.ChatApplication.${row.channel === "fear" ? "Fear" : row.channel === "defense" ? "Integrity" : "Body"}Amount`, {amount: row.amount})};})
  });
  const original = String(message.content);
  const section = /<section\b[^>]*\bdata-application-results(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/;
  let content = section.test(original) ? original.replace(section, () => html)
    : /<\/article>\s*$/.test(original) ? original.replace(/<\/article>(\s*)$/, () => `${html}</article>`) : `${original}${html}`;
  if(message.getFlag(SYSTEM_ID,'fearResistanceResults'))content=content.replace(/<section data-fear-resistance-results>[\s\S]*?<\/section>/,()=>pendingFearResults(message.getFlag(SYSTEM_ID,'fearResistanceResults'),rows));
  await message.update({content, [`flags.${SYSTEM_ID}.applications`]: rows,...(rolls.length?{rolls:[...message.rolls??[],...rolls],'flags.dice-so-nice.skip':true}:{})});
  for(const roll of rolls)await game.dice3d?.showForRoll?.(roll,game.user,true);

}

export const requestDamageImpact=({message,actor})=>requestImpactTest({message,actor,request:requestChatUpdate});
