import {escapeAttribute, escapeHtml} from "./helpers.mjs";
import {applyItemTransformation} from "./item-effect-application.mjs";
import {activeSpellRecords} from "./rules/active-spell-resolver.mjs";
import {currentCastingCounts} from "./rules/magic-resistance.mjs";
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {resolveRollUnderOutcome} from "./rules/roll-under-resolver.mjs";

const SCOPE = "trudvang-chronicles";
export const SEAL_ID = "vitner-vitner-craft:seal:5";
const itemTypes = new Set(["weapon", "armor", "shield", "gear", "potion"]);
const jobs = new Set();
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);
const local = key => game.i18n.localize(`TRUDVANG.Seal.${key}`);
const stateOf = effect => effect?.flags?.[SCOPE]?.magicSeal;
const writer = () => Boolean(game.user?.isGM && (!game.users?.activeGM || game.users.activeGM.id === game.user.id));
const validItem = item => item?.documentName === "Item" && itemTypes.has(item.type) && !item.pack && !item.parent?.pack;
const validSeal = effect => validItem(effect?.parent) && stateOf(effect) && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired;

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

function sealItems(caster) {
  const actors = new Set([caster, ...(globalThis.canvas?.tokens?.controlled ?? []).map(token => token.actor)]);
  return [...values(game.items), ...[...actors].flatMap(actor => values(actor?.items))].filter(validItem);
}

async function choose(label, options) {
  if (!options.length) return null;
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

export async function prepareMagicSeal(message) {
  const state = message.flags?.[SCOPE]?.sealPreparation;
  const context = message.flags?.[SCOPE]?.ruleTestContext;
  const roll = message.rolls?.[0], die = Number(roll?.total);
  if (!writer() || !message.isContentVisible || !state || state.effectUuid || !sealPreparation(context)
      || roll?.formula !== "1d20" || !Number.isInteger(die) || die < 1 || die > 20
      || !Number.isFinite(state.target) || !resolveRollUnderOutcome(die,state.target).success) return null;
  return once(message.id, async () => {
    const caster = await foundry.utils.fromUuid(state.casterUuid);
    if (!caster) return null;
    const choices = sealItems(caster);
    if (!state.objectUuid && !choices.length) return ui.notifications.warn(local("NoObject"));
    const item = state.objectUuid ? await foundry.utils.fromUuid(state.objectUuid) : await choose("Object", choices.map(document => ({
      id: document.uuid, name: document.actor ? `${document.name} (${document.actor.name})` : document.name, document
    })));
    if (!validItem(item)) return null;
    const releaseMessageId = state.releaseMessageId ?? foundry.utils.randomID();
    if (!state.objectUuid) await message.update({
      [`flags.${SCOPE}.sealPreparation.objectUuid`]: item.uuid,
      [`flags.${SCOPE}.sealPreparation.releaseMessageId`]: releaseMessageId
    });
    const stackId = `seal:${message.id}`;
    const existing = values(item.effects).find(effect => effect.system?.stackId === stackId);
    const effect = existing ?? await applyItemTransformation(item, {
      type: "effect", name: local("Name"), img: "icons/svg/aura.svg", transfer: false,
      origin: context.sourceUuid ?? null, duration: {value: null, units: "rounds"},
      description: `<p>${escapeHtml(local("Description"))}</p>`,
      system: {stackId, stacking: "replace", changes: []},
      flags: {[SCOPE]: {
        magicSeal: {casterUuid: state.casterUuid, maximum: state.maximum, releaseMessageId, spell: null},
        summary: local("Empty"), transformation: {sourceId: SEAL_ID, ruleTestContext: context}
      }}
    });
    if (!effect) return null;
    await message.update({[`flags.${SCOPE}.sealPreparation.effectUuid`]: effect.uuid});
    return effect;
  });
}

export function canBindSpell(effect, actor, item) {
  const state = stateOf(effect);
  return Boolean(writer() && validSeal(effect) && !state.spell && state.casterUuid === actor?.uuid &&
    (item.actor === actor || item.parent === actor) && item.type === "spell" &&
    ["instant", "lasting"].includes(item.system.spellType) && Number(item.system.level) <= state.maximum);
}

export async function weaveSealedSpell(effect) {
  if (!writer() || !validSeal(effect) || stateOf(effect).spell) return null;
  return once(stateOf(effect).releaseMessageId, async () => {
    const caster = await foundry.utils.fromUuid(stateOf(effect).casterUuid);
    const spells = values(caster?.items).filter(item => canBindSpell(effect, caster, item));
    if (!spells.length) return ui.notifications.warn(local("NoSpell"));
    const spell = await choose("ChooseSpell", spells.map(document => ({id: document.id, name: document.name, document})));
    return spell ? caster.rollSpell(spell, {seal: effect}) : null;
  });
}

export async function storeSealedSpell(effect, actor, item, {roll, target, context, cost, levels}) {
  if (!canBindSpell(effect, actor, item)) return false;
  const data = item.toObject();
  const spell = {name: item.name, uuid: item.uuid, itemId: item.id, img: item.img, system: data.system,
    roll: roll.toJSON(), target, context: structuredClone(context), cost, levels};
  await effect.update({
    [`flags.${SCOPE}.magicSeal.spell`]: spell,
    [`flags.${SCOPE}.summary`]: game.i18n.format("TRUDVANG.Seal.Stored", {spell: spell.name})
  });
  return true;
}

export function sealedSpellSource(message, actor) {
  const spell = message?.flags?.[SCOPE]?.releasedSeal;
  return spell && {documentName: "Item", type: "spell", uuid: spell.uuid, id: spell.itemId,
    name: spell.name, img: spell.img, system: spell.system, actor, parent: actor};
}

export function sealSheetView(effect) {
  const state = stateOf(effect);
  if (!state) return null;
  return {spell: state.spell?.name, maximum: state.maximum, canOperate: writer() && validSeal(effect),
    improvements: (state.spell?.system?.powerLevels ?? []).flatMap((option, index) => {
      const count = state.spell.context.countsById?.[option.id ?? option.optionId] ?? state.spell.context.counts?.[index];
      return count > 0 ? [{count, text: option.effect}] : [];
    })};
}

export async function releaseSealedSpell(effect) {
  if (!writer() || !validSeal(effect) || !stateOf(effect).spell) return null;
  const {releaseMessageId, casterUuid, spell} = stateOf(effect);
  return once(releaseMessageId, async () => {
    const actor = await foundry.utils.fromUuid(casterUuid);
    if (!actor) return ui.notifications.warn(local("NoCaster"));
    const record = {id: spell.context.castingId, itemId: spell.itemId, cost: spell.cost,
      startedAt: Number(game.time?.worldTime || 0), duration: spell.system.duration || "",
      effectsApplied: false, effectUuids: [], powerLevelCounts: spell.context.counts, powerLevelSnapshot: spell.levels};
    let message = game.messages.get(releaseMessageId);
    if (!message && spell.system.spellType === "lasting" && values(actor.items).some(item => item.id === record.itemId)
        && !activeSpellRecords(actor).some(row => row.id === record.id)) {
      await actor.update({"system.activeSpellCastings": [...activeSpellRecords(actor), record], "system.activeSpellCastingsMigrated": true});
    }
    if (!message) {
      const item = sealedSpellSource({flags: {[SCOPE]: {releasedSeal: spell}}}, actor);
      const {rollUnder} = await import("./dice.mjs");
      const released = await rollUnder({actor, item, kind: "spell", label: spell.name, target: spell.target,
        castingId: spell.context.castingId, powerLevelCounts: currentCastingCounts(spell.context),
        releasedSeal: {id: releaseMessageId, spell, objectName: effect.parent.name}});
      message = game.messages.get(releaseMessageId);
      if (!released.success || !message) return null;
    }
    await effect.delete();
    return message;
  });
}
