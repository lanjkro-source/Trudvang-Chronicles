import {temporaryHealthLayers, effectRules, transformationProfile} from "./transformation-profile.mjs";
import {effectContributions,effectContributionText} from "./effect-contributions.mjs";

/** Shared PJ/PNJ state panel: prepared values plus the named contributors. */
export function effectStatus(actor, {localize = key => key} = {}) {
  const profile = actor.transformationProfile ?? transformationProfile(actor);
  const layers = temporaryHealthLayers(actor);
  const temporaryHP = layers.reduce((total, layer) => total + layer.remaining, 0);
  const temporaryHint = layers.map(({effect,remaining}) => `${effect.name} +${remaining}`).join(" · ");
  const nativeEffects=Array.from(actor.allApplicableEffects?.()??actor.effects??[]).filter(e=>!e.disabled&&!e.isSuppressed&&!e.duration?.expired);
  const nativeMovement=nativeEffects.some(e=>Array.from(e.system?.changes??[]).some(c=>["system.modifiers.movement","system.effective.traits.dexterity"].includes(c.key)));
  const movementChanged = profile.movements.length || nativeMovement || Number(actor.system.modifiers?.movement);
  const nativeHint=effectContributionText(effectContributions(actor,"system.modifiers.movement",{total:actor.system.modifiers?.movement??0}));
  const movement = movementChanged ? Object.entries(actor.transformationMovement ?? {land: actor.system.movement?.current ?? 0})
    .map(([mode,value]) => ({label: localize(`TRUDVANG.Transformation.Modes.${mode}`), value,
      distance: actor.transformationMovementRows?.find(row=>row.mode===mode)?.distance ?? `1 m`,
      max: actor.transformationMovementRows?.find(row=>row.mode===mode)?.max ?? `${value} m`,
      source:[nativeHint,...profile.effects.filter(e=>(effectRules(e).movement??[]).some(r=>r.mode===mode||r.mode==="all")).map(e=>e.name)].filter(Boolean).join(" · ")})) : [];
  const immunity = profile.effects.filter(e => effectRules(e).ignoreFear).map(e => e.name).join(" · ");
  const notes = profile.effects.map(effect => {
    const r=effectRules(effect);
    const parentSummary=effect.parent?.type==="effect"?effect.parent.system?.summary:"";
    const summary=effect.flags?.["trudvang-chronicles"]?.transformation?.summary
      || parentSummary
      || String(effect.description ?? "").replace(/<[^>]*>/g," ");
    return {name:effect.name, summary, details: [
      ...(r.senses ?? []).map(localize), ...(r.capabilities ?? []).map(localize), ...(r.immunities ?? []).map(localize),
      ...["noParry","noDodge","ignoreWounds","ignoreFear"].filter(key=>r[key]).map(key=>localize(`TRUDVANG.Effect.Profile.${key}`)),
      ...(r.heightBonus?[`${localize("TRUDVANG.Effect.Profile.heightBonus")} +${r.heightBonus} m`]:[]),
      ...(r.weightBonus?[`${localize("TRUDVANG.Effect.Profile.weightBonus")} +${r.weightBonus} kg`]:[])
    ].join(" · ")};
  });
  return {temporaryHP, temporaryHint, movement, immunity, notes};
}
