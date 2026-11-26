import {ARCHETYPE_CREATION_BONUS, TRUDVANG} from "./config.mjs";
import {tabletListJournalHtml} from "./tablet-journal-content.mjs";

const SYSTEM_ID = "trudvang-chronicles";

// Parent folders are declared before their children: upsertJournals() walks this
// object in order and hands each folder its already-created parent. `colorRole`
// resolves against the theme palette in upsertFolder().
export const JOURNAL_FOLDERS = {
  characterCreation: {nameKey: "TRUDVANG.Content.Folder.CharacterCreation", type: "JournalEntry", colorRole: "red"},
  equipment: {nameKey: "TRUDVANG.Content.Folder.Equipment", type: "JournalEntry", colorRole: "muted"},
  races: {nameKey: "TRUDVANG.Content.Folder.Races", type: "JournalEntry", colorRole: "red", parent: "characterCreation"},
  archetypes: {nameKey: "TRUDVANG.Content.Folder.Archetypes", type: "JournalEntry", colorRole: "red", parent: "characterCreation"},
  religions: {nameKey: "TRUDVANG.Content.Folder.Religions", type: "JournalEntry", colorRole: "red", parent: "characterCreation"},
  magic: {nameKey: "TRUDVANG.Content.Folder.JournalMagic", type: "JournalEntry", colorRole: "red", parent: "characterCreation"},
  rules: {nameKey: "TRUDVANG.Content.Folder.Rules", type: "JournalEntry", colorRole: "muted"}
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
  {id: "armorEncumbrance", folder: "equipment", key: "armorEncumbrance"},
  {id: "purchasePrices", folder: "equipment", key: "purchasePrices"},
  {id: "equipmentQuality", folder: "equipment", key: "equipmentQuality"},
  {id: "gerbanis", folder: "religions", key: "gerbanis"},
  {id: "ealdTradition", folder: "religions", key: "ealdTradition"},
  {id: "tenetNid", folder: "religions", key: "tenetNid"},
  {id: "haminges", folder: "religions", key: "haminges"},
  {id: "thuuldom", folder: "religions", key: "thuuldom"},
  {id: "toikalokke", folder: "religions", key: "toikalokke"},
  {id: "joaringFaith", folder: "religions", key: "joaringFaith"},
  {id: "tabletList", folder: "magic", key: "tabletList", content: () => tabletListJournalHtml({
    localize: l,
    language: globalThis.game?.i18n?.lang ?? "en"
  })},
  {id: "creatureSize", folder: "rules", key: "creatureSize"},
  {id: "training", folder: "rules", key: "training"},
  {id: "hunting", folder: "rules", key: "hunting"},
  {id: "travel", folder: "rules", key: "travel"},
  {id: "combatActions", folder: "rules", key: "combatActions"},
  {id: "environment", folder: "rules", key: "environment"}
];

const l = key => game.i18n.localize(key);
const content = key => l(`TRUDVANG.Content.Journal.${key}.Content`);

function raceTable(id) {
  const rows = raceStats[id].map(([culture, body, movement]) => `<tr><td>${l(culture)}</td><td>${body}</td><td>${movement} m</td></tr>`).join("");
  return `<h2>${l("TRUDVANG.Content.Journal.Statistics")}</h2><table><thead><tr><th>${l("TRUDVANG.Content.Journal.Culture")}</th><th>${l("TRUDVANG.Content.Journal.BodyPoints")}</th><th>${l("TRUDVANG.Content.Journal.Movement")}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function withArchetypeBonus(key, body) {
  const [first, second] = TRUDVANG.archetypes[key].core.map(skill => l(TRUDVANG.skills[skill]));
  const bonus = game.i18n.format("TRUDVANG.Content.Journal.ArchetypeCreationBonus", {points: ARCHETYPE_CREATION_BONUS, first, second});
  return body.replace("</p>", `</p><p>${bonus}</p>`);
}

function withReligionIntroduction(key, body) {
  const root = `TRUDVANG.Content.Journal`;
  const section = part => l(`${root}.ReligionIntroductions.${key}.${part}`);
  const organization = `<h2>${l(`${root}.ReligionOrganization`)}</h2>`;
  const introduction = `<p>${section("Overview")}</p><p>${section("Practice")}</p><h2>${l(`${root}.ReligionPantheon`)}</h2><p>${section("Pantheon")}</p>`;
  const start = '<article class="trudvang-religion-journal">';
  // The Joaring source already has a heading over the organization paragraph.
  if (key === "joaringFaith") body = body.replace(/^<article[^>]*><h2>[^<]*<\/h2>/, start);
  return body.replace(start, `${start}${introduction}${organization}`);
}

export function journalDocuments(folders, onlyFolders) {
  return journals.filter(({folder}) => !onlyFolders || onlyFolders.includes(folder)).map(({id, folder, key, image, content: buildContent}) => {
    const name = l(`TRUDVANG.Content.Journal.${key}.Name`);
    let pageContent = buildContent ? buildContent() : content(key);
    if (folder === "archetypes") pageContent = withArchetypeBonus(key, pageContent);
    if (folder === "religions") pageContent = withReligionIntroduction(key, pageContent);
    return {
      id, name, folder: folders[folder]?.id,
      flags: {[SYSTEM_ID]: {starterId: `journal-${id}`}},
      pages: [{name, type: "text", text: {format: 1, content: image ? `<article class="trudvang-starter-journal"><figure><img src="systems/${SYSTEM_ID}/${image}" alt=""></figure>${pageContent}${raceStats[key] ? raceTable(key) : ""}</article>` : pageContent}}]
    };
  });
}
