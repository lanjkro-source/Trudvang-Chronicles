import {getNpcRollRecord,npcRollRecordData,NPC_ROLL_PACK,storeNpcRollRecord,updateNpcRollRecord} from "./npc-roll-records.mjs";

const scope = "trudvang-chronicles";
const labelForOutcome = success => success ? "TRUDVANG.Roll.Success" : "TRUDVANG.Roll.Failure";
const users = () => Array.from(game.users?.values?.() ?? game.users ?? []);
const gmIds = () => users().filter(user => user.isGM).map(user => user.id);
export const isNpcRoll = actor => actor?.type === "npc";

export function publicOutcome(outcome) {
  return {success:outcome.success === true, outcomeLabelKey:labelForOutcome(outcome.success)};
}

function publicTargets(rows) {
  return rows?.map(({actorUuid,tokenUuid,name,success})=>({actorUuid,tokenUuid,name,...publicOutcome({success})}));
}

export function renderRollCard(template, view, {resultOnly = false} = {}) {
  const summary = resultOnly && template === "roll-card" ? {
    ...publicOutcome(view), outcomeMargin:"", attackTargets:publicTargets(view.attackTargets), nidResults:publicTargets(view.nidResults)
  } : {};
  const renderTemplate = foundry.applications?.handlebars?.renderTemplate ?? globalThis.renderTemplate;
  return renderTemplate("systems/trudvang-chronicles/templates/chat/"+template+".hbs",{...view,...summary,resultOnly});
}

export function publicCastingContext(context) {
  return partitionFlags({ruleTestContext:context}).publicFlags.ruleTestContext;
}

function partitionFlags(flags = {}) {
  const publicFlags = {...flags};
  const details = {};
  const strip = (name,keys) => {
    if (!flags[name]) return;
    publicFlags[name] = {...flags[name]};
    for (const key of keys) if (Object.hasOwn(publicFlags[name],key)) {
      (details[name] ??= {})[key] = publicFlags[name][key];
      delete publicFlags[name][key];
    }
  };
  if (flags.attackTargets) {
    details.attackTargets = flags.attackTargets;
    publicFlags.attackTargets = publicTargets(flags.attackTargets);
  }
  strip("rollOutcome",["result","target","margin","critical"]);
  strip("ruleTestContext",["nidRoll","nidTargets"]);
  for (const key of ["spellZoneCasting","magicFearArea","sealPreparation","followupTest","impactTestFor","spellZoneProof"]) strip(key,["target"]);
  strip("dispelAttempt",["result","target"]);
  strip("damageContext",["components","rangedCover"]);
  strip("fearContext",["values","adjustment","profile"]);
  strip("releasedSeal",["roll","target"]);
  for (const key of ["conditionalDamage","conditionalDamageBeforeRange"]) if (Object.hasOwn(flags,key)) {
    details[key] = flags[key];
    delete publicFlags[key];
  }
  return {publicFlags,details};
}

export async function publishNpcRollDetails({content, rolls = [], flags = {}, animate = true} = {}) {
  let id;
  try {
    id = await storeNpcRollRecord(content,{flags,rollData:rolls.map(roll=>roll.toJSON?.() ?? roll),animate});
  } catch (error) {
    console.error("Trudvang | NPC roll could not be archived",error);
  }
  if (!id) globalThis.ui?.notifications?.warn(game.i18n.localize("TRUDVANG.NpcRollDetails.Unavailable"));
  if (animate) void animateMaskedNpcRolls(rolls);
  return id ? {id} : null;
}

export async function npcRollCardData(data, resultContent, {hideOutcome = false, animate = true, keepProof = false} = {}) {
  if (!hideOutcome && typeof resultContent !== "string") throw Error("An NPC roll needs public result content");
  const {publicFlags,details} = partitionFlags(data.flags?.[scope]);
  const record = await publishNpcRollDetails({content:data.content,rolls:data.rolls,flags:keepProof ? data.flags?.[scope] : details,animate});
  return {...data,content:hideOutcome ? data.content : resultContent,rolls:[],
    ...(hideOutcome ? {whisper:gmIds(),blind:true} : {}),
    flags:{...data.flags,[scope]:{...publicFlags,npcRoll:{detailId:record?.id}},"dice-so-nice":{skip:true}}
  };
}

/** The visible result remains the canonical card referenced by game actions. */
export async function createActorRollMessage(actor, data, {resultContent, hideOutcome = false, animate = true, createOptions = {}} = {}) {
  if (!isNpcRoll(actor)) return ChatMessage.create(data,createOptions);
  if (hideOutcome && !gmIds().length) return null;
  return ChatMessage.create(await npcRollCardData(data,resultContent,{hideOutcome,animate}),createOptions);
}

export async function updateActorRollMessage(actor,message,changes,fullContent,{extraRolls=[]}={}) {
  if (!isNpcRoll(actor)) return message.update(changes);
  const id = message.flags?.[scope]?.npcRoll?.detailId;
  const publicChanges = {...changes};
  const secrets = {};
  for (const [path,value] of Object.entries(changes)) {
    if (!path.startsWith("flags."+scope+".")) continue;
    const key = path.slice(("flags."+scope+".").length);
    if (key.includes(".")) continue;
    const {publicFlags,details} = partitionFlags({[key]:value});
    publicChanges[path] = publicFlags[key];
    if (Object.hasOwn(details,key)) secrets[key] = details[key];
  }
  if (id) await updateNpcRollRecord(id,fullContent,secrets,extraRolls.map(roll=>roll.toJSON?.()??roll));
  if (extraRolls.length) void animateMaskedNpcRolls(extraRolls);
  return message.update(publicChanges);
}

export const npcRollDetailMarker = id => id && /^[a-zA-Z0-9_-]+$/.test(id) ? '<span data-npc-roll-details="'+id+'" hidden></span>' : "";
export const npcRollDetailsId = message => message?.flags?.[scope]?.npcRoll?.detailId;

export async function readNpcRollDetails(id) {
  if (!id || !globalThis.game?.user?.isGM) return null;
  const entry = await getNpcRollRecord(id);
  if (entry) return npcRollRecordData(entry);
  // TEMPORARY WORLD MIGRATION: earlier cards referenced a private chat message instead of a journal entry.
  const legacy = game.messages?.get(id);
  const details = legacy?.flags?.[scope]?.npcRollDetails;
  return details ? {...details,content:legacy.content} : null;
}

export async function recordedRoll(message,index=0) {
  const roll = message?.rolls?.[index];
  if (roll) return roll;
  const source = (await readNpcRollDetails(message?.flags?.[scope]?.npcRoll?.detailId))?.rollData?.[index];
  return source ? Roll.fromData(source) : null;
}

export async function recordedRollFlag(message,key) {
  const raw = message?.flags?.[scope]?.[key] ?? message?.getFlag?.(scope,key);
  const secret = (await readNpcRollDetails(message?.flags?.[scope]?.npcRoll?.detailId))?.flags?.[key];
  if (secret === undefined) return raw;
  return raw && typeof raw === "object" && !Array.isArray(raw) ? {...raw,...secret} : secret;
}

/** Broadcast faceless dice using only the shapes and counts of the actual roll. */
export async function animateMaskedNpcRolls(rolls) {
  const dice3d = game.dice3d;
  if (typeof dice3d?.showForRoll !== "function") return;
  const viewers = users().filter(user => !user.isGM && user.active !== false).map(user => user.id);
  if (!viewers.length) return;
  const roller = game.user;
  const terms = rolls.flatMap(roll => (roll.dice ?? []).flatMap(die => {
    const count = die.results?.filter(result => !result.hidden).length ?? 0;
    return count && Number.isSafeInteger(die.faces) && die.faces >= 2 ? [count+"d"+die.faces] : [];
  }));
  if (!terms.length) return;
  try {
    // Dice So Nice serializes its animation data even for restricted recipients.
    const masked = await new Roll(terms.join(" + ")).evaluate({minimize:true,allowInteractive:false});
    await dice3d.showForRoll(masked,roller,true,viewers,!viewers.includes(roller.id),null,null,{ghost:true});
  } catch (error) {
    console.error("Trudvang | Masked dice animation failed", error);
  }
}

/** Play the original results locally on each GM client. */
export function animateNpcRollDetails(entry,{extraCount}={}) {
  const detail = entry.flags?.[scope]?.npcRollDetails;
  if ((entry.compendium?.collection ?? entry.pack) !== NPC_ROLL_PACK || !detail?.animate || !game.user?.isGM || !game.dice3d?.showForRoll) return;
  const rolls = extraCount > 0 ? detail.rollData.slice(-extraCount) : detail.rollData;
  for (const data of rolls) {
    Promise.resolve().then(()=>game.dice3d.showForRoll(Roll.fromData(data),game.user,false))
      .catch(error=>console.error("Trudvang | Private dice animation failed",error));
  }
}
