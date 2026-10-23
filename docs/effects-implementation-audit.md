# État de l’implémentation des effets — 23 octobre 2026

Les JSON français de `game doc/fr/` font autorité. Les équivalents anglais, les
catalogues, les fichiers de référence des effets et les compendiums sont dérivés
de ces données. Cet audit concerne les effets actuellement recensés ; il ne
signifie pas que chaque sort du jeu dispose déjà d’un effet automatique.

## Modifications de profil prises en charge

Le catalogue contient 113 variantes d’effets, provenant de 74 sources (59 pouvoirs
ou sortilèges, et 15 capacités). Les pouvoirs définissent 128 paramètres
d’amélioration, dont 31 hors durée, sur 21 sources : PS, protection, dégâts,
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

## Améliorations encore à relier aux jets

Les boutons de résistance existent, mais les améliorations achetées au lancement
ne modifient pas encore automatiquement leur SV. Elles restent ajustables dans
la fenêtre du jet. Il faut transporter le contexte d’améliorations avec ces
boutons, le conserver sur l’effet appliqué et ajuster uniquement le test concerné.
Il ne faut pas appliquer un bonus général à tous les jets du bénéficiaire.

Cas identifiés dans les sources disposant déjà d’effets :

| Pouvoir ou sortilège | Modification restant à transmettre |
|---|---|
| Hâte, Vigueur | −1 à la SV de résistance initiale par amélioration |
| Transformation | −1 à la SV de résistance initiale par amélioration |
| Pétrification/Annuler une pétrification | −1 à la résistance initiale ; progression dans la table du retour à la forme d’origine |
| Statue, Monument en pierre, Membre de pierre, Pétrification | −1 à la résistance initiale par amélioration |
| Regard paralysant | −1 à la SV de l’adversaire par amélioration |
| Ouïe du hibou, Sens du griffon | +1 à la SV d’écoute par amélioration |
| Refuge arboricole | +1 à la SV du test quotidien par amélioration |

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
  des indications avec icône/texte. Les visions utilisent les modes Foundry.

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
