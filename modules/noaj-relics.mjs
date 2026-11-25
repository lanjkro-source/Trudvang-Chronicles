import {escapeAttribute,escapeHtml} from "./helpers.mjs";
import {isNoajTablet,NOAJ_DRAGON_TABLET,noajOrigins,noajRelic,noajRelicConflict,noajRelicForTablet,noajRelics,relicAttackResult,relicFitsTablet,relicsAtRisk,relicStatus} from "./rules/noaj-relics.mjs";
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

const originType=relic=>game.i18n.localize(noajOrigins.get(relic.creatureId)??"TRUDVANG.NoajRelic.UnknownOrigin");

export function relicItemView(item){
  const relic=noajRelic(item),owner=item.actor??item.parent;
  if(!relic)return null;
  return {status:t(relicStatus(item)),provenance:[relic.part,[relic.originName,originType(relic)].filter(Boolean).join(", ")].filter(Boolean).join(" - "),
    tablet:owner?.items?.get?.(relic.tabletId)?.name??"",canRestore:Boolean(game.user.isGM&&relic.broken)};
}

export function relicTabletView(actor,tablet){
  if(!isNoajTablet(tablet))return null;
  const item=noajRelicForTablet(actor,tablet.id);
  const status=relicStatus(item);
  return {name:item?.name,itemId:item?.id,status:t(status),unavailable:status!=="worn",hint:status==="worn"?"":t(`Casting.${status}`)};
}

const button=(action,label,callback,defaultButton=false)=>({
  action,label:game.i18n.localize(`TRUDVANG.Action.${label}`),callback,default:defaultButton
});
const option=(value,label,selected=false,disabled=false)=>`<option value="${escapeAttribute(value)}"${selected?" selected":""}${disabled?" disabled":""}>${escapeHtml(label)}</option>`;

export async function configureNoajRelic(item){
  if(item.type!=="gear"||!item.isOwner)return null;
  const relic=noajRelic(item);
  const originLocked=Boolean(relic?.ownerId||relic?.broken);
  if(Number(item.system.quantity??1)!==1||item.system.consumable||item.system.sacred?.enabled)return ui.notifications.warn(t("Individual"));
  const origins=[...noajOrigins].map(([value,key])=>[value,game.i18n.localize(key)]).sort((a,b)=>a[1].localeCompare(b[1],game.i18n.lang));
  const fields=[["part","Part",relic?.part],["originName","OriginName",relic?.originName]];
  const content=`<div class="trudvang roll-dialog">${fields.map(([name,label,value])=>`<label class="form-group"><span>${escapeHtml(t(label))}</span><input name="${name}" value="${escapeAttribute(value??"")}"></label>`).join("")}
    <label class="form-group"><span>${escapeHtml(t("Origin"))}</span><select name="creatureId"${originLocked?" disabled":""}>${origins.map(([id,label])=>option(id,label,id===relic?.creatureId)).join("")}</select></label></div>`;
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:t("Configure")},classes:["trudvang","dialog"],content,
    buttons:[button("continue","Continue",(_event,control)=>Object.fromEntries(new FormData(control.form)),true),
      button("cancel","Cancel",()=>null)],rejectClose:false});
  if(!choice)return null;
  const live=noajRelic(item);
  const creatureId=originLocked||live?.ownerId||live?.broken?live?.creatureId:choice.creatureId;
  if(!noajOrigins.has(creatureId))return null;
  const originChanged=live&&live.creatureId!==creatureId;
  await item.update({"system.magical":true,"system.noajRelic.enabled":true,"system.noajRelic.creatureId":creatureId,
    ...(originChanged?{"system.noajRelic.boundOwners":[],"system.noajRelic.failedOwners":[]}:{}),
    "system.noajRelic.part":String(choice.part??"").trim(),"system.noajRelic.originName":String(choice.originName??"").trim()});
  return item;
}

function canBind(actor,tablet,item){
  const relic=noajRelic(item);
  return Boolean(actor.items.get(tablet.id)===tablet&&isNoajTablet(tablet)&&relic&&!relic.broken&&!relic.ownerId&&Number(item.system.quantity??1)===1&&
    !relic.failedOwners?.includes(actor.id)&&relicFitsTablet(relic.creatureId,tablet.system.catalogId)&&
    !noajRelicConflict(actor,item,tablet.id,{replacing:true}));
}

function unlinkRelic(actor,item){
  const relic=noajRelic(item);
  return {_id:item.id,"system.noajRelic.ownerId":"","system.noajRelic.tabletId":"",
    "system.noajRelic.boundOwners":[...new Set([...(relic.boundOwners??[]),actor.id])]};
}

export async function bindNoajRelic(actor,tablet){
  if(!isNoajTablet(tablet))return null;
  const mayBind=game.user.isGM;
  const current=noajRelicForTablet(actor,tablet.id);
  const relics=Array.from(actor.items).filter(noajRelic);
  const hasCandidate=relics.some(item=>canBind(actor,tablet,item));
  const options=relics.map(item=>option(item.id,`${item.name} (${originType(noajRelic(item))})`,false,!canBind(actor,tablet,item))).join("");
  const content=`<div class="trudvang roll-dialog">
    ${mayBind&&hasCandidate?`<p>${escapeHtml(t("Ritual"))}</p>`:""}
    ${relics.length?`<label class="form-group"><span>${escapeHtml(t("Title"))}</span><select name="relic">${option("",t("Choose"),true,true)}${options}</select></label>`:`<p>${escapeHtml(t("None"))}</p>`}
    ${mayBind&&relics.length&&!hasCandidate?`<p>${escapeHtml(t("NoCandidate"))}</p>`:""}
    ${mayBind&&hasCandidate?`<label class="checkbox"><input type="checkbox" name="defeated">${escapeHtml(t("Defeated"))}</label>`:""}
    ${mayBind?"":`<p>${escapeHtml(t("GMOnly"))}</p>`}</div>`;
  const buttons=[];
  if(mayBind&&hasCandidate)buttons.push(button("continue","Continue",(_event,control)=>({id:control.form.elements.relic.value,defeated:control.form.elements.defeated.checked}),true));
  if(mayBind&&current)buttons.push({action:"unlink",label:t("Unlink"),callback:()=>({unlink:true})});
  buttons.push(button("cancel","Cancel",()=>null,!hasCandidate||!mayBind));
  const choice=await foundry.applications.api.DialogV2.wait({window:{title:`${t("Bind")} · ${tablet.name}`},classes:["trudvang","dialog"],content,buttons,rejectClose:false});
  if(!mayBind||!game.user.isGM||(!choice?.id&&!choice?.unlink))return null;

  return withRelicLock(actor,async()=>{
    if(actor.items.get(tablet.id)!==tablet||noajRelicForTablet(actor,tablet.id)?.id!==current?.id)return null;
    const previous=noajRelics(actor).filter(item=>noajRelic(item).tabletId===tablet.id);
    if(choice.unlink){
      if(previous.length)await actor.updateEmbeddedDocuments("Item",previous.map(item=>unlinkRelic(actor,item)));
      return null;
    }
    const item=actor.items.get(choice.id);
    if(!canBind(actor,tablet,item))return ui.notifications.warn(t("NoCandidate"));
    if(!choice.defeated&&!noajRelic(item).boundOwners?.includes(actor.id)){
      const {rollConfiguredTraitSituation}=await import("./dice.mjs");
      const result=await rollConfiguredTraitSituation({actor,sourceName:item.name,test:{action:t("Bind"),sv:7,trait:["psyche"]}});
      if(!result)return null;
      if(!result.success){
        await item.update({"system.noajRelic.failedOwners":[...(noajRelic(item).failedOwners??[]),actor.id]});
        return null;
      }
    }
    if(!canBind(actor,tablet,item))return null;
    await actor.updateEmbeddedDocuments("Item",[
      ...previous.map(old=>unlinkRelic(actor,old)),
      {_id:item.id,"system.noajRelic.ownerId":actor.id,"system.noajRelic.tabletId":tablet.id}
    ]);
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
