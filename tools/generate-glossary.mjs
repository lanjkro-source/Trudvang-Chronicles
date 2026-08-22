import {readFileSync, writeFileSync} from "node:fs";

const english = JSON.parse(readFileSync("lang/en.json", "utf8"));
const french = JSON.parse(readFileSync("lang/fr.json", "utf8"));

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const escapeCell = value => String(value ?? "")
  .replace(/\r?\n/g, "<br>")
  .replace(/\|/g, "\\|");

function collect(object, prefix = "", output = []) {
  for (const [key, value] of Object.entries(object || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) collect(value, path, output);
    else if (!path.startsWith("TRUDVANG.Content.") || !path.endsWith(".Summary")) output.push(path);
  }
  return output;
}

const keys = collect(english);
const frenchKeys = new Set(collect(french));
const missingFrench = keys.filter(key => !frenchKeys.has(key));
const missingEnglish = [...frenchKeys].filter(key => get(english, key) === undefined);
if (missingFrench.length || missingEnglish.length) {
  throw new Error(`Language keys differ. Missing in French: ${missingFrench.join(", ") || "none"}; missing in English: ${missingEnglish.join(", ") || "none"}`);
}

const groups = new Map();
for (const key of keys) {
  const group = key.split(".").slice(0, -1).join(".") || "Root";
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(key);
}

const lines = [
  "# Glossaire bilingue anglais–français",
  "",
  "Ce glossaire constitue la référence terminologique pour les traductions du système Trudvang. Il est régénéré à partir de `lang/en.json` et `lang/fr.json`, y compris la section `TRUDVANG.Content` (bibliothèque de démarrage et catalogue de tablettes), désormais traduite. Les résumés longs des pouvoirs (`*.Summary`) sont exclus : ce sont des citations de règles, pas des termes de vocabulaire.",
  "",
  "La terminologie française s'appuie sur l'édition officielle Black Book Éditions (« Livre des règles », miroir texte dans `game doc/markdown-fr/`). Avant d'ajouter ou de modifier une entrée dans les fichiers de langue, rechercher ici les termes apparentés et conserver les choix terminologiques existants. Toute nouvelle terminologie validée doit être répercutée dans ce document.",
  ""
];

for (const [group, groupKeys] of groups) {
  lines.push(`## \`${group}\``, "", "| Clé | English | Français |", "|---|---|---|");
  for (const key of groupKeys) lines.push(`| \`${key}\` | ${escapeCell(get(english, key))} | ${escapeCell(get(french, key))} |`);
  lines.push("");
}

const body = lines.join("\n").trimEnd();
if (process.argv.includes("--write")) {
  writeFileSync("lang/GLOSSARY.md", `${body}\n`, "utf8");
  console.log(`GLOSSARY.md régénéré (${keys.length} clés).`);
} else {
  process.stdout.write(`*** Begin Patch\n*** Update File: lang/GLOSSARY.md\n${body.split("\n").map(line => `+${line}`).join("\n")}\n*** End Patch`);
}
