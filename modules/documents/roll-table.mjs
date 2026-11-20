import { escapeHtml, renderTemplate } from "../helpers.mjs";
import { TRUDVANG } from "../config.mjs";
import { promptExtractStageRoll, stageFor, stageLabelFor, traitValue } from "../extract-roll.mjs";
import { fatalTableId, fatalRollFormula } from "../rules/fatal-table.mjs";
import { DIVINE_FAILURE_ROWS } from "../rules/divine-failure.mjs";
import { nameTableMeta, rollNameTable } from "../name-tables.mjs";

const EXTRACT_STAGE_IDS = new Map([
  ["extract-stage", "extract-stage"],
  ["TRUDVANG.Content.Table.ExtractStage", "extract-stage"]
]);

function extractStageTableId(table) {
  const starterId = table.getFlag("trudvang-chronicles", "starterId");
  const tableKey = table.getFlag("trudvang-chronicles", "tableKey");
  return EXTRACT_STAGE_IDS.get(starterId) ?? EXTRACT_STAGE_IDS.get(tableKey) ?? null;
}

/** Special handling is confined to the supplied fatal-effect tables, the extract-stage table and the name tables. */
export class TrudvangRollTable extends foundry.documents.RollTable {
  get fatalTableId() {
    return fatalTableId(this);
  }

  async roll(options = {}) {
    if (extractStageTableId(this)) return super.roll(options);
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

  async draw({displayChat = true, ...options} = {}) {
    // Name tables assemble a prefix and a suffix instead of drawing one result.
    if (nameTableMeta(this).isNameTable) return rollNameTable(this, {displayChat});
    if (displayChat && this.fatalTableId === "fatal-failure-effects") {
      const controlled = globalThis.canvas?.tokens?.controlled ?? [];
      const actor = controlled.length === 1 ? controlled[0].actor : null;
      const draw = await super.draw({displayChat: false, ...options});
      if (draw.results.length) await this.postFatalResult(draw, {actor, messageMode: options.messageMode});
      return draw;
    }
    if (!extractStageTableId(this)) return super.draw({displayChat, ...options});
    const actor = Array.from(canvas.tokens?.controlled || []).map(token => token.actor).find(Boolean);
    if (!actor) {
      ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoControlledActor"));
      return {roll: {total: NaN}, results: []};
    }
    const title = game.i18n.has?.("TRUDVANG.Extract.StageTitle")
      ? game.i18n.localize("TRUDVANG.Extract.StageTitle")
      : this.name;
    const choice = await promptExtractStageRoll({actor, strength: 0, strengthEditable: true, title});
    // The core table sheet reads roll.total even after a cancelled draw.
    if (!choice) return {roll: {total: NaN}, results: []};
    const dieRoll = await new Roll("1d20").evaluate();
    const strength = Number(choice.strength || 0);
    const modifier = traitValue(actor, choice.traitKey);
    const result = Number(dieRoll.total) + strength - modifier;
    const stage = stageFor(result);
    const tableName = game.i18n.has?.("TRUDVANG.Content.Table.ExtractStage.Name")
      ? game.i18n.localize("TRUDVANG.Content.Table.ExtractStage.Name")
      : this.name;
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/extract-stage-card.hbs", {
      actorName: actor.name,
      tableName,
      die: Number(dieRoll.total),
      strength,
      traitName: game.i18n.localize(TRUDVANG.traits[choice.traitKey]),
      traitModifier: modifier,
      result,
      stageLabel: stageLabelFor(stage)
    });
    const message = displayChat
      ? await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content, rolls: [dieRoll]})
      : null;
    return {roll: dieRoll, results: [], message};
  }

  async postFatalResult(draw, {actor, power, messageMode} = {}) {
    const row = this.fatalTableId === "fatal-failure-effects" ? draw.results[0]?.range?.[0] : null;
    const messageData = actor ? {speaker: ChatMessage.getSpeaker({actor})} : {};
    if (actor?.uuid && DIVINE_FAILURE_ROWS[row]) {
      messageData.flags = {"trudvang-chronicles": {divineFailureResult: {
        actorUuid: actor.uuid, row, power: power ?? null
      }}};
    }
    return this.toMessage(draw.results, {roll: draw.roll, messageData, messageOptions: {messageMode}});
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

const EXTRACT_STAGE_ICON_CLASS = "trudvang-extract-stage-icon";

/**
 * Show a flask icon instead of the d20 thumbnail on the extract-stage
 * RollTable directory row, so players recognise the potion table. Only
 * that table is touched: the row is located by document id resolved from
 * the starterId/tableKey flags, never by localized display name. The hook
 * re-fires on every directory render; patched rows carry a marker class
 * and are skipped, and the handler exits fast when the table is absent
 * (fresh world pre-install). Roll and dialog flows are untouched.
 */
export function registerExtractStageDirectoryIcon() {
  Hooks.on("renderRollTableDirectory", (app, html) => {
    const root = html instanceof HTMLElement ? html
      : html?.[0] instanceof HTMLElement ? html[0]
      : app?.element instanceof HTMLElement ? app.element
      : app?.element?.[0] instanceof HTMLElement ? app.element[0]
      : null;
    if (!root?.querySelectorAll) return;
    const target = game.tables?.find(table => extractStageTableId(table));
    if (!target) return;
    const row = Array.from(root.querySelectorAll("li[data-document-id], li[data-entry-id]"))
      .find(entry => (entry.dataset?.documentId ?? entry.dataset?.entryId) === target.id);
    if (!row) return;
    if (row.querySelector(`i.${EXTRACT_STAGE_ICON_CLASS}`)) return;
    const thumbnail = row.querySelector("img");
    if (!thumbnail) return;
    const icon = document.createElement("i");
    icon.className = `fas fa-flask ${EXTRACT_STAGE_ICON_CLASS}`;
    icon.setAttribute("aria-hidden", "true");
    thumbnail.replaceWith(icon);
  });
}
