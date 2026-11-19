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
  return Array.from(actor.effects ?? []).flatMap(effect => {
    const ward = effect.flags?.[scope]?.auraRecipient?.weather;
    return ward && !effect.disabled && !effect.isSuppressed && !effect.duration?.expired
      ? [{...ward,name:effect.name}] : [];
  });
}

export function ignoresSpellFog(actor) {
  return actor && activeWeatherWards(actor).some(ward => ["journey","storm"].includes(ward.kind));
}

export function weatherBlocks(ward, row, magical) {
  if (row.value >= 0 || !["precipitation","wind","temperature"].includes(row.field)) return false;
  if (ward.kind === "storm") {
    return magical || row.field === "precipitation" && [...rain,...snow].includes(row.choice);
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
