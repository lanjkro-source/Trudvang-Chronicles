import {isInventoryTransferItem,requestInventoryTransfer} from './inventory-transfer.mjs';

/** Canvas hooks are synchronous: resolve the local source before claiming a
 * drop, then reuse the same authoritative transfer as a recipient sheet. */
export function dropInventoryOnToken(canvas,data){
 if(data?.type!=='Item'||typeof data.uuid!=='string'||data.uuid.startsWith('Compendium.'))return;
 let source;try{source=foundry.utils.fromUuidSync(data.uuid);}catch{return;}
 if(!isInventoryTransferItem(source))return;
 const x=Number(data.x),y=Number(data.y);
 if(!Number.isFinite(x)||!Number.isFinite(y))return;
 const token=[...(canvas.tokens?.placeables??[])].reverse().find(token=>{
  if(!token.actor||token.visible===false||token.isVisible===false)return false;
  const bounds=token.bounds;
  return bounds&&(typeof bounds.contains==='function'?bounds.contains(x,y):x>=bounds.x&&x<=bounds.right&&y>=bounds.y&&y<=bounds.bottom);
 });
 if(!token)return;
 void requestInventoryTransfer(source,token.actor).catch(error=>{
  console.error('Trudvang | Canvas inventory transfer failed',error);
  ui.notifications.warn(game.i18n.localize('TRUDVANG.InventoryTransfer.failed'));
 });
 return false;
}
export function registerInventoryCanvasDrop(){Hooks.on('dropCanvasData',dropInventoryOnToken);}
