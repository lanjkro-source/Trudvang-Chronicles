const knowledge = (id, name, specialties) => ({id, name, label: `TRUDVANG.Knowledge.${id}`, specialties: specialties.map(([childId, childName]) => ({id: childId, name: childName, label: `TRUDVANG.Knowledge.${childId}`}))});

export const TRUDVANG = {
  skills: {
    agility: "TRUDVANG.Skill.Agility",
    care: "TRUDVANG.Skill.Care",
    entertainment: "TRUDVANG.Skill.Entertainment",
    faith: "TRUDVANG.Skill.Faith",
    fighting: "TRUDVANG.Skill.Fighting",
    knowledge: "TRUDVANG.Skill.Knowledge",
    shadowArts: "TRUDVANG.Skill.ShadowArts",
    vitnerCraft: "TRUDVANG.Skill.VitnerCraft",
    wilderness: "TRUDVANG.Skill.Wilderness"
  },
  skillDescriptions: {
    agility: "TRUDVANG.SkillDescription.agility",
    care: "TRUDVANG.SkillDescription.care",
    entertainment: "TRUDVANG.SkillDescription.entertainment",
    faith: "TRUDVANG.SkillDescription.faith",
    fighting: "TRUDVANG.SkillDescription.fighting",
    knowledge: "TRUDVANG.SkillDescription.knowledge",
    shadowArts: "TRUDVANG.SkillDescription.shadowArts",
    vitnerCraft: "TRUDVANG.SkillDescription.vitnerCraft",
    wilderness: "TRUDVANG.SkillDescription.wilderness"
  },
  traits: {
    charisma: "TRUDVANG.Trait.Charisma",
    constitution: "TRUDVANG.Trait.Constitution",
    dexterity: "TRUDVANG.Trait.Dexterity",
    intelligence: "TRUDVANG.Trait.Intelligence",
    perception: "TRUDVANG.Trait.Perception",
    psyche: "TRUDVANG.Trait.Psyche",
    strength: "TRUDVANG.Trait.Strength"
  },
  races: {
    human: {label: "TRUDVANG.Race.Human", body: 32, movement: 10},
    elf: {label: "TRUDVANG.Race.Elf", body: 30, movement: 12},
    buratja: {label: "TRUDVANG.Race.Buratja", body: 28, movement: 8},
    borjornikka: {label: "TRUDVANG.Race.Borjornikka", body: 30, movement: 8},
    zvorda: {label: "TRUDVANG.Race.Zvorda", body: 34, movement: 6},
    halfElf: {label: "TRUDVANG.Race.HalfElf", body: 30, movement: 11},
    changeling: {label: "TRUDVANG.Race.Changeling", body: 26, movement: 11},
    grayBrute: {label: "TRUDVANG.Race.GrayBrute", body: 34, movement: 11},
    ogro: {label: "TRUDVANG.Race.Ogro", body: 38, movement: 12}
  },
  vitnerTypes: {
    hwitalja: {label: "TRUDVANG.Knowledge.hwitalja", capacityPerLevel: 10, perfectSuccessMax: 2, fatalThreshold: 10},
    darkhwitalja: {label: "TRUDVANG.Knowledge.darkhwitalja", capacityPerLevel: 20, perfectSuccessMax: 0, fatalThreshold: 8},
    vaagritalja: {label: "TRUDVANG.Knowledge.vaagritalja", capacityPerLevel: 15, perfectSuccessMax: 1, fatalThreshold: 9}
  },
  religions: {
    gerbanis: {label: "TRUDVANG.Religion.Gerbanis", specialty: "stormkelt"},
    tenetNid: {label: "TRUDVANG.Religion.TenetNid", specialty: "gavlian"},
    ealdTradition: {label: "TRUDVANG.Religion.EaldTradition", specialty: "bruid"},
    haminges: {label: "TRUDVANG.Religion.Haminges", specialty: "noaj"},
    thuuldom: {label: "TRUDVANG.Religion.Thuuldom", specialty: "thuulForging"},
    toikalokke: {label: "TRUDVANG.Religion.Toikalokke", specialty: "ihana"}
  },
  raceReligions: {
    human: ["gerbanis", "tenetNid", "ealdTradition", "haminges"],
    elf: ["toikalokke"],
    buratja: ["thuuldom"],
    borjornikka: ["thuuldom"],
    zvorda: ["thuuldom", "haminges"],
    halfElf: ["gerbanis", "tenetNid", "ealdTradition", "haminges", "toikalokke"],
    changeling: ["gerbanis", "tenetNid", "ealdTradition", "haminges"],
    grayBrute: ["gerbanis", "tenetNid", "ealdTradition", "haminges"],
    ogro: ["gerbanis", "tenetNid", "ealdTradition", "haminges"]
  },
  cultures: {
    stormlander: "TRUDVANG.Culture.Stormlander", mittlander: "TRUDVANG.Culture.Mittlander", virann: "TRUDVANG.Culture.Virann", wildfolk: "TRUDVANG.Culture.Wildfolk",
    korpikalli: "TRUDVANG.Culture.Korpikalli", illmalaini: "TRUDVANG.Culture.Illmalaini", buratja: "TRUDVANG.Culture.Buratja", borjornikka: "TRUDVANG.Culture.Borjornikka",
    changeling: "TRUDVANG.Culture.Changeling",
    dyfir: "TRUDVANG.Culture.Dyfir", zvorda: "TRUDVANG.Culture.Zvorda", grayBrute: "TRUDVANG.Culture.GrayBrute", barkbrule: "TRUDVANG.Culture.Barkbrule", ogro: "TRUDVANG.Culture.Ogro"
  },
  nativeLanguages: {
    eika: "TRUDVANG.Language.Eika", futhark: "TRUDVANG.Language.Futhark", rona: "TRUDVANG.Language.Rona", vrok: "TRUDVANG.Language.Vrok", wildVrok: "TRUDVANG.Language.WildVrok"
  },
  raceCultures: {
    human: ["stormlander", "mittlander", "virann", "wildfolk"],
    elf: ["illmalaini", "korpikalli"],
    buratja: ["buratja"],
    borjornikka: ["borjornikka"],
    zvorda: ["zvorda"],
    halfElf: ["dyfir", "barkbrule", "illmalaini", "korpikalli", "stormlander", "mittlander", "virann", "wildfolk"],
    changeling: ["changeling", "stormlander", "mittlander", "virann", "wildfolk"],
    grayBrute: ["grayBrute", "stormlander", "mittlander", "virann", "wildfolk"],
    ogro: ["ogro", "stormlander", "mittlander", "virann", "wildfolk"]
  },
  cultureLanguages: {
    stormlander: ["vrok"],
    mittlander: ["rona", "vrok"],
    virann: ["rona"],
    wildfolk: ["wildVrok"],
    illmalaini: ["eika"],
    korpikalli: ["eika"],
    buratja: ["futhark"],
    borjornikka: ["futhark"],
    zvorda: ["futhark"],
    dyfir: ["eika", "rona", "vrok"],
    barkbrule: ["eika", "rona", "vrok"],
    changeling: ["rona", "vrok", "wildVrok"],
    grayBrute: ["rona", "vrok", "wildVrok"],
    ogro: ["rona", "vrok", "wildVrok"],
    halfElf: ["eika", "rona", "vrok"],
    halfTroll: ["rona", "vrok", "wildVrok"]
  },
  archetypes: {
    bard: {label: "TRUDVANG.Archetype.Bard", core: ["knowledge", "entertainment"]},
    dimwalker: {label: "TRUDVANG.Archetype.Dimwalker", core: ["knowledge", "faith"]},
    dweller: {label: "TRUDVANG.Archetype.Dweller", core: ["knowledge", "care"]},
    ranger: {label: "TRUDVANG.Archetype.Ranger", core: ["knowledge", "wilderness"]},
    rogue: {label: "TRUDVANG.Archetype.Rogue", core: ["knowledge", "shadowArts"]},
    vitnerWeaver: {label: "TRUDVANG.Archetype.VitnerWeaver", core: ["knowledge", "vitnerCraft"]},
    warrior: {label: "TRUDVANG.Archetype.Warrior", core: ["knowledge", "fighting"]}
  },
  knowledgeTree: {
    agility: [
      knowledge("bodyControl", "Body Control", [["ambidexterity", "Ambidexterity"], ["jestering", "Jestering"], ["jumpingClimbingBalancing", "Jumping, Climbing & Balancing"], ["swimming", "Swimming"]]),
      knowledge("horsemanship", "Horsemanship", [["drivingWagon", "Driving Wagon"], ["riding", "Riding"]]),
      knowledge("battleManeuver", "Battle Maneuver", [["combatMovement", "Combat Movement"], ["evade", "Evade"], ["ironclad", "Ironclad"]])
    ],
    care: [
      knowledge("handler", "Handler", [["commander", "Commander"], ["sage", "Sage"]]),
      knowledge("handicraft", "Handicraft", [["counterfeiting", "Counterfeiting"], ["hardMaterials", "Hard Materials"], ["softMaterials", "Soft Materials"]]),
      knowledge("tradesman", "Tradesman", [["barber", "Barber"], ["brewer", "Brewer"], ["cook", "Cook"], ["peasant", "Peasant"], ["trader", "Trader"]]),
      knowledge("healingDrugs", "Healing & Drugs", [["extractsPotions", "Extracts & Potions"], ["firstAidNursing", "First Aid & Nursing"]])
    ],
    entertainment: [
      knowledge("gambling", "Gambling", [["cheater", "Cheater"], ["gameStrategist", "Game Strategist"], ["greatGambler", "Great Gambler"]]),
      knowledge("musicDancing", "Music & Dancing", [["dance", "Dance"], ["singingPlayingInstruments", "Singing & Playing Instruments"]]),
      knowledge("storytelling", "Storytelling", [["acting", "Acting"], ["libel", "Libel"]])
    ],
    faith: [
      knowledge("godFocus", "God Focus", [["composed", "Composed"], ["lightningQuickInvocation", "Lightning-Quick Invocation"], ["potent", "Potent"], ["rigorous", "Rigorous"]]),
      knowledge("divinePower", "Divine Power", [["faithful", "Faithful"], ["powerful", "Powerful"]]),
      knowledge("invoke", "Invoke", [["bruid", "Bruid"], ["gavlian", "Gavlian"], ["ihana", "Ihana"], ["noaj", "Noaj"], ["thuulForging", "Thuul Forging"], ["stormkelt", "Stormkelt"]])
    ],
    fighting: [
      knowledge("armedFighting", "Armed Fighting", [["oneHandedLightWeapons", "1H Light Weapons"], ["oneHandedHeavyWeapons", "1H Heavy Weapons"], ["throwingWeapons", "Throwing Weapons"], ["shieldBearer", "Shield Bearer"], ["twoHandedWeapons", "Two-Handed Weapons"], ["crossbow", "Crossbow"], ["bowsSlings", "Bows & Slings"]]),
      knowledge("unarmedFighting", "Unarmed Fighting", [["brawling", "Brawling"], ["wrestling", "Wrestling"]]),
      knowledge("battleExperience", "Battle Experience", [["armorBearer", "Armor Bearer"], ["combatActions", "Combat Actions"], ["combatReaction", "Combat Reaction"], ["crossbowLoader", "Crossbow Loader"], ["fighter", "Fighter"]])
    ],
    knowledge: [
      knowledge("cultureKnowledge", "Culture Knowledge", [["customsLaw", "Customs & Law"], ["loreLegends", "Lore & Legends"], ["religion", "Religion"]]),
      knowledge("learning", "Learning", [["insight", "Insight"]]),
      knowledge("raceKnowledge", "Race Knowledge", [["monsterLore", "Monster Lore"], ["spiritLore", "Spirit Lore"]]),
      knowledge("language", "Language", [["bribery", "Bribery"], ["calculate", "Calculate"], ["foreignTongue", "Foreign Tongue"], ["motherTongue", "Mother Tongue"], ["readWrite", "Read & Write"], ["silvertongue", "Silvertongue"]])
    ],
    shadowArts: [
      knowledge("shadowing", "Shadowing", [["camouflageHiding", "Camouflage & Hiding"], ["findingSpotting", "Finding & Spotting"], ["sneakAttack", "Sneak Attack"], ["walkingShadows", "Walking in Shadows"]]),
      knowledge("thievery", "Thievery", [["disguise", "Disguise"], ["locksTraps", "Locks & Traps"], ["stealing", "Stealing"], ["shadowWorld", "Shadow World"], ["thiefSigns", "Thief Signs"]])
    ],
    vitnerCraft: [
      knowledge("vitnerFocus", "Vitner Focus", [["potency", "Potency"], ["safeWeaving", "Safe-weaving"], ["strenuous", "Strenuous"]]),
      knowledge("vitnerShaping", "Vitner Shaping", [["galding", "Galding"], ["sejding", "Sejding"], ["vitnerRunes", "Vitner Runes"], ["vyrding", "Vyrding"]]),
      knowledge("callVitner", "Call of Vitner", [["hwitalja", "Hwitalja"], ["darkhwitalja", "Darkhwitalja"], ["vaagritalja", "Vaagritalja"], ["vitnerHabit", "Vitner Habit"]])
    ],
    wilderness: [
      knowledge("geography", "Geography", [["cityKnowledge", "City Knowledge"], ["landKnowledge", "Land Knowledge"], ["orienteeringCartography", "Orienteering & Cartography"], ["seaKnowledge", "Sea Knowledge"]]),
      knowledge("huntingExperience", "Hunting Experience", [["carveButcher", "Carve & Butcher"], ["huntingFishing", "Hunting & Fishing"], ["speciesHunter", "Species Hunter"], ["tracker", "Tracker"], ["wildernessSigns", "Wilderness Signs"]]),
      knowledge("natureKnowledge", "Nature Knowledge", [["animalFriend", "Animal Friend"], ["botany", "Botany"], ["weatherman", "Weatherman"], ["zoology", "Zoology"]]),
      knowledge("seafarer", "Seafarer", [["navigation", "Navigation"], ["seaman", "Seaman"]]),
      knowledge("survival", "Survival", [["camper", "Camper"], ["pathwalker", "Pathwalker"], ["terrainExperience", "Terrain Experience"], ["weathered", "Weathered"]])
    ]
  },
  knowledgeDescriptions: {
    strenuous: "TRUDVANG.KnowledgeDescription.strenuous"
  },
  itemTypes: ["weapon", "armor", "shield", "gear", "potion", "spell", "tablet", "divineFeat", "ability"],
  actorItemGroups: {
    weapons: ["weapon"],
    protection: ["armor", "shield"],
    equipment: ["gear", "potion"],
    magic: ["spell", "tablet", "divineFeat"],
    abilities: ["ability"]
  },
  traitChoices: [-4, -2, -1, 0, 1, 2, 4],
  disciplineCosts: {1: 7, 2: 14, 3: 21, 4: 28, 5: 35},
  spellCosts: {1: 2, 2: 4, 3: 6, 4: 8, 5: 10}
};
