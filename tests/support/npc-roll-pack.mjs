import assert from "node:assert/strict";
import {NPC_ROLL_PACK} from "../../modules/npc-roll-records.mjs";

export function mockNpcRollPack(game) {
  const records = new Map();
  const pack = {
    collection:NPC_ROLL_PACK, documentName:"JournalEntry",
    ownership:{PLAYER:"NONE",TRUSTED:"NONE",ASSISTANT:"OWNER",GAMEMASTER:"OWNER"},
    async getDocument(id) { assert.equal(game.user.isGM,true); return records.get(id); },
    documentClass:{async create(data,options) {
      assert.equal(game.user.isGM,true);
      assert.equal(options.pack,NPC_ROLL_PACK);
      const id = crypto.randomUUID().replaceAll("-","").slice(0,16);
      const page = data.pages[0];
      page.update = async changes => { page.text.content = changes["text.content"]; };
      const record = {id,pack:NPC_ROLL_PACK,flags:data.flags,pages:{contents:[page]},
        async update(changes) { this.flags["trudvang-chronicles"].npcRollDetails = changes["flags.trudvang-chronicles.npcRollDetails"]; }
      };
      records.set(id,record);
      return record;
    }}
  };
  (game.packs ??= new Map()).set(NPC_ROLL_PACK,pack);
  (globalThis.CONST ??= {}).JOURNAL_ENTRY_PAGE_FORMATS ??= {HTML:1};
  return records;
}
