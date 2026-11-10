const S='trudvang-chronicles',jobs=new WeakMap();
const values=collection=>Array.from(collection?.values?.()??collection??[]);
const meta=effect=>effect?.flags?.[S]?.transformation;
const present=effect=>effect?.parent?.documentName==='Actor'&&values(effect.parent.effects).includes(effect);
const serialize=(effect,work)=>{
 const job=(jobs.get(effect)??Promise.resolve()).catch(()=>{}).then(work);jobs.set(effect,job);
 return job.finally(()=>{if(jobs.get(effect)===job)jobs.delete(effect);});
};
function expired(state,{combat=game.combat,time=Number(game.time?.worldTime)||0,ended=false}={}){
 return state.combatId?(time>=state.until||ended||!combat?.started||combat.id!==state.combatId||Number(combat.round)!==state.round):time>=state.until;
}
/** Relief edits the existing effect, so it cannot outlive its source or create
 * an unrelated positive bonus. Repeated success never stacks the relief. */
export async function applyRoundResistanceRelief(effect,testIndex,result){
 const spec=meta(effect)?.roundResistance;
 if(!spec||spec.testIndex!==testIndex||!result?.success||!effect.parent?.isOwner)return false;
 return serialize(effect,async()=>{
  if(!present(effect)||effect.disabled||effect.isSuppressed||effect.duration?.expired)return false;
  const stored=effect.flags?.[S]?.roundResistanceRelief;
  if(stored&&!expired(stored))return false;
  if(stored)await reset(effect);
  const changes=structuredClone(effect._source?.system?.changes??effect.system?.changes??[]);
  const index=changes.findIndex(row=>row.key===spec.key&&row.type==='add'&&Number.isFinite(Number(row.value)));
  if(index<0)return false;
  const before=String(changes[index].value),after=String(Number(before)+spec.relief);changes[index].value=after;
  const combat=game.combat,now=Number(game.time?.worldTime)||0;
  const state={index,key:spec.key,before,after,summary:meta(effect).summary??'',combatId:combat?.started?combat.id:null,round:Number(combat?.round)||0,until:now+5};
  await effect.update({'system.changes':changes,[`flags.${S}.roundResistanceRelief`]:state,[`flags.${S}.transformation.summary`]:game.i18n.format(spec.summaryKey,{value:after}),[`flags.${S}.transformation.summaryResolved`]:true});
  return true;
 });
}
async function reset(effect){
 if(!present(effect))return false;
 const state=effect.flags?.[S]?.roundResistanceRelief;if(!state)return false;
 const changes=structuredClone(effect._source?.system?.changes??effect.system?.changes??[]),row=changes[state.index];
 // A manual edit while relief was active remains authoritative.
 if(row?.key===state.key&&row.type==='add'&&String(row.value)===state.after)row.value=state.before;
 await effect.update({'system.changes':changes,[`flags.${S}.-=roundResistanceRelief`]:null,[`flags.${S}.transformation.summary`]:state.summary});
 return true;
}
export async function resetRoundResistances({combat=game.combat,time=Number(game.time?.worldTime)||0,ended=false}={}){
 if(!game.users?.activeGM?.isSelf)return;
 const actors=new Map(values(game.actors).map(actor=>[actor.uuid,actor]));
 for(const scene of values(game.scenes))for(const token of values(scene.tokens))if(token.actor)actors.set(token.actor.uuid,token.actor);
 for(const entry of values(combat?.combatants))if(entry.actor)actors.set(entry.actor.uuid,entry.actor);
 for(const actor of actors.values())for(const effect of values(actor.effects)){
  const state=effect.flags?.[S]?.roundResistanceRelief;
  if(state?.combatId&&combat&&state.combatId!==combat.id)continue;
  if(state&&expired(state,{combat,time,ended}))await serialize(effect,()=>reset(effect));
 }
}
export function registerRoundResistanceHooks(){
 const safely=options=>resetRoundResistances(options).catch(error=>console.error('Trudvang | Round resistance reset failed',error));
 for(const hook of ['combatTurnChange','updateCombat'])Hooks.on(hook,combat=>safely({combat}));
 Hooks.on('deleteCombat',combat=>safely({combat,ended:true}));
 Hooks.on('updateWorldTime',time=>safely({time}));
 Hooks.on('ready',()=>safely({}));
}
