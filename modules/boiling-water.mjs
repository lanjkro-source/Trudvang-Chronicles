import {waterArmorRounds} from "./rules/boiling-water.mjs";
import {applyZoneDamage} from "./zone-damage.mjs";

const SCOPE = "trudvang-chronicles";

/** Reserve one exposure per actor and phase before rolling damage. Re-entering
 * the same water neither renews the insulation nor burns the target twice. */
export async function resolveBoilingWaterContact({region, actor, message, phase, key}) {
  const info = region.flags[SCOPE].spellZone;
  const previous = info.contacts?.[key];
  let contact = previous;
  if (contact?.phase !== phase) {
    const rounds = (previous?.rounds ?? 0) + 1;
    contact = {phase, rounds, protected: rounds <= waterArmorRounds(actor)};
    await region.update({[`flags.${SCOPE}.spellZone.contacts`]: {...info.contacts, [key]: contact}});
  }
  if (!contact.protected) await applyZoneDamage({
    actor, message, formula: "1d6",
    qualification: {nature: "normal", delivery: "other", type: "fire", protection: "none"}
  });
  return {resolved: true, protected: contact.protected};
}
