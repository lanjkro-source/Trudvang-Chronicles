/** Editable, per-effect profile changes. Native scalar bonuses keep their usual
 * system.effective/system.modifiers paths; structured profiles use JSON values. */
export const EFFECT_RULE_PREFIX = "system.transformation.";
export const roundEffectValue = value => Math.round((value + Number.EPSILON) * 100) / 100;
export const EFFECT_RULE_KEYS = ["suspendEquipment", "preserveHP", "statueIntegrity", "naturalArmor",
  "movement", "testFactor", "traits", "chooseBestiary", "formPolicy", "formName", "senses",
  "capabilities", "attacks", "defense", "vitality", "temporaryHP", "damage", "noParry", "noDodge",
  "ignoreFear", "fearFactor", "size", "durationFromElapsed", "ignoreWounds", "endAtEmptyHP",
  "damageTakenFactor", "immunities", "extraWeaponAction", "capabilityNames", "unarmedDamage",
  "knowledge", "vision", "recalculateHP", "heightBonus", "weightBonus"];
const arrays=new Set(["movement","traits","senses","capabilities","attacks","immunities","capabilityNames","unarmedDamage"]);
const objects=new Set(["testFactor","damage","extraWeaponAction","knowledge"]);
const booleans=new Set(["suspendEquipment","preserveHP","chooseBestiary","noParry","noDodge","ignoreFear","ignoreWounds","endAtEmptyHP","recalculateHP"]);
const numbers=new Set(["statueIntegrity","naturalArmor","defense","temporaryHP","size","durationFromElapsed","damageTakenFactor","heightBonus","weightBonus"]);
const parse=value=>{if(typeof value!=="string")return value;try{return JSON.parse(value);}catch{return value;}};
export function validProfileChange(row){
 if(!row.key?.startsWith(EFFECT_RULE_PREFIX))return true;
 const key=row.key.slice(EFFECT_RULE_PREFIX.length),value=parse(row.value);
 if(!EFFECT_RULE_KEYS.includes(key))return false;
 if(arrays.has(key))return Array.isArray(value)&&(!["traits","movement","attacks"].includes(key)||value.every(r=>r&&typeof r==="object"&&!Array.isArray(r)));
 if(objects.has(key))return value!==null&&typeof value==="object"&&!Array.isArray(value);
 if(booleans.has(key))return typeof value==="boolean";
 if(numbers.has(key))return typeof value==="number"&&Number.isFinite(value);
 return typeof value==="string";
}

export function rulesFromChanges(changes = []) {
  const rules = {};
  for (const row of Array.from(changes).filter(c => c.key?.startsWith(EFFECT_RULE_PREFIX))
    .sort((a,b) => Number(a.priority ?? 0) - Number(b.priority ?? 0))) {
    const key = row.key.slice(EFFECT_RULE_PREFIX.length);
    if (!validProfileChange(row)) continue;
    const value=parse(row.value);
    if (row.type === "add" && Array.isArray(value)) rules[key] = [...rules[key] ?? [], ...value];
    else if (row.type === "add" && typeof value === "number") rules[key] = Number(rules[key] ?? 0) + value;
    else if (row.type === "multiply") rules[key] = roundEffectValue(Number(rules[key] ?? 1) * Number(value));
    else if (row.type === "upgrade") rules[key] = Math.max(Number(rules[key] ?? value), Number(value));
    else if (row.type === "downgrade") rules[key] = Math.min(Number(rules[key] ?? value), Number(value));
    else if (row.type === "subtract") rules[key] = Number(rules[key] ?? 0) - Number(value);
    else rules[key] = value;
  }
  return rules;
}

export function changesFromRules(rules, {priority} = {}) {
  return Object.entries(rules).filter(([key,value]) => EFFECT_RULE_KEYS.includes(key) && value !== undefined)
    .map(([key,value]) => ({key: EFFECT_RULE_PREFIX + key, type: key === "temporaryHP" ? "add" : "override",
      value: typeof value === "string" ? value : JSON.stringify(value), phase: "initial",
      ...(Number.isFinite(priority) ? {priority} : {})}));
}

export const hasProfileChanges = effect => Array.from(effect.system?.changes ?? []).some(c => c.key?.startsWith(EFFECT_RULE_PREFIX));
