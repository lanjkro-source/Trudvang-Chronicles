import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Handlebars from "handlebars";

test("real PJ and PNJ templates show temporary health and effect state without a header banner",()=>{
 const hbs=Handlebars.create();
 const lang=JSON.parse(fs.readFileSync(new URL("../lang/fr.json",import.meta.url)));
 const localize=key=>key?.split('.').reduce((o,k)=>o?.[k],lang)??key;
 for(const name of ["eq","and","or","not","concat","checked","editor","selectOptions","localize","signed"]){
  hbs.registerHelper(name,(...args)=>{
   args.pop();
   if(name==="eq")return args[0]===args[1];
   if(name==="and")return args.every(Boolean);
   if(name==="or")return args.some(Boolean);
   if(name==="not")return !args[0];
   if(name==="concat")return args.join('');
   if(name==="localize")return localize(args[0]);
   if(name==="signed")return String(args[0]??0);
   return "";
  });
 }
 for(const type of ["character","npc"]){
  const render=hbs.compile(fs.readFileSync(new URL(`../templates/actor/${type}-sheet.hbs`,import.meta.url),"utf8"));
  const context={actor:{name:"Test"},system:{details:{},resources:{body:{value:32,max:43},divinity:{value:0,max:0,temporary:0}}},
   healthStatus:{current:32,max:43,level:"light"},fearStatus:{state:"Peur",consequence:"Conséquence de peur"},
   effectiveFearFactor:{valid:true},fearFactor:{dice:1,faces:10,threshold:0},fearFactorNotation:"1d10",transformationSummary:"obsolete banner",
   effectStatus:{temporaryHP:5,temporaryHint:"Rage +5",movement:[{label:"Vol",value:24,distance:"4 m",max:"24 m"}],immunity:"Rage",notes:[{name:"Rage",details:"Ignore les effets de la peur"}]}};
  const html=render(context);
  assert.match(html,/32 \/ 43<span class="temporary-hp"[^>]*> \+ 5/);
  assert.match(html,/Points de santé temporaires : \+5/);
  assert.match(html,/Vol<\/strong><span>4 m \/ 24 m/);
  assert.match(html,/Ignore les effets de la peur/);
  assert.match(html,/data-action="roll-fear-factor"/);
  assert.match(html,/1d10/);
  assert.doesNotMatch(html,/trudvang-transformation-summary|obsolete banner/);
  const health=html.match(type==="character"?/<section class="status-vital health-vital">([^]*?)<\/section>/:/<section class="panel npc-health-panel"[^>]*>([^]*?)<\/section>/)?.[1];
  assert.ok(health,"health section exists");
  assert.match(health,/Points de santé temporaires : \+5/);
  assert.doesNotMatch(health,/Vol<\/strong>|Ignore les effets de la peur|roll-fear-factor/);
  assert.match(html, /class="movement-effect-notes">[^]*?Vol<\/strong><span>4 m \/ 24 m/);
  if(type==="character"){
   assert.ok(html.indexOf("Conséquence de peur")<html.indexOf('data-action="roll-fear-factor"'));
   const fear=html.match(/<section class="status-vital fear-vital">([^]*?)<\/section>/)?.[1];
   assert.doesNotMatch(fear,/Points de santé temporaires|Vol<\/strong>/);
   assert.match(html, /class="summary-traits-column">[^]*?class="panel traits-panel">[^]*?class="panel effects-summary-panel">[^]*?Rage/);
  }else{
   assert.equal((html.match(/data-action="roll-fear-factor"/g)??[]).length,1);
   assert.match(html,/class="panel npc-abilities-panel">[^]*?class="effect-notes-section">[^]*?Rage/);
  }
  context.effectStatus.temporaryHP=0;
  assert.doesNotMatch(render(context),/class="temporary-hp"/);
 }
});
