import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {TRANSFORMATION_TEMPLATES} from '../modules/transformation-data.mjs';
import {initialSelfEffectKeys,selfEffectNeedsChoice} from '../modules/rules/self-effects.mjs';
const S='trudvang-chronicles',lang=JSON.parse(fs.readFileSync('lang/fr.json')),fr=JSON.parse(fs.readFileSync('game doc/fr/trudvang-powers-fr.json'));
let die=7,created=[],cards=[],dialogs=[],answer;
const docs=new Map(),messages=new Map(),get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
globalThis.foundry={applications:{api:{DialogV2:class{static async wait(config){dialogs.push(config);return typeof answer==='function'?answer(config):answer;}}},handlebars:{renderTemplate:async(_path,data)=>{cards.push(structuredClone(data));return JSON.stringify(data);}}},utils:{randomID:()=>crypto.randomUUID(),fromUuid:async uuid=>docs.get(uuid)}};
const gm={id:'gm',isGM:true,isSelf:true,active:true};
globalThis.game={user:gm,users:{activeGM:gm},time:{worldTime:0},i18n:{lang:'fr',localize:key=>get(lang,key)??key,format:(key,data)=>String(get(lang,key)??key).replace(/\{(\w+)\}/g,(_,k)=>data[k]??'')},actors:[],scenes:[],items:[]};
let warnings=[];globalThis.ui={notifications:{warn:message=>warnings.push(message)}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=this.formula==='1d20'?die:2;return this;}async toMessage(data){return ChatMessage.create({...data,rolls:[this]});}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{const m={...data,id:'m'+messages.size,async update(changes){for(const [path,value]of Object.entries(changes)){const keys=path.split('.'),last=keys.pop(),target=keys.reduce((o,k)=>o[k]??={},this);target[last]=structuredClone(value);}}};messages.set(m.id,m);return m;}};
const {rollUnder}=await import('../modules/dice.mjs');
function caster(){
 const a={uuid:'Actor.caster',id:'caster',name:'Caster',documentName:'Actor',type:'character',items:[],effects:[],isOwner:true,canUserModify:()=>true,getActiveTokens:()=>[],findRuleKnowledge:()=>null,getTraitValue:()=>0,getSkillValue:()=>1,system:{traits:{strength:0,constitution:0,dexterity:0,psyche:0,intelligence:0,charisma:0},effective:{traits:{}},modifiers:{},details:{size:1},resources:{body:{max:20,current:20}},movement:{current:10}}};
 a.items.get=id=>a.items.find(i=>i.id===id);a.effects.get=id=>a.effects.find(e=>e.id===id);
 a.createTrudvangEffect=async data=>{created.push(data);const e={...structuredClone(data),id:'e'+a.effects.length,uuid:a.uuid+'.ActiveEffect.e'+a.effects.length,parent:a};a.effects.push(e);return e;};
 a.createEmbeddedDocuments=async(_type,rows)=>rows.map(data=>{const item={...structuredClone(data),id:'i'+a.items.length,uuid:a.uuid+'.Item.i'+a.items.length,parent:a,actor:a,async delete(){a.items.splice(a.items.indexOf(this),1);}};a.items.push(item);return item;});
 a.deleteEmbeddedDocuments=async(_type,ids)=>{a.items=a.items.filter(item=>!ids.includes(item.id));};
 docs.set(a.uuid,a);game.actors=[a];warnings=[];created=[];cards=[];dialogs=[];answer=null;die=7;return a;
}
function itemFor(a,id,type='divineFeat'){const source=fr.find(p=>p.catalogId===id),item={id:'power',uuid:a.uuid+'.Item.power',name:source.name,type,actor:a,parent:a,system:{catalogId:id,spellType:POWER_DETAILS_BY_ID[id].spellType,level:source.level}};a.items.push(item);return item;}
test('every personal source has an explicit reviewed policy; every generated self-only effect has an initial variant',()=>{
 for(const p of fr.filter(p=>/^personnelle$/i.test(p.range??'')))assert.equal(typeof p.selfOnly,'boolean',p.name);
 for(const p of fr.filter(p=>p.selfOnly)){assert.equal(POWER_DETAILS_BY_ID[p.catalogId].selfOnly,true,p.name);if(p.effectTemplates?.length)assert.ok(initialSelfEffectKeys(p.catalogId).length,p.name);assert.equal(p.targeting?.contactOptionId,undefined,p.name);}
 for(const id of ['vitner-soil-craft:soil-walk:5','holy-gerbanis-power-of-enken:night-vision:0'])assert.equal(POWER_DETAILS_BY_ID[id].selfOnly,false);
});
test('successful spear invocations apply to the caster with no application button, target list or redundant dialog',async()=>{
 for(const tail of ['bloodfangsbane:2','bolgemek:4','roggdrasil:8']){
  const a=caster(),id='holy-ealdtradition-halawen-s-offering:'+tail,item=itemFor(a,id);
  game.user.targets=new Set([{uuid:'Token.other',actor:{uuid:'Actor.other'}}]);
  const result=await rollUnder({actor:a,item,kind:'divine',target:15,castingId:'cast-'+tail,powerLevelCounts:[2,0]});
  assert.equal(created.length,1);assert.equal(a.items.filter(i=>i.type==='weapon').length,1);assert.equal(created[0].flags[S].transformation.ruleTestContext.casterUuid,a.uuid);assert.equal(result.automaticEffectUuids.length,1);assert.equal(cards.at(-1).transformationLinks,'');assert.deepEqual([...messages.values()].at(-1).flags[S].transformationTargets,{});assert.equal(dialogs.length,0);assert.deepEqual(warnings,[]);
 }
});
test('a failed personal invocation never applies an effect',async()=>{const a=caster(),item=itemFor(a,'holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4');die=20;await rollUnder({actor:a,item,kind:'divine',target:15});assert.equal(created.length,0);assert.equal(cards.at(-1).transformationLinks,'');});
test('exhaustion is a later consequence, not applied alongside the successful rage',async()=>{
 const a=caster(),item=itemFor(a,'holy-joaringfaith-fury-of-ogon:rage:2');await rollUnder({actor:a,item,kind:'divine',target:15});assert.equal(created.length,1);assert.match(created[0].flags[S].transformation.key,/#rage$/);assert.deepEqual(created[0].flags[S].transformation.related,['frenzy-exhaustion']);assert.equal(cards.at(-1).transformationLinks,'');
});
test('a critical spell resolves bonus power levels before automatic application, retaining its casting identity',async()=>{
 const a=caster(),item=itemFor(a,'vitner-power-of-thought:understanding-script:0','spell');die=1;
 const result=await rollUnder({actor:a,item,kind:'spell',target:15,castingId:'lasting-one',powerLevelCounts:[0],resolvePerfectSuccess:async()=>({counts:[2],flavor:'Bonus'})});
 assert.equal(created.length,1);assert.equal(created[0].flags[S].transformation.ruleTestContext.castingId,'lasting-one');assert.deepEqual(created[0].flags[S].transformation.ruleTestContext.counts,[2,0]);assert.equal(created[0].flags[S].transformation.ruleTestContext.selfSource,true);assert.equal(result.automaticEffectUuids[0],a.effects[0].uuid);assert.equal(cards.at(-1).transformationLinks,'');assert.deepEqual(warnings,[]);
});
test('the language choice remains available without a target-selection step',async()=>{
 const a=caster(),item=itemFor(a,'vitner-power-of-thought:understanding-speech:1','spell');answer=config=>({action:'apply',duration:config.content.match(/name="duration"[^>]*value="([^"]*)"/)?.[1]??'1 hour',effectInput:'Vrok'});
 await rollUnder({actor:a,item,kind:'spell',target:15});assert.equal(dialogs.length,1);assert.equal(created.length,1);assert.equal(created[0].flags[S].transformation.input,'Vrok');assert.equal(cards.at(-1).transformationLinks,'');assert.deepEqual(warnings,[]);
});
test('alternative animal forms are chosen once; they are not all applied simultaneously',async()=>{
 const a=caster(),id='holy-toikalokke-animal-mind:beast-mind:4';
 const source=fr.find(p=>p.name==='Esprit de la bête');const item=itemFor(a,source.catalogId);const keys=initialSelfEffectKeys(source.catalogId);assert.ok(keys.length>1);
 answer=config=>config.content.includes('name="effect"')?keys[1]:assert.fail('No second form/target prompt expected');
 await rollUnder({actor:a,item,kind:'divine',target:15});assert.equal(dialogs.length,1);assert.equal(created.length,1);assert.equal(created[0].flags[S].transformation.key,keys[1]);assert.equal(cards.at(-1).transformationLinks,'');assert.deepEqual(warnings,[]);
});
test('all deterministic personal effects reach actual creation without manual application or target allocation',async()=>{
 const selected=fr.filter(p=>p.selfOnly&&initialSelfEffectKeys(p.catalogId).length===1&&!selfEffectNeedsChoice(initialSelfEffectKeys(p.catalogId)[0])&&!p.effectTemplates.some(t=>t.aura));
 for(const p of selected){const a=caster(),item=itemFor(a,p.catalogId,p.catalogId.startsWith('vitner-')?'spell':'divineFeat');await rollUnder({actor:a,item,kind:item.type==='spell'?'spell':'divine',target:15});assert.equal(created.length,1,p.name+': effect missing, warnings '+warnings.join('; '));assert.equal(dialogs.length,0,p.name);assert.equal(cards.at(-1).transformationLinks,'',p.name);assert.deepEqual(warnings,[],p.name);}
 assert.ok(selected.length>60);
});

test('an automatic personal effect retains the maintained casting identity and ends independently of another casting',async()=>{
 const a=caster(),item=itemFor(a,'vitner-power-of-thought:understanding-script:0','spell');game.users.get=id=>id==='gm'?gm:null;
 a.system.activeSpellCastingsMigrated=true;a.system.activeSpellCastings=[];
 a.update=async changed=>{if(changed['system.activeSpellCastings'])a.system.activeSpellCastings=changed['system.activeSpellCastings'];};
 for(const castingId of ['first','second']){
  const result=await rollUnder({actor:a,item,kind:'spell',target:15,castingId});
  const effect=a.effects.at(-1);effect.delete=async()=>{a.effects.splice(a.effects.indexOf(effect),1);docs.delete(effect.uuid);};docs.set(effect.uuid,effect);
  a.system.activeSpellCastings.push({id:castingId,itemId:item.id,cost:5,effectUuids:result.automaticEffectUuids,effectsApplied:true});
 }
 const {endMaintainedSpellOnGM}=await import('../modules/maintained-spell-tracking.mjs');
 assert.equal(await endMaintainedSpellOnGM(a.uuid,'first','gm'),true);assert.equal(a.effects.length,1);assert.equal(a.effects[0].flags[S].transformation.ruleTestContext.castingId,'second');assert.equal(a.system.activeSpellCastings.length,1);
});
test('an aura source is still automatically put on the caster before a token or GM becomes available',async()=>{
 const a=caster(),item=itemFor(a,'holy-haminges-power-of-trolls:disease-carrier:0');const old=game.users.activeGM;game.users.activeGM=null;
 try{await rollUnder({actor:a,item,kind:'divine',target:15});assert.equal(created.length,1);assert.equal(created[0].flags[S].transformation.ruleTestContext.auraSource,true);assert.equal(cards.at(-1).transformationLinks,'');}
 finally{game.users.activeGM=old;}
});

test('a successful Burning Hand cast automatically grants the two attacks with frozen fire and no premature damage button',async()=>{
 const a=caster(),id='vitner-flame-craft:burning-hand:2',item=itemFor(a,id,'spell');await rollUnder({actor:a,item,kind:'spell',target:15,powerLevelCounts:[2,1,4]});assert.equal(created.length,1);assert.equal(a.items.filter(i=>i.type==='weapon').length,2);const hands=a.items.filter(i=>i.type==='weapon');assert.ok(hands.every(hand=>hand.system.damageQualification.type==='bludgeoning'&&hand.system.material==='natural'&&hand.flags[S].supplementalDamage[0].qualification.nature==='magical'));assert.equal(hands[0].flags[S].supplementalDamage[0].formula,'1d10 + 1');assert.equal(hands[0].flags[S].supplementalDamage[0].openRoll,8);assert.equal(hands[1].flags[S].supplementalDamage[0].formula,'1d10');assert.equal(hands[1].flags[S].supplementalDamage[0].openRoll,0);assert.equal(cards.at(-1).magicDamage,false);assert.equal(dialogs.length,0);assert.equal(created[0].duration.value,6);assert.deepEqual(warnings,[]);
});

test('successful purification cards display one total with no marker, including a critical allocation and the lake option',async()=>{
 const vitner='vitner-water-craft:purify-water:1',divine='holy-toikalokke-master-of-elements:purify-water:2';
 let a=caster();
 await rollUnder({actor:a,item:itemFor(a,vitner,'spell'),kind:'spell',target:15,powerLevelCounts:[0,1,1,1,0]});
 assert.match(cards.at(-1).successConsequence,/1120 L/);assert.equal(cards.at(-1).transformationLinks,'');
 a=caster();die=1;
 await rollUnder({actor:a,item:itemFor(a,vitner,'spell'),kind:'spell',target:15,powerLevelCounts:[],resolvePerfectSuccess:async()=>({counts:[0,0,0,0,1]})});
 assert.match(cards.at(-1).successConsequence,/petit lac/);
 a=caster();
 await rollUnder({actor:a,item:itemFor(a,divine),kind:'divine',target:15,powerLevelCounts:[4,3]});
 assert.match(cards.at(-1).successConsequence,/5 L/);assert.equal(cards.at(-1).ruleTests.length,1);assert.equal(created.length,0);
 a=caster();die=20;
 await rollUnder({actor:a,item:itemFor(a,vitner,'spell'),kind:'spell',target:15});
 assert.doesNotMatch(cards.at(-1).successConsequence??'',/Volume/);
});
