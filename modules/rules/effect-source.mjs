import {effectChangePhase} from "./effect-contributions.mjs";

/** Native V14 changes are DataModels with parent references. Copy their scalar
 * fields, never the live model graph (structuredClone also preserves cycles). */
export function effectChangesSource(changes){
 return Array.from(changes??[],change=>({key:String(change.key??""),type:String(change.type??"add"),
  value:String(change.value??""),phase:effectChangePhase(change),
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
