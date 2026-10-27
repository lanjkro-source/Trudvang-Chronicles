import {escapeHtml, renderTemplate} from "./helpers.mjs";
import {ENVIRONMENTS, ENVIRONMENT_OPTIONS, ENVIRONMENT_COMFORTS, environmentKey, normalizeEnvironment, environmentCardLines} from "./rules/environment.mjs";

const t = key => game.i18n.localize(environmentKey(key));
export async function requestEnvironmentRoll() {
  if (!game.user.isGM) return ui.notifications.warn(t("gmOnly"));
  const select = field => `<div class="form-group"><label>${escapeHtml(t(field))}</label><select name="${field}">${Object.entries(ENVIRONMENT_OPTIONS[field]).map(([id, [value, clothing]]) => `<option value="${id}">${escapeHtml(t(`options.${field}.${id}`))} (${value > 0 ? "+" : ""}${value})${clothing ? ` · ${escapeHtml(t(`clothing.${clothing}`))}` : ""}</option>`).join("")}</select></div>`;
  const check = (id, label, checked = false) => `<label class="checkbox"><input type="checkbox" name="${id}"${checked ? " checked" : ""}>${escapeHtml(t(label))}</label>`;
  const choice = await foundry.applications.api.DialogV2.wait({window: {title: t("request")}, classes: ["dialog", "trudvang"], position: {width: 640},
    content: `<div class="roll-dialog environment-request-options"><div class="form-group"><label>${escapeHtml(t("environment"))}</label><select name="environment">${ENVIRONMENTS.map(id => `<option value="${id}">${escapeHtml(t(`types.${id}`))}</option>`).join("")}</select></div>${select("travel")}${select("temperature")}${check("temperatureClothing", "temperatureClothing", true)}${select("precipitation")}${check("precipitationClothing", "precipitationClothing", true)}${select("wind")}<fieldset><legend>${escapeHtml(t("comfort"))}</legend>${select("sleep")}${ENVIRONMENT_COMFORTS.map(id => check(id, `options.comfort.${id}`)).join("")}</fieldset><p class="hint">${escapeHtml(t("rulesHint"))}</p></div>`,
    buttons: [{action: "request", label: t("request"), default: true, callback: (event, button, dialog) => {
      const root = button.form ?? dialog.element;
      return normalizeEnvironment(Object.fromEntries([...root.querySelectorAll("input[name],select[name]")].map(el => [el.name, el.type === "checkbox" ? el.checked : el.value])));
    }}, {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}], rejectClose: false, modal: false});
  if (!choice || typeof choice !== "object") return null;
  const environment = normalizeEnvironment(choice);
  const request = {traitKey: "psyche", sv: 10, title: t("title"), environment, responses: []};
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/trait-situation-request-card.hbs", {
    gmName: game.user.name, gmImg: game.user.avatar || "icons/svg/d20.svg", title: request.title,
    buttonLabel: t("roll"), traitKey: "psyche", sv: 10, environment: true,
    environmentLines: environmentCardLines(environment, key => game.i18n.localize(key)), responses: []
  });
  return ChatMessage.create({speaker: ChatMessage.getSpeaker(), content, style: CONST.CHAT_MESSAGE_STYLES.OTHER,
    flags: {"trudvang-chronicles": {traitSituation: request}}});
}
