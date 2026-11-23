const SCOPE = "trudvang-chronicles";

// Livre des règles pp. 144–145 / Player's Handbook pp. 84–86.
export const FATAL_MAGIC_ROWS = Object.freeze({
  21: {duration: "1d3", lethargy: true},
  23: {duration: "1d3", reduction: "1d10"},
  25: {duration: "1d3", reduction: "1d10", lethargy: true},
  29: {duration: "1d6", reduction: "1d10", lethargy: true},
  31: {days: 1, reduction: "1d10x>=9"},
  33: {last: 34, drain: "1d3", excludeCaster: true},
  35: {last: 36, enclosure: {radius: 10, damage: "1d6", protection: "magical", castersOnly: true}},
  37: {last: 38, drain: "1d6"},
  39: {last: 40, negation: "1d3"},
  41: {last: 42, enclosure: {radius: 20, damage: "1d6", protection: "magical", castersOnly: true}},
  43: {last: 43, drain: "1d10"},
  44: {last: 44, enclosure: {radius: 50, damage: "1d6", protection: "magical", castersOnly: true, automatic: true}},
  45: {last: 45, negation: "1d6"},
  46: {last: 46, drain: "1d6", blindness: "1d6"},
  47: {last: 47, enclosure: {radius: "1d10x>=10", damage: "1d10", protection: "mundane", charge: "1d3"}},
  48: {medical: true, condition: "amnesia", duration: "1d3", units: "days"},
  49: {days: 7, depleted: true},
  50: {last: 50, enclosure: {radius: "1d10x>=9", damage: "1d10", protection: "mundane", charge: 1}},
  51: {last: 51, burst: {damage: "1d10", recoveryDays: 7}},
  52: {medical: true, condition: "unconscious", duration: "1d10", units: "minutes", costDamage: true, depletionDays: 7},
  53: {last: 53, burst: {blind: true, costDamage: true}, medical: true, condition: "unconscious", duration: "1d10x>=9", units: "minutes", costDamage: true, depletionDays: 7},
  54: {medical: true, condition: "coma", duration: "1d10", units: "days", damage: "2d10x>=10"},
  55: {last: 55, burst: {othersHalf: true, costDamage: true}, medical: true, condition: "unconscious", duration: "1d10x>=7", units: "minutes", costDamage: true, depletionDays: 14},
  56: {medical: true, condition: "unconscious", duration: "1d10", units: "days", damage: "2d10x>=9", intellect: true},
  57: {medical: true, damage: "1d10x>=6", depletionDays: 14},
  58: {last: 58, portal: true},
  59: {last: 59, orb: {duration: "2d6", radius: 50, damage: "1d10x>=7"}},
  60: {last: Infinity, orb: {duration: "1d6", radius: 100, outer: 300, damage: "1d10x>=5"}}
});

export async function planFatalMagic(row, roll) {
  const rule = FATAL_MAGIC_ROWS[row];
  if (!rule || fatalMagicHasArea(rule) || rule.medical || rule.enclosure || rule.portal) return null;
  const duration = rule.days ? {value: rule.days, units: "days"}
    : {value: await roll(rule.duration), units: "hours"};
  return {
    duration, lethargy: Boolean(rule.lethargy), depleted: Boolean(rule.depleted),
    reduction: rule.reduction ? await roll(rule.reduction) : 0
  };
}

export const fatalMagicHasArea = rule => Boolean(rule?.drain || rule?.negation || rule?.burst || rule?.orb);

export const fatalNegationAppearance = die => ["Bark", "Fingers", "Grass", "Fur"][Math.floor((die - 1) / 2)] ?? "";

function activeFatalMagic(actor) {
  return Array.from(actor?.effects?.values?.() ?? actor?.effects ?? []).filter(effect =>
    !effect.disabled && !effect.isSuppressed && !effect.duration?.expired)
    .map(effect => effect.flags?.[SCOPE]?.fatalMagic).filter(Boolean);
}

export function fatalSpellBlindness(actor) {
  return activeFatalMagic(actor).some(effect => effect.blindness);
}

export function fatalAmnesia(actor) {
  return activeFatalMagic(actor).some(effect => effect.amnesia);
}

export function fatalAbsence(actor) {
  return activeFatalMagic(actor).some(effect => effect.absent || effect.orb);
}

export function fatalRecoveryBlocked(actor) {
  return activeFatalMagic(actor).some(effect => effect.depleted || effect.recoveryBlocked);
}

export function fatalOrbRemaining(orb, time, combat) {
  const elapsed = Math.max(0, Number(time) - orb.startTime,
    combat?.id && combat.id === orb.combatId ? 5 * (Number(combat.round) - orb.startRound) : 0);
  return Math.max(0, Math.ceil((orb.rounds * 5 - elapsed) / 5));
}

export async function planFatalMedical(row, roll, cost) {
  const rule = FATAL_MAGIC_ROWS[row];
  if (!rule?.medical || (rule.costDamage && !(Number.isInteger(cost) && cost >= 0))) return null;
  return {
    condition: rule.condition ?? null,
    duration: rule.duration ? {value: await roll(rule.duration), units: rule.units} : null,
    depletionDays: rule.depletionDays ?? 0,
    damage: rule.costDamage ? cost : rule.damage ? await roll(rule.damage) : 0,
    intellect: Boolean(rule.intellect)
  };
}

export function fatalVitnerState(actor, normalMaximum) {
  const effects = activeFatalMagic(actor);
  if (effects.some(effect => effect.depleted)) return {max: 1, withheld: 0, depleted: true};
  const losses = effects.reduce((sum, effect) => sum + Math.max(0, Number(effect.reduction) || 0)
    + (effect.third ? Math.floor(normalMaximum / 3) : 0), 0);
  const withheld = Math.min(losses, Math.max(0, normalMaximum - 1));
  return {max: normalMaximum - withheld, withheld, depleted: false};
}

/** The stored value includes inaccessible points, so each point spent during
 * the reduction leaves one fewer point when the effect expires. */
export function storedVitnerForCurrent(actor, current) {
  return Math.max(0, current + (actor.fatalVitnerState?.withheld ?? 0) - Number(actor.system.modifiers?.vitnerValue || 0));
}

export function absorbsVitnerFrom(actor) {
  const vitner = actor.system?.resources?.vitner;
  return Number(vitner?.max || 0) > 0 || Number(vitner?.current ?? vitner?.value ?? 0) > 0
    || Boolean(actor.selectedVitnerType || actor.unlimitedVitner || Array.from(actor.items ?? []).some(item => item.type === "spell"));
}
