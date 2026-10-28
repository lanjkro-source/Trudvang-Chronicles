import assert from "node:assert/strict";
import fs from "node:fs";
import {test} from "node:test";
import {folderColor, folderOwnership} from "../modules/content-importer.mjs";
import {JOURNAL_FOLDERS} from "../modules/journal-catalog.mjs";
import {PALETTES} from "../modules/palette.mjs";

const starter = JSON.parse(fs.readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
const locales = Object.fromEntries(["fr", "en"].map(lang =>
  [lang, JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8"))]));

const resolve = (pack, lang, keyPath) => keyPath.split(".").reduce((value, part) => value?.[part], pack?.[lang]) ?? keyPath;

// Regression: the first release resolved folder roles through CONST.ENTITY_PERMISSIONS, which
// does not exist in Foundry V14, so every starter import failed on a brand-new world.
test("folder roles resolve against the V14 ownership enumeration", t => {
  const previous = globalThis.CONST;
  t.after(() => { globalThis.CONST = previous; });
  globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS: {INHERIT: -1, NONE: 0, LIMITED: 1, OBSERVER: 2, OWNER: 3}};

  assert.deepEqual(folderOwnership({defaultRole: "OWNER"}), {default: 3});
  assert.deepEqual(folderOwnership({defaultRole: "OBSERVER"}), {default: 2});
  assert.deepEqual(folderOwnership({defaultRole: "observer"}), {default: 2});
  assert.deepEqual(folderOwnership({}), undefined, "folders without a role keep Foundry's default");
  assert.throws(() => folderOwnership({defaultRole: "INHERIT"}), /Unknown default role/, "INHERIT is not a folder default");
  assert.throws(() => folderOwnership({defaultRole: "TYPO"}), /Unknown default role/);

  for (const [slug, config] of Object.entries(starter.folders)) {
    if (!config.defaultRole) continue;
    assert.ok(folderOwnership(config), `${slug} resolves to a real level`);
  }
});

// Regression: the animal filter first read `system.details.creatureTypeKey`, a key that only
// exists in the catalogue module. The shipped packs store the localised family label instead,
// so the filter matched nothing and the folder stayed empty with no error at all.
test("the bestiary catalogue exposes a stable animal family for the world copies", async t => {
  const {BESTIARY_ENTRIES} = await import("../modules/bestiary-catalog-data.mjs");
  const animals = BESTIARY_ENTRIES.filter(entry => entry.family === "animal");
  assert.ok(animals.length >= 21, "the catalogue still lists the bestiary animals");
  assert.ok(animals.every(entry => typeof entry.id === "string" && entry.id.length), "every animal carries an id");
  const families = new Set(BESTIARY_ENTRIES.map(entry => entry.family));
  assert.ok(families.has("animal"), "the animal family exists in the catalogue");
});

// Regression: v0.92.3 filtered pack.getDocuments by the document class (`{type: "Actor"}`
// never matches an actor subtype, so the pack reported 0 actors) and read `scene.levels[0]`
// on an embedded collection, which always returns undefined — the Animals folder stayed
// empty and every scene reported a missing background.
test("animal copies resolve through documented V14 APIs", () => {
  const source = fs.readFileSync(new URL("../modules/content-importer.mjs", import.meta.url), "utf8");
  assert.ok(!source.includes("getDocuments({type:"), "pack documents are never filtered by document class");
  assert.ok(!/levels\[0\]\?\.background/.test(source), "scene backgrounds are read through sceneBackgroundSrc");
  assert.ok(!/levels\.get\(/.test(source), "embedded collections are never queried by numeric id");
  assert.ok(!source.includes("folder.ownership"), "folder ownership is read back through getUserLevel");
});

// Regression: a mismatched splice once created the world map from the welcome template, so
// an import could leave a second Accueil clone carrying the world map's localised name. Each
// create block must pair its own starter id with its own background.
test("starter scenes are created from distinct data blocks", () => {
  const source = fs.readFileSync(new URL("../modules/content-importer.mjs", import.meta.url), "utf8");
  assert.ok(/src: DEFAULT_SCENE_BACKGROUND[\s\S]{0,200}starterId: "world-map"/.test(source),
    "the world map create data pairs the map background with the map starter id");
  assert.ok(/src: WELCOME_SCENE_BACKGROUND[\s\S]{0,200}starterId: "welcome"/.test(source),
    "the welcome create data pairs the welcome background with the welcome starter id");
});

test("every starter folder colour comes from the theme palette instead of a hardcoded hex", () => {
  const configured = Object.entries(starter.folders)
    .filter(([, config]) => config.colorRole)
    .concat(Object.entries(JOURNAL_FOLDERS));
  assert.ok(configured.length, "the starter folders declare colours");
  for (const [slug, config] of configured) {
    assert.ok(folderColor(config), `${slug} resolves to a colour`);
    assert.match(PALETTES.default[config.colorRole], /^#[\da-f]{6}$/, `${slug} is a solid palette colour`);
  }
});

// Regression: v0.105.1 nests the materiaux under the magic objects, moves the centennial
// amber out of the extracts folder and makes the two GM-visible only; the import must also
// propagate the folder's default role onto the starter items inside, otherwise the items
// stay visible in the players' item directory even when the sidebar folder is not.
test("the materiaux and the centennial amber live in the GM-only magic objects folder", t => {
  t.after(() => { delete globalThis.CONST; });
  globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS: {NONE: 0, LIMITED: 1, OBSERVER: 2, OWNER: 3}};
  const order = Object.keys(starter.folders);
  assert.ok(order.indexOf("magicObjects") < order.indexOf("materials"),
    "materials is declared after its parent so upsertFolder() can hand it over");
  assert.equal(starter.folders.magicObjects.defaultRole, "NONE",
    "players get no default access to the magic objects folder");
  assert.equal(folderOwnership(starter.folders.magicObjects).default, 0, "NONE resolves to level 0");
  assert.equal(starter.folders.materials.parent, "magicObjects",
    "the materiaux hang under the magic objects folder, not equipment");
  const amber = starter.items.find(item => item.nameKey === "TRUDVANG.Content.Item.CentennialVidrjotunAmber.Name");
  assert.equal(amber.folder, "magicObjects", "the centennial amber left the extracts folder");
  // Regression: v0.105.2 — three of the twelve icons referenced core paths that no other
  // shipped data ever used; the client silently rendered broken images for them. Only paths
  // proven elsewhere in the modules (or confirmed core defaults) may be picked for the
  // creature-harvest items.
  assert.equal(amber.img, "icons/equipment/neck/pendant-rough-orange.webp");
  const sap = starter.items.find(item => item.nameKey === "TRUDVANG.Content.Item.FreshVidrjotunSap.Name");
  assert.equal(sap.img, "icons/consumables/potions/bottle-bulb-corked-green.webp");
  const gold = starter.items.find(item => item.nameKey === "TRUDVANG.Content.Item.FirdtursirGold.Name");
  assert.equal(gold.img, "icons/svg/coins.svg");
  const sourceCode = fs.readFileSync(new URL("../modules/content-importer.mjs", import.meta.url), "utf8");
  assert.match(sourceCode, /folderOwnership\(source\.folders\[destination\]\)/,
    "starter items derive their ownership from the destination folder config");
  assert.match(sourceCode, /if \(payload\.ownership\) update\.ownership = destination === "gmItems"[\s\S]*?ForcedReplacement\.create\(payload\.ownership\) : payload\.ownership;/,
    "replays move existing starter items onto their folder's default level");
});

test("actors, roll tables and macros each get a distinct folder", () => {
  const byType = type => Object.entries(starter.folders).filter(([, config]) => config.type === type);
  assert.deepEqual(byType("Actor").map(([slug]) => slug), ["characters", "animals"]);
  assert.deepEqual(byType("Macro").map(([slug]) => slug), ["gm-macros", "macros"]);
  assert.equal(starter.folders["gm-macros"].defaultRole, "NONE");
  assert.equal(starter.folders.macros.defaultRole, "OWNER");
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

test("the five magical consumables have their own nested folder and migrate existing inventory copies", async t => {
  const {syncStarterConsumables}=await import("../modules/content-importer.mjs");
  assert.equal(starter.folders.magicConsumables.parent,"magicObjects");
  const entries=starter.items.filter(entry=>entry.folder==="magicConsumables");assert.equal(entries.length,5);
  assert.ok(entries.every(entry=>entry.type==="gear" && entry.system.consumable===true));
  const previous=globalThis.game;t.after(()=>{globalThis.game=previous;});
  const sourceEntry=entries[0],id=sourceEntry.nameKey.replace(/\.Name$/,""),updates=[];
  const gear=(id,name,flag)=>({id,name,type:"gear",system:{quantity:3},getFlag:(scope,key)=>scope==="trudvang-chronicles"?flag:undefined});
  const known=gear("known","Renommé",id),named=gear("named","Old translated name"),custom=gear("custom","Personal gear");
  const actor={items:[known,custom],updateEmbeddedDocuments:async(type,rows)=>{updates.push(rows);for(const row of rows)actor.items.find(item=>item.id===row._id).system.consumable=true;}};
  const tokenActor={items:[named],updateEmbeddedDocuments:async(type,rows)=>{updates.push(rows);named.system.consumable=true;}};
  globalThis.game={items:[],actors:[actor],scenes:[{tokens:[{actor},{actor:tokenActor}]}]};
  const translations=new Map([[sourceEntry.nameKey,new Set(["Old translated name"])]]);
  await syncStarterConsumables(starter,translations);
  assert.deepEqual(updates,[[{_id:"known","system.consumable":true}],[{_id:"named","system.consumable":true}]]);
  assert.equal(known.system.quantity,3);assert.equal(custom.system.consumable,undefined);
  updates.length=0;await syncStarterConsumables(starter,translations);assert.equal(updates.length,0);
});
