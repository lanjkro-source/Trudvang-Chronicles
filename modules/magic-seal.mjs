import {recordedRoll,recordedRollFlag} from "./chat-roll-privacy.mjs";
import {applyItemTransformation} from "./item-effect-application.mjs";
import {activeSpellRecords} from "./rules/active-spell-resolver.mjs";
import {currentCastingCounts} from "./rules/magic-resistance.mjs";
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {resolveRollUnderOutcome} from "./rules/roll-under-resolver.mjs";

const SCOPE = "trudvang-chronicles";
const CHANNEL = `system.${SCOPE}`;
export const SEAL_ID = "vitner-vitner-craft:seal:5";
const itemTypes = new Set(["weapon", "armor", "shield", "gear", "potion"]);
const jobs = new Set();
const reservations = new Map();
const replies = new Map();
let socketRegistered = false;
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);
const local = key => game.i18n.localize(`TRUDVANG.Seal.${key}`);
const stateOf = effect => effect?.flags?.[SCOPE]?.magicSeal;
const writer = () => Boolean(game.user?.isGM && (!game.users?.activeGM || game.users.activeGM.id === game.user.id));
const validItem = item => item?.documentName === "Item" && itemTypes.has(item.type) &&
  item.parent?.documentName === "Actor" && !item.pack && !item.parent.pack;
const validSeal = effect => validItem(effect?.parent) && stateOf(effect) && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired;
const owns = (actor, user) => Boolean(actor && (user.isGM || actor.testUserPermission?.(user, "OWNER")));
const canOpenItem = (item, user) => validItem(item) && Boolean(user.isGM || item.testUserPermission?.(user, "LIMITED"));
const authorId = message => message?.author?.id ?? message?._source?.author;
const mayBind = (effect, user) => {
  const state = stateOf(effect);
  if (!validSeal(effect) || state.spell) return false;
  if (!canOpenItem(effect.parent, user)) return false;
  if (user.isGM || state.sealUserId === user.id) return true;
  // TEMPORARY WORLD MIGRATION — older seals recorded the caster but not their user.
  return !state.sealUserId && owns(foundry.utils.fromUuidSync?.(state.casterUuid), user);
};

function controlledActors() {
  return [...new Map(values(globalThis.canvas?.tokens?.controlled)
    .filter(token => owns(token.actor, game.user) && ["npc", "character"].includes(token.actor.type))
    .map(token => [token.actor.uuid, token.actor])).values()];
}

async function once(id, run) {
  if (jobs.has(id)) return null;
  jobs.add(id);
  try { return await run(); }
  finally { jobs.delete(id); }
}

export function sealPreparation(context, target) {
  const profile = POWER_DETAILS_BY_ID[context?.sourceId]?.seal;
  if (!profile || context.kind !== "spell") return null;
  return {
    casterUuid: context.casterUuid,
    maximum: profile.maximum + Number(context.countsById?.[profile.levelOptionId] || 0),
    ...(Number.isFinite(target) ? {target} : {})
  };
}

async function choose(label, options) {
  if (!options.length) return null;
  const {escapeAttribute, escapeHtml} = await import("./helpers.mjs");
  const list = options.map(row => `<option value="${escapeAttribute(row.id)}">${escapeHtml(row.name)}</option>`).join("");
  const id = await foundry.applications.api.DialogV2.wait({
    window: {title: local(label)}, classes: ["trudvang", "dialog"],
    content: `<div class="trudvang roll-dialog"><label class="form-group"><span>${escapeHtml(local(label))}</span><select name="choice">${list}</select></label></div>`,
    buttons: [
      {action: "choose", default: true, label: game.i18n.localize("TRUDVANG.Action.Continue"),
        callback: (_event, button) => button.form.elements.choice.value},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => null}
    ],
    rejectClose: false
  });
  return options.find(row => row.id === id)?.document ?? null;
}

export function canDropSealCard(message, user = game.user) {
  const state = message?.flags?.[SCOPE]?.sealPreparation;
  if (!user || !state || state.effectUuid) return false;
  if (user.isGM) return true;
  const whispers = values(message.whisper).map(entry => entry.id ?? entry);
  return authorId(message) === user.id && !message.blind && (!whispers.length || message.isContentVisible !== false);
}

export async function prepareMagicSeal(message, item, user = game.user) {
  const state = recordedRollFlag(message,"sealPreparation");
  const context = message?.flags?.[SCOPE]?.ruleTestContext;
  const roll = recordedRoll(message), die = Number(roll?.total);
  if (!writer() || !canDropSealCard(message, user) || !canOpenItem(item, user) || !sealPreparation(context)
      || roll?.formula !== "1d20" || !Number.isInteger(die) || die < 1 || die > 20
      || !Number.isFinite(state.target) || !resolveRollUnderOutcome(die,state.target).success) return null;
  return once(message.id, async () => {
    const caster = await foundry.utils.fromUuid(context.casterUuid);
    if (!owns(caster, user) || (state.objectUuid && state.objectUuid !== item.uuid)) return null;
    const releaseMessageId = state.releaseMessageId ?? foundry.utils.randomID();
    if (!state.objectUuid) await message.update({
      [`flags.${SCOPE}.sealPreparation.objectUuid`]: item.uuid,
      [`flags.${SCOPE}.sealPreparation.releaseMessageId`]: releaseMessageId
    });
    const stackId = `seal:${message.id}`;
    const existing = values(item.effects).find(effect => effect.system?.stackId === stackId);
    const {escapeHtml} = await import("./helpers.mjs");
    const effect = existing ?? await applyItemTransformation(item, {
      type: "effect", name: local("Name"), img: "icons/svg/aura.svg", transfer: false,
      origin: context.sourceUuid ?? null, duration: {value: null, units: "rounds"},
      description: `<p>${escapeHtml(local("Description"))}</p>`,
      system: {stackId, stacking: "replace", changes: []},
      flags: {[SCOPE]: {
        magicSeal: {casterUuid: context.casterUuid, sealUserId: authorId(message) || user.id,
          maximum: sealPreparation(context).maximum, releaseMessageId, spell: null},
        summary: local("Empty"), transformation: {sourceId: SEAL_ID, ruleTestContext: context}
      }}
    });
    if (!effect) return null;
    await message.update({[`flags.${SCOPE}.sealPreparation.effectUuid`]: effect.uuid});
    return effect;
  });
}

export function canBindSpell(effect, actor, item, user = game.user) {
  if (!mayBind(effect, user) || !owns(actor, user) || item?.type !== "spell" ||
      (item.actor !== actor && item.parent !== actor) || !["instant", "lasting"].includes(item.system.spellType)) return false;
  const level = Number(item.system.level);
  if (!Number.isInteger(level) || level < 1 || level > stateOf(effect).maximum) return false;
  const tabletId = item.system.tabletId || (item.system.catalogId?.includes(":") ? item.system.catalogId.split(":")[0] : "");
  return values(actor.items).some(tablet => tablet.type === "tablet" &&
    (tabletId ? tablet.system.catalogId === tabletId : item.system.tablet && tablet.name === item.system.tablet) &&
    Number(tablet.system.level) >= level);
}

export async function weaveSealedSpell(effect) {
  if (!mayBind(effect, game.user)) return null;
  return once(`ui:${stateOf(effect).releaseMessageId}`, async () => {
    const actors = controlledActors();
    if (actors.length !== 1) return ui.notifications.warn(local("SelectCaster"));
    const [caster] = actors;
    const spells = values(caster.items).filter(item => canBindSpell(effect, caster, item));
    if (!spells.length) return ui.notifications.warn(local("NoSpell"));
    const spell = await choose("ChooseSpell", spells.map(document => ({id: document.id, name: document.name, document})));
    if (!spell) return null;
    const request = {effectUuid: effect.uuid, actorUuid: caster.uuid, spellUuid: spell.uuid};
    const result = await requestSeal("reserve", request);
    if (result.status !== "reserved") return ui.notifications.warn(local("Unavailable"));
    try { return await caster.rollSpell(spell, {seal: effect, sealToken: result.token}); }
    finally { await requestSeal("cancel", {...request, token: result.token}); }
  });
}

export async function storeSealedSpell(effect, actor, item, {roll, target, context, cost, levels, token}) {
  const result = await requestSeal("store", {effectUuid: effect.uuid, actorUuid: actor.uuid, spellUuid: item.uuid,
    token, roll: roll.toJSON(), target, context, cost, levels});
  return result.status === "stored";
}

async function commitSealedSpell(effect, item, {roll, target, context, cost, levels}) {
  const data = item.toObject();
  const spell = {name: item.name, uuid: item.uuid, itemId: item.id, img: item.img, system: data.system,
    roll, target, context: structuredClone(context), cost, levels};
  await effect.update({
    [`flags.${SCOPE}.magicSeal.spell`]: spell,
    [`flags.${SCOPE}.summary`]: game.i18n.format("TRUDVANG.Seal.Stored", {spell: spell.name})
  });
  return {status: "stored"};
}

export function sealedSpellSource(message, actor) {
  const spell = message?.flags?.[SCOPE]?.releasedSeal;
  return spell && {documentName: "Item", type: "spell", uuid: spell.uuid, id: spell.itemId,
    name: spell.name, img: spell.img, system: spell.system, actor, parent: actor};
}

export function canResolveReleasedSeal(message, user = game.user) {
  const release = message?.flags?.[SCOPE]?.releasedSeal;
  return Boolean(user && release?.userId && (user.isGM || (release.userId === user.id && authorId(message) === user.id)));
}

export function sealSheetView(effect) {
  const state = stateOf(effect);
  if (!state) return null;
  return {spell: state.spell?.name, maximum: state.maximum, canBind: mayBind(effect, game.user),
    canRelease: Boolean(validSeal(effect) && state.spell && canOpenItem(effect.parent, game.user)),
    improvements: (state.spell?.system?.powerLevels ?? []).flatMap((option, index) => {
      const count = state.spell.context.countsById?.[option.id ?? option.optionId] ?? state.spell.context.counts?.[index];
      return count > 0 ? [{count, text: option.effect}] : [];
    })};
}

async function confirmRelease(effect) {
  const {escapeAttribute, escapeHtml} = await import("./helpers.mjs");
  const {spell} = stateOf(effect);
  const targets = values(game.user.targets);
  const candidates = targets.length ? targets : values(globalThis.canvas?.tokens?.controlled);
  const rows = new Map(candidates.flatMap(token => {
    const doc = token.document ?? token;
    return doc.uuid && doc.actor ? [[doc.uuid, doc.name ?? doc.actor.name]] : [];
  }));
  rows.set("", local("NoTarget"));
  const options = [...rows].map(([id, name]) => `<option value="${escapeAttribute(id)}">${escapeHtml(name)}</option>`).join("");
  return foundry.applications.api.DialogV2.wait({
    window: {title: local("Release")}, classes: ["trudvang", "dialog"],
    content: `<div class="trudvang roll-dialog"><p><strong>${escapeHtml(spell.name)}</strong></p><label class="form-group"><span>${escapeHtml(local("Target"))}</span><select name="target">${options}</select></label></div>`,
    buttons: [
      {action: "release", default: true, label: local("Release"), callback: (_event, button) => ({
        targetUuid: button.form.elements.target.value
      })},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => null}
    ],
    rejectClose: false
  });
}

export async function releaseSealedSpell(effect) {
  if (!validSeal(effect) || !stateOf(effect).spell || !canOpenItem(effect.parent, game.user)) return null;
  const choice = await confirmRelease(effect);
  if (typeof choice?.targetUuid !== "string") return null;
  const actors = controlledActors();
  const activator = actors.length === 1 ? actors[0] : (owns(game.user.character, game.user) ? game.user.character : null);
  const result = await requestSeal("release", {effectUuid: effect.uuid, targetUuid: choice.targetUuid, actorUuid: activator?.uuid});
  if (result.status !== "released") return ui.notifications.warn(local("Unavailable"));
  return result;
}

async function releaseOnAuthority(effect, user, {targetUuid, actorUuid}) {
  if (!validSeal(effect) || !stateOf(effect).spell || !canOpenItem(effect.parent, user)) return null;
  const {releaseMessageId, casterUuid, spell} = stateOf(effect);
  return once(releaseMessageId, async () => {
    const caster = await foundry.utils.fromUuid(spell.context.casterUuid || casterUuid);
    const target = targetUuid ? await foundry.utils.fromUuid(targetUuid) : null;
    if (targetUuid && (target?.documentName !== "Token" || !target.actor || (!user.isGM &&
        (target.hidden || (user.viewedScene && target.parent?.id !== user.viewedScene))))) return null;
    const requested = actorUuid && await foundry.utils.fromUuid(actorUuid);
    const carrier = effect.parent.parent;
    const actor = ["character", "npc"].includes(requested?.type) && owns(requested, user)
      ? requested : owns(carrier, user) ? carrier : caster ?? carrier;
    if (!actor) return null;
    const record = {id: spell.context.castingId, itemId: spell.itemId, cost: spell.cost,
      startedAt: Number(game.time?.worldTime || 0), duration: spell.system.duration || "",
      effectsApplied: false, effectUuids: [], powerLevelCounts: spell.context.counts, powerLevelSnapshot: spell.levels};
    let message = game.messages.get(releaseMessageId);
    const tracked = Boolean(caster && spell.system.spellType === "lasting" &&
      values(caster.items).some(item => item.id === record.itemId && item.type === "spell" && item.system.spellType === "lasting"));
    if (!message && tracked
        && !activeSpellRecords(caster).some(row => row.id === record.id)) {
      await caster.update({"system.activeSpellCastings": [...activeSpellRecords(caster), record], "system.activeSpellCastingsMigrated": true});
    }
    if (!message) {
      const item = sealedSpellSource({flags: {[SCOPE]: {releasedSeal: spell}}}, actor);
      const {rollUnder} = await import("./dice.mjs");
      const released = await rollUnder({actor, item, kind: "spell", label: spell.name, target: spell.target,
        castingId: spell.context.castingId, powerLevelCounts: currentCastingCounts(spell.context),
        releasedSeal: {id: releaseMessageId, spell, objectName: effect.parent.name, userId: user.id, target,
          actorUuid: actor.uuid, tracked}});
      message = game.messages.get(releaseMessageId);
      if (!message) return null;
      if (!released.success && tracked) {
        await caster.update({"system.activeSpellCastings":activeSpellRecords(caster).filter(row=>row.id!==record.id),
          "system.activeSpellCastingsMigrated":true});
      }
    }
    await effect.delete();
    return message;
  });
}

export async function handleSealRequest(payload) {
  const user = game.users?.get(payload.userId);
  if (!writer() || !user?.active) return {status: "unavailable"};
  if (payload.action === "place") {
    const message = game.messages.get(payload.messageId);
    const item = await foundry.utils.fromUuid(payload.itemUuid);
    const effect = await prepareMagicSeal(message, item, user);
    return effect ? {status: "placed", effectUuid: effect.uuid} : {status: "unavailable"};
  }
  const effect = await foundry.utils.fromUuid(payload.effectUuid);
  if (payload.action === "release") {
    const message = await releaseOnAuthority(effect, user, payload);
    return message ? {status: "released", messageId: message.id} : {status: "unavailable"};
  }
  if (!validSeal(effect)) return {status: "unavailable"};
  const key = stateOf(effect).releaseMessageId;
  return await once(key, async () => {
    const reservation = reservations.get(key);
    const matches = reservation && reservation.userId === user.id && reservation.token === payload.token;
    if (payload.action === "cancel") {
      if (matches) reservations.delete(key);
      return {status: "cancelled"};
    }
    const actor = await foundry.utils.fromUuid(payload.actorUuid);
    const item = await foundry.utils.fromUuid(payload.spellUuid);
    if (!canBindSpell(effect, actor, item, user)) return {status: "unavailable"};
    if (payload.action === "reserve") {
      if (reservation?.expires > Date.now()) return {status: "busy"};
      const token = crypto.randomUUID();
      reservations.set(key, {token, userId: user.id, actorUuid: actor.uuid, spellUuid: item.uuid, expires: Date.now() + 600000});
      return {status: "reserved", token};
    }
    if (payload.action !== "store" || !matches || reservation.actorUuid !== actor.uuid ||
        reservation.spellUuid !== item.uuid || reservation.expires <= Date.now()) return {status: "unavailable"};
    let roll;
    try { roll = Roll.fromData(payload.roll); } catch { return {status: "unavailable"}; }
    const die = Number(roll?.total), context = payload.context;
    if (roll?.formula !== "1d20" || !Number.isInteger(die) || die < 1 || die > 20 ||
        !Number.isFinite(payload.target) || !resolveRollUnderOutcome(die, payload.target).success ||
        context?.casterUuid !== actor.uuid || context?.sourceId !== (item.system.catalogId || "") ||
        context?.kind !== "spell" || !context.castingId || !Array.isArray(payload.levels) ||
        !Number.isFinite(payload.cost) || payload.cost < 0) return {status: "unavailable"};
    const result = await commitSealedSpell(effect, item, payload);
    reservations.delete(key);
    return result;
  }) ?? {status: "busy"};
}

async function requestSeal(action, data) {
  const payload = {type: "trudvangSeal", requestId: crypto.randomUUID(), userId: game.user.id, action, ...data};
  if (writer()) return handleSealRequest(payload);
  if (!game.users?.activeGM || !game.socket) return {status: "unavailable"};
  registerSealSocket();
  return new Promise(resolve => {
    const timer = setTimeout(() => { replies.delete(payload.requestId); resolve({status:"unavailable"}); }, 60000);
    replies.set(payload.requestId, {timer, resolve});
    game.socket.emit(CHANNEL, payload);
  });
}

export function registerSealSocket() {
  if (socketRegistered || !game.socket) return;
  socketRegistered = true;
  game.socket.on(CHANNEL, async payload => {
    if (payload?.type === "trudvangSealReply" && payload.userId === game.user.id) {
      const reply = replies.get(payload.requestId);
      if (reply) { clearTimeout(reply.timer); replies.delete(payload.requestId); reply.resolve(payload.result); }
      return;
    }
    if (payload?.type !== "trudvangSeal" || !writer()) return;
    let result;
    try { result = await handleSealRequest(payload); }
    catch (error) { console.error("Trudvang | Seal request failed", error); result = {status:"unavailable"}; }
    game.socket.emit(CHANNEL, {type:"trudvangSealReply", userId:payload.userId, requestId:payload.requestId, result});
  });
}

export async function dropMagicSeal(messageId, item) {
  const result = validItem(item) && await requestSeal("place", {messageId, itemUuid:item.uuid});
  if (result?.status !== "placed") return ui.notifications.warn(local(item ? "Unavailable" : "DropHint"));
  return result;
}
