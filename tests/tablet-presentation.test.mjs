import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {TABLET_CATALOG, tabletItemData} from "../modules/tablet-catalog.mjs";
import {affinityState, tabletAffinity, VITNER_TABLET_AFFINITIES} from "../modules/rules/tablet-affinity.mjs";

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
