export const CUSTOM_SPECIALTY_PREFIX = "custom-specialty-";
export const customSpecialtyMetadata = item => item?.flags?.["trudvang-chronicles"]?.customSpecialty;
export function isCustomSpecialty(item) {
  return item?.type === "ability" && item.system?.kind === "specialty"
    && String(item.system.catalogId ?? "").startsWith(CUSTOM_SPECIALTY_PREFIX)
    && customSpecialtyMetadata(item)?.added === true;
}
export function canDeleteCustomSpecialty(item) {
  return isCustomSpecialty(item) && Number(item.system.level ?? 0) === 0 && Number(item.system.offHandLevel ?? 0) === 0;
}
