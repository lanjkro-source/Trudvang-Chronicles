// FR Livre des règles pp. 97, 128–129, 303–305 controls the procedures and tables.
// Display text lives exclusively in lang/*.json; only numeric structure lives here.
import {readFileSync, writeFileSync} from "node:fs";
import {HUNTING_FOOD, TRAINING_FACTORS} from "../modules/rules/knowledge-procedures.mjs";

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const p = value => `<p>${escape(value)}</p>`;
const h = value => `<h2>${escape(value)}</h2>`;
const table = (head, rows) => `<div class="trudvang-rules-table-scroll"><table><thead><tr>${head.map(v => `<th scope="col">${escape(v)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => `<td>${escape(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const article = html => `<article class="trudvang-religion-journal trudvang-rules-journal">${html}</article>`;
export function trainingHtml(l) {
  let html = p(l.Intro) + h(l.LearningTitle) + p(l.Learning);
  html += h(l.CountTitle) + table([l.Type, ...l.Stages], Object.values(TRAINING_FACTORS).map((factor, i) => [l.Names[i], ...[1, 2, 3, 4, 5].map(n => n * factor)]));
  html += `<aside class="trudvang-religion-example">${p(l.Example)}</aside>`;
  for (let i = 0; i < l.Names.length; i++) {
    html += h(l.Names[i]) + p(l.Descriptions[i]);
    const definition = {0: [l.FetchTitle, [3, 6, 9, 12, 15]], 2: [l.HuntTitle, ["—", 2, 4, 6, 8]], 7: [l.GuardTitle, [10, 12, 14, 16, 18]]}[i];
    if (definition) html += `<h3>${escape(definition[0])}</h3>` + table([l.Effectiveness, l.SV], l.Stages.map((stage, n) => [stage, definition[1][n]]));
  }
  return article(html + p(l.Source));
}
export function huntingHtml(l) {
  const c = l.Columns, game = c.slice(5, 8);
  let html = p(l.Intro) + h(l.Titles[0]) + table(c.slice(0, 2), [5, 2, 1, 0, -2, -5, -10].map((value, i) => [l.Grounds[i], value > 0 ? `+${value}` : value]));
  html += h(l.Titles[1]) + table([c[2], c[3]], game.map((name, i) => [name, `${[4, 6, 8][i]} ${l.Hours}`]));
  html += h(l.Titles[2]) + p(l.Time) + h(l.Titles[3]) + p(l.Group);
  html += h(l.Titles[4]) + p(l.Game) + table([c[2], c[1]], game.map((name, i) => [name, ["+2", "0", "−5"][i]]));
  html += h(l.Titles[5]) + p(l.Resolution) + table([c[4], ...game], [["<1", l.NoCatch, l.NoCatch, l.NoCatch], ...HUNTING_FOOD.map((row, i) => [`${4 * i + 1}–${4 * i + 4}`, ...row.map(value => value ?? l.NoCatch)]), ["+4", "+4", "+8", "+16"]]) + p(l.More);
  const rations = ["1–2", "3–4", "5–8", "9–12", "13–20", "21–40", "41–80", "81–160", "161–320", "321–640", "641+"];
  html += h(l.Titles[6]) + table(c.slice(8, 10), l.Prey.map((prey, i) => [rations[i], prey]));
  return article(html + h(l.Titles[7]) + p(l.Bonuses) + p(l.Source));
}
// FR pp. 305, 309: source tables checked visually, including unavailable routes.
export function travelHtml(l, language) {
  const routes = [[30, 15, 10, 12], [30, 15, 10, 8], [30, 15, null, 4],
    [60, 30, 15, 12], [60, 30, null, 6], [60, null, null, 2]];
  const number = new Intl.NumberFormat(language);
  let html = p(l.Intro) + h(l.MovementTitle) + table(l.MovementHeaders,
    routes.map((row, i) => [l.Modes[i], ...row.slice(0, 3).map(km => km == null ? "—" : `${km} km / ${row[3]} h`), l.Tests[i]]));
  const modifiers = (labels, values) => table(l.ModifierHeaders, values.map((value, i) => [labels[i], `×${number.format(value)}`]));
  html += h(l.TerrainTitle) + modifiers(l.Terrains, [0.9, 0.75, 0.5, 0.9, 0.75, 0.75, 0.5, 0.75, 0.5, 0.25, 0.75, 0.25]);
  html += h(l.WeatherTitle) + modifiers(l.Weather, [0.9, 0.8, 0.6, 0.4, 0.2, 0.9, 0.75, 0.8, 0.5]);
  html += `<aside class="trudvang-religion-example">${p(l.Example)}</aside>`;
  l.Sections.forEach((section, i) => {
    html += h(section.Title) + section.Paragraphs.map(p).join("");
    if (i === 12) html += `<h3>${escape(l.AvalancheTitle)}</h3>` + table(l.AvalancheHeaders,
      [10, 8, 6, 4, 2].map((threshold, index) => [index + 1, `1d10 (${l.OpenRoll} ${threshold === 10 ? "10" : `${threshold}–10`})`]));
  });
  return article(html + p(l.Source));
}
if (process.argv[1]?.replaceAll("\\", "/").endsWith("generate-outdoor-journals.mjs")) {
  for (const language of ["fr", "en"]) {
    const path = `lang/${language}.json`;
    const locale = JSON.parse(readFileSync(path, "utf8"));
    const journals = locale.TRUDVANG.Content.Journal;
    journals.training.Content = trainingHtml(journals.training);
    journals.hunting.Content = huntingHtml(journals.hunting);
    journals.travel.Content = travelHtml(journals.travel, language);
    writeFileSync(path, `${JSON.stringify(locale, null, 2)}\n`);
  }
  console.log("Training, hunting and travel journals regenerated (4, 5 and 4 tables per locale).");
}
