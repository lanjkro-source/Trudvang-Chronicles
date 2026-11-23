import {resolveArmorProfile} from "./equipment-resolver.mjs";
import {zonePixelScale} from "./spell-zones.mjs";

const insulatingMaterials = new Set(["cloth", "leather", "wood", "bone", "stone", "natural"]);

export function boilingWaterPlacement(profile, {availableLiters, depthCm, elevation} = {}) {
  const available = Number(availableLiters);
  const depth = Number(depthCm);
  const surface = Number(elevation);
  if (!Number.isFinite(available) || available <= 0 || !Number.isFinite(depth) || depth <= 0
      || !Number.isFinite(surface)) return null;
  const liters = Math.min(profile.maxLiters, available);
  const radius = Math.sqrt(liters / (10 * Math.PI * depth));
  if (!Number.isFinite(radius) || radius <= 0) return null;
  return {liters, depthCm: depth, radius, surface};
}

export function waterArmorRounds(actor) {
  return Array.from(actor.equippedItems ?? actor.items ?? [])
    .filter(item => item.type === "armor" && item.system?.equipped && insulatingMaterials.has(item.system.material))
    .reduce((total, item) => total + Math.max(0, Math.floor(resolveArmorProfile({item}).protection.value)), 0);
}

export function touchesBoilingWater(token, info) {
  const elevation = Number(token.elevation ?? 0);
  const surface = info.profile.surface;
  const scene = token.parent;
  const unitsPerMeter = scene ? zonePixelScale(scene) * Number(scene.grid?.distance || 1) / Number(scene.grid?.size || 1) : 1;
  return elevation <= surface && elevation >= surface - info.profile.depthCm / 100 * unitsPerMeter;
}
