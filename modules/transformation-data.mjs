// Generated from authoritative FR effectTemplates. Text belongs to lang/*.json.
export const TRANSFORMATION_TEMPLATES = {
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-annuler-une-petrification": {
    "id": "petrification-annuler-une-petrification",
    "icon": "icons/svg/aura.svg",
    "duration": "1d6 + 2 jours",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "10",
        "phase": "initial"
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 100,
      "naturalArmor": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 1,
        "target": "duration",
        "value": 2592000
      },
      {
        "index": 2,
        "target": "duration",
        "value": 31536000
      }
    ]
  },
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": []
  },
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": []
  },
  "vitner-witchcraft:tree-curse:7#malediction-de-l-arbre": {
    "id": "malediction-de-l-arbre",
    "icon": "icons/svg/aura.svg",
    "duration": "2d6 jours",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "4",
        "phase": "initial"
      }
    ],
    "statuses": [
      "restrain"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true
    },
    "related": [
      "tree-recovery"
    ],
    "sourceId": "vitner-witchcraft:tree-curse:7",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800
      },
      {
        "index": 3,
        "target": "duration",
        "value": 2592000
      },
      {
        "index": 4,
        "target": "duration",
        "value": 31536000
      }
    ]
  },
  "vitner-witchcraft:tree-curse:7#tree-recovery": {
    "id": "tree-recovery",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "testFactor": {
        "agility": 0.5,
        "movement": 0.5
      }
    },
    "related": [],
    "sourceId": "vitner-witchcraft:tree-curse:7",
    "parameters": []
  },
  "vitner-body-vitner:hasten:9#hate": {
    "id": "hate",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "dexterity",
          "method": "degrees",
          "value": 1
        }
      ]
    },
    "related": [],
    "sourceId": "vitner-body-vitner:hasten:9",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600
      }
    ]
  },
  "vitner-body-vitner:hasten:9#hate-inverse": {
    "id": "hate-inverse",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "dexterity",
          "method": "degrees",
          "value": -1
        }
      ]
    },
    "related": [],
    "sourceId": "vitner-body-vitner:hasten:9",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600
      }
    ]
  },
  "vitner-body-vitner:strengthen:8#vigueur": {
    "id": "vigueur",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "degrees",
          "value": 1
        }
      ]
    },
    "related": [],
    "sourceId": "vitner-body-vitner:strengthen:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600
      }
    ]
  },
  "vitner-body-vitner:strengthen:8#vigueur-inverse": {
    "id": "vigueur-inverse",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "degrees",
          "value": -1
        }
      ]
    },
    "related": [],
    "sourceId": "vitner-body-vitner:strengthen:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600
      }
    ]
  },
  "vitner-body-vitner:change-creature:11#transformation": {
    "id": "transformation",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "changes": [],
    "statuses": [],
    "rules": {
      "chooseBestiary": true,
      "formPolicy": "physical",
      "preserveHP": true,
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "vitner-body-vitner:change-creature:11",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:troll-strength:0#force-du-troll": {
    "id": "force-du-troll",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 4
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:troll-strength:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:hinji-strength:3#force-de-hinje": {
    "id": "force-de-hinje",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 6
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:hinji-strength:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun": {
    "id": "force-du-jotun",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 8
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:jotun-strength:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-gerbanis-power-of-enken:willpower:1#force-d-ame": {
    "id": "force-d-ame",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "psyche",
          "method": "replace",
          "value": 4
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-power-of-enken:willpower:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-gerbanis-power-of-enken:bold:2#temerite": {
    "id": "temerite",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "psyche",
          "method": "replace",
          "value": 6
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-power-of-enken:bold:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken": {
    "id": "c-ur-d-enken",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "psyche",
          "method": "replace",
          "value": 8
        }
      ]
    },
    "related": [],
    "sourceId": "holy-gerbanis-power-of-enken:heart-of-enken:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf": {
    "id": "aspect-du-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "highest",
          "value": 1
        },
        {
          "trait": "constitution",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 2
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 9,
          "maxActions": 0
        }
      ],
      "suspendEquipment": true,
      "senseCount": 1,
      "vision": "lightAmplification",
      "capabilityCount": 1
    },
    "related": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:stagshape:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon": {
    "id": "aspect-du-saumon",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "dexterity",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "replace",
          "value": 0
        },
        {
          "mode": "swim",
          "method": "baseMultiple",
          "value": 2
        }
      ],
      "suspendEquipment": true,
      "senseCount": 1,
      "capabilityCount": 2
    },
    "related": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:salmonshape:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau": {
    "id": "aspect-du-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "dexterity",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "constitution",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 0.5
        },
        {
          "mode": "flight",
          "method": "baseMultiple",
          "value": 4
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "defense": -5,
      "suspendEquipment": true,
      "senseCount": 2,
      "vision": "lightAmplification",
      "capabilityCount": 2
    },
    "related": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:ravenshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:simmering-blood:0#simmering-blood": {
    "id": "simmering-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "1d10"
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:simmering-blood:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:rage:3#rage": {
    "id": "rage",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "1",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 5,
      "damage": {
        "value": 2,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10",
      "size": 1
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:rage:3",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:rage:3#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:rage:3",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:boiling-blood:2#boiling-blood": {
    "id": "boiling-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "2d10"
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:boiling-blood:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:madness:5#folie": {
    "id": "folie",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 10,
      "damage": {
        "value": 4,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10 (JO 10)",
      "size": 1.5
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:madness:5",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:madness:5#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:madness:5",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:bloodfire:6#bloodfire": {
    "id": "bloodfire",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "3d10"
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:bloodfire:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:riastarthae:7#riastarthae": {
    "id": "riastarthae",
    "icon": "icons/svg/aura.svg",
    "duration": "7 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "3",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 15,
      "damage": {
        "value": 6,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10 (JO 9-10)",
      "size": 2,
      "ignoreWounds": true
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:riastarthae:7",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:riastarthae:7#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-ealdtradition-tribute-of-morgu:riastarthae:7",
    "parameters": []
  },
  "holy-ealdtradition-nema-s-usefulness:owl-hearing:3#ouie-du-hibou": {
    "id": "ouie-du-hibou",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-ealdtradition-nema-s-usefulness:owl-hearing:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7#sens-du-griffon": {
    "id": "sens-du-griffon",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:statue:5#statue": {
    "id": "statue",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#monument-en-pierre": {
    "id": "monument-en-pierre",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "changes": [],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-the-shield:bark-skin:4#peau-d-ecorce": {
    "id": "peau-d-ecorce",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "temporaryHP": 10,
      "endAtEmptyHP": true
    },
    "related": [],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:bark-skin:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 2,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:tree-port:8#refuge-arboricole": {
    "id": "refuge-arboricole",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "8",
        "phase": "initial"
      }
    ],
    "statuses": [
      "restrain"
    ],
    "rules": {
      "suspendEquipment": true,
      "damageTakenFactor": 0.2
    },
    "related": [],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:tree-port:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-beast:resilience:0#resilience": {
    "id": "resilience",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "constitution",
          "method": "replace",
          "value": 4
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-beast:resilience:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-beast:mastomant-s-tusks:2#defenses-du-mastomant": {
    "id": "defenses-du-mastomant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 0,
          "maxActions": 1
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-beast:mastomant-s-tusks:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-beast:endurance-of-the-boar:3#endurance-du-sanglier": {
    "id": "endurance-du-sanglier",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "constitution",
          "method": "replace",
          "value": 6
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-beast:endurance-of-the-boar:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-beast:endurance-of-the-giant:6#endurance-du-geant": {
    "id": "endurance-du-geant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "constitution",
          "method": "replace",
          "value": 8
        }
      ],
      "immunities": [
        "poison",
        "maladie"
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-beast:endurance-of-the-giant:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-beast:mastomantshape:8#aspect-du-mastomant": {
    "id": "aspect-du-mastomant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "4",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 6
        }
      ],
      "immunities": [
        "toutes les formes de froid"
      ],
      "size": 7,
      "temporaryHP": 30,
      "attacks": [
        {
          "damage": "2d10",
          "openRoll": 9,
          "maxActions": 0
        }
      ],
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-beast:mastomantshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1
      },
      {
        "index": 3,
        "target": "temporaryHP",
        "value": 10
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-gauche": {
    "id": "membre-de-pierrebras-gauche",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-droit": {
    "id": "membre-de-pierrebras-droit",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-gauche": {
    "id": "membre-de-pierrejambe-gauche",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-droite": {
    "id": "membre-de-pierrejambe-droite",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60
      }
    ]
  },
  "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8#c-ur-du-lindwurm": {
    "id": "c-ur-du-lindwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800
      }
    ]
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification": {
    "id": "petrification",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "changes": [],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      }
    ]
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": []
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": []
  },
  "holy-haminges-power-of-the-thurses:troll-strength:1#force-du-troll": {
    "id": "force-du-troll",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 4
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:troll-strength:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3#force-du-stenhinje": {
    "id": "force-du-stenhinje",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 6
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2#fureur-de-l-ogre-des-montagnes": {
    "id": "fureur-de-l-ogre-des-montagnes",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "temporaryHP": 3,
      "damage": {
        "value": 1,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4#folie-de-l-ogre-des-montagnes": {
    "id": "folie-de-l-ogre-des-montagnes",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "1",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 6,
      "damage": {
        "value": 3,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:thurse-strength:7#force-du-tursir": {
    "id": "force-du-tursir",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "replace",
          "value": 8
        }
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:thurse-strength:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6#rage-du-destructeur": {
    "id": "rage-du-destructeur",
    "icon": "icons/svg/aura.svg",
    "duration": "7 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 10,
      "damage": {
        "value": 5,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10 (JO 10)"
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1#ravage-du-huvfurwurm": {
    "id": "ravage-du-huvfurwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "rules": {
      "extraWeaponAction": {
        "combatPoints": 5
      }
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1",
    "parameters": []
  },
  "holy-haminges-power-of-the-dragon:flame-hardened:2#fils-des-flammes": {
    "id": "fils-des-flammes",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "damage": {
        "value": 1,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "immunities": [
        "flammes non magiques"
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:flame-hardened:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:paralyzing-gaze:3#regard-paralysant": {
    "id": "regard-paralysant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 round",
    "changes": [],
    "statuses": [
      "paralysis"
    ],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:paralyzing-gaze:3",
    "parameters": []
  },
  "holy-haminges-power-of-the-dragon:dragon-skin:4#peau-du-dragon": {
    "id": "peau-du-dragon",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "4",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "damage": {
        "value": 2,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "immunities": [
        "flammes non magiques"
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:dragon-skin:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6#tete-du-huvfurwurm": {
    "id": "tete-du-huvfurwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:dragon-soul:7#ame-du-dragon": {
    "id": "ame-du-dragon",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "6",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "damage": {
        "value": 4,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "immunities": [
        "flammes non magiques",
        "flammes magiques"
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:dragon-soul:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:giant-snakeshape:8#aspect-du-serpent-geant": {
    "id": "aspect-du-serpent-geant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "size": 4,
      "temporaryHP": 20,
      "suspendEquipment": true,
      "attacks": [
        {
          "damage": "2d10",
          "openRoll": 9,
          "maxActions": 0
        },
        {
          "damage": "2d10",
          "openRoll": 0,
          "maxActions": 0
        }
      ],
      "capabilityNames": [
        "Regard paralysant"
      ]
    },
    "related": [],
    "sourceId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1
      },
      {
        "index": 4,
        "target": "temporaryHP",
        "value": 10
      }
    ]
  },
  "holy-thuuldom-hammer-fists:hammer-fists:0#poings-d-acier": {
    "id": "poings-d-acier",
    "icon": "icons/svg/aura.svg",
    "duration": "permanente tant que les deux runes sont portées et alimentées en points de divinité",
    "changes": [],
    "statuses": [],
    "rules": {
      "unarmedDamage": [
        "1d6",
        "1d6 + 2",
        "1d10 + 2",
        "1d10 + 2",
        "1d10 + 2"
      ]
    },
    "related": [],
    "sourceId": "holy-thuuldom-hammer-fists:hammer-fists:0",
    "parameters": []
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-ours": {
    "id": "esprit-de-la-bete-ours",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "suspendEquipment": false,
      "traits": [
        {
          "trait": "strength",
          "method": "highest",
          "value": 4
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-renard": {
    "id": "esprit-de-la-bete-renard",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": false,
      "traits": [
        {
          "trait": "intelligence",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 1.5
        }
      ],
      "knowledge": {
        "shadowing": 3,
        "thievery": 3
      },
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-lievre": {
    "id": "esprit-de-la-bete-lievre",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": false,
      "traits": [
        {
          "trait": "dexterity",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 1.5
        }
      ],
      "knowledge": {
        "shadowing": 3
      },
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau": {
    "id": "esprit-de-la-bete-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": false,
      "traits": [],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "senseCount": 2,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-cerf": {
    "id": "esprit-de-la-bete-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": false,
      "traits": [
        {
          "trait": "constitution",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 1.5
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-ours": {
    "id": "aspect-animal-ours",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "3",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "suspendEquipment": true,
      "traits": [
        {
          "trait": "strength",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "constitution",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "dexterity",
          "method": "replace",
          "value": -2
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-renard": {
    "id": "aspect-animal-renard",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": true,
      "traits": [
        {
          "trait": "intelligence",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "strength",
          "method": "replace",
          "value": -2
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 2
        }
      ],
      "knowledge": {
        "shadowing": 3,
        "thievery": 3
      },
      "defense": -2,
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-lievre": {
    "id": "aspect-animal-lievre",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": true,
      "traits": [
        {
          "trait": "dexterity",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "strength",
          "method": "replace",
          "value": -2
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 2
        }
      ],
      "defense": -3,
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau": {
    "id": "aspect-animal-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": true,
      "traits": [
        {
          "trait": "dexterity",
          "method": "highest",
          "value": 4
        },
        {
          "trait": "constitution",
          "method": "replace",
          "value": -4
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 0.5
        },
        {
          "mode": "flight",
          "method": "baseMultiple",
          "value": 4
        }
      ],
      "senseCount": 2,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf": {
    "id": "aspect-animal-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "suspendEquipment": true,
      "traits": [
        {
          "trait": "strength",
          "method": "highest",
          "value": 1
        },
        {
          "trait": "constitution",
          "method": "highest",
          "value": 4
        }
      ],
      "movement": [
        {
          "mode": "land",
          "method": "multiply",
          "value": 2
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 10,
          "maxActions": 0
        }
      ],
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800
      }
    ]
  },
  "holy-toikalokke-master-of-elements:gift-of-water:3#don-de-l-eau": {
    "id": "don-de-l-eau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "knowledge": {
        "swimming": 2
      }
    },
    "related": [],
    "sourceId": "holy-toikalokke-master-of-elements:gift-of-water:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:simmering-blood:1#simmering-blood": {
    "id": "simmering-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "1d10"
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:simmering-blood:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:rage:2#rage": {
    "id": "rage",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "1",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 5,
      "damage": {
        "value": 2,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10",
      "size": 1
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-joaringfaith-fury-of-ogon:rage:2",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:rage:2#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:rage:2",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:boiling-blood:3#boiling-blood": {
    "id": "boiling-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "2d10"
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:boiling-blood:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:madness:4#folie": {
    "id": "folie",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 10,
      "damage": {
        "value": 4,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10 (JO 10)",
      "size": 1.5
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-joaringfaith-fury-of-ogon:madness:4",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:madness:4#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:madness:4",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:bloodfire:6#bloodfire": {
    "id": "bloodfire",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [],
    "statuses": [],
    "rules": {
      "vitality": "3d10"
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:bloodfire:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600
      },
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:riastarthae:8#riastarthae": {
    "id": "riastarthae",
    "icon": "icons/svg/aura.svg",
    "duration": "7 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "3",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "temporaryHP": 15,
      "damage": {
        "value": 6,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ]
      },
      "noParry": true,
      "noDodge": true,
      "ignoreFear": true,
      "fearFactor": "1d10 (JO 9-10)",
      "size": 2,
      "ignoreWounds": true
    },
    "related": [
      "frenzy-exhaustion"
    ],
    "sourceId": "holy-joaringfaith-fury-of-ogon:riastarthae:8",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:riastarthae:8#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "durationFromElapsed": 0.5
    },
    "related": [],
    "sourceId": "holy-joaringfaith-fury-of-ogon:riastarthae:8",
    "parameters": []
  },
  "holy-joaringfaith-curses-of-sonntag:tree-curse:7#malediction-de-l-arbre": {
    "id": "malediction-de-l-arbre",
    "icon": "icons/svg/aura.svg",
    "duration": "2d6 jours",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "4",
        "phase": "initial"
      }
    ],
    "statuses": [
      "restrain"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true
    },
    "related": [
      "tree-recovery"
    ],
    "sourceId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 86400
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800
      },
      {
        "index": 3,
        "target": "duration",
        "value": 2592000
      },
      {
        "index": 4,
        "target": "duration",
        "value": 31536000
      }
    ]
  },
  "holy-joaringfaith-curses-of-sonntag:tree-curse:7#tree-recovery": {
    "id": "tree-recovery",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "testFactor": {
        "agility": 0.5,
        "movement": 0.5
      }
    },
    "related": [],
    "sourceId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7",
    "parameters": []
  },
  "MLPIuC5A6B7C8D9E#changement-de-corps-logewurm": {
    "id": "changement-de-corps-logewurm",
    "icon": "icons/svg/aura.svg",
    "duration": "illimitée",
    "changes": [],
    "statuses": [],
    "rules": {
      "chooseBestiary": true,
      "formPolicy": "physical",
      "preserveHP": true,
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "MLPIuC5A6B7C8D9E",
    "parameters": []
  },
  "MKMhM5z5A6B7C8D9#changement-de-forme-fjoltroll": {
    "id": "changement-de-forme-fjoltroll",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "MKMhM5z5A6B7C8D9",
    "parameters": []
  },
  "oRxJE6A6B7C8D9Ea#c-ur-regenerant-lindwurm": {
    "id": "c-ur-regenerant-lindwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [
      "sleep"
    ],
    "rules": {
      "chooseBestiary": false,
      "formPolicy": "animal",
      "preserveHP": false,
      "suspendEquipment": true,
      "formName": "Lindwurm"
    },
    "related": [
      "forme-de-lindwurm"
    ],
    "sourceId": "oRxJE6A6B7C8D9Ea",
    "parameters": []
  },
  "oRxJE6A6B7C8D9Ea#forme-de-lindwurm": {
    "id": "forme-de-lindwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "formName": "Lindwurm",
      "formPolicy": "animal",
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "oRxJE6A6B7C8D9Ea",
    "parameters": []
  },
  "flAdvMhNiOjPkQlR#corps-de-fumee": {
    "id": "corps-de-fumee",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "land",
          "method": "replace",
          "value": 30
        }
      ],
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "flAdvMhNiOjPkQlR",
    "parameters": []
  },
  "it3GE4w2x3y4z5A6#frenesie-hrimtroll": {
    "id": "frenesie-hrimtroll",
    "icon": "icons/svg/aura.svg",
    "duration": "1d6 premiers tours",
    "changes": [
      {
        "key": "system.modifiers.rolls.attack",
        "type": "add",
        "value": "2",
        "phase": "initial"
      },
      {
        "key": "system.modifiers.rolls.parry",
        "type": "add",
        "value": "-2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "it3GE4w2x3y4z5A6",
    "parameters": []
  },
  "NcOgKSkQlRmSnToU#infection-des-rugtannes": {
    "id": "infection-des-rugtannes",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "1",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "constitution",
          "method": "degrees",
          "value": 2,
          "overflow": 4
        },
        {
          "trait": "psyche",
          "method": "degrees",
          "value": 2,
          "overflow": 4
        },
        {
          "trait": "strength",
          "method": "degrees",
          "value": 2,
          "overflow": 4
        },
        {
          "trait": "dexterity",
          "method": "degrees",
          "value": 2,
          "overflow": 4
        }
      ],
      "vision": "darkvision",
      "recalculateHP": true,
      "senseCount": 1
    },
    "related": [],
    "sourceId": "NcOgKSkQlRmSnToU",
    "parameters": []
  },
  "WKMBG3v1w2x3y4z5#warg-disease": {
    "id": "warg-disease",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [
      "warg-garou"
    ],
    "sourceId": "WKMBG3v1w2x3y4z5",
    "parameters": []
  },
  "WKMBG3v1w2x3y4z5#warg-garou": {
    "id": "warg-garou",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "dexterity",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "constitution",
          "method": "add",
          "value": 6,
          "max": 8
        },
        {
          "trait": "psyche",
          "method": "add",
          "value": -2
        },
        {
          "trait": "intelligence",
          "method": "add",
          "value": -4,
          "min": -6
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 8,
          "maxActions": 1
        },
        {
          "damage": "1d10",
          "openRoll": 9,
          "maxActions": 2
        }
      ],
      "suspendEquipment": true,
      "knowledge": {
        "brawling": 2,
        "huntingFishing": 6,
        "jumpingClimbingBalancing": 6,
        "tracker": 6
      },
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "WKMBG3v1w2x3y4z5",
    "parameters": []
  },
  "gXp2SRjPkQlRmSnT#warg-disease": {
    "id": "warg-disease",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [
      "warg-garou"
    ],
    "sourceId": "gXp2SRjPkQlRmSnT",
    "parameters": []
  },
  "gXp2SRjPkQlRmSnT#warg-garou": {
    "id": "warg-garou",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "dexterity",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "constitution",
          "method": "add",
          "value": 6,
          "max": 8
        },
        {
          "trait": "psyche",
          "method": "add",
          "value": -2
        },
        {
          "trait": "intelligence",
          "method": "add",
          "value": -4,
          "min": -6
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 8,
          "maxActions": 1
        },
        {
          "damage": "1d10",
          "openRoll": 9,
          "maxActions": 2
        }
      ],
      "suspendEquipment": true,
      "knowledge": {
        "brawling": 2,
        "huntingFishing": 6,
        "jumpingClimbingBalancing": 6,
        "tracker": 6
      },
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "gXp2SRjPkQlRmSnT",
    "parameters": []
  },
  "i4Zci8A6B7C8D9Ea#warg-disease": {
    "id": "warg-disease",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [
      "warg-garou"
    ],
    "sourceId": "i4Zci8A6B7C8D9Ea",
    "parameters": []
  },
  "i4Zci8A6B7C8D9Ea#warg-garou": {
    "id": "warg-garou",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "2",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "rules": {
      "traits": [
        {
          "trait": "strength",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "dexterity",
          "method": "add",
          "value": 4,
          "max": 6
        },
        {
          "trait": "constitution",
          "method": "add",
          "value": 6,
          "max": 8
        },
        {
          "trait": "psyche",
          "method": "add",
          "value": -2
        },
        {
          "trait": "intelligence",
          "method": "add",
          "value": -4,
          "min": -6
        }
      ],
      "attacks": [
        {
          "damage": "1d10",
          "openRoll": 8,
          "maxActions": 1
        },
        {
          "damage": "1d10",
          "openRoll": 9,
          "maxActions": 2
        }
      ],
      "suspendEquipment": true,
      "knowledge": {
        "brawling": 2,
        "huntingFishing": 6,
        "jumpingClimbingBalancing": 6,
        "tracker": 6
      },
      "senseCount": 1,
      "vision": "lightAmplification"
    },
    "related": [],
    "sourceId": "i4Zci8A6B7C8D9Ea",
    "parameters": []
  },
  "pjY95vXsYtZu0v1w#metamorphose-draugr": {
    "id": "metamorphose-draugr",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "chooseBestiary": true,
      "formPolicy": "animal",
      "preserveHP": false,
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "pjY95vXsYtZu0v1w",
    "parameters": []
  },
  "K2WXpMgMhNiOjPkQ#metamorphose-stenhinje": {
    "id": "metamorphose-stenhinje",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "K2WXpMgMhNiOjPkQ",
    "parameters": []
  },
  "WLqQEeGbHcIdJeKf#petrification-braskelwurm": {
    "id": "petrification-braskelwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "10",
        "phase": "initial"
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 100,
      "naturalArmor": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "WLqQEeGbHcIdJeKf",
    "parameters": []
  },
  "WLqQEeGbHcIdJeKf#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "WLqQEeGbHcIdJeKf",
    "parameters": []
  },
  "WLqQEeGbHcIdJeKf#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "WLqQEeGbHcIdJeKf",
    "parameters": []
  },
  "MxUgKE5A6B7C8D9E#petrification-demon-tangible": {
    "id": "petrification-demon-tangible",
    "icon": "icons/svg/aura.svg",
    "duration": "1d10 (JO 7-10) jours",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "20",
        "phase": "initial"
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "rules": {
      "suspendEquipment": true,
      "preserveHP": true,
      "statueIntegrity": 200,
      "naturalArmor": 0
    },
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "MxUgKE5A6B7C8D9E",
    "parameters": []
  },
  "MxUgKE5A6B7C8D9E#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.5
        }
      ],
      "testFactor": {
        "dexterity": 0.5
      }
    },
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "sourceId": "MxUgKE5A6B7C8D9E",
    "parameters": []
  },
  "MxUgKE5A6B7C8D9E#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [],
    "statuses": [],
    "rules": {
      "movement": [
        {
          "mode": "all",
          "method": "multiply",
          "value": 0.6666666666666666
        }
      ],
      "testFactor": {
        "dexterity": 0.6666666666666666
      }
    },
    "related": [],
    "sourceId": "MxUgKE5A6B7C8D9E",
    "parameters": []
  },
  "2hwy57A6B7C8D9Ea#regeneration-de-tete": {
    "id": "regeneration-de-tete",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {},
    "related": [],
    "sourceId": "2hwy57A6B7C8D9Ea",
    "parameters": []
  },
  "NNBuQnQlRmSnToUp#transformation-corporelle": {
    "id": "transformation-corporelle",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [],
    "statuses": [],
    "rules": {
      "chooseBestiary": true,
      "formPolicy": "animal",
      "preserveHP": false,
      "suspendEquipment": true
    },
    "related": [],
    "sourceId": "NNBuQnQlRmSnToUp",
    "parameters": []
  }
};
export const TRANSFORMATIONS_BY_SOURCE = {
  "vitner-soil-craft:petrify-remove-petrification:8": [
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-annuler-une-petrification",
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-half",
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-two-thirds"
  ],
  "vitner-witchcraft:tree-curse:7": [
    "vitner-witchcraft:tree-curse:7#malediction-de-l-arbre",
    "vitner-witchcraft:tree-curse:7#tree-recovery"
  ],
  "vitner-body-vitner:hasten:9": [
    "vitner-body-vitner:hasten:9#hate",
    "vitner-body-vitner:hasten:9#hate-inverse"
  ],
  "vitner-body-vitner:strengthen:8": [
    "vitner-body-vitner:strengthen:8#vigueur",
    "vitner-body-vitner:strengthen:8#vigueur-inverse"
  ],
  "vitner-body-vitner:change-creature:11": [
    "vitner-body-vitner:change-creature:11#transformation"
  ],
  "holy-gerbanis-strength-of-stormi:troll-strength:0": [
    "holy-gerbanis-strength-of-stormi:troll-strength:0#force-du-troll"
  ],
  "holy-gerbanis-strength-of-stormi:hinji-strength:3": [
    "holy-gerbanis-strength-of-stormi:hinji-strength:3#force-de-hinje"
  ],
  "holy-gerbanis-strength-of-stormi:jotun-strength:6": [
    "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun"
  ],
  "holy-gerbanis-power-of-enken:willpower:1": [
    "holy-gerbanis-power-of-enken:willpower:1#force-d-ame"
  ],
  "holy-gerbanis-power-of-enken:bold:2": [
    "holy-gerbanis-power-of-enken:bold:2#temerite"
  ],
  "holy-gerbanis-power-of-enken:heart-of-enken:6": [
    "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken"
  ],
  "holy-ealdtradition-gift-of-thanja:stagshape:2": [
    "holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf"
  ],
  "holy-ealdtradition-gift-of-thanja:salmonshape:4": [
    "holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon"
  ],
  "holy-ealdtradition-gift-of-thanja:ravenshape:8": [
    "holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau"
  ],
  "holy-ealdtradition-tribute-of-morgu:simmering-blood:0": [
    "holy-ealdtradition-tribute-of-morgu:simmering-blood:0#simmering-blood"
  ],
  "holy-ealdtradition-tribute-of-morgu:rage:3": [
    "holy-ealdtradition-tribute-of-morgu:rage:3#rage",
    "holy-ealdtradition-tribute-of-morgu:rage:3#frenzy-exhaustion"
  ],
  "holy-ealdtradition-tribute-of-morgu:boiling-blood:2": [
    "holy-ealdtradition-tribute-of-morgu:boiling-blood:2#boiling-blood"
  ],
  "holy-ealdtradition-tribute-of-morgu:madness:5": [
    "holy-ealdtradition-tribute-of-morgu:madness:5#folie",
    "holy-ealdtradition-tribute-of-morgu:madness:5#frenzy-exhaustion"
  ],
  "holy-ealdtradition-tribute-of-morgu:bloodfire:6": [
    "holy-ealdtradition-tribute-of-morgu:bloodfire:6#bloodfire"
  ],
  "holy-ealdtradition-tribute-of-morgu:riastarthae:7": [
    "holy-ealdtradition-tribute-of-morgu:riastarthae:7#riastarthae",
    "holy-ealdtradition-tribute-of-morgu:riastarthae:7#frenzy-exhaustion"
  ],
  "holy-ealdtradition-nema-s-usefulness:owl-hearing:3": [
    "holy-ealdtradition-nema-s-usefulness:owl-hearing:3#ouie-du-hibou"
  ],
  "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7": [
    "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7#sens-du-griffon"
  ],
  "holy-tenetnid-tablet-of-anger:statue:5": [
    "holy-tenetnid-tablet-of-anger:statue:5#statue",
    "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-half",
    "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-two-thirds"
  ],
  "holy-tenetnid-tablet-of-anger:stone-monument:8": [
    "holy-tenetnid-tablet-of-anger:stone-monument:8#monument-en-pierre",
    "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-half",
    "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-two-thirds"
  ],
  "holy-tenetnid-tablet-of-the-shield:bark-skin:4": [
    "holy-tenetnid-tablet-of-the-shield:bark-skin:4#peau-d-ecorce"
  ],
  "holy-tenetnid-tablet-of-the-shield:tree-port:8": [
    "holy-tenetnid-tablet-of-the-shield:tree-port:8#refuge-arboricole"
  ],
  "holy-haminges-power-of-the-beast:resilience:0": [
    "holy-haminges-power-of-the-beast:resilience:0#resilience"
  ],
  "holy-haminges-power-of-the-beast:mastomant-s-tusks:2": [
    "holy-haminges-power-of-the-beast:mastomant-s-tusks:2#defenses-du-mastomant"
  ],
  "holy-haminges-power-of-the-beast:endurance-of-the-boar:3": [
    "holy-haminges-power-of-the-beast:endurance-of-the-boar:3#endurance-du-sanglier"
  ],
  "holy-haminges-power-of-the-beast:endurance-of-the-giant:6": [
    "holy-haminges-power-of-the-beast:endurance-of-the-giant:6#endurance-du-geant"
  ],
  "holy-haminges-power-of-the-beast:mastomantshape:8": [
    "holy-haminges-power-of-the-beast:mastomantshape:8#aspect-du-mastomant"
  ],
  "holy-haminges-power-of-the-scale:limb-of-stone:5": [
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-gauche",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-droit",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-gauche",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-droite"
  ],
  "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8": [
    "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8#c-ur-du-lindwurm"
  ],
  "holy-haminges-power-of-the-scale:petrify:7": [
    "holy-haminges-power-of-the-scale:petrify:7#petrification",
    "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-half",
    "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-two-thirds"
  ],
  "holy-haminges-power-of-the-thurses:troll-strength:1": [
    "holy-haminges-power-of-the-thurses:troll-strength:1#force-du-troll"
  ],
  "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3": [
    "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3#force-du-stenhinje"
  ],
  "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2": [
    "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2#fureur-de-l-ogre-des-montagnes"
  ],
  "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4": [
    "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4#folie-de-l-ogre-des-montagnes"
  ],
  "holy-haminges-power-of-the-thurses:thurse-strength:7": [
    "holy-haminges-power-of-the-thurses:thurse-strength:7#force-du-tursir"
  ],
  "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6": [
    "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6#rage-du-destructeur"
  ],
  "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1": [
    "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1#ravage-du-huvfurwurm"
  ],
  "holy-haminges-power-of-the-dragon:flame-hardened:2": [
    "holy-haminges-power-of-the-dragon:flame-hardened:2#fils-des-flammes"
  ],
  "holy-haminges-power-of-the-dragon:paralyzing-gaze:3": [
    "holy-haminges-power-of-the-dragon:paralyzing-gaze:3#regard-paralysant"
  ],
  "holy-haminges-power-of-the-dragon:dragon-skin:4": [
    "holy-haminges-power-of-the-dragon:dragon-skin:4#peau-du-dragon"
  ],
  "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6": [
    "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6#tete-du-huvfurwurm"
  ],
  "holy-haminges-power-of-the-dragon:dragon-soul:7": [
    "holy-haminges-power-of-the-dragon:dragon-soul:7#ame-du-dragon"
  ],
  "holy-haminges-power-of-the-dragon:giant-snakeshape:8": [
    "holy-haminges-power-of-the-dragon:giant-snakeshape:8#aspect-du-serpent-geant"
  ],
  "holy-thuuldom-hammer-fists:hammer-fists:0": [
    "holy-thuuldom-hammer-fists:hammer-fists:0#poings-d-acier"
  ],
  "holy-toikalokke-animal-mind:animal-spirit:4": [
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-ours",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-renard",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-lievre",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-cerf"
  ],
  "holy-toikalokke-animal-mind:animal-shape:6": [
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-ours",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-renard",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-lievre",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf"
  ],
  "holy-toikalokke-master-of-elements:gift-of-water:3": [
    "holy-toikalokke-master-of-elements:gift-of-water:3#don-de-l-eau"
  ],
  "holy-joaringfaith-fury-of-ogon:simmering-blood:1": [
    "holy-joaringfaith-fury-of-ogon:simmering-blood:1#simmering-blood"
  ],
  "holy-joaringfaith-fury-of-ogon:rage:2": [
    "holy-joaringfaith-fury-of-ogon:rage:2#rage",
    "holy-joaringfaith-fury-of-ogon:rage:2#frenzy-exhaustion"
  ],
  "holy-joaringfaith-fury-of-ogon:boiling-blood:3": [
    "holy-joaringfaith-fury-of-ogon:boiling-blood:3#boiling-blood"
  ],
  "holy-joaringfaith-fury-of-ogon:madness:4": [
    "holy-joaringfaith-fury-of-ogon:madness:4#folie",
    "holy-joaringfaith-fury-of-ogon:madness:4#frenzy-exhaustion"
  ],
  "holy-joaringfaith-fury-of-ogon:bloodfire:6": [
    "holy-joaringfaith-fury-of-ogon:bloodfire:6#bloodfire"
  ],
  "holy-joaringfaith-fury-of-ogon:riastarthae:8": [
    "holy-joaringfaith-fury-of-ogon:riastarthae:8#riastarthae",
    "holy-joaringfaith-fury-of-ogon:riastarthae:8#frenzy-exhaustion"
  ],
  "holy-joaringfaith-curses-of-sonntag:tree-curse:7": [
    "holy-joaringfaith-curses-of-sonntag:tree-curse:7#malediction-de-l-arbre",
    "holy-joaringfaith-curses-of-sonntag:tree-curse:7#tree-recovery"
  ],
  "MLPIuC5A6B7C8D9E": [
    "MLPIuC5A6B7C8D9E#changement-de-corps-logewurm"
  ],
  "MKMhM5z5A6B7C8D9": [
    "MKMhM5z5A6B7C8D9#changement-de-forme-fjoltroll"
  ],
  "oRxJE6A6B7C8D9Ea": [
    "oRxJE6A6B7C8D9Ea#c-ur-regenerant-lindwurm",
    "oRxJE6A6B7C8D9Ea#forme-de-lindwurm"
  ],
  "flAdvMhNiOjPkQlR": [
    "flAdvMhNiOjPkQlR#corps-de-fumee"
  ],
  "it3GE4w2x3y4z5A6": [
    "it3GE4w2x3y4z5A6#frenesie-hrimtroll"
  ],
  "NcOgKSkQlRmSnToU": [
    "NcOgKSkQlRmSnToU#infection-des-rugtannes"
  ],
  "WKMBG3v1w2x3y4z5": [
    "WKMBG3v1w2x3y4z5#warg-disease",
    "WKMBG3v1w2x3y4z5#warg-garou"
  ],
  "gXp2SRjPkQlRmSnT": [
    "gXp2SRjPkQlRmSnT#warg-disease",
    "gXp2SRjPkQlRmSnT#warg-garou"
  ],
  "i4Zci8A6B7C8D9Ea": [
    "i4Zci8A6B7C8D9Ea#warg-disease",
    "i4Zci8A6B7C8D9Ea#warg-garou"
  ],
  "pjY95vXsYtZu0v1w": [
    "pjY95vXsYtZu0v1w#metamorphose-draugr"
  ],
  "K2WXpMgMhNiOjPkQ": [
    "K2WXpMgMhNiOjPkQ#metamorphose-stenhinje"
  ],
  "WLqQEeGbHcIdJeKf": [
    "WLqQEeGbHcIdJeKf#petrification-braskelwurm",
    "WLqQEeGbHcIdJeKf#petrification-recovery-half",
    "WLqQEeGbHcIdJeKf#petrification-recovery-two-thirds"
  ],
  "MxUgKE5A6B7C8D9E": [
    "MxUgKE5A6B7C8D9E#petrification-demon-tangible",
    "MxUgKE5A6B7C8D9E#petrification-recovery-half",
    "MxUgKE5A6B7C8D9E#petrification-recovery-two-thirds"
  ],
  "2hwy57A6B7C8D9Ea": [
    "2hwy57A6B7C8D9Ea#regeneration-de-tete"
  ],
  "NNBuQnQlRmSnToUp": [
    "NNBuQnQlRmSnToUp#transformation-corporelle"
  ]
};
