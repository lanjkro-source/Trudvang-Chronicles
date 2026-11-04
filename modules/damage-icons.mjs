import {DAMAGE_ICONS, WEAPON_MATERIALS, DAMAGE_TYPES, DAMAGE_NATURES, DAMAGE_DELIVERIES, DAMAGE_PROTECTIONS} from "./rules/damage-qualifications.mjs";

const escape = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export const damageLabel = (group, value) => game.i18n.localize(`TRUDVANG.Damage.${group}.${value}`);
export function damageIcon(value, group = "Type") {
  const icon = group === "Material" ? (globalThis.CONFIG?.TRUDVANG?.weaponMaterials ?? WEAPON_MATERIALS)[value]
    : group === "Protection" ? ({normal: "fa-shield-halved", none: "fa-ban", magical: "fa-shield", magicalOrGrindsilver: "fa-gem"})[value] : DAMAGE_ICONS[value];
  if (!icon) return "";
  const label = damageLabel(group, value);
  return `<span class="damage-qualifier" title="${escape(label)}" aria-label="${escape(label)}" role="img"><i class="fas ${escape(icon)}" aria-hidden="true"></i></span>`;
}
export function damageIcons(qualification) {
  if (!qualification) return "";
  return `<span class="damage-qualifiers">${[["nature", "Nature"], ["delivery", "Delivery"], ["type", "Type"], ["material", "Material"]]
    .map(([key, group]) => damageIcon(qualification[key], group)).join("")}${qualification.protection !== "normal" ? damageIcon(qualification.protection, "Protection") : ""}</span>`;
}

export function damageQualificationFields(qualification, {item = false, material = true, delivery = true} = {}) {
  const groups = [["nature", "Nature", DAMAGE_NATURES], ["delivery", "Delivery", DAMAGE_DELIVERIES], ["type", "Type", DAMAGE_TYPES], ["protection", "Protection", DAMAGE_PROTECTIONS]];
  const rows = groups.filter(([key]) => delivery || key !== "delivery").map(([key, group, values]) => `<div class="damage-qualification-row"><span>${escape(damageLabel("Field", key))}</span><span class="damage-qualification-options">${values.map(value =>
    `<label class="damage-qualification-option" title="${escape(damageLabel(group, value))}"><input type="radio" name="${item ? `system.damageQualification.${key}` : `damage-${key}`}" value="${value}" ${qualification[key] === value ? "checked" : ""} aria-label="${escape(damageLabel(group, value))}">${damageIcon(value, group)}</label>`).join("")}</span></div>`).join("");
  const materials = globalThis.CONFIG?.TRUDVANG?.weaponMaterials ?? WEAPON_MATERIALS;
  const known = Object.hasOwn(materials, qualification.material);
  return `<div class="damage-qualification-fields">${rows}${material ? `<label class="damage-qualification-row"><span>${escape(damageLabel("Field", "material"))}</span><select name="${item ? "system.material" : "damage-material"}"><option value="">${escape(damageLabel("Material", "unknown"))}</option>${Object.keys(materials).map(value => `<option value="${escape(value)}" ${value === qualification.material ? "selected" : ""}>${escape(damageLabel("Material", value))}</option>`).join("")}${!known && qualification.material ? `<option value="${escape(qualification.material)}" selected>${escape(qualification.material)}</option>` : ""}</select></label>` : ""}</div>`;
}

/** Inline notation works in every enriched description, including third-party ones.
 * Literal damage phrases are rendered too; source rule quotations stay untouched. */
export function registerDamageEnrichers() {
  const phrases = {
    "armes tranchantes": "slashing", "armes perforantes": "piercing", "armes contondantes": "bludgeoning",
    "slashing weapons": "slashing", "piercing weapons": "piercing", "bludgeoning weapons": "bludgeoning",
    "dégâts magiques": "magical", "dégâts normaux": "normal", "magical damage": "magical", "normal damage": "normal",
    "dégâts tranchants": "slashing", "dégâts perforants": "piercing", "dégâts contondants": "bludgeoning",
    "dégâts de feu": "fire", "dégâts de froid": "cold", "dégâts de poison": "poison", "dégâts d’acide": "acid", "dégâts d'acide": "acid",
    "slashing damage": "slashing", "piercing damage": "piercing", "bludgeoning damage": "bludgeoning",
    "fire damage": "fire", "cold damage": "cold", "lightning damage": "lightning", "acid damage": "acid", "poison damage": "poison"
  };
  const element = html => { const template = document.createElement("template"); template.innerHTML = html; return template.content.firstElementChild; };
  CONFIG.TextEditor.enrichers.push({pattern: /@Damage\[(normal|magical|melee|ranged|slashing|piercing|bludgeoning|fire|cold|lightning|acid|poison|other)\]/g,
    enricher: match => element(damageIcon(match[1], ["normal", "magical"].includes(match[1]) ? "Nature" : ["melee", "ranged"].includes(match[1]) ? "Delivery" : "Type"))});
  CONFIG.TextEditor.enrichers.push({pattern: new RegExp(`\\b(?:${Object.keys(phrases).join("|")})\\b`, "gi"),
    enricher: match => element(damageIcon(phrases[match[0].toLowerCase()], ["normal", "magical"].includes(phrases[match[0].toLowerCase()]) ? "Nature" : "Type"))});
}
