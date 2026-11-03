/** Portable snapshots keep manually authored tablets independent of their source items. */
export function customTabletPower(document,id,tabletType) {
 const data=document.toObject();delete data._id;delete data.folder;delete data.ownership;delete data._stats;
 const targetType=tabletType==="holy"?"divineFeat":"spell";
 if(data.type!==targetType){data.type=targetType;data.system={...data.system,isRune:false,active:false,activeCost:0,activeCastCosts:[]};}
 return {id,sourceUuid:document.uuid??"",level:Math.min(5,Math.max(1,Number(data.system?.level)||1)),data};
}
export function customTabletChild(entry,tabletId,tabletName) {
 const data=structuredClone(entry.data);delete data._id;delete data.folder;delete data.ownership;delete data._stats;
 data.system={...data.system,level:entry.level,tabletId,tablet:tabletName};
 if(data.type==="spell")Object.assign(data.system,{active:false,activeCost:0,activeCastCosts:[]});
 data.flags={...data.flags,"trudvang-chronicles":{...data.flags?.["trudvang-chronicles"],customTabletPower:entry.id}};
 return data;
}
