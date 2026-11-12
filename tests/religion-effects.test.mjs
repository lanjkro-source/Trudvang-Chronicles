import assert from "node:assert/strict";
import {test} from "node:test";
import {syncReligionEffects} from "../modules/religion-effects.mjs";

function makeActor({religionId = "ealdTradition", effects = []} = {}) {
  const created = [];
  const updated = [];
  const actor = {
    type: "character",
    inCompendium: false,
    persisted: true,
    effects,
    canUserModify: () => true,
    get selectedReligion() {
      return religionId ? {id: religionId, label: "Ancienne Tradition", specialty: "bruid"} : null;
    },
    createTrudvangEffect: async (data, options = {}) => {
      created.push({data, options});
      const effect = {
        id: `fx-${created.length}`,
        _id: `fx-${created.length}`,
        name: data.name,
        system: {...data.system},
        flags: data.flags,
        duration: data.duration,
        disabled: false,
        update: async changes => {
          updated.push(changes);
          if (changes.disabled !== undefined) effect.disabled = changes.disabled;
        },
        delete: async () => {}
      };
      effects.push(effect);
      return effect;
    }
  };
  return {actor, created, updated};
}

test("syncReligionEffects adds both permanent marks at degree 0 to an Ancienne Tradition follower", async () => {
  const previous = globalThis.game;
  globalThis.game = {user: {id: "gm", isGM: true}, actors: [], scenes: [], i18n: {localize: key => key}};
  try {
    const {actor, created} = makeActor({religionId: "ealdTradition", effects: []});
    const changed = await syncReligionEffects(actor);
    assert.equal(changed, true);
    assert.equal(created.length, 2, "both marks are created");
    const ids = new Set(created.map(row => row.data.system.stackId));
    assert.ok(ids.has("trudvang-serment-de-sang"));
    assert.ok(ids.has("trudvang-parjure"));
    for (const {data} of created) {
      assert.equal(data.system.degree, 0, "added at degree 0");
      assert.equal(data.system.stacking, "stack");
      assert.equal(data.flags?.["trudvang-chronicles"]?.permanent, true);
      assert.equal(data.duration.value, null, "the mark never expires");
      const change = data.system.changes.find(c => c.key === "system.modifiers.bodyMax");
      assert.ok(change, "the mark reduces the maximum Body Points");
      assert.equal(change.type, "add");
      assert.equal(change.value, "-1");
    }
  } finally {
    globalThis.game = previous;
  }
});

test("syncReligionEffects is idempotent and never resets a degree the GM raised", async () => {
  const previous = globalThis.game;
  globalThis.game = {user: {id: "gm", isGM: true}, actors: [], scenes: [], i18n: {localize: key => key}};
  try {
    const existing = {id: "fx-1", system: {stackId: "trudvang-serment-de-sang", degree: 3}, disabled: false, update: async () => {}};
    const {actor, created, updated} = makeActor({religionId: "ealdTradition", effects: [existing]});
    const changed = await syncReligionEffects(actor);
    assert.equal(changed, true, "the missing mark is still added");
    assert.equal(created.length, 1, "only the missing mark is created");
    assert.equal(created[0].data.system.stackId, "trudvang-parjure");
    assert.equal(created[0].data.system.degree, 0);
    assert.equal(updated.length, 0, "an existing mark is left untouched");
    assert.equal(existing.system.degree, 3, "the raised degree survives");
  } finally {
    globalThis.game = previous;
  }
});

test("syncReligionEffects re-enables a disabled permanent mark", async () => {
  const previous = globalThis.game;
  globalThis.game = {user: {id: "gm", isGM: true}, actors: [], scenes: [], i18n: {localize: key => key}};
  try {
    let disabled = true;
    const effect = {id: "fx-1", system: {stackId: "trudvang-parjure", degree: 0}, disabled: true,
      update: async changes => { if (changes.disabled !== undefined) disabled = changes.disabled; }};
    const {actor} = makeActor({religionId: "ealdTradition", effects: [effect]});
    await syncReligionEffects(actor);
    assert.equal(disabled, false, "a disabled mark is enabled again");
  } finally {
    globalThis.game = previous;
  }
});

test("syncReligionEffects revives an expired mark instead of duplicating it", async () => {
  const previous = globalThis.game;
  globalThis.game = {user: {id: "gm", isGM: true}, actors: [], scenes: [], i18n: {localize: key => key}};
  try {
    const updates = [];
    const effect = {id: "fx-1", system: {stackId: "trudvang-serment-de-sang", degree: 2}, disabled: false,
      duration: {value: 1, units: "rounds", expired: true},
      update: async changes => { updates.push(changes); }};
    const {actor, created} = makeActor({religionId: "ealdTradition", effects: [effect]});
    const changed = await syncReligionEffects(actor);
    assert.equal(changed, true);
    assert.equal(created.length, 1, "only the missing mark is created");
    assert.equal(created[0].data.system.stackId, "trudvang-parjure");
    assert.equal(updates.length, 1, "the expired mark is revived");
    assert.equal(updates[0].duration?.expired, false);
    assert.equal(updates[0].duration?.value, null, "a permanent mark never expires");
    assert.equal(effect.system.degree, 2, "the raised degree survives the revival");
  } finally {
    globalThis.game = previous;
  }
});

test("syncReligionEffects leaves actors of other religions alone", async () => {
  const previous = globalThis.game;
  globalThis.game = {user: {id: "gm", isGM: true}, actors: [], scenes: [], i18n: {localize: key => key}};
  try {
    const {actor, created} = makeActor({religionId: "thuuldom", effects: []});
    const changed = await syncReligionEffects(actor);
    assert.equal(changed, false);
    assert.equal(created.length, 0);

    const {actor: none, created: noneCreated} = makeActor({religionId: null, effects: []});
    assert.equal(await syncReligionEffects(none), false);
    assert.equal(noneCreated.length, 0);
  } finally {
    globalThis.game = previous;
  }
});
