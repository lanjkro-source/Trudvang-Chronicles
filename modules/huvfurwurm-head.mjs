import {dragonRelicCracked, huvfurwurmGuard, huvfurwurmHibernation, huvfurwurmThreshold} from "./rules/huvfurwurm-head.mjs";
import {itemEffectRemainingSeconds} from "./rules/effect-duration.mjs";
import {bodyHealthUpdate} from "./rules/body-health.mjs";
import {effectSource} from "./rules/effect-source.mjs";
import {deleteEffectOnce} from "./effect-deletion.mjs";

const scope = "trudvang-chronicles";
const jobs = new WeakMap();
const local = (key,data) => data ? game.i18n.format(`TRUDVANG.HuvfurwurmHead.${key}`,data)
  : game.i18n.localize(`TRUDVANG.HuvfurwurmHead.${key}`);
const health = actor => Number(actor?.system?.resources?.body?.current??actor?.system?.resources?.body?.value??1);
const Chat = () => globalThis.foundry?.documents?.ChatMessage?.implementation??globalThis.ChatMessage;

async function notice(actor,key,roll) {
  const {escapeHtml} = await import("./helpers.mjs");
  const message = Chat();
  await message.create({speaker:message.getSpeaker({actor}),
    content:`<p class="trudvang consequence-notice">${escapeHtml(local(key,{actor:actor.name}))}</p>`,
    ...(roll?{rolls:[roll]}:{})});
}

export function canConfirmHuvfurwurmBlow(effect) {
  return Boolean(game.user?.isGM && health(effect.parent)<=0 && huvfurwurmGuard(effect.parent)===effect);
}

export function resolveHuvfurwurmDeath(actor) {
  if (!game.user?.isGM || health(actor)>0) return Promise.resolve(false);
  if (jobs.has(actor)) return jobs.get(actor);
  const job = (async()=>{
    if (Array.from(actor.effects??[]).some(huvfurwurmHibernation)) return true;
    const guard=huvfurwurmGuard(actor);
    if (!guard || itemEffectRemainingSeconds(guard,{time:Number(game.time?.worldTime)||0,combat:game.combat})===0) return false;
    const saved=guard.flags?.[scope]?.huvfurwurmRoll;
    const roll=saved?Roll.fromData(saved):await new Roll("1d10").evaluate();
    if(!saved)await guard.update({[`flags.${scope}.huvfurwurmRoll`]:roll.toJSON()});
    if (Number(roll.total)<huvfurwurmThreshold(guard)) {
      await guard.update({[`flags.${scope}.huvfurwurmFailed`]:true});
      await notice(actor,"Failed",roll).catch(error=>console.error("Trudvang | Death roll notice failed",error));
      return false;
    }
    const start=foundry.documents.ActiveEffect.implementation.getEffectStart();
    const create=(name,marker,duration,statuses=[])=>effectSource({name:local(name),description:local(name+"Description"),
      img:guard.img,type:"effect",transfer:false,origin:guard.uuid,start,statuses,duration,
      system:{stackId:marker,stacking:"replace",changes:[]},flags:{[scope]:{[marker]:true}}});
    if(!dragonRelicCracked(actor))await actor.createEmbeddedDocuments("ActiveEffect",[
      create("Hibernation","huvfurwurmHibernation",{value:1,units:"months"},["unconscious"]),
      create("Cracked","dragonRelicCracked",{value:null,units:"days"})
    ]);
    await actor.update({"system.survivalRounds":0});
    await deleteEffectOnce(guard);
    await notice(actor,"Survived",roll).catch(error=>console.error("Trudvang | Hibernation notice failed",error));
    return true;
  })();
  jobs.set(actor,job);
  return job.finally(()=>jobs.delete(actor));
}

export async function finishHuvfurwurmHibernation(effect) {
  if(!huvfurwurmHibernation(effect))return false;
  const actor=effect.parent;
  if(health(actor)<=0)await actor.update({...bodyHealthUpdate(actor,1),"system.survivalRounds":-1});
  await deleteEffectOnce(effect,{trudvangExpired:true});
  await notice(actor,"Awoke").catch(error=>console.error("Trudvang | Recovery notice failed",error));
  return true;
}

export async function confirmHuvfurwurmBlow(effect) {
  if(!canConfirmHuvfurwurmBlow(effect))return null;
  const {escapeHtml}=await import("./helpers.mjs");
  const confirmed=await foundry.applications.api.DialogV2.confirm({
    window:{title:local("FatalBlow")},content:`<p>${escapeHtml(local("FatalBlowConfirm",{actor:effect.parent.name}))}</p>`
  });
  if(confirmed!==true||!canConfirmHuvfurwurmBlow(effect))return null;
  const actor=effect.parent;
  if(!await resolveHuvfurwurmDeath(actor))await actor.update({"system.survivalRounds":0});
  return true;
}
