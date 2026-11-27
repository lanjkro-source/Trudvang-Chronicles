import {npcRollDetailsId,readNpcRollDetails} from "./chat-roll-privacy.mjs";

export function bindFatalEffectButton(button) {
  button.addEventListener("click", async event => {
    event.preventDefault();
    if (button.disabled) return;
    const kind = button.dataset.fatalKind;
    const threshold = Number(button.dataset.fatalThreshold);
    const modifier = Number(button.dataset.fatalModifier);
    if (!["faith", "vitner"].includes(kind) || !Number.isInteger(threshold) || !Number.isInteger(modifier)) return;
    const actor = await foundry.utils.fromUuid(button.dataset.actorUuid);
    if (!actor?.isOwner) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CannotRollForActor"));
    button.disabled = true;
    try {
      const power = button.dataset.fatalPowerId
        ? {id: button.dataset.fatalPowerId, name: button.dataset.fatalPowerName}
        : null;
      const cost = button.dataset.fatalCost ? Number(button.dataset.fatalCost) : undefined;
      const draw = await actor.rollFatalEffect(kind, {threshold, modifier, power, cost});
      if (!draw?.results?.length) button.disabled = false;
    } catch (error) {
      button.disabled = false;
      throw error;
    }
  });
}

async function openDetails(message, ids) {
  if (!game.user.isGM) return;
  const records = (await Promise.all(ids.map(readNpcRollDetails))).filter(Boolean);
  if (!records.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.NpcRollDetails.Unavailable"));
  const body = document.createElement("div");
  for (const record of records) {
    const part = document.createElement("template");
    part.innerHTML = record.content;
    for (const element of part.content.querySelectorAll("script, iframe, embed, object, link, meta, style, form, svg, math")) element.remove();
    for (const element of part.content.querySelectorAll("*")) {
      if (element.matches(".trudvang-transformation-links, .damage-targets, [data-damage-resistance]")) {
        element.remove();
        continue;
      }
      if (element.matches('button.target[data-action="toggle-roll-details"]')) {
        // The calculation is already open in this dialog. Keep its threshold as text.
        const target = document.createElement("span");
        target.className = "target";
        target.textContent = element.textContent;
        element.replaceWith(target);
        continue;
      }
      if (element.matches("button")) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        const fatal = element.dataset.action==="roll-fatal-effect" && ids.includes(npcRollDetailsId(message));
        if (!fatal || actor?.uuid!==element.dataset.actorUuid || !actor?.testUserPermission?.(message.author,"OWNER")) {
          element.remove();
          continue;
        }
      }
      for (const attr of [...element.attributes]) if (/^on|^(?:href|srcdoc|style|formaction)$/i.test(attr.name)) element.removeAttribute(attr.name);
    }
    for (const details of part.content.querySelectorAll("[data-roll-details]")) {
      details.hidden = false;
      details.classList.remove("is-collapsed");
    }
    body.append(part.content);
  }
  const Dialog = foundry.applications.api.DialogV2;
  new Dialog({
    window:{title:game.i18n.localize("TRUDVANG.Tab.Details")},
    classes:["trudvang","npc-roll-details-dialog"],
    content:body.innerHTML,
    render:(_event,dialog)=>dialog.element.querySelectorAll("[data-action='roll-fatal-effect']").forEach(bindFatalEffectButton),
    buttons:[{action:"close",label:game.i18n.localize("Close"),default:true}]
  }).render({force:true});
}

export function renderNpcRollControls(message,html) {
  if (!game.user.isGM) return;
  const createButton = ids => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "npc-roll-details-button";
    button.textContent = game.i18n.localize("TRUDVANG.Tab.Details");
    button.addEventListener("click",async () => {
      button.disabled = true;
      try { await openDetails(message,ids); }
      catch(error) {
        console.error("Trudvang | Could not open NPC roll details",error);
        ui.notifications.warn(game.i18n.localize("TRUDVANG.NpcRollDetails.Unavailable"));
      } finally { button.disabled = false; }
    });
    return button;
  };
  const detailId = npcRollDetailsId(message);
  if (detailId) {
    const card = html.querySelector(".chat-card") ?? html.querySelector(".message-content") ?? html;
    card.append(createButton([detailId]));
  }
  const rowDetails = new Map();
  for (const marker of html.querySelectorAll("[data-npc-roll-details]")) {
    const row = marker.closest(".zone-target-details,.trait-situation-result,.disease-resistance-result,[data-damage-resistance-result]") ?? marker.parentElement;
    const ids = rowDetails.get(row) ?? new Set();
    for (const id of marker.dataset.npcRollDetails.split(" ").filter(Boolean)) ids.add(id);
    rowDetails.set(row,ids);
    marker.remove();
  }
  for (const [row,ids] of rowDetails) if(ids.size) row.append(createButton([...ids]));
}
