import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import test from "node:test";
import {ACTOR_STATE_STATUSES, actorStateStatuses} from "../modules/rules/actor-status-resolver.mjs";
import {registerActorStatusHooks, syncActorStateStatuses, syncWorldActorStatuses} from "../modules/actor-statuses.mjs";
import {resolveBodyHealth} from "../modules/rules/body-health.mjs";

const gm = {id: "gm", active: true};
const owner = {id: "owner", active: true};
const users = [gm, owner];
users.activeGM = gm;
globalThis.game = {user: gm, users, actors: [], scenes: [], i18n: {localize: key => key}};
globalThis.foundry = {CONST: {ACTIVE_EFFECT_SHOW_ICON: {ALWAYS: 1}}};
globalThis.CONFIG = {statusEffects: Object.fromEntries([
  ...ACTOR_STATE_STATUSES, {id: "dead", name: "EFFECT.StatusDead", img: "icons/svg/skull.svg"}
].map(status => [status.id, {...status}]))};
const flag = group => ({"trudvang-chronicles": {automaticStatus: group}});
const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

function makeActor({uuid = "Actor.test", type = "character", current = 20, level = "unhurt", fear = 0,
  insane = false, rounds = -1} = {}) {
  const actor = {
    uuid, type, effects: [], calls: [], documentName: "Actor",
    system: {resources: {body: {current, value: current, max: 32}, fear: {current: fear, value: fear}},
      damage: {level, penalty: -3}, fearInsane: insane, survivalRounds: rounds},
    canUserModify: user => [gm.id, owner.id].includes(user.id)
  };
  let counter = 0;
  const makeEffect = data => ({...structuredClone(data), id: data._id ?? `effect${++counter}`, actor,
    _source: structuredClone(data), statuses: new Set(data.statuses),
    // Core prepares an indefinite duration as Infinity, but persists null.
    duration: {...data.duration, value: data.duration?.value ?? Infinity}});
  actor.createEmbeddedDocuments = async (type, data, options) => {
    assert.equal(type, "ActiveEffect");
    assert.equal(options.trudvangStatusSync, true);
    actor.calls.push({kind: "create", data});
    await actor.beforeCreate?.();
    const created = data.map(makeEffect);
    actor.effects.push(...created);
    return created;
  };
  actor.updateEmbeddedDocuments = async (type, data, options) => {
    assert.equal(type, "ActiveEffect");
    assert.equal(options.trudvangStatusSync, true);
    actor.calls.push({kind: "update", data});
    return data.map(change => {
      const effect = actor.effects.find(effect => effect.id === change._id);
      Object.assign(effect, makeEffect({...effect._source, ...change}));
      return effect;
    });
  };
  actor.deleteEmbeddedDocuments = async (type, ids, options) => {
    assert.equal(type, "ActiveEffect");
    assert.equal(options.trudvangStatusSync, true);
    actor.calls.push({kind: "delete", ids});
    actor.effects = actor.effects.filter(effect => !ids.includes(effect.id));
  };
  return actor;
}

const statusIds = actor => actor.effects.flatMap(effect => Array.from(effect.statuses ?? []));

test("Foundry operation mutation cannot leak a token delta into later health or effect writes", async () => {
  const token = makeActor({fear: 12});
  const base = makeActor({fear: 12});
  const operations = [];
  for (const actor of [token, base]) {
    for (const method of ["createEmbeddedDocuments", "updateEmbeddedDocuments", "deleteEmbeddedDocuments"]) {
      const original = actor[method];
      actor[method] = async (type, data, options) => {
        assert.deepEqual(options, {trudvangStatusSync: true}, "each effect write starts with fresh options");
        operations.push(options);
        const result = await original(type, data, options);
        // Core serializes the operation and leaves its parentUuid on this object.
        options.parentUuid = "Scene.scene.Token.token.ActorDelta.delta";
        options.updates = data;
        return result;
      };
    }
  }
  await syncActorStateStatuses(token);
  token.system.resources.fear.current = 25;
  await syncActorStateStatuses(token);
  token.system.resources.fear.current = 0;
  await syncActorStateStatuses(token);
  base._source = {system: {resources: {body: {value: 20, maxAtValue: 0}}}};
  base.bodyHealthState = resolveBodyHealth({value: 20, maximum: 32});
  base.update = async (changes, options) => {
    assert.deepEqual(options, {trudvangStatusSync: true, trudvangHealthSync: true});
    for (const [key, value] of Object.entries(changes)) base._source.system.resources.body[key.split(".").at(-1)] = value;
  };
  await syncActorStateStatuses(base);
  assert.equal(new Set(operations).size, operations.length);
});

test("the elected synchronizer commits health transitions once on application and expiry",async()=>{
 const actor=makeActor();
 actor._source={system:{resources:{body:{value:30,maxAtValue:40,modifierAtValue:0}}}};
 let maximum=45,writes=0;
 const prepare=()=>{
  const body=actor._source.system.resources.body;
  actor.bodyHealthState=resolveBodyHealth({value:body.value,referenceMaximum:body.maxAtValue,referenceModifier:body.modifierAtValue,maximum});
  Object.assign(actor.system.resources.body,{current:actor.bodyHealthState.current,value:actor.bodyHealthState.current,max:maximum});
 };
 actor.update=async(changes,options)=>{
  assert.equal(options.trudvangHealthSync,true);assert.equal(options.trudvangStatusSync,true);
  writes++;
  for(const [key,value]of Object.entries(changes))actor._source.system.resources.body[key.split('.').at(-1)]=value;
  prepare();
 };
 prepare();
 await Promise.all([syncActorStateStatuses(actor),syncActorStateStatuses(actor)]);
 assert.equal(writes,1);assert.equal(actor.system.resources.body.current,35);
 assert.equal(actor._source.system.resources.body.maxAtValue,45);
 maximum=40;prepare();
 await syncActorStateStatuses(actor);
 assert.equal(writes,2);assert.equal(actor.system.resources.body.current,35);
 await syncActorStateStatuses(actor);assert.equal(writes,2);
});

test("initial world synchronization establishes independent unlinked-token baselines before updating their base",async t=>{
 const previous={actors:game.actors,scenes:game.scenes};
 t.after(()=>Object.assign(game,previous));
 const base=makeActor({uuid:"Actor.base"}),token=makeActor({uuid:"Scene.s.Token.t.Actor.base"});
 token.isToken=true;token.token={persisted:true};
 const order=[];
 for(const [actor,maximum]of [[base,40],[token,45]]){
  actor._source={system:{resources:{body:{value:30,maxAtValue:0,modifierAtValue:0}}}};
  actor.bodyHealthState=resolveBodyHealth({value:30,maximum});
  actor.update=async changes=>{
   order.push(actor.uuid);
   for(const [key,value]of Object.entries(changes))actor._source.system.resources.body[key.split('.').at(-1)]=value;
  };
 }
 game.actors=[base];game.scenes=[{tokens:[{actor:token}]}];
 await syncWorldActorStatuses();
 assert.deepEqual(order,[token.uuid,base.uuid]);
 assert.equal(token._source.system.resources.body.maxAtValue,45);
 assert.equal(base._source.system.resources.body.maxAtValue,40);
 assert.equal(token._source.system.resources.body.value,30,"existing health is preserved at initial load");
});

test("base maximum changes heal an injured unlinked token before its inherited reference is replaced",async t=>{
 const previous=globalThis.Hooks;
 t.after(()=>{globalThis.Hooks=previous;});
 const hooks=new Map();globalThis.Hooks={on:(name,fn)=>hooks.set(name,fn),once:()=>{}};
 registerActorStatusHooks();
 const base=makeActor({uuid:"Actor.base"}),child=makeActor({uuid:"Scene.s.Token.t.Actor.base"});
 child.isToken=true;child.token={persisted:true};
 base.getDependentTokens=()=>[{actor:child}];
 for(const [actor,value]of [[base,40],[child,30]])actor._source={system:{resources:{body:{value,maxAtValue:40,modifierAtValue:0}}}};
 let childOwnReference=false;
 const prepare=actor=>{
  const source=actor._source.system.resources.body;
  actor.bodyHealthState=resolveBodyHealth({value:source.value,referenceMaximum:source.maxAtValue,referenceModifier:0,maximum:45});
  Object.assign(actor.system.resources.body,{current:actor.bodyHealthState.current,value:actor.bodyHealthState.current,max:45});
 };
 for(const actor of [base,child])actor.update=async changes=>{
  if(actor===child)childOwnReference=true;
  for(const [key,value]of Object.entries(changes))actor._source.system.resources.body[key.split('.').at(-1)]=value;
  if(actor===base&&!childOwnReference)child._source.system.resources.body.maxAtValue=actor._source.system.resources.body.maxAtValue;
  prepare(base);prepare(child);
 };
 prepare(base);prepare(child);
 await hooks.get("updateActor")(base,{},{});
 assert.equal(base.system.resources.body.current,45);
 assert.equal(child.system.resources.body.current,35);
 assert.equal(child._source.system.resources.body.maxAtValue,45);
});

test("automatic definitions use localized names, distinct shipped icons, and no numerical changes", () => {
  assert.equal(ACTOR_STATE_STATUSES.length, 12);
  assert.equal(new Set(ACTOR_STATE_STATUSES.map(status => status.id)).size, 12);
  assert.equal(new Set(ACTOR_STATE_STATUSES.map(status => status.img)).size, 12);
  for (const status of ACTOR_STATE_STATUSES) {
    assert.equal(status.hud, status.id === "trudvang-sacrilege", "only Sacrilege is a new manual shortcut");
    assert.ok(!status.system && !status.changes, "state definitions cannot apply the existing malus twice");
    assert.ok(existsSync(new URL(`../${status.img.replace("systems/trudvang-chronicles/", "")}`, import.meta.url)));
    for (const locale of ["fr", "en"]) {
      const strings = JSON.parse(readFileSync(new URL(`../lang/${locale}.json`, import.meta.url)));
      assert.equal(typeof get(strings, status.name), "string", `${locale}: ${status.name}`);
    }
  }
});

test("health markers match every prepared wound tier, dying and expired survival, never healthy actors", () => {
  for (const level of ["light", "injured", "serious", "critical"]) {
    assert.deepEqual(actorStateStatuses(makeActor({current: 4, level})),
      [{group: "health", id: `trudvang-wound-${level}`}]);
  }
  for (const current of [0, -1, -1000]) {
    for (const rounds of [-1, 1, 6]) assert.deepEqual(actorStateStatuses(makeActor({current, rounds})),
      [{group: "health", id: "trudvang-wound-dying"}]);
    assert.deepEqual(actorStateStatuses(makeActor({current, rounds: 0})), [{group: "health", id: "dead"}]);
  }
  assert.deepEqual(actorStateStatuses(makeActor({current: 32, rounds: 0})), [], "positive health cannot be dead");
  assert.deepEqual(actorStateStatuses(makeActor({type: "npc", current: 4, level: "serious"})),
    [{group: "health", id: "trudvang-wound-serious"}], "NPCs, including Tenace, retain their injury state without extra penalties");
  assert.deepEqual(actorStateStatuses({type: "vehicle", system: {}}), []);
});

test("fear markers use the shared thresholds and preserve the existing madness hysteresis", () => {
  const examples = [[0, null], [1, "one"], [10, "one"], [11, "two"], [20, "two"], [21, "three"],
    [30, "three"], [31, "four"], [40, "four"], [41, "five"], [50, "five"], [51, "mad"], [100000, "mad"]];
  for (const [fear, level] of examples) assert.deepEqual(actorStateStatuses(makeActor({fear})),
    level ? [{group: "fear", id: `trudvang-fear-${level}`}] : [], `fear=${fear}`);
  assert.deepEqual(actorStateStatuses(makeActor({fear: 44, insane: true})), [{group: "fear", id: "trudvang-fear-mad"}]);
  assert.deepEqual(actorStateStatuses(makeActor({fear: 40, insane: true})), [{group: "fear", id: "trudvang-fear-four"}]);
});

test("state updates keep only one marker per group and leave resources, maluses and manual effects untouched", async () => {
  const actor = makeActor({current: 12, level: "serious", fear: 21});
  const manual = {id: "manual", name: "Custom effect", statuses: new Set(["poison", "trudvang-sacrilege"]),
    flags: {}, system: {changes: [{key: "system.modifiers.protection", type: "add", value: "2"}]}};
  actor.effects.push(manual);
  const before = structuredClone(actor.system);
  assert.equal(await syncActorStateStatuses(actor), true);
  assert.equal(actor.effects.length, 3);
  assert.deepEqual(actor.system, before, "markers never alter health, fear or already-calculated penalties");
  assert.ok(actor.effects.includes(manual));
  for (const marker of actor.effects.filter(effect => effect !== manual)) {
    assert.deepEqual(marker.system.changes, []);
    assert.equal(marker.disabled, false);
    assert.equal(marker.transfer, false);
    assert.equal(marker.showIcon, foundry.CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS, "indefinite markers must render on tokens");
  }
  assert.equal(await syncActorStateStatuses(actor), false, "unchanged state must not produce another update");
  const firstMarker = actor.effects.find(effect => effect.flags?.["trudvang-chronicles"]?.automaticStatus === "health");
  actor.system.damage.level = "injured";
  actor.system.resources.fear.current = 11;
  await syncActorStateStatuses(actor);
  assert.equal(actor.effects.length, 3);
  assert.equal(actor.effects.find(effect => effect.id === firstMarker.id).statuses.has("trudvang-wound-injured"), true);
  actor.system.damage.level = "unhurt";
  actor.system.resources.body.current = 32;
  actor.system.resources.fear.current = 0;
  await syncActorStateStatuses(actor);
  assert.deepEqual(actor.effects, [manual], "recovery removes only the automatic markers");
});

test("death replaces dying at survival zero and healing removes automatic death without deleting manual death", async () => {
  const actor = makeActor({current: -7});
  await syncActorStateStatuses(actor);
  assert.deepEqual(statusIds(actor), ["trudvang-wound-dying"]);
  actor.system.survivalRounds = 0;
  await syncActorStateStatuses(actor);
  assert.deepEqual(statusIds(actor), ["dead"]);
  const manual = {id: "manual-death", statuses: new Set(["dead"]), flags: {}};
  actor.effects.push(manual);
  actor.system.resources.body.current = 1;
  actor.system.damage.level = "critical";
  await syncActorStateStatuses(actor);
  assert.ok(statusIds(actor).includes("trudvang-wound-critical"));
  assert.ok(actor.effects.includes(manual));
  assert.equal(actor.effects.filter(effect => effect.statuses.has("dead")).length, 1, "only the manual death remains");
});

test("concurrent updates reread the latest state instead of duplicating or retaining a stale marker", async () => {
  const actor = makeActor({level: "serious", current: 10});
  let enter, release;
  const entered = new Promise(resolve => { enter = resolve; });
  const barrier = new Promise(resolve => { release = resolve; });
  actor.beforeCreate = async () => { enter(); await barrier; };
  const first = syncActorStateStatuses(actor);
  await entered;
  actor.system.damage.level = "light";
  actor.system.resources.body.current = 25;
  const second = syncActorStateStatuses(actor);
  release();
  await Promise.all([first, second]);
  assert.deepEqual(statusIds(actor), ["trudvang-wound-light"]);
  assert.equal(actor.effects.length, 1);
});

test("failed synchronization can be retried, and malformed or duplicated managed markers are repaired", async () => {
  const actor = makeActor({level: "injured"});
  actor.beforeCreate = async () => { throw new Error("network failure"); };
  await assert.rejects(syncActorStateStatuses(actor), /network failure/);
  delete actor.beforeCreate;
  await syncActorStateStatuses(actor);
  const marker = actor.effects[0];
  marker.disabled = true;
  marker.system.changes = [{key: "system.modifiers.bodyValue", type: "add", value: "-5"}];
  actor.effects.push({...marker, id: "duplicate", flags: flag("health")});
  await syncActorStateStatuses(actor);
  assert.equal(actor.effects.length, 1);
  assert.equal(actor.effects[0].disabled, false);
  assert.deepEqual(actor.effects[0].system.changes, []);
  assert.equal(await syncActorStateStatuses(actor), false);
});

test("one active GM writes statuses; without a GM one active owner is elected; compendiums are untouched", async () => {
  const actor = makeActor({level: "injured"});
  try {
    game.user = owner;
    assert.equal(await syncActorStateStatuses(actor), false);
    users.activeGM = null;
    gm.active = false;
    assert.equal(await syncActorStateStatuses(actor), true);
    actor.inCompendium = true;
    actor.system.damage.level = "serious";
    assert.equal(await syncActorStateStatuses(actor), false);
    actor.inCompendium = false;
    actor.persisted = false;
    assert.equal(await syncActorStateStatuses(actor), false);
    game.user = {id: "spectator", active: true};
    assert.equal(await syncActorStateStatuses(actor), false);
  } finally { game.user = gm; gm.active = true; users.activeGM = gm; }
});

test("world synchronization covers independent NPC tokens on inactive scenes and deduplicates linked actors", async () => {
  const base = makeActor({uuid: "Actor.base", type: "npc"});
  const injured = makeActor({uuid: "Scene.one.Token.one.Actor.base", type: "npc", current: -2});
  const frightened = makeActor({uuid: "Scene.two.Token.two.Actor.base", type: "npc", fear: 32});
  try {
    game.actors = [base];
    game.scenes = [{tokens: [{actor: base}, {actor: injured}]}, {tokens: [{actor: frightened}, {actor: base}]}];
    await syncWorldActorStatuses();
    assert.deepEqual(base.effects, []);
    assert.deepEqual(statusIds(injured), ["trudvang-wound-dying"]);
    assert.deepEqual(statusIds(frightened), ["trudvang-fear-four"]);
  } finally { game.actors = []; game.scenes = []; }
});

test("a persisted token can synchronize its synthetic actor, but unsaved previews cannot write statuses", async () => {
  const actor = makeActor({type: "npc", current: -1});
  actor.isToken = true;
  actor.persisted = false;
  actor.token = {persisted: true};
  assert.equal(await syncActorStateStatuses(actor), true);
  assert.deepEqual(statusIds(actor), ["trudvang-wound-dying"]);
  actor.token.persisted = false;
  actor.system.survivalRounds = 0;
  assert.equal(await syncActorStateStatuses(actor), false);
});

test("lifecycle hooks cover resource, equipment, effect and token changes without reacting to their own writes", async () => {
  const callbacks = new Map();
  globalThis.Hooks = {on: (event, callback) => callbacks.set(event, callback), once: (event, callback) => callbacks.set(event, callback)};
  registerActorStatusHooks();
  for (const event of ["createActor", "updateActor", "createItem", "updateItem", "deleteItem", "createActiveEffect",
    "updateActiveEffect", "deleteActiveEffect", "createToken", "updateToken", "ready", "canvasReady"]) {
    assert.equal(typeof callbacks.get(event), "function", event);
  }
  const actor = makeActor({level: "injured"});
  await callbacks.get("updateActor")(actor, {}, {trudvangStatusSync: true});
  assert.equal(actor.calls.length, 0);
  await callbacks.get("createActiveEffect")({actor}, {});
  assert.deepEqual(statusIds(actor), ["trudvang-wound-injured"]);
  actor.system.damage.level = "serious";
  await callbacks.get("updateItem")({actor}, {system: {equipped: false}}, {});
  assert.deepEqual(statusIds(actor), ["trudvang-wound-serious"]);
  actor.system.damage.level = "critical";
  await callbacks.get("updateToken")({actor}, {delta: {}}, {});
  assert.deepEqual(statusIds(actor), ["trudvang-wound-critical"]);
  const calls = actor.calls.length;
  await callbacks.get("updateToken")({actor}, {x: 30}, {});
  assert.equal(actor.calls.length, calls, "ordinary token movement needs no status write");
  actor.system.damage.level = "light";
  await callbacks.get("canvasReady")({tokens: {placeables: [{actor}]}});
  assert.deepEqual(statusIds(actor), ["trudvang-wound-light"]);
});

test("base actor and equipment hooks also synchronize unlinked dependents, even after automatic inherited effects change", async () => {
  const callbacks = new Map();
  globalThis.Hooks = {on: (event, callback) => callbacks.set(event, callback), once: (event, callback) => callbacks.set(event, callback)};
  registerActorStatusHooks();
  const base = makeActor({uuid: "Actor.base", type: "npc"});
  const tokenActor = makeActor({uuid: "Scene.one.Token.one.Actor.base", type: "npc", current: 12, level: "serious"});
  tokenActor.isToken = true;
  base.getDependentTokens = ({concreteOnly}) => {
    assert.equal(concreteOnly, true);
    return [{actor: base}, {actor: tokenActor}, {actor: tokenActor}];
  };
  await callbacks.get("updateActor")(base, {system: {}}, {});
  assert.deepEqual(statusIds(tokenActor), ["trudvang-wound-serious"]);
  assert.deepEqual(base.effects, []);
  tokenActor.system.damage.level = "injured";
  await callbacks.get("updateActiveEffect")({actor: base}, {}, {trudvangStatusSync: true});
  assert.deepEqual(statusIds(tokenActor), ["trudvang-wound-injured"]);
  tokenActor.system.damage.level = "light";
  await callbacks.get("updateItem")({actor: base}, {system: {}}, {});
  assert.deepEqual(statusIds(tokenActor), ["trudvang-wound-light"]);
});


test("the elected synchronizer persists shared temporary health and maximum changes once",async()=>{
 const {temporaryHealthState,temporaryHealthUpdate}=await import("../modules/rules/transformation-profile.mjs");
 const actor=makeActor({current:32});
 actor._source={system:{resources:{body:{value:32,temporary:0,temporaryMax:0,temporaryMaxAtValue:-1}}}};
 const first={id:"grant5",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"5"}]}},second={id:"grant7",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"7"}]}};
 const grants=[first];actor.allApplicableEffects=()=>grants;
 let writes=0;
 const prepare=()=>{actor.temporaryHealthState=temporaryHealthState(actor);actor.system.resources.body.temporary=actor.temporaryHealthState.current;};
 actor.update=async changes=>{writes++;for(const [key,value]of Object.entries(changes))actor._source.system.resources.body[key.split(".").at(-1)]=value;prepare();};
 prepare();await syncActorStateStatuses(actor);assert.equal(actor.system.resources.body.temporary,5);
 grants.push(second);prepare();await syncActorStateStatuses(actor);assert.equal(actor.system.resources.body.temporary,12);
 await actor.update(temporaryHealthUpdate(actor,9));
 grants.shift();prepare();await syncActorStateStatuses(actor);assert.equal(actor.system.resources.body.temporary,7);
 assert.equal(actor._source.system.resources.body.temporaryMaxAtValue,7);
 const before=writes;await syncActorStateStatuses(actor);assert.equal(writes,before);
 await actor.update(temporaryHealthUpdate(actor,3));grants.length=0;prepare();await syncActorStateStatuses(actor);
 assert.equal(actor.system.resources.body.temporary,0);
});
