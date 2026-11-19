import {auraColor} from './aura.mjs';

const SYSTEM_ID = 'trudvang-chronicles';
const previews = new Map();

function clearPreview(id) {
 const graphics = previews.get(id);
 if (graphics && !graphics.destroyed) graphics.destroy();
 previews.delete(id);
}

function scope(message) {
 const flags = message.flags?.[SYSTEM_ID];
 return flags?.magicFearArea ? message.id : flags?.fearContext?.areaSceneId ? flags.fearContext.originMessageId : null;
}

export function showMagicFearPreview(message, {deletedId} = {}) {
 const id = scope(message);
 if (!id) return;
 clearPreview(id);
 const board = globalThis.canvas;
 const cast = id === message.id ? message : game.messages.get(id);
 const area = cast?.flags?.[SYSTEM_ID]?.magicFearArea;
 if (!area || area.expiresAt !== undefined || id === deletedId || !board?.ready || board.scene?.id !== area.sceneId
     || (area.level && board.level?.id && board.level.id !== area.level)
     || cast.visible === false || cast.isContentVisible === false) return;
 const tokens = new Map((board.tokens?.placeables ?? []).map(token => [token.document.uuid, token]));
 if (!game.user.isGM && cast.author?.id !== game.user.id && !tokens.get(area.casterTokenUuid)?.isVisible) return;
 const card = Array.from(game.messages?.values?.() ?? []).findLast(row => row.id !== deletedId && row.id !== id && scope(row) === id);
 const flags = card?.flags?.[SYSTEM_ID];
 const resolved = new Set([
  ...(flags?.applications ?? []).filter(row => row.channel === 'fear').map(row => row.actorUuid),
  ...(flags?.fearManualResolutions ?? [])
 ]);
 const pending = (flags?.fearTargets ?? area.targets).filter(row => !resolved.has(row.actorUuid));
 if (card && !pending.length) return;
 const graphics = new PIXI.Graphics();
 graphics.eventMode = 'none';
 const color = Number.parseInt(auraColor().slice(1), 16);
 const {x, y} = area.origin;
 graphics.lineStyle(3, color, 1).beginFill(color, .2).drawCircle(x, y, area.radiusPixels).endFill();
 graphics.lineStyle(4, color, 1);
 for (const row of pending) {
  const token = tokens.get(row.tokenUuid);
  if (!token?.isVisible || (row.hidden && !game.user.isGM)) continue;
  graphics.drawRoundedRect(token.x - 3, token.y - 3, token.w + 6, token.h + 6, 8);
 }
 board.interface.addChild(graphics);
 previews.set(id, graphics);
}

export function registerMagicFearPreview() {
 const refresh = message => showMagicFearPreview(message);
 Hooks.on('createChatMessage', refresh);
 Hooks.on('updateChatMessage', refresh);
 Hooks.on('deleteChatMessage', message => showMagicFearPreview(message,{deletedId:message.id}));
 Hooks.on('canvasReady', () => {
  for (const message of game.messages.values()) {
   if (message.flags?.[SYSTEM_ID]?.magicFearArea) refresh(message);
  }
 });
 Hooks.on('canvasTearDown', () => {
  for (const id of previews.keys()) clearPreview(id);
 });
}
