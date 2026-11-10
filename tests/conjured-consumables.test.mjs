import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o),set=(o,p,v)=>{const keys=p.split('.'),last=keys.pop();keys.reduce((v,k)=>v[k]??={},o)[last]=v;};
const lang=JSON.parse(fs.readFileSync(new URL('../lang/fr.json',import.meta.url))),messages=[],formulas=[];
globalThis.foundry={applications:{handlebars:{renderTemplate:async()=>''}},utils:{deepClone:structuredClone},documents:{ActiveEffect:{implementation:{getEffectStart:()=>({time:game.time.worldTime})}}}};
globalThis.document={createElement:()=>({set textContent(value){this.value=String(value);},get innerHTML(){return this.value;}})};
globalThis.game={user:{id:'owner'},time:{worldTime:0},i18n:{localize:key=>get(lang,key)??key,format:(key,args)=>(get(lang,key)??key).replace(/\{(\w+)\}/g,(_,k)=>args[k]??'')}};
globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.id}),create:async data=>(messages.push(data),data)};
globalThis.Roll=class{constructor(formula){this.formula=formula;formulas.push(formula);}async evaluate(){this.total=6;return this;}};
globalThis.ui={notifications:{warn:()=>{}}};
const {TRANSFORMATION_TEMPLATES}=await import('../modules/transformation-data.mjs');
const {applyTransformation}=await import('../modules/transformations.mjs');
const {instantConsequenceOperation,createConjuredConsumable,activeConjuredConsumable,countConjuredConsumables}=await import('../modules/conjured-consumables.mjs');
const {consumeInventoryItem}=await import('../modules/consumables.mjs');
const id='holy-haminges-power-of-men:remedial-potion:4',key=id+'#brew',template=TRANSFORMATION_TEMPLATES[key];
let serial=0;
function actor(){
 game.time.worldTime=0;messages.length=0;formulas.length=0;
 const a={id:'a'+serial++,uuid:'Actor.a'+serial,name:'A',documentName:'Actor',type:'character',isOwner:true,items:[],effects:[],canUserModify:()=>true,system:{modifiers:{},resources:{body:{value:10,current:10,max:30}}},allApplicableEffects(){return this.effects;}};
 a._source={system:structuredClone(a.system)};
 a.update=async data=>{for(const [path,value] of Object.entries(data)){set(a,path,value);set(a._source,path,value);if(path==='system.resources.body.value')a.system.resources.body.current=value;}};
 a.createEmbeddedDocuments=async(type,rows)=>{assert.equal(type,'Item');return rows.map(data=>{const item={...structuredClone(data),id:'p'+serial++,documentName:'Item',parent:a,actor:a};item.uuid=a.uuid+'.Item.'+item.id;item.effects=item.effects.map((effect,index)=>({...effect,uuid:item.uuid+'.ActiveEffect.'+index,parent:item,async delete(){item.effects=item.effects.filter(row=>row!==this);}}));a.items.push(item);return item;});};
 a.deleteEmbeddedDocuments=async(type,ids)=>{assert.equal(type,'Item');a.items=a.items.filter(item=>!ids.includes(item.id));};
 a.updateEmbeddedDocuments=async(type,updates)=>{assert.equal(type,'Item');for(const row of updates)for(const [path,value] of Object.entries(row))if(path!=='_id')set(a.items.find(item=>item.id===row._id),path,value);};
 return a;
}

test('preparing the potion creates a separate consumable without healing or rolling; drinking applies the actual healing once',async()=>{
 const a=actor();
 await applyTransformation(a,key,{skipDialog:true});
 assert.equal(a.items.length,1);assert.equal(a.effects.length,0);assert.equal(a.system.resources.body.current,10);assert.deepEqual(formulas,[]);
 const item=a.items[0];assert.equal(item.type,'gear');assert.equal(item.system.consumable,true);assert.deepEqual(item.effects[0].duration,{value:1,units:'days'});assert.match(messages[0].content,/créée/);
 await consumeInventoryItem(item,a);assert.equal(a.system.resources.body.current,16);assert.equal(a.items.length,0);assert.deepEqual(formulas,['1d10+1']);assert.equal(messages.at(-1).rolls.length,1);
 assert.equal(await consumeInventoryItem(item,a),null);assert.equal(a.system.resources.body.current,16);
});

test('each potion freezes its own duration and capacity improvements, with a hard limit of four',async()=>{
 const a=actor(),make=counts=>createConjuredConsumable(a,instantConsequenceOperation(template,counts));
 const first=await make([]);game.time.worldTime=5;
 const second=await make([2]);assert.equal(first.effects[0].duration.value,1);assert.equal(second.effects[0].duration.value,3);
 await assert.rejects(()=>make([]),error=>error.code==='consumable-capacity');
 await make([0,1]);assert.equal(a.items.length,3);await assert.rejects(()=>make([0,1]),error=>error.code==='consumable-capacity');
 await make([0,99]);assert.equal(a.items.length,4);await assert.rejects(()=>make([0,99]),error=>error.code==='consumable-capacity');
});

test('expired or dispelled potions remain inert even before native cleanup and no longer occupy active inventory slots',async()=>{
 const a=actor(),op=instantConsequenceOperation(template,[]),first=await createConjuredConsumable(a,op),second=await createConjuredConsumable(a,op);
 game.time.worldTime=86400;assert.equal(activeConjuredConsumable(first),null);assert.equal(countConjuredConsumables(a,id),0);
 await consumeInventoryItem(first,a);assert.equal(a.system.resources.body.current,10);assert.deepEqual(formulas,[]);assert.match(messages.at(-1).content,/aucun soin/);
 second.effects=[];await consumeInventoryItem(second,a);assert.equal(a.system.resources.body.current,10);
 await createConjuredConsumable(a,op);assert.equal(countConjuredConsumables(a,id),1);
});

test('transfer keeps the original expiry and heals the recipient, while the active limit remains attached to the creator',async t=>{
 const previous=game.actors;t.after(()=>{game.actors=previous;});
 const creator=actor(),recipient=actor(),item=await createConjuredConsumable(creator,instantConsequenceOperation(template,[]));
 creator.items=[];recipient.items=[item];item.parent=item.actor=recipient;
 game.actors=[creator,recipient];game.time.worldTime=10;assert.ok(activeConjuredConsumable(item));assert.equal(countConjuredConsumables(creator,id),1);assert.equal(countConjuredConsumables(recipient,id),0);
 await consumeInventoryItem(item,recipient);assert.equal(recipient.system.resources.body.current,16);assert.equal(creator.system.resources.body.current,10);
 assert.equal(countConjuredConsumables(creator,id),0);
});

test('simultaneous creations cannot exceed the caster inventory limit and consumption is limited to the recipient maximum',async()=>{
 const a=actor(),op=instantConsequenceOperation(template,[]);
 const results=await Promise.allSettled([createConjuredConsumable(a,op),createConjuredConsumable(a,op),createConjuredConsumable(a,op)]);
 assert.equal(results.filter(row=>row.status==='fulfilled').length,2);assert.equal(a.items.length,2);
 a.system.resources.body.current=a.system.resources.body.value=28;a._source.system.resources.body.value=28;
 await consumeInventoryItem(a.items[0],a);assert.equal(a.system.resources.body.current,30);
});

test('potions given away or left on the ground still prevent new preparations by their creator until consumed or expired',async t=>{
 const previous={actors:game.actors,items:game.items,scenes:game.scenes};t.after(()=>Object.assign(game,previous));
 const creator=actor(),recipient=actor(),other=actor(),op=instantConsequenceOperation(template,[]);
 const first=await createConjuredConsumable(creator,op),second=await createConjuredConsumable(creator,op);
 creator.items=[];recipient.items=[first];first.actor=first.parent=recipient;second.actor=second.parent=null;
 game.actors=[creator,other];game.items=[second];game.scenes=[{tokens:[{actor:recipient},{actor:recipient}]}];
 assert.equal(countConjuredConsumables(creator,id),2);assert.equal(countConjuredConsumables(other,id),0);
 await assert.rejects(()=>createConjuredConsumable(creator,op),error=>error.code==='consumable-capacity');
 await createConjuredConsumable(other,op);assert.equal(countConjuredConsumables(creator,id),2);
 await consumeInventoryItem(first,recipient);assert.equal(countConjuredConsumables(creator,id),1);await createConjuredConsumable(creator,op);assert.equal(countConjuredConsumables(creator,id),2);
 game.time.worldTime=86400;assert.equal(countConjuredConsumables(creator,id),0);
});

test('the GM authorizes one preparation per successful divine casting and rolls back a capacity rejection so it can be retried',async t=>{
 const {applyAllocatedEffectOnGM}=await import('../modules/maintained-spell-tracking.mjs');
 const old={users:game.users,messages:game.messages,fromUuid:foundry.utils.fromUuid};t.after(()=>{game.users=old.users;game.messages=old.messages;foundry.utils.fromUuid=old.fromUuid;});
 const a=actor(),user={id:'owner'},cards=new Map(),docs=new Map([[a.uuid,a]]);
 for(let index=0;index<3;index++){
  const castingId='cast'+index,message={id:'card'+index,flags:{'trudvang-chronicles':{divineAllocation:{castingId,casterUuid:a.uuid,sourceId:id,selected:{[id+':0']:0,[id+':1']:0},targetAllocations:[]}}},async update(data){for(const [key,value] of Object.entries(data))set(this,key,value);}};
  cards.set(message.id,message);
 }
 game.users={activeGM:{isSelf:true},get:()=>user};game.messages={get:key=>cards.get(key)};foundry.utils.fromUuid=async uuid=>docs.get(uuid);
 const apply=index=>applyAllocatedEffectOnGM({casterUuid:a.uuid,castingId:'cast'+index,messageId:'card'+index,targetUuid:a.uuid,userId:'owner',countsById:{},data:{flags:{'trudvang-chronicles':{transformation:{key,ruleTestContext:{kind:'divine',sourceId:id,casterUuid:a.uuid,castingId:'cast'+index}}}}}});
 assert.equal((await apply(0)).status,'ok');assert.equal((await apply(0)).status,'already-applied');assert.equal(a.items.length,1);
 assert.equal((await apply(1)).status,'ok');assert.equal((await apply(2)).status,'consumable-capacity');
 assert.deepEqual(cards.get('card2').flags['trudvang-chronicles'].divineAllocation.targetAllocations,[]);
 await consumeInventoryItem(a.items[0],a);assert.equal((await apply(2)).status,'ok');assert.equal(a.items.length,2);
});

test('the real chat button prepares the potion for its caster without any combat target or controlled token',async t=>{
 const {registerTransformationHooks}=await import('../modules/transformations.mjs');
 const old={users:game.users,messages:game.messages,targets:game.user.targets,fromUuid:foundry.utils.fromUuid,api:foundry.applications.api,hooks:globalThis.Hooks,listener:document.addEventListener};
 t.after(()=>{Object.assign(game,{users:old.users,messages:old.messages});game.user.targets=old.targets;foundry.utils.fromUuid=old.fromUuid;foundry.applications.api=old.api;globalThis.Hooks=old.hooks;document.addEventListener=old.listener;});
 const a=actor(),context={kind:'divine',sourceId:id,casterUuid:a.uuid,castingId:'click-cast',counts:[1,0]},source={uuid:a.uuid+'.Item.power',actor:a,type:'divineFeat',system:{catalogId:id}},handlers={},dialogs=[];
 const message={id:'card',author:{id:'owner'},flags:{'trudvang-chronicles':{ruleTestContext:context,divineAllocation:{...context,selected:{[id+':0']:1,[id+':1']:0},targetAllocations:[]},transformationTargets:{[key]:[]}}},async update(data){for(const [path,value] of Object.entries(data))set(this,path,value);}};
 game.users={activeGM:{isSelf:true},get:()=>({id:'owner'})};game.messages=new Map([['card',message]]);game.user.targets=new Set();
 foundry.utils.fromUuid=async uuid=>uuid===a.uuid?a:uuid===source.uuid?source:null;
 foundry.applications.api={DialogV2:{wait:async config=>(dialogs.push(config),{boost0:1,boost1:0})}};
 globalThis.Hooks={on(){}};document.addEventListener=(type,callback)=>handlers[type]=callback;
 registerTransformationHooks();
 const button={dataset:{transformationKey:key,transformationSource:source.uuid},closest:()=>({dataset:{messageId:'card'}})};
 await handlers.click({target:{closest:()=>button},preventDefault(){},stopPropagation(){}});
 assert.equal(a.items.length,1);assert.equal(a.items[0].effects[0].duration.value,2);assert.equal(dialogs.length,1);assert.equal(button.disabled,false);
});

test('a preparation converted to vitner stays linked while carried or on the ground and ending its maintained spell removes potency',async t=>{
 const {reconcileMaintainedSpell,endMaintainedSpellOnGM}=await import('../modules/maintained-spell-tracking.mjs');
 const old={actors:game.actors,items:game.items,users:game.users,fromUuid:foundry.utils.fromUuid};t.after(()=>{game.actors=old.actors;game.items=old.items;game.users=old.users;foundry.utils.fromUuid=old.fromUuid;});
 const a=actor(),context={kind:'spell',sourceId:id,casterUuid:a.uuid,castingId:'vitner-cast'};
 a.system.activeSpellCastingsMigrated=true;a.system.activeSpellCastings=[{id:context.castingId,itemId:'spell',cost:6,effectUuids:[],effectsApplied:false}];
 const item=await createConjuredConsumable(a,instantConsequenceOperation(template,[],context)),effect=item.effects[0],spell={id:'spell',type:'spell',system:{spellType:'lasting',catalogId:id}};a.items.push(spell);
 game.actors=[a];game.items=[];game.users={activeGM:{isSelf:true},get:()=>({id:'owner'})};foundry.utils.fromUuid=async uuid=>uuid===a.uuid?a:uuid===effect.uuid?effect:null;
 assert.deepEqual(effect.flags['trudvang-chronicles'].transformation.ruleTestContext,context);
 await reconcileMaintainedSpell(a,context.castingId,{effectCreated:true});assert.deepEqual(a.system.activeSpellCastings[0].effectUuids,[effect.uuid]);
 a.items=[spell];item.parent=item.actor=null;item.uuid='Item.ground';effect.uuid='Item.ground.ActiveEffect.potency';game.items=[item];
 await reconcileMaintainedSpell(a,context.castingId,{removed:true});assert.equal(a.system.activeSpellCastings.length,1);assert.deepEqual(a.system.activeSpellCastings[0].effectUuids,[effect.uuid]);
 assert.equal(await endMaintainedSpellOnGM(a.uuid,context.castingId,'owner'),true);assert.equal(a.system.activeSpellCastings.length,0);assert.equal(activeConjuredConsumable(item),null);assert.equal(game.items.length,1);
});

test('shared consumption heals the selected recipient, spends the source stack and rejects other players',async t=>{
 const {consumeSharedItemOnGM,canConsumeSharedItem}=await import('../modules/shared-consumption.mjs');
 const previous={users:game.users,user:game.user,fromUuid:foundry.utils.fromUuid};t.after(()=>{game.users=previous.users;game.user=previous.user;foundry.utils.fromUuid=previous.fromUuid;});
 const noaj=actor(),recipient=actor(),user={id:'noaj',active:true},intruder={id:'intruder',active:true},gm={id:'gm',active:true,isGM:true};
 noaj.canUserModify=u=>u.id===user.id;recipient.canUserModify=()=>false;
 const potion=await createConjuredConsumable(noaj,instantConsequenceOperation(template,[]));potion.system.quantity=2;
 const docs=new Map([[noaj.uuid,noaj],[recipient.uuid,recipient],[potion.uuid,potion]]);
 foundry.utils.fromUuid=async uuid=>docs.get(uuid);
 game.users={activeGM:{isSelf:true},get:id=>[user,intruder,gm].find(u=>u.id===id)};game.user=gm;
 const payload={itemUuid:potion.uuid,targetUuid:recipient.uuid,userId:intruder.id};
 assert.equal(canConsumeSharedItem(potion,intruder),false);assert.equal(canConsumeSharedItem(potion,user),true);
 assert.equal((await consumeSharedItemOnGM(payload)).status,'denied');assert.equal(recipient.system.resources.body.current,10);
 payload.userId=user.id;assert.equal((await consumeSharedItemOnGM(payload)).status,'ok');
 assert.equal(recipient.system.resources.body.current,16);assert.equal(noaj.system.resources.body.current,10);assert.equal(potion.system.quantity,1);assert.equal(recipient.effects.length,0);
 const attempts=await Promise.all([consumeSharedItemOnGM(payload),consumeSharedItemOnGM(payload)]);
 assert.equal(attempts.filter(r=>r.status==='ok').length,1);assert.equal(recipient.system.resources.body.current,22);assert.equal(noaj.items.length,0);
});

test('shared consumable cards have one consumption button and never offer the generic effect-copy button',async t=>{
 // Render the real template with the same consumable classification used by toChat.
 const {default:Handlebars}=await import('handlebars');
 Handlebars.registerHelper('localize',key=>game.i18n.localize(key));Handlebars.registerHelper('concat',(...args)=>args.slice(0,-1).join(''));
 const source=fs.readFileSync(new URL('../templates/chat/item-card.hbs',import.meta.url),'utf8');
 const html=Handlebars.compile(source)({item:{uuid:'Actor.n.Item.p',name:'Potion',type:'gear'},canConsume:true,canApplyEffects:false});
 assert.match(html,/data-action="consume-item"/);assert.match(html,/Consommer/);assert.doesNotMatch(html,/data-action="apply-effects"/);
 const itemSource=fs.readFileSync(new URL('../modules/documents/item.mjs',import.meta.url),'utf8');assert.match(itemSource,/canApplyEffects: !isConsumable\(this\)/);
});

test('mixture and elixir have separate per-creator limits, exact healing dice and power-level durations',async()=>{
 const noaj=actor(),other=actor();game.actors=[noaj,other];game.items=[];game.scenes=[];
 for(const [sourceId,formula,days,base,maximum] of [
  ['holy-haminges-power-of-men:curative-draught:2','1d6',1,3,6],
  ['holy-haminges-power-of-men:life-elixir-of-the-devouress:8','2d10+2',2,1,2]
 ]){
  const t=TRANSFORMATION_TEMPLATES[sourceId+'#brew'];assert.ok(t);
  const make=(caster,counts=[])=>createConjuredConsumable(caster,instantConsequenceOperation(t,counts));
  for(let i=0;i<base;i++)await make(noaj);
  assert.equal(countConjuredConsumables(noaj,sourceId),base);await assert.rejects(()=>make(noaj),error=>error.code==='consumable-capacity');
  const independent=await make(other);assert.equal(countConjuredConsumables(other,sourceId),1);assert.equal(independent.effects[0].duration.value,days);
  const increased=await make(noaj,[2,maximum-base]);assert.equal(increased.effects[0].duration.value,days+2);
  assert.equal(increased.flags['trudvang-chronicles'].conjuredConsumable.preparation.capacity,maximum);
  const held=noaj.items.find(i=>i.flags['trudvang-chronicles'].conjuredConsumable.sourceId===sourceId);
  formulas.length=0;const before=noaj.system.resources.body.current;await consumeInventoryItem(held,noaj);
  assert.deepEqual(formulas,[formula]);assert.equal(noaj.system.resources.body.current,Math.min(30,before+6));
 }
});
