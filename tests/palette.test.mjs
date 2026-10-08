import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {applyPalette, PALETTES} from "../modules/palette.mjs";

const cssName = key => `--trudvang-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;

test("every palette applies all roles under the CSS names used by the interface", t => {
  const previousDocument = globalThis.document;
  const applied = new Map();
  globalThis.document = {documentElement: {style: {setProperty: (name, value) => applied.set(name, value)}}};
  t.after(() => { globalThis.document = previousDocument; });

  for (const [id, palette] of Object.entries(PALETTES)) {
    applied.clear();
    applyPalette(id);
    assert.deepEqual(applied, new Map(Object.entries(palette).map(([key, value]) => [cssName(key), value])));
  }
});

test("system window CSS uses palette roles rather than fixed colors", () => {
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  const defaults = css.match(/^:root\s*\{([^}]*)\}/)?.[1];
  assert.ok(defaults, "the default palette must be declared in :root");

  const roles = new Set(Object.keys(PALETTES.default).map(cssName));
  const usedRoles = new Set(css.match(/--trudvang-[a-z-]+/g) ?? []);
  assert.deepEqual([...usedRoles].filter(role => !roles.has(role)), []);
  assert.deepEqual([...roles].filter(role => !defaults.includes(`${role}:`)), []);
  assert.doesNotMatch(css.slice(css.indexOf("}") + 1), /#[\da-f]{3,8}\b|rgba?\s*\(/i);
});

test("power-description tables use readable palette colors in every theme", () => {
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  assert.match(css, /\.item-description table :is\(th, td, p, span\)\s*\{\s*color:\s*var\(--trudvang-on-header\)/);
  const luminance = hex => {
    const [red, green, blue] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };
  for (const [name, palette] of Object.entries(PALETTES)) {
    for (const background of [palette.header, palette.headerAlt]) {
      const light = luminance(palette.onHeader), dark = luminance(background);
      assert.ok((Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05) >= 4.5,
        `${name} table contrast is too low`);
    }
  }
});

test("damage confirmation uses high-contrast palette text on its own dark window and breakdown", () => {
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  assert.match(css, /\.damage-roll-window \.window-content\s*\{[^}]*color: var\(--trudvang-on-header\); background: var\(--trudvang-header\)/);
  assert.match(css, /\.damage-roll-dialog \.damage-roll-breakdown small\s*\{[^}]*color: var\(--trudvang-on-header-muted\)/);
  const luminance = hex => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  for (const [id, palette] of Object.entries(PALETTES)) {
    for (const foreground of [palette.onHeader, palette.onHeaderMuted]) {
      for (const background of [palette.header, palette.headerAlt]) {
        const a = luminance(foreground), b = luminance(background);
        assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${id}: damage dialog contrast`);
      }
    }
  }
});

test("combat final skill value uses a distinct readable theme accent in every palette", () => {
  const css = readFileSync(new URL("../styles/trudvang.css", import.meta.url), "utf8");
  assert.match(css, /\.combat-final-target\s*\{[^}]*color: color-mix\(in srgb, var\(--trudvang-accent\) 85%, var\(--trudvang-ink\)\); background: var\(--trudvang-paper-light\)/);
  assert.match(css, /\.combat-final-target strong\s*\{[^}]*color: inherit/);
  const rgb = hex => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const luminance = rgb => rgb.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  for (const [id, palette] of Object.entries(PALETTES)) {
    const ink = rgb(palette.ink);
    const accent = rgb(palette.accent).map((value, index) => value * .85 + ink[index] * .15);
    const a = luminance(accent), b = luminance(rgb(palette.paperLight));
    assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${id}: combat final value contrast`);
  }
});
