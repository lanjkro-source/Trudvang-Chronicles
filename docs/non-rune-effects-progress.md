# Priorité des effets hors runes

Décision du 9 novembre 2026 : terminer les autres effets avant de reprendre les runes. Les effets de rune déjà livrés restent disponibles ; les prochains développements ne les étendent pas.

## Objets enchantés, maudits et altérés

Implémentés dans les sources françaises et anglaises : Enchantement d’objet, Malédiction d’objet du vitner, sa version de Sonntag et Altération d’objet. Le tableau français d’Enchantement d’objet augmente les dégâts, la VP et la VI dans sa dernière amélioration ; l’omission de la VP dans le texte JSON a été corrigée dans les deux langues avant régénération. Références : Livre des règles, entrées Enchantement d’objet, Malédiction d’objet et Altération d’objet (références sources 153, 185, 203 ; tableau français d’enchantement contrôlé visuellement dans le PDF, page 155), Player’s Handbook, Enchant Object / Curse Object / Alter Object ; Stormlands, Curses of Sonntag.

Les effets doivent être déposés sur l’objet. Leurs modificateurs restent locaux et les copies déjà résolues ne reçoivent pas une seconde fois les améliorations. Les variantes supplémentaires de Malédiction conservent la durée de base. Les budgets distinguent désormais deux objets portés par le même acteur au lieu de réserver deux fois son UUID d’acteur.

L’utilisation d’un objet enchanté ou maudit apparaît parmi les choix conditionnels habituels de toutes les fenêtres de test. Pour une attaque ou parade dont l’arme est connue, le modificateur de cette arme est automatiquement appliqué et intégré à la liste habituelle des bonus et malus, sous la forme « objet - effet » avec le montant à droite, sans icône ni case à cocher ni bonus d’autres armes. Dans les tests où l’objet est inconnu, le joueur indique explicitement son utilisation. Le résultat et le calcul final citent les objets et effets sélectionnés. La validation vérifie encore l’inventaire et l’état des effets pour ne pas appliquer un bonus retiré depuis l’ouverture du dialogue.

Les changements scalaires locaux sont préparés explicitement sur l’Item : phase initiale après ses documents embarqués, puis calculs dérivés du modèle, puis phase finale. Ils utilisent le gestionnaire public `ActiveEffect.implementation.applyChange`, sans écriture en base ni modification de `_source`. Les préparations répétées ne cumulent pas les bonus ; les effets transférés au porteur ne sont pas appliqués à l’objet. Les champs de détail affichent les valeurs actuelles après effets locaux ; la sauvegarde inverse les changements temporaires pour conserver les valeurs intrinsèques. Les VI temporaires absorbent les pertes avant les VI intrinsèques, par décision de jeu : VI 50 + 10 temporaire, perte de 5 → VI 55 puis 50 après expiration ; perte de 12 → VI 48 avant et après expiration. Cette règle vaut pour l’édition de la fiche et les dégâts aux armes, boucliers et armures. Les dépenses temporaires sont enregistrées par effet dans `flags.trudvang-chronicles.integritySpent` ; un recalcul ou rechargement ne les renouvelle pas et la disparition d’un effet ne consomme pas les VI accordées par un autre. Les champs inchangés ne réintègrent pas leurs bonus, même lors d’une sauvegarde complète du formulaire. Un indicateur signale les modifications et l’onglet Modificateurs compare les valeurs intrinsèques et effectives, y compris les VI actuelle et maximale, avec leurs sources. Le +2 d’Enchantement d’objet concerne les tests utilisant l’objet, pas la réserve de PC.

Régression couverte dans `tests/item-preparation.test.mjs` : application réelle de l’enchantement, cycle de préparation de l’objet, calcul des dégâts, fiche et inspection, phases et priorités, répétition sans cumul, désactivation et suppression. Le test reproduit l’ordre de préparation documenté par Foundry : le modèle calcule ses valeurs dérivées avant `ClientDocument.prepareDerivedData`.

L’augmentation temporaire de VI ne devient jamais une modification intrinsèque lors des coups suivants. La VP dérivée de la VI n’est pas comptée deux fois ; la malédiction d’une armure diminue séparément sa VP sans réduire sa VI. Les objets génériques sans champ de VI reçoivent leur modificateur d’utilisation, sans inventer une intégrité ou une protection qu’ils ne modélisent pas encore.

Altération propose séparément apparence, autre propriété physique, renforcement et combinaison apparence/renforcement. La combinaison exige son amélioration ; ramollir un objet n’augmente pas automatiquement ses VP ou sa VI. L’apparence, la propriété choisie et les limites de taille restent textuelles, sans remplacer arbitrairement le nom ou l’image de l’objet. Pour les lancements anciens ayant déjà réservé une cible d’objet sous l’UUID du porteur, utiliser un nouveau lancement pour bénéficier de l’identité d’objet ; aucune migration des anciennes cartes n’est exécutée.

## Vérification représentative dans Foundry

Sur une arme sans autre effet : appliquer Enchantement d’objet, puis attaquer ou parer. Vérifier le modificateur d’utilisation automatiquement présent, le bonus de dégâts et la VI augmentée. Laisser expirer l’effet : les bonus doivent disparaître. Faire ensuite un test de compétence générique : l’objet doit être proposé comme choix explicite, sans bonus imposé à toutes les actions. Ce contrôle vérifie l’intégration native des effets d’objet et la nouvelle couche commune d’interface ; il ne demande pas de tester chaque sort.

## Travail restant

Le décompte des modèles d’effet ne prouve pas la couverture complète. Les attaques instantanées déjà proposées dans les cartes ne doivent pas recevoir artificiellement un effet permanent. Restent à traiter/vérifier, dans cet ordre pratique :

1. Objets et armes invoqués, objets préparés comme potions et sceaux.
2. Effets à résistance renouvelable, maladies, peur et protections conditionnelles manquantes ; conséquences exactes de réussite et d’échec.
3. Zones fixes et contacts (eau bouillante, flammes, parois), gestion d’entrée/sortie et événements de dégâts ; ne pas les remplacer par des auras mobiles.
4. Dissipation, libérations et soins particuliers, retours à la vie, autres procédures instantanées ; distinguer automatisation et décisions du MJ.
5. Relecture des effets déjà implémentés : paramètres, cibles supplémentaires de base, protections spécifiques et auras/lumières oubliées.
6. Conséquences des tables d’échecs magiques, également comprises dans le chantier des effets.

Les runes viennent après cette liste.

## Qualité et Rouille

Les armes et équipements peuvent être marqués « Votif » ou « Tissage de vitner » dans le champ Spécial. Leur modificateur de qualité est proposé uniquement dans le jet d’invocation ou de tissage correspondant, lorsque le joueur sélectionne les objets utilisés ; la somme respecte les mêmes restrictions et le même plafond de +6 que les outils. Les poids et prix préparés et affichés sont arrondis à une décimale, sans réintégration des multiplicateurs temporaires ni des arrondis dans les valeurs intrinsèques lors d’une sauvegarde inchangée. Les matériaux cuir, tissu et os complètent la liste ; les dix armures sources et leurs exemplaires générés du bestiaire ont leur matériau principal renseigné (cuir renforcé de métal : cuir).

La qualité intrinsèque des objets est désormais renseignable : Mauvaise, Médiocre, Normale, Bonne, Magistrale, Légendaire. Les caractéristiques sauvegardées décrivent cette qualité intrinsèque ; un changement de qualité sur la fiche applique seulement la différence de la table. La qualité Normale par défaut ne modifie aucun objet existant et ne déclenche aucune migration.

Rouille se dépose sur un objet et diminue sa qualité d’un degré, plus un par amélioration dédiée, avec une borne à Mauvaise. Les changements concernent les PC des armes et boucliers, VP/VI, prix, encombrement et poids des armures ; ils ne modifient pas les dégâts. Les outils proposent leur modificateur de qualité lorsqu’ils sont utilisés ; seuls les outils de qualité Magistrale ou Légendaire peuvent cumuler leurs bonus, plafonnés ensemble à +6, indépendamment des bonus magiques. Le champ « Objet magique », les dégâts/protections magiques et Enchantement d’objet rendent la cible inéligible à Rouille. Les améliorations de durée sont figées à l’application ; renouveler Rouille remplace sa baisse de qualité, sans la cumuler une seconde fois. La qualité effective est visible dans Détail et Modificateurs ; la sélection de qualité reste verrouillée tant que cet effet la remplace. L’usure réelle subie pendant Rouille persiste à son expiration.

Références : Livre des règles, p.106 (table contrôlée dans le PDF physique p.108), p.108 et p.120–121 ; Rouille p.201–202. Player’s Handbook, Rust ; Game Master’s Guide, Quality et Weapon Quality. La description mentionne une permanence mais aucune amélioration tarifée ne la définit : aucun choix gratuit de permanence n’est ajouté au lancement.

Vérification représentative : prendre une arme non magique de qualité Normale ; appliquer Rouille, constater Médiocre, −1 PC et −10 VI (actuelle et maximale), sans changement de dégâts ; laisser expirer, puis refaire sur une armure et vérifier l’encombrement et le poids. Les tests automatisés couvrent aussi les objets magiques, les niveaux de puissance, le renouvellement, l’absence de cumul, la borne basse et la conservation de l’usure.

## Réserves temporaires et repos

Le repos nocturne retire un seul point de divinité temporaire par clic, sans descendre sous zéro, pour toutes les religions sauf l’Ancienne Tradition (`ealdTradition`). Celle-ci conserve ses points temporaires ; la fin des serments reste gérée par le MJ. La réserve ordinaire de Thuuldom conserve son fonctionnement sans renouvellement nocturne. Le message de repos annonce uniquement les points effectivement perdus. Référence : Livre des règles, Offrande de sang ; Player’s Handbook, Blood Gifting (exemple de Hrimhrappe), avec l’exception de l’Ancienne Tradition explicitement fixée pour le jeu.
