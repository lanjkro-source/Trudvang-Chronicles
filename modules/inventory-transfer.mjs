import {effectSource} from './rules/effect-source.mjs';
const SCOPE='trudvang-chronicles',CHANNEL=`system.${SCOPE}`,types=new Set(['weapon','armor','shield','gear','potion']);
const jobs=new Map(),replies=new Map(),active=new Set();let registered=false;
export const isInventoryTransferItem=item=>item?.documentName==='Item'&&types.has(item.type)&&(item.actor??item.parent)?.documentName==='Actor'&&!item.inCompendium&&!(item.actor??item.parent).inCompendium;
const writer=()=>Boolean(game.users?.activeGM?.isSelf);
const snapshot=item=>item.toObject(true);
function worldItems(){
 const actors=new Set(Array.from(game.actors??[]));for(const scene of game.scenes??[])for(const token of scene.tokens??[])if(token.actor)actors.add(token.actor);
 return new Set([...Array.from(game.items??[]),...[...actors].flatMap(actor=>Array.from(actor.items??[]))]);
}
async function recover(item){
 const marker=item.flags?.[SCOPE]?.inventoryTransfer;
 if(!marker?.sourceUuid||marker.sourceUuid===item.uuid)return;
 const original=await foundry.utils.fromUuid(marker.sourceUuid);
 if(original)await item.delete();else await item.update({[`flags.${SCOPE}.-=inventoryTransfer`]:null});
}
/** Permanent recovery of interrupted transfers, not a development migration. */
export async function recoverInventoryTransfers(){
 if(!writer())return;
 for(const item of worldItems())if(item.flags?.[SCOPE]?.inventoryTransfer&&!active.has(item.uuid)){
  try{await recover(item);}catch(error){console.error('Trudvang | Inventory transfer recovery failed',error);}
 }
}
async function perform({sourceItemUuid,targetActorUuid,userId,requestId},authority){
 const item=await foundry.utils.fromUuid(sourceItemUuid),target=await foundry.utils.fromUuid(targetActorUuid),user=game.users?.get(userId);
 if(!user?.active||!isInventoryTransferItem(item)||target?.documentName!=='Actor'||target.inCompendium)return {status:'unavailable'};
 const source=item.actor??item.parent;
 if(!user.isGM&&!source.canUserModify?.(user,'update'))return {status:'denied'};
 if(!authority&&!target.canUserModify?.(user,'update'))return {status:'denied'};
 if(source.uuid===target.uuid)return {status:'unchanged'};
 if(item.flags?.[SCOPE]?.inventoryTransfer||Number(item.system?.quantity??1)<=0)return {status:'unavailable'};
 const original=snapshot(item),fingerprint=JSON.stringify(original),data=structuredClone(original);
 delete data._id;delete data._stats;delete data.folder;delete data.sort;delete data.ownership;
 data.effects=Array.from(item.effects??[],effect=>effectSource(effect));
 data.system.equipped=false;
 data.flags??={};data.flags[SCOPE]??={};data.flags[SCOPE].inventoryTransfer={sourceUuid:sourceItemUuid,requestId};
 let created,removed=false;
 try{
  created=(await target.createEmbeddedDocuments('Item',[data],{keepEmbeddedIds:true}))[0];
  if(!created)throw Error('Inventory copy was not created');
  active.add(created.uuid);
  const current=await foundry.utils.fromUuid(sourceItemUuid);
  if(!current||JSON.stringify(snapshot(current))!==fingerprint)throw Error('Inventory source changed during transfer');
  await current.delete();removed=true;
  await created.update({[`flags.${SCOPE}.-=inventoryTransfer`]:null});
  return {status:'ok',itemUuid:created.uuid};
 }catch(error){
  console.error('Trudvang | Inventory transfer failed',error);
  if(created){
   try{if(removed)await created.update({[`flags.${SCOPE}.-=inventoryTransfer`]:null});else await created.delete();}
   catch(rollbackError){console.error('Trudvang | Inventory transfer pending recovery',rollbackError);return {status:'pending'};}
  }
  return removed?{status:'ok',itemUuid:created.uuid}:{status:'failed'};
 }finally{if(created)active.delete(created.uuid);}
}
async function queued(payload,authority){
 const previous=jobs.get(payload.sourceItemUuid)??Promise.resolve(),job=previous.catch(()=>{}).then(()=>perform(payload,authority));jobs.set(payload.sourceItemUuid,job);
 try{return await job;}finally{if(jobs.get(payload.sourceItemUuid)===job)jobs.delete(payload.sourceItemUuid);}
}
export async function transferInventoryItemOnGM(payload){return writer()?queued(payload,true):{status:'unavailable'};}
export async function requestInventoryTransfer(item,target){
 const payload={type:'inventoryTransfer',requestId:crypto.randomUUID(),userId:game.user.id,sourceItemUuid:item.uuid,targetActorUuid:target.uuid};
 let result;
 if(writer())result=await transferInventoryItemOnGM(payload);
 else if(!game.users?.activeGM){
  result=target.canUserModify?.(game.user,'update')?await queued(payload,false):{status:'noGM'};
 }else if(!game.socket)result={status:'unavailable'};
 else{
  registerInventoryTransferSocket();
  result=await new Promise(resolve=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);resolve({status:'unavailable'});},30000);replies.set(payload.requestId,{resolve,timer});game.socket.emit(CHANNEL,payload);});
 }
 if(!['ok','unchanged'].includes(result.status))ui.notifications.warn(game.i18n.localize(`TRUDVANG.InventoryTransfer.${result.status}`));
 return result;
}
export function registerInventoryTransferSocket(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(CHANNEL,async payload=>{
  if(payload?.type==='inventoryTransferReply'&&payload.userId===game.user.id){const pending=replies.get(payload.requestId);if(!pending)return;clearTimeout(pending.timer);replies.delete(payload.requestId);pending.resolve(payload.result);return;}
  if(payload?.type!=='inventoryTransfer'||!writer())return;
  let result;try{result=await transferInventoryItemOnGM(payload);}catch(error){console.error('Trudvang | Inventory transfer request failed',error);result={status:'failed'};}
  game.socket.emit(CHANNEL,{type:'inventoryTransferReply',requestId:payload.requestId,userId:payload.userId,result});
 });
}
