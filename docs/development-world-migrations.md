# Migrations temporaires des mondes de développement

Ce document inventorie tout le code qui existe uniquement pour remettre à niveau un monde créé par une version antérieure du système. Il ne décrit pas les règles de jeu ni la compatibilité Foundry V14/V16 : ces deux catégories resteront nécessaires après la première release.

## Règle de maintenance

Toute nouvelle migration de monde doit :

1. porter le commentaire `TEMPORARY WORLD MIGRATION` près du code concerné ;
2. être ajoutée à cette liste, avec son fichier, son déclencheur et sa condition de suppression ;
3. être supprimée de cette liste lorsque le code l'est.

À la première release publique, ces chemins pourront être retirés après suppression des mondes de développement historiques.

## `modules/content-importer.mjs`

| Code | Rôle transitoire | Suppression possible lorsque |
|---|---|---|
| `CONTENT_VERSION`, `starterContentVersion`, `starterContentLocale` et le chemin `importStarterContent()` | Détectent qu'un monde existant doit recevoir à nouveau le contenu de démarrage. | Les mondes de développement antérieurs ont été supprimés. |
| `fetchLangPack()`, `loadTranslations()` et `normalizeLabel()` | Reconnaissent les anciens documents par leurs noms français/anglais, avant l'introduction des identifiants stables. | Tous les documents de départ portent leurs flags stables. |
| `upsertFolder()` et son regroupement des doublons | Adopte et fusionne les dossiers créés par les anciens imports. | Les anciens mondes ont disparu. |
| `presentationUpdate()`, `upsertBaseItems()` et `upsertActors()` | Met à jour les objets et PNJ de départ existants sans écraser leurs données de règles personnalisées. | La réinstallation n'a plus à réparer des documents existants. |
| `LEGACY_TABLE_KEYS` et la détection par nom de `rebuildTables()` | Retrouvent les tables créées avant leurs flags `starterId`/`tableKey`. | Toutes les tables concernées ont des flags stables. |
| `repairKnowledgePacks()`, `syncSkillPack()`, `syncTabletPack()` et `rebuildCompendiumFromBlueprints()` | Réparent les six compendiums de connaissances des mondes de développement, y compris les dossiers en double créés par l'ancien réimport sans `keepId`. La reconstruction préserve désormais les identifiants stables et vérifie l'affectation des objets aux dossiers. | Les packs distribués sont la seule origine des compendiums et aucun monde de développement ne nécessite cette réparation. |
| `KNOWLEDGE_SYNC_VERSION` et `syncImportedKnowledgeItems()` | Réparent les connaissances mondiales ou intégrées aux acteurs : textes, provenance, `catalogId`, doublons et anciennes formes. | Tous les PJ/PNJ historiques ont été effacés. |
| Suppression de `isLegacyWorldMagicCatalogItem()` dans `importStarterContent()` | Nettoie les copies mondiales héritées de tablettes, sorts et pouvoirs. Le catalogue est désormais fourni par les compendiums ; les copies restent seulement intégrées aux acteurs. | La dernière ancienne réinstallation a été effectuée, ou les mondes ont été supprimés. |
| `obsoleteWorldKnowledge` pour `vitnerWeavers` | Retire une connaissance mondiale issue d'un ancien catalogue Vitner. | Les mondes antérieurs ont disparu. |
| Réparation des textes de connaissances, rapprochement par libellé et rafraîchissement des sorts/tablettes intégrés | Met à niveau les descriptions et liens des anciennes copies dans les Items et les acteurs. | Les mondes historiques ont été supprimés. |
| `starterWeaponPools` | Complète `combatSpecialty` sur les trois armes de départ à distance d'anciens acteurs. | Aucun acteur créé avant les pools de PC liés ne subsiste. |
| `CONTENT_VERSION = 18` et `upsertJournals()` | Ajoutent les Journaux Équipement, Races et Archétypes aux mondes déjà créés. | Tous les mondes antérieurs ont reçu les Journaux, ou ont été supprimés. |
| `CONTENT_VERSION = 21` et `throwingWeaponChanges()` | Convertissent les anciennes armes de lancer, autrefois enregistrées avec `combatSpecialty: throwingWeapons`, en armes de mêlée marquées `isThrowingWeapon`. | Aucun monde ne contient plus d'arme créée avant la séparation entre profil de mêlée et mode de lancer. |
| `CONTENT_VERSION = 29` et `rebuildTables()` | Réinstallent dans les mondes existants les deux tables d'effets funestes avec une borne basse de 1, pour contourner le rejet des plages commençant à 0 par Foundry V14. | Les mondes de développement antérieurs à cette correction ont été supprimés. |
| `CONTENT_VERSION = 30` et `rebuildTables()` | Réinstallent les deux tables d'effets funestes avec une formule JO 9 correcte et l'affichage du vrai jet de dé. | Les mondes de développement antérieurs à cette correction ont été supprimés. |
| `CONTENT_VERSION = 31` et la mise à jour des tablettes intégrées dans `importStarterContent()` | Complètent les tablettes déjà apprises par les PJ/PNJ avec les résumés, noms suédois, négations et affinités du catalogue enrichi. | Les mondes de développement antérieurs à cette correction ont été supprimés. |
| `CONTENT_VERSION = 32` et la mise à jour des sorts/pouvoirs intégrés dans `importStarterContent()` | Complètent les copies déjà apprises avec les descriptions intégrales, caractéristiques, niveaux de puissance et métadonnées des runes. | Les mondes de développement antérieurs à cette correction ont été supprimés. |
| `CONTENT_VERSION = 33` et `upsertJournals()` | Ajoutent les six Journaux Religions aux mondes de développement déjà installés. | Tous les mondes antérieurs ont reçu ces Journaux, ou ont été supprimés. |
| `CONTENT_VERSION = 34` et `upsertJournals()` | Ajoutent le dossier Règles et le Journal Taille des créatures, avec les sept tableaux des pages 9-10 du Bestiaire français et le tableau de déplacement dérivé. | En attente dans les mondes existants ; appliquée au prochain démarrage avec cette version du système. |
| `CONTENT_VERSION = 35` et `syncNpcCreatureData()` dans `upsertActors()` | Ajoutent aux PNJ de départ existants les lignes d'attaques (`system.attacks`) et les effets de capacités manquants, sans doublons ni écrasement des stats. | Tous les PNJ historiques ont reçu ces ajouts, ou ont été supprimés. |
| `CONTENT_VERSION = 36` et `syncNpcCreatureData()` étendu dans `upsertActors()` | Complètent les PNJ de départ existants avec les champs du bestiaire `details.type/move/bodyMin/armor`, `initiative.base` et le résumé `system.description`, uniquement lorsque les champs sont vides/absents (la description seulement si vide ou encore l'ancien texte de départ) ; les valeurs personnalisées par le MJ sont préservées. | Tous les PNJ historiques ont reçu ces ajouts, ou ont été supprimés. |
| `CONTENT_VERSION = 37` et `syncNpcCreatureData()` étendu dans `upsertActors()` | Complètent les PNJ de départ existants avec l'arbre de compétences du bestiaire `system.skillTree` (lignes livre nom/valeur/genre dans l'ordre de l'arbre), uniquement lorsque le champ est vide/absent ; les arbres personnalisés par le MJ sont préservés. | Tous les PNJ historiques ont reçu cet ajout, ou ont été supprimés. |
| `CONTENT_VERSION = 38` et `normalizeWeaponRanges()` dans `importStarterContent()` | Normalisent `system.range.short/long` de chaque arme (Items mondiaux + armes intégrées aux acteurs) en entiers finis ≥ 0 : chaînes numériques ("50"→50, "50m"/"50 m"→50), lecture du premier nombre ("10/20"→10), repli 0 ("" / null / undefined / NaN / indéchiffrable), mise à jour uniquement si changement, try/catch par document. | Aucun monde ne contient plus de portée d'arme non numérique. |
| `CONTENT_VERSION = 39` et le complément de `details.bodyMax` dans `syncNpcCreatureData()` | Ajoutent la borne supérieure des PS du bestiaire aux PNJ de départ existants, uniquement si absente ou nulle. Les bornes personnalisées positives, les PS actuels et le maximum de l’exemplaire joué restent inchangés. | Tous les PNJ historiques ont reçu cette borne, ou ont été supprimés. |
| `CONTENT_VERSION = 40`, `initializeNpcInventory()` dans `modules/npc-inventory.mjs` et le flag `inventoryInitialized` | Ajoutent une fois les armes, armures et boucliers matériels aux PNJ de départ dont l’inventaire est encore vide. Tout inventaire personnalisé est préservé en entier. Le flag empêche une réinstallation de recréer les objets supprimés ; la boucle historique de réimport ignore désormais ces équipements. Les copies locales déjà modifiées des tokens ne sont jamais écrasées directement. | Tous les anciens PNJ de départ ont été initialisés, ou ont été supprimés. Retirer la fonction, ses appels, le flag sur les créations et l’exclusion dans la boucle historique avec cette migration. |
| `CONTENT_VERSION = 42` puis `46` et `legacyLabelVariants`/`obsoleteAttacks` dans `syncNpcCreatureData()` | Actualisent les anciennes combinaisons intactes du galtir et du minokks : d’abord les catégories d’armes, puis les noms exacts des armes de leur inventaire. Les combinaisons personnalisées par le MJ restent inchangées. | Tous les PNJ de départ antérieurs ont été actualisés, ou ont été supprimés. |
| `CONTENT_VERSION = 47` et `oldMinokksAttacks` dans `syncNpcCreatureData()` | Corrigent les allocations initiales du minokks déjà importé seulement si toutes ses combinaisons correspondent exactement à l'ancienne référence ; la comparaison vérifie désormais aussi les noms d'attaque et les étapes de mouvement. | Tous les minokks de départ ont été actualisés, ou ont été supprimés. |
| `CONTENT_VERSION = 43` et `rebuildTables()` | Installent le dossier Divers (sous Magie) et la table de détermination du stade des extraits (EFFETS DES EXTRAITS : 1-5 léger, 6-10 modéré, 11-15 fort, 16+ total) dans les mondes existants. | Tous les mondes antérieurs ont reçu ce dossier et cette table, ou ont été supprimés. |
| `CONTENT_VERSION = 44` et `rebuildTables()` | Remontent le dossier Divers au même niveau que Magie et corrigent l'image de la table (d20) ainsi que l'icône fiole FontAwesome de sa carte. | Tous les mondes antérieurs ont le dossier Divers à la racine, ou ont été supprimés. |
| `CONTENT_VERSION = 45` et `rebuildTables()` | Renomment la table de détermination du stade en « Effets des potions » dans les mondes existants. | Tous les mondes antérieurs affichent le nouveau nom, ou ont été supprimés. |
| `ensureTraitSituationMacro()` et les anciens noms bilingues | Renomment la macro de résistance déjà créée, remplacent son icône et reconnaissent les copies sans flag portant l'ancien nom. | Toutes les macros existantes ont été reconnues ou les anciens mondes ont été supprimés. |

La version de contenu 41 ajoute les profils d’armes naturelles de départ par la boucle historique de réimport et appelle `initializeNpcCombatKnowledge()` (`modules/npc-inventory.mjs`) pour compléter uniquement les identifiants `skillId/catalogId` manquants des anciennes lignes du bestiaire. Les niveaux, noms, lignes personnalisées et inventaires matériels restent inchangés. Cette adoption d’identifiants et son appel sont supprimables après effacement des anciens mondes. Le garde-fou d’inventaire de la version 40 inclut désormais aussi les objets, extraits et potions.

## `modules/rules/combat-pool-resolver.mjs`

| Code | Rôle transitoire | Suppression possible lorsque |
|---|---|---|
| Entrée `battleExperience` à capacité nulle | Lit l'ancien pool persistant afin qu'il n'invalide pas les données d'un personnage. | Tous les acteurs utilisent les pools actuels. |
| Repli de `weaponType()` vers `system.category` | Lit la catégorie d'arme historique, avant `system.combatSpecialty`. | Toutes les armes ont leur type moderne. |
| `categoryForWeaponType()` et sa synchronisation | Continue d'écrire la catégorie historique pour les anciens mondes/modules. | Les consommateurs de `system.category` ont été supprimés ou migrés. |
| Repli PNJ de `resolveCombatPools()` vers `resources.combat.max/value` quand `free.spent < 0` | Conserve la dépense historique `ancien max − ancienne valeur` dans la nouvelle réserve libre calculée depuis Combat et Expérience du combat ; ne confond plus l’ancien maximum unique avec le maximum des compétences. | Tous les PNJ ont un compteur explicite `system.combatPools.free.spent >= 0`. |
| Reconnaissance des anciens noms « Mains nues »/« Unarmed » dans `isUnarmedWeapon()` | Identifie les profils intégrés avant l'ajout du champ `isUnarmed`, notamment la copie du minokks partageant autrefois la réserve d'armes naturelles. | Tous les profils d'armes à mains nues des mondes de développement portent `system.isUnarmed`. |

## `modules/rules/active-spell-resolver.mjs`

| Code | Rôle transitoire | Suppression possible lorsque |
|---|---|---|
| `legacyActiveSpellCastings()` et les champs d'objet `active`, `activeCost`, `activeCastCosts` | Adoptent les coûts individuels enregistrés sur les sorts avant que chaque lancement soit porté par l'acteur. Un ancien coût agrégé n'est repris qu'en dernier recours ; un booléen `active` sans coût ne suffit jamais. | Les mondes de développement antérieurs à la version 0.42 ont été effacés ou leurs sorts actifs ont été terminés. |
| `activeSpellCastingsMigrated` | Empêche la réapparition des anciennes activations stockées sur les objets après la fin du dernier lancement porté par l'acteur. | Aucun monde ne contient plus d'anciens sorts actifs sur les objets. |

## Hors périmètre

`availablePortraits()` dans `modules/portrait.mjs` propose les autres images du Bestiaire aux acteurs importés en 0.65.0 dont `system.portraits` est encore vide. Ce repli lit le catalogue généré à partir du flag `bestiaryId`, sans écrire dans les mondes ni remplacer un avatar personnalisé. Il est supprimable lorsque ces exemplaires anciens ont une galerie enregistrée ou ont été effacés. Le repli général vers `actor.img` pour un acteur sans galerie reste, lui, un comportement normal pour les nouvelles fiches à portrait unique.

Depuis la version 0.65, les huit PNJ de départ et leur dossier ne figurent plus dans `data/starter-content.json` : les créatures sont distribuées dans les compendiums Bestiaire. La réinstallation ne recrée ni ne supprime les anciens exemplaires mondiaux. Les anciens helpers `upsertActors()`, `applyBakedCreatureStats()`, `syncNpcCreatureData()` et les données de `modules/creature-feats.mjs` restent des reliquats temporaires, sans nouvelles entrées à importer ; ils pourront être retirés avec les autres migrations de développement. Les fiches de capacités reconnaissent encore les capacités historiques stockées en ActiveEffect via `flags.trudvang-chronicles.feat` (`creature-ability.mjs` et `TrudvangCreatureAbilitySheet`), tandis que les nouveaux compendiums utilisent le type Item `creatureAbility` : ce chemin historique est également supprimable après effacement des anciens mondes.

Les fallbacks d'API Foundry V14/V16, la compatibilité de données avec des modules tiers et les outils de réparation explicitement destinés aux compendiums distribués ne sont pas automatiquement temporaires. Ils ne doivent donc être retirés qu'après une décision distincte.
