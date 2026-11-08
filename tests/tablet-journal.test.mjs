import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {TABLET_CATALOG} from "../modules/tablet-catalog.mjs";
import {JOURNAL_FOLDERS, journalDocuments} from "../modules/journal-catalog.mjs";
import {tabletListJournalHtml} from "../modules/tablet-journal-content.mjs";

const readLocale = language => JSON.parse(readFileSync(new URL(`../lang/${language}.json`, import.meta.url), "utf8"));
const localizer = locale => key => key.split(".").reduce((value, part) => value?.[part], locale) ?? key;

test("tablet-list journal lists every tablet by religion with all powers and family icons", () => {
  for (const language of ["fr", "en"]) {
    const locale = readLocale(language);
    const localize = localizer(locale);
    const html = tabletListJournalHtml({localize, language});
    assert.match(html, /^<article class="trudvang-tablet-journal">/);
    assert.equal((html.match(/class="tablet-journal-tablet"/g) || []).length, TABLET_CATALOG.length);
    assert.equal((html.match(/class="tablet-journal-religion"/g) || []).length, 5);
    assert.equal((html.match(/<li><span class="tablet-journal-level">/g) || []).length, 428);
    assert.equal((html.match(/class="fas fa-/g) || []).length, 428);
    assert.equal((html.match(/@UUID\[/g) || []).length, 62 + 428);
    for (const tablet of TABLET_CATALOG) {
      const name = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`);
      assert.ok(html.includes(name), `${language}: ${name}`);
    }
    assert.ok(html.includes(`Compendium.trudvang-chronicles.religion-${language}.Item.`));
    assert.ok(html.includes(`Compendium.trudvang-chronicles.vitner-${language}.Item.`));
    assert.match(html, /id="group-gerbanis"/);
    assert.match(html, /id="group-joaringFaith"/);
    assert.match(html, /id="group-vitner"/);
    assert.match(html, /id="group-elf"/);
    assert.match(html, /id="group-rune"/);
  }
});

test("tablet-list journal is filed under Magic in character creation", () => {
  const original = globalThis.game;
  try {
    const french = readLocale("fr");
    globalThis.game = {i18n: {lang: "fr", localize: localizer(french)}};
    assert.equal(JOURNAL_FOLDERS.magic.parent, "characterCreation");
    assert.equal(JOURNAL_FOLDERS.magic.nameKey, "TRUDVANG.Content.Folder.JournalMagic");
    const documents = journalDocuments({magic: {id: "magic-folder"}});
    const document = documents.find(entry => entry.id === "tabletList");
    assert.equal(document.name, "Liste des tablettes");
    assert.equal(document.folder, "magic-folder");
    assert.equal(document.pages.length, 1);
    assert.equal(document.pages[0].name, "Liste des tablettes");
    assert.match(document.pages[0].text.content, /^<article class="trudvang-tablet-journal">/);
    assert.match(document.pages[0].text.content, /Compendium\.trudvang-chronicles\.religion-fr\.Item\./);
  } finally {
    globalThis.game = original;
  }
});
