import {TRANSFORMATION_TEMPLATES,TRANSFORMATIONS_BY_SOURCE} from "./transformation-data.mjs";
import {CREATURE_ABILITY_REFERENCES} from "./creature-ability-data.mjs";
import {BESTIARY_ENTRIES} from "./bestiary-catalog-data.mjs";
import {escapeHtml} from "./helpers.mjs";
import {activeTransformations,effectRules,transformedTrait,transformationProfile,TRANSFORMATION_SCOPE as SCOPE} from "./rules/transformation-profile.mjs";
const local = key => game.i18n.localize(`TRUDVANG.Transformation.${key}`);
const text = (key,field) => game.i18n.localize(`TRUDVANG.Content.Transformation.${key}.${field}`);
const metadata = doc => doc?.flags?.[SCOPE]?.transformation;
const sourceId = doc => doc?.system?.catalogId || CREATURE_ABILITY_REFERENCES[doc?.name]?.id;
export function transformationKeys(document){
 const meta=metadata(document);
 if(meta)return (meta.related??[]).map(id=>`${meta.sourceId}#${id}`).filter(key=>TRANSFORMATION_TEMPLATES[key]);
 const id=sourceId(document);
 return TRANSFORMATION_TEMPLATES[id]?[id]:TRANSFORMATIONS_BY_SOURCE[id]??[];
}
export function transformationLinks(document,counts=[]){
 return transformationKeys(document).map(key=>`<button type="button" draggable="true" class="trudvang-transformation-link" data-transformation-key="${escapeHtml(key)}" data-transformation-counts="${escapeHtml(JSON.stringify(counts))}" data-transformation-source="${escapeHtml(document.uuid||"")}" title="${escapeHtml(local("DragHint"))}"><i class="fas fa-person-rays" aria-hidden="true"></i> ${escapeHtml(text(key,"Name"))}</button>`).join(" ");
}
export function annotateTransformationDescription(description,document){
 const links=transformationLinks(document);
 return links?`${description}<div class="trudvang-transformation-links">${links}</div>`:description;
}
async function askFields(title,fields){
 const content=`<div>${fields.map(f=>`<div class="form-group"><label>${escapeHtml(f.label)}</label>${f.options?`<select name="${f.name}">${f.options.map(o=>`<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("")}</select>`:`<input name="${f.name}" type="text" value="${escapeHtml(String(f.value??""))}">`}</div>`).join("")}</div>`;
 return foundry.applications.api.DialogV2.wait({window:{title},content,buttons:[{action:"apply",label:local("Apply"),default:true,callback:(event,button)=>Object.fromEntries(new FormData(button.form))},{action:"cancel",label:local("Cancel"),callback:()=>null}],close:()=>null});
}
function naturalWeapon(row,effectId){
 return {name:row.name,type:"weapon",img:"icons/svg/sword.svg",system:{category:"natural",combatSpecialty:"natural",equipped:true,strengthApplies:true,quantity:1,damage:row.damage,openRoll:row.openRoll??0,naturalCombatPool:row.name,naturalCombatPoints:row.combatPoints??0,weaponActions:row.maxActions||4},flags:{[SCOPE]:{transformationGrant:effectId}}};
}
function selectFormData(form,policy){
 const s=form.actor.system;
 const r={size:Number(s.details.size)||1,traits:[],movement:(s.details.move??[]).map(row=>({mode:({terrestre:"land",vol:"flight",nage:"swim"}[row.mode]??row.mode),method:"replace",value:Number.parseFloat(row.max)||0}))};
 const keep=policy==="physical"?["intelligence","constitution","psyche"]:["intelligence"];
 for(const [trait,value]of Object.entries(s.traits??{}))if(!keep.includes(trait))r.traits.push({trait,method:"replace",value});
 r.attacks=form.actor.items.filter(i=>i.type==="weapon"&&i.system.category==="natural").map(i=>({name:game.i18n.localize(i.nameKey),damage:i.system.damage,openRoll:i.system.openRoll,combatPoints:i.system.naturalCombatPoints}));
 r.naturalArmor=Number(s.details.naturalArmor)||0;
 r.senses=form.featIds.map(id=>Object.entries(CREATURE_ABILITY_REFERENCES).find(([,v])=>v.id===id)?.[0]).filter(n=>/^Vision/.test(n??""));
 return r;
}
export async function applyTransformation(actor,key,{source=null,elapsed=0,counts=[]}={}){
 if(!actor?.canUserModify(game.user,"update")){ui.notifications.warn(local("Permission"));return null;}
 const template=TRANSFORMATION_TEMPLATES[key];if(!template)throw Error(`Unknown transformation ${key}`);
 const rules=structuredClone(template.rules??{});
 rules.senses=Array.from({length:rules.senseCount??0},(_,i)=>text(key,`Sense${i}`));
 rules.capabilities=Array.from({length:rules.capabilityCount??0},(_,i)=>text(key,`Capability${i}`));
 let durationText=template.duration??"";
 if(!/^\s*\d/.test(durationText))durationText="";
 if(rules.durationFromElapsed&&elapsed)durationText=`${elapsed*rules.durationFromElapsed} seconds`;
 const fields=[{name:"duration",label:local("Duration"),value:durationText}];
 for(const p of template.parameters??[])fields.push({name:`boost${p.index}`,label:game.i18n.localize(`TRUDVANG.Content.Power.${template.sourceId}.PowerLevels.${p.index}`),value:counts[p.index]??0});
 if(rules.unarmedDamage)fields.push({name:"runeLevel",label:local("RuneLevel"),value:0});
 if(rules.extraWeaponAction)fields.push({name:"weapon",label:local("Weapon"),options:Array.from(actor.items??[]).filter(i=>i.type==="weapon").map(i=>({value:i.id,label:i.name}))});
 if(rules.chooseBestiary)fields.unshift({name:"form",label:local("Form"),options:BESTIARY_ENTRIES.map(e=>({value:e.id,label:game.i18n.localize(`TRUDVANG.Content.Creature.${e.id}.Name`)}))});
 const answers=await askFields(text(key,"Name"),fields);if(!answers)return null;
 if(rules.chooseBestiary||rules.formName){
  const form=BESTIARY_ENTRIES.find(e=>e.id===answers.form)||BESTIARY_ENTRIES.find(e=>game.i18n.localize(`TRUDVANG.Content.Creature.${e.id}.Name`)===rules.formName);
  if(!form)throw Error(`Missing bestiary form ${rules.formName}`);
  Object.assign(rules,selectFormData(form,rules.formPolicy));
 }
 const duration=await resolveDuration(answers.duration);
  const changes=structuredClone(template.changes??[]);
 for(const p of template.parameters??[]){
  const count=Math.max(0,Number(answers[`boost${p.index}`])||0);if(!count)continue;
  if(p.target==="duration")duration.value+=count*p.value;
  if(p.target==="temporaryHP")rules.temporaryHP=(rules.temporaryHP??0)+count*p.value;
  if(p.target==="protection")changes.push({key:"system.modifiers.protection",type:"add",value:String(count*p.value),phase:"initial"});
  if(p.target==="damage"){rules.damage??={value:0,usages:["melee","throwing","natural"]};rules.damage.value+=count*p.value;}
 }
 if(rules.vitality){const amount=Number((await new Roll(rules.vitality).evaluate()).total);for(const key of ["bodyMax","bodyValue"])changes.push({key:`system.modifiers.${key}`,type:"add",value:String(amount),phase:"initial"});}
  for(const row of rules.traits??[]){
    const base=Number(actor.getTraitValue(row.trait)||0);
    const numeric=row.method==="degrees"||row.min!==undefined||row.max!==undefined;
    changes.push({key:`system.effective.traits.${row.trait}`,type:numeric||row.method==="replace"?"override":row.method==="highest"?"upgrade":"add",value:String(numeric?transformedTrait(base,row):row.value),phase:"initial"});
  }
  rules.traitsApplied=true;
 // Generated trait, vitality and improvement changes share the source spell's
 // priority, just like the fixed changes stored in the reference catalogue.
 if(Number.isFinite(template.priority))for(const change of changes)change.priority=template.priority;
 const meta={key,sourceId:template.sourceId,rules,related:template.related??[],temporaryHP:rules.temporaryHP??0,stoneIntegrity:rules.statueIntegrity??0,appliedAt:game.time.worldTime,sourceUuid:source?.uuid||""};
  const description=text(key,"Description");
 const data={name:text(key,"Name"),img:template.icon,type:"effect",description,origin:source?.uuid||null,transfer:false,statuses:template.statuses??[],duration,
  system:{stackId:key,stacking:"replace",changes},flags:{[SCOPE]:{transformation:meta}}};
 const effect=await actor.createTrudvangEffect(data);
 if(!effect)return null;
 const items=(rules.attacks??[]).map((row,index)=>naturalWeapon({...row,name:text(key,`Attack${index}`)},effect.id));
 if(rules.unarmedDamage){const level=Math.min(4,Math.max(0,Number(answers.runeLevel)||0));items.push(naturalWeapon({name:text(key,"Name"),damage:rules.unarmedDamage[level],openRoll:level===4?9:level===3?10:0},effect.id));}
 if(rules.extraWeaponAction){const chosen=actor.items.get(answers.weapon);if(chosen)items.push(naturalWeapon({name:`${text(key,"Name")} — ${chosen.name}`,damage:chosen.system.damage,openRoll:chosen.system.openRoll,maxActions:1,combatPoints:rules.extraWeaponAction.combatPoints},effect.id));}
 for(const name of rules.capabilityNames??[]){const ref=CREATURE_ABILITY_REFERENCES[name];if(ref)items.push({name:game.i18n.localize(`TRUDVANG.Content.CreatureAbility.${ref.id}.Name`),type:"creatureAbility",system:{catalogId:ref.id,description:game.i18n.localize(`TRUDVANG.Content.CreatureAbility.${ref.id}.Description`)},flags:{[SCOPE]:{transformationGrant:effect.id}}});}
 if(items.length)await actor.createEmbeddedDocuments("Item",items);
 await syncTransformationTokens(actor);
 return effect;
}
export async function resolveDuration(text){
 const notation=String(text).replace(/\(JO\s*(\d+)(?:[-–]\d+)?\)/gi,"xo>=$1");
 const match=notation.trim().match(/^([\ddD+ .xo>=-]+)\s*(seconds?|secondes?|minutes?|heures?|hours?|journées?|jours?|days?|semaines?|weeks?|mois|months?|années?|ans?|years?|tours?(?: de jeu)?|rounds?)$/i);
  if(!match){if(String(text).trim())throw Error(local("InvalidDuration"));return {value:0,units:"seconds"};}
 const value=Number.isFinite(Number(match[1]))?Number(match[1]):Number((await new Roll(match[1]).evaluate()).total);
 const unit=match[2].toLowerCase();
 const seconds=/^minute/.test(unit)?60:/^(heure|hour)/.test(unit)?3600:/^(jour|day)/.test(unit)?86400:/^(semaine|week)/.test(unit)?604800:/^(mois|month)/.test(unit)?2592000:/^(année|an|year)/.test(unit)?31536000:/^(tour|round)/.test(unit)?5:1;
 return {value:Math.max(0,value*seconds),units:"seconds"};
}
/** Only generated grants are removed. Inventory and original actor data are never restored from a snapshot. */
async function cleanGrants(effect){
 const actor=effect.parent;if(actor?.documentName!=="Actor")return;
 const ids=Array.from(actor.items).filter(i=>i.flags?.[SCOPE]?.transformationGrant===effect.id).map(i=>i.id);
 if(ids.length)await actor.deleteEmbeddedDocuments("Item",ids);
}
export function transformationItemActive(item){
 const id=item?.flags?.[SCOPE]?.transformationGrant;
 return !id||activeTransformations(item.actor).some(e=>e.id===id);
}
export async function syncTransformationTokens(actor){
 if(!actor?.isOwner)return;
 const effects=activeTransformations(actor);
 const mode=transformationProfile(actor).vision;
 const tokens=actor.isToken?[actor.token]:actor.getActiveTokens(true,true).map(t=>t.document??t);
 for(const token of tokens){
  const saved=token.flags?.[SCOPE]?.transformationVision;
  if(mode){
   const changes={"sight.visionMode":mode};
   if(!saved)changes[`flags.${SCOPE}.transformationVision`]={before:token.sight.visionMode,applied:mode};
   else changes[`flags.${SCOPE}.transformationVision.applied`]=mode;
   await token.update(changes);
  }else if(saved){
   const changes={[`flags.${SCOPE}.-=transformationVision`]:null};
   if(token.sight.visionMode===saved.applied)changes["sight.visionMode"]=saved.before;
   await token.update(changes);
  }
 }
}
export function registerTransformationHooks(){
 document.addEventListener("dragstart",event=>{
  const button=event.target.closest?.("[data-transformation-key]");if(!button)return;
  event.dataTransfer.setData("text/plain",JSON.stringify({type:"TrudvangTransformation",key:button.dataset.transformationKey,sourceUuid:button.dataset.transformationSource,counts:JSON.parse(button.dataset.transformationCounts||"[]")}));
 });
 document.addEventListener("click",async event=>{
  const button=event.target.closest?.("[data-transformation-key]");if(!button)return;
  event.preventDefault();event.stopPropagation();
  try{
   const source=button.dataset.transformationSource?await foundry.utils.fromUuid(button.dataset.transformationSource):null;
   const actor=source?.parent?.documentName==="Actor"?source.parent:canvas.tokens.controlled.find(t=>t.actor?.isOwner)?.actor||game.user.character;
   await applyTransformation(actor,button.dataset.transformationKey,{source,counts:JSON.parse(button.dataset.transformationCounts||"[]"),elapsed:metadata(source)?game.time.worldTime-metadata(source).appliedAt:0});
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
  if(token)void (async()=>applyTransformation(token.actor,data.key,{source:data.sourceUuid?await foundry.utils.fromUuid(data.sourceUuid):null,counts:data.counts??[]}))().catch(e=>ui.notifications.error(e.message));
  return false;
 });
 const authoritative=()=>game.users.activeGM?.isSelf||(!game.users.activeGM);
 Hooks.on("deleteActiveEffect",async effect=>{if(!metadata(effect)||!authoritative())return;await cleanGrants(effect);await syncTransformationTokens(effect.parent);});
 Hooks.on("updateActiveEffect",async effect=>{if(metadata(effect)&&authoritative())await syncTransformationTokens(effect.parent);});
 Hooks.on("createToken",async token=>{if(authoritative()&&token.actor)await syncTransformationTokens(token.actor);});
}
