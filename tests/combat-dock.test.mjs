import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const en = JSON.parse(readFileSync(new URL("../lang/en.json", import.meta.url), "utf8"));
const fr = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const localize = key => key.split(".").reduce((value, part) => value?.[part], en) ?? key;
const formatLang = (key, data = {}) => localize(key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");

const hookListeners = {};
const warnings = [];
globalThis.game = {user: {isGM: false},
  i18n: {localize, format: formatLang, lang: "en"}};
globalThis.ui = {notifications: {warn: message => warnings.push(message)}};
globalThis.Hooks = {on: (hook, callback) => {
  (hookListeners[hook] ??= []).push(callback);
}};

const {registerCombatDockSupport, buildHealthAttribute, buildReserveAttributes,
  buildPreparedIcons, buildDockDescription, resolveWoundStateLabel, woundTier,
  buildTrackedCombatEntry, escapeDockHtml, COMBAT_DOCK_MAX_ICONS} =
  await import("../modules/combat-dock.mjs");

function bodyActor(overrides = {}) {
  return {
    type: "character",
    isOwner: false,
    items: [],
    system: {
      resources: {
        body: {max: 20, value: 20, current: 20},
        combat: {max: 12, value: 12, current: 12},
        vitner: {max: 0, value: 0, current: 0},
        divinity: {max: 0, value: 0, current: 0},
        fear: {max: 0, value: 0, current: 0}
      },
      damage: {penalty: 0, level: "unhurt"},
      fearPenalty: 0,
      fearInsane: false,
      modifiers: {},
      usedPreparedActions: [],
      attacks: []
    },
    ...overrides
  };
}

function npcStub() {
  const sword = {id: "sword", _id: "sword", type: "weapon", name: "Claws",
    system: {combatSpecialty: "oneHandedLightWeapons", equipped: true, hand: "weapon"}};
  return {
    type: "npc",
    isOwner: true,
    isInActiveCombat: false,
    items: [sword],
    getSkillValue: () => 10,
    findRuleKnowledge: () => null,
    findKnowledgeItem: () => null,
    getWeaponActionState: () => ({max: 4, spent: 0, current: 4}),
    rolls: [],
    async rollNpcPreparedAction(combo, step) {
      this.rolls.push([combo, step]);
      return {combo, step};
    },
    system: {
      resources: {
        body: {max: 20, value: 14, current: 14},
        combat: {max: 10, value: 8, current: 8},
        vitner: {max: 6, value: 3, current: 3},
        divinity: {max: 0, value: 0, current: 0},
        fear: {max: 0, value: 12, current: 12}
      },
      damage: {penalty: -1, level: "injured"},
      fearPenalty: -1,
      fearInsane: false,
      modifiers: {bodyValue: 0, fearValue: 0, bodyMax: 0},
      details: {move: []},
      usedPreparedActions: [],
      attacks: [[{attack: "Claws", value: 4}]]
    }
  };
}

test("wound tiers follow quartiles and dying at zero", () => {
  assert.equal(woundTier(20, 20), "unhurt");
  assert.equal(woundTier(20, 16), "light");
  assert.equal(woundTier(20, 11), "injured");
  assert.equal(woundTier(20, 6), "serious");
  assert.equal(woundTier(20, 1), "critical");
  assert.equal(woundTier(20, 0), "dying");
  assert.equal(woundTier(20, -5), "dying");
});

test("privileged viewers see numeric health, others see wound state only", () => {
  const actor = bodyActor();
  actor.system.resources.body = {max: 20, value: 11, current: 11};
  const numeric = buildHealthAttribute(actor, {privileged: true});
  assert.equal(numeric.max, 20);
  assert.equal(numeric.value, 11);
  assert.ok(numeric.percentage > 0 && numeric.percentage < 100);
  assert.match(numeric.iconHTML, /fa-heart/);
  assert.equal(numeric.units, "HP");
  const hidden = buildHealthAttribute(actor, {privileged: false});
  assert.equal(hidden.units, "");
  assert.equal(hidden.max, null);
  assert.equal(typeof hidden.value, "string");
  assert.ok(hidden.value.length > 0);
});

test("Tenace wound display is binary (indemne ou mourant)", () => {
  const tenaceItem = {type: "creatureAbility", system: {ignoreWoundPenalties: true}};
  const hurt = bodyActor({items: [tenaceItem]});
  hurt.system.resources.body = {max: 20, value: 6, current: 6};
  assert.equal(resolveWoundStateLabel(hurt).level, "unhurt");
  assert.equal(resolveWoundStateLabel(hurt).labelKey, "TRUDVANG.Damage.unhurt");
  const dying = bodyActor({items: [tenaceItem]});
  dying.system.resources.body = {max: 20, value: 0, current: 0};
  assert.equal(resolveWoundStateLabel(dying).level, "dying");
  const plain = bodyActor();
  plain.system.resources.body = {max: 20, value: 6, current: 6};
  assert.equal(resolveWoundStateLabel(plain).level, "serious");
  assert.equal(resolveWoundStateLabel(plain).labelKey, "TRUDVANG.Damage.serious");
});

test("GM/owner/observer matrix grants numeric health", () => {
  const observer = bodyActor({isOwner: false,
    testUserPermission: (user, level) => level === "OBSERVER"});
  globalThis.game.user.isGM = false;
  assert.equal(buildHealthAttribute(observer).units, "HP");
  const stranger = bodyActor({isOwner: false, testUserPermission: () => false});
  assert.equal(buildHealthAttribute(stranger).units, "");
  globalThis.game.user.isGM = true;
  assert.equal(buildHealthAttribute(stranger).units, "HP");
  globalThis.game.user.isGM = false;
  const owner = bodyActor({isOwner: true});
  assert.equal(buildHealthAttribute(owner).units, "HP");
});

test("reserve entries appear only when current is above zero", () => {
  const actor = bodyActor();
  actor.system.resources.vitner = {max: 6, value: 3, current: 3};
  actor.system.resources.divinity = {max: 4, value: 0, current: 0};
  const entries = buildReserveAttributes(actor);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].key, "vitner");
  assert.equal(entries[0].value, 3);
  assert.equal(entries[0].max, 6);
  assert.equal(entries[0].units, "VP");
  assert.deepEqual(buildReserveAttributes(bodyActor()), []);
});

test("prepared icons are NPC-only, capped, and fire gated rolls", async () => {
  assert.deepEqual(buildPreparedIcons(bodyActor()), []);
  const npc = npcStub();
  npc.system.attacks = [Array.from({length: 8}, () => ({attack: "Claws", value: 2}))];
  const icons = buildPreparedIcons(npc);
  assert.equal(icons.length, COMBAT_DOCK_MAX_ICONS);
  assert.equal(icons[0].icon, "fas fa-sword");
  assert.match(icons[0].iconHTML, /fa-sword/);
  assert.match(icons[0].title, /Claws/);
  assert.match(icons[0].title, /2/);
  warnings.length = 0;
  await icons[0].callback();
  assert.deepEqual(npc.rolls, [[0, 0]]);
  await icons[0].onClick();
  assert.deepEqual(npc.rolls, [[0, 0], [0, 0]]);
  const locked = npcStub();
  locked.isOwner = false;
  const lockedIcons = buildPreparedIcons(locked);
  assert.ok(lockedIcons.length > 0);
  warnings.length = 0;
  locked.rolls = [];
  await lockedIcons[0].callback();
  assert.deepEqual(locked.rolls, []);
  assert.ok(warnings.length > 0);
  assert.match(warnings[0], /cannot roll/i);
});

test("unusable prepared attacks produce no icons", () => {
  const npc = npcStub();
  npc.system.attacks = [[{attack: "Claws", value: 99}]];
  assert.deepEqual(buildPreparedIcons(npc), []);
});

test("description lists prepared attacks non-clickably with quantified effects and reserves", () => {
  const npc = npcStub();
  npc.system.usedPreparedActions = ["0:0"];
  const html = buildDockDescription(npc);
  assert.match(html, /Claws/);
  assert.match(html, /4/);
  assert.match(html, new RegExp(localize("TRUDVANG.CombatDock.PreparedUsed")));
  assert.doesNotMatch(html, /<button/);
  assert.match(html, /-1/);
  assert.match(html, /12/);
  assert.match(html, /3\/6/);
  assert.match(html, /8/);
  assert.ok(!html.includes("Active Effects") || html.includes("trudvang-combat-dock"));
});

test("description escapes actor-controlled text", () => {
  const npc = npcStub();
  npc.system.attacks = [[{attack: "<script>alert(1)</script>", value: 99}]];
  const html = buildDockDescription(npc);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.equal(escapeDockHtml('<a href="x">&'), "&lt;a href=&quot;x&quot;&gt;&amp;");
});

test("tracked combat entry points at resources.combat.current", () => {
  const entry = buildTrackedCombatEntry();
  assert.equal(entry.attr, "resources.combat.current");
  assert.equal(entry.icon, "fas fa-sword");
  assert.ok(JSON.stringify(entry).includes("resources.combat.current"));
});

test("handler wires config defensively and subclasses the portrait", async () => {
  registerCombatDockSupport();
  const inits = hookListeners["combat-tracker-dock-init"];
  assert.ok(inits?.length > 0);
  const init = inits.at(-1);
  assert.doesNotThrow(() => init(undefined));
  assert.doesNotThrow(() => init({}));
  assert.doesNotThrow(() => init({CombatantPortrait: null}));
  class StubPortrait {
    constructor() {
      this.actor = null;
    }
    async getData() {
      return {attributes: [{existing: true}], resSystemIcons: []};
    }
  }
  const config = {CombatantPortrait: StubPortrait, defaultAttributesConfig: {}};
  assert.doesNotThrow(() => init(config));
  assert.ok(JSON.stringify(config.defaultAttributesConfig["trudvang-chronicles"]).includes("resources.combat.current"));
  assert.notEqual(config.CombatantPortrait, StubPortrait);
  const npc = npcStub();
  const portrait = new config.CombatantPortrait();
  portrait.actor = npc;
  const data = await portrait.getData();
  assert.ok(data.attributes.length >= 3);
  assert.ok(data.attributes.some(entry => entry.units === "VP"));
  assert.equal(typeof data.description, "string");
  assert.match(data.description, /Claws/);
  assert.ok(Array.isArray(data.resSystemIcons));
  assert.equal(data.resSystemIcons.length, 1);
  warnings.length = 0;
  await data.resSystemIcons[0].callback();
  assert.deepEqual(npc.rolls, [[0, 0]]);
});

test("handler never throws on drifted module shapes", () => {
  const init = hookListeners["combat-tracker-dock-init"].at(-1);
  assert.doesNotThrow(() => init({CombatantPortrait: class {
    async getData() {
      return null;
    }
  }}));
  assert.doesNotThrow(() => init({CombatantPortrait: 42, defaultAttributesConfig: null}));
});

test("without the module nothing is registered and nothing changes", () => {
  const saved = globalThis.Hooks;
  delete globalThis.Hooks;
  assert.doesNotThrow(() => registerCombatDockSupport());
  globalThis.Hooks = saved;
});

test("new CombatDock keys exist in both languages", () => {
  for (const key of ["HealthUnits", "CombatUnits", "VitnerUnits", "DivinityUnits",
    "PreparedTitle", "NoPrepared", "PreparedRow", "PreparedUsed", "IconTitle",
    "HealthLine", "EffectsLine", "FearLine", "ReservesLine", "TenaceNote"]) {
    assert.ok(typeof en.TRUDVANG.CombatDock[key] === "string", `missing en ${key}`);
    assert.ok(typeof fr.TRUDVANG.CombatDock[key] === "string", `missing fr ${key}`);
  }
  assert.notEqual(en.TRUDVANG.CombatDock.HealthUnits, fr.TRUDVANG.CombatDock.HealthUnits);
});
