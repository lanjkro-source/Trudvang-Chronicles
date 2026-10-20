export const TRANSFORMATION_SCOPE = "trudvang-chronicles";
export const activeTransformations = actor => Array.from(actor?.effects ?? []).filter(e => !e.disabled && !e.isSuppressed && !e.duration?.expired && e.flags?.[TRANSFORMATION_SCOPE]?.transformation);
export const effectRules = effect => effect.flags[TRANSFORMATION_SCOPE].transformation.rules ?? {};
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
  if(r.fearFactor)profile.fearFactor=r.fearFactor;
  if(r.defense)profile.defense=(profile.defense||0)+r.defense;
  if(r.testFactor)profile.testFactor={...profile.testFactor,...r.testFactor};
  if(r.damageTakenFactor)profile.damageTakenFactor=(profile.damageTakenFactor??1)*r.damageTakenFactor;
 }
 if(profile.senses.some(s=>/vision nocturne/i.test(s)))profile.vision??="lightAmplification";
 if(profile.senses.some(s=>/noir|darkvision/i.test(s)))profile.vision="darkvision";
 return profile;
}
export function movementProfile(base, rows, changes) {
 const modes=Object.fromEntries((rows??[]).map(r=>[({terrestre:"land",vol:"flight",nage:"swim"}[r.mode]??r.mode),Number.parseFloat(r.max)||0]));
 if(!Object.keys(modes).length)modes.land=base;
 for(const row of changes){
  const keys=row.mode==="all"?Object.keys(modes):[row.mode];
  for(const key of keys)modes[key]=Math.max(0,row.method==="replace"?row.value:row.method==="baseMultiple"?base*row.value:(modes[key]??base)*row.value);
 }
 return modes;
}
export function temporaryHealthLayers(actor) {
 return activeTransformations(actor).map(effect=>({effect,remaining:Number(effect.flags[TRANSFORMATION_SCOPE].transformation.temporaryHP??0)})).filter(e=>e.remaining>0);
}
export function consumeTemporaryHealth(layers,damage){
 let remaining=Math.max(0,damage);
 const updates=[];
 for(const {effect,remaining:hp}of layers){const loss=Math.min(remaining,hp);if(loss)updates.push({_id:effect.id,[`flags.${TRANSFORMATION_SCOPE}.transformation.temporaryHP`]:hp-loss});remaining-=loss;}
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
