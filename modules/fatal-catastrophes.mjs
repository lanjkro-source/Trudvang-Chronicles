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
    [`flags.${SCOPE}.fatalRecoveryLoss.${message.id}`]: {amount: Math.floor(current / 2)},
    "system.resources.vitner.value": storedVitnerForCurrent(actor, Math.ceil(current / 2))
  });
}

export async function offerFatalBlindness(actor, message, minutes) {
  const receipt = `flags.${SCOPE}.fatalFlash.${message.id}`;
  const previous = actor.getFlag(SCOPE, "fatalFlash")?.[message.id];
  if (previous && typeof previous === "object") return previous;
  const name = local("BlindFlash");
  const description = local("BlindFlashRule");
  const existing = actor.effects.get(message.id);
  const effect = existing ?? await actor.createTrudvangEffect({
    _id: message.id, name: game.i18n.format("TRUDVANG.InitialResistance.PendingName", {effect: name}),
    description: local("ResistFlash"), img: "icons/svg/daze.svg",
    duration: {value: null}, system: {stackId: `fatal-magic:${message.id}:flash`, changes: []},
    flags: {[SCOPE]: {
      initialResistance: {id: message.id, testIndex: 0, resolved: false, messageId: "", areaMessageId: message.id, payload: {
        name, description, summary: description, summaryResolved: true, changes: [], statuses: ["blind"],
        duration: normalizeEffectDuration({value: minutes, units: "minutes"})
      }},
      consequenceTests: [{kind: "resist", sv: 10, trait: ["psyche"], traitMethod: "first", actionKey: "TRUDVANG.FatalMagic.ResistFlash"}]
    }}
  }, {keepId: true});
  if (!effect) throw Error("Fatal magic resistance effect was not created");
  if (existing) await effect.update({[`flags.${SCOPE}.initialResistance.areaMessageId`]: message.id});
  const pending = {effectUuid: effect.uuid};
  await actor.update({[receipt]: pending});
  return pending;
}
