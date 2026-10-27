import {escapeHtml} from "./helpers.mjs";
import {rollUnder, rollModifierFlavor} from "./dice.mjs";
import {testActorForUser} from "./rule-tests.mjs";
import {rollModifierTotal} from "./rules/roll-state-resolver.mjs";
import {transformationRollRows} from "./rules/transformation-profile.mjs";
import {PROCEDURES, TRAINING_FACTORS, HUNTING_FOOD, procedureValues, procedureOutcome} from "./rules/knowledge-procedures.mjs";
import {trainedAnimalActions} from "./rules/trained-animal-actions.mjs";

const key = name => `TRUDVANG.Procedure.${name}`;
const t = name => game.i18n.localize(key(name));
const e = value => escapeHtml(String(value));
export function knowledgeProcedureDescription(html, item) {
  const kind = item.type === "ability" ? PROCEDURES[item.system.catalogId] : null;
  const buttons = kind ? [`<button type="button" class="trudvang-inline-rule-test" data-action="knowledge-procedure"><i class="fas fa-dice-d20"></i> ${e(t(kind))}</button>`] : [];
  for (const action of trainedAnimalActions(item)) buttons.push(`<button type="button" class="trudvang-inline-rule-test" data-action="trained-animal-action" data-training-action="${action}"><i class="fas fa-dice-d20"></i> ${e(game.i18n.localize(`TRUDVANG.AnimalAction.${action}`))}</button>`);
  return buttons.length ? `${html}<p>${buttons.join(" ")}</p>` : html;
}
const select = (name, options) => `<div class="form-group"><label>${e(t(name))}</label><select name="${name}">${options.map(([value, label]) => `<option value="${value}"${name === "terrain" && value === 0 ? " selected" : ""}>${e(label)}</option>`).join("")}</select></div>`;
const number = (name, value, min = 0, max = 9999) => `<div class="form-group"><label>${e(t(name))}</label><input name="${name}" type="number" value="${value}" min="${min}" max="${max}" step="1" required></div>`;
const check = name => `<label class="checkbox"><input name="${name}" type="checkbox"> ${e(t(name))}</label>`;
function fields(kind, item) {
  if (kind === "hunt") return select("size", ["Small", "Medium", "Large"].map((s, i) => [i, t(s)]))
    + select("terrain", [5, 2, 1, 0, -2, -5, -10].map((n, i) => [n, `${t(`Terrain${i}`)} (${n > 0 ? "+" : ""}${n})`]))
    + number("hours", 4, 0, 12) + number("carried", 0) + number("hunters", 1, 1)
    + number("animal", 0, 0, 5) + check("separate") + check("species") + check("butcher");
  if (kind === "repair") return select("material", [["hardMaterials", game.i18n.localize("TRUDVANG.Knowledge.hardMaterials")], ["softMaterials", game.i18n.localize("TRUDVANG.Knowledge.softMaterials")]].sort(([a]) => a === item.system.catalogId ? -1 : 0))
    + select("tools", [0, -3, -5, -7].map((n, i) => [n, `${t(`Tools${i}`)} (${n})`]));
  if (kind === "heal") return select("mode", ["first", "rest", "poultice", "save", "stabilize"].map(s => [s, t(s)])) + number("negative", 0);
  return `<div class="form-group"><label>${e(t("animalName"))}</label><input name="animalName" type="text" required></div>`
    + select("training", ["domesticate", ...Object.keys(TRAINING_FACTORS)].map(s => [s, t(s)]))
    + select("stage", [1, 2, 3, 4, 5].map(n => [n, t(`Stage${n}`)])) + number("completed", 0) + check("domestic");
}
function read(root) {
  return Object.fromEntries([...root.querySelectorAll("input[name],select[name]")].map(el => [el.name, el.type === "checkbox" ? el.checked : el.type === "number" ? Number(el.value) : el.value]));
}
function referenceTable(kind) {
  const table = (head, rows) => `<table><thead><tr>${head.map(h => `<th>${e(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${e(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  let content;
  if (kind === "hunt") content = table([t("Margin"), t("Small"), t("Medium"), t("Large")],
    HUNTING_FOOD.map((row, i) => [`${i * 4 + 1}–${i * 4 + 4}`, ...row.map(v => v ?? "—")]).concat([["+4", "+4", "+8", "+16"]]));
  else if (kind === "train") content = table([t("training"), ...[1, 2, 3, 4, 5].map(n => t(`Stage${n}`))],
    Object.entries(TRAINING_FACTORS).map(([id, factor]) => [t(id), ...[1, 2, 3, 4, 5].map(n => n * factor)]));
  else content = table([t("Level"), t(kind === "repair" ? "Integrity" : "Healing")],
    [1, 2, 3, 4, 5].map(n => [n, kind === "repair" ? n * 2 : n]));
  return `<details><summary>${e(t("Tables"))}</summary>${content}</details>`;
}
function prepare(actor, kind, v) {
  const id = kind === "hunt" ? "huntingFishing" : kind === "repair" ? v.material : kind === "heal" ? v.mode === "stabilize" ? "healingDrugs" : "firstAidNursing" : "animalFriend";
  const item = actor.findRuleKnowledge(id) ?? (kind === "hunt" ? actor.findRuleKnowledge("huntingExperience") : null);
  const level = Number(item?.system.level || 0);
  const skillKey = ["hunt", "train"].includes(kind) ? "wilderness" : "care";
  const breakdown = item ? actor.getAbilityBreakdown(item) : {base: actor.getSkillValue(skillKey), modifierRows: actor.skillRollModifierRows(skillKey), skillLabel: actor.skillValueLabel(skillKey)};
  const rows = [...breakdown.modifierRows];
  rows.push(...transformationRollRows(actor, {target: breakdown.base + rollModifierTotal(rows), skillKey}));
  if (kind === "hunt" && v.species) {
    const species = actor.findRuleKnowledge("speciesHunter");
    rows.push({label: game.i18n.localize("TRUDVANG.Knowledge.speciesHunter"), value: 2 * Number(species?.system.level || 0)});
  }
  const values = procedureValues(kind, v, {skill: actor.getSkillValue(skillKey), level});
  const learned = !["repair", "heal", "train"].includes(kind) || level > 0;
  const validTraining = kind !== "train" || (String(v.animalName || "").trim() && (v.training === "domesticate" || v.domestic));
  const validButcher = kind !== "hunt" || !v.butcher || Number(actor.findRuleKnowledge("carveButcher")?.system.level || 0) > 0;
  const validSpecies = kind !== "hunt" || !v.species || Number(actor.findRuleKnowledge("speciesHunter")?.system.level || 0) > 0;
  const target = Math.floor((breakdown.base + rollModifierTotal(rows) + values.modifier) / values.divisor) + Number(v.modifier || 0);
  return {valid: !values.invalid && Number.isFinite(target) && learned && validTraining && validButcher && validSpecies, item, breakdown, rows, values, target};
}
function breakdownHTML(p) {
  const rows = [...p.rows, ...(p.values.rows ?? []).map(row => ({label: t(row.field), value: row.value}))];
  return `${e(p.breakdown.skillLabel)}<br>${e(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target: p.breakdown.base}))}<br>${rollModifierFlavor(rows)}${p.values.divisor === 2 ? `<br>${e(t("Halved"))}` : ""}`;
}
export async function performKnowledgeProcedure(document) {
  const kind = PROCEDURES[document.system.catalogId];
  const actor = document.actor ?? (["character", "npc"].includes(document.parent?.type) ? document.parent : testActorForUser());
  if (!kind || !actor?.isOwner) return ui.notifications.warn(t("ChooseActor"));
  if (!actor.canPerformAction()) return actor.warnCannotAct();
  const Dialog = foundry.applications.api.DialogV2;
  class ProcedureDialog extends Dialog {
    _onRender(context, options) {
      super._onRender(context, options);
      const refresh = () => {
        const v = read(this.element), p = prepare(actor, kind, v);
        this.element.querySelector("[data-procedure-target]").textContent = Number.isFinite(p.target) ? p.target : "—";
        this.element.querySelector("[data-procedure-breakdown]").innerHTML = breakdownHTML(p);
        this.element.querySelector("[data-procedure-warning]").hidden = p.valid;
        const button = this.element.querySelector('[data-action="roll"]');
        if (button) button.disabled = !p.valid;
        const negative = this.element.querySelector('[name="negative"]');
        if (negative) negative.closest(".form-group").hidden = v.mode !== "save";
      };
      this.element.addEventListener("input", refresh);
      this.element.addEventListener("change", refresh);
      refresh();
    }
  }
  const choice = await ProcedureDialog.wait({window: {title: `${actor.name} — ${t(kind)}`}, position: {width: 560},
    content: `<div class="trudvang roll-dialog knowledge-procedure-dialog">${fields(kind, document)}${referenceTable(kind)}<aside class="rule-test-notes"><p>${e(t(`${kind}Notes`))}</p></aside><p data-procedure-breakdown></p>${number("modifier", 0, -999, 999)}<p>${e(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-procedure-target></strong></p><p data-procedure-warning>${e(t("Invalid"))}</p></div>`,
    buttons: [{action: "roll", label: game.i18n.localize("TRUDVANG.Action.Roll"), icon: "fas fa-dice-d20", default: true,
      callback: (event, button, dialog) => {const v = read(button.form ?? dialog.element); return prepare(actor, kind, v).valid ? v : false;}},
    {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}], rejectClose: false});
  if (!choice) return null;
  const p = prepare(actor, kind, choice);
  if (!p.valid) return null;
  return rollUnder({actor, label: t(kind), target: p.target, kind: "skill", item: p.item,
    flavor: `${breakdownHTML(p)}<br>${e(t("modifier"))}: ${choice.modifier}<br>${e(t(`${kind}Notes`))}`,
    resolveProcedure: async outcome => {
      const result = procedureOutcome(kind, choice, p.values, outcome);
      const rolls = [];
      if (result.formula) {const roll = await new Roll(result.formula).evaluate(); rolls.push(roll); result.amount = Number(roll.total);}
      if (result.butcher) result.amount = Math.floor(result.amount * 1.1);
      return {text: game.i18n.format(key(result.key), {...result, animal: choice.animalName || ""}), rolls};
    }});
}
