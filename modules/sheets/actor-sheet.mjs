import { TRUDVANG } from "../config.mjs";
import { escapeHtml, localizeConfig } from "../helpers.mjs";
import { TABLET_BY_ID } from "../tablet-catalog.mjs";

const BaseActorSheet = foundry.appv1?.sheets?.ActorSheet ?? globalThis.ActorSheet;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;
const signed = value => Number(value) > 0 ? `+${Number(value)}` : `${Number(value)}`;
const normalized = value => String(value || "").trim().toLocaleLowerCase();

export class TrudvangActorSheet extends BaseActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["trudvang", "sheet", "actor"],
      width: 760,
      height: 720,
      resizable: true,
      submitOnChange: true,
      closeOnSubmit: false,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  get template() {
    return `systems/trudvang-chronicles/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.system = this.actor.system;
    context.editable = this.isEditable;
    context.owner = this.actor.isOwner;
    context.isGM = game.user.isGM;
    context.creationMode = Boolean(this.actor.system.experience?.creationMode);
    context.pendingAdvancements = this.actor.pendingAdvancements ?? [];
    context.pendingAdventureCost = context.pendingAdvancements.reduce((sum, operation) => sum + Number(operation.cost || 0), 0);
    context.config = {
      skills: localizeConfig(TRUDVANG.skills),
      traits: localizeConfig(TRUDVANG.traits),
      races: localizeConfig(TRUDVANG.races),
      cultures: localizeConfig(TRUDVANG.cultures),
      nativeLanguages: localizeConfig(TRUDVANG.nativeLanguages),
      archetypes: localizeConfig(TRUDVANG.archetypes),
      traitChoices: TRUDVANG.traitChoices,
      itemTypes: TRUDVANG.itemTypes
    };
    const raceId = this.actor.system.details?.race || "human";
    const allowedCultureIds = TRUDVANG.raceCultures[raceId] ?? Object.keys(TRUDVANG.cultures);
    context.config.cultures = localizeConfig(Object.fromEntries(allowedCultureIds.map(id => [id, TRUDVANG.cultures[id]]).filter(entry => entry[1])));
    const cultureId = this.actor.system.details?.culture || allowedCultureIds[0];
    const allowedLanguageIds = TRUDVANG.cultureLanguages[cultureId] ?? Object.keys(TRUDVANG.nativeLanguages);
    context.config.nativeLanguages = localizeConfig(Object.fromEntries(allowedLanguageIds.map(id => [id, TRUDVANG.nativeLanguages[id]])));
    context.config.religions = Object.fromEntries(this.actor.allowedReligionIds.map(id => [id, game.i18n.localize(TRUDVANG.religions[id].label)]));
    context.vitnerProfile = this.actor.selectedVitnerType;
    if (context.vitnerProfile) context.vitnerProfile.fatalRange = context.vitnerProfile.fatalThreshold === 10 ? "10" : `${context.vitnerProfile.fatalThreshold}-10`;
    context.religionProfile = this.actor.selectedReligion;
    context.religionEditable = context.creationMode && !Object.values(TRUDVANG.religions).some(religion => Number(this.actor.findKnowledgeItem(religion.specialty)?.system.level || 0) > 0);
    context.itemsByGroup = {};
    for (const [group, types] of Object.entries(TRUDVANG.actorItemGroups)) {
      context.itemsByGroup[group] = this.actor.items.filter(item => types.includes(item.type)).sort((a, b) => a.name.localeCompare(b.name));
    }
    context.enriched = {
      notes: await TextEditorImpl.enrichHTML(this.actor.system.notes || "", {async: true, secrets: this.actor.isOwner}),
      appearance: await TextEditorImpl.enrichHTML(this.actor.system.appearance || "", {async: true, secrets: this.actor.isOwner}),
      history: await TextEditorImpl.enrichHTML(this.actor.system.history || "", {async: true, secrets: this.actor.isOwner}),
      description: await TextEditorImpl.enrichHTML(this.actor.system.description || "", {async: true, secrets: this.actor.isOwner})
    };
    context.creationRemaining = Number(this.actor.system.experience?.creationTotal || 0) - Number(this.actor.system.buildCost || 0);
    context.creationOverBudget = context.creationRemaining < 0;
    context.creationCosts = this.actor.calculateCreationCosts();
    context.traitRows = Object.entries(context.config.traits).map(([key, label]) => {
      const value = Number(this.actor.system.traits?.[key] || 0);
      const choices = TRUDVANG.traitChoices;
      const index = choices.indexOf(value);
      const previous = choices[index - 1];
      const next = choices[index + 1];
      return {
        key, label, value,
        tooltip: game.i18n.format(`TRUDVANG.TraitBenefit.${key}`, {value: signed(value), inverse: signed(-value)}),
        decreaseTitle: previous === undefined ? game.i18n.localize("TRUDVANG.Warning.TraitLimit") : game.i18n.format("TRUDVANG.Cost.Refund", {cost: (value - previous) * 15}),
        increaseTitle: next === undefined ? game.i18n.localize("TRUDVANG.Warning.TraitLimit") : game.i18n.format("TRUDVANG.Cost.Increase", {cost: (next - value) * 15}),
        canDecrease: previous !== undefined,
        canIncrease: next !== undefined
      };
    });
    const increaseTitle = (cost, skillKey) => {
      if (!context.creationMode || !TRUDVANG.archetypes[this.actor.system.details?.archetype]?.core.includes(skillKey)) return game.i18n.format("TRUDVANG.Cost.Increase", {cost});
      const bonus = Math.min(cost, context.creationCosts.coreBonusRemaining);
      return game.i18n.format("TRUDVANG.Cost.IncreaseCore", {cost, bonus, creation: cost - bonus});
    };
    const buildNode = (entry, skillKey, kind, parentDiscipline = "") => {
      const existing = this.actor.findKnowledgeItem(entry.id);
      const level = Number(existing?.system.level || 0);
      const generatedSummary = this._knowledgeSummary({...entry, kind, parentDiscipline});
      const descriptionText = this._abilityText(entry.id, "Description") || generatedSummary;
      const summaryText = this._abilityText(entry.id, "Summary") || generatedSummary;
      const item = existing ?? {id: "", name: game.i18n.localize(entry.label), img: "icons/svg/book.svg", type: "ability", system: {description: descriptionText, summary: summaryText, catalogId: entry.id, kind, parentSkill: skillKey, parentDiscipline, level, rollBonus: kind === "specialty" ? 2 : 1, freeLevels: 0}};
      const breakdown = this.actor.getAbilityBreakdown(item);
      return {
        catalogId: entry.id, item, level, breakdown,
        summary: existing?.system.summary || summaryText,
        calculation: kind === "specialty"
          ? game.i18n.format("TRUDVANG.Calculation.Specialty", {skill: breakdown.skill, discipline: breakdown.discipline, specialty: breakdown.specialty, total: breakdown.total})
          : game.i18n.format("TRUDVANG.Calculation.Discipline", {skill: breakdown.skill, discipline: breakdown.own, total: breakdown.total}),
        refundCost: level ? this.actor.getKnowledgeLevelCost(item, level) : 0,
        nextCost: this.actor.getKnowledgeLevelCost(item, level + 1),
        decreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: level ? this.actor.getKnowledgeLevelCost(item, level) : 0}),
        increaseTitle: increaseTitle(this.actor.getKnowledgeLevelCost(item, level + 1), skillKey),
        canDecrease: level > Number(item.system.freeLevels || 0),
        canIncrease: level < 5 && this.actor.canChooseCatalogKnowledge(entry.id),
        exists: Boolean(existing)
      };
    };
    context.skillTrees = Object.entries(context.config.skills).map(([key, label]) => {
      const skill = this.actor.system.skills[key];
      const level = Number(skill.value || 1);
      const abilities = this.actor.items.filter(item => item.type === "ability" && item.system.parentSkill === key);
      const decorate = item => {
        const itemLevel = Number(item.system.level ?? 0);
        const breakdown = this.actor.getAbilityBreakdown(item);
        const entry = this.actor.getCatalogEntry(item.system.catalogId);
        return {
          item, level: itemLevel, breakdown,
          summary: item.system.summary || (entry ? (this._abilityText(entry.id, "Summary") || this._knowledgeSummary(entry)) : item.system.description || ""),
          calculation: item.system.kind === "specialty" ? game.i18n.format("TRUDVANG.Calculation.Specialty", {skill: breakdown.skill, discipline: breakdown.discipline, specialty: breakdown.specialty, total: breakdown.total}) : game.i18n.format("TRUDVANG.Calculation.Discipline", {skill: breakdown.skill, discipline: breakdown.own, total: breakdown.total}),
          refundCost: this.actor.getKnowledgeLevelCost(item, itemLevel),
          nextCost: this.actor.getKnowledgeLevelCost(item, itemLevel + 1),
          decreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: this.actor.getKnowledgeLevelCost(item, itemLevel)}),
          increaseTitle: increaseTitle(this.actor.getKnowledgeLevelCost(item, itemLevel + 1), key),
          canDecrease: itemLevel > Number(item.system.freeLevels || 0), canIncrease: itemLevel < 5 && this.actor.canChooseCatalogKnowledge(item.system.catalogId), exists: true
        };
      };
      const disciplineNodes = (TRUDVANG.knowledgeTree[key] || []).map(discipline => ({...buildNode(discipline, key, "discipline"), specialties: discipline.specialties.map(specialty => buildNode(specialty, key, "specialty", discipline.name))}));
      const catalogItemIds = new Set(disciplineNodes.flatMap(node => [node.item.id, ...node.specialties.map(child => child.item.id)]).filter(Boolean));
      return {
        key, label, skill, level,
        description: game.i18n.localize(TRUDVANG.skillDescriptions[key]),
        isCore: Boolean(TRUDVANG.archetypes[this.actor.system.details?.archetype]?.core.includes(key)),
        refundCost: level,
        nextCost: level + 1,
        decreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: level}),
        increaseTitle: increaseTitle(level + 1, key),
        canDecrease: level > 1,
        canIncrease: level < 10,
        disciplines: disciplineNodes,
        unassigned: abilities.filter(item => !catalogItemIds.has(item.id)).map(decorate)
      };
    });
    const tablets = this.actor.items.filter(item => item.type === "tablet");
    const powers = this.actor.items.filter(item => ["spell", "divineFeat"].includes(item.type));
    context.magicTree = tablets.map(item => {
      const level = Number(item.system.level || 1);
      const tabletId = item.system.catalogId || item.getFlag("trudvang-chronicles", "catalogId");
      return {
        item,
        refundCost: this.actor.getKnowledgeLevelCost(item, level),
        nextCost: this.actor.getKnowledgeLevelCost(item, level + 1),
        children: powers.filter(power => power.system.tabletId === tabletId || normalized(power.system.tablet) === normalized(item.name)).map(power => ({item: power, inactive: Number(power.system.level || 1) > level})),
        decreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: this.actor.getKnowledgeLevelCost(item, level)}),
        increaseTitle: game.i18n.format("TRUDVANG.Cost.Increase", {cost: this.actor.getKnowledgeLevelCost(item, level + 1)}),
        canDecrease: level > 1,
        canIncrease: level < 5
      };
    });
    const linkedPowers = new Set(context.magicTree.flatMap(node => node.children.map(child => child.item.id)));
    context.unassignedMagic = powers.filter(item => !linkedPowers.has(item.id));
    context.compatibleTabletCount = this.actor.compatibleTablets.length;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    const root = html[0] ?? html;
    root.querySelectorAll("[data-action]").forEach(element => {
      element.addEventListener("click", event => this._onAction(event));
    });
    root.querySelectorAll("details[data-tree-key]").forEach(element => {
      element.addEventListener("toggle", () => {
        this._treeState ??= new Map();
        this._treeState.set(element.dataset.treeKey, element.open);
      });
    });
    this._restoreViewState(root);
  }

  async _onAction(event) {
    event.preventDefault();
    event.stopPropagation();
    const action = event.currentTarget.dataset.action;
    const root = event.currentTarget.closest("form") ?? this.element?.[0];
    const rerenderingActions = new Set([
      "adjust-trait", "adjust-skill", "adjust-item-level", "adjust-catalog-knowledge",
      "toggle-creation-mode", "confirm-advancement", "cancel-advancement", "item-delete",
      "item-equip", "item-create", "show-catalog-detail"
    ]);
    if (rerenderingActions.has(action)) this._captureViewState(root);
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const catalogId = event.currentTarget.dataset.catalogId || event.currentTarget.closest("[data-catalog-id]")?.dataset.catalogId;
    const item = itemId ? this.actor.items.get(itemId) : null;
    switch (action) {
      case "roll-skill": return this.actor.rollSkill(event.currentTarget.dataset.skill);
      case "show-skill-detail": return this._showDetail(game.i18n.localize(TRUDVANG.skills[event.currentTarget.dataset.skill]), game.i18n.localize(TRUDVANG.skillDescriptions[event.currentTarget.dataset.skill]));
      case "roll-trait": return this.actor.rollTrait(event.currentTarget.dataset.trait);
      case "advance-skill": return this.actor.advanceSkill(event.currentTarget.dataset.skill);
      case "adjust-trait": return this.actor.adjustTrait(event.currentTarget.dataset.trait, Number(event.currentTarget.dataset.direction));
      case "adjust-skill": return this.actor.adjustSkill(event.currentTarget.dataset.skill, Number(event.currentTarget.dataset.direction));
      case "adjust-item-level": return item ? this.actor.adjustItemLevel(item, Number(event.currentTarget.dataset.direction)) : null;
      case "adjust-catalog-knowledge": return this.actor.adjustCatalogKnowledge(catalogId, Number(event.currentTarget.dataset.direction));
      case "roll-catalog": return item && Number(item.system.level || 0) > 0 ? item.roll() : ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.KnowledgeNotLearned"));
      case "show-catalog-detail": return this._openKnowledgeSheet(catalogId);
      case "toggle-creation-mode": return this.actor.toggleCreationMode();
      case "confirm-advancement": return this.actor.confirmAdvancements();
      case "cancel-advancement": return this.actor.cancelAdvancements();
      case "roll-initiative": return this.actor.rollInitiativeTrudvang();
      case "reset-combat": return this.actor.resetCombatPoints();
      case "item-roll": return item?.roll();
      case "item-parry": return item ? this.actor.rollWeaponParry(item) : null;
      case "item-damage": return this.actor.rollDamage(item);
      case "item-advance": return item ? this.actor.advanceItem(item) : null;
      case "item-edit": return item?.sheet.render(true);
      case "item-delete": return this._deleteItem(item);
      case "item-equip": return item?.update({"system.equipped": !item.system.equipped});
      case "item-create": return this._createItem(event.currentTarget.dataset.type);
      case "add-tablet": return this._openTabletPicker();
      case "toggle-tree": {
        const details = event.currentTarget.closest("details");
        if (details) details.open = !details.open;
        return;
      }
      case "toggle-zero-knowledge":
        this._showZeroKnowledge = !(this._showZeroKnowledge ?? true);
        return this._applyZeroVisibility(root);
      case "toggle-inactive-magic":
        this._showInactiveMagic = !(this._showInactiveMagic ?? true);
        return this._applyInactiveMagicVisibility(root);
      case "expand-tree": return this._setTreeExpanded(root, true);
      case "collapse-tree": return this._setTreeExpanded(root, false);
      default: return null;
    }
  }

  _captureViewState(root) {
    if (!root) return;
    this._treeState ??= new Map();
    root.querySelectorAll("details[data-tree-key]").forEach(element => {
      this._treeState.set(element.dataset.treeKey, element.open);
    });
    const scroll = {};
    root.querySelectorAll(".sheet-body > .tab[data-tab]").forEach(tab => {
      scroll[tab.dataset.tab] = tab.scrollTop;
    });
    const token = {};
    this._viewState = {scroll, token, expires: Date.now() + 2500};
    setTimeout(() => {
      if (this._viewState?.token === token) this._viewState = null;
    }, 2500);
  }

  _restoreViewState(root) {
    this._applyZeroVisibility(root);
    this._applyInactiveMagicVisibility(root);
    this._treeState ??= new Map();
    root.querySelectorAll("details[data-tree-key]").forEach(element => {
      if (this._treeState.has(element.dataset.treeKey)) element.open = this._treeState.get(element.dataset.treeKey);
    });
    const state = this._viewState;
    if (!state || state.expires < Date.now()) return;
    const restore = () => {
      root.querySelectorAll(".sheet-body > .tab[data-tab]").forEach(tab => {
        if (Object.hasOwn(state.scroll, tab.dataset.tab)) tab.scrollTop = state.scroll[tab.dataset.tab];
      });
    };
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }

  _applyZeroVisibility(root) {
    if (!root) return;
    this._showZeroKnowledge ??= true;
    root.classList.toggle("hide-zero-knowledge", !this._showZeroKnowledge);
    const button = root.querySelector('[data-action="toggle-zero-knowledge"]');
    if (!button) return;
    const key = this._showZeroKnowledge ? "TRUDVANG.Action.HideUnlearned" : "TRUDVANG.Action.ShowUnlearned";
    const label = button.querySelector("span");
    if (label) label.textContent = game.i18n.localize(key);
    const icon = button.querySelector("i");
    if (icon) icon.className = this._showZeroKnowledge ? "fas fa-eye-slash" : "fas fa-eye";
  }

  _applyInactiveMagicVisibility(root) {
    if (!root) return;
    this._showInactiveMagic ??= true;
    root.classList.toggle("hide-inactive-magic", !this._showInactiveMagic);
    const button = root.querySelector('[data-action="toggle-inactive-magic"]');
    if (!button) return;
    const key = this._showInactiveMagic ? "TRUDVANG.Action.HideInactiveMagic" : "TRUDVANG.Action.ShowInactiveMagic";
    const label = button.querySelector("span");
    if (label) label.textContent = game.i18n.localize(key);
    const icon = button.querySelector("i");
    if (icon) icon.className = this._showInactiveMagic ? "fas fa-eye-slash" : "fas fa-eye";
  }

  _showDetail(title, description) {
    const DialogClass = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
    return new DialogClass({title, content: `<div class="trudvang detail-dialog"><p>${escapeHtml(description)}</p></div>`, buttons: {close: {label: game.i18n.localize("TRUDVANG.Action.Close")}}}).render(true);
  }

  _abilityText(catalogId, suffix) {
    const key = `TRUDVANG.Content.Ability.${catalogId}.${suffix}`;
    const text = game.i18n.localize(key);
    return text === key ? "" : text;
  }

  _showCatalogDetail(catalogId) {
    const entry = this.actor.getCatalogEntry(catalogId);
    if (!entry) return;
    const name = game.i18n.localize(entry.label);
    return this._showDetail(name, this._abilityText(entry.id, "Description") || this._knowledgeSummary(entry));
  }

  async _openKnowledgeSheet(catalogId) {
    const existing = this.actor.findKnowledgeItem(catalogId);
    if (existing) return existing.sheet.render(true);
    const entry = this.actor.getCatalogEntry(catalogId);
    if (!entry) return;
    const kind = entry.kind ?? "discipline";
    const description = this._abilityText(entry.id, "Description") || this._knowledgeSummary({...entry, kind, parentDiscipline: entry.parentDiscipline ?? ""});
    const summary = this._abilityText(entry.id, "Summary");
    const [item] = await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize(entry.label),
      type: "ability",
      system: {catalogId: entry.id, kind, parentSkill: entry.skillKey, parentDiscipline: entry.parentDiscipline ?? "", level: 0, freeLevels: 0, rollBonus: entry.rollBonus ?? (kind === "specialty" ? 2 : 1), description, summary}
    }]);
    return item?.sheet.render(true);
  }

  _knowledgeSummary(entry) {
    const name = game.i18n.localize(entry.label);
    if (TRUDVANG.knowledgeDescriptions[entry.id]) return game.i18n.localize(TRUDVANG.knowledgeDescriptions[entry.id]);
    if (entry.kind === "discipline" || entry.specialties) {
      const topics = new Intl.ListFormat(game.i18n.lang, {style: "long", type: "conjunction"}).format((entry.specialties || []).map(specialty => game.i18n.localize(specialty.label)));
      return game.i18n.format("TRUDVANG.Description.DisciplineSummary", {name, topics});
    }
    const discipline = entry.parentCatalogId ? this.actor.getCatalogEntry(entry.parentCatalogId) : null;
    const parent = discipline ? game.i18n.localize(discipline.label) : entry.parentDiscipline;
    return game.i18n.format("TRUDVANG.Description.SpecialtySummary", {name, discipline: parent});
  }

  _openTabletPicker() {
    const tablets = this.actor.compatibleTablets;
    if (!tablets.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoCompatibleTablets"));
    const DialogClass = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
    const options = tablets.map(tablet => `<option value="${tablet.id}">${escapeHtml(tablet.name)}</option>`).join("");
    return new DialogClass({
      title: game.i18n.localize("TRUDVANG.Dialog.AddTablet"),
      content: `<form class="trudvang"><div class="form-group"><label>${game.i18n.localize("TYPES.Item.tablet")}</label><select name="tabletId">${options}</select></div></form>`,
      buttons: {add: {icon: "<i class='fas fa-plus'></i>", label: game.i18n.localize("TRUDVANG.Action.Add"), callback: html => this.actor.addTabletFromCatalog((html[0] ?? html).querySelector("[name=tabletId]")?.value)}, cancel: {label: game.i18n.localize("TRUDVANG.Action.Cancel")}}
    }).render(true);
  }

  _setTreeExpanded(root, expanded) {
    if (!root) return;
    this._treeState ??= new Map();
    root.querySelectorAll("details[data-tree-key]").forEach(element => {
      element.open = expanded;
      this._treeState.set(element.dataset.treeKey, expanded);
    });
  }

  async _createItem(type) {
    if (!TRUDVANG.itemTypes.includes(type)) return;
    if (this.actor.type === "character" && type === "tablet" && !this.actor.system.experience?.creationMode) {
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
    }
    const item = await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.format("TRUDVANG.New.Item", {type: game.i18n.localize(`TYPES.Item.${type}`)}),
      type,
      system: type === "ability" ? {level: 0} : {}
    }]);
    item[0]?.sheet.render(true);
  }

  async _onChangeInput(event) {
    await super._onChangeInput(event);
    if (!this.actor.system.experience?.creationMode) return;
    const name = event.currentTarget?.name;
    if (["system.details.race", "system.details.culture", "system.details.nativeLanguage"].includes(name)) {
      await this.actor.alignCreationOrigins();
      await this.actor.syncCreationDefaults();
    }
    if (name === "system.details.race") {
      const allowed = this.actor.allowedReligionIds;
      if (allowed.length === 1 && !this.actor.system.details.religion) await this.actor.update({"system.details.religion": allowed[0]});
      else if (!allowed.includes(this.actor.system.details.religion)) await this.actor.update({"system.details.religion": ""});
    }
  }

  async _deleteItem(item) {
    if (!item) return;
    if (this.actor.type === "character" && ["ability", "tablet"].includes(item.type) && !this.actor.system.experience?.creationMode) {
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
    }
    if (item.type === "tablet") {
      const tabletId = item.system.catalogId || item.getFlag("trudvang-chronicles", "catalogId");
      const children = this.actor.items.filter(candidate => ["spell", "divineFeat"].includes(candidate.type) && (candidate.system.tabletId === tabletId || normalized(candidate.system.tablet) === normalized(item.name)));
      if (children.length) await this.actor.deleteEmbeddedDocuments("Item", children.map(child => child.id));
    }
    return item.delete();
  }

  async _onDropItemCreate(itemData) {
    const entries = Array.isArray(itemData) ? itemData : [itemData];
    if (entries.length === 1 && entries[0].type === "tablet") {
      const catalogId = entries[0].system?.catalogId || entries[0].flags?.["trudvang-chronicles"]?.catalogId;
      if (TABLET_BY_ID.has(catalogId)) return this.actor.addTabletFromCatalog(catalogId);
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.UnknownTablet"));
    }
    const prepared = entries.map(data => {
      const copy = foundry.utils.deepClone(data);
      if (this.actor.type === "character" && copy.type === "ability" && !this.actor.system.experience?.creationMode) copy.system.level = 0;
      return copy;
    });
    return super._onDropItemCreate(Array.isArray(itemData) ? prepared : prepared[0]);
  }
}

export class TrudvangCharacterSheet extends TrudvangActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {width: 780, height: 740});
  }

  // Leaving creation mode finalizes the character (validations, spent points); closing the
  // window mid-creation would otherwise strand the work in a half-configured state.
  async close(options = {}) {
    if (this.actor?.isOwner && this.actor.system?.experience?.creationMode) {
      try { await this.actor.toggleCreationMode(); }
      catch (error) { console.warn("Trudvang Chronicles | Could not leave character creation on close", error); }
    }
    return super.close(options);
  }
}

export class TrudvangNpcSheet extends TrudvangActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {width: 580, height: 650});
  }
}
