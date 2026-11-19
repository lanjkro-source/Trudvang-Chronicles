import {sensoryProfile} from "./senses.mjs";

const S = "trudvang-chronicles";
const trueSight = new Set(["vitner-power-of-vision:true-sight:7","holy-joaringfaith-sight-of-lekaba:true-sight:7"]);

export function darknessCombatRow(actor, observer = actor) {
  if (!actor || !observer) return null;
  const effects = Array.from(actor.effects ?? []).filter(effect => effect.flags?.[S]?.spellZoneRecipient?.darkness
    && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired);
  if (!effects.length) return null;
  const senses = observer.transformationProfile?.sensory ?? (observer.system ? sensoryProfile(observer) : []);
  if (senses.some(sense => sense.enabled && ["dark","true"].includes(sense.type))
      || observer.transformationProfile?.effects?.some(effect => trueSight.has(effect.flags?.[S]?.transformation?.sourceId))) return null;
  const night = senses.some(sense => sense.enabled && sense.type === "night");
  let strongest = null;
  for (const effect of effects) {
    const darkness = effect.flags?.[S]?.spellZoneRecipient?.darkness;
    const value = Number(night ? darkness.nightPenalty : darkness.penalty);
    if (value < (strongest?.value ?? 0)) strongest = {label:effect.name,value};
  }
  return strongest;
}

export function darknessPlacementShape(shape, maximumArea, scale) {
  if (!shape || ![shape.x,shape.y,scale].every(Number.isFinite) || scale <= 0) return null;
  const {x,y} = shape;
  const maximum = maximumArea * scale ** 2 + .01;
  if (shape.type === "circle" && Number.isFinite(shape.radius) && shape.radius > 0 && Math.PI * shape.radius ** 2 <= maximum) {
    return {type:"circle",x,y,radius:shape.radius};
  }
  const {width,height,rotation=0} = shape;
  if (shape.type === "rectangle" && [width,height,rotation].every(Number.isFinite)
      && width > 0 && height > 0 && width * height <= maximum) {
    return {type:"rectangle",x,y,width,height,rotation,anchorX:.5,anchorY:.5};
  }
  return null;
}
