import {POWER_DETAILS_BY_ID} from "./power-catalog-data.mjs";

/** Return table-facing instructions. The GM determines what is actually revealed. */
export function magicRevelation(context, i18n=globalThis.game?.i18n) {
  const profile=POWER_DETAILS_BY_ID[context?.sourceId]?.revelation;
  if (!profile||!i18n) return "";
  const count=id=>Math.max(0,Number(context.countsById?.[id])||0);
  const sum=(steps,base=0)=>Object.entries(steps??{}).reduce((total,[id,step])=>total+count(id)*step,base);
  const unit=(value,unit)=>new Intl.NumberFormat(i18n.lang,{style:"unit",unit,unitDisplay:"long"}).format(value);
  const t=(key,data)=>i18n.format("TRUDVANG.Revelation."+key,data);
  const metres=sum(profile.rangeSteps,profile.range);
  const range=metres?unit(metres,"meter"):i18n.localize("TRUDVANG.Revelation.Contact");
  switch (profile.kind) {
    case "attitude":
      return t("Attitude",{range});
    case "vision":
      return t(profile.unit==="week"?"ImportantVision":"UnusualVision",{
        range,horizon:unit(1+count(profile.horizonOptionId),profile.unit)
      });
    case "trace": {
      let hours=sum(profile.traceSteps,1);
      const duration=[];
      for(const [divisor,label] of [[168,"week"],[24,"day"],[1,"hour"]]){
        const n=Math.floor(hours/divisor);
        hours%=divisor;
        if(n)duration.push(unit(n,label));
      }
      const age=new Intl.ListFormat(i18n.lang,{style:"long",type:"conjunction"}).format(duration);
      return t("Trace",{range,age});
    }
    default:
      return t(profile.kind==="readPower"?"ReadPower":"ReadVitner",{range});
  }
}
