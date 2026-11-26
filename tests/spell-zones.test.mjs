import Handlebars from 'handlebars';import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {earthquakeProfile,earthquakeTest,spellZoneExpired,spellZonePhase,spellZoneRange,zonePixelScale} from '../modules/rules/spell-zones.mjs';
import {POWER_DETAILS_BY_ID} from '../modules/power-catalog-data.mjs';
import {darknessCombatRow} from '../modules/rules/jorn-darkness.mjs';
import {targetDefenseRows} from '../modules/rules/attack-size.mjs';
import {quagmireMovement,quagmireTravelBudget} from '../modules/rules/quagmire.mjs';
import {addSpellWallBlock,spellWallBlockPoint,spellWallColumns} from '../modules/rules/spell-walls.mjs';
import {endMaintainedSpellOnGM,recoverMaintainedSpellZones} from '../modules/maintained-spell-tracking.mjs';
import {AIR_SHIELD,VITNER_WALL,airShieldTest,spellBarrierProfile,vitnerWallTest} from '../modules/rules/spell-barriers.mjs';
import {airShieldCover,interceptAirShieldMovement,vitnerWallBlocks} from '../modules/spell-barriers.mjs';
import {activeSpellInstances} from '../modules/rules/active-spell-resolver.mjs';
import {isForeignMagic,nidResistanceBonus,nidZoneProfile} from '../modules/rules/nid-zones.mjs';
import {activeWeatherWards} from '../modules/rules/weather-wards.mjs';
const S='trudvang-chronicles',vitner='vitner-soil-craft:earthquake:2',divine='holy-toikalokke-master-of-elements:earthquake:7',rune='holy-thuuldom-earthquake:earthquake:0';
const langs=Object.fromEntries(['fr','en'].map(c=>[c,JSON.parse(fs.readFileSync('lang/'+c+'.json','utf8'))]));let language='fr';const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v).replaceAll('<','&lt;').replaceAll('>','&gt;')}})};
const docs=new Map(),hooks=new Map();let regionIndex=0,effectIndex=0;
globalThis.Hooks={on:(name,fn)=>{hooks.set(name,fn);},once:(name,fn)=>{hooks.set(name,fn);}};
globalThis.CONFIG={RegionBehavior:{dataModels:{},typeLabels:{},typeIcons:{}}};globalThis.CONST={REGION_VISIBILITY:{ALWAYS:2}};
globalThis.foundry={applications:{handlebars:{renderTemplate:async(path,data)=>Handlebars.compile(fs.readFileSync('templates/chat/'+path.split('/').at(-1),'utf8'))(data)}},data:{regionBehaviors:{RegionBehaviorType:class{}}},utils:{fromUuid:async uuid=>docs.get(uuid)},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime,combat:game.combat?.id,round:game.combat?.round})}}}};
Handlebars.registerHelper('eq',(a,b)=>a===b);
Handlebars.registerHelper('localize',(key,options)=>game.i18n.format(key,options.hash));
const {createSpellZoneOnAuthority,reconcileSpellZone,resolveSpellZoneRequest,registerSpellZoneSupport,requestSpellZoneTest,placeSpellZone,spellWallCardState,openSpellWallDamage,migrateToikalokkeEarthquake}=await import('../modules/spell-zones.mjs');
const {applyFatalEnclosure, registerFatalEnclosures}=await import('../modules/fatal-enclosure.mjs');
const applyInstant=(prompt,user=owner)=>resolveSpellZoneRequest({type:'applyInstantSpellZone',messageId:prompt.id,userId:user.id});
let gm,owner,observer,scene,caster,target,message,regions;
function setup(id=vitner,counts={},runeLevel=1){
 docs.clear();hooks.clear();language='fr';gm={id:'gm',isGM:true,active:true,isSelf:true};owner={id:'owner',active:true};observer={id:'observer',active:true};const users=new Map([gm,owner,observer].map(u=>[u.id,u]));users.activeGM=gm;
 globalThis.game={user:gm,users,actors:new Map(),scenes:new Map(),messages:new Map(),time:{worldTime:0},combat:{id:'combat',round:1,started:true},i18n:{localize:k=>get(langs[language],k)??k,format:(k,d)=>String(get(langs[language],k)??k).replace(/\{(\w+)\}/g,(_,k)=>d[k]??'')}};
 globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.uuid}),create:async data=>{const m={...data,id:data._id??'message-'+game.messages.size,author:gm,getFlag:(_s,k)=>m.flags?.[S]?.[k],async update(data){if(data.content!==undefined)m.content=data.content;for(const[k,v]of Object.entries(data))if(k.startsWith('flags.'+S+'.')){m.flags??={};m.flags[S]??={};m.flags[S][k.slice(('flags.'+S+'.').length)]=v;}}};game.messages.set(m.id,m);return m;}};
 const actor=(id,size=1)=>{const a={uuid:'Actor.'+id,name:id,type:'npc',documentName:'Actor',isOwner:true,effects:[],items:[],statuses:new Set(),system:{details:{size},protection:0,resources:{body:{value:20}}},getTraitValue:()=>0,flags:{},getFlag:(scope,key)=>a.flags[scope]?.[key],async update(changes){if(changes['system.resources.body.value']!==undefined)a.system.resources.body.value=changes['system.resources.body.value'];for(const [key,value] of Object.entries(changes)){if(!key.startsWith('flags.'))continue;const parts=key.split('.').slice(1),field=parts.pop(),parent=parts.reduce((object,part)=>object[part]??={},a.flags);parent[field]=value;}},testUserPermission:u=>u.isGM||u.id===owner.id,async createTrudvangEffect(data){const e={...data,id:'effect-'+effectIndex++,uuid:a.uuid+'.ActiveEffect.'+effectIndex,parent:a,documentName:'ActiveEffect',async delete(){a.effects=a.effects.filter(x=>x!==e);docs.delete(e.uuid);}};a.effects.push(e);docs.set(e.uuid,e);return e;},async clone(changes){return {...a,effects:changes.effects};}};docs.set(a.uuid,a);game.actors.set(a.uuid,a);return a;};
 caster=actor('caster');target=actor('target');regions=new Map();scene={id:'scene',grid:{size:100,distance:1,units:'m'},regions,lights:new Map(),tokens:new Map(),async createEmbeddedDocuments(type,data){if(type==='AmbientLight'){const light={...structuredClone(data[0]),id:'light-'+scene.lights.size,parent:scene,async update(data){Object.assign(this,structuredClone(data));},async delete(){assert.equal(scene.lights.get(this.id),this,'Light deleted twice');scene.lights.delete(this.id);}};scene.lights.set(light.id,light);return [light];}assert.equal(type,'Region');const manifest=JSON.parse(fs.readFileSync('system.json','utf8'));for(const behavior of data[0].behaviors)assert.ok(Object.hasOwn(manifest.documentTypes.RegionBehavior,behavior.type),'Region behavior must be declared in the package manifest: '+behavior.type);const r={...data[0],id:'r'+regionIndex++,uuid:'Scene.scene.Region.'+regionIndex,parent:scene,tokens:new Set(scene.tokens.values()),async update(data){for(const[k,v]of Object.entries(data))if(k.startsWith('flags.'+S+'.spellZone.'))r.flags[S].spellZone[k.slice(('flags.'+S+'.spellZone.').length)]=v;else if(k==='shapes')r.shapes=v;},async delete(){assert.equal(regions.get(r.id),r,"region deleted twice");regions.delete(r.id);docs.delete(r.uuid);}};regions.set(r.id,r);docs.set(r.uuid,r);return [r];}};game.scenes.set(scene.id,scene);
 for(const [id,a,x]of [['caster',caster,0],['target',target,100]]){const t={id,uuid:'Scene.scene.Token.'+id,parent:scene,actor:a,x,y:0,width:1,height:1,name:a.name};scene.tokens.set(id,t);docs.set(t.uuid,t);}
 const context={sourceId:id,casterUuid:caster.uuid,countsById:counts,kind:id===rune?'rune':'spell',runeLevel,sourceLevel:POWER_DETAILS_BY_ID[id].level};
 message={id:'cast',author:gm,rolls:[{formula:'1d20',total:5}],flags:{[S]:{ruleTestContext:context,spellZoneCasting:{target:12}}},async update(data){for(const[k,v]of Object.entries(data))if(k==='flags.'+S+'.spellZoneCasting')message.flags[S].spellZoneCasting=v;}};game.messages.set(message.id,message);
 return {messageId:message.id,userId:owner.id,sceneId:scene.id,tokenId:'caster',point:{x:50,y:50}};
}
const jorn='holy-gerbanis-influence-of-jorn:';
const quagmire='vitner-soil-craft:quagmire:3';
const earthWall='holy-toikalokke-master-of-elements:earth-wall:0';
const blessedHome='holy-tenetnid-tablet-of-the-sun:blessed-home:5';
const protectiveGround='holy-tenetnid-tablet-of-the-sun:protective-ground:1';
const sacredGrove='holy-tenetnid-tablet-of-the-sun:sacred-grove:6';
const nidWard='holy-tenetnid-tablet-of-the-shield:vitner-resistance:6';

test('Nid uses distinct durations and caps, exempting powers of Nid but not spells or foreign runes',()=>{
 const base=[protectiveGround,blessedHome,sacredGrove].map(sourceId=>nidZoneProfile({sourceId}));
 assert.deepEqual(base.map(p=>[p.radius,p.rounds,p.penalty,p.resistance,p.ritualRounds]),[
   [2,720,-1,2,6],[4,720,-3,6,12],[8,17280,-5,10,24]]);
 assert.equal(nidZoneProfile({sourceId:protectiveGround,counts:[1,2,20,20]}).penalty,-4);
 assert.equal(nidZoneProfile({sourceId:blessedHome,counts:[1,2,20,20]}).resistance,10);
 assert.equal(nidZoneProfile({sourceId:sacredGrove,counts:[0,2,4,3]}).radius,12);
 assert.equal(isForeignMagic({kind:'divine',sourceId:blessedHome}),false);
 assert.equal(isForeignMagic({kind:'divine',sourceId:'custom',religion:'tenetNid'}),false);
 assert.equal(isForeignMagic({kind:'rune',religion:'thuuldom'}),true);
 assert.equal(isForeignMagic({kind:'spell'}),true);
});

test('Blessed Home is a fixed daylight rite and applies one DC per target for a shared casting roll',async()=>{
 const request=setup(blessedHome);
 message.flags[S].ruleTestContext.kind='divine';
 const previousRoll=globalThis.Roll;
 const previousUI=globalThis.ui;
 globalThis.ui={notifications:{warn:()=>{}}};
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=this.formula==='1'?1:9;return this;}};
 try{
  assert.equal((await createSpellZoneOnAuthority(request)).status,'unavailable');
  assert.equal(caster.system.resources.body.value,20);
  assert.equal((await createSpellZoneOnAuthority({...request,daylight:true})).status,'placed');
  assert.equal(caster.system.resources.body.value,19);
  assert.equal((await createSpellZoneOnAuthority({...request,daylight:true})).status,'alreadyPlaced');
  assert.equal(caster.system.resources.body.value,19);
  const [ward]=regions.values();
  assert.equal(ward.shapes[0].radius,400);
  const inside=scene.tokens.get('target'),outside=scene.tokens.get('caster');
  outside.x=800;
  assert.equal(ward.shapes[0].x,50);
  const clock={time:0,combat:game.combat};
  const context={kind:'spell',sourceId:'vitner-body-vitner:imprison:10'};
  assert.equal(nidResistanceBonus({magicResistance:true,index:0},context,inside,clock).value,6);
  assert.equal(nidResistanceBonus({magicResistance:true,index:0},context,outside,clock),null);
  assert.equal(nidResistanceBonus({magicResistance:true,index:0},{kind:'spell',sourceId:'other'},inside,clock),null);
  const {rollUnder}=await import('../modules/dice.mjs');
  const {magicBlockedForTarget}=await import('../modules/spell-zones.mjs');
  game.user.targets=new Set([inside,outside]);
  const item={type:'divineFeat',name:'Ability',system:{level:2,catalogId:'custom',religion:'haminges'}};
  assert.equal((await rollUnder({actor:caster,item,kind:'divine',label:item.name,target:10})).success,true);
  const card=[...game.messages.values()].at(-1);
  assert.match(card.content,/target.*Foyer béni.*VC 7/);
  assert.equal(await magicBlockedForTarget(card,target,inside.uuid),true);
  assert.equal(await magicBlockedForTarget(card,caster,outside.uuid),false);
  inside.x=900;
  assert.equal(await magicBlockedForTarget(card,target,inside.uuid),true,'the target keeps its casting-time VC');
  inside.x=100;
  game.user.targets=new Set([inside]);
  assert.equal((await rollUnder({actor:caster,item,kind:'divine',label:item.name,target:10})).success,false);
  item.system.religion='tenetNid';
  assert.equal((await rollUnder({actor:caster,item,kind:'divine',label:item.name,target:10})).success,true);
 }finally{globalThis.Roll=previousRoll;globalThis.ui=previousUI;}
});

test('Vitner Resistance protects occupants, then disappears only on a successful spell breach',async()=>{
 const request=setup(nidWard,{[nidWard+':1']:1,[nidWard+':2']:2});
 message.flags[S].ruleTestContext.kind='divine';
 assert.equal((await createSpellZoneOnAuthority({...request,temperature:31})).status,'placed');
 const [region]=regions.values();
 assert.equal(region.shapes[0].radius,600);
 assert.equal(region.flags[S].spellZone.profile.breach,8);
 target.token=scene.tokens.get('target');
 assert.equal(activeWeatherWards(target)[0].temperature,31);
 const oldRoll=globalThis.Roll,rolls=[];
 let die=9;
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){rolls.push(this.formula);this.total=die;return this;}};
 const crossing={scene,origin:{x:750,y:50},target:{x:150,y:50}};
 const cast=(id,kind)=>({id,flags:{[S]:{ruleTestContext:{kind,casterUuid:caster.uuid,sourceLevel:2}}}});
 try{
  assert.equal(await vitnerWallBlocks({...crossing,message:cast('power','divine')}),false);
  assert.equal(await vitnerWallBlocks({...crossing,message:cast('rune','rune')}),false);
  const resisted=cast('blocked','spell');
  assert.equal(await vitnerWallBlocks({...crossing,message:resisted}),true);
  assert.equal(await vitnerWallBlocks({...crossing,message:resisted}),true);
  assert.equal(regions.size,1);
  assert.equal(rolls.length,1);
  die=8;
  assert.equal(await vitnerWallBlocks({...crossing,message:cast('pierce','spell')}),false);
  assert.equal(rolls.length,2);
  assert.equal(regions.size,0);
  assert.equal(activeWeatherWards(target).length,0);
 }finally{globalThis.Roll=oldRoll;}
});

test('Air Shield has directional cover, applies its official Size table and expires with its region',async()=>{
 const counts={[AIR_SHIELD+':3']:2,[AIR_SHIELD+':5']:2};
 const request=setup(AIR_SHIELD,counts);
 const profile=spellBarrierProfile(message.flags[S].ruleTestContext);
 assert.equal(profile.size,1.5);
 assert.deepEqual([.2,.4,1,1.5,3,5,10].map(size=>airShieldTest(profile,size)),[1,3,7,11,15,19,23]);
 const placed=await createSpellZoneOnAuthority({...request,point:{x:100,y:50},shape:{rotation:90}});
 assert.equal(placed.status,'placed');
 const [region]=regions.values();
 assert.equal(region.color,'#008cff');
 assert.equal(region.shapes[0].width,150);
 assert.equal(region.shapes[0].rotation,90);
 assert.equal(airShieldCover(scene.tokens.get('caster'),scene.tokens.get('target'))[0].value,3);
 scene.tokens.get('target').level='other';
 assert.deepEqual(airShieldCover(scene.tokens.get('caster'),scene.tokens.get('target')),[]);
 game.combat.round+=5;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
});

test('Air Shield waits for a Strength roll and replays the same path only after success',async()=>{
 const request=setup(AIR_SHIELD,{[AIR_SHIELD+':5']:1});
 assert.equal((await createSpellZoneOnAuthority({...request,point:{x:100,y:50},shape:{rotation:90}})).status,'placed');
 const token=scene.tokens.get('caster');
 token.actor.getRollModifier=()=>0;
 token.actor.getTraitValue=()=>2;
 token.actor.canPerformAction=()=>true;
 const oldRoll=globalThis.Roll,api=foundry.applications.api;
 let confirmDialog, die=19, attempts=0, moved=0;
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=die;}};
 foundry.applications.api={DialogV2:class{static wait(options){return new Promise(resolve=>{
  attempts++;
  confirmDialog=()=>resolve(options.buttons[0].callback(null,{form:{querySelector:()=>({value:'0'})}}));
 });}}};
 const movement={origin:{x:0,y:0},destination:{x:100,y:0},pending:{waypoints:[{x:100,y:0}]}};
 token.move=async path=>{
  assert.equal(path[0].x,100);
  assert.equal(interceptAirShieldMovement(token,movement),undefined);
  moved++;
 };
 try{
  assert.equal(interceptAirShieldMovement(token,movement),false);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(attempts,1);
  confirmDialog();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(moved,0);
  die=1;
  assert.equal(interceptAirShieldMovement(token,movement),false);
  await new Promise(resolve=>setImmediate(resolve));
  confirmDialog();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(moved,1);
 }finally{globalThis.Roll=oldRoll;foundry.applications.api=api;}
});

test('Wall of Vitner blocks across the ring once per spell, with a lasting upgrade and bounded damage paths',async()=>{
 const options={[VITNER_WALL+':0']:2,[VITNER_WALL+':6']:1};
 const request=setup(VITNER_WALL,options),profile=spellBarrierProfile(message.flags[S].ruleTestContext);
 assert.equal(profile.radius,3.5);
 assert.deepEqual([1,2,3,4,5].map(level=>vitnerWallTest(profile,level)),[14,12,10,8,6]);
 assert.equal((await createSpellZoneOnAuthority(request)).status,'placed');
 const oldRoll=globalThis.Roll;
 let rolls=0;
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){rolls++;this.total=7;}};
 try{
  const source={id:'incoming',flags:{[S]:{ruleTestContext:{kind:'spell',sourceLevel:3}}}};
  const incoming={scene,origin:{x:500,y:50},target:{x:75,y:50},message:source};
  assert.equal(await vitnerWallBlocks(incoming),true);
  assert.equal(await vitnerWallBlocks(incoming),true);
  assert.equal(rolls,1);
  assert.equal(await vitnerWallBlocks({...incoming,target:{x:450,y:200}}),false);
  source.flags[S].ruleTestContext.kind='divine';
  assert.equal(await vitnerWallBlocks(incoming),false);
  assert.equal(rolls,1);
  caster.items.push({type:'spell',id:'wall',system:{spellType:'sustained',catalogId:VITNER_WALL}});
  caster.system.activeSpellCastingsMigrated=true;
  caster.system.activeSpellCastings=[{id:'base',itemId:'wall',powerLevelCounts:[]},
   {id:'upgrade',itemId:'wall',powerLevelCounts:[0,0,0,0,0,0,0,1]}];
  assert.deepEqual(activeSpellInstances(caster).map(row=>row.id),['upgrade']);
 }finally{globalThis.Roll=oldRoll;}
});

test('Huvfurwurm Head consumes one improved guard, blocks its tablet and wakes after the hibernation clock',async()=>{
 const {HUVFURWURM_HEAD,dragonRelicCracked,huvfurwurmGuard}=await import('../modules/rules/huvfurwurm-head.mjs');
 setup(HUVFURWURM_HEAD);
 const {resolveHuvfurwurmDeath}=await import('../modules/huvfurwurm-head.mjs');
 foundry.data.ActiveEffectTypeDataModel=class {};
 foundry.documents.ActiveEffect=Object.assign(class {},foundry.documents.ActiveEffect);
 game.actors=new Set([caster,target]);
 game.scenes=new Set();
 const {expireAppliedEffects}=await import('../modules/effects.mjs');
 const {spellAvailability}=await import('../modules/rules/spell-availability.mjs');
 const oldRoll=globalThis.Roll,processed=[];
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){processed.push(this.formula);this.total=6;return this;}toJSON(){return {formula:this.formula,total:this.total};}};
 caster.system.resources.body.value=-4;
 caster.system.survivalRounds=0;
 const update=caster.update;
 caster.update=async changes=>{await update(changes);if('system.survivalRounds' in changes)caster.system.survivalRounds=changes['system.survivalRounds'];};
 caster.createEmbeddedDocuments=async (type,effects)=>{
  assert.equal(type,'ActiveEffect');
  return Promise.all(effects.map(data=>caster.createTrudvangEffect(data)));
 };
 const guard=await caster.createTrudvangEffect({flags:{[S]:{transformation:{sourceId:HUVFURWURM_HEAD,
  ruleTestContext:{countsById:{[HUVFURWURM_HEAD+':2']:3}}}}}});
 guard.update=async changes=>Object.assign(guard.flags[S],{huvfurwurmRoll:changes['flags.'+S+'.huvfurwurmRoll']});
 try{
  assert.deepEqual(await Promise.all([resolveHuvfurwurmDeath(caster),resolveHuvfurwurmDeath(caster)]),[true,true]);
  assert.deepEqual(processed,['1d10']);
  assert.equal(dragonRelicCracked(caster),true);
  assert.equal(huvfurwurmGuard(caster),null);
  assert.equal(caster.effects.filter(e=>e.flags[S].huvfurwurmHibernation).length,1);
  assert.equal(spellAvailability(caster,{type:'divineFeat',system:{catalogId:HUVFURWURM_HEAD}}).reason,'TRUDVANG.HuvfurwurmHead.CrackedDescription');
  game.time.worldTime=29*86400;
  await expireAppliedEffects({time:game.time.worldTime});
  assert.equal(caster.system.resources.body.value,-4);
  game.time.worldTime=30*86400;
  await expireAppliedEffects({time:game.time.worldTime});
  assert.equal(caster.system.resources.body.value,1);
  assert.equal(caster.system.survivalRounds,-1);
  assert.equal(caster.effects.length,1);
  assert.equal(dragonRelicCracked(caster),true);
 }finally{globalThis.Roll=oldRoll;}
});

test('Heat Water only reports the combined volume, duration and range',async()=>{
 const id='vitner-flame-craft:heat-water:0',old=globalThis.Roll;
 setup();
 const {heatingConsequence}=await import('../modules/water-purification.mjs');
 assert.match(heatingConsequence({sourceId:id}),/5 L.*5 min.*contact/i);
 const countsById={[id+':0']:2,[id+':1']:2,[id+':2']:2,[id+':3']:1,[id+':4']:1};
 assert.match(heatingConsequence({sourceId:id,countsById}),/117 L.*7 min.*10 m/);
 assert.equal(POWER_DETAILS_BY_ID[id].spellZone,undefined);
 assert.equal(POWER_DETAILS_BY_ID[id].damageRoll,undefined);
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=5;}};
 try{
  const {rollUnder}=await import('../modules/dice.mjs');
  await rollUnder({actor:caster,item:{uuid:'Actor.caster.Item.heat',name:'Ébullition',type:'spell',actor:caster,system:{catalogId:id,level:1}},
   label:'Ébullition',powerLevelCounts:[2,2,2,1,1],target:12,kind:'spell'});
  const card=[...game.messages.values()].find(m=>m.id!=='cast');
  assert.match(card.content,/117 L.*7 min.*10 m/);
  assert.doesNotMatch(card.content,/place-spell-zone|magic-damage|data-transformation-key/);
  assert.equal(regions.size,0);
 }finally{globalThis.Roll=old;}
});

test('only saved Heat Water regions are retired by the compatibility cleanup',async()=>{
 await createSpellZoneOnAuthority(setup());
 const [other]=regions.values();
 const [obsolete]=await scene.createEmbeddedDocuments('Region',[{
  flags:{[S]:{spellZone:{profile:{kind:'boilingWater'},context:{sourceId:'vitner-flame-craft:heat-water:0'}}}},
  behaviors:other.behaviors
 }]);
 await reconcileSpellZone(obsolete);
 assert.equal(regions.has(obsolete.id),false);
 assert.equal(regions.get(other.id),other);
 assert.equal(target.system.resources.body.value,20);
});

test('Seal defers a successful spell, freezes critical improvements and releases exactly once without rolling again',async()=>{
 const castId='vitner-flame-craft:heat-water:0',sealId='vitner-vitner-craft:seal:5';
 const previous=globalThis.Roll;
 globalThis.Roll=class{
  static fromData(data){return data;}
  constructor(formula){this.formula=formula;}
  async evaluate(){this.total=1;this.evaluated=true;}
  toJSON(){return {formula:this.formula,total:this.total};}
 };
 try{
  setup();
  const {canBindSpell,handleSealRequest,releaseSealedSpell,sealPreparation,sealSheetView}=await import('../modules/magic-seal.mjs');
  const {rollUnder}=await import('../modules/dice.mjs');
  const seal={uuid:'Actor.target.Item.vessel.ActiveEffect.seal',parent:{documentName:'Item',type:'gear',name:'Vessel',
   parent:target,testUserPermission:(user,level)=>level==='LIMITED' && [owner,observer].includes(user)},
   flags:{[S]:{magicSeal:{...sealPreparation({sourceId:sealId,kind:'spell',casterUuid:target.uuid}),releaseMessageId:'release-seal',sealUserId:owner.id}}},
   async update(changes){this.flags[S].magicSeal.spell=changes['flags.'+S+'.magicSeal.spell'];},
   async delete(){this.disabled=true;}};
  const item={uuid:'Actor.caster.Item.heat',id:'heat',name:'Ébullition',actor:caster,type:'spell',
   system:{catalogId:castId,level:1,spellType:'lasting',powerLevels:[{effect:'Plus longue'},{effect:'Plus loin'},{effect:'Plus d’eau'},{effect:'Dix litres'},{effect:'Cent litres'}]},
   toObject(){return {system:structuredClone(this.system)};}};
  docs.set(seal.uuid,seal);docs.set(item.uuid,item);
  assert.equal(canBindSpell(seal,caster,item,owner),false);
  caster.items.push({type:'tablet',system:{catalogId:'vitner-flame-craft',level:1}});
  assert.equal(canBindSpell(seal,caster,item,owner),true);
  assert.equal(canBindSpell(seal,caster,item,observer),false);
  assert.equal(canBindSpell(seal,caster,{...item,system:{...item.system,level:2}},owner),false);
  caster.items[0].system.level=2;
  assert.equal(canBindSpell(seal,caster,{...item,system:{...item.system,level:2}},owner),false,'The seal caps the level even if the tablet allows it');
  const {status,token}=await handleSealRequest({action:'reserve',userId:gm.id,effectUuid:seal.uuid,actorUuid:caster.uuid,spellUuid:item.uuid});
  assert.equal(status,'reserved');
  const result=await rollUnder({actor:caster,item,kind:'spell',label:item.name,target:10,castingId:'bound-cast',
   powerLevelCounts:[1,0,0,0,0],seal:{effect:seal,token,cost:3,levels:[{id:castId+':0'}]},
   resolvePerfectSuccess:async()=>({counts:[2,2,2,1,1]})});
  assert.equal(result.success,true);
  const stored=seal.flags[S].magicSeal.spell;
  assert.equal(stored.context.countsById[castId+':4'],1);
  assert.equal(stored.levels[0].count,2);
  assert.equal(sealSheetView(seal).improvements.length,5);
  assert.doesNotMatch([...game.messages.values()].at(-1).content,/117 L|place-spell-zone|magic-damage/);
  globalThis.Roll=class{static fromData(data){return data;}constructor(){throw Error('Release must use the saved roll');}};
  const tokenDoc=scene.tokens.get('target');tokenDoc.documentName='Token';
  const api=foundry.applications.api;
  try {
   game.user=observer;
   observer.targets=new Set([tokenDoc]);
   assert.equal(sealSheetView(seal).canRelease,true);
   foundry.applications.api={DialogV2:{wait:async({content})=>{assert.match(content,/<option[^>]*>target<\/option>/);return null;}}};
   assert.equal(await releaseSealedSpell(seal),null);
   assert.equal(game.messages.has('release-seal'),false);
   assert.equal(seal.disabled,undefined);
  } finally {
   game.user=gm;
   foundry.applications.api=api;
  }
  const request={action:'release',userId:observer.id,effectUuid:seal.uuid,targetUuid:tokenDoc.uuid};
  const released=await Promise.all([handleSealRequest(request),handleSealRequest(request)]);
  assert.equal(released.filter(result=>result.status==='released').length,1);
  assert.equal(game.messages.get('release-seal').rolls[0].total,1);
  assert.match(game.messages.get('release-seal').content,/117 L.*7 min.*10 m/);
  assert.equal(game.messages.get('release-seal').flags[S].releasedSeal.targetUuid,tokenDoc.uuid);
  assert.equal(game.messages.get('release-seal').flags[S].releasedSeal.userId,observer.id);
  assert.equal(seal.disabled,true);
 }finally{globalThis.Roll=previous;}
});

test('a successful Seal prepares a single non-transferring effect on the chosen item',async()=>{
 setup();
 const {prepareMagicSeal,sealPreparation}=await import('../modules/magic-seal.mjs');
 const id='vitner-vitner-craft:seal:5', scope='flags.'+S+'.sealPreparation.';
 const context={sourceId:id,kind:'spell',casterUuid:caster.uuid,castingId:'seal-cast',countsById:{[id+':2']:2}};
 const state=sealPreparation(context,10);
 const item={documentName:'Item',uuid:'Item.box',name:'Box',type:'gear',parent:target,effects:[],
  testUserPermission:(_user,level)=>level==='LIMITED',
  async createEmbeddedDocuments(_type,[data]){const effect={...data,uuid:this.uuid+'.ActiveEffect.seal',parent:this};this.effects.push(effect);return [effect];}};
 message.author=owner;
 message.isContentVisible=true;
 message.flags[S].ruleTestContext=context;
 message.flags[S].sealPreparation=state;
 message.update=async changes=>{for(const [key,value] of Object.entries(changes))state[key.slice(scope.length)]=value;};
 const saved={...foundry.utils,apps:foundry.applications.api};
 Object.assign(foundry.utils,{deepClone:structuredClone,randomID:()=> 'release'});
 try{
  assert.equal(await prepareMagicSeal(message,item,observer),null);
  const effect=await prepareMagicSeal(message,item,owner);
  assert.equal(effect.transfer,false);
  assert.equal(effect.flags[S].magicSeal.maximum,3);
  assert.equal(effect.flags[S].magicSeal.spell,null);
  assert.equal(effect.flags[S].magicSeal.sealUserId,owner.id);
  assert.equal(effect.flags[S].transformation.ruleTestContext.castingId,'seal-cast');
  assert.equal(await prepareMagicSeal(message,item,owner),null);
  assert.equal(item.effects.length,1);
 }finally{
  delete foundry.utils.deepClone;delete foundry.utils.randomID;
  const {apps,...utils}=saved;Object.assign(foundry.utils,utils);foundry.applications.api=apps;
 }
});

test('a detached torch creates one fixed light, then removes it at expiration',async()=>{
 const spark='vitner-flame-craft:spark:1';
 const payload=setup(spark,{[spark+':3']:1,[spark+':4']:1});
 payload.point={x:100,y:50};
 const result=await createSpellZoneOnAuthority(payload);
 assert.equal(result.status,'placed');
 const region=await foundry.utils.fromUuid(result.regionUuid);
 const light=[...scene.lights.values()][0];
 assert.deepEqual([light.x,light.config.bright,light.config.dim],[100,3,6]);
 scene.tokens.get('caster').x=500;
 assert.equal((await createSpellZoneOnAuthority(payload)).reason,'AlreadyPlaced');
 assert.equal(scene.lights.size,1);
 game.time.worldTime=60;
 await reconcileSpellZone(region);
 assert.equal(scene.lights.size,0);
});

test('an inventory Spark consumes the placement once and stores its duration on the object',async()=>{
 const spark='vitner-flame-craft:spark:1';
 const payload=setup(spark,{[spark+':4']:1,[spark+':0']:2});
 const item={id:'item',documentName:'Item',type:'gear',parent:caster,system:{quantity:1},effects:[],
  canUserModify:user=>user.id===owner.id,async createEmbeddedDocuments(type,[effect]){
   assert.equal(type,'ActiveEffect');
   const created={...effect,uuid:'Actor.caster.Item.item.ActiveEffect.spark'};
   this.effects.push(created);
   return [created];
  }};
 caster.items.push(item);
 const result=await createSpellZoneOnAuthority({...payload,inventoryTokenId:'caster',inventoryItemId:item.id});
 assert.equal(result.status,'placed');
 assert.deepEqual(item.effects[0].duration,{value:36,units:'rounds'});
 assert.equal(scene.lights.size,0);
 assert.equal((await createSpellZoneOnAuthority(payload)).status,'alreadyPlaced');
 assert.equal(item.effects.length,1);
});

test('an attached Spark follows the chosen support and disappears when the support is deleted',async()=>{
 const spark='vitner-flame-craft:spark:1';
 const payload=setup(spark,{[spark+':4']:1});
 const support=scene.tokens.get('target');
 support.x=150;
 assert.equal((await createSpellZoneOnAuthority({...payload,lightTokenId:support.id})).status,'outOfRange');
 support.x=100;
 const result=await createSpellZoneOnAuthority({...payload,lightTokenId:support.id});
 assert.equal(result.status,'placed');
 const region=await foundry.utils.fromUuid(result.regionUuid);
 assert.equal(region.attachment.token,support.id);
 const light=[...scene.lights.values()][0];
 support.x=300;
 support.elevation=2;
 await reconcileSpellZone(region);
 assert.deepEqual([light.x,light.elevation,scene.lights.size],[350,2,1]);
 scene.tokens.delete(support.id);
 await reconcileSpellZone(region);
 assert.equal(scene.lights.size,0);
 assert.equal(regions.size,0);
});

test('only a GM may extinguish an existing fire and reconciliation keeps it out',async()=>{
 const fireTamer='holy-toikalokke-master-of-elements:fire-tamer:4';
 const payload=setup(fireTamer);
 const result=await createSpellZoneOnAuthority(payload);
 const region=await foundry.utils.fromUuid(result.regionUuid);
 const light=[...scene.lights.values()][0];
 const {extinguishFireTamerLight}=await import('../modules/spell-zones.mjs');
 game.user=owner;
 assert.equal((await extinguishFireTamerLight(message,scene,payload.tokenId,light.id)).status,'unavailable');
 assert.equal(light.hidden,false);
 game.user=gm;
 assert.equal((await extinguishFireTamerLight(message,scene,payload.tokenId,light.id)).status,'extinguished');
 assert.equal(light.hidden,true);
 await reconcileSpellZone(region);
 assert.equal(light.hidden,true);
 assert.equal(scene.lights.size,1);
});

test('Sunray uses the original casting site and resumes daylight only while the zone is active',async()=>{
 const payload=setup('holy-gerbanis-warmth-of-sunvei:sunray:1');
 const cast=message.flags[S].ruleTestContext;
 Object.assign(cast,{kind:'divine',lightFaith:12,lightSite:{sceneId:scene.id,tokenId:'caster',x:75,y:90}});
 scene.tokens.get('caster').x=500;
 assert.equal((await createSpellZoneOnAuthority(payload)).status,'unavailable');
 const result=await createSpellZoneOnAuthority({...payload,daylight:true});
 assert.equal(result.status,'placed');
 const region=await foundry.utils.fromUuid(result.regionUuid);
 const light=[...scene.lights.values()][0];
 assert.deepEqual([light.x,light.y,light.config.bright],[75,90,12]);
 scene.environment={darknessLevel:0.8};
 await reconcileSpellZone(region);
 assert.equal(light.hidden,true);
 scene.environment.darknessLevel=0.1;
 await reconcileSpellZone(region);
 assert.equal(light.hidden,false);
});

function setupEnclosure(row) {
 setup();
 const token=scene.tokens.get("caster"), victim=scene.tokens.get("target");
 const result={row,forced:true,actorUuid:caster.uuid,tokenUuid:token.uuid};
 message.flags[S].fatalMagicResult=result;
 message.rolls=[];
 message.getFlag=(_scope,key)=>message.flags[S][key];
 message.update=async data=>{result.enclosure=data[`flags.${S}.fatalMagicResult.enclosure`];};
 const create=scene.createEmbeddedDocuments;
 scene.createEmbeddedDocuments=async (type, data)=>{
  if(type!=="Region")return create(type,data);
  const r={...data[0],id:"enclosure",uuid:"Region.enclosure",parent:scene,
   async update(changes){r.flags[S].fatalEnclosure=changes[`flags.${S}.fatalEnclosure`];},
   async delete(){regions.delete(r.id);docs.delete(r.uuid);}};
  regions.set(r.id,r);docs.set(r.uuid,r);
  return [r];
 };
 return {token, victim, result};
}

test("a 50 enclosure previews its targets, charges each hit and ignores continuous presence", async () => {
 const {token,victim,result}=setupEnclosure(50);
 const previous=globalThis.Roll;
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;return this;}};
 try {
  assert.deepEqual(await applyFatalEnclosure(message,{cost:3}),{status:"applied"});
  assert.equal(regions.get("enclosure").attachment.token,token.id);
  assert.equal(result.enclosure.targets.length,2);
  assert.equal(target.system.resources.body.value,20);
  assert.equal(result.enclosure.remaining,3);
  assert.deepEqual(await applyFatalEnclosure(message,{pulse:true}),{status:"applied"});
  assert.equal(result.enclosure.remaining,1);
  assert.equal(target.system.resources.body.value,16);
  assert.deepEqual(await applyFatalEnclosure(message,{pulse:true}),{status:"unavailable"});
  registerFatalEnclosures();
  victim.x=1000;hooks.get("updateToken")(victim);
  await new Promise(resolve=>setImmediate(resolve));
  victim.x=100;hooks.get("updateToken")(victim);
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(result.enclosure.targets.map(row=>row.name),["target"]);
  assert.deepEqual(await applyFatalEnclosure(message,{pulse:true,sequence:0}),{status:"alreadyApplied"});
  assert.equal(target.system.resources.body.value,16);
  assert.deepEqual(await applyFatalEnclosure(message,{pulse:true}),{status:"applied"});
  assert.equal(regions.size,0);
  assert.equal(caster.effects.length,0);
  assert.equal(target.system.resources.body.value,12);
  assert.equal(result.enclosure.live,false);
 } finally {globalThis.Roll=previous;}
});

for (const [row,cost] of [[47,3],[50,2]]) {
 test(`a ${row} enclosure hits the nearest targets first and stops at zero`,async()=>{
  const {token,victim}=setupEnclosure(row);
  const far={...target,uuid:"Actor.far",name:"far",system:{...target.system,resources:{body:{value:20}}}};
  far.update=async changes=>{far.system.resources.body.value=changes["system.resources.body.value"];};
  const farToken={...victim,id:"far",uuid:"Scene.scene.Token.far",actor:far,x:300};
  docs.set(far.uuid,far);docs.set(farToken.uuid,farToken);
  scene.tokens=new Map([["far",farToken],["target",victim],["caster",token]]);
  const rolls=[],previous=globalThis.Roll;
  globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){rolls.push(this.formula);this.total=this.formula==="1d3"?2:4;return this;}};
  try {
   await applyFatalEnclosure(message,{cost});
   assert.deepEqual(await applyFatalEnclosure(message,{pulse:true}),{status:"applied"});
   assert.equal(caster.system.resources.body.value,16);
   assert.equal(target.system.resources.body.value,16);
   assert.equal(far.system.resources.body.value,20);
   assert.equal(regions.size,0);
   assert.equal(rolls.filter(formula=>formula==="1d3").length,row===47?2:0);
  } finally {globalThis.Roll=previous;}
 });
}

test("a 44 enclosure automatically hits on formation, re-entry and once per round",async()=>{
 const {victim,result}=setupEnclosure(44);
 target.system.resources.vitner={max:10,current:0};
 game.combat.scene=scene;
 const previous=globalThis.Roll;
 globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;return this;}};
 const flush=()=>new Promise(resolve=>setImmediate(resolve));
 try {
  registerFatalEnclosures();
  assert.deepEqual(await applyFatalEnclosure(message,{cost:16}),{status:"applied"});
  assert.equal(target.system.resources.body.value,16);
  assert.equal(result.enclosure.remaining,12);
  assert.equal(result.enclosure.pending,false);
  hooks.get("updateToken")(victim);await flush();
  assert.equal(target.system.resources.body.value,16);
  game.combat.round=2;
  hooks.get("updateCombat")(game.combat,{round:2});
  hooks.get("updateCombat")(game.combat,{round:2});
  await flush();
  assert.equal(target.system.resources.body.value,12);
  victim.x=6000;hooks.get("updateToken")(victim);await flush();
  victim.x=100;hooks.get("updateToken")(victim);await flush();
  assert.equal(target.system.resources.body.value,8);
  game.combat.round=3;hooks.get("updateCombat")(game.combat,{round:3});await flush();
  assert.equal(target.system.resources.body.value,4);
  assert.equal(regions.size,0);
 } finally {globalThis.Roll=previous;}
});

test('Earth Wall converts selected volume and duration upgrades into independently destructible sections',()=>{
 const def=POWER_DETAILS_BY_ID[earthWall].spellZone;
 assert.deepEqual(earthquakeProfile(def,{countsById:{[earthWall+':0']:2,[earthWall+':1']:1,[earthWall+':2']:1}}),
  {kind:'earthWall',range:2,volume:3,hitPoints:30,rounds:2880});
 const profile={volume:2,hitPoints:30};
 const first=addSpellWallBlock(null,{x:150,y:150},100,profile);
 const second=addSpellWallBlock(first,{x:179,y:149},100,profile);
 assert.deepEqual(second.sections.map(s=>s.hp),[30,30]);
 assert.equal(spellWallColumns(second)[0].blocks.length,2);
 assert.equal(addSpellWallBlock(second,{x:150,y:150},100,profile),null);
 const grid={isSquare:true,getTopLeftPoint:()=>({x:-88,y:-82})};
 const snapped=spellWallBlockPoint(null,{x:158,y:164},100,grid);
 assert.deepEqual(snapped,{x:162,y:168});
 assert.deepEqual(spellWallBlockPoint(null,snapped,100,grid),snapped);
});

test('Earth Wall creates solid level-specific edges, opens a gap on damage and removes edges at expiry',async()=>{
 const payload=setup(earthWall,{[earthWall+':0']:2});
 message.flags[S].ruleTestContext.kind='divine';
 const token=scene.tokens.get('caster');
 token.level='ground';
 const nativeCreate=scene.createEmbeddedDocuments;
 scene.walls=new Map();
 scene.drawings=new Map();
 const collection=type=>type==='Wall'?scene.walls:scene.drawings;
 scene.createEmbeddedDocuments=async function(type,rows){
  if(!['Wall','Drawing'].includes(type))return nativeCreate.call(scene,type,rows);
  return rows.map(row=>{
   const wall={...row,id:crypto.randomUUID()};
   collection(type).set(wall.id,wall);return wall;
  });
 };
 scene.deleteEmbeddedDocuments=async (type,ids)=>{
  for(const id of ids)assert.equal(collection(type).delete(id),true,'never delete a wall document twice');
 };
 scene.updateEmbeddedDocuments=async(type,rows)=>rows.forEach(row=>Object.assign(collection(type).get(row._id),row));
 CONST.WALL_MOVEMENT_TYPES={NORMAL:20,NONE:0};
 CONST.EDGE_SENSE_TYPES={NORMAL:20,NONE:0};
 CONST.DRAWING_FILL_TYPES={PATTERN:2};
 scene.grid.isSquare=true;
 scene.grid.getTopLeftPoint=()=>({x:0,y:0});
 const place=(x,y=50)=>resolveSpellZoneRequest({...payload,type:'createSpellZone',point:{x,y}});
 assert.match(spellWallCardState(message).text,/3 m³ à placer/);
 const saved={canvas:globalThis.canvas,ui:globalThis.ui};
 globalThis.ui={notifications:{warn:()=>assert.fail('valid blocks should not warn')}};
 globalThis.canvas={scene,tokens:{controlled:[token]},regions:{async placeRegion(data,options){
  const [shape]=data.shapes,point={x:143,y:44};
  assert.equal(shape.width,100);
  assert.equal(options.allowRotation,false);
  options.onMove({position:point,shape,preview:{document:{updateSource:()=>{}},renderFlags:{set:()=>{}}}});
  assert.equal(options.preConfirm({shape}),true);
  return {shapes:[{x:999,y:999}]};
 }}};
 try{assert.equal((await placeSpellZone(message)).wallBlocksPlaced,1);}
 finally{Object.assign(globalThis,saved);}
 const [region]=regions.values();
 assert.equal(scene.walls.size,4);
 assert.equal(region.shapes[0].x,150);
 assert.equal(region.shapes[0].y,50);
 assert.ok([...scene.walls.values()].every(wall=>wall.move===20&&wall.sight===0&&wall.light===0));
 assert.match([...scene.drawings.values()][0].texture,/earth-block\.webp$/);
 assert.equal([...scene.drawings.values()][0].fillType,2);
 assert.equal((await place(175)).wallBlocksPlaced,2);
 assert.equal(scene.walls.size,4);
 assert.equal([...scene.drawings.values()][0].text,'2 m');
 assert.equal((await place(230,70)).wallBlocksPlaced,3);
 assert.equal((await place(175)).reason,'WallComplete');
 assert.equal(spellWallCardState(message).complete,true);
 assert.equal(scene.walls.size,7,'the tall column has one vision-only edge facing the short column');
 assert.equal(region.shapes.length,2);
 assert.equal(game.messages.size,1);
 for(const wall of scene.walls.values()){
  assert.deepEqual(wall.levels,['ground']);
 }
 assert.equal([...scene.walls.values()].filter(wall=>wall.move===0&&wall.sight===20).length,1);
 assert.equal([...scene.walls.values()].filter(wall=>wall.move===20&&wall.sight===0).length,3);
 const oldApi=foundry.applications.api,oldUi=globalThis.ui;
 globalThis.ui={notifications:{warn:()=>assert.fail('cancellation must not warn')}};
 try{
  for(const choice of ['cancel','close',false]){
   foundry.applications.api={DialogV2:{wait:async()=>choice}};
   assert.equal(await openSpellWallDamage(message),null);
  }
 }finally{foundry.applications.api=oldApi;globalThis.ui=oldUi;}
 assert.equal(region.flags[S].spellZone.wall.sections[0].hp,30);
 const damage={type:'damageSpellWall',messageId:message.id,index:0,damage:10};
 assert.equal((await resolveSpellZoneRequest({...damage,userId:owner.id})).status,'unavailable');
 assert.equal((await resolveSpellZoneRequest({...damage,userId:gm.id})).hp,20);
 assert.equal(scene.walls.size,7);
 assert.equal((await resolveSpellZoneRequest({...damage,userId:gm.id,damage:20})).hp,0);
 assert.equal([...scene.drawings.values()][0].text,'1 m');
 assert.equal(scene.walls.size,6);
 assert.ok([...scene.walls.values()].every(wall=>wall.sight===0));
 assert.equal((await resolveSpellZoneRequest({...damage,index:1,userId:gm.id,damage:30})).hp,0);
 assert.equal(scene.walls.size,4);
 assert.equal(region.shapes.length,1);
 assert.equal(region.shapes[0].x,250);
 game.time.worldTime=1800;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
 assert.equal(scene.walls.size,0);
 assert.equal(scene.drawings.size,0);
 assert.equal(spellWallCardState(message).finished,true);
});
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
 const [shadow]=scene.lights.values();
 assert.equal(shadow.config.negative,true);
 assert.ok(shadow.config.bright >= Math.hypot(rectangle.width,rectangle.height)/200);
 const footprint=shadow.flags[S].spellZoneLight.darkness.boundary;
 assert.equal(footprint.length,8);
 const area=Math.abs(footprint.reduce((sum,v,i)=>i%2?sum:sum+v*footprint[(i+3)%8]-footprint[(i+2)%8]*footprint[i+1],0))/2;
 assert.ok(Math.abs(area-rectangle.width*rectangle.height)<.001);
 assert.equal(darknessCombatRow(target).value,-3);
 assert.equal(game.messages.size,1);
 region.tokens.delete(scene.tokens.get('target'));
 await reconcileSpellZone(region,{exclude:new Set([scene.tokens.get('target').uuid])});
 assert.equal(darknessCombatRow(target),null);
 game.combat.round=4;
 await reconcileSpellZone(region);
 assert.equal(regions.size,0);
 assert.equal(darknessCombatRow(caster),null);
 assert.equal(scene.lights.size,0);
});

test('Jorn darkness replaces legacy dimming and keeps its source on the region’s scene level',async()=>{
 const payload=setup(jorn+'night-curtain:3');
 await createSpellZoneOnAuthority({...payload,shape:{type:'circle',...payload.point,radius:300}});
 const [region]=regions.values();
 const [light]=scene.lights.values();
 assert.equal(light.config.bright,3);
 assert.equal(light.flags[S].spellZoneLight.darkness.boundary,null);
 region.behaviors.push({id:'legacy',name:region.name,type:'adjustDarknessLevel',system:{mode:0,modifier:1}});
 region.behaviors.push({id:'custom',name:'Other lighting',type:'adjustDarknessLevel',system:{mode:0,modifier:1}});
 region.deleteEmbeddedDocuments=async(type,ids)=>{
  assert.equal(type,'RegionBehavior');
  assert.deepEqual(ids,['legacy']);
  region.behaviors=region.behaviors.filter(b=>!ids.includes(b.id));
 };
 region.levels=new Set(['upper-floor']);
 await reconcileSpellZone(region);
 assert.deepEqual(light.levels,['upper-floor']);
 assert.ok(region.behaviors.some(b=>b.id==='custom'));
 await region.delete();
 await reconcileSpellZone(region,{removed:true});
 assert.equal(scene.lights.size,0);
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
 caster.system.senses=[{type:'perfect'}];
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

test('the range projection clips diagonally and uses the scene’s metres conversion',()=>{
 const limit={origin:{x:50,y:50},range:5,scale:100};
 const result=spellZoneRange(limit,{x:770,y:1010});
 assert.deepEqual(result,{end:{x:350,y:450},distance:12,inRange:false});
 assert.equal(spellZoneRange(limit,{x:350,y:450}).inRange,true);
 const scale=zonePixelScale({grid:{size:100,distance:5,units:'ft'}});
 assert.equal(spellZoneRange({...limit,scale},{x:50+scale*6,y:50}).inRange,false);
});

test('the native range guide uses upgraded casting range, blocks invalid clicks and is cleaned up on cancel',async()=>{
 setup(quagmire,{[quagmire+':2']:1});
 const saved={canvas:globalThis.canvas,PIXI:globalThis.PIXI,ui:globalThis.ui,off:Hooks.off};
 const token=scene.tokens.get('caster'),objects=[];
 let warnings=0;
 globalThis.ui={notifications:{warn:()=>warnings++}};
 Hooks.off=name=>hooks.delete(name);
 class PreviewObject {
  position={set:(x,y)=>{this.x=x;this.y=y;}};
  anchor={set:()=>{}};
  scale={set:()=>{}};
  destroy(){this.destroyed=true;}
 }
 globalThis.PIXI={Graphics:class extends PreviewObject {
  clear(){this.colors=[];}
  lineStyle(_width,color){this.colors.push(color);}
  moveTo(){}
  lineTo(){}
 },Text:PreviewObject};
 globalThis.canvas={scene,stage:{scale:{x:1}},tokens:{controlled:[token]},interface:{addChild:(...children)=>objects.push(...children)},regions:{
  getSnappedPoint:()=>({x:1650,y:50}),
  async placeRegion(_data, options){
   const [line,label]=objects;
   const out={x:1850,y:50},inside={x:1450,y:50};
   options.onMove({position:out,snap:false});
   assert.match(label.text,/18 \/ 15 m/);
   assert.equal(label.x,1550);
   assert.equal(line.colors.at(-1),0x733b2d);
   assert.equal(options.preConfirm({shape:{x:1550,y:50}}),false,'a snap back into range does not validate an out-of-range click');
   options.onMove({position:inside,snap:true});
   assert.equal(line.colors.at(-1),0x733b2d);
   assert.equal(options.preConfirm({shape:{x:1650,y:50}}),false,'the actual shape must also be in range');
   options.onMove({position:inside,snap:false});
   assert.match(label.text,/14 \/ 15 m/);
   assert.equal(line.colors.at(-1),0xf4ecd9);
   assert.equal(options.preConfirm({shape:inside}),true);
   return null;
  }
 }};
 try{
  assert.equal(await placeSpellZone(message),null);
  assert.equal(warnings,2);
  assert.ok(objects.every(object=>object.destroyed));
  assert.equal(hooks.has('canvasPan'),false);
  assert.equal(regions.size,0);

  const fogId='vitner-wind-craft:fog:2';
  const payload=setup(fogId,{[fogId+':1']:1});
  await createSpellZoneOnAuthority({...payload,point:{x:250,y:50}});
  game.combat.round++;
  objects.length=0;
  canvas.scene=scene;
  canvas.tokens.controlled=[scene.tokens.get('caster')];
  canvas.regions.placeRegion=async(_data,options)=>{
   const outside={x:850,y:50},limit={x:750,y:50};
   options.onMove({position:outside});
   assert.match(objects[1].text,/6 \/ 5 m/);
   assert.equal(objects[1].x,750,'movement starts from the current fog centre');
   assert.equal(options.preConfirm({shape:outside}),false);
   options.onMove({position:limit});
   assert.equal(options.preConfirm({shape:limit}),true);
   return {shapes:[limit]};
  };
  assert.equal((await placeSpellZone(message)).status,'placed');
  assert.equal([...regions.values()][0].shapes[0].x,750);
  assert.ok(objects.every(object=>object.destroyed));
 }finally{
  globalThis.canvas=saved.canvas;
  globalThis.PIXI=saved.PIXI;
  globalThis.ui=saved.ui;
  Hooks.off=saved.off;
 }
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
 const protection={flags:{[S]:{auraRecipient:{weather:{kind:'journey',temperature:0}}}}};
 actor.effects=[protection];
 assert.equal(resolveWeaponRange({item,actor}).long.value,43);
 protection.disabled=true;
 assert.equal(resolveWeaponRange({item,actor}).long.value,10);
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
test('instant fire includes flying creatures and applies their damage once on confirmation',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.statuses.add('fly');assert.equal((await createSpellZoneOnAuthority(p)).status,'placed');assert.equal(target.system.resources.body.value,20);assert.equal(regions.size,1);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.equal((prompt.content.match(/data-action="apply-spell-zone"/g)??[]).length,1);assert.doesNotMatch(prompt.content,/spell-zone-test/);assert.equal((await applyInstant(prompt,observer)).status,'unavailable');assert.equal((await applyInstant(prompt)).status,'applied');assert.equal((await applyInstant(prompt)).status,'alreadyApplied');assert.equal(target.system.resources.body.value,16);assert.equal(caster.system.resources.body.value,16);assert.equal(regions.size,0);const cards=[...game.messages.values()].filter(m=>m.flags?.[S]?.persistentDamageEvent);assert.equal(cards.length,0);assert.equal(target.getFlag(S,'zoneDamage')[prompt.id].pulse0.amount,4);assert.equal((await createSpellZoneOnAuthority(p)).reason,'CastingFinished');}
 finally{globalThis.Roll=old;}
});
test('fire can await an Evade decision, records a success and never consumes it twice',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:1}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);assert.equal(regions.size,1);assert.equal(target.system.resources.body.value,20);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);await applyInstant(prompt);assert.match(prompt.content,/data-zone-choice="evade"/);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(target.system.resources.body.value,20);assert.match(prompt.content,/Flammes évitées/);assert.equal(regions.size,0);}
 finally{globalThis.Roll=old;}
});
test('accepting fire applies damage once; cancellation leaves the decision available',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async()=>null;await createSpellZoneOnAuthority(p);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);await applyInstant(prompt);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'cancelled');assert.equal(target.system.resources.body.value,20);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'accept')).status,'resolved');assert.equal(target.system.resources.body.value,16);assert.equal(regions.size,0);}
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
 try{const p=setup(burst,{[burst+':2']:4});target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:20}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0];assert.equal(r.flags[S].spellZone.profile.openRoll,8);assert.equal(r.flags[S].spellZone.profile.damageFormula,'1d10 + 1');const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);await applyInstant(prompt);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(target.system.resources.body.value,15);assert.equal(regions.size,0);}
 finally{globalThis.Roll=old;}
});

test('an Evade roll can finish inside the only area card, after its marker is removed',async()=>{
 const old=globalThis.Roll;
 globalThis.Roll=class{
  static fromData(data){return data;}
  constructor(formula){this.formula=formula;}
  async evaluate(){this.total=4;}
 };
 try{
  const cast=setup(burst);
  target.findRuleKnowledge=()=>({system:{level:1}});
  target.rollAbility=async(_item,options)=>{
   const rolled={formula:"1d20",total:1};
   const publication=await options.publishMessage({rolls:[{toJSON:()=>rolled}]},{target:10});
   assert.equal(publication.message,prompt);
   return {messageId:prompt.id};
  };
  await createSpellZoneOnAuthority(cast);
  const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);
  const count=game.messages.size;
  assert.equal((await applyInstant(prompt)).status,"applied");
  assert.match(prompt.content,/<a href="#" class="trait-situation-token damage-target-name"[^>]*>target<\/a>/);
  assert.match(prompt.content,/class="zone-target-action" title="Esquiver" aria-label="Esquiver"[^>]*><i class="fas fa-dice-d20" aria-hidden="true"><\/i><\/button>/);
  assert.equal(regions.size,0);
  assert.equal((await requestSpellZoneTest(prompt,target.uuid,"evade")).status,"resolved");
  assert.match(prompt.content,/zone-outcome success[^>]*>Flammes évitées/);
  assert.equal(game.messages.size,count);
  assert.equal(target.system.resources.body.value,20);
 }finally{globalThis.Roll=old;}
});

test('a used casting reports why placement is unavailable before starting another preview',async()=>{
 const p=setup(vitner,{[vitner+':3']:1});await createSpellZoneOnAuthority(p);const oldCanvas=globalThis.canvas,oldUi=globalThis.ui;const warnings=[];let previews=0;globalThis.ui={notifications:{warn:message=>warnings.push(message)}};const token=scene.tokens.get('caster');caster.getActiveTokens=()=>[token];globalThis.canvas={scene,tokens:{controlled:[token]},regions:{placeRegion:async()=>{previews++;throw Error('Preview should not start');}}};
 try{assert.equal((await placeSpellZone(message)).reason,'AlreadyPlaced');assert.match(warnings.at(-1),/déjà placée/);game.combat.round=3;await reconcileSpellZone([...regions.values()][0]);assert.equal((await placeSpellZone(message)).reason,'CastingFinished');assert.match(warnings.at(-1),/Relancez le sort/);assert.equal(previews,0);assert.equal(regions.size,0);assert.equal((await createSpellZoneOnAuthority(p)).reason,'CastingFinished');}
 finally{globalThis.canvas=oldCanvas;globalThis.ui=oldUi;}
});
test('an extended fire cast reports the next-round restriction and remains movable next round',async()=>{
 const p=setup(burst,{[burst+':3']:2});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);assert.equal((await createSpellZoneOnAuthority(p)).reason,'MoveNextRound');game.combat.round=2;assert.equal((await createSpellZoneOnAuthority({...p,point:{x:250,y:50}})).status,'placed');
});
test('fresh native containment finds victims even when Region.tokens is initially empty',async()=>{
 const p=setup(burst);let checks=0;for(const token of scene.tokens.values())token.testInsideRegion=r=>{checks++;assert.ok(r.shapes[0].radius>0);return token.id==='target';};target.findRuleKnowledge=()=>({system:{level:1}});const create=scene.createEmbeddedDocuments;scene.createEmbeddedDocuments=async(...args)=>{const rows=await create(...args);if(args[0]==='Region')rows[0].tokens.clear();return rows;};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.ok(checks>=2);assert.deepEqual(prompt.flags[S].spellZoneTest.recipients.map(r=>r.actorUuid),[target.uuid]);assert.match(prompt.content,/apply-spell-zone/);assert.doesNotMatch(prompt.content,/Esquiver/);assert.equal(target.system.resources.body.value,20);assert.equal(r.flags[S].spellZone.initialTokens.length,1);
});
test('pending Evade and the instant zone survive movement, later rounds and elapsed time',async()=>{
 const p=setup(burst);caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});target.rollAbility=async(item,context)=>{const proof=await ChatMessage.create({rolls:[{formula:'1d20',total:1}],flags:{[S]:context.resolveProcedure({target:10}).flags},content:'<article></article>'});return {messageId:proof.id};};await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);r.tokens.clear();scene.tokens.get('target').x=5000;game.combat.round=3;game.time.worldTime=100;await reconcileSpellZone(r);assert.equal([...game.messages.values()].filter(m=>m.flags?.[S]?.spellZoneTest).length,1);assert.equal(regions.size,1);await applyInstant(prompt);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'evade')).status,'resolved');assert.equal(regions.size,0);assert.equal(target.system.resources.body.value,20);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'accept')).status,'alreadyRolled');
});
test('initial victims without Evade confirm their damage; late entrants are excluded',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);for(const token of scene.tokens.values())token.testInsideRegion=()=>token.id==='target';const create=scene.createEmbeddedDocuments;scene.createEmbeddedDocuments=async(...args)=>{const rows=await create(...args);if(args[0]==='Region')rows[0].tokens.clear();return rows;};await createSpellZoneOnAuthority(p);assert.equal(target.system.resources.body.value,20);const r=[...regions.values()][0];scene.tokens.get('caster').testInsideRegion=()=>true;await reconcileSpellZone(r,{entering:scene.tokens.get('caster')});const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);assert.equal((await applyInstant(prompt)).status,'applied');assert.equal(regions.size,0);assert.equal(caster.system.resources.body.value,20);assert.equal(target.system.resources.body.value,16);}
 finally{globalThis.Roll=old;}
});

test('fire light shares the actual circle centre/radius and elevation, with orange flame animation',async()=>{
 const p=setup(burst,{[burst+':1']:2,[burst+':3']:1});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});scene.tokens.get('caster').elevation=7;await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],light=[...scene.lights.values()][0];assert.equal(scene.lights.size,1);assert.equal(light.x,r.shapes[0].x);assert.equal(light.y,r.shapes[0].y);assert.equal(light.config.bright,1.5);assert.equal(light.config.dim,0);assert.equal(light.elevation,7);assert.equal(light.config.color,'#ffb347');assert.equal(light.config.alpha,0.1);assert.equal(light.config.animation.type,'flame');assert.equal(light.flags[S].spellZoneLight.regionUuid,r.uuid);await Promise.all([reconcileSpellZone(r),reconcileSpellZone(r)]);assert.equal(scene.lights.size,1);
});
test('moving extended fire updates the same light, and expiry removes it with the region',async()=>{
 const p=setup(burst,{[burst+':3']:1});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);const r=[...regions.values()][0],light=[...scene.lights.values()][0];game.combat.round=2;await createSpellZoneOnAuthority({...p,point:{x:350,y:50}});assert.equal([...scene.lights.values()][0],light);assert.equal(light.x,350);assert.equal(light.y,50);game.combat.round=3;await Promise.all([reconcileSpellZone(r),reconcileSpellZone(r)]);assert.equal(scene.lights.size,0);assert.equal(regions.size,0);
});
test('ending combat does not remove a fire with time left',async()=>{
 const p=setup(burst,{[burst+':3']:2});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);
 const [region]=regions.values(),combat=game.combat;combat.round=2;game.combat=null;
 registerSpellZoneSupport();hooks.get('deleteCombat')(combat);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(region.flags[S].spellZone.until,10);assert.equal(regions.size,1);assert.equal(scene.lights.size,1);
 game.time.worldTime=10;await reconcileSpellZone(region);assert.equal(regions.size,0);assert.equal(scene.lights.size,0);
});
test('instant fire light remains until the area is applied, then Evade remains available',async()=>{
 const old=globalThis.Roll;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};
 try{const p=setup(burst);caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);assert.equal(scene.lights.size,1);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);await applyInstant(prompt);assert.match(prompt.content,/Esquiver/);assert.equal((await requestSpellZoneTest(prompt,target.uuid,'accept')).status,'resolved');assert.equal(scene.lights.size,0);assert.equal((await requestSpellZoneTest(prompt,caster.uuid,'accept')).status,'resolved');assert.equal(scene.lights.size,0);assert.equal(regions.size,0);}
 finally{globalThis.Roll=old;}
});
test('disabled, manually removed and orphaned fire lights are cleaned without touching ordinary lights',async()=>{
 const p=setup(sea,{[sea+':3']:2});caster.findRuleKnowledge=target.findRuleKnowledge=()=>({system:{level:1}});await createSpellZoneOnAuthority(p);const r=[...regions.values()][0];r.behaviors[0].disabled=true;await reconcileSpellZone(r);assert.equal(scene.lights.size,0);r.behaviors[0].disabled=false;await reconcileSpellZone(r);assert.equal(scene.lights.size,1);await r.delete();await reconcileSpellZone(r,{removed:true});assert.equal(scene.lights.size,0);
 const [regular]=await scene.createEmbeddedDocuments('AmbientLight',[{x:0,y:0,config:{bright:2},flags:{}}]);await scene.createEmbeddedDocuments('AmbientLight',[{x:0,y:0,config:{bright:2},flags:{[S]:{spellZoneLight:{regionUuid:r.uuid}}}}]);const {cleanupOrphanSpellZoneLights}=await import('../modules/fire-zones.mjs');await Promise.all([cleanupOrphanSpellZoneLights(scene),cleanupOrphanSpellZoneLights(scene)]);assert.equal(scene.lights.size,1);assert.equal(scene.lights.get(regular.id),regular);
});
test('fire light converts physical circle radius to scene units and ignores unrelated native defaults',async()=>{
 setup();const {spellZoneFireLightData,syncSpellZoneLight}=await import('../modules/fire-zones.mjs');const r={uuid:'Scene.scene.Region.light',parent:scene,shapes:[{type:'circle',x:150,y:250,radius:100}],flags:{[S]:{spellZone:{context:{sourceId:sea},profile:{kind:'fire'}}}}};scene.grid={size:100,distance:5,units:'ft'};assert.equal(spellZoneFireLightData(r).config.bright,5);const light=await syncSpellZoneLight(r);let writes=0;light.config.animation.reverse=false;light.update=async()=>writes++;await syncSpellZoneLight(r);assert.equal(writes,0);assert.equal(scene.lights.size,1);
});
test('lighting errors do not block fire damage or Evade decisions; non-fire zones never create lights',async()=>{
 await createSpellZoneOnAuthority(setup());assert.equal(scene.lights.size,0);const p=setup(burst);const create=scene.createEmbeddedDocuments,oldError=console.error,oldRoll=globalThis.Roll;let errors=0;console.error=()=>errors++;globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=4;}};scene.createEmbeddedDocuments=async(type,data)=>{if(type==='AmbientLight')throw Error('Native light failure');return create(type,data);};
 try{await createSpellZoneOnAuthority(p);assert.equal(errors,1);assert.equal(target.system.resources.body.value,20);const prompt=[...game.messages.values()].find(m=>m.flags?.[S]?.spellZoneTest);await applyInstant(prompt);assert.equal(target.system.resources.body.value,16);assert.equal(regions.size,0);}
 finally{console.error=oldError;globalThis.Roll=oldRoll;}
});
