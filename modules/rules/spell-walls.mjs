function rotationVector(degrees) {
  const radians = degrees * Math.PI / 180;
  return {x:Math.cos(radians),y:Math.sin(radians)};
}

/** Divide the footprint along its length into blocks of at most one cubic metre. */
export function spellWallSections(shape, {scale, height, volume, hitPoints}) {
  const {x,y,width,depth,rotation} = {
    x:shape?.x,y:shape?.y,width:shape?.width,depth:shape?.height,rotation:shape?.rotation ?? 0
  };
  if (shape?.type !== "rectangle" || ![x,y,width,depth,rotation,height,scale].every(Number.isFinite)
      || Math.min(width,depth,height,scale) <= 0) return null;
  const used = width * depth * height / scale ** 2;
  if (used > volume + .00001 || used <= 0) return null;
  const direction = rotationVector(rotation);
  const point = distance => [x+direction.x*distance,y+direction.y*distance];
  const offset = -.5 * width;
  const count = Math.max(1,Math.ceil(used - .00001));
  return Array.from({length:count},(_,index) => {
    const block = Math.min(1,used-index);
    const start = offset+width*index/used;
    const end = offset+width*(index+block)/used;
    const [cx,cy] = point((start+end)/2);
    const max = Math.max(1,Math.ceil(hitPoints*block-.00001));
    return {index,max,hp:max,line:[...point(start),...point(end)],
      shape:{type:"rectangle",x:cx,y:cy,width:end-start,height:depth,rotation,anchorX:.5,anchorY:.5}};
  });
}
