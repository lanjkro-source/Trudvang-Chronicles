/** Fear protection reduces the dice factor, before Psyche and personal mitigation. */
export function reduceFearProfile(profile,degrees=0){
 const result={dice:Number(profile.dice)||0,faces:Number(profile.faces)||10,threshold:Number(profile.threshold)||0,modifier:Number(profile.modifier)||0};
 for(let n=0;n<Math.max(0,Math.trunc(degrees));n++){
  if(result.modifier>0){result.modifier--;continue;}
  if(result.threshold>0){result.threshold=result.threshold>=result.faces?0:result.threshold+1;continue;}
  if(result.faces===10){result.faces=5;continue;}
  result.dice=0;result.modifier=0;break;
 }
 return result;
}
/** Use the original dice, discarding explosions no longer permitted. D10→D5
 * maps pairs 1–2,3–4,… to 1,2,…: a uniform D5 without a second chat message,
 * reroll or risk of making a protected recipient more frightened. */
export function fearProfileTotal(context,profile){
 if(!profile.dice)return 0;
 const original=context.profile,values=context.values??[];let cursor=0,total=Number(profile.modifier||0)+Number(context.adjustment||0);
 for(let die=0;die<Number(original.dice);die++){
  const chain=[];let v;
  do{v=Number(values[cursor++]);if(!Number.isInteger(v)||v<1||v>original.faces)return null;chain.push(v);}while(original.threshold>0&&v>=original.threshold&&cursor<values.length);
  if(die>=profile.dice)continue;
  for(const raw of chain){
   const value=profile.faces===5&&original.faces===10?Math.ceil(raw/2):raw;
   total+=value;
   if(!profile.threshold||value<profile.threshold)break;
  }
 }
 return Math.max(0,total);
}
export function isLesserIntelligence(actor){
 const tags=new Set((actor?.system?.tags??[]).map(t=>String(t).toLowerCase()));
 return actor?.type!=='character'&&['bête','beast','animal'].some(t=>tags.has(t))&&!['humanoïde','humanoid','troll'].some(t=>tags.has(t));
}
export function fearRecipientEligible(actor,context={}){
 const policy=context.eligibility??{};
 if(policy.excludeCaster&&context.casterUuid===actor?.uuid)return false;
 if(policy.requiresHearing&&['deaf','deafened'].some(id=>actor?.statuses?.has(id)))return false;
 if(policy.intelligentOnly&&isLesserIntelligence(actor))return false;
 return true;
}
export function adjustedFearFactor(actor,context,{success=false}={}){
 if(!context?.profile)return null;
 if(success&&!context.resistance?.successProfile)return {amount:0,profile:{dice:0,faces:10,threshold:0,modifier:0},degrees:0};
 const base=success?context.resistance.successProfile:context.profile;
 const degrees=Math.max(0,Math.trunc(Number(actor?.transformationProfile?.fearReductionDegrees)||0));
 const profile=reduceFearProfile(base,degrees),amount=fearProfileTotal(context,profile);
 return amount===null?null:{amount,profile,degrees};
}
