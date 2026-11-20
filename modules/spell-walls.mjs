import {spellWallColumns,spellWallEdges} from "./rules/spell-walls.mjs";

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
  const desired = new Map((removed ? [] : spellWallEdges(info)).map(edge => [edge.index,edge]));
  const obsolete = walls.filter(wall => !desired.delete(marker(wall).index));
  if (obsolete.length) await scene.deleteEmbeddedDocuments("Wall",obsolete.map(wall => wall.id));
  const sense = CONST.EDGE_SENSE_TYPES.NORMAL;
  if (desired.size) await scene.createEmbeddedDocuments("Wall",Array.from(desired.values(),section => ({
    c:section.line,levels:values(region.levels),move:CONST.WALL_MOVEMENT_TYPES.NORMAL,sight:sense,
    sound:sense,light:sense,flags:{[S]:{spellWall:{regionUuid:region.uuid,index:section.index}}}
  })));
  if(info.origin)await syncWallLabels(region,removed?[]:spellWallColumns(info));
}

async function syncWallLabels(region, columns) {
  const scene=region.parent;
  const labels=values(scene.drawings).filter(doc=>marker(doc)?.regionUuid===region.uuid);
  const desired=new Map(columns.map(column=>[column.key,column]));
  const obsolete=[],updates=[];
  for(const label of labels){
    const key=marker(label).column, column=desired.get(key);
    if(!column){obsolete.push(label.id);continue;}
    desired.delete(key);
    const text=`${column.blocks.length} m`;
    if(label.text!==text)updates.push({_id:label.id,text});
  }
  if(obsolete.length)await scene.deleteEmbeddedDocuments("Drawing",obsolete);
  if(updates.length)await scene.updateEmbeddedDocuments("Drawing",updates);
  if(desired.size)await scene.createEmbeddedDocuments("Drawing",Array.from(desired.values(),({key,shape,blocks})=>({
    x:shape.x-shape.width/2,y:shape.y-shape.height/2,shape:{type:"r",width:shape.width,height:shape.height},
    levels:values(region.levels),author:game.user.id,locked:true,interface:true,
    text:`${blocks.length} m`,fontSize:Math.max(12,Math.min(24,shape.width/3)),
    textColor:"#f4ecd9",strokeWidth:0,fillType:1,fillColor:"#2d211c",fillAlpha:.65,
    flags:{[S]:{spellWall:{regionUuid:region.uuid,column:key}}}
  })));
}

export async function cleanupOrphanSpellWalls(scene) {
  const present = new Set(values(scene.regions).filter(spellWallInfo).map(region => region.uuid));
  const orphaned = values(scene.walls).filter(wall => marker(wall) && !present.has(marker(wall).regionUuid));
  if (orphaned.length) await scene.deleteEmbeddedDocuments("Wall",orphaned.map(wall => wall.id));
  const labels=values(scene.drawings).filter(draw=>marker(draw) && !present.has(marker(draw).regionUuid));
  if(labels.length)await scene.deleteEmbeddedDocuments("Drawing",labels.map(draw=>draw.id));
}
