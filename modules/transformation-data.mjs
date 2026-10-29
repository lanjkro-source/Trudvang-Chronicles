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
    "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun",
    "holy-gerbanis-strength-of-stormi:jotun-strength:6#force-du-jotun-allies"
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
  "holy-gerbanis-power-of-enken:heart-of-enken:6": [
    "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken",
    "holy-gerbanis-power-of-enken:heart-of-enken:6#c-ur-d-enken-allies"
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
  "holy-haminges-power-of-men:sight-of-the-dwarves:0": [
    "holy-haminges-power-of-men:sight-of-the-dwarves:0#vision-des-nains"
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
