const SCOPE = "trudvang-chronicles";
const PACK_NAME = "trudvang-npc-roll-details";
export const NPC_ROLL_PACK = "world." + PACK_NAME;
const QUERY = SCOPE + ".writeNpcRoll";
const OWNERSHIP = {PLAYER:"NONE",TRUSTED:"NONE",ASSISTANT:"OWNER",GAMEMASTER:"OWNER"};
const writeKeys = new Map();
let preparing;

function isPrivate(pack) {
  return pack?.documentName === "JournalEntry" && ["PLAYER","TRUSTED"].every(role=>pack.ownership?.[role]==="NONE");
}

async function preparePack() {
  const name = game.i18n.localize("TRUDVANG.NpcRollDetails.Compendium");
  let pack = game.packs.get(NPC_ROLL_PACK);
  if (!pack) {
    const Pack = foundry.documents.collections.CompendiumCollection;
    pack = await Pack.createCompendium({name:PACK_NAME,label:name,type:"JournalEntry",packageType:"world",ownership:OWNERSHIP});
  }
  if (pack?.documentName !== "JournalEntry") throw Error("NPC roll compendium must contain journal entries");
  if (!isPrivate(pack) || pack.locked) await pack.configure({ownership:OWNERSHIP,locked:false});
  if (!isPrivate(pack)) throw Error("NPC roll compendium is not private");
  return pack;
}

async function writablePack() {
  if (!preparing) preparing = preparePack().finally(()=>{preparing = null;});
  return preparing;
}

export async function getNpcRollRecord(id) {
  if (!id || !globalThis.game?.user?.isGM) return null;
  const pack = game.packs?.get(NPC_ROLL_PACK);
  if (!isPrivate(pack)) return null;
  const entry = await pack.getDocument(id);
  return entry?.flags?.[SCOPE]?.npcRollDetails ? entry : null;
}

export function npcRollRecordData(entry) {
  const data = entry?.flags?.[SCOPE]?.npcRollDetails;
  if (!data) return null;
  return {...data,content:entry.pages?.contents?.[0]?.text?.content ?? ""};
}

async function writeOnGM({id, content, data, key} = {}, local) {
  if (!game.user.isGM || typeof content !== "string" || !data || typeof data !== "object") return null;
  if (!local && (typeof key !== "string" || key.length !== 36)) return null;
  if (id) {
    const entry = await getNpcRollRecord(id);
    const existing = entry?.flags?.[SCOPE]?.npcRollDetails;
    if (!existing || (!local && key !== existing.writeKey)) return null;
    const page = entry.pages.contents[0];
    await page.update({"text.content":content});
    const extra = Array.isArray(data.extraRolls) ? data.extraRolls : [];
    const updated = {...existing,flags:{...existing.flags,...data.flags},rollData:[...existing.rollData,...extra]};
    await entry.update({["flags."+SCOPE+".npcRollDetails"]:updated},{trudvangNpcExtraDice:extra.length});
    return id;
  }
  if (!Array.isArray(data.rollData)) return null;
  const pack = await writablePack();
  const label = game.i18n.localize("TRUDVANG.Tab.Details");
  const entry = await pack.documentClass.create({
    name:label,ownership:{default:0},
    pages:[{name:label,type:"text",text:{content,format:CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML}}],
    flags:{[SCOPE]:{npcRollDetails:{flags:data.flags,rollData:data.rollData,animate:data.animate===true,writeKey:key}}}
  },{pack:pack.collection});
  return entry?.id ?? null;
}

export function registerNpcRollQueries() {
  CONFIG.queries ??= {};
  CONFIG.queries[QUERY] = request => writeOnGM(request,false);
}

export async function storeNpcRollRecord(content, data) {
  if (!game.user?.isGM && !game.users?.activeGM) return null;
  // Bootstrap a single pack even if two GMs roll simultaneously for the first time.
  const gm = game.users?.activeGM;
  const remote = !game.user.isGM || (gm && gm.id !== game.user.id && !game.packs.has(NPC_ROLL_PACK));
  const key = remote ? crypto.randomUUID() : undefined;
  const request = {content,data,key};
  const id = remote ? await gm.query(QUERY,request) : await writeOnGM(request,true);
  if (id && key) writeKeys.set(id,key);
  return id;
}

export async function updateNpcRollRecord(id,content,flags,extraRolls) {
  const key = writeKeys.get(id);
  if (!id || (!game.user.isGM && !key)) return;
  const request = {id,content,data:{flags,extraRolls},key};
  if (game.user.isGM) await writeOnGM(request,true);
  else await game.users.activeGM?.query(QUERY,request);
}
