import { escapeHtml, renderTemplate } from "./helpers.mjs";
import { resolveDamage, resolveEquipment } from "./rules/equipment-resolver.mjs";

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

export async function rollUnder({actor, label, target, modifier = 0, kind = "skill", flavor = "", item = null, perfectSuccessMax = 1}) {
  const finalTarget = Number(target) + Number(modifier || 0);
  const roll = await evaluate("1d20");
  const result = Number(roll.total);
  const critical = result === 20 ? "failure" : (perfectSuccessMax > 0 && result <= perfectSuccessMax) ? "success" : "";
  const success = critical === "success" || (result !== 20 && result <= finalTarget);
  const margin = success ? Math.max(0, finalTarget - result) : null;
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
    kind,
    flavor,
    itemUuid: item?.uuid ?? "",
    naturalDamage: item?.id === "humanoid-natural",
    actorUuid: actor.uuid
  });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({actor}),
    content,
    rolls: [roll]
  });
  return {roll, result, target: finalTarget, success, critical, margin};
}

export async function initiativeDialog({actor, target, lightningQuickLevel = 0}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const magicChoices = actor.items.filter(item => ["spell", "divineFeat"].includes(item.type)).filter(item => {
    const tablet = actor.items.find(candidate => candidate.type === "tablet" && (candidate.system.catalogId === item.system.tabletId || candidate.name === item.system.tablet));
    return !tablet || Number(item.system.level || 1) <= Number(tablet.system.level || 1);
  }).map(item => {
    const level = Math.max(1, Math.min(5, Number(item.system.level || 1)));
    const modifier = -level + (item.type === "divineFeat" ? 2 * Number(lightningQuickLevel || 0) : 0);
    return `<option value="${modifier}">${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</option>`;
  }).join("");
  const equipmentChoices = actor.items.filter(item => ["weapon", "shield"].includes(item.type) && item.system.equipped).map(item => {
    const modifier = resolveEquipment({item, actor}).characteristics.initiativeModifier.value;
    return `<label class="checkbox"><input type="checkbox" data-initiative-equipment value="${modifier}"> ${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</label>`;
  }).join("");
  const content = `
    <div class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target}))}</p>
      ${equipmentChoices ? `<fieldset class="initiative-equipment"><legend>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.InitiativeEquipment"))}</legend>${equipmentChoices}</fieldset>` : ""}
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.InitiativeMagic"))}</label><select name="magicModifier"><option value="0">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.NoInitiativeAction"))}</option>${magicChoices}</select></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
    </div>`;
  return DialogClass.wait({
    window: {title: game.i18n.localize("TRUDVANG.Action.RollInitiative")},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d10", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
        const root = button.form ?? dialog.element;
        const equipmentModifier = Array.from(root.querySelectorAll("[data-initiative-equipment]:checked")).reduce((sum, input) => sum + Number(input.value || 0), 0);
        return {modifier: Number(root.querySelector("[name=modifier]")?.value || 0) + Number(root.querySelector("[name=magicModifier]")?.value || 0) + equipmentModifier};
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

export async function magicDialog({title, methods, spellModifier = 0, defaultCost = 0, resourceLabel = "", strenuousMax = 0}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const options = methods.map(method => {
    const target = Number(method.target || 0) + Number(spellModifier || 0);
    return `<option value="${escapeHtml(method.id)}">${escapeHtml(method.label)} — VC ${target}</option>`;
  }).join("");
  const initialTarget = Number(methods[0]?.target || 0) + Number(spellModifier || 0);
  const strenuousOptions = Array.from({length: Number(strenuousMax || 0) + 1}, (_, bonus) => `<option value="${bonus}">+${bonus} SV (+${bonus * 2} ${escapeHtml(game.i18n.localize("TRUDVANG.Resource.Vitner"))})</option>`).join("");
  const content = `<div class="trudvang roll-dialog magic-roll-dialog">
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.MagicMethod"))}</label><select name="method">${options}</select></div>
    <p class="magic-breakdown">${escapeHtml(methods[0]?.breakdown || "")}</p>
    <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-final-target>${initialTarget}</strong></p>
    <div class="form-group"><label>${escapeHtml(resourceLabel)}</label><input name="cost" type="number" min="0" value="${Number(defaultCost || 0)}"></div>
    ${strenuousMax ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Strenuous"))}</label><select name="strenuous">${strenuousOptions}</select></div>` : ""}
    ${strenuousMax ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalVitnerCost"))}: <strong data-final-cost>${Number(defaultCost || 0)}</strong></p>` : ""}
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
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
        if (output) output.textContent = Number(method?.target || 0) + Number(spellModifier || 0) + strenuousBonus;
        const finalCost = root.querySelector("[data-final-cost]");
        if (finalCost) finalCost.textContent = Math.max(0, Number(root.querySelector("[name=cost]")?.value || 0)) + (2 * strenuousBonus);
        const breakdown = root.querySelector(".magic-breakdown");
        if (breakdown) breakdown.textContent = method?.breakdown || "";
      };
      root.querySelector("[name=method]")?.addEventListener("change", refresh);
      root.querySelector("[name=strenuous]")?.addEventListener("change", refresh);
      root.querySelector("[name=cost]")?.addEventListener("input", refresh);
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
        return {method, strenuousBonus, target: Number(method?.target || 0) + Number(spellModifier || 0) + strenuousBonus, cost: Math.max(0, Number(root.querySelector("[name=cost]")?.value || 0)) + (2 * strenuousBonus), modifier: Number(root.querySelector("[name=modifier]")?.value || 0)};
      }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

export async function rollDamage({actor, item}) {
  const damage = resolveDamage({actor, item});
  const formula = damage.formula;
  const parsed = damage.parsed;
  let total;
  let unclampedTotal;
  let detail;
  let rolls = [];
  if (parsed) {
    const fixed = parsed.modifier + damage.modifier.value;
    const exploded = await openDice({dice: parsed.dice, faces: parsed.faces, threshold: damage.openRoll.value, modifier: fixed});
    unclampedTotal = exploded.total;
    total = Math.max(damage.minimumTotal, unclampedTotal);
    detail = exploded.rolls.join(" + ");
    if (fixed > 0) detail += ` + ${fixed}`;
    else if (fixed < 0) detail += ` - ${Math.abs(fixed)}`;
    rolls = exploded.diceRolls; // Pass the open-ended Roll objects so Dice So Nice animates them too.
  } else {
    const roll = await evaluate(`(${formula}) + (${damage.modifier.value})`);
    unclampedTotal = Number(roll.total);
    total = Math.max(damage.minimumTotal, unclampedTotal);
    detail = roll.formula;
    rolls = [roll];
  }
  const modifierDetails = [];
  const signed = value => Number(value) > 0 ? `+${Number(value)}` : `${Number(value)}`;
  const intrinsicModifier = Number(parsed?.modifier || 0) + damage.modifier.base;
  if (intrinsicModifier) modifierDetails.push(game.i18n.format("TRUDVANG.Calculation.Equipment.IntrinsicDamageBonus", {amount: signed(intrinsicModifier)}));
  for (const step of damage.modifier.steps) {
    if (step.amount && step.explanationKey) modifierDetails.push(game.i18n.format(step.explanationKey, {...step.explanationData, amount: signed(step.amount)}));
  }
  if (total !== unclampedTotal) {
    modifierDetails.push(game.i18n.localize("TRUDVANG.Calculation.Equipment.MinimumDamage"));
  }
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-card.hbs", {
    actorName: actor.name,
    actorImg: actor.img,
    itemName: item.name,
    itemImg: item.img,
    total,
    detail,
    openRoll: damage.openRoll.value,
    modifierDetails
  });
  await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content, rolls});
  return total;
}

/**
 * Select the kind of roll made from a character trait.
 *
 * Trait values already include changes made directly to the trait; `effect` is
 * reserved for roll modifiers supplied by active effects. Keeping the two
 * visible makes the source of the final value clear to the player.
 */
export async function traitRollDialog({title, traitLabel, traitValue = 0, effect = 0}) {
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
      <div class="form-group"><label>${localize("TRUDVANG.Dialog.EffectModifier")}</label><input name="effect" type="number" value="${effectModifier}" readonly></div>
    </div>
    <section data-roll-mode="situation">
      <div class="form-group"><label>${localize("TRUDVANG.Dialog.SituationValue")}</label><input name="situationValue" type="number" value="10"></div>
      <p>${localize("TRUDVANG.Dialog.TotalSituationValue")}: <strong data-final-target>${10 + trait + effectModifier}</strong></p>
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
        if (target) target.textContent = Number(root.querySelector("[name=situationValue]")?.value || 0) + trait + effectModifier;
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

export async function modifierDialog({title, target, showCost = false, defaultCost = 0, resourceLabel = ""}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const content = `
    <div class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target}))}</p>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
      ${showCost ? `<div class="form-group"><label>${escapeHtml(resourceLabel)}</label><input name="cost" type="number" min="0" value="${Number(defaultCost)}"></div>` : ""}
    </div>`;
  return DialogClass.wait({
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

export async function combatPointDialog({title, pools, defaultAllocation = {}, buttonLabelKey = "TRUDVANG.Action.Roll", showModifier = true, totalLabelKey = "TRUDVANG.Dialog.AllocatedCombatPoints", alternateButtonLabelKey = "", hidePrimary = false, combatPointBonus = 0, modifierRows = []}) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const rows = pools.map(pool => {
    const amount = Number(defaultAllocation[pool.id] || 0);
    const label = escapeHtml(game.i18n.localize(pool.labelKey));
    return `<div class="form-group combat-pool-allocation">
      <label for="combat-pool-${escapeHtml(pool.id)}">${label}</label>
      <span class="combat-pool-current">${pool.current}/${pool.max}</span>
      <input id="combat-pool-${escapeHtml(pool.id)}" data-pool-id="${escapeHtml(pool.id)}" aria-label="${label}" type="number" min="0" max="${pool.current}" step="1" value="${amount}">
    </div>`;
  }).join("");
  const initialTotal = Object.values(defaultAllocation).reduce((sum, amount) => sum + Number(amount || 0), 0);
  const maximum = pools.reduce((sum, pool) => sum + Number(pool.current || 0), 0);
  const breakdown = modifierRows.map(row => `<li><span>${escapeHtml(row.label)}</span><b>${Number(row.value) > 0 ? "+" : ""}${Number(row.value || 0)}</b></li>`).join("");
  const content = `<div class="trudvang roll-dialog combat-pool-dialog">
    ${rows}
    <div class="combat-pool-slider"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.CombatPoolSlider"))}</label><input type="range" data-combat-slider min="0" max="${maximum}" step="1" value="${initialTotal}"></div>
    <p>${escapeHtml(game.i18n.localize(totalLabelKey))}: <strong data-combat-total>${initialTotal}</strong></p>
    ${combatPointBonus ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.EquipmentCombatPointBonus"))}: <strong>${combatPointBonus > 0 ? "+" : ""}${combatPointBonus}</strong></p>` : ""}
    ${breakdown ? `<ul class="combat-modifier-breakdown">${breakdown}</ul>` : ""}
    ${showModifier || combatPointBonus || breakdown ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-combat-final-target></strong></p>` : ""}
    ${showModifier ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>` : ""}
  </div>`;

  class CombatPointDialog extends DialogClass {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const total = Array.from(root.querySelectorAll("[data-pool-id]"))
          .reduce((sum, input) => sum + Math.max(0, Number(input.value || 0)), 0);
        const output = root.querySelector("[data-combat-total]");
        if (output) output.textContent = String(total);
        const finalTarget = root.querySelector("[data-combat-final-target]");
        if (finalTarget) {
          const manual = Number(root.querySelector("[name=modifier]")?.value || 0);
          const fixed = modifierRows.reduce((sum, row) => sum + Number(row.value || 0), Number(combatPointBonus || 0));
          finalTarget.textContent = String(total + manual + fixed);
        }
      };
      const inputs = Array.from(root.querySelectorAll("[data-pool-id]"));
      const slider = root.querySelector("[data-combat-slider]");
      const allocate = requested => {
        let remaining = Math.max(0, Number(requested || 0));
        for (const pool of [...pools].sort((left, right) => right.priority - left.priority)) {
          const input = inputs.find(candidate => candidate.dataset.poolId === pool.id);
          if (!input) continue;
          const amount = Math.min(Number(pool.current || 0), remaining);
          input.value = String(amount);
          remaining -= amount;
        }
      };
      slider?.addEventListener("input", event => { allocate(event.currentTarget.value); refresh(); });
      inputs.forEach(input => input.addEventListener("input", () => { if (slider) slider.value = String(inputs.reduce((sum, field) => sum + Math.max(0, Number(field.value || 0)), 0)); refresh(); }));
      root.querySelector("[name=modifier]")?.addEventListener("input", refresh);
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
      return {
        modifier: Number(root.querySelector("[name=modifier]")?.value || 0),
        allocation: Object.fromEntries(Array.from(root.querySelectorAll("[data-pool-id]"))
          .map(input => [input.dataset.poolId, Number(input.value || 0)]))
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
