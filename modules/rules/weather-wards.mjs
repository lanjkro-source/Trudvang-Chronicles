import {activeBarriers,tokenBarrierCenter} from "./spell-barriers.mjs";

const scope = "trudvang-chronicles";
const rain = ["rain","torrential","downpour"];
const snow = ["lightSnow","snow","heavySnow"];

export function weatherTemperatureLimits(spec, context) {
  const count = Math.max(0, Number(context?.countsById?.[spec.temperatureOptionId]) || 0);
  const max = spec.temperature + (spec.temperatureOptionId ? 10 * count : 0);
  return {min:spec.kind === "summer" ? 0 : -max,max};
}

export function weatherWard(spec, context) {
  const {min,max} = weatherTemperatureLimits(spec,context);
  const requested = Number(context?.weatherTemperature ?? max);
  return {kind:spec.kind,temperature:Math.max(min,Math.min(max,Number.isFinite(requested) ? requested : max))};
}

export function activeWeatherWards(actor) {
  const wards=Array.from(actor.effects ?? []).flatMap(effect => {
    const ward = effect.flags?.[scope]?.auraRecipient?.weather;
    return ward && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired
      ? [{...ward,name:effect.name}] : [];
  });
  const selected=Array.from(globalThis.canvas?.tokens?.controlled??[],token=>token.document??token)
    .filter(token=>token.actor?.uuid===actor.uuid);
  const tokens=actor.getActiveTokens?.(false,true)??[];
  const token=selected.length===1?selected[0]:actor.token??(tokens.length===1?tokens[0]:null);
  if(!token?.parent)return wards;
  const point=tokenBarrierCenter(token);
  const shelters=activeBarriers(token.parent,"nidVitnerResistance",{
    level:token.level,combat:globalThis.game?.combat,time:Number(globalThis.game?.time?.worldTime)||0
  }).filter(region=>{
    const shape=Array.from(region.shapes??[])[0];
    return shape&&Math.hypot(point.x-shape.x,point.y-shape.y)<=shape.radius;
  });
  for(const region of shelters)wards.push({kind:"storm",nid:true,temperature:region.flags[scope].spellZone.profile.temperature??0,name:region.name});
  return wards;
}

export function ignoresSpellFog(actor) {
  return actor && activeWeatherWards(actor).some(ward => ["journey","storm"].includes(ward.kind));
}

export function weatherBlocks(ward, row, magical) {
  if (row.value >= 0 || !["precipitation","wind","temperature"].includes(row.field)) return false;
  if (ward.kind === "storm") {
    return magical || ward.nid&&row.field==="wind" || row.field === "precipitation" && [...rain,...snow].includes(row.choice);
  }
  if (ward.kind === "refuge") return !magical && (row.field === "wind" || row.field === "precipitation" && ["rain",...snow].includes(row.choice));
  return ward.kind === "journey" && (row.field === "wind" || row.field === "precipitation" && rain.includes(row.choice));
}

export function temperatureBand(celsius) {
  if (celsius > 10) return "mild";
  if (celsius >= 0) return "cool";
  if (celsius >= -10) return "cold";
  if (celsius >= -20) return "freezing";
  if (celsius >= -40) return "intense";
  return "hrim";
}

export function wardTemperature(outer, ward) {
  const adjusted = outer + ward.temperature;
  return ward.kind === "summer" ? Math.max(outer,Math.min(30,adjusted)) : adjusted;
}
