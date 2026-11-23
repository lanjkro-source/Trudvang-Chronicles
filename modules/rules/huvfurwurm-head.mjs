export const HUVFURWURM_HEAD = "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6";
export const DRAGON_TABLET = HUVFURWURM_HEAD.split(":")[0];
const scope = "trudvang-chronicles";
const flags = effect => effect?.flags?.[scope];
const active = effect => !effect.disabled && !effect.isSuppressed && effect.active!==false && !effect.duration?.expired;
export const dragonRelicCracked = actor => Array.from(actor?.effects??[]).some(effect => flags(effect)?.dragonRelicCracked);
export const huvfurwurmHibernation = effect => Boolean(flags(effect)?.huvfurwurmHibernation);
export function huvfurwurmGuard(actor) {
  if (dragonRelicCracked(actor)) return null;
  return Array.from(actor?.effects??[]).find(effect => active(effect)
    && flags(effect)?.transformation?.sourceId===HUVFURWURM_HEAD && !flags(effect)?.huvfurwurmFailed) ?? null;
}
export function huvfurwurmThreshold(effect) {
  const cast = flags(effect)?.transformation?.ruleTestContext;
  const bonus = Number(cast?.countsById?.[`${HUVFURWURM_HEAD}:2`] ?? cast?.counts?.[2]) || 0;
  return 9 - Math.max(0,Math.min(3,Math.trunc(bonus)));
}
