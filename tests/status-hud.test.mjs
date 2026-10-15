import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";

globalThis.foundry = {
  data: {fields: {}, ActiveEffectTypeDataModel: class {}},
  documents: {ActiveEffect: class {}}
};

const {configureEffects, TrudvangEffectData} = await import("../modules/effects.mjs");

const coreStatusIds = [
  "dead", "unconscious", "sleep", "stun", "prone", "restrain", "paralysis", "fly", "blind", "deaf",
  "silence", "fear", "burning", "frozen", "shock", "corrode", "bleeding", "disease", "poison", "curse",
  "regen", "degen", "hover", "burrow", "upgrade", "downgrade", "invisible", "target", "eye", "bless",
  "fireShield", "coldShield", "magicShield", "holyShield"
];
const hiddenStatusIds = ["shock", "corrode", "regen", "degen", "fireShield", "coldShield", "holyShield"];

function configureWith(statusEffects) {
  globalThis.CONFIG = {
    ActiveEffect: {dataModels: {}, typeLabels: {}, typeIcons: {}},
    time: {},
    statusEffects
  };
  configureEffects();
}

test("native and system ActiveEffects share the Trudvang model and default sheet", () => {
  configureWith({});
  assert.equal(CONFIG.ActiveEffect.dataModels.base, TrudvangEffectData);
  assert.equal(CONFIG.ActiveEffect.dataModels.effect, TrudvangEffectData);
  const entrypoint = readFileSync(new URL("../trudvang.mjs", import.meta.url), "utf8");
  assert.match(entrypoint, /registerSheet\(foundry\.documents\.ActiveEffect, "trudvang-chronicles", TrudvangEffectSheet, \{\s*types: \["base", "effect"\],\s*makeDefault: true/);
});

test("only the seven requested statuses disappear from the manual Token HUD choices", () => {
  const definitions = Object.fromEntries(coreStatusIds.map(id => [id, {
    id, name: `EFFECT.${id}`, img: `icons/svg/${id}.svg`
  }]));
  definitions.moduleStatus = {id: "moduleStatus", hud: {actorTypes: ["npc"]}};
  const originals = new Map(Object.entries(definitions));
  const before = structuredClone(definitions);

  configureWith(definitions);

  assert.strictEqual(CONFIG.statusEffects, definitions, "the status registry must not be replaced");
  assert.ok(Object.keys(before).every(id => definitions[id]), "no existing status definition may be deleted");
  assert.deepEqual(Object.values(definitions).filter(status => coreStatusIds.includes(status.id) && status.hud === false).map(status => status.id),
    hiddenStatusIds);
  for (const [id, original] of originals) {
    assert.strictEqual(definitions[id], original, `${id}: keep the definition available to ActiveEffects`);
    assert.deepEqual(definitions[id], hiddenStatusIds.includes(id) ? {...before[id], hud: false} : before[id],
      `${id}: only the requested HUD visibility may change`);
  }
  assert.notEqual(definitions.magicShield.hud, false, "the magic shield shortcut must remain visible");
});

test("hiding a shortcut preserves effect data and tolerates missing status definitions", () => {
  const definition = {
    id: "regen", img: "icons/svg/regen.svg", statuses: ["regen"],
    duration: {value: 3, units: "rounds"},
    system: {changes: [{key: "system.modifiers.protection", type: "add", value: "1"}]}
  };
  const before = structuredClone(definition);
  configureWith({regen: definition});
  assert.deepEqual(definition, {...before, hud: false}, "effect statuses, icon, duration and modifiers stay intact");
  configureEffects();
  assert.deepEqual(definition, {...before, hud: false}, "reapplying configuration must be harmless");
  assert.doesNotThrow(() => configureWith({}), "a status removed by another package must not break initialization");
});
