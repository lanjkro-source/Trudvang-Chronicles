/**
 * Pure equipment calculation primitives.
 *
 * Persisted Item data remains the intrinsic profile. A resolution is an ephemeral,
 * actor-specific snapshot whose ordered steps explain how the effective value was
 * obtained. Keeping this module independent from Foundry makes the rule pipeline
 * directly testable and prevents sheets and rolls from reimplementing calculations.
 */

export const EQUIPMENT_RESOLUTION_VERSION = 1;

export const EQUIPMENT_MODIFIER_PHASES = Object.freeze({
  item: 100,
  wearer: 200,
  effect: 300,
  constraint: 400
});

export const EQUIPMENT_MODIFIER_OPERATIONS = Object.freeze([
  "add",
  "subtract",
  "multiply",
  "set",
  "minimum",
  "maximum"
]);

const SUPPORTED_OPERATIONS = new Set(EQUIPMENT_MODIFIER_OPERATIONS);

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function specialtyItem(actor, catalogId) {
  if (!actor || !catalogId) return null;
  if (typeof actor.findKnowledgeItem === "function") return actor.findKnowledgeItem(catalogId) ?? null;
  return Array.from(actor.items || []).find(item => item?.system?.catalogId === catalogId) ?? null;
}

function sourceSnapshot(source = {}) {
  return {
    kind: source.kind || "rule",
    id: source.id || "",
    uuid: source.uuid || "",
    name: source.name || "",
    level: finiteNumber(source.level, 0)
  };
}

function normalizeModifier(modifier, index) {
  modifier ||= {};
  const namedPhase = typeof modifier.phase === "string" && Object.hasOwn(EQUIPMENT_MODIFIER_PHASES, modifier.phase);
  const phase = namedPhase
    ? EQUIPMENT_MODIFIER_PHASES[modifier.phase]
    : finiteNumber(modifier.phase, EQUIPMENT_MODIFIER_PHASES.effect);
  return {
    id: modifier.id || `modifier-${index}`,
    target: modifier.target || "",
    operation: modifier.operation || "add",
    amount: finiteNumber(modifier.amount ?? modifier.value, Number.NaN),
    phase,
    priority: finiteNumber(modifier.priority, 0),
    applies: modifier.applies !== false,
    ignoredReasonKey: modifier.ignoredReasonKey || "",
    source: sourceSnapshot(modifier.source),
    explanationKey: modifier.explanationKey || "",
    explanationData: {...(modifier.explanationData || {})},
    rule: modifier.rule ? {...modifier.rule} : null,
    index
  };
}

function applyOperation(before, operation, amount) {
  switch (operation) {
    case "add": return before + amount;
    case "subtract": return before - amount;
    case "multiply": return before * amount;
    case "set": return amount;
    case "minimum": return Math.max(before, amount);
    case "maximum": return Math.min(before, amount);
    default: return before;
  }
}

/** Resolve one numeric characteristic and retain every applied or ignored step. */
export function resolveNumericEquipmentStat({
  key,
  base = 0,
  modifiers = [],
  minimum = null,
  maximum = null,
  integer = false
} = {}) {
  const intrinsic = finiteNumber(base, 0);
  let value = intrinsic;
  const steps = [];
  const ignored = [];
  const ordered = modifiers
    .map(normalizeModifier)
    .filter(modifier => !modifier.target || modifier.target === key)
    .sort((left, right) => left.phase - right.phase || left.priority - right.priority || left.index - right.index);

  for (const modifier of ordered) {
    let reasonKey = modifier.ignoredReasonKey;
    if (!modifier.applies) reasonKey ||= "TRUDVANG.Calculation.Equipment.IgnoredCondition";
    else if (!SUPPORTED_OPERATIONS.has(modifier.operation)) reasonKey = "TRUDVANG.Calculation.Equipment.UnsupportedOperation";
    else if (!Number.isFinite(modifier.amount)) reasonKey = "TRUDVANG.Calculation.Equipment.InvalidAmount";
    if (reasonKey) {
      ignored.push({...modifier, reasonKey});
      continue;
    }

    const before = value;
    value = applyOperation(before, modifier.operation, modifier.amount);
    if (integer) value = Math.trunc(value);
    steps.push({...modifier, before, after: value, delta: value - before});
  }

  const beforeConstraint = value;
  if (minimum !== null) value = Math.max(value, finiteNumber(minimum, value));
  if (maximum !== null) value = Math.min(value, finiteNumber(maximum, value));
  if (integer) value = Math.trunc(value);
  if (value !== beforeConstraint) {
    steps.push({
      id: `${key}-constraint`,
      target: key,
      operation: "set",
      amount: value,
      phase: EQUIPMENT_MODIFIER_PHASES.constraint,
      priority: 0,
      applies: true,
      source: sourceSnapshot({kind: "constraint", id: key}),
      explanationKey: "TRUDVANG.Calculation.Equipment.Constraint",
      explanationData: {minimum, maximum},
      rule: null,
      before: beforeConstraint,
      after: value,
      delta: value - beforeConstraint
    });
  }

  return {key, base: intrinsic, value, modified: value !== intrinsic, steps, ignored};
}

function twoHandedWeaponActionModifiers(item, actor) {
  if (item?.type !== "weapon" || item.system?.category !== "twoHanded") return [];
  const specialty = specialtyItem(actor, "twoHandedWeapons");
  const level = finiteNumber(specialty?.system?.level, 0);
  const source = {
    kind: "specialty",
    id: "twoHandedWeapons",
    uuid: specialty?.uuid || "",
    name: specialty?.name || "",
    level
  };
  return [3, 5].filter(threshold => level >= threshold).map(threshold => ({
    id: `twoHandedWeapons-${threshold}`,
    target: "weaponActions",
    operation: "add",
    amount: 1,
    phase: "wearer",
    priority: threshold,
    source,
    explanationKey: "TRUDVANG.Calculation.Equipment.TwoHandedWeaponActions",
    explanationData: {level, threshold, amount: 1},
    rule: {book: "coreRules", printedPage: 81, englishBook: "playersHandbook", englishPrintedPage: 59}
  }));
}

/** Resolve the first implemented contextual characteristic: weapon actions (AA/WA). */
export function resolveWeaponActions({item, actor = null, modifiers = []} = {}) {
  return resolveNumericEquipmentStat({
    key: "weaponActions",
    base: item?.system?.weaponActions,
    modifiers: [...twoHandedWeaponActionModifiers(item, actor), ...modifiers],
    minimum: 0,
    integer: true
  });
}

/**
 * Public resolver contract. Further equipment characteristics and wearer impacts
 * will be added to these maps without changing callers or persisted Item data.
 */
export function resolveEquipment({item, actor = null, context = {}, modifiers = []} = {}) {
  const characteristics = {};
  if (["weapon", "shield"].includes(item?.type)) {
    characteristics.weaponActions = resolveWeaponActions({item, actor, modifiers});
  }
  return {
    version: EQUIPMENT_RESOLUTION_VERSION,
    equipment: {
      id: item?.id || "",
      uuid: item?.uuid || "",
      type: item?.type || "",
      name: item?.name || ""
    },
    wearer: actor ? {id: actor.id || "", uuid: actor.uuid || "", name: actor.name || ""} : null,
    context: {
      equipped: Boolean(item?.system?.equipped),
      hand: context.hand || null,
      usage: context.usage || null
    },
    characteristics,
    wearerImpacts: {}
  };
}
