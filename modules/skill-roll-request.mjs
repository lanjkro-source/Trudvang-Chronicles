import {TRUDVANG} from "./config.mjs";
import {escapeHtml, renderTemplate} from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";

/**
 * The GM proposes a skill test: pick the knowledge to use and a situation
 * modifier, then post a chat card. Anyone clicking the button rolls that
 * knowledge with their own character.
 *
 * The offered knowledge mirrors the actor sheet: a plain skill, or a discipline
 * with one of its specialties. A knowledge is rolled as an ability when the
 * character knows it (its own level and roll bonus apply); otherwise the plain
 * skill value is used.
 */

/** Every knowledge a character may roll, as a flat list of options. */
export function proposedKnowledgeOptions() {
  const options = [];
  for (const [skillKey, skillLabel] of Object.entries(TRUDVANG.skills)) {
    options.push({id: `skill:${skillKey}`, kind: "skill", skillKey, catalogId: "",
      label: game.i18n.localize(skillLabel), group: game.i18n.localize(skillLabel)});
  }
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    const skillLabel = game.i18n.localize(TRUDVANG.skills[skillKey] ?? skillKey);
    for (const discipline of disciplines) {
      const disciplineLabel = game.i18n.localize(discipline.label);
      options.push({id: `catalog:${discipline.id}`, kind: "discipline", skillKey, catalogId: discipline.id,
        label: disciplineLabel, group: skillLabel});
      for (const specialty of discipline.specialties ?? []) {
        options.push({id: `catalog:${specialty.id}`, kind: "specialty", skillKey, catalogId: specialty.id,
          label: game.i18n.localize(specialty.label), group: disciplineLabel});
      }
    }
  }
  return options;
}

/** Label of a proposed knowledge, for the chat card and the roll window. */
export function proposedKnowledgeLabel(option) {
  if (!option) return game.i18n.localize("TRUDVANG.Macro.ProposeSkillRoll");
  if (option.kind === "skill") return game.i18n.localize(TRUDVANG.skills[option.skillKey] ?? option.skillKey);
  const entry = catalogEntry(option.catalogId);
  return entry ? game.i18n.localize(entry.label) : option.label;
}

/**
 * The full path of a proposed knowledge. A specialty alone is ambiguous in the
 * chat (several disciplines share specialty names), so the skill and the
 * discipline are shown before it.
 */
export function proposedKnowledgePath(option) {
  if (!option) return "";
  if (option.kind === "skill") return proposedKnowledgeLabel(option);
  const parts = [game.i18n.localize(TRUDVANG.skills[option.skillKey] ?? option.skillKey)];
  const entry = catalogEntry(option.catalogId);
  if (entry?.kind === "specialty") {
    const parent = catalogEntry(entry.parentCatalogId);
    if (parent) parts.push(game.i18n.localize(parent.label));
  }
  parts.push(proposedKnowledgeLabel(option));
  return parts.join(" · ");
}

/** Resolve a catalogue id (discipline or specialty) from the knowledge tree. */
export function catalogEntry(catalogId) {
  for (const [skillKey, disciplines] of Object.entries(TRUDVANG.knowledgeTree)) {
    for (const discipline of disciplines) {
      if (discipline.id === catalogId) return {...discipline, skillKey, kind: "discipline", parentCatalogId: discipline.id};
      const specialty = (discipline.specialties ?? []).find(entry => entry.id === catalogId);
      if (specialty) return {...specialty, skillKey, kind: "specialty", parentCatalogId: discipline.id};
    }
  }
  return null;
}

/** The knowledge option matching a catalogue id, or the plain skill option. */
export function proposedKnowledgeFor(skillKey, catalogId = "") {
  const options = proposedKnowledgeOptions();
  if (catalogId) return options.find(option => option.catalogId === catalogId) ?? null;
  return options.find(option => option.kind === "skill" && option.skillKey === skillKey) ?? null;
}

/**
 * The knowledge actually used for a roll: a character who knows the proposed
 * discipline or specialty rolls it with its own level; anyone else falls back
 * to the plain skill.
 */
export function resolveProposedRoll(actor, {skillKey, catalogId = ""}) {
  const base = {skillKey, catalogId, label: "", ability: null, disciplineLevel: undefined};
  if (!actor) return base;
  if (catalogId) {
    const entry = catalogEntry(catalogId);
    // A character owns its knowledge as an item; an NPC only has a book row.
    const embedded = actor.findKnowledgeItem?.(catalogId) ?? null;
    const knowledge = embedded ?? actor.findRuleKnowledge?.(catalogId) ?? null;
    if (knowledge && entry) {
      const parentId = entry.kind === "specialty" ? entry.parentCatalogId : "";
      const parent = parentId ? actor.findRuleKnowledge?.(parentId) : null;
      base.label = knowledge.name ?? game.i18n.localize(entry.label);
      if (embedded) {
        // The real item is rolled, exactly as on the actor sheet.
        base.ability = embedded;
      } else {
        // A book row carries no item: rebuild the shape the NPC sheet uses.
        base.ability = {
          name: knowledge.name, img: "icons/svg/book.svg", type: "ability",
          system: {kind: entry.kind, catalogId, parentSkill: entry.skillKey,
            level: Number(knowledge.system.level || 0), rollBonus: entry.kind === "specialty" ? 2 : 1}
        };
        base.disciplineLevel = parent ? Number(parent.system.level || 0) : 0;
      }
      return base;
    }
  }
  base.label = game.i18n.localize(TRUDVANG.skills[skillKey] ?? skillKey);
  return base;
}

/**
 * Roll a proposed skill test with the character's own knowledge. The proposed
 * discipline or specialty is used when the character knows it; otherwise the
 * plain skill is rolled. The situation modifier chosen by the GM is prefilled
 * and remains editable in the roll window.
 */
export async function rollProposedSkill(actor, request = {}) {
  if (!actor) return null;
  const skillKey = request.skillKey ?? "";
  const catalogId = request.catalogId ?? "";
  const modifier = Number(request.modifier || 0);
  if (!skillKey) return null;
  const resolved = resolveProposedRoll(actor, {skillKey, catalogId});
  const bonusLabel = modifier ? game.i18n.localize("TRUDVANG.Macro.ProposeSkillRollModifier") : "";
  if (resolved.ability) {
    return actor.rollAbility(resolved.ability, {
      label: resolved.label,
      disciplineLevel: resolved.disciplineLevel,
      bonus: modifier,
      bonusLabel
    });
  }
  return actor.rollSkill(skillKey, {label: resolved.label, bonus: modifier, bonusLabel});
}

/** GM dialog: choose the knowledge, the situation modifier and the card title. */
export async function proposeSkillRollDialog() {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  const options = proposedKnowledgeOptions();
  const groups = new Map();
  for (const option of options) {
    if (!groups.has(option.group)) groups.set(option.group, []);
    groups.get(option.group).push(option);
  }
  const select = [...groups.entries()].map(([group, entries]) =>
    `<optgroup label="${escapeHtml(group)}">${entries.map(option =>
      `<option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>`).join("")}</optgroup>`).join("");
  const content = `<div class="trudvang roll-dialog">
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Macro.ProposeSkillRollKnowledge"))}</label><select name="knowledge">${select}</select></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Macro.ProposeSkillRollModifier"))}</label><input name="modifier" type="number" value="0"></div>
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.SituationLabel"))}</label><input name="title" type="text"></div>
  </div>`;
  return DialogClass.wait({
    window: {title: game.i18n.localize("TRUDVANG.Macro.ProposeSkillRoll")},
    content,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.ShowInChat"), default: true,
        callback: (event, button, dialog) => {
          const root = button.form ?? dialog.element;
          const id = root.querySelector("[name=knowledge]")?.value ?? "";
          const option = options.find(entry => entry.id === id);
          if (!option) {
            ui.notifications.warn(game.i18n.localize("TRUDVANG.Macro.InvalidSkillRoll"));
            return false;
          }
          const modifier = Number(root.querySelector("[name=modifier]")?.value || 0);
          if (!Number.isFinite(modifier)) {
            ui.notifications.warn(game.i18n.localize("TRUDVANG.Macro.InvalidSkillRoll"));
            return false;
          }
          return {option, modifier, title: root.querySelector("[name=title]")?.value?.trim() ?? ""};
        }},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

/**
 * Post the request card. The message carries the proposed knowledge and the
 * situation modifier, so any player can pick it up later.
 */
export async function requestSkillRoll({skillKey = "", catalogId = "", modifier = 0, title = ""} = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.GMOnly"));
    return null;
  }
  if (!skillKey && !catalogId) {
    const answered = await proposeSkillRollDialog();
    if (!answered) return null;
    ({modifier, title} = answered);
    skillKey = answered.option.skillKey;
    catalogId = answered.option.catalogId;
  }
  const option = proposedKnowledgeFor(skillKey, catalogId);
  if (!option) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Macro.InvalidSkillRoll"));
    return null;
  }
  const knowledgeLabel = proposedKnowledgeLabel(option);
  const buttonLabel = game.i18n.format("TRUDVANG.Macro.ProposeSkillRollButton", {knowledge: knowledgeLabel});
  const rollTitle = String(title ?? "").trim() || buttonLabel;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/skill-roll-request-card.hbs", {
    gmName: game.user.name,
    gmImg: game.user.avatar || "icons/svg/d20.svg",
    title: rollTitle,
    buttonLabel,
    knowledgeLabel: proposedKnowledgePath(option),
    modifier: Number(modifier) || 0
  });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content,
    style: CONST.CHAT_MESSAGE_STYLES.OTHER,
    flags: {[SYSTEM_ID]: {skillRollRequest: {
      skillKey: option.skillKey, catalogId: option.catalogId,
      modifier: Number(modifier) || 0, title: rollTitle
    }}}
  });
  return {skillKey: option.skillKey, catalogId: option.catalogId, modifier: Number(modifier) || 0, title: rollTitle};
}
