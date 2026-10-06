import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import test from "node:test";
import {BESTIARY_ENTRIES} from "../modules/bestiary-catalog-data.mjs";
import {CREATURE_ABILITY_ENTRIES} from "../modules/creature-ability-data.mjs";
import {buildBestiaryPackDocuments, buildCreatureAbilityPackDocuments} from "../modules/bestiary-pack-data.mjs";
import {creatureTokenDimensions} from "../modules/rules/creature-token-size.mjs";
import {readiedHandConflicts, resolveCombatPools, weaponType} from "../modules/rules/combat-pool-resolver.mjs";
import {ignoresWoundPenalties} from "../modules/rules/npc-summary.mjs";

const language = code => {
  const lang = JSON.parse(readFileSync(new URL(`../lang/${code}.json`, import.meta.url), "utf8"));
  const localize = key => key.split(".").reduce((value, part) => value?.[part], lang);
  return {code, localize, format: (key, values) => Object.entries(values).reduce((s, [k,v]) => s.replaceAll(`{${k}}`, v), localize(key)), isFrench: () => code === "fr", strict: true};
};
const packs = Object.fromEntries(["fr", "en"].map(code => [code, buildBestiaryPackDocuments(language(code))]));
const featPacks = Object.fromEntries(["fr", "en"].map(code => [code, buildCreatureAbilityPackDocuments(language(code))]));
const adapter = actor => ({...actor, getSkillValue: id => actor.system.skills[id]?.value ?? 1,
  findRuleKnowledge: id => {
    const row = actor.system.skillTree.find(r => r.catalogId === id);
    return row ? {name: row.name, system: {level: row.value}} : null;
  }});

test("the four declared packs contain all creatures/capacities and stable bilingual identities", () => {
  const manifest = JSON.parse(readFileSync(new URL("../system.json", import.meta.url)));
  for (const [name, type, label] of [["bestiary-fr", "Actor", "Bestiaire (fr)"], ["bestiary-en", "Actor", "Bestiary (en)"],
    ["feats-fr", "Item", "Capacités (fr)"], ["feats-en", "Item", "Feats (en)"]]) {
    const pack = manifest.packs.find(p => p.name === name);
    assert.equal(pack.type, type); assert.equal(pack.label, label);
  }
  assert.equal(packs.fr.actors.length, 75); assert.equal(featPacks.fr.items.length, 150);
  assert.deepEqual(packs.fr.actors.map(a => a._id), packs.en.actors.map(a => a._id));
  assert.deepEqual(featPacks.fr.items.map(a => a._id), featPacks.en.items.map(a => a._id));
  assert.equal(new Set(BESTIARY_ENTRIES.map(e => e.id)).size, BESTIARY_ENTRIES.length);
  assert.equal(new Set(CREATURE_ABILITY_ENTRIES.map(e => e.id)).size, CREATURE_ABILITY_ENTRIES.length);
});

test("each bestiary actor has valid folders, embedded identities, independent tokens and actual portraits", () => {
  for (const {actors, folders} of Object.values(packs)) for (const actor of actors) {
    assert.ok(folders.some(folder => folder._id === actor.folder));
    assert.equal(actor.effects.length, 0, "capacities belong to Items, not ActiveEffect");
    assert.equal(actor.prototypeToken.actorLink, false);
    const dimensions = creatureTokenDimensions(actor.system.details.size);
    assert.equal(actor.prototypeToken.width, dimensions.width); assert.equal(actor.prototypeToken.height, dimensions.height);
    assert.ok(existsSync(new URL(`../${actor.img.replace("systems/trudvang-chronicles/", "")}`, import.meta.url)));
    assert.equal(new Set(actor.items.map(item => item._id)).size, actor.items.length);
    for (const item of actor.items) {
      assert.match(item._id, /^[a-zA-Z0-9]{16}$/);
      assert.equal(item._key, `!actors.items!${actor._id}.${item._id}`);
      if (["weapon", "shield"].includes(item.type) && item.system.equipped && weaponType(item) !== "natural") {
        assert.deepEqual(readiedHandConflicts({actor, item}), []);
      }
    }
    assert.ok(actor.system.details.source.book); assert.ok(actor.system.details.source.page > 0);
  }
});

test("bilingual creatures use identical FR-authoritative mechanics, CP capacities and health ranges", () => {
  for (const [index, fr] of packs.fr.actors.entries()) {
    const en = packs.en.actors[index];
    assert.deepEqual(en.system.traits, fr.system.traits, fr.name);
    assert.deepEqual(en.system.skills, fr.system.skills, fr.name);
    assert.equal(en.system.details.bodyMin, fr.system.details.bodyMin);
    assert.equal(en.system.details.bodyMax, fr.system.details.bodyMax);
    assert.deepEqual(resolveCombatPools({actor: adapter(fr)}).pools.map(p => [p.id, p.max, p.current]),
      resolveCombatPools({actor: adapter(en)}).pools.map(p => [p.id, p.max, p.current]));
  }
  const ygg = packs.en.actors.find(a => a.name === "Yggwurm");
  assert.equal(ygg.system.traits.strength, 6, "recent FR corrections also drive the EN compendium");
});

test("Tenace, the separate Huvfurwurm head and movement steps survive bestiary generation", () => {
  const head = packs.fr.actors.find(actor => actor.name === "Tête de huvfurwurm");
  assert.ok(head); assert.ok(ignoresWoundPenalties(head));
  for (const name of ["Aigle", "Faucon"]) {
    const [step] = packs.fr.actors.find(actor => actor.name === name).system.attacks[0];
    assert.deepEqual(step, {action: "movement", mode: "flight", distance: 20, value: 10});
  }
  const minokks = packs.fr.actors.find(a => a.name === "Minokks");
  const corn = minokks.items.find(i => i.name === "Cornes");
  const unarmed = minokks.items.find(i => i.name === "Mains nues");
  assert.equal(corn.system.naturalCombatPool, "natural"); assert.equal(unarmed.system.naturalCombatPoints, 0);
});

test("known tablets and powers carry their full localized cast data and unique embedded ids", () => {
  for (const [index, entry] of BESTIARY_ENTRIES.entries()) for (const code of ["fr", "en"]) {
    const actor = packs[code].actors[index];
    assert.equal(actor.items.filter(item => item.type === "tablet").length, entry.tablets.length);
    for (const reference of entry.tablets) {
      const tablet = actor.items.find(item => item.type === "tablet" && item.system.catalogId === reference.id);
      assert.equal(tablet.system.level, reference.level);
      const powers = actor.items.filter(item => item.system.tabletId === reference.id);
      assert.ok(powers.length);
      assert.ok(powers.every(item => item.system.description && Number.isFinite(item.system.cost)));
    }
  }
});
