import {TRANSFORMATION_TEMPLATES} from './transformation-data.mjs';
import {normalizeEffectDuration} from './rules/effect-duration.mjs';
const S='trudvang-chronicles';
/** The GM calls this after reserving body damage. Per-rider progress travels
 * with that result, so retries neither deal damage twice nor restart an effect.
 * Duration starts when this recipient receives damage, after any defense. */
export async function applyWeaponDamageEffects(message,actor,row){
 const effects=message.getFlag(S,'weaponDamageEffects')??[];
 if(!effects.length)return;
 row.weaponEffectsApplied??=[];
 row.weaponEffectStart??=foundry.documents.ActiveEffect.implementation.getEffectStart();
 for(const entry of effects){
  if(row.weaponEffectsApplied.includes(entry.key))continue;
  const template=TRANSFORMATION_TEMPLATES[entry.key],tier=entry.tier;
  if(!template?.weaponHitOnly||template.sourceId!==entry.sourceId||!tier||!Number.isInteger(entry.runeLevel)||entry.runeLevel<1||entry.runeLevel>5)throw Error('Invalid damage effect snapshot');
  const applicationId=message.id+':'+entry.key;
  if(!Array.from(actor.effects??[]).some(e=>e.flags?.[S]?.transformation?.damageApplicationId===applicationId)){
   const duration=tier.duration.match(/^(\d+) rounds$/);if(!duration)throw Error('Invalid damage effect duration');
   const context={kind:'rune',sourceId:entry.sourceId,casterUuid:entry.casterUuid,runeLevel:entry.runeLevel,runeObjectUuid:entry.runeObjectUuid,weaponHit:true};
   const result=await actor.createTrudvangEffect({name:game.i18n.localize(`TRUDVANG.Content.Transformation.${entry.key}.Name`),type:'effect',img:template.icon,origin:entry.sourceUuid,
    start:structuredClone(row.weaponEffectStart),transfer:false,duration:normalizeEffectDuration({value:Number(duration[1]),units:'rounds'}),statuses:tier.statuses??[],
    description:game.i18n.localize(tier.descriptionKey),system:{stackId:entry.key,stacking:'replace',changes:structuredClone(tier.changes)},
    flags:{[S]:{transformation:{key:entry.key,sourceId:entry.sourceId,resolved:true,editableChanges:true,summaryResolved:true,summary:game.i18n.localize(tier.summaryKey),runeLevel:entry.runeLevel,
     appliedAt:row.weaponEffectStart.time,damageApplicationId:applicationId,ruleTestContext:context}}}});
   if(!result)throw Error('Failed to apply weapon damage effect');
  }
  row.weaponEffectsApplied.push(entry.key);
 }
}
