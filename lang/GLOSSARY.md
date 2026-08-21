# Glossaire bilingue anglais–français

Ce glossaire constitue la référence terminologique pour les traductions du système Trudvang. Il est régénéré à partir de `lang/en.json` et `lang/fr.json`, y compris la section `TRUDVANG.Content` (bibliothèque de démarrage et catalogue de tablettes), désormais traduite. Les résumés longs des pouvoirs (`*.Summary`) sont exclus : ce sont des citations de règles, pas des termes de vocabulaire.

La terminologie française s'appuie sur l'édition officielle Black Book Éditions (« Livre des règles », miroir texte dans `game doc/markdown-fr/`). Avant d'ajouter ou de modifier une entrée dans les fichiers de langue, rechercher ici les termes apparentés et conserver les choix terminologiques existants. Toute nouvelle terminologie validée doit être répercutée dans ce document.

## `TYPES.Actor`

| Clé | English | Français |
|---|---|---|
| `TYPES.Actor.character` | Character | Personnage |
| `TYPES.Actor.npc` | Non-Player Character | PNJ |

## `TYPES.Item`

| Clé | English | Français |
|---|---|---|
| `TYPES.Item.weapon` | Weapon | Arme |
| `TYPES.Item.armor` | Armor | Armure |
| `TYPES.Item.shield` | Shield | Bouclier |
| `TYPES.Item.gear` | Gear | Équipement |
| `TYPES.Item.potion` | Extract / Potion | Extrait / Potion |
| `TYPES.Item.spell` | Spell | Sortilège |
| `TYPES.Item.tablet` | Tablet | Tablette |
| `TYPES.Item.divineFeat` | Divine Feat | Pouvoir divin |
| `TYPES.Item.ability` | Discipline / Specialty | Discipline / Specialité |

## `TRUDVANG.Sheets`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Sheets.Character` | Trudvang Character Sheet | Feuille de personnage |
| `TRUDVANG.Sheets.Npc` | Trudvang Compact NPC Sheet | Feuille de PNJ |
| `TRUDVANG.Sheets.Item` | Trudvang Item Sheet | Feuille d'objet |

## `TRUDVANG.Settings`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Settings.StarterContentName` | Starter content version | Starter content version |
| `TRUDVANG.Settings.StarterContentHint` | Tracks the installed Trudvang starter library. | Tracks the installed Trudvang starter library. |

## `TRUDVANG.Tab`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Tab.Summary` | Summary | Résumé |
| `TRUDVANG.Tab.Skills` | Skills | Compétences |
| `TRUDVANG.Tab.Equipment` | Equipment | Équipement |
| `TRUDVANG.Tab.Magic` | Magic & Faith | Magie & Foi |
| `TRUDVANG.Tab.Notes` | Notes | Notes |
| `TRUDVANG.Tab.Actions` | Actions | Actions |

## `TRUDVANG.Section`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Section.Traits` | Character Traits | Traits de personnage |
| `TRUDVANG.Section.Status` | Status | État |
| `TRUDVANG.Section.Experience` | Creation & Experience | Création & Expérience |
| `TRUDVANG.Section.QuickActions` | Quick Actions | Actions Rapides |
| `TRUDVANG.Section.Skills` | Skills | Compétences |
| `TRUDVANG.Section.Disciplines` | Disciplines & Specialties | Disciplines & Spécialités |
| `TRUDVANG.Section.Weapons` | Weapons | Armes |
| `TRUDVANG.Section.Protection` | Armor & Shields | Armure & Boucliers |
| `TRUDVANG.Section.Gear` | Gear & Extracts | Équipement & Extraits |
| `TRUDVANG.Section.Magic` | Tablets, Spells & Divine Feats | Tablettes, Sortilèges & Pouvoirs divins |
| `TRUDVANG.Section.Appearance` | Appearance | Apparence |
| `TRUDVANG.Section.History` | History | Histoire |
| `TRUDVANG.Section.Notes` | Notes | Notes |
| `TRUDVANG.Section.Description` | Description | Description |
| `TRUDVANG.Section.Affinities` | Magical & Religious Affinities | Affinités magiques & religieuses |

## `TRUDVANG.Action`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Action.Roll` | Roll | Jet de dé |
| `TRUDVANG.Action.Cancel` | Cancel | Annuler |
| `TRUDVANG.Action.Use` | Use | Utiliser |
| `TRUDVANG.Action.Damage` | Damage | Dégâts |
| `TRUDVANG.Action.Parry` | Parry | Parer |
| `TRUDVANG.Action.RollDamage` | Roll Damage | Jet de Dégâts |
| `TRUDVANG.Action.RollInitiative` | Roll Initiative | Jet d'initiative |
| `TRUDVANG.Action.ResetCombat` | Reset Combat Points | Réinitialiser les points de combat |
| `TRUDVANG.Action.AdvanceSkill` | Buy the next Skill Value with Adventure Points | Acheter la valeur de compétence suivante avec les points d'aventure |
| `TRUDVANG.Action.AdvanceItem` | Buy the next level with Adventure Points | Acheter le prochain niveau avec les points d'aventure |
| `TRUDVANG.Action.StartCreation` | Character creation mode | Mode création de personnage |
| `TRUDVANG.Action.FinishCreation` | Finish character creation | Terminer la création |
| `TRUDVANG.Action.ConfirmAdvancement` | Confirm | Valider |
| `TRUDVANG.Action.CancelAdvancement` | Cancel and refund | Annuler et rembourser |
| `TRUDVANG.Action.AddKnowledge` | Add discipline or specialty | Ajouter une discipline ou spécialité |
| `TRUDVANG.Action.Add` | Add | Ajouter |
| `TRUDVANG.Action.Close` | Close | Fermer |
| `TRUDVANG.Action.AddTablet` | Add a compatible tablet | Ajouter une tablette compatible |
| `TRUDVANG.Action.ToggleTree` | Expand or collapse | Déplier ou replier |
| `TRUDVANG.Action.HideUnlearned` | Hide level-0 knowledge | Masquer les compétences à 0 |
| `TRUDVANG.Action.ShowUnlearned` | Show level-0 knowledge | Afficher les compétences à 0 |
| `TRUDVANG.Action.HideInactiveMagic` | Hide inaccessible powers | Masquer les pouvoirs inaccessibles |
| `TRUDVANG.Action.ShowInactiveMagic` | Show inaccessible powers | Afficher les pouvoirs inaccessibles |
| `TRUDVANG.Action.ExpandAll` | Expand the entire skill tree | Déplier toute l'arborescence des compétences |
| `TRUDVANG.Action.CollapseAll` | Collapse the entire skill tree | Replier toute l'arborescence des compétences |
| `TRUDVANG.Action.Delete` | Delete | Supprimer |

## `TRUDVANG.Field`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Field.Name` | Name | Nom |
| `TRUDVANG.Field.Race` | Race | Race |
| `TRUDVANG.Field.Culture` | Culture | Culture |
| `TRUDVANG.Field.Archetype` | Archetype | Archétype |
| `TRUDVANG.Field.NativeLanguage` | Mother Tongue | Langue maternelle |
| `TRUDVANG.Field.Religion` | Religion | Religion |
| `TRUDVANG.Field.CreatureType` | Type | Type |
| `TRUDVANG.Field.Size` | Size | Taille |
| `TRUDVANG.Field.FearFactor` | Fear Factor | Facteur de peur |
| `TRUDVANG.Field.SV` | SV | VC |
| `TRUDVANG.Field.Bonus` | Bonus | Bonus |
| `TRUDVANG.Field.CreationTotal` | Creation Points | Points de création |
| `TRUDVANG.Field.BuildCost` | Calculated build cost | Coût calculé |
| `TRUDVANG.Field.CreationRemaining` | Remaining | PC Restant |
| `TRUDVANG.Field.AdventurePoints` | Adventure Points | Points d'aventure |
| `TRUDVANG.Field.PendingAdventurePoints` | Pending Adventure Points | PA en attente |
| `TRUDVANG.Field.AdventureSpent` | Adventure Points spent | PA dépensés |
| `TRUDVANG.Field.Unassigned` | Unassigned | Non rattaché |
| `TRUDVANG.Field.CostTrait` | Trait affecting cost | Trait modifiant le coût |
| `TRUDVANG.Field.Automatic` | Automatic | Automatique |
| `TRUDVANG.Field.CoreBonus` | Core-skill bonus | Bonus de compétences principales |
| `TRUDVANG.Field.CoreBonusHint` | Up to 50 creation points are automatically applied first to Knowledge and the archetype's other core skill. | Jusqu'à 50 points de création sont automatiquement dépensés en priorité dans Connaissances et l'autre compétence principale de l'archétype. |
| `TRUDVANG.Field.CoreSkill` | Archetype core skill | Compétence principale de l'archétype |
| `TRUDVANG.Field.Quantity` | Quantity | Quantité |
| `TRUDVANG.Field.Weight` | Weight (kg) | Poids (kg) |
| `TRUDVANG.Field.Value` | Value (silver coins) | Valeur (pièces d'argent) |
| `TRUDVANG.Field.Category` | Category | Catégorie |
| `TRUDVANG.Field.Damage` | Damage Formula | Dégâts |
| `TRUDVANG.Field.OpenRoll` | Open Roll Threshold (0 = none) | Seuil de jet ouvert (0 = aucun) |
| `TRUDVANG.Field.WeaponActions` | Weapon Actions | Actions d'arme |
| `TRUDVANG.Field.AttackValue` | Default CP per Attack | Nombre de CP par attaque |
| `TRUDVANG.Field.InitiativeModifier` | Initiative Modifier | Modificateur d'initiative |
| `TRUDVANG.Field.VitnerType` | Vitner Type | Type d'enchanteur |
| `TRUDVANG.Field.PerfectSuccess` | Perfect Success on | Réussite parfaite sur |
| `TRUDVANG.Field.NoPerfectSuccess` | No perfect success | Aucune réussite parfaite |
| `TRUDVANG.Field.FatalDie` | Fatal Effect Die | Dé de magie funeste |
| `TRUDVANG.Field.Protection` | Protection Value | Valeur de protection (VP) |
| `TRUDVANG.Field.Breach` | Breach Value / Maximum | Valeur d'intégrité (VI) / Maximum |
| `TRUDVANG.Field.Equipped` | Equipped | Équipé |
| `TRUDVANG.Field.Heft` | Heft | Encombrement |
| `TRUDVANG.Field.MovementModifier` | Movement Modifier | Modificateur de mouvement |
| `TRUDVANG.Field.Strength` | Extract Strength | Force de l'extrait |
| `TRUDVANG.Field.Application` | Application | Application |
| `TRUDVANG.Field.Duration` | Duration | Durée |
| `TRUDVANG.Field.Effect` | Effect | Effet |
| `TRUDVANG.Field.Level` | Level | Niveau |
| `TRUDVANG.Field.Cost` | Cost | Coût |
| `TRUDVANG.Field.Modifier` | Skill Modifier | Modificateur de compétence |
| `TRUDVANG.Field.Tablet` | Tablet | Tablette |
| `TRUDVANG.Field.Range` | Range | Portée |
| `TRUDVANG.Field.WeavingTime` | Weaving Time | Temps de tissage |
| `TRUDVANG.Field.TabletType` | Tablet Type | Type de tablette |
| `TRUDVANG.Field.AbilityKind` | Knowledge Type | Type de connaissance |
| `TRUDVANG.Field.ParentSkill` | Parent Skill | Compétence parente |
| `TRUDVANG.Field.ParentDiscipline` | Parent Discipline | Discipline parente |
| `TRUDVANG.Field.RollBonus` | Bonus per Level | Bonus par niveau |
| `TRUDVANG.Field.Source` | Source | Source |
| `TRUDVANG.Field.ActiveSpell` | Currently maintained spell | Sortilège actuellement maintenu |
| `TRUDVANG.Field.ActiveCost` | Vitner cost when activated | Coût en vitner lors de l'activation |
| `TRUDVANG.Field.Summary` | Summary | Résumé |

## `TRUDVANG.Resource`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Resource.Body` | Body Points | Points de santé (PS) |
| `TRUDVANG.Resource.Combat` | Combat Points | Points de combat (CP) |
| `TRUDVANG.Resource.Raud` | Raud | Raud |
| `TRUDVANG.Resource.Fear` | Fear | Peur |
| `TRUDVANG.Resource.Vitner` | Vitner Points | Points de vitner |
| `TRUDVANG.Resource.Divinity` | Divinity Points | Points de divinité |
| `TRUDVANG.Resource.Initiative` | Initiative | Initiative |
| `TRUDVANG.Resource.Movement` | Movement | Mouvement |
| `TRUDVANG.Resource.Protection` | Protection | Protection |
| `TRUDVANG.Resource.DamageLevel` | Damage Level | Niveau de dégâts |
| `TRUDVANG.Resource.FearPenalty` | Fear Penalty | Pénalité de peur |
| `TRUDVANG.Resource.PersistenceInWild` | Persistence in the Wild | Persistance dans la nature |
| `TRUDVANG.Resource.VitnerCost` | Vitner Point Cost | Coût en points de vitner |
| `TRUDVANG.Resource.DivinityCost` | Divinity Point Cost | Coût en points de divinité |

## `TRUDVANG.Trait`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Trait.Charisma` | Charisma | Charisme |
| `TRUDVANG.Trait.Constitution` | Constitution | Constitution |
| `TRUDVANG.Trait.Dexterity` | Dexterity | Dextérité |
| `TRUDVANG.Trait.Intelligence` | Intelligence | Intelligence |
| `TRUDVANG.Trait.Perception` | Perception | Perception |
| `TRUDVANG.Trait.Psyche` | Psyche | Psychisme |
| `TRUDVANG.Trait.Strength` | Strength | Force |

## `TRUDVANG.Skill`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Skill.Agility` | Agility | Agilité |
| `TRUDVANG.Skill.Care` | Care | Savoir-faire |
| `TRUDVANG.Skill.Entertainment` | Entertainment | Divertissement |
| `TRUDVANG.Skill.Faith` | Faith | Foi |
| `TRUDVANG.Skill.Fighting` | Fighting | Combat |
| `TRUDVANG.Skill.Knowledge` | Knowledge | Connaissances |
| `TRUDVANG.Skill.ShadowArts` | Shadow Arts | Arts des ombres |
| `TRUDVANG.Skill.VitnerCraft` | Vitner Craft | Maîtrise du vitner |
| `TRUDVANG.Skill.Wilderness` | Wilderness | Nature |

## `TRUDVANG.SkillDescription`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.SkillDescription.agility` | Agility governs balance, movement, riding, evasion, and other feats of bodily control. | Agilité régit l'équilibre, le mouvement, l'équitation, l'esquive et les autres prouesses de contrôle corporel. |
| `TRUDVANG.SkillDescription.care` | Care covers crafts, treatment, leadership, trade, extracts, and practical professional work. | Savoir-faire couvre l'artisanat, les soins, le commandement, le commerce, les extraits et poisons et les métiers pratiques. |
| `TRUDVANG.SkillDescription.entertainment` | Entertainment covers performance, music, dance, storytelling, and games of chance. | Divertissement couvre le spectacle, la musique, la danse, les récits et les jeux de hasard. |
| `TRUDVANG.SkillDescription.faith` | Faith governs religious knowledge, invocations, divine power, and access to Holy Tablets. | Foi régit le savoir religieux, les invocations, la puissance divine et l'accès aux tablettes sacrées. |
| `TRUDVANG.SkillDescription.fighting` | Fighting governs armed and unarmed combat, defensive reactions, and battle experience. | Combat régit les affrontements armés ou à mains nues, les réactions défensives et l'expérience de la bataille. |
| `TRUDVANG.SkillDescription.knowledge` | Knowledge covers languages, cultures, learning, religion, lore, and scholarly insight. | Connaissances couvre les langues, les cultures, l'étude, la religion, les légendes et l'érudition. |
| `TRUDVANG.SkillDescription.shadowArts` | Shadow Arts covers stealth, disguise, theft, traps, and covert observation. | Arts des ombres couvre la discrétion, le déguisement, le vol, les pièges et l'observation clandestine. |
| `TRUDVANG.SkillDescription.vitnerCraft` | Vitner Craft governs perceiving, calling, and shaping vitner through spells and Vitner Tablets. | Maîtrise du vitner régit la perception, l'appel et le modelage du vitner par les sortilèges et les tablettes de vitner. |
| `TRUDVANG.SkillDescription.wilderness` | Wilderness covers travel, survival, hunting, navigation, nature, and seafaring. | Nature couvre le voyage, la survie, la chasse, la navigation, le monde naturel et la vie maritime. |

## `TRUDVANG.Race`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Race.Human` | Human | Humain |
| `TRUDVANG.Race.Elf` | Elf | Elfe |
| `TRUDVANG.Race.Buratja` | Buratja Dwarf | Nain buratja |
| `TRUDVANG.Race.Borjornikka` | Borjornikka Dwarf | Nain borjornikka |
| `TRUDVANG.Race.Zvorda` | Zvorda Dwarf | Zvorda (nain-troll) |
| `TRUDVANG.Race.HalfElf` | Half-Elf | Demi-elfe |
| `TRUDVANG.Race.Changeling` | Changeling | Changelin |
| `TRUDVANG.Race.GrayBrute` | Gray Brute | Brute grise |
| `TRUDVANG.Race.Ogro` | Ogro | Ogro |

## `TRUDVANG.Weapon`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Weapon.OneHandedLight` | One-Handed Light | Légère à une main |
| `TRUDVANG.Weapon.OneHandedHeavy` | One-Handed Heavy | Lourde à une main |
| `TRUDVANG.Weapon.TwoHanded` | Two-Handed | À deux mains |
| `TRUDVANG.Weapon.Ranged` | Ranged | À distance |
| `TRUDVANG.Weapon.Natural` | Natural | Naturelle |

## `TRUDVANG.Tablet`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Tablet.vitner` | Vitner Tablet | Tablette de vitner |
| `TRUDVANG.Tablet.holy` | Holy Tablet | Tablette sacrée |

## `TRUDVANG.AbilityKind`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.AbilityKind.discipline` | Discipline | Discipline |
| `TRUDVANG.AbilityKind.specialty` | Specialty | Spécialité |
| `TRUDVANG.AbilityKind.feat` | Creature Feat | Talent de créature |

## `TRUDVANG.Unit`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Unit.Days` | days | jours |

## `TRUDVANG.Culture`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Culture.Stormlander` | Stormlander | Stormlander |
| `TRUDVANG.Culture.Mittlander` | Mittlander | Mittlander |
| `TRUDVANG.Culture.Virann` | Virann | Virann |
| `TRUDVANG.Culture.Wildfolk` | Wildfolk | Sauvage |
| `TRUDVANG.Culture.Korpikalli` | Korpikalli | Korpikalla |
| `TRUDVANG.Culture.Illmalaini` | Illmalaini | Illmalaina |
| `TRUDVANG.Culture.Buratja` | Buratja | Buratja |
| `TRUDVANG.Culture.Borjornikka` | Borjornikka | Borjornikka |
| `TRUDVANG.Culture.Changeling` | Changeling | Changelin |
| `TRUDVANG.Culture.Dyfir` | Dyfir | Dyfir |
| `TRUDVANG.Culture.Zvorda` | Zvorda | Zvorda |
| `TRUDVANG.Culture.GrayBrute` | Gray Brute | Brute grise |
| `TRUDVANG.Culture.Barkbrule` | Barkbrule | Barkbrule |
| `TRUDVANG.Culture.Ogro` | Ogro | Ogro |

## `TRUDVANG.Language`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Language.Eika` | Eika | Eika |
| `TRUDVANG.Language.Futhark` | Futhark | Futhark |
| `TRUDVANG.Language.Rona` | Rona | Rona |
| `TRUDVANG.Language.Vrok` | Vrok | Vrok |
| `TRUDVANG.Language.WildVrok` | Wild Vrok | Vrok sauvage |

## `TRUDVANG.Archetype`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Archetype.Bard` | Bard | Barde |
| `TRUDVANG.Archetype.Dimwalker` | Dimwalker | Arpenteur des brumes |
| `TRUDVANG.Archetype.Dweller` | Dweller | Colon |
| `TRUDVANG.Archetype.Ranger` | Ranger | Rôdeur |
| `TRUDVANG.Archetype.Rogue` | Rogue | Malfrat |
| `TRUDVANG.Archetype.VitnerWeaver` | Vitner Weaver | Tisseur de vitner |
| `TRUDVANG.Archetype.Warrior` | Warrior | Guerrier |

## `TRUDVANG.Knowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Knowledge.bodyControl` | Body Control | Contrôle corporel |
| `TRUDVANG.Knowledge.ambidexterity` | Ambidexterity | Ambidextrie |
| `TRUDVANG.Knowledge.jestering` | Jestering | Jonglerie |
| `TRUDVANG.Knowledge.jumpingClimbingBalancing` | Jumping, Climbing & Balancing | Sauts, escalade & équilibre |
| `TRUDVANG.Knowledge.swimming` | Swimming | Natation |
| `TRUDVANG.Knowledge.horsemanship` | Horsemanship | Maîtrise équestre |
| `TRUDVANG.Knowledge.drivingWagon` | Driving Wagon | Conduite de chariot |
| `TRUDVANG.Knowledge.riding` | Riding | Equitation |
| `TRUDVANG.Knowledge.battleManeuver` | Battle Maneuver | Manœuvres de combat |
| `TRUDVANG.Knowledge.combatMovement` | Combat Movement | Mouvement de combat |
| `TRUDVANG.Knowledge.evade` | Evade | Esquive |
| `TRUDVANG.Knowledge.ironclad` | Ironclad | Cuirassé |
| `TRUDVANG.Knowledge.handler` | Handler | Diriger |
| `TRUDVANG.Knowledge.commander` | Commander | Commander |
| `TRUDVANG.Knowledge.sage` | Sage | Administrer |
| `TRUDVANG.Knowledge.handicraft` | Handicraft | Artisanat |
| `TRUDVANG.Knowledge.counterfeiting` | Counterfeiting | Contrefaçon |
| `TRUDVANG.Knowledge.hardMaterials` | Hard Materials | Matériaux durs |
| `TRUDVANG.Knowledge.softMaterials` | Soft Materials | Matériaux souples |
| `TRUDVANG.Knowledge.tradesman` | Tradesman | Commerce |
| `TRUDVANG.Knowledge.barber` | Barber | Barbier |
| `TRUDVANG.Knowledge.brewer` | Brewer | Brasseur |
| `TRUDVANG.Knowledge.cook` | Cook | Cuisinier |
| `TRUDVANG.Knowledge.peasant` | Peasant | Paysan |
| `TRUDVANG.Knowledge.trader` | Trader | Marchand |
| `TRUDVANG.Knowledge.healingDrugs` | Healing & Drugs | Soins & remèdes |
| `TRUDVANG.Knowledge.extractsPotions` | Extracts & Potions | Extraits & poisons |
| `TRUDVANG.Knowledge.firstAidNursing` | First Aid & Nursing | Premiers secours & soins |
| `TRUDVANG.Knowledge.gambling` | Gambling | Jeux |
| `TRUDVANG.Knowledge.cheater` | Cheater | Tricheur |
| `TRUDVANG.Knowledge.gameStrategist` | Game Strategist | Stratège de jeux |
| `TRUDVANG.Knowledge.greatGambler` | Great Gambler | Grand joueur |
| `TRUDVANG.Knowledge.musicDancing` | Music & Dancing | Musique & danse |
| `TRUDVANG.Knowledge.dance` | Dance | Danse |
| `TRUDVANG.Knowledge.singingPlayingInstruments` | Singing & Playing Instruments | Chants & instruments de musique |
| `TRUDVANG.Knowledge.storytelling` | Storytelling | Narration |
| `TRUDVANG.Knowledge.acting` | Acting | Comédie |
| `TRUDVANG.Knowledge.libel` | Libel | Calomnies |
| `TRUDVANG.Knowledge.godFocus` | God Focus | Concentration religieuse |
| `TRUDVANG.Knowledge.composed` | Composed | Sérénité |
| `TRUDVANG.Knowledge.lightningQuickInvocation` | Lightning-Quick Invocation | Invocation instantanée |
| `TRUDVANG.Knowledge.potent` | Potent | Transcendance |
| `TRUDVANG.Knowledge.rigorous` | Rigorous | Rigoureux |
| `TRUDVANG.Knowledge.divinePower` | Divine Power | Pouvoirs divins |
| `TRUDVANG.Knowledge.faithful` | Faithful | Dévotion |
| `TRUDVANG.Knowledge.powerful` | Powerful | Puissant |
| `TRUDVANG.Knowledge.invoke` | Invoke | Invocation |
| `TRUDVANG.Knowledge.bruid` | Bruid | Bruide |
| `TRUDVANG.Knowledge.gavlian` | Gavlian | Gavlien |
| `TRUDVANG.Knowledge.ihana` | Ihana | Ihana |
| `TRUDVANG.Knowledge.noaj` | Noaj | Noaj |
| `TRUDVANG.Knowledge.thuulForging` | Thuul Forging | Forgeage thuul |
| `TRUDVANG.Knowledge.stormkelt` | Stormkelt | Stormikjalt |
| `TRUDVANG.Knowledge.armedFighting` | Armed Fighting | Combat armé |
| `TRUDVANG.Knowledge.oneHandedLightWeapons` | 1H Light Weapons | Armes légères à une main |
| `TRUDVANG.Knowledge.oneHandedHeavyWeapons` | 1H Heavy Weapons | Armes lourdes à une main |
| `TRUDVANG.Knowledge.throwingWeapons` | Throwing Weapons | Armes de lancer |
| `TRUDVANG.Knowledge.shieldBearer` | Shield Bearer | Porteur de bouclier |
| `TRUDVANG.Knowledge.twoHandedWeapons` | Two-Handed Weapons | Armes à deux mains |
| `TRUDVANG.Knowledge.crossbow` | Crossbow | Arbalète |
| `TRUDVANG.Knowledge.bowsSlings` | Bows & Slings | Arcs & frondes |
| `TRUDVANG.Knowledge.unarmedFighting` | Unarmed Fighting | Combat à mains nues |
| `TRUDVANG.Knowledge.brawling` | Brawling | Bagarre |
| `TRUDVANG.Knowledge.wrestling` | Wrestling | Lutte |
| `TRUDVANG.Knowledge.battleExperience` | Battle Experience | Expérience du combat |
| `TRUDVANG.Knowledge.armorBearer` | Armor Bearer | Porteur d'armure |
| `TRUDVANG.Knowledge.combatActions` | Combat Actions | Actions de combat |
| `TRUDVANG.Knowledge.combatReaction` | Combat Reaction | Réaction de combat |
| `TRUDVANG.Knowledge.crossbowLoader` | Crossbow Loader | Chargeur d'arbalète |
| `TRUDVANG.Knowledge.fighter` | Fighter | Combattant |
| `TRUDVANG.Knowledge.cultureKnowledge` | Culture Knowledge | Connaissances culturelles |
| `TRUDVANG.Knowledge.customsLaw` | Customs & Law | Coutumes & lois |
| `TRUDVANG.Knowledge.loreLegends` | Lore & Legends | Contes & légendes |
| `TRUDVANG.Knowledge.religion` | Religion | Religions |
| `TRUDVANG.Knowledge.learning` | Learning | Apprentissage |
| `TRUDVANG.Knowledge.insight` | Insight | Érudition |
| `TRUDVANG.Knowledge.raceKnowledge` | Race Knowledge | Connaissance des créatures |
| `TRUDVANG.Knowledge.monsterLore` | Monster Lore | Connaissance des monstres |
| `TRUDVANG.Knowledge.spiritLore` | Spirit Lore | Connaissance des esprits |
| `TRUDVANG.Knowledge.language` | Language | Langage |
| `TRUDVANG.Knowledge.bribery` | Bribery | Corruption |
| `TRUDVANG.Knowledge.calculate` | Calculate | Calcul |
| `TRUDVANG.Knowledge.foreignTongue` | Foreign Tongue | Langue étrangère |
| `TRUDVANG.Knowledge.motherTongue` | Mother Tongue | Langue maternelle |
| `TRUDVANG.Knowledge.readWrite` | Read & Write | Lire & écrire |
| `TRUDVANG.Knowledge.silvertongue` | Silvertongue | Beau parleur |
| `TRUDVANG.Knowledge.shadowing` | Shadowing | Discrétion |
| `TRUDVANG.Knowledge.camouflageHiding` | Camouflage & Hiding | Camouflage & dissimulation |
| `TRUDVANG.Knowledge.findingSpotting` | Finding & Spotting | Trouver & remarquer |
| `TRUDVANG.Knowledge.sneakAttack` | Sneak Attack | Attaque furtive |
| `TRUDVANG.Knowledge.walkingShadows` | Walking in Shadows | Marcher dans les ombres |
| `TRUDVANG.Knowledge.thievery` | Thievery | Larcin |
| `TRUDVANG.Knowledge.disguise` | Disguise | Déguisement |
| `TRUDVANG.Knowledge.locksTraps` | Locks & Traps | Serrures & pièges |
| `TRUDVANG.Knowledge.stealing` | Stealing | Voler |
| `TRUDVANG.Knowledge.shadowWorld` | Shadow World | Monde des ombres |
| `TRUDVANG.Knowledge.thiefSigns` | Thief Signs | Signes de voleur |
| `TRUDVANG.Knowledge.vitnerFocus` | Vitner Focus | Concentration du tisseur |
| `TRUDVANG.Knowledge.potency` | Potency | Puissance |
| `TRUDVANG.Knowledge.safeWeaving` | Safe-weaving | Tissage attentif |
| `TRUDVANG.Knowledge.strenuous` | Strenuous | Renforcement |
| `TRUDVANG.Knowledge.vitnerShaping` | Vitner Shaping | Modelage du vitner |
| `TRUDVANG.Knowledge.galding` | Galding | Galda |
| `TRUDVANG.Knowledge.sejding` | Sejding | Sejda |
| `TRUDVANG.Knowledge.vitnerRunes` | Vitner Runes | Runes de vitner |
| `TRUDVANG.Knowledge.vyrding` | Vyrding | Vyrda |
| `TRUDVANG.Knowledge.callVitner` | Call of Vitner | Appel du vitner |
| `TRUDVANG.Knowledge.hwitalja` | Hwitalja | Hwitalja |
| `TRUDVANG.Knowledge.darkhwitalja` | Darkhwitalja | Morkvitalja |
| `TRUDVANG.Knowledge.vaagritalja` | Vaagritalja | Vaagritalja |
| `TRUDVANG.Knowledge.vitnerHabit` | Vitner Habit | Habitude du vitner |
| `TRUDVANG.Knowledge.geography` | Geography | Géographie |
| `TRUDVANG.Knowledge.cityKnowledge` | City Knowledge | Connaissance des cités |
| `TRUDVANG.Knowledge.landKnowledge` | Land Knowledge | Connaissance régionale |
| `TRUDVANG.Knowledge.orienteeringCartography` | Orienteering & Cartography | Orientation & cartographie |
| `TRUDVANG.Knowledge.seaKnowledge` | Sea Knowledge | Connaissance des mers |
| `TRUDVANG.Knowledge.huntingExperience` | Hunting Experience | Expérience de la chasse |
| `TRUDVANG.Knowledge.carveButcher` | Carve & Butcher | Découper & dépecer |
| `TRUDVANG.Knowledge.huntingFishing` | Hunting & Fishing | Chasser & pêcher |
| `TRUDVANG.Knowledge.speciesHunter` | Species Hunter | Chasser une espèce |
| `TRUDVANG.Knowledge.tracker` | Tracker | Pister |
| `TRUDVANG.Knowledge.wildernessSigns` | Wilderness Signs | Signes de la nature |
| `TRUDVANG.Knowledge.natureKnowledge` | Nature Knowledge | Connaissance de la nature |
| `TRUDVANG.Knowledge.animalFriend` | Animal Friend | Ami des animaux |
| `TRUDVANG.Knowledge.botany` | Botany | Botanique |
| `TRUDVANG.Knowledge.weatherman` | Weatherman | Météorologie |
| `TRUDVANG.Knowledge.zoology` | Zoology | Zoologie |
| `TRUDVANG.Knowledge.seafarer` | Seafarer | Marin |
| `TRUDVANG.Knowledge.navigation` | Navigation | Navigation |
| `TRUDVANG.Knowledge.seaman` | Seaman | Matelot |
| `TRUDVANG.Knowledge.survival` | Survival | Survie |
| `TRUDVANG.Knowledge.camper` | Camper | Campement |
| `TRUDVANG.Knowledge.pathwalker` | Pathwalker | Exploration |
| `TRUDVANG.Knowledge.terrainExperience` | Terrain Experience | Connaissance de l'environnement |
| `TRUDVANG.Knowledge.weathered` | Weathered | Endurci |

## `TRUDVANG.KnowledgeDescription`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.KnowledgeDescription.strenuous` | Strenuous lets the conjurer spend 2 additional Vitner Points per specialty level to gain +1 SV per amount spent when weaving a spell. | Renforcement permet au tisseur de dépenser 2 points de vitner supplémentaires par niveau de spécialité pour gagner +1 VC par tranche dépensée lors du tissage d'un sortilège. |

## `TRUDVANG.Damage`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Damage.light` | Lightly Damaged | Égratigné |
| `TRUDVANG.Damage.injured` | Injured | Blessé |
| `TRUDVANG.Damage.serious` | Seriously Injured | Gravement blessé |
| `TRUDVANG.Damage.critical` | Critically Injured | Mortellement blessé |

## `TRUDVANG.Dialog`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Dialog.BaseTarget` | Base target: {target} | Cible de base: {target} |
| `TRUDVANG.Dialog.Modifier` | Situation Modifier | Modificateur situationnel |
| `TRUDVANG.Dialog.CombatPoints` | Combat Points to Spend | CP à dépenser |
| `TRUDVANG.Dialog.AttackTitle` | Attack: {item} | Attaque: {item} |
| `TRUDVANG.Dialog.ParryTitle` | Parry: {item} |  Parade: {item} |
| `TRUDVANG.Dialog.MagicAction` | Magic or Divine Action | Action magique ou divine |
| `TRUDVANG.Dialog.NoMagicAction` | No magic modifier | Aucun modificateur magique |
| `TRUDVANG.Dialog.InitiativeAction` | Weapon, spell, or divine action | Arme, sortilège ou pouvoir divin |
| `TRUDVANG.Dialog.NoInitiativeAction` | No action modifier | Aucun modificateur d'action |
| `TRUDVANG.Dialog.AddTablet` | Add a compatible tablet | Ajouter une tablette compatible |
| `TRUDVANG.Dialog.MagicMethod` | Method and specialty | Méthode et spécialité |
| `TRUDVANG.Dialog.FinalTarget` | Final Skill Value | Valeur de compétence finale |
| `TRUDVANG.Dialog.Strenuous` | Strenuous effort | Renforcement |
| `TRUDVANG.Dialog.FinalVitnerCost` | Final Vitner cost | Coût final en vitner |

## `TRUDVANG.Roll`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Roll.Success` | Success | Succès |
| `TRUDVANG.Roll.Failure` | Failure | Échec |
| `TRUDVANG.Roll.OpenRoll` | Open roll on | Jet ouvert sur |
| `TRUDVANG.Roll.OpenInitiative` | Initiative uses 1d10 with an open roll on 10. | L'initiative utilise 1d10 avec un jet ouvert sur 10. |
| `TRUDVANG.Roll.Margin` | Success margin | Marge de réussite |

## `TRUDVANG.Roll.Critical`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Roll.Critical.success` | Perfect success | Réussite parfaite |
| `TRUDVANG.Roll.Critical.failure` | Automatic failure | Échec automatique |

## `TRUDVANG.Warning`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Warning.NotEnoughPower` | There are not enough points in this power reserve. | Il n'y a plus assez de points en réserve. |
| `TRUDVANG.Warning.SkillMaximum` | A general Skill Value cannot exceed 10. | La valeur d'une compétence ne peut pas dépasser 10. |
| `TRUDVANG.Warning.NotEnoughExperience` | The next level costs {cost} Adventure Points. | Le niveau suivant coûte {cost} PA. |
| `TRUDVANG.Warning.LevelMaximum` | This knowledge is already at level 5. | Cette discipline/spécialité est déjà au niveau 5. |
| `TRUDVANG.Warning.SkillRequirement` | The next level requires a base Skill Value of {sv}. | Le niveau suivant nécessite une valeur de compétence de base de {sv}. |
| `TRUDVANG.Warning.ExitCreationFirst` | Finish character creation before spending Adventure Points. | Terminez la création du personnage avant de dépenser des points d'aventure. |
| `TRUDVANG.Warning.ResolveAdvancementsFirst` | Confirm or cancel the pending advancements first. | Validez ou annulez d'abord les améliorations en attente. |
| `TRUDVANG.Warning.CreationBudgetExceeded` | The character exceeds the creation budget by {cost} points. | Le personnage dépasse le budget de création de {cost} points. |
| `TRUDVANG.Warning.CreationModeRequired` | This change is only available in character creation mode. | Cette modification n'est disponible qu'en mode création de personnage. |
| `TRUDVANG.Warning.TraitLimit` | This trait cannot be raised or lowered further. | Ce trait ne peut pas être davantage augmenté ou diminué. |
| `TRUDVANG.Warning.SkillLimit` | Skill Value must remain between 1 and 10. | La valeur de compétence doit rester comprise entre 1 et 10. |
| `TRUDVANG.Warning.KnowledgeLimit` | Knowledge level must remain between 1 and 5. | Le niveau de connaissance doit rester compris entre 1 et 5. |
| `TRUDVANG.Warning.SkillSupportsKnowledge` | This Skill Value is required by one of its disciplines, specialties, or tablets. | Cette valeur de compétence est requise par une discipline, une spécialité ou une tablette. |
| `TRUDVANG.Warning.ParentDisciplineRequired` | The parent discipline must be learned before this specialty. | La discipline parente doit être apprise avant cette spécialité. |
| `TRUDVANG.Warning.KnowledgeRequirement` | {item} requires {skill} at SV {sv}. | {item} exige {skill} à la valeur de compétence {sv}. |
| `TRUDVANG.Warning.MissingParentDiscipline` | {item} must be assigned to a learned parent discipline. | {item} doit être rattaché à une discipline parente apprise. |
| `TRUDVANG.Warning.KnowledgeNotLearned` | This discipline or specialty has not been learned yet. | Cette discipline ou spécialité n'a pas encore été apprise. |
| `TRUDVANG.Warning.DisciplineSupportsSpecialty` | This discipline cannot be removed while one of its specialties is learned. | Cette discipline ne peut pas être supprimée tant qu'une de ses spécialités est apprise. |
| `TRUDVANG.Warning.CultureRequired` | Choose a culture before completing character creation. | Choisissez une culture avant de terminer la création du personnage. |
| `TRUDVANG.Warning.ArchetypeRequired` | Choose an archetype before completing character creation. | Choisissez un archétype avant de terminer la création du personnage. |
| `TRUDVANG.Warning.VitnerExclusive` | Hwitalja, Darkhwitalja, and Vaagritalja are mutually exclusive. | Hwitalja, Morkvitalja et Vaagritalja sont mutuellement exclusifs. |
| `TRUDVANG.Warning.ReligionExclusive` | Only one religious path can grant divine powers. | Une seule voie religieuse peut accorder des pouvoirs divins. |
| `TRUDVANG.Warning.ReligionIncompatible` | This religious path is not compatible with the character's race. | Cette voie religieuse n'est pas compatible avec la race du personnage. |
| `TRUDVANG.Warning.FatalTableMissing` | The required fatal-effects table is not installed. | La table de magie funeste requise n'est pas installée. |
| `TRUDVANG.Warning.UnknownTablet` | This item is not a tablet from the system catalogue. | Cet objet n'est pas une tablette du catalogue du système. |
| `TRUDVANG.Warning.TabletAlreadyKnown` | This tablet is already known. | Cette tablette est déjà connue. |
| `TRUDVANG.Warning.TabletSkillRequirement` | Faith or Vitner Craft must have a Skill Value of at least 4. | Foi ou Maîtrise du vitner doit avoir une valeur de compétence d'au moins 4. |
| `TRUDVANG.Warning.TabletKnowledgeRequired` | Learn Vitner Shaping or the Invoke specialty of the chosen religion before adding one of its tablets. | Apprenez Modelage du vitner ou la spécialité d'Invocation de la religion choisie avant d'ajouter l'une de ses tablettes. |
| `TRUDVANG.Warning.VitnerRequired` | Choose a Vitner tradition before adding a Vitner Tablet. | Choisissez une tradition du vitner avant d'ajouter une tablette de vitner. |
| `TRUDVANG.Warning.ReligionRequired` | Choose a compatible religious path before adding a Holy Tablet. | Choisissez une voie religieuse compatible avant d'ajouter une tablette sacrée. |
| `TRUDVANG.Warning.TabletReligionMismatch` | This Holy Tablet does not belong to the character's compatible chosen religion. | Cette tablette sacrée n'appartient pas à la religion compatible choisie par le personnage. |
| `TRUDVANG.Warning.NoCompatibleTablets` | No additional tablet is currently compatible with this character. | Aucune tablette supplémentaire n'est actuellement compatible avec ce personnage. |
| `TRUDVANG.Warning.MagicMethodRequired` | Learn the required discipline and at least one applicable invocation or weaving specialty. | Apprenez la discipline requise et au moins une spécialité d'invocation ou de tissage applicable. |

## `TRUDVANG.Description`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Description.SkillSummary` | {name} is a general skill used as the base value for its related actions and knowledge. | {name} est une compétence générale servant de valeur de base aux actions et connaissances associées. |
| `TRUDVANG.Description.KnowledgeSummary` | {name} is a discipline or specialty that improves the related skill checks. | {name} est une discipline ou spécialité qui améliore les tests de la compétence associée. |
| `TRUDVANG.Description.DisciplineSummary` | {name} covers {topics} and adds its level to the related checks. | {name} couvre {topics} et ajoute son niveau aux tests associés. |
| `TRUDVANG.Description.SpecialtySummary` | {name} focuses on this particular application of {discipline} and adds twice its level to applicable checks. | {name} approfondit cette application particulière de {discipline} et ajoute deux fois son niveau aux tests concernés. |
| `TRUDVANG.Description.TabletSummary` | {name} gathers the spells or divine powers belonging to this magical tradition. | {name} rassemble les sortilèges ou pouvoirs divins appartenant à cette tradition magique. |
| `TRUDVANG.Description.PowerSummary` | {name} is a power from {tablet}; its complete rules description will be added later. | {name} est un pouvoir de {tablet} ; sa description de règles complète sera ajoutée ultérieurement. |
| `TRUDVANG.Description.SourcePage` | Player's Handbook, p. {page} | Manuel du joueur, p. {page} |

## `TRUDVANG.Cost`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Cost.Increase` | Increase: costs {cost} points | Augmentation : coûte {cost} points |
| `TRUDVANG.Cost.Refund` | Decrease: refunds {cost} points | Diminution : rembourse {cost} points |
| `TRUDVANG.Cost.IncreaseCore` | Increase: {cost} points, including {bonus} from the archetype bonus and {creation} regular creation points | Augmentation : {cost} points, dont {bonus} pris sur le bonus d'archétype et {creation} points de création ordinaires |

## `TRUDVANG.Calculation`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Calculation.Discipline` | Skill SV {skill} + Discipline {discipline} = SV {total} | VC de la compétence {skill} + discipline {discipline} = VC {total} |
| `TRUDVANG.Calculation.Specialty` | Skill SV {skill} + Discipline {discipline} + Specialty {specialty} = SV {total} | VC de la compétence {skill} + discipline {discipline} + spécialité {specialty} = VC {total} |
| `TRUDVANG.Calculation.MagicMethod` | Skill {skill} + discipline {discipline} + specialty {specialty} = SV {total} before the power modifier | Compétence {skill} + discipline {discipline} + spécialité {specialty} = VC {total} avant le modificateur du pouvoir |
| `TRUDVANG.Calculation.Strenuous` | Strenuous: +{bonus} SV for {cost} additional Vitner Points | Renforcement : +{bonus} VC pour {cost} points de vitner supplémentaires |

## `TRUDVANG.Religion`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Religion.Gerbanis` | Gerbanis | Gerbanis |
| `TRUDVANG.Religion.TenetNid` | Tenet of Nid | Doctrine de Nid |
| `TRUDVANG.Religion.EaldTradition` | Eald Tradition | Ancienne tradition |
| `TRUDVANG.Religion.Haminges` | Haminges | Haminges |
| `TRUDVANG.Religion.Thuuldom` | Thuuldom | Thuuldom |
| `TRUDVANG.Religion.Toikalokke` | Toikalokke | Toikalokke |

## `TRUDVANG.TraitBenefit`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.TraitBenefit.charisma` | Situation modifier {value}. Raud modifier {value} (-4 removes all Raud). Entertainment knowledge and Tradesman cost modifier: {inverse} points per level. | Modificateur de situation {value}. Modificateur de Raud {value} (-4 supprime tout le Raud). Modificateur de coût pour Divertissement et Commerce : {inverse} points par niveau. |
| `TRUDVANG.TraitBenefit.constitution` | Situation modifier {value}. Body Points modifier {value}; recovery rate also depends on this trait. | Modificateur de situation {value}. Modificateur de points de santé (PS) {value} ; la récupération dépend également de ce trait. |
| `TRUDVANG.TraitBenefit.dexterity` | Situation modifier {value}. Movement and initiative modifier {value}. Agility knowledge cost modifier: {inverse} points per level. | Modificateur de situation {value}. Modificateur de mouvement et d'initiative {value}. Modificateur de coût des connaissances d'Agilité : {inverse} points par niveau. |
| `TRUDVANG.TraitBenefit.intelligence` | Situation modifier {value}. Knowledge, Faith, and Vitner Craft knowledge cost modifier: {inverse} points per level. | Modificateur de situation {value}. Modificateur de coût des connaissances de Connaissances, Foi et Maîtrise du vitner : {inverse} points par niveau. |
| `TRUDVANG.TraitBenefit.perception` | Situation modifier {value}. Listed observation, tracking, navigation, weather, and extract specialties have a cost modifier of {inverse} points per level. | Modificateur de situation {value}. Les spécialités d'observation, pistage, navigation, météo et extraits indiquées par les règles ont un modificateur de coût de {inverse} points par niveau. |
| `TRUDVANG.TraitBenefit.psyche` | Situation modifier {value}. Wilderness persistence {value} days and fear-factor modifier {inverse}. Pathwalker, Terrain Experience, and Weathered cost modifier: {inverse} points per level. | Modificateur de situation {value}. Persistance dans la nature {value} jours et modificateur de facteur de peur {inverse}. Modificateur de coût pour Exploration, Connaissance de l'environnement et Endurci : {inverse} points par niveau. |
| `TRUDVANG.TraitBenefit.strength` | Situation modifier {value}. Melee damage and Body Points modifier {value}; very low Strength restricts usable weapons. | Modificateur de situation {value}. Modificateur de dégâts de mêlée et de points de santé (PS) {value} ; une Force très faible limite les armes utilisables. |

## `TRUDVANG.Notification`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Notification.AdvancementConfirmed` | The advancements have been confirmed. | Les améliorations ont été validées. |
| `TRUDVANG.Notification.AdvancementCancelled` | The advancements were cancelled and {cost} Adventure Points were refunded. | Les améliorations ont été annulées et {cost} points d'aventure ont été remboursés. |
| `TRUDVANG.Notification.CreationModeEnabled` | Character creation mode enabled. | Mode création de personnage activé. |
| `TRUDVANG.Notification.CreationModeDisabled` | Character creation completed. | Création du personnage terminée. |
| `TRUDVANG.Notification.InvalidTraitsRepaired` | Reset invalid -4 defaults to 0 on {count} character(s). | Les valeurs initiales invalides à -4 ont été remises à 0 sur {count} personnage(s). |

## `TRUDVANG.New`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.New.Item` | New {type} | Nouveau {type} |

## `TRUDVANG.Empty`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Empty.Weapons` | Equip a weapon to place it among the quick actions. | Equipez une arme pour l'ajouter aux actions rapides. |

## `TRUDVANG.Import`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Import.Started` | Installing the Trudvang starter library... | Installation de la bibliothèque de démarrage Trudvang... |
| `TRUDVANG.Import.Complete` | Trudvang starter library installed: {items} items, {tables} tables, and {actors} NPCs. | Bibliothèque de démarrage Trudvang installée: {items} objets, {tables} tables, et {actors} PNJs. |
| `TRUDVANG.Import.Failed` | The Trudvang starter library could not be installed. See the console for details. | La bibliothèque de démarrage Trudvang n'a pas pu être installée. Consultez la console pour plus de détails. |

## `TRUDVANG.Content.Folder`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Folder.Weapons` | Trudvang - Weapons | Trudvang - Armes |
| `TRUDVANG.Content.Folder.Armor` | Trudvang - Armor & Shields | Trudvang - Armures & Boucliers |
| `TRUDVANG.Content.Folder.Gear` | Trudvang - Gear & Extracts | Trudvang - Équipements & Extraits |
| `TRUDVANG.Content.Folder.Magic` | Trudvang - Tablets & Magic | Trudvang - Tables & Magie |
| `TRUDVANG.Content.Folder.Abilities` | Trudvang - Disciplines & Specialties | Trudvang - Disciplines & Spécialités |
| `TRUDVANG.Content.Folder.Tables` | Trudvang - Roll Tables | Trudvang - Tables de Lancers |
| `TRUDVANG.Content.Folder.Creatures` | Trudvang - Creatures | Trudvang - Créatures |

## `TRUDVANG.Content.Source`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Source.GMG69` | Game Master's Guide, p. 69 | Guide du maître, p. 69 |
| `TRUDVANG.Content.Source.GMG70` | Game Master's Guide, p. 70 | Guide du maître, p. 70 |
| `TRUDVANG.Content.Source.GMG72` | Game Master's Guide, p. 72 | Guide du maître, p. 72 |
| `TRUDVANG.Content.Source.GMG74` | Game Master's Guide, p. 74 | Guide du maître, p. 74 |
| `TRUDVANG.Content.Source.GMG76` | Game Master's Guide, p. 76 | Guide du maître, p. 76 |
| `TRUDVANG.Content.Source.GMG77` | Game Master's Guide, p. 77 | Guide du maître, p. 77 |
| `TRUDVANG.Content.Source.GMG80` | Game Master's Guide, p. 80 | Guide du maître, p. 80 |
| `TRUDVANG.Content.Source.GMG90` | Game Master's Guide, p. 90 | Guide du maître, p. 90 |
| `TRUDVANG.Content.Source.GMG93` | Game Master's Guide, p. 93 | Guide du maître, p. 93 |
| `TRUDVANG.Content.Source.GMG94` | Game Master's Guide, p. 94 | Guide du maître, p. 94 |
| `TRUDVANG.Content.Source.PHB47` | Player's Handbook, p. 47 | Manuel du joueur, p. 47 |
| `TRUDVANG.Content.Source.PHB48` | Player's Handbook, p. 48 | Manuel du joueur, p. 48 |
| `TRUDVANG.Content.Source.PHB50` | Player's Handbook, p. 50 | Manuel du joueur, p. 50 |
| `TRUDVANG.Content.Source.PHB55` | Player's Handbook, p. 55 | Manuel du joueur, p. 55 |
| `TRUDVANG.Content.Source.PHB59` | Player's Handbook, p. 59 | Manuel du joueur, p. 59 |
| `TRUDVANG.Content.Source.PHB69` | Player's Handbook, p. 69 | Manuel du joueur, p. 69 |
| `TRUDVANG.Content.Source.PHB74` | Player's Handbook, p. 74 | Manuel du joueur, p. 74 |
| `TRUDVANG.Content.Source.PHB92` | Player's Handbook, p. 92 | Manuel du joueur, p. 92 |
| `TRUDVANG.Content.Source.PHB201` | Player's Handbook, p. 201 | Manuel du joueur, p. 201 |

## `TRUDVANG.Content.Item.Seax`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Seax.Name` | Seax (Dagger or Knife) | Seax (dague/couteau) |
| `TRUDVANG.Content.Item.Seax.Description` | A ubiquitous single-edged knife used for work, ritual blood gifting, throwing, and as a last-resort weapon. | Un couteau à un seul tranchant omniprésent, utilisé pour le travail, le don rituel de sang, le jet et comme arme de dernier recours. |

## `TRUDVANG.Content.Item.Glaaf`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Glaaf.Name` | Glaaf (Short Sword) | Glaaf (épée courte) |
| `TRUDVANG.Content.Item.Glaaf.Description` | A short sword, usually double-edged, common in eastern Trudvang and associated with the ancient Brots. | Une épée courte généralement à double tranchant, courante dans l'est de Trudvang et associée aux anciens Brots. |

## `TRUDVANG.Content.Item.HringSeax`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.HringSeax.Name` | Hring Seax (Ring Knife) | Hring seax (couteau à anneau) |
| `TRUDVANG.Content.Item.HringSeax.Description` | A Mittlander fighting blade with a single inward-curving edge and a ring at the pommel, often tied to the wrist. | Une lame de combat mittlander à un seul tranchant incurvé vers l'intérieur, munie d'un anneau au pommeau souvent attaché au poignet. |

## `TRUDVANG.Content.Item.BattleAxe`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.BattleAxe.Name` | Barda Axi (Battle Axe) | Barda axi (hache de bataille) |
| `TRUDVANG.Content.Item.BattleAxe.Description` | A refined and enlarged hand axe designed for combat. | Une hache d'arme raffinée et agrandie, conçue pour le combat. |

## `TRUDVANG.Content.Item.Broadsword`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Broadsword.Name` | Breid Swerd (Broadsword) | Breid swerd (épée large) |
| `TRUDVANG.Content.Item.Broadsword.Description` | A robust cutting sword, commonly wielded by Mittlander warriors and sometimes used as a paired weapon. | Une épée de taille robuste, maniée couramment par les guerriers mittlanders et parfois utilisée comme arme d'appoint. |

## `TRUDVANG.Content.Item.BeardedAxe`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.BeardedAxe.Name` | Villtur Axi (Bearded Axe) | Villtur axi (hache courbée) |
| `TRUDVANG.Content.Item.BeardedAxe.Description` | A long-shafted Stormlander axe whose L-shaped blade widens the cutting surface without excessive weight. | Une hache stormlander au long manche dont la lame en L élargit la surface de coupe sans excès de poids. |

## `TRUDVANG.Content.Item.LongSpear`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.LongSpear.Name` | Spjot (Long Spear) | Spjót (lance longue) |
| `TRUDVANG.Content.Item.LongSpear.Description` | An effective and inexpensive long spear, especially dangerous in disciplined formations or from horseback. | Une lance longue efficace et peu coûteuse, particulièrement redoutable en formation disciplinée ou à cheval. |

## `TRUDVANG.Content.Item.TwoHandedAxe`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.TwoHandedAxe.Name` | Tvei Axi (Two-Handed Axe) | Tvei axi (hache à deux mains) |
| `TRUDVANG.Content.Item.TwoHandedAxe.Description` | A mighty two-handed axe. Fine examples use iron for both shaft and head. | Une puissante hache à deux mains. Les plus beaux exemplaires utilisent le fer pour le manche comme pour la tête. |

## `TRUDVANG.Content.Item.TwoHandedSword`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.TwoHandedSword.Name` | Tvei Swerd (Two-Handed Sword) | Tvei swerd (épée à deux mains) |
| `TRUDVANG.Content.Item.TwoHandedSword.Description` | A huge, heavy sword that sacrifices speed for reach, power, and terror on the battlefield. | Une épée immense et lourde qui sacrifie la vitesse à la portée, à la puissance et à la terreur sur le champ de bataille. |

## `TRUDVANG.Content.Item.HuntingBow`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.HuntingBow.Name` | Veidi Bogi (Hunting Bow) | Veidi bogi (arc de chasse) |
| `TRUDVANG.Content.Item.HuntingBow.Description` | A simple hunting bow. It deals full damage at short range and half damage at long range. | Un arc de chasse simple. Il inflige tous ses dégâts à courte portée et la moitié à longue portée. |

## `TRUDVANG.Content.Item.Longbow`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Longbow.Name` | Lang Bogi (Longbow) | Lang bogi (arc long) |
| `TRUDVANG.Content.Item.Longbow.Description` | A heavy, composite Stormlander war bow with greater range and a more dangerous open damage roll. | Un arc de guerre stormlander lourd et composite, à la portée supérieure et au jet ouvert de dégâts plus dangereux. |

## `TRUDVANG.Content.Item.Crossbow`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Crossbow.Name` | Krossbogur (Crossbow) | Krossbogur (arbalète) |
| `TRUDVANG.Content.Item.Crossbow.Description` | A powerful defensive crossbow with excellent range but a slow loading cycle. | Une arbalète défensive puissante, à l'excellente portée mais au rechargement lent. |

## `TRUDVANG.Content.Item.FurLeather`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.FurLeather.Name` | Fur / Leather Armor | Fourrure/cuir |
| `TRUDVANG.Content.Item.FurLeather.Description` | Warm, quiet armor of tanned fur or soft leather. It is common among Wildfolk, troll peoples, and northern humans. | Une armure chaude et silencieuse de fourrure tannée ou de cuir souple, courante chez les Sauvages, les peuples trolls et les humains du nord. |

## `TRUDVANG.Content.Item.HardenedLeather`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.HardenedLeather.Name` | Hardened Leather Armor | Cuir rigide |
| `TRUDVANG.Content.Item.HardenedLeather.Description` | Leather boiled in oil and formed to the wearer. It is quieter than metal armor and offers moderate protection. | Du cuir bouilli dans l'huile puis moulé sur son porteur. Plus silencieux que les armures métalliques, il offre une protection modérée. |

## `TRUDVANG.Content.Item.ChainMail`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.ChainMail.Name` | Chain Mail | Cotte de mailles |
| `TRUDVANG.Content.Item.ChainMail.Description` | Thousands of interlinked metal rings worn over padding. Mail is heavy but comparatively flexible. | Des milliers d'anneaux métalliques entrelacés portés sur un rembourrage. Lourde mais comparativement souple. |

## `TRUDVANG.Content.Item.PlateArmor`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.PlateArmor.Name` | Plate Armor | Armure de plate |
| `TRUDVANG.Content.Item.PlateArmor.Description` | Rare, custom-fitted overlapping metal plates. Plate offers exceptional protection at severe weight and initiative cost. | De rares plaques métalliques superposées ajustées sur mesure. La plate offre une protection exceptionnelle au prix d'un poids et d'une pénalité d'initiative sévères. |

## `TRUDVANG.Content.Item.SmallShield`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.SmallShield.Name` | Small Wooden Shield | Petit bouclier en bois |
| `TRUDVANG.Content.Item.SmallShield.Description` | A quick shield allowing three weapon actions per round. Shields are used primarily to parry successful melee attacks. | Un bouclier rapide permettant trois actions d'arme par tour. Les boucliers servent avant tout à parer les attaques au contact réussies. |

## `TRUDVANG.Content.Item.MediumShield`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.MediumShield.Name` | Medium Wooden Shield | Bouclier moyen en bois |
| `TRUDVANG.Content.Item.MediumShield.Description` | A balanced shield allowing two weapon actions per round. On a successful parry, damage is applied to the shield. | Un bouclier équilibré permettant deux actions d'arme par tour. En cas de parade réussie, les dégâts s'appliquent au bouclier. |

## `TRUDVANG.Content.Item.LargeShield`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.LargeShield.Name` | Large Wooden Shield | Grand bouclier en bois |
| `TRUDVANG.Content.Item.LargeShield.Description` | A slow but highly protective shield allowing one weapon action per round. | Un bouclier lent mais très protecteur, permettant une seule action d'arme par tour. |

## `TRUDVANG.Content.Item.AdventureKit`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.AdventureKit.Name` | Adventure Kit | Kit d'aventure |
| `TRUDVANG.Content.Item.AdventureKit.Description` | A bundle of common expedition supplies. Make a Situation roll with a value of 10 to determine whether an ordinary kit contains a plausible item. | Un ensemble d'équipement d'expédition courant. Effectuez un test de situation contre 10 pour déterminer si un kit ordinaire contient l'objet plausible recherché. |

## `TRUDVANG.Content.Item.Rope`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Rope.Name` | Hemp Rope | Corde de chanvre |
| `TRUDVANG.Content.Item.Rope.Description` | A practical length of hemp rope for climbing, binding, hauling, and camp work. | Une corde de chanvre pratique pour escalader, attacher, haler et pour les travaux de camp. |

## `TRUDVANG.Content.Item.Torch`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Torch.Name` | Torch | Torche |
| `TRUDVANG.Content.Item.Torch.Description` | A resinous wooden torch providing portable light until consumed. | Une torche de bois résineux fournissant une lumière portable jusqu'à consommation. |

## `TRUDVANG.Content.Item.DragonBlood`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.DragonBlood.Name` | Dragon Blood | Sang de dragon |
| `TRUDVANG.Content.Item.DragonBlood.Description` | A legendary altering extract taken from a dragon. It is exceedingly rare and worth about 1,000 silver coins per dose. | Un extrait altérant légendaire prélevé sur un dragon. Excessivement rare, il vaut environ 1 000 pièces d'argent la dose. |
| `TRUDVANG.Content.Item.DragonBlood.Effect` | Roll 1d20 + extract Strength - Constitution. Mild, moderate, substantial, and complete effects grant +2, +4, +8, or +12 natural Protection Value for one day. | Lancez 1d20 + force de l'extrait - Constitution. Les effets léger, modéré, substantiel et complet accordent respectivement +2, +4, +8 ou +12 de valeur de protection naturelle pendant un jour. |

## `TRUDVANG.Content.Item.FrostboarFat`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.FrostboarFat.Name` | Frostboar's Fat | Graisse de frostboar |
| `TRUDVANG.Content.Item.FrostboarFat.Description` | Thick brown fat cut from a frostboar's neck. It smells terrible and can be used without further preparation. | Une épaisse graisse brune prélevée sur la nuque d'un frostboar. Son odeur est terrible et elle s'emploie sans préparation supplémentaire. |
| `TRUDVANG.Content.Item.FrostboarFat.Effect` | Rubbed on the body, the fat protects against extreme cold and heat for two hours. Determine its degree with the extract-effect roll. | Frottée sur le corps, la graisse protège du froid extrême et de la chaleur pendant deux heures. Déterminez son degré avec le jet d'effet d'extrait. |

## `TRUDVANG.Content.Item.WoundBalm`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.WoundBalm.Name` | Wound-Balm | Baume aux blessures |
| `TRUDVANG.Content.Item.WoundBalm.Description` | A healing salve prepared for direct application to injuries. | Un onguent cicatrisant préparé pour être appliqué directement sur les blessures. |
| `TRUDVANG.Content.Item.WoundBalm.Effect` | Apply the balm to a wound and resolve its healing degree with the standard extract-effect roll. | Appliquez le baume sur la blessure et déterminez son degré de guérison avec le jet d'effet d'extrait standard. |

## `TRUDVANG.Content.Item.Manetter`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Manetter.Name` | Manetter | Manetter |
| `TRUDVANG.Content.Item.Manetter.Description` | A dangerous poison that slowly strangles its victim and ignores armor and natural protection. | Un poison dangereux qui étrangle lentement sa victime et ignore les armures et la protection naturelle. |
| `TRUDVANG.Content.Item.Manetter.Effect` | Roll 1d20 + 2 - Constitution and consult the Extract Effect table. Damage is removed directly from Body Points. | Lancez 1d20 + 2 - Constitution et consultez la table des effets des extraits. Les dégâts sont retirés directement aux points de santé. |

## `TRUDVANG.Content.Item.AnimalVitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.AnimalVitner.Name` | Animal Vitner Tablet | Tablette Vitner animal |
| `TRUDVANG.Content.Item.AnimalVitner.Description` | A Vitner Tablet concerned with speaking to, calling, controlling, possessing, and sending messages through animals. | Une tablette de vitner consacrée au dialogue avec les animaux, à leur appel, leur contrôle, leur possession et au transport de messages. |

## `TRUDVANG.Content.Item.FlameCraft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.FlameCraft.Name` | Flame Craft Tablet | Tablette Maîtrise du feu |
| `TRUDVANG.Content.Item.FlameCraft.Description` | A Vitner Tablet governing sparks, heat, fire protection, flame control, and devastating seas of fire. | Une tablette de vitner régnant sur les flammèches, la chaleur, la protection contre le feu, le contrôle des flammes et les dévastatrices mers de flammes. |

## `TRUDVANG.Content.Item.PowerThought`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.PowerThought.Name` | Power of Thought Tablet | Tablette Pouvoir de la pensée |
| `TRUDVANG.Content.Item.PowerThought.Description` | A Vitner Tablet governing language, courage, fear, telepathy, memory, control, possession, and mind reading. | Une tablette de vitner régnant sur le langage, le courage, la peur, la télépathie, la mémoire, le contrôle, la possession et la lecture des pensées. |

## `TRUDVANG.Content.Item.TabletShield`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.TabletShield.Name` | Tablet of the Shield | Tablette du bouclier |
| `TRUDVANG.Content.Item.TabletShield.Description` | A Holy Tablet of the Tenet of Nid whose divine feats concern shelter, endurance, and protection. | Une tablette sacrée de la Doctrine de Nid dont les pouvoirs divins concernent le refuge, l'endurance et la protection. |

## `TRUDVANG.Content.Item.Messenger`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Messenger.Name` | Messenger | Messager |
| `TRUDVANG.Content.Item.Messenger.Description` | Imbues a small animal with a simple message and a destination it can reasonably reach. | Imprègne un petit animal d'un message simple et d'une destination qu'il peut raisonnablement atteindre. |
| `TRUDVANG.Content.Item.Messenger.Effect` | The animal attempts to travel to the named recipient and deliver the message. Extra levels of power can extend the message or distance. | L'animal tente de rejoindre le destinataire désigné pour lui transmettre le message. Des niveaux de puissance supplémentaires peuvent étendre le message ou la distance. |

## `TRUDVANG.Content.Item.SpeakAnimals`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.SpeakAnimals.Name` | Speak to Animals | Parler aux animaux |
| `TRUDVANG.Content.Item.SpeakAnimals.Description` | Allows the enchanter to understand and communicate with a nearby animal. | Permet à l'enchanteur de comprendre et de communiquer avec un animal proche. |
| `TRUDVANG.Content.Item.SpeakAnimals.Effect` | For the duration, the caster can exchange simple ideas with animals; intelligence and disposition still limit the conversation. | Pendant la durée, le lanceur peut échanger des idées simples avec les animaux ; l'intelligence et l'humeur de l'animal limitent toujours la conversation. |

## `TRUDVANG.Content.Item.CallAnimals`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.CallAnimals.Name` | Call on Animals | Appel des animaux |
| `TRUDVANG.Content.Item.CallAnimals.Description` | Calls animals of a chosen general kind from the surrounding area. | Appelle des animaux du type général choisi présents dans les environs. |
| `TRUDVANG.Content.Item.CallAnimals.Effect` | Nearby animals may travel toward the caster. Extra levels of power increase range, number, or duration as approved by the game master. | Les animaux proches peuvent se diriger vers le lanceur. Des niveaux de puissance supplémentaires étendent la portée, le nombre ou la durée, avec l'accord du maître de jeu. |

## `TRUDVANG.Content.Item.Spark`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Spark.Name` | Spark | Flammèche |
| `TRUDVANG.Content.Item.Spark.Description` | Creates a focused magical spark capable of igniting suitable tinder. | Crée une étincelle magique concentrée capable d'enflammer un amadou approprié. |
| `TRUDVANG.Content.Item.Spark.Effect` | Ignites a small combustible target within range. It is not a full combat flame unless enhanced by levels of power. | Enflamme une petite cible combustible à portée. Ce n'est pas une flamme de combat complète, sauf renforcement par des niveaux de puissance. |

## `TRUDVANG.Content.Item.BurningHand`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.BurningHand.Name` | Burning Hand | Main brûlante |
| `TRUDVANG.Content.Item.BurningHand.Description` | Wraps the caster's hand in searing magical flame for a close attack. | Enveloppe la main du lanceur d'une flamme magique ardente pour une attaque au contact. |
| `TRUDVANG.Content.Item.BurningHand.Effect` | The touched target suffers magical fire damage determined by the spell's level of power; ordinary protection may be limited by the game master. | La cible touchée subit des dégâts de feu magique selon le niveau de puissance du sortilège ; le maître de jeu peut limiter la protection ordinaire. |

## `TRUDVANG.Content.Item.FlameBurst`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.FlameBurst.Name` | Flame Burst | Éruption de flammes |
| `TRUDVANG.Content.Item.FlameBurst.Description` | Hurls a compact burst of flame that detonates at the selected point. | Projette une gerbe compacte de flammes qui explose au point désigné. |
| `TRUDVANG.Content.Item.FlameBurst.Effect` | Targets in the burst suffer fire damage. Additional levels of power can increase damage or area. | Les cibles dans l'éruption subissent des dégâts de feu. Des niveaux de puissance supplémentaires peuvent accroître les dégâts ou la zone. |

## `TRUDVANG.Content.Item.Courage`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Courage.Name` | Courage | Courage |
| `TRUDVANG.Content.Item.Courage.Description` | Strengthens a creature's mind against dread. | Fortifie l'esprit d'une créature contre la frayeur. |
| `TRUDVANG.Content.Item.Courage.Effect` | Reduces Fear Points or grants a bonus against fear for the duration, according to the spell's level of power. | Réduit les points de peur ou accorde un bonus contre la peur pendant la durée, selon le niveau de puissance du sortilège. |

## `TRUDVANG.Content.Item.Fear`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Fear.Name` | Fear | Peur |
| `TRUDVANG.Content.Item.Fear.Description` | Projects a terrifying thought directly into a target's mind. | Projette une pensée terrifiante directement dans l'esprit de la cible. |
| `TRUDVANG.Content.Item.Fear.Effect` | The target gains Fear Points; Psyche and other protections may reduce the effect. | La cible gagne des points de peur ; le Psychisme et d'autres protections peuvent réduire l'effet. |

## `TRUDVANG.Content.Item.ArmedFighting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.ArmedFighting.Name` | Armed Fighting | Combat armé |
| `TRUDVANG.Content.Item.ArmedFighting.Description` | A Fighting discipline covering combat with manufactured weapons. Each level contributes +1 in applicable actions. | Une discipline de Combat couvrant le combat avec des armes fabriquées. Chaque niveau ajoute +1 aux actions applicables. |

## `TRUDVANG.Content.Item.OneHandLight`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.OneHandLight.Name` | One-Handed Light Weapons | Armes légères à une main |
| `TRUDVANG.Content.Item.OneHandLight.Description` | An Armed Fighting specialty. Each level contributes +2 when fighting with one-handed light weapons and adds locked Combat Points. | Une spécialité de Combat armé. Chaque niveau ajoute +2 lors du combat avec des armes légères à une main et verrouille des points de combat. |

## `TRUDVANG.Content.Item.ShieldBearer`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.ShieldBearer.Name` | Shield Bearer | Porteur de bouclier |
| `TRUDVANG.Content.Item.ShieldBearer.Description` | An Armed Fighting specialty. Its first level removes the normal shield-hand penalty when using shields; further levels improve shield use. | Une spécialité de Combat armé. Son premier niveau supprime le malus normal de la main de bouclier ; les niveaux suivants améliorent l'usage du bouclier. |

## `TRUDVANG.Content.Item.BattleExperience`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.BattleExperience.Name` | Battle Experience | Expérience du combat |
| `TRUDVANG.Content.Item.BattleExperience.Description` | A Fighting discipline covering combat awareness, initiative, armor use, and tactical maneuvers. | Une discipline de Combat couvrant le sens du combat, l'initiative, l'usage des armures et les manœuvres tactiques. |

## `TRUDVANG.Content.Item.BodyControl`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.BodyControl.Name` | Body Control | Contrôle corporel |
| `TRUDVANG.Content.Item.BodyControl.Description` | An Agility discipline covering balance, controlled movement, evasion, and ambidexterity. | Une discipline d'Agilité couvrant l'équilibre, le mouvement contrôlé, l'esquive et l'ambidextrie. |

## `TRUDVANG.Content.Item.Horsemanship`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Horsemanship.Name` | Horsemanship | Maîtrise équestre |
| `TRUDVANG.Content.Item.Horsemanship.Description` | An Agility discipline covering riding, mounted movement, and mounted combat. | Une discipline d'Agilité couvrant l'équitation, le mouvement monté et le combat monté. |

## `TRUDVANG.Content.Item.HealingDrugs`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.HealingDrugs.Name` | Healing and Drugs | Soins & remèdes |
| `TRUDVANG.Content.Item.HealingDrugs.Description` | A Care discipline covering diagnosis, healing, extracts, poisons, potions, and treatment. | Une discipline de Savoir-faire couvrant le diagnostic, les soins, les extraits, les poisons, les potions et les traitements. |

## `TRUDVANG.Content.Item.DivinePower`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.DivinePower.Name` | Divine Power | Pouvoirs divins |
| `TRUDVANG.Content.Item.DivinePower.Description` | A Faith discipline that grants divinity capacity and access to Holy Tablets and divine feats. | Une discipline de Foi qui accorde une capacité de divinité et l'accès aux tablettes sacrées et aux pouvoirs divins. |

## `TRUDVANG.Content.Item.VitnerShaping`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.VitnerShaping.Name` | Vitner Shaping | Modelage du vitner |
| `TRUDVANG.Content.Item.VitnerShaping.Description` | A Vitner Craft discipline used with Galding, Sejding, or Vyrding specialties to weave spells. | Une discipline de Maîtrise du vitner utilisée avec les spécialités Galda, Sejda ou Vyrda pour tisser des sortilèges. |

## `TRUDVANG.Content.Item.Survival`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Item.Survival.Name` | Survival | Survie |
| `TRUDVANG.Content.Item.Survival.Description` | A Wilderness discipline covering prolonged travel, shelter, weather, food, and life beyond settled lands. | Une discipline de Nature couvrant les voyages prolongés, l'abri, la météo, la nourriture et la vie au-delà des terres civilisées. |

## `TRUDVANG.Content.Table.StormlanderMale`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.StormlanderMale.Name` | Names - Stormlander Men | Noms - Hommes stormlander |

## `TRUDVANG.Content.Table.StormlanderFemale`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.StormlanderFemale.Name` | Names - Stormlander Women | Noms - Femmes stormlander |

## `TRUDVANG.Content.Table.ExtractEffect`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.ExtractEffect.Name` | Extract Effects | Effets des extraits |
| `TRUDVANG.Content.Table.ExtractEffect.Mild` | Mild effect (1-5) | Effet léger (1-5) |
| `TRUDVANG.Content.Table.ExtractEffect.Moderate` | Moderate effect (6-10), followed by mild | Effet modéré (6-10), suivi de l'effet léger |
| `TRUDVANG.Content.Table.ExtractEffect.Substantial` | Substantial effect (11-15), followed by moderate and mild | Effet substantiel (11-15), suivi des effets modéré et léger |
| `TRUDVANG.Content.Table.ExtractEffect.Complete` | Complete effect (16-20), followed by each lower effect | Effet complet (16-20), suivi de chaque effet inférieur |

## `TRUDVANG.Content.Table.FearLevel`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.FearLevel.Name` | Fear Levels | Niveaux de peur |
| `TRUDVANG.Content.Table.FearLevel.One` | Fear level 1 (1-10): uneasy, no universal modifier | Niveau de peur 1 (1-10) : angoissé, aucun modificateur universel |
| `TRUDVANG.Content.Table.FearLevel.Two` | Fear level 2 (11-20): frightened, -1 SV and initiative | Niveau de peur 2 (11-20) : effrayé, -1 VC et initiative |
| `TRUDVANG.Content.Table.FearLevel.Three` | Fear level 3 (21-30): horrified, -3 SV and initiative | Niveau de peur 3 (21-30) : horrifié, -3 VC et initiative |
| `TRUDVANG.Content.Table.FearLevel.Four` | Fear level 4 (31-40): terrified, -5 SV and initiative | Niveau de peur 4 (31-40) : terrifié, -5 VC et initiative |
| `TRUDVANG.Content.Table.FearLevel.Five` | Fear level 5 (41-50): petrified, -7 SV and initiative | Niveau de peur 5 (41-50) : pétrifié, -7 VC et initiative |

## `TRUDVANG.Content.Table.StartingExperience`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.StartingExperience.Name` | Starting Experience | Expérience de départ |
| `TRUDVANG.Content.Table.StartingExperience.Beginner` | Beginner - 300 Creation Points | Débutant - 300 points de création |
| `TRUDVANG.Content.Table.StartingExperience.Practiced` | Practiced - 500 Creation Points | Confirmé - 500 points de création |
| `TRUDVANG.Content.Table.StartingExperience.Experienced` | Experienced - 700 Creation Points | Expérimenté - 700 points de création |

## `TRUDVANG.Content.Table.RandomExtract`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.RandomExtract.Name` | Random Extract | Extrait aléatoire |

## `TRUDVANG.Content.Table.TraitCost`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.TraitCost.Name` | Trait Levels and Creation Cost | Niveaux de traits et coût en création |
| `TRUDVANG.Content.Table.TraitCost.MinusFour` | Trait -4: gain 60 Creation Points | Trait -4 : accorde 60 points de création |
| `TRUDVANG.Content.Table.TraitCost.MinusTwo` | Trait -2: gain 30 Creation Points | Trait -2 : accorde 30 points de création |
| `TRUDVANG.Content.Table.TraitCost.MinusOne` | Trait -1: gain 15 Creation Points | Trait -1 : accorde 15 points de création |
| `TRUDVANG.Content.Table.TraitCost.PlusOne` | Trait +1: spend 15 Creation Points | Trait +1 : coûte 15 points de création |
| `TRUDVANG.Content.Table.TraitCost.PlusTwo` | Trait +2: spend 30 Creation Points | Trait +2 : coûte 30 points de création |
| `TRUDVANG.Content.Table.TraitCost.PlusFour` | Trait +4: spend 60 Creation Points | Trait +4 : coûte 60 points de création |

## `TRUDVANG.Content.Table.DisciplineCost`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.DisciplineCost.Name` | Discipline and Specialty Costs | Coûts des disciplines et spécialités |
| `TRUDVANG.Content.Table.DisciplineCost.One` | Level 1: requires base SV 4; costs 7 points | Niveau 1 : exige une VC de base de 4 ; coûte 7 points |
| `TRUDVANG.Content.Table.DisciplineCost.Two` | Level 2: requires base SV 7; costs 14 points | Niveau 2 : exige une VC de base de 7 ; coûte 14 points |
| `TRUDVANG.Content.Table.DisciplineCost.Three` | Level 3: requires base SV 7; costs 21 points | Niveau 3 : exige une VC de base de 7 ; coûte 21 points |
| `TRUDVANG.Content.Table.DisciplineCost.Four` | Level 4: requires base SV 10; costs 28 points | Niveau 4 : exige une VC de base de 10 ; coûte 28 points |
| `TRUDVANG.Content.Table.DisciplineCost.Five` | Level 5: requires base SV 10; costs 35 points | Niveau 5 : exige une VC de base de 10 ; coûte 35 points |

## `TRUDVANG.Content.Table.WeaponDamage`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.WeaponDamage.Name` | Weapon Damage and Open Rolls | Dégâts des armes et jets ouverts |
| `TRUDVANG.Content.Table.WeaponDamage.Light` | One-handed light: 1d10, open roll on 10 | Légère à une main : 1d10, jet ouvert sur 10 |
| `TRUDVANG.Content.Table.WeaponDamage.Heavy` | One-handed heavy: 1d10, open roll on 9-10 | Lourde à une main : 1d10, jet ouvert sur 9-10 |
| `TRUDVANG.Content.Table.WeaponDamage.TwoHanded` | Two-handed: 1d10, open roll on 8-10 | À deux mains : 1d10, jet ouvert sur 8-10 |

## `TRUDVANG.Content.Table.RaceStats`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.RaceStats.Name` | Racial Body Points and Movement | Points de santé et mouvement raciaux |

## `TRUDVANG.Content.Table.FatalMagic`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.FatalMagic.Name` | Fatal Magic Effects | Effets de magie funeste |
| `TRUDVANG.Content.Table.FatalMagic.E0` | Nothing special happens. | Rien de particulier ne se produit. |
| `TRUDVANG.Content.Table.FatalMagic.E21` | The enchanter becomes lethargic and apathetic, suffering -2 on everything for 1d3 hours. | Le tisseur devient léthargique et apathique : -2 à toutes ses actions pendant 1d3 heures. |
| `TRUDVANG.Content.Table.FatalMagic.E23` | The enchanter loses 1d10 Vitner Points from their capacity (minimum 1) for 1d3 hours. | Le tisseur perd 1d10 points de vitner de sa capacité (minimum 1) pendant 1d3 heures. |
| `TRUDVANG.Content.Table.FatalMagic.E25` | The enchanter suffers -2 on everything and loses 1d10 Vitner Points from their capacity (minimum 1) for 1d3 hours. | Le tisseur subit -2 à toutes ses actions et perd 1d10 points de vitner de sa capacité (minimum 1) pendant 1d3 heures. |
| `TRUDVANG.Content.Table.FatalMagic.E29` | The enchanter suffers -2 on everything and loses 1d10 Vitner Points from their capacity (minimum 1) for 1d6 hours. | Le tisseur subit -2 à toutes ses actions et perd 1d10 points de vitner de sa capacité (minimum 1) pendant 1d6 heures. |
| `TRUDVANG.Content.Table.FatalMagic.E31` | The enchanter loses 1d10 (OR 9-10) Vitner Points from their remaining capacity (minimum 1) for one day. | Le tisseur perd 1d10 (JO 9-10) points de vitner de sa capacité restante (minimum 1) pendant une journée. |
| `TRUDVANG.Content.Table.FatalMagic.E33` | The failed spell absorbs vitner within 1d10 (OR 10) meters. Each creature loses 1d3 Vitner Points; creatures without Vitner Points instead lose that many Body Points. | Le sortilège absorbe le vitner dans un rayon de 1d10 (JO 10) mètres. Chaque créature perd 1d3 points de vitner ; celles qui n'en ont pas perdent autant de points de santé (PS). |
| `TRUDVANG.Content.Table.FatalMagic.E35` | A vitner enclosure surrounds the enchanter. Within 10 meters of another enchanter it flashes for 1d6 damage that ignores non-magical armor, losing equal strength until emptied. | Une enceinte de vitner entoure le tisseur. À moins de 10 mètres d'un autre tisseur, elle inflige 1d6 dégâts ignorant les armures non magiques et perd autant de puissance, jusqu'à épuisement. |
| `TRUDVANG.Content.Table.FatalMagic.E37` | The failed spell absorbs vitner within 1d10 (OR 10) meters. Each creature loses 1d6 Vitner Points; creatures without Vitner Points instead lose that many Body Points. | Le sortilège absorbe le vitner dans un rayon de 1d10 (JO 10) mètres. Chaque créature perd 1d6 points de vitner ; celles qui n'en ont pas perdent autant de points de santé (PS). |
| `TRUDVANG.Content.Table.FatalMagic.E39` | The enchanter loses one third of their vitner capacity for 1d3 days and suffers a visual negation (1d10): 1-2 bark skin; 3-4 doubled finger length; 5-6 grass hair; 7-8 local-animal fur; 9 the closest person suffers 1-8; 10 everyone within 10 meters suffers 1-8. | Le tisseur perd un tiers de sa capacité de vitner pendant 1d3 jours et subit une négation cosmétique (1d10) : 1-2 peau d'écorce ; 3-4 doigts deux fois plus longs ; 5-6 cheveux d'herbe ; 7-8 fourrure locale ; 9 la personne la plus proche subit 1-8 ; 10 tous dans un rayon de 10 mètres subissent 1-8. |
| `TRUDVANG.Content.Table.FatalMagic.E41` | A vitner enclosure surrounds the enchanter. Within 20 meters of another enchanter it flashes for 1d6 damage that ignores non-magical armor, losing equal strength until emptied. | Une enceinte de vitner entoure le tisseur. À moins de 20 mètres d'un autre tisseur, elle inflige 1d6 dégâts ignorant les armures non magiques et perd autant de puissance, jusqu'à épuisement. |
| `TRUDVANG.Content.Table.FatalMagic.E43` | The failed spell absorbs vitner within 1d10 (OR 10) meters. Each creature loses 1d10 Vitner Points; creatures without Vitner Points instead lose that many Body Points. | Le sortilège absorbe le vitner dans un rayon de 1d10 (JO 10) mètres. Chaque créature perd 1d10 points de vitner ; celles qui n'en ont pas perdent autant de points de santé (PS). |
| `TRUDVANG.Content.Table.FatalMagic.E44` | A vitner enclosure surrounds the enchanter. Within 50 meters of another enchanter it flashes for 1d6 damage that ignores non-magical armor, losing equal strength until emptied. | Une enceinte de vitner entoure le tisseur. À moins de 50 mètres d'un autre tisseur, elle inflige 1d6 dégâts ignorant les armures non magiques et perd autant de puissance, jusqu'à épuisement. |
| `TRUDVANG.Content.Table.FatalMagic.E45` | The enchanter loses half their vitner capacity for 1d6 days and suffers a visual negation (1d10): 1-2 bark skin; 3-4 doubled finger length; 5-6 peat-moss hair; 7-8 local-animal fur; 9 the closest person suffers 1-8; 10 everyone within 10 meters suffers 1-8. | Le tisseur perd la moitié de sa capacité de vitner pendant 1d6 jours et subit une négation cosmétique (1d10) : 1-2 peau d'écorce ; 3-4 doigts deux fois plus longs ; 5-6 cheveux de tourbe ; 7-8 fourrure locale ; 9 la personne la plus proche subit 1-8 ; 10 tous dans un rayon de 10 mètres subissent 1-8. |
| `TRUDVANG.Content.Table.FatalMagic.E46` | The enchanter becomes vitner-blind and cannot evoke spells for 1d6 days. Within 1d10 (OR 10) meters, each creature loses 1d6 Vitner Points; creatures without Vitner Points instead lose that many Body Points. | Le tisseur devient aveugle au vitner et ne peut lancer de sortilèges pendant 1d6 jours. Dans un rayon de 1d10 (JO 10) mètres, chacun perd 1d6 points de vitner ; ceux qui n'en ont pas perdent autant de points de santé (PS). |
| `TRUDVANG.Content.Table.FatalMagic.E47` | A vitner enclosure surrounds the enchanter. Everyone within 1d10 (OR 10) meters is hit for 1d10 damage that ignores non-magical armor; each discharge drains 1d3 Vitner Points from the enclosure until emptied. | Une enceinte de vitner entoure le tisseur. Tous dans un rayon de 1d10 (JO 10) mètres subissent 1d10 dégâts ignorant les armures non magiques ; chaque décharge retire 1d3 points de vitner à l'enceinte, jusqu'à épuisement. |
| `TRUDVANG.Content.Table.FatalMagic.E48` | The enchanter loses their memory for 1d3 days and cannot evoke spells or perform skills. | Le tisseur perd la mémoire pendant 1d3 jours et ne peut ni lancer de sortilèges ni utiliser de compétences. |
| `TRUDVANG.Content.Table.FatalMagic.E49` | A harmless light explosion empties the enchanter of vitner. Capacity drops to 1 and starts recovering after one week. | Une explosion lumineuse inoffensive vide le vitner du tisseur. Sa capacité tombe à 1 et ne commence à se rétablir qu'après une semaine. |
| `TRUDVANG.Content.Table.FatalMagic.E50` | A vitner enclosure surrounds the enchanter. Everyone within 1d10 (OR 9-10) meters is hit for 1d10 damage that ignores non-magical armor; each discharge drains 1 Vitner Point until emptied. | Une enceinte de vitner entoure le tisseur. Tous dans un rayon de 1d10 (JO 9-10) mètres subissent 1d10 dégâts ignorant les armures non magiques ; chaque décharge retire 1 point de vitner, jusqu'à épuisement. |
| `TRUDVANG.Content.Table.FatalMagic.E51` | The enchanter and every creature within 2d6 meters suffer 1d10 damage that ignores non-magical armor. The enchanter loses half their remaining Vitner Points and recovery starts after one week. | Le tisseur et toutes les créatures dans un rayon de 2d6 mètres subissent 1d10 dégâts ignorant les armures non magiques. Le tisseur perd la moitié de ses points de vitner restants et ne récupère qu'après une semaine. |
| `TRUDVANG.Content.Table.FatalMagic.E52` | The enchanter suffers Body Point damage equal to the spell's total vitner cost, falls unconscious for 1d10 minutes, and drops to 1 vitner capacity; recovery starts after one week. | Le tisseur subit autant de dégâts aux points de santé (PS) que le coût total en vitner du sortilège, sombre dans l'inconscience pendant 1d10 minutes et sa capacité tombe à 1 ; elle ne récupère qu'après une semaine. |
| `TRUDVANG.Content.Table.FatalMagic.E53` | A blinding discharge forces everyone within 2d6 meters to pass a Psyche-modified Situation roll against 10 or go blind for 1d5 minutes. The enchanter suffers damage equal to the spell's vitner cost, falls unconscious for 1d10 (OR 9-10) minutes, and drops to 1 capacity; recovery starts after one week. | Une décharge aveuglante oblige tous ceux situés dans un rayon de 2d6 mètres à réussir un jet de situation modifié par la Psyché contre 10 ou être aveuglés pendant 1d5 minutes. Le tisseur subit autant de dégâts que le coût du sortilège, sombre dans l'inconscience pendant 1d10 (JO 9-10) minutes et sa capacité tombe à 1 pour une semaine. |
| `TRUDVANG.Content.Table.FatalMagic.E54` | The enchanter suffers a minor stroke, takes 2d10 (OR 10) damage, and falls into a coma for 1d10 days. | Le tisseur subit une attaque cérébrale mineure, reçoit 2d10 (JO 10) dégâts et sombre dans le coma pendant 1d10 jours. |
| `TRUDVANG.Content.Table.FatalMagic.E55` | The enchanter suffers damage equal to the spell's vitner cost and falls unconscious for 1d10 (OR 7-10) minutes; everyone within 2d6 meters suffers half that damage. Capacity drops to 1 and recovery starts after two weeks. | Le tisseur subit autant de dégâts que le coût du sortilège et sombre dans l'inconscience pendant 1d10 (JO 7-10) minutes ; tous dans un rayon de 2d6 mètres subissent la moitié. Sa capacité tombe à 1 et ne récupère qu'après deux semaines. |
| `TRUDVANG.Content.Table.FatalMagic.E56` | The enchanter suffers a severe stroke, takes 2d10 (OR 9-10) damage, loses one Intelligence step, and falls unconscious for 1d10 days. | Le tisseur subit une grave attaque cérébrale, reçoit 2d10 (JO 9-10) dégâts, perd un cran d'Intelligence et sombre dans l'inconscience pendant 1d10 jours. |
| `TRUDVANG.Content.Table.FatalMagic.E57` | An enormous negation absorbs 1d10 (OR 6-10) Body Points and empties all vitner. Capacity drops to 1 and recovery starts after two weeks. | Une négation colossale absorbe 1d10 (JO 6-10) points de santé (PS) et vide tout le vitner. La capacité tombe à 1 et ne récupère qu'après deux semaines. |
| `TRUDVANG.Content.Table.FatalMagic.E58` | The enchanter opens a fog portal to Bloodheim, which devours them. | Le tisseur ouvre un portail de brume vers Blotheim, qui le dévore. |
| `TRUDVANG.Content.Table.FatalMagic.E59` | The enchanter becomes a lightning orb that explodes after 2d6 action rounds. Everything within 50 meters suffers 1d10 (OR 7-10) Body Point damage; the enchanter disappears. | Le tisseur devient un orbe de foudre qui explose après 2d6 tours de jeu. Tout ce qui se trouve dans un rayon de 50 mètres subit 1d10 (JO 7-10) dégâts aux points de santé (PS) ; le tisseur disparaît. |
| `TRUDVANG.Content.Table.FatalMagic.E60` | The enchanter becomes a black-energy orb that explodes after 1d6 action rounds. Everything within 100 meters suffers 1d10 (OR 5-10) Body Point damage and everything within 300 meters suffers half; the enchanter disappears. | Le tisseur devient un orbe d'énergie noire qui explose après 1d6 tours de jeu. Tout ce qui se trouve dans un rayon de 100 mètres subit 1d10 (JO 5-10) dégâts aux points de santé (PS) et tout ce qui se trouve dans un rayon de 300 mètres en subit la moitié ; le tisseur disparaît. |

## `TRUDVANG.Content.Table.FatalFailure`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Table.FatalFailure.Name` | Fatal Failure Effects | Effets d'échec critique |
| `TRUDVANG.Content.Table.FatalFailure.E0` | Nothing happens. | Rien ne se produit. |
| `TRUDVANG.Content.Table.FatalFailure.E21` | The dimwalker loses touch with spiritual power for 1d6 minutes and cannot use Divinity Points. | L'arpenteur des brumes perd le contact avec sa puissance spirituelle pendant 1d6 minutes et ne peut utiliser de points de divinité. |
| `TRUDVANG.Content.Table.FatalFailure.E31` | The dimwalker loses touch with spiritual power for 1d6 hours and cannot use Divinity Points. | L'arpenteur des brumes perd le contact avec sa puissance spirituelle pendant 1d6 heures et ne peut utiliser de points de divinité. |
| `TRUDVANG.Content.Table.FatalFailure.E36` | The dimwalker loses the knowledge and ability to invoke 1d3 random abilities for 1d6 days. | L'arpenteur des brumes perd la connaissance et la capacité d'invoquer 1d3 pouvoirs choisis au hasard pendant 1d6 jours. |
| `TRUDVANG.Content.Table.FatalFailure.E41` | The dimwalker loses the knowledge and ability to invoke the attempted ability for 2d6 days. | L'arpenteur des brumes perd la connaissance et la capacité d'invoquer le pouvoir qu'il vient d'essayer d'activer pendant 2d6 jours. |
| `TRUDVANG.Content.Table.FatalFailure.E46` | The dimwalker loses the knowledge and ability to invoke 1d3 random abilities for 2d6 days. | L'arpenteur des brumes perd la connaissance et la capacité d'invoquer 1d3 pouvoirs choisis au hasard pendant 2d6 jours. |
| `TRUDVANG.Content.Table.FatalFailure.E51` | The dimwalker loses touch with spiritual power for 1d6 days and cannot use Divinity Points. | L'arpenteur des brumes perd le contact avec sa puissance spirituelle pendant 1d6 jours et ne peut utiliser de points de divinité. |
| `TRUDVANG.Content.Table.FatalFailure.E55` | The gods permanently revoke the attempted ability; it will always fail. | Les dieux lui retirent définitivement le pouvoir qu'il vient d'essayer d'activer ; celui-ci échouera toujours. |
| `TRUDVANG.Content.Table.FatalFailure.E57` | The gods permanently revoke 1d3 random accessible abilities; they will always fail. | Les dieux lui retirent définitivement 1d3 pouvoirs accessibles choisis au hasard ; ceux-ci échoueront toujours. |
| `TRUDVANG.Content.Table.FatalFailure.E59` | The god permanently refuses to grant the dimwalker any divine abilities. | Le dieu refuse définitivement d'accorder le moindre pouvoir divin à l'arpenteur des brumes. |
| `TRUDVANG.Content.Table.FatalFailure.E60` | The gods immediately destroy the blasphemer and revoke their very existence. | Les dieux considèrent l'arpenteur des brumes comme une insulte à leur majesté et retirent immédiatement cette souillure du visage de Trudvang, en faisant disparaître le blasphémateur et en effaçant toute trace de son existence. |

## `TRUDVANG.Content.Actor.Galtir`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.Galtir.Name` | Galtir | Galtir |
| `TRUDVANG.Content.Actor.Galtir.Description` | A brutish tusked humanoid. This standard specimen has 23 Body Points, Dexterity -1, Intelligence -4, and Strength +2. | Un humanoïde bestial pourvu de défenses. Ce spécimen standard possède 23 points de santé, Dextérité -1, Intelligence -4 et Force +2. |

## `TRUDVANG.Content.Actor.GiantSnake`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.GiantSnake.Name` | Giant Snake | Serpent géant |
| `TRUDVANG.Content.Actor.GiantSnake.Description` | A massive serpent with crushing coils, Hylja camouflage, and a paralyzing stare. Standard specimen: 95 Body Points. | Un serpent massif aux anneaux écrasants, doué de camouflage et doté d'un regard paralysant. Spécimen standard : 95 points de santé. |

## `TRUDVANG.Content.Actor.GiantSpider`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.GiantSpider.Name` | Giant Spider | Araignée géante |
| `TRUDVANG.Content.Actor.GiantSpider.Description` | An ancient colossal spider able to throw webs, paralyze prey, and cocoon victims. Standard specimen: 95 Body Points. | Une araignée colossale et ancestrale, capable de projeter des toiles, de paralyser ses proies et de les envelopper dans un cocon. Spécimen standard : 95 points de santé. |

## `TRUDVANG.Content.Actor.Gryphon`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.Gryphon.Name` | Gryphon | Griffon |
| `TRUDVANG.Content.Actor.Gryphon.Description` | A huge winged hunter combining an eagle's head and wings with a feline body. Standard specimen: 87 Body Points. | Un immense chasseur ailé associant tête et ailes d'aigle à un corps félin. Spécimen standard : 87 points de santé. |

## `TRUDVANG.Content.Actor.NightUlm`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.NightUlm.Name` | Night Ulm | Nattulm |
| `TRUDVANG.Content.Actor.NightUlm.Description` | A small winged blood-drinker whose numbing saliva can spread the dreaded rugtanne infection. Standard specimen: 25 Body Points. | Un petit buveur de sang ailé dont la salive anesthésiante peut transmettre la redoutable infection rugtanne. Spécimen standard : 25 points de santé. |

## `TRUDVANG.Content.Actor.ThornBeast`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.ThornBeast.Name` | Thorn Beast | Bête épineuse |
| `TRUDVANG.Content.Actor.ThornBeast.Description` | An immense flying beast whose stench alone can inflict Fear Points. Standard specimen: 171 Body Points. | Une immense bête volante dont la seule puanteur peut infliger des points de peur. Spécimen standard : 171 points de santé. |

## `TRUDVANG.Content.Actor.TrollBull`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.TrollBull.Name` | Troll Bull | Minokks (taureau troll) |
| `TRUDVANG.Content.Actor.TrollBull.Description` | A hulking Haminges-worshiping humanoid with horns, natural armor, and a devastating charge. Standard specimen: 58 Body Points. | Un humanoïde massif vénérant Haminges, pourvu de cornes, d'une protection naturelle et d'une charge dévastatrice. Spécimen standard : 58 points de santé. |

## `TRUDVANG.Content.Actor.Warg`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Actor.Warg.Name` | Warg | Warg |
| `TRUDVANG.Content.Actor.Warg.Description` | A fast predatory quadruped whose bite can spread warg sickness. Standard specimen: 18 Body Points. | Un quadrupède prédateur et rapide dont la morsure peut transmettre le mal du warg. Spécimen standard : 18 points de santé. |

## `TRUDVANG.Content.Attack.BiteTusk`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Attack.BiteTusk.Name` | Bite / Tusk | Morsure / Défenses |

## `TRUDVANG.Content.Attack.Bite`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Attack.Bite.Name` | Bite | Morsure |

## `TRUDVANG.Content.Attack.Claws`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Attack.Claws.Name` | Claws | Griffes |

## `TRUDVANG.Content.Attack.ImpalingLeg`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Attack.ImpalingLeg.Name` | Impaling Leg | Patte empalante |

## `TRUDVANG.Content.Attack.Horns`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Attack.Horns.Name` | Horns | Cornes |

## `TRUDVANG.Content.Feat.DeepBellow`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.DeepBellow.Name` | Deep Bellow | Mugissement profond |
| `TRUDVANG.Content.Feat.DeepBellow.Description` | The galtir unleashes a violent bellow; nearby creatures may need to resist fear or distraction. | Le galtir pousse un mugissement violent ; les créatures proches peuvent devoir résister à la peur ou à la distraction. |

## `TRUDVANG.Content.Feat.Fearless`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.Fearless.Name` | Fearless | Sans peur |
| `TRUDVANG.Content.Feat.Fearless.Description` | The creature is unusually resistant or immune to ordinary sources of Fear Points. | La créature résiste inhabituellement bien aux sources ordinaires de points de peur, voire y est immunisée. |

## `TRUDVANG.Content.Feat.Constricting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.Constricting.Name` | Constricting (SV 10) | Constriction (VC 10) |
| `TRUDVANG.Content.Feat.Constricting.Description` | After surrounding a victim, the snake tightens its coils. The victim must break free or suffer crushing consequences. | Après avoir enserré sa victime, le serpent resserre ses anneaux. La victime doit se libérer ou subir les conséquences de l'écrasement. |

## `TRUDVANG.Content.Feat.ParalyzingStare`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.ParalyzingStare.Name` | Paralyzing Stare | Regard paralysant |
| `TRUDVANG.Content.Feat.ParalyzingStare.Description` | The victim makes a Psyche-based Situation roll with Situation Value 6 or is paralyzed for 1d3 action rounds. | La victime effectue un test de situation basé sur le Psychisme contre une valeur de situation de 6, sinon elle est paralysée pendant 1d3 tours de jeu. |

## `TRUDVANG.Content.Feat.AttackWeb`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.AttackWeb.Name` | Attack Web (SV 9) | Attaque par toile (VC 9) |
| `TRUDVANG.Content.Feat.AttackWeb.Description` | Throws a broad sticky web. A trapped victim needs a Strength-based Situation roll, usually against Situation Value 7, to break free. | Projette une large toile poisseuse. Une victime piégée doit réussir un test de situation basé sur la Force, généralement contre une valeur de situation de 7, pour se libérer. |

## `TRUDVANG.Content.Feat.AttackAbove`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.AttackAbove.Name` | Attack From Above | Attaque depuis les hauteurs |
| `TRUDVANG.Content.Feat.AttackAbove.Description` | The gryphon exploits flight and momentum to strike from above before climbing away. | Le griffon exploite son vol et son élan pour frapper d'en haut avant de remonter. |

## `TRUDVANG.Content.Feat.Bloodsucker`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.Bloodsucker.Name` | Bloodsucker | Suceur de sang |
| `TRUDVANG.Content.Feat.Bloodsucker.Description` | Once attached, the night ulm drains blood in subsequent rounds and may expose a human victim to disease. | Une fois accroché, le nattulm draine le sang aux tours suivants et peut exposer une victime humaine à la maladie. |

## `TRUDVANG.Content.Feat.TerrifyingStench`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.TerrifyingStench.Name` | Terrifying Stench | Puanteur terrifiante |
| `TRUDVANG.Content.Feat.TerrifyingStench.Description` | Creatures within 5 meters gain 1d10 open Fear Points from the overwhelming smell unless accustomed to it. | Les créatures situées à moins de 5 mètres gagnent 1d10 points de peur à jet ouvert à cause de l'odeur insupportable, sauf si elles y sont habituées. |

## `TRUDVANG.Content.Feat.Charge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.Charge.Name` | Charge | Charge |
| `TRUDVANG.Content.Feat.Charge.Description` | The troll bull begins combat with a horn-first rush capable of knocking victims down and increasing damage. | Le minokks commence le combat par une ruée cornes en avant capable de renverser les victimes et d'augmenter les dégâts. |

## `TRUDVANG.Content.Feat.TrollHeart`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.TrollHeart.Name` | Troll Bull Heart | Cœur de minokks |
| `TRUDVANG.Content.Feat.TrollHeart.Description` | The creature's brutal vitality and protective rage make it exceptionally difficult to stop. | La vitalité brutale et la rage protectrice de la créature la rendent exceptionnellement difficile à arrêter. |

## `TRUDVANG.Content.Feat.WargSickness`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Feat.WargSickness.Name` | Warg Sickness | Maladie du warg |
| `TRUDVANG.Content.Feat.WargSickness.Description` | A bitten human may contract a transformative disease. A Constitution- and Psyche-based Situation roll is commonly required to resist it. | Un humain mordu peut contracter une maladie transformative. Un test de situation basé sur la Constitution et le Psychisme est généralement requis pour y résister. |

## `TRUDVANG.Content.Tablet.vitner-animal-vitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-animal-vitner.Name` | Animal Vitner | Vitner animal |

## `TRUDVANG.Content.Tablet.vitner-body-vitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-body-vitner.Name` | Body Vitner | Vitner corporel |

## `TRUDVANG.Content.Tablet.vitner-delusion-vitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-delusion-vitner.Name` | Delusion Vitner | Vitner illusoire |

## `TRUDVANG.Content.Tablet.vitner-dimvitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-dimvitner.Name` | Dimvitner | Dimvitner |

## `TRUDVANG.Content.Tablet.vitner-flame-craft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-flame-craft.Name` | Flame Craft | Maîtrise des flammes |

## `TRUDVANG.Content.Tablet.vitner-perceiving`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-perceiving.Name` | Perceiving | Perception |

## `TRUDVANG.Content.Tablet.vitner-power-of-thought`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-power-of-thought.Name` | Power of Thought | Pouvoir de la pensée |

## `TRUDVANG.Content.Tablet.vitner-power-of-vision`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-power-of-vision.Name` | Power of Vision | Pouvoir de la vision |

## `TRUDVANG.Content.Tablet.vitner-soil-craft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-soil-craft.Name` | Soil Craft | Maîtrise de la terre |

## `TRUDVANG.Content.Tablet.vitner-vitner-craft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-vitner-craft.Name` | Vitner Craft | Art du vitner |

## `TRUDVANG.Content.Tablet.vitner-vitner-of-objects`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-vitner-of-objects.Name` | Vitner of Objects | Vitner des objets |

## `TRUDVANG.Content.Tablet.vitner-water-craft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-water-craft.Name` | Water Craft | Maîtrise de l'eau |

## `TRUDVANG.Content.Tablet.vitner-wind-craft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-wind-craft.Name` | Wind Craft | Maîtrise du vent |

## `TRUDVANG.Content.Tablet.vitner-witchcraft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.vitner-witchcraft.Name` | Witchcraft | Sorcellerie |

## `TRUDVANG.Content.Tablet.holy-gerbanis-influence-of-jorn`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-influence-of-jorn.Name` | Influence of Jorn | Influence de Jorn |

## `TRUDVANG.Content.Tablet.holy-gerbanis-power-of-enken`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-power-of-enken.Name` | Power of Enken | Pouvoir d'Enken |

## `TRUDVANG.Content.Tablet.holy-gerbanis-strength-of-stormi`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-strength-of-stormi.Name` | Strength of Stormi | Force de Storme |

## `TRUDVANG.Content.Tablet.holy-gerbanis-warmth-of-sunvei`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-warmth-of-sunvei.Name` | Warmth of Sunvei | Chaleur de Solvei |

## `TRUDVANG.Content.Tablet.holy-gerbanis-wisdom-of-windinna`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-wisdom-of-windinna.Name` | Wisdom of Windinna | Sagesse de Windinna |

## `TRUDVANG.Content.Tablet.holy-gerbanis-wrath-of-tyrd`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-gerbanis-wrath-of-tyrd.Name` | Wrath of Tyrd | Fureur de Tyrd |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-gift-of-thanja`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-gift-of-thanja.Name` | Gift of Thanja | Don de Thanja |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-halawen-s-offering`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-halawen-s-offering.Name` | Halawen's Offering | Offrande de Halawen |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-heritage-of-majne`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-heritage-of-majne.Name` | Heritage of Majne | Héritage de Majne |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-magh-s-gift`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-magh-s-gift.Name` | Magh's Gift | Don de Magh |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-nema-s-usefulness`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-nema-s-usefulness.Name` | Nema's Usefulness | Utilité de Nema |

## `TRUDVANG.Content.Tablet.holy-ealdtradition-tribute-of-morgu`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-ealdtradition-tribute-of-morgu.Name` | Tribute of Morgu | Tribut de Morgu |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-anger`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-anger.Name` | Tablet of Anger | Tablette de la colère |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-grace`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-grace.Name` | Tablet of Grace | Tablette de la grâce |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-knight`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-knight.Name` | Tablet of the Knight | Tablette du chevalier |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-shield`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-shield.Name` | Tablet of the Shield | Tablette du bouclier |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-sun`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-the-sun.Name` | Tablet of the Sun | Tablette du soleil |

## `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-voices`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-tenetnid-tablet-of-voices.Name` | Tablet of Voices | Tablette des voix |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-beast`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-beast.Name` | Power of the Beast | Pouvoir de la bête |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-dragon`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-dragon.Name` | Power of the Dragon | Puissance du dragon |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-men`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-men.Name` | Power of Men | Puissance des hommes |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-scale`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-scale.Name` | Power of the Scale | Puissance de l'écaille |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-thurses`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-thurses.Name` | Power of the Thurses | Puissance des tursirs |

## `TRUDVANG.Content.Tablet.holy-haminges-power-of-trolls`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-trolls.Name` | Power of Trolls | Puissance des trolls |

## `TRUDVANG.Content.Tablet.holy-thuuldom-anvil-shock`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-anvil-shock.Name` | Anvil Shock | Choc de l'enclume |

## `TRUDVANG.Content.Tablet.holy-thuuldom-borjorn-s-hand`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-borjorn-s-hand.Name` | Borjorn's Hand | Main de Borjorn |

## `TRUDVANG.Content.Tablet.holy-thuuldom-cave-spider-s-grip`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-cave-spider-s-grip.Name` | Cave Spider's Grip | Prise de l'araignée des cavernes |

## `TRUDVANG.Content.Tablet.holy-thuuldom-earthquake`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-earthquake.Name` | Earthquake | Tremblement de terre |

## `TRUDVANG.Content.Tablet.holy-thuuldom-fang-of-yukk`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-fang-of-yukk.Name` | Fang of Yukk | Croc de Yukk |

## `TRUDVANG.Content.Tablet.holy-thuuldom-gills-of-the-blackfish`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-gills-of-the-blackfish.Name` | Gills of the Blackfish | Branchies du brochet |

## `TRUDVANG.Content.Tablet.holy-thuuldom-hammer-fists`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-hammer-fists.Name` | Hammer Fists | Poings d'acier |

## `TRUDVANG.Content.Tablet.holy-thuuldom-healing-rune`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-healing-rune.Name` | Healing Rune | Rune de guérison |

## `TRUDVANG.Content.Tablet.holy-thuuldom-heat-of-the-depths`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-heat-of-the-depths.Name` | Heat of the Depths | Chaleur des profondeurs |

## `TRUDVANG.Content.Tablet.holy-thuuldom-labyrinth-blood`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-labyrinth-blood.Name` | Labyrinth Blood | Sang du labyrinthe |

## `TRUDVANG.Content.Tablet.holy-thuuldom-mark-of-brokk`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-mark-of-brokk.Name` | Mark of Brokk | Marque de Brokk |

## `TRUDVANG.Content.Tablet.holy-thuuldom-power-of-repair`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-power-of-repair.Name` | Power of Repair | Pouvoir de réparation |

## `TRUDVANG.Content.Tablet.holy-thuuldom-scales`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-scales.Name` | Scales | Écailles |

## `TRUDVANG.Content.Tablet.holy-thuuldom-stoneling`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-stoneling.Name` | Stoneling | Enfant de la pierre |

## `TRUDVANG.Content.Tablet.holy-thuuldom-stone-to-clay`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-stone-to-clay.Name` | Stone to Clay | Transformation de pierre en argile |

## `TRUDVANG.Content.Tablet.holy-thuuldom-stoneshape`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-stoneshape.Name` | Stoneshape | Aspect de la pierre |

## `TRUDVANG.Content.Tablet.holy-thuuldom-well-of-water`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-thuuldom-well-of-water.Name` | Well of Water | Source d'eau |

## `TRUDVANG.Content.Tablet.holy-toikalokke-animal-mind`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-toikalokke-animal-mind.Name` | Animal Mind | Esprit animal |

## `TRUDVANG.Content.Tablet.holy-toikalokke-lynx-power`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-toikalokke-lynx-power.Name` | Lynx Power | Agilité du lynx |

## `TRUDVANG.Content.Tablet.holy-toikalokke-master-of-elements`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Tablet.holy-toikalokke-master-of-elements.Name` | Master of Elements | Maître des éléments |

## `TRUDVANG.Content.Power.vitner-animal-vitner:messenger:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:messenger:0.Name` | Messenger | Messager |

## `TRUDVANG.Content.Power.vitner-animal-vitner:speak-to-animals:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:speak-to-animals:1.Name` | Speak to Animals | Parler aux animaux |

## `TRUDVANG.Content.Power.vitner-animal-vitner:call-on-animals:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:call-on-animals:2.Name` | Call on Animals | Appel des animaux |

## `TRUDVANG.Content.Power.vitner-animal-vitner:conjure-ravens:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:conjure-ravens:3.Name` | Conjure Ravens | Conjuration de corbeaux |

## `TRUDVANG.Content.Power.vitner-animal-vitner:control-animals:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:control-animals:4.Name` | Control Animals | Contrôle des animaux |

## `TRUDVANG.Content.Power.vitner-animal-vitner:mind-of-the-wolf:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:mind-of-the-wolf:5.Name` | Mind of the Wolf | Esprit du loup |

## `TRUDVANG.Content.Power.vitner-animal-vitner:possess-animals:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:possess-animals:6.Name` | Possess Animals | Possession animale |

## `TRUDVANG.Content.Power.vitner-animal-vitner:create-messenger:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:create-messenger:7.Name` | Create Messenger | Création de messager |

## `TRUDVANG.Content.Power.vitner-animal-vitner:send-message:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-animal-vitner:send-message:8.Name` | Send Message | Messager magique |

## `TRUDVANG.Content.Power.vitner-body-vitner:grip:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:grip:0.Name` | Grip | Adhérence |

## `TRUDVANG.Content.Power.vitner-body-vitner:tipping:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:tipping:1.Name` | Tipping | Croche-pied |

## `TRUDVANG.Content.Power.vitner-body-vitner:hearing-deafness:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:hearing-deafness:2.Name` | Hearing/Deafness | Acuité auditive/surdité |

## `TRUDVANG.Content.Power.vitner-body-vitner:sense-of-smell:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:sense-of-smell:3.Name` | Sense of Smell | Sens de l'odorat |

## `TRUDVANG.Content.Power.vitner-body-vitner:vision-blindness:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:vision-blindness:4.Name` | Vision/Blindness | Vision/cécité |

## `TRUDVANG.Content.Power.vitner-body-vitner:leather-skin:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:leather-skin:5.Name` | Leather Skin | Peau de cuir |

## `TRUDVANG.Content.Power.vitner-body-vitner:immobilize:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:immobilize:6.Name` | Immobilize | Immobilisation |

## `TRUDVANG.Content.Power.vitner-body-vitner:appearance-change:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:appearance-change:7.Name` | Appearance Change | Modification d'apparence |

## `TRUDVANG.Content.Power.vitner-body-vitner:strengthen:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:strengthen:8.Name` | Strengthen | Vigueur |

## `TRUDVANG.Content.Power.vitner-body-vitner:hasten:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:hasten:9.Name` | Hasten | Hâte |

## `TRUDVANG.Content.Power.vitner-body-vitner:imprison:10`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:imprison:10.Name` | Imprison | Emprisonnement |

## `TRUDVANG.Content.Power.vitner-body-vitner:change-creature:11`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-body-vitner:change-creature:11.Name` | Change Creature | Transformation |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:roar:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:roar:0.Name` | Roar | Grondement |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:phantom-sound:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:phantom-sound:1.Name` | Phantom Sound | Son illusoire |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:shriek:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:shriek:2.Name` | Shriek | Son aigu |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:increase-sounds:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:increase-sounds:3.Name` | Increase Sounds | Amplification des sons |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:traceless:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:traceless:4.Name` | Traceless | Sans trace |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:ghost-voice:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:ghost-voice:5.Name` | Ghost Voice | Voix illusoire |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:depict:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:depict:6.Name` | Depict | Image |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:camouflage:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:camouflage:7.Name` | Camouflage | Camouflage |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:landscape-illusion:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:landscape-illusion:8.Name` | Landscape Illusion | Paysage illusoire |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:silence:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:silence:9.Name` | Silence | Silence |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:lindwurm-illusion:10`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:lindwurm-illusion:10.Name` | Lindwurm Illusion | Lindwurm illusoire |

## `TRUDVANG.Content.Power.vitner-delusion-vitner:invisibility:11`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-delusion-vitner:invisibility:11.Name` | Invisibility | Invisibilité |

## `TRUDVANG.Content.Power.vitner-dimvitner:animate-undead:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:animate-undead:0.Name` | Animate Undead | Animation des morts-vivants |

## `TRUDVANG.Content.Power.vitner-dimvitner:hand-of-death:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:hand-of-death:1.Name` | Hand of Death | Main funeste |

## `TRUDVANG.Content.Power.vitner-dimvitner:dismiss-undead:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:dismiss-undead:2.Name` | Dismiss Undead | Renvoi des morts-vivants |

## `TRUDVANG.Content.Power.vitner-dimvitner:speak-to-undead:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:speak-to-undead:3.Name` | Speak to Undead | Conversation de l'au-delà |

## `TRUDVANG.Content.Power.vitner-dimvitner:tendril-of-dimhall:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:tendril-of-dimhall:4.Name` | Tendril of Dimhall | Vrille de Dimhall |

## `TRUDVANG.Content.Power.vitner-dimvitner:vitner-theft:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:vitner-theft:5.Name` | Vitner Theft | Vol de vitner |

## `TRUDVANG.Content.Power.vitner-dimvitner:summon-wight:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:summon-wight:6.Name` | Summon Wight | Invocation d'un revenant |

## `TRUDVANG.Content.Power.vitner-dimvitner:control-undead:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:control-undead:7.Name` | Control Undead | Contrôle des morts-vivants |

## `TRUDVANG.Content.Power.vitner-dimvitner:darkness-of-dimhall:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-dimvitner:darkness-of-dimhall:8.Name` | Darkness of Dimhall | Ténèbres de Dimhall |

## `TRUDVANG.Content.Power.vitner-flame-craft:heat-water:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:heat-water:0.Name` | Heat Water | Ébullition |

## `TRUDVANG.Content.Power.vitner-flame-craft:spark:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:spark:1.Name` | Spark | Flammèche |

## `TRUDVANG.Content.Power.vitner-flame-craft:burning-hand:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:burning-hand:2.Name` | Burning Hand | Main brûlante |

## `TRUDVANG.Content.Power.vitner-flame-craft:flame-burst:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:flame-burst:3.Name` | Flame Burst | Éruption de flammes |

## `TRUDVANG.Content.Power.vitner-flame-craft:protection-from-fire:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:protection-from-fire:4.Name` | Protection from Fire | Protection contre le feu |

## `TRUDVANG.Content.Power.vitner-flame-craft:flame-control:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:flame-control:5.Name` | Flame Control | Contrôle des flammes |

## `TRUDVANG.Content.Power.vitner-flame-craft:warmth:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:warmth:6.Name` | Warmth | Chaleur |

## `TRUDVANG.Content.Power.vitner-flame-craft:sea-of-fire:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-flame-craft:sea-of-fire:7.Name` | Sea of Fire | Mer de flammes |

## `TRUDVANG.Content.Power.vitner-perceiving:find-home:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:find-home:0.Name` | Find Home | Chemin du retour |

## `TRUDVANG.Content.Power.vitner-perceiving:retrace-tracks:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:retrace-tracks:1.Name` | Retrace Tracks | Traces |

## `TRUDVANG.Content.Power.vitner-perceiving:detect-object:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:detect-object:2.Name` | Detect Object | Détection d'objet |

## `TRUDVANG.Content.Power.vitner-perceiving:orientation:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:orientation:3.Name` | Orientation | Orientation |

## `TRUDVANG.Content.Power.vitner-perceiving:detect-being:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:detect-being:4.Name` | Detect Being | Détection des êtres vivants |

## `TRUDVANG.Content.Power.vitner-perceiving:detect-undead:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:detect-undead:5.Name` | Detect Undead | Détection des morts-vivants |

## `TRUDVANG.Content.Power.vitner-perceiving:surrounding:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:surrounding:6.Name` | Surrounding | Environnement |

## `TRUDVANG.Content.Power.vitner-perceiving:map:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-perceiving:map:7.Name` | Map | Cartographie |

## `TRUDVANG.Content.Power.vitner-power-of-thought:understanding-script:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:understanding-script:0.Name` | Understanding Script | Compréhension des écrits |

## `TRUDVANG.Content.Power.vitner-power-of-thought:understanding-speech:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:understanding-speech:1.Name` | Understanding Speech | Compréhension orale |

## `TRUDVANG.Content.Power.vitner-power-of-thought:courage:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:courage:2.Name` | Courage | Courage |

## `TRUDVANG.Content.Power.vitner-power-of-thought:fear:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:fear:3.Name` | Fear | Peur |

## `TRUDVANG.Content.Power.vitner-power-of-thought:telepathy:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:telepathy:4.Name` | Telepathy | Télépathie |

## `TRUDVANG.Content.Power.vitner-power-of-thought:ecstasy:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:ecstasy:5.Name` | Ecstasy | Extase |

## `TRUDVANG.Content.Power.vitner-power-of-thought:imagining:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:imagining:6.Name` | Imagining | Influence |

## `TRUDVANG.Content.Power.vitner-power-of-thought:memory:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:memory:7.Name` | Memory | Mémoire |

## `TRUDVANG.Content.Power.vitner-power-of-thought:creature-control:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:creature-control:8.Name` | Creature Control | Contrôle des créatures |

## `TRUDVANG.Content.Power.vitner-power-of-thought:aura-of-power:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:aura-of-power:9.Name` | Aura of Power | Aura de puissance |

## `TRUDVANG.Content.Power.vitner-power-of-thought:possess-creature:10`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:possess-creature:10.Name` | Possess Creature | Possession de créature |

## `TRUDVANG.Content.Power.vitner-power-of-thought:mind-reading:11`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-thought:mind-reading:11.Name` | Mind Reading | Lecture des pensées |

## `TRUDVANG.Content.Power.vitner-power-of-vision:tracking:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:tracking:0.Name` | Tracking | Pistage |

## `TRUDVANG.Content.Power.vitner-power-of-vision:scanning:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:scanning:1.Name` | Scanning | Examen d'objet |

## `TRUDVANG.Content.Power.vitner-power-of-vision:far-sight:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:far-sight:2.Name` | Far Sight | Vision lointaine |

## `TRUDVANG.Content.Power.vitner-power-of-vision:seeing:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:seeing:3.Name` | Seeing | Vision parfaite |

## `TRUDVANG.Content.Power.vitner-power-of-vision:espionage:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:espionage:4.Name` | Espionage | Espionnage |

## `TRUDVANG.Content.Power.vitner-power-of-vision:astral-voyage:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:astral-voyage:5.Name` | Astral Voyage | Voyage astral |

## `TRUDVANG.Content.Power.vitner-power-of-vision:read-vitner:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:read-vitner:6.Name` | Read Vitner | Lecture du vitner |

## `TRUDVANG.Content.Power.vitner-power-of-vision:true-sight:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-power-of-vision:true-sight:7.Name` | True Sight | Vision véritable |

## `TRUDVANG.Content.Power.vitner-soil-craft:rock-throw:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:rock-throw:0.Name` | Rock Throw | Jet de pierre |

## `TRUDVANG.Content.Power.vitner-soil-craft:shape-soil:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:shape-soil:1.Name` | Shape Soil | Façonnage de la terre |

## `TRUDVANG.Content.Power.vitner-soil-craft:earthquake:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:earthquake:2.Name` | Earthquake | Tremblement de terre |

## `TRUDVANG.Content.Power.vitner-soil-craft:quagmire:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:quagmire:3.Name` | Quagmire | Bourbier |

## `TRUDVANG.Content.Power.vitner-soil-craft:soil-blast:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:soil-blast:4.Name` | Soil Blast | Projection de terre |

## `TRUDVANG.Content.Power.vitner-soil-craft:soil-walk:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:soil-walk:5.Name` | Soil Walk | Marche dans la terre |

## `TRUDVANG.Content.Power.vitner-soil-craft:shape-stone:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:shape-stone:6.Name` | Shape Stone | Façonnage de la pierre |

## `TRUDVANG.Content.Power.vitner-soil-craft:stone-walk:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:stone-walk:7.Name` | Stone Walk | Marche dans la pierre |

## `TRUDVANG.Content.Power.vitner-soil-craft:petrify-remove-petrification:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-soil-craft:petrify-remove-petrification:8.Name` | Petrify/Remove Petrification | Pétrification/Annuler une pétrification |

## `TRUDVANG.Content.Power.vitner-vitner-craft:channeling:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:channeling:0.Name` | Channeling | Canalisation |

## `TRUDVANG.Content.Power.vitner-vitner-craft:vitner-pouch:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:vitner-pouch:1.Name` | Vitner Pouch | Bourse de vitner |

## `TRUDVANG.Content.Power.vitner-vitner-craft:enchant-object:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:enchant-object:2.Name` | Enchant Object | Enchantement d'objet |

## `TRUDVANG.Content.Power.vitner-vitner-craft:anti-magic:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:anti-magic:3.Name` | Anti Magic | Antimagie |

## `TRUDVANG.Content.Power.vitner-vitner-craft:enchant-being:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:enchant-being:4.Name` | Enchant Being | Enchantement de créature |

## `TRUDVANG.Content.Power.vitner-vitner-craft:seal:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:seal:5.Name` | Seal | Sceau |

## `TRUDVANG.Content.Power.vitner-vitner-craft:dispel-vitner:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:dispel-vitner:6.Name` | Dispel Vitner | Dissipation du vitner |

## `TRUDVANG.Content.Power.vitner-vitner-craft:trace-vitner:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:trace-vitner:7.Name` | Trace Vitner | Piste du vitner |

## `TRUDVANG.Content.Power.vitner-vitner-craft:wall-of-vitner:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-craft:wall-of-vitner:8.Name` | Wall of Vitner | Mur de vitner |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:detect-composition:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:detect-composition:0.Name` | Detect Composition | Analyse de la composition |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:waterproof:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:waterproof:1.Name` | Waterproof | Résistance à l'eau |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:bind:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:bind:2.Name` | Bind | Lien |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:rust:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:rust:3.Name` | Rust | Rouille |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:alarm-object:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:alarm-object:4.Name` | Alarm Object | Objet d'alarme |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:unlock-lock:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:unlock-lock:5.Name` | Unlock/Lock | Verrouillage/déverrouillage |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:enlarge-reduce-object:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:enlarge-reduce-object:6.Name` | Enlarge/Reduce Object | Agrandissement/rapetissement d'objet |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:alter-object:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:alter-object:7.Name` | Alter Object | Altération d'objet |

## `TRUDVANG.Content.Power.vitner-vitner-of-objects:create-object:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-vitner-of-objects:create-object:8.Name` | Create Object | Création d'objet |

## `TRUDVANG.Content.Power.vitner-water-craft:find-water:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:find-water:0.Name` | Find Water | Sourcier |

## `TRUDVANG.Content.Power.vitner-water-craft:purify-water:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:purify-water:1.Name` | Purify Water | Purification de l'eau |

## `TRUDVANG.Content.Power.vitner-water-craft:breathe:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:breathe:2.Name` | Breathe | Respiration aquatique |

## `TRUDVANG.Content.Power.vitner-water-craft:form-water:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:form-water:3.Name` | Form Water | Façonnage de l'eau |

## `TRUDVANG.Content.Power.vitner-water-craft:create-water:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:create-water:4.Name` | Create Water | Création d'eau |

## `TRUDVANG.Content.Power.vitner-water-craft:solid-water:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:solid-water:5.Name` | Solid Water | Eau solide |

## `TRUDVANG.Content.Power.vitner-water-craft:control-precipitation:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:control-precipitation:6.Name` | Control Precipitation | Contrôle des précipitations |

## `TRUDVANG.Content.Power.vitner-water-craft:water-walk:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:water-walk:7.Name` | Water Walk | Marche sur l'eau |

## `TRUDVANG.Content.Power.vitner-water-craft:wave-master:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-water-craft:wave-master:8.Name` | Wave Master | Maître des flots |

## `TRUDVANG.Content.Power.vitner-wind-craft:purify-air:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:purify-air:0.Name` | Purify Air | Purification de l'air |

## `TRUDVANG.Content.Power.vitner-wind-craft:wind-gust:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:wind-gust:1.Name` | Wind Gust | Coup de vent |

## `TRUDVANG.Content.Power.vitner-wind-craft:fog:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:fog:2.Name` | Fog | Brouillard |

## `TRUDVANG.Content.Power.vitner-wind-craft:control-wind:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:control-wind:3.Name` | Control Wind | Contrôle du vent |

## `TRUDVANG.Content.Power.vitner-wind-craft:air-armor:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:air-armor:4.Name` | Air Armor | Armure d'air |

## `TRUDVANG.Content.Power.vitner-wind-craft:lift:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:lift:5.Name` | Lift | Vent porteur |

## `TRUDVANG.Content.Power.vitner-wind-craft:air-shield:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:air-shield:6.Name` | Air Shield | Bouclier d'air |

## `TRUDVANG.Content.Power.vitner-wind-craft:wind-blast:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:wind-blast:7.Name` | Wind Blast | Rafale de vent |

## `TRUDVANG.Content.Power.vitner-wind-craft:storm:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:storm:8.Name` | Storm | Tempête |

## `TRUDVANG.Content.Power.vitner-wind-craft:wind-catcher:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-wind-craft:wind-catcher:9.Name` | Wind Catcher | Seigneur des vents |

## `TRUDVANG.Content.Power.vitner-witchcraft:uprooted-tree:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:uprooted-tree:0.Name` | Uprooted Tree | Déracinement |

## `TRUDVANG.Content.Power.vitner-witchcraft:phantom-plague:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:phantom-plague:1.Name` | Phantom Plague | Mal imaginaire |

## `TRUDVANG.Content.Power.vitner-witchcraft:fever:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:fever:2.Name` | Fever | Fièvre |

## `TRUDVANG.Content.Power.vitner-witchcraft:curse-object:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:curse-object:3.Name` | Curse Object | Malédiction d'objet |

## `TRUDVANG.Content.Power.vitner-witchcraft:amnesia:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:amnesia:4.Name` | Amnesia | Amnésie |

## `TRUDVANG.Content.Power.vitner-witchcraft:curse-creature:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:curse-creature:5.Name` | Curse Creature | Malédiction de créature |

## `TRUDVANG.Content.Power.vitner-witchcraft:bad-harvest:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:bad-harvest:6.Name` | Bad Harvest | Mauvaise récolte |

## `TRUDVANG.Content.Power.vitner-witchcraft:tree-curse:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.vitner-witchcraft:tree-curse:7.Name` | Tree Curse | Malédiction de l'arbre |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:death-gust:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:death-gust:0.Name` | Death Gust | Souffle de mort |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:wall-of-dusk:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:wall-of-dusk:1.Name` | Wall of Dusk | Mur du crépuscule |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:falfax:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:falfax:2.Name` | Falfax | Falfax |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:night-curtain:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:night-curtain:3.Name` | Night Curtain | Rideau de la nuit |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4.Name` | The Coat of Jorn | Manteau de Jorn |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:the-breath-of-mogunda:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:the-breath-of-mogunda:5.Name` | The Breath of Mogunda | Souffle de Mogunda |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:asiblack:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:asiblack:6.Name` | Asiblack | Svartasi |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:will-of-bodvildur:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:will-of-bodvildur:7.Name` | Will of Bodvildur | Volonté de Bodvilur |

## `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:snarfari:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-influence-of-jorn:snarfari:8.Name` | Snarfari | Snarfari |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:night-vision:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:night-vision:0.Name` | Night Vision | Vision nocturne |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:willpower:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:willpower:1.Name` | Willpower | Force d'âme |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:bold:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:bold:2.Name` | Bold | Témérité |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:wind-shield:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:wind-shield:3.Name` | Wind Shield | Bouclier de vent |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:soul-sight:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:soul-sight:4.Name` | Soul Sight | Regard de l'âme |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:storm-armor:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:storm-armor:5.Name` | Storm Armor | Armure de la tempête |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:heart-of-enken:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:heart-of-enken:6.Name` | Heart of Enken | Cœur d'Enken |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:hurricane-armor:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:hurricane-armor:7.Name` | Hurricane Armor | Armure de l'ouragan |

## `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:eye-of-enken:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-power-of-enken:eye-of-enken:8.Name` | Eye of Enken | Œil d'Enken |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:troll-strength:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:troll-strength:0.Name` | Troll Strength | Force du troll |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:voice-of-command:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:voice-of-command:1.Name` | Voice of Command | Autorité |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:havar:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:havar:2.Name` | Havar | Havar |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:hinji-strength:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:hinji-strength:3.Name` | Hinji Strength | Force de hinje |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:jarl-s-call:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:jarl-s-call:4.Name` | Jarl's Call | Appel du Jarl |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:shield-disir:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:shield-disir:5.Name` | Shield Dísir | Skölddíser |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:jotun-strength:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:jotun-strength:6.Name` | Jotun Strength | Force du jotun |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:voice-of-stormi:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:voice-of-stormi:7.Name` | Voice of Stormi | Voix de Storme |

## `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:einharjar:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-strength-of-stormi:einharjar:8.Name` | Einharjar | Einharjar |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing:0.Name` | Healing | Guérison |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:sunray:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:sunray:1.Name` | Sunray | Rayons du soleil |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-glow:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-glow:2.Name` | Healing Glow | Lumière guérisseuse |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:summer-place:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:summer-place:3.Name` | Summer Place | Cœur de l'été |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:firon-power:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:firon-power:4.Name` | Firon Power | Pouvoir de Firon |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-warmth:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-warmth:5.Name` | Healing Warmth | Chaleur guérisseuse |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6.Name` | Time of the Hunt | Heure de la chasse |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7.Name` | Breath of Sunvei | Souffle de Solvei |

## `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-sun:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-warmth-of-sunvei:healing-sun:8.Name` | Healing Sun | Soleil guérisseur |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:inspiration:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:inspiration:0.Name` | Inspiration | Inspiration |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:sixth-sense:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:sixth-sense:1.Name` | Sixth Sense | Sixième sens |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:joy-of-creating:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:joy-of-creating:2.Name` | Joy of Creating | Esprit d'acier |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:steel-mind:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:steel-mind:3.Name` | Steel Mind | Joie de la création |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:wave-of-truth:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:wave-of-truth:4.Name` | Wave of Truth | Vague de vérité |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:vitner-protection:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:vitner-protection:5.Name` | Vitner Protection | Protection contre le vitner |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:swine-rush:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:swine-rush:6.Name` | Swine Rush | Ruée du porc |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7.Name` | Gaze of Windinna | Regard de Windinna |

## `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:hearth-of-windinna:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wisdom-of-windinna:hearth-of-windinna:8.Name` | Hearth of Windinna | Âtre de Windinna |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:fire-iron:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:fire-iron:0.Name` | Fire Iron | Tisonnier |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:battle-cry:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:battle-cry:1.Name` | Battle Cry | Cri de bataille |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:wolf-tongue:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:wolf-tongue:2.Name` | Wolf Tongue | Langue du loup |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:pyre-mark:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:pyre-mark:3.Name` | Pyre Mark | Marque du brasier |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:war-cry:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:war-cry:4.Name` | War Cry | Cri de guerre |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:dark-visage:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:dark-visage:5.Name` | Dark Visage | Figure sinistre |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:firestorm:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:firestorm:6.Name` | Firestorm | Tempête de feu |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7.Name` | Thunder of Victory | Tonnerre victorieux |

## `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8.Name` | Tyrd's Bellow | Grondement de Tyrd |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0.Name` | Behind Tree and Pine | Derrière le frêne et le pin |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:animal-speech:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:animal-speech:1.Name` | Animal Speech | Langue animale |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:stagshape:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:stagshape:2.Name` | Stagshape | Aspect du cerf |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:bestial-tongue:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:bestial-tongue:3.Name` | Bestial Tongue | Langage des bêtes |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:salmonshape:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:salmonshape:4.Name` | Salmonshape | Aspect du saumon |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5.Name` | Beneath Root and Rock | Sous la roche et l'écorce |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:dragon-tongue:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:dragon-tongue:6.Name` | Dragon Tongue | Langue des dragons |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:forest-denizen:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:forest-denizen:7.Name` | Forest Denizen | Enfant de la forêt |

## `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:ravenshape:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-gift-of-thanja:ravenshape:8.Name` | Ravenshape | Aspect du corbeau |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0.Name` | Willpower of the Ancestors | Volonté des ancêtres |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:vitner-shield:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:vitner-shield:1.Name` | Vitner Shield | Bouclier contre le vitner |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:bloodfangsbane:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:bloodfangsbane:2.Name` | Bloodfangsbane | Courage des ancêtres |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3.Name` | Boldness of the Ancestors | Fléau de Blotfang |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:bolgemek:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:bolgemek:4.Name` | Bolgemek | Bolgomek |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:witch-wall:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:witch-wall:5.Name` | Witch Wall | Mur contre la sorcellerie |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:fearless:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:fearless:6.Name` | Fearless | Sans peur |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:mistur-barrier:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:mistur-barrier:7.Name` | Mistur Barrier | Barrière des brumes |

## `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:roggdrasil:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-halawen-s-offering:roggdrasil:8.Name` | Roggdrasil | Roggdrasil |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:strong-beer:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:strong-beer:0.Name` | Strong Beer | Bière forte |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:trollslayer:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:trollslayer:1.Name` | Trollslayer | Tueur de trolls |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:giantslayer:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:giantslayer:2.Name` | Giantslayer | Tueur de géants |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-militia:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-militia:3.Name` | King's Militia | Milice du roi |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:hero-s-brew:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:hero-s-brew:4.Name` | Hero's Brew | Bière du héros |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-guard:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-guard:5.Name` | King's Guard | Garde royale |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:dragonslayer:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:dragonslayer:6.Name` | Dragonslayer | Tueur de dragons |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-ale:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-ale:7.Name` | King's Ale | Bière royale |

## `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:the-nine-kings:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:the-nine-kings:8.Name` | The Nine Kings | Les neuf rois |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:journey-wind:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:journey-wind:0.Name` | Journey Wind | Brise du voyage |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:rider-s-melody:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:rider-s-melody:1.Name` | Rider's Melody | Mélodie du cavalier |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-tether:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-tether:2.Name` | Magh's Tether | Entrave de Magh |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:elf-summer:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:elf-summer:3.Name` | Elf Summer | Été elfique |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:hero-s-song:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:hero-s-song:4.Name` | Hero's Song | Chant du héros |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-chain:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-chain:5.Name` | Magh's Chain | Chaîne de Magh |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:king-s-anthem:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:king-s-anthem:6.Name` | King's Anthem | Hymne royal |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-hawser:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:magh-s-hawser:7.Name` | Magh's Hawser | Joug de Magh |

## `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:harvest-year:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-magh-s-gift:harvest-year:8.Name` | Harvest Year | Année de récolte |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:horse-ears:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:horse-ears:0.Name` | Horse Ears | Oreilles de cheval |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:gust-of-release:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:gust-of-release:1.Name` | Gust of Release | Souffle libérateur |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:gloomy-trail:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:gloomy-trail:2.Name` | Gloomy Trail | Ouïe du hibou |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:owl-hearing:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:owl-hearing:3.Name` | Owl Hearing | Piste des brumes |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:freeing-breeze:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:freeing-breeze:4.Name` | Freeing Breeze | Brise libératrice |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:meall-s-trail:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:meall-s-trail:5.Name` | Meall's Trail | Piste de Meall |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:liberating-wind:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:liberating-wind:6.Name` | Liberating Wind | Sens du griffon |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7.Name` | Griffon's Sense | Vent libérateur |

## `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8.Name` | Mongfind's Travel | Voyage de Mongfind |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:simmering-blood:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:simmering-blood:0.Name` | Simmering Blood | Sang brûlant |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:battle-arrow:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:battle-arrow:1.Name` | Battle Arrow | Flèche de bataille |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:boiling-blood:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:boiling-blood:2.Name` | Boiling Blood | Sang bouillant |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:rage:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:rage:3.Name` | Rage | Rage |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:shower-of-arrows:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:shower-of-arrows:4.Name` | Shower of Arrows | Folie |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:madness:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:madness:5.Name` | Madness | Pluie de flèches |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:bloodfire:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:bloodfire:6.Name` | Bloodfire | Embrasement du sang |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:riastarthae:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:riastarthae:7.Name` | Riastarthae | Cieux obscurcis |

## `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:blacken-the-sky:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-ealdtradition-tribute-of-morgu:blacken-the-sky:8.Name` | Blacken the Sky | Riastarthae |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:power-of-blood:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:power-of-blood:0.Name` | Power of Blood | Puissance du sang |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:holy-bolt:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:holy-bolt:1.Name` | Holy Bolt | Éclair sacré |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:stone-senses:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:stone-senses:2.Name` | Stone Senses | Sens pétrifiés |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:visions-of-the-oak:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:visions-of-the-oak:3.Name` | Visions of the Oak | Visions du chêne |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:sacred-burst:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:sacred-burst:4.Name` | Sacred Burst | Explosion sacrée |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:statue:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:statue:5.Name` | Statue | Statue |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:divine-purge:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:divine-purge:6.Name` | Divine Purge | Purification divine |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:memory-of-a-martyr:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:memory-of-a-martyr:7.Name` | Memory of a Martyr | Souvenir du martyr |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:stone-monument:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-anger:stone-monument:8.Name` | Stone Monument | Monument en pierre |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:hand-of-mercy:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:hand-of-mercy:0.Name` | Hand of Mercy | Main de la miséricorde |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:holy-mending:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:holy-mending:1.Name` | Holy Mending | Soins sacrés |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:will-of-bete-wiemdas:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:will-of-bete-wiemdas:2.Name` | Will of Bete Wiemdas | Volonté de Bete Wiemdas |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:life-spirit:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:life-spirit:3.Name` | Life Spirit | Esprit de la vie |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4.Name` | Chalk of Bete Wiemdas | Craie de Bete Wiemdas |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:recall:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:recall:5.Name` | Recall | Rappel |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:breath-of-gave:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:breath-of-gave:6.Name` | Breath of Gave | Main de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:hand-of-gave:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:hand-of-gave:7.Name` | Hand of Gave | Souffle de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:wind-of-immortality:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-grace:wind-of-immortality:8.Name` | Wind of Immortality | Vent d'immortalité |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:blessed-armor:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:blessed-armor:0.Name` | Blessed Armor | Armure bénie |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:blessed-spear:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:blessed-spear:1.Name` | Blessed Spear | Lance bénie |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:holy-authority:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:holy-authority:2.Name` | Holy Authority | Sainte autorité |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3.Name` | Rowthguard Cuirass | Cuirasse des gardiens du Rortan |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:majestic-revelation:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:majestic-revelation:4.Name` | Majestic Revelation | Révélation majestueuse |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5.Name` | Rowthguard's Battle Scourge | Chaîne de bataille des gardiens du Rortan |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:belo-seoth-s-white-armor:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:belo-seoth-s-white-armor:6.Name` | Belo Seoth's White Armor | Armure blanche de Belo Seoth |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7.Name` | Belo Seoth's Axe | Hache de Belo Seoth |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:guise-of-gave:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-knight:guise-of-gave:8.Name` | Guise of Gave | Aura de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:snares-of-the-holy-ground:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:snares-of-the-holy-ground:0.Name` | Snares of the Holy Ground | Entraves de la terre consacrée |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:sheltering:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:sheltering:1.Name` | Sheltering | Refuge |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:storm-protection:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:storm-protection:2.Name` | Storm Protection | Protection contre les éléments |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:thornwall:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:thornwall:3.Name` | Thornwall | Mur d'épines |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:bark-skin:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:bark-skin:4.Name` | Bark Skin | Peau d'écorce |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:demonic-impotence:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:demonic-impotence:5.Name` | Demonic Impotence | Impuissance des démons |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:vitner-resistance:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:vitner-resistance:6.Name` | Vitner Resistance | Résistance au vitner |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:banishment:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:banishment:7.Name` | Banishment | Bannissement |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:tree-port:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-shield:tree-port:8.Name` | Tree Port | Refuge arboricole |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:dawn-shine:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:dawn-shine:0.Name` | Dawn Shine | Lueur de l'aube |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:protective-ground:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:protective-ground:1.Name` | Protective Ground | Sol protecteur |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:augury:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:augury:2.Name` | Augury | Augure |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:thermal-light:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:thermal-light:3.Name` | Thermal Light | Lumière rassurante |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:omen:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:omen:4.Name` | Omen | Présage |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:blessed-home:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:blessed-home:5.Name` | Blessed Home | Foyer béni |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:sacred-grove:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:sacred-grove:6.Name` | Sacred Grove | Bosquet sacré |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:holy-radiance:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:holy-radiance:7.Name` | Holy Radiance | Radiance sacrée |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:portent:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-the-sun:portent:8.Name` | Portent | Oracle |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:holy-consideration:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:holy-consideration:0.Name` | Holy Consideration | Considération sacrée |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1.Name` | Sirowerd's Ear | Oreille de Siro Werte |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:blood-brothers:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:blood-brothers:2.Name` | Blood Brothers | Frères de sang |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3.Name` | Sirowerd's Tongue | Langue de Siro Werte |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:kindred-s-bond:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:kindred-s-bond:4.Name` | Kindred's Bond | Grâce de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:grace-of-gave:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:grace-of-gave:5.Name` | Grace of Gave | Liens fraternels |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sanity-of-gave:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:sanity-of-gave:6.Name` | Sanity of Gave | Sagesse de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:favorites-of-gave:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:favorites-of-gave:7.Name` | Favorites of Gave | Faveurs de Gave |

## `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:divine-pact:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-tenetnid-tablet-of-voices:divine-pact:8.Name` | Divine Pact | Pacte divin |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:resilience:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:resilience:0.Name` | Resilience | Résilience |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mind-of-the-predator:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mind-of-the-predator:1.Name` | Mind of the Predator | Instinct du prédateur |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomant-s-tusks:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomant-s-tusks:2.Name` | Mastomant's Tusks | Défenses du mastomant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:endurance-of-the-boar:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:endurance-of-the-boar:3.Name` | Endurance of the Boar | Endurance du sanglier |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomant-s-fur:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomant-s-fur:4.Name` | Mastomant's Fur | Fourrure du mastomant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:wolf-claws:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:wolf-claws:5.Name` | Wolf Claws | Griffes du loup |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:endurance-of-the-giant:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:endurance-of-the-giant:6.Name` | Endurance of the Giant | Endurance du géant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:master-of-wolfkin:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:master-of-wolfkin:7.Name` | Master of Wolfkin | Maître des loups |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomantshape:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-beast:mastomantshape:8.Name` | Mastomantshape | Aspect du mastomant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:constriction:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:constriction:0.Name` | Constriction | Constriction |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1.Name` | Rampage of the Huvfurwurm | Ravage du huvfurwurm |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:flame-hardened:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:flame-hardened:2.Name` | Flame Hardened | Fils des flammes |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:paralyzing-gaze:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:paralyzing-gaze:3.Name` | Paralyzing Gaze | Regard paralysant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:dragon-skin:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:dragon-skin:4.Name` | Dragon Skin | Attaque du huvfurwurm |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5.Name` | Attack of the Huvfurwurm | Peau du dragon |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6.Name` | Head of the Huvfurwurm | Tête du huvfurwurm |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:dragon-soul:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:dragon-soul:7.Name` | Dragon Soul | Âme du dragon |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:giant-snakeshape:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-dragon:giant-snakeshape:8.Name` | Giant Snakeshape | Aspect du serpent géant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:sight-of-the-dwarves:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:sight-of-the-dwarves:0.Name` | Sight of the Dwarves | Vision des nains |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:accomplished:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:accomplished:1.Name` | Accomplished | Accompli |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:curative-draught:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:curative-draught:2.Name` | Curative Draught | Mixture curative |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:mastery:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:mastery:3.Name` | Mastery | Maître |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:remedial-potion:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:remedial-potion:4.Name` | Remedial Potion | Potion de guérison |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:weapon-prowess:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:weapon-prowess:5.Name` | Weapon Prowess | Prouesse martiale |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:dwarven-smith:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:dwarven-smith:6.Name` | Dwarven Smith | Forgeron nain |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:legendary:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:legendary:7.Name` | Legendary | Légendaire |

## `TRUDVANG.Content.Power.holy-haminges-power-of-men:life-elixir-of-the-devouress:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-men:life-elixir-of-the-devouress:8.Name` | Life Elixir of the Devouress | Élixir de vie de la dévoreuse |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:dreadful-screech:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:dreadful-screech:0.Name` | Dreadful Screech | Cri effrayant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:shattered-mind:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:shattered-mind:1.Name` | Shattered Mind | Esprit brisé |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:terrifying-howl:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:terrifying-howl:2.Name` | Terrifying Howl | Hurlement terrifiant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:regenerative-blood:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:regenerative-blood:3.Name` | Regenerative Blood | Sang régénérant |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4.Name` | Blood of the Lindwurm | Sang du lindwurm |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:limb-of-stone:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:limb-of-stone:5.Name` | Limb of Stone | Membre de pierre |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:scream-of-the-devouress:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:scream-of-the-devouress:6.Name` | Scream of the Devouress | Clameur de la dévoreuse |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:petrify:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:petrify:7.Name` | Petrify | Pétrification |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8.Name` | Heart of the Lindwurm | Cœur du lindwurm |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0.Name` | Skin of the Hrim Troll | Peau du hrimtroll |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:troll-strength:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:troll-strength:1.Name` | Troll Strength | Force du troll |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2.Name` | Mountain Ogre's Fury | Fureur de l'ogre des montagnes |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3.Name` | Strength of the Stone Hinji | Force du stenhinje |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4.Name` | Mountain Ogre's Madness | Folie de l'ogre des montagnes |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5.Name` | Breath of the Hrim Troll | Souffle du hrimtroll |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6.Name` | The Destroyer's Rage | Rage du destructeur |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:thurse-strength:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:thurse-strength:7.Name` | Thurse Strength | Force du tursir |

## `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:the-hrim-troll-s-rime-body:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-the-thurses:the-hrim-troll-s-rime-body:8.Name` | The Hrim Troll's Rime Body | Corps de glace du hrimtroll |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:disease-carrier:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:disease-carrier:0.Name` | Disease Carrier | Infection |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:willpower:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:willpower:1.Name` | Willpower | Volonté |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:illusion-tricks:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:illusion-tricks:2.Name` | Illusion Tricks | Tours illusoires |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:fearless:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:fearless:3.Name` | Fearless | Sans peur |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:contagious:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:contagious:4.Name` | Contagious | Contagion |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:persuade:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:persuade:5.Name` | Persuade | Persuasion |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:lord-of-the-flies:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:lord-of-the-flies:6.Name` | Lord of the Flies | Seigneur des mouches |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:troll-wit:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:troll-wit:7.Name` | Troll Wit | Hardiesse des trolls |

## `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:taken-by-the-mountain:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-haminges-power-of-trolls:taken-by-the-mountain:8.Name` | Taken by the Mountain | Charme de la montagne |

## `TRUDVANG.Content.Power.holy-thuuldom-anvil-shock:anvil-shock:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-anvil-shock:anvil-shock:0.Name` | Anvil Shock | Choc de l'enclume |

## `TRUDVANG.Content.Power.holy-thuuldom-borjorn-s-hand:borjorn-s-hand:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-borjorn-s-hand:borjorn-s-hand:0.Name` | Borjorn's Hand | Main de Borjorn |

## `TRUDVANG.Content.Power.holy-thuuldom-cave-spider-s-grip:cave-spider-s-grip:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-cave-spider-s-grip:cave-spider-s-grip:0.Name` | Cave Spider's Grip | Prise de l'araignée des cavernes |

## `TRUDVANG.Content.Power.holy-thuuldom-earthquake:earthquake:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-earthquake:earthquake:0.Name` | Earthquake | Tremblement de terre |

## `TRUDVANG.Content.Power.holy-thuuldom-fang-of-yukk:fang-of-yukk:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-fang-of-yukk:fang-of-yukk:0.Name` | Fang of Yukk | Croc de Yukk |

## `TRUDVANG.Content.Power.holy-thuuldom-gills-of-the-blackfish:gills-of-the-blackfish:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-gills-of-the-blackfish:gills-of-the-blackfish:0.Name` | Gills of the Blackfish | Branchies du brochet |

## `TRUDVANG.Content.Power.holy-thuuldom-hammer-fists:hammer-fists:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-hammer-fists:hammer-fists:0.Name` | Hammer Fists | Poings d'acier |

## `TRUDVANG.Content.Power.holy-thuuldom-healing-rune:healing-rune:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-healing-rune:healing-rune:0.Name` | Healing Rune | Rune de guérison |

## `TRUDVANG.Content.Power.holy-thuuldom-heat-of-the-depths:heat-of-the-depths:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-heat-of-the-depths:heat-of-the-depths:0.Name` | Heat of the Depths | Chaleur des profondeurs |

## `TRUDVANG.Content.Power.holy-thuuldom-labyrinth-blood:labyrinth-blood:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-labyrinth-blood:labyrinth-blood:0.Name` | Labyrinth Blood | Sang du labyrinthe |

## `TRUDVANG.Content.Power.holy-thuuldom-mark-of-brokk:mark-of-brokk:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-mark-of-brokk:mark-of-brokk:0.Name` | Mark of Brokk | Marque de Brokk |

## `TRUDVANG.Content.Power.holy-thuuldom-power-of-repair:power-of-repair:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-power-of-repair:power-of-repair:0.Name` | Power of Repair | Pouvoir de réparation |

## `TRUDVANG.Content.Power.holy-thuuldom-scales:scales:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-scales:scales:0.Name` | Scales | Écailles |

## `TRUDVANG.Content.Power.holy-thuuldom-stoneling:stoneling:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-stoneling:stoneling:0.Name` | Stoneling | Enfant de la pierre |

## `TRUDVANG.Content.Power.holy-thuuldom-stone-to-clay:stone-to-clay:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-stone-to-clay:stone-to-clay:0.Name` | Stone to Clay | Transformation de pierre en argile |

## `TRUDVANG.Content.Power.holy-thuuldom-stoneshape:stoneshape:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-stoneshape:stoneshape:0.Name` | Stoneshape | Aspect de la pierre |

## `TRUDVANG.Content.Power.holy-thuuldom-well-of-water:well-of-water:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-thuuldom-well-of-water:well-of-water:0.Name` | Well of Water | Source d'eau |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-friend:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-friend:0.Name` | Animal Friend | Ami des animaux |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-tracks:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-tracks:1.Name` | Animal Tracks | Traces animales |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:talk-to-animals:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:talk-to-animals:2.Name` | Talk to Animals | Invisibilité aux animaux |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:invisible-to-animals:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:invisible-to-animals:3.Name` | Invisible to Animals | Parler avec les animaux |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-spirit:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-spirit:4.Name` | Animal Spirit | Esprit de la bête |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-master:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-master:5.Name` | Animal Master | Maître des animaux |

## `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-shape:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-animal-mind:animal-shape:6.Name` | Animal Shape | Aspect animal |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:orientation:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:orientation:0.Name` | Orientation | Orientation |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:tree-walk:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:tree-walk:1.Name` | Tree Walk | Chemin forestier |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:hearing:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:hearing:2.Name` | Hearing | Ouïe fine |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:feline-leap:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:feline-leap:3.Name` | Feline Leap | Bond du félin |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:feline-reflexes:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:feline-reflexes:4.Name` | Feline Reflexes | Réflexes de félin |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:aim:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:aim:5.Name` | Aim | Visée |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:track:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:track:6.Name` | Track | Pistage |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:concealment:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:concealment:7.Name` | Concealment | Camouflage |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:forest-path:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:forest-path:8.Name` | Forest Path | Sentier forestier |

## `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:pathfinder:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-lynx-power:pathfinder:9.Name` | Pathfinder | Éclaireur |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:earth-wall:0`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:earth-wall:0.Name` | Earth Wall | Mur de terre |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:control-fire:1`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:control-fire:1.Name` | Control Fire | Contrôle du feu |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:purify-water:2`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:purify-water:2.Name` | Purify Water | Purification de l'eau |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:gift-of-water:3`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:gift-of-water:3.Name` | Gift of Water | Don de l'eau |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:fire-tamer:4`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:fire-tamer:4.Name` | Fire Tamer | Dompteur du feu |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:shape-earth:5`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:shape-earth:5.Name` | Shape Earth | Façonnage de la terre |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:elemental-arrow:6`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:elemental-arrow:6.Name` | Elemental Arrow | Flèche élémentaire |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:earthquake:7`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:earthquake:7.Name` | Earthquake | Tremblement de terre |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:spring-of-water:8`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:spring-of-water:8.Name` | Spring of Water | Source d'eau |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:control-wind:9`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:control-wind:9.Name` | Control Wind | Contrôle des vents |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:hot-and-cold:10`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:hot-and-cold:10.Name` | Hot and Cold | Chaud et froid |

## `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:fire-resistant:11`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Power.holy-toikalokke-master-of-elements:fire-resistant:11.Name` | Fire Resistant | Résistance au feu |

## `TRUDVANG.Content.Theme`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Theme.vitner-animal-vitner` | Magic for communicating with, summoning, controlling, possessing, and carrying messages through animals. | Magie de communication avec les animaux, d'invocation, de contrôle, de possession et de transport de messages. |
| `TRUDVANG.Content.Theme.vitner-body-vitner` | Magic that alters bodies and senses, restrains creatures, and enhances speed, strength, or resilience. | Magie modifiant les corps et les sens, retenant les créatures et renforçant la vitesse, la force ou la résilience. |
| `TRUDVANG.Content.Theme.vitner-delusion-vitner` | Illusions that manipulate sound, appearance, concealment, landscapes, silence, and invisibility. | Illusions manipulant sons, apparence, dissimulation, paysages, silence et invisibilité. |
| `TRUDVANG.Content.Theme.vitner-dimvitner` | Death magic that speaks with, summons, controls, dismisses, or drains the undead and the powers of Dimhall. | Magie de la mort permettant de parler aux morts-vivants, de les invoquer, les contrôler, les renvoyer ou drainer les pouvoirs de Dimhall. |
| `TRUDVANG.Content.Theme.vitner-flame-craft` | Fire magic that creates heat and flame, protects against fire, and controls conflagrations. | Magie du feu créant chaleur et flammes, protégeant du feu et contrôlant les incendies. |
| `TRUDVANG.Content.Theme.vitner-perceiving` | Divinations for finding places, beings, objects, undead, routes, and the surrounding terrain. | Divinations pour trouver lieux, êtres, objets, morts-vivants, routes et terrain environnant. |
| `TRUDVANG.Content.Theme.vitner-power-of-thought` | Mental magic affecting language, courage, fear, memory, telepathy, control, possession, and thought reading. | Magie mentale affectant le langage, le courage, la peur, la mémoire, la télépathie, le contrôle, la possession et la lecture des pensées. |
| `TRUDVANG.Content.Theme.vitner-power-of-vision` | Sight magic for tracking, remote observation, astral travel, reading vitner, and seeing truth. | Magie de la vue pour le pistage, l'observation à distance, le voyage astral, la lecture du vitner et la vision de la vérité. |
| `TRUDVANG.Content.Theme.vitner-soil-craft` | Earth magic that moves or shapes soil and stone, creates tremors and quagmires, and petrifies creatures. | Magie de la terre déplaçant ou modelant sol et pierre, créant tremblements et bourbiers, pétrifiant les créatures. |
| `TRUDVANG.Content.Theme.vitner-vitner-craft` | Metamagic for channeling, enchanting, sealing, tracing, dispelling, and blocking vitner. | Métamagie de canalisation, enchantement, scellement, traçage, dissipation et blocage du vitner. |
| `TRUDVANG.Content.Theme.vitner-vitner-of-objects` | Magic that identifies, protects, binds, alters, creates, locks, or destroys objects. | Magie identifiant, protégeant, liant, altérant, créant, verrouillant ou détruisant des objets. |
| `TRUDVANG.Content.Theme.vitner-water-craft` | Water magic for finding, purifying, creating, shaping, solidifying, and walking upon water or waves. | Magie de l'eau pour trouver, purifier, créer, façonner, solidifier et marcher sur l'eau ou les vagues. |
| `TRUDVANG.Content.Theme.vitner-wind-craft` | Air magic that purifies air, creates fog and wind, grants lift or protection, and summons storms. | Magie de l'air purifiant l'air, créant brume et vent, accordant portance ou protection, invoquant les tempêtes. |
| `TRUDVANG.Content.Theme.vitner-witchcraft` | Curses and maladies that bring fever, amnesia, plague, blighted harvests, and hostile trees. | Malédictions et maladies apportant fièvre, amnésie, peste, mauvaises récoltes et arbres hostiles. |
| `TRUDVANG.Content.Theme.holy-gerbanis-influence-of-jorn` | Powers of darkness, deathly winds, storm-born steeds, protection, and Jorn's supernatural influence. | Pouvoirs de ténèbres, vents mortels, destriers nés de la tempête, protection et influence surnaturelle de Jorn. |
| `TRUDVANG.Content.Theme.holy-gerbanis-power-of-enken` | Powers granting courage, will, soul sight, night vision, and increasingly mighty storm armor. | Pouvoirs accordant courage, volonté, vision de l'âme, vision nocturne et armures de tempête de plus en plus puissantes. |
| `TRUDVANG.Content.Theme.holy-gerbanis-strength-of-stormi` | Battle blessings that grant giant strength, commanding voices, divine guards, and heroic warriors. | Bénédictions de combat accordant force géante, voix commandement, gardes divins et guerriers héroïques. |
| `TRUDVANG.Content.Theme.holy-gerbanis-warmth-of-sunvei` | Solar powers of healing, warmth, light, summer, hunting, and restoration. | Pouvoirs solaires de guérison, de chaleur, de lumière, d'été, de chasse et de restauration. |
| `TRUDVANG.Content.Theme.holy-gerbanis-wisdom-of-windinna` | Powers of inspiration, truth, creativity, mental resolve, protection, and Windinna's insight. | Pouvoirs d'inspiration, de vérité, de créativité, de résolution mentale, de protection et de clairvoyance de Windinna. |
| `TRUDVANG.Content.Theme.holy-gerbanis-wrath-of-tyrd` | War powers of fiery weapons, terrifying cries, battle fury, firestorms, and victory. | Pouvoirs de guerre aux armes enflammées, cris terrifiants, fureur belliqueuse, tempêtes de feu et victoire. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-gift-of-thanja` | Nature powers for animal speech and shapes, concealment in the wild, and communion with forest beings. | Pouvoirs de nature pour parler aux animaux et prendre leur forme, se dissimiler dans les terres sauvages et communier avec les êtres de la forêt. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-halawen-s-offering` | Ancestral protections against fear, bloodfangs, hostile vitner, and supernatural assault. | Protections ancestrales contre la peur, les Blotfangs, le vitner hostile et les assauts surnaturels. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-heritage-of-majne` | Heroic draughts and royal blessings for slaying trolls, giants, and dragons and rallying warriors. | Breuvages héroïques et bénédictions royales pour abattre trolls, géants et dragons et rallier les guerriers. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-magh-s-gift` | Songs and bonds that aid travel, riders, harvests, heroes, and the changing seasons. | Chants et liens aidant voyages, cavaliers, récoltes, héros et le changement des saisons. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-nema-s-usefulness` | Powers that sharpen animal senses, reveal trails, remove restraints, and hasten journeys. | Pouvoirs aiguisant les sens animaliers, révélant les pistes, levant les entraves et accélérant les voyages. |
| `TRUDVANG.Content.Theme.holy-ealdtradition-tribute-of-morgu` | Blood-fueled battle powers that provoke rage and unleash volleys, fire, and murderous fury. | Pouvoirs de combat nourris par le sang, provoquant la rage et déchaînant volées, feu et fureur meurtrière. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-anger` | Sacred powers of blood, stone, martyrdom, destructive bolts, bursts, and divine purging. | Pouvoirs sacrés de sang, de pierre, de martyre, d'éclairs destructeurs, d'explosions et de purge divine. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-grace` | Merciful powers that heal, restore life and memory, recall allies, and preserve them from death. | Pouvoirs miséricordieux qui soignent, rendent la vie et la mémoire, rappellent les alliés et les préservent de la mort. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-the-knight` | Knightly blessings that empower armor, spears, authority, sacred weapons, and holy battle forms. | Bénédictions chevaleresques renforçant armure, lance, autorité, armes sacrées et formes de combat saintes. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-the-shield` | Protective powers that create sanctuaries, barriers, resistance, banishment, and safe passage. | Pouvoirs protecteurs créant sanctuaires, barrières, résistances, bannissements et passages sûrs. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-the-sun` | Solar signs and sacred radiance that protect homes and groves, reveal omens, and illuminate darkness. | Signes solaires et radiance sacrée protégeant foyers et bosquets, révélant les présages et illuminant les ténèbres. |
| `TRUDVANG.Content.Theme.holy-tenetnid-tablet-of-voices` | Powers of speech, hearing, fellowship, sanity, divine favor, and binding sacred pacts. | Pouvoirs de parole, d'ouïe, de communion, de lucidité, de faveur divine et de pactes sacrés contraignants. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-the-beast` | Bestial powers granting predator instincts, tusks, claws, fur, endurance, and animal transformation. | Pouvoirs bestiaux accordant instinct de prédateur, défenses, griffes, fourrure, endurance et transformation animale. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-the-dragon` | Draconic powers granting constriction, flame resistance, paralyzing sight, scales, and serpent forms. | Pouvoirs draconiques accordant constriction, résistance au feu, regard paralysant, écailles et formes serpentesques. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-men` | Mortal and dwarven arts of mastery, weapon skill, healing draughts, smithing, and legendary achievement. | Arts mortels et nains de maîtrise, d'adresse aux armes, de breuvages curatifs, de forge et d'exploits légendaires. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-the-scale` | Lindwurm powers of terror, regeneration, stone limbs, petrification, and monstrous resilience. | Pouvoirs de lindwurm de terreur, régénération, membres de pierre, pétrification et résilience monstrueuse. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-the-thurses` | Troll and thurse powers granting icy hides, immense strength, breath weapons, and destructive rage. | Pouvoirs de trolls et de tursirs accordant peaux de glace, force immense, souffles destructeurs et rage dévastatrice. |
| `TRUDVANG.Content.Theme.holy-haminges-power-of-trolls` | Troll powers of disease, illusion, persuasion, fearlessness, cunning, and mountain enchantment. | Pouvoirs des trolls de maladie, illusion, persuasion, intrépidité, ruse et enchantement de la montagne. |
| `TRUDVANG.Content.Theme.holy-toikalokke-animal-mind` | Powers for befriending, tracking, speaking with, mastering, and assuming the forms of animals. | Pouvoirs pour se lier d'amitié avec les animaux, les pister, leur parler, les maîtriser et prendre leur forme. |
| `TRUDVANG.Content.Theme.holy-toikalokke-lynx-power` | Feline gifts of hearing, leaping, reflexes, aim, tracking, concealment, and pathfinding. | Dons félins d'ouïe, de bond, de réflexes, de visée, de pistage, de camouflage et de repérage des sentiers. |
| `TRUDVANG.Content.Theme.holy-toikalokke-master-of-elements` | Elemental powers controlling earth, fire, water, wind, temperature, and elemental projectiles. | Pouvoirs élémentaires contrôlant terre, feu, eau, vent, température et projectiles élémentaires. |

## `TRUDVANG.Content`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.ThuulRunePrefix` | A sacred Thuul rune that {summary} | Une rune thuul sacrée qui {summary} |
