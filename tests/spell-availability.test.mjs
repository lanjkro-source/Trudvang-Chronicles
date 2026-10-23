import assert from "node:assert/strict";
import test from "node:test";
import {spellActorForItem,spellAvailability} from "../modules/rules/spell-availability.mjs";

const knowledge=id=>({type:"ability",system:{catalogId:id,level:1}});
const spell=()=>({type:"spell",system:{tabletId:"test-tablet",level:2,cost:5}});
function caster(){return {type:"character",isOwner:true,canPerformAction:()=>true,
 items:[knowledge("vitnerShaping"),knowledge("galding"),{type:"tablet",system:{catalogId:"test-tablet",level:2}}],
 system:{resources:{vitner:{current:5},divinity:{current:5},body:{current:10,max:40}}}};}

test("casting actor resolution respects the owning actor, selected token, then assigned character",()=>{
 const owner=caster(),selected=caster(),assigned=caster();
 const options={user:{character:assigned},controlled:[{actor:{type:"vehicle"}},{actor:selected}]};
 assert.equal(spellActorForItem({actor:owner},options),owner);
 assert.equal(spellActorForItem({},options),selected);
 assert.equal(spellActorForItem({},{...options,controlled:[]}),assigned);
 assert.equal(spellActorForItem({},{user:{},controlled:[]}),null);
});

test("casting requires control, ability to act, both magical knowledges and adequate tablet level",()=>{
 const a=caster(),s=spell();assert.equal(spellAvailability(a,s).ok,true);
 assert.match(spellAvailability(null,s).reason,/SpellCasterRequired$/);
 a.isOwner=false;assert.match(spellAvailability(a,s).reason,/SpellCasterPermission$/);a.isOwner=true;
 a.canPerformAction=()=>false;assert.match(spellAvailability(a,s).reason,/CannotAct$/);a.canPerformAction=()=>true;
 for(const id of ["vitnerShaping","galding"]){const k=a.items.find(i=>i.system.catalogId===id);k.system.level=0;assert.match(spellAvailability(a,s).reason,/MagicMethodRequired$/);k.system.level=1;}
 a.items[2].system.level=1;assert.match(spellAvailability(a,s).reason,/SpellTabletLevelRequired$/);
 a.items.pop();assert.match(spellAvailability(a,s).reason,/SpellTabletRequired$/);
});

test("resource gating preserves optional health sacrifice, unlimited vitner and temporary divinity",()=>{
 const a=caster(),s=spell();a.system.resources.vitner.current=0;
 assert.equal(spellAvailability(a,s).ok,true);
 a.system.resources.body.current=-40;assert.match(spellAvailability(a,s).reason,/NotEnoughPower$/);
 a.unlimitedVitner=true;assert.equal(spellAvailability(a,s).ok,true);
 const d={type:"divineFeat",system:{cost:5,religion:"gerbanis"}};
 a.items.push(knowledge("invoke"),knowledge("stormkelt"));a.system.resources.divinity.current=1;
 assert.match(spellAvailability(a,d).reason,/NotEnoughPower$/);
 a.system.resources.divinity.temporary=4;assert.equal(spellAvailability(a,d).ok,true);
 a.items.at(-1).system.catalogId="mopor";assert.match(spellAvailability(a,d).reason,/MagicMethodRequired$/);
});

test("NPC innate casting and already known powers preserve their tablet exceptions",()=>{
 const a=caster(),s=spell();a.type="npc";a.items=[];a.system.magic={castingTarget:12};
 assert.equal(spellAvailability(a,s).ok,true);
 a.system.magic.castingTarget=null;assert.match(spellAvailability(a,s).reason,/ConfigureMagicMethod$/);
 a.items=[knowledge("vitnerShaping"),knowledge("galding")];s.actor=a;
 assert.equal(spellAvailability(a,s).ok,true);
});

test("runes, inactive granted powers and full persistent spell capacity disable casting",()=>{
 const a=caster(),s=spell();s.system.isRune=true;assert.match(spellAvailability(a,s).reason,/RuneObjectNeeded$/);s.system.isRune=false;
 s.flags={"trudvang-chronicles":{transformationGrant:"grant"}};
 assert.match(spellAvailability(a,s).reason,/Restricted$/);
 const effect={id:"grant"};a.allApplicableEffects=()=>[effect];assert.equal(spellAvailability(a,s).ok,true);
 effect.disabled=true;assert.match(spellAvailability(a,s).reason,/Restricted$/);
 delete s.flags;s.system.spellType="lasting";s.id="spell";a.activeSpellLimit=1;
 a.items.push({...s,system:{...s.system,activeCastCosts:[5]}});
 assert.match(spellAvailability(a,s).reason,/ActiveSpellLimit$/);
});
