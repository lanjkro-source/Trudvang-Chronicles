import test from "node:test";
import assert from "node:assert/strict";
import {auraCasterToken,auraRadius,auraLightUpdate,auraColor,auraSite,reconcileAuraToken,registerAuraSupport,synchronizeAuraSource} from "../modules/aura.mjs";
import {environmentActorValues} from "../modules/rules/environment.mjs";
const S="trudvang-chronicles",id="holy-tenetnid-tablet-of-the-sun:thermal-light:3";
const deletion=Symbol("delete");
globalThis.game={users:{activeGM:{isSelf:true}},i18n:{localize:key=>key,format:(key,values)=>`${key}: ${values.value??values.name}`}};
globalThis.CONST={TOKEN_DISPOSITIONS:{FRIENDLY:1,HOSTILE:-1},REGION_VISIBILITY:{ALWAYS:2}};
globalThis.foundry={utils:{fromUuid:async()=>source},data:{operators:{ForcedDeletion:{create:()=>deletion}}}};
const source={uuid:"Actor.c.ActiveEffect.a",name:"Lumière",img:"sun",parent:{uuid:"Actor.c"},system:{changes:[{key:"system.modifiers.rolls.allActions",type:"add",value:"2",phase:"initial"},{key:"system.transformation.ignoreFearPenalty",type:"override",value:"true",phase:"initial"}]},flags:{[S]:{transformation:{key:`${id}#effect`,sourceId:id,ruleTestContext:{casterUuid:"Actor.c",casterTokenUuid:"Scene.s.Token.c",countsById:{[`${id}:2`]:3}}}}},toObject:()=>({start:{worldTime:1}})};
function actor(uuid){return {uuid,effects:[],async createEmbeddedDocuments(type,rows){assert.equal(type,"ActiveEffect");const row=structuredClone(rows[0]);row.id=`e${this.effects.length}`;row.update=async changes=>Object.assign(row,structuredClone(changes));this.effects.push(row);return [row];},async deleteEmbeddedDocuments(type,ids){assert.equal(type,"ActiveEffect");this.effects=this.effects.filter(effect=>!ids.includes(effect.id));}};}
function keys(a){return a.effects[0].system.changes.map(change=>change.key);}
test("caster selection is unambiguous and the purchased radius is preserved",()=>{
 const a=actor("Actor.c"),b=actor("Actor.b"),t={uuid:"Token.c",actor:a},u={uuid:"Token.u",actor:a};
 assert.equal(auraCasterToken(a,[{document:t}],[u]),t);assert.equal(auraCasterToken(a,[],[t,u]),null);assert.equal(auraCasterToken(a,[],[{actor:b}]),null);assert.equal(auraRadius(source),5);
});
test('a frost aura excludes its source, creates damage-bearing recipients with frozen levels, and removes them on exit',async t=>{
 const previous={fromUuid:foundry.utils.fromUuid,format:game.i18n.format};
 t.after(()=>{foundry.utils.fromUuid=previous.fromUuid;game.i18n.format=previous.format;});
 const coldId='holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5';
 const cold={...source,flags:{[S]:{transformation:{key:coldId+'#frost',sourceId:coldId,resolved:true,ruleTestContext:{sourceId:coldId,casterUuid:'Actor.c',countsById:{[`${coldId}:4`]:2}}}}}};
 foundry.utils.fromUuid=async()=>cold;
 game.i18n.format=(key,data)=>`${key}: ${JSON.stringify(data)}`;
 const caster=actor('Actor.c'),victim=actor('Actor.v'),a={id:'c',actor:caster},b={id:'v',actor:victim};
 const region={uuid:'Scene.s.Region.cold',flags:{[S]:{aura:{sourceEffectUuid:cold.uuid,casterUuid:caster.uuid}}},tokens:new Set([a,b])};
 await reconcileAuraToken(region,a);assert.equal(caster.effects.length,0);
 await reconcileAuraToken(region,b);assert.equal(victim.effects.length,1);
 const child=victim.effects[0];assert.equal(child.flags[S].transformation.ruleTestContext.countsById[`${coldId}:4`],2);
 assert.match(child.description,/"damage":3/);assert.match(child.description,/"winter":2/);
 await reconcileAuraToken(region,b,{leaving:true});assert.equal(victim.effects.length,0);
});
test("aura colour is a neutral grey derived from the current palette",()=>{
 const previous=globalThis.getComputedStyle;globalThis.getComputedStyle=()=>({getPropertyValue:key=>key==="--trudvang-muted"?"#733b2d":"#f4ecd9"});
 try{assert.match(auraColor(),/^#([0-9a-f]{2})\1\1$/);assert.notEqual(auraColor(),"#733b2d");}finally{globalThis.getComputedStyle=previous;}
});
test("light preserves stronger sources, overlapping radii, and manual changes",()=>{
 let token={light:{bright:1,dim:4},flags:{}};const first=auraLightUpdate(token,[2]);
 assert.equal(first["light.bright"],2);assert.equal(first["light.dim"],undefined);
 token={light:{bright:2,dim:4},flags:{[S]:{auraLight:first[`flags.${S}.auraLight`]}}};
 const second=auraLightUpdate(token,[2,6]);assert.equal(second["light.bright"],6);assert.equal(second["light.dim"],6);
 token={light:{bright:6,dim:6},flags:{[S]:{auraLight:second[`flags.${S}.auraLight`]}}};
 const third=auraLightUpdate(token,[2]);assert.equal(third["light.bright"],2);assert.equal(third["light.dim"],4);
 token={light:{bright:8,dim:4},flags:{[S]:{auraLight:third[`flags.${S}.auraLight`]}}};const end=auraLightUpdate(token,[]);
 assert.equal(end["light.bright"],undefined);assert.equal(end["light.dim"],4);assert.equal(end[`flags.${S}.auraLight`],deletion);
});
test("region entry applies fear relief to all and bonus only to friendly tokens; exits remove it",async()=>{
 const a=actor("Actor.a"),t={id:"t",actor:a,disposition:1};const region={uuid:"Scene.s.Region.r",flags:{[S]:{aura:{sourceEffectUuid:source.uuid,casterUuid:"Actor.c"}}},tokens:new Set([t])};
 await Promise.all([reconcileAuraToken(region,t),reconcileAuraToken(region,t)]);assert.equal(a.effects.length,1);assert.deepEqual(keys(a),["system.modifiers.rolls.allActions","system.transformation.ignoreFearPenalty"]);assert.match(a.effects[0].description,/EffectiveBonus: \+2/);
 t.disposition=-1;await reconcileAuraToken(region,t);assert.deepEqual(keys(a),["system.transformation.ignoreFearPenalty"]);assert.match(a.effects[0].description,/#fear-only\.Description/);
 await reconcileAuraToken(region,t,{leaving:true});assert.equal(a.effects.length,0);
});
test("linked tokens retain an effect until the final token leaves; caster gets an ally effect",async()=>{
 const a=actor("Actor.a"),t={id:"a",actor:a,disposition:0},u={id:"b",actor:a,disposition:1};const region={uuid:"Scene.s.Region.r",flags:{[S]:{aura:{sourceEffectUuid:source.uuid,casterUuid:"Actor.c"}}},tokens:new Set([t,u])};
 await reconcileAuraToken(region,t);assert.equal(a.effects.length,1);assert.equal(keys(a).length,2);
 await reconcileAuraToken(region,t,{leaving:true});assert.equal(a.effects.length,1);
 await reconcileAuraToken(region,u,{leaving:true,force:true});assert.equal(a.effects.length,0);
 const self={id:"c",actor:actor("Actor.c"),disposition:-1};await reconcileAuraToken(region,self);assert.equal(self.actor.effects.length,1);assert.equal(keys(self.actor).length,2);assert.match(self.actor.effects[0].name,/AllyName/);
});
test("Journey Wind gives every occupant its weather protection without changing light",async()=>{
 const wind="holy-ealdtradition-magh-s-gift:journey-wind:0";
 const windSource={...source,system:{changes:[]},flags:{[S]:{transformation:{key:`${wind}#effect`,sourceId:wind,ruleTestContext:{countsById:{[`${wind}:1`]:2}}}}}};
 const previous=foundry.utils.fromUuid;foundry.utils.fromUuid=async()=>windSource;
 try{
  const a=actor("Actor.wind"),t={id:"w",actor:a,disposition:-1};const region={uuid:"Scene.s.Region.wind",flags:{[S]:{aura:{sourceEffectUuid:windSource.uuid,casterUuid:"Actor.c"}}},tokens:new Set([t])};
  assert.equal(auraRadius(windSource),5);await reconcileAuraToken(region,t);
  assert.deepEqual(keys(a),[]);assert.match(a.effects[0].description,/TRUDVANG\.Aura\.WeatherRecipient\.journey/);
  assert.equal(environmentActorValues(a,{wind:"storm",precipitation:"rain"}).modifier,0);
  await reconcileAuraToken(region,t,{leaving:true});assert.equal(a.effects.length,0);
 }finally{foundry.utils.fromUuid=previous;}
});
test("Dawn Shine illuminates its area without granting any occupant fear relief or bonuses",async()=>{
 const id="holy-tenetnid-tablet-of-the-sun:dawn-shine:0";
 const light={...source,system:{changes:[]},flags:{[S]:{transformation:{key:`${id}#effect`,sourceId:id,auraChanges:[],ruleTestContext:{countsById:{[`${id}:2`]:2}}}}}};
 const previous=foundry.utils.fromUuid;foundry.utils.fromUuid=async()=>light;
 try{
  const a=actor("Actor.a"),t={id:"a",actor:a,disposition:1};const region={uuid:"Scene.s.Region.dawn",flags:{[S]:{aura:{sourceEffectUuid:light.uuid,casterUuid:"Actor.c"}}},tokens:new Set([t])};
  assert.equal(auraRadius(light),3);await reconcileAuraToken(region,t);assert.equal(a.effects.length,0);
  const update=auraLightUpdate({light:{bright:0,dim:0},flags:{}},[auraRadius(light)]);assert.equal(update["light.bright"],3);
 }finally{foundry.utils.fromUuid=previous;}
});
test("the registered native region behavior handles entry, exit and deactivation",()=>{
 const hooks={};globalThis.Hooks={once:()=>{},on:(name,fn)=>{hooks[name]=fn;}};globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};
 foundry.data.regionBehaviors={RegionBehaviorType:class{}};registerAuraSupport();
 const type=CONFIG.RegionBehavior.dataModels.trudvangAura;assert.ok(type);assert.equal(typeof type.events.tokenEnter,"function");assert.equal(typeof type.events.tokenExit,"function");assert.equal(typeof type.events.behaviorDeactivated,"function");assert.ok(hooks.deleteActiveEffect);
});

test("a source creates an attached wall-restricted region and restores the caster’s light at expiration",async()=>{
 const {synchronizeAuraSource}=await import("../modules/aura.mjs");
 const a=actor("Actor.c"),child=actor("Actor.other");
 const marker=structuredClone({...source,toObject:undefined});marker.parent=a;marker.toObject=()=>({start:{worldTime:1}});marker.flags[S].transformation.ruleTestContext.auraSource=true;marker.flags[S].transformation.auraChanges=marker.system.changes;marker.system.changes=[];
 a.effects=[marker];let regionData;
 const scene={grid:{size:100,distance:1,units:"m"},tokens:[],regions:[],async createEmbeddedDocuments(type,rows){
  assert.equal(type,"Region");regionData=rows[0];const region={...regionData,uuid:"Scene.s.Region.created",tokens:new Set(),async delete(){scene.regions=[];}};scene.regions.push(region);return [region];
 }};
 const token={id:"c",uuid:"Scene.s.Token.c",actor:a,parent:scene,x:100,y:200,width:1,height:1,level:"level",light:{bright:1,dim:3},flags:{},async update(changes){
  for(const [key,value] of Object.entries(changes))if(key.startsWith("light."))this.light[key.slice(6)]=value;else if(key===`flags.${S}.auraLight`){this.flags[S]??={};if(value===deletion)delete this.flags[S].auraLight;else this.flags[S].auraLight=value;}
 }};
 scene.tokens=[token,{id:"other",actor:child}];foundry.utils.fromUuid=async uuid=>uuid===token.uuid?token:marker;
 await synchronizeAuraSource(marker);
 assert.equal(regionData.attachment.token,"c");assert.deepEqual(regionData.restriction,{enabled:true,type:"light"});assert.equal(regionData.shapes[0].radius,500);assert.equal(regionData.behaviors[0].type,"trudvangAura");assert.equal(regionData.highlightMode,"coverage");assert.equal(regionData.visibility,2);assert.match(regionData.color,/^#([0-9a-f]{2})\1\1$/);assert.equal(token.light.bright,5);assert.equal(token.light.dim,5);
 assert.equal(a.effects.length,2);assert.match(a.effects[1].name,/AllyName/);
 child.effects=[{id:"child",flags:{[S]:{auraRecipient:{regionUuid:scene.regions[0].uuid}}}}];a.effects=[];
 await synchronizeAuraSource(marker,{removed:true});assert.equal(scene.regions.length,0);assert.equal(child.effects.length,0);assert.equal(token.light.bright,1);assert.equal(token.light.dim,3);
});

test("an older active source transfers its changes to a separate caster recipient",async()=>{
 const {synchronizeAuraSource}=await import("../modules/aura.mjs");
 const a=actor("Actor.c"),marker=structuredClone({...source,toObject:undefined});marker.parent=a;marker.toObject=()=>({start:{}});marker.flags[S].transformation.ruleTestContext.auraSource=true;
 marker.update=async data=>{marker.flags[S].transformation.auraChanges=data[`flags.${S}.transformation.auraChanges`];marker.flags[S].transformation.auraStatuses=data[`flags.${S}.transformation.auraStatuses`];marker.system.changes=data["system.changes"];marker.description=data.description;};a.effects=[marker];
 const scene={grid:{size:100,distance:1},tokens:[],regions:[],async createEmbeddedDocuments(type,rows){const region={...rows[0],uuid:"Scene.s.Region.legacy",tokens:new Set()};this.regions.push(region);return [region];}};
 const token={id:"c",uuid:"Scene.s.Token.c",parent:scene,actor:a,width:1,height:1,flags:{},light:{},async update(){}};scene.tokens=[token];
 foundry.utils.fromUuid=async uuid=>uuid===token.uuid?token:marker;
 await synchronizeAuraSource(marker);
 assert.equal(marker.system.changes.length,0);assert.equal(marker.flags[S].transformation.auraChanges.length,2);
 assert.equal(a.effects.length,2);assert.deepEqual(a.effects[1].system.changes.map(change=>change.key),["system.modifiers.rolls.allActions","system.transformation.ignoreFearPenalty"]);
 assert.match(marker.description,/TRUDVANG\.Aura\.Radius/);
});

test("a fixed weather ward keeps its cast site and protects only occupants until expiration",async t=>{
 const saved={scenes:game.scenes,fromUuid:foundry.utils.fromUuid};
 t.after(()=>{game.scenes=saved.scenes;foundry.utils.fromUuid=saved.fromUuid;});
 const refuge="holy-tenetnid-tablet-of-the-shield:sheltering:1";
 const caster=actor("Actor.caster"),guest=actor("Actor.guest");
 const scene={id:"fixed-site",grid:{size:100,distance:1},tokens:[],regions:[],async createEmbeddedDocuments(type,rows){
  assert.equal(type,"Region");
  const region={...rows[0],uuid:"Scene.fixed-site.Region.refuge",tokens:new Set(),async delete(){scene.regions=[];}};
  scene.regions.push(region);return [region];
 }};
 const token={id:"c",uuid:"Scene.fixed-site.Token.c",parent:scene,actor:caster,x:100,y:300,level:"ground",flags:{},light:{},testInsideRegion:()=>false};
 const guestToken={id:"g",actor:guest,testInsideRegion:()=>true};
 scene.tokens=[token,guestToken];
 const ctx={casterUuid:caster.uuid,casterTokenUuid:token.uuid,auraSite:auraSite(token),weatherTemperature:20,countsById:{[`${refuge}:1`]:2}};
 const marker={uuid:"Actor.caster.ActiveEffect.source",name:"Refuge",parent:caster,system:{changes:[]},toObject:()=>({start:{}}),
  flags:{[S]:{transformation:{key:refuge+"#effect",auraChanges:[],ruleTestContext:ctx}}}};
 caster.effects=[marker];
 game.scenes=new Map([[scene.id,scene]]);
 foundry.utils.fromUuid=async uuid=>uuid===marker.uuid ? marker : uuid===token.uuid ? token : null;
 token.x=1200;
 await synchronizeAuraSource(marker);
 const [region]=scene.regions;
 assert.deepEqual(region.shapes,[{type:"circle",x:150,y:350,radius:500}]);
 assert.equal(region.attachment,undefined);
 assert.deepEqual(region.levels,["ground"]);
 assert.equal(caster.effects.length,1);
 assert.deepEqual(guest.effects[0].flags[S].auraRecipient.weather,{kind:"refuge",temperature:20});
 assert.equal(environmentActorValues(guest,{wind:"storm"}).modifier,0);
 await reconcileAuraToken(region,guestToken,{leaving:true});
 assert.equal(environmentActorValues(guest,{wind:"storm"}).modifier,-2);
 await reconcileAuraToken(region,guestToken);
 await synchronizeAuraSource(marker,{removed:true});
 assert.equal(scene.regions.length,0);
 assert.equal(guest.effects.length,0);
});


test('a successful infectious source creates a visible, wall-restricted region and automatically incubates its occupants',async t=>{
 const previous={document:globalThis.document,fromUuid:foundry.utils.fromUuid,documents:foundry.documents,time:game.time,Roll:globalThis.Roll,ChatMessage:globalThis.ChatMessage,canvas:globalThis.canvas};
 t.after(()=>{globalThis.document=previous.document;foundry.utils.fromUuid=previous.fromUuid;foundry.documents=previous.documents;game.time=previous.time;globalThis.Roll=previous.Roll;globalThis.ChatMessage=previous.ChatMessage;globalThis.canvas=previous.canvas;});
 globalThis.document={createElement:()=>({set textContent(value){this.innerHTML=String(value);}})};
 foundry.documents={ActiveEffect:{implementation:{getEffectStart:()=>({time:0})}}};game.time={worldTime:0};
 globalThis.Roll=class{async evaluate(){this.total=2;return this;}};globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>data};
 const {synchronizeAuraSource}=await import('../modules/aura.mjs');
 const {TRANSFORMATION_TEMPLATES}=await import('../modules/transformation-data.mjs');
 function recipient(uuid){const a=actor(uuid);a.isOwner=true;a.documentName='Actor';a.name=uuid;a.createTrudvangEffect=async data=>{const e={...structuredClone(data),id:crypto.randomUUID(),uuid:uuid+'.ActiveEffect.'+crypto.randomUUID(),parent:a};a.effects.push(e);return e;};return a;}
 for(const tail of ['disease-carrier:0','contagious:4','lord-of-the-flies:6']){
  const caster=recipient('Actor.c'),victim=recipient('Actor.v'),id='holy-haminges-power-of-trolls:'+tail,rangeIndex=tail==='disease-carrier:0'?1:2;
  const scene={grid:{size:100,distance:1,units:'m'},regions:[]};let regionData;
  const token={id:'c',uuid:'Scene.s.Token.c',actor:caster,parent:scene,x:0,y:0,width:1,height:1,update:async()=>{}},target={id:'v',actor:victim,parent:scene};scene.tokens=[token,target];
  globalThis.canvas={tokens:{placeables:[{document:token},{document:target}]}};
  // Also exercises sources already placed manually without an explicit token UUID.
  const root={uuid:'Actor.c.ActiveEffect.source',name:'Aura',parent:caster,system:{changes:[]},flags:{[S]:{transformation:{key:id+'#exposure',sourceId:id,auraChanges:TRANSFORMATION_TEMPLATES[id+'#exposure'].changes,auraStatuses:[],ruleTestContext:{sourceId:id,casterUuid:tail==='disease-carrier:0'?'':caster.uuid,countsById:{[`${id}:${rangeIndex}`]:2}}}}},toObject:()=>({start:{time:0}})};caster.effects.push(root);
  foundry.utils.fromUuid=async uuid=>uuid===token.uuid?token:uuid===root.uuid?root:null;
  scene.createEmbeddedDocuments=async(type,rows)=>{assert.equal(type,'Region');regionData=rows[0];const region={...rows[0],uuid:'Scene.s.Region.aura',tokens:new Set([target])};scene.regions.push(region);return [region];};
  await synchronizeAuraSource(root);
  assert.equal(regionData.visibility,CONST.REGION_VISIBILITY.ALWAYS);assert.equal(regionData.highlightMode,'coverage');assert.equal(regionData.restriction.enabled,true);assert.equal(regionData.shapes[0].radius,300);
  assert.equal(victim.effects.filter(e=>e.flags?.[S]?.diseaseIncubation).length,1);assert.equal(caster.effects.filter(e=>e.flags?.[S]?.diseaseIncubation).length,1);
  const ambient=victim.effects.find(e=>e.flags?.[S]?.auraRecipient);
  if(tail==='lord-of-the-flies:6')assert.equal(ambient.system.changes[0].value,'-3');else assert.equal(ambient,undefined);
  await reconcileAuraToken(scene.regions[0],target,{leaving:true});assert.equal(victim.effects.length,1);assert.ok(victim.effects[0].flags[S].diseaseIncubation);
 }
});

test('equipped gear lights linked tokens and falls back to the torch, the aura and then the original light',async t=>{
 const {equippedLightRadii}=await import('../modules/aura.mjs');
 const old={hooks:globalThis.Hooks,scenes:game.scenes,config:globalThis.CONFIG};t.after(()=>{globalThis.Hooks=old.hooks;game.scenes=old.scenes;globalThis.CONFIG=old.config;});
 const callbacks=new Map();globalThis.Hooks={on:(name,fn)=>{const list=callbacks.get(name)??[];list.push(fn);callbacks.set(name,list);},once:()=>{}};
 globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};foundry.data.regionBehaviors={RegionBehaviorType:class{}};registerAuraSupport();
 const carrier={uuid:'Actor.lights',documentName:'Actor',effects:[],items:[]};
 const gear=(bright,dim)=>({type:'gear',parent:carrier,system:{quantity:1,equipped:true,lightBright:bright,lightDim:dim}});
 const torch=gear(3,5),lantern=gear(5,7);carrier.items=[torch,lantern];
 const scene={grid:{units:'m'},tokens:[]};
 const tokenFor=id=>({uuid:'Scene.s.Token.'+id,parent:scene,actor:carrier,light:{bright:1,dim:2},flags:{},async update(changes){
   for(const [key,value] of Object.entries(changes)){
     if(key.startsWith('light.'))this.light[key.slice(6)]=value;
     else if(key===`flags.${S}.auraLight`){this.flags[S]??={};if(value===deletion)delete this.flags[S].auraLight;else this.flags[S].auraLight=value;}
   }
 }});
 scene.tokens=[tokenFor('a'),tokenFor('b')];game.scenes=[scene];
 const refresh=async item=>{for(const callback of callbacks.get('updateItem'))await callback(item);};
 await refresh(lantern);for(const token of scene.tokens)assert.deepEqual(token.light,{bright:5,dim:7});
 const token=scene.tokens[0];
 assert.equal(auraLightUpdate(token,[6],equippedLightRadii(carrier,scene))['light.bright'],6);
 assert.ok(Math.abs(equippedLightRadii(carrier,{grid:{units:'ft'}}).dim-7/0.3048)<1e-6);
 lantern.system.quantity=0;await refresh(lantern);for(const token of scene.tokens)assert.deepEqual(token.light,{bright:3,dim:5});
 torch.system.equipped=false;await refresh(torch);for(const token of scene.tokens)assert.deepEqual(token.light,{bright:1,dim:2});
});
