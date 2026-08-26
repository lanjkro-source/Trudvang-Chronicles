import { renderTemplate } from "../helpers.mjs";

const BaseItem = foundry.documents.Item;

export class TrudvangItem extends BaseItem {
  async roll() {
    if (this.actor) return this.actor.rollItem(this);
    return this.toChat();
  }

  async toChat() {
    const content = await renderTemplate("systems/trudvang-chronicles/templates/chat/item-card.hbs", {
      item: this,
      system: this.system,
      canApplyEffects: this.effects.some(effect => !effect.transfer && !effect.disabled),
      description: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.system.description || "", {async: true})
    });
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      content
    });
  }

  async applyEffects(targets = null) {
    const templates = this.effects.filter(effect => !effect.transfer && !effect.disabled && !effect.duration?.expired);
    if (!templates.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoApplicableEffects"));
    const candidates = targets ? Array.from(targets) : Array.from(game.user.targets || []);
    if (!candidates.length && this.actor) candidates.push(this.actor);
    const actors = [...new Set(candidates.map(target => target?.actor ?? target).filter(actor => actor?.documentName === "Actor"))];
    if (!actors.length) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.NoEffectTarget"));
    let applied = 0;
    for (const actor of actors) {
      if (!actor.canUserModify(game.user, "update")) continue;
      for (const template of templates) {
        const data = template.toObject();
        delete data._id;
        data.type = "effect";
        data.origin = this.uuid;
        data.transfer = false;
        data.start = null;
        data.duration = {...(data.duration || {}), expired: false};
        data.system ??= {};
        if (!data.system.stackId && data.system.stacking !== "stack") data.system.stackId = `${this.uuid}:${template.name}`;
        if (await actor.createTrudvangEffect(data)) applied += 1;
      }
    }
    if (!applied) return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.EffectPermission"));
    ui.notifications.info(game.i18n.format("TRUDVANG.Notification.EffectsApplied", {count: applied}));
    return applied;
  }
}
