import assert from "node:assert/strict";
import test from "node:test";
import {applyFatalVitnerArea, fatalVitnerRecipients} from "../modules/fatal-vitner-area.mjs";
import {fatalSpellBlindness, absorbsVitnerFrom} from "../modules/rules/fatal-magic.mjs";

const scope = "trudvang-chronicles";
const id = "fatalmessage0001";
const actor = (name, vitner = 0, max = vitner) => {
  const receipts = {};
  const resources = {vitner: {value: vitner, current: vitner, max}, body: {value: 20, current: 20, max: 20}};
  const source = {uuid: `Actor.${name}`, name, type: "npc", isOwner: true, effects: new Map(),
    system: {resources}, _source: {system: {resources}}, getFlag: () => receipts};
  source.update = async changes => {
    receipts[id] = changes[`flags.${scope}.fatalVitnerLoss.${id}`];
    for (const key of ["vitner", "body"]) {
      const value = changes[`system.resources.${key}.value`];
      if (value !== undefined) resources[key].value = resources[key].current = value;
    }
  };
  source.createTrudvangEffect = async data => {source.effects.set(data._id, data); return data;};
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
  const scene = {grid: {size: 100, distance: 1, units: "m"},
    tokens: [origin, token(spent, 100), token(mundane, 200)],
    getFlag: () => plans, update: async changes => {plans[id] = Object.values(changes)[0];}};
  origin.parent = scene;
  const supported = new Map([origin, mage, spent, mundane].map(doc => [doc.uuid, doc]));
  globalThis.foundry = {utils: {fromUuid: async uuid => supported.get(uuid)}};
  globalThis.game = {i18n: {localize: key => key}};
  const formulas = [];
  const values = [4, 3, 6, 2, 5];
  globalThis.Roll = class {constructor(formula) {formulas.push(formula);} async evaluate() {return {total: values.shift()};}};
  const result = {row: 46, actorUuid: mage.uuid, tokenUuid: origin.uuid,
    plan: {radius: 999, victims: []}};
  const message = {id, rolls: [{total: 46}], getFlag: () => result,
    update: async () => {throw Error("failed to update the card");}};
  await assert.rejects(applyFatalVitnerArea(message), /failed to update the card/);
  assert.deepEqual(formulas, ["1d10x>=10", "1d6", "1d6", "1d6", "1d6"]);
  assert.equal(mage.system.resources.vitner.current, 5);
  assert.equal(spent.system.resources.body.current, 20);
  assert.equal(mundane.system.resources.body.current, 18);
  assert.deepEqual(mage.effects.get(id).duration, {value: 5, units: "days"});
  assert.equal(fatalSpellBlindness(mage), true);
  message.update = async changes => Object.entries(changes).forEach(([path, value]) => {result[path.split(".").at(-1)] = value;});
  assert.deepEqual(await applyFatalVitnerArea(message), {status: "applied"});
  assert.equal(mundane.system.resources.body.current, 18);
  assert.equal(formulas.length, 5);
  assert.equal(result.radius, 4);
  assert.equal(result.outcomes[0].rolled, undefined);
  mage.effects.get(id).duration.expired = true;
  assert.equal(fatalSpellBlindness(mage), false);
});
