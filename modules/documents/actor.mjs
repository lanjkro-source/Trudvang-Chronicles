import { TRUDVANG } from "../config.mjs";
import { combatPointDialog, initiativeDialog, magicDialog, modifierDialog, openD10, rollDamage, rollUnder, traitRollDialog } from "../dice.mjs";
import { escapeHtml, renderTemplate } from "../helpers.mjs";
import { powerItemData, TABLET_BY_ID, TABLET_CATALOG, tabletItemData } from "../tablet-catalog.mjs";
import { isIncapacitated, isImmobilized } from "../effects.mjs";
import { resolveArmorProfile, resolveCombatActionModifier, resolveEquipment, resolveThrowingRange } from "../rules/equipment-resolver.mjs";
import { actorParticipatesInCombat, canThrowWeapon, combatPoolsAreFull, isThrowingWeapon, normalizeCombatAllocation, readiedHandConflicts, resolveCombatPools, suggestCombatAllocation, weaponForUsage } from "../rules/combat-pool-resolver.mjs";
import { resolveFearStatus, resolveInsanityState } from "../rules/fear-resolver.mjs";

const BaseActor = foundry.documents.Actor;
const SEPARATE_HAND_SPECIALTIES = new Set(["oneHandedLightWeapons", "oneHandedHeavyWeapons", "throwingWeapons"]);

function getDamageStatus(bodyMax, bodyCurrent) {
  const max = Math.max(1, Number(bodyMax || 1));
  const current = Number(bodyCurrent || 0);
  const taken = Math.max(0, max - current);
  const baseRange = Math.floor(max / 4);
  const remainder = max % 4;
  const thresholds = Array.from({length: 4}, (_, index) => baseRange + (index < remainder ? 1 : 0))
    .reduce((ranges, range) => [...ranges, range + (ranges.at(-1) || 0)], []);
  if (taken === 0) return {taken, penalty: 0, level: "unhurt", thresholds};
  // A character at or below zero Body Points is dying. The sheet keeps its
  // meter bounded, while this prepared value preserves the negative total.
  if (current <= 0) return {taken, penalty: -7, level: "dying", thresholds};
  const stage = Math.min(3, thresholds.findIndex(threshold => taken <= threshold));
  const levels = ["light", "injured", "serious", "critical"];
  const penalties = [0, -1, -3, -7];
  return {taken, penalty: penalties[stage], level: levels[stage], thresholds};
}

function getHealthRecovery(constitution) {
  if (constitution >= 4) return {amount: 4, days: 1};
  if (constitution >= 2) return {amount: 3, days: 1};
  if (constitution >= 1) return {amount: 2, days: 1};
  if (constitution <= -2) return {amount: 1, days: 2};
  return {amount: 1, days: 1};
}

export class TrudvangActor extends BaseActor {
  get isInActiveCombat() {
    return actorParticipatesInCombat(this, game.combat);
  }

  async _preUpdate(changed, options, userId) {
    await super._preUpdate(changed, options, userId);
    const fear = changed["system.resources.fear.value"] ?? changed.system?.resources?.fear?.value;
    if (fear !== undefined) {
      const insane = resolveInsanityState({fear, insane: this._source.system.fearInsane});
      if (insane !== Boolean(this._source.system.fearInsane)) changed["system.fearInsane"] = insane;
    }
    const body = changed["system.resources.body.value"] ?? changed.system?.resources?.body?.value;
    if (body !== undefined && Number(body) > 0) changed["system.survivalRounds"] = -1;
  }

  /** Keep Body Points unbounded below when they are changed from a token bar. */
  async modifyTokenAttribute(attribute, value, isDelta = false, isBar = true) {
    if (attribute !== "resources.body" || !isBar) return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
    const body = this.system.resources.body;
    const current = Number(body.value || 0);
    const update = isDelta ? current + Number(value || 0) : Number(value || 0);
    if (update === current) return this;
    const updates = {"system.resources.body.value": update};
    const allowed = Hooks.call("modifyTokenAttribute", {attribute, value, isDelta, isBar}, updates, this);
    return allowed !== false ? this.update(updates) : this;
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    const system = this.system;
    if (!system.resources) return;

    if (this.type === "character") {
      const race = TRUDVANG.races[system.details?.race] ?? TRUDVANG.races.human;
      system.resources.body.max = Math.max(1, race.body + this.getTraitValue("constitution") + this.getTraitValue("strength") + Number(system.modifiers.bodyMax || 0));
      system.movement.current = Math.max(0, race.movement + this.getTraitValue("dexterity") + this.equippedMovementModifier + Number(system.modifiers.movement || 0));
      system.persistenceInWild = this.calculatePersistenceInWild();
    } else {
      system.resources.body.max = Math.max(1, Number(system.resources.body.max || 1) + Number(system.modifiers.bodyMax || 0));
      system.movement.current = Math.max(0, Number(system.movement.base || 0) + Number(system.modifiers.movement || 0));
    }
    if (isImmobilized(this)) system.movement.current = 0;

    if (this.type === "character") {
      const vitnerType = this.selectedVitnerType;
      const callVitner = Number(this.findKnowledgeItem("callVitner")?.system.level || 0);
      const vitnerHabit = Number(this.findKnowledgeItem("vitnerHabit")?.system.level || 0);
      system.resources.vitner.max = vitnerType && callVitner
        ? this.getSkillValue("vitnerCraft") + (5 * callVitner) + (vitnerType.capacityPerLevel * vitnerType.level) + (10 * vitnerHabit) + Number(system.modifiers.vitnerMax || 0)
        : 0;
      const religion = this.selectedReligion;
      const divinePower = Number(this.findKnowledgeItem("divinePower")?.system.level || 0);
      const faithful = Number(this.findKnowledgeItem("faithful")?.system.level || 0);
      const powerful = Number(this.findKnowledgeItem("powerful")?.system.level || 0);
      system.resources.divinity.max = religion && divinePower
        ? this.getSkillValue("faith") + (3 * divinePower) + (7 * faithful) + (7 * powerful) + Number(system.modifiers.divinityMax || 0)
        : 0;
    }

    const combatPools = resolveCombatPools({actor: this});
    for (const pool of combatPools.pools) {
      system.combatPools[pool.id].spent = pool.spent;
      system.combatPools[pool.id].max = pool.max;
      system.combatPools[pool.id].current = pool.current;
    }
    system.resources.combat.max = combatPools.totalMax;
    system.resources.combat.value = combatPools.totalTrackerCurrent;
    system.resources.combat.current = combatPools.totalTrackerCurrent;

    // Resource values are persisted as their unmodified base. Active Effects alter only
    // the prepared value/current, so an expiring effect never destroys spent points.
    for (const [key, resource] of Object.entries(system.resources)) {
      if (key === "combat") continue;
      const modifier = Number(system.modifiers?.[`${key}Value`] || 0);
      const value = Number(resource.value || 0) + modifier;
      const current = key === "body"
        ? Math.min(Number(resource.max || 0), value)
        : key === "fear"
          ? Math.max(0, value)
          : Math.max(0, Math.min(Number(resource.max || 0), value));
      resource.current = current;
      resource.value = current;
    }

    system.damage = getDamageStatus(system.resources.body.max, system.resources.body.current);
    system.healthRecovery = getHealthRecovery(this.getTraitValue("constitution"));
    const fear = Number(system.resources.fear.current || 0);
    const fearStatus = resolveFearStatus({fear, insane: system.fearInsane});
    system.fearFactorModifier = -this.getTraitValue("psyche") + Number(system.modifiers.fearFactor || 0);
    system.fearPenalty = fearStatus.penalty;
    const beInit = Number(this.findKnowledgeItem("battleExperience")?.system.level || 0);
    const crInit = Number(this.findKnowledgeItem("combatReaction")?.system.level || 0) * 2;
    system.initiative.current = Number(system.initiative.base || 0) + this.getTraitValue("dexterity") + this.equippedInitiativeModifier + system.damage.penalty + system.fearPenalty + beInit + crInit + Number(system.modifiers.rolls?.initiative || 0);
    system.protection = Number(system.details?.naturalArmor || 0) + this.equippedProtection + Number(system.modifiers.protection || 0);
    system.armorVCPenalty = -this.equippedItems.filter(item => item.type === "armor")
      .reduce((sum, item) => sum + resolveArmorProfile({item, actor: this}).combatActionModifier.value, 0);
    system.buildCost = this.calculateBuildCost();
  }

  getTraitValue(traitKey) {
    return Number(this.system.effective?.traits?.[traitKey] ?? this.system.traits?.[traitKey] ?? 0);
  }

  getSkillValue(skillKey) {
    const prepared = this.system.effective?.skills?.[skillKey];
    if (prepared !== undefined) return Number(prepared || 0);
    const skill = this.system.skills?.[skillKey];
    return Number(skill?.value || 0) + Number(skill?.bonus || 0);
  }

  getRollModifier({kind = "", skillKey = "", traitKey = "", movement = false} = {}) {
    const modifiers = this.system.modifiers?.rolls || {};
    let total = Number(modifiers.allActions || 0);
    const combatKinds = new Set(["attack", "parry", "ability", "magic"]);
    if (combatKinds.has(kind) || (this.isInCombatActive() && kind === "skill")) total += Number(modifiers.combatActions || 0);
    if (movement) total += Number(modifiers.movementActions || 0);
    if (["attack", "parry", "magic"].includes(kind)) total += Number(modifiers[kind] || 0);
    if (skillKey) total += Number(modifiers.skills?.[skillKey] || 0);
    if (traitKey) total += Number(modifiers.traits?.[traitKey] || 0);
    return total;
  }

  canPerformAction({movement = false} = {}) {
    if (isIncapacitated(this)) return false;
    if (movement && isImmobilized(this)) return false;
    return true;
  }

  warnCannotAct() {
    return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CannotAct"));
  }

  get selectedVitnerType() {
    for (const [id, config] of Object.entries(TRUDVANG.vitnerTypes)) {
      const level = Number(this.findKnowledgeItem(id)?.system.level || 0);
      if (level > 0) return {id, level, ...config};
    }
    return null;
  }

  get selectedReligion() {
    for (const [id, religion] of Object.entries(TRUDVANG.religions)) {
      if (Number(this.findKnowledgeItem(religion.specialty)?.system.level || 0) > 0) return {id, ...religion};
    }
    const configured = this.system.details?.religion;
    if (TRUDVANG.religions[configured]) return {id: configured, ...TRUDVANG.religions[configured]};
    return null;
  }

  get allowedReligionIds() {
    return TRUDVANG.raceReligions[this.system.details?.race] ?? [];
  }

  getReligionForSpecialty(catalogId) {
    const found = Object.entries(TRUDVANG.religions).find(([, religion]) => religion.specialty === catalogId);
    return found ? {id: found[0], ...found[1]} : null;
  }

  canChooseCatalogKnowledge(catalogId) {
    if (TRUDVANG.vitnerTypes[catalogId]) {
      const selected = this.selectedVitnerType;
      return !selected || selected.id === catalogId;
    }
    const religion = this.getReligionForSpecialty(catalogId);
    if (!religion) return true;
    if (!this.allowedReligionIds.includes(religion.id)) return false;
    const selected = this.selectedReligion;
    return !selected || selected.id === religion.id;
  }

  get equippedItems() {
    return this.items.filter(item => item.system.equipped);
  }

  calculatePersistenceInWild() {
    const survival = this.findKnowledgeItem("survival");
    const weathered = this.findKnowledgeItem("weathered");
    return Math.max(0, 10 + this.getTraitValue("psyche") + Number(survival?.system.level || 0) + (2 * Number(weathered?.system.level || 0)));
  }

  get equippedInitiativeModifier() {
    // Weapons and shields are conditional choices in the initiative dialog; armor is permanent.
    return this.equippedItems.filter(item => item.type === "armor").reduce((sum, item) => sum + resolveArmorProfile({item, actor: this}).initiativeModifier.value, 0);
  }

  getTabletCompatibility(tablet) {
    if (!tablet) return {ok: false, reason: "TRUDVANG.Warning.UnknownTablet"};
    if (this.items.some(item => item.type === "tablet" && (item.system.catalogId === tablet.id || item.getFlag("trudvang-chronicles", "catalogId") === tablet.id))) return {ok: false, reason: "TRUDVANG.Warning.TabletAlreadyKnown"};
    const skillKey = tablet.tabletType === "holy" ? "faith" : "vitnerCraft";
    if (Number(this.system.skills?.[skillKey]?.value || 1) < this.getRequiredSkillValue(1)) return {ok: false, reason: "TRUDVANG.Warning.TabletSkillRequirement"};
    if (tablet.tabletType === "vitner") {
      if (!this.selectedVitnerType) return {ok: false, reason: "TRUDVANG.Warning.VitnerRequired"};
      if (Number(this.findKnowledgeItem("vitnerShaping")?.system.level || 0) < 1) return {ok: false, reason: "TRUDVANG.Warning.TabletKnowledgeRequired"};
    }
    if (tablet.tabletType === "holy") {
      const selected = this.selectedReligion;
      if (!selected) return {ok: false, reason: "TRUDVANG.Warning.ReligionRequired"};
      if (!this.allowedReligionIds.includes(selected.id) || selected.id !== tablet.religion) return {ok: false, reason: "TRUDVANG.Warning.TabletReligionMismatch"};
      if (Number(this.findKnowledgeItem(selected.specialty)?.system.level || 0) < 1) return {ok: false, reason: "TRUDVANG.Warning.TabletKnowledgeRequired"};
    }
    return {ok: true, reason: ""};
  }

  get compatibleTablets() {
    return TABLET_CATALOG.filter(tablet => this.getTabletCompatibility(tablet).ok);
  }

  async addTabletFromCatalog(catalogId) {
    const tablet = TABLET_BY_ID.get(catalogId);
    const compatibility = this.getTabletCompatibility(tablet);
    if (!compatibility.ok) return ui.notifications.warn(game.i18n.localize(compatibility.reason));
    const documents = [tabletItemData(tablet), ...tablet.powers.map(power => powerItemData(power, tablet))];
    return this.createEmbeddedDocuments("Item", documents);
  }

  get equippedMovementModifier() {
    return this.equippedItems.reduce((sum, item) => sum + (item.type === "armor" ? resolveArmorProfile({item, actor: this}).movementModifier.value : Number(item.system.movementModifier || 0)), 0);
  }

  get equippedProtection() {
    return this.equippedItems.filter(item => item.type === "armor")
      .reduce((sum, item) => sum + resolveArmorProfile({item, actor: this}).protection.value, 0);
  }

  isInCombatActive() {
    if (typeof this.inCombat === "boolean") return this.inCombat;
    const combat = game.combat ?? game.combats?.active;
    if (!combat) return false;
    if (typeof combat.getCombatantByActor === "function") return Boolean(combat.getCombatantByActor(this.id));
    return combat.combatants.some(c => c.actorId === this.id || (c.tokenId && this.getActiveTokens(true, true).some(t => t.id === c.tokenId)));
  }

  calculateBuildCost() {
    return this.calculateCreationCosts().total;
  }

  calculateCreationCosts() {
    if (this.type !== "character") return {traitCost: 0, regular: 0, coreEligible: 0, coreBonusTotal: 0, coreBonusUsed: 0, coreBonusRemaining: 0, total: 0};
    const traitCost = Object.values(this.system.traits || {}).reduce((sum, value) => sum + Number(value || 0) * 15, 0);
    const archetype = TRUDVANG.archetypes[this.system.details?.archetype];
    const coreSkills = new Set(archetype?.core || []);
    let coreEligible = 0;
    let regular = 0;
    for (const [skillKey, skill] of Object.entries(this.system.skills || {})) {
      const value = Math.max(1, Number(skill.value || 1));
      const cost = ((value * (value + 1)) / 2 - 1);
      if (coreSkills.has(skillKey)) coreEligible += cost;
      else regular += cost;
    }
    for (const item of this.items.filter(item => ["ability", "tablet"].includes(item.type))) {
      const levels = [
        {level: Math.max(0, Number(item.system.level || 0)), free: Number(item.system.freeLevels || 0)},
        ...(SEPARATE_HAND_SPECIALTIES.has(item.system.catalogId) ? [{level: Math.max(0, Number(item.system.offHandLevel || 0)), free: 0}] : [])
      ];
      let cost = 0;
      for (const track of levels) {
        const freeLevels = Math.min(track.level, track.free);
        for (let rank = freeLevels + 1; rank <= track.level; rank += 1) cost += this.getKnowledgeLevelCost(item, rank);
      }
      if (coreSkills.has(this.getKnowledgeSkillKey(item))) coreEligible += cost;
      else regular += cost;
    }
    const coreBonusTotal = archetype ? 50 : 0;
    const coreBonusUsed = Math.min(coreBonusTotal, coreEligible);
    return {traitCost, regular, coreEligible, coreBonusTotal, coreBonusUsed, coreBonusRemaining: coreBonusTotal - coreBonusUsed, total: traitCost + regular + coreEligible - coreBonusUsed};
  }

  getCatalogEntry(catalogId) {
    for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
      for (const discipline of disciplines) {
        if (discipline.id === catalogId) return {...discipline, skillKey, kind: "discipline", parentDiscipline: "", rollBonus: 1};
        const specialty = discipline.specialties.find(entry => entry.id === catalogId);
        if (specialty) return {...specialty, skillKey, kind: "specialty", parentDiscipline: discipline.name, parentCatalogId: discipline.id, rollBonus: 2};
      }
    }
    return null;
  }

  findKnowledgeItem(catalogId) {
    const entry = this.getCatalogEntry(catalogId);
    return this.items.find(item => item.type === "ability" && (item.system.catalogId === catalogId
      || (entry && item.system.parentSkill === entry.skillKey && item.system.kind === entry.kind && String(item.name).trim().toLocaleLowerCase() === entry.name.toLocaleLowerCase())));
  }

  catalogText(catalogId, suffix) {
    const key = `TRUDVANG.Content.Ability.${catalogId}.${suffix}`;
    const text = game.i18n.localize(key);
    return text === key ? "" : text;
  }

  getAbilityBreakdown(item, {hand = "weapon"} = {}) {
    const skill = this.getSkillValue(item.system.parentSkill);
    const level = hand === "offHand" && SEPARATE_HAND_SPECIALTIES.has(item.system.catalogId)
      ? Number(item.system.offHandLevel || 0)
      : Number(item.system.level || 0);
    const own = level * Number(item.system.rollBonus || (item.system.kind === "specialty" ? 2 : 1));
    const parent = item.system.kind === "specialty" ? this.findParentDiscipline(item) : null;
    const discipline = parent ? Number(parent.system.level || 0) * Number(parent.system.rollBonus || 1) : 0;
    const modifier = this.getRollModifier({kind: "ability", skillKey: item.system.parentSkill});
    let total = skill + discipline + own + modifier;
    if (this.isInCombatActive() && Number(this.system.armorVCPenalty || 0) > 0) total -= Number(this.system.armorVCPenalty);
    return {skill, discipline, specialty: item.system.kind === "specialty" ? own : 0, own, modifier, total};
  }

  async alignCreationOrigins() {
    if (this.type !== "character") return false;
    const details = this.system.details ?? {};
    const allowedCultures = TRUDVANG.raceCultures[details.race] ?? Object.keys(TRUDVANG.cultures);
    const changes = {};
    if (!allowedCultures.includes(details.culture)) changes["system.details.culture"] = allowedCultures[0];
    const cultureId = changes["system.details.culture"] ?? details.culture;
    const allowedLanguages = TRUDVANG.cultureLanguages[cultureId] ?? Object.keys(TRUDVANG.nativeLanguages);
    if (!allowedLanguages.includes(details.nativeLanguage)) changes["system.details.nativeLanguage"] = allowedLanguages[0];
    if (Object.keys(changes).length) {
      await this.update(changes);
      await this.syncCreationDefaults();
      return true;
    }
    return false;
  }

  async syncCreationDefaults() {
    if (this.type !== "character") return;
    const allowedLanguages = TRUDVANG.cultureLanguages[this.system.details?.culture] ?? Object.keys(TRUDVANG.nativeLanguages);
    const current = this.system.details?.nativeLanguage;
    const language = allowedLanguages.includes(current) ? current : allowedLanguages[0] ?? "rona";
    const defaults = [
      {catalogId: "cultureKnowledge", level: 1},
      {catalogId: "language", level: 1},
      {catalogId: "motherTongue", level: 3, suffix: game.i18n.localize(TRUDVANG.nativeLanguages[language])}
    ];
    for (const definition of defaults) {
      const entry = this.getCatalogEntry(definition.catalogId);
      const existing = this.findKnowledgeItem(definition.catalogId);
      const name = definition.suffix ? `${game.i18n.localize(entry.label)} (${definition.suffix})` : game.i18n.localize(entry.label);
      if (!existing) {
        await this.createEmbeddedDocuments("Item", [{name, type: "ability", system: {catalogId: entry.id, kind: entry.kind, parentSkill: entry.skillKey, parentDiscipline: entry.parentDiscipline, level: definition.level, freeLevels: definition.level, rollBonus: entry.rollBonus, description: this.catalogText(entry.id, "Description"), summary: this.catalogText(entry.id, "Summary")}}]);
      } else {
        const changes = {name, "system.catalogId": entry.id, "system.freeLevels": definition.level};
        if (Number(existing.system.level || 0) < definition.level) changes["system.level"] = definition.level;
        await existing.update(changes);
      }
    }
  }

  getKnowledgeCostTrait(item) {
    if (item.system.costTrait) return item.system.costTrait;
    const catalogId = item.system.catalogId;
    const catalogEntry = catalogId ? this.getCatalogEntry(catalogId) : null;
    const skill = item.type === "tablet"
      ? (item.system.tabletType === "holy" ? "faith" : "vitnerCraft")
      : item.system.parentSkill;
    if (skill === "agility") return "dexterity";
    if (["knowledge", "faith", "vitnerCraft"].includes(skill)) return "intelligence";
    if (skill === "entertainment") return "charisma";
    if (catalogId === "tradesman" || catalogEntry?.parentCatalogId === "tradesman") return "charisma";
    if (["findingSpotting", "thiefSigns", "tracker", "weatherman", "wildernessSigns", "orienteeringCartography", "navigation", "extractsPotions"].includes(catalogId)) return "perception";
    if (["pathwalker", "terrainExperience", "weathered"].includes(catalogId)) return "psyche";
    const name = `${item.name || ""} ${item.system.parentDiscipline || ""}`.replace(/&/g, "and").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z]/g, "");
    if (name.includes("tradesman")) return "charisma";
    if (["findingandspotting", "thiefsigns", "tracker", "weatherman", "wildernesssigns", "orienteeringandcartography", "navigation", "extractsandpotions"].some(value => name.includes(value))) return "perception";
    if (["pathwalker", "terrainexperience", "weathered"].some(value => name.includes(value))) return "psyche";
    return null;
  }

  getKnowledgeLevelCost(item, level) {
    const base = Number(TRUDVANG.disciplineCosts[level] || 0);
    const trait = this.getKnowledgeCostTrait(item);
    return Math.max(0, base - Number(this.system.traits?.[trait] || 0));
  }

  getKnowledgeSkillKey(item) {
    return item.type === "tablet"
      ? (item.system.tabletType === "holy" ? "faith" : "vitnerCraft")
      : item.system.parentSkill;
  }

  getRequiredSkillValue(level) {
    return ({1: 4, 2: 7, 3: 7, 4: 10, 5: 10})[level] ?? 10;
  }

  findParentDiscipline(item) {
    const entry = item.system.catalogId ? this.getCatalogEntry(item.system.catalogId) : null;
    if (entry?.parentCatalogId) return this.findKnowledgeItem(entry.parentCatalogId);
    const wanted = String(item.system.parentDiscipline || "").trim().toLocaleLowerCase();
    return this.items.find(candidate => candidate.type === "ability"
      && candidate.system.kind === "discipline"
      && candidate.system.parentSkill === item.system.parentSkill
      && String(candidate.name || "").trim().toLocaleLowerCase() === wanted);
  }

  canLowerSkill(skillKey, nextValue) {
    return !this.items.some(item => ["ability", "tablet"].includes(item.type)
      && this.getKnowledgeSkillKey(item) === skillKey
      && Math.max(Number(item.system.level || 0), Number(item.system.offHandLevel || 0)) > Number(item.system.freeLevels || 0)
      && this.getRequiredSkillValue(Math.max(Number(item.system.level || 0), Number(item.system.offHandLevel || 0))) > nextValue);
  }

  async adjustTrait(traitKey, direction) {
    if (!this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
    const choices = TRUDVANG.traitChoices;
    const current = Number(this.system.traits?.[traitKey] || 0);
    const index = choices.indexOf(current);
    const next = choices[index + Math.sign(direction)];
    if (next === undefined) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TraitLimit"));
    return this.update({[`system.traits.${traitKey}`]: next});
  }

  async adjustSkill(skillKey, direction) {
    if (!this.system.experience?.creationMode) {
      if (direction < 0) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
      return this.advanceSkill(skillKey);
    }
    const current = Number(this.system.skills?.[skillKey]?.value || 1);
    const next = current + Math.sign(direction);
    if (next < 1 || next > 10) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.SkillLimit"));
    if (next < current && !this.canLowerSkill(skillKey, next)) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.SkillSupportsKnowledge"));
    return this.update({[`system.skills.${skillKey}.value`]: next});
  }

  async adjustItemLevel(item, direction) {
    if (!this.system.experience?.creationMode) {
      if (direction < 0) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
      return this.advanceItem(item);
    }
    if (!["ability", "tablet"].includes(item.type)) return;
    const current = Number(item.system.level ?? 1);
    const next = current + Math.sign(direction);
    const minimum = Number(item.system.freeLevels || 0);
    if (next < Math.max(1, minimum) || next > 5) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.KnowledgeLimit"));
    if (direction > 0) {
      const skillKey = this.getKnowledgeSkillKey(item);
      const requirement = this.getRequiredSkillValue(next);
      if (Number(this.system.skills?.[skillKey]?.value || 1) < requirement) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.SkillRequirement", {sv: requirement}));
      if (item.type === "ability" && item.system.kind === "specialty") {
        const parent = this.findParentDiscipline(item);
        if (!parent || Number(parent.system.level || 0) < 1) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ParentDisciplineRequired"));
      }
    }
    return item.update({"system.level": next});
  }

  async adjustCatalogKnowledge(catalogId, direction, hand = "weapon") {
    const entry = this.getCatalogEntry(catalogId);
    if (!entry) return;
    let item = this.findKnowledgeItem(catalogId);
    const levelField = hand === "offHand" && SEPARATE_HAND_SPECIALTIES.has(catalogId) ? "offHandLevel" : "level";
    const current = Number(item?.system?.[levelField] || 0);
    if (direction < 0) {
      if (!this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
      const minimum = levelField === "level" ? Number(item?.system.freeLevels || 0) : 0;
      if (!item || current <= minimum) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.KnowledgeLimit"));
      if (entry.kind === "discipline") {
        const hasSpecialties = entry.specialties.some(specialty => {
          const specialtyItem = this.findKnowledgeItem(specialty.id);
          return Math.max(Number(specialtyItem?.system.level || 0), Number(specialtyItem?.system.offHandLevel || 0)) > 0;
        });
        if (current === 1 && hasSpecialties) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.DisciplineSupportsSpecialty"));
      }
      if (current === 1 && Number(item.system[levelField === "level" ? "offHandLevel" : "level"] || 0) === 0) return item.delete();
      return item.update({[`system.${levelField}`]: current - 1});
    }
    if (current >= 5) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.LevelMaximum"));
    if (direction > 0 && !this.canChooseCatalogKnowledge(catalogId)) {
      const key = TRUDVANG.vitnerTypes[catalogId] ? "TRUDVANG.Warning.VitnerExclusive" : (this.allowedReligionIds.includes(this.getReligionForSpecialty(catalogId)?.id) ? "TRUDVANG.Warning.ReligionExclusive" : "TRUDVANG.Warning.ReligionIncompatible");
      return ui.notifications.warn(game.i18n.localize(key));
    }
    const next = current + 1;
    const requirement = this.getRequiredSkillValue(next);
    if (Number(this.system.skills?.[entry.skillKey]?.value || 1) < requirement) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.SkillRequirement", {sv: requirement}));
    if (entry.kind === "specialty" && Number(this.findKnowledgeItem(entry.parentCatalogId)?.system.level || 0) < 1) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ParentDisciplineRequired"));
    if (item && levelField === "level") return this.adjustItemLevel(item, 1);
    if (item) return this.advanceKnowledgeTrack(item, levelField);
    const name = game.i18n.localize(entry.label);
    const discipline = entry.parentCatalogId ? this.getCatalogEntry(entry.parentCatalogId) : null;
    const topics = entry.kind === "discipline" ? new Intl.ListFormat(game.i18n.lang, {style: "long", type: "conjunction"}).format(entry.specialties.map(specialty => game.i18n.localize(specialty.label))) : "";
    const description = this.catalogText(catalogId, "Description") || (TRUDVANG.knowledgeDescriptions[entry.id] ? game.i18n.localize(TRUDVANG.knowledgeDescriptions[entry.id]) : entry.kind === "discipline"
      ? game.i18n.format("TRUDVANG.Description.DisciplineSummary", {name, topics})
      : game.i18n.format("TRUDVANG.Description.SpecialtySummary", {name, discipline: discipline ? game.i18n.localize(discipline.label) : entry.parentDiscipline}));
    const summary = this.catalogText(catalogId, "Summary") || description;
    const data = {name, type: "ability", system: {description, summary, catalogId, kind: entry.kind, parentSkill: entry.skillKey, parentDiscipline: entry.parentDiscipline, level: levelField === "level" ? 1 : 0, offHandLevel: levelField === "offHandLevel" ? 1 : 0, rollBonus: entry.rollBonus}};
    const religion = this.getReligionForSpecialty(catalogId);
    if (this.system.experience?.creationMode) {
      const created = await this.createEmbeddedDocuments("Item", [data]);
      if (religion) await this.update({"system.details.religion": religion.id});
      return created;
    }
    const costProbe = {name: entry.name, type: "ability", system: data.system};
    const cost = this.getKnowledgeLevelCost(costProbe, 1);
    const available = Number(this.system.experience?.adventureAvailable || 0);
    if (available < cost) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.NotEnoughExperience", {cost}));
    [item] = await this.createEmbeddedDocuments("Item", [data]);
    if (religion) await this.update({"system.details.religion": religion.id});
    await this.update({"system.experience.adventureAvailable": available - cost, "system.experience.adventureSpent": Number(this.system.experience.adventureSpent || 0) + cost});
    return this._queueAdvancement({kind: "item", itemId: item.id, field: levelField, from: 0, to: 1, cost, created: true});
  }

  async advanceKnowledgeTrack(item, levelField = "level") {
    if (this.system.experience?.creationMode) {
      const current = Number(item.system[levelField] || 0);
      const next = current + 1;
      if (next > 5) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.LevelMaximum"));
      const requirement = this.getRequiredSkillValue(next);
      const skillKey = this.getKnowledgeSkillKey(item);
      if (Number(this.system.skills?.[skillKey]?.value || 1) < requirement) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.SkillRequirement", {sv: requirement}));
      return item.update({[`system.${levelField}`]: next});
    }
    return this.advanceItem(item, levelField);
  }

  getSkillTarget(skillKey, extra = 0, {kind = "skill", movement = false} = {}) {
    let total = this.getSkillValue(skillKey) + Number(extra || 0) + this.getRollModifier({kind, skillKey, movement});
    if (this.isInCombatActive() && Number(this.system.armorVCPenalty || 0) > 0) total -= Number(this.system.armorVCPenalty);
    return total;
  }

  async rollSkill(skillKey, {label = null, bonus = 0} = {}) {
    if (!this.canPerformAction()) return this.warnCannotAct();
    const target = this.getSkillTarget(skillKey, bonus);
    const name = label ?? game.i18n.localize(TRUDVANG.skills[skillKey] ?? skillKey);
    const options = await modifierDialog({title: name, target});
    if (!options) return null;
    return rollUnder({actor: this, label: name, target, modifier: options.modifier, kind: "skill"});
  }

  async rollTrait(traitKey) {
    if (!this.canPerformAction()) return this.warnCannotAct();
    const trait = this.getTraitValue(traitKey);
    const effect = this.getRollModifier({kind: "trait", traitKey});
    const label = game.i18n.localize(TRUDVANG.traits[traitKey] ?? traitKey);
    const options = await traitRollDialog({title: label, traitLabel: label, traitValue: trait, effect});
    if (!options) return null;
    if (options.mode === "situation") {
      const target = options.situationValue + trait + effect;
      return rollUnder({actor: this, label, target, kind: "situation"});
    }
    const openRoll = await openD10({threshold: 10, modifier: trait + options.bonus + effect});
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/open-trait-roll-card.hbs", {
      actorName: this.name,
      actorImg: this.img,
      label,
      total: openRoll.total,
      rolls: openRoll.rolls.join(" + "),
      trait,
      bonus: options.bonus,
      effect
    });
    await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: this}), content, rolls: openRoll.diceRolls});
    return openRoll;
  }

  async rollAbility(item) {
    if (!this.canPerformAction()) return this.warnCannotAct();
    const key = item.system.parentSkill;
    const target = this.getAbilityBreakdown(item).total;
    const options = await modifierDialog({title: item.name, target});
    if (!options) return null;
    return rollUnder({actor: this, label: item.name, target, modifier: options.modifier, kind: "ability", item});
  }

  async rollInitiativeTrudvang({combatant = null} = {}) {
    if (!this.canPerformAction()) return this.warnCannotAct();
    const options = await initiativeDialog({actor: this, target: Number(this.system.initiative.current || 0), lightningQuickLevel: Number(this.findKnowledgeItem("lightningQuickInvocation")?.system.level || 0)});
    if (!options) return null;
    const result = await openD10({threshold: 10, modifier: Number(this.system.initiative.current || 0) + options.modifier});
    const detail = result.rolls.join(" + ");
    const activeCombat = game.combat;
    const combatants = combatant ? [combatant] : Array.from(activeCombat?.combatants?.values?.() ?? activeCombat?.combatants ?? [])
      .filter(candidate => candidate.actor === this || candidate.actor?.uuid === this.uuid);
    if (combatants.length) await Promise.all(combatants.map(candidate => candidate.update({initiative: result.total})));
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/initiative-card.hbs", {
      actorName: this.name,
      actorImg: this.img,
      total: result.total,
      detail,
      modifier: result.modifier
    });
    // Pass the raw d10 Roll objects (V16/Dice So Nice): without `rolls` the chat card renders
    // but no 3D dice are animated. Same objects that produced `total`, so nothing is re-rolled.
    await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor: this}), content, rolls: result.diceRolls});
    return result.total;
  }

  async rollWeaponAttack(item) {
    return this.rollWeaponAction(item, "attack");
  }

  async rollWeaponParry(item) {
    return this.rollWeaponAction(item, "parry");
  }

  getWeaponActionState(item, {ignoreSpent = !this.isInActiveCombat} = {}) {
    const max = resolveEquipment({item, actor: this}).characteristics.weaponActions.value;
    const spent = ignoreSpent ? 0 : Math.min(max, Math.max(0, Number(item?.system?.weaponActionsSpent || 0)));
    return {max, spent, current: Math.max(0, max - spent)};
  }

  async spendWeaponAction(item) {
    if (!this.isInActiveCombat || !item?.id || typeof item.update !== "function") return true;
    const state = this.getWeaponActionState(item);
    if (state.current <= 0) return false;
    if (this.isOwner) await item.update({"system.weaponActionsSpent": state.spent + 1});
    return true;
  }

  get humanoidNaturalWeapon() {
    return {
      id: "humanoid-natural", uuid: "", type: "weapon",
      name: game.i18n.localize("TRUDVANG.Combat.HumanoidNaturalWeapons"),
      img: "icons/svg/combat.svg",
      system: {category: "natural", equipped: true, hand: "weapon", damage: "1d5", damageBonus: 0, openRoll: 0, strengthApplies: true, weaponActions: 4}
    };
  }

  async rollNaturalCombatAction(kind = "attack") {
    return this.rollWeaponAction(this.humanoidNaturalWeapon, kind);
  }

  async rollNaturalDamage() {
    return this.rollDamage(this.humanoidNaturalWeapon);
  }

  get dodgeTarget() {
    const evade = this.findKnowledgeItem("evade");
    if (evade) return this.getAbilityBreakdown(evade).total;
    const battleManeuver = Number(this.findKnowledgeItem("battleManeuver")?.system.level || 0);
    return this.getSkillTarget("agility", battleManeuver, {kind: "ability", movement: true});
  }

  async rollDodge() {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    if (!this.isInActiveCombat) return null;
    if (!combatPoolsAreFull(this)) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.DodgeRequiresFullCombatPools"));
    const label = game.i18n.localize("TRUDVANG.Combat.Dodge");
    const target = this.dodgeTarget;
    const options = await modifierDialog({title: label, target});
    if (!options) return null;
    const pools = resolveCombatPools({actor: this}).active;
    if (this.isOwner) await this.spendCombatPoints(Object.fromEntries(pools.map(pool => [pool.id, pool.current])));
    return rollUnder({actor: this, label, target, modifier: options.modifier, kind: "dodge"});
  }

  async rollWrestlingAction(kind = "grapple") {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    const inCombat = this.isInActiveCombat;
    const poolResolution = resolveCombatPools({actor: this, context: {action: kind, ignoreSpent: !inCombat}});
    const options = await combatPointDialog({
      title: game.i18n.localize(kind === "glima" ? "TRUDVANG.Combat.Glima" : "TRUDVANG.Combat.Grapple"),
      pools: poolResolution.eligible,
      defaultAllocation: suggestCombatAllocation(poolResolution.eligible, Math.min(10, poolResolution.eligibleCurrent))
    });
    if (!options) return null;
    const spending = normalizeCombatAllocation(poolResolution.eligible, options.allocation);
    if (inCombat && this.isOwner) await this.spendCombatPoints(spending.allocation, {freeScope: poolResolution.freeScope});
    const strength = this.getTraitValue("strength");
    const target = Math.floor(spending.total / 2);
    const actionModifier = this.getRollModifier({kind: "attack", movement: true}) - Number(this.system.armorVCPenalty || 0);
    const poolById = Object.fromEntries(poolResolution.eligible.map(pool => [pool.id, pool]));
    const flavor = [
      game.i18n.format("TRUDVANG.Calculation.WrestlingCost", {points: spending.total, target, strength}),
      ...(inCombat ? Object.entries(spending.allocation).filter(([, amount]) => amount > 0).map(([id, amount]) => game.i18n.format("TRUDVANG.Calculation.CombatPoolSpent", {amount, pool: game.i18n.localize(poolById[id].labelKey)})) : [])
    ].join("<br>");
    return rollUnder({actor: this, label: game.i18n.localize(kind === "glima" ? "TRUDVANG.Combat.Glima" : "TRUDVANG.Combat.Grapple"), target, modifier: strength + actionModifier + Number(options.modifier || 0), kind, flavor});
  }

  async toggleReadiedItem(item) {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    if (!item || !["weapon", "shield"].includes(item.type)) return null;
    const wasEquipped = Boolean(item.system.equipped);
    if (wasEquipped) {
      await item.update({"system.equipped": false});
      return ui.notifications.info(game.i18n.format("TRUDVANG.Notification.Sheathed", {item: item.name}));
    }
    const conflicts = readiedHandConflicts(this.items, item);
    if (conflicts.length) {
      return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.HandsOccupied", {
        item: item.name,
        conflicts: conflicts.map(conflict => conflict.name).join(", ")
      }));
    }
    if (!this.isInActiveCombat) {
      await item.update({"system.equipped": true});
      return ui.notifications.info(game.i18n.format("TRUDVANG.Notification.DrawnOutsideCombat", {item: item.name}));
    }
    if (this.getWeaponActionState(item).current <= 0) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.NoWeaponActionsLeft", {item: item.name}));
    const poolResolution = resolveCombatPools({actor: this, item, context: {action: "drawWeapon"}});
    const cost = 10;
    const fullRoundDraw = poolResolution.eligibleCurrent < cost && combatPoolsAreFull(this);
    if (poolResolution.eligibleCurrent < cost && !fullRoundDraw) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NotEnoughCombatPointsToReady"));
    const options = await combatPointDialog({
      title: game.i18n.format("TRUDVANG.Dialog.DrawTitle", {item: item.name}),
      pools: poolResolution.eligible,
      defaultAllocation: suggestCombatAllocation(poolResolution.eligible, Math.min(cost, poolResolution.eligibleCurrent)),
      buttonLabelKey: "TRUDVANG.Action.Draw",
      showModifier: false,
      totalLabelKey: "TRUDVANG.Dialog.AllocatedPoints",
      alternateButtonLabelKey: fullRoundDraw ? "TRUDVANG.Action.DoNothingElse" : "",
      hidePrimary: fullRoundDraw
    });
    if (!options) return null;
    if (options.alternate) {
      const allPools = Object.fromEntries(poolResolution.active.filter(pool => pool.current > 0).map(pool => [pool.id, pool.current]));
      if (this.isOwner) await this.spendCombatPoints(allPools, {freeScope: poolResolution.freeScope});
      await this.spendWeaponAction(item);
      await item.update({"system.equipped": true});
      return ui.notifications.info(game.i18n.format("TRUDVANG.Notification.DrawnFullRound", {item: item.name}));
    }
    const spending = normalizeCombatAllocation(poolResolution.eligible, options.allocation);
    if (spending.total !== cost) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.ExactCombatCost", {cost}));
    if (this.isOwner) await this.spendCombatPoints(spending.allocation, {freeScope: poolResolution.freeScope});
    await this.spendWeaponAction(item);
    await item.update({"system.equipped": true});
    return ui.notifications.info(game.i18n.format("TRUDVANG.Notification.Drawn", {item: item.name, cost}));
  }

  async rollWeaponAction(item, kind) {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    const inCombat = this.isInActiveCombat;
    if (inCombat && this.getWeaponActionState(item).current <= 0) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.NoWeaponActionsLeft", {item: item.name}));
    const canThrow = kind === "attack" && canThrowWeapon(item);
    const defaultThrowing = canThrow && isThrowingWeapon(item);
    const prepareMode = throwing => {
      const usageItem = weaponForUsage(item, {throwing});
      const poolResolution = resolveCombatPools({actor: this, item: usageItem, context: {action: kind, ignoreSpent: !inCombat}});
      return {
        id: throwing ? "throwing" : "melee",
        throwing,
        usageItem,
        poolResolution,
        pools: poolResolution.eligible,
        defaultAllocation: suggestCombatAllocation(poolResolution.eligible, Math.min(5, poolResolution.eligibleCurrent)),
        rangeText: throwing ? game.i18n.format("TRUDVANG.Dialog.WeaponRanges", (() => {
          const range = resolveThrowingRange({item, actor: this});
          return {short: range.short, long: range.long};
        })()) : ""
      };
    };
    const modes = canThrow ? [prepareMode(false), prepareMode(true)] : [prepareMode(false)];
    const defaultMode = modes.find(mode => mode.throwing === defaultThrowing) ?? modes[0];
    const equipment = resolveEquipment({item, actor: this, context: {usage: defaultMode.throwing ? "throwing" : kind, hand: item.system.hand}});
    const combatPointBonus = item.system.combatPointBonusUsed ? 0 : equipment.characteristics.combatPointBonus.value;
    const effectModifier = this.getRollModifier({kind, movement: true});
    const armorModifier = -Number(this.system.armorVCPenalty || 0);
    const equipmentModifier = resolveCombatActionModifier({item: defaultMode.usageItem, actor: this, context: {usage: kind, hand: item.system.hand}});
    const targetActor = Array.from(game.user.targets || []).map(target => target?.actor).find(Boolean);
    const targetPerception = Number(targetActor?.getTraitValue?.("perception") ?? targetActor?.system?.effective?.traits?.perception ?? targetActor?.system?.traits?.perception ?? 0);
    const feintMax = kind === "attack" ? Math.max(0, 5 - (targetActor ? targetPerception : 0)) : 0;
    const modifierRows = [
      {label: game.i18n.localize("TRUDVANG.Dialog.EffectModifier"), value: effectModifier},
      {label: game.i18n.localize("TRUDVANG.Resource.ArmorVCPenalty"), value: armorModifier},
      ...equipmentModifier.steps.map(step => ({label: game.i18n.format(step.explanationKey, step.explanationData), value: step.delta}))
    ].filter(row => Number(row.value));
    const ruleNotice = kind === "parry" && (item.system?.combatSpecialty === "natural" || item.system?.category === "natural")
      ? game.i18n.localize("TRUDVANG.Combat.NaturalParryHint")
      : "";
    const options = await combatPointDialog({
      title: game.i18n.format(kind === "parry" ? "TRUDVANG.Dialog.ParryTitle" : "TRUDVANG.Dialog.AttackTitle", {item: item.name}),
      pools: defaultMode.pools,
      defaultAllocation: defaultMode.defaultAllocation,
      combatPointBonus,
      modifierRows,
      feintMax,
      ruleNotice,
      combatModes: canThrow ? {
        label: game.i18n.localize(defaultThrowing ? "TRUDVANG.Dialog.MeleeAttack" : "TRUDVANG.Dialog.ThrowWeapon"),
        checked: false,
        uncheckedMode: defaultThrowing ? "throwing" : "melee",
        checkedMode: defaultThrowing ? "melee" : "throwing",
        defaultMode: defaultMode.id,
        modes
      } : null
    });
    if (!options) return null;
    const mode = modes.find(candidate => candidate.id === options.mode) ?? defaultMode;
    const poolResolution = mode.poolResolution;
    const spending = normalizeCombatAllocation(poolResolution.eligible, options.allocation);
    const feint = kind === "attack" ? Math.min(spending.total, feintMax, Math.max(0, Math.floor(Number(options.feint || 0)))) : 0;
    if (inCombat && this.isOwner) await this.spendCombatPoints(spending.allocation, {freeScope: poolResolution.freeScope});
    if (inCombat) await this.spendWeaponAction(item);
    if (inCombat && this.isOwner && !item.system.combatPointBonusUsed) await item.update({"system.combatPointBonusUsed": true});
    const poolById = Object.fromEntries(poolResolution.eligible.map(pool => [pool.id, pool]));
    const spendingFlavor = inCombat ? Object.entries(spending.allocation)
      .filter(([, amount]) => amount > 0)
      .map(([id, amount]) => game.i18n.format("TRUDVANG.Calculation.CombatPoolSpent", {
        amount,
        pool: game.i18n.localize(poolById[id].labelKey)
      })) : [];
    const flavor = [
      ...spendingFlavor,
      ...(feint ? [game.i18n.format("TRUDVANG.Calculation.FeintCost", {points: feint})] : []),
      ...(combatPointBonus ? [game.i18n.format("TRUDVANG.Calculation.EquipmentCombatPointBonus", {amount: combatPointBonus > 0 ? `+${combatPointBonus}` : combatPointBonus})] : []),
      ...modifierRows.map(row => `${row.label}: ${row.value > 0 ? "+" : ""}${row.value}`)
    ].join("<br>");
    return rollUnder({
      actor: this,
      label: `${item.name} — ${game.i18n.localize(kind === "parry" ? "TRUDVANG.Action.Parry" : "TRUDVANG.Action.Attack")}`,
      target: spending.total - feint,
      modifier: options.modifier + combatPointBonus + effectModifier + armorModifier + equipmentModifier.value,
      kind,
      flavor,
      item,
      feint,
      usage: mode.throwing ? "throwing" : "melee"
    });
  }

  async rollSpell(item) {
    if (!this.canPerformAction()) return this.warnCannotAct();
    const isDivine = item.type === "divineFeat";
    const resource = isDivine ? "divinity" : "vitner";
    const skillKey = isDivine ? "faith" : "vitnerCraft";
    const disciplineId = isDivine ? "invoke" : "vitnerShaping";
    const specialtyIds = isDivine ? Object.values(TRUDVANG.religions).map(religion => religion.specialty) : ["galding", "sejding", "vyrding"];
    const disciplineLevel = Number(this.findKnowledgeItem(disciplineId)?.system.level || 0);
    const skillValue = this.getSkillTarget(skillKey, 0, {kind: "magic"});
    const methods = specialtyIds.map(id => ({id, item: this.findKnowledgeItem(id)})).filter(entry => Number(entry.item?.system.level || 0) > 0).map(entry => {
      const specialtyBonus = 2 * Number(entry.item.system.level || 0);
      const target = skillValue + disciplineLevel + specialtyBonus;
      return {id: entry.id, label: entry.item.name, target, breakdown: game.i18n.format("TRUDVANG.Calculation.MagicMethod", {skill: skillValue, discipline: disciplineLevel, specialty: specialtyBonus, total: target})};
    });
    if (!methods.length || disciplineLevel < 1) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.MagicMethodRequired"));
    const defaultCost = Number(item.system.cost || TRUDVANG.spellCosts[item.system.level] || 0);
    const strenuousMax = isDivine ? 0 : Number(this.findKnowledgeItem("strenuous")?.system.level || 0);
    const options = await magicDialog({
      title: item.name,
      methods,
      spellModifier: Number(item.system.modifier || 0),
      defaultCost,
      strenuousMax,
      resourceLabel: game.i18n.localize(isDivine ? "TRUDVANG.Resource.DivinityCost" : "TRUDVANG.Resource.VitnerCost")
    });
    if (!options) return null;
    const temporaryDivinity = isDivine ? Number(this.system.resources.divinity.temporary || 0) : 0;
    const available = Number(this.system.resources[resource].current ?? this.system.resources[resource].value ?? 0) + temporaryDivinity;
    if (options.cost > available) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NotEnoughPower"));
    const vitnerType = this.selectedVitnerType;
    const perfectSuccessMax = isDivine ? 1 : (vitnerType?.perfectSuccessMax ?? 1);
    const strenuousFlavor = options.strenuousBonus ? `<br>${game.i18n.format("TRUDVANG.Calculation.Strenuous", {bonus: options.strenuousBonus, cost: options.strenuousBonus * 2})}` : "";
    const flavor = `${options.method.breakdown}${strenuousFlavor}`;
    const result = await rollUnder({actor: this, label: `${item.name} — ${options.method.label}`, target: options.target, modifier: options.modifier, kind: isDivine ? "divine" : "spell", flavor, item, perfectSuccessMax});
    const spent = isDivine && !result.success ? defaultCost : options.cost;
    if (this.isOwner) {
      const stored = Number(this._source.system.resources[resource].value || 0);
      if (isDivine) {
        const storedTemporary = Number(this._source.system.resources.divinity.temporary || 0);
        const temporarySpent = Math.min(storedTemporary, spent);
        await this.update({
          "system.resources.divinity.temporary": storedTemporary - temporarySpent,
          "system.resources.divinity.value": Math.max(0, stored - (spent - temporarySpent))
        });
      } else await this.update({[`system.resources.${resource}.value`]: Math.max(0, stored - spent)});
    }
    if (result?.result === 20) await this.rollFatalEffect(isDivine ? "faith" : "vitner", options.cost, item);
    return result;
  }

  async rollFatalEffect(kind, cost, failedItem = null) {
    const isDivine = kind === "faith";
    const vitnerType = this.selectedVitnerType;
    const threshold = isDivine ? 9 : (vitnerType?.fatalThreshold ?? 9);
    const mitigation = isDivine
      ? Number(this.findKnowledgeItem("godFocus")?.system.level || 0) + (2 * Number(this.findKnowledgeItem("composed")?.system.level || 0))
      : Number(this.findKnowledgeItem("vitnerFocus")?.system.level || 0) + (2 * Number(this.findKnowledgeItem("safeWeaving")?.system.level || 0));
    const activeCost = isDivine ? 0 : this.items.filter(item => item.type === "spell" && item.id !== failedItem?.id && item.system.active).reduce((sum, item) => sum + Number(item.system.activeCost || item.system.cost || 0), 0);
    const result = await openD10({threshold, modifier: Number(cost || 0) + activeCost - mitigation});
    const tableId = isDivine ? "fatal-failure-effects" : "fatal-magic-effects";
    const table = game.tables.find(candidate => candidate.getFlag("trudvang-chronicles", "starterId") === tableId);
    if (!table) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.FatalTableMissing"));
    const roll = new Roll(String(Math.max(0, result.total)));
    await roll.evaluate();
    return table.draw({roll, displayChat: true});
  }

  async resetCombatPoints() {
    const updates = Object.keys(this.system.combatPools || {}).flatMap(id => [
      [`system.combatPools.${id}.spent`, 0],
      ...(id === "free" ? [["system.combatPools.free.weaponSpent", 0], ["system.combatPools.free.offHandSpent", 0]] : [])
    ]);
    await this.update(Object.fromEntries(updates));
    const combatEquipment = this.items.filter(item => ["weapon", "shield"].includes(item.type));
    if (combatEquipment.length) await this.updateEmbeddedDocuments("Item", combatEquipment.map(item => ({_id: item.id, "system.combatPointBonusUsed": false, "system.weaponActionsSpent": 0})));
    return this;
  }

  async calmFear() {
    if (!this.isOwner) return;
    const before = Number(this.system.resources.fear.current || 0);
    if (before <= 0) return;
    const roll = new Roll("1d10");
    await roll.evaluate();
    const recovered = Math.min(before, Number(roll.total || 0));
    const stored = Number(this._source.system.resources.fear.value || 0);
    await this.update({"system.resources.fear.value": Math.max(0, stored - recovered)});
    const after = Math.max(0, before - recovered);
    const message = game.i18n.format("TRUDVANG.Notification.CalmFear", {actor: this.name, amount: recovered, before, after});
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this}),
      content: `<p class="trudvang fear-recovery"><i class="fas fa-heart"></i> ${escapeHtml(message)}</p>`,
      rolls: [roll]
    });
    return {roll, recovered, before, after};
  }

  /** Roll the final life-spark duration for a dying character. */
  async rollSurvivalRounds() {
    if (!this.isOwner || Number(this.system.resources.body.current || 0) > 0) return null;
    const roll = new Roll(`1d6 + ${this.getTraitValue("constitution")}`);
    await roll.evaluate();
    const rounds = Math.max(0, Number(roll.total || 0));
    await this.update({"system.survivalRounds": rounds});
    const message = game.i18n.format("TRUDVANG.Notification.SurvivalRounds", {actor: this.name, rounds});
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this}),
      content: `<p class="trudvang survival-rounds"><i class="fas fa-hourglass-half"></i> ${escapeHtml(message)}</p>`,
      rolls: [roll]
    });
    return {roll, rounds};
  }

  async restForNight() {
    if (!this.isOwner) return;
    const recovery = this.system.healthRecovery ?? {amount: 1, days: 1};
    const recordedNights = Number(this._source.system.rest?.healthRecoveryNights || 0);
    const recoveryNights = recordedNights + 1;
    const canRecoverHealth = recoveryNights >= Number(recovery.days || 1);
    const bodyBefore = Number(this.system.resources.body.current || 0);
    const bodyMax = Number(this.system.resources.body.max || 0);
    const healthRecovered = canRecoverHealth ? Math.min(Number(recovery.amount || 0), Math.max(0, bodyMax - bodyBefore)) : 0;
    const bodyStored = Number(this._source.system.resources.body.value || 0);
    const updates = {
      "system.rest.healthRecoveryNights": canRecoverHealth ? 0 : recoveryNights,
      "system.resources.body.value": Math.min(bodyMax, bodyStored + healthRecovered),
      "system.resources.vitner.value": Number(this.system.resources.vitner.max || 0),
      "system.resources.divinity.temporary": 0
    };
    if (bodyBefore <= 0 && bodyBefore + healthRecovered > 0) updates["system.survivalRounds"] = -1;
    if (this.selectedReligion?.id !== "thuuldom") updates["system.resources.divinity.value"] = Number(this.system.resources.divinity.max || 0);
    await this.update(updates);
    const fear = await this.calmFear();
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.RestCompleted", {
      health: healthRecovered,
      vitner: Number(this.system.resources.vitner.max || 0),
      divinity: this.selectedReligion?.id === "thuuldom" ? game.i18n.localize("TRUDVANG.Notification.NotRestored") : Number(this.system.resources.divinity.max || 0),
      fear: fear?.recovered || 0
    }));
    return {healthRecovered, fear};
  }

  async rollCombatMovement() {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    if (!this.isInActiveCombat) return null;
    const poolResolution = resolveCombatPools({actor: this, context: {action: "movement"}});
    const options = await combatPointDialog({
      title: game.i18n.localize("TRUDVANG.Combat.MovementAction"),
      pools: poolResolution.eligible,
      defaultAllocation: suggestCombatAllocation(poolResolution.eligible, Math.min(2, poolResolution.eligibleCurrent)),
      buttonLabelKey: "TRUDVANG.Action.SpendCombat",
      showModifier: false,
      totalLabelKey: "TRUDVANG.Dialog.AllocatedPoints"
    });
    if (!options) return null;
    const spending = normalizeCombatAllocation(poolResolution.eligible, options.allocation);
    if (spending.total <= 0 || spending.total % 2 !== 0) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.InvalidCombatMovementCost"));
    const paidMeters = spending.total / 2;
    if (this.isOwner) await this.spendCombatPoints(spending.allocation, {freeScope: poolResolution.freeScope});
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.CombatMovement", {points: spending.total, meters: paidMeters}));
    return {...spending, paidMeters};
  }

  /** Spend Combat Points on a manoeuvre not otherwise represented in the sheet. */
  async spendGenericCombatAction() {
    if (!this.canPerformAction({movement: true})) return this.warnCannotAct();
    if (!this.isInActiveCombat) return null;
    const poolResolution = resolveCombatPools({actor: this, context: {action: "other"}});
    const options = await combatPointDialog({
      title: game.i18n.localize("TRUDVANG.Combat.OtherAction"),
      pools: poolResolution.eligible,
      buttonLabelKey: "TRUDVANG.Action.SpendCombat",
      showModifier: false,
      totalLabelKey: "TRUDVANG.Dialog.AllocatedPoints"
    });
    if (!options) return null;
    const spending = normalizeCombatAllocation(poolResolution.eligible, options.allocation);
    if (spending.total <= 0) return null;
    if (this.isOwner) await this.spendCombatPoints(spending.allocation, {freeScope: poolResolution.freeScope});
    return spending;
  }

  async spendCombatPoints(allocation = {}, {freeScope = "both"} = {}) {
    if (!this.isInActiveCombat) return this;
    const updates = {};
    for (const [id, amount] of Object.entries(allocation)) {
      if (!Object.hasOwn(this.system.combatPools || {}, id) || Number(amount) <= 0) continue;
      if (id === "free" && freeScope === "both") {
        const free = this.system.combatPools.free || {};
        updates["system.combatPools.free.weaponSpent"] = Number(free.weaponSpent || 0) + Number(amount);
        updates["system.combatPools.free.offHandSpent"] = Number(free.offHandSpent || 0) + Number(amount);
        continue;
      }
      if (id === "free" && freeScope !== "shared") {
        const key = `system.combatPools.free.${freeScope}Spent`;
        updates[key] = Number(this.system.combatPools.free?.[`${freeScope}Spent`] || 0) + Number(amount);
        continue;
      }
      const stored = Number(this.system.combatPools?.[id]?.spent || 0);
      updates[`system.combatPools.${id}.spent`] = stored + Number(amount);
    }
    if (Object.keys(updates).length) return this.update(updates);
    return this;
  }

  async advanceSkill(skillKey) {
    if (this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ExitCreationFirst"));
    const current = Number(this.system.skills?.[skillKey]?.value || 1);
    if (current >= 10) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.SkillMaximum"));
    const cost = current + 1;
    const available = Number(this.system.experience?.adventureAvailable || 0);
    if (available < cost) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.NotEnoughExperience", {cost}));
    await this.update({
      [`system.skills.${skillKey}.value`]: current + 1,
      "system.experience.adventureAvailable": available - cost,
      "system.experience.adventureSpent": Number(this.system.experience.adventureSpent || 0) + cost
    });
    return this._queueAdvancement({kind: "skill", key: skillKey, from: current, to: current + 1, cost});
  }

  async advanceItem(item, levelField = "level") {
    if (this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ExitCreationFirst"));
    if (!["ability", "tablet"].includes(item.type)) return;
    const current = Number(item.system[levelField] || 0);
    if (current >= 5) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.LevelMaximum"));
    const next = current + 1;
    const requirement = this.getRequiredSkillValue(next);
    const skillKey = this.getKnowledgeSkillKey(item);
    if (skillKey && Number(this.system.skills?.[skillKey]?.value || 1) < requirement) {
      return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.SkillRequirement", {sv: requirement}));
    }
    const cost = this.getKnowledgeLevelCost(item, next);
    const available = Number(this.system.experience?.adventureAvailable || 0);
    if (available < cost) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.NotEnoughExperience", {cost}));
    await item.update({[`system.${levelField}`]: next});
    await this.update({
      "system.experience.adventureAvailable": available - cost,
      "system.experience.adventureSpent": Number(this.system.experience.adventureSpent || 0) + cost
    });
    return this._queueAdvancement({kind: "item", itemId: item.id, field: levelField, from: current, to: next, cost});
  }

  get pendingAdvancements() {
    return this.getFlag("trudvang-chronicles", "advancementQueue") ?? [];
  }

  async _queueAdvancement(operation) {
    return this.setFlag("trudvang-chronicles", "advancementQueue", [...this.pendingAdvancements, operation]);
  }

  async confirmAdvancements() {
    if (!this.pendingAdvancements.length) return;
    await this.unsetFlag("trudvang-chronicles", "advancementQueue");
    ui.notifications.info(game.i18n.localize("TRUDVANG.Notification.AdvancementConfirmed"));
  }

  async cancelAdvancements() {
    const queue = this.pendingAdvancements;
    if (!queue.length) return;
    const actorChanges = {};
    const itemChanges = new Map();
    const createdItems = new Set();
    let refund = 0;
    for (const operation of [...queue].reverse()) {
      refund += Number(operation.cost || 0);
      if (operation.kind === "skill") actorChanges[`system.skills.${operation.key}.value`] = operation.from;
      if (operation.kind === "item" && operation.created) createdItems.add(operation.itemId);
      else if (operation.kind === "item" && this.items.get(operation.itemId) && !createdItems.has(operation.itemId)) itemChanges.set(operation.itemId, {_id: operation.itemId, [`system.${operation.field || "level"}`]: operation.from});
    }
    for (const itemId of createdItems) itemChanges.delete(itemId);
    if (createdItems.size) await this.deleteEmbeddedDocuments("Item", [...createdItems]);
    if (itemChanges.size) await this.updateEmbeddedDocuments("Item", [...itemChanges.values()]);
    await this.update({
      ...actorChanges,
      "system.experience.adventureAvailable": Number(this.system.experience.adventureAvailable || 0) + refund,
      "system.experience.adventureSpent": Math.max(0, Number(this.system.experience.adventureSpent || 0) - refund)
    });
    await this.unsetFlag("trudvang-chronicles", "advancementQueue");
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.AdvancementCancelled", {cost: refund}));
  }

  async toggleCreationMode() {
    if (this.pendingAdvancements.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ResolveAdvancementsFirst"));
    const entering = !this.system.experience?.creationMode;
    if (!entering) {
      if (!this.system.details?.culture || !TRUDVANG.cultures[this.system.details.culture]) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CultureRequired"));
      if (!TRUDVANG.archetypes[this.system.details?.archetype]) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ArchetypeRequired"));
      if (this.system.details?.religion && !this.allowedReligionIds.includes(this.system.details.religion)) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ReligionIncompatible"));
      const chosenReligions = Object.entries(TRUDVANG.religions).filter(([, religion]) => Number(this.findKnowledgeItem(religion.specialty)?.system.level || 0) > 0);
      if (chosenReligions.length > 1) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ReligionExclusive"));
      const chosenVitners = Object.keys(TRUDVANG.vitnerTypes).filter(id => Number(this.findKnowledgeItem(id)?.system.level || 0) > 0);
      if (chosenVitners.length > 1) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.VitnerExclusive"));
      for (const item of this.items.filter(candidate => ["ability", "tablet"].includes(candidate.type))) {
        const highestLevel = Math.max(Number(item.system.level || 0), Number(item.system.offHandLevel || 0));
        if (highestLevel <= 0) continue;
        const skillKey = this.getKnowledgeSkillKey(item);
        const paidLevel = Math.max(0, highestLevel - Number(item.system.freeLevels || 0));
        const requirement = paidLevel ? this.getRequiredSkillValue(highestLevel) : 0;
        if (skillKey && Number(this.system.skills?.[skillKey]?.value || 1) < requirement) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.KnowledgeRequirement", {item: item.name, skill: game.i18n.localize(TRUDVANG.skills[skillKey] || skillKey), sv: requirement}));
        if (item.type === "ability" && item.system.kind === "specialty" && !this.findParentDiscipline(item)) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.MissingParentDiscipline", {item: item.name}));
      }
      const remaining = Number(this.system.experience.creationTotal || 0) - this.calculateBuildCost();
      if (remaining < 0) return ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.CreationBudgetExceeded", {cost: Math.abs(remaining)}));
    }
    const changes = {"system.experience.creationMode": entering};
    if (!entering) changes["system.experience.creationSpent"] = this.calculateBuildCost();
    await this.update(changes);
    if (entering) await this.syncCreationDefaults();
    ui.notifications.info(game.i18n.localize(entering ? "TRUDVANG.Notification.CreationModeEnabled" : "TRUDVANG.Notification.CreationModeDisabled"));
  }

  async createTrudvangEffect(data) {
    if (!this.canUserModify(game.user, "update")) {
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.EffectPermission"));
    }
    const prepared = foundry.utils.deepClone(data);
    prepared.type = "effect";
    prepared.system ??= {};
    const stackId = String(prepared.system.stackId || "").trim();
    const stacking = prepared.system.stacking || "stack";
    const existing = stackId ? this.effects.find(effect => effect.type === "effect" && effect.system.stackId === stackId) : null;
    if (existing && stacking !== "stack") {
      if (stacking === "highest" && Number(existing.system.potency || 0) > Number(prepared.system.potency || 0)) {
        const start = foundry.documents.ActiveEffect.implementation.getEffectStart();
        await existing.update({start, duration: {...existing._source.duration, expired: false}});
        return existing;
      }
      if (stacking === "refresh") {
        const update = foundry.utils.deepClone(prepared);
        delete update._id;
        update.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
        update.duration = {...(update.duration || existing._source.duration), expired: false};
        await existing.update(update);
        return existing;
      }
      await existing.delete();
    }
    const [created] = await this.createEmbeddedDocuments("ActiveEffect", [prepared]);
    return created;
  }

  async createBlankEffect() {
    const effect = await this.createTrudvangEffect({
      name: game.i18n.localize("TRUDVANG.New.Effect"),
      img: "icons/svg/aura.svg",
      system: {stacking: "stack", changes: []}
    });
    effect?.sheet.render({force: true});
    return effect;
  }

  async rollItem(item) {
    if (item.type === "weapon" || item.type === "shield") return this.rollWeaponAttack(item);
    if (item.type === "spell" || item.type === "divineFeat") return this.rollSpell(item);
    if (item.type === "ability") {
      if (item.system.kind === "feat" && !item.system.parentSkill && !Number(item.system.rollBonus || 0)) return item.toChat();
      return this.rollAbility(item);
    }
    return item.toChat();
  }

  async rollDamage(item, context = {}) {
    return rollDamage({actor: this, item, context});
  }
}
