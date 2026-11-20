export function spellWallBlockPoint(wall, point, scale) {
  if (!wall?.origin) return {x:point.x,y:point.y};
  const col = Math.round((point.x-wall.origin.x)/scale);
  const row = Math.round((point.y-wall.origin.y)/scale);
  return {x:wall.origin.x+col*scale,y:wall.origin.y+row*scale};
}

export function addSpellWallBlock(wall, point, scale, profile) {
  if ((wall?.sections.length ?? 0) >= profile.volume) return null;
  const {x,y}=spellWallBlockPoint(wall,point,scale);
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
  if (!wall.origin) return wall.sections.filter(block=>block.hp>0).map(block=>({index:block.index,line:block.line}));
  const edges=new Map();
  for (const {shape:{x,y,width}} of spellWallColumns(wall)) {
    const half=width/2;
    const corners=[[x-half,y-half],[x+half,y-half],[x+half,y+half],[x-half,y+half]];
    for (let i=0;i<corners.length;i++) {
      const [a,b]=[corners[i],corners[(i+1)%corners.length]];
      const index=[a,b].map(point=>point.map(n=>n.toFixed(5)).join(",")).sort().join(":");
      if (edges.has(index)) edges.delete(index);
      else edges.set(index,{index,line:[...a,...b]});
    }
  }
  return [...edges.values()];
}
