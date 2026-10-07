import {resolveDamage, parseSimpleDamageFormula} from "./equipment-resolver.mjs";
import {isThrowingWeapon, weaponType} from "./combat-pool-resolver.mjs";

const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
export const signedDamage = value => finite(value) > 0 ? `+${finite(value)}` : `${finite(value)}`;

/** Describe native effects without applying them again: prepared document data
 * is the authority, including non-additive changes and effects supplied by modules.
 */
function effectSources(document, keys) {
  const effects = document?.allApplicableEffects?.() ?? document?.effects ?? [];
  return Array.from(effects).filter(effect => !effect.disabled && !effect.isSuppressed && effect.active !== false)
    .flatMap(effect => Array.from(effect.system?.changes ?? []).filter(change => keys.includes(change.key)).map(change => {
      const type = change.type ?? change.mode;
      const value = type === "add" || type === 2 ? signedDamage(change.value)
        : type === "subtract" ? signedDamage(-finite(change.value))
          : type === "multiply" || type === 1 ? `× ${change.value}` : `= ${change.value}`;
      return `${effect.name} (${value})`;
    })).join(" · ");
}

/** One immutable snapshot shared by the confirmation dialog and the final card. */
export function prepareDamageRoll({item, actor = null, context = {}}) {
  const usage = context.usage || (isThrowingWeapon(item) ? "throwing"
    : ["crossbow", "bowsSlings"].includes(weaponType(item)) ? "ranged" : "melee");
  const ranged = ["throwing", "ranged"].includes(usage) || Boolean(context.longRange);
  const longRange = context.longRange ?? (ranged && item.system?.rangeSelection === "long");
  const resolution = resolveDamage({item, actor, context: {...context, usage}, modifiers: context.modifiers ?? []});
  const original = item._source?.system ?? item.system ?? {};
  const originalParsed = parseSimpleDamageFormula(original.damage);
  const intrinsic = finite(originalParsed?.modifier) + finite(original.damageBonus);
  const preparedIntrinsic = finite(resolution.parsed?.modifier) + resolution.modifier.base;
  const rows = [];
  if (intrinsic) rows.push({labelKey: "TRUDVANG.DamageRoll.Intrinsic", amount: intrinsic, value: signedDamage(intrinsic)});
  if (preparedIntrinsic !== intrinsic) rows.push({labelKey: "TRUDVANG.DamageRoll.ItemEffects", amount: preparedIntrinsic - intrinsic,
    value: signedDamage(preparedIntrinsic - intrinsic), source: effectSources(item, ["system.damageBonus", "system.damage"])});
  if (original.damage && String(original.damage).replace(/\s/g, "") !== resolution.formula) rows.push({labelKey: "TRUDVANG.DamageRoll.DiceEffects",
    value: `${original.damage} → ${resolution.formula}`, source: effectSources(item, ["system.damage"])});
  const originalOpen = finite(original.openRoll);
  if (originalOpen !== resolution.openRoll.base) rows.push({labelKey: "TRUDVANG.DamageRoll.OpenRollEffects",
    value: `${originalOpen} → ${resolution.openRoll.base}`, source: effectSources(item, ["system.openRoll"])});
  for (const step of resolution.modifier.steps) {
    if (!step.explanationKey && !step.source.name) continue;
    const source = step.id === "strength-damage" ? effectSources(actor, ["system.effective.traits.strength", "system.traits.strength"])
      : step.id === "actor-damage" ? effectSources(actor, ["system.modifiers.damage"]) : step.source.name;
    const labelKey = {"strength-damage": "TRUDVANG.DamageRoll.Strength", "actor-damage": "TRUDVANG.DamageRoll.ActorEffects",
      "improvised-throwing-damage": "TRUDVANG.DamageRoll.ImprovisedThrow"}[step.id];
    rows.push({labelKey: labelKey || step.explanationKey || "TRUDVANG.Dialog.EffectModifier", amount: step.delta,
      data: step.explanationData, value: signedDamage(step.delta), source});
  }
  // A zero net effect still deserves an explanation when its sources cancel out.
  const actorEffects = effectSources(actor, ["system.modifiers.damage"]);
  if (actorEffects && !finite(actor?.system?.modifiers?.damage)) rows.push({labelKey: "TRUDVANG.DamageRoll.ActorEffects", amount: 0, value: "0", source: actorEffects});
  for (const step of resolution.openRoll.steps) if (step.delta) rows.push({labelKey: step.explanationKey || "TRUDVANG.DamageRoll.OpenRollEffects",
    data: step.explanationData, value: `${step.before} → ${step.after}`, source: step.source.name});
  return {resolution, rows, ranged, longRange: Boolean(longRange), usage, formula: resolution.formula,
    parsed: resolution.parsed, openRoll: resolution.openRoll.value, fixedModifier: preparedIntrinsic + resolution.modifier.value - resolution.modifier.base,
    situational: finite(context.damageModifier), minimumTotal: resolution.minimumTotal};
}

/** Validate roll-only adjustments. Neither item data nor Combat Points are changed. */
export function damageRollChoice(profile, options = {}) {
  const dice = Number(options.dice ?? profile.parsed?.dice);
  const openRoll = Number(options.openRoll ?? profile.openRoll);
  const modifier = Number(options.modifier ?? profile.situational);
  const formula = String(options.formula ?? profile.formula).trim();
  if (!Number.isInteger(openRoll) || openRoll < 0 || openRoll > 10 || !Number.isFinite(modifier)
    || (profile.parsed && (!Number.isInteger(dice) || dice < 1 || dice > 100 || profile.parsed.faces < 1)) || (!profile.parsed && !formula)) return null;
  return {dice, formula, openRoll, modifier, longRange: profile.ranged && Boolean(options.longRange ?? profile.longRange),
    fixedModifier: profile.fixedModifier + modifier};
}
