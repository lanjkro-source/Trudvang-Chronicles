// Baked creature reference for NPC imports (tracked runtime source; game doc/ is NOT shipped).
//
// Sources (read-only, private nested repo): "game doc/fr/trudvang-creatures-fr.json" (74 creatures)
// and "game doc/fr/trudvang-feats-fr.json" (149 feats). Only the minimal set needed by the
// 8 starter NPCs is baked here: 21 feat summaries (name + French description as-is) and the
// 8 creatures' stats. Baking all 149 feats / the whole 74-creature file was rejected to avoid
// shipping the full proprietary bestiary in the public system.
//
// Starter mapping (French names vs nameKeys matched by hand): Galtir->Galtir,
// GiantSnake->Serpent géant, GiantSpider->Araignée tisseuse (Toile d'attaque is hers; the
// hypnotic sister carries Regard paralysant instead), Gryphon->Griffon, NightUlm->Nattulm,
// ThornBeast->Bête épineuse, TrollBull->Minokks (traits 4/4 + Charge + horned bull matches;
// TrollHeart renders "Cœur de minokks"), Warg->Warg.
//
// Body values are the long-standing starter values, verified inside each creature's [min,max]
// range; combat values likewise predate this file (no single source field). The extended
// bestiary fields (type, move, initiativeBase, bodyMin/bodyMax, armor, description résumé) and the
// book skill trees (skillTree: flat name/value/kind rows in book order) are
// copied byte-identically from the same JSON. Feat descriptions
// are French rule quotations as-is: intentionally NOT routed through lang/*.json, so they stay
// out of lang/GLOSSARY.md (same exclusion as TRUDVANG.Content.Power.*.Summary).
//
// To regenerate after a source edit, rerun the bake snippet kept in the commit history and
// mirror any value change into data/starter-content.json (actors carry the same data so new
// worlds are correct even before the importer runs).

export const CREATURE_FEAT_SUMMARIES = {
  "Attaque de saut": "<p>Lorsqu’un warg déclenche un combat, il saute sur sa proie et l’attaque en même temps avec sa morsure et ses griffes. L’attaque de saut implique que la bête bénéficie d’une attaque supplémentaire avec ses pattes et griffes arrière pendant ce tour de jeu (Griffes VC 10) sans dépenser de PC supplémentaire. Ceci vaut seulement pour le tour pendant lequel a lieu l’Attaque de saut.</p>",
  "Attaque des hauteurs (bête épineuse)": "<p>Pour effectuer avec succès une attaque des hauteurs, une bête épineuse doit réussir un test de compétence correspondant (VC 8). La force et la vitesse de la bête épineuse font partie intégrante de l’attaque et augmentent les dégâts infligés par la morsure à 2d10 (JO 7-10) +6 et les griffes à 2d10 (JO 8-10) +6. La bête épineuse peut lancer une attaque des hauteurs tous les 6 tours étant donné qu’il lui faut survoler la zone pendant au moins 5 tours.</p><p>Le joueur qui souhaite attaquer une bête épineuse en train d’effectuer une attaque aérienne subit un modificateur de -3 à toutes ses attaques. Cependant, il est plus facile de déterminer la cible de l’attaque de la bête épineuse ; la victime dispose donc d’un modificateur de +2 à la parade contre cette attaque.</p>",
  "Attaque des hauteurs (griffon)": "<p>Pour effectuer avec succès une attaque des hauteurs, un griffon doit réussir un test de compétence correspondant (VC 8). La force générée par la vitesse du griffon fait partie intégrante de l’attaque et augmente les dégâts infligés par les griffes à 2d10 (JO 9-10) +4. Le griffon peut lancer une attaque des hauteurs tous les quatre tours étant donné qu’il lui faut survoler la zone pendant au moins 3 tours.</p><p>Le joueur qui souhaite attaquer un griffon en train d’effectuer une attaque aérienne subit un modificateur de -3 à toutes ses attaques. Cependant, comme il est plus facile de déterminer la cible de l’attaque du griffon, la victime dispose d’un modificateur de +2 à la parade contre cette attaque.</p>",
  "Charge": "<p>Les minokks commencent leurs attaques par une charge. Ils baissent la tête et se précipitent droit sur leur victime pour lui infliger des dégâts et la renverser. En raison du poids du minokks, de sa grande vitesse et de ses cornes pointues, la charge inflige 2d10 (JO 9-10) points de dégâts. Une charge se résout en dépensant des PC pour le mouvement en plus de ceux destinés à l’attaque à l’arme naturelle (cornes).</p><p>La cible touchée par l’attaque doit réussir un test d’Agilité avec un malus de -5 pour garder l’équilibre. Une victime renversée par la charge doit faire un jet de situation avec une valeur de situation de 10 (en tenant compte du modificateur de Dextérité) pour éviter de lâcher les éventuels objets qu’elle tient en main.</p>",
  "Cocon de soie": "<p>L’araignée hypnotique comme l’araignée tisseuse ont la capacité d’envelopper leurs victimes dans des cocons de toile et de les suspendre par les pieds dans la forêt. Dès que l’araignée géante réussit à paralyser sa victime ou à la piéger dans sa toile, elle commence à l’envelopper dans un cocon, à condition qu’aucun autre élément n’attire son attention.</p><p>La création du cocon dure 1d10 + 10 tours de jeu. Une victime piégée qui cherche à se libérer doit faire trois tests de situation avec des valeurs de situation de 3, 7 et 11 (en appliquant le modificateur de Force) pour y parvenir. Il n’est pas nécessaire de réussir les tests de manière consécutive. Ceux-ci peuvent être séparés par des échecs. Cependant, les réussites doivent se produire dans l’ordre de valeurs de situation 3, 7 et 11.</p><p>Si la victime ne parvient pas à s’échapper, elle reste dans le cocon et risque de mourir de faim rapidement si elle n’est pas d’abord dévorée par l’araignée géante.</p>",
  "Constriction (serpent géant)": "<p>Si le serpent parvient à enserrer sa victime (valeur de compétence 10, à laquelle il faut appliquer le modificateur de Dextérité de la cible), il la piège dans son emprise. À chaque tour, la victime subit des dégâts équivalents au modificateur de dégâts du serpent (6 dans les caractéristiques ci-dessous), dont il faut déduire la valeur d’armure.</p><p>La cible peut se libérer uniquement en réussissant un test de situation avec une valeur de situation de 10 (en tenant compte du modificateur du trait de Force). Si le test de situation de la victime échoue, elle peut essayer de se libérer à nouveau une fois par tour de jeu. Cependant, à chaque nouveau tour s’applique un modificateur cumulatif de -1 (trois tours de jeu plus tard, la valeur de situation pour se libérer est donc de 7). Chaque personne qui tente d’aider la victime ajoute également un modificateur de +1 à la valeur de situation. Si les personnages venus en aide ont une force exceptionnelle, leur bonus de Force vient également s’ajouter au test de compétence.</p><p>Chaque tour de combat que le serpent passe à enserrer sa victime l’empêche d’effectuer une autre action. Le serpent peut choisir de mordre un autre adversaire au lieu de maintenir son emprise sur sa victime. Si c’est le cas, celle-ci reste piégée par le serpent mais ne subit pas de dégât pendant ce tour.</p>",
  "Cœur de minokks": "<p>Manger le cœur d’un taureau troll emplit de courage et de force intérieure. Le personnage qui en bénéficie perd 1d10 (JO 10) points de peur, se sent plus vivace et devient plus protecteur envers ses amis. Si un ennemi menace l’un d’entre eux, il existe un risque que le consommateur du cœur le charge et l’attaque. Ce dernier doit alors faire un test de situation avec une valeur de situation de 10 (en tenant compte du modificateur de Psychisme) pour éviter de céder à la pulsion de charger l’ennemi.</p>",
  "Hylja (serpent géant)": "<p>Certains serpents (surtout le serpent lacustre) ont la capacité de changer de couleur pour imiter leur environnement. Le serpent s’adapte à son milieu à tel point qu’il est nécessaire de réussir un test d’Arts des ombres avec un modificateur de -10 pour repérer le serpent s’il reste immobile. Si le serpent bouge, le modificateur passe alors à -5.</p>",
  "Infection des rugtannes": "<p>À chaque tour pendant lequel un ulm nocturne boit le sang d’une victime, il y a un risque que celle-ci contracte une maladie rare. Après deux tours de jeu, le risque s’élève à 1 sur 20 (obtention d’un 20 sur 1d20). Après quatre tours de jeu, le risque s’élève à 2 sur 20 (obtention de 19 ou 20 sur 1d20). Pour une raison inexpliquée, la maladie affecte uniquement les humains.</p><p>Une victime infectée par la maladie se transformera en rugtanne (un étrange mélange d’humain et de nattulm) dans un délai de 2d3 jours. Les rugtannes vivent uniquement la nuit. En cas d’exposition à la lumière du jour, ils succombent instantanément au choc des rayons solaires. Toutes les cinq nuits, ils doivent se nourrir du sang d’une autre créature au sang chaud. La morsure et le vampirisme fonctionnent de la même manière pour le rugtanne que pour le nattulm.</p><p>Un rugtanne peut vivre jusqu’à quatre fois plus longtemps qu’un humain, ce qui lui donne bien plus de temps pour apprendre de nouvelles facultés. D’après certains mythes, un rugtanne est capable d’acquérir de formidables pouvoirs et aptitudes magiques, comme la transformation en chauve-souris ou en étalon noir. Tout ceci n’est que superstition. Cependant, lorsque de puissants magiciens sont transformés en rugtannes, ils sont toujours en mesure d’utiliser leur magie et deviennent ainsi d’horribles suceurs de sang dotés de pouvoirs rarement égalés.</p><p>Lorsqu’un personnage joueur devient un rugtanne, les caractéristiques suivantes sont modifiées :</p><ul><li>Les traits Constitution, Psychisme, Force et Dextérité augmentent de deux niveaux (de -2 à 0 ou de +1 à +4 par exemple). Si le personnage est déjà au niveau maximum dans un ou plusieurs de ces traits, le modificateur bénéficie d’un bonus de +4 (le Trait passe donc à +8).</li><li>Le rugtanne obtient une valeur de protection de 1 du fait d’une protection naturelle (sa peau).</li><li>Le rugtanne gagne la capacité Vision dans le noir et peut voir dans le noir complet comme en plein jour jusqu’à 10 mètres, après quoi la vision diminue graduellement avant de s’estomper complètement à 60 mètres environ.</li><li>Le rugtanne subit les dégâts de la même manière qu’avant sa transformation, et reste donc mortel comme lorsqu’il était humain, mais ses points de santé sont modifiés en fonction de ses nouveaux traits.</li></ul>",
  "Intrépide": "<p>Les galtirs et les skogstrolls ne ressentent aucune peur. Les skogstrolls n’effectuent jamais de test de peur, que le phénomène qui devrait la provoquer soit naturel ou non.</p><p>Cette absence de peur les rend particulièrement obstinés au combat : les galtirs, une fois engagés, combattent jusqu’à leur mort ou celle de leur ennemi. Les skogstrolls attaquent la victime qu’ils ont choisie jusqu’à ce qu’elle meure, puis essaient de dépouiller son cadavre avant de choisir un autre adversaire. Leur comportement reste lié à leur espèce, mais leur immunité à la peur est techniquement identique.</p>",
  "Maladie du warg (warg)": "<p>Les wargs sont porteurs d’une maladie appelée « maladie des wargs ». Elle est véhiculée par la morsure et ses victimes courent le risque de devenir des wargs garous (décrits dans les caractéristiques ci-après). Le risque d’infection diffère en fonction de l’espèce de warg à l’origine de la morsure. Effectuez un test d’infection pour chaque warg, peu importe le nombre de morsures sur la même victime (en tenant compte du modificateur de Constitution). La morsure est considérée comme infectieuse si le résultat du test est compris dans les fourchettes indiquées dans le tableau suivant.</p><p>La maladie reste dormante dans le corps de la victime, telle une malédiction qui ne disparaît jamais, mais gagne au contraire en sévérité. La plupart du temps, elle se diffuse dans le sang sans affecter la créature, mais se déclenche parfois pour une raison précise. Habituellement, on compte parmi les déclencheurs l’étrange attraction de la lune, mais parfois, une grande peur, un stress inhabituel ou une faim extrême suffisent pour que la maladie se déclare dans le corps de la victime. Le MJ est totalement libre de décider du moment où la maladie se déclenche, de préférence pendant un moment dramatique qui rendra l’histoire mémorable.</p><p>Risque d’infection propre à cette créature : 1-2 sur 1d20, en tenant compte du modificateur de Constitution. Le loup ordinaire ne transmet pas cette maladie.</p><p>Lorsque la maladie des wargs se déclare chez une victime mordue par un warg, celle-ci peut se transformer en une créature mi-humaine, mi-warg, un hybride terrifiant qui partage les caractéristiques des deux espèces. Son visage est couvert de fourrure et ressemble à la gueule d’un warg. D’impressionnantes griffes poussent sur ses mains et ses pieds tandis que des crocs aiguisés se développent dans sa bouche. Certains wargs garous préfèrent se déplacer sur quatre pattes alors que d’autres marchent comme des humains.</p><p>Chaque fois que la lune s’illumine dans le ciel (sans nécessairement être visible), la maladie se déclare et entraîne la transformation. La victime doit alors faire un test de situation avec une valeur de situation de 6 (en tenant compte des modificateurs de Psychisme et de Constitution) pour résister à la maladie et éviter la transformation.</p><p>Si la créature affectée voit la pleine lune, la valeur de situation est réduite de 4. Les personnages affichant un Psychisme négatif courent le risque de voir la maladie se déclarer dans des situations stressantes. Lorsqu’elle se trouve dans une telle situation, la victime doit faire un test de situation avec une valeur de situation de 8 (en tenant compte du modificateur de Psychisme) pour résister à la transformation.</p><p>Transformées en wargs garous, les victimes sont incapables d’utiliser les capacités et traits dont elles disposent en temps normal. Elles perdent la faculté de raisonner et se trouvent soumises à un instinct carnassier, tels des wargs affamés. Tout comme un warg, un warg garou peut propager la maladie. Chaque créature humanoïde mordue par un warg garou présente un risque de contracter la maladie (résultat de 1 à 3 sur 1d20, en tenant compte du modificateur de Constitution). Contrairement aux effets de la morsure des wargs, il y a un faible risque (1 sur 1d20) pour que la victime infectée par un warg garou soit dans l’incapacité de revenir à sa forme d’origine après sa première transformation. Ces bêtes vivant constamment sous la forme d’un warg garou ne transmettent pas la maladie, mais ne sont pas moins craintes pour autant.</p><p>Les traits des wargs garous sont modifiés comme suit :</p><ul><li>Force +4 aux tests de situation et aux dégâts (pour un total maximum de +6)</li><li>Dextérité +4 aux tests de situation et au mouvement (pour un total maximum de +6)</li><li>Psychisme -2 aux tests de situation</li><li>Constitution +6 aux tests de situation et aux points de santé (pour un total maximum de +8)</li><li>Intelligence -4 aux tests de situation (pour un total maximum de -6)</li></ul><p>Autres aptitudes :</p><ul><li>Protection naturelle : VC 2 (peau)</li><li>Morsure : 1d10 (JO 8-10) points de dégâts ; AA : 1</li><li>Griffes : 1d10 (JO 9-10) points de dégâts ; AA : 2</li><li>VC (Combat, Bagarre) +2</li><li>Compétences :</li><li>Agilité : Contrôle corporel (Saut, escalade et équilibre) +6</li><li>Nature : Expérience de la chasse (Chasser et pêcher, Pister) +6</li><li>Vision nocturne : peut voir sous une faible luminosité (lumière des étoiles, de la lune, de torches, etc.) comme en plein jour.</li></ul><table><thead><tr><th>Type de warg</th><th>Résultat du d20 infectieux</th></tr></thead><tbody><tr><td>Loup</td><td>Aucun</td></tr><tr><td>Warg</td><td>1 à 2</td></tr><tr><td>Skoll</td><td>1 à 3</td></tr><tr><td>Garm</td><td>1 à 5</td></tr></tbody></table>",
  "Mugissement profond": "<p>Au cœur du combat, les galtirs émettent souvent un cri aussi longtemps qu’ils le peuvent, le mugissement profond. Pour les humains, celui-ci n’aura rien de particulier, mais il contient un son très grave que ni eux ni les créatures similaires ne peuvent entendre. Ce mugissement est audible par les autres galtirs dans un très vaste périmètre. Plus les galtirs sont nombreux à émettre le mugissement de concert, plus le son porte. Les galtirs de la même tribu, et parfois d’autres tribus, se précipiteront à la rescousse en répondant de leur propre mugissement. Lorsque de nombreux galtirs émettent ce mugissement ensemble, ils peuvent former une horde imposante qui attaquera tout ce qui passe trop près d’eux.</p>",
  "Puanteur terrifiante": "<p>Les organes internes d’une bête épineuse subissent un processus constant de décomposition à cause des fâcheux effets de la tornrot. Cela signifie que ce grand lézard ailé traîne derrière lui une âcre pestilence de chair morte et de pourrissement. Un humain normal doté d’un sens de l’odorat normal peut sentir l’odeur à une distance de 50 mètres. Quiconque s’approche à moins de 5 mètres de la bête subit 1d10 (JO 9-10) points de peur à cause de l’odeur. Ceci ne s’applique pas aux dompteurs et aux cavaliers aguerris, habitués à l’odeur en raison du temps passé avec la bête.</p>",
  "Rapide": "<p>La créature coordonne ses membres mieux que d’autres animaux et peut, en combat, se déplacer jusqu’à deux fois plus vite que ne le permet habituellement sa taille, tout en gardant le contrôle de son environnement. Elle ne peut jamais dépasser son mouvement maximum par tour de jeu.</p><p>Le bestiaire applique ce trait aux animaux signalés « Rapide » dans la table des animaux, ainsi qu’aux loups, wargs, skolls, garms et braskelwurms. Loups, wargs et skolls se déplacent de 4 m pour 2 PC ; les garms de Taille 3 se déplacent de 12 m pour 2 PC ; le braskelwurm de 4 m pour 2 PC. Pour les autres animaux, les valeurs du mouvement par 2 PC et du maximum sont celles de leur ligne dans la table des animaux.</p>",
  "Regard paralysant (serpent géant)": "<p>Certains serpents (surtout le serpent des forêts) ont la capacité de paralyser leurs victimes avec leur regard.</p><p>Le serpent doit tout d’abord obtenir l’attention de sa victime afin que leurs regards se croisent. Si le serpent réussit, la victime doit faire un test de situation avec une valeur de situation de 6 (le modificateur de Psychisme s’applique) pour éviter la paralysie pendant 1d3 tours, qui l’empêche de faire quoi que ce soit.</p><p>Pendant le tour au cours duquel le serpent utilise son attaque de regard paralysant, il ne peut effectuer aucune autre action. La victime de la constriction reste piégée mais ne subit aucun dégât. Le serpent ne perd qu’un seul tour ; si son regard est efficace, il peut agir au cours des tours suivants alors que sa victime est paralysée.</p><p>Si le serpent tente d’enserrer une victime paralysée, il réussit automatiquement et la victime n’a aucune chance de s’en défaire tant qu’elle est paralysée.</p>",
  "Salive anesthésiante": "<p>Un nattulm attaque rarement des créatures complètement lucides et préfère qu’elles soient endormies ou tellement étourdies qu’elles n’ont pas conscience de subir une attaque. Grâce à sa dextérité élevée, l’ulm nocturne se déplace furtivement vers une victime endormie et crache sa salive sur le cou de sa cible. Après 2d6 tours de jeu, la peau devient si insensible que la victime devra faire un test de situation avec une valeur de situation de 8 (en intégrant le modificateur de Perception) pour se rendre compte qu’elle se fait mordre (ce test est celui décrit dans la section « Suceur de sang », page précédente). Dans d’autres situations, il revient au MJ de décider de la valeur de situation ou du fait que la victime perçoit la salive ou l’attaque.</p>",
  "Suceur de sang": "<p>Un nattulm peut approcher une victime endormie et tenter d’aspirer son sang. Cette capacité s’utilise en dehors des combats.</p><p>La créature prend 5 tours de jeu pour boire du sang. Au premier tour, la victime subit 1d3 points de dégâts de morsure. Au cours des 4 tours suivants, elle subit 1d6 points de dégâts par tour en raison de la perte de sang. À chaque tour de jeu, la victime a la possibilité de se réveiller et de surprendre l’ulm nocturne en réussissant un test de situation avec une valeur de situation de 8 (en intégrant le modificateur de Perception). Si elle découvre le nattulm, celui-ci prend immédiatement la fuite. Un nattulm combat uniquement s’il est acculé. Dans ce cas, il utilise sa morsure et ses griffes.</p><p>Parfois, plusieurs ulms nocturnes boivent le sang d’une même créature. Si la victime ne se réveille pas au cours des 5 tours de jeu décrits ci-dessus, elle subit un malus de -2 au prochain test de situation correspondant au suceur de sang suivant.</p>",
  "Toile d’attaque": "<p>En plus de sa morsure, l’araignée tisseuse attaque avec sa toile collante en faisant un test avec une VC 9. Si l’araignée réussit son attaque, chaque personnage situé dans une zone d’approximativement 8 mètres de long sur 3 mètres de large sera pris dans la toile. Les victimes doivent faire un test de situation avec une valeur de situation de 7 (le modificateur de Force s’applique) pour se libérer de la toile. Les araignées tisseuses peuvent utiliser cette attaque trois fois par jour.</p><p>La toile possède des aptitudes légendaires. Il est possible de fabriquer des cordes tressées ou des cordes d’arc en soie à partir de cette toile. Une corde tressée à partir de la toile d’une araignée tisseuse géante est quatre fois plus légère qu’une corde normale et supporte le double de charge. Une corde d’arc de la même matière augmente les dégâts infligés par l’arc, ce qui se traduit par l’augmentation des chances de jet ouvert de 1.</p><p>Tresser une corde peut prendre plus d’un mois. Confectionner une corde d’arc nécessite deux à trois mois de travail. Les cordes sont toujours noires. On dit que certains des arcs elfiques les plus connus de Trudvang, comme Verisias, le dragon d’argent, comportent une corde fabriquée à partir de la toile d’attaque d’une araignée tisseuse géante.</p>",
  "Vision dans le noir": "<p>La créature voit sans aucune source de lumière, y compris dans l’obscurité totale, comme en plein jour. Les descriptions de ces créatures ne fixent pas de limite de portée propre à ce pouvoir.</p><p>L’absence de lumière ne réduit donc pas la vision, mais les autres obstacles et conditions de visibilité restent applicables. Le draugr voit aussi loin que le lui permettent les conditions, quel que soit l’environnement. La capacité Vue du diser précise séparément son comportement face au brouillard, à la fumée et aux effets magiques ; Vision dans le noir seule ne confère pas ces propriétés.</p>",
  "Vision dans le noir (10 à 60 m)": "<p>Un griffon voit à 10 mètres dans l’obscurité totale comme s’il était en plein jour. Cette vision diminue graduellement avec la distance et porte jusqu’à 60 mètres environ.</p>",
  "Vision nocturne": "<p>La créature voit dans les environnements faiblement éclairés comme en plein jour : lumière des étoiles, de la lune ou d’une torche, par exemple. Cette capacité nécessite donc une source lumineuse, même faible ; elle ne permet pas de voir dans le noir total.</p><p>Les wargs concernés voient dans ces mêmes conditions. Les variantes de ce pouvoir décrites pour les bêtes épineuses, beinbaiters, fées, nymphes, skjulds, firdtursirs, logrjotuns, muspeljotuns, fjoltrolls, gråtrolls, hrimtrolls et skogstrolls ont le même effet technique.</p>"
};

export const CREATURE_NPC_DATA = {
  "TRUDVANG.Content.Actor.Galtir": {
    "creature": "Galtir",
    "type": "humanoid",
    "move": [
      {
        "mode": "terrestre",
        "distance": "1 m",
        "max": "8 m"
      }
    ],
    "initiativeBase": -1,
    "bodyMin": 21,
    "bodyMax": 26,
    "armor": [
      {
        "name": "Cuir",
        "protection": 2,
        "initiative": -1
      }
    ],
    "description": "C'est un humanoïde un peu plus petit qu'un nain. Son corps trapu et puissant ressemble à un croisement étrange entre un petit troll et un sanglier. Sa tête porcine est armée d'une morsure et de défenses saillantes. Ses membres courts et résilients portent une musculature prompte à la violence. Sa peau dure s'accompagne d'un cuir porté en armure. Son allure obstinée de guerrier des bois le rend immédiatement reconnaissable.",
    "traits": {
      "dexterity": -1,
      "intelligence": -4,
      "strength": 2
    },
    "skills": {
      "care": 5,
      "entertainment": 3,
      "fighting": 4,
      "knowledge": 3,
      "shadowArts": 7
    },
    "skillTree": [
        {"name": "Savoir-faire", "value": 5, "kind": "skill"},
        {"name": "Divertissement", "value": 3, "kind": "skill"},
        {"name": "Combat", "value": 4, "kind": "skill"},
        {"name": "Combat armé", "value": 1, "kind": "discipline"},
        {"name": "Armes légères à une main", "value": 1, "kind": "specialty"},
        {"name": "Connaissances", "value": 3, "kind": "skill"},
        {"name": "Langage", "value": 1, "kind": "discipline"},
        {"name": "Langue maternelle (bastjumal)", "value": 1, "kind": "specialty"},
        {"name": "Arts des ombres", "value": 7, "kind": "skill"},
        {"name": "Discrétion", "value": 1, "kind": "discipline"},
        {"name": "Camouflage et dissimulation", "value": 3, "kind": "specialty"}
      ],
    "body": 23,
    "combat": 10,
    "naturalArmor": 0,
    "fearFactor": "1d5",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 8
        },
        {
          "attack": "Défenses",
          "value": 6
        }
      ],
      [
        {
          "attack": "Arme",
          "value": 7
        }
      ]
    ],
    "feats": [
      "Mugissement profond",
      "Intrépide"
    ]
  },
  "TRUDVANG.Content.Actor.GiantSnake": {
    "creature": "Serpent géant",
    "type": "other",
    "move": [
      {
        "mode": "terrestre",
        "distance": "3 m",
        "max": "24 m"
      },
      {
        "mode": "nage",
        "distance": "3 m",
        "max": "24 m"
      }
    ],
    "initiativeBase": -4,
    "bodyMin": 84,
    "bodyMax": 105,
    "armor": [],
    "description": "C'est un serpent colossal au corps allongé qui serpente entre les arbres, les rochers et les eaux. Sa grande tête se relève très au-dessus du sol et son odorat est excellent. Sa peau varie selon la variété : jaune clair presque albinos pour le serpent des forêts, écailles noires aux yeux couleur d'ambre luisante pour le serpent des cavernes, écailles vert foncé tachées de brun comme celles des poissons pour le serpent lacustre. Excellent grimpeur et, pour certaines variétés, excellent nageur, il laisse dépasser son nez de la surface pour respirer. Sa gueule puissante complète son corps constricteur.",
    "traits": {},
    "skills": {
      "fighting": 7
    },
    "skillTree": [
        {"name": "Combat", "value": 7, "kind": "skill"}
      ],
    "body": 95,
    "combat": 18,
    "naturalArmor": 2,
    "fearFactor": "1d10 (JO 10)",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 10
        },
        {
          "attack": "Morsure",
          "value": 8
        }
      ]
    ],
    "feats": [
      "Constriction (serpent géant)",
      "Hylja (serpent géant)",
      "Regard paralysant (serpent géant)"
    ]
  },
  "TRUDVANG.Content.Actor.GiantSpider": {
    "creature": "Araignée tisseuse",
    "type": "other",
    "move": [
      {
        "mode": "terrestre",
        "distance": "10 m",
        "max": "50 m"
      }
    ],
    "initiativeBase": -4,
    "bodyMin": 84,
    "bodyMax": 105,
    "armor": [],
    "description": "C'est une araignée géante solitaire au corps massif tapie dans l'ombre des forêts. Sa tête porte plus d'une paire d'yeux et d'énormes mandibules dont elle se sert pour attaquer. Ses longues pattes comprennent des pattes empaleuses acérées. Son corps est couvert d'une armure déjà solide qui se transforme avec l'âge en une carapace presque comme de la peau de pierre. Une masse organique sécrétée à travers des pores enduit cette carapace pour servir de défense supplémentaire. Les vieux spécimens portent souvent de la mousse et des champignons qui poussent sur leur dos.",
    "traits": {},
    "skills": {
      "fighting": 8
    },
    "skillTree": [
        {"name": "Combat", "value": 8, "kind": "skill"}
      ],
    "body": 95,
    "combat": 26,
    "naturalArmor": 2,
    "fearFactor": "1d10 (JO 8-10)",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 8
        },
        {
          "attack": "Patte empaleuse",
          "value": 10
        },
        {
          "attack": "Patte empaleuse",
          "value": 8
        }
      ]
    ],
    "feats": [
      "Toile d’attaque",
      "Vision dans le noir",
      "Cocon de soie"
    ]
  },
  "TRUDVANG.Content.Actor.Gryphon": {
    "creature": "Griffon",
    "type": "winged quadruped",
    "move": [
      {
        "mode": "terrestre",
        "distance": "6 m",
        "max": "18 m"
      },
      {
        "mode": "vol",
        "distance": "6 m",
        "max": "36 m"
      }
    ],
    "initiativeBase": -2,
    "bodyMin": 78,
    "bodyMax": 96,
    "armor": [],
    "description": "C'est une bête puissante au corps de lynx, décrit aussi comme corps de warg, couvert de pelage. Sa tête, ses pattes avant et ses ailes sont celles d'un aigle. Son grand bec est aussi dur que du silex. Ses yeux distinguent de très haut dans le ciel les moindres détails d'une proie. Ses griffes géantes, semblables à des serres d'aigle, sont assez acérées pour se ficher profondément dans la chair. Ses belles plumes et son pelage coiffent une silhouette de grande envergure.",
    "traits": {},
    "skills": {
      "fighting": 6
    },
    "skillTree": [
        {"name": "Combat", "value": 6, "kind": "skill"}
      ],
    "body": 87,
    "combat": 20,
    "naturalArmor": 1,
    "fearFactor": "1d10 (JO 10)",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 8
        },
        {
          "attack": "Griffes",
          "value": 10
        },
        {
          "attack": "Griffes",
          "value": 8
        }
      ]
    ],
    "feats": [
      "Attaque des hauteurs (griffon)",
      "Vision dans le noir (10 à 60 m)"
    ]
  },
  "TRUDVANG.Content.Actor.NightUlm": {
    "creature": "Nattulm",
    "type": "winged humanoid",
    "move": [
      {
        "mode": "terrestre",
        "distance": "1 m",
        "max": "10 m"
      },
      {
        "mode": "vol",
        "distance": "2 m",
        "max": "20 m"
      }
    ],
    "initiativeBase": 2,
    "bodyMin": 22,
    "bodyMax": 27,
    "armor": [],
    "description": "C'est une créature discrète aux ailes de chauve-souris qui plane d'arbre en arbre. Son corps sombre est adapté à la nuit et déteste la lumière du soleil. Sa bouche est armée d'une morsure suceuse de sang très dangereuse. Ses longues griffes recherchées sont acérées et ses pattes griffues lui permettent de dormir suspendu au plafond des cavernes. Sa silhouette nocturne hante la cime des pins avec dextérité.",
    "traits": {},
    "skills": {
      "fighting": 8
    },
    "skillTree": [
        {"name": "Combat", "value": 8, "kind": "skill"}
      ],
    "body": 25,
    "combat": 19,
    "naturalArmor": 0,
    "fearFactor": "1d10 (JO 10)",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 8
        },
        {
          "attack": "Griffes",
          "value": 8
        },
        {
          "attack": "Griffes",
          "value": 8
        }
      ]
    ],
    "feats": [
      "Infection des rugtannes",
      "Salive anesthésiante",
      "Suceur de sang",
      "Vision dans le noir"
    ]
  },
  "TRUDVANG.Content.Actor.ThornBeast": {
    "creature": "Bête épineuse",
    "type": "winged quadruped",
    "move": [
      {
        "mode": "terrestre",
        "distance": "6 m",
        "max": "18 m"
      },
      {
        "mode": "vol",
        "distance": "12 m",
        "max": "36 m"
      }
    ],
    "initiativeBase": 4,
    "bodyMin": 153,
    "bodyMax": 188,
    "armor": [],
    "description": "C'est un gigantesque lézard ailé né d'une petite chauve-souris devenue monstrueuse. Son corps ailé de grande envergure culmine à environ deux mètres et demi de haut. Sa gueule est garnie de crocs longs et solides. Ses yeux vides reflètent pendant la nuit une pâle lueur de mort. Son corps pourrit continuellement de l'intérieur et traîne une âcre pestilence de chair morte et de décomposition. Ses pattes griffues et sa morsure puissante complètent sa silhouette de prédateur volant.",
    "traits": {},
    "skills": {
      "fighting": 7
    },
    "skillTree": [
        {"name": "Combat", "value": 7, "kind": "skill"}
      ],
    "body": 171,
    "combat": 27,
    "naturalArmor": 3,
    "fearFactor": "1d10 (JO 7-10)",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 12
        },
        {
          "attack": "Griffes",
          "value": 8
        },
        {
          "attack": "Griffes",
          "value": 7
        }
      ]
    ],
    "feats": [
      "Puanteur terrifiante",
      "Vision nocturne",
      "Attaque des hauteurs (bête épineuse)"
    ]
  },
  "TRUDVANG.Content.Actor.TrollBull": {
    "creature": "Minokks",
    "type": "humanoid",
    "move": [
      {
        "mode": "terrestre",
        "distance": "2 m",
        "max": "16 m"
      }
    ],
    "initiativeBase": 0,
    "bodyMin": 52,
    "bodyMax": 64,
    "armor": [
      {
        "name": "Armure de fourrure",
        "protection": 2,
        "initiative": -1
      }
    ],
    "description": "C'est un grand humanoïde à la musculature très développée. Son corps imposant est couvert d'une fourrure épaisse, plus épaisse au nord. Son torse massif abrite quatre petits estomacs. Son impressionnante tête de taureau est affublée de longues cornes, plus longues à Soj, dont il se sert au combat. Ses bras puissants manient d'imposantes massues de fer. Sa stature de taureau dressé sur deux jambes domine les plaines.",
    "traits": {
      "constitution": 4,
      "strength": 4
    },
    "skills": {
      "agility": 9,
      "entertainment": 2,
      "faith": 5,
      "shadowArts": 6,
      "wilderness": 8,
      "care": 7,
      "fighting": 10,
      "knowledge": 5
    },
    "skillTree": [
        {"name": "Agilité", "value": 9, "kind": "skill"},
        {"name": "Divertissement", "value": 2, "kind": "skill"},
        {"name": "Foi", "value": 5, "kind": "skill"},
        {"name": "Arts des ombres", "value": 6, "kind": "skill"},
        {"name": "Nature", "value": 8, "kind": "skill"},
        {"name": "Savoir-faire", "value": 7, "kind": "skill"},
        {"name": "Artisanat", "value": 1, "kind": "discipline"},
        {"name": "Matériaux durs", "value": 2, "kind": "specialty"},
        {"name": "Matériaux souples", "value": 2, "kind": "specialty"},
        {"name": "Combat", "value": 10, "kind": "skill"},
        {"name": "Combat armé", "value": 3, "kind": "discipline"},
        {"name": "Armes lourdes à une main", "value": 4, "kind": "specialty"},
        {"name": "Porteur de bouclier", "value": 2, "kind": "specialty"},
        {"name": "Armes à deux mains", "value": 3, "kind": "specialty"},
        {"name": "Expérience du combat", "value": 1, "kind": "discipline"},
        {"name": "Porteur d'armure", "value": 1, "kind": "specialty"},
        {"name": "Combattant", "value": 2, "kind": "specialty"},
        {"name": "Combat à mains nues", "value": 1, "kind": "discipline"},
        {"name": "Bagarre", "value": 3, "kind": "specialty"},
        {"name": "Connaissances", "value": 5, "kind": "skill"},
        {"name": "Langage", "value": 1, "kind": "discipline"},
        {"name": "Langue maternelle (bastjumal)", "value": 3, "kind": "specialty"}
      ],
    "body": 58,
    "combat": 24,
    "naturalArmor": 2,
    "fearFactor": "1d10 (JO 10)",
    "attacks": [
      [
        {
          "attack": "Cornes",
          "value": 13
        },
        {
          "attack": "Cornes",
          "value": 10
        }
      ],
      [
        {
          "attack": "Armes à deux mains",
          "value": 15
        },
        {
          "attack": "Armes à deux mains",
          "value": 9
        }
      ],
      [
        {
          "attack": "Armes à une main",
          "value": 12
        },
        {
          "attack": "Armes à une main",
          "value": 11
        },
        {
          "attack": "Bouclier",
          "value": 15
        }
      ],
      [
        {
          "attack": "Armes à une main",
          "value": 15
        },
        {
          "attack": "Armes à une main",
          "value": 8
        },
        {
          "attack": "Armes à une main",
          "value": 6
        },
        {
          "attack": "Bouclier",
          "value": 8
        },
        {
          "attack": "Bouclier",
          "value": 7
        }
      ]
    ],
    "feats": [
      "Charge",
      "Cœur de minokks"
    ]
  },
  "TRUDVANG.Content.Actor.Warg": {
    "creature": "Warg",
    "type": "quadruped",
    "move": [
      {
        "mode": "terrestre",
        "distance": "4 m",
        "max": "24 m"
      }
    ],
    "initiativeBase": 2,
    "bodyMin": 16,
    "bodyMax": 20,
    "armor": [],
    "description": "C'est un terrible prédateur canin aussi massif qu'un loup mais de stature plus solide. Son corps à quatre pattes est couvert d'une fourrure épaisse. Sa tête est plus grosse que celle de son cousin le loup. Sa gueule est armée de crocs et ses pattes de griffes. Sa silhouette trapue et rapide en fait une monture recherchée des peuples trolls et sauvages. Son allure de loup renforcé rôde en meute autour des fermes.",
    "traits": {},
    "skills": {
      "fighting": 8
    },
    "skillTree": [
        {"name": "Combat", "value": 8, "kind": "skill"}
      ],
    "body": 18,
    "combat": 20,
    "naturalArmor": 0,
    "fearFactor": "1d10",
    "attacks": [
      [
        {
          "attack": "Morsure",
          "value": 16
        },
        {
          "attack": "Griffes",
          "value": 12
        }
      ],
      [
        {
          "attack": "Morsure",
          "value": 10
        },
        {
          "attack": "Morsure",
          "value": 8
        },
        {
          "attack": "Griffes",
          "value": 10
        }
      ]
    ],
    "feats": [
      "Rapide",
      "Attaque de saut",
      "Vision nocturne",
      "Maladie du warg (warg)"
    ]
  }
};

const FEAT_ICONS = {
  "Mugissement profond": "icons/svg/sound.svg",
  "Intrépide": "icons/svg/aura.svg",
  "Constriction (serpent géant)": "icons/svg/net.svg",
  "Hylja (serpent géant)": "icons/svg/sound.svg",
  "Regard paralysant (serpent géant)": "icons/svg/eye.svg",
  "Toile d’attaque": "icons/svg/net.svg",
  "Vision dans le noir": "icons/svg/eye.svg",
  "Cocon de soie": "icons/svg/net.svg",
  "Puanteur terrifiante": "icons/svg/terror.svg",
  "Vision nocturne": "icons/svg/eye.svg",
  "Attaque des hauteurs (bête épineuse)": "icons/svg/wing.svg",
  "Attaque des hauteurs (griffon)": "icons/svg/wing.svg",
  "Vision dans le noir (10 à 60 m)": "icons/svg/eye.svg",
  "Infection des rugtannes": "icons/svg/poison.svg",
  "Salive anesthésiante": "icons/svg/blood.svg",
  "Suceur de sang": "icons/svg/blood.svg",
  "Charge": "icons/svg/combat.svg",
  "Cœur de minokks": "icons/commodities/biological/organ-heart-red.webp",
  "Rapide": "icons/svg/wing.svg",
  "Attaque de saut": "icons/svg/combat.svg",
  "Maladie du warg (warg)": "icons/svg/poison.svg"
};

/** Look up baked creature data for a starter actor id (e.g. "TRUDVANG.Content.Actor.Galtir"). */
export function creatureDataForStarter(starterId) {
  return CREATURE_NPC_DATA[starterId] ?? null;
}

/**
 * Build the embedded ActiveEffect create-data for a creature feat: name + French summary
 * as description, no mechanics. Flagged for idempotent imports (see content-importer.mjs).
 */
export function featEffectPayload(featName) {
  const description = CREATURE_FEAT_SUMMARIES[featName];
  if (!description) return null;
  return {
    name: featName,
    type: "effect",
    img: FEAT_ICONS[featName] ?? "icons/svg/aura.svg",
    disabled: false,
    transfer: false,
    description,
    flags: {"trudvang-chronicles": {feat: featName}}
  };
}
