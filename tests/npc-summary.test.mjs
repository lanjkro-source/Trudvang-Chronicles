import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import Handlebars from "handlebars";
import {ignoresWoundPenalties, npcCombatMovementModes, npcCurrentTrait, npcHealthRange, npcMovementRows, npcSkillTrees, npcTraitEdit} from "../modules/rules/npc-summary.mjs";
import {CREATURE_NPC_DATA} from "../modules/creature-feats.mjs";
import {resolveCombatActionModifier,resolveDamage} from "../modules/rules/equipment-resolver.mjs";
import {COMBAT_POOL_IDS, normalizeCombatAllocation, resolveCombatPools, suggestCombatAllocation} from "../modules/rules/combat-pool-resolver.mjs";
import {TRUDVANG} from "../modules/config.mjs";
import {bodyHealthPersistence} from "../modules/rules/body-health.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";
import {creatureAbilityDetails} from "../modules/creature-ability.mjs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";
import {buildBestiaryPackDocuments} from "../modules/bestiary-pack-data.mjs";
import {actorStateRollModifiers, rollModifierTotal} from "../modules/rules/roll-state-resolver.mjs";
import {TABLET_CATALOG, powerItemData, tabletItemData} from "../modules/tablet-catalog.mjs";
import {POWER_COMPENDIUM_ICON_BY_ITEM_ID, powerIconClassForId, powerIconClassForItem} from "../modules/power-icons.mjs";

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const set = (object, path, value) => {
  const keys = path.split(".");
  const leaf = keys.pop();
  const parent = keys.reduce((value, key) => value[key] ??= {}, object);
  parent[leaf] = value;
};
class Field { constructor(options) { this.options = options; } }
const renderedCards = [];
globalThis.foundry = {
  abstract: {TypeDataModel: class { prepareBaseData() {} }},
  data: {ActiveEffectTypeDataModel: class {}, fields: {
    NumberField: Field, StringField: Field, HTMLField: Field, BooleanField: Field, ArrayField: Field,
    SchemaField: class { constructor(fields) { this.fields = fields; } }
  }},
  documents: {Actor: class {
    prepareDerivedData() {}
    getFlag() { return null; }
    async _preCreate() { return this.creationAllowed; }
    async getTokenDocument(data, options) { return {data, options}; }
  }, ActiveEffect: class { prepareBaseData() {} }},
  applications: {
    api: {HandlebarsApplicationMixin: Base => Base,
      DocumentSheetV2: class {
        constructor({document}) { this.document = document; this.isEditable = document.isOwner; }
        async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
        render(options) { this.renderOptions = options; return this; }
      }},
    sheets: {ActorSheetV2: class { async _prepareContext() { return {}; } async _onRender() {} _getHeaderControls() { return [{action: "configureSheet"}]; } }, ItemSheetV2: class {
      constructor({document} = {}) { this.document = document; this.item = document; }
      async _prepareContext() { return {document: this.document, editable: this.isEditable}; }
      async _onRender() {}
      async close() {}
    }},
    ux: {TextEditor: {implementation: {enrichHTML: async value => value}}},
    handlebars: {renderTemplate: async (path, data) => { renderedCards.push({path, data}); return ""; }}
  },
  utils: {getProperty: get, setProperty: set, hasProperty: (object, path) => get(object, path) !== undefined,
    expandObject: flat => { const output = {}; for (const [key, value] of Object.entries(flat)) set(output, key, value); return output; }}
};
const fr = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
globalThis.game = {user: {isGM: true}, combat: null, i18n: {
  lang: "fr", localize: key => get(fr, key) ?? key,
  format: (key, data) => String(get(fr, key) ?? key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
}};
const {NpcData, CharacterData, AbilityData} = await import("../modules/data-models.mjs");
const {TrudvangActor} = await import("../modules/documents/actor.mjs");
const {TrudvangActiveEffect} = await import("../modules/effects.mjs");
const {TrudvangActorSheet, TrudvangNpcSheet, TrudvangCharacterSheet} = await import("../modules/sheets/actor-sheet.mjs");
const {TrudvangItemSheet} = await import("../modules/sheets/item-sheet.mjs");
const {registerMagicSheetAvailabilityHooks} = await import("../modules/sheets/item-sheet.mjs");

test("magic sheet launch button follows token and actor changes and rechecks permission at click",async t=>{
 const oldCanvas=globalThis.canvas,oldHooks=globalThis.Hooks,oldUi=globalThis.ui;
 const hooks=new Map(),warnings=[];
 globalThis.Hooks={on:(name,fn)=>hooks.set(name,fn)};
 globalThis.canvas={tokens:{controlled:[]}};
 globalThis.ui={notifications:{warn:text=>warnings.push(text)}};
 t.after(()=>{globalThis.canvas=oldCanvas;globalThis.Hooks=oldHooks;globalThis.ui=oldUi;});
 registerMagicSheetAvailabilityHooks();
 const item={type:"spell",system:{cost:1},effects:[],getFlag:()=>null};
 const sheet=new TrudvangItemSheet({document:item}),button={};
 sheet.element={querySelector:selector=>selector==="[data-action='roll']"?button:null,querySelectorAll:()=>[]};
 await sheet._onRender({},{});t.after(()=>sheet.close());
 assert.equal(button.disabled,true);assert.match(button.title,/sélectionn/i);
 const caster=actor();caster.system.magic={castingTarget:10};caster.isOwner=true;
 let launched;caster.rollSpell=async source=>{launched=source;};
 canvas.tokens.controlled=[{actor:caster}];hooks.get("controlToken")();assert.equal(button.disabled,false);
 await TrudvangItemSheet.DEFAULT_OPTIONS.actions.roll.call(sheet,{preventDefault(){}},button);
 assert.equal(launched,item,"compendium power is launched by the selected actor");
 caster.isOwner=false;hooks.get("updateActor")();assert.equal(button.disabled,true);
 launched=null;button.disabled=false;
 await TrudvangItemSheet.DEFAULT_OPTIONS.actions.roll.call(sheet,{preventDefault(){}},button);
 assert.equal(launched,null);assert.equal(warnings.length,1,"stale button state cannot bypass eligibility");
});
const feat = (enabled = true, level = 1) => ({type: "ability", name: "Tenace",
  system: {kind: "feat", ignoreWoundPenalties: enabled, level}});
const knowledge = (kind, level, name, extra = {}) => ({level, item: {id: name, name, type: "ability",
  system: {kind, level, ...extra}}, specialties: []});
const tree = (level, disciplines = [], unassigned = []) => ({key: "fighting", level, disciplines, unassigned});

function actor(items = [], {fighting = 8} = {}) {
  const traits = Object.fromEntries(Object.keys(TRUDVANG.traits).map(key => [key, 0]));
  traits.constitution = 2;
  const skills = Object.fromEntries(Object.keys(TRUDVANG.skills).map(key => [key, {value: 1, bonus: 0}]));
  skills.fighting.value = fighting;
  const instance = new TrudvangActor();
  Object.assign(instance, {type: "npc", name: "Test creature", id: "npc", img: "", items, statuses: new Set(),
    system: {traits, traitCurrent: {constitution: null}, skills,
      effective: {traits: {...traits}, skills: Object.fromEntries(Object.entries(skills).map(([key, skill]) => [key, skill.value]))},
      resources: {body: {value: 10, max: 40}, combat: {value: 20, max: 20}, fear: {value: 0, max: 50},
        vitner: {value: 0, max: 0}, divinity: {value: 0, max: 0}},
      combatPools: Object.fromEntries(COMBAT_POOL_IDS.map(id => [id, {spent: -1}])),
      movement: {base: 10}, initiative: {base: 3}, modifiers: {rolls: {}}, details: {naturalArmor: 4}, survivalRounds: -1},
    calculateBuildCost: () => 0, calculateCreationCosts: () => ({}), getKnowledgeLevelCost: () => 0,
    canChooseCatalogKnowledge: () => true, allApplicableEffects: () => []});
  instance._source = {system: structuredClone(instance.system)};
  instance.prepareDerivedData();
  return instance;
}

test("real character and NPC maximum-only effects heal once and leave current health on expiration",()=>{
 for(const type of ["character","npc"]){
  const instance=actor();instance.type=type;
  Object.assign(instance._source.system.resources.body,{value:30,max:40,maxAtValue:40,modifierAtValue:0});
  Object.assign(instance._source.system.traits,{strength:4,constitution:4});
  const prepare=active=>{
   instance.system=structuredClone(instance._source.system);
   instance.system.effective.traits={...instance.system.traits};
   if(type==="character"){
    instance.system.effective.traits={...instance.system.traits,strength:active?5:4,constitution:active?8:4};
   }else if(active)instance.system.modifiers.bodyMax=5;
   instance.prepareDerivedData();
  };
  prepare(true);
  assert.equal(instance.system.resources.body.max,45);
  assert.equal(instance.system.resources.body.current,35);
  for(const [key,value]of Object.entries(bodyHealthPersistence(instance)))instance._source.system.resources.body[key.split('.').at(-1)]=value;
  prepare(true);assert.equal(instance.system.resources.body.current,35,"repeated preparation cannot heal twice");
  prepare(false);assert.equal(instance.system.resources.body.max,40);assert.equal(instance.system.resources.body.current,35);
 }
});

test("real PJ and PNJ vitality removal can leave negative HP while maximum-only removal cannot",()=>{
 for(const type of ["character","npc"]){
  const instance=actor();instance.type=type;
  Object.assign(instance._source.system.resources.body,{value:30,max:40,maxAtValue:40,modifierAtValue:0,maximumOnlyAtValue:40});
  Object.assign(instance._source.system.traits,{strength:4,constitution:4});
  const e={id:"blood",name:"Sang brûlant",system:{changes:["bodyMax","bodyValue"].map(k=>({key:`system.modifiers.${k}`,type:"add",value:"13"}))}};
  let active=true;
  instance.allApplicableEffects=()=>active?[e]:[];
  const persist=()=>{for(const [k,v]of Object.entries(bodyHealthPersistence(instance)??{}))set(instance._source,k,v);};
  const prepare=()=>{instance.system=structuredClone(instance._source.system);instance.system.effective.traits={...instance.system.traits};if(active){instance.system.modifiers.bodyMax=13;instance.system.modifiers.bodyValue=13;}instance.prepareDerivedData();};
  prepare();assert.equal(instance.system.resources.body.current,43);assert.equal(instance.system.resources.body.max,53);persist();
  set(instance._source,"system.resources.body.value",-5);prepare();assert.equal(instance.system.resources.body.current,8);
  active=false;prepare();assert.equal(instance.system.resources.body.current,-5);assert.equal(instance.system.resources.body.max,40);persist();
  prepare();assert.equal(instance.system.resources.body.current,-5);
 }
});

test("native Force and Constitution effects change NPC health by their effective trait delta",()=>{
 const instance=actor();Object.assign(instance._source.system.resources.body,{value:30,max:40,maxAtValue:40,modifierAtValue:0});
 instance.system=structuredClone(instance._source.system);
 instance.system.effective.traits.strength=1;instance.system.effective.traits.constitution=6;
 instance.prepareDerivedData();assert.equal(instance.system.resources.body.max,45);assert.equal(instance.system.resources.body.current,35);
});

test("complete bestiary profiles replace maximum HP and steel fists change the normal unarmed weapon reversibly",async()=>{
 for(const type of ["character","npc"]){
  const instance=actor();instance.type=type;instance.isOwner=true;
  Object.assign(instance._source.system.resources.body,{value:30,max:40,maxAtValue:40,modifierAtValue:0,maximumOnlyAtValue:40});
  Object.assign(instance._source.system.traits,{strength:4,constitution:4});
  const e={id:"form",name:"Forme",canUserModify:()=>true,system:{changes:[{key:"system.resources.body.max",type:"override",value:"18"},{key:"system.effective.traits.strength",type:"override",value:"1"},{key:"system.effective.traits.constitution",type:"override",value:"0"},{key:"system.transformation.attacks",type:"override",value:JSON.stringify([{name:"Poings",isUnarmed:true,damage:"1d10 + 2",openRoll:9}])}]}};
  instance.allApplicableEffects=()=>[e];
  const prepare=(extraStrength=0)=>{instance.system=structuredClone(instance._source.system);instance.system.effective.traits={...instance.system.traits};if(!e.disabled){instance.system.resources.body.max=18;instance.system.effective.traits.strength=1+extraStrength;instance.system.effective.traits.constitution=0;}instance.prepareDerivedData();};
  prepare();assert.equal(instance.system.resources.body.max,18);assert.equal(instance.system.resources.body.current,18);
  assert.equal(instance.humanoidNaturalWeapon.system.damage,"1d10 + 2");assert.equal(instance.humanoidNaturalWeapon.system.openRoll,9);
  const damage=resolveDamage({item:instance.humanoidNaturalWeapon,actor:instance});assert.equal(damage.modifier.value,1);
  prepare(1);assert.equal(instance.system.resources.body.max,19,"other Strength effects still increase a form's HP");
  const sheet=type==="npc"?new TrudvangNpcSheet():new TrudvangCharacterSheet();sheet.actor=instance;sheet.isEditable=true;
  const context=await sheet._prepareContext({});assert.match(context.unarmedActionDetail,/1d10 \+ 2/);
  e.disabled=true;prepare();assert.equal(instance.system.resources.body.max,40);assert.equal(instance.humanoidNaturalWeapon.system.damage,"1d5");assert.equal(instance.humanoidNaturalWeapon.system.openRoll,0);
 }
});

test("refreshing a maximum-HP effect updates it atomically and never heals lost HP again",async t=>{
 const implementation=foundry.documents.ActiveEffect.implementation;
 const deepClone=foundry.utils.deepClone;foundry.utils.deepClone=structuredClone;
 foundry.documents.ActiveEffect.implementation={getEffectStart:()=>({time:10})};
 t.after(()=>{foundry.documents.ActiveEffect.implementation=implementation;foundry.utils.deepClone=deepClone;});
 const instance=actor();instance.type="character";instance.effects=[];instance.canUserModify=()=>true;
 Object.assign(instance._source.system.traits,{strength:4,constitution:4});
 Object.assign(instance._source.system.resources.body,{value:30,maxAtValue:40,modifierAtValue:0,maximumOnlyAtValue:40});
 instance.allApplicableEffects=()=>instance.effects;
 const prepare=()=>{instance.system=structuredClone(instance._source.system);instance.system.effective.traits={...instance.system.traits};instance.system.modifiers.bodyMax=instance.effects.reduce((sum,e)=>sum+Number(e.system.changes[0].value),0);instance.prepareDerivedData();};
 const persist=()=>{for(const [key,value]of Object.entries(bodyHealthPersistence(instance)??{}))set(instance._source,key,value);};
 let creations=0;
 instance.createEmbeddedDocuments=async(type,rows)=>{assert.equal(type,"ActiveEffect");creations++;const e={...rows[0],id:"grant",_source:{duration:{value:60}},async update(data){Object.assign(this,data);prepare();persist();},async delete(){assert.fail("replacement must not expire the effect first");}};instance.effects.push(e);prepare();persist();return [e];};
 const data={name:"Vigueur",duration:{value:60,units:"seconds"},system:{stackId:"strength",stacking:"replace",changes:[{key:"system.modifiers.bodyMax",type:"add",value:"5"}]}};
 const first=await instance.createTrudvangEffect(data);assert.equal(instance.system.resources.body.current,35);
 instance._source.system.resources.body.value=32;prepare();
 const second=await instance.createTrudvangEffect(data);assert.equal(first,second);assert.equal(creations,1);assert.equal(instance.system.resources.body.current,32);assert.equal(instance.system.resources.body.max,45);
});

test("discipline effect VC propagates once to specialties on PJ and PNJ, with named contributors",async()=>{
 for(const type of ["character","npc"]){
  const discipline={id:"d",type:"ability",name:"Discrétion",system:{kind:"discipline",catalogId:"shadowing",parentSkill:"shadowArts",level:1,rollBonus:1}};
  const specialty={id:"s",type:"ability",name:"Trouver & remarquer",system:{kind:"specialty",catalogId:"findingSpotting",parentSkill:"shadowArts",parentDiscipline:"Discrétion",level:1,rollBonus:2}};
  const instance=actor(type==="character"?[discipline,specialty]:[]);instance.type=type;
  instance.system.skills.shadowArts.value=7;instance.system.effective.skills.shadowArts=7;
  instance.system.damage.penalty=0;instance.system.fearPenalty=0;
  if(type==="npc")instance.system.skillTree=[{kind:"skill",skillId:"shadowArts",name:"Arts des ombres",value:7},{kind:"discipline",catalogId:"shadowing",name:"Discrétion",value:1},{kind:"specialty",catalogId:"findingSpotting",name:"Trouver & remarquer",value:1}];
  const effect=(name,knowledge)=>({name,system:{changes:[{key:"system.transformation.knowledge",type:"override",value:JSON.stringify(knowledge)}]}});
  instance.transformationProfile={knowledge:{shadowing:3,findingSpotting:2},effects:[effect("Renard",{shadowing:3}),effect("Vue",{findingSpotting:2})]};
  assert.equal(instance.getAbilityBreakdown(discipline).total,11);
  for(const item of [specialty,instance.findRuleKnowledge("findingSpotting")]){
   const b=instance.getAbilityBreakdown(item);assert.equal(b.total,15);assert.equal(b.discipline,4);assert.equal(b.specialty,4);
   assert.deepEqual(b.modifierRows.filter(r=>r.label).map(r=>[r.label,r.value,r.included]),[["Renard",3,true],["Vue",2,true]]);
   assert.equal(instance.getAbilityBreakdown(item,{disciplineLevel:1}).total,15);
  }
  assert.equal(instance.findRuleKnowledge("shadowing").system.level,1,"a VC bonus must not become acquired ranks");
  assert.equal(discipline.system.level,1);assert.equal(specialty.system.level,1);
  const sheet=new TrudvangNpcSheet();sheet.actor=instance;
  if(type==="npc"){const row=sheet._npcBookSkillRows().at(-1);assert.match(row.calculation,/Renard \+3/);assert.match(row.calculation,/Vue \+2/);assert.match(row.calculation,/15/);}
  instance.transformationProfile={knowledge:{},effects:[]};assert.equal(instance.getAbilityBreakdown(specialty).total,10);
 }
});

test("NPC current traits follow intrinsic traits by default, but accept zero and negatives", () => {
  assert.equal(npcCurrentTrait({traits: {strength: 4}}, "strength"), 4);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: null}}, "strength"), 4);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: 0}}, "strength"), 0);
  assert.equal(npcCurrentTrait({traits: {strength: 4}, traitCurrent: {strength: -8}}, "strength"), -8);
});

test("both actor models store galleries, and both sheet menus expose portrait management and sharing", async () => {
  for (const Model of [CharacterData, NpcData]) {
    const schema = Model.defineSchema();
    assert.ok(schema.portraits); assert.equal(schema.sharedPortrait, undefined);
  }
  const previous = foundry.applications.api.DialogV2;
  const previousDocument = globalThis.document;
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  let shared = 0;
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    assert.equal(options.window.title, game.i18n.format("TRUDVANG.Portrait.DialogTitle", {actor: "Test creature"}));
    shared += 1; return false;
  }};
  try {
    for (const Sheet of [TrudvangCharacterSheet, TrudvangNpcSheet]) {
      const sheet = new Sheet(); sheet.actor = actor(); sheet.actor.img = "portrait.webp"; sheet.isEditable = true;
      const controls = sheet._getHeaderControls();
      assert.ok(controls.some(control => control.action === "configureSheet"), "native controls remain present");
      assert.equal(controls.filter(control => control.action === "share-portrait").length, 1);
      const share = controls.find(control => control.action === "share-portrait");
      assert.equal(typeof share.onClick, "function");
      const manage = controls.find(control => control.action === "manage-portraits");
      assert.equal(typeof manage.onClick, "function");
      assert.equal(manage.visible(), true); sheet.isEditable = false; assert.equal(manage.visible(), false);
      await share.onClick();
    }
    assert.equal(shared, 2);
  } finally { foundry.applications.api.DialogV2 = previous; globalThis.document = previousDocument; }
});

test("NPC creation initializes its prototype dimensions and generated tokens follow the current size", async () => {
  const npc = actor(); npc.system.details.size = "5t";
  const updates = [];
  npc.updateSource = data => updates.push(data);
  await npc._preCreate({}, {}, {id: "gm"});
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false, "prototypeToken.width": 4, "prototypeToken.height": 4}]);
  const options = {parent: {id: "isolated-scene"}};
  const data = {x: 20, y: 40, actorLink: false, texture: {src: "token.webp"}};
  assert.deepEqual(await npc.getTokenDocument(data, options), {data: {...data, width: 4, height: 4}, options});
  assert.deepEqual(data, {x: 20, y: 40, actorLink: false, texture: {src: "token.webp"}}, "caller data is not mutated");
  npc.system.details.size = "1/2";
  assert.deepEqual((await npc.getTokenDocument()).data, {actorLink: false, width: 1, height: 1});
  assert.deepEqual((await npc.getTokenDocument({width: 2, height: 1})).data, {actorLink: false, width: 2, height: 1}, "explicit sizing overrides the automatic default");
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false, "prototypeToken.width": 4, "prototypeToken.height": 4}], "generating a token never rewrites the actor or existing scene tokens");
  const delta = {items: [{_id: "axe", system: {quantity: 2}}]};
  assert.deepEqual((await npc.getTokenDocument({actorLink: true, delta})).data, {actorLink: true, width: 1, height: 1, delta}, "explicit linking and per-token inventory overrides remain available");
});

test("token auto-sizing leaves PCs, unknown sizes and cancelled actor creations alone", async () => {
  const instance = actor();
  const updates = [];
  instance.updateSource = data => updates.push(data);
  instance.system.details.size = "3t";
  instance.type = "character";
  await instance._preCreate({}, {}, {});
  assert.deepEqual((await instance.getTokenDocument({x: 12})).data, {x: 12});
  instance.type = "npc"; instance.system.details.size = "unknown";
  await instance._preCreate({}, {}, {});
  assert.deepEqual((await instance.getTokenDocument({width: 2})).data, {actorLink: false, width: 2});
  instance.system.details.size = "10+"; instance.creationAllowed = false;
  assert.equal(await instance._preCreate({}, {}, {}), false);
  assert.deepEqual(updates, [{"prototypeToken.actorLink": false}]);
});

test("the NPC schema preserves intrinsic traits and prepares current traits before effects", () => {
  const schema = NpcData.defineSchema();
  for (const field of Object.values(schema.traitCurrent.fields)) {
    assert.equal(field.options.initial, null);
    assert.equal(field.options.nullable, true);
    assert.equal(field.options.integer, true);
    assert.equal(field.options.min, undefined);
  }
  const model = {traits: {strength: 4, psyche: 2}, traitCurrent: {strength: -1},
    effective: {traits: {strength: 0, psyche: 0}, skills: {}}, resources: {}};
  NpcData.prototype.prepareBaseData.call(model);
  assert.deepEqual(model.effective.traits, {strength: -1, psyche: 2});
  assert.equal(model.traits.strength, 4);
  assert.equal(CharacterData.defineSchema().traitCurrent, undefined);
  assert.equal(AbilityData.defineSchema().ignoreWoundPenalties.options.initial, false);
  assert.equal(schema.details.fields.bodyMin.options.initial, 0);
  assert.equal(schema.details.fields.bodyMax.options.initial, 0);
});

test("NPC health bounds do not shrink when the played maximum changes", () => {
  const npc = actor();
  npc.system.details.bodyMin = 21;
  npc.system.details.bodyMax = 26;
  npc._source.system.resources.body.max = 23;
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 26, valid: true});
  npc._source.system.resources.body.max = 21;
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 26, valid: true});
  npc.system.details.bodyMax = 19;
  assert.equal(npcHealthRange(npc).valid, false);
  npc.system.details = {};
  assert.deepEqual(npcHealthRange(npc), {min: 21, max: 21, valid: true});
});

test("all starter NPCs retain both book bounds independently of their initial BP", () => {
  const content = JSON.parse(readFileSync(new URL("../data/starter-content.json", import.meta.url), "utf8"));
  for (const entry of content.actors) {
    const reference = CREATURE_NPC_DATA[entry.nameKey.replace(/\.Name$/, "")];
    assert.equal(entry.system.details.bodyMin, reference.bodyMin);
    assert.equal(entry.system.details.bodyMax, reference.bodyMax);
    assert.ok(entry.system.resources.body.max >= reference.bodyMin);
    assert.ok(entry.system.resources.body.max <= reference.bodyMax);
  }
});

test("NPC movement displays every recorded mode, including fractional or conditional distances", () => {
  const rows = npcMovementRows({details: {move: [
    {mode: "terrestre", distance: "1,5 m", max: "15 m ou 13 m avec armure"},
    {mode: "vol", distance: "3 m", max: "30 m"},
    {mode: "nage", distance: "0,75 m", max: "8 m"}
  ]}}, {localize: game.i18n.localize});
  assert.deepEqual(rows, [
    {mode: "Terrestre", distance: "1,5 m", max: "15 m ou 13 m avec armure"},
    {mode: "Vol", distance: "3 m", max: "30 m"},
    {mode: "Nage", distance: "0,75 m", max: "8 m"}
  ]);
  assert.deepEqual(npcMovementRows({details: {}, movement: {current: 12}}, {localize: game.i18n.localize}),
    [{mode: "Terrestre", distance: "—", max: "12 m"}]);
});

test("the health dice action rolls inclusive bounds, fills health and preserves the reference range", async t => {
  const previous = {document: globalThis.document, Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage};
  t.after(() => Object.assign(globalThis, previous));
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const totals = [21, 26];
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; }
    async evaluate() { this.total = totals.shift(); }
  };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => messages.push(data)};
  const npc = actor(); npc.isOwner = true;
  npc.system.details.bodyMin = 21;
  npc.system.details.bodyMax = 26;
  npc.system.modifiers.bodyMax = 3;
  npc.system.modifiers.bodyValue = 1;
  const updates = [];
  npc.update = async data => {
    updates.push(data);
    for (const [path, value] of Object.entries(data)) set(npc._source, path, value);
  };
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const action = TrudvangActorSheet.DEFAULT_OPTIONS.actions["roll-npc-health"];
  for (const health of [21, 26]) {
    const result = await action.call(sheet, {preventDefault() {}, stopPropagation() {}},
      {dataset: {action: "roll-npc-health"}, closest: () => null});
    assert.equal(result.roll.formula, "1d6 + 20");
    assert.equal(result.health, health);
    assert.equal(updates.at(-1)["system.resources.body.max"], health);
    assert.equal(updates.at(-1)["system.resources.body.value"], health + 2, "prepared current PS equals prepared maximum after effects");
    assert.equal(updates.at(-1)["system.details.bodyMax"], 26);
    assert.equal(updates.at(-1)["system.survivalRounds"], -1);
  }
  assert.equal(messages.length, 2);
  assert.ok(messages[0].content.includes("21 PS"));
  assert.equal(messages[0].rolls[0].formula, "1d6 + 20");
  npc.isOwner = false;
  assert.equal(await npc.rollNpcHealth(), null);
  npc.isOwner = true; npc.type = "character";
  assert.equal(await npc.rollNpcHealth(), null);
  assert.equal(updates.length, 2);
});

test("editing an effective trait removes its temporary effect without changing the reference", () => {
  const source = {traits: {strength: 4}, traitCurrent: {strength: 1}};
  assert.equal(npcTraitEdit({_source: {system: source}, getTraitValue: () => 3}, "strength", -2), -4);
  assert.equal(source.traits.strength, 4);
});

test("unrelated form submissions do not persist effect bonuses or break the intrinsic fallback", async () => {
  const npc = actor();
  npc.isOwner = true;
  npc.system.effective.traits.constitution = 5;
  const changes = [];
  npc.update = async update => changes.push(update);
  const submit = TrudvangActorSheet.DEFAULT_OPTIONS.form.handler;
  const values = {"system.traitCurrent.constitution": 5};
  await submit.call({actor: npc, isEditable: true}, {target: {name: "name"}}, {}, {object: values});
  assert.equal(changes.at(-1).system.traitCurrent.constitution, null);
  await submit.call({actor: npc, isEditable: true}, {target: {name: "system.traitCurrent.constitution"}}, {}, {object: values});
  assert.equal(changes.at(-1).system.traitCurrent.constitution, 2);
});

test("NPC fear fields show the upgraded factor without saving effects into either base component",async()=>{
 const npc=actor();npc.isOwner=true;
 npc._source.system.details.fearFactor="2d10 (JO 8-10)";
 npc.system.details.fearFactor=npc._source.system.details.fearFactor;
 npc.transformationProfile.fearFactor="3d10 (JO 6-10)";
 const sheet=new TrudvangNpcSheet();sheet.actor=npc;sheet.isEditable=true;
 const context=await sheet._prepareContext({});
 assert.equal(context.fearFactor.dice,3);
 assert.equal(context.fearFactor.threshold,6);
 assert.equal(context.fearFactorModified,true);
 assert.equal(context.baseFearFactorNotation,"2d10 (JO 8-10)");
 const updates=[];npc.update=async update=>updates.push(update);
 const submit=TrudvangActorSheet.DEFAULT_OPTIONS.form.handler;
 const values={name:npc.name,"trudvang.fearFactorDice":"3d10","trudvang.fearFactorThreshold":6};
 await submit.call(sheet,{target:{name:"name"}},{},{object:values});
 assert.equal(updates.at(-1).system?.details?.fearFactor,undefined);
 assert.equal(updates.at(-1).trudvang,undefined);
 await submit.call(sheet,{target:{name:"trudvang.fearFactorDice"}},{},{object:{...values,"trudvang.fearFactorDice":"4d10"}});
 assert.equal(updates.at(-1).system.details.fearFactor,"4d10 (JO 8-10)");
 await submit.call(sheet,{target:{name:"trudvang.fearFactorThreshold"}},{},{object:{...values,"trudvang.fearFactorThreshold":7}});
 assert.equal(updates.at(-1).system.details.fearFactor,"2d10 (JO 7-10)");
 assert.equal(npc._source.system.details.fearFactor,"2d10 (JO 8-10)");
});

test("NPC size displays its transformation without persisting it on unrelated submissions",async()=>{
 const npc=actor();npc.isOwner=true;npc._source.system.details.size="1/3";npc.system.details.size="1/3";npc.transformationProfile.size=2;
 const sheet=new TrudvangNpcSheet();sheet.actor=npc;sheet.isEditable=true;
 const context=await sheet._prepareContext({});
 assert.equal(context.effectiveSize,2);assert.equal(context.baseSize,"1/3");assert.equal(context.sizeModified,true);
 const updates=[];npc.update=async update=>updates.push(update);
 const submit=TrudvangActorSheet.DEFAULT_OPTIONS.form.handler;
 await submit.call(sheet,{target:{name:"name"}},{},{object:{name:npc.name,"trudvang.size":"2"}});
 assert.equal(updates.at(-1).system?.details?.size,undefined);assert.equal(updates.at(-1).trudvang,undefined);
 await submit.call(sheet,{target:{name:"trudvang.size"}},{},{object:{"trudvang.size":"3"}});
 assert.equal(updates.at(-1).system.details.size,"3");
 assert.equal(npc._source.system.details.size,"1/3");
});

test("Durable requires an explicit active feat mechanic, never a translated name", () => {
  assert.equal(ignoresWoundPenalties({items: [feat()]}), true);
  assert.equal(ignoresWoundPenalties({items: [feat(false)]}), false);
  assert.equal(ignoresWoundPenalties({items: [feat(true, 0)]}), false);
  const other = feat(); other.system.kind = "specialty";
  assert.equal(ignoresWoundPenalties({items: [other]}), false);
  const renamed = feat(); renamed.name = "Anything";
  assert.equal(ignoresWoundPenalties({items: [renamed]}), true);
});

test("Durable cancels wound penalties without changing damage, health or the dying state", () => {
  const ordinary = actor();
  const durable = actor([feat()]);
  assert.equal(ordinary.system.damage.penalty, -3);
  assert.equal(durable.system.damage.penalty, 0);
  assert.equal(durable.system.damage.taken, 30);
  assert.equal(durable.system.damage.level, ordinary.system.damage.level);
  assert.equal(durable.system.initiative.current, ordinary.system.initiative.current + 3);
  durable.system.resources.body.value = -12;
  durable.prepareDerivedData();
  assert.equal(durable.system.resources.body.current, -12);
  assert.equal(durable.system.damage.level, "dying");
  assert.equal(durable.system.damage.penalty, 0);
});

test("NPC skills show only skills above 1 and positive disciplines and specialties", () => {
  const discipline = knowledge("discipline", 2, "Armed combat");
  discipline.specialties = [knowledge("specialty", 0, "Unknown"), knowledge("specialty", 3, "Known")];
  const input = [tree(1), tree(8, [knowledge("discipline", 0, "Unknown"), discipline])];
  const result = npcSkillTrees(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].visible, true);
  assert.equal(result[0].disciplines.length, 1);
  assert.equal(result[0].disciplines[0].specialties.length, 1);
  assert.equal(discipline.specialties.length, 2, "filter must not mutate the source tree");
});

test("learned children remain visible even if their ancestor is unlearned", () => {
  const parent = knowledge("discipline", 0, "Parent");
  parent.specialties = [knowledge("specialty", 1, "Child")];
  const [result] = npcSkillTrees([tree(1, [parent])]);
  assert.equal(result.visible, false);
  assert.equal(result.disciplines[0].visible, false);
  assert.equal(result.disciplines[0].specialties.length, 1);
});

test("custom knowledge retains hierarchy and off-hand levels; creature feats are excluded", () => {
  const custom = [knowledge("discipline", 0, "Parent"),
    knowledge("specialty", 0, "Off-hand", {parentDiscipline: "Parent", offHandLevel: 3}),
    knowledge("feat", 1, "Durable"), knowledge("specialty", 2, "Orphan")];
  const [result] = npcSkillTrees([tree(1, [], custom)]);
  assert.equal(result.disciplines[0].visible, false);
  assert.equal(result.disciplines[0].specialties[0].offHandLevel, 3);
  assert.equal(result.disciplines[0].specialties[0].separateHands, true);
  assert.deepEqual(result.unassigned.map(node => node.item.name), ["Orphan"]);
});

test("NPC catalogue ability levels stay editable independently of character advancement", () => {
  const sheet = new TrudvangItemSheet();
  sheet.item = {type: "ability", system: {catalogId: "fighter", level: 3}, parent: {type: "npc"}};
  assert.equal(sheet.advancementLocked, false);
  assert.equal(sheet.levelManaged, false);
  sheet.item.parent = {type: "character", system: {experience: {creationMode: false}}};
  assert.equal(sheet.advancementLocked, true);
});

for (const name of ["eq", "and", "or", "not", "concat", "checked", "editor", "selectOptions", "localize", "signed"]) {
  Handlebars.registerHelper(name, (...args) => {
    const options = args.pop();
    if (name === "eq") return args[0] === args[1];
    if (name === "and") return args.every(Boolean);
    if (name === "or") return args.some(Boolean);
    if (name === "not") return !args[0];
    if (name === "concat") return args.join("");
    if (name === "checked") return args[0] ? "checked" : "";
    if (name === "localize") return game.i18n.format(args[0], options.hash);
    if (name === "signed") return Number(args[0]) > 0 ? `+${Number(args[0])}` : `${Number(args[0])}`;
    return "";
  });
}
const render = Handlebars.compile(readFileSync(new URL("../templates/actor/npc-sheet.hbs", import.meta.url), "utf8"));

test("the real NPC sheet context and template render natural armor without integrity", async () => {
  const npc = actor([feat()]);
  const sheet = new TrudvangNpcSheet();
  sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.armorStatus.protection, 4);
  assert.equal(context.armorStatus.hasIntegrity, false);
  assert.equal(context.armorStatus.integrityCurrent, 0);
  assert.equal(context.npcSkillTrees.length, 1);
  const html = render(context);
  assert.match(html, /dont 4 VP naturels/);
  assert.match(html, /Intégrité.*—/);
  assert.match(html, /Tenace : aucun malus de blessures/);
  assert.doesNotMatch(html, /−3 aux VC/);
  assert.equal((html.match(/name="system\.traitCurrent\./g) || []).length, 7, "each current trait has its compact input");
  assert.ok(html.indexOf("npc-health-panel") < html.indexOf("npc-stats-grid"));
  assert.doesNotMatch(html, /TRUDVANG\./, "every visible label must be translated");
});

test("the NPC initiative info button opens the same inspection as PCs without rolling", async t => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor();
  sheet.actor.rollInitiativeTrudvang = () => assert.fail("inspection must not roll initiative");
  const header = render(await sheet._prepareContext({})).split("</header>")[0];
  assert.match(header, /class="initiative-controls"/);
  assert.match(header, /class="stat-inspect-button" data-action="inspect-global-stat" data-stat="initiative"/);
  assert.match(header, /class="fas fa-circle-info"/);
  const previous = {document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => {globalThis.document = previous.document; foundry.applications.api.DialogV2 = previous.dialog;});
  globalThis.document = {createElement: () => ({set textContent(value) {this.value = value;}, get innerHTML() {return this.value;}})};
  const dialogs = [];
  foundry.applications.api.DialogV2 = {wait: async options => {dialogs.push(options); return null;}};
  await TrudvangActorSheet.DEFAULT_OPTIONS.actions["inspect-global-stat"].call(sheet,
    {preventDefault() {}, stopPropagation() {}}, {dataset: {action: "inspect-global-stat", stat: "initiative"}, closest: () => null});
  assert.equal(dialogs.length, 1);
  assert.equal(dialogs[0].window.title, game.i18n.localize("TRUDVANG.Resource.Initiative"));
  assert.match(dialogs[0].content, /class="trudvang inspection-dialog"/);
  assert.ok(dialogs[0].content.includes(`<strong>${sheet.actor.system.initiative.current}</strong>`));
});

test("the NPC header has only health and read-only movement, and compact traits can be edited", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  sheet._npcEditMode = true;
  sheet.actor.isOwner = true;
  sheet.actor.system.details.move = [{mode: "terrestre", distance: "3 m", max: "24 m"}, {mode: "nage", distance: "3 m", max: "24 m"}];
  const html = render(await sheet._prepareContext({}));
  const header = html.split('<nav class="sheet-tabs')[0];
  assert.doesNotMatch(header, /resources\.combat|reset-combat|Resource\.Protection|name="system\.movement/);
  assert.match(header, /data-action="roll-npc-health"/);
  assert.match(header, /Terrestre/);
  assert.match(header, /Nage/);
  assert.equal((header.match(/3 m \/ 24 m/g) || []).length, 2);
  assert.match(header, /Terrestre : <strong>3 m \/ 24 m<\/strong>/);
  assert.match(header, /Nage : <strong>3 m \/ 24 m<\/strong>/);
  assert.equal((header.match(/class="npc-movement-separator"/g) || []).length, 1);
  const fields = html.match(/<input class="npc-trait-current[^>]+>/g);
  assert.equal(fields.length, 7);
  for (const field of fields) assert.doesNotMatch(field, /readonly|min=|max=/);
});

test("a single NPC movement mode has no separator and keeps its conditional distances", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  sheet.actor.system.details.move = [{mode: "vol", distance: "4 m", max: "24 m ou 18 m avec armure"}];
  const html = render(await sheet._prepareContext({})).split('<nav class="sheet-tabs')[0];
  assert.match(html, /Vol : <strong>4 m \/ 24 m ou 18 m avec armure<\/strong>/);
  assert.doesNotMatch(html, /npc-movement-separator/);
});

test("NPC combat movement parses the book's per-2-CP rate, including fractional metres", () => {
  assert.deepEqual(npcCombatMovementModes({details: {move: [
    {mode: "vol", distance: "4 m", max: "32 m"},
    {mode: "nage", distance: "1,5 m", max: "12 m"},
    {mode: "spécial", distance: "—", max: "10 m"}
  ]}}), [
    {id: "0", mode: "vol", metersPerTwo: 4},
    {id: "1", mode: "nage", metersPerTwo: 1.5}
  ]);
});

function inventoryItem(type, id, extra = {}) {
  return {type, id, name: id, uuid: `Actor.npc.Item.${id}`, img: "icons/svg/sword.svg",
    system: {quantity: 1, weight: 1, equipped: false, damage: "1d10", openRoll: 10, combatSpecialty: "oneHandedLightWeapons",
      breach: {value: 20, max: 20}, heft: 2, ...extra}};
}

test("the NPC equipment tab displays only material equipment and its editable controls", async () => {
  const items = [inventoryItem("weapon", "Axe"), inventoryItem("armor", "Leather"), inventoryItem("shield", "Shield"),
    {id: "rope", name: "Rope", type: "gear", system: {}}, inventoryItem("weapon", "Bite", {combatSpecialty: "natural"}), feat()];
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(items); sheet.isEditable = true;
  const context = await sheet._prepareContext({});
  const inventory = render(context).split('<div class="tab equipment')[1].split('<div class="tab combat')[0];
  for (const name of ["Axe", "Leather", "Shield", "rope"]) assert.match(inventory, new RegExp(`data-item-id="${name}"`));
  assert.doesNotMatch(inventory, /Bite|Tenace|item-parry|item-damage/);
  assert.equal((inventory.match(/data-item-field="quantity"/g) || []).length, 4);
  assert.equal((inventory.match(/data-action="item-ready"/g) || []).length, 2);
  assert.equal((inventory.match(/data-action="item-equip"/g) || []).length, 2);
  assert.equal((inventory.match(/data-action="inspect-item"/g) || []).length, 4);
  assert.match(inventory, /Inventaire par défaut/);
  assert.ok(context.npcCombatItems.every(row => ["weapon", "shield"].includes(row.item.type)));
  assert.doesNotMatch(inventory, /TRUDVANG\./);
});

test("NPC token inventories have a local hint and no mutable controls for read-only viewers", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([inventoryItem("weapon", "Axe")]); sheet.actor.isToken = true; sheet.isEditable = false;
  const inventory = render(await sheet._prepareContext({})).split('<div class="tab equipment')[1].split('<div class="tab combat')[0];
  assert.match(inventory, /Inventaire de cet exemplaire/);
  assert.doesNotMatch(inventory, /data-action="item-create"/);
  for (const tag of inventory.match(/<(?:input|button)[^>]+(?:data-item-field="quantity"|data-action="item-(?:delete|ready|equip)")[^>]*>/g)) assert.match(tag, /disabled/);
  assert.match(inventory, /data-action="item-edit"/);
  assert.match(inventory, /data-action="inspect-item"/);
});

test("empty creature inventories are usable and show three properly localized empty states", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  sheet._npcEditMode = true;
  sheet.actor.isOwner = true;
  const inventory = render(await sheet._prepareContext({})).split('<div class="tab equipment')[1].split('<div class="tab combat')[0];
  assert.match(inventory, /Aucune arme dans l’inventaire/);
  assert.match(inventory, /Aucune armure ni aucun bouclier/);
  assert.match(inventory, /Aucun autre équipement/);
  assert.equal((inventory.match(/data-action="item-create"/g) || []).length, 5);
});

test("inventory drops clone external equipment with fresh IDs and reject other item types", async t => {
  const previous = {ui: globalThis.ui, deepClone: foundry.utils.deepClone};
  t.after(() => { globalThis.ui = previous.ui; foundry.utils.deepClone = previous.deepClone; });
  foundry.utils.deepClone = structuredClone;
  const warnings = []; globalThis.ui = {notifications: {warn: text => warnings.push(text)}};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor();
  const created = []; sheet.actor.createEmbeddedDocuments = async (type, data) => { assert.equal(type, "Item"); created.push(...data); return data; };
  const source = {_id: "external", ...inventoryItem("weapon", "External axe")};
  await sheet._handleDrop(source, {equipmentOnly: true});
  assert.equal(created[0]._id, undefined);
  created[0].system.quantity = 4;
  assert.equal(source.system.quantity, 1);
  assert.equal(source._id, "external");
  await sheet._handleDrop({type: "gear", system: {}}, {equipmentOnly: true});
  await sheet._handleDrop({type: "potion", system: {}}, {equipmentOnly: true});
  assert.equal(created.length, 3);
  await sheet._handleDrop({type: "ability", system: {}}, {equipmentOnly: true});
  assert.match(warnings[0], /équipement/);
  await sheet._handleDrop({type: "ability", system: {level: 2}});
  assert.equal(created.length, 4, "abilities can still be added elsewhere on the NPC sheet");
});

test("an item with the same ID from another token is copied, not mistaken for an internal sort", async t => {
  const previous = foundry.utils.deepClone; t.after(() => { foundry.utils.deepClone = previous; }); foundry.utils.deepClone = structuredClone;
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.actor.uuid = "Scene.test.Token.first.Actor.npc"; sheet._activeTab = "equipment";
  sheet.actor.items.has = () => true;
  sheet._onSortItem = async () => { throw new Error("Must not sort a different token's item"); };
  const created = []; sheet.actor.createEmbeddedDocuments = async (type, data) => created.push(...data);
  const data = {_id: "sameId", ...inventoryItem("weapon", "Axe")};
  const external = {documentName: "Item", id: "sameId", parent: {uuid: "Scene.test.Token.second.Actor.npc"}, toObject: () => data};
  await sheet._onDropItem({}, external);
  assert.equal(created.length, 1);
  let sorted = false; sheet._onSortItem = async () => { sorted = true; };
  await sheet._onDropItem({}, {...external, parent: sheet.actor});
  assert.equal(sorted, true);
  assert.equal(created.length, 1);
});

test("equipment quantity and equip actions update only the actor on the token sheet", async () => {
  const prototypeItem = inventoryItem("armor", "Leather");
  const localItem = structuredClone(prototypeItem);
  localItem.update = async changes => { for (const [key, value] of Object.entries(changes)) set(localItem, key, value); };
  const npc = actor([localItem]); npc.isToken = true; npc.items.get = id => npc.items.find(item => item.id === id);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const input = {value: "3", dataset: {itemField: "quantity"}, closest: () => ({dataset: {itemId: "Leather"}}), addEventListener(type, listener) { this.listener = listener; }};
  sheet.element = {querySelectorAll: selector => selector === "input[data-item-field]" ? [input] : []};
  sheet._activateTabs = () => {}; sheet._restoreViewState = () => {}; sheet._captureViewState = () => {};
  await sheet._onRender({}, {});
  await input.listener({currentTarget: input});
  const target = {dataset: {action: "item-equip"}, closest: selector => selector === "[data-item-id]" ? {dataset: {itemId: "Leather"}} : null};
  await TrudvangActorSheet.DEFAULT_OPTIONS.actions["item-equip"].call(sheet, {preventDefault() {}, stopPropagation() {}}, target);
  assert.equal(localItem.system.quantity, 3);
  assert.equal(localItem.system.equipped, true);
  assert.equal(prototypeItem.system.quantity, 1);
  assert.equal(prototypeItem.system.equipped, false);
});

test("NPC pools are calculated from book levels, effects and embedded overrides rather than a preset maximum", () => {
  const npc = actor([], {fighting: 1});
  npc.system.skillTree = [{name: "Combat", kind: "skill", value: 10},
    {name: "Combat armé", kind: "discipline", value: 3},
    {name: "Armes lourdes à une main", kind: "specialty", value: 4},
    {name: "Expérience du combat", kind: "discipline", value: 1},
    {name: "Combattant", kind: "specialty", value: 2}];
  npc.system.effective.skills.fighting = 3; // +2 effect on the stored skill of 1.
  npc.system.modifiers.combatMax = 2;
  let pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.free.max, 15); // Book 10, effect 2, experience 1, CP modifier 2.
  assert.equal(pools.armedFighting.max, 3);
  assert.equal(pools.oneHandedHeavyWeapons.max, 8);
  assert.equal(pools.attacksParries.max, 4);
  assert.equal(pools.oneHandedHeavyWeaponsOffHand.max, 0);
  npc.items.push({type: "ability", name: "Modified expertise", system: {catalogId: "armedFighting", level: 5}});
  pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.armedFighting.max, 5, "an actual embedded item takes precedence over a book row");
  assert.equal(npc.items.length, 1, "rule resolution never creates ability items");
});

test("book knowledge identifiers work independently of translated row names", () => {
  const npc = actor([], {fighting: 1});
  npc.system.skillTree = [{name: "Fighting", kind: "skill", value: 9, skillId: "fighting"},
    {name: "Armed Fighting", kind: "discipline", value: 2, catalogId: "armedFighting"},
    {name: "Two-handed Weapons", kind: "specialty", value: 3, catalogId: "twoHandedWeapons"}];
  const pools = Object.fromEntries(resolveCombatPools({actor: npc}).pools.map(pool => [pool.id, pool]));
  assert.equal(pools.free.max, 9); assert.equal(pools.armedFighting.max, 2); assert.equal(pools.twoHandedWeapons.max, 6);
  const item = inventoryItem("weapon", "Club", {combatSpecialty: "twoHandedWeapons", weaponActions: 2});
  assert.equal(npc.getWeaponActionState(item).max, 3, "book specialty also modifies the weapon's AA");
});

function naturalItem(id, pool, max) {
  return inventoryItem("weapon", id, {combatSpecialty: "natural", category: "natural", equipped: true,
    weaponActions: 4, naturalCombatPool: pool, naturalCombatPoints: max, naturalCombatPointsSpent: 0});
}

function spendableNpc(items) {
  const npc = actor(items); npc.isOwner = true; npc.uuid = "Actor.test";
  npc._source.system.combatPools.free = {spent: 0, weaponSpent: 4, offHandSpent: 0};
  npc.system.combatPools.free = {...npc._source.system.combatPools.free};
  npc.prepareDerivedData();
  npc.update = async changes => {
    for (const [key, value] of Object.entries(changes)) { set(npc, key, value); set(npc._source, key, value); }
  };
  npc.updateEmbeddedDocuments = async (type, updates) => {
    assert.equal(type, "Item");
    for (const {_id, ...changes} of updates) for (const [key, value] of Object.entries(changes)) set(npc.items.find(item => item.id === _id), key, value);
  };
  return npc;
}

test("natural pools are contextual, shared once, and use the lower remaining Free CP hand", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const horns = naturalItem("Horns", "natural", 8), fists = naturalItem("Fists", "natural", 8), bite = naturalItem("Bite", "bite", 6);
  const npc = spendableNpc([horns, fists, bite]); game.combat = {started: true, combatants: [{actor: npc}]};
  const resolution = resolveCombatPools({actor: npc, item: horns, context: {action: "attack"}});
  assert.equal(resolution.totalMax, 22); // 8 Free, one shared 8, separate bite 6.
  assert.equal(resolution.freeScope, "both");
  assert.equal(resolution.eligibleCurrent, 12); // min(4,8) + shared natural 8.
  assert.equal(resolution.eligible.some(pool => pool.id === "natural:bite"), false);
  assert.equal(resolveCombatPools({actor: npc, context: {action: "other"}}).eligibleCurrent, 4);
  assert.equal(resolveCombatPools({actor: npc, context: {action: "movement"}}).eligibleCurrent, 4);
  const suggested = suggestCombatAllocation(resolution.eligible, 10);
  assert.deepEqual(suggested, {"natural:natural": 8, free: 2});
  assert.deepEqual(normalizeCombatAllocation(resolution.eligible, suggested).allocation, normalizeCombatAllocation(resolution.eligible, {free: 2, "natural:natural": 8}).allocation);
  await npc.spendCombatPoints(suggested, {freeScope: resolution.freeScope});
  assert.equal(horns.system.naturalCombatPointsSpent, 8); assert.equal(fists.system.naturalCombatPointsSpent, 8);
  assert.equal(bite.system.naturalCombatPointsSpent, 0);
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 2);
  assert.equal(resolveCombatPools({actor: npc, item: fists, context: {action: "parry"}}).eligibleCurrent, 2);
  await npc.resetCombatPoints();
  assert.equal(horns.system.naturalCombatPointsSpent, 0); assert.equal(fists.system.naturalCombatPointsSpent, 0);
  assert.equal(resolveCombatPools({actor: npc, item: horns, context: {action: "attack"}}).eligibleCurrent, 16);
});

test("NPC weapon spends only its hand, generic actions spend both, and outside combat nothing is spent", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const axe = inventoryItem("weapon", "Axe", {combatSpecialty: "oneHandedLightWeapons", hand: "offHand"});
  const npc = spendableNpc([axe]); game.combat = {started: true, combatants: [{actor: npc}]};
  const scope = resolveCombatPools({actor: npc, item: axe, context: {action: "attack"}}).freeScope;
  await npc.spendCombatPoints({free: 3}, {freeScope: scope});
  assert.equal(npc.system.combatPools.free.weaponSpent, 4); assert.equal(npc.system.combatPools.free.offHandSpent, 3);
  await npc.spendCombatPoints({free: 2});
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 5);
  game.combat = null;
  await npc.spendCombatPoints({free: 2});
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 5);
});

test("NPC movement spends both Free hands and uses the selected bestiary movement mode", async t => {
  const previous = {combat: game.combat, ui: globalThis.ui, document: globalThis.document, dialog: foundry.applications.api.DialogV2,
    users: game.users, ChatMessage: globalThis.ChatMessage};
  t.after(() => { game.combat = previous.combat; globalThis.ui = previous.ui; globalThis.document = previous.document;
    foundry.applications.api.DialogV2 = previous.dialog; game.users = previous.users; globalThis.ChatMessage = previous.ChatMessage; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const notices = [];
  globalThis.ui = {notifications: {info: message => notices.push(message), warn: message => assert.fail(message)}};
  let dialog;
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialog = options;
    return {allocation: {free: 4}, movementMode: "1"};
  }};
  const npc = spendableNpc([]);
  const messages = [];
  game.users = [{id: "gm", isGM: true}, {id: "owner"}, {id: "observer"}];
  npc.testUserPermission = user => user.id === "owner";
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}),
    create: async data => { messages.push(data); return data; }};
  npc.system.details.move = [{mode: "terrestre", distance: "2 m", max: "16 m"},
    {mode: "vol", distance: "4 m", max: "32 m"}];
  game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollCombatMovement();
  assert.match(dialog.content, /Terrestre : 2 m pour 2 PC/);
  assert.match(dialog.content, /Vol : 4 m pour 2 PC/);
  assert.equal(result.paidMeters, 8);
  assert.equal(npc.system.combatPools.free.weaponSpent, 8);
  assert.equal(npc.system.combatPools.free.offHandSpent, 4);
  assert.match(notices[0], /8 mètre/);
  assert.equal(messages.length, 1);
  assert.match(messages[0].content, /Vol, 8 m/);
  assert.match(messages[0].content, /4 PC dépensés/);
  assert.deepEqual(messages[0].whisper, []);
  assert.doesNotMatch(messages[0].content, /chat-card/);
});

test("a wrestling roll ignores Combat Actions and never spends an odd total", async t => {
  const previous = {combat: game.combat, ui: globalThis.ui, document: globalThis.document,
    Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.ui = previous.ui; globalThis.document = previous.document;
    globalThis.Roll = previous.Roll; globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.ui = {notifications: {warn: message => assert.fail(message)}};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = 1; } };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor: source}) => ({actor: source.id}),
    create: async data => { messages.push(data); return data; }};
  let dialog;
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialog = options;
    return {allocation: {free: 3, unarmedFighting: 1, wrestling: 1, combatActions: 2}, modifier: 0};
  }};
  const npc = spendableNpc([
    {type: "ability", name: "Combat à mains nues", system: {catalogId: "unarmedFighting", kind: "discipline", level: 1}},
    {type: "ability", name: "Lutte", system: {catalogId: "wrestling", kind: "specialty", level: 1}},
    {type: "ability", name: "Actions de combat", system: {catalogId: "combatActions", kind: "specialty", level: 1}}
  ]);
  game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollWrestlingAction("grapple");
  assert.doesNotMatch(dialog.content, /data-pool-id="combatActions"/);
  assert.match(dialog.content, /data-combat-slider min="0" max="[0-9]+" step="2"/);
  assert.equal(result.target, -1, "the 2 VC obtained from CP still take the creature's -3 wound penalty");
  assert.equal(npc.system.combatPools.free.weaponSpent, 6);
  assert.equal(npc.system.combatPools.free.offHandSpent, 2);
  assert.equal(messages.length, 1);
});

test("PC movement announces terrestrial distance, and cancellations, invalid costs or observers announce nothing", async t => {
  const runtime = mockActionRuntime(t);
  const before = game.users;
  t.after(() => { game.users = before; });
  game.users = [{id: "gm", isGM: true}, {id: "owner"}];
  const pc = spendableNpc([]);
  pc.type = "character";
  pc.testUserPermission = user => user.id === "owner";
  game.combat = {started: true, combatants: [{actor: pc}]};
  const spent = {...pc.system.combatPools.free};
  assert.equal(await pc.rollCombatMovement(), null);
  assert.equal(runtime.messages.length, 0);
  runtime.response = {allocation: {free: 3}};
  await pc.rollCombatMovement();
  assert.equal(runtime.messages.length, 0);
  assert.deepEqual(pc.system.combatPools.free, spent);
  runtime.response = {allocation: {free: 4}};
  pc.isOwner = false;
  assert.equal(await pc.rollCombatMovement(), null);
  assert.equal(runtime.messages.length, 0);
  pc.isOwner = true;
  const result = await pc.rollCombatMovement();
  assert.equal(result.paidMeters, 2);
  assert.equal(runtime.messages.length, 1);
  assert.match(runtime.messages[0].content, /Terrestre, 2 m/);
  assert.match(runtime.messages[0].content, /4 PC dépensés/);
});

test("NPC actions show sticky reserve data, material weapons, natural profiles, then Other without inventory clutter", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const axe = inventoryItem("weapon", "Axe", {combatSpecialty: "oneHandedLightWeapons", weaponActions: 2, equipped: true});
  const spare = inventoryItem("weapon", "Spare", {combatSpecialty: "twoHandedWeapons", weaponActions: 0, equipped: false});
  const bite = naturalItem("Bite", "bite", 6);
  const sheet = new TrudvangNpcSheet(); sheet.actor = spendableNpc([axe, spare, bite, inventoryItem("gear", "Rope"), feat()]); sheet.isEditable = true;
  game.combat = {started: true, combatants: [{actor: sheet.actor}]};
  const context = await sheet._prepareContext({});
  const actions = render(context).split('<div class="tab combat"')[1].split('<div class="tab magic"')[0];
  assert.ok(actions.indexOf("combat-reserves-panel") < actions.indexOf('data-item-id="Axe"'));
  assert.ok(actions.indexOf('data-item-id="Spare"') < actions.indexOf('data-item-id="Bite"'));
  assert.ok(actions.indexOf('data-item-id="Bite"') < actions.indexOf('data-action="generic-combat-action"'));
  assert.ok(actions.indexOf('data-action="movement-action"') < actions.indexOf('data-action="generic-combat-action"'));
  assert.match(actions, /aria-valuenow="4" aria-valuemax="8"/);
  assert.match(actions, /aria-valuenow="6" aria-valuemax="6"/);
  assert.doesNotMatch(actions, /Rope|Tenace|item-delete|TRUDVANG\./);
  const spareRow = actions.split('data-item-id="Spare"')[1].split('</li>')[0];
  assert.match(spareRow, /data-action="item-roll"[^>]+disabled/);
  assert.match(spareRow, /data-action="item-parry"[^>]+disabled/);
});

test("NPC wrestling actions appear only when the creature can use them", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor(); sheet.isEditable = true;
  let context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, false);
  assert.equal(context.npcWrestling.glima, false);
  sheet.actor.system.attacks = [[{attack: "Lutte", value: 10}]];
  context = await sheet._prepareContext({});
  const actions = render(context).split('<div class="tab combat"')[1].split('<div class="tab magic"')[0];
  assert.equal(context.npcWrestling.grapple, true);
  assert.equal(context.npcWrestling.glima, true);
  assert.match(actions, /data-action="wrestling-action" data-kind="grapple"/);
  assert.match(actions, /data-action="wrestling-action" data-kind="glima"/);
  sheet.actor.system.attacks = [];
  sheet.actor.effects = [{name: "Saisie", disabled: false, flags: {"trudvang-chronicles": {feat: "Saisie"}}}];
  context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, true, "a creature's Saisie capability also grants the action");
  assert.equal(context.npcWrestling.glima, false);
  sheet.actor.effects = [];
  sheet.actor.items.push({type: "creatureAbility", name: "Catch", img: "icons/svg/aura.svg",
    system: {catalogId: CREATURE_ABILITY_REFERENCES.Saisie.id, summary: "", description: "", source: {book: "", page: 0}}});
  context = await sheet._prepareContext({});
  assert.equal(context.npcWrestling.grapple, true, "the compendium Item keeps the action in either language");
  assert.equal(context.npcWrestling.glima, false);
});

test("a natural attack dialog spends its reserve and both Free hands, rolls a D20 and posts its result", async t => {
  const previous = {combat: game.combat, document: globalThis.document, Roll: globalThis.Roll,
    ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.document = previous.document; globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = 1; } };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => { messages.push(data); return data; }};
  const dialogs = [];
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    dialogs.push(options);
    return {modifier: 0, feint: 0, allocation: {"natural:bite": 6, free: 2}};
  }};
  const bite = naturalItem("Bite", "bite", 6);
  bite.update = async changes => { for (const [key, value] of Object.entries(changes)) set(bite, key, value); };
  const npc = spendableNpc([bite]); game.combat = {started: true, combatants: [{actor: npc}]};
  const result = await npc.rollWeaponAction(bite, "attack");
  assert.match(dialogs[0].content, /data-pool-id="natural:bite"/);
  assert.match(dialogs[0].content, /Bite/);
  assert.equal(result.roll.formula, "1d20"); assert.equal(result.result, 1);
  assert.equal(messages.length, 1); assert.equal(messages[0].rolls[0], result.roll);
  assert.equal(bite.system.naturalCombatPointsSpent, 6);
  assert.equal(bite.system.weaponActionsSpent, 1);
  assert.equal(npc.system.combatPools.free.weaponSpent, 6); assert.equal(npc.system.combatPools.free.offHandSpent, 2);
});

test("humanoid bare hands deplete a persisted actor-level AA counter capped at 4", async t => {
  const before = game.combat; t.after(() => { game.combat = before; });
  const pc = spendableNpc([]); pc.type = "character"; game.combat = {started: true, combatants: [{actor: pc}]};
  const fists = pc.humanoidNaturalWeapon;
  assert.equal(pc.getWeaponActionState(fists).max, 4);
  assert.equal(pc.getWeaponActionState(fists).current, 4);
  for (let i = 0; i < 4; i++) assert.equal(await pc.spendWeaponAction(fists), true);
  assert.equal(pc.system.unarmedActionsSpent, 4);
  assert.equal(pc.getWeaponActionState(fists).current, 0);
  assert.equal(await pc.spendWeaponAction(fists), false, "5th bare-hands action blocked (p317: max 4 per round)");
  await pc.resetCombatPoints();
  assert.equal(pc.getWeaponActionState(fists).current, 4);
});

test("huvfurwurm attacks spend only their shared reserve and reset their actions and CP each round",async t=>{
 const previous={combat:game.combat,ui:globalThis.ui,document:globalThis.document,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage,dialog:foundry.applications.api.DialogV2};
 t.after(()=>{game.combat=previous.combat;globalThis.ui=previous.ui;globalThis.document=previous.document;globalThis.Roll=previous.Roll;globalThis.ChatMessage=previous.ChatMessage;foundry.applications.api.DialogV2=previous.dialog;});
 const warnings=[];globalThis.ui={notifications:{warn:message=>{warnings.push(message);return null;}}};
 globalThis.document={createElement:()=>({set textContent(value){this.value=value;},get innerHTML(){return this.value;}})};
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=5;}};
 globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>data};
 const sword=inventoryItem("weapon","Sword",{equipped:true,category:"oneHandedLight",combatSpecialty:"oneHandedLightWeapons",weaponActions:2,weaponActionsSpent:0,damage:"1d10"});sword.id="sword";
 const extra=inventoryItem("weapon","Attaque du huvfurwurm — Sword",{...sword.system,weaponActions:2,naturalCombatPool:"effect:arms",naturalCombatPoints:10,naturalCombatPointsSpent:0});extra.id="extra";
 extra.flags={"trudvang-chronicles":{transformationGrant:"arms",extraWeaponAction:{weaponId:sword.id}}};
 const npc=spendableNpc([sword,extra]);npc.effects=[{id:"arms",system:{changes:[]},flags:{"trudvang-chronicles":{transformation:{editableChanges:true}}}}];
 npc.allApplicableEffects=()=>npc.effects;
 for(const i of npc.items){i.actor=npc;i.update=async changes=>{for(const [key,value]of Object.entries(changes))set(i,key,value);};}
 game.combat={started:true,combatants:[{actor:npc}]};
 let dialogs=0;foundry.applications.api.DialogV2=class{static async wait(){dialogs++;return {modifier:0,feint:0,allocation:{"natural:effect:arms":5,free:8}};}};
 await npc.rollWeaponAction(extra,"attack");assert.equal(dialogs,0);assert.match(warnings.at(-1),/actions d’arme ordinaires/);
 sword.system.weaponActionsSpent=2;
 const free=structuredClone(npc.system.combatPools.free);
 await npc.rollWeaponAction(extra,"attack");assert.equal(extra.system.naturalCombatPointsSpent,5);assert.equal(extra.system.weaponActionsSpent,1);
 await npc.rollWeaponAction(extra,"attack");assert.equal(extra.system.naturalCombatPointsSpent,10);assert.equal(extra.system.weaponActionsSpent,2);
 assert.deepEqual(npc.system.combatPools.free,free,"injected ordinary allocation must not consume free CP");
 await npc.rollWeaponAction(extra,"attack");assert.equal(dialogs,2,"third action is blocked");
 await npc.resetCombatPoints();assert.equal(extra.system.naturalCombatPointsSpent,0);assert.equal(extra.system.weaponActionsSpent,0);assert.equal(sword.system.weaponActionsSpent,0);
 await npc.rollWeaponAction(extra,"attack");assert.equal(dialogs,2,"ordinary actions are required again after reset");
});

test("a bare-hands attack rolls end to end without touching item.update", async t => {
  const previous = {combat: game.combat, document: globalThis.document, Roll: globalThis.Roll,
    ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2};
  t.after(() => { game.combat = previous.combat; globalThis.document = previous.document; globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = 1; } };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => { messages.push(data); return data; }};
  foundry.applications.api.DialogV2 = class { static async wait() { return {modifier: 0, feint: 0, allocation: {free: 2}}; } };
  const pc = spendableNpc([]); pc.type = "character"; game.combat = {started: true, combatants: [{actor: pc}]};
  await pc.rollNaturalCombatAction("attack");
  assert.equal(pc.system.unarmedActionsSpent, 1);
  assert.equal(messages.length, 1);
});

test("worn armor adds protection and VI while natural armor never acquires VI", async () => {
  const armor = {id: "mail", name: "Mail", type: "armor", uuid: "Item.mail",
    system: {equipped: true, heft: 1, breach: {value: 40, max: 50}, weight: 2}};
  const npc = actor([armor]);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.armorStatus.protection, 8);
  assert.equal(context.armorStatus.integrityCurrent, 40);
  assert.equal(context.armorStatus.integrityMax, 50);
  assert.match(render(context), /40 \/ 50 VI/);
});

test("catalogue disciplines and specialties render on separate linked rows, not as duplicate orphans", async () => {
  const parent = {id: "parent", name: "Combat armé", type: "ability",
    system: {kind: "discipline", catalogId: "armedFighting", parentSkill: "fighting", level: 2}};
  const child = {id: "child", name: "Armes légères à une main", type: "ability",
    system: {kind: "specialty", catalogId: "oneHandedLightWeapons", parentSkill: "fighting", level: 3, offHandLevel: 2}};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([parent, child]);
  const context = await sheet._prepareContext({});
  const [root] = context.npcSkillTrees;
  assert.equal(root.disciplines.length, 1);
  assert.equal(root.disciplines[0].specialties.length, 1);
  assert.equal(root.unassigned.length, 0);
  const html = render(context).split('<div class="tab combat"')[0];
  assert.equal((html.match(/data-item-id="parent"/g) || []).length, 1);
  assert.equal((html.match(/data-item-id="child"/g) || []).length, 1);
  assert.match(html, /3 \| 2/);
});

test("book knowledge opens its reference without creating an ability on the NPC", async () => {
  const sheet = new TrudvangNpcSheet();
  sheet.actor = actor();
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"},
    {name: "Connaissances", value: 5, kind: "skill"},
    {name: "Langage", value: 1, kind: "discipline"},
    {name: "Langue maternelle (bastjumal)", value: 2, kind: "specialty"}
  ];
  const rows = sheet._npcBookSkillRows();
  assert.equal(rows[0].skillKey, "fighting");
  assert.equal(rows[1].catalogId, "armedFighting");
  assert.equal(rows[2].catalogId, "oneHandedLightWeapons");
  assert.equal(rows[5].catalogId, "motherTongue");
  const opened = [];
  game.packs = new Map([["trudvang-chronicles.skills-fr", {
    getDocument: async id => {
      assert.equal(id, deterministicId("ability:oneHandedLightWeapons"));
      return {sheet: {render: options => opened.push(options)}};
    }
  }]]);
  try {
    await sheet._openNpcBookSkill(2);
    assert.deepEqual(opened, [{force: true}]);
    assert.equal(sheet.actor.items.length, 0);
    const html = render(await sheet._prepareContext({}));
    assert.match(html, /data-action="show-npc-book-skill" data-index="2"/);
  } finally { delete game.packs; }
});

test("NPC capacities open a dedicated sheet and never appear among actual effects", async () => {
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()]);
  sheet.actor.effects = [
    {uuid: "Actor.npc.ActiveEffect.vision", name: "Vision nocturne", isOwner: true, img: "icons/svg/eye.svg", description: "<p>Vision en faible lumière.</p>", flags: {"trudvang-chronicles": {feat: "Vision nocturne"}}, sheet: {render() { throw new Error("Must not open the effect sheet"); }}},
    {uuid: "Actor.npc.ActiveEffect.manual", name: "Charge", img: "icons/svg/aura.svg", description: "Un véritable effet ajouté à la main.", flags: {}, system: {changes: []}, canUserModify: () => true}
  ];
  sheet.actor.allApplicableEffects = () => sheet.actor.effects;
  const context = await sheet._prepareContext({});
  assert.deepEqual(context.npcAbilities.map(entry => entry.name), ["Vision nocturne"]);
  assert.deepEqual(context.effects.map(entry => entry.name), ["Charge"]);
  const html = render(context).split('<div class="tab combat"')[0];
  assert.match(html, /data-action="capacity-edit" data-effect-uuid="Actor.npc.ActiveEffect.vision"/);
  assert.equal(context.npcAbilities[0].summary, creatureAbilityDetails(sheet.actor.effects[0], {localize: key => game.i18n.localize(key)}).summary);
  assert.doesNotMatch(html, /data-effect-uuid="Actor.npc.ActiveEffect.manual"/);
  const resolveUuid = foundry.utils.fromUuidSync;
  foundry.utils.fromUuidSync = uuid => {
    assert.equal(uuid, "Actor.npc.ActiveEffect.vision");
    return sheet.actor.effects[0];
  };
  try {
    const opened = await TrudvangActorSheet.DEFAULT_OPTIONS.actions["capacity-edit"].call(sheet,
      {preventDefault() {}, stopPropagation() {}},
      {dataset: {action: "capacity-edit", effectUuid: context.npcAbilities[0].effectUuid}, closest: () => null});
    assert.equal(opened.constructor.name, "TrudvangCreatureAbilitySheet");
    assert.deepEqual(opened.renderOptions, {force: true});
    const capacity = await opened._prepareContext({});
    assert.equal(capacity.ability.source.book, "Bestiaire de Jorge");
    assert.equal(typeof capacity.ability.source.page, "number");
    assert.equal(capacity.enrichedDescription, "<p>Vision en faible lumière.</p>");
    const template = Handlebars.compile(readFileSync(new URL("../templates/item/creature-ability-sheet.hbs", import.meta.url), "utf8"));
    assert.match(template(capacity), /<prose-mirror name="description"/);
    assert.doesNotMatch(template(capacity), /name="(duration|system.changes|disabled|transfer)/);
  } finally { foundry.utils.fromUuidSync = resolveUuid; }
});

test("capacity fields save independently of effect changes and preserve custom values", async () => {
  const {TrudvangCreatureAbilitySheet} = await import("../modules/sheets/creature-ability-sheet.mjs");
  let update;
  const document = {isOwner: true, name: "Vision nocturne", description: "<p>Description personnalisée.</p>",
    flags: {"trudvang-chronicles": {feat: "Vision nocturne", capacitySummary: "Résumé personnalisé", capacitySource: {book: "Livre personnel", page: 8}}},
    update: async value => { update = value; }};
  const sheet = new TrudvangCreatureAbilitySheet({document});
  const context = await sheet._prepareContext({});
  assert.equal(context.ability.summary, "Résumé personnalisé");
  assert.deepEqual(context.ability.source, {book: "Livre personnel", page: 8});
  const fields = {name: "Vision modifiée", description: "<p>Nouvelle description.</p>",
    "flags.trudvang-chronicles.capacitySummary": "Nouveau résumé", "flags.trudvang-chronicles.capacitySource.book": "Nouveau livre",
    "flags.trudvang-chronicles.capacitySource.page": "12", "system.changes": [{key: "bad"}], disabled: true};
  await TrudvangCreatureAbilitySheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: fields});
  assert.equal(update["flags.trudvang-chronicles.capacitySource.page"], 12);
  assert.equal(update.description, "<p>Nouvelle description.</p>");
  assert.equal(update["system.changes"], undefined);
  assert.equal(update.disabled, undefined);
  update = null;
  sheet.isEditable = false;
  await TrudvangCreatureAbilitySheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: fields});
  assert.equal(update, null);
});

test("compendium capacity Items use their dedicated sheet and appear apart from active effects", async () => {
  const {TrudvangCreatureAbilityItemSheet, openCreatureAbilitySheet} = await import("../modules/sheets/creature-ability-sheet.mjs");
  let changes, rendered;
  const capacity = {id: "tenace", uuid: "Actor.npc.Item.tenace", type: "creatureAbility", name: "Tenace", img: "icons/svg/aura.svg", isOwner: true,
    system: {catalogId: "tenace", summary: "Aucun malus de blessures", description: "<p>Texte détaillé.</p>",
      source: {book: "Bestiaire de Jorge", page: 40}, ignoreWoundPenalties: true},
    sheet: {render: value => { rendered = value; }}, update: async value => {changes = value;}};
  const actorSheet = new TrudvangNpcSheet(); actorSheet.actor = actor([capacity]);
  const context = await actorSheet._prepareContext({});
  assert.equal(context.npcAbilities.length, 1); assert.equal(context.npcAbilities[0].effectUuid, capacity.uuid);
  assert.equal(context.effects.length, 0); assert.ok(ignoresWoundPenalties(actorSheet.actor));
  openCreatureAbilitySheet(capacity); assert.deepEqual(rendered, {force: true});
  const sheet = new TrudvangCreatureAbilityItemSheet({document: capacity}); sheet.isEditable = true;
  const fields = await sheet._prepareContext({});
  assert.equal(fields.descriptionField, "system.description"); assert.equal(fields.summaryField, "system.summary");
  assert.equal(fields.sourceBookField, "system.source.book");
  const template = Handlebars.compile(readFileSync(new URL("../templates/item/creature-ability-sheet.hbs", import.meta.url), "utf8"));
  const html = template({...fields, editable: true});
  assert.match(html, /prose-mirror name="system.description"/); assert.match(html, /name="system.source.book"/);
  assert.doesNotMatch(html, /system\.level|system\.changes|capacitySummary/);
  await TrudvangCreatureAbilityItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {
    "system.summary": "Modifié", "system.source.page": "41", "system.changes": [], "system.ignoreWoundPenalties": false}});
  assert.deepEqual(changes, {"system.summary": "Modifié", "system.source.page": 41});
});

test("book skill D20 buttons use the PJ roll dialog and the correct discipline/specialty levels", async t => {
  const previousDocument = globalThis.document;
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  t.after(() => { globalThis.document = previousDocument; });
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: 1});
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"}
  ];
  const dialogs = [];
  foundry.applications.api.DialogV2 = class {static async wait(options) { dialogs.push(options); return null; }};
  try {
    for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
    assert.deepEqual(dialogs.map(dialog => dialog.window.title), ["Combat", "Combat armé", "Armes légères à une main"]);
    for (const [index, target] of [8, 10, 16].entries()) assert.match(dialogs[index].content, new RegExp(`\\b${target}\\b`));
    const html = render(await sheet._prepareContext({}));
    assert.match(html, /data-action="roll-npc-book-skill" data-index="2"/);
    assert.equal(sheet.actor.items.length, 1, "rolling book knowledge creates no embedded item");
  } finally { delete foundry.applications.api.DialogV2; }
});

test("validating a book specialty roll evaluates a D20 and creates a chat message", async t => {
  const previous = {document: globalThis.document, Roll: globalThis.Roll, ChatMessage: globalThis.ChatMessage,
    dialog: foundry.applications.api.DialogV2};
  t.after(() => {
    globalThis.document = previous.document;
    globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage;
    foundry.applications.api.DialogV2 = previous.dialog;
  });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class {
    constructor(formula) { this.formula = formula; }
    async evaluate() { this.total = 7; }
  };
  const messages = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}),
    create: async data => { messages.push(data); return data; }};
  foundry.applications.api.DialogV2 = class {static async wait() { return {modifier: -2}; }};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: 1});
  sheet.actor.system.skillTree = [
    {name: "Combat", value: 8, kind: "skill"},
    {name: "Combat armé", value: 2, kind: "discipline"},
    {name: "Armes légères à une main", value: 3, kind: "specialty"}
  ];
  const result = await TrudvangActorSheet.DEFAULT_OPTIONS.actions["roll-npc-book-skill"].call(sheet,
    {preventDefault() {}, stopPropagation() {}},
    {dataset: {action: "roll-npc-book-skill", index: "2"}, closest: () => null});
  assert.equal(result.target, 14);
  assert.equal(result.result, 7);
  assert.equal(result.success, true);
  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0].speaker, {actor: "npc"});
  assert.equal(messages[0].rolls[0].formula, "1d20", "chat roll uses the normal Dice So Nice-compatible pipeline");
});

test("book skill rolls keep bonuses and effects without adding the actor base twice", async t => {
  const previous = {document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => { globalThis.document = previous.document; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const dialogs = [];
  foundry.applications.api.DialogV2 = class {static async wait(options) { dialogs.push(options); return null; }};
  for (const base of [1, 8]) {
    const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()], {fighting: base});
    sheet.actor.system.skills.fighting.bonus = 2;
    sheet.actor.system.effective.skills.fighting = base + 2 + 3;
    sheet.actor.system.modifiers.rolls.skills = {fighting: -2};
    sheet.actor.system.skillTree = [
      {name: "Combat", value: 8, kind: "skill"},
      {name: "Combat armé", value: 2, kind: "discipline"},
      {name: "Armes légères à une main", value: 3, kind: "specialty"}
    ];
    dialogs.length = 0;
    for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
    for (const [index, target] of [13, 15, 21].entries()) {
      assert.match(dialogs[index].content, new RegExp(`Cible de base: ${target}\\b`));
      assert.match(dialogs[index].content, new RegExp(`data-final-target>${target - 2}<`));
    }
    assert.equal(sheet.actor.system.skills.fighting.value, base, "rolling never rewrites the actor's base skill");
  }
});

test("unmatched book skill names still use their own parent values", async t => {
  const previous = {document: globalThis.document, dialog: foundry.applications.api.DialogV2};
  t.after(() => { globalThis.document = previous.document; foundry.applications.api.DialogV2 = previous.dialog; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  const dialogs = [];
  foundry.applications.api.DialogV2 = class {static async wait(options) { dialogs.push(options); return null; }};
  const sheet = new TrudvangNpcSheet(); sheet.actor = actor([feat()]);
  sheet.actor.system.skillTree = [
    {name: "Compétence personnalisée", value: 7, kind: "skill"},
    {name: "Discipline personnalisée", value: 2, kind: "discipline"},
    {name: "Spécialité personnalisée", value: 1, kind: "specialty"}
  ];
  for (const index of [0, 1, 2]) await sheet._rollNpcBookSkill(index);
  for (const [index, target] of [7, 9, 11].entries()) assert.match(dialogs[index].content, new RegExp(`Cible de base: ${target}\\b`));
});

test("negative health and death remain visible with a bounded gauge", async () => {
  const npc = actor([feat()]);
  npc.system.resources.body.value = -12;
  npc.system.survivalRounds = 0;
  npc.prepareDerivedData();
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc;
  const context = await sheet._prepareContext({});
  assert.equal(context.healthStatus.percent, 0);
  assert.equal(context.healthStatus.meterValue, 0);
  assert.match(render(context), /-12 \/ 40/);
  assert.match(render(context), /fa-skull-crossbones/);
});

function mockActionRuntime(t, {die = 7} = {}) {
  const previous = {combat: game.combat, document: globalThis.document, Roll: globalThis.Roll,
    ChatMessage: globalThis.ChatMessage, dialog: foundry.applications.api.DialogV2, ui: globalThis.ui,
    randomID: foundry.utils.randomID};
  t.after(() => { game.combat = previous.combat; globalThis.document = previous.document; globalThis.Roll = previous.Roll;
    globalThis.ChatMessage = previous.ChatMessage; foundry.applications.api.DialogV2 = previous.dialog;
    globalThis.ui = previous.ui; foundry.utils.randomID = previous.randomID; });
  globalThis.document = {createElement: () => ({set textContent(value) { this.value = value; }, get innerHTML() { return this.value; }})};
  globalThis.Roll = class { constructor(formula) { this.formula = formula; } async evaluate() { this.total = die; } };
  const messages = [], dialogs = [], warnings = [];
  globalThis.ChatMessage = {getSpeaker: ({actor}) => ({actor: actor.id}), create: async data => { messages.push(data); return data; }};
  globalThis.ui = {notifications: {warn: message => { warnings.push(message); return "notification"; }, info() {}}};
  foundry.utils.randomID = () => `casting-${messages.length}`;
  const runtime = {messages, dialogs, warnings, response: null};
  foundry.applications.api.DialogV2 = class { static async wait(options) { dialogs.push(options); return runtime.response; } };
  return runtime;
}

test("tracking training bonus precedes the situation field and contributes once to live VC and chat detail", async t => {
  const runtime = mockActionRuntime(t);
  const instance = actor([]);
  instance.getAbilityBreakdown = () => ({base: 10, skillLabel: "Nature", modifierRows: [{label: "Existing effect", value: -2}]});
  const ability = {type: "ability", name: "Pister", system: {catalogId: "tracker", kind: "specialty", parentSkill: "wilderness"}};
  const bonus = {value: "4", addEventListener() {}}, manual = {value: "-1", addEventListener() {}}, output = {textContent: ""};
  const form = {querySelector: selector => selector.includes("mount-training") ? bonus : selector === "[name=modifier]" ? manual : selector === "[data-final-target]" ? output : null};
  let content;
  foundry.applications.api.DialogV2 = class {
    _onRender() {}
    static async wait(options) {
      content = options.content;
      const dialog = new this(); dialog.element = form; dialog._onRender({}, {});
      return options.buttons[0].callback({}, {form}, dialog);
    }
  };
  renderedCards.length = 0;
  const result = await instance.rollAbility(ability);
  assert.equal(result.target, 11); assert.equal(Number(output.textContent), 11);
  assert.ok(content.indexOf('name="mount-training"') < content.indexOf('name="modifier"'));
  assert.match(content, /name="mount-training"[^>]*value="0"/);
  assert.ok(renderedCards.at(-1).data.flavor.includes("+4"));
  assert.equal(runtime.messages.length, 1); assert.equal(runtime.messages[0].rolls[0].formula, "1d20");
});

test("training action buttons preserve Dressage and jumping uses the actor's real Riding specialty", async t => {
  mockActionRuntime(t);
  const {knowledgeProcedureDescription} = await import("../modules/knowledge-procedures.mjs");
  const {performTrainedAnimalAction} = await import("../modules/trained-animal-actions.mjs");
  const riding = {type: "ability", name: "Équitation", system: {catalogId: "riding", kind: "specialty"}};
  const animalFriend = {type: "ability", system: {catalogId: "animalFriend", kind: "specialty"}};
  assert.match(knowledgeProcedureDescription("<p>Text</p>", riding), /data-training-action="jump"/);
  const buttons = knowledgeProcedureDescription("", animalFriend);
  assert.match(buttons, /data-action="knowledge-procedure"/);
  assert.match(buttons, /data-training-action="fetch"/); assert.match(buttons, /data-training-action="guard"/);
  const instance = actor([]); instance.isOwner = true;
  const learned = {...riding, system: {...riding.system, level: 4}};
  instance.findRuleKnowledge = () => learned;
  instance.rollAbility = async (item, options) => {assert.equal(item, learned); assert.equal(options.mountTraining, true); return "jump";};
  assert.equal(await performTrainedAnimalAction({...riding, actor: instance}, "jump"), "jump");
});

test("fetch and guard roll the trained animal's VC with the situation modifier, not the handler's skills or penalties", async t => {
  const {performTrainedAnimalAction} = await import("../modules/trained-animal-actions.mjs");
  const runtime = mockActionRuntime(t);
  const instance = actor([]); instance.isOwner = true;
  instance.system.modifiers.rolls.allActions = -10;
  const ability = {type: "ability", name: "Ami des animaux", actor: instance, system: {catalogId: "animalFriend", kind: "specialty", level: 5}};
  runtime.response = {degree: 3, modifier: -2};
  assert.equal((await performTrainedAnimalAction(ability, "fetch")).target, 7);
  runtime.response = {degree: 5, modifier: 2};
  assert.equal((await performTrainedAnimalAction(ability, "guard")).target, 20);
  assert.equal(runtime.messages.length, 2); assert.equal(runtime.messages[0].rolls[0].formula, "1d20");
  runtime.response = false;
  assert.equal(await performTrainedAnimalAction(ability, "guard"), null);
  assert.equal(runtime.messages.length, 2, "cancel must produce neither dice nor chat messages");
});

for (const Sheet of [TrudvangCharacterSheet, TrudvangNpcSheet]) {
  test(`${Sheet.name}: combat weapon/natural damage icons wait for confirmation without spending PC or AA`, async t => {
    const runtime = mockActionRuntime(t, {die: 4});
    const item = inventoryItem("weapon", "Test axe", {damage: "1d10", damageBonus: 0, openRoll: 0, strengthApplies: true});
    item.id = "axe";
    const wearer = actor([item]); wearer.items.get = id => id === item.id ? item : null;
    wearer.update = async () => assert.fail("confirming damage must not spend PC or AA");
    const sheet = new Sheet(); sheet.actor = wearer;
    const resources = JSON.stringify(wearer.system);
    const target = {dataset: {action: "item-damage"}, closest: selector => selector === "[data-item-id]" ? {dataset: {itemId: item.id}} : null};
    const event = {preventDefault() {}, stopPropagation() {}};
    renderedCards.length = 0;
    assert.equal(await TrudvangActorSheet.DEFAULT_OPTIONS.actions["item-damage"].call(sheet, event, target), null);
    assert.equal(runtime.messages.length, 0);
    assert.equal(renderedCards[0].path, "systems/trudvang-chronicles/templates/app/damage-roll-dialog.hbs");
    runtime.response = {};
    assert.equal(await TrudvangActorSheet.DEFAULT_OPTIONS.actions["item-damage"].call(sheet, event, target), 4);
    target.dataset.action = "natural-damage";
    assert.equal(await TrudvangActorSheet.DEFAULT_OPTIONS.actions["natural-damage"].call(sheet, event, target), 4);
    assert.equal(runtime.messages.length, 2);
    assert.equal(JSON.stringify(wearer.system), resources);
    assert.equal(renderedCards.filter(card => card.path.endsWith("damage-roll-dialog.hbs")).length, 3);
    assert.equal(renderedCards.at(-3).data.parsed.faces, 5);
  });
}

for (const combatSpecialty of ["bowsSlings", "crossbow"]) {
  test(`${combatSpecialty} attack dialogs expose both ranges and target modifiers, unlike parry`, async t => {
    const runtime = mockActionRuntime(t);
    const item = inventoryItem("weapon", "Ranged", {category: "ranged", combatSpecialty, equipped: true,
      range: {short: 50, long: 110}, rangeSelection: "long"});
    const npc = spendableNpc([item]);
    await npc.rollWeaponAction(item, "attack");
    const html = runtime.dialogs.at(-1).content;
    assert.match(html, /data-range-selection-value="short"/);
    assert.match(html, /data-range-selection-value="long" aria-pressed="true"/);
    assert.match(html, /50 m/); assert.match(html, /110 m/);
    assert.match(html, /data-ranged-option="targetInMelee"/); assert.match(html, /data-ranged-option="targetMoving"/);
    assert.doesNotMatch(html, /data-combat-mode-toggle|name="feint"/);
    item.update = async changes => { for (const [key, value] of Object.entries(changes)) set(item, key, value); };
    const withoutRange = npc.getRollModifier({kind: "attack", movement: true}) - Number(npc.system.armorVCPenalty || 0);
    runtime.response = {modifier: 2, allocation: {free: 4}, ranged: {rangeSelection: "long", targetInMelee: true, targetMoving: true}};
    const result = await npc.rollWeaponAction(item, "attack");
    assert.equal(result.target, 4 + 2 + withoutRange - 25);
    assert.equal(renderedCards.at(-1).data.usage, "ranged"); assert.equal(renderedCards.at(-1).data.longRange, true);
    assert.match(renderedCards.at(-1).data.flavor, /longue portée|Portée longue/);
    await npc.rollWeaponAction(item, "parry");
    assert.doesNotMatch(runtime.dialogs.at(-1).content, /data-range-selection-value|data-ranged-option/);
  });
}

test("the improvised throwing penalty is visible only in thrown mode and never subtracted from SV", async t => {
  const runtime = mockActionRuntime(t);
  const item = inventoryItem("weapon", "Sword", {equipped: true, rangeSelection: "short"});
  item.update = async changes => { for (const [key, value] of Object.entries(changes)) set(item, key, value); };
  const npc = spendableNpc([item]);
  runtime.response = {mode: "throwing", modifier: 0, allocation: {free: 4}, ranged: {rangeSelection: "short"}};
  const expected = 4 + npc.getRollModifier({kind: "attack", movement: true}) - Number(npc.system.armorVCPenalty || 0);
  const result = await npc.rollWeaponAction(item, "attack");
  assert.equal(result.target, expected);
  const html = runtime.dialogs[0].content;
  assert.doesNotMatch(html.split('data-combat-mode="melee"')[1].split('data-combat-mode="throwing"')[0], /-5 dégâts/);
  assert.match(html.split('data-combat-mode="throwing"')[1], /Arme non conçue pour le lancer : -5 dégâts/);
  item.system.designedForThrowing = true;
  await npc.rollWeaponAction(item, "attack");
  assert.doesNotMatch(runtime.dialogs.at(-1).content, /-5 dégâts/);
});

test("mounted attack/parry use only the mount bonus and remember it while the status remains", async t => {
  const runtime = mockActionRuntime(t);
  const weapon = inventoryItem("weapon", "Sword", {equipped: true, weaponActions: 4});
  const npc = spendableNpc([weapon, {type: "ability", name: "Riding", system: {catalogId: "riding", level: 3}}]);
  let remembered = {};
  npc.getFlag = () => remembered;
  npc.setFlag = async (_scope, key, value) => {assert.equal(key, "mountedCombat"); remembered = value;};
  runtime.response = {modifier: 0, allocation: {free: 4}};
  const ordinary = await npc.rollWeaponAction(weapon, "attack");
  npc.statuses = new Set(["trudvang-mounted"]);
  runtime.response = {...runtime.response, mountedCombat: {enabled: true, bonus: 3}};
  const mounted = await npc.rollWeaponAction(weapon, "attack");
  assert.equal(mounted.target, ordinary.target + 3, "the upkeep is spent separately, never deducted from VC");
  assert.deepEqual(remembered, {enabled: true, bonus: 3});
  const parry = await npc.rollWeaponAction(weapon, "parry");
  assert.equal(parry.target, mounted.target);
  assert.doesNotMatch(runtime.dialogs.at(-1).content, /data-mounted-combat/);
  assert.match(runtime.dialogs.at(-1).content, /data-mount-bonus value="3"/);
  runtime.response = null;
  await npc.rollWeaponAction(weapon, "attack");
  assert.deepEqual(remembered, {enabled: true, bonus: 3}, "cancel preserves preferences");
  npc.statuses.clear();
  runtime.response = {modifier: 0, allocation: {free: 4}, mountedCombat: {enabled: false, bonus: 3}};
  const dismounted = await npc.rollWeaponAction(weapon, "attack");
  assert.equal(dismounted.target, ordinary.target);
  assert.deepEqual(remembered, {enabled: false, bonus: 2});
});

test("mounted-combat action pays both free hands once per round and works at zero cost for Riding 5", async t => {
  const runtime = mockActionRuntime(t);
  const riding = {type: "ability", name: "Riding", system: {catalogId: "riding", level: 4}};
  const npc = spendableNpc([riding]);
  game.combat = {id: "mounted", round: 1, started: true, combatants: [{actor: npc}]};
  npc.canUserModify = () => true;
  npc.statuses = new Set();
  let applied;
  npc.createTrudvangEffect = async data => {applied = data; npc.statuses.add("trudvang-mounted"); return data;};
  runtime.response = {allocation: {free: 2}};
  assert.equal(await npc.startMountedCombat(), "notification");
  assert.equal(npc.system.combatPools.free.weaponSpent, 4);
  runtime.response = {allocation: {free: 3}};
  const paid = await npc.startMountedCombat();
  assert.equal(paid.cost, 3);
  assert.equal(npc.system.combatPools.free.weaponSpent, 7);
  assert.equal(npc.system.combatPools.free.offHandSpent, 3);
  assert.equal(applied.flags["trudvang-chronicles"].combatRoundExpiry.round, 1);
  assert.equal(await npc.startMountedCombat(), null, "a second click cannot charge upkeep twice");
  npc.statuses.clear(); game.combat.round = 2; riding.system.level = 5;
  runtime.response = {allocation: {}};
  const free = await npc.startMountedCombat();
  assert.equal(free.cost, 0); assert.equal(npc.system.combatPools.free.weaponSpent, 7);
  assert.equal(applied.flags["trudvang-chronicles"].combatRoundExpiry.round, 2);
});

test("the weapon CP bonus applies outside combat even with a stale round marker, and once per round inside combat", async t => {
  const runtime = mockActionRuntime(t);
  const plain = inventoryItem("weapon", "Plain sword", {equipped: true, weaponActions: 4});
  const quality = inventoryItem("weapon", "Quality sword", {equipped: true, weaponActions: 4,
    combatPointBonus: 2, combatPointBonusUsed: true});
  for (const item of [plain, quality]) item.update = async changes => { for (const [key, value] of Object.entries(changes)) set(item, key, value); };
  const npc = spendableNpc([plain, quality]);
  runtime.response = {modifier: 0, allocation: {free: 4}};
  const outside = await npc.rollWeaponAction(quality, "attack");
  assert.match(runtime.dialogs.at(-1).content, /Bonus de PC de l’équipement/);
  assert.match(renderedCards.at(-1).data.flavor, /Bonus de PC de l’équipement/);
  const reference = await npc.rollWeaponAction(plain, "attack");
  assert.equal(outside.target, reference.target + 2);
  assert.equal(quality.system.combatPointBonusUsed, true, "out-of-combat rolls never consume the round marker");

  game.combat = {started: true, combatants: [{actor: npc}]};
  await npc.resetCombatPoints(); // the combat tracker performs this reset when the combatant's turn begins
  runtime.response = {modifier: 0, allocation: {free: 2}};
  const plainInCombat = await npc.rollWeaponAction(plain, "attack");
  const first = await npc.rollWeaponAction(quality, "attack");
  assert.equal(first.target, plainInCombat.target + 2);
  assert.equal(quality.system.combatPointBonusUsed, true);
  runtime.response = {modifier: 0, allocation: {free: 0}};
  const zero = await npc.rollWeaponAction(plain, "attack");
  const second = await npc.rollWeaponAction(quality, "attack");
  assert.equal(second.target, zero.target, "the spent round marker withholds the bonus until the next reset");
  assert.doesNotMatch(runtime.dialogs.at(-1).content, /Bonus de PC/);
});

test("prepared natural attacks preallocate the book CP on both fields and slider, spend and mark only after confirmation", async t => {
  const runtime = mockActionRuntime(t);
  const bite = naturalItem("Bite", "bite", 6);
  bite.update = async changes => { for (const [key, value] of Object.entries(changes)) set(bite, key, value); };
  const npc = spendableNpc([bite]);
  npc.system.attacks = [[{attack: "Bite", itemId: "Bite", value: 7}]];
  game.combat = {id: "combat", round: 1, started: true, combatants: [{actor: npc}]};
  assert.equal(await npc.rollNpcPreparedAction(0, 0), null);
  assert.match(runtime.dialogs[0].content, /data-pool-id="natural:bite"[^>]+value="6"/);
  assert.match(runtime.dialogs[0].content, /data-pool-id="free"[^>]+value="1"/);
  assert.match(runtime.dialogs[0].content, /data-combat-slider[^>]+value="7"/);
  assert.deepEqual(npc.system.usedPreparedActions ?? [], []);
  assert.equal(bite.system.naturalCombatPointsSpent, 0);
  runtime.response = {modifier: 0, feint: 0, allocation: {"natural:bite": 6, free: 1}};
  const result = await npc.rollNpcPreparedAction(0, 0);
  assert.equal(result.target, 4, "prepared CP do not bypass the -3 wound penalty"); assert.equal(runtime.messages.length, 1);
  assert.deepEqual(npc.system.usedPreparedActions, ["0:0"]);
  assert.equal(bite.system.naturalCombatPointsSpent, 6); assert.equal(bite.system.weaponActionsSpent, 1);
  assert.equal(npc.system.combatPools.free.weaponSpent, 5); assert.equal(npc.system.combatPools.free.offHandSpent, 1);
  await npc.resetCombatPoints();
  assert.deepEqual(npc.system.usedPreparedActions, []);
  assert.equal(npc.system.combatCycle.remaining, 1);
  assert.equal(npc.system.combatCycle.generation, 1);
});

test("prepared movement presets the correct mode, charges both hands and does not mark an invalid expenditure", async t => {
  const runtime = mockActionRuntime(t);
  const npc = spendableNpc([]);
  npc.system.details.move = [{mode: "terrestre", distance: "1 m", max: "8 m"}, {mode: "vol", distance: "4 m", max: "32 m"}];
  npc.system.attacks = [[{action: "movement", mode: "flight", value: 4}]];
  game.combat = {id: "combat", round: 1, started: true, combatants: [{actor: npc}]};
  runtime.response = {allocation: {free: 3}, movementMode: "1"};
  await npc.rollNpcPreparedAction(0, 0);
  assert.equal(runtime.messages.length, 0, "invalid movement costs must not produce an announcement");
  assert.deepEqual(npc.system.usedPreparedActions ?? [], []);
  assert.match(runtime.dialogs[0].content, /option value="1" selected/);
  assert.match(runtime.dialogs[0].content, /data-combat-slider[^>]+value="4"/);
  runtime.response = {allocation: {free: 4}, movementMode: "1"};
  const result = await npc.rollNpcPreparedAction(0, 0);
  assert.equal(result.paidMeters, 8);
  assert.match(runtime.messages[0].content, /Vol, 8 m/, "prepared movement uses the same chat announcement as a normal movement action");
  assert.deepEqual(npc.system.usedPreparedActions, ["0:0"]);
  assert.equal(npc.system.combatPools.free.weaponSpent, 8); assert.equal(npc.system.combatPools.free.offHandSpent, 4);
});

test("prepared wrestling uses the prescribed even PC total, and special actions use ordinary combat pools", async t => {
  const runtime = mockActionRuntime(t);
  const npc = spendableNpc([{type: "ability", name: "Unarmed", system: {catalogId: "unarmedFighting", level: 1}},
    {type: "ability", name: "Wrestling", system: {catalogId: "wrestling", level: 2}}]);
  npc.system.attacks = [[{attack: "Lutte", action: "glima", value: 6}], [{attack: "Special", action: "special", value: 2}]];
  game.combat = {started: true, combatants: [{actor: npc}]};
  runtime.response = {allocation: {free: 1, unarmedFighting: 1, wrestling: 4}, modifier: 0};
  const wrestling = await npc.rollNpcPreparedAction(0, 0);
  assert.equal(wrestling.target, 0, "6 CP give 3 VC, reduced by the -3 wound penalty");
  assert.match(runtime.dialogs[0].content, /data-combat-slider[^>]+step="2" value="6"/);
  runtime.response = {allocation: {free: 2}, modifier: 0};
  const special = await npc.rollNpcPreparedAction(1, 0);
  assert.equal(special.target, -1, "special manoeuvres also take wound penalties");
  assert.doesNotMatch(runtime.dialogs[1].content, /data-pool-id="(?:wrestling|unarmedFighting)"/);
  assert.equal(runtime.dialogs[1].buttons[0].label, game.i18n.localize("TRUDVANG.Action.Roll"));
  assert.deepEqual(npc.system.usedPreparedActions, ["0:0", "1:0"]);
});

test("a pending prepared action cannot be double-clicked or mark the following phase", async () => {
  const bite = naturalItem("Bite", "bite", 6);
  const npc = spendableNpc([bite]); npc.system.attacks = [[{attack: "Bite", value: 3}]];
  let release, count = 0;
  npc.rollWeaponAction = async () => { count += 1; return new Promise(resolve => { release = resolve; }); };
  const pending = npc.rollNpcPreparedAction(0, 0);
  assert.equal(await npc.rollNpcPreparedAction(0, 0), null);
  assert.equal(count, 1);
  npc.system.combatCycle = {generation: 1};
  release({roll: {total: 7}}); await pending;
  assert.deepEqual(npc.system.usedPreparedActions ?? [], []);
});

function magicalNpc(name) {
  const source = buildBestiaryPackDocuments({code: "fr", localize: key => game.i18n.localize(key),
    format: (key, data) => game.i18n.format(key, data), isFrench: () => true}).actors.find(actor => actor.name === name);
  const items = source.items.map(item => ({...item, id: item._id, uuid: `Actor.npc.Item.${item._id}`, getFlag: () => null}));
  const npc = spendableNpc(items);
  npc.system.skillTree = source.system.skillTree;
  npc.system.skills = {...npc.system.skills, ...source.system.skills};
  npc.system.effective.skills = Object.fromEntries(Object.entries(npc.system.skills).map(([key, skill]) => [key, skill.value]));
  npc.system.resources = {...npc.system.resources, ...source.system.resources};
  npc.system.details = source.system.details;
  npc._source.system = structuredClone(npc.system);
  npc.prepareDerivedData();
  return npc;
}

test("NPC casting reads book skills, deducts vitner, rolls and tracks each persistent casting independently", async t => {
  const runtime = mockActionRuntime(t);
  const npc = magicalNpc("Démon tangible");
  const spell = {id: "test-spell", type: "spell", name: "Test", system: {cost: 3, modifier: 0, spellType: "lasting", powerLevels: []}};
  npc.items.push(spell);
  runtime.response = {method: {label: "Galda", breakdown: "VC 17"}, target: 17, modifier: 0, cost: 3,
    powerLevelCounts: [], costBreakdown: {entries: []}};
  assert.equal(npc.selectedVitnerType.id, "darkhwitalja");
  assert.equal(npc.system.resources.vitner.max, 95);
  await npc.rollSpell(spell); await npc.rollSpell(spell);
  assert.match(runtime.dialogs[0].content, /value="galding"[^>]*>Galda/);
  assert.equal(runtime.messages.length, 2);
  assert.equal(npc._source.system.resources.vitner.value, 89);
  assert.equal(npc.system.activeSpellCastings.length, 2);
  assert.deepEqual(npc.system.activeSpellCastings.map(record => record.cost), [3, 3]);
  assert.notEqual(npc.system.activeSpellCastings[0].id, npc.system.activeSpellCastings[1].id);
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  const context = await sheet._prepareContext({});
  const html = render(context).split('<div class="tab magic"')[1].split('<div class="tab effects"')[0];
  assert.equal(context.activeSpells.length, 2);
  assert.match(html, /npc-magic-tree/); assert.match(html, /fa-wand-sparkles/);
  assert.doesNotMatch(html, /TRUDVANG\./);
});

test("innate NPC magic requires an explicit casting SV and respects the unlimited-vitner feat", async t => {
  const runtime = mockActionRuntime(t);
  const npc = magicalNpc("Fjoltroll");
  const spell = npc.items.find(item => item.type === "spell" && item.system.spellType !== "lasting");
  assert.equal(npc.unlimitedVitner, true);
  await npc.rollSpell(spell);
  assert.equal(runtime.dialogs.length, 0);
  assert.match(runtime.warnings[0], /VC de magie innée/);
  npc.system.magic = {castingTarget: 14};
  runtime.response = {method: {label: "Magie innée", breakdown: "VC 14"}, target: 14, modifier: 0, cost: 20,
    powerLevelCounts: [], costBreakdown: {entries: []}};
  const result = await npc.rollSpell(spell);
  assert.equal(result.target, 14); assert.equal(runtime.messages.length, 1);
  assert.equal(npc._source.system.resources.vitner.value, 0, "no artificial finite reserve was created or depleted");
  const sheet = new TrudvangNpcSheet(); sheet.actor = npc; sheet.isEditable = true;
  const context = await sheet._prepareContext({});
  assert.equal(context.needsInnateMagic, true);
  const html = render(context).split('<div class="tab magic"')[1].split('<div class="tab effects"')[0];
  assert.match(html, /VC d’incantation innée/); assert.match(html, /Vitner sans limite quotidienne/);
  assert.doesNotMatch(html, /TRUDVANG\./);
});

test("a prepared attack never rolls or spends the stale CP shown by a previously opened dialog", async t => {
  const runtime = mockActionRuntime(t);
  const bite = naturalItem("Bite", "bite", 6);
  bite.update = async changes => { for (const [key, value] of Object.entries(changes)) set(bite, key, value); };
  const npc = spendableNpc([bite]); npc.system.attacks = [[{attack: "Bite", value: 7}]];
  game.combat = {started: true, combatants: [{actor: npc}]};
  foundry.applications.api.DialogV2 = class {static async wait() {
    bite.system.naturalCombatPointsSpent = 4;
    await npc.update({"system.combatPools.free.offHandSpent": 7});
    return {allocation: {"natural:bite": 6, free: 3}, modifier: 0};
  }};
  const result = await npc.rollNpcPreparedAction(0, 0);
  assert.equal(result.target, 0, "only 2 natural CP plus 1 shared free CP remain, then apply -3 wounds");
  assert.equal(runtime.messages.length, 1);
  assert.equal(bite.system.naturalCombatPointsSpent, 6);
  assert.equal(npc.system.combatPools.free.weaponSpent, 5);
  assert.equal(npc.system.combatPools.free.offHandSpent, 8);
});

function woundedAndAfraid(items = [], type = "npc") {
  const instance = spendableNpc(items);
  instance.type = type;
  instance.system.resources.fear.value = 15;
  instance.prepareDerivedData();
  assert.equal(instance.system.damage.penalty, items.some(item => item.system.ignoreWoundPenalties) ? 0 : -3);
  assert.equal(instance.system.fearPenalty, -1);
  return instance;
}

function assertStateBreakdown(runtime, wounds = -3, fear = -1) {
  const content = runtime.dialogs.at(-1).content;
  const flavor = renderedCards.at(-1).data.flavor;
  if (wounds) {
    assert.match(content, new RegExp(`Malus de blessures[^]*?>${wounds}<`));
    assert.match(flavor, new RegExp(`Malus de blessures: ${wounds}`));
  } else {
    assert.doesNotMatch(content, /Malus de blessures/);
    assert.doesNotMatch(flavor, /Malus de blessures/);
  }
  assert.match(content, new RegExp(`Pénalité de peur[^]*?>${fear}<`));
  assert.match(flavor, new RegExp(`Pénalité de peur: ${fear}`));
}

test("state penalties are shared by every test kind, without changing initiative or the CP maxima", () => {
  const instance = woundedAndAfraid();
  instance.system.modifiers.rolls = {allActions: 2, attack: 1, skills: {fighting: 3}, traits: {constitution: 1}};
  for (const kind of ["skill", "ability", "magic", "situation", "trait", "attack", "parry"]) {
    const context = {kind, skillKey: "fighting", traitKey: "constitution"};
    assert.equal(instance.getRollModifier(context) - instance.getRollModifier({...context, includeState: false}), -4);
  }
  assert.equal(instance.system.initiative.current, -1, "3 base -3 wounds -1 fear, counted only once");
  assert.equal(resolveCombatPools({actor: instance}).pools.find(pool => pool.id === "free").max, 8);
  assert.equal(instance.getSkillTarget("fighting"), 9, "8 skill +2 all actions +3 skill effects -4 states");
});

test("Tenace suppresses only wounds, and recovering or calming down removes the corresponding test penalty", () => {
  const durable = woundedAndAfraid([feat()]);
  assert.deepEqual(actorStateRollModifiers(durable), [{labelKey: "TRUDVANG.Resource.FearPenalty", value: -1}]);
  const ordinary = woundedAndAfraid();
  ordinary.system.resources.body.value = 40;
  ordinary.prepareDerivedData();
  assert.equal(ordinary.getRollModifier({kind: "situation"}), -1);
  ordinary.system.resources.fear.value = 0;
  ordinary.prepareDerivedData();
  assert.deepEqual(actorStateRollModifiers(ordinary), []);
  assert.equal(ordinary.getRollModifier({kind: "skill"}), 0);
  ordinary.system.resources.body.value = -12;
  ordinary.system.resources.fear.value = 80;
  ordinary.prepareDerivedData();
  assert.equal(rollModifierTotal(actorStateRollModifiers(ordinary)), -14);
});

for (const type of ["character", "npc"]) {
  test(`${type}: skills, disciplines, specialties, situations and concentration apply and explain both penalties`, async t => {
    const runtime = mockActionRuntime(t);
    const instance = woundedAndAfraid([], type);
    runtime.response = {modifier: 2};
    assert.equal((await instance.rollSkill("fighting")).target, 6);
    assertStateBreakdown(runtime);
    assert.match(runtime.dialogs.at(-1).content, /Cible de base: 8/);
    assert.match(runtime.dialogs.at(-1).content, /data-final-target>4</);
    for (const [kind, level, target] of [["discipline", 2, 8], ["specialty", 3, 14]]) {
      const ability = {name: kind, system: {kind, level, parentSkill: "fighting"}};
      assert.equal((await instance.rollAbility(ability, {disciplineLevel: 2})).target, target);
      assertStateBreakdown(runtime);
    }
    runtime.response = {mode: "situation", situationValue: 10};
    assert.equal((await instance.rollTrait("constitution")).target, 8);
    assertStateBreakdown(runtime);
    runtime.response = {type: "spell", base: 6};
    assert.equal((await instance.rollConcentration()).target, 2);
    assertStateBreakdown(runtime);
    assert.equal(runtime.messages.length, 5);
    assert.ok(runtime.messages.every(message => message.rolls[0].formula === "1d20"));
  });

  test(`${type}: melee, ranged, shield and natural attacks/parries apply states independently of CP spending`, async t => {
    const runtime = mockActionRuntime(t);
    for (const [itemType, specialty, kind, throwing] of [
      ["weapon", "oneHandedLightWeapons", "attack", false], ["weapon", "oneHandedLightWeapons", "parry", false],
      ["weapon", "oneHandedLightWeapons", "attack", true], ["shield", "shieldBearer", "parry", false],
      ["weapon", "bowsSlings", "attack", false], ["weapon", "crossbow", "attack", false],
      ["weapon", "natural", "attack", false], ["weapon", "natural", "parry", false]
    ]) {
      const item = inventoryItem(itemType, "Test", {equipped: true, combatSpecialty: specialty,
        category: specialty === "natural" ? "natural" : "melee", combatPointBonus: 0, range: {short: 20, long: 40}});
      const instance = woundedAndAfraid([item], type);
      runtime.response = {allocation: {free: 4}, modifier: 2, feint: 0};
      const result = await instance.rollWeaponAction(item, kind, {throwing});
      assert.equal(result.target, itemType === "shield" ? -13 : 2,
        `${specialty} ${kind}: 4 CP +2 situational -3 wounds -1 fear, plus the ordinary shield-hand penalty if applicable`);
      assertStateBreakdown(runtime);
    }
  });

  test(`${type}: Tenace still applies fear to actual attacks and skill tests`, async t => {
    const runtime = mockActionRuntime(t);
    const instance = woundedAndAfraid([feat()], type);
    runtime.response = {modifier: 0};
    assert.equal((await instance.rollSkill("fighting")).target, 7);
    assertStateBreakdown(runtime, 0);
    runtime.response = {allocation: {free: 4}, modifier: 0};
    assert.equal((await instance.rollNaturalCombatAction()).target, 3);
    assertStateBreakdown(runtime, 0);
  });

  test(`${type}: spell and divine invocations show states separately and the confirmed target includes them once`, async t => {
    const runtime = mockActionRuntime(t);
    for (const divine of [false, true]) {
      const knowledgeItems = (divine ? ["invoke", "stormkelt"] : ["vitnerShaping", "galding"]).map((id, index) => ({
        type: "ability", name: id, system: {catalogId: id, kind: index ? "specialty" : "discipline", level: index ? 2 : 1}
      }));
      const instance = woundedAndAfraid(knowledgeItems, type);
      const resource = divine ? "divinity" : "vitner";
      instance.system.resources[resource] = {value: 50, current: 50, max: 50};
      instance._source.system.resources[resource] = {value: 50, max: 50};
      const power = {type: divine ? "divineFeat" : "spell", name: "Power", system: {cost: 3, modifier: -2, spellType: "instant"}};
      foundry.applications.api.DialogV2 = class {static async wait(options) {
        runtime.dialogs.push(options);
        const method = options.content.match(/<option value="([^"]+)"/)[1];
        const fields = {"[name=method]": {value: method}, "[name=modifier]": {value: "3"}};
        const form = {querySelector: selector => fields[selector]};
        return options.buttons[0].callback({}, {form}, {element: form});
      }};
      const result = await instance.rollSpell(power);
      assert.equal(result.target, 3, "1 skill +1 discipline +4 specialty -2 power -4 states +3 situational");
      assertStateBreakdown(runtime);
      assert.match(runtime.dialogs.at(-1).content, /data-final-target>0</);
      assert.equal(instance._source.system.resources[resource].value, 47);
    }
  });
}

function sacrificingCaster(t, {vitner = 1, body = 10, divine = false} = {}) {
  const runtime = mockActionRuntime(t);
  const knowledgeItems = (divine ? ["invoke", "stormkelt"] : ["vitnerShaping", "galding"]).map((id, index) => ({
    type: "ability", name: id, system: {catalogId: id, kind: index ? "specialty" : "discipline", level: index ? 2 : 1}
  }));
  const instance = woundedAndAfraid(knowledgeItems);
  const resource = divine ? "divinity" : "vitner";
  instance.system.resources[resource] = {value: vitner, current: vitner, max: 50};
  instance._source.system.resources[resource] = {value: vitner, max: 50};
  instance.system.resources.body = {value: body, current: body, max: 40};
  instance._source.system.resources.body = {value: body, max: 40};
  const queue = [];
  foundry.applications.api.DialogV2 = class { static async wait(options) {
    runtime.dialogs.push(options);
    return queue.length ? queue.shift() : runtime.response;
  }};
  return {runtime, instance, queue};
}

function sacrificeSpellOptions(cost, sacrificeAccepted = true) {
  return {method: {label: "Galda", breakdown: "VC 10"}, target: 10, modifier: 0, cost,
    costBreakdown: {entries: []}, sacrificeAccepted};
}

test("confirming a vitner sacrifice deducts health, covers the cost and rolls the spell", async t => {
  const {runtime, instance, queue} = sacrificingCaster(t);
  const spell = {id: "spell", type: "spell", name: "Power", system: {cost: 6, modifier: 0, spellType: "instant"}};
  queue.push(sacrificeSpellOptions(6), true);
  const result = await instance.rollSpell(spell);
  assert.ok(result, "the spell rolls after confirmation");
  assert.equal(runtime.dialogs.length, 2);
  assert.match(runtime.dialogs[0].content, /data-sacrifice-option/);
  assert.match(runtime.dialogs[1].window.title, /Sacrifier de la santé/);
  assert.match(runtime.dialogs[1].content, /Santé restante : 7 \(Mortellement blessé\)/);
  assert.equal(runtime.messages.length, 1);
  assert.equal(instance._source.system.resources.body.value, 7, "3 health sacrificed from 10");
  assert.equal(instance._source.system.resources.vitner.value, 1, "6 granted minus 6 spent leaves the +1 leftover");
});

test("cancelling a vitner sacrifice spends nothing and rolls nothing", async t => {
  const {runtime, instance, queue} = sacrificingCaster(t);
  const spell = {id: "spell", type: "spell", name: "Power", system: {cost: 6, modifier: 0, spellType: "instant"}};
  queue.push(sacrificeSpellOptions(6), false);
  assert.equal(await instance.rollSpell(spell), null);
  assert.equal(runtime.dialogs.length, 2);
  assert.equal(runtime.messages.length, 0);
  assert.equal(instance._source.system.resources.body.value, 10);
  assert.equal(instance._source.system.resources.vitner.value, 1);
});

test("an infeasible or declined vitner sacrifice keeps the insufficient-vitner block", async t => {
  for (const [vitner, body, cost, accepted] of [[0, 2, 90, true], [1, 10, 6, false]]) {
    const {runtime, instance, queue} = sacrificingCaster(t, {vitner, body});
    const spell = {id: "spell", type: "spell", name: "Power", system: {cost, modifier: 0, spellType: "instant"}};
    queue.push(sacrificeSpellOptions(cost, accepted));
    const blocked = await instance.rollSpell(spell);
    assert.equal(blocked?.target, undefined, "no roll result is produced");
    assert.match(runtime.warnings[0], /réserve/);
    assert.equal(runtime.dialogs.length, cost===90?0:1, "impossible base costs are blocked before opening the casting window");
    assert.equal(runtime.messages.length, 0);
    assert.equal(instance._source.system.resources.body.value, body);
    assert.equal(instance._source.system.resources.vitner.value, vitner);
  }
});

test("divine powers never offer the health-for-vitner sacrifice", async t => {
  const {runtime, instance, queue} = sacrificingCaster(t, {divine: true});
  const power = {id: "power", type: "divineFeat", name: "Power", system: {cost: 6, modifier: 0, spellType: "instant"}};
  queue.push({method: {label: "Bruide", breakdown: "VC 10"}, target: 10, modifier: 0, cost: 6, costBreakdown: {entries: []}});
  const blocked = await instance.rollSpell(power);
  assert.equal(blocked?.target, undefined, "no roll result is produced");
  assert.match(runtime.warnings[0], /réserve/);
  assert.equal(runtime.dialogs.length, 0, "insufficient divinity is blocked before opening the casting window");
  assert.equal(instance._source.system.resources.divinity.value, 1);
});

test("innate NPC casting applies wound/fear penalties only once, and open trait comparisons remain unchanged", async t => {
  const runtime = mockActionRuntime(t);
  const instance = woundedAndAfraid();
  instance.system.magic = {castingTarget: 14};
  instance.system.resources.vitner = {value: 50, current: 50, max: 50};
  instance._source.system.resources.vitner = {value: 50, max: 50};
  const spell = {type: "spell", name: "Innate", system: {cost: 3, modifier: 0, spellType: "instant"}};
  foundry.applications.api.DialogV2 = class {static async wait(options) {
    runtime.dialogs.push(options);
    const form = {querySelector: selector => selector === "[name=method]" ? {value: "innate"} : null};
    return options.buttons[0].callback({}, {form}, {element: form});
  }};
  assert.equal((await instance.rollSpell(spell)).target, 10);
  assertStateBreakdown(runtime);
  foundry.applications.api.DialogV2 = class {static async wait() { return {mode: "open", bonus: 1}; }};
  assert.equal((await instance.rollTrait("constitution")).modifier, 3, "constitution +2, optional bonus +1, no skill/situation states");
});

test("dodge applies both penalties while consuming complete reserves, and special/wrestling actions use the same states", async t => {
  const runtime = mockActionRuntime(t);
  let instance = woundedAndAfraid();
  await instance.update({"system.combatPools.free.weaponSpent": 0, "system.combatPools.free.offHandSpent": 0});
  game.combat = {started: true, combatants: [{actor: instance}]};
  runtime.response = {modifier: 2};
  assert.equal((await instance.rollDodge()).target, -1, "agility 1 -4 states +2 situational");
  assertStateBreakdown(runtime);
  assert.equal(resolveCombatPools({actor: instance}).pools.find(pool => pool.id === "free").current, 0);
  for (const special of [true, false]) {
    instance = woundedAndAfraid();
    game.combat = {started: true, combatants: [{actor: instance}]};
    runtime.response = {allocation: {free: 4}, modifier: 2};
    const result = special ? await instance.spendGenericCombatAction({roll: true}) : await instance.rollWrestlingAction("glima");
    assert.equal(result.target, special ? 2 : 0);
    assertStateBreakdown(runtime);
    assert.equal(instance.system.combatPools.free.weaponSpent, 8);
    assert.equal(instance.system.combatPools.free.offHandSpent, 4);
  }
});

for (const [Sheet, type, fields] of [
  [TrudvangCharacterSheet, "character", ["appearance", "history", "notes"]],
  [TrudvangNpcSheet, "npc", ["description", "notes"]]
]) {
  test(`${type}: notes use native form-associated rich-text editors and save for a non-GM owner only`, async t => {
    const previousGM = game.user.isGM;
    game.user.isGM = false; t.after(() => {game.user.isGM = previousGM;});
    const sheet = new Sheet(); sheet.actor = actor(); sheet.actor.type = type;
    if (type === "npc") sheet._npcEditMode = true;
    sheet.actor.uuid = "Actor.notes"; sheet.actor.isOwner = true; sheet.isEditable = true;
    const text = '<p>Texte <strong>formaté</strong> et "guillemets".</p>';
    const values = Object.fromEntries(fields.map(field => [`system.${field}`, text]));
    for (const field of fields) sheet.actor.system[field] = text;
    const updates = [];
    sheet.actor.update = async changes => {
      updates.push(changes);
      for (const [key, value] of Object.entries(changes.system ?? {})) sheet.actor.system[key] = value;
    };
    const template = Handlebars.compile(readFileSync(new URL(`../templates/actor/${type === "character" ? "character" : "npc"}-sheet.hbs`, import.meta.url), "utf8"));
    const renderSheet = context => template(context, {allowedProtoProperties: {dodgeTarget: true}});
    const context = await sheet._prepareContext({});
    const html = renderSheet(context);
    for (const field of fields) {
      assert.match(html, new RegExp(`<prose-mirror name="system\\.${field}" value="&lt;p&gt;`));
      assert.match(html, new RegExp(`name="system\\.${field}"[^>]+data-document-uuid="Actor.notes" toggled>`));
    }
    assert.doesNotMatch(html, /editor-edit|\{\{editor/);
    await TrudvangActorSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {target: {name: "system.notes"}}, {}, {object: values});
    assert.deepEqual(updates[0], {system: Object.fromEntries(fields.map(field => [field, text]))});
    assert.equal(sheet.actor.system.notes, text, "formatted HTML survives saving");
    sheet.isEditable = false;
    const readonly = renderSheet(await sheet._prepareContext({}));
    assert.doesNotMatch(readonly, /<prose-mirror/);
    assert.ok(readonly.includes(text), "observers still see enriched content");
    await TrudvangActorSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {"system.notes": "Blocked"}});
    assert.equal(updates.length, 1);
    sheet.isEditable = true; sheet.actor.isOwner = false;
    assert.doesNotMatch(renderSheet(await sheet._prepareContext({})), /<prose-mirror/);
    await TrudvangActorSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {"system.notes": "Blocked"}});
    assert.equal(updates.length, 1);
  });
}

for (const [type, rune] of [["spell", false], ["divineFeat", false], ["divineFeat", true]]) {
  test(`${type}${rune ? " rune" : ""}: magic sheets are resizable and descriptions use the native editor with ownership checks`, async () => {
    const updates = [];
    const description = '<p>Texte détaillé et <em>formaté</em>.</p>';
    const item = {type, name: "Test power", uuid: "Item.power", isOwner: true, effects: [], getFlag: () => null,
      system: {description, summary: "Résumé", level: 1, spellType: "instant", cost: 3, modifier: 0, isRune: rune,
        powerLevels: [{cost: 2, maxCount: null, effect: "Amélioration"}]}, update: async changes => {updates.push(changes);}};
    const sheet = new TrudvangItemSheet({document: item}); sheet.isEditable = true;
    assert.equal(TrudvangItemSheet.DEFAULT_OPTIONS.window.resizable, true);
    assert.equal(TrudvangItemSheet.DEFAULT_OPTIONS.resizable, undefined, "ApplicationV2 expects window.resizable");
    assert.ok(TrudvangItemSheet.PARTS.main.scrollable.includes(".item-description .editor-content"));
    const template = Handlebars.compile(readFileSync(new URL("../templates/item/item-sheet.hbs", import.meta.url), "utf8"));
    const html = template(await sheet._prepareContext({}));
    assert.match(html, /item-sheet magic-power-sheet/);
    assert.match(html, /prose-mirror name="system.description"[^>]+data-document-uuid="Item.power" toggled/);
    assert.ok(html.includes(description)); assert.match(html, /power-level-table/);
    await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {"system.description": description}});
    assert.deepEqual(updates, [{system: {description}}]);
    item.isOwner = false;
    const readonly = template(await sheet._prepareContext({}));
    assert.doesNotMatch(readonly, /<prose-mirror/); assert.ok(readonly.includes(description));
    await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {"system.description": "Blocked"}});
    item.isOwner = true; sheet.isEditable = false;
    assert.doesNotMatch(template(await sheet._prepareContext({})), /<prose-mirror/);
    await TrudvangItemSheet.DEFAULT_OPTIONS.form.handler.call(sheet, {}, {}, {object: {"system.description": "Blocked"}});
    assert.equal(updates.length, 1, "neither observers nor owners of locked sheets can submit edits");
  });
}

test("every bilingual magic sheet uses the exact thematic icon from actor lists and compendiums", async () => {
  const source = readFileSync(new URL("../templates/item/item-sheet.hbs", import.meta.url), "utf8");
  const renderHeader = Handlebars.compile(source.slice(0, source.indexOf("</header>") + "</header>".length));
  for (const language of ["fr", "en"]) {
    const strings = JSON.parse(readFileSync(new URL(`../lang/${language}.json`, import.meta.url), "utf8"));
    const resolvers = {localize: (key, fallback = "") => get(strings, key) ?? fallback, isFrench: () => language === "fr"};
    for (const tablet of TABLET_CATALOG) for (const power of tablet.powers) {
      const item = {...powerItemData(power, tablet, resolvers), isOwner: false, effects: [], getFlag: () => null};
      const sheet = new TrudvangItemSheet({document: item}); sheet.isEditable = false;
      const context = await sheet._prepareContext({});
      const expected = powerIconClassForId(power.id);
      assert.equal(context.powerIconClass, expected, `${language} ${power.id}`);
      assert.equal(context.powerIconClass, powerIconClassForItem(item), "same resolver as actor lists");
      assert.equal(expected, POWER_COMPENDIUM_ICON_BY_ITEM_ID.get(deterministicId(`power:${power.id}`)), "same icon as the compendium");
      const header = renderHeader(context);
      assert.ok(header.includes(`class="fas ${expected} profile-img power-sheet-icon"`));
      assert.doesNotMatch(header, /<img|data-edit="img"/);
      assert.ok(header.includes(game.i18n.localize(item.system.isRune ? "TRUDVANG.Tablet.ThuulRune" : `TYPES.Item.${item.type}`)));
    }
  }
});

test("all tablet power lists replace ordinal numbers with the corresponding icons without changing order or links", async () => {
  const template = Handlebars.compile(readFileSync(new URL("../templates/item/item-sheet.hbs", import.meta.url), "utf8"));
  for (const tablet of TABLET_CATALOG) {
    const item = {...tabletItemData(tablet), isOwner: true, effects: [], getFlag: () => null};
    const sheet = new TrudvangItemSheet({document: item}); sheet.isEditable = true;
    const context = await sheet._prepareContext({});
    const rows = context.tabletPowerGroups.flatMap(group => group.powers);
    assert.deepEqual(rows.map(row => row.catalogId), tablet.powers.map(power => power.id));
    const html = template(context).split('data-tab="tablet-powers"><section')[1];
    assert.ok(html, `${tablet.id} has its list`);
    assert.match(html, /<ul class="tablet-power-list">/);
    assert.doesNotMatch(html, /<ol|<img/);
    assert.equal((html.match(/tablet-power-icon/g) || []).length, tablet.powers.length);
    for (const row of rows) {
      assert.equal(row.iconClass, powerIconClassForId(row.catalogId));
      assert.ok(html.includes(`class="fas ${row.iconClass} tablet-power-icon"`));
      assert.ok(html.includes(`data-action="tablet-power-open" data-catalog-id="${row.catalogId}"`));
    }
    assert.equal(context.powerIconClass, null, "tablets keep their own image");
    assert.match(template(context).split("</header>")[0], /<img class="profile-img"/);
  }
});

test("custom magic items have thematic fallback icons, while ordinary item portraits remain untouched", async () => {
  const template = Handlebars.compile(readFileSync(new URL("../templates/item/item-sheet.hbs", import.meta.url), "utf8"));
  for (const [type, name, isRune, icon] of [
    ["spell", "Feu expérimental", false, "fa-fire-flame-curved"],
    ["divineFeat", "Pouvoir personnel", false, "fa-hands-praying"],
    ["divineFeat", "Rune personnelle", true, "fa-gem"],
    ["gear", "Objet personnel", false, null]
  ]) {
    const item = {type, name, img: "custom.webp", isOwner: true, effects: [], getFlag: () => null, system: {isRune}};
    const sheet = new TrudvangItemSheet({document: item}); sheet.isEditable = true;
    const context = await sheet._prepareContext({});
    assert.equal(context.powerIconClass, icon);
    const header = template(context).split("</header>")[0];
    if (icon) assert.ok(header.includes(`class="fas ${icon} profile-img power-sheet-icon"`));
    else assert.match(header, /<img class="profile-img" src="custom.webp" data-edit="img">/);
  }
});

for (const type of ["character", "npc"]) {
  test(`${type}: real skill dialog confirmation applies fear, wounds and the configured -5 once`, async t => {
    mockActionRuntime(t);
    const instance = woundedAndAfraid([], type);
    instance.system.effective.skills.fighting = 4;
    instance.system.damage.penalty = 0;
    instance.system.fearPenalty = -3;
    const ability = {name: "Discipline", system: {kind: "discipline", level: 1, parentSkill: "fighting"}};
    let displayed, content;
    const manual = {value: "0", addEventListener() {}};
    const output = {textContent: ""};
    const form = {querySelector: selector => selector === "[name=modifier]" ? manual : selector === "[data-final-target]" ? output : null};
    foundry.applications.api.DialogV2 = class {
      _onRender() {}
      static async wait(options) {
        const dialog = new this(); dialog.element = form; dialog._onRender({}, {});
        displayed = Number(output.textContent); content = options.content;
        return options.buttons[0].callback({}, {form}, dialog);
      }
    };
    assert.equal((await instance.rollAbility(ability)).target, 2);
    assert.equal(displayed, 2);
    assert.match(content, /Cible de base: 5/);
    assert.match(content, /Pénalité de peur<[^]*?-3/);
    assert.equal((await instance.rollAbility(ability, {bonus: -5})).target, -3);
    assert.equal(displayed, -3);
    assert.match(content, /Cible de base: 5/);
    assert.match(content, /Modificateur du test<[^]*?-5/);
    instance.system.damage.penalty = -3;
    manual.value = "2";
    assert.equal((await instance.rollAbility(ability, {bonus: -5})).target, -4);
    assert.equal(displayed, -4);
    assert.equal((await instance.rollSkill("fighting", {bonus: -5})).target, -5);
    assert.equal(displayed, -5);
    assert.equal(instance.getAbilityBreakdown(ability).base, 5);
    assert.equal(instance.getAbilityBreakdown(ability).total, -1);
  });
}

test("a -5 test from the prepared JSON catalogue reaches the real dialog and die unchanged", async t => {
  const runtime = mockActionRuntime(t);
  const previous = globalThis.CONFIG; globalThis.CONFIG = {TRUDVANG};
  t.after(() => {globalThis.CONFIG = previous;});
  const {RULE_TESTS_BY_CATALOG_ID} = await import("../modules/rule-test-data.mjs");
  const {performRuleTest} = await import("../modules/rule-tests.mjs");
  const [catalogId, tests] = Object.entries(RULE_TESTS_BY_CATALOG_ID).find(([, tests]) => tests.some(test => test.kind === "skill" && test.sv === -5));
  const index = tests.findIndex(test => test.kind === "skill" && test.sv === -5);
  const instance = woundedAndAfraid([], "character");
  const skill = instance.getCatalogEntry(tests[index].skill).skillKey;
  instance.system.effective.skills[skill] = 10;
  foundry.applications.api.DialogV2 = class {
    static async wait(options) {
      runtime.dialogs.push(options);
      return options.buttons[0].callback({}, {form: {querySelector: selector => selector === "[name=modifier]" ? {value: "0"} : null}}, {});
    }
  };
  const result = await performRuleTest({document: {name: "Source", system: {catalogId}}, index, actor: instance});
  assert.equal(result.target, 1, "10 base -3 wounds -1 fear -5 test");
  assert.match(runtime.dialogs[0].content, /Cible de base: 10/);
  assert.match(runtime.dialogs[0].content, /data-final-target>1</);
  assert.match(runtime.dialogs[0].content, /Modificateur du test<[^]*?-5/);
});


test("native initial effects feed derived protection, movement, reserves and NPC book skills exactly once", () => {
  const instance = actor();
  instance.system = structuredClone(instance._source.system);
  instance.system.resources.raud = {value: 0, max: 10};
  instance.system.resources.body.value = 30;
  instance.system.skillTree = [{kind: "skill", name: "Combat", skillId: "fighting", value: 7}];
  instance._source.system.combatPools.free.spent = 2;
  NpcData.prototype.prepareBaseData.call(instance.system);
  const effect = new TrudvangActiveEffect();
  const changes = Object.entries({movement: 3, protection: 2, bodyMax: 2, bodyValue: 1,
    combatMax: 3, combatValue: 1, vitnerMax: 4, vitnerValue: 2, divinityMax: 3, divinityValue: 2,
    raudValue: 1, fearValue: 2, fearFactor: -2, "rolls.initiative": 2})
    .map(([key, value]) => ({key: `system.modifiers.${key}`, type: "add", value: String(value), phase: "final"}));
  changes.push({key: "system.effective.skills.fighting", type: "add", value: "2", phase: "final"});
  Object.assign(effect, {name: "Bénédiction", system: {changes}});
  effect.prepareBaseData();
  instance.allApplicableEffects = () => [effect];
  for (const phase of ["initial", "final"]) {
    for (const change of changes.filter(change => change.phase === phase)) set(instance, change.key, Number(get(instance, change.key) || 0) + Number(change.value));
    if (phase === "initial") instance.prepareDerivedData();
  }
  assert.equal(instance.system.protection, 6);
  assert.equal(instance.system.movement.current, 13);
  assert.equal(instance.getSkillValue("fighting"), 9);
  assert.equal(instance.system.resources.body.max, 42);
  assert.equal(instance.system.resources.body.current, 32, "30/40 scales to ceil(30×42/40), without applying bodyValue twice");
  assert.equal(instance.system.resources.combat.max, 12);
  assert.equal(instance.system.resources.combat.current, 11);
  assert.equal(instance.system.resources.vitner.max, 4);
  assert.equal(instance.system.resources.vitner.current, 2);
  assert.equal(instance.system.resources.divinity.max, 3);
  assert.equal(instance.system.resources.divinity.current, 2);
  assert.equal(instance.system.resources.raud.current, 1);
  assert.equal(instance.system.resources.fear.current, 2);
  assert.equal(instance.system.fearFactorModifier, -2);
  assert.equal(instance.system.initiative.current, 5);
  assert.match(instance.skillValueLabel("fighting"), /Bénédiction \+2/);
  assert.equal(instance._source.system.skills.fighting.value, 8);
});

test("Hasten's generated native changes increase displayed skills, specialties and their VC once on PCs and NPCs",async t=>{
 const {applyTransformation}=await import("../modules/transformations.mjs");
 const before=foundry.applications.api.DialogV2;
 const previousTime=game.time;game.time={worldTime:100};
 t.after(()=>{foundry.applications.api.DialogV2=before;game.time=previousTime;});
 foundry.applications.api.DialogV2={wait:async()=>({duration:"5 tours de jeu"})};
 for(const type of ["character","npc"]){
  const instance=actor();instance.type=type;
  instance.system.effective.traits.dexterity=2;
  instance.system.damage.penalty=0;instance.system.fearPenalty=0;
  instance.canUserModify=()=>true;
  let created;
  instance.createTrudvangEffect=async data=>{created=data;return null;};
  await applyTransformation(instance,"vitner-body-vitner:hasten:9#hate");
  instance.allApplicableEffects=()=>[created];
  for(const change of created.system.changes){
   const current=Number(get(instance,change.key)||0);
   set(instance,change.key,change.type==="add"?current+Number(change.value):Number(change.value));
  }
  assert.equal(instance.getTraitValue("dexterity"),4);
  assert.equal(instance.getSkillValue("agility"),4);
  assert.equal(instance.getSkillValue("fighting"),11);
  assert.equal(instance.getSkillTarget("fighting"),11);
  assert.match(instance.skillValueLabel("fighting"),/Hâte \+3/);
  const breakdown=instance.getAbilityBreakdown({name:"Test",system:{kind:"specialty",parentSkill:"fighting",level:1}});
  assert.equal(breakdown.skill,11);
  assert.equal(breakdown.total,13);
 }
});

test("skill effects remain individually visible without being added twice, including cancelling roll effects", () => {
  const instance = actor();
  instance.system.damage.penalty = 0;
  instance.system.effective.skills.fighting = 10;
  instance.system.modifiers.rolls.allActions = 0;
  instance.allApplicableEffects = () => [
    {name: "Entraînement", system: {changes: [{key: "system.effective.skills.fighting", type: "add", value: "2"}]}},
    {name: "Bénédiction", system: {changes: [{key: "system.modifiers.rolls.allActions", type: "add", value: "3"}]}},
    {name: "Malédiction", system: {changes: [{key: "system.modifiers.rolls.allActions", type: "subtract", value: "3"}]}}
  ];
  const rows = instance.skillRollModifierRows("fighting");
  assert.equal(instance.getSkillTarget("fighting"), 10);
  assert.deepEqual(rows.map(row => [row.label, row.value, Boolean(row.included)]), [
    ["Entraînement", 2, true], ["Bénédiction", 3, false], ["Malédiction", -3, false]
  ]);
});

test("magic dialog separates intrinsic skill from every named effect and keeps the final VC", async () => {
  const instance = actor([...["vitnerShaping", "galding"].map(catalogId => ({type: "ability", name: catalogId,
    system: {kind: catalogId === "vitnerShaping" ? "discipline" : "specialty", catalogId, level: 1}}))]);
  instance.system.skills.vitnerCraft.value = 7;
  instance.system.effective.skills.vitnerCraft = 7;
  instance.system.modifiers.rolls = {magic: 2, allActions: 1};
  instance.system.damage.penalty = 0;
  instance.allApplicableEffects = () => [
    {name: "Faveur du vitner", system: {changes: [{key: "system.modifiers.rolls.magic", type: "add", value: "2"}]}},
    {name: "Inspiration", system: {changes: [{key: "system.modifiers.rolls.allActions", type: "add", value: "1"}]}}
  ];
  const before = foundry.applications.api.DialogV2;
  let content;
  foundry.applications.api.DialogV2 = class {static async wait(config) {content = config.content; return null;}};
  try {
    await instance.rollSpell({type: "spell", name: "Test", system: {level: 1, cost: 0}});
    assert.match(content, /Faveur du vitner/);
    assert.match(content, /Inspiration/);
    assert.match(content, /Compétence 7/);
    assert.match(content, /data-final-target>13</);
  } finally { foundry.applications.api.DialogV2 = before; }
});

test("magic method VCs include discipline and specialty effect bonuses once and name both",async t=>{
 const instance=actor([...["vitnerShaping","galding"].map(catalogId=>({type:"ability",name:catalogId,system:{kind:catalogId==="vitnerShaping"?"discipline":"specialty",catalogId,level:1}}))]);
 instance.system.skills.vitnerCraft.value=7;instance.system.effective.skills.vitnerCraft=7;
 instance.system.damage.penalty=0;instance.system.fearPenalty=0;
 instance.transformationProfile={knowledge:{vitnerShaping:3,galding:2},effects:[{name:"Maîtrise",system:{changes:[{key:"system.transformation.knowledge",type:"override",value:JSON.stringify({vitnerShaping:3})}]}},{name:"Chant",system:{changes:[{key:"system.transformation.knowledge",type:"override",value:JSON.stringify({galding:2})}]}}]};
 const previous=foundry.applications.api.DialogV2;t.after(()=>{foundry.applications.api.DialogV2=previous;});
 let content;foundry.applications.api.DialogV2=class{static async wait(options){content=options.content;return null;}};
 await instance.rollSpell({type:"spell",name:"Test",system:{level:1,cost:2,modifier:0}});
 assert.match(content,/data-final-target>15</);assert.match(content,/Maîtrise \+3/);assert.match(content,/Chant \+2/);
 assert.equal(instance.findRuleKnowledge("vitnerShaping").system.level,1);
});

test("weapon attacks use size-adjusted VC per target with one allocation, one action and one die; parries ignore size", async t => {
  const runtime = mockActionRuntime(t, {die: 7});
  const oldTargets = game.user.targets;
  t.after(() => {game.user.targets = oldTargets;});
  const item = inventoryItem("weapon", "Axe", {equipped: true});
  const npc = spendableNpc([item]);
  npc.system.damage.penalty = 0;
  npc.system.details.size = "1t";
  let spending = 0, actions = 0;
  npc.spendCombatPoints = async allocation => {spending++; assert.deepEqual(allocation, {free: 4});};
  npc.spendWeaponAction = async () => {actions++;};
  npc.getWeaponActionState = () => ({current: 1});
  game.combat = {started: true, combatants: [{actor: npc}]};
  game.user.targets = [
    {name: "Giant", document: {uuid: "Scene.s.Token.g"}, actor: {uuid: "Actor.g", system: {details: {size: "10+"}}}},
    {name: "Tiny", document: {uuid: "Scene.s.Token.t"}, actor: {uuid: "Actor.t", system: {details: {size: "1/3"}}}}
  ];
  runtime.response = {allocation: {free: 4}, feint: 1, modifier: 0};
  const result = await npc.rollWeaponAction(item, "attack");
  assert.deepEqual(result.attackTargets.map(row => [row.target, row.success]), [[7, true], [2, false]]);
  assert.equal(spending, 1); assert.equal(actions, 1);
  assert.equal(runtime.messages.length, 1); assert.equal(runtime.messages[0].rolls.length, 1);
  assert.match(runtime.dialogs[0].content, /combat-size-modifiers/);
  runtime.response = null;
  await npc.rollWeaponAction(item, "parry");
  assert.doesNotMatch(runtime.dialogs.at(-1).content, /combat-size-modifiers/);
});


test("defender transformation penalties appear and apply once to weapon and fixed attacks", async t => {
  const runtime = mockActionRuntime(t, {die: 3});
  const oldTargets = game.user.targets;
  t.after(() => {game.user.targets = oldTargets;});
  const item = inventoryItem("weapon", "Axe", {equipped: true});
  const npc = spendableNpc([item]);
  npc.system.damage.penalty = 0;
  npc.spendCombatPoints = async () => {};
  npc.spendWeaponAction = async () => {};
  npc.getWeaponActionState = () => ({current: 1});
  game.combat = {started: true, combatants: [{actor: npc}]};
  const effect = {name: "Aspect du corbeau", system: {changes: [{key: "system.transformation.defense", type: "override", value: "-5"}]}};
  game.user.targets = [
    {name: "Corbeau", actor: {uuid: "Actor.r", transformationProfile: {size: 1, defense: -5, effects: [effect]}}},
    {name: "Ordinaire", actor: {uuid: "Actor.o", system: {details: {size: 1}}}}
  ];
  runtime.response = {allocation: {free: 4}, feint: 0, modifier: 0};
  const weapon = await npc.rollWeaponAction(item, "attack");
  assert.deepEqual(weapon.attackTargets.map(row => [row.target, row.success]), [[-1, false], [4, true]]);
  assert.match(runtime.dialogs.at(-1).content, /Corbeau · Aspect du corbeau/);
  assert.match(runtime.dialogs.at(-1).content, /data-defense-modifier="-5"/);
  game.user.targets.pop();
  const single = await npc.rollWeaponAction(item, "attack");
  assert.equal(single.target, -1);
  game.user.targets.push({name: "Ordinaire", actor: {uuid: "Actor.o"}});
  runtime.response = {modifier: 0};
  const fixed = await npc.rollFixedAttack({name: "Saisie", target: 6});
  assert.deepEqual(fixed.results.map(row => [row.target, row.success]), [[1, false], [6, true]]);
  assert.match(runtime.dialogs.at(-1).content, /Aspect du corbeau: -5/);
});


test("fractional movement expenditure rounds the multiplied distance to two decimal places", async t=>{
 const runtime=mockActionRuntime(t);
 const npc=spendableNpc([]);
 npc._source.system.combatPools.free.weaponSpent=0;
 npc.prepareDerivedData();
 npc.transformationMovementRows=[{id:"flight",label:"Vol",metersPerTwo:0.1}];
 game.combat={started:true,combatants:[{actor:npc}]};
 runtime.response={allocation:{free:6},movementMode:"flight"};
 const result=await npc.rollCombatMovement();
 assert.equal(result.paidMeters,0.3);
});


test("temporary health is editable on the real actor form and unrelated submissions cannot refill it",async()=>{
 const npc=actor();npc.isOwner=true;
 const reserve={id:"reserve",name:"Rage",system:{changes:[{key:"system.resources.body.temporaryMax",type:"add",value:"5"}]}};
 npc.allApplicableEffects=()=>[reserve];
 npc.updateEmbeddedDocuments=async(type,rows)=>{assert.equal(type,"ActiveEffect");for(const row of rows)for(const [key,value]of Object.entries(row))if(key!=="_id")set(reserve,key,value);};
 const updates=[];npc.update=async changes=>{updates.push(changes);for(const [key,value]of Object.entries(changes))if(key.includes("."))set(npc._source,key,value);};
 const submit=TrudvangActorSheet.DEFAULT_OPTIONS.form.handler,sheet={actor:npc,isEditable:true};
 await submit.call(sheet,{target:{name:"trudvang.temporaryHP"}},{},{object:{"trudvang.temporaryHP":"3"}});
 assert.equal(npc._source.system.resources.body.temporary,3);
 assert.equal(updates.at(-1).trudvang,undefined);
 await submit.call(sheet,{target:{name:"name"}},{},{object:{name:"Test","trudvang.temporaryHP":"5"}});
 assert.equal(npc._source.system.resources.body.temporary,3);
 npc.prepareDerivedData();assert.equal(npc.system.resources.body.temporary,3);
 npc.isOwner=false;
 await submit.call(sheet,{target:{name:"trudvang.temporaryHP"}},{},{object:{"trudvang.temporaryHP":"0"}});
 assert.equal(npc._source.system.resources.body.temporary,3);
});

test("passive protection intercepts at the effective PP threshold without skill criticals or spending resources", async t => {
  const runtime = mockActionRuntime(t);
  const shield = {id: "shield", type: "shield", name: "Bouclier", system: {equipped: true, passiveProtection: 4}};
  const instance = actor([shield]); instance.isOwner = true;
  instance.update = instance.updateEmbeddedDocuments = () => { throw new Error("Passive protection must not spend PC or AA"); };
  for (const [die, pp, expected] of [[4,4,true], [5,4,false], [1,0,false], [20,20,true]]) {
    globalThis.Roll = class {constructor(formula) {this.formula=formula;} async evaluate() {this.total=die;}};
    shield.system.passiveProtection = pp;
    const result = await instance.rollPassiveProtection(shield);
    assert.equal(result.success, expected); assert.equal(result.target, pp);
    const card = renderedCards.at(-1);
    assert.match(card.path, /passive-protection/); assert.equal(card.data.success, expected);
    assert.equal(runtime.messages.at(-1).rolls[0].formula, "1d20");
  }
  assert.equal(runtime.messages.length, 4);
  shield.system.equipped=false; assert.equal(await instance.rollPassiveProtection(shield), null);
  shield.system.equipped=true; instance.isOwner=false; assert.equal(await instance.rollPassiveProtection(shield), null);
  instance.isOwner=true; assert.equal(await instance.rollPassiveProtection({...shield}), null);
  assert.equal(await instance.rollPassiveProtection({type:"weapon",system:{equipped:true}}), null);
  assert.equal(runtime.messages.length, 4);
});

test("PC and NPC combat lists offer shield PP independently of remaining weapon actions", () => {
  assert.equal(typeof TrudvangActorSheet.DEFAULT_OPTIONS.actions["item-passive-protection"], "function");
  for (const file of ["character-sheet", "npc-sheet"]) {
    const source = readFileSync(new URL(`../templates/actor/${file}.hbs`, import.meta.url), "utf8");
    const button = source.match(/<button[^>]*data-action="item-passive-protection"[\s\S]*?<\/button>/)[0];
    assert.match(button, /entry.readied/); assert.doesNotMatch(button, /canUseAction/);
    assert.match(source, /#if entry.isShield/);
  }
});

test("consumable gear uses directly, decrements one unit and deletes an empty stack", async t => {
  const runtime = mockActionRuntime(t);
  const item = {id:"sap", name:"Sève", type:"gear", system:{consumable:true, quantity:2}, toChat:()=>{throw new Error("No intermediate card");}};
  const instance = actor([item]); instance.isOwner=true;
  instance.updateEmbeddedDocuments=async (type,updates)=>{assert.equal(type,"Item");item.system.quantity=updates[0]["system.quantity"];};
  instance.deleteEmbeddedDocuments=async(type,ids)=>{assert.deepEqual(ids,["sap"]);instance.items.splice(0,1);};
  await instance.rollItem(item);
  assert.equal(item.system.quantity,1); assert.equal(runtime.messages.length,1);
  assert.match(runtime.messages[0].content,/Test creature a utilisé Sève/);
  await instance.rollItem(item);
  assert.equal(instance.items.length,0); assert.equal(runtime.messages.length,2);
  assert.equal(await instance.rollItem(item),null); assert.equal(runtime.messages.length,2);
  instance.items.push(item); item.system.quantity=0;
  assert.equal(await instance.rollItem(item),null); instance.isOwner=false;item.system.quantity=2;
  assert.equal(await instance.rollItem(item),null);assert.equal(runtime.messages.length,2);
});

test("extracts consume only after confirmation and ignore repeated clicks during the prompt", async t => {
  const runtime=mockActionRuntime(t);
  globalThis.Roll=class {constructor(formula){this.formula=formula;}async evaluate(){this.total=7;return this;}};
  const item={id:"extract",name:"Extrait",img:"",type:"potion",system:{quantity:2,strength:1,duration:"1 jour",efficacy:{mild:"A",moderate:"B"}}};
  const instance=actor([item]);instance.isOwner=true;
  instance.updateEmbeddedDocuments=async(type,updates)=>{item.system.quantity=updates[0]["system.quantity"];};
  runtime.response=false;
  await instance.rollItem(item);
  assert.equal(item.system.quantity,2); assert.equal(runtime.messages.length,0);
  let finish;
  foundry.applications.api.DialogV2=class {static wait(){return new Promise(resolve=>{finish=resolve;});}};
  const first=instance.rollItem(item);
  assert.equal(await instance.rollItem(item),null);
  finish({traitKey:"constitution",strength:1});await first;
  assert.equal(item.system.quantity,1);assert.equal(runtime.messages.length,1);
  assert.match(renderedCards.at(-1).path,/extract-use-card/);
});

test("daily balm recovery is additional every night even with negative Constitution",async t=>{
 const runtime=mockActionRuntime(t),instance=actor();instance.isOwner=true;
 instance.getTraitValue=key=>key==="constitution"?-2:0;instance.system.modifiers.recovery=2;instance.prepareDerivedData();
 assert.deepEqual(instance.system.healthRecovery,{amount:1,days:2,bonusDaily:2});
 instance.system.resources.body.current=10;instance.system.resources.body.max=40;instance._source.system.rest={healthRecoveryNights:0};instance.calmFear=async()=>null;
 instance.update=async data=>{for(const[k,v]of Object.entries(data)){set(instance,k,v);set(instance._source,k,v);}};
 const result=await instance.restForNight();assert.equal(result.healthRecovered,2);assert.equal(instance._source.system.rest.healthRecoveryNights,1);
});

test("amber recovery follows inventory membership on characters and NPCs without cloning an actor effect",()=>{
 const template=JSON.parse(readFileSync(new URL("../data/starter-content.json",import.meta.url))).items.find(i=>i.nameKey.endsWith("CentennialVidrjotunAmber.Name")).effects[0];
 for(const type of ["character","npc"]){
  const item={type:"gear",system:{equipped:false,quantity:3},effects:[]};
  const effect=new TrudvangActiveEffect();Object.assign(effect,structuredClone(template),{item});item.effects.push(effect);
  const instance=actor([item]);instance.type=type;instance._source.system.details.race="human";
  instance.allApplicableEffects=()=>instance.items.flatMap(i=>i.effects??[]);
  const prepare=()=>{
   instance.system=structuredClone(instance._source.system);(type==="npc"?NpcData:CharacterData).prototype.prepareBaseData.call(instance.system);
   for(const e of instance.allApplicableEffects())if(!e.disabled&&!e.isSuppressed)for(const c of e.system.changes)set(instance,c.key,Number(get(instance,c.key)||0)+Number(c.value));
   instance.prepareDerivedData();return instance.system.healthRecovery;
  };
  assert.equal(prepare().amount,4,type);assert.equal(instance.system.modifiers.recovery,1,"one bonus for the stack, not per quantity");
  instance.items=[];assert.equal(prepare().amount,3,type);
  instance.items=[item];item.system.quantity=0;assert.equal(prepare().amount,3,type);
  item.system.quantity=1;effect.disabled=true;assert.equal(prepare().amount,3,type);
  effect.disabled=false;assert.equal(prepare().amount,4,type);
  assert.equal(instance.effects?.length??0,0,"no persistent copy on the actor");
 }
});
