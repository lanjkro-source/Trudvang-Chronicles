# Audit des zones et lumières des effets magiques

Les termes et les numéros de page ci-dessous proviennent du Livre des règles français ; vérifier les descriptions et niveaux de puissance des deux sources avant toute automatisation. L'inventaire recoupe les descriptions des pouvoirs disposant déjà d'une définition d'effet ; une portée de sélection ou un effet personnel n'est pas automatiquement une aura.

## Auras prises en charge

Lumière rassurante et Radiance sacrée suivent le lanceur, appliquent leurs effets à l'entrée et les retirent à la sortie. Brise du voyage fait de même pour son rappel de protection météorologique : la météo et les tests d'environnement ne sont pas modifiés automatiquement. Les murs bloquant la lumière limitent ces régions. Les seuls éclairages automatiques sont ceux des auras lumineuses. Les copies appliquées avant cette automatisation ne sont pas transformées en auras.

## À faire pour terminer les effets de zone

| Pouvoir | Géométrie et durée | Comportement à respecter |
| --- | --- | --- |
| Lumière rassurante (p. 262) | Rayon initial de 2 m, centré sur le prêtre et mobile ; +1 m par niveau prévu | Lumière du jour ; tous ignorent les malus de peur, seuls le prêtre et les tokens amicaux gagnent le bonus. |
| Radiance sacrée (p. 264) | Rayon initial de 3 m, centré sur le prêtre et mobile ; +1 m par niveau prévu | Même distinction entre tous les occupants et les alliés ; bonus différent. |
| Rayons du soleil (p. 216) | Rayon fondé sur la VC de Foi ; zone fixée au lancement | Extérieur et jour seulement ; ne suit pas le lanceur. |
| Cœur de l’été (p. 217) | Zone fondée sur la VC ; bien distinguer la zone ensoleillée et les terrains de chasse | Les conséquences sur le climat et la chasse sont conditionnelles. |
| Heure de la chasse (p. 217) | Portée kilométrique, accrue par les niveaux | Conditions extérieures et diurnes ; bonus conditionnels de chasse et pêche. |
| Été elfique (p. 233) | Rayon initial 3 m, augmenté par les niveaux | Température limitée à 30 °C et effets météorologiques selon les règles. |
| Brise du voyage (p. 232) | Rayon initial 3 m, augmenté par les niveaux | Protection contre la pluie, le brouillard et le vent, sans changer la température. |
| Refuge et Protection contre les éléments (p. 258) | Zones fixées au lieu de la prière | Conditions et sources météorologiques couvertes différentes selon le pouvoir. |
| Brouillard et Purification de l’air (p. 170) | Zones de portées et formes propres aux sorts | Le brouillard influence la visibilité et peut imposer des malus ; l’air purifié a d’autres conditions. |
| Flammèche (p. 167) | Flamme portée pouvant être laissée sur un objet si l’amélioration correspondante est choisie | Intensité de base comparable à une grosse bougie ; une amélioration permet l’intensité d’une torche. |

Autres zones déjà dotées d'un effet descriptif à traiter : Mur de vitner, Bourbier,
Contrôle des précipitations, Chaleur, Paysage illusoire (zone fixe avec visibilité
différente selon l'observateur), Mur du crépuscule, Rideau de la nuit, Manteau de
Jorn et Mur d'épines. Vérifier la géométrie, l'ancrage et les obstacles propres à
chacun ; ne pas les convertir en auras mobiles. Purification de l'air présente
deux modes distincts, zone autour de l'enchanteur ou filtre individuel sur une
cible : prévoir ce choix avant de l'automatiser. Mélodie du cavalier, Chant du
héros et Hymne royal demandent une zone avec alliés qui écoutent, soins répétés et
plafond quotidien par personne. Aura de puissance et Aura de Gave demandent des
conditions de perception, des tests et une gestion des résistances, plutôt qu'une
application inconditionnelle en entrant dans un cercle.

Lueur de l'aube produit désormais une lumière mobile de rayon connu, sans appliquer
de bonus ni de suppression de peur aux occupants. La réduction volontaire de sa
portée pendant l'invocation reste à gérer manuellement. Les autres sources lumineuses non assimilables à une aura sont recensées dans
`inventaire-effets-lumineux.md` et seront traitées séparément.

## Capacités du bestiaire à portée ou à zone

Les capacités suivantes sont présentes dans le catalogue des créatures, mais leurs
zones et conséquences ne sont pas automatisées par le mécanisme d'aura :

- **Puanteur terrifiante** (bête épineuse, p. 18) : peur à moins de 5 m, avec
  exception pour les personnes habituées. L'odeur est perceptible jusqu'à 50 m.
- **Puanteur du bein** (beinbaiter, p. 36) : exposition à moins de 5 m, durée
  persistante dépendant du temps d'exposition ; la victime devient à son tour
  une source de puanteur jusqu'à 10 m.
- **Vecteur de maladies** (troll malade, p. 151) : test à moins de 2 m, immunité
  d'un mois en cas de réussite et table de conséquences persistantes en cas d'échec.
- **Surchauffe** (logewurm, p. 124) : activation et durée limitées, dégâts
  répétés avec deux zones de 10 et 20 m et jets ouverts différents.
- **Puanteur envoûtante**, **Hurlement**, **Hurlement funeste** et **Hurlement
  sauvage** : dépendent notamment de l'odorat ou de l'ouïe, de résistances et,
  selon le cas, d'une activation ou d'effets persistants. Ne pas les assimiler
  sans vérification à un simple bonus retiré à la sortie d'un cercle.

Les effets descriptifs de **Silence**, **Marche sur l'eau**, **Mur de terre**,
**Contrôle des vents** de Toikalokke et **Dompteur du feu** doivent aussi recevoir
leur traitement de zone adapté : origine, mobilité, forme, obstacles, son ou
surface selon le pouvoir. Leur simple effet sur une fiche ne crée aucune région.

Les facteurs de peur des créatures disposent déjà de leur jet et de son application
manuelle, mais ne créent pas une aura automatique générale.

Cri de guerre et Tonnerre victorieux distinguent alliés et ennemis à portée lors de l’application ; leur texte ne dit pas que l’effet s’interrompt dès qu’une cible quitte une aura. Ne pas leur appliquer automatiquement une région mobile sans vérifier cette règle.

Œil d’Enken (p. 226) et Regard de l’âme (p. 225) sont des capacités de perception, pas des auras appliquant un effet aux personnages détectés. La distinction entre détection de tokens et révélation du décor à travers les murs reste à traiter avec le MJ.

**Façonnage de l’eau** (Livre des règles p. 164 ; Player’s Handbook p. 136) : la masse d’eau façonnée reste une zone fixe à représenter manuellement ; les trois minutes de façonnage et les cinq minutes de maintien constituent huit minutes au total, prolongées par les améliorations de durée. Ce n’est pas une aura mobile.
