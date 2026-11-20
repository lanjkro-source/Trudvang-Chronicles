export function spellWallBlockPoint(wall, point, scale, grid) {
  if (!wall?.origin) {
    if (!grid?.isSquare) return {x:point.x,y:point.y};
    const corner=grid.getTopLeftPoint({x:0,y:0});
    const center=(value,edge)=>edge+(Math.floor((value-edge)/scale)+.5)*scale;
    return {x:center(point.x,corner.x),y:center(point.y,corner.y)};
  }
  const col = Math.round((point.x-wall.origin.x)/scale);
  const row = Math.round((point.y-wall.origin.y)/scale);
  return {x:wall.origin.x+col*scale,y:wall.origin.y+row*scale};
}

export function addSpellWallBlock(wall, point, scale, profile, grid) {
  if ((wall?.sections.length ?? 0) >= profile.volume) return null;
  const {x,y}=spellWallBlockPoint(wall,point,scale,grid);
  const shape={type:"rectangle",x,y,width:scale,height:scale,anchorX:.5,anchorY:.5};
  const index=wall?.sections.length ?? 0, max=profile.hitPoints;
  return {origin:wall?.origin ?? {x,y},sections:[...(wall?.sections ?? []),{index,max,hp:max,shape}]};
}

export function spellWallColumns(wall) {
  const columns=new Map();
  for (const block of wall.sections) {
    if (block.hp<=0) continue;
    const {x,y}=block.shape,key=`${x},${y}`;
    if (!columns.has(key)) columns.set(key,{key,shape:block.shape,blocks:[]});
    columns.get(key).blocks.push(block);
  }
  return [...columns.values()];
}

export function spellWallEdges(wall) {
  // TEMPORARY WORLD MIGRATION — retain the blocking edges of rectangular walls already placed.
  if (!wall.origin) return wall.sections.filter(block=>block.hp>0).map(block=>({index:block.index,line:block.line,blocksMove:true,blocksSight:true}));
  const edges=new Map();
  for (const {shape:{x,y,width},blocks} of spellWallColumns(wall)) {
    const half=width/2;
    const corners=[[x-half,y-half],[x+half,y-half],[x+half,y+half],[x-half,y+half]];
    for (let i=0;i<corners.length;i++) {
      const [a,b]=[corners[i],corners[(i+1)%corners.length]];
      const index=[a,b].map(point=>point.map(n=>n.toFixed(5)).join(",")).sort().join(":");
      const adjacent=edges.get(index),tall=blocks.length>1;
      if (!adjacent) edges.set(index,{index,line:[...a,...b],blocksMove:true,blocksSight:tall});
      else if (adjacent.blocksSight===tall) edges.delete(index);
      else edges.set(index,{...adjacent,blocksMove:false,blocksSight:true});
    }
  }
  return [...edges.values()];
}
