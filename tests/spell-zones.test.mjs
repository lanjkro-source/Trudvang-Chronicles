import Handlebars from 'handlebars';import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {earthquakeProfile,earthquakeTest,spellZoneExpired,spellZonePhase,zonePixelScale} from '../modules/rules/spell-zones.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
const S='trudvang-chronicles',vitner='vitner-soil-craft:earthquake:2',divine='holy-toikalokke-master-of-elements:earthquake:7',rune='holy-thuuldom-earthquake:earthquake:0';
const langs=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync('lang/'+c+'.json','utf8'))]));let language='fr';const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('<','&lt;').replaceAll('>','&gt;')}})};
const docs=new Map(),hooks=new Map();let regionIndex=0,effectIndex=0;
globalThis.Hooks={on:(name,fn)=>{hooks.set(name,fn);},once:(name,fn)=>{hooks.set(name,fn);}};
globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};globalThis.CONST={REGION_VISIBILITY:{ALWAYS:2}};
globalThis.foundry={applications:{handlebars:{renderTemplate:async(path,data)=>Handlebars.compile(fs.readFileSync('templates/chat/'+path.split('/').at(-1),'utf8'))(data)}},data:{regionBehaviors:{RegionBehaviorType:class{}}},utils:{fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime,combat:game.combat?.id,round:game.combat?.round})}}}};
Handlebars.registerHelper('eq',(a,b)=>a===b);
Handlebars.registerHelper('localize',(key,options)=>game.i18n.format(key,options.hash));
const {createSpellZoneOnAuthority,reconcileSpellZone,resolveSpellZoneRequest,registerSpellZoneSupport,requestSpellZoneTest,placeSpellZone,migrateToikalokkeEarthquake}=await import('../modules/spell-zones.mjs');
let gm,owner,observer,scene,caster,target,message,regions;
function setup(id=vitner,counts={},runeLevel=1){
 docs.clear();hooks.clear();language='fr';gm={id:'gm',isGM:true,active:true,isSelf:true};owner={id:'owner',active:true};observer={id:'observer',active:true};const users=new Map([gm,owner,observer].map(u=>[u.id,u]));users.activeGM=gm;
 globalThis.game={user:gm,users,actors:new Map(),scenes:new Map(),messages:new Map(),time:{worldTime:0},combat:{id:'combat',round:1,started:true},i18n:{localize:k=>get(langs[language],k)??k,format:(k,d)=>String(get(langs[language],k)??k).replace(/\{(\w+)\}/g,(_,k)=>d[k]??'')}};
 globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.uuid}),create:async data=>{const m={...data,id:'message-'+game.messages.size,author:gm,getFlag:(_s,k)=>m.flags?.[S]?.[k],async update(data){if(data.content!==undefined)m.content=data.content;for(const[k,v]of Object.entries(data))if(k.startsWith('flags.'+S+'.')){m.flags??={};m.flags[S]??={};m.flags[S][k.slice(('flags.'+S+'.').length)]=v;}}};game.messages.set(m.id,m);return m;}};
 const actor=(id,size=1)=>{const a={uuid:'Actor.'+id,name:id,type:'npc',documentName:'Actor',isOwner:true,effects:[],items:[],statuses:new Set(),system:{details:{size},protection:0,resources:{body:{value:20}}},getTraitValue:()=>0,async update(changes){if(changes['system.resources.body.value']!==undefined)a.system.resources.body.value=changes['system.resources.body.value'];},testUserPermission:u=>u.isGM||u.id===owner.id,async createTrudvangEffect(data){const e={...data,id:'effect-'+effectIndex++,uuid:a.uuid+'.ActiveEffect.'+effectIndex,parent:a,documentName:'ActiveEffect',async delete(){a.effects=a.effects.filter(x=>x!==e);docs.delete(e.uuid);}};a.effects.push(e);docs.set(e.uuid,e);return e;},async clone(changes){return {...a,effects:changes.effects};}};docs.set(a.uuid,a);game.actors.set(a.uuid,a);return a;};
 caster=actor('caster');target=actor('target');regions=new Map();scene={id:'scene',grid:{size:100,distance:1,units:'m'},regions,tokens:new Map(),async createEmbeddedDocuments(type,data){assert.equal(type,'Region');const r={...data[0],id:'r'+regionIndex++,uuid:'Scene.scene.Region.'+regionIndex,parent:scene,tokens:new Set(scene.tokens.values()),async update(data){for(const[k,v]of Object.entries(data))if(k==='flags.'+S+'.spellZone.collapseRolled')r.flags[S].spellZone.collapseRolled=v;},async delete(){regions.delete(r.id);docs.delete(r.uuid);}};regions.set(r.id,r);docs.set(r.uuid,r);return [r];}};game.scenes.set(scene.id,scene);
 for(const [id,a,x]of [['caster',caster,0],['target',target,100]]){const t={id,uuid:'Scene.scene.Token.'+id,parent:scene,actor:a,x,y:0,width:1,height:1,name:a.name};scene.tokens.set(id,t);docs.set(t.uuid,t);}
 const context={sourceId:id,casterUuid:caster.uuid,countsById:counts,kind:id===rune?'rune':'spell',runeLevel,sourceLevel:POWER_DETAILS_BY_ID[id].level};
 message={id:'cast',author:gm,rolls:[{formula:'1d20',total:5}],flags:{[S]:{ruleTestContext:context,spellZoneCasting:{target:12}}},async update(data){for(const[k,v]of Object.entries(data))if(k==='flags.'+S+'.spellZoneCasting')message.flags[S].spellZoneCasting=v;}};game.messages.set(message.id,message);
 return {messageId:message.id,userId:owner.id,sceneId:scene.id,tokenId:'caster',point:{x:50,y:50}};
}
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
 setup();registerSpellZoneSupport();assert.ok(CONFIG.RegionBehavior.dataModels.trudvangSpellZone);assert.ok(hooks.has('updateWorldTime'));assert.ok(hooks.has('updateCombat'));
 const info={createdAt:10,until:25,combatId:'c',expiresRound:5};assert.equal(spellZoneExpired(info,{time:20,combat:{id:'c',round:5}}),true);assert.equal(spellZoneExpired(info,{time:25}),true);assert.equal(spellZonePhase(info,{time:20,combat:{id:'c',round:4}}),'round:4');assert.ok(Math.abs(zonePixelScale({grid:{size:100,distance:5,units:'ft'}})-100/5/.3048)<1e-10);
});

test('failed Agility rolls publish and apply fall damage once and only the zone penalty is excluded',async()=>{
 await createSpellZoneOnAuthority(setup(vitner,{[vitner+':3']:2,[vitner+':2']:1}));
 const region=[...regions.values()][0];const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);
 target.effects.push({id:'fatigue',name:'Fatigue',flags:{},system:{changes:[]}});let checks=0;
 target.rollAbility=async function(item,context){checks++;assert.equal(item.system.parentSkill,'agility');assert.equal(item.system.level,0);assert.equal(this.effects.length,1);assert.equal(this.effects[0].name,'Fatigue');assert.equal(context.modifierRows[0].value,-4);const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:20}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};
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
