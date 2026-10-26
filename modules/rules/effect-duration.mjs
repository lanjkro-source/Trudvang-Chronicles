// Trudvang action rounds last five seconds (FR Rules p. 75).
export function normalizeEffectDuration(duration = {}) {
  if (duration.value == null || !Number.isFinite(Number(duration.value))) return {...duration};
  const value = Number(duration.value);
  const unit = duration.units || "rounds";
  const conversion = {seconds: [1 / 5, "rounds"], minutes: [12, "rounds"], weeks: [7, "days"], centuries: [100, "years"]}[unit];
  return {...duration, value: conversion ? Number((value * conversion[0]).toFixed(10)) : value, units: conversion?.[1] ?? unit};
}
export function normalizeEffectStage(stage) {
  const duration = normalizeEffectDuration({value: stage.durationValue, units: stage.durationUnit});
  return {...stage, durationValue: duration.value, durationUnit: duration.units};
}
/** Generated power-level duration improvements are measured in seconds.
 * Preserve the chosen unit while adding precisely the same real duration. */
export function addDurationSeconds(duration, seconds) {
  const scale = {rounds: 5, turns: 5, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, months: 2592000, years: 31536000, centuries: 3153600000}[duration.units];
  if (!scale) throw new Error(`Unknown duration unit: ${duration.units}`);
  return normalizeEffectDuration({...duration, value: Number(duration.value) + Number(seconds) / scale});
}
