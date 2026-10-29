import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {ruleTestCastingContext,magicResistanceRows} from "../modules/rules/magic-resistance.mjs";
import {RULE_TESTS_BY_CATALOG_ID as tests} from "../modules/rule-test-data.mjs";
const haste="vitner-body-vitner:hasten:9",vigor="vitner-body-vitner:strengthen:8",divine="holy-haminges-power-of-the-dragon:paralyzing-gaze:3";
const ranks=(potency=0,potent=0)=>({name:"Mage",uuid:"Actor.mage",items:[],findRuleKnowledge:id=>({system:{level:({potency,potent})[id]??0}})});
const doc=(id,caster)=>({name:"Hâte",uuid:"Actor.mage.Item.haste",type:id.startsWith("vitner-")?"spell":"divineFeat",system:{catalogId:id},actor:caster});

test("power-level resistance modifiers and both sides of Potency apply once, and Potent only affects divine victims",()=>{
 for(const id of [haste,vigor]){
  const context=ruleTestCastingContext(doc(id,ranks(2,5)),{counts:[0,0,0,3]});
  assert.deepEqual(magicResistanceRows(tests[id][0],{context,actor:ranks(1)}).map(r=>r.value),[-3,-4,2]);
  assert.equal(context.specialty,"potency");
 }
 const context=ruleTestCastingContext(doc(divine,ranks(5,3)),{counts:[0,2]});
 assert.deepEqual(magicResistanceRows(tests[divine][0],{context,actor:ranks(5)}).map(r=>r.value),[-2,-6]);
 for(const id of ["holy-ealdtradition-nema-s-usefulness:owl-hearing:3","holy-tenetnid-tablet-of-grace:hand-of-mercy:0"]){
  const ctx=ruleTestCastingContext(doc(id,ranks(5,5)),{counts:[2,0,3]});
  assert.ok(magicResistanceRows(tests[id][0],{context:ctx,actor:ranks(5)}).every(r=>r.labelKey.includes("PowerLevel")),id);
 }
});

test("a casting snapshot survives changes to caster ranks and is scoped to its source",()=>{
 const caster=ranks(2),item=doc(haste,caster),first=ruleTestCastingContext(item,{counts:[0,0,0,2]});
 caster.findRuleKnowledge=()=>({system:{level:5}});
 const second=ruleTestCastingContext(item,{counts:[0,0,0,4]});
 assert.equal(first.specialtyLevel,2);assert.equal(second.specialtyLevel,5);
 const effect={system:{catalogId:haste+"#hate"},flags:{"trudvang-chronicles":{transformation:{sourceId:haste,ruleTestContext:first}}}};
 assert.deepEqual(ruleTestCastingContext(effect),first);
 assert.equal(ruleTestCastingContext(doc(divine,caster),{context:first}).sourceId,divine);
 assert.deepEqual(first.counts,[0,0,0,2]);
 const unbound={type:"effect",documentName:"ActiveEffect",parent:{documentName:"Actor",...ranks(5)},flags:{"trudvang-chronicles":{transformation:{sourceId:haste}}}};
 assert.equal(ruleTestCastingContext(unbound).specialtyLevel,0,"the recipient of an unbound effect is not its caster");
});

test("initial-only improvements do not penalize later memory recovery or the caster's wind-control test",()=>{
 for(const id of ["vitner-witchcraft:amnesia:4","holy-joaringfaith-curses-of-sonntag:amnesia:4"]){
  const ctx=ruleTestCastingContext(doc(id,ranks()),{counts:[0,0,20]});
  assert.equal(magicResistanceRows(tests[id][0],{context:ctx})[0].value,-5,"minimum initial SV is respected");
  assert.equal(magicResistanceRows(tests[id][1],{context:ctx}).length,0);
 }
 const id="vitner-wind-craft:lift:5",ctx=ruleTestCastingContext(doc(id,ranks(3)),{counts:[0,0,0,0,0,0,0,0,2]});
 assert.deepEqual(magicResistanceRows(tests[id][0],{context:ctx}).map(r=>r.value),[-2,-6]);
 assert.equal(magicResistanceRows(tests[id][1],{context:ctx}).length,0);
});

const language=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language)??key;
const format=(key,data)=>Object.entries(data).reduce((s,[k,v])=>s.replaceAll("{"+k+"}",v),localize(key));
const cards=[],messages=[],dialogs=[];
globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;");}})};
globalThis.foundry={applications:{api:{DialogV2:class{_onRender(){}static async wait(options){dialogs.push(options);return options.buttons[0].callback(null,{form:{querySelector:selector=>({value:selector.includes("[name=sv]")?"6":selector.includes("[name=modifier]")?"5":"0"})}});}}},handlebars:{renderTemplate:async(path,data)=>{cards.push(data);return "card";}}}};
globalThis.game={user:{id:"gm"},time:{worldTime:0},i18n:{lang:"fr",localize,format}};
globalThis.CONFIG={TRUDVANG:{}};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=1;return this;}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{messages.push(data);return data;}};
const {performRuleTest}=await import("../modules/rule-tests.mjs");
const {rollUnder,magicDialog}=await import("../modules/dice.mjs");
const {applyTransformation}=await import("../modules/transformations.mjs");
const target=()=>({...ranks(1),type:"character",name:"Victime",isOwner:true,system:{damage:{penalty:-1},fearPenalty:-2},canPerformAction:()=>true,getTraitValue:()=>1,
 getRollModifier:()=>1,rollEffectRows:()=>[{label:"Amulette",value:1}],traitEffectRows:()=>[],effects:[],allApplicableEffects:()=>[]});

test("a successful cast carries its own improvement and rank snapshot into the actual resistance dialog and result",async()=>{
 for(const id of [haste,vigor]){
  const caster={...ranks(2),name:"Lanceur",type:"character"},item=doc(id,caster);
  await rollUnder({actor:caster,item,label:"Sort",target:20,kind:"spell",powerLevelCounts:[0,0,0,3]});
  const context=messages.at(-1).flags["trudvang-chronicles"].ruleTestContext;
  assert.equal(context.specialtyLevel,2);assert.equal(context.counts[3],3);
  assert.match(cards.at(-1).transformationLinks,/data-rule-test-context=/);
  caster.findRuleKnowledge=()=>({system:{level:5}});
  const result=await performRuleTest({document:item,index:0,actor:target(),context});
  assert.equal(result.target,5,"6 base +1 Constitution +1 effect -3 improvements -4 caster +2 target -1 wounds -2 fear +5 manual");
  const html=dialogs.at(-1).content;
  for(const text of [/Amélioration 4/,/3 × -1/,/Puissance du lanceur Lanceur/,/niveau 2 × −2/,/Puissance de Victime/,/niveau 1 × \+2/,/Amulette/,/Malus de blessures/,/Pénalité de peur/])assert.match(html,text);
  assert.match(cards.at(-1).flavor,/Puissance du lanceur Lanceur/);assert.match(cards.at(-1).flavor,/Amélioration 4/);
 }
});

test("effect application exposes and persists resistance improvements, with a live preview independent of trait boosts",async()=>{
 const caster=ranks(2),source=doc(haste,caster),context=ruleTestCastingContext(source,{counts:[0,0,0,3]});
 const previous=foundry.applications.api.DialogV2;let created;
 try{
  foundry.applications.api.DialogV2=class{static async wait(options){dialogs.push(options);return {duration:"1 minute",boost3:2};}};
  const actor={...target(),canUserModify:()=>true,createTrudvangEffect:async data=>{created=data;return null;}};
  await applyTransformation(actor,haste+"#hate-inverse",{source,context});
  assert.match(dialogs.at(-1).content,/name="boost3"[^>]*value="3"/);
  assert.match(dialogs.at(-1).content,/Modificateurs des tests liés au pouvoir/);
  const stored=created.flags["trudvang-chronicles"].transformation.ruleTestContext;
  assert.equal(stored.counts[3],2);assert.equal(stored.specialtyLevel,2);
  created.type="effect";created.documentName="ActiveEffect";
  foundry.applications.api.DialogV2=previous;
  const result=await performRuleTest({document:created,index:0,actor:target()});
  assert.equal(result.target,6,"edited resistance improvement is used by the effect's description link");
 }finally{foundry.applications.api.DialogV2=previous;}
});

test("casting dialog shows source Potency separately without reducing the spellcasting VC",async()=>{
 const caster=ranks(2),source=doc(haste,caster),before=foundry.applications.api.DialogV2;
 try{
  foundry.applications.api.DialogV2=class{static async wait(options){dialogs.push(options);return false;}};
  await magicDialog({title:"Hâte",methods:[{id:"galding",label:"Galding",target:14}],ruleDocument:source,castingActor:caster});
  assert.match(dialogs.at(-1).content,/Puissance du lanceur Mage/);
  assert.match(dialogs.at(-1).content,/data-final-target>14</);
 }finally{foundry.applications.api.DialogV2=before;}
});

test("casting preview refreshes when a resistance improvement counter is increased",async()=>{
 const before=foundry.applications.api.DialogV2,preview={innerHTML:""},counter={textContent:"0"},final={textContent:""};let increase;
 const button={dataset:{powerIncrease:"3"},addEventListener:(event,fn)=>{increase=fn;}};
 const root={querySelector:selector=>selector==="[data-resistance-preview]"?preview:selector==='[data-power-count="3"]'?counter:selector==="[data-final-target]"?final:null,
  querySelectorAll:()=>[button]};
 try{
  foundry.applications.api.DialogV2=class{_onRender(){}static async wait(){const dialog=new this();dialog.element=root;dialog._onRender({},{});return false;}};
  await magicDialog({title:"Hâte",methods:[{id:"galding",label:"Galding",target:14}],powerLevels:[{cost:1},{cost:3},{cost:8},{cost:2}],ruleDocument:doc(haste,ranks(2))});
  assert.doesNotMatch(preview.innerHTML,/Amélioration 4/);assert.equal(final.textContent,14);
  increase();assert.match(preview.innerHTML,/Amélioration 4/);assert.match(preview.innerHTML,/1 × -1/);assert.equal(final.textContent,14);
  increase();assert.match(preview.innerHTML,/2 × -1/);assert.equal(final.textContent,14);
 }finally{foundry.applications.api.DialogV2=before;}
});

test("the real chat listener forwards the message's snapshot and rolls for the clicking user's actor",async()=>{
 const previous={Hooks:globalThis.Hooks,HTMLElement:globalThis.HTMLElement,character:game.user.character,utils:foundry.utils};
 try{
  const hooks={};globalThis.Hooks={on:(name,fn)=>{hooks[name]=fn;}};
  let clicked;const button={disabled:false,dataset:{testIndex:"0"},closest:()=>({dataset:{ruleDocumentUuid:"Item.haste"}}),addEventListener:(name,fn)=>{clicked=fn;}};
  globalThis.HTMLElement=class{constructor(){this.dataset={};}querySelectorAll(selector){return selector==="[data-action='roll-rule-test']"?[button]:[];}};
  const caster=ranks(2),item=doc(haste,caster),context=ruleTestCastingContext(item,{counts:[0,0,0,3]});
  caster.findRuleKnowledge=()=>({system:{level:5}});
  foundry.utils={fromUuid:async()=>item};game.user.character=target();
  const {registerChatListeners}=await import("../modules/chat.mjs");registerChatListeners();
  hooks.renderChatMessageHTML({id:"old-cast",getFlag:()=>null,flags:{"trudvang-chronicles":{ruleTestContext:context}}},new HTMLElement());
  await clicked({preventDefault(){}});
  assert.equal(cards.at(-1).target,5);assert.equal(button.disabled,false);
 }finally{globalThis.Hooks=previous.Hooks;globalThis.HTMLElement=previous.HTMLElement;game.user.character=previous.character;foundry.utils=previous.utils;}
});

test("resistance uses the captured option identity instead of an obsolete index",()=>{
 const reference=tests[haste][0].powerLevelModifiers[0];assert.ok(reference.optionId);
 const context=ruleTestCastingContext(doc(haste,ranks()),{counts:[0,0,0,3]});
 const wrongIndex={...tests[haste][0],powerLevelModifiers:[{...reference,index:0}]};
 assert.equal(magicResistanceRows(wrongIndex,{context,actor:ranks()})[0].value,-3);
 const legacy={...context};delete legacy.countsById;
 assert.equal(magicResistanceRows(tests[haste][0],{context:legacy,actor:ranks()})[0].value,-3);
});
