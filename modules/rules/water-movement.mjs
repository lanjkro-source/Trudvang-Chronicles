/** Wave Master changes aquatic movement, never a land or flight fallback. */
export function waterMovementDegree(definition,context={}){
 const extra=Math.max(0,Math.trunc(Number(context.countsById?.[definition.degreeOptionId]??context.counts?.[definition.degreeIndex])||0));
 return Math.max(-3,Math.min(3,definition.direction*(1+extra)));
}
export function waterMovementValues(base,degree){
 const d=Math.max(-3,Math.min(3,Math.trunc(Number(degree)||0)));
 const multiplier=d===-3?0:d===-2?1:d===-1?0.5:d+1;
 const cap=d===-2?1:Infinity,round=n=>Math.round(n*100)/100;
 return {max:round(Math.min(cap,Math.max(0,Number(base.max)||0)*multiplier)),metersPerTwo:round(Math.min(cap,Math.max(0,Number(base.metersPerTwo)||0)*multiplier))};
}
export function waterMovementBase(document){
 if(document?.documentName==='Item'||['weapon','armor','shield','gear','potion'].includes(document?.type))return null;
 const row=(document?._source?.system?.details?.move??document?.system?.details?.move??[]).find(row=>['nage','swim'].includes(row.mode));
 if(!row)return null;
 const parse=v=>Number.parseFloat(String(v??'').replace(',','.'));
 const result={max:parse(row.max),metersPerTwo:parse(row.distance)};
 return Object.values(result).every(n=>Number.isFinite(n)&&n>=0)?result:null;
}

/** A round budget for water movement; no effect or counter is ever written in preparation. */
export function waterMovementBudget(actor,mode,{combat=globalThis.game?.combat}={}){
 if(mode!=='swim'||!actor.transformationProfile?.movements?.some(row=>row.mode==='swim'&&row.method==='waterDegrees'))return null;
 const max=Number(actor.transformationMovement?.swim)||0,stored=actor.flags?.['trudvang-chronicles']?.waterMovementTravel;
 const identity={combatId:combat?.id??'',round:Number(combat?.round)||0};
 const spent=stored?.combatId===identity.combatId&&stored?.round===identity.round?Math.max(0,Number(stored.meters)||0):0;
 return {...identity,spent,max,remaining:Math.max(0,max-spent)};
}
