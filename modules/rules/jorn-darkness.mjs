import {grantsTrueSight,sensoryProfile} from "./senses.mjs";

const S = "trudvang-chronicles";

export function darknessCombatRow(actor, observer = actor) {
  if (!actor || !observer) return null;
  const effects = Array.from(actor.effects ?? []).filter(effect => effect.flags?.[S]?.spellZoneRecipient?.darkness
    && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired);
  if (!effects.length) return null;
  let strongest = null;
  for (const effect of effects) {
    const value = jornDarknessPenalty(observer, effect.flags[S].spellZoneRecipient.darkness);
    if (value < (strongest?.value ?? 0)) strongest = {label:effect.name,value};
  }
  return strongest;
}

export function jornDarknessPenalty(observer, darkness) {
  const senses = observer?.transformationProfile?.sensory ?? (observer?.system ? sensoryProfile(observer) : []);
  if (senses.some(sense => sense.enabled && ["dark","true"].includes(sense.type))
      || observer?.transformationProfile?.effects?.some(effect => grantsTrueSight(effect))) return 0;
  const night = senses.some(sense => sense.enabled && sense.type === "night");
  return Number(night ? darkness.nightPenalty : darkness.penalty);
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

/** Region coordinates use pixels; the light is centered with a radius reaching
 * every corner, then Foundry clips its native darkness polygon to these points. */
export function darknessSourceGeometry(shape) {
  if (!shape || ![shape.x, shape.y].every(Number.isFinite)) return null;
  if (shape.type === "circle" && Number.isFinite(shape.radius) && shape.radius > 0) {
    return {x:shape.x, y:shape.y, radius:shape.radius};
  }
  if (shape.type !== "rectangle" || ![shape.width,shape.height,shape.rotation ?? 0].every(Number.isFinite)
      || shape.width <= 0 || shape.height <= 0) return null;
  const angle = (shape.rotation ?? 0) * Math.PI / 180;
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  const point = (x,y) => [shape.x + cosine*x - sine*y, shape.y + sine*x + cosine*y];
  const left = -Number(shape.anchorX ?? .5) * shape.width, top = -Number(shape.anchorY ?? .5) * shape.height;
  const right = left + shape.width, bottom = top + shape.height;
  const [x,y] = point((left+right)/2,(top+bottom)/2);
  return {x,y,radius:Math.hypot(shape.width,shape.height)/2,
    boundary:[...point(left,top),...point(right,top),...point(right,bottom),...point(left,bottom)]};
}
