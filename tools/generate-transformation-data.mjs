import fs from "node:fs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";
import {rulesFromChanges,changesFromRules,EFFECT_RULE_PREFIX,validProfileChange} from "../modules/rules/effect-rule-changes.mjs";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const lang=Object.fromEntries(["fr","en"].map(c=>[c,read(`lang/${c}.json`)]));
const registry={}, bySource={};
const references={fr:[],en:[]};
const powerIds=new Set(read("game doc/fr/trudvang-powers-fr.json").map(p=>p.catalogId));
const parameterTargets=new Set(["duration","vitality","temporaryHP","protection","damage","traitDegrees","traitValue","modifier","fearFactor","attackStep"]);
const effectParameters=(entry,t)=>/recovery|exhaustion/.test(t.id)?[]:(entry.effectParameters??[]).filter(p=>!p.templates||p.templates.includes(t.id));
for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation={};
for(const kind of ["powers","feats"]){
 const fr=read(`game doc/fr/trudvang-${kind}-fr.json`),en=read(`game doc/en/trudvang-${kind}-en.json`);
 if(fr.length!==en.length)throw Error(`Unaligned ${kind}`);
 for(const [i,entry]of fr.entries()){
  if(!entry.effectTemplates?.length)continue;
  if(kind==="powers")for(const t of entry.effectTemplates){
   if(t.priority!==10*entry.level||(t.changes??[]).some(c=>c.priority!==t.priority))throw Error(`Invalid effect priority for ${entry.name}`);
  }
  const id=entry.catalogId||CREATURE_ABILITY_REFERENCES[entry.name]?.id;
  if(!id)throw Error(`Unknown effect source ${entry.name}`);
  for(const p of entry.effectParameters??[])if(p.templates?.some(id=>!entry.effectTemplates.some(t=>t.id===id)))throw Error(`Unknown effect variant in parameters for ${entry.name}`);
  bySource[id]=[];
  for(const [j,t]of entry.effectTemplates.entries()){
   const key=`${id}#${t.id}`;
   const translated=en[i].effectTemplates?.[j];
   if(!translated)throw Error(`Missing EN effect ${key}`);
   if(!t.summary?.trim()||!translated.summary?.trim())throw Error(`Missing effect summary ${key}`);
   if([...t.changes,...translated.changes].some(c=>!validProfileChange(c)))throw Error(`Invalid profile change ${key}`);
   if(translated.priority!==t.priority||(t.priority!==undefined&&(translated.changes??[]).some(c=>c.priority!==t.priority)))throw Error(`Unaligned EN effect priority ${key}`);
   for(const c of ["fr","en"])references[c].push({key,sourceId:id,
     source:{...(c==="fr"?entry:en[i]).source,name:(c==="fr"?entry:en[i]).name},
     ...structuredClone(c==="fr"?t:translated),id:deterministicId(`effect-reference:${key}`),templateId:t.id,parameters:effectParameters(entry,t)});
   const sourceRules=rulesFromChanges(t.changes),translatedRules=rulesFromChanges(translated.changes);
   for(const id of sourceRules.powerIds??[])if(!powerIds.has(id))throw Error(`Unknown granted power ${id} in ${key}`);
   if(t.levelParameter){
    if(!Number.isFinite(t.levelParameter.default)||!t.levelParameter.knowledge?.every(id=>typeof sourceRules.knowledge?.[id]==="number"))throw Error(`Invalid level scaling in ${key}`);
   }
   const parameters=effectParameters(entry,t);
   if(JSON.stringify(entry.effectParameters??[])!==JSON.stringify(en[i].effectParameters??[]))throw Error(`Unaligned effect parameters for ${id}`);
   for(const p of parameters){
    if(!parameterTargets.has(p.target)||!entry.powerLevels?.[p.index])throw Error(`Invalid parameter ${p.target} in ${key}`);
    const native=path=>t.changes.some(c=>c.key===path||c.key.startsWith(path+"."));
    if(p.target==="temporaryHP"&&!native("system.resources.body.temporaryMax")&&sourceRules.temporaryHP===undefined)throw Error(`Temporary HP parameter without matching base in ${key}`);
    if(p.target==="vitality"&&!sourceRules.vitality&&!(native("system.modifiers.bodyMax")&&native("system.modifiers.bodyValue")))throw Error(`Vitality parameter without matching base in ${key}`);
    if(p.target==="damage"&&!sourceRules.damage&&!native("system.modifiers.damage")&&!native("system.modifiers.damageByUsage"))throw Error(`Damage parameter without matching base in ${key}`);
    if(p.target==="traitDegrees"&&!sourceRules.traits?.some(r=>r.trait===p.trait&&r.method==="degrees"))throw Error(`Trait parameter without matching base in ${key}`);
    if(p.target==="traitValue"&&!sourceRules.traits?.some(r=>r.trait===p.trait))throw Error(`Trait value parameter without matching base in ${key}`);
    if(p.target==="attackStep"&&(!sourceRules.attacks?.[p.attack]||!p.steps?.length))throw Error(`Attack parameter without matching base in ${key}`);
   }
   for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation[key]={Name:(c==="fr"?t:translated).name,Summary:(c==="fr"?t:translated).summary,Description:(c==="fr"?t:translated).description,
     SourceName:(c==="fr"?entry:en[i]).name,SourceBook:(c==="fr"?entry:en[i]).source.book,SourcePage:String((c==="fr"?entry:en[i]).source.page),Duration:(c==="fr"?t:translated).duration,
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).attacks??[]).map((a,i)=>[`Attack${i}`,a.name])),
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).senses??[]).map((s,i)=>[`Sense${i}`,s])),
     ...Object.fromEntries(((c==="fr"?sourceRules:translatedRules).capabilities??[]).map((s,i)=>[`Capability${i}`,s]))};
   const {name,summary,description,...data}=t;
   const rules=structuredClone(sourceRules);
   data.changes=[...data.changes.filter(c=>!c.key.startsWith(EFFECT_RULE_PREFIX)),...changesFromRules({
     ...rules,
     ...(sourceRules.senses?{senses:sourceRules.senses.map((s,i)=>`TRUDVANG.Content.Transformation.${key}.Sense${i}`)}:{}),
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
