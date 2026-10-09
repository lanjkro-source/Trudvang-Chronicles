import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {holyTabletCapacity} from "../modules/rules/tablet-learning.mjs";
import {TABLET_CATALOG} from "../modules/tablet-catalog.mjs";
import {TRUDVANG} from "../modules/config.mjs";

const fr = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const lookup = key => key.split(".").reduce((value, part) => value?.[part], fr);
const warnings = [];
const embeddedItem = (data, index = 0) => ({id: `item-${index}`, ...data,
  getFlag: (scope, key) => data.flags?.[scope]?.[key]});
class MockActor {
  getFlag() { return null; }
  async createEmbeddedDocuments(embeddedName, data, operation) {
    this.lastCreate = {embeddedName, data, operation};
    const items = data.map((entry, index) => embeddedItem(entry, this.items.length + index));
    if (embeddedName === "Item") this.items.push(...items);
    return items;
  }
}
globalThis.foundry = {
  documents: {Actor: MockActor, ActiveEffect: class {}},
  data: {fields: {}, ActiveEffectTypeDataModel: class {}},
  applications: {api: {HandlebarsApplicationMixin: Base => Base}, sheets: {ActorSheetV2: class {}},
    ux: {TextEditor: {implementation: {}}}},
  utils: {deepClone: structuredClone}
};
globalThis.game = {i18n: {lang: "fr", has: key => Boolean(lookup(key)), localize: key => lookup(key) ?? key,
  format: (key, data) => String(lookup(key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")}};
globalThis.ui = {notifications: {warn: text => {warnings.push(text); return false; }}};
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActorSheet} = await import("../modules/sheets/actor-sheet.mjs");

const holy = (catalogId, level = 1) => embeddedItem({type: "tablet", system: {tabletType: "holy", catalogId, level}});
function actor({faith = 4, religion = "gerbanis", items = []} = {}) {
  const instance = new TrudvangActor();
  Object.assign(instance, {type: "character", items, system: {skills: {faith: {value: faith}, vitnerCraft: {value: 10}},
    details: {race: religion === "thuuldom" ? "borjornikka" : "human", religion}, experience: {creationMode: true}},
    findRuleKnowledge: id => [TRUDVANG.religions[religion].specialty, "vitnerShaping", "hwitalja"].includes(id)
      ? {system: {level: 1}} : null});
  return instance;
}

test("the limit counts distinct Holy Tablets, including runes, independently of their levels or powers", () => {
  const items = [holy("first", 5), holy("second", 2), holy("second", 5),
    {type: "divineFeat", system: {isRune: true, tabletId: "first"}},
    {type: "tablet", system: {tabletType: "vitner", catalogId: "vitner"}},
    {type: "tablet", flags: {"trudvang-chronicles": {catalogId: "first"}}, system: {tabletType: "holy"}},
    {id: "custom", type: "tablet", system: {tabletType: "holy"}}];
  assert.deepEqual(holyTabletCapacity({items, faith: 4}), {current: 3, max: 4, full: false, exceeded: false});
});

test("temporary Faith bonuses cannot grant additional permanently learned tablets", () => {
  const instance = actor({items: [holy("one"), holy("two"), holy("three"), holy("four")]});
  instance.system.skills.faith.bonus = 3;
  instance.system.effective = {skills: {faith: 7}};
  assert.equal(instance.getSkillValue("faith"), 7);
  assert.deepEqual(instance.holyTabletCapacity, {current: 4, max: 4, full: true, exceeded: false});
  instance._source = {system: structuredClone(instance.system)};
  instance.system.skills.faith.value = 7;
  assert.equal(instance.holyTabletCapacity.max, 4, "direct effects on the prepared skill do not change the learned rank");
});

test("a new Holy Tablet is learnable up to the Faith limit, then filtered from the picker and rejected", async () => {
  const instance = actor({items: [holy("one"), holy("two"), holy("three")]});
  const tablet = TABLET_CATALOG.find(entry => entry.religion === "gerbanis");
  assert.equal(instance.getTabletCompatibility(tablet).ok, true);
  assert.ok(instance.compatibleTablets.includes(tablet));
  const documents = await instance.addTabletFromCatalog(tablet.id);
  assert.equal(documents.filter(item => item.type === "tablet").length, 1);
  assert.equal(instance.holyTabletCapacity.current, 4);
  const next = TABLET_CATALOG.find(entry => entry.religion === "gerbanis" && entry.id !== tablet.id);
  assert.equal(instance.getTabletCompatibility(next).reason, "TRUDVANG.Warning.HolyTabletLimit");
  assert.ok(instance.compatibleTablets.every(entry => entry.tabletType === "vitner"));
  const before = instance.items.length;
  await instance.addTabletFromCatalog(next.id);
  assert.equal(instance.items.length, before, "no tablet or orphaned powers are created");
  assert.match(warnings.at(-1), /4 apprises.*maximum de 4/);
  instance.system.skills.faith.value = 5;
  assert.equal(instance.getTabletCompatibility(next).ok, true, "raising Faith unlocks another tablet");
});

test("Thuuldom rune tablets share the same learned Faith limit", () => {
  const instance = actor({religion: "thuuldom", items: [holy("one"), holy("two"), holy("three"), holy("four")]});
  const rune = TABLET_CATALOG.find(entry => entry.religion === "thuuldom");
  assert.equal(instance.getTabletCompatibility(rune).reason, "TRUDVANG.Warning.HolyTabletLimit");
});

test("Vitner tablets remain learnable when the sacred limit is full", async () => {
  const instance = actor({items: [holy("one"), holy("two"), holy("three"), holy("four")]});
  const tablet = TABLET_CATALOG.find(entry => entry.tabletType === "vitner");
  assert.equal(instance.getTabletCompatibility(tablet).ok, true);
  await instance.addTabletFromCatalog(tablet.id);
  assert.equal(instance.holyTabletCapacity.current, 4);
});

test("single and batch drops cannot bypass the limit or leave half-imported items", async () => {
  const instance = actor({items: [holy("one"), holy("two"), holy("three"), holy("four")]});
  const sheet = new TrudvangActorSheet(); sheet.actor = instance;
  const tablet = TABLET_CATALOG.find(entry => entry.religion === "gerbanis");
  await sheet._handleDrop({type: "tablet", system: {catalogId: tablet.id}});
  assert.equal(instance.items.length, 4);
  const batch = [{type: "tablet", system: {tabletType: "holy", catalogId: "five"}},
    {type: "tablet", system: {tabletType: "holy", catalogId: "six"}},
    {type: "divineFeat", system: {tabletId: "five"}}];
  assert.deepEqual(await sheet._handleDrop(batch), []);
  assert.equal(instance.items.length, 4);
  instance.items.pop();
  assert.deepEqual(await instance.createEmbeddedDocuments("Item", batch), []);
  assert.equal(instance.items.length, 3, "a batch needs room for all new tablets");
  assert.match(warnings.at(-1), /2 nouvelle.*3 déjà apprises.*maximum de 4/);
  const created = await instance.createEmbeddedDocuments("Item", batch.slice(0, 1));
  assert.equal(created.length, 1);
});

test("existing over-limit knowledge is preserved while further learning and lowering Faith are blocked", async () => {
  const items = [holy("one"), holy("two"), holy("three"), holy("four"), holy("five")];
  const instance = actor({items});
  assert.equal(instance.holyTabletCapacity.exceeded, true);
  assert.deepEqual(await instance.createEmbeddedDocuments("Item", [holy("six")]), []);
  assert.equal(instance.items.length, 5);
  assert.equal((await instance.createEmbeddedDocuments("Item", [{type: "gear", system: {}}])).length, 1);
  assert.equal(instance.canLowerSkill("faith", 4), false);
  assert.equal(instance.canLowerSkill("faith", 5), true);
  assert.equal(instance.canLowerSkill("vitnerCraft", 4), true);
  await instance.toggleCreationMode();
  assert.match(warnings.at(-1), /5 apprises.*maximum de 4/);
  instance.items.splice(0, 2);
  assert.equal(instance.holyTabletCapacity.full, false, "removing learned tablets releases their places");
});

test("increasing a learned tablet level remains possible when every place is occupied", async () => {
  const instance = actor({faith: 7, items: Array.from({length: 7}, (_, index) => holy(`holy-${index}`))});
  const tablet = instance.items[0];
  tablet.update = async changes => {tablet.system.level = changes["system.level"];};
  await instance.adjustItemLevel(tablet, 1);
  assert.equal(tablet.system.level, 2);
  assert.equal(instance.holyTabletCapacity.current, 7);
});

test("NPC book Faith supplies its learning maximum without temporary bonuses", () => {
  const instance = actor(); instance.type = "npc";
  instance.system.skillTree = [{kind: "skill", skillId: "faith", name: "Foi", value: 8}];
  instance.system.skills.faith.value = 1;
  assert.equal(instance.holyTabletCapacity.max, 8);
});

Handlebars.registerHelper("localize", (key, options) => game.i18n.format(key, options.hash));
test("character affinities display the learned count, maximum, and explanatory tooltip", () => {
  const source = readFileSync(new URL("../templates/actor/character-sheet.hbs", import.meta.url), "utf8");
  const section = source.match(/<section class="panel"><h2>\{\{localize "TRUDVANG.Section.Affinities"\}\}[\s\S]*?<\/section>/)[0];
  const html = Handlebars.compile(section)({holyTabletCapacity: {current: 3, max: 4}});
  assert.match(html, /Tablettes sacrées \/ runes apprises/);
  assert.match(html, /3 \/ 4/);
  assert.match(html, /Maximum égal au niveau de Foi appris/);
});

test("NPC tabs use the character's Vitner & Faith label and the same icons", () => {
  const source = readFileSync(new URL("../templates/actor/npc-sheet.hbs", import.meta.url), "utf8");
  const nav = source.match(/<nav class="sheet-tabs tabs"[\s\S]*?<\/nav>/)[0];
  const html = Handlebars.compile(nav)({});
  assert.match(html, /Vitner &amp; Foi/);
  const tabs = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g);
  assert.equal(tabs.length, 6);
  for (const tab of tabs) assert.match(tab, /<i class="fas fa-/);
});
