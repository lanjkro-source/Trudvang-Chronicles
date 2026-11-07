// Family icons for every catalog power. This is the visual source of truth shared by the
// item sheets, actor lists and compendium packs. Each power belongs to exactly one family
// and family icons stay unique within a tablet (they may repeat across tablets).
// Families are thematic groupings; the label comments document the reviewed family map.
export const TABLET_POWER_FAMILIES = {
  "vitner-animal-vitner": [
    // Messagers
    {
      icon: "fa-envelope",
      powers: [
        "vitner-animal-vitner:messenger:0",
        "vitner-animal-vitner:create-messenger:7",
        "vitner-animal-vitner:send-message:8"
      ]
    },
    // Animaux
    {
      icon: "fa-paw",
      powers: [
        "vitner-animal-vitner:speak-to-animals:1",
        "vitner-animal-vitner:call-on-animals:2",
        "vitner-animal-vitner:control-animals:4"
      ]
    },
    // Totems et possession
    {
      icon: "fa-dna",
      powers: [
        "vitner-animal-vitner:conjure-ravens:3",
        "vitner-animal-vitner:mind-of-the-wolf:5",
        "vitner-animal-vitner:possess-animals:6"
      ]
    }
  ],
  "vitner-body-vitner": [
    // Sens
    {
      icon: "fa-eye",
      powers: [
        "vitner-body-vitner:hearing-deafness:2",
        "vitner-body-vitner:sense-of-smell:3",
        "vitner-body-vitner:vision-blindness:4"
      ]
    },
    // Métamorphose
    {
      icon: "fa-dna",
      powers: [
        "vitner-body-vitner:appearance-change:7",
        "vitner-body-vitner:change-creature:11"
      ]
    },
    // Protection et entrave
    {
      icon: "fa-shield-halved",
      powers: [
        "vitner-body-vitner:leather-skin:5",
        "vitner-body-vitner:immobilize:6",
        "vitner-body-vitner:imprison:10"
      ]
    },
    // Mobilité
    {
      icon: "fa-person-running",
      powers: [
        "vitner-body-vitner:grip:0",
        "vitner-body-vitner:tipping:1"
      ]
    },
    // Améliorations
    {
      icon: "fa-arrow-trend-up",
      powers: [
        "vitner-body-vitner:strengthen:8",
        "vitner-body-vitner:hasten:9"
      ]
    }
  ],
  "vitner-delusion-vitner": [
    // Sons
    {
      icon: "fa-volume-high",
      powers: [
        "vitner-delusion-vitner:roar:0",
        "vitner-delusion-vitner:phantom-sound:1",
        "vitner-delusion-vitner:shriek:2",
        "vitner-delusion-vitner:increase-sounds:3",
        "vitner-delusion-vitner:ghost-voice:5"
      ]
    },
    // Images
    {
      icon: "fa-masks-theater",
      powers: [
        "vitner-delusion-vitner:depict:6",
        "vitner-delusion-vitner:landscape-illusion:8",
        "vitner-delusion-vitner:lindwurm-illusion:10"
      ]
    },
    // Dissimulation
    {
      icon: "fa-moon",
      powers: [
        "vitner-delusion-vitner:traceless:4",
        "vitner-delusion-vitner:camouflage:7",
        "vitner-delusion-vitner:silence:9",
        "vitner-delusion-vitner:invisibility:11"
      ]
    }
  ],
  "vitner-dimvitner": [
    // Morts-vivants
    {
      icon: "fa-skull",
      powers: [
        "vitner-dimvitner:animate-undead:0",
        "vitner-dimvitner:dismiss-undead:2",
        "vitner-dimvitner:control-undead:7"
      ]
    },
    // Esprits et nécromancie
    {
      icon: "fa-ghost",
      powers: [
        "vitner-dimvitner:speak-to-undead:3",
        "vitner-dimvitner:vitner-theft:5",
        "vitner-dimvitner:summon-wight:6"
      ]
    },
    // Ténèbres de Dimhall
    {
      icon: "fa-moon",
      powers: [
        "vitner-dimvitner:hand-of-death:1",
        "vitner-dimvitner:tendril-of-dimhall:4",
        "vitner-dimvitner:darkness-of-dimhall:8"
      ]
    }
  ],
  "vitner-flame-craft": [
    // Flammes
    {
      icon: "fa-fire-flame-curved",
      powers: [
        "vitner-flame-craft:burning-hand:2",
        "vitner-flame-craft:flame-burst:3",
        "vitner-flame-craft:sea-of-fire:7"
      ]
    },
    // Chaleur
    {
      icon: "fa-temperature-high",
      powers: [
        "vitner-flame-craft:heat-water:0",
        "vitner-flame-craft:warmth:6"
      ]
    },
    // Protection et contrôle
    {
      icon: "fa-shield-halved",
      powers: [
        "vitner-flame-craft:spark:1",
        "vitner-flame-craft:protection-from-fire:4",
        "vitner-flame-craft:flame-control:5"
      ]
    }
  ],
  "vitner-perceiving": [
    // Orientation et pistes
    {
      icon: "fa-map",
      powers: [
        "vitner-perceiving:find-home:0",
        "vitner-perceiving:retrace-tracks:1",
        "vitner-perceiving:orientation:3",
        "vitner-perceiving:map:7"
      ]
    },
    // Détection et environnement
    {
      icon: "fa-magnifying-glass",
      powers: [
        "vitner-perceiving:detect-object:2",
        "vitner-perceiving:detect-being:4",
        "vitner-perceiving:detect-undead:5",
        "vitner-perceiving:surrounding:6"
      ]
    }
  ],
  "vitner-power-of-thought": [
    // Langage et télépathie
    {
      icon: "fa-language",
      powers: [
        "vitner-power-of-thought:understanding-script:0",
        "vitner-power-of-thought:understanding-speech:1",
        "vitner-power-of-thought:telepathy:4"
      ]
    },
    // Émotions et esprit
    {
      icon: "fa-brain",
      powers: [
        "vitner-power-of-thought:courage:2",
        "vitner-power-of-thought:fear:3",
        "vitner-power-of-thought:ecstasy:5",
        "vitner-power-of-thought:aura-of-power:9"
      ]
    },
    // Mémoire et influence
    {
      icon: "fa-eye",
      powers: [
        "vitner-power-of-thought:imagining:6",
        "vitner-power-of-thought:memory:7",
        "vitner-power-of-thought:mind-reading:11"
      ]
    },
    // Contrôle
    {
      icon: "fa-dna",
      powers: [
        "vitner-power-of-thought:creature-control:8",
        "vitner-power-of-thought:possess-creature:10"
      ]
    }
  ],
  "vitner-power-of-vision": [
    // Perception
    {
      icon: "fa-eye",
      powers: [
        "vitner-power-of-vision:far-sight:2",
        "vitner-power-of-vision:seeing:3",
        "vitner-power-of-vision:true-sight:7"
      ]
    },
    // Révélation
    {
      icon: "fa-magnifying-glass",
      powers: [
        "vitner-power-of-vision:tracking:0",
        "vitner-power-of-vision:scanning:1",
        "vitner-power-of-vision:read-vitner:6"
      ]
    },
    // Exploration
    {
      icon: "fa-binoculars",
      powers: [
        "vitner-power-of-vision:espionage:4",
        "vitner-power-of-vision:astral-voyage:5"
      ]
    }
  ],
  "vitner-soil-craft": [
    // Projectiles de terre
    {
      icon: "fa-meteor",
      powers: [
        "vitner-soil-craft:rock-throw:0",
        "vitner-soil-craft:soil-blast:4"
      ]
    },
    // Terrains instables
    {
      icon: "fa-house-crack",
      powers: [
        "vitner-soil-craft:earthquake:2",
        "vitner-soil-craft:quagmire:3"
      ]
    },
    // Façonnage et pétrification
    {
      icon: "fa-gem",
      powers: [
        "vitner-soil-craft:shape-soil:1",
        "vitner-soil-craft:shape-stone:6",
        "vitner-soil-craft:petrify-remove-petrification:8"
      ]
    },
    // Traversée
    {
      icon: "fa-person-running",
      powers: [
        "vitner-soil-craft:soil-walk:5",
        "vitner-soil-craft:stone-walk:7"
      ]
    }
  ],
  "vitner-vitner-craft": [
    // Enchantement
    {
      icon: "fa-wand-magic-sparkles",
      powers: [
        "vitner-vitner-craft:enchant-object:2",
        "vitner-vitner-craft:enchant-being:4",
        "vitner-vitner-craft:seal:5"
      ]
    },
    // Manipulation
    {
      icon: "fa-arrows-spin",
      powers: [
        "vitner-vitner-craft:channeling:0",
        "vitner-vitner-craft:vitner-pouch:1",
        "vitner-vitner-craft:dispel-vitner:6",
        "vitner-vitner-craft:trace-vitner:7"
      ]
    },
    // Protection
    {
      icon: "fa-shield-halved",
      powers: [
        "vitner-vitner-craft:anti-magic:3",
        "vitner-vitner-craft:wall-of-vitner:8"
      ]
    }
  ],
  "vitner-vitner-of-objects": [
    // Analyse
    {
      icon: "fa-magnifying-glass",
      powers: [
        "vitner-vitner-of-objects:detect-composition:0"
      ]
    },
    // Manipulation
    {
      icon: "fa-gears",
      powers: [
        "vitner-vitner-of-objects:waterproof:1",
        "vitner-vitner-of-objects:bind:2",
        "vitner-vitner-of-objects:rust:3",
        "vitner-vitner-of-objects:unlock-lock:5",
        "vitner-vitner-of-objects:enlarge-reduce-object:6",
        "vitner-vitner-of-objects:alter-object:7"
      ]
    },
    // Création et enchantement
    {
      icon: "fa-hammer",
      powers: [
        "vitner-vitner-of-objects:alarm-object:4",
        "vitner-vitner-of-objects:create-object:8"
      ]
    }
  ],
  "vitner-water-craft": [
    // Eau et purification
    {
      icon: "fa-water",
      powers: [
        "vitner-water-craft:find-water:0",
        "vitner-water-craft:purify-water:1",
        "vitner-water-craft:create-water:4"
      ]
    },
    // Adaptation aquatique
    {
      icon: "fa-person-swimming",
      powers: [
        "vitner-water-craft:breathe:2",
        "vitner-water-craft:water-walk:7",
        "vitner-water-craft:wave-master:8"
      ]
    },
    // Contrôle de l'eau
    {
      icon: "fa-cloud-rain",
      powers: [
        "vitner-water-craft:form-water:3",
        "vitner-water-craft:solid-water:5",
        "vitner-water-craft:control-precipitation:6"
      ]
    }
  ],
  "vitner-wind-craft": [
    // Vent
    {
      icon: "fa-wind",
      powers: [
        "vitner-wind-craft:wind-gust:1",
        "vitner-wind-craft:control-wind:3",
        "vitner-wind-craft:wind-blast:7",
        "vitner-wind-craft:storm:8"
      ]
    },
    // Protection
    {
      icon: "fa-shield-halved",
      powers: [
        "vitner-wind-craft:purify-air:0",
        "vitner-wind-craft:air-armor:4",
        "vitner-wind-craft:air-shield:6"
      ]
    },
    // Brouillard et déplacement
    {
      icon: "fa-cloud",
      powers: [
        "vitner-wind-craft:fog:2",
        "vitner-wind-craft:lift:5",
        "vitner-wind-craft:wind-catcher:9"
      ]
    }
  ],
  "vitner-witchcraft": [
    // Malédictions de la nature
    {
      icon: "fa-leaf",
      powers: [
        "vitner-witchcraft:uprooted-tree:0",
        "vitner-witchcraft:bad-harvest:6",
        "vitner-witchcraft:tree-curse:7"
      ]
    },
    // Maladie et esprit
    {
      icon: "fa-biohazard",
      powers: [
        "vitner-witchcraft:phantom-plague:1",
        "vitner-witchcraft:fever:2",
        "vitner-witchcraft:amnesia:4"
      ]
    },
    // Malédictions ciblées
    {
      icon: "fa-hammer",
      powers: [
        "vitner-witchcraft:curse-object:3",
        "vitner-witchcraft:curse-creature:5"
      ]
    }
  ],
  "holy-gerbanis-influence-of-jorn": [
    // Ténèbres et dissimulation
    {
      icon: "fa-moon",
      powers: [
        "holy-gerbanis-influence-of-jorn:wall-of-dusk:1",
        "holy-gerbanis-influence-of-jorn:night-curtain:3",
        "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4"
      ]
    },
    // Montures spirituelles
    {
      icon: "fa-horse",
      powers: [
        "holy-gerbanis-influence-of-jorn:falfax:2",
        "holy-gerbanis-influence-of-jorn:asiblack:6",
        "holy-gerbanis-influence-of-jorn:snarfari:8"
      ]
    },
    // Énergie de mort
    {
      icon: "fa-skull",
      powers: [
        "holy-gerbanis-influence-of-jorn:death-gust:0",
        "holy-gerbanis-influence-of-jorn:the-breath-of-mogunda:5",
        "holy-gerbanis-influence-of-jorn:will-of-bodvildur:7"
      ]
    }
  ],
  "holy-gerbanis-power-of-enken": [
    // Perception
    {
      icon: "fa-eye",
      powers: [
        "holy-gerbanis-power-of-enken:night-vision:0",
        "holy-gerbanis-power-of-enken:soul-sight:4",
        "holy-gerbanis-power-of-enken:eye-of-enken:8"
      ]
    },
    // Courage
    {
      icon: "fa-heart",
      powers: [
        "holy-gerbanis-power-of-enken:willpower:1",
        "holy-gerbanis-power-of-enken:bold:2",
        "holy-gerbanis-power-of-enken:heart-of-enken:6"
      ]
    },
    // Protection des vents
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-gerbanis-power-of-enken:wind-shield:3",
        "holy-gerbanis-power-of-enken:storm-armor:5",
        "holy-gerbanis-power-of-enken:hurricane-armor:7"
      ]
    }
  ],
  "holy-gerbanis-strength-of-stormi": [
    // Force physique
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-gerbanis-strength-of-stormi:troll-strength:0",
        "holy-gerbanis-strength-of-stormi:hinji-strength:3",
        "holy-gerbanis-strength-of-stormi:jotun-strength:6"
      ]
    },
    // Autorité et voix
    {
      icon: "fa-volume-high",
      powers: [
        "holy-gerbanis-strength-of-stormi:voice-of-command:1",
        "holy-gerbanis-strength-of-stormi:jarl-s-call:4",
        "holy-gerbanis-strength-of-stormi:voice-of-stormi:7"
      ]
    },
    // Esprits guerriers
    {
      icon: "fa-ghost",
      powers: [
        "holy-gerbanis-strength-of-stormi:havar:2",
        "holy-gerbanis-strength-of-stormi:shield-disir:5",
        "holy-gerbanis-strength-of-stormi:einharjar:8"
      ]
    }
  ],
  "holy-gerbanis-warmth-of-sunvei": [
    // Soins
    {
      icon: "fa-heart-pulse",
      powers: [
        "holy-gerbanis-warmth-of-sunvei:healing:0",
        "holy-gerbanis-warmth-of-sunvei:healing-glow:2",
        "holy-gerbanis-warmth-of-sunvei:healing-warmth:5"
      ]
    },
    // Lumière et chaleur
    {
      icon: "fa-sun",
      powers: [
        "holy-gerbanis-warmth-of-sunvei:sunray:1",
        "holy-gerbanis-warmth-of-sunvei:summer-place:3",
        "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6"
      ]
    },
    // Purification
    {
      icon: "fa-hand-holding-medical",
      powers: [
        "holy-gerbanis-warmth-of-sunvei:firon-power:4",
        "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7",
        "holy-gerbanis-warmth-of-sunvei:healing-sun:8"
      ]
    }
  ],
  "holy-gerbanis-wisdom-of-windinna": [
    // Inspiration et création
    {
      icon: "fa-lightbulb",
      powers: [
        "holy-gerbanis-wisdom-of-windinna:inspiration:0",
        "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2",
        "holy-gerbanis-wisdom-of-windinna:swine-rush:6"
      ]
    },
    // Esprit et vérité
    {
      icon: "fa-brain",
      powers: [
        "holy-gerbanis-wisdom-of-windinna:sixth-sense:1",
        "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4",
        "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7"
      ]
    },
    // Protection mentale
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-gerbanis-wisdom-of-windinna:steel-mind:3",
        "holy-gerbanis-wisdom-of-windinna:vitner-protection:5",
        "holy-gerbanis-wisdom-of-windinna:hearth-of-windinna:8"
      ]
    }
  ],
  "holy-gerbanis-wrath-of-tyrd": [
    // Feu
    {
      icon: "fa-fire-flame-curved",
      powers: [
        "holy-gerbanis-wrath-of-tyrd:fire-iron:0",
        "holy-gerbanis-wrath-of-tyrd:pyre-mark:3",
        "holy-gerbanis-wrath-of-tyrd:firestorm:6"
      ]
    },
    // Cris de guerre
    {
      icon: "fa-volume-high",
      powers: [
        "holy-gerbanis-wrath-of-tyrd:battle-cry:1",
        "holy-gerbanis-wrath-of-tyrd:war-cry:4",
        "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7"
      ]
    },
    // Terreur
    {
      icon: "fa-ghost",
      powers: [
        "holy-gerbanis-wrath-of-tyrd:wolf-tongue:2",
        "holy-gerbanis-wrath-of-tyrd:dark-visage:5",
        "holy-gerbanis-wrath-of-tyrd:tyrd-s-bellow:8"
      ]
    }
  ],
  "holy-ealdtradition-gift-of-thanja": [
    // Camouflage forestier
    {
      icon: "fa-tree",
      powers: [
        "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0",
        "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5",
        "holy-ealdtradition-gift-of-thanja:forest-denizen:7"
      ]
    },
    // Langues
    {
      icon: "fa-language",
      powers: [
        "holy-ealdtradition-gift-of-thanja:animal-speech:1",
        "holy-ealdtradition-gift-of-thanja:bestial-tongue:3",
        "holy-ealdtradition-gift-of-thanja:dragon-tongue:6"
      ]
    },
    // Métamorphose
    {
      icon: "fa-dna",
      powers: [
        "holy-ealdtradition-gift-of-thanja:stagshape:2",
        "holy-ealdtradition-gift-of-thanja:salmonshape:4",
        "holy-ealdtradition-gift-of-thanja:ravenshape:8"
      ]
    }
  ],
  "holy-ealdtradition-halawen-s-offering": [
    // Lances ancestrales
    {
      icon: "fa-arrow-up",
      powers: [
        "holy-ealdtradition-halawen-s-offering:bloodfangsbane:2",
        "holy-ealdtradition-halawen-s-offering:bolgemek:4",
        "holy-ealdtradition-halawen-s-offering:roggdrasil:8"
      ]
    },
    // Courage des ancêtres
    {
      icon: "fa-heart",
      powers: [
        "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0",
        "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3",
        "holy-ealdtradition-halawen-s-offering:fearless:6"
      ]
    },
    // Protection contre le vitner
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-ealdtradition-halawen-s-offering:vitner-shield:1",
        "holy-ealdtradition-halawen-s-offering:witch-wall:5",
        "holy-ealdtradition-halawen-s-offering:mistur-barrier:7"
      ]
    }
  ],
  "holy-ealdtradition-heritage-of-majne": [
    // Bières
    {
      icon: "fa-beer-mug-empty",
      powers: [
        "holy-ealdtradition-heritage-of-majne:strong-beer:0",
        "holy-ealdtradition-heritage-of-majne:hero-s-brew:4",
        "holy-ealdtradition-heritage-of-majne:king-s-ale:7"
      ]
    },
    // Tueurs de monstres
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-ealdtradition-heritage-of-majne:trollslayer:1",
        "holy-ealdtradition-heritage-of-majne:giantslayer:2",
        "holy-ealdtradition-heritage-of-majne:dragonslayer:6"
      ]
    },
    // Esprits royaux
    {
      icon: "fa-crown",
      powers: [
        "holy-ealdtradition-heritage-of-majne:king-s-militia:3",
        "holy-ealdtradition-heritage-of-majne:king-s-guard:5",
        "holy-ealdtradition-heritage-of-majne:the-nine-kings:8"
      ]
    }
  ],
  "holy-ealdtradition-magh-s-gift": [
    // Chants
    {
      icon: "fa-music",
      powers: [
        "holy-ealdtradition-magh-s-gift:rider-s-melody:1",
        "holy-ealdtradition-magh-s-gift:hero-s-song:4",
        "holy-ealdtradition-magh-s-gift:king-s-anthem:6"
      ]
    },
    // Geas et entraves
    {
      icon: "fa-link",
      powers: [
        "holy-ealdtradition-magh-s-gift:magh-s-tether:2",
        "holy-ealdtradition-magh-s-gift:magh-s-chain:5",
        "holy-ealdtradition-magh-s-gift:magh-s-hawser:7"
      ]
    },
    // Voyage et saisons
    {
      icon: "fa-cloud-sun",
      powers: [
        "holy-ealdtradition-magh-s-gift:journey-wind:0",
        "holy-ealdtradition-magh-s-gift:elf-summer:3",
        "holy-ealdtradition-magh-s-gift:harvest-year:8"
      ]
    }
  ],
  "holy-ealdtradition-nema-s-usefulness": [
    // Sens animaux
    {
      icon: "fa-paw",
      powers: [
        "holy-ealdtradition-nema-s-usefulness:horse-ears:0",
        "holy-ealdtradition-nema-s-usefulness:owl-hearing:3",
        "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7"
      ]
    },
    // Vent libérateur
    {
      icon: "fa-wind",
      powers: [
        "holy-ealdtradition-nema-s-usefulness:gust-of-release:1",
        "holy-ealdtradition-nema-s-usefulness:freeing-breeze:4",
        "holy-ealdtradition-nema-s-usefulness:liberating-wind:6"
      ]
    },
    // Voyage brumeux
    {
      icon: "fa-route",
      powers: [
        "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2",
        "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5",
        "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8"
      ]
    }
  ],
  "holy-ealdtradition-tribute-of-morgu": [
    // Sang
    {
      icon: "fa-droplet",
      powers: [
        "holy-ealdtradition-tribute-of-morgu:simmering-blood:0",
        "holy-ealdtradition-tribute-of-morgu:boiling-blood:2",
        "holy-ealdtradition-tribute-of-morgu:bloodfire:6"
      ]
    },
    // Flèches
    {
      icon: "fa-arrow-up",
      powers: [
        "holy-ealdtradition-tribute-of-morgu:battle-arrow:1",
        "holy-ealdtradition-tribute-of-morgu:shower-of-arrows:4",
        "holy-ealdtradition-tribute-of-morgu:blacken-the-sky:8"
      ]
    },
    // Rage
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-ealdtradition-tribute-of-morgu:rage:3",
        "holy-ealdtradition-tribute-of-morgu:madness:5",
        "holy-ealdtradition-tribute-of-morgu:riastarthae:7"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-anger": [
    // Évocation de Gave
    {
      icon: "fa-droplet",
      powers: [
        "holy-tenetnid-tablet-of-anger:power-of-blood:0",
        "holy-tenetnid-tablet-of-anger:visions-of-the-oak:3",
        "holy-tenetnid-tablet-of-anger:memory-of-a-martyr:7"
      ]
    },
    // Projectile sacré
    {
      icon: "fa-bolt",
      powers: [
        "holy-tenetnid-tablet-of-anger:holy-bolt:1",
        "holy-tenetnid-tablet-of-anger:sacred-burst:4",
        "holy-tenetnid-tablet-of-anger:divine-purge:6"
      ]
    },
    // Pétrification
    {
      icon: "fa-monument",
      powers: [
        "holy-tenetnid-tablet-of-anger:stone-senses:2",
        "holy-tenetnid-tablet-of-anger:statue:5",
        "holy-tenetnid-tablet-of-anger:stone-monument:8"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-grace": [
    // Soins par le toucher
    {
      icon: "fa-hand-holding-heart",
      powers: [
        "holy-tenetnid-tablet-of-grace:hand-of-mercy:0",
        "holy-tenetnid-tablet-of-grace:will-of-bete-wiemdas:2",
        "holy-tenetnid-tablet-of-grace:hand-of-gave:7"
      ]
    },
    // Soins progressifs
    {
      icon: "fa-heart-pulse",
      powers: [
        "holy-tenetnid-tablet-of-grace:holy-mending:1",
        "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4",
        "holy-tenetnid-tablet-of-grace:breath-of-gave:6"
      ]
    },
    // Résurrection
    {
      icon: "fa-dove",
      powers: [
        "holy-tenetnid-tablet-of-grace:life-spirit:3",
        "holy-tenetnid-tablet-of-grace:recall:5",
        "holy-tenetnid-tablet-of-grace:wind-of-immortality:8"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-the-knight": [
    // Armures bénies
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-tenetnid-tablet-of-the-knight:blessed-armor:0",
        "holy-tenetnid-tablet-of-the-knight:rowthguard-cuirass:3",
        "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-white-armor:6"
      ]
    },
    // Armes bénies
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-tenetnid-tablet-of-the-knight:blessed-spear:1",
        "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5",
        "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7"
      ]
    },
    // Autorité sacrée
    {
      icon: "fa-crown",
      powers: [
        "holy-tenetnid-tablet-of-the-knight:holy-authority:2",
        "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4",
        "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-the-shield": [
    // Refuges naturels
    {
      icon: "fa-tree",
      powers: [
        "holy-tenetnid-tablet-of-the-shield:sheltering:1",
        "holy-tenetnid-tablet-of-the-shield:bark-skin:4",
        "holy-tenetnid-tablet-of-the-shield:tree-port:8"
      ]
    },
    // Anti-démons
    {
      icon: "fa-skull",
      powers: [
        "holy-tenetnid-tablet-of-the-shield:snares-of-the-holy-ground:0",
        "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5",
        "holy-tenetnid-tablet-of-the-shield:banishment:7"
      ]
    },
    // Protections
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-tenetnid-tablet-of-the-shield:storm-protection:2",
        "holy-tenetnid-tablet-of-the-shield:thornwall:3",
        "holy-tenetnid-tablet-of-the-shield:vitner-resistance:6"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-the-sun": [
    // Lumière
    {
      icon: "fa-sun",
      powers: [
        "holy-tenetnid-tablet-of-the-sun:dawn-shine:0",
        "holy-tenetnid-tablet-of-the-sun:thermal-light:3",
        "holy-tenetnid-tablet-of-the-sun:holy-radiance:7"
      ]
    },
    // Divination
    {
      icon: "fa-eye",
      powers: [
        "holy-tenetnid-tablet-of-the-sun:augury:2",
        "holy-tenetnid-tablet-of-the-sun:omen:4",
        "holy-tenetnid-tablet-of-the-sun:portent:8"
      ]
    },
    // Protection sacrée
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-tenetnid-tablet-of-the-sun:protective-ground:1",
        "holy-tenetnid-tablet-of-the-sun:blessed-home:5",
        "holy-tenetnid-tablet-of-the-sun:sacred-grove:6"
      ]
    }
  ],
  "holy-tenetnid-tablet-of-voices": [
    // Langues
    {
      icon: "fa-language",
      powers: [
        "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1",
        "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3",
        "holy-tenetnid-tablet-of-voices:sanity-of-gave:6"
      ]
    },
    // Bénédictions
    {
      icon: "fa-hands-praying",
      powers: [
        "holy-tenetnid-tablet-of-voices:holy-consideration:0",
        "holy-tenetnid-tablet-of-voices:kindred-s-bond:4",
        "holy-tenetnid-tablet-of-voices:favorites-of-gave:7"
      ]
    },
    // Liens et pactes
    {
      icon: "fa-handshake",
      powers: [
        "holy-tenetnid-tablet-of-voices:blood-brothers:2",
        "holy-tenetnid-tablet-of-voices:grace-of-gave:5",
        "holy-tenetnid-tablet-of-voices:divine-pact:8"
      ]
    }
  ],
  "holy-haminges-power-of-the-beast": [
    // Corps bestial
    {
      icon: "fa-heart-pulse",
      powers: [
        "holy-haminges-power-of-the-beast:resilience:0",
        "holy-haminges-power-of-the-beast:endurance-of-the-boar:3",
        "holy-haminges-power-of-the-beast:endurance-of-the-giant:6"
      ]
    },
    // Armes naturelles
    {
      icon: "fa-tooth",
      powers: [
        "holy-haminges-power-of-the-beast:mastomant-s-tusks:2",
        "holy-haminges-power-of-the-beast:mastomant-s-fur:4",
        "holy-haminges-power-of-the-beast:wolf-claws:5"
      ]
    },
    // Instinct et transformation
    {
      icon: "fa-paw",
      powers: [
        "holy-haminges-power-of-the-beast:mind-of-the-predator:1",
        "holy-haminges-power-of-the-beast:master-of-wolfkin:7",
        "holy-haminges-power-of-the-beast:mastomantshape:8"
      ]
    }
  ],
  "holy-haminges-power-of-the-dragon": [
    // Bras du huvfurwurm
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1",
        "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5",
        "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6"
      ]
    },
    // Draconique
    {
      icon: "fa-dragon",
      powers: [
        "holy-haminges-power-of-the-dragon:flame-hardened:2",
        "holy-haminges-power-of-the-dragon:dragon-skin:4",
        "holy-haminges-power-of-the-dragon:dragon-soul:7"
      ]
    },
    // Serpent et paralysie
    {
      icon: "fa-staff-snake",
      powers: [
        "holy-haminges-power-of-the-dragon:constriction:0",
        "holy-haminges-power-of-the-dragon:paralyzing-gaze:3",
        "holy-haminges-power-of-the-dragon:giant-snakeshape:8"
      ]
    }
  ],
  "holy-haminges-power-of-men": [
    // Maîtrise
    {
      icon: "fa-award",
      powers: [
        "holy-haminges-power-of-men:accomplished:1",
        "holy-haminges-power-of-men:mastery:3",
        "holy-haminges-power-of-men:legendary:7"
      ]
    },
    // Potions
    {
      icon: "fa-flask",
      powers: [
        "holy-haminges-power-of-men:curative-draught:2",
        "holy-haminges-power-of-men:remedial-potion:4",
        "holy-haminges-power-of-men:life-elixir-of-the-devouress:8"
      ]
    },
    // Arts nains
    {
      icon: "fa-hammer",
      powers: [
        "holy-haminges-power-of-men:sight-of-the-dwarves:0",
        "holy-haminges-power-of-men:weapon-prowess:5",
        "holy-haminges-power-of-men:dwarven-smith:6"
      ]
    }
  ],
  "holy-haminges-power-of-the-scale": [
    // Terreur
    {
      icon: "fa-ghost",
      powers: [
        "holy-haminges-power-of-the-scale:dreadful-screech:0",
        "holy-haminges-power-of-the-scale:shattered-mind:1",
        "holy-haminges-power-of-the-scale:terrifying-howl:2",
        "holy-haminges-power-of-the-scale:scream-of-the-devouress:6"
      ]
    },
    // Régénération
    {
      icon: "fa-droplet",
      powers: [
        "holy-haminges-power-of-the-scale:regenerative-blood:3",
        "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4",
        "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8"
      ]
    },
    // Pétrification
    {
      icon: "fa-mountain-sun",
      powers: [
        "holy-haminges-power-of-the-scale:limb-of-stone:5",
        "holy-haminges-power-of-the-scale:petrify:7"
      ]
    }
  ],
  "holy-haminges-power-of-the-thurses": [
    // Force
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-haminges-power-of-the-thurses:troll-strength:1",
        "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3",
        "holy-haminges-power-of-the-thurses:thurse-strength:7"
      ]
    },
    // Rage
    {
      icon: "fa-fire-flame-curved",
      powers: [
        "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2",
        "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4",
        "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6"
      ]
    },
    // Froid du hrimtroll
    {
      icon: "fa-snowflake",
      powers: [
        "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0",
        "holy-haminges-power-of-the-thurses:breath-of-the-hrim-troll:5",
        "holy-haminges-power-of-the-thurses:the-hrim-troll-s-rime-body:8"
      ]
    }
  ],
  "holy-haminges-power-of-trolls": [
    // Maladie
    {
      icon: "fa-biohazard",
      powers: [
        "holy-haminges-power-of-trolls:disease-carrier:0",
        "holy-haminges-power-of-trolls:contagious:4",
        "holy-haminges-power-of-trolls:lord-of-the-flies:6"
      ]
    },
    // Courage
    {
      icon: "fa-heart",
      powers: [
        "holy-haminges-power-of-trolls:willpower:1",
        "holy-haminges-power-of-trolls:fearless:3",
        "holy-haminges-power-of-trolls:troll-wit:7"
      ]
    },
    // Illusion et contrôle
    {
      icon: "fa-masks-theater",
      powers: [
        "holy-haminges-power-of-trolls:illusion-tricks:2",
        "holy-haminges-power-of-trolls:persuade:5",
        "holy-haminges-power-of-trolls:taken-by-the-mountain:8"
      ]
    }
  ],
  "holy-thuuldom-anvil-shock": [
    {
      icon: "fa-hammer",
      powers: [
        "holy-thuuldom-anvil-shock:anvil-shock:0"
      ]
    }
  ],
  "holy-thuuldom-borjorn-s-hand": [
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-thuuldom-borjorn-s-hand:borjorn-s-hand:0"
      ]
    }
  ],
  "holy-thuuldom-cave-spider-s-grip": [
    {
      icon: "fa-spider",
      powers: [
        "holy-thuuldom-cave-spider-s-grip:cave-spider-s-grip:0"
      ]
    }
  ],
  "holy-thuuldom-earthquake": [
    {
      icon: "fa-mountain-sun",
      powers: [
        "holy-thuuldom-earthquake:earthquake:0"
      ]
    }
  ],
  "holy-thuuldom-fang-of-yukk": [
    {
      icon: "fa-tooth",
      powers: [
        "holy-thuuldom-fang-of-yukk:fang-of-yukk:0"
      ]
    }
  ],
  "holy-thuuldom-gills-of-the-blackfish": [
    {
      icon: "fa-fish",
      powers: [
        "holy-thuuldom-gills-of-the-blackfish:gills-of-the-blackfish:0"
      ]
    }
  ],
  "holy-thuuldom-hammer-fists": [
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-thuuldom-hammer-fists:hammer-fists:0"
      ]
    }
  ],
  "holy-thuuldom-healing-rune": [
    {
      icon: "fa-heart-pulse",
      powers: [
        "holy-thuuldom-healing-rune:healing-rune:0"
      ]
    }
  ],
  "holy-thuuldom-heat-of-the-depths": [
    {
      icon: "fa-temperature-high",
      powers: [
        "holy-thuuldom-heat-of-the-depths:heat-of-the-depths:0"
      ]
    }
  ],
  "holy-thuuldom-labyrinth-blood": [
    {
      icon: "fa-route",
      powers: [
        "holy-thuuldom-labyrinth-blood:labyrinth-blood:0"
      ]
    }
  ],
  "holy-thuuldom-mark-of-brokk": [
    {
      icon: "fa-stamp",
      powers: [
        "holy-thuuldom-mark-of-brokk:mark-of-brokk:0"
      ]
    }
  ],
  "holy-thuuldom-power-of-repair": [
    {
      icon: "fa-screwdriver-wrench",
      powers: [
        "holy-thuuldom-power-of-repair:power-of-repair:0"
      ]
    }
  ],
  "holy-thuuldom-scales": [
    {
      icon: "fa-shield-halved",
      powers: [
        "holy-thuuldom-scales:scales:0"
      ]
    }
  ],
  "holy-thuuldom-stoneling": [
    {
      icon: "fa-cubes",
      powers: [
        "holy-thuuldom-stoneling:stoneling:0"
      ]
    }
  ],
  "holy-thuuldom-stone-to-clay": [
    {
      icon: "fa-mountain-sun",
      powers: [
        "holy-thuuldom-stone-to-clay:stone-to-clay:0"
      ]
    }
  ],
  "holy-thuuldom-stoneshape": [
    {
      icon: "fa-mountain-sun",
      powers: [
        "holy-thuuldom-stoneshape:stoneshape:0"
      ]
    }
  ],
  "holy-thuuldom-well-of-water": [
    {
      icon: "fa-water",
      powers: [
        "holy-thuuldom-well-of-water:well-of-water:0"
      ]
    }
  ],
  "holy-toikalokke-animal-mind": [
    // Communication animale
    {
      icon: "fa-paw",
      powers: [
        "holy-toikalokke-animal-mind:animal-friend:0",
        "holy-toikalokke-animal-mind:talk-to-animals:2",
        "holy-toikalokke-animal-mind:animal-master:5"
      ]
    },
    // Traces et dissimulation
    {
      icon: "fa-shoe-prints",
      powers: [
        "holy-toikalokke-animal-mind:animal-tracks:1",
        "holy-toikalokke-animal-mind:invisible-to-animals:3"
      ]
    },
    // Métamorphose
    {
      icon: "fa-dna",
      powers: [
        "holy-toikalokke-animal-mind:animal-spirit:4",
        "holy-toikalokke-animal-mind:animal-shape:6"
      ]
    }
  ],
  "holy-toikalokke-lynx-power": [
    // Déplacement forestier
    {
      icon: "fa-route",
      powers: [
        "holy-toikalokke-lynx-power:orientation:0",
        "holy-toikalokke-lynx-power:tree-walk:1",
        "holy-toikalokke-lynx-power:forest-path:8",
        "holy-toikalokke-lynx-power:pathfinder:9"
      ]
    },
    // Perception
    {
      icon: "fa-eye",
      powers: [
        "holy-toikalokke-lynx-power:hearing:2",
        "holy-toikalokke-lynx-power:track:6",
        "holy-toikalokke-lynx-power:concealment:7"
      ]
    },
    // Agilité et précision
    {
      icon: "fa-crosshairs",
      powers: [
        "holy-toikalokke-lynx-power:feline-leap:3",
        "holy-toikalokke-lynx-power:feline-reflexes:4",
        "holy-toikalokke-lynx-power:aim:5"
      ]
    }
  ],
  "holy-toikalokke-master-of-elements": [
    // Terre
    {
      icon: "fa-mountain-sun",
      powers: [
        "holy-toikalokke-master-of-elements:earth-wall:0",
        "holy-toikalokke-master-of-elements:shape-earth:5",
        "holy-toikalokke-master-of-elements:earthquake:7"
      ]
    },
    // Feu
    {
      icon: "fa-fire-flame-curved",
      powers: [
        "holy-toikalokke-master-of-elements:control-fire:1",
        "holy-toikalokke-master-of-elements:fire-tamer:4",
        "holy-toikalokke-master-of-elements:fire-resistant:11",
        "holy-toikalokke-master-of-elements:elemental-arrow:6"
      ]
    },
    // Eau
    {
      icon: "fa-water",
      powers: [
        "holy-toikalokke-master-of-elements:purify-water:2",
        "holy-toikalokke-master-of-elements:gift-of-water:3",
        "holy-toikalokke-master-of-elements:spring-of-water:8"
      ]
    },
    // Air
    {
      icon: "fa-wind",
      powers: [
        "holy-toikalokke-master-of-elements:control-wind:9"
      ]
    },
    // Énergie élémentaire
    {
      icon: "fa-bolt",
      powers: [
        "holy-toikalokke-master-of-elements:hot-and-cold:10"
      ]
    }
  ],
  "holy-joaringfaith-fury-of-ogon": [
    // Sang
    {
      icon: "fa-droplet",
      powers: [
        "holy-joaringfaith-fury-of-ogon:simmering-blood:1",
        "holy-joaringfaith-fury-of-ogon:boiling-blood:3",
        "holy-joaringfaith-fury-of-ogon:bloodfire:6"
      ]
    },
    // Flèches
    {
      icon: "fa-arrow-up",
      powers: [
        "holy-joaringfaith-fury-of-ogon:battle-arrow:0",
        "holy-joaringfaith-fury-of-ogon:shower-of-arrows:5",
        "holy-joaringfaith-fury-of-ogon:blacken-the-sky:7"
      ]
    },
    // Rage
    {
      icon: "fa-hand-fist",
      powers: [
        "holy-joaringfaith-fury-of-ogon:rage:2",
        "holy-joaringfaith-fury-of-ogon:madness:4",
        "holy-joaringfaith-fury-of-ogon:riastarthae:8"
      ]
    }
  ],
  "holy-joaringfaith-power-of-sille": [
    // Soins
    {
      icon: "fa-heart-pulse",
      powers: [
        "holy-joaringfaith-power-of-sille:healing:0",
        "holy-joaringfaith-power-of-sille:healing-glow:3",
        "holy-joaringfaith-power-of-sille:healing-warmth:4"
      ]
    },
    // Lumière et chaleur
    {
      icon: "fa-sun",
      powers: [
        "holy-joaringfaith-power-of-sille:sunray:1",
        "holy-joaringfaith-power-of-sille:summer-place:2",
        "holy-joaringfaith-power-of-sille:time-of-the-hunt:6"
      ]
    },
    // Purification
    {
      icon: "fa-hand-holding-medical",
      powers: [
        "holy-joaringfaith-power-of-sille:firon-power:5",
        "holy-joaringfaith-power-of-sille:breath-of-sille:7",
        "holy-joaringfaith-power-of-sille:healing-sun:8"
      ]
    }
  ],
  "holy-joaringfaith-sight-of-lekaba": [
    // Vision
    {
      icon: "fa-eye",
      powers: [
        "holy-joaringfaith-sight-of-lekaba:far-sight:2",
        "holy-joaringfaith-sight-of-lekaba:seeing:4",
        "holy-joaringfaith-sight-of-lekaba:true-sight:7"
      ]
    },
    // Révélation
    {
      icon: "fa-magnifying-glass",
      powers: [
        "holy-joaringfaith-sight-of-lekaba:tracking:0",
        "holy-joaringfaith-sight-of-lekaba:scanning:1",
        "holy-joaringfaith-sight-of-lekaba:read-powers:5"
      ]
    },
    // Exploration
    {
      icon: "fa-binoculars",
      powers: [
        "holy-joaringfaith-sight-of-lekaba:espionage:3",
        "holy-joaringfaith-sight-of-lekaba:astral-voyage:6"
      ]
    }
  ],
  "holy-joaringfaith-curses-of-sonntag": [
    // Malédiction de la nature
    {
      icon: "fa-leaf",
      powers: [
        "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0",
        "holy-joaringfaith-curses-of-sonntag:bad-harvest:6",
        "holy-joaringfaith-curses-of-sonntag:tree-curse:7"
      ]
    },
    // Maladie et esprit
    {
      icon: "fa-biohazard",
      powers: [
        "holy-joaringfaith-curses-of-sonntag:phantom-plague:1",
        "holy-joaringfaith-curses-of-sonntag:fever:2",
        "holy-joaringfaith-curses-of-sonntag:amnesia:4"
      ]
    },
    // Malédictions ciblées
    {
      icon: "fa-hammer",
      powers: [
        "holy-joaringfaith-curses-of-sonntag:curse-object:3",
        "holy-joaringfaith-curses-of-sonntag:curse-creature:5"
      ]
    }
  ]
};

const iconEntries = Object.values(TABLET_POWER_FAMILIES)
  .flatMap(families => families.flatMap(family => family.powers.map(id => [id, family.icon])));
export const POWER_FAMILY_ICON_BY_ID = new Map(iconEntries);

export function familyIconClassForId(id) {
  return POWER_FAMILY_ICON_BY_ID.get(id) ?? null;
}
