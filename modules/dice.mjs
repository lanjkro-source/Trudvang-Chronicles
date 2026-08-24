import { escapeHtml } from "./helpers.mjs";

async function evaluate(formula) {
  const roll = new Roll(formula);
  await roll.evaluate();
  return roll;
}

export async function openDice({dice = 1, faces = 10, threshold = 10, modifier = 0} = {}) {
  const rolls = [];
  let total = Number(modifier) || 0;
  for (let die = 0; die < dice; die += 1) {
    let chained = true;
    let guard = 0;
    while (chained && guard < 100) {
      const roll = await evaluate(`1d${faces}`);
      const result = Number(roll.total);
      rolls.push(result);
      total += result;
      chained = threshold > 0 && result >= threshold;
      guard += 1;
    }
  }
  return {total, rolls, threshold, modifier: Number(modifier) || 0};
}

export async function openD10(options = {}) {
  return openDice({...options, faces: 10});
}

export async function rollUnder({actor, label, target, modifier = 0, kind = "skill", flavor = "", item = null, perfectSuccessMax = 1}) {
  const finalTarget = Number(target) + Number(modifier || 0);
  const roll = await evaluate("1d20");
  const result = Number(roll.total);
  const critical = result === 20 ? "failure" : (perfectSuccessMax > 0 && result <= perfectSuccessMax) ? "success" : "";
  const success = critical === "success" || (result !== 20 && result <= finalTarget);
  const margin = success ? Math.max(0, finalTarget - result) : null;
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/roll-card.hbs", {
    actorName: actor.name,
    actorImg: actor.img,
    label,
    result,
    target: finalTarget,
    modifier: Number(modifier || 0),
    success,
    margin,
    critical,
    kind,
    flavor,
    itemUuid: item?.uuid ?? "",
    actorUuid: actor.uuid
  });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({actor}),
    content,
    rolls: [roll]
  });
  return {roll, result, target: finalTarget, success, critical, margin};
}

export async function initiativeDialog({actor, target, lightningQuickLevel = 0}) {
  const DialogClass = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
  const magicChoices = actor.items.filter(item => ["spell", "divineFeat"].includes(item.type)).filter(item => {
    const tablet = actor.items.find(candidate => candidate.type === "tablet" && (candidate.system.catalogId === item.system.tabletId || candidate.name === item.system.tablet));
    return !tablet || Number(item.system.level || 1) <= Number(tablet.system.level || 1);
  }).map(item => {
    const level = Math.max(1, Math.min(5, Number(item.system.level || 1)));
    const modifier = -level + (item.type === "divineFeat" ? 2 * Number(lightningQuickLevel || 0) : 0);
    return `<option value="${modifier}">${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</option>`;
  }).join("");
  const weaponChoices = actor.items.filter(item => item.type === "weapon" && item.system.equipped).map(item => {
    const modifier = Number(item.system.initiativeModifier || 0);
    return `<option value="${modifier}">${escapeHtml(item.name)} (${modifier > 0 ? "+" : ""}${modifier})</option>`;
  }).join("");
  const choices = `${weaponChoices}${magicChoices}`;
  const content = `
    <form class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target}))}</p>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.InitiativeAction"))}</label><select name="magicModifier"><option value="0">${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.NoInitiativeAction"))}</option>${choices}</select></div>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
    </form>`;
  return new Promise(resolve => {
    new DialogClass({
      title: game.i18n.localize("TRUDVANG.Action.RollInitiative"), content,
      buttons: {
        roll: {icon: "<i class='fas fa-dice-d10'></i>", label: game.i18n.localize("TRUDVANG.Action.Roll"), callback: html => {
          const root = html[0] ?? html;
          resolve({modifier: Number(root.querySelector("[name=modifier]")?.value || 0) + Number(root.querySelector("[name=magicModifier]")?.value || 0)});
        }},
        cancel: {label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => resolve(null)}
      },
      default: "roll", close: () => resolve(null)
    }).render(true);
  });
}

export async function magicDialog({title, methods, spellModifier = 0, defaultCost = 0, resourceLabel = "", strenuousMax = 0}) {
  const DialogClass = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
  const options = methods.map(method => {
    const target = Number(method.target || 0) + Number(spellModifier || 0);
    return `<option value="${escapeHtml(method.id)}">${escapeHtml(method.label)} — VC ${target}</option>`;
  }).join("");
  const initialTarget = Number(methods[0]?.target || 0) + Number(spellModifier || 0);
  const strenuousOptions = Array.from({length: Number(strenuousMax || 0) + 1}, (_, bonus) => `<option value="${bonus}">+${bonus} SV (+${bonus * 2} ${escapeHtml(game.i18n.localize("TRUDVANG.Resource.Vitner"))})</option>`).join("");
  const content = `<form class="trudvang roll-dialog magic-roll-dialog">
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.MagicMethod"))}</label><select name="method">${options}</select></div>
    <p class="magic-breakdown">${escapeHtml(methods[0]?.breakdown || "")}</p>
    <p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalTarget"))}: <strong data-final-target>${initialTarget}</strong></p>
    <div class="form-group"><label>${escapeHtml(resourceLabel)}</label><input name="cost" type="number" min="0" value="${Number(defaultCost || 0)}"></div>
    ${strenuousMax ? `<div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Strenuous"))}</label><select name="strenuous">${strenuousOptions}</select></div>` : ""}
    ${strenuousMax ? `<p>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.FinalVitnerCost"))}: <strong data-final-cost>${Number(defaultCost || 0)}</strong></p>` : ""}
    <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
  </form>`;
  return new Promise(resolve => {
    new DialogClass({title, content, buttons: {
      roll: {icon: "<i class='fas fa-dice-d20'></i>", label: game.i18n.localize("TRUDVANG.Action.Roll"), callback: html => {
        const root = html[0] ?? html;
        const method = methods.find(entry => entry.id === root.querySelector("[name=method]")?.value) || methods[0];
        const strenuousBonus = Number(root.querySelector("[name=strenuous]")?.value || 0);
        resolve({method, strenuousBonus, target: Number(method?.target || 0) + Number(spellModifier || 0) + strenuousBonus, cost: Math.max(0, Number(root.querySelector("[name=cost]")?.value || 0)) + (2 * strenuousBonus), modifier: Number(root.querySelector("[name=modifier]")?.value || 0)});
      }}, cancel: {label: game.i18n.localize("TRUDVANG.Action.Cancel"), callback: () => resolve(null)}
    }, default: "roll", close: () => resolve(null), render: html => {
      const root = html[0] ?? html;
      const refresh = () => {
        const method = methods.find(entry => entry.id === root.querySelector("[name=method]")?.value) || methods[0];
        const strenuousBonus = Number(root.querySelector("[name=strenuous]")?.value || 0);
        const output = root.querySelector("[data-final-target]");
        if (output) output.textContent = Number(method?.target || 0) + Number(spellModifier || 0) + strenuousBonus;
        const finalCost = root.querySelector("[data-final-cost]");
        if (finalCost) finalCost.textContent = Math.max(0, Number(root.querySelector("[name=cost]")?.value || 0)) + (2 * strenuousBonus);
        const breakdown = root.querySelector(".magic-breakdown");
        if (breakdown) breakdown.textContent = method?.breakdown || "";
      };
      root.querySelector("[name=method]")?.addEventListener("change", refresh);
      root.querySelector("[name=strenuous]")?.addEventListener("change", refresh);
      root.querySelector("[name=cost]")?.addEventListener("input", refresh);
    }}).render(true);
  });
}

export async function rollDamage({actor, item}) {
  const formula = String(item.system.damage || "1d10").replace(/\s/g, "");
  const match = formula.match(/^(\d+)d(\d+)$/i);
  const strength = item.system.strengthApplies ? Number(actor.system.traits?.strength || 0) : 0;
  const damageBonus = Number(item.system.damageBonus || 0);
  let total;
  let detail;
  let rolls = [];
  if (match) {
    const dice = Number(match[1]);
    const faces = Number(match[2]);
    const fixed = damageBonus + strength;
    const exploded = await openDice({dice, faces, threshold: Number(item.system.openRoll || 0), modifier: fixed});
    total = exploded.total;
    detail = exploded.rolls.join(" + ");
  } else {
    const bonus = damageBonus ? ` + ${damageBonus}` : "";
    const roll = await evaluate(`(${formula}) + ${strength}${bonus}`);
    total = roll.total;
    detail = roll.formula;
    rolls = [roll];
  }
  const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/damage-card.hbs", {
    actorName: actor.name,
    actorImg: actor.img,
    itemName: item.name,
    itemImg: item.img,
    total,
    detail,
    openRoll: Number(item.system.openRoll || 0),
    strength
  });
  await ChatMessage.create({speaker: ChatMessage.getSpeaker({actor}), content, rolls});
  return total;
}

export async function modifierDialog({title, target, showCost = false, defaultCost = 0, resourceLabel = ""}) {
  const DialogClass = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
  const content = `
    <form class="trudvang roll-dialog">
      <p>${escapeHtml(game.i18n.format("TRUDVANG.Dialog.BaseTarget", {target}))}</p>
      <div class="form-group"><label>${escapeHtml(game.i18n.localize("TRUDVANG.Dialog.Modifier"))}</label><input name="modifier" type="number" value="0"></div>
      ${showCost ? `<div class="form-group"><label>${escapeHtml(resourceLabel)}</label><input name="cost" type="number" min="0" value="${Number(defaultCost)}"></div>` : ""}
    </form>`;
  return new Promise(resolve => {
    new DialogClass({
      title,
      content,
      buttons: {
        roll: {
          icon: "<i class='fas fa-dice-d20'></i>",
          label: game.i18n.localize("TRUDVANG.Action.Roll"),
          callback: html => {
            const root = html[0] ?? html;
            resolve({
              modifier: Number(root.querySelector("[name=modifier]")?.value || 0),
              cost: Number(root.querySelector("[name=cost]")?.value || defaultCost)
            });
          }
        },
        cancel: {
          label: game.i18n.localize("TRUDVANG.Action.Cancel"),
          callback: () => resolve(null)
        }
      },
      default: "roll",
      close: () => resolve(null)
    }).render(true);
  });
}
