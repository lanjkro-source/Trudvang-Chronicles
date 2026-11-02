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
  skillChoice:p.skillChoice === true,
  value:Number(p.base)+Math.max(0,Number(context.countsById?.[p.optionId]??context.counts?.[p.index])||0)*Number(p.value)
 }));
}

/** Optional modifiers whose relevance must be decided by the player. */
export function conditionalSkillModifiers(actor) {
 return Array.from(actor?.allApplicableEffects?.() ?? actor?.effects ?? []).flatMap(effect =>
  conditionalSituationBonuses(effect).filter(row => row.skillChoice).map(row => ({label:effect.name,value:row.value})));
}
