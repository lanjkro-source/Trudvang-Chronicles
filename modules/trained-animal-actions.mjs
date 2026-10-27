import {escapeHtml} from "./helpers.mjs";
import {rollUnder} from "./dice.mjs";
import {testActorForUser} from "./rule-tests.mjs";
import {trainedAnimalActions, trainedAnimalValue, specialtySourceId} from "./rules/trained-animal-actions.mjs";

const t = key => game.i18n.localize(`TRUDVANG.AnimalAction.${key}`);
export async function performTrainedAnimalAction(document, action) {
  if (!trainedAnimalActions(document).includes(action)) return null;
  const actor = document.actor ?? (["character", "npc"].includes(document.parent?.type) ? document.parent : testActorForUser());
  if (!actor?.isOwner) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Procedure.ChooseActor"));
  if (!actor.canPerformAction()) return actor.warnCannotAct();
  if (action === "jump") {
    const item = actor.findRuleKnowledge(document.system.catalogId) ?? actor.findRuleKnowledge(specialtySourceId(document))
      ?? {name: document.name, type: "ability", system: {...document.system, level: 0, freeLevels: 0}};
    return actor.rollAbility(item, {label: t(action), mountTraining: true});
  }
  const label = t(action), e = escapeHtml;
  class AnimalActionDialog extends foundry.applications.api.DialogV2 {
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      const refresh = () => {
        const base = trainedAnimalValue(action, root.querySelector('[name="degree"]').value);
        root.querySelector("[data-animal-base]").textContent = base;
        root.querySelector("[data-animal-final]").textContent = base + Number(root.querySelector('[name="modifier"]').value || 0);
      };
      root.addEventListener("input", refresh); root.addEventListener("change", refresh); refresh();
    }
  }
  const choice = await AnimalActionDialog.wait({window: {title: label}, classes: ["dialog", "trudvang"],
    content: `<div class="roll-dialog"><div class="form-group"><label>${e(t("Degree"))}</label><select name="degree">${[1, 2, 3, 4, 5].map(degree => `<option value="${degree}">${e(game.i18n.localize(`TRUDVANG.Procedure.Stage${degree}`))} — ${trainedAnimalValue(action, degree)}</option>`).join("")}</select></div><p>${e(t("AnimalValue"))} : <strong data-animal-base>${trainedAnimalValue(action, 1)}</strong></p><p class="hint">${e(t("AnimalRollHint"))}</p><div class="form-group"><label>${e(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div><p>${e(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))} : <strong data-animal-final>${trainedAnimalValue(action, 1)}</strong></p></div>`,
    buttons: [{action: "roll", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true, callback: (event, button, dialog) => {
      const root = button.form ?? dialog.element;
      const degree = Number(root.querySelector('[name="degree"]').value), modifier = Number(root.querySelector('[name="modifier"]').value || 0);
      return trainedAnimalValue(action, degree) !== null && Number.isFinite(modifier) ? {degree, modifier} : false;
    }}, {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}], rejectClose: false, modal: false});
  if (!choice || trainedAnimalValue(action, choice.degree) === null || !Number.isFinite(choice.modifier)) return null;
  return rollUnder({actor, label, kind: "skill", item: document, target: trainedAnimalValue(action, choice.degree), modifier: choice.modifier,
    flavor: e(game.i18n.format("TRUDVANG.AnimalAction.TrainingValue", {degree: game.i18n.localize(`TRUDVANG.Procedure.Stage${choice.degree}`), target: trainedAnimalValue(action, choice.degree)}))});
}
