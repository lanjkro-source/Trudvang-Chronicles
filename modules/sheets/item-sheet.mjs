import { TRUDVANG } from "../config.mjs";

const BaseItemSheet = foundry.appv1?.sheets?.ItemSheet ?? globalThis.ItemSheet;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;

export class TrudvangItemSheet extends BaseItemSheet {
  get levelManaged() {
    return this.item.parent?.type === "character" && ["ability", "tablet"].includes(this.item.type);
  }

  get advancementLocked() {
    return this.item.parent?.type === "character"
      && ["ability", "tablet"].includes(this.item.type)
      && !this.item.parent.system.experience?.creationMode
      && Number(this.item.system.level || 0) > 0;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["trudvang", "sheet", "item"],
      width: 560,
      height: 620,
      resizable: true,
      submitOnChange: true,
      closeOnSubmit: false
    });
  }

  get template() {
    return "systems/trudvang-chronicles/templates/item/item-sheet.hbs";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.system = this.item.system;
    context.itemType = this.item.type;
    context.isType = type => this.item.type === type;
    context.config = TRUDVANG;
    context.advancementLocked = this.advancementLocked;
    context.enrichedDescription = await TextEditorImpl.enrichHTML(this.item.system.description || "", {async: true, secrets: this.item.isOwner});
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    const root = html[0] ?? html;
    if (this.levelManaged) root.querySelector("[name='system.level']")?.setAttribute("disabled", "disabled");
    if (this.advancementLocked) {
      for (const name of ["system.kind", "system.parentSkill", "system.parentDiscipline", "system.costTrait", "system.tabletType"]) {
        root.querySelector(`[name='${name}']`)?.setAttribute("disabled", "disabled");
      }
    }
    root.querySelector("[data-action='roll']")?.addEventListener("click", event => {
      event.preventDefault();
      this.item.roll();
    });
  }
}
