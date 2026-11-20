const SCOPE = "trudvang-chronicles";

// Livre des règles p. 207 / Player's Handbook p. 151. Keys are the
// lower bounds of the stock table rows, independent of their language.
export const DIVINE_FAILURE_ROWS = Object.freeze({
  21: {kind: "link", formula: "1d6", units: "minutes"},
  31: {kind: "link", formula: "1d6", units: "hours"},
  36: {kind: "powers", random: true, formula: "1d6", units: "days"},
  41: {kind: "powers", formula: "2d6", units: "days"},
  46: {kind: "powers", random: true, formula: "2d6", units: "days"},
  51: {kind: "link", formula: "1d6", units: "days"},
  55: {kind: "powers"},
  57: {kind: "powers", random: true},
  59: {kind: "wrath"}
});

export function divinePowerId(item) {
  if (!item) return "";
  return item.system?.catalogId || (item.id ? `item:${item.id}` : "");
}

function activeFailures(actor) {
  return Array.from(actor?.effects ?? [])
    .filter(effect => !effect.disabled && !effect.isSuppressed && !effect.duration?.expired)
    .map(effect => effect.flags?.[SCOPE]?.divineFailure).filter(Boolean);
}

export function divineFailureRestriction(actor, powerId, {spending = true} = {}) {
  const failures = activeFailures(actor);
  if (failures.some(effect => effect.kind === "wrath")) return "TRUDVANG.DivineFailure.Wrath";
  if (failures.some(effect => effect.kind === "link") && spending) return "TRUDVANG.DivineFailure.LinkLost";
  if (powerId && failures.some(effect => effect.powerIds?.includes(powerId))) return "TRUDVANG.DivineFailure.PowerLost";
  return "";
}

export function divineFailurePowers(actor) {
  const items = Array.from(actor?.items ?? []);
  const tablets = new Map(items.filter(item => item.type === "tablet").map(item => [item.system.catalogId, item]));
  const powers = new Map();
  for (const item of items) {
    if (item.type !== "divineFeat" && !item.system?.isRune) continue;
    if (item.flags?.[SCOPE]?.transformationGrant) continue;
    const tabletId = item.system.tabletId;
    const tablet = tablets.get(tabletId);
    if (tablet && Number(tablet.system.level ?? 0) < Number(item.system.level || 1)) continue;
    if (tabletId && !tablet && actor.type !== "npc") continue;
    const id = divinePowerId(item);
    if (id && !powers.has(id) && !divineFailureRestriction(actor, id, {spending: false})) {
      powers.set(id, {id, name: item.name});
    }
  }
  return [...powers.values()];
}

export async function planDivineFailure(row, {power, candidates = [], roll}) {
  const rule = DIVINE_FAILURE_ROWS[row];
  if (!rule) return null;
  const powers = [];
  if (rule.random) {
    const available = [...candidates];
    const count = Math.min(await roll("1d3"), available.length);
    for (let index = 0; index < count; index++) {
      const selected = available.length === 1 ? 0 : (await roll(`1d${available.length}`)) - 1;
      powers.push(...available.splice(selected, 1));
    }
  } else if (rule.kind === "powers" && power?.id) {
    powers.push(power);
  }
  if (rule.kind === "powers" && !powers.length) return null;
  const duration = rule.formula
    ? {value: await roll(rule.formula), units: rule.units}
    : {value: null, units: "rounds"};
  return {kind: rule.kind, powers, duration};
}
