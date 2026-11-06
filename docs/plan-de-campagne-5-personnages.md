# Les Cinq de la Route

> Campagne Trudvang pour **exactement cinq personnages**, bâtie sur les **quatre
> scénarios de base** du corpus local : *Enlevée par les trolls*, *Frostbitten*,
> *Cœur sauvage* et *La Corne des elfes*.
>
> Les neuf scénarios suédois de `game doc/se/` ne sont plus la colonne vertébrale.
> Ils deviennent du **contenu secondaire** — interludes, détours, campagnes
> optionnelles — à traduire et à adapter pour remplir les transitions et suivre
> la progression.
>
> Document de préparation destiné au meneur de jeu. Il ne reproduit pas les
> scénarios : il en donne la structure, les prérequis, les PNJ, la difficulté,
> les récompenses et la manière de les enchaîner.

---

## 1. Ce que contient ce document

1. Le corpus et le statut de chaque source.
2. La composition du groupe de cinq, fonction par fonction.
3. L'architecture de la campagne en quatre arcs.
4. Une fiche détaillée par scénario de base.
5. Les neuf modules suédois comme contenu secondaire.
6. Le découpage séance par séance.
7. La progression en points d'aventure (PA) et les jalons.
8. Les règles d'adaptation à cinq joueurs.
9. Les PNJ récurrents.
10. Le matériel et la préparation.
11. Le journal de campagne.
12. Quatre annexes : tableau récapitulatif, lectures préalables, sources et
    crédits, pièges à éviter.

### 1.1 Ce qui change par rapport à la version précédente

| Version 1 | Version 2 |
|---|---|
| Les neuf scénarios suédois formaient la colonne vertébrale | Les quatre scénarios de base forment la colonne vertébrale |
| La tétralogie *Ödesprofetiorna* structurait la campagne | Quatre arcs indépendants, reliés par un cadre léger |
| *Carnags återkomst* servait de finale de substitution | *La Corne des elfes* est la finale |
| La progression était exprimée en « XP » | La progression est exprimée en PA, calibrée sur les scénarios |
| Les cinq fiches de PJ étaient liées à *Stenhjärta* et *Mardröm* | Les mêmes cinq PJ, avec des fonctions réassignées aux quatre arcs |
| Le titre « Les Cinq de la Prophétie » annonçait les runes | Le titre « Les Cinq de la Route » décrit la campagne réelle |

Le changement est volontaire : le corpus de base est plus court, plus lisible et
plus facile à mener. Les modules suédois restent excellents, mais ils ne doivent
pas dicter la structure ni le rythme. L'ancienne version reste consultable dans
l'historique Git du dépôt.

---

## 2. Corpus et statut des sources

### 2.1 Les quatre scénarios de base

| # | Scénario | Source | Pages | Format | Joueurs | Durée | Statut |
|---|---|---|---|---:|---|---|---|
| 1 | *Enlevée par les trolls* | *Livre des règles* FR, ch. 11 | 337–350 | Aventure d'introduction linéaire | 3–5 débutants | 2–4 h / 2 séances | Officiel, inclus dans un livre payant |
| 2 | *Frostbitten* | PDF anglais | 6–62 (impr.) | Aventure en trois actes | 2–6, idéalement 4–5 | 6–8 séances | Officiel, PDF anglais |
| 3 | *Cœur sauvage* | *Contes de Trudvang* FR, ch. 2 | 27–87 | Grande aventure forestière non linéaire | 4–6, relativement expérimentés | 8–12 séances | Officiel, inclus dans un livre payant |
| 4 | *La Corne des elfes* | *Contes de Trudvang* FR, ch. 3 | 89–143 | Aventure en trois actes | 3–5 aguerris | 6–10 séances | Officiel, inclus dans un livre payant |

**Repères de conversion.** Les PDF des *Contes de Trudvang* ont un décalage de
deux pages : page PDF = page livre + 2. *Cœur sauvage* occupe les pages PDF
29–89, *La Corne des elfes* les pages PDF 91–145. Pour *Frostbitten*, les pages
sont citées d'après la numérotation imprimée : acte I p. 11–30, acte II
p. 31–52, acte III p. 53–62 ; la page PDF correspondante est décalée de 1
(page PDF = page imprimée + 1).

### 2.2 Les doublons à ne pas compter deux fois

- ***Wildheart*** est la traduction anglaise de *Cœur sauvage*. Même sommaire,
  mêmes sites (Barkebull, l'arbre qui saigne, le braskelwurm). Ce n'est pas une
  cinquième aventure.
- ***The Elven Horn*** est la version originale anglaise de *La Corne des elfes*.
  Ce n'est pas une sixième aventure.
- ***Frostbitten*** n'a pas de version française dans le corpus local. Le plan
  donne les noms français entre parenthèses, mais le meneur peut conserver les
  noms anglais pour l'ambiance.

### 2.3 Les neuf scénarios suédois

Tous proviennent de **Medusa Games** / **Scenariobiblioteket**. Ce sont des
scénarios **de fan, gratuits**, écrits pour *Drakar och Demoner Trudvang*. Leur
licence porte la mention suédoise : « L'aventure peut être imprimée et copiée
pour un usage personnel. Aucune vente ni distribution supplémentaire ne peut
être faite sans l'accord des détenteurs du droit d'auteur. » Ils ne sont donc
**ni officiels ni payants**, et ne doivent pas être redistribués publiquement.

| # | Scénario (VO) | Titre de travail FR | Pages | Auteur | Année | Type |
|---|---|---|---:|---|---|---|
| 1 | *Stenhjärta* | *Cœur de pierre* | 108 | Jörgen Karlsson | 2007 | Module long, tome 1 |
| 2 | *Drakskugga* | *L'Ombre du dragon* | 109 | Jörgen Karlsson | 2008–2010 | Module long, tome 2 |
| 3 | *Mardröm* | *Cauchemar* | 161 | Jörgen Karlsson | 2011 | Module long, tome 3 |
| 4 | *Carnags återkomst* | *Le Retour de Carnag* | 47 | Jörgen Karlsson | 2007 | Module long, autonome |
| 5 | *Svartgom* | *Svartgom* | 24 | Jörgen Karlsson | 2008 | Interlude, suite de *Snowsaga* |
| 6 | *Vargtimmen* | *L'Heure du loup* | 15 | Franz Ung | 2006 | Interlude d'horreur hivernale |
| 7 | *Fågelskogens främlingar* | *Les Étrangers de la forêt aux oiseaux* | 32 | Franz Ung | 2006 | Interlude d'enquête rurale |
| 8 | *Skogshäxan* v2 | *La Sorcière des bois* | 8 | Jörgen Karlsson | v2.0 | Prologue ou interlude initiatique |
| 9 | *Spöket på Tingeltang* | *Le Fantôme de Tingeltang* | 6 | J.H.J. Karlsson | — | Interlude gothique léger |

### 2.4 Ce qui est officiel, gratuit ou payant

Pour éviter toute confusion en table :

- **Officiel, inclus dans un livre payant** : *Enlevée par les trolls* (Livre des
  règles FR), *Cœur sauvage* et *La Corne des elfes* (Contes de Trudvang FR).
- **Officiel, PDF anglais** : *Frostbitten*. Le fichier local ne reproduit pas
  les conditions de diffusion ; le plan ne le classe donc ni gratuit ni payant.
  Le meneur se réfère à la page de téléchargement d'origine et ne le redistribue
  pas.
- **Officiel et gratuit** (téléchargements Riotminds) : *The Elven Horn* (VO de
  *La Corne des elfes*), *Wurmtongue* (version 5E), *Tales from Trudvang*,
  *Hero Companion Beta*.
- **Officiel et payant** : *Curse of Runes*, *Runes of Memory*, *Snowsaga*,
  *The Elven Road*, *La Morsure du froid*, *Contes de Trudvang*.
- **Fan et gratuit** : les neuf scénarios ci-dessus, plus le corpus Medusa Games
  et Scenariobiblioteket.
- **À éviter** : les copies déposées sans autorisation sur Scribd, PDFCoffee,
  idoc.pub ou spawningpool. Elles ne sont pas des sources légitimes, peuvent être
  incomplètes et ne respectent pas les licences.

> **Note de conservation.** Les PDF restent dans le dépôt privé de documentation
> (`game doc`), jamais dans le dépôt public du système. Le meneur qui rejoue la
> campagne doit les récupérer à la source ou auprès de leur auteur.

### 2.5 Le cas *Snowsaga*

*Svartgom* est une **suite directe** de *Snowsaga*, campagne officielle payante.
Le plan ne suppose pas que la table possède *Snowsaga* : tout ce qu'il faut
savoir est résumé dans *Svartgom* (chute de la Reine des neiges, dispersion de
ses seigneurs de guerre, Galve Blåyxr devenu Svartgom). Si la table possède
*Snowsaga*, elle peut la jouer avant l'interlude ; sinon, *Svartgom* fonctionne
seul. Ne pas acheter *Snowsaga* uniquement pour comprendre l'interlude.

---

## 3. Le groupe : cinq personnages, cinq fonctions

### 3.1 Pourquoi ces cinq-là

Le groupe est construit pour répondre aux **exigences explicites** des quatre
scénarios de base, sans dépendre des modules suédois :

| Exigence du scénario | Personnage qui la couvre |
|---|---|
| *Enlevée par les trolls* : un combattant, un traqueur, un personnage de savoir et de social | Guerrier + Rôdeur + Barde/Colon |
| *Frostbitten* : un survivant/chasseur, un spécialiste du surnaturel, une bonne résistance au froid | Rôdeur + Arpenteur + Colon |
| *Cœur sauvage* : un rôdeur, un soigneur, un artisan, des compétences sociales | Rôdeur + Arpenteur + Colon + Barde |
| *La Corne des elfes* : survie, Marin, connaissances elfiques, pas de Tisseur de vitner | Rôdeur + Arpenteur + Barde + Guerrier |
| Interludes suédois : enquête, discrétion, sociabilité | Rôdeur + Barde |

Les cinq archétypes sont conservés **tels quels** : Nain Guerrier, Humain
Rôdeur, Humain Colon, Humain Barde, Elfe Arpenteur des brumes. Les fonctions de
campagne et les scènes signature sont réassignées aux quatre arcs ; les
compétences à sécuriser restent les mêmes.

### 3.2 Les cinq fiches

#### 1. Le Nain Guerrier — la mémoire de la pierre

- **Rôle** : mur de fer, lecteur de Futhark, mémoire des royaumes nains.
- **Compétences et spécialités à sécuriser** : Combat (Combat armé),
  Connaissances (Langage : Futhark ; Connaissances culturelles : nains),
  Nature (Géographie souterraine), Savoir-faire (Artisanat : Matériaux durs).
- **Fonction de campagne** : il tient la ligne dans le terrier des trolls, il lit
  les pierres levées et les cairns de Vildhjarta, il reconnaît les techniques des
  nains de Runvid, il guide le groupe dans les mines de Leafelli. C'est aussi
  lui qui comprend les serments de pierre et les tombes anciennes.
- **Scènes signature** : les trois entrées du terrier de Kullerklang ; le cairn
  de Runvid ; le tombeau de Bodvar Bjorki ; les ponts de Leafelli.
- **Note** : dans *Frostbitten*, il ne lit pas nécessairement la langue des
  tombeaux, mais il reconnaît les malédictions de pierre et les pièges de
  construction. Le meneur peut lui accorder un bonus de circonstance.

#### 2. L'Humain Rôdeur — l'œil et la main

- **Rôle** : éclaireur, piste, discrétion, crochetage, connaissances du milieu.
- **Compétences et spécialités à sécuriser** : Arts des ombres (Discrétion,
  Larcin), Natation ou Escalade, Nature (Géographie : Orientation et
  cartographie ; Expérience de la chasse : Pister), Connaissances
  (Connaissances culturelles : Mittlander).
- **Variante** : remplacer par un **Malfrat** si la table veut un voleur pur.
  On perd le pistage, on gagne Larcin et les Signes de voleur.
- **Fonction de campagne** : il suit la piste de Sola, il ouvre la route dans
  Vildhjarta, il repère les récifs et les passages de la mer d'Althis, il trouve
  les entrées cachées des mines. Sans lui, les quatre arcs deviennent des jeux de piste
  beaucoup plus lents.
- **Scènes signature** : la piste de Sola ; la première nuit dans Vildhjarta ;
  la traversée de la mer d'Althis ; les passages secrets de Leafelli.

#### 3. L'Humain Colon — la main qui soigne

- **Rôle** : botaniste, médecin, cuisinier, homme de terrain.
- **Compétences et spécialités à sécuriser** : Nature (Connaissance de la
  nature : Botanique ; Survie), Savoir-faire (Soins et remèdes ; Artisanat :
  Extraits et potions, Cuisinier).
- **Fonction de campagne** : il soigne les morsures de troll, il ralentit la
  malédiction de givre, il reconnaît les plantes de Vildhjarta, il identifie le
  torrent empoisonné de Leafelli. C'est aussi le personnage qui peut dire
  « non, on ne mange pas ça ».
- **Scènes signature** : les engelures de *Frostbitten* ; les herbes de
  Vildhjarta ; le torrent noir de Leafelli ; le festin d'Ywol.
- **Note** : dans *Cœur sauvage*, le livre recommande explicitement un
  personnage avec un bon Savoir-faire ; le Colon est ce personnage.

#### 4. L'Humain Barde — la voix qui ouvre les mondes

- **Rôle** : musicien, conteur, diplomate de taverne, porteur de récits.
- **Compétences et spécialités à sécuriser** : Divertissement (Musique et
  danse : Chant et instruments de musique ; Narration : Calomnies),
  Connaissances (Langage ; Connaissances culturelles).
- **Fonction de campagne** : il négocie avec Remlaug, il désamorce les tensions
  à Vretekalt, il apprend les légendes de Vildhjarta, il comprend le récit de
  Vaeromar et le vrai mythe d'Ymradas. Il est le personnage qui transforme un
  malentendu en histoire.
- **Scènes signature** : le malentendu des trolls sur la « Princesse » ; le
  festin de Remlaug à Grymslante ; les énigmes de Vildhjarta ; la fête de Jorda
  à Ywol.
- **Note** : la contrainte de la **lergök** de *Mardröm* disparaît. Le Barde n'est
  plus irremplaçable par un objet ; il l'est par sa voix et sa mémoire.

#### 5. L'Elfe Arpenteur des brumes — la foi qui voit

- **Rôle** : soutien divin, érudit des religions, diplomate des peuples elfes.
- **Compétences et spécialités à sécuriser** : Foi (Invocation : Ihana ou
  Toikalokke ; Concentration religieuse), Connaissances (Langage : eika,
  commun ; Connaissances culturelles : elfes).
- **Note de règles** : le livre précise que les elfes n'ont pas d'arpenteurs des
  brumes « officiels », mais que certains naissent avec des dons divins. On
  assume donc un personnage exceptionnel, reconnu par sa tribu comme un
  intercesseur d'Ihana. C'est une bonne accroche de campagne.
- **Variante** : remplacer par un **Tisseur de vitner** elfe ou humain si la
  table préfère la magie profane. On perd les soins divins ; le Colon devient
  alors le seul soigneur, ce qui durcit *Frostbitten* et *La Corne des elfes*.
  Attention : *La Corne des elfes* conseille de ne pas avoir de Tisseur de
  vitner pour préserver le mystère autour de Vaeromar.
- **Fonction de campagne** : il comprend la peur des trolls, il analyse la
  malédiction de Bodvar, il reconnaît Kirjonti, il dialogue avec Vaeromar et
  pénètre la cité de Leafelli. C'est le pont entre les hommes et les elfes.
- **Scènes signature** : la bénédiction d'Oyvind ; la vraie légende d'Ymradas ;
  la mort de Kirjonti ; la Corne d'Ymenos.

### 3.3 Ce que le groupe ne couvre pas

- **Pas de spécialiste du commandement** : le Guerrier peut prendre *Diriger*,
  mais ce n'est pas obligatoire. Les quatre scénarios ne reposent pas sur des
  batailles rangées ; un PNJ officier peut relayer les ordres si nécessaire.
- **Pas de tireur d'élite dédié** : le Rôdeur couvre l'arc, mais il sera souvent
  au contact. Prévoir des munitions et un arc de secours pour le Colon.
- **Pas de soigneur de guerre** : l'Arpenteur soigne, mais lentement. Le Colon
  doit avoir des réserves de remèdes avant chaque arc.
- **Pas de locuteur troll** : le Barde peut apprendre quelques mots de gråtroll,
  ou négocier par gestes. Dans *Enlevée par les trolls*, le malentendu fait
  partie du sel de l'aventure.
- **Pas de forgeron** : le Guerrier peut réparer, mais pas forger une arme
  magique. *La Corne des elfes* ne demande pas de forge ; *Frostbitten* non plus.

### 3.4 Conseils de création

- **Points de départ** : créer les personnages avec la création standard, sans
  bonus gratuit. La campagne est longue ; les personnages vont progresser.
- **Liens croisés** : demander à chaque joueur un lien avec un autre PJ et un
  lien avec un lieu ou un PNJ de la campagne (Jukahäll, Grymslante, Jagersheim,
  Ywol). Ces liens seront la matière des transitions.
- **Langues** : le groupe doit parler au minimum le commun, le nain (Futhark
  écrit) et l'elfe (eika). Le Barde peut servir d'interprète, mais le nain doit
  lire les runes lui-même.
- **Compétence Marin** : au moins un personnage devrait avoir *Marin* ou
  *Navigation* avant *La Corne des elfes*. Le Rôdeur ou le Barde peuvent la
  prendre en cours de campagne.
- **Équipement** : prévoir dès le début une corde, des torches, un nécessaire de
  soins, un instrument de musique, un arc et des flèches. Avant *Frostbitten*,
  acheter des vêtements chauds, des raquettes et des vivres ; avant *La Corne
  des elfes*, prévoir des vêtements de mer et de la corde.
- **Sécurité émotionnelle** : poser les lignes et les voiles dès la session 0.
  Les quatre scénarios contiennent des enlèvements d'enfants ou de jeunes
  femmes, de la mort d'enfants, du body horror, des araignées géantes et un
  sacrifice. Voir § 9.4.

---

## 4. Architecture de la campagne

### 4.1 La route en une page

La campagne suit une **route circulaire** d'environ un an, du bout de l'été au
bout de l'été suivant. Chaque arc correspond à une saison et à une étape de la
route de **Grisebo**, le marchand stormlander qui emploie les cinq personnages.

| Arc | Scénario | Saison | Lieux principaux | Séances | PA recommandés | Fonction |
|---|---|---|---:|---:|---:|---|
| I | *Enlevée par les trolls* | Fin de l'été | Jukahäll, Vretekalt, forêt d'Ejdland | 2 | 25–30 | Apprendre les règles, souder le groupe, prêter le serment |
| II | *Frostbitten* | Hiver | Jagersheim, Morginhall, Holghold, Icepeak | 7–8 | 60–80 | Découvrir le Vildland, porter une malédiction, payer une dette |
| III | *Cœur sauvage* | Printemps | Grymslante, Vildhjarta | 8–10 | 140–180 | Tester l'autonomie, traverser une forêt vivante, recevoir la Pierre des Sagas |
| IV | *La Corne des elfes* | Fin de l'été | Ywol, mer d'Althis, Ymradas, Leafelli | 8–10 | 100–140 | Clore le cycle, sauver les filles, rendre la Corne, accepter le sacrifice |
| Épilogue | « Le cinquième serment » (original) | Automne | Grymslante, la route | 1 | 20–30 | Revenir, raconter, transmettre |

**Total du cœur** : 27 à 32 séances (session 0 et épilogue compris, *Cœur
sauvage* mené en 8–10 séances), environ 345 à 460 PA. Avec deux ou trois
interludes suédois, compter 29 à 39 séances et 400 à 610 PA.

### 4.2 Pourquoi cet ordre

1. **Enlevée par les trolls** est la seule vraie aventure d'introduction du
   corpus : simple, linéaire, 2–4 heures, jusqu'à 25 PA. Elle apprend les tests,
   le pistage, la négociation et le combat sans noyer les joueurs.
2. **Frostbitten** est explicitement prévue pour des personnages ayant déjà fait
   **une ou deux aventures** (p. 6), avec 4–5 joueurs idéalement. Elle introduit
   le froid, la survie, la malédiction et le surnaturel, et elle reste linéaire :
   c'est la bonne deuxième marche.
3. **Cœur sauvage** demande des personnages **relativement expérimentés** (p. 30)
   et un groupe de 4–6. C'est un bac à sable : il faut déjà savoir gérer les
   ressources, les rencontres et les énigmes. Il vient donc en troisième.
4. **La Corne des elfes** prévient que les héros **risquent fort de mourir**
   (p. 90) et demande des personnages aguerris. C'est la finale naturelle : elle
   est plus dure, plus mythique, et elle demande un groupe qui a déjà survécu à
   plusieurs arcs.

### 4.3 Le cadre : la route de Grisebo

Le cadre est **léger** et **optionnel**. Il ne remplace pas les scénarios ; il
justifie les voyages et donne un fil aux transitions.

**Grisebo** est un marchand stormlander, déjà présent en arrière-plan dans
*Cœur sauvage* : c'est lui qui emploie les personnages comme hirdmen et qui les
paie 10 pièces d'argent chacun à Grymslante. Le plan développe ce PNJ en
commanditaire récurrent.

- **Le contrat** : Grisebo engage les cinq comme hirdmen pour une route
  commerciale circulaire. Il ne les accompagne pas : il donne les ordres, paie,
  râle, et attend des comptes.
- **Les quatre étapes** : à chaque étape, les personnages doivent remettre un
  message ou régler une affaire pour Grisebo. L'affaire n'est jamais le cœur du
  scénario ; c'est le prétexte du voyage.
  1. **Jukahäll → Vretekalt** : livrer la charrette de Kraltjan Bite à Magne.
     Grisebo achète la cargaison ; les personnages sont sur place.
  2. **Grymslante → Jagersheim** : porter un contrat de dette à Hymir, l'aînée
     de Jagersheim. La malédiction de Bodvar interrompt l'affaire.
  3. **Grymslante → Garmvang** : escorter le convoi de draugvatten de Remlaug
     Torolv. C'est l'ouverture de *Cœur sauvage*.
  4. **Grymslante → Ywol** : porter une lettre de commerce à Arthyll Naom.
     La fête de Jorda et l'attaque des trolls lancent *La Corne des elfes*.
- **Le serment** : à la fin de l'arc I, quand Grisebo engage les cinq à
  Vretekalt, il leur fait jurer une formule simple de hirdman. Le meneur peut la
  lire à voix haute :

  > « Je ne laisse pas l'innocent aux mains des monstres.
  >
  > Je paie la dette que les morts réclament.
  >
  > Je me souviens de ce que la forêt veut oublier.
  >
  > Je rends ce qui a été volé, même si le monde l'a oublié.
  >
  > Je reviens. »

  Les quatre premières clauses correspondent aux quatre arcs ; la cinquième,
  « Je reviens », est la clé de l'épilogue. Le serment n'est pas magique : c'est
  une promesse que les PNJ leur rappellent, et que les joueurs peuvent décider
  de trahir. Si un personnage trahit une clause, le monde s'en souvient.

**Pourquoi Grisebo ?** Parce qu'il est déjà dans le scénario de *Cœur sauvage*,
qu'il explique pourquoi cinq étrangers voyagent ensemble, et qu'il permet de
passer d'un arc à l'autre sans téléportation. Il ne vole jamais la vedette : il
est le commanditaire, pas le héros.

**Si la table n'aime pas le cadre** : supprimer Grisebo et les commissions. Les
quatre scénarios fonctionnent très bien en campagne picaresque, avec les
accroches propres à chacun. Le serment peut être remplacé par une simple
promesse de groupe.

### 4.4 Variantes d'ordre

- **Variante géographique** : *Enlevée par les trolls* → *Cœur sauvage* →
  *Frostbitten* → *La Corne des elfes*. Elle évite un aller-retour entre
  l'Ejdland et le Vildland, mais elle place *Cœur sauvage* avant que les
  personnages soient assez expérimentés. Si vous la choisissez, commencez
  *Cœur sauvage* avec prudence : réduisez les rencontres aléatoires, gardez les
  sites les plus lisibles et intercalez un interlude facile.
- **Variante « Frostbitten d'abord »** : *Frostbitten* → *Enlevée par les
  trolls* → *Cœur sauvage* → *La Corne des elfes*. Elle donne un ton hivernal
  dès le début, mais elle perd l'effet d'introduction de *Enlevée par les
  trolls*. À réserver à une table qui connaît déjà les règles.
- **Variante sans cadre** : les quatre arcs sont joués comme quatre histoires
  indépendantes, reliées par les PNJ et les saisons. C'est la version la plus
  souple, et celle qui demande le moins de préparation.

### 4.5 Version intégrale et version resserrée

| Version | Contenu | Séances | PA |
|---|---|---:|---:|
| Intégrale | Quatre arcs + 2–3 interludes | 29–39 | 400–610 |
| Cœur seul | Quatre arcs, sans interlude | 27–32 | 345–460 |
| Resserrée | Quatre arcs, sites et rencontres coupés | 20–26 | 280–380 |

Les totaux supposent *Cœur sauvage* mené en 8–10 séances. Sa version intégrale,
jusqu'à 12 séances, allonge la campagne de 2 séances au maximum (total 27–34),
sans dépasser le budget de 140–180 PA prévu pour l'arc.

**Version resserrée.** Compter 2 séances pour l'arc I, 5–6 pour *Frostbitten*,
6–9 pour *Cœur sauvage*, 5–7 pour *La Corne des elfes*, plus la session 0 et
l'épilogue. Couper les rencontres aléatoires de *Cœur sauvage* pour ne garder
que 8 sites et 4 énigmes ; couper les événements aléatoires de *La Corne des
elfes* pour ne garder que 3 escales sur l'île ; résumer les voyages de
*Frostbitten* en une scène par trajet. On garde les scènes signature et les
choix moraux, on supprime les répétitions.

### 4.6 Chronologie interne

| Moment | Saison | Événement |
|---|---|---|
| Session 0 | Fin de l'été | Jukahäll, la moisson, la charrette de Kraltjan |
| Arc I | Fin de l'été | L'enlèvement de Sola, le terrier, le retour |
| Transition | Automne | Vretekalt, l'embauche par Grisebo et le serment ; Grymslante, la route du nord |
| Arc II | Hiver | Jagersheim, la malédiction, Morginhall, Holghold, Icepeak |
| Transition | Dégel | Le retour à Grymslante, la cargaison de draugvatten |
| Arc III | Printemps | Vildhjarta, les énigmes, la Pierre des Sagas |
| Transition | Début de l'été | La mer, le port, la lettre pour Ywol |
| Arc IV | Fin de l'été | La fête de Jorda, Ymradas, Leafelli, la Corne |
| Épilogue | Automne | Le retour à Grymslante, le cinquième serment |

---

## 5. Fiches détaillées des quatre scénarios

Chaque fiche suit le même plan : identité, durée et joueurs, prérequis,
synopsis, structure, ton, PNJ, difficulté, intégration, accroches, ajustements à
cinq, récompenses, sécurité, coupes et extensions.

---

### 5.1 *Enlevée par les trolls*

**Identité.** *Enlevée par les trolls*, chapitre 11 du *Livre des règles* français,
p. 337–350. Aventure d'introduction officielle, incluse dans le livre de base
payant. Écrite pour 3–5 joueurs débutants, 2–4 heures.

**Durée et joueurs.** 2 à 3 séances de 3 heures avec cinq joueurs, création
comprise. La version nue tient en une soirée ; la version campagne prend une
séance de plus pour installer Jukahäll, la route et la promesse de livraison.

**Prérequis.** Aucun. C'est l'aventure qui apprend les règles : tests de
compétence, pistage, combat, soins, négociation. Un groupe équilibré suffit :
quelqu'un qui sait se battre, quelqu'un qui connaît la nature, quelqu'un qui
aide par son savoir.

**Synopsis.** Les personnages aident à la moisson chez **Kraltjan Bite**, à
**Jukahäll**, et s'apprêtent à partir pour **Grymslante**. Kraltjan leur demande
de livrer une charrette de marchandises à son cousin **Magne**, à **Vretekalt**,
à deux jours de marche. En route, ils croisent la hird de Magne, menée par
**Durge Hrimläpp**, qui se rend au thing. À Vretekalt, Magne est désespéré : sa
fille **Sola** a été enlevée par des trolls. Les coupables sont **Röte**,
**Muste** et **Torke**, trois gråtrolls chassés de leur terrier par le roi troll
**Kullerklang**. Ils ont cru enlever une « princesse » pour le fils du roi. Les
personnages suivent leurs traces jusqu'au terrier, libèrent Sola, et rentrent
recevoir leur récompense.

**Structure.**

1. **Jukahäll.** La ferme, la moisson, les esclaves, les préparatifs du départ.
   Kraltjan propose la livraison : trois pièces d'argent par personnage.
2. **La route.** Deux jours de collines, de forêts et de bruyère noire. La hird
   de Durge Hrimläpp croise le groupe ; un campement abrité peut servir de
   halte. En option, les bandits de **Husk Vilde** attaquent si les personnages
   ne trouvent pas le camp.
3. **Vretekalt.** Magne, sa hache, sa détresse, les perles de verre, les
   empreintes. Il offre **cent pièces d'argent** à qui ramènera Sola. Le festin
   du thing approche ; la hird est partie ; il ne reste personne pour traquer.
4. **La piste.** Les empreintes mènent dans la forêt. Un campement sous un
   crâne de géant, un couteau oublié, un morceau de la robe de Sola. Les trolls
   se sont disputés : Torke a pleuré, Sola a déchiré son tissu pour le consoler.
5. **Le terrier.** Trois entrées, des gobelins, des réserves, une salle du
   trône. **Kullerklang** règne sur une cour grotesque. Sola est vivante, mais
   le temps presse. Le trésor du coffre peut être emporté ; le roi troll peut
   être tué, berné ou laissé en vie.
6. **Le retour.** Magne organise un festin s'il revoit sa fille ; sinon, il est
   déçu et tient les personnages pour responsables. Les PA sont distribués.

**Ton.** Conte rural, humour noir, trolls sales et touchants. C'est du Trudvang
d'introduction : les monstres ne sont pas seulement des sacs de points de vie,
et la petite fille est plus maligne que ses ravisseurs.

**PNJ clés.**

- **Kraltjan Bite**, fermier de Jukahäll, cousin de Magne. Pratique, pressé,
  propriétaire d'esclaves.
- **Magne**, fermier de Vretekalt, père de douze fils et d'une fille. Brave,
  excessif, prêt à payer cent pièces d'argent.
- **Sola**, la plus jeune fille de Magne, cheveux blonds, curieuse, courageuse.
  Elle n'est pas une potiche : elle a pitié de Torke et peut aider les
  personnages.
- **Jorde**, esclave de Magne, premier visage de Vretekalt.
- **Röte**, **Muste**, **Torke**, trois gråtrolls maladroits, affamés et
  querelleurs. Torke est le plus sensible.
- **Kullerklang**, roi troll, vaniteux et brutal. Il veut une princesse pour son
  fils ; il ne comprend pas que Sola n'en est pas une.
- **Durge Hrimläpp**, chef de la hird de Magne, Vildbron, méfiant mais correct.
- **Husk Vilde** et sa fratrie, bandits optionnels.

**Difficulté.** Faible. Les combats sont simples ; le terrier peut être mortel
si les personnages affrontent tout le monde de front. Avec cinq joueurs,
ajouter un quatrième troll ou un gobelin éclaireur, et donner à Kullerklang une
phase de négociation avant le combat.

**Intégration.** C'est l'**arc I** et la première clause du serment : « Je ne
laisse pas l'innocent aux mains des monstres. » Le scénario installe aussi
**Grymslante** comme prochaine destination : c'est là que Grisebo attend les
personnages. Le cadre est posé à la fin : Grisebo arrive à Vretekalt pour
acheter la cargaison, voit le groupe en action, lui propose un contrat de
hirdmen et lui fait prêter le serment des cinq clauses. La première clause est
donc déjà honorée ; les quatre autres ouvrent la route.

**Récompenses.** Le scénario prévoit jusqu'à **25 PA** : 5 PA pour la livraison,
5 PA pour avoir trouvé Sola, 5 PA pour l'avoir ramenée saine et sauve, 10 PA
pour avoir bien joué les personnages. Ajouter 5 PA pour le serment de hirdman
et la scène d'embauche, soit **25–30 PA**. Le trésor du terrier (pièces,
objets) s'ajoute en argent, pas en PA.

**Accroches.**

- La charrette de Kraltjan, la promesse de trois pièces d'argent, le départ
  pour Grymslante.
- Les perles de verre, les empreintes, le morceau de robe.
- Le crâne de géant, le couteau de bronze, le feu de camp des trolls.
- Le festin du thing, la politique locale, la maison Laudabrot.
- La réputation : si les personnages ramènent Sola, Magne parle d'eux à Grymslante.

**Ajustements à cinq.**

- Ajouter un quatrième troll ou un gobelin éclaireur dans le terrier.
- Donner à Sola une scène où elle aide les personnages (elle connaît les
  habitudes de Torke, elle peut distraire les trolls).
- Faire de Kullerklang un PNJ social autant qu'un combat : il peut être berné,
  acheté, ou convaincu que Sola n'est pas une princesse.
- Réduire le nombre de gobelins si le combat final traîne ; garder le trésor
  comme récompense tangible.

**Sécurité.** Enlèvement d'une jeune fille, esclavage, violence contre des
trolls, humour noir. Ne jamais décrire de violence graphique contre Sola ; elle
est traitée comme une invitée forcée, pas comme un objet. Le sort des esclaves de
Kraltjan peut être une ligne rouge : le mentionner sans le jouer.

**Coupes et extensions.**

- **2 séances** : couper la route et les bandits, aller directement de Jukahäll
  à Vretekalt, puis au terrier.
- **3 séances** : développer la route, le thing, la hird de Durge, le marché de
  Grymslante et les négociations avec Kullerklang.
- **Extension** : si Sola survit, en faire une PNJ récurrente ; elle peut
  revenir dans l'épilogue.

---

### 5.2 *Frostbitten*

**Identité.** *Frostbitten*, aventure officielle en anglais, p. 6–62
(numérotation imprimée), publiée pour *Trudvang Chronicles*. Trois actes :
*Ill Omens* (p. 11–30), *The White Lady* (p. 31–52), *Dreams of Frost*
(p. 53–62). Écrite pour 2–6 joueurs, idéalement 4–5, après une ou deux
aventures.

**Durée et joueurs.** 6 à 8 séances de 3–4 heures. Avec cinq joueurs, c'est la
taille idéale : le scénario est prévu pour 4–5, et la présence d'un cinquième
personnage permet de couvrir le combat, les soins et le social sans réduire les
oppositions.

**Prérequis.** Un survivant/chasseur (Rôdeur), un spécialiste du surnaturel
(Arpenteur), un soigneur (Colon), et idéalement un personnage originaire des
Stormländer ou du Vildland pour servir de garant auprès des locaux. Compétences
utiles : Survie (froid), Pister, Connaissance de la nature, Connaissances
culturelles (Stormländer, Vildland), Foi, Soins et remèdes, Combat armé,
Discrétion.

**Synopsis.** Les personnages arrivent à **Jagersheim**, un village du
**Vildland** (*Wildland* dans le texte anglais), au début de l'hiver. Ils sont
**déjà maudits** : avant l'aventure,
un chef de brigands les a envoyés piller le tombeau de **Bodvar Bjorki** dans
les **Icepeak**, et sa servante **Lova** les a trahis et enfermés dans le
tombeau. Là, Bodvar, ancien roi-conquérant qui a fait un pacte avec les
puissances sombres, les a maudits : le givre envahit leur peau, et la
malédiction ne se lèvera que s'ils réunissent Bodvar et **Aelda**, brisant du
même coup le pacte qui le lie aux puissances sombres. **Oyvind**, un
chasseur, les accueille ; la vieille **Hymir** les reçoit. Le village est frappé
par des morts étranges : des animaux et des guerriers retrouvés gelés, le sang
glacé dans les veines. Pour lever la malédiction, ils doivent réunir Bodvar et
**Aelda**, la **Dame blanche** de la **forêt des Loups** (*Wolf Woods*),
autrefois la femme qu'il a aimée et dont l'enfant est mort. Le chemin passe par
le clan **Wulfr** de **Morginhall**, les ruines de **Holghold**, l'**Amulette du
Chaos**, les **Gruths** et les monts **Icepeak**.

**Note d'adaptation.** Dans le texte d'origine, la malédiction est un prologue
hors-scène : un chef de brigands a envoyé les personnages piller le tombeau de
Bodvar avec Lova, qui les a trahis. Pour la campagne, placer ce prologue sur la
route du nord, entre Grymslante et Jagersheim, au début de l'arc II. Les
personnages ne sont pas des pilleurs volontaires : les brigands les surprennent
sur la route, les forcent à les guider ou à dégager un éboulement sans leur
dire ce qu'ils cherchent, et Lova gagne leur confiance avant de refermer la
porte. Ils s'échappent, maudits, et arrivent à Jagersheim, où le contrat de
dette de Grisebo pour Hymir leur donne une raison de rester. Le meneur peut
jouer ce prologue en 20–30 minutes ou le résumer avant la première scène.

**Structure.**

1. **Acte I — Ill Omens.** Jagersheim, Oyvind, Hymir, la vie du village. Les
   premières manifestations : animaux gelés, voix de femme dans la forêt,
   guerriers morts. Le premier stade du givre, la bête blanche (white warg) et
   la chasse au **braskelwurm** servent de tests de combat et de survie.
   **Oyvind meurt** ; son bûcher funéraire est la première grande scène
   émotionnelle. Le groupe part vers Morginhall avec **Baal Wulfr**.
2. **Acte II — The White Lady.** La **Bataille des Arbres** (*Battle of the
   Trees*) entre Wulfr et Uvail ; le passage de la forêt des Loups ; Morginhall,
   la salle de Baal, **Elsa**, **Eskild**, **Torkil**. La malédiction progresse :
   la peau se glace, les rêves de givre reviennent. Le groupe part pour
   **Holghold**, le village gelé, et rencontre **Aelda**, la Dame blanche. Elle
   raconte l'histoire de Bodvar, de leur amour et de l'enfant. Le groupe apprend
   l'existence de l'**Amulette du Chaos** et le moyen de réunir les deux esprits.
   La falaise d'**Askyr**, les catacombes, le choix du porteur de l'Amulette.
   Au retour, **Morginhall brûle** : Elsa et son fils sont morts, Baal repart
   pour la guerre, les personnages sont seuls.
3. **Acte III — Dreams of Frost.** Les monts **Icepeak**, la tempête, le village
   des **Gruths**, le tombeau de Bodvar. La descente dans le tombeau, le choix
   des trois porteurs d'**épées de givre**, l'ouverture de **Dimhall**, le
   combat contre Bodvar. Le retour à Holghold, les retrouvailles avec **Aelda**,
   la malédiction levée. La dernière scène est un adieu, pas une bataille
   rangée.

**Ton.** Saga nordique, horreur du froid, amour tragique, politique de clan.
C'est le scénario le plus « hivernal » du corpus : le froid est un personnage,
le givre est une horloge, et la violence est souvent hors champ.

**PNJ clés.**

- **Oyvind**, chasseur du Vildland, premier allié, mort avant la fin de l'acte I.
- **Hymir**, aînée de Jagersheim, mémoire du village, conseil et lore.
- **Baal Wulfr**, seigneur du clan Wulfr de Morginhall, blessé, orgueilleux,
  lié aux personnages par un serment de sang.
- **Elsa Wulfr**, son épouse, dame du clan pendant la maladie de Baal ; elle
  meurt avec son fils dans l'incendie de Morginhall, à la fin de l'acte II.
- **Eskild**, père d'Elsa, hostile aux étrangers, gardien de la tradition.
- **Torkil Wulfr**, second de Baal, chasseur, provocateur, allié rude.
- **Arkigstaal**, chasseur en chef de Jagersheim, hostile aux étrangers, mais
  ralliable par les actes.
- **Aelda**, la Dame blanche, fantôme de Holghold, amoureuse et coupable.
- **Bodvar Bjorki**, roi-conquérant maudit, antagoniste et victime.
- **Les Gruths**, petit peuple des montagnes, guides vers le tombeau.
- **Heimdal Bjorki**, frère de Bodvar, esprit gardien du tombeau, allié de
  l'acte III.
- **Lova**, servante du chef de brigands qui a trahi les personnages avant
  l'aventure ; elle peut réapparaître comme antagoniste ou témoin.
- **Vret Uvail**, seigneur rival, jamais vraiment rencontré, menace de fond.

**Difficulté.** Moyenne à élevée. Trois pics :

- **La malédiction** : si le meneur la joue comme une simple couleur, elle perd
  son mordant. Utiliser une **horloge de givre** en quatre stades (peau froide,
  engelures, perte de sensation, agonie) et laisser le Colon ralentir avec des
  soins, des herbes et du repos.
- **La Bataille des Arbres** : beaucoup de PNJ, de la neige, des loups, des
  Uvails. Réduire le nombre d'ennemis, pas leur niveau ; laisser les PNJ alliés
  absorber une attaque par scène.
- **Le final** : deux temps. D'abord le combat dans **Dimhall**, où seuls les
  porteurs d'épées de givre peuvent réellement blesser Bodvar ; les autres
  contiennent les guerriers du Bouclier brisé. Ensuite les retrouvailles avec
  Aelda, qui ne sont pas un combat mais une scène de vérité et de pardon. Si
  les joueurs cherchent à tuer Bodvar au lieu de le soumettre, rappeler que
  l'Amulette doit capturer son esprit, pas son corps.

**Intégration.** C'est l'**arc II** et la deuxième clause du serment : « Je paie
la dette que les morts réclament. » Grisebo envoie les personnages porter un
contrat de dette à Hymir ; la malédiction transforme l'encaissement en quête.
Le retour à Grymslante, au dégel, permet d'enchaîner sur *Cœur sauvage*.

**Accroches.**

- La lettre de Grisebo pour Hymir, le contrat de dette, la route du nord.
- Les animaux gelés, la voix de femme, les guerriers au sang glacé.
- Le tombeau de Bodvar, les runes, le trésor funéraire (prologue et acte III).
- Le bûcher d'Oyvind, la promesse de venger les morts.
- La rivalité Wulfr/Uvail, la dette de sang, le mariage et la succession.
- L'Amulette du Chaos, les épées de givre, le tombeau de Bodvar.

**Ajustements à cinq.**

- Le scénario est prévu pour 4–5 : ne pas ajouter d'ennemis, au contraire.
- Donner à chaque personnage un objectif personnel dans le clan : le Guerrier
  veut comprendre la tombe, le Rôdeur veut pister la Dame blanche, le Colon veut
  soigner les gelés, le Barde veut apprendre la chanson d'Aelda, l'Arpenteur veut
  comprendre le pacte.
- Utiliser la **horloge de givre** comme compte à rebours visible ; à chaque
  acte, cocher un stade. Le Colon peut dépenser des ressources pour retarder.
- Faire de la Bataille des Arbres une scène de masse **abstraite** : trois jets
  de groupe, un choix, une conséquence, plutôt qu'un combat rond par rond.
- Donner à Eskild une raison de changer d'avis, ou de trahir : c'est le PNJ le
  plus intéressant du clan.

**Récompenses.** Le scénario ne fixe pas de PA ; il renvoie au *Guide du maître*
p. 37 et recommande de distribuer les PA en cours d'acte. Pour la campagne,
viser **60–80 PA** : 5 PA par séance, plus des bonus de 5–10 PA pour avoir levé
un stade de la malédiction, sauvé un PNJ, compris le pacte, etc.

**Sécurité.** Body horror (peau gelée, engelures, membres qui perdent leur
sens), mort d'enfants (la fille de Baal et Elsa, l'enfant d'Aelda et Bodvar),
mort d'Elsa et de son fils, deuil, violence de clan, bûcher funéraire. Prévenir
la table avant l'acte II. Ne pas décrire la mort des enfants en détail ; la
suggérer par le récit d'Aelda et par le deuil d'Elsa.

**Coupes et extensions.**

- **6 séances** : couper la rivalité Uvail, réduire la Bataille des Arbres à une
  scène, garder Oyvind, Morginhall, Holghold, Icepeak et le rituel.
- **8 séances** : développer Morginhall, la politique du clan, la chasse au
  braskelwurm, le village des Gruths.
- **Extension** : après le rituel, les personnages peuvent revenir à Morginhall
  pour la succession ; c'est une bonne scène d'épilogue avant *Cœur sauvage*.

---

### 5.3 *Cœur sauvage*

**Identité.** *Cœur sauvage*, chapitre 2 des *Contes de Trudvang* français,
p. 27–87 (PDF p. 29–89). Grande aventure forestière non linéaire, officielle,
incluse dans le recueil payant. Écrite pour 4–6 personnages **relativement
expérimentés**.

**Durée et joueurs.** 8 à 12 séances de 3–4 heures. Avec cinq joueurs, le
scénario est dans sa fourchette basse : c'est parfait, mais il faut surveiller
le rythme et éviter les rencontres aléatoires répétitives.

**Prérequis.** Un Rôdeur (pister, orienter, survivre), un Arpenteur des brumes
avec des prières de guérison, un Colon/artisan avec un bon Savoir-faire, et des
compétences sociales pour les nombreux PNJ. Compétences utiles : Survie,
Pister, Connaissance de la nature, Géographie, Artisanat, Soins et remèdes,
Connaissances (créatures, cultures, langues), Foi, Combat, Divertissement.

**Synopsis.** Les personnages sont hirdmen de **Grisebo** et reviennent au port
de **Grymslante**, en Ejdland, après l'hiver passé dans le Vildland.
**Remlaug Torolv**, le marchand le plus riche de la
ville, les invite à un festin et leur propose **200 pièces d'argent** pour
escorter un convoi de **draugvatten** (gouttes d'esprit) jusqu'aux halles de
combat de **Garmvang**. La route traverse la lisière de **Vildhjarta**, une
forêt ancienne et consciente, qui referme ses chemins derrière eux. Pour en
sortir, les personnages doivent résoudre **au moins quatre énigmes secrètes**
et atteindre la maison de l'elfe **Kirjonti**, près de la lisière nord. La forêt
les teste, les sépare, les tente ; chaque site donne une réponse. À la fin,
Kirjonti meurt, confie aux personnages la **Pierre des Sagas**, et Vildhjarta
les laisse partir avec un avertissement.

**Note d'adaptation.** Dans le texte d'origine, le groupe arrive de la région
de **Dain** par la mer, engagé par Grisebo pour la traversée vers Ejdland. Dans
la campagne, il revient du Vildland par le nord, sur ordre de Grisebo :
Grymslante, Remlaug et le convoi restent identiques, mais la traversée maritime
initiale est remplacée par la route du retour. Le meneur peut conserver la scène
de débarquement si le groupe arrive effectivement par la mer.

**Structure.**

1. **Grymslante.** Le port, le contrôle des noms, la taverne, le festin de
   Remlaug, le contrat, les 200 pièces d'argent, le convoi. C'est aussi le
   moment de retrouver Grisebo et de poser la troisième clause du serment.
2. **La route et la lisière.** Deux semaines de voyage vers le nord ; le
   paysage change ; la brume ; la rencontre avec l'homme au manteau gris, qui
   est Vildhjarta personnifié. La forêt se referme.
3. **Les sites.** La forêt est un bac à sable : rencontres aléatoires (1d100),
   sites importants et rencontres secondaires. Les sites majeurs :
   - **Barkebull**, le géant endormi, qui connaît une piste vers le cairn de
     Runvid ;
   - **l'arbre géant qui saigne** ;
   - **le braskelwurm**, qui veut la mort du lindwurm ;
   - **les porcs rustiques**, **les skogstrolls morts** ;
   - **le chasseur mort**, **la pierre naine**, **la fratrie de nains** ;
   - **le revenant fermier**, **le lac de la forêt**, **la mine gobeline** ;
   - **Herlaug le forgeron**, qui forge sans argent ;
   - **la grotte de glace**, **Kvaler et le corbeau**, **le lindwurm** ;
   - **l'ancien site funéraire**, **la tanière d'Oltur**, **les ruines** ;
   - **le cairn de Runvid**, **le lieu de sacrifice dans le marais** ;
   - **le temple des Chevaliers-dragons**, **la fille et les chuchotements** ;
   - **l'élan de Timil**, **la hutte de Timil**, **les perles trolles et
     Guldglitter**.
4. **Les énigmes.** Chaque site peut donner une **énigme secrète** ; il en faut
   au moins quatre pour sortir. Les réponses ne sont pas expliquées par les
   PNJ : les joueurs doivent les interpréter. Le meneur tient un **tableau des
   énigmes** (quatre cases minimum, six pour une version longue).
5. **La sortie.** La piste mène à la maison de **Kirjonti**, deux jours de
   marche. Le combat a eu lieu : trois skogstrolls morts, la maison brûlée,
   Kirjonti agonisant. Il confie la **Pierre des Sagas** et meurt. Vildhjarta
   apparaît une dernière fois et fait le geste de trancher une gorge : quelqu'un
   va mourir. Les personnages sortent de la forêt.

**Ton.** Conte noir, forêt vivante, horreur onirique, humour de gargouille. La
forêt n'est pas un décor : c'est une entité qui décide, teste et punit. Le
scénario demande aux joueurs de prendre des notes, de faire des hypothèses et
d'accepter de ne pas tout comprendre.

**PNJ clés.**

- **Grisebo**, marchand stormlander, commanditaire et patron.
- **Remlaug Torolv**, marchand le plus riche de Grymslante, chef des
  stormhansas, généreux et calculateur.
- **Kirjonti**, elfe gardien de la Pierre des Sagas, mourant à la fin.
- **Barkebull**, géant endormi, parle le vrok, connaît une piste.
- **Timil**, nain silencieux et sans barbe, fume la pipe, veut sortir de la
  forêt.
- **Herlaug**, forgeron maudit, forge gratuitement, ne peut pas partir.
- **Kvaler**, corbeau/trickster, menteur, peut devenir allié ou ennemi.
- **Vidar Lodbroke**, guerrier pétrifié devant l'antre du braskelwurm, à libérer.
- **La fratrie de nains**, à la recherche de leur frère Timil.
- **La fille et les chuchotements**, morte à inhumer, énigme morale.
- **Guldglitter**, troll des perles, optionnel.

**Difficulté.** Élevée. Trois risques :

- **L'enlisement** : la forêt est un bac à sable ; sans fil rouge, les joueurs
  tournent en rond. Utiliser le tableau des énigmes et un site par séance.
- **La létalité** : les rencontres aléatoires peuvent tuer. Réduire les
  créatures, pas leur niveau ; laisser les joueurs fuir.
- **La frustration** : les énigmes n'ont pas de solution évidente. Donner des
  indices par les PNJ, les rêves, les objets ; ne jamais bloquer sur une seule
  réponse.

**Intégration.** C'est l'**arc III** et la troisième clause du serment : « Je me
souviens de ce que la forêt veut oublier. » La **Pierre des Sagas** est l'objet
de mémoire de la campagne : elle peut être montrée à Vaeromar dans l'arc IV,
qui la reconnaît comme une relique apparentée à la Corne. Le retour à Grymslante
permet de préparer le voyage vers Soj.

**Accroches.**

- Le contrat de Remlaug, les 200 pièces d'argent, le convoi de draugvatten.
- Les rumeurs sur le cairn de Runvid et ses trésors.
- Le frère disparu de la fratrie de nains.
- La fille morte à inhumer, les chuchotements dans la forêt.
- La promesse à Timil de le sortir de la forêt.
- La Pierre des Sagas, que Kirjonti confie en mourant.

**Ajustements à cinq.**

- Le scénario est prévu pour 4–6 : cinq est idéal. Ne pas ajouter de PNJ
  combattant.
- Choisir **8 à 10 sites** parmi les 20, en gardant un site par type : un site
  de combat (braskelwurm), un site social (Herlaug), un site moral (la fille
  morte), un site de lore (le cairn de Runvid), un site de passage (le lac),
  un site d'énigme (Barkebull), un site de twist (Kvaler), un site de finale
  (Kirjonti).
- Donner à chaque PJ un site personnel : le Guerrier au cairn de Runvid, le
  Rôdeur à la mine gobeline, le Colon à la fille morte, le Barde à Herlaug,
  l'Arpenteur au temple des Chevaliers-dragons.
- Remplacer les rencontres aléatoires par des **rencontres choisies** si la
  table préfère une intrigue plus dense.
- Utiliser un **tableau de quatre énigmes** visible ; chaque case remplie
  déclenche une scène de transition.

**Récompenses.** Le scénario prévoit **15 PA par session**, plus des bonus :
+30 PA si les personnages n'ont pas provoqué les sombres horreurs, +15 PA pour
la sombre horreur géante, +20 PA pour le wurm de sang, +15 PA pour avoir dissipé
la pétrification de Vidar Lodbroke, +15 PA pour avoir tenu la promesse à Timil,
+15 PA pour avoir inhumé la fille morte. Le total brut peut atteindre
**230–290 PA**. Pour la campagne, viser **140–180 PA** : donner les bonus
narratifs (Timil, la fille, Vidar), plafonner les bonus de combat répétés, et
étaler les PA sur les séances.

**Sécurité.** Mort d'enfant (la fille et les chuchotements), araignées, noyade,
horreur psychologique, body horror (l'arbre qui saigne, le braskelwurm), folie,
sacrifice. Prévenir avant l'arc. La fille morte doit être traitée avec respect :
ce n'est pas un jump scare, c'est une sépulture.

**Coupes et extensions.**

- **8 séances** : 8 sites, 4 énigmes, pas de rencontres aléatoires.
- **12 séances** : tous les sites, 6 énigmes, les quêtes personnelles, les
  rencontres secondaires.
- **Extension** : après la sortie, les nains de Trollbergen peuvent réclamer ce
  que les personnages ont pris dans le cairn de Runvid ; c'est une bonne
  transition vers un interlude.

---

### 5.4 *La Corne des elfes*

**Identité.** *La Corne des elfes*, chapitre 3 des *Contes de Trudvang*
français, p. 89–143 (PDF p. 91–145). Aventure officielle en trois actes, incluse
dans le recueil payant. Écrite pour 3–5 personnages **aguerris** ; l'introduction
prévient que les héros risquent fort de mourir.

**Durée et joueurs.** 8 à 10 séances de 3–4 heures. Avec cinq joueurs, on est à
la limite haute du scénario : c'est acceptable, mais il faut veiller à donner
une tâche à chaque personnage dans les scènes de foule et dans le final.

**Prérequis.** Expérience de la survie et de la chasse, **Marin** utile au
premier acte, Arpenteur des brumes fortement recommandé, pas de Tisseur de
vitner si possible. Compétences utiles : Survie, Pister, Marin, Connaissances
culturelles (elfes, Soj), Langage, Foi, Soins et remèdes, Combat armé,
Discrétion, Narration.

**Synopsis.** Les personnages arrivent à **Ywol**, village de la pointe nord de
l'île d'**Edras**, dans l'archipel de **Soj**, pendant la **fête de Jorda**.
**Arthyll Naom**, fermier et chef du village, reçoit ; sa fille **Yllwi** chante
et rêve d'aventure. Le vieil elfe **Vaeromar** tente de convaincre les invités de
partir avec lui à la recherche de la cité perdue de **Leafelli** et de la
**Corne d'Ymenos** ; personne ne l'écoute. Puis des trolls surgis de la brume
attaquent le village et enlèvent plusieurs jeunes filles, dont Yllwi. Les
personnages embarquent avec Vaeromar, traversent la dangereuse **mer d'Althis**,
atteignent l'île maudite d'**Ymradas**, traversent les marais, affrontent les
trolls et les araignées, descendent dans les mines de **Leafelli**, et
découvrent la vérité : la légende du dragon **Klafrarakh** cache le démon
**Ihssirguul**, qui a possédé le géant **Ymenos** et le tient en esclavage.
Pour sauver Yllwi et
bannir le démon, il faut sonner la **Corne d'Ymenos**. Vaeromar se sacrifie pour
permettre aux personnages d'accomplir le rituel.

**Structure.**

1. **Acte I — Ywol.** La fête de Jorda, la maison longue d'Arthyll, les PNJ du
   village (Jonis Daal, Aerdos Liw, Eirik Noi), le récit de Vaeromar, la
   méfiance des elfes, l'attaque des trolls dans la brume, l'enlèvement. Le
   groupe décide de poursuivre ; la mer d'Althis est la seule route.
2. **Acte II — La mer et Ymradas.** Dix jours de traversée (sept si les
   personnages rament la nuit), la tempête, le brouillard, les murmures de
   Leafelli, l'arrivée sur les récifs noirs. L'île : forêt antique, marais,
   ruines, phénomènes étranges, événements aléatoires (2d6), trolls, araignées,
   filles captives, **Allwa**. La progression mène aux mines et à l'entrée de
   Leafelli.
3. **Acte III — Leafelli.** Les mines de trolls, le contremaître **Dulbuug**,
   la prisonnière **Ingi**, les ponts et les salles de la cité, la cité des
   trolls, la cité des araignées, le **torrent empoisonné**, la salle du trône
   d'**Ihssirguul**, le géant **Ymenos**. Le final n'est pas un combat contre le
   géant : il faut atteindre la Corne et la faire résonner. **Yllwi** est
   sauvée ou perdue ; **Vaeromar** se sacrifie ; le démon est banni ; l'épilogue
   ramène les survivants à Ywol.

**Ton.** Épopée elfique, tragédie, horreur mythique. C'est le scénario le plus
ambitieux du corpus de base : il passe du festin au voyage en mer, du marais au
donjon, du conte au sacrifice. La mort est toujours proche.

**PNJ clés.**

- **Arthyll Naom**, fermier et chef d'Ywol, père d'Yllwi, hospitalier et fin
  juge des caractères.
- **Yllwi Naom**, seize ans, cheveux pâles, chanteuse, rêve de tuer un
  hrimtursir à l'arc. Enlevée au début de l'acte I.
- **Vaeromar**, elfe des étoiles, tisseur de vitner, porteur de la quête de
  Leafelli. Il est plus vieux et plus dangereux qu'il n'y paraît ; il se
  sacrifiera à la fin.
- **Jonis Daal**, commandante des gardes d'Ywol, femme puissante et fière.
- **Aerdos Liw**, tenancier du *Poisson jaune qui bâille*, ancien guerrier,
  colporteur de ragots.
- **Eirik Noi**, ealdorman d'Ywol, sage et érudit.
- **Allwa**, jeune fille captive dans la grotte des araignées, peut être sauvée
  ou non.
- **Dulbuug**, troll gris, contremaître des mines, brutal.
- **Ingi**, prisonnière humaine dans les mines, cherche à se venger.
- **Ihssirguul**, démon, véritable antagoniste de Leafelli.
- **Ymenos**, géant légendaire d'Ymradas, protecteur de l'île, possédé par le
  démon et réduit en esclavage. La Corne doit le réveiller de son sommeil
  enchanté ; ce n'est pas un ennemi à tuer, c'est une victime à libérer.

**Difficulté.** Très élevée. Trois pics :

- **La traversée** : Marin, tempête, récifs, murmures. Un échec peut coûter cher
  mais ne doit pas bloquer l'aventure.
- **Les mines** : gauntlet de trolls, d'araignées et de ponts. Avec cinq PJ,
  augmenter le nombre de trolls, pas leur niveau ; utiliser le terrain.
- **Le final** : Ymenos est invulnérable aux armes ordinaires ; Ihssirguul ne se
  combat pas à l'épée. Le but est de sonner la Corne. Si les joueurs cherchent
  le combat, ils perdent du temps et des PV ; le meneur doit rendre le rituel
  clair par les indices de Vaeromar, les visions et la Corne elle-même.

**Intégration.** C'est l'**arc IV** et la quatrième clause du serment : « Je
rends ce qui a été volé, même si le monde l'a oublié. » La **Corne d'Ymenos**
répond à la **Pierre des Sagas** de *Cœur sauvage* : deux reliques de mémoire,
l'une elfique, l'autre humaine. Le retour à Ywol puis à Grymslante permet
l'épilogue et le cinquième serment.

**Accroches.**

- La fête de Jorda, la lettre de Grisebo pour Arthyll, le festin.
- Le récit de Vaeromar, la cité de Leafelli, la Corne d'Ymenos.
- L'attaque des trolls dans la brume, l'enlèvement d'Yllwi.
- Les murmures de Leafelli, les rêves, la mer d'Althis.
- Les filles captives, Allwa, Ingi, Yllwi.
- La vraie légende d'Ymradas, le démon Ihssirguul, le géant Ymenos.

**Ajustements à cinq.**

- Le scénario est prévu pour 3–5 : cinq est le maximum. Ne pas ajouter de
  créature nommée ; ajouter des trolls ou des araignées de base.
- Donner à chaque PJ une tâche dans le final : le Guerrier tient le pont, le
  Rôdeur atteint la Corne, le Colon soigne les blessés, le Barde chante/parle
  pour maintenir le rituel, l'Arpenteur canalise la foi ou comprend le geste de
  Vaeromar.
- Faire de la Corne un **défi à trois réussites avant trois échecs** : chaque PJ
  peut contribuer avec une compétence différente. Cela évite que le final se
  résume à un seul jet.
- Développer les PNJ d'Ywol avant l'attaque : plus les joueurs s'attachent à
  Yllwi, Arthyll et Vaeromar, plus la tragédie fonctionne.
- Si un PJ meurt, utiliser le sacrifice de Vaeromar comme modèle : une mort qui
  a du sens, pas une mort punitive.

**Récompenses.** Le scénario ne fixe pas de PA ; il renvoie au *Livre des règles*
et recommande de distribuer les PA en cours d'acte. Pour la campagne, viser
**100–140 PA** : 5 PA par séance, plus des bonus de 10–15 PA pour avoir sauvé
Yllwi, sauvé Allwa, compris la vraie légende, sonné la Corne, honoré Vaeromar.

**Sécurité.** Enlèvement de jeunes femmes, araignées géantes, body horror,
sacrifice, mort de masse, noyade, possession démoniaque. Prévenir avant l'arc.
La scène de sacrifice de Vaeromar doit être annoncée par des signes et non
imposée ; les joueurs doivent pouvoir dire adieu.

**Coupes et extensions.**

- **6 séances** : couper les événements aléatoires de l'île, garder trois
  escales (marais, grotte des araignées, mines), réduire la cité des trolls.
- **10 séances** : développer Ywol, la traversée, la cité des trolls, la cité
  des araignées, les PNJ captives.
- **Extension** : après la Corne, les personnages peuvent ramener Yllwi à Ywol
  et découvrir que la cité de Leafelli commence à se réveiller ; c'est une
  bonne scène d'épilogue.

---

## 6. Les neuf modules suédois comme contenu secondaire

### 6.1 Principes d'utilisation

- **Ils ne sont pas la colonne vertébrale.** Les quatre arcs de base suffisent à
  faire une campagne complète. Les modules suédois sont des **interludes**, des
  **détours** ou des **campagnes optionnelles**.
- **Ils sont fan et gratuits.** Ils ne sont pas officiels, ne sont pas canon, et
  ne doivent pas être redistribués publiquement. Le meneur les traduit pour son
  usage personnel.
- **Ils se placent aux transitions.** Un interlude se joue entre deux arcs, ou
  pendant un voyage. Il ne doit pas interrompre un arc en cours.
- **Ils ne doivent pas déséquilibrer la progression.** Un interlude rapporte
  20–60 PA, pas 200. Les modules longs sont une autre campagne.
- **Ils peuvent être adaptés.** Changer les noms, les lieux, les PNJ, les
  créatures ; les intégrer à l'Ejdland, au Vildland ou à Soj selon les besoins.
- **Ils ne doivent pas voler la vedette.** Si un interlude prend plus de place
  que l'arc qu'il relie, le couper ou le déplacer.

### 6.2 Table de placement

| Module | Type | Pages | Placement conseillé | Durée | PA | Ce qu'il apporte |
|---|---|---:|---|---:|---:|---|
| *Skogshäxan* v2 | Prologue/interlude | 8 | Avant l'arc I, ou après l'arc I | 1–2 séances | 20–30 | Apprendre les règles, installer le thème de la méprise |
| *Spöket på Tingeltang* | Interlude léger | 6 | Après l'arc I, sur la route de Grymslante | 1 séance | 20–30 | Respiration gothique, enquête, social |
| *Fågelskogens främlingar* | Interlude | 32 | Après l'arc II, ou pendant l'arc III | 2 séances | 40–60 | Enquête rurale, enfant sauvé, forêt |
| *Vargtimmen* | Interlude | 15 | Pendant l'arc II, ou juste après | 1–2 séances | 35–55 | Horreur hivernale, traque, combat |
| *Svartgom* | Interlude | 24 | Après l'arc IV, ou avant | 2–3 séances | 30–40 | Conte nordique, survie, suite de *Snowsaga* |
| *Stenhjärta* | Module long | 108 | Campagne séparée, ou sequel | 8–9 séances | 200–300 | Donjon nain, runes, tétralogie |
| *Drakskugga* | Module long | 109 | Campagne séparée, ou sequel | 8–9 séances | 200–300 | Politique urbaine, sectes, runes |
| *Mardröm* | Module long | 161 | Campagne séparée, ou sequel | 10–12 séances | 250–300 | Cauchemar, guerre, lergök |
| *Carnags återkomst* | Module long | 47 | Sequel/finale optionnelle | 5–6 séances | 100–140 | Guerre, invasion, épée brisée |

### 6.3 Les interludes légers

#### *Skogshäxan* v2 — la sorcière des bois

**Identité.** Medusa Games, version 2.0, 8 pages, Jörgen Karlsson. Aventure
d'initiation pour 3–5 joueurs.

**Pitch.** Les personnages trouvent **Torgils**, un chasseur blessé, attaqué par
des trolls. Il fuyait **Isold**, une « sorcière » qui vit dans la forêt avec son
fils **Jökull**, un demi-troll. Les villageois la croient maléfique ; les trolls
la craignent. Le scénario se résout par la compréhension, pas par le meurtre.

**Placement.** Avant l'arc I si la table veut un prologue encore plus doux que
*Enlevée par les trolls* ; ou après l'arc I, comme détour dans une forêt de
Mittland. Dans la campagne, il peut être le récit que le Barde raconte à
Jukahäll, ou une rencontre sur la route de Grymslante.

**Prérequis.** Aucun. 5 joueurs est dans la fourchette (3–5).

**Ajustement à cinq.** Ajouter un troll supplémentaire ou un villageois hostile
pour occuper le cinquième personnage. Développer le dilemme moral : les
villageois veulent brûler la forêt, Isold veut la protéger.

**PA.** 20–30.

**Sécurité.** Le passé d'Isold comporte un viol suivi d'une transformation. Le
module le raconte dans son background. En table, le résumer hors scène et ne
jamais le jouer.

#### *Spöket på Tingeltang* — le fantôme de Tingeltang

**Identité.** J.H.J. Karlsson, 6 pages. Aventure légère, adaptable à tout pays
humain.

**Pitch.** Les personnages arrivent au château de **Tingeltang**, bâti sur une
île. Le vieux mage **Hrafnajol** leur demande d'aider le fantôme de **Ripa**, qui
hante les lieux. L'enquête révèle que Ripa a été murée vivante ; il faut
retrouver ses ossements, les porter sur un radeau et les brûler. Le coupable,
**Jedvard**, s'en tire avec une sinistre politesse.

**Placement.** Après l'arc I, sur la route de Grymslante, ou entre l'arc II et
l'arc III. C'est une respiration : peu de combat, beaucoup d'ambiance.

**Prérequis.** Enquête, sociabilité. Le Barde et le Rôdeur sont les moteurs.

**Ajustement à cinq.** Ajouter un PNJ suspect (un serviteur, un invité) pour
donner du travail au cinquième joueur. Le château peut être un lieu de repos
avant *Cœur sauvage*.

**PA.** 20–30.

**Sécurité.** Meurtre, fantôme, séquestration. Rien de graphique.

#### *Fågelskogens främlingar* — les étrangers de la forêt aux oiseaux

**Identité.** Medusa Games, 2006, Franz Ung, 32 pages.

**Pitch.** Les personnages arrivent à **Kråkby**. Trois habitants ont disparu ;
des gens tombent raides morts ou deviennent fous. Le maire **Tyrbom** offre
100 pièces d'argent. La forêt de **Gulgavid** abrite les **Happjor**, un petit
peuple, et un **gantroll** nommé **Orlok**, qui chasse avec une flûte magique.
**Askur**, un jeune homme du village, le sert en échange de pouvoir et a enlevé
un bébé. Les personnages peuvent sauver l'enfant et affronter Orlok dans sa
grotte.

**Placement.** Après l'arc II, sur la route du retour, ou pendant l'arc III si
les personnages quittent un moment Vildhjarta. C'est un bon changement de ton
après le froid.

**Prérequis.** Enquête, discrétion, combat. Le Rôdeur suit les pistes, le Barde
interroge, le Colon reconnaît les plantes, l'Arpenteur comprend les Happjor.

**Ajustement à cinq.** L'enquête peut être élargie : ajouter un témoin, un
faux coupable, une piste dans le moulin. La grotte d'Orlok est dangereuse pour
cinq personnages de niveau intermédiaire ; réduire les créatures, pas Orlok.

**PA.** 40–60.

**Sécurité.** Enlèvement de bébé, expériences sur des personnes, horreur
corporelle discrète. Voiler les scènes d'expérimentation ; ne pas décrire
l'enfant en danger.

#### *Vargtimmen* — l'heure du loup

**Identité.** Medusa Games, 2006, Franz Ung, 15 pages.

**Pitch.** Une famille est massacrée dans une charrette. Les personnages
arrivent au poste-frontière où leur ami **Leifur Långe** devait les attendre ; il
est mort. **Worge**, un loup géant, attaque. **Isbjarn**, un chasseur half-troll,
arrive avec ses hommes et ses propres intentions. La traque mène au pont
branlant, à la forêt de Lumm, à une grotte et au repaire de Worge.

**Placement.** Pendant l'arc II (le froid, la neige, la traque) ou juste après.
C'est le module le plus « monster movie » du corpus.

**Prérequis.** Combat, pistage, sang-froid. Le Guerrier et le Rôdeur sont en
première ligne ; le Colon soigne ; le Barde maintient le moral.

**Ajustement à cinq.** Worge est trop fort pour des personnages de début de
campagne : le placer après *Frostbitten*, ou réduire ses PV à 45 et son Strid à
13. Ajouter un chasseur d'Isbjarn pour le cinquième PJ.

**PA.** 35–55.

**Sécurité.** Massacre de famille, sang, loup géant, huis clos. Décrire avec
retenue ; ellipse sur les corps.

#### *Svartgom*

**Identité.** Medusa Games, 2008, Jörgen Karlsson, 24 pages. Suite de
*Snowsaga*.

**Pitch.** Un vent du nord éternel glace le **Nordfrost** ; le printemps ne
revient plus. **Svartgom** retient les vents. Les personnages traversent la
toundra, affrontent les orkhirer, les garmar, les trolls de glace, les tempêtes
et les avalanches ; ils libèrent les vents est, ouest et sud. **Klockhäxan**, la
sorcière de l'horloge, aide ou piège. La forteresse de Svartgom est un donjon de
glace ; la libération des vents ramène le printemps.

**Placement.** Après l'arc IV, comme épilogue ou comme détour nordique avant la
fin. Ou avant l'arc IV, si la table veut une pause entre *Cœur sauvage* et
*La Corne des elfes*.

**Prérequis.** Survie, orientation, tir, résistance au froid. Le Colon et le
Rôdeur sont essentiels ; le Guerrier tient les lignes ; le Barde négocie avec
les esprits ; l'Arpenteur comprend la magie des vents.

**Ajustement à cinq.** L'attrition est la vraie menace : froid, vivres,
blessures. Ajouter un PNJ guide ou un traîneau pour le cinquième personnage.

**PA.** 30–40.

**Sécurité.** Torture d'elfes, froid extrême, créatures de glace. Voiler les
scènes de torture ; décrire le froid par les sensations, pas par le gore.

**Lien avec *Snowsaga*.** Si la table a joué *Snowsaga*, faire revenir un PNJ ou
un lieu. Sinon, résumer : la Reine des neiges est tombée, ses seigneurs de
guerre se disputent le nord, et **Galve Blåyxr** est devenu **Svartgom**.

### 6.4 Les modules longs

Ces quatre modules ne sont **pas des interludes**. Ce sont des campagnes
complètes, avec leur propre progression, leurs propres arcs et leurs propres
récompenses. Les insérer dans la route des quatre arcs reviendrait à mettre une
campagne dans une campagne. Le corpus local contient les trois premiers tomes
de la tétralogie *Ödesprofetiorna* ; le quatrième n'y figure pas.

#### *Stenhjärta* — Cœur de pierre

**Identité.** Medusa Games, 2007, Jörgen Karlsson, 108 pages. Tome 1 de la
tétralogie *Ödesprofetiorna*. Fan, gratuit.

**Pitch.** Le thuun **Onegin** d'Okrug convoque les personnages : son frère
**Yurial** a fui dans **Fradkov**, un royaume nain abandonné, avec l'anneau de
mahurgguld. Le module est un donjon-sandbox : galeries, ponts, salles, événements
aléatoires, une vingtaine de sites, sept clés runiques. La rune de Fradkov est
l'un des trois verrous qui retiennent le dragon **Slogodrang**.

**Pourquoi ce n'est pas un interlude.** 8–9 séances, 108 pages, un donjon
complet, une progression de 200–300 PA. C'est un arc entier, pas une pause.

**Comment l'utiliser.** Comme **campagne séparée** (la tétralogie
*Ödesprofetiorna*), ou comme **sequel** après les quatre arcs, avec des
personnages convertis ou de nouveaux personnages. Ne pas l'insérer entre deux
arcs de la route.

#### *Drakskugga* — L'Ombre du dragon

**Identité.** Medusa Games, 2008–2010, Jörgen Karlsson, 109 pages. Tome 2.

**Pitch.** La ville de **Bjargwall**, cinq factions, une rune sous les
catacombes, la secte des **Shurdahjón**, le thul **Svastikov**. C'est le tome le
plus politique de la tétralogie.

**Pourquoi ce n'est pas un interlude.** 8–9 séances, une ville entière, une
intrigue à factions, 200–300 PA. C'est une campagne urbaine.

**Comment l'utiliser.** En suite de *Stenhjärta*, dans la campagne séparée. Si
vous voulez seulement la politique urbaine, vous pouvez en extraire une
mini-campagne de 3–4 séances, mais ce n'est plus *Drakskugga*.

#### *Mardröm* — Cauchemar

**Identité.** Medusa Games, 2011, Jörgen Karlsson, 161 pages. Tome 3.

**Pitch.** **Onegin** confie aux personnages la recherche d'une **lergök**
disparue. Le voyage mène à **Svartliden**, **Runvjiik**, **Hriesij**, puis au
siège de la ville, à **Gildamor** et à **Ergeishall**, où la troisième rune est
portée par un troll de pierre runique qui marche. C'est le tome le plus
ambitieux : cauchemar, politique, guerre, rêve.

**Pourquoi ce n'est pas un interlude.** 10–12 séances, 161 pages, 250–300 PA,
un siège, un monde onirique, une flûte magique. C'est une campagne complète.

**Comment l'utiliser.** En suite de *Drakskugga*, dans la campagne séparée. Le
Barde doit avoir la compétence **Musique et danse** et la spécialité **Chant et
instruments de musique** ; sans elle, *Mardröm* ne peut pas être résolu. Si vous
voulez jouer *Mardröm* avec les cinq personnages de la route, prévoyez une
conversion et une montée en puissance.

#### *Carnags återkomst* — Le Retour de Carnag

**Identité.** Medusa Games, 2007, Jörgen Karlsson, 47 pages. Aventure autonome,
hors tétralogie. Fan, gratuit.

**Pitch.** Le mage **Coldernach** cherche l'épée brisée de **Beremond**,
*Rafnablad*. L'armée de **Carnag** envahit le pays ; les personnages doivent
reforger l'épée à **Sotheim**, puis livrer la bataille de **Järvsahed**. C'est
une campagne de guerre en 5–6 séances, avec une timeline de 29 jours.

**Pourquoi ce n'est pas un interlude.** 5–6 séances, une invasion, une bataille
finale, 100–140 PA. C'est un arc de guerre, pas une pause.

**Comment l'utiliser.** Comme **sequel/finale optionnelle** après *La Corne des
elfes*, si la table veut une conclusion guerrière. Il faut recoudre le module au
fil de la campagne : la guerre peut être une conséquence des événements de
*Cœur sauvage* ou de *La Corne des elfes*. Ne pas le présenter comme la
« vraie » fin : la fin de la route est la Corne.

### 6.5 Si vous voulez absolument jouer un module long

Trois options, par ordre de préférence :

1. **Campagne séparée** : jouer les quatre arcs, puis relancer une nouvelle
   campagne *Ödesprofetiorna* avec de nouveaux personnages. C'est la solution la
   plus propre ; elle ne casse ni la progression ni le ton.
2. **Sequel** : après *La Corne des elfes*, convertir les cinq personnages et
   jouer *Stenhjärta* comme une nouvelle saga. Il faut accepter que les
   personnages soient déjà très puissants ; le module perd une partie de sa
   tension.
3. **Remplacement d'arc** : remplacer *Cœur sauvage* par *Stenhjärta* ou
   *Drakskugga*. La campagne reste jouable, mais elle perd la forêt, les énigmes
   et la Pierre des Sagas ; ce n'est plus le même plan.

**Recommandation.** Garder les quatre arcs. Les modules longs sont un bonus pour
une deuxième campagne, pas une pièce du puzzle.

---

## 7. Plan de séances

### 7.1 Vue d'ensemble

| Bloc | Contenu | Séances | PA | Saison |
|---|---|---:|---:|---|
| Session 0 | Création, sécurité, Jukahäll, la charrette | 1 | — | Fin de l'été |
| Arc I | *Enlevée par les trolls*, embauche et serment | 2 | 25–30 | Fin de l'été |
| Interlude A | *Spöket* ou *Skogshäxan* (optionnel) | 0–2 | 20–30 | Automne |
| Arc II | *Frostbitten* | 7–8 | 60–80 | Hiver |
| Interlude B | *Vargtimmen* ou *Fågelskogens* (optionnel) | 0–2 | 35–60 | Fin de l'hiver |
| Arc III | *Cœur sauvage* | 8–10 | 140–180 | Printemps |
| Interlude C | *Fågelskogens* ou *Svartgom* (optionnel) | 0–3 | 30–60 | Début de l'été |
| Arc IV | *La Corne des elfes* | 8–10 | 100–140 | Fin de l'été |
| Épilogue | « Le cinquième serment » | 1 | 20–30 | Automne |

**Total cœur** : 27 à 32 séances (avec la session 0 et l'épilogue, *Cœur
sauvage* en 8–10 séances), 345 à 460 PA.
**Avec interludes** : 29 à 39 séances, 400 à 610 PA.

### 7.2 Session 0 — Jukahäll et la route

- **Création des personnages** : les cinq archétypes, les compétences à
  sécuriser, les liens croisés.
- **Sécurité émotionnelle** : lignes et voiles, signal de pause, débriefing.
- **Le cadre** : Grisebo, la route, les quatre étapes. Le serment de hirdman
  sera prêté à la fin de l'arc I, quand Grisebo engagera les personnages.
- **Scène d'ouverture** : Jukahäll, la fin de la moisson, la charrette de
  Kraltjan. Terminer sur la demande de livraison.

**Cliffhanger** : « Deux jours de marche jusqu'à Vretekalt. Qu'est-ce qui
pourrait mal se passer ? »

### 7.3 Arc I — *Enlevée par les trolls* (2 séances)

| Séance | Contenu | Moment clé |
|---|---|---|
| I.1 | Jukahäll, la livraison, la route, la hird de Durge, Vretekalt | Magne : « Ces trolls ont emporté ma fille ! » |
| I.2 | La piste, le crâne de géant, le terrier, Kullerklang, Sola, le retour | Le choix : tuer le roi troll ou le berner |

**Cliffhanger** : à Vretekalt, Grisebo arrive pour acheter la cargaison. Il a
entendu parler du groupe. « J'ai besoin de cinq hirdmen. La route est longue. »
Il les engage, leur fait prêter le serment des cinq clauses, et la campagne
commence vraiment.

**Notes de rythme.** Ne pas passer plus d'une demi-séance sur la route. Le cœur
de l'arc est le terrier : trois entrées, une cour, un trésor, une petite fille
qui n'a pas besoin d'être sauvée comme une potiche.

### 7.4 Interlude A — *Spöket* ou *Skogshäxan* (optionnel)

- **Spöket på Tingeltang** (1 séance) : sur la route de Grymslante, un château
  au bord d'un lac, un fantôme, une enquête. Respiration gothique.
- **Skogshäxan** (1–2 séances) : dans une forêt de Mittland, un chasseur
  blessé, une sorcière, un demi-troll. Conte initiatique.

**Cliffhanger** : la route du nord. Les premières neiges arrivent.

### 7.5 Arc II — *Frostbitten* (7–8 séances)

| Séance | Contenu | Moment clé |
|---|---|---|
| II.1 | Le tombeau de Bodvar (prologue), la route du nord, Jagersheim, Oyvind, Hymir, les premiers signes | Les animaux gelés, la voix de femme |
| II.2 | La bête blanche, le braskelwurm, la mise en garde de la Dame blanche, la mort d'Oyvind | Le givre sur la peau |
| II.3 | La Bataille des Arbres, la forêt des Loups, les Uvails | La prophétie du Roi de givre |
| II.4 | Morginhall, Baal, Elsa, Eskild, Torkil, la politique du clan | « Ils sont les hérauts de l'hiver. » |
| II.5 | Holghold, la Dame blanche, l'histoire de Bodvar et Aelda | Le pacte et l'enfant |
| II.6 | Askyr, les catacombes, l'Amulette du Chaos ; Morginhall brûle, le départ de Baal | Les personnages sont seuls |
| II.7 | Icepeak, les Gruths, le tombeau de Bodvar | Le choix des trois épées de givre |
| II.8 | Le retour à Holghold, les retrouvailles, la malédiction levée | Bodvar et Aelda se retrouvent |

**Cliffhanger** : au dégel, un messager de Grymslante : « Remlaug Torolv cherche
des hirdmen pour un convoi. Il paie 200 pièces d'argent. »

**Notes de rythme.** La malédiction doit être visible dès la séance II.1. Utiliser
l'horloge de givre : quatre stades répartis sur l'arc, avec possibilité de
ralentir. La Bataille des Arbres peut être résumée en trois jets de groupe si la
table n'aime pas les batailles de masse.

### 7.6 Interlude B — *Vargtimmen* ou *Fågelskogens* (optionnel)

- **Vargtimmen** (1–2 séances) : un poste-frontière, un loup géant, une traque
  dans la neige. Parfait pour prolonger l'ambiance de *Frostbitten*.
- **Fågelskogens främlingar** (2 séances) : un village, des disparitions, un
  bébé enlevé, une grotte. Change de ton après l'hiver.

**Cliffhanger** : la route de Grymslante. Le printemps arrive, mais la forêt est
plus sombre que d'habitude.

### 7.7 Arc III — *Cœur sauvage* (8–10 séances)

| Séance | Contenu | Moment clé |
|---|---|---|
| III.1 | Grymslante, Remlaug, le festin, le contrat, le convoi | 200 pièces d'argent |
| III.2 | La route, la lisière, la brume, la première nuit | La forêt se referme |
| III.3 | Barkebull, l'arbre qui saigne, le braskelwurm | Première énigme |
| III.4 | Le chasseur mort, la pierre naine, la fratrie de nains | Deuxième énigme |
| III.5 | Le revenant fermier, le lac, la mine gobeline | Troisième énigme |
| III.6 | Herlaug, la grotte de glace, Kvaler et le corbeau | Quatrième énigme |
| III.7 | Le lindwurm, l'ancien site funéraire, Oltur | Le combat du lindwurm |
| III.8 | Les ruines, le cairn de Runvid, le marais sacrificiel | Le trésor de Runvid |
| III.9 | Le temple des Chevaliers-dragons, la fille et les chuchotements, Timil | La sépulture de la fille |
| III.10 | Kirjonti, la Pierre des Sagas, la sortie, le retour | « Portez-la avec… » |

**Cliffhanger** : à Grymslante, Grisebo a une lettre pour Ywol, dans l'archipel
de Soj. « Les elfes paient bien. Et ils ont demandé spécifiquement des gens qui
ont survécu à Vildhjarta. »

**Notes de rythme.** Un site par séance, sauf les séances de transition. Tenir
un tableau de quatre énigmes visible. Si les joueurs bloquent, faire parler un
PNJ, un rêve ou un objet. Ne pas remplir toutes les cases à leur place.

### 7.8 Interlude C — *Fågelskogens* ou *Svartgom* (optionnel)

- **Fågelskogens** (2 séances) : si l'interlude B n'a pas été joué, c'est le
  moment. Le village de Kråkby, la forêt de Gulgavid, Orlok.
- **Svartgom** (2–3 séances) : un détour nordique avant la mer. Le Nordfrost,
  les vents retenus, la forteresse de glace.

**Cliffhanger** : la mer d'Althis. Un bateau, une tempête, une île qui n'apparaît
sur aucune carte.

### 7.9 Arc IV — *La Corne des elfes* (8–10 séances)

| Séance | Contenu | Moment clé |
|---|---|---|
| IV.1 | La mer, Ywol, la fête de Jorda, Arthyll, Yllwi, Vaeromar | Le récit de la Corne |
| IV.2 | L'attaque des trolls, la brume, l'enlèvement, la poursuite | Yllwi disparaît |
| IV.3 | La traversée de la mer d'Althis, les murmures, le naufrage | Les récifs noirs |
| IV.4 | Ymradas, les marais, les trolls, les araignées, Allwa | La grotte des araignées |
| IV.5 | Les mines, Dulbuug, Ingi, la descente | Le contremaître |
| IV.6 | Leafelli, la cité des trolls, la cité des araignées, le torrent | Le torrent empoisonné |
| IV.7 | Ymenos, Ihssirguul, la Corne | Le rituel |
| IV.8 | Yllwi, le sacrifice de Vaeromar, la fuite, le retour | « Soufflez dans la Corne ! » |
| IV.9 | L'épilogue de l'arc, le retour à Ywol, les adieux | La mer se calme |

**Cliffhanger** : à Grymslante, Grisebo les attend. « Vous avez ramené la
Pierre ? Et la Corne ? Alors il est temps de rentrer. »

**Notes de rythme.** Développer Ywol avant l'attaque : plus les joueurs aiment
Yllwi, Arthyll et Vaeromar, plus la tragédie fonctionne. Dans le final, donner
une tâche à chaque PJ ; la Corne est un défi de groupe, pas un jet unique.

### 7.10 Épilogue — « Le cinquième serment » (1 séance)

- **Le retour** : Grymslante, la maison de Grisebo, la cargaison, les comptes.
- **Les questions** : qu'avez-vous ramené ? Qu'avez-vous perdu ? Qui se souvient
  de vous ?
- **Le cinquième serment** : les personnages jurent de revenir, ou de transmettre
  l'histoire. La Pierre des Sagas et la Corne peuvent être données à un temple,
  à un musée, à un peuple, ou gardées.
- **La dernière image** : la route, la saison qui tourne, un nouveau départ.

**Fin alternative** : si la table veut une conclusion guerrière, enchaîner sur
*Carnags återkomst* comme sequel (voir § 6.4). Ce n'est pas la fin de la route,
c'est une autre histoire.

### 7.11 Transitions et cliffhangers

1. **Fin de l'arc I** : Grisebo arrive à Vretekalt ; le contrat du nord.
2. **Fin de l'arc II** : le dégel ; le messager de Remlaug ; la cargaison de
   draugvatten.
3. **Fin de l'arc III** : la lettre pour Ywol ; la mer ; la fête de Jorda.
4. **Fin de l'arc IV** : le retour à Grymslante ; le cinquième serment.
5. **Transitions d'interludes** : chaque interlude se termine par une route, une
   saison ou une rumeur qui ramène vers l'arc suivant.

---

## 8. PA, progression et entre-séances

### 8.1 Les règles utiles

- **1 PA = 1 point de compétence.** Les PA s'utilisent directement pour acheter
  des niveaux de compétence, des disciplines ou des spécialités (*Livre des
  règles*, p. 71–72 et 310–311).
- **Coût d'un niveau de compétence** : égal au niveau visé. Passer de VC 5 à
  VC 6 coûte 6 PA ; de VC 9 à VC 10 coûte 10 PA ; de VC 7 à VC 10 coûte 27 PA.
- **Coût d'une discipline/spécialité** : 7 PA (niveau 1, VC 4 requise), 14 PA
  (niveau 2, VC 7), 21 PA (niveau 3, VC 7), 28 PA (niveau 4, VC 10), 35 PA
  (niveau 5, VC 10).
- **Barème indicatif** : 5–10 PA pour une aventure simple, jusqu'à 100 PA pour
  les plus difficiles, environ 5 PA par personnage et par session. Toujours
  donner le même nombre de PA à tous les personnages qui ont vécu les mêmes
  épreuves.

### 8.2 Budgets par arc

| Bloc | PA fixes du scénario | Budget recommandé | Cumul |
|---|---:|---:|---:|
| Arc I — *Enlevée par les trolls* | 25 max | 25–30 | 25–30 |
| Arc II — *Frostbitten* | Aucun fixe | 60–80 | 85–110 |
| Arc III — *Cœur sauvage* | ~230–290 brut | 140–180 | 225–290 |
| Arc IV — *La Corne des elfes* | Aucun fixe | 100–140 | 325–430 |
| Épilogue | Aucun fixe | 20–30 | 345–460 |
| Interludes (optionnels) | 20–60 chacun | 55–150 | 400–610 |

**Comment lire ce tableau.** Les PA « fixes » sont ceux que le scénario prévoit
explicitement. Le « budget recommandé » est ce que le meneur devrait réellement
distribuer pour garder une courbe de progression cohérente. Pour *Cœur sauvage*,
le total brut est trop élevé : donner les bonus narratifs (Timil, la fille
inhumée, Vidar) et plafonner les bonus de combat répétés.

### 8.3 Jalons de progression

| Palier | Fin de | PA cumulés | Ce que les PJ doivent avoir |
|---|---|---:|---|
| 0 | Session 0 | 0 | Une compétence de combat fiable, une compétence de survie, un lien de groupe |
| 1 | Arc I | 25–30 | Combat 5–6 ; Pister/Survie 4–5 ; un peu de social ; une raison de voyager |
| 2 | Arc II | 85–110 | Combat 7–8 ; Survie 6–7 ; une discipline 1–2 ; de l'équipement d'hiver |
| 3 | Arc III | 225–290 | Combat 8–9 ; compétences signature 8–10 ; deux disciplines ; une spécialité 2 |
| 4 | Arc IV | 325–430 | Combat 9–10 ; plusieurs compétences 9–10 ; spécialités 3–4 ; une histoire |
| 5 | Épilogue | 345–460 | Une capacité héroïque, un choix moral, une promesse tenue |

**Note.** Les valeurs sont des **VC de base** ; avec les disciplines et les
spécialités, un personnage peut dépasser 15–20 dans son domaine de prédilection.
Ne pas exiger que tous les PJ soient au même niveau dans tout : la campagne
valorise la spécialisation.

### 8.4 Comment distribuer les PA

- **5 PA par session** comme base, même si l'arc n'est pas terminé.
- **Des bonus de 5–15 PA** pour un objectif secondaire, une scène forte, une
  solution intelligente, un sacrifice.
- **Un bonus de fin d'arc** de 10–20 PA pour la réussite de l'objectif principal.
- **Pas de PA pour le simple fait de tuer** : les PA récompensent la résolution,
  pas le body count.
- **Toujours le même total** pour tous les PJ présents ; ne pas pénaliser une
  absence.
- **Laisser les joueurs dépenser** entre les séances ; un PJ peut garder ses PA
  pour acheter un niveau plus tard.

### 8.5 Entre les séances

- **Une scène de transition par joueur** : un rêve, une lettre, un souvenir, une
  dette. Cela donne de la matière aux interludes et à l'épilogue.
- **Une roue des saisons** : quatre cases, une par arc. À chaque transition,
  cocher une case et décrire le changement de décor.
- **Un carnet de dettes** : noter qui doit quoi à qui. Les PNJ s'en souviennent.
- **Un journal de saga** : à la fin de chaque séance, un joueur écrit une phrase
  au nom de son personnage. Ces phrases serviront à l'épilogue.
- **Une table de rumeurs** : trois rumeurs par arc, dont une fausse. Elles
  peuvent annoncer l'arc suivant ou un interlude.

---

## 9. Adapter à cinq personnages

### 9.1 Économie d'action

Les scénarios sont écrits pour 3–6 PJ selon les cas. Avec cinq, on réduit **le
nombre d'ennemis**, pas leur niveau :

- retirer un mook par groupe de trois ;
- donner aux boss un **deuxième temps** (une phase, pas des PV en plus) ;
- utiliser le terrain (couloirs, portes, hauteur, ponts) pour limiter le nombre
  d'attaquants ;
- laisser les PNJ alliés absorber une attaque par scène ;
- ne jamais ajouter un ennemi nommé pour « équilibrer » : ajouter des mooks.

### 9.2 Notes par scénario

- ***Enlevée par les trolls*** : ajouter un quatrième troll ou un gobelin
  éclaireur ; faire de Kullerklang une scène sociale avant le combat.
- ***Frostbitten*** : cinq est idéal ; ne pas ajouter d'ennemis ; réduire les
  loups de la Bataille des Arbres ; utiliser l'horloge de givre.
- ***Cœur sauvage*** : cinq est idéal ; choisir 8–10 sites ; donner un site
  personnel à chaque PJ ; remplacer les rencontres aléatoires par des rencontres
  choisies si la table préfère.
- ***La Corne des elfes*** : cinq est le maximum ; augmenter les trolls et les
  araignées de base, pas Ihssirguul ni Ymenos ; donner une tâche à chaque PJ
  dans le final.

### 9.3 Tour de table

Chaque arc doit offrir **une scène signature** à chaque personnage :

| Personnage | Arc I | Arc II | Arc III | Arc IV |
|---|---|---|---|---|
| Guerrier nain | Le terrier de Kullerklang | Le tombeau de Bodvar | Le cairn de Runvid | Les ponts de Leafelli |
| Rôdeur | La piste de Sola | La forêt des Loups | La mine gobeline | Les passages de la mer |
| Colon | Les morsures de troll | Les engelures | La fille morte | Le torrent empoisonné |
| Barde | Le malentendu de la « Princesse » | La chanson d'Aelda | Herlaug et les énigmes | La fête de Jorda |
| Arpenteur | La peur des trolls | Le pacte de Bodvar | Le temple des Chevaliers-dragons | Vaeromar et la Corne |

### 9.4 Absences et mort

- **Absence** : le personnage est « de garde », « blessé », ou « parti en
  éclaireur ». Ne pas pénaliser les PA.
- **Mort** : Trudvang est mortel. Proposer un **dernier souffle**, une rançon,
  ou un retour par Dimhall/Himlhall plutôt qu'une mort sèche. Un personnage mort
  peut revenir comme PNJ ou comme souvenir.
- **Remplacement** : prévoir une réserve de PNJ jouables (un jeune hirdman de
  Grymslante, un chasseur du Vildland, un pèlerin elfe de Soj).
- **Le deuil** : après la mort d'un PJ, prendre cinq minutes pour une scène de
  deuil. La campagne parle de mémoire ; ne pas passer à la suite trop vite.

### 9.5 Sécurité émotionnelle

Le corpus de base contient :

- **enlèvement d'une jeune fille** (*Enlevée par les trolls*) → traiter Sola comme
  une personne, pas comme un objet ; pas de violence graphique ;
- **enlèvement de jeunes femmes** (*La Corne des elfes*) → donner de l'agence
  aux victimes ; Yllwi et Allwa ne sont pas des prix ;
- **morts d'enfants** (*Frostbitten*, *Cœur sauvage*) → suggérer, ne pas décrire ;
- **body horror** (*Frostbitten*, *Cœur sauvage*, *La Corne des elfes*) →
  décrire les sensations, pas les chairs ;
- **araignées géantes** (*La Corne des elfes*) → vérifier les phobies avant
  l'arc IV ;
- **sacrifice** (*La Corne des elfes*) → annoncer la possibilité, laisser les
  joueurs choisir ;
- **esclavage** (*Enlevée par les trolls*) → mentionner, ne pas jouer ;
- **guerre de clan** (*Frostbitten*) → ellipse sur les civils.

Utiliser une **ligne/voile** en début de campagne et la rappeler avant chaque
arc sombre. Prévoir un signal de pause anonyme (une carte, un mot, un geste) et
un débriefing après chaque arc.

---

## 10. PNJ récurrents

| PNJ | Rôle | Première apparition | Réapparitions |
|---|---|---|---|
| **Grisebo** | Marchand stormlander, commanditaire | Arc I (Vretekalt/Grymslante) | Arc II (lettre), Arc III, Arc IV, épilogue |
| **Magne** | Fermier de Vretekalt, père de Sola | Arc I | Épilogue |
| **Sola** | Fille de Magne, sauvée | Arc I | Épilogue (si les PJ reviennent) |
| **Oyvind** | Chasseur du Vildland | Arc II | Mort ; souvenir |
| **Hymir** | Aînée de Jagersheim | Arc II | Arc II, épilogue |
| **Baal Wulfr** | Seigneur du clan Wulfr | Arc II | Arc II |
| **Elsa Wulfr** | Épouse de Baal, dame du clan ; meurt à Morginhall | Arc II | Arc II |
| **Torkil Wulfr** | Second de Baal | Arc II | Arc II |
| **Eskild** | Père d'Elsa, traditionaliste | Arc II | Arc II |
| **Arkigstaal** | Chasseur en chef de Jagersheim | Arc II | Arc II |
| **Aelda** | La Dame blanche | Arc II | Arc II |
| **Bodvar Bjorki** | Roi maudit | Arc II | Arc II |
| **Remlaug Torolv** | Marchand de Grymslante | Arc III | Arc III, épilogue |
| **Kirjonti** | Elfe gardien de la Pierre des Sagas | Arc III | Mort ; souvenir |
| **Timil** | Nain de Vildhjarta | Arc III | Arc III, possible épilogue |
| **Herlaug** | Forgeron de Vildhjarta | Arc III | Arc III |
| **Kvaler** | Corbeau/trickster | Arc III | Arc III, possible interlude |
| **Vidar Lodbroke** | Guerrier pétrifié | Arc III | Arc III |
| **Arthyll Naom** | Chef d'Ywol | Arc IV | Arc IV |
| **Yllwi Naom** | Fille d'Arthyll | Arc IV | Arc IV, épilogue |
| **Vaeromar** | Elfe des étoiles, tisseur de vitner | Arc IV | Arc IV ; mort |
| **Jonis Daal** | Commandante des gardes d'Ywol | Arc IV | Arc IV |
| **Aerdos Liw** | Tenancier du *Poisson jaune qui bâille* | Arc IV | Arc IV |
| **Eirik Noi** | Ealdorman d'Ywol | Arc IV | Arc IV |
| **Allwa** | Captive dans la grotte des araignées | Arc IV | Arc IV |
| **Ihssirguul** | Démon de Leafelli | Arc IV | Arc IV |
| **Ymenos** | Géant d'Ymradas | Arc IV | Arc IV |

**PNJ de transition.** Si la table veut un visage récurrent entre les arcs,
utiliser **Grisebo** ou **Sola** plutôt que d'inventer un nouveau patron. Sola,
si elle survit, peut devenir hirdman et accompagner le groupe dans un interlude.

---

## 11. Matériel et préparation

### 11.1 À imprimer

- Les quatre scénarios de base (usage personnel).
- Les cartes : Jukahäll/Vretekalt, Jagersheim/Morginhall/Holghold/Icepeak,
  Grymslante/Vildhjarta, Ywol/Ymradas/Leafelli.
- Les fiches de PNJ des quatre arcs.
- Les aide-mémoire : le serment, les quatre énigmes, l'horloge de givre, les
  sites de Vildhjarta, les factions du Vildland, les salles de Leafelli.
- Les interludes suédois que vous comptez jouer.

### 11.2 À préparer

- **Une carte de campagne** : Ejdland, Vildland, Soj, avec les routes et les
  saisons.
- **Une roue des saisons** : quatre cases, une par arc.
- **Un tableau de PA** : personnage, PA totaux, PA dépensés, prochain achat.
- **Un carnet de dettes** : qui doit quoi à qui.
- **Un journal de saga** : une phrase par séance.
- **Un tableau des énigmes** : quatre cases minimum, six pour la version longue.
- **Une horloge de givre** : quatre stades, avec un repère visuel.
- **Un serment écrit** : la formule des cinq clauses, à faire signer ou à lire.

### 11.3 Objets de table

- **Une pierre** pour la Pierre des Sagas : lisse, grise, de la taille d'un œuf.
- **Une corne** pour la Corne d'Ymenos : un cor de chasse, un coquillage, ou un
  simple objet en bois.
- **Un anneau ou un sceau** pour le serment de Grisebo.
- **Une carte de Vildhjarta** avec les sites visités, à remplir au fur et à
  mesure.
- **Un sablier** pour l'horloge de givre ou les rituels.

### 11.4 Musique et ambiance

- **Arc I** : percussions basses, sons de ferme, vent dans les feuilles, grognements.
- **Arc II** : vent, loups, cordes graves, battements de cœur, silence.
- **Arc III** : forêt, corbeaux, chuchotements, cordes désaccordées, pluie.
- **Arc IV** : mer, chœurs elfiques, cors profonds, silence sacré.
- **Épilogue** : une mélodie simple, un instrument seul, le vent qui tombe.

---

## 12. Journal de campagne

### 12.1 Ce qu'il faut noter

- **Le serment** : les cinq clauses, et laquelle a été trahie ou honorée.
- **Les PA** : totaux, achats, prochains paliers.
- **Les dettes** : qui doit quoi à qui, et qui s'en souvient.
- **Les morts** : nom, lieu, dernière parole, sépulture.
- **Les reliques** : la Pierre des Sagas, la Corne d'Ymenos, l'Amulette du Chaos
  (si les personnages la gardent), les objets de Runvid.
- **Les énigmes** : les quatre réponses, les sites visités, les sites manqués.
- **La malédiction** : les stades de givre, les remèdes, les nuits sans sommeil.
- **Les PNJ** : qui a été sauvé, qui a été laissé, qui se souvient.

### 12.2 Questions de fin d'arc

À poser aux joueurs après chaque arc :

1. Qu'est-ce que votre personnage a appris sur le monde ?
2. Qui lui doit quelque chose, et à qui doit-il quelque chose ?
3. Qu'est-ce qu'il a laissé derrière lui ?
4. Qu'est-ce qu'il ne fera plus jamais ?
5. Quel est son prochain serment ?

Les réponses alimentent l'épilogue et peuvent créer des accroches pour les
interludes.

### 12.3 Épilogue

L'épilogue « Le cinquième serment » peut prendre trois formes :

- **Le retour** : les personnages rentrent à Grymslante, rendent les comptes,
  retrouvent Grisebo et les PNJ survivants.
- **La transmission** : ils confient la Pierre des Sagas et la Corne à un temple,
  à un peuple, ou à un jeune successeur.
- **La route** : ils repartent. La dernière image est la route, la saison qui
  tourne, et la phrase de Grisebo : « Il y aura d'autres histoires. »

---

## Annexe A — Tableau récapitulatif

| Scénario | Pages | Joueurs | Durée | Ton | Prérequis | Difficulté | PA |
|---|---|---:|---|---|---|---|---:|
| *Enlevée par les trolls* | 337–350 | 3–5 | 2–4 h / 2 séances | Conte rural, humour noir | Aucun | Faible | 25–30 |
| *Frostbitten* | 6–62 (impr.) | 2–6 (idéal 4–5) | 6–8 séances | Saga hivernale, malédiction | Après 1–2 aventures | Moyenne-élevée | 60–80 |
| *Cœur sauvage* | 27–87 | 4–6 | 8–12 séances | Forêt vivante, horreur onirique | Personnages expérimentés | Élevée | 140–180 |
| *La Corne des elfes* | 89–143 | 3–5 | 6–10 séances | Épopée elfique, tragédie | Personnages aguerris | Très élevée | 100–140 |

## Annexe B — Ce qu'il faut lire avant de mener

1. **Lire intégralement** le scénario de l'arc en cours avant de le mener.
   Idéalement, lire les quatre scénarios de base avant l'arc I pour connaître
   les transitions.
2. **Lire en survol** les interludes suédois que vous comptez utiliser.
3. **Préparer les fiches de PNJ** des quatre arcs avant de commencer.
4. **Vérifier les règles** de combat, de soins, de froid, de peur, de poison et
   de voyage dans le *Livre des règles*.
5. **Relire le glossaire** (`lang/GLOSSARY.md`) pour garder la terminologie
   française : Arpenteur des brumes, Barde, Colon, Guerrier, Malfrat, Rôdeur,
   Tisseur de vitner, Divertissement, Futhark.
6. **Vérifier les noms propres** : les noms anglais de *Frostbitten* peuvent
   être conservés ou francisés ; les noms français des *Contes de Trudvang* sont
   la référence pour *Cœur sauvage* et *La Corne des elfes*.

## Annexe C — Sources et crédits

- *Enlevée par les trolls* : *Trudvang Chronicles — Livre des règles*, édition
  française, chapitre 11, p. 337–350. Riotminds / Black Book Éditions.
- *Cœur sauvage* et *La Corne des elfes* : *Contes de Trudvang*, édition
  française, chapitres 2 et 3, p. 27–143. Textes de Theodore Bergqvist, Max
  Herngren et Magnus Malmberg, Riotminds / Black Book Éditions.
- *Frostbitten* : PDF officiel anglais, Max Herngren, Riotminds.
- *The Elven Horn* : version originale anglaise de *La Corne des elfes*.
- *Wildheart* : version anglaise de *Cœur sauvage*.
- *Stenhjärta*, *Drakskugga*, *Mardröm*, *Carnags återkomst*, *Svartgom*,
  *Skogshäxan*, *Vargtimmen*, *Fågelskogens främlingar* : Medusa Games,
  Jörgen Karlsson et Franz Ung. Scénarios de fan gratuits, usage personnel.
- *Spöket på Tingeltang* : J.H.J. Karlsson. Scénario de fan gratuit.
- *Drakar och Demoner Trudvang* : Riotminds.
- Terminologie française : *Trudvang Chronicles — Livre des règles*, édition
  française, et `lang/GLOSSARY.md`.
- Les PDF sont conservés dans le dépôt privé `game doc`, dossiers `fr/`, `se/`
  et `markdown/`. Ne jamais les commit dans le dépôt public.

## Annexe D — Ce qu'il ne faut pas faire

- **Ne pas présenter les suppléments payants comme gratuits.** *Contes de
  Trudvang*, *Snowsaga*, *Curse of Runes*, *Runes of Memory*, *The Elven Road*
  et *La Morsure du froid* sont payants.
- **Ne pas recommander Scribd, PDFCoffee, idoc.pub ou spawningpool.** Ces sites
  hébergent des copies non autorisées.
- **Ne pas redistribuer les modules suédois traduits.** Usage personnel
  uniquement.
- **Ne pas faire des modules longs des interludes.** *Stenhjärta*,
  *Drakskugga*, *Mardröm* et *Carnags återkomst* sont des campagnes.
- **Ne pas forcer le cadre de Grisebo.** Si la table n'aime pas, les quatre
  scénarios fonctionnent sans lui.
- **Ne pas oublier la sécurité émotionnelle.** Les quatre arcs contiennent des
  enlèvements, des morts d'enfants, du body horror et un sacrifice.

---

*Document de campagne — version 2.0, refonte des 5–6 novembre 2026. À relire après
chaque arc et à mettre à jour avec les choix de la table. L'ancienne version
(centrée sur les neuf scénarios suédois) reste consultable dans l'historique Git
du dépôt.*
