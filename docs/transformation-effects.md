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
les états, les règles et les liens des 286 variantes.

Le sens de l’odorat propose ses variantes améliorée et affaiblie : leur bonus ou
malus est calculé à partir des niveaux de puissance et disponible pour un jet de
situation depuis l’effet. Les fenêtres de compétence et de spécialité proposent
une case pour appliquer ce modificateur lorsque l’odorat intervient dans le test.
La portée améliorée et la perte d’odorat à −10 restent informatives.
Les variantes d’ouïe et de vue utilisent le même mécanisme ; leurs variantes
affaiblies accordent respectivement les statuts sourd et aveugle à −10 ou moins.
Langue de Siro Werte et Sagesse de Gave enregistrent la langue choisie et
proposent leur bonus sur les seuls tests de Connaissances. Pour plusieurs alliés,
les mêmes améliorations sont partagées, mais la langue doit encore être saisie
pour chaque cible ; le joueur doit choisir la même langue pour toutes.
Forgeron nain propose les spécialités d’Artisanat connues du bénéficiaire : son
bonus s’applique automatiquement à la spécialité choisie dans les fenêtres de test.

Les descriptions et les annonces proposent des boutons d’effets. On peut les glisser
sur la fiche d’un acteur, son token ou un objet de son inventaire. Le lanceur et le
MJ peuvent aussi cliquer sur un bouton : l’effet s’applique aux cibles enregistrées
pour cette variante. La liste reprend initialement les cibles du lancement ; ses
boutons + et − permettent au lanceur ou au MJ de la modifier. Les propriétaires
des cibles peuvent également glisser les effets. Lorsqu’une répartition est
nécessaire, une fenêtre portant le nom de la cible est ouverte successivement
pour chaque acteur. Les effets de zone aux paramètres communs et à la durée
déterministe s’appliquent directement. Le MJ actif arbitre les créations nécessitant
ses permissions et les limites de chaque lancement. Pour les anciens messages sans
liste enregistrée, on peut ajouter les cibles avec +.

Les variantes prédéfinies sont proposées séparément. Transformation et les formes
libres de créatures ouvrent un choix dans le bestiaire. Les déguisements en objets
sans profil chiffré restent descriptifs ; aucun profil n’est inventé. La durée et les
améliorations numériques reconnues sont ajustables avant application. Une annonce
de lancement conserve les comptes d’améliorations choisis dans ses offres.

## Suite du chantier : lancements, cibles et maintien

1. **Identité du lancement** : attribuer un identifiant distinct avant le jet de
   chaque sortilège maintenu ; le transmettre à la carte et aux effets appliqués,
   avec l'UUID du lanceur. Les anciens messages et effets ne sont pas associés
   arbitrairement à un lancement et conservent leur fonctionnement actuel.
2. **Références des effets** : le repérage en lecture seule retrouve maintenant
   les UUID des effets par lanceur et lancement, y compris sur les acteurs de
   tokens non liés de toutes les scènes, sans doublonner les tokens liés. Le MJ
   actif enregistre les références et conserve la trace d'une première application.
   Les instances de plusieurs lancements restent distinctes sur un même acteur.
3. **Maintien bidirectionnel** : la disparition du dernier effet lié termine le
   lancement ; l'arrêt depuis la fiche demande au MJ actif de supprimer tous ses
   effets. Les autres lancements et les effets sans provenance sont conservés ;
   un sort auquel aucun effet n'a été appliqué ne se termine pas sur une liste vide.
   Les nouveaux liens s'appuient sur les identifiants introduits en 0.122 : les
   anciennes cartes et anciens effets ne sont pas associés arbitrairement. Sans MJ
   actif, les suppressions entre propriétaires ne peuvent pas être coordonnées.
4. **Cibles et améliorations** : Hâte, Vigueur, Peau de cuir et Armure d’air disposent d'une définition
   structurée des cibles dans les sources FR/EN. Pour ces sortilèges, le MJ
   actif réserve les cibles et les améliorations par lancement ; les attributions
   concurrentes sont sérialisées et validées contre les niveaux achetés. Les
   règles p. 142–143 permettent de répartir ces niveaux entre cibles. Une cible
   déjà affectée peut réappliquer la même variante, sans en recevoir une autre.
   Les autres sorts ne sont pas encore soumis à ces limites : ajouter leurs
   définitions après vérification, sans inventer de limite pour les zones,
   cibles variables ou cas illimités. Les niveaux achetés avec les points gratuits
   d'une réussite parfaite rejoignent ceux du lancement pour la répartition, sans
   augmenter son coût maintenu. Cri de bataille et Cri de guerre utilisent leur
   carte de chat comme registre d'invocation, sans devenir des sortilèges maintenus.
   Pour Cri de guerre, les plafonds d'alliés et d'ennemis sont indépendants et les
   niveaux sont répartis entre leurs cibles. Pour Tonnerre victorieux, les cibles
   n'ont pas de plafond numérique et les améliorations du pouvoir s'appliquent à
   tous les alliés ou ennemis concernés. La sélection des personnes à portée
   reste manuelle. Les autres pouvoirs et les runes restent à traiter.
5. **Généralisation** : ajouter progressivement les effets de sortilèges, pouvoirs
   et runes depuis les sources, avec tests des améliorations et des règles propres
   à chaque effet. Les pouvoirs ne deviennent pas des sortilèges maintenus.

À chaque étape, tester les cas sans effet, une et plusieurs cibles, deux
lancements identiques, les durées indépendantes, les tokens liés et non liés,
les permissions et les anciens messages. Les limites et allocations sont actives
pour Hâte, Vigueur, Peau de cuir, Armure d’air, Cri de bataille, Cri de guerre et Tonnerre victorieux depuis la carte
d'un nouveau lancement. Les anciens messages sans identité restent inchangés.

La pétrification propose les deux effets de récupération, la malédiction de l’arbre
sa raideur, et les frénésies leur épuisement. Une description d’effet propose ses
successeurs. Ces transitions sont manuelles ; le délai de retour de Transformation
reste géré oralement. L’épuisement peut reprendre la moitié du temps écoulé sous
l’effet source. La maladie des wargs et la forme de warg garou sont deux effets :
leurs tests et leur application restent des actions distinctes.

## Préparation et ressources

Les acteurs disposent de `system.senses`, une liste de facultés
`{type, label, range, enabled}`. La portée est en mètres ; `null` signifie qu’aucune
limite n’est spécifiée. Vision normale est proposée par défaut. Les bestiaires
FR/EN renseignent ce champ et les transformations de forme le transfèrent. Les
effets peuvent ajouter des sens via `system.transformation.senses`, ou remplacer
le profil pendant la transformation avec `system.transformation.sensesReplace`.
Les sens sont affichés sur une ligne dans le cadre État des fiches PJ/PNJ, sous
un séparateur en bas du cadre santé pour les PNJ. La fiche ne présente ni portée
ni contrôles détaillés ; les ajustements de vision se font dans la configuration
du token et sont conservés lors des mises à jour sans changement du profil sensoriel.
Les autres sens que
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

Les pouvoirs Force du troll et Force de hinje de la tablette Force de Storme
admettent chacun un bénéficiaire par invocation. Force du jotun distingue les
bénéficiaires choisis à +8, dont le nombre dépend des niveaux achetés, des autres
alliés à portée, sans plafond numérique. Sa durée et l'amélioration des alliés
sont communes à toutes les personnes concernées ; le choix des alliés à portée
reste manuel (Livre des règles, p. 218–219).

Force d'âme et Témérité ont chacun un bénéficiaire. Cœur d'Enken distingue
le bénéficiaire principal à +8 en Psychisme, ses éventuels bénéficiaires
supplémentaires et le lanceur accompagné d'au plus deux amis à +4 ou +6.
La durée et l'amélioration des amis sont communes ; la portée et le choix
des amis restent à vérifier par les joueurs (Livre des règles, p. 224–225).

Les pouvoirs divins personnels dont les effets sont déjà définis ne peuvent
être appliqués qu'au lanceur depuis la carte de l'invocation. Vision nocturne
d'Enken permet de choisir une autre personne si l'amélioration de portée au
contact a été achetée ; elle conserve une seule cible. La rune Poings d'acier
concerne le porteur de son équipement et n'est pas soumise à cette restriction.
Les références d'effets appliquées hors d'une carte de lancement restent libres.

Ouïe du hibou et Sens du griffon améliorent les sens du lanceur : leur portée
indique la distance d'audition, pas une distance d'application sur autrui.
Peau d'écorce, Membre de pierre et Transformation n'admettent qu'une cible
par invocation ou lancement ; le membre affecté est choisi parmi les variantes.
Leur portée, les conditions de taille et les résistances restent à vérifier
selon les règles (Livre des règles, p. 196, 244–245, 258 et 271).

Les pétrifications, Statue, Monument en pierre et les deux Malédictions de
l'arbre ont une cible par lancement. Leurs effets de récupération liés restent
manuels : ils conservent leur provenance, mais ne réservent pas une nouvelle
cible et ne prolongent pas le maintien du sort d'origine.

Guérison de Solvei et Guérison de Sille ajoutent leur bonus à la récupération
naturelle lors d'une nuit de sommeil, avec durée et bonus ajustés par les
niveaux de puissance. Le bénéficiaire doit rester au repos : si cette condition
cesse, le MJ retire l'effet manuellement (Livre des règles, p. 216 ; Stormlands,
p. 123). Chaque invocation ne concerne qu'une personne.

Autorité, Appel du jarl et Voix de Storme proposent des effets descriptifs
après le test de résistance. La résistance et la durée sont répartissables
entre les personnes choisies ; Voix de Storme admet trois cibles plus celles
achetées. La portée, le résultat de la résistance et l'interprétation des
ordres sont vérifiés par les joueurs (Livre des règles, p. 218–219).

Sens pétrifiés et Esprit brisé appliquent les malus d'initiative et d'actions
de combat, en tenant compte des niveaux de puissance. Une invocation affecte
une seule cible ; la taille et la portée restent à vérifier manuellement
(Livre des règles, p. 251 et 270).

Les soins instantanés de Solvei et Sille utilisent les conséquences immédiates :
le MJ actif réserve la cible de l'invocation avant de restaurer les PS. Une
même invocation ne peut pas soigner la même personne deux fois, même en cas
de demandes concurrentes ; l'annonce indique les points réellement rendus.
Le nombre de points dépend des niveaux alloués. La fin des saignements est
un rappel à gérer manuellement, en l'absence d'un état de saignement dédié.

Chaleur guérisseuse et Souffle de Solvei ou de Sille améliorent automatiquement
la récupération pendant le repos. Le bonus conditionnel pour vaincre une
maladie, neutraliser un poison ou dissiper une malédiction est calculé et
inscrit sur l'effet et un bouton ouvre un jet de situation avec ce bonus ; il
ne modifie pas tous les jets de situation. Le joueur renseigne la valeur et le
trait applicables à l'affection dans la fenêtre. La rupture du repos reste manuelle.

Volonté et Courage des ancêtres remplacent le Psychisme du bénéficiaire par le
trait indiqué. Sans peur (Halawen) offre un effet principal à une ou plusieurs
personnes et, si au moins l'une d'elles est autre que le lanceur, un effet
secondaire au lanceur et à deux alliés au maximum. La durée est commune ;
l'amélioration de l'effet secondaire est attribuée à un allié. La portée reste
à vérifier manuellement (Livre des règles, p. 239–240).

Les effets dont les conséquences sont contextuelles peuvent exposer un bouton
de jet de compétence conditionnel et un résumé calculé depuis les niveaux du
lancement. Adhérence utilise cette méthode pour l'escalade : le bonus d'Agilité
ne s'applique pas aux autres jets, et le déplacement particulier reste descriptif.
Les tags éditables des PNJ proviennent des références bilingues du bestiaire ;
ils servent à décrire les catégories et ne déclenchent pas encore de bonus.

Respiration aquatique, Traces et les deux variantes d’Orientation disposent d’effets descriptifs avec leurs durées améliorées. Les terrains supplémentaires de l’ihana sont comptés ; le joueur note les types choisis. Les cibles supplémentaires de Respiration aquatique, Traces et Orientation sont limitées aux niveaux achetés.

Sourcier, Marches dans la terre et la pierre, Chemin du retour, Environnement, Cartographie, Espionnage et Voyage astral exposent leurs règles descriptives et les améliorations choisies dans la description et l’infobulle. Leur durée est calculée ; les mouvements particuliers, la portée, les conditions et les conséquences restent à gérer en jeu. Chemin du retour limite ses cibles supplémentaires aux niveaux achetés. Les marches à travers la terre et la pierre étant soutenues, leurs restrictions de contact et de nombre de cibles restent à contrôler manuellement.

Vingt pouvoirs divins de météo, de voyage et d’invocation proposent un effet descriptif : la durée et ses améliorations sont calculées, les autres niveaux achetés sont rappelés en détail et au survol. Les aires et leurs conditions sont gérées par les joueurs ; les esprits et montures ne sont pas créés automatiquement. Les bonus de chasse, la météo et les vitesses de voyage sont indiqués par les descriptions et ne modifient pas automatiquement les jets ou les déplacements.

Enchantement de créature et Malédiction de créature appliquent automatiquement leur bonus ou malus aux tests de compétence et de situation, avec les niveaux alloués. La levée de la malédiction à la mort du lanceur reste manuelle. Les détections, contrôles et perceptions ajoutés conservent leur description, durée, améliorations et jets de résistance ; leurs effets narratifs et les résultats des tables restent à gérer en jeu.

Cinquante effets supplémentaires couvrent la météo, les perceptions, les objets, les communications, les voyages et diverses invocations. Les durées sont calculées depuis les niveaux de puissance et les autres améliorations allouées sont rappelées au survol et dans le détail. Les zones, changements du décor, créatures invoquées, effets sur les objets, bonus conditionnels et conséquences des descriptions restent à gérer manuellement.

Vision lointaine apporte son bonus aux attaques à distance ; sa portée visuelle et la modification éventuelle de portée de l’arme restent à interpréter. Regard de l’âme et Œil d’Enken proposent leur bonus conditionnel et un jet d’Arts des ombres. Les trois pouvoirs d’autorité proposent leur bonus de persuasion pour les jets pertinents. Lumière rassurante et Radiance sacrée annulent les malus de peur sans empêcher l’acquisition de peur ; appliquer ou retirer leurs effets aux alliés reste manuel selon leur position. La malédiction joar requiert une levée manuelle à la mort de la mopor.
