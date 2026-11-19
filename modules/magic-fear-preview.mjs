import {auraColor} from './aura.mjs';

const SYSTEM_ID = 'trudvang-chronicles';
const previews = new Map();

function clearPreview(id) {
 const preview = previews.get(id);
 if (!preview) return;
 clearTimeout(preview.timer);
 if (!preview.graphics.destroyed) preview.graphics.destroy();
 previews.delete(id);
}

export function showMagicFearPreview(message) {
 const area = message.getFlag(SYSTEM_ID, 'magicFearArea');
 const board = globalThis.canvas;
 if (!area || !board?.ready || board.scene.id !== area.sceneId || previews.has(message.id)
     || area.expiresAt <= Date.now() || (area.level && board.level?.id && board.level.id !== area.level)
     || message.visible === false || message.isContentVisible === false) return;
 const tokens = new Map(board.tokens.placeables.map(token => [token.document.uuid, token]));
 if (!game.user.isGM && message.author?.id !== game.user.id && !tokens.get(area.casterTokenUuid)?.isVisible) return;
 const graphics = new PIXI.Graphics();
 graphics.eventMode = 'none';
 const color = Number.parseInt(auraColor().slice(1), 16);
 const {x, y} = area.origin;
 graphics.lineStyle(2, color, .8).beginFill(color, .15).drawCircle(x, y, area.radiusPixels).endFill();
 graphics.lineStyle(4, color, 1);
 for (const row of area.targets) {
  const token = tokens.get(row.tokenUuid);
  if (!token?.isVisible || (row.hidden && !game.user.isGM)) continue;
  graphics.drawRoundedRect(token.x - 3, token.y - 3, token.w + 6, token.h + 6, 8);
 }
 board.interface.addChild(graphics);
 const timer = setTimeout(() => clearPreview(message.id), area.expiresAt - Date.now());
 previews.set(message.id, {graphics, timer});
}

export function registerMagicFearPreview() {
 Hooks.on('createChatMessage', showMagicFearPreview);
 Hooks.on('updateChatMessage', showMagicFearPreview);
 Hooks.on('deleteChatMessage', message => clearPreview(message.id));
 Hooks.on('canvasTearDown', () => {
  for (const id of previews.keys()) clearPreview(id);
 });
}
