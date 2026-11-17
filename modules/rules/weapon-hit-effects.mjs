import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
const S='trudvang-chronicles';
/** Freeze riders after damage dice actually explode, independently of the
 * total or the number of base dice. Attack success alone is not a trigger. */
export function weaponDamageEffects(item,actor,{explosions=0}={}){
 if(item?.type!=='weapon')return [];
 return Array.from(item.effects??[]).flatMap(effect=>{
  const meta=effect.flags?.[S]?.transformation,definition=TRANSFORMATION_TEMPLATES[meta?.key]?.onWeaponHit;
  if(!definition||!meta.resolved||effect.disabled||effect.isSuppressed||effect.duration?.expired||definition.requiresOpenRoll&&explosions<1)return [];
  const key=meta.sourceId+'#'+definition.effectId;
  if(!TRANSFORMATION_TEMPLATES[key]?.weaponHitOnly)return [];
  let level=meta.runeLevel;
  if(definition.requiresInscription){
   const row=item.system?.sacred?.enabled&&item.system.sacred.runes?.find(row=>row.id===effect.flags[S].sacredRuneId&&row.sourceId===meta.sourceId);
   if(!row||row.level!==level||row.invested<row.level||row.current<row.level)return [];
   if(POWER_DETAILS_BY_ID[meta.sourceId]?.runeActivation?.objectRestriction==='bludgeoningWeapon'&&item.system.damageQualification?.type!=='bludgeoning')return [];
  }
  const tier=TRANSFORMATION_TEMPLATES[key]?.runeTiers?.[level-1];if(!tier)return [];
  return [{key,sourceId:meta.sourceId,runeLevel:level,runeObjectUuid:item.uuid,casterUuid:actor.uuid,sourceUuid:effect.uuid,tier:structuredClone(tier)}];
 });
}
