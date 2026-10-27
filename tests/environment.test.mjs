import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {environmentConditions, environmentActorValues, environmentCardLines, environmentCardView, normalizeEnvironment, ENVIRONMENT_OPTIONS, environmentKey} from "../modules/rules/environment.mjs";
import Handlebars from "handlebars";
import {migrateEffectReapplicationDefaults} from "../modules/content-importer.mjs";

test("environment reproduces the p302 travel/weather/sleep penalties and doubles only missing required clothing", () => {
  const data = {travel: "horse", temperature: "freezing", temperatureClothing: false, precipitation: "rain", precipitationClothing: false, wind: "storm", sleep: "sleepless"};
  const result = environmentConditions(data);
  assert.equal(result.negative, -12, "horse -2, freezing -4, rain -2, storm -2, sleep -2");
  assert.equal(result.frostbite, 6);
  assert.equal(environmentConditions({...data, temperatureClothing: true, precipitationClothing: true}).negative, -9);
  assert.equal(environmentConditions({precipitation: "heavySnow", precipitationClothing: false}).negative, -3, "no clothing is required by the snow row");
  assert.equal(normalizeEnvironment({environment: "unknown", wind: "__proto__"}).wind, "none");
});

test("comfort offsets environmental fatigue but cannot turn it into a net bonus or cancel unrelated penalties", () => {
  const comforts = {precipitation: "beautiful", sleep: "refreshing", meal: true, clean: true, rest: true, goal: true};
  const fresh = environmentActorValues({}, comforts);
  assert.equal(fresh.favorable, 7); assert.equal(fresh.mitigation, 0); assert.equal(fresh.modifier, 0);
  const actor = {findRuleKnowledge: () => ({system: {level: 2}}), effects: [{system: {stackId: "trudvang-fatigued", potency: 3}}, {system: {stackId: "trudvang-hungry", potency: 5}}]};
  const values = environmentActorValues(actor, comforts);
  assert.equal(values.mitigation, 3, "fatigue can be offset; hunger cannot");
  assert.equal(values.weathered, 4);
  assert.equal(values.modifier, 7, "+3 offsets existing fatigue and Weathered contributes +4");
  assert.equal(environmentActorValues(actor, {temperature: "hrim", travel: "foot"}).modifier, 0, "-4 conditions and +4 Weathered; existing fatigue is already in actor roll effects");
});

test("every selectable condition and its requirement has bilingual text, with one published line per choice", () => {
  for (const locale of ["fr", "en"]) {
    const language = JSON.parse(readFileSync(new URL(`../lang/${locale}.json`, import.meta.url)));
    const localize = key => key.split(".").reduce((value, part) => value?.[part], language);
    for (const [field, choices] of Object.entries(ENVIRONMENT_OPTIONS)) for (const [id, [, clothing]] of Object.entries(choices)) {
      assert.equal(typeof localize(environmentKey(`options.${field}.${id}`)), "string");
      if (clothing) assert.equal(typeof localize(environmentKey(`clothing.${clothing}`)), "string");
    }
    const lines = environmentCardLines({environment: "sea", travel: "foot", temperature: "cool", temperatureClothing: false, meal: true}, localize);
    assert.equal(lines.length, 3, "only foot, cool and meal have nonzero modifiers");
    assert.ok(lines.every(line => typeof line === "string" && !line.includes("undefined")));
  }
});

test("compact environment card keeps the requested order, total and conditional italic frostbite note after updates", () => {
  const language = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url)));
  const localize = key => key.split(".").reduce((value, part) => value?.[part], language);
  const view = environmentCardView({environment: "forest", travel: "foot", temperature: "freezing", temperatureClothing: false, sleep: "refreshing", meal: true}, localize);
  assert.equal(view.title, "Jet d’environnement - forêt");
  assert.deepEqual(view.environmentLines, ["À pied : −1", "Gel (mal vêtu) : −4", "Sommeil : +2", "Repas : +1"]);
  assert.equal(view.environmentTotal, "−2");
  assert.equal(view.environmentFrostbite, "Risque de dégâts de gelure : 4");
  const hbs = Handlebars.create(); hbs.registerHelper("localize", localize);
  const render = hbs.compile(readFileSync(new URL("../templates/chat/trait-situation-request-card.hbs", import.meta.url), "utf8"));
  const html = render({...view, environment: true, gmName: "Not displayed", gmImg: "portrait.png"});
  assert.ok(!html.includes("Not displayed")); assert.ok(!html.includes("portrait.png"));
  assert.match(html, /<strong>Total : −2<\/strong>/);
  assert.match(html, /<em>Risque de dégâts de gelure : 4<\/em>/);
  const mild = environmentCardView({precipitation: "beautiful", sleep: "refreshing"}, localize);
  assert.equal(mild.environmentTotal, "0", "the display preserves the existing comfort cap");
  assert.equal(mild.environmentFrostbite, "");
  assert.ok(!render({...mild, environment: true}).includes("environment-note"));
});

test("one-time default migration preserves graded stacks, explicit advanced modes and all active durations", async t => {
  const previous = globalThis.game; t.after(() => {globalThis.game = previous;});
  const updates = [];
  const effect = (id, stacking, type = "effect") => ({id, type, system: {stackId: id, stacking}, duration: {value: 3, units: "days"}, async update(data) {updates.push([id, data]);}});
  const direct = effect("old", "stack"), graded = effect("trudvang-fatigued", "stack"), replace = effect("replace", "replace");
  const worn = effect("worn", "stack", "base"), reference = effect("reference", "stack");
  const actor = {effects: [direct, graded, replace], items: [{effects: [worn]}]};
  globalThis.game = {actors: [actor], items: [{effects: [reference]}], scenes: [{tokens: [{actor}]}]};
  await migrateEffectReapplicationDefaults();
  assert.deepEqual(updates.map(([id]) => id), ["reference", "old", "worn"]);
  assert.ok(updates.every(([, data]) => JSON.stringify(data) === '{"system.stacking":"refresh"}'));
});
