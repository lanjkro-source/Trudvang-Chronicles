import {escapeHtml,escapeAttribute} from "./helpers.mjs";
import {TRANSFORMATION_TEMPLATES} from "./transformation-data.mjs";
import {currentCastingCounts} from "./rules/magic-resistance.mjs";

const SCOPE="trudvang-chronicles",CHANNEL=`system.${SCOPE}`,jobs=new Map(),replies=new Map();
let registered=false;
const authorId=message=>message?.author?.id??message?._source?.author;
const targetMap=message=>message?.flags?.[SCOPE]?.transformationTargets??{};
export function snapshotEffectTargets(tokens){
 const seen=new Set();return Array.from(tokens??[]).flatMap(token=>{
  const actor=token?.actor,doc=token.document??token,uuid=doc?.uuid;
  if(!uuid||!actor?.uuid||seen.has(actor.uuid))return [];
  seen.add(actor.uuid);return [{tokenUuid:uuid,actorUuid:actor.uuid,name:token.name||actor.name||""}];
 });
}
export function initialEffectTargets(keys,tokens){const rows=snapshotEffectTargets(tokens);return Object.fromEntries(keys.map(key=>[key,structuredClone(rows)]));}
export async function canManageEffectTargets(message,user){
 if(!message||!user)return false;
 if(user.isGM||authorId(message)===user.id)return true;
 const uuid=message.flags?.[SCOPE]?.ruleTestContext?.casterUuid;
 const caster=uuid?await foundry.utils.fromUuid(uuid):null;
 return Boolean(caster?.testUserPermission?.(user,"OWNER"));
}
export function effectTargetsFor(message,key){return Array.from(targetMap(message)[key]??[]);}
export async function updateEffectTargetsOnGM({messageId,userId,key,add=[],remove=""}){
 const message=game.messages?.get(messageId),user=game.users?.get(userId),context=message?.flags?.[SCOPE]?.ruleTestContext;
 if(!message||!user?.active||!await canManageEffectTargets(message,user)||!context||TRANSFORMATION_TEMPLATES[key]?.sourceId!==context.sourceId)return {status:"unavailable"};
 const whispers=Array.from(message.whisper??[],u=>typeof u==="string"?u:u.id);
 if(!user.isGM&&(message.blind||(whispers.length&&!whispers.includes(user.id)&&authorId(message)!==user.id)))return {status:"unavailable"};
 const map=structuredClone(targetMap(message)),rows=Array.from(map[key]??[]),seen=new Set(rows.map(row=>row.actorUuid));
 let changed=false;
 for(const uuid of new Set(add)){
  const token=await foundry.utils.fromUuid(uuid);
  if(token?.documentName!=="Token"||!token.actor?.uuid||seen.has(token.actor.uuid))continue;
  rows.push({tokenUuid:token.uuid,actorUuid:token.actor.uuid,name:token.name||token.actor.name||""});seen.add(token.actor.uuid);changed=true;
 }
 const next=remove?rows.filter(row=>row.actorUuid!==remove):rows;
 if(next.length!==rows.length)changed=true;
 if(!changed)return {status:"unchanged"};
 map[key]=next;await message.update({[`flags.${SCOPE}.transformationTargets`]:map});return {status:"updated"};
}
export async function applyEffectForCasterOnGM({messageId,userId,key,tokenUuid,sourceUuid,itemUuid="",answers}){
 const message=game.messages?.get(messageId),user=game.users?.get(userId),context=message?.flags?.[SCOPE]?.ruleTestContext;
 if(!game.users?.activeGM?.isSelf||!message||!user?.active||!await canManageEffectTargets(message,user)||!context||TRANSFORMATION_TEMPLATES[key]?.sourceId!==context.sourceId)return {status:"unavailable"};
 const caster=context.casterUuid?await foundry.utils.fromUuid(context.casterUuid):null;
 if(!caster||(!user.isGM&&!caster.testUserPermission?.(user,"OWNER")))return {status:"unavailable"};
 if(!String(message.content??"").includes(`data-transformation-key="${escapeAttribute(key)}"`)||!String(message.content??"").includes(`data-transformation-source="${escapeAttribute(sourceUuid??"")}"`))return {status:"unavailable"};
 const row=effectTargetsFor(message,key).find(target=>target.tokenUuid===tokenUuid);
 const token=row?await foundry.utils.fromUuid(tokenUuid):null;
 if(!token?.actor||token.actor.uuid!==row.actorUuid)return {status:"unavailable"};
 const item=itemUuid?await foundry.utils.fromUuid(itemUuid):null;
 if(itemUuid&&(!item||item.parent?.uuid!==token.actor.uuid))return {status:"unavailable"};
 const source=sourceUuid?await foundry.utils.fromUuid(sourceUuid):null;
 if(!source||!["spell","divineFeat"].includes(source.type)||source.system?.catalogId!==context.sourceId)return {status:"unavailable"};
 const selected=currentCastingCounts(context);
 for(const [name,value] of Object.entries(answers??{}))if(/^boost\d+$/.test(name)){
  const index=Number(name.slice(5)),count=Number(value);
  if(!Number.isInteger(count)||count<0||count>Number(selected[index]??0))return {status:"unavailable"};
 }
 const {applyTransformation}=await import("./transformations.mjs");
 const effect=await applyTransformation(token.actor,key,{source,context:{...context,messageId},counts:selected,targetName:item?.name||token.name||token.actor.name,preselectedAnswers:answers,destinationItem:item});
 return effect?{status:"applied"}:{status:"unavailable"};
}
async function queued(payload){
 const previous=jobs.get(payload.messageId)??Promise.resolve(),job=previous.catch(()=>{}).then(()=>updateEffectTargetsOnGM(payload));
 jobs.set(payload.messageId,job);try{return await job;}finally{if(jobs.get(payload.messageId)===job)jobs.delete(payload.messageId);}
}
export function registerEffectTargetSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(CHANNEL,async payload=>{
  if(payload?.type==="effectTargetReply"&&payload.userId===game.user.id){const pending=replies.get(payload.requestId);if(pending){clearTimeout(pending.timer);replies.delete(payload.requestId);pending.resolve(payload.result);}return;}
  if(payload?.type==="effectApply"&&game.users?.activeGM?.isSelf){let result;try{result=await applyEffectForCasterOnGM(payload);}catch(error){console.error("Trudvang | Effect application failed",error);result={status:"unavailable"};}game.socket.emit(CHANNEL,{type:"effectTargetReply",userId:payload.userId,requestId:payload.requestId,result});return;}
  if(payload?.type!=="effectTargetUpdate"||!game.users?.activeGM?.isSelf)return;
  let result;try{result=await queued(payload);}catch(error){console.error("Trudvang | Effect target update failed",error);result={status:"unavailable"};}
  game.socket.emit(CHANNEL,{type:"effectTargetReply",userId:payload.userId,requestId:payload.requestId,result});
 });
}
export async function requestEffectForCaster({message,key,tokenUuid,sourceUuid,itemUuid="",answers}){
 const payload={type:"effectApply",requestId:crypto.randomUUID(),messageId:message.id,userId:game.user.id,key,tokenUuid,sourceUuid,itemUuid,answers};
 if(game.users?.activeGM?.isSelf)return applyEffectForCasterOnGM(payload);
 if(!game.users?.activeGM||!game.socket)return {status:"unavailable"};
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:"unavailable"});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(CHANNEL,payload);});
}
export async function requestEffectTargetUpdate(message,key,{tokens=[],remove=""}={}){
 if(!await canManageEffectTargets(message,game.user))return {status:"unavailable"};
 const payload={type:"effectTargetUpdate",requestId:crypto.randomUUID(),messageId:message.id,userId:game.user.id,key,add:Array.from(tokens,t=>t.document?.uuid??t.uuid).filter(Boolean),remove};
 if(game.users?.activeGM?.isSelf||(!game.users?.activeGM&&authorId(message)===game.user.id))return queued(payload);
 if(!game.users?.activeGM||!game.socket)return {status:"unavailable"};
 return new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:"unavailable"});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(CHANNEL,payload);});
}
export function effectTargetListHTML(rows,{editable=false}={}){
 const t=key=>game.i18n.localize(`TRUDVANG.Transformation.${key}`);
 return `<div class="effect-target-list">${editable?`<button type="button" class="damage-target-edit" data-action="effect-target-add" title="${escapeAttribute(t("AddTargets"))}"><i class="fas fa-plus"></i></button>`:""}<ul>${rows.map(row=>`<li><span>${escapeHtml(row.name)}</span>${editable?`<button type="button" class="damage-target-edit" data-action="effect-target-remove" data-actor-uuid="${escapeAttribute(row.actorUuid)}" title="${escapeAttribute(t("RemoveTarget"))}"><i class="fas fa-minus"></i></button>`:""}</li>`).join("")}</ul></div>`;
}
