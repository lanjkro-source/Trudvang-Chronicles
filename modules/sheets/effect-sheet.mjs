import {annotateRuleTestDescription, performRuleTest} from "../rule-tests.mjs";
import {bindTitleSharing, bindSheetListMenus} from "../chat-sharing.mjs";
import {effectChangePhase} from "../rules/effect-contributions.mjs";
import {effectChangesSource} from "../rules/effect-source.mjs";
import {isGradedEffect, isGradedState, effectDegree} from "../rules/effect-stacking.mjs";
import {normalizeEffectDuration, normalizeEffectStage} from "../rules/effect-duration.mjs";
import {EFFECT_RULE_KEYS,EFFECT_RULE_PREFIX,changesFromRules,hasProfileChanges,validProfileChange} from "../rules/effect-rule-changes.mjs";

const ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;
const DURATION_UNITS = ["rounds", "turns", "seconds", "minutes", "hours", "days", "weeks", "months", "years"];

export class TrudvangEffectSheet extends ActiveEffectConfig {
  get isEditable() {
    const pack = this.document?.pack;
    if (pack && game.packs?.get(pack)?.locked) return false;
    return this.document?.canUserModify?.(game.user, "update") ?? super.isEditable;
  }

  get isVisible() {
    return this.isEditable || super.isVisible;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Use the same permission for the core header/footer and all custom tabs.
    context.editable = context.isEditable = this.isEditable;
    return context;
  }

  static DEFAULT_OPTIONS = {
    classes: ["trudvang", "effect-sheet"],
    position: {width: 620, height: 720},
    window: {title: "TRUDVANG.Sheets.Effect"},
    actions: {
      addTrudvangStage: TrudvangEffectSheet.onAddStage,
      deleteTrudvangStage: TrudvangEffectSheet.onDeleteStage,
      addChange: TrudvangEffectSheet.onAddChange,
      deleteChange: TrudvangEffectSheet.onDeleteChange,
      saveDescription: TrudvangEffectSheet.onSaveDescription,
      "roll-rule-test": TrudvangEffectSheet.onRollRuleTest
    }
  };

  static PARTS = {
    header: super.PARTS.header,
    tabs: super.PARTS.tabs,
    details: {template: "systems/trudvang-chronicles/templates/effect/details.hbs", scrollable: [""]},
    durationChanges: {template: "systems/trudvang-chronicles/templates/effect/duration-changes.hbs", scrollable: [""]},
    trudvang: {template: "systems/trudvang-chronicles/templates/effect/effect-rules.hbs", scrollable: [""]},
    footer: super.PARTS.footer
  };

  static TABS = {
    sheet: {
      tabs: [
        {id: "details", icon: "fa-solid fa-align-left", label: "EFFECT.TABS.Details"},
        {id: "durationChanges", icon: "fa-solid fa-hourglass-half", label: "TRUDVANG.Effect.TabDurationChanges"},
        {id: "trudvang", icon: "fa-solid fa-layer-group", label: "TRUDVANG.Effect.RulesTab"}
      ],
      initial: "details"
    }
  };

  async _onRender(context, options) {
    await super._onRender(context, options);
    bindTitleSharing(this);
    bindSheetListMenus(this);
  }

  // Core ActiveEffectConfig._onChangeForm still targets its original
  // changes/duration tabs, which this sheet replaced with the combined
  // durationChanges part (see PARTS/TABS above). Ignore only that DOM
  // mismatch so editing/saving never throws; anything else still throws.
  // The try/catch wraps only the super call so errors from our own future
  // code are never swallowed, and the submit path (_processFormData) is untouched.
  async _onChangeForm(...args) {
    try {
      return await super._onChangeForm(...args);
    } catch (error) {
      if (error instanceof TypeError) return undefined;
      throw error;
    }
  }

  async _preparePartContext(partId, context) {
    const partContext = await super._preparePartContext(partId, context);
    partContext.editable = partContext.isEditable = this.isEditable;

    if (partId === "details") {
      partContext.tab = partContext.tabs.details;
      partContext.documentUuid = this.document.uuid ?? "";
      partContext.description = this.document._source?.description ?? this.document.description ?? "";
      partContext.enrichedDescription = annotateRuleTestDescription(await TextEditorImpl.enrichHTML(
        this.document.description || "",
        {async: true, secrets: this.document.isOwner}
      ), this.document);
      partContext.origin = this.document.origin || "";
      const selected = new Set(this.document.statuses ?? this.document._source?.statuses ?? []);
      const choices = new Map(Object.entries(CONFIG.statusEffects ?? {}).map(([key, status]) => {
        const id = status.id ?? key;
        return [id, {id, label: game.i18n.localize(status.name ?? status.label ?? id), selected: selected.has(id)}];
      }));
      // Keep module/custom IDs even if their original definition is unavailable.
      for (const id of selected) if (!choices.has(id)) choices.set(id, {id, label: id, selected: true});
      partContext.statusChoices = [...choices.values()].sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
      return partContext;
    }

    if (partId === "durationChanges") {
      partContext.tab = partContext.tabs.durationChanges;
      const item = this.document.item ?? (this.document.parent?.documentName === "Item" ? this.document.parent : null);
      partContext.itemActivationEditable = ["weapon", "armor", "shield", "gear"].includes(item?.type);
      partContext.itemActivation = this.document.transfer ? this.document.system?.activation || "equipped" : "manual";
      partContext.itemActivationChoices = Object.fromEntries(["manual", "equipped", "inventory"].map(key => [key, game.i18n.localize(`TRUDVANG.Effect.Activation.${key}`)]));
      partContext.stacking = this.document.system?.stacking || "refresh";
      partContext.reapplicationChoices = {refresh: game.i18n.localize("TRUDVANG.Effect.Refresh"), stack: game.i18n.localize("TRUDVANG.Effect.Stack")};
      if (["replace", "highest"].includes(partContext.stacking)) partContext.reapplicationChoices[partContext.stacking] = game.i18n.localize(`TRUDVANG.Effect.${partContext.stacking === "replace" ? "Replace" : "Highest"}`);
      partContext.graded = isGradedEffect(this.document);
      partContext.degree = effectDegree(this.document);
      partContext.degreeHint = game.i18n.localize(`TRUDVANG.Effect.${isGradedState(this.document) ? "DegreeHint" : "CumulativeDegreeHint"}`);
      const dur = this.document.duration || {};
      // V14 prepares a null duration value as Infinity; read the unprepared
      // source value instead and fall back to 0 when non-finite so the number
      // input never renders value="Infinity". Units/expiry stay prepared.
      const rawSourceValue = Number(this.document._source?.duration?.value ?? 0);
      partContext.duration = {
        value: Number.isFinite(rawSourceValue) ? rawSourceValue : 0,
        units: dur.units ?? "rounds",
        expiry: dur.expiry ?? ""
      };
      partContext.durationUnits = DURATION_UNITS.reduce((choices, unit) => {
        choices[unit] = game.i18n.localize(`EFFECT.DURATION.UNITS.${unit}`);
        return choices;
      }, {});
      partContext.showRoundHint = dur.units === "rounds";
      partContext.showExpiry = ["rounds", "turns"].includes(dur.units);
      partContext.expiryChoices = {
        "": game.i18n.localize("TRUDVANG.Effect.ExpiryNone"),
        turnStart: game.i18n.localize("TRUDVANG.Effect.TurnStart"),
        turnEnd: game.i18n.localize("TRUDVANG.Effect.TurnEnd")
      };
      const changes=effectChangesSource(this.document.system?.changes || []);
      const legacy=this.document.flags?.["trudvang-chronicles"]?.transformation;
      if(legacy?.rules&&!legacy.editableChanges&&!hasProfileChanges(this.document)){
        const rules={...legacy.rules};if(rules.traitsApplied)delete rules.traits;
        changes.push(...changesFromRules(rules));
      }
      partContext.changes = changes.map(c => ({
        key: c.key ?? "",
        type: c.type ?? "add",
        value: String(c.value ?? ""),
        priority: c.priority != null ? Number(c.priority) : null,
        phase: effectChangePhase(c),
        hint: c.key?.startsWith(EFFECT_RULE_PREFIX)?game.i18n.localize(`TRUDVANG.Effect.Profile.${c.key.slice(EFFECT_RULE_PREFIX.length)}`):c.key
      }));
      partContext.changeTypes = {
        custom: game.i18n.localize("TRUDVANG.Effect.ChangeTypeCustom"),
        add: game.i18n.localize("TRUDVANG.Effect.ChangeTypeAdd"),
        subtract: game.i18n.localize("TRUDVANG.Effect.ChangeTypeSubtract"),
        multiply: game.i18n.localize("TRUDVANG.Effect.ChangeTypeMultiply"),
        downgrade: game.i18n.localize("TRUDVANG.Effect.ChangeTypeDowngrade"),
        upgrade: game.i18n.localize("TRUDVANG.Effect.ChangeTypeUpgrade"),
        override: game.i18n.localize("TRUDVANG.Effect.ChangeTypeOverride")
      };
      partContext.supportedPaths = [
        "system.effective.traits.charisma", "system.effective.traits.constitution",
        "system.effective.traits.dexterity", "system.effective.traits.intelligence",
        "system.effective.traits.perception", "system.effective.traits.psyche",
        "system.effective.traits.strength",
        "system.effective.skills.agility", "system.effective.skills.care",
        "system.effective.skills.entertainment", "system.effective.skills.faith",
        "system.effective.skills.fighting", "system.effective.skills.knowledge",
        "system.effective.skills.shadowArts", "system.effective.skills.vitnerCraft",
        "system.effective.skills.wilderness",
        "system.modifiers.rolls.allActions", "system.modifiers.rolls.combatActions",
        "system.modifiers.rolls.movementActions", "system.modifiers.rolls.attack",
        "system.modifiers.rolls.parry", "system.modifiers.rolls.magic", "system.modifiers.rolls.initiative",
        "system.resources.body.temporaryMax", "system.resources.body.max", ...["melee","ranged","throwing","natural"].map(usage=>`system.modifiers.damageByUsage.${usage}`),
        "system.modifiers.movement", "system.modifiers.protection", "system.modifiers.recovery", "system.modifiers.damage", "system.modifiers.fearFactor",
        "system.modifiers.bodyMax", "system.modifiers.combatMax",
        "system.modifiers.vitnerMax", "system.modifiers.divinityMax",
        "system.modifiers.bodyValue", "system.modifiers.combatValue",
        "system.modifiers.vitnerValue", "system.modifiers.divinityValue",
        "system.modifiers.raudValue", "system.modifiers.fearValue"
      ];
      partContext.supportedPaths.push(...EFFECT_RULE_KEYS.map(key=>EFFECT_RULE_PREFIX+key));
      partContext.profilePaths=EFFECT_RULE_KEYS.map(key=>({path:EFFECT_RULE_PREFIX+key,label:game.i18n.localize(`TRUDVANG.Effect.Profile.${key}`)}));
      return partContext;
    }

    if (partId === "trudvang") {
      partContext.tab = partContext.tabs.trudvang;
      partContext.durationUnits = DURATION_UNITS.reduce((choices, unit) => {
        choices[unit] = game.i18n.localize(`EFFECT.DURATION.UNITS.${unit}`);
        return choices;
      }, {});
      partContext.trudvang = this.document.system;
      partContext.stages = Array.from(this.document.system.stages || []).map((stage, index) => ({
        index,
        number: index + 1,
        label: stage.label,
        durationValue: stage.durationValue,
        durationUnit: stage.durationUnit,
        changesJson: JSON.stringify(effectChangesSource(stage.changes), null, 2)
      }));
      return partContext;
    }

    return partContext;
  }

  _processFormData(event, form, formData) {
    const raw = foundry.utils.expandObject(foundry.utils.deepClone(formData.object || {}));
    const submitData = super._processFormData(event, form, formData);

    // This sheet stores changes at system.changes; a top-level `changes` key
    // can only come from the core ActiveEffectConfig path, which must never
    // clobber or duplicate our namespaced storage on save.
    delete submitData.changes;
    const item = this.document.item ?? (this.document.parent?.documentName === "Item" ? this.document.parent : null);
    const activation = raw.trudvang?.itemActivation;
    if (["weapon", "armor", "shield", "gear"].includes(item?.type) && ["manual", "equipped", "inventory"].includes(activation)) {
      submitData.transfer = activation !== "manual";
      submitData.system ??= {};
      submitData.system.activation = activation === "inventory" ? "inventory" : "equipped";
    }
    const legacy=this.document.flags?.["trudvang-chronicles"]?.transformation;
    if(legacy?.rules&&!legacy.editableChanges&&raw.system?.changes!==undefined){
      submitData.flags ??= {};submitData.flags["trudvang-chronicles"] ??= {};
      submitData.flags["trudvang-chronicles"].transformation={editableChanges:true,
        "-=rules":null,"-=temporaryHP":null,"-=stoneIntegrity":null,
        temporaryHPSpent:Math.max(0,Number(legacy.rules.temporaryHP??0)-Number(legacy.temporaryHP??legacy.rules.temporaryHP??0)),
        stoneIntegritySpent:Math.max(0,Number(legacy.rules.statueIntegrity??0)-Number(legacy.stoneIntegrity??legacy.rules.statueIntegrity??0))};
    }
    if (Object.hasOwn(raw, "statuses")) {
      const statuses = raw.statuses instanceof Set ? [...raw.statuses]
        : Array.isArray(raw.statuses) ? raw.statuses : raw.statuses ? [raw.statuses] : [];
      submitData.statuses = [...new Set(statuses)];
    }

    // Process Trudvang stages (JSON textareas in Trudvang tab)
    if (foundry.utils.isPlainObject(submitData.system?.stages)) {
      submitData.system.stages = Object.values(submitData.system.stages);
    }
    const jsonByStage = raw.trudvang?.stageChanges || {};
    for (const [index, stage] of (submitData.system?.stages || []).entries()) {
      try {
        stage.changes = JSON.parse(jsonByStage[index] || "[]");
      } catch (error) {
        ui.notifications.error(game.i18n.format("TRUDVANG.Warning.InvalidStageChanges", {stage: index + 1}));
        stage.changes = foundry.utils.deepClone(this.document._source.system.stages[index]?.changes || []);
      }
    }

    // Ensure changes is always an array (from duration-changes tab)
    if (foundry.utils.isPlainObject(submitData.system?.changes)) {
      submitData.system.changes = Object.values(submitData.system.changes);
    }
    // Filter out empty change rows and normalise priority
    if (Array.isArray(submitData.system?.changes)) {
      submitData.system.changes = TrudvangEffectSheet.#normalizeChangeRows(submitData.system.changes);
    }

    // Sync active stage when stages exist
    if (submitData.system?.stages?.length) {
      let stageIndex = Number(submitData.system.stage || 0);
      if (!Number.isInteger(stageIndex) || stageIndex < 0) {
        // A malformed stage (e.g. hand-edited form data) must never throw via
        // stages[NaN]; warn with the existing stage warning and fall back to
        // the first stage, mirroring the absent-field default.
        ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.InvalidStageChanges", {stage: String(submitData.system.stage ?? "?")}));
        stageIndex = 0;
      } else {
        stageIndex = Math.min(stageIndex, submitData.system.stages.length - 1);
      }
      submitData.system.stage = stageIndex;

      // Copy current changes into the active stage
      submitData.system.stages[stageIndex].changes = foundry.utils.deepClone(submitData.system.changes || []);

      // Sync duration from form into active stage
      const durValue = Number(submitData.duration?.value ?? 0);
      const durUnits = submitData.duration?.units ?? "rounds";
      submitData.system.stages[stageIndex].durationValue = durValue;
      submitData.system.stages[stageIndex].durationUnit = durUnits;

      // Ensure native duration is always up-to-date
      submitData.duration = {
        ...this.document._source.duration,
        value: durValue,
        units: durUnits,
        expiry: submitData.duration?.expiry || null,
        expired: false
      };
      submitData.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
    }

    // Normalise empty expiry to null
    if (submitData.duration && !submitData.duration.expiry) {
      submitData.duration.expiry = null;
      if (Number(submitData.duration.value) === 0 && !submitData.system?.stages?.length && !this.document.system?.stages?.length) submitData.duration.value = null;
    }

    delete submitData.trudvang;
    if (submitData.duration) submitData.duration = normalizeEffectDuration(submitData.duration);
    if (Array.isArray(submitData.system?.stages)) submitData.system.stages = submitData.system.stages.map(normalizeEffectStage);
    return submitData;
  }

  static async onRollRuleTest(event, target) {
    event.preventDefault();
    return performRuleTest({document: this.document, index: target.dataset.testIndex});
  }

  /* ------------------------------------------------------------------ */
  /*  Stage actions (Trudvang tab)                                       */
  /* ------------------------------------------------------------------ */

  // Silently persist the live form through the existing submit pipeline so
  // structural buttons (add/delete stage or change row) never discard
  // typed-but-unsaved content. Returns the nested submit payload which each
  // caller then extends with its structural change before a single update.
  // Resolve the live <form> without relying on ApplicationV2 internals (which
  // expose no sheet.form): the action target knows its form, otherwise fall
  // back to the sheet element. Only an element exposing .elements counts as
  // a form; anything else keeps the row buttons inert instead of throwing.
  static #sheetForm(sheet, target) {
    const fromTarget = target?.closest?.("form");
    if (fromTarget?.elements) return fromTarget;
    const fromElement = sheet.element?.querySelector?.("form") ?? sheet.element ?? null;
    return fromElement?.elements ? fromElement : null;
  }

  static #formDataCtor() {
    return foundry.applications?.ux?.FormDataExtended ?? foundry.utils?.FormDataExtended ?? null;
  }

  static async #silentSubmitData(sheet, target) {
    if (!sheet.isEditable) return null;
    const form = TrudvangEffectSheet.#sheetForm(sheet, target);
    const FormDataExtended = TrudvangEffectSheet.#formDataCtor();
    if (!form || !FormDataExtended) return null;
    const formData = new FormDataExtended(form);
    return sheet._processFormData(new Event("submit"), form, formData);
  }

  // Same row normalization as the save path (drop keyless rows, coerce
  // priority) so delete-by-DOM-index and save agree on row identity.
  static #normalizeChangeRows(rows) {
    for(const row of rows??[])if(row?.key&&!validProfileChange(row))throw new Error(game.i18n.format("TRUDVANG.Effect.InvalidProfileChange",{path:row.key}));
    return (Array.isArray(rows) ? rows : []).filter(c => c?.key)
      .map(c => ({...c, phase: effectChangePhase(c), priority: c.priority != null && c.priority !== "" ? Number(c.priority) : null}));
  }

  static async onAddStage(event, target) {
    const silent = await TrudvangEffectSheet.#silentSubmitData(this, target);
    if (!silent) return;
    silent.system ??= {};
    const stages = foundry.utils.deepClone(
      Array.isArray(silent.system.stages) ? silent.system.stages : (this.document._source.system.stages || [])
    );
    stages.push({label: "", durationValue: 1, durationUnit: "rounds", changes: []});
    silent.system.stages = stages;
    if (stages.length === 1) {
      silent.system.stage = 0;
      silent.system.changes = [];
      silent.duration = {value: 1, units: "rounds", expired: false};
      silent.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
    }
    await this.document.update(silent);
    return this.render({force: true});
  }

  static async onDeleteStage(event, target) {
    const silent = await TrudvangEffectSheet.#silentSubmitData(this, target);
    if (!silent) return;
    silent.system ??= {};
    const index = Number(target.closest("[data-stage-index]")?.dataset.stageIndex);
    const stages = foundry.utils.deepClone(
      Array.isArray(silent.system.stages) ? silent.system.stages : (this.document._source.system.stages || [])
    );
    if (!Number.isInteger(index) || index < 0 || index >= stages.length) return;
    let stageIndex = Number(this.document.system.stage || 0);
    stages.splice(index, 1);
    if (index < stageIndex) stageIndex -= 1;
    else if (index === stageIndex) stageIndex = Math.min(stageIndex, Math.max(0, stages.length - 1));
    const stage = stages[stageIndex];
    silent.system.stages = stages;
    silent.system.stage = stageIndex;
    silent.system.changes = foundry.utils.deepClone(stage?.changes || []);
    silent.duration = stage ? {
      value: Number(stage.durationValue || 0),
      units: stage.durationUnit || "rounds",
      expiry: null,
      expired: false
    } : {value: null, units: null, expiry: null, expired: false};
    silent.start = stage ? foundry.documents.ActiveEffect.implementation.getEffectStart() : null;
    await this.document.update(silent);
    return this.render({force: true});
  }

  /* ------------------------------------------------------------------ */
  /*  Change actions (Duration & Changes tab)                            */
  /* ------------------------------------------------------------------ */

  static async onAddChange(event, target) {
    const silent = await TrudvangEffectSheet.#silentSubmitData(this, target);
    if (!silent) return;
    silent.system ??= {};
    const changes = foundry.utils.deepClone(
      Array.isArray(silent.system.changes) ? silent.system.changes : (this.document._source.system?.changes || [])
    );
    changes.push({key: "", type: "add", value: "0", priority: null, phase: "final"});
    silent.system.changes = changes;
    await this.document.update(silent);
    return this.render({force: true});
  }

  static async onDeleteChange(event, target) {
    const form = TrudvangEffectSheet.#sheetForm(this, target);
    if (!form) return;
    const index = Number(target.closest("[data-change-index]")?.dataset.changeIndex);
    // Raw DOM-order rows (blank rows included) so the clicked index always
    // matches; the save-path filter below drops keyless rows afterwards.
    const FormDataExtended = TrudvangEffectSheet.#formDataCtor();
    if (!FormDataExtended) return;
    const rawRows = Object.values(
      foundry.utils.expandObject(new FormDataExtended(form).object ?? {}).system?.changes ?? {});
    if (!Number.isInteger(index) || index < 0 || index >= rawRows.length) return;
    rawRows.splice(index, 1);
    const silent = await TrudvangEffectSheet.#silentSubmitData(this, target);
    if (!silent) return;
    silent.system ??= {};
    silent.system.changes = TrudvangEffectSheet.#normalizeChangeRows(rawRows);
    await this.document.update(silent);
    return this.render({force: true});
  }

  // Mirror the core menu save button (element.save() persists the edited text
  // to the form and collapses a toggled editor); the footer submit still
  // writes to the document, exactly as with the core button.
  static async onSaveDescription() {
    if (!this.isEditable) return null;
    try {
      const editor = this.element?.querySelector?.('prose-mirror[name="description"]');
      if (!editor) {
        console.warn("Trudvang Chronicles | Save description: no prose-mirror element found.");
        return null;
      }
      if (typeof editor.save !== "function") {
        console.warn("Trudvang Chronicles | Save description: editor element has no save() (not upgraded?).");
        return null;
      }
      await editor.save();
      // element.save() only syncs to the form field: persist to the document
      // as well (without closing the sheet, unlike the footer submit), so the
      // text survives more than the editor session.
      const value = typeof editor.value === "string" ? editor.value : null;
      const stored = this.document?._source?.description ?? "";
      if (value !== null && value !== stored) await this.document.update({description: value});
    } catch (error) {
      console.warn("Trudvang Chronicles | Save description failed:", error);
    }
    return null;
  }
}
