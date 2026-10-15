/** Remove only an outcome heading, preserving conditional rules inside the text. */
export function consequenceText(value) {
  return String(value ?? "").trim().replace(/^(?:(?:en cas (?:de|d[’']))\s*(?:réussite|succès|échec)|(?:on|in case of)\s+(?:success|failure)|(?:réussite|succès|échec|success|failure))\s*[:：,–—-]\s*/iu, "");
}
