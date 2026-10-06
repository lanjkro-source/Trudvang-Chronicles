/** Pure, Foundry-independent resolution of Trudvang's linked Combat Point pools. */

export const COMBAT_POOL_IDS = Object.freeze([
  "free",
  "combatActions",
  "attacksParries",
  "battleExperience",
  "armedFighting",
  "unarmedFighting",
  "brawling",
  "wrestling",
  "shieldParry",
  "oneHandedLightWeapons",
  "oneHandedLightWeaponsOffHand",
  "oneHandedHeavyWeapons",
  "oneHandedHeavyWeaponsOffHand",
  "throwingWeapons",
  "throwingWeaponsOffHand",
  "twoHandedWeapons",
  "crossbow",
  "bowsSlings"
]);

const DEFINITIONS = Object.freeze({
  free: {labelKey: "TRUDVANG.CombatPool.Free", priority: 0},
  combatActions: {labelKey: "TRUDVANG.CombatPool.CombatActions", hintKey: "TRUDVANG.CombatPool.CombatActionsHint", catalogId: "combatActions", multiplier: 2, priority: 60},
  attacksParries: {labelKey: "TRUDVANG.CombatPool.AttacksParries", catalogId: "fighter", multiplier: 2, priority: 30},
  // Kept as a zero-capacity legacy pool so existing world data remains readable.
  battleExperience: {labelKey: "TRUDVANG.CombatPool.BattleExperience", catalogId: "battleExperience", multiplier: 0, priority: 10},
  armedFighting: {labelKey: "TRUDVANG.CombatPool.ArmedFighting", catalogId: "armedFighting", multiplier: 1, priority: 40},
  unarmedFighting: {labelKey: "TRUDVANG.CombatPool.UnarmedFighting", catalogId: "unarmedFighting", multiplier: 1, priority: 40},
  brawling: {labelKey: "TRUDVANG.CombatPool.Brawling", catalogId: "brawling", multiplier: 2, priority: 70},
  wrestling: {labelKey: "TRUDVANG.CombatPool.Wrestling", catalogId: "wrestling", multiplier: 2, priority: 80},
  shieldParry: {labelKey: "TRUDVANG.CombatPool.ShieldParry", catalogId: "shieldBearer", multiplier: 2, priority: 100},
  oneHandedLightWeapons: {labelKey: "TRUDVANG.CombatPool.OneHandedLightWeapons", catalogId: "oneHandedLightWeapons", multiplier: 2, priority: 90},
  oneHandedLightWeaponsOffHand: {labelKey: "TRUDVANG.CombatPool.OneHandedLightWeaponsOffHand", catalogId: "oneHandedLightWeapons", levelField: "offHandLevel", multiplier: 2, priority: 90},
  oneHandedHeavyWeapons: {labelKey: "TRUDVANG.CombatPool.OneHandedHeavyWeapons", catalogId: "oneHandedHeavyWeapons", multiplier: 2, priority: 90},
  oneHandedHeavyWeaponsOffHand: {labelKey: "TRUDVANG.CombatPool.OneHandedHeavyWeaponsOffHand", catalogId: "oneHandedHeavyWeapons", levelField: "offHandLevel", multiplier: 2, priority: 90},
  throwingWeapons: {labelKey: "TRUDVANG.CombatPool.ThrowingWeapons", catalogId: "throwingWeapons", multiplier: 2, priority: 90},
  throwingWeaponsOffHand: {labelKey: "TRUDVANG.CombatPool.ThrowingWeaponsOffHand", catalogId: "throwingWeapons", levelField: "offHandLevel", multiplier: 2, priority: 90},
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

const TWO_HANDED_WEAPON_TYPES = new Set(["twoHandedWeapons", "crossbow", "bowsSlings"]);
const SEPARATE_HAND_WEAPON_TYPES = new Set(["oneHandedLightWeapons", "oneHandedHeavyWeapons", "throwingWeapons"]);

const TYPE_CATEGORIES = Object.freeze({
  oneHandedLightWeapons: "oneHandedLight",
  oneHandedHeavyWeapons: "oneHandedHeavy",
  twoHandedWeapons: "twoHanded",
  crossbow: "ranged",
  bowsSlings: "ranged",
  natural: "natural"
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function knowledge(actor, catalogId) {
  if (!actor || !catalogId) return null;
  if (typeof actor.findRuleKnowledge === "function") return actor.findRuleKnowledge(catalogId) ?? null;
  if (typeof actor.findKnowledgeItem === "function") return actor.findKnowledgeItem(catalogId) ?? null;
  return Array.from(actor.items || []).find(item => item?.system?.catalogId === catalogId) ?? null;
}

function sourcePoolData(actor, id) {
  return actor?._source?.system?.combatPools?.[id] ?? actor?.system?.combatPools?.[id] ?? {};
}

/**
 * Free Combat Points apply once to each hand (Core Rules, p. 318). Actions tied
 * to a light, heavy, or throwing one-handed weapon (or shield) use the matching
 * hand only. Every other action, including natural attacks, movement, and any
 * two-handed or ranged weapon, needs and spends both hand uses.
 */
export function freeCombatPoolScope(item, context = {}) {
  const action = context.action || context.usage || "";
  const handBoundAction = ["attack", "parry", "drawWeapon"].includes(action);
  if (!handBoundAction) return "both";
  if (weaponUsesTwoHands(item)) return "both";
  if (item?.type === "shield") return "offHand";
  if (item?.type === "weapon" && weaponUsesSeparateHands(item)) return item.system?.hand === "offHand" ? "offHand" : "weapon";
  return "both";
}

/**
 * Build the persisted pool updates for an allocation.  Keeping this alongside
 * the resolver guarantees that the value offered by the dialog and the value
 * actually spent obey the same hand-scope rule.
 */
export function combatPointSpendingUpdates(combatPools = {}, allocation = {}, {freeScope = "both"} = {}) {
  const updates = {};
  for (const [id, rawAmount] of Object.entries(allocation)) {
    const amount = Math.max(0, Math.trunc(finite(rawAmount, 0)));
    if (!Object.hasOwn(combatPools || {}, id) || amount <= 0) continue;
    if (id === "free" && freeScope === "both") {
      const free = combatPools.free || {};
      updates["system.combatPools.free.weaponSpent"] = finite(free.weaponSpent, 0) + amount;
      updates["system.combatPools.free.offHandSpent"] = finite(free.offHandSpent, 0) + amount;
      continue;
    }
    if (id === "free" && ["weapon", "offHand"].includes(freeScope)) {
      const key = `system.combatPools.free.${freeScope}Spent`;
      updates[key] = finite(combatPools.free?.[`${freeScope}Spent`], 0) + amount;
      continue;
    }
    updates[`system.combatPools.${id}.spent`] = finite(combatPools?.[id]?.spent, 0) + amount;
  }
  return updates;
}

/** Whether the actor currently participates in Foundry's active combat encounter. */
export function actorParticipatesInCombat(actor, combat) {
  if (!actor || !combat?.started) return false;
  return Array.from(combat.combatants || []).some(combatant => combatant.actor === actor
    || combatant.actor?.uuid === actor.uuid
    || combatant.actor?.id === actor.id
    || combatant.actorId === actor.id);
}

export function weaponCombatSpecialty(item) {
  const type = weaponType(item);
  return type === "natural" ? "" : type;
}

/** Canonical weapon type. Explicit modern data wins over the legacy display category. */
export function weaponType(item) {
  if (item?.type !== "weapon") return "";
  if (item.system?.combatSpecialty) return item.system.combatSpecialty;
  if (item.system?.category === "natural") return "natural";
  return CATEGORY_SPECIALTIES[item.system?.category] || "";
}

/** Bare hands are not interchangeable with a creature's claws, horns or bite. */
export function isUnarmedWeapon(item) {
  if (weaponType(item) !== "natural") return false;
  const pool = String(item.system?.naturalCombatPool || "").toLowerCase();
  // TEMPORARY WORLD MIGRATION — older embedded NPC fists lack isUnarmed.
  const legacyName = String(item.name || "").normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase().replace(/[^a-z]/g, "");
  return item.system?.isUnarmed === true || item.id === "humanoid-natural"
    || ["unarmed", "mainsnues"].includes(pool)
    || ["unarmed", "mainsnues"].includes(legacyName);
}

/** Keep the legacy category synchronized while older worlds and modules still read it. */
export function categoryForWeaponType(type, current = "oneHandedLight") {
  if (type === "throwingWeapons") {
    return ["oneHandedLight", "oneHandedHeavy"].includes(current) ? current : "oneHandedLight";
  }
  return TYPE_CATEGORIES[type] || current;
}

export function weaponUsesSeparateHands(item) {
  return SEPARATE_HAND_WEAPON_TYPES.has(weaponType(item));
}

/** A melee weapon may be thrown; purpose-built throwing weapons carry a separate flag. */
export function canThrowWeapon(item) {
  if (item?.type !== "weapon") return false;
  return ["oneHandedLightWeapons", "oneHandedHeavyWeapons", "twoHandedWeapons"].includes(weaponType(item));
}

export function isThrowingWeapon(item) {
  return Boolean(item?.type === "weapon" && item.system?.isThrowingWeapon);
}

/**
 * Return a transient item profile for the selected attack mode. The persisted
 * weapon category remains its melee category; only a thrown attack spends the
 * dedicated throwing-weapon Combat Point pool.
 */
export function weaponForUsage(item, {throwing = false} = {}) {
  if (!throwing || !canThrowWeapon(item)) return item;
  return {...item, system: {...item.system, combatSpecialty: "throwingWeapons", throwingUsesBothHands: weaponUsesTwoHands(item)}};
}

export function weaponUsesTwoHands(item) {
  return item?.type === "weapon" && (Boolean(item.system?.throwingUsesBothHands) || TWO_HANDED_WEAPON_TYPES.has(weaponType(item)));
}

/** Return the physical hand slots occupied while the item is readied. */
export function readiedItemHands(item) {
  if (!item) return [];
  if (item.type === "shield") return ["offHand"];
  if (item.type !== "weapon" || weaponType(item) === "natural") return [];
  if (weaponUsesTwoHands(item)) return ["weapon", "offHand"];
  return [item.system?.hand === "offHand" ? "offHand" : "weapon"];
}

/** Find readied equipment which already occupies a hand required by the candidate. */
export function readiedHandConflicts(items, candidate) {
  const required = new Set(readiedItemHands(candidate));
  if (!required.size) return [];
  return Array.from(items || []).filter(item => item?.id !== candidate?.id
    && item?.system?.equipped
    && readiedItemHands(item).some(hand => required.has(hand)));
}

function poolMaximum(actor, id) {
  if (id === "free") {
    const fighting = finite(actor?.getSkillValue?.("fighting") ?? actor?.system?.effective?.skills?.fighting ?? actor?.system?.skills?.fighting?.value, 1);
    const battleExperience = finite(knowledge(actor, "battleExperience")?.system?.level, 0);
    return Math.max(0, Math.trunc(fighting + battleExperience + finite(actor?.system?.modifiers?.combatMax, 0)));
  }
  const definition = DEFINITIONS[id];
  const levelField = definition.levelField || "level";
  return Math.max(0, Math.trunc(finite(knowledge(actor, definition.catalogId)?.system?.[levelField], 0) * definition.multiplier));
}

function poolEligibility(id, item, context) {
  const action = context.action || context.usage || "";
  if (!action) return true;
  // Saisie and glima draw solely on Combat, Combat à mains nues and Lutte.
  if (["wrestling", "grapple", "glima"].includes(action)) return ["free", "unarmedFighting", "wrestling"].includes(id);
  const rangedParry = action === "parry" && item?.type === "weapon" && ["crossbow", "bowsSlings"].includes(weaponType(item));
  if (rangedParry) return id === "free";
  if (id === "free") return true;

  const weaponAction = ["attack", "parry", "brawling"].includes(action);
  const natural = item?.type === "weapon" && weaponType(item) === "natural";
  const unarmed = natural && isUnarmedWeapon(item);
  const armed = ["weapon", "shield"].includes(item?.type) && !natural;
  if (id === "attacksParries") return weaponAction;
  if (id === "combatActions") return !weaponAction;
  if (id === "armedFighting") return weaponAction && armed;
  if (id === "unarmedFighting") return action === "brawling" || (unarmed && ["attack", "parry"].includes(action));
  if (id === "brawling") return action === "brawling" || (unarmed && ["attack", "parry"].includes(action));
  if (id === "wrestling") return ["wrestling", "grapple", "glima"].includes(action);
  if (id === "shieldParry") return action === "parry" && item?.type === "shield";
  const specialty = weaponCombatSpecialty(item);
  const specialtyPool = weaponUsesSeparateHands(item) && item?.system?.hand === "offHand" ? `${specialty}OffHand` : specialty;
  return weaponAction && id === specialtyPool;
}

/** Return every pool with its maximum, remaining points, source and contextual eligibility. */
export function resolveCombatPools({actor, item = null, context = {}} = {}) {
  const freeScope = freeCombatPoolScope(item, context);
  const pools = COMBAT_POOL_IDS.map(id => {
    const definition = DEFINITIONS[id];
    const max = poolMaximum(actor, id);
    const storedSpent = finite(sourcePoolData(actor, id).spent, -1);
    let spent = context.ignoreSpent ? 0 : Math.max(0, storedSpent);
    // TEMPORARY WORLD MIGRATION — retain expenditure from the former single NPC
    // reserve, using its original maximum rather than the new skill-derived one.
    if (!context.ignoreSpent && id === "free" && actor?.type === "npc" && storedSpent < 0) {
      const legacy = actor?._source?.system?.resources?.combat;
      spent = Math.max(0, finite(legacy?.max, max) - finite(legacy?.value, max));
    }
    const currentModifier = id === "free" ? finite(actor?.system?.modifiers?.combatValue, 0) : 0;
    const freeData = sourcePoolData(actor, "free");
    const handSpent = id === "free" && freeScope !== "shared" && !context.ignoreSpent
      ? freeScope === "both"
        ? Math.max(Math.max(0, finite(freeData.weaponSpent, 0)), Math.max(0, finite(freeData.offHandSpent, 0)))
        : Math.max(0, finite(freeData[`${freeScope}Spent`], 0))
      : 0;
    const current = Math.max(0, Math.min(max, max - spent - handSpent + currentModifier));
    const sourceItem = definition.catalogId ? knowledge(actor, definition.catalogId) : null;
    return {
      id,
      labelKey: definition.labelKey,
      hintKey: definition.hintKey || "",
      max,
      spent,
      handSpent,
      freeScope: id === "free" ? freeScope : "",
      current,
      eligible: poolEligibility(id, item, context),
      priority: definition.priority,
      source: definition.catalogId ? {
        kind: sourceItem?.system?.kind || "knowledge",
        id: definition.catalogId,
        uuid: sourceItem?.uuid || "",
        name: sourceItem?.name || "",
        level: finite(sourceItem?.system?.[definition.levelField || "level"], 0)
      } : {
        kind: "skill",
        id: "fighting",
        uuid: "",
        name: "",
        level: finite(actor?.getSkillValue?.("fighting") ?? actor?.system?.effective?.skills?.fighting ?? actor?.system?.skills?.fighting?.value, max),
        battleExperience: finite(knowledge(actor, "battleExperience")?.system?.level, 0),
        modifier: finite(actor?.system?.modifiers?.combatMax, 0)
      },
      rule: {book: "coreRules", printedPage: 315, englishBook: "gameMastersGuide", englishPrintedPage: 41}
    };
  });
  // A reserve may be shared by several natural profiles (e.g. horns and fists).
  // Its expenditure is mirrored on those items, never duplicated in the total.
  if (actor?.type === "npc") {
    const groups = new Map();
    for (const weapon of Array.from(actor.items ?? []).filter(entry => weaponType(entry) === "natural" && entry.type === "weapon"
      && !(isUnarmedWeapon(entry) && entry.system.naturalCombatPool === "natural"))) {
      const id = `natural:${weapon.system.naturalCombatPool || weapon.id}`;
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(weapon);
    }
    for (const [id, weapons] of groups) {
      const max = Math.max(0, ...weapons.map(weapon => Math.trunc(finite(weapon.system.naturalCombatPoints))));
      const spent = context.ignoreSpent ? 0 : Math.max(0, ...weapons.map(weapon => finite(weapon.system.naturalCombatPointsSpent)));
      const common = weapons.length > 1 || weapons[0].system.naturalCombatPool === "natural";
      pools.push({id, labelKey: common ? "TRUDVANG.Npc.NaturalWeapons" : "", label: common ? "" : weapons[0].name,
        max, spent, current: Math.max(0, max - spent), priority: 100, hintKey: "",
        eligible: !context.action || (["attack", "parry"].includes(context.action)
          && weaponType(item) === "natural" && weapons.some(weapon => weapon.id === item?.id)),
        source: {kind: "natural", id, uuid: weapons[0].uuid || "", name: weapons.map(weapon => weapon.name).join(", "), level: max}});
    }
  }
  const free = pools.find(pool => pool.id === "free");
  // A compact tracker can show only one number for Free CP. When resolving a
  // legacy shared action, use the lower remaining hand value: either hand must
  // be able to pay an action that consumes both uses.
  const trackerFreeCurrent = free && freeScope === "shared" && !context.ignoreSpent
    ? Math.max(0, Math.min(free.max, free.max - free.spent - Math.max(0, finite(sourcePoolData(actor, "free").weaponSpent, 0), finite(sourcePoolData(actor, "free").offHandSpent, 0)) + finite(actor?.system?.modifiers?.combatValue, 0)))
    : free?.current ?? 0;
  const totalCurrent = pools.reduce((sum, pool) => sum + pool.current, 0);
  return {
    pools,
    active: pools.filter(pool => pool.max > 0),
    eligible: pools.filter(pool => pool.max > 0 && pool.eligible),
    totalMax: pools.reduce((sum, pool) => sum + pool.max, 0),
    totalCurrent,
    totalTrackerCurrent: totalCurrent - (free?.current ?? 0) + trackerFreeCurrent,
    eligibleCurrent: pools.filter(pool => pool.eligible).reduce((sum, pool) => sum + pool.current, 0),
    freeScope
  };
}

/** An Evade action is only available before any Combat Point reserve has been used. */
export function combatPoolsAreFull(actor) {
  const base = resolveCombatPools({actor});
  const weaponFree = resolveCombatPools({actor, item: {type: "weapon", system: {hand: "weapon"}}, context: {action: "attack"}})
    .pools.find(pool => pool.id === "free");
  const offHandFree = resolveCombatPools({actor, item: {type: "shield", system: {}}, context: {action: "parry"}})
    .pools.find(pool => pool.id === "free");
  return base.active.every(pool => pool.current === pool.max)
    && (!weaponFree || weaponFree.current === weaponFree.max)
    && (!offHandFree || offHandFree.current === offHandFree.max);
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
export function normalizeCombatAllocation(pools, allocation = {}, {multiple = 1} = {}) {
  const normalized = {};
  for (const pool of pools) {
    if (!pool.eligible || pool.current <= 0) continue;
    normalized[pool.id] = Math.max(0, Math.min(pool.current, Math.trunc(finite(allocation[pool.id], 0))));
  }
  const unit = Math.max(1, Math.trunc(finite(multiple, 1)));
  let excess = Object.values(normalized).reduce((sum, amount) => sum + amount, 0) % unit;
  // Leave the unusable remainder unspent, taking it from the least specific
  // allocated reserve first. Individual pools may still contribute odd amounts.
  for (const pool of [...pools].sort((left, right) => left.priority - right.priority)) {
    if (!excess) break;
    const removed = Math.min(excess, normalized[pool.id] || 0);
    normalized[pool.id] -= removed;
    excess -= removed;
  }
  return {
    allocation: normalized,
    total: Object.values(normalized).reduce((sum, amount) => sum + amount, 0)
  };
}
