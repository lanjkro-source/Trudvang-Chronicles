import {creatureAbilityDetails, isCreatureAbility} from "../creature-ability.mjs";
import {annotateRuleTestDescription, performRuleTest} from "../rule-tests.mjs";
import {bindTitleSharing} from "../chat-sharing.mjs";
import {useCreatureAbility} from "../rule-use.mjs";

const {DocumentSheetV2, HandlebarsApplicationMixin} = foundry.applications.api;
const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
const sheets = new WeakMap();
const {ItemSheetV2} = foundry.applications.sheets;

async function capacityContext(sheet) {
  const ability = creatureAbilityDetails(sheet.document, {language: game.i18n.lang, localize: key => game.i18n.localize(key)});
  const item = sheet.document.type === "creatureAbility";
  return {ability, descriptionField: item ? "system.description" : "description",
    summaryField: item ? "system.summary" : "flags.trudvang-chronicles.capacitySummary",
    sourceBookField: item ? "system.source.book" : "flags.trudvang-chronicles.capacitySource.book",
    sourcePageField: item ? "system.source.page" : "flags.trudvang-chronicles.capacitySource.page",
    enrichedDescription: annotateRuleTestDescription(
      await TextEditorImpl.enrichHTML(ability.description, {async: true, secrets: sheet.document.isOwner}), sheet.document)};
}

async function ruleTestAction(event, target) {
  event.preventDefault();
  return performRuleTest({document: this.document, index: target.dataset.testIndex});
}

async function useAbilityAction(event) {
  event.preventDefault();
  return useCreatureAbility(this.document);
}

// TEMPORARY WORLD MIGRATION — sheet for capacities stored as ActiveEffects in old worlds.
export class TrudvangCreatureAbilitySheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["trudvang", "sheet", "creature-ability-sheet"],
    tag: "form",
    position: {width: 520, height: 560},
    window: {resizable: true},
    canImport: false,
    canCreate: false,
    ownershipConfig: false,
    sheetConfig: false,
    actions: {"roll-rule-test": ruleTestAction, "use-ability": useAbilityAction},
    form: {handler: TrudvangCreatureAbilitySheet.#onSubmit, submitOnChange: true, closeOnSubmit: false}
  };

  async _onRender(context, options) {
    await super._onRender(context, options);
    bindTitleSharing(this);
  }

  static PARTS = {
    main: {template: "systems/trudvang-chronicles/templates/item/creature-ability-sheet.hbs", scrollable: [""]}
  };

  get title() { return this.document.name; }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return Object.assign(context, await capacityContext(this));
  }

  static async #onSubmit(event, form, formData) {
    if (!this.isEditable) return;
    const updates = {};
    for (const key of ["name", "description", "flags.trudvang-chronicles.capacitySummary", "flags.trudvang-chronicles.capacitySource.book", "flags.trudvang-chronicles.capacitySource.page"]) {
      if (!Object.hasOwn(formData.object, key)) continue;
      const value = formData.object[key];
      updates[key] = key.endsWith(".page") ? Number(value || 0) : value;
    }
    return this.document.update(updates);
  }
}

/** Importable capacity Items use their own sheet, separate from ActiveEffect editing. */
export class TrudvangCreatureAbilityItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["trudvang", "sheet", "creature-ability-sheet"], tag: "form",
    position: {width: 520, height: 560}, window: {resizable: true},
    form: {handler: TrudvangCreatureAbilityItemSheet.#onSubmit, submitOnChange: true, closeOnSubmit: false},
    actions: {"roll-rule-test": ruleTestAction, "use-ability": useAbilityAction}
  };
  async _onRender(context, options) {
    await super._onRender(context, options);
    bindTitleSharing(this);
  }
  static PARTS = TrudvangCreatureAbilitySheet.PARTS;
  async _prepareContext(options) {
    return Object.assign(await super._prepareContext(options), await capacityContext(this));
  }
  static async #onSubmit(event, form, formData) {
    if (!this.isEditable) return;
    const updates = {};
    for (const key of ["name", "system.summary", "system.description", "system.source.book", "system.source.page"]) {
      if (!Object.hasOwn(formData.object, key)) continue;
      const value = formData.object[key];
      updates[key] = key.endsWith(".page") ? Number(value || 0) : value;
    }
    return this.document.update(updates);
  }
}

export function openCreatureAbilitySheet(document) {
  if (!isCreatureAbility(document)) return null;
  if (document.type === "creatureAbility") return document.sheet.render({force: true});
  let sheet = sheets.get(document);
  if (!sheet) {
    sheet = new TrudvangCreatureAbilitySheet({document});
    sheets.set(document, sheet);
  }
  return sheet.render({force: true});
}
