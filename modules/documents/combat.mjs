const BaseCombat = foundry.documents.Combat;

/** Combat document that routes tracker initiative rolls through the Trudvang dialog. */
export class TrudvangCombat extends BaseCombat {
  async rollInitiative(ids, options = {}) {
    const requestedIds = typeof ids === "string" ? [ids] : Array.from(ids ?? []);
    const handledIds = [];
    const fallbackIds = [];
    for (const id of requestedIds) {
      const combatant = this.combatants.get(id);
      if (typeof combatant?.actor?.rollInitiativeTrudvang !== "function") {
        fallbackIds.push(id);
        continue;
      }
      await combatant.actor.rollInitiativeTrudvang({combatant});
      handledIds.push(id);
    }
    if (fallbackIds.length) return super.rollInitiative(fallbackIds, options);
    return handledIds.length ? this : super.rollInitiative(requestedIds, options);
  }
}
