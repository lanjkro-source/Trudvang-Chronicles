import assert from "node:assert/strict";
import test from "node:test";
import {resolveFixedAttackTargets} from "../modules/rules/fixed-attack.mjs";

test("fixed attack target traits reduce the VC and retain actor and token references", () => {
  const actor = {uuid: "Actor.defender", getTraitValue: trait => trait === "dexterity" ? 3 : 0};
  const token = {name: "Défenseur", uuid: "Token.defender", actor};
  const [target] = resolveFixedAttackTargets({baseVC: 12, targetTrait: "dexterity", targets: [token]});
  assert.equal(target.target, 9);
  assert.equal(target.traitValue, 3);
  assert.deepEqual(target.effectTarget, {actorUuid: "Actor.defender", tokenUuid: "Token.defender"});
});

test("a fixed attack with no target keeps its base VC and no effect target", () => {
  const [target] = resolveFixedAttackTargets({baseVC: 12, targetTrait: "dexterity"});
  assert.equal(target.target, 12);
  assert.equal(target.traitValue, 0);
  assert.equal(target.effectTarget, null);
});

test("the none trait leaves every target's fixed VC unchanged", () => {
  const targets = resolveFixedAttackTargets({baseVC: 8, targetTrait: "none", targets: [
    {name: "A", actor: {getTraitValue: () => 5}},
    {name: "B", actor: {getTraitValue: () => -2}}
  ]});
  assert.deepEqual(targets.map(target => target.target), [8, 8]);
});
