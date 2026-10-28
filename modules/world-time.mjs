import {appliedWorldEffects, expireAppliedEffects} from "./effects.mjs";
import {processWorldConsequences} from "./consequences.mjs";

let advancingDay;
/** Advance shared world time, independently of individual rest and recovery. */
export function advanceDay() {
  if (!game.user.isGM) {
    ui.notifications.warn(game.i18n.localize("TRUDVANG.Macro.AdvanceDayGMOnly"));
    return Promise.resolve(null);
  }
  if (advancingDay) return advancingDay;
  advancingDay = (async () => {
    const registry = foundry.documents.ActiveEffect.implementation.registry;
    // Access and register synthetic actors even on inactive scenes before the
    // clock moves. Native registration excludes library templates by itself.
    for (const effect of appliedWorldEffects()) registry.add(effect);
    const time = await game.time.advance(24 * 60 * 60);
    await processWorldConsequences(time);
    // Await the public native duration/expiry pipeline, then our final-stage
    // cleanup (document hook callbacks themselves are not awaited by Foundry).
    await registry.refresh("updateWorldTime");
    await expireAppliedEffects();
    ui.notifications.info(game.i18n.localize("TRUDVANG.Macro.DayAdvanced"));
    return time;
  })().finally(() => {advancingDay = null;});
  return advancingDay;
}
