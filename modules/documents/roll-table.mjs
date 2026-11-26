import { isNpcRoll, createActorRollMessage, publishNpcRollDetails, renderRollCard } from "../chat-roll-privacy.mjs";
import { escapeHtml } from "../helpers.mjs";
import { TRUDVANG } from "../config.mjs";
import { promptExtractStageRoll, stageFor, stageLabelFor, traitValue } from "../extract-roll.mjs";
import { fatalTableId, fatalRollFormula, fatalTotalInRange } from "../rules/fatal-table.mjs";
import { DIVINE_FAILURE_ROWS } from "../rules/divine-failure.mjs";
import { FATAL_MAGIC_ROWS, fatalMagicHasArea } from "../rules/fatal-magic.mjs";
import { fatalAreaOrigin } from "../fatal-vitner-area.mjs";
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
    if (displayChat && this.fatalTableId) {
      const controlled = globalThis.canvas?.tokens?.controlled ?? [];
      const actor = controlled.length === 1 ? controlled[0].actor : null;
      const selected = options.results?.length === 1 ? options.results[0] : null;
      const [first, last] = selected?.range ?? [];
      const forced = this.fatalTableId === "fatal-magic-effects" && game.user?.isGM
        && Number.isInteger(first) && !fatalTotalInRange(options.roll?.total, first, last);
      let cost;
      if (forced) {
        // Preserve the explicitly selected row without rolling a different one.
        options.roll = await new Roll(String(first)).evaluate();
      } else if (!options.roll) {
        const choices = await this.#getRollChoices();
        if (!choices) return {roll: {total: NaN}, results: []};
        options.roll = new Roll(fatalRollFormula(choices.threshold, choices.modifier));
        cost = choices.cost;
      }
      const draw = await super.draw({displayChat: false, ...options});
      if (draw.results.length) await this.postFatalResult(draw, {actor, cost, forced, messageMode: options.messageMode});
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
    const view = {
      actorName: actor.name,
      tableName,
      die: Number(dieRoll.total),
      strength,
      traitName: game.i18n.localize(TRUDVANG.traits[choice.traitKey]),
      traitModifier: modifier,
      result,
      stageLabel: stageLabelFor(stage)
    };
    const message = displayChat
      ? await createActorRollMessage(actor,{speaker:ChatMessage.getSpeaker({actor}),content:await renderRollCard("extract-stage-card",view),rolls:[dieRoll]},
        {resultContent:isNpcRoll(actor)?await renderRollCard("extract-stage-card",view,{resultOnly:true}):undefined})
      : null;
    return {roll: dieRoll, results: [], message};
  }

  async postFatalResult(draw, {actor, power, cost, forced, messageMode} = {}) {
    const divine = this.fatalTableId === "fatal-failure-effects";
    const row = draw.results[0]?.range?.[0];
    const fixedResult = !divine && game.user?.isGM && (forced || (draw.roll?.isDeterministic
      && fatalTotalInRange(draw.roll.total, row, draw.results[0]?.range?.[1])));
    const messageData = actor ? {speaker: ChatMessage.getSpeaker({actor})} : {};
    if (actor?.uuid && (divine ? DIVINE_FAILURE_ROWS[row] : FATAL_MAGIC_ROWS[row])) {
      const flag = divine ? "divineFailureResult" : "fatalMagicResult";
      const rule = FATAL_MAGIC_ROWS[row];
      const origin = !divine && (fatalMagicHasArea(rule) || rule?.enclosure || rule?.portal)
        ? {tokenUuid: fatalAreaOrigin(actor, messageData.speaker)} : {};
      messageData.flags = {"trudvang-chronicles": {[flag]: {
        actorUuid: actor.uuid, row, ...origin, ...(divine ? {power: power ?? null} : {}),
        ...(!divine && Number.isInteger(cost) ? {cost} : {}),
        ...(fixedResult ? {forced: true} : {})
      }}};
    }
    const results = divine ? draw.results : draw.results.map(result => {
      const row = result.range?.[0];
      return [45, 47, 50].includes(row) && result.clone
        ? result.clone({text: game.i18n.localize(`TRUDVANG.Content.Table.FatalMagic.E${row}`)}, {keepId: true})
        : result;
    });
    let roll = fixedResult ? undefined : draw.roll;
    if (roll && isNpcRoll(actor)) {
      const content = await roll.render();
      const detail = await publishNpcRollDetails({speaker:messageData.speaker,content,rolls:[roll]});
      messageData.flags ??= {};
      (messageData.flags["trudvang-chronicles"] ??= {}).npcRoll = {detailId:detail?.id};
      messageData.flags["dice-so-nice"] = {skip:true};
      roll = undefined;
    }
    return this.toMessage(results, {roll, messageData, messageOptions: {messageMode}});
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
            const cost = Math.max(0, Math.trunc(Number(root.querySelector('[name="cost"]')?.value) || 0));
            return {
              threshold: Number(root.querySelector('[name="threshold"]')?.value || threshold),
              cost,
              modifier: actorModifier + cost
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
