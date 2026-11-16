import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sacredCapacity,sacredBalance,runeRow,validSacredState,publicSacredTemplates,equipmentCraftMaterial} from '../modules/rules/sacred-objects.mjs';
const S='trudvang-chronicles',heat='holy-thuuldom-heat-of-the-depths:heat-of-the-depths:0',fang='holy-thuuldom-fang-of-yukk:fang-of-yukk:0';
const lang=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url))),docs=new Map(),messages=[];
const get=key=>key.split('.').reduce((v,k)=>v?.[k],lang)??key;
let dialogChoice=false,rollTotal=6;
globalThis.foundry={applications:{api:{DialogV2:class{static async wait(){return dialogChoice;}static async confirm(){return dialogChoice;}}},handlebars:{renderTemplate:async()=>'<article>Roll</article>'}},utils:{fromUuid:async id=>docs.get(id)}};
globalThis.document={createElement:()=>({set textContent(v){this.innerHTML=String(v);}})};
globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){this.total=rollTotal;return this;}};
globalThis.ChatMessage={getSpeaker:()=>({}),create:async data=>{const message={...data,id:crypto.randomUUID(),async update(){}};messages.push(message);return message;}};
globalThis.ui={notifications:{warn:()=>{}}};
const {refreshDailySacredObjects,requestSacredMutation,sacredCraftData,craftingBreakdown,activateSacredRune,removeSacredObject,restoreSacredObjects,sacredObjectViews}=await import('../modules/sacred-objects.mjs');
class Collection extends Map{[Symbol.iterator](){return this.values();}}
function fixture({total=30,rank=3}={}){
 docs.clear();messages.length=0;dialogChoice=false;rollTotal=6;
 const gm={id:'gm',isGM:true},user={id:'owner'},users=new Map([[gm.id,gm],[user.id,user]]);users.activeGM={isSelf:true};
 globalThis.game={user:gm,users,items:[],time:{worldTime:0},i18n:{lang:'fr',localize:get,format:(k,d)=>get(k).replace(/\{(\w+)\}/g,(_,k)=>d[k])}};
 const levels={invoke:rank,thuulForging:rank,handicraft:rank,hardMaterials:rank,softMaterials:1};
 const actor={documentName:'Actor',uuid:'Actor.thuul',type:'character',name:'Thuul',isOwner:true,items:new Collection(),effects:[],system:{resources:{divinity:{max:total,value:total}},modifiers:{}},findRuleKnowledge:id=>({name:get('TRUDVANG.Knowledge.'+id),system:{catalogId:id,level:levels[id]??0,parentSkill:['hardMaterials','softMaterials'].includes(id)?'care':'faith',parentDiscipline:['hardMaterials','softMaterials'].includes(id)?'handicraft':'invoke',kind:'specialty',rollBonus:2}}),getAbilityBreakdown:item=>({base:10+(item.system.parentSkill==='care'?levels.handicraft:levels.invoke)+2*item.system.level,modifierRows:[{label:'Effet',value:-1}]}),canPerformAction:()=>true,canUserModify:()=>true};
 actor.createEmbeddedDocuments=async(_kind,data)=>data.map(d=>{
  const item={...structuredClone(d),documentName:'Item',id:crypto.randomUUID(),isOwner:true,parent:actor,canUserModify:()=>true,effects:[],async update(change){if(change['system.sacred'])this.system.sacred=structuredClone(change['system.sacred']);},async delete(){actor.items.delete(this.id);docs.delete(this.uuid);}};item.uuid=actor.uuid+'.Item.'+item.id;actor.items.set(item.id,item);docs.set(item.uuid,item);return item;
 });
 actor.updateEmbeddedDocuments=async(_kind,changes)=>{for(const change of changes)await actor.items.get(change._id).update(change);};
 docs.set(actor.uuid,actor);return {actor,levels};
}
async function object(actor){const {itemId}=await requestSacredMutation(actor,'create',{type:'weapon',material:'hardMaterials',name:'Marteau',subtype:'oneHandedLightWeapons'});return actor.items.get(itemId);}
function learn(actor,id=heat,level=3){actor.items.set('tablet-'+id,{type:'tablet',id:'tablet-'+id,system:{catalogId:id.split(':')[0],level}});actor.items.set('power-'+id,{type:'divineFeat',name:get('TRUDVANG.Content.Power.'+id+'.Name'),system:{isRune:true,catalogId:id,tabletId:id.split(':')[0]}});}
async function inscription(actor,item,id=heat,level=2,amount=4,success=true){learn(actor,id,3);return requestSacredMutation(actor,'inscribe',{itemId:item.id,sourceId:id,level,amount,success});}

test('capacity follows p283 separately for soft and hard materials, to a maximum of 30 at rank five',()=>{
 const {actor,levels}=fixture();assert.equal(sacredCapacity(actor,'hardMaterials'),18);assert.equal(sacredCapacity(actor,'softMaterials'),14);
 for(const key of Object.keys(levels))levels[key]=5;assert.equal(sacredCapacity(actor,'hardMaterials'),30);
});
test('all starter equipment has an explicit classification and catalogued exceptions retain their soft-material craft',()=>{
 fixture();const starter=JSON.parse(fs.readFileSync(new URL('../data/starter-content.json',import.meta.url)));
 for(const item of starter.items.filter(i=>['weapon','armor','shield','gear'].includes(i.type)))assert.ok(['hardMaterials','softMaterials'].includes(item.system.craftMaterial),item.nameKey);
 assert.equal(equipmentCraftMaterial({system:{material:'leather'}}),'softMaterials');assert.equal(equipmentCraftMaterial({system:{material:'wood'}}),'hardMaterials');
 assert.equal(equipmentCraftMaterial({system:{},flags:{[S]:{starterId:'TRUDVANG.Content.Item.Slingu'}}}),'softMaterials');
});
test('only player-visible starter world equipment can be copied, even for the GM',()=>{
 fixture();const publicItem={type:'weapon',uuid:'Item.public',system:{},flags:{[S]:{starterId:'starter'}},ownership:{default:2}};
 assert.deepEqual(publicSacredTemplates([publicItem,{...publicItem,ownership:{default:0}},{...publicItem,flags:{}},{...publicItem,folder:{flags:{[S]:{starterId:'gmItems'}}}},{...publicItem,inCompendium:true}]),[publicItem]);
});
test('crafting uses only the Thuul specialty bonus, keeps ordinary modifiers and applies intrinsic quality once',()=>{
 const {actor}=fixture(),p=craftingBreakdown(actor,'hardMaterials',{tools:-3,modifier:2});assert.equal(p.base,19);assert.equal(p.target,23);assert.equal(p.rows.find(r=>r.label===get('TRUDVANG.Knowledge.thuulForging')).value,6);
 const template={type:'weapon',uuid:'Item.sword',name:'Sword',system:{quality:2,combatPointBonus:0,breach:{value:50,max:50},value:10},toObject(){return {type:this.type,name:this.name,system:structuredClone(this.system)};}};
 const data=sacredCraftData(actor,{type:'weapon',templateUuid:template.uuid,material:'hardMaterials'},[template]);assert.equal(data.system.quality,3);assert.equal(data.system.combatPointBonus,1);assert.equal(data.system.value,20);assert.equal(data.system.magical,true);assert.equal(data.system.sacred.creatorUuid,actor.uuid);
 assert.throws(()=>sacredCraftData(actor,{type:'weapon',material:'hardMaterials',templateUuid:'Item.hidden'},[template]));
});
test('investments serialize across objects, cannot create points and do not draw from temporary DP',async()=>{
 const {actor}=fixture({total:20});actor.system.resources.divinity.temporary=100;const one=await object(actor),two=await object(actor);
 const attempts=await Promise.allSettled([requestSacredMutation(actor,'invest',{itemId:one.id,amount:12}),requestSacredMutation(actor,'invest',{itemId:two.id,amount:12})]);
 assert.equal(attempts.filter(r=>r.status==='fulfilled').length,1);assert.deepEqual(sacredBalance(actor),{total:20,invested:12,free:8,overdrawn:0});assert.equal(actor.system.resources.divinity.temporary,100);
 await assert.rejects(requestSacredMutation(actor,'invest',{itemId:one.id,amount:7}));assert.equal(sacredBalance(actor).invested,12);
});
test('a rune uses only its own assigned reserve, with the daily cap and investment cap both enforced',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:12});await inscription(actor,item,heat,2,6);
 const row=item.system.sacred.runes[0];assert.equal(runeRow(row).max,2);
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id});await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id});
 assert.equal(item.system.sacred.current,8);assert.equal(item.system.sacred.runes[0].current,2);assert.equal(runeRow(item.system.sacred.runes[0]).remaining,0);
 await assert.rejects(requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id}));assert.equal(sacredBalance(actor).free,18);assert.ok(validSacredState(item.system.sacred));
 await restoreSacredObjects(actor);assert.equal(item.system.sacred.current,12);assert.equal(runeRow(item.system.sacred.runes[0]).remaining,2);assert.equal(sacredBalance(actor).free,18);
});
test('points added to an already inscribed rune increase its reserve without losing expenditure',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:4});await inscription(actor,item);const id=item.system.sacred.runes[0].id;
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:id});await requestSacredMutation(actor,'invest',{itemId:item.id,amount:2,runeId:id});
 assert.equal(item.system.sacred.invested,6);assert.equal(item.system.sacred.current,4);assert.equal(item.system.sacred.runes[0].current,4);assert.equal(sacredBalance(actor).free,24);
});
test('failed inscriptions keep existing runes and prohibit retrying that or a higher level on the same object',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item,heat,1,2);
 await inscription(actor,item,heat,2,1,false);assert.equal(item.system.sacred.runes[0].level,1);assert.equal(item.system.sacred.current,6);
 await assert.rejects(inscription(actor,item,heat,2,1));await assert.rejects(inscription(actor,item,heat,3,1));
});
test('permanent runes have no activation button or spend action',()=>{
 fixture();const row=runeRow({sourceId:fang,level:3,invested:3,current:3,uses:0});assert.equal(row.permanent,true);assert.equal(row.canUse,false);assert.equal(row.max,null);
});
test('cancelled activation or removal has no side effects; confirmed removal reclaims the full investment, including spent charges',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item);const row=item.system.sacred.runes[0];
 assert.equal(await activateSacredRune(item,row.id),null);assert.equal(item.system.sacred.current,6);assert.equal(messages.length,0);
 assert.equal(await removeSacredObject(item),null);assert.ok(actor.items.has(item.id));
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id});dialogChoice=true;await removeSacredObject(item);assert.equal(sacredBalance(actor).free,30);assert.ok(!actor.items.has(item.id));
});
test('actual activation publishes a rune roll and its fixed rank while spending only object points',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item);dialogChoice={modifier:3};
 const result=await activateSacredRune(item,item.system.sacred.runes[0].id);assert.ok(result.success);assert.equal(messages.length,1);assert.equal(messages[0].flags[S].ruleTestContext.runeLevel,2);assert.equal(messages[0].flags[S].ruleTestContext.runeObjectUuid,item.uuid);assert.equal(messages[0].flags[S].ruleTestContext.kind,'rune');assert.equal(item.system.sacred.current,4);assert.equal(sacredBalance(actor).free,24);
});
test('the two actor templates and equipment sheet expose the compact sacred sections without embedding editable accounting fields',()=>{
 for(const p of ['character','npc']){const h=fs.readFileSync(new URL('../templates/actor/'+p+'-sheet.hbs',import.meta.url),'utf8');assert.match(h,/sacred-objects-panel/);assert.match(h,/sacred-create/);assert.match(h,/sacred-remove/);}
 const h=fs.readFileSync(new URL('../templates/item/item-sheet.hbs',import.meta.url),'utf8');assert.match(h,/data-tab="runes"/);assert.match(h,/sacred-inscribe/);assert.match(h,/sacred-activate/);assert.doesNotMatch(h,/name="system\.sacred/);
});


test('Main de Borjorn is persistent with two daily uses and a compulsory, single-use Skill Roll bonus',async()=>{
 const id='holy-thuuldom-borjorn-s-hand:borjorn-s-hand:0';
 const {POWER_DETAILS_BY_ID}=await import('../modules/power-catalog-data.mjs');const {conditionalChoices,blessingDialog}=await import('../modules/blessing-dialog.mjs');const {rollUnder}=await import('../modules/dice.mjs');
 const {actor}=fixture();assert.equal(POWER_DETAILS_BY_ID[id].spellType,'lasting');assert.equal(runeRow({sourceId:id,level:3,invested:9,current:9,uses:0}).max,2);
 const effect={id:'once',name:'Main de Borjorn',flags:{[S]:{transformation:{key:id+'#effect',sourceId:id,ruleTestContext:{runeLevel:3}}}},async delete(){actor.effects=[];}};actor.effects=[effect];
 const rows=conditionalChoices(actor);assert.equal(rows.length,1);assert.equal(rows[0].fixed,true);assert.equal(rows[0].value,3);assert.equal(rows[0].consumeEffectId,'once');
 class Base{static async wait(config){return config.buttons[0].callback(null,null,{element:{querySelector:()=>null}});}}
 const result=await blessingDialog(Base,actor).wait({buttons:[{action:'roll',callback:()=>({modifier:0})}]});assert.equal(result.modifier,3);assert.deepEqual(result.blessing.consumeEffectIds,['once']);
 const trait=await blessingDialog(Base,actor,'trait').wait({buttons:[{action:'roll',callback:()=>({mode:'situation',situationValue:10})}]});assert.equal(trait.blessing,undefined);
 await rollUnder({actor,label:'Attack',kind:'attack',target:15,blessing:result.blessing});assert.equal(actor.effects.length,0);assert.equal(messages.length,1);
});
test('calendar recovery is idempotent and leaves the creator’s free divinity unchanged',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item);const id=item.system.sacred.runes[0].id;
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:id});game.actors=[actor];game.scenes=[];game.time.worldTime=86400;
 await Promise.all([refreshDailySacredObjects(86400),refreshDailySacredObjects(86400)]);assert.equal(item.system.sacred.current,6);
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:id});await refreshDailySacredObjects(86400);assert.equal(item.system.sacred.current,4);assert.equal(sacredBalance(actor).free,24);
});

test('only an owner of the creator can mutate a sacred object, and a changed rune cannot be spent from a stale dialog',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item);const row=item.system.sacred.runes[0],before=JSON.stringify(row);
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id,expected:before});
 await assert.rejects(requestSacredMutation(actor,'consume',{itemId:item.id,runeId:row.id,expected:before}));assert.equal(item.system.sacred.current,4);
 actor.canUserModify=()=>false;await assert.rejects(requestSacredMutation(actor,'invest',{itemId:item.id,amount:1}));assert.equal(item.system.sacred.invested,6);
});


test('a rune roll of 1 is an ordinary success and 20 spends charges and offers the divine critical-failure table',async()=>{
 const {actor}=fixture(),item=await object(actor);await requestSacredMutation(actor,'invest',{itemId:item.id,amount:6});await inscription(actor,item);const id=item.system.sacred.runes[0].id;dialogChoice={modifier:0};rollTotal=1;
 const one=await activateSacredRune(item,id);assert.equal(one.success,true);assert.equal(one.critical,'');
 rollTotal=20;const twenty=await activateSacredRune(item,id);assert.equal(twenty.success,false);assert.equal(twenty.critical,'failure');assert.equal(item.system.sacred.current,2);
});
