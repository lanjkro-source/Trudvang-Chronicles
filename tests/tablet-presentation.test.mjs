import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {TABLET_CATALOG, powerItemData, sortTabletPowers, tabletItemData} from "../modules/tablet-catalog.mjs";
import {affinityState, tabletAffinity, VITNER_TABLET_AFFINITIES} from "../modules/rules/tablet-affinity.mjs";
import {POWER_DETAILS_BY_ID} from "../modules/power-catalog-data.mjs";

const english = JSON.parse(readFileSync(new URL("../lang/en.json", import.meta.url), "utf8"));
const french = JSON.parse(readFileSync(new URL("../lang/fr.json", import.meta.url), "utf8"));
const lookup = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const resolvers = language => ({
  isFrench: () => language === "fr",
  localize: (key, fallback = "") => lookup(language === "fr" ? french : english, key) ?? fallback,
  format: (key, data) => String(lookup(language === "fr" ? french : english, key) ?? key)
    .replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "")
});

test("all 58 tablets ship bilingual summaries and full descriptions", () => {
  assert.equal(TABLET_CATALOG.length, 58);
  for (const tablet of TABLET_CATALOG) {
    for (const language of ["en", "fr"]) {
      const data = tabletItemData(tablet, resolvers(language));
      assert.ok(data.system.summary?.length > 10, `${tablet.id} ${language} summary`);
      assert.ok(data.system.description?.length > 10, `${tablet.id} ${language} description`);
    }
  }
});

test("all 394 powers ship descriptions and French-authoritative power levels in both languages", () => {
  const powers = TABLET_CATALOG.flatMap(tablet => tablet.powers.map(power => ({tablet, power})));
  assert.equal(powers.length, 394);
  for (const {tablet, power} of powers) {
    for (const language of ["en", "fr"]) {
      const data = powerItemData(power, tablet, resolvers(language)).system;
      assert.ok(data.description && data.summary, `${power.id} ${language} description and summary`);
      assert.equal(data.powerLevels.length, POWER_DETAILS_BY_ID[power.id].powerLevels.length);
      assert.ok(data.powerLevels.every(level => level.effect && Number.isInteger(level.cost)), `${power.id} ${language} options`);
      assert.ok(data.spellType && typeof data.duration === "string" && typeof data.range === "string", `${power.id} ${language} fields`);
    }
    const details = POWER_DETAILS_BY_ID[power.id];
    for (const language of ["en", "fr"]) {
      const levels = lookup(language === "fr" ? french : english, `TRUDVANG.Content.Power.${power.id}.PowerLevels`);
      assert.deepEqual(Object.keys(levels), details.powerLevels.map((_, index) => String(index)), `${power.id} ${language} option keys`);
    }
  }
});

test("reordered and missing English improvements use the French order and costs", () => {
  const called = POWER_DETAILS_BY_ID["vitner-animal-vitner:call-on-animals:2"];
  assert.deepEqual(called.powerLevels.map(level => level.cost), [1, 6, 4, 1]);
  const vision = POWER_DETAILS_BY_ID["holy-gerbanis-power-of-enken:night-vision:0"];
  assert.deepEqual(vision.powerLevels.map(level => level.cost), [1, 6, 3]);
  assert.equal(english.TRUDVANG.Content.Power["holy-gerbanis-power-of-enken:night-vision:0"].PowerLevels["1"],
    "Increase the power's duration by 1 day");
  assert.equal(english.TRUDVANG.Content.Power["vitner-animal-vitner:messenger:0"].PowerLevels["2"],
    "Increase the distance the message can travel by 10 kilometers");
  assert.equal(french.TRUDVANG.Content.Power["holy-gerbanis-wisdom-of-windinna:steel-mind:3"].Name,
    "Esprit d’acier");
  assert.equal(french.TRUDVANG.Content.Power["holy-gerbanis-wisdom-of-windinna:joy-of-creating:2"].Name,
    "Joie de la création");
});

test("repaired English entries describe their own power, not a neighboring power or contents page", () => {
  const entries = english.TRUDVANG.Content.Power;
  assert.match(entries["vitner-wind-craft:storm:8"].Description, /violent storm/i);
  assert.doesNotMatch(entries["vitner-wind-craft:storm:8"].Description, /sacred aura/i);
  assert.match(entries["vitner-perceiving:orientation:3"].Description, /cardinal directions/i);
  assert.match(entries["vitner-power-of-thought:fear:3"].Description, /Fear Points/i);
  assert.match(entries["holy-ealdtradition-halawen-s-offering:bolgemek:4"].Description, /sacred spear/i);
  assert.doesNotMatch(entries["holy-ealdtradition-halawen-s-offering:bolgemek:4"].Description, /3: Witch Wall/i);
});

test("Thuul rune entries do not masquerade as ordinary divine spending", () => {
  const tablet = TABLET_CATALOG.find(entry => entry.id === "holy-thuuldom-healing-rune");
  const rune = powerItemData(tablet.powers[0], tablet, resolvers("fr")).system;
  assert.equal(rune.isRune, true);
  assert.equal(rune.cost, 0);
  assert.ok(rune.dailyActivation);
});

test("character magic lists follow power levels and canonical order within a level", () => {
  const tablet = TABLET_CATALOG.find(entry => entry.id === "vitner-flame-craft");
  const [first, second] = tablet.powers.filter(power => power.level === 1);
  const powers = [
    {name: "Éruption de flammes", system: {level: 3, catalogId: "vitner-flame-craft:flame-burst:3"}},
    {name: second.name, system: {level: 1, catalogId: second.id}},
    {name: "Main brûlante", system: {level: 2, catalogId: "vitner-flame-craft:burning-hand:2"}},
    {name: first.name, system: {level: 1, catalogId: first.id}}
  ];
  const sorted = sortTabletPowers(powers, tablet.id);
  assert.deepEqual(sorted.map(power => power.system.level), [1, 1, 2, 3]);
  assert.deepEqual(sorted.slice(0, 2).map(power => power.system.catalogId), [first.id, second.id]);
  assert.equal(powers[0].system.level, 3, "sorting leaves the actor's item collection untouched");
});

test("Vitner tablets carry the Swedish name, negation, and the same affinity in both languages", () => {
  assert.equal(Object.keys(VITNER_TABLET_AFFINITIES).length, 14);
  for (const tablet of TABLET_CATALOG) {
    const en = tabletItemData(tablet, resolvers("en")).system;
    const fr = tabletItemData(tablet, resolvers("fr")).system;
    assert.deepEqual(en.affinity, fr.affinity);
    if (tablet.tabletType === "vitner") {
      assert.ok(en.swedishName);
      assert.equal(en.swedishName, fr.swedishName);
      assert.ok(en.negation && fr.negation);
      assert.deepEqual(en.affinity, tabletAffinity(tablet.id));
    } else {
      assert.equal(en.swedishName, "");
      assert.equal(en.negation, "");
    }
  }
  assert.equal(tabletItemData(TABLET_CATALOG.find(tablet => tablet.id === "vitner-water-craft"), resolvers("fr")).system.swedishName, "Vannkraftla");
});

test("affinity levels map to favorable, neutral, unfavorable, and doubled theme states", () => {
  assert.deepEqual([-1, 0, 1, 2].map(affinityState), ["favorable", "neutral", "unfavorable", "doubled"]);
  assert.deepEqual(tabletAffinity("vitner-vitner-craft"), {hvitavitner: -1, vaagrivitner: 0, morkvitner: 2});
});
