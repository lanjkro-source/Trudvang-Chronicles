// Canonical English wording for short mechanical fields in the FR power source.
// Used to audit the independent English JSON, never to replace it at runtime.
export function englishPowerField(value) {
  if (value == null || value === "") return "";
  let text = String(value)
    .replace(/jusqu’à activation/giu, "until activation")
    .replace(/portée de vue et de voix/giu, "sight and voice range")
    .replace(/contact visuel/giu, "line of sight")
    .replace(/rayon de/giu, "radius of")
    .replace(/personnelle/giu, "personal")
    .replace(/immédiate?/giu, "immediate")
    .replace(/spéciale?/giu, "special")
    .replace(/ouïe/giu, "hearing")
    .replace(/vision/giu, "sight")
    .replace(/année/giu, "year")
    .replace(/heures?/giu, "hours")
    .replace(/minutes?/giu, "minutes")
    .replace(/tours? de jeu/giu, "action rounds")
    .replace(/jours?/giu, "days")
    .replace(/kilomètres?/giu, "kilometers")
    .replace(/mètre cube/giu, "cubic meter")
    .replace(/mètres?/giu, "meters")
    .replace(/niveau/giu, "level")
    .replace(/par tranche de/giu, "per")
    .replace(/points de vitner/giu, "Vitner Points")
    .replace(/\bVC\b/gu, "SV")
    .replace(/\bkm\b/gu, "km");
  text = text.replace(/\b1 (hours|minutes|action rounds|days|kilometers|meters)\b/gu, (_, unit) => `1 ${unit.slice(0, -1)}`);
  return text;
}
