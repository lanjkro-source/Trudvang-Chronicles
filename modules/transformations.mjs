import {TRANSFORMATION_TEMPLATES,TRANSFORMATIONS_BY_SOURCE} from "./transformation-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";
import {BESTIARY_ENTRIES} from "./bestiary-catalog-data.mjs";
import {escapeHtml,escapeAttribute} from "./helpers.mjs";
import {activeTransformations,effectRules,transformedTrait,transformationProfile,TRANSFORMATION_SCOPE as SCOPE} from "./rules/transformation-profile.mjs";
import {changesFromRules,rulesFromChanges,hasProfileChanges,validProfileChange,EFFECT_RULE_PREFIX} from "./rules/effect-rule-changes.mjs";
import {effectSource} from "./rules/effect-source.mjs";
import {creatureTokenDimensions} from "./rules/creature-token-size.mjs";
import {TABLET_CATALOG,powerItemData} from "./tablet-catalog.mjs";
import {TRUDVANG} from "./config.mjs";
import {ruleTestCastingContext,withCastingCounts,currentCastingCounts,ruleTestSourceId} from "./rules/magic-resistance.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {magicResistancePreview} from "./magic-resistance-preview.mjs";
import {normalizeSense,sensoryVision,tokenVisionUpdate} from "./rules/senses.mjs";
import {SURPRISED_ITEM, applySurprised} from "./combat-effects.mjs";
import {GRADED_EFFECT_IDS} from "./rules/effect-stacking.mjs";
import {applyGradedEffect} from "./graded-effects.mjs";
import {normalizeEffectDuration, addDurationSeconds} from "./rules/effect-duration.mjs";
import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";
import {requestAllocatedEffect} from "./maintained-spell-tracking.mjs";
import {magicTargetCapacity} from "./rules/magic-target-allocation.mjs";
const local = key => game.i18n.localize(`TRUDVANG.Transformation.${key}`);
const text = (key,field) => game.i18n.localize(`TRUDVANG.Content.Transformation.${key}.${field}`);
const metadata = doc => doc?.flags?.[SCOPE]?.transformation;
const sourceId = doc => doc?.system?.catalogId || CREATURE_ABILITY_REFERENCES[doc?.name]?.id;
function transformationCasting(document,counts,context){
 const saved=context??metadata(document)?.ruleTestContext;
 if(saved?.countsById&&saved.sourceId===ruleTestSourceId(document)){
  const casting=ruleTestCastingContext(document,{context:saved});
  casting.counts=currentCastingCounts(casting);
  return casting;
 }
 return ruleTestCastingContext(document,{counts,context});
}
export function transformationKeys(document){
 const meta=metadata(document);
 if(meta)return (meta.related??[]).map(id=>`${meta.sourceId}#${id}`).filter(key=>TRANSFORMATION_TEMPLATES[key]);
 const id=sourceId(document);
 return TRANSFORMATION_TEMPLATES[id]?[id]:TRANSFORMATIONS_BY_SOURCE[id]??[];
}
export function transformationLinks(document,counts=[],{context}={}){
 const casting=transformationCasting(document,counts,context);
 return transformationKeys(document).map(key=>`<button type="button" draggable="true" class="trudvang-transformation-link" data-transformation-key="${escapeAttribute(key)}" data-transformation-counts="${escapeAttribute(JSON.stringify(casting.counts))}" data-rule-test-context="${escapeAttribute(JSON.stringify(casting))}" data-transformation-source="${escapeAttribute(document.uuid||"")}" title="${escapeAttribute(local("DragHint"))}"><i class="fas fa-person-rays" aria-hidden="true"></i> ${escapeHtml(text(key,"Name"))}</button>`).join(" ");
}
export function annotateTransformationDescription(description,document){
 const links=transformationLinks(document);
 return links?`${description}<div class="trudvang-transformation-links">${links}</div>`:description;
}
async function askFields(title,fields,preview=()=>"",intro=""){
 const defaults=Object.fromEntries(fields.map(f=>[f.name,f.value]));
 const content=`<div>${intro?`<p>${escapeHtml(intro)}</p>`:""}${fields.map(f=>`<div class="form-group"><label>${escapeHtml(f.label)}</label>${f.options?`<select name="${f.name}">${f.options.map(o=>`<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("")}</select>`:`<input name="${f.name}" type="text" value="${escapeHtml(String(f.value??""))}">`}</div>`).join("")}<div data-resistance-preview>${preview(defaults)}</div></div>`;
 const Base=foundry.applications.api.DialogV2;
 const DialogClass=typeof Base!=="function"?Base:class extends Base{
  _onRender(context,options){super._onRender(context,options);const root=this.element;
   const refresh=()=>{const values=Object.fromEntries(fields.map(f=>[f.name,root.querySelector(`[name="${f.name}"]`)?.value??f.value]));const output=root.querySelector("[data-resistance-preview]");if(output)output.innerHTML=preview(values);};
   root.addEventListener("input",refresh);refresh();
  }
 };
 return DialogClass.wait({window:{title},content,buttons:[{action:"apply",label:local("Apply"),default:true,callback:(event,button)=>({action:"apply",...Object.fromEntries(new FormData(button.form))})},{action:"cancel",label:local("Cancel"),callback:()=>false}],close:()=>false});
}
function naturalWeapon(row,effectId){
 return {name:row.name,type:"weapon",img:"icons/svg/sword.svg",system:{category:"natural",combatSpecialty:"natural",equipped:true,strengthApplies:true,quantity:1,damage:row.damage,openRoll:row.openRoll??0,naturalCombatPool:row.name,naturalCombatPoints:row.combatPoints??0,weaponActions:row.maxActions||4},flags:{[SCOPE]:{transformationGrant:effectId}}};
}
export function selectFormData(form,policy){
 const s=form.actor.system;
 const meters=value=>Number.parseFloat(String(value??"").replace(",","."))||0;
 const r={size:s.details.size||1,traits:[],movement:[{mode:"all",method:"replace",value:0,metersPerTwo:0},...(s.details.move??[]).map(row=>({mode:({terrestre:"land",vol:"flight",nage:"swim"}[row.mode]??row.mode),method:"replace",value:meters(row.max),metersPerTwo:meters(row.distance)}))]};
 const keep=policy==="physical"?["intelligence","constitution","psyche"]:["intelligence"];
 for(const trait of Object.keys(TRUDVANG.traits))if(!keep.includes(trait))r.traits.push({trait,method:"replace",value:Number(s.traits?.[trait]??0)});
 r.attacks=form.actor.items.filter(i=>i.type==="weapon"&&i.system.category==="natural").map(i=>({name:game.i18n.localize(i.nameKey),damage:i.system.damage,openRoll:i.system.openRoll,combatPoints:i.system.naturalCombatPoints}));
 r.naturalArmor=Number(s.details.naturalArmor)||0;
 r.senses=structuredClone(s.senses??form.featIds.map(id=>Object.entries(CREATURE_ABILITY_REFERENCES).find(([,v])=>v.id===id)).filter(row=>/^(Vision|Vue|Perception de)/.test(row?.[0]??"")).map(([name])=>normalizeSense(name)))
  .map(s=>normalizeSense({...s,label:game.i18n.localize(s.label??s.labelKey??"")}));
 r.sensesReplace=true;
 return {rules:r,maximum:Number(s.resources.body.max)};
}
export async function applyTransformation(actor,key,{source=null,elapsed=0,counts=[],context}={}){
 if(key===SURPRISED_ITEM)return applySurprised(actor,source);
 if(GRADED_EFFECT_IDS.has(key))return applyGradedEffect(actor,source);
 if(!actor?.canUserModify(game.user,"update")){ui.notifications.warn(local("Permission"));return null;}
 const reference=TRANSFORMATION_TEMPLATES[key];if(!reference)throw Error(`Unknown transformation ${key}`);
 const casting=transformationCasting(source??{system:{catalogId:reference.sourceId}},counts,context);
 counts=casting.counts;
 const stackId=casting.castingId&&casting.casterUuid?`${key}::${casting.casterUuid}::${casting.castingId}`:key;
 // A related-effect link keeps its originating document for ownership, elapsed
 // duration and provenance. Its data belongs to a different effect, however.
 // Unidentified custom effects remain copyable; identified ones must match.
 const sourceKey=metadata(source)?.key||source?.system?.stackId;
 const supplied=source?.documentName==="ActiveEffect"&&(!sourceKey||sourceKey===key)?source:source?.documentName==="Item"&&source.type==="effect"
  ?Array.from(source.effects??[]).find(e=>metadata(e)?.key===key):null;
 const stored=supplied?effectSource(supplied):null;
 const template=stored?{...reference,changes:stored.system.changes,statuses:Array.from(stored.statuses??[]),icon:stored.img??reference.icon}:reference;
 // TEMPORARY WORLD MIGRATION — pre-0.97 references kept dynamic rules in flags.
 // Convert only that historical format on the new copy. Never refill rows that
 // the GM deliberately cleared in the current editable format.
 const legacy=metadata(stored);
 if(legacy?.rules&&!legacy.editableChanges&&!hasProfileChanges(stored)){
  const rules=structuredClone(legacy.rules),defaults=rulesFromChanges(reference.changes);
  if(rules.traitsApplied)delete rules.traits;
  else if(rules.traits)rules.traits=rules.traits.map(row=>{
   const current=defaults.traits?.find(r=>r.trait===row.trait&&r.method===row.method);
   return current?.skillBonus&&!row.skillBonus?{...row,skillBonus:structuredClone(current.skillBonus)}:row;
  });
  if(rules.senseCount)rules.senses=defaults.senses;
  if(rules.capabilityCount)rules.capabilities=defaults.capabilities;
  template.changes.push(...changesFromRules(rules,{priority:reference.priority}));
 }
 // Invalid structured rows must not be stripped and silently create an empty
 // effect. Keep the same validation/error as the effect editor.
 for(const row of template.changes)if(!validProfileChange(row))throw new Error(game.i18n.format("TRUDVANG.Effect.InvalidProfileChange",{path:row.key}));
 const effectName=supplied?.name||text(key,"Name");
 const rules=rulesFromChanges(template.changes);
 if(rules.senses)rules.senses=rules.senses.map(s=>typeof s==="string"?game.i18n.localize(s):({...s,label:game.i18n.localize(s.label??s.labelKey??"")}));
 if(rules.capabilities)rules.capabilities=rules.capabilities.map(s=>game.i18n.localize(s));
 if(rules.attacks)rules.attacks=rules.attacks.map(a=>({...a,name:game.i18n.localize(a.name)}));
 const resolvedCopy=Boolean(metadata(supplied)?.resolved||metadata(supplied)?.appliedAt!==undefined);
 const targeting=!resolvedCopy&&casting.castingId&&casting.casterUuid?POWER_DETAILS_BY_ID[template.sourceId]?.targeting:null;
 let allocationRecord=null,allocationIntro="",availableById={};
 if(targeting){
  const caster=await foundry.utils.fromUuid(casting.casterUuid);
  allocationRecord=Array.from(caster?.system?.activeSpellCastings??[]).find(row=>row.id===casting.castingId);
  if(!allocationRecord)throw Error(game.i18n.localize("TRUDVANG.Warning.MagicAllocationUnavailable"));
  const others=Array.from(allocationRecord.targetAllocations??[]).filter(row=>row.targetUuid!==actor.uuid);
  const own=Array.from(allocationRecord.targetAllocations??[]).find(row=>row.targetUuid===actor.uuid);
  const chosen=Object.fromEntries(Array.from(allocationRecord.powerLevelSnapshot??[],row=>[row.id,Number(row.count)||0]));
  const already=Object.fromEntries(Array.from(own?.counts??[],row=>[row.optionId,Number(row.count)||0]));
  const options=POWER_DETAILS_BY_ID[template.sourceId]?.powerLevels??[];
  availableById=Object.fromEntries(options.map(option=>[option.id,Math.max(0,(chosen[option.id]??0)-others.reduce((sum,row)=>sum+Array.from(row.counts??[]).filter(c=>c.optionId===option.id).reduce((n,c)=>n+Number(c.count||0),0),0))]));
  counts=options.map(option=>own?(already[option.id]??0):availableById[option.id]);
  allocationIntro=game.i18n.format("TRUDVANG.Transformation.AllocationTargets",{used:Array.from(allocationRecord.targetAllocations??[]).length,max:magicTargetCapacity(targeting,chosen)});
  Object.assign(casting,withCastingCounts(casting,counts));
 }
 let durationText=resolvedCopy&&stored?.duration?.value!=null?`${stored.duration.value} ${stored.duration.units||"seconds"}`:template.duration??"";
 if(!/^\s*\d/.test(durationText))durationText="";
 if(rules.durationFromElapsed&&elapsed)durationText=`${elapsed*rules.durationFromElapsed} seconds`;
 const fields=[{name:"duration",label:local("Duration"),value:durationText}];
 const indices=[...new Set([...(resolvedCopy?[]:template.parameters??[]).map(p=>p.index),...(/recovery|exhaustion/.test(template.id)?[]:(RULE_TESTS_BY_CATALOG_ID[template.sourceId]??[]).flatMap(t=>(t.powerLevelModifiers??[]).map(p=>p.index)))])];
 for(const index of indices){const label=game.i18n.localize(`TRUDVANG.Content.Power.${template.sourceId}.PowerLevels.${index}`),id=POWER_DETAILS_BY_ID[template.sourceId]?.powerLevels?.[index]?.id;
  fields.push({name:`boost${index}`,label:targeting?`${label} — ${game.i18n.format("TRUDVANG.Transformation.AllocationAvailable",{count:availableById[id]??0})}`:label,value:counts[index]??0});}
 if(rules.unarmedDamage)fields.push({name:"runeLevel",label:local("RuneLevel"),value:Math.max(1,counts.findLastIndex(n=>Number(n)>0)+1)});
 if(!resolvedCopy&&template.levelParameter){
  const caster=source?.actor??(source?.parent?.documentName==="Actor"?source.parent:actor);
  const tablet=Array.from(caster.items??[]).find(i=>i.type==="tablet"&&i.system.catalogId===template.sourceId.split(":")[0]);
  fields.push({name:"powerLevel",label:game.i18n.localize(template.levelParameter.labelKey),value:Number(tablet?.system.level)||template.levelParameter.default});
 }
 if(rules.extraWeaponAction)fields.push({name:"weapon",label:local("Weapon"),options:Array.from(actor.items??[]).filter(i=>i.type==="weapon"&&!i.flags?.[SCOPE]?.extraWeaponAction).map(i=>({value:i.id,label:i.name}))});
 if(rules.chooseBestiary)fields.unshift({name:"form",label:local("Form"),options:BESTIARY_ENTRIES.map(e=>({value:e.id,label:game.i18n.localize(`TRUDVANG.Content.Creature.${e.id}.Name`)}))});
 const preview=values=>magicResistancePreview(withCastingCounts(casting,Object.assign([...counts],Object.fromEntries(indices.map(i=>[i,Math.max(0,Number(values[`boost${i}`])||0)])))));
 const answers=await askFields(effectName,fields,preview,allocationIntro);if(!answers||typeof answers!=="object"||(answers.action&&answers.action!=="apply"))return null;
 for(const index of indices)casting.counts[index]=Math.max(0,Number(answers[`boost${index}`]??counts[index])||0);
 Object.assign(casting,withCastingCounts(casting,casting.counts));
 let formMaximum;
 if(rules.chooseBestiary||rules.formName){
  const form=BESTIARY_ENTRIES.find(e=>e.id===answers.form)||BESTIARY_ENTRIES.find(e=>game.i18n.localize(`TRUDVANG.Content.Creature.${e.id}.Name`)===rules.formName);
  if(!form)throw Error(`Missing bestiary form ${rules.formName}`);
  const selected=selectFormData(form,rules.formPolicy);
  Object.assign(rules,selected.rules);
  if(!rules.preserveHP)formMaximum=selected.maximum;
 }
 const duration=await resolveDuration(answers.duration,{actor,name:`${effectName} — ${local("Duration")}`});
  const changes=structuredClone(template.changes??[]).filter(c=>!c.key.startsWith(EFFECT_RULE_PREFIX));
 if(Number.isFinite(formMaximum))changes.push({key:"system.resources.body.max",type:"override",value:String(formMaximum),phase:"initial"});
 if(!resolvedCopy&&template.levelParameter)for(const id of template.levelParameter.knowledge??[])if(rules.knowledge?.[id]!==undefined)rules.knowledge[id]*=Math.max(0,Number(answers.powerLevel??template.levelParameter.default)||0);
 const addVitality=amount=>{for(const field of ["bodyMax","bodyValue"]){
  const key=`system.modifiers.${field}`,row=changes.find(c=>c.key===key&&c.type==="add");
  if(row)row.value=String(Number(row.value)+amount);
  else changes.push({key,type:"add",value:String(amount),phase:"initial"});
 }};
 for(const p of resolvedCopy?[]:template.parameters??[]){
  const count=Math.max(0,Number(answers[`boost${p.index}`]??counts[p.index])||0);if(!count)continue;
  if(p.target==="duration")Object.assign(duration,addDurationSeconds(duration,count*p.value));
  if(p.target==="senseRange"&&rules.senses?.[p.sense])rules.senses[p.sense].range+=count*p.value;
  if(p.target==="traitDegrees")for(const row of rules.traits??[])if(row.trait===p.trait&&row.method==="degrees")row.value+=Math.sign(row.value||1)*count*p.value;
  if(p.target==="traitValue")for(const row of rules.traits??[])if(row.trait===p.trait)row.value+=count*p.value;
  if(p.target==="modifier"){
   const row=changes.find(c=>c.key===p.key&&c.type==="add");
   if(row)row.value=String(Number(row.value)+count*p.value);
   else changes.push({key:p.key,type:"add",value:String(count*p.value),phase:"initial"});
  }
  if(p.target==="fearFactor")rules.fearFactor=p.value;
  if(p.target==="attackStep"&&rules.attacks?.[p.attack])Object.assign(rules.attacks[p.attack],p.steps[Math.min(p.steps.length-1,Math.trunc(count))]);
  if(p.target==="vitality")addVitality(count*p.value);
  if(p.target==="temporaryHP"){const row=changes.find(c=>c.key==="system.resources.body.temporaryMax");if(row)row.value=String(Number(row.value)+count*p.value);else rules.temporaryHP=(rules.temporaryHP??0)+count*p.value;}
  if(p.target==="protection"){
   const row=changes.find(c=>c.key==="system.modifiers.protection"&&c.type==="add");
   if(row)row.value=String(Number(row.value)+count*p.value);
   else changes.push({key:"system.modifiers.protection",type:"add",value:String(count*p.value),phase:"initial"});
  }
  if(p.target==="damage"){
   const keys=p.usages?.map(u=>`system.modifiers.damageByUsage.${u}`);
   const rows=changes.filter(c=>keys?keys.includes(c.key):c.key==="system.modifiers.damage"||c.key.startsWith("system.modifiers.damageByUsage."));
   if(keys)for(const key of keys){const row=rows.find(c=>c.key===key);if(row)row.value=String(Number(row.value)+count*p.value);else changes.push({key,type:"add",value:String(count*p.value),phase:"initial"});}
   else if(rows.length)for(const row of rows)row.value=String(Number(row.value)+count*p.value);
   else{rules.damage??={value:0,usages:["melee","throwing","natural"]};rules.damage.value+=count*p.value;}
  }
 }
 if(rules.vitality){addVitality(await rollEffectValue(rules.vitality,{actor,name:effectName}));delete rules.vitality;}
 // Replacing a dynamic effect must resolve against the actor without the old
 // instance. A detached clone retains all other effects and equipment; it never
 // deletes the live effect before the replacement has been prepared.
 const replacing=(rules.traits?.length&&Array.from(actor.effects??[]).some(e=>e.system?.stackId===stackId));
 const traitActor=replacing?await actor.clone({effects:Array.from(actor.effects).filter(e=>e.system?.stackId!==stackId).map(e=>effectSource(e))},{keepId:true}):actor;
  for(const row of rules.traits??[]){
    const base=Number(traitActor.getTraitValue(row.trait)||0);
    const numeric=row.method==="degrees"||row.min!==undefined||row.max!==undefined;
    const result=transformedTrait(base,row);
    changes.push({key:`system.effective.traits.${row.trait}`,type:numeric||row.method==="replace"?"override":row.method==="highest"?"upgrade":"add",value:String(numeric?result:row.value),phase:"initial"});
    // Some spells supply their own skill-VC table in addition to the trait's
    // situation/movement modifier. Resolve it into editable native changes,
    // attributed to this effect by the normal skill breakdown and roll paths.
    const bonus=row.skillBonus?.values?.[String(result)];
    if(Number.isFinite(bonus))for(const skill of row.skillBonus.skills??[]){
      changes.push({key:`system.effective.skills.${skill}`,type:"add",value:String(bonus),phase:"initial"});
    }
  }
  delete rules.traits;
 delete rules.chooseBestiary;delete rules.formName;delete rules.formPolicy;
 if(rules.unarmedDamage){
  const level=Math.min(4,Math.max(0,(Number(answers.runeLevel)||1)-1)),row=rules.unarmedDamage[level];
  const attack=typeof row==="string"?{damage:row,openRoll:level===4?9:level===3?10:0}:row;
  (rules.attacks??=[]).push({name:text(key,"Name"),...attack,isUnarmed:true});
  delete rules.unarmedDamage;
 }
 if(rules.extraWeaponAction){
  const chosen=actor.items.get(answers.weapon);
  if(!chosen)throw Error(local("WeaponRequired"));
  rules.extraWeaponAction={...rules.extraWeaponAction,actions:rules.extraWeaponAction.actions??1,weaponId:chosen.id};
 }
  const profileChanges=changesFromRules(rules,{priority:template.priority});
  for(const change of profileChanges){
   const original=template.changes.find(c=>c.key===change.key);
   if(original?.priority!==undefined)change.priority=original.priority;
  }
  changes.push(...profileChanges);
 // Generated trait, vitality and improvement changes share the source spell's
 // priority, just like the fixed changes stored in the reference catalogue.
 if(Number.isFinite(template.priority))for(const change of changes)change.priority??=template.priority;
 // Capture additive contributions separately from the resolved native change.
 // They are explanatory metadata: they must never be applied a second time.
 const powerContributions = resolvedCopy ? (metadata(supplied)?.powerContributions ?? []) : (template.parameters ?? []).flatMap(p => {
  const count=Math.max(0,Number(answers[`boost${p.index}`]??counts[p.index])||0);
  if(!count||!Number.isFinite(Number(p.value)))return [];
  const keys=p.target==="modifier"?[p.key]:p.target==="protection"?["system.modifiers.protection"]:
   p.target==="damage"?(p.usages?.map(u=>`system.modifiers.damageByUsage.${u}`)??["system.modifiers.damage"]):[];
  return keys.flatMap(key=>{const matches=changes.filter(c=>c.key===key&&c.type==="add");
   return matches.length===1&&Number.isFinite(Number(matches[0].value))?[{key,index:p.index,optionId:p.optionId||"",count,unit:Number(p.value),resolved:Number(matches[0].value)}]:[];});
 });
 const parentSummary=supplied?.parent?.type==="effect"?supplied.parent.system?.summary:"";
 const summary=metadata(supplied)?.summary||parentSummary||text(key,"Summary");
 const meta={key,sourceId:template.sourceId,summary,editableChanges:true,resolved:true,related:template.related??[],temporaryHPSpent:0,stoneIntegritySpent:0,appliedAt:game.time.worldTime,sourceUuid:source?.uuid||"",ruleTestContext:casting,powerContributions};
  const description=supplied?.description??text(key,"Description");
 const data={name:effectName,img:template.icon,type:"effect",description,origin:source?.uuid||null,transfer:false,statuses:template.statuses??[],duration,
  system:{stackId,stacking:"replace",changes},flags:{[SCOPE]:{transformation:meta}}};
 let effect;
 if(targeting){
  const levels=POWER_DETAILS_BY_ID[template.sourceId].powerLevels;
  const allocation=Object.fromEntries(indices.map(index=>[levels[index]?.id,casting.counts[index]??0]).filter(([id])=>id));
  const result=await requestAllocatedEffect({casterUuid:casting.casterUuid,castingId:casting.castingId,targetUuid:actor.uuid,countsById:allocation,data});
  if(result.status!=="ok")throw Error(game.i18n.localize(result.status==="exceeds-targets"?"TRUDVANG.Warning.MagicTargetLimit":result.status==="duplicate-target"?"TRUDVANG.Warning.MagicTargetAlreadyAffected":result.status==="exceeds-improvements"?"TRUDVANG.Warning.MagicPowerBudget":"TRUDVANG.Warning.MagicAllocationUnavailable"));
  effect=await foundry.utils.fromUuid(result.effectUuid);
 }else effect=await actor.createTrudvangEffect(data);
 if(!effect)return null;
 await syncEffectGrants(effect,actor);
 await syncTransformationTokens(actor);
 return effect;
}
/** Publish the actual Roll so the standard chat pipeline also animates Dice So Nice. */
async function rollEffectValue(formula,{actor,name=""}={}){
 const roll=await new Roll(formula).evaluate();
 await roll.toMessage({speaker:ChatMessage.getSpeaker(actor?{actor}:{}),flavor:escapeHtml(name)});
 return Number(roll.total);
}
export async function resolveDuration(text,context={}){
 const notation=String(text).replace(/\(JO\s*(\d+)(?:[-–]\d+)?\)/gi,"xo>=$1");
 const match=notation.trim().match(/^([\ddD+ .xo>=-]+)\s*(seconds?|secondes?|minutes?|heures?|hours?|journées?|jours?|days?|semaines?|weeks?|mois|months?|années?|ans?|years?|siècles?|centur(?:y|ies)|tours?(?: de jeu)?|rounds?)$/i);
  if(!match){if(String(text).trim())throw Error(local("InvalidDuration"));return {value:0,units:"seconds"};}
 const value=Number.isFinite(Number(match[1]))?Number(match[1]):await rollEffectValue(match[1],context);
 const unit=match[2].toLowerCase();
 const units=/^minute/.test(unit)?"minutes":/^(heure|hour)/.test(unit)?"hours":/^(jour|day)/.test(unit)?"days":/^(semaine|week)/.test(unit)?"weeks":/^(mois|month)/.test(unit)?"months":/^(année|an|year)/.test(unit)?"years":/^(siècle|centur)/.test(unit)?"centuries":/^(tour|round)/.test(unit)?"rounds":"seconds";
 return normalizeEffectDuration({value:Math.max(0,value),units});
}
/** Only generated grants are removed. Inventory and original actor data are never restored from a snapshot. */
async function cleanGrants(effect){
 const actor=effect.parent;if(actor?.documentName!=="Actor")return;
 await grantQueues.get(`${actor.uuid??actor.id??"actor"}:${effect.id}`)?.catch(()=>{});
 const ids=Array.from(actor.items).filter(i=>i.flags?.[SCOPE]?.transformationGrant===effect.id).map(i=>i.id);
 if(ids.length)await actor.deleteEmbeddedDocuments("Item",ids);
}
const grantQueues=new Map();
function canSyncActor(actor){
 if(!actor?.isOwner)return false;
 const gm=game.users?.activeGM;
 if(gm)return gm.isSelf||gm.id===game.user?.id;
 const owners=Array.from(game.users??[]).filter(u=>u.active&&actor.canUserModify?.(u,"update")).sort((a,b)=>a.id.localeCompare(b.id));
 return !owners.length||owners[0].id===game.user?.id;
}
/** The same editable attack/capacity changes work on a hand-created effect.
 * Serialize hooks and drop application so neither can duplicate granted items. */
export function syncEffectGrants(effect,actor=effect.parent){
 if(!canSyncActor(actor))return Promise.resolve();
 const id=`${actor.uuid??actor.id??"actor"}:${effect.id}`;
 const run=async()=>{
  if(actor.effects?.get&&!actor.effects.get(effect.id))return;
  const r=effectRules(effect);
  const items=(r.attacks??[]).filter(row=>!row.isUnarmed).map(row=>naturalWeapon({...row,name:game.i18n.localize(row.name)},effect.id));
  if(r.extraWeaponAction?.weaponId){
   const weapon=actor.items.get(r.extraWeaponAction.weaponId);
   if(weapon){
    const data=weapon.toObject(false);
    delete data._id;delete data._stats;delete data.folder;
    data.name=`${effect.name} — ${weapon.name}`;
    data.effects=[];
    Object.assign(data.system,{weaponActions:r.extraWeaponAction.actions??1,weaponActionsSpent:0,naturalCombatPool:`effect:${effect.id}`,naturalCombatPoints:r.extraWeaponAction.combatPoints,naturalCombatPointsSpent:0,combatPointBonus:0,combatPointBonusUsed:false});
    data.flags={[SCOPE]:{transformationGrant:effect.id,extraWeaponAction:{weaponId:weapon.id}}};
    items.push(data);
   }
  }
  for(const id of r.powerIds??[]){
   const tablet=TABLET_CATALOG.find(t=>t.powers.some(p=>p.id===id));
   if(!tablet)continue;
   const data=powerItemData(tablet.powers.find(p=>p.id===id),tablet);
   data.flags={...data.flags,[SCOPE]:{...data.flags?.[SCOPE],transformationGrant:effect.id}};
   items.push(data);
  }
  for(const name of r.capabilityNames??[]){const ref=CREATURE_ABILITY_REFERENCES[name];if(ref)items.push({name:game.i18n.localize(`TRUDVANG.Content.CreatureAbility.${ref.id}.Name`),type:"creatureAbility",system:{catalogId:ref.id,description:game.i18n.localize(`TRUDVANG.Content.CreatureAbility.${ref.id}.Description`)},flags:{[SCOPE]:{transformationGrant:effect.id}}});}
  const existing=Array.from(actor.items??[]).filter(i=>i.flags?.[SCOPE]?.transformationGrant===effect.id);
  const signature=JSON.stringify(items);
  if(existing.length===items.length&&existing.every(i=>i.flags?.[SCOPE]?.grantSignature===signature))return;
  if(existing.length)await actor.deleteEmbeddedDocuments("Item",existing.map(i=>i.id));
  for(const item of items)item.flags[SCOPE].grantSignature=signature;
  if(items.length)await actor.createEmbeddedDocuments("Item",items);
 };
 const pending=(grantQueues.get(id)??Promise.resolve()).catch(()=>{}).then(run);
 grantQueues.set(id,pending);
 return pending.finally(()=>{if(grantQueues.get(id)===pending)grantQueues.delete(id);});
}
export function transformationItemActive(item){
 const id=item?.flags?.[SCOPE]?.transformationGrant;
 return !id||activeTransformations(item.actor).some(e=>e.id===id);
}
const tokenSyncQueues=new WeakMap();
export function syncTransformationTokens(actor){
 if(!canSyncActor(actor))return Promise.resolve();
 const pending=(tokenSyncQueues.get(actor)??Promise.resolve()).catch(()=>{}).then(()=>updateTransformationTokens(actor));
 tokenSyncQueues.set(actor,pending);
 return pending.finally(()=>{if(tokenSyncQueues.get(actor)===pending)tokenSyncQueues.delete(actor);});
}
async function updateTransformationTokens(actor){
 if(!canSyncActor(actor))return;
 const profile=transformationProfile(actor),vision=sensoryVision(profile.sensory);
 const sized=profile.effects.some(effect=>effectRules(effect).size!==undefined);
 const dimensions=sized?creatureTokenDimensions(profile.size):null;
 const tokens=actor.isToken?[actor.token]:Array.from(new Set([
  ...actor.getActiveTokens(true,true).map(t=>t.document??t),
  ...Array.from(game.scenes??[]).flatMap(scene=>Array.from(scene.tokens??[]).filter(t=>t.actorLink&&t.actorId===actor.id))
 ]));
 for(const token of tokens){
  if(!token)continue;
  const footprint=token.flags?.[SCOPE]?.transformationSize;
  if(dimensions){
   const before=footprint?.before??{width:token.width,height:token.height};
   if(!footprint||token.width!==dimensions.width||token.height!==dimensions.height||footprint.applied.width!==dimensions.width||footprint.applied.height!==dimensions.height)
    await token.update({...dimensions,[`flags.${SCOPE}.transformationSize`]:{before,applied:dimensions}});
  }else if(footprint){
   const changes={[`flags.${SCOPE}.transformationSize`]:foundry.data.operators.ForcedDeletion.create()};
   if(token.width===footprint.applied.width&&token.height===footprint.applied.height)Object.assign(changes,footprint.before);
   await token.update(changes);
  }
  const visionChanges=tokenVisionUpdate(token,vision);
  if(Object.keys(visionChanges).length)await token.update(visionChanges);
 }
}
/** A pre-fix chat button may contain only "{" in its context attribute. Its
 * message still holds the complete casting snapshot, so do not lose the boosts. */
export function transformationRequest(button){
 const messageId=button.closest?.("[data-message-id]")?.dataset.messageId;
 const saved=messageId?game.messages?.get(messageId)?.flags?.[SCOPE]?.ruleTestContext:null;
 const parse=(value,fallback)=>{try{return value?JSON.parse(value):fallback;}catch{return fallback;}};
 const context=parse(button.dataset.ruleTestContext,saved??null);
 const counts=parse(button.dataset.transformationCounts,context?.counts??[]);
 return {type:"TrudvangTransformation",key:button.dataset.transformationKey,sourceUuid:button.dataset.transformationSource,
  counts:Array.isArray(counts)?counts:context?.counts??[],context};
}
export function registerTransformationHooks(){
 document.addEventListener("dragstart",event=>{
  const button=event.target.closest?.("[data-transformation-key]");if(!button)return;
  event.dataTransfer.setData("text/plain",JSON.stringify(transformationRequest(button)));
 });
 document.addEventListener("click",async event=>{
  const button=event.target.closest?.("[data-transformation-key]");if(!button)return;
  event.preventDefault();event.stopPropagation();
  try{
   const request=transformationRequest(button);
   const source=button.dataset.transformationSource?await foundry.utils.fromUuid(button.dataset.transformationSource):null;
   const actor=canvas.tokens.controlled.find(t=>t.actor?.canUserModify(game.user,"update"))?.actor;
   if(!actor){ui.notifications.warn(game.i18n.localize("TRUDVANG.Procedure.ChooseActor"));return;}
   await applyTransformation(actor,request.key,{source,counts:request.counts,context:request.context,elapsed:metadata(source)?game.time.worldTime-metadata(source).appliedAt:0});
  }catch(error){console.error("Trudvang transformation",error);ui.notifications.error(error.message);}
 },true);
 Hooks.on("dropCanvasData",(canvas,data)=>{
  const referencePack=/^Compendium\.trudvang-chronicles\.effects-(?:fr|en)\./.test(data.uuid??"");
  const worldReference=data.type==="Item"&&data.uuid?.startsWith("Item.")&&game.items?.get(data.uuid.split(".")[1])?.type==="effect";
  if(referencePack||worldReference){
   const token=canvas.tokens.placeables.find(t=>data.x>=t.bounds.x&&data.x<=t.bounds.right&&data.y>=t.bounds.y&&data.y<=t.bounds.bottom);
   if(token)void (async()=>{const doc=await foundry.utils.fromUuid(data.uuid);const key=doc?.type==="effect"&&doc.documentName==="Item"?doc.system.catalogId:metadata(doc)?.key;if(key)await applyTransformation(token.actor,key,{source:doc});})().catch(e=>ui.notifications.error(e.message));
   return false;
  }
  if(data.type!=="TrudvangTransformation")return;
  const token=canvas.tokens.placeables.find(t=>data.x>=t.bounds.x&&data.x<=t.bounds.right&&data.y>=t.bounds.y&&data.y<=t.bounds.bottom);
  if(token)void (async()=>applyTransformation(token.actor,data.key,{source:data.sourceUuid?await foundry.utils.fromUuid(data.sourceUuid):null,counts:data.counts??[],context:data.context}))().catch(e=>ui.notifications.error(e.message));
  return false;
 });
 Hooks.on("deleteActiveEffect",async effect=>{if(!canSyncActor(effect.parent))return;await cleanGrants(effect);await syncTransformationTokens(effect.parent);});
 Hooks.on("createActiveEffect",async effect=>{if(canSyncActor(effect.parent)&&effect.parent?.documentName==="Actor"){
  await syncEffectGrants(effect);await syncTransformationTokens(effect.parent);
 }});
 Hooks.on("updateActiveEffect",async(effect,changed)=>{if(canSyncActor(effect.parent)&&effect.parent?.documentName==="Actor"){
  if(changed.system?.changes||Object.keys(changed).some(key=>key.startsWith("system.changes")))await syncEffectGrants(effect);
  await syncTransformationTokens(effect.parent);
 }});
 Hooks.on("createToken",async token=>{if(canSyncActor(token.actor))await syncTransformationTokens(token.actor);});
 Hooks.on("updateActor",async actor=>{if(canSyncActor(actor))await syncTransformationTokens(actor);});
 for(const hook of ["createItem","updateItem","deleteItem"])Hooks.on(hook,async item=>{if(item.parent?.documentName==="Actor"&&canSyncActor(item.parent))await syncTransformationTokens(item.parent);});
}
