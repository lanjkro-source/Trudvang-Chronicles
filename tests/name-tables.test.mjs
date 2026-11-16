import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const lang = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const SYSTEM = "trudvang-chronicles";

Handlebars.registerHelper("localize", (key, options) => {
  const data = options.hash ?? {};
  return String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
});
const cardTemplate = Handlebars.compile(readFileSync(new URL("../templates/chat/name-roll-card.hbs", import.meta.url), "utf8"));

globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) => cardTemplate(data)}}};
globalThis.CONST = {CHAT_MESSAGE_STYLES: {OTHER: 4}};

const starter = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
const {nameTableMeta, resolveNameAffix, assembleName, rollNameTable} = await import("../modules/name-tables.mjs");

const nameTables = starter.tables.filter(table => table.flags?.[SYSTEM]?.nameTable);
const byKey = key => nameTables.find(table => table.nameKey.includes(key));

function runtime(t, {answers = {}, rolls = []} = {}) {
  const previous = {game: globalThis.game, ChatMessage: globalThis.ChatMessage, DialogV2: globalThis.DialogV2,
    Roll: globalThis.Roll, document: globalThis.document};
  t.after(() => Object.assign(globalThis, previous));
  // escapeHtml serializes through a DOM text node.
  globalThis.document = {createElement: () => ({set textContent(value) {this.innerHTML = String(value ?? "");}, innerHTML: ""})};
  const messages = [];
  let rollIndex = 0;
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; }
    async evaluate() {
      const total = rolls[rollIndex++] ?? 1;
      return {...this, total, rolls: [total]};
    }
  };
  globalThis.DialogV2 = class {
    static wait(options) {return answers.gender === undefined ? false : answers.gender;}
  };
  globalThis.ChatMessage = {
    getSpeaker: () => ({alias: "Test"}),
    create: async data => {messages.push(data); return data;}
  };
  globalThis.game = {user: {name: "Test", avatar: "avatar.png"}, i18n: {
    localize: key => get(lang, key) ?? key,
    format: (key, data) => String(get(lang, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
  }};
  return messages;
}

test("the seven name tables are grouped under Character Creation / Names", () => {
  assert.equal(nameTables.length, 7, "one table per culture or race");
  assert.equal(starter.folders.nameTables.parent,"characterCreationTables");
  assert.equal(starter.folders.nameTables.type,"RollTable");
  for (const table of nameTables) {
    assert.equal(table.folder, "nameTables", `${table.nameKey} lives in the names subfolder`);
    assert.ok(table.results.length >= 20, `${table.nameKey} has affixes`);
    assert.ok(table.nameKey.endsWith(".Name"));
    assert.ok(table.descriptionKey.endsWith(".Description"));
  }
  // Every culture the player asked for is covered.
  for (const key of ["StormlanderNames", "MittlanderNames", "VirannNames", "DwarfNames", "TrollNames", "WildfolkNames", "ElfNames"]) {
    assert.ok(byKey(key), `${key} is installed`);
  }
  // Prefix, suffix and affix metadata is present on every result.
  for (const table of nameTables) {
    for (const result of table.results) {
      assert.ok(result.flags[SYSTEM]?.namePart, `${table.nameKey} result ${result.text} has a part`);
    }
  }
});

test("a gendered table draws a prefix and a suffix of the requested sex", async t => {
  const messages = runtime(t, {answers: {gender: "female"}, rolls: [3, 2]});
  const table = byKey("StormlanderNames");
  const result = await rollNameTable(table, {displayChat: true});
  // Stormlander prefixes: 1 As-, 2 Bod-, 3 Bryn- ; female suffixes: 1 -a, 2 -dis, ...
  assert.equal(result.message, messages[0]);
  const html = messages[0].content;
  assert.match(html, /Bryndis/, "the prefix and the suffix are assembled");
  assert.match(html, /Noms Stormlanders/, "the card names the culture");
  assert.match(html, /Femme/, "the card names the chosen sex");
  // The male suffixes were never drawn from.
  assert.ok(!/Bryndott/.test(html), "a female name does not use the male suffix list");
});

test("a male name uses the male suffix list", async t => {
  const messages = runtime(t, {answers: {gender: "male"}, rolls: [8, 9]});
  await rollNameTable(byKey("StormlanderNames"), {displayChat: true});
  assert.match(messages[0].content, /Torvald/, "the eighth prefix and the ninth male suffix are assembled");
  assert.match(messages[0].content, /Homme/, "the card names the chosen sex");
});

test("dwarves have no gendered suffixes and need no sex choice", async t => {
  const messages = runtime(t, {answers: {}, rolls: [6, 6]});
  const table = byKey("DwarfNames");
  assert.equal(nameTableMeta(table).gendered, false);
  await rollNameTable(table, {displayChat: true});
  // Dwarf prefixes: 1 Bor-, 2 Brok-, 3 Dvor-, 4 Fifun-, 5 Glo-, 6 Jo(r)- ; suffixes: 6 -linkk
  assert.match(messages[0].content, /Jo.*linkk/, "the prefix and suffix are assembled");
  assert.doesNotMatch(messages[0].content, /Homme|Femme/, "no sex is shown for dwarves");
});

test("trolls draw two affixes from the same list", async t => {
  const messages = runtime(t, {answers: {}, rolls: [3, 8]});
  const table = byKey("TrollNames");
  const meta = nameTableMeta(table);
  assert.equal(meta.gendered, false);
  assert.equal(meta.affixes, true);
  assert.equal(meta.results.length, 36, "the two columns of the book are one affix pool");
  await rollNameTable(table, {displayChat: true});
  // Affixes in order: 1 a, 2 mo, 3 claw, 4 mud, 5 dy, 6 must, 7 e, 8 nose
  assert.match(messages[0].content, /Clawnose/, "the two affixes are assembled");
});

test("cancelling the sex choice draws nothing", async t => {
  const messages = runtime(t, {answers: {}});
  const result = await rollNameTable(byKey("StormlanderNames"), {displayChat: true});
  assert.equal(messages.length, 0, "no chat message is posted");
  assert.equal(result.roll.total, NaN);
});

test("the parenthetical variants of the book are resolved", () => {
  // A single letter in brackets is kept or dropped; alternatives pick one branch.
  for (const [source, allowed] of [
    ["-(d)olga", ["-dolga", "-olga"]],
    ["-(k)ka", ["-kka", "-ka"]],
    ["-(an)non", ["-annon", "-non"]],
    ["-n(hj)a", ["-nhja", "-na"]],
    ["-win(n)", ["-winn", "-win"]],
    ["-(wig/-vik)", ["-wig", "-vik"]],
    ["-iul(l)u", ["-iullu", "-iulu"]]
  ]) {
    for (let attempt = 0; attempt < 40; attempt++) {
      const resolved = resolveNameAffix(source);
      assert.ok(allowed.includes(resolved), `${source} resolved to ${resolved}`);
    }
  }
  // Optional letters in a prefix resolve the same way.
  assert.ok(["Guld-", "Gul-"].includes(resolveNameAffix("Gul(d)-")));
  assert.ok(["Ada-", "Ade-"].includes(resolveNameAffix("Ad(a ou e)-")));
});

test("the assembly joins a prefix and a suffix on their hyphen", () => {
  assert.equal(assembleName("As-", "-biorn"), "Asbiorn");
  assert.equal(assembleName("Hall-", "-gerd"), "Hallgerd");
  assert.equal(assembleName("claw", "e"), "Clawe");
  assert.equal(assembleName("grinn", "stink"), "Grinnstink");
  assert.equal(assembleName("Bryn", "-dott"), "Bryndott");
});
