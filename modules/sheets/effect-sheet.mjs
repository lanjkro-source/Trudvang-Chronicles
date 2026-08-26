const ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;

export class TrudvangEffectSheet extends ActiveEffectConfig {
  static DEFAULT_OPTIONS = {
    classes: ["trudvang", "effect-sheet"],
    position: {width: 620, height: 720},
    window: {title: "TRUDVANG.Sheets.Effect"},
    actions: {
      addTrudvangStage: TrudvangEffectSheet.onAddStage,
      deleteTrudvangStage: TrudvangEffectSheet.onDeleteStage
    }
  };

  static PARTS = {
    header: super.PARTS.header,
    tabs: super.PARTS.tabs,
    details: super.PARTS.details,
    duration: super.PARTS.duration,
    changes: super.PARTS.changes,
    trudvang: {template: "systems/trudvang-chronicles/templates/effect/effect-rules.hbs", scrollable: [""]},
    footer: super.PARTS.footer
  };

  static TABS = {
    sheet: {
      ...super.TABS.sheet,
      tabs: [...super.TABS.sheet.tabs, {id: "trudvang", icon: "fa-solid fa-layer-group", label: "TRUDVANG.Effect.RulesTab"}]
    }
  };

  async _preparePartContext(partId, context) {
    const partContext = await super._preparePartContext(partId, context);
    if (partId !== "trudvang") return partContext;
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

  _processFormData(event, form, formData) {
    const raw = foundry.utils.expandObject(foundry.utils.deepClone(formData.object || {}));
    const submitData = super._processFormData(event, form, formData);
    const submittedChanges = foundry.utils.isPlainObject(submitData.system?.changes)
      ? Object.values(submitData.system.changes)
      : Array.from(submitData.system?.changes || []);
    const sourceChanges = foundry.utils.deepClone(this.document._source.system.changes || []);
    const nativeChangesEdited = JSON.stringify(submittedChanges) !== JSON.stringify(sourceChanges);
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
    if (submitData.system?.stages?.length) {
      const stageIndex = Math.min(Number(submitData.system.stage || 0), submitData.system.stages.length - 1);
      submitData.system.stage = stageIndex;
      if (nativeChangesEdited) submitData.system.stages[stageIndex].changes = foundry.utils.deepClone(submittedChanges);
      submitData.system.changes = foundry.utils.deepClone(submitData.system.stages[stageIndex].changes || []);
      const previous = this.document._source.system.stages[stageIndex];
      const current = submitData.system.stages[stageIndex];
      if (!previous || (Number(previous.durationValue || 0) !== Number(current.durationValue || 0)) || previous.durationUnit !== current.durationUnit) {
        submitData.duration = {
          ...this.document._source.duration,
          value: Number(current.durationValue || 0),
          units: current.durationUnit || "seconds",
          expiry: null,
          expired: false
        };
        submitData.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
      }
    }
    delete submitData.trudvang;
    return submitData;
  }

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
}
