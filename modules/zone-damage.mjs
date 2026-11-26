import {parseSimpleDamageFormula} from "./rules/equipment-resolver.mjs";

const SCOPE = "trudvang-chronicles";

export function zoneDamageReceipt(actor, messageId, pulse = 0) {
  return actor?.getFlag?.(SCOPE, "zoneDamage")?.[messageId]?.[`pulse${pulse}`];
}

export async function applyZoneDamage({actor, message, formula, openRoll = 0, qualification, pulse = 0, legacyEvent}) {
  const previous = zoneDamageReceipt(actor, message.id, pulse);
  if (previous) return previous;
  const receipt = `flags.${SCOPE}.zoneDamage.${message.id}.pulse${pulse}`;
  // TEMPORARY WORLD MIGRATION: finish or reuse a damage card created before the area had inline damage.
  const legacy = legacyEvent && Array.from(game.messages.values()).find(card =>
    card.getFlag?.(SCOPE, "persistentDamageEvent") === legacyEvent);
  if (legacy) {
    const {requestChatApplication} = await import("./chat-application.mjs");
    const result = await requestChatApplication({message: legacy, actor, channel: "body"});
    if (!["applied", "alreadyApplied", "ineligibleTarget"].includes(result.status)) throw Error("Area damage application failed");
    const row = legacy.getFlag(SCOPE, "applications")?.find(row => row.actorUuid === actor.uuid && row.channel === "body");
    const recorded = {amount: row?.amount ?? 0, temporary: Math.max(0, (row?.impactDamage ?? 0) - (row?.amount ?? 0))};
    await actor.update({[receipt]: recorded});
    return recorded;
  }
  const parsed = parseSimpleDamageFormula(formula);
  let damage, rolls;
  if (parsed) {
    const {openDice} = await import("./dice.mjs");
    const rolled = await openDice({...parsed, threshold: openRoll});
    damage = rolled.total;
    rolls = rolled.diceRolls;
  } else {
    const roll = new Roll(formula);
    await roll.evaluate();
    damage = Number(roll.total);
    rolls = [roll];
  }
  const {applyDamageToActor} = await import("./damage-application.mjs");
  const result = await applyDamageToActor({
    actor, damage: Math.max(0, damage), usage: "magic", qualification, announce: false, receipt
  });
  if (!result) throw Error("Area damage application failed");
  if (game.dice3d?.showForRoll) {
    const casterUuid=message.flags?.[SCOPE]?.spellZoneTest?.casterUuid??message.flags?.[SCOPE]?.ruleTestContext?.casterUuid;
    const caster=casterUuid?await foundry.utils.fromUuid(casterUuid):null;
    const privateDice=(caster??actor)?.type==="npc";
    const recipients = Array.from(game.users.values()).filter(user => user.isGM
      || (!privateDice && !message.blind && actor.testUserPermission(user, "OWNER"))).map(user => user.id);
    try {
      for (const roll of rolls) await game.dice3d.showForRoll(roll, game.user, !privateDice, recipients, Boolean(message.blind));
    } catch (error) {
      console.error("Trudvang | Area damage animation failed", error);
    }
  }
  return {amount: result.bodyDamage, temporary: result.temporaryDamage};
}
