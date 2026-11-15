import {escapeHtml, renderTemplate} from "./helpers.mjs";

const SYSTEM_ID = "trudvang-chronicles";

/**
 * Name tables (FR Rules pp. 67-68): one table per culture or race, holding the
 * prefixes and the gendered suffixes of the book. Rolling a name table draws a
 * prefix then a matching suffix and posts the assembled name to the chat.
 * Dwarves have no gendered suffixes; trolls draw two affixes from one list.
 */

const resultFlags = result => result?.flags?.[SYSTEM_ID] ?? {};

/** The metadata a name table carries on its results. */
export function nameTableMeta(table) {
  const results = Array.from(table?.results ?? []);
  const parts = new Set(results.map(result => resultFlags(result).namePart).filter(Boolean));
  const genders = new Set(results.map(result => resultFlags(result).gender).filter(Boolean));
  return {
    isNameTable: Boolean(table?.flags?.[SYSTEM_ID]?.nameTable),
    results,
    // Trolls draw their two halves from a single "affix" pool.
    affixes: parts.has("affix"),
    gendered: genders.size > 0
  };
}

/**
 * Expand the parenthetical variants of an affix. The book writes optional
 * letters and alternatives in brackets: -(d)olga, -(a ou e), -(wig/-vik).
 */
export function resolveNameAffix(text) {
  return String(text ?? "").replace(/\(([^()]*)\)/g, (_, inner) => {
    // The book writes alternatives as "a ou e" or "wig/-vik"; the leading hyphen
    // of a slash variant repeats the one already outside the brackets.
    const alternatives = inner.split(/\s+ou\s+|\s*\/\s*/u)
      .map(part => part.trim().replace(/^-+/, ""))
      .filter(Boolean);
    if (alternatives.length > 1) return alternatives[Math.floor(Math.random() * alternatives.length)];
    return Math.random() < 0.5 ? inner : "";
  });
}

/** Join a prefix and a suffix without doubling the hyphen at the junction. */
export function assembleName(prefix, suffix) {
  const head = String(prefix ?? "");
  const tail = String(suffix ?? "");
  const name = `${head.endsWith("-") ? head.slice(0, -1) : head}${tail.startsWith("-") ? tail.slice(1) : tail}`;
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
}

/** Ask which sex the name is for; the caller decides whether the table needs it. */
export async function askNameGender(title) {
  const DialogClass = foundry.applications?.api?.DialogV2 ?? globalThis.DialogV2;
  return DialogClass.wait({
    window: {title},
    content: `<div class="trudvang roll-dialog">
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Macro.NameGender"))}</label>
        <select name="gender">
          <option value="male">${escapeHtml(game.i18n.localize("TRUDVANG.Macro.NameGenderMale"))}</option>
          <option value="female">${escapeHtml(game.i18n.localize("TRUDVANG.Macro.NameGenderFemale"))}</option>
        </select>
      </div>
    </div>`,
    buttons: [
      {action: "roll", icon: "fas fa-dice-d20", label: game.i18n.localize("TRUDVANG.Action.Roll"), default: true,
        callback: (event, button, dialog) => (button.form ?? dialog.element).querySelector('[name="gender"]')?.value ?? null},
      {action: "cancel", label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => false}
    ],
    modal: false,
    rejectClose: false
  });
}

/** Draw one part (prefix, suffix or affix) from a pool of table results. */
export async function drawNamePart(pool) {
  if (!pool.length) return {text: "", result: null, roll: null};
  const roll = await new Roll(`1d${pool.length}`).evaluate();
  const result = pool[roll.total - 1];
  return {result, text: resolveNameAffix(result.text), roll};
}

/**
 * Roll a name table: draw a prefix and a suffix of the requested sex (or two
 * affixes for the trolls) and post the assembled name to the chat.
 */
export async function rollNameTable(table, {displayChat = true} = {}) {
  const meta = nameTableMeta(table);
  if (!meta.isNameTable) return null;
  let gender = null;
  if (meta.gendered) {
    gender = await askNameGender(table.name);
    // The core table sheet reads roll.total even after a cancelled draw.
    if (!gender) return {roll: {total: NaN}, results: []};
  }
  // Prefixes carry no gender: only the suffixes follow the chosen sex.
  const eligible = result => {
    const flags = resultFlags(result);
    return !meta.gendered || !flags.gender || flags.gender === gender;
  };
  const poolFor = part => meta.results.filter(result => eligible(result) && resultFlags(result).namePart === part);
  const firstPool = meta.affixes ? meta.results.filter(eligible) : poolFor("prefix");
  const secondPool = meta.affixes ? meta.results.filter(eligible) : poolFor("suffix");
  const first = await drawNamePart(firstPool);
  const second = await drawNamePart(secondPool);
  const name = assembleName(first.text, second.text);
  const message = displayChat
    ? await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: await renderTemplate("systems/trudvang-chronicles/templates/chat/name-roll-card.hbs", {
        tableName: table.name ?? game.i18n.localize(table.nameKey),
        genderLabel: gender ? game.i18n.localize(`TRUDVANG.Macro.NameGender${gender === "male" ? "Male" : "Female"}`) : "",
        name,
        prefix: first.text,
        suffix: second.text
      }),
      rolls: [first.roll, second.roll].filter(Boolean)
    })
    : null;
  return {roll: first.roll ?? {total: NaN}, results: [first.result, second.result].filter(Boolean), message};
}
