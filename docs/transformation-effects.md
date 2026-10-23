# Effets de transformation

Les modèles sont écrits dans `effectTemplates` et `effectParameters` des JSON FR
`trudvang-powers-fr.json` et `trudvang-feats-fr.json` du dépôt privé. Leurs homologues
EN portent les noms et descriptions traduits. L’inventaire des métamorphoses conserve
les références des règles ; ses anciens identifiants de pouvoirs ont été normalisés.

`node tools/generate-transformation-data.mjs` génère le catalogue structurel et les
textes de `lang/*.json`. `--check`, exécuté par la validation locale quand les sources
sont disponibles, détecte un catalogue périmé. Les modèles sont indépendants des
compendiums : un objet existant conservant son `catalogId` bénéficie des nouvelles offres
dans sa description, sans migration ni modification d’un monde installé.

## Utilisation

Les compendiums « Effets (fr) » et « Effects (en) » proposent chaque variante sous
forme d’objet de référence contenant son ActiveEffect natif. Le glisser-déposer de
l’entrée ou de cet effet ouvre la même application paramétrée que depuis un sort.
Les fichiers `game doc/fr/trudvang-effects-fr.json` et
`game doc/en/trudvang-effects-en.json` sont des exports de référence générés ; ils
contiennent l’identité stable, la provenance, les textes, la durée, les changements,
les états, les règles et les liens des 115 variantes.

Les descriptions et les annonces d’utilisation proposent des boutons d’effets. On
peut les glisser sur la fiche d’un acteur ou sur son token ; cliquer applique l’effet
au propriétaire de la source ou à l’acteur contrôlé/assigné. Les permissions de
l’acteur destinataire sont vérifiées avant toute création.

Les variantes prédéfinies sont proposées séparément. Transformation et les formes
libres de créatures ouvrent un choix dans le bestiaire. Les déguisements en objets
sans profil chiffré restent descriptifs ; aucun profil n’est inventé. La durée et les
améliorations numériques reconnues sont ajustables avant application. Une annonce
de lancement conserve les comptes d’améliorations choisis dans ses offres.

La pétrification propose les deux effets de récupération, la malédiction de l’arbre
sa raideur, et les frénésies leur épuisement. Une description d’effet propose ses
successeurs. Ces transitions sont manuelles ; le délai de retour de Transformation
reste géré oralement. L’épuisement peut reprendre la moitié du temps écoulé sous
l’effet source. La maladie des wargs et la forme de warg garou sont deux effets :
leurs tests et leur application restent des actions distinctes.

## Préparation et ressources

Les acteurs disposent de `system.senses`, une liste éditable de facultés
`{type, label, range, enabled}`. La portée est en mètres ; `null` signifie qu’aucune
limite n’est spécifiée. Vision normale est proposée par défaut. Les bestiaires
FR/EN renseignent ce champ et les transformations de forme le transfèrent. Les
effets peuvent ajouter des sens via `system.transformation.senses`, ou remplacer
le profil pendant la transformation avec `system.transformation.sensesReplace`.
Les sens sont affichés dans le cadre État des fiches PJ/PNJ ; les autres sens que
la vision restent des rappels textuels. Les portées de l’Ouïe du hibou et du Sens
du griffon suivent leurs améliorations sans modifier la détection Foundry.

Conformément au choix du MJ, Vision nocturne et Vision dans le noir activent
`sight.enabled`, le mode `darkvision`, ainsi que `detectionModes.darkvision` avec
sa portée. Les détections de Foundry V14 utilisent un objet indexé par identifiant.
Les autres détections sont conservées. À la suppression, les réglages gérés sont
restaurés si le MJ ne les a pas modifiés entre-temps. La portée maximale est
utilisée ; les paliers de netteté restent descriptifs. Les distances sont converties
si la scène est en pieds ou en kilomètres.

Les effets appliqués portent `transformation.resolved`. Leur copie conserve les
valeurs déjà résolues et leur durée sans réappliquer les améliorations, les niveaux
de savoir ou les tirages aléatoires. Les anciennes copies sont reconnues par leur
date `appliedAt`. Les références de compendium restent paramétrables à chaque
application. L’inventaire des rappels descriptifs est dans
[`descriptive-effects.md`](descriptive-effects.md).

Chaque conséquence est enregistrée dans `system.changes` ou dans les états de
l’effet. Les propriétés de profil utilisent `system.transformation.<propriété>` :
par exemple `temporaryHP = 5`, `ignoreFear = true`, `noParry = true`,
`fearFactor = 1d10`. Les listes et objets utilisent une valeur JSON, notamment
`movement = [{"mode":"flight","method":"replace","value":24}]` et
`damage = {"value":2,"usages":["melee","throwing","natural"]}`.
L’éditeur propose ces chemins, leur libellé et des exemples. Un effet créé à la
main utilise les mêmes calculs et les mêmes restrictions qu’un effet du catalogue.
La consommation des réserves reste un état de suivi de l’effet, indépendant de sa
configuration ; modifier ou désactiver l’effet ne recharge pas les PS consommés.
Les anciens effets restent lisibles ; leur éditeur affiche également leurs
anciennes propriétés et les enregistre en modifications lors de la sauvegarde.
Les modifications natives de Foundry sont des DataModels pouvant référencer leur
parent. Avant toute copie vers un nouvel effet, `effect-source.mjs` en extrait les
champs scalaires (`key`, `type`, `value`, `phase`, `priority`), y compris dans les
étapes. Ne jamais cloner directement le graphe d’un modèle préparé :
`structuredClone` conserve ses cycles, puis `foundry.utils.deepClone` dépasse sa
profondeur maximale lors de la création du document.

Les fiches PJ et PNJ affichent les PS sous la forme `32 / 43 + 5`. Le rappel des
PS temporaires suit les conséquences des blessures dans Santé ; les déplacements
modifiés et les modes ajoutés figurent dans Mouvement. Les effets et leurs
conséquences occupent un cadre sous les traits des PJ et une section du cadre
Capacités des PNJ. Le facteur de peur conféré par un effet est lançable sur les
deux types de fiche. Chez les PNJ, il utilise les champs existants et conserve les
composantes les plus redoutables (nombre de dés et seuil de jet ouvert), sans
modifier la valeur d’origine. Le bandeau de rappel en haut de la fiche a été retiré.

Hâte et sa version inversée renseignent dans la modification de Dextérité un
`skillBonus` : liste `skills` et table `values` reliant la Dextérité obtenue au
bonus de VC. À l’application, cette table produit deux modifications natives
éditables sur `system.effective.skills.agility` et `system.effective.skills.fighting`.
Ainsi, une Dextérité finale de +4 donne +3 aux VC, conformément au Livre des règles,
p. 194–195. Le détail des compétences et des jets nomme l’effet contributeur.
Les effets déjà appliqués avant ce correctif conservent leurs anciennes lignes :
les supprimer puis les réappliquer pour obtenir les deux nouvelles modifications.

Les références antérieures à 0.97 conservaient leurs règles dynamiques dans
`flags.trudvang-chronicles.transformation.rules`, parfois sans aucune ligne native
(Hâte). Le dépôt convertit ce format avant le calcul, y compris la table de VC de
Hâte, sans réécrire la référence originale. Les références au format éditable actuel
restent prioritaires : une liste délibérément vidée n'est pas remplie à nouveau.
Une ligne structurée invalide provoque une erreur explicite au lieu de créer un
effet privé de ses modifications. Foundry 14.369 peut exporter les valeurs sous
forme de tableaux ou d'objets JSON déjà décodés : la copie et l'éditeur les
sérialisent avec `JSON.stringify`, et le lecteur de règles accepte aussi directement
ces valeurs typées. Ne pas utiliser `String()` sur une valeur structurée.

Les modifications de traits utilisent les changements natifs, avant les calculs
dérivés, avec leurs noms dans les contributions. Les modes de mouvement, la taille
effective, les restrictions de parade/esquive et les bonus de dégâts ciblés sont
préparés sans écrire dans le profil original. Les armes accordées sont des objets
intégrés identifiés par l’effet propriétaire. Elles deviennent inutilisables si
l’effet est désactivé/expiré et sont supprimées avec lui. Les objets originaux ne
sont pas supprimés ou restaurés depuis une sauvegarde.

Les PS temporaires consommés en priorité sont enregistrés sur chaque effet ;
l’application de dégâts et les pertes par la barre du token consomment ces réserves
avant les PS ordinaires. La vitalité des pouvoirs de sang utilise une augmentation
séparée des PS et de leur maximum : retirer l’effet ne soigne pas les blessures.
L’intégrité des statues est suivie séparément. Les formes de Transformation qui
doivent conserver leurs PS ne recalculent pas leur maximum selon la nouvelle Force.

Un changement du maximum de PS conserve la proportion de PS actuels, arrondie au
supérieur : `nouveaux PS = plafond(anciens PS × nouveau maximum / ancien maximum)`.
Ainsi, `30/40` devient `34/45` ; au retour à un maximum de 40, `34/45` devient
`31/40`. Cela s’applique aux changements de traits et de maximum, à l’application,
à la désactivation, à l’expiration et à la suppression d’un effet. Les PS temporaires
restent une réserve distincte et ne participent pas à ce calcul. Les effets qui
conservent explicitement le maximum d’origine ne déclenchent aucun recalcul.
Le maximum de référence et le modificateur de PS associé sont conservés dans
`system.resources.body.maxAtValue` et `modifierAtValue`, puis actualisés par le
même client élu que les marqueurs d’état. Une préparation ou un rechargement ne
réapplique pas l’arrondi. Les dégâts, soins, sacrifices et éditions explicites des
PS enregistrent atomiquement leur nouvelle référence. Au premier chargement d’un
acteur existant, son état actuel est conservé ; les tokens non liés établissent
leur propre référence avant celle de leur acteur de base.

La vision utilise le mode natif du token. Le mode initial est conservé, puis rétabli
quand le dernier effet de vision disparaît ; une modification manuelle ultérieure
du mode est préservée. Les communications, la respiration et les autres facultés
narratives figurent dans le texte et les icônes d’effets.

Les déclenchements exceptionnels décrits par les règles (refroidissement, événement
de mort/résurrection, décapitation, maladie permanente, fréquence de régénération,
choix d’une immunité, qualification élémentaire des dégâts) restent soumis au MJ.
Les effets contiennent leurs consignes ; ils ne déclenchent pas ces événements sans
intervention. Supprimer une transformation ne guérit pas une maladie distincte.

## Vérification

Les modifications des effets de sortilèges et pouvoirs utilisent une priorité de
`10 × niveau` du sort ou pouvoir source. Cette priorité est définie dans les JSON
FR, alignée en anglais, puis conservée dans les compendiums et lors de la création
des modifications calculées (traits, améliorations, vitalité). Les capacités sans
niveau conservent leurs priorités usuelles.

Tests isolés des offres bilingues, liens Joaring, profils, réserves temporaires,
application des attaques accordées, pénalités de récupération et restauration de la
vision. Aucun accès à une installation Foundry n’est utilisé.
