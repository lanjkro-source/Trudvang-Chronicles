import {temporaryHealthState} from "./transformation-profile.mjs";
/** Body Points are stored against a known effective maximum. No document writes
 * occur during preparation; the elected status synchronizer commits transitions. */
export function proportionalBodyHealth({value=0,modifier=0,maximum=1,referenceMaximum=maximum,referenceModifier=modifier}={}){
 maximum=Math.max(1,Number(maximum)||1);
 referenceMaximum=Math.max(1,Number(referenceMaximum)||maximum);
 const rescaled=maximum!==referenceMaximum;
 const previous=Math.min(referenceMaximum,Number(value)+Number(referenceModifier));
 const current=Math.min(maximum,rescaled?Math.ceil(previous*maximum/referenceMaximum):Number(value)+Number(modifier));
 return {current,maximum,modifier:Number(modifier),referenceMaximum,rescaled};
}

/** Atomic explicit health edit, including a damage/healing operation while a
 * maximum change is still waiting for its synchronization write. */
export function bodyHealthUpdate(actor,current,{maximum=actor.system?.resources?.body?.max}={}){
 const modifier=Number(actor.system?.modifiers?.bodyValue||0);
 return {"system.resources.body.value":Number(current)-modifier,
  ...(Number(maximum)>0?{"system.resources.body.maxAtValue":Number(maximum),"system.resources.body.modifierAtValue":modifier}:{})};
}

export function bodyHealthPersistence(actor){
 const state=actor.bodyHealthState,source=actor._source?.system?.resources?.body;
 if(!source)return null;
 const changes={};
 if(state&&Number(source.maxAtValue)!==state.maximum)changes["system.resources.body.maxAtValue"]=state.maximum;
 if(state&&Number(source.modifierAtValue)!==state.modifier)changes["system.resources.body.modifierAtValue"]=state.modifier;
 if(state?.rescaled)changes["system.resources.body.value"]=state.current-state.modifier;
 if(actor.temporaryHealthState){
  const temporary=temporaryHealthState(actor);
  if(Number(source.temporaryMaxAtValue??-1)!==temporary.maximum)changes["system.resources.body.temporaryMaxAtValue"]=temporary.maximum;
  if(Number(source.temporary??0)!==temporary.current)changes["system.resources.body.temporary"]=temporary.current;
 }
 return Object.keys(changes).length?changes:null;
}
