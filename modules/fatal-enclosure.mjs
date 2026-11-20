import {auraColor} from "./aura.mjs";
import {deleteEffectOnce} from "./effect-deletion.mjs";
import {fatalVitnerRecipients} from "./fatal-vitner-area.mjs";
import {FATAL_MAGIC_ROWS, absorbsVitnerFrom} from "./rules/fatal-magic.mjs";
import {zonePixelScale} from "./rules/spell-zones.mjs";

const SCOPE = "trudvang-chronicles";
const TAG = "fatalEnclosure";
const REGION_STATE = `flags.${SCOPE}.${TAG}`;
const CARD_STATE = `flags.${SCOPE}.fatalMagicResult.enclosure`;
const local = (key, data) => data ? game.i18n.format(`TRUDVANG.FatalMagic.${key}`, data) : game.i18n.localize(`TRUDVANG.FatalMagic.${key}`);
const stateOf = region => region?.flags?.[SCOPE]?.[TAG];
const values = collection => Array.from(collection?.values?.() ?? []);
const roll = async formula => Number((await new Roll(formula).evaluate()).total);
const pendingJobs = new Map();
const removing = new WeakMap();

function serialize(id, action) {
  const previous = pendingJobs.get(id) ?? Promise.resolve();
  const job = previous.catch(() => {}).then(action);
  pendingJobs.set(id, job);
  return job.finally(() => {if (pendingJobs.get(id) === job) pendingJobs.delete(id);});
}

/** A new exposure queues a pulse, and people staying inside do not trigger it
 * again. Leaving does not cancel a pulse that already selected a target. */
export function enclosureExposure(state, candidates) {
  const seen = candidates.map(row => row.actorUuid);
  const pending = new Map(state.pending.map(row => [row.actorUuid, row]));
  for (const row of candidates) if (!state.seen.includes(row.actorUuid)) pending.set(row.actorUuid, row);
  return {seen, pending: [...pending.values()]};
}

function enclosureEffect(caster, state) {
  return values(caster?.effects).find(effect => effect.flags?.[SCOPE]?.[TAG]?.messageId === state.messageId);
}

function regionFor(messageId) {
  return values(game.scenes).flatMap(scene => values(scene.regions)).find(region => stateOf(region)?.messageId === messageId);
}

async function publish(region, state, message) {
  if (!message) return;
  const previous = message.getFlag(SCOPE, "fatalMagicResult")?.enclosure;
  const next = {radius: state.radius, remaining: state.remaining, maximum: state.maximum,
    sceneId: region.parent.id, level: state.level, live: true, pending: state.pending.length > 0, sequence: state.sequence,
    targets: state.pending.filter(row => !row.hidden).map(({name, tokenUuid}) => ({name, tokenUuid}))};
  if (JSON.stringify(previous) !== JSON.stringify(next)) await message.update({[CARD_STATE]: next});
}

async function close(region) {
  const state = stateOf(region);
  const caster = await foundry.utils.fromUuid(state.casterUuid);
  const effect = enclosureEffect(caster, state);
  if (effect) await deleteEffectOnce(effect);
  const message = game.messages.get(state.messageId);
  const current = message?.getFlag(SCOPE, "fatalMagicResult")?.enclosure ?? {};
  if (message && current.live !== false) await message.update({[CARD_STATE]: {
    ...current, radius: state.radius, remaining: state.remaining, maximum: state.maximum,
    live: false, pending: false, targets: []
  }});
}

async function retire(region) {
  if (removing.has(region)) return removing.get(region);
  const job = Promise.resolve().then(async () => {
    if (region.parent.regions.get(region.id) === region) await region.delete();
    await close(region);
  }).finally(() => removing.delete(region));
  removing.set(region, job);
  return job;
}

async function reconcile(region, message) {
  const state = stateOf(region);
  if (!state || region.parent.regions.get(region.id) !== region) return null;
  const source = await foundry.utils.fromUuid(state.sourceTokenUuid);
  const caster = source?.actor;
  if (!message || !caster || caster.uuid !== state.casterUuid || state.remaining < 1
      || (state.started && !enclosureEffect(caster, state))) {
    await retire(region);
    return null;
  }
  if (!state.started) return null;
  const rule = FATAL_MAGIC_ROWS[state.row].enclosure;
  const eligibleCasters = new Set(values(region.parent.tokens)
    .filter(token => token.actor && absorbsVitnerFrom(token.actor)).map(token => token.actor.uuid));
  const candidates = fatalVitnerRecipients(source, state.radius, rule.castersOnly)
    .filter(row => !rule.castersOnly || eligibleCasters.has(row.actorUuid));
  const {seen, pending} = enclosureExposure(state, candidates);
  const level = source.level ?? null;
  const next = {...state, seen, pending, level};
  if (JSON.stringify(state.seen) !== JSON.stringify(seen) || JSON.stringify(state.pending) !== JSON.stringify(pending)
      || state.level !== level) await region.update({[REGION_STATE]: next, ...(state.level !== level ? {levels: level ? [level] : []} : {})});
  await publish(region, next, message);
  return next;
}

async function createEnclosure(message, result, rule, maximum) {
  const source = result.tokenUuid ? await foundry.utils.fromUuid(result.tokenUuid) : null;
  const caster = source?.actor;
  const scene = source?.parent;
  if (!scene || caster?.uuid !== result.actorUuid) return {status: "noOrigin"};
  let region = regionFor(message.id);
  if (!region && maximum < 1) {
    await message.update({[CARD_STATE]: {remaining: 0, maximum: 0, live: false, pending: false, targets: []}});
    return {status: "applied"};
  }
  if (!region) {
    const radius = typeof rule.radius === "number" ? rule.radius : await roll(rule.radius);
    const size = Number(scene.grid?.size || 1);
    const center = source.getCenterPoint?.() ?? {x: source.x + source.width * size / 2, y: source.y + source.height * size / 2};
    const level = source.level ?? null;
    const restricted = message.blind || message.whisper?.length;
    const recipients = [message.author?.id, ...Array.from(message.whisper ?? [], user => user.id ?? user)].filter(Boolean);
    [region] = await scene.createEmbeddedDocuments("Region", [{
      name: local("Enclosure"), color: auraColor(), locked: true, attachment: {token: source.id},
      levels: level ? [level] : [], highlightMode: scene.grid?.isGridless ? "shapes" : "coverage",
      visibility: message.blind ? CONST.REGION_VISIBILITY.GAMEMASTER
        : restricted ? CONST.REGION_VISIBILITY.OBSERVER : CONST.REGION_VISIBILITY.ALWAYS,
      ...(restricted ? {ownership: Object.fromEntries(recipients.map(id => [id, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER]))} : {}),
      shapes: [{type: "circle", ...center, radius: radius * zonePixelScale(scene)}],
      flags: {[SCOPE]: {[TAG]: {messageId: message.id, casterUuid: caster.uuid, sourceTokenUuid: source.uuid,
        row: result.row, radius, level, maximum, remaining: maximum, sequence: 0, seen: [], pending: [], pulse: null}}}
    }]);
  }
  if (!region) return {status: "unavailable"};
  const state = stateOf(region);
  if (!enclosureEffect(caster, state)) {
    const effect = await caster.createTrudvangEffect({
      name: local("Enclosure"), img: "icons/svg/aura.svg", description: local("EnclosureRule"),
      duration: {value: null, units: "rounds"}, origin: region.uuid,
      system: {stackId: `fatal-enclosure:${message.id}`, changes: []},
      flags: {[SCOPE]: {[TAG]: {messageId: message.id, regionUuid: region.uuid}, summary: local("EnclosureRule")}}
    });
    if (!effect) return {status: "unavailable"};
  }
  if (!state.started) await region.update({[REGION_STATE]: {...state, started: true}});
  await reconcile(region, message);
  return {status: "applied"};
}

async function discharge(region, message, state, rule) {
  if (!state.pending.length) return {status: "unavailable"};
  let pulse = state.pulse;
  if (!pulse) {
    const charge = typeof rule.charge === "string" ? await roll(rule.charge) : rule.charge ?? null;
    pulse = {charge, targets: state.pending};
    state = {...state, pulse};
    await region.update({[REGION_STATE]: state});
  }
  const {rollDamage} = await import("./dice.mjs");
  const {requestChatApplication} = await import("./chat-application.mjs");
  let inflicted = 0;
  for (const target of pulse.targets) {
    const actor = await foundry.utils.fromUuid(target.actorUuid);
    if (!actor) continue;
    const token = await foundry.utils.fromUuid(target.tokenUuid) ?? {actor, name: target.name};
    const event = `fatal-enclosure:${message.id}:${state.sequence}:${target.actorUuid}`;
    let card = values(game.messages).find(row => row.getFlag?.(SCOPE, "persistentDamageEvent") === event);
    if (!card) {
      const damage = await rollDamage({
        actor, item: {name: local("Enclosure"), img: "icons/svg/aura.svg",
          system: {category: "magic", damage: rule.damage, openRoll: 0, strengthApplies: false}},
        context: {usage: "magic", automatic: true, ignoreActorDamage: true, returnMessage: true, boundActorUuid: actor.uuid,
          persistentDamageEvent: event, qualification: {nature: "magical", delivery: "other", protection: rule.protection},
          targets: [token], protectionLocked: true,
          ...(message.blind || message.whisper?.length || target.hidden
            ? {whisper: [...new Set([...values(game.users).filter(user => user.isGM).map(user => user.id),
              ...(!message.blind && !target.hidden ? Array.from(message.whisper ?? [], user => user.id ?? user) : []),
              ...(!message.blind && !target.hidden && message.author?.id ? [message.author.id] : [])])]} : {})}
      });
      card = damage?.message;
    }
    if (!card) throw Error("Fatal enclosure damage card missing");
    const result = await requestChatApplication({message: card, actor, token, channel: "body"});
    if (!["applied", "alreadyApplied"].includes(result.status)) throw Error("Fatal enclosure damage application failed");
    inflicted += (card.getFlag(SCOPE, "applications") ?? []).find(row => row.actorUuid === actor.uuid && row.channel === "body")?.impactDamage ?? 0;
  }
  const hit = new Set(pulse.targets.map(row => row.actorUuid));
  const next = {...state, sequence: state.sequence + 1, remaining: Math.max(0, state.remaining - (pulse.charge ?? inflicted)),
    pending: state.pending.filter(row => !hit.has(row.actorUuid)), pulse: null};
  await region.update({[REGION_STATE]: next});
  if (!next.remaining) await retire(region);
  else await publish(region, next, message);
  return {status: "applied"};
}

export function applyFatalEnclosure(message, {pulse = false, cost, sequence} = {}) {
  return serialize(message.id, async () => {
    const result = message.getFlag(SCOPE, "fatalMagicResult");
    const row = FATAL_MAGIC_ROWS[result?.row];
    const total = Number(message.rolls?.[0]?.total);
    if (!row?.enclosure || !Number.isInteger(total) || total < result.row || total > row.last) return {status: "unavailable"};
    if (!pulse) {
      if (result.enclosure) return {status: "alreadyApplied"};
      const maximum = result.cost ?? cost;
      if (!Number.isInteger(maximum) || maximum < 0) return {status: "unavailable"};
      return createEnclosure(message, result, row.enclosure, maximum);
    }
    const region = regionFor(message.id);
    const state = region && await reconcile(region, message);
    if (!state) return {status: "unavailable"};
    if (Number.isInteger(sequence) && sequence !== state.sequence) return {status: "alreadyApplied"};
    return discharge(region, message, state, row.enclosure);
  });
}

export function registerFatalEnclosures() {
  const writer = () => game.users?.activeGM?.id === game.user.id;
  const safely = job => void job.catch(error => console.error("Trudvang | Fatal enclosure failed", error));
  const sync = scene => {
    if (!writer()) return;
    for (const region of values(scene?.regions)) {
      const state = stateOf(region);
      if (state) safely(serialize(state.messageId, () => reconcile(region, game.messages.get(state.messageId))));
    }
  };
  for (const hook of ["createToken", "updateToken", "deleteToken"]) Hooks.on(hook, token => sync(token.parent));
  Hooks.on("deleteRegion", region => {
    if (writer() && stateOf(region) && !removing.has(region)) safely(close(region));
  });
  Hooks.on("deleteActiveEffect", effect => {
    const link = effect.flags?.[SCOPE]?.[TAG];
    if (!writer() || !link) return;
    const region = regionFor(link.messageId);
    if (region && !removing.has(region)) safely(serialize(link.messageId, () => retire(region)));
  });
  Hooks.on("deleteChatMessage", message => {
    const region = writer() && regionFor(message.id);
    if (region) safely(serialize(message.id, () => retire(region)));
  });
  Hooks.on("updateUser", () => {if (writer()) for (const scene of values(game.scenes)) sync(scene);});
  if (writer()) for (const scene of values(game.scenes)) sync(scene);
}
