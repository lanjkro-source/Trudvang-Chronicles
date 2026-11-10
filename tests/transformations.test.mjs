import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {transformationProfile,transformedTrait,movementDetails,movementProfile,transformationRollRows,effectRules,TRANSFORMATION_SCOPE as S} from "../modules/rules/transformation-profile.mjs";
import {EFFECT_RULE_PREFIX,changesFromRules,rulesFromChanges,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";
import {temporaryHealthGrants,temporaryHealthState,temporaryHealthUpdate,setTemporaryHealth} from "../modules/rules/transformation-profile.mjs";
import {effectStatus} from "../modules/rules/effect-status.mjs";
import {TRANSFORMATION_TEMPLATES as templates,TRANSFORMATIONS_BY_SOURCE as sources} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
import {resolveCombatPools,extraWeaponActionReady,readiedHandConflicts} from "../modules/rules/combat-pool-resolver.mjs";
import {resolveWeaponActions} from "../modules/rules/equipment-resolver.mjs";
import {buildEffectPackDocuments} from "../modules/effect-pack-data.mjs";
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>""}}};
const {annotateRuleTestDescription}=await import("../modules/rule-tests.mjs");
const {applyTransformation,resolveDuration,transformationLinks,syncTransformationTokens,syncEffectGrants,selectFormData,registerTransformationHooks}=await import("../modules/transformations.mjs");
const {applyDamageToActor}=await import("../modules/damage-application.mjs");
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");},innerHTML:""})};
const effect=(rules,extra={})=>({id:"form",name:"Form",flags:{[S]:{transformation:{rules,temporaryHP:10}}},...extra});

test('ten Thuuldom runes freeze all five tiers in FR/EN, including duration, local weapon bonuses and independent route tests',async t=>{
 const previous={game:globalThis.game,ui:globalThis.ui,utils:foundry.utils,documents:foundry.documents};
 t.after(()=>{globalThis.game=previous.game;globalThis.ui=previous.ui;foundry.utils=previous.utils;foundry.documents=previous.documents;});
 const ids=['stoneshape','gills-of-the-blackfish','heat-of-the-depths','fang-of-yukk','scales','stoneling','mark-of-brokk','cave-spider-s-grip','labyrinth-blood','stone-to-clay'];
 foundry.utils={deepClone:structuredClone};foundry.documents={ActiveEffect:{implementation:{getEffectStart:()=>({time:100})}}};
 let created,warnings=0;
 globalThis.ui={notifications:{warn:()=>warnings++}};
 const actor={uuid:'Actor.r',name:'Thuul',items:[],system:{movement:{current:12}},canUserModify:()=>true,createTrudvangEffect:async data=>(created=data,null)};
 const weapon={type:'weapon',name:'Sword',parent:actor,effects:[],canUserModify:()=>true,createEmbeddedDocuments:async(_,docs)=>(created=docs[0],[])};
 for(const lang of ['fr','en']){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`,import.meta.url))),lookup=key=>key.split('.').reduce((v,k)=>v?.[k],language)??key;
  globalThis.game={user:{id:'gm'},time:{worldTime:100},i18n:{lang,localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
  for(const id of ids)for(let level=1;level<=5;level++){
   const key=`holy-thuuldom-${id}:${id}:0#effect`,baseline=JSON.stringify(templates[key]);
   const answers={runeLevel:level,duration:templates[key].duration};
   await applyTransformation(actor,key,{preselectedAnswers:answers,...(id==='fang-of-yukk'?{destinationItem:weapon}:{})});
   const meta=created.flags[S].transformation,rules=rulesFromChanges(created.system.changes);
   assert.equal(meta.runeLevel,level);assert.equal(meta.summaryResolved,true);assert.doesNotMatch(meta.summary,/undefined|TRUDVANG\./);
   assert.doesNotMatch(created.description,/undefined|TRUDVANG\./);assert.equal(JSON.stringify(templates[key]),baseline,'application never mutates source tiers');
   if(['stoneshape','gills-of-the-blackfish'].includes(id))assert.deepEqual(created.duration,{value:36*level,units:'rounds'});
   if(id==='heat-of-the-depths')assert.deepEqual(created.duration,{value:3*level,units:'hours'});
   if(id==='scales'){
    assert.deepEqual(created.duration,{value:3*level,units:'rounds'});assert.equal(rules.magicalProtection,level);
    assert.equal(created.system.changes.find(c=>c.key==='system.modifiers.protection').value,String(level));
   }
   if(id==='mark-of-brokk')assert.equal(created.system.changes[0].value,String(level));
   if(id==='fang-of-yukk'){
    assert.equal(created.system.changes[0].key,'system.damageBonus');assert.equal(created.system.changes[0].value,String([1,2,2,3,3][level-1]));
    assert.equal(created.system.changes.find(c=>c.key==='system.openRoll')?.value,String([0,0,1,1,2][level-1])==='0'?undefined:String([0,0,1,1,2][level-1]));
   }
   if(id==='cave-spider-s-grip'){
    assert.deepEqual(created.duration,{value:24*level,units:'rounds'});assert.deepEqual(rules.movement,[{mode:'climb',method:'replace',value:6+level}]);
   }
   if(id==='stoneling')assert.equal(created.system.changes.length,0,'spirit senses never become the Thuul’s vision');
   if(id==='labyrinth-blood'){
    const {ruleTestsForDocument}=await import('../modules/rule-tests.mjs');
    assert.deepEqual(ruleTestsForDocument(created).map(row=>row.sv),[9+level,4+level]);
   }
   if(id==='stone-to-clay')assert.deepEqual(created.duration,{value:[1,3,6,9,12][level-1],units:'hours'});
  }
 }
 assert.equal(await applyTransformation(actor,'holy-thuuldom-fang-of-yukk:fang-of-yukk:0#effect',{skipDialog:true}),null);assert.equal(warnings,1);
 for(const level of [0,6,2.5])await assert.rejects(applyTransformation(actor,'holy-thuuldom-scales:scales:0#effect',{preselectedAnswers:{runeLevel:level}}));
 const key='holy-thuuldom-scales:scales:0#effect';
 await applyTransformation(actor,key,{preselectedAnswers:{runeLevel:3,duration:'1 hour'}});
 const copy={documentName:'ActiveEffect',...structuredClone(created)},copySummary=created.flags[S].transformation.summary;
 await applyTransformation(actor,key,{source:copy,counts:[0,0,0,0,1],skipDialog:true});
 assert.deepEqual(created.duration,{value:1,units:'hours'});assert.equal(created.flags[S].transformation.runeLevel,3);assert.equal(created.flags[S].transformation.summary,copySummary);
 assert.equal(created.system.changes.find(c=>c.key==='system.modifiers.protection').value,'3','copy never scales a resolved rune twice');
});
test('Power of Blood waits for psychological resistance before imposing its pain penalty',async t=>{
 const previous={game:globalThis.game,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage};
 t.after(()=>Object.assign(globalThis,previous));
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((value,part)=>value?.[part],language)??key;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((text,[key,value])=>text.replaceAll(`{${key}}`,String(value)),lookup(key))}};
 let rolls=0,created;
 globalThis.ChatMessage={getSpeaker:()=>({})};
 globalThis.Roll=class{constructor(formula){assert.equal(formula.trim(),'1d6');}async evaluate(){this.total=4;rolls++;return this;}async toMessage(){}};
 const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
 const id='holy-tenetnid-tablet-of-anger:power-of-blood:0';
 assert.match(transformationLinks({system:{catalogId:id}}),/pain/);
 await applyTransformation(actor,id+'#pain',{skipDialog:true});
 assert.equal(rolls,0);assert.deepEqual(created.system.changes,[]);
 assert.match(created.description,/conséquences psychologiques/);
 const pending=structuredClone(created);
 for(const marked of [false,true]){
  const copied={documentName:'ActiveEffect',...structuredClone(pending),duration:{value:4,units:'hours'}};
  copied.system.changes=[{key:'system.modifiers.rolls.allActions',type:'add',value:'-1',phase:'initial',priority:10}];
  if(marked)copied.flags[S].transformation.resistanceConsequence=true;
  await applyTransformation(actor,id+'#pain',{source:copied,skipDialog:true});
  assert.equal(created.flags[S].transformation.resistanceConsequence,true);
  assert.equal(created.system.changes[0].value,'-1');assert.equal(rolls,0);
 }
});
test('Visions of the Oak expires at midnight and keeps the exact all-test penalty',async t=>{
 const previous=globalThis.game;t.after(()=>{globalThis.game=previous;});
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((value,part)=>value?.[part],language)??key;
 globalThis.game={user:{id:'gm'},time:{worldTime:18*3600},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((text,[key,value])=>text.replaceAll(`{${key}}`,String(value)),lookup(key))}};
 let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
 await applyTransformation(actor,'holy-tenetnid-tablet-of-anger:visions-of-the-oak:3#pain',{skipDialog:true});
 assert.deepEqual(created.duration,{value:6,units:'hours'});
 assert.deepEqual(created.system.changes,[]);
});
test("deleting an item effect does not treat its item as a token-bearing actor",async()=>{
 const previous={Hooks:globalThis.Hooks,document:globalThis.document};const hooks=new Map();
 try{
  globalThis.Hooks={on:(name,fn)=>hooks.set(name,fn)};
  globalThis.document={addEventListener:()=>{}};
  registerTransformationHooks();
  const item={documentName:"Item",isOwner:true,parent:{documentName:"Actor"}};
  await hooks.get("deleteActiveEffect")({parent:item});
 }finally{globalThis.Hooks=previous.Hooks;globalThis.document=previous.document;}
});
test("a queued grant refresh ignores an effect which no longer has an id",async()=>{
 const previousGame=globalThis.game;globalThis.game={users:{activeGM:{isSelf:true}}};
 const actor={isOwner:true,effects:{get:()=>{throw Error("must not look up an undefined id");}}};
 try{await syncEffectGrants({parent:actor},actor);}finally{globalThis.game=previousGame;}
});
test("all generated effect offers have bilingual text, valid numeric changes and resolvable manual successors",()=>{
 for(const code of ["fr","en"]){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  for(const [key,t]of Object.entries(templates)){
   assert.ok(language.TRUDVANG.Content.Transformation[key].Name,key);
   assert.ok(language.TRUDVANG.Content.Transformation[key].Description,key);
   for(const c of t.changes.filter(c=>!c.key.startsWith(EFFECT_RULE_PREFIX)))assert.ok(Number.isFinite(Number(c.value)),key);
   if(t.priority!==undefined){
    assert.ok([10,20,30,40,50,60,70].includes(t.priority),key);
    for(const c of t.changes)assert.equal(c.priority,t.priority,key);
   }
   for(const id of t.related)assert.ok(templates[`${t.sourceId}#${id}`],`${key} -> ${id}`);
  }
 }
 assert.equal(Object.keys(sources).length,362);
});

test("weapon blessings require an owned weapon and preserve their improved values and duration",async()=>{
 const previous={game:globalThis.game,ui:globalThis.ui,utils:foundry.utils,documents:foundry.documents};
 try{
  const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
  const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
  globalThis.game={user:{id:"gm"},time:{worldTime:10},i18n:{lang:"fr",localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
  let warnings=0,created;
  globalThis.ui={notifications:{warn:()=>warnings++}};
  foundry.utils={deepClone:structuredClone};
  foundry.documents={ActiveEffect:{implementation:{getEffectStart:()=>({time:10})}}};
  const actor={uuid:"Actor.a",name:"A",items:[],canUserModify:()=>true};
  const item={type:"weapon",name:"Épée",parent:actor,effects:[],canUserModify:()=>true,createEmbeddedDocuments:async(_type,docs)=>{created=docs[0];return [created];}};
  const id="holy-tenetnid-tablet-of-the-knight:blessed-spear:1",key=`${id}#weapon`;
  assert.equal(await applyTransformation(actor,key,{counts:[1,1,2,0],skipDialog:true}),null);
  assert.equal(warnings,1);
  await applyTransformation(actor,key,{destinationItem:item,counts:[1,1,2,0],skipDialog:true});
  assert.equal(created.flags[S].transformation.ruleTestContext.countsById[`${id}:2`],2);
  assert.match(created.description,/Dégâts : \+3 ; \+4 contre les morts-vivants ; \+5 contre les démons/);
  assert.deepEqual(created.duration,{value:16,units:"rounds"});
 }finally{globalThis.game=previous.game;globalThis.ui=previous.ui;foundry.utils=previous.utils;foundry.documents=previous.documents;}
});
test("armor blessings require armor and record normal and magic protection separately",async()=>{
 const old={game:globalThis.game,ui:globalThis.ui,utils:foundry.utils,documents:foundry.documents};
 try{
  const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
  const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
  globalThis.game={user:{id:'gm'},time:{worldTime:10},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
  globalThis.ui={notifications:{warn:()=>{}}};foundry.utils={deepClone:structuredClone};foundry.documents={ActiveEffect:{implementation:{getEffectStart:()=>({time:10})}}};
  let created;const actor={uuid:'Actor.a',name:'A',items:[],canUserModify:()=>true};
  const item={type:'armor',name:'Armure',parent:actor,effects:[],canUserModify:()=>true,createEmbeddedDocuments:async(_type,docs)=>(created=docs[0],[created])};
  const key='holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3#armor';
  assert.equal(await applyTransformation(actor,key,{counts:[0,0,2],skipDialog:true}),null);
  await applyTransformation(actor,key,{destinationItem:item,counts:[0,0,2],skipDialog:true});
  assert.match(created.description,/Protection : \+5 VP ; \+3 VP contre les dégâts magiques/);
  assert.deepEqual(created.duration,{value:4,units:'rounds'});
 }finally{globalThis.game=old.game;globalThis.ui=old.ui;foundry.utils=old.utils;foundry.documents=old.documents;}
});
test("elemental protection and sensory effects retain their chosen duration and concealment penalties",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
 const previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,'holy-toikalokke-lynx-power:concealment:7#effect',{counts:[1,2],skipDialog:true});
  assert.deepEqual(created.duration,{value:4,units:'hours'});
  assert.match(created.description,/Repérage à l’arrêt : -7 VC/);
  assert.match(created.description,/Repérage en mouvement : -3 VC/);
  await applyTransformation(actor,'vitner-flame-craft:protection-from-fire:4#effect',{counts:[1,1,0,0,0,0],skipDialog:true});
  assert.deepEqual(created.duration,{value:192,units:'rounds'});
  assert.match(created.description,/feu ordinaire/);
  await applyTransformation(actor,'holy-toikalokke-lynx-power:hearing:2#effect',{counts:[1,0,1,1],skipDialog:true});
  assert.deepEqual(created.duration,{value:132,units:'rounds'});
  assert.match(created.description,/50 mètres/);
 }finally{globalThis.game=previous;}
});
test("mental influence records the task and both improved resistance tests",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
 const previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  const id='holy-haminges-power-of-trolls:taken-by-the-mountain:8';
  await applyTransformation(actor,`${id}#effect`,{counts:[1,0,0,2],preselectedAnswers:{duration:'1 minute',boost0:1,boost1:0,boost2:0,boost3:2,effectInput:'Partir'}});
  assert.deepEqual(created.duration,{value:24,units:'rounds'});
  assert.match(created.description,/Tâche suggérée : Partir/);
  assert.match(created.description,/résistance SV 4 \+ Psychisme/);
  assert.match(created.description,/SV 10 \+ Psychisme/);
  const enriched=annotateRuleTestDescription(created.description,created);
  assert.match(enriched,/data-test-index="0"/);assert.match(enriched,/data-test-index="1"/);
 }finally{globalThis.game=previous;}
});
test("both phantom plague variants retain independent resistance and examination modifiers",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  for(const id of ['vitner-witchcraft:phantom-plague:1','holy-joaringfaith-curses-of-sonntag:phantom-plague:1']){
   await applyTransformation(actor,`${id}#effect`,{counts:[2,3,1],skipDialog:true});
   assert.deepEqual(created.duration,{value:4,units:'days'});
   assert.match(created.description,/SV 6 \+ Psychisme/);
   assert.match(created.description,/victime : -3 VC/);
   assert.match(annotateRuleTestDescription(created.description,created),/data-test-index="0"/);
  }
 }finally{globalThis.game=previous;}
});
test("wolf claws begin at open roll 10 and progress from that baseline",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  const values=[['1d10',10],['1d10',9],['1d10',8],['1d10 + 1',8]];
  for(let count=0;count<values.length;count++){
   await applyTransformation(actor,'holy-haminges-power-of-the-beast:wolf-claws:5#claws',{counts:[0,0,count],skipDialog:true});
   const attack=effectRules(created).attacks[0];
   assert.equal(attack.isUnarmed,true);assert.deepEqual([attack.damage,attack.openRoll],values[count]);
   assert.match(created.flags[S].transformation.summary,new RegExp(`JO ${values[count][1]}`));
  }
  await applyTransformation(actor,'holy-haminges-power-of-the-beast:wolf-claws:5#claws',{counts:[0,0,4],skipDialog:true});
  assert.equal(effectRules(created).attacks[0].damage,'1d10 + 1');
 }finally{globalThis.game=previous;}
});
test("both fever effects roll their action penalty once per recipient and retain the chosen improvements",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,old={game:globalThis.game,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage};
 let rolls=0;globalThis.Roll=class{constructor(formula){assert.equal(formula,'1d3');}async evaluate(){rolls++;this.total=2;return this;}async toMessage(){}};
 globalThis.ChatMessage={getSpeaker:()=>({})};
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  for(const id of ['vitner-witchcraft:fever:2','holy-joaringfaith-curses-of-sonntag:fever:2']){
   await applyTransformation(actor,`${id}#effect`,{counts:[0,1,0,2,2,3],skipDialog:true});
   assert.deepEqual(created.duration,{value:2,units:'hours'});
   assert.equal(created.system.changes.find(c=>c.key==='system.modifiers.rolls.allActions').value,'-4');
   assert.match(created.description,/Toutes les actions : -4/);assert.match(created.description,/1d10.*8/);
   assert.match(created.description,/À l’application seulement/);
   const copy={documentName:'ActiveEffect',...structuredClone(created)},before=rolls;
   await applyTransformation(actor,`${id}#effect`,{source:copy,skipDialog:true});assert.equal(rolls,before);
  }
  assert.equal(rolls,2);
 }finally{globalThis.game=old.game;globalThis.Roll=old.Roll;globalThis.ChatMessage=old.ChatMessage;}
});

test("Air Armor improves its protective barrier and duration together",async()=>{
 const key="vitner-wind-craft:air-armor:4#air-armor";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key)=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"5 rounds",boost0:1,boost4:2})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key);
 assert.equal(created.system.changes.find(row=>row.key==="system.modifiers.protection").value,"3");
 assert.equal(effectRules(created).outerProtection,3);
 assert.deepEqual(created.duration,{value:6,units:"rounds"});
});

test("Tyrd's combat cries apply the correct ally and enemy modifiers and durations",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"2 rounds",boost0:1,boost1:1,boost2:2,boost3:2,boost4:2,boost5:2})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 const samples=[
  ["holy-gerbanis-wrath-of-tyrd:battle-cry:1#ally",3,3],
  ["holy-gerbanis-wrath-of-tyrd:war-cry:4#ally",5,3],
  ["holy-gerbanis-wrath-of-tyrd:war-cry:4#enemy",-5,3],
  ["holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#ally",6,3],
  ["holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#enemy",-6,3]
 ];
 for(const [key,bonus,rounds]of samples){
  await applyTransformation(actor,key);
  assert.equal(created.system.changes.find(row=>row.key==="system.modifiers.rolls.combatActions").value,String(bonus),key);
  assert.equal(created.duration.value,rounds,key);
 }
});

test("Leather Skin adds natural protection and selected duration without armor integrity",async()=>{
 const key="vitner-body-vitner:leather-skin:5#leather-skin";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"6 rounds",boost0:1,boost1:1,boost3:2})}};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key);
 assert.equal(created.system.changes.find(row=>row.key==="system.modifiers.protection").value,"3");
 assert.deepEqual(created.duration,{value:19,units:"rounds"});
 assert.ok(!created.system.changes.some(row=>/integrity|breach/i.test(row.key)));
 const {calculateArmoredDamage}=await import("../modules/damage-application.mjs");
 assert.equal(calculateArmoredDamage({damage:6,totalProtection:3,armor:[]}).bodyDamage,3);
});
test("forms compose without modifying source data and disabled or expired effects do not contribute",()=>{
 const actor={type:"character",system:{effective:{traits:{strength:1,dexterity:0}}},effects:[effect({size:7,traits:[{trait:"strength",method:"highest",value:6}],suspendEquipment:true}),effect({size:10},{disabled:true}),effect({size:3},{duration:{expired:true}})]};
 const before=structuredClone(actor);
 const profile=transformationProfile(actor);
 assert.equal(profile.size,7);assert.equal(profile.traits.strength,6);
 assert.deepEqual(actor,before);
 actor.effects=[];assert.equal(transformationProfile(actor).size,1);
 assert.equal(transformedTrait(4,{method:"degrees",value:1}),6);
 assert.equal(transformedTrait(4,{method:"add",value:4,max:6}),6);
});
test("movement offers add flight/swim and reductions without overwriting the original modes",()=>{
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"multiply",value:0.5},{mode:"flight",method:"baseMultiple",value:4}]),{land:10,flight:10});
 assert.deepEqual(movementProfile(10,[],[{mode:"land",method:"replace",value:0},{mode:"swim",method:"baseMultiple",value:2}]),{land:0,swim:10});
});

test("fear profiles upgrade the native factor and disabling the effect restores it unchanged",()=>{
 const source="2d10 (JO 8-10)";
 const form=effect({fearFactor:"3d10"});
 const actor={type:"npc",system:{details:{fearFactor:source}},effects:[form]};
 assert.equal(transformationProfile(actor).fearFactor,"3d10 (JO 8-10)");
 assert.equal(actor.system.details.fearFactor,source);
 form.disabled=true;
 assert.equal(transformationProfile(actor).fearFactor,undefined);
 assert.equal(actor.system.details.fearFactor,source);
});
test("legacy temporary health balances initialize one shared reserve without restoring consumed points",()=>{
 const a=effect({temporaryHP:5},{system:{changes:changesFromRules({temporaryHP:5})},flags:{[S]:{transformation:{editableChanges:true,temporaryHPSpent:2}}}});
 const actor={effects:[a],_source:{system:{resources:{body:{temporary:0}}}}};
 assert.deepEqual(temporaryHealthState(actor),{current:3,maximum:5,reference:-1});
});
test("the seven Joaring powers have all eight generated tests and a link for each test",()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={i18n:{lang:"fr",localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key,format:(key,data)=>(key.split(".").reduce((o,k)=>o?.[k],language)??key).replaceAll("{value}",String(data.value))}};
 globalThis.CONFIG={TRUDVANG:{}};
 const ids=Object.keys(RULE_TESTS_BY_CATALOG_ID).filter(id=>id.startsWith("holy-joaringfaith"));
 assert.equal(ids.length,7);assert.equal(ids.reduce((n,id)=>n+RULE_TESTS_BY_CATALOG_ID[id].length,0),8);
 for(const id of ids){
  const description=language.TRUDVANG.Content.Power[id].Description;
  const html=annotateRuleTestDescription(description,{system:{catalogId:id}});
  for(let i=0;i<RULE_TESTS_BY_CATALOG_ID[id].length;i++)assert.ok(html.includes(`data-test-index="${i}"`),id);
 }
});
test("applying a form creates independent owned grants and native trait changes, keeping original items intact",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"player"},time:{worldTime:100},i18n:{localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key}};
 globalThis.foundry={utils:{deepClone:structuredClone},applications:{api:{DialogV2:{wait:async()=>({duration:"1 minute"})}}}};
 const items=[];let created;
 const actor={system:{},canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>(created=data,{...data,id:"new-form"}),createEmbeddedDocuments:async(type,data)=>items.push(...data),getActiveTokens:()=>[],isOwner:true};
 const key=Object.keys(templates).find(k=>k.endsWith("#aspect-du-corbeau"));
 assert.ok(key);
 await applyTransformation(actor,key);
 assert.equal(created.duration.value,12);assert.equal(created.duration.units,"rounds");assert.equal(created.transfer,false);
 assert.ok(created.system.changes.some(c=>c.key==="system.effective.traits.dexterity"&&c.value==="4"));
 assert.ok(created.system.changes.length>0);
 assert.ok(created.system.changes.every(c=>c.priority===50),"level 5 applies priority 50 to dynamically generated trait changes");
 assert.equal(created.flags[S].transformation.rules,undefined,"configuration is editable changes, never hidden flags");
 assert.equal(effectRules(created).traits,undefined,"resolved traits are native scalar changes and cannot apply twice");
 assert.equal(items[0].flags[S].transformationGrant,"new-form");
 assert.equal(items[0].system.damage,"1d10");
 assert.equal(items[0].system.weaponActions,4);
 assert.deepEqual(await resolveDuration("3 jours"),{value:3,units:"days"});
 const diseaseKey=Object.keys(templates).find(k=>k.endsWith("#warg-disease"));
 assert.ok(transformationLinks({uuid:"Actor.a.ActiveEffect.disease",flags:{[S]:{transformation:{sourceId:templates[diseaseKey].sourceId,related:templates[diseaseKey].related}}}}).includes("warg-garou"));
});
test("recovery penalties name their contributor, apply once, and leave unrelated tests alone",()=>{
 const actor={effects:[effect({testFactor:{dexterity:0.5}})]};
 assert.deepEqual(transformationRollRows(actor,{target:15,skillKey:"agility"}),[{label:"Form",value:-8}]);
 assert.deepEqual(transformationRollRows(actor,{target:15,skillKey:"knowledge"}),[]);
 actor.effects[0].disabled=true;
 assert.deepEqual(transformationRollRows(actor,{target:15,traitKey:"dexterity"}),[]);
});

test("Hasten and its reverse resolve the book's separate skill-VC table from spell and compendium sources",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"player"},time:{worldTime:100},i18n:{localize}};
 globalThis.foundry={applications:{api:{DialogV2:{wait:async()=>({duration:"5 tours de jeu"})}}}};
 const references=buildEffectPackDocuments({localize}).items;
 for(const [id,base,trait,bonus]of [["hate",0,1,1],["hate",2,4,3],["hate",8,8,5],["hate-inverse",0,-1,-1],["hate-inverse",-4,-6,-4],["hate-inverse",-8,-8,-5]]){
  const key=`vitner-body-vitner:hasten:9#${id}`;
  const item=references.find(i=>i.system.catalogId===key);
  assert.ok(item.effects[0].system.changes.length,"compendium reference must retain its embedded change rows");
  item.documentName="Item";
  for(const source of [null,item]){
   let created;
   const actor={canUserModify:()=>true,getTraitValue:()=>base,createTrudvangEffect:async data=>{created=data;return null;}};
   await applyTransformation(actor,key,{source});
   const rows=created.system.changes;
   assert.equal(rows.find(c=>c.key==="system.effective.traits.dexterity").value,String(trait));
   for(const skill of ["agility","fighting"]){
    const changes=rows.filter(c=>c.key===`system.effective.skills.${skill}`);
    assert.equal(changes.length,1);
    assert.equal(changes[0].value,String(bonus));
    assert.equal(changes[0].type,"add");assert.equal(changes[0].phase,"initial");assert.equal(changes[0].priority,40);
   }
  }
 }
});

test("the reported V14.369 compendium Hasten with an array value creates all three resolved modifications",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key,{path})=>`${key}: ${path}`}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const typed=structuredClone(templates[key].changes);typed[0].value=JSON.parse(typed[0].value);
 const exported={name:"Hâte",system:{changes:typed},flags:{[S]:{transformation:{key,sourceId:templates[key].sourceId,editableChanges:true}}}};
 const model={documentName:"ActiveEffect",...exported,toObject:()=>structuredClone(exported)};
 for(const source of [model,{documentName:"Item",type:"effect",system:{catalogId:key},effects:[model]}]){
  let created;
  const actor={canUserModify:()=>true,getTraitValue:()=>2,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key,{source});
  assert.deepEqual(created.system.changes.map(c=>[c.key,c.value]),[
   ["system.effective.traits.dexterity","4"],["system.effective.skills.agility","3"],["system.effective.skills.fighting","3"]
  ]);
  assert.ok(created.system.changes.every(c=>c.priority===40));
 }
});

test("legacy compendium Hasten stores its dynamic rules in flags and must not become an empty effect on drop",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 // Exact storage used by the v0.96.2 effect compendium: no scalar changes,
 // with the dynamic DEX step in transformation.rules instead.
 const effect={documentName:"ActiveEffect",name:"Hâte",system:{changes:[]},statuses:[],
  flags:{[S]:{transformation:{key,sourceId:templates[key].sourceId,rules:{traits:[{trait:"dexterity",method:"degrees",value:1}]}}}}};
 for(const source of [effect,{documentName:"Item",type:"effect",system:{catalogId:key},effects:[effect]}]){
  let created;
  const actor={canUserModify:()=>true,getTraitValue:()=>2,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key,{source});
  assert.equal(created.system.changes.find(c=>c.key==="system.effective.traits.dexterity")?.value,"4");
  for(const skill of ["agility","fighting"])assert.equal(created.system.changes.find(c=>c.key===`system.effective.skills.${skill}`)?.value,"3");
  assert.equal(created.flags[S].transformation.editableChanges,true);
  assert.equal(created.flags[S].transformation.rules,undefined);
 }
});

test("legacy drop compatibility preserves resolved traits and current references deliberately cleared by the GM",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const rules={traits:[{trait:"dexterity",method:"degrees",value:1}],traitsApplied:true};
 const source={documentName:"ActiveEffect",system:{changes:[{key:"system.effective.traits.dexterity",type:"override",value:"4",phase:"initial",priority:40}]},
  flags:{[S]:{transformation:{key,rules}}}};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>4,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key,{source});
 assert.deepEqual(created.system.changes.map(c=>[c.key,c.value]),[["system.effective.traits.dexterity","4"]]);
 source.system.changes=[];
 source.flags[S].transformation.editableChanges=true;
 await applyTransformation(actor,key,{source});
 assert.deepEqual(created.system.changes,[]);
});

test("compendium drops read persisted source rows and reject malformed dynamic rules before creating an effect",async()=>{
 const key="vitner-body-vitner:hasten:9#hate";
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key,{path})=>`${key}: ${path}`}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 const saved={name:"Hâte",system:{changes:structuredClone(templates[key].changes)}};
 const source={documentName:"ActiveEffect",system:{changes:[]},toObject:()=>structuredClone(saved)};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,key,{source});
 assert.equal(created.system.changes.find(c=>c.key==="system.effective.traits.dexterity").value,"1");
 saved.system.changes[0].value="invalid JSON";created=null;
 await assert.rejects(()=>applyTransformation(actor,key,{source}),/InvalidProfileChange.*system.transformation.traits/);
 assert.equal(created,null);
});
test("vision is restored after removal, while later manual token edits remain intact",async()=>{
 globalThis.foundry.data={operators:{ForcedDeletion:{create:()=>({delete:true})}}};
 const token={sight:{visionMode:"basic"},flags:{},async update(data){
  if(data["sight.visionMode"])this.sight.visionMode=data["sight.visionMode"];
  if(data[`flags.${S}.transformationVision`])this.flags[S]={transformationVision:data[`flags.${S}.transformationVision`]};
  if(data[`flags.${S}.transformationVision`]?.delete)delete this.flags[S].transformationVision;
 }};
 const actor={isOwner:true,system:{},getActiveTokens:()=>[token],effects:[effect({vision:"darkvision"})]};
 await syncTransformationTokens(actor);assert.equal(token.sight.visionMode,"darkvision");
 actor.effects=[];await syncTransformationTokens(actor);assert.equal(token.sight.visionMode,"basic");
 actor.effects=[effect({vision:"darkvision"})];await syncTransformationTokens(actor);
 token.sight.visionMode="tremorsense";actor.effects=[];await syncTransformationTokens(actor);
 assert.equal(token.sight.visionMode,"tremorsense");
});

test("size effects resize linked tokens across scenes and restore their original footprint",async()=>{
 const makeToken=()=>({width:1,height:2,flags:{},async update(data){
  for(const key of ["width","height"])if(data[key]!==undefined)this[key]=data[key];
  this.flags[S]??={};
  if(data[`flags.${S}.transformationSize`])this.flags[S].transformationSize=structuredClone(data[`flags.${S}.transformationSize`]);
  if(data[`flags.${S}.transformationSize`]?.delete)delete this.flags[S].transformationSize;
 }});
 const previousGame=globalThis.game;
 try{
  const token=makeToken(),offScene=Object.assign(makeToken(),{actorLink:true,actorId:"a"}),other=Object.assign(makeToken(),{actorLink:false,actorId:"a"});
  globalThis.game={user:{id:"gm"},scenes:[{tokens:[offScene,other]}]};
  const actor={id:"a",isOwner:true,type:"npc",system:{details:{size:"1/3"}},getActiveTokens:()=>[token],effects:[effect({size:2})]};
  await syncTransformationTokens(actor);
  for(const t of [token,offScene])assert.deepEqual([t.width,t.height],[2,2]);
  assert.deepEqual([other.width,other.height],[1,2]);
  actor.effects=[effect({size:7})];await syncTransformationTokens(actor);assert.equal(token.width,4);
  actor.effects[0].disabled=true;await syncTransformationTokens(actor);
  assert.deepEqual([token.width,token.height],[1,2]);assert.equal(token.flags[S].transformationSize,undefined);
  assert.equal(transformationProfile(actor).size,"1/3","fractions survive preparation");
  actor.effects=[effect({size:0.25})];await syncTransformationTokens(actor);assert.equal(token.width,0.5);
  token.width=3;actor.effects=[];await syncTransformationTokens(actor);assert.equal(token.width,3,"later manual edits are preserved");
  actor.isToken=true;actor.token=token;actor.effects=[effect({size:2})];await syncTransformationTokens(actor);assert.equal(token.width,2);
  actor.effects[0].duration={expired:true};await syncTransformationTokens(actor);assert.equal(token.width,3);
 }finally{globalThis.game=previousGame;}
});

test("Rage adds height and mass without assigning a creature Size",()=>{
 const rages=Object.values(templates).filter(t=>t.id==="rage");assert.equal(rages.length,2);
 for(const t of rages){const rules=rulesFromChanges(t.changes);assert.equal(rules.size,undefined);assert.equal(rules.heightBonus,0.5);assert.equal(rules.weightBonus,30);}
});

test("reapplying a dynamic trait effect excludes its old copy but retains other bonuses",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 for(const [suffix,trait]of [["#hate","dexterity"],["#vigueur","strength"]]){
  const key=Object.keys(templates).find(k=>k.endsWith(suffix));assert.ok(key);
  const old={id:"old",system:{stackId:key,changes:[{key:`system.effective.traits.${trait}`,type:"override",value:"2"}]}},other={id:"other",system:{stackId:"other",changes:[]}};
  let created,clones=0;
  const actor={effects:[old,other],canUserModify:()=>true,getTraitValue:()=>2,
   clone:async(data,options)=>{clones++;assert.equal(options.keepId,true);assert.deepEqual(data.effects.map(e=>e.id),["other"]);return {getTraitValue:()=>1};},
   createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key);
  assert.equal(clones,1);assert.deepEqual(actor.effects,[old,other]);
  assert.equal(created.system.changes.find(c=>c.key===`system.effective.traits.${trait}`).value,"2","must not increase to 4 from the previous effect's effective 2");
 }
});
test("a PC may use a granted reserve only for its granted attack; disabling the effect removes the reserve",()=>{
 const weapon={id:"extra",name:"Extra attack",type:"weapon",system:{category:"natural",combatSpecialty:"natural",naturalCombatPoints:5,naturalCombatPool:"extra"},flags:{[S]:{transformationGrant:"form"}}};
 const actor={type:"character",system:{skills:{fighting:{value:1}},combatPools:{},resources:{combat:{}}},items:[weapon],effects:[effect({})],getSkillValue:()=>1,findRuleKnowledge:()=>null};
 const pool=resolveCombatPools({actor,item:weapon,context:{action:"attack"}}).pools.find(p=>p.id==="natural:extra");
 assert.equal(pool.max,5);assert.equal(pool.eligible,true);
 const other=resolveCombatPools({actor,item:{id:"other",type:"weapon",system:{category:"natural"}},context:{action:"attack"}}).pools.find(p=>p.id==="natural:extra");
 assert.equal(other.eligible,false);
 actor.effects[0].disabled=true;
 assert.ok(!resolveCombatPools({actor,item:weapon,context:{action:"attack"}}).pools.some(p=>p.id==="natural:extra"));
});

test("a hand-created rage effect exposes all consequences and spends its temporary health before ordinary health",async()=>{
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 const rage={id:"rage",name:"Rage",system:{changes:structuredClone(templates[key].changes)}};
 const actor={type:"character",isOwner:true,items:[],effects:[rage],system:{effective:{traits:{}},resources:{body:{value:32,max:43}},modifiers:{}},_source:{system:{resources:{body:{value:32}}}}};
 const set=(object,path,value)=>{const parts=path.split('.'),last=parts.pop();parts.reduce((o,k)=>o[k]??={},object)[last]=value;};
 actor.updateEmbeddedDocuments=async(type,rows)=>{assert.equal(type,"ActiveEffect");for(const row of rows)for(const [key,value]of Object.entries(row))if(key!=="_id")set(rage,key,value);};
 actor.update=async updates=>{for(const [key,value]of Object.entries(updates)){set(actor,key,value);set(actor._source,key,value);}};
 const rules=effectRules(rage);
 assert.equal(rage.system.changes.find(c=>c.key==="system.resources.body.temporaryMax").value,"5");assert.equal(rules.fearFactor,"1d10");
 assert.equal(rules.noParry,true);assert.equal(rules.noDodge,true);assert.equal(rules.ignoreFear,true);
 assert.equal(rules.damage,undefined);
 assert.ok(rage.system.changes.some(c=>c.key==="system.modifiers.damageByUsage.melee"&&c.type==="add"&&c.value==="2"));
 actor.transformationProfile=transformationProfile(actor);
 assert.equal(effectStatus(actor).temporaryHP,5);
 let result=await applyDamageToActor({actor,damage:3,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,3);assert.equal(result.bodyDamage,0);
 assert.equal(actor.system.resources.body.value,32);assert.equal(effectStatus(actor).temporaryHP,2);
 result=await applyDamageToActor({actor,damage:4,ignoreArmor:true,announce:false});
 assert.equal(result.temporaryDamage,2);assert.equal(result.bodyDamage,2);assert.equal(actor.system.resources.body.value,30);
 assert.equal(effectStatus(actor).temporaryHP,0);
 rage.disabled=true;assert.equal(temporaryHealthGrants(actor).length,0);
 rage.disabled=false;assert.equal(temporaryHealthState(actor).current,0,"a reprepare without a maximum transition cannot refill health");
 actor.effects=[];assert.equal(actor.system.resources.body.value,30,"removing Rage cannot erase wounds");
});

test("state panels reflect movement, named fear immunity and editable restrictions for characters and NPCs",()=>{
 for(const type of ["character","npc"]){
  const form={id:"custom",name:"Effet du MJ",system:{changes:changesFromRules({movement:[{mode:"flight",method:"replace",value:24}],ignoreFear:true,noParry:true})}};
  const actor={type,system:{effective:{traits:{}},modifiers:{movement:2}},effects:[form]};
  actor.transformationProfile=transformationProfile(actor);
  actor.transformationMovement=movementProfile(12,[{mode:"terrestre",max:"10 m"}],actor.transformationProfile.movements,2);
  const state=effectStatus(actor);
  assert.deepEqual(state.movement.map(row=>row.value),[12,24]);
  assert.equal(state.immunity,"Effet du MJ");assert.match(state.notes[0].details,/noParry/);
  form.system.changes=changesFromRules({movement:[{mode:"swim",method:"replace",value:8}]});
  actor.transformationProfile=transformationProfile(actor);
  assert.equal(effectStatus(actor).immunity,"");assert.equal(actor.transformationProfile.noParry,false);
 }
});

test("cancel and close never validate a duration or apply an effect",async()=>{
 globalThis.game={user:{},i18n:{localize:key=>key}};
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 for(const answer of [null,false,"cancel","close",{action:"cancel"}]){
  globalThis.foundry.applications.api.DialogV2.wait=async()=>answer;
  const actor={canUserModify:()=>true,createTrudvangEffect:()=>assert.fail("cancel cannot create an effect")};
  assert.equal(await applyTransformation(actor,key),null);
 }
});

test("manually edited attack changes update granted items and concurrent hooks cannot duplicate them",async()=>{
 globalThis.game={i18n:{localize:key=>key}};
 let next=0;
 const actor={uuid:"Actor.custom",isOwner:true,items:[],async createEmbeddedDocuments(type,items){
  for(const item of items)this.items.push({...item,id:String(++next)});
 },async deleteEmbeddedDocuments(type,ids){this.items=this.items.filter(i=>!ids.includes(i.id));}};
 const form={id:"custom",parent:actor,system:{changes:changesFromRules({attacks:[{name:"Griffes",damage:"1d10",combatPoints:5}]})}};
 await Promise.all([syncEffectGrants(form),syncEffectGrants(form)]);
 assert.equal(actor.items.length,1);assert.equal(next,1);
 form.system.changes=changesFromRules({attacks:[{name:"Morsure",damage:"2d10",combatPoints:10}]});
 await syncEffectGrants(form);assert.equal(actor.items.length,1);assert.equal(actor.items[0].system.damage,"2d10");
 form.system.changes=[];await syncEffectGrants(form);assert.equal(actor.items.length,0);
});

test("profile values round-trip through editable changes without hidden configuration",()=>{
 const rules={temporaryHP:5,ignoreFear:true,fearFactor:"1d10",movement:[{mode:"flight",method:"replace",value:24}],damage:{value:2,usages:["melee"]}};
 assert.deepEqual(rulesFromChanges(changesFromRules(rules,{priority:20})),rules);
 const legacy=effect({ignoreFear:true},{system:{changes:[]}});
 assert.equal(effectRules(legacy).ignoreFear,true);
 legacy.flags[S].transformation.editableChanges=true;
 assert.deepEqual(effectRules(legacy),{},"clearing migrated rows cannot revive old hidden properties");
 assert.equal(validProfileChange({key:"system.transformation.movement",value:"not JSON"}),false);
 assert.deepEqual(rulesFromChanges([{key:"system.transformation.movement",type:"override",value:"not JSON"}]),{},"invalid module data cannot break actor preparation");
});

test("dropping an edited reference keeps the GM's changes rather than resetting to the catalogue",async()=>{
 globalThis.game={user:{id:"owner"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 let result;
 const actor={isOwner:true,system:{},items:[],canUserModify:()=>true,getActiveTokens:()=>[],createTrudvangEffect:async data=>(result=data,{...data,id:"edited"})};
 const source={documentName:"ActiveEffect",name:"Rage ajustée",uuid:"Actor.a.ActiveEffect.rage",description:"Description du MJ",
  system:{changes:changesFromRules({temporaryHP:9,ignoreFear:false},{priority:7})},statuses:new Set(["prone"])};
 await applyTransformation(actor,key,{source});
 assert.equal(result.name,"Rage ajustée");assert.equal(result.description,"Description du MJ");
 assert.equal(effectRules(result).temporaryHP,9);assert.equal(effectRules(result).ignoreFear,false);
 assert.ok(result.system.changes.every(c=>c.priority===7));assert.deepEqual(result.statuses,["prone"]);
});

test("only the elected GM synchronizes grants when a player applies an effect",async()=>{
 const users=[];users.activeGM={id:"gm",isSelf:false};
 globalThis.game={user:{id:"player"},users,i18n:{localize:key=>key}};
 let creations=0;
 const actor={uuid:"Actor.authority",isOwner:true,items:[],createEmbeddedDocuments:async()=>{creations++;}};
 const form={id:"effect",parent:actor,system:{changes:changesFromRules({attacks:[{name:"Bec",damage:"1d10"}]})}};
 await syncEffectGrants(form);assert.equal(creations,0,"the applying player must defer to the GM's creation hook");
 game.user={id:"gm"};users.activeGM.isSelf=true;
 await syncEffectGrants(form);assert.equal(creations,1);
});

test("compendium and chat effect references with cyclic native changes produce plain creation payloads",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 const key="holy-joaringfaith-fury-of-ogon:rage:2#rage";
 for(const kind of ["ActiveEffect","Item"]){
  const system={changes:[]};
  class ChangeModel{constructor(data){Object.assign(this,data);this.parent=system;}}
  system.changes=templates[key].changes.map(c=>new ChangeModel(c));
  const effect={documentName:"ActiveEffect",name:"Rage du MJ",system,statuses:new Set(),flags:{[S]:{transformation:{key}}}};
  const source=kind==="ActiveEffect"?effect:{documentName:"Item",type:"effect",effects:[effect]};
  let created;
  const actor={isOwner:true,system:{},items:[],canUserModify:()=>true,getActiveTokens:()=>[],
   createTrudvangEffect:async data=>{
    // JSON cannot serialize a DataModel's parent graph. Foundry's deepClone
    // hits its maximum depth first; this boundary must contain only source data.
    assert.doesNotThrow(()=>JSON.stringify(data));
    created=data;return {...data,id:"rage"};
   }};
  await applyTransformation(actor,key,{source});
  assert.equal(created.name,"Rage du MJ");
  assert.equal(created.system.changes.find(c=>c.key==="system.modifiers.rolls.attack").value,"1");
  assert.equal(temporaryHealthGrants({effects:[created]}).reduce((n,r)=>n+r.remaining,0),5);
 }
});


test("raven movement multipliers change metres per 2 CP without changing maxima",()=>{
 const changes=[{mode:"land",method:"multiply",value:0.5},{mode:"flight",method:"baseMultiple",value:4}];
 assert.deepEqual(movementDetails(14,[],changes),{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}});
 const rows=[{mode:"terrestre",distance:"1 m",max:"14 m"}];
 assert.deepEqual(movementDetails(14,rows,changes),{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}});
 assert.deepEqual(movementDetails(14,rows,[]),{land:{max:14,metersPerTwo:1}});
 assert.deepEqual(movementDetails(14,[{mode:"terrestre",distance:"1,5 m",max:"14 m"}],changes),{land:{max:14,metersPerTwo:0.75},flight:{max:14,metersPerTwo:6}});
});


test("both shipped raven forms preserve movement maxima on PJ and PNJ profiles",()=>{
 for(const template of Object.values(templates).filter(t=>["aspect-du-corbeau","aspect-animal-corbeau"].includes(t.id))){
  const rules=rulesFromChanges(template.changes);
  for(const rows of [[],[{mode:"terrestre",distance:"1 m",max:"14 m"}]]){
   const movement=movementDetails(14,rows,rules.movement);
   assert.deepEqual(movement,{land:{max:14,metersPerTwo:0.5},flight:{max:14,metersPerTwo:4}},template.id);
  }
 }
});


test("effect names identify their source in both languages and decimal movement has at most two places",()=>{
 for(const code of ["fr","en"]){
  const lang=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  const names=Object.values(lang.TRUDVANG.Content.Transformation).map(row=>row.Name);
  assert.equal(new Set(names).size,names.length);
 }
 assert.equal(movementDetails(10,[],[{mode:"land",method:"multiply",value:1/3}]).land.metersPerTwo,0.33);
 assert.equal(movementDetails(10,[],[{mode:"land",method:"multiply",value:2/3}]).land.metersPerTwo,0.67);
 assert.equal(movementDetails(10,[],[{mode:"land",method:"replace",value:12.3456}]).land.max,12.35);
 assert.equal(rulesFromChanges([{key:"system.transformation.defense",type:"override",value:3},{key:"system.transformation.defense",type:"multiply",value:0.555}]).defense,1.67);
});


test("linked effects apply the requested successor rather than copying their originating effect",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:120},i18n:{localize}};
 const dialogs=[];
 globalThis.foundry.applications.api.DialogV2.wait=async options=>{dialogs.push(options);return {duration:"1 minute"};};
 for(const [parentId,childId]of [["rage","frenzy-exhaustion"],["warg-disease","warg-garou"],["petrification-recovery-half","petrification-recovery-two-thirds"]]){
  const parentKey=Object.keys(templates).find(k=>k.endsWith("#"+parentId));
  const childKey=templates[parentKey].sourceId+"#"+childId;
  assert.ok(templates[childKey]);
  const parent={documentName:"ActiveEffect",uuid:"Actor.a.ActiveEffect.parent",name:"Effet initial modifié",description:"Description de l’origine",system:{stackId:parentKey,changes:[{key:"system.modifiers.rolls.attack",type:"add",value:"999"}]},statuses:["prone"],flags:{[S]:{transformation:{key:parentKey,sourceId:templates[parentKey].sourceId,related:[childId],summary:"Résumé de l’origine",appliedAt:100,editableChanges:true}}}};
  const before=structuredClone(parent);
  for(const source of [parent,{documentName:"Item",type:"effect",uuid:"Item.reference",effects:[parent]}]){
   let created;
   const actor={canUserModify:()=>true,getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
   await applyTransformation(actor,childKey,{source,elapsed:20});
   assert.equal(dialogs.at(-1).window.title,localize("TRUDVANG.Content.Transformation."+childKey+".Name"));
   assert.equal(created.name,localize("TRUDVANG.Content.Transformation."+childKey+".Name"));
   assert.equal(created.description,localize("TRUDVANG.Content.Transformation."+childKey+".Description"));
   assert.equal(created.flags[S].transformation.summary,localize("TRUDVANG.Content.Transformation."+childKey+".Summary"));
   assert.equal(created.flags[S].transformation.key,childKey);
   assert.equal(created.origin,source.uuid);
   assert.deepEqual(created.statuses,templates[childKey].statuses);
   assert.ok(!created.system.changes.some(c=>c.value==="999"));
   if(childId==="frenzy-exhaustion"){
    assert.equal(effectRules(created).durationFromElapsed,0.5);
    assert.match(dialogs.at(-1).content,/value="10 seconds"/);
   }
  }
  assert.deepEqual(parent,before);
 }
});


test("one temporary reserve clamps to either remaining maximum and persists each transition",async()=>{
 for(const removed of ["first","second"]){
  const first={id:"first",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"5"}]}},second={id:"second",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"7"}]}};
  const actor={effects:[first],_source:{system:{resources:{body:{temporary:0,temporaryMaxAtValue:-1}}}}};
  const set=(o,path,value)=>{const keys=path.split("."),leaf=keys.pop();keys.reduce((o,k)=>o[k]??={},o)[leaf]=value;};
  actor.update=async changes=>{for(const [k,v]of Object.entries(changes))set(actor._source,k,v);};
  const sync=async()=>{actor.temporaryHealthState=temporaryHealthState(actor);const {bodyHealthPersistence}=await import("../modules/rules/body-health.mjs");await actor.update(bodyHealthPersistence(actor)||{});};
  await sync();assert.equal(temporaryHealthState(actor).current,5);
  actor.effects.push(second);await sync();assert.equal(temporaryHealthState(actor).current,12);
  await setTemporaryHealth(actor,9);
  actor.effects=actor.effects.filter(e=>e.id!==removed);await sync();
  const maximum=removed==="first"?7:5;
  assert.equal(temporaryHealthState(actor).maximum,maximum);assert.equal(temporaryHealthState(actor).current,maximum);
  assert.equal(actor._source.system.resources.body.temporaryMaxAtValue,maximum);
  await sync();assert.equal(temporaryHealthState(actor).current,maximum,"reload cannot alter the reserve");
  await setTemporaryHealth(actor,2);await sync();assert.equal(temporaryHealthState(actor).current,2);
  actor.effects=[];await sync();assert.equal(temporaryHealthState(actor).current,0);
  actor.effects=[first];await sync();assert.equal(temporaryHealthState(actor).current,5);
  await setTemporaryHealth(actor,8);assert.equal(temporaryHealthState(actor).current,8);assert.equal(temporaryHealthState(actor).maximum,8);
 }
});

test("rolled vitality posts the actual dice to the normal chat pipeline for Dice So Nice",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize}};
 const previousRoll=globalThis.Roll,previousChat=globalThis.ChatMessage;
 const posted=[];let created;
 try{
  globalThis.Roll=class {constructor(formula){this.formula=formula;}async evaluate(){this.total=13;return this;}async toMessage(options){posted.push({roll:this,options});}};
  globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.id})};
  globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
  const key=Object.keys(templates).find(k=>k.endsWith("#boiling-blood"));
  const actor={id:"target",canUserModify:()=>true,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,key);
  assert.equal(posted.length,1);assert.equal(posted[0].roll.formula,"2d10");assert.equal(posted[0].roll.total,13);
  assert.equal(posted[0].options.speaker.actor,"target");
  assert.ok(created.system.changes.some(c=>c.key==="system.modifiers.bodyMax"&&c.value==="13"));
  assert.ok(created.system.changes.some(c=>c.key==="system.modifiers.bodyValue"&&c.value==="13"));
  const vitalityTemplates=Object.entries(templates).filter(([,t])=>rulesFromChanges(t.changes).vitality);
  assert.equal(vitalityTemplates.length,6);
  for(const [vitalityKey,template]of vitalityTemplates){
   const boost=template.parameters.find(p=>p.target==="vitality");assert.ok(boost,vitalityKey);
   globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",[`boost${boost.index}`]:3});
   await applyTransformation(actor,vitalityKey);
   for(const field of ["bodyMax","bodyValue"]){
    const rows=created.system.changes.filter(c=>c.key===`system.modifiers.${field}`);
    assert.equal(rows.length,1,vitalityKey);assert.equal(rows[0].value,"16");assert.equal(rows[0].type,"add");
   }
   assert.ok(!created.system.changes.some(c=>/temporary/.test(c.key)),vitalityKey);
  }
  globalThis.foundry.applications.api.DialogV2.wait=async()=>({duration:"1d6 + 2 jours"});
  posted.length=0;await applyTransformation(actor,key);
  assert.deepEqual(posted.map(p=>p.roll.formula.trim()),["1d6 + 2","2d10"]);
  assert.equal(created.duration.value,13);
  assert.match(posted[0].options.flavor,/Durée/);
  for(const p of posted)assert.equal(p.options.speaker.actor,"target");
  posted.length=0;
  assert.equal((await resolveDuration("1d10 (JO 7-10) jours",{actor,name:"Pétrification"})).value,13);
  assert.equal(posted[0].roll.formula.trim(),"1d10 xo>=7");
  for(const template of Object.values(templates).filter(t=>/\dd\d/i.test(t.duration??""))){
   posted.length=0;
   await resolveDuration(template.duration,{actor,name:template.id});
   assert.equal(posted.length,1,template.id);
  }
 }finally{globalThis.Roll=previousRoll;globalThis.ChatMessage=previousChat;}
});


test("effect improvements change their base fields, including inverse traits, attack dice and unrestricted manual counts",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key,format:(key,data)=>(key.split(".").reduce((o,k)=>o?.[k],language)??key).replaceAll("{value}",String(data.value))}};
 let created,answers,dialog;
 foundry.applications.api.DialogV2.wait=async options=>{dialog=options;return {duration:"1 minute",...answers};};
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 const apply=async(key,fields={})=>{answers=fields;await applyTransformation(actor,key);return created;};
 for(const [key,template]of Object.entries(templates).filter(([k,t])=>!t.itemOnly&&!t.weaponDamage&&!t.armorBlessing&&!k.includes("huvfurwurm")&&t.parameters.some(p=>p.target==="duration"&&p.value===5))){
  const p=template.parameters.find(p=>p.target==="duration"&&p.value===5);
  assert.equal((await apply(key,{["boost"+p.index]:7})).duration.value,19,key);
  assert.doesNotMatch(dialog.content,/name="boost\d+"[^>]*\bmax=/,key);
 }
 for(const [key,template]of Object.entries(templates).filter(([,t])=>t.parameters.some(p=>p.target==="traitDegrees"))){
  const p=template.parameters.find(p=>p.target==="traitDegrees"),base=rulesFromChanges(template.changes).traits[0];
  const result=await apply(key,{["boost"+p.index]:2});
  assert.equal(result.system.changes.find(c=>c.key==="system.effective.traits."+p.trait).value,String(Math.sign(base.value)*4));
 }
 for(const [key,template]of Object.entries(templates).filter(([,t])=>!t.rolledModifier&&t.parameters.some(p=>p.target==="modifier"))){
  const p=template.parameters.find(p=>p.target==="modifier"),base=Number(template.changes.find(c=>c.key===p.key).value);
  assert.equal((await apply(key,{["boost"+p.index]:7})).system.changes.find(c=>c.key===p.key).value,String(base+7*p.value));
 }
 const tusks=Object.keys(templates).find(k=>k.endsWith("#defenses-du-mastomant"));assert.ok(tusks);
 for(let count=0;count<=4;count++){
  const rules=effectRules(await apply(tusks,{boost2:count}));
  assert.equal(rules.attacks[0].damage,count===4?"1d10 + 1":"1d10");
  assert.equal(rules.attacks[0].openRoll,[0,10,9,8,8][count]);
 }
 const snake=Object.keys(templates).find(k=>k.endsWith("#aspect-du-serpent-geant"));
 const result=await apply(snake,{boost3:1});
 assert.equal(result.system.changes.find(c=>c.key==="system.effective.traits.strength").value,"6");
 assert.equal(effectRules(result).fearFactor,"1d10");
 assert.equal(effectRules(result).powerIds.length,2);assert.equal(effectRules(result).capabilityNames,undefined);
 const water=Object.keys(templates).find(k=>k.endsWith("#don-de-l-eau"));
 assert.equal(effectRules(await apply(water,{powerLevel:4})).knowledge.swimming,8);
 const {BESTIARY_ENTRIES}=await import("../modules/bestiary-catalog-data.mjs");
 const form=BESTIARY_ENTRIES[0];
 const animal=Object.entries(templates).find(([,t])=>{const r=rulesFromChanges(t.changes);return r.chooseBestiary&&!r.preserveHP;})[0];
 assert.equal((await apply(animal,{form:form.id})).system.changes.find(c=>c.key==="system.resources.body.max").value,String(form.actor.system.resources.body.max));
 const physical=Object.entries(templates).find(([,t])=>{const r=rulesFromChanges(t.changes);return r.chooseBestiary&&r.preserveHP;})[0];
 assert.ok(!(await apply(physical,{form:form.id})).system.changes.some(c=>c.key==="system.resources.body.max"));
 const fists=Object.keys(templates).find(k=>k.endsWith("#poings-d-acier"));assert.ok(fists);
 for(let level=1;level<=5;level++){
  const attack=effectRules(await apply(fists,{runeLevel:level})).attacks[0];
  assert.equal(attack.isUnarmed,true);assert.equal(attack.damage,["1d6","1d6 + 2","1d10 + 2","1d10 + 2","1d10 + 2"][level-1]);
  assert.equal(attack.openRoll,[0,0,0,10,9][level-1]);
 }
});

test("bestiary forms retain fractional Size, movement rates, maxima and physical-trait defaults",()=>{
 const form={actor:{system:{details:{size:"<1/3",move:[{mode:"terrestre",distance:"4 m",max:"20 m"},{mode:"vol",distance:"0,5 m",max:"12 m"}],naturalArmor:2},traits:{strength:1},resources:{body:{max:18}}},items:[]},featIds:[]};
 const {rules,maximum}=selectFormData(form,"animal");assert.equal(maximum,18);assert.equal(rules.size,"<1/3");
 assert.equal(validProfileChange(changesFromRules({size:rules.size})[0]),true);
 assert.equal(rules.traits.find(r=>r.trait==="constitution").value,0);assert.ok(!rules.traits.some(r=>r.trait==="intelligence"));
 assert.deepEqual(movementDetails(14,[{mode:"nage",distance:"2 m",max:"15 m"}],rules.movement),{swim:{max:0,metersPerTwo:0},land:{max:20,metersPerTwo:4},flight:{max:12,metersPerTwo:0.5}});
 const physical=selectFormData(form,"physical").rules;
 assert.ok(!physical.traits.some(r=>["constitution","psyche","intelligence"].includes(r.trait)));
});

test("snake grants the actual divine powers, and resolved steel fists grant no duplicate weapon",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",has:key=>localize(key)!==key,localize,format:(key,data)=>Object.entries(data).reduce((s,[k,v])=>s.replaceAll("{"+k+"}",v),localize(key))}};
 const key=Object.keys(templates).find(k=>k.endsWith("#aspect-du-serpent-geant"));
 const e={id:"snake",name:"Serpent",system:{changes:templates[key].changes}};
 let items=[];const actor={isOwner:true,items:[],createEmbeddedDocuments:async(type,data)=>{assert.equal(type,"Item");items=data;}};
 await syncEffectGrants(e,actor);
 assert.deepEqual(items.filter(i=>i.type==="divineFeat").map(i=>i.system.catalogId),effectRules(e).powerIds);
 assert.deepEqual(items.filter(i=>i.type==="divineFeat").map(i=>i.name),["Constriction","Regard paralysant"]);
 items=[];await syncEffectGrants({id:"fists",system:{changes:changesFromRules({attacks:[{name:"Poings",damage:"1d6",isUnarmed:true}]})}},actor);assert.deepEqual(items,[]);
});

test("reference effects contain no invented fox stealth or animal night vision, and tree recovery changes actual movement",()=>{
 for(const code of ["fr","en"]){
  const language=JSON.parse(fs.readFileSync(new URL("../lang/"+code+".json",import.meta.url)));
  const data=Object.entries(templates).map(([key,t])=>({...t,name:language.TRUDVANG.Content.Transformation[key].Name,description:language.TRUDVANG.Content.Transformation[key].Description,summary:language.TRUDVANG.Content.Transformation[key].Summary}));
  for(const e of data.filter(e=>e.id.startsWith("esprit-de-la-bete-")&&!e.id.endsWith("corbeau"))){
   const r=rulesFromChanges(e.changes);assert.equal(r.vision,undefined,e.name);assert.equal(r.senses,undefined,e.name);
   assert.doesNotMatch(e.description,/vision nocturne|night vision/i,e.name);
   if(e.id.endsWith("renard"))assert.deepEqual(r.knowledge,{thievery:3});
  }
  const water=data.find(e=>e.id==="don-de-l-eau");assert.doesNotMatch(water.summary+water.description,/respir|breath/i);
 }
 for(const t of Object.values(templates).filter(t=>t.id==="tree-recovery"))assert.equal(movementDetails(14,[],rulesFromChanges(t.changes).movement).land.metersPerTwo,0.5);
});

test("huvfurwurm effects grant real weapon profiles with reserved CP, gated ordinary actions and shared spending",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize}};
 const original={id:"bow",name:"Arc",type:"weapon",system:{equipped:true,category:"ranged",combatSpecialty:"bowsSlings",damage:"1d10 + 2",openRoll:10,weaponActions:2,weaponActionsSpent:0,range:{short:40,long:80}},toObject(){return {name:this.name,type:this.type,system:structuredClone(this.system),effects:[{name:"Transferred"}]};}};
 const offhand={id:"sword",type:"weapon",system:{equipped:true,category:"oneHandedLight",weaponActions:3,weaponActionsSpent:0}};
 for(const [suffix,actions,cp]of [["ravage-du-huvfurwurm",1,5],["attaque-du-huvfurwurm",2,10]]){
  const key=Object.keys(templates).find(k=>k.endsWith("#"+suffix));assert.ok(key);
  let created,granted=[];const items=[original,offhand];items.get=id=>items.find(i=>i.id===id);
  const actor={type:"character",id:"hero",isOwner:true,items,effects:[],system:{skills:{fighting:{value:12}}},canUserModify:()=>true,createTrudvangEffect:async data=>{created=data;return null;},createEmbeddedDocuments:async(type,rows)=>{granted=rows;}};
  foundry.applications.api.DialogV2.wait=async()=>({duration:"3 tours de jeu",weapon:"bow",boost0:2});
  await applyTransformation(actor,key);
  assert.equal(created.duration.value,5);
  assert.deepEqual(effectRules(created).extraWeaponAction,{combatPoints:cp,actions,weaponId:"bow"});
  const e={id:"arms",...created};await syncEffectGrants(e,actor);assert.equal(granted.length,1);
  const bonus={id:"extra",...granted[0]};items.push(bonus);actor.effects.push(e);
  assert.equal(bonus.system.category,"ranged");assert.equal(bonus.system.combatSpecialty,"bowsSlings");assert.deepEqual(bonus.system.range,original.system.range);
  assert.equal(bonus.system.damage,original.system.damage);assert.equal(bonus.system.openRoll,10);assert.deepEqual(bonus.effects,[]);
  assert.equal(resolveWeaponActions({item:bonus,actor}).value,actions);
  original.system.weaponActionsSpent=0;offhand.system.weaponActionsSpent=0;
  const pools=item=>resolveCombatPools({actor,item,context:{action:"attack"}});
  assert.equal(extraWeaponActionReady(actor,bonus),false);assert.equal(pools(bonus).eligibleCurrent,0);
  original.system.weaponActionsSpent=2;
  assert.equal(extraWeaponActionReady(actor,bonus),false,"other ordinary weapon actions still available");
  offhand.system.weaponActionsSpent=3;
  assert.equal(extraWeaponActionReady(actor,bonus),true);assert.equal(pools(bonus).eligibleCurrent,cp);
  assert.deepEqual(pools(bonus).eligible.map(p=>p.id),["natural:effect:arms"]);
  assert.ok(!pools(original).eligible.some(p=>p.id==="natural:effect:arms"));
  assert.ok(!resolveCombatPools({actor,context:{action:"movement"}}).eligible.some(p=>p.id==="natural:effect:arms"));
  bonus.system.naturalCombatPointsSpent=3;assert.equal(pools(bonus).eligibleCurrent,cp-3);
  e.disabled=true;assert.equal(pools(bonus).eligibleCurrent,0);e.disabled=false;e.duration.expired=true;assert.equal(pools(bonus).eligibleCurrent,0);
  assert.ok(!readiedHandConflicts([bonus],{id:"other",type:"weapon",system:{category:"twoHanded"}}).length);
 }
});

test("all numeric non-duration improvements resolve from casting counts and compendium copies",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key,format:(key,data)=>(key.split(".").reduce((o,k)=>o?.[k],language)??key).replaceAll("{value}",String(data.value))}};
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 for(const [key,t]of Object.entries(templates))for(const p of t.parameters.filter(p=>!t.rolledModifier&&["protection","temporaryHP","damage","modifier","traitValue"].includes(p.target))){
  const counts=[];counts[p.index]=2;
  for(const source of [null,{documentName:"Item",type:"effect",effects:[{flags:{[S]:{transformation:{key}}},system:{changes:structuredClone(t.changes)}}]}]){
   await applyTransformation(actor,key,{source,counts});
   const base=path=>t.changes.filter(c=>c.key===path).reduce((n,c)=>n+Number(c.value),0);
   const value=path=>created.system.changes.filter(c=>c.key===path).reduce((n,c)=>n+Number(c.value),0);
   if(p.target==="protection")assert.equal(value("system.modifiers.protection"),base("system.modifiers.protection")+2*p.value,key);
   if(p.target==="temporaryHP")assert.equal(value("system.resources.body.temporaryMax"),base("system.resources.body.temporaryMax")+2*p.value,key);
   if(p.target==="modifier")assert.equal(value(p.key),base(p.key)+2*p.value,key);
   if(p.target==="traitValue")assert.equal(value(`system.effective.traits.${p.trait}`),8,key);
   if(p.target==="damage"){
    const keys=p.usages?.map(u=>`system.modifiers.damageByUsage.${u}`)??t.changes.filter(c=>c.key==="system.modifiers.damage"||c.key.startsWith("system.modifiers.damageByUsage.")).map(c=>c.key);
    for(const path of keys)assert.equal(value(path),base(path)+2*p.value,key);
    if(p.usages)assert.equal(value("system.modifiers.damage"),base("system.modifiers.damage"),"scoped improvement preserves the universal base bonus");
   }
  }
 }
 for(const stem of ["holy-gerbanis-strength-of-stormi:jotun-strength:6","holy-gerbanis-power-of-enken:heart-of-enken:6"]){
  const main=sources[stem][0],ally=sources[stem][1];assert.ok(ally);
  assert.ok(!templates[main].parameters.some(p=>p.index===4));
  assert.ok(templates[ally].parameters.some(p=>p.index===4));
  await applyTransformation(actor,ally,{counts:[0,0,0,0,1]});
  assert.equal(created.system.changes.find(c=>c.key.startsWith("system.effective.traits.")).value,"6");
 }
});

test("an older chat card applies the captured option identity even when its saved position differs",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 const [key,t]=Object.entries(templates).find(([,entry])=>entry.parameters.some(p=>p.target==="modifier"&&p.optionId));
 const parameter=t.parameters.find(p=>p.target==="modifier"&&p.optionId);
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 const context={sourceId:t.sourceId,counts:[99],countsById:{[parameter.optionId]:2}};
 await applyTransformation(actor,key,{counts:[99],context});
 const value=rows=>rows.filter(c=>c.key===parameter.key&&c.type==="add").reduce((n,c)=>n+Number(c.value),0);
 assert.equal(value(created.system.changes),value(t.changes)+2*parameter.value);
 assert.equal(created.flags[S].transformation.ruleTestContext.countsById[parameter.optionId],2);
});

test("copying already resolved effects preserves improvements, duration and rolled vitality instead of applying them twice",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize:key=>key.split(".").reduce((o,k)=>o?.[k],language)??key,format:(key,data)=>(key.split(".").reduce((o,k)=>o?.[k],language)??key).replaceAll("{value}",String(data.value))}};
 let created,rolls=0;
 const oldRoll=globalThis.Roll,oldChat=globalThis.ChatMessage;
 try{
  globalThis.Roll=class {async evaluate(){this.total=7;rolls++;return this;}async toMessage(){}};
  globalThis.ChatMessage={getSpeaker:()=>({})};
  const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[{type:"ability",name:"Matériaux durs",system:{kind:"specialty",catalogId:"hardMaterials",level:1}}],getCatalogEntry:()=>({parentCatalogId:"handicraft"}),createTrudvangEffect:async data=>{created=data;return null;}};
  foundry.applications.api.DialogV2.wait=async options=>({duration:options.content.match(/name="duration"[^>]*value="([^"]*)"/)?.[1]||"1 minute",effectInput:"hardMaterials"});
  const covered=new Set();
  for(const [key,t]of Object.entries(templates)){
   const rules=rulesFromChanges(t.changes);
   if(rules.chooseBestiary||rules.formName||rules.extraWeaponAction||rules.unarmedDamage||t.levelParameter||t.weaponDamage||t.armorBlessing||t.itemOnly)continue;
   if(!t.parameters.length&&!rules.vitality)continue;
   const counts=[];for(const p of t.parameters){counts[p.index]=2;covered.add(p.target);}
   await applyTransformation(actor,key,{counts});const first=structuredClone(created),beforeRolls=rolls;
   for(const legacy of [false,true]){
    const source={documentName:"ActiveEffect",...structuredClone(first)};
    if(legacy)delete source.flags[S].transformation.resolved;
    await applyTransformation(actor,key,{source});
    assert.deepEqual(created.system.changes,first.system.changes,key);
    assert.deepEqual(created.duration,first.duration,`${key}: duration is not shortened or improved twice`);
    assert.equal(rolls,beforeRolls,`${key}: copying the resolved result does not reroll vitality`);
   }
  }
  for(const target of ["duration","vitality","temporaryHP","protection","damage","modifier","traitDegrees","traitValue","attackStep","senseRange"])assert.ok(covered.has(target),target);
 }finally{globalThis.Roll=oldRoll;globalThis.ChatMessage=oldChat;}
});

test("selected bestiary forms transfer localized, editable sensory profiles rather than only Vision abilities",()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 globalThis.game={i18n:{localize:key=>key.split('.').reduce((o,k)=>o?.[k],language)??key}};
 const form={actor:{system:{details:{size:1,move:[]},traits:{},resources:{body:{max:20}},senses:[{type:"normal",labelKey:"TRUDVANG.Senses.Types.normal",range:null,enabled:true},{type:"other",label:"Odorat exceptionnel",range:30,enabled:true} ]},items:[]},featIds:[]};
 const {rules}=selectFormData(form,"physical");
 assert.equal(rules.sensesReplace,true);assert.equal(rules.senses[0].label,"Vision normale");assert.equal(rules.senses[1].label,"Odorat exceptionnel");
 assert.ok(changesFromRules(rules).every(validProfileChange));
 const actor={system:{senses:[{type:"night",label:"Vision nocturne",range:60,enabled:true}]},effects:[effect(rules)]};
 assert.equal(transformationProfile(actor).sensory.some(s=>s.type==="night"),false);
 actor.effects=[];assert.equal(transformationProfile(actor).sensory[0].type,"night");
});

test("a linked recovery is independent of the original casting target reservation and lifetime",async()=>{
 const id="vitner-soil-craft:petrify-remove-petrification:8",parentKey=`${id}#petrification-annuler-une-petrification`,childKey=`${id}#petrification-recovery-half`;
 const prior={game:globalThis.game,dialog:foundry.applications.api.DialogV2.wait};
 try {
  globalThis.game={user:{id:"gm"},time:{worldTime:120},i18n:{localize:key=>key,format:key=>key}};
  foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
  const parent={documentName:"ActiveEffect",uuid:"Actor.a.ActiveEffect.petrified",system:{stackId:parentKey},flags:{[S]:{transformation:{key:parentKey,sourceId:id,related:["petrification-recovery-half"],ruleTestContext:{sourceId:id,kind:"spell",castingId:"old-cast",casterUuid:"Actor.mage",counts:[],countsById:{}}}}}};
  let created;const actor={uuid:"Actor.a",canUserModify:()=>true,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,childKey,{source:parent});
  assert.equal(created.flags[S].transformation.ruleTestContext.castingId,undefined);
  assert.equal(created.flags[S].transformation.ruleTestContext.casterUuid,"Actor.mage");
  assert.equal(created.flags[S].transformation.key,childKey);
 }finally {globalThis.game=prior.game;foundry.applications.api.DialogV2.wait=prior.dialog;}
});

test("conditional healing bonus reads the originating frozen levels and disappears when disabled",async()=>{
 const {conditionalSituationBonuses}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="holy-gerbanis-warmth-of-sunvei:healing-warmth:5",effect={flags:{"trudvang-chronicles":{transformation:{key:`${id}#chaleur-guerisseuse`,sourceId:id,ruleTestContext:{countsById:{[`${id}:1`]:2}}}}}};
 assert.deepEqual(conditionalSituationBonuses(effect).map(row=>row.value),[5]);
 effect.disabled=true;assert.deepEqual(conditionalSituationBonuses(effect),[]);
 effect.disabled=false;effect.duration={expired:true};assert.deepEqual(conditionalSituationBonuses(effect),[]);
});

test("Grip exposes its climbing skill bonus from the frozen power levels",async()=>{
 const {conditionalSituationBonuses}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="vitner-body-vitner:grip:0",effect={flags:{"trudvang-chronicles":{transformation:{key:`${id}#adherence`,sourceId:id,ruleTestContext:{countsById:{[`${id}:4`]:3}}}}}};
 assert.deepEqual(conditionalSituationBonuses(effect).map(({skill,value})=>({skill,value})),[{skill:"agility",value:8}]);
});

test("Sense of Smell has distinct bonuses and penalties with the allocated levels",async()=>{
 const {conditionalSituationBonuses}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="vitner-body-vitner:sense-of-smell:3";
 for(const [variant,expected] of [["ameliore",6],["affaibli",-6]]){
  const key=`${id}#${variant}`,t=templates[key],effect={flags:{[S]:{transformation:{key,sourceId:id,ruleTestContext:{countsById:{[`${id}:7`]:3}}}}}};
  assert.equal(conditionalSituationBonuses(effect)[0].value,expected);
  if(variant==="ameliore")assert.equal(rulesFromChanges(t.changes).senses[0].range,50);
 }
});

test("only active effects explicitly marked for skills offer an optional modifier",async()=>{
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="vitner-body-vitner:sense-of-smell:3";
 const effect={name:"Odorat",flags:{[S]:{transformation:{key:`${id}#affaibli`,sourceId:id,ruleTestContext:{countsById:{[`${id}:7`]:2}}}}}};
 assert.deepEqual(conditionalSkillModifiers({effects:[effect]}),[{label:"Odorat",value:-5}]);
 effect.disabled=true;assert.deepEqual(conditionalSkillModifiers({effects:[effect]}),[]);
});

test("Sense of Smell applies the selected potency and range to the resulting effects",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 const id="vitner-body-vitner:sense-of-smell:3";
 for(const [variant,expected] of [["ameliore",6],["affaibli",-6]]){
  const counts=[];counts[5]=2;counts[7]=3;
  await applyTransformation(actor,`${id}#${variant}`,{counts});
  assert.match(created.flags[S].transformation.summary,new RegExp(String(expected)));
  if(variant==="ameliore")assert.equal(rulesFromChanges(created.system.changes).senses[0].range,70);
 }
});

test("impaired hearing and sight add their status at the loss threshold",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 for(const [id,status] of [["vitner-body-vitner:hearing-deafness:2","deaf"],["vitner-body-vitner:vision-blindness:4","blind"]]){
  for(const [count,expected] of [[6,[]],[7,[status]],[8,[status]]]){
   const counts=[];counts[5]=count;
   await applyTransformation(actor,`${id}#affaibli`,{counts});
   assert.deepEqual(created.statuses,expected);
  }
  const counts=[];counts[5]=8;
  await applyTransformation(actor,`${id}#ameliore`,{counts});
  assert.deepEqual(created.statuses,[]);
 }
});

test("language blessings keep their chosen language and only offer Knowledge bonuses",async()=>{
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",effectInput:"Vrok"});
 let created;
 const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 for(const [id,base] of [["holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3",2],["holy-tenetnid-tablet-of-voices:sanity-of-gave:6",3]]){
  const counts=[];counts[2]=2;await applyTransformation(actor,`${id}#langue`,{counts});
  assert.match(created.description,/Vrok/);assert.match(created.flags[S].transformation.summary,/Vrok/);
  assert.deepEqual(conditionalSkillModifiers({effects:[created]},"knowledge"),[{label:`${created.name} — Vrok`,value:base+2}]);
  assert.deepEqual(conditionalSkillModifiers({effects:[created]},"agility"),[]);
 }
});

test("Dwarven Smith only applies to the chosen Handicraft specialty",async()=>{
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="holy-haminges-power-of-men:dwarven-smith:6",effect={name:"Forgeron nain",flags:{[S]:{transformation:{key:`${id}#forge`,sourceId:id,input:"Matériaux durs",ruleTestContext:{countsById:{[`${id}:0`]:3}}}}}};
 const actor={effects:[effect],getCatalogEntry:id=>({parentCatalogId:id==="hardMaterials"?"handicraft":"healing"})};
 const item=(id,name)=>({name,system:{kind:"specialty",catalogId:id}});
 assert.deepEqual(conditionalSkillModifiers(actor,"care",item("hardMaterials","Matériaux durs"),"",{automatic:true}),[{label:"Forgeron nain — Matériaux durs",value:6}]);
 assert.deepEqual(conditionalSkillModifiers(actor,"care",item("hardMaterials","Matériaux durs")),[]);
 assert.deepEqual(conditionalSkillModifiers(actor,"care",item("hardMaterials","Matériaux souples"),"",{automatic:true}),[]);
 assert.deepEqual(conditionalSkillModifiers(actor,"care",item("healing","Matériaux durs"),"",{automatic:true}),[]);
 assert.deepEqual(conditionalSkillModifiers(actor,"care"),[]);
});

test("Animal Friend captures tablet level and applies the riding bonus only within Horsemanship",async()=>{
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="holy-toikalokke-animal-mind:animal-friend:0",lang=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],lang)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 let created,dialog;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[{type:"tablet",system:{catalogId:"holy-toikalokke-animal-mind",level:3}}],getCatalogEntry:id=>({parentCatalogId:id==="riding"?"horsemanship":"bodyControl"}),createTrudvangEffect:async data=>{created=data;return null;}};
 foundry.applications.api.DialogV2.wait=async options=>{dialog=options;return {duration:"30 minutes",powerLevel:3};};
 await applyTransformation(actor,`${id}#effect`);
 assert.match(dialog.content,/name="powerLevel"[^>]*value="3"/);assert.equal(created.flags[S].transformation.powerLevel,3);assert.match(created.description,/Maîtrise équestre : \+3/);
 actor.effects=[created];
 for(const [kind,catalogId] of [["discipline","horsemanship"],["specialty","riding"]])assert.equal(conditionalSkillModifiers(actor,"agility",{system:{kind,catalogId}},"",{automatic:true})[0].value,3);
 assert.deepEqual(conditionalSkillModifiers(actor,"agility",{system:{kind:"specialty",catalogId:"swimming"}},"",{automatic:true}),[]);
});

test("Dwarven Smith offers learned specialties and remembers their stable identity",async()=>{
 const {specialtyChoices}=await import("../modules/transformations.mjs");
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 const item=(id,name,level=1)=>({type:"ability",name,system:{kind:"specialty",catalogId:id,level}});
 const hard=item("hardMaterials","Matériaux durs"),custom=item("custom-specialty-a","Forge runique"),other=item("healing","Soins"),unlearned=item("softMaterials","Matériaux souples",0);
 let created,dialog;
 const actor={canUserModify:()=>true,items:[hard,custom,other,unlearned],getTraitValue:()=>0,getCatalogEntry:id=>({parentCatalogId:id==="healing"?"healing":"handicraft"}),createTrudvangEffect:async data=>{created=data;return null;}};
 assert.deepEqual(specialtyChoices(actor,"handicraft").map(row=>row.value),["custom-specialty-a","hardMaterials"]);
 foundry.applications.api.DialogV2.wait=async options=>{dialog=options;return {duration:"2 heures",effectInput:"custom-specialty-a"};};
 const id="holy-haminges-power-of-men:dwarven-smith:6";
 await applyTransformation(actor,`${id}#forge`);
 assert.match(dialog.content,/<select name="effectInput">/);assert.match(dialog.content,/Forge runique/);assert.doesNotMatch(dialog.content,/Matériaux souples/);
 assert.equal(created.flags[S].transformation.inputId,"custom-specialty-a");assert.match(created.description,/Forge runique/);
 actor.effects=[created];custom.name="Forge renommée";
 assert.equal(conditionalSkillModifiers(actor,"care",custom,"",{automatic:true})[0].value,6);
 assert.deepEqual(conditionalSkillModifiers(actor,"care",hard,"",{automatic:true}),[]);
});

test("Dwarven Smith reads NPC book specialties and reports an empty selection",async()=>{
 const {specialtyChoices}=await import("../modules/transformations.mjs");
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 const actor={type:"npc",items:[],system:{skillTree:[{kind:"skill",name:"Savoir-faire",skillId:"care",value:7},{kind:"discipline",name:"Artisanat",catalogId:"handicraft",value:2},{kind:"specialty",name:"Matériaux durs",catalogId:"hardMaterials",value:1}]},canUserModify:()=>true,getCatalogEntry:id=>({parentCatalogId:id==="hardMaterials"?"handicraft":"other"})};
 assert.deepEqual(specialtyChoices(actor,"handicraft"),[{value:"hardMaterials",label:"Matériaux durs"}]);
 actor.system.skillTree=[];let warned="";globalThis.ui={notifications:{warn:text=>{warned=text;}}};
 assert.equal(await applyTransformation(actor,"holy-haminges-power-of-men:dwarven-smith:6#forge"),null);
 assert.match(warned,/aucune spécialité/);
});

test("Track remembers the creature and scales its bonus without applying it to other skills",async()=>{
 const {conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 const id="holy-toikalokke-lynx-power:track:6",effect={id:"e",name:"Pistage",flags:{[S]:{transformation:{key:`${id}#pistage`,sourceId:id,input:"Loup",ruleTestContext:{countsById:{[`${id}:2`]:2}}}}}};
 const actor={effects:[effect]};
 assert.deepEqual(conditionalSkillModifiers(actor,"wilderness"),[{label:"Pistage — Loup",value:5}]);
 assert.deepEqual(conditionalSkillModifiers(actor,"care"),[]);
 assert.deepEqual(conditionalSkillModifiers(actor,"wilderness",null,"e"),[]);
});

test("Invisible to Animals remains descriptive and only improves its duration",()=>{
 const key="holy-toikalokke-animal-mind:invisible-to-animals:3#animaux",t=templates[key];
 assert.deepEqual(t.statuses,[]);assert.deepEqual(t.changes,[]);
 assert.deepEqual(t.parameters.map(p=>[p.target,p.value]),[["duration",600],["duration",3600]]);
});

test("animal tracks and animal speech preserve their narrative limits and allocated duration",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"10 tours de jeu"});
 let created;
 const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 for(const key of ["holy-toikalokke-animal-mind:animal-tracks:1#traces","holy-toikalokke-animal-mind:talk-to-animals:2#parler"]){
  assert.deepEqual(templates[key].statuses,[]);assert.deepEqual(templates[key].changes,[]);
  await applyTransformation(actor,key,{counts:[1,0,0]});assert.deepEqual(created.duration,{value:130,units:"rounds"});
 }
});

test("Animal Master is a descriptive taming effect rather than mind control",()=>{
 const key="holy-toikalokke-animal-mind:animal-master:5#apprivoise",t=templates[key];
 assert.deepEqual(t.statuses,[]);assert.deepEqual(t.changes,[]);
 assert.deepEqual(t.parameters.map(p=>[p.target,p.value]),[["duration",1800],["duration",14400]]);
 for(const code of ["fr","en"]){const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  assert.match(language.TRUDVANG.Content.Transformation[key].Description,code==="fr"?/sans apprendre à obéir/:/does not learn to obey/);
 }
});

test("script understanding and Sirowerd’s Ear keep reading and speech distinct",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",effectInput:"Vrok"});
 const ear="holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1#oreille";
 await applyTransformation(actor,ear);assert.match(created.description,/sans pouvoir la parler/);
 assert.equal(created.flags[S].transformation.input,"Vrok");assert.match(created.flags[S].transformation.summary,/Vrok/);
 const reading="vitner-power-of-thought:understanding-script:0#ecrits";
 assert.match(language.TRUDVANG.Content.Transformation[reading].Description,/savoir lire et écrire au moins une langue/);
 assert.deepEqual(templates[reading].statuses,[]);assert.deepEqual(templates[ear].statuses,[]);
});

test("Understanding Speech records the chosen language and number of listeners",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",effectInput:"Vrok"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 const counts=[];counts[2]=2;
 await applyTransformation(actor,"vitner-power-of-thought:understanding-speech:1#oral",{counts});
 assert.match(created.flags[S].transformation.summary,/2 créature/);assert.match(created.flags[S].transformation.summary,/Vrok/);
});

test("Speak to Animals retains the chosen animal and the improved range",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute",effectInput:"Loup"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"vitner-animal-vitner:speak-to-animals:1#lien",{counts:[2,0]});
 assert.equal(rulesFromChanges(created.system.changes).senses[0].range,70);
 assert.match(created.flags[S].transformation.summary,/70 m/);assert.match(created.flags[S].transformation.summary,/Loup/);
});

test("Aim scales its ranged attack modifier and its displayed explanation",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"2 tours de jeu"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"holy-toikalokke-lynx-power:aim:5#visee",{counts:[0,2]});
 assert.equal(created.system.changes.find(c=>c.key==="system.modifiers.rolls.rangedAttack").value,"3");
 assert.match(created.flags[S].transformation.summary,/\+3/);
});

test("Courage reduces fear on application with its chosen open-roll step exactly once",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 const oldRoll=globalThis.Roll,oldChat=globalThis.ChatMessage;
 try{
  let formula="",created;globalThis.Roll=class {constructor(value){formula=value;}async evaluate(){this.total=7;}};
  globalThis.ChatMessage={getSpeaker:()=>({}),create:async()=>({})};
  const actor={isOwner:true,canUserModify:()=>true,items:[],getActiveTokens:()=>[],getTraitValue:()=>0,system:{resources:{fear:{current:12,value:12}}},_source:{system:{resources:{fear:{value:12}}}},
   update:async values=>{actor._source.system.resources.fear.value=values["system.resources.fear.value"];actor.system.resources.fear.current=values["system.resources.fear.value"];},
   createTrudvangEffect:async data=>(created=data)};
  foundry.applications.api.DialogV2.wait=async()=>({duration:"5 minutes"});
  const counts=[];counts[3]=2;counts[4]=2;
  await applyTransformation(actor,"vitner-power-of-thought:courage:2#courage",{counts});
  assert.equal(formula,"1d10x>=9");assert.equal(actor.system.resources.fear.current,5);
  assert.equal(created.system.changes.find(c=>c.key==="system.modifiers.fearFactor").value,"-6");
  assert.match(created.flags[S].transformation.summary,/-6/);
  const source={documentName:"ActiveEffect",...structuredClone(created)};formula="";
  await applyTransformation(actor,"vitner-power-of-thought:courage:2#courage",{source});
  assert.equal(formula,"");assert.equal(actor.system.resources.fear.current,5);
 }finally{globalThis.Roll=oldRoll;globalThis.ChatMessage=oldChat;}
});

test("Memory keeps each allocated time unit and lifetime takes precedence",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"5 tours de jeu"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 const id="vitner-power-of-thought:memory:7#memoire";
 await applyTransformation(actor,id,{counts:[0,1,2,1,0]});
 assert.match(created.flags[S].transformation.summary,/2 semaines \+ 2 mois \+ 1 an/);
 assert.match(created.description,/2 semaines \+ 2 mois \+ 1 an/);
 await applyTransformation(actor,id,{counts:[0,1,2,1,1]});
 assert.match(created.flags[S].transformation.summary,/vie entière/);
 assert.doesNotMatch(created.flags[S].transformation.summary,/mois|semaines/);
});

test("Telepathy permits bought additional targets and never grants mind reading",()=>{
 const key="vitner-power-of-thought:telepathy:4#lien",t=templates[key];
 assert.deepEqual(t.statuses,[]);assert.deepEqual(t.changes,[]);
 for(const code of ["fr","en"]){const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  assert.match(language.TRUDVANG.Content.Transformation[key].Description,code==="fr"?/ne permet pas de lire/:/does not reveal/);
 }
});

test("Imagining preserves the thought and exposes a resistance test",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"5 minutes",effectInput:"La porte est sûre"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 const counts=[];counts[2]=2;
 await applyTransformation(actor,"vitner-power-of-thought:imagining:6#pensee",{counts});
 assert.match(created.description,/La porte est sûre/);assert.match(created.flags[S].transformation.summary,/La porte est sûre/);
 assert.match(annotateRuleTestDescription(created.description,created),/data-action="roll-rule-test"/);
 assert.equal(created.flags[S].transformation.ruleTestContext.countsById["vitner-power-of-thought:imagining:6:2"],2);
});

test("illusion variants preserve their distinctions, duration and selected range",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format:(key,data)=>localize(key).replaceAll("{value}",String(data.value))}};
 foundry.applications.api.DialogV2.wait=async()=>({duration:"1 minute"});
 let created;const actor={canUserModify:()=>true,items:[],getTraitValue:()=>0,createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"holy-haminges-power-of-trolls:illusion-tricks:2#illusions",{counts:[0,0,2]});
 assert.match(created.flags[S].transformation.summary,/15 m/);assert.match(created.description,/autres sens/);
 await applyTransformation(actor,"vitner-delusion-vitner:ghost-voice:5#voix");
 assert.match(annotateRuleTestDescription(created.description,created),/data-action="roll-rule-test"/);
 const head=language.TRUDVANG.Content.Transformation["vitner-delusion-vitner:increase-sounds:3#voix"].Description;
 const body=language.TRUDVANG.Content.Transformation["vitner-delusion-vitner:increase-sounds:3#bruits"].Description;
 assert.match(head,/paroles/);assert.match(body,/mouvements/);
 const trail=language.TRUDVANG.Content.Transformation["vitner-delusion-vitner:traceless:4#trace"].Description;
 assert.match(trail,/odeurs/);
});

test("water breathing and orientation effects retain their durations, target limits and terrain count", async()=>{
 const {POWER_DETAILS_BY_ID}=await import("../modules/power-catalog-data.mjs");
 const samples=[
  ["vitner-water-craft:breathe:2#respiration",[60,600,3600],"vitner-water-craft:breathe:2:4"],
  ["vitner-perceiving:retrace-tracks:1#traces",[3600,86400],"vitner-perceiving:retrace-tracks:1:3"],
  ["vitner-perceiving:orientation:3#orientation",[3600,86400],"vitner-perceiving:orientation:3:3"]
 ];
 for(const [key,durations,additional] of samples){
  const t=templates[key];assert.deepEqual(t.parameters.filter(p=>p.target==="duration").map(p=>p.value),durations);
  assert.deepEqual(POWER_DETAILS_BY_ID[t.sourceId].targeting,{baseTargets:1,additionalTargets:[{optionId:additional,count:1}]});
 }
 const lynx=templates["holy-toikalokke-lynx-power:orientation:0#orientation"];
 assert.deepEqual(lynx.parameters.filter(p=>p.target==="duration").map(p=>p.value),[3600,10800]);
 assert.equal(lynx.parameters.find(p=>p.target==="note").optionId,"holy-toikalokke-lynx-power:orientation:0:0");
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:(key,values)=>`${key}:${values.value}`}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"3 minutes",boost0:1,boost1:1,boost2:0})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,samples[0][0],{counts:[1,1,0]});assert.deepEqual(created.duration,{value:168,units:"rounds"});
});

test("descriptive spells retain selected improvements and calculate duration",async()=>{
 const keys=["vitner-water-craft:find-water:0#find-water","vitner-soil-craft:soil-walk:5#soil-walk","vitner-soil-craft:stone-walk:7#stone-walk","vitner-perceiving:find-home:0#find-home","vitner-perceiving:surrounding:6#surrounding","vitner-perceiving:map:7#map","vitner-power-of-vision:espionage:4#espionage","vitner-power-of-vision:astral-voyage:5#astral-voyage"];
 for(const key of keys)assert.ok(templates[key],key);
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"10 minutes",boost0:1,boost3:2,boost4:1})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,keys[0],{counts:[1,0,0,2,1]});
 assert.deepEqual(created.duration,{value:132,units:"rounds"});
 assert.match(created.description,/2 × TRUDVANG\.Content\.Power\.vitner-water-craft:find-water:0\.PowerLevels\.3/);
 assert.match(created.flags[S].transformation.summary,/1 × TRUDVANG\.Content\.Power\.vitner-water-craft:find-water:0\.PowerLevels\.4/);
});

test("movement, vision and concealment effects preserve individual duration and immobilization",async()=>{
 const immobilize="vitner-body-vitner:immobilize:6#effect",soil="vitner-soil-craft:shape-soil:1#effect";
 assert.deepEqual(templates[immobilize].statuses,["restrain"]);
 assert.deepEqual(templates[soil].parameters.filter(p=>p.target==="duration").map(p=>p.value),[60,3600]);
 assert.ok(templates[soil].displayPowerOptions.includes(2),"the shaping-time option must not extend the spell duration");
 for(const id of ["vitner-delusion-vitner:invisibility:11","vitner-delusion-vitner:camouflage:7","vitner-power-of-vision:seeing:3","vitner-power-of-vision:true-sight:7"])assert.ok(templates[`${id}#effect`],id);
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,immobilize,{counts:[1,1,0,0,0,0,0],skipDialog:true});
 assert.deepEqual(created.statuses,["restrain"]);assert.deepEqual(created.duration,{value:18,units:"rounds"});
});

test("healing invocations create independent clocks with the correct interval and improved duration",async()=>{
 const cases=[
  ["holy-haminges-power-of-the-scale:regenerative-blood:3",60,1,240],
  ["holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4",5,1,85],
  ["holy-tenetnid-tablet-of-grace:holy-mending:1",60,1,240],
  ["holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4",60,3,240],
  ["holy-tenetnid-tablet-of-grace:breath-of-gave:6",60,6,240]
 ];
 globalThis.game={user:{id:"gm"},time:{worldTime:100},i18n:{localize:key=>key,format:key=>key}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 for(const [id,interval,amount,seconds] of cases){
  await applyTransformation(actor,`${id}#effect`,{counts:[1],skipDialog:true});
  const clock=created.flags[S].consequenceClock;
  assert.equal(clock.stageStartedAt,100,id);assert.equal(clock.stages[0].seconds,seconds,id);
  assert.deepEqual(clock.stages[0].periodic,[{interval,operations:[{operation:"heal",formula:String(amount)}]}],id);
 }
 const id=cases[0][0],{transformationStackId}=await import("../modules/transformations.mjs");
 const stackIds=["first","second"].map(castingId=>transformationStackId(`${id}#effect`,{kind:"divine",casterUuid:"Actor.caster",castingId},templates[`${id}#effect`]));
 assert.notEqual(stackIds[0],stackIds[1],"separate invocations keep independent clocks");
});

test("elemental and illusion effects keep their duration and chosen non-duration improvements",async()=>{
 const cases={
  "vitner-dimvitner:animate-undead:0":[86400,604800,2592000,31536000],
  "vitner-water-craft:water-walk:7":[60,600,3600],
  "vitner-delusion-vitner:depict:6":[60,600],
  "vitner-delusion-vitner:silence:9":[5,60,3600],
  "vitner-vitner-of-objects:create-object:8":[3600,86400],
  "holy-toikalokke-master-of-elements:fire-tamer:4":[15,50],
  "holy-toikalokke-master-of-elements:earth-wall:0":[1800,10800],
  "holy-toikalokke-master-of-elements:spring-of-water:8":[3600,14400],
  "holy-toikalokke-master-of-elements:shape-earth:5":[3600,18000],
  "holy-toikalokke-master-of-elements:control-wind:9":[3600]
 };
 for(const [id,values] of Object.entries(cases))assert.deepEqual(templates[`${id}#effect`].parameters.filter(p=>p.target==="duration").map(p=>p.value),values,id);
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"holy-toikalokke-master-of-elements:earth-wall:0#effect",{counts:[2,0,1],skipDialog:true});
 assert.deepEqual(created.duration,{value:2520,units:"rounds"});assert.match(created.description,/2 × TRUDVANG\.Content\.Power\.holy-toikalokke-master-of-elements:earth-wall:0\.PowerLevels\.0/);
});

test("Joar powers retain their source rules with their own option identities and target budgets",async()=>{
 const pairs={
  "holy-joaringfaith-power-of-sille:sunray:1":"holy-gerbanis-warmth-of-sunvei:sunray:1",
  "holy-joaringfaith-power-of-sille:summer-place:2":"holy-gerbanis-warmth-of-sunvei:summer-place:3",
  "holy-joaringfaith-power-of-sille:time-of-the-hunt:6":"holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6",
  "holy-joaringfaith-sight-of-lekaba:tracking:0":"vitner-power-of-vision:tracking:0",
  "holy-joaringfaith-sight-of-lekaba:scanning:1":"vitner-power-of-vision:scanning:1",
  "holy-joaringfaith-sight-of-lekaba:espionage:3":"vitner-power-of-vision:espionage:4",
  "holy-joaringfaith-sight-of-lekaba:seeing:4":"vitner-power-of-vision:seeing:3",
  "holy-joaringfaith-sight-of-lekaba:astral-voyage:6":"vitner-power-of-vision:astral-voyage:5",
  "holy-joaringfaith-sight-of-lekaba:true-sight:7":"vitner-power-of-vision:true-sight:7",
  "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0":"vitner-witchcraft:uprooted-tree:0"
 };
 const {POWER_DETAILS_BY_ID}=await import("../modules/power-catalog-data.mjs");
 const {magicTargetCapacity}=await import("../modules/rules/magic-target-allocation.mjs");
 for(const [id,baseId] of Object.entries(pairs)){
  const target=templates[sources[id][0]],base=templates[sources[baseId][0]];
  assert.deepEqual(target.parameters.map(p=>[p.index,p.target,p.value]),base.parameters.map(p=>[p.index,p.target,p.value]),id);
  for(const parameter of target.parameters)assert.ok(parameter.optionId.startsWith(`${id}:`),id);
 }
 for(const [id,index] of [["holy-joaringfaith-sight-of-lekaba:seeing:4",3],["holy-joaringfaith-sight-of-lekaba:true-sight:7",7]]){
  const target=POWER_DETAILS_BY_ID[id].targeting;
  assert.equal(magicTargetCapacity(target,{[`${id}:${index}`]:2}),3,id);
 }
});

test("divine weather, travel and summoning effects preserve their duration improvements",async()=>{
 const cases={
  "holy-gerbanis-warmth-of-sunvei:sunray:1":[3600],"holy-gerbanis-warmth-of-sunvei:summer-place:3":[3600],"holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6":[86400],
  "holy-gerbanis-strength-of-stormi:havar:2":[60,3600],"holy-gerbanis-strength-of-stormi:shield-disir:5":[60,3600],"holy-gerbanis-strength-of-stormi:einharjar:8":[60,3600],
  "holy-gerbanis-influence-of-jorn:wall-of-dusk:1":[5,60],"holy-gerbanis-influence-of-jorn:falfax:2":[3600],"holy-gerbanis-influence-of-jorn:night-curtain:3":[5,60,86400],
  "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4":[5,60,3600],"holy-gerbanis-influence-of-jorn:asiblack:6":[3600],"holy-gerbanis-influence-of-jorn:snarfari:8":[3600],
  "holy-ealdtradition-magh-s-gift:journey-wind:0":[3600],"holy-ealdtradition-magh-s-gift:elf-summer:3":[3600],"holy-ealdtradition-magh-s-gift:harvest-year:8":[],
  "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2":[86400],"holy-ealdtradition-nema-s-usefulness:meall-s-trail:5":[86400],"holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8":[86400],
  "holy-tenetnid-tablet-of-the-shield:sheltering:1":[3600],"holy-tenetnid-tablet-of-the-shield:storm-protection:2":[3600]
 };
 for(const [id,durations] of Object.entries(cases))assert.deepEqual(templates[`${id}#effect`].parameters.filter(p=>p.target==="duration").map(p=>p.value),durations,id);
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"1 minute",boost0:1,boost2:2})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"holy-gerbanis-strength-of-stormi:shield-disir:5#effect",{counts:[1,0,2]});
 assert.deepEqual(created.duration,{value:24,units:"rounds"});
 assert.match(created.description,/2 × TRUDVANG\.Content\.Power\.holy-gerbanis-strength-of-stormi:shield-disir:5\.PowerLevels\.2/);
});

test("enchantment and curse scale their global skill and situation modifiers",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 for(const [id,boost,expected,baseDuration] of [["vitner-vitner-craft:enchant-being:4",5,3,"4 tours de jeu"],["vitner-witchcraft:curse-creature:5",4,-3,"10 jours"]]){
  foundry.applications.api={DialogV2:{wait:async()=>({duration:baseDuration,[`boost${boost}`]:2})}};
  const counts=[];counts[boost]=2;await applyTransformation(actor,`${id}#effect`,{counts});
  assert.equal(created.system.changes.find(change=>change.key==="system.modifiers.rolls.allActions").value,String(expected));
  assert.equal(created.flags[S].transformation.powerContributions[0].resolved,expected);
 }
});

test("environment and language effects retain their spell durations and selected options",async()=>{
 for(const [key,values] of [
  ["vitner-vitner-craft:vitner-pouch:1#effect",[3600,86400,604800]],
  ["vitner-water-craft:control-precipitation:6#effect",[3600,18000,86400,604800]],
  ["holy-toikalokke-lynx-power:tree-walk:1#effect",[3600,10800]],
  ["holy-ealdtradition-gift-of-thanja:animal-speech:1#effect",[60]]
 ])assert.deepEqual(templates[key].parameters.filter(p=>p.target==="duration").map(p=>p.value),values,key);
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 foundry.applications.api={DialogV2:{wait:async()=>({duration:"1 heure",boost0:2,boost3:1})}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 await applyTransformation(actor,"vitner-vitner-craft:vitner-pouch:1#effect",{counts:[2,0,0,1]});
 assert.deepEqual(created.duration,{value:2,units:"hours"});
 assert.match(created.description,/2 × TRUDVANG\.Content\.Power\.vitner-vitner-craft:vitner-pouch:1\.PowerLevels\.0/);
});

test("Enken detection and Nid persuasion expose their allocated conditional bonuses",async()=>{
 const {conditionalSituationBonuses,conditionalSkillModifiers}=await import("../modules/rules/effect-conditional-tests.mjs");
 for(const [id,index,base,skill] of [["holy-gerbanis-power-of-enken:soul-sight:4",2,5,"shadowArts"],["holy-gerbanis-power-of-enken:eye-of-enken:8",2,8,"shadowArts"],["holy-tenetnid-tablet-of-the-knight:holy-authority:2",1,1,""],["holy-tenetnid-tablet-of-the-knight:majestic-revelation:4",1,3,""],["holy-tenetnid-tablet-of-the-knight:guise-of-gave:8",2,6,""]]){
  const effect={name:id,flags:{[S]:{transformation:{key:`${id}#effect`,sourceId:id,ruleTestContext:{countsById:{[`${id}:${index}`]:2}}}}}};
  const row=conditionalSituationBonuses(effect).find(r=>r.skillChoice);assert.equal(row.value,base+2);assert.equal(row.skill,skill);
  assert.equal(conditionalSkillModifiers({effects:[effect]},skill||"knowledge").length,1);
  if(skill)assert.equal(conditionalSkillModifiers({effects:[effect]},"agility").length,0);
 }
});

test("long sight and sacred lights scale their combat bonus without granting fear immunity",async()=>{
 globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{localize:key=>key,format:key=>key}};
 let created;const actor={canUserModify:()=>true,getTraitValue:()=>0,items:[],createTrudvangEffect:async data=>{created=data;return null;}};
 for(const [id,index,expected,path] of [["vitner-power-of-vision:far-sight:2",7,3,"system.modifiers.rolls.rangedAttack"],["holy-joaringfaith-sight-of-lekaba:far-sight:2",7,3,"system.modifiers.rolls.rangedAttack"],["holy-tenetnid-tablet-of-the-sun:thermal-light:3",3,3,"system.modifiers.rolls.allActions"],["holy-tenetnid-tablet-of-the-sun:holy-radiance:7",1,5,"system.modifiers.rolls.allActions"]]){
  foundry.applications.api={DialogV2:{wait:async()=>({duration:"1 minute",[`boost${index}`]:2})}};
  const counts=[];counts[index]=2;await applyTransformation(actor,`${id}#effect`,{counts});
  assert.equal(created.system.changes.find(change=>change.key===path).value,String(expected));
  if(id.includes("tablet-of-the-sun")){const rules=effectRules(created);assert.equal(rules.ignoreFearPenalty,true);assert.notEqual(rules.ignoreFear,true);}
 }
});

test("ally and non-ally variants describe only their own applied effect",()=>{
 for(const lang of ["fr","en"]){
  const data=JSON.parse(fs.readFileSync(new URL(`../lang/${lang}.json`,import.meta.url),"utf8"));
  const rows=data.TRUDVANG.Content.Transformation;
  for(const id of ["holy-tenetnid-tablet-of-the-sun:thermal-light:3","holy-tenetnid-tablet-of-the-sun:holy-radiance:7"]){
   const main=rows[`${id}#effect`].Description,other=rows[`${id}#fear-only`].Description;
   assert.notEqual(main,other);assert.match(other,lang==="fr"?/ne confère pas de bonus/i:/grants no.*bonus/i);
  }
  for(const id of ["holy-gerbanis-wrath-of-tyrd:war-cry:4","holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7"]){
   assert.match(rows[`${id}#ally`].Description,/\+/);assert.doesNotMatch(rows[`${id}#ally`].Description,/−/);
   assert.match(rows[`${id}#enemy`].Description,/−/);assert.doesNotMatch(rows[`${id}#enemy`].Description,/\+/);
  }
 }
});

test("amnesia offers both separate tests and keeps the effect until recovery",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  for(const id of ['vitner-witchcraft:amnesia:4','holy-joaringfaith-curses-of-sonntag:amnesia:4']){
   await applyTransformation(actor,`${id}#effect`,{counts:[0,0,2],skipDialog:true});
   const enriched=annotateRuleTestDescription(created.description,created);
   assert.match(enriched,/data-test-index="0"/);assert.match(enriched,/data-test-index="1"/);
   assert.match(created.description,/\+2/);
   assert.ok(!created.duration?.value);
  }
 }finally{globalThis.game=previous;}
});

test("form water tracks shaping time and both duration improvements",async()=>{
 const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,'vitner-water-craft:form-water:3#effect',{counts:[0,2,1,1,0],skipDialog:true});
  assert.deepEqual(created.duration,{value:240,units:'rounds'});
  assert.match(created.description,/trois minutes/);
 }finally{globalThis.game=previous;}
});

test("Troll Wit prevents fear gain without suppressing higher existing fear penalties",async()=>{
 const {resolveFearStatus,effectiveFearPenalty}=await import('../modules/rules/fear-resolver.mjs');
 const t=templates['holy-haminges-power-of-trolls:troll-wit:7#effect'];
 const rules=rulesFromChanges(t.changes);
 assert.equal(rules.ignoreFearGain,true);assert.equal(rules.ignoreFearThrough,2);
 for(const [fear,expected] of [[5,0],[20,0],[21,-3],[35,-5],[45,-7]]){
  assert.equal(effectiveFearPenalty(resolveFearStatus({fear}),fear,rules),expected);
 }
 assert.equal(effectiveFearPenalty(resolveFearStatus({fear:45,insane:true}),45,rules),-7);
 assert.equal(effectiveFearPenalty(resolveFearStatus({fear:20}),20,{}),-1);
});

test('Nid blessings retain independent bonuses, durations and target capacities',async()=>{
 const {nidBlessingBonus}=await import('../modules/rules/nid-blessings.mjs');
 const {magicTargetCapacity}=await import('../modules/rules/magic-target-allocation.mjs');
 const {POWER_DETAILS_BY_ID}=await import('../modules/power-catalog-data.mjs');
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{for(const [suffix,counts,bonus,base] of [['holy-consideration:0',[1,0,2],3,1],['kindred-s-bond:4',[1,0,0,2,1],5,2],['favorites-of-gave:7',[1,0,0,1],5,4]]){
  const id='holy-tenetnid-tablet-of-voices:'+suffix;let created;
  const actor={uuid:'Actor.target',canUserModify:()=>true,items:[],effects:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,id+'#blessing',{counts,skipDialog:true});
  assert.equal(nidBlessingBonus({effects:[{id:'applied',...created}]}).value,bonus);
  assert.equal(magicTargetCapacity(POWER_DETAILS_BY_ID[id].targeting,{}),base);
  assert.ok(created.duration.value>0);assert.match(created.description,/objectif/);
 }}finally{globalThis.game=previous;}
});

test('horse ears keep their improved range, duration and listening action',async()=>{
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,'holy-ealdtradition-nema-s-usefulness:horse-ears:0#hearing',{counts:[2,4,3],skipDialog:true});
  assert.equal(effectRules(created).senses[0].range,60);
  assert.deepEqual(created.duration,{value:36,units:'rounds'});
  assert.match(annotateRuleTestDescription(created.description,created),/data-test-index="0"/);
  assert.equal(created.flags[S].transformation.ruleTestContext.counts[2],3);
  assert.match(created.flags[S].transformation.summary,/60/);
 }finally{globalThis.game=previous;}
});

test('messenger effects freeze instructions and special-duration improvements for each casting',async()=>{
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,'vitner-animal-vitner:messenger:0#message',{counts:[2,4,3],preselectedAnswers:{duration:'',effectInput:'Retour au village'}});
  assert.match(created.description,/chant : 3/);assert.match(created.description,/7 mots/);assert.match(created.description,/40 km/);
  assert.equal(created.flags[S].transformation.input,'Retour au village');assert.ok(!created.duration?.value);
  await applyTransformation(actor,'vitner-animal-vitner:create-messenger:7#messenger',{counts:[1,2,0,0,0,3],preselectedAnswers:{duration:'',effectInput:'Prévenir la garde'}});
  assert.equal(created.flags[S].transformation.input,'Prévenir la garde');assert.ok(!created.duration?.value);
  assert.match(created.description,/3 ×/);assert.match(created.description,/2 PS/);
 }finally{globalThis.game=previous;}
});

test('Halawen wards retain their spell-level table and shared resistance improvements',async()=>{
 const {magicResistanceRows}=await import('../modules/rules/magic-resistance.mjs');
 const {validateMagicAllocations,magicTargetCapacity}=await import('../modules/rules/magic-target-allocation.mjs');
 const {POWER_DETAILS_BY_ID}=await import('../modules/power-catalog-data.mjs');
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{for(const [suffix,base,first,seconds] of [['vitner-shield:1',1,10,90],['witch-wall:5',2,12,100],['mistur-barrier:7',4,12,3670]]){
  const id='holy-ealdtradition-halawen-s-offering:'+suffix;let created;
  const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,id+'#ward',{counts:[2,1,0,3,1],skipDialog:true});
  const scale={rounds:5,seconds:1,minutes:60,hours:3600,days:86400};
  assert.equal(created.duration.value*scale[created.duration.units],seconds);
  assert.match(annotateRuleTestDescription(created.description,created),/data-test-index="0"/);
  const test=RULE_TESTS_BY_CATALOG_ID[id][0];
  assert.equal(test.sv.by[0].value,first);assert.equal(test.sv.by[4].value,first-8);
  assert.equal(magicResistanceRows(test,{context:created.flags[S].transformation.ruleTestContext,actor}).reduce((sum,row)=>sum+row.value,0),3);
  const targeting=POWER_DETAILS_BY_ID[id].targeting,group=targeting.groups[0];
  assert.equal(magicTargetCapacity(targeting,{},group.id),base);
  const selected={[id+':3']:3,...(base>1?{[id+':4']:1}:{})};
  assert.equal(magicTargetCapacity(targeting,selected,group.id),base+(base>1?1:0));
  const countsById=Object.fromEntries(group.sharedOptions.map(option=>[option,selected[option]??0]));
  const allocations=[{effectKey:id+'#ward',targetUuid:'Actor.caster',countsById}];
  if(base>1)allocations.push({effectKey:id+'#ward',targetUuid:'Actor.ally',countsById});
  const fullSelected=Object.fromEntries([...group.sharedOptions,...group.additionalTargets.map(row=>row.optionId)].map(option=>[option,selected[option]??0]));
  assert.equal(validateMagicAllocations({targeting,selected:fullSelected,allocations,casterUuid:'Actor.caster'}).ok,true);
 }}finally{globalThis.game=previous;}
});

test('site effects compute combined improvements without granting unconditional actor bonuses',async()=>{
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  for(const prefix of ['vitner-witchcraft','holy-joaringfaith-curses-of-sonntag']){
   await applyTransformation(actor,prefix+':bad-harvest:6#site',{counts:[2,3,1,2,1,2],skipDialog:true});
   assert.match(created.description,/860 m/);assert.match(created.description,/1300 m/);assert.match(created.description,/24 mois/);assert.ok(!created.duration?.value);
  }
  for(const [suffix,radius,penalty,resistance] of [['protective-ground:1',4,-2,6],['blessed-home:5',6,-4,10],['sacred-grove:6',12,-6,14]]){
   await applyTransformation(actor,'holy-tenetnid-tablet-of-the-sun:'+suffix+'#site',{counts:[1,2,1,2],skipDialog:true});
   assert.ok(created.description.includes('zone : '+radius+' m'));
   assert.ok(created.description.includes('site : '+penalty+' VC'));
   assert.ok(created.description.includes(': +'+resistance+' SV'));
   assert.deepEqual(created.system.changes,[],'a site marker must not penalize every roll of its holder');
  }
 }finally{globalThis.game=previous;}
});

test('anti-magic, imprisonment and vitner resistance expose tests with their frozen improvements',async()=>{
 const {magicResistanceRows}=await import('../modules/rules/magic-resistance.mjs');
 const language=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url)));
 const lookup=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key,previous=globalThis.game;
 globalThis.game={user:{id:'gm'},time:{worldTime:0},i18n:{lang:'fr',localize:lookup,format:(key,data)=>Object.entries(data??{}).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),lookup(key))}};
 try{for(const [id,variant,counts,bonus] of [['vitner-vitner-craft:anti-magic:3','effect',[2,1,0,0,3,0],3],['vitner-body-vitner:imprison:10','effect',[2,0,1,1,2],-2],['holy-tenetnid-tablet-of-the-shield:vitner-resistance:6','site',[1,3,2],-2]]){
  let created;const actor={canUserModify:()=>true,items:[],createTrudvangEffect:async data=>(created=data,null)};
  await applyTransformation(actor,id+'#'+variant,{counts,skipDialog:true});
  assert.match(annotateRuleTestDescription(created.description,created),/data-test-index="0"/);
  assert.equal(magicResistanceRows(RULE_TESTS_BY_CATALOG_ID[id][0],{context:created.flags[S].transformation.ruleTestContext,actor}).reduce((sum,row)=>sum+row.value,0),bonus);
  assert.ok(created.duration.value>0);
 }}finally{globalThis.game=previous;}
});
