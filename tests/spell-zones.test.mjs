import Handlebars from 'handlebars';import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {earthquakeProfile,earthquakeTest,spellZoneExpired,spellZonePhase,zonePixelScale} from '../modules/rules/spell-zones.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {darknessCombatRow} from '../modules/rules/jorn-darkness.mjs';
import {targetDefenseRows} from '../modules/rules/attack-size.mjs';
import {quagmireMovement,quagmireTravelBudget} from '../modules/rules/quagmire.mjs';
import {endMaintainedSpellOnGM,recoverMaintainedSpellZones} from '../modules/maintained-spell-tracking.mjs';
const S='trudvang-chronicles',vitner='vitner-soil-craft:earthquake:2',divine='holy-toikalokke-master-of-elements:earthquake:7',rune='holy-thuuldom-earthquake:earthquake:0';
const langs=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync('lang/'+c+'.json','utf8'))]));let language='fr';const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('<','&lt;').replaceAll('>','&gt;')}})};
const docs=new Map(),hooks=new Map();let regionIndex=0,effectIndex=0;
globalThis.Hooks={on:(name,fn)=>{hooks.set(name,fn);},once:(name,fn)=>{hooks.set(name,fn);}};
globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};globalThis.CONST={REGION_VISIBILITY:{ALWAYS:2}};
globalThis.foundry={applications:{handlebars:{renderTemplate:async(path,data)=>Handlebars.compile(fs.readFileSync('templates/chat/'+path.split('/').at(-1),'utf8'))(data)}},data:{regionBehaviors:{RegionBehaviorType:class{}}},utils:{fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime,combat:game.combat?.id,round:game.combat?.round})}}}};
Handlebars.registerHelper('eq',(a,b)=>a===b);
Handlebars.registerHelper('localize',(key,options)=>game.i18n.format(key,options.hash));
const {createSpellZoneOnAuthority,reconcileSpellZone,resolveSpellZoneRequest,registerSpellZoneSupport,requestSpellZoneTest,placeSpellZone,migrateToikalokkeEarthquake,expireInstantSpellZone}=await import('../modules/spell-zones.mjs');
let gm,owner,observer,scene,caster,target,message,regions;
function setup(id=vitner,counts={},runeLevel=1){
 docs.clear();hooks.clear();language='fr';gm={id:'gm',isGM:true,active:true,isSelf:true};owner={id:'owner',active:true};observer={id:'observer',active:true};const users=new Map([gm,owner,observer].map(u=>[u.id,u]));users.activeGM=gm;
 globalThis.game={user:gm,users,actors:new Map(),scenes:new Map(),messages:new Map(),time:{worldTime:0},combat:{id:'combat',round:1,started:true},i18n:{localize:k=>get(langs[language],k)??k,format:(k,d)=>String(get(langs[language],k)??k).replace(/\{(\w+)\}/g,(_,k)=>d[k]??'')}};
 globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.uuid}),create:async data=>{const m={...data,id:'message-'+game.messages.size,author:gm,getFlag:(_s,k)=>m.flags?.[S]?.[k],async update(data){if(data.content!==undefined)m.content=data.content;for(const[k,v]of Object.entries(data))if(k.startsWith('flags.'+S+'.')){m.flags??={};m.flags[S]??={};m.flags[S][k.slice(('flags.'+S+'.').length)]=v;}}};game.messages.set(m.id,m);return m;}};
 const actor=(id,size=1)=>{const a={uuid:'Actor.'+id,name:id,type:'npc',documentName:'Actor',isOwner:true,effects:[],items:[],statuses:new Set(),system:{details:{size},protection:0,resources:{body:{value:20}}},getTraitValue:()=>0,async update(changes){if(changes['system.resources.body.value']!==undefined)a.system.resources.body.value=changes['system.resources.body.value'];},testUserPermission:u=>u.isGM||u.id===owner.id,async createTrudvangEffect(data){const e={...data,id:'effect-'+effectIndex++,uuid:a.uuid+'.ActiveEffect.'+effectIndex,parent:a,documentName:'ActiveEffect',async delete(){a.effects=a.effects.filter(x=>x!==e);docs.delete(e.uuid);}};a.effects.push(e);docs.set(e.uuid,e);return e;},async clone(changes){return {...a,effects:changes.effects};}};docs.set(a.uuid,a);game.actors.set(a.uuid,a);return a;};
 caster=actor('caster');target=actor('target');regions=new Map();scene={id:'scene',grid:{size:100,distance:1,units:'m'},regions,lights:new Map(),tokens:new Map(),async createEmbeddedDocuments(type,data){if(type==='AmbientLight'){const light={...structuredClone(data[0]),id:'light-'+scene.lights.size,parent:scene,async update(data){Object.assign(this,structuredClone(data));},async delete(){assert.equal(scene.lights.get(this.id),this,'Light deleted twice');scene.lights.delete(this.id);}};scene.lights.set(light.id,light);return [light];}assert.equal(type,'Region');const manifest=JSON.parse(fs.readFileSync('system.json','utf8'));for(const behavior of data[0].behaviors)assert.ok(Object.hasOwn(manifest.documentTypes.RegionBehavior,behavior.type),'Region behavior must be declared in the package manifest: '+behavior.type);const r={...data[0],id:'r'+regionIndex++,uuid:'Scene.scene.Region.'+regionIndex,parent:scene,tokens:new Set(scene.tokens.values()),async update(data){for(const[k,v]of Object.entries(data))if(k.startsWith('flags.'+S+'.spellZone.'))r.flags[S].spellZone[k.slice(('flags.'+S+'.spellZone.').length)]=v;else if(k==='shapes')r.shapes=v;},async delete(){assert.equal(regions.get(r.id),r,"region deleted twice");regions.delete(r.id);docs.delete(r.uuid);}};regions.set(r.id,r);docs.set(r.uuid,r);return [r];}};game.scenes.set(scene.id,scene);
 for(const [id,a,x]of [['caster',caster,0],['target',target,100]]){const t={id,uuid:'Scene.scene.Token.'+id,parent:scene,actor:a,x,y:0,width:1,height:1,name:a.name};scene.tokens.set(id,t);docs.set(t.uuid,t);}
 const context={sourceId:id,casterUuid:caster.uuid,countsById:counts,kind:id===rune?'rune':'spell',runeLevel,sourceLevel:POWER_DETAILS_BY_ID[id].level};
 message={id:'cast',author:gm,rolls:[{formula:'1d20',total:5}],flags:{[S]:{ruleTestContext:context,spellZoneCasting:{target:12}}},async update(data){for(const[k,v]of Object.entries(data))if(k==='flags.'+S+'.spellZoneCasting')message.flags[S].spellZoneCasting=v;}};game.messages.set(message.id,message);
 return {messageId:message.id,userId:owner.id,sceneId:scene.id,tokenId:'caster',point:{x:50,y:50}};
}
const jorn='holy-gerbanis-influence-of-jorn:';
const quagmire='vitner-soil-craft:quagmire:3';
test('Quagmire freezes diameter, depth, range and both duration increments',()=>{
 const definition=POWER_DETAILS_BY_ID[quagmire].spellZone;
 const countsById=Object.fromEntries([2,3,1,2,1].map((count,i)=>[quagmire+':'+i,count]));
 assert.deepEqual(earthquakeProfile(definition),{kind:'quagmire',radius:1.5,depth:1,range:10,rounds:12});
 assert.deepEqual(earthquakeProfile(definition,{countsById}),{kind:'quagmire',radius:2.5,depth:4,range:15,rounds:756});
});

test('Quagmire slows grounded occupants; a rope test grants one metre per round until exit',async()=>{
 const payload=setup(quagmire,{[quagmire+':1']:2});
 caster.statuses.add('fly');
 Object.defineProperty(target,'quagmireMovement',{get:()=>quagmireMovement({max:3,metersPerTwo:1},target.effects)});
 assert.equal((await createSpellZoneOnAuthority(payload)).status,'placed');
 const region=[...regions.values()][0];
 assert.equal(region.shapes[0].radius,150);
 assert.deepEqual(caster.effects,[]);
 assert.equal(target.quagmireMovement.land.max,0);
 assert.deepEqual(quagmireMovement({max:6,metersPerTwo:2},target.effects).land,{max:3,metersPerTwo:2});
 const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);
 assert.match(prompt.content,/Tester avec une corde/);
 assert.deepEqual(prompt.whisper,[gm.id,owner.id]);
 const base={type:'spellZoneTest',messageId:prompt.id,userId:owner.id,actorUuid:target.uuid};
 const roll=async (die,id)=>{
  const begin=await resolveSpellZoneRequest({...base,action:'begin'});
  assert.equal(begin.status,'reserved');
  game.messages.set(id,{author:owner,rolls:[{formula:'1d20',total:die}],flags:{[S]:{spellZoneProof:{messageId:prompt.id,actorUuid:target.uuid,token:begin.token,target:12}}}});
  assert.equal((await resolveSpellZoneRequest({...base,action:'finish',token:begin.token,proofId:id})).status,'resolved');
 };
 await roll(20,'failure');
 assert.equal((await resolveSpellZoneRequest({...base,action:'begin'})).status,'alreadyRolled');
 game.combat.round++;
 await reconcileSpellZone(region);
 assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,1);
 target.effects[0].update=async change=>{
  target.effects[0].flags[S].spellZoneRecipient.quagmire.rescued=change['flags.'+S+'.spellZoneRecipient.quagmire.rescued'];
 };
 await roll(1,'success');
 assert.equal(target.quagmireMovement.land.max,1);
 target.flags={[S]:{quagmireTravel:{combatId:game.combat.id,round:game.combat.round,meters:1}}};
 assert.equal(quagmireTravelBudget(target,game.combat).remaining,0);
 assert.equal(quagmireTravelBudget(target,{...game.combat,round:game.combat.round+1}).remaining,1);
 assert.doesNotMatch(prompt.content,/Tester avec une corde/);
 await reconcileSpellZone(region,{leaving:scene.tokens.get('target')});
 assert.equal(target.quagmireMovement,null);
 await reconcileSpellZone(region,{entering:scene.tokens.get('target')});
 assert.equal(target.quagmireMovement.trapped,true);
 assert.match(prompt.content,/Tester avec une corde/);
 game.time.worldTime=60;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
 assert.equal(target.quagmireMovement,null);
 assert.doesNotMatch(prompt.content,/Tester avec une corde/);
});

function maintainedQuagmire(){
 const payload=setup(quagmire);
 const spell={id:'spell',type:'spell',system:{spellType:'lasting',catalogId:quagmire}};
 caster.items=[spell];
 caster.system.activeSpellCastingsMigrated=true;
 caster.system.activeSpellCastings=['cast-a','cast-b'].map(id=>({id,itemId:spell.id,cost:4}));
 caster.canUserModify=user=>[gm.id,owner.id].includes(user.id);
 caster.update=async changes=>{caster.system.activeSpellCastings=changes['system.activeSpellCastings'];};
 message.flags[S].ruleTestContext.castingId='cast-a';
 return payload;
}

test('ending the maintained Quagmire removes its region and occupants, and prevents replay',async()=>{
 const payload=maintainedQuagmire();
 assert.equal((await createSpellZoneOnAuthority(payload)).status,'placed');
 assert.equal(caster.system.activeSpellCastings[0].effectsApplied,true);
 assert.equal(target.effects.length,1);
 assert.equal(await endMaintainedSpellOnGM(caster.uuid,'cast-a',owner.id),true);
 assert.equal(regions.size,0);
 assert.equal(target.effects.length,0);
 assert.deepEqual(caster.system.activeSpellCastings.map(row=>row.id),['cast-b']);
 assert.equal((await createSpellZoneOnAuthority(payload)).reason,'CastingFinished');
});

test('expiry ends only the cast that owns the zone even after every occupant leaves',async()=>{
 const payload=maintainedQuagmire();
 await createSpellZoneOnAuthority(payload);
 const region=[...regions.values()][0];
 region.tokens.clear();
 await reconcileSpellZone(region);
 assert.equal(target.effects.length,0);
 assert.equal(caster.system.activeSpellCastings.length,2);
 game.time.worldTime=60;
 await reconcileSpellZone(region);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(regions.size,0);
 assert.deepEqual(caster.system.activeSpellCastings.map(row=>row.id),['cast-b']);
});

test('startup recovers older placed casts with a missing zone and older zones with a missing cast',async()=>{
 let payload=maintainedQuagmire();
 await createSpellZoneOnAuthority(payload);
 await [...regions.values()][0].delete();
 await recoverMaintainedSpellZones();
 assert.deepEqual(caster.system.activeSpellCastings.map(row=>row.id),['cast-b']);
 payload=maintainedQuagmire();
 await createSpellZoneOnAuthority(payload);
 caster.system.activeSpellCastings.shift();
 await recoverMaintainedSpellZones();
 assert.equal(regions.size,0);
 assert.equal(target.effects.length,0);
});

test('Jorn darkness respects its footprint and duration, and removes penalties on exit or expiry',async()=>{
 const id=jorn+'wall-of-dusk:1';
 const payload=setup(id);
 const rectangle={type:'rectangle',...payload.point,width:100,height:2000,rotation:45};
 assert.equal((await createSpellZoneOnAuthority({...payload,shape:{...rectangle,height:2100}})).status,'invalidArea');
 assert.equal(regions.size,0);
 assert.equal((await createSpellZoneOnAuthority({...payload,shape:rectangle})).status,'placed');
 const region=[...regions.values()][0];
 assert.deepEqual(region.shapes[0],{...rectangle,anchorX:.5,anchorY:.5});
 assert.equal(darknessCombatRow(target).value,-3);
 assert.equal(game.messages.size,1);
 region.tokens.delete(scene.tokens.get('target'));
 await reconcileSpellZone(region,{exclude:new Set([scene.tokens.get('target').uuid])});
 assert.equal(darknessCombatRow(target),null);
 game.combat.round=4;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
 assert.equal(darknessCombatRow(caster),null);
});

test('the strongest darkness uses the combatant’s current vision on either side of the boundary',async()=>{
 const curtain=jorn+'night-curtain:3',coat=jorn+'the-coat-of-jorn:4';
 for(const [id,area,range,longDuration] of [[curtain,50,30,17280],[coat,150,70,720]]){
  const definition=POWER_DETAILS_BY_ID[id].spellZone;
  const countsById={[definition.areaOptionId]:1,[definition.rangeOptionId]:1,[definition.duration[2].id]:1};
  const profile=earthquakeProfile(definition,{countsById});
  assert.deepEqual([profile.area,profile.range,profile.rounds],[area,range,3+longDuration]);
 }
 const payload=setup(curtain);
 await createSpellZoneOnAuthority({...payload,shape:{type:'circle',...payload.point,radius:300}});
 assert.equal(darknessCombatRow(caster).value,-8);
 assert.deepEqual(targetDefenseRows(target,caster),[]);
 caster.effects=[];
 assert.equal(targetDefenseRows(target,caster)[0].value,-8);
 caster.system.senses=[{type:'night'}];
 assert.equal(targetDefenseRows(target,caster)[0].value,-3);
 caster.system.senses=[{type:'dark'}];
 assert.deepEqual(targetDefenseRows(target,caster),[]);
 caster.transformationProfile={sensory:[],effects:[{flags:{[S]:{transformation:{sourceId:'vitner-power-of-vision:true-sight:7'}}}}]};
 assert.deepEqual(targetDefenseRows(target,caster),[]);
});

test('three zone profiles preserve their different centre, radius, duration and size rules',()=>{
 const p=earthquakeProfile(POWER_DETAILS_BY_ID[vitner].spellZone,{countsById:{[vitner+':3']:2,[vitner+':2']:3,[vitner+':1']:1}});assert.equal(p.radius,3);assert.equal(p.rounds,4);assert.equal(earthquakeTest(p,1).modifier,-4);assert.equal(p.collapseChance,40);
 const d=earthquakeProfile(POWER_DETAILS_BY_ID[divine].spellZone,{countsById:{[divine+':0']:1,[divine+':1']:2}});assert.equal(d.radius,4);assert.equal(d.range,15);assert.equal(d.centered,false);assert.equal(d.excludeCaster,false);assert.equal(POWER_DETAILS_BY_ID[divine].level,2);
 for(let level=1;level<=5;level++){const r=earthquakeProfile(POWER_DETAILS_BY_ID[rune].spellZone,{runeLevel:level});assert.equal(r.radius,2*level);assert.equal(r.range,3*(level-1));assert.equal(earthquakeTest(r,1).sv,12-level);assert.equal(earthquakeTest(r,10).immune,true);}
});
test('native region is fixed, cannot be duplicated by replay, and expires before prompting another round',async()=>{
 const payload=setup();const result=await resolveSpellZoneRequest({...payload,type:'createSpellZone'});assert.equal(result.status,'placed');const r=[...regions.values()][0];assert.equal(r.attachment,undefined);assert.equal(r.shapes[0].radius,200);assert.equal(caster.effects.length,1);assert.equal(target.effects[0].system.changes[0].value,'-3');assert.equal((await resolveSpellZoneRequest({...payload,type:'createSpellZone'})).status,'alreadyPlaced');assert.equal(regions.size,1);
 game.combat.round=2;await reconcileSpellZone(r);assert.equal(regions.size,0);assert.equal(caster.effects.length,0);assert.equal(target.effects.length,0);
});
test('leaving removes only the zone penalty and entry does not offer a second test during the same round',async()=>{
 await createSpellZoneOnAuthority(setup());const r=[...regions.values()][0],t=scene.tokens.get('target'),prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);target.effects.push({id:'other',flags:{},system:{}});r.tokens.delete(t);await reconcileSpellZone(r);assert.equal(target.effects.length,1);r.tokens.add(t);await reconcileSpellZone(r);assert.equal(target.effects.length,2);assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,1);assert.equal(prompt.flags[S].spellZoneTest.recipients.filter(x=>x.actorUuid===target.uuid).length,1);
});
test('Toikalokke now shares the spell area and affects its caster; rune giants are immune',async()=>{
 await createSpellZoneOnAuthority(setup(divine));assert.equal(caster.effects.length,1);assert.equal(target.effects.length,1);
 setup(rune,{},3);target.system.details.size=10;await createSpellZoneOnAuthority({messageId:'cast',userId:owner.id,sceneId:'scene',tokenId:'caster',point:{x:50,y:50}});assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,0);
});
test('out of range, failed casting and observers cannot create a zone',async()=>{
 let p=setup();assert.equal((await createSpellZoneOnAuthority({...p,point:{x:5000,y:0}})).status,'outOfRange');assert.equal((await createSpellZoneOnAuthority({...p,userId:observer.id})).status,'unavailable');message.rolls[0].total=20;assert.equal((await createSpellZoneOnAuthority(p)).status,'unavailable');assert.equal(regions.size,0);
});
test('rune response uses a real d20, records one result, and incapacitates through the following round',async()=>{
 const p=setup(rune,{},3);await createSpellZoneOnAuthority(p);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest),base={type:'spellZoneTest',messageId:prompt.id,userId:owner.id,actorUuid:target.uuid};const begin=await resolveSpellZoneRequest({...base,action:'begin'});assert.equal(begin.status,'reserved');assert.equal((await resolveSpellZoneRequest({...base,action:'begin'})).status,'busy');
 game.messages.set('proof',{author:owner,rolls:[{formula:'1d20',total:20}],flags:{[S]:{spellZoneProof:{messageId:prompt.id,actorUuid:target.uuid,token:begin.token,target:99}}}});
 const end={...base,action:'finish',token:begin.token,proofId:'proof'};assert.equal((await resolveSpellZoneRequest(end)).status,'resolved');assert.deepEqual(target.effects[0].statuses,['stun']);assert.equal(target.effects[0].duration.value,2);assert.equal((await resolveSpellZoneRequest(end)).status,'alreadyRolled');assert.equal(target.effects.length,1);assert.match(prompt.content,/Échec auto/);
});
test('cancellation and a forged or stale response never impose consequences',async()=>{
 await createSpellZoneOnAuthority(setup(rune));const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest),base={type:'spellZoneTest',messageId:prompt.id,userId:owner.id,actorUuid:target.uuid};const b=await resolveSpellZoneRequest({...base,action:'begin'});assert.equal((await resolveSpellZoneRequest({...base,action:'finish',token:b.token,proofId:'forged'})).status,'unavailable');await resolveSpellZoneRequest({...base,action:'cancel',token:b.token});assert.equal(target.effects.length,0);game.combat.round=2;assert.equal((await resolveSpellZoneRequest({...base,action:'begin'})).status,'unavailable');
});
test('hooks are registered at init and clocks work with combat rounds and explicit elapsed time',()=>{
 setup();registerSpellZoneSupport();assert.ok(CONFIG.RegionBehavior.dataModels.trudvangSpellZone);const manifest=JSON.parse(fs.readFileSync('system.json','utf8'));for(const type of Object.keys(CONFIG.RegionBehavior.dataModels))assert.ok(Object.hasOwn(manifest.documentTypes.RegionBehavior,type),'Registered behavior missing from manifest: '+type);assert.ok(hooks.has('updateWorldTime'));assert.ok(hooks.has('updateCombat'));
 const info={createdAt:10,until:25,combatId:'c',expiresRound:5};assert.equal(spellZoneExpired(info,{time:20,combat:{id:'c',round:5}}),true);assert.equal(spellZoneExpired(info,{time:25}),true);assert.equal(spellZonePhase(info,{time:20,combat:{id:'c',round:4}}),'round:4');assert.ok(Math.abs(zonePixelScale({grid:{size:100,distance:5,units:'ft'}})-100/5/.3048)<1e-10);
});

test('failed Agility rolls publish and apply fall damage once and only the zone penalty is excluded',async()=>{
 await createSpellZoneOnAuthority(setup(vitner,{[vitner+':3']:2,[vitner+':2']:1}));
 const region=[...regions.values()][0];const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);
 target.effects.push({id:'fatigue',name:'Fatigue',flags:{},system:{changes:[]}});let checks=0;
 target.rollAbility=async function(item,context){checks++;assert.equal(item.system.parentSkill,'agility');assert.equal(item.system.level,0);assert.equal(this,target);assert.equal(context.resistedEffect.flags[S].spellZoneRecipient.regionUuid,region.uuid);const {actorForResistance}=await import('../modules/resistance-actor.mjs');const view=await actorForResistance(this,{effect:context.resistedEffect});assert.equal(view.effects.length,1);assert.equal(view.effects[0].name,'Fatigue');assert.equal(context.modifierRows[0].value,-4);const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:20}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};
 let prone=0;target.toggleStatusEffect=async()=>prone++;
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const result=await requestSpellZoneTest(prompt,target.uuid);assert.equal(result.status,'resolved');assert.equal(target.system.resources.body.value,14,'1d6+2 fall');assert.equal(prone,1);assert.equal(checks,1);assert.equal((await requestSpellZoneTest(prompt,target.uuid)).status,'alreadyRolled');assert.equal(target.system.resources.body.value,14);game.combat.round=2;await reconcileSpellZone(region);assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,2);}
 finally{globalThis.Roll=old;}
});

test('private casting and inaccessible scenes refuse player placement; disabled regions remove their penalty',async()=>{
 let p=setup();message.blind=true;assert.equal((await createSpellZoneOnAuthority(p)).status,'unavailable');message.blind=false;scene.testUserPermission=()=>false;assert.equal((await createSpellZoneOnAuthority(p)).status,'outOfRange');
 p=setup();await createSpellZoneOnAuthority(p);const r=[...regions.values()][0];r.behaviors[0].disabled=true;await reconcileSpellZone(r);assert.equal(target.effects.length,0);assert.equal(caster.effects.length,0);
});
test('flying creatures are excluded and an elapsed world-time duration removes a region without advancing combat',async()=>{
 const p=setup();target.statuses.add('fly');await createSpellZoneOnAuthority(p);assert.equal(target.effects.length,0);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.ok(!prompt.flags[S].spellZoneTest.recipients.some(r=>r.actorUuid===target.uuid));const r=[...regions.values()][0];game.time.worldTime=3600;await reconcileSpellZone(r);assert.equal(regions.size,0);assert.equal(caster.effects.length,0);
});

test('a successful native casting card exposes zone placement instead of unrestricted damage or manual resistance buttons',async()=>{
 setup();const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=5;}};
 try{const {rollUnder}=await import('../modules/dice.mjs');await rollUnder({actor:caster,item:{uuid:'Actor.caster.Item.quake',name:'Tremblement de terre',type:'spell',actor:caster,system:{catalogId:vitner,level:2}},label:'Tremblement de terre',target:12,kind:'spell'});const card=[...game.messages.values()].find(m=>m.id!=='cast');assert.match(card.content,/place-spell-zone/);assert.doesNotMatch(card.content,/data-action="magic-damage"|data-action="roll-rule-test"/);assert.equal(card.flags[S].spellZoneCasting.target,12);}
 finally{globalThis.Roll=old;}
});
test('linked tokens in one zone share one penalty and keep it while another representation remains inside',async()=>{
 const p=setup();const original=scene.tokens.get('target'),copy={...original,id:'copy',uuid:'Scene.scene.Token.copy'};scene.tokens.set(copy.id,copy);await createSpellZoneOnAuthority(p);const region=[...regions.values()][0];const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.equal(prompt.flags[S].spellZoneTest.recipients.filter(r=>r.actorUuid===target.uuid).length,1);assert.equal(target.effects.length,1);region.tokens.delete(original);await reconcileSpellZone(region,{leaving:original});assert.equal(target.effects.length,1);region.tokens.delete(copy);await reconcileSpellZone(region,{leaving:copy});assert.equal(target.effects.length,0);
});

test('native placement previews without creating a player-owned region and cancellation spends no zone',async()=>{
 setup();const oldCanvas=globalThis.canvas,oldApi=foundry.applications.api,oldUi=globalThis.ui;globalThis.ui={notifications:{warn:()=>{}}};const token=scene.tokens.get('caster');caster.getActiveTokens=()=>[token];let previews=0;
 foundry.applications.api={DialogV2:{wait:async()=>({underground:false})}};
 globalThis.canvas={scene,tokens:{controlled:[token]},regions:{placeRegion:async(data,options)=>{previews++;assert.equal(options.create,false);assert.equal(options.attachToToken,false);assert.equal(data.shapes[0].radius,200);assert.equal(options.preConfirm({shape:{x:5000,y:0}}),false);return null;}}};
 try{assert.equal(await placeSpellZone(message),null);assert.equal(regions.size,0);assert.equal(previews,1);canvas.regions.placeRegion=async()=>({shapes:[{x:50,y:50}]});assert.equal((await placeSpellZone(message)).status,'placed');assert.equal(regions.size,1);}
 finally{globalThis.canvas=oldCanvas;foundry.applications.api=oldApi;globalThis.ui=oldUi;}
});

test('Toikalokke and vitner source mechanics are identical after normalizing stable option identifiers',()=>{
 for(const language of ['fr','en']){const entries=JSON.parse(fs.readFileSync('game doc/'+language+'/trudvang-powers-'+language+'.json','utf8')),base=entries.find(e=>e.catalogId===vitner),copy=entries.find(e=>e.catalogId===divine);for(const field of ['level','cost','modifier','duration','range','castingTime','spellZone','damageRoll','skillTest'])assert.deepEqual(JSON.parse(JSON.stringify(copy[field]??null).replaceAll(divine,vitner)),base[field]??null,field);assert.deepEqual(copy.powerLevels.map(p=>[p.cost,p.maxCount]),base.powerLevels.map(p=>[p.cost,p.maxCount]));}
});
test('development migration updates old Toikalokke mechanics once, preserves modified base profiles and includes token inventories',async()=>{
 setup();let writes=0;const item={uuid:'Item.old',type:'divineFeat',system:{catalogId:divine,level:3,cost:6,modifier:-6},async update(changes){writes++;for(const[k,v]of Object.entries(changes))this.system[k.slice(7)]=v;}};const custom={...item,uuid:'Item.custom',system:{...item.system,cost:9}};target.items=[item,custom];game.items=new Map([[item.uuid,item]]);await migrateToikalokkeEarthquake();assert.equal(writes,1);assert.equal(item.system.level,2);assert.equal(item.system.cost,4);assert.equal(item.system.modifier,-4);assert.equal(item.system.powerLevels[3].cost,4);assert.equal(custom.system.cost,9);await migrateToikalokkeEarthquake();assert.equal(writes,1);
});
test('native expiry and zone cleanup share one deletion and ignore a document already removed',async()=>{
 const {deleteEffectOnce}=await import('../modules/effect-deletion.mjs');const effects=new Map();let count=0;const effect={id:'e',parent:{effects},async delete(){count++;effects.delete('e');}};effects.set('e',effect);await Promise.all([deleteEffectOnce(effect),deleteEffectOnce(effect,{trudvangExpired:true})]);assert.equal(count,1);await deleteEffectOnce(effect);assert.equal(count,1);
});

test('a rejected native region creation reports unavailable without an unhandled promise and can be retried',async()=>{
 setup();const oldCanvas=globalThis.canvas,oldApi=foundry.applications.api,oldUi=globalThis.ui,oldError=console.error;const warnings=[];let errors=0;console.error=()=>errors++;globalThis.ui={notifications:{warn:message=>warnings.push(message)}};const token=scene.tokens.get('caster');caster.getActiveTokens=()=>[token];foundry.applications.api={DialogV2:{wait:async()=>({underground:false})}};globalThis.canvas={scene,tokens:{controlled:[token]},regions:{placeRegion:async()=>({shapes:[{x:50,y:50}]})}};const create=scene.createEmbeddedDocuments;
 try{scene.createEmbeddedDocuments=async()=>[];assert.equal((await placeSpellZone(message)).status,'unavailable');assert.equal(errors,1);assert.equal(warnings.length,1);assert.equal(message.flags[S].spellZoneCasting.regionUuid,undefined);scene.createEmbeddedDocuments=create;assert.equal((await placeSpellZone(message)).status,'placed');assert.equal(regions.size,1);}
 finally{globalThis.canvas=oldCanvas;foundry.applications.api=oldApi;globalThis.ui=oldUi;console.error=oldError;}
});

test('simultaneous expiry and late native events never delete the same region twice',async()=>{
 await createSpellZoneOnAuthority(setup(vitner,{[vitner+':2']:2}));const r=[...regions.values()][0];game.combat.round=4;
 await Promise.all([reconcileSpellZone(r),reconcileSpellZone(r),reconcileSpellZone(r,{leaving:scene.tokens.get('target')})]);
 await reconcileSpellZone(r);await reconcileSpellZone(r,{removed:true});assert.equal(regions.size,0);assert.equal(target.effects.length,0);assert.equal(caster.effects.length,0);
});

const burst='vitner-flame-craft:flame-burst:3',sea='vitner-flame-craft:sea-of-fire:7';
const fog='vitner-wind-craft:fog:2';
test('fog grows over three rounds, moves up to 5 m per round and removes its effects on dissipation',async()=>{
 const payload=setup(fog,{[fog+':0']:1,[fog+':2']:1,[fog+':3']:1});
 const request=extra=>resolveSpellZoneRequest({...payload,type:'createSpellZone',...extra});
 assert.equal((await request()).status,'placed');
 const region=[...regions.values()][0];
 assert.ok(Math.abs(region.shapes[0].radius-400/3)<1e-8);
 assert.equal(region.flags[S].spellZone.profile.rounds,120);
 assert.deepEqual(target.effects[0].system.changes.map(row=>[row.key,row.value]),[
  ['system.modifiers.rolls.fogCombat','-4'],['system.modifiers.fogRangeDivisor','4']
 ]);
 assert.equal(game.messages.size,1);
 assert.equal((await request()).reason,'MoveNextRound');
 game.combat.round=2;
 assert.equal((await request({point:{x:551,y:50}})).status,'fogMoveTooFar');
 scene.tokens.get('caster').x=20000;
 assert.equal((await request({point:{x:550,y:50}})).status,'placed');
 assert.equal(region.shapes[0].radius,4*(2/3)*100);
 game.combat.round=3;
 await reconcileSpellZone(region);
 assert.equal(region.shapes[0].radius,400);
 const token=scene.tokens.get('target');
 region.tokens.delete(token);
 await reconcileSpellZone(region,{leaving:token});
 assert.equal(target.effects.length,0);
 assert.equal((await resolveSpellZoneRequest({...payload,type:'endFog',userId:observer.id})).status,'unavailable');
 assert.equal((await resolveSpellZoneRequest({...payload,type:'endFog'})).status,'removed');
 assert.equal(regions.size,0);
 assert.equal(caster.effects.length,0);
});

test('fog reduces both effective ranged limits and preserves the calculation detail',async()=>{
 const {resolveWeaponRange}=await import('../modules/rules/equipment-resolver.mjs');
 const item={system:{range:{short:16,long:43}}};
 const actor={system:{modifiers:{fogRangeDivisor:4}}};
 const range=resolveWeaponRange({item,actor});
 assert.deepEqual([range.short.value,range.long.value],[4,10]);
 assert.equal(range.long.steps.at(-1).explanationKey,'TRUDVANG.Calculation.Equipment.FogRange');
 assert.equal(item.system.range.long,43);
});

test('the fog retains elapsed rounds when combat ends and expires on the world clock',async()=>{
 await createSpellZoneOnAuthority(setup(fog));
 const region=[...regions.values()][0],combat=game.combat;
 combat.round=3;
 game.combat=null;
 registerSpellZoneSupport();
 hooks.get('deleteCombat')(combat);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(region.flags[S].spellZone.combatId,null);
 assert.equal(region.flags[S].spellZone.until,290);
 assert.equal(region.shapes[0].radius,200);
 game.time.worldTime=290;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
 assert.equal(target.effects.length,0);
});
test('fire profiles distinguish diameter/radius, range, duration and frozen open-roll upgrades',async()=>{
 const p=earthquakeProfile(POWER_DETAILS_BY_ID[burst].spellZone,{countsById:{[burst+':0']:2,[burst+':1']:2,[burst+':3']:1}});assert.equal(p.radius,1.5);assert.equal(p.range,20);assert.equal(p.rounds,2);assert.equal(p.movable,true);assert.equal(p.instant,false);
 const q=earthquakeProfile(POWER_DETAILS_BY_ID[sea].spellZone,{countsById:{[sea+':1']:2}});assert.equal(q.radius,4);assert.equal(q.movable,false);assert.equal(q.instant,true);
 const {magicDamageProfile}=await import('../modules/magic-damage.mjs');assert.equal(magicDamageProfile({system:{catalogId:burst}},{sourceId:burst,countsById:{[burst+':2']:3}}).openRoll,8);
});
test('instant fire automatically damages flying creatures once and keeps a temporary visual marker',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.statuses.add('fly');assert.equal((await createSpellZoneOnAuthority(p)).status,'placed');assert.equal(target.system.resources.body.value,16);assert.equal(caster.system.resources.body.value,16);assert.equal(regions.size,1);const cards=[...game.messages.values()].filter(m=>m.flags?.[S]?.persistentDamageEvent);assert.equal(cards.length,2);assert.ok(cards.every(m=>m.flags[S].persistentDamageEvent.startsWith('zone-fire:')));assert.equal((await createSpellZoneOnAuthority(p)).status,'alreadyPlaced');assert.equal(target.system.resources.body.value,16);}
 finally{globalThis.Roll=old;}
});
test('fire can await an Evade decision, records a success and never consumes it twice',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:1}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);assert.equal(regions.size,1);assert.equal(target.system.resources.body.value,20);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.match(prompt.content,/data-zone-choice="evade"/);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(target.system.resources.body.value,20);assert.match(prompt.content,/Flammes évitées/);assert.equal(regions.size,1);}
 finally{globalThis.Roll=old;}
});
test('accepting fire applies damage once; cancellation leaves the decision available',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async()=>null;await createSpellZoneOnAuthority(p);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'cancelled');assert.equal(target.system.resources.body.value,20);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'accept')).status,'resolved');assert.equal(target.system.resources.body.value,16);assert.equal(regions.size,1);}
 finally{globalThis.Roll=old;}
});
test('extended Sea of Fire damages once per round, adds visibility only inside, and expires cleanly',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{await createSpellZoneOnAuthority(setup(sea,{[sea+':3']:1}));const r=[...regions.values()][0];assert.equal(target.system.resources.body.value,16);assert.equal(target.effects.length,1);assert.equal(target.effects[0].system.changes[0].key,'system.modifiers.rolls.visibility');assert.equal(target.effects[0].system.changes[0].type,'downgrade');await reconcileSpellZone(r);assert.equal(target.system.resources.body.value,16);game.combat.round=2;await reconcileSpellZone(r);assert.equal(target.system.resources.body.value,12);r.tokens.delete(scene.tokens.get('target'));await reconcileSpellZone(r);assert.equal(target.effects.length,0);game.combat.round=3;await reconcileSpellZone(r);assert.equal(regions.size,0);assert.equal(caster.effects.length,0);assert.equal(target.system.resources.body.value,12);}
 finally{globalThis.Roll=old;}
});
test('extended Flame Burst can move once in a new round within casting range; Sea cannot',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{let p=setup(burst,{[burst+':3']:2});await createSpellZoneOnAuthority(p);assert.equal((await createSpellZoneOnAuthority(p)).status,'alreadyPlaced');game.combat.round=2;assert.equal((await createSpellZoneOnAuthority({...p,point:{x:5000,y:0}})).status,'outOfRange');assert.equal((await createSpellZoneOnAuthority({...p,point:{x:250,y:50}})).status,'placed');const r=[...regions.values()][0];assert.equal(r.shapes[0].x,250);assert.equal((await createSpellZoneOnAuthority(p)).status,'alreadyPlaced');p=setup(sea,{[sea+':3']:2});await createSpellZoneOnAuthority(p);game.combat.round=2;assert.equal((await createSpellZoneOnAuthority(p)).status,'alreadyPlaced');}
 finally{globalThis.Roll=old;}
});
test('visibility applies once when both attacker and defender are in flames',async()=>{
 const {targetDefenseRows,attackSizeTargets}=await import('../modules/rules/attack-size.mjs');const {resolveFixedAttackTargets}=await import('../modules/rules/fixed-attack.mjs');const a={system:{modifiers:{rolls:{visibility:0}}}},d={name:'Defender',system:{modifiers:{rolls:{visibility:-5}}},effects:[{name:'Mer de flammes',flags:{[S]:{spellZoneRecipient:{visibility:true}}}}]};assert.equal(targetDefenseRows(d,a)[0].value,-5);assert.equal(resolveFixedAttackTargets({attacker:a,baseVC:12,targets:[{actor:d} ]})[0].target,7);a.system.modifiers.rolls.visibility=-5;assert.deepEqual(targetDefenseRows(d,a),[]);assert.equal(attackSizeTargets(a,[{actor:d}])[0].defenseModifier,0);
});

test('fire Evade requires the specialty and unspent resources/actions, with the initiative difference',async()=>{
 const {canEvadeZoneFire,zoneFireInitiativePenalty}=await import('../modules/fire-zones.mjs');const actor={uuid:'Actor.a',type:'character',items:[],system:{skills:{fighting:{value:8}},modifiers:{}},_source:{system:{combatPools:{free:{spent:0,weaponSpent:0,offHandSpent:0}}}},isInActiveCombat:true,findRuleKnowledge:()=>({system:{level:1}})};
 assert.equal(canEvadeZoneFire(actor),true);actor._source.system.combatPools.free.offHandSpent=1;assert.equal(canEvadeZoneFire(actor),false);actor._source.system.combatPools.free.offHandSpent=0;actor.items.push({system:{weaponActionsSpent:1}});assert.equal(canEvadeZoneFire(actor),false);actor.items=[];actor.system.unarmedActionsSpent=1;assert.equal(canEvadeZoneFire(actor),false);actor.system.unarmedActionsSpent=0;actor.findRuleKnowledge=()=>null;assert.equal(canEvadeZoneFire(actor),false);assert.equal(zoneFireInitiativePenalty(actor,{combatants:[{actor,initiative:7}],combatant:{initiative:12}}),-5);
});
test('failed fire Evade uses a proof and applies the frozen improved damage once',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst,{[burst+':2']:4});target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:20}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0];assert.equal(r.flags[S].spellZone.profile.openRoll,8);assert.equal(r.flags[S].spellZone.profile.damageFormula,'1d10 + 1');const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(target.system.resources.body.value,15);assert.equal(regions.size,1);}
 finally{globalThis.Roll=old;}
});

test('a used casting reports why placement is unavailable before starting another preview',async()=>{
 const p=setup(vitner,{[vitner+':3']:1});await createSpellZoneOnAuthority(p);const oldCanvas=globalThis.canvas,oldUi=globalThis.ui;const warnings=[];let previews=0;globalThis.ui={notifications:{warn:message=>warnings.push(message)}};const token=scene.tokens.get('caster');caster.getActiveTokens=()=>[token];globalThis.canvas={scene,tokens:{controlled:[token]},regions:{placeRegion:async()=>{previews++;throw Error('Preview should not start');}}};
 try{assert.equal((await placeSpellZone(message)).reason,'AlreadyPlaced');assert.match(warnings.at(-1),/déjà placée/);game.combat.round=3;await reconcileSpellZone([...regions.values()][0]);assert.equal((await placeSpellZone(message)).reason,'CastingFinished');assert.match(warnings.at(-1),/Relancez le sort/);assert.equal(previews,0);assert.equal(regions.size,0);assert.equal((await createSpellZoneOnAuthority(p)).reason,'CastingFinished');}
 finally{globalThis.canvas=oldCanvas;globalThis.ui=oldUi;}
});
test('an extended fire cast reports the next-round restriction and remains movable next round',async()=>{
 const p=setup(burst,{[burst+':3']:2});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);assert.equal((await createSpellZoneOnAuthority(p)).reason,'MoveNextRound');game.combat.round=2;assert.equal((await createSpellZoneOnAuthority({...p,point:{x:250,y:50}})).status,'placed');
});
test('instant visuals last ten real seconds, then announce their disappearance in chat once',async()=>{
 setup(burst);const oldCanvas=globalThis.canvas,oldUi=globalThis.ui,oldRoll=globalThis.Roll;globalThis.ui={notifications:{warn:message=>assert.fail(message),info:()=>assert.fail('Use chat')}};globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};const token=scene.tokens.get('caster');caster.getActiveTokens=()=>[token];globalThis.canvas={scene,tokens:{controlled:[token]},regions:{placeRegion:async()=>({shapes:[{x:50,y:50}]})}};
 try{const started=Date.now(),result=await placeSpellZone(message);assert.equal(result.status,'placed');assert.equal(result.finished,false);const r=[...regions.values()][0],end=r.flags[S].spellZone.visualExpiresAt;assert.ok(end>=started+10000);assert.equal(await expireInstantSpellZone(r,{now:end-1}),false);assert.equal(regions.size,1);await Promise.all([expireInstantSpellZone(r,{now:end}),expireInstantSpellZone(r,{now:end})]);assert.equal(regions.size,0);const notices=[...game.messages.values()].filter(m=>m.content?.includes('les flammes se dissipent'));assert.equal(notices.length,1);assert.equal(target.system.resources.body.value,16);}
 finally{globalThis.canvas=oldCanvas;globalThis.ui=oldUi;globalThis.Roll=oldRoll;}
});
test('fresh native containment finds victims even when Region.tokens is initially empty',async()=>{
 const p=setup(burst);let checks=0;for(const token of scene.tokens.values())token.testInsideRegion=r=>{checks++;assert.ok(r.shapes[0].radius>0);return token.id==='target';};target.findRuleKnowledge=()=>({system:{level:1}});const create=scene.createEmbeddedDocuments;scene.createEmbeddedDocuments=async(...args)=>{const rows=await create(...args);if(args[0]==='Region')rows[0].tokens.clear();return rows;};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.ok(checks>=2);assert.deepEqual(prompt.flags[S].spellZoneTest.recipients.map(r=>r.actorUuid),[target.uuid]);assert.match(prompt.content,/Esquiver/);assert.equal(target.system.resources.body.value,20);assert.equal(r.flags[S].spellZone.initialTokens.length,1);
});
test('pending Evade survives visual cleanup, movement out of the area, later rounds and elapsed time',async()=>{
 const p=setup(burst);caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:1}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);r.tokens.clear();scene.tokens.get('target').x=5000;game.combat.round=3;game.time.worldTime=100;await reconcileSpellZone(r);assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,1);await expireInstantSpellZone(r,{now:r.flags[S].spellZone.visualExpiresAt});assert.equal(regions.size,0);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(target.system.resources.body.value,20);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'accept')).status,'alreadyRolled');
});
test('initial victims without Evade take damage once with an empty native cache; late entrants are excluded',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);for(const token of scene.tokens.values())token.testInsideRegion=()=>token.id==='target';const create=scene.createEmbeddedDocuments;scene.createEmbeddedDocuments=async(...args)=>{const rows=await create(...args);if(args[0]==='Region')rows[0].tokens.clear();return rows;};await createSpellZoneOnAuthority(p);assert.equal(target.system.resources.body.value,16);assert.equal(caster.system.resources.body.value,20);const r=[...regions.values()][0];scene.tokens.get('caster').testInsideRegion=()=>true;await reconcileSpellZone(r,{entering:scene.tokens.get('caster')});assert.equal(caster.system.resources.body.value,20);assert.equal(target.system.resources.body.value,16);}
 finally{globalThis.Roll=old;}
});

test('fire light shares the actual circle centre/radius and elevation, with orange flame animation',async()=>{
 const p=setup(burst,{[burst+':1']:2,[burst+':3']:1});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});scene.tokens.get('caster').elevation=7;await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],light=[...scene.lights.values()][0];assert.equal(scene.lights.size,1);assert.equal(light.x,r.shapes[0].x);assert.equal(light.y,r.shapes[0].y);assert.equal(light.config.bright,1.5);assert.equal(light.config.dim,0);assert.equal(light.elevation,7);assert.equal(light.config.color,'#ffb347');assert.equal(light.config.alpha,0.1);assert.equal(light.config.animation.type,'flame');assert.equal(light.flags[S].spellZoneLight.regionUuid,r.uuid);await Promise.all([reconcileSpellZone(r),reconcileSpellZone(r)]);assert.equal(scene.lights.size,1);
});
test('moving extended fire updates the same light, and expiry removes it with the region',async()=>{
 const p=setup(burst,{[burst+':3']:1});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],light=[...scene.lights.values()][0];game.combat.round=2;await createSpellZoneOnAuthority({...p,point:{x:350,y:50}});assert.equal([...scene.lights.values()][0],light);assert.equal(light.x,350);assert.equal(light.y,50);game.combat.round=3;await Promise.all([reconcileSpellZone(r),reconcileSpellZone(r)]);assert.equal(scene.lights.size,0);assert.equal(regions.size,0);
});
test('instant fire light lasts with its ten-second visual and leaves pending Evade intact',async()=>{
 const p=setup(burst);caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],end=r.flags[S].spellZone.visualExpiresAt;assert.equal(scene.lights.size,1);await expireInstantSpellZone(r,{now:end-1});assert.equal(scene.lights.size,1);await expireInstantSpellZone(r,{now:end});assert.equal(scene.lights.size,0);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.match(prompt.content,/Esquiver/);
});
test('disabled, manually removed and orphaned fire lights are cleaned without touching ordinary lights',async()=>{
 const p=setup(sea,{[sea+':3']:2});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);const r=[...regions.values()][0];r.behaviors[0].disabled=true;await reconcileSpellZone(r);assert.equal(scene.lights.size,0);r.behaviors[0].disabled=false;await reconcileSpellZone(r);assert.equal(scene.lights.size,1);await r.delete();await reconcileSpellZone(r,{removed:true});assert.equal(scene.lights.size,0);
 const [regular]=await scene.createEmbeddedDocuments('AmbientLight',[{x:0,y:0,config:{bright:2},flags:{}}]);await scene.createEmbeddedDocuments('AmbientLight',[{x:0,y:0,config:{bright:2},flags:{[S]:{spellZoneLight:{regionUuid:r.uuid}}}}]);const {cleanupOrphanSpellZoneLights}=await import('../modules/fire-zones.mjs');await Promise.all([cleanupOrphanSpellZoneLights(scene),cleanupOrphanSpellZoneLights(scene)]);assert.equal(scene.lights.size,1);assert.equal(scene.lights.get(regular.id),regular);
});
test('fire light converts physical circle radius to scene units and ignores unrelated native defaults',async()=>{
 setup();const {spellZoneFireLightData,syncSpellZoneFireLight}=await import('../modules/fire-zones.mjs');const r={uuid:'Scene.scene.Region.light',parent:scene,shapes:[{type:'circle',x:150,y:250,radius:100}],flags:{[S]:{spellZone:{context:{sourceId:sea},profile:{kind:'fire'}}}}};scene.grid={size:100,distance:5,units:'ft'};assert.equal(spellZoneFireLightData(r).config.bright,5);const light=await syncSpellZoneFireLight(r);let writes=0;light.config.animation.reverse=false;light.update=async()=>writes++;await syncSpellZoneFireLight(r);assert.equal(writes,0);assert.equal(scene.lights.size,1);
});
test('lighting errors do not block fire damage or Evade decisions; non-fire zones never create lights',async()=>{
 await createSpellZoneOnAuthority(setup());assert.equal(scene.lights.size,0);const p=setup(burst);const create=scene.createEmbeddedDocuments,oldError=console.error,oldRoll=globalThis.Roll;let errors=0;console.error=()=>errors++;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};scene.createEmbeddedDocuments=async(type,data)=>{if(type==='AmbientLight')throw Error('Native light failure');return create(type,data);};
 try{await createSpellZoneOnAuthority(p);assert.equal(errors,1);assert.equal(target.system.resources.body.value,16);assert.equal(regions.size,1);}
 finally{console.error=oldError;globalThis.Roll=oldRoll;}
});
