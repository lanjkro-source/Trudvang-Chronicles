/** Intrinsic traits stay intact; null means the current trait still follows them. */
export function npcCurrentTrait(system, key) {
  return Number(system.traitCurrent?.[key] ?? system.traits?.[key] ?? 0);
}

export function npcTraitEdit(actor, key, shown) {
  const stored = npcCurrentTrait(actor._source.system, key);
  const effect = Number(actor.getTraitValue(key)) - stored;
  return Number(shown) - effect;
}

/** Creature feats use explicit mechanics, never their translated display name. */
export function ignoresWoundPenalties(actor) {
  return Array.from(actor.items ?? []).some(item => item.type === "ability"
    && item.system.kind === "feat" && Number(item.system.level ?? 1) > 0
    && item.system.ignoreWoundPenalties === true);
}

const learned = node => Number(node.level || 0) > 0 || Number(node.offHandLevel ?? node.item.system.offHandLevel ?? 0) > 0;
const normalize = name => String(name || "").trim().toLocaleLowerCase();
const referenceName = name => normalize(name).replace(/\s*\([^)]*\)/g, "").normalize("NFD").replace(/\p{Diacritic}/gu, "");

/** Link book rows to their reference, respecting the book's skill/discipline hierarchy. */
export function npcBookSkillRows(rows, {skills, knowledgeTree, localize}) {
  let skillKey = "";
  let disciplineId = "";
  const matches = (name, entry) => [localize(entry.label), entry.name].some(label => referenceName(label) === referenceName(name));
  return Array.from(rows ?? [], (row, index) => {
    let catalogId = "";
    if (row.kind === "skill") {
      skillKey = Object.keys(skills).find(key => referenceName(localize(skills[key])) === referenceName(row.name)) ?? "";
      disciplineId = "";
    } else {
      const disciplines = skillKey ? knowledgeTree[skillKey] ?? [] : Object.values(knowledgeTree).flat();
      if (row.kind === "discipline") {
        disciplineId = disciplines.find(entry => matches(row.name, entry))?.id ?? "";
        catalogId = disciplineId;
      } else {
        const parents = disciplineId ? disciplines.filter(entry => entry.id === disciplineId) : disciplines;
        catalogId = parents.flatMap(entry => entry.specialties).find(entry => matches(row.name, entry))?.id ?? "";
      }
    }
    return {name: row.name, value: Number(row.value || 0), kind: row.kind, index, skillKey, catalogId};
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
