/** Development audit: catalogue presence only, not a claim of mechanical coverage. */
import {readFileSync,writeFileSync} from "node:fs";
import {TRANSFORMATIONS_BY_SOURCE} from "../modules/transformation-data.mjs";
import {RULE_TESTS_BY_CATALOG_ID} from "../modules/rule-test-data.mjs";
const powers=JSON.parse(readFileSync("game doc/fr/trudvang-powers-fr.json","utf8"));
const rows=powers.map(power=>({id:power.catalogId,name:power.name,tablet:power.tablet,type:power.isRune?"rune":power.catalogId.startsWith("holy-")?"pouvoir":"sortilège",options:power.powerLevels.length,tests:(RULE_TESTS_BY_CATALOG_ID[power.catalogId]??[]).length,effects:(TRANSFORMATIONS_BY_SOURCE[power.catalogId]??[]).length}));
const escape=value=>String(value??"").replaceAll("|","\\|").replaceAll("\n"," ");
const lines=["# Inventaire initial des effets magiques", "", "Généré depuis `game doc/fr/trudvang-powers-fr.json` et les catalogues techniques existants par `node tools/audit-magic-effects.mjs`.", "", "Les nombres indiquent les éléments déjà répertoriés, pas une validation de leur exhaustivité ni de leur exactitude. Chaque ligne et chaque option restent à examiner dans les règles avant d'être déclarées couvertes.", "", `Entrées : ${rows.length} ; options de puissance : ${rows.reduce((n,r)=>n+r.options,0)} ; entrées avec au moins un test répertorié : ${rows.filter(r=>r.tests).length} ; avec au moins un modèle d'effet répertorié : ${rows.filter(r=>r.effects).length}.`, "", "| Tablette | Nom | Type | Identifiant | Options | Tests existants | Modèles d'effet existants |", "|---|---|---|---|---:|---:|---:|", ...rows.map(r=>`| ${escape(r.tablet)} | ${escape(r.name)} | ${r.type} | \`${r.id}\` | ${r.options} | ${r.tests} | ${r.effects} |`), ""];
writeFileSync("docs/magic-effects-inventory.md",lines.join("\n"));
console.log(lines[6]);
