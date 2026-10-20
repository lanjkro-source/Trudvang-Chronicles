import fs from "node:fs";
import {CREATURE_ABILITY_REFERENCES} from "../modules/creature-ability-data.mjs";
import {deterministicId} from "../modules/skill-pack-data.mjs";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const lang=Object.fromEntries(["fr","en"].map(c=>[c,read(`lang/${c}.json`)]));
const registry={}, bySource={};
const references={fr:[],en:[]};
for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation={};
for(const kind of ["powers","feats"]){
 const fr=read(`game doc/fr/trudvang-${kind}-fr.json`),en=read(`game doc/en/trudvang-${kind}-en.json`);
 if(fr.length!==en.length)throw Error(`Unaligned ${kind}`);
 for(const [i,entry]of fr.entries()){
  if(!entry.effectTemplates?.length)continue;
  const id=entry.catalogId||CREATURE_ABILITY_REFERENCES[entry.name]?.id;
  if(!id)throw Error(`Unknown effect source ${entry.name}`);
  bySource[id]=[];
  for(const [j,t]of entry.effectTemplates.entries()){
   const key=`${id}#${t.id}`;
   const translated=en[i].effectTemplates?.[j];
   if(!translated)throw Error(`Missing EN effect ${key}`);
   for(const c of ["fr","en"])references[c].push({key,sourceId:id,
     source:{...(c==="fr"?entry:en[i]).source,name:(c==="fr"?entry:en[i]).name},
     ...structuredClone(c==="fr"?t:translated),id:deterministicId(`effect-reference:${key}`),templateId:t.id,parameters:/recovery|exhaustion/.test(t.id)?[]:entry.effectParameters??[]});
   for(const c of ["fr","en"])lang[c].TRUDVANG.Content.Transformation[key]={Name:(c==="fr"?t:translated).name,Description:(c==="fr"?t:translated).description,
     SourceName:(c==="fr"?entry:en[i]).name,SourceBook:(c==="fr"?entry:en[i]).source.book,SourcePage:String((c==="fr"?entry:en[i]).source.page),Duration:(c==="fr"?t:translated).duration,
     ...Object.fromEntries(((c==="fr"?t:translated).rules.attacks??[]).map((a,i)=>[`Attack${i}`,a.name])),
     ...Object.fromEntries(((c==="fr"?t:translated).rules.senses??[]).map((s,i)=>[`Sense${i}`,s])),
     ...Object.fromEntries(((c==="fr"?t:translated).rules.capabilities??[]).map((s,i)=>[`Capability${i}`,s]))};
   const {name,description,...data}=t;
   const rules=structuredClone(data.rules);
   if(rules.senses){rules.senseCount=rules.senses.length;if(rules.senses.some(s=>/noir/i.test(s)))rules.vision??="darkvision";else if(rules.senses.some(s=>/nocturne/i.test(s)))rules.vision??="lightAmplification";delete rules.senses;}
   if(rules.capabilities){rules.capabilityCount=rules.capabilities.length;delete rules.capabilities;}
   if(rules.attacks)rules.attacks=rules.attacks.map(({name,...attack})=>attack);
   data.rules=rules;
   registry[key]={...data,sourceId:id,parameters:/recovery|exhaustion/.test(t.id)?[]:entry.effectParameters??[]};bySource[id].push(key);
  }
 }
}
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
