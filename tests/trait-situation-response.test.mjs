import assert from "node:assert/strict";
import test from "node:test";

globalThis.foundry = {
  documents: {Actor: class {}, ActiveEffect: class {}},
  data: {ActiveEffectTypeDataModel: class {}},
  applications: {handlebars: {renderTemplate: async (_path, data) => JSON.stringify(data)}},
  utils: {fromUuid: async uuid => documents.get(uuid)}
};
const {
  claimTraitSituationRoll, recordTraitSituationResponse, registerTraitSituationSocket, requestTraitSituationResponse
} = await import("../modules/trait-situation-request.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");

const documents = new Map();
const gm = {id: "gm", name: "MJ", isGM: true, active: true};
const player = {id: "player", name: "Joueur", isGM: false, active: true};
let rolls = [];
let evaluated = 0;
let updates = 0;
const request = {traitKey: "strength", sv: 10, responses: []};
const message = {
  id: "request-1",
  user: gm.id,
  getFlag: () => request,
  async update(data) {
    updates++;
    request.responses = data["flags.trudvang-chronicles.traitSituation.responses"];
    this.content = data.content;
  }
};
globalThis.game = {
  user: gm,
  users: new Map([[gm.id, gm], [player.id, player]]),
  messages: new Map([[message.id, message]]),
  i18n: {localize: key => key, format: (key, values) => `${key} ${values.trait}`},
  modules: new Map()
};
game.users.filter = predicate => [...game.users.values()].filter(predicate);
globalThis.Roll = class {
  async evaluate() {
    evaluated++;
    this.total = rolls.shift();
    return this;
  }
};
globalThis.ChatMessage = {create: () => { throw new Error("A response must not create another chat message"); }};

function actor(id, trait, owner = true, type = "character") {
  const document = {
    uuid: `Actor.${id}`, type, name: id,
    testUserPermission: (_user, level) => owner && level === "OWNER",
    getTraitValue: () => trait,
    getRollModifier: () => 0
  };
  documents.set(document.uuid, document);
  return document;
}

async function claim(performer, claimId = `claim-${performer.uuid}`) {
  const payload = {messageId: message.id, actorUuid: performer.uuid, userId: player.id, claimId, modifier: 0};
  assert.equal(await claimTraitSituationRoll(payload), "claimed");
  return payload;
}

test("GM records player-supplied dice on the original card, with all four outcomes", async () => {
  const npc = actor("failure", 0, true, "npc");
  const token = {documentName: "Token", uuid: "Scene.scene-1.Token.npc-1", name: "PNJ sur la carte", actor: npc};
  documents.set(token.uuid, token);
  const cases = [
    [actor("perfect-success", -20), 1, "perfectSuccess", true],
    [actor("perfect-failure", 20), 20, "perfectFailure", false],
    [actor("success", 0), 7, "success", true],
    [npc, 16, "failure", false]
  ];
  for (const [performer, die, outcome, success] of cases) {
    const payload = await claim(performer);
    assert.equal(await recordTraitSituationResponse({...payload, result: die, modifier: 0,
      tokenUuid: performer === npc ? token.uuid : ""}), "recorded");
    const rows = JSON.parse(message.content).responses;
    assert.equal(rows.at(-1).outcome, outcome);
    assert.equal(rows.at(-1).success, success);
    assert.equal(rows.at(-1).result, die);
  }
  assert.equal(updates, 4);
  assert.equal(evaluated, 0, "the GM never evaluates a player's die");
  assert.equal(request.responses.length, 4);
  assert.equal(request.responses.at(-1).tokenUuid, token.uuid);
  assert.equal(request.responses.at(-1).name, token.name);
  assert.equal(await claimTraitSituationRoll({messageId: message.id, actorUuid: cases[0][0].uuid,
    userId: player.id, claimId: "again", modifier: 0}), "alreadyRolled");
});

test("a second simultaneous click is rejected before it can roll", async () => {
  const performer = actor("simultaneous", 0);
  const payload = await claim(performer);
  assert.equal(await claimTraitSituationRoll({...payload, claimId: "another-click"}), "alreadyRolled");
  assert.equal(await recordTraitSituationResponse({...payload, result: 8, modifier: 0}), "recorded");
  assert.equal(request.responses.filter(response => response.actorUuid === performer.uuid).length, 1);
  assert.equal(evaluated, 0);
});

test("an unowned actor and an unclaimed die cannot update the GM card", async () => {
  const performer = actor("unowned", 0, false);
  assert.equal(await claimTraitSituationRoll({messageId: message.id, actorUuid: performer.uuid,
    userId: player.id, claimId: "unowned"}), "unavailable");
  const other = actor("unclaimed", 0);
  assert.equal(await recordTraitSituationResponse({messageId: message.id, actorUuid: other.uuid,
    userId: player.id, claimId: "fake", modifier: 0, result: 5}), "unavailable");
  game.user = player;
  assert.equal(await claimTraitSituationRoll({messageId: message.id, actorUuid: other.uuid,
    userId: player.id, claimId: "player"}), "unavailable");
  game.user = gm;
});

test("the player rolls locally and the GM automatically updates the original card", async () => {
  let socketHandler;
  const emitted = [];
  game.socket = {
    on: (_channel, handler) => { socketHandler = handler; },
    emit: (_channel, payload) => { emitted.push(payload); }
  };
  registerTraitSituationSocket();
  const performer = actor("remote", 2);
  rolls = [9];
  game.user = player;
  const pending = requestTraitSituationResponse({message, actor: performer, modifier: 3});
  async function deliverFrom(sender, expectedType) {
    for (let i = 0; i < 10 && !emitted.length; i++) await new Promise(resolve => setImmediate(resolve));
    const payload = emitted.shift();
    assert.equal(payload?.type, expectedType);
    game.user = sender;
    await socketHandler(payload);
  }
  await deliverFrom(gm, "traitSituationClaim");
  assert.equal(evaluated, 0);
  await deliverFrom(player, "traitSituationReply");
  await deliverFrom(gm, "traitSituationSubmit");
  assert.equal(evaluated, 1);
  await deliverFrom(player, "traitSituationReply");
  assert.equal(await pending, "recorded");
  await deliverFrom(gm, "traitSituationRelease");
  const row = request.responses.find(response => response.actorUuid === performer.uuid);
  assert.equal(row.result, 9);
  assert.equal(row.target, 15);
  assert.equal(updates, 6);
  game.user = gm;
});

test("the GM recalculates wounds and fear for a resistance, rather than trusting a client's target", async () => {
  for (const durable of [false, true]) {
    const performer = actor(`states-${durable}`, 2);
    performer.system = {damage: {penalty: -3}, fearPenalty: -1, modifiers: {rolls: {allActions: 1}}};
    performer.items = durable ? [{type: "creatureAbility", system: {ignoreWoundPenalties: true}}] : [];
    performer.isInCombatActive = () => false;
    performer.getRollModifier = TrudvangActor.prototype.getRollModifier;
    const payload = await claim(performer);
    assert.equal(await recordTraitSituationResponse({...payload, result: 10, modifier: 2, target: 99}), "recorded");
    const response = request.responses.at(-1);
    assert.equal(response.target, durable ? 14 : 11, "10 SV +2 trait +1 effect +2 situational -1 fear (-3 wounds unless Tenace)");
    assert.equal(response.success, true);
  }
});

test("a no-trait resistance uses a normal situation modifier and never reads a trait", async () => {
  request.traitKey = "aucun";
  request.sv = 10;
  const performer = actor("no-trait", 0);
  const modifierCalls = [];
  performer.getTraitValue = () => { throw new Error("A no-trait roll must not read a trait"); };
  performer.getRollModifier = options => {
    modifierCalls.push(options);
    assert.deepEqual(options, {kind: "situation"});
    return 3;
  };
  const payload = await claim(performer);
  assert.equal(await recordTraitSituationResponse({...payload, result: 12, modifier: 2}), "recorded");
  assert.equal(request.responses.at(-1).target, 15);
  assert.deepEqual(modifierCalls, [{kind: "situation"}]);
  request.traitKey = "strength";
  request.sv = 10;
});
