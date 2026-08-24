import { TRUDVANG } from "../config.mjs";
import { initiativeDialog, magicDialog, modifierDialog, openD10, rollDamage, rollUnder } from "../dice.mjs";
import { renderTemplate } from "../helpers.mjs";
import { powerItemData, TABLET_BY_ID, TABLET_CATALOG, tabletItemData } from "../tablet-catalog.mjs";

const BaseActor = foundry.documents.Actor;

export class TrudvangActor extends BaseActor {
  prepareDerivedData() {
    super.prepareDerivedData();
    const system = this.system;
    if (!system.resources) return;

    if (this.type === "character") {
      const race = TRUDVANG.races[system.details?.race] ?? TRUDVANG.races.human;
      system.resources.body.max = Math.max(1, race.body + Number(system.traits.constitution || 0) + Number(system.traits.strength || 0));
      system.movement.current = Math.max(0, race.movement + Number(system.traits.dexterity || 0) + this.equippedMovementModifier);
      system.persistenceInWild = this.calculatePersistenceInWild();
    }

    const bodyMax = Number(system.resources.body.max || 1);
    system.resources.body.value = Math.min(Number(system.resources.body.value || 0), bodyMax);
    const damage = Math.max(0, bodyMax - Number(system.resources.body.value || 0));
    const quarter = bodyMax / 4;
    system.damage = {
      taken: damage,
      penalty: damage > quarter * 3 ? -7 : damage > quarter * 2 ? -3 : damage > quarter ? -1 : 0,
      level: damage > quarter * 3 ? "critical" : damage > quarter * 2 ? "serious" : damage > quarter ? "injured" : "light"
    };
    const fear = Number(system.resources.fear.value || 0);
    system.fearPenalty = fear > 40 ? -7 : fear > 30 ? -5 : fear > 20 ? -3 : fear > 10 ? -1 : 0;
    if (this.type === "character") {
      const fighting = Number(system.skills?.fighting?.value || 1) + Number(system.skills?.fighting?.bonus || 0);
      system.resources.combat.max = Math.max(1, fighting);
      const vitnerType = this.selectedVitnerType;
      const callVitner = Number(this.findKnowledgeItem("callVitner")?.system.level || 0);
      const vitnerHabit = Number(this.findKnowledgeItem("vitnerHabit")?.system.level || 0);
      system.resources.vitner.max = vitnerType && callVitner
        ? Number(system.skills?.vitnerCraft?.value || 1) + (5 * callVitner) + (vitnerType.capacityPerLevel * vitnerType.level) + (10 * vitnerHabit)
        : 0;
      const religion = this.selectedReligion;
      const divinePower = Number(this.findKnowledgeItem("divinePower")?.system.level || 0);
      const faithful = Number(this.findKnowledgeItem("faithful")?.system.level || 0);
      const powerful = Number(this.findKnowledgeItem("powerful")?.system.level || 0);
      system.resources.divinity.max = religion && divinePower
        ? Number(system.skills?.faith?.value || 1) + (3 * divinePower) + (7 * faithful) + (7 * powerful)
        : 0;
      system.resources.vitner.value = Math.min(Number(system.resources.vitner.value || 0), system.resources.vitner.max);
      system.resources.divinity.value = Math.min(Number(system.resources.divinity.value || 0), system.resources.divinity.max);
    }
    system.initiative.current = Number(system.initiative.base || 0) + Number(system.traits?.dexterity || 0) + this.equippedInitiativeModifier + system.damage.penalty + system.fearPenalty;
    system.protection = Number(system.details?.naturalArmor || 0) + this.equippedProtection;
    system.buildCost = this.calculateBuildCost();
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
    return Math.max(0, 10 + Number(this.system.traits?.psyche || 0) + Number(survival?.system.level || 0) + (2 * Number(weathered?.system.level || 0)));
  }

  get equippedInitiativeModifier() {
    // Weapons are selected as the combat action in the initiative dialog.
    return this.equippedItems.filter(item => item.type !== "weapon").reduce((sum, item) => sum + Number(item.system.initiativeModifier || 0), 0);
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
    return this.equippedItems.reduce((sum, item) => sum + Number(item.system.movementModifier || 0), 0);
  }

  get equippedProtection() {
    return this.equippedItems.reduce((sum, item) => sum + Number(item.system.protection || 0), 0);
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
      const level = Math.max(0, Number(item.system.level || 0));
      const freeLevels = Math.min(level, Number(item.system.freeLevels || 0));
      let cost = 0;
      for (let rank = freeLevels + 1; rank <= level; rank += 1) cost += this.getKnowledgeLevelCost(item, rank);
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

  getAbilityBreakdown(item) {
    const skill = Number(this.system.skills?.[item.system.parentSkill]?.value || 1);
    const own = Number(item.system.level || 0) * Number(item.system.rollBonus || (item.system.kind === "specialty" ? 2 : 1));
    const parent = item.system.kind === "specialty" ? this.findParentDiscipline(item) : null;
    const discipline = parent ? Number(parent.system.level || 0) * Number(parent.system.rollBonus || 1) : 0;
    return {skill, discipline, specialty: item.system.kind === "specialty" ? own : 0, own, total: skill + discipline + own};
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
      && Number(item.system.level || 0) > Number(item.system.freeLevels || 0)
      && this.getRequiredSkillValue(Number(item.system.level || 0)) > nextValue);
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

  async adjustCatalogKnowledge(catalogId, direction) {
    const entry = this.getCatalogEntry(catalogId);
    if (!entry) return;
    let item = this.findKnowledgeItem(catalogId);
    const current = Number(item?.system.level || 0);
    if (direction < 0) {
      if (!this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
      const minimum = Number(item?.system.freeLevels || 0);
      if (!item || current <= minimum) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.KnowledgeLimit"));
      if (entry.kind === "discipline") {
        const hasSpecialties = entry.specialties.some(specialty => Number(this.findKnowledgeItem(specialty.id)?.system.level || 0) > 0);
        if (current === 1 && hasSpecialties) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.DisciplineSupportsSpecialty"));
      }
      if (current === 1) return item.delete();
      return item.update({"system.level": current - 1});
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
    if (item) return this.adjustItemLevel(item, 1);
    const name = game.i18n.localize(entry.label);
    const discipline = entry.parentCatalogId ? this.getCatalogEntry(entry.parentCatalogId) : null;
    const topics = entry.kind === "discipline" ? new Intl.ListFormat(game.i18n.lang, {style: "long", type: "conjunction"}).format(entry.specialties.map(specialty => game.i18n.localize(specialty.label))) : "";
    const description = this.catalogText(catalogId, "Description") || (TRUDVANG.knowledgeDescriptions[entry.id] ? game.i18n.localize(TRUDVANG.knowledgeDescriptions[entry.id]) : entry.kind === "discipline"
      ? game.i18n.format("TRUDVANG.Description.DisciplineSummary", {name, topics})
      : game.i18n.format("TRUDVANG.Description.SpecialtySummary", {name, discipline: discipline ? game.i18n.localize(discipline.label) : entry.parentDiscipline}));
    const summary = this.catalogText(catalogId, "Summary") || description;
    const data = {name, type: "ability", system: {description, summary, catalogId, kind: entry.kind, parentSkill: entry.skillKey, parentDiscipline: entry.parentDiscipline, level: 1, rollBonus: entry.rollBonus}};
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
    return this._queueAdvancement({kind: "item", itemId: item.id, from: 0, to: 1, cost, created: true});
  }

  getSkillTarget(skillKey, extra = 0) {
    const skill = this.system.skills?.[skillKey];
    return Number(skill?.value || 1) + Number(skill?.bonus || 0) + Number(extra || 0);
  }

  async rollSkill(skillKey, {label = null, bonus = 0} = {}) {
    const target = this.getSkillTarget(skillKey, bonus);
    const name = label ?? game.i18n.localize(TRUDVANG.skills[skillKey] ?? skillKey);
    const options = await modifierDialog({title: name, target});
    if (!options) return null;
    return rollUnder({actor: this, label: name, target, modifier: options.modifier, kind: "skill"});
  }

  async rollTrait(traitKey) {
    const target = 10 + Number(this.system.traits?.[traitKey] || 0);
    const label = game.i18n.localize(TRUDVANG.traits[traitKey] ?? traitKey);
    const options = await modifierDialog({title: label, target});
    if (!options) return null;
    return rollUnder({actor: this, label, target, modifier: options.modifier, kind: "situation"});
  }

  async rollAbility(item) {
    const key = item.system.parentSkill;
    const target = this.getAbilityBreakdown(item).total;
    const options = await modifierDialog({title: item.name, target});
    if (!options) return null;
    return rollUnder({actor: this, label: item.name, target, modifier: options.modifier, kind: "ability", item});
  }

  async rollInitiativeTrudvang() {
    const options = await initiativeDialog({actor: this, target: Number(this.system.initiative.current || 0), lightningQuickLevel: Number(this.findKnowledgeItem("lightningQuickInvocation")?.system.level || 0)});
    if (!options) return null;
    const result = await openD10({threshold: 10, modifier: Number(this.system.initiative.current || 0) + options.modifier});
    const detail = result.rolls.join(" + ");
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

  async rollWeaponAction(item, kind) {
    const available = Number(this.system.resources.combat.value || this.system.resources.combat.max || 1);
    const defaultCost = Math.min(Number(item.system.attackValue || 5), available);
    const options = await modifierDialog({
      title: game.i18n.format(kind === "parry" ? "TRUDVANG.Dialog.ParryTitle" : "TRUDVANG.Dialog.AttackTitle", {item: item.name}),
      target: defaultCost,
      showCost: true,
      defaultCost,
      resourceLabel: game.i18n.localize("TRUDVANG.Dialog.CombatPoints")
    });
    if (!options) return null;
    const spend = Math.max(0, Math.min(available, options.cost));
    if (this.isOwner) await this.update({"system.resources.combat.value": available - spend});
    return rollUnder({actor: this, label: item.name, target: spend, modifier: options.modifier, kind, item});
  }

  async rollSpell(item) {
    const isDivine = item.type === "divineFeat";
    const resource = isDivine ? "divinity" : "vitner";
    const skillKey = isDivine ? "faith" : "vitnerCraft";
    const disciplineId = isDivine ? "invoke" : "vitnerShaping";
    const specialtyIds = isDivine ? Object.values(TRUDVANG.religions).map(religion => religion.specialty) : ["galding", "sejding", "vyrding"];
    const disciplineLevel = Number(this.findKnowledgeItem(disciplineId)?.system.level || 0);
    const skillValue = this.getSkillTarget(skillKey);
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
    const available = Number(this.system.resources[resource].value || 0);
    if (options.cost > available) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NotEnoughPower"));
    const vitnerType = this.selectedVitnerType;
    const perfectSuccessMax = isDivine ? 1 : (vitnerType?.perfectSuccessMax ?? 1);
    const strenuousFlavor = options.strenuousBonus ? `<br>${game.i18n.format("TRUDVANG.Calculation.Strenuous", {bonus: options.strenuousBonus, cost: options.strenuousBonus * 2})}` : "";
    const flavor = `${options.method.breakdown}${strenuousFlavor}${item.system.effect ? `<hr>${item.system.effect}` : ""}`;
    const result = await rollUnder({actor: this, label: `${item.name} — ${options.method.label}`, target: options.target, modifier: options.modifier, kind: isDivine ? "divine" : "spell", flavor, item, perfectSuccessMax});
    const spent = isDivine && !result.success ? defaultCost : options.cost;
    if (this.isOwner) await this.update({[`system.resources.${resource}.value`]: Math.max(0, available - spent)});
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
    return this.update({"system.resources.combat.value": this.system.resources.combat.max});
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

  async advanceItem(item) {
    if (this.system.experience?.creationMode) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.ExitCreationFirst"));
    if (!["ability", "tablet"].includes(item.type)) return;
    const current = Number(item.system.level || 0);
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
    await item.update({"system.level": next});
    await this.update({
      "system.experience.adventureAvailable": available - cost,
      "system.experience.adventureSpent": Number(this.system.experience.adventureSpent || 0) + cost
    });
    return this._queueAdvancement({kind: "item", itemId: item.id, from: current, to: next, cost});
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
      else if (operation.kind === "item" && this.items.get(operation.itemId) && !createdItems.has(operation.itemId)) itemChanges.set(operation.itemId, {_id: operation.itemId, "system.level": operation.from});
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
        if (Number(item.system.level || 0) <= 0) continue;
        const skillKey = this.getKnowledgeSkillKey(item);
        const paidLevel = Math.max(0, Number(item.system.level || 1) - Number(item.system.freeLevels || 0));
        const requirement = paidLevel ? this.getRequiredSkillValue(Number(item.system.level || 1)) : 0;
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

  async rollItem(item) {
    if (item.type === "weapon" || item.type === "shield") return this.rollWeaponAttack(item);
    if (item.type === "spell" || item.type === "divineFeat") return this.rollSpell(item);
    if (item.type === "ability") {
      if (item.system.kind === "feat" && !item.system.parentSkill && !Number(item.system.rollBonus || 0)) return item.toChat();
      return this.rollAbility(item);
    }
    return item.toChat();
  }

  async rollDamage(item) {
    return rollDamage({actor: this, item});
  }
}
