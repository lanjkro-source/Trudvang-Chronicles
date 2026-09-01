import { escapeHtml } from "./helpers.mjs";
import { resolveEquipment } from "./rules/equipment-resolver.mjs";
import { resolveCombatPools } from "./rules/combat-pool-resolver.mjs";

const signed = value => Number(value) > 0 ? `+${Number(value)}` : `${Number(value)}`;
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;

const STAT_LABELS = {
  weight: "TRUDVANG.Field.Weight",
  weaponActions: "TRUDVANG.Field.WeaponActions",
  damage: "TRUDVANG.Field.Damage",
  combatActionModifier: "TRUDVANG.Field.CombatActionModifier",
  combatPointBonus: "TRUDVANG.Field.BonusCpLabel",
  initiativeModifier: "TRUDVANG.Field.InitiativeModifier",
  protection: "TRUDVANG.Field.VpProtectionLabel",
  passiveProtection: "TRUDVANG.Field.PassiveProtection",
  heft: "TRUDVANG.Field.Heft",
  movementModifier: "TRUDVANG.Field.MovementModifier"
};

const IMPACT_LABELS = {
  initiative: "TRUDVANG.Resource.Initiative",
  movement: "TRUDVANG.Resource.Movement",
  protection: "TRUDVANG.Resource.Protection",
  combatActions: "TRUDVANG.Inspection.CombatActionValue"
};

function localized(key, data = {}) {
  if (!key) return "";
  return Object.keys(data).length ? game.i18n.format(key, data) : game.i18n.localize(key);
}

function effectChangeDisplay(change) {
  const value = number(change.value);
  const type = change.type ?? change.mode;
  if (type === "add" || Number(type) === 2) return signed(value);
  if (type === "multiply" || Number(type) === 1) return `× ${value}`;
  return `= ${change.value}`;
}

function changeTone(value) {
  const numeric = number(value);
  return numeric > 0 ? "positive" : numeric < 0 ? "negative" : "neutral";
}

function effectChangeTone(change) {
  const type = change.type ?? change.mode;
  return (type === "add" || Number(type) === 2) ? changeTone(change.value) : "neutral";
}

function applicableEffectRows(actor, key, total) {
  const rows = [];
  let additive = 0;
  for (const effect of Array.from(actor.allApplicableEffects?.() || [])) {
    if (effect.disabled || effect.isSuppressed || effect.active === false) continue;
    for (const change of Array.from(effect.system?.changes || []).filter(entry => entry.key === key)) {
      if (change.type === "add" || Number(change.mode) === 2) additive += number(change.value);
      rows.push(row(effect.name, effectChangeDisplay(change), {source: effect.parent?.documentName === "Item" ? effect.parent.name : effect.sourceName || "", tone: effectChangeTone(change)}));
    }
  }
  const residual = number(total) - additive;
  if (residual) rows.push(row(localized("TRUDVANG.Inspection.OtherModifiers"), residual));
  return rows;
}

function damageDisplay(value) {
  const bonus = number(value.modifier?.value);
  return `${value.formula} · JO ${number(value.openRoll?.value)}${bonus ? ` · ${signed(bonus)}` : ""}`;
}

function statDisplays(key, value) {
  if (key === "damage") {
    const base = {...value, modifier: {...value.modifier, value: value.modifier.base}, openRoll: {...value.openRoll, value: value.openRoll.base}};
    // A lower open-roll threshold is beneficial: JO 8–10 opens more often than JO 10.
    const delta = number(value.modifier.value) - number(value.modifier.base) + number(value.openRoll.base) - number(value.openRoll.value);
    return {base: damageDisplay(base), effective: damageDisplay(value), modified: value.modifier.modified || value.openRoll.modified, tone: changeTone(delta)};
  }
  const useSigned = ["combatActionModifier", "initiativeModifier", "movementModifier"].includes(key);
  const display = current => useSigned ? signed(current) : `${current}`;
  return {base: display(value.base), effective: display(value.value), modified: Boolean(value.modified), tone: changeTone(number(value.value) - number(value.base))};
}

function statSteps(key, value) {
  const sources = key === "damage" ? [value.openRoll, value.modifier] : [value];
  return sources.flatMap(source => (source?.steps || []).map(step => ({
    label: step.source?.name || localized(`TRUDVANG.Inspection.Source.${step.source?.kind || "rule"}`),
    value: `${step.before} → ${step.after} (${signed(step.delta)})`,
    tone: changeTone(key === "damage" && source === value.openRoll ? -step.delta : step.delta),
    explanation: localized(step.explanationKey, step.explanationData)
  })));
}

export function prepareEquipmentInspection(item, actor = item?.parent?.documentName === "Actor" ? item.parent : null) {
  if (!item || !["weapon", "armor", "shield", "gear"].includes(item.type)) return null;
  const hand = item.system?.hand === "offHand" ? "offHand" : item.type === "shield" ? "shield" : "weapon";
  const resolution = resolveEquipment({item, actor, context: {hand}});
  const stats = Object.entries(resolution.characteristics).map(([key, value]) => {
    const display = statDisplays(key, value);
    const steps = statSteps(key, value);
    return {
      key,
      label: localized(STAT_LABELS[key] || key),
      baseDisplay: display.base,
      effectiveDisplay: display.effective,
      comparison: display.modified ? `${display.base} → ${display.effective}` : display.effective,
      modified: display.modified,
      tone: display.tone,
      steps
    };
  });
  const impacts = Object.entries(resolution.wearerImpacts).filter(([, impact]) => impact).map(([key, impact]) => {
    const mode = impact.conditional ? "conditional" : impact.applies ? "permanent" : "inactive";
    return {
      key,
      label: localized(IMPACT_LABELS[key] || key),
      value: signed(impact.value),
      mode,
      tone: changeTone(impact.value),
      modeLabel: localized(`TRUDVANG.Inspection.Mode.${mode}`)
    };
  });
  const effects = Array.from(item.effects || []).filter(effect => effect.transfer && !effect.disabled).map(effect => {
    const changes = Array.from(effect.system?.changes || []);
    return {
    label: effect.name,
    value: changes.map(change => `${change.key}: ${effectChangeDisplay(change)}`).join(" · ") || "—",
    mode: effect.isSuppressed ? "inactive" : "permanent",
    tone: changes.map(effectChangeTone).find(tone => tone !== "neutral") || "neutral",
    modeLabel: localized(`TRUDVANG.Inspection.Mode.${effect.isSuppressed ? "inactive" : "permanent"}`)
  }; });
  return {
    itemId: item.id,
    itemName: item.name,
    wearerName: actor?.name || "",
    stats,
    impacts,
    effects,
    modified: stats.some(stat => stat.modified),
    shortTitle: stats.filter(stat => ["weaponActions", "combatPointBonus", "damage", "heft", "protection", "weight"].includes(stat.key))
      .slice(0, 3).map(stat => `${stat.label}: ${stat.effectiveDisplay}`).join(" · ")
  };
}

function row(label, value, {source = "", conditional = false, tone = typeof value === "number" ? changeTone(value) : "neutral"} = {}) {
  return {label, value: typeof value === "number" ? signed(value) : value, source, conditional, tone};
}

export function prepareActorStatInspection(actor, key, config = {}) {
  const equipped = Array.from(actor.items || []).filter(item => item.system?.equipped);
  const permanent = [];
  const conditional = [];
  let title = "";
  let total = 0;
  if (key === "initiative") {
    title = localized("TRUDVANG.Resource.Initiative");
    permanent.push(
      row(localized("TRUDVANG.Inspection.Base"), number(actor.system.initiative?.base)),
      row(localized("TRUDVANG.Trait.Dexterity"), actor.getTraitValue("dexterity")),
      row(localized("TRUDVANG.Resource.DamageLevel"), number(actor.system.damage?.penalty)),
      row(localized("TRUDVANG.Resource.FearPenalty"), number(actor.system.fearPenalty)),
      row(localized("TRUDVANG.Knowledge.battleExperience"), number(actor.findKnowledgeItem("battleExperience")?.system.level)),
      row(localized("TRUDVANG.Knowledge.combatReaction"), number(actor.findKnowledgeItem("combatReaction")?.system.level) * 2),
      ...applicableEffectRows(actor, "system.modifiers.rolls.initiative", actor.system.modifiers?.rolls?.initiative)
    );
    for (const item of equipped) {
      const inspection = prepareEquipmentInspection(item, actor);
      const impact = inspection?.impacts.find(entry => entry.key === "initiative");
      if (!impact || !number(impact.value)) continue;
      (impact.mode === "conditional" ? conditional : permanent).push(row(item.name, impact.value, {source: localized(`TRUDVANG.Inspection.Mode.${impact.mode}`), conditional: impact.mode === "conditional"}));
    }
    total = number(actor.system.initiative?.current);
  } else if (key === "movement") {
    title = localized("TRUDVANG.Resource.Movement");
    const race = config.races?.[actor.system.details?.race];
    permanent.push(
      row(race ? localized(race.label) : localized("TRUDVANG.Field.Race"), number(race?.movement)),
      row(localized("TRUDVANG.Trait.Dexterity"), actor.getTraitValue("dexterity"))
    );
    for (const item of equipped) {
      const impact = prepareEquipmentInspection(item, actor)?.impacts.find(entry => entry.key === "movement");
      if (impact && number(impact.value)) permanent.push(row(item.name, impact.value, {source: impact.modeLabel}));
    }
    permanent.push(...applicableEffectRows(actor, "system.modifiers.movement", actor.system.modifiers?.movement));
    total = number(actor.system.movement?.current);
  } else if (key === "protection") {
    title = localized("TRUDVANG.Resource.Protection");
    permanent.push(row(localized("TRUDVANG.Field.NaturalArmor"), number(actor.system.details?.naturalArmor)));
    for (const item of equipped) {
      const inspection = prepareEquipmentInspection(item, actor);
      const impact = inspection?.impacts.find(entry => entry.key === "protection");
      if (impact && number(impact.value)) permanent.push(row(item.name, impact.value, {source: impact.modeLabel}));
      const passive = inspection?.stats.find(stat => stat.key === "passiveProtection");
      if (passive && number(passive.effectiveDisplay)) conditional.push(row(item.name, passive.effectiveDisplay, {source: localized("TRUDVANG.Field.PassiveProtection"), conditional: true}));
    }
    permanent.push(...applicableEffectRows(actor, "system.modifiers.protection", actor.system.modifiers?.protection));
    total = number(actor.system.protection);
  } else if (key === "persistence") {
    title = localized("TRUDVANG.Resource.PersistenceInWild");
    permanent.push(
      row(localized("TRUDVANG.Inspection.Base"), 10),
      row(localized("TRUDVANG.Trait.Psyche"), actor.getTraitValue("psyche")),
      row(localized("TRUDVANG.Knowledge.survival"), number(actor.findKnowledgeItem("survival")?.system.level || 0)),
      row(localized("TRUDVANG.Knowledge.weathered"), number(actor.findKnowledgeItem("weathered")?.system.level || 0) * 2)
    );
    total = `${number(actor.system.persistenceInWild)} ${localized("TRUDVANG.Unit.Days")}`;
  } else if (key === "fearFactor") {
    title = localized("TRUDVANG.Field.FearFactor");
    permanent.push(
      row(localized("TRUDVANG.Trait.Psyche"), -actor.getTraitValue("psyche")),
      ...applicableEffectRows(actor, "system.modifiers.fearFactor", actor.system.modifiers?.fearFactor)
    );
    total = signed(actor.system.fearFactorModifier);
  } else if (key === "combat") {
    title = localized("TRUDVANG.Resource.CombatPools");
    const pools = resolveCombatPools({actor, context: {ignoreSpent: !actor.isInActiveCombat}});
    for (const pool of pools.active) {
      permanent.push(row(localized(pool.labelKey), `${pool.current}/${pool.max}`, {
        source: pool.hintKey ? localized(pool.hintKey) : ""
      }));
    }
    permanent.push(...applicableEffectRows(actor, "system.modifiers.combatMax", actor.system.modifiers?.combatMax));
    total = `${pools.totalCurrent}/${pools.totalMax}`;
  }
  return {key, title, total, permanent: permanent.filter(entry => entry.value !== "0" || entry.label === localized("TRUDVANG.Inspection.Base")), conditional};
}

function rowsHtml(rows) {
  return rows.map(entry => `<li class="${[entry.conditional ? "conditional" : "", entry.tone || ""].filter(Boolean).join(" ")}"><span><strong>${escapeHtml(entry.label)}</strong>${entry.source ? `<small>${escapeHtml(entry.source)}</small>` : ""}</span><b>${escapeHtml(entry.value)}</b></li>`).join("");
}

export function showInspectionDialog(model) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const sections = model.stats ? [
    {
      title: localized("TRUDVANG.Inspection.EffectiveValues"),
      rows: model.stats.map(stat => ({label: stat.label, value: stat.comparison, source: stat.source || (stat.modified ? localized("TRUDVANG.Inspection.Modified") : ""), tone: stat.tone}))
    },
    {title: localized("TRUDVANG.Inspection.WearerImpacts"), rows: [...model.impacts.map(impact => ({label: impact.label, value: impact.value, source: impact.modeLabel, conditional: impact.mode === "conditional", tone: impact.tone})), ...(model.effects || []).map(effect => ({label: effect.label, value: effect.value, source: effect.modeLabel, tone: effect.tone}))]}
  ] : [
    {title: localized("TRUDVANG.Inspection.Permanent"), rows: model.permanent},
    {title: localized("TRUDVANG.Inspection.Conditional"), rows: model.conditional}
  ];
  const content = `<div class="trudvang inspection-dialog"><div class="inspection-total"><span>${escapeHtml(localized("TRUDVANG.Inspection.Total"))}</span><strong>${escapeHtml(model.total ?? "")}</strong></div>${sections.filter(section => section.rows.length).map(section => `<section><h3>${escapeHtml(section.title)}</h3><ol>${rowsHtml(section.rows)}</ol></section>`).join("")}</div>`;
  return DialogClass.wait({
    window: {title: model.itemName ? localized("TRUDVANG.Inspection.ItemTitle", {item: model.itemName, wearer: model.wearerName}) : model.title},
    content,
    buttons: [{action: "close", icon: "fas fa-check", label: localized("TRUDVANG.Action.Close")}],
    modal: false,
    rejectClose: false
  });
}

export function showEquipmentStatDetail(inspection, key) {
  const stat = inspection?.stats.find(entry => entry.key === key);
  if (!stat) return;
  return showInspectionDialog({
    itemName: `${inspection.itemName} — ${stat.label}`,
    wearerName: inspection.wearerName,
    stats: [stat, ...stat.steps.map((step, index) => ({
      key: `step-${index}`,
      label: step.label,
      comparison: step.value,
      effectiveDisplay: step.value,
      modified: true,
      tone: step.tone,
      source: step.explanation
    }))],
    impacts: inspection.impacts.filter(impact => impact.key === key)
  });
}
