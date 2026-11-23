import {escapeHtml, escapeAttribute} from "./helpers.mjs";

/** Shared layout for the targets of an area, including controls and consequences. */
export function zoneTargetList(rows, details = () => "") {
  const hint = escapeAttribute(game.i18n.localize("TRUDVANG.Dialog.TraitSituationTokenHint"));
  const title = escapeHtml(game.i18n.localize("TRUDVANG.Damage.Targets"));
  return rows.length ? `<section class="damage-targets zone-target-list"><div class="damage-targets-heading"><h4>${title}</h4></div>${rows.map(row => {
    const name = escapeHtml(row.name);
    const token = row.tokenUuid && foundry.utils.fromUuidSync?.(row.tokenUuid);
    const img = !token?.hidden && (token?.texture?.src || token?.actor?.img);
    const portrait = img ? `<img src="${escapeAttribute(img)}" alt="">` : '<span class="zone-target-portrait" aria-hidden="true"></span>';
    const label = row.tokenUuid
      ? `<a href="#" class="trait-situation-token damage-target-name" data-action="locate-trait-situation-token" data-token-uuid="${escapeAttribute(row.tokenUuid)}" title="${hint}">${name}</a>`
      : `<span class="damage-target-name">${name}</span>`;
    return `<div class="damage-target zone-target-row">${portrait}${label}<span class="zone-target-details">${details(row)}</span></div>`;
  }).join("")}</section>` : "";
}

export function zoneAction(label, attributes = {}, icon = "fa-dice-d20") {
  const tooltip = escapeAttribute(label);
  const data = Object.entries(attributes).map(([key, value]) => ` data-${key}="${escapeAttribute(value)}"`).join("");
  return `<button type="button" class="zone-target-action" title="${tooltip}" aria-label="${tooltip}"${data}><i class="fas ${icon}" aria-hidden="true"></i></button>`;
}

export function zoneOutcome(label, success) {
  return `<strong class="zone-outcome${typeof success === "boolean" ? success ? " success" : " failure" : ""}">${escapeHtml(label)}</strong>`;
}
