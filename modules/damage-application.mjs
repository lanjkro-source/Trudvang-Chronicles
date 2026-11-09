import {conditionalProtectionRows} from "./rules/conditional-protection.mjs";
import {temporaryHealthState,temporaryHealthUpdate} from "./rules/transformation-profile.mjs";
import { weaponUsesTwoHands } from "./rules/combat-pool-resolver.mjs";
import {postActorEvent} from "./actor-event-chat.mjs";
import {activeTransformations, effectRules, remainingStoneIntegrity, TRANSFORMATION_SCOPE} from "./rules/transformation-profile.mjs";
import {hasProfileChanges} from "./rules/effect-rule-changes.mjs";
import {bodyHealthUpdate} from "./rules/body-health.mjs";
import {consumablePolicy} from "./rules/consumable-effects.mjs";
import {TRANSFORMATION_TEMPLATES} from "./transformation-data.mjs";
import {resolveArmorProfile} from "./rules/equipment-resolver.mjs";
import {damageQualification, qualifyDamage} from "./rules/damage-qualifications.mjs";
import {blessedArmorEffects} from "./rules/blessed-armor.mjs";
import {intrinsicIntegrityValue,itemProtectionModifiers,preparedItemProtection} from './rules/item-magic.mjs';

const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integrity = item => number(item?.system?.breach?.value);
const protection = item => item?.type === "armor" ? resolveArmorProfile({item}).protection.value : Math.max(0,preparedItemProtection(item)+itemProtectionModifiers(item).reduce((sum,row)=>sum+row.amount,0));

// System clarification: the breaking hit can make integrity negative; later hits cannot lower it further.
function damageIntegrity(item, loss) {
  const current = integrity(item);
  const integrityLoss = current > 0 ? loss : 0;
  return {integrityLoss, integrity: current - integrityLoss};
}

/** The shield-hand item (or a two-handed weapon) which can receive a parried hit. */
export function defensiveItem(actor) {
  const equipment = Array.from(actor?.items || []).filter(item => item?.system?.equipped);
  return equipment.find(item => item.type === "shield")
    ?? equipment.find(item => item.type === "weapon" && item.system?.hand === "offHand")
    ?? equipment.find(item => item.type === "weapon" && weaponUsesTwoHands(item))
    ?? null;
}

/** Snapshot the roller's currently targeted actors for inclusion in a damage card. */
export function prepareDamageTargets(targets) {
  const seen = new Set();
  return Array.from(targets || []).flatMap(token => {
    const actor = token?.actor;
    if (!actor?.uuid || seen.has(actor.uuid)) return [];
    seen.add(actor.uuid);
    const defense = defensiveItem(actor);
    const document = token.document ?? token;
    return [{
      actorUuid: actor.uuid,
      tokenUuid: document.uuid || "",
      name: token.name || actor.name,
      img: document.texture?.src || actor.img,
      defenseItemUuid: defense?.uuid || "",
      defenseItemName: defense?.name || ""
    }];
  });
}

/**
 * Resolve physical damage through every worn armor item, then the target's
 * remaining protection (natural armor and effects). Each armor item loses the
 * excess that passes through its current VP; the remainder reaches Body Points.
 */
export function calculateArmoredDamage({damage, totalProtection, armor = [], outerProtection = 0, protectionFor = protection} = {}) {
  const outer=Math.min(Math.max(0,Math.trunc(number(totalProtection))),Math.max(0,Math.trunc(number(outerProtection))));
  let remaining = Math.max(0, Math.trunc(number(damage)) - outer);
  const armorProtection = armor.reduce((total, item) => total + protectionFor(item), 0);
  const armorDamage = armor.map(item => {
    const excess = Math.max(0, remaining - protectionFor(item));
    remaining = excess;
    return {item, protection: protectionFor(item), ...damageIntegrity(item, excess)};
  });
  const otherProtection = Math.max(0, Math.trunc(number(totalProtection)) - armorProtection - outer);
  return {bodyDamage: Math.max(0, remaining - otherProtection), armorDamage};
}

/** Apply damage to the target's Body Points, optionally bypassing all protection. */
export async function applyDamageToActor({actor, damage, ignoreArmor = false, announce = true, damageType = "", usage = "", magicalWeapon = false, qualification} = {}) {
  if (!actor?.isOwner) return null;
  const qualified = damageQualification({context: {magicalWeapon, qualification: {type: damageType, ...qualification}}, usage});
  ignoreArmor ||= qualified.protection === "none";
  const applicableEffects = Array.from(actor.allApplicableEffects?.() ?? actor.effects ?? []).filter(effect => !effect.disabled && !effect.isSuppressed && effect.active !== false && !effect.duration?.expired);
  const rules = [...(actor.system?.damageDefenses ?? []), ...applicableEffects.flatMap(effect =>
    (effectRules(effect).damageDefenses ?? effect.flags?.["trudvang-chronicles"]?.damageDefenses ?? []).map(rule => ({...rule, source: effect.name})))];
  const resistance = qualifyDamage(Math.trunc(number(damage)), qualified, rules.filter(rule => rule.stage === "beforeArmor"));
  const policyType = qualified.type === "other" && damageType ? damageType : qualified.type;
  const amount = Math.max(0, Math.ceil(resistance.amount * (consumablePolicy(actor).damageFactors[policyType] ?? 1)));
  const eligibleBase = item => qualified.protection === "normal" || (qualified.protection !== "grindsilver" && item.system?.magicalProtection === true) || (["magicalOrGrindsilver","grindsilver"].includes(qualified.protection) && item.system?.material === "grindsilver");
  const protectionFor = item => {
    if(qualified.protection === "grindsilver")return eligibleBase(item)?protection(item):0;
    const blessings = blessedArmorEffects(item);
    const normalBlessing = blessings.reduce((sum,row) => sum + row.normal,0);
    const applicableBlessing = blessings.reduce((sum,row) => sum + (qualified.nature === "magical" || qualified.protection !== "normal" ? row.magic ?? 0 : row.normal),0);
    return Math.max(0,(eligibleBase(item) ? protection(item)-normalBlessing : 0)+applicableBlessing);
  };
  const wornArmor = Array.from(actor.equippedItems ?? actor.items ?? []).filter(item => item.type === "armor" && item.system?.equipped);
  const armor = wornArmor.filter(item => eligibleBase(item) || protectionFor(item)>0);
  const protectionRows=ignoreArmor||qualified.protection==="grindsilver"?[]:conditionalProtectionRows(actor,{usage,magicalWeapon,qualification:qualified});
  const conditionalProtection=protectionRows.reduce((sum,row)=>sum+row.amount,0);
  const specialProtection = qualified.protection !== "normal";
  const eligibleOtherProtection = qualified.protection==="grindsilver" ? 0 : specialProtection ? applicableEffects.reduce((total,effect) => total + Math.max(0,number(effectRules(effect).magicalProtection ?? effect.flags?.["trudvang-chronicles"]?.magicalProtection)),0) : 0;
  const totalProtection = specialProtection ? armor.reduce((sum,item) => sum + protectionFor(item),0) + conditionalProtection + eligibleOtherProtection
    : number(actor.system?.protection)+conditionalProtection+wornArmor.reduce((sum,item)=>sum+protectionFor(item)-protection(item),0);
  const result = ignoreArmor
    ? {bodyDamage: amount, armorDamage: []}
    : calculateArmoredDamage({damage: amount, totalProtection, armor, protectionFor,
      outerProtection:conditionalProtection+(specialProtection ? 0 : activeTransformations(actor).reduce((sum,effect)=>sum+Math.max(0,number(effectRules(effect).outerProtection)),0))});
  result.conditionalProtection=conditionalProtection;
  result.qualification=qualified;
  result.resistances=resistance.applied;
  const armorUpdates = result.armorDamage
    .filter(entry => entry.integrityLoss > 0)
    .map(entry => ({_id: entry.item.id, "system.breach.value": intrinsicIntegrityValue(entry.item,entry.integrity)}));
  if (armorUpdates.length) await actor.updateEmbeddedDocuments("Item", armorUpdates);
  const bodyResistance = qualifyDamage(result.bodyDamage, qualified, rules.filter(rule => rule.stage !== "beforeArmor"));
  result.resistances.push(...bodyResistance.applied);
  result.bodyDamage = Math.ceil(bodyResistance.amount * (actor.transformationProfile?.damageTakenFactor ?? 1));
  for (const effect of ignoreArmor ? [] : activeTransformations(actor)) {
    const meta = effect.flags?.[TRANSFORMATION_SCOPE]?.transformation;
    const integrity = remainingStoneIntegrity(effect);
    const loss = Math.min(integrity, result.bodyDamage);
    if (loss) {
      const editable=hasProfileChanges(effect)||meta?.editableChanges;
      await effect.update({[`flags.${TRANSFORMATION_SCOPE}.transformation.${editable?"stoneIntegritySpent":"stoneIntegrity"}`]: editable?Number(meta?.stoneIntegritySpent??0)+loss:integrity-loss});
      result.bodyDamage -= loss;
    }
  }
  const reserve=temporaryHealthState(actor);
  result.temporaryDamage=Math.min(reserve.current,result.bodyDamage);
  if(result.temporaryDamage)await actor.update(temporaryHealthUpdate(actor,reserve.current-result.temporaryDamage));
  result.bodyDamage-=result.temporaryDamage;
  if(result.temporaryDamage&&reserve.current===result.temporaryDamage)for(const effect of activeTransformations(actor))if(effectRules(effect).endAtEmptyHP)await effect.delete();
  const body = number(actor.system?.resources?.body?.current ?? actor.system?.resources?.body?.value ?? actor._source?.system?.resources?.body?.value);
  if (result.bodyDamage) await actor.update(bodyHealthUpdate(actor,body-result.bodyDamage));
  if(result.bodyDamage+result.temporaryDamage>0){
    const ending=activeTransformations(actor).filter(effect=>TRANSFORMATION_TEMPLATES[effect.flags?.[TRANSFORMATION_SCOPE]?.transformation?.key]?.breakOnDamage===true);
    for(const effect of ending)await effect.delete();
  }
  if (announce) await postActorEvent({actor, kind: "damage", amount: result.bodyDamage});
  return result;
}

/** Apply a parried hit to a shield-hand or two-handed weapon, never to its bearer. */
export async function applyDamageToDefenseItem({item, damage} = {}) {
  if (!item?.isOwner) return null;
  const amount = Math.max(0, Math.trunc(number(damage)));
  const result = damageIntegrity(item, Math.max(0, amount - protection(item)));
  if (result.integrityLoss) await item.update({"system.breach.value": intrinsicIntegrityValue(item,result.integrity)});
  return result;
}
