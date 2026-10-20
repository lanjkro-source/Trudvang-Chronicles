import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {buildEffectPackDocuments,EFFECT_PACKS} from "../modules/effect-pack-data.mjs";
import {TRANSFORMATION_TEMPLATES} from "../modules/transformation-data.mjs";

test("both effect packs preserve every template, stable bilingual identity, provenance and embedded effect",()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL("../system.json",import.meta.url)));
 let identities;
 for(const {code,packName,label} of EFFECT_PACKS){
  const language=JSON.parse(fs.readFileSync(new URL(`../lang/${code}.json`,import.meta.url)));
  const localize=key=>key.split(".").reduce((o,k)=>o?.[k],language);
  const declared=manifest.packs.find(p=>p.name===packName);
  assert.equal(declared.label,label);assert.equal(declared.type,"Item");
  assert.equal(declared.banner,"systems/trudvang-chronicles/assets/banners/banniere_poings.jpeg");
  const banner=fs.readFileSync(new URL("../assets/banners/banniere_poings.jpeg",import.meta.url));
  assert.deepEqual([...banner.subarray(0,2)],[255,216]);
  const {items}=buildEffectPackDocuments({localize});
  assert.equal(items.length,Object.keys(TRANSFORMATION_TEMPLATES).length);
  if(identities)assert.deepEqual(items.map(i=>i._id),identities);else identities=items.map(i=>i._id);
  for(const item of items){
   const key=item.system.catalogId,t=TRANSFORMATION_TEMPLATES[key];
   assert.equal(item.type,"effect");assert.equal(item.effects.length,1);
   assert.deepEqual(item.effects[0].system.changes,t.changes);
   assert.deepEqual(item.effects[0].statuses,t.statuses);
   assert.equal(item.effects[0].transfer,false);
   assert.equal(item.effects[0].flags[manifest.id].transformation.key,key);
   assert.ok(item.name&&item.system.description&&item.system.source.book&&item.system.source.page);
   const source=new URL(`../packs/_source/${packName}/items/${key.replace(/[^A-Za-z0-9._-]/g,"_")}.json`,import.meta.url);
   assert.deepEqual(JSON.parse(fs.readFileSync(source)),item);
  }
  const reference=new URL(`../game doc/${code}/trudvang-effects-${code}.json`,import.meta.url);
  if(fs.existsSync(reference)){
   const entries=JSON.parse(fs.readFileSync(reference));
   assert.deepEqual(entries.map(e=>e.id),items.map(e=>e._id));
   for(const e of entries)assert.deepEqual(e.changes,TRANSFORMATION_TEMPLATES[e.key].changes);
  }
 }
});
