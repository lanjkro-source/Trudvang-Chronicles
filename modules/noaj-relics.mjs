import {escapeAttribute,escapeHtml} from "./helpers.mjs";
import {isNoajTablet,NOAJ_DRAGON_TABLET,noajOrigins,noajRelic,noajRelicConflict,noajRelicForTablet,relicAttackResult,relicFitsTablet,relicsAtRisk,relicStatus} from "./rules/noaj-relics.mjs";
import {deleteEffectOnce} from "./effect-deletion.mjs";

const scope="trudvang-chronicles";
const t=(key,data)=>data?game.i18n.format(`TRUDVANG.NoajRelic.${key}`,data):game.i18n.localize(`TRUDVANG.NoajRelic.${key}`);
const jobs=new Map();

function withRelicLock(actor,work){
  const key=actor.uuid;
  const job=(jobs.get(key)??Promise.resolve()).catch(()=>{}).then(work);
  jobs.set(key,job);
  return job.finally(()=>{if(jobs.get(key)===job)jobs.delete(key);});
}

export function relicItemView(item){
  const relic=noajRelic(item),owner=item.actor??item.parent;
  if(!relic)return null;
  const originKey=noajOrigins.get(relic.creatureId);
  return {...relic,status:t(relicStatus(item)),origin:[relic.originName,originKey&&game.i18n.localize(originKey)].filter(Boolean).join(" · "),
    tablet:owner?.items?.get?.(relic.tabletId)?.name??"",canRestore:Boolean(game.user.isGM&&relic.broken),
    canConfigure:Boolean(item.isOwner&&!relic.ownerId&&!relic.broken)};
}

export function relicTabletView(actor,tablet){
  if(!isNoajTablet(tablet))return null;
  const item=noajRelicForTablet(actor,tablet.id);
  return {name:item?.name,itemId:item?.id,status:t(relicStatus(item)),canBind:game.user.isGM&&(!item||noajRelic(item).broken)};
}

const button=(action,label,callback,defaultButton=false)=>({
  action,label:game.i18n.localize(`TRUDVANG.Action.${label}`),callback,default:defaultButton
});
const option=(value,label,selected=false)=>`<option value="${escapeAttribute(value)}"${selected?" selected":""}>${escapeHtml(label)}</option>`;

export async function configureNoajRelic(item){
  if(item.type!=="gear"||!item.isOwner)return null;
  const relic=noajRelic(item);
  if(relic?.ownerId||relic?.broken)return null;
  if(Number(item.system.quantity??1)!==1||item.system.consumable||item.system.sacred?.enabled)return ui.notifications.warn(t("Individual"));
  const origins=[...noajOrigins].map(([value,key])=>[value,game.i18n.localize(key)]).sort((a,b)=>a[1].localeCompare(b[1],game.i18n.lang));
  const fields=[["part","Part",relic?.part],["originName","OriginName",relic?.originName]];
  const content=`<div class="trudvang roll-dialog">${fields.map(([name,label,value])=>`<label class="form-group"><span>${escapeHtml(t(label))}</span><input name="${name}" value="${escapeAttribute(value??"")}"></label>`).join("")}
    <label class="form-group"><span>${escapeHtml(t("Origin"))}</span><select name="creatureId">${origins.map(([id,label])=>option(id,label,id===relic?.creatureId)).join("")}</select></label></div>`;
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:t("Configure")},classes:["trudvang","dialog"],content,
    buttons:[button("continue","Continue",(_event,control)=>Object.fromEntries(new FormData(control.form)),true),
      button("cancel","Cancel",()=>null)],rejectClose:false});
  if(!noajOrigins.has(choice?.creatureId)||noajRelic(item)?.ownerId)return null;
  await item.update({"system.noajRelic.enabled":true,"system.noajRelic.creatureId":choice.creatureId,
    "system.noajRelic.part":String(choice.part??"").trim(),"system.noajRelic.originName":String(choice.originName??"").trim()});
  return item;
}

function canBind(actor,tablet,item){
  const relic=noajRelic(item);
  return Boolean(actor.items.get(tablet.id)===tablet&&isNoajTablet(tablet)&&relic&&!relic.broken&&!relic.ownerId&&Number(item.system.quantity??1)===1&&
    !relic.failedOwners?.includes(actor.id)&&relicFitsTablet(relic.creatureId,tablet.system.catalogId)&&
    !noajRelicConflict(actor,item,tablet.id));
}

export async function bindNoajRelic(actor,tablet){
  if(!game.user.isGM||!isNoajTablet(tablet))return null;
  const items=Array.from(actor.items).filter(item=>canBind(actor,tablet,item));
  if(!items.length)return ui.notifications.warn(t("NoCandidate"));
  const content=`<div class="trudvang roll-dialog"><p>${escapeHtml(t("Ritual"))}</p>
    <label class="form-group"><span>${escapeHtml(t("Title"))}</span><select name="relic">${items.map(item=>option(item.id,item.name)).join("")}</select></label>
    <label class="checkbox"><input type="checkbox" name="defeated">${escapeHtml(t("Defeated"))}</label></div>`;
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:`${t("Bind")} · ${tablet.name}`},classes:["trudvang","dialog"],content,
    buttons:[button("continue","Continue",(_event,control)=>({id:control.form.elements.relic.value,defeated:control.form.elements.defeated.checked}),true),
      button("cancel","Cancel",()=>null)],rejectClose:false});
  if(!choice?.id)return null;
  return withRelicLock(actor,async()=>{
    const item=actor.items.get(choice.id);
    if(!canBind(actor,tablet,item))return ui.notifications.warn(t("NoCandidate"));
    if(!choice.defeated){
      const {rollConfiguredTraitSituation}=await import("./dice.mjs");
      const result=await rollConfiguredTraitSituation({actor,sourceName:item.name,test:{action:t("Bind"),sv:7,trait:["psyche"]}});
      if(!result)return null;
      if(!result.success){
        await item.update({"system.noajRelic.failedOwners":[...(noajRelic(item).failedOwners??[]),actor.id]});
        return null;
      }
    }
    if(!canBind(actor,tablet,item))return null;
    await item.update({"system.noajRelic.ownerId":actor.id,"system.noajRelic.tabletId":tablet.id});
    if(tablet.system.catalogId===NOAJ_DRAGON_TABLET){
      // TEMPORARY WORLD MIGRATION — the first implementation had no inventory relic.
      for(const effect of Array.from(actor.effects??[]))if(effect.flags?.[scope]?.dragonRelicCracked)await deleteEffectOnce(effect);
    }
    return item;
  });
}

export async function restoreNoajRelic(item){
  if(!game.user.isGM||!noajRelic(item)?.broken)return null;
  const actor=item.actor??item.parent;
  const restore=async()=>{
    const relic=noajRelic(item);
    if(!relic?.broken)return null;
    const updates={"system.noajRelic.broken":false,"system.equipped":false};
    if(!actor?.items||relic.ownerId!==actor.id||!isNoajTablet(actor.items.get(relic.tabletId))||noajRelicConflict(actor,item,relic.tabletId)){
      updates["system.noajRelic.ownerId"]="";
      updates["system.noajRelic.tabletId"]="";
    }
    await item.update(updates);
    return item;
  };
  return actor?.documentName==="Actor"?withRelicLock(actor,restore):restore();
}

export async function resolveNoajRelicHit(actor,message,damage){
  return withRelicLock(actor,async()=>{
    const key=encodeURIComponent(actor.uuid).replaceAll(".","%2E");
    const path=`flags.${scope}.noajRelicHits.${key}`;
    let result=message.getFlag(scope,"noajRelicHits")?.[key];
    if(!result){
      const relics=relicsAtRisk(actor);
      if(!relics.length||damage<=0)return null;
      const roll=await new Roll("1d20").evaluate();
      result=relicAttackResult(relics,Number(roll.total),damage);
      if(!result)throw Error("Invalid relic attack roll");
      await message.update({[path]:result});
    }
    if(result.broken&&!result.settled){
      const item=actor.items.get(result.itemId);
      if(noajRelic(item)&&!noajRelic(item).broken)await item.update({"system.noajRelic.broken":true,"system.equipped":false});
      result={...result,settled:true};
      await message.update({[path]:result});
    }
    return result;
  });
}

export const relicHitText=result=>result?.itemId?t(result.broken?"HitBroken":"HitIntact",result):"";
