import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {RULE_TESTS_BY_CATALOG_ID} from '../modules/rule-test-data.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {dispelCandidate,dispelFingerprint} from '../modules/rules/dispel.mjs';
const S='trudvang-chronicles',id='vitner-vitner-craft:dispel-vitner:6',breeze='holy-ealdtradition-nema-s-usefulness:freeing-breeze:4',wind='holy-ealdtradition-nema-s-usefulness:liberating-wind:6';
const lang=JSON.parse(fs.readFileSync('lang/fr.json')),get=(o,path)=>path.split('.').reduce((v,k)=>v?.[k],o),docs=new Map(),messages=new Map(),dialogs=[];
let die=6,choose=true,cancelRoll=false,mutateChoice,allowSame=false,changes=0;
const gm={id:'gm',isGM:true,active:true,isSelf:true},owner={id:'owner',active:true,isGM:false},other={id:'other',active:true,isGM:false};
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll('<','&lt;').replaceAll('>','&gt;');}})};
globalThis.foundry={applications:{api:{DialogV2:class{_onRender(){}static async wait(config){dialogs.push(config);if(config.content.includes('name="effect"')){if(!choose)return false;mutateChoice?.();return {effectUuid:effect.uuid,sameVitner:allowSame};}if(cancelRoll)return false;return {situationValue:Number(config.content.match(/name="sv"[^>]*value="([^"]*)"/)[1]),modifier:0};}}},handlebars:{renderTemplate:async(_path,data)=>'<article>'+JSON.stringify(data)+'</article>'}},utils:{fromUuid:async uuid=>docs.get(uuid)}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=die;return this;}};
globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.uuid}),create:async data=>{const m={...data,id:'m'+messages.size,canUserModify:()=>true,async update(data){for(const [path,value]of Object.entries(data)){const keys=path.split('.'),last=keys.pop(),target=keys.reduce((o,k)=>o[k]??={},this);target[last]=value;}}};messages.set(m.id,m);return m;}};
const users=new Map([[gm.id,gm],[owner.id,owner],[other.id,other]]);users.activeGM=gm;
globalThis.game={user:gm,users,messages,items:[],time:{worldTime:0},i18n:{lang:'fr',localize:key=>get(lang,key)??key,format:(key,data)=>String(get(lang,key)??key).replace(/\{(\w+)\}/g,(_,k)=>data[k]??'')}};
const warnings=[];globalThis.ui={notifications:{warn:message=>warnings.push(message)}};
const {performDispelTest,resolveDispelOnAuthority}=await import('../modules/dispel.mjs');
const {performRuleTest}=await import('../modules/rule-tests.mjs');
const {ruleTestCastingContext,withCastingCounts}=await import('../modules/rules/magic-resistance.mjs');
let caster,target,effect,source;
function setup(sourceId=id,targetId='vitner-body-vitner:immobilize:6',level=3){
 docs.clear();messages.clear();dialogs.length=0;warnings.length=0;die=6;choose=true;cancelRoll=false;mutateChoice=null;allowSame=false;changes=0;game.user=gm;users.activeGM=gm;game.time.worldTime=0;
 caster={uuid:'Actor.caster',name:'Caster',type:'character',documentName:'Actor',isOwner:true,items:[],effects:[],system:{effective:{traits:{}},damage:{penalty:0},fearPenalty:0},selectedVitnerType:{id:'hwitalja'},canPerformAction:()=>true,getTraitValue:()=>0,getRollModifier:()=>-3,rollEffectRows:()=>[{label:'Fatigue',value:-3}],testUserPermission:user=>user.id==='owner'};
 target={uuid:'Actor.target',name:'Target',documentName:'Actor',type:'character',items:[],effects:[],isOwner:false};
 source={uuid:caster.uuid+'.Item.dispel',name:'Dissipation',type:sourceId.startsWith('vitner-')?'spell':'divineFeat',system:{catalogId:sourceId,level:4},actor:caster,parent:caster};
 const key=Object.keys((awaitlessTemplates())).find(key=>key.startsWith(targetId+'#'));
 effect={uuid:target.uuid+'.ActiveEffect.e',id:'e',name:'Entrave',parent:target,documentName:'ActiveEffect',duration:{value:12,units:'rounds'},system:{changes:[]},flags:{[S]:{transformation:{key,sourceId:targetId,resolved:true,appliedAt:0,ruleTestContext:{kind:'spell',sourceLevel:level,vitnerType:'hwitalja',castingId:'original',casterUuid:'Actor.enemy'}}}},canUserModify:()=>false,async delete(){changes++;effect.parent.effects.splice(effect.parent.effects.indexOf(effect),1);docs.delete(effect.uuid);}};
 target.effects.push(effect);game.user.targets=new Set([{uuid:'Token.t',actor:target}]);for(const d of [caster,target,source,effect])docs.set(d.uuid,d);
 return {sourceId};
}
import {TRANSFORMATION_TEMPLATES} from '../modules/transformation-data.mjs';
function awaitlessTemplates(){return TRANSFORMATION_TEMPLATES;}
const run=async(sourceId=id,index=0,counts=[2,0])=>performDispelTest({document:source,test:RULE_TESTS_BY_CATALOG_ID[sourceId][index],index,actor:caster,context:ruleTestCastingContext(source,{caster,counts})});
test('the level table, vitner identity and bought improvements feed the real roll and successful removal',async()=>{
 setup();const result=await run();assert.equal(result.target,7,'6 base +2 bought +2 same vitner -3 fatigue');assert.equal(result.success,true);assert.equal(changes,1);assert.equal(target.effects.length,0);const card=messages.get(result.messageId);assert.match(card.content,/Entrave est dissipé/);assert.equal(card.flags[S].dispelAttempt.resolved,true);assert.match(dialogs[1].content,/Fatigue/);assert.match(dialogs[1].content,/Même type de vitner/);
});
test('different vitner receives no bonus even if a stale client claims the checkbox',async()=>{setup();effect.flags[S].transformation.ruleTestContext.vitnerType='darkhwitalja';allowSame=true;const result=await run();assert.equal(result.target,5);assert.equal(result.success,false);assert.equal(changes,0);});
test('canceling either the effect selection or the roll never removes an effect or emits a result',async()=>{
 setup();choose=false;assert.equal(await run(),null);assert.equal(changes,0);assert.equal(messages.size,0);
 setup();cancelRoll=true;assert.equal(await run(),null);assert.equal(changes,0);assert.equal(messages.size,0);
});
test('a changed or renewed effect is not removed using a stale selection or an earlier successful test',async()=>{
 setup();mutateChoice=()=>effect.flags[S].transformation.appliedAt=1;assert.equal(await run(),null);assert.equal(changes,0);assert.equal(messages.size,0);
 setup();die=20;const result=await run();const card=messages.get(result.messageId);card.flags[S].dispelAttempt.success=true;card.rolls[0].total=1;effect.duration.value=99;assert.equal(await resolveDispelOnAuthority({messageId:card.id,userId:'owner'}),'changed');assert.equal(changes,0);
});
test('Brise liberates only level 1–3 control effects; Vent accepts levels 4–5 with the correct lower VC',async()=>{
 setup(breeze);let result=await run(breeze,2,[0,2]);assert.equal(result.target,5);assert.equal(changes,0);
 setup(breeze,'vitner-body-vitner:imprison:10',5);assert.equal(await run(breeze,2),null);assert.match(warnings[0],/Aucun effet/);
 setup(wind,'vitner-body-vitner:imprison:10',5);die=1;result=await run(wind,1,[0,2]);assert.equal(result.target,5);assert.equal(changes,1);
 setup(wind,'vitner-body-vitner:imprison:10',2);result=await run(wind,1,[0,2]);assert.equal(result.target,13);assert.equal(changes,1);
});
test('control release rejects unrelated vitner effects, divinity, runes, inactive effects and templates',()=>{
 setup();const spec=RULE_TESTS_BY_CATALOG_ID[breeze][2].dispel;assert.ok(dispelCandidate(effect,spec));
 effect.flags[S].transformation.key='vitner-vitner-craft:enchant-object:2#effect';effect.flags[S].transformation.sourceId='vitner-vitner-craft:enchant-object:2';assert.equal(dispelCandidate(effect,spec),null);
 for(const state of ['disabled','isSuppressed']){setup();effect[state]=true;assert.equal(dispelCandidate(effect,spec),null);}
 setup();effect.flags[S].transformation.ruleTestContext.kind='divine';assert.equal(dispelCandidate(effect,spec),null);
 setup();effect.parent={type:'effect'};assert.equal(dispelCandidate(effect,spec),null);
 setup();effect.duration.expired=true;assert.equal(dispelCandidate(effect,spec),null);
});
test('ordinary permanent magic is rejected; Rust keeps the explicit rule allowing its permanent form to be dispelled',()=>{
 setup();const spec=RULE_TESTS_BY_CATALOG_ID[id][0].dispel;effect.duration.value=0;assert.equal(dispelCandidate(effect,spec),null);
 effect.flags[S].transformation.sourceId='vitner-vitner-of-objects:rust:3';effect.flags[S].transformation.key='vitner-vitner-of-objects:rust:3#effect';assert.ok(dispelCandidate(effect,spec));
});
test('expired clocks cannot be dispelled before native cleanup catches up',()=>{setup();game.time.worldTime=61;assert.equal(dispelCandidate(effect,RULE_TESTS_BY_CATALOG_ID[id][0].dispel),null);});
test('GM authority may remove another owner’s effect; observers cannot request it, and simultaneous replay is harmless',async()=>{
 setup();die=20;const result=await run();const card=messages.get(result.messageId);card.flags[S].dispelAttempt.success=true;card.rolls[0].total=1;
 assert.equal(await resolveDispelOnAuthority({messageId:card.id,userId:'other'}),'unavailable');assert.equal(changes,0);
 const results=await Promise.all([resolveDispelOnAuthority({messageId:card.id,userId:'owner'}),resolveDispelOnAuthority({messageId:card.id,userId:'gm'})]);assert.deepEqual(results,['removed','removed']);assert.equal(changes,1);
});
test('a natural 20 never removes an effect even when the recorded target is very high',async()=>{
 setup();die=20;const result=await run();const card=messages.get(result.messageId);card.flags[S].dispelAttempt.success=true;card.flags[S].dispelAttempt.target=99;assert.equal(await resolveDispelOnAuthority({messageId:card.id,userId:'owner'}),'unavailable');assert.equal(changes,0);
});
test('effects on carried items use the same choice and deletion path',async()=>{
 setup();const item={uuid:target.uuid+'.Item.sword',name:'Sword',type:'weapon',effects:[effect],parent:target};effect.parent=item;target.items.push(item);target.effects=[];const result=await run();assert.equal(result.success,true);assert.equal(changes,1);assert.match(dialogs[0].content,/Target \/ Sword/);assert.equal(item.effects.length,0);
});
test('the procedure rolls for its original caster rather than the currently selected target',async()=>{setup();const context=withCastingCounts(ruleTestCastingContext(source,{caster}),[2,0]);const result=await performRuleTest({document:source,index:0,actor:target,context});assert.equal(result.target,7);assert.equal(messages.get(result.messageId).speaker.actor,caster.uuid);});
test('the source snapshot preserves vitner and spell level, including powers converted to vitner and vice versa',()=>{
 setup();let context=ruleTestCastingContext(source,{caster});assert.equal(context.vitnerType,'hwitalja');assert.equal(context.sourceLevel,4);caster.selectedVitnerType.id='darkhwitalja';assert.equal(ruleTestCastingContext(source,{context}).vitnerType,'hwitalja');
 const converted={type:'spell',system:{catalogId:'holy-gerbanis-power-of-enken:night-vision:0',level:1}};assert.equal(ruleTestCastingContext(converted,{caster}).kind,'spell');assert.equal(ruleTestCastingContext({...converted,type:'divineFeat',system:{catalogId:id}},{caster}).kind,'divine');
});

test('the same-vitner bonus uses the original casting snapshot, not a changed current affinity',async()=>{
 setup();const context=ruleTestCastingContext(source,{caster,counts:[2,0]});caster.selectedVitnerType.id='darkhwitalja';
 const result=await performDispelTest({document:source,test:RULE_TESTS_BY_CATALOG_ID[id][0],index:0,actor:caster,context});assert.equal(result.target,7);assert.match(dialogs[0].content,/name="sameVitner" checked disabled/);assert.match(dialogs[0].content,/data-dispel-same-choice hidden/);assert.match(dialogs[0].content,/data-dispel-same-automatic>/);
});
test('without a GM, the caster cannot remove someone else’s effect but may remove an effect they own',async()=>{
 setup();users.activeGM=null;owner.targets=game.user.targets;game.user=owner;const result=await run();assert.equal(result.success,true);assert.equal(changes,0);assert.match(warnings.at(-1),/propriétaire|MJ/);
 setup();users.activeGM=null;game.user=owner;effect.canUserModify=()=>true;await run();assert.equal(changes,1);
});

test('physical liberation tests use the caster and purchased levels without deleting unrelated effects or changing a door',async()=>{
 const gust='holy-ealdtradition-nema-s-usefulness:gust-of-release:1';setup(gust);const context=ruleTestCastingContext(source,{caster,counts:[0,2]});
 const result=await performRuleTest({document:source,index:0,actor:target,context});assert.equal(result.target,7);assert.equal(changes,0);assert.equal([...messages.values()].at(-1).speaker.actor,caster.uuid);
});
test('the English selector and result use translated text',async()=>{
 setup();const old=game.i18n,en=JSON.parse(fs.readFileSync('lang/en.json'));game.i18n={lang:'en',localize:key=>get(en,key)??key,format:(key,data)=>String(get(en,key)??key).replace(/\{(\w+)\}/g,(_,k)=>data[k]??'')};
 try{const result=await run();assert.match(dialogs[0].content,/Effect to dispel or release/);assert.match(messages.get(result.messageId).content,/Entrave is dispelled/);}
 finally{game.i18n=old;}
});

test('a sustained spell with an elapsed explicit duration is also excluded before native cleanup',()=>{
 setup(id,'vitner-dimvitner:control-undead:7',3);game.time.worldTime=61;assert.equal(dispelCandidate(effect,RULE_TESTS_BY_CATALOG_ID[id][0].dispel),null);
});
test('a player’s successful roll requests the active GM to remove an effect on another owned actor',async()=>{
 setup();const old=game.socket,descriptor=Object.getOwnPropertyDescriptor(gm,'isSelf');Object.defineProperty(gm,'isSelf',{get:()=>game.user.id==='gm',configurable:true});
 let handler;const packets=[];game.socket={on(_channel,callback){handler=callback;},emit(_channel,payload){packets.push(payload);if(payload.type==='dispelEffect'){void(async()=>{game.user=gm;await handler(payload);game.user=owner;})();}else{game.user=owner;void handler(payload);}}};
 owner.targets=game.user.targets;game.user=owner;
 try{const result=await run();assert.equal(result.success,true);assert.equal(changes,1);assert.equal(packets[0].type,'dispelEffect');assert.equal(packets[0].success,undefined);assert.equal(messages.get(result.messageId).flags[S].dispelAttempt.status,'removed');}
 finally{Object.defineProperty(gm,'isSelf',descriptor);game.user=gm;game.socket=old;}
});
