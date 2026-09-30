/* French Bestiary pp. 9-10 control all size bands and table values.
 * Text lives in the locale files; this generator stores only structural rules.
 * Run after editing the creatureSize labels: node tools/generate-creature-size-journal.mjs
 */
import {readFileSync, writeFileSync} from "node:fs";

const sizeValues = [1 / 6, 1 / 3, 1 / 2, 1, 1.5, 2, 3, 5, 10];
const unarmed = [
  [null, [1, 2], 1],
  [[1, 2], [1, 5], [1, 3]],
  [[1, 3], [1, 10], [1, 5]],
  [[1, 5], [1, 10, 10], [1, 10]],
  [[1, 10], [1, 10, 9], [1, 10, 10]],
  [[1, 10, 10], [2, 10, 9], [2, 10, 10]],
  [[2, 10, 9], [2, 10, 8], [2, 10, 9]],
  [[2, 10, 8], [3, 10, 8], [3, 10, 9]],
  [[2, 10, 8], [3, 10, 8], [3, 10, 9]]
];
const armed = [
  [[1, 2], [1, 3], [1, 5]],
  [[1, 5], [1, 5], [1, 10, 10]],
  [[1, 10], [1, 10, 10], [1, 10, 9]],
  [[1, 10, 10], [1, 10, 9], [1, 10, 8]],
  [[1, 10, 9], [2, 10, 9], [2, 10, 8]],
  [[2, 10, 9], [2, 10, 8], [2, 10, 7]],
  [[3, 10, 8], [3, 10, 8], [3, 10, 7]],
  [[3, 10, 7], [3, 10, 7], [4, 10, 7]],
  [[3, 10, 7], [4, 10, 7], [4, 10, 7]]
];
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const cell = (value, header = false, attributes = "") => `<${header ? "th" : "td"}${attributes}>${escape(value)}</${header ? "th" : "td"}>`;
const row = values => `<tr>${values.map(value => cell(value)).join("")}</tr>`;

function journalHtml(labels, locale) {
  const number = new Intl.NumberFormat(locale);
  const c = labels.Columns;
  const sections = [];
  const table = (key, headers, rows, {numeric = false, extraClass = "", note} = {}) => {
    sections.push(`<section class="trudvang-rules-table"><h2>${escape(labels.Tables[key])}</h2><div class="trudvang-rules-table-scroll"><table class="${numeric ? "trudvang-rules-numeric" : ""}${extraClass ? ` ${extraClass}` : ""}"><thead>${headers}</thead><tbody>${rows}</tbody></table></div>${note ? `<p>${escape(note)}</p>` : ""}</section>`);
  };
  const headers = values => `<tr>${values.map(value => cell(value, true, ' scope="col"')).join("")}</tr>`;
  const attackSizes = labels.Sizes.slice(0, -1).concat("10");
  const attackRows = attackSizes.map((size, attacker) => `<tr>${cell(size, true, ' scope="row"')}${attackSizes.map((_, target) => {
    const modifier = Math.max(0, Math.abs(target - attacker) - 1) * Math.sign(target - attacker);
    return cell(modifier === 0 ? "-" : modifier > 0 ? `+${modifier}` : modifier);
  }).join("")}</tr>`).join("");
  table("Attack", `<tr>${cell("", true)}${cell(c.TargetSize, true, ' colspan="9"')}</tr>${headers([c.AttackerSize, ...attackSizes])}`, attackRows, {numeric: true, note: labels.Notes.Attack});

  const movementHeaders = `<tr>${cell(c.Size, true, ' rowspan="2" scope="col"')}${[c.LandHumanoid, c.LandQuadruped, c.Flight].map(value => cell(value, true, ' colspan="2" scope="colgroup"')).join("")}${[c.SwimLand, c.SwimAquatic].map(value => cell(value, true, ' rowspan="2" scope="col"')).join("")}</tr>${headers([c.Normal, c.FastHumanoid, c.Normal, c.Fast, c.Normal, c.Fast])}`;
  const movementRows = sizeValues.map((size, index) => {
    const effectiveSize = Math.max(1, size);
    // The approved humanoid Fast column extrapolates the doubling of movement.
    const distances = [1, 2, 2, 4, 2, 4, 0.5, 1].map(multiplier => `${index === sizeValues.length - 1 ? "≥ " : ""}${number.format(effectiveSize * multiplier)} ${labels.Metre}`);
    return `<tr>${cell(labels.Sizes[index], true, ' scope="row"')}${distances.map(value => cell(value)).join("")}</tr>`;
  }).join("");
  table("Movement", movementHeaders, movementRows, {numeric: true, extraClass: "trudvang-rules-movement"});
  sections.push(`<ul>${[labels.Notes.Movement, labels.Notes.HumanoidFast, labels.Notes.LargeMovement, labels.Notes.MaximumMovement].map(note => `<li>${escape(note)}</li>`).join("")}</ul>`);

  const referenceSizes = labels.Sizes.slice(0, -1).concat(labels.OverTen);
  for (const key of ["Humanoids", "Quadrupeds"]) {
    table(key, headers([c[key], c.Equivalent, c.SizeCoefficient]), labels[key].map((description, index) => row([description, labels.Equivalents[index], referenceSizes[index]])).join(""));
  }
  table("Huge", headers([c.ExtremeSize, c.Equivalent]), labels.Huge.map((description, index) => row([description, labels.HugeEquivalents[index]])).join(""));
  table("Rounds", headers([c.Size, c.Rounds]), labels.RoundSizes.map((size, index) => row([size, labels.RoundCounts[index]])).join(""), {note: labels.Notes.Rounds});
  const damage = value => {
    if (value === null) return "-";
    if (!Array.isArray(value)) return String(value);
    const [count, die, open] = value;
    return `${count}D${die}${open ? ` (${labels.OpenRoll} ${open}${open < 10 ? "-10" : ""})` : ""}`;
  };
  for (const [key, values, columns] of [["Unarmed", unarmed, [c.Unarmed, c.Bite, c.Claw]], ["Armed", armed, [c.LightWeapon, c.HeavyWeapon, c.TwoHandedWeapon]]]) {
    table(key, headers([c.Size, ...columns]), values.map((values, index) => row([labels.Sizes[index], ...values.map(damage)])).join(""), {numeric: true});
  }
  sections.push(`<p>${escape(labels.Notes.Strength)}</p><p><em>${escape(labels.Source)}</em></p>`);
  return `<article class="trudvang-religion-journal trudvang-rules-journal">${sections.join("")}</article>`;
}

for (const language of ["fr", "en"]) {
  const path = `lang/${language}.json`;
  const locale = JSON.parse(readFileSync(path, "utf8"));
  const labels = locale.TRUDVANG.Content.Journal.creatureSize;
  if (!labels) throw new Error(`Missing creatureSize labels in ${path}.`);
  labels.Content = journalHtml(labels, language);
  writeFileSync(path, `${JSON.stringify(locale, null, 2)}\n`);
}
console.log("Creature-size journals regenerated (8 tables per locale).");
