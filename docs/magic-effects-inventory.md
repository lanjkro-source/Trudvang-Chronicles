# Inventaire initial des effets magiques

Généré depuis `game doc/fr/trudvang-powers-fr.json` et les catalogues techniques existants par `node tools/audit-magic-effects.mjs`.

Les nombres indiquent les éléments déjà répertoriés, pas une validation de leur exhaustivité ni de leur exactitude. Chaque ligne et chaque option restent à examiner dans les règles avant d'être déclarées couvertes.

Entrées : 428 ; options de puissance : 1488 ; entrées avec au moins un test répertorié : 114 ; avec au moins un modèle d'effet répertorié : 62.

| Tablette | Nom | Type | Identifiant | Options | Tests existants | Modèles d'effet existants |
|---|---|---|---|---:|---:|---:|
| Art du vitner | Bourse de vitner | sortilège | `vitner-vitner-craft:vitner-pouch:1` | 6 | 1 | 0 |
| Art du vitner | Canalisation | sortilège | `vitner-vitner-craft:channeling:0` | 6 | 0 | 0 |
| Art du vitner | Enchantement d’objet | sortilège | `vitner-vitner-craft:enchant-object:2` | 7 | 0 | 0 |
| Art du vitner | Antimagie | sortilège | `vitner-vitner-craft:anti-magic:3` | 6 | 1 | 0 |
| Art du vitner | Enchantement de créature | sortilège | `vitner-vitner-craft:enchant-being:4` | 6 | 0 | 0 |
| Art du vitner | Dissipation du vitner | sortilège | `vitner-vitner-craft:dispel-vitner:6` | 2 | 1 | 0 |
| Art du vitner | Sceau | sortilège | `vitner-vitner-craft:seal:5` | 3 | 0 | 0 |
| Art du vitner | Mur de vitner | sortilège | `vitner-vitner-craft:wall-of-vitner:8` | 7 | 1 | 0 |
| Art du vitner | Piste du vitner | sortilège | `vitner-vitner-craft:trace-vitner:7` | 6 | 1 | 0 |
| Dimvitner | Animation des morts-vivants | sortilège | `vitner-dimvitner:animate-undead:0` | 9 | 1 | 0 |
| Dimvitner | Main funeste | sortilège | `vitner-dimvitner:hand-of-death:1` | 5 | 1 | 0 |
| Dimvitner | Conversation de l’au-delà | sortilège | `vitner-dimvitner:speak-to-undead:3` | 2 | 2 | 0 |
| Dimvitner | Renvoi des morts-vivants | sortilège | `vitner-dimvitner:dismiss-undead:2` | 3 | 1 | 0 |
| Dimvitner | Vol de vitner | sortilège | `vitner-dimvitner:vitner-theft:5` | 3 | 1 | 0 |
| Dimvitner | Vrille de Dimhall | sortilège | `vitner-dimvitner:tendril-of-dimhall:4` | 3 | 0 | 0 |
| Dimvitner | Contrôle des morts-vivants | sortilège | `vitner-dimvitner:control-undead:7` | 5 | 1 | 0 |
| Dimvitner | Invocation d’un revenant | sortilège | `vitner-dimvitner:summon-wight:6` | 2 | 0 | 0 |
| Dimvitner | Ténèbres de Dimhall | sortilège | `vitner-dimvitner:darkness-of-dimhall:8` | 3 | 0 | 0 |
| Maîtrise de la terre | Façonnage de la terre | sortilège | `vitner-soil-craft:shape-soil:1` | 4 | 0 | 0 |
| Maîtrise de la terre | Jet de pierre | sortilège | `vitner-soil-craft:rock-throw:0` | 3 | 0 | 0 |
| Maîtrise de la terre | Bourbier | sortilège | `vitner-soil-craft:quagmire:3` | 5 | 1 | 0 |
| Maîtrise de la terre | Tremblement de terre | sortilège | `vitner-soil-craft:earthquake:2` | 4 | 1 | 0 |
| Maîtrise de la terre | Marche dans la terre | sortilège | `vitner-soil-craft:soil-walk:5` | 5 | 0 | 0 |
| Maîtrise de la terre | Projection de terre | sortilège | `vitner-soil-craft:soil-blast:4` | 6 | 0 | 0 |
| Maîtrise de la terre | Façonnage de la pierre | sortilège | `vitner-soil-craft:shape-stone:6` | 4 | 0 | 0 |
| Maîtrise de la terre | Marche dans la pierre | sortilège | `vitner-soil-craft:stone-walk:7` | 5 | 0 | 0 |
| Maîtrise de la terre | Pétrification/Annuler une pétrification | sortilège | `vitner-soil-craft:petrify-remove-petrification:8` | 6 | 2 | 3 |
| Maîtrise de l'eau | Purification de l’eau | sortilège | `vitner-water-craft:purify-water:1` | 5 | 0 | 0 |
| Maîtrise de l'eau | Sourcier | sortilège | `vitner-water-craft:find-water:0` | 5 | 1 | 0 |
| Maîtrise de l'eau | Façonnage de l’eau | sortilège | `vitner-water-craft:form-water:3` | 5 | 0 | 0 |
| Maîtrise de l'eau | Respiration aquatique | sortilège | `vitner-water-craft:breathe:2` | 5 | 0 | 0 |
| Maîtrise de l'eau | Création d’eau | sortilège | `vitner-water-craft:create-water:4` | 4 | 0 | 0 |
| Maîtrise de l'eau | Eau solide | sortilège | `vitner-water-craft:solid-water:5` | 7 | 0 | 0 |
| Maîtrise de l'eau | Contrôle des précipitations | sortilège | `vitner-water-craft:control-precipitation:6` | 6 | 0 | 0 |
| Maîtrise de l'eau | Marche sur l’eau | sortilège | `vitner-water-craft:water-walk:7` | 10 | 0 | 0 |
| Maîtrise de l'eau | Maître des flots | sortilège | `vitner-water-craft:wave-master:8` | 8 | 0 | 0 |
| Maîtrise des flammes | Ébullition | sortilège | `vitner-flame-craft:heat-water:0` | 5 | 0 | 0 |
| Maîtrise des flammes | Flammèche | sortilège | `vitner-flame-craft:spark:1` | 5 | 0 | 0 |
| Maîtrise des flammes | Main brûlante | sortilège | `vitner-flame-craft:burning-hand:2` | 3 | 0 | 0 |
| Maîtrise des flammes | Éruption de flammes | sortilège | `vitner-flame-craft:flame-burst:3` | 4 | 0 | 0 |
| Maîtrise des flammes | Protection contre le feu | sortilège | `vitner-flame-craft:protection-from-fire:4` | 6 | 0 | 0 |
| Maîtrise des flammes | Chaleur | sortilège | `vitner-flame-craft:warmth:6` | 7 | 0 | 0 |
| Maîtrise des flammes | Contrôle des flammes | sortilège | `vitner-flame-craft:flame-control:5` | 6 | 0 | 0 |
| Maîtrise des flammes | Mer de flammes | sortilège | `vitner-flame-craft:sea-of-fire:7` | 4 | 0 | 0 |
| Maîtrise du vent | Coup de vent | sortilège | `vitner-wind-craft:wind-gust:1` | 2 | 0 | 0 |
| Maîtrise du vent | Purification de l’air | sortilège | `vitner-wind-craft:purify-air:0` | 4 | 0 | 0 |
| Maîtrise du vent | Brouillard | sortilège | `vitner-wind-craft:fog:2` | 4 | 0 | 0 |
| Maîtrise du vent | Contrôle du vent | sortilège | `vitner-wind-craft:control-wind:3` | 4 | 0 | 0 |
| Maîtrise du vent | Armure d’air | sortilège | `vitner-wind-craft:air-armor:4` | 5 | 0 | 0 |
| Maîtrise du vent | Vent porteur | sortilège | `vitner-wind-craft:lift:5` | 10 | 2 | 0 |
| Maîtrise du vent | Bouclier d’air | sortilège | `vitner-wind-craft:air-shield:6` | 6 | 1 | 0 |
| Maîtrise du vent | Rafale de vent | sortilège | `vitner-wind-craft:wind-blast:7` | 3 | 1 | 0 |
| Maîtrise du vent | Seigneur des vents | sortilège | `vitner-wind-craft:wind-catcher:9` | 9 | 2 | 0 |
| Maîtrise du vent | Tempête | sortilège | `vitner-wind-craft:storm:8` | 6 | 1 | 0 |
| Perception | Chemin du retour | sortilège | `vitner-perceiving:find-home:0` | 5 | 0 | 0 |
| Perception | Traces | sortilège | `vitner-perceiving:retrace-tracks:1` | 4 | 0 | 0 |
| Perception | Détection d’objet | sortilège | `vitner-perceiving:detect-object:2` | 6 | 1 | 0 |
| Perception | Orientation | sortilège | `vitner-perceiving:orientation:3` | 4 | 0 | 0 |
| Perception | Détection des êtres vivants | sortilège | `vitner-perceiving:detect-being:4` | 5 | 1 | 0 |
| Perception | Détection des morts-vivants | sortilège | `vitner-perceiving:detect-undead:5` | 6 | 1 | 0 |
| Perception | Environnement | sortilège | `vitner-perceiving:surrounding:6` | 4 | 0 | 0 |
| Perception | Cartographie | sortilège | `vitner-perceiving:map:7` | 4 | 0 | 0 |
| Pouvoir de la pensée | Compréhension des écrits | sortilège | `vitner-power-of-thought:understanding-script:0` | 2 | 0 | 0 |
| Pouvoir de la pensée | Compréhension orale | sortilège | `vitner-power-of-thought:understanding-speech:1` | 3 | 0 | 0 |
| Pouvoir de la pensée | Courage | sortilège | `vitner-power-of-thought:courage:2` | 5 | 0 | 0 |
| Pouvoir de la pensée | Peur | sortilège | `vitner-power-of-thought:fear:3` | 4 | 1 | 0 |
| Pouvoir de la pensée | Télépathie | sortilège | `vitner-power-of-thought:telepathy:4` | 7 | 0 | 0 |
| Pouvoir de la pensée | Extase | sortilège | `vitner-power-of-thought:ecstasy:5` | 5 | 3 | 0 |
| Pouvoir de la pensée | Influence | sortilège | `vitner-power-of-thought:imagining:6` | 4 | 1 | 0 |
| Pouvoir de la pensée | Mémoire | sortilège | `vitner-power-of-thought:memory:7` | 5 | 0 | 0 |
| Pouvoir de la pensée | Aura de puissance | sortilège | `vitner-power-of-thought:aura-of-power:9` | 4 | 1 | 0 |
| Pouvoir de la pensée | Contrôle des créatures | sortilège | `vitner-power-of-thought:creature-control:8` | 4 | 1 | 0 |
| Pouvoir de la pensée | Lecture des pensées | sortilège | `vitner-power-of-thought:mind-reading:11` | 5 | 1 | 0 |
| Pouvoir de la pensée | Possession de créature | sortilège | `vitner-power-of-thought:possess-creature:10` | 6 | 1 | 0 |
| Pouvoir de la vision | Pistage | sortilège | `vitner-power-of-vision:tracking:0` | 3 | 0 | 0 |
| Pouvoir de la vision | Examen d’objet | sortilège | `vitner-power-of-vision:scanning:1` | 2 | 0 | 0 |
| Pouvoir de la vision | Vision lointaine | sortilège | `vitner-power-of-vision:far-sight:2` | 8 | 0 | 0 |
| Pouvoir de la vision | Espionnage | sortilège | `vitner-power-of-vision:espionage:4` | 3 | 0 | 0 |
| Pouvoir de la vision | Vision parfaite | sortilège | `vitner-power-of-vision:seeing:3` | 4 | 0 | 0 |
| Pouvoir de la vision | Lecture du vitner | sortilège | `vitner-power-of-vision:read-vitner:6` | 2 | 1 | 0 |
| Pouvoir de la vision | Voyage astral | sortilège | `vitner-power-of-vision:astral-voyage:5` | 4 | 0 | 0 |
| Pouvoir de la vision | Vision véritable | sortilège | `vitner-power-of-vision:true-sight:7` | 8 | 1 | 0 |
| Sorcellerie | Déracinement | sortilège | `vitner-witchcraft:uprooted-tree:0` | 4 | 1 | 0 |
| Sorcellerie | Mal imaginaire | sortilège | `vitner-witchcraft:phantom-plague:1` | 3 | 1 | 0 |
| Sorcellerie | Fièvre | sortilège | `vitner-witchcraft:fever:2` | 6 | 1 | 0 |
| Sorcellerie | Malédiction d’objet | sortilège | `vitner-witchcraft:curse-object:3` | 5 | 0 | 0 |
| Sorcellerie | Amnésie | sortilège | `vitner-witchcraft:amnesia:4` | 3 | 2 | 0 |
| Sorcellerie | Malédiction de créature | sortilège | `vitner-witchcraft:curse-creature:5` | 5 | 0 | 0 |
| Sorcellerie | Mauvaise récolte | sortilège | `vitner-witchcraft:bad-harvest:6` | 6 | 0 | 0 |
| Sorcellerie | Malédiction de l’arbre | sortilège | `vitner-witchcraft:tree-curse:7` | 6 | 1 | 2 |
| Vitner animal | Messager | sortilège | `vitner-animal-vitner:messenger:0` | 3 | 0 | 0 |
| Vitner animal | Parler aux animaux | sortilège | `vitner-animal-vitner:speak-to-animals:1` | 2 | 0 | 0 |
| Vitner animal | Appel des animaux | sortilège | `vitner-animal-vitner:call-on-animals:2` | 4 | 0 | 0 |
| Vitner animal | Conjuration de corbeaux | sortilège | `vitner-animal-vitner:conjure-ravens:3` | 5 | 1 | 0 |
| Vitner animal | Contrôle des animaux | sortilège | `vitner-animal-vitner:control-animals:4` | 6 | 0 | 0 |
| Vitner animal | Esprit du loup | sortilège | `vitner-animal-vitner:mind-of-the-wolf:5` | 6 | 0 | 0 |
| Vitner animal | Création de messager | sortilège | `vitner-animal-vitner:create-messenger:7` | 6 | 0 | 0 |
| Vitner animal | Possession animale | sortilège | `vitner-animal-vitner:possess-animals:6` | 6 | 0 | 0 |
| Vitner animal | Messager magique | sortilège | `vitner-animal-vitner:send-message:8` | 4 | 0 | 0 |
| Vitner corporel | Adhérence | sortilège | `vitner-body-vitner:grip:0` | 5 | 0 | 0 |
| Vitner corporel | Croche-pied | sortilège | `vitner-body-vitner:tipping:1` | 3 | 0 | 0 |
| Vitner corporel | Acuité auditive/surdité | sortilège | `vitner-body-vitner:hearing-deafness:2` | 7 | 1 | 0 |
| Vitner corporel | Sens de l’odorat | sortilège | `vitner-body-vitner:sense-of-smell:3` | 9 | 1 | 0 |
| Vitner corporel | Vision/cécité | sortilège | `vitner-body-vitner:vision-blindness:4` | 7 | 1 | 0 |
| Vitner corporel | Immobilisation | sortilège | `vitner-body-vitner:immobilize:6` | 7 | 1 | 0 |
| Vitner corporel | Modification d’apparence | sortilège | `vitner-body-vitner:appearance-change:7` | 4 | 1 | 0 |
| Vitner corporel | Peau de cuir | sortilège | `vitner-body-vitner:leather-skin:5` | 4 | 0 | 1 |
| Vitner corporel | Hâte | sortilège | `vitner-body-vitner:hasten:9` | 7 | 1 | 2 |
| Vitner corporel | Vigueur | sortilège | `vitner-body-vitner:strengthen:8` | 7 | 1 | 2 |
| Vitner corporel | Emprisonnement | sortilège | `vitner-body-vitner:imprison:10` | 5 | 1 | 0 |
| Vitner corporel | Transformation | sortilège | `vitner-body-vitner:change-creature:11` | 11 | 1 | 1 |
| Vitner illusoire | Amplification des sons | sortilège | `vitner-delusion-vitner:increase-sounds:3` | 4 | 0 | 0 |
| Vitner illusoire | Grondement | sortilège | `vitner-delusion-vitner:roar:0` | 3 | 0 | 0 |
| Vitner illusoire | Son aigu | sortilège | `vitner-delusion-vitner:shriek:2` | 3 | 0 | 0 |
| Vitner illusoire | Son illusoire | sortilège | `vitner-delusion-vitner:phantom-sound:1` | 3 | 0 | 0 |
| Vitner illusoire | Sans trace | sortilège | `vitner-delusion-vitner:traceless:4` | 5 | 0 | 0 |
| Vitner illusoire | Voix illusoire | sortilège | `vitner-delusion-vitner:ghost-voice:5` | 4 | 1 | 0 |
| Vitner illusoire | Camouflage | sortilège | `vitner-delusion-vitner:camouflage:7` | 5 | 1 | 0 |
| Vitner illusoire | Image | sortilège | `vitner-delusion-vitner:depict:6` | 6 | 3 | 0 |
| Vitner illusoire | Paysage illusoire | sortilège | `vitner-delusion-vitner:landscape-illusion:8` | 6 | 6 | 0 |
| Vitner illusoire | Silence | sortilège | `vitner-delusion-vitner:silence:9` | 5 | 0 | 0 |
| Vitner illusoire | Invisibilité | sortilège | `vitner-delusion-vitner:invisibility:11` | 5 | 3 | 0 |
| Vitner illusoire | Lindwurm illusoire | sortilège | `vitner-delusion-vitner:lindwurm-illusion:10` | 6 | 1 | 0 |
| Vitner des objets | Analyse de la composition | sortilège | `vitner-vitner-of-objects:detect-composition:0` | 4 | 0 | 0 |
| Vitner des objets | Résistance à l’eau | sortilège | `vitner-vitner-of-objects:waterproof:1` | 6 | 0 | 0 |
| Vitner des objets | Lien | sortilège | `vitner-vitner-of-objects:bind:2` | 5 | 0 | 0 |
| Vitner des objets | Rouille | sortilège | `vitner-vitner-of-objects:rust:3` | 5 | 0 | 0 |
| Vitner des objets | Objet d’alarme | sortilège | `vitner-vitner-of-objects:alarm-object:4` | 7 | 1 | 0 |
| Vitner des objets | Verrouillage/ déverrouillage | sortilège | `vitner-vitner-of-objects:unlock-lock:5` | 2 | 1 | 0 |
| Vitner des objets | Agrandissement/ rapetissement d’objet | sortilège | `vitner-vitner-of-objects:enlarge-reduce-object:6` | 7 | 0 | 0 |
| Vitner des objets | Altération d’objet | sortilège | `vitner-vitner-of-objects:alter-object:7` | 8 | 0 | 0 |
| Vitner des objets | Création d’objet | sortilège | `vitner-vitner-of-objects:create-object:8` | 13 | 0 | 0 |
| Chaleur de Solvei | Guérison | pouvoir | `holy-gerbanis-warmth-of-sunvei:healing:0` | 2 | 0 | 0 |
| Chaleur de Solvei | Rayons du soleil | pouvoir | `holy-gerbanis-warmth-of-sunvei:sunray:1` | 1 | 0 | 0 |
| Chaleur de Solvei | Cœur de l’été | pouvoir | `holy-gerbanis-warmth-of-sunvei:summer-place:3` | 1 | 0 | 0 |
| Chaleur de Solvei | Lumière guérisseuse | pouvoir | `holy-gerbanis-warmth-of-sunvei:healing-glow:2` | 1 | 0 | 0 |
| Chaleur de Solvei | Chaleur guérisseuse | pouvoir | `holy-gerbanis-warmth-of-sunvei:healing-warmth:5` | 3 | 0 | 0 |
| Chaleur de Solvei | Pouvoir de Firon | pouvoir | `holy-gerbanis-warmth-of-sunvei:firon-power:4` | 1 | 0 | 0 |
| Chaleur de Solvei | Heure de la chasse | pouvoir | `holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6` | 2 | 0 | 0 |
| Chaleur de Solvei | Souffle de Solvei | pouvoir | `holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7` | 3 | 0 | 0 |
| Chaleur de Solvei | Soleil guérisseur | pouvoir | `holy-gerbanis-warmth-of-sunvei:healing-sun:8` | 1 | 0 | 0 |
| Force de Storme | Autorité | pouvoir | `holy-gerbanis-strength-of-stormi:voice-of-command:1` | 3 | 1 | 0 |
| Force de Storme | Force du troll | pouvoir | `holy-gerbanis-strength-of-stormi:troll-strength:0` | 2 | 0 | 1 |
| Force de Storme | Force de hinje | pouvoir | `holy-gerbanis-strength-of-stormi:hinji-strength:3` | 2 | 0 | 1 |
| Force de Storme | Havar | pouvoir | `holy-gerbanis-strength-of-stormi:havar:2` | 2 | 0 | 0 |
| Force de Storme | Appel du jarl | pouvoir | `holy-gerbanis-strength-of-stormi:jarl-s-call:4` | 3 | 1 | 0 |
| Force de Storme | Skölddíser | pouvoir | `holy-gerbanis-strength-of-stormi:shield-disir:5` | 3 | 0 | 0 |
| Force de Storme | Force du jotun | pouvoir | `holy-gerbanis-strength-of-stormi:jotun-strength:6` | 5 | 0 | 2 |
| Force de Storme | Voix de Storme | pouvoir | `holy-gerbanis-strength-of-stormi:voice-of-stormi:7` | 4 | 1 | 0 |
| Force de Storme | Einharjar | pouvoir | `holy-gerbanis-strength-of-stormi:einharjar:8` | 3 | 0 | 0 |
| Fureur de Tyrd | Cri de bataille | pouvoir | `holy-gerbanis-wrath-of-tyrd:battle-cry:1` | 4 | 0 | 0 |
| Fureur de Tyrd | Tisonnier | pouvoir | `holy-gerbanis-wrath-of-tyrd:fire-iron:0` | 2 | 0 | 0 |
| Fureur de Tyrd | Langue du loup | pouvoir | `holy-gerbanis-wrath-of-tyrd:wolf-tongue:2` | 2 | 0 | 0 |
| Fureur de Tyrd | Marque du brasier | pouvoir | `holy-gerbanis-wrath-of-tyrd:pyre-mark:3` | 3 | 0 | 0 |
| Fureur de Tyrd | Cri de guerre | pouvoir | `holy-gerbanis-wrath-of-tyrd:war-cry:4` | 6 | 0 | 0 |
| Fureur de Tyrd | Figure sinistre | pouvoir | `holy-gerbanis-wrath-of-tyrd:dark-visage:5` | 3 | 0 | 0 |
| Fureur de Tyrd | Tempête de feu | pouvoir | `holy-gerbanis-wrath-of-tyrd:firestorm:6` | 2 | 0 | 0 |
| Fureur de Tyrd | Tonnerre victorieux | pouvoir | `holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7` | 4 | 0 | 0 |
| Fureur de Tyrd | Grondement de Tyrd | pouvoir | `holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8` | 2 | 0 | 0 |
| Influence de Jorn | Mur du crépuscule | pouvoir | `holy-gerbanis-influence-of-jorn:wall-of-dusk:1` | 4 | 0 | 0 |
| Influence de Jorn | Souffle de mort | pouvoir | `holy-gerbanis-influence-of-jorn:death-gust:0` | 2 | 0 | 0 |
| Influence de Jorn | Falfax | pouvoir | `holy-gerbanis-influence-of-jorn:falfax:2` | 1 | 0 | 0 |
| Influence de Jorn | Rideau de la nuit | pouvoir | `holy-gerbanis-influence-of-jorn:night-curtain:3` | 5 | 0 | 0 |
| Influence de Jorn | Manteau de Jorn | pouvoir | `holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4` | 5 | 0 | 0 |
| Influence de Jorn | Souffle de Mogunda | pouvoir | `holy-gerbanis-influence-of-jorn:the-breath-of-mogunda:5` | 2 | 0 | 0 |
| Influence de Jorn | Svartasi | pouvoir | `holy-gerbanis-influence-of-jorn:asiblack:6` | 1 | 0 | 0 |
| Influence de Jorn | Volonté de Bodvilur | pouvoir | `holy-gerbanis-influence-of-jorn:will-of-bodvildur:7` | 2 | 0 | 0 |
| Influence de Jorn | Snarfari | pouvoir | `holy-gerbanis-influence-of-jorn:snarfari:8` | 1 | 0 | 0 |
| Pouvoir d'Enken | Force d’âme | pouvoir | `holy-gerbanis-power-of-enken:willpower:1` | 2 | 0 | 1 |
| Pouvoir d'Enken | Vision nocturne | pouvoir | `holy-gerbanis-power-of-enken:night-vision:0` | 3 | 0 | 1 |
| Pouvoir d'Enken | Bouclier de vent | pouvoir | `holy-gerbanis-power-of-enken:wind-shield:3` | 4 | 0 | 0 |
| Pouvoir d'Enken | Témérité | pouvoir | `holy-gerbanis-power-of-enken:bold:2` | 2 | 0 | 1 |
| Pouvoir d'Enken | Armure de la tempête | pouvoir | `holy-gerbanis-power-of-enken:storm-armor:5` | 5 | 0 | 0 |
| Pouvoir d'Enken | Regard de l’âme | pouvoir | `holy-gerbanis-power-of-enken:soul-sight:4` | 3 | 0 | 0 |
| Pouvoir d'Enken | Armure de l’ouragan | pouvoir | `holy-gerbanis-power-of-enken:hurricane-armor:7` | 5 | 0 | 0 |
| Pouvoir d'Enken | Cœur d’Enken | pouvoir | `holy-gerbanis-power-of-enken:heart-of-enken:6` | 5 | 0 | 2 |
| Pouvoir d'Enken | Œil d’Enken | pouvoir | `holy-gerbanis-power-of-enken:eye-of-enken:8` | 3 | 0 | 0 |
| Sagesse de Windinna | Inspiration | pouvoir | `holy-gerbanis-wisdom-of-windinna:inspiration:0` | 2 | 0 | 0 |
| Sagesse de Windinna | Sixième sens | pouvoir | `holy-gerbanis-wisdom-of-windinna:sixth-sense:1` | 1 | 0 | 0 |
| Sagesse de Windinna | Esprit d’acier | pouvoir | `holy-gerbanis-wisdom-of-windinna:steel-mind:3` | 3 | 1 | 0 |
| Sagesse de Windinna | Joie de la création | pouvoir | `holy-gerbanis-wisdom-of-windinna:joy-of-creating:2` | 2 | 0 | 0 |
| Sagesse de Windinna | Protection contre le vitner | pouvoir | `holy-gerbanis-wisdom-of-windinna:vitner-protection:5` | 3 | 1 | 0 |
| Sagesse de Windinna | Vague de vérité | pouvoir | `holy-gerbanis-wisdom-of-windinna:wave-of-truth:4` | 1 | 0 | 0 |
| Sagesse de Windinna | Regard de Windinna | pouvoir | `holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7` | 2 | 1 | 0 |
| Sagesse de Windinna | Ruée du porc | pouvoir | `holy-gerbanis-wisdom-of-windinna:swine-rush:6` | 1 | 0 | 0 |
| Sagesse de Windinna | Âtre de Windinna | pouvoir | `holy-gerbanis-wisdom-of-windinna:hearth-of-windinna:8` | 1 | 0 | 0 |
| Don de Magh | Brise du voyage | pouvoir | `holy-ealdtradition-magh-s-gift:journey-wind:0` | 2 | 0 | 0 |
| Don de Magh | Mélodie du cavalier | pouvoir | `holy-ealdtradition-magh-s-gift:rider-s-melody:1` | 2 | 0 | 0 |
| Don de Magh | Entrave de Magh | pouvoir | `holy-ealdtradition-magh-s-gift:magh-s-tether:2` | 0 | 0 | 0 |
| Don de Magh | Été elfique | pouvoir | `holy-ealdtradition-magh-s-gift:elf-summer:3` | 3 | 0 | 0 |
| Don de Magh | Chant du héros | pouvoir | `holy-ealdtradition-magh-s-gift:hero-s-song:4` | 2 | 0 | 0 |
| Don de Magh | Chaîne de Magh | pouvoir | `holy-ealdtradition-magh-s-gift:magh-s-chain:5` | 0 | 0 | 0 |
| Don de Magh | Hymne royal | pouvoir | `holy-ealdtradition-magh-s-gift:king-s-anthem:6` | 2 | 0 | 0 |
| Don de Magh | Année de récolte | pouvoir | `holy-ealdtradition-magh-s-gift:harvest-year:8` | 1 | 0 | 0 |
| Don de Magh | Joug de Magh | pouvoir | `holy-ealdtradition-magh-s-gift:magh-s-hawser:7` | 0 | 0 | 0 |
| Don de Thanja | Derrière le frêne et le pin | pouvoir | `holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0` | 2 | 1 | 0 |
| Don de Thanja | Langue animale | pouvoir | `holy-ealdtradition-gift-of-thanja:animal-speech:1` | 2 | 0 | 0 |
| Don de Thanja | Aspect du cerf | pouvoir | `holy-ealdtradition-gift-of-thanja:stagshape:2` | 2 | 0 | 1 |
| Don de Thanja | Langage des bêtes | pouvoir | `holy-ealdtradition-gift-of-thanja:bestial-tongue:3` | 2 | 0 | 0 |
| Don de Thanja | Aspect du saumon | pouvoir | `holy-ealdtradition-gift-of-thanja:salmonshape:4` | 2 | 0 | 1 |
| Don de Thanja | Sous la roche et l’écorce | pouvoir | `holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5` | 2 | 1 | 0 |
| Don de Thanja | Enfant de la forêt | pouvoir | `holy-ealdtradition-gift-of-thanja:forest-denizen:7` | 2 | 1 | 0 |
| Don de Thanja | Langue des dragons | pouvoir | `holy-ealdtradition-gift-of-thanja:dragon-tongue:6` | 2 | 0 | 0 |
| Don de Thanja | Aspect du corbeau | pouvoir | `holy-ealdtradition-gift-of-thanja:ravenshape:8` | 2 | 0 | 1 |
| Héritage de Majne | Bière forte | pouvoir | `holy-ealdtradition-heritage-of-majne:strong-beer:0` | 1 | 0 | 0 |
| Héritage de Majne | Tueur de trolls | pouvoir | `holy-ealdtradition-heritage-of-majne:trollslayer:1` | 2 | 0 | 0 |
| Héritage de Majne | Milice royale | pouvoir | `holy-ealdtradition-heritage-of-majne:king-s-militia:3` | 3 | 0 | 0 |
| Héritage de Majne | Tueur de géants | pouvoir | `holy-ealdtradition-heritage-of-majne:giantslayer:2` | 2 | 0 | 0 |
| Héritage de Majne | Bière du héros | pouvoir | `holy-ealdtradition-heritage-of-majne:hero-s-brew:4` | 1 | 0 | 0 |
| Héritage de Majne | Garde royale | pouvoir | `holy-ealdtradition-heritage-of-majne:king-s-guard:5` | 3 | 0 | 0 |
| Héritage de Majne | Bière royale | pouvoir | `holy-ealdtradition-heritage-of-majne:king-s-ale:7` | 1 | 0 | 0 |
| Héritage de Majne | Tueur de dragons | pouvoir | `holy-ealdtradition-heritage-of-majne:dragonslayer:6` | 2 | 0 | 0 |
| Héritage de Majne | Les neuf rois | pouvoir | `holy-ealdtradition-heritage-of-majne:the-nine-kings:8` | 3 | 0 | 0 |
| Offrande de Halawen | Bouclier contre le vitner | pouvoir | `holy-ealdtradition-halawen-s-offering:vitner-shield:1` | 4 | 1 | 0 |
| Offrande de Halawen | Volonté des ancêtres | pouvoir | `holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0` | 2 | 0 | 0 |
| Offrande de Halawen | Courage des ancêtres | pouvoir | `holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3` | 2 | 0 | 0 |
| Offrande de Halawen | Fléau de Blotfang | pouvoir | `holy-ealdtradition-halawen-s-offering:bloodfangsbane:2` | 2 | 0 | 0 |
| Offrande de Halawen | Bolgomek | pouvoir | `holy-ealdtradition-halawen-s-offering:bolgemek:4` | 2 | 0 | 0 |
| Offrande de Halawen | Mur contre la sorcellerie | pouvoir | `holy-ealdtradition-halawen-s-offering:witch-wall:5` | 5 | 1 | 0 |
| Offrande de Halawen | Sans peur | pouvoir | `holy-ealdtradition-halawen-s-offering:fearless:6` | 5 | 0 | 0 |
| Offrande de Halawen | Barrière des brumes | pouvoir | `holy-ealdtradition-halawen-s-offering:mistur-barrier:7` | 5 | 1 | 0 |
| Offrande de Halawen | Roggdrasil | pouvoir | `holy-ealdtradition-halawen-s-offering:roggdrasil:8` | 2 | 0 | 0 |
| Tribut de Morgu | Flèche de bataille | pouvoir | `holy-ealdtradition-tribute-of-morgu:battle-arrow:1` | 1 | 0 | 0 |
| Tribut de Morgu | Sang brûlant | pouvoir | `holy-ealdtradition-tribute-of-morgu:simmering-blood:0` | 2 | 0 | 1 |
| Tribut de Morgu | Rage | pouvoir | `holy-ealdtradition-tribute-of-morgu:rage:3` | 1 | 0 | 2 |
| Tribut de Morgu | Sang bouillant | pouvoir | `holy-ealdtradition-tribute-of-morgu:boiling-blood:2` | 2 | 0 | 1 |
| Tribut de Morgu | Folie | pouvoir | `holy-ealdtradition-tribute-of-morgu:madness:5` | 1 | 0 | 2 |
| Tribut de Morgu | Pluie de flèches | pouvoir | `holy-ealdtradition-tribute-of-morgu:shower-of-arrows:4` | 2 | 0 | 0 |
| Tribut de Morgu | Embrasement du sang | pouvoir | `holy-ealdtradition-tribute-of-morgu:bloodfire:6` | 2 | 0 | 1 |
| Tribut de Morgu | Cieux obscurcis | pouvoir | `holy-ealdtradition-tribute-of-morgu:blacken-the-sky:8` | 2 | 0 | 0 |
| Tribut de Morgu | Riastarthae | pouvoir | `holy-ealdtradition-tribute-of-morgu:riastarthae:7` | 1 | 0 | 2 |
| Utilité de Nema | Oreilles de cheval | pouvoir | `holy-ealdtradition-nema-s-usefulness:horse-ears:0` | 3 | 1 | 0 |
| Utilité de Nema | Souffle libérateur | pouvoir | `holy-ealdtradition-nema-s-usefulness:gust-of-release:1` | 2 | 1 | 0 |
| Utilité de Nema | Ouïe du hibou | pouvoir | `holy-ealdtradition-nema-s-usefulness:owl-hearing:3` | 3 | 1 | 1 |
| Utilité de Nema | Piste des brumes | pouvoir | `holy-ealdtradition-nema-s-usefulness:gloomy-trail:2` | 2 | 0 | 0 |
| Utilité de Nema | Brise libératrice | pouvoir | `holy-ealdtradition-nema-s-usefulness:freeing-breeze:4` | 2 | 3 | 0 |
| Utilité de Nema | Piste de Meall | pouvoir | `holy-ealdtradition-nema-s-usefulness:meall-s-trail:5` | 2 | 0 | 0 |
| Utilité de Nema | Sens du griffon | pouvoir | `holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7` | 3 | 1 | 1 |
| Utilité de Nema | Vent libérateur | pouvoir | `holy-ealdtradition-nema-s-usefulness:liberating-wind:6` | 2 | 2 | 0 |
| Utilité de Nema | Voyage de Mongfind | pouvoir | `holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8` | 2 | 0 | 0 |
| Tablette de la colère | Éclair sacré | pouvoir | `holy-tenetnid-tablet-of-anger:holy-bolt:1` | 2 | 0 | 0 |
| Tablette de la colère | Puissance du sang | pouvoir | `holy-tenetnid-tablet-of-anger:power-of-blood:0` | 3 | 1 | 0 |
| Tablette de la colère | Sens pétrifiés | pouvoir | `holy-tenetnid-tablet-of-anger:stone-senses:2` | 3 | 0 | 0 |
| Tablette de la colère | Visions du chêne | pouvoir | `holy-tenetnid-tablet-of-anger:visions-of-the-oak:3` | 4 | 1 | 0 |
| Tablette de la colère | Explosion sacrée | pouvoir | `holy-tenetnid-tablet-of-anger:sacred-burst:4` | 3 | 0 | 0 |
| Tablette de la colère | Statue | pouvoir | `holy-tenetnid-tablet-of-anger:statue:5` | 3 | 1 | 3 |
| Tablette de la colère | Purification divine | pouvoir | `holy-tenetnid-tablet-of-anger:divine-purge:6` | 3 | 0 | 0 |
| Tablette de la colère | Monument en pierre | pouvoir | `holy-tenetnid-tablet-of-anger:stone-monument:8` | 3 | 1 | 3 |
| Tablette de la colère | Souvenir du martyr | pouvoir | `holy-tenetnid-tablet-of-anger:memory-of-a-martyr:7` | 4 | 1 | 0 |
| Tablette de la grâce | Main de la miséricorde | pouvoir | `holy-tenetnid-tablet-of-grace:hand-of-mercy:0` | 1 | 1 | 0 |
| Tablette de la grâce | Soins sacrés | pouvoir | `holy-tenetnid-tablet-of-grace:holy-mending:1` | 1 | 0 | 0 |
| Tablette de la grâce | Esprit de la vie | pouvoir | `holy-tenetnid-tablet-of-grace:life-spirit:3` | 3 | 0 | 0 |
| Tablette de la grâce | Volonté de Bete Wiemdas | pouvoir | `holy-tenetnid-tablet-of-grace:will-of-bete-wiemdas:2` | 1 | 1 | 0 |
| Tablette de la grâce | Craie de Bete Wiemdas | pouvoir | `holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4` | 1 | 0 | 0 |
| Tablette de la grâce | Rappel | pouvoir | `holy-tenetnid-tablet-of-grace:recall:5` | 3 | 0 | 0 |
| Tablette de la grâce | Main de Gave | pouvoir | `holy-tenetnid-tablet-of-grace:hand-of-gave:7` | 1 | 1 | 0 |
| Tablette de la grâce | Souffle de Gave | pouvoir | `holy-tenetnid-tablet-of-grace:breath-of-gave:6` | 1 | 0 | 0 |
| Tablette de la grâce | Vent d’immortalité | pouvoir | `holy-tenetnid-tablet-of-grace:wind-of-immortality:8` | 4 | 0 | 0 |
| Tablette des voix | Considération sacrée | pouvoir | `holy-tenetnid-tablet-of-voices:holy-consideration:0` | 3 | 0 | 0 |
| Tablette des voix | Oreille de Siro Werte | pouvoir | `holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1` | 2 | 0 | 0 |
| Tablette des voix | Frères de sang | pouvoir | `holy-tenetnid-tablet-of-voices:blood-brothers:2` | 3 | 1 | 0 |
| Tablette des voix | Langue de Siro Werte | pouvoir | `holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3` | 3 | 0 | 0 |
| Tablette des voix | Grâce de Gave | pouvoir | `holy-tenetnid-tablet-of-voices:kindred-s-bond:4` | 5 | 0 | 0 |
| Tablette des voix | Liens fraternels | pouvoir | `holy-tenetnid-tablet-of-voices:grace-of-gave:5` | 4 | 1 | 0 |
| Tablette des voix | Sagesse de Gave | pouvoir | `holy-tenetnid-tablet-of-voices:sanity-of-gave:6` | 3 | 0 | 0 |
| Tablette des voix | Faveurs de Gave | pouvoir | `holy-tenetnid-tablet-of-voices:favorites-of-gave:7` | 4 | 0 | 0 |
| Tablette des voix | Pacte divin | pouvoir | `holy-tenetnid-tablet-of-voices:divine-pact:8` | 4 | 1 | 0 |
| Tablette du bouclier | Entraves de la terre consacrée | pouvoir | `holy-tenetnid-tablet-of-the-shield:snares-of-the-holy-ground:0` | 3 | 0 | 0 |
| Tablette du bouclier | Refuge | pouvoir | `holy-tenetnid-tablet-of-the-shield:sheltering:1` | 2 | 0 | 0 |
| Tablette du bouclier | Mur d’épines | pouvoir | `holy-tenetnid-tablet-of-the-shield:thornwall:3` | 7 | 0 | 0 |
| Tablette du bouclier | Protection contre les éléments | pouvoir | `holy-tenetnid-tablet-of-the-shield:storm-protection:2` | 2 | 0 | 0 |
| Tablette du bouclier | Impuissance des démons | pouvoir | `holy-tenetnid-tablet-of-the-shield:demonic-impotence:5` | 2 | 0 | 0 |
| Tablette du bouclier | Peau d’écorce | pouvoir | `holy-tenetnid-tablet-of-the-shield:bark-skin:4` | 3 | 0 | 1 |
| Tablette du bouclier | Résistance au vitner | pouvoir | `holy-tenetnid-tablet-of-the-shield:vitner-resistance:6` | 3 | 1 | 0 |
| Tablette du bouclier | Bannissement | pouvoir | `holy-tenetnid-tablet-of-the-shield:banishment:7` | 2 | 0 | 0 |
| Tablette du bouclier | Refuge arboricole | pouvoir | `holy-tenetnid-tablet-of-the-shield:tree-port:8` | 3 | 1 | 1 |
| Tablette du chevalier | Armure bénie | pouvoir | `holy-tenetnid-tablet-of-the-knight:blessed-armor:0` | 4 | 0 | 0 |
| Tablette du chevalier | Lance bénie | pouvoir | `holy-tenetnid-tablet-of-the-knight:blessed-spear:1` | 4 | 0 | 0 |
| Tablette du chevalier | Cuirasse des gardiens du Rortan | pouvoir | `holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3` | 4 | 0 | 0 |
| Tablette du chevalier | Sainte autorité | pouvoir | `holy-tenetnid-tablet-of-the-knight:holy-authority:2` | 4 | 0 | 0 |
| Tablette du chevalier | Chaîne de bataille des gardiens du Rortan | pouvoir | `holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5` | 4 | 0 | 0 |
| Tablette du chevalier | Révélation majestueuse | pouvoir | `holy-tenetnid-tablet-of-the-knight:majestic-revelation:4` | 5 | 1 | 0 |
| Tablette du chevalier | Armure blanche de Belo Seoth | pouvoir | `holy-tenetnid-tablet-of-the-knight:belo-seoth-s-white-armor:6` | 4 | 0 | 0 |
| Tablette du chevalier | Hache de Belo Seoth | pouvoir | `holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7` | 4 | 0 | 0 |
| Tablette du chevalier | Aura de Gave | pouvoir | `holy-tenetnid-tablet-of-the-knight:guise-of-gave:8` | 5 | 1 | 0 |
| Tablette du soleil | Lueur de l’aube | pouvoir | `holy-tenetnid-tablet-of-the-sun:dawn-shine:0` | 3 | 0 | 0 |
| Tablette du soleil | Sol protecteur | pouvoir | `holy-tenetnid-tablet-of-the-sun:protective-ground:1` | 4 | 0 | 0 |
| Tablette du soleil | Augure | pouvoir | `holy-tenetnid-tablet-of-the-sun:augury:2` | 1 | 0 | 0 |
| Tablette du soleil | Lumière rassurante | pouvoir | `holy-tenetnid-tablet-of-the-sun:thermal-light:3` | 4 | 0 | 0 |
| Tablette du soleil | Foyer béni | pouvoir | `holy-tenetnid-tablet-of-the-sun:blessed-home:5` | 4 | 0 | 0 |
| Tablette du soleil | Présage | pouvoir | `holy-tenetnid-tablet-of-the-sun:omen:4` | 1 | 0 | 0 |
| Tablette du soleil | Bosquet sacré | pouvoir | `holy-tenetnid-tablet-of-the-sun:sacred-grove:6` | 4 | 0 | 0 |
| Tablette du soleil | Radiance sacrée | pouvoir | `holy-tenetnid-tablet-of-the-sun:holy-radiance:7` | 3 | 0 | 0 |
| Tablette du soleil | Oracle | pouvoir | `holy-tenetnid-tablet-of-the-sun:portent:8` | 1 | 0 | 0 |
| Pouvoir de la bête | Instinct du prédateur | pouvoir | `holy-haminges-power-of-the-beast:mind-of-the-predator:1` | 3 | 0 | 0 |
| Pouvoir de la bête | Résilience | pouvoir | `holy-haminges-power-of-the-beast:resilience:0` | 2 | 0 | 1 |
| Pouvoir de la bête | Défenses du mastomant | pouvoir | `holy-haminges-power-of-the-beast:mastomant-s-tusks:2` | 3 | 0 | 1 |
| Pouvoir de la bête | Endurance du sanglier | pouvoir | `holy-haminges-power-of-the-beast:endurance-of-the-boar:3` | 2 | 0 | 1 |
| Pouvoir de la bête | Fourrure du mastomant | pouvoir | `holy-haminges-power-of-the-beast:mastomant-s-fur:4` | 2 | 0 | 0 |
| Pouvoir de la bête | Griffes du loup | pouvoir | `holy-haminges-power-of-the-beast:wolf-claws:5` | 3 | 0 | 0 |
| Pouvoir de la bête | Endurance du géant | pouvoir | `holy-haminges-power-of-the-beast:endurance-of-the-giant:6` | 2 | 0 | 1 |
| Pouvoir de la bête | Maître des loups | pouvoir | `holy-haminges-power-of-the-beast:master-of-wolfkin:7` | 4 | 0 | 0 |
| Pouvoir de la bête | Aspect du mastomant | pouvoir | `holy-haminges-power-of-the-beast:mastomantshape:8` | 4 | 0 | 1 |
| Puissance de l'écaille | Cri effrayant | pouvoir | `holy-haminges-power-of-the-scale:dreadful-screech:0` | 2 | 0 | 0 |
| Puissance de l'écaille | Esprit brisé | pouvoir | `holy-haminges-power-of-the-scale:shattered-mind:1` | 3 | 0 | 0 |
| Puissance de l'écaille | Hurlement terrifiant | pouvoir | `holy-haminges-power-of-the-scale:terrifying-howl:2` | 2 | 0 | 0 |
| Puissance de l'écaille | Sang régénérant | pouvoir | `holy-haminges-power-of-the-scale:regenerative-blood:3` | 1 | 0 | 0 |
| Puissance de l'écaille | Membre de pierre | pouvoir | `holy-haminges-power-of-the-scale:limb-of-stone:5` | 4 | 1 | 4 |
| Puissance de l'écaille | Sang du lindwurm | pouvoir | `holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4` | 1 | 0 | 0 |
| Puissance de l'écaille | Clameur de la dévoreuse | pouvoir | `holy-haminges-power-of-the-scale:scream-of-the-devouress:6` | 2 | 0 | 0 |
| Puissance de l'écaille | Cœur du lindwurm | pouvoir | `holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8` | 2 | 0 | 1 |
| Puissance de l'écaille | Pétrification | pouvoir | `holy-haminges-power-of-the-scale:petrify:7` | 3 | 1 | 3 |
| Puissance des hommes | Accompli | pouvoir | `holy-haminges-power-of-men:accomplished:1` | 3 | 0 | 0 |
| Puissance des hommes | Vision des nains | pouvoir | `holy-haminges-power-of-men:sight-of-the-dwarves:0` | 2 | 0 | 1 |
| Puissance des hommes | Maître | pouvoir | `holy-haminges-power-of-men:mastery:3` | 3 | 0 | 0 |
| Puissance des hommes | Mixture curative | pouvoir | `holy-haminges-power-of-men:curative-draught:2` | 2 | 0 | 0 |
| Puissance des hommes | Potion de guérison | pouvoir | `holy-haminges-power-of-men:remedial-potion:4` | 2 | 0 | 0 |
| Puissance des hommes | Prouesse martiale | pouvoir | `holy-haminges-power-of-men:weapon-prowess:5` | 1 | 0 | 0 |
| Puissance des hommes | Forgeron nain | pouvoir | `holy-haminges-power-of-men:dwarven-smith:6` | 2 | 0 | 0 |
| Puissance des hommes | Légendaire | pouvoir | `holy-haminges-power-of-men:legendary:7` | 2 | 0 | 0 |
| Puissance des hommes | Élixir de vie de la dévoreuse | pouvoir | `holy-haminges-power-of-men:life-elixir-of-the-devouress:8` | 2 | 0 | 0 |
| Puissance des trolls | Infection | pouvoir | `holy-haminges-power-of-trolls:disease-carrier:0` | 3 | 1 | 0 |
| Puissance des trolls | Volonté | pouvoir | `holy-haminges-power-of-trolls:willpower:1` | 2 | 0 | 0 |
| Puissance des trolls | Sans peur | pouvoir | `holy-haminges-power-of-trolls:fearless:3` | 3 | 0 | 0 |
| Puissance des trolls | Tours illusoires | pouvoir | `holy-haminges-power-of-trolls:illusion-tricks:2` | 3 | 0 | 0 |
| Puissance des trolls | Contagion | pouvoir | `holy-haminges-power-of-trolls:contagious:4` | 3 | 1 | 0 |
| Puissance des trolls | Persuasion | pouvoir | `holy-haminges-power-of-trolls:persuade:5` | 4 | 1 | 0 |
| Puissance des trolls | Hardiesse des trolls | pouvoir | `holy-haminges-power-of-trolls:troll-wit:7` | 2 | 0 | 0 |
| Puissance des trolls | Seigneur des mouches | pouvoir | `holy-haminges-power-of-trolls:lord-of-the-flies:6` | 3 | 1 | 0 |
| Puissance des trolls | Charme de la montagne | pouvoir | `holy-haminges-power-of-trolls:taken-by-the-mountain:8` | 4 | 2 | 0 |
| Puissance des tursirs | Force du troll | pouvoir | `holy-haminges-power-of-the-thurses:troll-strength:1` | 2 | 0 | 1 |
| Puissance des tursirs | Peau du hrimtroll | pouvoir | `holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0` | 1 | 0 | 0 |
| Puissance des tursirs | Force du stenhinje | pouvoir | `holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3` | 2 | 0 | 1 |
| Puissance des tursirs | Fureur de l’ogre des montagnes | pouvoir | `holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2` | 3 | 0 | 1 |
| Puissance des tursirs | Folie de l’ogre des montagnes | pouvoir | `holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4` | 4 | 0 | 1 |
| Puissance des tursirs | Souffle du hrimtroll | pouvoir | `holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5` | 5 | 1 | 0 |
| Puissance des tursirs | Force du tursir | pouvoir | `holy-haminges-power-of-the-thurses:thurse-strength:7` | 2 | 0 | 1 |
| Puissance des tursirs | Rage du destructeur | pouvoir | `holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6` | 4 | 0 | 1 |
| Puissance des tursirs | Corps de glace du hrimtroll | pouvoir | `holy-haminges-power-of-the-thurses:the-hrim-troll-s-rime-body:8` | 4 | 1 | 0 |
| Puissance du dragon | Constriction | pouvoir | `holy-haminges-power-of-the-dragon:constriction:0` | 2 | 0 | 0 |
| Puissance du dragon | Ravage du huvfurwurm | pouvoir | `holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1` | 1 | 0 | 1 |
| Puissance du dragon | Fils des flammes | pouvoir | `holy-haminges-power-of-the-dragon:flame-hardened:2` | 2 | 0 | 1 |
| Puissance du dragon | Regard paralysant | pouvoir | `holy-haminges-power-of-the-dragon:paralyzing-gaze:3` | 2 | 1 | 1 |
| Puissance du dragon | Attaque du huvfurwurm | pouvoir | `holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5` | 1 | 0 | 1 |
| Puissance du dragon | Peau du dragon | pouvoir | `holy-haminges-power-of-the-dragon:dragon-skin:4` | 3 | 0 | 1 |
| Puissance du dragon | Tête du huvfurwurm | pouvoir | `holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6` | 3 | 0 | 1 |
| Puissance du dragon | Âme du dragon | pouvoir | `holy-haminges-power-of-the-dragon:dragon-soul:7` | 3 | 0 | 1 |
| Puissance du dragon | Aspect du serpent géant | pouvoir | `holy-haminges-power-of-the-dragon:giant-snakeshape:8` | 5 | 0 | 1 |
| Aspect de la pierre | Aspect de la pierre | rune | `holy-thuuldom-stoneshape:stoneshape:0` | 5 | 1 | 0 |
| Branchies du brochet | Branchies du brochet | rune | `holy-thuuldom-gills-of-the-blackfish:gills-of-the-blackfish:0` | 0 | 0 | 0 |
| Chaleur des profondeurs | Chaleur des profondeurs | rune | `holy-thuuldom-heat-of-the-depths:heat-of-the-depths:0` | 5 | 0 | 0 |
| Choc de l'enclume | Choc de l'enclume | rune | `holy-thuuldom-anvil-shock:anvil-shock:0` | 5 | 0 | 0 |
| Croc de Yukk | Croc de Yukk | rune | `holy-thuuldom-fang-of-yukk:fang-of-yukk:0` | 5 | 0 | 0 |
| Écailles | Écailles | rune | `holy-thuuldom-scales:scales:0` | 5 | 0 | 0 |
| Enfant de la pierre | Enfant de la pierre | rune | `holy-thuuldom-stoneling:stoneling:0` | 5 | 0 | 0 |
| Main de Borjorn | Main de Borjorn | rune | `holy-thuuldom-borjorn-s-hand:borjorn-s-hand:0` | 5 | 0 | 0 |
| Marque de Brokk | Marque de Brokk | rune | `holy-thuuldom-mark-of-brokk:mark-of-brokk:0` | 5 | 0 | 0 |
| Poings d'acier | Poings d’acier | rune | `holy-thuuldom-hammer-fists:hammer-fists:0` | 5 | 0 | 1 |
| Pouvoir de réparation | Pouvoir de réparation | rune | `holy-thuuldom-power-of-repair:power-of-repair:0` | 5 | 0 | 0 |
| Prise de l'araignée des cavernes | Prise de l’araignée des cavernes | rune | `holy-thuuldom-cave-spider-s-grip:cave-spider-s-grip:0` | 5 | 0 | 0 |
| Rune de guérison | Rune de guérison | rune | `holy-thuuldom-healing-rune:healing-rune:0` | 5 | 0 | 0 |
| Sang du labyrinthe | Sang du labyrinthe | rune | `holy-thuuldom-labyrinth-blood:labyrinth-blood:0` | 5 | 2 | 0 |
| Source d’eau | Source d’eau | rune | `holy-thuuldom-well-of-water:well-of-water:0` | 5 | 0 | 0 |
| Transformation de pierre en argile | Transformation de pierre en argile | rune | `holy-thuuldom-stone-to-clay:stone-to-clay:0` | 5 | 0 | 0 |
| Tremblement de terre | Tremblement de terre | rune | `holy-thuuldom-earthquake:earthquake:0` | 5 | 1 | 0 |
| Agilité du lynx | Chemin forestier | pouvoir | `holy-toikalokke-lynx-power:tree-walk:1` | 3 | 0 | 0 |
| Agilité du lynx | Orientation | pouvoir | `holy-toikalokke-lynx-power:orientation:0` | 3 | 0 | 0 |
| Agilité du lynx | Bond du félin | pouvoir | `holy-toikalokke-lynx-power:feline-leap:3` | 2 | 1 | 0 |
| Agilité du lynx | Ouïe fine | pouvoir | `holy-toikalokke-lynx-power:hearing:2` | 4 | 0 | 0 |
| Agilité du lynx | Pistage | pouvoir | `holy-toikalokke-lynx-power:track:6` | 3 | 0 | 0 |
| Agilité du lynx | Réflexes de félin | pouvoir | `holy-toikalokke-lynx-power:feline-reflexes:4` | 1 | 0 | 0 |
| Agilité du lynx | Visée | pouvoir | `holy-toikalokke-lynx-power:aim:5` | 2 | 0 | 0 |
| Agilité du lynx | Camouflage | pouvoir | `holy-toikalokke-lynx-power:concealment:7` | 2 | 2 | 0 |
| Agilité du lynx | Sentier forestier | pouvoir | `holy-toikalokke-lynx-power:forest-path:8` | 3 | 0 | 0 |
| Agilité du lynx | Éclaireur | pouvoir | `holy-toikalokke-lynx-power:pathfinder:9` | 3 | 0 | 0 |
| Esprit animal | Ami des animaux | pouvoir | `holy-toikalokke-animal-mind:animal-friend:0` | 3 | 1 | 0 |
| Esprit animal | Traces animales | pouvoir | `holy-toikalokke-animal-mind:animal-tracks:1` | 3 | 0 | 0 |
| Esprit animal | Invisibilité aux animaux | pouvoir | `holy-toikalokke-animal-mind:invisible-to-animals:3` | 2 | 0 | 0 |
| Esprit animal | Parler avec les animaux | pouvoir | `holy-toikalokke-animal-mind:talk-to-animals:2` | 3 | 0 | 0 |
| Esprit animal | Esprit de la bête | pouvoir | `holy-toikalokke-animal-mind:animal-spirit:4` | 2 | 0 | 5 |
| Esprit animal | Maître des animaux | pouvoir | `holy-toikalokke-animal-mind:animal-master:5` | 2 | 0 | 0 |
| Esprit animal | Aspect animal | pouvoir | `holy-toikalokke-animal-mind:animal-shape:6` | 2 | 0 | 5 |
| Maître des éléments | Contrôle du feu | pouvoir | `holy-toikalokke-master-of-elements:control-fire:1` | 3 | 0 | 0 |
| Maître des éléments | Don de l’eau | pouvoir | `holy-toikalokke-master-of-elements:gift-of-water:3` | 1 | 1 | 1 |
| Maître des éléments | Mur de terre | pouvoir | `holy-toikalokke-master-of-elements:earth-wall:0` | 3 | 0 | 0 |
| Maître des éléments | Purification de l’eau | pouvoir | `holy-toikalokke-master-of-elements:purify-water:2` | 2 | 1 | 0 |
| Maître des éléments | Dompteur du feu | pouvoir | `holy-toikalokke-master-of-elements:fire-tamer:4` | 4 | 0 | 0 |
| Maître des éléments | Façonnage de la terre | pouvoir | `holy-toikalokke-master-of-elements:shape-earth:5` | 3 | 0 | 0 |
| Maître des éléments | Flèche élémentaire | pouvoir | `holy-toikalokke-master-of-elements:elemental-arrow:6` | 3 | 0 | 0 |
| Maître des éléments | Source d’eau | pouvoir | `holy-toikalokke-master-of-elements:spring-of-water:8` | 3 | 0 | 0 |
| Maître des éléments | Tremblement de terre | pouvoir | `holy-toikalokke-master-of-elements:earthquake:7` | 4 | 1 | 0 |
| Maître des éléments | Chaud et froid | pouvoir | `holy-toikalokke-master-of-elements:hot-and-cold:10` | 4 | 0 | 0 |
| Maître des éléments | Contrôle des vents | pouvoir | `holy-toikalokke-master-of-elements:control-wind:9` | 4 | 0 | 0 |
| Maître des éléments | Résistance au feu | pouvoir | `holy-toikalokke-master-of-elements:fire-resistant:11` | 4 | 0 | 0 |
| Fureur d’Ogon | Flèche de bataille | pouvoir | `holy-joaringfaith-fury-of-ogon:battle-arrow:0` | 1 | 0 | 0 |
| Fureur d’Ogon | Sang brûlant | pouvoir | `holy-joaringfaith-fury-of-ogon:simmering-blood:1` | 2 | 0 | 1 |
| Fureur d’Ogon | Rage | pouvoir | `holy-joaringfaith-fury-of-ogon:rage:2` | 1 | 0 | 2 |
| Fureur d’Ogon | Sang bouillant | pouvoir | `holy-joaringfaith-fury-of-ogon:boiling-blood:3` | 2 | 0 | 1 |
| Fureur d’Ogon | Folie | pouvoir | `holy-joaringfaith-fury-of-ogon:madness:4` | 1 | 0 | 2 |
| Fureur d’Ogon | Pluie de flèches | pouvoir | `holy-joaringfaith-fury-of-ogon:shower-of-arrows:5` | 2 | 0 | 0 |
| Fureur d’Ogon | Embrasement du sang | pouvoir | `holy-joaringfaith-fury-of-ogon:bloodfire:6` | 2 | 0 | 1 |
| Fureur d’Ogon | Cieux obscurcis | pouvoir | `holy-joaringfaith-fury-of-ogon:blacken-the-sky:7` | 2 | 0 | 0 |
| Fureur d’Ogon | Riastarthae | pouvoir | `holy-joaringfaith-fury-of-ogon:riastarthae:8` | 1 | 0 | 2 |
| Puissance de Sille | Guérison | pouvoir | `holy-joaringfaith-power-of-sille:healing:0` | 2 | 0 | 0 |
| Puissance de Sille | Rayons du soleil | pouvoir | `holy-joaringfaith-power-of-sille:sunray:1` | 1 | 0 | 0 |
| Puissance de Sille | Cœur de l’été | pouvoir | `holy-joaringfaith-power-of-sille:summer-place:2` | 1 | 0 | 0 |
| Puissance de Sille | Lumière guérisseuse | pouvoir | `holy-joaringfaith-power-of-sille:healing-glow:3` | 1 | 0 | 0 |
| Puissance de Sille | Chaleur guérisseuse | pouvoir | `holy-joaringfaith-power-of-sille:healing-warmth:4` | 3 | 0 | 0 |
| Puissance de Sille | Pouvoir de Firon | pouvoir | `holy-joaringfaith-power-of-sille:firon-power:5` | 1 | 0 | 0 |
| Puissance de Sille | Heure de la chasse | pouvoir | `holy-joaringfaith-power-of-sille:time-of-the-hunt:6` | 2 | 0 | 0 |
| Puissance de Sille | Souffle de Sille | pouvoir | `holy-joaringfaith-power-of-sille:breath-of-sille:7` | 3 | 0 | 0 |
| Puissance de Sille | Soleil guérisseur | pouvoir | `holy-joaringfaith-power-of-sille:healing-sun:8` | 1 | 0 | 0 |
| Vue de Lekaba | Pistage | pouvoir | `holy-joaringfaith-sight-of-lekaba:tracking:0` | 3 | 0 | 0 |
| Vue de Lekaba | Examen d’objet | pouvoir | `holy-joaringfaith-sight-of-lekaba:scanning:1` | 2 | 0 | 0 |
| Vue de Lekaba | Vision lointaine | pouvoir | `holy-joaringfaith-sight-of-lekaba:far-sight:2` | 8 | 0 | 0 |
| Vue de Lekaba | Espionnage | pouvoir | `holy-joaringfaith-sight-of-lekaba:espionage:3` | 3 | 0 | 0 |
| Vue de Lekaba | Vision parfaite | pouvoir | `holy-joaringfaith-sight-of-lekaba:seeing:4` | 4 | 0 | 0 |
| Vue de Lekaba | Lecture des pouvoirs | pouvoir | `holy-joaringfaith-sight-of-lekaba:read-powers:5` | 2 | 1 | 0 |
| Vue de Lekaba | Voyage astral | pouvoir | `holy-joaringfaith-sight-of-lekaba:astral-voyage:6` | 4 | 0 | 0 |
| Vue de Lekaba | Vision véritable | pouvoir | `holy-joaringfaith-sight-of-lekaba:true-sight:7` | 8 | 1 | 0 |
| Malédictions de Sonntag | Déracinement | pouvoir | `holy-joaringfaith-curses-of-sonntag:uprooted-tree:0` | 4 | 1 | 0 |
| Malédictions de Sonntag | Mal imaginaire | pouvoir | `holy-joaringfaith-curses-of-sonntag:phantom-plague:1` | 3 | 1 | 0 |
| Malédictions de Sonntag | Fièvre | pouvoir | `holy-joaringfaith-curses-of-sonntag:fever:2` | 6 | 1 | 0 |
| Malédictions de Sonntag | Malédiction d’objet | pouvoir | `holy-joaringfaith-curses-of-sonntag:curse-object:3` | 5 | 0 | 0 |
| Malédictions de Sonntag | Amnésie | pouvoir | `holy-joaringfaith-curses-of-sonntag:amnesia:4` | 3 | 2 | 0 |
| Malédictions de Sonntag | Malédiction de créature | pouvoir | `holy-joaringfaith-curses-of-sonntag:curse-creature:5` | 5 | 0 | 0 |
| Malédictions de Sonntag | Mauvaise récolte | pouvoir | `holy-joaringfaith-curses-of-sonntag:bad-harvest:6` | 6 | 0 | 0 |
| Malédictions de Sonntag | Malédiction de l’arbre | pouvoir | `holy-joaringfaith-curses-of-sonntag:tree-curse:7` | 6 | 1 | 2 |
