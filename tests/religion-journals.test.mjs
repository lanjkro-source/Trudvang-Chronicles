import assert from "node:assert/strict";
import fs from "node:fs";
import {test} from "node:test";
import {JOURNAL_FOLDERS, journalDocuments} from "../modules/journal-catalog.mjs";

const ids = ["gerbanis", "ealdTradition", "tenetNid", "haminges", "thuuldom", "toikalokke"];
const tableCounts = [2, 1, 2, 2, 2, 2];
const exampleCounts = [1, 1, 2, 1, 1, 0];

test("all six religions have localized structured journal content", () => {
  for (const lang of ["fr", "en"]) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8"));
    const journals = locale.TRUDVANG.Content.Journal;
    assert.equal(locale.TRUDVANG.Content.Folder.Religions, "Religions");
    for (const [index, id] of ids.entries()) {
      const content = journals[id]?.Content || "";
      assert.ok(journals[id]?.Name, `${lang}/${id} has a name`);
      assert.match(content, /^<article class="trudvang-religion-journal">/);
      assert.equal((content.match(/<table>/g) || []).length, tableCounts[index], `${lang}/${id} tables`);
      assert.equal((content.match(/<aside class="trudvang-religion-example">/g) || []).length, exampleCounts[index], `${lang}/${id} examples`);
      assert.ok((content.match(/<h2>/g) || []).length >= 3, `${lang}/${id} subheadings`);
      assert.match(content, /<p>[^<]+<\/p>/, `${lang}/${id} paragraphs`);
      assert.doesNotMatch(content, /@@\d+@@|<script/i);
    }
  }
});

test("French-reference tables keep their rows and values in both locales", () => {
  for (const lang of ["fr", "en"]) {
    const journal = JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8")).TRUDVANG.Content.Journal;
    assert.equal((journal.gerbanis.Content.match(/<tr>/g) || []).length, 27); // 14 gifts + 11 consequences + 2 headers
    assert.equal((journal.ealdTradition.Content.match(/<tr>/g) || []).length, 16); // 15 oaths + header
    assert.match(journal.ealdTradition.Content, /(?:morts-vivants|undead)<\/td><td>12<\/td>/);
    assert.match(journal.toikalokke.Content, /(?:8 heures|8 hours)<\/td><td>6<\/td>/);
  }
});

test("starter Journal documents are filed together under Religions", () => {
  const french = JSON.parse(fs.readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
  globalThis.game = {i18n: {localize: key => key.split(".").reduce((value, part) => value?.[part], french) ?? key}};
  const folderId = "religions-folder";
  const documents = journalDocuments({religions: {id: folderId}}).filter(document => ids.includes(document.id));
  assert.equal(JOURNAL_FOLDERS.religions.nameKey, "TRUDVANG.Content.Folder.Religions");
  assert.deepEqual(documents.map(document => document.id), ids);
  assert.ok(documents.every(document => document.folder === folderId));
  assert.ok(documents.every(document => document.pages.length === 1 && document.pages[0].text.content.includes("trudvang-religion-journal")));
});
