import assert from "node:assert/strict";
import test from "node:test";
import {TABLET_CATALOG} from "../modules/tablet-catalog.mjs";
import {familyIconClassForId, POWER_FAMILY_ICON_BY_ID, TABLET_POWER_FAMILIES} from "../modules/tablet-power-families.mjs";
import {powerIconClassForId} from "../modules/power-icons.mjs";

const catalogPowerIds = TABLET_CATALOG.flatMap(tablet => tablet.powers.map(power => power.id));

test("every catalog power belongs to exactly one family with a unique icon per tablet", () => {
  assert.deepEqual(Object.keys(TABLET_POWER_FAMILIES).sort(), TABLET_CATALOG.map(tablet => tablet.id).sort());
  const assigned = new Set();
  let familyCount = 0;
  for (const tablet of TABLET_CATALOG) {
    const families = TABLET_POWER_FAMILIES[tablet.id];
    assert.ok(families?.length, `${tablet.id} has at least one family`);
    const icons = families.map(family => family.icon);
    assert.equal(new Set(icons).size, icons.length, `${tablet.id} family icons are unique`);
    const tabletPowerIds = new Set(tablet.powers.map(power => power.id));
    for (const family of families) {
      familyCount++;
      assert.match(family.icon, /^fa-[a-z0-9-]+$/, `${tablet.id} uses a Font Awesome class`);
      assert.ok(family.powers.length, `${tablet.id} has no empty family`);
      for (const id of family.powers) {
        assert.ok(tabletPowerIds.has(id), `${tablet.id}: ${id} belongs to the tablet`);
        assert.ok(!assigned.has(id), `${id} is assigned to exactly one family`);
        assigned.add(id);
      }
    }
  }
  assert.deepEqual([...assigned].sort(), [...catalogPowerIds].sort());
  assert.equal(TABLET_CATALOG.length, 62);
  assert.equal(catalogPowerIds.length, 428);
  assert.equal(familyCount, 157);
});

test("every catalog power resolves to its family icon in sheets and compendiums", () => {
  assert.equal(POWER_FAMILY_ICON_BY_ID.size, catalogPowerIds.length);
  for (const id of catalogPowerIds) {
    const familyIcon = familyIconClassForId(id);
    assert.ok(familyIcon, `${id} has a family icon`);
    assert.equal(powerIconClassForId(id), familyIcon, `${id} uses its family icon`);
  }
});

test("Solvei and Sille split daily-recovery healing from instant healing", () => {
  const expected = {
    "holy-gerbanis-warmth-of-sunvei": {
      "fa-hand-holding-medical": ["healing:0", "healing-warmth:5", "breath-of-sunvei:7"],
      "fa-sun": ["sunray:1", "summer-place:3", "time-of-the-hunt:6"],
      "fa-heart-pulse": ["healing-glow:2", "firon-power:4", "healing-sun:8"]
    },
    "holy-joaringfaith-power-of-sille": {
      "fa-hand-holding-medical": ["healing:0", "healing-warmth:4", "breath-of-sille:7"],
      "fa-sun": ["sunray:1", "summer-place:2", "time-of-the-hunt:6"],
      "fa-heart-pulse": ["healing-glow:3", "firon-power:5", "healing-sun:8"]
    }
  };
  for (const [tabletId, families] of Object.entries(expected)) {
    for (const [icon, suffixes] of Object.entries(families)) {
      for (const suffix of suffixes) {
        assert.equal(familyIconClassForId(`${tabletId}:${suffix}`), icon, `${tabletId}:${suffix} uses ${icon}`);
      }
    }
  }
});
