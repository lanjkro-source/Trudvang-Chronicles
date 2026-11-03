// Generated from authoritative FR effectTemplates. Text belongs to lang/*.json.
export const TRANSFORMATION_TEMPLATES = {
  "vitner-vitner-craft:vitner-pouch:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2
    ],
    "sourceId": "vitner-vitner-craft:vitner-pouch:1",
    "parameters": [
      {
        "index": 3,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-craft:vitner-pouch:1:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-vitner-craft:vitner-pouch:1:4"
      },
      {
        "index": 5,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-vitner-craft:vitner-pouch:1:5"
      }
    ]
  },
  "vitner-vitner-craft:enchant-being:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "4 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.allActions",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 30
      }
    ],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-vitner-craft:enchant-being:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-vitner-craft:enchant-being:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-vitner-craft:enchant-being:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-craft:enchant-being:4:2"
      },
      {
        "index": 5,
        "target": "modifier",
        "key": "system.modifiers.rolls.allActions",
        "value": 1,
        "optionId": "vitner-vitner-craft:enchant-being:4:5"
      }
    ]
  },
  "vitner-vitner-craft:wall-of-vitner:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      4,
      5,
      6
    ],
    "sourceId": "vitner-vitner-craft:wall-of-vitner:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-vitner-craft:wall-of-vitner:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-vitner-craft:wall-of-vitner:8:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-craft:wall-of-vitner:8:3"
      }
    ]
  },
  "vitner-dimvitner:animate-undead:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 jours",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      5,
      6,
      7,
      8
    ],
    "sourceId": "vitner-dimvitner:animate-undead:0",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-dimvitner:animate-undead:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-dimvitner:animate-undead:0:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 2592000,
        "optionId": "vitner-dimvitner:animate-undead:0:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 31536000,
        "optionId": "vitner-dimvitner:animate-undead:0:4"
      }
    ]
  },
  "vitner-dimvitner:speak-to-undead:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "vitner-dimvitner:speak-to-undead:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-dimvitner:speak-to-undead:3:0"
      }
    ]
  },
  "vitner-dimvitner:vitner-theft:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "vitner-dimvitner:vitner-theft:5",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-dimvitner:vitner-theft:5:2"
      }
    ]
  },
  "vitner-dimvitner:control-undead:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-dimvitner:control-undead:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-dimvitner:control-undead:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-dimvitner:control-undead:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-dimvitner:control-undead:7:2"
      }
    ]
  },
  "vitner-soil-craft:shape-soil:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-soil-craft:shape-soil:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-soil-craft:shape-soil:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-soil-craft:shape-soil:1:1"
      }
    ]
  },
  "vitner-soil-craft:quagmire:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2
    ],
    "sourceId": "vitner-soil-craft:quagmire:3",
    "parameters": [
      {
        "index": 3,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-soil-craft:quagmire:3:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-soil-craft:quagmire:3:4"
      }
    ]
  },
  "vitner-soil-craft:soil-walk:5#soil-walk": {
    "id": "soil-walk",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4
    ],
    "sourceId": "vitner-soil-craft:soil-walk:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-soil-craft:soil-walk:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-soil-craft:soil-walk:5:1"
      }
    ]
  },
  "vitner-soil-craft:shape-stone:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-soil-craft:shape-stone:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-soil-craft:shape-stone:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-soil-craft:shape-stone:6:1"
      }
    ]
  },
  "vitner-soil-craft:stone-walk:7#stone-walk": {
    "id": "stone-walk",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      3,
      4
    ],
    "sourceId": "vitner-soil-craft:stone-walk:7",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-soil-craft:stone-walk:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-soil-craft:stone-walk:7:2"
      }
    ]
  },
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-annuler-une-petrification": {
    "id": "petrification-annuler-une-petrification",
    "icon": "icons/svg/aura.svg",
    "duration": "1d6 + 2 jours",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "10",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "100",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.naturalArmor",
        "type": "override",
        "value": "0",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-soil-craft:petrify-remove-petrification:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 2592000,
        "optionId": "vitner-soil-craft:petrify-remove-petrification:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 31536000,
        "optionId": "vitner-soil-craft:petrify-remove-petrification:8:2"
      }
    ]
  },
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": []
  },
  "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "vitner-soil-craft:petrify-remove-petrification:8",
    "parameters": []
  },
  "vitner-water-craft:find-water:0#find-water": {
    "id": "find-water",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4
    ],
    "sourceId": "vitner-water-craft:find-water:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-water-craft:find-water:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-water-craft:find-water:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-water-craft:find-water:0:2"
      }
    ]
  },
  "vitner-water-craft:breathe:2#respiration": {
    "id": "respiration",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-water-craft:breathe:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-water-craft:breathe:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-water-craft:breathe:2:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-water-craft:breathe:2:2"
      }
    ]
  },
  "vitner-water-craft:create-water:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-water-craft:create-water:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-water-craft:create-water:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-water-craft:create-water:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-water-craft:create-water:4:2"
      }
    ]
  },
  "vitner-water-craft:solid-water:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2,
      5,
      6
    ],
    "sourceId": "vitner-water-craft:solid-water:5",
    "parameters": [
      {
        "index": 3,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-water-craft:solid-water:5:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-water-craft:solid-water:5:4"
      }
    ]
  },
  "vitner-water-craft:control-precipitation:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      4,
      5
    ],
    "sourceId": "vitner-water-craft:control-precipitation:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-water-craft:control-precipitation:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 18000,
        "optionId": "vitner-water-craft:control-precipitation:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-water-craft:control-precipitation:6:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-water-craft:control-precipitation:6:3"
      }
    ]
  },
  "vitner-water-craft:water-walk:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "sourceId": "vitner-water-craft:water-walk:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-water-craft:water-walk:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-water-craft:water-walk:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-water-craft:water-walk:7:2"
      }
    ]
  },
  "vitner-flame-craft:heat-water:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3,
      4
    ],
    "sourceId": "vitner-flame-craft:heat-water:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-flame-craft:heat-water:0:0"
      }
    ]
  },
  "vitner-flame-craft:spark:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4
    ],
    "sourceId": "vitner-flame-craft:spark:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-flame-craft:spark:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-flame-craft:spark:1:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-flame-craft:spark:1:2"
      }
    ]
  },
  "vitner-flame-craft:protection-from-fire:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      4
    ],
    "sourceId": "vitner-flame-craft:protection-from-fire:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-flame-craft:protection-from-fire:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-flame-craft:protection-from-fire:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-flame-craft:protection-from-fire:4:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-flame-craft:protection-from-fire:4:3"
      }
    ]
  },
  "vitner-flame-craft:warmth:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4,
      5,
      6
    ],
    "sourceId": "vitner-flame-craft:warmth:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-flame-craft:warmth:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-flame-craft:warmth:6:1"
      }
    ]
  },
  "vitner-flame-craft:flame-control:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4,
      5
    ],
    "sourceId": "vitner-flame-craft:flame-control:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-flame-craft:flame-control:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-flame-craft:flame-control:5:1"
      }
    ]
  },
  "vitner-wind-craft:purify-air:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-wind-craft:purify-air:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-wind-craft:purify-air:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 1200,
        "optionId": "vitner-wind-craft:purify-air:0:1"
      }
    ]
  },
  "vitner-wind-craft:fog:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3
    ],
    "sourceId": "vitner-wind-craft:fog:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 300,
        "optionId": "vitner-wind-craft:fog:2:0"
      }
    ]
  },
  "vitner-wind-craft:control-wind:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3
    ],
    "sourceId": "vitner-wind-craft:control-wind:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-wind-craft:control-wind:3:0"
      }
    ]
  },
  "vitner-wind-craft:air-armor:4#air-armor": {
    "id": "air-armor",
    "icon": "icons/svg/shield.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.outerProtection",
        "type": "override",
        "value": "1",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "vitner-wind-craft:air-armor:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-wind-craft:air-armor:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-wind-craft:air-armor:4:1"
      },
      {
        "index": 4,
        "target": "protection",
        "value": 1,
        "optionId": "vitner-wind-craft:air-armor:4:4"
      },
      {
        "index": 4,
        "target": "outerProtection",
        "value": 1,
        "optionId": "vitner-wind-craft:air-armor:4:4"
      }
    ]
  },
  "vitner-wind-craft:lift:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "6 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "sourceId": "vitner-wind-craft:lift:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-wind-craft:lift:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-wind-craft:lift:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-wind-craft:lift:5:2"
      }
    ]
  },
  "vitner-wind-craft:wind-catcher:9#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "6 tours de jeu",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "sourceId": "vitner-wind-craft:wind-catcher:9",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-wind-craft:wind-catcher:9:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-wind-craft:wind-catcher:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-wind-craft:wind-catcher:9:2"
      }
    ]
  },
  "vitner-wind-craft:storm:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "sourceId": "vitner-wind-craft:storm:8",
    "parameters": []
  },
  "vitner-perceiving:find-home:0#find-home": {
    "id": "find-home",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-perceiving:find-home:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:find-home:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-perceiving:find-home:0:1"
      }
    ]
  },
  "vitner-perceiving:retrace-tracks:1#traces": {
    "id": "traces",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-perceiving:retrace-tracks:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:retrace-tracks:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-perceiving:retrace-tracks:1:1"
      }
    ]
  },
  "vitner-perceiving:detect-object:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3,
      4
    ],
    "sourceId": "vitner-perceiving:detect-object:2",
    "parameters": [
      {
        "index": 5,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:detect-object:2:5"
      }
    ]
  },
  "vitner-perceiving:orientation:3#orientation": {
    "id": "orientation",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-perceiving:orientation:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:orientation:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-perceiving:orientation:3:1"
      }
    ]
  },
  "vitner-perceiving:detect-being:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3
    ],
    "sourceId": "vitner-perceiving:detect-being:4",
    "parameters": [
      {
        "index": 4,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:detect-being:4:4"
      }
    ]
  },
  "vitner-perceiving:detect-undead:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3,
      4
    ],
    "sourceId": "vitner-perceiving:detect-undead:5",
    "parameters": [
      {
        "index": 5,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:detect-undead:5:5"
      }
    ]
  },
  "vitner-perceiving:surrounding:6#surrounding": {
    "id": "surrounding",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1
    ],
    "sourceId": "vitner-perceiving:surrounding:6",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-perceiving:surrounding:6:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:surrounding:6:3"
      }
    ]
  },
  "vitner-perceiving:map:7#map": {
    "id": "map",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-perceiving:map:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-perceiving:map:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-perceiving:map:7:1"
      }
    ]
  },
  "vitner-power-of-thought:understanding-script:0#ecrits": {
    "id": "ecrits",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-power-of-thought:understanding-script:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:understanding-script:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:understanding-script:0:1"
      }
    ]
  },
  "vitner-power-of-thought:understanding-speech:1#oral": {
    "id": "oral",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.SpokenLanguage",
    "sourceId": "vitner-power-of-thought:understanding-speech:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:understanding-speech:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:understanding-speech:1:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 0,
        "value": 1,
        "tooltip": true,
        "skillOnly": true,
        "labelKey": "TRUDVANG.Transformation.SpeechListeners",
        "optionId": "vitner-power-of-thought:understanding-speech:1:2"
      }
    ]
  },
  "vitner-power-of-thought:courage:2#courage": {
    "id": "courage",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.fearFactor",
        "type": "add",
        "value": "-4",
        "phase": "initial",
        "priority": 20
      }
    ],
    "onApply": {
      "operation": "fearReduction",
      "formulas": [
        "1d10",
        "1d10x>=10",
        "1d10x>=9",
        "1d10x>=8",
        "1d10x>=8 + 1"
      ]
    },
    "sourceId": "vitner-power-of-thought:courage:2",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:courage:2:1"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.fearFactor",
        "value": -1,
        "optionId": "vitner-power-of-thought:courage:2:3"
      },
      {
        "index": 3,
        "target": "note",
        "base": -4,
        "value": -1,
        "tooltip": true,
        "skillOnly": true,
        "labelKey": "TRUDVANG.Transformation.FearReduction",
        "optionId": "vitner-power-of-thought:courage:2:3"
      },
      {
        "index": 4,
        "target": "onApplyStep",
        "value": 1,
        "optionId": "vitner-power-of-thought:courage:2:4"
      }
    ]
  },
  "vitner-power-of-thought:telepathy:4#lien": {
    "id": "lien",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-power-of-thought:telepathy:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:telepathy:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-power-of-thought:telepathy:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:telepathy:4:2"
      }
    ]
  },
  "vitner-power-of-thought:ecstasy:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "vitner-power-of-thought:ecstasy:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:ecstasy:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:ecstasy:5:1"
      }
    ]
  },
  "vitner-power-of-thought:imagining:6#pensee": {
    "id": "pensee",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.ImplantedThought",
    "sourceId": "vitner-power-of-thought:imagining:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:imagining:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:imagining:6:1"
      }
    ]
  },
  "vitner-power-of-thought:memory:7#memoire": {
    "id": "memoire",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "summaryParts": {
      "labelKey": "TRUDVANG.Transformation.MemoryWindow",
      "overrideIndex": 4,
      "overrideKey": "TRUDVANG.Transformation.MemoryLifetime",
      "parts": [
        {
          "index": 1,
          "base": 1,
          "singularKey": "TRUDVANG.Transformation.MemoryWeekOne",
          "pluralKey": "TRUDVANG.Transformation.MemoryWeekMany"
        },
        {
          "index": 2,
          "singularKey": "TRUDVANG.Transformation.MemoryMonthOne",
          "pluralKey": "TRUDVANG.Transformation.MemoryMonthMany"
        },
        {
          "index": 3,
          "singularKey": "TRUDVANG.Transformation.MemoryYearOne",
          "pluralKey": "TRUDVANG.Transformation.MemoryYearMany"
        }
      ]
    },
    "sourceId": "vitner-power-of-thought:memory:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-power-of-thought:memory:7:0"
      },
      {
        "index": 1,
        "target": "summaryPart",
        "value": 1,
        "optionId": "vitner-power-of-thought:memory:7:1"
      },
      {
        "index": 2,
        "target": "summaryPart",
        "value": 1,
        "optionId": "vitner-power-of-thought:memory:7:2"
      },
      {
        "index": 3,
        "target": "summaryPart",
        "value": 1,
        "optionId": "vitner-power-of-thought:memory:7:3"
      },
      {
        "index": 4,
        "target": "summaryPart",
        "value": 1,
        "optionId": "vitner-power-of-thought:memory:7:4"
      }
    ]
  },
  "vitner-power-of-thought:aura-of-power:9#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-power-of-thought:aura-of-power:9",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:aura-of-power:9:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:aura-of-power:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-power-of-thought:aura-of-power:9:2"
      }
    ]
  },
  "vitner-power-of-thought:creature-control:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "vitner-power-of-thought:creature-control:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:creature-control:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:creature-control:8:2"
      }
    ]
  },
  "vitner-power-of-thought:mind-reading:11#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "6 tours de jeu",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4
    ],
    "sourceId": "vitner-power-of-thought:mind-reading:11",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 10,
        "optionId": "vitner-power-of-thought:mind-reading:11:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:mind-reading:11:1"
      }
    ]
  },
  "vitner-power-of-thought:possess-creature:10#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1
    ],
    "sourceId": "vitner-power-of-thought:possess-creature:10",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-thought:possess-creature:10:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-thought:possess-creature:10:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-power-of-thought:possess-creature:10:4"
      }
    ]
  },
  "vitner-power-of-vision:tracking:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "vitner-power-of-vision:tracking:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-vision:tracking:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 43200,
        "optionId": "vitner-power-of-vision:tracking:0:1"
      }
    ]
  },
  "vitner-power-of-vision:scanning:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "9 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "vitner-power-of-vision:scanning:1",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 15,
        "optionId": "vitner-power-of-vision:scanning:1:1"
      }
    ]
  },
  "vitner-power-of-vision:far-sight:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.rangedAttack",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      }
    ],
    "displayPowerOptions": [
      2,
      3,
      4,
      5
    ],
    "sourceId": "vitner-power-of-vision:far-sight:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-power-of-vision:far-sight:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-vision:far-sight:2:1"
      },
      {
        "index": 7,
        "target": "modifier",
        "key": "system.modifiers.rolls.rangedAttack",
        "value": 1,
        "optionId": "vitner-power-of-vision:far-sight:2:7"
      }
    ]
  },
  "vitner-power-of-vision:espionage:4#espionage": {
    "id": "espionage",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-power-of-vision:espionage:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-vision:espionage:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-power-of-vision:espionage:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-power-of-vision:espionage:4:2"
      }
    ]
  },
  "vitner-power-of-vision:seeing:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "vitner-power-of-vision:seeing:3",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-vision:seeing:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-power-of-vision:seeing:3:2"
      }
    ]
  },
  "vitner-power-of-vision:astral-voyage:5#astral-voyage": {
    "id": "astral-voyage",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-power-of-vision:astral-voyage:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-vision:astral-voyage:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-vision:astral-voyage:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-power-of-vision:astral-voyage:5:2"
      }
    ]
  },
  "vitner-power-of-vision:true-sight:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6
    ],
    "sourceId": "vitner-power-of-vision:true-sight:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-power-of-vision:true-sight:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-power-of-vision:true-sight:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-power-of-vision:true-sight:7:2"
      }
    ]
  },
  "vitner-witchcraft:uprooted-tree:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2,
      3
    ],
    "sourceId": "vitner-witchcraft:uprooted-tree:0",
    "parameters": []
  },
  "vitner-witchcraft:curse-creature:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 jours",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.allActions",
        "type": "add",
        "value": "-1",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "vitner-witchcraft:curse-creature:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-witchcraft:curse-creature:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-witchcraft:curse-creature:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 2592000,
        "optionId": "vitner-witchcraft:curse-creature:5:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 31536000,
        "optionId": "vitner-witchcraft:curse-creature:5:3"
      },
      {
        "index": 4,
        "target": "modifier",
        "key": "system.modifiers.rolls.allActions",
        "value": -1,
        "optionId": "vitner-witchcraft:curse-creature:5:4"
      }
    ]
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "restrain"
    ],
    "related": [
      "tree-recovery"
    ],
    "priority": 50,
    "sourceId": "vitner-witchcraft:tree-curse:7",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-witchcraft:tree-curse:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-witchcraft:tree-curse:7:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 2592000,
        "optionId": "vitner-witchcraft:tree-curse:7:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 31536000,
        "optionId": "vitner-witchcraft:tree-curse:7:4"
      }
    ]
  },
  "vitner-witchcraft:tree-curse:7#tree-recovery": {
    "id": "tree-recovery",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"agility\":0.5,\"movement\":0.5}",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "vitner-witchcraft:tree-curse:7",
    "parameters": []
  },
  "vitner-animal-vitner:speak-to-animals:1#lien": {
    "id": "lien",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.vitner-animal-vitner:speak-to-animals:1#lien.Sense0\",\"range\":50,\"enabled\":true}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "inputKey": "TRUDVANG.Procedure.animalName",
    "senseTooltip": {
      "sense": 0,
      "labelKey": "TRUDVANG.Transformation.AnimalLinkRange"
    },
    "sourceId": "vitner-animal-vitner:speak-to-animals:1",
    "parameters": [
      {
        "index": 0,
        "target": "senseRange",
        "sense": 0,
        "value": 10,
        "optionId": "vitner-animal-vitner:speak-to-animals:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-animal-vitner:speak-to-animals:1:1"
      }
    ]
  },
  "vitner-animal-vitner:call-on-animals:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-animal-vitner:call-on-animals:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-animal-vitner:call-on-animals:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-animal-vitner:call-on-animals:2:1"
      }
    ]
  },
  "vitner-animal-vitner:control-animals:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      4,
      5
    ],
    "sourceId": "vitner-animal-vitner:control-animals:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-animal-vitner:control-animals:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-animal-vitner:control-animals:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-animal-vitner:control-animals:4:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-animal-vitner:control-animals:4:3"
      }
    ]
  },
  "vitner-animal-vitner:mind-of-the-wolf:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      3,
      4,
      5
    ],
    "sourceId": "vitner-animal-vitner:mind-of-the-wolf:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-animal-vitner:mind-of-the-wolf:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-animal-vitner:mind-of-the-wolf:5:2"
      }
    ]
  },
  "vitner-animal-vitner:possess-animals:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5
    ],
    "sourceId": "vitner-animal-vitner:possess-animals:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-animal-vitner:possess-animals:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-animal-vitner:possess-animals:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-animal-vitner:possess-animals:6:2"
      }
    ]
  },
  "vitner-animal-vitner:send-message:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2,
      3
    ],
    "sourceId": "vitner-animal-vitner:send-message:8",
    "parameters": []
  },
  "vitner-body-vitner:grip:0#adherence": {
    "id": "adherence",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:grip:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:grip:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:grip:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-body-vitner:grip:0:2"
      },
      {
        "index": 4,
        "target": "note",
        "base": 5,
        "value": 1,
        "skill": "agility",
        "labelKey": "TRUDVANG.Transformation.ClimbingNote",
        "optionId": "vitner-body-vitner:grip:0:4"
      }
    ]
  },
  "vitner-body-vitner:hearing-deafness:2#ameliore": {
    "id": "ameliore",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:hearing-deafness:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:hearing-deafness:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:hearing-deafness:2:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:hearing-deafness:2:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:hearing-deafness:2:3"
      },
      {
        "index": 5,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.HearingBonus",
        "templates": [
          "ameliore"
        ],
        "optionId": "vitner-body-vitner:hearing-deafness:2:5"
      }
    ]
  },
  "vitner-body-vitner:hearing-deafness:2#affaibli": {
    "id": "affaibli",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:hearing-deafness:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:hearing-deafness:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:hearing-deafness:2:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:hearing-deafness:2:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:hearing-deafness:2:3"
      },
      {
        "index": 5,
        "target": "note",
        "base": -3,
        "value": -1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.HearingPenalty",
        "templates": [
          "affaibli"
        ],
        "optionId": "vitner-body-vitner:hearing-deafness:2:5",
        "statusAtOrBelow": {
          "threshold": -10,
          "status": "deaf"
        }
      }
    ]
  },
  "vitner-body-vitner:sense-of-smell:3#ameliore": {
    "id": "ameliore",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.vitner-body-vitner:sense-of-smell:3#ameliore.Sense0\",\"range\":50,\"enabled\":true}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "sourceId": "vitner-body-vitner:sense-of-smell:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:sense-of-smell:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:sense-of-smell:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:sense-of-smell:3:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:sense-of-smell:3:3"
      },
      {
        "index": 5,
        "target": "senseRange",
        "sense": 0,
        "value": 10,
        "templates": [
          "ameliore"
        ],
        "optionId": "vitner-body-vitner:sense-of-smell:3:5"
      },
      {
        "index": 6,
        "target": "senseRange",
        "sense": 0,
        "value": 100,
        "templates": [
          "ameliore"
        ],
        "optionId": "vitner-body-vitner:sense-of-smell:3:6"
      },
      {
        "index": 7,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.SmellBonus",
        "templates": [
          "ameliore"
        ],
        "optionId": "vitner-body-vitner:sense-of-smell:3:7"
      }
    ]
  },
  "vitner-body-vitner:sense-of-smell:3#affaibli": {
    "id": "affaibli",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:sense-of-smell:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:sense-of-smell:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:sense-of-smell:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:sense-of-smell:3:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:sense-of-smell:3:3"
      },
      {
        "index": 7,
        "target": "note",
        "base": -3,
        "value": -1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.SmellPenalty",
        "templates": [
          "affaibli"
        ],
        "optionId": "vitner-body-vitner:sense-of-smell:3:7"
      }
    ]
  },
  "vitner-body-vitner:vision-blindness:4#ameliore": {
    "id": "ameliore",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:vision-blindness:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:vision-blindness:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:vision-blindness:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:vision-blindness:4:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:vision-blindness:4:3"
      },
      {
        "index": 5,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.SightBonus",
        "templates": [
          "ameliore"
        ],
        "optionId": "vitner-body-vitner:vision-blindness:4:5"
      }
    ]
  },
  "vitner-body-vitner:vision-blindness:4#affaibli": {
    "id": "affaibli",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-body-vitner:vision-blindness:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:vision-blindness:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:vision-blindness:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:vision-blindness:4:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:vision-blindness:4:3"
      },
      {
        "index": 5,
        "target": "note",
        "base": -3,
        "value": -1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.SightPenalty",
        "templates": [
          "affaibli"
        ],
        "optionId": "vitner-body-vitner:vision-blindness:4:5",
        "statusAtOrBelow": {
          "threshold": -10,
          "status": "blind"
        }
      }
    ]
  },
  "vitner-body-vitner:immobilize:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 30,
    "statuses": [
      "restrain"
    ],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      4,
      5
    ],
    "breakOnDamage": true,
    "sourceId": "vitner-body-vitner:immobilize:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:immobilize:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:immobilize:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:immobilize:6:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:immobilize:6:3"
      }
    ]
  },
  "vitner-body-vitner:appearance-change:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-body-vitner:appearance-change:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:appearance-change:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:appearance-change:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:appearance-change:7:2"
      }
    ]
  },
  "vitner-body-vitner:leather-skin:5#leather-skin": {
    "id": "leather-skin",
    "icon": "icons/svg/shield.svg",
    "duration": "6 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.protection",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "vitner-body-vitner:leather-skin:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:leather-skin:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:leather-skin:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:leather-skin:5:2"
      },
      {
        "index": 3,
        "target": "protection",
        "value": 1,
        "optionId": "vitner-body-vitner:leather-skin:5:3"
      }
    ]
  },
  "vitner-body-vitner:hasten:9#hate": {
    "id": "hate",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"degrees\",\"value\":1,\"skillBonus\":{\"skills\":[\"agility\",\"fighting\"],\"values\":{\"0\":0,\"1\":1,\"2\":2,\"4\":3,\"6\":4,\"8\":5,\"-8\":-5,\"-6\":-4,\"-4\":-3,\"-2\":-2,\"-1\":-1}}}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "vitner-body-vitner:hasten:9",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:hasten:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-body-vitner:hasten:9:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:hasten:9:0"
      },
      {
        "index": 5,
        "target": "traitDegrees",
        "trait": "dexterity",
        "value": 1,
        "optionId": "vitner-body-vitner:hasten:9:5"
      }
    ]
  },
  "vitner-body-vitner:hasten:9#hate-inverse": {
    "id": "hate-inverse",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"degrees\",\"value\":-1,\"skillBonus\":{\"skills\":[\"agility\",\"fighting\"],\"values\":{\"0\":0,\"1\":1,\"2\":2,\"4\":3,\"6\":4,\"8\":5,\"-8\":-5,\"-6\":-4,\"-4\":-3,\"-2\":-2,\"-1\":-1}}}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "vitner-body-vitner:hasten:9",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:hasten:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-body-vitner:hasten:9:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:hasten:9:0"
      },
      {
        "index": 5,
        "target": "traitDegrees",
        "trait": "dexterity",
        "value": 1,
        "optionId": "vitner-body-vitner:hasten:9:5"
      }
    ]
  },
  "vitner-body-vitner:strengthen:8#vigueur": {
    "id": "vigueur",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"degrees\",\"value\":1}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "vitner-body-vitner:strengthen:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:strengthen:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-body-vitner:strengthen:8:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:strengthen:8:0"
      },
      {
        "index": 5,
        "target": "traitDegrees",
        "trait": "strength",
        "value": 1,
        "optionId": "vitner-body-vitner:strengthen:8:5"
      }
    ]
  },
  "vitner-body-vitner:strengthen:8#vigueur-inverse": {
    "id": "vigueur-inverse",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"degrees\",\"value\":-1}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "vitner-body-vitner:strengthen:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:strengthen:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-body-vitner:strengthen:8:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-body-vitner:strengthen:8:0"
      },
      {
        "index": 5,
        "target": "traitDegrees",
        "trait": "strength",
        "value": 1,
        "optionId": "vitner-body-vitner:strengthen:8:5"
      }
    ]
  },
  "vitner-body-vitner:change-creature:11#transformation": {
    "id": "transformation",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "changes": [
      {
        "key": "system.transformation.chooseBestiary",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "physical",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "vitner-body-vitner:change-creature:11",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-body-vitner:change-creature:11:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-body-vitner:change-creature:11:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-body-vitner:change-creature:11:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-body-vitner:change-creature:11:3"
      }
    ]
  },
  "vitner-delusion-vitner:increase-sounds:3#voix": {
    "id": "voix",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-delusion-vitner:increase-sounds:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:2"
      }
    ]
  },
  "vitner-delusion-vitner:increase-sounds:3#bruits": {
    "id": "bruits",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-delusion-vitner:increase-sounds:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:increase-sounds:3:2"
      }
    ]
  },
  "vitner-delusion-vitner:phantom-sound:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2
    ],
    "sourceId": "vitner-delusion-vitner:phantom-sound:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-delusion-vitner:phantom-sound:1:0"
      }
    ]
  },
  "vitner-delusion-vitner:traceless:4#trace": {
    "id": "trace",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-delusion-vitner:traceless:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:traceless:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-delusion-vitner:traceless:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-delusion-vitner:traceless:4:2"
      }
    ]
  },
  "vitner-delusion-vitner:ghost-voice:5#voix": {
    "id": "voix",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "vitner-delusion-vitner:ghost-voice:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:ghost-voice:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:ghost-voice:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-delusion-vitner:ghost-voice:5:2"
      }
    ]
  },
  "vitner-delusion-vitner:camouflage:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-delusion-vitner:camouflage:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:camouflage:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:camouflage:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-delusion-vitner:camouflage:7:2"
      }
    ]
  },
  "vitner-delusion-vitner:depict:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      3,
      4,
      5
    ],
    "sourceId": "vitner-delusion-vitner:depict:6",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:depict:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-delusion-vitner:depict:6:2"
      }
    ]
  },
  "vitner-delusion-vitner:landscape-illusion:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2
    ],
    "sourceId": "vitner-delusion-vitner:landscape-illusion:8",
    "parameters": [
      {
        "index": 3,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:landscape-illusion:8:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-delusion-vitner:landscape-illusion:8:4"
      },
      {
        "index": 5,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-delusion-vitner:landscape-illusion:8:5"
      }
    ]
  },
  "vitner-delusion-vitner:silence:9#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4
    ],
    "sourceId": "vitner-delusion-vitner:silence:9",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-delusion-vitner:silence:9:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:silence:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:silence:9:2"
      }
    ]
  },
  "vitner-delusion-vitner:invisibility:11#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "vitner-delusion-vitner:invisibility:11",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-delusion-vitner:invisibility:11:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-delusion-vitner:invisibility:11:1"
      }
    ]
  },
  "vitner-vitner-of-objects:detect-composition:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "vitner-vitner-of-objects:detect-composition:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "vitner-vitner-of-objects:detect-composition:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-vitner-of-objects:detect-composition:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:detect-composition:0:2"
      }
    ]
  },
  "vitner-vitner-of-objects:waterproof:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5
    ],
    "sourceId": "vitner-vitner-of-objects:waterproof:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:waterproof:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-vitner-of-objects:waterproof:1:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-vitner-of-objects:waterproof:1:2"
      }
    ]
  },
  "vitner-vitner-of-objects:bind:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      4
    ],
    "sourceId": "vitner-vitner-of-objects:bind:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-vitner-of-objects:bind:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-vitner-of-objects:bind:2:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:bind:2:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-vitner-of-objects:bind:2:3"
      }
    ]
  },
  "vitner-vitner-of-objects:alarm-object:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 heures",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6
    ],
    "sourceId": "vitner-vitner-of-objects:alarm-object:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:alarm-object:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-vitner-of-objects:alarm-object:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "vitner-vitner-of-objects:alarm-object:4:2"
      }
    ]
  },
  "vitner-vitner-of-objects:enlarge-reduce-object:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "4 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6
    ],
    "sourceId": "vitner-vitner-of-objects:enlarge-reduce-object:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "vitner-vitner-of-objects:enlarge-reduce-object:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "vitner-vitner-of-objects:enlarge-reduce-object:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:enlarge-reduce-object:6:2"
      }
    ]
  },
  "vitner-vitner-of-objects:create-object:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "sourceId": "vitner-vitner-of-objects:create-object:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "vitner-vitner-of-objects:create-object:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "vitner-vitner-of-objects:create-object:8:1"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:healing:0#guerison": {
    "id": "guerison",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:healing:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing:0:0"
      },
      {
        "index": 1,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 1,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing:0:1"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:sunray:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:sunray:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-warmth-of-sunvei:sunray:1:0"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:summer-place:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 heures",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:summer-place:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-warmth-of-sunvei:summer-place:3:0"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:healing-glow:2#lumiere-guerisseuse": {
    "id": "lumiere-guerisseuse",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 1
    },
    "sourceId": "holy-gerbanis-warmth-of-sunvei:healing-glow:2",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 1,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing-glow:2:0"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:healing-warmth:5#chaleur-guerisseuse": {
    "id": "chaleur-guerisseuse",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      }
    ],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:healing-warmth:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing-warmth:5:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 3,
        "value": 1,
        "labelKey": "TRUDVANG.Transformation.HealingDiseaseNote",
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing-warmth:5:1"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 2,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing-warmth:5:2"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:firon-power:4#pouvoir-de-firon": {
    "id": "pouvoir-de-firon",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 5
    },
    "sourceId": "holy-gerbanis-warmth-of-sunvei:firon-power:4",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 2,
        "optionId": "holy-gerbanis-warmth-of-sunvei:firon-power:4:0"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6:0"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7#souffle": {
    "id": "souffle",
    "icon": "icons/svg/aura.svg",
    "duration": "3 jours",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 10,
        "value": 1,
        "labelKey": "TRUDVANG.Transformation.HealingPoisonCurseNote",
        "optionId": "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7:1"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 3,
        "optionId": "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7:2"
      }
    ]
  },
  "holy-gerbanis-warmth-of-sunvei:healing-sun:8#soleil-guerisseur": {
    "id": "soleil-guerisseur",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 10
    },
    "sourceId": "holy-gerbanis-warmth-of-sunvei:healing-sun:8",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 3,
        "optionId": "holy-gerbanis-warmth-of-sunvei:healing-sun:8:0"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:voice-of-command:1#autorite": {
    "id": "autorite",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:voice-of-command:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:voice-of-command:1:0"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:troll-strength:0#force-du-troll": {
    "id": "force-du-troll",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-gerbanis-strength-of-stormi:troll-strength:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:troll-strength:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:troll-strength:0:1"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:hinji-strength:3#force-de-hinje": {
    "id": "force-de-hinje",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-gerbanis-strength-of-stormi:hinji-strength:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:hinji-strength:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:hinji-strength:3:1"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:havar:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:havar:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:havar:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:havar:2:1"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:jarl-s-call:4#appel-du-jarl": {
    "id": "appel-du-jarl",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:jarl-s-call:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-strength-of-stormi:jarl-s-call:4:0"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:shield-disir:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-gerbanis-strength-of-stormi:shield-disir:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:shield-disir:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:shield-disir:5:1"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun": {
    "id": "force-du-jotun",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":8}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-strength-of-stormi:jotun-strength:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:jotun-strength:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:jotun-strength:6:1"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun-allies": {
    "id": "force-du-jotun-allies",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-strength-of-stormi:jotun-strength:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:jotun-strength:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:jotun-strength:6:1"
      },
      {
        "index": 4,
        "target": "traitValue",
        "trait": "strength",
        "value": 2,
        "templates": [
          "force-du-jotun-allies"
        ],
        "optionId": "holy-gerbanis-strength-of-stormi:jotun-strength:6:4"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:voice-of-stormi:7#voix-de-storme": {
    "id": "voix-de-storme",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-strength-of-stormi:voice-of-stormi:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-strength-of-stormi:voice-of-stormi:7:0"
      }
    ]
  },
  "holy-gerbanis-strength-of-stormi:einharjar:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-gerbanis-strength-of-stormi:einharjar:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-strength-of-stormi:einharjar:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-strength-of-stormi:einharjar:8:1"
      }
    ]
  },
  "holy-gerbanis-wrath-of-tyrd:battle-cry:1#ally": {
    "id": "ally",
    "icon": "icons/svg/sword.svg",
    "duration": "2 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-gerbanis-wrath-of-tyrd:battle-cry:1",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-wrath-of-tyrd:battle-cry:1:1"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": 1,
        "optionId": "holy-gerbanis-wrath-of-tyrd:battle-cry:1:3"
      }
    ]
  },
  "holy-gerbanis-wrath-of-tyrd:war-cry:4#ally": {
    "id": "ally",
    "icon": "icons/svg/sword.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-gerbanis-wrath-of-tyrd:war-cry:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-wrath-of-tyrd:war-cry:4:0"
      },
      {
        "index": 4,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": 1,
        "optionId": "holy-gerbanis-wrath-of-tyrd:war-cry:4:4",
        "templates": [
          "ally"
        ]
      }
    ]
  },
  "holy-gerbanis-wrath-of-tyrd:war-cry:4#enemy": {
    "id": "enemy",
    "icon": "icons/svg/sword.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "-3",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-gerbanis-wrath-of-tyrd:war-cry:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-wrath-of-tyrd:war-cry:4:0"
      },
      {
        "index": 5,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": -1,
        "optionId": "holy-gerbanis-wrath-of-tyrd:war-cry:4:5",
        "templates": [
          "enemy"
        ]
      }
    ]
  },
  "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#ally": {
    "id": "ally",
    "icon": "icons/svg/sword.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7:0"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": 1,
        "optionId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7:2",
        "templates": [
          "ally"
        ]
      }
    ]
  },
  "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#enemy": {
    "id": "enemy",
    "icon": "icons/svg/sword.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "-4",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7:0"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": -1,
        "optionId": "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7:3",
        "templates": [
          "enemy"
        ]
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:wall-of-dusk:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-gerbanis-influence-of-jorn:wall-of-dusk:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-influence-of-jorn:wall-of-dusk:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-influence-of-jorn:wall-of-dusk:1:1"
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:falfax:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-influence-of-jorn:falfax:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-influence-of-jorn:falfax:2:0"
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:night-curtain:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4
    ],
    "sourceId": "holy-gerbanis-influence-of-jorn:night-curtain:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-influence-of-jorn:night-curtain:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-influence-of-jorn:night-curtain:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-influence-of-jorn:night-curtain:3:2"
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4
    ],
    "sourceId": "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4:2"
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:asiblack:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-influence-of-jorn:asiblack:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-influence-of-jorn:asiblack:6:0"
      }
    ]
  },
  "holy-gerbanis-influence-of-jorn:snarfari:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "30 minutes",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-influence-of-jorn:snarfari:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-influence-of-jorn:snarfari:8:0"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:willpower:1#force-d-ame": {
    "id": "force-d-ame",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-gerbanis-power-of-enken:willpower:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:willpower:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-power-of-enken:willpower:1:1"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:night-vision:0#vision-nocturne": {
    "id": "vision-nocturne",
    "duration": "1 minute",
    "icon": "icons/svg/eye.svg",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-gerbanis-power-of-enken:night-vision:0#vision-nocturne.Sense0\",\"range\":60,\"enabled\":true}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-gerbanis-power-of-enken:night-vision:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:night-vision:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-power-of-enken:night-vision:0:1"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:bold:2#temerite": {
    "id": "temerite",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-gerbanis-power-of-enken:bold:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:bold:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-power-of-enken:bold:2:1"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:soul-sight:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-power-of-enken:soul-sight:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:soul-sight:4:0"
      },
      {
        "index": 2,
        "target": "note",
        "base": 5,
        "value": 1,
        "skill": "shadowArts",
        "skillChoice": true,
        "restrictedSkill": "shadowArts",
        "tooltip": true,
        "labelKey": "TRUDVANG.Transformation.HiddenDetectionBonus",
        "optionId": "holy-gerbanis-power-of-enken:soul-sight:4:2"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken": {
    "id": "c-ur-d-enken",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":8}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-power-of-enken:heart-of-enken:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:heart-of-enken:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-power-of-enken:heart-of-enken:6:1"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken-allies": {
    "id": "c-ur-d-enken-allies",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-gerbanis-power-of-enken:heart-of-enken:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:heart-of-enken:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-gerbanis-power-of-enken:heart-of-enken:6:1"
      },
      {
        "index": 4,
        "target": "traitValue",
        "trait": "psyche",
        "value": 2,
        "templates": [
          "c-ur-d-enken-allies"
        ],
        "optionId": "holy-gerbanis-power-of-enken:heart-of-enken:6:4"
      }
    ]
  },
  "holy-gerbanis-power-of-enken:eye-of-enken:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-power-of-enken:eye-of-enken:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-power-of-enken:eye-of-enken:8:0"
      },
      {
        "index": 2,
        "target": "note",
        "base": 8,
        "value": 1,
        "skill": "shadowArts",
        "skillChoice": true,
        "restrictedSkill": "shadowArts",
        "tooltip": true,
        "labelKey": "TRUDVANG.Transformation.HiddenDetectionBonus",
        "optionId": "holy-gerbanis-power-of-enken:eye-of-enken:8:2"
      }
    ]
  },
  "holy-gerbanis-wisdom-of-windinna:inspiration:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-wisdom-of-windinna:inspiration:0",
    "parameters": [
      {
        "index": 1,
        "target": "note",
        "base": 3,
        "value": 0,
        "optionId": "holy-gerbanis-wisdom-of-windinna:inspiration:0:1",
        "labelKey": "TRUDVANG.Transformation.CreationOnce",
        "skillChoice": true,
        "skillOnly": true,
        "tooltip": true,
        "consumeOnUse": true
      }
    ]
  },
  "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2",
    "parameters": [
      {
        "index": 1,
        "target": "note",
        "base": 5,
        "value": 0,
        "optionId": "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2:1",
        "labelKey": "TRUDVANG.Transformation.CreationOnce",
        "skillChoice": true,
        "skillOnly": true,
        "tooltip": true,
        "consumeOnUse": true
      }
    ]
  },
  "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4:0"
      }
    ]
  },
  "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7:0"
      }
    ]
  },
  "holy-gerbanis-wisdom-of-windinna:swine-rush:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-gerbanis-wisdom-of-windinna:swine-rush:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-gerbanis-wisdom-of-windinna:swine-rush:6:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:journey-wind:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "aura": {
      "radius": 3,
      "radiusOptionId": "holy-ealdtradition-magh-s-gift:journey-wind:0:1",
      "light": false
    },
    "sourceId": "holy-ealdtradition-magh-s-gift:journey-wind:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-magh-s-gift:journey-wind:0:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:rider-s-melody:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-magh-s-gift:rider-s-melody:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-magh-s-gift:rider-s-melody:1:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:elf-summer:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2
    ],
    "sourceId": "holy-ealdtradition-magh-s-gift:elf-summer:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-magh-s-gift:elf-summer:3:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:hero-s-song:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-magh-s-gift:hero-s-song:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-magh-s-gift:hero-s-song:4:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:king-s-anthem:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-magh-s-gift:king-s-anthem:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-magh-s-gift:king-s-anthem:6:0"
      }
    ]
  },
  "holy-ealdtradition-magh-s-gift:harvest-year:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 année",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-ealdtradition-magh-s-gift:harvest-year:8",
    "parameters": []
  },
  "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0:1"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:animal-speech:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-gift-of-thanja:animal-speech:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:animal-speech:1:0"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf": {
    "id": "aspect-du-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"highest\",\"value\":1},{\"trait\":\"constitution\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.capabilities",
        "type": "override",
        "value": "[\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf.Capability0\"]",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":2}]",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf.Attack0\",\"damage\":\"1d10\",\"openRoll\":9,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-ealdtradition-gift-of-thanja:stagshape:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:stagshape:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:stagshape:2:1"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:bestial-tongue:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-gift-of-thanja:bestial-tongue:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:bestial-tongue:3:0"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon": {
    "id": "aspect-du-saumon",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.capabilities",
        "type": "override",
        "value": "[\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon.Capability0\",\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon.Capability1\"]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"replace\",\"value\":0},{\"mode\":\"swim\",\"method\":\"baseMultiple\",\"value\":2}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-ealdtradition-gift-of-thanja:salmonshape:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:salmonshape:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:salmonshape:4:1"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5:1"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:forest-denizen:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-gift-of-thanja:forest-denizen:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:forest-denizen:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:forest-denizen:7:1"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:dragon-tongue:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-gift-of-thanja:dragon-tongue:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:dragon-tongue:6:0"
      }
    ]
  },
  "holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau": {
    "id": "aspect-du-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"highest\",\"value\":4},{\"trait\":\"constitution\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau.Sense0\",\"range\":null,\"enabled\":true},{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau.Sense1\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.capabilities",
        "type": "override",
        "value": "[\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau.Capability0\",\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau.Capability1\"]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":0.5},{\"mode\":\"flight\",\"method\":\"baseMultiple\",\"value\":4}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.defense",
        "type": "override",
        "value": "-5",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-ealdtradition-gift-of-thanja:ravenshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-gift-of-thanja:ravenshape:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-gift-of-thanja:ravenshape:8:1"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:strong-beer:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:strong-beer:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-heritage-of-majne:strong-beer:0:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:trollslayer:1#tueur-trolls": {
    "id": "tueur-trolls",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:trollslayer:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-heritage-of-majne:trollslayer:1:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:king-s-militia:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-ealdtradition-heritage-of-majne:king-s-militia:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-heritage-of-majne:king-s-militia:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-heritage-of-majne:king-s-militia:3:1"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:giantslayer:2#tueur-geants": {
    "id": "tueur-geants",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:giantslayer:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-heritage-of-majne:giantslayer:2:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:hero-s-brew:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:hero-s-brew:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-heritage-of-majne:hero-s-brew:4:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:king-s-guard:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-ealdtradition-heritage-of-majne:king-s-guard:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-heritage-of-majne:king-s-guard:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-heritage-of-majne:king-s-guard:5:1"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:king-s-ale:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:king-s-ale:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-heritage-of-majne:king-s-ale:7:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:dragonslayer:6#tueur-dragons": {
    "id": "tueur-dragons",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-ealdtradition-heritage-of-majne:dragonslayer:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-heritage-of-majne:dragonslayer:6:0"
      }
    ]
  },
  "holy-ealdtradition-heritage-of-majne:the-nine-kings:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-ealdtradition-heritage-of-majne:the-nine-kings:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-heritage-of-majne:the-nine-kings:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-heritage-of-majne:the-nine-kings:8:1"
      }
    ]
  },
  "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0#principal": {
    "id": "principal",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0:1"
      }
    ]
  },
  "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3#principal": {
    "id": "principal",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "sourceId": "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3:1"
      }
    ]
  },
  "holy-ealdtradition-halawen-s-offering:fearless:6#principal": {
    "id": "principal",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "holy-ealdtradition-halawen-s-offering:fearless:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-halawen-s-offering:fearless:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-halawen-s-offering:fearless:6:1"
      }
    ]
  },
  "holy-ealdtradition-halawen-s-offering:fearless:6#allie": {
    "id": "allie",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"psyche\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "holy-ealdtradition-halawen-s-offering:fearless:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-halawen-s-offering:fearless:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-halawen-s-offering:fearless:6:1"
      },
      {
        "index": 4,
        "target": "traitValue",
        "trait": "psyche",
        "value": 2,
        "templates": [
          "allie"
        ],
        "optionId": "holy-ealdtradition-halawen-s-offering:fearless:6:4"
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:simmering-blood:0#simmering-blood": {
    "id": "simmering-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "1d10",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:simmering-blood:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-tribute-of-morgu:simmering-blood:0:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-ealdtradition-tribute-of-morgu:simmering-blood:0:1"
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
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.heightBonus",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.weightBonus",
        "type": "override",
        "value": "30",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 20,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:rage:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-tribute-of-morgu:rage:3:0"
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:rage:3#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:rage:3",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:boiling-blood:2#boiling-blood": {
    "id": "boiling-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "2d10",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:boiling-blood:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-tribute-of-morgu:boiling-blood:2:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-ealdtradition-tribute-of-morgu:boiling-blood:2:1"
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
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "10",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10 (JO 10)",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "1.5",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 30,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:madness:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-tribute-of-morgu:madness:5:0"
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:madness:5#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:madness:5",
    "parameters": []
  },
  "holy-ealdtradition-tribute-of-morgu:bloodfire:6#bloodfire": {
    "id": "bloodfire",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "3d10",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:bloodfire:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-ealdtradition-tribute-of-morgu:bloodfire:6:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-ealdtradition-tribute-of-morgu:bloodfire:6:1"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "15",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10 (JO 9-10)",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "2",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.ignoreWounds",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 50,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:riastarthae:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-ealdtradition-tribute-of-morgu:riastarthae:7:0"
      }
    ]
  },
  "holy-ealdtradition-tribute-of-morgu:riastarthae:7#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-ealdtradition-tribute-of-morgu:riastarthae:7",
    "parameters": []
  },
  "holy-ealdtradition-nema-s-usefulness:owl-hearing:3#ouie-du-hibou": {
    "id": "ouie-du-hibou",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-nema-s-usefulness:owl-hearing:3#ouie-du-hibou.Sense0\",\"range\":50,\"enabled\":true}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-ealdtradition-nema-s-usefulness:owl-hearing:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-nema-s-usefulness:owl-hearing:3:0"
      },
      {
        "index": 1,
        "target": "senseRange",
        "sense": 0,
        "value": 20,
        "optionId": "holy-ealdtradition-nema-s-usefulness:owl-hearing:3:1"
      }
    ]
  },
  "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2:0"
      }
    ]
  },
  "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5:0"
      }
    ]
  },
  "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7#sens-du-griffon": {
    "id": "sens-du-griffon",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7#sens-du-griffon.Sense0\",\"range\":200,\"enabled\":true}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7:0"
      },
      {
        "index": 1,
        "target": "senseRange",
        "sense": 0,
        "value": 100,
        "optionId": "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7:1"
      }
    ]
  },
  "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:stone-senses:2#sens-petrifies": {
    "id": "sens-petrifies",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.initiative",
        "type": "add",
        "value": "-2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "-1",
        "phase": "initial",
        "priority": 20
      }
    ],
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-senses:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-tenetnid-tablet-of-anger:stone-senses:2:0"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.rolls.initiative",
        "value": -2,
        "optionId": "holy-tenetnid-tablet-of-anger:stone-senses:2:2"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": -1,
        "optionId": "holy-tenetnid-tablet-of-anger:stone-senses:2:2"
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:statue:5#statue": {
    "id": "statue",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "0",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "priority": 30,
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-tenetnid-tablet-of-anger:statue:5:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "priority": 30,
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:statue:5#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-tenetnid-tablet-of-anger:statue:5",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#monument-en-pierre": {
    "id": "monument-en-pierre",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "0",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-tenetnid-tablet-of-anger:stone-monument:8:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-anger:stone-monument:8#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-tenetnid-tablet-of-anger:stone-monument:8",
    "parameters": []
  },
  "holy-tenetnid-tablet-of-grace:holy-mending:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "periodic": {
      "interval": 60,
      "operation": "heal",
      "amount": 1
    },
    "sourceId": "holy-tenetnid-tablet-of-grace:holy-mending:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-grace:holy-mending:1:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "periodic": {
      "interval": 60,
      "operation": "heal",
      "amount": 3
    },
    "sourceId": "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-grace:breath-of-gave:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "periodic": {
      "interval": 60,
      "operation": "heal",
      "amount": 6
    },
    "sourceId": "holy-tenetnid-tablet-of-grace:breath-of-gave:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-grace:breath-of-gave:6:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1#oreille": {
    "id": "oreille",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.SpokenLanguage",
    "sourceId": "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3#langue": {
    "id": "langue",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.SpokenLanguage",
    "sourceId": "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 2,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "skillOnly": true,
        "restrictedSkill": "knowledge",
        "labelKey": "TRUDVANG.Transformation.SpokenLanguageBonus",
        "optionId": "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3:2"
      }
    ]
  },
  "holy-tenetnid-tablet-of-voices:sanity-of-gave:6#langue": {
    "id": "langue",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.SpokenLanguage",
    "sourceId": "holy-tenetnid-tablet-of-voices:sanity-of-gave:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-voices:sanity-of-gave:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-voices:sanity-of-gave:6:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "skillOnly": true,
        "restrictedSkill": "knowledge",
        "labelKey": "TRUDVANG.Transformation.SpokenLanguageBonus",
        "optionId": "holy-tenetnid-tablet-of-voices:sanity-of-gave:6:2"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:sheltering:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:sheltering:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-shield:sheltering:1:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:thornwall:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3,
      4,
      5,
      6
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:thornwall:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-shield:thornwall:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-shield:thornwall:3:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:storm-protection:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:storm-protection:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-shield:storm-protection:2:0"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-shield:bark-skin:4#peau-d-ecorce": {
    "id": "peau-d-ecorce",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "10",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.endAtEmptyHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-tenetnid-tablet-of-the-shield:bark-skin:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-shield:bark-skin:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-shield:bark-skin:4:1"
      },
      {
        "index": 2,
        "target": "temporaryHP",
        "value": 1,
        "optionId": "holy-tenetnid-tablet-of-the-shield:bark-skin:4:2"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.damageTakenFactor",
        "type": "override",
        "value": "0.2",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "restrain"
    ],
    "related": [],
    "priority": 50,
    "sourceId": "holy-tenetnid-tablet-of-the-shield:tree-port:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-tenetnid-tablet-of-the-shield:tree-port:8:0"
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1,
        "optionId": "holy-tenetnid-tablet-of-the-shield:tree-port:8:2"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:blessed-spear:1#weapon": {
    "id": "weapon",
    "icon": "icons/svg/sword.svg",
    "duration": "3 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "weaponDamage": {
      "normal": 1,
      "undead": 2,
      "demon": 3,
      "optionId": "holy-tenetnid-tablet-of-the-knight:blessed-spear:1:2"
    },
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:blessed-spear:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-tenetnid-tablet-of-the-knight:blessed-spear:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:blessed-spear:1:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:holy-authority:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:holy-authority:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:holy-authority:2:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 1,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.PersuasionBonus",
        "optionId": "holy-tenetnid-tablet-of-the-knight:holy-authority:2:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5#weapon": {
    "id": "weapon",
    "icon": "icons/svg/sword.svg",
    "duration": "4 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "weaponDamage": {
      "normal": 3,
      "undead": 5,
      "demon": 7,
      "optionId": "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5:2"
    },
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      4
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.PersuasionBonus",
        "optionId": "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7#weapon": {
    "id": "weapon",
    "icon": "icons/svg/sword.svg",
    "duration": "5 tours de jeu",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "weaponDamage": {
      "normal": 5,
      "undead": 8,
      "demon": 11,
      "optionId": "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7:2"
    },
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      3
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8:0"
      },
      {
        "index": 2,
        "target": "note",
        "base": 6,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "labelKey": "TRUDVANG.Transformation.PersuasionBonus",
        "optionId": "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8:2"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-sun:dawn-shine:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "aura": {
      "radius": 1,
      "radiusOptionId": "holy-tenetnid-tablet-of-the-sun:dawn-shine:0:2",
      "light": true,
      "recipientMode": "none"
    },
    "sourceId": "holy-tenetnid-tablet-of-the-sun:dawn-shine:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-sun:dawn-shine:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-sun:dawn-shine:0:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-sun:thermal-light:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.allActions",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.ignoreFearPenalty",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      }
    ],
    "displayPowerOptions": [
      2
    ],
    "aura": {
      "radius": 2,
      "radiusOptionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:2",
      "light": true
    },
    "sourceId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:1"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.rolls.allActions",
        "value": 1,
        "optionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:3",
        "templates": [
          "effect"
        ]
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-sun:thermal-light:3#fear-only": {
    "id": "fear-only",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.ignoreFearPenalty",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      }
    ],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-sun:thermal-light:3:1"
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-sun:holy-radiance:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.allActions",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.ignoreFearPenalty",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 40
      }
    ],
    "displayPowerOptions": [
      0
    ],
    "aura": {
      "radius": 3,
      "radiusOptionId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7:0",
      "light": true
    },
    "sourceId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7:2"
      },
      {
        "index": 1,
        "target": "modifier",
        "key": "system.modifiers.rolls.allActions",
        "value": 1,
        "optionId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7:1",
        "templates": [
          "effect"
        ]
      }
    ]
  },
  "holy-tenetnid-tablet-of-the-sun:holy-radiance:7#fear-only": {
    "id": "fear-only",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.ignoreFearPenalty",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 40
      }
    ],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-tenetnid-tablet-of-the-sun:holy-radiance:7:2"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:mind-of-the-predator:1#instinct-predateur": {
    "id": "instinct-predateur",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-haminges-power-of-the-beast:mind-of-the-predator:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-beast:mind-of-the-predator:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:mind-of-the-predator:1:1"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:resilience:0#resilience": {
    "id": "resilience",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"constitution\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-haminges-power-of-the-beast:resilience:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:resilience:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:resilience:0:1"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:mastomant-s-tusks:2#defenses-du-mastomant": {
    "id": "defenses-du-mastomant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-haminges-power-of-the-beast:mastomant-s-tusks:2#defenses-du-mastomant.Attack0\",\"damage\":\"1d10\",\"openRoll\":0,\"maxActions\":1}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-beast:mastomant-s-tusks:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:mastomant-s-tusks:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:mastomant-s-tusks:2:1"
      },
      {
        "index": 2,
        "target": "attackStep",
        "attack": 0,
        "steps": [
          {
            "damage": "1d10",
            "openRoll": 0
          },
          {
            "damage": "1d10",
            "openRoll": 10
          },
          {
            "damage": "1d10",
            "openRoll": 9
          },
          {
            "damage": "1d10",
            "openRoll": 8
          },
          {
            "damage": "1d10 + 1",
            "openRoll": 8
          }
        ],
        "optionId": "holy-haminges-power-of-the-beast:mastomant-s-tusks:2:2"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:endurance-of-the-boar:3#endurance-du-sanglier": {
    "id": "endurance-du-sanglier",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"constitution\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-beast:endurance-of-the-boar:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:endurance-of-the-boar:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:endurance-of-the-boar:3:1"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:mastomant-s-fur:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-haminges-power-of-the-beast:mastomant-s-fur:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:mastomant-s-fur:4:0"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:endurance-of-the-giant:6#endurance-du-geant": {
    "id": "endurance-du-geant",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"constitution\",\"method\":\"replace\",\"value\":8}]",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.immunities",
        "type": "override",
        "value": "[\"poison\",\"maladie\"]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-haminges-power-of-the-beast:endurance-of-the-giant:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:endurance-of-the-giant:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:endurance-of-the-giant:6:1"
      }
    ]
  },
  "holy-haminges-power-of-the-beast:master-of-wolfkin:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3
    ],
    "sourceId": "holy-haminges-power-of-the-beast:master-of-wolfkin:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:master-of-wolfkin:7:0"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "30",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.immunities",
        "type": "override",
        "value": "[\"toutes les formes de froid\"]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "7",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-haminges-power-of-the-beast:mastomantshape:8#aspect-du-mastomant.Attack0\",\"damage\":\"2d10\",\"openRoll\":9,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-beast:mastomantshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-beast:mastomantshape:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-beast:mastomantshape:8:1"
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-beast:mastomantshape:8:2"
      },
      {
        "index": 3,
        "target": "temporaryHP",
        "value": 10,
        "optionId": "holy-haminges-power-of-the-beast:mastomantshape:8:3"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:shattered-mind:1#esprit-brise": {
    "id": "esprit-brise",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.initiative",
        "type": "add",
        "value": "-2",
        "phase": "initial",
        "priority": 10
      },
      {
        "key": "system.modifiers.rolls.combatActions",
        "type": "add",
        "value": "-1",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-haminges-power-of-the-scale:shattered-mind:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-scale:shattered-mind:1:0"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.rolls.initiative",
        "value": -2,
        "optionId": "holy-haminges-power-of-the-scale:shattered-mind:1:2"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.rolls.combatActions",
        "value": -1,
        "optionId": "holy-haminges-power-of-the-scale:shattered-mind:1:2"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:regenerative-blood:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "periodic": {
      "interval": 60,
      "operation": "heal",
      "amount": 1
    },
    "sourceId": "holy-haminges-power-of-the-scale:regenerative-blood:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:regenerative-blood:3:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-gauche": {
    "id": "membre-de-pierrebras-gauche",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:1"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-droit": {
    "id": "membre-de-pierrebras-droit",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:1"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-gauche": {
    "id": "membre-de-pierrejambe-gauche",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:1"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-droite": {
    "id": "membre-de-pierrejambe-droite",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-scale:limb-of-stone:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:1"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-scale:limb-of-stone:5:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "periodic": {
      "interval": 5,
      "operation": "heal",
      "amount": 1
    },
    "sourceId": "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8#c-ur-du-lindwurm": {
    "id": "c-ur-du-lindwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800,
        "optionId": "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8:1"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification": {
    "id": "petrification",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "0",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "paralysis"
    ],
    "related": [
      "petrification-recovery-half",
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-the-scale:petrify:7:0"
      }
    ]
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-half": {
    "id": "petrification-recovery-half",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [
      "petrification-recovery-two-thirds"
    ],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": []
  },
  "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-two-thirds": {
    "id": "petrification-recovery-two-thirds",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-scale:petrify:7",
    "parameters": []
  },
  "holy-haminges-power-of-men:accomplished:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-haminges-power-of-men:accomplished:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-men:accomplished:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-men:accomplished:1:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 1,
        "value": 1,
        "optionId": "holy-haminges-power-of-men:accomplished:1:2",
        "labelKey": "TRUDVANG.Transformation.OneSkillBonus",
        "skillChoice": true,
        "skillOnly": true,
        "tooltip": true,
        "consumeOnUse": true
      }
    ]
  },
  "holy-haminges-power-of-men:sight-of-the-dwarves:0#vision-des-nains": {
    "id": "vision-des-nains",
    "duration": "1 minute",
    "icon": "icons/svg/eye.svg",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-haminges-power-of-men:sight-of-the-dwarves:0#vision-des-nains.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-haminges-power-of-men:sight-of-the-dwarves:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-men:sight-of-the-dwarves:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-men:sight-of-the-dwarves:0:1"
      }
    ]
  },
  "holy-haminges-power-of-men:mastery:3#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-haminges-power-of-men:mastery:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-men:mastery:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-men:mastery:3:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 3,
        "value": 1,
        "optionId": "holy-haminges-power-of-men:mastery:3:2",
        "labelKey": "TRUDVANG.Transformation.OneSkillBonus",
        "skillChoice": true,
        "skillOnly": true,
        "tooltip": true,
        "consumeOnUse": true
      }
    ]
  },
  "holy-haminges-power-of-men:weapon-prowess:5#prouesse": {
    "id": "prouesse",
    "icon": "icons/svg/aura.svg",
    "duration": "4 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.combatMax",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 30
      }
    ],
    "sourceId": "holy-haminges-power-of-men:weapon-prowess:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-men:weapon-prowess:5:0"
      }
    ]
  },
  "holy-haminges-power-of-men:dwarven-smith:6#forge": {
    "id": "forge",
    "icon": "icons/svg/aura.svg",
    "duration": "2 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.CraftSpecialty",
    "inputDiscipline": "handicraft",
    "sourceId": "holy-haminges-power-of-men:dwarven-smith:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-men:dwarven-smith:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-men:dwarven-smith:6:1"
      },
      {
        "index": 0,
        "target": "note",
        "base": 6,
        "value": 0,
        "tooltip": true,
        "skillChoice": true,
        "skillOnly": true,
        "restrictedSkill": "care",
        "restrictedDiscipline": "handicraft",
        "requiresInput": true,
        "labelKey": "TRUDVANG.Transformation.CraftSpecialtyBonus",
        "optionId": "holy-haminges-power-of-men:dwarven-smith:6:0",
        "automatic": true
      }
    ]
  },
  "holy-haminges-power-of-men:legendary:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-haminges-power-of-men:legendary:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-men:legendary:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-men:legendary:7:1"
      }
    ]
  },
  "holy-haminges-power-of-trolls:willpower:1#volonte": {
    "id": "volonte",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.fearFactor",
        "type": "add",
        "value": "-4",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-haminges-power-of-trolls:willpower:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-trolls:willpower:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-trolls:willpower:1:1"
      }
    ]
  },
  "holy-haminges-power-of-trolls:illusion-tricks:2#illusions": {
    "id": "illusions",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "summaryParts": {
      "labelKey": "TRUDVANG.Transformation.IllusionRange",
      "parts": [
        {
          "index": 2,
          "base": 5,
          "value": 5,
          "singularKey": "TRUDVANG.Transformation.DistanceMeterOne",
          "pluralKey": "TRUDVANG.Transformation.DistanceMeterMany"
        }
      ]
    },
    "sourceId": "holy-haminges-power-of-trolls:illusion-tricks:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-trolls:illusion-tricks:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-trolls:illusion-tricks:2:1"
      },
      {
        "index": 2,
        "target": "summaryPart",
        "value": 1,
        "optionId": "holy-haminges-power-of-trolls:illusion-tricks:2:2"
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:troll-strength:1#force-du-troll": {
    "id": "force-du-troll",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":4}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-haminges-power-of-the-thurses:troll-strength:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-thurses:troll-strength:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-thurses:troll-strength:1:1"
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0:0"
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3#force-du-stenhinje": {
    "id": "force-du-stenhinje",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-thurses:strength-of-the-stone-hinji:3:1"
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2#fureur-de-l-ogre-des-montagnes": {
    "id": "fureur-de-l-ogre-des-montagnes",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2:1"
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-fury:2:0"
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
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4:1"
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4:0"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.rolls.attack",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:mountain-ogre-s-madness:4:3"
      }
    ]
  },
  "holy-haminges-power-of-the-thurses:thurse-strength:7#force-du-tursir": {
    "id": "force-du-tursir",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "changes": [
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":8}]",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-haminges-power-of-the-thurses:thurse-strength:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-thurses:thurse-strength:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-thurses:thurse-strength:7:1"
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
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "10",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 40
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10 (JO 10)",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6",
    "parameters": [
      {
        "index": 1,
        "target": "temporaryHP",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6:1"
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6:2"
      },
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6:0"
      },
      {
        "index": 3,
        "target": "modifier",
        "key": "system.modifiers.rolls.attack",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-thurses:the-destroyer-s-rage:6:3"
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1#ravage-du-huvfurwurm": {
    "id": "ravage-du-huvfurwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.extraWeaponAction",
        "type": "override",
        "value": "{\"combatPoints\":5,\"actions\":1}",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-dragon:rampage-of-the-huvfurwurm:1:0"
      }
    ]
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
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.immunities",
        "type": "override",
        "value": "[\"flammes non magiques\"]",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-dragon:flame-hardened:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-dragon:flame-hardened:2:0"
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-dragon:flame-hardened:2:1"
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
    "related": [],
    "priority": 20,
    "sourceId": "holy-haminges-power-of-the-dragon:paralyzing-gaze:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-dragon:paralyzing-gaze:3:0"
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5#attaque-du-huvfurwurm": {
    "id": "attaque-du-huvfurwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "3 tours de jeu",
    "changes": [
      {
        "key": "system.transformation.extraWeaponAction",
        "type": "override",
        "value": "{\"combatPoints\":10,\"actions\":2}",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5:0"
      }
    ]
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
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.immunities",
        "type": "override",
        "value": "[\"flammes non magiques\"]",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-haminges-power-of-the-dragon:dragon-skin:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-dragon:dragon-skin:4:0"
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-dragon:dragon-skin:4:1"
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-dragon:dragon-skin:4:2"
      }
    ]
  },
  "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6#tete-du-huvfurwurm": {
    "id": "tete-du-huvfurwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "changes": [],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800,
        "optionId": "holy-haminges-power-of-the-dragon:head-of-the-huvfurwurm:6:1"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damage",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.immunities",
        "type": "override",
        "value": "[\"flammes non magiques\",\"flammes magiques\"]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-dragon:dragon-soul:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-dragon:dragon-soul:7:0"
      },
      {
        "index": 1,
        "target": "protection",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-dragon:dragon-soul:7:1"
      },
      {
        "index": 2,
        "target": "damage",
        "value": 1,
        "usages": [
          "melee",
          "throwing",
          "natural"
        ],
        "optionId": "holy-haminges-power-of-the-dragon:dragon-soul:7:2"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "20",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "4",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-haminges-power-of-the-dragon:giant-snakeshape:8#aspect-du-serpent-geant.Attack0\",\"damage\":\"2d10\",\"openRoll\":9,\"maxActions\":0},{\"name\":\"TRUDVANG.Content.Transformation.holy-haminges-power-of-the-dragon:giant-snakeshape:8#aspect-du-serpent-geant.Attack1\",\"damage\":\"2d10\",\"openRoll\":0,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"replace\",\"value\":6}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d5",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.powerIds",
        "type": "override",
        "value": "[\"holy-haminges-power-of-the-dragon:constriction:0\",\"holy-haminges-power-of-the-dragon:paralyzing-gaze:3\"]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8:1"
      },
      {
        "index": 2,
        "target": "protection",
        "value": 1,
        "optionId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8:2"
      },
      {
        "index": 4,
        "target": "temporaryHP",
        "value": 10,
        "optionId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8:4"
      },
      {
        "index": 3,
        "target": "fearFactor",
        "value": "1d10",
        "optionId": "holy-haminges-power-of-the-dragon:giant-snakeshape:8:3"
      }
    ]
  },
  "holy-thuuldom-hammer-fists:hammer-fists:0#poings-d-acier": {
    "id": "poings-d-acier",
    "icon": "icons/svg/aura.svg",
    "duration": "permanente tant que les deux runes sont portées et alimentées en points de divinité",
    "changes": [
      {
        "key": "system.transformation.unarmedDamage",
        "type": "override",
        "value": "[{\"damage\":\"1d6\",\"openRoll\":0},{\"damage\":\"1d6 + 2\",\"openRoll\":0},{\"damage\":\"1d10 + 2\",\"openRoll\":0},{\"damage\":\"1d10 + 2\",\"openRoll\":10},{\"damage\":\"1d10 + 2\",\"openRoll\":9}]",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-thuuldom-hammer-fists:hammer-fists:0",
    "parameters": []
  },
  "holy-toikalokke-lynx-power:tree-walk:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-toikalokke-lynx-power:tree-walk:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:tree-walk:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-lynx-power:tree-walk:1:1"
      }
    ]
  },
  "holy-toikalokke-lynx-power:orientation:0#orientation": {
    "id": "orientation",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-lynx-power:orientation:0",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:orientation:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-lynx-power:orientation:0:2"
      },
      {
        "index": 0,
        "target": "note",
        "base": 0,
        "value": 1,
        "tooltip": true,
        "labelKey": "TRUDVANG.Transformation.AdditionalTerrainCount",
        "optionId": "holy-toikalokke-lynx-power:orientation:0:0"
      }
    ]
  },
  "holy-toikalokke-lynx-power:hearing:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      3
    ],
    "sourceId": "holy-toikalokke-lynx-power:hearing:2",
    "parameters": [
      {
        "index": 2,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-lynx-power:hearing:2:2"
      }
    ]
  },
  "holy-toikalokke-lynx-power:track:6#pistage": {
    "id": "pistage",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "inputKey": "TRUDVANG.Transformation.TrackedCreature",
    "sourceId": "holy-toikalokke-lynx-power:track:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-lynx-power:track:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:track:6:1"
      },
      {
        "index": 2,
        "target": "note",
        "base": 3,
        "value": 1,
        "tooltip": true,
        "skillChoice": true,
        "restrictedSkill": "wilderness",
        "ability": "tracker",
        "labelKey": "TRUDVANG.Transformation.TrackingBonus",
        "optionId": "holy-toikalokke-lynx-power:track:6:2"
      }
    ]
  },
  "holy-toikalokke-lynx-power:aim:5#visee": {
    "id": "visee",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.rangedAttack",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 30
      }
    ],
    "sourceId": "holy-toikalokke-lynx-power:aim:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 10,
        "optionId": "holy-toikalokke-lynx-power:aim:5:0"
      },
      {
        "index": 1,
        "target": "modifier",
        "key": "system.modifiers.rolls.rangedAttack",
        "value": 1,
        "optionId": "holy-toikalokke-lynx-power:aim:5:1"
      },
      {
        "index": 1,
        "target": "note",
        "base": 1,
        "value": 1,
        "tooltip": true,
        "skillOnly": true,
        "labelKey": "TRUDVANG.Transformation.AimBonus",
        "optionId": "holy-toikalokke-lynx-power:aim:5:1"
      }
    ]
  },
  "holy-toikalokke-lynx-power:concealment:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-lynx-power:concealment:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:concealment:7:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": -5,
        "value": -1,
        "labelKey": "TRUDVANG.Transformation.ConcealStill",
        "tooltip": true,
        "skillOnly": true,
        "optionId": "holy-toikalokke-lynx-power:concealment:7:1"
      },
      {
        "index": 1,
        "target": "note",
        "base": -1,
        "value": -1,
        "labelKey": "TRUDVANG.Transformation.ConcealMoving",
        "tooltip": false,
        "skillOnly": true,
        "optionId": "holy-toikalokke-lynx-power:concealment:7:1"
      }
    ]
  },
  "holy-toikalokke-lynx-power:forest-path:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-toikalokke-lynx-power:forest-path:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:forest-path:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-lynx-power:forest-path:8:2"
      }
    ]
  },
  "holy-toikalokke-lynx-power:pathfinder:9#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 heures",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-toikalokke-lynx-power:pathfinder:9",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-lynx-power:pathfinder:9:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-lynx-power:pathfinder:9:2"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-friend:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "30 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "levelParameter": {
      "labelKey": "TRUDVANG.Transformation.TabletLevel",
      "default": 1,
      "note": true
    },
    "sourceId": "holy-toikalokke-animal-mind:animal-friend:0",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-friend:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 28800,
        "optionId": "holy-toikalokke-animal-mind:animal-friend:0:2"
      },
      {
        "index": 0,
        "target": "note",
        "base": 0,
        "value": 0,
        "perLevel": 1,
        "tooltip": true,
        "skillChoice": true,
        "automatic": true,
        "ability": "horsemanship",
        "restrictedSkill": "agility",
        "restrictedDiscipline": "horsemanship",
        "labelKey": "TRUDVANG.Transformation.AnimalFriendRiding",
        "optionId": "holy-toikalokke-animal-mind:animal-friend:0:0"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-tracks:1#traces": {
    "id": "traces",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-tracks:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-tracks:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-tracks:1:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 43200,
        "optionId": "holy-toikalokke-animal-mind:animal-tracks:1:2"
      }
    ]
  },
  "holy-toikalokke-animal-mind:invisible-to-animals:3#animaux": {
    "id": "animaux",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-animal-mind:invisible-to-animals:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:invisible-to-animals:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:invisible-to-animals:3:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:talk-to-animals:2#parler": {
    "id": "parler",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-animal-mind:talk-to-animals:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:talk-to-animals:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:talk-to-animals:2:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 43200,
        "optionId": "holy-toikalokke-animal-mind:talk-to-animals:2:2"
      }
    ]
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
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "false",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-ours.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-renard": {
    "id": "esprit-de-la-bete-renard",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "false",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"intelligence\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":1.5}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"thievery\":3}",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-lievre": {
    "id": "esprit-de-la-bete-lievre",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "false",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":1.5}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"shadowing\":3}",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau": {
    "id": "esprit-de-la-bete-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "false",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau.Sense0\",\"range\":null,\"enabled\":true},{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau.Sense1\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-cerf": {
    "id": "esprit-de-la-bete-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "10 minutes",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "false",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"constitution\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":1.5}]",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-cerf.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-toikalokke-animal-mind:animal-spirit:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-animal-mind:animal-spirit:4:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-master:5#apprivoise": {
    "id": "apprivoise",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-animal-mind:animal-master:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-master:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 14400,
        "optionId": "holy-toikalokke-animal-mind:animal-master:5:1"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-ours.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"highest\",\"value\":4},{\"trait\":\"constitution\",\"method\":\"highest\",\"value\":4},{\"trait\":\"dexterity\",\"method\":\"replace\",\"value\":-2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-ours.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-renard": {
    "id": "aspect-animal-renard",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-renard.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"intelligence\",\"method\":\"highest\",\"value\":4},{\"trait\":\"strength\",\"method\":\"replace\",\"value\":-2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"shadowing\":3,\"thievery\":3}",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.defense",
        "type": "override",
        "value": "-2",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-lievre": {
    "id": "aspect-animal-lievre",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-lievre.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"highest\",\"value\":4},{\"trait\":\"strength\",\"method\":\"replace\",\"value\":-2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.defense",
        "type": "override",
        "value": "-3",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau": {
    "id": "aspect-animal-corbeau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau.Sense0\",\"range\":null,\"enabled\":true},{\"type\":\"other\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau.Sense1\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"dexterity\",\"method\":\"highest\",\"value\":4},{\"trait\":\"constitution\",\"method\":\"replace\",\"value\":-4}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":0.5},{\"mode\":\"flight\",\"method\":\"baseMultiple\",\"value\":4}]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:1"
      }
    ]
  },
  "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf": {
    "id": "aspect-animal-cerf",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"highest\",\"value\":1},{\"trait\":\"constitution\",\"method\":\"highest\",\"value\":4}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"multiply\",\"value\":2}]",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf.Attack0\",\"damage\":\"1d10\",\"openRoll\":10,\"maxActions\":0}]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-toikalokke-animal-mind:animal-shape:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-animal-mind:animal-shape:6:1"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:control-fire:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-master-of-elements:control-fire:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 50,
        "optionId": "holy-toikalokke-master-of-elements:control-fire:1:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-master-of-elements:control-fire:1:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:control-fire:1:2"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:gift-of-water:3#don-de-l-eau": {
    "id": "don-de-l-eau",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"swimming\":2}",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "levelParameter": {
      "labelKey": "TRUDVANG.Transformation.PowerLevel",
      "default": 1,
      "knowledge": [
        "swimming"
      ]
    },
    "sourceId": "holy-toikalokke-master-of-elements:gift-of-water:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:gift-of-water:3:0"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:earth-wall:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "30 minutes",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-toikalokke-master-of-elements:earth-wall:0",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 1800,
        "optionId": "holy-toikalokke-master-of-elements:earth-wall:0:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 10800,
        "optionId": "holy-toikalokke-master-of-elements:earth-wall:0:2"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:fire-tamer:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 tour de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2,
      3
    ],
    "sourceId": "holy-toikalokke-master-of-elements:fire-tamer:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 15,
        "optionId": "holy-toikalokke-master-of-elements:fire-tamer:4:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 50,
        "optionId": "holy-toikalokke-master-of-elements:fire-tamer:4:1"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:shape-earth:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-toikalokke-master-of-elements:shape-earth:5",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:shape-earth:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 18000,
        "optionId": "holy-toikalokke-master-of-elements:shape-earth:5:2"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:spring-of-water:8#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-toikalokke-master-of-elements:spring-of-water:8",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:spring-of-water:8:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 14400,
        "optionId": "holy-toikalokke-master-of-elements:spring-of-water:8:2"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:control-wind:9#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 heures",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1,
      2,
      3
    ],
    "sourceId": "holy-toikalokke-master-of-elements:control-wind:9",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:control-wind:9:0"
      }
    ]
  },
  "holy-toikalokke-master-of-elements:fire-resistant:11#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 tours de jeu",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-toikalokke-master-of-elements:fire-resistant:11",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-toikalokke-master-of-elements:fire-resistant:11:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "holy-toikalokke-master-of-elements:fire-resistant:11:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-toikalokke-master-of-elements:fire-resistant:11:2"
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:simmering-blood:1#simmering-blood": {
    "id": "simmering-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "1d10",
        "phase": "initial",
        "priority": 10
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 10,
    "sourceId": "holy-joaringfaith-fury-of-ogon:simmering-blood:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-fury-of-ogon:simmering-blood:1:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-joaringfaith-fury-of-ogon:simmering-blood:1:1"
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
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "2",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.heightBonus",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 20
      },
      {
        "key": "system.transformation.weightBonus",
        "type": "override",
        "value": "30",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 20,
    "sourceId": "holy-joaringfaith-fury-of-ogon:rage:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-joaringfaith-fury-of-ogon:rage:2:0"
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:rage:2#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-joaringfaith-fury-of-ogon:rage:2",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:boiling-blood:3#boiling-blood": {
    "id": "boiling-blood",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "2d10",
        "phase": "initial",
        "priority": 20
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 20,
    "sourceId": "holy-joaringfaith-fury-of-ogon:boiling-blood:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-fury-of-ogon:boiling-blood:3:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-joaringfaith-fury-of-ogon:boiling-blood:3:1"
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
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "10",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "4",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10 (JO 10)",
        "phase": "initial",
        "priority": 30
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "1.5",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 30,
    "sourceId": "holy-joaringfaith-fury-of-ogon:madness:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-joaringfaith-fury-of-ogon:madness:4:0"
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:madness:4#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 30
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 30,
    "sourceId": "holy-joaringfaith-fury-of-ogon:madness:4",
    "parameters": []
  },
  "holy-joaringfaith-fury-of-ogon:bloodfire:6#bloodfire": {
    "id": "bloodfire",
    "icon": "icons/svg/blood.svg",
    "duration": "1 heure",
    "changes": [
      {
        "key": "system.transformation.vitality",
        "type": "override",
        "value": "3d10",
        "phase": "initial",
        "priority": 40
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 40,
    "sourceId": "holy-joaringfaith-fury-of-ogon:bloodfire:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-fury-of-ogon:bloodfire:6:0"
      },
      {
        "index": 1,
        "target": "vitality",
        "value": 1,
        "optionId": "holy-joaringfaith-fury-of-ogon:bloodfire:6:1"
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.resources.body.temporaryMax",
        "type": "add",
        "value": "15",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.melee",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.throwing",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.modifiers.damageByUsage.natural",
        "type": "add",
        "value": "6",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.noParry",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.noDodge",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.ignoreFear",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.fearFactor",
        "type": "override",
        "value": "1d10 (JO 9-10)",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.size",
        "type": "override",
        "value": "2",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.ignoreWounds",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [
      "frenzy-exhaustion"
    ],
    "priority": 50,
    "sourceId": "holy-joaringfaith-fury-of-ogon:riastarthae:8",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-joaringfaith-fury-of-ogon:riastarthae:8:0"
      }
    ]
  },
  "holy-joaringfaith-fury-of-ogon:riastarthae:8#frenzy-exhaustion": {
    "id": "frenzy-exhaustion",
    "icon": "icons/svg/sleep.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.durationFromElapsed",
        "type": "override",
        "value": "0.5",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-joaringfaith-fury-of-ogon:riastarthae:8",
    "parameters": []
  },
  "holy-joaringfaith-power-of-sille:healing:0#guerison": {
    "id": "guerison",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 10
      }
    ],
    "sourceId": "holy-joaringfaith-power-of-sille:healing:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-power-of-sille:healing:0:0"
      },
      {
        "index": 1,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 1,
        "optionId": "holy-joaringfaith-power-of-sille:healing:0:1"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:sunray:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-joaringfaith-power-of-sille:sunray:1",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-power-of-sille:sunray:1:0"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:summer-place:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "3 heures",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-joaringfaith-power-of-sille:summer-place:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-power-of-sille:summer-place:2:0"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:healing-glow:3#lumiere-guerisseuse": {
    "id": "lumiere-guerisseuse",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 1
    },
    "sourceId": "holy-joaringfaith-power-of-sille:healing-glow:3",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 1,
        "optionId": "holy-joaringfaith-power-of-sille:healing-glow:3:0"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:healing-warmth:4#chaleur-guerisseuse": {
    "id": "chaleur-guerisseuse",
    "icon": "icons/svg/aura.svg",
    "duration": "2 jours",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "3",
        "phase": "initial",
        "priority": 30
      }
    ],
    "sourceId": "holy-joaringfaith-power-of-sille:healing-warmth:4",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-power-of-sille:healing-warmth:4:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 3,
        "value": 1,
        "labelKey": "TRUDVANG.Transformation.HealingDiseaseNote",
        "optionId": "holy-joaringfaith-power-of-sille:healing-warmth:4:1"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 2,
        "optionId": "holy-joaringfaith-power-of-sille:healing-warmth:4:2"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:firon-power:5#pouvoir-de-firon": {
    "id": "pouvoir-de-firon",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 5
    },
    "sourceId": "holy-joaringfaith-power-of-sille:firon-power:5",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 2,
        "optionId": "holy-joaringfaith-power-of-sille:firon-power:5:0"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:time-of-the-hunt:6#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 jour",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      1
    ],
    "sourceId": "holy-joaringfaith-power-of-sille:time-of-the-hunt:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-power-of-sille:time-of-the-hunt:6:0"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:breath-of-sille:7#souffle": {
    "id": "souffle",
    "icon": "icons/svg/aura.svg",
    "duration": "3 jours",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.recovery",
        "type": "add",
        "value": "5",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "holy-joaringfaith-power-of-sille:breath-of-sille:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-power-of-sille:breath-of-sille:7:0"
      },
      {
        "index": 1,
        "target": "note",
        "base": 10,
        "value": 1,
        "labelKey": "TRUDVANG.Transformation.HealingPoisonCurseNote",
        "optionId": "holy-joaringfaith-power-of-sille:breath-of-sille:7:1"
      },
      {
        "index": 2,
        "target": "modifier",
        "key": "system.modifiers.recovery",
        "value": 3,
        "optionId": "holy-joaringfaith-power-of-sille:breath-of-sille:7:2"
      }
    ]
  },
  "holy-joaringfaith-power-of-sille:healing-sun:8#soleil-guerisseur": {
    "id": "soleil-guerisseur",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "instant": {
      "operation": "heal",
      "base": 10
    },
    "sourceId": "holy-joaringfaith-power-of-sille:healing-sun:8",
    "parameters": [
      {
        "index": 0,
        "target": "instant",
        "value": 3,
        "optionId": "holy-joaringfaith-power-of-sille:healing-sun:8:0"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:tracking:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      2
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:tracking:0",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:tracking:0:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 43200,
        "optionId": "holy-joaringfaith-sight-of-lekaba:tracking:0:1"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:scanning:1#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "9 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:scanning:1",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 15,
        "optionId": "holy-joaringfaith-sight-of-lekaba:scanning:1:1"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:far-sight:2#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "2 tours de jeu",
    "priority": 20,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.rangedAttack",
        "type": "add",
        "value": "1",
        "phase": "initial",
        "priority": 20
      }
    ],
    "displayPowerOptions": [
      2,
      3,
      4,
      5
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:far-sight:2",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 5,
        "optionId": "holy-joaringfaith-sight-of-lekaba:far-sight:2:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 60,
        "optionId": "holy-joaringfaith-sight-of-lekaba:far-sight:2:1"
      },
      {
        "index": 7,
        "target": "modifier",
        "key": "system.modifiers.rolls.rangedAttack",
        "value": 1,
        "optionId": "holy-joaringfaith-sight-of-lekaba:far-sight:2:7"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:espionage:3#espionage": {
    "id": "espionage",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:espionage:3",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:espionage:3:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-sight-of-lekaba:espionage:3:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "holy-joaringfaith-sight-of-lekaba:espionage:3:2"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:seeing:4#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 heure",
    "priority": 30,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:seeing:4",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:seeing:4:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-sight-of-lekaba:seeing:4:2"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:astral-voyage:6#astral-voyage": {
    "id": "astral-voyage",
    "icon": "icons/svg/aura.svg",
    "duration": "5 minutes",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:astral-voyage:6",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-joaringfaith-sight-of-lekaba:astral-voyage:6:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:astral-voyage:6:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-sight-of-lekaba:astral-voyage:6:2"
      }
    ]
  },
  "holy-joaringfaith-sight-of-lekaba:true-sight:7#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "1 minute",
    "priority": 50,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      3,
      4,
      5,
      6
    ],
    "sourceId": "holy-joaringfaith-sight-of-lekaba:true-sight:7",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 60,
        "optionId": "holy-joaringfaith-sight-of-lekaba:true-sight:7:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:true-sight:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 3600,
        "optionId": "holy-joaringfaith-sight-of-lekaba:true-sight:7:2"
      }
    ]
  },
  "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "5 tours de jeu",
    "priority": 10,
    "statuses": [],
    "related": [],
    "changes": [],
    "displayPowerOptions": [
      0,
      1,
      2,
      3
    ],
    "sourceId": "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0",
    "parameters": []
  },
  "holy-joaringfaith-curses-of-sonntag:curse-creature:5#effect": {
    "id": "effect",
    "icon": "icons/svg/aura.svg",
    "duration": "10 jours",
    "priority": 40,
    "statuses": [],
    "related": [],
    "changes": [
      {
        "key": "system.modifiers.rolls.allActions",
        "type": "add",
        "value": "-1",
        "phase": "initial",
        "priority": 40
      }
    ],
    "sourceId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5",
    "parameters": [
      {
        "index": 0,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5:0"
      },
      {
        "index": 1,
        "target": "duration",
        "value": 604800,
        "optionId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 2592000,
        "optionId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 31536000,
        "optionId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5:3"
      },
      {
        "index": 4,
        "target": "modifier",
        "key": "system.modifiers.rolls.allActions",
        "value": -1,
        "optionId": "holy-joaringfaith-curses-of-sonntag:curse-creature:5:4"
      }
    ]
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
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [
      "restrain"
    ],
    "related": [
      "tree-recovery"
    ],
    "priority": 50,
    "sourceId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7",
    "parameters": [
      {
        "index": 1,
        "target": "duration",
        "value": 86400,
        "optionId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7:1"
      },
      {
        "index": 2,
        "target": "duration",
        "value": 604800,
        "optionId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7:2"
      },
      {
        "index": 3,
        "target": "duration",
        "value": 2592000,
        "optionId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7:3"
      },
      {
        "index": 4,
        "target": "duration",
        "value": 31536000,
        "optionId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7:4"
      }
    ]
  },
  "holy-joaringfaith-curses-of-sonntag:tree-curse:7#tree-recovery": {
    "id": "tree-recovery",
    "icon": "icons/svg/downgrade.svg",
    "duration": "3 days",
    "changes": [
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"agility\":0.5,\"movement\":0.5}",
        "phase": "initial",
        "priority": 50
      },
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial",
        "priority": 50
      }
    ],
    "statuses": [],
    "related": [],
    "priority": 50,
    "sourceId": "holy-joaringfaith-curses-of-sonntag:tree-curse:7",
    "parameters": []
  },
  "MLPIuC5A6B7C8D9E#changement-de-corps-logewurm": {
    "id": "changement-de-corps-logewurm",
    "icon": "icons/svg/aura.svg",
    "duration": "illimitée",
    "changes": [
      {
        "key": "system.transformation.chooseBestiary",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "physical",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
    "related": [],
    "sourceId": "MKMhM5z5A6B7C8D9",
    "parameters": []
  },
  "oRxJE6A6B7C8D9Ea#c-ur-regenerant-lindwurm": {
    "id": "c-ur-regenerant-lindwurm",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.chooseBestiary",
        "type": "override",
        "value": "false",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "animal",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "false",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formName",
        "type": "override",
        "value": "Lindwurm",
        "phase": "initial"
      }
    ],
    "statuses": [
      "sleep"
    ],
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
    "changes": [
      {
        "key": "system.transformation.formName",
        "type": "override",
        "value": "Lindwurm",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "animal",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "related": [],
    "sourceId": "oRxJE6A6B7C8D9Ea",
    "parameters": []
  },
  "flAdvMhNiOjPkQlR#corps-de-fumee": {
    "id": "corps-de-fumee",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"land\",\"method\":\"replace\",\"value\":30}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "related": [],
    "sourceId": "flAdvMhNiOjPkQlR",
    "parameters": []
  },
  "it3GE4w2x3y4z5A6#frenesie-hrimtroll": {
    "id": "frenesie-hrimtroll",
    "icon": "icons/svg/aura.svg",
    "duration": "1d6 tours de jeu",
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
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"dark\",\"label\":\"TRUDVANG.Content.Transformation.NcOgKSkQlRmSnToU#infection-des-rugtannes.Sense0\",\"range\":60,\"enabled\":true}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"constitution\",\"method\":\"degrees\",\"value\":2,\"overflow\":4},{\"trait\":\"psyche\",\"method\":\"degrees\",\"value\":2,\"overflow\":4},{\"trait\":\"strength\",\"method\":\"degrees\",\"value\":2,\"overflow\":4},{\"trait\":\"dexterity\",\"method\":\"degrees\",\"value\":2,\"overflow\":4}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.recalculateHP",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"dexterity\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"constitution\",\"method\":\"add\",\"value\":6,\"max\":8},{\"trait\":\"psyche\",\"method\":\"add\",\"value\":-2},{\"trait\":\"intelligence\",\"method\":\"add\",\"value\":-4,\"min\":-6}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.WKMBG3v1w2x3y4z5#warg-garou.Attack0\",\"damage\":\"1d10\",\"openRoll\":8,\"maxActions\":1},{\"name\":\"TRUDVANG.Content.Transformation.WKMBG3v1w2x3y4z5#warg-garou.Attack1\",\"damage\":\"1d10\",\"openRoll\":9,\"maxActions\":2}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.WKMBG3v1w2x3y4z5#warg-garou.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"brawling\":2,\"huntingFishing\":6,\"jumpingClimbingBalancing\":6,\"tracker\":6}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"dexterity\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"constitution\",\"method\":\"add\",\"value\":6,\"max\":8},{\"trait\":\"psyche\",\"method\":\"add\",\"value\":-2},{\"trait\":\"intelligence\",\"method\":\"add\",\"value\":-4,\"min\":-6}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.gXp2SRjPkQlRmSnT#warg-garou.Attack0\",\"damage\":\"1d10\",\"openRoll\":8,\"maxActions\":1},{\"name\":\"TRUDVANG.Content.Transformation.gXp2SRjPkQlRmSnT#warg-garou.Attack1\",\"damage\":\"1d10\",\"openRoll\":9,\"maxActions\":2}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.gXp2SRjPkQlRmSnT#warg-garou.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"brawling\":2,\"huntingFishing\":6,\"jumpingClimbingBalancing\":6,\"tracker\":6}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
      },
      {
        "key": "system.transformation.traits",
        "type": "override",
        "value": "[{\"trait\":\"strength\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"dexterity\",\"method\":\"add\",\"value\":4,\"max\":6},{\"trait\":\"constitution\",\"method\":\"add\",\"value\":6,\"max\":8},{\"trait\":\"psyche\",\"method\":\"add\",\"value\":-2},{\"trait\":\"intelligence\",\"method\":\"add\",\"value\":-4,\"min\":-6}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.attacks",
        "type": "override",
        "value": "[{\"name\":\"TRUDVANG.Content.Transformation.i4Zci8A6B7C8D9Ea#warg-garou.Attack0\",\"damage\":\"1d10\",\"openRoll\":8,\"maxActions\":1},{\"name\":\"TRUDVANG.Content.Transformation.i4Zci8A6B7C8D9Ea#warg-garou.Attack1\",\"damage\":\"1d10\",\"openRoll\":9,\"maxActions\":2}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.senses",
        "type": "override",
        "value": "[{\"type\":\"night\",\"label\":\"TRUDVANG.Content.Transformation.i4Zci8A6B7C8D9Ea#warg-garou.Sense0\",\"range\":null,\"enabled\":true}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.knowledge",
        "type": "override",
        "value": "{\"brawling\":2,\"huntingFishing\":6,\"jumpingClimbingBalancing\":6,\"tracker\":6}",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "related": [],
    "sourceId": "i4Zci8A6B7C8D9Ea",
    "parameters": []
  },
  "pjY95vXsYtZu0v1w#metamorphose-draugr": {
    "id": "metamorphose-draugr",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.chooseBestiary",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "animal",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "false",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "100",
        "phase": "initial"
      },
      {
        "key": "system.transformation.naturalArmor",
        "type": "override",
        "value": "0",
        "phase": "initial"
      }
    ],
    "statuses": [
      "paralysis"
    ],
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
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.statueIntegrity",
        "type": "override",
        "value": "200",
        "phase": "initial"
      },
      {
        "key": "system.transformation.naturalArmor",
        "type": "override",
        "value": "0",
        "phase": "initial"
      }
    ],
    "statuses": [
      "paralysis"
    ],
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
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.5}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.5}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
    "changes": [
      {
        "key": "system.transformation.movement",
        "type": "override",
        "value": "[{\"mode\":\"all\",\"method\":\"multiply\",\"value\":0.6666666666666666}]",
        "phase": "initial"
      },
      {
        "key": "system.transformation.testFactor",
        "type": "override",
        "value": "{\"dexterity\":0.6666666666666666}",
        "phase": "initial"
      }
    ],
    "statuses": [],
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
    "related": [],
    "sourceId": "2hwy57A6B7C8D9Ea",
    "parameters": []
  },
  "NNBuQnQlRmSnToUp#transformation-corporelle": {
    "id": "transformation-corporelle",
    "icon": "icons/svg/aura.svg",
    "duration": "",
    "changes": [
      {
        "key": "system.transformation.chooseBestiary",
        "type": "override",
        "value": "true",
        "phase": "initial"
      },
      {
        "key": "system.transformation.formPolicy",
        "type": "override",
        "value": "animal",
        "phase": "initial"
      },
      {
        "key": "system.transformation.preserveHP",
        "type": "override",
        "value": "false",
        "phase": "initial"
      },
      {
        "key": "system.transformation.suspendEquipment",
        "type": "override",
        "value": "true",
        "phase": "initial"
      }
    ],
    "statuses": [],
    "related": [],
    "sourceId": "NNBuQnQlRmSnToUp",
    "parameters": []
  }
};
export const TRANSFORMATIONS_BY_SOURCE = {
  "vitner-vitner-craft:vitner-pouch:1": [
    "vitner-vitner-craft:vitner-pouch:1#effect"
  ],
  "vitner-vitner-craft:enchant-being:4": [
    "vitner-vitner-craft:enchant-being:4#effect"
  ],
  "vitner-vitner-craft:wall-of-vitner:8": [
    "vitner-vitner-craft:wall-of-vitner:8#effect"
  ],
  "vitner-dimvitner:animate-undead:0": [
    "vitner-dimvitner:animate-undead:0#effect"
  ],
  "vitner-dimvitner:speak-to-undead:3": [
    "vitner-dimvitner:speak-to-undead:3#effect"
  ],
  "vitner-dimvitner:vitner-theft:5": [
    "vitner-dimvitner:vitner-theft:5#effect"
  ],
  "vitner-dimvitner:control-undead:7": [
    "vitner-dimvitner:control-undead:7#effect"
  ],
  "vitner-soil-craft:shape-soil:1": [
    "vitner-soil-craft:shape-soil:1#effect"
  ],
  "vitner-soil-craft:quagmire:3": [
    "vitner-soil-craft:quagmire:3#effect"
  ],
  "vitner-soil-craft:soil-walk:5": [
    "vitner-soil-craft:soil-walk:5#soil-walk"
  ],
  "vitner-soil-craft:shape-stone:6": [
    "vitner-soil-craft:shape-stone:6#effect"
  ],
  "vitner-soil-craft:stone-walk:7": [
    "vitner-soil-craft:stone-walk:7#stone-walk"
  ],
  "vitner-soil-craft:petrify-remove-petrification:8": [
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-annuler-une-petrification",
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-half",
    "vitner-soil-craft:petrify-remove-petrification:8#petrification-recovery-two-thirds"
  ],
  "vitner-water-craft:find-water:0": [
    "vitner-water-craft:find-water:0#find-water"
  ],
  "vitner-water-craft:breathe:2": [
    "vitner-water-craft:breathe:2#respiration"
  ],
  "vitner-water-craft:create-water:4": [
    "vitner-water-craft:create-water:4#effect"
  ],
  "vitner-water-craft:solid-water:5": [
    "vitner-water-craft:solid-water:5#effect"
  ],
  "vitner-water-craft:control-precipitation:6": [
    "vitner-water-craft:control-precipitation:6#effect"
  ],
  "vitner-water-craft:water-walk:7": [
    "vitner-water-craft:water-walk:7#effect"
  ],
  "vitner-flame-craft:heat-water:0": [
    "vitner-flame-craft:heat-water:0#effect"
  ],
  "vitner-flame-craft:spark:1": [
    "vitner-flame-craft:spark:1#effect"
  ],
  "vitner-flame-craft:protection-from-fire:4": [
    "vitner-flame-craft:protection-from-fire:4#effect"
  ],
  "vitner-flame-craft:warmth:6": [
    "vitner-flame-craft:warmth:6#effect"
  ],
  "vitner-flame-craft:flame-control:5": [
    "vitner-flame-craft:flame-control:5#effect"
  ],
  "vitner-wind-craft:purify-air:0": [
    "vitner-wind-craft:purify-air:0#effect"
  ],
  "vitner-wind-craft:fog:2": [
    "vitner-wind-craft:fog:2#effect"
  ],
  "vitner-wind-craft:control-wind:3": [
    "vitner-wind-craft:control-wind:3#effect"
  ],
  "vitner-wind-craft:air-armor:4": [
    "vitner-wind-craft:air-armor:4#air-armor"
  ],
  "vitner-wind-craft:lift:5": [
    "vitner-wind-craft:lift:5#effect"
  ],
  "vitner-wind-craft:wind-catcher:9": [
    "vitner-wind-craft:wind-catcher:9#effect"
  ],
  "vitner-wind-craft:storm:8": [
    "vitner-wind-craft:storm:8#effect"
  ],
  "vitner-perceiving:find-home:0": [
    "vitner-perceiving:find-home:0#find-home"
  ],
  "vitner-perceiving:retrace-tracks:1": [
    "vitner-perceiving:retrace-tracks:1#traces"
  ],
  "vitner-perceiving:detect-object:2": [
    "vitner-perceiving:detect-object:2#effect"
  ],
  "vitner-perceiving:orientation:3": [
    "vitner-perceiving:orientation:3#orientation"
  ],
  "vitner-perceiving:detect-being:4": [
    "vitner-perceiving:detect-being:4#effect"
  ],
  "vitner-perceiving:detect-undead:5": [
    "vitner-perceiving:detect-undead:5#effect"
  ],
  "vitner-perceiving:surrounding:6": [
    "vitner-perceiving:surrounding:6#surrounding"
  ],
  "vitner-perceiving:map:7": [
    "vitner-perceiving:map:7#map"
  ],
  "vitner-power-of-thought:understanding-script:0": [
    "vitner-power-of-thought:understanding-script:0#ecrits"
  ],
  "vitner-power-of-thought:understanding-speech:1": [
    "vitner-power-of-thought:understanding-speech:1#oral"
  ],
  "vitner-power-of-thought:courage:2": [
    "vitner-power-of-thought:courage:2#courage"
  ],
  "vitner-power-of-thought:telepathy:4": [
    "vitner-power-of-thought:telepathy:4#lien"
  ],
  "vitner-power-of-thought:ecstasy:5": [
    "vitner-power-of-thought:ecstasy:5#effect"
  ],
  "vitner-power-of-thought:imagining:6": [
    "vitner-power-of-thought:imagining:6#pensee"
  ],
  "vitner-power-of-thought:memory:7": [
    "vitner-power-of-thought:memory:7#memoire"
  ],
  "vitner-power-of-thought:aura-of-power:9": [
    "vitner-power-of-thought:aura-of-power:9#effect"
  ],
  "vitner-power-of-thought:creature-control:8": [
    "vitner-power-of-thought:creature-control:8#effect"
  ],
  "vitner-power-of-thought:mind-reading:11": [
    "vitner-power-of-thought:mind-reading:11#effect"
  ],
  "vitner-power-of-thought:possess-creature:10": [
    "vitner-power-of-thought:possess-creature:10#effect"
  ],
  "vitner-power-of-vision:tracking:0": [
    "vitner-power-of-vision:tracking:0#effect"
  ],
  "vitner-power-of-vision:scanning:1": [
    "vitner-power-of-vision:scanning:1#effect"
  ],
  "vitner-power-of-vision:far-sight:2": [
    "vitner-power-of-vision:far-sight:2#effect"
  ],
  "vitner-power-of-vision:espionage:4": [
    "vitner-power-of-vision:espionage:4#espionage"
  ],
  "vitner-power-of-vision:seeing:3": [
    "vitner-power-of-vision:seeing:3#effect"
  ],
  "vitner-power-of-vision:astral-voyage:5": [
    "vitner-power-of-vision:astral-voyage:5#astral-voyage"
  ],
  "vitner-power-of-vision:true-sight:7": [
    "vitner-power-of-vision:true-sight:7#effect"
  ],
  "vitner-witchcraft:uprooted-tree:0": [
    "vitner-witchcraft:uprooted-tree:0#effect"
  ],
  "vitner-witchcraft:curse-creature:5": [
    "vitner-witchcraft:curse-creature:5#effect"
  ],
  "vitner-witchcraft:tree-curse:7": [
    "vitner-witchcraft:tree-curse:7#malediction-de-l-arbre",
    "vitner-witchcraft:tree-curse:7#tree-recovery"
  ],
  "vitner-animal-vitner:speak-to-animals:1": [
    "vitner-animal-vitner:speak-to-animals:1#lien"
  ],
  "vitner-animal-vitner:call-on-animals:2": [
    "vitner-animal-vitner:call-on-animals:2#effect"
  ],
  "vitner-animal-vitner:control-animals:4": [
    "vitner-animal-vitner:control-animals:4#effect"
  ],
  "vitner-animal-vitner:mind-of-the-wolf:5": [
    "vitner-animal-vitner:mind-of-the-wolf:5#effect"
  ],
  "vitner-animal-vitner:possess-animals:6": [
    "vitner-animal-vitner:possess-animals:6#effect"
  ],
  "vitner-animal-vitner:send-message:8": [
    "vitner-animal-vitner:send-message:8#effect"
  ],
  "vitner-body-vitner:grip:0": [
    "vitner-body-vitner:grip:0#adherence"
  ],
  "vitner-body-vitner:hearing-deafness:2": [
    "vitner-body-vitner:hearing-deafness:2#ameliore",
    "vitner-body-vitner:hearing-deafness:2#affaibli"
  ],
  "vitner-body-vitner:sense-of-smell:3": [
    "vitner-body-vitner:sense-of-smell:3#ameliore",
    "vitner-body-vitner:sense-of-smell:3#affaibli"
  ],
  "vitner-body-vitner:vision-blindness:4": [
    "vitner-body-vitner:vision-blindness:4#ameliore",
    "vitner-body-vitner:vision-blindness:4#affaibli"
  ],
  "vitner-body-vitner:immobilize:6": [
    "vitner-body-vitner:immobilize:6#effect"
  ],
  "vitner-body-vitner:appearance-change:7": [
    "vitner-body-vitner:appearance-change:7#effect"
  ],
  "vitner-body-vitner:leather-skin:5": [
    "vitner-body-vitner:leather-skin:5#leather-skin"
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
  "vitner-delusion-vitner:increase-sounds:3": [
    "vitner-delusion-vitner:increase-sounds:3#voix",
    "vitner-delusion-vitner:increase-sounds:3#bruits"
  ],
  "vitner-delusion-vitner:phantom-sound:1": [
    "vitner-delusion-vitner:phantom-sound:1#effect"
  ],
  "vitner-delusion-vitner:traceless:4": [
    "vitner-delusion-vitner:traceless:4#trace"
  ],
  "vitner-delusion-vitner:ghost-voice:5": [
    "vitner-delusion-vitner:ghost-voice:5#voix"
  ],
  "vitner-delusion-vitner:camouflage:7": [
    "vitner-delusion-vitner:camouflage:7#effect"
  ],
  "vitner-delusion-vitner:depict:6": [
    "vitner-delusion-vitner:depict:6#effect"
  ],
  "vitner-delusion-vitner:landscape-illusion:8": [
    "vitner-delusion-vitner:landscape-illusion:8#effect"
  ],
  "vitner-delusion-vitner:silence:9": [
    "vitner-delusion-vitner:silence:9#effect"
  ],
  "vitner-delusion-vitner:invisibility:11": [
    "vitner-delusion-vitner:invisibility:11#effect"
  ],
  "vitner-vitner-of-objects:detect-composition:0": [
    "vitner-vitner-of-objects:detect-composition:0#effect"
  ],
  "vitner-vitner-of-objects:waterproof:1": [
    "vitner-vitner-of-objects:waterproof:1#effect"
  ],
  "vitner-vitner-of-objects:bind:2": [
    "vitner-vitner-of-objects:bind:2#effect"
  ],
  "vitner-vitner-of-objects:alarm-object:4": [
    "vitner-vitner-of-objects:alarm-object:4#effect"
  ],
  "vitner-vitner-of-objects:enlarge-reduce-object:6": [
    "vitner-vitner-of-objects:enlarge-reduce-object:6#effect"
  ],
  "vitner-vitner-of-objects:create-object:8": [
    "vitner-vitner-of-objects:create-object:8#effect"
  ],
  "holy-gerbanis-warmth-of-sunvei:healing:0": [
    "holy-gerbanis-warmth-of-sunvei:healing:0#guerison"
  ],
  "holy-gerbanis-warmth-of-sunvei:sunray:1": [
    "holy-gerbanis-warmth-of-sunvei:sunray:1#effect"
  ],
  "holy-gerbanis-warmth-of-sunvei:summer-place:3": [
    "holy-gerbanis-warmth-of-sunvei:summer-place:3#effect"
  ],
  "holy-gerbanis-warmth-of-sunvei:healing-glow:2": [
    "holy-gerbanis-warmth-of-sunvei:healing-glow:2#lumiere-guerisseuse"
  ],
  "holy-gerbanis-warmth-of-sunvei:healing-warmth:5": [
    "holy-gerbanis-warmth-of-sunvei:healing-warmth:5#chaleur-guerisseuse"
  ],
  "holy-gerbanis-warmth-of-sunvei:firon-power:4": [
    "holy-gerbanis-warmth-of-sunvei:firon-power:4#pouvoir-de-firon"
  ],
  "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6": [
    "holy-gerbanis-warmth-of-sunvei:time-of-the-hunt:6#effect"
  ],
  "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7": [
    "holy-gerbanis-warmth-of-sunvei:breath-of-sunvei:7#souffle"
  ],
  "holy-gerbanis-warmth-of-sunvei:healing-sun:8": [
    "holy-gerbanis-warmth-of-sunvei:healing-sun:8#soleil-guerisseur"
  ],
  "holy-gerbanis-strength-of-stormi:voice-of-command:1": [
    "holy-gerbanis-strength-of-stormi:voice-of-command:1#autorite"
  ],
  "holy-gerbanis-strength-of-stormi:troll-strength:0": [
    "holy-gerbanis-strength-of-stormi:troll-strength:0#force-du-troll"
  ],
  "holy-gerbanis-strength-of-stormi:hinji-strength:3": [
    "holy-gerbanis-strength-of-stormi:hinji-strength:3#force-de-hinje"
  ],
  "holy-gerbanis-strength-of-stormi:havar:2": [
    "holy-gerbanis-strength-of-stormi:havar:2#effect"
  ],
  "holy-gerbanis-strength-of-stormi:jarl-s-call:4": [
    "holy-gerbanis-strength-of-stormi:jarl-s-call:4#appel-du-jarl"
  ],
  "holy-gerbanis-strength-of-stormi:shield-disir:5": [
    "holy-gerbanis-strength-of-stormi:shield-disir:5#effect"
  ],
  "holy-gerbanis-strength-of-stormi:jotun-strength:6": [
    "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun",
    "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun-allies"
  ],
  "holy-gerbanis-strength-of-stormi:voice-of-stormi:7": [
    "holy-gerbanis-strength-of-stormi:voice-of-stormi:7#voix-de-storme"
  ],
  "holy-gerbanis-strength-of-stormi:einharjar:8": [
    "holy-gerbanis-strength-of-stormi:einharjar:8#effect"
  ],
  "holy-gerbanis-wrath-of-tyrd:battle-cry:1": [
    "holy-gerbanis-wrath-of-tyrd:battle-cry:1#ally"
  ],
  "holy-gerbanis-wrath-of-tyrd:war-cry:4": [
    "holy-gerbanis-wrath-of-tyrd:war-cry:4#ally",
    "holy-gerbanis-wrath-of-tyrd:war-cry:4#enemy"
  ],
  "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7": [
    "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#ally",
    "holy-gerbanis-wrath-of-tyrd:thunder-of-victory:7#enemy"
  ],
  "holy-gerbanis-influence-of-jorn:wall-of-dusk:1": [
    "holy-gerbanis-influence-of-jorn:wall-of-dusk:1#effect"
  ],
  "holy-gerbanis-influence-of-jorn:falfax:2": [
    "holy-gerbanis-influence-of-jorn:falfax:2#effect"
  ],
  "holy-gerbanis-influence-of-jorn:night-curtain:3": [
    "holy-gerbanis-influence-of-jorn:night-curtain:3#effect"
  ],
  "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4": [
    "holy-gerbanis-influence-of-jorn:the-coat-of-jorn:4#effect"
  ],
  "holy-gerbanis-influence-of-jorn:asiblack:6": [
    "holy-gerbanis-influence-of-jorn:asiblack:6#effect"
  ],
  "holy-gerbanis-influence-of-jorn:snarfari:8": [
    "holy-gerbanis-influence-of-jorn:snarfari:8#effect"
  ],
  "holy-gerbanis-power-of-enken:willpower:1": [
    "holy-gerbanis-power-of-enken:willpower:1#force-d-ame"
  ],
  "holy-gerbanis-power-of-enken:night-vision:0": [
    "holy-gerbanis-power-of-enken:night-vision:0#vision-nocturne"
  ],
  "holy-gerbanis-power-of-enken:bold:2": [
    "holy-gerbanis-power-of-enken:bold:2#temerite"
  ],
  "holy-gerbanis-power-of-enken:soul-sight:4": [
    "holy-gerbanis-power-of-enken:soul-sight:4#effect"
  ],
  "holy-gerbanis-power-of-enken:heart-of-enken:6": [
    "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken",
    "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken-allies"
  ],
  "holy-gerbanis-power-of-enken:eye-of-enken:8": [
    "holy-gerbanis-power-of-enken:eye-of-enken:8#effect"
  ],
  "holy-gerbanis-wisdom-of-windinna:inspiration:0": [
    "holy-gerbanis-wisdom-of-windinna:inspiration:0#effect"
  ],
  "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2": [
    "holy-gerbanis-wisdom-of-windinna:joy-of-creating:2#effect"
  ],
  "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4": [
    "holy-gerbanis-wisdom-of-windinna:wave-of-truth:4#effect"
  ],
  "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7": [
    "holy-gerbanis-wisdom-of-windinna:gaze-of-windinna:7#effect"
  ],
  "holy-gerbanis-wisdom-of-windinna:swine-rush:6": [
    "holy-gerbanis-wisdom-of-windinna:swine-rush:6#effect"
  ],
  "holy-ealdtradition-magh-s-gift:journey-wind:0": [
    "holy-ealdtradition-magh-s-gift:journey-wind:0#effect"
  ],
  "holy-ealdtradition-magh-s-gift:rider-s-melody:1": [
    "holy-ealdtradition-magh-s-gift:rider-s-melody:1#effect"
  ],
  "holy-ealdtradition-magh-s-gift:elf-summer:3": [
    "holy-ealdtradition-magh-s-gift:elf-summer:3#effect"
  ],
  "holy-ealdtradition-magh-s-gift:hero-s-song:4": [
    "holy-ealdtradition-magh-s-gift:hero-s-song:4#effect"
  ],
  "holy-ealdtradition-magh-s-gift:king-s-anthem:6": [
    "holy-ealdtradition-magh-s-gift:king-s-anthem:6#effect"
  ],
  "holy-ealdtradition-magh-s-gift:harvest-year:8": [
    "holy-ealdtradition-magh-s-gift:harvest-year:8#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0": [
    "holy-ealdtradition-gift-of-thanja:behind-tree-and-pine:0#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:animal-speech:1": [
    "holy-ealdtradition-gift-of-thanja:animal-speech:1#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:stagshape:2": [
    "holy-ealdtradition-gift-of-thanja:stagshape:2#aspect-du-cerf"
  ],
  "holy-ealdtradition-gift-of-thanja:bestial-tongue:3": [
    "holy-ealdtradition-gift-of-thanja:bestial-tongue:3#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:salmonshape:4": [
    "holy-ealdtradition-gift-of-thanja:salmonshape:4#aspect-du-saumon"
  ],
  "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5": [
    "holy-ealdtradition-gift-of-thanja:beneath-root-and-rock:5#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:forest-denizen:7": [
    "holy-ealdtradition-gift-of-thanja:forest-denizen:7#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:dragon-tongue:6": [
    "holy-ealdtradition-gift-of-thanja:dragon-tongue:6#effect"
  ],
  "holy-ealdtradition-gift-of-thanja:ravenshape:8": [
    "holy-ealdtradition-gift-of-thanja:ravenshape:8#aspect-du-corbeau"
  ],
  "holy-ealdtradition-heritage-of-majne:strong-beer:0": [
    "holy-ealdtradition-heritage-of-majne:strong-beer:0#effect"
  ],
  "holy-ealdtradition-heritage-of-majne:trollslayer:1": [
    "holy-ealdtradition-heritage-of-majne:trollslayer:1#tueur-trolls"
  ],
  "holy-ealdtradition-heritage-of-majne:king-s-militia:3": [
    "holy-ealdtradition-heritage-of-majne:king-s-militia:3#effect"
  ],
  "holy-ealdtradition-heritage-of-majne:giantslayer:2": [
    "holy-ealdtradition-heritage-of-majne:giantslayer:2#tueur-geants"
  ],
  "holy-ealdtradition-heritage-of-majne:hero-s-brew:4": [
    "holy-ealdtradition-heritage-of-majne:hero-s-brew:4#effect"
  ],
  "holy-ealdtradition-heritage-of-majne:king-s-guard:5": [
    "holy-ealdtradition-heritage-of-majne:king-s-guard:5#effect"
  ],
  "holy-ealdtradition-heritage-of-majne:king-s-ale:7": [
    "holy-ealdtradition-heritage-of-majne:king-s-ale:7#effect"
  ],
  "holy-ealdtradition-heritage-of-majne:dragonslayer:6": [
    "holy-ealdtradition-heritage-of-majne:dragonslayer:6#tueur-dragons"
  ],
  "holy-ealdtradition-heritage-of-majne:the-nine-kings:8": [
    "holy-ealdtradition-heritage-of-majne:the-nine-kings:8#effect"
  ],
  "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0": [
    "holy-ealdtradition-halawen-s-offering:willpower-of-the-ancestors:0#principal"
  ],
  "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3": [
    "holy-ealdtradition-halawen-s-offering:boldness-of-the-ancestors:3#principal"
  ],
  "holy-ealdtradition-halawen-s-offering:fearless:6": [
    "holy-ealdtradition-halawen-s-offering:fearless:6#principal",
    "holy-ealdtradition-halawen-s-offering:fearless:6#allie"
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
  "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2": [
    "holy-ealdtradition-nema-s-usefulness:gloomy-trail:2#effect"
  ],
  "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5": [
    "holy-ealdtradition-nema-s-usefulness:meall-s-trail:5#effect"
  ],
  "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7": [
    "holy-ealdtradition-nema-s-usefulness:griffon-s-sense:7#sens-du-griffon"
  ],
  "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8": [
    "holy-ealdtradition-nema-s-usefulness:mongfind-s-travel:8#effect"
  ],
  "holy-tenetnid-tablet-of-anger:stone-senses:2": [
    "holy-tenetnid-tablet-of-anger:stone-senses:2#sens-petrifies"
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
  "holy-tenetnid-tablet-of-grace:holy-mending:1": [
    "holy-tenetnid-tablet-of-grace:holy-mending:1#effect"
  ],
  "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4": [
    "holy-tenetnid-tablet-of-grace:chalk-of-bete-wiemdas:4#effect"
  ],
  "holy-tenetnid-tablet-of-grace:breath-of-gave:6": [
    "holy-tenetnid-tablet-of-grace:breath-of-gave:6#effect"
  ],
  "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1": [
    "holy-tenetnid-tablet-of-voices:sirowerd-s-ear:1#oreille"
  ],
  "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3": [
    "holy-tenetnid-tablet-of-voices:sirowerd-s-tongue:3#langue"
  ],
  "holy-tenetnid-tablet-of-voices:sanity-of-gave:6": [
    "holy-tenetnid-tablet-of-voices:sanity-of-gave:6#langue"
  ],
  "holy-tenetnid-tablet-of-the-shield:sheltering:1": [
    "holy-tenetnid-tablet-of-the-shield:sheltering:1#effect"
  ],
  "holy-tenetnid-tablet-of-the-shield:thornwall:3": [
    "holy-tenetnid-tablet-of-the-shield:thornwall:3#effect"
  ],
  "holy-tenetnid-tablet-of-the-shield:storm-protection:2": [
    "holy-tenetnid-tablet-of-the-shield:storm-protection:2#effect"
  ],
  "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5": [
    "holy-tenetnid-tablet-of-the-shield:demonic-impotence:5#effect"
  ],
  "holy-tenetnid-tablet-of-the-shield:bark-skin:4": [
    "holy-tenetnid-tablet-of-the-shield:bark-skin:4#peau-d-ecorce"
  ],
  "holy-tenetnid-tablet-of-the-shield:tree-port:8": [
    "holy-tenetnid-tablet-of-the-shield:tree-port:8#refuge-arboricole"
  ],
  "holy-tenetnid-tablet-of-the-knight:blessed-spear:1": [
    "holy-tenetnid-tablet-of-the-knight:blessed-spear:1#weapon"
  ],
  "holy-tenetnid-tablet-of-the-knight:holy-authority:2": [
    "holy-tenetnid-tablet-of-the-knight:holy-authority:2#effect"
  ],
  "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5": [
    "holy-tenetnid-tablet-of-the-knight:rowthguard-s-battle-scourge:5#weapon"
  ],
  "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4": [
    "holy-tenetnid-tablet-of-the-knight:majestic-revelation:4#effect"
  ],
  "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7": [
    "holy-tenetnid-tablet-of-the-knight:belo-seoth-s-axe:7#weapon"
  ],
  "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8": [
    "holy-tenetnid-tablet-of-the-knight:guise-of-gave:8#effect"
  ],
  "holy-tenetnid-tablet-of-the-sun:dawn-shine:0": [
    "holy-tenetnid-tablet-of-the-sun:dawn-shine:0#effect"
  ],
  "holy-tenetnid-tablet-of-the-sun:thermal-light:3": [
    "holy-tenetnid-tablet-of-the-sun:thermal-light:3#effect",
    "holy-tenetnid-tablet-of-the-sun:thermal-light:3#fear-only"
  ],
  "holy-tenetnid-tablet-of-the-sun:holy-radiance:7": [
    "holy-tenetnid-tablet-of-the-sun:holy-radiance:7#effect",
    "holy-tenetnid-tablet-of-the-sun:holy-radiance:7#fear-only"
  ],
  "holy-haminges-power-of-the-beast:mind-of-the-predator:1": [
    "holy-haminges-power-of-the-beast:mind-of-the-predator:1#instinct-predateur"
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
  "holy-haminges-power-of-the-beast:mastomant-s-fur:4": [
    "holy-haminges-power-of-the-beast:mastomant-s-fur:4#effect"
  ],
  "holy-haminges-power-of-the-beast:endurance-of-the-giant:6": [
    "holy-haminges-power-of-the-beast:endurance-of-the-giant:6#endurance-du-geant"
  ],
  "holy-haminges-power-of-the-beast:master-of-wolfkin:7": [
    "holy-haminges-power-of-the-beast:master-of-wolfkin:7#effect"
  ],
  "holy-haminges-power-of-the-beast:mastomantshape:8": [
    "holy-haminges-power-of-the-beast:mastomantshape:8#aspect-du-mastomant"
  ],
  "holy-haminges-power-of-the-scale:shattered-mind:1": [
    "holy-haminges-power-of-the-scale:shattered-mind:1#esprit-brise"
  ],
  "holy-haminges-power-of-the-scale:regenerative-blood:3": [
    "holy-haminges-power-of-the-scale:regenerative-blood:3#effect"
  ],
  "holy-haminges-power-of-the-scale:limb-of-stone:5": [
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-gauche",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrebras-droit",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-gauche",
    "holy-haminges-power-of-the-scale:limb-of-stone:5#membre-de-pierrejambe-droite"
  ],
  "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4": [
    "holy-haminges-power-of-the-scale:blood-of-the-lindwurm:4#effect"
  ],
  "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8": [
    "holy-haminges-power-of-the-scale:heart-of-the-lindwurm:8#c-ur-du-lindwurm"
  ],
  "holy-haminges-power-of-the-scale:petrify:7": [
    "holy-haminges-power-of-the-scale:petrify:7#petrification",
    "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-half",
    "holy-haminges-power-of-the-scale:petrify:7#petrification-recovery-two-thirds"
  ],
  "holy-haminges-power-of-men:accomplished:1": [
    "holy-haminges-power-of-men:accomplished:1#effect"
  ],
  "holy-haminges-power-of-men:sight-of-the-dwarves:0": [
    "holy-haminges-power-of-men:sight-of-the-dwarves:0#vision-des-nains"
  ],
  "holy-haminges-power-of-men:mastery:3": [
    "holy-haminges-power-of-men:mastery:3#effect"
  ],
  "holy-haminges-power-of-men:weapon-prowess:5": [
    "holy-haminges-power-of-men:weapon-prowess:5#prouesse"
  ],
  "holy-haminges-power-of-men:dwarven-smith:6": [
    "holy-haminges-power-of-men:dwarven-smith:6#forge"
  ],
  "holy-haminges-power-of-men:legendary:7": [
    "holy-haminges-power-of-men:legendary:7#effect"
  ],
  "holy-haminges-power-of-trolls:willpower:1": [
    "holy-haminges-power-of-trolls:willpower:1#volonte"
  ],
  "holy-haminges-power-of-trolls:illusion-tricks:2": [
    "holy-haminges-power-of-trolls:illusion-tricks:2#illusions"
  ],
  "holy-haminges-power-of-the-thurses:troll-strength:1": [
    "holy-haminges-power-of-the-thurses:troll-strength:1#force-du-troll"
  ],
  "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0": [
    "holy-haminges-power-of-the-thurses:skin-of-the-hrim-troll:0#effect"
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
  "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5": [
    "holy-haminges-power-of-the-dragon:attack-of-the-huvfurwurm:5#attaque-du-huvfurwurm"
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
  "holy-toikalokke-lynx-power:tree-walk:1": [
    "holy-toikalokke-lynx-power:tree-walk:1#effect"
  ],
  "holy-toikalokke-lynx-power:orientation:0": [
    "holy-toikalokke-lynx-power:orientation:0#orientation"
  ],
  "holy-toikalokke-lynx-power:hearing:2": [
    "holy-toikalokke-lynx-power:hearing:2#effect"
  ],
  "holy-toikalokke-lynx-power:track:6": [
    "holy-toikalokke-lynx-power:track:6#pistage"
  ],
  "holy-toikalokke-lynx-power:aim:5": [
    "holy-toikalokke-lynx-power:aim:5#visee"
  ],
  "holy-toikalokke-lynx-power:concealment:7": [
    "holy-toikalokke-lynx-power:concealment:7#effect"
  ],
  "holy-toikalokke-lynx-power:forest-path:8": [
    "holy-toikalokke-lynx-power:forest-path:8#effect"
  ],
  "holy-toikalokke-lynx-power:pathfinder:9": [
    "holy-toikalokke-lynx-power:pathfinder:9#effect"
  ],
  "holy-toikalokke-animal-mind:animal-friend:0": [
    "holy-toikalokke-animal-mind:animal-friend:0#effect"
  ],
  "holy-toikalokke-animal-mind:animal-tracks:1": [
    "holy-toikalokke-animal-mind:animal-tracks:1#traces"
  ],
  "holy-toikalokke-animal-mind:invisible-to-animals:3": [
    "holy-toikalokke-animal-mind:invisible-to-animals:3#animaux"
  ],
  "holy-toikalokke-animal-mind:talk-to-animals:2": [
    "holy-toikalokke-animal-mind:talk-to-animals:2#parler"
  ],
  "holy-toikalokke-animal-mind:animal-spirit:4": [
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-ours",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-renard",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-lievre",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-corbeau",
    "holy-toikalokke-animal-mind:animal-spirit:4#esprit-de-la-bete-cerf"
  ],
  "holy-toikalokke-animal-mind:animal-master:5": [
    "holy-toikalokke-animal-mind:animal-master:5#apprivoise"
  ],
  "holy-toikalokke-animal-mind:animal-shape:6": [
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-ours",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-renard",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-lievre",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-corbeau",
    "holy-toikalokke-animal-mind:animal-shape:6#aspect-animal-cerf"
  ],
  "holy-toikalokke-master-of-elements:control-fire:1": [
    "holy-toikalokke-master-of-elements:control-fire:1#effect"
  ],
  "holy-toikalokke-master-of-elements:gift-of-water:3": [
    "holy-toikalokke-master-of-elements:gift-of-water:3#don-de-l-eau"
  ],
  "holy-toikalokke-master-of-elements:earth-wall:0": [
    "holy-toikalokke-master-of-elements:earth-wall:0#effect"
  ],
  "holy-toikalokke-master-of-elements:fire-tamer:4": [
    "holy-toikalokke-master-of-elements:fire-tamer:4#effect"
  ],
  "holy-toikalokke-master-of-elements:shape-earth:5": [
    "holy-toikalokke-master-of-elements:shape-earth:5#effect"
  ],
  "holy-toikalokke-master-of-elements:spring-of-water:8": [
    "holy-toikalokke-master-of-elements:spring-of-water:8#effect"
  ],
  "holy-toikalokke-master-of-elements:control-wind:9": [
    "holy-toikalokke-master-of-elements:control-wind:9#effect"
  ],
  "holy-toikalokke-master-of-elements:fire-resistant:11": [
    "holy-toikalokke-master-of-elements:fire-resistant:11#effect"
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
  "holy-joaringfaith-power-of-sille:healing:0": [
    "holy-joaringfaith-power-of-sille:healing:0#guerison"
  ],
  "holy-joaringfaith-power-of-sille:sunray:1": [
    "holy-joaringfaith-power-of-sille:sunray:1#effect"
  ],
  "holy-joaringfaith-power-of-sille:summer-place:2": [
    "holy-joaringfaith-power-of-sille:summer-place:2#effect"
  ],
  "holy-joaringfaith-power-of-sille:healing-glow:3": [
    "holy-joaringfaith-power-of-sille:healing-glow:3#lumiere-guerisseuse"
  ],
  "holy-joaringfaith-power-of-sille:healing-warmth:4": [
    "holy-joaringfaith-power-of-sille:healing-warmth:4#chaleur-guerisseuse"
  ],
  "holy-joaringfaith-power-of-sille:firon-power:5": [
    "holy-joaringfaith-power-of-sille:firon-power:5#pouvoir-de-firon"
  ],
  "holy-joaringfaith-power-of-sille:time-of-the-hunt:6": [
    "holy-joaringfaith-power-of-sille:time-of-the-hunt:6#effect"
  ],
  "holy-joaringfaith-power-of-sille:breath-of-sille:7": [
    "holy-joaringfaith-power-of-sille:breath-of-sille:7#souffle"
  ],
  "holy-joaringfaith-power-of-sille:healing-sun:8": [
    "holy-joaringfaith-power-of-sille:healing-sun:8#soleil-guerisseur"
  ],
  "holy-joaringfaith-sight-of-lekaba:tracking:0": [
    "holy-joaringfaith-sight-of-lekaba:tracking:0#effect"
  ],
  "holy-joaringfaith-sight-of-lekaba:scanning:1": [
    "holy-joaringfaith-sight-of-lekaba:scanning:1#effect"
  ],
  "holy-joaringfaith-sight-of-lekaba:far-sight:2": [
    "holy-joaringfaith-sight-of-lekaba:far-sight:2#effect"
  ],
  "holy-joaringfaith-sight-of-lekaba:espionage:3": [
    "holy-joaringfaith-sight-of-lekaba:espionage:3#espionage"
  ],
  "holy-joaringfaith-sight-of-lekaba:seeing:4": [
    "holy-joaringfaith-sight-of-lekaba:seeing:4#effect"
  ],
  "holy-joaringfaith-sight-of-lekaba:astral-voyage:6": [
    "holy-joaringfaith-sight-of-lekaba:astral-voyage:6#astral-voyage"
  ],
  "holy-joaringfaith-sight-of-lekaba:true-sight:7": [
    "holy-joaringfaith-sight-of-lekaba:true-sight:7#effect"
  ],
  "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0": [
    "holy-joaringfaith-curses-of-sonntag:uprooted-tree:0#effect"
  ],
  "holy-joaringfaith-curses-of-sonntag:curse-creature:5": [
    "holy-joaringfaith-curses-of-sonntag:curse-creature:5#effect"
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
