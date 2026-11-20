import {FATAL_MAGIC_ROWS, absorbsVitnerFrom} from "./rules/fatal-magic.mjs";
import {bodyHealthUpdate} from "./rules/body-health.mjs";
import {temporaryHealthState, temporaryHealthUpdate} from "./rules/transformation-profile.mjs";
import {zonePixelScale} from "./rules/spell-zones.mjs";

const SCOPE = "trudvang-chronicles";
const RESULT = `flags.${SCOPE}.fatalMagicResult`;
const rollTotal = async formula => Number((await new Roll(formula).evaluate()).total);

function tokenCenter(token, size) {
  return token.getCenterPoint?.() ?? {x: Number(token.x) + Number(token.width) * size / 2,
    y: Number(token.y) + Number(token.height) * size / 2};
}

export function fatalVitnerRecipients(origin, radius, excludeCaster) {
  const scene = origin.parent;
  const scale = zonePixelScale(scene);
  const size = Number(scene.grid?.size || 1);
  const center = tokenCenter(origin, size);
  const targets = new Map();
  for (const token of scene.tokens) {
    const actor = token.actor;
    const inLevel = !origin.level || (token.includedInLevel?.(origin.level) ?? (!token.level || token.level === origin.level));
    if (!actor || !["character", "npc"].includes(actor.type) || !inLevel
        || (excludeCaster && actor.uuid === origin.actor.uuid)) continue;
    const points = token.getContainmentTestPoints?.();
    const footprint = points?.length ? points : [tokenCenter(token, size)];
    if (!footprint.some(point => Math.hypot(point.x - center.x, point.y - center.y) <= radius * scale + 0.01)) continue;
    const existing = targets.get(actor.uuid);
    if (!existing || (existing.hidden && !token.hidden)) {
      targets.set(actor.uuid, {actorUuid: actor.uuid, name: token.name, hidden: Boolean(token.hidden)});
    }
  }
  return [...targets.values()];
}

export function fatalAreaOrigin(actor, speaker) {
  if (actor?.token?.uuid) return actor.token.uuid;
  const selected = (globalThis.canvas?.tokens?.controlled ?? []).filter(token => token.actor?.uuid === actor?.uuid);
  if (selected.length === 1) return selected[0].document?.uuid ?? "";
  if (selected.length > 1) return "";
  const token = globalThis.game?.scenes?.get(speaker?.scene)?.tokens.get(speaker?.token);
  return token?.actor?.uuid === actor?.uuid ? token?.uuid ?? "" : "";
}

async function drainVictim(actor, rolled, messageId) {
  const receipt = `flags.${SCOPE}.fatalVitnerLoss.${messageId}`;
  const previous = actor.getFlag(SCOPE, "fatalVitnerLoss")?.[messageId];
  if (previous?.resource) return previous;
  const {vitner, body} = actor.system.resources;
  if (absorbsVitnerFrom(actor)) {
    const current = Math.max(0, Number(vitner.current ?? vitner.value ?? 0));
    const amount = Math.min(current, rolled);
    const stored = Number(actor._source.system.resources.vitner.value || 0);
    const result = {resource: "vitner", amount};
    await actor.update({[receipt]: result, "system.resources.vitner.value": Math.max(0, stored - amount)});
    return result;
  }
  const temporary = temporaryHealthState(actor);
  const paid = Math.min(rolled, temporary.current);
  const health = rolled - paid;
  const result = {resource: "health", amount: rolled};
  await actor.update({
    [receipt]: result,
    ...(paid ? temporaryHealthUpdate(actor, temporary.current - paid) : {}),
    ...(health ? bodyHealthUpdate(actor, Number(body.current ?? body.value) - health) : {})
  });
  return result;
}

/** Runs through the existing serialized chat authority, with the area and
 * rolled losses frozen before editing any recipient. */
export async function applyFatalVitnerArea(message) {
  const result = message.getFlag(SCOPE, "fatalMagicResult");
  const rule = FATAL_MAGIC_ROWS[result?.row];
  const total = Number(message.rolls?.[0]?.total);
  if (!rule?.drain || !Number.isInteger(total) || total < result.row || total > rule.last) return {status: "unavailable"};
  if (result.applied) return {status: "alreadyApplied"};
  const caster = await foundry.utils.fromUuid(result.actorUuid);
  if (!caster) return {status: "unavailable"};
  const source = result.tokenUuid ? await foundry.utils.fromUuid(result.tokenUuid) : null;
  const scene = source?.parent;
  if (!scene?.tokens || source.actor?.uuid !== caster.uuid) return {status: "noOrigin"};
  // The message author may edit message flags. Only the GM's plan on the
  // scene can specify which actors are written to, or how much they lose.
  const planPath = `flags.${SCOPE}.fatalVitnerPlans.${message.id}`;
  let plan = scene.getFlag(SCOPE, "fatalVitnerPlans")?.[message.id];
  if (!plan) {
    const radius = await rollTotal("1d10x>=10");
    const victims = fatalVitnerRecipients(source, radius, rule.excludeCaster);
    for (const victim of victims) victim.rolled = await rollTotal(rule.drain);
    plan = {row: result.row, casterUuid: caster.uuid, radius, victims, blindness: rule.blindness ? await rollTotal(rule.blindness) : 0};
    await scene.update({[planPath]: plan});
  }
  if (plan.row !== result.row || plan.casterUuid !== caster.uuid) return {status: "unavailable"};
  if (plan.blindness && !caster.effects.get(message.id)) {
    const name = game.i18n.localize("TRUDVANG.FatalMagic.BlindnessEffect");
    const summary = game.i18n.localize("TRUDVANG.FatalMagic.Blindness");
    const effect = await caster.createTrudvangEffect({
      _id: message.id, name, img: "icons/svg/daze.svg", description: summary,
      duration: {value: plan.blindness, units: "days"},
      system: {stackId: `fatal-magic:${message.id}`, changes: []},
      flags: {[SCOPE]: {summary, fatalMagic: {resultId: message.id, blindness: true}}}
    }, {keepId: true});
    if (!effect) return {status: "unavailable"};
  }
  const outcomes = [];
  for (const victim of plan.victims) {
    const actor = await foundry.utils.fromUuid(victim.actorUuid);
    if (actor) {
      await drainVictim(actor, victim.rolled, message.id);
      const {rolled, ...display} = victim;
      outcomes.push(display);
    }
  }
  await message.update({[`${RESULT}.outcomes`]: outcomes, [`${RESULT}.radius`]: plan.radius, [`${RESULT}.applied`]: true});
  return {status: "applied"};
}
