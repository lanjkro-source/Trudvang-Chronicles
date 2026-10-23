import {RULE_TESTS_BY_CATALOG_ID} from "./rule-test-data.mjs";
import {magicResistanceRows,localizeResistanceRows} from "./rules/magic-resistance.mjs";
import {escapeHtml} from "./helpers.mjs";

/** Preview the source-side adjustments, separate from the caster's own roll VC. */
export function magicResistancePreview(context){
 const sections=(RULE_TESTS_BY_CATALOG_ID[context?.sourceId]??[]).flatMap(test=>{
  const rows=localizeResistanceRows(magicResistanceRows(test,{context}));
  if(!rows.length)return [];
  return [`<section><strong>${escapeHtml(test.action)}</strong><ul class="roll-state-modifiers">${rows.map(row=>`<li><span>${escapeHtml(row.label)}</span><b>${row.value>0?"+":""}${row.value}</b></li>`).join("")}</ul></section>`];
 });
 return sections.length?`<aside class="rule-test-notes"><p>${escapeHtml(game.i18n.localize("TRUDVANG.Resistance.CastingPreview"))}</p>${sections.join("")}</aside>`:"";
}
