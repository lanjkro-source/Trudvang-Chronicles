const ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;

export class TrudvangEffectSheet extends ActiveEffectConfig {
  static DEFAULT_OPTIONS = {
    classes: ["trudvang", "effect-sheet"],
    position: {width: 620, height: 720},
    window: {title: "TRUDVANG.Sheets.Effect"},
    actions: {
      addTrudvangStage: TrudvangEffectSheet.onAddStage,
      deleteTrudvangStage: TrudvangEffectSheet.onDeleteStage,
      addChange: TrudvangEffectSheet.onAddChange,
      deleteChange: TrudvangEffectSheet.onDeleteChange
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
        {id: "details", icon: "fas fa-align-left", label: "EFFECT.TABS.Details"},
        {id: "durationChanges", icon: "fas fa-hourglass-half", label: "TRUDVANG.Effect.TabDurationChanges"},
        {id: "trudvang", icon: "fas fa-layer-group", label: "TRUDVANG.Effect.RulesTab"}
      ],
      initial: "details"
    }
  };

  async _preparePartContext(partId, context) {
    const partContext = await super._preparePartContext(partId, context);

    if (partId === "details") {
      partContext.tab = partContext.tabs.details;
      partContext.enrichedDescription = await TextEditorImpl.enrichHTML(
        this.document.description || "",
        {async: true, secrets: this.document.isOwner}
      );
      partContext.origin = this.document.origin || "";
      return partContext;
    }

    if (partId === "durationChanges") {
      partContext.tab = partContext.tabs.durationChanges;
      const dur = this.document.duration || {};
      partContext.duration = {
        value: dur.value ?? 0,
        units: dur.units ?? "rounds",
        expiry: dur.expiry ?? ""
      };
      partContext.durationUnits = ["rounds", "minutes", "hours", "days"].reduce((choices, unit) => {
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
      partContext.changes = Array.from(this.document.system?.changes || []).map(c => ({
        key: c.key ?? "",
        type: c.type ?? "add",
        value: String(c.value ?? ""),
        priority: c.priority != null ? Number(c.priority) : null,
        phase: c.phase ?? "final"
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
        "system.modifiers.rolls.parry", "system.modifiers.rolls.magic",
        "system.modifiers.movement", "system.modifiers.protection",
        "system.modifiers.bodyMax", "system.modifiers.combatMax",
        "system.modifiers.vitnerMax", "system.modifiers.divinityMax",
        "system.modifiers.bodyValue", "system.modifiers.combatValue",
        "system.modifiers.vitnerValue", "system.modifiers.divinityValue",
        "system.modifiers.raudValue", "system.modifiers.fearValue"
      ];
      return partContext;
    }

    if (partId === "trudvang") {
      partContext.tab = partContext.tabs.trudvang;
      partContext.stackingChoices = {
        stack: game.i18n.localize("TRUDVANG.Effect.Stack"),
        refresh: game.i18n.localize("TRUDVANG.Effect.Refresh"),
        replace: game.i18n.localize("TRUDVANG.Effect.Replace"),
        highest: game.i18n.localize("TRUDVANG.Effect.Highest")
      };
      partContext.durationUnits = ["seconds", "minutes", "hours", "days", "rounds", "turns"].reduce((choices, unit) => {
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
        changesJson: JSON.stringify(Array.from(stage.changes || []), null, 2)
      }));
      return partContext;
    }

    return partContext;
  }

  _processFormData(event, form, formData) {
    const raw = foundry.utils.expandObject(foundry.utils.deepClone(formData.object || {}));
    const submitData = super._processFormData(event, form, formData);

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
      submitData.system.changes = submitData.system.changes
        .filter(c => c?.key)
        .map(c => ({...c, priority: c.priority != null && c.priority !== "" ? Number(c.priority) : null}));
    }

    // Sync active stage when stages exist
    if (submitData.system?.stages?.length) {
      const stageIndex = Math.min(Number(submitData.system.stage || 0), submitData.system.stages.length - 1);
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
    }

    delete submitData.trudvang;
    return submitData;
  }

  /* ------------------------------------------------------------------ */
  /*  Stage actions (Trudvang tab)                                       */
  /* ------------------------------------------------------------------ */

  static async onAddStage() {
    const stages = foundry.utils.deepClone(this.document._source.system.stages || []);
    stages.push({label: "", durationValue: 1, durationUnit: "rounds", changes: []});
    const update = {"system.stages": stages};
    if (stages.length === 1) {
      update["system.stage"] = 0;
      update["system.changes"] = [];
      update.duration = {value: 1, units: "rounds", expired: false};
      update.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
    }
    await this.document.update(update);
    return this.render({force: true});
  }

  static async onDeleteStage(event, target) {
    const index = Number(target.closest("[data-stage-index]")?.dataset.stageIndex);
    const stages = foundry.utils.deepClone(this.document._source.system.stages || []);
    if (!Number.isInteger(index) || index < 0 || index >= stages.length) return;
    let stageIndex = Number(this.document.system.stage || 0);
    stages.splice(index, 1);
    if (index < stageIndex) stageIndex -= 1;
    else if (index === stageIndex) stageIndex = Math.min(stageIndex, Math.max(0, stages.length - 1));
    const stage = stages[stageIndex];
    const update = {
      "system.stages": stages,
      "system.stage": stageIndex,
      "system.changes": foundry.utils.deepClone(stage?.changes || []),
      duration: stage ? {
        value: Number(stage.durationValue || 0),
        units: stage.durationUnit || "seconds",
        expiry: null,
        expired: false
      } : {value: null, units: null, expiry: null, expired: false},
      start: stage ? foundry.documents.ActiveEffect.implementation.getEffectStart() : null
    };
    await this.document.update(update);
    return this.render({force: true});
  }

  /* ------------------------------------------------------------------ */
  /*  Change actions (Duration & Changes tab)                            */
  /* ------------------------------------------------------------------ */

  static async onAddChange() {
    const changes = foundry.utils.deepClone(this.document._source.system?.changes || []);
    changes.push({key: "", type: "add", value: "0", priority: null, phase: "final"});
    await this.document.update({"system.changes": changes});
    return this.render({force: true});
  }

  static async onDeleteChange(event, target) {
    const index = Number(target.closest("[data-change-index]")?.dataset.changeIndex);
    const changes = foundry.utils.deepClone(this.document._source.system?.changes || []);
    if (!Number.isInteger(index) || index < 0 || index >= changes.length) return;
    changes.splice(index, 1);
    await this.document.update({"system.changes": changes});
    return this.render({force: true});
  }
}
