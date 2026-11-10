import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from '../power-catalog-data.mjs';
import {effectChangesSource} from './effect-source.mjs';
import {effectDurationSeconds,itemEffectRemainingSeconds} from './effect-duration.mjs';
const S='trudvang-chronicles';
export const vitnerIdentity=value=>({hwitalja:'white',darkhwitalja:'dark',vaagritalja:'vaagri',hvitavitner:'white',morkvitner:'dark',vaagrivitner:'vaagri'})[value]??value??'';
export function dispelFingerprint(effect){
 const meta=effect.flags?.[S]?.transformation,context=meta?.ruleTestContext;
 return JSON.stringify([effect.uuid,meta?.sourceId,meta?.key,meta?.appliedAt??null,context?.castingId??'',context?.sourceLevel??null,context?.vitnerType??'',context?.kind??'',effect.duration?.value??null,effect.duration?.units??null,effect._source?.start?.time??effect.start?.time??null,effectChangesSource(effect.system?.changes)]);
}
/** Only applied vitner, never divine/rune effects or source templates. */
export function dispelCandidate(effect,spec,{time=Number(globalThis.game?.time?.worldTime),combat=globalThis.game?.combat}={}){
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
