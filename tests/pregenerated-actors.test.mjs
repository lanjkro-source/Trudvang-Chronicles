import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {PREGENERATED_ACTORS} from "../modules/pregenerated-actor-data.mjs";
import {installPregeneratedActors, pregeneratedActorPayload} from "../modules/pregenerated-actors.mjs";
globalThis.foundry ??= {};
const {applyRandomTokenName, migrateImportedTokenNameDefaults, tokenNameCulture} = await import("../modules/token-names.mjs");

const read = file => JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
const starter = read("../data/starter-content.json");
const scope = "trudvang-chronicles";
const equipment = new Map(starter.items.map(item => [item.nameKey, item]));

function runtime(t, language) {
  const dictionary = read(`../lang/${language}.json`);
  const localize = key => key.split(".").reduce((value, part) => value?.[part], dictionary) ?? key;
  const format = (key, data) => localize(key).replace(/\{(\w+)\}/g, (part, field) => data[field] ?? part);
  function localizeTree(value) {
    if (Array.isArray(value)) return value.map(localizeTree);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) =>
      key.endsWith("Key") ? [key.slice(0,-3), localize(child)] : [key, localizeTree(child)]));
  }
  let nextId = 0;
  const randomID = () => String(++nextId).padStart(16,"0");
  const previous = {game:globalThis.game, foundry:globalThis.foundry, Actor:globalThis.Actor};
  t.after(() => Object.assign(globalThis, previous));
  globalThis.game = {actors:[], i18n:{lang:language, localize, has:key=>localize(key)!==key, format}};
  globalThis.foundry = {utils:{randomID}};
  return {localize, localizeTree, format, randomID, folder:"npcs"};
}

for (const language of ["fr","en"]) test(`all fourteen profiles resolve in ${language} with valid embedded gear links`, t => {
  const options = runtime(t, language);
  const records = PREGENERATED_ACTORS.map(profile => pregeneratedActorPayload(profile,equipment,options));
  assert.equal(records.length,14);
  assert.equal(new Set(records.map(actor=>actor.flags[scope].starterId)).size,14);
  for (const [index, actor] of records.entries()) {
    const profile = PREGENERATED_ACTORS[index];
    assert.equal(actor.system.details.source.page,profile.page);
    assert.equal(actor.system.resources.body.max,profile.hp);
    assert.equal(actor.system.details.move[0].max,`${profile.move} m`);
    assert.equal(actor.folder,"npcs");
    assert.equal(actor.prototypeToken.actorLink,false);
    assert.equal(actor.prototypeToken.flags[scope].randomName,true);
    const byId = new Map(actor.items.map(item=>[item._id,item]));
    for (const action of actor.system.attacks.flat()) assert.equal(byId.get(action.itemId)?.name,action.attack);
    for (const item of actor.items) assert.doesNotMatch(item.name,/TRUDVANG\./);
    for (const tablet of actor.items.filter(item=>item.type==="tablet")) {
      const powers = actor.items.filter(item=>item.system.tabletId===tablet.system.catalogId);
      assert.ok(powers.length);
      assert.ok(powers.every(item=>item.system.level<=tablet.system.level));
    }
  }
  assert.equal(starter.folders.bestiary.colorRole,"red");
});

test("installing starter NPCs twice keeps existing modified sheets and planned equipment IDs", async t => {
  const options = runtime(t, "fr");
  globalThis.Actor = {async createDocuments(records, creationOptions) {
    assert.equal(creationOptions.keepEmbeddedIds,true);
    game.actors.push(...records.map(actor=>({...actor, getFlag:(scope,key)=>actor.flags[scope]?.[key]})));
  }};
  assert.equal(await installPregeneratedActors(starter.items,{id:"npcs"},options.localizeTree),14);
  game.actors[0].name="Custom actor";
  assert.equal(await installPregeneratedActors(starter.items,{id:"npcs"},options.localizeTree),0);
  assert.equal(game.actors[0].name,"Custom actor");
});

test("prototype names recognize troll tags and cultures and preserve core decorations", t => {
  runtime(t, "fr");
  const tables = starter.tables.filter(table=>table.flags[scope]?.nameTable);
  tables.get = () => undefined;
  game.tables = tables;
  t.mock.method(Math,"random",()=>0);
  const troll = {name:"Troll gris",system:{tags:["troll"]},prototypeToken:{name:"Troll gris",flags:{[scope]:{randomName:true}}}};
  const token = {name:"Grincheux Troll gris 3",updateSource(data){Object.assign(this,data);}};
  assert.equal(tokenNameCulture(troll),"troll");
  assert.equal(applyRandomTokenName(troll,token,{}).name,"Grincheux Aa 3");
  const next = {...token, name:"Troll gris"};
  assert.equal(applyRandomTokenName(troll,next,{},{tokens:[{name:"Aa"},{name:"Aa 2"}]}).name,"Aa 3");
  assert.equal(applyRandomTokenName(troll,{name:"Spécimen"},{name:"Spécimen"}).name,"Spécimen");
  const human = {...troll,system:{details:{culture:"stormlander"}}};
  human.prototypeToken = {name:"Garde",flags:{[scope]:{randomName:true,nameGender:"female"}}};
  assert.equal(applyRandomTokenName(human,{...token,name:"Garde"},{}).name,"Asa");
  assert.equal(tokenNameCulture({system:{details:{culture:"korpikalli"}}}),"elf");
  assert.equal(tokenNameCulture({system:{details:{race:"zlodd"}}}),"dwarf");
});

test("only previously imported profiles and trolls without a naming preference receive the default", async t => {
  runtime(t, "fr");
  const actor = (id, prototypeFlags, ids) => ({id, type:"npc", prototypeToken:{flags:{[scope]:prototypeFlags}},
    getFlag:(_scope,key)=>ids[key]});
  const trollId = "2HYRncE9EaGbHcId";
  game.actors = [
    actor("pregen", {}, {starterId:"pregen-novice-bard"}),
    actor("troll", {}, {bestiaryId:trollId}),
    actor("disabled", {randomName:false}, {bestiaryId:trollId}),
    actor("custom", {}, {})
  ];
  let updates;
  globalThis.Actor = {async updateDocuments(changes){updates=changes;}};
  await migrateImportedTokenNameDefaults();
  const path = `prototypeToken.flags.${scope}`;
  assert.deepEqual(updates, [
    {_id:"pregen", [`${path}.randomName`]:true},
    {_id:"troll", [`${path}.randomName`]:true, [`${path}.nameCulture`]:"troll"}
  ]);
});
