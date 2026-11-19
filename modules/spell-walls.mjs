const S = "trudvang-chronicles";
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);
const marker = wall => wall.flags?.[S]?.spellWall;

export function spellWallInfo(region) {
  return region?.flags?.[S]?.spellZone?.wall;
}

/** A native edge models the solid wall. Each edge belongs to one damageable section. */
export async function syncSpellWall(region, {removed=false} = {}) {
  const info = spellWallInfo(region);
  if (!info) return;
  const scene = region.parent;
  const walls = values(scene.walls).filter(wall => marker(wall)?.regionUuid === region.uuid);
  const living = removed ? [] : info.sections.filter(section => section.hp > 0);
  const desired = new Map(living.map(section => [section.index,section]));
  const obsolete = walls.filter(wall => !desired.delete(marker(wall).index));
  if (obsolete.length) await scene.deleteEmbeddedDocuments("Wall",obsolete.map(wall => wall.id));
  if (!desired.size) return;
  const sense = CONST.EDGE_SENSE_TYPES.NORMAL;
  await scene.createEmbeddedDocuments("Wall",Array.from(desired.values(),section => ({
    c:section.line,levels:values(region.levels),move:CONST.WALL_MOVEMENT_TYPES.NORMAL,sight:sense,
    sound:sense,light:sense,flags:{[S]:{spellWall:{regionUuid:region.uuid,index:section.index}}}
  })));
}

export async function cleanupOrphanSpellWalls(scene) {
  const present = new Set(values(scene.regions).filter(spellWallInfo).map(region => region.uuid));
  const orphaned = values(scene.walls).filter(wall => marker(wall) && !present.has(marker(wall).regionUuid));
  if (orphaned.length) await scene.deleteEmbeddedDocuments("Wall",orphaned.map(wall => wall.id));
}
