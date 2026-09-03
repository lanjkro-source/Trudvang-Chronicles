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
| `repairKnowledgePacks()`, `syncSkillPack()`, `syncTabletPack()` et `rebuildCompendiumFromBlueprints()` | Réparent les compendiums produits par d'anciens formats de stockage ou une mise à jour interrompue. | Les packs distribués sont la seule origine des compendiums. |
| `KNOWLEDGE_SYNC_VERSION` et `syncImportedKnowledgeItems()` | Réparent les connaissances mondiales ou intégrées aux acteurs : textes, provenance, `catalogId`, doublons et anciennes formes. | Tous les PJ/PNJ historiques ont été effacés. |
| Suppression de `isLegacyWorldMagicCatalogItem()` dans `importStarterContent()` | Nettoie les copies mondiales héritées de tablettes, sorts et pouvoirs. Le catalogue est désormais fourni par les compendiums ; les copies restent seulement intégrées aux acteurs. | La dernière ancienne réinstallation a été effectuée, ou les mondes ont été supprimés. |
| `obsoleteWorldKnowledge` pour `vitnerWeavers` | Retire une connaissance mondiale issue d'un ancien catalogue Vitner. | Les mondes antérieurs ont disparu. |
| Réparation des textes de connaissances, rapprochement par libellé et rafraîchissement des sorts/tablettes intégrés | Met à niveau les descriptions et liens des anciennes copies dans les Items et les acteurs. | Les mondes historiques ont été supprimés. |
| `starterWeaponPools` | Complète `combatSpecialty` sur les trois armes de départ à distance d'anciens acteurs. | Aucun acteur créé avant les pools de PC liés ne subsiste. |
| `CONTENT_VERSION = 18` et `upsertJournals()` | Ajoutent les Journaux Équipement, Races et Archétypes aux mondes déjà créés. | Tous les mondes antérieurs ont reçu les Journaux, ou ont été supprimés. |
| `CONTENT_VERSION = 21` et `throwingWeaponChanges()` | Convertissent les anciennes armes de lancer, autrefois enregistrées avec `combatSpecialty: throwingWeapons`, en armes de mêlée marquées `isThrowingWeapon`. | Aucun monde ne contient plus d'arme créée avant la séparation entre profil de mêlée et mode de lancer. |

## `modules/rules/combat-pool-resolver.mjs`

| Code | Rôle transitoire | Suppression possible lorsque |
|---|---|---|
| Entrée `battleExperience` à capacité nulle | Lit l'ancien pool persistant afin qu'il n'invalide pas les données d'un personnage. | Tous les acteurs utilisent les pools actuels. |
| Repli de `weaponType()` vers `system.category` | Lit la catégorie d'arme historique, avant `system.combatSpecialty`. | Toutes les armes ont leur type moderne. |
| `categoryForWeaponType()` et sa synchronisation | Continue d'écrire la catégorie historique pour les anciens mondes/modules. | Les consommateurs de `system.category` ont été supprimés ou migrés. |
| Repli NPC de `poolState()` vers `resources.combat.value` | Traduit l'ancienne réserve de combat unique en pool libre. | Tous les PNJ ont `system.combatPools`. |

## Hors périmètre

Les fallbacks d'API Foundry V14/V16, la compatibilité de données avec des modules tiers et les outils de réparation explicitement destinés aux compendiums distribués ne sont pas automatiquement temporaires. Ils ne doivent donc être retirés qu'après une décision distincte.
