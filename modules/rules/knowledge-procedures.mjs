// FR Livre des règles pp. 97, 102, 121, 128, 303–305, 332–333;
// EN Player's Handbook (Care/Wilderness), GM Guide (Hunting/Repairing/Healing).
export const PROCEDURES = {
  huntingFishing: "hunt", speciesHunter: "hunt", carveButcher: "hunt", huntingExperience: "hunt",
  hardMaterials: "repair", softMaterials: "repair", handicraft: "repair",
  firstAidNursing: "heal", healingDrugs: "heal", animalFriend: "train"
};
export const HUNTING_FOOD = [
  ["1d3+1", "1d6+2", null], ["1d6+2", "1d10+6", "3d10+2"],
  ["1d10+2", "2d10+4", "4d10+8"], ["1d10+6", "3d10+2", "6d10+4"],
  ["2d10", "4d10", "8d10"], ["2d10+4", "4d10+8", "8d10+16"],
  ["2d10+8", "5d10+6", "8d10+32"], ["3d10+2", "6d10+4", "8d10+48"],
  ["3d10+6", "7d10+2", "8d10+64"], ["4d10", "8d10", "8d10+80"]
];
export const TRAINING_FACTORS = {fetch: 2, jump: 2, hunt: 3, message: 3, run: 4, track: 3, attack: 5, guard: 4};
export function procedureValues(kind, v, {skill = 1, level = 0} = {}) {
  const numericFields = kind === "hunt" ? ["size", "terrain", "hours", "carried", "hunters", "animal"]
    : kind === "repair" ? ["tools"] : kind === "heal" ? ["negative"] : ["stage", "completed"];
  if (numericFields.some(name => !Number.isFinite(Number(v[name])))) return {invalid: true};
  if (kind === "hunt" && (!Number.isInteger(Number(v.size)) || Number(v.size) < 0 || Number(v.size) > 2
    || Number(v.carried) < 0 || Number(v.hunters) < 1 || Number(v.animal) < 0 || Number(v.animal) > 5)) return {invalid: true};
  if (kind === "train" && (!Number.isInteger(Number(v.stage)) || Number(v.stage) < 1 || Number(v.stage) > 5
    || !Number.isInteger(Number(v.completed)) || Number(v.completed) < 0
    || !(v.training === "domesticate" || v.training in TRAINING_FACTORS))) return {invalid: true};
  let modifier = 0;
  if (kind === "hunt") {
    const size = Number(v.size);
    const minimum = [4, 6, 8][size];
    const group = Number(v.hunters) >= [2, 4, 6][size];
    const hours = Number(v.hours);
    if (!Number.isFinite(hours) || hours < minimum || hours > 12) return {invalid: true};
    // Separate days each pay the minimum duration before earning extra-time bonuses.
    const time = Math.min(skill, Number(v.carried) + Math.floor((hours - minimum) / (group ? 1 : 2)));
    modifier = Number(v.terrain) + [2, 0, -5][size] + time + Number(v.animal);
    return {modifier, divisor: v.separate ? 2 : 1, time, minimum, level,
      rows: [{field: "terrain", value: Number(v.terrain)}, {field: "size", value: [2, 0, -5][size]},
        {field: "TimeBonus", value: time}, {field: "animal", value: Number(v.animal)}]};
  }
  if (kind === "repair") modifier = Number(v.tools);
  if (kind === "heal" && v.mode === "save") modifier = -Math.abs(Number(v.negative));
  return {modifier, divisor: 1, level, rows: modifier ? [{field: kind === "repair" ? "tools" : "negative", value: modifier}] : []};
}
export function procedureOutcome(kind, v, values, outcome) {
  if (kind === "hunt") {
    if (!outcome.success || outcome.margin < 1) return {key: "NoCatch"};
    const band = Math.floor((outcome.margin - 1) / 4);
    const size = Number(v.size);
    const formula = HUNTING_FOOD[Math.min(9, band)][size];
    if (!formula) return {key: "NoCatch"};
    const extra = Math.max(0, band - 9) * [4, 8, 16][size];
    return {key: "Food", formula: `${formula}${extra ? `+${extra}` : ""}`, butcher: Boolean(v.butcher)};
  }
  if (kind === "repair") {
    if (outcome.critical === "failure") return {key: "RepairDamage", formula: "1d6"};
    return {key: "Repaired", amount: outcome.success ? 2 * values.level * (outcome.critical === "success" ? 3 : 1) : 0};
  }
  if (kind === "heal") {
    if (!outcome.success) return {key: "Failed"};
    return {key: {first: "FirstAid", rest: "Nursing", poultice: "Poultice", save: "Saved", stabilize: "Stabilized"}[v.mode], amount: values.level};
  }
  const required = v.training === "domesticate" ? 5 : TRAINING_FACTORS[v.training] * Number(v.stage);
  const completed = Math.min(required, Number(v.completed) + (outcome.success ? 1 : 0));
  return {key: completed >= required ? "Trained" : "TrainingProgress", completed, required};
}
