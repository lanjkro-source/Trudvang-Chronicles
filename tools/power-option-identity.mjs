/** Stable IDs are source data. Until all mechanical references use IDs, reject
 * reordered options instead of silently redirecting index-based effect rules. */
export function validatePowerOptionIdentities(id, french, english) {
 const seen=new Set();
 for(let index=0;index<french.length;index++){
  const fr=french[index],en=english[index];
  if(typeof fr.optionId!=="string"||!fr.optionId.startsWith(`${id}:`)||seen.has(fr.optionId))throw new Error(`${id}: missing or duplicate option id at ${index}`);
  if(fr.optionId!==en?.optionId||fr.referenceIndex!==en?.referenceIndex)throw new Error(`${id}: option identities differ between languages at ${index}`);
  if(!Number.isInteger(fr.referenceIndex)||fr.referenceIndex!==index)throw new Error(`${id}: options were reordered; index-based effect and resistance references must be updated before generation`);
  seen.add(fr.optionId);
 }
}

export function resolvePowerOptionReference(entry, reference) {
 const index=entry.powerLevels?.findIndex(option=>option.optionId===reference.optionId) ?? -1;
 if(index<0)throw new Error(`${entry.catalogId}: unknown power option ${reference.optionId ?? ""}`);
 return {...reference,index};
}
