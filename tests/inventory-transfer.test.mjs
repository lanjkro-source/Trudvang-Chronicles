import test from 'node:test';
import assert from 'node:assert/strict';
import {transferInventoryItemOnGM,recoverInventoryTransfers,requestInventoryTransfer} from '../modules/inventory-transfer.mjs';
import {countConjuredConsumables,activeConjuredConsumable} from '../modules/conjured-consumables.mjs';
const S='trudvang-chronicles';let serial=0;
class Items extends Array{get(id){return this.find(item=>item.id===id);}has(id){return Boolean(this.get(id));}}
function runtime(t){
 const docs=new Map(),users=new Map([['a',{id:'a',active:true}],['b',{id:'b',active:true}],['gm',{id:'gm',isGM:true,active:true}]]);
 globalThis.game={user:users.get('gm'),users:{get:id=>users.get(id),activeGM:{isSelf:true}},actors:[],items:[],scenes:[],time:{worldTime:0},i18n:{localize:key=>key}};
 globalThis.ui={notifications:{warn:()=>{}}};
 globalThis.foundry={utils:{fromUuid:async uuid=>docs.get(uuid)}};t.mock.method(console,'error',()=>{});
 function actor(id,owner){
  const a={id,uuid:'Actor.'+id,documentName:'Actor',items:new Items(),canUserModify:user=>user.isGM||user.id===owner};game.actors.push(a);docs.set(a.uuid,a);
  a.createEmbeddedDocuments=async(type,rows,options)=>{assert.equal(type,'Item');assert.equal(options.keepEmbeddedIds,true);if(a.failCreate)throw Error('create failed');return rows.map(row=>item(a,row));};
  return a;
 }
 function item(a,input={}){
  const source={_id:'i'+serial++,name:'Sword',type:'weapon',system:{quantity:1,equipped:true,breach:{value:50,max:80}},effects:[],...structuredClone(input)};
  const i={id:source._id,uuid:a.uuid+'.Item.'+source._id,documentName:'Item',actor:a,parent:a,type:source.type,_source:source,system:source.system,flags:source.flags??{},toObject:()=>structuredClone(source)};
  source.flags=i.flags;i.effects=source.effects.map(e=>({...structuredClone(e),toObject:()=>structuredClone(e)}));
  i.update=async update=>{if(a.failUnlock)throw Error('unlock failed');for(const [key,value] of Object.entries(update)){if(key===`flags.${S}.-=inventoryTransfer`)delete i.flags[S].inventoryTransfer;else throw Error('unexpected update '+key);}};
  i.delete=async()=>{if(i.failDelete||a.failDelete)throw Error('delete failed');a.items.splice(a.items.indexOf(i),1);docs.delete(i.uuid);};
  docs.set(i.uuid,i);a.items.push(i);return i;
 }
 const transfer=(i,target,userId='a')=>transferInventoryItemOnGM({sourceItemUuid:i.uuid,targetActorUuid:target.uuid,userId,requestId:'r'+serial++});
 return {actor,item,transfer,docs};
}
test('a player gives an owned stack to a read-only recipient; source is removed and all intrinsic effects are retained',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b');
 const source=r.item(a,{system:{quantity:3,equipped:true,breach:{value:50,max:80}},flags:{[S]:{integritySpent:{buff:{spent:5,signature:'same'}}}},effects:[{_id:'buff',type:'effect',start:{time:10},duration:{value:2,units:'days'},flags:{[S]:{transformation:{resolved:true,appliedAt:10}}},system:{changes:[{key:'system.breach.value',type:'add',value:'10',phase:'initial'}]}}]});
 const original=source.toObject();assert.equal(b.canUserModify(game.users.get('a')),false);
 assert.equal((await r.transfer(source,b)).status,'ok');assert.equal(a.items.length,0);assert.equal(b.items.length,1);
 const given=b.items[0];assert.equal(given.system.quantity,3);assert.equal(given.system.equipped,false);assert.deepEqual(given.system.breach,{value:50,max:80});assert.equal(given.effects[0]._id,'buff');assert.deepEqual(given.effects[0].duration,original.effects[0].duration);assert.deepEqual(given.flags[S].integritySpent,original.flags[S].integritySpent);assert.equal(given.flags[S].inventoryTransfer,undefined);
});
test('players cannot take someone else’s objects, while the GM may transfer between any actors',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),c=r.actor('c','b'),source=r.item(b);
 assert.equal((await r.transfer(source,a,'a')).status,'denied');assert.equal(b.items.length,1);assert.equal(a.items.length,0);
 assert.equal((await r.transfer(source,c,'gm')).status,'ok');assert.equal(b.items.length,0);assert.equal(c.items.length,1);
});
test('duplicate simultaneous transfer requests move an object only once',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),c=r.actor('c','b'),source=r.item(a);
 const results=await Promise.all([r.transfer(source,b),r.transfer(source,c)]);
 assert.equal(results.filter(result=>result.status==='ok').length,1);assert.equal(a.items.length,0);assert.equal(b.items.length+c.items.length,1);
});
test('creation or source deletion failures retain the original without leaving an available duplicate',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),source=r.item(a);
 b.failCreate=true;assert.equal((await r.transfer(source,b)).status,'failed');assert.equal(a.items.length,1);assert.equal(b.items.length,0);
 b.failCreate=false;source.failDelete=true;assert.equal((await r.transfer(source,b)).status,'failed');assert.equal(a.items.length,1);assert.equal(b.items.length,0);
});

test('a source stack changed while copying is not removed and the stale recipient copy is discarded',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),source=r.item(a,{system:{quantity:3}}),create=b.createEmbeddedDocuments;
 b.createEmbeddedDocuments=async(...args)=>{const result=await create(...args);source.system.quantity=2;return result;};
 assert.equal((await r.transfer(source,b)).status,'failed');assert.equal(a.items.length,1);assert.equal(source.system.quantity,2);assert.equal(b.items.length,0);
});
test('interrupted finalization keeps the destination item locked, then recovers without recreating the source',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),source=r.item(a);b.failUnlock=true;
 assert.equal((await r.transfer(source,b)).status,'pending');assert.equal(a.items.length,0);assert.ok(b.items[0].flags[S].inventoryTransfer);
 b.failUnlock=false;await recoverInventoryTransfers();assert.equal(b.items[0].flags[S].inventoryTransfer,undefined);assert.equal(b.items.length,1);
});
test('pending copies are rolled back if their source still exists when the world reloads',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),source=r.item(a);
 r.item(b,{flags:{[S]:{inventoryTransfer:{sourceUuid:source.uuid,requestId:'interrupted'}}}});
 await recoverInventoryTransfers();assert.equal(a.items.length,1);assert.equal(b.items.length,0);
});
test('a donated potion keeps its creator, expiry and global active count',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),id='potion';
 const source=r.item(a,{type:'gear',system:{quantity:1,consumable:true},flags:{[S]:{conjuredConsumable:{creatorUuid:a.uuid,sourceId:id}}},effects:[{_id:'potency',type:'effect',start:{time:0},duration:{value:1,units:'days'},flags:{[S]:{transformation:{resolved:true,appliedAt:0},consumablePayload:{operations:[{operation:'heal',formula:'1d10+1'}]}}},system:{changes:[]}}]});
 assert.equal(countConjuredConsumables(a,id),1);assert.equal((await r.transfer(source,b)).status,'ok');
 assert.equal(countConjuredConsumables(a,id),1);assert.equal(countConjuredConsumables(b,id),0);assert.equal(b.items[0].flags[S].conjuredConsumable.creatorUuid,a.uuid);
 game.time.worldTime=86400;assert.equal(activeConjuredConsumable(b.items[0]),null);assert.equal(countConjuredConsumables(a,id),0);
});

test('without an online GM a player can move between owned actors but cannot write to another player inventory',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),own=r.actor('other-owned','a'),source=r.item(a);
 game.user=game.users.get('a');game.users.activeGM=null;
 assert.equal((await requestInventoryTransfer(source,b)).status,'noGM');assert.equal(a.items.length,1);assert.equal(b.items.length,0);
 assert.equal((await requestInventoryTransfer(source,own)).status,'ok');assert.equal(a.items.length,0);assert.equal(own.items.length,1);
});

test('a normal player request crosses the socket to the elected GM and returns the transfer result',async t=>{
 const r=runtime(t),a=r.actor('a','a'),b=r.actor('b','b'),source=r.item(a);let handler;
 game.user=game.users.get('a');game.users.activeGM={id:'gm',isSelf:false};
 game.socket={on(channel,callback){assert.equal(channel,'system.trudvang-chronicles');handler=callback;},async emit(channel,payload){
  if(payload.type==='inventoryTransfer'){game.users.activeGM.isSelf=true;try{await handler(payload);}finally{game.users.activeGM.isSelf=false;}}
  else await handler(payload);
 }};
 assert.equal((await requestInventoryTransfer(source,b)).status,'ok');assert.equal(a.items.length,0);assert.equal(b.items.length,1);
});
