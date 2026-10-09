import {renderTemplate} from "./helpers.mjs";
import {TRUDVANG} from "./config.mjs";
import {resolveRollUnderOutcome} from "./rules/roll-under-resolver.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const SOCKET_CHANNEL = `system.${SYSTEM_ID}`;
const CLAIM_LIFETIME_MS = 90000;
const claims = new Map();
const inFlight = new Set();
const awaitingReply = new Map();
let socketRegistered = false;

function responderFor(message) {
  const author = game.users.get(message?.user);
  if (author?.active && author.isGM) return author;
  return game.users.filter(user => user.active && user.isGM).sort((a, b) => a.id.localeCompare(b.id))[0];
}

export function hasTraitSituationResponse(message, actorUuid) {
  return Boolean(message?.getFlag(SYSTEM_ID, "traitSituation")?.responses?.some(entry => entry.actorUuid === actorUuid));
}

function responseView(entry) {
  const outcome = entry.result === 1 ? "perfectSuccess" : entry.result === 20 ? "perfectFailure"
    : entry.success ? "success" : "failure";
  return {...entry, outcome, outcomeLabel: game.i18n.localize(`TRUDVANG.Dialog.TraitSituationResult.${outcome}`)};
}

async function cardContent(message, request, responses) {
  const author = game.users.get(message.user);
  const traitLabel = request.traitKey === "aucun"
    ? game.i18n.localize("TRUDVANG.Dialog.TraitSituationNoTrait")
    : game.i18n.localize(TRUDVANG.traits[request.traitKey]);
  const buttonLabel = request.traitKey === "aucun"
    ? game.i18n.localize("TRUDVANG.Dialog.GenericSituationTitle")
    : game.i18n.format("TRUDVANG.Dialog.TraitSituationButton", {trait: traitLabel});
  return renderTemplate("systems/trudvang-chronicles/templates/chat/trait-situation-request-card.hbs", {
    gmName: author?.name ?? "",
    gmImg: author?.avatar || "icons/svg/d20.svg",
    title: String(request.title ?? "").trim() || buttonLabel,
    buttonLabel,
    traitKey: request.traitKey,
    sv: request.sv,
    success: request.success ?? "",
    failure: request.failure ?? "",
    responses: responses.map(responseView)
  });
}

async function contextFor({messageId, actorUuid, userId}) {
  const message = game.messages.get(messageId);
  const request = message?.getFlag(SYSTEM_ID, "traitSituation");
  const user = game.users.get(userId);
  if (!game.user.isGM || !message || !request
    || !(request.traitKey === "aucun" || TRUDVANG.traits[request.traitKey])
    || !Number.isInteger(request.sv) || !user?.active) return null;
  const actor = await foundry.utils.fromUuid(actorUuid);
  if (!actor || !["character", "npc"].includes(actor.type) || !actor.testUserPermission(user, "OWNER")) return null;
  return {message, request, actor};
}

/** Reserve an actor before its player rolls, so concurrent clicks cannot produce extra dice. */
export async function claimTraitSituationRoll(payload) {
  const context = await contextFor(payload);
  if (!context || !Number.isFinite(payload.modifier) || !payload.claimId) return "unavailable";
  const key = `${payload.messageId}:${context.actor.uuid}`;
  const existing = claims.get(key);
  if (existing && existing.expires <= Date.now()) claims.delete(key);
  if (claims.has(key) || inFlight.has(key) || hasTraitSituationResponse(context.message, context.actor.uuid)) return "alreadyRolled";
  claims.set(key, {claimId: payload.claimId, userId: payload.userId, expires: Date.now() + CLAIM_LIFETIME_MS});
  return "claimed";
}

export function releaseTraitSituationRoll(payload) {
  if (!game.user.isGM) return;
  const key = `${payload.messageId}:${payload.actorUuid}`;
  const claim = claims.get(key);
  if (claim?.claimId === payload.claimId && claim.userId === payload.userId && !inFlight.has(key)) claims.delete(key);
}

/** Only the card's GM writes the result; the die value comes from the player's local roll. */
export async function recordTraitSituationResponse(payload) {
  const context = await contextFor(payload);
  if (!context || !Number.isFinite(payload.modifier) || !Number.isInteger(payload.result)
    || payload.result < 1 || payload.result > 20) return "unavailable";
  const {message, request, actor} = context;
  const key = `${payload.messageId}:${actor.uuid}`;
  const claim = claims.get(key);
  if (hasTraitSituationResponse(message, actor.uuid) || inFlight.has(key)) return "alreadyRolled";
  if (!claim || claim.claimId !== payload.claimId || claim.userId !== payload.userId || claim.expires <= Date.now()) return "unavailable";
  inFlight.add(key);
  try {
    const token = payload.tokenUuid ? await foundry.utils.fromUuid(payload.tokenUuid) : null;
    const linkedToken = token?.documentName === "Token" && token.actor?.uuid === actor.uuid ? token : null;
    const hasTrait = request.traitKey !== "aucun";
    const target = request.sv + (hasTrait ? Number(actor.getTraitValue(request.traitKey)) : 0)
      + Number(actor.getRollModifier(hasTrait ? {kind: "trait", traitKey: request.traitKey} : {kind: "situation"}))
      + payload.modifier;
    const {success} = resolveRollUnderOutcome(payload.result, target);
    const responses = [...(request.responses ?? []), {
      actorUuid: actor.uuid,
      tokenUuid: linkedToken?.uuid ?? "",
      name: linkedToken?.name || actor.name,
      result: payload.result,
      target,
      success
    }];
    const content = await cardContent(message, request, responses);
    await message.update({content, [`flags.${SYSTEM_ID}.traitSituation.responses`]: responses});
    return "recorded";
  } finally {
    inFlight.delete(key);
    claims.delete(key);
  }
}

export function registerTraitSituationSocket() {
  if (socketRegistered || !game.socket) return;
  socketRegistered = true;
  game.socket.on(SOCKET_CHANNEL, async payload => {
    if (payload?.type === "traitSituationReply" && payload.userId === game.user.id) {
      const pending = awaitingReply.get(payload.requestId);
      if (!pending) return;
      clearTimeout(pending.timeout);
      awaitingReply.delete(payload.requestId);
      pending.resolve(payload.status);
      return;
    }
    if (!game.user.isGM || !["traitSituationClaim", "traitSituationSubmit", "traitSituationRelease"].includes(payload?.type)) return;
    const message = game.messages.get(payload.messageId);
    if (responderFor(message)?.id !== game.user.id) return;
    if (payload.type === "traitSituationRelease") return releaseTraitSituationRoll(payload);
    let status;
    try {
      status = payload.type === "traitSituationClaim"
        ? await claimTraitSituationRoll(payload) : await recordTraitSituationResponse(payload);
    } catch (error) {
      console.error("Trudvang Chronicles | Resistance roll could not be recorded", error);
      status = "unavailable";
    }
    game.socket.emit(SOCKET_CHANNEL, {type: "traitSituationReply", requestId: payload.requestId, userId: payload.userId, status});
  });
}

function sendToGM(payload, responder) {
  if (responder.id === game.user.id) {
    if (payload.type === "traitSituationClaim") return claimTraitSituationRoll(payload);
    if (payload.type === "traitSituationSubmit") return recordTraitSituationResponse(payload);
    releaseTraitSituationRoll(payload);
    return Promise.resolve();
  }
  if (payload.type === "traitSituationRelease") {
    game.socket.emit(SOCKET_CHANNEL, payload);
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      awaitingReply.delete(payload.requestId);
      resolve("unavailable");
    }, 30000);
    awaitingReply.set(payload.requestId, {resolve, timeout});
    game.socket.emit(SOCKET_CHANNEL, payload);
  });
}

export async function requestTraitSituationResponse({message, actor, token, modifier}) {
  if (hasTraitSituationResponse(message, actor.uuid)) return "alreadyRolled";
  const responder = responderFor(message);
  if (!responder || (responder.id !== game.user.id && !game.socket)) return "unavailable";
  const base = {
    messageId: message.id,
    actorUuid: actor.uuid,
    tokenUuid: token?.document?.uuid ?? "",
    modifier: Number(modifier),
    userId: game.user.id,
    claimId: crypto.randomUUID()
  };
  const claimed = await sendToGM({...base, type: "traitSituationClaim", requestId: crypto.randomUUID()}, responder);
  if (claimed !== "claimed") return claimed;
  try {
    const roll = await new Roll("1d20").evaluate();
    const result = Number(roll.total);
    if (game.modules?.get("dice-so-nice")?.active && typeof game.dice3d?.showForRoll === "function") {
      try {
        Promise.resolve(game.dice3d.showForRoll(roll, game.user, true, [], false, undefined,
          ChatMessage.getSpeaker({actor}))).catch(error =>
          console.error("Trudvang Chronicles | Resistance roll animation failed", error));
      } catch (error) {
        console.error("Trudvang Chronicles | Resistance roll animation failed", error);
      }
    }
    return await sendToGM({...base, result, type: "traitSituationSubmit", requestId: crypto.randomUUID()}, responder);
  } catch (error) {
    console.error("Trudvang Chronicles | Resistance roll failed", error);
    return "unavailable";
  } finally {
    await sendToGM({...base, type: "traitSituationRelease"}, responder);
  }
}
