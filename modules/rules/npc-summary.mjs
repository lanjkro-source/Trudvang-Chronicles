/** Intrinsic traits stay intact; null means the current trait still follows them. */
export function npcCurrentTrait(system, key) {
  return Number(system.traitCurrent?.[key] ?? system.traits?.[key] ?? 0);
}

export function npcTraitEdit(actor, key, shown) {
  const stored = npcCurrentTrait(actor._source.system, key);
  const effect = Number(actor.getTraitValue(key)) - stored;
  return Number(shown) - effect;
}

/** Keep the bestiary range separate from the maximum rolled for this individual. */
export function npcHealthRange(actor) {
  const details = actor.system.details ?? {};
  const playedMax = Number(actor._source?.system.resources?.body?.max ?? actor.system.resources?.body?.max ?? 1);
  const min = Number(details.bodyMin) > 0 ? Number(details.bodyMin) : playedMax;
  const max = Number(details.bodyMax) > 0 ? Number(details.bodyMax) : playedMax;
  return {min, max, valid: Number.isInteger(min) && Number.isInteger(max) && min > 0 && max >= min};
}

/** Large creatures distribute one set of Combat Points over several rounds (FR Bestiary, p. 9). */
export function npcCombatActionRounds(size) {
  const raw = String(size ?? "").trim().replace(",", ".");
  if (raw.startsWith(">10") || raw.startsWith("10+")) return 4;
  const fraction = raw.match(/^(\d+)\s*\/\s*(\d+)/);
  const value = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 1;
  return value > 10 ? 4 : value > 5 ? 3 : value > 2 ? 2 : 1;
}

/** Present book distances as recorded, without inventing missing movement rates. */
export function npcMovementRows(system, {localize}) {
  const modes = {terrestre: "land", land: "land", walking: "land", vol: "flight", flight: "flight", flying: "flight",
    nage: "swimming", swimming: "swimming", spécial: "special", special: "special"};
  const rows = system.details?.move ?? [];
  if (!rows.length) return [{mode: localize("TRUDVANG.Npc.MovementModes.land"), distance: "—",
    max: `${Number(system.movement?.current || 0)} m`}];
  return Array.from(rows, row => {
    const modeKey = modes[String(row.mode || "").trim().toLocaleLowerCase()];
    return {mode: modeKey ? localize(`TRUDVANG.Npc.MovementModes.${modeKey}`) : row.mode,
      distance: row.distance || "—", max: row.max || "—"};
  });
}

/** Book movement per 2 CP; shared by NPC actions and prepared-combination audits. */
export function npcCombatMovementModes(system) {
  return Array.from(system.details?.move ?? [], (row, index) => {
    const match = String(row.distance ?? "").trim().match(/^(\d+(?:[.,]\d+)?)\s*m$/i);
    const metersPerTwo = match ? Number(match[1].replace(",", ".")) : 0;
    return {id: String(index), mode: row.mode, metersPerTwo};
  }).filter(row => Number.isFinite(row.metersPerTwo) && row.metersPerTwo > 0);
}

/** Creature feats use explicit mechanics, never their translated display name. */
export function ignoresWoundPenalties(actor) {
  return Array.from(actor.items ?? []).some(item => (item.type === "creatureAbility" || (item.type === "ability"
    && item.system.kind === "feat" && Number(item.system.level ?? 1) > 0))
    && item.system.ignoreWoundPenalties === true);
}

const learned = node => Number(node.level || 0) > 0 || Number(node.offHandLevel ?? node.item.system.offHandLevel ?? 0) > 0;
const normalize = name => String(name || "").trim().toLocaleLowerCase();
const referenceName = name => normalize(name).replace(/\s*\([^)]*\)/g, "").normalize("NFD").replace(/\p{Diacritic}/gu, "");

/** Link book rows to their reference, respecting the book's skill/discipline hierarchy. */
export function npcBookSkillRows(rows, {skills, knowledgeTree, localize}) {
  let skillKey = "";
  let disciplineId = "";
  let skillValue = 0;
  let disciplineValue = 0;
  const matches = (name, entry) => [localize(entry.label), entry.name].some(label => referenceName(label) === referenceName(name));
  return Array.from(rows ?? [], (row, index) => {
    let catalogId = "";
    if (row.kind === "skill") {
      skillKey = row.skillId || Object.keys(skills).find(key => referenceName(localize(skills[key])) === referenceName(row.name)) || "";
      disciplineId = "";
      skillValue = Number(row.value || 0);
      disciplineValue = 0;
    } else {
      const disciplines = skillKey ? knowledgeTree[skillKey] ?? [] : Object.values(knowledgeTree).flat();
      if (row.kind === "discipline") {
        disciplineId = row.catalogId || disciplines.find(entry => matches(row.name, entry))?.id || "";
        catalogId = disciplineId;
        disciplineValue = Number(row.value || 0);
      } else {
        const parents = disciplineId ? disciplines.filter(entry => entry.id === disciplineId) : disciplines;
        catalogId = row.catalogId || parents.flatMap(entry => entry.specialties).find(entry => matches(row.name, entry))?.id || "";
      }
    }
    return {name: row.name, value: Number(row.value || 0), kind: row.kind, index, skillKey, catalogId,
      skillValue, disciplineValue: row.kind === "specialty" ? disciplineValue : 0};
  });
}

const decorate = node => ({...node,
  offHandLevel: Number(node.offHandLevel ?? node.item.system.offHandLevel ?? 0),
  separateHands: node.separateHands || Number(node.item.system.offHandLevel || 0) > 0
});

/** Only learned entries, retaining their real hierarchy (including custom items). */
export function npcSkillTrees(trees) {
  return trees.map(tree => {
    const disciplines = tree.disciplines.map(node => ({...node,
      visible: learned(node), specialties: node.specialties.filter(learned)
    }));
    const custom = tree.unassigned.filter(node => node.item.system.kind !== "feat").map(decorate);
    for (const node of custom.filter(node => node.item.system.kind === "discipline")) {
      disciplines.push({...node, visible: learned(node), specialties: []});
    }
    const unassigned = [];
    for (const node of custom.filter(node => node.item.system.kind !== "discipline" && learned(node))) {
      const parent = disciplines.find(d => normalize(d.item.name) === normalize(node.item.system.parentDiscipline));
      if (parent) parent.specialties.push(node);
      else unassigned.push(node);
    }
    return {...tree, visible: Number(tree.level) > 1,
      disciplines: disciplines.filter(node => node.visible || node.specialties.length), unassigned};
  }).filter(tree => tree.visible || tree.disciplines.length || tree.unassigned.length);
}
