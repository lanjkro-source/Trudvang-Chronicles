import { ARMOR_ENCUMBRANCE_PENALTIES } from "./rules/equipment-resolver.mjs";

const fields = foundry.data.fields;

const string = (initial = "") => new fields.StringField({required: true, nullable: false, initial});
const html = () => new fields.HTMLField({required: true, nullable: false, initial: ""});
const integer = (initial = 0, options = {}) => new fields.NumberField({
  required: true,
  nullable: false,
  integer: true,
  initial,
  ...options
});
const number = (initial = 0, options = {}) => new fields.NumberField({
  required: true,
  nullable: false,
  initial,
  ...options
});
const boolean = (initial = false) => new fields.BooleanField({required: true, nullable: false, initial});
const schema = definition => new fields.SchemaField(definition);

function traitSchema() {
  return schema({
    charisma: integer(0),
    constitution: integer(0),
    dexterity: integer(0),
    intelligence: integer(0),
    perception: integer(0),
    psyche: integer(0),
    strength: integer(0)
  });
}

function effectiveTraitSchema() {
  return schema({
    charisma: integer(0, {persisted: false}),
    constitution: integer(0, {persisted: false}),
    dexterity: integer(0, {persisted: false}),
    intelligence: integer(0, {persisted: false}),
    perception: integer(0, {persisted: false}),
    psyche: integer(0, {persisted: false}),
    strength: integer(0, {persisted: false})
  });
}

function resource(initialValue, initialMax) {
  return schema({
    value: number(initialValue),
    max: number(initialMax),
    current: number(initialValue, {persisted: false})
  });
}

function combatPool() {
  return schema({
    spent: integer(-1, {min: -1}),
    // Free CP are used independently by each hand, but movement spends them for both.
    weaponSpent: integer(0, {min: 0}),
    offHandSpent: integer(0, {min: 0}),
    max: integer(0, {persisted: false}),
    current: integer(0, {persisted: false})
  });
}

function combatPoolsSchema() {
  return schema({
    free: combatPool(),
    battleExperience: combatPool(),
    armedFighting: combatPool(),
    unarmedFighting: combatPool(),
    attacksParries: combatPool(),
    combatActions: combatPool(),
    brawling: combatPool(),
    wrestling: combatPool(),
    shieldParry: combatPool(),
    oneHandedLightWeapons: combatPool(),
    oneHandedLightWeaponsOffHand: combatPool(),
    oneHandedHeavyWeapons: combatPool(),
    oneHandedHeavyWeaponsOffHand: combatPool(),
    throwingWeapons: combatPool(),
    throwingWeaponsOffHand: combatPool(),
    twoHandedWeapons: combatPool(),
    crossbow: combatPool(),
    bowsSlings: combatPool()
  });
}

function skill(initial = 1) {
  return schema({value: integer(initial, {min: 0}), bonus: integer(0)});
}

function skillsSchema() {
  return schema({
    agility: skill(),
    care: skill(),
    entertainment: skill(),
    faith: skill(),
    fighting: skill(),
    knowledge: skill(),
    shadowArts: skill(),
    vitnerCraft: skill(),
    wilderness: skill()
  });
}

function effectiveSkillsSchema(initial = 1) {
  return schema({
    agility: integer(initial, {persisted: false}),
    care: integer(initial, {persisted: false}),
    entertainment: integer(initial, {persisted: false}),
    faith: integer(initial, {persisted: false}),
    fighting: integer(initial, {persisted: false}),
    knowledge: integer(initial, {persisted: false}),
    shadowArts: integer(initial, {persisted: false}),
    vitnerCraft: integer(initial, {persisted: false}),
    wilderness: integer(initial, {persisted: false})
  });
}

function rollModifiersSchema() {
  return schema({
    allActions: integer(0, {persisted: false}),
    combatActions: integer(0, {persisted: false}),
    movementActions: integer(0, {persisted: false}),
    attack: integer(0, {persisted: false}),
    parry: integer(0, {persisted: false}),
    initiative: integer(0, {persisted: false}),
    magic: integer(0, {persisted: false}),
    traits: effectiveTraitSchema(),
    skills: effectiveSkillsSchema(0)
  });
}

function actorCommonSchema() {
  return {
    traits: traitSchema(),
    effective: schema({
      traits: effectiveTraitSchema(),
      skills: effectiveSkillsSchema()
    }),
    modifiers: schema({
      rolls: rollModifiersSchema(),
      movement: integer(0, {persisted: false}),
      protection: integer(0, {persisted: false}),
      bodyMax: integer(0, {persisted: false}),
      combatMax: integer(0, {persisted: false}),
      vitnerMax: integer(0, {persisted: false}),
      divinityMax: integer(0, {persisted: false}),
      bodyValue: integer(0, {persisted: false}),
      combatValue: integer(0, {persisted: false}),
      vitnerValue: integer(0, {persisted: false}),
      divinityValue: integer(0, {persisted: false}),
      raudValue: integer(0, {persisted: false}),
      fearValue: integer(0, {persisted: false})
    }),
    resources: schema({
      body: resource(32, 32),
      raud: resource(0, 0),
      fear: resource(0, 50),
      combat: resource(1, 1),
      vitner: resource(0, 0),
      divinity: resource(0, 0)
    }),
    combatPools: combatPoolsSchema(),
    initiative: schema({base: integer(0), current: integer(0)}),
    movement: schema({base: integer(10), current: integer(10)}),
    notes: html(),
    damage: schema({taken: number(0), penalty: integer(0), level: string("light")}),
    fearPenalty: integer(0),
    protection: integer(0),
    persistenceInWild: integer(10),
    buildCost: integer(0)
  };
}

function prepareEffectiveActorData(model) {
  for (const key of Object.keys(model.effective.traits)) {
    model.effective.traits[key] = Number(model.traits?.[key] || 0);
  }
  for (const key of Object.keys(model.effective.skills)) {
    const skill = model.skills?.[key];
    model.effective.skills[key] = Number(skill?.value || 0) + Number(skill?.bonus || 0);
  }
  for (const resource of Object.values(model.resources || {})) resource.current = Number(resource.value || 0);
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...actorCommonSchema(),
      details: schema({
        race: string("human"),
        culture: string(),
        archetype: string(),
        nativeLanguage: string("rona"),
        religion: string(),
        age: integer(20, {min: 0}),
        height: string(),
        weight: string(),
        handedness: string("right")
      }),
      money: schema({copper: integer(0), silver: integer(0), gold: integer(0)}),
      experience: schema({
        creationMode: boolean(false),
        creationTotal: integer(300),        creationSpent: integer(0),
        adventureAvailable: integer(0),
        adventureSpent: integer(0)
      }),
      skills: skillsSchema(),
      appearance: html(),
      history: html()
    };
  }

  prepareBaseData() {
    super.prepareBaseData();
    prepareEffectiveActorData(this);
  }
}

export class NpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...actorCommonSchema(),
      details: schema({
        creatureType: string("humanoid"),
        size: string("1t"),
        age: string(),
        fearFactor: string(),
        naturalArmor: integer(0, {min: 0})
      }),
      skills: skillsSchema(),
      description: html()
    };
  }

  prepareBaseData() {
    super.prepareBaseData();
    prepareEffectiveActorData(this);
  }
}

function itemBaseSchema() {
  return {
    description: html(),
    source: string(),
    quantity: integer(1, {min: 0}),
    weight: number(0, {min: 0}),
    value: number(0, {min: 0})
  };
}

function equipmentSchema() {
  return {
    equipped: boolean(false),
    initiativeModifier: integer(0),
    protection: integer(0, {min: 0}),
    breach: schema({value: integer(0), max: integer(0, {min: 0})})
  };
}

function magicSchema() {
  return {
    level: integer(1, {min: 1, max: 5}),
    cost: integer(2, {min: 0}),
    modifier: integer(-2),
    duration: string("Instant"),
    range: string("Personal"),
    weavingTime: string("1 action round"),
    active: boolean(false),
    activeCost: integer(0, {min: 0})
  };
}

class BaseItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return itemBaseSchema();
  }

  prepareDerivedData() {
    if (this.breach && Number.isFinite(Number(this.breach.value))) {
      this.protection = Math.ceil(Math.max(0, Number(this.breach.value)) / 10);
    }
  }
}

export class WeaponData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...equipmentSchema(),
      category: string("oneHandedLight"),
      combatSpecialty: string(),
      hand: string("weapon"),
      damage: string("1d10"),
      openRoll: integer(10, {min: 0, max: 10}),
      strengthApplies: boolean(true),
      weaponActions: integer(4, {min: 0}),
      weaponActionsSpent: integer(0, {min: 0}),
      combatPointBonus: integer(0),
      combatPointBonusUsed: boolean(false),
      damageBonus: integer(0),
      range: schema({short: integer(0), long: integer(0)})
    };
  }
}

export class ArmorData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...equipmentSchema(),
      heft: integer(0, {min: 0}),
      movementModifier: integer(0)
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    const key = Math.min(10, Math.max(0, Number(this.heft) || 0));
    const [initiative, movement] = ARMOR_ENCUMBRANCE_PENALTIES[key] ?? [0, 0];
    this.initiativeModifier = initiative;
    this.movementModifier = movement;
  }
}

export class ShieldData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...equipmentSchema(),
      damage: string("1d10"),
      openRoll: integer(0, {min: 0, max: 10}),
      weaponActions: integer(2, {min: 0}),
      weaponActionsSpent: integer(0, {min: 0}),
      combatPointBonus: integer(0),
      combatPointBonusUsed: boolean(false),
      damageBonus: integer(0),
      passiveProtection: integer(0, {min: 0})
    };
  }
}

export class GearData extends BaseItemData {
  static defineSchema() {
    return {...super.defineSchema(), equipped: boolean(false)};
  }
}

export class PotionData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      strength: integer(0),
      application: string("Drink"),
      duration: string(),
      effect: html()
    };
  }
}

export class SpellData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...magicSchema(),
      catalogId: string(),
      tabletId: string(),
      tablet: string(),
      spellType: string("instant")
    };
  }
}

export class TabletData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      catalogId: string(),
      level: integer(1, {min: 1, max: 5}),
      tabletType: string("vitner"),
      religion: string(),
      costTrait: string()
    };
  }
}

export class DivineFeatData extends BaseItemData {
  static defineSchema() {
    return {...super.defineSchema(), ...magicSchema(), catalogId: string(), tabletId: string(), tablet: string()};
  }
}

export class AbilityData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      kind: string("discipline"),
      parentSkill: string(),
      parentDiscipline: string(),
      costTrait: string(),
      catalogId: string(),
      summary: string(),
      freeLevels: integer(0, {min: 0, max: 5}),
      level: integer(1, {min: 0, max: 5}),
      offHandLevel: integer(0, {min: 0, max: 5}),
      rollBonus: integer(1)
    };
  }
}

export const ACTOR_DATA_MODELS = {character: CharacterData, npc: NpcData};
export const ITEM_DATA_MODELS = {
  weapon: WeaponData,
  armor: ArmorData,
  shield: ShieldData,
  gear: GearData,
  potion: PotionData,
  spell: SpellData,
  tablet: TabletData,
  divineFeat: DivineFeatData,
  ability: AbilityData
};
