import {hasProfileChanges, rulesFromChanges, roundEffectValue} from "./effect-rule-changes.mjs";
import {upgradeFearFactor} from "./fear-resolver.mjs";
import {sensoryProfile,sensoryVision} from "./senses.mjs";
export const TRANSFORMATION_SCOPE = "trudvang-chronicles";
export const activeTransformations = actor => Array.from(actor?.allApplicableEffects?.() ?? actor?.effects ?? []).filter(e => !e.disabled && !e.isSuppressed && !e.duration?.expired && (hasProfileChanges(e) || e.flags?.[TRANSFORMATION_SCOPE]?.transformation))
 .sort((a,b)=>Math.min(...Array.from(a.system?.changes??[]).map(c=>Number(c.priority??0)),Infinity)-Math.min(...Array.from(b.system?.changes??[]).map(c=>Number(c.priority??0)),Infinity));
// Compatibility for existing world effects. New effects store all configuration
// in editable changes; clearing their rows must not revive legacy metadata.
export const effectRules = effect => hasProfileChanges(effect) || effect.flags?.[TRANSFORMATION_SCOPE]?.transformation?.editableChanges
 ? rulesFromChanges(effect.system?.changes) : effect.flags?.[TRANSFORMATION_SCOPE]?.transformation?.rules ?? {};
const degrees=[-8,-6,-4,-2,-1,0,1,2,4,6,8];
export function transformedTrait(value, rule) {
 let result=value;
 if(rule.method==="replace")result=rule.value;
 else if(rule.method==="highest")result=Math.max(value,rule.value);
 else if(rule.method==="degrees"){
  const index=degrees.reduce((best,n,i)=>Math.abs(n-value)<Math.abs(degrees[best]-value)?i:best,0);
  result=value>=8&&rule.overflow?value+rule.overflow:degrees[Math.max(0,Math.min(degrees.length-1,index+rule.value))];
 }else result+=rule.value;
 return Math.max(rule.min??-Infinity,Math.min(rule.max??Infinity,result));
}
/** Pure profile: no document writes, timers, or source mutations during preparation. */
export function transformationProfile(actor) {
 const profile={effects:[],traits:{...actor.system.effective?.traits},knowledge:{},movements:[],senses:[],capabilities:[],damage:[],size:actor.type==="character"?1:actor.system.details?.size||1};
 for(const effect of activeTransformations(actor)){
  const r=effectRules(effect);profile.effects.push(effect);
  if(!r.traitsApplied)for(const row of r.traits??[])profile.traits[row.trait]=transformedTrait(Number(profile.traits[row.trait]||0),row);
  for(const [key,value]of Object.entries(r.knowledge??{}))profile.knowledge[key]=(profile.knowledge[key]||0)+value;
  profile.movements.push(...r.movement??[]);profile.senses.push(...r.senses??[]);profile.capabilities.push(...r.capabilities??[]);
  if(r.damage)profile.damage.push({effect:effect.name,...r.damage});
  for(const attack of r.attacks??[])if(attack.isUnarmed)profile.unarmedAttack=attack;
  for(const key of ["suspendEquipment","preserveHP","ignoreFear","ignoreWounds","noParry","noDodge","endAtEmptyHP"])profile[key] ||= Boolean(r[key]);
  if(r.size!==undefined)profile.size=r.size;
  if(r.vision)profile.vision=r.vision;
  if(r.naturalArmor!==undefined)profile.naturalArmor=r.naturalArmor;
  if(r.fearFactor)profile.fearFactor=upgradeFearFactor(profile.fearFactor??actor.system.details?.fearFactor,r.fearFactor);
  if(r.defense)profile.defense=(profile.defense||0)+r.defense;
  if(r.testFactor)profile.testFactor={...profile.testFactor,...r.testFactor};
  if(r.damageTakenFactor)profile.damageTakenFactor=(profile.damageTakenFactor??1)*r.damageTakenFactor;
 }
 profile.sensory=sensoryProfile(actor,profile.effects.map(e=>({rules:effectRules(e),name:e.name})));
 profile.vision=sensoryVision(profile.sensory)?.mode;
 return profile;
}
/** Movement multipliers change metres per 2 CP, never the per-turn maximum. */
export function movementDetails(base, rows, changes, modifier=0) {
 const number=(value,fallback)=>{const n=Number.parseFloat(String(value??"").replace(",","."));return Number.isFinite(n)?n:fallback;};
 const modes=Object.fromEntries((rows??[]).map(r=>[({terrestre:"land",vol:"flight",nage:"swim"}[r.mode]??r.mode),{max:Math.max(0,number(r.max,0)+modifier),metersPerTwo:Math.max(0,number(r.distance,1))}]));
 if(!Object.keys(modes).length)modes.land={max:base,metersPerTwo:1};
 const baseRate=modes.land?.metersPerTwo??1;
 for(const row of changes){
  const keys=row.mode==="all"?Object.keys(modes):[row.mode];
  for(const key of keys){
   const current=modes[key]??{max:base,metersPerTwo:baseRate};
   if(row.method==="multiply"||row.method==="baseMultiple"){
    modes[key]={...current,metersPerTwo:Math.max(0,(row.method==="baseMultiple"?baseRate:current.metersPerTwo)*row.value)};
   }else{
    const max=Math.max(0,row.method==="replace"?row.value:row.method==="add"?current.max+row.value:row.method==="highest"?Math.max(current.max,row.value):current.max);
    modes[key]={max,metersPerTwo:row.metersPerTwo!==undefined?Math.max(0,number(row.metersPerTwo,0)):current.max?current.metersPerTwo*max/current.max:0};
   }
  }
 }
 return Object.fromEntries(Object.entries(modes).map(([mode,row])=>[mode,{max:roundEffectValue(row.max),metersPerTwo:roundEffectValue(row.metersPerTwo)}]));
}
export function movementProfile(base, rows, changes, modifier=0) {
 return Object.fromEntries(Object.entries(movementDetails(base,rows,changes,modifier)).map(([mode,row])=>[mode,row.max]));
}
export function temporaryHealthGrants(actor) {
 const active=Array.from(actor?.allApplicableEffects?.()??actor?.effects??[]).filter(e=>!e.disabled&&!e.isSuppressed&&!e.duration?.expired);
 return active.map(effect=>{
  const meta=effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
  let configured=Number(effectRules(effect).temporaryHP??0);
  for(const row of effect.system?.changes??[])if(["system.resources.body.temporary","system.resources.body.temporaryMax"].includes(row.key)){
   const value=Number(row.value)||0;
   configured=row.type==="add"?configured+value:row.type==="subtract"?configured-value:row.type==="multiply"?configured*value:row.type==="upgrade"?Math.max(configured,value):row.type==="downgrade"?Math.min(configured,value):value;
  }
  const editable=hasProfileChanges(effect)||meta?.editableChanges||Array.from(effect.system?.changes??[]).some(c=>["system.resources.body.temporary","system.resources.body.temporaryMax"].includes(c.key));
  const remaining=editable?Math.max(0,configured-Number(meta?.temporaryHPSpent??0)):Number(meta?.temporaryHP??configured);
  return {effect,remaining,maximum:configured};
 }).filter(row=>row.maximum!==0);
}
/** One shared current reserve; effects contribute only to its maximum. */
export function temporaryHealthState(actor) {
 const source=actor._source?.system?.resources?.body??{};
 const grants=temporaryHealthGrants(actor);
 const maximum=Math.max(0,Number(source.temporaryMax||0)+grants.reduce((sum,row)=>sum+row.maximum,0));
 const stored=Math.max(0,Number(source.temporary)||0),reference=Number(source.temporaryMaxAtValue??-1);
 const current=reference<0?Math.min(maximum,stored+grants.reduce((sum,row)=>sum+row.remaining,0))
  :Math.min(maximum,stored+Math.max(0,maximum-reference));
 return {current,maximum,reference};
}
export function temporaryHealthUpdate(actor,value) {
 const state=temporaryHealthState(actor),current=Math.max(0,Number(value)||0),maximum=Math.max(state.maximum,current);
 return {"system.resources.body.temporary":current,"system.resources.body.temporaryMaxAtValue":maximum,
  ...(maximum>state.maximum?{"system.resources.body.temporaryMax":Math.max(0,Number(actor._source?.system.resources?.body?.temporaryMax)||0)+maximum-state.maximum}:{})};
}
export async function setTemporaryHealth(actor, value) {
 await actor.update(temporaryHealthUpdate(actor,value));
}
export function remainingStoneIntegrity(effect) {
 const meta=effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
 return hasProfileChanges(effect)||meta?.editableChanges
  ? Math.max(0,Number(effectRules(effect).statueIntegrity??0)-Number(meta?.stoneIntegritySpent??0))
  : Number(meta?.stoneIntegrity??0);
}
/** Named, additive explanation of an explicitly scoped aftereffect multiplier. */
export function transformationRollRows(actor,{target=0,skillKey="",traitKey="",movement=false}={}){
 let current=target;const rows=[];
 for(const effect of activeTransformations(actor)){
  const factors=effectRules(effect).testFactor??{};
  const factor=factors[traitKey]??factors[skillKey]??(skillKey==="agility"?factors.dexterity:undefined)??(movement?factors.movement:undefined);
  if(factor===undefined)continue;
  const value=Math.floor(current*factor)-current;
  rows.push({label:effect.name,value});current+=value;
 }
 return rows;
}
