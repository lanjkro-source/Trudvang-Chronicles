/** Rules for distributing paid improvements among individual targets.
 * A missing definition means unknown, not unlimited or one target. */
export function magicTargetGroup(targeting,effectKey="") {
 if (!targeting?.groups) return targeting ? "default" : null;
 const variant=String(effectKey).split("#").at(-1);
 return targeting.groups.find(group=>group.variants.includes(variant))?.id ?? null;
}
export function magicTargetCapacity(targeting, selected, groupId="default") {
 if (!targeting) return null;
 const group=targeting.groups?.find(row=>row.id===groupId) ?? (targeting.groups?null:targeting);
 if(!group)return null;
 return group.baseTargets===null?Infinity:group.baseTargets + group.additionalTargets.reduce((total,row)=>total + row.count * (selected[row.optionId] ?? 0),0);
}

export function validateMagicAllocations({targeting, selected, allocations}) {
 if (!targeting) return {ok:false, reason:"unknown-targeting"};
 if (!selected || Object.values(selected).some(n=>!Number.isInteger(n)||n<0)) return {ok:false,reason:"invalid-selection"};
 const groups=targeting.groups??[{id:"default",...targeting}],targets=new Set(),spent={},used={};
 for(const allocation of allocations){
  if(!allocation.targetUuid || targets.has(allocation.targetUuid))return {ok:false,reason:"duplicate-target"};
  targets.add(allocation.targetUuid);
  const group=magicTargetGroup(targeting,allocation.effectKey);
  if(!group)return {ok:false,reason:"invalid-allocation"};
  used[group]=(used[group]??0)+1;
 }
 for(const group of groups){const capacity=magicTargetCapacity(targeting,selected,group.id);if((used[group.id]??0)>capacity)return {ok:false,reason:"exceeds-targets",capacity,group:group.id};}
 const capacityIds=new Set(groups.flatMap(group=>group.additionalTargets.map(row=>row.optionId)));
 for (const allocation of allocations) {
  const group=groups.find(row=>row.id===magicTargetGroup(targeting,allocation.effectKey));
  for (const [id,count] of Object.entries(allocation.countsById ?? {})) {
   if (!Object.hasOwn(selected,id) || capacityIds.has(id) || (group.allocatableOptions&&!group.allocatableOptions.includes(id)) || !Number.isInteger(count) || count<0) return {ok:false,reason:"invalid-allocation"};
   if(group.sharedOptions?.includes(id)){if(count!==selected[id])return {ok:false,reason:"invalid-allocation"};continue;}
   spent[id]=(spent[id]??0)+count;
   if (spent[id]>selected[id]) return {ok:false,reason:"exceeds-improvements",optionId:id};
  }
  for(const id of group.sharedOptions??[])if((allocation.countsById?.[id]??0)!==(selected[id]??0))return {ok:false,reason:"invalid-allocation"};
 }
 return {ok:true,capacity:targeting.groups?undefined:magicTargetCapacity(targeting,selected),spent};
}
