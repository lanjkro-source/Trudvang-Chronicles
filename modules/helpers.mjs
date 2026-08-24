// V13+ namespaced renderTemplate under foundry.applications.handlebars; the global alias was
// removed in V15. Shared shim so every chat-card renderer uses the same reference.
export const renderTemplate = foundry.applications?.handlebars?.renderTemplate ?? globalThis.renderTemplate;

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("includes", (array, value) => array?.includes?.(value));
  Handlebars.registerHelper("signed", value => {
    const number = Number(value) || 0;
    return number > 0 ? `+${number}` : `${number}`;
  });
  Handlebars.registerHelper("localizeLookup", key => game.i18n.localize(key));
  Handlebars.registerHelper("concat", (...args) => args.slice(0, -1).join(""));
  Handlebars.registerHelper("array", (...args) => args.slice(0, -1));
}

export function localizeConfig(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key,
    game.i18n.localize(typeof value === "string" ? value : value.label)
  ]));
}

export function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}
