import {applyDamageToActor, applyDamageToDefenseItem, prepareDamageTargets} from "./damage-application.mjs";
import {renderTemplate} from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const SOCKET_CHANNEL = `system.${SYSTEM_ID}`;
const queues = new Map();
const unrecorded = new Map();
const replies = new Map();
let registered = false;
const authorId = message => message?.author?.id ?? message?._source?.author;
const rowsFor = message => message.getFlag(SYSTEM_ID, "applications") ?? [];

export function hasChatApplication(message, actorUuid, channel, itemUuid = "") {
  return rowsFor(message).some(row => row.actorUuid === actorUuid && row.channel === channel
    && (channel !== "defense" || row.itemUuid === itemUuid));
}

function responderFor(message) {
  const users = Array.from(game.users?.values?.() ?? game.users ?? []);
  const author = users.find(user => user.id === authorId(message));
  if (author?.active && author.isGM) return author;
  return users.filter(user => user.active && user.isGM).sort((a, b) => a.id.localeCompare(b.id))[0];
}

function sourceAmount(message, channel) {
  // The roll card's action attributes are the contract, including custom cards;
  // never trust a numerical value supplied by a player's socket payload.
  const attribute = channel === "fear" ? "fear" : "damage";
  const match = String(message.content ?? "").match(new RegExp(`\\bdata-${attribute}=["']([\\d.]+)["']`));
  const amount = match ? Number(match[1]) : NaN;
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function canReadMessage(message, user) {
  const whispers = Array.from(message.whisper ?? [], recipient => typeof recipient === "string" ? recipient : recipient.id);
  return user.isGM || (!message.blind && (!whispers.length || authorId(message) === user.id || whispers.includes(user.id)));
}

async function addDamageTargetsOnGM(payload) {
  const message = game.messages.get(payload.messageId), user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !canReadMessage(message, user)) return {status: "unavailable"};
  const section = /<section\b[^>]*\bdata-damage-targets(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/;
  const total = sourceAmount(message, "body");
  if (total === null || !section.test(message.content)) return {status: "unavailable"};
  const targets = [...(message.getFlag(SYSTEM_ID, "damageTargets") ?? [])];
  const seen = new Set(targets.map(target => target.actorUuid));
  let added = 0;
  for (const uuid of new Set(payload.tokenUuids ?? [])) {
    const token = await foundry.utils.fromUuid(uuid);
    if (token?.documentName !== "Token" || !["character", "npc"].includes(token.actor?.type)
      || !token.actor.testUserPermission(user, "OWNER")) continue;
    const [target] = prepareDamageTargets([token]);
    if (!target || seen.has(target.actorUuid)) continue;
    targets.push(target); seen.add(target.actorUuid); added++;
  }
  if (!added) return {status: "unchanged", added: 0};
  const html = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-targets.hbs", {total, targets});
  await message.update({content: message.content.replace(section, () => html), [`flags.${SYSTEM_ID}.damageTargets`]: targets});
  return {status: "added", added};
}

async function applyOnGM(payload) {
  const message = game.messages.get(payload.messageId);
  const user = game.users.get(payload.userId);
  if (!game.user.isGM || !message || !user?.active || !["body", "fear", "defense"].includes(payload.channel)) return {status: "unavailable"};
  if (!canReadMessage(message, user)) return {status: "unavailable"};
  const amount = sourceAmount(message, payload.channel);
  if (amount === null) return {status: "unavailable"};
  const actor = await foundry.utils.fromUuid(payload.actorUuid);
  if (!actor?.isOwner || !["character", "npc"].includes(actor.type)
    || !actor.testUserPermission(user, "OWNER") || (payload.channel === "fear" && actor.type !== "character")) return {status: "unavailable"};
  let item = null;
  if (payload.channel === "body" && !String(message.content).includes(`data-target-actor-uuid="${actor.uuid}"`)) return {status: "unavailable"};
  if (payload.channel === "defense") {
    item = await foundry.utils.fromUuid(payload.itemUuid);
    if (!item?.isOwner || !["weapon", "shield"].includes(item.type) || item.parent?.uuid !== actor.uuid
      || !String(message.content).includes(`data-target-item-uuid="${item.uuid}"`)) return {status: "unavailable"};
  }
  if (hasChatApplication(message, actor.uuid, payload.channel, item?.uuid)) return {status: "alreadyApplied"};
  // Retain an applied result until the source update succeeds. A retry after a
  // chat/network failure must record the row, not take the points a second time.
  const pending = unrecorded.get(message.id) ?? [];
  let appliedRow = pending.find(row => row.actorUuid === actor.uuid && row.channel === payload.channel
    && (payload.channel !== "defense" || row.itemUuid === item?.uuid));
  if (!appliedRow) {
    const result = payload.channel === "fear" ? await actor.applyFearFactor(amount, {announce: false})
      : payload.channel === "defense" ? await applyDamageToDefenseItem({item, damage: amount})
        : await applyDamageToActor({actor, damage: amount, ignoreArmor: payload.ignoreArmor === true, announce: false});
    if (!result) return {status: "unavailable"};
    appliedRow = {actorUuid: actor.uuid, tokenUuid: "", name: actor.name, channel: payload.channel,
      itemUuid: item?.uuid ?? "", itemName: item?.name ?? "",
      amount: Number(result.applied ?? result.integrityLoss ?? result.bodyDamage), ignoreArmor: payload.ignoreArmor === true};
    pending.push(appliedRow); unrecorded.set(message.id, pending);
    const token = payload.tokenUuid ? await foundry.utils.fromUuid(payload.tokenUuid) : actor.token;
    if (token?.documentName === "Token" && token.actor?.uuid === actor.uuid) {
      appliedRow.tokenUuid = token.uuid; appliedRow.name = token.name || actor.name;
    }
  }
  const rows = [...rowsFor(message), ...pending.filter(row => !hasChatApplication(message, row.actorUuid, row.channel, row.itemUuid))];
  const html = await renderTemplate("systems/trudvang-chronicles/templates/chat/application-results.hbs", {
    rows: rows.map(row => ({...row,
      label: row.channel === "defense" ? game.i18n.format("TRUDVANG.ChatApplication.DefenseName", {actor: row.name, item: row.itemName}) : row.name,
      icon: row.channel === "fear" ? "fa-face-grimace" : row.channel === "defense" ? "fa-shield" : "fa-heart-crack",
      result: game.i18n.format(`TRUDVANG.ChatApplication.${row.channel === "fear" ? "Fear" : row.channel === "defense" ? "Integrity" : "Body"}Amount`, {amount: row.amount})}))
  });
  const original = String(message.content);
  const section = /<section\b[^>]*\bdata-application-results(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/;
  const content = section.test(original) ? original.replace(section, () => html)
    : /<\/article>\s*$/.test(original) ? original.replace(/<\/article>(\s*)$/, () => `${html}</article>`) : `${original}${html}`;
  await message.update({content, [`flags.${SYSTEM_ID}.applications`]: rows});
  unrecorded.delete(message.id);
  return {status: "applied", amount: appliedRow.amount};
}

/** One writer per source card serializes simultaneous clients: no lost rows and
 * no second application when the same actor's owners click at the same time.
 */
export async function applyChatApplication(payload) {
  const previous = queues.get(payload.messageId) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => payload.type === "chatDamageTargets" ? addDamageTargetsOnGM(payload) : applyOnGM(payload));
  queues.set(payload.messageId, next);
  try { return await next; }
  finally { if (queues.get(payload.messageId) === next) queues.delete(payload.messageId); }
}

export function registerChatApplicationSocket() {
  if (registered || !game.socket) return;
  registered = true;
  game.socket.on(SOCKET_CHANNEL, async payload => {
    if (payload?.type === "chatApplicationReply" && payload.userId === game.user.id) {
      const pending = replies.get(payload.requestId);
      if (!pending) return;
      clearTimeout(pending.timeout); replies.delete(payload.requestId); pending.resolve(payload.result);
      return;
    }
    if (!["chatApplication", "chatDamageTargets"].includes(payload?.type) || !game.user.isGM
      || responderFor(game.messages.get(payload.messageId))?.id !== game.user.id) return;
    let result;
    try { result = await applyChatApplication(payload); }
    catch (error) { console.error("Trudvang | Chat application failed", error); result = {status: "unavailable"}; }
    game.socket.emit(SOCKET_CHANNEL, {type: "chatApplicationReply", requestId: payload.requestId, userId: payload.userId, result});
  });
}

export async function requestChatApplication({message, actor, token, channel, itemUuid = "", ignoreArmor = false}) {
  if (!actor?.isOwner) return {status: "unavailable"};
  if (hasChatApplication(message, actor.uuid, channel, itemUuid)) return {status: "alreadyApplied"};
  const payload = {type: "chatApplication", requestId: crypto.randomUUID(), messageId: message.id,
    userId: game.user.id, actorUuid: actor.uuid, tokenUuid: token?.document?.uuid ?? token?.uuid ?? actor.token?.uuid ?? "",
    channel, itemUuid, ignoreArmor};
  return requestChatUpdate(message, payload);
}

export async function requestDamageTargets({message, tokens}) {
  const tokenUuids = Array.from(tokens ?? []).filter(token => token.actor?.isOwner)
    .map(token => token.document?.uuid ?? token.uuid).filter(Boolean);
  if (!tokenUuids.length) return {status: "unavailable"};
  return requestChatUpdate(message, {type: "chatDamageTargets", requestId: crypto.randomUUID(),
    messageId: message.id, userId: game.user.id, tokenUuids});
}

async function requestChatUpdate(message, payload) {
  const responder = responderFor(message);
  if (!responder || (responder.id !== game.user.id && !game.socket)) return {status: "unavailable"};
  if (responder.id === game.user.id) return applyChatApplication(payload);
  return new Promise(resolve => {
    const timeout = setTimeout(() => { replies.delete(payload.requestId); resolve({status: "unavailable"}); }, 30000);
    replies.set(payload.requestId, {resolve, timeout});
    game.socket.emit(SOCKET_CHANNEL, payload);
  });
}
