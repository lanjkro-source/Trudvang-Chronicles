import {activeBarriers, airShieldTest, crossesBarrier, tokenBarrierCenter, vitnerWallTest} from "./rules/spell-barriers.mjs";
import {impactSize} from "./rules/impact.mjs";
import {deterministicId} from "./skill-pack-data.mjs";

const scope = "trudvang-chronicles";
const resolving = new Map();
const crossing = new WeakMap();
const now = level => ({level,time:Number(game.time?.worldTime)||0,combat:game.combat});
const info = region => region.flags[scope].spellZone;
const local = (key,data) => data ? game.i18n.format(`TRUDVANG.SpellBarrier.${key}`,data) : game.i18n.localize(`TRUDVANG.SpellBarrier.${key}`);

export function airShieldCover(from, to) {
  if (!from?.actor || !to?.actor || from.parent?.id !== to.parent?.id || from.level !== to.level) return [];
  return activeBarriers(from.parent,"airShield",now(to.level)).filter(region =>
    crossesBarrier(region,tokenBarrierCenter(from),tokenBarrierCenter(to)))
    .map(region => ({name:region.name,value:info(region).profile.protection}));
}

export function interceptAirShieldMovement(token,movement) {
  const actor = token.actor;
  if (!actor?.isOwner || !token.move) return;
  const pending = movement.pending?.waypoints?.length ? movement.pending.waypoints : [movement.destination];
  const path = [movement.origin,...pending];
  const regions = activeBarriers(token.parent,"airShield",now(movement.origin?.level??token.level)).filter(region =>
    info(region).profile.size >= impactSize(actor) && path.slice(1).some((point,index) => {
      const previous = path[index];
      if (!previous || !point || (previous.level??token.level) !== (point.level??token.level)
          || CONFIG.Token?.movement?.actions?.[point.action]?.teleport) return false;
      return crossesBarrier(region,tokenBarrierCenter(token,previous),tokenBarrierCenter(token,point));
    }));
  if (!regions.length) return;
  const active = crossing.get(token);
  if (active?.replay && regions.every(region=>active.approved.has(region.uuid))) return;
  if (!active) {
    const attempt = {approved:new Set(),replay:false};
    crossing.set(token,attempt);
    void (async()=>{
      const {rollConfiguredTraitSituation} = await import("./dice.mjs");
      for (const region of regions) {
        if (!activeBarriers(token.parent,"airShield",now(token.level)).includes(region)) continue;
        const test={sv:airShieldTest(info(region).profile,impactSize(actor)),trait:["strength"],traitMethod:"first",action:local("CrossAir")};
        const result=await rollConfiguredTraitSituation({actor,test,sourceName:region.name});
        if (!result?.success) return;
        attempt.approved.add(region.uuid);
      }
      if (token.x!==movement.origin.x || token.y!==movement.origin.y || token.level!==(movement.origin.level??token.level)) return;
      const waypoints=pending.map(({x,y,elevation,level,action,explicit})=>({x,y,elevation,level,action,explicit}));
      attempt.replay=true;
      await token.move(waypoints,{showRuler:movement.showRuler,autoRotate:movement.autoRotate});
    })().catch(error=>console.error("Trudvang | Air shield crossing failed",error)).finally(()=>crossing.delete(token));
  }
  return false;
}

export async function vitnerWallBlocks({scene, level, origin, target, message}) {
  const casting=message?.flags?.[scope]?.ruleTestContext;
  const spellLevel=Number(casting?.sourceLevel);
  if(casting?.kind!=="spell" || !Number.isInteger(spellLevel) || spellLevel<1 || spellLevel>5) return false;
  const walls=activeBarriers(scene,"vitnerWall",now(level)).filter(region=>crossesBarrier(region,origin,target));
  for(const region of walls) if(await resolveWallTest(region,message,spellLevel))return true;
  return false;
}

async function resolveWallTest(region,source,spellLevel) {
  const id=deterministicId(`vitner-wall:${region.uuid}:${source.id}`);
  const saved=game.messages.get(id)?.flags?.[scope]?.vitnerWallTest;
  if(saved) return saved.blocked;
  if(resolving.has(id)) return resolving.get(id);
  const job=(async()=>{
    const caster=await foundry.utils.fromUuid(info(region).context.casterUuid);
    if(!caster?.isOwner || caster.canPerformAction?.()===false) return false;
    const {rollUnder}=await import("./dice.mjs");
    const result=await rollUnder({actor:caster,label:local("TestWall",{wall:region.name,level:spellLevel}),
      target:vitnerWallTest(info(region).profile,spellLevel)+Number(caster.getRollModifier?.({kind:"situation"})||0),
      kind:"situation",successConsequence:local("Blocked"),failureConsequence:local("Passed"),
      publishMessage:async(data,outcome)=>{
        const Chat=globalThis.foundry?.documents?.ChatMessage?.implementation??globalThis.ChatMessage;
        const message=await Chat.create({...data,_id:id,
          flags:{...data.flags,[scope]:{...data.flags?.[scope],vitnerWallTest:{blocked:outcome.success}}}},{keepId:true});
        return {message,animate:true};
      }});
    return result.success;
  })();
  resolving.set(id,job);
  try{return await job;}finally{resolving.delete(id);}
}
