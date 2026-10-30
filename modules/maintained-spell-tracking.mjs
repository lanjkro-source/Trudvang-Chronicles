import {activeSpellRecords, maintainedSpellEffects} from "./rules/active-spell-resolver.mjs";

const jobs = new Map();
const oldContexts = new WeakMap();
const replies = new Map();
const channel = "system.trudvang-chronicles";
const contextOf = effect => effect?.flags?.["trudvang-chronicles"]?.transformation?.ruleTestContext;
const isWriter = () => Boolean(game.users?.activeGM?.isSelf);
const world = () => ({actors: game.actors ?? [], scenes: game.scenes ?? []});

/** Rebuild references on the elected GM, never inferring that an empty list
 * means an unapplied or ended casting. Effect deletion is a separate step. */
export async function reconcileMaintainedSpell(caster, castingId, {effectCreated = false, removed = false} = {}) {
 if (!isWriter() || !caster?.canUserModify?.(game.user, "update") || !castingId) return false;
 const records = activeSpellRecords(caster);
 const record = records.find(row => row.id === castingId);
 if (!record) return false;
 const references = maintainedSpellEffects(world(), {casterUuid: caster.uuid, castingId}).map(row => row.effectUuid).sort();
 const previous = Array.from(record.effectUuids ?? []).sort();
 const effectsApplied = record.effectsApplied || effectCreated || references.length > 0;
 // Only an actual removal event can end a cast. An empty scan at startup or
 // before applying a spell is not evidence that the caster stopped it.
 if (removed && effectsApplied && references.length === 0) {
  await caster.update({"system.activeSpellCastings": records.filter(row => row.id !== castingId), "system.activeSpellCastingsMigrated": true}, {trudvangSpellTracking: true});
  return true;
 }
 if (effectsApplied === record.effectsApplied && JSON.stringify(previous) === JSON.stringify(references)) return false;
 record.effectUuids = references;
 record.effectsApplied = effectsApplied;
 await caster.update({"system.activeSpellCastings": records, "system.activeSpellCastingsMigrated": true}, {trudvangSpellTracking: true});
 return true;
}

function queueCaster(casterUuid, work) {
 // Serialize every update for one caster: Foundry replaces the entire casting array.
 const previous = jobs.get(casterUuid) ?? Promise.resolve();
 const job = previous.catch(() => {}).then(work);
 jobs.set(casterUuid, job);
 return job.catch(error => {console.error("Trudvang | Maintained spell tracking failed", error);return false;}).finally(() => {
  if (jobs.get(casterUuid) === job) jobs.delete(casterUuid);
 });
}
function enqueue(casterUuid, castingId, options = {}) {
 if (!isWriter() || !casterUuid || !castingId) return Promise.resolve(false);
 return queueCaster(casterUuid, async () => reconcileMaintainedSpell(await foundry.utils.fromUuid(casterUuid), castingId, options));
}

export async function endMaintainedSpellOnGM(casterUuid, castingId, userId) {
 if (!isWriter()) return false;
 return queueCaster(casterUuid, async () => {
  const caster = await foundry.utils.fromUuid(casterUuid);
  const user = game.users.get(userId);
  if (!user || !caster?.canUserModify?.(user, "update")) return false;
  const record = activeSpellRecords(caster).find(row => row.id === castingId);
  if (!record) return false;
  const live = maintainedSpellEffects(world(), {casterUuid, castingId});
  const uuids = new Set([...record.effectUuids, ...live.map(row => row.effectUuid)]);
  for (const uuid of uuids) {
   const effect = await foundry.utils.fromUuid(uuid);
   const context = contextOf(effect);
   if (context?.casterUuid === casterUuid && context?.castingId === castingId) await effect.delete();
  }
  const current = activeSpellRecords(caster);
  await caster.update({"system.activeSpellCastings":current.filter(row=>row.id!==castingId),"system.activeSpellCastingsMigrated":true}, {trudvangSpellTracking:true});
  return true;
 });
}

export async function requestEndMaintainedSpell(caster, castingId) {
 if (!caster?.canUserModify?.(game.user, "update")) return false;
 if (isWriter()) return endMaintainedSpellOnGM(caster.uuid, castingId, game.user.id);
 if (!game.users?.activeGM || !game.socket) return false;
 const requestId = crypto.randomUUID();
 return new Promise(resolve => {
  const timeout = setTimeout(() => {replies.delete(requestId);resolve(false);}, 30000);
  replies.set(requestId, {resolve, timeout});
  game.socket.emit(channel, {type:"endMaintainedSpell",requestId,userId:game.user.id,casterUuid:caster.uuid,castingId});
 });
}

function registerSocket() {
 if (!game.socket) return;
 game.socket.on(channel, async payload => {
  if (payload?.type === "endMaintainedSpellReply" && payload.userId === game.user.id) {
   const pending=replies.get(payload.requestId);if(!pending)return;
   clearTimeout(pending.timeout);replies.delete(payload.requestId);pending.resolve(Boolean(payload.success));return;
  }
  if (payload?.type !== "endMaintainedSpell" || !isWriter()) return;
  const success = await endMaintainedSpellOnGM(payload.casterUuid,payload.castingId,payload.userId);
  game.socket.emit(channel,{type:"endMaintainedSpellReply",requestId:payload.requestId,userId:payload.userId,success});
 });
}

function enqueueContext(context, options) { return enqueue(context?.casterUuid, context?.castingId, options); }
function worldActors() {
 const actors = new Map();
 for (const actor of game.actors ?? []) if (actor?.uuid) actors.set(actor.uuid, actor);
 for (const scene of game.scenes ?? []) for (const token of scene.tokens ?? []) if (token.actor?.uuid) actors.set(token.actor.uuid, token.actor);
 return actors.values();
}
// The elected GM may receive updateActiveEffect without a preUpdate hook for a
// player-initiated write. The persisted reverse reference identifies the old cast.
function enqueuePreviousReference(effectUuid, currentContext) {
 if (!isWriter() || !effectUuid) return;
 for (const actor of worldActors()) for (const record of activeSpellRecords(actor)) {
  if (record.effectUuids.includes(effectUuid)) void enqueue(actor.uuid, record.id,
   {removed: actor.uuid !== currentContext?.casterUuid || record.id !== currentContext?.castingId});
 }
}

export function registerMaintainedSpellTracking() {
 Hooks.on("createActiveEffect", effect => {if (effect.parent?.documentName === "Actor") void enqueueContext(contextOf(effect), {effectCreated:true});});
 Hooks.on("preUpdateActiveEffect", effect => {if (effect.parent?.documentName === "Actor") oldContexts.set(effect, structuredClone(contextOf(effect) ?? null));});
 Hooks.on("updateActiveEffect", effect => {
  if (effect.parent?.documentName !== "Actor") return;
  const previous = oldContexts.get(effect); oldContexts.delete(effect);
  const current = contextOf(effect);
  enqueuePreviousReference(effect.uuid, current);
  if (previous && (previous.casterUuid !== current?.casterUuid || previous.castingId !== current?.castingId)) void enqueueContext(previous, {removed:true});
  void enqueueContext(current);
 });
 Hooks.on("deleteActiveEffect", effect => {if (effect.parent?.documentName === "Actor") void enqueueContext(contextOf(effect), {removed:true});});
 Hooks.on("updateActor", (actor, changed, options) => {
  if (options?.trudvangSpellTracking || (!changed.system?.activeSpellCastings && !Object.hasOwn(changed, "system.activeSpellCastings"))) return;
  for (const record of activeSpellRecords(actor)) void enqueue(actor.uuid, record.id);
 });
 Hooks.on("ready", () => {
  registerSocket();
  if (!isWriter()) return;
  for (const actor of worldActors()) for (const record of activeSpellRecords(actor)) void enqueue(actor.uuid, record.id);
 });
}
