import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
import {effectChangesSource} from './effect-source.mjs';
import {effectDurationSeconds,itemEffectRemainingSeconds} from './effect-duration.mjs';
const S='trudvang-chronicles';
export const CLEANSING_CATEGORIES=['mentalVitner','possession','demonic','transformation','curse','minorAffliction','naturalDisease','poison','memory','fertility','supernaturalDisease','madness','lostLimb'];
export const vitnerIdentity=value=>({hwitalja:'white',darkhwitalja:'dark',vaagritalja:'vaagri',hvitavitner:'white',morkvitner:'dark',vaagrivitner:'vaagri'})[value]??value??'';
export function dispelFingerprint(effect){
 const meta=effect.flags?.[S]?.transformation,context=meta?.ruleTestContext;
 return JSON.stringify([effect.uuid,meta?.sourceId,meta?.key,meta?.appliedAt??null,context?.castingId??'',context?.sourceLevel??null,context?.vitnerType??'',context?.kind??'',effect.duration?.value??null,effect.duration?.units??null,effect.flags?.[S]?.affliction??null,effect._source?.start?.time??effect.start?.time??null,effectChangesSource(effect.system?.changes)]);
}
/** Only applied vitner, never divine/rune effects or source templates. */
export function dispelCandidate(effect,spec,{time=Number(globalThis.game?.time?.worldTime),combat=globalThis.game?.combat}={}){
 if(spec.mode==='cleanse')return cleansingCandidate(effect,spec);
 const meta=effect?.flags?.[S]?.transformation,context=meta?.ruleTestContext??{},template=TRANSFORMATION_TEMPLATES[meta?.key];
 const sourceId=meta?.sourceId??template?.sourceId,source=POWER_DETAILS_BY_ID[sourceId];
 if(!meta||!source||source.isRune||effect.disabled||effect.isSuppressed||effect.duration?.expired||effect.parent?.type==='effect')return null;
 if(!meta.resolved&&!Number.isFinite(meta.appliedAt)&&!context.casterUuid)return null;
 const kind=context.kind??(sourceId?.startsWith('vitner-')?'spell':'divine');
 if(kind!=='spell')return null;
 const seconds=effectDurationSeconds(effect._source?.duration??effect.duration);
 const remaining=seconds>0?itemEffectRemainingSeconds(effect,{time,combat}):null;
 if(seconds>0&&!(remaining>0))return null;
 const timed=seconds>0&&remaining>0;
 const sustained=source.spellType==='sustained'&&source.spellType!=='permanent';
 if(!timed&&!sustained&&!template?.dispelPermanent)return null;
 if(spec.mode==='control'&&template?.dispelCategory!=='control')return null;
 const level=Number(context.sourceLevel??source.level),base=spec.values?.[level];
 if(!Number.isInteger(level)||level<1||level>5||!Number.isFinite(base))return null;
 return {effect,sourceId,level,base,vitnerType:context.vitnerType??'',fingerprint:dispelFingerprint(effect)};
}

/** Explicit categories only: never infer a disease or curse from its name. */
export function cleansingCandidate(effect,spec){
 const flags=effect?.flags?.[S]??{},meta=flags.transformation,template=TRANSFORMATION_TEMPLATES[meta?.key];
 if(!effect||effect.disabled||effect.isSuppressed||effect.duration?.expired||effect.parent?.documentName!=='Actor')return null;
 const seconds=effectDurationSeconds(effect._source?.duration??effect.duration);
 if(seconds>0&&!(itemEffectRemainingSeconds(effect)>0))return null;
 const categories=new Set(template?.cleansingCategories??[]);
 const disease=flags.diseaseOutcome;
 if(disease&&disease.kind!=='immunity')categories.add('supernaturalDisease');
 // Authored nonmagical afflictions may declare the same stable categories.
 for(const category of flags.affliction?.categories??[])categories.add(category);
 if(CLEANSING_CATEGORIES.includes(flags.affliction?.category))categories.add(flags.affliction.category);
 const sourceId=meta?.sourceId??template?.sourceId,context=meta?.ruleTestContext??{};
 if(categories.has('mentalVitner')&&(context.kind??(sourceId?.startsWith('vitner-')?'spell':'divine'))!=='spell')categories.delete('mentalVitner');
 if(!spec.categories?.some(category=>categories.has(category)))return null;
 return {effect,sourceId,fingerprint:dispelFingerprint(effect),categories:[...categories]};
}
