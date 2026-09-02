import { TRUDVANG } from "../config.mjs";
import { escapeHtml, localizeConfig } from "../helpers.mjs";
import { TABLET_BY_ID, tabletName } from "../tablet-catalog.mjs";
import { effectChangeSummary } from "../effects.mjs";
import { prepareActorStatInspection, prepareEquipmentInspection, showInspectionDialog } from "../equipment-inspection.mjs";
import { resolveArmorProfile, resolveCombatActionModifier, resolveDamage, resolveEquipment } from "../rules/equipment-resolver.mjs";
import { combatPoolsAreFull, resolveCombatPools, weaponUsesSeparateHands } from "../rules/combat-pool-resolver.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;
const signed = value => Number(value) > 0 ? `+${Number(value)}` : `${Number(value)}`;
const normalized = value => String(value || "").trim().toLocaleLowerCase();

function percent(value, max) {
  const maximum = Math.max(1, Number(max || 1));
  return Math.max(0, Math.min(100, (Number(value || 0) / maximum) * 100));
}

function healthThresholdMarks(max) {
  const maximum = Math.max(1, Number(max || 1));
  const baseRange = Math.floor(maximum / 4);
  const remainder = maximum % 4;
  const thresholds = Array.from({length: 4}, (_, index) => baseRange + (index < remainder ? 1 : 0))
    .reduce((ranges, range) => [...ranges, range + (ranges.at(-1) || 0)], []);
  return [...new Set(thresholds.slice(0, -1).map(threshold => Math.round(((maximum - threshold) / maximum) * 1000) / 10))];
}

function getFearStatus(fear) {
  const value = Number(fear || 0);
  if (value <= 0) return {level: "calm", penalty: 0};
  if (value <= 10) return {level: "one", penalty: 0};
  if (value <= 20) return {level: "two", penalty: -1};
  if (value <= 30) return {level: "three", penalty: -3};
  if (value <= 40) return {level: "four", penalty: -5};
  return {level: "five", penalty: -7};
}

export class TrudvangActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["trudvang", "sheet", "actor"],
    position: {width: 760, height: 720},
    window: {resizable: true},
    form: {
      handler: TrudvangActorSheet.#onSubmit,
      submitOnChange: true,
      closeOnSubmit: false
    },
    dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}],
    actions: {
      "roll-skill": TrudvangActorSheet.#onAction,
      "show-skill-detail": TrudvangActorSheet.#onAction,
      "roll-trait": TrudvangActorSheet.#onAction,
      "advance-skill": TrudvangActorSheet.#onAction,
      "adjust-trait": TrudvangActorSheet.#onAction,
      "adjust-skill": TrudvangActorSheet.#onAction,
      "adjust-item-level": TrudvangActorSheet.#onAction,
      "adjust-catalog-knowledge": TrudvangActorSheet.#onAction,
      "roll-catalog": TrudvangActorSheet.#onAction,
      "show-catalog-detail": TrudvangActorSheet.#onAction,
      "toggle-creation-mode": TrudvangActorSheet.#onAction,
      "confirm-advancement": TrudvangActorSheet.#onAction,
      "cancel-advancement": TrudvangActorSheet.#onAction,
      "roll-initiative": TrudvangActorSheet.#onAction,
      "rest-for-night": TrudvangActorSheet.#onAction,
      "calm-fear": TrudvangActorSheet.#onAction,
      "reset-combat": TrudvangActorSheet.#onAction,
      "movement-action": TrudvangActorSheet.#onAction,
      "item-roll": TrudvangActorSheet.#onAction,
      "item-parry": TrudvangActorSheet.#onAction,
      "item-damage": TrudvangActorSheet.#onAction,
      "item-advance": TrudvangActorSheet.#onAction,
      "item-edit": TrudvangActorSheet.#onAction,
      "item-delete": TrudvangActorSheet.#onAction,
      "item-equip": TrudvangActorSheet.#onAction,
      "item-ready": TrudvangActorSheet.#onAction,
      "natural-attack": TrudvangActorSheet.#onAction,
      "natural-parry": TrudvangActorSheet.#onAction,
      "natural-damage": TrudvangActorSheet.#onAction,
      "dodge-action": TrudvangActorSheet.#onAction,
      "wrestling-action": TrudvangActorSheet.#onAction,
      "item-create": TrudvangActorSheet.#onAction,
      "add-tablet": TrudvangActorSheet.#onAction,
      "toggle-tree": TrudvangActorSheet.#onAction,
      "toggle-zero-knowledge": TrudvangActorSheet.#onAction,
      "toggle-inactive-magic": TrudvangActorSheet.#onAction,
      "expand-tree": TrudvangActorSheet.#onAction,
      "collapse-tree": TrudvangActorSheet.#onAction,
      "effect-add": TrudvangActorSheet.#onAction,
      "effect-edit": TrudvangActorSheet.#onAction,
      "effect-toggle": TrudvangActorSheet.#onAction,
      "effect-delete": TrudvangActorSheet.#onAction,
      "inspect-item": TrudvangActorSheet.#onAction,
      "inspect-global-stat": TrudvangActorSheet.#onAction
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.editable = this.isEditable;
    context.owner = this.actor.isOwner;
    context.isGM = game.user.isGM;
    const body = this.actor.system.resources.body;
    const fear = this.actor.system.resources.fear;
    const recovery = this.actor.system.healthRecovery ?? {amount: 1, days: 1};
    const equippedArmor = this.actor.items.filter(item => item.type === "armor" && item.system.equipped);
    context.armorStatus = {
      protection: Number(this.actor.system.protection || 0),
      integrityCurrent: equippedArmor.reduce((total, item) => total + Number(item.system.breach?.value || 0), 0),
      integrityMax: equippedArmor.reduce((total, item) => total + Number(item.system.breach?.max || 0), 0)
    };
    context.freeCombatMovement = Math.min(5, Number(this.actor.findKnowledgeItem("combatMovement")?.system.level || 0));
    context.healthStatus = {
      current: Number(body.current || 0),
      max: Number(body.max || 0),
      percent: percent(body.current, body.max),
      marks: healthThresholdMarks(body.max),
      recovery: game.i18n.format(recovery.days === 1 ? "TRUDVANG.Status.RecoveryDaily" : "TRUDVANG.Status.RecoveryEveryDays", recovery),
      level: this.actor.system.damage.level,
      consequence: game.i18n.localize(`TRUDVANG.Status.DamageConsequence.${this.actor.system.damage.level}`),
      survivalRounds: Number(this.actor.system.survivalRounds ?? -1),
      survivalStarted: Number(this.actor.system.survivalRounds ?? -1) >= 0
    };
    const fearStatus = getFearStatus(fear.current);
    context.fearStatus = {
      current: Number(fear.current || 0),
      max: Number(fear.max || 0),
      percent: percent(fear.current, fear.max),
      ...fearStatus,
      state: game.i18n.localize(`TRUDVANG.Status.FearState.${fearStatus.level}`),
      consequence: game.i18n.localize(`TRUDVANG.Status.FearConsequence.${fearStatus.level}`)
    };
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
    context.config.races = Object.fromEntries(Object.entries(TRUDVANG.races).map(([id, race]) => {
      const name = game.i18n.localize(race.label);
      return [id, context.creationMode ? `${name} (${race.body}/${race.movement})` : name];
    }));
    const raceId = this.actor.system.details?.race || "human";
    const allowedCultureIds = TRUDVANG.raceCultures[raceId] ?? Object.keys(TRUDVANG.cultures);
    context.config.cultures = localizeConfig(Object.fromEntries(allowedCultureIds.map(id => [id, TRUDVANG.cultures[id]]).filter(entry => entry[1])));
    const cultureId = this.actor.system.details?.culture || allowedCultureIds[0];
    const allowedLanguageIds = TRUDVANG.cultureLanguages[cultureId] ?? Object.keys(TRUDVANG.nativeLanguages);
    context.config.nativeLanguages = localizeConfig(Object.fromEntries(allowedLanguageIds.map(id => [id, TRUDVANG.nativeLanguages[id]])));
    context.config.religions = Object.fromEntries(this.actor.allowedReligionIds.map(id => [id, game.i18n.localize(TRUDVANG.religions[id].label)]));
    context.isInCombat = this.actor.isInActiveCombat;
    context.canDodge = context.isInCombat && combatPoolsAreFull(this.actor);
    const poolContext = {ignoreSpent: !context.isInCombat};
    const weaponFree = resolveCombatPools({actor: this.actor, item: {type: "weapon", system: {hand: "weapon"}}, context: {...poolContext, action: "attack"}}).pools.find(pool => pool.id === "free");
    const offHandFree = resolveCombatPools({actor: this.actor, item: {type: "shield", system: {}}, context: {...poolContext, action: "parry"}}).pools.find(pool => pool.id === "free");
    context.combatPools = resolveCombatPools({actor: this.actor, context: poolContext}).active.map(pool => {
      const sourceTitle = pool.source.name
        ? game.i18n.format("TRUDVANG.Calculation.CombatPoolSource", {source: pool.source.name, level: pool.source.level, max: pool.max})
        : game.i18n.format("TRUDVANG.Calculation.FreeCombatPoolSource", {
          skill: pool.source.level,
          experience: pool.source.battleExperience,
          modifier: Number(pool.source.modifier) > 0 ? `+${pool.source.modifier}` : pool.source.modifier,
          max: pool.max
        });
      const hint = pool.hintKey ? game.i18n.localize(pool.hintKey) : "";
      const isFree = pool.id === "free";
      return {...pool, label: game.i18n.localize(pool.labelKey), displayCurrent: isFree ? `${weaponFree.current}|${offHandFree.current}` : pool.current, depleted: isFree ? !weaponFree.current && !offHandFree.current : !pool.current, sourceTitle: [sourceTitle, hint].filter(Boolean).join("\n")};
    });
    context.freeCombatPool = context.combatPools.find(pool => pool.id === "free");
    context.combatMovementHint = game.i18n.format("TRUDVANG.Combat.MovementHint", {
      free: Number(this.actor.findKnowledgeItem("combatMovement")?.system.level || 0),
      movement: Number(this.actor.system.movement?.current || 0)
    });
    context.vitnerProfile = this.actor.selectedVitnerType;
    if (context.vitnerProfile) context.vitnerProfile.fatalRange = context.vitnerProfile.fatalThreshold === 10 ? "10" : `${context.vitnerProfile.fatalThreshold}-10`;
    context.religionProfile = this.actor.selectedReligion;
    context.religionEditable = context.creationMode && !Object.values(TRUDVANG.religions).some(religion => Number(this.actor.findKnowledgeItem(religion.specialty)?.system.level || 0) > 0);
    context.effects = Array.from(this.actor.allApplicableEffects()).map(effect => ({
      uuid: effect.uuid,
      name: effect.name,
      img: effect.img,
      source: effect.sourceName,
      duration: effect.duration?.label || game.i18n.localize("TRUDVANG.Effect.Permanent"),
      summary: effectChangeSummary(effect),
      active: effect.active,
      disabled: effect.disabled,
      suppressed: effect.isSuppressed,
      transferred: effect.parent?.documentName === "Item",
      canEdit: effect.canUserModify(game.user, "update")
    }));
    context.itemsByGroup = {};
    for (const [group, types] of Object.entries(TRUDVANG.actorItemGroups)) {
      context.itemsByGroup[group] = this.actor.items.filter(item => types.includes(item.type)).sort((a, b) => a.name.localeCompare(b.name));
    }
    for (const item of [...(context.itemsByGroup.weapons ?? []), ...(context.itemsByGroup.protection ?? []), ...(context.itemsByGroup.equipment ?? [])]) {
      item._hoverTitle = this._getItemHoverTitle(item);
      item._damageText = this._getItemDamageText(item);
      item._compactDetail = this._getItemCompactDetail(item);
      item._inspection = prepareEquipmentInspection(item, this.actor);
      item._shortTitle = item._inspection?.shortTitle || item._compactDetail;
      item._inspectionModified = Boolean(item._inspection?.modified);
    }
    context.combatItems = [...(context.itemsByGroup.weapons ?? []), ...(context.itemsByGroup.protection ?? []).filter(item => item.type === "shield")]
      .map(item => {
        const weaponActions = this.actor.getWeaponActionState(item);
        return {item, readied: Boolean(item.system.equipped), hoverTitle: item._hoverTitle, damageText: item._damageText, weaponActions, canUseAction: weaponActions.current > 0, depleted: weaponActions.current <= 0};
      });
    context.naturalWeapon = this.actor.humanoidNaturalWeapon;
    context.enriched = {
      notes: await TextEditorImpl.enrichHTML(this.actor.system.notes || "", {async: true, secrets: this.actor.isOwner}),
      appearance: await TextEditorImpl.enrichHTML(this.actor.system.appearance || "", {async: true, secrets: this.actor.isOwner}),
      history: await TextEditorImpl.enrichHTML(this.actor.system.history || "", {async: true, secrets: this.actor.isOwner}),
      description: await TextEditorImpl.enrichHTML(this.actor.system.description || "", {async: true, secrets: this.actor.isOwner})
    };
    context.totalWeight = Math.round(this.actor.items.filter(item => ["weapon", "armor", "shield", "gear", "potion"].includes(item.type)).reduce((sum, item) => sum + Number(item.system.weight || 0) * Number(item.system.quantity || 1), 0) * 100) / 100;
    context.creationRemaining = Number(this.actor.system.experience?.creationTotal || 0) - Number(this.actor.system.buildCost || 0);
    context.creationOverBudget = context.creationRemaining < 0;
    context.creationCosts = this.actor.calculateCreationCosts();
    context.traitRows = Object.entries(context.config.traits).map(([key, label]) => {
      const baseValue = Number(this.actor.system.traits?.[key] || 0);
      const value = this.actor.getTraitValue(key);
      const choices = TRUDVANG.traitChoices;
      const index = choices.indexOf(baseValue);
      const previous = choices[index - 1];
      const next = choices[index + 1];
      return {
        key, label, value, baseValue, modified: value !== baseValue,
        tooltip: game.i18n.format(`TRUDVANG.TraitBenefit.${key}`, {value: signed(value), inverse: signed(-value)}),
        decreaseTitle: previous === undefined ? game.i18n.localize("TRUDVANG.Warning.TraitLimit") : game.i18n.format("TRUDVANG.Cost.Refund", {cost: (baseValue - previous) * 15}),
        increaseTitle: next === undefined ? game.i18n.localize("TRUDVANG.Warning.TraitLimit") : game.i18n.format("TRUDVANG.Cost.Increase", {cost: (next - baseValue) * 15}),
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
      const separateHands = weaponUsesSeparateHands({type: "weapon", system: {combatSpecialty: entry.id}});
      const offHandLevel = separateHands ? Number(existing?.system.offHandLevel || 0) : 0;
      const offHandBreakdown = separateHands ? this.actor.getAbilityBreakdown(item, {hand: "offHand"}) : null;
      return {
        catalogId: entry.id, item, level, breakdown, separateHands, offHandLevel, offHandBreakdown,
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
        offHandDecreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: offHandLevel ? this.actor.getKnowledgeLevelCost(item, offHandLevel) : 0}),
        offHandIncreaseTitle: increaseTitle(this.actor.getKnowledgeLevelCost(item, offHandLevel + 1), skillKey),
        offHandNextCost: this.actor.getKnowledgeLevelCost(item, offHandLevel + 1),
        offHandCanDecrease: offHandLevel > 0,
        offHandCanIncrease: offHandLevel < 5 && this.actor.canChooseCatalogKnowledge(entry.id),
        exists: Boolean(existing)
      };
    };
    context.skillTrees = Object.entries(context.config.skills).map(([key, label]) => {
      const skill = this.actor.system.skills[key];
      const baseLevel = Number(skill.value || 1);
      const level = this.actor.getSkillValue(key);
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
      // Catalog-backed items always render through their tree node, never as orphans.
      const knownCatalogIds = new Set(Object.values(TRUDVANG.knowledgeTree).flatMap(disciplines => [disciplines.map(d => d.id), ...disciplines.map(d => d.specialties.map(s => s.id))].flat()));
      return {
        key, label, skill, level, baseLevel, modified: level !== baseLevel,
        description: game.i18n.localize(TRUDVANG.skillDescriptions[key]),
        isCore: Boolean(TRUDVANG.archetypes[this.actor.system.details?.archetype]?.core.includes(key)),
        refundCost: baseLevel,
        nextCost: baseLevel + 1,
        decreaseTitle: game.i18n.format("TRUDVANG.Cost.Refund", {cost: baseLevel}),
        increaseTitle: increaseTitle(baseLevel + 1, key),
        canDecrease: baseLevel > 1,
        canIncrease: baseLevel < 10,
        disciplines: disciplineNodes,
        unassigned: abilities.filter(item => !catalogItemIds.has(item.id) && !knownCatalogIds.has(item.system.catalogId)).map(decorate)
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

  async _onRender(context, options) {
    await super._onRender(context, options);
    const root = this.element;
    root.querySelectorAll("details[data-tree-key]").forEach(element => {
      element.addEventListener("toggle", () => {
        this._treeState ??= new Map();
        this._treeState.set(element.dataset.treeKey, element.open);
      });
    });
    root.querySelectorAll("input[data-item-field]").forEach(input => {
      input.addEventListener("change", async event => {
        const container = event.currentTarget.closest("[data-item-id]");
        const item = container && this.actor.items.get(container.dataset.itemId);
        if (item) await item.update({[`system.${event.currentTarget.dataset.itemField}`]: Number(event.currentTarget.value) || 0});
      });
    });
    this._activateTabs(root);
    this._restoreViewState(root);
  }

  _activateTabs(root) {
    const nav = root.querySelector(".sheet-tabs");
    if (!nav) return;
    this._activeTab ??= nav.querySelector("[data-tab]")?.dataset.tab ?? "summary";
    const apply = () => {
      nav.querySelectorAll("[data-tab]").forEach(link => link.classList.toggle("active", link.dataset.tab === this._activeTab));
      root.querySelectorAll(".sheet-body > .tab[data-tab]").forEach(panel => {
        panel.classList.toggle("active", panel.dataset.tab === this._activeTab);
        panel.style.display = panel.dataset.tab === this._activeTab ? "" : "none";
      });
    };
    apply();
    nav.addEventListener("click", event => {
      const link = event.target.closest("[data-tab]");
      if (!link || !nav.contains(link)) return;
      event.preventDefault();
      this._activeTab = link.dataset.tab;
      apply();
    });
  }

  static async #onAction(event, target) {
    event.preventDefault();
    event.stopPropagation();
    const action = target.dataset.action;
    const root = target.closest("form") ?? this.element;
    const rerenderingActions = new Set([
      "adjust-trait", "adjust-skill", "adjust-item-level", "adjust-catalog-knowledge",
      "toggle-creation-mode", "confirm-advancement", "cancel-advancement", "item-delete",
      "item-equip", "item-ready", "item-create", "show-catalog-detail", "effect-add", "effect-toggle", "effect-delete"
    ]);
    if (rerenderingActions.has(action)) this._captureViewState(root);
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const catalogId = target.dataset.catalogId || target.closest("[data-catalog-id]")?.dataset.catalogId;
    const item = itemId ? this.actor.items.get(itemId) : null;
    const effect = target.dataset.effectUuid ? foundry.utils.fromUuidSync(target.dataset.effectUuid) : null;
    switch (action) {
      case "roll-skill": return this.actor.rollSkill(target.dataset.skill);
      case "show-skill-detail": return this._showDetail(game.i18n.localize(TRUDVANG.skills[target.dataset.skill]), game.i18n.localize(TRUDVANG.skillDescriptions[target.dataset.skill]));
      case "roll-trait": return this.actor.rollTrait(target.dataset.trait);
      case "advance-skill": return this.actor.advanceSkill(target.dataset.skill);
      case "adjust-trait": return this.actor.adjustTrait(target.dataset.trait, Number(target.dataset.direction));
      case "adjust-skill": return this.actor.adjustSkill(target.dataset.skill, Number(target.dataset.direction));
      case "adjust-item-level": return item ? this.actor.adjustItemLevel(item, Number(target.dataset.direction)) : null;
      case "adjust-catalog-knowledge": return this.actor.adjustCatalogKnowledge(catalogId, Number(target.dataset.direction), target.dataset.hand || "weapon");
      case "roll-catalog": return item && Number(item.system.level || 0) > 0 ? item.roll() : ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.KnowledgeNotLearned"));
      case "show-catalog-detail": return this._openKnowledgeSheet(catalogId);
      case "toggle-creation-mode": return this.actor.toggleCreationMode();
      case "confirm-advancement": return this.actor.confirmAdvancements();
      case "cancel-advancement": return this.actor.cancelAdvancements();
      case "roll-initiative": return this.actor.rollInitiativeTrudvang();
      case "rest-for-night": return this.actor.restForNight();
      case "calm-fear": return this.actor.calmFear();
      case "roll-survival-rounds": return this.actor.rollSurvivalRounds();
      case "inspect-global-stat": return showInspectionDialog(prepareActorStatInspection(this.actor, target.dataset.stat, TRUDVANG));
      case "reset-combat": return this.actor.resetCombatPoints();
      case "movement-action": return this.actor.rollCombatMovement();
      case "item-roll": return item?.roll();
      case "item-parry": return item ? this.actor.rollWeaponParry(item) : null;
      case "item-damage": return this.actor.rollDamage(item);
      case "item-advance": return item ? this.actor.advanceItem(item) : null;
      case "item-edit": return item?.sheet.render({force: true});
      case "inspect-item": return item ? showInspectionDialog(prepareEquipmentInspection(item, this.actor)) : null;
      case "item-delete": return this._deleteItem(item);
      case "item-equip": return item?.update({"system.equipped": !item.system.equipped});
      case "item-ready": return item ? this.actor.toggleReadiedItem(item) : null;
      case "natural-attack": return this.actor.rollNaturalCombatAction("attack");
      case "natural-parry": return this.actor.rollNaturalCombatAction("parry");
      case "natural-damage": return this.actor.rollNaturalDamage();
      case "dodge-action": return this.actor.rollDodge();
      case "wrestling-action": return this.actor.rollWrestlingAction(target.dataset.kind || "grapple");
      case "item-create": return this._createItem(target.dataset.type);
      case "add-tablet": return this._openTabletPicker();
      case "toggle-tree": {
        const details = target.closest("details");
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
      case "effect-add": return this.actor.createBlankEffect();
      case "effect-edit": return effect?.sheet.render({force: true});
      case "effect-toggle": return effect?.update({disabled: !effect.disabled});
      case "effect-delete": return effect?.delete();
      default: return null;
    }
  }

  static async #onSubmit(event, form, formData) {
    const changes = foundry.utils.expandObject(formData.object);
    const editedPath = event.target?.name || "";
    const sourceResources = this.actor._source.system.resources || {};
    const maxModifiers = {body: "bodyMax", combat: "combatMax", vitner: "vitnerMax", divinity: "divinityMax"};

    // The sheet shows prepared values, including temporary effects. Preserve the
    // stored base on unrelated submissions, or remove the modifier from an edited
    // value before persisting it.
    for (const [key, source] of Object.entries(sourceResources)) {
      const valuePath = `system.resources.${key}.value`;
      const maxPath = `system.resources.${key}.max`;
      if (foundry.utils.hasProperty(changes, valuePath)) {
        const shown = Number(foundry.utils.getProperty(changes, valuePath) || 0);
        const modifier = Number(this.actor.system.modifiers?.[`${key}Value`] || 0);
        foundry.utils.setProperty(changes, valuePath, editedPath === valuePath ? Math.max(0, shown - modifier) : source.value);
      }
      if (foundry.utils.hasProperty(changes, maxPath)) {
        const shown = Number(foundry.utils.getProperty(changes, maxPath) || 0);
        const modifier = Number(this.actor.system.modifiers?.[maxModifiers[key]] || 0);
        foundry.utils.setProperty(changes, maxPath, editedPath === maxPath ? Math.max(0, shown - modifier) : source.max);
      }
    }
    const previousOrigins = {
      race: this.actor.system.details?.race,
      culture: this.actor.system.details?.culture,
      nativeLanguage: this.actor.system.details?.nativeLanguage
    };
    await this.actor.update(changes);
    if (!this.actor.system.experience?.creationMode) return;
    const originsChanged = ["race", "culture", "nativeLanguage"].some(key => this.actor.system.details?.[key] !== previousOrigins[key]);
    if (originsChanged) {
      await this.actor.alignCreationOrigins();
      await this.actor.syncCreationDefaults();
    }
    if (this.actor.system.details?.race !== previousOrigins.race) {
      const allowed = this.actor.allowedReligionIds;
      if (allowed.length === 1 && !this.actor.system.details.religion) await this.actor.update({"system.details.religion": allowed[0]});
      else if (!allowed.includes(this.actor.system.details.religion)) await this.actor.update({"system.details.religion": ""});
    }
  }

  /** @override — délègue au parent V2 (le diagnostic a été retiré en 0.5.4) */
  async _onDrop(event) {
    return super._onDrop(event);
  }

  /** @override — ActorSheetV2 passes un Item document résolu ; on gère aussi les données brutes par sécurité. */
  async _onDropItem(event, item) {
    let itemDoc = item;
    // Défensif : si ce n'est pas déjà un Document Foundry (drop brut / compat), le résoudre.
    if (!itemDoc?.documentName) {
      try {
        const ItemClass = foundry.utils.getDocumentClass("Item");
        // fromDropData existe sur ItemClass ou ItemClass.implementation selon version
        const resolved = ItemClass.implementation?.fromDropData
          ? await ItemClass.implementation.fromDropData(item)
          : await ItemClass.fromDropData(item);
        if (!resolved) throw new Error("fromDropData returned null");
        itemDoc = resolved;
      } catch (err) {
        console.error("Trudvang | _onDropItem: impossible de résoudre le drop", err, item);
        return false;
      }
    }
    // Tri interne si l'item appartient déjà à cet acteur
    if (this.actor.items.has(itemDoc.id)) {
      try {
        return await this._onSortItem(event, itemDoc);
      } catch (err) {
        console.error("Trudvang | _onSortItem failed", err);
        // fallback : on ne crée pas de doublon
        return false;
      }
    }
    const itemData = itemDoc.toObject();
    return this._handleDrop(itemData);
  }

  /** Tablettes : via catalogue ; sinon création standard avec reset niveau ability hors création. */
  async _handleDrop(itemData) {
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
    return this.actor.createEmbeddedDocuments("Item", prepared);
  }

  // Compat : l'ancien #onDrop statique reste mais délègue (évite de casser d'éventuels appels)
  static async #onDrop(event, itemData) {
    // Appelé via .call(this, ...) avec this = instance — on délègue à l'instance
    if (this?._handleDrop) return this._handleDrop(itemData);
    // Fallback statique (ne devrait pas arriver)
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
    return this.actor.createEmbeddedDocuments("Item", prepared);
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

  _getSpecialtyLevel(id) {
    return Number(this.actor.findKnowledgeItem(id)?.system.level || 0);
  }

  _getItemHoverTitle(item) {
    const isEN = game.i18n.lang === "en";
    const aaLab = isEN ? "WA" : "AA";
    const miLab = isEN ? "IM" : "MI";
    const mmLab = "MM";
    const vpLab = isEN ? "PV" : "VP";
    const viLab = isEN ? "BV" : "VI";
    const cpLab = "CP";
    const svLab = isEN ? "SV" : "VC";
    const signed = value => Number(value) > 0 ? `+${value}` : `${value}`;
    if (item.type === "weapon") {
      const {current: AA, max: maxAA} = this.actor.getWeaponActionState(item);
      let MI = Number(item.system.initiativeModifier || 0);
      const VI = Number(item.system.breach?.value ?? 0);
      const VP = Math.ceil(Math.max(0, VI) / 10);
      const CP = resolveEquipment({item, actor: this.actor, context: {hand: item.system.hand}}).characteristics.combatPointBonus.value;
      const dmg = this._getItemDamageText(item);
      const actionModifier = resolveCombatActionModifier({item, actor: this.actor, context: {hand: item.system.hand}});
      const actionText = actionModifier.steps.length ? ` ${svLab}:${signed(actionModifier.value)} — ${actionModifier.steps.map(step => game.i18n.format(step.explanationKey, step.explanationData)).join(" ")}` : "";
      return `${aaLab}:${AA}/${maxAA} ${miLab}:${signed(MI)} ${vpLab}:${VP}/${VI} ${cpLab}:${CP} ${dmg}${actionText}`;
    }
    if (item.type === "shield") {
      const {current: AA, max: maxAA} = this.actor.getWeaponActionState(item);
      const MI = Number(item.system.initiativeModifier || 0);
      const VI = Number(item.system.breach?.value ?? 0);
      const VP = Math.ceil(Math.max(0, VI) / 10);
      const CP = resolveEquipment({item, actor: this.actor, context: {hand: "shield"}}).characteristics.combatPointBonus.value;
      const actionModifier = resolveCombatActionModifier({item, actor: this.actor});
      const explanation = actionModifier.steps
        .map(step => game.i18n.format(step.explanationKey, step.explanationData))
        .join(" ");
      const dmg = this._getItemDamageText(item);
      return `${aaLab}:${AA}/${maxAA} ${miLab}:${signed(MI)} ${vpLab}:${VP}/${VI} ${cpLab}:${CP} ${svLab}:${signed(actionModifier.value)} ${dmg} — ${explanation}`;
    }
    if (item.type === "armor") {
      const profile = resolveArmorProfile({item, actor: this.actor});
      const MI = profile.initiativeModifier.value;
      const MM = profile.movementModifier.value;
      const VI = Number(item.system.breach?.value ?? 0);
      const VP = Math.ceil(Math.max(0, VI) / 10);
      return `${miLab}:${signed(MI)} ${mmLab}:${signed(MM)} ${vpLab}:${VP}/${VI}`;
    }
    return "";
  }

  _getItemDamageText(item) {
    const isEN = game.i18n.lang === "en";
    const openShort = isEN ? "O" : "JO";
    const signed = value => Number(value) > 0 ? `+${value}` : `${value}`;
    if (["weapon", "shield"].includes(item.type)) {
      const damage = resolveDamage({item, actor: this.actor});
      const open = damage.openRoll.value;
      const bonus = damage.modifier.value;
      return `${damage.formula}${open ? `${openShort}${open}` : ""}${bonus ? signed(bonus) : ""}`;
    }
    return "";
  }

  _getItemCompactDetail(item) {
    const isEN = game.i18n.lang === "en";
    const vp = Math.ceil(Math.max(0, Number(item.system.breach?.value ?? 0)) / 10);
    if (["weapon", "shield"].includes(item.type)) {
      const {current: actions, max: maxActions} = this.actor.getWeaponActionState(item);
      const bonus = resolveEquipment({item, actor: this.actor, context: {hand: item.system.hand}}).characteristics.combatPointBonus.value;
      return `${isEN ? "WA" : "AA"}:${actions}/${maxActions} CP:${bonus >= 0 ? "+" : ""}${bonus} ${isEN ? "PV" : "VP"}:${vp} ${this._getItemDamageText(item)}`;
    }
    if (item.type === "armor") return `${isEN ? "PV" : "VP"}:${vp}`;
    return "";
  }

  _showDetail(title, description) {
    const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
    return DialogClass.wait({
      window: {title},
      content: `<div class="trudvang detail-dialog"><p>${escapeHtml(description)}</p></div>`,
      buttons: [{action: "close", icon: "fas fa-check", label: game.i18n.localize("TRUDVANG.Action.Close")}],
      modal: false,
      rejectClose: false
    });
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
    if (existing) return existing.sheet.render({force: true});
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
    return item?.sheet.render({force: true});
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
    const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
    const options = tablets.map(tablet => `<option value="${tablet.id}">${escapeHtml(tabletName(tablet))}</option>`).join("");
    return DialogClass.prompt({
      window: {title: game.i18n.localize("TRUDVANG.Dialog.AddTablet")},
      content: `<div class="form-group"><label>${game.i18n.localize("TYPES.Item.tablet")}</label><select name="tabletId">${options}</select></div>`,
      ok: {
        icon: "fas fa-plus",
        label: game.i18n.localize("TRUDVANG.Action.Add"),
        callback: (event, button, dialog) => this.actor.addTabletFromCatalog(button.form?.elements.tabletId?.value)
      },
      cancel: {label: game.i18n.localize("TRUDVANG.Action.Cancel")},
      modal: false,
      rejectClose: false
    });
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
    item[0]?.sheet.render({force: true});
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
}

export class TrudvangCharacterSheet extends TrudvangActorSheet {
  static PARTS = {
    main: {template: "systems/trudvang-chronicles/templates/actor/character-sheet.hbs"}
  };

  static DEFAULT_OPTIONS = {
    position: {width: 780, height: 740},
    classes: ["character-sheet"]
  };

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
  static PARTS = {
    main: {template: "systems/trudvang-chronicles/templates/actor/npc-sheet.hbs"}
  };

  static DEFAULT_OPTIONS = {
    position: {width: 580, height: 650},
    classes: ["npc-sheet"]
  };
}
