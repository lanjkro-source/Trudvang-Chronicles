import {effectSource} from './rules/effect-source.mjs';
const S='trudvang-chronicles';
const values=collection=>Array.from(collection??[]);
/** Reprepare a detached actor rather than subtracting attributed deltas: an
 * excluded override/multiplier may have changed traits, statuses and ranks too. */
export async function actorForResistance(actor,{effect=null,effectUuid='',context=null}={}){
 const uuid=effectUuid||effect?.uuid;
 const direct=effect?.documentName==='ActiveEffect';
 const sourceMeta=effect?.flags?.[S]?.transformation;
 const matches=row=>{
  if(uuid&&(row.uuid===uuid||row.flags?.[S]?.auraRecipient?.sourceEffectUuid===uuid))return true;
  // An actual effect identifies only that instance. A spell-card test may
  // identify its already-applied consequences through the captured casting.
  if(direct||!context?.castingId||!context?.casterUuid)return false;
  const meta=row.flags?.[S]?.transformation,cast=meta?.ruleTestContext;
  return cast?.castingId===context.castingId&&cast.casterUuid===context.casterUuid&&cast.sourceId===context.sourceId&&(!sourceMeta?.key||meta.key===sourceMeta.key);
 };
 const applicable=values(actor.allApplicableEffects?.()??actor.effects);
 const excluded=new Set(applicable.filter(matches));
 if(!excluded.size)return actor;
 const changes={effects:values(actor.effects).filter(row=>!excluded.has(row)).map(effectSource)};
 const affectedItems=values(actor.items).filter(item=>values(item.effects).some(row=>excluded.has(row)));
 if(affectedItems.length)changes.items=values(actor.items).map(item=>{
  const source=item.toObject(true);
  if(affectedItems.includes(item))source.effects=values(item.effects).filter(row=>!excluded.has(row)).map(effectSource);
  return source;
 });
 const view=await actor.clone(changes,{keepId:true});
 // Detached synthetic actors must retain the original combat participation.
 if(typeof actor.isInCombatActive==='function')view.isInCombatActive=()=>actor.isInCombatActive();
 return view;
}
