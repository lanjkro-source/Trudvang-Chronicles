const jobs=new WeakMap();
/** Coordinate lifecycle owners that can retire the same effect during one tick. */
export function deleteEffectOnce(effect,options={}){
 if(jobs.has(effect))return jobs.get(effect);
 const collection=effect?.parent?.effects;
 if(effect?.id&&collection&&(typeof collection.get==='function'?collection.get(effect.id)!==effect:!Array.from(collection).includes(effect)))return Promise.resolve(false);
 const job=Promise.resolve().then(()=>effect.delete(options)).finally(()=>jobs.delete(effect));jobs.set(effect,job);return job;
}
