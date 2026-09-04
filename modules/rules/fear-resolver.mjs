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

/** Parse the NPC fear-factor notation, e.g. `1d10 (JO 8-10)`. */
export function parseFearFactor(value = "") {
  const match = String(value || "").trim().match(/^(\d*)d(\d+)(?:\s*\(\s*(?:JO|O)\s*(\d+)(?:\s*-\s*\d+)?\s*\))?$/i);
  if (!match) return {dice: 1, faces: 10, threshold: 0, valid: false};
  return {dice: Math.max(1, Number(match[1] || 1)), faces: Math.max(2, Number(match[2] || 10)), threshold: Math.max(0, Number(match[3] || 0)), valid: true};
}

/** Store a factor in the book's familiar notation while the sheet edits its two components. */
export function formatFearFactor({dice = 1, faces = 10, threshold = 0} = {}) {
  const parsedDice = String(dice || "").trim().match(/^(\d*)d(\d+)$/i);
  const notation = parsedDice
    ? `${Math.max(1, Number(parsedDice[1] || 1))}d${Math.max(2, Number(parsedDice[2] || 10))}`
    : `${Math.max(1, Number(dice) || 1)}d${Math.max(2, Number(faces) || 10)}`;
  const openRoll = Math.max(0, Number(threshold) || 0);
  return openRoll ? `${notation} (JO ${openRoll}-10)` : notation;
}
