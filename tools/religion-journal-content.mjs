/* Build localized, structured Journal HTML from the local rulebook mirrors. */

const religions = {
  gerbanis: {
    pages: {fr: [211, 212, 213], en: [156, 157, 158]},
    headings: {
      fr: ["Le sacrifice", "L’offrande de sang", "Sacrilège"],
      en: ["The Sacrifice", "Blood Gifting", "Gloomgifting"]
    },
    blocks: {
      fr: [
        [212, "example", "EXEMPLE : OFFRANDE DE SANG", "OFFRANDES DE SANG"],
        [212, "offerings", "OFFRANDES DE SANG", null],
        [213, "consequences", "CONSÉQUENCES DES SACRILÈGES", null]
      ],
      en: [
        [157, "example", "EXAMPLE: BLOOD GIFTING", "Blood Gift Offerings"],
        [157, "offerings", "Blood Gift Offerings", null],
        [158, "consequences", "GLOOMGIFTING CONSEQUENCES", null]
      ]
    }
  },
  ealdTradition: {
    pages: {fr: [229, 230, 231], en: [174, 175, 176]},
    headings: {
      fr: ["Les promesses", "Les serments de sang", "Les traîtres et parjures"],
      en: ["The Promises", "Blood Oaths", "Promise- and Oath Breakers"]
    },
    blocks: {
      fr: [[231, "oaths", "SERMENTS DE SANG", "Les traîtres et parjures"], [231, "example", "EXEMPLES : SERMENTS DE SANG, TRAÎTRES ET PARJURES", null]],
      en: [[176, "oaths", "BLOOD OATHS", "Promise- and Oath Breakers"], [176, "example", "EXAMPLES: BLOOD OATHS, PROMISE BREAKERS AND OATH BREAKERS", null]]
    }
  },
  tenetNid: {
    pages: {fr: [247, 248, 249], en: [192, 193, 194]},
    headings: {
      fr: ["Les études", "Les prières", "Durée d’une prière", "Lieu de prière"],
      en: ["The Studies", "Prayers", "Prayer’s Duration", "Place of Prayer"]
    },
    blocks: {
      fr: [
        [247, "example", "EXEMPLE : PRIÈRES", null],
        [248, "prayerDuration", "DURÉE D’UNE PRIÈRE", "Lieu de prière"],
        [248, "prayerPlaces", "LIEUX DE PRIÈRE", null],
        [249, "example", "EXEMPLE : PRIÈRES", null]
      ],
      en: [
        [192, "example", "EXAMPLE: PRA YERS", null],
        [193, "prayerPlaces", "PLACE OF PRA YER", "PRA YER’S DURATION"],
        [193, "prayerDuration", "PRA YER’S DURATION", "Prayer’s Duration"],
        [194, "example", "EXAMPLE: PRA YERS", null]
      ]
    }
  },
  haminges: {
    pages: {fr: [265, 266, 267], en: [210, 211, 212]},
    headings: {
      fr: ["La bataille spirituelle", "Les reliques", "Le vol spirituel"],
      en: ["The Spirit Battle", "Relics", "Spirit Theft"]
    },
    blocks: {
      fr: [
        [267, "example", "EXEMPLES : RELIQUES, VOL SPIRITUEL", "POINTS DE SANTÉ CONVERTIS EN POINTS DE DIVINITÉ"],
        [267, "soulFull", "POINTS DE SANTÉ CONVERTIS EN POINTS DE DIVINITÉ", "incapable de tirer pleinement parti"],
        [267, "soulReduced", "POINTS DE SANTÉ CONVERTIS SI L’ARPENTEUR DES BRUMES POSSÈDE", null]
      ],
      en: [
        [212, "example", "EXAMPLES: RELICS, SPIRIT THEFT", "BODY POINTS CONVERTED INTO DIVINITY POINTS"],
        [212, "soulFull", "BODY POINTS CONVERTED INTO DIVINITY POINTS", "THE DIMINISHED VALUES OF DIVINITY POINTS"],
        [212, "soulReduced", "THE DIMINISHED VALUES OF DIVINITY POINTS", null]
      ]
    }
  },
  thuuldom: {
    pages: {fr: [281, 282, 283, 284], en: [226, 227, 228, 229]},
    headings: {
      fr: ["Les objets sacrés", "L’artisanat thuul", "Points de divinité et coût des runes", "Le pouvoir des objets sacrés", "Créer des objets sacrés", "Inscrire une rune", "Améliorer les objets sacrés", "Récupérer les points de divinité", "Utiliser des objets sacrés", "Limitations des objets sacrés"],
      en: ["The Sacred Objects", "Thuul Craft", "Divinity Points and the Cost of Runes", "The Power of Sacred Objects", "Creating Sacred Objects", "Inscribing a Rune", "Expanding Sacred Objects", "Recovering Divinity Points", "Using Sacred Objects", "Limitations on Sacred Objects"]
    },
    blocks: {
      fr: [
        [281, "runeCosts", "COÛT DES NIVEAUX DE POUVOIR RUNIQUE", null],
        [283, "runeCapacity", "QUANTITÉ MAXIMALE DE POINTS DE DIVINITÉ QUI PEUVENT ÊTRE", "EXEMPLE : UTILISER DES OBJETS SACRÉS"],
        [283, "example", "EXEMPLE : UTILISER DES OBJETS SACRÉS", null]
      ],
      en: [
        [226, "runeCosts", "COST FOR LEVEL OF RUNE POWER", null],
        [228, "runeCapacity", "MAXIMUM AMOUNT OF DIVINITY POINTS TO LOCK INSIDE OBJECTS", "EXAMPLE: USING SACRED OBJECTS"],
        [228, "example", "EXAMPLE: USING SACRED OBJECTS", "To activate a rune"]
      ]
    }
  },
  toikalokke: {
    pages: {fr: [291, 292], en: [236, 237]},
    headings: {
      fr: ["La harpe des étoiles", "Astrologie et points de divinité supplémentaires", "Temps passé à observer les étoiles, conditions externes"],
      en: ["Star Harp", "Stargazing and Extra Divinity Points", "Time Spent Stargazing and External Conditions"]
    },
    blocks: {
      fr: [
        [292, "starTime", "TEMPS PASSÉ À OBSERVER LES", "En fonction des conditions"],
        [292, "starWeather", "CONDITIONS EXTERNES", null]
      ],
      en: [
        [237, "starTime", "TIME SPENT STARGAZING", "Based on the stargazing conditions"],
        [237, "starWeather", "CONDITIONS OF STARGAZING", "To succeed in studying the stars"]
      ]
    }
  }
};

const names = {
  fr: {gerbanis: "Gerbanis", ealdTradition: "Ancienne Tradition", tenetNid: "Doctrine de Nid", haminges: "Haminges", thuuldom: "Thuuldom", toikalokke: "Toikalokke"},
  en: {gerbanis: "Gerbanis", ealdTradition: "Eald Tradition", tenetNid: "Tenet of Nid", haminges: "Haminges", thuuldom: "Thuuldom", toikalokke: "Toikalokke"}
};

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const dewrap = text => text.replace(/\s*-\s*\n\s*/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
const paragraph = text => `<p>${escape(dewrap(text))}</p>`;

function table(caption, headers, rows) {
  return `<section class="trudvang-religion-table"><h3>${escape(caption)}</h3><table><thead><tr>${headers.map(cell => `<th>${escape(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`;
}

const oathRows = {
  fr: [["Voyager à travers le pays", "8"], ["Remporter un défi", "4"], ["Aider le prince", "8"], ["Sauver des gens sans défense", "4–20"], ["Se marier", "8"], ["Avoir un enfant", "8"], ["Protéger un village d’une menace extérieure", "4–20"], ["S’engager dans une guerre", "4–12"], ["Gagner une guerre", "20"], ["Briser une malédiction", "4–8"], ["Tuer des gråtrolls", "4"], ["Exterminer des morts-vivants", "12"], ["Tuer un jotun ou un tursir", "20"], ["Tuer un lindwurm", "20"], ["Tuer un wurm", "60"]],
  // The French edition is authoritative where the English table differs.
  en: [["Travel around the country", "8"], ["Win a contest", "4"], ["Help the prince", "8"], ["Save the defenseless", "4–20"], ["Get married", "8"], ["Have a child", "8"], ["Protect a village from external threats", "4–20"], ["Be involved in a war", "4–12"], ["Win a war", "20"], ["Break a curse", "4–8"], ["Slay gray trolls", "4"], ["Smite the undead", "12"], ["Slay a jotun or tursir", "20"], ["Slay a lindwurm", "20"], ["Slay a wurm", "60"]]
};

function tableBlock(kind, raw, lang) {
  const fr = lang === "fr";
  if (kind === "offerings") {
    const rows = raw.split("\n").map(line => line.trim().match(/^(.+?)\s+(\d+)\s+(Blotstör|Blotstång|Grand blotstång|Blotstång géant|Rod|Pole|Big pole|Huge)\s+(\d+)$/)).filter(Boolean).map(match => match.slice(1));
    if (rows.length !== 14) throw new Error(`Expected 14 blood offerings, got ${rows.length} (${lang}).`);
    return table(fr ? "Offrandes de sang" : "Blood Gift Offerings", fr ? ["Victime sacrificielle", "Points de divinité", "Blotstång/Blotstör", "Nombre de places"] : ["Offering", "Divinity Points", "Pole/Rod", "Space for offerings"], rows);
  }
  if (kind === "consequences") {
    const lines = raw.split("\n").map(line => line.trim());
    const rows = [];
    for (const line of lines.slice(2)) {
      const match = line.match(/^(\d+(?:[-–]\d+)?)\s+(.+)$/);
      if (match) rows.push([match[1], match[2]]);
      else if (rows.length && line) rows.at(-1)[1] += `\n${line}`;
    }
    if (rows.length !== 11) throw new Error(`Expected 11 sacrilege consequences, got ${rows.length} (${lang}).`);
    return table(fr ? "Conséquences des sacrilèges" : "Gloomgifting Consequences", fr ? ["1d10 + (PD/10)", "Conséquence"] : ["1d10 + (DP/10)", "Consequence"], rows.map(([roll, result]) => [roll, dewrap(result)]));
  }
  if (kind === "oaths") return table(fr ? "Serments de sang" : "Blood Oaths", fr ? ["Serment de sang", "Points de divinité"] : ["Blood oath", "Divinity Points"], oathRows[lang]);
  if (kind === "prayerDuration") return table(fr ? "Durée d’une prière" : "Prayer’s Duration", fr ? ["Temps", "Points de divinité"] : ["Time", "Divinity Points"], (fr ? [["1 heure", "1"], ["4 heures", "3"], ["12 heures", "6"], ["1 jour", "12"], ["3 jours", "24"], ["1 semaine", "32"]] : [["1 hour", "1"], ["4 hours", "3"], ["12 hours", "6"], ["1 day", "12"], ["3 days", "24"], ["1 week", "32"]]));
  if (kind === "prayerPlaces") return table(fr ? "Lieux de prière" : "Place of Prayer", fr ? ["Lieu", "Points de divinité"] : ["Place", "Divinity Points"], fr ? [["Lieu neutre", "×1"], ["Grand chêne / maison de prière", "×2"], ["Bosquet sacré / sanctuaire", "×3"], ["Église du chêne", "×4"], ["Champs de Cervitt", "×5"], ["Terre profanée", "/2"]] : [["Neutral location", "×1"], ["Large oak / house of prayer", "×2"], ["Sacred grove / shrine", "×3"], ["Oakchurch", "×4"], ["Fields of Cervitt", "×5"], ["Unholy ground", "/2"]]);
  if (kind === "soulFull" || kind === "soulReduced") {
    const low = kind === "soulReduced";
    const rows = [1, 2, 3, 4, 5].map(level => [fr ? `Niveau ${level}` : `Level ${level}`, `${(low ? 0 : 30) + level * 10} %`]);
    return table(fr ? (low ? "Points de santé convertis si des points de divinité temporaires subsistent" : "Points de santé convertis en points de divinité") : (low ? "Body Points converted while temporary Divinity Points remain" : "Body Points converted into Divinity Points"), fr ? ["Niveau de spécialité", "Part des points de santé convertis en points de divinité"] : ["Specialty level", "Body Points converted into Divinity Points"], rows);
  }
  if (kind === "runeCosts") return table(fr ? "Coût des niveaux de pouvoir runique" : "Cost for Level of Rune Power", fr ? ["Niveau", "Coût d’apprentissage (points de création ou d’aventure)", "Coût d’utilisation (points de divinité)"] : ["Level", "Learning cost (Creation or Adventure Points)", "Use cost (Divinity Points)"], [1, 2, 3, 4, 5].map(level => [String(level), String(level * 7), String(level)]));
  if (kind === "runeCapacity") return table(fr ? "Quantité maximale de points de divinité dans un objet" : "Maximum Divinity Points Locked Inside an Object", fr ? ["Discipline / spécialité", "Nombre de points de divinité"] : ["Discipline / specialty", "Number of Divinity Points"], fr ? [["Invocation", "1 point par niveau"], ["Forgeage Thuul", "2 points par niveau"], ["Artisanat", "1 point par niveau"], ["Matériaux souples ou durs", "2 points par niveau"]] : [["Invoke", "1 point per level"], ["Thuul Forging", "2 points per level"], ["Handicraft", "1 point per level"], ["Soft or Hard Materials", "2 points per level"]]);
  if (kind === "starTime") return table(fr ? "Temps passé à observer les étoiles" : "Time Spent Stargazing", fr ? ["Temps passé", "Points de divinité"] : ["Time spent", "Divinity Points"], fr ? [["1 heure", "1"], ["4 heures", "3"], ["8 heures", "6"], ["2 × 8 heures (2 nuits)", "12"], ["3 × 8 heures (3 nuits)", "24"], ["7 × 8 heures (7 nuits)", "32"]] : [["1 hour", "1"], ["4 hours", "3"], ["8 hours", "6"], ["2 × 8 hours (2 nights)", "12"], ["3 × 8 hours (3 nights)", "24"], ["7 × 8 hours (7 nights)", "32"]]);
  if (kind === "starWeather") return table(fr ? "Conditions externes" : "Stargazing Conditions", fr ? ["Visibilité", "Points de divinité"] : ["Visibility", "Divinity Points"], fr ? [["Partiellement étoilé", "×1"], ["Étoilé", "×2"], ["Partiellement étoilé et pleine lune", "×3"], ["Étoilé et pleine lune", "×4"], ["Solstice d’été", "×5"], ["Orage", "/2"]] : [["Partially starry", "×1"], ["Starry", "×2"], ["Partially starry and full moon", "×3"], ["Starry and full moon", "×4"], ["Summer solstice", "×5"], ["Storm", "/2"]]);
  throw new Error(`Unknown religion journal table: ${kind}`);
}

function formatText(source, headings, specials) {
  const normalizedHeadings = new Map(headings.map(value => [value.toLocaleLowerCase().replace(/\s+/g, " "), value]));
  const lines = source.replace(/\s*-\s*\n\s*/g, "").split("\n").map(line => line.trim()).filter(Boolean);
  const output = [];
  let paragraphLines = [], listItems = [], bullet = [];
  const flushParagraph = () => { if (paragraphLines.length) output.push(paragraph(paragraphLines.join("\n"))); paragraphLines = []; };
  const flushBullet = () => { if (bullet.length) listItems.push(`<li>${escape(dewrap(bullet.join("\n")))}</li>`); bullet = []; };
  const flushList = () => { flushBullet(); if (listItems.length) output.push(`<ul>${listItems.join("")}</ul>`); listItems = []; };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^(?:\d+\s*\|\s*chapter|chapter\s+\d+\.|\d+\s*$|[F✦]\s+[A-ZÀ-ÖØ-Ý ]+\s+[F✦]$)/i.test(line)) continue;
    const marker = line.match(/^@@(\d+)@@$/);
    if (marker) { flushParagraph(); flushList(); output.push(specials[Number(marker[1])]); continue; }
    const current = line.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    const joined = `${line} ${lines[index + 1] || ""}`.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    const heading = normalizedHeadings.get(current) || normalizedHeadings.get(joined);
    if (heading) {
      flushParagraph(); flushList(); output.push(`<h2>${escape(heading)}</h2>`);
      if (joined === heading.toLocaleLowerCase()) index += 1;
      continue;
    }
    const bulletStart = line.match(/^[F✦]\s+(.+)$/);
    if (bulletStart) { flushParagraph(); flushBullet(); bullet = [bulletStart[1]]; continue; }
    const bulletParagraphStart = /^(?:Pour apprendre|Pour réaliser|Pour que|Pour qu’|Si l’offrande|Si le thuul|Les points de divinité générés|Le nombre de points de divinité|Dans le premier cas|La harpe des étoiles|In order to|If a Blood|For the|The amount of Divinity|The star harp|The Thuuls have)/i;
    if (bullet.length && bulletParagraphStart.test(line)) flushList();
    if (bullet.length) { bullet.push(line); continue; }
    if (listItems.length) flushList();
    if (paragraphLines.length && /[.!?»:]$/.test(paragraphLines.at(-1)) && /^[A-ZÀ-ÖØ-Ý]/.test(line) && paragraphLines.join(" ").length > 80) flushParagraph();
    paragraphLines.push(line);
  }
  flushParagraph(); flushList();
  return output.join("");
}

function renderExample(raw, lang) {
  const [title, ...body] = raw.trim().split("\n");
  return `<aside class="trudvang-religion-example"><h3>${escape(dewrap(title))}</h3>${formatText(body.join("\n"), [], [])}</aside>`;
}

function extractPage(source, page) {
  const startMarker = `## PDF page ${page}\n`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing rulebook page ${page}.`);
  const end = source.indexOf("\n## PDF page ", start + startMarker.length);
  return source.slice(start + startMarker.length, end < 0 ? undefined : end).trim();
}

function pageWithBlocks(raw, blocks, lang, specials) {
  let page = raw;
  const findLine = (text, from = 0) => {
    if (page.startsWith(`${text}\n`, from)) return from;
    const found = page.indexOf(`\n${text}`, from);
    return found < 0 ? -1 : found + 1;
  };
  for (const [, kind, startText, endText] of blocks) {
    const start = findLine(startText);
    if (start < 0) throw new Error(`Missing religion journal block: ${startText} (${lang}).`);
    const end = endText ? findLine(endText, start + startText.length) : page.length;
    if (end < 0) throw new Error(`Missing end of religion journal block: ${endText} (${lang}).`);
    const text = page.slice(start, end).trim();
    const html = kind === "example" ? renderExample(text, lang) : tableBlock(kind, text, lang);
    const marker = `\n@@${specials.push(html) - 1}@@\n`;
    page = page.slice(0, start) + marker + page.slice(end);
  }
  return page;
}

export function religionJournalEntries(lang, source) {
  return Object.fromEntries(Object.entries(religions).map(([id, config]) => {
    const specials = [];
    let text = config.pages[lang].map(page => pageWithBlocks(extractPage(source, page), config.blocks[lang].filter(block => block[0] === page), lang, specials)).join("\n");
    if (id === "thuuldom") {
      // The page layout inserts the rune-cost table in the middle of a sentence
      // that continues on the next spread. Keep the paragraph intact in HTML.
      const heading = lang === "fr" ? "Le pouvoir des objets sacrés" : "The Power of Sacred Objects";
      text = text.replace("@@0@@", "").replace(heading, `@@0@@\n${heading}`);
    }
    const content = `<article class="trudvang-religion-journal">${formatText(text, config.headings[lang], specials)}</article>`;
    return [id, {Name: names[lang][id], Content: content}];
  }));
}
