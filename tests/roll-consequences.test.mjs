import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import Handlebars from "handlebars";

for (const language of ["fr", "en"]) {
  test(`${language}: actual roll card renders only the localized consequence of its outcome`, () => {
    const locale = JSON.parse(readFileSync(new URL(`../lang/${language}.json`, import.meta.url), "utf8"));
    const handlebars = Handlebars.create();
    handlebars.registerHelper("localize", (key, options) => {
      const text = key.split(".").reduce((value, part) => value?.[part], locale);
      assert.equal(typeof text, "string", `Missing translation: ${key}`);
      return text.replace(/\{(\w+)\}/g, (_, name) => options.hash[name] ?? "");
    });
    handlebars.registerHelper("concat", (...args) => args.slice(0, -1).join(""));
    handlebars.registerHelper("eq", (a, b) => a === b);
    const render = handlebars.compile(readFileSync(new URL("../templates/chat/roll-card.hbs", import.meta.url), "utf8"));
    for (const success of [true, false]) {
      const html = render({success, successConsequence: "Consequence A", failureConsequence: "Consequence B"});
      assert.match(html, success ? /Consequence A/ : /Consequence B/);
      assert.doesNotMatch(html, success ? /Consequence B/ : /Consequence A/);
      assert.doesNotMatch(html, /TRUDVANG\./);
    }
  });
}
