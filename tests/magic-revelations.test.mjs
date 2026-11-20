import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {magicRevelation} from "../modules/magic-revelations.mjs";
import {POWER_DETAILS_BY_ID} from "../modules/power-catalog-data.mjs";
import {TRANSFORMATIONS_BY_SOURCE} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";

const translations=Object.fromEntries(["fr","en"].map(lang=>[lang,JSON.parse(readFileSync(`lang/${lang}.json`,"utf8"))]));
const language=lang=>{
  const localize=key=>key.split(".").reduce((parent,part)=>parent[part],translations[lang]);
  return {lang,localize,format:(key,data)=>localize(key).replace(/\{(\w+)\}/g,(_match,field)=>data[field])};
};
const attitude="holy-gerbanis-wisdom-of-windinna:sixth-sense:1";
const sun="holy-tenetnid-tablet-of-the-sun:";
const trace="vitner-vitner-craft:trace-vitner:7";
const reading=["vitner-power-of-vision:read-vitner:6","holy-joaringfaith-sight-of-lekaba:read-powers:5"];

test("revelations use the invocation's own range and all three vision horizons",()=>{
  const fr=language("fr"),en=language("en");
  assert.match(magicRevelation({sourceId:attitude},fr),/contact/);
  assert.match(magicRevelation({sourceId:attitude,countsById:{[attitude+":0"]:2}},fr),/10\s+mètres/);
  for(const [power,unit] of [["augury:2","hours"],["omen:4","days"],["portent:8","weeks"]]){
    const sourceId=sun+power;
    const text=magicRevelation({sourceId,countsById:{[sourceId+":0"]:2}},en);
    assert.match(text,new RegExp("3\\s+"+unit));
  }
});

test("trace combines elapsed units and preserves the existing tests for all three readings",()=>{
  const fr=language("fr");
  const countsById=Object.fromEntries([1,1,1,2,1].map((count,i)=>[trace+":"+i,count]));
  const text=magicRevelation({sourceId:trace,countsById},fr);
  assert.match(text,/40\s+mètres/);
  assert.match(text,/1\s+semaine, 1\s+jour et 2\s+heures/);
  for(const id of [trace,...reading]){
    assert.ok(RULE_TESTS_BY_CATALOG_ID[id]?.length);
    assert.match(magicRevelation({sourceId:id},fr),/test de situation/);
  }
});

test("revelations are tracked separately from lasting effects and unsupported sources have no instruction",()=>{
  const ids=Object.keys(POWER_DETAILS_BY_ID).filter(id=>POWER_DETAILS_BY_ID[id].revelation);
  assert.deepEqual(ids.sort(),[attitude,sun+"augury:2",sun+"omen:4",sun+"portent:8",trace,...reading].sort());
  for(const id of ids)assert.equal(TRANSFORMATIONS_BY_SOURCE[id],undefined);
  assert.equal(magicRevelation({sourceId:"unknown"},language("fr")),"");
});
