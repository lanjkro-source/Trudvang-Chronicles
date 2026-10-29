import {cumulativeChangeValue, effectDegree as effectDegreeForAttribution} from "./effect-stacking.mjs";
import {POWER_DETAILS_BY_ID} from "../power-catalog-data.mjs";
const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const numeric = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const priority = change => numeric(change.priority ?? ({multiply: 10, add: 20, subtract: 20, downgrade: 30, upgrade: 40, override: 50}[change.type] ?? 0));
export const signedEffect = value => `${value > 0 ? "+" : ""}${value}`;

/** Inputs to derived actor statistics must be applied before derived preparation.
 * Final changes to other document/token fields retain Foundry's own phase. */
export function effectChangePhase(change) {
  if(["system.resources.body.temporaryMax","system.resources.body.max"].includes(change.key))return "initial";
  return /^system\.(?:effective\.|modifiers\.|transformation\.)/u.test(change.key || "") ? "initial" : change.phase ?? "final";
}

/** Explain prepared values; never apply effects a second time to the document.
 * Replay only for attribution, then reconcile with the authoritative total. */
export function effectContributions(actor, key, {base = 0, total = get(actor, key), includeEffect = false} = {}) {
  const changes = Array.from(actor.allApplicableEffects?.() ?? actor.effects ?? [])
    .filter(effect => !effect.disabled && !effect.isSuppressed && !effect.duration?.expired && effect.active !== false)
    .flatMap(effect => Array.from(effect.system?.changes ?? []).filter(change => change.key === key)
      .map(change => ({effect, change})))
    .sort((a, b) => priority(a.change) - priority(b.change));
  const rows = [];
  let current = numeric(base);
  for (const {effect, change} of changes) {
    const raw = String(cumulativeChangeValue(effect, change, actor) ?? "").replace(/@([\w.]+)/gu, (_, path) => get(actor.system, path) ?? get(actor, path) ?? 0);
    const value = Number(raw);
    if (!Number.isFinite(value)) continue;
    const before = current;
    const type = change.type ?? change.mode;
    if (type === "add" || type === 2) current += value;
    else if (type === "subtract") current -= value;
    else if (type === "multiply" || type === 1) current *= value;
    else if (type === "upgrade" || type === 4) current = Math.max(current, value);
    else if (type === "downgrade" || type === 3) current = Math.min(current, value);
    else if (type === "override" || type === 5) current = value;
    else continue;
    const metadata=effect.flags?.["trudvang-chronicles"]?.transformation;
    const parts=(metadata?.powerContributions??[]).filter(row=>row.key===key&&row.resolved===value&&Number.isFinite(row.unit)&&Number.isInteger(row.count));
    const delta=current-before;
    if(parts.length && (type === "add" || type === 2) && effectDegreeForAttribution(effect) === 1) {
      const bonus=parts.reduce((sum,row)=>sum+row.count*row.unit,0);
      if(delta-bonus)rows.push({label:effect.name,value:delta-bonus,...(includeEffect?{effect}:{})});
      for(const part of parts){
        const currentIndex=(POWER_DETAILS_BY_ID[metadata.sourceId]?.powerLevels??[]).findIndex(option=>option.id===part.optionId);
        // TEMPORARY WORLD MIGRATION — old active effects have only the original index.
        const index=currentIndex>=0?currentIndex:part.index;
        const descriptionKey=`TRUDVANG.Content.Power.${metadata.sourceId}.PowerLevels.${index}`;
        const description=game.i18n.localize(descriptionKey);
        const label=game.i18n.format("TRUDVANG.Resistance.PowerLevel",{index:index+1,description,count:part.count,unit:part.unit});
        rows.push({label:`${effect.name} — ${label}`,value:part.count*part.unit,...(includeEffect?{effect}:{})});
      }
    } else rows.push({label: effect.name, value: delta, ...(includeEffect ? {effect} : {})});
  }
  const residual = numeric(total) - current;
  if (residual) rows.push({labelKey: "TRUDVANG.Inspection.OtherModifiers", value: residual});
  return rows;
}

export function effectContributionText(rows) {
  return rows.map(row => `${row.labelKey ? game.i18n.localize(row.labelKey) : row.label} ${signedEffect(row.value)}`).join(" · ");
}

export function rollEffectKeys(actor, {kind = "", skillKey = "", traitKey = "", movement = false} = {}) {
  const keys = ["allActions"];
  if (["attack", "parry", "ability", "magic"].includes(kind) || (kind === "skill" && actor.isInCombatActive())) keys.push("combatActions");
  if (movement) keys.push("movementActions");
  if (["attack", "parry", "magic"].includes(kind)) keys.push(kind);
  if (skillKey) keys.push(`skills.${skillKey}`);
  if (traitKey) keys.push(`traits.${traitKey}`);
  return keys.map(key => `system.modifiers.rolls.${key}`);
}
