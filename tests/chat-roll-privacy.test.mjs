
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {animateMaskedNpcRolls, animateNpcRollDetails, createActorRollMessage, renderRollCard, recordedRoll, recordedRollFlag} from "../modules/chat-roll-privacy.mjs";

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
  user:gm, users:new Map([gm,owner,observer].map(user=>[user.id,user])), messages,
  dice3d:{showForRoll:(...args)=>animations.push(args)}
};
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

  const details = messages.get(card.flags[scope].npcRoll.detailId);
  assert.deepEqual(details.whisper,[gm.id]);
  assert.equal(details.blind,true);
  assert.match(details.content,/Hidden modifier/);
  assert.equal(recordedRoll(card).total,5);
  assert.equal(recordedRollFlag(card,"rollOutcome").target,19);
  assert.deepEqual(recordedRollFlag(card,"conditionalDamage"),[{damage:3,tag:"troll"}]);

  game.user = observer;
  assert.equal(recordedRoll(card),null);
  assert.deepEqual(recordedRollFlag(card,"rollOutcome"),{success:true});
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
