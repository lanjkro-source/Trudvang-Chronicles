const slug = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const isFrench = () => globalThis.game?.i18n?.lang === "fr";
const localized = (key, fallback) => {
  const i18n = globalThis.game?.i18n;
  return i18n && typeof i18n.has === "function" && i18n.has(key) ? i18n.localize(key) : fallback;
};

// Runtime text resolvers. The compendium pack builder injects Node-side equivalents via
// {localize, format} so shipped packs and runtime-created items resolve text identically.
const defaultLocalize = (key, fallback = "") => localized(key, fallback);
const defaultFormat = (key, params) => {
  const i18n = globalThis.game?.i18n;
  if (i18n && typeof i18n.format === "function") return i18n.format(key, params);
  return Object.entries(params ?? {}).reduce((text, [name, value]) => text.split(`{${name}}`).join(String(value)), String(key));
};

export const getPowerSummary = power => localized(`TRUDVANG.Content.Power.${power.id}.Summary`, "");

export const tabletName = tablet => localized(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
export const powerName = power => localized(`TRUDVANG.Content.Power.${power.id}.Name`, power.name);

// The compact source below mirrors the master tablet lists in the Player's Handbook.
// A power is encoded as level:name; all rules-heavy effect text can be filled in later.
const DEFINITIONS = [
  ["Animal Vitner","vitner","",92,"1:Messenger;1:Speak to Animals;2:Call on Animals;2:Conjure Ravens;3:Control Animals;3:Mind of the Wolf;4:Possess Animals;4:Create Messenger;5:Send Message"],
  ["Body Vitner","vitner","",92,"1:Grip;1:Tipping;2:Hearing/Deafness;2:Sense of Smell;2:Vision/Blindness;3:Leather Skin;3:Immobilize;3:Appearance Change;4:Strengthen;4:Hasten;5:Imprison;5:Change Creature"],
  ["Delusion Vitner","vitner","",92,"1:Roar;1:Phantom Sound;1:Shriek;1:Increase Sounds;2:Traceless;2:Ghost Voice;3:Depict;3:Camouflage;4:Landscape Illusion;4:Silence;5:Lindwurm Illusion;5:Invisibility"],
  ["Dimvitner","vitner","",92,"1:Animate Undead;1:Hand of Death;2:Dismiss Undead;2:Speak to Undead;3:Tendril of Dimhall;3:Vitner Theft;4:Summon Wight;5:Control Undead;5:Darkness of Dimhall"],
  ["Flame Craft","vitner","",92,"1:Heat Water;1:Spark;2:Burning Hand;3:Flame Burst;3:Protection from Fire;4:Flame Control;4:Warmth;5:Sea of Fire"],
  ["Perceiving","vitner","",92,"1:Find Home;1:Retrace Tracks;2:Detect Object;2:Orientation;3:Detect Being;4:Detect Undead;4:Surrounding;5:Map"],
  ["Power of Thought","vitner","",92,"1:Understanding Script;1:Understanding Speech;2:Courage;2:Fear;2:Telepathy;3:Ecstasy;3:Imagining;3:Memory;4:Creature Control;4:Aura of Power;5:Possess Creature;5:Mind Reading"],
  ["Power of Vision","vitner","",92,"1:Tracking;2:Scanning;2:Far Sight;3:Seeing;3:Espionage;4:Astral Voyage;4:Read Vitner;5:True Sight"],
  ["Soil Craft","vitner","",92,"1:Rock Throw;1:Shape Soil;2:Earthquake;2:Quagmire;3:Soil Blast;3:Soil Walk;4:Shape Stone;4:Stone Walk;5:Petrify/Remove Petrification"],
  ["Vitner Craft","vitner","",92,"1:Channeling;1:Vitner Pouch;2:Enchant Object;3:Anti Magic;3:Enchant Being;4:Seal;4:Dispel Vitner;5:Trace Vitner;5:Wall of Vitner"],
  ["Vitner of Objects","vitner","",92,"1:Detect Composition;1:Waterproof;2:Bind;2:Rust;3:Alarm Object;3:Unlock/Lock;4:Enlarge/Reduce Object;4:Alter Object;5:Create Object"],
  ["Water Craft","vitner","",92,"1:Find Water;1:Purify Water;2:Breathe;2:Form Water;3:Create Water;3:Solid Water;4:Control Precipitation;4:Water Walk;5:Wave Master"],
  ["Wind Craft","vitner","",92,"1:Purify Air;1:Wind Gust;2:Fog;2:Control Wind;3:Air Armor;3:Lift;4:Air Shield;4:Wind Blast;5:Storm;5:Wind Catcher"],
  ["Witchcraft","vitner","",92,"1:Uprooted Tree;1:Phantom Plague;2:Fever;2:Curse Object;3:Amnesia;4:Curse Creature;4:Bad Harvest;5:Tree Curse"],
  ["Influence of Jorn","holy","gerbanis",161,"1:Death Gust;1:Wall of Dusk;2:Falfax;2:Night Curtain;3:The Coat of Jorn;3:The Breath of Mogunda;4:Asiblack;4:Will of Bodvildur;5:Snarfari"],
  ["Power of Enken","holy","gerbanis",161,"1:Night Vision;1:Willpower;2:Bold;2:Wind Shield;3:Soul Sight;3:Storm Armor;4:Heart of Enken;4:Hurricane Armor;5:Eye of Enken"],
  ["Strength of Stormi","holy","gerbanis",161,"1:Troll Strength;1:Voice of Command;2:Havar;2:Hinji Strength;3:Jarl's Call;3:Shield Dísir;4:Jotun Strength;4:Voice of Stormi;5:Einharjar"],
  ["Warmth of Sunvei","holy","gerbanis",161,"1:Healing;1:Sunray;2:Healing Glow;2:Summer Place;3:Firon Power;3:Healing Warmth;4:Time of the Hunt;4:Breath of Sunvei;5:Healing Sun"],
  ["Wisdom of Windinna","holy","gerbanis",161,"1:Inspiration;1:Sixth Sense;2:Joy of Creating;2:Steel Mind;3:Wave of Truth;3:Vitner Protection;4:Swine Rush;4:Gaze of Windinna;5:Hearth of Windinna"],
  ["Wrath of Tyrd","holy","gerbanis",161,"1:Fire Iron;1:Battle Cry;2:Wolf Tongue;2:Pyre Mark;3:War Cry;3:Dark Visage;4:Firestorm;4:Thunder of Victory;5:Tyrd's Bellow"],
  ["Gift of Thanja","holy","ealdTradition",177,"1:Behind Tree and Pine;1:Animal Speech;2:Stagshape;2:Bestial Tongue;3:Salmonshape;3:Beneath Root and Rock;4:Dragon Tongue;4:Forest Denizen;5:Ravenshape"],
  ["Halawen's Offering","holy","ealdTradition",177,"1:Willpower of the Ancestors;1:Vitner Shield;2:Bloodfangsbane;2:Boldness of the Ancestors;3:Bolgemek;3:Witch Wall;4:Fearless;5:Mistur Barrier;5:Roggdrasil"],
  ["Heritage of Majne","holy","ealdTradition",177,"1:Strong Beer;1:Trollslayer;2:Giantslayer;2:King's Militia;3:Hero's Brew;3:King's Guard;4:Dragonslayer;4:King's Ale;5:The Nine Kings"],
  ["Magh's Gift","holy","ealdTradition",177,"1:Journey Wind;1:Rider's Melody;2:Magh's Tether;2:Elf Summer;3:Hero's Song;3:Magh's Chain;4:King's Anthem;5:Magh's Hawser;5:Harvest Year"],
  ["Nema's Usefulness","holy","ealdTradition",177,"1:Horse Ears;1:Gust of Release;2:Gloomy Trail;2:Owl Hearing;3:Freeing Breeze;3:Meall's Trail;4:Liberating Wind;4:Griffon's Sense;5:Mongfind's Travel"],
  ["Tribute of Morgu","holy","ealdTradition",177,"1:Simmering Blood;1:Battle Arrow;2:Boiling Blood;2:Rage;3:Shower of Arrows;3:Madness;4:Bloodfire;5:Riastarthae;5:Blacken the Sky"],
  ["Tablet of Anger","holy","tenetNid",195,"1:Power of Blood;1:Holy Bolt;2:Stone Senses;2:Visions of the Oak;3:Sacred Burst;3:Statue;4:Divine Purge;5:Memory of a Martyr;5:Stone Monument"],
  ["Tablet of Grace","holy","tenetNid",195,"1:Hand of Mercy;1:Holy Mending;2:Will of Bete Wiemdas;2:Life Spirit;3:Chalk of Bete Wiemdas;3:Recall;4:Breath of Gave;4:Hand of Gave;5:Wind of Immortality"],
  ["Tablet of the Knight","holy","tenetNid",195,"1:Blessed Armor;1:Blessed Spear;2:Holy Authority;2:Rowthguard Cuirass;3:Majestic Revelation;3:Rowthguard's Battle Scourge;4:Belo Seoth's White Armor;4:Belo Seoth's Axe;5:Guise of Gave"],
  ["Tablet of the Shield","holy","tenetNid",195,"1:Snares of the Holy Ground;1:Sheltering;2:Storm Protection;2:Thornwall;3:Bark Skin;3:Demonic Impotence;4:Vitner Resistance;5:Banishment;5:Tree Port"],
  ["Tablet of the Sun","holy","tenetNid",195,"1:Dawn Shine;1:Protective Ground;2:Augury;2:Thermal Light;3:Omen;3:Blessed Home;4:Sacred Grove;4:Holy Radiance;5:Portent"],
  ["Tablet of Voices","holy","tenetNid",195,"1:Holy Consideration;1:Sirowerd's Ear;2:Blood Brothers;2:Sirowerd's Tongue;3:Kindred's Bond;3:Grace of Gave;4:Sanity of Gave;5:Favorites of Gave;5:Divine Pact"],
  ["Power of the Beast","holy","haminges",213,"1:Resilience;1:Mind of the Predator;2:Mastomant's Tusks;2:Endurance of the Boar;3:Mastomant's Fur;3:Wolf Claws;4:Endurance of the Giant;4:Master of Wolfkin;5:Mastomantshape"],
  ["Power of the Dragon","holy","haminges",213,"1:Constriction;1:Rampage of the Huvfurwurm;2:Flame Hardened;2:Paralyzing Gaze;3:Dragon Skin;3:Attack of the Huvfurwurm;4:Head of the Huvfurwurm;5:Dragon Soul;5:Giant Snakeshape"],
  ["Power of Men","holy","haminges",213,"1:Sight of the Dwarves;1:Accomplished;2:Curative Draught;2:Mastery;3:Remedial Potion;3:Weapon Prowess;4:Dwarven Smith;4:Legendary;5:Life Elixir of the Devouress"],
  ["Power of the Scale","holy","haminges",213,"1:Dreadful Screech;1:Shattered Mind;2:Terrifying Howl;2:Regenerative Blood;3:Blood of the Lindwurm;3:Limb of Stone;4:Scream of the Devouress;5:Petrify;5:Heart of the Lindwurm"],
  ["Power of the Thurses","holy","haminges",213,"1:Skin of the Hrim Troll;1:Troll Strength;2:Mountain Ogre's Fury;2:Strength of the Stone Hinji;3:Mountain Ogre's Madness;3:Breath of the Hrim Troll;4:The Destroyer's Rage;4:Thurse Strength;5:The Hrim Troll's Rime Body"],
  ["Power of Trolls","holy","haminges",213,"1:Disease Carrier;1:Willpower;2:Illusion Tricks;2:Fearless;3:Contagious;3:Persuade;4:Lord of the Flies;4:Troll Wit;5:Taken by the Mountain"],
  ...["Anvil Shock","Borjorn's Hand","Cave Spider's Grip","Earthquake","Fang of Yukk","Gills of the Blackfish","Hammer Fists","Healing Rune","Heat of the Depths","Labyrinth Blood","Mark of Brokk","Power of Repair","Scales","Stoneling","Stone to Clay","Stoneshape","Well of Water"].map(name => [name,"holy","thuuldom",230,`1:${name}`]),
  ["Animal Mind","holy","toikalokke",238,"1:Animal Friend;1:Animal Tracks;2:Talk to Animals;2:Invisible to Animals;3:Animal Spirit;4:Animal Master;5:Animal Shape"],
  ["Lynx Power","holy","toikalokke",238,"1:Orientation;1:Tree Walk;2:Hearing;2:Feline Leap;3:Feline Reflexes;3:Aim;3:Track;4:Concealment;4:Forest Path;5:Pathfinder"],
  ["Master of Elements","holy","toikalokke",238,"1:Earth Wall;1:Control Fire;1:Purify Water;1:Gift of Water;2:Fire Tamer;2:Shape Earth;2:Elemental Arrow;3:Earthquake;3:Spring of Water;4:Control Wind;4:Hot and Cold;5:Fire Resistant"]
];

export const TABLET_CATALOG = DEFINITIONS.map(([name, tabletType, religion, page, encoded]) => {
  const id = `${tabletType}-${religion ? `${slug(religion)}-` : ""}${slug(name)}`;
  const powerType = tabletType === "vitner" ? "spell" : "divineFeat";
  return {
    id, name, tabletType, religion, page,
    powers: encoded.split(";").map((entry, index) => {
      const separator = entry.indexOf(":");
      const level = Number(entry.slice(0, separator));
      const powerName = entry.slice(separator + 1);
      return {id: `${id}:${slug(powerName)}:${index}`, name: powerName, level, type: powerType, cost: level * 2, modifier: level * -2};
    })
  };
});

export const TABLET_BY_ID = new Map(TABLET_CATALOG.map(tablet => [tablet.id, tablet]));

export function tabletItemData(tablet, resolvers = {}) {
  const localize = resolvers.localize ?? defaultLocalize;
  const format = resolvers.format ?? defaultFormat;
  const runeSummary = tablet.religion === "thuuldom" && tablet.powers[0] ? localize(`TRUDVANG.Content.Power.${tablet.powers[0].id}.Summary`) : "";
  const name = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
  const theme = localize(`TRUDVANG.Content.Theme.${tablet.id}`);
  const description = theme
    || (runeSummary ? format("TRUDVANG.Content.ThuulRunePrefix", {summary: runeSummary.charAt(0).toLowerCase() + runeSummary.slice(1)}) : "")
    || format("TRUDVANG.Description.TabletSummary", {name});
  return {
    name,
    type: "tablet",
    img: tablet.tabletType === "vitner" ? "icons/svg/book.svg" : "icons/svg/holy-shield.svg",
    flags: {"trudvang-chronicles": {catalogId: tablet.id}},
    system: {
      catalogId: tablet.id,
      description,
      source: format("TRUDVANG.Description.SourcePage", {page: tablet.page}),
      level: 1, tabletType: tablet.tabletType, religion: tablet.religion
    }
  };
}

export function powerItemData(power, tablet, resolvers = {}) {
  const localize = resolvers.localize ?? defaultLocalize;
  const format = resolvers.format ?? defaultFormat;
  const name = localize(`TRUDVANG.Content.Power.${power.id}.Name`, power.name);
  const tabletLabel = localize(`TRUDVANG.Content.Tablet.${tablet.id}.Name`, tablet.name);
  return {
    name,
    type: power.type,
    img: power.type === "spell" ? "icons/svg/daze.svg" : "icons/svg/angel.svg",
    flags: {"trudvang-chronicles": {catalogId: power.id, tabletId: tablet.id}},
    system: {
      catalogId: power.id, tabletId: tablet.id, tablet: tabletLabel,
      description: localize(`TRUDVANG.Content.Power.${power.id}.Summary`) || format("TRUDVANG.Description.PowerSummary", {name, tablet: tabletLabel}),
      source: format("TRUDVANG.Description.SourcePage", {page: tablet.page}),
      level: power.level, cost: power.cost, modifier: power.modifier
    }
  };
}
