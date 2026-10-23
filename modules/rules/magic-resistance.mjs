/** Casting provenance is a snapshot, never a lookup of the last cast of an Item. */
export function ruleTestSourceId(document){
 return (document?.flags?.["trudvang-chronicles"]?.transformation?.sourceId||document?.system?.catalogId||"").split("#")[0];
}
export function knowledgeRank(actor,id){
 const item=actor?.findRuleKnowledge?.(id)??actor?.findKnowledgeItem?.(id)
  ??Array.from(actor?.items??[]).find(i=>i.system?.catalogId===id);
 return Math.max(0,Number(item?.system?.level)||0);
}
export function ruleTestCastingContext(document,{caster,counts,context}={}){
 const sourceId=ruleTestSourceId(document);
 const stored=context??document?.flags?.["trudvang-chronicles"]?.transformation?.ruleTestContext;
 if(stored?.sourceId===sourceId)return {...structuredClone(stored),...(counts?.length?{counts:Array.from(counts,Number)}:{})};
 const isEffect=document?.documentName==="ActiveEffect"||document?.type==="effect";
 if(!isEffect)caster??=document?.actor??(document?.parent?.documentName==="Actor"?document.parent:null);
 const kind=sourceId.startsWith("vitner-")?"spell":sourceId.startsWith("holy-")?"divine":"";
 const specialty=kind==="spell"?"potency":kind==="divine"?"potent":"";
 return {sourceId,kind,counts:Array.from(counts??[],n=>Math.max(0,Number(n)||0)),casterUuid:caster?.uuid??"",casterName:caster?.name??"",
  specialty,specialtyLevel:specialty?knowledgeRank(caster,specialty):0};
}
/** Only explicitly identified resistance tests receive offensive/defensive ranks.
 * Listening, concentration, healing and the caster's own situation tests do not. */
export function magicResistanceRows(test,{context={},actor}={}){
 const rows=[];
 let improvedBase=typeof test.sv==="number"?test.sv:Number(test.sv?.base);
 for(const p of test.powerLevelModifiers??[]){
  const count=Math.max(0,Number(context.counts?.[p.index])||0);
  if(count&&Number.isFinite(p.value)){
   const value=Number.isFinite(p.minimum)&&Number.isFinite(improvedBase)?Math.max(count*p.value,p.minimum-improvedBase):count*p.value;
   improvedBase+=value;
   rows.push({labelKey:Number.isFinite(p.minimum)?"TRUDVANG.Resistance.PowerLevelMinimum":"TRUDVANG.Resistance.PowerLevel",data:{count,unit:p.value,index:p.index+1,minimum:p.minimum,descriptionKey:`TRUDVANG.Content.Power.${context.sourceId}.PowerLevels.${p.index}`},value});
  }
 }
 if(test.magicResistance){
  if(context.specialtyLevel&&["spell","divine"].includes(context.kind))rows.push({labelKey:"TRUDVANG.Resistance.CasterKnowledge",data:{name:context.casterName,level:context.specialtyLevel,knowledgeKey:`TRUDVANG.Knowledge.${context.specialty}`},value:-2*context.specialtyLevel});
  const level=context.kind==="spell"?knowledgeRank(actor,"potency"):0;
  if(level)rows.push({labelKey:"TRUDVANG.Resistance.DefenderKnowledge",data:{name:actor?.name??"",level,knowledgeKey:"TRUDVANG.Knowledge.potency"},value:2*level});
 }
 return rows;
}
export function localizeResistanceRows(rows){
 return rows.map(row=>{
  const data={...row.data};
  if(data.descriptionKey)data.description=game.i18n.localize(data.descriptionKey);
  if(data.knowledgeKey)data.knowledge=game.i18n.localize(data.knowledgeKey);
  const {labelKey,...localized}=row;
  return {...localized,label:game.i18n.format(labelKey,data)};
 });
}
