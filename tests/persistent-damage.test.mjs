import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Handlebars from 'handlebars';
import {itemEffectRemainingSeconds} from '../modules/rules/effect-duration.mjs';
const S='trudvang-chronicles',language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
const lookup=key=>key.split('.').reduce((value,part)=>value?.[part],language)??key;
const format=(key,data={})=>String(lookup(key)).replace(/\{(\w+)\}/g,(_,key)=>data[key]??'');
Handlebars.registerHelper('localize',(key,options)=>format(key,options.hash));
Handlebars.registerHelper('eq',(left,right)=>left===right);
Handlebars.registerHelper('concat',(...parts)=>parts.slice(0,-1).join(''));
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');},innerHTML:''})};
globalThis.foundry={applications:{api:{DialogV2:{wait:()=>assert.fail('automatic damage must not open a dialog')}},handlebars:{renderTemplate:async(path,data)=>Handlebars.compile(fs.readFileSync(new URL('../'+path.replace('systems/trudvang-chronicles/',''),import.meta.url),'utf8'))(data)}},utils:{fromUuid:async uuid=>documents.get(uuid)}};
const documents=new Map();
const {triggerPersistentDamage,processPersistentDamageRound,persistentDamageDefinition}=await import('../modules/persistent-damage.mjs');
const {requestChatApplication,requestDamageResistance}=await import('../modules/chat-application.mjs');
function runtime(t,{key='vitner-dimvitner:hand-of-death:1#effect',counts={},custom,results=[4]}={}){
 const previous={game:globalThis.game,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage};
 t.after(()=>Object.assign(globalThis,previous));
 const cards=[],rolls=[],gm={id:'gm',isGM:true,isSelf:true,active:true},users=new Map([[gm.id,gm]]);users.activeGM=gm;
 const messages=new Map(),combat={id:crypto.randomUUID(),started:true,round:1,combatants:[]};
 globalThis.game={user:gm,users,messages,combat,time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format}};
 globalThis.Roll=class{constructor(formula){this.formula=formula;rolls.push(this);}async evaluate(){this.total=results.shift();assert.notEqual(this.total,undefined,'unexpected die');return this;}};
 function updateObject(target,changes){for(const [path,value]of Object.entries(changes)){const parts=path.split('.');let row=target;for(const part of parts.slice(0,-1))row=row[part]??={};row[parts.at(-1)]=structuredClone(value);}}
 globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{const message={...data,id:crypto.randomUUID(),author:gm,getFlag:(_s,key)=>message.flags?.[S]?.[key],update:async changes=>updateObject(message,changes)};messages.set(message.id,message);cards.push(message);return message;}};
 const actor={uuid:'Actor.'+crypto.randomUUID(),name:'Victime',documentName:'Actor',type:'npc',isOwner:true,items:[],effects:[],system:{protection:0,modifiers:{damage:20},resources:{body:{value:40,current:40,max:40}}},testUserPermission:()=>true,allApplicableEffects:()=>actor.effects,update:async changes=>{if(changes['system.resources.body.value']!==undefined){actor.system.resources.body.value=changes['system.resources.body.value'];actor.system.resources.body.current=changes['system.resources.body.value'];}}};
 documents.set(actor.uuid,actor);combat.combatants=[{actor},{actor}];
 const effect={id:crypto.randomUUID(),uuid:'Actor.effect.'+crypto.randomUUID(),documentName:'ActiveEffect',type:'effect',name:'Effet',parent:actor,system:{changes:[]},duration:{value:3,units:'rounds'},flags:{[S]:{...(custom?{persistentDamage:custom}:{}),transformation:{key,sourceId:key.split('#')[0],resolved:true,ruleTestContext:{sourceId:key.split('#')[0],countsById:counts}}}},update:async changes=>updateObject(effect,changes),delete:async()=>{actor.effects.splice(actor.effects.indexOf(effect),1);}};
 actor.effects.push(effect);actor.effects.get=id=>actor.effects.find(row=>row.id===id);documents.set(effect.uuid,effect);
 return {effect,actor,combat,cards,rolls,messages};
}
test('Main funeste rolls once on application, waits for resistance and keeps its frozen JO without the victim’s outgoing bonuses',async t=>{
 const id='vitner-dimvitner:hand-of-death:1',r=runtime(t,{counts:{[`${id}:4`]:1},results:[9]});
 await Promise.all([triggerPersistentDamage(r.effect),triggerPersistentDamage(r.effect)]);
 assert.equal(r.cards.length,1);assert.equal(r.rolls.length,1);assert.equal(r.actor.system.resources.body.current,40);
 assert.equal(r.cards[0].getFlag(S,'damageContext').resistance.test.sv,6);
 assert.match(r.cards[0].content,/data-damage="9"/);assert.doesNotMatch(r.cards[0].content,/TRUDVANG\./);
 assert.match(r.cards[0].content,/JO 0 → JO 10/);
 assert.equal(r.effect.flags[S].persistentDamageClock.pending,null);
});
test('unavoidable damage automatically removes PS and cannot apply twice',async t=>{
 const r=runtime(t,{custom:{onApply:true,onRound:true,formula:'0d10 + 3',openRoll:0,qualification:{nature:'normal',delivery:'other',type:'other',protection:'none'}},results:[]});
 await triggerPersistentDamage(r.effect);await triggerPersistentDamage(r.effect);
 assert.equal(r.actor.system.resources.body.current,37);assert.equal(r.cards.length,1);assert.equal(r.rolls.length,0);
 assert.equal(r.cards[0].getFlag(S,'applications').length,1);
});
test('the real resistance dialog publishes a proof and automatically resolves just this damage card',async t=>{
 const previous=foundry.applications.api.DialogV2;t.after(()=>{foundry.applications.api.DialogV2=previous;});
 foundry.applications.api.DialogV2=class{_onRender(){}static async wait(){return {situationValue:6,traitModifier:0,configuredModifier:0,repeatedModifier:0,modifier:0};}};
 const r=runtime(t,{results:[4,3]});
 Object.assign(r.actor,{canPerformAction:()=>false,getTraitValue:()=>0,getRollModifier:()=>0});
 await triggerPersistentDamage(r.effect);
 const result=await requestDamageResistance({message:r.cards[0],actor:r.actor});
 assert.equal(result.status,'applied');assert.equal(r.actor.system.resources.body.current,40);
 assert.equal(r.cards.length,2);assert.equal(r.cards[1].getFlag(S,'rollOutcome').success,true);
 assert.equal(r.cards[0].getFlag(S,'applications')[0].amount,0);
});
test('a failed real resistance removes the rolled damage while leaving Main funeste active',async t=>{
 const previous=foundry.applications.api.DialogV2;t.after(()=>{foundry.applications.api.DialogV2=previous;});
 foundry.applications.api.DialogV2=class{_onRender(){}static async wait(){return {situationValue:6,traitModifier:0,configuredModifier:0,repeatedModifier:0,modifier:0};}};
 const r=runtime(t,{results:[4,20]});Object.assign(r.actor,{canPerformAction:()=>true,getTraitValue:()=>0,getRollModifier:()=>0});
 await triggerPersistentDamage(r.effect);await requestDamageResistance({message:r.cards[0],actor:r.actor});
 assert.equal(r.actor.system.resources.body.current,36);assert.ok(r.actor.effects.includes(r.effect));
 assert.equal(r.cards[0].getFlag(S,'damageResistanceResults')[0].success,false);
});
test('a new round waits for expiry and aura cleanup, then triggers surviving effects once, including linked actors only once',async t=>{
 const r=runtime(t,{results:[3,4]});await triggerPersistentDamage(r.effect);
 const order=[],options={effects:()=>[...r.actor.effects,...r.actor.effects],expireEffects:async()=>order.push('expiry'),settle:async()=>order.push('auras')};
 r.combat.round=2;await processPersistentDamageRound(r.combat,{round:1},{round:2},options);
 await processPersistentDamageRound(r.combat,{round:1},{round:2},options);
 assert.deepEqual(order.slice(0,2),['expiry','auras']);assert.equal(r.cards.length,2);
 r.combat.round=3;options.expireEffects=async()=>r.effect.delete();
 await processPersistentDamageRound(r.combat,{round:2},{round:3},options);assert.equal(r.cards.length,2);
});
test('rewinding a round and a non-elected client never produce damage',async t=>{
 const r=runtime(t);await processPersistentDamageRound(r.combat,{round:3},{round:2});assert.equal(r.cards.length,0);
 game.users.activeGM.isSelf=false;await triggerPersistentDamage(r.effect);assert.equal(r.cards.length,0);
});
test('round duration expiry removes the effect before its boundary tick',async t=>{
 const r=runtime(t,{results:[3,4,5]});r.effect.start={combat:r.combat.id,round:1,time:0};
 await triggerPersistentDamage(r.effect);
 const options={effects:()=>r.actor.effects,settle:async()=>{},expireEffects:async({combat})=>{if(itemEffectRemainingSeconds(r.effect,{time:0,combat})===0)await r.effect.delete();}};
 for(const round of [2,3,4]){r.combat.round=round;await processPersistentDamageRound(r.combat,{round:round-1},{round},options);}
 assert.equal(r.cards.length,3);assert.equal(r.actor.effects.length,0);
});
test('fever has only an application event, not a repeated damage event every round',async t=>{
 const r=runtime(t,{key:'vitner-witchcraft:fever:2#effect',results:[5]});
 await triggerPersistentDamage(r.effect);r.combat.round=2;await triggerPersistentDamage(r.effect,{kind:'round'});
 assert.equal(r.cards.length,1);assert.equal(r.actor.system.resources.body.current,40);
});
test('frost damage belongs to aura recipients, offers rounded clothing alternatives and never treats fleeing as damage resistance',async t=>{
 const id='holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5',r=runtime(t,{key:id+'#frost',counts:{[`${id}:4`]:2},results:[]});
 assert.equal(persistentDamageDefinition(r.effect),null);await triggerPersistentDamage(r.effect);assert.equal(r.cards.length,0);
 r.effect.flags[S].auraRecipient={regionUuid:'Scene.s.Region.r'};
 await triggerPersistentDamage(r.effect);
 assert.match(r.cards[0].content,/2 \(vêtements d’hiver\)/);assert.match(r.cards[0].content,/0 \(fourrure de mastomant\)/);
 const context=r.cards[0].getFlag(S,'damageContext');assert.equal(context.resistance.scope,'presence');assert.equal(context.resistance.successFactor,1);
 await requestChatApplication({message:r.cards[0],actor:r.actor,channel:'body',variant:'winter'});assert.equal(r.actor.system.resources.body.current,38);
 r.combat.round=2;await triggerPersistentDamage(r.effect,{kind:'round'});assert.equal(r.cards.length,2);
 assert.equal(r.cards[1].getFlag(S,'damageContext').resistance,undefined);
 r.effect.flags[S].auraRecipient.sourceEffectUuid='Actor.missing.ActiveEffect.missing';
 r.combat.round=3;await triggerPersistentDamage(r.effect,{kind:'round'});
 assert.equal(r.cards.length,2);assert.equal(r.actor.effects.length,0);
});
