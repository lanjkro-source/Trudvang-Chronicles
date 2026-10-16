import { escapeHtml, renderTemplate } from "./helpers.mjs";
import { TRUDVANG } from "./config.mjs";
import { resolveEquipment } from "./rules/equipment-resolver.mjs";
import { prepareDamageRoll, damageRollChoice, signedDamage } from "./rules/damage-roll-resolver.mjs";
import { prepareDamageTargets } from "./damage-application.mjs";
import { powerLevelUnitCost, resolvePowerLevelCost, resolveVitnerSacrifice } from "./rules/magic-power-resolver.mjs";
import { resolveRollUnderOutcome } from "./rules/roll-under-resolver.mjs";
import { normalizeCombatAllocation } from "./rules/combat-pool-resolver.mjs";
import {actorStateRollModifiers, rollModifierTotal} from "./rules/roll-state-resolver.mjs";
import {consequenceText} from "./rules/consequence-text.mjs";
import {effectContributions} from "./rules/effect-contributions.mjs";
import {calculateTraitModifier} from "./rules/trait-roll-resolver.mjs";
import {ruleTestActionViews} from "./rule-tests.mjs";
import {allocatedCombatVC} from "./rules/attack-size.mjs";

const SYSTEM_ID = "trudvang-chronicles";

const modifierLabel = row => `${row.labelKey ? game.i18n.localize(row.labelKey) : row.label}${row.included ? ` (${game.i18n.localize("TRUDVANG.Dialog.IncludedModifier")})` : ""}`;
const signedModifier = value => `${Number(value) > 0 ? "+" : ""}${Number(value || 0)}`;
const modifierList = rows => rows.length ? `<ul class="roll-state-modifiers">${rows.map(row => `<li><span>${escapeHtml(modifierLabel(row))}</span><b>${signedModifier(row.value)}</b></li>`).join("")}</ul>` : "";

export function rollModifierFlavor(rows) {
  return rows.map(row => `${escapeHtml(modifierLabel(row))}: ${signedModifier(row.value)}`).join("<br>");
}

async function evaluate(formula) {
  const roll = new Roll(formula);
  await roll.evaluate();
  return roll;
}

export async function openDice({dice = 1, faces = 10, threshold = 10, modifier = 0} = {}) {
  const rolls = [];
  const diceRolls = []; // Real Roll objects kept so chat messages can animate them (Dice So Nice).
  let total = Number(modifier) || 0;
  for (let die = 0; die < dice; die += 1) {
    let chained = true;
    let guard = 0;
    while (chained && guard < 100) {
      const roll = await evaluate(`1d${faces}`);
      const result = Number(roll.total);
      rolls.push(result);
      diceRolls.push(roll);
      total += result;
      chained = threshold > 0 && result >= threshold;
      guard += 1;
    }
  }
  return {total, rolls, diceRolls, threshold, modifier: Number(modifier) || 0};
}

export async function openD10(options = {}) {
  return openDice({...options, faces: 10});
}

export async function rollUnder({actor, label, target, modifier = 0, kind = "skill", flavor = "", item = null, perfectSuccessMax = 1, automaticSuccessMax = 0, fatalEffect = null, feint = 0, usage = "", longRange = false, animateWithDiceSoNice = false, successConsequence = "", failureConsequence = "", criticalSuccessConsequence = "", criticalFailureConsequence = "", effectTarget = null, attackTargets = []}) {
  const finalTarget = Number(target) + Number(modifier || 0);
  const roll = await evaluate("1d20");
  const result = Number(roll.total);
  const outcome = resolveRollUnderOutcome(result, finalTarget, {perfectSuccessMax, automaticSuccessMax});
  const {critical, margin} = outcome;
  const targetResults = attackTargets.map(row => {
    const target = finalTarget + row.modifier - attackTargets[0].modifier;
    return {...row, target, ...resolveRollUnderOutcome(result, target, {perfectSuccessMax, automaticSuccessMax})};
  });
  const success = targetResults.length ? targetResults.some(row => row.success) : outcome.success;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/roll-card.hbs", {
    actorName: actor.name,
    actorImg: actor.img,
    label,
    result,
    target: finalTarget,
    modifier: Number(modifier || 0),
    success,
    margin,
    critical,
    fatalEffect: critical === "failure" ? fatalEffect : null,
    kind,
    feint: Math.max(0, Number(feint || 0)),
    flavor,
    successConsequence: consequenceText(successConsequence),
    failureConsequence: consequenceText(failureConsequence),
    criticalSuccessConsequence: consequenceText(criticalSuccessConsequence),
    criticalFailureConsequence: consequenceText(criticalFailureConsequence),
    effectTarget,
    attackTargets: targetResults,
    multipleAttackTargets: targetResults.length > 1,
    itemUuid: item?.uuid ?? "",
    ruleTests: success && item && (["spell", "divine", "rune"].includes(kind)
      || ["creatureAbility", "ability"].includes(item.type) || item.system?.isRune) ? ruleTestActionViews(item) : [],
    naturalDamage: item?.id === "humanoid-natural",
    actorUuid: actor.uuid,
    usage,
    longRange: Boolean(longRange)
  });
  const useDiceSoNice = animateWithDiceSoNice
    && game.modules?.get("dice-so-nice")?.active
    && typeof game.dice3d?.showForRoll === "function";
  const message = await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({actor}),
    content,
    rolls: [roll],
    ...((useDiceSoNice || targetResults.length) ? {flags: {
      ...(useDiceSoNice ? {"dice-so-nice": {skip: true}} : {}),
      ...(targetResults.length ? {[SYSTEM_ID]: {attackTargets: targetResults}} : {})
    }} : {})
  });
  if (useDiceSoNice) {
    try {
      await game.dice3d.showForRoll(roll, game.user, true, message.whisper ?? [], Boolean(message.blind), message.id, message.speaker);
    } catch (error) {
      console.error("Trudvang | Dice So Nice could not animate a concentration roll", error);
    }
  }
  return {roll, result, target: finalTarget, success, critical, margin, effectTarget, attackTargets: targetResults};
}

function numericModifier(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/[−–]/g, "-").replace(/\s/g, "");
  return /^[+-]?\d+(?:\.\d+)?$/u.test(normalized) ? Number(normalized) : null;
}

function ruleTestSituationOptions(test) {
  const configured = test?.sv;
  const structured = configured && typeof configured === "object" ? configured : {};
  const base = Number.isFinite(numericModifier(configured)) ? numericModifier(configured)
    : Number.isFinite(numericModifier(structured.base)) ? numericModifier(structured.base) : 0;
  const svChoices = Array.isArray(structured.by) ? structured.by : [];
  const modifierChoices = Array.isArray(structured.modifiers) ? structured.modifiers : [];
  const repeatedModifiers = [];
  if (structured.repeatedModifier) repeatedModifiers.push(structured.repeatedModifier);
  if (structured.increment) repeatedModifiers.push({...structured.increment, direction: 1});
  if (structured.decrement) repeatedModifiers.push({...structured.decrement, direction: -1});

  const notes = [test?.note, test?.condition, test?.traitRule];
  if (test?.repeat) notes.push(game.i18n.format("TRUDVANG.Dialog.RuleTestRepeat", {repeat: test.repeat}));
  for (const key of ["rule", "determinedBy", "otherValues", "modifier", "modifierRule", "bonus", "noTest", "immune"]) {
    const value = structured[key];
    if (value !== undefined && value !== null && value !== "") notes.push(typeof value === "string" ? value : JSON.stringify(value));
  }
  if (Number.isFinite(numericModifier(structured.min)) || Number.isFinite(numericModifier(structured.max))) {
    notes.push(game.i18n.format("TRUDVANG.Dialog.RuleTestSVRange", {
      min: numericModifier(structured.min) ?? 0,
      max: numericModifier(structured.max) ?? 0,
      determinedBy: structured.determinedBy || ""
    }));
  }
  return {
    base,
    svChoices,
    modifierChoices,
    repeatedModifiers,
    notes: [...new Set(notes.map(value => String(value ?? "").trim()).filter(Boolean))],
    svEditable: Number.isInteger(configured) === false && (svChoices.length > 0 || !Number.isFinite(numericModifier(structured.base)))
  };
}

/** Run a resistance test from a rule description; the clicking user rolls for their selected PC/NPC. */
export async function rollConfiguredTraitSituation({actor, test, sourceName = ""} = {}) {
  if (!actor || !test || !actor.canPerformAction()) return actor?.warnCannotAct?.() ?? null;
  const situation = ruleTestSituationOptions(test);
  const configuredTraits = (Array.isArray(test.trait) ? test.trait : [test.trait]).slice(0, 2);
  while (configuredTraits.length < 2) configuredTraits.push("aucun");
  const traitValues = configuredTraits.map(key => {
    const hasTrait = key && key !== "aucun" && TRUDVANG.traits[key];
    return {
      key: hasTrait ? key : "aucun",
      label: hasTrait
        ? game.i18n.localize(TRUDVANG.traits[key])
        : game.i18n.localize("TRUDVANG.Dialog.FixedAttackNoTrait"),
      value: hasTrait ? Number(actor.getTraitValue(key)) || 0 : 0
    };
  });
  const hasTrait = traitValues.some(row => row.key !== "aucun");
  const sharedEffect = actor.getRollModifier({kind: "situation", includeState: false});
  const traitEffectValues = traitValues.map(trait => ({
    ...trait,
    effect: trait.key === "aucun" ? 0 : actor.getRollModifier({kind: "trait", traitKey: trait.key, includeState: false}) - sharedEffect
  }));
  const traitValue = calculateTraitModifier(traitEffectValues.map(row => row.value + row.effect), test.traitMethod || "first");
  const effect = sharedEffect;
  const modifierRows = actorStateRollModifiers(actor);
  const traitLabel = hasTrait ? game.i18n.localize("TRUDVANG.Dialog.TraitSituationTrait")
    : game.i18n.localize("TRUDVANG.Dialog.TraitSituationNoTrait");
  const title = game.i18n.format("TRUDVANG.RuleTest.ResistanceTitle", {source: sourceName || "", action: test.action || ""});
  const effectRows = [...(actor.rollEffectRows?.({kind: "situation"}) ?? []),
    ...traitValues.flatMap(row => row.key === "aucun" ? [] : [
      ...(actor.traitEffectRows?.(row.key) ?? []),
      ...effectContributions(actor, `system.modifiers.rolls.traits.${row.key}`)
    ])].map(row => ({...row, included: true}));
  const options = await playerTraitSituationDialog({title, traitLabel, traitValue, traitValues: traitEffectValues,
    traitMethod: test.traitMethod || "first", effect, effectRows, ...situation, modifierRows});
  if (!options) return null;
  const target = (options.situationValue ?? situation.base) + (options.traitModifier ?? traitValue) + effect + Number(options.configuredModifier || 0) + Number(options.repeatedModifier || 0) + rollModifierTotal(modifierRows);
  return rollUnder({actor, label: title, target, modifier: options.modifier, kind: "situation",
    flavor: rollModifierFlavor([...effectRows, ...modifierRows]), successConsequence: test.success || "", failureConsequence: test.failure || "",
    criticalSuccessConsequence: test.criticalSuccess || "", criticalFailureConsequence: test.criticalFailure || ""});
}

export async function initiativeDialog({actor, target, lightningQuickLevel = 0, rememberedEquipment = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const magicChoices = actor.items.filter(item => ["spell", "divineFeat"].includes(item.type)).filter(item => {
    const tablet = actor.items.find(candidate => candidate.type === "tablet" && (candidate.system.catalogId === item.system.tabletId || candidate.name === item.system.tablet));
    return !tablet || Number(item.system.level || 1) <= Number(tablet.system.level || 1);
  }).map(item => {
    const level = Math.max(1, Math.min(5, Number(item.system.level || 1)));
    const modifier = -level + (item.type === "divineFeat" ? 2 * Number(lightningQuickLevel || 0) : 0);
    return `<option value="${modifier}">${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</option>`;
  }).join("");
  const remembered = new Set(rememberedEquipment);
  const equipmentChoices = actor.items.filter(item => ["weapon", "shield"].includes(item.type) && item.system.equipped).map(item => {
    const modifier = resolveEquipment({item, actor}).characteristics.initiativeModifier.value;
    return `<label class="checkbox"><input type="checkbox" data-initiative-equipment data-item-id="${escapeHtml(item.id)}" value="${modifier}" ${remembered.has(item.id) ? "checked" : ""}> ${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</label>`;
  }).join("");
  const drawChoice = actor.items.some(item => item.type === "weapon" && !item.system.equipped)
    ? `<label class="checkbox"><input type="checkbox" data-initiative-draw value="-10"> ${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.DrawInitiative"))}</label>`
    : "";
  const content = `
    <div class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target}))}</p>
      ${modifierList([...effectContributions(actor, "system.modifiers.rolls.initiative"), ...(actor.traitEffectRows?.("dexterity") ?? [])].map(row => ({...row, included: true})))}
      ${equipmentChoices || drawChoice ? `<fieldset class="initiative-equipment"><legend>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.InitiativeEquipment"))}</legend>${equipmentChoices}${drawChoice}</fieldset>` : ""}
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.InitiativeMagic"))}</label><select name="magicModifier"><option value="0">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.NoInitiativeAction"))}</option>${magicChoices}</select></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
    </div>`;
  return DialogClass.wait({
    window: {title: game.i18n.localize("TRUDVANG.Action.RollInitiative")},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d10", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        const equipment = Array.from(root.querySelectorAll("[data-initiative-equipment]:checked"));
        const equipmentModifier = equipment.reduce((sum, input) => sum + Number(input.value || 0), 0);
        const drawModifier = Number(root.querySelector("[data-initiative-draw]:checked")?.value || 0);
        return {
          modifier: Number(root.querySelector("[name=modifier]")?.value || 0) + Number(root.querySelector("[name=magicModifier]")?.value || 0) + equipmentModifier + drawModifier,
          equipmentIds: equipment.map(input => input.dataset.itemId).filter(Boolean)
        };
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

export async function magicDialog({title, methods, spellModifier = 0, defaultCost = 0, resourceLabel = "", strenuousMax = 0, strenuousLabel = "TRUDVANG.Dialog.Strenuous", strenuousResource = "TRUDVANG.Resource.Vitner", activeSpellCount = 0, persistent = false, powerLevels = [], affinity = 0, affinityDescription = "", modifierRows = [], sacrifice = null}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const activeSpellPenalty = -2 * Math.max(0, Number(activeSpellCount || 0));
  const stateModifier = rollModifierTotal(modifierRows);
  const options = methods.map(method => {
    const target = Number(method.target || 0);
    return `<option value="${escapeHtml(method.id)}">${escapeHtml(method.label)} — VC ${target}</option>`;
  }).join("");
  const formatModifier = value => `${Number(value) > 0 ? "+" : ""}${Number(value)}`;
  const initialTarget = Number(methods[0]?.target || 0) + Number(spellModifier || 0) + activeSpellPenalty + stateModifier;
  const strenuousOptions = Array.from({length: Number(strenuousMax || 0) + 1}, (_, bonus) => `<option value="${bonus}">+${bonus} VC (+${bonus * 2} ${escapeHtml(game.i18n.localize(strenuousResource))})</option>`).join("");
  const levelRows = powerLevels.map((level, index) => {
    const unit = powerLevelUnitCost(level.cost, affinity);
    const limit = level.maxCount == null ? "" : ` max="${Number(level.maxCount)}"`;
    const costText = game.i18n.format("TRUDVANG.Power.CostPerLevel", {cost: unit});
    const maxText = level.maxCount == null ? "" : game.i18n.format("TRUDVANG.Power.Maximum", {max: level.maxCount});
    const maxCount = level.maxCount == null ? "" : ` data-max-count="${Number(level.maxCount)}"`;
    return `<div class="magic-power-option" data-power-row="${index}"><label><span>${escapeHtml(level.effect || "")}</span><small>${escapeHtml(costText)}${maxText ? ` · ${escapeHtml(maxText)}` : ""}</small></label><div class="magic-power-counter"><button type="button" data-power-decrease="${index}" aria-label="${escapeHtml(game.i18n.localize("TRUDVANG.Power.DecreaseLevel"))}">−</button><span data-power-count="${index}"${maxCount}>0</span><button type="button" data-power-increase="${index}" aria-label="${escapeHtml(game.i18n.localize("TRUDVANG.Power.IncreaseLevel"))}">+</button></div></div>`;
  }).join("");
  const countsFrom = root => powerLevels.map((_, index) => Number(root.querySelector(`[data-power-count="${index}"]`)?.textContent || 0));
  const costFrom = (root, strenuousBonus) => resolvePowerLevelCost({baseCost: defaultCost, powerLevels, counts: countsFrom(root), affinity, strenuousBonus});
  const finalTargetFrom = (root, method, strenuousBonus) => Number(method?.target || 0) + Number(spellModifier || 0) + activeSpellPenalty + stateModifier
    + strenuousBonus + Number(root.querySelector("[name=modifier]")?.value || 0);
  const content = `<div class="trudvang roll-dialog magic-roll-dialog">
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.MagicMethod"))}</label><select name="method">${options}</select></div>
    <p class="magic-breakdown">${escapeHtml(methods[0]?.breakdown || "")}</p>
    <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.PowerModifier"))} : <strong>${escapeHtml(formatModifier(spellModifier))}</strong></p>
    ${modifierList(modifierRows)}
    ${activeSpellCount ? `<p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.ActiveSpellsPenalty", {count: activeSpellCount, penalty: activeSpellPenalty}))}</p>` : ""}
    ${persistent ? `<p class="magic-affinity-note">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.PersistentSpellNotice"))}</p>` : ""}
    <p>${escapeHtml(game.i18n.format("TRUDVANG.Power.BaseCost", {cost: defaultCost}))}</p>
    ${affinityDescription ? `<p class="magic-affinity-note">${escapeHtml(affinityDescription)}</p>` : ""}
    ${levelRows ? `<div class="magic-power-options">${levelRows}</div>` : ""}
    ${levelRows ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Power.LevelsInvested"))} : <strong data-level-cost>0</strong></p>` : ""}
    ${strenuousMax ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize(strenuousLabel))}</label><select name="strenuous">${strenuousOptions}</select></div>` : ""}
    <p>${escapeHtml(resourceLabel)} : <strong data-final-cost>${Number(defaultCost || 0)}</strong></p>
    ${sacrifice ? `<label class="magic-sacrifice-option" data-sacrifice-option hidden><input type="checkbox" name="sacrifice"><span data-sacrifice-text></span></label>` : ""}
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
    <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-final-target>${initialTarget}</strong></p>
  </div>`;
  // Local subclass so the live breakdown refresh (FinalTarget / FinalVitnerCost) survives the
  // AppV1 -> AppV2 migration: DialogV2 exposes the old `render` hook through `_onRender`.
  class MagicRollDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const method = methods.find(entry => entry.id === root.querySelector("[name=method]")?.value) || methods[0];
        const strenuousBonus = Number(root.querySelector("[name=strenuous]")?.value || 0);
        const output = root.querySelector("[data-final-target]");
        if (output) output.textContent = finalTargetFrom(root, method, strenuousBonus);
        const finalCost = root.querySelector("[data-final-cost]");
        const levelCost = root.querySelector("[data-level-cost]");
        if (finalCost) {
          try {
            const costs = costFrom(root, strenuousBonus);
            finalCost.textContent = costs.total;
            if (levelCost) levelCost.textContent = costs.extra;
          }
          catch { finalCost.textContent = "—"; }
        }
        const breakdown = root.querySelector(".magic-breakdown");
        if (breakdown) breakdown.textContent = method?.breakdown || "";
        // Health-for-vitner sacrifice (spells only): offer the opt-in red line under
        // the total cost while the shortfall stays feasible, hide it otherwise.
        const sacrificeOption = root.querySelector("[data-sacrifice-option]");
        if (sacrificeOption) {
          let offer = null;
          try {
            const costs = costFrom(root, strenuousBonus);
            offer = resolveVitnerSacrifice({totalCost: costs.total, currentVitner: sacrifice?.currentVitner,
              currentHP: sacrifice?.currentHP, maxHP: sacrifice?.maxHP});
          }
          catch { offer = null; }
          const show = Boolean(offer?.feasible);
          sacrificeOption.hidden = !show;
          const sacrificeText = sacrificeOption.querySelector?.("[data-sacrifice-text]");
          if (sacrificeText && offer) sacrificeText.textContent = game.i18n.format("TRUDVANG.Power.SacrificeOffer",
            {health: offer.health, vitner: offer.vitner});
          if (!show) {
            const sacrificeBox = sacrificeOption.querySelector?.("[name=sacrifice]");
            if (sacrificeBox) sacrificeBox.checked = false;
          }
        }
      };
      root.querySelector("[name=method]")?.addEventListener("change", refresh);
      root.querySelector("[name=strenuous]")?.addEventListener("change", refresh);
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
      root.querySelectorAll("[data-power-increase], [data-power-decrease]").forEach(button => button.addEventListener("click", () => {
        const index = Number(button.dataset.powerIncrease ?? button.dataset.powerDecrease);
        const counter = root.querySelector(`[data-power-count="${index}"]`);
        if (!counter) return;
        const current = Number(counter.textContent || 0);
        const maxCount = powerLevels[index]?.maxCount == null ? null : Number(powerLevels[index].maxCount);
        const next = button.dataset.powerIncrease !== undefined ? current + 1 : current - 1;
        counter.textContent = Math.max(0, maxCount == null ? next : Math.min(maxCount, next));
        refresh();
      }));
      refresh();
    }
  }
  return MagicRollDialog.wait({
    window: {title},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        const method = methods.find(entry => entry.id === root.querySelector("[name=method]")?.value) || methods[0];
        const strenuousBonus = Number(root.querySelector("[name=strenuous]")?.value || 0);
        const situationalModifier = Number(root.querySelector("[name=modifier]")?.value || 0);
        let cost;
        try { cost = costFrom(root, strenuousBonus); }
        catch { ui.notifications.warn(game.i18n.localize("TRUDVANG.Power.InvalidSelection")); return false; }
        return {method, strenuousBonus, activeSpellPenalty, target: finalTargetFrom(root, method, strenuousBonus), situationalModifier, cost: cost.total, costBreakdown: cost,
          sacrificeAccepted: Boolean(root.querySelector("[name=sacrifice]")?.checked)};
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

export async function concentrationDialog({title, defaultType = "spell", psycheModifier = 0, effectModifier = 0, effectRows = [], spellDisciplineLevel = 0, spellSpecialtyLevel = 0, divineDisciplineLevel = 0, divineSpecialtyLevel = 0, modifierRows = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const tracks = {
    spell: {discipline: "TRUDVANG.Knowledge.vitnerFocus", specialty: "TRUDVANG.Knowledge.safeWeaving", disciplineLevel: Number(spellDisciplineLevel) || 0, specialtyLevel: Number(spellSpecialtyLevel) || 0},
    divine: {discipline: "TRUDVANG.Knowledge.godFocus", specialty: "TRUDVANG.Knowledge.composed", disciplineLevel: Number(divineDisciplineLevel) || 0, specialtyLevel: Number(divineSpecialtyLevel) || 0}
  };
  const signed = value => Number(value) > 0 ? `+${Number(value)}` : `${Number(value)}`;
  const localize = key => escapeHtml(game.i18n.localize(key));
  const content = `<div class="trudvang roll-dialog concentration-roll-dialog">
    <div class="form-group"><label>${localize("TRUDVANG.Dialog.ConcentrationType")}</label><select name="concentration-type"><option value="spell" ${defaultType === "spell" ? "selected" : ""}>${localize("TRUDVANG.Dialog.ConcentrationSpell")}</option><option value="divine" ${defaultType === "divine" ? "selected" : ""}>${localize("TRUDVANG.Dialog.ConcentrationDivine")}</option></select></div>
    <div class="form-group"><label>${localize("TRUDVANG.Dialog.ConcentrationBase")}</label><input name="concentration-base" type="number" value="6"></div>
    <dl class="concentration-breakdown">
      <dt>${localize("TRUDVANG.Dialog.ConcentrationTrait")}</dt><dd>${signed(psycheModifier)}</dd>
      <dt data-concentration-discipline-name></dt><dd data-concentration-discipline-value></dd>
      <dt data-concentration-specialty-name></dt><dd data-concentration-specialty-value></dd>
      ${effectModifier ? `<dt>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EffectModifier"))}</dt><dd>${signed(effectModifier)}</dd>` : ""}
      ${modifierRows.map(row => `<dt>${escapeHtml(modifierLabel(row))}</dt><dd>${signed(row.value)}</dd>`).join("")}
    </dl>
    ${modifierList(effectRows.map(row => ({...row, included: true})))}
    <p>${localize("TRUDVANG.Dialog.ConcentrationTotal")}: <strong data-concentration-total></strong></p>
  </div>`;
  class ConcentrationDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const track = tracks[root.querySelector("[name=concentration-type]")?.value] || tracks.spell;
        const disciplineBonus = track.disciplineLevel;
        const specialtyBonus = 2 * track.specialtyLevel;
        const base = Number(root.querySelector("[name=concentration-base]")?.value || 0);
        root.querySelector("[data-concentration-discipline-name]").textContent = `${game.i18n.localize(track.discipline)} (${track.disciplineLevel})`;
        root.querySelector("[data-concentration-discipline-value]").textContent = signed(disciplineBonus);
        root.querySelector("[data-concentration-specialty-name]").textContent = `${game.i18n.localize(track.specialty)} (${track.specialtyLevel})`;
        root.querySelector("[data-concentration-specialty-value]").textContent = signed(specialtyBonus);
        root.querySelector("[data-concentration-total]").textContent = base + Number(psycheModifier) + Number(effectModifier) + disciplineBonus + specialtyBonus + rollModifierTotal(modifierRows);
      };
      root.querySelector("[name=concentration-type]")?.addEventListener("change", refresh);
      root.querySelector("[name=concentration-base]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return ConcentrationDialog.wait({
    window: {title},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        return {type: root.querySelector("[name=concentration-type]")?.value || "spell", base: Number(root.querySelector("[name=concentration-base]")?.value || 0)};
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

function damageBreakdownRows(profile) {
  return profile.rows.map(row => ({...row,
    label: game.i18n.format(row.labelKey, {...row.data, amount: signedDamage(row.amount)})
  }));
}

/** All weapon-damage entry points confirm the same immutable calculation before rolling. */
export async function damageRollDialog({item, profile}) {
  const DialogClass = foundry.applications.api.DialogV2;
  const readChoice = root => damageRollChoice(profile, {
    dice: root.querySelector("[name=damage-dice]")?.value,
    formula: root.querySelector("[name=damage-formula]")?.value,
    openRoll: root.querySelector("[name=damage-open-roll]")?.value,
    modifier: root.querySelector("[name=damage-modifier]")?.value,
    longRange: Boolean(root.querySelector("[name=damage-long-range]")?.checked)
  });
  const content = await renderTemplate("systems/trudvang-chronicles/templates/app/damage-roll-dialog.hbs", {
    ...profile, rows: damageBreakdownRows(profile)
  });
  class DamageRollDialog extends DialogClass {
    async _onRender(context, options) {
      await super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const choice = readChoice(root);
        const output = root.querySelector("[data-damage-preview]");
        if (!output) return;
        if (!choice) { output.textContent = "—"; return; }
        const dice = profile.parsed ? `${choice.dice}d${profile.parsed.faces}` : `(${choice.formula})`;
        const openRoll = profile.parsed && choice.openRoll
          ? ` ${game.i18n.format("TRUDVANG.DamageRoll.OpenRollPreview", {threshold: choice.openRoll})}` : "";
        const fixed = choice.fixedModifier ? ` ${signedDamage(choice.fixedModifier)}` : "";
        output.textContent = `${dice}${openRoll}${fixed}${choice.longRange ? ` · ${game.i18n.localize("TRUDVANG.DamageRoll.HalfDamage")}` : ""}`;
      };
      root.querySelectorAll("input").forEach(input => input.addEventListener("input", refresh));
      refresh();
    }
  }
  const response = await DamageRollDialog.wait({
    classes: ["dialog", "trudvang", "damage-roll-window"],
    window: {title: game.i18n.format("TRUDVANG.DamageRoll.Title", {item: item.name})},
    position: {width: 480},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d10", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return readChoice(root) ?? false;
        }},
      // DialogV2 replaces nullish callback results with the action string.
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
  // Only the roll callback's structured choice confirms a roll. In particular,
  // "cancel"/"roll" action fallbacks must never select the default damage values.
  return response && typeof response === "object" && !Array.isArray(response) ? response : null;
}

export async function rollDamage({actor, item, context = {}}) {
  const profile = prepareDamageRoll({actor, item, context});
  const response = await damageRollDialog({item, profile});
  if (!response) return null;
  const choice = damageRollChoice(profile, response);
  if (!choice) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.DamageRoll.InvalidSelection"));
    return null;
  }
  const parsed = profile.parsed;
  let total;
  let unclampedTotal;
  let detail;
  let rolls = [];
  if (parsed) {
    const fixed = choice.fixedModifier;
    const exploded = await openDice({dice: choice.dice, faces: parsed.faces, threshold: choice.openRoll, modifier: fixed});
    unclampedTotal = exploded.total;
    total = Math.max(profile.minimumTotal, unclampedTotal);
    detail = exploded.rolls.join(" + ");
    if (fixed > 0) detail += ` + ${fixed}`;
    else if (fixed < 0) detail += ` - ${Math.abs(fixed)}`;
    rolls = exploded.diceRolls; // Pass the open-ended Roll objects so Dice So Nice animates them too.
  } else {
    const roll = await evaluate(`(${choice.formula}) + (${choice.fixedModifier})`);
    unclampedTotal = Number(roll.total);
    total = Math.max(profile.minimumTotal, unclampedTotal);
    detail = roll.formula;
    rolls = [roll];
  }
  const modifierDetails = damageBreakdownRows(profile).map(row => `${row.label} : ${row.value}${row.source ? ` (${row.source})` : ""}`);
  if (choice.modifier) modifierDetails.push(game.i18n.format("TRUDVANG.DamageRoll.SituationalDetail", {amount: signedDamage(choice.modifier)}));
  if (parsed && choice.dice !== parsed.dice) modifierDetails.push(game.i18n.format("TRUDVANG.DamageRoll.DiceAdjusted", {before: parsed.dice, after: choice.dice}));
  if (parsed && choice.openRoll !== profile.openRoll) modifierDetails.push(game.i18n.format("TRUDVANG.DamageRoll.OpenRollAdjusted", {before: profile.openRoll, after: choice.openRoll}));
  if (!parsed && choice.formula !== profile.formula) modifierDetails.push(game.i18n.format("TRUDVANG.DamageRoll.FormulaAdjusted", {before: profile.formula, after: choice.formula}));
  if (total !== unclampedTotal) {
    modifierDetails.push(game.i18n.localize("TRUDVANG.Calculation.Equipment.MinimumDamage"));
  }
  if (choice.longRange) {
    const beforeLongRange = total;
    total = Math.ceil(total / 2);
    modifierDetails.push(game.i18n.format("TRUDVANG.Calculation.LongRangeDamage", {before: beforeLongRange, after: total}));
  }
  const targets = prepareDamageTargets(context.targets ?? game.user?.targets);
  const targetsHTML = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-targets.hbs", {total, targets});
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-card.hbs", {
    actorName: actor.name,
    actorImg: actor.img,
    itemName: item.name,
    itemImg: item.img,
    total,
    detail,
    openRoll: parsed ? choice.openRoll : 0,
    modifierDetails,
    targetsHTML
  });
  await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content, rolls, flags: {"trudvang-chronicles": {damageTargets: targets}}});
  return total;
}

/**
 * Select the kind of roll made from a character trait.
 *
 * Trait values already include changes made directly to the trait; `effect` is
 * reserved for roll modifiers supplied by active effects. Keeping the two
 * visible makes the source of the final value clear to the player.
 */
export async function traitRollDialog({title, traitLabel, traitValue = 0, effect = 0, effectRows = [], modifierRows = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const trait = Number(traitValue) || 0;
  const effectModifier = Number(effect) || 0;
  const localize = key => escapeHtml(game.i18n.localize(key));
  const displayModifier = value => value >= 0 ? `+${value}` : `${value}`;
  const content = `<div class="trudvang roll-dialog trait-roll-dialog">
    <div class="form-group"><label>${localize("TRUDVANG.Dialog.TraitRollMode")}</label><select name="mode">
      <option value="situation">${localize("TRUDVANG.Dialog.SituationRoll")}</option>
      <option value="open">${localize("TRUDVANG.Dialog.OpenRoll")}</option>
    </select></div>
    <div class="trait-roll-values">
      <div class="form-group"><label>${escapeHtml(traitLabel)}</label><input name="trait" type="number" value="${trait}" readonly></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EffectModifier"))}</label><input name="effect" type="number" value="${effectModifier}" readonly></div>
    </div>
    ${modifierList(effectRows.map(row => ({...row, included: true})))}
    <section data-roll-mode="situation">
      <div class="form-group"><label>${localize("TRUDVANG.Dialog.SituationValue")}</label><input name="situationValue" type="number" value="10"></div>
      ${modifierList(modifierRows)}
      <p>${localize("TRUDVANG.Dialog.TotalSituationValue")}: <strong data-final-target>${10 + trait + effectModifier + rollModifierTotal(modifierRows)}</strong></p>
    </section>
    <section data-roll-mode="open" hidden>
      <div class="form-group"><label>${localize("TRUDVANG.Dialog.OpenRollBonus")}</label><input name="bonus" type="number" value="0"></div>
      <p>${localize("TRUDVANG.Dialog.OpenRollBreakdown")}: <strong data-open-modifier>${trait + effectModifier}</strong></p>
    </section>
  </div>`;
  class TraitRollDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const mode = root.querySelector("[name=mode]")?.value || "situation";
        root.querySelector("[data-roll-mode=situation]")?.toggleAttribute("hidden", mode !== "situation");
        root.querySelector("[data-roll-mode=open]")?.toggleAttribute("hidden", mode !== "open");
        const target = root.querySelector("[data-final-target]");
        if (target) target.textContent = Number(root.querySelector("[name=situationValue]")?.value || 0) + trait + effectModifier + rollModifierTotal(modifierRows);
        const openModifier = root.querySelector("[data-open-modifier]");
        if (openModifier) openModifier.textContent = displayModifier(trait + Number(root.querySelector("[name=bonus]")?.value || 0) + effectModifier);
      };
      root.querySelector("[name=mode]")?.addEventListener("change", refresh);
      root.querySelector("[name=situationValue]")?.addEventListener("input", refresh);
      root.querySelector("[name=bonus]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return TraitRollDialog.wait({
    window: {title},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        return {
          mode: root.querySelector("[name=mode]")?.value || "situation",
          situationValue: Number(root.querySelector("[name=situationValue]")?.value || 0),
          bonus: Number(root.querySelector("[name=bonus]")?.value || 0)
        };
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

export async function modifierDialog({title, target, showCost = false, defaultCost = 0, resourceLabel = "", modifierRows = [], notes = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  // target is always the intrinsic VC. Every fixed modifier is a separate row.
  const finalTarget = Number(target) + rollModifierTotal(modifierRows);
  const content = `
    <div class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target: Number(target)}))}</p>
      ${modifierList(modifierRows)}
      ${notes.length ? `<aside class="rule-test-notes">${notes.map(note => `<p>${escapeHtml(note)}</p>`).join("")}</aside>` : ""}
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
      ${showCost ? `<div class="form-group"><label>${escapeHtml(resourceLabel)}</label><input name="cost" type="number" min="0" value="${Number(defaultCost)}"></div>` : ""}
      <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-final-target>${finalTarget}</strong></p>
    </div>`;
  class SkillRollDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const output = root.querySelector("[data-final-target]");
        if (output) output.textContent = finalTarget + Number(root.querySelector("[name=modifier]")?.value || 0);
      };
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return SkillRollDialog.wait({
    window: {title},
    content,
    buttons: [
      {
        action: "roll",
        icon: "fas fa-dice-d20",
        label: game.i18n.localize("TRUDVANG.Action.Roll"),
        default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return {
            modifier: Number(root.querySelector("[name=modifier]")?.value || 0),
            cost: Number(root.querySelector("[name=cost]")?.value || defaultCost)
          };
        }
      },
      {
        action: "cancel",
        label: game.i18n.localize("TRUDVANG.Action.Cancel"),
        callback: () => false
      }
    ],
    modal: false,
    rejectClose: false
  });
}

/** Gather the encounter-specific modifiers applied to an NPC's fear-factor roll. */
export async function fearFactorDialog({title, factor}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const content = `<div class="trudvang roll-dialog fear-factor-dialog">
    <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.FearFactorBase", {factor}))}</p>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.AcclimatizationModifier"))}</label><input name="acclimatization" type="number" value="0"></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.SituationalModifier"))}</label><input name="situational" type="number" value="0"></div>
  </div>`;
  return DialogClass.wait({window: {title}, content, buttons: [
    {action: "roll", icon: "fas fa-dice-d10", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
      const root = button.form ?? dialog.element;
      return {acclimatization: Number(root.querySelector("[name=acclimatization]")?.value || 0), situational: Number(root.querySelector("[name=situational]")?.value || 0)};
    }},
    {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
  ], modal: false, rejectClose: false});
}

export async function combatPointDialog({title, pools, defaultAllocation = {}, buttonLabelKey = "TRUDVANG.Action.Roll", showModifier = true, totalLabelKey = "TRUDVANG.Dialog.AllocatedCombatPoints", alternateButtonLabelKey = "", hidePrimary = false, combatPointBonus = 0, modifierRows = [], feintMax = 0, ruleNotice = "", combatModes = null, movementModes = null, defaultMovementMode = "", targetPointCost = 1, allocationMultiple = 1, targetLabels = null, sizeTargets = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const modes = combatModes?.modes?.length ? combatModes.modes : [{id: "default", pools, defaultAllocation, rangeText: ""}];
  const defaultMode = modes.find(mode => mode.id === combatModes?.defaultMode) ?? modes[0];
  const hasModeToggle = combatModes && combatModes.toggle !== false;
  const maximumFeint = Math.max(0, Math.floor(Number(feintMax || 0)));
  const sizeModifier = Number(sizeTargets[0]?.modifier || 0);
  const varyingSizes = new Set(sizeTargets.map(target => target.modifier)).size > 1;
  const sizeRows = sizeTargets.filter(target => target.modifier !== 0);
  const breakdown = modifierRows.map(row => `<li><span>${escapeHtml(modifierLabel(row))}</span><b>${signedModifier(row.value)}</b></li>`).join("");
  const targets = Array.isArray(targetLabels) ? `<section class="combat-target-list"><strong>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.AttackTargets"))}</strong>${targetLabels.length
    ? `<ul>${targetLabels.map(name => `<li>${escapeHtml(name)}</li>`).join("")}</ul>`
    : `<p class="combat-no-targets">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.NoAttackTargets"))}</p>`}</section>` : "";
  const renderMode = mode => {
    const modePools = mode.pools || [];
    const allocation = mode.defaultAllocation || {};
    const initialTotal = Object.values(allocation).reduce((sum, amount) => sum + Number(amount || 0), 0);
    const maximum = modePools.reduce((sum, pool) => sum + Number(pool.current || 0), 0);
    const sliderMaximum = maximum - maximum % allocationMultiple;
    const sliderInitial = initialTotal - initialTotal % allocationMultiple;
    const modeMaximumFeint = Math.max(0, Math.floor(Number(mode.feintMax ?? maximumFeint)));
    const rows = modePools.map(pool => {
      const amount = Number(allocation[pool.id] || 0);
      const label = escapeHtml(pool.label || game.i18n.localize(pool.labelKey));
      return `<div class="form-group combat-pool-allocation"><label>${label}</label><span class="combat-pool-current">${pool.current}/${pool.max}</span><input data-pool-id="${escapeHtml(pool.id)}" aria-label="${label}" type="number" min="0" max="${pool.current}" step="1" value="${amount}"></div>`;
    }).join("");
    const rangeSelection = mode.ranged && mode.range ? `<section class="combat-range-selector"><span>${escapeHtml(game.i18n.localize("TRUDVANG.Field.Range"))}</span><div class="combat-range-cells" role="radiogroup">
      <button type="button" data-range-selection-value="short" aria-pressed="${mode.rangeSelection !== "long"}">${escapeHtml(game.i18n.format("TRUDVANG.Dialog.RangeShortSelection", {range: mode.range.short}))}</button>
      <button type="button" data-range-selection-value="long" aria-pressed="${mode.rangeSelection === "long"}">${escapeHtml(game.i18n.format("TRUDVANG.Dialog.RangeLongSelection", {range: mode.range.long}))}</button>
    </div><p data-range-consequence></p><input type="hidden" data-range-selection value="${mode.rangeSelection}"></section>` : "";
    const rangedTargetOptions = mode.ranged ? `<div class="combat-ranged-target-options">
      <label class="checkbox"><input type="checkbox" data-ranged-option="targetInMelee" data-ranged-modifier="-5"> ${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TargetInMelee"))}</label>
      <label class="checkbox"><input type="checkbox" data-ranged-option="targetMoving" data-ranged-modifier="-10"> ${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TargetMoving"))}</label>
    </div>` : "";
    return `<section data-combat-mode="${escapeHtml(mode.id)}" ${mode.id === defaultMode.id ? "" : "hidden"}>
      ${rangeSelection}
      ${movementModes?.length ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Resource.Movement"))}</label><select data-movement-mode>${movementModes.map(movement => `<option value="${escapeHtml(movement.id)}"${movement.id === defaultMovementMode ? " selected" : ""}>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.CombatMovementRate", {mode: movement.label, meters: movement.metersPerTwo}))}</option>`).join("")}</select></div>` : ""}
      ${rows}
      <div class="combat-pool-slider"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.CombatPoolSlider"))}</label><input type="range" data-combat-slider min="0" max="${sliderMaximum}" step="${allocationMultiple}" value="${sliderInitial}"></div>
      ${modeMaximumFeint ? `<div class="form-group"><label>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.Feint", {max: modeMaximumFeint}))}</label><input name="feint" type="number" min="0" max="${Math.min(modeMaximumFeint, initialTotal)}" step="1" value="0"></div>` : ""}
      ${sizeRows.length ? `<div class="combat-size-modifiers"><span>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.SizeAttackModifier"))}</span>${varyingSizes ? `<ul>${sizeRows.map(target => `<li>${escapeHtml(target.name)} : <b>${signedModifier(target.modifier)}</b></li>`).join("")}</ul>` : `<b>${signedModifier(sizeModifier)}</b>`}</div>` : ""}
      ${varyingSizes ? `<div class="combat-size-values"><span>${escapeHtml(game.i18n.localize(totalLabelKey))}</span><ul>${sizeTargets.map(target => `<li>${escapeHtml(target.name)} : <strong data-combat-target-total data-size-modifier="${target.modifier}">${allocatedCombatVC(sliderInitial, 0, target.modifier, targetPointCost)}</strong></li>`).join("")}</ul></div>` : `<p>${escapeHtml(game.i18n.localize(totalLabelKey))}: <strong data-combat-total>${allocatedCombatVC(sliderInitial, 0, sizeModifier, targetPointCost)}</strong></p>`}
      ${combatPointBonus ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EquipmentCombatPointBonus"))}: <strong>${combatPointBonus > 0 ? "+" : ""}${combatPointBonus}</strong></p>` : ""}
      ${breakdown ? `<ul class="combat-modifier-breakdown">${breakdown}</ul>` : ""}
      ${rangedTargetOptions}
      ${mode.ruleNotice || ruleNotice ? `<p class="combat-rule-notice"><i class="fas fa-circle-info"></i> ${escapeHtml(mode.ruleNotice || ruleNotice)}</p>` : ""}
      ${showModifier ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>` : ""}
      ${showModifier || combatPointBonus || breakdown ? `<p class="combat-final-target"><span>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}</span>${varyingSizes ? `<span>${sizeTargets.map(target => `<span>${escapeHtml(target.name)} : <strong data-combat-target-final data-size-modifier="${target.modifier}"></strong></span>`).join("<br>")}</span>` : `<strong data-combat-final-target></strong>`}</p>` : ""}
    </section>`;
  };
  const content = `<div class="trudvang roll-dialog combat-pool-dialog">
    ${targets}
    ${hasModeToggle ? `<label class="checkbox"><input type="checkbox" data-combat-mode-toggle ${combatModes.checked ? "checked" : ""}> ${escapeHtml(combatModes.label)}</label>` : ""}
    ${modes.map(renderMode).join("")}
  </div>`;

  class CombatPointDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const selectedMode = () => {
        if (!hasModeToggle) return defaultMode;
        return modes.find(mode => mode.id === (root.querySelector("[data-combat-mode-toggle]")?.checked ? combatModes.checkedMode : combatModes.uncheckedMode)) ?? defaultMode;
      };
      const selectedSection = () => root.querySelector(`[data-combat-mode="${selectedMode().id}"]`);
      const refresh = () => {
        const section = selectedSection();
        if (!section) return;
        const inputs = Array.from(section.querySelectorAll("[data-pool-id]"));
        const poolById = new Map(selectedMode().pools.map(pool => [pool.id, pool]));
        const total = inputs.reduce((sum, input) => {
          const maximum = Math.max(0, Number(poolById.get(input.dataset.poolId)?.current || 0));
          const amount = Math.min(maximum, Math.max(0, Math.trunc(Number(input.value || 0))));
          if (Number(input.value || 0) !== amount) input.value = String(amount);
          return sum + amount;
        }, 0);
        const longRange = section.querySelector("[data-range-selection]")?.value === "long";
        section.querySelectorAll("[data-range-selection-value]").forEach(button => {
          const selected = (button.dataset.rangeSelectionValue === "long") === longRange;
          button.classList.toggle("selected", selected);
          button.setAttribute("aria-pressed", String(selected));
        });
        const consequence = section.querySelector("[data-range-consequence]");
        if (consequence) consequence.textContent = game.i18n.localize(longRange ? "TRUDVANG.Dialog.RangeLongConsequence" : "TRUDVANG.Dialog.RangeShortConsequence");
        const rangedModifier = (longRange ? -10 : 0) + Array.from(section.querySelectorAll("[data-ranged-modifier]:checked")).reduce((sum, input) => sum + Number(input.dataset.rangedModifier || 0), 0);
        const feintInput = section.querySelector("[name=feint]");
        const modeMaximumFeint = Math.max(0, Math.floor(Number(selectedMode().feintMax ?? maximumFeint)));
        const feint = feintInput ? Math.min(Math.max(0, Number(feintInput.value || 0)), modeMaximumFeint, total) : 0;
        if (feintInput) { feintInput.max = String(Math.min(modeMaximumFeint, total)); feintInput.value = String(feint); }
        const attackTotal = allocatedCombatVC(total, feint, sizeModifier, targetPointCost);
        const output = section.querySelector("[data-combat-total]");
        if (output) output.textContent = String(attackTotal);
        section.querySelectorAll("[data-combat-target-total]").forEach(output => {
          output.textContent = String(allocatedCombatVC(total, feint, Number(output.dataset.sizeModifier), targetPointCost));
        });
        const finalTarget = section.querySelector("[data-combat-final-target]");
        if (finalTarget) {
          const manual = Number(section.querySelector("[name=modifier]")?.value || 0);
          const fixed = rollModifierTotal(modifierRows) + Number(combatPointBonus || 0);
          finalTarget.textContent = String(attackTotal + manual + fixed + rangedModifier);
        }
        section.querySelectorAll("[data-combat-target-final]").forEach(output => {
          const fixed = rollModifierTotal(modifierRows) + Number(combatPointBonus || 0);
          output.textContent = String(allocatedCombatVC(total, feint, Number(output.dataset.sizeModifier), targetPointCost) + Number(section.querySelector("[name=modifier]")?.value || 0) + fixed + rangedModifier);
        });
        const slider = section.querySelector("[data-combat-slider]");
        if (slider) slider.value = String(total - total % allocationMultiple);
      };
      const allocate = (section, requested) => {
        let remaining = Math.max(0, Number(requested || 0));
        for (const pool of [...selectedMode().pools].sort((left, right) => right.priority - left.priority)) {
          const input = Array.from(section.querySelectorAll("[data-pool-id]")).find(candidate => candidate.dataset.poolId === pool.id);
          if (!input) continue;
          const amount = Math.min(Number(pool.current || 0), remaining);
          input.value = String(amount);
          remaining -= amount;
        }
      };
      root.querySelectorAll("[data-combat-mode-toggle]").forEach(toggle => toggle.addEventListener("change", () => {
        const active = selectedMode().id;
        root.querySelectorAll("[data-combat-mode]").forEach(section => section.hidden = section.dataset.combatMode !== active);
        refresh();
      }));
      root.querySelectorAll("[data-range-selection-value]").forEach(button => button.addEventListener("click", event => {
        const section = event.currentTarget.closest("[data-combat-mode]");
        const selection = section?.querySelector("[data-range-selection]");
        if (selection) selection.value = event.currentTarget.dataset.rangeSelectionValue;
        refresh();
      }));
      root.querySelectorAll("[data-combat-slider]").forEach(slider => slider.addEventListener("input", event => { allocate(event.currentTarget.closest("[data-combat-mode]"), event.currentTarget.value); refresh(); }));
      root.querySelectorAll("[data-pool-id], [name=feint], [name=modifier], [data-ranged-modifier], [data-range-selection]").forEach(input => input.addEventListener("input", refresh));
      refresh();
    }
  }

  const buttons = [];
  if (!hidePrimary) buttons.push({
    action: "roll",
    icon: "fas fa-dice-d20",
    label: game.i18n.localize(buttonLabelKey),
    default: true,
    callback: (event, button, dialog) => {
      const root = button.form ?? dialog.element;
      const mode = hasModeToggle
        ? (root.querySelector("[data-combat-mode-toggle]")?.checked ? combatModes.checkedMode : combatModes.uncheckedMode)
        : defaultMode.id;
      const section = root.querySelector(`[data-combat-mode="${mode}"]`) ?? root;
      return {
        mode,
        modifier: Number(section.querySelector("[name=modifier]")?.value || 0),
        feint: Number(section.querySelector("[name=feint]")?.value || 0),
        ranged: {
          rangeSelection: section.querySelector("[data-range-selection]")?.value || "short",
          ...Object.fromEntries(Array.from(section.querySelectorAll("[data-ranged-option]")).map(input => [input.dataset.rangedOption, input.checked]))
        },
        movementMode: section.querySelector("[data-movement-mode]")?.value || "",
        allocation: normalizeCombatAllocation((modes.find(candidate => candidate.id === mode) ?? defaultMode).pools, Object.fromEntries(Array.from(section.querySelectorAll("[data-pool-id]"))
          .map(input => [input.dataset.poolId, Number(input.value || 0)])), {multiple: allocationMultiple}).allocation
      };
    }
  });
  if (alternateButtonLabelKey) buttons.push({
    action: "alternate",
    icon: "fas fa-hourglass-end",
    label: game.i18n.localize(alternateButtonLabelKey),
    default: hidePrimary,
    callback: () => ({alternate: true})
  });
  buttons.push({action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false});

  return CombatPointDialog.wait({
    window: {title},
    content,
    buttons,
    modal: false,
    rejectClose: false
  });
}

export async function fixedAttackDialog({title, baseVC = 0, targets = [], targetTraitLabel = "", modifierRows = []} = {}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const base = Number.isFinite(Number(baseVC)) ? Math.trunc(Number(baseVC)) : 0;
  const fixedModifier = modifierRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
  const breakdown = modifierRows.map(row => `<li><span>${escapeHtml(modifierLabel(row))}</span><b>${signedModifier(row.value)}</b></li>`).join("");
  const hasTargets = targets.some(target => target?.token || target?.actor);
  const targetRows = hasTargets ? `<ul class="fixed-attack-targets">${targets.filter(target => target?.token || target?.actor).map(target => {
    const name = escapeHtml(target.name || target.actor?.name || "");
    const traitText = target.trait === "none" ? game.i18n.localize("TRUDVANG.Dialog.FixedAttackNoTrait")
      : game.i18n.format("TRUDVANG.Dialog.FixedAttackTargetValue", {
        trait: targetTraitLabel, value: signedModifier(target.traitValue)
      });
    return `<li data-fixed-attack-target data-trait-value="${Number(target.traitValue || 0)}"><span>${name}<small>${escapeHtml(traitText)}</small></span><strong>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FixedAttackFinalTarget"))} <b data-fixed-attack-final>${base - Number(target.traitValue || 0) + fixedModifier}</b></strong></li>`;
  }).join("")}</ul>` : `<p class="combat-no-targets">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FixedAttackNoTargets"))}<strong>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FixedAttackFinalTarget"))} <b data-fixed-attack-no-target-final>${base + fixedModifier}</b></strong></p>`;
  const content = `<div class="trudvang roll-dialog fixed-attack-dialog">
    <section class="combat-target-list"><strong>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.AttackTargets"))}</strong>${targetRows}</section>
    <p class="fixed-attack-base-target">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FixedAttackBaseTarget"))}: <strong>${base}</strong></p>
    ${breakdown ? `<ul class="combat-modifier-breakdown">${breakdown}</ul>` : ""}
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
  </div>`;
  class FixedAttackDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const manual = Number(root.querySelector("[name=modifier]")?.value || 0);
        root.querySelectorAll("[data-fixed-attack-target]").forEach(row => {
          const total = base - Number(row.dataset.traitValue || 0) + fixedModifier + manual;
          const output = row.querySelector("[data-fixed-attack-final]");
          if (output) output.textContent = String(total);
        });
        const noTargetOutput = root.querySelector("[data-fixed-attack-no-target-final]");
        if (noTargetOutput) noTargetOutput.textContent = String(base + fixedModifier + manual);
      };
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return FixedAttackDialog.wait({
    window: {title}, content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true,
        callback: (event, button, dialog) => ({modifier: Number((button.form ?? dialog.element).querySelector("[name=modifier]")?.value || 0)})},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false, rejectClose: false
  });
}

/**
 * Ask for a Situation Value (SV) without requiring any actor: the dialog used by
 * the generic situation-roll macro and by `game.trudvang.rollGenericSituation()`.
 */
export async function genericSituationDialog({defaultTarget = 10, modifierRows = []} = {}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const content = `
    <div class="trudvang roll-dialog">
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.SituationLabel"))}</label><input name="label" type="text" value="${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.GenericSituationTitle"))}"></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.GenericSituationSV"))}</label><input name="target" type="number" value="${Number(defaultTarget) || 0}"></div>
      ${modifierList(modifierRows)}
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.GenericSituationModifier"))}</label><input name="modifier" type="number" value="0"></div>
      <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TotalSituationValue"))}: <strong data-final-target>${Number(defaultTarget) + rollModifierTotal(modifierRows)}</strong></p>
    </div>`;
  class SituationRollDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const output = root.querySelector("[data-final-target]");
        if (output) output.textContent = Number(root.querySelector("[name=target]")?.value || 0)
          + Number(root.querySelector("[name=modifier]")?.value || 0) + rollModifierTotal(modifierRows);
      };
      root.querySelector("[name=target]")?.addEventListener("input", refresh);
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return SituationRollDialog.wait({
    window: {title: game.i18n.localize("TRUDVANG.Dialog.GenericSituationTitle")},
    content,
    buttons: [
      {
        action: "roll",
        icon: "fas fa-dice-d20",
        label: game.i18n.localize("TRUDVANG.Action.Roll"),
        default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          return {
            target: Number(root.querySelector("[name=target]")?.value || 0),
            label: String(root.querySelector("[name=label]")?.value || ""),
            modifier: Number(root.querySelector("[name=modifier]")?.value || 0)
          };
        }
      },
      {
        action: "cancel",
        label: game.i18n.localize("TRUDVANG.Action.Cancel"),
        callback: () => false
      }
    ],
    modal: false,
    rejectClose: false
  });
}

/**
 * Roll a generic 1d20 roll-under situation check with no actor required. Called
 * with no arguments, the SV dialog opens first (cancel/X resolves null and posts
 * nothing); called with explicit arguments it rolls straight to chat. Speaker
 * resolution: selected token actor, then the user's character, then a fallback
 * on the current user. Natural 1 always succeeds, natural 20 always fails.
 */
export async function rollGenericSituation({target, label, modifier} = {}) {
  // Fix the performer before opening the dialog: displayed states and the
  // resulting roll must belong to the same actor even if selection changes.
  const actor = globalThis.canvas?.tokens?.controlled?.[0]?.actor ?? game.user?.character ?? null;
  const modifierRows = actor ? [...(actor.rollEffectRows?.({kind: "situation"}) ?? []), ...actorStateRollModifiers(actor)] : [];
  let situationTarget = target;
  let situationLabel = label;
  let situationModifier = modifier;
  if (situationTarget === undefined && situationLabel === undefined && situationModifier === undefined) {
    const answered = await genericSituationDialog({modifierRows});
    if (!answered) return null;
    ({target: situationTarget, label: situationLabel, modifier: situationModifier} = answered);
  }
  const finalTarget = Number(situationTarget ?? 10) + Number(situationModifier || 0) + rollModifierTotal(modifierRows);
  const resolvedLabel = String(situationLabel || game.i18n.localize("TRUDVANG.Dialog.GenericSituationTitle"));
  const actorName = actor?.name ?? game.user?.name ?? "";
  const actorImg = actor?.img ?? "icons/svg/d20.svg";
  const actorUuid = actor?.uuid ?? "";
  const roll = await evaluate("1d20");
  const result = Number(roll.total);
  const critical = result === 20 ? "failure" : result <= 1 ? "success" : "";
  const success = critical === "success" || (result !== 20 && result <= finalTarget);
  const margin = success ? Math.max(0, finalTarget - result) : null;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/roll-card.hbs", {
    actorName,
    actorImg,
    label: resolvedLabel,
    result,
    target: finalTarget,
    modifier: Number(situationModifier || 0) + rollModifierTotal(modifierRows),
    success,
    margin,
    critical,
    kind: "situation",
    flavor: rollModifierFlavor(modifierRows),
    itemUuid: "",
    naturalDamage: false,
    actorUuid,
    usage: "",
    longRange: false,
    feint: 0
  });
  await ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({actor}) : ChatMessage.getSpeaker(),
    content,
    rolls: [roll]
  });
  return {roll, result, target: finalTarget, success, critical, margin};
}

/**
 * GM dialog: pick a trait and a base Situation Value, then post a request card
 * with a button players click to roll with their controlled character.
 */
export async function gmTraitSituationDialog() {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const traits = Object.entries(TRUDVANG.traits).map(([id, label]) => ({id, label: game.i18n.localize(label)}));
  const traitOptions = [
    ...traits.map(trait => `<option value="${escapeHtml(trait.id)}">${escapeHtml(trait.label)}</option>`),
    `<option value="aucun">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationNoTrait"))}</option>`
  ].join("");
  const content = `<div class="trudvang roll-dialog">
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationTrait"))}</label><select name="trait">${traitOptions}</select></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationSV"))}</label><input name="sv" type="number" value="10"></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationSpecificTitle"))}</label><input name="title" type="text"></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationSuccessConsequence"))}</label><textarea name="success"></textarea></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationFailureConsequence"))}</label><textarea name="failure"></textarea></div>
  </div>`;
  return DialogClass.wait({
    window: {title: game.i18n.localize("TRUDVANG.Dialog.TraitSituationTitle")},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-shield-halved", label: game.i18n.localize("TRUDVANG.Action.ShowInChat"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        return {
          traitKey: root.querySelector("[name=trait]")?.value,
          situationValue: Number(root.querySelector("[name=sv]")?.value || 0),
          title: root.querySelector("[name=title]")?.value?.trim() ?? "",
          success: root.querySelector("[name=success]")?.value?.trim() ?? "",
          failure: root.querySelector("[name=failure]")?.value?.trim() ?? ""
        };
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

/**
 * Post a trait situation request card. Called by the GM macro after the dialog,
 * or directly with explicit arguments. No `rolls` field — Dice So Nice stays silent.
 */
export async function requestTraitSituationRoll({traitKey, situationValue, title = "", success = "", failure = ""} = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.GMOnly"));
    return null;
  }
  if (traitKey === undefined && situationValue === undefined) {
    const answered = await gmTraitSituationDialog();
    if (!answered) return null;
    ({traitKey, situationValue, title, success, failure} = answered);
  }
  if (!(traitKey === "aucun" || TRUDVANG.traits[traitKey]) || !Number.isInteger(Number(situationValue))) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.InvalidTraitSituation"));
    return null;
  }
  const sv = Number(situationValue);
  const traitLabel = traitKey === "aucun"
    ? game.i18n.localize("TRUDVANG.Dialog.TraitSituationNoTrait")
    : game.i18n.localize(TRUDVANG.traits[traitKey]);
  const buttonLabel = traitKey === "aucun"
    ? game.i18n.localize("TRUDVANG.Dialog.GenericSituationTitle")
    : game.i18n.format("TRUDVANG.Dialog.TraitSituationButton", {trait: traitLabel});
  const rollTitle = String(title ?? "").trim() || buttonLabel;
  const successConsequence = String(success ?? "").trim();
  const failureConsequence = String(failure ?? "").trim();
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/trait-situation-request-card.hbs", {
    gmName: game.user.name,
    gmImg: game.user.avatar || "icons/svg/d20.svg",
    title: rollTitle,
    buttonLabel,
    traitKey,
    sv,
    success: successConsequence,
    failure: failureConsequence,
    responses: []
  });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    style: CONST.CHAT_MESSAGE_STYLES.OTHER,
    flags: {[SYSTEM_ID]: {traitSituation: {
      traitKey, sv, title: rollTitle, success: successConsequence, failure: failureConsequence, responses: []
    }}}
  });
  return {traitKey, sv, title: rollTitle, success: successConsequence, failure: failureConsequence};
}

/**
 * Player dialog for configured resistance tests. Known values are prefilled while
 * conditional and repeated modifiers remain explicit choices in the same roll window.
 */
export async function playerTraitSituationDialog({title, traitLabel, traitValue, traitValues = [], traitMethod = "first", effect, effectRows = [], base, sv, svChoices = [], modifierChoices = [], repeatedModifiers = [], notes = [], svEditable = false, modifierRows = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const trait = Number(traitValue) || 0;
  const effectModifier = Number(effect) || 0;
  const situationBase = Number(base ?? sv) || 0;
  const hasTwoTraitSlots = traitValues.length > 1;
  const multiTrait = traitValues.filter(row => row.key !== "aucun").length > 1;
  const multiTraitRows = hasTwoTraitSlots ? `<div class="trait-roll-values">${traitValues.map(row => `<div class="form-group"><label>${escapeHtml(row.label)}</label><input type="number" value="${Number(row.value) || 0}" readonly><p class="hint">${escapeHtml(game.i18n.format("TRUDVANG.Dialog.RuleTestTraitSpecificEffect", {value: Number(row.effect) || 0}))}</p></div>`).join("")}<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EffectModifier"))}</label><input name="effect" type="number" value="${effectModifier}" readonly></div></div>` : "";
  const traitMethodControl = multiTrait ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitMethod"))}</label><select name="trait-method">${[
    ["first", game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitFirst")],
    ["second", game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitSecond")],
    ["average", game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitAverage")],
    ["sum", game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitSum")],
    ["best", game.i18n.localize("TRUDVANG.Dialog.RuleTestTraitBest")]
  ].map(([value, label]) => `<option value="${value}" ${traitMethod === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></div>` : "";
  const choiceText = choice => `${choice.condition || ""}${choice.value === undefined ? "" : ` — ${typeof choice.value === "number" ? signedModifier(choice.value) : String(choice.value)}`}`;
  const svChoiceControl = svChoices.length ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestSVCondition"))}</label><select name="sv-choice"><option value="">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestNoCondition"))}</option>${svChoices.map((choice, index) => `<option value="${index}">${escapeHtml(choiceText(choice))}</option>`).join("")}</select></div>` : "";
  const modifierChoiceControl = modifierChoices.length ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestModifierCondition"))}</label><select name="modifier-choice"><option value="">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestNoCondition"))}</option>${modifierChoices.map((choice, index) => `<option value="${index}">${escapeHtml(choiceText(choice))}</option>`).join("")}</select><input name="condition-modifier" type="number" value="0" aria-label="${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestConditionModifierValue"))}"></div>` : "";
  const repeatedModifierControls = repeatedModifiers.map((modifier, index) => {
    const value = numericModifier(modifier.value);
    const signed = value === null ? String(modifier.value ?? "") : signedModifier(value * (modifier.direction ?? 1));
    return `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.RuleTestRepeatedModifier"))}</label><input name="repeat-${index}" type="number" min="0" step="1" value="0"><p class="hint">${escapeHtml(`${modifier.condition || ""}${signed ? ` (${signed})` : ""}`)}</p></div>`;
  }).join("");
  const situationField = `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationPlayerSV"))}</label><input name="sv" type="number" value="${situationBase}" ${svEditable || svChoices.length ? "" : "readonly"}></div>`;
  const repeatedModifierTotal = root => {
    const raw = repeatedModifiers.reduce((sum, modifier, index) => {
      const count = Math.max(0, Number(root.querySelector(`[name=repeat-${index}]`)?.value || 0));
      return sum + count * (numericModifier(modifier.value) ?? 0) * (modifier.direction ?? 1);
    }, 0);
    const minimum = repeatedModifiers.map(modifier => numericModifier(modifier.minimum)).filter(Number.isFinite);
    if (!minimum.length) return raw;
    const selectedModifier = Number(root.querySelector("[name=condition-modifier]")?.value || 0);
    const situationValue = Number(root.querySelector("[name=sv]")?.value ?? situationBase);
    return Math.max(raw, ...minimum.map(value => value - situationValue - selectedModifier));
  };
  const content = `<div class="trudvang roll-dialog trait-roll-dialog">
    ${multiTraitRows || `<div class="trait-roll-values">
      <div class="form-group"><label>${escapeHtml(traitLabel)}</label><input name="trait" type="number" value="${trait}" readonly></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EffectModifier"))}</label><input name="effect" type="number" value="${effectModifier}" readonly></div>
    </div>`}
    ${modifierList(effectRows.map(row => ({...row, included: true})))}
    ${traitMethodControl}
    ${svChoiceControl}
    ${situationField}
    ${modifierChoiceControl}
    ${repeatedModifierControls}
    ${modifierList(modifierRows)}
    ${notes.length ? `<aside class="rule-test-notes">${notes.map(note => `<p>${escapeHtml(note)}</p>`).join("")}</aside>` : ""}
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationPlayerModifier"))}</label><input name="modifier" type="number" value="0"></div>
    <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.TraitSituationPlayerFinal"))}: <strong data-final-target>${situationBase + trait + effectModifier + rollModifierTotal(modifierRows)}</strong></p>
  </div>`;
  class PlayerTraitDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const configuredModifierValue = () => Number(root.querySelector("[name=condition-modifier]")?.value || 0);
      const currentTraitModifier = () => hasTwoTraitSlots
        ? calculateTraitModifier(traitValues.map(row => Number(row.value) + Number(row.effect || 0)), root.querySelector("[name=trait-method]")?.value || traitMethod)
        : trait;
      const refresh = () => {
        const target = root.querySelector("[data-final-target]");
        const situationValue = Number(root.querySelector("[name=sv]")?.value ?? situationBase);
        if (target) target.textContent = situationValue + currentTraitModifier() + effectModifier + configuredModifierValue() + repeatedModifierTotal(root) + rollModifierTotal(modifierRows) + Number(root.querySelector("[name=modifier]")?.value || 0);
      };
      root.querySelector("[name=sv-choice]")?.addEventListener("change", event => {
        const choice = event.currentTarget.value === "" ? null : svChoices[Number(event.currentTarget.value)];
        const value = choice ? numericModifier(choice.value) : null;
        const input = root.querySelector("[name=sv]");
        if (input && value !== null) input.value = value;
        refresh();
      });
      root.querySelector("[name=modifier-choice]")?.addEventListener("change", event => {
        const choice = event.currentTarget.value === "" ? null : modifierChoices[Number(event.currentTarget.value)];
        const input = root.querySelector("[name=condition-modifier]");
        if (input) input.value = choice ? numericModifier(choice.value) ?? 0 : 0;
        refresh();
      });
      root.querySelector("[name=sv]")?.addEventListener("input", refresh);
      root.querySelector("[name=trait-method]")?.addEventListener("change", refresh);
      root.querySelector("[name=condition-modifier]")?.addEventListener("input", refresh);
      repeatedModifiers.forEach((_, index) => root.querySelector(`[name=repeat-${index}]`)?.addEventListener("input", refresh));
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
      refresh();
    }
  }
  return PlayerTraitDialog.wait({
    window: {title},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        const situationValue = Number(root.querySelector("[name=sv]")?.value ?? situationBase);
        const configuredModifier = Number(root.querySelector("[name=condition-modifier]")?.value || 0);
        const repeatedModifier = repeatedModifierTotal(root);
        const result = {modifier: Number(root.querySelector("[name=modifier]")?.value || 0)};
        if (multiTrait) result.traitModifier = currentTraitModifier();
        if (base !== undefined || svChoices.length || modifierChoices.length || repeatedModifiers.length || svEditable) {
          Object.assign(result, {situationValue, configuredModifier, repeatedModifier});
        }
        return result;
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}
