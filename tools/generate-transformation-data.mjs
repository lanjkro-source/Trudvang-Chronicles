import fs from "node:fs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";
import {rulesFromChanges,changesFromRules,EFFECT_RULE_PREFIX,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";
import {resolvePowerOptionReference} from "./power-option-identity.mjs";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const lang=Object.fromEntries(["fr","en"].map(c=>[c,read(`lang/${c}.json`)]));
const registry={}, bySource={};
const references={fr:[],en:[]};
const powerIds=new Set(read("game doc/fr/trudvang-powers-fr.json").map(p=>p.catalogId));
const parameterTargets=new Set(["duration","vitality","temporaryHP","protection","outerProtection","damage","traitDegrees","traitValue","modifier","fearFactor","attackStep","senseRange","instant","onApplyStep","summaryPart","note"]);
const effectParameters=(entry,t)=>/recovery|exhaustion/.test(t.id)?[]:(entry.effectParameters??[]).filter(p=>!p.templates||p.templates.includes(t.id)).map(p=>entry.catalogId?resolvePowerOptionReference(entry,p):p);
const changeMechanics=changes=>changes.map(row=>{
 const value=typeof row.value==="string"?(()=>{try{return JSON.parse(row.value);}catch{return row.value;}})():row.value;
 const key=row.key.slice(EFFECT_RULE_PREFIX.length);
 const strip=value=>Array.isArray(value)?value.map(strip):value&&typeof value==="object"?Object.fromEntries(Object.entries(value).filter(([key])=>!["name","label"].includes(key)).map(([k,v])=>[k,strip(v)])):value;
 return {...row,value:["senses","capabilities","capabilityNames","immunities"].includes(key)?value.map(v=>typeof v==="string"?"text":strip(v)):strip(value)};
});
for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation={};
for(const kind of ["powers","feats"]){
 const fr=read(`game doc/fr/trudvang-${kind}-fr.json`),en=read(`game doc/en/trudvang-${kind}-en.json`);
 if(fr.length!==en.length)throw Error(`Unaligned ${kind}`);
 const englishPowers=kind==="powers"?new Map(en.map(p=>[p.catalogId,p])):null;
 for(const [i,entry]of fr.entries()){
  if(!entry.effectTemplates?.length)continue;
  if(kind==="powers")for(const t of entry.effectTemplates){
   if(t.priority!==10*entry.level||(t.changes??[]).some(c=>c.priority!==t.priority))throw Error(`Invalid effect priority for ${entry.name}`);
  }
  const id=entry.catalogId||CREATURE_ABILITY_REFERENCES[entry.name]?.id;
  if(!id)throw Error(`Unknown effect source ${entry.name}`);
  const englishEntry=englishPowers?englishPowers.get(entry.catalogId):en[i];
  if(!englishEntry||englishEntry.effectTemplates?.length!==entry.effectTemplates.length)throw Error(`Unaligned EN effect variants for ${id}`);
  for(const p of entry.effectParameters??[])if(p.templates?.some(id=>!entry.effectTemplates.some(t=>t.id===id)))throw Error(`Unknown effect variant in parameters for ${entry.name}`);
  bySource[id]=[];
  for(const [j,t]of entry.effectTemplates.entries()){
   const key=`${id}#${t.id}`;
   const translated=englishEntry?.effectTemplates?.find(v=>v.id===t.id);
   if(!translated)throw Error(`Missing EN effect ${key}`);
   if(JSON.stringify(t.instant??null)!==JSON.stringify(translated.instant??null))throw Error(`Unaligned instant consequence for ${key}`);
   if(JSON.stringify(t.onApply??null)!==JSON.stringify(translated.onApply??null))throw Error(`Unaligned application consequence for ${key}`);
   if(JSON.stringify(t.breakOnDamage??false)!==JSON.stringify(translated.breakOnDamage??false)||![undefined,true,false].includes(t.breakOnDamage))throw Error(`Invalid damage-ending condition for ${key}`);
   if(JSON.stringify(t.periodic??null)!==JSON.stringify(translated.periodic??null))throw Error(`Unaligned periodic consequence for ${key}`);
   if(JSON.stringify(t.persistentDamage??null)!==JSON.stringify(translated.persistentDamage??null))throw Error(`Unaligned persistent damage for ${key}`);
   if(t.persistentDamage){const d=t.persistentDamage;
    if(typeof d.onApply!=='boolean'||typeof d.onRound!=='boolean'||(!d.onApply&&!d.onRound))throw Error(`Invalid damage trigger for ${key}`);
    if(d.resistance&&(!Number.isInteger(d.resistance.testIndex)||d.resistance.testIndex<0||!['damage','continuation','presence','consequence'].includes(d.resistance.scope)||!Number.isFinite(d.resistance.successFactor)||d.resistance.successFactor<0||d.resistance.successFactor>1||(d.resistance.failureFactor!==undefined&&(!Number.isFinite(d.resistance.failureFactor)||d.resistance.failureFactor<0||d.resistance.failureFactor>1))||(d.resistance.events??[]).some(event=>!['apply','round'].includes(event))))throw Error(`Invalid damage resistance for ${key}`);
    if(d.resistance?.outcomes){
     if(d.resistance.scope!=='consequence')throw Error(`Damage outcomes require a consequence resistance: ${key}`);
     for(const outcome of Object.values(d.resistance.outcomes))for(const part of [outcome,...(outcome.extras??[])]){
      if(!part.labelKey&&!part.nameKey)throw Error(`Missing damage outcome label: ${key}`);
      if(!part.remove&&(!part.duration||!part.nameKey||!part.descriptionKey||!Array.isArray(part.changes)||part.changes.some(change=>!validProfileChange(change))))throw Error(`Invalid damage outcome: ${key}`);
      for(const label of [part.labelKey,part.nameKey,part.descriptionKey].filter(Boolean))if(!['fr','en'].every(code=>label.split('.').reduce((value,key)=>value?.[key],lang[code])))throw Error(`Untranslated damage outcome: ${label}`);
     }
    }
    if(d.alternatives&&(!Array.isArray(d.alternatives)||d.alternatives.some(row=>!row.id||!row.labelKey||!Number.isFinite(row.factor)||row.factor<0||row.factor>1)))throw Error(`Invalid conditional damage for ${key}`);
    if(d.alternatives&&new Set(d.alternatives.map(row=>row.id)).size!==d.alternatives.length)throw Error(`Duplicate damage alternative for ${key}`);
   }
   if(JSON.stringify(t.conditionalProtection??null)!==JSON.stringify(translated.conditionalProtection??null))throw Error(`Unaligned conditional protection for ${key}`);
   if(t.conditionalProtection){const c=t.conditionalProtection;if(![c.melee,c.ranged].every(n=>Number.isInteger(n)&&n>=0)||![c.magicMelee,c.magicRanged].every(n=>n===null||Number.isInteger(n)&&n>=0)||!entry.powerLevels?.some(p=>p.optionId===c.optionId))throw Error(`Invalid conditional protection for ${key}`);}
   if(JSON.stringify(t.weaponDamage??null)!==JSON.stringify(translated.weaponDamage??null))throw Error(`Unaligned weapon damage for ${key}`);
   if(Boolean(t.itemOnly)!==Boolean(translated.itemOnly)||JSON.stringify(t.itemEnchantment??null)!==JSON.stringify(translated.itemEnchantment??null)||JSON.stringify(t.itemQuality??null)!==JSON.stringify(translated.itemQuality??null))throw Error(`Unaligned item enchantment for ${key}`);
   if(t.itemQuality&&(!t.itemOnly||!Number.isInteger(t.itemQuality.steps)||t.itemQuality.steps===0||!Number.isInteger(t.itemQuality.stepsIndex)||!entry.powerLevels[t.itemQuality.stepsIndex]))throw Error(`Invalid item quality effect for ${key}`);
   if(t.requiredPowerOption!==translated.requiredPowerOption||(t.requiredPowerOption!==undefined&&(!Number.isInteger(t.requiredPowerOption)||!entry.powerLevels?.[t.requiredPowerOption])))throw Error(`Invalid required power option ${key}`);
   if(t.itemEnchantment){const p=t.itemEnchantment;
    if(!t.itemOnly||![p.use,p.damage,p.protection,p.integrity].every(Number.isFinite)||![p.useIndex,p.statsIndex].filter(index=>index!==undefined).every(index=>Number.isInteger(index)&&entry.powerLevels?.[index])||!Array.isArray(p.protectionTypes)||p.protectionTypes.some(type=>!['weapon','shield','armor'].includes(type)))throw Error(`Invalid item enchantment ${key}`);
   }
   if(t.weaponDamage&&(![t.weaponDamage.normal,t.weaponDamage.undead,t.weaponDamage.demon].every(Number.isInteger)||t.weaponDamage.normal<0||t.weaponDamage.undead<t.weaponDamage.normal||t.weaponDamage.demon<t.weaponDamage.normal||!entry.powerLevels?.some(p=>p.optionId===t.weaponDamage.optionId)))throw Error(`Invalid weapon damage for ${key}`);
   if(JSON.stringify(t.armorBlessing??null)!==JSON.stringify(translated.armorBlessing??null))throw Error(`Unaligned armor blessing for ${key}`);
   if(t.armorBlessing&&(!Number.isInteger(t.armorBlessing.normal)||t.armorBlessing.normal<0||(t.armorBlessing.magic!==null&&(!Number.isInteger(t.armorBlessing.magic)||t.armorBlessing.magic<0||t.armorBlessing.magic>t.armorBlessing.normal))||!entry.powerLevels?.some(p=>p.optionId===t.armorBlessing.optionId)))throw Error(`Invalid armor blessing for ${key}`);
   if(JSON.stringify(t.rolledModifier??null)!==JSON.stringify(translated.rolledModifier??null))throw Error(`Unaligned rolled modifier for ${key}`);
   if(t.rolledModifier&&(t.rolledModifier.formula!=="1d3"||t.rolledModifier.key!=="system.modifiers.rolls.allActions"||!Number.isInteger(t.rolledModifier.damageIndex)||!entry.powerLevels?.[t.rolledModifier.damageIndex]))throw Error(`Invalid rolled modifier for ${key}`);
   if(JSON.stringify(t.roundResistance??null)!==JSON.stringify(translated.roundResistance??null))throw Error(`Unaligned round resistance for ${key}`);
   if(t.roundResistance&&(!Number.isInteger(t.roundResistance.testIndex)||t.roundResistance.testIndex<0||!Number.isFinite(t.roundResistance.relief)||t.roundResistance.relief<=0||!t.changes.some(c=>c.key===t.roundResistance.key&&c.type==="add")||!["fr","en"].every(code=>t.roundResistance.summaryKey.split(".").reduce((value,key)=>value?.[key],lang[code]))))throw Error(`Invalid round resistance for ${key}`);
   if(JSON.stringify(t.disease??null)!==JSON.stringify(translated.disease??null))throw Error(`Unaligned disease for ${key}`);
   if(t.disease){const d=t.disease,formula=v=>typeof v==='string'&&/^\d+d\d+(?:\+\d+)?$/.test(v);
    if(!t.aura||!Number.isInteger(d.testIndex)||d.testIndex<0||!formula(d.incubation)||(d.kind==='sores'?(!formula(d.lesions)||!formula(d.daily)||!Number.isInteger(d.damagePer)||d.damagePer<=0):(d.kind!==undefined||!Number.isInteger(d.penalty)||d.penalty>=0||!formula(d.duration))))throw Error(`Invalid exposure disease for ${key}`);
   }
   if(t.periodic&&(!Number.isFinite(t.periodic.interval)||t.periodic.interval<=0||t.periodic.operation!=="heal"||!Number.isInteger(t.periodic.amount)||t.periodic.amount<=0))throw Error(`Invalid periodic consequence for ${key}`);
   if(JSON.stringify(t.summaryParts??null)!==JSON.stringify(translated.summaryParts??null))throw Error(`Unaligned summary components for ${key}`);
   if(JSON.stringify(t.aura??null)!==JSON.stringify(translated.aura??null))throw Error(`Unaligned aura for ${key}`);
   if(t.aura&&(!Number.isFinite(t.aura.radius)||t.aura.radius<0||!entry.powerLevels?.some(p=>p.optionId===t.aura.radiusOptionId)||typeof t.aura.light!=="boolean"||![undefined,"none"].includes(t.aura.recipientMode)))throw Error(`Invalid aura for ${key}`);
   if(JSON.stringify(t.displayPowerOptions??[])!==JSON.stringify(translated.displayPowerOptions??[]) || (t.displayPowerOptions??[]).some(i=>!Number.isInteger(i)||!entry.powerLevels?.[i]))throw Error(`Invalid displayed power options for ${key}`);
   if(t.summaryParts){
    const s=t.summaryParts,keys=[s.labelKey,...(s.overrideKey?[s.overrideKey]:[]),...(s.parts??[]).flatMap(p=>[p.singularKey,p.pluralKey])];
    const indices=[...(s.overrideIndex===undefined?[]:[s.overrideIndex]),...(s.parts??[]).map(p=>p.index)];
    if((s.overrideIndex===undefined)!==(s.overrideKey===undefined))throw Error(`Invalid summary override for ${key}`);
    if(!Array.isArray(s.parts)||!s.parts.length||keys.some(k=>typeof k!=="string"||!["fr","en"].every(c=>k.split(".").reduce((v,p)=>v?.[p],lang[c])))||indices.some(i=>!Number.isInteger(i)||!(entry.effectParameters??[]).some(p=>p.target==="summaryPart"&&p.index===i)))throw Error(`Invalid summary components for ${key}`);
   }
   if(t.onApply&&(!["fearReduction"].includes(t.onApply.operation)||!Array.isArray(t.onApply.formulas)||!t.onApply.formulas.length||!t.onApply.formulas.every(formula=>/^\d+d\d+(?:x>=\d+)?(?:\s*\+\s*\d+)?$/i.test(formula))))throw Error(`Invalid application consequence for ${key}`);
   if(t.instant&&(!["heal","createConsumable"].includes(t.instant.operation)||!Number.isInteger(t.instant.base)||t.instant.base<0))throw Error(`Invalid instant consequence for ${key}`);
   if(t.instant?.operation==='createConsumable'){
    const c=t.instant.consumable;
    if(!c||!c.nameKey||!c.descriptionKey||!Array.isArray(c.operations)||!c.operations.length||c.operations.some(op=>!['heal','fearReduction','resourceGain'].includes(op.operation)||typeof op.formula!=='string')
      ||!['days','hours','rounds','minutes'].includes(c.duration?.units)||!Number.isInteger(c.duration.value)||c.duration.value<1||!entry.powerLevels[c.duration.index]
      ||!Number.isInteger(c.duration.increment)||c.duration.increment<1||!entry.powerLevels[c.capacity?.index]||!Number.isInteger(c.capacity.base)||c.capacity.base<1||!Number.isInteger(c.capacity.max)||c.capacity.max<c.capacity.base||!Number.isInteger(c.capacity.increment)||c.capacity.increment<1)throw Error(`Invalid conjured consumable for ${key}`);
    for(const label of [c.nameKey,c.descriptionKey])if(!['fr','en'].every(code=>label.split('.').reduce((v,k)=>v?.[k],lang[code])))throw Error(`Untranslated conjured consumable: ${label}`);
   }
   if(!t.summary?.trim()||!translated.summary?.trim())throw Error(`Missing effect summary ${key}`);
   if(t.runeTiers){
    if(Boolean(t.requiresWeapon)!==Boolean(translated.requiresWeapon))throw Error(`Unaligned rune target ${key}`);
    if(!entry.isRune||t.runeTiers.length!==5||translated.runeTiers?.length!==5)throw Error(`Invalid rune tiers ${key}`);
    for(const [level,row]of t.runeTiers.entries()){
     const other=translated.runeTiers[level];
     const mechanics=({summary,description,...data})=>data;
     if(typeof row.duration!=="string"||!row.summary?.trim()||!row.description?.trim()||!other.summary?.trim()||!other.description?.trim()||!Array.isArray(row.changes)||row.changes.some(c=>!validProfileChange(c)||c.priority!==t.priority)
       ||(row.climbingBonus!==undefined&&(!Number.isFinite(row.climbingBonus)||row.climbingBonus<0))||(row.ruleTestBases!==undefined&&(!Array.isArray(row.ruleTestBases)||row.ruleTestBases.some(n=>!Number.isFinite(n))))
       ||JSON.stringify(mechanics(row))!==JSON.stringify(mechanics(other)))throw Error(`Unaligned rune tier ${key}:${level+1}`);
    }
   }
   if([...t.changes,...translated.changes].some(c=>!validProfileChange(c)))throw Error(`Invalid profile change ${key}`);
   if(translated.priority!==t.priority||(t.priority!==undefined&&(translated.changes??[]).some(c=>c.priority!==t.priority)))throw Error(`Unaligned EN effect priority ${key}`);
   if(JSON.stringify(t.statuses??[])!==JSON.stringify(translated.statuses??[])||JSON.stringify(t.related??[])!==JSON.stringify(translated.related??[]))throw Error(`Unaligned EN effect states or successors ${key}`);
   for(const c of ["fr","en"])references[c].push({key,sourceId:id,
     source:{...(c==="fr"?entry:englishEntry).source,name:(c==="fr"?entry:englishEntry).name},
     ...structuredClone(c==="fr"?t:translated),id:deterministicId(`effect-reference:${key}`),templateId:t.id,parameters:effectParameters(entry,t)});
   const sourceRules=rulesFromChanges(t.changes),translatedRules=rulesFromChanges(translated.changes);
   if(t.attackTooltip!==translated.attackTooltip || (t.attackTooltip!==undefined&&(!Number.isInteger(t.attackTooltip)||!sourceRules.attacks?.[t.attackTooltip])))throw Error(`Invalid attack tooltip for ${key}`);
   for(const id of sourceRules.powerIds??[])if(!powerIds.has(id))throw Error(`Unknown granted power ${id} in ${key}`);
   if(t.levelParameter){
    if(!Number.isFinite(t.levelParameter.default)||!(t.levelParameter.knowledge?.every(id=>typeof sourceRules.knowledge?.[id]==="number")||(t.levelParameter.note===true&&(entry.effectParameters??[]).some(p=>p.target==="note"&&Number(p.perLevel)>0))))throw Error(`Invalid level scaling in ${key}`);
   }
   const parameters=effectParameters(entry,t);
   if(JSON.stringify(entry.effectParameters??[])!==JSON.stringify(englishEntry.effectParameters??[]))throw Error(`Unaligned effect parameters for ${id}`);
   if(JSON.stringify(changeMechanics(t.changes))!==JSON.stringify(changeMechanics(translated.changes)))throw Error(`Unaligned EN effect mechanics for ${key}`);
   for(const p of parameters){
    if(!parameterTargets.has(p.target)||!entry.powerLevels?.[p.index])throw Error(`Invalid parameter ${p.target} in ${key}`);
    if(p.target==="instant"&&(!t.instant||!Number.isInteger(p.value)||p.value<0))throw Error(`Invalid instant improvement for ${key}`);
    if(p.target==="onApplyStep"&&!t.onApply)throw Error(`Application improvement without consequence for ${key}`);
    if(p.extraTerms&&(!Array.isArray(p.extraTerms)||p.target!=="note"||p.extraTerms.some(term=>!Number.isInteger(term.index)||!Number.isFinite(term.value)||entry.powerLevels?.[term.index]?.optionId!==term.optionId)))throw Error(`Invalid additional note terms for ${key}`);
    if(p.target==="note"&&(!Number.isFinite(p.base)||!Number.isFinite(p.value)||!/^TRUDVANG\.Transformation\.[A-Za-z]+$/.test(p.labelKey)||!["fr","en"].every(c=>p.labelKey.split(".").reduce((value,key)=>value?.[key],lang[c]))))throw Error(`Invalid note improvement for ${key}`);
    const native=path=>t.changes.some(c=>c.key===path||c.key.startsWith(path+"."));
    if(p.target==="temporaryHP"&&!native("system.resources.body.temporaryMax")&&sourceRules.temporaryHP===undefined)throw Error(`Temporary HP parameter without matching base in ${key}`);
    if(p.target==="outerProtection"&&!Number.isFinite(sourceRules.outerProtection))throw Error(`Outer protection parameter without matching base in ${key}`);
    if(p.target==="vitality"&&!sourceRules.vitality&&!(native("system.modifiers.bodyMax")&&native("system.modifiers.bodyValue")))throw Error(`Vitality parameter without matching base in ${key}`);
    if(p.target==="damage"&&!sourceRules.damage&&!native("system.modifiers.damage")&&!native("system.modifiers.damageByUsage"))throw Error(`Damage parameter without matching base in ${key}`);
    if(p.target==="traitDegrees"&&!sourceRules.traits?.some(r=>r.trait===p.trait&&r.method==="degrees"))throw Error(`Trait parameter without matching base in ${key}`);
    if(p.target==="traitValue"&&!sourceRules.traits?.some(r=>r.trait===p.trait))throw Error(`Trait value parameter without matching base in ${key}`);
    if(p.target==="attackStep"&&(!sourceRules.attacks?.[p.attack]||!p.steps?.length))throw Error(`Attack parameter without matching base in ${key}`);
    if(p.target==="senseRange"&&!Number.isFinite(sourceRules.senses?.[p.sense]?.range))throw Error(`Sense range parameter without matching base in ${key}`);
   }
   for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation[key]={Name:(c==="fr"?t:translated).name,Summary:(c==="fr"?t:translated).summary,Description:(c==="fr"?t:translated).description,
     SourceName:(c==="fr"?entry:englishEntry).name,SourceBook:(c==="fr"?entry:englishEntry).source.book,SourcePage:String((c==="fr"?entry:englishEntry).source.page),Duration:(c==="fr"?t:translated).duration,
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).attacks??[]).map((a,i)=>[`Attack${i}`,a.name])),
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).senses??[]).map((s,i)=>[`Sense${i}`,typeof s==="string"?s:s.label])),
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).capabilities??[]).map((s,i)=>[`Capability${i}`,s])),
     ...Object.fromEntries(((c==="fr"?t:translated).runeTiers??[]).flatMap((row,i)=>[[`RuneSummary${i+1}`,row.summary],[`RuneDescription${i+1}`,row.description]]))};
   const {name,summary,description,...data}=t;
   if(t.runeTiers)data.runeTiers=t.runeTiers.map(({summary,description,...row},i)=>({...row,summaryKey:`TRUDVANG.Content.Transformation.${key}.RuneSummary${i+1}`,descriptionKey:`TRUDVANG.Content.Transformation.${key}.RuneDescription${i+1}`}));
   const rules=structuredClone(sourceRules);
   data.changes=[...data.changes.filter(c=>!c.key.startsWith(EFFECT_RULE_PREFIX)),...changesFromRules({
     ...rules,
     ...(sourceRules.senses?{senses:sourceRules.senses.map((s,i)=>typeof s==="string"?`TRUDVANG.Content.Transformation.${key}.Sense${i}`:{...s,label:`TRUDVANG.Content.Transformation.${key}.Sense${i}`})}:{}),
     ...(sourceRules.capabilities?{capabilities:sourceRules.capabilities.map((s,i)=>`TRUDVANG.Content.Transformation.${key}.Capability${i}`)}:{}),
     ...(sourceRules.attacks?{attacks:sourceRules.attacks.map((a,i)=>({...a,name:`TRUDVANG.Content.Transformation.${key}.Attack${i}`}))}:{})
   },{priority:t.priority})];
   registry[key]={...data,sourceId:id,parameters};bySource[id].push(key);
  }
 }
}
for(const c of ["fr","en"])if(new Set(references[c].map(r=>r.name)).size!==references[c].length)throw Error(`Ambiguous effect names in ${c}`);
const output=`// Generated from authoritative FR effectTemplates. Text belongs to lang/*.json.\nexport const TRANSFORMATION_TEMPLATES = ${JSON.stringify(registry,null,2)};\nexport const TRANSFORMATIONS_BY_SOURCE = ${JSON.stringify(bySource,null,2)};\n`;
if(process.argv.includes("--check")){
 if(fs.readFileSync("modules/transformation-data.mjs","utf8")!==output)throw Error("Stale transformation catalogue");
 for(const c of ["fr","en"])if(JSON.stringify(read(`lang/${c}.json`).TRUDVANG.Content.Transformation)!==JSON.stringify(lang[c].TRUDVANG.Content.Transformation))throw Error(`Stale ${c} effects`);
 for(const c of ["fr","en"])if(JSON.stringify(read(`game doc/${c}/trudvang-effects-${c}.json`))!==JSON.stringify(references[c]))throw Error(`Stale ${c} effect reference JSON`);
}else{
 fs.writeFileSync("modules/transformation-data.mjs",output);
 for(const c of ["fr","en"])fs.writeFileSync(`lang/${c}.json`,JSON.stringify(lang[c],null,2)+"\n");
 for(const c of ["fr","en"])fs.writeFileSync(`game doc/${c}/trudvang-effects-${c}.json`,JSON.stringify(references[c],null,2)+"\n");
}
console.log(`${Object.keys(registry).length} effect variants, ${Object.keys(bySource).length} sources.`);
