export const NID_BLESSINGS = {
 "holy-tenetnid-tablet-of-voices:holy-consideration:0": {base:1,index:2},
 "holy-tenetnid-tablet-of-voices:kindred-s-bond:4": {base:3,index:3},
 "holy-tenetnid-tablet-of-voices:favorites-of-gave:7": {base:5,index:null}
};
export function nidBlessingSource(data){return data?.flags?.["trudvang-chronicles"]?.transformation?.sourceId;}
export function nidBlessingRestriction(actor,data){
 const id=nidBlessingSource(data);if(!NID_BLESSINGS[id])return "";
 const caster=data.flags["trudvang-chronicles"].transformation.ruleTestContext?.casterUuid;
 if(caster&&caster===actor.uuid)return "TRUDVANG.Blessing.NoSelf";
 if(Array.from(actor.effects??[]).some(e=>NID_BLESSINGS[nidBlessingSource(e)]&&!e.duration?.expired))return "TRUDVANG.Blessing.AlreadyBlessed";
 return "";
}
export function nidBlessingBonus(actor){
 const effect=Array.from(actor?.allApplicableEffects?.()??actor?.effects??[]).find(e=>NID_BLESSINGS[nidBlessingSource(e)]&&!e.disabled&&!e.isSuppressed&&!e.duration?.expired);
 if(!effect)return null;const id=nidBlessingSource(effect),def=NID_BLESSINGS[id],meta=effect.flags["trudvang-chronicles"].transformation;
 const count=def.index===null?0:Number(meta.ruleTestContext?.countsById?.[id+":"+def.index]??meta.ruleTestContext?.counts?.[def.index]??0);
 return {label:effect.name,value:def.base+Math.max(0,count),effectId:effect.id,goal:meta.input??""};
}
