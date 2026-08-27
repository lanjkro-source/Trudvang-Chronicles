import { TRUDVANG } from "../config.mjs";
import { effectChangeSummary } from "../effects.mjs";
import { weaponUsesSeparateHands } from "../rules/combat-pool-resolver.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;

export class TrudvangItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  get levelManaged() {
    return this.item.parent?.type === "character" && ["ability", "tablet"].includes(this.item.type);
  }

  get advancementLocked() {
    return this.item.parent?.type === "character"
      && ["ability", "tablet"].includes(this.item.type)
      && !this.item.parent.system.experience?.creationMode
      && Number(this.item.system.level || 0) > 0;
  }

  get structuralLocked() {
    return this.item.type === "ability" && Boolean(this.item.system.catalogId);
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["trudvang", "sheet", "item"],
    position: { width: 560, height: 620 },
    resizable: true,
    form: {
      handler: TrudvangItemSheet.#onSubmit,
      submitOnChange: true,
      closeOnSubmit: false
    },
    actions: {
      roll: TrudvangItemSheet.#onRoll,
      "delete-item": TrudvangItemSheet.#onDeleteItem,
      "effect-add": TrudvangItemSheet.#onEffectAdd,
      "effect-edit": TrudvangItemSheet.#onEffectEdit,
      "effect-toggle": TrudvangItemSheet.#onEffectToggle,
      "effect-delete": TrudvangItemSheet.#onEffectDelete,
      "apply-effects": TrudvangItemSheet.#onApplyEffects
    }
  };

  static PARTS = {
    main: { template: "systems/trudvang-chronicles/templates/item/item-sheet.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.editable = this.item.isOwner;
    context.system = this.item.system;
    context.itemType = this.item.type;
    context.usesSeparateHands = weaponUsesSeparateHands(this.item);
    context.isType = type => this.item.type === type;
    context.config = TRUDVANG;
    context.advancementLocked = this.advancementLocked;
    context.effects = this.item.effects.map(effect => ({
      id: effect.id,
      name: effect.name,
      img: effect.img,
      transfer: effect.transfer,
      disabled: effect.disabled,
      summary: effectChangeSummary(effect)
    }));
    context.enrichedDescription = await TextEditorImpl.enrichHTML(this.item.system.description || "", {async: true, secrets: this.item.isOwner});
    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const root = this.element;
    if (!this.item.isOwner) {
      root.querySelectorAll("input, select, textarea").forEach(element => element.setAttribute("disabled", "disabled"));
    }
    if (this.levelManaged) root.querySelector("[name='system.level']")?.setAttribute("disabled", "disabled");
    if (this.structuralLocked) {
      for (const name of ["system.kind", "system.parentSkill", "system.parentDiscipline", "system.costTrait", "system.level"]) {
        root.querySelector(`[name='${name}']`)?.setAttribute("disabled", "disabled");
      }
    }
    if (this.advancementLocked) {
      for (const name of ["system.kind", "system.parentSkill", "system.parentDiscipline", "system.costTrait", "system.tabletType"]) {
        root.querySelector(`[name='${name}']`)?.setAttribute("disabled", "disabled");
      }
    }
  }

  static async #onSubmit(event, form, formData) {
    await this.document.update(formData.object);
  }

  static async #onRoll(event, target) {
    event.preventDefault();
    await this.item.roll();
  }

  static async #onDeleteItem(event, target) {
    const parent = this.item.parent;
    if (parent?.type === "character" && !parent.system.experience?.creationMode) {
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
    }
    await this.item.delete();
    await this.close();
  }

  static async #onEffectAdd() {
    const [effect] = await this.item.createEmbeddedDocuments("ActiveEffect", [{
      name: game.i18n.localize("TRUDVANG.New.Effect"),
      type: "effect",
      img: "icons/svg/aura.svg",
      transfer: ["weapon", "armor", "shield", "gear", "ability"].includes(this.item.type),
      system: {stacking: "stack", changes: []}
    }]);
    effect?.sheet.render({force: true});
  }

  static async #onEffectEdit(event, target) {
    return this.item.effects.get(target.closest("[data-effect-id]")?.dataset.effectId)?.sheet.render({force: true});
  }

  static async #onEffectToggle(event, target) {
    const effect = this.item.effects.get(target.closest("[data-effect-id]")?.dataset.effectId);
    return effect?.update({disabled: !effect.disabled});
  }

  static async #onEffectDelete(event, target) {
    return this.item.effects.get(target.closest("[data-effect-id]")?.dataset.effectId)?.delete();
  }

  static async #onApplyEffects() {
    return this.item.applyEffects();
  }
}
