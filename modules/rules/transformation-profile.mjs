import {hasProfileChanges, rulesFromChanges} from "./effect-rule-changes.mjs";
import {upgradeFearFactor} from "./fear-resolver.mjs";
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
 const profile={effects:[],traits:{...actor.system.effective?.traits},knowledge:{},movements:[],senses:[],capabilities:[],damage:[],size:actor.type==="character"?1:Number(actor.system.details?.size)||1};
 for(const effect of activeTransformations(actor)){
  const r=effectRules(effect);profile.effects.push(effect);
  if(!r.traitsApplied)for(const row of r.traits??[])profile.traits[row.trait]=transformedTrait(Number(profile.traits[row.trait]||0),row);
  for(const [key,value]of Object.entries(r.knowledge??{}))profile.knowledge[key]=(profile.knowledge[key]||0)+value;
  profile.movements.push(...r.movement??[]);profile.senses.push(...r.senses??[]);profile.capabilities.push(...r.capabilities??[]);
  if(r.damage)profile.damage.push({effect:effect.name,...r.damage});
  for(const key of ["suspendEquipment","preserveHP","ignoreFear","ignoreWounds","noParry","noDodge","endAtEmptyHP"])profile[key] ||= Boolean(r[key]);
  if(r.size!==undefined)profile.size=r.size;
  if(r.vision)profile.vision=r.vision;
  if(r.naturalArmor!==undefined)profile.naturalArmor=r.naturalArmor;
  if(r.fearFactor)profile.fearFactor=upgradeFearFactor(profile.fearFactor??actor.system.details?.fearFactor,r.fearFactor);
  if(r.defense)profile.defense=(profile.defense||0)+r.defense;
  if(r.testFactor)profile.testFactor={...profile.testFactor,...r.testFactor};
  if(r.damageTakenFactor)profile.damageTakenFactor=(profile.damageTakenFactor??1)*r.damageTakenFactor;
 }
 if(profile.senses.some(s=>/vision nocturne/i.test(s)))profile.vision??="lightAmplification";
 if(profile.senses.some(s=>/noir|darkvision/i.test(s)))profile.vision="darkvision";
 return profile;
}
export function movementProfile(base, rows, changes, modifier=0) {
 const modes=Object.fromEntries((rows??[]).map(r=>[({terrestre:"land",vol:"flight",nage:"swim"}[r.mode]??r.mode),Math.max(0,(Number.parseFloat(r.max)||0)+modifier)]));
 if(!Object.keys(modes).length)modes.land=base;
 for(const row of changes){
  const keys=row.mode==="all"?Object.keys(modes):[row.mode];
  for(const key of keys)modes[key]=Math.max(0,row.method==="replace"?row.value:row.method==="baseMultiple"?base*row.value:row.method==="add"?(modes[key]??0)+row.value:row.method==="highest"?Math.max(modes[key]??0,row.value):(modes[key]??base)*row.value);
 }
 return modes;
}
export function temporaryHealthLayers(actor) {
 return activeTransformations(actor).map(effect=>{
  const meta=effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
  const configured=Number(effectRules(effect).temporaryHP??0);
  const remaining=hasProfileChanges(effect)||meta?.editableChanges?Math.max(0,configured-Number(meta?.temporaryHPSpent??0)):Number(meta?.temporaryHP??configured);
  return {effect,remaining};
 }).filter(e=>e.remaining>0);
}
export function remainingStoneIntegrity(effect) {
 const meta=effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
 return hasProfileChanges(effect)||meta?.editableChanges
  ? Math.max(0,Number(effectRules(effect).statueIntegrity??0)-Number(meta?.stoneIntegritySpent??0))
  : Number(meta?.stoneIntegrity??0);
}
export function consumeTemporaryHealth(layers,damage){
 let remaining=Math.max(0,damage);
 const updates=[];
 for(const {effect,remaining:hp}of layers){const loss=Math.min(remaining,hp);if(loss){
  const meta=effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
  const editable=hasProfileChanges(effect)||meta?.editableChanges;
  updates.push({_id:effect.id,[`flags.${TRANSFORMATION_SCOPE}.transformation.${editable?"temporaryHPSpent":"temporaryHP"}`]:editable?Number(meta?.temporaryHPSpent??0)+loss:hp-loss});
 }remaining-=loss;}
 return {damage:remaining,updates};
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
