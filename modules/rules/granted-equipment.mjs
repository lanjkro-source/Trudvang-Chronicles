const S='trudvang-chronicles';
export function grantActors(actor){
 const actors=new Map(Array.from(game.actors??[],entry=>[entry.uuid,entry]));
 if(actor)actors.set(actor.uuid,actor);
 for(const scene of game.scenes??[])for(const token of scene.tokens??[])if(token.actor)actors.set(token.actor.uuid,token.actor);
 return [...actors.values()];
}
/** The UUID survives inventory transfers and disambiguates synthetic actors. */
export function equipmentGrantItems(effect,actor=effect.parent){
 if(!effect.uuid)return [];
 return [...grantActors(actor).flatMap(a=>Array.from(a.items??[])),...Array.from(game.items??[])].filter(item=>item.flags?.[S]?.equipmentGrantUuid===effect.uuid);
}
export function equipmentGrantActive(item,actor=item?.actor??item?.parent){
 const uuid=item?.flags?.[S]?.equipmentGrantUuid;if(!uuid)return true;
 const source=grantActors(actor).flatMap(a=>Array.from(a.effects??[])).find(e=>e.uuid===uuid);
 return Boolean(source&&!source.disabled&&!source.isSuppressed&&!source.duration?.expired);
}
export function grantedEquipmentData(row,effect,{equipped=false}={}){
 const name=game.i18n.localize(row.name),description=game.i18n.localize(row.description);
 const key=effect.flags?.[S]?.transformation?.key;
 const source=key?[game.i18n.localize('TRUDVANG.Content.Transformation.'+key+'.SourceBook'),game.i18n.localize('TRUDVANG.Content.Transformation.'+key+'.SourcePage')].join(', '):'';
 const change=(key,value)=>({key,type:'add',value:String(value),phase:'initial',priority:effect.system?.changes?.[0]?.priority??0});
 return {name,type:'weapon',img:row.img??'icons/svg/sword.svg',system:{...structuredClone(row.system),description,source,quantity:1,equipped,weaponActionsSpent:0,combatPointBonusUsed:false},flags:{[S]:{transformationGrant:effect.id,equipmentGrantUuid:effect.uuid}},effects:[
  {name,type:'effect',img:effect.img,description,transfer:false,system:{changes:[change('system.transformation.objectUse',row.useBonus),...(row.outnumberedParry?[change('system.transformation.objectParryOutnumbered',row.outnumberedParry)]:[])]}},
  {name,type:'effect',img:effect.img,description,transfer:true,system:{changes:[change('system.modifiers.protection',row.armorBonus)]}}
 ]};
}
