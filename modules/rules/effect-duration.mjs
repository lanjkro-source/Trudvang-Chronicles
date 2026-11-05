// Trudvang action rounds last five seconds (FR Rules p. 75).
/** World-time days use the same 24-hour clock as advanceDuration(). */
export function durationUntilDayEnd(time=0){
  const seconds=((Number(time)||0)%86400+86400)%86400;
  return {value:(86400-seconds)/3600,units:"hours"};
}
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
/** Fixed-length units used by world-time effect clocks; null means indefinite. */
export function effectDurationSeconds(duration = {}) {
  if (duration.value == null) return null;
  const scale = {rounds: 5, turns: 5, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, months: 2592000, years: 31536000, centuries: 3153600000}[duration.units];
  const seconds = Number(duration.value) * scale;
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}
/** Elapsed time for an applied item effect, whether advanced by the clock or combat. */
export function itemEffectRemainingSeconds(effect, {time, combat} = {}) {
  const duration=effect?._source?.duration ?? effect?.duration;
  const total=effectDurationSeconds(duration);
  if(total===null)return null;
  const start=effect?._source?.start ?? effect?.start;
  const appliedAt=effect?.flags?.["trudvang-chronicles"]?.transformation?.appliedAt;
  const startTime=Number.isFinite(appliedAt)?appliedAt:start?.time;
  const worldElapsed=Number.isFinite(time)&&Number.isFinite(startTime)?Math.max(0,time-startTime):0;
  const combatElapsed=["rounds","turns"].includes(duration?.units)&&start?.combat&&start.combat===combat?.id
    &&Number.isFinite(start.round)&&Number.isFinite(Number(combat.round))?Math.max(0,Number(combat.round)-start.round)*5:0;
  return Math.max(0,total-Math.max(worldElapsed,combatElapsed));
}
/** Generated power-level duration improvements are measured in seconds.
 * Preserve the chosen unit while adding precisely the same real duration. */
export function addDurationSeconds(duration, seconds) {
  const scale = {rounds: 5, turns: 5, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800, months: 2592000, years: 31536000, centuries: 3153600000}[duration.units];
  if (!scale) throw new Error(`Unknown duration unit: ${duration.units}`);
  return normalizeEffectDuration({...duration, value: Number(duration.value) + Number(seconds) / scale});
}
