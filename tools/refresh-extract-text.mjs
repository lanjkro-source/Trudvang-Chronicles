import fs from "node:fs";

const markdownPath = "game doc/markdown-fr/Trudvang - 01 - Livre des Regles.md";
const languagePath = "lang/fr.json";
const extracts = [
  ["Argmurkla", "Argmurkla"], ["WoundBalm", "Baume à blessure"], ["Gaveblom", "Gaveblom"],
  ["FrostboarFat", "Graisse de sanglier des glaces"], ["Grindblom", "Grindblom"], ["Manetter", "Mandrape"],
  ["Pustartobak", "Pustartobak"], ["DragonBlood", "Sang de dragon"], ["Svartljunghed", "Svartljunghed"],
  ["Tornrot", "Tornrot"], ["Trollilles", "Trollilles"], ["Tungelin", "Tungelin"]
];
const source = fs.readFileSync(markdownPath, "utf8");
const language = JSON.parse(fs.readFileSync(languagePath, "utf8"));
const clean = value => value.replace(/## PDF page \d+/g, "").replace(/([\p{L}])\s*-\s*\n\s*([\p{Ll}])/gu, "$1$2")
  .replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
const after = (text, marker) => text.slice(text.indexOf(marker) + marker.length);
const field = (text, label, following) => {
  const body = after(text, `F ${label} :`);
  const end = following.map(next => body.indexOf(`\n F ${next}`)).filter(index => index >= 0).sort((a, b) => a - b)[0];
  return clean(end === undefined ? body : body.slice(0, end));
};

for (const [key, heading] of extracts) {
  const start = source.indexOf(`${heading}\n F Type`);
  if (start < 0) throw new Error(`Heading not found: ${heading}`);
  const nextStart = extracts.map(([, next]) => source.indexOf(`${next}\n F Type`, start + heading.length)).filter(index => index >= 0).sort((a, b) => a - b)[0];
  const section = source.slice(start, nextStart ?? source.length);
  const item = language.TRUDVANG.Content.Item[key];
  item.Appearance = field(section, "Apparence", ["Préparation", "Modalité d’utilisation", "Durée", "Effet", "Valeur"]);
  item.Preparation = field(section, "Préparation", ["Modalité d’utilisation", "Durée", "Effet", "Valeur"]);
  item.Usage = field(section, "Modalité d’utilisation", ["Durée", "Effet", "Valeur"]);
  item.Effect = field(section, "Effet", ["Valeur"]);
  item.Description = item.Effect;
  const effectText = section.slice(section.search(/Effets? (?:de |du |des )/));
  for (const [name, label] of [["Mild", "Léger"], ["Moderate", "Modéré"], ["Strong", "Fort"], ["Total", "Total"]]) {
    const body = after(effectText, `F ${label} :`);
    const end = body.search(/\n F (?:Léger|Modéré|Fort|Total)\s*:/);
    item[name] = clean(end < 0 ? body : body.slice(0, end));
  }
}

const original = fs.readFileSync(languagePath, "utf8");
function objectRange(text, key) {
  const start = text.indexOf(`"${key}":`);
  const open = text.indexOf("{", start);
  let depth = 0, quoted = false, escaped = false;
  for (let index = open; index < text.length; index++) {
    const character = text[index];
    if (quoted) { if (!escaped && character === '"') quoted = false; escaped = !escaped && character === "\\"; continue; }
    if (character === '"') { quoted = true; continue; }
    if (character === "{") depth++;
    if (character === "}" && --depth === 0) return [start, index + 1];
  }
  throw new Error(`Unclosed object: ${key}`);
}
let output = original;
for (const [key] of extracts) {
  const [start, end] = objectRange(output, key);
  const replacement = `"${key}": ${JSON.stringify(language.TRUDVANG.Content.Item[key])}`;
  output = output.slice(0, start) + replacement + output.slice(end);
}
fs.writeFileSync(languagePath, output);
