import {npcCombatMovementModes} from "./npc-summary.mjs";
import {isThrowingWeapon, resolveCombatPools, weaponForUsage, weaponType} from "./combat-pool-resolver.mjs";

const normalize = value => String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "")
  .trim().toLocaleLowerCase().replace(/\s+/g, " ");
const targetTraits = new Set(["charisma", "constitution", "dexterity", "intelligence", "perception", "psyche", "strength"]);
const movementMode = value => ({vol: "flight", flying: "flight", flight: "flight", terrestre: "land",
  land: "land", walking: "land", nage: "swimming", swimming: "swimming"})[normalize(value)] ?? normalize(value);

/** New catalogues carry stable item identities. Name lookup keeps custom book rows
 * usable, including a choice of interchangeable natural weapons ("Claws/Bite").
 */
export function resolveNpcPreparedAction(actor, row) {
  const items = Array.from(actor.items ?? []);
  const names = [normalize(row.attack), ...String(row.attack ?? "").split("/").map(normalize)];
  const item = row.action === "fixedAttack" ? null : items.find(item => row.itemId && (item.id ?? item._id) === row.itemId)
    ?? items.find(item => ["weapon", "shield"].includes(item.type) && names.includes(normalize(item.name)));
  const fallback = names[0];
  const action = row.action || (item ? (item.type === "shield" ? "parry" : "attack")
    : ["lutte", "glima", "wrestling"].includes(fallback) ? "glima"
      : ["saisie", "grapple", "grappling"].includes(fallback) ? "grapple"
        : /^(mouvement|movement)\b/.test(fallback) ? "movement"
          : items.some(item => item.type === "creatureAbility" && normalize(item.name) === fallback) ? "special" : "");
  const fixedAttack = action === "fixedAttack";
  const points = fixedAttack ? 0 : Math.max(0, Math.trunc(Number(row.value) || 0));
  const fixedVC = fixedAttack ? Math.trunc(Number(row.value) || 0) : null;
  const configuredTargetTrait = String(row.targetTrait || "none");
  const targetTrait = fixedAttack && targetTraits.has(configuredTargetTrait) ? configuredTargetTrait : "none";
  const successConsequence = fixedAttack ? String(row.successConsequence || "") : "";
  const mode = npcCombatMovementModes(actor.system).find(mode => movementMode(mode.mode) === movementMode(row.mode));
  const throwing = action === "throwing" || (action === "attack" && isThrowingWeapon(item));
  const poolAction = throwing ? "attack" : action === "special" ? "other" : action;
  const usageItem = item ? weaponForUsage(item, {throwing: throwing || undefined}) : null;
  const resolution = fixedAttack ? {eligible: [], eligibleCurrent: 0, freeScope: "both"}
    : resolveCombatPools({actor, item: usageItem, context: {action: poolAction,
      ignoreSpent: !actor.isInActiveCombat}});
  const weaponAction = ["attack", "parry", "throwing"].includes(action);
  const supported = weaponAction ? Boolean(item) : ["glima", "grapple", "movement", "other", "special", "fixedAttack"].includes(action);
  const ready = !weaponAction || weaponType(item) === "natural" || Boolean(item?.system.equipped);
  const hasActions = !weaponAction || !actor.isInActiveCombat || actor.getWeaponActionState(item).current > 0;
  const enoughPoints = fixedAttack || points <= resolution.eligibleCurrent;
  return {action, item, points, fixedAttack, fixedVC, targetTrait, successConsequence, resolution, throwing, movementMode: mode?.id ?? "",
    name: item?.name ?? row.attack, supported, ready, hasActions, enoughPoints,
    available: resolution.eligibleCurrent,
    canUse: supported && ready && hasActions && enoughPoints
      && (!["glima", "grapple", "movement"].includes(action) || points % 2 === 0)
      && (action !== "movement" || Boolean(mode) || !row.mode)
      && (!["movement", "other"].includes(action) || actor.isInActiveCombat)};
}

export function npcPreparedActionRows(actor, {format, localize}) {
  const used = new Set(actor.system.usedPreparedActions ?? []);
  return Array.from(actor.system.attacks ?? [], (combo, comboIndex) => ({index: comboIndex,
    actions: Array.from(combo, (row, stepIndex) => {
      const action = resolveNpcPreparedAction(actor, row);
      const name = action.action === "movement" && !String(action.name ?? "").trim()
        ? localize("TRUDVANG.Npc.PreparedMovement") : action.name;
      const done = used.has(`${comboIndex}:${stepIndex}`);
      const reason = !action.supported ? "MissingPreparedAction" : action.fixedAttack ? "PreparedFixedAttackHint" : !action.ready ? "PreparedWeaponNotReady"
        : !action.hasActions ? "PreparedWeaponDepleted" : !action.enoughPoints ? "PreparedPointsUnavailable" : "PreparedActionHint";
      return {...action, name, comboIndex, stepIndex, used: done,
        tooltip: `${format(`TRUDVANG.Npc.${reason}`, {name, points: action.points, available: action.available, value: action.fixedVC})}${done ? ` — ${localize("TRUDVANG.Npc.PreparedActionUsed")}` : ""}`};
    })}));
}
