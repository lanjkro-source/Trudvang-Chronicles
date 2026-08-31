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
const headings = {
  fr: {
    human: ["Les Mittlanders", "Les Stormlanders", "Les Viranns", "Les Sauvages", "Les demi-trolls", "Les changelins", "Les brutes grises", "Les ogros"],
    elf: ["Les illmalainas", "Les korpikallas", "Les demi-elfes", "Les dyfirs", "Les barkbrules"],
    dwarf: ["Les borjornikkas", "Les buratjas", "Les nains-trolls"],
    dimwalker: ["Arpenteurs des brumes elfes", "Arpenteurs des brumes nains", "Arpenteurs des brumes mittlanders", "Arpenteurs des brumes stormlanders", "Arpenteurs des brumes viranns", "Arpenteurs des brumes sauvages"],
    bard: ["Bardes elfes", "Bardes nains", "Bardes mittlanders", "Bardes stormlanders", "Bardes viranns", "Bardes sauvages"],
    dweller: ["Colons elfes", "Colons nains", "Colons mittlanders", "Colons stormlanders", "Colons viranns", "Colons sauvages"],
    warrior: ["Guerriers elfes", "Guerriers nains", "Guerriers mittlanders", "Guerriers stormlanders", "Guerriers viranns", "Guerriers sauvages"],
    rogue: ["Malfrats elfes", "Malfrats nains", "Malfrats mittlanders", "Malfrats stormlanders", "Malfrats viranns", "Malfrats sauvages"],
    ranger: ["Rôdeurs elfes", "Rôdeurs nains", "Rôdeurs mittlanders", "Rôdeurs stormlanders", "Rôdeurs viranns", "Rôdeurs sauvages"],
    vitnerWeaver: ["Tisseurs de vitner elfes", "Tisseurs de vitner nains", "Tisseurs de vitner mittlanders", "Tisseurs de vitner stormlanders", "Tisseurs de vitner viranns", "Tisseurs de vitner sauvages"]
  },
  en: {
    human: ["Mittlander", "Stormlander", "Virann", "Wildfolk", "Half-Trolls", "Changeling", "Gray Brute", "Ogro"],
    elf: ["Illmalaini", "Korpikalli", "Half-Elves", "Dyfir", "Barkbrule"],
    dwarf: ["Borjornikka", "Buratja", "Dwarf-Trolls"],
    dimwalker: ["Elven Dimwalkers", "Dwarven Dimwalkers", "Mittlander Dimwalkers", "Stormlander Dimwalkers", "Virann Dimwalkers", "Wildfolk Dimwalkers"],
    bard: ["Elven Bards", "Dwarven Bards", "Mittlander Bards", "Stormlander Bards", "Virann Bards", "Wildfolk Bards"],
    dweller: ["Elven Dwellers", "Dwarven Dwellers", "Mittlander Dwellers", "Stormlander Dwellers", "Virann Dwellers", "Wildfolk Dwellers"],
    warrior: ["Elven Warriors", "Dwarven Warriors", "Mittlander Warriors", "Stormlander Warriors", "Virann Warriors", "Wildfolk Warriors"],
    rogue: ["Elven Rogues", "Dwarven Rogues", "Mittlander Rogues", "Stormlander Rogues", "Virann Rogues", "Wildfolk Rogues"],
    ranger: ["Elven Rangers", "Dwarven Rangers", "Mittlander Rangers", "Stormlander Rangers", "Virann Rangers", "Wildfolk Rangers"],
    vitnerWeaver: ["Elven Vitner Weavers", "Dwarven Vitner Weavers", "Mittlander Vitner Weavers", "Stormlander Vitner Weavers", "Virann Vitner Weavers", "Wildfolk Vitner Weavers"]
  }
};
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function pageText(source, number) {
  const start = source.indexOf(`## PDF page ${number}\n`);
  const end = source.indexOf("\n## PDF page ", start + 1);
  return source.slice(start, end < 0 ? undefined : end).replace(/^##[^\n]*\n+/, "").trim();
}
function html(text, sectionHeadings = []) {
  const known = new Set(sectionHeadings.map(value => value.toLowerCase()));
  const parts = []; let paragraph = [];
  const flush = () => { if (paragraph.length) parts.push(`<p>${escape(paragraph.join(" ").replace(/\s+/g, " ").trim())}</p>`); paragraph = []; };
  const lines = text.replace(/\s*-\s*\n/g, "").split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const clean = lines[index].trim();
    if (!clean) continue;
    // In the source extraction, a few long headings wrap over two physical lines.
    const next = lines[index + 1]?.trim();
    const joined = next ? `${clean} ${next}` : clean;
    if (known.has(joined.toLowerCase())) { flush(); parts.push(`<h2>${escape(joined)}</h2>`); index += 1; }
    else if (known.has(clean.toLowerCase())) { flush(); parts.push(`<h2>${escape(clean)}</h2>`); }
    else paragraph.push(clean);
  }
  flush(); return parts.join("");
}
for (const lang of ["fr", "en"]) {
  const localePath = `lang/${lang}.json`, locale = JSON.parse(fs.readFileSync(localePath, "utf8"));
  const source = fs.readFileSync(roots[lang], "utf8");
  locale.TRUDVANG.Content ??= {}; locale.TRUDVANG.Content.Journal ??= {};
  Object.entries(pages[lang]).forEach(([id, page]) => {
    locale.TRUDVANG.Content.Journal[id] = {Name: names[lang][id], Content: html(pageText(source, page), headings[lang][id])};
  });
  Object.assign(locale.TRUDVANG.Content.Journal, lang === "fr"
    ? {Statistics: "Caractéristiques", Culture: "Culture ou métissage", BodyPoints: "Points de santé", Movement: "Mouvement"}
    : {Statistics: "Statistics", Culture: "Culture or mixed breed", BodyPoints: "Body Points", Movement: "Movement"});
  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`);
}
