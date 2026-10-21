import {actorStateStatuses} from "./rules/actor-status-resolver.mjs";
import {bodyHealthPersistence} from "./rules/body-health.mjs";

const systemId = "trudvang-chronicles";
const pendingSyncs = new WeakMap();
const syncOptions = {trudvangStatusSync: true};
const managedGroup = effect => effect.flags?.[systemId]?.automaticStatus;
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);

/** One elected writer prevents duplicate markers on connected clients. */
function canSynchronize(actor) {
  if (!actor || !["character", "npc"].includes(actor.type) || actor.inCompendium) return false;
  // The stored owner of a synthetic actor is its Token, not the world Actor collection.
  if ((actor.isToken ? actor.token?.persisted : actor.persisted) === false) return false;
  const user = game.user;
  if (!user || !actor.canUserModify?.(user, "update")) return false;
  const writer = game.users?.activeGM ?? values(game.users)
    .filter(candidate => candidate.active && actor.canUserModify(candidate, "update"))
    .sort((left, right) => left.id.localeCompare(right.id))[0];
  return writer?.id === user.id;
}

function markerData({group, id}) {
  const status = CONFIG.statusEffects[id];
  if (!status) throw new Error(`Unknown automatic Trudvang status: ${id}`);
  return {
    name: game.i18n.localize(status.name), img: status.img, type: "effect",
    statuses: [id], disabled: false, transfer: false,
    // V14 renders permanent markers only when showIcon is explicitly ALWAYS.
    showIcon: foundry.CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS,
    duration: {value: null, units: "seconds", expiry: null, expired: false},
    system: {changes: [], stages: []},
    flags: {[systemId]: {automaticStatus: group}}
  };
}

function markerMatches(effect, data) {
  const statuses = Array.from(effect.statuses ?? []);
  return effect.type === data.type && effect.name === data.name && effect.img === data.img
    && statuses.length === 1 && statuses[0] === data.statuses[0]
    && effect.disabled === false && effect.transfer === false && effect.showIcon === data.showIcon
    && !(effect.system?.changes?.length || effect.system?.stages?.length)
    && !effect.duration?.expired && !effect.duration?.expiry
    && (effect._source?.duration?.value ?? null) === null;
}

async function synchronize(actor) {
  if (!canSynchronize(actor)) return false;
  const health=bodyHealthPersistence(actor);
  if(health)await actor.update(health,{...syncOptions,trudvangHealthSync:true});
  const desired = new Map(actorStateStatuses(actor).map(state => [state.group, state]));
  const effects = values(actor.effects);
  const create = [], update = [], remove = [];
  for (const group of ["health", "fear"]) {
    const existing = effects.filter(effect => managedGroup(effect) === group);
    const state = desired.get(group);
    if (!state) {
      remove.push(...existing.map(effect => effect.id));
      continue;
    }
    const data = markerData(state);
    const keep = existing.find(effect => markerMatches(effect, data)) ?? existing[0];
    if (!keep) create.push(data);
    else {
      if (!markerMatches(keep, data)) update.push({_id: keep.id, ...data});
      remove.push(...existing.filter(effect => effect !== keep).map(effect => effect.id));
    }
  }
  // Only our own markers are changed; manual statuses, item effects and
  // Sacrilege are never removed or rewritten by this synchronization.
  // Foundry mutates operation options (parentUuid, updates, etc.). A shared
  // object can retain an ActorDelta parent and misroute the next Actor update.
  if (remove.length) await actor.deleteEmbeddedDocuments("ActiveEffect", remove, {...syncOptions});
  if (update.length) await actor.updateEmbeddedDocuments("ActiveEffect", update, {...syncOptions});
  if (create.length) await actor.createEmbeddedDocuments("ActiveEffect", create, {...syncOptions});
  return Boolean(health || remove.length || update.length || create.length);
}

/** Serialize resource/effect changes and reread the latest prepared state each time. */
export function syncActorStateStatuses(actor) {
  if (!canSynchronize(actor)) return Promise.resolve(false);
  const pending = (pendingSyncs.get(actor) ?? Promise.resolve()).catch(() => {}).then(() => synchronize(actor));
  pendingSyncs.set(actor, pending);
  return pending.finally(() => {
    if (pendingSyncs.get(actor) === pending) pendingSyncs.delete(actor);
  });
}

function queueSync(actor, options) {
  if (options?.trudvangStatusSync) return Promise.resolve(false);
  return syncActorStateStatuses(actor).catch(error => {
    console.error("Trudvang Chronicles | Automatic actor status synchronization failed", error);
    return false;
  });
}

async function queueActorAndDependents(actor, options) {
  if(!actor||actor.isToken)return queueSync(actor,options);
  // Base actor/equipment updates also reprepare unlinked tokens, but Foundry
  // does not emit updateActor for those synthetic actors. Reconcile their own
  // markers as well, including after a marker inherited from the base changes.
  const dependents = new Set(values(actor.getDependentTokens?.({concreteOnly: true}))
    .map(token => token.actor).filter(dependent => dependent && dependent !== actor));
  // A dependent may have its own current HP but inherit the base maximum
  // reference. Commit its health before that reference changes on the base.
  if(!options?.trudvangStatusSync&&(bodyHealthPersistence(actor)?.["system.resources.body.value"]!==undefined||bodyHealthPersistence(actor)?.["system.resources.body.temporary"]!==undefined)){
    await Promise.all([...dependents].filter(canSynchronize).map(async dependent=>{
      const health=bodyHealthPersistence(dependent);
      if(health)await dependent.update(health,{...syncOptions,trudvangHealthSync:true});
    }));
  }
  const changed = await queueSync(actor, options);
  await Promise.all(Array.from(dependents, dependent => queueSync(dependent)));
  return changed;
}

export async function syncWorldActorStatuses() {
  const actors = new Map();
  const include = actor => { if (actor) actors.set(actor.uuid ?? actor, actor); };
  for (const scene of values(game.scenes)) for (const token of values(scene.tokens)) include(token.actor);
  // Give legacy unlinked tokens their own baseline before base-actor fields
  // start inheriting into their deltas. Their existing forms can have a
  // different maximum from the base actor already at initial world load.
  await Promise.all([...actors.values()].filter(actor=>actor.isToken&&canSynchronize(actor)
    &&(!(Number(actor._source?.system?.resources?.body?.maxAtValue)>0)||Number(actor._source?.system?.resources?.body?.temporaryMaxAtValue??-1)<0||actor._source?.system?.resources?.body?.maximumOnlyAtValue==null)).map(async actor=>{
    const health=bodyHealthPersistence(actor);
    if(health)await actor.update(health,{...syncOptions,trudvangHealthSync:true});
  }));
  // Synchronize bases first: token deltas can inherit their marker documents.
  await Promise.all(values(game.actors).map(actor => queueSync(actor)));
  // Include synthetic NPC actors on inactive scenes too, without modifying the
  // base creature or assuming that a canvas is currently rendered.
  await Promise.all(Array.from(actors.values(), actor => queueSync(actor)));
}

export function registerActorStatusHooks() {
  Hooks.on("createActor", (actor, options) => queueActorAndDependents(actor, options));
  Hooks.on("updateActor", (actor, changed, options) => queueActorAndDependents(actor, options));
  for (const event of ["createItem", "updateItem", "deleteItem"]) {
    Hooks.on(event, (item, changedOrOptions, options) => queueActorAndDependents(item.actor, event === "updateItem" ? options : changedOrOptions));
  }
  for (const event of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) {
    Hooks.on(event, (effect, changedOrOptions, options) => queueActorAndDependents(effect.actor, event === "updateActiveEffect" ? options : changedOrOptions));
  }
  Hooks.on("createToken", (token, options) => queueSync(token.actor, options));
  Hooks.on("updateToken", (token, changed, options) => {
    if (["actorId", "actorLink", "delta"].some(key => Object.hasOwn(changed, key))) return queueSync(token.actor, options);
  });
  Hooks.once("ready", syncWorldActorStatuses);
  Hooks.on("canvasReady", canvas => Promise.all(values(canvas.tokens?.placeables).map(token => queueSync(token.actor))));
}
