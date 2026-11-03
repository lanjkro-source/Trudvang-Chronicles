import {TRANSFORMATION_TEMPLATES} from "../transformation-data.mjs";

/** Resolve a conditional bonus from the effect's frozen casting, never from
 * the caster's latest invocation. This also supports effects already applied. */
export function conditionalSituationBonuses(effect) {
 if(effect?.disabled || effect?.isSuppressed || effect?.duration?.expired)return [];
 const meta=effect?.flags?.["trudvang-chronicles"]?.transformation;
 const template=TRANSFORMATION_TEMPLATES[meta?.key];
 if(!template || meta?.sourceId!==template.sourceId)return [];
 const context=meta.ruleTestContext??{};
 return (template.parameters??[]).filter(p=>p.target==="note").map(p=>({
  labelKey:p.labelKey,
  skill:p.skill ?? "",
  ability:p.ability ?? "",
  skillChoice:p.skillChoice === true,
  automatic:p.automatic === true,
  skillOnly:p.skillOnly === true,
  consumeOnUse:p.consumeOnUse === true,
  restrictedSkill:p.restrictedSkill ?? "",
  restrictedDiscipline:p.restrictedDiscipline ?? "",
  requiresInput:p.requiresInput === true,
  value:Number(p.base)+Math.max(0,Number(context.countsById?.[p.optionId]??context.counts?.[p.index])||0)*Number(p.value)
 }));
}

/** Optional modifiers whose relevance must be decided by the player. */
export function conditionalSkillModifiers(actor,skillKey="",ability=null,excludeEffectId="",{automatic=false}={}) {
 return Array.from(actor?.allApplicableEffects?.() ?? actor?.effects ?? []).filter(effect=>!excludeEffectId||effect.id!==excludeEffectId).flatMap(effect =>
  conditionalSituationBonuses(effect).filter(row => {
   const meta=effect.flags?.["trudvang-chronicles"]?.transformation;
   const input=String(meta?.input??"").trim();
   const entry=ability && actor.getCatalogEntry?.(ability.system?.catalogId);
   return row.skillChoice && row.automatic===automatic && (!row.restrictedSkill || row.restrictedSkill===skillKey)
    && (!row.restrictedDiscipline || (ability?.system?.kind==="specialty" && entry?.parentCatalogId===row.restrictedDiscipline))
    // TEMPORARY WORLD MIGRATION — 0.151 effects recorded the specialty name only.
    && (!row.requiresInput || (meta?.inputId ? meta.inputId===ability?.system?.catalogId : input && input.localeCompare(String(ability?.name??"").trim(),undefined,{sensitivity:"base"})===0));
  }).map(row => ({label:[effect.name,effect.flags?.["trudvang-chronicles"]?.transformation?.input].filter(Boolean).join(" — "),value:row.value,...(row.consumeOnUse?{consumeEffectId:effect.id}:{})})));
}

const oneUseQueues=new WeakMap();
/** Serialize rolls that consume an effect so two open dialogs cannot reuse it. */
export async function withConditionalEffectConsumption(actor,rows,roll){
 const ids=[...new Set(rows.flatMap(row=>row.consumeEffectId?[row.consumeEffectId]:[]))];
 if(!ids.length)return roll();
 const previous=oneUseQueues.get(actor)??Promise.resolve();
 const job=previous.catch(()=>{}).then(async()=>{
  const effects=Array.from(actor.effects??[]);
  const selected=ids.map(id=>effects.find(effect=>effect.id===id&&!effect.disabled&&!effect.isSuppressed&&!effect.duration?.expired));
  if(selected.some(effect=>!effect)){ui.notifications.warn(game.i18n.localize("TRUDVANG.Transformation.SingleUseUnavailable"));return null;}
  const result=await roll();
  if(result)for(const effect of selected)await effect.delete();
  return result;
 }).finally(()=>{if(oneUseQueues.get(actor)===job)oneUseQueues.delete(actor);});
 oneUseQueues.set(actor,job);return job;
}
