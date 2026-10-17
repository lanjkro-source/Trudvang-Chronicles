import assert from "node:assert/strict";
import fs from "node:fs";
import {test} from "node:test";
import {JOURNAL_FOLDERS} from "../modules/journal-catalog.mjs";
import {PALETTES} from "../modules/palette.mjs";

const starter = JSON.parse(fs.readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
const locales = Object.fromEntries(["fr", "en"].map(lang =>
  [lang, JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8"))]));

const resolve = (pack, lang, keyPath) => keyPath.split(".").reduce((value, part) => value?.[part], pack?.[lang]) ?? keyPath;

test("every starter folder colour comes from the theme palette instead of a hardcoded hex", () => {
  const configured = Object.entries(starter.folders)
    .filter(([, config]) => config.colorRole)
    .concat(Object.entries(JOURNAL_FOLDERS));
  assert.ok(configured.length, "the starter folders declare colours");
  for (const [slug, config] of configured) {
    const color = PALETTES.default[config.colorRole];
    assert.match(color, /^#[\da-f]{6}$/, `${slug} resolves to a solid palette colour`);
  }
});

test("actors, roll tables and macros each get a distinct folder", () => {
  const byType = type => Object.entries(starter.folders).filter(([, config]) => config.type === type);
  assert.deepEqual(byType("Actor").map(([slug]) => slug), ["characters", "animals"]);
  assert.deepEqual(byType("Macro").map(([slug]) => slug), ["macros"]);
  assert.ok(byType("RollTable").length);

  // Groups that must read apart from one another; folders sharing a colour inside a group
  // (both roll-table folders) are intentional.
  const colourOf = slug => PALETTES.default[starter.folders[slug].colorRole];
  const groups = [colourOf("characters"), colourOf("animals"), colourOf("macros"), colourOf("tables")];
  assert.equal(new Set(groups).size, groups.length, "actors, macros and roll tables stay visually apart");
});

test("the Players folder stays editable while Animals is read-only", () => {
  assert.equal(starter.folders.characters.defaultRole, "OWNER");
  assert.equal(starter.folders.animals.defaultRole, "OBSERVER");
  assert.notEqual(PALETTES.default[starter.folders.characters.colorRole],
    PALETTES.default[starter.folders.animals.colorRole]);
});

test("character creation journals are nested under their own coloured parent", () => {
  const slugs = Object.keys(JOURNAL_FOLDERS);
  assert.equal(JOURNAL_FOLDERS.characterCreation.parent, undefined);
  for (const slug of ["races", "archetypes", "religions"]) {
    assert.equal(JOURNAL_FOLDERS[slug].parent, "characterCreation", `${slug} hangs under the creation parent`);
    assert.ok(slugs.indexOf("characterCreation") < slugs.indexOf(slug),
      `${slug} is declared after the parent so upsertJournals() can hand it over`);
    assert.equal(JOURNAL_FOLDERS[slug].colorRole, JOURNAL_FOLDERS.characterCreation.colorRole);
  }
  for (const slug of ["equipment", "rules"]) {
    assert.equal(JOURNAL_FOLDERS[slug].parent, undefined, `${slug} stays at the root`);
    assert.equal(JOURNAL_FOLDERS[slug].colorRole, JOURNAL_FOLDERS.equipment.colorRole);
  }
  assert.notEqual(JOURNAL_FOLDERS.characterCreation.colorRole, JOURNAL_FOLDERS.equipment.colorRole);
});

test("every folder name is localized in both shipped languages", () => {
  const keys = [
    ...Object.values(starter.folders).map(config => config.nameKey),
    ...Object.values(JOURNAL_FOLDERS).map(config => config.nameKey)
  ];
  for (const lang of ["fr", "en"]) {
    for (const key of keys) {
      const value = resolve(locales, lang, key);
      assert.notEqual(value, key, `${lang} is missing ${key}`);
      assert.ok(value.length, `${lang} has an empty value for ${key}`);
    }
  }
  assert.equal(resolve(locales, "fr", "TRUDVANG.Content.Folder.Characters"), "Joueurs");
  assert.equal(resolve(locales, "fr", "TRUDVANG.Content.Folder.Animals"), "Animaux");
  assert.equal(resolve(locales, "fr", "TRUDVANG.Content.Folder.CharacterCreation"), "Création de Personnages");
  assert.notEqual(resolve(locales, "en", "TRUDVANG.Content.Folder.Characters"),
    resolve(locales, "fr", "TRUDVANG.Content.Folder.Characters"));
});