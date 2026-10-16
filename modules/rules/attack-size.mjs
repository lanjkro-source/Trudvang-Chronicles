/** FR Bestiaire de Jorge, pp. 8–10; EN GM Guide, creature size.
 * The first band is open (<1/3); other numeric sizes use the nearest column. */
export const ATTACK_SIZE_BANDS = [1 / 6, 1 / 3, 1 / 2, 1, 1.5, 2, 3, 5, 10];

export function attackSizeBand(size) {
  const text = String(size ?? "").trim().replace(",", ".");
  const match = text.match(/^([<>]=?|[≤≥])?\s*(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*t?\s*\+?$/iu);
  if (!match) return 3;
  let value = Number(match[2]) / Number(match[3] ?? 1);
  if (!Number.isFinite(value) || value <= 0) return 3;
  if (match[1] === "<" && value <= 1 / 3) return 0;
  // The FR-authoritative bestiary also encodes the 1/3 band as decimal 0.33.
  if (Math.abs(value - 1 / 3) < 0.005) value = 1 / 3;
  if (value < 1 / 3) return 0;
  return ATTACK_SIZE_BANDS.reduce((best, candidate, index) => Math.abs(candidate - value) < Math.abs(ATTACK_SIZE_BANDS[best] - value) ? index : best, 1);
}

export function attackSizeModifier(attackerSize, targetSize) {
  const difference = attackSizeBand(targetSize) - attackSizeBand(attackerSize);
  const magnitude = Math.max(0, Math.abs(difference) - 1);
  return magnitude ? Math.sign(difference) * magnitude : 0;
}

export function attackSizeTargets(attacker, targets = []) {
  const size = actor => actor?.type === "character" ? 1 : actor?.system?.details?.size ?? 1;
  return Array.from(targets).filter(token => token?.actor).map(token => ({
    name: token.name || token.actor.name || "", actorUuid: token.actor.uuid || "",
    tokenUuid: token.document?.uuid || token.uuid || "",
    modifier: attackSizeModifier(size(attacker), size(token.actor))
  }));
}

export function allocatedCombatVC(allocated, feint = 0, sizeModifier = 0, pointCost = 1) {
  return Math.floor((Number(allocated) - Number(feint)) / Number(pointCost)) + Number(sizeModifier);
}
