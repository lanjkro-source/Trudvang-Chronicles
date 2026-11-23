import {earthquakeSizeIndex, spellZoneExpired, zonePixelScale} from "./spell-zones.mjs";

export const AIR_SHIELD = "vitner-wind-craft:air-shield:6";
export const VITNER_WALL = "vitner-vitner-craft:wall-of-vitner:8";
const scope = "trudvang-chronicles";

export function spellBarrierProfile(context) {
  const id = context?.sourceId;
  const count = index => Math.max(0, Math.trunc(Number(context.countsById?.[`${id}:${index}`] ?? context.counts?.[index]) || 0));
  if (id === AIR_SHIELD) {
    const size = [.5, 1, 1.5, 3, 5, 10][Math.min(5, count(5))];
    return {kind: "airShield", size, protection: Math.min(30, 1 + count(3)), range: count(4) ? 5 * count(4) : 1,
      rounds: 5 + count(0) + 12 * count(1) + 720 * count(2)};
  }
  if (id === VITNER_WALL) {
    return {kind: "vitnerWall", radius: (2 + count(5) + 5 * count(6)) / 2, range: 10 + 5 * count(4),
      rounds: 5 + count(1) + 12 * count(2) + 720 * count(3), bonus: count(0), persistent: count(7) > 0};
  }
  return null;
}

export const airShieldTest = (profile, size) => [4, 6, 10, 14, 18, 22, 26][earthquakeSizeIndex(size)] - profile.protection;
export const vitnerWallTest = (profile, level) => 14 - 2 * Number(level) + profile.bonus;

export function tokenBarrierCenter(token, point) {
  if (token.getCenterPoint) return token.getCenterPoint(point);
  return {
    x: Number(point?.x ?? token.x) + Number(point?.width ?? token.width ?? 1) * token.parent.grid.size / 2,
    y: Number(point?.y ?? token.y) + Number(point?.height ?? token.height ?? 1) * token.parent.grid.size / 2
  };
}

export function crossesBarrier(region, from, to) {
  const profile = region.flags[scope].spellZone.profile;
  const shape = Array.from(region.shapes)[0];
  if (![from?.x, from?.y, to?.x, to?.y, shape?.x, shape?.y].every(Number.isFinite)) return false;
  if (profile.kind === "airShield") {
    const radians = (Number(shape.rotation) || 0) * Math.PI / 180;
    const cos = Math.cos(radians), sin = Math.sin(radians);
    const local = point => {
      const x = point.x - shape.x, y = point.y - shape.y;
      return {along: x * cos + y * sin, side: y * cos - x * sin};
    };
    const a = local(from), b = local(to);
    if ((a.side >= 0) === (b.side >= 0)) return false;
    const along = a.along + (b.along - a.along) * a.side / (a.side - b.side);
    return Math.abs(along) <= shape.width / 2;
  }
  const dx = to.x - from.x, dy = to.y - from.y, length = dx * dx + dy * dy;
  if (!length) return false;
  const x = from.x - shape.x, y = from.y - shape.y, radius = shape.radius;
  const inside = point => Math.hypot(point.x - shape.x, point.y - shape.y) < radius;
  if (inside(from) && inside(to)) return false;
  const closest = Math.min(1, Math.max(0, -(x * dx + y * dy) / length));
  return Math.hypot(x + dx * closest, y + dy * closest) < radius;
}

export function activeBarriers(scene, kind, {combat, time, level} = {}) {
  return Array.from(scene?.regions?.values?.() ?? scene?.regions ?? []).filter(region => {
    const state = region.flags?.[scope]?.spellZone;
    if (state?.profile.kind !== kind) return false;
    const regionCombat = globalThis.game?.combats?.get?.(state.combatId) ?? combat;
    return !spellZoneExpired(state, {combat:regionCombat,time})
      && (!region.levels?.size && !region.levels?.length || Array.from(region.levels).includes(level))
      && (!region.behaviors || Array.from(region.behaviors.values()).some(row => row.type === "trudvangSpellZone" && !row.disabled));
  });
}

export function airShieldShape(profile, point, scene, rotation = 0) {
  const scale = zonePixelScale(scene);
  return {type:"rectangle", x:point.x, y:point.y, width:profile.size * scale, height:.12 * scale,
    anchorX:.5, anchorY:.5, rotation};
}
