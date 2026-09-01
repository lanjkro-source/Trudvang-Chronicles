const SYSTEM_ID = "trudvang-chronicles";

export const JOURNAL_FOLDERS = {
  equipment: {nameKey: "TRUDVANG.Content.Folder.Equipment", type: "JournalEntry"},
  races: {nameKey: "TRUDVANG.Content.Folder.Races", type: "JournalEntry"},
  archetypes: {nameKey: "TRUDVANG.Content.Folder.Archetypes", type: "JournalEntry"}
};

const raceStats = {
  human: [["TRUDVANG.Culture.Stormlander", 32, 10], ["TRUDVANG.Culture.Mittlander", 32, 10], ["TRUDVANG.Culture.Virann", 32, 10], ["TRUDVANG.Culture.Wildfolk", 32, 10], ["TRUDVANG.Culture.Changeling", 26, 11], ["TRUDVANG.Culture.GrayBrute", 34, 11], ["TRUDVANG.Culture.Ogro", 38, 12]],
  elf: [["TRUDVANG.Culture.Illmalaini", 30, 12], ["TRUDVANG.Culture.Korpikalli", 30, 12], ["TRUDVANG.Culture.Dyfir", 30, 11], ["TRUDVANG.Culture.Barkbrule", 30, 11]],
  dwarf: [["TRUDVANG.Culture.Borjornikka", 30, 8], ["TRUDVANG.Culture.Buratja", 28, 8], ["TRUDVANG.Culture.Zvorda", 34, 6]]
};

const journals = [
  {id: "human", folder: "races", key: "human", image: "assets/art/journals/humans.png"},
  {id: "elf", folder: "races", key: "elf", image: "assets/art/journals/elves.png"},
  {id: "dwarf", folder: "races", key: "dwarf", image: "assets/art/journals/dwarves.png"},
  {id: "dimwalker", folder: "archetypes", key: "dimwalker", image: "assets/art/journals/dimwalker.png"},
  {id: "bard", folder: "archetypes", key: "bard", image: "assets/art/journals/bard.png"},
  {id: "dweller", folder: "archetypes", key: "dweller", image: "assets/art/journals/dweller.png"},
  {id: "warrior", folder: "archetypes", key: "warrior", image: "assets/art/journals/warrior.png"},
  {id: "rogue", folder: "archetypes", key: "rogue", image: "assets/art/journals/rogue.png"},
  {id: "ranger", folder: "archetypes", key: "ranger", image: "assets/art/journals/ranger.png"},
  {id: "vitnerWeaver", folder: "archetypes", key: "vitnerWeaver", image: "assets/art/journals/vitner-weaver.png"},
  {id: "armorEncumbrance", folder: "equipment", key: "armorEncumbrance"}
];

const l = key => game.i18n.localize(key);
const content = key => l(`TRUDVANG.Content.Journal.${key}.Content`);

function raceTable(id) {
  const rows = raceStats[id].map(([culture, body, movement]) => `<tr><td>${l(culture)}</td><td>${body}</td><td>${movement} m</td></tr>`).join("");
  return `<h2>${l("TRUDVANG.Content.Journal.Statistics")}</h2><table><thead><tr><th>${l("TRUDVANG.Content.Journal.Culture")}</th><th>${l("TRUDVANG.Content.Journal.BodyPoints")}</th><th>${l("TRUDVANG.Content.Journal.Movement")}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function journalDocuments(folders) {
  return journals.map(({id, folder, key, image}) => ({
    id, name: l(`TRUDVANG.Content.Journal.${key}.Name`), folder: folders[folder]?.id,
    flags: {[SYSTEM_ID]: {starterId: `journal-${id}`}},
    pages: [{name: l(`TRUDVANG.Content.Journal.${key}.Name`), type: "text", text: {format: 1, content: image ? `<article class="trudvang-starter-journal"><figure><img src="systems/${SYSTEM_ID}/${image}" alt=""></figure>${content(key)}${raceStats[key] ? raceTable(key) : ""}</article>` : content(key)}}]
  }));
}
