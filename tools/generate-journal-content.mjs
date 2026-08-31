/* Generates localized starter Journal text from the private rulebook mirrors. */
import fs from "node:fs";

const roots = {
  fr: "game doc/markdown-fr/Trudvang - 01 - Livre des Regles.md",
  en: "game doc/markdown/trudvang-chronicles-players-handbook.md"
};
const pages = {
  fr: {human: 45, elf: 47, dwarf: 49, dimwalker: 51, bard: 53, dweller: 55, warrior: 57, rogue: 59, ranger: 61, vitnerWeaver: 63},
  en: {human: 20, elf: 22, dwarf: 24, dimwalker: 28, bard: 26, dweller: 30, warrior: 38, rogue: 34, ranger: 32, vitnerWeaver: 36}
};
const names = {
  fr: {human: "Humains", elf: "Elfes", dwarf: "Nains", dimwalker: "Arpenteur des brumes", bard: "Barde", dweller: "Colon", warrior: "Guerrier", rogue: "Malfrat", ranger: "Rôdeur", vitnerWeaver: "Tisseur de vitner"},
  en: {human: "Humans", elf: "Elves", dwarf: "Dwarves", dimwalker: "Dimwalker", bard: "Bard", dweller: "Dweller", warrior: "Warrior", rogue: "Rogue", ranger: "Ranger", vitnerWeaver: "Vitner Weaver"}
};
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function pageText(source, number) {
  const start = source.indexOf(`## PDF page ${number}\n`);
  const end = source.indexOf("\n## PDF page ", start + 1);
  return source.slice(start, end < 0 ? undefined : end).replace(/^##[^\n]*\n+/, "").trim();
}
function html(text) {
  return text.replace(/-\n/g, "").split(/\n\s*\n/).map(block => `<p>${escape(block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())}</p>`).join("");
}
for (const lang of ["fr", "en"]) {
  const localePath = `lang/${lang}.json`, locale = JSON.parse(fs.readFileSync(localePath, "utf8"));
  const source = fs.readFileSync(roots[lang], "utf8");
  locale.TRUDVANG.Content ??= {}; locale.TRUDVANG.Content.Journal ??= {};
  Object.entries(pages[lang]).forEach(([id, page]) => {
    locale.TRUDVANG.Content.Journal[id] = {Name: names[lang][id], Content: html(pageText(source, page))};
  });
  Object.assign(locale.TRUDVANG.Content.Journal, lang === "fr"
    ? {Statistics: "Caractéristiques", Culture: "Culture ou métissage", BodyPoints: "Points de santé", Movement: "Mouvement"}
    : {Statistics: "Statistics", Culture: "Culture or mixed breed", BodyPoints: "Body Points", Movement: "Movement"});
  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`);
}
