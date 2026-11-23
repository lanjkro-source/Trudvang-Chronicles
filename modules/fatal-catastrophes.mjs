import {normalizeEffectDuration} from "./rules/effect-duration.mjs";
import {fatalBodyLossUpdates} from "./rules/fatal-body-loss.mjs";
import {storedVitnerForCurrent} from "./rules/fatal-magic.mjs";

const SCOPE = "trudvang-chronicles";
const local = key => game.i18n.localize(`TRUDVANG.FatalMagic.${key}`);

export async function fatalCondition(actor, message, role, data = {}) {
  const stackId = `fatal-magic:${message.id}:${role}`;
  const existing = Array.from(actor.effects.values()).find(effect => effect.system?.stackId === stackId);
  if (existing) return existing;
  const summary = local(`${role}Rule`);
  const effect = await actor.createTrudvangEffect({
    name: local(role), description: summary, img: "icons/svg/aura.svg",
    duration: data.duration ? normalizeEffectDuration(data.duration) : {value: null},
    system: {stackId, changes: []},
    flags: {[SCOPE]: {summary, fatalMagic: {resultId: message.id, ...data.flags}}}
  });
  if (!effect) throw Error("Fatal magic effect was not created");
  return effect;
}

export async function applyFatalPortal(actor, message, token) {
  const effect = await fatalCondition(actor, message, "Portal", {flags: {absent: true}});
  if (token?.actor?.uuid === actor.uuid && !token.hidden && token.canUserModify(game.user, "update")) {
    await token.update({hidden: true});
  }
  await message.update({[`flags.${SCOPE}.fatalMagicResult.applied`]: effect.name});
}

export async function finishFatalOrb(actor, message, token) {
  const departure = await fatalCondition(actor, message, "Disappeared", {flags: {absent: true}});
  if (token && !token.hidden) await token.update({hidden: true});
  await clearFatalOrb(actor, message);
  return departure.name;
}

export async function clearFatalOrb(actor, message) {
  const orb = Array.from(actor.effects.values()).find(effect => effect.system?.stackId === `fatal-magic:${message.id}:Orb`);
  if (orb) await orb.delete();
}

export async function fatalHealthLoss(actor, message, amount) {
  if (actor.getFlag(SCOPE, "fatalVitnerLoss")?.[message.id]) return;
  await actor.update({
    [`flags.${SCOPE}.fatalVitnerLoss.${message.id}`]: {resource: "health", amount},
    ...fatalBodyLossUpdates(actor, amount)
  });
}

export async function blockFatalRecovery(actor, message, days) {
  if (actor.getFlag(SCOPE, "fatalRecoveryLoss")?.[message.id]) return;
  await fatalCondition(actor, message, "RecoveryBlocked", {duration: {value: days, units: "days"},
    flags: {recoveryBlocked: true}});
  const current = Math.max(0, Number(actor.system.resources.vitner.current ?? 0));
  await actor.update({
    [`flags.${SCOPE}.fatalRecoveryLoss.${message.id}`]: true,
    "system.resources.vitner.value": storedVitnerForCurrent(actor, Math.ceil(current / 2))
  });
}

export async function offerFatalBlindness(actor, message, minutes) {
  const receipt = `flags.${SCOPE}.fatalFlash.${message.id}`;
  if (actor.getFlag(SCOPE, "fatalFlash")?.[message.id]) return;
  const name = local("BlindFlash");
  const description = local("BlindFlashRule");
  const existing = actor.effects.get(message.id);
  const effect = existing ?? await actor.createTrudvangEffect({
    _id: message.id, name: game.i18n.format("TRUDVANG.InitialResistance.PendingName", {effect: name}),
    description: local("ResistFlash"), img: "icons/svg/daze.svg",
    duration: {value: null}, system: {stackId: `fatal-magic:${message.id}:flash`, changes: []},
    flags: {[SCOPE]: {
      initialResistance: {id: message.id, testIndex: 0, resolved: false, messageId: "", payload: {
        name, description, summary: description, summaryResolved: true, changes: [], statuses: ["blind"],
        duration: normalizeEffectDuration({value: minutes, units: "minutes"})
      }},
      consequenceTests: [{sv: 10, trait: ["psyche"], traitMethod: "first", action: local("ResistFlash")}]
    }}
  }, {keepId: true});
  if (!effect) throw Error("Fatal magic resistance effect was not created");
  const {announceInitialResistance} = await import("./initial-resistance.mjs");
  await announceInitialResistance(effect, actor);
  await actor.update({[receipt]: true});
}

export async function applyFatalMagicalDamage(actor, token, message, damage) {
  const {rollDamage} = await import("./dice.mjs");
  const {requestChatApplication} = await import("./chat-application.mjs");
  const event = `fatal-burst:${message.id}:${actor.uuid}`;
  let card = Array.from(game.messages.values()).find(row => row.getFlag(SCOPE, "persistentDamageEvent") === event);
  if (!card) {
    const privateRoll = message.blind || message.whisper?.length || token.hidden;
    const recipients = Array.from(game.users.values()).filter(user => user.isGM
      || (!message.blind && actor.testUserPermission(user, "OWNER"))).map(user => user.id);
    const rolled = await rollDamage({
      actor, item: {name: local("Burst"), img: "icons/svg/aura.svg",
        system: {category: "magic", damage, openRoll: 0, strengthApplies: false}},
      context: {usage: "magic", automatic: true, ignoreActorDamage: true, returnMessage: true,
        boundActorUuid: actor.uuid, persistentDamageEvent: event, targets: [token],
        qualification: {nature: "magical", delivery: "other", protection: "magical"}, protectionLocked: true,
        ...(privateRoll ? {whisper: recipients} : {})}
    });
    card = rolled?.message;
  }
  if (!card) throw Error("Fatal magic damage card was not created");
  const result = await requestChatApplication({message: card, actor, token, channel: "body"});
  if (!["applied", "alreadyApplied"].includes(result.status)) throw Error("Fatal magic damage application failed");
}
