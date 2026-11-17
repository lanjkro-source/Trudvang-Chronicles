import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
const S='trudvang-chronicles';
/** Snapshot the actual weapon's hit riders. A parry or a failed attack never
 * offers these; applying one still requires a confirmed hit after defenses. */
export function weaponHitOffers(item,actor,{success,kind,castingId,time=0,combat=null}={}){
 if(!success||kind!=='attack'||item?.type!=='weapon')return [];
 return Array.from(item.effects??[]).flatMap(effect=>{
  const meta=effect.flags?.[S]?.transformation,definition=TRANSFORMATION_TEMPLATES[meta?.key]?.onWeaponHit;
  if(!definition||!meta.resolved||effect.disabled||effect.isSuppressed||effect.duration?.expired)return [];
  const key=meta.sourceId+'#'+definition.effectId;
  if(!TRANSFORMATION_TEMPLATES[key]?.weaponHitOnly)return [];
  let level=meta.runeLevel;
  if(definition.requiresInscription){
   const row=item.system?.sacred?.enabled&&item.system.sacred.runes?.find(row=>row.id===effect.flags[S].sacredRuneId&&row.sourceId===meta.sourceId);
   if(!row||row.level!==level||row.invested<row.level||row.current<row.level)return [];
   if(POWER_DETAILS_BY_ID[meta.sourceId]?.runeActivation?.objectRestriction==='bludgeoningWeapon'&&item.system.damageQualification?.type!=='bludgeoning')return [];
  }
  const selected=Object.fromEntries((POWER_DETAILS_BY_ID[meta.sourceId]?.powerLevels??[]).map((p,i)=>[p.id,i===level-1?1:0]));
  const context={sourceId:meta.sourceId,kind:'rune',casterUuid:actor.uuid,casterName:actor.name,castingId,runeLevel:level,runeObjectUuid:item.uuid,
   weaponHit:true,hitTime:Number(time)||0,...(combat?.started?{hitCombatId:combat.id,hitRound:Number(combat.round)}:{}),counts:Object.values(selected),countsById:selected};
  return [{key,effect,record:{sourceId:meta.sourceId,casterUuid:actor.uuid,castingId,runeLevel:level,runeObjectUuid:item.uuid,sourceUuid:effect.uuid,selected,context,targetAllocations:[]}}];
 });
}
export function effectMessageContext(message,key){return message?.flags?.[S]?.weaponHitEffects?.[key]?.context??message?.flags?.[S]?.ruleTestContext;}
export function weaponHitExpired(key,record,{time=0,combat=null}={}){
 const tier=TRANSFORMATION_TEMPLATES[key]?.runeTiers?.[record?.runeLevel-1],duration=tier?.duration?.match(/^(\d+) rounds$/);
 if(!duration||!Number.isFinite(record?.context?.hitTime))return true;
 const elapsed=Math.max(0,Number(time)-record.context.hitTime,combat?.id===record.context.hitCombatId?(Number(combat.round)-record.context.hitRound)*5:0);
 return elapsed>=Number(duration[1])*5;
}
