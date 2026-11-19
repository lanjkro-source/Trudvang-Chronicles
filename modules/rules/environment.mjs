import {effectDegree, FATIGUED_ITEM} from "./effect-stacking.mjs";
import {knowledgeRank} from "./magic-resistance.mjs";
import {consumablePolicy} from "./consumable-effects.mjs";
import {activeWeatherWards,temperatureBand,wardTemperature,weatherBlocks} from "./weather-wards.mjs";

export const ENVIRONMENTS = ["mountain", "forest", "plains", "sea", "snow"];
// FR Rules p. 302; EN GM Guide pp. 30–31. [modifier, required clothing].
export const ENVIRONMENT_OPTIONS = {
  travel: {none: [0], foot: [-1], horse: [-2]},
  temperature: {mild: [0], cool: [-1, "warm"], cold: [-1, "winter"], freezing: [-2, "thickWinter"], intense: [-3, "thickWinter"], hrim: [-3, "mastomant"]},
  precipitation: {none: [0], beautiful: [1], rain: [-1, "cape"], torrential: [-2, "raincoat"], downpour: [-3, "raincoat"], hail: [-2, "raincoat"], lightSnow: [-1], snow: [-2], heavySnow: [-3]},
  wind: {none: [0], breeze: [-1], gale: [-1], storm: [-2], hurricane: [-3]},
  sleep: {normal: [0], poor: [-1], sleepless: [-2], refreshing: [2]}
};
export const ENVIRONMENT_COMFORTS = ["meal", "clean", "rest", "goal"];
export const environmentKey = key => `TRUDVANG.Environment.${key}`;
export function normalizeEnvironment(data = {}) {
  const result = {environment: ENVIRONMENTS.includes(data.environment) ? data.environment : "forest"};
  for (const [field, choices] of Object.entries(ENVIRONMENT_OPTIONS)) result[field] = Object.hasOwn(choices, data[field]) ? data[field] : Object.keys(choices)[0];
  for (const field of ["temperatureClothing", "precipitationClothing"]) result[field] = data[field] !== false;
  const ambient = data.ambientTemperature;
  if ((typeof ambient === "number" || typeof ambient === "string" && ambient.trim()) && Number.isFinite(Number(ambient))) {
    result.ambientTemperature = Number(ambient);
    result.temperature = temperatureBand(result.ambientTemperature);
  }
  if (data.magicalWeather === true) result.magicalWeather = true;
  for (const field of ENVIRONMENT_COMFORTS) result[field] = data[field] === true;
  return result;
}
export function environmentConditions(data) {
  const options = normalizeEnvironment(data), rows = [];
  let negative = 0, favorable = 0, frostbite = 0;
  for (const [field, choices] of Object.entries(ENVIRONMENT_OPTIONS)) {
    const [base, clothing] = choices[options[field]];
    const unprotected = clothing && !options[`${field}Clothing`];
    const value = base * (unprotected ? 2 : 1);
    if (value < 0) negative += value; else favorable += value;
    if (unprotected) frostbite += Math.abs(value);
    rows.push({field, choice: options[field], value, clothing, unprotected});
  }
  for (const field of ENVIRONMENT_COMFORTS) if (options[field]) {favorable++; rows.push({field: "comfort", choice: field, value: 1});}
  return {options, rows, negative, favorable, frostbite};
}
export function environmentActorValues(actor, data) {
  const conditions = environmentConditions(data);
  const fatigue = Array.from(actor.allApplicableEffects?.() ?? actor.effects ?? []).filter(effect =>
    effect.system?.stackId === FATIGUED_ITEM && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired && effect.active !== false)
    .reduce((sum, effect) => sum + effectDegree(effect), 0);
  const level = knowledgeRank(actor, "weathered");
  const policy = consumablePolicy(actor);
  const wards = activeWeatherWards(actor);
  const {ambientTemperature,magicalWeather} = conditions.options;
  const temperatureWards = wards.filter(ward => ward.temperature && (!magicalWeather || ward.kind!=="refuge"));
  const temperatures = Number.isFinite(ambientTemperature)
    ? temperatureWards.map(ward => ({ward,value:wardTemperature(ambientTemperature,ward)}))
    : [];
  const warmest = temperatures.reduce((best,row) => !best || row.value > best.value ? row : best,null);
  const adjusted = warmest ? environmentConditions({...conditions.options,ambientTemperature:warmest.value}) : conditions;
  const minimum = {mild: 10, cool: 0, cold: -10, freezing: -20, intense: -40}[adjusted.options.temperature];
  const protectedFields = new Set();
  if (policy.temperature && Number.isFinite(minimum) && minimum >= policy.temperature[0]) protectedFields.add("temperature");
  if (policy.sleepHours === 0) protectedFields.add("sleep");
  const names = new Set();
  let effectiveNegative = 0, frostbite = 0;
  for (const row of adjusted.rows) {
    if (row.field === "temperature" && warmest && conditions.options.temperature !== adjusted.options.temperature) names.add(warmest.ward.name);
    if (row.value >= 0) continue;
    const ward = wards.find(ward => weatherBlocks(ward,row,magicalWeather));
    if (ward) names.add(ward.name);
    else if (protectedFields.has(row.field)) for (const name of policy.names) names.add(name);
    else {
      effectiveNegative += row.value;
      if (row.unprotected) frostbite -= row.value;
    }
  }
  const protection = effectiveNegative - conditions.negative;
  const mitigation = Math.min(conditions.favorable, Math.max(0, -conditions.negative - protection + fatigue));
  return {...conditions, frostbite, protection, protectionSources: [...names], fatigue, mitigation, weathered: 2 * level, modifier: effectiveNegative + mitigation + 2 * level};
}
export function environmentCardLines(data, localize) {
  return environmentConditions(data).rows.filter(row => row.value !== 0).map(row => {
    const label = localize(environmentKey(`compact.${row.field}.${row.choice}`));
    const clothing = row.unprotected ? ` (${localize(environmentKey("poorlyClothed"))})` : "";
    const value = row.value < 0 ? `−${Math.abs(row.value)}` : `+${row.value}`;
    return `${label}${clothing} : ${value}`;
  });
}
export function environmentCardView(data, localize) {
  const {options, negative, favorable, frostbite} = environmentConditions(data);
  const environment = localize(environmentKey(`types.${options.environment}`)).toLocaleLowerCase();
  const total = Math.min(0, negative + favorable);
  return {
    title: localize(environmentKey("cardTitle")).replace("{environment}", environment),
    environmentLines: environmentCardLines(data, localize),
    environmentTotal: total < 0 ? `−${Math.abs(total)}` : "0",
    environmentFrostbite: frostbite ? `${localize(environmentKey("frostbiteCompact"))} : ${frostbite}` : ""
  };
}
