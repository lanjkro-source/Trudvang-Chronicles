import test from "node:test";
import assert from "node:assert/strict";
import {procedureValues, procedureOutcome} from "../modules/rules/knowledge-procedures.mjs";
import {trainedAnimalValue, trainedAnimalActions} from "../modules/rules/trained-animal-actions.mjs";

test("trained-animal actions use fetch and guard SV tables rather than the training-week counts", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(degree => trainedAnimalValue("fetch", degree)), [3, 6, 9, 12, 15]);
  assert.deepEqual([1, 2, 3, 4, 5].map(degree => trainedAnimalValue("guard", degree)), [10, 12, 14, 16, 18]);
  for (const degree of [0, 6, 1.5, NaN]) assert.equal(trainedAnimalValue("fetch", degree), null);
  assert.deepEqual(trainedAnimalActions({type: "ability", system: {kind: "specialty", catalogId: "riding"}}), ["jump"]);
  assert.deepEqual(trainedAnimalActions({type: "ability", system: {kind: "specialty", catalogId: "custom-specialty-abc"},
    flags: {"trudvang-chronicles": {customSpecialty: {sourceCatalogId: "animalFriend"}}}}), ["fetch", "guard"]);
});
const hunt = {size: 0, terrain: 0, hours: 12, carried: 0, hunters: 1, animal: 0};
test("hunting time, group thresholds and carried bonuses respect the Nature cap", () => {
  assert.equal(procedureValues("hunt", hunt, {skill: 10}).modifier, 6); // 4 time +2 game
  assert.equal(procedureValues("hunt", {...hunt, hunters: 2}, {skill: 10}).modifier, 10);
  assert.equal(procedureValues("hunt", {...hunt, carried: 30}, {skill: 7}).modifier, 9);
  assert.equal(procedureValues("hunt", {...hunt, size: 2, hours: 6}).invalid, true);
  assert.equal(procedureValues("hunt", {...hunt, separate: true}).divisor, 2);
});
test("the hunting table handles equality, insufficient large-game margins and extended bands", () => {
  const outcome = margin => ({success: true, margin});
  assert.equal(procedureOutcome("hunt", hunt, {}, outcome(0)).key, "NoCatch");
  assert.equal(procedureOutcome("hunt", {...hunt, size: 2}, {}, outcome(4)).key, "NoCatch");
  assert.equal(procedureOutcome("hunt", {...hunt, size: 2}, {}, outcome(5)).formula, "3d10+2");
  assert.equal(procedureOutcome("hunt", hunt, {}, outcome(40)).formula, "4d10");
  assert.equal(procedureOutcome("hunt", hunt, {}, outcome(41)).formula, "4d10+4");
  assert.equal(procedureOutcome("hunt", {...hunt, size: 2}, {}, outcome(45)).formula, "8d10+80+32");
});
test("repair perfect success triples restored integrity while a 20 damages the item", () => {
  assert.equal(procedureOutcome("repair", {}, {level: 3}, {success: true, critical: "success"}).amount, 18);
  assert.equal(procedureOutcome("repair", {}, {level: 3}, {success: false}).amount, 0);
  assert.equal(procedureOutcome("repair", {}, {level: 3}, {critical: "failure"}).formula, "1d6");
});
test("saving a dying patient uses negative health; nursing and first aid remain distinct", () => {
  assert.equal(procedureValues("heal", {mode: "save", negative: 7}).modifier, -7);
  assert.equal(procedureValues("heal", {mode: "rest", negative: 7}).modifier, 0);
  assert.equal(procedureOutcome("heal", {mode: "first"}, {level: 4}, {success: true}).amount, 4);
  assert.equal(procedureOutcome("heal", {mode: "rest"}, {level: 4}, {success: true}).key, "Nursing");
});
test("animal training counts successes for each degree independently, including failures", () => {
  assert.deepEqual(procedureOutcome("train", {training: "fetch", stage: 5, completed: 9}, {}, {success: true}),
    {key: "Trained", completed: 10, required: 10});
  assert.equal(procedureOutcome("train", {training: "attack", stage: 5, completed: 9}, {}, {success: false}).completed, 9);
  assert.equal(procedureOutcome("train", {training: "domesticate", completed: 4}, {}, {success: true}).required, 5);
  assert.equal(procedureValues("train", {training: "fetch", stage: 6, completed: 0}).invalid, true);
  assert.equal(procedureValues("hunt", {...hunt, hours: NaN}).invalid, true);
});
