const sparkId = 'vitner-flame-craft:spark:1';
export const fireTamerId = 'holy-toikalokke-master-of-elements:fire-tamer:4';
const solarTablets = new Set(['holy-gerbanis-warmth-of-sunvei', 'holy-joaringfaith-power-of-sille']);
export function fixedLightProfile(context = {}){
 const sourceId = context?.sourceId ?? '';
 const [tablet, power] = sourceId.split(':');
 const count = index => Math.max(0, Math.trunc(Number(context.countsById?.[sourceId + ':' + index] ?? context.counts?.[index]) || 0));
 if(sourceId === sparkId && count(4) > 0){
  const torch = count(3) > 0;
  return {kind:'fixedLight', attachable:true, radius:torch?6:3, range:1, rounds:12+12*count(0)+720*count(1)+17280*count(2),
   illumination:{bright:torch?3:1, dim:torch?6:3, flame:true}};
 }
 if(sourceId === fireTamerId){
  return {kind:'fixedLight',radius:6,range:10+10*count(3),rounds:1+3*count(0)+10*count(1),
   illumination:{bright:3,dim:6,flame:true}};
 }
 if(!solarTablets.has(tablet) || !['sunray','summer-place','time-of-the-hunt'].includes(power)) return null;
 const faith = Math.max(0, Number(context.lightFaith) || 0);
 const hunt = power === 'time-of-the-hunt';
 const radius = hunt ? 10000*(1+count(1)) : faith*(power==='sunray'?1:100);
 if(!radius) return null;
 const rounds = hunt ? 17280*(1+count(0)) : 720*((power==='sunray'?1:3)+count(0));
 return {kind:'fixedLight', radius, range:0, rounds, centered:true, requiresDaylight:true,
  illumination:{bright:radius, dim:radius}};
}

export function earthquakeProfile(definition,context={}){
 if(!definition)return null;
 const count=id=>Math.max(0,Math.trunc(Number(context.countsById?.[id]??context.counts?.[Number(id?.split(':').at(-1))])||0));
 if(definition.kind==='boilingWater')return {
  kind:'boilingWater', range:5*count(definition.rangeOptionId)||1,
  rounds:60+12*count(definition.durationOptionId),
  maxLiters:5+definition.volumeOptions.reduce((total,row)=>total+row.liters*count(row.id),0)
 };
 if(definition.kind==='earthWall')return {
  kind:'earthWall',range:2,volume:1+count(definition.volumeOptionId),hitPoints:30,
  rounds:360+360*count(definition.durationOptionId)+2160*count(definition.hoursOptionId)
 };
 if(definition.kind==='quagmire')return {
  kind:'quagmire',radius:(3+count(definition.radiusOptionId))/2,depth:1+count(definition.depthOptionId),
  range:10+5*count(definition.rangeOptionId),rounds:12+12*count(definition.durationOptionId)+720*count(definition.hoursOptionId)
 };
 if(definition.kind==='darkness')return {
  kind:'darkness',area:definition.area+definition.areaStep*count(definition.areaOptionId),
  range:definition.range+definition.rangeStep*count(definition.rangeOptionId),
  rounds:3+definition.duration.reduce((rounds,option)=>rounds+option.rounds*count(option.id),0),
  penalty:definition.penalty,nightPenalty:definition.nightPenalty,movable:false
 };
 if(definition.kind==='fog'){
  const thick=count(definition.thicknessOptionId)>0;
  return {kind:'fog',radius:2+2*count(definition.radiusOptionId),range:100+100*count(definition.rangeOptionId),
   rounds:60+60*count(definition.durationOptionId),penalty:thick?-4:-2,rangeDivisor:thick?4:2,movable:true};
 }
 if(definition.kind==='fire'){const extra=count(definition.durationOptionId);return {kind:'fire',radius:definition.radius+definition.radiusStep*count(definition.radiusOptionId),range:definition.range+5*count(definition.rangeOptionId),rounds:1+extra,instant:extra===0,movable:definition.movable&&extra>0,penalty:definition.visibilityPenalty,excludeCaster:false,centered:false};}
 if(definition.kind==='runeEarthquake'){
  const level=Number(context.runeLevel);if(!Number.isInteger(level)||level<1||level>5)return null;
  return {kind:definition.kind,radius:definition.radiusPerLevel*level,range:definition.rangePerAdditionalLevel*(level-1),rounds:1,level,sizeSV:definition.sizeSV,levelModifier:definition.levelModifier,stunRounds:definition.stunRounds,excludeCaster:true,centered:level===1};
 }
 const severity=Math.min(definition.maxSeverity,count(definition.severityOptionId));
 return {kind:definition.kind,radius:definition.radius+count(definition.radiusOptionId)+(definition.centered?5*count(definition.rangeOptionId):0),range:definition.centered?0:definition.range+5*count(definition.rangeOptionId),rounds:1+count(definition.durationOptionId),severity,sizeModifiers:definition.sizeModifiers,severityModifier:definition.severityModifier,penalty:definition.penalty,collapseChance:20+10*severity,damage:1+severity,centered:definition.centered,excludeCaster:definition.excludeCaster};
}
export function earthquakeSizeIndex(size){const n=Number(size)||1;return n<1/3?0:n<.5?1:n<1.5?2:n<3?3:n<5?4:n<10?5:6;}
export function earthquakeTest(profile,size){const i=earthquakeSizeIndex(size);return profile.kind==='runeEarthquake'?(profile.sizeSV[i]===null?{immune:true}:{sv:profile.sizeSV[i]+profile.levelModifier*profile.level}):{modifier:profile.sizeModifiers[i]+profile.severityModifier*profile.severity};}
export function spellZoneExpired(info,{time=0,combat}={}){if(info.profile?.instant)return false;return Number(time)>=info.until||(info.combatId&&combat?.id===info.combatId&&Number(combat.round)>=info.expiresRound);}
export function spellZonePhase(info,{time=0,combat}={}){
 if(info.profile?.instant)return 'instant';
 const round=info.combatId&&combat?.id===info.combatId?Number(combat.round):null;
 const elapsed=Math.floor((Number(time)-info.createdAt)/5);
 if(info.profile?.kind==='boilingWater')return 'contact:'+Math.max(0,elapsed,round===null?0:round-info.createdRound);
 return round===null?'time:'+elapsed:'round:'+round;
}
export function fogRadius(info,{time=0,combat}={}){
 const elapsed=Math.max(0,Math.floor((time-info.createdAt)/5),combat&&combat.id===info.combatId?combat.round-info.createdRound:0);
 return info.profile.radius*Math.min(1,(elapsed+1)/3);
}
export function zonePixelScale(scene){const unit=String(scene?.grid?.units??'m').toLowerCase();const conversion=/^(ft|feet|foot|pi|pieds?)$/.test(unit)?1/.3048:/^(km|kilom)/.test(unit)?.001:1;return Number(scene?.grid?.size||1)/Number(scene?.grid?.distance||1)*conversion;}

export function spellZoneRange({origin, range, scale}, point) {
 const x = point?.x, y = point?.y;
 if (![origin?.x,origin?.y,x,y,range,scale].every(Number.isFinite) || range < 0 || scale <= 0) return null;
 const dx = x - origin.x, dy = y - origin.y;
 const pixels = Math.hypot(dx,dy);
 const limit = range * scale;
 const ratio = pixels > limit ? limit / pixels : 1;
 return {
  end:{x:origin.x+dx*ratio,y:origin.y+dy*ratio},
  distance:pixels/scale,
  inRange:pixels<=limit+.01
 };
}
