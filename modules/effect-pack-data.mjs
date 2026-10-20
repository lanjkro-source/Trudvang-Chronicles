import {TRANSFORMATION_TEMPLATES} from "./transformation-data.mjs";
import {deterministicId} from "./skill-pack-data.mjs";

export const EFFECT_PACKS=[{code:"fr",packName:"effects-fr",label:"Effets (fr)"},{code:"en",packName:"effects-en",label:"Effects (en)"}];
/** An Item reference owns the actual embedded ActiveEffect: effects are not top-level documents. */
export function buildEffectPackDocuments({localize}){
 return {folders:[],items:Object.entries(TRANSFORMATION_TEMPLATES).map(([key,t])=>{
  const id=deterministicId(`effect-reference:${key}`);
  const text=field=>localize(`TRUDVANG.Content.Transformation.${key}.${field}`);
  const name=text("Name"),description=text("Description");
  return {_id:id,_key:`!items!${id}`,name,type:"effect",img:t.icon,folder:null,
   system:{catalogId:key,description,summary:text("SourceName"),source:{book:text("SourceBook"),page:Number(text("SourcePage"))}},
   effects:[{_id:deterministicId(`effect-template:${key}`),_key:`!items.effects!${id}.${deterministicId(`effect-template:${key}`)}`,name,type:"effect",img:t.icon,description,transfer:false,
    system:{stackId:key,stacking:"replace",changes:structuredClone(t.changes)},statuses:t.statuses,
    flags:{"trudvang-chronicles":{transformation:{key,sourceId:t.sourceId,rules:structuredClone(t.rules),related:t.related}}}}]};
 })};
}
