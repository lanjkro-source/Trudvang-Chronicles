import test from 'node:test';
import assert from 'node:assert/strict';
import {bindInventoryDrag} from '../modules/inventory-drag.mjs';
test('both inventory icon and name produce an Item UUID drag; re-rendering never doubles the drop',async()=>{
 globalThis.game={user:{id:'owner'}};
 const image=new EventTarget(),name=new EventTarget(),row={dataset:{itemId:'p'},querySelectorAll:()=>[image,name]};
 const root=new EventTarget();root.querySelectorAll=()=>[row];
 const drag={type:'Item',uuid:'Actor.source.Item.p'},item={toDragData:()=>drag},drops=[];
 const sheet={element:root,actor:{items:new Map([['p',item]]),canUserModify:()=>true},_onDrop:event=>drops.push(JSON.parse(event.dataTransfer.getData('text/plain')))};
 bindInventoryDrag(sheet);bindInventoryDrag(sheet);
 for(const handle of [image,name]){
  assert.equal(handle.draggable,true);
  const data={},event=new Event('dragstart');event.dataTransfer={setData:(key,value)=>data[key]=value};handle.dispatchEvent(event);
  assert.deepEqual(JSON.parse(data['text/plain']),drag);
 }
 const event=new Event('drop',{cancelable:true});event.dataTransfer={getData:()=>JSON.stringify(drag)};root.dispatchEvent(event);
 assert.equal(event.defaultPrevented,true);assert.deepEqual(drops,[drag]);
});
test('read-only inventory does not expose drag handles',()=>{
 globalThis.game={user:{id:'other'}};const handle=new EventTarget(),root=new EventTarget();
 root.querySelectorAll=()=>[{dataset:{itemId:'p'},querySelectorAll:()=>[handle]}];
 bindInventoryDrag({element:root,actor:{items:new Map([['p',{}]]),canUserModify:()=>false}});
 assert.notEqual(handle.draggable,true);
});
