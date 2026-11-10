import {consumeInventoryItem,isConsumable} from './consumables.mjs';
import {promptExtractStageRoll} from './extract-roll.mjs';
import {TRUDVANG} from './config.mjs';
const CHANNEL='system.trudvang-chronicles',jobs=new Map(),replies=new Map();let registered=false;
export function canConsumeSharedItem(item,user=game.user){
 return Boolean(isConsumable(item)&&item.actor&&!item.inCompendium&&(user?.isGM||item.actor.canUserModify?.(user,'update')));
}
export async function consumeSharedItemOnGM(payload,{local=false}={}){
 if(!local&&!game.users?.activeGM?.isSelf)return {status:'unavailable'};
 const previous=jobs.get(payload.itemUuid)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const item=await foundry.utils.fromUuid(payload.itemUuid),target=await foundry.utils.fromUuid(payload.targetUuid),user=game.users?.get(payload.userId);
  if(!user?.active||!canConsumeSharedItem(item,user))return {status:'denied'};
  if(target?.documentName!=='Actor'||target.inCompendium)return {status:'unavailable'};
  if(local&&(!item.actor.isOwner||!target.isOwner))return {status:'noGM'};
  if(item.type==='potion'&&!Object.hasOwn(TRUDVANG.traits,payload.traitKey))return {status:'denied'};
  const used=await consumeInventoryItem(item,target,{inventoryActor:item.actor,extractChoice:item.type==='potion'?{traitKey:payload.traitKey}:null});
  return {status:used?'ok':'unavailable'};
 });
 jobs.set(payload.itemUuid,job);try{return await job;}finally{if(jobs.get(payload.itemUuid)===job)jobs.delete(payload.itemUuid);}
}
export async function requestSharedConsumption(item){
 if(!canConsumeSharedItem(item))return null;
 const tokens=game.user.targets?.size?game.user.targets:globalThis.canvas?.tokens?.controlled??[];
 const targets=[...new Map(Array.from(tokens,t=>t.actor).filter(Boolean).map(a=>[a.uuid,a])).values()];
 if(!targets.length){ui.notifications.warn(game.i18n.localize('TRUDVANG.Warning.NoEffectTarget'));return null;}
 for(const target of targets){
  let traitKey;
  if(item.type==='potion'){
   const choice=await promptExtractStageRoll({actor:target,strength:Number(item.system.strength||0),title:game.i18n.format('TRUDVANG.Extract.UseTitle',{item:item.name,actor:target.name}),prompt:game.i18n.format('TRUDVANG.Extract.UsePrompt',{strength:Number(item.system.strength||0)})});
   if(!choice)break;traitKey=choice.traitKey;
  }
  const payload={type:'sharedConsumption',requestId:crypto.randomUUID(),userId:game.user.id,itemUuid:item.uuid,targetUuid:target.uuid,traitKey};
  let result;
  if(game.users?.activeGM?.isSelf)result=await consumeSharedItemOnGM(payload);
  else if(!game.users?.activeGM)result=await consumeSharedItemOnGM(payload,{local:true});
  else if(!game.socket)result={status:'unavailable'};
  else{
   registerSharedConsumptionSocket();
   result=await new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:'unavailable'});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(CHANNEL,payload);});
  }
  if(result.status!=='ok'){ui.notifications.warn(game.i18n.localize(`TRUDVANG.InventoryTransfer.${result.status}`));return result;}
 }
}
export function registerSharedConsumptionSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(CHANNEL,async payload=>{
  if(payload?.type==='sharedConsumptionReply'&&payload.userId===game.user.id){const pending=replies.get(payload.requestId);if(pending){clearTimeout(pending.timer);replies.delete(payload.requestId);pending.resolve(payload.result);}return;}
  if(payload?.type!=='sharedConsumption'||!game.users?.activeGM?.isSelf)return;
  let result;try{result=await consumeSharedItemOnGM(payload);}catch(error){console.error('Trudvang | Shared consumption failed',error);result={status:'failed'};}
  game.socket.emit(CHANNEL,{type:'sharedConsumptionReply',requestId:payload.requestId,userId:payload.userId,result});
 });
}
