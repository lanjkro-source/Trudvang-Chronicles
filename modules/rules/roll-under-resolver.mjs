/** Resolve d20 outcomes independently of the chat presentation and Foundry documents. */
export function resolveRollUnderOutcome(result, target, {perfectSuccessMax = 1, automaticSuccessMax = 0} = {}) {
  const value = Number(result);
  const finalTarget = Number(target);
  const critical = value === 20 ? "failure"
    : (perfectSuccessMax > 0 && value <= perfectSuccessMax) ? "success" : "";
  const success = critical === "success"
    || (value !== 20 && (value <= automaticSuccessMax || value <= finalTarget));
  return {success, critical, margin: success ? Math.max(0, finalTarget - value) : null};
}
