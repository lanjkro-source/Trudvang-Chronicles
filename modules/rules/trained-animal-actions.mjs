import {customSpecialtyMetadata} from "./custom-specialties.mjs";

// FR Rules pp. 128–129; EN GM Guide pp. 86–87 (trained animals).
export const ANIMAL_ACTION_VALUES = {fetch: [3, 6, 9, 12, 15], guard: [10, 12, 14, 16, 18]};
export function trainedAnimalValue(action, degree) {
  return Number.isInteger(Number(degree)) && Number(degree) >= 1 && Number(degree) <= 5
    ? ANIMAL_ACTION_VALUES[action]?.[Number(degree) - 1] ?? null : null;
}
export const specialtySourceId = item => customSpecialtyMetadata(item)?.sourceCatalogId || item?.system?.catalogId;
export function trainedAnimalActions(item) {
  if (item?.type !== "ability" || item.system?.kind !== "specialty") return [];
  const id = specialtySourceId(item);
  return id === "riding" ? ["jump"] : id === "animalFriend" ? ["fetch", "guard"] : [];
}
