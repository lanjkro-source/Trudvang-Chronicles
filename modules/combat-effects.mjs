// FR Rules p. 320 / EN GM Guide: Surprise Attack. An action round is the
// entire initiative cycle, not one combatant's turn. Never use turnEnd here.
export const SURPRISED_STATUS = "trudvang-surprised";
export const SURPRISED_ITEM = "trudvang-surprised";
const S = "trudvang-chronicles";
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);

export function currentRoundExpiry(combat = game.combat) {
  return combat?.started ? {combatId: combat.id, round: Number(combat.round ?? combat.current?.round ?? 0)} : null;
}
export async function applyMounted(actor) {
  const expiry = currentRoundExpiry();
  if (!expiry || !actor.canUserModify(game.user, "update")) return null;
  return actor.createTrudvangEffect({name: game.i18n.localize("TRUDVANG.Status.Mounted"),
    img: "systems/trudvang-chronicles/assets/icons/statuses/mounted.svg", type: "effect", transfer: false,
    statuses: ["trudvang-mounted"], duration: {value: null, units: "seconds", expiry: null, expired: false},
    system: {stackId: "trudvang-mounted", stacking: "replace", changes: [], stages: []},
    flags: {[S]: {untilRoundEnd: true, combatRoundExpiry: expiry}}});
}
export async function applySurprised(actor, source) {
  if (!actor?.canUserModify(game.user, "update")) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.EffectPermission"));
  if (!currentRoundExpiry()) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Status.SurprisedNeedsCombat"));
  const template = values(source?.effects).find(effect => !effect.disabled);
  const data = template?.toObject?.() ?? {
    name: game.i18n.localize("TRUDVANG.Status.Surprised"), img: "systems/trudvang-chronicles/assets/icons/statuses/surprised.svg", type: "effect",
    statuses: [SURPRISED_STATUS], system: {stackId: SURPRISED_ITEM, stacking: "replace", changes: [], stages: []}
  };
  delete data._id;
  data.origin = source?.uuid ?? null;
  data.transfer = false;
  data.start = null;
  data.duration = {value: null, units: "seconds", expiry: null, expired: false};
  data.flags = {...data.flags, [S]: {...data.flags?.[S], untilRoundEnd: true, combatRoundExpiry: currentRoundExpiry()}};
  return actor.createTrudvangEffect(data);
}

/** Expire only effects authored with this round-bound lifetime, including
 * unlinked tokens on inactive scenes and recipients outside the tracker. */
const roundExpiryJobs = new WeakMap();
export function expireRoundEffects(combat, options = {}) {
  // combatTurnChange and updateCombat can run before either deletion finishes.
  // Serialize their scans so a second scan sees the updated effect collection.
  const run = () => expireRoundEffectsNow(combat, options);
  const previous = roundExpiryJobs.get(combat) ?? Promise.resolve();
  const job = previous.then(run, run).finally(() => {
    if (roundExpiryJobs.get(combat) === job) roundExpiryJobs.delete(combat);
  });
  roundExpiryJobs.set(combat, job);
  return job;
}
async function expireRoundEffectsNow(combat, {ended = false} = {}) {
  if (!(game.users?.activeGM?.isSelf ?? game.user?.isActiveGM)) return;
  const actors = new Set(values(game.actors));
  for (const scene of values(game.scenes)) for (const token of values(scene.tokens)) if (token.actor) actors.add(token.actor);
  for (const combatant of values(combat.combatants)) if (combatant.actor) actors.add(combatant.actor);
  for (const actor of actors) {
    const ids = values(actor.effects).filter(effect => {
      const expiry = effect.flags?.[S]?.combatRoundExpiry;
      return expiry?.combatId === combat.id
        && (ended || !combat.started || Number(combat.round) > Number(expiry.round));
    }).map(effect => effect.id);
    if (ids.length) await actor.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}
export function registerCombatEffectHooks() {
  Hooks.on("combatTurnChange", combat => expireRoundEffects(combat));
  Hooks.on("updateCombat", combat => expireRoundEffects(combat));
  Hooks.on("deleteCombat", combat => expireRoundEffects(combat, {ended: true}));
  Hooks.on("ready", async () => { for (const combat of values(game.combats)) await expireRoundEffects(combat); });
}
