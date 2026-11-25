import {castingCooldownRemaining} from './mobility-effects.mjs';
import {TRUDVANG} from "../config.mjs";
import {TABLET_BY_ID} from "../tablet-catalog.mjs";
import {activeSpellInstances} from "./active-spell-resolver.mjs";
import {resolveVitnerSacrifice} from "./magic-power-resolver.mjs";
import {knowledgeRank} from "./magic-resistance.mjs";
import {divineFailureRestriction, divinePowerId} from "./divine-failure.mjs";
import {fatalAmnesia, fatalSpellBlindness} from "./fatal-magic.mjs";
import {DRAGON_TABLET,dragonRelicCracked} from "./huvfurwurm-head.mjs";
import {noajRelicForTablet,relicStatus} from "./noaj-relics.mjs";

export function spellActorForItem(item,{user=game.user,controlled=globalThis.canvas?.tokens?.controlled??[]}={}){
 const owner=item?.actor??(item?.parent?.documentName==="Actor"?item.parent:null);
 if(owner)return owner;
 const selected=Array.from(controlled).find(t=>["character","npc"].includes(t.actor?.type));
 return selected?.actor??(["character","npc"].includes(user?.character?.type)?user.character:null);
}

/** Read-only prerequisites shared by the sheet and the actual launch. Costs
 * include the existing optional health sacrifice; never disable it for low vitner. */
export function spellAvailability(actor,item,{sealed=false}={}){
 const deny=(reason,data={})=>({ok:false,reason,data});
 if(item?.system?.isRune)return deny("TRUDVANG.Power.RuneObjectNeeded");
 if(!actor||!["character","npc"].includes(actor.type))return deny("TRUDVANG.Warning.SpellCasterRequired");
 if(actor.isOwner===false)return deny("TRUDVANG.Warning.SpellCasterPermission");
 if(actor.canPerformAction?.()===false)return deny("TRUDVANG.Warning.CannotAct");
 if(fatalAmnesia(actor))return deny("TRUDVANG.FatalMagic.AmnesiaRule");
 if(item.type==="divineFeat"){
  const restriction=divineFailureRestriction(actor,divinePowerId(item));
  if(restriction)return deny(restriction);
 }
 if(item.type==="spell"&&fatalSpellBlindness(actor))return deny("TRUDVANG.FatalMagic.Blindness");
 const cooldown=castingCooldownRemaining(actor,item.system?.catalogId);if(cooldown>0)return deny("TRUDVANG.Mobility.Cooldown",{seconds:cooldown});
 const grant=item.flags?.["trudvang-chronicles"]?.transformationGrant;
 if(grant&&!Array.from(actor.allApplicableEffects?.()??actor.effects??[]).some(e=>e.id===grant&&!e.disabled&&!e.isSuppressed&&!e.duration?.expired))return deny("TRUDVANG.Transformation.Restricted");
 const divine=item.type==="divineFeat",items=Array.from(actor.items??[]),discipline=divine?"invoke":"vitnerShaping";
 const tabletId=item.system.tabletId||(item.system.catalogId?.includes(":")?item.system.catalogId.split(":")[0]:"");
 if(divine&&tabletId===DRAGON_TABLET&&dragonRelicCracked(actor))return deny("TRUDVANG.HuvfurwurmHead.CrackedDescription");
 const definition=TABLET_BY_ID.get(tabletId),tablet=items.find(i=>i.type==="tablet"&&(i.system.catalogId===tabletId||i.name===item.system.tablet));
 const religion=item.system.religion||definition?.religion||tablet?.system.religion;
 if(divine&&!grant&&religion==="haminges"){
  const relic=tablet&&noajRelicForTablet(actor,tablet.id);
  if(relicStatus(relic)!=="worn")return deny(`TRUDVANG.NoajRelic.Casting.${relicStatus(relic)}`);
 }
 const specialties=divine?(TRUDVANG.religions[religion]&&!grant?[TRUDVANG.religions[religion].specialty]:Object.values(TRUDVANG.religions).map(r=>r.specialty)):["galding","sejding","vyrding"];
 const innate=actor.type==="npc"&&actor.system.magic?.castingTarget!==null&&actor.system.magic?.castingTarget!==undefined&&Number.isFinite(Number(actor.system.magic.castingTarget));
 if(!innate&&(knowledgeRank(actor,discipline)<1||!specialties.some(id=>knowledgeRank(actor,id)>0)))return deny(actor.type==="npc"?"TRUDVANG.Npc.ConfigureMagicMethod":"TRUDVANG.Warning.MagicMethodRequired");
 const knowsPower=item.actor===actor||item.parent===actor||items.some(i=>["spell","divineFeat"].includes(i.type)&&item.system.catalogId&&i.system.catalogId===item.system.catalogId);
 if(tabletId&&!grant&&!(actor.type==="npc"&&(innate||knowsPower))){
  if(!tablet)return deny("TRUDVANG.Warning.SpellTabletRequired");
  const required=Number(item.system.level)||1;
  if(Number(tablet.system.level||0)<required)return deny("TRUDVANG.Warning.SpellTabletLevelRequired",{level:required});
 }
 if(!sealed&&!divine&&item.system.spellType==="lasting"&&activeSpellInstances(actor).length>=actor.activeSpellLimit)return deny("TRUDVANG.Warning.ActiveSpellLimit");
 const cost=Number(item.system.cost??TRUDVANG.spellCosts[item.system.level]??0);
 const resource=actor.system.resources?.[divine?"divinity":"vitner"]??{};
 const available=Number(resource.current??resource.value??0)+(divine?Number(resource.temporary||0):0);
 if(cost>available&&!(actor.unlimitedVitner&&!divine)){
  if(divine||actor.fatalVitnerState?.depleted)return deny("TRUDVANG.Warning.NotEnoughPower");
  const body=actor.system.resources?.body??{};
  if(!resolveVitnerSacrifice({totalCost:cost,currentVitner:available,currentHP:body.current??body.value,maxHP:body.max})?.feasible)return deny("TRUDVANG.Warning.NotEnoughPower");
 }
 return {ok:true,reason:"",data:{},specialtyIds:specialties};
}
