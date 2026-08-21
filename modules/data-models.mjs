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

function resource(initialValue, initialMax) {
  return schema({value: number(initialValue), max: number(initialMax)});
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

function actorCommonSchema() {
  return {
    traits: traitSchema(),
    resources: schema({
      body: resource(32, 32),
      raud: resource(0, 0),
      fear: resource(0, 50),
      combat: resource(1, 1),
      vitner: resource(0, 0),
      divinity: resource(0, 0)
    }),
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
      experience: schema({
        creationMode: boolean(false),
        creationTotal: integer(300),
        creationSpent: integer(0),
        adventureAvailable: integer(0),
        adventureSpent: integer(0)
      }),
      skills: skillsSchema(),
      appearance: html(),
      history: html()
    };
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
    activeCost: integer(0, {min: 0}),
    effect: html()
  };
}

class BaseItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return itemBaseSchema();
  }
}

export class WeaponData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...equipmentSchema(),
      category: string("oneHandedLight"),
      damage: string("1d10"),
      openRoll: integer(10, {min: 0, max: 10}),
      strengthApplies: boolean(true),
      weaponActions: integer(4, {min: 0}),
      attackValue: integer(5, {min: 0}),
      range: schema({short: string(), long: string()})
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
}

export class ShieldData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...equipmentSchema(),
      weaponActions: integer(2, {min: 0}),
      attackValue: integer(5, {min: 0})
    };
  }
}

export class GearData extends BaseItemData {}

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
