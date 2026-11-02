# Inventaire de travail : effets lumineux persistants

Ce document prépare l'extension des effets lumineux ; il ne modifie pas les règles ni le système. Il reprend le Livre des règles français et le Bestiaire de Jorge, recoupés avec les livres anglais et le catalogue `lang/fr.json`. Voir aussi `docs/aura-light-audit.md` pour les zones et les conséquences autres que la lumière. Les miroirs `game doc/markdown-fr/` et `game doc/markdown/` sont les références de recherche ; ne pas les modifier.

Le dépôt possède déjà une automatisation partielle des auras lumineuses dans `modules/aura.mjs` et `modules/transformation-data.mjs`, notamment pour Lumière rassurante et Radiance sacrée. Cet inventaire ne présume pas que les autres lignes soient implémentées : vérifier l'état du code avant de créer ou remplacer quoi que ce soit.

## Convention pour l'agent

- « Persistant » signifie ici que la lumière peut rester visible pendant une durée, même courte ; le pouvoir n'a pas besoin d'être de type permanent. Les projectiles, éclairs et souffles instantanés sont exclus.
- `Vive` et `faible` ci-dessous sont des **rayons en mètres depuis l'origine**, pas deux distances à additionner. `0 / 1` signifie aucune lumière vive et de la lumière faible jusqu'à 1 m.
- `Livre` signifie que le rayon de la zone lumineuse est explicitement indiqué. `Proposition` est une estimation de travail, **non une règle officielle ni une préférence validée par le MJ**. Conserver ces valeurs paramétrables et documentées ; ne pas les présenter comme issues du livre.
- Une durée de guérison ou d'effet mécanique ne prouve pas que la lueur de l'invocation persiste autant : les cas concernés sont marqués `durée visuelle à confirmer` et ne doivent pas automatiquement éclairer pendant des jours.
- L'origine est l'objet ou la position décrite ; ne pas automatiquement rattacher tout effet au lanceur. Une source fixe reste à son point d'origine après le déplacement du lanceur. Une source portée suit le porteur uniquement tant qu'il porte l'objet. Ne pas déduire que le pouvoir déplace ou crée un objet.
- L'intensité à l'intérieur d'une zone « lumière du jour » est classée vive sur tout son rayon, sans halo faible ajouté : interprétation technique pour représenter la règle, et non découpage explicite du livre.

## Lumière du jour et flamme d'éclairage

| Effet et identifiant `TRUDVANG.Content.Power` | Origine et déplacement | Vive / faible (m) | Provenance et conditions |
|---|---|---|---|
| Lueur de l'aube `holy-tenetnid-tablet-of-the-sun:dawn-shine:0` | Prêtre ; suit ses déplacements. | 1 / 1 | **Livre**, p. 262. 1 minute ; niveaux de puissance : +1 m de rayon. Lumière du jour. |
| Lumière rassurante `holy-tenetnid-tablet-of-the-sun:thermal-light:3` | Prêtre ; suit ses déplacements. | 2 / 2 | **Livre**, p. 262. 1 minute ; les améliorations peuvent accroître le rayon. Lumière du jour. |
| Radiance sacrée `holy-tenetnid-tablet-of-the-sun:holy-radiance:7` | Prêtre ; suit ses déplacements. | 3 / 3 | **Livre**, p. 264. 1 heure ; les améliorations peuvent accroître le rayon. Lumière du jour. |
| Flammèche `vitner-flame-craft:spark:1` | Main de l'enchanteur ; une amélioration permet de la déposer sur un objet ou à un endroit choisi. Si attachée à un objet mobile, suit cet objet. | Bougie : 1 / 3 ; torche améliorée : 3 / 6 | **Proposition** pour les distances ; le livre, p. 167, indique seulement l'intensité d'une grosse bougie, ou d'une torche avec amélioration. 1 minute à la base. Un objet pouvant brûler normalement ne s'enflamme pas quand il sert de support à la flamme détachée. |
| Été elfique `holy-ealdtradition-magh-s-gift:elf-summer:3` | Zone météorologique au lieu affecté ; point fixe proposé, à vérifier avant automatisation. | 3 / 3 | **Livre** pour le rayon initial de la zone et l'apparition du soleil ; **proposition** pour assimiler la zone à une lumière vive et pour l'ancrage fixe. 1 heure ; rayon améliorable. |

Les trois lignes suivantes représentent une **zone de soleil et de météo à grande échelle**, pas nécessairement une source ponctuelle locale : obstacles, intérieur/extérieur et état du ciel demandent une modélisation adaptée. Ne pas créer sans discernement une lumière kilométrique traversant les murs. Le `rayon` indiqué est celui de la zone du pouvoir ; son rendu en lumière vive est une proposition.

| Effet et identifiant | Origine et déplacement | Rayon de zone (m) | Conditions |
|---|---|---|---|
| Rayons du soleil `holy-gerbanis-warmth-of-sunvei:sunray:1` ; `holy-joaringfaith-power-of-sille:sunray:1` | Point du lancement ; zone **fixe**, ne suit pas le prêtre. | VC de Foi | **Livre**, p. 216–217 ; extérieur et de jour ; 1 heure. La zone est fixée à l'activation. |
| Cœur de l'été `holy-gerbanis-warmth-of-sunvei:summer-place:3` ; `holy-joaringfaith-power-of-sille:summer-place:2` | Zone affectée ; point fixe proposé, à vérifier. | VC de Foi × 100 | **Livre**, p. 217 ; lancement en extérieur et de jour ; 3 heures. Si la durée se prolonge après le crépuscule, une chaude soirée d'été persiste ; ne pas supposer sans vérification que cela reste de la pleine lumière du jour. |
| Heure de la chasse `holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6` ; `holy-joaringfaith-power-of-sille:time-of-the-hunt:6` | Zone affectée ; point fixe proposé, à vérifier. | 10 000 | **Livre**, p. 217 ; extérieur et jour ; 1 jour ; augmentation de portée possible. La durée d'un jour ne prouve pas que l'éclairage persiste la nuit. |

## Lueurs d'équipement et d'objets

Les six pouvoirs de la Tablette du chevalier disent que l'équipement béni **luit faiblement** (Livre des règles, p. 259–261). Ils ne donnent pas de rayon. Pour chacun : **proposition 0 m vive / 1 m faible**, lumière neutre/blanche discrète. L'effet suit l'**équipement béni**, éventuellement porté par une cible autre que le prêtre ; il ne doit pas être attaché automatiquement au lanceur. Si l'équipement est retiré ou transféré, sa lueur le suit, sous réserve de la représentation des objets au sol.

| Effet | Identifiant | Support | Durée de base |
|---|---|---|---|
| Armure bénie | `holy-tenetnid-tablet-of-the-knight:blessed-armor:0` | Armure existante choisie | 3 tours |
| Cuirasse des gardiens du Rortan | `holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3` | Armure existante choisie | 4 tours |
| Armure blanche de Belo Seoth | `holy-tenetnid-tablet-of-the-knight:belo-seoth-s-white-armor:6` | Armure existante choisie | 5 tours |
| Lance bénie | `holy-tenetnid-tablet-of-the-knight:blessed-spear:1` | Arme choisie | 3 tours |
| Chaîne de bataille des gardiens du Rortan | `holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5` | Arme choisie | 4 tours |
| Hache de Belo Seoth | `holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7` | Arme choisie | 5 tours |

| Effet et identifiant | Origine | Vive / faible (m) | Conditions |
|---|---|---|---|
| Rune de guérison `holy-thuuldom-healing-rune:healing-rune:0` | Objet runique sacré placé sur la blessure ; suit l'objet. | 0 / 1 | **Proposition** ; livre p. 287 : l'objet luit pendant la guérison. Le pouvoir indique 2 tours ; vérifier si la lueur dure toute cette période avant automatisation. |
| Impuissance des démons `holy-tenetnid-tablet-of-the-shield:demonic-impotence:5` | Mains du prêtre ; suit le prêtre. | 0 / 1 | **Proposition** ; livre p. 258 : les mains luisent. Vérifier la durée précise de la lueur : le texte mentionne une faculté de toucher pendant les 10 tours suivants, alors que le catalogue donne une durée générale d'une heure. Ne pas assimiler ces durées sans vérification. |
| Main brûlante `vitner-flame-craft:burning-hand:2` | Main de l'enchanteur ; suit le lanceur. | 0 / 1 | **Proposition** ; livre p. 167 : la main se met à luire. 4 tours de base. Les objets enflammés deviennent des sources de feu distinctes. |

## Flammes et créatures à durée visible

Les valeurs suivantes sont des **propositions**, le rayon d'éclairage n'étant pas chiffré dans les descriptions. Une lumière émise par du feu est une déduction physique ; elle n'est pas expressément quantifiée par les règles.

| Effet ou capacité | Identifiant | Origine | Vive / faible (m) | Condition |
|---|---|---|---|---|
| Dompteur du feu | `holy-toikalokke-master-of-elements:fire-tamer:4` | Volume de feu créé au lieu choisi, jusqu'à 1 m³ par tour ; fixe sauf déplacement du feu. | 3 / 6 | **Proposition** assimilant 1 m³ de feu à une torche ; ajuster selon la taille réelle. Ne pas lier au prêtre après création. Le feu et son combustible déterminent la persistance. |
| Éruption de flammes | `vitner-flame-craft:flame-burst:3` | Cylindre au lieu ciblé. | 3 / 6 | **Proposition**, uniquement si un niveau prolonge les flammes au-delà de l'éruption instantanée. Si le sort est déplacé, déplacer la source avec le cylindre. |
| Mer de flammes | `vitner-flame-craft:sea-of-fire:7` | Zone circulaire au lieu ciblé. | 5 / 10 | **Proposition**, uniquement si prolongée. Zone de feu initiale de 2 m de rayon, distincte des rayons d'éclairage proposés. |
| Corps de feu (démon tangible) | `TRUDVANG.Content.CreatureAbility.9MMfvcE9EaGbHcId` | Corps du démon ; suit le token. | 3 / 6 | **Proposition** conditionnée à la présence effective du corps en feu. |
| Corps de feu (loge) | `TRUDVANG.Content.CreatureAbility.n85BQGaGbHcIdJeK` | Corps du loge ; suit le token. | 3 / 6 | **Proposition** ; créature constituée de feu. |
| Yeux de lune | `TRUDVANG.Content.CreatureAbility.LTLHNqSnToUpVqWr` | Yeux du logrjotun ; suit le token. | 0 / 3 | **Proposition** ; lumière semblable à la pleine lune, visible la nuit. La distance à laquelle on voit ses yeux n'est pas la distance éclairée. |
| Fée | Description de la créature dans le Bestiaire, p. 72 ; vérifier l'identifiant d'acteur | Corps de la fée ; suit le token. | 0 / 1 | **Proposition** ; lueur de luciole pendant la nuit. Le livre ne donne pas de rayon. |
| Revenant des tumulus | Description de la créature dans le Bestiaire, p. 58 ; vérifier l'identifiant d'acteur | Orbites ; suit le token. | 0 / 1 | **Proposition** ; lueur blanche après le coucher du soleil, pouvant être dissimulée sous une capuche. |
| Intolérant à la lumière du soleil (braskelwurm) | `TRUDVANG.Content.CreatureAbility.Da0VLPjPkQlRmSnT` | Corps et écailles du braskelwurm ; suit le token. | 3 / 6 | **Proposition**, seulement lorsque l'exposition au soleil a effectivement enflammé les écailles ; pas une émission permanente par défaut. |

## Durée visuelle incertaine : ne pas automatiser comme lumière durable

Les effets suivants contiennent une lueur, mais le texte ne dit pas clairement qu'elle persiste pendant toute la durée des conséquences mécaniques. Une représentation brève pendant l'invocation est possible ; demander une décision de durée avant d'attacher une lumière durable.

| Effet | Identifiant ou famille | Origine décrite | Estimation si durée validée |
|---|---|---|---|
| Guérison | `holy-gerbanis-warmth-of-sunvei:healing:0` ; `holy-joaringfaith-power-of-sille:healing:0` | Paumes du soigneur sur les membres blessés. | 0 m vive / 1 m faible. La durée de guérison de 1 jour ne démontre pas une lueur de 1 jour. |
| Chaleur guérisseuse | `holy-gerbanis-warmth-of-sunvei:healing-warmth:5` ; `holy-joaringfaith-power-of-sille:healing-warmth:4` | Mains du soigneur sur la cible. | 0 / 1 m ; la durée mécanique de 2 jours n'établit pas la durée visuelle. |
| Souffle de Solvei / de Sille | `holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7` ; `holy-joaringfaith-power-of-sille:breath-of-sille:7` | Mains du soigneur sur la cible. | 0 / 1 m ; la durée mécanique de 3 jours n'établit pas la durée visuelle. |
| Main de Gave ; Volonté de Bete Wiemdas | `holy-tenetnid-tablet-of-grace:hand-of-gave:7` ; `holy-tenetnid-tablet-of-grace:will-of-bete-wiemdas:2` | Mains du prêtre sur la cible. | 0 / 1 m ; durée visuelle non définie. |

## Cas exclus ou à ne pas transformer en lumière générale

- **Souffles de feu, Flèche élémentaire, Éclair sacré, Explosion sacrée, Purification divine et Bannissement** : manifestations instantanées ou projectiles ; pas de source durable automatique. Les objets ensuite incendiés sont un cas distinct.
- **Lumière guérisseuse, Pouvoir de Firon et Soleil guérisseur** (Solvei et Sille), ainsi qu'**Esprit d'acier, Protection contre le vitner et Âtre de Windinna** : pouvoirs instantanés avec feu ou lueur ; aucune lumière durable automatique sur la base de la description.
- **Pistage** (Pouvoir de vision et Lekaba) et **Traces** : lueur visible uniquement par le bénéficiaire désigné. Ne jamais créer de source éclairant la scène pour tous.
- **Sol protecteur, Foyer béni et Bosquet sacré** : les descriptions font référence à une zone bénéficiant de la lumière du soleil ; elles ne démontrent pas la création d'une source autonome. Vérifier avec le MJ avant toute automatisation.
- **Aura de puissance** : « rayonne » de puissance au sens figuré ; aucune émission lumineuse explicitée.
- **Contrôle du feu** et **Contrôle des flammes** : déplacent ou modifient un feu existant ; maintenir sa source existante, sans en créer une seconde. Les objets réellement incendiés peuvent éclairer indépendamment.
- Yeux simplement décrits comme luisants, notamment ceux du diser et du braskelwurm : visibilité de l'apparence, mais émission d'éclairage non établie.

## Points à confirmer avant développement

1. Les rayons non officiels et leur découpage vive/faible sont des estimations modifiables, pas des choix déjà approuvés par le MJ.
2. Confirmer la durée visuelle des effets de soins et d'Impuissance des démons ; ne pas appliquer automatiquement la durée mécanique à une lueur décrite pendant la seule invocation.
3. Vérifier l'ancrage exact d'Été elfique, de Cœur de l'été et d'Heure de la chasse dans les sources avant de créer une région fixe. Gérer les contraintes extérieures et diurnes sans transformer une zone de météo en lampe traversant tous les murs.
4. L'aperçu ci-dessus couvre les effets repérés dans le Livre des règles, le Bestiaire et le catalogue du système ; réexaminer les descriptions et niveaux de puissance originaux, ainsi que les autres ouvrages effectivement pris en charge, avant de prétendre à l'exhaustivité.
5. Vérifier comment représenter une source portée par un objet transféré ou déposé, une zone fixe, une cible de sort et les scènes avec plusieurs tokens ; ne pas modifier les installations ou l'interface Foundry de l'utilisateur sans son autorisation préalable.
