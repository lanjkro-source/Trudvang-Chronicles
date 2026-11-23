import {escapeHtml, escapeAttribute} from "./helpers.mjs";

/** Shared layout for the targets of an area, including controls and consequences. */
export function zoneTargetList(rows, details = () => "") {
  const hint = escapeAttribute(game.i18n.localize("TRUDVANG.Dialog.TraitSituationTokenHint"));
  return rows.length ? `<ul class="zone-target-list">${rows.map(row => {
    const name = escapeHtml(row.name);
    const label = row.tokenUuid
      ? `<button type="button" class="trait-situation-token" data-action="locate-trait-situation-token" data-token-uuid="${escapeAttribute(row.tokenUuid)}" title="${hint}">${name}</button>`
      : `<span>${name}</span>`;
    return `<li class="zone-target-row">${label}<span class="zone-target-details">${details(row)}</span></li>`;
  }).join("")}</ul>` : "";
}

export function zoneOutcome(label, success) {
  return `<strong class="zone-outcome${typeof success === "boolean" ? success ? " success" : " failure" : ""}">${escapeHtml(label)}</strong>`;
}
