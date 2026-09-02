/** Resolve the fear state, including the 51+ madness hysteresis from the rules. */
export function resolveFearStatus({fear = 0, insane = false} = {}) {
  const value = Math.max(0, Number(fear || 0));
  if (value > 50 || (insane && value > 40)) return {level: "mad", penalty: -7, insane: true};
  if (value <= 0) return {level: "calm", penalty: 0, insane: false};
  if (value <= 10) return {level: "one", penalty: 0, insane: false};
  if (value <= 20) return {level: "two", penalty: -1, insane: false};
  if (value <= 30) return {level: "three", penalty: -3, insane: false};
  if (value <= 40) return {level: "four", penalty: -5, insane: false};
  return {level: "five", penalty: -7, insane: false};
}

/** Persist madness when fear exceeds 50, and clear it only once fear reaches 40 or less. */
export function resolveInsanityState({fear = 0, insane = false} = {}) {
  const value = Math.max(0, Number(fear || 0));
  if (value > 50) return true;
  if (value <= 40) return false;
  return Boolean(insane);
}
