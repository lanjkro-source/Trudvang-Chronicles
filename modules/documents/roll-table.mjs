import { escapeHtml } from "../helpers.mjs";
import { fatalTableId, fatalRollFormula } from "../rules/fatal-table.mjs";

/** Special handling is confined to the two supplied fatal-effect tables. */
export class TrudvangRollTable extends foundry.documents.RollTable {
  get fatalTableId() {
    return fatalTableId(this);
  }

  async roll(options = {}) {
    if (!this.fatalTableId) return super.roll(options);
    let {roll} = options;
    if (!roll) {
      const choices = await this.#getRollChoices();
      // The core table sheet reads roll.total even after a cancelled draw.
      if (!choices) return {roll: {total: NaN}, results: []};
      roll = new Roll(fatalRollFormula(choices.threshold, choices.modifier));
    }
    if (!roll._evaluated) await roll.evaluate();
    return {roll, results: this.getResultsForRoll(roll.total)};
  }

  getResultsForRoll(value) {
    if (!this.fatalTableId) return super.getResultsForRoll(value);
    if (!Number.isFinite(Number(value))) return [];
    // A mitigated total <= 0 is harmless; very high open rolls use the last row.
    const upperBound = Math.max(...this.results.map(result => result.range[1]));
    return super.getResultsForRoll(Math.max(1, Math.min(upperBound, Number(value))));
  }

  async #getRollChoices() {
    const controlled = canvas?.tokens?.controlled ?? [];
    const actor = controlled.length === 1 ? controlled[0].actor : null;
    const divine = this.fatalTableId === "fatal-failure-effects";
    const threshold = divine ? 9 : (actor?.selectedVitnerType?.fatalThreshold ?? 9);
    const actorModifier = actor?.fatalEffectModifier?.(divine ? "faith" : "vitner", 0) ?? 0;
    const label = key => escapeHtml(game.i18n.localize(`TRUDVANG.Dialog.${key}`));
    const actorName = actor?.name
      ? game.i18n.format("TRUDVANG.Dialog.FatalActor", {actor: actor.name})
      : game.i18n.localize("TRUDVANG.Dialog.FatalNoActor");
    const content = `<div class="trudvang roll-dialog">
      <p>${escapeHtml(actorName)}</p>
      <div class="form-group"><label>${label("FatalJO")}</label><select name="threshold">
        ${[8, 9, 10].map(jo => `<option value="${jo}" ${jo === threshold ? "selected" : ""}>JO ${jo}</option>`).join("")}
      </select></div>
      <div class="form-group"><label>${label("FatalCost")}</label><input name="cost" type="number" min="0" value="0"></div>
      <div class="form-group"><label>${label("FatalSituational")}</label><input name="situational" type="number" value="0"></div>
      ${actor ? `<p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.FatalActorModifier", {modifier: actorModifier}))}</p>` : ""}
    </div>`;
    return foundry.applications.api.DialogV2.wait({
      window: {title: this.name}, content,
      buttons: [
        {action: "roll", icon: "fas fa-dice-d10", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true,
          callback: (event, button, dialog) => {
            const root = button.form ?? dialog.element;
            return {
              threshold: Number(root.querySelector('[name="threshold"]')?.value || threshold),
              modifier: actorModifier + Number(root.querySelector('[name="cost"]')?.value || 0)
                + Number(root.querySelector('[name="situational"]')?.value || 0)
            };
          }},
        {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
      ], modal: false, rejectClose: false
    });
  }
}
