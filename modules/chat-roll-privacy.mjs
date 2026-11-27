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

export async function publishNpcRollDetails({speaker, content, rolls = [], flags = {}, animate = true, recipients} = {}) {
  const whisper = recipients ?? gmIds();
  if (!whisper.length) return null;
  const rollData = rolls.map(roll=>roll.toJSON?.() ?? roll);
  const message = await ChatMessage.create({speaker,whisper,blind:true,content,
    flags:{[scope]:{npcRollDetails:{flags,rollData,animate}},"dice-so-nice":{skip:true}}
  });
  if (message && animate) void animateMaskedNpcRolls(rolls);
  return message;
}

/** The visible result remains the canonical card referenced by game actions. */
export async function createActorRollMessage(actor, data, {resultContent, hideOutcome = false, animate = true, createOptions = {}} = {}) {
  if (!isNpcRoll(actor)) return ChatMessage.create(data,createOptions);
  if (!hideOutcome && typeof resultContent !== "string") throw Error("An NPC roll needs public result content");
  const {publicFlags,details} = partitionFlags(data.flags?.[scope]);
  const record = await publishNpcRollDetails({speaker:data.speaker,content:data.content,rolls:data.rolls,flags:details,animate});
  if (hideOutcome) return record;
  return ChatMessage.create({...data,content:resultContent,rolls:[],
    flags:{...data.flags,[scope]:{...publicFlags,npcRoll:{detailId:record?.id}},"dice-so-nice":{skip:true}}
  },createOptions);
}

export async function updateActorRollMessage(actor,message,changes,fullContent) {
  if (!isNpcRoll(actor)) return message.update(changes);
  const record = game.messages?.get(message.flags?.[scope]?.npcRoll?.detailId);
  const publicChanges = {...changes};
  const secrets = structuredClone(record?.flags?.[scope]?.npcRollDetails?.flags ?? {});
  for (const [path,value] of Object.entries(changes)) {
    if (!path.startsWith("flags."+scope+".")) continue;
    const key = path.slice(("flags."+scope+".").length);
    if (key.includes(".")) continue;
    const {publicFlags,details} = partitionFlags({[key]:value});
    publicChanges[path] = publicFlags[key];
    if (Object.hasOwn(details,key)) secrets[key] = details[key];
  }
  if (record) await record.update({content:fullContent,["flags."+scope+".npcRollDetails.flags"]:secrets});
  return message.update(publicChanges);
}

function recordFor(message) {
  if (!message || !globalThis.game?.user?.isGM) return null;
  return message.flags?.[scope]?.npcRollDetails ?? game.messages?.get(message.flags?.[scope]?.npcRoll?.detailId)?.flags?.[scope]?.npcRollDetails;
}

export function recordedRoll(message,index=0) {
  const roll = message?.rolls?.[index];
  if (roll) return roll;
  const source = recordFor(message)?.rollData?.[index];
  return source ? Roll.fromData(source) : null;
}

export function recordedRollFlag(message,key) {
  const raw = message?.flags?.[scope]?.[key] ?? message?.getFlag?.(scope,key);
  const secret = recordFor(message)?.flags?.[key];
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
export function animateNpcRollDetails(message) {
  const detail = message.flags?.[scope]?.npcRollDetails;
  if (!detail?.animate || !game.user?.isGM || message.isContentVisible === false || !game.dice3d?.showForRoll) return;
  for (const data of detail.rollData) {
    Promise.resolve().then(()=>game.dice3d.showForRoll(Roll.fromData(data),game.user,false))
      .catch(error=>console.error("Trudvang | Private dice animation failed",error));
  }
}
