/** Wave Master changes aquatic movement only. Missing swimming defaults to half land movement. */
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
/** A land creature's implicit swimming rate exists only while a water effect needs it. */
export function defaultWaterMovement(land){
 if(!land||![land.max,land.metersPerTwo].every(n=>Number.isFinite(n)&&n>=0))return null;
 return {max:land.max/2,metersPerTwo:land.metersPerTwo/2};
}
export function waterMovementBase(document){
 if(document?.documentName==='Item'||['weapon','armor','shield','gear','potion'].includes(document?.type))return null;
 const rows=document?._source?.system?.details?.move??document?.system?.details?.move??[];
 const parse=v=>Number.parseFloat(String(v??'').replace(',','.'));
 const profile=row=>({max:parse(row.max),metersPerTwo:parse(row.distance)});
 const swimming=rows.find(row=>['nage','swim'].includes(row.mode));
 if(swimming){
  const result=profile(swimming);
  return Object.values(result).every(n=>Number.isFinite(n)&&n>=0)?result:null;
 }
 const land=rows.find(row=>['terrestre','land'].includes(row.mode));
 // Prepared land values already include other active movement effects. A water
 // effect never modifies land, so reapplication cannot double its own bonus.
 const prepared=document?.transformationMovementRows?.find(row=>row.mode==='land');
 const max=document?.transformationMovement?.land;
 if(Number.isFinite(max))return defaultWaterMovement({max,metersPerTwo:prepared?.metersPerTwo??(land?profile(land).metersPerTwo:1)});
 if(land)return defaultWaterMovement(profile(land));
 if(!rows.length){
  const current=Number(document?.system?.movement?.current);
  if(Number.isFinite(current))return defaultWaterMovement({max:current,metersPerTwo:1});
 }
 return null;
}

/** A round budget for water movement; no effect or counter is ever written in preparation. */
export function waterMovementBudget(actor,mode,{combat=globalThis.game?.combat}={}){
 if(mode!=='swim'||!actor.transformationProfile?.movements?.some(row=>row.mode==='swim'&&row.method==='waterDegrees'))return null;
 const max=Number(actor.transformationMovement?.swim)||0,stored=actor.flags?.['trudvang-chronicles']?.waterMovementTravel;
 const identity={combatId:combat?.id??'',round:Number(combat?.round)||0};
 const spent=stored?.combatId===identity.combatId&&stored?.round===identity.round?Math.max(0,Number(stored.meters)||0):0;
 return {...identity,spent,max,remaining:Math.max(0,max-spent)};
}
