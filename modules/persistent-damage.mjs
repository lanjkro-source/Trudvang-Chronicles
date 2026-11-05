import {TRANSFORMATION_TEMPLATES} from './transformation-data.mjs';
import {POWER_DETAILS_BY_ID} from './power-catalog-data.mjs';
import {magicDamageProfile,magicDamageExplanations} from './magic-damage.mjs';
import {ruleTestCastingContext} from './rules/magic-resistance.mjs';
import {settleAuraJobs} from './aura.mjs';
import {expireRoundEffects} from './combat-effects.mjs';

const S='trudvang-chronicles',queues=new Map();
let provider=()=>[],expire=async()=>{};
const writer=()=>Boolean(game.users?.activeGM?.isSelf);
export function persistentDamageDefinition(effect){
 const template=TRANSFORMATION_TEMPLATES[effect.flags?.[S]?.transformation?.key];
 const definition=effect.flags?.[S]?.persistentDamage??template?.persistentDamage;
 if(!definition||effect.parent?.documentName!=='Actor'||effect.parent.type==='effect'||effect.disabled||effect.isSuppressed||effect.duration?.expired)return null;
 if(template?.aura&&!effect.flags?.[S]?.auraRecipient)return null;
 return definition;
}
function serialized(effect,operation){
 const key=effect.uuid,previous=queues.get(key)??Promise.resolve();
 const next=previous.catch(()=>{}).then(operation).finally(()=>{if(queues.get(key)===next)queues.delete(key);});
 queues.set(key,next);return next;
}
/** An event is claimed before rolling; its identity is also saved on the card.
 * Recovery can reuse a published card after a crash instead of rolling twice. */
export function triggerPersistentDamage(effect,{kind='apply',combat=game.combat,round=combat?.round}={}){
 return serialized(effect,async()=>{
  if(!writer())return null;
  const definition=persistentDamageDefinition(effect);
  if(!definition||(kind==='apply'?!definition.onApply:!definition.onRound))return null;
  const actor=effect.parent;
  if(actor.effects?.get&&actor.effects.get(effect.id)!==effect)return null;
  const auraSourceUuid=effect.flags?.[S]?.auraRecipient?.sourceEffectUuid;
  if(auraSourceUuid){
   const source=await foundry.utils.fromUuid(auraSourceUuid).catch(()=>null);
   if(!source||source.disabled||source.isSuppressed||source.duration?.expired){await effect.delete();return null;}
  }
  const old=effect.flags?.[S]?.persistentDamageClock;
  const clock=old?.effectUuid===effect.uuid?structuredClone(old):{effectUuid:effect.uuid};
  const key=`${effect.uuid}:${kind==='apply'?'apply':`${combat.id}:${round}`}`;
  if(clock.pending!==key){
   if(kind==='apply'&&clock.applied)return null;
   if(kind==='round'&&clock.lastRound?.combatId===combat.id&&clock.lastRound.round>=round)return null;
  }
  if(kind==='apply')clock.applied=true;
  if(combat?.started)clock.lastRound={combatId:combat.id,round:Number(round)};
  clock.pending=key;
  await effect.update({[`flags.${S}.persistentDamageClock`]:clock});
  let message=Array.from(game.messages?.values?.()??game.messages??[]).find(row=>row.flags?.[S]?.persistentDamageEvent===key);
  if(!message){
   const profile=definition.formula?definition:magicDamageProfile(effect);
   if(!profile)throw Error('Persistent damage has no damage profile');
   const casting=ruleTestCastingContext(effect);
   let damageResistance;
   if(definition.resistance&&(!definition.resistance.events||definition.resistance.events.includes(kind))){
    const {ruleTestsForDocument}=await import('./rule-tests.mjs');
    const test=ruleTestsForDocument(effect)[definition.resistance.testIndex];
    if(!test)throw Error('Persistent damage resistance has no configured test');
    damageResistance={...definition.resistance,test:structuredClone(test),casting,sourceName:effect.name};
   }
   const {rollDamage}=await import('./dice.mjs');
   const token=actor.token??actor.getActiveTokens?.(false,true)?.[0];
   const result=await rollDamage({actor,item:{name:effect.name,img:effect.img,system:{category:'magic',damage:profile.formula,openRoll:profile.openRoll,damageBonus:0,strengthApplies:false,damageQualification:profile.qualification}},context:{usage:'magic',ignoreActorDamage:true,automatic:true,returnMessage:true,qualification:profile.qualification,
    targets:[{actor,document:token?.document??token,name:token?.name??actor.name}],boundActorUuid:actor.uuid,sourceEffectUuid:effect.uuid,persistentDamageEvent:key,targetTags:definition.targetTags??POWER_DETAILS_BY_ID[casting.sourceId]?.damageRoll?.targetTags??[],damageExplanations:definition.formula?[]:magicDamageExplanations(effect,profile),damageResistance,alternatives:definition.alternatives??[]}});
   message=result?.message;
  }
  if(!message)throw Error('Persistent damage did not publish a card');
  if(!message.getFlag(S,'damageContext')?.resistance&&!definition.alternatives?.length){
   const {requestChatApplication}=await import('./chat-application.mjs');
   const result=await requestChatApplication({message,actor,channel:'body'});
   if(!['applied','alreadyApplied','ineligibleTarget'].includes(result.status))throw Error('Persistent damage application failed');
  }
  clock.pending=null;
  await effect.update({[`flags.${S}.persistentDamageClock`]:clock});
  return message;
 });
}

export async function processPersistentDamageRound(combat,previous,current,{effects=provider,expireEffects=expire,settle=settleAuraJobs}={}){
 if(!writer()||Number(current.round)<=Number(previous.round))return;
 // Native expiry hooks and aura cleanup may run asynchronously. Complete both
 // explicitly, then collect the surviving effects, rather than retaining a stale list.
 await expireRoundEffects(combat);
 await expireEffects({time:Number(game.time?.worldTime),combat});
 await settle();
 const actors=new Set(Array.from(combat.combatants?.values?.()??combat.combatants??[]).map(row=>row.actor?.uuid));
 for(const token of combat.scene?.tokens??[])actors.add(token.actor?.uuid);
 for(const effect of effects())if(actors.has(effect.parent?.uuid)&&persistentDamageDefinition(effect)?.onRound)
  await triggerPersistentDamage(effect,{kind:'round',combat,round:Number(current.round)});
}

export function registerPersistentDamageHooks({effects,expireEffects}){
 provider=effects;expire=expireEffects;
 const safely=promise=>promise.catch(error=>console.error('Trudvang | Persistent damage failed',error));
 Hooks.on('createActiveEffect',effect=>{if(writer()&&persistentDamageDefinition(effect)?.onApply)return safely(triggerPersistentDamage(effect));});
 Hooks.on('ready',async()=>{
  if(!writer())return;
  if(game.combat)await expireRoundEffects(game.combat);
  await expire({time:Number(game.time?.worldTime),combat:game.combat});await settleAuraJobs();
  for(const effect of provider())if(effect.flags?.[S]?.persistentDamageClock?.pending){
   const clock=effect.flags[S].persistentDamageClock,kind=clock.pending.endsWith(':apply')?'apply':'round';
   const combat=game.combats?.get(clock.lastRound?.combatId)??game.combat;
   if(kind==='round'&&combat?.id!==clock.lastRound?.combatId)continue;
   await safely(triggerPersistentDamage(effect,{kind,combat,round:clock.lastRound?.round}));
  }
 });
}
