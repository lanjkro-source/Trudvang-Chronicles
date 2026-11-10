const bindings=new WeakMap(),handles=new WeakSet();
/** Bind explicit HTML drag handles: a legacy dragDrop option alone does not
 * make inventory names/buttons draggable on ApplicationV2 sheets. */
export function bindInventoryDrag(sheet){
 const root=sheet.element;
 for(const row of root.querySelectorAll('.item-list [data-item-id]')){
  const item=sheet.actor.items.get(row.dataset.itemId);
  if(!item||!sheet.actor.canUserModify(game.user,'update'))continue;
  for(const handle of row.querySelectorAll(':scope > img, :scope > .item-name')){
   handle.draggable=true;
   if(handles.has(handle))continue;handles.add(handle);
   handle.addEventListener('dragstart',event=>{
    event.stopImmediatePropagation();
    event.dataTransfer.setData('text/plain',JSON.stringify(item.toDragData()));
    event.dataTransfer.effectAllowed='copyMove';
   });
  }
 }
 // Capture our inventory drops exactly once, even when native sheet bindings
 // are absent or also listening. Other document drops keep the native path.
 const prior=bindings.get(root);
 if(prior){root.removeEventListener('dragover',prior.over);root.removeEventListener('drop',prior.drop,true);}
 const over=event=>event.preventDefault();
 const drop=event=>{
  let data;try{data=JSON.parse(event.dataTransfer?.getData('text/plain')||'null');}catch{return;}
  if(data?.type!=='Item')return;
  event.preventDefault();event.stopImmediatePropagation();
  void sheet._onDrop(event);
 };
 root.addEventListener('dragover',over);root.addEventListener('drop',drop,{capture:true});
 bindings.set(root,{over,drop});
}
