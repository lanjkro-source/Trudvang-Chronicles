import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import {trainingHtml, huntingHtml, travelHtml, combatActionsHtml} from "../tools/generate-outdoor-journals.mjs";
import {folderColor, folderOwnership} from "../modules/content-importer.mjs";
import {PALETTES} from "../modules/palette.mjs";
import {journalDocuments} from "../modules/journal-catalog.mjs";
const source = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
test("head regeneration is private and covers every possible 2d10 total exactly once", t => {
  const original = {game: globalThis.game, CONST: globalThis.CONST};
  t.after(() => Object.assign(globalThis, original));
  globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS: {NONE: 0}};
  globalThis.game = {settings: {get: () => "spring"}};
  const table = source.tables.find(entry => entry.formula === "2d10");
  assert.equal(table.replacement, true);
  const folder = source.folders[table.folder];
  assert.deepEqual(folderOwnership(folder), {default: 0});
  assert.equal(folderColor(folder), PALETTES.spring.warning);
  for (let die1 = 1; die1 <= 10; die1++) for (let die2 = 1; die2 <= 10; die2++) {
    assert.equal(table.results.filter(row => row.range[0] <= die1 + die2 && row.range[1] >= die1 + die2).length, 1);
  }
});
test("both journals retain every reference table and regenerate without data drift in each language", () => {
  for (const language of ["fr", "en"]) {
    const locale = JSON.parse(readFileSync(new URL(`../lang/${language}.json`, import.meta.url), "utf8"));
    const journals = locale.TRUDVANG.Content.Journal;
    assert.equal(journals.training.Content, trainingHtml(journals.training));
    assert.equal(journals.hunting.Content, huntingHtml(journals.hunting));
    assert.equal(journals.travel.Content, travelHtml(journals.travel, language));
    assert.equal(journals.combatActions.Content, combatActionsHtml(journals.combatActions));
    assert.equal(journals.combatActions.Actions.length, 19);
    assert.equal(journals.combatActions.Sections.length, 19);
    assert.equal((journals.combatActions.Content.match(/<table>/g) || []).length, 1);
    assert.ok(journals.combatActions.Sections.every(section => section.Paragraphs.length > 0));
    assert.equal((journals.travel.Content.match(/<table>/g) || []).length, 4);
    assert.match(journals.travel.Content, /60 km \/ 2 h/);
    assert.match(journals.travel.Content, /1d10 \((?:JO|OR) 2–10\)/);
    assert.equal(journals.travel.Sections.length, 17);
    assert.equal((journals.training.Content.match(/<table>/g) || []).length, 4);
    assert.equal((journals.hunting.Content.match(/<table>/g) || []).length, 5);
    assert.match(journals.training.Content, /<td>25<\/td>/);
    assert.match(journals.hunting.Content, /8d10\+80/);
    globalThis.game = {i18n: {localize: key => key.split(".").reduce((value, part) => value?.[part], locale) ?? key}};
    const documents = journalDocuments({rules: {id: "rules"}}).filter(row => ["training", "hunting", "travel", "combatActions"].includes(row.id));
    assert.equal(documents.length, 4);
    assert.ok(documents.every(row => row.folder === "rules" && row.pages[0].text.content.includes("<table>")));
  }
});
