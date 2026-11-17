/** An inscription level is fixed at activation; its healing dice are a shared
 * budget, not five cumulative improvements or a fresh budget per recipient. */
export function runeConsequenceDefinition(details){return details?.runeConsequence;}
export function runeConsequenceAmount(definition,level){
 if(!Number.isInteger(level)||level<1||level>5)throw Error('Invalid activated rune level');
 return definition.perLevel*level;
}
export function runeConsequenceAllocation(details,context,{time=0,combat=null}={}){
 const definition=runeConsequenceDefinition(details);if(!definition)return null;
 const amount=runeConsequenceAmount(definition,context.runeLevel);
 const selected=Object.fromEntries((details.powerLevels??[]).map(p=>[p.id,0]));
 if(Number.isInteger(definition.allocationIndex))selected[details.powerLevels[definition.allocationIndex].id]=amount;
 const seconds=definition.seconds??(definition.secondsPerLevel?definition.secondsPerLevel*context.runeLevel:null);
 return {castingId:context.castingId,casterUuid:context.casterUuid,sourceId:context.sourceId,runeLevel:context.runeLevel,runeObjectUuid:context.runeObjectUuid,
  selected,targetAllocations:[],...(seconds===null?{}:{expiresAt:Number(time)+seconds,...(combat?.started?{combatId:combat.id,expiresRound:Number(combat.round)+seconds/5}:{})})};
}
export function runeConsequenceExpired(record,{time=0,combat=null}={}){
 return Number.isFinite(record?.expiresAt)&&Number(time)>=record.expiresAt
  || Boolean(record?.combatId&&combat?.id===record.combatId&&Number(combat.round)>=record.expiresRound);
}
export function validRuneConsequenceAllocation(definition,record,countsById,details){
 if(!definition||!Number.isInteger(record?.runeLevel)||record.runeLevel<1||record.runeLevel>5)return false;
 if(!Number.isInteger(definition.allocationIndex))return Object.values(countsById??{}).every(n=>n===0);
 const id=details.powerLevels[definition.allocationIndex]?.id,n=countsById?.[id];
 return Number.isInteger(n)&&n>=1&&n<=runeConsequenceAmount(definition,record.runeLevel);
}
