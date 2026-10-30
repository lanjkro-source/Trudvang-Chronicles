/** Rules for distributing paid improvements among individual targets.
 * A missing definition means unknown, not unlimited or one target. */
export function magicTargetCapacity(targeting, selected) {
 if (!targeting) return null;
 return targeting.baseTargets + targeting.additionalTargets.reduce((total,row)=>total + row.count * (selected[row.optionId] ?? 0),0);
}

export function validateMagicAllocations({targeting, selected, allocations}) {
 if (!targeting) return {ok:false, reason:"unknown-targeting"};
 if (!selected || Object.values(selected).some(n=>!Number.isInteger(n)||n<0)) return {ok:false,reason:"invalid-selection"};
 const capacity=magicTargetCapacity(targeting,selected),targets=new Set(),spent={};
 for(const allocation of allocations){
  if(!allocation.targetUuid || targets.has(allocation.targetUuid))return {ok:false,reason:"duplicate-target"};
  targets.add(allocation.targetUuid);
 }
 if(targets.size>capacity)return {ok:false,reason:"exceeds-targets",capacity};
 const capacityIds=new Set(targeting.additionalTargets.map(row=>row.optionId));
 for (const allocation of allocations) {
  for (const [id,count] of Object.entries(allocation.countsById ?? {})) {
   if (!Object.hasOwn(selected,id) || capacityIds.has(id) || !Number.isInteger(count) || count<0) return {ok:false,reason:"invalid-allocation"};
   spent[id]=(spent[id]??0)+count;
   if (spent[id]>selected[id]) return {ok:false,reason:"exceeds-improvements",optionId:id};
  }
 }
 return {ok:true,capacity,spent};
}
