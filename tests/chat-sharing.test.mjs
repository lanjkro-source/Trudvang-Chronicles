import test from "node:test";
import assert from "node:assert/strict";
import {TRUDVANG} from "../modules/config.mjs";

const cards = [], messages = [];
globalThis.foundry = {applications: {handlebars: {renderTemplate: async (path, data) => {cards.push({path, data}); return "card";}},
  ux: {TextEditor: {implementation: {enrichHTML: async text => text}}}}, utils: {fromUuid: async uuid => documents.get(uuid)}};
globalThis.game = {i18n: {lang: "fr", localize: key => key, format: (_key, data) => String(data.value)}};
globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => messages.push(data)};
const documents = new Map();
const {bindTitleSharing, bindSheetListMenus, sheetEntry} = await import("../modules/chat-sharing.mjs");

test("the image beside the item name becomes the share control, leaving the window-frame icon alone", async () => {
  const make = () => ({listeners: {}, children: [], attrs: {}, className: "", disabled: false,
    setAttribute(key, value) {this.attrs[key] = value;},
    addEventListener(key, listener) {this.listeners[key] = listener;},
    append(...children) {this.children.push(...children); for (const child of children) child.parentElement = this;},
    get classList() {return {contains: value => this.className.split(" ").includes(value)};}});
  let replacement, shares = 0;
  const icon = make(); icon.ownerDocument = {createElement: make}; icon.replaceWith = node => {replacement = node;};
  const frameIcon = {replaceWith: () => assert.fail("frame icon must not be changed")};
  const sheet = {element: {querySelector: selector => {
    assert.match(selector, /\.sheet-header \.profile-img/);
    return icon;
  }}, window: {icon: frameIcon}, document: {documentName: "Item", toChat: async () => {shares++;}}};
  bindTitleSharing(sheet); bindTitleSharing(sheet);
  assert.equal(replacement.children[0], icon, "preserves the image's original size and appearance");
  assert.equal(replacement.children[1].className, "fas fa-comment-dots trudvang-share-bubble");
  assert.equal(replacement.title, "TRUDVANG.Action.ShareInChat");
  const event = {preventDefault() {}, stopPropagation() {}};
  await replacement.listeners.click(event);
  assert.equal(shares, 1);
  assert.equal(replacement.disabled, false);
});

test("PC and NPC portraits and frame icons retain their original click handlers", () => {
  for (const type of ["character", "npc"]) {
    const sheet = {document: {documentName: "Actor", type}, element: {
      querySelector: () => assert.fail("actor images must not even be selected for sharing")
    }};
    bindTitleSharing(sheet);
  }
});

function row(dataset = {}, nested = {}) {
  return {dataset, classList: {add() {}}, closest() {return this;},
    matches: selector => selector === ".npc-book-skill" && Boolean(nested.book),
    querySelector: selector => nested[selector] ?? null};
}

test("sheet menus resolve and open/share embedded items and effects from an event or row", async () => {
  for (const type of ["spell", "divineFeat", "tablet", "creatureAbility", "effect"]) {
    let opened = 0, shared = 0, constructions = 0, menu;
    const document = {type, documentName: type === "effect" ? "ActiveEffect" : "Item",
      sheet: {render: () => {opened++;}}, toChat: async () => {shared++;}};
    documents.set("effect-uuid", document);
    const target = row(type === "effect" ? {effectUuid: "effect-uuid"} : {itemId: "item"});
    const root = {querySelectorAll: () => [target]};
    const sheet = {element: root, actor: {items: new Map([["item", document]])},
      _createContextMenu(handler, selector, options) {
        constructions++; menu = handler();
        assert.equal(selector, ".trudvang-share-row"); assert.equal(options.container, this.element);
        for (const entry of menu) {
          assert.ok(typeof entry.label === "string" && entry.label, "sheet menu entries carry the V14 label");
          assert.ok(!("name" in entry), "the deprecated name field never appears in a sheet menu");
        }
      }};
    bindSheetListMenus(sheet); bindSheetListMenus(sheet);
    assert.equal(constructions, 1);
    await menu[0].onClick({target}); await menu[1].onClick({}, target);
    assert.equal(opened, 1); assert.equal(shared, 1);
    sheet.element = {querySelectorAll: () => [target]}; bindSheetListMenus(sheet);
    assert.equal(constructions, 2, "new frames get their own delegated menu");
  }
});

test("base skills, book rows and unlearned knowledge can be shared without creating embedded items", async () => {
  const skillKey = Object.keys(TRUDVANG.skills)[0];
  const actor = {id: "actor", uuid: "Actor.actor", items: new Map()};
  actor.items.find = predicate => [...actor.items.values()].find(predicate);
  let menu, detail;
  const skillRow = row({}, {["[data-skill]"]: {dataset: {skill: skillKey}}});
  const sheet = {actor, element: {querySelectorAll: () => [skillRow]},
    _createContextMenu: handler => {menu = handler(); for (const entry of menu) {
      assert.ok(typeof entry.label === "string" && entry.label, "sheet menu entries carry the V14 label");
      assert.ok(!("name" in entry), "the deprecated name field never appears in a sheet menu");
    }}, _showDetail: (...args) => {detail = args;}};
  bindSheetListMenus(sheet);
  await menu[0].onClick({}, skillRow); await menu[1].onClick({}, skillRow);
  assert.equal(detail[0], TRUDVANG.skills[skillKey]);
  assert.match(cards.at(-1).path, /skill-card/);
  assert.equal(cards.at(-1).data.skillKey, skillKey);
  assert.equal(messages.at(-1).speaker.actor, "actor");
  sheet._npcBookSkillRows = () => [{kind: "skill", skillKey, name: "Book skill"}];
  assert.equal((await sheetEntry(sheet, row({index: "0"}, {book: true}))).name, "Book skill");
  const knowledge = {documentName: "Item"};
  game.packs = new Map([["trudvang-chronicles.skills-fr", {getDocument: async () => knowledge}]]);
  assert.equal((await sheetEntry(sheet, row({catalogId: "unlearned"}))).document, knowledge);
});

test("specialty menus allow duplication but deletion only for owned added zero-rank copies", async t => {
  const previous = game.user; t.after(() => {game.user = previous;});
  game.user = {id: "owner"};
  const copy = {id: "copy", type: "ability", system: {kind: "specialty", catalogId: "custom-specialty-test", level: 0, offHandLevel: 0}, flags: {"trudvang-chronicles": {customSpecialty: {added: true}}}};
  const base = {id: "base", type: "ability", system: {kind: "specialty", catalogId: "foreignTongue", level: 0}};
  let menu, duplicated, deleted;
  const actor = {type: "character", items: new Map([[copy.id, copy], [base.id, base]]), canUserModify: () => true,
    getCatalogEntry: id => ({id, kind: "specialty"}), duplicateSpecialty: id => {duplicated = id;}, deleteCustomSpecialty: id => {deleted = id;}};
  const target = row({itemId: "copy"}), original = row({itemId: "base"}), unlearned = row({catalogId: "loreLegends"});
  const sheet = {actor, isEditable: true, element: {querySelectorAll: () => [target, original, unlearned]}, _createContextMenu: handler => {menu = handler();}};
  bindSheetListMenus(sheet);
  const duplicate = menu.find(entry => entry.label === "TRUDVANG.Action.Duplicate"), remove = menu.find(entry => entry.label === "TRUDVANG.Action.Delete");
  assert.equal(duplicate.visible(target), true); assert.equal(duplicate.visible(unlearned), true);
  assert.equal(remove.visible(original), false); assert.equal(remove.visible(target), true);
  assert.equal(remove.visible(row({catalogId: copy.system.catalogId})), true, "right-clicking the nested name/button resolves its embedded copy too");
  await duplicate.onClick(target); await remove.onClick(target);
  assert.equal(duplicated, "copy"); assert.equal(deleted, "copy");
  copy.system.level = 1; assert.equal(remove.visible(target), false);
  copy.system.level = 0; copy.system.offHandLevel = 1; assert.equal(remove.visible(target), false);
  actor.canUserModify = () => false;
  assert.equal(duplicate.visible(target), false); assert.equal(remove.visible(target), false);
});
