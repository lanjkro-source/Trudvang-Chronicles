import test from "node:test";
import assert from "node:assert/strict";
import {reconcileMaintainedSpell, endMaintainedSpellOnGM, registerMaintainedSpellTracking} from "../modules/maintained-spell-tracking.mjs";

test("the GM records independent effect UUIDs and retains the fact that effects existed", async () => {
 const old = globalThis.game;
 try {
  const item = {id:"spell",type:"spell",system:{spellType:"lasting"}};
  const caster = {uuid:"Actor.caster",items:[item],system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:"first",itemId:"spell"},{id:"second",itemId:"spell"}]},
   canUserModify:()=>true,async update(changed){this.system.activeSpellCastings=changed["system.activeSpellCastings"];}};
  const target = {uuid:"Scene.s.Token.t.Actor.synthetic",effects:[]};
  const effect = (id,castingId) => ({uuid:`${target.uuid}.ActiveEffect.${id}`,flags:{"trudvang-chronicles":{transformation:{ruleTestContext:{casterUuid:caster.uuid,castingId}}}}});
  globalThis.game={user:{id:"gm"},users:{activeGM:{isSelf:true}},actors:[caster],scenes:[{tokens:[{actor:target}]}]};
  target.effects.push(effect("a","first"),effect("b","second"));
  assert.equal(await reconcileMaintainedSpell(caster,"first"),true);
  assert.deepEqual(caster.system.activeSpellCastings[0].effectUuids,[target.effects[0].uuid]);
  assert.equal(caster.system.activeSpellCastings[0].effectsApplied,true);
  assert.equal(caster.system.activeSpellCastings[1].effectsApplied,false);
  assert.equal(await reconcileMaintainedSpell(caster,"first"),false);
  target.effects.shift();
  assert.equal(await reconcileMaintainedSpell(caster,"first"),true);
  assert.deepEqual(caster.system.activeSpellCastings[0].effectUuids,[]);
  assert.equal(caster.system.activeSpellCastings[0].effectsApplied,true);
  assert.equal(caster.system.activeSpellCastings.length,2,"record is not prematurely deleted");
  assert.equal(await reconcileMaintainedSpell(caster,"first",{removed:true}),true);
  assert.deepEqual(caster.system.activeSpellCastings.map(row=>row.id),["second"]);
  assert.equal(await reconcileMaintainedSpell(caster,"second",{removed:true}),true,"remaining effect is registered, not removed");
  assert.equal(caster.system.activeSpellCastings[0].id,"second");
  game.users.activeGM.isSelf=false;
  assert.equal(await reconcileMaintainedSpell(caster,"second"),false);
 } finally {globalThis.game=old;}
});

test("actual effect hooks keep a casting until the last target's effect is deleted", async () => {
 const old={game:globalThis.game,foundry:globalThis.foundry,Hooks:globalThis.Hooks};
 try {
  const handlers={};globalThis.Hooks={on:(name,fn)=>{handlers[name]=fn;}};
  const item={id:"spell",type:"spell",system:{spellType:"lasting"}};
  const caster={uuid:"Actor.caster",items:[item],system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:"cast",itemId:"spell"}]},
   canUserModify:()=>true,async update(changed){this.system.activeSpellCastings=changed["system.activeSpellCastings"];}};
  const target={uuid:"Actor.target",documentName:"Actor",effects:[]};
  const effect=id=>({uuid:`Actor.target.ActiveEffect.${id}`,parent:target,flags:{"trudvang-chronicles":{transformation:{ruleTestContext:{casterUuid:caster.uuid,castingId:"cast"}}}}});
  const first=effect("one"),second=effect("two");target.effects.push(first,second);
  globalThis.game={user:{id:"gm"},users:{activeGM:{isSelf:true}},actors:[caster,target],scenes:[]};
  globalThis.foundry={utils:{fromUuid:async uuid=>uuid===caster.uuid?caster:null}};
  registerMaintainedSpellTracking();handlers.createActiveEffect(first);handlers.createActiveEffect(second);
  const flush=async()=>{for(let i=0;i<5;i++)await new Promise(resolve=>setImmediate(resolve));};
  await flush();assert.equal(caster.system.activeSpellCastings[0].effectUuids.length,2);
  target.effects=[second];handlers.deleteActiveEffect(first);await flush();
  assert.equal(caster.system.activeSpellCastings.length,1);assert.deepEqual(caster.system.activeSpellCastings[0].effectUuids,[second.uuid]);
  target.effects=[];handlers.deleteActiveEffect(second);await flush();assert.equal(caster.system.activeSpellCastings.length,0);
 } finally {globalThis.game=old.game;globalThis.foundry=old.foundry;globalThis.Hooks=old.Hooks;}
});

test("ending one casting removes its effects on multiple actors without touching another casting", async () => {
 const old={game:globalThis.game,foundry:globalThis.foundry};
 try {
  const item={id:"spell",type:"spell",system:{spellType:"lasting"}};
  const user={id:"owner"},caster={uuid:"Actor.caster",items:[item],system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:"one",itemId:"spell"},{id:"two",itemId:"spell"}]},
   canUserModify:u=>u===user,async update(changed){this.system.activeSpellCastings=changed["system.activeSpellCastings"];}};
  const target={uuid:"Actor.target",effects:[]},synthetic={uuid:"Scene.s.Token.t.Actor.synthetic",effects:[]};
  const docs=new Map([[caster.uuid,caster]]);
  for (const [actor,id,cast] of [[target,"a","one"],[synthetic,"b","one"],[target,"c","two"]]) {
   const effect={uuid:`${actor.uuid}.ActiveEffect.${id}`,flags:{"trudvang-chronicles":{transformation:{ruleTestContext:{casterUuid:caster.uuid,castingId:cast}}}},async delete(){actor.effects=actor.effects.filter(e=>e!==this);docs.delete(this.uuid);}};
   actor.effects.push(effect);docs.set(effect.uuid,effect);
  }
  globalThis.game={user:{id:"gm"},users:{activeGM:{isSelf:true},get:id=>id==="owner"?user:null},actors:[caster,target],scenes:[{tokens:[{actor:synthetic}]}]};
  globalThis.foundry={utils:{fromUuid:async uuid=>docs.get(uuid)}};
  assert.equal(await endMaintainedSpellOnGM(caster.uuid,"one","owner"),true);
  assert.deepEqual(caster.system.activeSpellCastings.map(row=>row.id),["two"]);
  assert.deepEqual(target.effects.map(row=>row.uuid),[`${target.uuid}.ActiveEffect.c`]);
  assert.equal(synthetic.effects.length,0);
  assert.equal(await endMaintainedSpellOnGM(caster.uuid,"two","stranger"),false);
  assert.equal(target.effects.length,1);
 } finally {globalThis.game=old.game;globalThis.foundry=old.foundry;}
});

test("failure to delete an effect keeps the maintained casting", async () => {
 const old={game:globalThis.game,foundry:globalThis.foundry},originalError=console.error;
 try {
  const user={id:"owner"},item={id:"spell",type:"spell",system:{spellType:"lasting"}};
  const caster={uuid:"Actor.caster",items:[item],system:{activeSpellCastingsMigrated:true,activeSpellCastings:[{id:"cast",itemId:"spell"}]},canUserModify:()=>true,async update(){throw Error("must not update");}};
  const effect={uuid:"Actor.target.ActiveEffect.e",flags:{"trudvang-chronicles":{transformation:{ruleTestContext:{casterUuid:caster.uuid,castingId:"cast"}}}},async delete(){throw Error("denied");}};
  globalThis.game={user:{id:"gm"},users:{activeGM:{isSelf:true},get:()=>user},actors:[caster,{uuid:"Actor.target",effects:[effect]}],scenes:[]};
  globalThis.foundry={utils:{fromUuid:async uuid=>uuid===caster.uuid?caster:effect}};
  console.error=()=>{};
  assert.equal(await endMaintainedSpellOnGM(caster.uuid,"cast","owner"),false);
  assert.equal(caster.system.activeSpellCastings.length,1);
 } finally {console.error=originalError;globalThis.game=old.game;globalThis.foundry=old.foundry;}
});
