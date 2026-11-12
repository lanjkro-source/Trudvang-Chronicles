import {PERMANENT_RELIGION_EFFECT_IDS} from "./rules/effect-stacking.mjs";

/** The Ancienne Tradition (specialty bruid) grants its followers two permanent
 * marks: the blood oath they swear and the oath they break. Both are graded:
 * every degree costs one maximum Body Point, and neither can ever be removed.
 * They are added automatically at degree 0 and never re-created at a higher
 * degree, so a degree raised by the GM is never silently reset. */
const RELIGION_ID = "ealdTradition";

const EFFECT_DATA = {
  "trudvang-serment-de-sang": {
    nameKey: "TRUDVANG.Content.Item.SermentDeSang.Name",
    img: "systems/trudvang-chronicles/assets/icons/statuses/blood-oath.svg"
  },
  "trudvang-parjure": {
    nameKey: "TRUDVANG.Content.Item.Parjure.Name",
    img: "systems/trudvang-chronicles/assets/icons/statuses/oath-breaker.svg"
  }
};

function effectDataFor(stackId) {
  const entry = EFFECT_DATA[stackId];
  return {
    name: game.i18n.localize(entry.nameKey),
    img: entry.img,
    type: "effect",
    transfer: false,
    duration: {value: null, units: "rounds", expiry: null, expired: false},
    system: {
      stackId,
      stacking: "stack",
      degree: 0,
      stages: [],
      changes: [{
        key: "system.modifiers.bodyMax",
        type: "add",
        value: "-1",
        priority: 20,
        phase: "initial"
      }]
    },
    flags: {"trudvang-chronicles": {permanent: true}}
  };
}

/** Add the two permanent marks to an Ancienne Tradition follower. The effects
 * are never removed: an oath sworn and an oath broken both endure. An existing
 * mark keeps the degree the GM gave it and is only revived when it was
 * disabled or somehow expired.
 * `options` carries the synchronizer's own marker so the creation does not
 * re-enter this synchronization. */
export async function syncReligionEffects(actor, options = {}) {
  if (!actor?.selectedReligion || actor.selectedReligion.id !== RELIGION_ID) return false;
  let changed = false;
  for (const stackId of PERMANENT_RELIGION_EFFECT_IDS) {
    const existing = Array.from(actor.effects ?? []).find(effect => effect.system?.stackId === stackId);
    if (!existing) {
      await actor.createTrudvangEffect(effectDataFor(stackId), options);
      changed = true;
      continue;
    }
    const updates = {};
    if (existing.disabled) updates.disabled = false;
    // A permanent mark never expires; revive one that somehow lapsed.
    if (existing.duration?.expired) updates.duration = {value: null, units: "rounds", expiry: null, expired: false};
    if (Object.keys(updates).length) {
      await existing.update(updates, options);
      changed = true;
    }
  }
  return changed;
}
