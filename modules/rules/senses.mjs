/** Sensory profiles are actor data; only night/dark vision affect Foundry sight. */
export function normalizeSense(value){
 const row=typeof value==="string"?{label:value}:value??{};
 const label=String(row.label??row.labelKey??"");
 const text=label.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();
 const type=row.type??(/vision normale|normal sight/.test(text)?"normal":/nocturne|night.?s? sight|night vision/.test(text)?"night":/noir|darkvision|dark vision/.test(text)?"dark":"other");
 const distances=[...text.matchAll(/(\d+)\s*m(?:et|è|\b)/g)].map(m=>Number(m[1]));
 const range=row.range===null?null:row.range!==undefined&&row.range!==""?Math.max(0,Number(row.range)||0):distances.length?Math.max(...distances):null;
 return {type,label,range,enabled:row.enabled!==false};
}
export function intrinsicSenses(actor){
 const source=actor.system.senses;
 const base=Array.from(source??[{type:"normal",label:"",range:null,enabled:true}]).map(normalizeSense);
 // Existing worlds can still obtain their sensory capacities from their documents.
 for(const item of [...actor.items??[],...actor.effects??[]]){
  if(item.disabled||item.isSuppressed||item.duration?.expired)continue;
  if(item.type!=="creatureAbility"&&!item.flags?.["trudvang-chronicles"]?.feat)continue;
  if(/^(vision|vue|perception de|night.?s? sight|night vision|darkvision|thermal vision|life sense)/i.test(item.name??"")){
   const sense=normalizeSense(item.name);
   if(!base.some(s=>s.type===sense.type&&s.range===sense.range&&(s.type!=="other"||s.label===sense.label)))base.push(sense);
  }
 }
 return base;
}
export function sensoryProfile(actor,effects=[]){
 const base=intrinsicSenses(actor);
 for(const {rules,name}of effects){
  const senses=(rules.senses??[]).map(normalizeSense);
  if(rules.sensesReplace)base.splice(0,base.length);
  base.push(...senses.map(s=>({...s,source:name})));
  if(rules.vision&&!senses.some(s=>["night","dark"].includes(s.type)))base.push({type:rules.vision==="lightAmplification"?"night":"dark",label:"",range:null,enabled:true,source:name});
 }
 return base.filter((s,i,all)=>all.findIndex(x=>x.type===s.type&&x.label===s.label&&x.range===s.range&&x.enabled===s.enabled&&x.source===s.source)===i);
}
export function sensoryVision(senses){
 const rows=senses.filter(s=>s.enabled&&["night","dark"].includes(s.type));
 return rows.length?{mode:"darkvision",range:rows.some(s=>s.range===null)?null:Math.max(...rows.map(s=>s.range))}:null;
}
export function sensoryRows(actor,{localize=key=>key}={}){
 const profile=actor.transformationProfile?.sensory??sensoryProfile(actor);
 return profile.map(s=>({...s,label:s.label?localize(s.label):localize(`TRUDVANG.Senses.Types.${s.type}`),rangeLabel:s.range===null?localize("TRUDVANG.Senses.Unlimited"):game.i18n.format("TRUDVANG.Senses.Meters",{range:s.range})}));
}
export function sensoryText(actor,{localize=key=>key}={}){
 const senses=(actor.transformationProfile?.sensory??sensoryProfile(actor)).filter(s=>s.enabled);
 const selected=senses.some(s=>s.type!=="normal")?senses.filter(s=>s.type!=="normal"):senses;
 return [...new Set(selected.map(s=>s.type!=="other"?localize(`TRUDVANG.Senses.Types.${s.type}`):localize(s.label)))]
  .map(label=>label.charAt(0).toLocaleLowerCase()+label.slice(1)).join(", ");
}

/** Partial updates preserve unrelated detection modes and later manual edits. V14
 * detectionModes is a keyed TypedObjectField, not the old array of mode objects. */
export function tokenVisionUpdate(token,vision){
 const scope="trudvang-chronicles",flag=`flags.${scope}.transformationVision`;
 const saved=token.flags?.[scope]?.transformationVision;
 const get=path=>path.split('.').reduce((o,k)=>o?.[k],token);
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const deletion=()=>foundry.data.operators.ForcedDeletion.create();
 const changes={};
 if(vision){
  const scene=token.parent??token.scene;
  const units=String(scene?.grid?.units??"m").toLowerCase();
  const scale=/^(ft|feet|foot|pi|pieds?)$/.test(units)?1/0.3048:/^(km|kilom)/.test(units)?0.001:1;
  const range=vision.range===null?null:Math.round((vision.range*scale+Number.EPSILON)*100)/100;
  const unlimited=Math.hypot(scene?.dimensions?.width??scene?.width??0,scene?.dimensions?.height??scene?.height??0)/(scene?.grid?.size||1)*(scene?.grid?.distance||1);
  const desired={"sight.enabled":true,"sight.visionMode":"darkvision","sight.range":range??Math.max(unlimited,Number(saved?.before?.["sight.range"]??token.sight?.range)||0),
   ...Object.fromEntries(Object.entries(globalThis.CONFIG?.Canvas?.visionModes?.darkvision?.vision?.defaults??{saturation:-1,attenuation:0}).map(([k,v])=>[`sight.${k}`,v])),
   "detectionModes.darkvision.enabled":true,"detectionModes.darkvision.range":range};
  const before=typeof saved?.before==="object"?{...saved.before}:saved?{"sight.visionMode":saved.before}:{};
  for(const [path,value]of Object.entries(desired)){
   if(!Object.hasOwn(before,path))before[path]=get(path)??null;
   // Token configuration edits persist until the granted sensory profile changes.
   if(!equal(get(path),value)&&(!saved||!equal(saved.applied?.[path],value)))changes[path]=value;
  }
  const state={before,applied:desired};
  if(!equal(saved,state))changes[flag]=state;
 }else if(saved){
  const before=typeof saved.before==="object"?saved.before:{"sight.visionMode":saved.before};
  const applied=typeof saved.applied==="object"?saved.applied:{"sight.visionMode":saved.applied};
  for(const [path,value]of Object.entries(before))if(equal(get(path),applied[path])){
   changes[path]=value===null&&path.endsWith('.enabled')?false:value;
  }
  // Remove only our detection row when it did not exist before application.
  if(before["detectionModes.darkvision.enabled"]===null&&equal(get("detectionModes.darkvision.enabled"),applied["detectionModes.darkvision.enabled"])&&equal(get("detectionModes.darkvision.range"),applied["detectionModes.darkvision.range"])){
   delete changes["detectionModes.darkvision.enabled"];delete changes["detectionModes.darkvision.range"];
   changes["detectionModes.darkvision"]=deletion();
  }
  changes[flag]=deletion();
 }
 return changes;
}
