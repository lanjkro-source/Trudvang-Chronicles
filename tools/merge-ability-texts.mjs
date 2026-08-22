// Merges extracted descriptions + authored summaries into lang/en.json and lang/fr.json
// under TRUDVANG.Content.Ability.<catalogId>.{Description,Summary}.
import { readFileSync, writeFileSync } from "node:fs";

const extracted = JSON.parse(readFileSync("tmp/abilities-extracted.json", "utf8")).entries;
const summaries = {};
for (const batch of ["batch-1", "batch-2", "batch-3", "batch-4"]) {
  Object.assign(summaries, JSON.parse(readFileSync(`tmp/abilities-batches/summaries-${batch}.json`, "utf8")));
}

const catalogIds = new Set([...Object.keys(extracted), ...Object.keys(summaries)]);
if (Object.keys(summaries).length !== 135 || Object.keys(extracted).length !== 135) {
  console.error(`Count mismatch: extracted=${Object.keys(extracted).length} summaries=${Object.keys(summaries).length}`);
  process.exit(1);
}

for (const [file, fieldFr] of [["lang/fr.json", "descriptionFr"], ["lang/en.json", "descriptionEn"]]) {
  const lang = JSON.parse(readFileSync(file, "utf8"));
  lang.TRUDVANG.Content ??= {};
  lang.TRUDVANG.Content.Ability ??= {};
  let added = 0;
  for (const id of catalogIds) {
    const source = extracted[id] ?? {};
    const summary = summaries[id] ?? {};
    const description = fieldFr === "descriptionFr" ? source.descriptionFr : source.descriptionEn;
    if (!description) { console.error(`${file}: missing ${fieldFr} for ${id}`); process.exit(1); }
    const summaryText = fieldFr === "descriptionFr" ? summary.summaryFr : summary.summaryEn;
    if (!summaryText) { console.error(`${file}: missing summary for ${id}`); process.exit(1); }
    lang.TRUDVANG.Content.Ability[id] ??= {};
    lang.TRUDVANG.Content.Ability[id].Description = description;
    lang.TRUDVANG.Content.Ability[id].Summary = summaryText;
    added += 2;
  }
  writeFileSync(file, JSON.stringify(lang, null, 2) + "\n", "utf8");
  console.log(`${file}: ${added} keys written`);
}
