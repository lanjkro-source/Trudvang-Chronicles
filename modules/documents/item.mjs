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
      description: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.system.description || "", {async: true})
    });
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      content
    });
  }
}
