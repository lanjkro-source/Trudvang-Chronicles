import {NPC_ROLL_PACK,registerNpcRollQueries,storeNpcRollRecord,updateNpcRollRecord} from "../modules/npc-roll-records.mjs";
import {renderNpcRollControls} from "../modules/npc-roll-chat.mjs";
import {mockNpcRollPack} from "./support/npc-roll-pack.mjs";

import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {animateMaskedNpcRolls, animateNpcRollDetails, createActorRollMessage, renderRollCard, readNpcRollDetails, recordedRoll, recordedRollFlag} from "../modules/chat-roll-privacy.mjs";

const scope = "trudvang-chronicles";
const gm = {id:"gm", isGM:true};
const owner = {id:"owner", isGM:false};
const observer = {id:"observer", isGM:false};
const actor = {type:"npc", uuid:"Actor.npc", testUserPermission:user=>user.id===owner.id};
const character = {type:"character", uuid:"Actor.character"};
const messages = new Map();
const animations = [];

Handlebars.registerHelper("localize", key=>key);
Handlebars.registerHelper("eq", (left,right)=>left===right);
globalThis.foundry = {
  applications:{handlebars:{renderTemplate:(path, view)=>Handlebars.compile(
    readFileSync(path.replace("systems/trudvang-chronicles/",""),"utf8")
  )(view)}},
  utils:{fromUuidSync:uuid=>uuid===actor.uuid?actor:null}
};
globalThis.game = {
  user:gm, users:new Map([gm,owner,observer].map(user=>[user.id,user])), messages, i18n:{localize:key=>key},
  dice3d:{showForRoll:(...args)=>animations.push(args)}
};
const records = mockNpcRollPack(game);
globalThis.Roll = class {
  static fromData(data) { return {...data}; }
  constructor(formula) { this.formula = formula; }
  async evaluate(options) {
    assert.deepEqual(options,{minimize:true,allowInteractive:false});
    return this;
  }
};
globalThis.ChatMessage = {create:async data=>{
  const message = {...data,id:String(messages.size+1)};
  messages.set(message.id,message);
  return message;
}};

const {canUseChatAction} = await import("../modules/chat-card-permissions.mjs");

test("only the NPC result and operational controls are included in the public record", async () => {
  const row = {name:"Adversaire",actorUuid:character.uuid,success:true,target:19,outcomeMargin:"+14"};
  const view = {kind:"attack",success:true,result:5,target:19,flavor:"Hidden modifier",
    actorUuid:actor.uuid,itemUuid:"Actor.npc.Item.sword",attackTargets:[row]};
  const roll = {dice:[{faces:20,results:[{result:5}]}],toJSON:()=>({formula:"1d20",total:5})};
  const card = await createActorRollMessage(actor,{
    content:await renderRollCard("roll-card",view),rolls:[roll],
    flags:{[scope]:{attackTargets:[row],rollOutcome:{result:5,target:19,margin:14,success:true},
      conditionalDamage:[{damage:3,tag:"troll"}]}}
  },{resultContent:await renderRollCard("roll-card",view,{resultOnly:true})});

  assert.match(card.content,/Adversaire.*TRUDVANG.Roll.Success/);
  assert.match(card.content,/data-action="damage"/);
  assert.doesNotMatch(card.content,/roll-result|Hidden modifier|[+]14|19/);
  assert.deepEqual(card.rolls,[]);
  assert.deepEqual(card.flags[scope].rollOutcome,{success:true});
  assert.equal(card.flags[scope].attackTargets[0].target,undefined);
  assert.equal(card.flags[scope].conditionalDamage,undefined);
  assert.equal(card.flags["dice-so-nice"].skip,true);

  const details = records.get(card.flags[scope].npcRoll.detailId);
  assert.equal(messages.size,1);
  assert.equal(records.size,1);
  assert.match((await readNpcRollDetails(details.id)).content,/Hidden modifier/);
  assert.equal((await recordedRoll(card)).total,5);
  assert.equal((await recordedRollFlag(card,"rollOutcome")).target,19);
  assert.deepEqual(await recordedRollFlag(card,"conditionalDamage"),[{damage:3,tag:"troll"}]);

  game.user = observer;
  assert.equal(await recordedRoll(card),null);
  assert.equal(await readNpcRollDetails(details.id),null);
  assert.deepEqual(await recordedRollFlag(card,"rollOutcome"),{success:true});
  animateNpcRollDetails(details);
  await Promise.resolve();
  assert.equal(animations.length,1);
  assert.deepEqual([{...animations[0][0]},...animations[0].slice(1)],[{formula:"1d20"},gm,true,[owner.id,observer.id],true,null,null,{ghost:true}]);
  game.user = gm;
  animateNpcRollDetails(details);
  await Promise.resolve();
  assert.deepEqual(animations.slice(1),[[{formula:"1d20",total:5},gm,false]]);
});

test("an NPC roller sees their own masked animation and only dice shapes and counts are shared",async t=>{
  game.user = owner;
  const offline = {id:"offline",active:false};
  game.users.set(offline.id,offline);
  t.after(()=>{ game.user = gm; game.users.delete(offline.id); });
  const dice = [{faces:10,results:[{result:10},{result:2},{result:9,hidden:true}]}];
  const rolls = [{dice,formula:"1d10x10 + 8",total:20},{dice:[{faces:4,results:[{result:3}]}]}];
  await animateMaskedNpcRolls(rolls);
  const [masked,...options] = animations.at(-1);
  assert.deepEqual([{...masked},...options],[{formula:"2d10 + 1d4"},owner,true,[owner.id,observer.id],false,null,null,{ghost:true}]);
  const count = animations.length;
  await animateMaskedNpcRolls([{dice:[],total:8}]);
  assert.equal(animations.length,count);
});

test("PC cards preserve detailed content and native dice", async () => {
  const data = {content:"Die, VC and margin",rolls:[{formula:"1d20",total:5}]};
  const card = await createActorRollMessage(character,data);
  assert.equal(card.content,data.content);
  assert.equal(card.rolls,data.rolls);
  assert.equal(card.whisper,undefined);
  assert.equal(card.flags,undefined);
});

test("only authorised recipients have controls for NPC damage and resistance", () => {
  const message = {flags:{[scope]:{npcRoll:{detailId:"private"}}}};
  const attack = {dataset:{action:"damage",actorUuid:actor.uuid}};
  const resistance = {dataset:{action:"resist-damage",targetActorUuid:actor.uuid}};
  for (const control of [attack,resistance]) {
    assert.equal(canUseChatAction(message,control,gm),true);
    assert.equal(canUseChatAction(message,control,owner),true);
    assert.equal(canUseChatAction(message,control,observer),false);
  }
  const privateMessage = {flags:{[scope]:{npcRollDetails:{}}}};
  assert.equal(canUseChatAction(privateMessage,attack,gm),false);
});

test("only the GM gets a Details control on the card and on each NPC response row", t=>{
  const previous=globalThis.document;
  t.after(()=>{globalThis.document=previous;game.user=gm;});
  const slot = ()=>({buttons:[],append(button){this.buttons.push(button);}});
  const card = slot(), row = slot(), another = slot();
  const marker=(id,target)=>({dataset:{npcRollDetails:id},closest:()=>target,remove(){}});
  const html={querySelector:()=>card,querySelectorAll:()=>[marker("roll1",row),marker("roll2",row),marker("roll3",another)]};
  globalThis.document={createElement:()=>({addEventListener(){}})};
  const message={flags:{[scope]:{npcRoll:{detailId:"baseRoll"}}}};
  game.user=observer;
  renderNpcRollControls(message,html);
  assert.deepEqual([card,row,another].map(line=>line.buttons.length),[0,0,0]);
  game.user=gm;
  renderNpcRollControls(message,html);
  assert.deepEqual([card,row,another].map(line=>line.buttons.length),[1,1,1]);
  assert.equal(row.buttons[0].textContent,"TRUDVANG.Tab.Details");
});

test("the first private record provisions one private archive and a player can submit through the active GM", async t=>{
  const previous={packs:game.packs,config:globalThis.CONFIG,documents:foundry.documents};
  t.after(()=>{game.packs=previous.packs;globalThis.CONFIG=previous.config;foundry.documents=previous.documents;delete gm.query;delete game.users.activeGM;game.user=gm;});
  game.packs = new Map();
  globalThis.CONFIG={queries:{}};
  let creations=0,archive;
  foundry.documents={collections:{CompendiumCollection:{async createCompendium(metadata){
    creations++;
    assert.equal(metadata.type,"JournalEntry");
    assert.equal("world."+metadata.name,NPC_ROLL_PACK);
    assert.equal(metadata.ownership.PLAYER,"NONE");
    assert.equal(metadata.ownership.TRUSTED,"NONE");
    archive=mockNpcRollPack(game);
    return game.packs.get(NPC_ROLL_PACK);
  }}}};
  registerNpcRollQueries();
  const [first,second]=await Promise.all(["first","second"].map(content=>storeNpcRollRecord(content,{flags:{},rollData:[]})));
  assert.equal(creations,1);
  assert.ok(archive.has(first)&&archive.has(second));
  game.users.activeGM=gm;
  gm.query=async (name,request)=>{
    game.user=gm;
    try {return await CONFIG.queries[name](structuredClone(request));}
    finally { game.user=owner; }
  };
  game.user=owner;
  const remote=await storeNpcRollRecord("private",{flags:{},rollData:[{formula:"1d20",total:7}]});
  assert.equal(await readNpcRollDetails(remote),null);
  await updateNpcRollRecord(remote,"new detail",{verified:true});
  const query=Object.values(CONFIG.queries)[0];
  assert.equal(await gm.query(Object.keys(CONFIG.queries)[0],{id:remote,content:"altered",data:{flags:{}},key:crypto.randomUUID()}),null);
  assert.equal(await query({content:"wrong client",data:{rollData:[]},key:crypto.randomUUID()}),null);
  game.user=gm;
  assert.equal((await readNpcRollDetails(remote)).content,"new detail");
  assert.equal((await readNpcRollDetails(remote)).rollData[0].total,7);
});

test("the NPC details dialog shows the archived threshold without a redundant toggle", async t=>{
  const previousDocument = globalThis.document;
  const previousApi = foundry.applications.api;
  t.after(()=>{globalThis.document=previousDocument;foundry.applications.api=previousApi;});
  const content = await renderRollCard("roll-card",{result:6,target:18,success:true,outcomeMargin:"+12"});
  const detailId = await storeNpcRollRecord(content,{flags:{},rollData:[]});
  let threshold,archivedContent,click,dialogContent;
  const targetButton = {
    textContent:"18",
    matches:selector=>selector==="button" || selector==='button.target[data-action="toggle-roll-details"]',
    replaceWith:span=>{threshold=span;},
    remove:()=>{threshold=null;}
  };
  const fragment = {querySelectorAll:selector=>selector==="*"?[targetButton]:[]};
  globalThis.document={createElement(tag){
    if (tag==="button") return {addEventListener:(_event,handler)=>{click=handler;}};
    if (tag==="span") return {tag};
    if (tag==="template") return {content:fragment,set innerHTML(html){archivedContent=html;}};
    return {append(){},get innerHTML(){return threshold?.textContent ?? "";}};
  }};
  foundry.applications.api={DialogV2:class {
    constructor(options){dialogContent=options.content;}
    render(){}
  }};
  const card={append(){}};
  renderNpcRollControls({flags:{[scope]:{npcRoll:{detailId}}}},{querySelector:()=>card,querySelectorAll:()=>[]});
  await click();
  assert.match(archivedContent,/class="die">6<.*class="target roll-detail-toggle"[^>]+>18</);
  assert.deepEqual(threshold,{tag:"span",className:"target",textContent:"18"});
  assert.equal(dialogContent,"18");
});
