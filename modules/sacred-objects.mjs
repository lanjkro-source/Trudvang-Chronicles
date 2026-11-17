import {weaponType} from './rules/combat-pool-resolver.mjs';
import {SACRED_TYPES,CRAFT_MATERIALS,isSacredObject,sacredState,sacredObjects,sacredBalance,sacredRuneTotals,sacredCapacity,runeDefinition,runeRow,validSacredState,publicSacredTemplates,equipmentCraftMaterial,runeObjectEligible} from './rules/sacred-objects.mjs';
import {intrinsicQualityUpdate} from './rules/item-quality.mjs';
import {knowledgeRank} from './rules/magic-resistance.mjs';
import {powerItemData,TABLET_BY_ID} from './tablet-catalog.mjs';
import {rollUnder,rollModifierFlavor} from './dice.mjs';
import {rollModifierTotal} from './rules/roll-state-resolver.mjs';
import {transformationRollRows} from './rules/transformation-profile.mjs';
import {conditionalSkillModifiers} from './rules/effect-conditional-tests.mjs';
import {conditionalModifierSection} from './conditional-modifier-ui.mjs';
import {blessingDialog} from './blessing-dialog.mjs';
import {escapeHtml,escapeAttribute} from './helpers.mjs';
const S='trudvang-chronicles',channel='system.'+S,jobs=new Map(),replies=new Map();let registered=false;
const t=key=>game.i18n.localize('TRUDVANG.Sacred.'+key),e=escapeHtml,a=escapeAttribute;
const state=item=>structuredClone(sacredState(item)?.toObject?.()??sacredState(item));
const owner=actor=>actor?.isOwner&&knowledgeRank(actor,'thuulForging')>0;
const writer=()=>Boolean(game.users?.activeGM?.isSelf);
export function sacredObjectViews(actor){return sacredObjects(actor).map(item=>({id:item.id,name:item.name,img:item.img,...sacredRuneTotals(item),runes:sacredRuneViews(item)}));}
export function sacredRuneViews(item){return Array.from(sacredState(item)?.runes??[],row=>({...runeRow(row),name:game.i18n.localize('TRUDVANG.Content.Power.'+row.sourceId+'.Name')}));}
export function sacredAffinity(actor){
 if(!knowledgeRank(actor,'thuulForging')&&!sacredObjects(actor).length)return null;
 return {hard:sacredCapacity(actor,'hardMaterials'),soft:sacredCapacity(actor,'softMaterials'),balance:sacredBalance(actor)};
}
export function craftingBreakdown(actor,material,{tools=0,modifier=0,forging=true}={}){
 const item=actor.findRuleKnowledge(material)??{name:game.i18n.localize('TRUDVANG.Knowledge.'+material),type:'ability',system:{catalogId:material,parentSkill:'care',parentDiscipline:'handicraft',kind:'specialty',level:0,rollBonus:2}};
 const breakdown=actor.getAbilityBreakdown(item),rows=[...breakdown.modifierRows];
 rows.push(...conditionalSkillModifiers(actor,'care',item,'',{automatic:true}));
 rows.push(...transformationRollRows(actor,{target:breakdown.base+rollModifierTotal(rows),skillKey:'care'}));
 if(forging)rows.push({label:game.i18n.localize('TRUDVANG.Knowledge.thuulForging'),value:2*knowledgeRank(actor,'thuulForging')});
 if(Number(tools))rows.push({label:t('Tools'),value:Number(tools)});
 return {base:breakdown.base,rows,item,target:breakdown.base+rollModifierTotal(rows)+Number(modifier),quality:knowledgeRank(actor,material)};
}
export function knownRunes(actor){return Array.from(actor.items??[]).filter(item=>item.system?.isRune&&runeDefinition(item.system.catalogId)).flatMap(item=>{
 const tablet=Array.from(actor.items??[]).find(row=>row.type==='tablet'&&row.system.catalogId===item.system.tabletId);
 const level=Number(tablet?.system.level??0);return level>0?[{id:item.system.catalogId,name:item.name,level,item}]:[];
});}
export function sacredCraftData(actor,{type,subtype='oneHandedLightWeapons',templateUuid='',name='',material='hardMaterials'},templates=publicSacredTemplates(game.items)){
 if(!SACRED_TYPES.includes(type)||!CRAFT_MATERIALS.includes(material))throw Error(t('Invalid'));
 const template=templateUuid?templates.find(item=>item.uuid===templateUuid&&item.type===type):null;
 if(templateUuid&&!template)throw Error(t('InvalidTemplate'));
 const data=template?template.toObject():{type,img:type==='weapon'?'icons/svg/sword.svg':type==='armor'?'icons/svg/armor.svg':type==='shield'?'icons/svg/shield.svg':'icons/svg/item-bag.svg',system:{}};
 for(const key of ['_id','_stats','folder','sort','ownership'])delete data[key];
 data.flags={};data.name=String(name||template?.name||game.i18n.localize('TYPES.Item.'+type)).trim();
 data.system={...data.system,craftMaterial:material,quantity:1,equipped:false,magical:true,specialUse:'votive'};
 if(type==='weapon'&&!template){
  const category={oneHandedLightWeapons:'oneHandedLight',oneHandedHeavyWeapons:'oneHandedHeavy',twoHandedWeapons:'twoHanded',crossbow:'ranged',bowsSlings:'ranged'}[subtype];
  if(!category)throw Error(t('Invalid'));Object.assign(data.system,{category,combatSpecialty:subtype});
 }
 const quality=knowledgeRank(actor,material);
 const basis={type,system:data.system,_source:{system:{...data.system,quality:data.system.quality??2}}};
 Object.assign(data,intrinsicQualityUpdate(basis,{system:{quality}}));
 data.system.sacred={enabled:true,creatorUuid:actor.uuid,invested:0,current:0,runes:[],failed:[],lastDay:Math.floor(Number(game.time?.worldTime||0)/86400)};
 return data;
}
/** One writer serializes reservations and spending across all clients for this actor. */
function queued(payload,authority=false){const old=jobs.get(payload.actorUuid)??Promise.resolve(),job=old.catch(()=>{}).then(()=>mutate(payload,authority));jobs.set(payload.actorUuid,job);return job.finally(()=>{if(jobs.get(payload.actorUuid)===job)jobs.delete(payload.actorUuid);});}
async function mutate({actorUuid,itemId,operation,values={},userId},authority){
 const actor=await foundry.utils.fromUuid(actorUuid),user=game.users?.get(userId)??game.user;
 if(!actor?.canUserModify?.(user,'update')||!authority&&!actor.canUserModify(game.user,'update'))throw Error(t('Permission'));
 if(operation==='create'){
  if(knowledgeRank(actor,'thuulForging')<1)throw Error(t('Invalid'));
  const data=sacredCraftData(actor,values);return {itemId:(await actor.createEmbeddedDocuments('Item',[data]))[0]?.id};
 }
 if(operation==='rest'||operation==='dailyRest'){
  const updates=sacredObjects(actor).filter(item=>operation==='rest'||sacredState(item).lastDay<Math.floor(Number(game.time?.worldTime||0)/86400)).map(item=>{const s=state(item);Object.assign(s,sacredRuneTotals(item));s.current=s.invested;s.runes=s.runes.map(row=>({...row,current:row.invested,uses:0}));s.lastDay=Math.floor(Number(game.time?.worldTime||0)/86400);return {_id:item.id,'system.sacred':s};});
  if(updates.length)await actor.updateEmbeddedDocuments('Item',updates);return {restored:updates.length};
 }
 const item=actor.items.get(itemId);if(!isSacredObject(item)||sacredState(item).creatorUuid!==actor.uuid)throw Error(t('Invalid'));
 const s=state(item);Object.assign(s,sacredRuneTotals(item));if(!validSacredState(s))throw Error(t('InvalidBalance'));
 if(operation==='remove'){
  await item.delete({trudvangSacredDelete:true});return {removed:true};
 }
 if(operation==='invest'){
  const amount=Number(values.amount),balance=sacredBalance(actor);
  if(!Number.isInteger(amount)||amount<1||amount>balance.free||balance.overdrawn||s.invested+amount>sacredCapacity(actor,equipmentCraftMaterial(item)))throw Error(t('InvalidInvestment'));
  const rune=s.runes.find(row=>row.id===values.runeId);if(!rune)throw Error(t('InvalidRune'));
  s.invested+=amount;s.current+=amount;rune.invested+=amount;rune.current+=amount;
 }else if(operation==='inscribe'){
  if(typeof values.success!=='boolean')throw Error(t('Invalid'));
  const {level,amount}=inscriptionPlan(actor,item,values,{checkFunds:values.success});
  const old=s.runes.find(row=>row.sourceId===values.sourceId);
  if(!values.success)s.failed.push({sourceId:values.sourceId,level});
  else{
   s.invested+=amount;s.current+=amount;
   if(old){old.level=level;old.invested+=amount;old.current+=amount;}
   else s.runes.push({id:crypto.randomUUID(),sourceId:values.sourceId,level,invested:amount,current:amount,uses:0});
  }
 }else if(operation==='consume'){
  const row=s.runes.find(row=>row.id===values.runeId);if(!row||!runeRow(row).canUse||values.expected&&JSON.stringify(row)!==values.expected)throw Error(t('Unavailable'));
  row.current-=row.level;row.uses++;s.current-=row.level;
 }else throw Error(t('Invalid'));
 if(!validSacredState(s))throw Error(t('InvalidBalance'));
 await item.update({'system.sacred':s});
 if(operation==='inscribe')await syncFailedInscriptions(item);

 return {itemId:item.id};
}
export async function requestSacredMutation(actor,operation,{itemId='',...values}={}){
 const payload={type:'sacredMutation',requestId:crypto.randomUUID(),actorUuid:actor.uuid,itemId,operation,values,userId:game.user.id};
 if(writer()||!game.users?.activeGM)return queued(payload,writer());
 if(!game.socket)throw Error(t('Unavailable'));registerSacredSockets();
 return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{replies.delete(payload.requestId);reject(Error(t('Unavailable')));},30000);replies.set(payload.requestId,{resolve,reject,timer});game.socket.emit(channel,payload);});
}
export function registerSacredSockets(){
 if(registered||!game.socket)return;registered=true;
 game.socket.on(channel,async payload=>{
  if(payload?.type==='sacredReply'&&payload.userId===game.user.id){const row=replies.get(payload.requestId);if(!row)return;clearTimeout(row.timer);replies.delete(payload.requestId);if(payload.error)row.reject(Error(payload.error));else row.resolve(payload.result);return;}
  if(payload?.type!=='sacredMutation'||!writer())return;
  let result,error;try{result=await queued(payload,true);}catch(err){error=err.message;}
  game.socket.emit(channel,{type:'sacredReply',requestId:payload.requestId,userId:payload.userId,result,error});
 });
}
export async function removeSacredObject(item){
 const actor=item.parent;if(!actor?.isOwner)return null;
 const accepted=await foundry.applications.api.DialogV2.confirm({window:{title:t('Remove')},content:'<p>'+e(game.i18n.format('TRUDVANG.Sacred.RemoveConfirm',{name:item.name,points:sacredRuneTotals(item).invested}))+'</p>'});
 return accepted?requestSacredMutation(actor,'remove',{itemId:item.id}):null;
}
const select=(name,label,options)=>'<div class="form-group"><label>'+e(label)+'</label><select name="'+a(name)+'">'+options.map(row=>'<option value="'+a(row.value)+'">'+e(row.label)+'</option>').join('')+'</select></div>';
const input=(name,label,value=0,type='number')=>'<div class="form-group"><label>'+e(label)+'</label><input name="'+a(name)+'" type="'+type+'" value="'+a(String(value))+'"'+(type==='number'?' step="1"':'')+'></div>';
const read=root=>Object.fromEntries(Array.from(root.querySelectorAll('[name]')).filter(el=>el.type!=='radio'||el.checked).map(el=>[el.name,el.type==='checkbox'?el.checked:['number','radio'].includes(el.type)?Number(el.value):el.value]));
const cancel={action:'cancel',label:()=>game.i18n.localize('TRUDVANG.Action.Cancel'),callback:()=>false};
const buttons=(action,label,callback)=>[{action,label,default:true,callback}, {...cancel,label:cancel.label()}];
export async function createSacredObjectDialog(actor){
 if(!owner(actor))return null;if(actor.canPerformAction?.()===false)return actor.warnCannotAct();
 const templates=publicSacredTemplates(game.items),weapons=['oneHandedLightWeapons','oneHandedHeavyWeapons','twoHandedWeapons','crossbow','bowsSlings'];
 const kit=Array.from(actor.items??[]).find(item=>String(item.flags?.[S]?.starterId??'').includes('CraftKit'));
 const toolsDefault=kit?(String(kit.flags[S].starterId).endsWith('Large')?-3:String(kit.flags[S].starterId).endsWith('Small')?-7:-5):0;
 class CraftDialog extends foundry.applications.api.DialogV2{
  _onRender(c,o){super._onRender(c,o);const root=this.element;let lastRecipe='';
   const refresh=()=>{
    let v=read(root);root.querySelector('[name=subtype]').closest('.form-group').hidden=v.type!=='weapon';
    const recipe=[v.type,v.subtype,v.copy].join('|'),control=root.querySelector('[name=templateUuid]');
    const eligible=templates.filter(item=>item.type===v.type&&(v.type!=='weapon'||weaponType(item)===v.subtype));
    if(recipe!==lastRecipe){control.innerHTML=eligible.map(item=>'<option value="'+a(item.uuid)+'">'+e(item.name)+'</option>').join('');lastRecipe=recipe;}
    control.closest('.form-group').hidden=!v.copy;v=read(root);
    const chosen=eligible.find(item=>item.uuid===v.templateUuid),signature=v.copy?chosen?.uuid:v.type+':'+v.subtype;
    if(signature!==this._recipe){root.querySelector('[name=material]').value=chosen?equipmentCraftMaterial(chosen):'hardMaterials';this._recipe=signature;v=read(root);}
    const p=craftingBreakdown(actor,v.material,v);root.querySelector('[data-sacred-breakdown]').innerHTML=e(game.i18n.localize('TRUDVANG.Skill.Care'))+' : '+p.base+'<br>'+rollModifierFlavor(p.rows);
    root.querySelector('[data-procedure-target]').textContent=p.target;
    root.querySelector('[data-sacred-quality]').textContent=game.i18n.localize('TRUDVANG.Quality.'+['Worthless','Poor','Normal','Good','Masterful','Legendary'][p.quality]);
    root.querySelector('[data-action=fabricate]').disabled=Boolean(v.copy&&!chosen);
   };root.addEventListener('change',refresh);root.addEventListener('input',refresh);root.querySelector('[name=tools]').value=toolsDefault;refresh();
  }
 }
 const choice=await blessingDialog(CraftDialog,actor).wait({window:{title:actor.name+' — '+t('Create')},position:{width:580},classes:['trudvang','dialog'],content:'<div class="trudvang roll-dialog sacred-dialog">'+select('type',t('Type'),SACRED_TYPES.map(value=>({value,label:game.i18n.localize('TYPES.Item.'+value)})))+select('subtype',game.i18n.localize('TRUDVANG.Field.WeaponType'),weapons.map(value=>({value,label:game.i18n.localize('TRUDVANG.Knowledge.'+value)})))+'<label class="checkbox"><input name="copy" type="checkbox">'+e(t('Copy'))+'</label>'+select('templateUuid',t('Template'),[])+input('name',t('Name'),'','text')+select('material',t('Craft'),CRAFT_MATERIALS.map(value=>({value,label:game.i18n.localize('TRUDVANG.Knowledge.'+value)})))+select('tools',t('Tools'),[0,-3,-5,-7].map((value,i)=>({value,label:t('Tool'+i)+' ('+value+')'})))+'<p data-sacred-breakdown></p><p>'+e(t('Quality'))+' : <strong data-sacred-quality></strong></p>'+conditionalModifierSection()+input('modifier',game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+'<p>'+e(game.i18n.localize('TRUDVANG.Dialog.FinalTarget'))+' : <strong data-procedure-target></strong></p></div>',buttons:buttons('fabricate',t('Fabricate'),(_event,button,dialog)=>read(button.form??dialog.element)),rejectClose:false,close:()=>false});
 if(!choice)return null;
 const p=craftingBreakdown(actor,choice.material,choice);
 const result=await rollUnder({actor,label:t('Create'),target:p.target,kind:'skill',item:p.item,blessing:choice.blessing,flavor:rollModifierFlavor(p.rows)+'<br>'+e(game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+' : '+choice.modifier});
 if(!result.success)return null;
 return requestSacredMutation(actor,'create',{type:choice.type,subtype:choice.subtype,templateUuid:choice.copy?choice.templateUuid:'',name:choice.name,material:choice.material});
}
export function runeInvestmentAvailable(actor,item){
 const balance=sacredBalance(actor),totals=sacredRuneTotals(item);
 return balance.overdrawn?0:Math.max(0,Math.min(balance.free,sacredCapacity(actor,equipmentCraftMaterial(item))-totals.invested));
}
export function inscriptionPlan(actor,item,values,{checkFunds=true}={}){
 const s=state(item),known=knownRunes(actor).find(row=>row.id===values.sourceId),level=Number(values.level),amount=Number(values.amount),old=s.runes.find(row=>row.sourceId===values.sourceId);
 if(!runeObjectEligible(item,values.sourceId))throw Error(t('WrongRuneObject'));
 if(!known||!Number.isInteger(level)||level<1||level>known.level||old&&level<=old.level||s.failed.some(row=>row.sourceId===values.sourceId&&row.level<=level))throw Error(t('InvalidRune'));
 if(!Number.isInteger(amount)||amount<Math.max(0,level-(old?.invested??0))||checkFunds&&amount>runeInvestmentAvailable(actor,item))throw Error(t('InvalidInvestment'));
 return {level,amount};
}
export async function investSacredDialog(item,runeId){
 if(!item.parent?.isOwner)return null;
 const row=sacredState(item).runes.find(row=>row.id===runeId);if(!row)return ui.notifications.warn(t('InvalidRune'));
 const max=runeInvestmentAvailable(item.parent,item),runeName=game.i18n.localize('TRUDVANG.Content.Power.'+row.sourceId+'.Name');
 const choice=await foundry.applications.api.DialogV2.wait({window:{title:item.name+' — '+runeName},content:'<div class="trudvang roll-dialog"><p>'+e(game.i18n.format('TRUDVANG.Sacred.InvestAvailable',{max}))+'</p>'+input('amount',t('Points'),Math.min(row.level,max))+'</div>',buttons:buttons('invest',t('Invest'),(_e,b,d)=>read(b.form??d.element)),rejectClose:false,close:()=>false});
 return choice?requestSacredMutation(item.parent,'invest',{itemId:item.id,runeId,amount:choice.amount}):null;
}
export async function inscribeRuneDialog(item){
 const actor=item.parent;if(!owner(actor))return null;if(actor.canPerformAction?.()===false)return actor.warnCannotAct();
 const known=knownRunes(actor).filter(row=>runeObjectEligible(item,row.id));if(!known.length)return ui.notifications.warn(t('NoRunes'));
 const s=state(item);
 class InscribeDialog extends foundry.applications.api.DialogV2{
  _onRender(c,o){
   super._onRender(c,o);const root=this.element;let selectedSource='',selectedLevel=0;
   const refresh=()=>{
    let v=read(root);const k=known.find(row=>row.id===v.sourceId),old=s.runes.find(row=>row.sourceId===v.sourceId);
    if(k&&selectedSource!==v.sourceId){
     root.querySelector('[data-rune-ranks]').innerHTML=Array.from({length:k.level},(_,i)=>{const level=i+1,blocked=level<=Number(old?.level??0)||s.failed.some(row=>row.sourceId===v.sourceId&&row.level<=level);return '<label><input name="level" type="radio" value="'+level+'"'+(level===k.level?' checked':'')+(blocked?' disabled':'')+'><span>'+level+'</span></label>';}).join('');
     selectedSource=v.sourceId;selectedLevel=0;
    }
    v=read(root);if(v.level!==selectedLevel){root.querySelector('[name=amount]').value=v.level??k?.level??1;selectedLevel=v.level;v=read(root);}
    const available=runeInvestmentAvailable(actor,item),amount=root.querySelector('[name=amount]');amount.min=Math.max(0,Number(v.level)-(old?.invested??0));amount.max=available;
    root.querySelector('[data-rune-funds]').textContent=game.i18n.format('TRUDVANG.Sacred.DirectFunds',{free:sacredBalance(actor).free,available});
    const p=inscriptionBreakdown(actor,item,v.sourceId,Number(v.level||0),v.modifier);
    root.querySelector('[data-procedure-target]').textContent=p.target;root.querySelector('[data-sacred-breakdown]').innerHTML=rollModifierFlavor(p.rows);
    let valid=true;try{inscriptionPlan(actor,item,v);}catch{valid=false;}
    root.querySelector('[data-action=inscribe]').disabled=!valid;
   };
   root.addEventListener('input',refresh);root.addEventListener('change',refresh);refresh();
  }
 }
 const choice=await blessingDialog(InscribeDialog,actor).wait({window:{title:item.name+' — '+t('Inscribe')},classes:['trudvang','dialog'],position:{width:560},content:'<div class="trudvang roll-dialog">'+select('sourceId',t('Rune'),known.map(row=>({value:row.id,label:row.name})))+'<fieldset class="sacred-rune-ranks"><legend>'+e(game.i18n.localize('TRUDVANG.Field.Level'))+'</legend><div data-rune-ranks role="radiogroup" aria-label="'+a(game.i18n.localize('TRUDVANG.Field.Level'))+'"></div></fieldset>'+input('amount',t('Points'),known[0].level)+'<p data-rune-funds></p><p>'+e(t('InscriptionWarning'))+'</p><p data-sacred-breakdown></p>'+conditionalModifierSection()+input('modifier',game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+'<p>'+e(game.i18n.localize('TRUDVANG.Dialog.FinalTarget'))+' : <strong data-procedure-target></strong></p></div>',buttons:buttons('inscribe',t('Inscribe'),(_e,b,d)=>read(b.form??d.element)),rejectClose:false,close:()=>false});
 if(!choice)return null;
 try{inscriptionPlan(actor,item,choice);}catch(error){return ui.notifications.warn(error.message);}
 const p=inscriptionBreakdown(actor,item,choice.sourceId,choice.level,choice.modifier);
 const result=await rollUnder({actor,label:item.name+' — '+t('Inscribe'),target:p.target,kind:'skill',blessing:choice.blessing,flavor:rollModifierFlavor(p.rows)+'<br>'+e(game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+' : '+choice.modifier});
 if(!result)return null;
 await requestSacredMutation(actor,'inscribe',{itemId:item.id,...choice,success:result.success});
 if(result.success)await syncPermanentRunes(item);
 return result;
}
export function inscriptionBreakdown(actor,item,sourceId,level,modifier=0){
 const count=Array.from(sacredState(item).runes??[]).filter(row=>row.sourceId!==sourceId).length;
 return faithBreakdown(actor,[
  {label:game.i18n.format('TRUDVANG.Sacred.InscriptionRuneLevel',{level}),value:-Number(level)},
  {label:game.i18n.format('TRUDVANG.Sacred.InscriptionOtherRunes',{count}),value:count?-2*count:0}
 ],modifier);
}
export function faithBreakdown(actor,penalty=0,modifier=0){
 const item=actor.findRuleKnowledge('thuulForging'),b=actor.getAbilityBreakdown(item),rows=[...b.modifierRows,...conditionalSkillModifiers(actor,'faith',item,'',{automatic:true})];
 rows.push(...transformationRollRows(actor,{target:b.base+rollModifierTotal(rows),skillKey:'faith'}));
 if(Array.isArray(penalty))rows.push(...penalty);else if(penalty)rows.push({label:t('RuneModifier'),value:penalty});
 return {target:b.base+rollModifierTotal(rows)+Number(modifier),base:b.base,rows};
}
export async function activateSacredRune(item,runeId){
 const actor=item.parent;if(!owner(actor)||sacredState(item)?.creatorUuid!==actor.uuid)return null;if(actor.canPerformAction?.()===false)return actor.warnCannotAct();
 const row=sacredState(item).runes.find(row=>row.id===runeId);if(!row||!runeRow(row).canUse)return ui.notifications.warn(t('Unavailable'));
 const definition=runeDefinition(row.sourceId),p=faithBreakdown(actor,definition.runeActivation?.modifier??0);
 class ActivationDialog extends foundry.applications.api.DialogV2{
  _onRender(c,o){super._onRender(c,o);const root=this.element;root.querySelector('[name=modifier]').addEventListener('input',event=>{root.querySelector('[data-procedure-target]').textContent=p.target+Number(event.target.value||0);});}
 }
 const choice=await blessingDialog(ActivationDialog,actor,'modifier',{castingType:'divine',runeObjectUuid:item.uuid,runeSourceId:row.sourceId}).wait({window:{title:item.name+' — '+game.i18n.localize('TRUDVANG.Content.Power.'+row.sourceId+'.Name')},classes:['trudvang','dialog'],content:'<div class="trudvang roll-dialog"><p>'+e(game.i18n.format('TRUDVANG.Sacred.ActivationCost',{level:row.level,current:row.current,invested:row.invested}))+'</p><p>'+p.base+'<br>'+rollModifierFlavor(p.rows)+'</p>'+conditionalModifierSection()+input('modifier',game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+'<p>'+e(game.i18n.localize('TRUDVANG.Dialog.FinalTarget'))+' : <strong data-rune-base="'+p.target+'" data-procedure-target>'+p.target+'</strong></p></div>',buttons:buttons('activate',game.i18n.localize('TRUDVANG.Action.Roll'),(_e,b,d)=>read(b.form??d.element)),rejectClose:false,close:()=>false});
 if(!choice)return null;
 await requestSacredMutation(actor,'consume',{itemId:item.id,runeId,expected:JSON.stringify(row)});
 const tablet=TABLET_BY_ID.get(row.sourceId.split(':')[0]),power=tablet?.powers.find(p=>p.id===row.sourceId);if(!power)return null;
 const data=powerItemData(power,tablet);data.system.level=row.level;data.flags??={};data.flags[S]??={};data.flags[S].runeActivation={objectUuid:item.uuid,runeId,level:row.level};
 const virtual={...data,actor,parent:actor,uuid:knownRunes(actor).find(r=>r.id===row.sourceId)?.item.uuid??'',documentName:'Item'};
 return rollUnder({actor,item:virtual,label:item.name+' — '+data.name,target:p.target+choice.modifier,blessing:choice.blessing,kind:'rune',perfectSuccessMax:0,automaticSuccessMax:1,fatalEffect:{kind:'faith',threshold:9,modifier:actor.fatalEffectModifier?.('faith',row.level)??0},powerLevelCounts:Array.from({length:5},(_,i)=>i===row.level-1?1:0),flavor:rollModifierFlavor(p.rows)+'<br>'+e(game.i18n.localize('TRUDVANG.Dialog.SituationalModifier'))+' : '+choice.modifier});
}
/** Permanent native rune benefits belong to the item and transfer only while carried. */
const permanentSyncJobs=new Map();
export function syncPermanentRunes(item){
 if(!isSacredObject(item)||!item.parent?.isOwner||game.users?.activeGM&&!writer())return Promise.resolve();
 const previous=permanentSyncJobs.get(item.uuid)??Promise.resolve(),job=previous.catch(()=>{}).then(()=>syncPermanentRunesNow(item));
 permanentSyncJobs.set(item.uuid,job);return job.finally(()=>{if(permanentSyncJobs.get(item.uuid)===job)permanentSyncJobs.delete(item.uuid);});
}
async function syncPermanentRunesNow(item){
 const {TRANSFORMATIONS_BY_SOURCE,TRANSFORMATION_TEMPLATES}=await import('./transformation-data.mjs');
 const {applyTransformation}=await import('./transformations.mjs');
 for(const row of sacredState(item).runes){
  const target=runeDefinition(row.sourceId)?.runeActivation?.permanentTarget;if(!target)continue;
  for(const key of TRANSFORMATIONS_BY_SOURCE[row.sourceId]??[]){
   if(TRANSFORMATION_TEMPLATES[key]?.weaponHitOnly)continue;
   const old=Array.from(item.effects??[]).find(effect=>effect.flags?.[S]?.sacredRuneId===row.id&&effect.flags?.[S]?.transformation?.key===key);
   if(old?.flags[S].transformation?.runeLevel===row.level)continue;
   const result=await applyTransformation(item.parent,key,{counts:Array.from({length:5},(_,i)=>i===row.level-1?1:0),skipDialog:true,preselectedAnswers:{runeLevel:row.level,duration:''},destinationItem:item,context:{sourceId:row.sourceId,kind:'rune',casterUuid:item.parent.uuid,runeLevel:row.level}});
   if(result){await result.update({transfer:target!=='object','system.activation':target==='equipped'?'equipped':'inventory',['flags.'+S+'.sacredRuneId']:row.id});if(old&&old.id!==result.id)await old.delete();}
  }
 }
}
export async function restoreSacredObjects(actor){if(sacredObjects(actor).length)return requestSacredMutation(actor,'rest');}
export async function refreshDailySacredObjects(time){
 if(!writer())return;
 const actors=new Set(Array.from(game.actors??[]));for(const scene of game.scenes??[])for(const token of scene.tokens??[])if(token.actor)actors.add(token.actor);
 for(const actor of actors)if(sacredObjects(actor).some(item=>sacredState(item).lastDay<Math.floor(time/86400)))await requestSacredMutation(actor,'dailyRest');
}
const failedSyncJobs=new Map();
export function syncFailedInscriptions(item){
 if(!isSacredObject(item))return Promise.resolve();
 const old=failedSyncJobs.get(item.uuid);if(old)return old;
 const job=(async()=>{
  for(const failure of sacredState(item).failed??[]){
   if(Array.from(item.effects??[]).some(effect=>{const flag=effect.flags?.[S]?.sacredInscriptionFailure;return flag?.sourceId===failure.sourceId&&flag.level===failure.level;}))continue;
   const args={rune:game.i18n.localize('TRUDVANG.Content.Power.'+failure.sourceId+'.Name'),level:failure.level};
   await item.createEmbeddedDocuments('ActiveEffect',[{name:game.i18n.format('TRUDVANG.Sacred.FailedName',args),img:'icons/svg/downgrade.svg',type:'effect',transfer:false,disabled:false,duration:{value:null,units:'rounds'},description:'<p>'+e(game.i18n.format('TRUDVANG.Sacred.FailedDescription',args))+'</p>',system:{changes:[],stacking:'replace',stackId:'sacred-inscription-failure:'+failure.sourceId+':'+failure.level},flags:{[S]:{sacredInscriptionFailure:{...failure},summary:game.i18n.format('TRUDVANG.Sacred.FailedSummary',args)}}}]);
  }
 })().finally(()=>failedSyncJobs.delete(item.uuid));failedSyncJobs.set(item.uuid,job);return job;
}
function sacredWorldItems(){
 const actors=new Set(Array.from(game.actors??[]));for(const scene of game.scenes??[])for(const token of scene.tokens??[])if(token.actor)actors.add(token.actor);
 return new Set([...Array.from(game.items??[]),...[...actors].flatMap(actor=>Array.from(actor.items??[]))]);
}
export async function migrateSacredEquipmentCorrections(){
 // TEMPORARY WORLD MIGRATION — v0.217.0 explicitly classified Stafur Slingu as hard.
 // Correct recognized starter copies once; custom untracked equipment is untouched.
 if(!writer())return;
 const version=Number(game.settings.get(S,'sacredEquipmentCorrections'));
 if(version>=2)return;
 for(const item of sacredWorldItems()){
  if(version<1&&item.flags?.[S]?.starterId==='TRUDVANG.Content.Item.StafurSlingu'&&item.system?.craftMaterial==='hardMaterials')await item.update({'system.craftMaterial':'softMaterials'});
  // TEMPORARY WORLD MIGRATION — pre-direct-funding objects could hold unassigned DP.
  // Return that unused investment by keeping only their existing rune totals.
  if(isSacredObject(item)){const totals=sacredRuneTotals(item);if(totals.current!==sacredState(item).current||totals.invested!==sacredState(item).invested)await item.update({'system.sacred.current':totals.current,'system.sacred.invested':totals.invested});}
 }
 await game.settings.set(S,'sacredEquipmentCorrections',2);
}
export function registerSacredHooks(){
 game.settings.register(S,'sacredEquipmentCorrections',{scope:'world',config:false,type:Number,default:0});
 Hooks.once('ready',async()=>{await migrateSacredEquipmentCorrections();for(const item of sacredWorldItems())if(isSacredObject(item)&&(writer()||!game.users?.activeGM&&item.isOwner)){await syncFailedInscriptions(item);await syncPermanentRunes(item);}});
 Hooks.on('updateItem',item=>{if(isSacredObject(item)&&(writer()||!game.users?.activeGM&&item.isOwner))void (async()=>{await syncFailedInscriptions(item);await syncPermanentRunes(item);})().catch(error=>console.error('Trudvang | Sacred inscription synchronization failed',error));});
 Hooks.on('updateWorldTime',time=>refreshDailySacredObjects(time).catch(error=>console.error('Trudvang | Sacred recovery failed',error)));
}
