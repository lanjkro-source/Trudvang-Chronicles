import {temporaryHealthState,effectRules} from "./transformation-profile.mjs";
import {effectContributions} from "./effect-contributions.mjs";
/** Body Points are stored against a known effective maximum. No document writes
 * occur during preparation; the elected status synchronizer commits transitions.
 * Maximum-only increases heal once; decreases only clamp excess HP. Paired
 * vitality remains a current-HP modifier, so its removal also removes HP even
 * below zero. The separate maximum-only baseline keeps simultaneous grants,
 * replacements and value-only modifiers from being counted twice. */
export function resolveBodyHealth({value=0,modifier=0,maximum=1,referenceMaximum=maximum,referenceModifier=modifier,
 maximumOnly=maximum-modifier,referenceMaximumOnly=referenceMaximum-referenceModifier}={}){
 maximum=Math.max(1,Number(maximum)||1);
 referenceMaximum=Math.max(1,Number(referenceMaximum)||maximum);
 const gain=Math.max(0,Number(maximumOnly)-Number(referenceMaximumOnly));
 const current=Math.min(maximum,Number(value)+Number(modifier)+gain);
 const adjusted=maximum!==referenceMaximum||gain!==0;
 return {current,maximum,modifier:Number(modifier),maximumOnly:Number(maximumOnly),referenceMaximum,adjusted};
}

/** Attribute current-HP modifiers whose effect also changes the maximum. Value-
 * only effects remain independent: removing one must never heal the actor. */
export function maximumOnlyHealth(actor,maximum=actor.system?.resources?.body?.max){
 const paired=effectContributions(actor,"system.modifiers.bodyValue",{includeEffect:true}).reduce((sum,row)=>{
   const effect=row.effect;if(!effect)return sum;
   const changes=Array.from(effect.system?.changes??[]);
   const paired=changes.some(c=>/^system\.(?:modifiers\.bodyMax|resources\.body\.max|(?:effective\.)?traits\.(?:strength|constitution))$/.test(c.key))
    ||effectRules(effect).traits?.some(row=>["strength","constitution"].includes(row.trait));
   return sum+(paired?row.value:0);
 },0);
 return Number(maximum)-paired;
}

/** Atomic explicit health edit, including a damage/healing operation while a
 * maximum change is still waiting for its synchronization write. */
export function bodyHealthUpdate(actor,current,{maximum=actor.system?.resources?.body?.max}={}){
 const modifier=Number(actor.system?.modifiers?.bodyValue||0);
 return {"system.resources.body.value":Number(current)-modifier,
  ...(Number(maximum)>0?{"system.resources.body.maxAtValue":Number(maximum),"system.resources.body.modifierAtValue":modifier,
   "system.resources.body.maximumOnlyAtValue":maximumOnlyHealth(actor,maximum)}:{})};
}

export function bodyHealthPersistence(actor){
 const state=actor.bodyHealthState,source=actor._source?.system?.resources?.body;
 if(!source)return null;
 const changes={};
 if(state&&Number(source.maxAtValue)!==state.maximum)changes["system.resources.body.maxAtValue"]=state.maximum;
 if(state&&Number(source.modifierAtValue)!==state.modifier)changes["system.resources.body.modifierAtValue"]=state.modifier;
 if(state&&source.maximumOnlyAtValue!==state.maximumOnly)changes["system.resources.body.maximumOnlyAtValue"]=state.maximumOnly;
 if(state?.adjusted)changes["system.resources.body.value"]=state.current-state.modifier;
 if(actor.temporaryHealthState){
  const temporary=temporaryHealthState(actor);
  if(Number(source.temporaryMaxAtValue??-1)!==temporary.maximum)changes["system.resources.body.temporaryMaxAtValue"]=temporary.maximum;
  if(Number(source.temporary??0)!==temporary.current)changes["system.resources.body.temporary"]=temporary.current;
 }
 return Object.keys(changes).length?changes:null;
}
