import {generateRandomName} from "./name-tables.mjs";

const scope = "trudvang-chronicles";
const cultures = ["stormlander", "mittlander", "virann", "wildfolk", "elf", "dwarf", "troll"];
const label = key => game.i18n.localize(`TRUDVANG.TokenNames.${key}`);

export function tokenNameCulture(actor) {
  const {culture, race} = actor.system?.details ?? {};
  if (actor.system?.tags?.includes("troll") || /^troll$/i.test(race ?? actor.system?.details?.creatureType ?? "")) return "troll";
  if (["elf", "dwarf"].includes(race)) return race;
  if (["borjornikka","buratja","zlodd"].includes(race)) return "dwarf";
  return ({borjornikka: "dwarf", kopparberg: "dwarf", buratja: "dwarf", korpikalla: "elf", illmalaina: "elf", korpikalli: "elf", illmalaini: "elf",
    stormlanders: "stormlander", mittlanders: "mittlander", sauvage: "wildfolk"})[culture]
    ?? (cultures.includes(culture) ? culture : "");
}

export function applyRandomTokenName(actor, token, data) {
  const settings = actor.prototypeToken?.flags?.[scope];
  if (data.name != null || settings?.randomName !== true) return token;
  const generated = generateRandomName(settings.nameCulture || tokenNameCulture(actor), settings.nameGender || undefined);
  if (!generated) return token;
  // Core has already applied any enabled adjective and numbering options.
  const base = actor.prototypeToken.name || actor.name;
  const decorated = token.name ?? "";
  const index = base ? decorated.lastIndexOf(base) : -1;
  token.updateSource({name: index < 0 ? generated : decorated.slice(0, index) + generated + decorated.slice(index + base.length)});
  return token;
}

export function registerTokenNameOptions() {
  Hooks.on("renderPrototypeTokenConfig", (app, html) => {
    const nextTo = (html.querySelector('[name="prependAdjective"], [name="appendNumber"]')
      ?? html.querySelector('[name="name"]'))?.closest(".form-group");
    const flags = app.document?.flags?.[scope] ?? {};
    const field = key => `flags.${scope}.${key}`;
    if (!nextTo || html.querySelector(`[name="${field("randomName")}"]`)) return;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = field("randomName");
    checkbox.checked = flags.randomName === true;
    checkbox.disabled = app.isEditable === false;
    const section = document.createElement("div");
    section.className = "form-group";
    const heading = document.createElement("label");
    heading.append(checkbox, " ", label("Random"));
    section.append(heading);
    nextTo.after(section);

    const addSelect = (name, title, values) => {
      const row = document.createElement("div");
      row.className = "form-group";
      const heading = document.createElement("label");
      heading.textContent = label(title);
      const input = document.createElement("select");
      input.name = field(name);
      input.setAttribute("aria-label", heading.textContent);
      input.disabled = checkbox.disabled;
      for (const [value, text] of values) input.add(new Option(text, value, false, value === (flags[name] ?? "")));
      row.append(heading, input);
      section.after(row);
      return row;
    };
    const genders = [["", label("Auto")], ...["male","female"].map(gender => [
      gender, game.i18n.localize(`TRUDVANG.Macro.NameGender${gender === "male" ? "Male" : "Female"}`)
    ])];
    const gender = addSelect("nameGender", "Gender", genders);
    const culture = addSelect("nameCulture", "Culture", [["", label("Auto")], ...cultures.map(id => [
      id, game.i18n.localize(`TRUDVANG.Content.Table.${id[0].toUpperCase()+id.slice(1)}Names.Name`)
    ])]);
    const setVisibility = () => { culture.style.display = gender.style.display = checkbox.checked ? "" : "none"; };
    checkbox.addEventListener("change", setVisibility);
    setVisibility();
  });
}
