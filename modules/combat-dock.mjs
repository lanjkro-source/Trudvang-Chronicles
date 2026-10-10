/**
 * System-side support for the combat-tracker-dock module (TheRipper93,
 * pinned at tag 5.0.2 / SHA 875b3fc for reference). The module itself is NOT
 * part of this repository, so every access below is defensive: the handler
 * no-ops when the module is absent or when its shape has drifted, and it
 * never throws.
 *
 * Registration happens at system init (see trudvang.mjs, next to
 * registerPortraitDirectoryHook) via the module's official
 * `combat-tracker-dock-init` hook. Without the module, zero behavior changes:
 * this file only adds a hook listener and touches the passed config object.
 */
import {ignoresWoundPenalties} from "./rules/npc-summary.mjs";
import {resolveNpcPreparedAction} from "./rules/npc-prepared-actions.mjs";
import {actorStateRollModifiers} from "./rules/roll-state-resolver.mjs";
import {resolveFearStatus} from "./rules/fear-resolver.mjs";

export const COMBAT_DOCK_SYSTEM_ID = "trudvang-chronicles";
export const COMBAT_DOCK_HOOK = "combat-tracker-dock-init";
/** Keep portrait icons few: at most this many prepared-attack icons. */
export const COMBAT_DOCK_MAX_ICONS = 6;
/** Actor-system path the dock tracks for total Combat Points. */
export const COMBAT_DOCK_COMBAT_PATH = "resources.combat.current";

function localize(key, fallback = "") {
  try {
    const value = globalThis.game?.i18n?.localize?.(key);
    if (typeof value === "string" && value !== "" && value !== key) return value;
  } catch {
    // Fall through to the fallback below; localization must never throw.
  }
  return fallback || key;
}

function format(key, data = {}) {
  try {
    const formatter = globalThis.game?.i18n?.format;
    if (typeof formatter === "function") return formatter.call(globalThis.game.i18n, key, data);
  } catch {
    // Fall through to the manual template below.
  }
  let text = localize(key, key);
  for (const [name, value] of Object.entries(data)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

function warn(key) {
  try {
    globalThis.ui?.notifications?.warn?.(localize(key, key));
  } catch {
    // Notifications are best-effort only.
  }
}

/** DOM-free HTML escaping (helpers.mjs needs `document`, unavailable in tests). */
export function escapeDockHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampPercentage(value, max) {
  if (!(max > 0)) return 0;
  return Math.max(0, Math.min(100, (Number(value) / Number(max)) * 100));
}

/**
 * Wound tier from Body Points, mirroring getDamageStatus() in
 * modules/documents/actor.mjs (kept private there): quartile thresholds over
 * damage taken, dying at zero or less. Returns the tier key only; labels
 * always come from TRUDVANG.Damage.* (never duplicated here).
 */
export function woundTier(bodyMax, bodyCurrent) {
  const max = Math.max(1, finiteNumber(bodyMax, 1));
  const current = finiteNumber(bodyCurrent, 0);
  const taken = Math.max(0, max - current);
  if (taken === 0) return "unhurt";
  // A combatant at or below zero Body Points is dying.
  if (current <= 0) return "dying";
  const baseRange = Math.floor(max / 4);
  const remainder = max % 4;
  const thresholds = Array.from({length: 4}, (_, index) => baseRange + (index < remainder ? 1 : 0))
    .reduce((ranges, range) => [...ranges, range + (ranges.at(-1) || 0)], []);
  const stage = Math.min(3, thresholds.findIndex(threshold => taken <= threshold));
  return ["light", "injured", "serious", "critical"][stage];
}

/**
 * Wound state label for a viewer without numeric health access. Tenace
 * (ignoresWoundPenalties: penalty 0, but HP loss and dying still apply) is
 * binary: dying (or dead) shows mourant, anything else shows indemne.
 * Otherwise the quartile tier label is reused from TRUDVANG.Damage.*.
 */
export function resolveWoundStateLabel(actor) {
  const body = actor?.system?.resources?.body ?? {};
  const raw = woundTier(body.max, body.current ?? body.value);
  const tenace = ignoresWoundPenalties(actor);
  const level = tenace ? (["dying", "dead"].includes(raw) ? "dying" : "unhurt") : raw;
  const labelKey = `TRUDVANG.Damage.${level}`;
  return {level, tenace, labelKey, label: localize(labelKey, level)};
}

/** Whether the current viewer may see numeric health. */
export function isPrivilegedViewer(actor) {
  try {
    if (actor?.isOwner) return true;
    const user = globalThis.game?.user;
    if (user?.isGM) return true;
    if (typeof actor?.testUserPermission === "function") {
      try {
        return Boolean(actor.testUserPermission(user, "OBSERVER"));
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Per-viewer health entry in the module's {max, value, percentage, iconHTML,
 * units} attribute shape. Privileged viewers (owner/controller/GM) get numeric
 * body.current/max with a heart icon; everyone else gets the wound STATE text
 * only (units "", no max).
 */
export function buildHealthAttribute(actor, {privileged} = {}) {
  const showNumbers = privileged ?? isPrivilegedViewer(actor);
  const iconHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
  if (!showNumbers) {
    const state = resolveWoundStateLabel(actor);
    return {max: null, value: state.label, percentage: 0, iconHTML, units: "",
      labelKey: state.labelKey, level: state.level};
  }
  const body = actor?.system?.resources?.body ?? {};
  const max = Math.max(0, finiteNumber(body.max, 0));
  const value = finiteNumber(body.current ?? body.value, 0);
  return {max, value, percentage: clampPercentage(value, max), iconHTML,
    units: localize("TRUDVANG.CombatDock.HealthUnits", "HP")};
}

/**
 * Conditional vitner/divinity entries (module attribute shape), only when the
 * reserve's current value is above zero.
 */
export function buildReserveAttributes(actor) {
  const entries = [];
  const definitions = [
    {key: "vitner", iconHTML: '<i class="fas fa-flask" aria-hidden="true"></i>',
      unitsKey: "TRUDVANG.CombatDock.VitnerUnits", unitsFallback: "VP"},
    {key: "divinity", iconHTML: '<i class="fas fa-sun" aria-hidden="true"></i>',
      unitsKey: "TRUDVANG.CombatDock.DivinityUnits", unitsFallback: "DP"}
  ];
  for (const definition of definitions) {
    const reserve = actor?.system?.resources?.[definition.key] ?? {};
    const value = finiteNumber(reserve.current ?? reserve.value, 0);
    if (!(value > 0)) continue;
    const max = Math.max(0, finiteNumber(reserve.max, 0));
    entries.push({key: definition.key, max, value, percentage: max > 0 ? clampPercentage(value, max) : 100,
      iconHTML: definition.iconHTML, units: localize(definition.unitsKey, definition.unitsFallback)});
  }
  return entries;
}

/** All prepared-action steps of an NPC, flattened with their coordinates. */
function preparedSteps(actor) {
  const steps = [];
  const combos = actor?.system?.attacks ?? [];
  combos.forEach((combo, comboIndex) => {
    (Array.from(combo ?? [])).forEach((row, stepIndex) => {
      let action = null;
      try {
        action = resolveNpcPreparedAction(actor, row);
      } catch {
        action = null;
      }
      if (!action) return;
      steps.push({comboIndex, stepIndex, row, action,
        used: (actor?.system?.usedPreparedActions ?? []).includes(`${comboIndex}:${stepIndex}`)});
    });
  });
  return steps;
}

/**
 * Clickable portrait icons: one entry per USABLE NPC prepared attack
 * (resolveNpcPreparedAction canUse), capped at COMBAT_DOCK_MAX_ICONS in book
 * order. Each callback fires actor.rollNpcPreparedAction(combo, step), gated
 * on owner-or-GM with a CannotRollForActor warning otherwise. Both `callback`
 * and `onClick` carry the same function so a drifted module shape still finds
 * one of them.
 */
export function buildPreparedIcons(actor) {
  if (actor?.type !== "npc") return [];
  const usable = preparedSteps(actor).filter(step => step.action?.canUse);
  return usable.slice(0, COMBAT_DOCK_MAX_ICONS).map(step => {
    const fire = () => {
      try {
        const user = globalThis.game?.user;
        if (!(actor?.isOwner || user?.isGM)) {
          warn("TRUDVANG.Warning.CannotRollForActor");
          return null;
        }
        return actor.rollNpcPreparedAction?.(step.comboIndex, step.stepIndex) ?? null;
      } catch {
        return null;
      }
    };
    const title = format("TRUDVANG.CombatDock.IconTitle",
      {name: step.action.name ?? step.row?.attack ?? "", points: step.action.points ?? 0});
    return {comboIndex: step.comboIndex, stepIndex: step.stepIndex,
      name: step.action.name ?? step.row?.attack ?? "",
      points: step.action.points ?? 0,
      icon: "fas fa-sword",
      iconHTML: '<i class="fas fa-sword" aria-hidden="true"></i>',
      title, tooltip: title, label: title,
      callback: fire, onClick: fire};
  });
}

/**
 * Tooltip description (plain text: the dock module escapes this field, so markup
 * would display as raw tags): NPC prepared-attack list (name + points +
 * used state, NON-clickable), quantified health/fear effect lines, and a
 * reserves reminder. Tooltips cannot host working buttons — the dock module
 * registers zero tooltip listeners and hover tears tooltips down — so the
 * prepared list is plain text here; rolling happens through the clickable
 * portrait icons from buildPreparedIcons() instead. The module already renders
 * the active-effects list itself, so this description never repeats it.
 */
export function buildDockDescription(actor) {
  if (!actor) return "";
  const parts = [];
  const body = actor.system?.resources?.body ?? {};
  const bodyMax = finiteNumber(body.max, 0);
  const bodyCurrent = finiteNumber(body.current ?? body.value, 0);
  const damage = actor.system?.damage ?? {};
  const state = resolveWoundStateLabel(actor);
  const woundPenalty = ignoresWoundPenalties(actor) ? 0 : finiteNumber(damage.penalty, 0);
  const fearValue = finiteNumber(actor.system?.resources?.fear?.current ?? actor.system?.resources?.fear?.value, 0);
  let fearLevel = "calm";
  let fearPenalty = finiteNumber(actor.system?.fearPenalty, 0);
  try {
    const status = resolveFearStatus({fear: fearValue, insane: Boolean(actor.system?.fearInsane)});
    fearLevel = status.level;
    if (Number.isFinite(Number(status.penalty))) fearPenalty = Number(status.penalty);
  } catch {
    // Keep the prepared fearPenalty fallback above.
  }
  const fearLabel = localize(`TRUDVANG.Status.FearState.${fearLevel}`, fearLevel);
  const modifiers = actor.system?.modifiers ?? {};
  const extraModifiers = [
    ["bodyValue", finiteNumber(modifiers.bodyValue, 0)],
    ["fearValue", finiteNumber(modifiers.fearValue, 0)],
    ["bodyMax", finiteNumber(modifiers.bodyMax, 0)]
  ].filter(([, value]) => value !== 0);
  // Plain text: the dock module HTML-escapes the description field, so any
  // markup would display as raw tags in the tooltip.
  parts.push(escapeDockHtml(format("TRUDVANG.CombatDock.HealthLine",
    {current: bodyCurrent, max: bodyMax, state: state.label})));
  let effectLine = `${format("TRUDVANG.CombatDock.EffectsLine", {wound: woundPenalty, fear: fearPenalty})}`
    + ` ${format("TRUDVANG.CombatDock.FearLine", {value: fearValue, state: fearLabel, penalty: fearPenalty})}`;
  if (extraModifiers.length) effectLine += ` (${extraModifiers.map(([key, value]) => `${key} ${value > 0 ? `+${value}` : value}`).join(", ")})`;
  if (state.tenace) effectLine += ` ${localize("TRUDVANG.CombatDock.TenaceNote", "Tenace")}`;
  parts.push(escapeDockHtml(effectLine));
  const combat = actor.system?.resources?.combat ?? {};
  const reserves = [`${finiteNumber(combat.current ?? combat.value, 0)} ${escapeDockHtml(localize("TRUDVANG.CombatDock.CombatUnits", "CP"))}`,
    `${bodyCurrent}/${bodyMax} ${escapeDockHtml(localize("TRUDVANG.CombatDock.HealthUnits", "HP"))}`];
  for (const key of ["vitner", "divinity"]) {
    const reserve = actor.system?.resources?.[key] ?? {};
    const value = finiteNumber(reserve.current ?? reserve.value, 0);
    if (!(value > 0)) continue;
    const units = escapeDockHtml(localize(`TRUDVANG.CombatDock.${key === "vitner" ? "VitnerUnits" : "DivinityUnits"}`,
      key === "vitner" ? "VP" : "DP"));
    reserves.push(`${value}/${finiteNumber(reserve.max, 0)} ${units}`);
  }
  parts.push(escapeDockHtml(format("TRUDVANG.CombatDock.ReservesLine", {reserves: reserves.join(" · ")})));
  if (actor.type === "npc") {
    const steps = preparedSteps(actor);
    if (steps.length) {
      const rows = actorStateRollModifiers(actor).map(row => `${row.value > 0 ? `+${row.value}` : row.value}`).join(", ");
      const items = steps.map(step => {
        const line = escapeDockHtml(format("TRUDVANG.CombatDock.PreparedRow",
          {name: step.action.name ?? step.row?.attack ?? "", points: step.action.points ?? 0,
            available: step.action.available ?? 0}));
        const used = step.used ? ` (${escapeDockHtml(localize("TRUDVANG.CombatDock.PreparedUsed", "used"))})` : "";
        return `${line}${used}`;
      }).join(", ");
      let title = escapeDockHtml(localize("TRUDVANG.CombatDock.PreparedTitle", "Prepared attacks"));
      if (rows) title += ` (${escapeDockHtml(rows)})`;
      parts.push(`${title} : ${items}`);
    } else {
      parts.push(escapeDockHtml(localize("TRUDVANG.CombatDock.NoPrepared", "No prepared actions")));
    }
  }
  // Joined as plain text: see the note above about module-side escaping.
  return parts.join(" · ");
}

/**
 * Tracked total-CP entry for defaultAttributesConfig. Uses the actor.system
 * path resources.combat.current; the module's getResource fallback resolves
 * the matching .max automatically, and the persisted mirror already equals
 * totalMax/totalTrackerCurrent (see prepareDerivedData). Deliberately NO
 * static HP entry here: that pipeline is viewer-blind and cannot enforce the
 * per-viewer health privacy applied in getData() below.
 */
export function buildTrackedCombatEntry() {
  // Shape required by the module: {attr, icon, units}. attr is read via
  // getResource (max falls back to the matching .max); icon must be a full
  // FA class. Extra fields below are ignored by the module and only serve
  // our own tests.
  return {attr: COMBAT_DOCK_COMBAT_PATH,
    icon: "fas fa-sword",
    resource: COMBAT_DOCK_COMBAT_PATH,
    path: COMBAT_DOCK_COMBAT_PATH,
    attribute: COMBAT_DOCK_COMBAT_PATH,
    units: localize("TRUDVANG.CombatDock.CombatUnits", "CP"),
    iconHTML: '<i class="fas fa-swords" aria-hidden="true"></i>'};
}

function appendTrudvangDockData(portrait, data) {
  if (!data || typeof data !== "object") return;
  const actor = portrait?.actor ?? portrait?.combatant?.actor ?? portrait?.document?.actor ?? null;
  if (!actor) return;
  const privileged = isPrivilegedViewer(actor);
  if (!Array.isArray(data.attributes)) data.attributes = [];
  try {
    data.attributes.push(buildHealthAttribute(actor, {privileged}));
  } catch {
    // A single failing entry must never break the whole portrait.
  }
  try {
    data.attributes.push(...buildReserveAttributes(actor));
  } catch {
    // Reserves are optional; ignore failures.
  }
  try {
    data.description = buildDockDescription(actor);
  } catch {
    // Keep any description the module already prepared.
  }
  try {
    const icons = buildPreparedIcons(actor);
    if (icons.length) {
      if (!Array.isArray(data.resSystemIcons)) data.resSystemIcons = [];
      data.resSystemIcons.push(...icons);
      try {
        portrait._trudvangDockIconCallbacks = icons.map(icon => icon.callback);
      } catch {
        // Callback stash is best-effort (frozen portrait objects).
      }
    }
  } catch {
    // Prepared icons are optional.
  }
}

/**
 * Register system support on the module's official init hook. All logic is
 * guarded: a missing config, a drifted module shape, or any unexpected error
 * results in a silent no-op, never a throw — and when the module is absent the
 * hook simply never fires, leaving zero behavior change.
 */
export function registerCombatDockSupport() {
  const hooks = globalThis.Hooks;
  if (!hooks || typeof hooks.on !== "function") return;
  hooks.on(COMBAT_DOCK_HOOK, config => {
    try {
      if (!config?.CombatantPortrait) return;
      try {
        config.defaultAttributesConfig ??= {};
        config.defaultAttributesConfig[COMBAT_DOCK_SYSTEM_ID] = buildTrackedCombatEntry();
      } catch {
        // Tracking config is optional; continue with the portrait subclass.
      }
      const Base = config.CombatantPortrait;
      if (typeof Base !== "function") return;
      class TrudvangCombatantPortrait extends Base {
        async getData(...args) {
          const data = await super.getData(...args);
          try {
            appendTrudvangDockData(this, data);
          } catch {
            // Never break portrait rendering.
          }
          return data;
        }
        activateListeners(...args) {
          let bound = true;
          try {
            super.activateListeners(...args);
          } catch {
            // The module binds .system-icon nodes against its own icon array,
            // which knows nothing of our appended prepared-attack icons
            // (undefined.callback). Its own icons precede ours in the DOM and
            // are already bound at that point; bind ours below.
            bound = false;
          }
          if (bound) return;
          try {
            const root = this.element?.querySelectorAll ? this.element
              : this.element?.[0]?.querySelectorAll ? this.element[0] : null;
            const callbacks = Array.isArray(this._trudvangDockIconCallbacks)
              ? this._trudvangDockIconCallbacks : [];
            if (!root || !callbacks.length) return;
            const nodes = Array.from(root.querySelectorAll(".system-icon"));
            const ours = nodes.slice(Math.max(0, nodes.length - callbacks.length));
            ours.forEach((node, index) => {
              const fire = callbacks[index];
              if (typeof fire !== "function") return;
              node.addEventListener("click", event => fire(event));
            });
          } catch {
            // Never break portrait rendering.
          }
        }
      }
      // The module instantiates portraits through this config namespace, so
      // replacing the class here picks the subclass up without any fork.
      config.CombatantPortrait = TrudvangCombatantPortrait;
    } catch {
      // Never break the dock module, whatever it passes us.
    }
  });
}
