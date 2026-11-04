/** Resolve every contribution from this effect's frozen casting. */
export function resolveEffectNote(parameter, context={}, powerLevel=0) {
 const count=term=>Math.max(0,Number(context.countsById?.[term.optionId]??context.counts?.[term.index])||0);
 const value=Number(parameter.base)+count(parameter)*Number(parameter.value)+(parameter.extraTerms??[]).reduce((sum,term)=>sum+count(term)*Number(term.value),0)+Math.max(0,Number(powerLevel)||0)*Number(parameter.perLevel||0);
 return Math.round(value*100)/100;
}
