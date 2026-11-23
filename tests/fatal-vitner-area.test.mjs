import assert from "node:assert/strict";
import test from "node:test";
import {applyFatalVitnerArea, fatalVitnerRecipients} from "../modules/fatal-vitner-area.mjs";
import {fatalSpellBlindness, absorbsVitnerFrom, fatalAbsence, fatalRecoveryBlocked} from "../modules/rules/fatal-magic.mjs";
import {applyFatalPortal, blockFatalRecovery} from "../modules/fatal-catastrophes.mjs";

const scope = "trudvang-chronicles";
const id = "fatalmessage0001";
const actor = (name, vitner = 0, max = vitner) => {
  const receipts = {};
  const resources = {vitner: {value: vitner, current: vitner, max}, body: {value: 20, current: 20, max: 20}};
  const source = {uuid: `Actor.${name}`, name, type: "npc", isOwner: true, effects: new Map(),
    system: {resources}, _source: {system: {resources}}, documentName: "Actor",
    canUserModify: user => user.isGM || user.id === name, getFlag: (_scope, key) => receipts[key]};
  source.update = async changes => {
    for (const [key, value] of Object.entries(changes)) {
      if (!key.startsWith(`flags.${scope}.`)) continue;
      const parts = key.split(".").slice(2);
      const field = parts.pop();
      const parent = parts.reduce((object, part) => object[part] ??= {}, receipts);
      parent[field] = value;
    }
    for (const key of ["vitner", "body"]) {
      const value = changes[`system.resources.${key}.value`];
      if (value !== undefined) resources[key].value = resources[key].current = value;
    }
  };
  source.createTrudvangEffect = async data => {
    const key = data._id ?? data.system.stackId;
    const effect = {...data, uuid: `${source.uuid}.ActiveEffect.${key}`, parent: source,
      delete: async () => source.effects.delete(key)};
    source.effects.set(key, effect);
    return effect;
  };
  return source;
};
const token = (actor, x, level = "ground", hidden = false) => ({
  uuid: `Scene.scene.Token.${actor.name}`, actor, name: actor.name, width: 1, height: 1, x, y: 0, hidden, level
});

test("the discharge uses the footprint, the correct level, and one result per actor", () => {
  const mage = token(actor("mage"), 0);
  const linked = actor("linked");
  const edge = token(actor("edge"), 1000);
  edge.getContainmentTestPoints = () => [{x: 530, y: 50}];
  const scene = {grid: {size: 100, distance: 1, units: "m"}, tokens: [mage, token(linked, 100, "ground", true),
    token(linked, 200), token(actor("outside"), 600), token(actor("upstairs"), 100, "upper"), edge]};
  mage.parent = scene;
  const targets = fatalVitnerRecipients(mage, 5, true);
  assert.deepEqual(targets.map(row => [row.name, row.hidden]), [["linked", false], ["edge", false]]);
  assert.equal(fatalVitnerRecipients(mage, 5, false)[0].actorUuid, mage.actor.uuid);
  assert.equal(absorbsVitnerFrom(actor("spent", 0, 10)), true);
  assert.equal(absorbsVitnerFrom(actor("mundane")), false);
});

test("46 freezes separate rolls across retries, drains the appropriate pools and restores casting on expiration", async () => {
  const mage = actor("mage", 8);
  const spent = actor("spent", 0, 10);
  const mundane = actor("mundane");
  const plans = {};
  const origin = token(mage, 0);
  const regions = new Map();
  const scene = {id: "scene", regions, grid: {size: 100, distance: 1, units: "m"},
    tokens: [origin, token(spent, 100), token(mundane, 200)],
    getFlag: () => plans, update: async changes => {plans[id] = Object.values(changes)[0];},
    createEmbeddedDocuments: async (type, [data]) => {
      assert.equal(type, "Region");
      const region = {...data, delete: async () => regions.delete("preview")};
      regions.set("preview", region);
      return [region];
    }};
  origin.parent = scene;
  const supported = new Map([origin, mage, spent, mundane].map(doc => [doc.uuid, doc]));
  globalThis.foundry = {utils: {fromUuid: async uuid => supported.get(uuid)}};
  globalThis.CONST = {REGION_VISIBILITY: {ALWAYS: 2}};
  globalThis.game = {scenes: new Map([[scene.id, scene]]), i18n: {localize: key => key}};
  const formulas = [];
  const values = [4, 3, 6, 2, 5];
  globalThis.Roll = class {constructor(formula) {formulas.push(formula);} async evaluate() {return {total: values.shift()};}};
  const result = {row: 46, actorUuid: mage.uuid, tokenUuid: origin.uuid,
    plan: {radius: 999, victims: []}};
  const updateCard = async changes => Object.entries(changes).forEach(([path, value]) => {result[path.split(".").at(-1)] = value;});
  const message = {id, rolls: [{total: 46}], getFlag: () => result, update: updateCard};
  assert.deepEqual(await applyFatalVitnerArea(message, {prepareOnly: true}), {status: "prepared"});
  assert.equal(regions.size, 1);
  assert.equal([...regions.values()][0].shapes[0].radius, 400);
  assert.equal(mundane.system.resources.body.current, 20);
  assert.equal(result.preview.targets.length, 3);
  message.update = async () => {throw Error("failed to update the card");};
  await assert.rejects(applyFatalVitnerArea(message), /failed to update the card/);
  assert.equal(regions.size, 1);
  assert.deepEqual(formulas, ["1d10x>=10", "1d6", "1d6", "1d6", "1d6"]);
  assert.equal(mage.system.resources.vitner.current, 5);
  assert.equal(spent.system.resources.body.current, 20);
  assert.equal(mundane.system.resources.body.current, 18);
  assert.deepEqual(mage.effects.get(id).duration, {value: 5, units: "days"});
  assert.equal(fatalSpellBlindness(mage), true);
  message.update = updateCard;
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.equal(regions.size, 0);
  assert.equal(mundane.system.resources.body.current, 18);
  assert.equal(formulas.length, 5);
  assert.equal(result.radius, 4);
  assert.equal(result.outcomes[0].rolled, undefined);
  mage.effects.get(id).duration.expired = true;
  assert.equal(fatalSpellBlindness(mage), false);
});

test("45 creates a 10 m preview on a 10 and only the tisseur loses one third", async () => {
  const mage = actor("mage", 29);
  const ally = actor("ally");
  const outside = actor("outside");
  const source = token(mage, 0);
  const regions = new Map();
  const plans = {};
  const scene = {id: "scene", regions, grid: {size: 100, distance: 1, units: "m"},
    tokens: [source, token(ally, 999), token(outside, 1100)],
    getFlag: () => plans, update: async data => {plans[id] = Object.values(data)[0];},
    createEmbeddedDocuments: async (_type, [data]) => {
      const region = {...data, delete: async () => regions.clear()};
      regions.set("r", region);
      return [region];
    }};
  source.parent = scene;
  const docs = new Map([source, mage, ally, outside].map(doc => [doc.uuid, doc]));
  globalThis.CONST = {REGION_VISIBILITY: {ALWAYS: 2}};
  globalThis.game = {scenes: new Map([[scene.id, scene]]), i18n: {localize: key => key}};
  globalThis.foundry = {utils: {fromUuid: async uuid => docs.get(uuid)}};
  const dice = [4, 10, 1, 5];
  globalThis.Roll = class {async evaluate() {return {total: dice.shift()};}};
  const result = {row: 45, actorUuid: mage.uuid, tokenUuid: source.uuid};
  const message = {id, rolls: [{total: 45}], getFlag: () => result,
    update: async data => Object.entries(data).forEach(([path, value]) => {result[path.split(".").at(-1)] = value;})};
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "prepared"});
  assert.equal(regions.get("r").shapes[0].radius, 1000);
  assert.equal(mage.effects.size + ally.effects.size, 0);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.equal(mage.effects.get(id).flags[scope].fatalMagic.third, true);
  assert.equal(ally.effects.get(id).flags[scope].fatalMagic.third, false);
  assert.match(ally.effects.get(id).description, /Grass/);
  assert.deepEqual(ally.effects.get(id).duration, {value: 4, units: "days"});
  assert.equal(outside.effects.size, 0);
  assert.equal(regions.size, 0);
});

function catastrophe(row, dice, positions, cost) {
  const mage = actor("mage", 17);
  const source = token(mage, 0);
  const victims = positions.map((position, index) => token(actor(`target${index}`), position));
  const regions = new Map();
  const plans = {};
  const scene = {id: "scene", regions, grid: {size: 100, distance: 1, units: "m"}, tokens: [source, ...victims],
    getFlag: () => plans,
    update: async data => {
      const [key, value] = Object.entries(data)[0];
      if (key.endsWith(".medical")) plans[id].medical = value;
      else plans[id] = value;
    },
    createEmbeddedDocuments: async (_type, entries) => entries.map((entry, index) => {
      const region = {...entry, delete: async () => regions.delete(index)};
      regions.set(index, region);
      return region;
    })};
  source.parent = scene;
  source.update = async changes => Object.assign(source, changes);
  const combat = {id: "combat", scene, round: 2};
  const docs = new Map(scene.tokens.flatMap(token => [[token.uuid, token], [token.actor.uuid, token.actor]]));
  globalThis.CONST = {REGION_VISIBILITY: {ALWAYS: 2}};
  globalThis.game = {scenes: new Map([[scene.id, scene]]), combats: new Map([[combat.id, combat]]), combat,
    time: {worldTime: 10}, i18n: {localize: key => key}};
  globalThis.foundry = {utils: {fromUuid: async uuid => docs.get(uuid)}};
  const formulas = [];
  globalThis.Roll = class {
    constructor(formula) {formulas.push(formula);}
    async evaluate() {return {total: dice.shift()};}
  };
  const result = {row, cost, actorUuid: mage.uuid, tokenUuid: source.uuid};
  const message = {id, rolls: [{total: row}], getFlag: () => result,
    update: async data => Object.entries(data).forEach(([path, value]) => {result[path.split(".").at(-1)] = value;})};
  return {message, result, mage, source, victims, regions, combat, formulas};
}

test("55 freezes the spell cost, then applies full caster damage and half to the other creatures once", async () => {
  const {message, mage, victims, regions, formulas} = catastrophe(55, [4, 12], [400, 500], 9);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "prepared"});
  assert.equal(regions.size, 1);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.deepEqual(formulas, ["2d6", "1d10x>=7"]);
  assert.equal(mage.system.resources.body.current, 11);
  assert.equal(mage.system.resources.vitner.current, 1);
  assert.equal(fatalRecoveryBlocked(mage), true);
  assert.equal(victims[0].actor.system.resources.body.current, 15);
  assert.equal(victims[1].actor.system.resources.body.current, 20);
  assert.equal(regions.size, 0);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "alreadyApplied"});
  assert.equal(victims[0].actor.system.resources.body.current, 15);
});

test("51 takes half the remaining vitner once and blocks recovery without lowering capacity", async () => {
  const {message, mage} = catastrophe(51, [], []);
  await blockFatalRecovery(mage, message, 7);
  await blockFatalRecovery(mage, message, 7);
  assert.equal(mage.system.resources.vitner.current, 9);
  assert.equal(mage.system.resources.vitner.max, 17);
  assert.equal(mage.effects.size, 1);
  const [effect] = mage.effects.values();
  assert.equal(effect.duration.value, 7);
  assert.equal(fatalRecoveryBlocked(mage), true);
  effect.duration.expired = true;
  assert.equal(fatalRecoveryBlocked(mage), false);
});

test("58 records the absence and hides the caster token without deleting the actor", async () => {
  const {message, result, mage, source} = catastrophe(58, [], []);
  source.canUserModify = () => true;
  await applyFatalPortal(mage, message, source);
  assert.equal(source.hidden, true);
  assert.equal(mage.effects.size, 1);
  assert.equal(fatalAbsence(mage), true);
  assert.equal(result.applied, "TRUDVANG.FatalMagic.Portal");
});

test("60+ waits for the countdown, freezes one roll across both bands and keeps both regions until application", async () => {
  const {message, result, mage, source, victims, regions, combat, formulas} = catastrophe(60, [2, 15], [9900, 18000, 40000]);
  message.rolls[0].total = 1200;
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "prepared"});
  assert.equal(result.preview.remaining, 2);
  assert.equal(fatalAbsence(mage), true);
  assert.equal(regions.size, 2);
  combat.round++;
  game.time.worldTime += 5;
  await applyFatalVitnerArea(message, {prepareOnly: true});
  assert.equal(result.preview.remaining, 1);
  combat.round++;
  await applyFatalVitnerArea(message, {prepareOnly: true});
  assert.equal(result.preview.remaining, 0);
  assert.equal(result.preview.targets.length, 2);
  assert.equal(regions.size, 2);
  assert.equal(victims[0].actor.system.resources.body.current, 20);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.deepEqual(formulas, ["1d6", "1d10x>=5"]);
  assert.equal(victims[0].actor.system.resources.body.current, 5);
  assert.equal(victims[1].actor.system.resources.body.current, 12);
  assert.equal(victims[2].actor.system.resources.body.current, 20);
  assert.equal(source.hidden, true);
  assert.equal(mage.effects.size, 1);
  assert.equal(fatalAbsence(mage), true);
  assert.equal(regions.size, 0);
});

test("53 queues one Psychisme test per target on the area card and resolves each blindness separately", async () => {
  const {message, result, mage, victims, regions} = catastrophe(53, [5, 4, 1, 3, 12], [200, 300], 8);
  game.i18n.format = key => key;
  const gm = {id: "gm", isGM: true, isSelf: true};
  const owner = {id: victims[0].actor.name};
  game.users = new Map([[gm.id, gm], [owner.id, owner]]);
  game.users.activeGM = gm;
  game.messages = new Map([[message.id, message]]);
  game.user = gm;
  const originalLookup = foundry.utils.fromUuid;
  foundry.utils.fromUuid = async uuid => {
    const subject = [mage, ...victims.map(token => token.actor)].find(actor => actor.effects.get(id)?.uuid === uuid);
    return subject?.effects.get(id) ?? originalLookup(uuid);
  };
  foundry.documents = {ActiveEffect: {implementation: {getEffectStart: () => ({time: 20})}}};
  globalThis.ChatMessage = {create: () => assert.fail("the flash must use the existing area card")};
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "prepared"});
  assert.equal(result.preview.targets.length, 3);
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.equal(regions.size, 0);
  assert.equal(mage.system.resources.body.current, 12);
  const {resolveInitialResistanceOnAuthority} = await import("../modules/initial-resistance.mjs");
  const [success, failure] = victims.map(token => token.actor.effects.get(id));
  assert.equal(success.flags[scope].consequenceTests[0].kind, "resist");
  assert.deepEqual(success.flags[scope].consequenceTests[0].trait, ["psyche"]);
  assert.equal(success.flags[scope].initialResistance.areaMessageId, message.id);
  let applied;
  failure.update = async changes => { applied = changes; };
  assert.equal(await resolveInitialResistanceOnAuthority({effectUuid:failure.uuid,id,userId:owner.id,success:true}), "unavailable");
  assert.deepEqual(await Promise.all([
    resolveInitialResistanceOnAuthority({effectUuid:success.uuid,id,userId:owner.id,success:true}),
    resolveInitialResistanceOnAuthority({effectUuid:failure.uuid,id,userId:gm.id,success:false})
  ]), ["resisted", "activated"]);
  assert.equal(success.parent.effects.has(id), false);
  assert.deepEqual(applied.statuses, ["blind"]);
  assert.deepEqual(applied.start, {time: 20});
  assert.equal(success.parent.getFlag(scope,"fatalFlash")[id].success, true);
  assert.equal(failure.parent.getFlag(scope,"fatalFlash")[id].success, false);
});
