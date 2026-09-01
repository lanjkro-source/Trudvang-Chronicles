# Glossaire bilingue anglais–français

Ce glossaire constitue la référence terminologique pour les traductions du système Trudvang. Il est régénéré à partir de `lang/en.json` et `lang/fr.json`, y compris la section `TRUDVANG.Content` (bibliothèque de démarrage et catalogue de tablettes), désormais traduite. Les résumés longs des pouvoirs (`*.Summary`) sont exclus : ce sont des citations de règles, pas des termes de vocabulaire.

La terminologie française s'appuie sur l'édition officielle Black Book Éditions (« Livre des règles », miroir texte dans `game doc/markdown-fr/`). Avant d'ajouter ou de modifier une entrée dans les fichiers de langue, rechercher ici les termes apparentés et conserver les choix terminologiques existants. Toute nouvelle terminologie validée doit être répercutée dans ce document.

## `EFFECT.TABS`

| Clé | English | Français |
|---|---|---|
| `EFFECT.TABS.Details` | Details | Détails |
| `EFFECT.TABS.Duration` | Duration | Durée |
| `EFFECT.TABS.Changes` | Changes | Modifications |

## `EFFECT`

| Clé | English | Français |
|---|---|---|
| `EFFECT.IconTintColor` | Icon Tint Color | Teinte de l'icône |
| `EFFECT.TintColor` | Icon Tint Color | Teinte de l'icône |
| `EFFECT.Description` | Effect Description | Description de l'effet |
| `EFFECT.Suspended` | Effect Suspended | Effet suspendu |
| `EFFECT.Origin` | Effect Origin | Origine de l'effet |
| `EFFECT.StatusConditions` | Status Conditions | États |
| `EFFECT.Submit` | Submit Changes | Valider les modifications |
| `EFFECT.SubmitChanges` | Submit Changes | Valider les modifications |

## `EFFECT.DURATION.UNITS`

| Clé | English | Français |
|---|---|---|
| `EFFECT.DURATION.UNITS.rounds` | rounds | tours de jeu |
| `EFFECT.DURATION.UNITS.turns` | turns | tours |
| `EFFECT.DURATION.UNITS.seconds` | seconds | secondes |
| `EFFECT.DURATION.UNITS.minutes` | minutes | minutes |
| `EFFECT.DURATION.UNITS.hours` | hours | heures |
| `EFFECT.DURATION.UNITS.days` | days | jours |
| `EFFECT.DURATION.UNITS.weeks` | weeks | semaines |
| `EFFECT.DURATION.UNITS.months` | months | mois |
| `EFFECT.DURATION.UNITS.years` | years | années |

## `TYPES.ActiveEffect`

| Clé | English | Français |
|---|---|---|
| `TYPES.ActiveEffect.effect` | Trudvang Effect | Effet de Trudvang |

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
| `TRUDVANG.Sheets.Effect` | Trudvang Effect Sheet | Feuille d'effet de Trudvang |

## `TRUDVANG.Settings`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Settings.StarterContentName` | Starter content version | Version du contenu de démarrage |
| `TRUDVANG.Settings.StarterContentHint` | Tracks the installed Trudvang starter library. | Suit la version installée de la bibliothèque de démarrage Trudvang. |
| `TRUDVANG.Settings.ReimportName` | Reinstall starter content | Réinstaller le contenu de démarrage |
| `TRUDVANG.Settings.ReimportHint` | Runs the starter library import again in the current display language: names, descriptions, and images of previously installed items, tables, and NPCs are refreshed instead of duplicated. | Relance l'import de la bibliothèque de démarrage dans la langue d'affichage actuelle : les noms, descriptions et images des items, tables et PNJ déjà installés sont mis à jour au lieu d'être dupliqués. |
| `TRUDVANG.Settings.ReimportTitle` | Reinstall starter content | Réinstaller le contenu de démarrage |
| `TRUDVANG.Settings.ReimportConfirm` | Reinstall | Réinstaller |
| `TRUDVANG.Settings.RebuildPacksName` | Rebuild the Skills compendiums | Reconstruire les compendiums de Compétences |
| `TRUDVANG.Settings.RebuildPacksHint` | Wipes and rebuilds the two Skills compendium packs from the system data, repairing any corrupted compendium content. Items already imported into this world are not touched. | Vide puis reconstruit les deux compendiums de Compétences à partir des données du système, réparant tout contenu de compendium corrompu. Les éléments déjà importés dans ce monde ne sont pas touchés. |
| `TRUDVANG.Settings.RebuildPacksTitle` | Rebuild the Skills compendiums | Reconstruire les compendiums de Compétences |
| `TRUDVANG.Settings.RebuildPacksConfirm` | Rebuild | Reconstruire |
| `TRUDVANG.Settings.PaletteName` | Color palette | Palette de couleurs |
| `TRUDVANG.Settings.PaletteHint` | Selects the color palette applied to the Trudvang theme. | Choisit la palette de couleurs appliquée au thème Trudvang. |
| `TRUDVANG.Settings.PaletteDefault` | Default | Défaut |
| `TRUDVANG.Settings.PaletteSpring` | Spring | Printemps |
| `TRUDVANG.Settings.PaletteSummer` | Summer | Été |
| `TRUDVANG.Settings.PaletteAutumn` | Autumn | Automne |
| `TRUDVANG.Settings.PaletteWinter` | Winter | Hiver |

## `TRUDVANG.Tab`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Tab.Summary` | Summary | Résumé |
| `TRUDVANG.Tab.Combat` | Combat | Combat |
| `TRUDVANG.Tab.Skills` | Skills | Compétences |
| `TRUDVANG.Tab.Equipment` | Equipment | Équipement |
| `TRUDVANG.Tab.Magic` | Magic & Faith | Magie & Foi |
| `TRUDVANG.Tab.Effects` | Effects | Effets |
| `TRUDVANG.Tab.Notes` | Notes | Notes |
| `TRUDVANG.Tab.Actions` | Actions | Actions |
| `TRUDVANG.Tab.Details` | Details | Détails |
| `TRUDVANG.Tab.Modifiers` | Modifiers | Modificateurs |

## `TRUDVANG.Section`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Section.Traits` | Character Traits | Traits de personnage |
| `TRUDVANG.Section.Status` | Status | État |
| `TRUDVANG.Section.Experience` | Creation & Experience | Création & Expérience |
| `TRUDVANG.Section.QuickActions` | Quick Actions | Actions Rapides |
| `TRUDVANG.Section.CombatActions` | Attacks, parries & readied weapons | Attaques, parades & armes préparées |
| `TRUDVANG.Section.UnarmedCombat` | Unarmed combat & wrestling | Combat à mains nues & lutte |
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
| `TRUDVANG.Section.Effects` | Active Effects | Effets actifs |

## `TRUDVANG.Action`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Action.Roll` | Roll | Jet de dé |
| `TRUDVANG.Action.Cancel` | Cancel | Annuler |
| `TRUDVANG.Action.Use` | Use | Utiliser |
| `TRUDVANG.Action.Attack` | Attack | Attaquer |
| `TRUDVANG.Action.Equip` | Equip | Équiper |
| `TRUDVANG.Action.Damage` | Damage | Dégâts |
| `TRUDVANG.Action.Parry` | Parry | Parer |
| `TRUDVANG.Action.RollDamage` | Roll Damage | Jet de Dégâts |
| `TRUDVANG.Action.RollInitiative` | Roll Initiative | Jet d'initiative |
| `TRUDVANG.Action.ResetCombat` | Reset Combat Points | Réinitialiser les points de combat |
| `TRUDVANG.Action.SpendCombat` | Spend CP | Dépenser des PC |
| `TRUDVANG.Action.Draw` | Draw (10 CP) | Dégainer (10 PC) |
| `TRUDVANG.Action.DoNothingElse` | Do nothing else | Ne rien faire d’autre |
| `TRUDVANG.Action.Sheathe` | Sheathe (free) | Rengainer (gratuit) |
| `TRUDVANG.Action.Continue` | Continue | Continuer |
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
| `TRUDVANG.Action.AddEffect` | Add effect | Ajouter un effet |
| `TRUDVANG.Action.ToggleEffect` | Enable or disable effect | Activer ou désactiver l'effet |
| `TRUDVANG.Action.ApplyEffects` | Apply effects to selected targets | Appliquer les effets aux cibles sélectionnées |

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
| `TRUDVANG.Field.WeaponType` | Type | Type |
| `TRUDVANG.Field.Damage` | Damages | Dégâts |
| `TRUDVANG.Field.OpenRoll` | Open Roll Threshold (0 = none) | Seuil de jet ouvert (0 = aucun) |
| `TRUDVANG.Field.WeaponActions` | WA: WEAPON ACTIONS | AA : ACTIONS D'ARME |
| `TRUDVANG.Field.InitiativeModifier` | IM: INITIATIVE MODIFIER | MI : MOD. INITIATIVE |
| `TRUDVANG.Field.VitnerType` | Vitner Type | Type d'enchanteur |
| `TRUDVANG.Field.PerfectSuccess` | Perfect Success on | Réussite parfaite sur |
| `TRUDVANG.Field.NoPerfectSuccess` | No perfect success | Aucune réussite parfaite |
| `TRUDVANG.Field.FatalDie` | Fatal Effect Die | Dé de magie funeste |
| `TRUDVANG.Field.Protection` | Protection Value | Valeur de protection (VP) |
| `TRUDVANG.Field.Breach` | Breach Value / Maximum | Valeur d'intégrité (VI) / Maximum |
| `TRUDVANG.Field.Equipped` | Equipped | Équipé |
| `TRUDVANG.Field.Heft` | Heft | Encombrement |
| `TRUDVANG.Field.MovementModifier` | MM: MOVEMENT MODIFIER | MM : MOD. MOUVEMENT |
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
| `TRUDVANG.Field.PassiveProtection` | PP: PASSIVE PROTECTION | PP : PROTECTION PASSIVE |
| `TRUDVANG.Field.BreachCurrent` | Breach Value (current) | Valeur d'intégrité (actuelle) |
| `TRUDVANG.Field.BreachMax` | Breach Value (max) | Valeur d'intégrité (maximale) |
| `TRUDVANG.Field.OpenRollShort` | O | JO |
| `TRUDVANG.Field.VpProtectionLabel` | PV: PROTECTION | VP: PROTECTION |
| `TRUDVANG.Field.VpIntegrityLabel` | BV: INTEGRITY | VI: INTÉGRITÉ |
| `TRUDVANG.Field.BonusCpLabel` | CP BONUS | BONUS CP |
| `TRUDVANG.Field.RangeShort` | Short range | Portée courte |
| `TRUDVANG.Field.RangeLong` | Long range | Portée longue |
| `TRUDVANG.Field.CoinCopper` | Copper | Cuivre |
| `TRUDVANG.Field.CoinSilver` | Silver | Argent |
| `TRUDVANG.Field.CoinGold` | Gold | Or |
| `TRUDVANG.Field.TotalWeight` | Total carried weight | Poids total transporté |
| `TRUDVANG.Field.CombatSpecialty` | Linked combat specialty | Spécialité de combat liée |
| `TRUDVANG.Field.Hand` | Used hand | Main utilisée |
| `TRUDVANG.Field.CombatActionModifier` | Combat action modifier | Modificateur d’action de combat |
| `TRUDVANG.Field.NaturalArmor` | Natural armor | Armure naturelle |

## `TRUDVANG.Resource`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Resource.Body` | Body Points | Points de santé (PS) |
| `TRUDVANG.Resource.Combat` | Combat Points | Points de combat (CP) |
| `TRUDVANG.Resource.CombatPools` | Combat Point pools | Réserves de points de combat |
| `TRUDVANG.Resource.Raud` | Raud | Raud |
| `TRUDVANG.Resource.Fear` | Fear | Peur |
| `TRUDVANG.Resource.Vitner` | Vitner Points | Points de vitner |
| `TRUDVANG.Resource.Divinity` | Divinity Points | Points de divinité |
| `TRUDVANG.Resource.Initiative` | Initiative | Initiative |
| `TRUDVANG.Resource.Movement` | Movement | Mouvement |
| `TRUDVANG.Resource.Protection` | Protection | Protection |
| `TRUDVANG.Resource.DamageLevel` | Damage Level | Niveau de dégâts |
| `TRUDVANG.Resource.FearPenalty` | Fear Penalty | Pénalité de peur |
| `TRUDVANG.Resource.ArmorVCPenalty` | Armor Encumbrance (VC) | Encombrement armure (VC) |
| `TRUDVANG.Resource.PersistenceInWild` | Persistence in the Wild | Persistance dans la nature |
| `TRUDVANG.Resource.VitnerCost` | Vitner Point Cost | Coût en points de vitner |
| `TRUDVANG.Resource.DivinityCost` | Divinity Point Cost | Coût en points de divinité |

## `TRUDVANG.Inspection`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Inspection.Object` | Item | Objet |
| `TRUDVANG.Inspection.ForWearer` | For {wearer} | Pour {wearer} |
| `TRUDVANG.Inspection.EffectiveValues` | Effective values | Valeurs effectives |
| `TRUDVANG.Inspection.WearerImpacts` | Effects on the wearer | Effets sur le porteur |
| `TRUDVANG.Inspection.NoWearerImpact` | No direct effect on the wearer. | Aucun effet direct sur le porteur. |
| `TRUDVANG.Inspection.Inspect` | Inspect calculation | Inspecter le calcul |
| `TRUDVANG.Inspection.ClickForDetails` | Click to see the complete calculation | Cliquer pour voir le calcul complet |
| `TRUDVANG.Inspection.Modified` | Modified for this wearer | Modifié pour ce porteur |
| `TRUDVANG.Inspection.Permanent` | Permanent and currently applied | Permanents et actuellement appliqués |
| `TRUDVANG.Inspection.Conditional` | Conditional | Conditionnels |
| `TRUDVANG.Inspection.Total` | Current total | Total actuel |
| `TRUDVANG.Inspection.Base` | Base value | Valeur de base |
| `TRUDVANG.Inspection.ActiveEffects` | Active effects and modifiers | Effets actifs et modificateurs |
| `TRUDVANG.Inspection.OtherModifiers` | Other modifiers | Autres modificateurs |
| `TRUDVANG.Inspection.CombatActionValue` | Combat action SV | VC des actions de combat |
| `TRUDVANG.Inspection.ItemTitle` | {item} for {wearer} | {item} pour {wearer} |

## `TRUDVANG.Inspection.Mode`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Inspection.Mode.permanent` | Applied while equipped | Appliqué tant que l’objet est équipé |
| `TRUDVANG.Inspection.Mode.conditional` | Conditional — chosen action | Conditionnel — action choisie |
| `TRUDVANG.Inspection.Mode.inactive` | Not currently applied | Non appliqué actuellement |

## `TRUDVANG.Inspection.Source`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Inspection.Source.rule` | Rule | Règle |
| `TRUDVANG.Inspection.Source.specialty` | Specialty | Spécialité |
| `TRUDVANG.Inspection.Source.discipline` | Discipline | Discipline |
| `TRUDVANG.Inspection.Source.trait` | Trait | Trait |
| `TRUDVANG.Inspection.Source.effect` | Effect | Effet |
| `TRUDVANG.Inspection.Source.constraint` | Limit | Limite |

## `TRUDVANG.CombatPool`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.CombatPool.Free` | Free | Libres |
| `TRUDVANG.CombatPool.BattleExperience` | Battle Experience | Expérience du combat |
| `TRUDVANG.CombatPool.ArmedFighting` | Armed Fighting | Combat armé |
| `TRUDVANG.CombatPool.UnarmedFighting` | Unarmed Fighting | Combat à mains nues |
| `TRUDVANG.CombatPool.AttacksParries` | Attacks & Parries | Attaques & parades |
| `TRUDVANG.CombatPool.CombatActions` | Combat Actions | Actions de combat |
| `TRUDVANG.CombatPool.CombatActionsHint` | Usable for any combat action except attacks and parries. | Utilisables pour toute action de combat sauf les attaques et les parades. |
| `TRUDVANG.CombatPool.Brawling` | Brawling | Bagarre |
| `TRUDVANG.CombatPool.Wrestling` | Wrestling | Lutte |
| `TRUDVANG.CombatPool.ShieldParry` | Shield Parries | Parades au bouclier |
| `TRUDVANG.CombatPool.OneHandedLightWeapons` | One-Handed Light Weapons | Armes légères à une main |
| `TRUDVANG.CombatPool.OneHandedLightWeaponsOffHand` | Light weapons — shield hand | Armes légères — main de bouclier |
| `TRUDVANG.CombatPool.OneHandedHeavyWeapons` | One-Handed Heavy Weapons | Armes lourdes à une main |
| `TRUDVANG.CombatPool.OneHandedHeavyWeaponsOffHand` | Heavy weapons — shield hand | Armes lourdes — main de bouclier |
| `TRUDVANG.CombatPool.ThrowingWeapons` | Throwing Weapons | Armes de lancer |
| `TRUDVANG.CombatPool.ThrowingWeaponsOffHand` | Throwing weapons — shield hand | Armes de lancer — main de bouclier |
| `TRUDVANG.CombatPool.TwoHandedWeapons` | Two-Handed Weapons | Armes à deux mains |
| `TRUDVANG.CombatPool.Crossbow` | Crossbow | Arbalète |
| `TRUDVANG.CombatPool.BowsSlings` | Bows & Slings | Arcs & frondes |

## `TRUDVANG.Hand`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Hand.Weapon` | Weapon hand | Main d’arme |
| `TRUDVANG.Hand.Shield` | Shield hand | Main de bouclier |
| `TRUDVANG.Hand.WeaponShort` | WH | MA |
| `TRUDVANG.Hand.ShieldShort` | SH | MB |

## `TRUDVANG.Combat`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Combat.HumanoidNaturalWeapons` | Fists & feet | Poings & pieds |
| `TRUDVANG.Combat.Dodge` | Dodge | Esquiver |
| `TRUDVANG.Combat.MovementAction` | Movement action | Action de mouvement |
| `TRUDVANG.Combat.MovementHint` | 2 CP per paid metre · {free} free m · Movement {movement} m | 2 PC par mètre payant · {free} m gratuit(s) · Mouvement {movement} m |
| `TRUDVANG.Combat.Grapple` | Grapple | Saisie |
| `TRUDVANG.Combat.Glima` | Glima | Glima |
| `TRUDVANG.Combat.WrestlingHint` | Grapple and glima: 2 CP per SV point; the Strength modifier applies. A successful glima deals 1d3 damage, or 1d5 when falling with the target. | Saisie et glima : 2 PC par point de VC ; le modificateur de Force s’applique. Une glima réussie inflige 1d3 dégâts, ou 1d5 en chutant avec la cible. |

## `TRUDVANG.CombatActionType`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.CombatActionType.Positioning` | Combat action, movement, or positioning | Action de combat, mouvement ou positionnement |
| `TRUDVANG.CombatActionType.Brawling` | Brawling or unarmed parry | Bagarre ou parade à mains nues |
| `TRUDVANG.CombatActionType.Wrestling` | Wrestling, grapple, or glima | Lutte, saisie ou glima |

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

## `TRUDVANG.Status`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Status.RecoveryDaily` | {amount} BP/day | {amount} PS/jour |
| `TRUDVANG.Status.RecoveryEveryDays` | {amount} BP/{days} days | {amount} PS/{days} jours |

## `TRUDVANG.Status.DamageConsequence`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Status.DamageConsequence.light` | No penalty | Aucune pénalité |
| `TRUDVANG.Status.DamageConsequence.injured` | −1 to SV and initiative | −1 aux VC et à l’initiative |
| `TRUDVANG.Status.DamageConsequence.serious` | −3 to SV and initiative | −3 aux VC et à l’initiative |
| `TRUDVANG.Status.DamageConsequence.critical` | −7 to SV and initiative | −7 aux VC et à l’initiative |

## `TRUDVANG.Status.FearState`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Status.FearState.calm` | Calm | Calme |
| `TRUDVANG.Status.FearState.one` | Level 1: uneasy | Niveau 1 : angoissé |
| `TRUDVANG.Status.FearState.two` | Level 2: frightened | Niveau 2 : effrayé |
| `TRUDVANG.Status.FearState.three` | Level 3: horrified | Niveau 3 : horrifié |
| `TRUDVANG.Status.FearState.four` | Level 4: terrified | Niveau 4 : terrifié |
| `TRUDVANG.Status.FearState.five` | Level 5: petrified | Niveau 5 : pétrifié |

## `TRUDVANG.Status.FearConsequence`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Status.FearConsequence.calm` | No penalty | Aucune pénalité |
| `TRUDVANG.Status.FearConsequence.one` | No universal modifier | Aucun modificateur universel |
| `TRUDVANG.Status.FearConsequence.two` | −1 to SV and initiative | −1 aux VC et à l’initiative |
| `TRUDVANG.Status.FearConsequence.three` | −3 to SV and initiative | −3 aux VC et à l’initiative |
| `TRUDVANG.Status.FearConsequence.four` | −5 to SV and initiative | −5 aux VC et à l’initiative |
| `TRUDVANG.Status.FearConsequence.five` | −7 to SV and initiative | −7 aux VC et à l’initiative |

## `TRUDVANG.Dialog`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Dialog.BaseTarget` | Base target: {target} | Cible de base: {target} |
| `TRUDVANG.Dialog.CombatPoolSlider` | Quick allocation | Allocation rapide |
| `TRUDVANG.Dialog.EquipmentCombatPointBonus` | Equipment CP bonus | Bonus de PC de l’équipement |
| `TRUDVANG.Dialog.Modifier` | Situation Modifier | Modificateur situationnel |
| `TRUDVANG.Dialog.CombatPoints` | Combat Points to Spend | CP à dépenser |
| `TRUDVANG.Dialog.AllocatedCombatPoints` | SV from allocated Combat Points | VC obtenue par les CP alloués |
| `TRUDVANG.Dialog.AllocatedPoints` | Allocated CP | PC alloués |
| `TRUDVANG.Dialog.CombatActionSpendingTitle` | Combat action, movement, or positioning | Action de combat, mouvement ou positionnement |
| `TRUDVANG.Dialog.DrawTitle` | Draw: {item} (10 CP) | Dégainer : {item} (10 PC) |
| `TRUDVANG.Dialog.SheatheTitle` | Sheathe: {item} (free) | Rengainer : {item} (gratuit) |
| `TRUDVANG.Dialog.CombatActionType` | Action type | Type d’action |
| `TRUDVANG.Dialog.AttackTitle` | Attack: {item} | Attaque: {item} |
| `TRUDVANG.Dialog.ParryTitle` | Parry: {item} |  Parade: {item} |
| `TRUDVANG.Dialog.MagicAction` | Magic or Divine Action | Action magique ou divine |
| `TRUDVANG.Dialog.NoMagicAction` | No magic modifier | Aucun modificateur magique |
| `TRUDVANG.Dialog.InitiativeAction` | Weapon, spell, or divine action | Arme, sortilège ou pouvoir divin |
| `TRUDVANG.Dialog.NoInitiativeAction` | No action modifier | Aucun modificateur d'action |
| `TRUDVANG.Dialog.InitiativeEquipment` | Conditional equipment used this round | Équipements conditionnels utilisés ce round |
| `TRUDVANG.Dialog.InitiativeMagic` | Spell or divine action | Sortilège ou pouvoir divin |
| `TRUDVANG.Dialog.AddTablet` | Add a compatible tablet | Ajouter une tablette compatible |
| `TRUDVANG.Dialog.MagicMethod` | Method and specialty | Méthode et spécialité |
| `TRUDVANG.Dialog.FinalTarget` | Final Skill Value | Valeur de compétence finale |
| `TRUDVANG.Dialog.Feint` | Feint (max. {max} CP) | Feinte (max. {max} PC) |
| `TRUDVANG.Dialog.Strenuous` | Strenuous effort | Renforcement |
| `TRUDVANG.Dialog.FinalVitnerCost` | Final Vitner cost | Coût final en vitner |
| `TRUDVANG.Dialog.TraitRollMode` | Roll mode | Mode de jet |
| `TRUDVANG.Dialog.SituationRoll` | Situation Roll | Jet de situation |
| `TRUDVANG.Dialog.OpenRoll` | Open Roll | Jet ouvert |
| `TRUDVANG.Dialog.SituationValue` | Situation Value | Valeur de situation |
| `TRUDVANG.Dialog.EffectModifier` | Effects | Effets |
| `TRUDVANG.Dialog.TotalSituationValue` | Total Situation Value | Valeur de situation totale |
| `TRUDVANG.Dialog.OpenRollBonus` | Bonus | Bonus |
| `TRUDVANG.Dialog.OpenRollBreakdown` | Total modifier | Modificateur total |

## `TRUDVANG.Roll`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Roll.Success` | Success | Succès |
| `TRUDVANG.Roll.Failure` | Failure | Échec |
| `TRUDVANG.Roll.OpenRoll` | Open roll on | Jet ouvert sur |
| `TRUDVANG.Roll.OpenInitiative` | Initiative uses 1d10 with an open roll on 10. | L'initiative utilise 1d10 avec un jet ouvert sur 10. |
| `TRUDVANG.Roll.Margin` | Success margin | Marge de réussite |
| `TRUDVANG.Roll.FeintParry` | Feint → Parry -{points} | Feinte → Parade -{points} |
| `TRUDVANG.Roll.OpenTraitFormula` | 1d10 (open on 10) + trait + bonus + effects | 1d10 (jet ouvert sur 10) + trait + bonus + effets |

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
| `TRUDVANG.Warning.DodgeRequiresFullCombatPools` | Evade requires every Combat Point pool to be full. | L’esquive exige que toutes les réserves de PC soient complètes. |
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
| `TRUDVANG.Warning.CannotAct` | The character's current condition prevents this action. | L'état actuel du personnage l'empêche d'effectuer cette action. |
| `TRUDVANG.Warning.EffectPermission` | You are not allowed to modify effects on this target. | Vous n'avez pas l'autorisation de modifier les effets de cette cible. |
| `TRUDVANG.Warning.NoApplicableEffects` | This item has no enabled effect to apply. | Cet objet ne possède aucun effet actif à appliquer. |
| `TRUDVANG.Warning.NoEffectTarget` | Select at least one target before applying this effect. | Sélectionnez au moins une cible avant d'appliquer cet effet. |
| `TRUDVANG.Warning.NotEnoughCombatPointsToReady` | Drawing requires 10 available CP, or no CP spent yet so the entire round can be devoted to it. | Il faut 10 PC disponibles pour dégainer, ou n’avoir encore dépensé aucun PC afin d’y consacrer tout le tour. |
| `TRUDVANG.Warning.NoWeaponActionsLeft` | {item} has no weapon actions remaining this round. | {item} n’a plus d’action d’arme disponible pour ce tour. |
| `TRUDVANG.Warning.InvalidCombatMovementCost` | Combat movement costs exactly 2 CP per metre; allocate a positive, even number of CP. | Le mouvement de combat coûte exactement 2 PC par mètre ; allouez un nombre positif et pair de PC. |
| `TRUDVANG.Warning.ExactCombatCost` | This action requires an exact allocation of {cost} CP. | Cette action exige une allocation exacte de {cost} PC. |
| `TRUDVANG.Warning.HandsOccupied` | Cannot ready {item}: {conflicts} already occupies one or more required hands. | Impossible de prendre {item} en main : {conflicts} occupe déjà la ou les mains requises. |
| `TRUDVANG.Warning.InvalidStageChanges` | The changes for effect stage {stage} are not valid JSON. | Les modifications du palier d'effet {stage} ne constituent pas un JSON valide. |

## `TRUDVANG.Description`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Description.SkillSummary` | {name} is a general skill used as the base value for its related actions and knowledge. | {name} est une compétence générale servant de valeur de base aux actions et connaissances associées. |
| `TRUDVANG.Description.KnowledgeSummary` | {name} is a discipline or specialty that improves the related skill checks. | {name} est une discipline ou spécialité qui améliore les tests de la compétence associée. |
| `TRUDVANG.Description.DisciplineSummary` | {name} covers {topics} and adds its level to the related checks. | {name} couvre {topics} et ajoute son niveau aux tests associés. |
| `TRUDVANG.Description.SpecialtySummary` | {name} focuses on this particular application of {discipline} and adds twice its level to applicable checks. | {name} approfondit cette application particulière de {discipline} et ajoute deux fois son niveau aux tests concernés. |
| `TRUDVANG.Description.TabletSummary` | {name} gathers the spells or divine powers belonging to this magical tradition. | {name} rassemble les sortilèges ou pouvoirs divins appartenant à cette tradition magique. |
| `TRUDVANG.Description.PowerSummary` | {name} is a power from {tablet}; its complete rules description will be added later. | {name} est un pouvoir de {tablet} ; sa description de règles complète sera ajoutée ultérieurement. |
| `TRUDVANG.Description.SourcePage` | Player's Handbook, p. {page} | Livre des règles, p. {page} |

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
| `TRUDVANG.Calculation.CombatPoolSpent` | {amount} CP spent from the {pool} pool. | {amount} PC dépensé(s) depuis la réserve {pool}. |
| `TRUDVANG.Calculation.FeintCost` | Feint: -{points} SV ({points} CP). | Feinte : -{points} VC ({points} PC). |
| `TRUDVANG.Calculation.EquipmentCombatPointBonus` | Equipment CP bonus: {amount}. | Bonus de PC de l’équipement : {amount}. |
| `TRUDVANG.Calculation.WrestlingCost` | {points} CP provide a base SV of {target} (2 CP/SV), then Strength {strength} applies. | {points} PC donnent une VC de base de {target} (2 PC/VC), puis Force {strength} s’applique. |
| `TRUDVANG.Calculation.CombatPoolSource` | {source} level {level}: {max} CP pool. | {source} niveau {level} : réserve de {max} PC. |
| `TRUDVANG.Calculation.FreeCombatPoolSource` | Fighting skill: {skill} CP; Battle Experience: +{experience} CP; other modifiers: {modifier} CP; total: {max} free CP. | Compétence Combat : {skill} PC ; Expérience du combat : +{experience} PC ; autres modificateurs : {modifier} PC ; total : {max} PC libres. |

## `TRUDVANG.Calculation.Equipment`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Calculation.Equipment.TwoHandedWeaponActions` | Two-Handed Weapons level {threshold}: +{amount} weapon action. | Armes à deux mains au niveau {threshold} : +{amount} action d’arme. |
| `TRUDVANG.Calculation.Equipment.StrengthDamage` | Strength: {amount} melee damage. | Force : {amount} aux dégâts de corps à corps. |
| `TRUDVANG.Calculation.Equipment.IroncladHeft` | Ironclad level {level}: {amount} effective Heft. | Cuirassé niveau {level} : {amount} en Encombrement effectif. |
| `TRUDVANG.Calculation.Equipment.IroncladArmorPenalty` | Ironclad level {level}: recalculates the armor penalties from its effective Heft. | Cuirassé niveau {level} : recalcule les malus de l’armure depuis son Encombrement effectif. |
| `TRUDVANG.Calculation.Equipment.ArmorOverload` | Armor Bearer level {level} is insufficient for Heft {heft}: {amount}. | Porteur d’armure niveau {level} est insuffisant pour un Encombrement de {heft} : {amount}. |
| `TRUDVANG.Calculation.Equipment.ShieldHandPenalty` | Shield hand: {amount} SV. | Main de bouclier : {amount} à la VC. |
| `TRUDVANG.Calculation.Equipment.BodyControlShieldHand` | Body Control level {level}: +{amount} SV with the shield hand. | Contrôle corporel niveau {level} : +{amount} à la VC de la main de bouclier. |
| `TRUDVANG.Calculation.Equipment.AmbidexterityShieldHand` | Ambidexterity level {level}: +{amount} SV with the shield hand. | Ambidextrie niveau {level} : +{amount} à la VC de la main de bouclier. |
| `TRUDVANG.Calculation.Equipment.ShieldBearerShieldHand` | Shield Bearer level {level}: cancels the remaining shield-hand penalty. | Porteur de bouclier niveau {level} : annule le malus restant de la main de bouclier. |
| `TRUDVANG.Calculation.Equipment.IntrinsicDamageBonus` | Item damage modifier: {amount}. | Modificateur de dégâts propre à l’objet : {amount}. |
| `TRUDVANG.Calculation.Equipment.MinimumDamage` | The negative modifier cannot reduce a successful attack below 1 damage. | Le modificateur négatif ne peut pas réduire une attaque réussie à moins de 1 dégât. |
| `TRUDVANG.Calculation.Equipment.IgnoredCondition` | The modifier's conditions are not met. | Les conditions de la modification ne sont pas remplies. |
| `TRUDVANG.Calculation.Equipment.UnsupportedOperation` | The modifier uses an unsupported operation. | La modification utilise une opération non prise en charge. |
| `TRUDVANG.Calculation.Equipment.InvalidAmount` | The modifier does not contain a valid numeric value. | La modification ne contient pas de valeur numérique valide. |
| `TRUDVANG.Calculation.Equipment.Constraint` | The value was adjusted to the characteristic's permitted range. | La valeur a été ajustée aux limites autorisées pour cette caractéristique. |

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
| `TRUDVANG.Notification.Drawn` | {item} drawn for {cost} CP (−10 initiative for following actions). | {item} dégainé pour {cost} PC (−10 à l’initiative des actions suivantes). |
| `TRUDVANG.Notification.DrawnOutsideCombat` | {item} drawn. | {item} dégainé. |
| `TRUDVANG.Notification.DrawnFullRound` | {item} drawn by devoting the entire round to it; every CP pool was emptied. | {item} dégainé en y consacrant tout le tour ; toutes les réserves de PC ont été vidées. |
| `TRUDVANG.Notification.CombatMovement` | {points} CP spent on {meters} paid metre(s) of combat movement. | {points} PC dépensés pour {meters} mètre(s) payant(s) de mouvement de combat. |
| `TRUDVANG.Notification.Sheathed` | {item} sheathed for free. | {item} rengainé gratuitement. |
| `TRUDVANG.Notification.AdvancementConfirmed` | The advancements have been confirmed. | Les améliorations ont été validées. |
| `TRUDVANG.Notification.AdvancementCancelled` | The advancements were cancelled and {cost} Adventure Points were refunded. | Les améliorations ont été annulées et {cost} points d'aventure ont été remboursés. |
| `TRUDVANG.Notification.CreationModeEnabled` | Character creation mode enabled. | Mode création de personnage activé. |
| `TRUDVANG.Notification.CreationModeDisabled` | Character creation completed. | Création du personnage terminée. |
| `TRUDVANG.Notification.InvalidTraitsRepaired` | Reset invalid -4 defaults to 0 on {count} character(s). | Les valeurs initiales invalides à -4 ont été remises à 0 sur {count} personnage(s). |
| `TRUDVANG.Notification.KnowledgeSynced` | {count} knowledge item(s) imported from the Skills compendiums were refreshed. | {count} connaissance(s) importée(s) depuis les compendiums de Compétences ont été mise(s) à jour. |
| `TRUDVANG.Notification.EffectsApplied` | Applied {count} effect(s). | {count} effet(s) appliqué(s). |
| `TRUDVANG.Notification.EffectStageAdvanced` | {effect} advanced to stage {stage}. | {effect} passe au palier {stage}. |

## `TRUDVANG.New`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.New.Item` | New {type} | Nouveau {type} |
| `TRUDVANG.New.Effect` | New effect | Nouvel effet |

## `TRUDVANG.Empty`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Empty.Weapons` | Equip a weapon to place it among the quick actions. | Equipez une arme pour l'ajouter aux actions rapides. |
| `TRUDVANG.Empty.Effects` | No active effect. | Aucun effet actif. |

## `TRUDVANG.Effect`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Effect.Permanent` | Permanent | Permanent |
| `TRUDVANG.Effect.BaseValue` | Base value | Valeur de base |
| `TRUDVANG.Effect.Transferred` | Transferred while the item is active | Transféré tant que l'objet est actif |
| `TRUDVANG.Effect.Applied` | Applied to selected targets | Appliqué aux cibles sélectionnées |
| `TRUDVANG.Effect.RulesTab` | Trudvang | Trudvang |
| `TRUDVANG.Effect.Stacking` | Stacking rule | Règle de cumul |
| `TRUDVANG.Effect.StackId` | Stack identifier | Identifiant de cumul |
| `TRUDVANG.Effect.StackIdHint` | Effects with the same non-empty identifier use the selected stacking rule. | Les effets partageant un même identifiant non vide suivent la règle de cumul sélectionnée. |
| `TRUDVANG.Effect.Potency` | Potency | Puissance |
| `TRUDVANG.Effect.Stack` | Stack | Cumuler |
| `TRUDVANG.Effect.Refresh` | Refresh duration | Rafraîchir la durée |
| `TRUDVANG.Effect.Replace` | Replace existing effect | Remplacer l'effet existant |
| `TRUDVANG.Effect.Highest` | Keep highest potency | Conserver la puissance la plus élevée |
| `TRUDVANG.Effect.Stages` | Successive stages | Paliers successifs |
| `TRUDVANG.Effect.StagesHint` | When the current stage expires, the active GM advances the effect to the next stage. Stage changes use the native ActiveEffect JSON format. | À l'expiration du palier courant, le MJ actif fait passer l'effet au suivant. Les modifications utilisent le format JSON natif des ActiveEffect. |
| `TRUDVANG.Effect.Stage` | Stage | Palier |
| `TRUDVANG.Effect.StageChanges` | Changes (JSON) | Modifications (JSON) |
| `TRUDVANG.Effect.AddStage` | Add stage | Ajouter un palier |
| `TRUDVANG.Effect.SupportedPaths` | Supported change paths | Chemins de modification pris en charge |
| `TRUDVANG.Effect.SupportedPathsHint` | Trait identifiers are charisma, constitution, dexterity, intelligence, perception, psyche, and strength. Skill identifiers are agility, care, entertainment, faith, fighting, knowledge, shadowArts, vitnerCraft, and wilderness. Use the initial phase for changes that must feed derived calculations. | Les identifiants de traits sont charisma, constitution, dexterity, intelligence, perception, psyche et strength. Les identifiants de compétences sont agility, care, entertainment, faith, fighting, knowledge, shadowArts, vitnerCraft et wilderness. Utilisez la phase initiale pour les modifications qui doivent alimenter les calculs dérivés. |
| `TRUDVANG.Effect.TabDurationChanges` | Duration & Changes | Durée & Modifications |
| `TRUDVANG.Effect.Duration` | Duration | Durée |
| `TRUDVANG.Effect.RoundHint` | 1 round = 5 seconds (game turn) | 1 round = 5 secondes (tour de jeu) |
| `TRUDVANG.Effect.Expiry` | Expiry | Expiration |
| `TRUDVANG.Effect.ExpiryNone` | None | Aucune |
| `TRUDVANG.Effect.TurnStart` | Start of turn | Début de tour |
| `TRUDVANG.Effect.TurnEnd` | End of turn | Fin de tour |
| `TRUDVANG.Effect.PriorityHint` | Application priority (lower applied first; 20 by default). | Priorité d'application (plus petit appliqué en premier ; 20 par défaut). |
| `TRUDVANG.Effect.ChangeKey` | Key | Clé |
| `TRUDVANG.Effect.ChangeType` | Type | Type |
| `TRUDVANG.Effect.ChangeValue` | Value | Valeur |
| `TRUDVANG.Effect.ChangePriority` | Priority | Priorité |
| `TRUDVANG.Effect.AddChange` | Add change | Ajouter une modification |
| `TRUDVANG.Effect.ChangeTypeCustom` | Custom | Personnalisé |
| `TRUDVANG.Effect.ChangeTypeAdd` | Add | Ajout |
| `TRUDVANG.Effect.ChangeTypeSubtract` | Subtract | Soustraction |
| `TRUDVANG.Effect.ChangeTypeMultiply` | Multiply | Multiplication |
| `TRUDVANG.Effect.ChangeTypeDowngrade` | Downgrade | Minimum |
| `TRUDVANG.Effect.ChangeTypeUpgrade` | Upgrade | Maximum |
| `TRUDVANG.Effect.ChangeTypeOverride` | Override | Remplacement |

## `TRUDVANG.Import`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Import.Started` | Installing the Trudvang starter library... | Installation de la bibliothèque de démarrage Trudvang... |
| `TRUDVANG.Import.Complete` | Trudvang starter library installed: {items} items, {tables} tables, and {actors} NPCs. | Bibliothèque de démarrage Trudvang installée: {items} objets, {tables} tables, et {actors} PNJs. |
| `TRUDVANG.Import.Failed` | The Trudvang starter library could not be installed. See the console for details. | La bibliothèque de démarrage Trudvang n'a pas pu être installée. Consultez la console pour plus de détails. |
| `TRUDVANG.Import.PacksRebuildStarted` | Rebuilding the Skills compendiums... | Reconstruction des compendiums de Compétences... |
| `TRUDVANG.Import.PacksRebuilt` | Skills compendiums rebuilt ({packs} packs). | Compendiums de Compétences reconstruits ({packs} packs). |

## `TRUDVANG.Content.Folder`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Folder.Weapons` | Trudvang - Weapons | Trudvang - Armes |
| `TRUDVANG.Content.Folder.Armor` | Trudvang - Armor & Shields | Trudvang - Armures & Boucliers |
| `TRUDVANG.Content.Folder.Gear` | Trudvang - Gear & Extracts | Trudvang - Équipements & Extraits |
| `TRUDVANG.Content.Folder.Equipment` | Equipment | Équipement |
| `TRUDVANG.Content.Folder.Races` | Races | Races |
| `TRUDVANG.Content.Folder.Archetypes` | Archetypes | Archétypes |
| `TRUDVANG.Content.Folder.Magic` | Trudvang - Tablets & Magic | Trudvang - Tables & Magie |
| `TRUDVANG.Content.Folder.Abilities` | Trudvang - Disciplines & Specialties | Trudvang - Disciplines & Spécialités |
| `TRUDVANG.Content.Folder.Tables` | Magic | Magie |
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
| `TRUDVANG.Content.Source.PHB47` | Player's Handbook, p. 47 | Livre des règles, p. 47 |
| `TRUDVANG.Content.Source.PHB48` | Player's Handbook, p. 48 | Livre des règles, p. 48 |
| `TRUDVANG.Content.Source.PHB50` | Player's Handbook, p. 50 | Livre des règles, p. 50 |
| `TRUDVANG.Content.Source.PHB55` | Player's Handbook, p. 55 | Livre des règles, p. 55 |
| `TRUDVANG.Content.Source.PHB59` | Player's Handbook, p. 59 | Livre des règles, p. 59 |
| `TRUDVANG.Content.Source.PHB69` | Player's Handbook, p. 69 | Livre des règles, p. 69 |
| `TRUDVANG.Content.Source.PHB74` | Player's Handbook, p. 74 | Livre des règles, p. 74 |
| `TRUDVANG.Content.Source.PHB92` | Player's Handbook, p. 92 | Livre des règles, p. 92 |
| `TRUDVANG.Content.Source.PHB201` | Player's Handbook, p. 201 | Livre des règles, p. 201 |

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
| `TRUDVANG.Content.Tablet.holy-haminges-power-of-the-thurses.Name` | Power of Thurses | Puissance des tursirs |

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
| `TRUDVANG.Content.Power.holy-ealdtradition-heritage-of-majne:king-s-militia:3.Name` | King's Militia | Milice royale |

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

## `TRUDVANG.Content.Ability.bodyControl`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.bodyControl.Description` | The Body Control discipline develops the character’s ability to get the most out of their agility to duck, climb, land softly on their feet after a fall, and so on. The discipline can also be used to make flips in the air and engage in other acrobatic maneuvers. The penalties on attacks with the shield hand are reduced by 1 point per level | La discipline Contrôle corporel développe la capacité du personnage à tirer le meilleur de son agilité pour plonger sur le côté, escalader, atterrir sur ses pieds en douceur après une chute, etc. La discipline peut aussi être utilisée pour faire des sauts ou d’autres manœuvres acrobatiques. Le malus qui s’applique aux attaques effectuées avec la main de bouclier est réduit de 1 par niveau. |

## `TRUDVANG.Content.Ability.ambidexterity`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.ambidexterity.Description` | The character improves their ability to fight even with the shield hand (which is the left hand for a right-handed person or vice versa). The penalties on attacks with the shield hand are reduced by 2 points per level. By learning all levels of the Ambidexterity specialty and the Body Control discipline, the character becomes equally skilled at using both hands. The modifiers from both Discipline and Specialty are stacked in order to offset the penalty for the shield hand. Once both Body Control Discipline and the Ambidexterity Specialty have been mastered to the highest level, the -15 penalty to the shield hand is completely nullified. The Agility skill is used in most cases when a person performs something with their body. It may be, for example, when a character jumps, climbs, does a handstand, balances, falls and lands on their feet, or leaps away from a runaway horse. In addition to these maneuvers, Agility is used in a number of other physical situations, such as when the character drives a wagon or sleigh, canoes, skis or rides a horse. Remember that in all these situations wearing armor will affect the results. In all areas, it is ultimately up to the game master to determine when a Skill roll is needed, and what modifiers the character receives in each situation. | Le personnage améliore sa capacité à se battre avec sa main de bouclier (c’està-dire la main gauche pour un droitier, ou inversement). Le malus aux attaques effectuées avec la main de bouclier est réduit de 2 par niveau. En apprenant tous les niveaux de la spécialité Ambidextrie et de la discipline Contrôle corporel, le personnage est aussi compétent avec ses deux mains. Les modificateurs de la discipline et de la spécialité se cumulent pour annuler le malus de la main de bouclier. En effet, une fois que la discipline Contrôle corporel et la spécialité Ambidextrie ont toutes deux été maîtrisées au plus haut niveau, le malus de -15 dû à la main de bouclier est totalement annulé. |

## `TRUDVANG.Content.Ability.jestering`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.jestering.Description` | The character has learned to perform with fire, juggling, and other jester tricks. The knowledge enables them to breathe fire, pull their hands through flame, and juggle. When the game master requires a Skill roll, the character can add +2 to their Skill Value per level in this specialty. | Le personnage a appris à faire un numéro avec du feu, en jonglant et en effectuant d’autres tours de bouffon. Cette connaissance lui permet de cracher du feu, de passer ses mains à travers les flammes et de jongler. Lorsque le maître de jeu demande un test de compétence, le personnage peut ajouter un bonus de +2 par niveau dans cette spécialité à sa valeur de compétence. |

## `TRUDVANG.Content.Ability.jumpingClimbingBalancing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.jumpingClimbingBalancing.Description` | The character is adept at jumping in different environments and can add +2 to their Skill Value in the ability to jump. With a successful Skill roll, they can leap up to 2 meters + 1 meter per level in length (maximum 7 m), jump up to 60 cm + 20 cm per level in height (maximum 1.6 m), and fall up to 3 meters + 1/2 meter per level (maximum 6 m) without getting hurt. A successful Jumping roll for falls from heights also reduces the damage dice by one level (3d6 points of damage becomes 2d6, and so on). When a character wants to leap farther, jump higher, or fall farther than the level permits, it is up to the GM to set a suitable modifier on the Skill roll. The character is also good at climbing and balancing. While balancing, they move at about a third of their movement ability under normal conditions. While climbing, they move at about a fifth of their movement ability under normal conditions. Ultimately , the GM determines how far a character climbs or balances during an action round based on the prevailing conditions. | Le personnage est expert en saut dans différents environnements et peut ajouter un bonus de +2 à sa valeur de compétence lorsqu’il effectue des sauts. Lorsqu’il réussit un test de compétence, il peut effectuer un saut en longueur jusqu’à une distance de 2 mètres + 1 mètre par niveau (maximum 7 m), un bond en hauteur allant jusqu’à 60 cm + 20 cm par niveau (maximum 1,60 m), ou une chute de 3 mètres + ½ mètre par niveau (maximum 6 m) sans se faire mal. Un test de Saut réussit pour les chutes réduit également les dés de dégâts de un par niveau (3d6 points de dégâts deviennent 2d6, etc.). Lorsqu’un personnage veut sauter plus loin, plus haut ou chuter de plus haut que le niveau de spécialité le permet, c’est au MJ de fixer le modificateur adapté au test de compétence. Le personnage est aussi doué pour l’escalade que pour l’équilibre. Lorsqu’il se déplace en équilibre, il avance au tiers de sa capacité de mouvement en conditions normales. Lorsqu’il fait de l’escalade, il se déplace au cinquième de sa capacité de mouvement en conditions normales. Au bout du compte, le MJ détermine en fonction des conditions jusqu’où un personnage se hisse ou avance en équilibre au cours d’un tour de jeu. |

## `TRUDVANG.Content.Ability.swimming`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.swimming.Description` | The character has learned to swim (without this knowledge, they cannot swim) and can add +2 to their Skill Value per level in the ability. They can normally move +1 meter per level per action round in the water, and hold person evading has a -4 modifier on their chance to succeed. The character cannot do anything else besides try to evade during that action. During a combat round, the character can evade one attack at specialty levels 1-2, two attacks at levels 3-4, and three attacks at level 5. | Le personnage a appris à nager (sans cette connaissance, il ne sait pas nager) et peut ajouter +2 par niveau de spécialité à sa valeur de compétence. Il peut se déplacer dans l’eau normalement au rythme de 1 mètre par niveau et par tour de jeu, et retenir son souffle sous l’eau pendant 10 tours de jeu par niveau de spécialisation (maximum 50 tours de jeu, ou quatre minutes et dix secondes, un tour de jeu ayant une durée de cinq secondes). Un personnage qui n’a pas cette spécialité peut retenir son souffle pendant 12 tours en restant immobile, ou 6 tours s’il est sous l’eau ou s’il se déplace. Il est possible de nager en portant une armure dans la mesure où celle-ci a un poids maximum de 1 par niveau de spécialité (poids maximum de 5). On peut alors facilement se déplacer sous l’eau jusqu’à 3 tours de jeu. Pour chaque tour de jeu supplémentaire, il faut effectuer un test de compétence avec un malus cumulatif de -2. Au bout de 3 tours de jeu (trois malus cumulatifs), le personnage doit réussir avec un malus de -6. S’il échoue à son test, le personnage doit remonter à la surface pour respirer. La vitesse de déplacement est la même que pour la natation sans armure. |

## `TRUDVANG.Content.Ability.horsemanship`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.horsemanship.Description` | The Horsemanship discipline develops the character’s ability to ride animals sitting up and to drive a chariot pulled by four-footed animals. | La discipline Maîtrise équestre développe la capacité du personnage à chevaucher des animaux en se tenant droit et à conduire un chariot tiré par des animaux à quatre pattes. |

## `TRUDVANG.Content.Ability.drivingWagon`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.drivingWagon.Description` | The Driving Wagon specialty develops the character’s ability to drive a wagon coupled to one or more draft animals. Skill rolls are normally required only during hunts, chases or in difficult terrain or weather conditions. | La spécialité Conduite de chariot développe la capacité d’un personnage à conduire un chariot attelé à un ou plusieurs animaux de trait. Les tests de compétence ne sont habituellement requis qu’au cours d’une chasse, lors d’une poursuite, ou si le terrain est difficile ou les conditions météorologiques mauvaises. |

## `TRUDVANG.Content.Ability.riding`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.riding.Description` | The character has learned to ride a horse and is able to do maneuvers on horseback. Because of this, they get +2 on their Skill Value per level in the specialty whenever they try to ride fast, get the horse to jump, or do other tricks. The Riding specialty can also be used in conjunction with long rides, when battles are fought, or for complications in the wild. Each combat round that a rider fights on horseback, they must pay 15 (-3 per specialty level) Combat Points. So at full specialty level, there is no extra cost for fighting on horseback. More information on Mounted Combat is in the Game Master Guide book, page 95. | Le personnage a appris à monter à cheval et est capable de réaliser des manœuvres sur leur dos. De ce fait, il obtient un bonus de +2 par niveau de spécialité à sa valeur de compétence dès qu’il essaie de monter à vive allure, de faire sauter son cheval ou de réaliser d’autres tours. La spécialité Équitation peut aussi être utilisée pour de longues chevauchées, dans les batailles ou en cas de complications dans la nature. À chaque tour de combat passé à cheval, un cavalier doit dépenser (15 - 3/ niveau de spécialité) points de combat. Ainsi, en ayant tous les niveaux de spécialité, il n’y a pas de coût supplémentaire pour combattre à cheval. Vous trouverez plus d’informations sur le combat à cheval au chapitre Combat, page 321. |

## `TRUDVANG.Content.Ability.battleManeuver`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.battleManeuver.Description` | This discipline grants improvements in moving in battle and wearing armor. The bonus modifier is used only in conjunction with the Evade specialty. | Cette discipline permet d’accéder à des spécialités facilitant les mouvements au combat et le port d’armure. Le modificateur qu’elle accorde n’est généralement utilisé que pour augmenter la VC des tentatives d’esquive. |

## `TRUDVANG.Content.Ability.combatMovement`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.combatMovement.Description` | A person with this specialty can move quickly and effortlessly during battle. They can move 1 meter per level (maximum 5 m) without spending Combat Points and beyound the maaximum movement. After moving that distance, the character must spend 2 Combat Points for every additional meter they want to move. | Une personne ayant cette spécialité peut se déplacer rapidement et sans effort pendant un combat. Elle peut se déplacer de 1 mètre par niveau (maximum 5 m) au-delà du mouvement maximum sans dépenser de point de combat. Une fois qu’il a parcouru cette distance, le personnage doit dépenser 2 points de combat pour chaque mètre supplémentaire. |

## `TRUDVANG.Content.Ability.evade`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.evade.Description` | The character has learned to evade an attack without parrying. To successfully evade an attack, they make a Skill roll modified negatively by the attacker’s degree of success, which is the amount by which they beat their target SV (SV – dice result = modifier). For example, if the attacker has SV 14 and rolls 10, the Riding The character has learned to ride a horse and is able to do maneuvers on horseback. Because of this, they get +2 on their Skill Value per level in the specialty whenever they try to ride fast, get the horse to jump, or do other tricks. The Riding specialty can also be used in conjunction with long rides, when battles are fought, or for complications in the wild. Each combat round that a rider fights on horseback, they must pay 15 (-3 per specialty level) Combat Points. So at full specialty level, there is no extra cost for fighting on horseback. More information on Mounted Combat is in the Game Master Guide book, page 95. | Le personnage a perfectionné l’art d’éviter ou d’esquiver une attaque sans la parer. Effectuer une esquive nécessite une action ; l’esquive ne peut pas être combinée avec quelque autre action que ce soit. Normalement, même ceux qui ne disposent pas de cette spécialité peuvent essayer d’esquiver une attaque. Cependant, en développant la spécialité à haut niveau, il devient possible de tenter d’esquiver plusieurs attaques : F Jusqu’à 2 attaques au niveau 3 F Jusqu’à 3 attaques au niveau 5 Le joueur peut alors répartir sa valeur de compétence totale comme il le souhaite entre les différentes esquives qu’il veut effectuer. Prenons un personnage ayant Agilité 8, Manœuvres de combat 2 et Esquive 3, et donc une VC totale de 16. Il peut esquiver jusqu’à 2 attaques par tour (car il a Esquive 3), par exemple une attaque avec VC 9 et une autre avec VC 7. Un personnage ne peut esquiver (ou parer) une attaque qu’une seule fois. |

## `TRUDVANG.Content.Ability.ironclad`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.ironclad.Description` | The person finds it easy to move and maneuver in armor. Their worn armor is counted as if it has 1 less in Heft (-1) for each level of specialty (minimum Heft of 1) to assess the armor modifiers the person receives. | -1/Niveau Le personnage peut se déplacer et manœuvrer plus facilement avec une armure. Pour évaluer ses modificateurs d’armure, on considère que l’armure qu’il porte a un encombrement réduit de 1 pour chaque niveau de spécialité (encombrement minimum de 1). |

## `TRUDVANG.Content.Ability.handler`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.handler.Description` | The person has learned management and administration in various forms. It can be anything from controlling a village or town to planning wars and campaigns. The handler is the one behind a city’s prosperity and knows why taxes are needed, who runs the administration, and what they do. Even if the handler does not know everyone personally , they know which authorities are responsible for which tasks. | Le personnage a appris la gestion et l’administration dans toutes ses formes. Il peut s’agir de diriger un village ou une ville, ou de planifier des guerres et des campagnes. Le gestionnaire est la personne en charge de la prospérité de la ville, et sait pourquoi les impôts sont nécessaires, qui dirige l’administration et ce qu’ils font. Même si le gestionnaire ne connaît pas tout le monde à titre personnel, il sait quelles sont les autorités chargées des différentes tâches. |

## `TRUDVANG.Content.Ability.commander`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.commander.Description` | The person has become proficient in the management of armies and warfare, how to move troops, what it takes to entertain troops, and which defenses should be built around the squad. In short, the specialty covers everything connected with managing armies and waging war. | Le personnage maîtrise la gestion des armées et de la guerre, sait comment déplacer les troupes et ce qui est nécessaire pour les distraire, et connaît les défenses à mettre en œuvre pour protéger une escouade. En résumé, la spécialité couvre tout ce qui a trait à la gestion des armées et à la façon de mener une guerre. |

## `TRUDVANG.Content.Ability.sage`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.sage.Description` | The person has gained great insight into the city’s management and administration (or into that of the country , later in their careers). Therefore, they may be involved in solving the city’s or country’s problems. | Le personnage a atteint une grande compréhension de la gestion et de l’administration d’une ville (ou d’un pays, plus tard dans sa carrière). Ainsi, il peut être impliqué dans la résolution des problèmes de la ville ou du pays. |

## `TRUDVANG.Content.Ability.handicraft`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.handicraft.Description` | The character is good at building and crafting things. This discipline is linked to three different craft groups, Counterfeiting, Hard materials and Soft materials, and each has their own specialty. | Le personnage sait construire et façonner des choses. Cette discipline est liée à trois différents groupes d’artisanat, Contrefaçon, Matériaux durs et Matériaux souples, chacun ayant ses propres spécialités. |

## `TRUDVANG.Content.Ability.counterfeiting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.counterfeiting.Description` | The person has learned to forge impressive objects that appear as close to the original as possible. The more time they spend with the original, the more difficult it is to see through the counterfeit. The person must also have the specialty that the material requires. | Le personnage a appris à contrefaire des objets impressionnants, qui ressemblent autant que possible à l’original. Plus il a passé de temps avec l’original, plus la contrefaçon est difficile à percevoir. Le personnage doit également posséder la spécialité requise par le matériau. |

## `TRUDVANG.Content.Ability.hardMaterials`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.hardMaterials.Description` | The character has learned to make and repair items of hard materials such as stone, metal, wood, and bone. In case of repairs, a successful Skill roll restores 2 in the Breach Value per level of specialty and requires one hour of work. | Le personnage a appris à fabriquer et réparer des objets en matériaux durs tels que la pierre, le métal, le bois et l’os. Pour les réparations, un test de compétence réussi permet de restaurer 2 points de la valeur d’intégrité de l’objet par niveau de spécialité, et nécessite une heure de travail. |

## `TRUDVANG.Content.Ability.softMaterials`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.softMaterials.Description` | The character has learned to make and repair items of soft materials such as what items can and cannot be sold, who can or should be bribed, and so on. The person knows what papers are required for admission to a town or for receiving approval to conduct their trade. The person has also learned to appraise objects in terms of the current price and what they could get by selling it elsewhere. | Le personnage a appris à fabriquer et réparer des objets en matériaux souples tels que les vêtements, la fourrure et le cuir. Pour les réparations, un test de compétence réussi permet de restaurer 2 points de la valeur d’intégrité de l’objet par niveau de spécialité, et nécessite une heure de travail. |

## `TRUDVANG.Content.Ability.tradesman`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.tradesman.Description` | The person has learned to operate a farm, an inn, a barber shop, or a trade that offers other services. Through this skill, they also know who to bribe when something needs to be smuggled or how to evade taxes. | Le personnage a appris à gérer une ferme, une taverne, un salon de barbier ou un commerce qui propose d’autres services. Grâce à cette compétence, il sait également à qui il doit verser des pots-de-vin lorsqu’il a besoin de produits de contrebande ou s’il veut échapper à l’impôt. |

## `TRUDVANG.Content.Ability.barber`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.barber.Description` | The person has learned to cut and shave hair, and also to pull out “evil” teeth. | Le personnage a appris à couper les cheveux et à raser la barbe, ainsi qu’à extraire les « mauvaises » dents. |

## `TRUDVANG.Content.Ability.brewer`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.brewer.Description` | The person has learned to prepare delicious drinks. The brewer knows how to produce everything from mead and wine to the strongest of spiced spirits. | Le personnage a appris à préparer de délicieuses boissons. Le brasseur sait comment produire toutes sortes de boissons, depuis l’hydromel jusqu’aux alcools épicés les plus forts, en passant par le vin. |

## `TRUDVANG.Content.Ability.cook`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.cook.Description` | The person has learned how to cook good food. | Le personnage a appris comment cuisiner de la bonne nourriture. |

## `TRUDVANG.Content.Ability.peasant`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.peasant.Description` | A peasant knows when and how to carry out animal care or trade in their farm’s goods. They also know what it takes for a farm to survive the winter and are well versed in what needs to be done from day to day. | Un paysan sait quand et comment il faut s’occuper des animaux ou vendre les biens produits par sa ferme. Il sait également ce qu’il faut faire pour que la ferme puisse survivre à l’hiver et s’y connaît bien dans les tâches quotidiennes. |

## `TRUDVANG.Content.Ability.trader`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.trader.Description` | The person has learned where to buy goods cheaply and sell them at a higher price elsewhere. The trader also knows what taxes to pay on goods, what it costs to transport the goods in different ways, trades Man (d) The person has learned to operate a farm, an inn, a barber shop, or a trade that offers other services. Through this skill, they also know who to bribe when something needs to be smuggled or how to evade taxes. | Le personnage a appris où il peut acheter des biens pour pas cher et à les vendre ailleurs à un prix plus élevé. Le marchand sait également quels impôts sur les produits il doit payer, le coût des différents modes de transport des biens, les objets qui peuvent être vendus et ceux qui ne le peuvent pas, à qui on peut ou doit verser des pots-de-vin, etc. Le personnage sait quels papiers il faut remplir pour pouvoir entrer dans une ville ou pour être autorisé à y faire commerce. Il a aussi appris à évaluer les objets du point de vue du prix actuel et ce qu’il peut en tirer en les vendant ailleurs. |

## `TRUDVANG.Content.Ability.healingDrugs`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.healingDrugs.Description` | The Healing and Drugs discipline teaches a person to mend and care for the sick and wounded so they recover faster than normal, as well as to impair others’ health through drugs or poisons. Tending to wounds and illnesses requires one of the specialties below; rolls made with the discipline’s knowledge alone (without any specialty) can only stop bleeding and keep the patients’ conditions from worsening. | Avec la discipline Soins et remèdes, un personnage a appris à soigner et à s’occuper des malades et des blessés de façon à leur permettre de se remettre plus vite que la normale, mais aussi à altérer la santé de certains par l’intermédiaire de drogues ou de poisons. Pour s’occuper des blessures et des maladies, l’une des spécialités ci-dessous est nécessaire. Les tests de compétence réalisés en n’utilisant que la connaissance de cette discipline (et donc sans avoir de spécialité) permettent seulement de stopper les hémorragies et d’éviter l’aggravation de la situation des malades et des blessés. |

## `TRUDVANG.Content.Ability.extractsPotions`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.extractsPotions.Description` | The person has learned what substances cause the body to react in a certain way. In addition to the extract preparation, this specialty includes what can happen to a person exposed to a particular extract and what can help the victim overcome the drug’s effect. The person has learned to recognize a specific extract depending on its taste, smell, appearance, and effect when someone has been exposed to it. After determining the extract involved, the character knows what can be used as an antidote to neutralize the effect. The character has also learned to improve the balance of the body and speed healing by applying various substances. For this specialty , everything from diseases to broken limbs and wounds count as injuries. | Le personnage a appris les effets de différentes substances sur le corps. En plus de la préparation d’extraits, cette spécialité inclut la connaissance de ce qui peut arriver à une personne exposée à un extrait spécifique et la façon dont on peut aider la victime à surmonter ses effets. Le personnage a appris à reconnaître un extrait grâce à son goût, son odeur, son apparence et ses effets lorsque quelqu’un y a été exposé. Après avoir identifié l’extrait impliqué, le personnage peut déterminer l’antidote à utiliser pour neutraliser les effets. Il a également appris à améliorer l’équilibre corporel et à augmenter la vitesse de guérison grâce à diverses substances. Dans le cadre de cette spécialité, on considère comme « blessure » tout ce qui cause une altération au corps, depuis les maladies jusqu’aux fractures en passant par les plaies. |

## `TRUDVANG.Content.Ability.firstAidNursing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.firstAidNursing.Description` | The character has learned to tend wounds. Any injury treated immediately (within ten minutes) heals at a rate of 1 health point per specialty level, provided the treated injury actually caused that health loss. The character can care for the sick and wounded so they recover faster than normal — though this requires the patient to rest and receive the necessary treatment throughout the day. The healer must spend at least two hours per care attempt on a patient; a successful Skill roll means the patient heals twice as fast. | Le personnage a appris à soigner les blessures. Toute blessure qui est immédiatement prise en charge (dans les dix minutes) guérit au rythme de 1 point de santé par niveau de spécialité, si tant est que la blessure soignée a bien causé la perte de point de santé. Le personnage peut s’occuper des malades et des blessés de façon à leur permettre de guérir plus vite que la normale. Cependant, cela implique que le patient se repose et reçoive le traitement nécessaire au cours de la journée. Le soigneur doit passer au moins deux heures par tentative de soin sur un patient. Un jet de compétence réussi signifie que le patient guérit au double du rythme normal. |

## `TRUDVANG.Content.Ability.gambling`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.gambling.Description` | The person has learned to play cards, stone, dice, and other forms of gambling, which often results in profit. This discipline gives the person the knowledge to succeed at the most common and best-known games in Trudvang. When making a Skill roll involving gambling, the character can add +1 to their Skill Value. | Le personnage a appris à jouer aux cartes, pierres, dés et autres types de jeux d’argent, ce qui lui permet souvent de faire des profits. Cette discipline lui permet de savoir comment gagner aux jeux les plus courants et les plus connus de Trudvang. Lorsqu’il effectue un test de compétence dans le cadre d’un jeu d’argent, le personnage peut ajouter un modificateur de +1 par niveau à sa valeur de compétence. |

## `TRUDVANG.Content.Ability.cheater`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.cheater.Description` | The person has learned different tricks to cheat in games. Cheating consists of a positive modifier to the Skill roll’s Skill Value. The cheating player decides the size of the modifier, that is, how much they want to cheat (maximum modifier of +10). Upon a successful Skill roll, the game master determines whether the opponent discovers the cheat or not based on the circumstances, the situation, the opponent, and the cheater’s skill level. Opponents always get a chance to see through the cheat with a roll for the Shadow Arts skill (or the Gambling discipline or Cheater specialty , if those are higher). If the cheater’s Skill roll fails, the opponent gets the same positive modifier that the cheater used when trying to cheat. | Le personnage a appris différentes astuces pour tricher. Lorsqu’il y fait appel, il bénéficie d’un bonus à la VC de son test de compétence. Le joueur du tricheur décide de la valeur du modificateur, qui traduit à quel point le PJ triche (modificateur maximum de +10). Si le test de compétence réussit, le maître de jeu détermine si l’adversaire se rend compte de la tricherie ou pas selon les circonstances, la situation, l’adversaire et le niveau de compétence du tricheur. Les adversaires ont toujours la possibilité de se rendre compte de la tricherie en effectuant un test basé sur la compétence Arts des ombres (ou la discipline Jeux, ou la spécialité Tricheur si l’une ou l’autre sont plus élevées). Si le test de compétence échoue, l’adversaire bénéficie d’un bonus au test pour se rendre compte de la tricherie (comme évoqué ci-dessus), égal au bonus choisi par le joueur du personnage ayant voulu tricher. |

## `TRUDVANG.Content.Ability.gameStrategist`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.gameStrategist.Description` | The person is good at seeing the smartest moves in strategic games such as Koke’s Boxes, Bultconan, and Ship on Fire. The person can add +2 to their Skill Value in the ability when playing a strategic game of any kind. | Le personnage est doué pour savoir comment déplacer ses pions au mieux dans des jeux tels que les Boîtes de Koke, Bultconan ou encore Navire en feu. Il peut ajouter +2 par niveau à sa valeur de compétence lorsqu’il joue à un jeu de stratégie, quel qu’il soit. |

## `TRUDVANG.Content.Ability.greatGambler`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.greatGambler.Description` | The person is an accomplished gambler. They know how game rules work and how much and when to invest to win as much as possible. The person can add +2 to their Skill Value in the ability when playing games. The specialty is effective only if the game has a stake. | Le personnage est un joueur accompli. Il comprend le fonctionnement des règles de jeu, et sait combien et quand il doit miser pour maximiser son gain. Le personnage peut ajouter +2 par niveau à sa valeur de compétence lorsqu’il joue à des jeux. La spécialité n’a d’effet que s’il y a un enjeu. |

## `TRUDVANG.Content.Ability.musicDancing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.musicDancing.Description` | The discipline gives a person the ability to entertain others through music. The character can sing, dance, and play instruments, as well as use many narrative techniques. | Cette discipline permet à un personnage de distraire son entourage grâce à la musique. Il peut chanter, danser et jouer d’instruments, mais aussi faire appel à des techniques de narration. |

## `TRUDVANG.Content.Ability.dance`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.dance.Description` | The person knows how to dance. They can add +2 to their Skill Value in the skill when trying to capture an audience’s interest through dance. | Le personnage sait danser. Il peut ajouter +2 par niveau à sa valeur de compétence lorsqu’il essaie de capter l’attention du public en dansant. |

## `TRUDVANG.Content.Ability.singingPlayingInstruments`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.singingPlayingInstruments.Description` | The person has a good voice that can captivate an audience. The specialty also gives them the ability to play music on most of Trudvang’s instruments. They can add +2 to their Skill Value in the ability to sing or play instruments. This skill includes all kinds of entertainment. A person with this skill has learned the rules for gambling and social games and can take part in such activities. They can also sing common songs or tell of an event or legend with a skill great enough to spellbind an audience. The person can perform common dances and act or pretend to be others (which may include dressing up in costume to increase the authenticity of their acting). | Le personnage dispose d’une belle voix grâce à laquelle il peut captiver une audience. La spécialité lui donne également la capacité de jouer de la musique avec la plupart des instruments de Trudvang. Il peut ajouter +2 par niveau à sa valeur de compétence lorsqu’il chante ou joue d’un instrument. |

## `TRUDVANG.Content.Ability.storytelling`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.storytelling.Description` | The person has learned the art of storytelling. They know how to speak and act to evoke a certain mood among listeners and can, without much preparation, come up with a story about anything or tell epic legends. | Le personnage a appris l’art du conte. Il maîtrise l’art de la parole et sait poser une ambiance auprès de ceux qui l’écoutent. Sans véritable préparation, il est capable d’inventer une histoire à n’importe quel sujet ou de narrer des légendes épiques. |

## `TRUDVANG.Content.Ability.acting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.acting.Description` | The person has learned, through acting, to express feelings in such a poignant manner that every observer is able to understand what they feel. The person knows how to speak and act to elicit a specific mood. By speaking mournfully , they can make listeners gloomy , and by speaking inspiringly , they can rally others. | Le personnage a appris, grâce à l’art de la comédie, à exprimer des sentiments d’une façon tellement émouvante que chaque spectateur peut les ressentir à son tour. Il maîtrise le verbe et se comporte de façon à susciter une certaine humeur. En parlant avec tristesse, il peut rendre les spectateurs mélancoliques, et en parlant de façon inspirante, il peut les rassembler. |

## `TRUDVANG.Content.Ability.libel`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.libel.Description` | The person can tell a false and undermining story about someone. The speaker often uses a real event but twists it to make the victim look bad. By succeeding with libel, the speaker can make a crowd disapprove of the intended victim. | Le personnage est capable de raconter une histoire fausse et calomnieuse au sujet de quelqu’un. Il se base souvent sur des faits réels mais les transforme pour renvoyer une mauvaise image de sa victime. En réussissant son test de Calomnies, le personnage peut amener une foule à se dresser contre la personne visée. |

## `TRUDVANG.Content.Ability.godFocus`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.godFocus.Description` | This discipline represents a deep focus on the religious practices linked with invocation of divine powers. It helps the dimwalker with modifiers per level as follows: +1 on situation rolls to remain focused while distrurbed and -1 to rolls on the table for fatal failure. | Cette discipline consiste en une profonde concentration sur les pratiques religieuses liées à l’invocation des pouvoirs divins. Elle permet aux arpenteurs des brumes de bénéficier des modificateurs par niveau suivants : +1 aux tests de situation effectués pour rester concentré lorsqu’ils sont la cible d’une distraction, et -1 aux jets effectués sur la table de Magie funeste. |

## `TRUDVANG.Content.Ability.composed`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.composed.Description` | The dimwalker is rarely disturbed when invoking a divine feat and knows how to limit disasters. Anytime they must make a Situation roll to see if they’re disturbed enough to cancel the invocation is modified by +2 per level. When rolling on the Table for Fatal Failure subtract -2 per level of this specialty | L’arpenteur des brumes est rarement distrait lorsqu’il invoque un pouvoir divin, et il sait comment limiter les dégâts. À chaque fois qu’il doit effectuer un test de situation pour déterminer s’il est suffisamment distrait pour que l’invocation soit annulée, il bénéficie d’un modificateur de +2 par niveau. S’il doit faire un jet sur la table des échecs critiques, il bénéficie d’un modificateur de -2 par niveau dans cette spécialité. |

## `TRUDVANG.Content.Ability.lightningQuickInvocation`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.lightningQuickInvocation.Description` | The dimwalker has learned to invoke a divine feat extra quickly , which gives +2 per level on the initiative. | L’arpenteur des brumes a appris à invoquer un pouvoir divin très rapidement, ce qui lui donne un modificateur de +2 par niveau à l’initiative. |

## `TRUDVANG.Content.Ability.potent`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.potent.Description` | The dimwalker’s divine abilities are extra powerful. When a victim makes a Situation roll to avoid or stand up to a divine ability , the roll is modified by -2 per level due to the dimwalker’s force. | Les talents divins de l’arpenteur des brumes sont particulièrement forts. Lorsqu’une de ses victimes doit faire un test de situation pour éviter ou résister à un talent divin, elle subit un malus de -2 par niveau de la spécialité du fait de la force de l’arpenteur des brumes. |

## `TRUDVANG.Content.Ability.rigorous`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.rigorous.Description` | The faithful one knows how to spend power to increase the chances of success. By using extra Divinity Points during the summoning, the chance of success is increased. For each level of the specialty , the faithful one can use 2 Divinity Points to obtain a modifier of +1 on the Skill roll. Thus, a faithful one with level 3 in the specialty can transform 6 Divinity Points into a +3 on the Skill roll, and a faithful one with level 5 can transform 10 Divinity Points into a +5 on the roll. The faithful one decides how many Divinity Points to use, up to the amount allowed by the specialty level. | Le fidèle sait comment gérer ses pouvoirs pour augmenter ses chances de réussite. En utilisant des points de divinité supplémentaires durant l’invocation, les chances de réussite sont augmentées. Pour chaque niveau de la spécialité, le fidèle peut utiliser 2 points de divinité pour obtenir un modificateur de +1 à un test de compétence. Ainsi, un fidèle ayant former 6 points de divinité en un modificateur de +3 à un test de compétence, et un fidèle ayant un niveau 5 peut transformer 10 points de divinité en un modificateur de +5 sur un test. Le fidèle décide du nombre de points de divinité qu’il utilise dans la limite du nombre autorisé par le niveau de la spécialité. |

## `TRUDVANG.Content.Ability.divinePower`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.divinePower.Description` | This discipline gives the human dimwalker the ability to get power (in the form of Divinity Points from their deity) and thus greater divinity capacity. The sum of the discipline’s Divinity Points constitutes the dimwalker’s divinity capacity. Therefore, a dimwalker at first level has access to 3 more Divinity Points per day , while a dimwalker at fifth level has access to 15 more Divinity Points per day. By learning one or more levels of a specialty associated with this discipline, the dimwalker can increase their divinity capacity even further. Dwarves who acquire this discipline receive as many Divinity Points as humans, but since these are specifically tied to items, the points are consumed as soon as they are inserted into the object. | Niveau Cette discipline donne à l’arpenteur des brumes la capacité de recevoir des pouvoirs de sa divinité (sous forme de points de divinité) et ainsi une plus grande réserve divine. La somme des points de divinité de la discipline constitue la réserve divine de l’arpenteur des brumes. Ainsi, un arpenteur des brumes ayant le premier niveau de la discipline gagne 3 points de divinité supplémentaires par jour, tandis qu’un arpenteur des brumes ayant le cinquième niveau reçoit 15 points de divinité supplémentaires par jour. En apprenant des niveaux dans une spécialité associée à cette discipline, le personnage peut encore augmenter sa réserve divine. Les nains qui acquièrent cette discipline reçoivent autant de points de divinité que les autres arpenteurs des brumes, mais ceux-ci étant spécifiquement liés à des objets, les points sont consommés aussitôt qu’ils sont sertis dans l’objet. |

## `TRUDVANG.Content.Ability.faithful`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.faithful.Description` | level The faithful one has delved deeply into religion and gains a further +7 Divinity Points per level to their divinity capacity. Dwarves get +7 Divinity Points per level to insert into an object. | Niveau Le fidèle s’est plongé profondément dans la religion et augmente sa réserve divine de 7 points de divinité supplémentaires par niveau. Les nains obtiennent 7 points de divinité supplémentaires par niveau à sertir dans un objet. |

## `TRUDVANG.Content.Ability.powerful`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.powerful.Description` | level The dimwalker has learned to draw extra power from the divine source and adds +7 Divinity Points per level to their divinity capacity. Dwarves get +7 Divinity Points per level to insert into an object. | Niveau L’arpenteur des brumes a appris à tirer plus de pouvoir de la source divine et ajoute 7 points de divinité par niveau à sa réserve divine. Les nains obtiennent 7 points de divinité par niveau qu’ils peuvent sertir dans un objet. |

## `TRUDVANG.Content.Ability.invoke`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.invoke.Description` | This discipline gives the faithful the ability to call on their religion’s divine powers using Holy Tablets (sets of divine abilities). To be able to invoke a divine power, the faithful must also learn one of the Stormkelt The dimwalker has chosen to indulge in the religion of Gerbanis and can learn to invoke the gods to activate supernatural powers. By obtaining the Holy Tablet (Gerbanis) specialty , the dimwalker can activate the divine powers in the learned Holy Tablet. The specialty provides +2 in Skill Value for performing blood gifting, which in turn gives the Stormkelt additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. Holy Tablet (Selected Tablet) The faithful learns a Holy Tablet’s divine abilities in a specific Holy Tablet associated with their religion. Each cult has its own prerequisites for allowing access to Holy Tablets. The details are explained in Dimwalkers. By learning this specialty , the faithful can invoke any divine feat that exists under the selected Holy Tablet at that level. Each new level of the specialty provides all the divine abilities included in the Tablet’s new level and in all the previous levels. For example, a faithful who learned the third level of the Holy Tablet (Power of Enken) specialty may invoke the divine feats that belong to the first three levels. | Cette discipline donne au fidèle la capacité de faire appel aux pouvoirs divins de sa religion en utilisant des Tablettes sacrées (groupes de talents divins). Pour pouvoir invoquer un pouvoir divin, le fidèle doit aussi apprendre l’une des spécialités (Bruide, Gavlien, Noaj ou Stormikjalt) et au moins une Tablette sacrée. Les nains doivent apprendre la spécialité Forgeage Thuul et au moins une Tablette sacrée, et les elfes doivent apprendre la spécialité Ihana et au moins une Tablette sacrée. Un personnage ne peut invoquer que les pouvoirs divins liés à sa propre race. Pour les sangs-mêlés, il revient au maître de jeu de décider si le personnage peut invoquer des pouvoirs divins ou pas, et si c’est le cas, la race dont les dieux sont impliqués. La discipline donne également au fidèle la capacité d’effectuer différents rituels selon sa religion, et de faire appel à des points de divinité supplémentaires (mais temporaires). Ces points de divinité supplémentaires disparaissent au rythme de 1 point par jour. Les fidèles ne peuvent pas effectuer un autre rituel tant que ces points de divinité temporaires n’ont pas disparu, soit par épuisement naturel, soit en étant utilisés pour invoquer un pouvoir divin. L’arpenteur des brumes a choisi d’adhérer à une religion spécifique et peut apprendre à invoquer ses différents aspects pour utiliser des pouvoirs surnaturels. En acquérant la spécialité Tablette sacrée, l’arpenteur des brumes peut faire appel aux talents divins appartenant à la Tablette sacrée. Cette spécialité lui accorde un modificateur de +2 par niveau à la valeur de compétence lorsqu’il réalise la tâche décrite dans la table ci-dessous, qui à son tour lui accorde des points de divinité temporaires supplémentaires. En choisissant une religion spécifique comme spécialité, un personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.bruid`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.bruid.Description` | The dimwalker has chosen to indulge in the religion of the Eald Tradition and can learn to invoke the Flowras and their ancestors to activate supernatural powers. By acquiring the Holy Tablet (the Eald Tradition) specialty , the dimwalker can activate the divine abilities in the learned Holy Tablet. The specialty provides +2 in Skill Value per level for performing blood oaths, which in turn give the bruid additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. | L’arpenteur des brumes a choisi de se consacrer à la religion de l’Ancienne tradition et peut apprendre à invoquer les Flowras et ses ancêtres pour accéder à des pouvoirs surnaturels. En acquérant la spécialité Tablette sacrée (Ancienne tradition), l’arpenteur des brumes peut accéder aux talents divins de la Tablette sacrée apprise. Cette spécialité accorde un modificateur de +2 par niveau à la valeur de compétence pour réaliser des serments de sang, qui accordent au bruide des points de divinité temporaires supplémentaires. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.gavlian`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.gavlian.Description` | The dimwalker has chosen to indulge in the religion of the Tenet of Nid and can learn to invoke the god Gave to activate supernatural powers. By getting the Holy Tablet (the Tenet of Nid) specialty , the dimwalker can activate the divine powers of the learned Holy Tablet. The specialty provides +2 in Skill Value per level for performing prayers, which in turn provides the gavlian with additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. | L’arpenteur des brumes a choisi de se consacrer à la religion de la Doctrine de Nid et peut apprendre à invoquer le dieu Gave pour accéder à des pouvoirs surnaturels. En acquérant la spécialité Tablette sacrée (Doctrine de Nid), l’arpenteur des brumes peut accéder aux talents divins de la Tablette sacrée apprise. Cette spécialité accorde un modificateur de +2 par niveau à la valeur de compétence pour effectuer des prières, qui accordent au gavlien des points de divinité temporaires supplémentaires. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.ihana`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.ihana.Description` | The elf has chosen to indulge in the religion of Toikalokke and can learn to decipher the stars through which to activate the elven divine abilities. By getting the Holy Tablet (Toikalokke) specialty , the faithful can invoke the godly powers in that Holy Tablet. The specialty provides +2 in Skill Value per level for performing stargazing, which in turn provides the Ihana with additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. | L’elfe a choisi de se consacrer à la religion Toikalokke et peut apprendre à lire les étoiles au travers desquelles il peut accéder aux talents divins elfiques. En acquérant la spécialité Tablette sacrée (Toikalokke), le fidèle peut invoquer les pouvoirs divins de la Tablette sacrée. Cette spécialité accorde un modificateur de +2 par niveau à la valeur de compétence pour observer les étoiles, qui accordent à l’ihana des points de divinité temporaires supplémentaires. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.noaj`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.noaj.Description` | The dimwalker has chosen to indulge in the religion of Haminges and can learn to invoke the spirits to activate supernatural powers. By obtaining the Holy Tablet (Haminges) specialty , the dimwalker can activate the divine powers of the learned Holy Tablet. The specialty provides +2 Skill Value per level for stealing their victims’ spirits, which in turn provides the Noaj with additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. | L’arpenteur des brumes a choisi de se consacrer à la religion d’Haminges et peut apprendre à invoquer les esprits pour accéder à des pouvoirs surnaturels. En acquérant la spécialité Tablette sacrée (Haminges), l’arpenteur des brumes peut accéder aux talents divins de la Tablette sacrée apprise. Cette spécialité lui accorde un modificateur de +2 par niveau à la valeur de compétence pour voler les âmes de ses victimes, qui accordent au noaj des points de divinité temporaires supplémentaires. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.thuulForging`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.thuulForging.Description` | The dwarf has chosen to indulge in the mountain’s ancient power and the holy Thuuldom, and can learn to create rune-inscribed objects through which to activate the mountain’s forces. By obtaining the Holy Tablet (Thuuldom) specialty , the dimwalker can activate the runes found in the learned Holy Tablet. The specialty gives +2 in Skill Value per level for creating items and runes and inserting Divinity Points in the runes. | Le nain a choisi de se consacrer aux anciennes puissances de la montagne et au Thuuldom sacré, et peut apprendre à créer des objets gravés de runes grâce auxquelles il peut faire appel aux forces de la montagne. En acquérant la spécialité Tablette sacrée (Thuuldom), l’arpenteur des brumes peut utiliser les runes découvertes grâce à la Tablette sacrée. Cette spécialité accorde un modificateur de +2 par niveau à la valeur de compétence pour créer des objets et des runes, et sertir des points de divinité dans les runes. Le Forgeage Thuul est simplement un terme générique pour désigner la capacité des nains à donner vie aux esprits des montagnes par l’intermédiaire de matériaux provenant des montagnes. Les thuuls n’ont pas toujours besoin de forger le métal et peuvent également créer des objets avec des matériaux tels que le granite ou des pierres précieuses. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.stormkelt`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.stormkelt.Description` | The dimwalker has chosen to indulge in the religion of Gerbanis and can learn to invoke the gods to activate supernatural powers. By obtaining the Holy Tablet (Gerbanis) specialty , the dimwalker can activate the divine powers in the learned Holy Tablet. The specialty provides +2 in Skill Value for performing blood gifting, which in turn gives the Stormkelt additional temporary Divinity Points. By choosing this specialty , the character forfeits the opportunity to acquire any of the specialties of other religions. Holy Tablet (Selected Tablet) The faithful learns a Holy Tablet’s divine abilities in a specific Holy Tablet associated with their religion. Each cult has its own prerequisites for allowing access to Holy Tablets. The details are explained in Dimwalkers. By learning this specialty , the faithful can invoke any divine feat that exists under the selected Holy Tablet at that level. Each new level of the specialty provides all the divine abilities included in the Tablet’s new level and in all the previous levels. For example, a faithful who learned the third level of the Holy Tablet (Power of Enken) specialty may invoke the divine feats that belong to the first three levels. | L’arpenteur des brumes a choisi de se consacrer à la religion de Gerbanis et peut apprendre à invoquer les dieux pour accéder à des pouvoirs surnaturels. En acquérant la spécialité Tablette sacrée (Gerbanis), l’arpenteur des brumes peut accéder aux talents divins de la Tablette sacrée apprise. Cette spécialité lui accorde un modificateur de +2 par niveau à la valeur de compétence pour réaliser des offrandes de sang, qui donnent au stormikjalt des points de divinité temporaires supplémentaires. En choisissant cette spécialité, le personnage renonce à la possibilité d’acquérir les spécialités des autres religions. |

## `TRUDVANG.Content.Ability.armedFighting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.armedFighting.Description` | The person knows how to fight with weapons of all kinds. This includes ranged weapons as well as melee weapons and shields. | Le personnage sait se battre avec toutes sortes d’armes. Cela comprend aussi bien les armes à distance que les armes de corps à corps et les boucliers. |

## `TRUDVANG.Content.Ability.oneHandedLightWeapons`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.oneHandedLightWeapons.Description` | This specialty develops the character’s ability to use light weapons held with one hand, such as a dagger or a club. The character gains +2 per level in Skill Value when using one-handed light weapons. The specialty , however, is tied to the right or left hand. If the character wants to use one-handed light weapons in each hand, they must learn the specialty twice, once for each hand. | Cette spécialité développe la capacité du personnage à utiliser des armes légères tenues à une main, telles que la dague ou la massue. Le personnage gagne +2 par niveau à la valeur de compétence lorsqu’il utilise une arme légère à une main. Toutefois, cette spécialité est liée soit à la main droite, soit à la main gauche. Si le personnage veut utiliser une arme légère à une main dans chaque main, il doit apprendre la spécialité deux fois, une pour chaque main. |

## `TRUDVANG.Content.Ability.oneHandedHeavyWeapons`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.oneHandedHeavyWeapons.Description` | This specialty develops the character’s ability to use heavy weapons held in one hand, such as arming swords or battle axes. The character gains +2 per level in Skill Value when using one-handed heavy weapons. The specialty , however, is tied to the right or left hand. If the character wants to use one-handed heavy weapons in each hand, they must learn the specialty twice, once for each hand. | Cette spécialité développe la capacité du personnage à utiliser des armes lourdes tenues à une main, telles que les épées ou les haches de bataille. Il gagne un modificateur de +2 par niveau à la valeur de compétence lorsqu’il utilise une arme lourde à une main. Toutefois, cette spécialité est liée soit à la main droite, soit à la main gauche. Si le personnage veut utiliser une arme lourde à une main dans chaque main, il doit apprendre la spécialité deux fois, une pour chaque main. |

## `TRUDVANG.Content.Ability.throwingWeapons`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.throwingWeapons.Description` | This specialty develops a character’s ability to throw weapons with fatal accuracy. The specialty applies only to weapons suited for this purpose, such as throwing knives, throwing axes, and stones. The character gets +2 per level in Skill Value when throwing weapons. The specialty is tied to the right or left hand, just like the one-handed heavy or light weapons. If the character wants to throw weapons with both hands, they must learn the specialty twice, once for each hand. | Cette spécialité développe la capacité d’un personnage à lancer des armes avec une précision mortelle. La spécialité ne s’applique qu’aux armes adaptées à cet usage, telles que les couteaux de lancer, les haches de lancer et les pierres. Le personnage bénéficie d’un bonus de +2 par niveau à sa valeur de compétence lorsqu’il lance des armes. Cette spécialité est liée soit à la main droite, soit à la main gauche, comme celle des armes légères ou lourdes à une main. Si le personnage veut lancer des armes avec ses deux mains, il doit apprendre la spécialité deux fois, une pour chaque main. |

## `TRUDVANG.Content.Ability.shieldBearer`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.shieldBearer.Description` | The shield bearer has learned the art of using a shield in battle, gaining 2 extra Combat Points per level to distribute among parries made with the shield — points usable only when parrying with it. Characters with Shield Bearer also ignore the usual -15 penalty for actions performed with the shield hand (this exception applies only while the character is using a shield). | Le porteur de bouclier a appris l’art d’utiliser un bouclier au combat. Grâce à cette connaissance, il bénéficie de 2 points de combat supplémentaires par niveau qu’il peut répartir entre ses parades réalisées avec le bouclier. Ces points de combat ne peuvent être utilisés que lorsque le personnage pare avec son bouclier. Les personnages ayant la spécialité Porteur de bouclier ne subissent pas le malus habituel de -15 dû aux actions réalisées avec la main de bouclier (cette exception ne s’applique que lorsque le personnage utilise un bouclier). |

## `TRUDVANG.Content.Ability.twoHandedWeapons`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.twoHandedWeapons.Description` | This specialty develops the character’s ability to use two-handed weapons, such as a two-handed sword or axe. The character gains +2 per level in Skill Value when using two-handed weapons. character also receives an extra weapon action per round. Thus, instead of the usual two weapon actions per round, they could perform three (at levels 3 and 4) or four (at level 5) weapon actions per combat round with a two-handed weapon. | Cette spécialité développe la capacité du personnage à utiliser des armes à deux mains, telles que les épées ou les haches à deux mains. Il gagne un modificateur de +2 par niveau à la valeur de compétence lorsqu’il utilise des armes à deux mains. Aux niveaux 3 et 5 de cette spécialité, le personnage reçoit également une action d’arme supplémentaire par tour. Ainsi, au lieu des deux actions d’arme habituelles par tour de combat, il peut en réaliser trois (aux niveaux 3 et 4) ou quatre (au niveau 5) avec une arme à deux mains. |

## `TRUDVANG.Content.Ability.crossbow`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.crossbow.Description` | This specialty develops the character’s ability to use crossbows. The character gains +2 per level in Skill Value on attacks made with crossbows. | Cette spécialité développe la capacité du personnage à utiliser des arbalètes. Il gagne un modificateur de +2 par niveau à la valeur de compétence lorsqu’il tire avec une arbalète. |

## `TRUDVANG.Content.Ability.bowsSlings`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.bowsSlings.Description` | This specialty develops the character’s ability to use bows and slings. The character gains +2 per level in Skill Value when using a bow or a sling. | Cette spécialité développe la capacité du personnage à utiliser des arcs et des frondes. Il gagne un modificateur de +2 par niveau à la valeur de compétence lorsqu’il utilise un arc ou une fronde. |

## `TRUDVANG.Content.Ability.unarmedFighting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.unarmedFighting.Description` | The Unarmed Fighting discipline teaches a person to battle without weapons. The character receives +2 Combat Points per level from this discipline to use when performing the acts that the following specialties describe. | La discipline Combat à mains nues enseigne à un personnage à se battre sans arme. Grâce à cette discipline, il reçoit 1 point de combat par niveau qu’il peut utiliser pour effectuer des actions décrites par les spécialités ci-dessous. |

## `TRUDVANG.Content.Ability.brawling`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.brawling.Description` | The character has learned to punch and kick hard, but also to defend against both armed and unarmed attacks using just their body. The character receives +2 Combat Points per level in the specialty to distribute on their punches, kicks, and unarmed parries. | Le personnage a appris à donner des coups de poing et de pied puissants, mais aussi à se défendre contre les attaques aussi bien armées qu’à mains nues, simplement en utilisant son corps. Il bénéficie de 2 points de combat supplémentaires par niveau dans la spécialité qu’il peut répartir entre ses coups de poing ou de pied et ses parades à mains nues. |

## `TRUDVANG.Content.Ability.wrestling`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.wrestling.Description` | The character has learned to wrestle and perform combat actions such as grapple and glima. The character receives +2 Combat Points per level when using grapple and glima in combat actions. The specialty’s Combat Points can be used only in Wrestling. parries). The specialty gives +2 Combat Points per level. These points can be used only for actions related to a person’s role in combat, such as drawing weapons, standing up, or performing combat movement. | Le personnage a appris la lutte et à réaliser des actions de combat telles que la saisie ou la glima (projection au sol). Il bénéficie de 2 points de combat supplémentaires par niveau lorsqu’il effectue une saisie ou une glima au cours d’une action de combat. Les points de combat de la spécialité ne peuvent être utilisés qu’au cours d’une lutte. |

## `TRUDVANG.Content.Ability.battleExperience`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.battleExperience.Description` | Having taken part in many battles, the character has learned to react, fight and attempt risky maneuvers. They receive 1 extra Combat Point per level to assign to their combat actions during a combat round, plus a +1 per level bonus to combat initiative. | Le personnage a participé à de nombreux combats et a appris à réagir, se battre et tenter des manœuvres risquées. Il reçoit 1 point de combat supplémentaire par niveau qu’il peut attribuer à ses actions de combat au cours d’un tour de combat. Le personnage reçoit également un bonus de +1 par niveau à l’initiative en combat. |

## `TRUDVANG.Content.Ability.armorBearer`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.armorBearer.Description` | The person has learned to wear armor in battle, allowing armor with Heft Value of 2 per level of the specialty. For example, a person with level 3 can wear armor with a Heft Value of up to 6. | Le personnage a appris à porter une armure au combat, ce qui lui permet de porter une armure avec une valeur d’encombrement de 2 par niveau dans cette spécialité. Par exemple, une personne ayant le niveau 3 peut porter une armure ayant une valeur d’encombrement de 6 ou moins. |

## `TRUDVANG.Content.Ability.combatActions`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.combatActions.Description` | This specialty allows a person to perform combat actions almost effortlessly in battle (this does not apply to attacks or Bribery The person has learned to gauge how people react to bribes. The person quickly discovers whether someone can be bribed, and if so, they know how it should be delivered and how much is necessary. By using this specialty , the person can add +2 to their Skill Value per level when trying to bribe someone. | Cette spécialité permet à un personnage de réaliser des actions de combat presque sans effort (ne s’applique pas aux attaques ou aux parades). Elle accorde 2 points de combat supplémentaires par niveau. Ces points ne peuvent être utilisés que pour des actions liées au positionnement du personnage dans le combat, par exemple dégainer une arme, se relever ou effectuer un mouvement de combat. |

## `TRUDVANG.Content.Ability.combatReaction`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.combatReaction.Description` | The person has learned to react quickly in battle. The specialty gives the person +2 per level in initiative in combat. | Le personnage a appris à réagir rapidement durant un combat. Cette spécialité lui accorde un bonus de +2 par niveau à l’initiative au combat. |

## `TRUDVANG.Content.Ability.crossbowLoader`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.crossbowLoader.Description` | The Crossbow loader specialty lets the person load their crossbow faster. The loading time for a crossbow is reduced by -1 per level, but never lower than 1 in a combat round. and to attemt risky things. They receive an additional +1 Combat Point per level to distribute on their combat actions during an action round. The person also gets +1 per level in initiative in combat. | La spécialité Chargeur d’arbalète permet au personnage de charger son arbalète plus rapidement. Le temps de chargement d’une arbalète est réduit de 1 par niveau, pour un minimum de 1 au cours d’un tour de combat. |

## `TRUDVANG.Content.Ability.fighter`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.fighter.Description` | The person has been in battle many times and learned how to attack and defend. They receive an additional +2 Combat Points per level to distribute on their attacks and parries during a combat round. | Le personnage a participé à de nombreux combats et a appris à attaquer et à se défendre. Il reçoit un bonus supplémentaire de 2 points de combat par niveau à répartir entre ses attaques et parades au cours d’un tour de combat. |

## `TRUDVANG.Content.Ability.cultureKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.cultureKnowledge.Description` | This discipline covers most things that have to do with a race’s culture, religion, history , and legends. The person is familiar with the culture’s way of life, feasts, laws, and background. A character has level 1 of the discipline as a base (for the culture they originate from). Stormlanders, Mittlanders, Viranns, Wildfolks, Dwarves, and Elves, all have their own cultures. | Cette discipline recouvre la plupart des choses qui ont un rapport avec la culture, la religion, l’histoire et les légendes d’une race. Le personnage est familier avec le mode de vie de la culture, ses fêtes, ses lois et son contexte général. De base, le personnage a le niveau 1 dans cette discipline (pour sa culture d’origine). Les Stormlanders, Mittlanders, Viranns, Sauvages, nains et elfes ont chacun leur propre culture. |

## `TRUDVANG.Content.Ability.customsLaw`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.customsLaw.Description` | (Specification Required) The person knows all about a culture’s laws and legal systems, customs, gestures, taboos, food habits, rules of conduct, typical dress, and housing, as well as their common attributes, personalities, and appearances. The person can add +2 to their Skill Value per level when trying to learn about a people’s customs. The specialty focuses on a single culture: Stormlanders, Mittlanders, Viranns, Wildfolks, Dwarves, or Elves. | Le personnage sait tout ce qu’il y a à savoir sur les lois et le système légal d’une culture, sur ses coutumes, ses gestuelles, ses tabous, ses habitudes alimentaires, ses codes de conduite, ses vêtements typiques et ses logements, ainsi que sur ses caractéristiques communes, ses personnalités et son apparence. Le personnage peut ajouter +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer s’il sait quelque chose sur les coutumes d’un peuple. La spécialité est centrée sur une seule culture : les Stormlanders, les Mittlanders, les Viranns, les Sauvages, les nains ou les elfes. |

## `TRUDVANG.Content.Ability.loreLegends`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.loreLegends.Description` | (Specification Required) The person knows a lot about a certain culture’s history , myths, and legends. each for a different foreign language. A character must have the Foreign Tongues specialty for the selected language before they can learn to read and write it. | Le personnage en sait beaucoup sur l’histoire, les mythes et les légendes d’une culture. Il bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer s’il sait quelque chose sur l’histoire de la race choisie. La spécialité est centrée sur une seule culture : les Stormlanders, les Mittlanders, les Viranns, les Sauvages, les nains ou les elfes. |

## `TRUDVANG.Content.Ability.religion`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.religion.Description` | This specialty tells how a culture’s religion works. What gods exist, and what do they stand for? How do the faithful live? What are their feasts? What is the religion’s history? All these questions can be answered with a successful Skill roll. The person can add +2 to their Skill Value per level when trying to learn about a people’s language (d) The Language discipline develops the character’s ability to express themselves in a specific language (which would be their Mother Tongue before they learn more languages). Vrok, which is the more widespread of the two human languages, is spoken by people in Nhoordland, in the Stormlands, and in parts of Mittland and Soj. Rona, the other human language, is spoken in Westmark, Soj, and parts of Mittland. Human characters from Mittland may choose which language they speak, with approval from the game master. If the character is a supporter of the Tenet of Nid, however, they should always speak Rona. In addition, there are other languages such as Eika (spoken by elves), Futhark (spoken by dwarves), and Bastjumal (spoken by trolls and giants). A character cannot read or write until they acquire the Reading and Writing specialty. | Cette spécialité permet de savoir comment fonctionne la religion d’une culture. Quels sont ses dieux et que représentent-ils ? Comment vivent les fidèles ? Quelles sont leurs fêtes ? Quelle est l’histoire de la religion ? Toutes ces questions trouvent une réponse sur un test de compétence réussi. Le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer s’il sait quelque chose sur la religion d’un peuple. La spécialité est centrée sur une seule culture : les Stormlanders, les Mittlanders, les Viranns, les Sauvages, les nains ou les elfes. |

## `TRUDVANG.Content.Ability.learning`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.learning.Description` | The Learning discipline gives a person education and extensive knowledge involving a specific subject of their choosing. In principle, this can be anything: swords, literature, kings, demons, symbols, or whatever is desired. The discipline involves an infinite number of specialties where each specialty is a specific subject. The SV modifier given by the discipline applies only to specialties that the person has learned. The Geography discipline and its specialties under the Wilderness skill could be a theoretical knowledge skill. In other words, the person studied the subject but did not experience it. | La discipline Apprentissage donne au personnage une éducation et une connaissance étendue concernant un sujet spécifique de son choix. En principe, il peut s’agir de n’importe quel sujet : épées, littérature, rois, démons, symboles, ou tout autre sujet intéressant le personnage. La discipline est associée à une infinité de spécialités, chaque spécialité couvrant un sujet spécifique. Le modificateur à la VC provenant de la discipline ne s’applique qu’aux spécialités apprises par le personnage. La discipline Géographie et ses spécialités, rattachées à la compétence Nature, pourraient constituer une compétence théorique de Connaissances. Autrement dit, le personnage a étudié le sujet mais n’en a pas d’expérience pratique. |

## `TRUDVANG.Content.Ability.insight`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.insight.Description` | The person knows a lot about a particular chosen subject. The person can add +2 to their Skill Value per level when trying to learn about the chosen subject. | Le personnage sait beaucoup de choses sur un sujet spécifique de son choix. Il bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer ce qu’il sait sur le sujet choisi. |

## `TRUDVANG.Content.Ability.raceKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.raceKnowledge.Description` | This discipline gives a person knowledge about Trudvang’s different and exotic races such as trollkin, wyrms ( dragonbeasts), serguronts (ancient spirits), and salhele (undead). The person knows their ideologies, governance, lifestyle, fears, strengths, weaknesses, and more. The person can add +1 to their Skill Value per level when trying to learn about Trudvang’s residents. | Cette discipline donne à un personnage la connaissance des différentes races exotiques de Trudvang telles que les différentes espèces de trolls, les wurms (ou dragons), les serguronts (anciens esprits) et les salhele (morts-vivants). Il connaît leur façon de penser, leur organisation hiérarchique, leur mode de vie, leurs peurs, leurs forces et faiblesses, et plus encore. Le personnage bénéficie d’un modificateur de +1 par niveau à sa valeur de compétence lorsqu’il essaie de déterminer ce qu’il sait sur des créatures de Trudvang. |

## `TRUDVANG.Content.Ability.monsterLore`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.monsterLore.Description` | The specialty gives a person extra knowledge about Trudvang’s beasts that are considered to be more than just animals, such as trolls, jotuns, tursirs (giants), wurms (dragons), and other intelligent creatures. The person knows their ideologies, governance, lifestyle, fears, strengths, weaknesses, and more. The person can add +2 to their Skill Value per level when trying to learn about these types of creatures. | Cette spécialité donne à un personnage des connaissances supplémentaires sur les créatures de Trudvang qui sont considérées comme étant plus que de simples animaux, comme les trolls, les jotuns, les tursirs (géants), les wurms (dragons) et d’autres créatures intelligentes. Il connaît leur façon de penser, leur organisation hiérarchique, leur mode de vie, leurs peurs, leurs forces et faiblesses, et plus encore. Le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie de déterminer ce qu’il sait sur ce type de créatures. |

## `TRUDVANG.Content.Ability.spiritLore`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.spiritLore.Description` | The specialty gives a person extra knowledge about the undead, spirits, mist creatures, demons, and similar entities. The person knows their ideologies, governance, lifestyle, fears, strengths, weaknesses, and more. The person can add +2 to their Skill Value per level when trying to learn about these types of creatures. | Cette spécialité donne à un personnage des connaissances supplémentaires sur les morts-vivants, les esprits, les créatures des brumes, les démons et autres entités similaires. Il connaît leur façon de penser, leur organisation hiérarchique, leur mode de vie, leurs peurs, leurs forces et faiblesses, et plus encore. Le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie de déterminer ce qu’il sait sur ce type de créatures. |

## `TRUDVANG.Content.Ability.language`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.language.Description` | The Language discipline develops the character’s ability to express themselves in a specific language (which would be their Mother Tongue before they learn more languages). Vrok, which is the more widespread of the two human languages, is spoken by people in Nhoordland, in the Stormlands, and in parts of Mittland and Soj. Rona, the other human language, is spoken in Westmark, Soj, and parts of Mittland. Human characters from Mittland may choose which language they speak, with approval from the game master. If the character is a supporter of the Tenet of Nid, however, they should always speak Rona. In addition, there are other languages such as Eika (spoken by elves), Futhark (spoken by dwarves), and Bastjumal (spoken by trolls and giants). A character cannot read or write until they acquire the Reading and Writing specialty. | La discipline Langage développe la capacité d’un personnage à s’exprimer dans une langue spécifique (qui est sa langue maternelle avant qu’il n’apprenne d’autres langues). Le vrok, qui est la plus répandue des deux langues humaines, est parlé par les habitants du Nhoordland, dans les Stormländer et dans certaines régions du Mittland et de Soj. Le rona, l’autre langue humaine, est parlé au Vastermark, en Soj et dans certaines régions du Mittland. Des personnages humains originaires du Mittland peuvent choisir la langue qu’ils parlent avec l’approbation du maître de jeu. Cependant, si le personnage est un partisan de la Doctrine de Nid, il devra forcément parler le rona. Il existe aussi d’autres langues telles que l’eika (parlée par les elfes), le futhark (parlé par les nains) et le bastjumal (parlé par les trolls et les géants). Un personnage ne sait pas lire ou écrire à moins d’acquérir la spécialité Lire et écrire. |

## `TRUDVANG.Content.Ability.bribery`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.bribery.Description` | The person has learned to gauge how people react to bribes. The person quickly discovers whether someone can be bribed, and if so, they know how it should be delivered and how much is necessary. By using this specialty , the person can add +2 to their Skill Value per level when trying to bribe someone. | Le personnage a appris à évaluer la façon dont les personnes réagissent à la corruption. Il se rend rapidement compte si quelqu’un peut être corrompu, et si c’est le cas, il sait de quelle façon et dans quelle mesure. En faisant appel à cette spécialité, le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie de corrompre quelqu’un. |

## `TRUDVANG.Content.Ability.calculate`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.calculate.Description` | The person has learned to make difficult calculations and solve mathematical problems using addition, subtraction, multiplication, and percentages. The person can add +2 to their Skill Value per level when trying to make a calculation of some sort. | Le personnage a appris à réaliser des calculs difficiles et à résoudre des problèmes mathématiques en faisant des additions, des soustractions, des multiplications et des divisions. Il bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie d’effectuer un calcul. |

## `TRUDVANG.Content.Ability.foreignTongue`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.foreignTongue.Description` | This specialty can be purchased multiple times, each for a different foreign language. Some languages are harder to learn than others and therefore have a requirement that the character achieve a certain level of the Languages discipline, even for the first level of this specialty. | Cette spécialité peut être acquise plusieurs fois, une fois pour chaque langue étrangère. Certaines langues sont plus compliquées à apprendre que d’autres, et ont donc un prérequis concernant le niveau de la discipline Langage, même pour le premier niveau de cette spécialité (cf. la table Langues parlées ci-dessus). |

## `TRUDVANG.Content.Ability.motherTongue`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.motherTongue.Description` | All characters speak their Mother Tongue fluently (Mother Tongue specialty level 3). | Tous les personnages parlent leur langue maternelle couramment (spécialité Langue maternelle au niveau 3). |

## `TRUDVANG.Content.Ability.readWrite`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.readWrite.Description` | ( Specification Required) This specialty enables a person to read and write texts in the selected language. It can be purchased multiple times, They can add +2 to their Skill Value per level when trying to learn about the chosen race’s history. The specialty focuses on a single culture: Stormlanders, Mittlanders, Viranns, Wildfolks, Dwarves, and Elves. | Calcul Le personnage a appris à réaliser des calculs difficiles et à résoudre des problèmes mathématiques en faisant des additions, des soustractions, des multiplications et des divisions. Il bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie d’effectuer un calcul. |

## `TRUDVANG.Content.Ability.silvertongue`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.silvertongue.Description` | The Silvertongue specialty allows a person to speak with formal and technical words in complex sentences. The person has also learned to quickly and convincingly fabricate an untruth, whether great or small. The person can add +2 to their Skill Value per level when making a Skill roll to determine success when lying or using eloquence for something such as persuasion. | La spécialité Éloquence et baratin permet à un personnage de parler en utilisant des mots formels et techniques dans des phrases complexes. Il a appris à inventer rapidement et de façon convaincante des mensonges, grands ou petits. Le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit effectuer un test de compétence pour déterminer sa réussite lorsqu’il ment ou fait preuve d’éloquence pour persuader son auditoire. |

## `TRUDVANG.Content.Ability.shadowing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.shadowing.Description` | The Shadowing discipline is used when a person wants to go unnoticed, sneak up on someone, hide, or get someone to look the other way. The Discipline includes also the spottiing or finding of hidden things | La discipline Discrétion est utilisée lorsqu’un personnage souhaite se déplacer sans être remarqué, s’approcher furtivement de quelqu’un, se dissimuler ou amener quelqu’un à regarder ailleurs. Elle inclut aussi la détection et la découverte d’objets cachés. |

## `TRUDVANG.Content.Ability.camouflageHiding`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.camouflageHiding.Description` | The person knows how to make an object blend into the surroundings and thus become more difficult to detect. This specialty includes not only large objects such as a tent, a rowboat, or a wagon, but Stealing The person has learned the basics of stealing items from other people and can add +2 to their Skill Value per level in the ability. People present when the theft occurs are allowed to make a specific Situation roll decided by the GM or a Shadows Arts (Finding and Spotting) Skill roll to try to discover or notice the theft. | Le personnage sait comment faire en sorte qu’un objet se fonde dans son environnement et devienne ainsi plus difficile à remarquer. Cette spécialité comprend aussi bien des objets de grande taille, tels qu’une tente, un canot ou un chariot, que des objets plus petits comme des pièges, des coffres, des épées et des livres. Elle permet aussi de se cacher soi-même ou de dissimuler d’autres personnes. Camouflage est principalement utilisé dans les grands espaces où le personnage peut profiter des éléments du paysage comme les hautes herbes, les bosquets et les arbres, mais cette spécialité peut aussi servir dans des environnements tels que les grottes et les pièces. |

## `TRUDVANG.Content.Ability.findingSpotting`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.findingSpotting.Description` | This specialty gives the person the ability to notice hidden things, such as people and creatures that are hiding or sneaking, but also things that are cleverly concealed in objects, buildings, or terrain. The person develops a trained eye to spot what is hidden beyond the first glance. Examples include a hidden poison thorn in a drawer, a stashed object, a trap in the floor or the ground, a secret door in the wall, and so on. This specialty may allow spotting rolls even when one is not actively searching. The GM decides whether it is the case or not. | Cette spécialité donne à un personnage la capacité de remarquer ce qui n’est pas apparent, comme des personnes ou des créatures qui se cachent ou se faufilent discrètement, mais aussi des choses habilement dissimulées dans des objets, des bâtiments ou dans le paysage. Le personnage s’est exercé pour dépasser la première impression afin de détecter ce qui est caché. Par exemple, une épine empoisonnée dans un tiroir, un objet dissimulé, un plancher ou un sol piégé, une porte secrète dans un mur, etc. Cette spécialité peut également permettre d’effectuer des tests de détection lorsque quelqu’un n’effectue pas une recherche active. Il revient au MJ de décider si elle peut être utilisée ou non. |

## `TRUDVANG.Content.Ability.sneakAttack`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.sneakAttack.Description` | Those who have this specialty can perform a Sneak Attack instead of a Surprise Attack (the two things are never added up). When successfully using Camouflage and Hiding or Walking in Shadows to sneak up on a target, they can launch a Sneak Attack, if the GM allows it. The attack hits automatically and provides an additional open roll of damage no matter the result of the first roll. In addition to the open roll, the victim takes an additional 2 points of damage for each level of Sneak Attack that the attacker has learned. The attack and the damage applies only to a single action round. Afterward, the sneaking attacker is detected. If the person fails with Walking in Shadows, they are discovered before striking the blow, and combat commences as usual with no sneak attack. | Ceux qui disposent de cette spécialité peuvent réaliser une attaque furtive à la place d’une attaque par surprise (les deux ne pouvant se cumuler). Si le MJ le permet, lorsqu’un personnage a réussi à se glisser discrètement jusqu’à une cible en utilisant Camouflage et dissimulation ou Marcher dans les ombres, il peut lancer une Attaque furtive. L’attaque touche automatiquement et accorde un jet ouvert de dégâts supplémentaires quel que soit le résultat du premier jet de dégâts. En plus du jet ouvert, la victime encaisse aussi 2 points de dégâts supplémentaires par niveau d’Attaque furtive de l’attaquant. L’attaque et les dégâts ne s’appliquent que pour un seul tour de jeu. Ensuite, l’attaquant est repéré. Si le personnage échoue à son test de Marcher dans les ombres, il est repéré avant de pouvoir porter son coup et le combat commence normalement, sans Attaque furtive. |

## `TRUDVANG.Content.Ability.walkingShadows`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.walkingShadows.Description` | The person has learned to sneak around without being detected. They know how to step in ways that generate as little noise as possible. The specialty is good not only for sneaking, but also for movement in various environments such as shadows, brush, and wilderness, and also through crowds. Walking in the shadows has limits. One can move only up to half their maximum movement when trying to remain hidden, and only up to 20% of the maximum movement when also trying to remain silent. | Le personnage a appris à se déplacer discrètement sans être remarqué. Il sait comment marcher en faisant le moins de bruit possible. Cette spécialité permet non seulement de s’avancer en douce, mais aussi de se déplacer dans divers environnements tels que les ombres, les broussailles ou la nature, et même dans la foule. Marcher dans les ombres a ses limites : on ne peut se déplacer au mieux qu’à la moitié de son mouvement maximum lorsqu’on essaie de rester caché, et seulement à 20 % de son mouvement maximum lorsqu’on essaie d’être silencieux. |

## `TRUDVANG.Content.Ability.thievery`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.thievery.Description` | This discipline enables the person to get into locked places and steal items from locations or people. They also know the hidden signs of the underworld that criminals use to communicate. | Cette discipline permet à un personnage d’entrer dans des endroits fermés à clé, et de voler des objets entreposés dans des lieux ou à des personnes. Le personnage connaît les signes cachés de la pègre que les criminels utilisent pour communiquer entre eux. |

## `TRUDVANG.Content.Ability.disguise`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.disguise.Description` | The person is good at dressing up convincingly and mimicking people. With the right accessories, they can blend into the environment. The person can add +2 to their Skill Value per level when trying to blend in. By changing both body language and speech, they can imitate another person (including the opposite sex) so well that others who are not familiar with the intended person are likely to believe the deception. However, to prevent a close friend from noticing the deception, a very good disguise is required. | Le personnage est doué pour se déguiser de manière convaincante et pour imiter les gens. Avec les accessoires adaptés, il peut se fondre dans l’environnement. Le personnage bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie de se fondre dans la masse. En modifiant à la fois son langage corporel et sa voix, il peut imiter une autre personne (même du sexe opposé) à tel point que ceux qui ne sont pas proches de la personne imitée ont toutes les chances de n’y voir que du feu. Cependant, pour abuser un proche, le déguisement doit vraiment être bon. |

## `TRUDVANG.Content.Ability.locksTraps`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.locksTraps.Description` | The character has learned to pick locks and understands how most locking mechanisms work, adding +2 to Skill Value per level when manipulating or picking a lock; without this specialty, picking a lock is impossible. Every lock has a difficulty set by the game master (a basic door lock -1, a very complex one up to -20): a successful attempt takes 2 action rounds and lowers the difficulty by two steps, a failed attempt restores it, and repeated failures risk snapping the pick inside, making further attempts impossible. When the difficulty reaches a positive value, the lock opens. This specialty also covers building traps to discourage prying eyes or warn of an approach, and studying traps patiently without triggering them to learn how they were made and how to disarm them more easily. | Le personnage a appris à crocheter les serrures et sait comment fonctionnent la plupart des mécanismes de verrouillage. Il bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il essaie de manipuler une serrure ou de la crocheter. Sans cette spécialité, le personnage est incapable de crocheter une serrure. Toutes les serrures ont un niveau de difficulté (qui est aussi le modificateur à appliquer à la valeur de compétence du personnage) déterminé par le maître de jeu. Une serrure de porte basique a une difficulté de -1, alors qu’une serrure très complexe a une difficulté de -20. Toute tentative de crochetage de serrure réussie prend 2 tours de jeu et réduit le niveau de difficulté de deux rangs. Si une tentative échoue, la serrure retrouve son niveau de difficulté initial. Si le personnage échoue plusieurs fois, l’outil de crochetage risque de se casser dans la serrure, ce qui rend impossible de nouvelles tentatives. Lorsque le niveau de difficulté de la serrure atteint une valeur positive, la serrure est déverrouillée. Cette spécialité est également utilisée pour créer des pièges destinés à empêcher les indiscrétions ou à prévenir lorsque quelqu’un ou quelque chose arrive. Le personnage a également appris à étudier les pièges progressivement et méthodiquement sans les déclencher. Après une étude prudente, il sait comment le piège a été réalisé et ainsi comment le neutraliser plus facilement. |

## `TRUDVANG.Content.Ability.stealing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.stealing.Description` | The person has learned the basics of stealing items from other people and can add +2 to their Skill Value per level in the ability. People present when the theft occurs are allowed to make a specific Situation roll decided by the GM or a Shadows Arts (Finding and Spotting) Skill roll to try to discover or notice the theft. | Le personnage a appris les règles de base pour voler des objets aux personnes et bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence dans ce cadre. Les personnes présentes lorsque le vol a lieu peuvent faire un test de situation spécifique déterminé par le MJ ou un test de compétence Arts des ombres pour découvrir ou remarquer le vol. |

## `TRUDVANG.Content.Ability.shadowWorld`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.shadowWorld.Description` | The person has learned the ways of the shadow world: how to obtain counterfeits and contracts, how to receive and send information that can lead to better thefts, and how to find and use black markets. | Le personnage a appris les façons de faire du monde des ombres : comment obtenir des contrefaçons et des contrats, comment recevoir et transmettre des informations qui peuvent permettre de réaliser de meilleurs cambriolages, et comment accéder au marché noir et s’en servir. |

## `TRUDVANG.Content.Ability.thiefSigns`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.thiefSigns.Description` | A person with this specialty can read thief signs and create simple thief signs to communicate with. A thief sign could, for example, be a symbol carved on the foundation of a house or a gatepost, stones laid in a certain pattern, or something else that most people would not notice. Each sign has its own importance and can tell the experienced interpreter how many people are living in the house, whether they are rich or important, how many hirdmen are in the area, which is the best escape route out of the city , where a secret passage can be found, and so much more. The use can be almost limitless, depending on what the person who placed the sign wanted to convey. Most signs consist of at least two parts: a main idea and something specific about it. Most important is the part that conveys the main message, for example, whether there are guards at the place. The other part tells something about the main message, for example, how many guards there are. A person with this specialty can read and create thief signs with two or three additions to the main message, such as “ murderous guards here,” “fourth plank cracks,” or “10 shifts of guards.” Thief signs are created in places that are hidden to the untrained eye, but for the initiated they are quite obvious. A person just needs to know where to look. This specialty is also used to build traps to hinder prying or to warn when someone or something is coming. The person has also learned to gradually and methodically examine traps without activating them. After some careful examination, they know how the trap is constructed and therefore can disable it easier. | Un personnage ayant cette spécialité est capable de lire les signes de voleur et d’en créer des simples pour communiquer. Un signe de voleur pourrait être, par exemple, un symbole gravé sur les fondations d’une maison ou sur un montant de porte, des pierres disposées selon un certain motif, ou autre chose que la plupart des gens ne remarqueraient pas. Chaque signe a sa propre importance et indique à celui qui en a l’habitude combien de personnes vivent dans une maison, si elles sont riches ou importantes, le nombre de hirdmen dans le secteur, la meilleure échappatoire pour sortir de la ville, où se trouve un passage secret, et bien d’autres choses encore. L’utilisation est presque sans limites, selon ce que la personne qui a créé le signe souhaite exprimer. La plupart des signes sont constitués d’au moins deux éléments : une idée principale et un élément particulier qui lui est rattaché. La partie la plus importante est celle qui exprime le message principal, par exemple s’il y a des gardes à l’endroit indiqué. L’autre élément donne une indication relative au message principal, par exemple le nombre de gardes. Un personnage ayant cette spécialité peut lire et créer des signes de voleur contenant deux ou trois éléments ajoutés au message principal, tels que « ici se trouvent des gardes violents », « la quatrième planche craque » ou « dix relèves de la garde ». Les signes de voleur sont positionnés à des endroits invisibles pour l’œil non averti, mais ils sont évidents pour les initiés. Il suffit de savoir où regarder. |

## `TRUDVANG.Content.Ability.vitnerFocus`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vitnerFocus.Description` | The conjurer has learned to focus their mind on the vitner energies receiving the following modifiers per level: +1 on situation rolls to remain focused while distrurbed and -1 to rolls on the table for fatal failure. | L’invocateur a appris à concentrer son esprit sur les énergies du vitner. De ce fait, il reçoit les modificateurs suivants par niveau : +1 sur les tests de situation pour rester concentré lorsqu’il fait l’objet d’une distraction, et -1 aux jets sur la table des échecs critiques. |

## `TRUDVANG.Content.Ability.potency`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.potency.Description` | The conjurer’s spells are very powerful. All Situation values that the victim must roll at or below to resist a spell are reduced by -2 per level due to the conjurer’s force. The conjurer can also put up great resistance to spells directed toward them. All Situation values that the conjurer must roll at or above to resist or reduce a spell’s effect are increased by +2 per level. | Les sorts de l’invocateur sont très puissants. Lorsqu’une victime doit faire un test de situation pour résister à un sort, la valeur de situation est réduite de -2 par niveau en raison de la puissance de l’invocateur. L’invocateur peut également opposer une forte résistance aux sorts qui le visent. Lorsqu’il doit faire un test de situation pour résister à un sort ou en réduire les effets, la valeur de situation est augmentée de 2 par niveau. |

## `TRUDVANG.Content.Ability.safeWeaving`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.safeWeaving.Description` | The conjurer is meticulous when weaving spells. On the occasions that the conjurer’s spell malfunctions, because of this specialty they subtract -2 per level from the roll on the fatal magic table (see the Fatal Magic section in Weavers of Magic). The conjurer is also very hard to disturb when preparing or conjuring a spell. Anytime they must thought force, and the only indication of trying to create a spell is the virtually non-existent gesture or movement that finally channels the magic out through the body. The movements may be a simple twist of a wrist, a flick of the fingers, or a wink of an eye. The downside to Vyrding is that it takes twice as long to shape vitner into a spell as in other styles. | L’invocateur tisse ses sorts avec minutie. Lorsqu’il rencontre un échec de sort, cette spécialité lui permet d’appliquer un modificateur de -2 par niveau au jet effectué sur la table de magie funeste (Cf. le paragraphe « Magie funeste » au L’invocateur est également difficile à déconcentrer lorsqu’il prépare ou invoque un sort. À chaque fois qu’il doit faire un test de situation pour voir s’il est suffisamment déconcentré pour que le sort soit annulé, son jet reçoit un modificateur de +2 par niveau (cf. le paragraphe « Être déconcentré » au chapitre Tisseurs de vitner). |

## `TRUDVANG.Content.Ability.strenuous`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.strenuous.Description` | The conjurer concentrates especially hard when weaving the vitner. By using extra vitner during a spell, the chances to succeed increase. For each level of this specialty , the conjurer may use 2 Vitner Points to get a +1 modifier on the Skill roll. A conjurer with level 3 of the specialty can therefore use an extra 6 Vitner Points to get +3 on their Skill Value, and a conjurer with level 5 can use an extra 10 Vitner Points to get +5. How many Vitner Points the conjurer wants to add is up to them, provided that they do not exceed what their specialty level permits. | Lorsqu’il tisse le vitner, l’invocateur se concentre de façon très intense. En utilisant des points de vitner supplémentaires lorsqu’il lance un sort, il augmente ses chances de succès. Pour chaque niveau qu’il a dans cette spécialité, il peut utiliser 2 points de vitner pour obtenir un modificateur de +1 à son test de compétence. Un invocateur ayant la spécialité au niveau 3 peut ainsi utiliser 6 points de vitner supplémentaires pour obtenir un modificateur de +3 à sa valeur de compétence, et un invocateur ayant le niveau 5 peut dépenser 10 points de vitner pour obtenir un bonus de +5. Il revient à l’invocateur de décider du nombre de points de vitner supplémentaires qu’il souhaite dépenser, dans la mesure où ils n’excèdent pas la valeur autorisée par le niveau de spécialité. |

## `TRUDVANG.Content.Ability.vitnerShaping`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vitnerShaping.Description` | Vitner can be shaped through various methods:songs and sounds (Galding), gestures (Sejding) and thoughts (Vyrding). This discipline give modifiers to all three but the conjurer must know at least one of the related specialties in order to cast a spell. The three ways cannot be combined with one another; a spell is Galded, Sejded, or Vyrded. The discipline also provides knowledge of the written language of the incantation arts. | Le vitner peut être modelé au travers de différentes méthodes : les chants et les sons (galda), la gestuelle (sejda) et les pensées (vyrda). Quelle que soit la méthode, cette discipline accorde des modificateurs, mais l’invocateur doit connaître au moins l’une des trois spécialités pour pouvoir lancer un sort. Les trois méthodes ne peuvent pas être combinées ; un sort est modelé soit par le galda, soit par le sejda, soit par le vyrda. Cette discipline donne également la connaissance du langage écrit des arts de l’incantation. |

## `TRUDVANG.Content.Ability.galding`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.galding.Description` | The conjurer specializes in singing up a spell. Galding means that the conjurer weaves and shapes vitner into spells entirely through mysterious songs and sounds. Some songs are both long and complex, while others are no more than a protracted tone at the right time. The songs and sounds are, however, highly Vitner Habit The conjurer reaches an important insight into the vitner art, which increases their ability to draw in vitner from the surroundings. The conjurer must have a minimum level of 1 in one of the other specialties: Hwitalja, Darkhwitalja, or Vaagritalja. They increase its capacity by +10 Vitner Points per level of Vitner Habit. | L’invocateur est spécialisé dans le chant des sorts. Avec le galda, c’est uniquement en chantant et en produisant des sons mystérieux que l’invocateur tisse et modèle le vitner pour en faire un sort. Certains chants sont à la fois longs et complexes, tandis que d’autres ne sont rien de plus qu’une note prolongée au moment adéquat. Cependant, les chants et sons sont propres à chaque invocateur, et un même sort sonnera de façon totalement différente s’il est évoqué par un autre invocateur. Pour l’un, le sort pourra être une chanson magnifique alors que pour un autre, il pourra s’agir d’un gargouillis venant du fond de sa gorge. Certains invocateurs utilisent même des instruments de musique et invoquent et modèlent le vitner en combinant leur voix et le son d’un instrument. Quel que soit l’aspect sonore du sort, il peut souvent être entendu à distance, ce qui signifie que l’invocateur est facilement repéré et reconnu en tant que tel. |

## `TRUDVANG.Content.Ability.sejding`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.sejding.Description` | The one who Sejders up a spell molds the vitner using different movements and gestures. The conjurer must therefore be able to use both their hands for weaving. Otherwise they cannot control the vitner needed for the spell. This spell method is quiet but startling since the conjurer must gesticulate with both arms and hands. | La technique du sejda consiste à modeler le vitner en utilisant différents mouvements et gestes. L’invocateur doit pour cela être capable d’utiliser ses deux mains pour tisser. Si ce n’est pas le cas, il ne peut pas contrôler le vitner nécessaire pour lancer le sort. Cette méthode est silencieuse mais étonnante car l’invocateur doit gesticuler à la fois avec les bras et les mains. |

## `TRUDVANG.Content.Ability.vitnerRunes`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vitnerRunes.Description` | The person has learned to decipher the complicated symbols that make up the vitner craft’s written language. | Le personnage a appris à déchiffrer les symboles compliqués qui constituent la langue écrite de l’art du vitner. |

## `TRUDVANG.Content.Ability.vyrding`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vyrding.Description` | The spell method known as Vyrding is quiet and tranquil, and often goes completely unnoticed until the effect arrives. Conjurers who Vyrd fill themselves with vitner and, for a moment, become one with their own being. They mold the vitner with pure learns. For more details, see Vitner Tablets and Spells in Weavers of Magic. The following are the Vitner Tablets: Animal Vitner, Body Vitner, Delusion Vitner, Dimvitner, Flame Craft, Perceiving, Power of Thought, Power of Vision, Soil Craft, Vitner Craft, Vitner of Objects, Water Craft, Wind Craft, and Witchcraft. | La méthode de lancer de sorts connue sous le nom de vyrda est silencieuse et calme, et passe souvent complètement inaperçue jusqu’à ce que l’effet se produise. Les invocateurs qui y font appel se remplissent de vitner et, pour un instant, leur être et l’énergie magique ne font plus qu’un. Ils modèlent le vitner uniquement à la force de la pensée, et le seul indice permettant de comprendre qu’ils essaient de créer un sort est le geste ou le mouvement pratiquement inexistant qui, au final, canalise la magie hors du corps. Ce mouvement peut consister en une simple torsion de poignet, une pichenette du doigt ou un clin d’œil. L’inconvénient du vyrda est qu’il faut deux fois plus de temps pour modeler le vitner pour en faire un sort qu’avec les autres méthodes. |

## `TRUDVANG.Content.Ability.callVitner`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.callVitner.Description` | This discipline is the first step to see and call for the vitner and receive a Vitner Capacity. But a character also must learn one of the specialties (Hwitalja, Darkhwitalja, or Vaagritalja) in order to use the Vitner Points that the discipline gives. Seeing the vitner is a long process that is described in more detail in the Three Types of Vitner section in Weavers of Magic. The conjurer increases their vitner capacity by +5 Vitner Points per level of the discipline. | Cette discipline est la première étape pour pouvoir voir le vitner, y faire appel, et obtenir une réserve de vitner. Mais un personnage doit également apprendre l’une des spécialités (Hwitalja, Morkvitalja ou Vaagritalja) afin de pouvoir utiliser les points de vitner accordés par la discipline. Percevoir le vitner est un processus long qui est décrit plus en détail dans les sections du aux trois types de vitner. L’invocateur augmente sa réserve de vitner de 5 points de vitner par niveau de discipline. |

## `TRUDVANG.Content.Ability.hwitalja`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.hwitalja.Description` | The conjurer has, after years of study , found the way past both dark vitner and vaagri vitner to eventually find the purest form: white vitner. The conjurer has now become a Hwitalja and belongs to those who bring light. The choice to weave white vitner, however, brings consequences to the conjurer, who can never learn Vaagritalja or Darkhwitalja after learning this specialty. White vitner has the following effects on the conjurer: ✦ Hwitalja increases vitner capacity by +10 Vitner Points. ✦ The conjurer weaves the vitner perfectly on a roll of 1-2. ✦ In case of a fatal failure, only 1d10 (OR 10) is rolled on the fatal magic table. ✦ The description of each specific Vitner Tablet includes the specific effects of Hwitalja, usually in terms of Vitner points cost. | Niveau Après des années d’étude, l’invocateur a tracé son chemin entre le morkvitner (le vitner sombre) et le vaagrivitner, trouvant au bout du compte la forme la plus pure : le hvitavitner (le vitner blanc). Il est à présent devenu un hwitalja et fait partie de ceux qui apportent la lumière. Choisir de tisser le hvitavitner a des conséquences pour l’invocateur, qui ne pourra jamais apprendre les spécialités Vaagritalja et Morkvitalja. Le hvitavitner a les effets suivants sur l’invocateur : F Hwitalja augmente la réserve de vitner de 10 points de vitner. F L’invocateur tisse le vitner à la perfection lorsqu’il obtient 1-2 sur le dé. F En cas d’échec critique, on ne lance que 1d10 (JO 10) sur la table de Magie funeste. F La description de chaque Tablette de vitner intègre les effets spécifiques de hwitalja, qui se traduisent habituellement par un coût en points de vitner. |

## `TRUDVANG.Content.Ability.darkhwitalja`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.darkhwitalja.Description` | After years of study, the conjurer has uncovered the dark vitner and can summon it, becoming a Darkhwitalja among the dark tamers. Choosing to weave the morkvitner forever bars learning Vaagritalja and Hwitalja. Its effects on the conjurer: the reserve grows by 20 Vitner Points; perfect results are impossible because this vitner is impure; its failures can be fatal — on a critical failure roll 1d10 (open 8-10) on the Fatal Magic table; and every Vitner Tablet description accounts for morkvitalja specifics, usually a Vitner Point cost. | Après des années d’étude, l’invocateur a découvert le morkvitner et peut l’invoquer. Il est à présent devenu un morkvitalja et fait partie des dompteurs sombres. Choisir de tisser le morkvitner a des conséquences pour l’invocateur, qui ne pourra jamais apprendre les spécialités Vaagritalja et Hwitalja. Le morkvitner a les effets suivants sur l’invocateur : F Morkvitalja augmente la réserve de vitner de 20 points de vitner. F Le morkvitalja ne peut jamais obtenir un résultat parfait car ce vitner est impur. F Les échecs d’un morkvitalja peuvent être fatals. En cas d’échec critique, il lance 1d10 (JO 8-10) sur la table de Magie funeste. F La description de chaque Tablette de vitner intègre les effets spécifiques de morkvitalja, qui se traduisent habituellement par un coût en points de vitner. |

## `TRUDVANG.Content.Ability.vaagritalja`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vaagritalja.Description` | The conjurer has, after years of study , found the vaagri vitner, which is a mix between the dark and white vitner. This is the vitner they shall weave in perpetuity. The conjurer has now become a Vaagritalja and belongs to the ones called the wave masters. The choice to weave vaagri vitner, however, brings consequences to the conjurer, who can never learn Hwitalja or Darkhwitalja after learning this specialty. Vaagri vitner has the following effects on the conjurer: ✦ Vaagritalja increases vitner capacity by +15 Vitner Points. ✦ Vaagritalja otherwise has no positive or negative effects on the conjurer’s ability to learn to weave, refine vitner for extra power, access the vitner or weave perfectly. In case of a fatal failure, the Vaagritalja rolls 1d10 (OR 9-10) on the fatal magic table. ✦ The description of each specific Vitner Tablet includes the specific effects of Vaagritalja, usually in terms of Vitner points cost. | Après des années d’étude, l’invocateur a découvert le vaagrivitner, une combinaison de hvitavitner et de morkvitner. C’est la forme de vitner qu’il tissera pour toujours. L’invocateur est à présent devenu un vaagritalja et fait partie de ceux que l’on appelle les maîtres de l’onde. Choisir de tisser le vaagrivitner a des conséquences pour l’invocateur, qui ne pourra jamais apprendre les spécialités Hwitalja et Morkvitalja. Le vaagrivitner a les effets suivants sur l’invocateur : F Vaagritalja augmente la réserve de vitner de 15 points de vitner. F Le vaagritalja n’a pas d’effet positif ou négatif sur la capacité de l’invocateur à apprendre à tisser, à perfectionner le vitner pour obtenir plus de puissance, à accéder au vitner ou à atteindre la perfection dans le tissage. En cas d’échec critique, le vaagritalja lance 1d10 (JO 9-10) sur la table de Magie funeste. F La description de chaque Tablette de vitner intègre les effets spécifiques de vaagritalja, qui se traduisent habituellement par un coût en points de vitner. |

## `TRUDVANG.Content.Ability.vitnerHabit`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.vitnerHabit.Description` | The conjurer reaches an important insight into the vitner art, which increases their ability to draw in vitner from the surroundings. The conjurer must have a minimum level of 1 in one of the other specialties: Hwitalja, Darkhwitalja, or Vaagritalja. They increase its capacity by +10 Vitner Points per level of Vitner Habit. | Niveau L’invocateur atteint une compréhension importante de l’art du vitner qui augmente sa capacité à puiser dans le vitner de son environnement. L’invocateur doit avoir un niveau minimum de 1 dans l’une des autres spécialités : Hwitalja, Morkvitalja ou Vaagritalja. L’augmentation de sa réserve est de 10 points de vitner par niveau d’Habitude du vitner. |

## `TRUDVANG.Content.Ability.geography`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.geography.Description` | With the Geography discipline, a person knows what the environment looks like and how it is laid out. This gives the ability to interpret and create maps, know where different places are in relation to others, and which direction to travel in order to reach a certain destination. The discipline allows the person to get a rough idea of how the selected part of the world is constructed. They know which countries exist and all boundaries, popular routes, and towns and villages that exist. The person receives a bonus of +1 per level to a Skill roll to determine if they have knowledge regarding the area. Characters begin with level 1 in this discipline and level 1 as a basic specialty in Land Knowledge, specified according to the country where they grew up. The discipline must specify one of the following countries: Westmark, Mittland, the Stormlands, Nhoordland, Muspelheim, or Soj. In effect each country requires its own different Discipline. | Grâce à la discipline Géographie, un personnage a une idée de l’aspect physique du terrain et de la façon dont il se présente. Elle lui permet d’interpréter et de créer des cartes, de savoir où se trouvent différents endroits les uns par rapport aux autres, et dans quelle direction il faut voyager pour atteindre une destination particulière. Cette discipline permet au personnage de se faire une idée générale de la façon dont est organisée la partie du monde à laquelle elle s’applique. Le personnage connaît les pays et leurs frontières, les itinéraires populaires et les villes et villages. Il reçoit un modificateur de +1 par niveau au test de compétence effectué pour déterminer la connaissance qu’il a d’une certaine région. À la création, les personnages commencent avec le niveau 1 dans cette discipline et le niveau 1 dans la spécialité Connaissance régionale, la région concernée étant celle dans laquelle ils ont grandi. La discipline doit préciser le pays concerné parmi les suivants : le Vastermark, le Mittland, les Stormländer, le Nhoordland, Muspelheim ou Soj. En effet, chaque pays nécessite le développement d’une discipline qui lui est propre. |

## `TRUDVANG.Content.Ability.cityKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.cityKnowledge.Description` | ( Specification Required) The person has learned all about a particular city and gained knowledge of things like where the ruler lives and where trading houses, inns, baths, sacred buildings, and other places of interest are located. The specialty must be designated to a specific town or city. | Le personnage a appris tout ce qu’il y a à savoir sur une cité en particulier, et a acquis la connaissance de choses telles que l’endroit où vit le dirigeant et la localisation des commerces, des tavernes, des bains, des lieux sacrés et d’autres endroits intéressants. La spécialité doit être développée pour chaque ville ou cité spécifique. |

## `TRUDVANG.Content.Ability.landKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.landKnowledge.Description` | ( Specification Required) The person has knowledge regarding a country’s geography and can add +2 per level to their Skill Value when trying to learn about its forests, rivers, lakes, coastlines, mountains, cities, trails, and more. Every country in Trudvang has its own Land Knowledge specialty. | Le personnage a acquis la connaissance géographique d’une région et bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer ce qu’il sait de ses forêts, rivières, lacs, côtes, montagnes, cités, chemins, etc. Il existe une spécialité Connaissance régionale pour chaque région d’un pays de Trudvang. |

## `TRUDVANG.Content.Ability.orienteeringCartography`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.orienteeringCartography.Description` | By comparing famous landmarks, and the positions of stars and celestial bodies in relation to each other, a person knows their current location and in which direction they are moving. The specialty helps them take the quickest and most direct route possible from one place to another. The person has also learned how to make maps by being observant of how areas look and being careful when calculating distance and space. If the mapmaker can read and write, the information on the maps they create is much easier to understand. A mapmaker can only draw a map of an area that they have visited and witnessed. | En comparant des repères connus et les positions relatives des étoiles et des corps célestes les uns par rapport aux autres, un personnage peut déterminer sa localisation et la direction dans laquelle il se déplace. La spécialité l’aide à emprunter la route la plus rapide et la plus directe possible pour se rendre d’un lieu à un autre. Le personnage a également appris à réaliser des cartes en observant la physionomie d’une zone et en calculant avec attention les distances et les espaces. Si le dessinateur d’une carte sait lire et écrire, les informations qui y sont reportées sont plus faciles à comprendre. On ne peut créer une carte d’une zone que si on s’y est rendu et qu’on l’a observée. |

## `TRUDVANG.Content.Ability.seaKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.seaKnowledge.Description` | The person is familiar with the sea that surrounds a specific coast, and can add +2 per level to their Skill Value when trying to learn about the seas of a selected region. | Le personnage est familier avec la mer ou l’océan qui borde une côte spécifique, et bénéficie d’un modificateur de +2 par niveau à sa valeur de compétence lorsqu’il doit déterminer ce qu’il sait des eaux d’un secteur donné. |

## `TRUDVANG.Content.Ability.huntingExperience`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.huntingExperience.Description` | With the Hunting Experience discipline, a person knows how to track and hunt prey , as well as how to survive in the wild and difficult environments. The person knows a lot regarding different prey and has learned to read their trails, habits, and behavior. They also know the best way to chase prey and fish in different waters. | Grâce à la discipline Expérience de la chasse, un personnage sait comment traquer et chasser une proie, mais aussi comment survivre dans des environnements sauvages et difficiles. Il en connaît un rayon sur les différentes proies et a appris à lire leurs traces, leurs habitudes et leurs comportements. Le personnage connaît aussi la meilleure façon de traquer une proie ou de pêcher dans les différents cours ou plans d’eau. |

## `TRUDVANG.Content.Ability.carveButcher`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.carveButcher.Description` | The person has learned to carve meat and butcher animals properly , and can get 10% more daily rations than usual through hunting or fishing. The person is also good at skinning animals and taking care of the fur. The more skillful the person is, the greater and finer piece of fur they can get from a killed animal. The specialty bonus is used when the person is skinning an animal in order to take care of the fur. | Le personnage a appris à découper la viande et à dépecer les animaux correctement, et gagne 10 % de rations de plus que ce qu’il obtiendrait avec la spécialité Chasser et pêcher. Il est également capable d’écorcher les animaux et de préserver leur fourrure. Plus le personnage est compétent, plus les fourrures qu’il pourra tirer d’un animal abattu seront grandes et de belle qualité. Le modificateur de la spécialité est utilisé lorsque le personnage écorche l’animal afin d’en exploiter la fourrure. |

## `TRUDVANG.Content.Ability.huntingFishing`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.huntingFishing.Description` | The person is good at hunting in the wilderness or on a lake. The person can also build and manage traps used in hunting. The specialty bonus is used when the person goes hunting or fishing. | Le personnage sait chasser dans la nature ou pêcher sur un lac. Il peut également fabriquer et poser des pièges pour attraper des animaux. Le bonus de spécialité est utilisé lorsque le personnage part à la chasse ou à la pêche. |

## `TRUDVANG.Content.Ability.speciesHunter`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.speciesHunter.Description` | This specialty is for hunting a specific animal. The character has learned how and where the animal lives and which tracks to search for when stalking it. Animal species may include hare, wolf, bear, fox, lynx, wild horse, deer, salmon, and so on. The specialty bonus is used when tracking the chosen animal species and also when hunting in the area where the species dwells. | Cette spécialité a pour objet la chasse d’un animal spécifique. Le personnage a appris où et comment l’animal vit, et les traces qu’il doit suivre lorsqu’il le traque. Parmi les espèces animales, on compte le lièvre, le loup, l’ours, le renard, le lynx, le cheval sauvage, le cerf, le saumon, etc. Le bonus de spécialité est utilisé lorsque le personnage piste un animal de l’espèce choisie, ainsi que lorsqu’il chasse dans une zone où l’espèce est établie. |

## `TRUDVANG.Content.Ability.tracker`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.tracker.Description` | The person is good at spotting trails in the terrain. The specialty bonus is used when they try to find or follow a trail. | Le personnage sait repérer des pistes dans la nature. Le bonus de spécialité est utilisé lorsqu’il essaie de trouver ou de suivre une piste. |

## `TRUDVANG.Content.Ability.wildernessSigns`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.wildernessSigns.Description` | A person with this specialty can read and create wilderness signs: a symbol carved into tree bark or a doorframe, stones arranged in a pattern, or anything else only the knowledgeable would find. Every sign carries meaning — how game-rich a region is, whether trolls haunt a forest and how many left eastward, a good resting spot half a day’s walk east, landslide risks — whatever the sign-maker wishes to convey. Most signs combine several elements: the main message, such as “beware of trolls”, elaborated with the trolls’ type, number and direction of travel. Signs sit where untrained eyes pass over, yet stand out plainly to the experienced. | Un personnage disposant de cette spécialité sait lire et créer des signes de la nature. Il peut s’agir, par exemple, d’un symbole gravé dans l’écorce d’un tronc d’arbre ou dans un encadrement de porte, de pierres positionnées selon un motif particulier, ou de tout autre signe que seul le connaisseur peut trouver. Chaque signe a une importance et peut indiquer à quel point une région est riche en animaux ; s’il y a des trolls dans la forêt, leur nombre et leur type ; qu’on peut trouver un bon endroit pour se reposer à une demi-journée de marche à l’est ; qu’il y a un risque de glissement de terrain, etc. Tout dépend de ce que la personne qui a réalisé le signe veut transmettre. La plupart des signes sont constitués de plusieurs éléments. La partie la plus importante est celle qui transmet le message principal, tel que « Attention aux trolls ». Les autres parties développent le message principal, détaillant par exemple le type de trolls, leur nombre et la direction dans laquelle ils sont partis. Les signes sont positionnés à des endroits qui ne sautent pas aux yeux d’un public non averti, mais pour une personne expérimentée, ils sont relativement évidents. |

## `TRUDVANG.Content.Ability.natureKnowledge`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.natureKnowledge.Description` | The Nature Knowledge discipline gives the person knowledge regarding the flora and fauna of Trudvang as well as the ability to predict weather. The person knows what plants are located in an area, which animals and beasts are there, how they behave, and why. The person also is familiar with the landscapes and terrains of Trudvang, and what characterizes a particular area. | La discipline Connaissance de la nature donne au personnage des connaissances concernant la flore et la faune de Trudvang, ainsi que la capacité à prévoir le temps. Il connaît les plantes présentes dans une région, les animaux et les créatures qu’on peut y rencontrer, ainsi que leur comportement. Le personnage est également familier avec les différents paysages et terrains de Trudvang, et sait ce qui caractérise une région spécifique. |

## `TRUDVANG.Content.Ability.animalFriend`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.animalFriend.Description` | This specialty gives a person improved knowledge regarding the lives of animals. The specialty bonus is used when the person wants to know something regarding their ways and patterns. The knowledge is also used to train an animal to perform tricks and activities. The person has also learned to train wild animals so as to domesticate them. To domesticate an animal, it must first be captured. A caught animal becomes domesticated if the tamer succeeds on five rolls for the Wilderness skill. The tamer may roll only once per week. Thus, it takes at least five weeks to domesticate a wild animal. Because there are a great variety of animals in Trudvang, it is up to the game master to determine which ones can be trained and for what. Some examples of animals that can be trained are horses, dogs, birds, cats, bears, snakes, and rodents. The specialty bonus is used when the person wants to train or command an animal to do something. Different animals can be taught different skills (see the Trained Animals section in the Game Master Guide book for more details). There are eight different types of training: fetching, jumping, hunting, couriering, sprinting, tracking, combat, and guarding. All these training areas have five capability levels: obedient, capable, excellent, skilled, and masterful. A dog can therefore have excellent training could convey how rich the area is with animals, if there are trolls in the forest, how many trolls there are, what kind of trolls, that a good resting place is a half day’s march eastward, that there is a risk of landslides, and much more. It all depends on what the person who made the sign wanted to convey. Most signs consist of several parts. Most important is the part that conveys the main message, such as “Beware of trolls.” The other parts expand the main message, such as detailing what kind of trolls, how many there are, and in what direction they went. Signs are positioned in places that are not obvious to an untrained eye, but to an experienced person they are quite clear. | Cette spécialité donne au personnage une connaissance approfondie concernant la vie des animaux. Le bonus de spécialité est utilisé lorsqu’il doit déterminer s’il sait quelque chose au sujet de leur mode de vie et de leurs habitudes. Cette connaissance peut aussi être utilisée pour dresser un animal en vue de lui faire réaliser des tours et des activités particulières. Le personnage a également appris à dresser des animaux sauvages pour les domestiquer. Pour ce faire, l’animal doit d’abord être capturé. Ensuite, le dresseur doit réussir cinq tests de la compétence Nature. Il ne peut effectuer le test qu’une fois par semaine. Ainsi, il faut au moins cinq semaines pour domestiquer un animal sauvage. Comme il existe une grande variété d’animaux sur Trudvang, il appartient au maître de jeu de déterminer lesquels peuvent être dressés et ce qu’ils peuvent alors réaliser. Parmi les animaux qui peuvent être dressés figurent les chevaux, les chiens, les oiseaux, les chats, les ours, les serpents et les rongeurs. Le bonus de spécialité est utilisé lorsque le personnage veut dresser un animal ou lui ordonner de réaliser une tâche. On peut enseigner différentes compétences à différents animaux (cf. la section Animaux dressés du chapitre Équipement, page 128, pour plus de détails). Il existe huit types d’entraînements différents : rapporter, sauter, chasser, porter un message, courir vite, pister, attaquer et monter la garde. Chacun de ces entraînements dispose de cinq niveaux d’aptitude : obéissant, compétent, excellent, expert et magistral. Un chien peut ainsi avoir un entraînement excellent pour attaquer et compétent pour monter la garde. Cependant, un animal ne peut être entraîné avant d’avoir été dressé. |

## `TRUDVANG.Content.Ability.botany`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.botany.Description` | This specialty gives a person more knowledge regarding the trees and flowers of Trudvang. The specialty bonus is used when the person wants to know something regarding plants. | Cette spécialité apporte au personnage des connaissances supplémentaires concernant les arbres et les fleurs de Trudvang. Le bonus de spécialité est utilisé lorsque le personnage doit déterminer s’il sait quelque chose concernant des plantes. |

## `TRUDVANG.Content.Ability.weatherman`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.weatherman.Description` | The person has learned to interpret the signs of nature and can use them to predict the weather for the next few days. The specialty bonus is used when the person tries to predict weather for the next two days +1 day per level. | Le personnage a appris à interpréter les signes de la nature et peut les utiliser pour prédire le temps qu’il fera durant les prochains jours. Le bonus de spécialité est utilisé lorsque le personnage essaie de prédire la météo des deux prochains jours + 1 jour par niveau. |

## `TRUDVANG.Content.Ability.zoology`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.zoology.Description` | This specialty gives a person extra knowledge regarding creatures in Trudvang that lack higher intelligence. The person is familiar with these animals’ strengths and weaknesses, how they live, what they fear, what tracks they make, and much more. The specialty bonus is used when the person wants to know something about a particular creature. | Cette spécialité apporte au personnage une connaissance supplémentaire concernant les créatures de Trudvang qui ne sont pas dotées d’une intelligence supérieure. Le personnage est familier avec les forces et les faiblesses de ces animaux, leur mode de vie, ce qu’ils craignent, le type de traces qu’ils laissent, etc. Le bonus de spécialité est utilisé lorsque le personnage doit déterminer s’il sait quelque chose au sujet d’une créature spécifique. |

## `TRUDVANG.Content.Ability.seafarer`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.seafarer.Description` | The Seafarer discipline provides knowledge of the sea and the basics of how to operate various types of boats. The person knows how things work on a boat, such as how teams of workers should look and act, how to load the cargo, which ropes and knots to use, how to set sails, and most importantly how to sail and steer a ship. Seafaring also provides knowledge of which winds are expected in various sea environments, as well as which signs to follow to find the right place on the high seas. | La discipline Marin donne au personnage la connaissance de la mer et les bases pour manœuvrer différents types de bateaux. Il sait comment les choses se déroulent à bord d’un navire : comment sont composées les équipes de marins et quelles tâches ils ont à effectuer, comment charger une cargaison, quelles cordes et nœuds utiliser, comment mettre les voiles, et plus important que tout, comment naviguer et manœuvrer un navire. Cette discipline permet également de savoir à quels vents s’attendre selon l’environnement marin, et de connaître les signes à repérer pour bien manœuvrer le navire en haute mer. |

## `TRUDVANG.Content.Ability.navigation`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.navigation.Description` | By comparing famous landmarks at sea, and the positions of stars and celestial bodies in relation to each other, a person knows their current heading or direction as well as location. The specialty helps a person take the best and most direct possible route from one place to another at sea. Depending on distance and weather, the game master determines how often a navigator needs to succeed with a Skill roll to stay on the right course. If a person has a good sea map that shows landmarks, they can determine their location and heading with great accuracy. | En mer, en se référant à des amers connus et à la position relative des étoiles et des corps astraux, un personnage connaît son cap actuel et éventuellement sa position. La spécialité aide un personnage à prendre la meilleure route et si possible la plus directe pour se rendre d’un endroit à un autre par la mer. Selon la distance et la météo, le maître de jeu détermine le nombre de tests de compétence qu’un navigateur doit réussir pour maintenir le bon cap. Si un personnage dispose d’une bonne carte marine qui indique les amers, il peut déterminer sa position et son cap avec une grande précision. |

## `TRUDVANG.Content.Ability.seaman`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.seaman.Description` | The person is familiar with spending long periods of time at sea and does not need to go ashore as often as someone with less experience. The person uses this specialty when a successful Skill roll is required to keep from getting sick on the stormy ocean, or anything that has to do with life on board a ship. The person has also learned most of the common routines and chores that are required when working on a ship. The person knows, for example, how to set sail, how to load the cargo, which ropes and knots to use, and perhaps most importantly , how to sail. | Le personnage a l’habitude de passer de longues périodes en mer et n’a pas besoin de descendre à terre aussi souvent qu’une personne moins expérimentée. Il fait appel à cette spécialité lorsqu’il est nécessaire d’effectuer un test de compétence pour éviter d’avoir le mal de mer à cause d’une tempête, ou pour toute autre raison liée à la vie à bord d’un navire. Le personnage a également appris la plupart des tâches quotidiennes et des corvées qui doivent être réalisées lorsqu’on travaille sur un navire. Il sait par exemple comment amener les voiles, comment charger la cargaison, quels cordes et nœuds utiliser et, tâche probablement la plus importante, comment naviguer. |

## `TRUDVANG.Content.Ability.survival`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.survival.Description` | This discipline makes the person a true survivor who can subsist on the few assets that nature has to offer. The discipline bonus is used when the person has to survive in the wild and must find shelter, food, water, or other necessities. | Cette discipline fait du personnage un vrai survivant, qui peut subsister avec les rares ressources que la nature peut lui offrir. Le bonus de discipline est utilisé lorsque le personnage essaie de survivre dans la nature et doit trouver un abri, de la nourriture, de l’eau ou d’autres produits indispensables. |

## `TRUDVANG.Content.Ability.camper`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.camper.Description` | The person is good at building camps in the wilderness. Primarily , it is not just about a camp you set up for the night, but a camp where you can stay for several days to hunt, repair equipment, or simply rest. The camp takes eight hours to build and requires a successful Skill roll. If the person manages to build a camp, it means that those in the camp will not suffer negative modifiers for being in the wilderness. People can also rest and recover from injuries just like they would if they were in a city. The person is also good at making fire without a tinderbox or other tools. | Le personnage sait établir un campement dans la nature. Pour l’essentiel, il ne s’agit pas simplement d’un bivouac qu’il établit pour passer la nuit, mais d’un campement où il pourra rester pendant plusieurs jours, le temps de chasser, de réparer du matériel ou simplement de se reposer. Il faut huit heures et réussir un test de compétence pour monter le camp. Si le personnage parvient à dresser un campement, ceux qui s’y trouvent ne subiront pas de modificateur négatif lié à une présence prolongée dans la nature. Les personnes peuvent également se reposer et se remettre de leurs blessures comme s’ils étaient en ville. Le personnage sait également faire un feu sans un briquet à amadou ou tout autre outil. |

## `TRUDVANG.Content.Ability.pathwalker`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.pathwalker.Description` | The person has great stamina when traveling in the wild. The specialty bonus is used when a Skill roll is required during long trips through the wilderness. A person with this specialty also increases the distance covered during one day by 10% per level. | Le personnage a une grande endurance lorsqu’il voyage en pleine nature. Le bonus de spécialité est utilisé lorsqu’il doit effectuer un test de compétence au cours d’un long voyage en terres sauvages. De plus, la distance parcourue en un jour par un personnage disposant de cette spécialité est augmentée de 10 % par niveau. |

## `TRUDVANG.Content.Ability.terrainExperience`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.terrainExperience.Description` | ( Specification Required) The person has great expertise regarding survival in a certain terrain. The specialty bonus is used when a Skill roll is required to find shelter, food, water, or other necessities in the selected terrain. Available terrains are mountain, forest, sea, snow and cold, and plains. | Le personnage possède une grande expertise en matière de survie dans un environnement spécifique. Le bonus de spécialité est utilisé lorsque le personnage doit effectuer un test de compétence pour trouver un abri, de la nourriture, de l’eau ou d’autres produits indispensables dans l’environnement choisi. Les différents environnements sont : montagne, forêt, mer, neige et froid, et plaines. |

## `TRUDVANG.Content.Ability.weathered`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Ability.weathered.Description` | The person is used to spending long periods of time in the wilderness, and can therefore endure rain, wind, and cold. The specialty bonus is used when the person needs to overcome the weather in the wild. There are three types of vitner that together form the worldwide force, which makes up all of the worlds as well as the gap between them. Together, the three powers build and surround everyone and everything, from the smallest piece of gravel to the largest mountain, from the smallest mouse to the largest giant. | Le personnage est habitué à passer de longues périodes dans la nature et est donc capable de supporter la pluie, le vent et le froid. Le bonus de spécialité est utilisé lorsque le personnage doit affronter une météo défavorable en pleine nature. |

## `TRUDVANG.Content.Journal.human`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.human.Name` | Humans | Humains |
| `TRUDVANG.Content.Journal.human.Content` | <p>chapter 1. the character \| 19 that one can be an Ogro Wildfolk or a Stormlander Gray Brute.</p><h2>Changeling</h2><p>A Changeling is a cross between a human and a forest troll. It is smaller than a regular human, with brownish skin and yellow eyes. Some Changelings also have a cow tail, just like a troll.</p><h2>Gray Brute</h2><p>A Gray Brute is the offspring of a human and a gray troll. They are typically bigger than a human in every respect. A Gray Brute usually takes after its troll lineage, meaning they have lots of hair on their body , yellow eyes, a big nose, and long ears.</p><h2>Ogro</h2><p>An Ogro is a mix of human and ogre. It is much taller than a human but less intelligent. Their skin is gray or green and as hardened as leather. Some ogros have blue eyes, but most of them have the yellow eyes of a troll, and just like changelings most ogros have a long tail.</p><h2>Wildfolk</h2><p>The traditional Wildfolk are a mix of different tribes, Amures live in the northwestern mountains, Thoorkaals in the southwest, and all the wild and savage tribes and clans dwell in the northern parts of Trudvang. Most of the Wildfolk pray to the dark gods and put their faith in Haminges. They are brutal and hardened, well known for their excellence in war and fighting. They are typically smaller, less intelligent, and stronger than the average Stormlander .</p><h2>Half-Trolls</h2><p>There are many stories about trolls using their foul magic on humans to beget offspring. Half-troll is the common name for the offspring of a human and a troll. The typical half-troll is big and brutish, and shares characteristics of both trolls and humans. Rem ember that “half-troll” is just a race name. Half-trolls raised by humans tend to also have human cultures. This means The daughters and sons of the human race live in every corner of Trudvang. Ever since their first dawn, they’ve adjusted to the environment like no other race. In the east live the Stormlanders; in Mittland, descendants of the Thronelander kings; and in the far west the wise Viranns. Side by side with these main human breeds live the Wildfolk hiding in the deep forests and mountains.</p><h2>Mittlander</h2><p>The old name of the Mittlanders is East-throners. It is a human culture with old and complex traditions. According to legend, Mittlanders descended from the Thronelanders and lived in the far eastern wilderness for thousands of years before returning west. Mittlanders are proud and honorable, and they value courage as the highest virtue. Typical Mittlanders are not as tall and strong as most Stormlanders, but they are still respected for their stamina and endurance.</p><h2>Stormlander</h2><p>Stormlanders are the main folk in the east. They are tall and strong and have been shaped by the harsh and great wilderness they live in. Typical Stormlanders are taller than other humans and have dark hair and black eyes. Only those from Ejdland differ from the typical Stormlander; they are blond and have blue eyes. Sometimes one may even find a Stormlander with yellow eyes, which is said to be the heritage from living side by side with trolls and other dark breeds.</p><h2>Virann</h2><p>The humans living in the far west are called Viranns. The typical Virann is blond and has gray or dark brown eyes. They are not known for great strength or constitution but rather for their wisdom and knowledge. Ever since they settled down and learned agriculture, the Viranns have valued the pursuits of knowledge above those of strength and war.</p> | <p>Les filles et fils de la race humaine vivent aux quatre coins de Trudvang. Depuis leur premier lever de soleil, ils se sont adaptés à leur environnement comme aucune autre race. À l’est, vivent les Stormlanders ; au Mittland, les descendants des rois de Tronland ; et loin à l’ouest, les sages Viranns. En marge de ces peuples, des sauvages vivent cachés dans les forêts profondes et les montagnes.</p><h2>Les Mittlanders</h2><p>Autrefois, les Mittlanders étaient appelés les Osttronlanders, ou Tronlanders de l’est. Cette culture humaine a des traditions anciennes et complexes. Selon la légende, les Mittlanders descendent des Tronlanders et vécurent dans les contrées sauvages loin à l’est pendant des millénaires avant de revenir dans l’Ouest. Les Mittlanders sont fiers et honorables, et considèrent le courage comme la valeur la plus élevée qui soit. Les Mittlanders typiques ne sont pas aussi grands et forts que la plupart des Stormlanders, mais ils sont néanmoins respectés pour leur résistance et leur endurance.</p><h2>Les Stormlanders</h2><p>Les Stormlanders sont le peuple principal vivant dans l’Est. Ils sont grands et forts, et ont été façonnés par les terres sauvages vastes et rigoureuses sur lesquelles ils vivent. Les Stormlanders typiques sont plus grands que les autres humains, et ont les cheveux sombres et les yeux bleus. Parfois, on peut rencontrer un Stormlander aux yeux jaunes, dont on dit qu’ils seraient l’héritage d’une vie passée aux côtés des trolls et d’autres sombres espèces.</p><h2>Les Viranns</h2><p>Les humains qui vivent loin dans l’Ouest sont appelés les Viranns. Le Virann typique est blond et a des yeux gris ou marron foncé. Ils ne sont pas réputés pour avoir une force ou une constitution importante, mais plus pour leur sagesse et leurs connaissances. Depuis qu’ils se sont installés et ont découvert l’agriculture, les Viranns accordent plus de valeur à la quête de connaissances qu’à la force et à la guerre.</p><h2>Les Sauvages</h2><p>Les peuples sauvages traditionnels sont un mélange de différentes tribus : les Amures, qui vivent dans les montagnes du nord-ouest, les Thoorkaals du sud-ouest, et les tribus et clans sauvages et barbares qui demeurent dans les régions nordiques de Trudvang. La plupart des peuples sauvages vénèrent les dieux des ténèbres et croient en Haminges. Ils sont brutaux et durs, et sont réputés pour exceller à la guerre et au combat. Ils sont habituellement plus petits, moins intelligents et plus forts que le Stormlander moyen.</p><h2>Les demi-trolls</h2><p>Il existe de nombreuses histoires au sujet de trolls faisant usage de leur magie immonde sur des humains pour engendrer des rejetons. Demi-troll est le nom donné habituellement à la progéniture d’un humain et d’un troll. Le demi-troll typique est grand et bestial, et partage des traits communs aux humains et aux trolls. Gardez à l’esprit que « demi-troll » n’est qu’un nom de race. Les demi-trolls élevés par des humains tendent à avoir également une culture humaine. Ce qui signifie qu’un demi-troll peut être un ogro des peuples sauvages ou bien une brute grise stormlander.</p><h2>Les changelins</h2><p>Un changelin est un croisement entre un humain et un troll des forêts. Il est plus petit qu’un humain moyen, et a une peau brunâtre et les yeux jaunes. Tout comme les trolls, certains changelins ont aussi une queue semblable à celle des vaches.</p><h2>Les brutes grises</h2><p>Une brute grise est la progéniture d’un humain et d’un troll gris. Les brutes grises sont habituellement plus grandes et plus charpentées qu’un humain. Elles tiennent essentiellement de leur parent troll : elles ont une forte pilosité corporelle, des yeux jaunes, un gros nez et de grandes oreilles.</p><h2>Les ogros</h2><p>Un ogro est un croisement entre un humain et un ogre. Il est beaucoup plus grand qu’un humain, mais moins intelligent. Sa peau est grise ou verte, et aussi épaisse que du cuir. Certains ogros ont les yeux bleus, mais la plupart ont les yeux jaunes des trolls, et tout comme les changelins, une longue queue.</p> |

## `TRUDVANG.Content.Journal.elf`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.elf.Name` | Elves | Elfes |
| `TRUDVANG.Content.Journal.elf.Content` | <p>chapter 1. the character \| 21</p><h2>Barkbrule</h2><p>Barkbrule is the name of a cross between Korpikalli and humans. Just like a Dyfir, the Barkbrule breed is shorter and slimmer than a human and much like a Korpikalli. The main difference is that a Barkbrule tends to have pitch-black eyes and dark hair.</p><h2>Half-Elves</h2><p>For as long as humans have had contact with the elves, their blood has mixed. Half-elves are generally beautiful like elves, with long, silver hair and slimmer bodies than humans.</p><h2>Dyfir</h2><p>Dyfir is the name of a mix between Illmalaini and humans. A Dyfir tends to be both shorter and slimmer than a human. Usually their skin is white and pale and their eyes dark. The old stories say that the elves were the first race to set foot in Trudvang. Supposedly , they came from the dark void, riding on rays of light, led by the gods. Over the course of eons, the elves split into two sub-races: the traditional Illmalaini (the star elves) and the wild Korpikalli (the dark elves).</p><h2>Illmalaini</h2><p>The Illmalaini elves are highborn and consider themselves superior to all other races in Trudvang. Their lives are focused on one major task: to connect with the gods once again. Why did the gods leave the elves chained to Trudvang, without any answers? The Illmalaini guard the ancient secrets and knowledge and perceive their future as an even bigger step away from the gods. In appearance, these elves are quite tall, with silvery white hair and pale white skin.</p><h2>Korpikalli</h2><p>The Korpikalli elves have abandoned the old traditions to seek their new future in the dark woods. When the gods left the elves, the Korpikalli decided to leave the gods behind as well. They don’t care about those gods anymore. In fact, they disdain and scorn the absent deities. The typical Korpikalli has black hair and dark eyes, with a body shaped from life in the wild woods. These elves embrace nature, which they worship with reverence. The Korpikalli are more aggressive than the Illmalaini.</p> | <p>D’anciennes histoires racontent que les elfes furent la première race à mettre les pieds en Trudvang. Ils seraient venus du vide obscur, chevauchant des rayons de lumière, guidés par les dieux. Au fil des éons, les elfes se sont divisés en deux sous-races : les traditionnels illmalainas (les elfes des étoiles) et les farouches korpikallas (les elfes sombres).</p><h2>Les illmalainas</h2><p>Les elfes illmalainas sont nobles et considèrent être supérieurs à toutes les autres races de Trudvang. Leur vie est consacrée à une tâche majeure : entrer à nouveau en contact avec les dieux. Pourquoi ces derniers ont-ils abandonné les elfes, enchaînés à Trudvang, sans leur donner d’explication ? Les illmalainas sont les gardiens d’anciens secrets et connaissances, et voient leur avenir comme une étape les éloignant encore plus des dieux. Du point de vue physique, ces elfes sont plutôt grands, et ont les cheveux blanc argenté et la peau pâle.</p><h2>Les korpikallas</h2><p>Les elfes korpikallas ont abandonné les anciennes traditions pour partir à la recherche de leur avenir, au fond des sombres forêts. Lorsque les dieux abandonnèrent les elfes, les korpikallas décidèrent de les abandonner également. Ils ne se préoccupent plus des dieux. En réalité, ils n’ont que mépris et dédain pour les divinités absentes. Les korpikallas typiques ont les cheveux noirs et les yeux sombres, et leur corps a été façonné par la vie dans les bois sauvages. Ces elfes ont adopté la nature, qu’ils vénèrent avec révérence. Les korpikallas sont plus agressifs que les illmalainas.</p><h2>Les demi-elfes</h2><p>Depuis que les humains ont été en contact avec les elfes, leurs sangs se sont mêlés. Les demi-elfes sont généralement aussi beaux que les elfes, et ont un corps plus fin que celui des humains.</p><h2>Les dyfirs</h2><p>Dyfir est le nom que l’on donne au mélange entre illmalainas et humains. Les dyfirs ont tendance à être à la fois plus petits et plus fins que les humains. Habituellement, ils ont la peau blanche et pâle, de longs cheveux argentés et des yeux sombres.</p><h2>Les barkbrules</h2><p>Barkbrule est le nom que l’on donne au croisement entre korpikallas et humains. Comme les dyfirs, les barkbrules sont plus petits et plus minces que les humains, et ressemblent aux korpikallas. La différence principale est que les barkbrules ont tendance à avoir les yeux d’un noir profond et les cheveux bruns.</p> |

## `TRUDVANG.Content.Journal.dwarf`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.dwarf.Name` | Dwarves | Nains |
| `TRUDVANG.Content.Journal.dwarf.Content` | <p>chapter 1. the character \| 23 shared the mountains as their home, and thus came a mixed breed from the darkness. Zvorda are much bigger than a typical dwarf but smaller than a gray troll. Some say that the Zvorda have the temper of a troll and the persistence of a dwarf. Most Zvorda tend to have a dwarvish culture since, given the mysterious nature of the Norgavaina and how they reproduce, the Zvorda are almost never raised among the trolls. They commonly trade with humans, and therefore spend much of their time on the surface. The Borjornikkas are superstitious and value tradition, much like the Illmalaini elves do.</p><h2>Buratja</h2><p>The Buratja dwarves are a rare breed that live deep in the earth. Most of them have never even seen the sun or been outside their mountains. They have extraordinary stamina and constitution and pray to their fiery forges as if they were gods. Buratjas value smithing and forging above all else. Their bodies are covered with a thick layer of soot and their eyes shine brightly in the dark. These dwarves have thick and bushy hair but shorter beards than the Borjornikkas.</p><h2>Dwarf-Trolls</h2><p>Zvorda is the dwarvish name for the offspring of a dwarf and a troll. Dwarves and trolls have always Deep down in the mountains lives the quiet and leisurely race of dwarves. No one knows when they first came to Trudvang or who created them. Some say the dwarves are part of the mountains themselves, while others say that the god Borjorn created them to serve him. The female dwarves are mysterious beings that dwell in the darkest and deepest caves, deep down below the surface of the earth. There are very few dwarf men who in adulthood have seen these women, called Norgavaina by dwarves, and they are described as short, beautiful creatures with fair skin and not nearly as rough as the male dwarves are. Male dwarves live in brotherhoods and clans and are separated from the females. ✦ Dwarves can see up to 10 meters with a weak light source as if it were day.</p><h2>Borjornikka</h2><p>The Borjornikkas are the most common dwarves in Trudvang. They live under the earth in great cities and halls.</p> | <p>Loin dans les profondeurs des montagnes vivent les nains, paisibles et agréables. Personne ne sait d’où ils sont venus avant de s’établir en Trudvang, ni qui les a créés. Certains disent que les nains font partie des montagnes ellesmêmes, tandis que d’autres pensent que le dieu Borjorn les a créés pour le servir. Les naines sont des êtres mystérieux qui vivent dans les cavernes les plus sombres et les plus profondes, loin sous la surface de la terre. Il existe peu de nains qui, au cours de leur vie, ont pu voir ces femmes, que les nains appellent les norgavainas. Elles sont décrites comme de magnifiques créatures de petite taille, à la peau claire, et loin d’être aussi rudes que le sont les nains. Avec une faible source lumineuse, les nains peuvent voir comme en plein jour jusqu’à dix mètres.</p><h2>Les borjornikkas</h2><p>Les borjornikkas sont les nains les plus communs de Trudvang. Ils vivent sous terre dans de grandes cités et halles. Ils font couramment du commerce avec les humains, et, de ce fait, passent une bonne partie de leur temps à la surface. Les borjornikkas sont superstitieux et, comme les elfes illmalainas, sont attachés aux traditions.</p><h2>Les buratjas</h2><p>Les nains buratjas sont une espèce rare qui vit loin sous terre. La plupart d’entre eux n’ont même jamais vu le soleil ni ne sont sortis de leurs montagnes. Ils ont une endurance et une constitution extraordinaires, et prient leurs forges ardentes comme si c’était des dieux. Les buratjas placent le forgeage au-dessus de tout. Leur corps est couvert d’une épaisse couche de suie et leurs yeux brillent intensément dans l’obscurité. Ces nains ont les cheveux épais et touffus, mais leur barbe est plus courte que celle des borjornikkas.</p><h2>Les nains-trolls</h2><p>Zvorda est le nom nain donné à la progéniture d’un nain et d’un troll. Les nains et les trolls partagent depuis toujours les montagnes comme lieu de vie, ce qui a conduit cette race croisée à émerger des ténèbres. Les zvordas sont bien plus grands que les nains typiques mais plus petits que les trolls gris. Certains disent que les zvordas ont le tempérament d’un troll et la persévérance d’un nain. La plupart des zvordas ont tendance à avoir une culture naine car, du fait de la nature mystérieuse des norgavainas et de leur façon de se reproduire, les zvordas ne sont pratiquement jamais élevés parmi les trolls.</p> |

## `TRUDVANG.Content.Journal.dimwalker`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.dimwalker.Name` | Dimwalker | Arpenteur des brumes |
| `TRUDVANG.Content.Journal.dimwalker.Content` | <p>chapter 1. the character \| 27 prepared as possible for when their lives in Trudvang end so they will be able to walk through the storm without the help of Enken, for those who do will get a place at Tabarast, Stormi’s table, in the mythical hall of Jarnglimma.</p><h2>Virann Dimwalkers</h2><p>The dimwalkers of Westmark have nearly unlimited power. There are few people or powers that may question the authority of even a single dimwalker. The dimwalkers of the Tenet of Nid are called “Gavlians.” They receive their holy powers by praying to and serving the One God, Gave. Some gavlians serve their entire lives in a distant monastery and never see what is outside the tall walls. But there are those who have no fixed point in life, but seek the grace of Gave far from the boundaries of their homes. For the power of Gave is so great that it reaches all the way from the holy land of Viranne in the west to Dranvelte in the east. Younger gavlians, so-called venerables, are often apprentices to accomplished gavlians, and it is not uncommon for those with experience to have several venerables under their tutorship.</p><h2>Wildfolk Dimwalkers</h2><p>Dimwalkers among the Wildfolk are mostly followers that tie themselves with dangerous and powerful spirits in order to extend their power. There are many names for the dimwalkers of the Wildfolk, but most adopt the tribal roles of “vigan,” “gellti,” and “mastru.” A vigan is the leader of the tribe, whose sole purpose is combat and defeating others. The gellti is the tribe’s dark mother, granting life and health as well as taking it. Cunning and bewildering, the mastru is the trickster of the tribe. Apart from these three types, there are other dimwalkers that are called with names like “arkorja,” “honnajorl,” or “thowatz” that, in one way or another, all mean something along the lines of a claimer or coercer of spirits. Thowatz, or gorger, however, is the most common name for those who subject themselves to the darkest of all divine teachings. the god of creation, has blessed. There is nothing more important to the Thuuls than the artifact they have created, and so strong is the bond to this item that they believe that fate has woven them to it.</p><h2>Mittlander Dimwalkers</h2><p>There are many heroes and honorable sons and daughters who form pacts and take oaths of blood in order to be granted the strange and mysterious gifts of the Eald Tradition. The real dimwalkers, those who once ruled over the steppes and the keeps, live a more secluded life. They are called “lairds” and are chiefs in villages where people are still followers of the Eald Tradition. In ancient times only those who had sworn pacts with the Flowras could be called “lairds”, but during the last few centuries it has become common for all the chieftains who have devoted themselves to the Eald Tradition to take this title. The heroes and heroines who have not taken the responsibility to lead a village or to acquire a piece of land under the ancient tradition, but who still have learned its divine abilities, are called “malhewens,” after Malhewen the Trollseeker. Many malhewens live a life on the road, serving a higher purpose. They meddle little in the day-to-day dealings of other folk, since their oaths require them to be above the mundane. Their lives are a constant search for an opportunity to fulfill their purpose and serve a tradition that goes back thousands of years.</p><h2>Stormlander Dimwalkers</h2><p>The “stormikjalts” are those who serve the violent god Stormi and his subordinates. The meaning of stormikjalt is broad, but the most established is “they who serve Stormi with an iron fist,” since a “kjalt” is a person who brings somebody to their knees with an ironclad hand. The stormikjalts are callous and upright and waste no time on pity , they act in the name of Stormi or one of the other storm gods and have given themselves to the Gerbanic faith to protect the weak and ward off the gods of chaos. Their ultimate goal, however, is to be as Dimwalkers live in the name of their god(s). They pray and connect with a divine power to receive special abilities and skills. Stormlanders pray to the Stormasirs, Mittlanders to the spirits of nature, and Viranns to the one god Gave. Common among all dimwalkers is that they devote their lives to a higher power, a belief, and a faith in the divine.</p><h2>Elven Dimwalkers</h2><p>It is strange, but the elves have no official dimwalkers and no complicated religious hierarchy. Even though their traditions and customs are based entirely on gods and their tales, they are not in contact with any gods, unlike the humans and dwarves. Some say that the elves carry a curse, while others claim that they are immaculate and thus need no gods. Some elves, however, are born with something that may be likened to divine abilities. Naturally , the elves themselves believe that these abilities are a legacy , a gift, from the gods that they lived side by side with at the dawn of time. The elves who carry one of these abilities are called “Ihana.” They are considered to be quite valuable to the elven community and are often keepers of tradition, living alongside the immortal elves, for only the Ihana are believed to be able to partake in the traditions that live on since the Age of Dreams.</p><h2>Dwarven Dimwalkers</h2><p>There are not many dimwalkers among the dwarves, since few of them manage to master the mysterious runes and receive the secrets of the god Yukk. The dwarves who have chosen to take the holy path are called “Thuuls.” Thuuls interpret the mountain and the knowledge that lies buried deep beneath thousands of years of tradition and symbiosis with the stone. Oddly enough, it is only the gray dwarves that are capable of contacting the holy runes and powers. To all other dwarves, the gate is sealed and no one knows why. It is believed that a Thuul’s powers are in direct relationship with a special item they have made and which Borjorn,</p> | <p>Les arpenteurs des brumes vivent au nom de leur(s) dieu(x). Ils prient et entrent en contact avec la puissance divine pour recevoir des pouvoirs et des compétences particuliers. Les Stormlanders prient les Stormasirs, les Mittlanders les esprits de la nature, et les Viranns le dieu unique Gave. Le point commun entre tous les arpenteurs des brumes est qu’ils consacrent leur vie à une puissance supérieure, à une croyance et à une foi dans le divin.</p><h2>Arpenteurs des brumes elfes</h2><p>C’est étrange, mais les elfes n’ont pas d’arpenteurs des brumes officiels et aucune hiérarchie religieuse compliquée. Même si leurs traditions et coutumes sont entièrement basées sur les dieux et sur les récits à leur sujet, ils ne sont en contact avec aucun d’entre eux, contrairement aux humains et aux nains. Certains disent que les elfes seraient maudits, tandis que d’autres affirment qu’ils sont immaculés et n’ont donc pas besoin de dieux. Cependant, certains elfes sont nés avec quelque chose que l’on pourrait assimiler à des pouvoirs divins. Bien sûr, les elfes eux-mêmes pensent que ces pouvoirs sont un héritage, un don des dieux au côté desquels ils ont vécu à l’aube des temps. Les elfes qui bénéficient de ces pouvoirs sont appelés « ihanas ». Ils sont considérés comme très précieux pour la communauté elfique et sont souvent les gardiens de la tradition, vivant parmi les elfes immortels, car les elfes pensent que seuls les ihanas peuvent contribuer aux coutumes qui se perpétuent depuis l’Âge des Rêves.</p><h2>Arpenteurs des brumes nains</h2><p>Il n’y a pas beaucoup d’arpenteurs des brumes parmi les nains, car peu d’entre eux parviennent à maîtriser les runes mystérieuses et à recevoir les secrets du dieu Yukk. Les nains qui ont choisi de s’engager sur la voie sacrée sont appelés « thuuls ». Ils interprètent la montagne et la connaissance qui est enterrée profondément sous des milliers d’années de coutumes et de symbiose avec la pierre. Bizarrement, seuls les nains gris sont capables d’entrer en contact avec les runes et les pouvoirs sacrés. Pour tous les autres, la porte est scellée sans que personne ne sache pourquoi. On pense que les pouvoirs d’un thuul sont directement reliés à un objet spécial qu’ils ont créé et que Borjorn, le dieu de la création, a béni. Il n’y a rien de plus important pour les thuuls que l’artefact qu’ils ont créé, et le lien avec cet objet est si fort qu’ils sont convaincus qu’il a été tissé par le destin.</p><h2>Arpenteurs des brumes mittlanders</h2><p>De nombreux héros ainsi que des fils et filles honorables passent des pactes et prêtent des serments de sang afin de se voir accorder les dons étranges et mystérieux de l’Ancienne tradition. Les vrais arpenteurs des brumes, ceux qui autrefois régnaient sur les steppes et les forteresses, vivent une vie plus isolée. On les appelle les « lairds ». Ils sont les chefs des villages dont les habitants continuent de suivre l’Ancienne tradition. Dans les anciens temps, seuls ceux qui avaient scellé un pacte avec les Flowras pouvaient se voir attribuer le titre de « laird », mais au cours des derniers siècles, il est devenu courant pour tous les chefs qui se consacrent à l’Ancienne tradition de le porter. Les héros et héroïnes qui n’ont pas endossé la responsabilité de diriger un village ou d’acquérir des terres selon l’Ancienne tradition, mais qui ont tout de même appris ses pouvoirs divins sont appelés « malhewens », d’après Malhewen le Chercheur de trolls. De nombreux malhewens vivent sur la route au service d’un but noble. Ils s’immiscent peu dans les affaires du quotidien du peuple, leurs serments exigeant d’eux qu’ils s’élèvent au-dessus du commun des mortels. Leur vie est une recherche constante d’opportunités de remplir leur rôle et de servir une tradition qui remonte à des milliers d’années.</p><h2>Arpenteurs des brumes stormlanders</h2><p>Les « stormikjalts » sont les arpenteurs des brumes qui servent le violent dieu Storme, ainsi que ses subalternes. Le terme stormikjalt revêt plusieurs significations, mais la plus courante est « celui qui sert Storme avec un poing d’acier », « kjalt » désignant une personne qui fait s’agenouiller les autres avec une main gantée d’acier. Les stormikjalts sont insensibles et droits, et ne perdent pas de temps à s’apitoyer. Ils agissent au nom de Storme ou de l’un des autres dieux des tempêtes, et se sont donnés à la foi gerbanique pour protéger les faibles et repousser les dieux du chaos. Cependant, leur but ultime est d’être préparé autant que faire se peut au moment où leur vie sur Trudvang prendra fin afin de pouvoir marcher à travers la tempête sans l’aide d’Enken. Car ceux qui en sont capables se voient offrir une place à Tabarast, la table de Storme, dans le mythique palais de Jarnglimma.</p><h2>Arpenteurs des brumes viranns</h2><p>Les arpenteurs des brumes du Vastermark ont des pouvoirs quasi illimités. Il existe peu d’individus ou de puissances qui soient capables de remettre en cause l’autorité d’un seul arpenteur des brumes. Ceux de la Doctrine de Nid sont appelés les « gavliens ». Ils reçoivent leurs pouvoirs sacrés en priant et en servant le dieu unique, Gave. Certains gavliens servent leur dieu durant toute leur vie dans un monastère lointain et ne voient jamais ce qui se trouve à l’extérieur de ses hautes murailles. Mais il y a ceux qui n’ont pas d’attaches dans la vie, et recherchent la grâce de Gave loin des limites de leur village. Car la puissance de Gave est si grande qu’elle recouvre les territoires allant de la terre sainte de Viranne à l’ouest jusqu’au Dranvelte à l’est. Les gavliens les plus jeunes, nommés les vénérables, sont souvent les apprentis de gavliens accomplis, et il n’est pas rare que ceux qui ont de l’expérience aient plusieurs vénérables sous leur tutelle.</p><h2>Arpenteurs des brumes sauvages</h2><p>Les arpenteurs des brumes des peuples sauvages sont pour la plupart des disciples qui se sont liés à de dangereux et puissants esprits dans le but d’étendre leurs pouvoirs. On leur attribue de nombreux noms, mais la plupart endossent les rôles tribaux de « vigan », de « gellti » ou de « mastru ». Un vigan est un chef de tribu dont le seul but est le combat et la défaite des autres. La gellti est la sombre mère de la tribu, qui accorde la vie et la bonne santé autant qu’elle les retire. Rusé et déconcertant, le mastru est le filou de la tribu. En dehors de ces trois types d’arpenteurs des brumes, il en existe d’autres, qui portent des noms tels que « arkorja », « honnajorl » ou « thowatz » qui, d’une façon ou d’une autre, signifient tous quelque chose comme « revendicateur » ou « asservisseur d’esprits ». Cependant, thowatz (ou « glouton ») est le nom le plus courant donné à ceux qui se consacrent aux enseignements divins les plus sombres.</p> |

## `TRUDVANG.Content.Journal.bard`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.bard.Name` | Bard | Barde |
| `TRUDVANG.Content.Journal.bard.Content` | <p>chapter 1. the character \| 25 Tradition has it that harjonturs bring luck with them and that their music keeps evil spirits and gods of chaos at bay , which is why many berserkers (savage warriors) join up with them. There are harjonturs that only dance, too, called “haddings” and “haddingjas” (males and females, respectively).</p><h2>Virann Bards</h2><p>The Viranns have no established art of narrative, nor any aspirations to hear the tales of a bygone age. They do, however, appreciate dancing as an art form. Those who spellbind crowds with their dance in Westmark are called “fulkas,” and a skilled fulka knows almost all the dances that are allowed. In less respectable places, there are other stories about the fulkas. It is said that fulkas secretly belong to an ancient society of assassins and “ eitrspatters” (rogues who use poison). There are no doubts that the group is in many regards a secret society , but the fulkas themselves intend for mystery to be part of the dance experience, and with these secrets and dance moves they entrance their audiences.</p><h2>Wildfolk Bards</h2><p>The typical bard among the Wildfolk is old and feeble, an old man or woman who has seen it all but no longer has the strength to hunt the great spirits. Their tales are often about how to defeat a powerful spirit or about great killers who slew beasts thought undefeatable. Wildfolk bards gather their crowds around the fire during cold, dark nights and toss roots and herbs into it to make the flames crackle and shift in color. To the sound of drums they tell their weird tales. The Wildfolk call these storytellers “thowintuza” which in Wild Vrok means “someone who speaks to the fire.” of zorjorns meet, the sounds of their drums rumble through the great cavern halls. People who have seen or heard such a thing speak of a feeling so intense that it felt like a thousand thunders, and how their bodies shook and vibrated from the mighty sounds of the drums and horns.</p><h2>Mittlander Bards</h2><p>Of all the people of Trudvang, Mittlanders are the most proud and have the longest traditions when it comes to bards and chiefly storytellers. The Skwildhugla, an ancient society of keepers of tradition and storytelling, is so influential that no other society is said to have such power over people as they do. To be admitted to the Skwildhugla is no simple task and requires decades of training and roaming the lands before one is accepted. Bards not part of the Skwildhugla are often travelling storytellers, going from village to village to share their tales of heroes and valour. They sometimes play an instrument as well. Their stories are told in a certain metre called “skwild,” which is why the typical bard is called either “skwilde” or “skwilda,” depending on gender.</p><h2>Stormlander Bards</h2><p>As with the Wildfolk, the bards of the Stormlands are often those who had a different trade when they were younger, but as they grew older and weaker, they retired to farms where they now tell their stories. In the Stormlands, they are called “vudjun.” But there is another, much younger, kind of bard that can be seen around the Stormlands. They play “ stormharjas,” a stringed instrument, while they alternate between singing and telling tales of strange things. They are called the “harjonturs,” and since they travel from farm to farm, they often bring news to remote or desolate lands. Bards are well regarded and sought after all over Trudvang, especially in Mittland. They tell stories and sing songs about the past or the future. They gather the elders, children, men, and women around the crackling fire to tell tales about great heroes and deeds, fabulous and magical swords, and mythical creatures.</p><h2>Elven Bards</h2><p>The elves have always loved different kinds of stringed instruments and flutes. The instruments are often made out of parts of animals, such as the jaw of a pike or the antlers of a stag, on which strings are attached. The strings are in many cases made of the hair of the elves themselves. For thousands of years, the elves have bestowed upon the world beautiful music that makes wanderers of the forests fall asleep or forget where they were going. The elven bards are masterful musicians who can, without uttering a single word, convey a feeling or sensation. Like their dwarven peers, elven bards can play for hours, even days, before they stop and fall into a deep sleep. The elves who master these stringed instruments and flutes have many names, but most common of all is “kjolltalinja,” meaning “ring of the stars.”</p><h2>Dwarven Bards</h2><p>For the dwarves, drums and tall horns have always been associated with tradition and stories. Their way of entertaining is seldom done through words, but through drumbeats and horn blasts. For the same reason, it is common for dwarven bards to first learn playing both the small drum (the “rozorji”) and the large one (the “kalorva”), along with the mountain horn (the “rogduboki”). A “zorjorn,” as the drummers are called, can practice his art for days without interruption. When a gathering</p> | <p>Les bardes sont bien considérés et recherchés un peu partout en Trudvang, en particulier au Mittland. Ils racontent des histoires et interprètent des chants sur le passé ou l’avenir. Autour d’un feu crépitant, ils rassemblent anciens et enfants, hommes et femmes, pour leur conter des récits impliquant de grands héros, où il est question de faits d’armes fabuleux, d’épées magiques et de créatures mythiques.</p><h2>Bardes elfes</h2><p>Les elfes ont toujours aimé les différents types d’instruments à cordes et les flûtes. Leurs instruments sont souvent réalisés avec des parties de corps d’animaux, comme la mâchoire d’un brochet ou les bois d’un cerf, sur lesquelles ils attachent des cordes. Souvent, celles-ci sont faites avec les cheveux des elfes euxmêmes. Durant des milliers d’années, les elfes ont fait profiter le monde d’une musique magnifique qui fait s’endormir ceux qui s’aventurent dans les forêts, ou leur fait oublier où ils se rendent. Les bardes elfes sont des musiciens magistraux qui peuvent transmettre un sentiment ou une sensation sans prononcer le moindre mot. Comme leurs homologues nains, ils peuvent jouer pendant des heures et même des jours avant de s’arrêter et de sombrer dans un sommeil profond. Les elfes qui maîtrisent les instruments à cordes et les flûtes portent de nombreux noms, mais le plus courant de tous est « kjolltalinja», qui signifie « son des étoiles ».</p><h2>Bardes nains</h2><p>Pour les nains, les tambours et de grands cors ont toujours été associés à la tradition et aux récits. Chez eux, le divertissement s’appuie rarement sur les mots, mais plutôt sur les battements de tambour et le son des cors. C’est la raison pour laquelle il est courant que les bardes nains commencent par apprendre à jouer à la fois du petit tambour (le « rozorji »), du grand (le « kalorva »), et du cor des montagnes (le « rogduboki »). Un « zorjorn », tel que sont nommés les batteurs de tambour, peut pratiquer son art pendant des jours sans interruption. Lorsque des zorjorns se rencontrent, le son de leurs tambours gronde à travers les cavernes. Tous ceux qui ont assisté à un tel événement disent avoir ressenti quelque chose de si intense qu’ils ont eu une sensation semblable à des milliers de grondements de tonnerre, le puissant son des tambours et des cors faisant trembler et vibrer leur corps.</p><h2>Bardes mittlanders</h2><p>De tous les peuples de Trudvang, les Mittlanders sont les plus fiers et ont les plus anciennes traditions en ce qui concerne les bardes et surtout les conteurs. On dit que la Skwildhugla, une ancienne société de gardiens des traditions et des contes, a tellement d’influence qu’aucune autre société n’a autant de pouvoir qu’elle sur le peuple. Entrer dans la Skwildhugla n’est pas une mince affaire et nécessite de passer des décennies à travailler et à parcourir les terres avant d’être accepté. Les bardes qui n’appartiennent pas à la Skwildhugla sont souvent des conteurs itinérants, qui vont de village en village pour partager leurs histoires de héros et de faits héroïques. Parfois, ils jouent également d’un instrument. Pour narrer leurs histoires, ils utilisent des vers particuliers appelés « skwild », qui donnent leur nom aux bardes traditionnels, « skwilde » ou « skwilda » selon qu’il s’agisse d’hommes ou de femmes.</p><h2>Bardes stormlanders</h2><p>Comme chez les peuples sauvages, les bardes des Stormländer avaient souvent une autre occupation lorsqu’ils étaient plus jeunes, mais en vieillissant et en s’affaiblissant, ils se sont retirés dans des fermes où ils racontent à présent leurs histoires. Dans les Stormländer, ils sont souvent appelés « vudjuns ». Mais il existe aussi une autre sorte de barde, plus jeune, que l’on peut voir dans les Stormländer. Ils jouent du « stormharjas », un instrument à cordes, et alternent chant et narration de contes parlant de choses étranges. On les appelle les « harjonturs », et comme ils voyagent de ferme en ferme, ils apportent souvent des nouvelles dans les terres lointaines et désolées. Selon la tradition, les harjonturs apportent avec eux la chance, et leur musique tient à l’écart les esprits maléfiques et les dieux du chaos, raison pour laquelle de nombreux berserkers, des guerriers sauvages, se joignent à eux. Il existe également des harjonturs qui ne font que danser. On les appelle les « haddings » et les « haddingjas », selon qu’il s’agisse d’hommes ou de femmes.</p><h2>Bardes viranns</h2><p>Les Viranns n’ont pas particulièrement établi d’art de la narration, et n’aspirent pas à entendre les récits d’époques révolues. En revanche, ils considèrent la danse comme une forme d’art. Au Vastermark, ceux qui envoûtent les foules par leur danse sont appelés « fulkas ». Un fulka compétent connaît presque toutes les danses autorisées. En des endroits moins respectables, on peut entendre d’autres histoires au sujet des fulkas. On dit qu’ils appartiennent en secret à une ancienne société d’assassins et « d’eitrspatters », des malfrats qui utilisent du poison. Il ne fait aucun doute que ce groupe est, à de nombreux égards, une société secrète, mais les fulkas eux-mêmes font en sorte que le mystère fasse partie du spectacle, et, grâce à ces secrets et aux figures de danse, ils enivrent leur public.</p><h2>Bardes sauvages</h2><p>Le barde typique au sein des peuples sauvages est âgé et faible, un vieil homme ou une vieille femme qui a vu bien des choses mais n’a plus la force de chasser les grands esprits. Les récits ont souvent pour objet d’expliquer comment vaincre un esprit puissant, ou concernent les grands tueurs, ceux qui ont abattu des bêtes que l’on disait invincibles. Pendant les nuits froides et sombres, les bardes des peuples sauvages rassemblent leur public autour du feu, jettent dedans des racines et des herbes, faisant crépiter et changer de couleur les flammes. Accompagnés du son des tambours, ils racontent leurs étranges récits. Les peuples sauvages appellent ces conteurs les « thowintuzas », ce qui, en vrok sauvage, siginifie « celui qui parle au feu ».</p> |

## `TRUDVANG.Content.Journal.dweller`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.dweller.Name` | Dweller | Colon |
| `TRUDVANG.Content.Journal.dweller.Content` | <p>chapter 1. the character \| 29 work, especially if they cannot join the jarl’s hirdmen for one reason or another, and instead move from farm to farm looking for work. Additionally , most dwellers are capable hunters, since the harsh and ruthless weather makes farming life unstable at best. Hunting and fishing are important sideline activities for many dwellers in the Stormlands.</p><h2>Virann Dwellers</h2><p>The Viranns are large-scale dwellers and all the farms in Westmark are big and well off. The largest farms keep cattle, tend the fields, have craftsmen, and try to make a profit off the surplus. Westmark dwellers are well versed in farming, trading, and languages. In this part of Trudvang, there are also dwellers who live inside, or just outside, the walls of a city. They are often referred to as “wall dwellers,” but other common names for them are “barrow peddlers” (since they sell their wares from barrows and carts), “market traders,” or the more derogatory “dung draggers,” since their shoes tend to track in animal droppings from the roads.</p><h2>Wildfolk Dwellers</h2><p>Among the Wildfolk there are no distinct dwellers, since they seldom live on farms. Their communities are temporary settlements or crossroads, and it is uncommon for them to make use of this practice. However, there are some among the Wildfolk who keep herds of reindeer or goats, and gatherers who collect wild herbs, roots, mushrooms, and anything else that is edible and of use for the tribe. A Wildfolk dweller is often very knowledgeable about the flora and fauna, as well as about trading.</p><h2>Mittlander Dwellers</h2><p>In Mittland the farms are larger and more widespread than in the Stormlands. The dwellers gather in teams and specialize in certain tasks, such as agriculture, cattle raising, or crafting. They are not as bound to a single farm as much as the Viranns are, but it is still common practice for the free dwellers to stay at one place for a couple of years before the teams move on. The sense of community is important for dwellers in Mittland, and most of them spend their entire lives, or most of it, with the same team. Dwellers seek to own farms, and those who do are respected. They might keep horses or cattle, or just farm the lands. In rare cases, they occupy themselves exclusively with craftsmanship. It is not uncommon to meet a Mittlander dweller who has learned another language to simplify trading with peddlers from faraway lands. While farmers in the Stormlands strive to be self-sufficient, the dwellers of Mittland also seek to sell off their surplus in order to further secure their well-being and income.</p><h2>Stormlander Dwellers</h2><p>Dwellers in the Stormlands often live by a jarl’s keep and the societies around them, but demand for their supplies is often too small for them to stay for an extended period of time in one place. Peddlers have to walk from farm to farm to support themselves and must pay a fee for the jarl’s blessing to sell their wares. In the Stormlands, dwellers are most commonly found as farmhands and maids, charged with the various tasks of agricultural life: tilling, crafting, building, or cattle raising. Unless they are serfs, dwellers receive a small amount of payment for their Dweller is the common name for people living off the land. They settle down in a small village or town and try to use their skills to survive. A dweller is good at agriculture, blacksmithing, and woodcraft. Some have a permanent home, while others go from village to village seeking employment that lets them use their talents. They collect, produce, sell, and sometimes hunt for their survival. Some dwellers serve as “hirdmen” or sellswords in a chieftain’s guard and are as good with a sword as they are with a plow.</p><h2>Elven Dwellers</h2><p>It is largely uncommon for elves to have big farms or to gather in one place. They often wander from place to place with their herds (usually reindeer) or stay briefly where wild crops are abundant. Elven dwellers are often as good with a hunting bow and fishing rod as they are at tending their herds. However, there are also the “Koivhas,” especially among the light elves, who remain in one place and tend to the land with their abilities. These sedentary elves learn how to make use of what the land offers, and never abuse it for their own gain.</p><h2>Dwarven Dwellers</h2><p>Dwarven dwellers are almost exclusively smiths or miners. There are not many dwarves who keep to traditional farming or cattle raising, but some do grow mushrooms underground or keep domestic pigs in the mine tunnels. Smiths are held in high regard since they work and transform the force of the great god Borjorn into items which is his purpose. Mining is a heavy and tiresome labor, and some dwarven miners enjoy a higher status than others. Those who mine coal for the furnaces are not as appreciated as those who mine ore. Crafting is also common among dwarven dwellers.</p> | <p>Colon est le nom communément donné aux personnes qui vivent de la terre. Ils s’installent dans un petit village ou une petite ville, et tentent de survivre grâce à leurs savoir-faire. Un colon peut être agriculteur, forgeron, ou encore sculpteur de bois. Certains ont une résidence permanente, tandis que d’autres vont de village en village à la recherche d’un emploi dans lequel ils pourront mettre en œuvre leurs talents. Ils recueillent, produisent, vendent et parfois chassent pour survivre. Certains colons servent en tant que « hirdmen », ou mercenaires, dans la garde d’un chef, et sont aussi efficaces avec une épée qu’ils le sont avec une charrue.</p><h2>Colons elfes</h2><p>Il est très inhabituel pour les elfes d’avoir de grandes fermes ou de se rassembler en un même lieu. Ils errent souvent d’un endroit à l’autre avec leurs troupeaux (habituellement de rennes) ou restent brièvement là où les plantes sauvages sont abondantes. Souvent, les colons elfes sont aussi habiles avec un arc de chasse ou une canne à pêche que pour s’occuper de leurs troupeaux. Cependant, il existe aussi, en particulier chez les elfes lumineux, des « koivhas » qui sont attachés à un lieu et cultivent la terre. Ces elfes sédentaires apprennent à exploiter ce que la terre a à offrir et n’en abusent jamais pour leur profit personnel.</p><h2>Colons nains</h2><p>Les colons nains sont presque exclusivement des forgerons ou des mineurs. Peu de nains s’adonnent à l’agriculture traditionnelle ou à l’élevage de bétail, mais certains cultivent les champignons sous terre ou gardent des cochons domestiques dans les tunnels des mines. Les forgerons sont tenus en haute estime du fait qu’ils travaillent et transforment la force du puissant dieu Borjorn en objets, ainsi qu’il le souhaite. L’extraction minière est un travail difficile et épuisant, et certains mineurs nains aiment avoir un statut social plus élevé que les autres. Ceux qui exploitent le charbon pour les fourneaux ne sont pas aussi appréciés que ceux qui exploitent les minerais. L’artisanat est également courant chez les colons nains.</p><h2>Colons mittlanders</h2><p>Au Mittland, les fermes sont plus grandes et plus étendues que dans les Stormländer. Les colons se rassemblent en groupes et se spécialisent dans certaines tâches, telles que l’agriculture, l’élevage de bétail ou l’artisanat. Ils ne sont pas aussi liés à une ferme que le sont les Viranns, mais il est courant que les colons libres restent à un endroit pendant un ou deux ans avant que le groupe reprenne la route. Le sentiment d’appartenir à une communauté est important pour les colons du Mittland, et la plupart d’entre eux passent l’essentiel de leur vie, voire leur vie tout entière, avec le même groupe. Les colons cherchent à être propriétaires d’une ferme, et ceux qui y parviennent sont respectés. Ils peuvent garder des chevaux ou du bétail, ou simplement cultiver les terres. Dans de rares cas, ils se consacrent exclusivement à l’artisanat. Il n’est pas rare de rencontrer un colon mittlander qui a appris une autre langue pour faciliter les échanges avec des colporteurs venus de pays lointains. Si les fermiers des Stormländer s’efforcent d’être autosuffisants, les colons du Mittland quant à eux cherchent également à vendre leurs surplus afin d’améliorer leur bien-être et leurs revenus.</p><h2>Colons stormlanders</h2><p>Les colons des Stormländer vivent souvent à proximité de la forteresse du jarl et des populations qui les entourent, mais la demande pour leur production est souvent trop faible pour qu’ils restent longtemps en un même endroit. Les colporteurs vont de ferme en ferme pour subvenir à leurs besoins et doivent payer une taxe pour obtenir l’autorisation du jarl de vendre leurs marchandises. Dans les Stormländer, les colons sont souvent employés comme ouvriers agricoles ou comme servantes, chargés des diverses tâches de la vie agricole : les labours, l’artisanat, la construction ou l’élevage de bétail. À moins d’être des serfs, les colons reçoivent un petit paiement en échange de leur travail, en particulier s’ils ne peuvent intégrer les hirdmen du jarl pour une raison ou une autre, et vont plutôt de ferme en ferme à la recherche de travail. De plus, la plupart des colons sont des chasseurs habiles, les hivers rigoureux et impitoyables rendant la vie agricole instable dans le meilleur des cas. La chasse et la pêche sont un à-côté important pour de nombreux colons dans les Stormländer.</p><h2>Colons viranns</h2><p>Les Viranns sont des colons de grande envergure, et toutes les fermes de Vastermark sont grandes et se portent bien. Les plus grandes fermes ont du bétail, cultivent les champs, hébergent des artisans et essaient de faire du profit à partir des surplus. Les colons du Vastermark connaissent bien l’agriculture, le commerce et les langues. Dans cette région de Trudvang, il existe également des colons qui vivent entre les murs, ou juste à l’extérieur, des cités. On les nomme souvent les « colons des cités », mais ils portent d’autres noms courants comme « colporteur à brouette » (en raison du fait qu’ils vendent leurs marchandises contenues dans des brouettes ou des charrettes), « commerçant de marché » ou le plus péjoratif « traîne-fumier », leurs chaussures ayant tendance à piétiner les excréments des animaux sur la route.</p><h2>Colons sauvages</h2><p>On ne peut pas vraiment distinguer de colons parmi les peuples sauvages, étant donné qu’ils vivent rarement dans des fermes. Leurs communautés se rassemblent autour d’installations provisoires ou de croisées des chemins, et il n’est pas courant pour eux de s’adonner à cette activité. Cependant, parmi les peuples sauvages, certains gardent les troupeaux de rennes ou de chèvres, et d’autres récoltent les herbes sauvages, les racines, les champignons, et tout ce qui est comestible ou peut être utile à la tribu. Un colon sauvage a souvent une grande connaissance de la flore et de la faune, ainsi que du commerce.</p> |

## `TRUDVANG.Content.Journal.warrior`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.warrior.Name` | Warrior | Guerrier |
| `TRUDVANG.Content.Journal.warrior.Content` | <p>chapter 1. the character \| 37 The warrior is the backbone of an adventuring party. They usually put faith in no god but in their own sword and strength. The fierce and supernatural berserkers from the Stormlands are respected and feared, just like the holy warriors in the far west. A warrior serves to protect others and to die with their sword in one hand and their axe in the other.</p><h2>Elven Warriors</h2><p>As with the Wildfolk, it is common for elvish warriors to be hunters first and warriors second. During peacetime, they hunt food for their tribe, and when trouble arises, they don leather armor and bring forth battle clubs. The warriors who protect the care trees are called the “Puvartija.” Specially trained, they are able to stay for long periods of time in the wilderness of the forests, patrolling and protecting the grounds where the care trees grow. They work mostly in pairs, and spend most of their time away from their tribe.</p><h2>Dwarven Warriors</h2><p>There are two kinds of warriors among the dwarves: the “Zvordorkûm” and the “Logovorda.” In the olden days, the Zvordorkûm bore mighty zvordorkûm-maki armor; however, today they are generally associated with defensive fighting in heavy armor. They bear fear- inspiring masks, helmets, and chest plates, all in iron, called “murgles,” and they are known all over Trudvang to be nighimpossible to defeat in battle. The Logovorda are warriors who often work in the mines, thus learning the ways of spear and pick. When the drums of war call once again, they emerge from the dark tunnels to fight behind the Zvordorkûm with long spears.</p><h2>Mittlander Warriors</h2><p>The warriors of Mittland are often divided into two groups: weapon masters and spearmen. Weapon masters worship their weapons, are taught secret techniques, and live to master their skills and prowess on the battlefield. It is not uncommon to see weapon masters make alliances with others of their kind. In these cult-like alliances, they swear oaths to protect each other, to fight, and even to die together on the same battlefields. Mighty ring breakers and speargothis often have weapon masters in their service, partly to protect themselves and partly to educate their spearmen in the noble art of fighting. Like the hirdmen in the Stormlands, the spearmen live close by their gothi or king as guardians and warriors under their banner. There are many mythical spearmen in Mittland; the “Borgwarths” are the most famous and revered. The spearmen are often skilled in fighting on horseback, and they spend many days and nights by their horse to form strong connections. For warriors of Mittland, courage is all that matters. When warriors die, it is said that they die because of their courage and what it has brought them. Whether it be in anger, sorrow, melancholy , recklessness, or heroism, it is because they sought to be a hero for a greater cause.</p><h2>Stormlander Warriors</h2><p>In the Stormlands, warriors are usually either berserkers or hirdmen. Berserkers are savages, bloodthirsty axe- and swordsmen capable of going into a battle rage. It is said that they can shift into the forms of bears, wolves, and other wild animals. In battle, these shapeshifters care nothing for shields or helmets, feel neither pain nor fear, and cut down all in their path. The berserkers of the Stormlands are feared all over Trudvang. They often take names related to dangerous predators such as Ulve, Garm (both warg beasts), Bjorn (bear), or Örn (eagle). The hirdmen of the Stormlands often gather under the banner of a jarl or powerful chieftain. Many are warriors first, but serve on their lords’ farms and keeps too. They live close by their jarl and learn how to wield spears, shields, and swords as well as to till the lands and run the farm. Among the hirdmen are also sellswords, shieldsmen, and glaive fighters who live a wandering life, working for the jarls and chieftains who can pay for their services.</p><h2>Virann Warriors</h2><p>The “riddermen” are found in Westmark. They are the bulk of the warriors in the Western lands. Heavily armored, armed, and mounted, they are sworn to obey their order or king. They carry their banners with pride and are well aware that on their shoulders rest a heavy yoke of tradition and code of honor. Less appreciated and less capable are the watchmen of Westmark, warriors tasked with guarding a wall, keep, estate, or anything else that requires armed defense. The watchmen can be found all over Westmark, but they gather mostly in towns or larger estates. While they do not carry the same burden of tradition as the riddermen, nor do they enjoy the same high status. Those in Westmark who live by the great sea have built many a ship that carries valuable cargo. To protect these, “leidangr” are hired, mariners who are just as skilled with seafaring as with fighting. Because of the experience and knowledge they gather from distant lands, the leidangr are more sought after than the watchmen, but still find themselves far beneath the riddermen.</p><h2>Wildfolk Warriors</h2><p>The warriors of the Wildfolk are often hunters and are also tasked with defending the tribe from the lurking dangers of the forests, the mountain ranges, or the ice-covered plains. Some make their living from campaigns, with war as their only source of income. Such warriors are often brutal and seasoned, with little to no understanding of the world outside of combat. These warsworn are especially common among the Arks and the Bults, but can also be found among Wildbrons and Agrots.</p> | <p>Le guerrier est l’épine dorsale d’un groupe d’aventuriers. Habituellement, il place sa foi non pas en un dieu mais plutôt en son épée et sa propre force. Les berserkers des Stormländer, féroces et surnaturels, sont respectés et craints, tout comme les guerriers sacrés de l’Extrême ouest. Les guerriers ont vocation à protéger les autres et à mourir leur épée dans une main, leur hache dans l’autre.</p><h2>Guerriers elfes</h2><p>Comme chez les peuples sauvages, il est courant que les guerriers elfes soient d’abord des chasseurs et ensuite seulement des combattants. En temps de paix, ils chassent pour fournir de la nourriture à leur tribu, et lorsque des ennuis se présentent, ils enfilent leur armure de cuir et sortent les massues de guerre. Les guerriers qui protègent les arbres de soin sont appelés les « puvartijas ». Bénéficiant d’un entraînement spécial, ils sont capables de rester au plus profond des forêts pendant de longues périodes, patrouillant et protégeant les endroits où poussent les arbres de soin. La plupart du temps, ils opèrent à deux, et passent l’essentiel de leur temps loin de leur tribu.</p><h2>Guerriers nains</h2><p>Il y a deux types de guerriers parmi les nains : les « zvordorkûms » et les « logovordas ». Autrefois, les zvordorkûms portaient l’imposante armure zvordorkûm-maki ; cependant, de nos jours, on les associe en général au combat défensif s’appuyant sur des armures lourdes. Ils portent des masques et des casques inspirant la peur, ainsi que des plastrons de fer nommés « murgle », et ils sont connus à travers tout Trudvang pour être quasi impossibles à vaincre au combat. Les guerriers logovordas sont des guerriers qui travaillent souvent dans les mines et apprennent à se battre avec une lance et une pioche. Lorsque les tambours de guerre appellent à nouveau au combat, ils émergent des tunnels sombres pour se battre derrière les zvordorkûms aux longues lances.</p><h2>Guerriers mittlanders</h2><p>Les guerriers du Mittland sont souvent répartis en deux groupes : les maîtres d’armes et les lanciers. Les maîtres d’armes vénèrent leurs armes, se voient enseigner des techniques secrètes et vivent pour maîtriser leurs compétences et réaliser des prouesses sur le champ de bataille. Il n’est pas rare de voir des maîtres d’armes former des alliances avec certains de leurs pairs. Au sein de ces alliances semblables à des cultes, ils prêtent serment de se protéger mutuellement, de combattre et même de mourir ensemble sur le champ de bataille. Les puissants briseurs d’anneaux et les spjótgothar ont souvent des maîtres d’armes à leur service, en partie pour les protéger et en partie pour enseigner à leurs lanciers le noble art du combat. Comme les hirdmen des Stormländer, les lanciers vivent auprès de leur gothi ou de leur roi en tant que gardiens et guerriers se battant sous ses bannières. Il y a de nombreux lanciers mythiques au Mittland, les « borgwarths » étant les plus célèbres et les plus vénérés. Les lanciers savent souvent se battre à cheval, et ils passent de nombreux jours et nuits au côté de leur cheval pour tisser des liens forts avec lui. Pour les guerriers du Mittland, le courage est la seule chose qui compte. Lorsque les guerriers meurent, on dit que c’est en raison de leur courage et de ce vers quoi il les a entraînés. Que ce soit par colère, tristesse, mélancolie, témérité ou héroïsme, c’est parce qu’ils ont cherché à être des héros pour une cause supérieure.</p><h2>Guerriers stormlanders</h2><p>Dans les Stormländer, les guerriers sont habituellement soit des berserkers soit des hirdmen. Les berserkers sont des combattants sauvages et assoiffés de sang, se battant à la hache ou à l’épée, capables d’entrer dans une rage de combat. On dit qu’ils peuvent se transformer en ours, en loup ou tout autre animal sauvage. Dans la bataille, ces métamorphes ne s’encombrent pas d’un bouclier ou d’un casque, ne ressentent ni la douleur ni la peur, et abattent tous ceux qui se mettent en travers de leur chemin. Les berserkers des Stormländer sont craints dans tout Trudvang. Ils adoptent souvent des noms liés à de dangereux prédateurs tels qu’Ulve, Garm (tous deux des espèces de wargs), Bjorn (ours) ou Örn (aigle). Les hirdmen des Stormländer se rassemblent souvent sous la bannière d’un jarl ou d’un puissant chef. Beaucoup sont avant tout des guerriers, mais servent aussi dans les fermes et forteresses de leur seigneur. Ils vivent au côté de leur jarl et apprennent aussi bien à utiliser la lance, le bouclier et l’épée qu’à labourer et à gérer une ferme. Parmi les hirdmen, on trouve également des mercenaires, des protecteurs et des épéistes qui vivent une vie d’errance, travaillant pour les jarls et chefs qui peuvent les payer pour leurs services.</p><h2>Guerriers viranns</h2><p>On trouve les « riddermen » au Vastermark. Ils constituent le gros des guerriers des terres de l’ouest. Lourdement armés, engoncés dans leurs épaisses armures et chevauchant de puissants chevaux, ils ont juré obéissance à leur roi. Ils portent leurs bannières avec fierté et ont conscience du lourd poids des traditions et du code de l’honneur qui pèse sur leurs épaules. Moins appréciées et ayant des capacités moindres, les sentinelles du Vastermark sont des guerriers chargés de garder une muraille, une forteresse, un domaine ou n’importe quoi d’autre nécessitant une protection armée. On trouve des sentinelles partout au Vastermark, mais elles sont regroupées essentiellement dans les villes ou les domaines les plus importants. Si elles n’ont pas à supporter le poids de la tradition comme les riddermen, elles n’en ont pas non plus le statut social élevé. Au Vastermark, ceux qui vivent au bord du grand océan ont construit de nombreux navires qui embarquent de précieuses cargaisons. Pour les protéger, ils engagent des « leidangr », des marins qui sont capables à la fois de naviguer et de combattre. En raison de l’expérience et des connaissances qu’ils ont acquises dans des pays lointains, les leidangr sont plus recherchés que les sentinelles, mais restent loin en deçà des riddermen.</p><h2>Guerriers sauvages</h2><p>Les guerriers des peuples sauvages sont souvent des chasseurs, mais ils sont aussi chargés de protéger la tribu des dangers qui rôdent dans les forêts, les montagnes et les plaines glacées. Certains gagnent leur vie grâce aux campagnes militaires, la guerre étant leur seule source de revenus. De tels guerriers sont souvent brutaux mais chevronnés, n’ayant que peu de compréhension du monde en dehors du combat. Ces individus qui se consacrent à la guerre sont courants en particulier chez les Arks et les Bults, mais on en trouve également chez les Vildbrons et les Agrots.</p> |

## `TRUDVANG.Content.Journal.rogue`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.rogue.Name` | Rogue | Malfrat |
| `TRUDVANG.Content.Journal.rogue.Content` | <p>chapter 1. the character \| 33 The coin-snatchers are simple thieves, stealing from people in streets and markets and breaking into homes and keeps to find something they can sell. The “belwenpollers” serve a well-to-do trader or smuggler whose clients may not always be able to pay. Belwenpollers are sent to break bones and noses to keep their lords paid. There are plenty of belwenpollers in Westmark’s many ports. The “shadowers” are creatures of the night, earning their coin by tailing people and investigating what they are up to and where they live. Shadowers stop at nothing to get the information they need, and they charge good money for their services. Outside the cities, among farms or far out in the wilderness, possibly the most dangerous of Westmark’s rogues gather: the “utlaupsmen” and robber barons. Utlaupsmen are robbers who ravage and plunder farms, lying in ambush on important trade routes, or who are simply hired by lords to make life difficult for someone. Robber barons are “riddermen” (warriors) who have fallen from grace and abandoned their lord and their traditions to rob and ravage the countryside. What differentiates robber barons from utlaupsmen is that most robber barons are not as ruthless.</p><h2>Wildfolk Rogues</h2><p>Rogues are uncommon among the Wildfolk, since they are slain in a shameful manner if caught. Those who hide in the dark and steal from others deserve nothing better than being drowned in a mire or hung from a tree. The most common type of Wildfolk rogues are simple thieves and the “slogi,” those who betray their own for payment. to have been coined in Mittland. Assassins are cold-blooded killers who thoroughly plan their deeds. They infiltrate the households and homes of those they are paid to slay. The “eitrspatters” are, if possible, even more thorough than the assassins. They have learned to kill with poison and carry a great deal of knowledge of botany and toxicology. In addition, just as in the rest of Trudvang, there are some rogues who simply steal and rob.</p><h2>Stormlander Rogues</h2><p>Most common in the Stormlands are the sea wolves, the “log less,” and scoundrels. Sea wolves are shipborne robbers who perform nightly raids, stealing cattle and thralls. Their ships are fast and strike without warning. The “log less” are those who have their storm logs removed from their homes as punishment for murdering and stealing, revealing to all passersby that they are loyal to no one. They are sometimes hired by people who do not want to bloody their own hands, but usually Stormlanders want nothing to do with the log less. Scoundrels are those who move from farm to farm, killing and stealing as they go. Most of the time, they have betrayed their families and thus have no right to call themselves warriors and have no vote at the “Thing” (the assembly of people). The scoundrels live off the shady tasks that might give them board and lodging.</p><h2>Virann Rogues</h2><p>In Westmark, where the big cities are crowded with people, coin-snatchers and “belwenpollers” gather, along with the “shadowers” who use the cities as a starting point for their missions. The rogue is an outcast or vagrant, someone without a king, earl, or chieftain to serve. They live by stealth, murder, or dealing with secrets, and they always live in the shadows. The rogue learns the trades of picking pockets, burglary , and backstabbing. If rogues are not cautious, they might be sacrificed in the moorland or thrown to the wolves.</p><h2>Elven Rogues</h2><p>Elves who have caused large forest fires, led trolls or Wildfolk to elven villages, or done something else that put the tribe in grave danger are cast out and must live as rogues. Sometimes they build a hut in the outskirts of the tribe’s hunting grounds and sneak into villages to steal food and items. It is not uncommon for these elves to seek out humans and join up with adventurers or woodsmen. The elves call their rogues “kallivojka” (“the lost”), and they are forever cut off from the tribe.</p><h2>Dwarven Rogues</h2><p>Rogues are uncommon among dwarves. Often, the only rogues are dwarves who have lost all their brothers or done something so wrong that they have been excluded from the community , forced to survive by stealing or worse. Dwarves call their rogues “mulovos,” which means “dark-hearted.” The worst sin of all is slaying a brother, and dwarves who do so are called “orgej” (“blood-hand”), but they are very rare.</p><h2>Mittlander Rogues</h2><p>Two types of rogues are especially dangerous in Mittland: assassins and “eitrspatters.” Assassin is a term that is used all over the Stormlands, but it is assumed</p> | <p>Le malfrat est un paria ou un vagabond, quelqu’un qui ne sert ni roi, ni jarl, ni chef. Sa vie est bâtie sur la discrétion, le meurtre ou les affaires secrètes, et il vit toujours dans les ombres. Le malfrat apprend à faire les poches, à cambrioler ou à assassiner. S’il ne prend pas garde, il peut finir sacrifié dans les marécages ou jeté aux loups.</p><h2>Malfrats elfes</h2><p>Les elfes responsables d’importants feux de forêts, ou qui ont guidé des trolls ou des sauvages jusqu’à des villages elfiques, ou encore fait autre chose mettant la tribu en grand danger, sont bannis et doivent vivre comme des malfrats. Parfois, ils se construisent une cabane en périphérie du territoire de chasse de la tribu, et se glissent discrètement dans les villages pour voler de la nourriture et des objets. Il n’est pas rare que ces elfes aillent à la rencontre d’humains et se joignent à des aventuriers ou des hommes des bois. Les elfes baptisent leurs malfrats « kallivojkas », « les perdus », ces derniers étant coupés à jamais de leur tribu.</p><h2>Malfrats nains</h2><p>Les malfrats sont rares parmi les nains. Souvent, ce sont des nains qui ont perdu tous leurs frères ou fait quelque chose de tellement grave qu’ils ont été exclus de la communauté, ce qui les force à survivre en volant ou en faisant pire encore. Les nains appellent leurs malfrats « mulovos », ce qui signifie « cœur sombre ». Le pire péché de tous est de tuer un frère ; les nains qui commettent un tel crime sont nommés « orgej » (« main sanglante »), mais ils sont très rares.</p><h2>Malfrats mittlanders</h2><p>Il existe deux types de malfrats particulièrement dangereux au Mittland : les assassins et les « eitrspatters ». Assassin est un terme utilisé partout dans les Stormländer, mais on pense qu’il a été créé au Mittland. Les assassins sont des tueurs de sang-froid, qui planifient minutieusement leurs actions. Ils infiltrent les foyers et les demeures de ceux qu’on les a chargés de tuer. Les « eitrspatters » sont, dans la mesure du possible, encore plus minutieux que les assassins. Ils ont appris à tuer avec du poison, et ont une grande connaissance en botanique et en toxicologie. Par ailleurs, comme partout ailleurs en Trudvang, il y a également des malfrats qui se contentent de voler et de détrousser.</p><h2>Malfrats stormlanders</h2><p>Les loups de mers, les « sans-bûche » et les canailles sont des plus courants dans les Stormländer. Les loups de mer sont des brigands disposant de navires, qui accomplissent des raids nocturnes, volant du bétail et des esclaves. Leurs bateaux sont rapides et frappent sans prévenir. Les « sans-bûche » sont des personnes à qui on a retiré leurs bûches de Storme de leur demeure en punition des meurtres et vols qu’ils ont commis, révélant aux passants qu’ils ne sont loyaux à personne. Ils sont parfois engagés par des gens qui ne veulent pas se salir les mains, mais habituellement, les Stormlanders ne veulent pas avoir affaire aux sans-bûche. Les canailles sont des individus qui vont de ferme en ferme, tuant et volant au passage. La plupart du temps, ils ont trahi leur famille et n’ont ainsi plus le droit de se prétendre guerrier ni de voter au « Thing », l’assemblée du peuple. Les canailles gagnent leur vie avec des tâches douteuses qui peuvent leur valoir le gîte et le couvert.</p><h2>Malfrats viranns</h2><p>Au Vastermark, où les grandes cités ont une population importante, les voleurs à la tire et les « belwenpollers » se rassemblent avec les « skuggdrivares » qui utilisent les cités comme base opérationnelle pour leurs missions. Les voleurs à la tire sont de simples voleurs, qui prennent aux gens dans les rues et sur les marchés, et entrent dans les maisons par effraction pour s’emparer de choses qu’ils peuvent vendre. Les « belwenpollers » sont au service d’un marchand ou d’un trafiquant fortuné dont les clients ne sont pas toujours en mesure de payer. Ils sont envoyés pour briser des os et des nez afin que leurs maîtres soient payés. On trouve plein de belwenpollers dans les nombreux ports du Vastermark. Les « skuggdrivares » sont des créatures de la nuit, qui gagnent leur paie en filant des personnes et en se renseignant sur leurs activités et l’endroit où ils vivent. Rien ne peut empêcher les ombreux d’obtenir l’information qu’ils cherchent, et ils se font bien payer pour leurs services. En dehors des cités, au sein des fermes ou loin dans la nature, se réunissent les malfrats probablement les plus dangereux du Vastermark : les « utlaupsmen » et les barons brigands. Les utlaupsmen sont des bandits qui ravagent et pillent les fermes, se postent en embuscade sur les importantes voies commerciales, ou sont simplement engagés par des seigneurs pour rendre la vie difficile à quelqu’un. Les barons brigands sont des « riddermen » (guerriers) qui sont tombés en disgrâce et ont abandonné leur seigneur et leurs traditions pour piller et ravager la campagne. La différence entre les utlaupsmen et les barons brigands est que la plupart de ces derniers ne sont pas aussi impitoyables.</p><h2>Malfrats sauvages</h2><p>Les malfrats sont rares parmi les sauvages, car ils sont tués de façon déshonorante lorsqu’ils sont capturés. Ceux qui se dissimulent dans l’obscurité et volent les autres ne méritent rien d’autre que d’être noyés dans un bourbier ou pendus à un arbre. Les malfrats les plus courants au sein des peuples sauvages sont les simples voleurs et les « slogis », qui trahissent les leurs pour de l’or.</p> |

## `TRUDVANG.Content.Journal.ranger`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.ranger.Name` | Ranger | Rôdeur |
| `TRUDVANG.Content.Journal.ranger.Content` | <p>chapter 1. the character \| 31 derness” rings true. Not being able to live off hunting is considered weak and unworthy; such people are often sacrificed as blot or drowned in a hole in the ice. The hunters of the Stormlands are usually well versed in the flora and can gather large quantities of berries, nuts, mushrooms, and other edible vegetables. Some men and women from larger farms and settlements make their living by helping others to travel across the lands and through the wilderness. Usually , these individuals are referred to as the “spörrulvi,” those who track like wolves. They know a great deal about the land and prove themselves capable warriors and hunters, but most of all they understand the elements and can travel for months at a stretch.</p><h2>Virann Rangers</h2><p>Dwellers make up the majority of the population in Westmark and rangers are considered strange and dangerous. They are wanderers who live by hunting and trading fur, but since almost all the farms have a huntmaster who has learned both fishing and hunting, there is little to gain there. It is very common for rangers to be forced to serve a rich dweller or work as a caravan guard, given their knowledge of the land. In Westmark there are plenty of derogatory names for the rangers, such as “troll-wanderer” or “root-chewer,” but the most common practice is to call them “vildvittjes” or “vildvittras” (for men and women, respectively).</p><h2>Wildfolk Rangers</h2><p>Among the Wildfolk of the north, where the constant perils of the dark forest lurk, there is plenty of game, but also mortal dangers for those who take the wrong path. The rangers here hunt both big and small game; the further north, the bigger the quarry. At the border of the barren Isvidda, frostboar and mastomants are felled, and sometimes even hrimtursirs.</p><h2>Mittlander Rangers</h2><p>Hunters are a common sight in Mittland, and while they form an important part of the Mittlander Rangers, in this region of Trudvang mounted messengers and scouts are also encompassed. The mounted messengers, like the spörrulvi of the Stormlands, are familiar with the geography they travel through, live a life on the roads, and are paid to deliver missives or goods small enough to fit in their saddlebags. Mittland’s mounted messengers are, as the name suggests, excellent riders and fond of their horses. Scouts and vanguards to the evermoving hanir tribes are also considered rangers in Mittland. Much like the mounted messengers, they are highly dependent on their horses. In this part of Trudvang, where feats of honor and courage are highly valued and recorded, it is common for some to specialize in hunting a certain, specific kind of beast. Hunters of trolls, ice trolls, or lindwurms are highly honored and always respected in the mead halls. Those who live by hunting are called “spearlauger,” but generally , rangers are poetically called the “stersluming,” meaning “star sleeper.”</p><h2>Stormlander Rangers</h2><p>With the same grimness and raw bravery of the wildmen in the north, the rangers of the Stormlands and tamers of the wild roam the forests to hunt. Here, as in the north, the rangers spend most of their time hunting. It is, however, fairly uncommon for them to encounter big game. Instead, they pursue wolves, foxes, and drauglo, or the dangerous morkbru in the northern parts of the region. Other rangers lay traps for skullverines, winter hares, and raw martens, or they hunt birds and plunder the nests. The further north in the Stormlands, the more rangers one finds, and the saying “In the Wilderland, everyone is a part of the wilThe ranger is a wanderer of the wilds, a pathfinder, and a hunter. They have learned all the skills needed to live outside villages and towns, and they prize most highly a free life in the wilderness. A ranger is a skilled hunter and scout who has learned how to predict weather and track the most fearsome beasts.</p><h2>Elven Rangers</h2><p>The elves have always hunted, but not in the same way or for the same purpose as humans. Where men seek to acquire quantities of fur and meat, elves value balance in the woods and never hunt more than what is needed for the day. Elven hunters are skilled at setting traps and surrounding prey. They often lie in wait and almost exclusively hunt in teams. Hunters play a crucial role especially among the Korpikalli elves, since they move from place to place and have no permanent settlements like the Illmalaina elves of the south. Entering new hunting grounds and learning what game it offers are tedious tasks that are filled with dangers. The elves who travel far with their herds of reindeer to find pastures for their livestock have learned to live in and coexist with nature. Elven hunters are known as “toumi,” the keepers of balance.</p><h2>Dwarven Rangers</h2><p>There are few who can be called rangers among the dwarves. Of course, there are vast and untrodden areas of wilderness beneath the earth too, but dwarves do not have the same hunting culture as humans and elves. The few who do hunt look for tunnelswine, and the gatherers who explore the endless, dark crevices seek rare mushrooms or roots. It is also uncommon for dwarven rangers to provide only for themselves; oftentimes, a band of brothers leaves to hunt and gather for a period of time and later returns to their ordinary tasks in the mine or smithy.</p> | <p>Le rôdeur est un voyageur qui parcourt les terres sauvages, un explorateur et un chasseur. Il a appris toutes les compétences nécessaires pour vivre en dehors des villages et des villes, et il est particulièrement attaché à une vie sans contrainte dans la nature. Un rôdeur est un chasseur habile et un éclaireur qui a appris à prédire le temps et à traquer les bêtes les plus redoutables.</p><h2>Rôdeurs elfes</h2><p>Les elfes ont toujours pratiqué la chasse, mais pas de la même façon ou dans le même but que les humains. Là où les hommes cherchent à amasser des quantités de fourrures et de viande, les elfes accordent une grande valeur à l’équilibre au sein des bois, et ne chassent jamais plus que ce dont ils ont besoin pour le quotidien. Les chasseurs elfes sont experts pour poser des pièges et encercler leurs proies. Ils sont souvent à l’affût et chassent presque exclusivement en groupes. Les chasseurs jouent un rôle important, en particulier chez les elfes korpikallas, car ils sont itinérants et n’ont pas d’installation permanente comme peuvent en avoir les elfes illmalainas du sud. Découvrir de nouveaux territoires de chasse et le gibier qu’ils abritent est une tâche fastidieuse qui comporte de nombreux dangers. Les elfes qui voyagent au loin à la recherche de pâturages pour leurs troupeaux de rennes ont appris à vivre dans la nature et à coexister avec elle. Les chasseurs elfes sont nommés les « toumis », les gardiens de l’équilibre.</p><h2>Rôdeurs nains</h2><p>Il existe peu de rôdeurs parmi les nains. Bien entendu, il y a aussi de vastes territoires sauvages inconnus sous terre, mais les nains n’ont pas la même culture de la chasse que les humains et les elfes. Les quelques nains qui chassent traquent le porc des tunnels, et les cueilleurs qui explorent les sombres et interminables crevasses cherchent de rares champignons et racines. Il est également peu commun que les rôdeurs nains ne subviennent qu’à leurs propres besoins ; souvent, un groupe chasse et récolte des provisions pour une période donnée, et retourne ensuite à ses tâches ordinaires, à la mine ou à la forge.</p><h2>Rôdeurs mittlanders</h2><p>Il est courant de voir des chasseurs au Mittland, et s’ils constituent une part importante des rôdeurs mittlanders, cette région de Trudvang comprend également des messagers à cheval et des éclaireurs. Les messagers à cheval, comme les spörrulvi des Stormländer, connaissent les zones qu’ils traversent, vivent sur les routes et sont payés pour porter des missives ou des biens suffisamment petits pour tenir dans leurs fontes. Ceux du Mittland sont, comme leur nom l’indique, d’excellents cavaliers et aiment leurs chevaux. Les éclaireurs et avant-gardes des tribus hanir, qui sont en mouvement constant, sont également considérés comme des rôdeurs au Mittland. Tout comme les messagers à cheval, ils dépendent beaucoup de leurs montures. Dans cette partie de Trudvang, où les faits d’armes impliquant l’honneur et le courage sont particulièrement valorisés et consignés, il est courant que certains se spécialisent dans la chasse d’un type de créature spécifique. Les chasseurs de trolls, de trolls des glaces ou de lindwurms sont hautement honorés et toujours respectés dans les tavernes à hydromel. Ceux qui vivent de la chasse sont appelés les « spjutslaugare », mais plus généralement, les rôdeurs sont poétiquement appelés les « sterslumings », c’est-àdire « ceux qui dorment sous les étoiles ».</p><h2>Rôdeurs stormlanders</h2><p>Les rôdeurs des Stormländer et les dompteurs de la nature errent dans les forêts avec la même sévérité et le même courage brut que les sauvages du nord, passant comme ces derniers l’essentiel de leur temps à chasser. Cependant, il est plutôt rare qu’ils rencontrent du gros gibier. Ils en ont plutôt après les loups, les renards et les drauglos, ou encore les dangereux morkbrus dans le nord de la région. D’autres rôdeurs posent des pièges destinés aux skälljarvs (« crânecajou »), aux lièvres hivernaux, et aux råmårds (une espèce de marte), ou chassent des oiseaux et pillent les nids. Plus on s’aventure dans le nord des Stormländer, plus on rencontre de rôdeurs, et plus le dicton « Dans les Terres sauvages, chacun est une partie de la nature » fait sens. Ceux qui ne sont pas capables de vivre de la chasse sont considérés comme faibles et indignes ; de telles personnes sont souvent sacrifiées en tant que blot (offrande divine) ou sont précipitées dans un trou percé dans la glace et noyées. Habituellement, les chasseurs des Stormländer connaissent bien la flore et peuvent cueillir de grandes quantités de baies, noix, champignons et autres végétaux comestibles. Certains hommes et femmes issus de grandes fermes ou villages gagnent leur vie en aidant les autres à voyager à travers les terres et les espaces sauvages. En général, ces individus sont désignés sous le nom de « spörrulvi », c’est-à-dire « ceux qui pistent comme des loups ». Ils en savent beaucoup au sujet des terres et sont des guerriers et des chasseurs habiles ; mais surtout, ils comprennent les éléments et sont capables de voyager pendant des mois d’affilée.</p><h2>Rôdeurs viranns</h2><p>Les colons constituent la majorité de la population de Vastermark, et considèrent les rôdeurs comme étranges et dangereux. Ce sont des vagabonds qui vivent de la chasse et du commerce de fourrures, mais comme chaque ferme dispose d’un maître-chasseur qui a appris à pêcher et à chasser, ils n’ont pas grand-chose à gagner dans ce domaine. Il est très courant que les rôdeurs soient obligés de servir un riche colon ou de travailler en tant que protecteur de caravane, du fait de leur connaissance du terrain. En Vastermark, il existe de nombreux noms péjoratifs pour désigner les rôdeurs, tels que « vagabond-troll » ou « mâcheur de racines », mais le plus souvent, ils sont appelés « vildvittjes » ou « vildvittras », selon qu’il s’agisse d’hommes ou de femmes.</p><h2>Rôdeurs sauvages</h2><p>Dans le nord, où le danger règne constamment dans les sombres forêts, les peuples sauvages disposent d’un gibier abondant, mais ceux qui prennent le mauvais chemin sont exposés à des dangers mortels. Là, les rôdeurs chassent aussi bien le gros gibier que le petit ; plus on monte vers le nord, plus la proie est grosse. Aux frontières de l’aride Isvidda, on peut abattre des sangliers des glaces et des mastomants, et parfois même des hrimtursirs.</p> |

## `TRUDVANG.Content.Journal.vitnerWeaver`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.vitnerWeaver.Name` | Vitner Weaver | Tisseur de vitner |
| `TRUDVANG.Content.Journal.vitnerWeaver.Content` | <p>chapter 1. the character \| 35 To master the energies of magic is a powerful skill, and to weave the mysterious energy called “vitner” is a dangerous trade. Some people call these weavers enchanters, mages, spellcasters, sorcerers, or conjurers. The vitner weavers have learned to cast spells and to control the powerful vitner. They are rightfully feared all over Trudvang, but also highly respected and valued.</p><h2>Elven Vitner Weavers</h2><p>Elves were the first to learn the powerful art of weaving from the Misturelves, and thus also have had the longest time to practice it. The elvish conjurers are generally called “sampokkas” (weavers) and they usually perform their magic by singing or playing odd instruments. Among the elves there is a kind of conjurer that for some reason attracts animals which choose to live close to them. Because of this, men have given them the name of “besturvejkler,” but the elves call them “raoumma,” “they who caw.” These conjurers are always “Hwitaljas” (ones who bring light).</p><h2>Dwarven Vitner Weavers</h2><p>Even though several attempts have been made to teach dwarves how to wield and weave vitner, they have never been successful. It is said that their bonds to the mountains and their gods are so strong that they cannot let vitner enter their minds. There is, however, a specific Dwarven kind of Vitner Weaver which is diffused especially among the rare Buratja dwarves. These are weavers who know how to engrave magical runes on items to be made magical.</p><h2>Mittlander Vitner Weavers</h2><p>Vitner weavers are most appreciated in Mittland. They have a prominent role in the Eald Tradition, but also serve as councilors and advisors to gothis and kings. They are seen to be very close, and sometimes even one, with nature and its beings. The weavers are divided into three groups: the “Gandhman,” the “Hallawes,” and the “Fhomors.” The Gandhman are sorcerers sworn to no master who travel from farm to farm in the backwoods to seek, or share, knowledge. In many parts of Mittland, it is believed that the Gandhman have sworn pacts with the Flowras or stand very close to these mysterious beings of nature. A Gandhman is a welcome guest at Mittlandian farms, since many carry the skills and abilities of a skald. The Hallawes, or Hellawes, are the conjurers who thirst for ancient knowledge and dig deep into the secrets of the vitner. Because of their knowledge, Hallawes often serve a rich gothi or king, and are able to spend considerable sums from their treasury to increase their knowledge. The Fhomors are the most feared of all vitner weavers in Mittland. Tamers of vitner, they use their secrets in combat and are nearly as deft with the arts of battle as they are with weaving vitner. Many commanders seek (and fear) these swordmages.</p><h2>Stormlander Vitner Weavers</h2><p>Despite the fact that vitner weavers are highly unusual in the Stormlands, many scholars claim that it was in this part of Trudvang that the weaving began, among elves and humans alike. It was here that the “Misturelves” shared their gifts with the elves, who subsequently did the same with humans. Many weavers disappeared along with the Thronelanders when the latter decided to leave the Stormlands and settle in Mittland. In the Stormlands, male vitner weavers are called “veduns” and female weavers “vedmas.” Oftentimes it is the “Vaagritalja” (those who seek the balance of power) who learn to live close to nature. Sometimes they can be seen crossing the mountains with their gnarled, knotty staffs (called “ gambatein”), seeking plants and herbs that they mix and boil in their huts and cabins.</p><h2>Virann Vitner Weavers</h2><p>Since the advent of the Tenet of Nid in Westmark, many vitner weavers have lived like hunted animals. They do not have the same rights as others and are sometimes punished for using vitner. Because of this, the conjurers of Westmark live in obscurity , oftentimes in the wilderness, to avoid persecution. Of all the vitner weavers in Trudvang, it is said that those in Westmark possess the greatest knowledge of the Uvenla (demons) and of other creatures from Dimhall. It is not unusual for them to specialize in fire, water, wind, or something else and to learn to weave in silence. Common folk in Westmark call the vitner weavers warlocks and witches. Older are the names “hexe,” for men, and “hagzissa,” for women. Ever since the Tenet of Nid bloomed in Westmark, it has been widely believed that warlocks and witches are bound tightly to the Uvenla and the Ioi, and that they carry inside them a seed of evil that leaves a physical mark upon their bodies.</p><h2>Wildfolk Vitner Weavers</h2><p>Wildfolk believe that they who can distort nature without defeating a spirit are walking down a dangerous path, which is why no conjurers will be found among these people. The few Wildfolk who dare to learn the art of vitner weaving are driven off or sacrificed in bogs or marshes.</p> | <p>Maîtriser les énergies magiques est une compétence puissante, et tisser l’énergie mystérieuse connue sous le nom de « vitner » est une affaire dangereuse. Les tisseurs de vitner sont parfois appelés enchanteurs, mages, jeteurs de sorts, sorciers ou invocateurs. Ils ont appris à lancer des sorts et à contrôler le puissant vitner. Partout sur Trudvang, ils sont craints, à juste titre, mais ils sont aussi hautement respectés et appréciés.</p><h2>Tisseurs de vitner elfes</h2><p>Les elfes furent les premiers à apprendre le puissant art du tissage auprès misturalfer (ou elfes des brumes), et ils ont ainsi la plus longue expérience de sa pratique. Les invocateurs elfes sont généralement appelés « sampokkas » (tisseurs), et pratiquent habituellement la magie en chantant ou en jouant d’instruments étranges. Parmi les elfes, il existe une sorte d’invocateurs qui, pour une raison ou une autre, attire les animaux qui décident de vivre à leurs côtés. C’est pourquoi les hommes leur ont donné le nom de « besturvejkler », mais les elfes les nomment « raoumma », c’est-à-dire « ceux qui croassent ». Ces invocateurs sont toujours des « hwitaljas » (« ceux qui apportent la lumière »).</p><h2>Tisseurs de vitner nains</h2><p>Même si des tentatives ont été réalisées pour enseigner le maniement et le tissage du vitner aux nains, aucune n’a jamais réussi. On dit que leurs liens à la montagne et avec leurs dieux sont si forts qu’ils ne peuvent laisser le vitner pénétrer leur esprit. Cependant, il existe chez les nains un type spécifique de tisseurs de vitner, qui est répandu en particulier parmi les rares nains buratjas. Ces tisseurs savent comment graver les runes magiques dans les objets pour qu’ils deviennent magiques.</p><h2>Tisseurs de vitner mittlanders</h2><p>Les tisseurs de vitner sont très appréciés au Mittland. Ils occupent une place importante dans l’Ancienne tradition, mais servent également de conseillers auprès de gothar et de rois. Ils sont perçus comme étant très proches voire unis avec la nature et ses êtres. Les tisseurs sont répartis en trois groupes : les « gandhmen », les « hallawes » et les « fhomors ». Les gandhmen sont des sorciers qui ne sont inféodés à aucun maître et voyagent de ferme en ferme dans l’arrière-pays pour chercher ou partager des connaissances. En de nombreux endroits du Mittland, on pense que les gandhmen ont passé un pacte avec les Flowras, ou sont en tout cas très proches de ces mystérieux êtres de la nature. Le gandhman est toujours bien accueilli dans les fermes du Mittland, car beaucoup ont également les compétences et aptitudes d’un skald. Les hallawes (ou hellawes) sont des invocateurs assoiffés de connaissances anciennes qui creusent en profondeur dans les secrets du vitner. Du fait de leurs connaissances, les hallawes sont souvent au service d’un riche gothi ou d’un roi ; le trésor qu’ils peuvent ainsi se constituer leur permet de dépenser des sommes considérables pour augmenter leur savoir. Les fhomors sont les tisseurs de vitner les plus craints au Mittland. Dompteurs du vitner, ils utilisent leurs secrets au combat et sont presque aussi habiles dans l’art de la guerre que dans le tissage du vitner. De nombreux généraux cherchent (et craignent) ces mages de bataille.</p><h2>Tisseurs de vitner stormlanders</h2><p>Bien que les tisseurs de vitner soient très rares dans les Stormländer, de nombreux érudits affirment que c’est dans cette région de Trudvang que l’on a commencé à tisser, que ce soit chez les elfes ou chez les humains. C’est là que les « misturalfer » ont partagé leurs dons avec les elfes qui, par la suite, ont fait de même avec les humains. De nombreux tisseurs ont disparu en même temps que les Tronlanders lorsque ces derniers ont décidé de quitter les Stormländer et de s’installer au Mittland. Dans les Stormländer, les tisseurs de vitner de sexe masculin sont appelés « veduns », et les femmes « vedmas ». Souvent, ce sont des « vaagritaljas » (« ceux qui cherchent l’équilibre des pouvoirs ») qui apprennent à vivre près de la nature. Parfois, ils peuvent être vus traversant les montagnes avec leur bâton noueux (appelé « gambatein »), cherchant des plantes et des herbes qu’ils mélangent et font bouillir dans leur hutte ou leur chalet.</p><h2>Tisseurs de vitner viranns</h2><p>Depuis l’avènement de la Doctrine de Nid en Vastermark, de nombreux tisseurs de vitner vivent comme des animaux traqués. Ils n’ont pas les mêmes droits que les autres, et sont parfois punis parce qu’ils font appel au vitner. À cause de cela, les invocateurs duVastermark vivent dans l’ombre, souvent dans la nature, pour échapper à la persécution. De tous les tisseurs de vitner de Trudvang, ceux du Vastermark possèderaient les plus grandes connaissances des uvenlas (démons) et des autres créatures issues de Dimhall, le Domaine des Brumes. Il n’est pas inhabituel de les voir se spécialiser dans le feu, l’eau, le vent ou d’autres éléments, et apprendre à tisser en silence. Le peuple du Vastermark désigne les tisseurs de vitner sous le nom de sorciers et sorcières. D’autres termes plus anciens sont aussi utilisés, comme « hexe » pour les hommes, et « hagzissa » pour les femmes. Depuis que la Doctrine de Nid s’est développée au Vastermark, la croyance s’est répandue que les sorciers et sorcières sont étroitement liés aux uvenlas et aux iois, et qu’ils portent en eux la graine du mal, qui imprime une marque physique sur leur corps.</p><h2>Tisseurs de vitner sauvages</h2><p>Les peuples sauvages pensent que ceux qui sont capables de distordre la nature sans vaincre un esprit s’engagent sur une pente dangereuse. C’est pourquoi il n’y a pas d’invocateur parmi eux. Les quelques Sauvages qui osent apprendre l’art du tissage du vitner sont chassés ou sacrifiés dans les tourbières ou les marais.</p> |

## `TRUDVANG.Content.Journal.armorEncumbrance`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.armorEncumbrance.Name` | Armour Encumbrance | Encombrement des armures |
| `TRUDVANG.Content.Journal.armorEncumbrance.Content` | <p>This house table applies a more gradual progression of initiative and movement modifiers according to the armour's effective Encumbrance.</p><table><thead><tr><th>Effective Encumbrance</th><th>IM</th><th>MM</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0 m</td></tr><tr><td>1</td><td>0</td><td>0 m</td></tr><tr><td>2</td><td>−1</td><td>0 m</td></tr><tr><td>3</td><td>−1</td><td>−1 m</td></tr><tr><td>4</td><td>−1</td><td>−1 m</td></tr><tr><td>5</td><td>−2</td><td>−1 m</td></tr><tr><td>6</td><td>−2</td><td>−2 m</td></tr><tr><td>7</td><td>−3</td><td>−2 m</td></tr><tr><td>8</td><td>−3</td><td>−3 m</td></tr><tr><td>9</td><td>−4</td><td>−3 m</td></tr><tr><td>10</td><td>−5</td><td>−4 m</td></tr></tbody></table> | <p>Cette table maison applique une progression plus graduée des modificateurs d’initiative et de mouvement selon l’encombrement effectif de l’armure.</p><table><thead><tr><th>Encombrement effectif</th><th>MI</th><th>MM</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0 m</td></tr><tr><td>1</td><td>0</td><td>0 m</td></tr><tr><td>2</td><td>−1</td><td>0 m</td></tr><tr><td>3</td><td>−1</td><td>−1 m</td></tr><tr><td>4</td><td>−1</td><td>−1 m</td></tr><tr><td>5</td><td>−2</td><td>−1 m</td></tr><tr><td>6</td><td>−2</td><td>−2 m</td></tr><tr><td>7</td><td>−3</td><td>−2 m</td></tr><tr><td>8</td><td>−3</td><td>−3 m</td></tr><tr><td>9</td><td>−4</td><td>−3 m</td></tr><tr><td>10</td><td>−5</td><td>−4 m</td></tr></tbody></table> |

## `TRUDVANG.Content.Journal`

| Clé | English | Français |
|---|---|---|
| `TRUDVANG.Content.Journal.Statistics` | Statistics | Caractéristiques |
| `TRUDVANG.Content.Journal.Culture` | Culture or mixed breed | Culture ou métissage |
| `TRUDVANG.Content.Journal.BodyPoints` | Body Points | Points de santé |
| `TRUDVANG.Content.Journal.Movement` | Movement | Mouvement |
