import {renderTemplate} from "./helpers.mjs";
import {ruleTestActionViews, testActorForUser} from "./rule-tests.mjs";

/** Announce an ability without rolling for its user or applying its consequences. */
export async function useCreatureAbility(document) {
  const actor = document.actor ?? (document.parent?.documentName === "Actor" ? document.parent : null) ?? testActorForUser();
  if (!actor?.isOwner) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoActorForAbilityUse"));
  if (!actor.canPerformAction()) return actor.warnCannotAct();
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/rule-use-card.hbs", {
    actorName: actor.name, actorImg: actor.img, document,
    openAction: document.type === "creatureAbility" || document.type === "ability" ? "open-item-sheet" : "open-effect-sheet",
    ruleTests: ruleTestActionViews(document)
  });
  return ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content});
}
