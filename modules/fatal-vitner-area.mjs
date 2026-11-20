import {FATAL_MAGIC_ROWS, absorbsVitnerFrom, fatalMagicHasArea, fatalNegationAppearance} from "./rules/fatal-magic.mjs";
import {fatalBodyLossUpdates} from "./rules/fatal-body-loss.mjs";
import {zonePixelScale} from "./rules/spell-zones.mjs";
import {auraColor} from "./aura.mjs";

const SCOPE = "trudvang-chronicles";
const RESULT = `flags.${SCOPE}.fatalMagicResult`;
const rollTotal = async formula => Number((await new Roll(formula).evaluate()).total);
const removals = new WeakMap();

function tokenCenter(token, size) {
  return token.getCenterPoint?.() ?? {x: Number(token.x) + Number(token.width) * size / 2,
    y: Number(token.y) + Number(token.height) * size / 2};
}

function eligibleToken(token, origin, excludeCaster) {
  const actor = token.actor;
  const inLevel = !origin.level || (token.includedInLevel?.(origin.level) ?? (!token.level || token.level === origin.level));
  return actor && ["character", "npc"].includes(actor.type) && inLevel
    && (!excludeCaster || actor.uuid !== origin.actor.uuid);
}

export function fatalVitnerRecipients(origin, radius, excludeCaster) {
  const scene = origin.parent;
  const scale = zonePixelScale(scene);
  const size = Number(scene.grid?.size || 1);
  const center = tokenCenter(origin, size);
  const targets = new Map();
  for (const token of scene.tokens.values()) {
    if (!eligibleToken(token, origin, excludeCaster)) continue;
    const actor = token.actor;
    const points = token.getContainmentTestPoints?.();
    const footprint = points?.length ? points : [tokenCenter(token, size)];
    if (!footprint.some(point => Math.hypot(point.x - center.x, point.y - center.y) <= radius * scale + 0.01)) continue;
    const existing = targets.get(actor.uuid);
    if (!existing || (existing.hidden && !token.hidden)) {
      targets.set(actor.uuid, {actorUuid: actor.uuid, tokenUuid: token.uuid, name: token.name, hidden: Boolean(token.hidden)});
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

function targetRow(token) {
  return {actorUuid: token.actor.uuid, tokenUuid: token.uuid, name: token.name, hidden: Boolean(token.hidden)};
}

async function planNegation(source, rule) {
  const days = await rollTotal(rule.negation);
  const die = await rollTotal("1d10");
  if (die <= 8) return {days, radius: 0, victims: [{...targetRow(source), appearance: fatalNegationAppearance(die)}]};
  let victims;
  if (die === 9) {
    const size = Number(source.parent.grid?.size || 1);
    const origin = tokenCenter(source, size);
    const distance = token => {
      const p = tokenCenter(token, size);
      return Math.hypot(origin.x - p.x, origin.y - p.y);
    };
    victims = Array.from(source.parent.tokens.values()).filter(token => eligibleToken(token, source, true))
      .sort((a, b) => distance(a) - distance(b)).slice(0, 1).map(targetRow);
  } else {
    victims = fatalVitnerRecipients(source, 10, false);
  }
  for (const victim of victims) victim.appearance = fatalNegationAppearance(await rollTotal("1d8"));
  return {days, radius: die === 10 ? 10 : 0, victims};
}

async function applyNegation(caster, message, plan) {
  const conditions = new Map(plan.victims.map(victim => [victim.actorUuid, victim]));
  if (!conditions.has(caster.uuid)) conditions.set(caster.uuid, {actorUuid: caster.uuid});
  for (const [uuid, recipient] of conditions) {
    const actor = uuid === caster.uuid ? caster : await foundry.utils.fromUuid(uuid);
    if (!actor || actor.effects.get(message.id)) continue;
    const appearance = recipient.appearance;
    const name = game.i18n.localize("TRUDVANG.FatalMagic.Negation");
    const description = [
      ...(uuid === caster.uuid ? [game.i18n.localize("TRUDVANG.FatalMagic.ThirdLost")] : []),
      ...(appearance ? [game.i18n.localize(`TRUDVANG.FatalMagic.Cosmetic.${appearance}`)] : [])
    ].join(" ");
    if (!await actor.createTrudvangEffect({
      _id: message.id, name, img: "icons/svg/daze.svg", description,
      duration: {value: plan.days, units: "days"},
      system: {stackId: `fatal-magic:${message.id}`, changes: []},
      flags: {[SCOPE]: {summary: description, fatalMagic: {resultId: message.id, third: uuid === caster.uuid}}}
    }, {keepId: true})) throw Error("Fatal negation effect creation failed");
  }
}

async function drainVictim(actor, rolled, messageId) {
  const receipt = `flags.${SCOPE}.fatalVitnerLoss.${messageId}`;
  const previous = actor.getFlag(SCOPE, "fatalVitnerLoss")?.[messageId];
  if (previous?.resource) return previous;
  const {vitner} = actor.system.resources;
  if (absorbsVitnerFrom(actor)) {
    const current = Math.max(0, Number(vitner.current ?? vitner.value ?? 0));
    const amount = Math.min(current, rolled);
    const stored = Number(actor._source.system.resources.vitner.value || 0);
    const result = {resource: "vitner", amount};
    await actor.update({[receipt]: result, "system.resources.vitner.value": Math.max(0, stored - amount)});
    return result;
  }
  const result = {resource: "health", amount: rolled};
  await actor.update({[receipt]: result, ...fatalBodyLossUpdates(actor, rolled)});
  return result;
}

/** Runs through the existing serialized chat authority, with the area and
 * rolled losses frozen before editing any recipient. */
export async function prepareFatalVitnerArea(message) {
  const result = message.getFlag(SCOPE, "fatalMagicResult");
  const rule = FATAL_MAGIC_ROWS[result?.row];
  const total = Number(message.rolls?.[0]?.total);
  if (!fatalMagicHasArea(rule) || !Number.isInteger(total) || total < result.row || total > rule.last) return null;
  if (result.applied) return null;
  const caster = await foundry.utils.fromUuid(result.actorUuid);
  if (!caster) return null;
  const source = result.tokenUuid ? await foundry.utils.fromUuid(result.tokenUuid) : null;
  const scene = source?.parent;
  if (!scene?.tokens || source.actor?.uuid !== caster.uuid) return null;
  // The message author may edit message flags. Only the GM's plan on the
  // scene can specify which actors are written to, or how much they lose.
  const planPath = `flags.${SCOPE}.fatalVitnerPlans.${message.id}`;
  let plan = scene.getFlag(SCOPE, "fatalVitnerPlans")?.[message.id];
  if (!plan) {
    if (rule.negation) {
      plan = await planNegation(source, rule);
    } else {
      const radius = await rollTotal("1d10x>=10");
      const victims = fatalVitnerRecipients(source, radius, rule.excludeCaster);
      for (const victim of victims) victim.rolled = await rollTotal(rule.drain);
      plan = {radius, victims, blindness: rule.blindness ? await rollTotal(rule.blindness) : 0};
    }
    Object.assign(plan, {row: result.row, casterUuid: caster.uuid, level: source.level ?? null,
      center: tokenCenter(source, Number(scene.grid?.size || 1))});
    await scene.update({[planPath]: plan});
  }
  if (plan.row !== result.row || plan.casterUuid !== caster.uuid) return null;
  if (plan.radius > 0 && !regionFor(scene, message.id)) {
    const restricted = message.blind || message.whisper?.length;
    const recipients = [message.author?.id, ...Array.from(message.whisper ?? [], user => user.id ?? user)].filter(Boolean);
    const [region] = await scene.createEmbeddedDocuments("Region", [{
      name: game.i18n.localize(rule.negation ? "TRUDVANG.FatalMagic.Negation" : "TRUDVANG.FatalMagic.AreaName"), color: auraColor(),
      highlightMode: scene.grid?.isGridless ? "shapes" : "coverage", locked: true,
      levels: plan.level ? [plan.level] : [],
      visibility: message.blind ? CONST.REGION_VISIBILITY.GAMEMASTER
        : restricted ? CONST.REGION_VISIBILITY.OBSERVER : CONST.REGION_VISIBILITY.ALWAYS,
      ...(restricted ? {ownership: Object.fromEntries(recipients.map(id => [id, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER]))} : {}),
      shapes: [{type: "circle", ...plan.center, radius: plan.radius * zonePixelScale(scene)}],
      flags: {[SCOPE]: {fatalVitnerMessageId: message.id}}
    }]);
    if (!region) throw Error("Fatal vitner area was not created");
  }
  if (!result.preview?.sceneId) await message.update({[`${RESULT}.preview`]: {
    sceneId: scene.id, level: plan.level, radius: plan.radius,
    targets: plan.victims.filter(victim => !victim.hidden).map(({name, tokenUuid}) => ({name, tokenUuid}))
  }});
  return {plan, caster, scene};
}

function regionFor(scene, messageId) {
  return Array.from(scene?.regions?.values?.() ?? []).find(region => region.flags?.[SCOPE]?.fatalVitnerMessageId === messageId);
}

export async function clearFatalVitnerPreview(message, scene = game.scenes?.get(message.getFlag(SCOPE, "fatalMagicResult")?.preview?.sceneId)) {
  const region = regionFor(scene, message.id);
  if (region) await removePreviewRegion(region);
}

async function removePreviewRegion(region) {
  let deletion = removals.get(region);
  if (!deletion) {
    deletion = Promise.resolve().then(() => region.delete()).finally(() => removals.delete(region));
    removals.set(region, deletion);
  }
  return deletion;
}

export async function cleanupFatalVitnerPreviews() {
  for (const scene of game.scenes?.values?.() ?? []) {
    for (const region of scene.regions?.values?.() ?? []) {
      const messageId = region.flags?.[SCOPE]?.fatalVitnerMessageId;
      if (!messageId) continue;
      const result = game.messages.get(messageId)?.getFlag(SCOPE, "fatalMagicResult");
      if (!result || result.applied) await removePreviewRegion(region);
    }
  }
}

export async function applyFatalVitnerArea(message, {prepareOnly = false} = {}) {
  const result = message.getFlag(SCOPE, "fatalMagicResult");
  if (result?.applied) {
    await clearFatalVitnerPreview(message);
    return {status: "alreadyApplied"};
  }
  const wasVisible = Boolean(result?.preview?.sceneId);
  const prepared = await prepareFatalVitnerArea(message);
  if (!prepared) return {status: "noOrigin"};
  if (prepareOnly || !wasVisible) return {status: "prepared"};
  const {plan, caster, scene} = prepared;
  if (FATAL_MAGIC_ROWS[result.row].negation) {
    await applyNegation(caster, message, plan);
    await message.update({[`${RESULT}.applied`]: game.i18n.localize("TRUDVANG.FatalMagic.Negation"),
      [`${RESULT}.radius`]: plan.radius});
    await clearFatalVitnerPreview(message, scene);
    return {status: "applied"};
  }
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
  await clearFatalVitnerPreview(message, scene);
  return {status: "applied"};
}
