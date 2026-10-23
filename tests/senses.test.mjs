import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import Handlebars from "handlebars";
import {normalizeSense,intrinsicSenses,sensoryProfile,sensoryVision,sensoryText,tokenVisionUpdate} from "../modules/rules/senses.mjs";
import {BESTIARY_ENTRIES} from "../modules/bestiary-catalog-data.mjs";
import {buildBestiaryPackDocuments} from "../modules/bestiary-pack-data.mjs";

const scope="trudvang-chronicles";
const sense=(type,range=null,label="")=>({type,range,label,enabled:true});
const actor=senses=>({system:{senses},items:[],effects:[]});
const del={delete:true};
globalThis.foundry={data:{operators:{ForcedDeletion:{create:()=>del}}}};
function apply(token,changes){
 for(const [path,value]of Object.entries(changes)){
  const keys=path.split('.'),last=keys.pop(),parent=keys.reduce((o,k)=>o[k]??={},token);
  if(value===del)delete parent[last];else parent[last]=structuredClone(value);
 }
}
function token(){return {sight:{enabled:false,visionMode:"basic",range:0,saturation:0,attenuation:0.5},detectionModes:{seeInvisibility:{enabled:true,range:5}},flags:{},parent:{width:2000,height:1000,grid:{size:100,distance:5,units:"m"}}};}

test("sensory profiles default to normal vision and transfer all senses without altering their source",()=>{
 assert.deepEqual(sensoryProfile(actor()),[sense("normal")]);
 assert.equal(normalizeSense("Vision dans le noir (10 à 60 m)").range,60);
 assert.equal(normalizeSense("Vision dans le noir (100 à 300 m)").range,300);
 const a=actor([sense("normal"),sense("night",60)]),before=structuredClone(a);
 const form=[sense("dark",300),sense("other",300,"Vision thermique")];
 const profile=sensoryProfile(a,[{name:"Dragon",rules:{sensesReplace:true,senses:form}}]);
 assert.equal(profile.length,2);assert.equal(profile[1].label,"Vision thermique");assert.deepEqual(a,before);
 assert.deepEqual(sensoryVision(profile),{mode:"darkvision",range:300});
 assert.equal(sensoryVision([sense("other",300,"Vision thermique")]),null);
 assert.deepEqual(sensoryVision([sense("night",60),sense("dark")]),{mode:"darkvision",range:null});
 assert.equal(sensoryVision([{...sense("night",60),enabled:false}]),null);
});

test("knowing a vision spell grants no free sense and legacy creature capacities remain available and editable",()=>{
 const a=actor([sense("normal")]);
 a.items=[{type:"spell",name:"Vision nocturne"}];assert.equal(intrinsicSenses(a).length,1);
 a.items.push({type:"creatureAbility",name:"Vision dans le noir (10 à 60 m)"});
 assert.equal(intrinsicSenses(a).length,2);
 a.system.senses.push({...sense("dark",60),enabled:false});
 assert.equal(intrinsicSenses(a).length,2);assert.equal(sensoryVision(intrinsicSenses(a)),null);
});

test("V14 vision enables darkvision and its detection range, preserves other modes and restores original settings",()=>{
 const t=token(),before=structuredClone(t);
 apply(t,tokenVisionUpdate(t,{mode:"darkvision",range:60}));
 assert.equal(t.sight.enabled,true);assert.equal(t.sight.visionMode,"darkvision");assert.equal(t.sight.range,60);
 assert.deepEqual(t.detectionModes.darkvision,{enabled:true,range:60});
 assert.deepEqual(t.detectionModes.seeInvisibility,before.detectionModes.seeInvisibility);
 assert.deepEqual(tokenVisionUpdate(t,{mode:"darkvision",range:60}),{},"unchanged preparation writes nothing");
 apply(t,tokenVisionUpdate(t,null));
 assert.deepEqual(t.sight,before.sight);assert.deepEqual(t.detectionModes,before.detectionModes);
 assert.equal(t.flags[scope].transformationVision,undefined);
});

test("vision handles overlapping effects, an existing detection row, feet, unlimited range and later manual changes",()=>{
 const t=token();t.detectionModes.darkvision={enabled:false,range:15};
 apply(t,tokenVisionUpdate(t,{mode:"darkvision",range:60}));
 apply(t,tokenVisionUpdate(t,{mode:"darkvision",range:300}));
 apply(t,tokenVisionUpdate(t,{mode:"darkvision",range:60}));
 t.sight.visionMode="tremorsense";
 apply(t,tokenVisionUpdate(t,null));
 assert.equal(t.sight.visionMode,"tremorsense");assert.deepEqual(t.detectionModes.darkvision,{enabled:false,range:15});
 const feet=token();feet.parent.grid.units="ft";
 apply(feet,tokenVisionUpdate(feet,{mode:"darkvision",range:30.48}));assert.equal(feet.detectionModes.darkvision.range,100);
 apply(feet,tokenVisionUpdate(feet,{mode:"darkvision",range:null}));assert.equal(feet.detectionModes.darkvision.range,null);assert.ok(feet.sight.range>100);
});

test("every bilingual bestiary profile has localized sensory data with the book's bounded vision variants",()=>{
 assert.ok(BESTIARY_ENTRIES.every(e=>e.actor.system.senses?.some(s=>s.type==="normal")));
 for(const code of ["fr","en"]){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  const localize=key=>key.split('.').reduce((o,k)=>o?.[k],language)??key;
  const {actors}=buildBestiaryPackDocuments({code,localize,format:()=>"",isFrench:()=>code==="fr",strict:true});
  assert.ok(actors.every(a=>a.system.senses.every(s=>s.label&&!s.label.startsWith("TRUDVANG."))));
  assert.ok(actors.some(a=>a.system.senses.some(s=>s.type==="dark"&&s.range===60)));
  assert.ok(actors.some(a=>a.system.senses.some(s=>s.type==="dark"&&s.range===300)));
 }
});

test("the shared PJ/PNJ senses line stays compact, deduplicates abilities and escapes custom labels",()=>{
 const localize=key=>({"TRUDVANG.Senses.Types.normal":"Vision normale","TRUDVANG.Senses.Types.night":"Vision nocturne"}[key]??key);
 const a=actor([sense("normal"),sense("night",60),sense("night",300),sense("other",300,"Vision thermique"),{...sense("dark",60),enabled:false}]);
 assert.equal(sensoryText(a,{localize}),"vision nocturne, vision thermique");
 assert.equal(sensoryText(actor(),{localize}),"vision normale");
 const h=Handlebars.create();h.registerHelper("localize",()=>"Sens");
 const render=h.compile(fs.readFileSync(new URL("../templates/actor/senses.hbs",import.meta.url),"utf8"));
 const html=render({sensesText:"vision nocturne, <script>"});
 assert.match(html,/Sens/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>|<section|<details|<input|<ul/);
 const npc=fs.readFileSync(new URL("../templates/actor/npc-sheet.hbs",import.meta.url),"utf8");
 assert.match(npc,/<section class="panel npc-health-panel"[^]*?\{\{\{sensesHtml\}\}\}\s*<\/section>/);
});

test("manual token vision disable and range reductions survive unrelated actor synchronization",()=>{
 const t=token(),vision={mode:"darkvision",range:60};
 apply(t,tokenVisionUpdate(t,vision));
 t.detectionModes.darkvision.enabled=false;t.detectionModes.darkvision.range=20;t.sight.range=20;
 assert.deepEqual(tokenVisionUpdate(t,vision),{});
 apply(t,tokenVisionUpdate(t,null));
 assert.equal(t.detectionModes.darkvision.enabled,false);assert.equal(t.detectionModes.darkvision.range,20);assert.equal(t.sight.range,20);
});
