import { combatInitiativesAreReady } from "../combat.mjs";

const BaseCombat = foundry.documents.Combat;

/** Combat document that routes tracker initiative rolls through the Trudvang dialog. */
export class TrudvangCombat extends BaseCombat {
  /** New combatants join only during setup or the initiative phase of a round. */
  async createEmbeddedDocuments(embeddedName, data, options = {}) {
    if (embeddedName === "Combatant" && this.started && combatInitiativesAreReady(this)) {
      const message = game.i18n.localize("TRUDVANG.Warning.CombatantAdditionLocked");
      throw new Error(message);
    }
    return super.createEmbeddedDocuments(embeddedName, data, options);
  }

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
