import { weaponType, weaponUsesSeparateHands } from "./combat-pool-resolver.mjs";

// Intentional house rule: these MI/MM values use a finer progression than the
// official grouped table. Do not “correct” them to the book values without an
// explicit request from the project owner.
export const ARMOR_ENCUMBRANCE_PENALTIES = Object.freeze({0: [0, 0], 1: [0, 0], 2: [-1, 0], 3: [-1, -1], 4: [-1, -1], 5: [-2, -1], 6: [-2, -2], 7: [-3, -2], 8: [-3, -3], 9: [-4, -3], 10: [-5, -4]});

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

function itemProtection(item) {
  return Math.ceil(Math.max(0, finiteNumber(item?.system?.breach?.value, 0)) / 10);
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
  if (item?.type !== "weapon" || weaponType(item) !== "twoHandedWeapons") return [];
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

/** Parse the standard Trudvang damage notation without evaluating a roll. */
export function parseSimpleDamageFormula(value) {
  const formula = String(value || "1d10").replace(/\s/g, "");
  const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return {
    formula,
    dice: Number(match[1]),
    faces: Number(match[2]),
    modifier: Number(match[3] || 0)
  };
}

const THROWING_RANGES = Object.freeze({
  oneHandedLightWeapons: {short: 15, long: 20},
  oneHandedHeavyWeapons: {short: 10, long: 15},
  twoHandedWeapons: {short: 5, long: 9}
});

/** Resolve the rule-table range of a thrown melee weapon, adjusted by Strength. */
export function resolveThrowingRange({item, actor = null} = {}) {
  const base = THROWING_RANGES[weaponType(item)];
  if (!base) return null;
  const strength = finiteNumber(actor?.getTraitValue?.("strength") ?? actor?.system?.traits?.strength, 0);
  const short = Math.max(0, base.short + strength);
  return {short, long: Math.max(short, base.long + strength), strength};
}

function improvisedThrowingDamageModifiers(item, context) {
  if (context.usage !== "throwing" || item?.system?.isThrowingWeapon) return [];
  return [{
    id: "improvised-throwing-damage",
    target: "damageModifier",
    operation: "subtract",
    amount: 5,
    phase: "item",
    source: {kind: "rule", id: "improvisedThrowingWeapon"},
    explanationKey: "TRUDVANG.Calculation.Equipment.ImprovisedThrowingDamage",
    explanationData: {amount: -5},
    rule: {book: "coreRules", printedPage: 118, englishBook: "gameMastersGuide", englishPrintedPage: 76}
  }];
}

function strengthDamageModifiers(item, actor, context) {
  const rangedUsage = context.usage === "ranged" || (!context.usage && ["crossbow", "bowsSlings"].includes(weaponType(item)));
  if (!actor || rangedUsage || !item?.system?.strengthApplies) return [];
  const value = finiteNumber(actor.getTraitValue?.("strength") ?? actor.system?.traits?.strength, 0);
  return [{
    id: "strength-damage",
    target: "damageModifier",
    operation: "add",
    amount: value,
    phase: "wearer",
    priority: 0,
    source: {kind: "trait", id: "strength", level: value},
    explanationKey: "TRUDVANG.Calculation.Equipment.StrengthDamage",
    explanationData: {amount: value},
    rule: {book: "coreRules", printedPage: 16, englishBook: "playersHandbook", englishPrintedPage: 16}
  }];
}

function shieldHandActionModifiers(item, actor, context) {
  const supportsSeparateHands = weaponUsesSeparateHands(item);
  const usesShieldHand = weaponType(item) !== "natural" && (
    item?.type === "shield" || ["shield", "offHand"].includes(context.hand)
  ) && (item?.type === "shield" || supportsSeparateHands);
  if (!usesShieldHand) return [];

  const bodyControl = specialtyItem(actor, "bodyControl");
  const bodyControlLevel = finiteNumber(bodyControl?.system?.level, 0);
  const ambidexterity = specialtyItem(actor, "ambidexterity");
  const ambidexterityLevel = finiteNumber(ambidexterity?.system?.level, 0);
  const shieldBearer = specialtyItem(actor, "shieldBearer");
  const shieldBearerLevel = finiteNumber(shieldBearer?.system?.level, 0);
  const modifiers = [{
    id: "shield-hand-penalty",
    target: "combatActionModifier",
    operation: "subtract",
    amount: 15,
    phase: "item",
    source: {kind: "rule", id: "shieldHand"},
    explanationKey: "TRUDVANG.Calculation.Equipment.ShieldHandPenalty",
    explanationData: {amount: -15},
    rule: {book: "coreRules", printedPage: 318, englishBook: "gameMastersGuide", englishPrintedPage: 44}
  }];

  if (bodyControlLevel > 0) modifiers.push({
    id: "body-control-shield-hand",
    target: "combatActionModifier",
    operation: "add",
    amount: bodyControlLevel,
    phase: "wearer",
    priority: 10,
    source: {kind: "discipline", id: "bodyControl", uuid: bodyControl?.uuid, name: bodyControl?.name, level: bodyControlLevel},
    explanationKey: "TRUDVANG.Calculation.Equipment.BodyControlShieldHand",
    explanationData: {level: bodyControlLevel, amount: bodyControlLevel},
    rule: {book: "coreRules", printedPage: 75, englishBook: "playersHandbook", englishPrintedPage: 47}
  });

  if (ambidexterityLevel > 0) modifiers.push({
    id: "ambidexterity-shield-hand",
    target: "combatActionModifier",
    operation: "add",
    amount: ambidexterityLevel * 2,
    phase: "wearer",
    priority: 20,
    source: {kind: "specialty", id: "ambidexterity", uuid: ambidexterity?.uuid, name: ambidexterity?.name, level: ambidexterityLevel},
    explanationKey: "TRUDVANG.Calculation.Equipment.AmbidexterityShieldHand",
    explanationData: {level: ambidexterityLevel, amount: ambidexterityLevel * 2},
    rule: {book: "coreRules", printedPage: 75, englishBook: "playersHandbook", englishPrintedPage: 47}
  });

  if (item?.type === "shield" && shieldBearerLevel > 0) modifiers.push({
    id: "shield-bearer-shield-hand",
    target: "combatActionModifier",
    operation: "set",
    amount: 0,
    phase: "wearer",
    priority: 30,
    source: {kind: "specialty", id: "shieldBearer", uuid: shieldBearer?.uuid, name: shieldBearer?.name, level: shieldBearerLevel},
    explanationKey: "TRUDVANG.Calculation.Equipment.ShieldBearerShieldHand",
    explanationData: {level: shieldBearerLevel},
    rule: {book: "coreRules", printedPage: 82, englishBook: "playersHandbook", englishPrintedPage: 59}
  });

  return modifiers;
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

/** Resolve an item's intrinsic damage notation and its contextual fixed modifier. */
export function resolveDamage({item, actor = null, context = {}, modifiers = []} = {}) {
  const formula = String(item?.system?.damage || "1d10").replace(/\s/g, "");
  return {
    formula,
    parsed: parseSimpleDamageFormula(formula),
    openRoll: resolveNumericEquipmentStat({
      key: "openRoll",
      base: item?.system?.openRoll,
      modifiers,
      minimum: 0,
      maximum: 10,
      integer: true
    }),
    modifier: resolveNumericEquipmentStat({
      key: "damageModifier",
      base: item?.system?.damageBonus,
      modifiers: [...improvisedThrowingDamageModifiers(item, context), ...strengthDamageModifiers(item, actor, context), ...modifiers]
    }),
    minimumTotal: 1
  };
}

/** Resolve the SV modifier for an action performed with the shield hand. */
export function resolveCombatActionModifier({item, actor = null, context = {}, modifiers = []} = {}) {
  return resolveNumericEquipmentStat({
    key: "combatActionModifier",
    base: 0,
    modifiers: [...shieldHandActionModifiers(item, actor, context), ...modifiers],
    maximum: 0,
    integer: true
  });
}

/** Resolve armor heft and every wearer-dependent penalty derived from it. */
export function resolveArmorProfile({item, actor = null, modifiers = []} = {}) {
  const baseHeft = Math.min(10, Math.max(0, finiteNumber(item?.system?.heft, 0)));
  const ironclad = specialtyItem(actor, "ironclad");
  const ironcladLevel = finiteNumber(ironclad?.system?.level, 0);
  const heftModifiers = baseHeft > 1 && ironcladLevel > 0 ? [{
    id: "ironclad-heft",
    target: "heft",
    operation: "subtract",
    amount: ironcladLevel,
    phase: "wearer",
    source: {kind: "specialty", id: "ironclad", uuid: ironclad?.uuid, name: ironclad?.name, level: ironcladLevel},
    explanationKey: "TRUDVANG.Calculation.Equipment.IroncladHeft",
    explanationData: {level: ironcladLevel, amount: -ironcladLevel},
    rule: {book: "coreRules", printedPage: 119, englishBook: "gameMastersGuide", englishPrintedPage: 79}
  }] : [];
  const heft = resolveNumericEquipmentStat({key: "heft", base: baseHeft, modifiers: [...heftModifiers, ...modifiers], minimum: baseHeft > 1 ? 1 : 0, maximum: 10, integer: true});
  const [baseInitiative, baseMovement] = ARMOR_ENCUMBRANCE_PENALTIES[baseHeft] ?? [0, 0];
  const [reducedInitiative, reducedMovement] = ARMOR_ENCUMBRANCE_PENALTIES[heft.value] ?? [0, 0];
  const armorBearer = specialtyItem(actor, "armorBearer");
  const armorBearerLevel = finiteNumber(armorBearer?.system?.level, 0);
  const overload = Math.max(0, Math.ceil(heft.value / 2) - armorBearerLevel);
  const shared = [];
  if (reducedInitiative !== baseInitiative || reducedMovement !== baseMovement) shared.push({
    id: "ironclad-armor-penalty",
    operation: "add",
    phase: "wearer",
    source: {kind: "specialty", id: "ironclad", uuid: ironclad?.uuid, name: ironclad?.name, level: ironcladLevel},
    explanationKey: "TRUDVANG.Calculation.Equipment.IroncladArmorPenalty",
    explanationData: {level: ironcladLevel},
    rule: {book: "coreRules", printedPage: 119, englishBook: "gameMastersGuide", englishPrintedPage: 79}
  });
  const initiativeModifiers = shared.map(entry => ({...entry, target: "initiativeModifier", amount: reducedInitiative - baseInitiative}));
  const movementModifiers = shared.map(entry => ({...entry, target: "movementModifier", amount: reducedMovement - baseMovement}));
  if (overload > 0) {
    const source = {kind: "specialty", id: "armorBearer", uuid: armorBearer?.uuid || "", name: armorBearer?.name || "", level: armorBearerLevel};
    const rule = {book: "coreRules", printedPage: 119, englishBook: "gameMastersGuide", englishPrintedPage: 79};
    initiativeModifiers.push({id: "armor-overload-initiative", target: "initiativeModifier", operation: "subtract", amount: overload * 2, phase: "wearer", source, explanationKey: "TRUDVANG.Calculation.Equipment.ArmorOverload", explanationData: {heft: heft.value, level: armorBearerLevel, amount: -(overload * 2)}, rule});
    movementModifiers.push({id: "armor-overload-movement", target: "movementModifier", operation: "subtract", amount: overload * 2, phase: "wearer", source, explanationKey: "TRUDVANG.Calculation.Equipment.ArmorOverload", explanationData: {heft: heft.value, level: armorBearerLevel, amount: -(overload * 2)}, rule});
  }
  return {
    heft,
    initiativeModifier: resolveNumericEquipmentStat({key: "initiativeModifier", base: baseInitiative, modifiers: initiativeModifiers, integer: true}),
    movementModifier: resolveNumericEquipmentStat({key: "movementModifier", base: baseMovement, modifiers: movementModifiers, integer: true}),
    combatActionModifier: resolveNumericEquipmentStat({key: "combatActionModifier", base: 0, modifiers: overload > 0 ? [{id: "armor-overload-actions", target: "combatActionModifier", operation: "subtract", amount: overload * 2, phase: "wearer", source: {kind: "specialty", id: "armorBearer", uuid: armorBearer?.uuid || "", name: armorBearer?.name || "", level: armorBearerLevel}, explanationKey: "TRUDVANG.Calculation.Equipment.ArmorOverload", explanationData: {heft: heft.value, level: armorBearerLevel, amount: -(overload * 2)}, rule: {book: "coreRules", printedPage: 119, englishBook: "gameMastersGuide", englishPrintedPage: 79}}] : [], maximum: 0, integer: true}),
    protection: resolveNumericEquipmentStat({key: "protection", base: itemProtection(item), modifiers, minimum: 0, integer: true})
  };
}

/**
 * Public resolver contract. Further equipment characteristics and wearer impacts
 * will be added to these maps without changing callers or persisted Item data.
 */
export function resolveEquipment({item, actor = null, context = {}, modifiers = []} = {}) {
  const characteristics = {
    weight: resolveNumericEquipmentStat({key: "weight", base: item?.system?.weight, modifiers, minimum: 0})
  };
  if (["weapon", "shield"].includes(item?.type)) {
    characteristics.weaponActions = resolveWeaponActions({item, actor, modifiers});
    characteristics.damage = resolveDamage({item, actor, context, modifiers});
    characteristics.combatActionModifier = resolveCombatActionModifier({item, actor, context, modifiers});
    characteristics.combatPointBonus = resolveNumericEquipmentStat({key: "combatPointBonus", base: item?.system?.combatPointBonus, modifiers, integer: true});
    characteristics.initiativeModifier = resolveNumericEquipmentStat({key: "initiativeModifier", base: item?.system?.initiativeModifier, modifiers, integer: true});
    characteristics.protection = resolveNumericEquipmentStat({key: "protection", base: itemProtection(item), modifiers, minimum: 0, integer: true});
    if (item.type === "weapon" && item.system?.isThrowingWeapon) characteristics.throwingRange = resolveThrowingRange({item, actor});
    if (item.type === "shield") characteristics.passiveProtection = resolveNumericEquipmentStat({key: "passiveProtection", base: item?.system?.passiveProtection, modifiers, minimum: 0, integer: true});
  }
  if (item?.type === "armor") {
    Object.assign(characteristics, resolveArmorProfile({item, actor, modifiers}));
  }
  const equipped = Boolean(item?.system?.equipped);
  const conditionalInitiative = equipped && ["weapon", "shield"].includes(item?.type);
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
    wearerImpacts: {
      initiative: characteristics.initiativeModifier ? {value: characteristics.initiativeModifier.value, applies: equipped && item.type === "armor", conditional: conditionalInitiative} : null,
      movement: characteristics.movementModifier ? {value: characteristics.movementModifier.value, applies: equipped, conditional: false} : null,
      protection: characteristics.protection && item.type === "armor" ? {value: characteristics.protection.value, applies: equipped, conditional: false} : null,
      combatActions: characteristics.combatActionModifier && item.type === "armor" ? {value: characteristics.combatActionModifier.value, applies: equipped, conditional: false} : null
    }
  };
}
