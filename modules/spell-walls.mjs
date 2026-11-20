import {spellWallColumns,spellWallEdges} from "./rules/spell-walls.mjs";

const S = "trudvang-chronicles";
const values = collection => Array.from(collection?.values?.() ?? collection ?? []);
const marker = wall => wall.flags?.[S]?.spellWall;
const texture = "systems/trudvang-chronicles/assets/art/earth-block.webp";

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
  const senses = ({blocksMove,blocksSight}) => ({
    move:blocksMove?CONST.WALL_MOVEMENT_TYPES.NORMAL:CONST.WALL_MOVEMENT_TYPES.NONE,
    sight:blocksSight?CONST.EDGE_SENSE_TYPES.NORMAL:CONST.EDGE_SENSE_TYPES.NONE,
    light:blocksSight?CONST.EDGE_SENSE_TYPES.NORMAL:CONST.EDGE_SENSE_TYPES.NONE,
    sound:blocksMove?CONST.EDGE_SENSE_TYPES.NORMAL:CONST.EDGE_SENSE_TYPES.NONE
  });
  const obsolete=[],updates=[];
  for(const wall of walls){
    const key=marker(wall).index,edge=desired.get(key);
    if(!edge){obsolete.push(wall.id);continue;}
    desired.delete(key);
    const properties=senses(edge);
    if(Object.keys(properties).some(key=>wall[key]!==properties[key]))updates.push({_id:wall.id,...properties});
  }
  if (obsolete.length) await scene.deleteEmbeddedDocuments("Wall",obsolete);
  if (updates.length) await scene.updateEmbeddedDocuments("Wall",updates);
  if (desired.size) await scene.createEmbeddedDocuments("Wall",Array.from(desired.values(),section => ({
    c:section.line,levels:values(region.levels),...senses(section),
    flags:{[S]:{spellWall:{regionUuid:region.uuid,index:section.index}}}
  })));
  if(info.origin)await syncWallLabels(region,removed?[]:spellWallColumns(info));
}

async function syncWallLabels(region, columns) {
  const scene=region.parent;
  const labels=values(scene.drawings).filter(doc=>marker(doc)?.regionUuid===region.uuid);
  const desired=new Map(columns.map(column=>[column.key,column]));
  const obsolete=[],updates=[];
  const fill={texture,fillType:CONST.DRAWING_FILL_TYPES.PATTERN,fillAlpha:1,fillColor:"#ffffff"};
  for(const label of labels){
    const key=marker(label).column, column=desired.get(key);
    if(!column){obsolete.push(label.id);continue;}
    desired.delete(key);
    const text=`${column.blocks.length} m`;
    if(label.text!==text||label.texture!==texture)updates.push({_id:label.id,text,...fill});
  }
  if(obsolete.length)await scene.deleteEmbeddedDocuments("Drawing",obsolete);
  if(updates.length)await scene.updateEmbeddedDocuments("Drawing",updates);
  if(desired.size)await scene.createEmbeddedDocuments("Drawing",Array.from(desired.values(),({key,shape,blocks})=>({
    x:shape.x-shape.width/2,y:shape.y-shape.height/2,shape:{type:"r",width:shape.width,height:shape.height},
    levels:values(region.levels),author:game.user.id,locked:true,interface:true,
    text:`${blocks.length} m`,fontSize:Math.max(12,Math.min(24,shape.width/3)),
    textColor:"#f4ecd9",strokeWidth:0,...fill,
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
