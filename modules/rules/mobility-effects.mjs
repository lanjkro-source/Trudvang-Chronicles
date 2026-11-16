import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {matchingCreatureBonus} from './creature-conditional-bonus.mjs';
import {itemEffectRemainingSeconds} from './effect-duration.mjs';
const S='trudvang-chronicles';
export function effectTargetRestriction(template,actor,context={}){
 if(template.requiredTags&&!matchingCreatureBonus({tags:template.requiredTags},actor))return 'TRUDVANG.Mobility.WrongTarget';
 if(template.excludeCaster&&context.casterUuid&&context.casterUuid===actor.uuid)return 'TRUDVANG.Mobility.CasterUnaffected';
 return '';
}
export function leapDistances(def,height,context={}){
 const meters=Number(String(height??'').trim().replace(',','.'));if(!Number.isFinite(meters)||meters<=0)return null;
 const count=(id,index)=>Math.max(0,Number(context.countsById?.[id]??context.counts?.[index])||0);
 const round=n=>Math.round(n*100)/100;
 return {bodyHeight:meters,length:round(Math.min(def.maxLength,meters*def.lengthFactor+count(def.lengthOptionId,def.lengthIndex)*def.lengthStep)),height:round(Math.min(def.maxHeight,meters*def.heightFactor+count(def.heightOptionId,def.heightIndex)*def.heightStep))};
}
/** Cooldowns are physical recovery, independent of an effect's enabled toggle. */
export function castingCooldownRemaining(actor,sourceId,{time=Number(globalThis.game?.time?.worldTime)||0,combat=globalThis.game?.combat}={}){
 let remaining=0;
 for(const effect of actor?.effects??[]){
  const meta=effect.flags?.[S]?.transformation,template=TRANSFORMATION_TEMPLATES[meta?.key];
  if(meta?.sourceId!==sourceId||!template?.cooldownSeconds)continue;
  const row={flags:effect.flags,start:effect._source?.start??effect.start,duration:{value:template.cooldownSeconds/5,units:'rounds'}};
  remaining=Math.max(remaining,itemEffectRemainingSeconds(row,{time,combat})??0);
 }
 return Math.ceil(remaining);
}
