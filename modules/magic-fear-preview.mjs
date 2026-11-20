import {auraColor} from './aura.mjs';
import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {automaticFearTargets,fearAreaPolicy,fearTargetsInCircle} from './magic-fear.mjs';

const SYSTEM_ID = 'trudvang-chronicles';
const jobs = new Map();
const outlines = new Map();
const section = message => message?.flags?.[SYSTEM_ID];
const values = collection => Array.from(collection?.values?.() ?? []);
const writer = () => game.user?.isGM && game.users?.activeGM?.id === game.user.id;
const regionCastId = region => region.flags?.[SYSTEM_ID]?.magicFearCastId;

export function nativeFearTargets(area,id,{sourceId,casterUuid}={}) {
 const scene = game.scenes?.get(area.sceneId) ?? (globalThis.canvas?.scene?.id === area.sceneId ? globalThis.canvas.scene : null);
 if (!scene) return area.targets;
 const region = values(scene?.regions).find(row => regionCastId(row) === id);
 const policy = fearAreaPolicy(sourceId,casterUuid);
 const circleTargets = fearTargetsInCircle(area,scene,policy);
 if (!region) return circleTargets;
 const inCircle = new Set(circleTargets.map(row => row.tokenUuid));
 return automaticFearTargets(values(scene.tokens),policy,
  token => token.testInsideRegion?.(region) ?? inCircle.has(token.uuid));
}

function castId(message) {
 const flags = section(message);
 return flags?.magicFearArea?.nativeRegion ? message.id
  : flags?.fearContext?.areaSceneId ? flags.fearContext.originMessageId : null;
}

function previewId(message) {
 const flags = section(message);
 return (flags?.fatalMagicResult?.preview || flags?.spellZoneTest?.instantInfo) ? message.id : castId(message);
}

function pendingTargets(id, area, deletedId) {
 const cards = values(game.messages).filter(row => row.id !== id && row.id !== deletedId && castId(row) === id);
 const card = cards.find(row => section(row)?.fearBatchApplied) ?? cards.at(-1);
 const flags = section(card);
 if (!card) return {showZone:true,targets:area.targets};
 if (flags.fearContext?.grouped) return flags.fearBatchApplied
  ? {showZone:false,targets:[]} : {showZone:true,targets:flags.fearTargets ?? []};
 const applied = new Set((flags.applications ?? []).filter(row => row.channel === 'fear').map(row => row.actorUuid));
 const targets = (flags.fearTargets ?? []).filter(row => !applied.has(row.actorUuid));
 return {showZone:targets.length > 0,targets};
}

export function synchronizeMagicFearRegion(id, {deletedId} = {}) {
 if (!id || !writer()) return Promise.resolve();
 const previous = jobs.get(id) ?? Promise.resolve();
 const job = previous.catch(() => {}).then(async () => {
  if (!writer()) return;
  const cast = game.messages.get(id);
  const {magicFearArea:area,ruleTestContext:context} = section(cast) ?? {};
  const scene = game.scenes?.get(area?.sceneId);
  const showZone = id !== deletedId && area?.nativeRegion && pendingTargets(id,area,deletedId).showZone;
  const regions = (scene ? [scene] : values(game.scenes)).flatMap(s => values(s.regions))
   .filter(region => regionCastId(region) === id);
  if (!showZone) {
   for (const region of regions) if (region.parent?.regions?.get(region.id)) await region.delete();
   return;
  }
  const fear = POWER_DETAILS_BY_ID[context?.sourceId]?.fearRoll;
  if (regions.length || !scene || !fear?.area) return;
  const token = values(scene.tokens).find(row => row.uuid === area.casterTokenUuid);
  const author = cast.author;
  const result = Number(cast.rolls?.[0]?.total);
  const {x,y} = area.origin ?? {};
  if (!token?.actor || token.actor.uuid !== context.casterUuid || !author || !token.actor.testUserPermission(author,'OWNER')
      || !Number.isInteger(result) || result < 1 || result > 19 || (result !== 1 && !(result <= area.target))
      || ![x,y,area.radiusPixels].every(Number.isFinite) || area.radiusPixels <= 0) return;
  const restricted = cast.blind || cast.whisper?.length;
  const recipients = [author.id,...Array.from(cast.whisper ?? [],user => user.id ?? user)];
  const levels = area.level ? [area.level] : [];
  await scene.createEmbeddedDocuments('Region',[{
   name:game.i18n.localize('TRUDVANG.Content.Power.'+context.sourceId+'.Name'),
   color:auraColor(), highlightMode:'shapes', locked:true, levels,
   ...(fear.eligibility?.requiresHearing ? {restriction:{enabled:true,type:'sound'}} : {}),
   visibility:cast.blind ? CONST.REGION_VISIBILITY.GAMEMASTER
    : restricted ? CONST.REGION_VISIBILITY.OBSERVER : CONST.REGION_VISIBILITY.ALWAYS,
   ...(restricted ? {ownership:Object.fromEntries(recipients.map(id => [id,CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER]))} : {}),
   shapes:[{type:'circle',x,y,radius:area.radiusPixels}],
   flags:{[SYSTEM_ID]:{magicFearCastId:id}}
  }]);
 });
 jobs.set(id,job);
 return job.finally(() => {if (jobs.get(id) === job) jobs.delete(id);});
}

function clearOutlines(id) {
 const graphics = outlines.get(id);
 if (graphics && !graphics.destroyed) graphics.destroy();
 outlines.delete(id);
}

function drawTargetOutlines(id, deletedId) {
 clearOutlines(id);
 if (id === deletedId) return;
 const cast = game.messages.get(id);
 const fatal = section(cast)?.fatalMagicResult;
 const board = globalThis.canvas;
 const fire = section(cast)?.spellZoneTest;
 const fireRegion = fire?.instantInfo && values(board?.scene?.regions).find(region => region.uuid === fire.regionUuid);
 const fireArea = fireRegion ? {sceneId: board.scene.id, level: values(fireRegion.levels)[0]} : null;
 const area = fatal?.preview ?? fireArea ?? section(cast)?.magicFearArea;
 if (!area || (!area.nativeRegion && !fireArea && (!fatal?.preview || fatal.applied)) || !board?.ready || board.scene?.id !== area.sceneId
     || (area.level && board.level?.id && board.level.id !== area.level)
     || cast.visible === false || cast.isContentVisible === false) return;
 const tokens = new Map((board.tokens?.placeables ?? []).map(token => [token.document.uuid,token]));
 const targets = fatal?.preview ? area.targets : fireArea
  ? fire.recipients.filter(row => !fire.responses[encodeURIComponent(row.actorUuid).replaceAll('.','%2E')]?.resolved)
  : pendingTargets(id,area,deletedId).targets;
 const recipients = targets.map(row => tokens.get(row.tokenUuid))
  .filter(token => token?.isVisible && (!token.document.hidden || game.user.isGM));
 if (!recipients.length) return;
 const graphics = new PIXI.Graphics();
 graphics.eventMode = 'none';
 graphics.lineStyle(4,Number.parseInt(auraColor().slice(1),16),1);
 for (const token of recipients) graphics.drawRoundedRect((token.document.x ?? token.x) - 3,(token.document.y ?? token.y) - 3,token.w + 6,token.h + 6,8);
 board.interface.addChild(graphics);
 outlines.set(id,graphics);
}

export function registerMagicFearPreview() {
 const refreshOutlines = (id,deletedId) => {
  if (!id) return;
  try { drawTargetOutlines(id,deletedId); }
  catch (error) { console.error('Trudvang | Fear target outlines failed',error); }
 };
 const refresh = (id,deletedId) => {
  if (!id) return;
  const flags = section(game.messages.get(id));
  if (!flags?.fatalMagicResult && !flags?.spellZoneTest) {
   void synchronizeMagicFearRegion(id,{deletedId}).catch(error => console.error('Trudvang | Fear region synchronization failed',error));
  }
  refreshOutlines(id,deletedId);
 };
 const rebuild = () => {
  const ids = new Set(values(game.messages).filter(message => section(message)?.magicFearArea?.nativeRegion
   || section(message)?.fatalMagicResult?.preview || section(message)?.spellZoneTest?.instantInfo).map(message => message.id));
  if (writer()) {
   for (const scene of values(game.scenes)) for (const region of values(scene.regions)) {
    const id = regionCastId(region);
    if (id) ids.add(id);
   }
  }
  for (const id of ids) refresh(id);
 };
 Hooks.on('createChatMessage',message => refresh(previewId(message)));
 Hooks.on('updateChatMessage',message => refresh(previewId(message)));
 Hooks.on('deleteChatMessage',message => refresh(previewId(message),message.id));
 Hooks.on('updateRegion',region => refreshOutlines(regionCastId(region)));
 Hooks.on('deleteRegion',region => {
  for (const message of values(game.messages)) if (section(message)?.spellZoneTest?.regionUuid === region.uuid) refreshOutlines(message.id);
 });
 Hooks.on('updateToken', (_token, changes) => {
  if (['x','y','width','height','hidden','level'].some(key => Object.hasOwn(changes,key))) {
   const ids = new Set(values(game.messages).map(previewId).filter(Boolean));
   for (const id of ids) refreshOutlines(id);
  }
 });
 Hooks.on('canvasReady',rebuild);
 Hooks.on('updateUser',rebuild);
 Hooks.on('canvasTearDown',() => {
  for (const id of outlines.keys()) clearOutlines(id);
 });
 rebuild();
}
