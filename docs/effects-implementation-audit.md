# État de l’implémentation des effets — 23 octobre 2026

Les JSON français de `game doc/fr/` font autorité. Les équivalents anglais, les
catalogues, les fichiers de référence des effets et les compendiums sont dérivés
de ces données. Cet audit concerne les effets actuellement recensés ; il ne
signifie pas que chaque sort du jeu dispose déjà d’un effet automatique.

## Modifications de profil prises en charge

Le catalogue contient 115 variantes d’effets, provenant de 76 sources (61 pouvoirs
ou sortilèges, et 15 capacités). Les pouvoirs définissent 134 paramètres
d’amélioration : PS, protection, dégâts, portées sensorielles,
degrés ou valeurs de traits, VC d’attaque, facteur de peur et paliers d’attaque.
Poings d’acier possède en complément son sélecteur de niveau de rune.

Les tests vérifient les modifications effectivement créées, avec des comptes
d’améliorations transmis par le lancement et avec une référence de compendium.
Les plafonds restent contrôlés au lancement ; les valeurs saisies manuellement
dans la fenêtre d’application ne reçoivent pas de nouveau plafond.

Corrections de cette étape :

- Ravage et Attaque du huvfurwurm : une/deux actions et une réserve de 5/10 PC
  commune aux actions supplémentaires ; caractéristiques de l’arme conservées,
  actions ordinaires à utiliser en premier, dépense et renouvellement par tour.
  L’arme se choisit à l’application. La copie accordée ne retransfère pas les
  effets d’équipement de l’arme d’origine et n’occupe pas les mains ordinaires.
- Force du jotun et Cœur d’Enken : variante pour les alliés, avec trait +4,
  améliorable à +6, distincte du bénéficiaire principal à +8.
- Âme du dragon : bonus initial global conservé ; amélioration de dégâts limitée
  au corps à corps, aux armes de jet et aux attaques naturelles.
- Améliorations de protection : fusion avec la modification additive existante.

Sources : Livre des règles, p. 219, 225, 277 et 279 ; Player’s Handbook,
sections Jotun Strength, Heart of Enken, Rampage/Attack of the Huvfurwurm.

## Améliorations et savoirs appliqués aux jets

Les améliorations numériques de SV sont désormais définies dans les JSON FR,
validées contre les métadonnées EN et appliquées à 87 tests configurés. Cela
comprend les réductions de résistance de Hâte, Vigueur, Transformation,
pétrifications, Regard paralysant, et les augmentations des tests d’écoute, de
soin ou du Refuge arboricole.

Chaque lancement enregistre ses propres choix et le niveau du savoir du lanceur
dans le message. Les références d’effets glissées depuis ce message transmettent
ce contexte ; les effets appliqués le conservent pour les liens de leur description.
Une utilisation ultérieure du même sort ne modifie pas le contexte du premier
lancement. Sans contexte, le code ne devine pas les niveaux achetés à partir d’un
ancien message ou du dernier lancement connu.

Puissance applique le malus du lanceur et le bonus du personnage résistant pour
les résistances aux sorts. Transcendance applique le malus du lanceur aux
résistances aux pouvoirs divins. Ces savoirs ne modifient pas les jets d’écoute,
de soins ou de concentration du lanceur. L’applicabilité et les indices des
améliorations sont explicites dans les données, jamais déduits du texte à l’exécution.
Sources : Livre des règles et Player’s Handbook, sections Puissance/Potency et
Transcendance/Potent.

Les fenêtres de lancement et d’application d’effet affichent séparément les
ajustements propres aux tests du pouvoir, sans changer la VC de lancement. La
fenêtre de résistance détaille améliorations, savoir du lanceur, Puissance de la
cible, traits, effets contributeurs et états. Le modificateur libre reste disponible.

Exceptions conservées : les améliorations d’Amnésie limitées au test initial ne
modifient pas la récupération quotidienne ; leur SV initiale minimale est respectée.
Les réductions de résistance au vent ne pénalisent pas le test du lanceur pour en
garder le contrôle. Les améliorations par déplacement dans une table (retour après
pétrification), les niveaux de rune et les paramètres non numériques ne sont pas
convertis en bonus fixes ; les contrôles existants et l’ajustement manuel subsistent.

Conjuration de corbeaux : le tableau FR p. 189 sépare la portée et le malus de
résistance. Cette séparation et leurs coûts ont été corrigés dans les sources.

## Paramètres de lancement et conséquences particulières

- Portée, nombre de bénéficiaires et poids affecté : les coûts sont gérés au
  lancement ; l’application reste un glisser-déposer par acteur, sans sélection
  ou mesure automatique des bénéficiaires.
- Transformation : le bestiaire détermine le profil et la taille de la forme.
  Les améliorations de taille autorisent le choix d’une forme plus grande ; elles
  ne doivent pas multiplier une seconde fois sa taille. La sélection n’est pas
  encore filtrée selon les améliorations achetées.
- Tête du huvfurwurm : survie et repousse décrites, sans interception automatique
  d’une attaque mortelle, consommation de la relique ou calcul du seuil amélioré.
- Cœur du lindwurm, régénération de tête et soins horaires du Refuge arboricole :
  événements, délais et consommation restent à déclencher manuellement.
- Ouïe du hibou et Sens du griffon restent des effets descriptifs. Membre de pierre
  indique le membre atteint, sans gestion anatomique de l’équipement ou des gestes.
- Les capacités narratives (communication, respiration, apparence, etc.) restent
  des indications avec icône/texte. Les visions activent le mode et la détection
  Foundry, avec leur portée maximale. Les autres sens sont affichés dans État.

L’inventaire détaillé des 14 rappels descriptifs et des six épuisements est dans
[`descriptive-effects.md`](descriptive-effects.md). Une copie d’effet déjà appliqué
ne réapplique plus ses améliorations ; sa durée et ses résultats aléatoires sont
conservés. Les formes transfèrent désormais tout leur profil sensoriel, au lieu
de ne reprendre que leurs capacités nommées Vision.

Les effets anglais sont associés à leur pouvoir par `catalogId`, puis par
identifiant de variante, et leurs modifications mécaniques sont comparées aux
sources FR. L’ancien rapprochement par position confondait notamment Rage et
Sang bouillant, Force d’âme et Vision nocturne, ainsi que Membre de pierre et
Sang du lindwurm. Les noms, sources et associations ont été corrigés dans les JSON
EN avant de régénérer les références et les compendiums.

Conformément aux décisions du MJ, la pétrification progressive et les transitions
de fin ne sont pas automatisées. Les effets de récupération et de séquelles
restent séparés et s’appliquent manuellement.

## Vérification et exemplaires existants

`npm run check` exécute les tests sans utiliser l’installation Foundry. Les
contrôles couvrent notamment les réserves du huvfurwurm, le blocage des actions,
les caractéristiques d’arme, les deux dépenses partageant 10 PC, la remise à zéro
au tour suivant, les variantes alliées et les améliorations numériques.

Les effets déjà copiés dans un monde sont préservés pour respecter les éditions
du MJ. Pour tester une nouvelle référence ou remplacer l’ancien Ravage, retirer
l’ancien effet et appliquer celui du compendium régénéré.
