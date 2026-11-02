import test from "node:test";
import assert from "node:assert/strict";
import {auraCasterToken,auraRadius,auraLightUpdate,reconcileAuraToken,registerAuraSupport} from "../modules/aura.mjs";
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
test("a descriptive weather aura applies its own description to every occupant without changing light",async()=>{
 const wind="holy-ealdtradition-magh-s-gift:journey-wind:0";
 const windSource={...source,system:{changes:[]},flags:{[S]:{transformation:{key:`${wind}#effect`,sourceId:wind,ruleTestContext:{countsById:{[`${wind}:1`]:2}}}}}};
 const previous=foundry.utils.fromUuid;foundry.utils.fromUuid=async()=>windSource;
 try{
  const a=actor("Actor.wind"),t={id:"w",actor:a,disposition:-1};const region={uuid:"Scene.s.Region.wind",flags:{[S]:{aura:{sourceEffectUuid:windSource.uuid,casterUuid:"Actor.c"}}},tokens:new Set([t])};
  assert.equal(auraRadius(windSource),5);await reconcileAuraToken(region,t);
  assert.deepEqual(keys(a),[]);assert.match(a.effects[0].description,/journey-wind:0#effect\.Description/);
  await reconcileAuraToken(region,t,{leaving:true});assert.equal(a.effects.length,0);
 }finally{foundry.utils.fromUuid=previous;}
});
test("the registered native region behavior handles entry, exit and deactivation",()=>{
 const hooks={};globalThis.Hooks={on:(name,fn)=>{hooks[name]=fn;}};globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};
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
 assert.equal(regionData.attachment.token,"c");assert.deepEqual(regionData.restriction,{enabled:true,type:"light"});assert.equal(regionData.shapes[0].radius,500);assert.equal(regionData.behaviors[0].type,"trudvangAura");assert.equal(regionData.highlightMode,"coverage");assert.equal(regionData.visibility,2);assert.equal(token.light.bright,5);assert.equal(token.light.dim,5);
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
