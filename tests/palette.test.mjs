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
