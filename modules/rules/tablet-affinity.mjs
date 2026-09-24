// Structural rule values from the 14 Vitner Tablets. The French source describes
// -1 as a one-point reduction (minimum 1), 1 as a one-point increase, and 2 as doubling
// the cost of power levels; zero leaves the cost unchanged.
export const VITNER_TABLET_AFFINITIES = Object.freeze({
  "vitner-vitner-craft": [-1, 0, 2],
  "vitner-dimvitner": [2, 0, -1],
  "vitner-soil-craft": [-1, -1, 1],
  "vitner-water-craft": [-1, -1, 1],
  "vitner-flame-craft": [1, -1, -1],
  "vitner-wind-craft": [1, -1, -1],
  "vitner-perceiving": [-1, 0, 1],
  "vitner-power-of-thought": [0, 0, 0],
  "vitner-power-of-vision": [-1, 0, 2],
  "vitner-witchcraft": [2, 0, -1],
  "vitner-animal-vitner": [0, -1, 1],
  "vitner-body-vitner": [0, 0, 0],
  "vitner-delusion-vitner": [1, 0, -1],
  "vitner-vitner-of-objects": [0, 0, 0]
});

export const VITNER_AFFINITY_TYPES = ["hvitavitner", "vaagrivitner", "morkvitner"];

export function tabletAffinity(id) {
  const values = VITNER_TABLET_AFFINITIES[id] ?? [0, 0, 0];
  return Object.fromEntries(VITNER_AFFINITY_TYPES.map((type, index) => [type, values[index]]));
}

export function affinityState(value) {
  return ({"-1": "favorable", "0": "neutral", "1": "unfavorable", "2": "doubled"})[Number(value)] ?? "neutral";
}
