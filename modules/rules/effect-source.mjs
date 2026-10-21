import {effectChangePhase} from "./effect-contributions.mjs";

/** Native V14 changes are DataModels with parent references. Copy their scalar
 * fields, never the live model graph (structuredClone also preserves cycles).
 * V14.369 may export value as parsed JSON: serialize that value, not String(),
 * which would destroy objects and arrays as "[object Object]". */
export function effectChangesSource(changes){
 return Array.from(changes??[],change=>({key:String(change.key??""),type:String(change.type??"add"),
  value:change.value!==null&&typeof change.value==="object"?JSON.stringify(change.value):String(change.value??""),phase:effectChangePhase(change),
  ...(change.priority!==undefined?{priority:change.priority===null?null:Number(change.priority)}:{})}));
}

/** Normalize at document-write boundaries, preserving system metadata while
 * removing runtime DataModels from native changes and staged changes. */
export function effectSource(data){
 const source=typeof data.toObject==="function"?data.toObject():data;
 const system=typeof source.system?.toObject==="function"?source.system.toObject():source.system??{};
 return {...source,system:{...system,changes:effectChangesSource(system.changes),
  ...(system.stages?{stages:Array.from(system.stages,stage=>{
   const row=typeof stage.toObject==="function"?stage.toObject():stage;
   return {...row,changes:effectChangesSource(row.changes)};
  })}:{})}};
}
