/** Size intervals use the lower bound of each larger row (including 1.5, 3, 5, 10). */
export function windProjectionProfile(size=1){
 const value=Number(size);const n=Number.isFinite(value)&&value>0?value:1;
 if(n<1/3)return {dice:3,faces:10,threshold:10};
 if(n<.5)return {dice:2,faces:10,threshold:10};
 if(n<1.5)return {dice:1,faces:10,threshold:10};
 if(n<3)return {dice:1,faces:10,threshold:0};
 if(n<5)return {dice:1,faces:6,threshold:0};
 if(n<10)return {dice:1,faces:3,threshold:0};
 return {dice:0,faces:10,threshold:0,modifier:1};
}
export function impactSize(actor){return Number(actor?.transformationProfile?.size??(actor?.type==='character'?1:actor?.system?.details?.size))||1;}
export function minimumDamageAfterArmor(definition,casting={},baseOnly=false){
 const spec=definition?.minimumAfterArmor;if(!spec)return 0;
 const count=baseOnly?0:Math.max(0,Math.floor(Number(casting.countsById?.[spec.optionId]??casting.counts?.[Number(spec.optionId.split(':').at(-1))])||0));
 return Math.max(0,Number(spec.base)||0)+count;
}
