# Qualifications des dégâts

## Principes et règles consultées

Origine, nature magique, mode d’attaque, type physique/élémentaire, matériau et protections applicables sont indépendants. `usage: "magic"` sert à lancer le jet sans Force ; ce n’est pas une preuve de dégâts magiques. La qualification est confirmable au jet, puis figée dans le message du chat pour l’appliquer séparément à chaque cible.

Références consultées : Livre des règles, pages PDF 108 (partie principale de l’arme et matériau), 167–170 (Ébullition et Maîtrise des flammes), 225 (protections de vent), 260 (Armure bénie / Cuirasse des gardiens du Rortan) ; descriptions françaises des flèches de Morgu et d’Ogon ; Bestiaire de Jorge, page PDF 63 (sálhele). Comparaison anglaise : Player’s Handbook, Dragon Skin, page PDF 216 (feu normal / magique).

La qualification magique n’est attribuée automatiquement ni aux dégâts des sorts, ni aux armes simplement bonifiées par un effet. Les projectiles de Morgu et d’Ogon sont explicitement magiques et gardent les protections normales. Jet de pierre et Rafale de vent infligent des impacts physiques ; Ébullition produit de la chaleur physique. Pour les dégâts thermiques sans qualification magique explicite, le défaut est normal, modifiable au jet. Le fait qu’une chaleur ignore une armure ordinaire est une propriété distincte de sa nature magique.

Éruption et Mer de flammes acceptent seulement les protections magiques ; Ténèbres de Dimhall accepte aussi le grindsilver. Une armure possède un matériau et un indicateur de protection magique. Une bénédiction dont la description donne un bonus réduit contre la magie utilise ce bonus, sans rendre automatiquement magique toute l’armure. Le bouton « sans armure » continue d’ignorer toutes les protections, y compris les barrières de pierre ; il ne supprime pas les véritables immunités aux types de dégâts.

**Cas conservé pour arbitrage : Ébullition.** La protection limitée dans le temps des armures non métalliques demande un suivi de l’exposition. Le dialogue rappelle cette règle ; il ne prétend pas automatiser ce suivi.

## Ordre de résolution

Les bonus propres à la cible et la longue portée sont calculés comme auparavant. Les barrières typées explicitement `beforeArmor` interviennent avant la protection. Les armures et leur usure sont ensuite traitées, puis les résistances du corps (`afterArmor`, défaut). Les facteurs correspondants se multiplient dans chaque étape, avec arrondi supérieur à la fin de l’étape. Les anciennes politiques d’extraits et multiplicateurs de transformation conservent leur ordre existant. Les PS temporaires sont consommés avant les PS ordinaires.

La méthode expose les résistances appliquées dans son résultat. La liste d’application du chat donne au survol des PS perdus le calcul par cible, les armures retenues et les facteurs utilisés.

## Déclarations pour les prochains effets

- Armes / pouvoirs : `system.damageQualification = {nature, delivery, type, protection}` ; `system.material` pour le matériau de la surface offensive d’une arme. Pour un pouvoir sans arme, le matériau peut appartenir à `damageQualification`.
- Effet sur un objet : changement de profil `system.transformation.damageQualification`, valeur JSON partielle, par exemple `{"nature":"magical"}`.
- Résistance sur un acteur : `system.transformation.damageDefenses`, liste JSON, par exemple `[{"type":"fire","nature":"magical","factor":0.5,"stage":"afterArmor"}]`. Les critères présents se combinent par ET. `factor: 0` donne une immunité ; `factor: 2` une vulnérabilité.
- VP spécialement efficace contre les dégâts réservés aux armures magiques : `system.transformation.magicalProtection`, valeur numérique. Ne pas déclarer une seconde fois la même défense dans les anciennes métadonnées de flags et dans les changements éditables.
- Les valeurs `protection` sont `normal`, `magical`, `magicalOrGrindsilver` et `none`.
- Les types existants sont représentés par des glyphes avec tooltip dans les sélecteurs et cartes. `@Damage[fire]` permet de placer le même glyphe dans toute description enrichie. Les formulations usuelles françaises/anglaises sont également enrichies sans réécrire les données.
- Les listes sont dans `modules/rules/damage-qualifications.mjs`. Le bronze est disponible en plus du bois, de l’acier et de la pierre. Les matériaux peuvent aussi être étendus via `CONFIG.TRUDVANG.weaponMaterials` ; ajouter leurs libellés dans les deux fichiers de langue.

Ce socle ne convertit pas implicitement toutes les capacités du bestiaire en résistances automatisées, et ne crée pas un second jet de feu sur une arme : ces définitions doivent être renseignées explicitement lors de la suite des effets. Un jet représente actuellement une composante de dégâts ; les composantes supplémentaires utilisent des jets distincts.

## Matériaux du catalogue

Choix initiaux modifiables : acier pour les lames, têtes, pointes de flèches et carreaux ; bois pour les surfaces en bois ; pierre pour les projectiles des frondes. Il s’agit du matériau offensif, pas du manche. Les renforts d’un modèle particulier peuvent justifier un autre choix.

| Arme / bouclier | Matériau offensif | Type principal proposé |
|---|---|---|
| Glaaf (épée courte) | Acier | Tranchant |
| Hring seax (couteau à anneau) | Acier | Tranchant |
| Klubb (massue) | Bois | Contondant |
| Krum swerd (cimeterre) | Acier | Tranchant |
| Lill spjót (lance courte) | Acier | Perforant |
| Nagli klubb (massue à pointes) | Acier | Perforant |
| Seax (dague/couteau) | Acier | Perforant |
| Split axi (hache à une main) | Acier | Tranchant |
| Stafur (bâton) | Bois | Contondant |
| Barda faldir (fléau de bataille) | Acier | Contondant |
| Barda hammri (marteau de bataille) | Acier | Contondant |
| Barda klót (chaîne de bataille) | Acier | Contondant |
| Barda makir (masse de bataille) | Acier | Contondant |
| Barda swerd (épée de bataille) | Acier | Tranchant |
| Bastjur kedjá (chaîne troll) | Acier | Contondant |
| Barda axi (hache de bataille) | Acier | Tranchant |
| Villtur axi (hache courbée) | Acier | Tranchant |
| Breid swerd (épée large) | Acier | Tranchant |
| Dropi axi (hache pendule) | Acier | Tranchant |
| Hakk (bec-de-corbeau) | Acier | Perforant |
| Miekka | Acier | Perforant |
| Staaf spjót (lance de chasse) | Acier | Perforant |
| Stakk swerd (épée d’armes) | Acier | Tranchant |
| Stjorn makir (étoile du matin) | Acier | Perforant |
| Breid spjót (lance à lame large) | Acier | Perforant |
| Spjót (lance longue) | Acier | Perforant |
| Tvei faldir (fléau à deux mains) | Acier | Contondant |
| Tvei hakk (pioche à deux mains) | Acier | Perforant |
| Tvei hammri (merlin) | Acier | Contondant |
| Tvei klubb (massue à deux mains) | Bois | Contondant |
| Tvei axi (hache à deux mains) | Acier | Tranchant |
| Tvei swerd (épée à deux mains) | Acier | Tranchant |
| Krossbogur (arbalète) | Acier | Perforant |
| Veidi bogi (arc de chasse) | Acier | Perforant |
| Lill spjót (lancer) | Acier | Perforant |
| Seax (lancer) | Acier | Perforant |
| Lang bogi (arc long) | Acier | Perforant |
| Miekka (lancer) | Acier | Perforant |
| Slingu (fronde) | Pierre | Contondant |
| Split axi (lancer) | Acier | Tranchant |
| Staaf spjót (lancer) | Acier | Perforant |
| Stafur slingu (fronde à manche) | Pierre | Contondant |
| Tunkur krossbogur (arbalète lourde) | Acier | Perforant |
| Tve bogi (arc composite) | Acier | Perforant |
| Volk krossbogur (arbalète légère) | Acier | Perforant |
| Grand bouclier renforcé de fourrure | Bois | Contondant |
| Grand bouclier renforcé de métal | Acier | Contondant |
| Grand bouclier en bois | Bois | Contondant |
| Bouclier moyen renforcé de fourrure | Bois | Contondant |
| Bouclier moyen renforcé de métal | Acier | Contondant |
| Bouclier moyen en bois | Bois | Contondant |
| Petit bouclier renforcé de fourrure | Bois | Contondant |
| Petit bouclier renforcé de métal | Acier | Contondant |
| Petit bouclier en bois | Bois | Contondant |

Les sélecteurs sont dans une section « Qualifications » repliée par défaut ; elle reste ouverte pendant les modifications d’une fiche. Les pictogrammes d’épée et de pointe de lance sont des masques CSS chargés depuis `assets/icons/`, pour fonctionner aussi dans le contenu filtré des dialogues.

## Icônes communes

| Qualification | Icône |
|---|---|
| Normal / magique | Aucune icône / `fa-wand-magic-sparkles` |
| Mêlée / distance / autre | `fa-hand-fist` / `fa-bullseye` / `fa-ellipsis` |
| Tranchant / perforant / contondant | Épée vectorielle / pointe de lance avec hampe vectorielle / `fa-hammer` |
| Feu / froid / foudre | `fa-fire` / `fa-snowflake` / `fa-bolt` |
| Acide / poison | `fa-vial` / `fa-skull-crossbones` |
| Bois / acier / bronze / pierre | `fa-tree` / `fa-link` / `fa-ring` / `fa-mountain` |
| Protection normale / magique / magique ou grindsilver / aucune | `fa-shield-halved` / `fa-shield` / `fa-gem` / `fa-ban` |

Les couleurs viennent du texte du thème ; aucune couleur supplémentaire n’est introduite.

## Vérification représentative dans Foundry

1. Ouvrir un arc, une fronde et une hache : vérifier acier/perforant, pierre/contondant et acier/tranchant. Lancer la hache et vérifier que seule la livraison passe à distance. Les modifications au jet ne doivent pas modifier l’objet.
2. Lancer Jet de pierre puis Flèche de bataille : leurs icônes de nature doivent différer ; une armure normale protège contre les deux.
3. Lancer Éruption de flammes sur une cible portant une protection ordinaire, puis une armure dont la protection magique est cochée. Seule la seconde protège. Le bouton sans armure doit les ignorer toutes les deux.
4. Survoler les glyphes et le résultat d’application pour voir leurs libellés et le calcul.

Ces contrôles peuvent être faits dans un monde de test ; les vérifications automatisées du dépôt ne touchent pas l’installation Foundry.
