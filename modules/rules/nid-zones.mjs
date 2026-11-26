import {recordedRoll,recordedRollFlag} from "../chat-roll-privacy.mjs";
import {activeBarriers,tokenBarrierCenter} from "./spell-barriers.mjs";
import {resolveRollUnderOutcome} from "./roll-under-resolver.mjs";
import {TRANSFORMATIONS_BY_SOURCE,TRANSFORMATION_TEMPLATES} from "../transformation-data.mjs";

const scope = "trudvang-chronicles";
const sun = "holy-tenetnid-tablet-of-the-sun:";
const profiles = {
  [sun+"protective-ground:1"]: {radius:2, hours:1, radiusStep:1, penalty:1, resistance:2, maxPenalty:4, maxResistance:6},
  [sun+"blessed-home:5"]: {radius:4, hours:1, radiusStep:1, penalty:3, resistance:6, maxPenalty:6, maxResistance:10},
  [sun+"sacred-grove:6"]: {radius:8, hours:24, radiusStep:2, penalty:5, resistance:10}
};
const resistanceId = "holy-tenetnid-tablet-of-the-shield:vitner-resistance:6";

export function nidZoneProfile(context) {
  const id=context?.sourceId;
  const count=index=>Math.max(0,Math.trunc(Number(context.countsById?.[`${id}:${index}`]??context.counts?.[index])||0));
  const spec=profiles[id];
  if(spec){
    const radius=spec.radius+spec.radiusStep*count(1);
    return {kind:"nidSanctuary",radius,range:radius,rounds:720*spec.hours*(1+count(0)),
      ritualRounds:3*radius,penalty:-Math.min(spec.maxPenalty??Infinity,spec.penalty+count(2)),
      resistance:Math.min(spec.maxResistance??Infinity,spec.resistance+2*count(3))};
  }
  if(id===resistanceId) {
    const radius=5+count(1);
    return {kind:"nidVitnerResistance",radius,range:radius,rounds:720*(1+count(0)),breach:10-count(2)};
  }
  return null;
}

export function isForeignMagic(context) {
  if(context?.kind==="spell")return true;
  return ["divine","rune"].includes(context?.kind) && context.religion!=="tenetNid"
    && !context.sourceId?.startsWith("holy-tenetnid-");
}

export function nidSanctuaryAt(scene,level,point,clock,{forResistance=false}={}) {
  if(!point)return null;
  const containing=activeBarriers(scene,"nidSanctuary",{...clock,level}).filter(region=>{
    const shape=Array.from(region.shapes??[])[0];
    return shape && Math.hypot(point.x-shape.x,point.y-shape.y)<=shape.radius;
  });
  return containing.sort((a,b)=>{
    const p=a.flags[scope].spellZone.profile,q=b.flags[scope].spellZone.profile;
    return forResistance?q.resistance-p.resistance:p.penalty-q.penalty;
  })[0]??null;
}

export function nidTargetModifier(token,context,clock) {
  if(!token?.parent||!isForeignMagic(context))return null;
  const region=nidSanctuaryAt(token.parent,token.level,tokenBarrierCenter(token),clock);
  if(!region)return null;
  const {penalty,resistance}=region.flags[scope].spellZone.profile;
  return {name:region.name,penalty,resistance,tokenUuid:token.uuid,actorUuid:token.actor?.uuid};
}

export function nidPreventsCasting(message,modifier) {
  const proof=recordedRollFlag(message,"ruleTestContext")?.nidRoll;
  if(!proof||!modifier||!Number.isFinite(proof.target))return false;
  return !resolveRollUnderOutcome(Number(recordedRoll(message)?.total),proof.target+modifier.penalty,proof).success;
}

export function nidResistanceBonus(test,context,token,clock) {
  if(!test?.magicResistance||!isForeignMagic(context))return null;
  const effects=(TRANSFORMATIONS_BY_SOURCE[context.sourceId]??[]).map(key=>TRANSFORMATION_TEMPLATES[key]);
  const restrictive=effects.some(effect=>effect.dispelCategory==="control" ||
    effect.initialResistance?.testIndex!=null&&effect.initialResistance.testIndex===Number(test.index??0));
  if(!restrictive)return null;
  if(!token?.parent)return null;
  const region=nidSanctuaryAt(token.parent,token.level,tokenBarrierCenter(token),clock,{forResistance:true});
  return region?{label:region.name,value:region.flags[scope].spellZone.profile.resistance}:null;
}
