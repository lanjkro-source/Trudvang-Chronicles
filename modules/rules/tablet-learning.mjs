/** FR p. 91 / EN Player's Handbook p. 57: one Holy Tablet per learned Faith rank. */
export function holyTabletCapacity({items = [], faith = 0} = {}) {
  const tablets = new Set(Array.from(items).filter(item => item.type === "tablet" && item.system?.tabletType === "holy")
    .map(item => item.system.catalogId || item.flags?.["trudvang-chronicles"]?.catalogId || item.id || item._id || item));
  const current = tablets.size;
  const max = Math.max(0, Math.trunc(Number(faith) || 0));
  return {current, max, full: current >= max, exceeded: current > max};
}
