import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
import {TRANSFORMATION_TEMPLATES,TRANSFORMATIONS_BY_SOURCE} from '../transformation-data.mjs';
import {rulesFromChanges} from './effect-rule-changes.mjs';
/** Related variants are later consequences, never simultaneous effects of casting. */
export function initialSelfEffectKeys(sourceId){
 if(!POWER_DETAILS_BY_ID[sourceId]?.selfOnly)return [];
 const keys=TRANSFORMATIONS_BY_SOURCE[sourceId]??[];
 const later=new Set(keys.flatMap(key=>TRANSFORMATION_TEMPLATES[key]?.related??[]));
 return keys.filter(key=>!later.has(TRANSFORMATION_TEMPLATES[key].id));
}
export function selfEffectNeedsChoice(key){
 const template=TRANSFORMATION_TEMPLATES[key],rules=rulesFromChanges(template.changes);
 return Boolean(template.inputKey||template.runeTiers||template.levelParameter||rules.chooseBestiary||rules.extraWeaponAction||rules.unarmedDamage);
}
export function casterFirstEffect(key){
 const template=TRANSFORMATION_TEMPLATES[key];
 return Boolean(template&&POWER_DETAILS_BY_ID[template.sourceId]?.casterFirstEffects?.includes(template.id));
}
