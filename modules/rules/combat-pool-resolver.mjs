/** Pure, Foundry-independent resolution of Trudvang's linked Combat Point pools. */

export const COMBAT_POOL_IDS = Object.freeze([
  "free",
  "battleExperience",
  "armedFighting",
  "unarmedFighting",
  "attacksParries",
  "combatActions",
  "brawling",
  "wrestling",
  "shieldParry",
  "oneHandedLightWeapons",
  "oneHandedHeavyWeapons",
  "throwingWeapons",
  "twoHandedWeapons",
  "crossbow",
  "bowsSlings"
]);

const DEFINITIONS = Object.freeze({
  free: {labelKey: "TRUDVANG.CombatPool.Free", priority: 0},
  battleExperience: {labelKey: "TRUDVANG.CombatPool.BattleExperience", catalogId: "battleExperience", multiplier: 1, priority: 10},
  armedFighting: {labelKey: "TRUDVANG.CombatPool.ArmedFighting", catalogId: "armedFighting", multiplier: 1, priority: 40},
  unarmedFighting: {labelKey: "TRUDVANG.CombatPool.UnarmedFighting", catalogId: "unarmedFighting", multiplier: 1, priority: 40},
  attacksParries: {labelKey: "TRUDVANG.CombatPool.AttacksParries", catalogId: "fighter", multiplier: 2, priority: 30},
  combatActions: {labelKey: "TRUDVANG.CombatPool.CombatActions", catalogId: "combatActions", multiplier: 2, priority: 60},
  brawling: {labelKey: "TRUDVANG.CombatPool.Brawling", catalogId: "brawling", multiplier: 2, priority: 70},
  wrestling: {labelKey: "TRUDVANG.CombatPool.Wrestling", catalogId: "wrestling", multiplier: 2, priority: 80},
  shieldParry: {labelKey: "TRUDVANG.CombatPool.ShieldParry", catalogId: "shieldBearer", multiplier: 2, priority: 100},
  oneHandedLightWeapons: {labelKey: "TRUDVANG.CombatPool.OneHandedLightWeapons", catalogId: "oneHandedLightWeapons", multiplier: 2, priority: 90},
  oneHandedHeavyWeapons: {labelKey: "TRUDVANG.CombatPool.OneHandedHeavyWeapons", catalogId: "oneHandedHeavyWeapons", multiplier: 2, priority: 90},
  throwingWeapons: {labelKey: "TRUDVANG.CombatPool.ThrowingWeapons", catalogId: "throwingWeapons", multiplier: 2, priority: 90},
  twoHandedWeapons: {labelKey: "TRUDVANG.CombatPool.TwoHandedWeapons", catalogId: "twoHandedWeapons", multiplier: 2, priority: 90},
  crossbow: {labelKey: "TRUDVANG.CombatPool.Crossbow", catalogId: "crossbow", multiplier: 2, priority: 90},
  bowsSlings: {labelKey: "TRUDVANG.CombatPool.BowsSlings", catalogId: "bowsSlings", multiplier: 2, priority: 90}
});

const CATEGORY_SPECIALTIES = Object.freeze({
  oneHandedLight: "oneHandedLightWeapons",
  oneHandedHeavy: "oneHandedHeavyWeapons",
  twoHanded: "twoHandedWeapons",
  ranged: "bowsSlings"
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function knowledge(actor, catalogId) {
  if (!actor || !catalogId) return null;
  if (typeof actor.findKnowledgeItem === "function") return actor.findKnowledgeItem(catalogId) ?? null;
  return Array.from(actor.items || []).find(item => item?.system?.catalogId === catalogId) ?? null;
}

function sourcePoolData(actor, id) {
  return actor?._source?.system?.combatPools?.[id] ?? actor?.system?.combatPools?.[id] ?? {};
}

export function weaponCombatSpecialty(item) {
  if (item?.type !== "weapon" || item.system?.category === "natural") return "";
  return item.system?.combatSpecialty || CATEGORY_SPECIALTIES[item.system?.category] || "";
}

function poolMaximum(actor, id) {
  const character = actor?.type === "character";
  if (id === "free") {
    if (character) {
      const fighting = finite(actor.getSkillValue?.("fighting") ?? actor.system?.effective?.skills?.fighting ?? actor.system?.skills?.fighting?.value, 1);
      return Math.max(0, Math.trunc(fighting + finite(actor.system?.modifiers?.combatMax, 0)));
    }
    return Math.max(0, Math.trunc(finite(actor?._source?.system?.resources?.combat?.max ?? actor?.system?.resources?.combat?.max, 1)));
  }
  if (!character) return 0;
  const definition = DEFINITIONS[id];
  return Math.max(0, Math.trunc(finite(knowledge(actor, definition.catalogId)?.system?.level, 0) * definition.multiplier));
}

function poolEligibility(id, item, context) {
  const action = context.action || context.usage || "";
  if (!action) return true;
  if (id === "free" || id === "battleExperience") return true;

  const weaponAction = ["attack", "parry", "brawling"].includes(action);
  const natural = item?.type === "weapon" && item.system?.category === "natural";
  const armed = ["weapon", "shield"].includes(item?.type) && !natural;
  if (id === "attacksParries") return weaponAction;
  if (id === "combatActions") return ["combatAction", "movement", "positioning", "drawWeapon", "standUp"].includes(action);
  if (id === "armedFighting") return weaponAction && armed;
  if (id === "unarmedFighting") return ["brawling", "wrestling", "grapple", "glima"].includes(action) || (natural && ["attack", "parry"].includes(action));
  if (id === "brawling") return action === "brawling" || (natural && ["attack", "parry"].includes(action));
  if (id === "wrestling") return ["wrestling", "grapple", "glima"].includes(action);
  if (id === "shieldParry") return action === "parry" && item?.type === "shield";
  return weaponAction && id === weaponCombatSpecialty(item);
}

/** Return every pool with its maximum, remaining points, source and contextual eligibility. */
export function resolveCombatPools({actor, item = null, context = {}} = {}) {
  const pools = COMBAT_POOL_IDS.map(id => {
    const definition = DEFINITIONS[id];
    const max = poolMaximum(actor, id);
    const storedSpent = finite(sourcePoolData(actor, id).spent, -1);
    let spent = Math.max(0, storedSpent);
    if (id === "free" && actor?.type !== "character" && storedSpent < 0) {
      const legacyValue = finite(actor?._source?.system?.resources?.combat?.value ?? actor?.system?.resources?.combat?.value, max);
      spent = Math.max(0, max - legacyValue);
    }
    const currentModifier = id === "free" ? finite(actor?.system?.modifiers?.combatValue, 0) : 0;
    const current = Math.max(0, Math.min(max, max - spent + currentModifier));
    const sourceItem = definition.catalogId ? knowledge(actor, definition.catalogId) : null;
    return {
      id,
      labelKey: definition.labelKey,
      max,
      spent,
      current,
      eligible: poolEligibility(id, item, context),
      priority: definition.priority,
      source: definition.catalogId ? {
        kind: sourceItem?.system?.kind || "knowledge",
        id: definition.catalogId,
        uuid: sourceItem?.uuid || "",
        name: sourceItem?.name || "",
        level: finite(sourceItem?.system?.level, 0)
      } : {kind: "skill", id: "fighting", uuid: "", name: "", level: max},
      rule: {book: "coreRules", printedPage: 315, englishBook: "gameMastersGuide", englishPrintedPage: 41}
    };
  });
  return {
    pools,
    active: pools.filter(pool => pool.max > 0),
    eligible: pools.filter(pool => pool.max > 0 && pool.eligible),
    totalMax: pools.reduce((sum, pool) => sum + pool.max, 0),
    totalCurrent: pools.reduce((sum, pool) => sum + pool.current, 0),
    eligibleCurrent: pools.filter(pool => pool.eligible).reduce((sum, pool) => sum + pool.current, 0)
  };
}

/** Suggest a conservative allocation, spending the most restricted pools first. */
export function suggestCombatAllocation(pools, requested) {
  let remaining = Math.max(0, Math.trunc(finite(requested, 0)));
  const allocation = {};
  for (const pool of [...pools].filter(pool => pool.eligible && pool.current > 0).sort((left, right) => right.priority - left.priority)) {
    const amount = Math.min(pool.current, remaining);
    if (amount > 0) allocation[pool.id] = amount;
    remaining -= amount;
    if (remaining <= 0) break;
  }
  return allocation;
}

/** Clamp a user allocation to the eligible points that are actually available. */
export function normalizeCombatAllocation(pools, allocation = {}) {
  const normalized = {};
  for (const pool of pools) {
    if (!pool.eligible || pool.current <= 0) continue;
    normalized[pool.id] = Math.max(0, Math.min(pool.current, Math.trunc(finite(allocation[pool.id], 0))));
  }
  return {
    allocation: normalized,
    total: Object.values(normalized).reduce((sum, amount) => sum + amount, 0)
  };
}
