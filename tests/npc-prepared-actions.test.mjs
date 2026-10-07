import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {buildBestiaryPackDocuments} from "../modules/bestiary-pack-data.mjs";
import {resolveNpcPreparedAction, npcPreparedActionRows} from "../modules/rules/npc-prepared-actions.mjs";
import {resolveEquipment} from "../modules/rules/equipment-resolver.mjs";
import {magicCapacities, creatureMagicTraits} from "../modules/rules/magic-capacity.mjs";

function language(code) {
  const lang = JSON.parse(readFileSync(new URL(`../lang/${code}.json`, import.meta.url), "utf8"));
  const localize = key => key.split(".").reduce((value, part) => value?.[part], lang) ?? key;
  return {code, localize, format: (key, data) => localize(key).replace(/\{(\w+)\}/g, (_, key) => data[key] ?? ""),
    isFrench: () => code === "fr", strict: true};
}

const adapter = source => {
  const actor = {...structuredClone(source), isInActiveCombat: true,
    getSkillValue: key => source.system.skills[key]?.value ?? 1,
    findRuleKnowledge: id => {
      const row = source.system.skillTree.find(row => row.catalogId === id);
      return row ? {name: row.name, system: {level: row.value}} : null;
    }};
  for (const item of actor.items) {
    item.id = item._id;
    if (item.type === "weapon") item.system.weaponActions ??= 4;
    if (item.type === "shield") item.system.weaponActions ??= 2;
  }
  actor.getWeaponActionState = item => ({current: resolveEquipment({item, actor}).characteristics.weaponActions.value});
  return actor;
};

test("every prepared action in both bestiaries resolves to an actual weapon or supported manoeuvre", () => {
  for (const code of ["fr", "en"]) {
    const {actors} = buildBestiaryPackDocuments(language(code));
    for (const actor of actors.map(adapter)) for (const combo of actor.system.attacks) for (const row of combo) {
      const action = resolveNpcPreparedAction(actor, row);
      assert.ok(action.supported, `${code}/${actor.name}/${row.attack}`);
      if (action.item) assert.ok(["weapon", "shield"].includes(action.item.type));
      assert.equal(action.points, row.value, "book costs are CP, not a value to be doubled");
      if (["glima", "grapple"].includes(action.action)) {
        assert.equal(row.value % 2, 0);
        assert.ok(action.resolution.eligible.every(pool => ["free", "unarmedFighting", "wrestling"].includes(pool.id)));
      }
      if (action.action === "movement") assert.notEqual(action.movementMode, "");
    }
  }
});

test("stable IDs survive a renamed weapon and usage colors belong to individual combination steps", () => {
  const options = language("fr");
  const actor = adapter(buildBestiaryPackDocuments(options).actors.find(actor => actor.name === "Minokks"));
  const row = actor.system.attacks.flat().find(row => row.itemId);
  actor.items.find(item => item.id === row.itemId).name = "Renamed weapon";
  assert.equal(resolveNpcPreparedAction(actor, row).name, "Renamed weapon");
  actor.system.usedPreparedActions = ["0:1"];
  const combinations = npcPreparedActionRows(actor, options);
  assert.equal(combinations[0].actions[0].used, false);
  assert.equal(combinations[0].actions[1].used, true);
  assert.match(combinations[0].actions[1].tooltip, /Déjà utilisée/);
});

test("availability observes each hand, remaining natural reserve, readiness and weapon actions", () => {
  const actor = adapter(buildBestiaryPackDocuments(language("fr")).actors.find(actor => actor.name === "Minokks"));
  const weapon = actor.items.find(item => item.type === "weapon" && item.system.combatSpecialty !== "natural");
  const row = {attack: weapon.name, itemId: weapon.id, value: 0};
  weapon.system.equipped = false;
  assert.equal(resolveNpcPreparedAction(actor, row).canUse, false);
  weapon.system.equipped = true;
  actor.getWeaponActionState = () => ({current: 0});
  assert.equal(resolveNpcPreparedAction(actor, row).hasActions, false);
  actor.getWeaponActionState = () => ({current: 4});
  weapon.system.hand = "offHand";
  actor.system.combatPools.free.weaponSpent = 5;
  actor.system.combatPools.free.offHandSpent = 2;
  const action = resolveNpcPreparedAction(actor, row);
  assert.equal(action.resolution.freeScope, "offHand");
  const free = action.resolution.eligible.find(pool => pool.id === "free");
  assert.equal(free.current, free.max - 2);
  assert.equal(resolveNpcPreparedAction(actor, {...row, value: action.available + 1}).canUse, false);
});

test("magical bestiary reserves are initialized by the same skill and feat formula as the runtime", () => {
  for (const code of ["fr", "en"]) {
    const actors = buildBestiaryPackDocuments(language(code)).actors;
    let casters = 0, innate = 0;
    for (const actor of actors) {
      const feats = creatureMagicTraits(actor.items);
      const capacity = magicCapacities({skill: key => actor.system.skills[key]?.value ?? 0,
        level: id => actor.system.skillTree.find(row => row.catalogId === id)?.value ?? 0, vitnerBonus: feats.vitnerBonus});
      if (capacity.vitner !== null) {
        casters += 1;
        assert.deepEqual(actor.system.resources.vitner, {value: capacity.vitner, max: capacity.vitner});
      }
      if (feats.unlimitedVitner) innate += 1;
    }
    assert.equal(casters, 6); assert.equal(innate, 1);
    const wight = actors.find(actor => creatureMagicTraits(actor.items).vitnerBonus === 10);
    assert.equal(wight.system.resources.vitner.max, 61);
  }
});
