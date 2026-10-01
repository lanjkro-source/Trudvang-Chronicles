/** User-defined grid footprint, independent of the bestiary's size coefficient. */
export function creatureTokenDimensions(size) {
  const text = String(size ?? "").trim().replaceAll(",", ".");
  const match = text.match(/^([<>]=?|[≤≥])?\s*(\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*t?\s*(\+)?$/i);
  if (!match) return null;
  let value = Number(match[2]) / (match[3] === undefined ? 1 : Number(match[3]));
  if (!Number.isFinite(value) || value <= 0) return null;
  // An open-ended size such as >10 or 10+ belongs to the next footprint.
  if (match[1] === ">" || match[4]) value += Number.EPSILON * Math.max(1, value) * 2;
  if (match[1] === "<") value -= Number.EPSILON * Math.max(1, value) * 2;
  // Strictly below half-size uses half a square; half-size itself uses one square.
  const side = value < 0.5 ? 0.5 : value <= 1.5 ? 1 : value <= 2 ? 2
    : value <= 4 ? 3 : value <= 7 ? 4 : value <= 10 ? 5 : 6;
  return {width: side, height: side};
}
