/** Generate the entire power catalogue from the two reviewed source JSON files.
 *
 * FR is the rules authority. EN must have the same identities and all mechanical
 * fields; its prose is independent English text. Never infer or repair either
 * source from lang/*.json or from an earlier generated module.
 *
 * Usage: node tools/generate-power-catalog.mjs [--check]
 */
import {readFileSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {englishPowerField} from "./power-source-fields.mjs";
import {validatePowerOptionIdentities,validatePowerTargeting} from "./power-option-identity.mjs";
import {DAMAGE_NATURES,DAMAGE_TYPES,DAMAGE_DELIVERIES,DAMAGE_PROTECTIONS} from "../modules/rules/damage-qualifications.mjs";

const root = process.cwd();
const check = process.argv.includes("--check");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const tabletSources = {
  fr: read("game doc/fr/trudvang-tablets-fr.json"),
  en: read("game doc/en/trudvang-tablets-en.json")
};
const fr = read("game doc/fr/trudvang-powers-fr.json");
const en = read("game doc/en/trudvang-powers-en.json");
const types = new Map([
  ["persistant", ["Lasting", "lasting"]],
  ["soutenu", ["Preserving", "sustained"]],
  ["instantané", ["Instant", "instant"]],
  ["permanent", ["Permanent", "permanent"]]
]);
const fail = message => { throw new Error(`Power catalogue: ${message}`); };
const mapById = (entries, language) => {
  if (entries.length !== 428) fail(`${language}: expected 428 entries, found ${entries.length}`);
  const map = new Map();
  for (const entry of entries) {
    if (!entry.catalogId || map.has(entry.catalogId)) fail(`${language}: missing/duplicate catalogId ${entry.catalogId}`);
    map.set(entry.catalogId, entry);
  }
  return map;
};
const french = mapById(fr, "FR"), english = mapById(en, "EN");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!same([...french.keys()].sort(), [...english.keys()].sort())) fail("FR and EN catalogId sets differ");

// Tablet prose is mastered in each language's tablet source. Resolve each
// tablet through that language's power source so the catalog and compendiums
// always display the same reviewed text as the source JSON.
const tabletsByLanguage = {};
for (const [language, powers] of [["fr", fr], ["en", en]]) {
  const source = tabletSources[language];
  const sourceByName = new Map(source.map(tablet => [tablet.name, tablet]));
  if (sourceByName.size !== source.length) fail(`${language.toUpperCase()} tablet source has duplicate names`);
  const tabletsById = {};
  for (const power of powers) {
    const id = power.catalogId.split(":")[0];
    const tablet = sourceByName.get(power.tablet);
    if (!tablet) fail(`${power.catalogId}: missing tablet "${power.tablet}" in ${language.toUpperCase()} tablet source`);
    const content = {Name: tablet.name, Summary: tablet.summary, Description: tablet.description, Negation: tablet.negation ?? ""};
    if (Object.values(content).some(value => typeof value !== "string") || !content.Name.trim() || !content.Summary.trim() || !content.Description.trim()) {
      fail(`${id}: incomplete ${language.toUpperCase()} tablet source for "${tablet.name}"`);
    }
    if (tabletsById[id] && !same(tabletsById[id], content)) fail(`${id}: powers refer to inconsistent ${language.toUpperCase()} tablet text`);
    tabletsById[id] = content;
  }
  if (Object.keys(tabletsById).length !== source.length) fail(`not every ${language.toUpperCase()} tablet is linked to its power source`);
  tabletsByLanguage[language] = tabletsById;
}

const powerDetails = {};
const powersByTablet = {};
const localized = {fr: {}, en: {}};
let optionCount = 0;
for (const id of [...french.keys()].sort()) {
  const f = french.get(id), e = english.get(id);
  const tabletId = id.split(":")[0];
  const order = Number(id.slice(id.lastIndexOf(":") + 1));
  if (!Number.isInteger(order) || order < 0) fail(`${id}: invalid order suffix`);
  const rune = Boolean(f.isRune);
  const matching = ["level", "cost", "modifier", "swedishName"];
  for (const field of matching) if (!same(e[field] ?? null, f[field] ?? null)) fail(`${id}: EN ${field} differs from FR`);
  if (Boolean(e.isRune) !== rune) fail(`${id}: rune status differs`);
  if (!types.has(f.type) || e.type !== types.get(f.type)[0]) fail(`${id}: EN type does not translate FR type`);
  if (!Number.isInteger(f.source?.page) || !Number.isInteger(e.source?.page)) fail(`${id}: missing source page`);
  for (const field of ["duration", "range", "castingTime"]) {
    if ((e[field] ?? "") !== englishPowerField(f[field])) fail(`${id}: EN ${field} differs from FR mechanics`);
  }
  if (rune && Boolean(e.dailyActivation) !== Boolean(f.dailyActivation)) fail(`${id}: rune daily activation differs`);
  if (!rune && (!Number.isInteger(f.cost) || !Number.isInteger(f.modifier))) fail(`${id}: missing base cost/modifier`);
  if (!Number.isInteger(f.level) || f.level < 1 || f.level > 5) fail(`${id}: invalid power level`);
  if (!Array.isArray(f.powerLevels) || !Array.isArray(e.powerLevels) || f.powerLevels.length !== e.powerLevels.length) {
    fail(`${id}: power-level count differs`);
  }
  validatePowerOptionIdentities(id, f.powerLevels, e.powerLevels);
  validatePowerTargeting(f,e);
  for(const field of ['selfOnly','casterFirstEffects'])if(JSON.stringify(f[field]??null)!==JSON.stringify(e[field]??null))fail(id+': unaligned '+field);
  if(f.selfOnly!==undefined&&typeof f.selfOnly!=='boolean')fail(id+': invalid self-only declaration');
  if(f.selfOnly&&(f.targeting?.groups??[f.targeting]).filter(Boolean).some(g=>g.contactOptionId||g.additionalTargets.length||g.baseTargets!==1))fail(id+': self-only power permits other targets');
  if(f.casterFirstEffects&&(!Array.isArray(f.casterFirstEffects)||f.casterFirstEffects.some(id=>!f.effectTemplates?.some(t=>t.id===id))))fail(id+': invalid caster-first variants');
  if(JSON.stringify(f.damageRoll??null)!==JSON.stringify(e.damageRoll??null))fail(`${id}: EN damage roll differs from FR`);
    if(JSON.stringify(f.damageQualification??null)!==JSON.stringify(e.damageQualification??null))fail(`${id}: EN damage qualification differs from FR`);
    if(f.damageQualification){
      const q=f.damageQualification;
      if(!DAMAGE_NATURES.includes(q.nature)||!DAMAGE_TYPES.includes(q.type)||!DAMAGE_DELIVERIES.includes(q.delivery)||!DAMAGE_PROTECTIONS.includes(q.protection))fail(`${id}: invalid damage qualifications`);
    }
  if(!same(f.purification,e.purification))fail(id+': unaligned purification');
  if(f.purification){
    const {litres,increments,lakeOptionId}=f.purification;
    const hasOption=key=>f.powerLevels.some(p=>p.optionId===key);
    if(!Number.isInteger(litres)||litres<=0||!increments||
      Object.entries(increments).some(([key,value])=>!hasOption(key)||!Number.isInteger(value)||value<=0)||
      (lakeOptionId&&!hasOption(lakeOptionId)))fail(id+': invalid purification capacity');
  }
  if(JSON.stringify(f.spellZone??null)!==JSON.stringify(e.spellZone??null))fail(`${id}: unaligned spell zone`);
  if(f.spellZone?.kind==='fire'&&(!(f.spellZone.radius>0)||!(f.spellZone.radiusStep>0)||!(f.spellZone.range>=0)||typeof f.spellZone.movable!=='boolean'||!Number.isFinite(f.spellZone.visibilityPenalty)||!f.damageRoll))fail(`${id}: invalid fire zone`);
  if(f.spellZone?.kind==='earthquake'&&(!Array.isArray(f.spellZone.sizeModifiers)||f.spellZone.sizeModifiers.length!==7||f.spellZone.sizeModifiers.some(n=>!Number.isFinite(n))||!Number.isFinite(f.spellZone.severityModifier)||!Number.isFinite(f.spellZone.penalty)||!(f.spellZone.radius>0)||!(f.spellZone.range>=0)))fail(`${id}: invalid earthquake profile`);
  if(f.spellZone?.kind==='runeEarthquake'&&(!Array.isArray(f.spellZone.sizeSV)||f.spellZone.sizeSV.length!==7||f.spellZone.sizeSV.some(n=>n!==null&&!Number.isFinite(n))||!Number.isFinite(f.spellZone.levelModifier)||!(f.spellZone.stunRounds>0)||!(f.spellZone.radiusPerLevel>0)||!(f.spellZone.rangePerAdditionalLevel>=0)))fail(`${id}: invalid rune earthquake profile`);
  if(f.spellZone&&!['earthquake','runeEarthquake','fire','fog','darkness','quagmire'].includes(f.spellZone.kind))fail(`${id}: invalid spell zone`);
  const quagmireOptions=['rangeOptionId','radiusOptionId','depthOptionId','durationOptionId','hoursOptionId'];
  if(f.spellZone)for(const key of [...quagmireOptions,'severityOptionId','thicknessOptionId','areaOptionId'])if(f.spellZone[key]&&!f.powerLevels.some(p=>p.optionId===f.spellZone[key]))fail(`${id}: invalid zone option`);
  if(f.spellZone?.kind==='quagmire'&&quagmireOptions.some(key=>!f.spellZone[key]))fail(`${id}: missing quagmire option`);
  if(f.spellZone?.kind==='darkness'){
    const d=f.spellZone;
    if(![d.area,d.areaStep,d.range,d.rangeStep].every(n=>Number.isFinite(n)&&n>0)||!(d.penalty<0)||!(d.nightPenalty>=d.penalty&&d.nightPenalty<=0)||
      !Array.isArray(d.duration)||!d.duration.every(o=>Number.isInteger(o.rounds)&&o.rounds>0&&f.powerLevels.some(p=>p.optionId===o.id)))fail(`${id}: invalid darkness zone`);
  }
  if(f.damageRoll){
    const d=f.damageRoll;
    if(d.requiresAttack!==undefined&&typeof d.requiresAttack!=="boolean")fail(`${id}: invalid attack-only damage`);
    if(d.minimumAfterArmor&&(!Number.isInteger(d.minimumAfterArmor.base)||d.minimumAfterArmor.base<0||!f.powerLevels.some(p=>p.optionId===d.minimumAfterArmor.optionId)))fail(`${id}: invalid minimum after armor`);
    if(d.impact&&(d.impact.kind!=='windKnockback'||d.impact.skill!=='agility'||d.impact.trait!=='strength'||d.impact.damagePenalty!==true))fail(`${id}: invalid impact`);
    if(d.baseRepeatOptionId&&!f.powerLevels.some(p=>p.optionId===d.baseRepeatOptionId))fail(`${id}: invalid base repeat option`);
    if(d.baseTargetOptionId&&!f.powerLevels.some(p=>p.optionId===d.baseTargetOptionId))fail(`${id}: invalid base damage target option`);
    if(d.targetTags&&(!Array.isArray(d.targetTags)||!d.targetTags.length||d.targetTags.some(tag=>typeof tag!=="string"||!tag.trim())||typeof d.targetLabelKey!=="string"))fail(`${id}: invalid damage target restriction`);
    if(d.scaling&&(!f.powerLevels.some(p=>p.optionId===d.scaling.optionId)||!['dice','modifier'].some(k=>Number(d.scaling[k])>0)||['dice','modifier'].some(k=>d.scaling[k]!==undefined&&(!Number.isInteger(d.scaling[k])||d.scaling[k]<0))))fail(`${id}: invalid damage scaling`);
    const q=d.qualification;
    if(!q || !DAMAGE_NATURES.includes(q.nature) || !DAMAGE_TYPES.includes(q.type) || !DAMAGE_DELIVERIES.includes(q.delivery) || !DAMAGE_PROTECTIONS.includes(q.protection))fail(`${id}: invalid damage qualifications`);
    if(!Array.isArray(d.steps)||!d.steps.length||d.steps.some(s=>!/^\d+d(?:3|4|5|6|10)(?:\s*\+\s*\d+)?$/i.test(s.formula)||!Number.isInteger(s.openRoll)||s.openRoll<0||s.openRoll>10)||
      (d.optionId&&!f.powerLevels.some(p=>p.optionId===d.optionId)))fail(`${id}: invalid damage roll`);
  }
  if(JSON.stringify(f.fearRoll??null)!==JSON.stringify(e.fearRoll??null))fail(`${id}: EN fear roll differs from FR`);
  if(f.fearRoll){
    const d=f.fearRoll;
    if(d.area&&(!Number.isFinite(d.area.radius)||d.area.radius<=0||!Number.isFinite(d.area.radiusStep)||d.area.radiusStep<=0||
      !f.powerLevels.some(p=>p.optionId===d.area.radiusOptionId)||(d.area.hostileOnly!==undefined&&typeof d.area.hostileOnly!=='boolean')))fail(`${id}: invalid fear area`);
    if(d.targetLimitOptionId&&!f.powerLevels.some(p=>p.optionId===d.targetLimitOptionId))fail(`${id}: invalid fear target option`);
    if(d.resistance&&(!d.requiresResistance||!Number.isInteger(d.resistance.testIndex)||!f.resist?.[d.resistance.testIndex]||d.resistance.successProfile&&(!Number.isInteger(d.resistance.successProfile.dice)||d.resistance.successProfile.dice<1||![3,4,5,6,10].includes(d.resistance.successProfile.faces)||!Number.isInteger(d.resistance.successProfile.threshold)||!Number.isInteger(d.resistance.successProfile.modifier))))fail(`${id}: invalid fear resistance`);
    if(d.eligibility&&Object.entries(d.eligibility).some(([k,v])=>!['excludeCaster','requiresHearing','intelligentOnly'].includes(k)||typeof v!=='boolean'))fail(`${id}: invalid fear recipients`);
    if(!Array.isArray(d.steps)||!d.steps.length||!f.powerLevels.some(p=>p.optionId===d.optionId)||(d.baseTargetOptionId&&!f.powerLevels.some(p=>p.optionId===d.baseTargetOptionId))||
      d.steps.some(s=>!Number.isInteger(s.dice)||s.dice<1||![3,4,5,6,10].includes(s.faces)||!Number.isInteger(s.threshold)||(s.threshold!==0&&(s.threshold<2||s.threshold>s.faces))||!Number.isInteger(s.modifier))||
      (d.requiresResistance!==undefined&&typeof d.requiresResistance!=='boolean'))fail(`${id}: invalid fear roll`);
  }
  for (let index = 0; index < f.powerLevels.length; index++) {
    const a = f.powerLevels[index], b = e.powerLevels[index];
    if (!Number.isInteger(a.cost) || !same([b.cost, b.maxCount ?? null], [a.cost, a.maxCount ?? null])) {
      fail(`${id}: EN improvement ${index} cost/limit differs from FR`);
    }
    if (!a.effect?.trim() || !b.effect?.trim()) fail(`${id}: empty improvement ${index}`);
    if (a.effect === b.effect && /[À-ÿ]|\b(?:Augmente|Réduit|Affecte|Permet|Ajoute|Invoque|Soigne)\b/u.test(a.effect)) {
      fail(`${id}: EN improvement ${index} still copies French text`);
    }
  }
  if(rune){
    if(JSON.stringify(f.runeActivation)!==JSON.stringify(e.runeActivation))fail(id+': unaligned rune activation');
    const activation=f.runeActivation;
    if(!activation||(!Number.isInteger(activation.daily)&&!Number.isInteger(activation.dailyPerLevel)))fail(id+': missing rune activation limit');
  }
  optionCount += f.powerLevels.length;
  powerDetails[id] = {
    isRune: rune,
    ...(f.runeActivation?{runeActivation:{...f.runeActivation,modifier:f.modifier??0}}:{}),
    ...(f.effectTemplates?.some(t=>t.instant?.rune)?{runeConsequence:f.effectTemplates.find(t=>t.instant?.rune).instant.rune}:{}),
    level:f.level,
    ...(f.selfOnly!==undefined?{selfOnly:f.selfOnly}:{}),
    ...(f.casterFirstEffects?{casterFirstEffects:f.casterFirstEffects}:{}),
    ...(f.purification?{purification:f.purification}:{}),
    ...(f.spellZone?{spellZone:f.spellZone}:{}),
    ...(f.damageRoll ? {damageRoll:f.damageRoll} : {}),
    ...(f.damageQualification ? {damageQualification:f.damageQualification} : {}),
    ...(f.fearRoll ? {fearRoll:f.fearRoll} : {}),
    ...(f.targeting ? {targeting: f.targeting} : {}),
    powerLevels: f.powerLevels.map(level => ({id: level.optionId, cost: level.cost, maxCount: level.maxCount ?? null})),
    spellType: types.get(f.type)[1],
    page: e.source.page,
    pageFr: f.source.page
  };
  const powers = powersByTablet[tabletId] ??= [];
  powers.push({id, name: e.name, level: f.level, type: tabletId.startsWith("vitner-") ? "spell" : "divineFeat",
    cost: rune ? 0 : f.cost, modifier: f.modifier ?? 0, order});
  for (const [language, source] of [["fr", f], ["en", e]]) {
    for (const field of ["name", "description", "summary"]) {
      if (!String(source[field] ?? "").trim()) fail(`${id}: ${language} ${field} is empty`);
    }
    if (language === "en" && /^(?:HOLY\b|TRADITION.S HOLY\b|OF NID.S HOLY\b|\d+: [A-Z][^\n]+ \d+:)/u.test(source.description)) {
      fail(`${id}: English description appears to contain a table of contents instead of the power`);
    }
    localized[language][id] = {
      Name: source.name,
      Summary: source.summary,
      Description: source.description,
      SwedishName: source.swedishName ?? "",
      DamageQualificationNote: source.damageQualificationNote ?? "",
      Duration: source.duration ?? "",
      Range: source.range ?? "",
      CastingTime: source.castingTime ?? "",
      DailyActivation: source.dailyActivation ?? "",
      PowerLevels: Object.fromEntries(source.powerLevels.map((level, index) => [index, level.effect]))
    };
  }
}
for (const [tabletId, powers] of Object.entries(powersByTablet)) {
  powers.sort((a, b) => a.order - b.order);
  if (!same(powers.map(power => power.order), powers.map((_, index) => index))) fail(`${tabletId}: non-contiguous power order`);
  powersByTablet[tabletId] = powers.map(({order, ...power}) => power);
}

const modulePath = resolve(root, "modules/power-catalog-data.mjs");
const moduleText = `// Generated by tools/generate-power-catalog.mjs from game doc/{fr,en}/trudvang-powers-*.json.\n// Do not edit this file directly.\nexport const POWER_DETAILS_BY_ID = ${JSON.stringify(powerDetails, null, 2)};\n\nexport const POWER_CATALOG_BY_TABLET = ${JSON.stringify(powersByTablet, null, 2)};\n`;
const outputs = new Map([[modulePath, moduleText]]);
for (const language of ["fr", "en"]) {
  const path = resolve(root, `lang/${language}.json`);
  const pack = read(`lang/${language}.json`);
  const existingTablets = pack.TRUDVANG.Content.Tablet ?? {};
  for (const [id, content] of Object.entries(tabletsByLanguage[language])) {
    if (!existingTablets[id]) fail(`lang/${language}.json: missing tablet localization ${id}`);
    existingTablets[id] = {...existingTablets[id], ...content};
  }
  pack.TRUDVANG.Content.Tablet = existingTablets;
  pack.TRUDVANG.Content.Power = localized[language];
  outputs.set(path, `${JSON.stringify(pack, null, 2)}\n`);
}
for (const [path, content] of outputs) {
  if (check) {
    if (readFileSync(path, "utf8") !== content) fail(`${path} is stale; regenerate from the source JSON files`);
  } else writeFileSync(path, content, "utf8");
}
console.log(`${check ? "Validated" : "Generated"} ${tabletSources.fr.length} French and ${tabletSources.en.length} English tablets, ${french.size} powers and ${optionCount} improvements from source JSON.`);
