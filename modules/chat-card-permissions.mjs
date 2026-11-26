import {canResolveReleasedSeal} from "./magic-seal.mjs";
import {ruleTestsForDocument} from "./rule-tests.mjs";

const scope = "trudvang-chronicles";
const resolve = uuid => uuid && foundry.utils.fromUuidSync?.(uuid);
const speakerOwner = (user,uuid) => Boolean(resolve(uuid)?.testUserPermission?.(user,"OWNER"));
const owns = (document,user) => Boolean(document?.testUserPermission?.(user,"OWNER"));
const limited = (document,user) => Boolean(document?.testUserPermission?.(user,"LIMITED"));
const sourceActions = new Set(["damage","magic-damage","magic-fear","roll-fatal-effect"]);
const zoneActions = new Set(["place-spell-zone","end-fog","attach-spell-light","attach-inventory-light","apply-spell-zone"]);
const targetActions = new Set(["apply-damage","resist-damage","resist-impact"]);
const gmActions = new Set(["extinguish-spell-fire","damage-spell-wall","apply-environment-fatigue"]);

export function canUseChatAction(message,control,user=game.user) {
  const {action,actorUuid,targetActorUuid,targetItemUuid,itemUuid,testIndex} = control.dataset;
  const flags = message.flags?.[scope] ?? {};
  if (flags.npcRollDetails && !["toggle-roll-details","roll-fatal-effect"].includes(action)) return false;
  if (user.isGM) return true;
  if (gmActions.has(action)) return false;
  if (sourceActions.has(action)) return speakerOwner(user,actorUuid) || (["magic-damage","magic-fear"].includes(action)&&canResolveReleasedSeal(message,user));
  if (zoneActions.has(action)) return speakerOwner(user,flags.ruleTestContext?.casterUuid??flags.spellZoneTest?.casterUuid) || canResolveReleasedSeal(message,user);
  if (targetActions.has(action)) return speakerOwner(user,targetActorUuid);
  if (action==="apply-defense-damage") return owns(resolve(targetItemUuid)?.parent,user);
  if (action==="remove-damage-target") return message.author?.id===user.id || message._source?.author===user.id || speakerOwner(user,targetActorUuid);
  if (action==="spell-zone-test") return speakerOwner(user,actorUuid);
  if (action==="consequence-resistance") return speakerOwner(user,flags.consequenceActor);
  if (action==="roll-rule-test") {
    const document=resolve(control.closest("[data-rule-document-uuid]")?.dataset.ruleDocumentUuid);
    if (document?.documentName==="ActiveEffect" && document.parent?.documentName==="Actor") return owns(document.parent,user);
    const test=document && ruleTestsForDocument(document)[Number(testIndex)];
    if (test?.casterTest) return speakerOwner(user,flags.ruleTestContext?.casterUuid??document.actor?.uuid);
  }
  if (action==="open-actor-sheet"||action==="open-skill-detail") return limited(resolve(control.closest("[data-actor-uuid]")?.dataset.actorUuid),user);
  if (action==="open-item-sheet") return limited(resolve(control.closest("[data-item-uuid]")?.dataset.itemUuid),user);
  if (action==="open-effect-sheet") return limited(resolve(control.closest("[data-rule-document-uuid]")?.dataset.ruleDocumentUuid),user);
  return true;
}

export function pruneChatActions(message,html,user=game.user) {
  for (const control of html.querySelectorAll("[data-action]")) if (!canUseChatAction(message,control,user)) control.remove();
  if (message.flags?.[scope]?.npcRollDetails) for (const control of html.querySelectorAll("[data-transformation-key],.package-availability-roll")) control.remove();
}
