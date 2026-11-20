import {bodyHealthUpdate} from "./body-health.mjs";
import {temporaryHealthState, temporaryHealthUpdate} from "./transformation-profile.mjs";

/** Life drain and internal injuries bypass armor. PS and temporary PS can
 * be committed in the same update as the originating result receipt. */
export function fatalBodyLossUpdates(actor, amount) {
  if (!amount) return {};
  const temporary = temporaryHealthState(actor);
  const paid = Math.min(amount, temporary.current);
  const health = amount - paid;
  const body = actor.system.resources.body;
  return {
    ...(paid ? temporaryHealthUpdate(actor, temporary.current - paid) : {}),
    ...(health ? bodyHealthUpdate(actor, Number(body.current ?? body.value) - health) : {})
  };
}
