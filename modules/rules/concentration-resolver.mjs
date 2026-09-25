/** Choose the concentration track with the larger maximum reserve; ties favor divine powers. */
export function defaultConcentrationType({vitnerMax = 0, divinityMax = 0} = {}) {
  return Number(vitnerMax || 0) > Number(divinityMax || 0) ? "spell" : "divine";
}
