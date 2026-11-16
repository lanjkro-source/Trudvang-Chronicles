import {effectChangesSource} from './effect-source.mjs';
import {TRANSFORMATION_TEMPLATES} from '../transformation-data.mjs';
const S='trudvang-chronicles';
export const followupPolicy=(effect,index)=>TRANSFORMATION_TEMPLATES[effect?.flags?.[S]?.transformation?.key]?.followupTests?.find(row=>row.testIndex===index);
export const followupState=effect=>effect?.flags?.[S]?.ruleTestProgress;
export const worldDay=time=>Math.floor(Number(time||0)/86400);
export function followupFingerprint(effect){
 const meta=effect?.flags?.[S]?.transformation;
 return JSON.stringify([effect?.uuid,meta?.key,meta?.appliedAt??effect?.start?.time??null,meta?.ruleTestContext?.castingId??null,effect?.flags?.[S]?.initialResistance?.id??null,effect?.flags?.[S]?.initialResistance?.resolved??null,effect?.duration?.value??null,effect?.duration?.units??null,effectChangesSource(effect?.system?.changes),followupState(effect)?.revision??null]);
}
export function followupAvailability(effect,index,time){
 const policy=followupPolicy(effect,index),state=followupState(effect)?.tests?.[index];
 if(!policy)return '';
 if(policy.success==='reveal'&&state?.revealed)return 'revealed';
 if(policy.frequency!=='day')return '';
 const day=worldDay(time),start=effect.flags[S].transformation.appliedAt??effect._source?.start?.time??effect.start?.time??time;
 if(day<worldDay(start)+(policy.startAfterDays??0))return 'wait';
 return state?.lastDay===day?'daily':'';
}
export function followupRollTest(effect,test,index){
 const policy=followupPolicy(effect,index),state=followupState(effect)?.tests?.[index];
 if(!policy)return test;
 if(policy.success==='reveal'&&state?.revealed)return {...test,disabled:true};
 return policy.success==='memory'?{...test,followupBonus:Math.max(0,Math.trunc(Number(state?.successes)||0))*policy.increment}:test;
}
