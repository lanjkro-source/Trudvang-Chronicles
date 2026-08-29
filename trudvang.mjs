import { TRUDVANG } from "./modules/config.mjs";
import { TrudvangActor } from "./modules/documents/actor.mjs";
import { TrudvangItem } from "./modules/documents/item.mjs";
import { TrudvangCharacterSheet, TrudvangNpcSheet } from "./modules/sheets/actor-sheet.mjs";
import { TrudvangItemSheet } from "./modules/sheets/item-sheet.mjs";
import { TrudvangEffectSheet } from "./modules/sheets/effect-sheet.mjs";
import { registerHandlebarsHelpers } from "./modules/helpers.mjs";
import { importStarterContent, repairKnowledgePacks, syncImportedKnowledgeItems } from "./modules/content-importer.mjs";
import { registerChatListeners } from "./modules/chat.mjs";
import { ACTOR_DATA_MODELS, ITEM_DATA_MODELS } from "./modules/data-models.mjs";
import { configureEffects, registerEffectHooks } from "./modules/effects.mjs";
import { applyPalette } from "./modules/palette.mjs";

Hooks.once("init", () => {
  console.info("Trudvang Chronicles | Initializing");
  CONFIG.TRUDVANG = TRUDVANG;
  configureEffects();
  registerEffectHooks();
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

  // Actor sheets — ApplicationV2
  const DocumentSheetConfig = foundry.applications?.apps?.DocumentSheetConfig;
  if (DocumentSheetConfig) {
    DocumentSheetConfig.registerSheet(foundry.documents.ActiveEffect, "trudvang-chronicles", TrudvangEffectSheet, {
      types: ["effect"],
      makeDefault: true,
      label: "TRUDVANG.Sheets.Effect"
    });
    DocumentSheetConfig.registerSheet(foundry.documents.Actor, "trudvang-chronicles", TrudvangCharacterSheet, {
      types: ["character"],
      makeDefault: true,
      label: "TRUDVANG.Sheets.Character"
    });
    DocumentSheetConfig.registerSheet(foundry.documents.Actor, "trudvang-chronicles", TrudvangNpcSheet, {
      types: ["npc"],
      makeDefault: true,
      label: "TRUDVANG.Sheets.Npc"
    });
  } else {
    // Fallback for V14 compatibility
    const actorSheet = foundry.appv1?.sheets?.ActorSheet ?? globalThis.ActorSheet;
    const ActorSheets = foundry.documents.collections.Actors;
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
  }

  // Item sheet — ApplicationV2
  if (DocumentSheetConfig) {
    DocumentSheetConfig.registerSheet(foundry.documents.Item, "trudvang-chronicles", TrudvangItemSheet, {
      makeDefault: true,
      label: "TRUDVANG.Sheets.Item"
    });
  } else {
    // Fallback for V14 compatibility
    const itemSheet = foundry.appv1?.sheets?.ItemSheet ?? globalThis.ItemSheet;
    const ItemSheets = foundry.documents.collections.Items;
    ItemSheets.unregisterSheet("core", itemSheet);
    ItemSheets.registerSheet("trudvang-chronicles", TrudvangItemSheet, {
      makeDefault: true,
      label: "TRUDVANG.Sheets.Item"
    });
  }

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
  game.settings.register("trudvang-chronicles", "knowledgeSyncVersion", {
    name: "TRUDVANG.Settings.StarterContentName",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
  game.settings.register("trudvang-chronicles", "colorPalette", {
    name: "TRUDVANG.Settings.PaletteName",
    hint: "TRUDVANG.Settings.PaletteHint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      default: "TRUDVANG.Settings.PaletteDefault",
      summer: "TRUDVANG.Settings.PaletteSummer",
      winter: "TRUDVANG.Settings.PaletteWinter"
    },
    default: "default",
    onChange: value => applyPalette(value)
  });

  applyPalette(game.settings.get("trudvang-chronicles", "colorPalette"));

  registerHandlebarsHelpers();

  const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

  class ReimportMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "trudvang-reimport",
      tag: "form",
      classes: ["trudvang", "settings-menu"],
      position: { width: 470 },
      window: { title: "TRUDVANG.Settings.ReimportTitle" },
      form: {
        handler: ReimportMenu.#onSubmit,
        submitOnChange: false,
        closeOnSubmit: true
      }
    };
    static PARTS = {
      main: { template: "systems/trudvang-chronicles/templates/app/reimport-menu.hbs" }
    };
    async _prepareContext() {
      return {};
    }
    static async #onSubmit(event, form, formData, submitOptions) {
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

  class RebuildPacksMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "trudvang-rebuild-packs",
      tag: "form",
      classes: ["trudvang", "settings-menu"],
      position: { width: 470 },
      window: { title: "TRUDVANG.Settings.RebuildPacksTitle" },
      form: {
        handler: RebuildPacksMenu.#onSubmit,
        submitOnChange: false,
        closeOnSubmit: true
      }
    };
    static PARTS = {
      main: { template: "systems/trudvang-chronicles/templates/app/rebuild-packs-menu.hbs" }
    };
    async _prepareContext() {
      return {};
    }
    static async #onSubmit(event, form, formData, submitOptions) {
      return repairKnowledgePacks();
    }
  }
  try {
    game.settings.registerMenu("trudvang-chronicles", "rebuildKnowledgePacks", {
      name: "TRUDVANG.Settings.RebuildPacksName",
      hint: "TRUDVANG.Settings.RebuildPacksHint",
      icon: "fas fa-book-bookmark",
      type: RebuildPacksMenu,
      restricted: true
    });
  } catch (error) {
    console.error("Trudvang Chronicles | Could not register the compendium rebuild menu", error);
  }
});

Hooks.once("ready", async () => {
  applyPalette(game.settings.get("trudvang-chronicles", "colorPalette"));
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
    try {
      await syncImportedKnowledgeItems();
    } catch (error) {
      console.error("Trudvang Chronicles | Knowledge import sync crashed outside its own guard", error);
    }
  }
});
