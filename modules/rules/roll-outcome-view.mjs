/** Presentation only: keep signed failure margins separate from the successful
 * margin used by healing, hunting and other rule procedures. */
export function rollOutcomeView({result,target,success}){
 const automatic=Number(result)===1||Number(result)===20;
 const difference=Number(target)-Number(result);
 return {automatic,outcomeLabelKey:automatic?(success?'TRUDVANG.Roll.AutomaticSuccess':'TRUDVANG.Roll.AutomaticFailure'):(success?'TRUDVANG.Roll.Success':'TRUDVANG.Roll.Failure'),
  outcomeMargin:automatic||!Number.isFinite(difference)?'':`${difference>=0?'+':''}${difference}`};
}
export function rollOutcomeText(result,localize){
 const view=rollOutcomeView(result),label=localize(view.outcomeLabelKey);
 return label+(view.outcomeMargin?` (${view.outcomeMargin})`:'');
}
