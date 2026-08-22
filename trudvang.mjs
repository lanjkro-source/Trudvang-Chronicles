import { TRUDVANG } from "./modules/config.mjs";
import { TrudvangActor } from "./modules/documents/actor.mjs";
import { TrudvangItem } from "./modules/documents/item.mjs";
import { TrudvangCharacterSheet, TrudvangNpcSheet } from "./modules/sheets/actor-sheet.mjs";
import { TrudvangItemSheet } from "./modules/sheets/item-sheet.mjs";
import { registerHandlebarsHelpers } from "./modules/helpers.mjs";
import { importStarterContent } from "./modules/content-importer.mjs";
import { registerChatListeners } from "./modules/chat.mjs";
import { ACTOR_DATA_MODELS, ITEM_DATA_MODELS } from "./modules/data-models.mjs";

Hooks.once("init", () => {
  console.info("Trudvang Chronicles | Initializing");
  CONFIG.TRUDVANG = TRUDVANG;
  Object.assign(CONFIG.Actor.dataModels, ACTOR_DATA_MODELS);
  Object.assign(CONFIG.Item.dataModels, ITEM_DATA_MODELS);
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["resources.body", "resources.combat", "resources.vitner", "resources.divinity"],
      value: ["resources.raud.value", "resources.fear.value"]
    },
    npc: {
      bar: ["resources.body", "resources.combat"],
      value: ["resources.fear.value"]
    }
  };
  CONFIG.Actor.documentClass = TrudvangActor;
  CONFIG.Item.documentClass = TrudvangItem;

  const actorSheet = foundry.appv1?.sheets?.ActorSheet ?? globalThis.ActorSheet;
  const itemSheet = foundry.appv1?.sheets?.ItemSheet ?? globalThis.ItemSheet;
  const ActorSheets = foundry.documents.collections.Actors;
  const ItemSheets = foundry.documents.collections.Items;
  ActorSheets.unregisterSheet("core", actorSheet);
  ActorSheets.registerSheet("trudvang-chronicles", TrudvangCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TRUDVANG.Sheets.Character"
  });
  ActorSheets.registerSheet("trudvang-chronicles", TrudvangNpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "TRUDVANG.Sheets.Npc"
  });
  ItemSheets.unregisterSheet("core", itemSheet);
  ItemSheets.registerSheet("trudvang-chronicles", TrudvangItemSheet, {
    makeDefault: true,
    label: "TRUDVANG.Sheets.Item"
  });

  game.settings.register("trudvang-chronicles", "starterContentVersion", {
    name: "TRUDVANG.Settings.StarterContentName",
    hint: "TRUDVANG.Settings.StarterContentHint",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
  game.settings.register("trudvang-chronicles", "starterContentLocale", {
    name: "TRUDVANG.Settings.StarterContentName",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  registerHandlebarsHelpers();

  const FormApplicationClass = foundry.appv1?.api?.FormApplication ?? globalThis.FormApplication;
  class ReimportMenu extends FormApplicationClass {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "trudvang-reimport",
        title: game.i18n.localize("TRUDVANG.Settings.ReimportTitle"),
        template: "systems/trudvang-chronicles/templates/app/reimport-menu.hbs",
        width: 470
      });
    }
    getData() { return {}; }
    async _updateObject() {
      return importStarterContent({force: true});
    }
  }
  try {
    game.settings.registerMenu("trudvang-chronicles", "reimportStarter", {
      name: "TRUDVANG.Settings.ReimportName",
      hint: "TRUDVANG.Settings.ReimportHint",
      icon: "fas fa-recycle",
      type: ReimportMenu,
      restricted: true
    });
  } catch (error) {
    console.error("Trudvang Chronicles | Could not register the starter-content reimport menu", error);
  }
});

Hooks.once("ready", async () => {
  registerChatListeners();
  if (game.user.isGM) {
    const traitKeys = Object.keys(TRUDVANG.traits);
    const affected = game.actors.filter(actor => actor.type === "character"
      && traitKeys.every(key => Number(actor.system.traits?.[key]) === -4)
      && Number(actor.system.experience?.creationSpent || 0) <= 0);
    for (const actor of affected) {
      const changes = Object.fromEntries(traitKeys.map(key => [`system.traits.${key}`, 0]));
      await actor.update(changes);
    }
    if (affected.length) ui.notifications.info(game.i18n.format("TRUDVANG.Notification.InvalidTraitsRepaired", {count: affected.length}));
    for (const actor of game.actors.filter(actor => actor.type === "character" && actor.system.experience?.creationMode)) await actor.syncCreationDefaults();
    try {
      await importStarterContent();
    } catch (error) {
      console.error("Trudvang Chronicles | Starter content import crashed outside its own guard", error);
    }
  }
});
