import {creatureAbilityDetails, isCreatureAbility} from "../creature-ability.mjs";

const {DocumentSheetV2, HandlebarsApplicationMixin} = foundry.applications.api;
const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
const sheets = new WeakMap();

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
    form: {handler: TrudvangCreatureAbilitySheet.#onSubmit, submitOnChange: true, closeOnSubmit: false}
  };

  static PARTS = {
    main: {template: "systems/trudvang-chronicles/templates/item/creature-ability-sheet.hbs", scrollable: [""]}
  };

  get title() { return this.document.name; }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.ability = creatureAbilityDetails(this.document, {language: game.i18n.lang, localize: key => game.i18n.localize(key)});
    context.enrichedDescription = await TextEditorImpl.enrichHTML(context.ability.description, {async: true, secrets: this.document.isOwner});
    return context;
  }

  static async #onSubmit(event, form, formData) {
    if (!this.isEditable) return;
    const updates = {};
    for (const key of ["name", "description", "flags.trudvang-chronicles.capacitySummary", "flags.trudvang-chronicles.capacitySource.book", "flags.trudvang-chronicles.capacitySource.page"]) {
      if (!Object.hasOwn(formData.object, key)) continue;
      const value = formData.object[key];
      updates[key] = key.endsWith(".page") && value !== "" ? Number(value) : value;
    }
    return this.document.update(updates);
  }
}

export function openCreatureAbilitySheet(document) {
  if (!isCreatureAbility(document)) return null;
  let sheet = sheets.get(document);
  if (!sheet) {
    sheet = new TrudvangCreatureAbilitySheet({document});
    sheets.set(document, sheet);
  }
  return sheet.render({force: true});
}
