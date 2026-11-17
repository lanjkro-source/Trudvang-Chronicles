import {runeConsequenceDefinition,runeConsequenceAmount} from './rules/rune-consequences.mjs';
import {normalizeEffectDuration} from './rules/effect-duration.mjs';
const S='trudvang-chronicles';
export function runeConsequenceText(details,context){
 const definition=runeConsequenceDefinition(details);if(!definition)return '';
 return game.i18n.format(`TRUDVANG.Content.Transformation.${context.sourceId}#effect.Description`,{
  level:context.runeLevel,amount:runeConsequenceAmount(definition,context.runeLevel),minutes:(definition.secondsPerLevel??0)*context.runeLevel/60});
}
/** A source is attached to the actual inscribed object, not a travelling aura
 * on the caster. Contact with its water is selected explicitly by the caller. */
export async function createRuneConsequenceSource(details,context){
 const definition=runeConsequenceDefinition(details);if(!definition?.source)return null;
 const item=await foundry.utils.fromUuid(context.runeObjectUuid);
 if(!item?.canUserModify?.(game.user,'update'))throw Error(game.i18n.localize('TRUDVANG.Transformation.Permission'));
 const summary=runeConsequenceText(details,context),key=context.sourceId+'#effect';
 const [effect]=await item.createEmbeddedDocuments('ActiveEffect',[{
  name:game.i18n.localize(`TRUDVANG.Content.Transformation.${key}.Name`),type:'effect',img:'icons/svg/regen.svg',transfer:false,
  description:summary,start:foundry.documents.ActiveEffect.implementation.getEffectStart(),duration:normalizeEffectDuration({value:definition.secondsPerLevel*context.runeLevel,units:'seconds'}),
  system:{stackId:`rune-source:${context.castingId}`,stacking:'replace',changes:[]},
  flags:{[S]:{runeConsequenceSource:{castingId:context.castingId,objectUuid:item.uuid},transformation:{key,sourceId:context.sourceId,resolved:true,summary,summaryResolved:true,appliedAt:Number(game.time.worldTime)||0}}}
 }]);
 if(!effect?.uuid)throw Error('Failed to create activated rune source');
 return effect;
}
