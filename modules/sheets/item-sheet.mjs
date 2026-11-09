import {damageQualificationFields} from "../damage-icons.mjs";
import {damageQualification} from "../rules/damage-qualifications.mjs";
import { TRUDVANG } from "../config.mjs";
import { EFFECT_ITEM_TYPES, effectTooltipSummary } from "../effects.mjs";
import {effectDurationSeconds,itemEffectRemainingSeconds} from "../rules/effect-duration.mjs";
import { prepareEquipmentInspection, showEquipmentStatDetail } from "../equipment-inspection.mjs";
import { canThrowWeapon, categoryForWeaponType, isThrowingWeapon, readiedHandConflicts, weaponType, weaponUsesSeparateHands } from "../rules/combat-pool-resolver.mjs";
import { resolveThrowingRange } from "../rules/equipment-resolver.mjs";
import { rollPackageAvailability } from "../package-roll.mjs";
import { TABLET_BY_ID, getPowerSummary, powerName } from "../tablet-catalog.mjs";
import { findTabletPower } from "../tablet-power-links.mjs";
import { affinityState, VITNER_AFFINITY_TYPES } from "../rules/tablet-affinity.mjs";
import {activeSpellCosts} from "../rules/active-spell-resolver.mjs";
import {powerIconClassForId, powerIconClassForItem} from "../power-icons.mjs";
import {annotateRuleTestDescription, performRuleTest} from "../rule-tests.mjs";
import {bindTitleSharing, bindSheetListMenus} from "../chat-sharing.mjs";
import {spellActorForItem,spellAvailability} from "../rules/spell-availability.mjs";
import {knowledgeProcedureDescription, performKnowledgeProcedure} from "../knowledge-procedures.mjs";
import {performTrainedAnimalAction} from "../trained-animal-actions.mjs";
import {isCarriedTransferredEffect} from "../effects-summary.mjs";
import {customTabletPower,customTabletChild} from "../rules/custom-tablet.mjs";
import {itemEffectEditState,intrinsicItemSheetUpdate,itemProtectionModifiers} from "../rules/item-magic.mjs";
import {ITEM_QUALITIES,itemQuality,intrinsicQualityUpdate} from "../rules/item-quality.mjs";

const isCustomTablet = item => item.type === "tablet" && !TABLET_BY_ID.has(item.system.catalogId || item.getFlag?.("trudvang-chronicles", "catalogId"));

const magicSheets=new Set();
const effectSheets=new Set();
export function itemEffectDurationLabel(effect,{time=Number(game.time?.worldTime),combat=game.combat}={}){
  const duration=effect._source?.duration ?? effect.duration;
  const total=effectDurationSeconds(duration);
  const remaining=itemEffectRemainingSeconds(effect,{time,combat});
  const unitSeconds=total!==null && Number(duration?.value)>0 ? total/Number(duration.value) : null;
  return effect.flags?.["trudvang-chronicles"]?.transformation?.resolved && unitSeconds
    ? `${Math.ceil(remaining/unitSeconds)} ${game.i18n.localize(`EFFECT.DURATION.UNITS.${duration.units}`)}`
    : effect.duration?.label || game.i18n.localize("TRUDVANG.Effect.Permanent");
}
export function registerMagicSheetAvailabilityHooks(){
  const refresh=()=>{for(const sheet of magicSheets)sheet.refreshMagicCastingButton();};
  for(const hook of ["controlToken","updateUser","updateActor","createItem","updateItem","deleteItem","createActiveEffect","updateActiveEffect","deleteActiveEffect"])Hooks.on(hook,refresh);
  Hooks.on("updateWorldTime",()=>{for(const sheet of effectSheets)sheet.refreshEffectDurations();});
  for(const hook of ["combatTurnChange","updateCombat"])Hooks.on(hook,combat=>{for(const sheet of effectSheets)sheet.refreshEffectDurations(combat);});
}

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;

export class TrudvangItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  get levelManaged() {
    return this.item.parent?.type === "character" && ["ability", "tablet"].includes(this.item.type);
  }

  get advancementLocked() {
    return this.item.parent?.type === "character"
      && ["ability", "tablet"].includes(this.item.type)
      && !this.item.parent.system.experience?.creationMode
      && Number(this.item.system.level || 0) > 0;
  }

  get structuralLocked() {
    return this.item.type === "ability" && Boolean(this.item.system.catalogId);
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["trudvang", "sheet", "item"],
    position: { width: 640, height: 700 },
    window: {resizable: true},
    form: {
      handler: TrudvangItemSheet.#onSubmit,
      submitOnChange: true,
      closeOnSubmit: false
    },
    actions: {
      roll: TrudvangItemSheet.#onRoll,
      "delete-item": TrudvangItemSheet.#onDeleteItem,
      "effect-add": TrudvangItemSheet.#onEffectAdd,
      "effect-edit": TrudvangItemSheet.#onEffectEdit,
      "effect-toggle": TrudvangItemSheet.#onEffectToggle,
      "effect-delete": TrudvangItemSheet.#onEffectDelete,
      "apply-effects": TrudvangItemSheet.#onApplyEffects,
      "inspect-equipment-stat": TrudvangItemSheet.#onInspectEquipmentStat,
      "tablet-power-open": TrudvangItemSheet.#onTabletPowerOpen,
      "tablet-power-remove": TrudvangItemSheet.#onTabletPowerRemove,
      "roll-rule-test": TrudvangItemSheet.#onRollRuleTest,
      "knowledge-procedure": function() { return performKnowledgeProcedure(this.item); },
      "trained-animal-action": function(event, target) { return performTrainedAnimalAction(this.item, target.dataset.trainingAction); }
    }
  };

  static PARTS = {
    main: {template: "systems/trudvang-chronicles/templates/item/item-sheet.hbs",
      scrollable: [".item-sheet-body > .tab", ".item-description .editor-content"]}
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.editable = this.isEditable && this.item.isOwner;
    context.system = this.item.system;
    // Show the object's current values, without including bonuses to its bearer.
    // Translate the edited values back to intrinsic data only when submitting.
    this._itemEffectEditState=itemEffectEditState(this.item);
    if(['weapon','shield','armor','gear','potion'].includes(this.item.type)){
      context.system=this.item.system.toObject?.(false)??{...this.item.system};
      context.system.protection=Math.max(0,Number(this.item.system.protection||0)+itemProtectionModifiers(this.item).reduce((sum,row)=>sum+row.amount,0));
      context.qualityOptions=ITEM_QUALITIES.map(row=>({...row,label:game.i18n.localize(`TRUDVANG.Quality.${row.key}`),selected:row.id===itemQuality(context.system.quality).id}));
      context.qualityLocked=this._itemEffectEditState.some(row=>row.key==='system.quality');
    }
    context.armorMaterialOptions = [...new Set([...Object.keys(TRUDVANG.weaponMaterials), "grindsilver", this.item.system.material || ""])].map(value => ({value,label:value ? game.i18n.localize(`TRUDVANG.Damage.Material.${value}`) : game.i18n.localize("TRUDVANG.Damage.Material.unknown"),selected:value===this.item.system.material}));
    context.damageQualificationsOpen = this.element?.querySelector?.("details.damage-qualification-settings")?.open ?? false;
    context.damageQualificationNote = this.item.system.damageQualificationNote;
    context.damageQualificationFields = ["weapon", "shield", "spell", "divineFeat"].includes(this.item.type) ? damageQualificationFields(damageQualification({item:this.item,usage:["spell","divineFeat"].includes(this.item.type)?"magic":""}), {item:true,material:["weapon","shield"].includes(this.item.type),open:context.damageQualificationsOpen,note:context.damageQualificationNote}) : "";
    context.itemType = this.item.type;
    context.supportsEffects = this.item.type === "effect" || EFFECT_ITEM_TYPES.has(this.item.type);
    context.weaponType = weaponType(this.item);
    context.isRangedWeapon = ["crossbow", "bowsSlings"].includes(context.weaponType);
    context.isThrowingWeapon = isThrowingWeapon(this.item);
    context.canBeThrown = canThrowWeapon(this.item);
    context.throwingRange = context.isThrowingWeapon ? resolveThrowingRange({item: this.item, actor: this.item.parent}) : null;
    context.usesSeparateHands = weaponUsesSeparateHands(this.item);
    context.isType = type => this.item.type === type;
    context.config = TRUDVANG;
    context.advancementLocked = this.advancementLocked;
    context.effects = context.supportsEffects ? this.item.effects.map(effect => {
      const summary=effectTooltipSummary(effect);
      const durationLabel=itemEffectDurationLabel(effect);
      return ({
      id: effect.id,
      name: effect.name,
      img: effect.img,
      transfer: effect.transfer,
      canDelete: !isCarriedTransferredEffect(effect),
      activationLabel: effect.transfer ? game.i18n.localize(`TRUDVANG.Effect.Activation.${effect.system?.activation === "inventory" ? "inventory" : "equipped"}`) : summary,
      duration: durationLabel,
      disabled: effect.disabled,
      summary
    });}) : [];
    context.canApplyEffects = context.effects.some(effect => !effect.transfer && !effect.disabled);
    context.isMagicPower = ["spell", "divineFeat"].includes(this.item.type);
    context.powerIconClass = context.isMagicPower ? powerIconClassForItem(this.item) : null;
    context.isRunePower = context.isMagicPower && Boolean(this.item.system.isRune);
    if(context.isMagicPower){
      const availability=spellAvailability(spellActorForItem(this.item),this.item);
      context.canLaunchMagic=availability.ok;
      context.magicLaunchHint=availability.ok?game.i18n.localize("TRUDVANG.Action.Use"):game.i18n.format(availability.reason,availability.data);
    }
    context.isPersistentSpell = this.item.type === "spell" && this.item.system.spellType === "lasting";
    const activeCosts = context.isPersistentSpell && this.item.parent?.documentName === "Actor"
      ? activeSpellCosts(this.item.parent, this.item) : [];
    context.activeSpellSummary = activeCosts.length ? game.i18n.format(
      activeCosts.length === 1 ? "TRUDVANG.Field.ActiveSpellCostsOne" : "TRUDVANG.Field.ActiveSpellCostsMany",
      {count: activeCosts.length, costs: activeCosts.map(cost => `${cost} ${game.i18n.localize("TRUDVANG.Unit.VitnerPointsShort")}`).join(", ")}
    ) : "";
    context.powerLevelRows = context.isMagicPower ? Array.from(this.item.system.powerLevels ?? [], (entry, index) => {
      const level = entry.toObject?.() ?? entry;
      return {
        ...level,
        displayLevel: index + 1,
        maxCountDisplay: level.maxCount == null ? "-" : level.maxCount
      };
    }) : [];
    context.equipmentInspection = this.item.parent?.documentName === "Actor" ? prepareEquipmentInspection(this.item) : null;
    context.hasModifiers = Boolean(context.equipmentInspection);
    context.isEmbeddedTablet = this.item.type === "tablet" && this.item.parent?.documentName === "Actor";
    context.isThuulRune = this.item.type === "tablet" && this.item.system.religion === "thuuldom";
    context.tabletReligion = this.item.type === "tablet" && this.item.system.religion
      ? game.i18n.localize(TRUDVANG.religions[this.item.system.religion]?.label ?? `TRUDVANG.Religion.${this.item.system.religion}`) : "";
    context.tabletReligionOptions = this.item.type === "tablet" ? Object.entries(TRUDVANG.religions).map(([id, religion]) => ({
      id, label: game.i18n.localize(religion.label), selected: id === this.item.system.religion
    })) : [];
    context.tabletAffinities = this.item.type === "tablet" && this.item.system.tabletType === "vitner"
      ? VITNER_AFFINITY_TYPES.map(type => {
        const value = Number(this.item.system.affinity?.[type] ?? 0);
        const state = affinityState(value);
        return {type, value, state, short: game.i18n.localize(`TRUDVANG.Tablet.AffinityShort.${type}`),
          label: game.i18n.localize(`TRUDVANG.Tablet.AffinityName.${type}`),
          detail: game.i18n.localize(`TRUDVANG.Tablet.AffinityEffect.${state}`),
          options: [-1, 0, 1, 2].map(option => ({value: option,
            label: ({"-1": "−1", "0": "=", "1": "+1", "2": "×2"})[option], selected: option === value}))};
      }) : [];
    const tabletId = this.item.system.catalogId || this.item.getFlag("trudvang-chronicles", "catalogId");
    const catalogTablet = this.item.type === "tablet" ? TABLET_BY_ID.get(tabletId) : null;
    context.customTablet=this.item.type==="tablet"&&!catalogTablet;
    context.tabletPowerGroups = catalogTablet ? Array.from({length: context.isThuulRune ? 1 : 5}, (_, index) => ({
      level: index + 1,
      accessible: !context.isEmbeddedTablet || Number(this.item.system.level || 0) >= index + 1,
      powers: catalogTablet.powers.filter(power => power.level === index + 1).map(power => ({
        catalogId: power.id, name: powerName(power), summary: getPowerSummary(power), iconClass: powerIconClassForId(power.id)
      }))
    })).filter(group => group.powers.length) : context.customTablet ? Array.from({length:5},(_,index)=>({level:index+1,accessible:true,powers:Array.from(this.item.system.customPowers??[]).filter(entry=>Number(entry.level)===index+1).map(entry=>({customId:entry.id,name:entry.data?.name,summary:entry.data?.system?.summary,iconClass:powerIconClassForItem(entry.data),level:entry.level,levelOptions:[1,2,3,4,5].map(value=>({value,selected:value===Number(entry.level)}))}))})).filter(group=>group.powers.length) : [];
    context.hasItemTabs = context.supportsEffects || context.hasModifiers || context.customTablet || context.tabletPowerGroups.length > 0;
    context.enrichedDescription = knowledgeProcedureDescription(annotateRuleTestDescription(
      await TextEditorImpl.enrichHTML(this.item.system.description || "", {async: true, secrets: this.item.isOwner}), this.item), this.item);
    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    bindTitleSharing(this);
    bindSheetListMenus(this);
    if(["spell","divineFeat"].includes(this.item.type)){magicSheets.add(this);this.refreshMagicCastingButton();}
    if(context.supportsEffects)effectSheets.add(this);
    const root = this.element;
    if (root?.addEventListener && this._transformationDropRoot !== root) {
      this._transformationDropRoot = root;
      root.addEventListener("dragover", event => {
        if ((this.item.type==="tablet"&&!TABLET_BY_ID.has(this.item.system.catalogId)&&event.target.closest?.('[data-tab="tablet-powers"]')) || (EFFECT_ITEM_TYPES.has(this.item.type) && this.item.parent?.documentName === "Actor")) event.preventDefault();
      });
      root.addEventListener("drop", event => {
        let data; try { data = JSON.parse(event.dataTransfer?.getData("text/plain") || "null"); } catch { return; }
        const customTabletDrop=isCustomTablet(this.item)&&data?.type==="Item"&&event.target.closest?.('[data-tab="tablet-powers"]');
        if (data?.type !== "TrudvangTransformation"&&!customTabletDrop) return;
        event.preventDefault(); event.stopImmediatePropagation();
        void this._onDrop(event).catch(error => ui.notifications.error(error.message));
      }, {capture: true});
      root.addEventListener("change",event=>{const control=event.target.closest?.("[data-tablet-power-level]");if(control){event.stopPropagation();void this.changeCustomPowerLevel(control.dataset.tabletPowerLevel,control.value);}},{capture:true});
    }
    if (!this.isEditable || !this.item.isOwner) {
      root.querySelectorAll("input, select, textarea, prose-mirror").forEach(element => element.setAttribute("disabled", "disabled"));
    }
    if (this.levelManaged) root.querySelector("[name='system.level']")?.setAttribute("disabled", "disabled");
    if(isCustomTablet(this.item)&&this.item.system.customPowers?.length){
      const typeControl=root.querySelector("[name='system.tabletType']");
      if(typeControl){typeControl.disabled=true;typeControl.title=game.i18n.localize("TRUDVANG.Tablet.EmptyBeforeTypeChange");}
    }
    if (this.structuralLocked) {
      for (const name of ["system.kind", "system.parentSkill", "system.parentDiscipline", "system.costTrait", "system.level"]) {
        root.querySelector(`[name='${name}']`)?.setAttribute("disabled", "disabled");
      }
    }
    if (this.advancementLocked) {
      for (const name of ["system.kind", "system.parentSkill", "system.parentDiscipline", "system.costTrait", "system.tabletType"]) {
        root.querySelector(`[name='${name}']`)?.setAttribute("disabled", "disabled");
      }
    }
    root.querySelectorAll("textarea.potion-auto-size").forEach(textarea => {
      const resize = () => {
        const maximum = Number(textarea.dataset.maxHeight || 76);
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, maximum)}px`;
        textarea.style.overflowY = textarea.scrollHeight > maximum ? "auto" : "hidden";
      };
      resize();
      textarea.addEventListener("input", resize);
    });
    root.querySelectorAll(".package-availability-roll").forEach(control => {
      const rollAvailability = async event => {
        event.preventDefault();
        event.stopPropagation();
        const situationValue = Number(control.dataset.packageSv ?? control.textContent.match(/\bSV\s+(\d+)/i)?.[1]);
        await rollPackageAvailability(this.item, situationValue);
      };
      control.addEventListener("click", rollAvailability);
      control.addEventListener("keydown", event => {
        if (["Enter", " "].includes(event.key)) rollAvailability(event);
      });
    });
    this._activateTabs(root);
  }

  async _onDrop(event) {
    let data;try{data=JSON.parse(event.dataTransfer?.getData("text/plain")||"null");}catch{}
    if(data?.type==="Item"&&isCustomTablet(this.item)&&event.target.closest?.('[data-tab="tablet-powers"]')){
      if(!this.isEditable||!this.item.isOwner)return null;
      const item=await foundry.documents.Item.implementation.fromDropData(data);
      if(!["spell","divineFeat"].includes(item?.type))return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TabletPowerType"));
      const entries=Array.from(this.item.system.customPowers??[],entry=>structuredClone(entry));
      if(entries.some(entry=>entry.sourceUuid&&entry.sourceUuid===item.uuid))return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TabletPowerDuplicate"));
      const entry=customTabletPower(item,foundry.utils.randomID(),this.item.system.tabletType),tabletId=this.item.system.catalogId||`custom:${this.item.id}`;
      const actor=this.item.parent?.documentName==="Actor"?this.item.parent:null;
      const created=actor?await actor.createEmbeddedDocuments("Item",[customTabletChild(entry,tabletId,this.item.name)]):null;
      if(actor&&!created?.length)return null;
      try{return await this.item.update({"system.catalogId":tabletId,"system.customPowers":[...entries,entry]});}
      catch(error){if(created?.length)await actor.deleteEmbeddedDocuments("Item",created.map(child=>child.id));throw error;}
    }
    if(data?.type==="TrudvangTransformation"&&EFFECT_ITEM_TYPES.has(this.item.type)&&this.item.parent?.documentName==="Actor"){
      const {applyTransformation}=await import("../transformations.mjs");
      const {effectTargetsFor}=await import("../effect-targets.mjs");
      const source=data.sourceUuid?await foundry.utils.fromUuid(data.sourceUuid):null;
      const message=data.context?.messageId?game.messages?.get(data.context.messageId):null;
      const row=message?effectTargetsFor(message,data.key).find(target=>target.actorUuid===this.item.parent.uuid):null;
      return applyTransformation(this.item.parent,data.key,{source,counts:data.counts??[],context:data.context,destinationItem:this.item,targetName:this.item.name,delegateTokenUuid:row?.tokenUuid??""});
    }
    return super._onDrop?.(event);
  }

  refreshMagicCastingButton(){
    const button=this.element?.querySelector?.("[data-action='roll']");if(!button)return;
    const availability=spellAvailability(spellActorForItem(this.item),this.item);
    button.disabled=!availability.ok;
    button.title=availability.ok?game.i18n.localize("TRUDVANG.Action.Use"):game.i18n.format(availability.reason,availability.data);
  }

  refreshEffectDurations(combat=game.combat){
    for(const row of this.element?.querySelectorAll?.("[data-effect-id]")??[]){
      const effect=Array.from(this.item.effects??[]).find(entry=>entry.id===row.dataset.effectId);
      const label=row.querySelector(".effect-duration-value");
      if(effect&&label)label.textContent=itemEffectDurationLabel(effect,{combat});
    }
  }
  async close(options){magicSheets.delete(this);effectSheets.delete(this);return super.close(options);}

  _activateTabs(root) {
    const nav = root.querySelector(".item-sheet-tabs");
    if (!nav) return;
    this._activeTab ??= "details";
    const apply = () => {
      nav.querySelectorAll("[data-tab]").forEach(link => link.classList.toggle("active", link.dataset.tab === this._activeTab));
      root.querySelectorAll(".item-sheet-body > .tab[data-tab]").forEach(panel => {
        panel.classList.toggle("active", panel.dataset.tab === this._activeTab);
        panel.style.display = panel.dataset.tab === this._activeTab ? "" : "none";
      });
    };
    apply();
    nav.addEventListener("click", event => {
      const link = event.target.closest("[data-tab]");
      if (!link || !nav.contains(link)) return;
      event.preventDefault();
      this._activeTab = link.dataset.tab;
      apply();
    });
  }

  static async #onSubmit(event, form, formData) {
    if (!this.isEditable || !this.item.isOwner) return;
    const updateData = intrinsicQualityUpdate(this.item,intrinsicItemSheetUpdate(foundry.utils.expandObject(formData.object),this._itemEffectEditState));
    const editedLevels = updateData.system?.powerLevels;
    if (editedLevels && !Array.isArray(editedLevels)) {
      updateData.system.powerLevels = Array.from(this.item.system.powerLevels ?? [], (level, index) => {
        const values = editedLevels[index] ?? {};
        return {...(level.toObject?.() ?? level), ...values,
          maxCount: values.maxCount === "" ? null : (values.maxCount ?? level.maxCount)};
      });
    }
    if (this.item.type === "weapon") {
      const type = foundry.utils.getProperty(updateData, "system.combatSpecialty")
        ?? formData.object["system.combatSpecialty"]
        ?? formData.get?.("system.combatSpecialty");
      if (type && type !== "throwingWeapons") foundry.utils.setProperty(updateData, "system.category", categoryForWeaponType(type, this.item.system.category));
      const hand = foundry.utils.getProperty(updateData, "system.hand")
        ?? formData.object["system.hand"]
        ?? formData.get?.("system.hand");
      if (["weapon", "offHand"].includes(hand)) foundry.utils.setProperty(updateData, "system.hand", hand);
    }
    if (["weapon", "shield"].includes(this.item.type) && this.item.parent?.documentName === "Actor") {
      const candidate = {
        id: this.item.id,
        type: this.item.type,
        system: {...this.item.system.toObject(), ...(updateData.system || {})}
      };
      if (candidate.system.equipped) {
        const conflicts = readiedHandConflicts(this.item.parent.items, candidate);
        if (conflicts.length) {
          ui.notifications.warn(game.i18n.format("TRUDVANG.Warning.HandsOccupied", {
            item: this.item.name,
            conflicts: conflicts.map(conflict => conflict.name).join(", ")
          }));
          return this.render({force: true});
        }
      }
    }
    await this.document.update(updateData);
  }

  static async #onRoll(event, target) {
    event.preventDefault();
    if(["spell","divineFeat"].includes(this.item.type)){
      const actor=spellActorForItem(this.item),availability=spellAvailability(actor,this.item);
      if(!availability.ok)return ui.notifications.warn(game.i18n.format(availability.reason,availability.data));
      return actor.rollSpell(this.item);
    }
    await this.item.roll();
  }

  static async #onRollRuleTest(event, target) {
    event.preventDefault();
    return performRuleTest({document: this.item, index: target.dataset.testIndex});
  }

  static async #onTabletPowerOpen(event, target) {
    event.preventDefault();
    if(target.dataset.customId){
      const entry=Array.from(this.item.system.customPowers??[]).find(row=>row.id===target.dataset.customId);
      const actor=this.item.parent?.documentName==="Actor"?this.item.parent:null;
      const child=actor?.items.find(item=>item.flags?.["trudvang-chronicles"]?.customTabletPower===entry?.id&&item.system.tabletId===this.item.system.catalogId);
      const source=entry?.sourceUuid?await foundry.utils.fromUuid(entry.sourceUuid):null;
      const power=child??(source?.type===entry?.data?.type?source:null)??(entry?.data?foundry.documents.Item.implementation.fromSource(entry.data):null);
      if(power)return power.sheet.render({force:true});
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TabletPowerMissing"));
    }
    const catalogId = target.dataset.catalogId;
    if (!catalogId) return;
    const power = await findTabletPower({tablet: this.item, catalogId,
      packs: game.packs, worldItems: game.items, language: game.i18n.lang});
    if (power) return power.sheet.render({force: true});
    return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.TabletPowerMissing"));
  }

  async changeCustomPowerLevel(id,value){
    if(!isCustomTablet(this.item)||!this.isEditable||!this.item.isOwner||!Number.isInteger(Number(value))||Number(value)<1||Number(value)>5)return null;
    const entries=Array.from(this.item.system.customPowers??[],entry=>structuredClone(entry)),entry=entries.find(row=>row.id===id);if(!entry)return null;
    entry.level=Number(value);const actor=this.item.parent?.documentName==="Actor"?this.item.parent:null;
    const child=actor?.items.find(item=>item.flags?.["trudvang-chronicles"]?.customTabletPower===id&&item.system.tabletId===this.item.system.catalogId);
    if(child)await child.update({"system.level":entry.level});
    return this.item.update({"system.customPowers":entries});
  }

  static async #onTabletPowerRemove(event,target){
    event.preventDefault();if(!isCustomTablet(this.item)||!this.isEditable||!this.item.isOwner)return null;
    const id=target.dataset.customId,entries=Array.from(this.item.system.customPowers??[],entry=>structuredClone(entry));
    if(!entries.some(entry=>entry.id===id))return null;
    const actor=this.item.parent?.documentName==="Actor"?this.item.parent:null;
    const child=actor?.items.find(item=>item.flags?.["trudvang-chronicles"]?.customTabletPower===id&&item.system.tabletId===this.item.system.catalogId);
    if(child)await child.delete();
    return this.item.update({"system.customPowers":entries.filter(entry=>entry.id!==id)});
  }

  static async #onDeleteItem(event, target) {
    const parent = this.item.parent;
    if (parent?.type === "character" && !parent.system.experience?.creationMode) {
      return ui.notifications.warn(game.i18n.localize("TRUDVANG.Warning.CreationModeRequired"));
    }
    await this.item.delete();
    await this.close();
  }

  static async #onEffectAdd() {
    if (!EFFECT_ITEM_TYPES.has(this.item.type)) return;
    const [effect] = await this.item.createEmbeddedDocuments("ActiveEffect", [{
      name: game.i18n.localize("TRUDVANG.New.Effect"),
      type: "effect",
      img: "icons/svg/aura.svg",
      transfer: ["weapon", "armor", "shield", "gear"].includes(this.item.type),
      system: {stacking: "stack", changes: []}
    }]);
    effect?.sheet.render({force: true});
  }

  static async #onEffectEdit(event, target) {
    const id=target.closest("[data-effect-id]")?.dataset.effectId;
    return id ? this.item.effects.get(id)?.sheet.render({force: true}) : null;
  }

  static async #onEffectToggle(event, target) {
    const id=target.closest("[data-effect-id]")?.dataset.effectId;
    const effect = id ? this.item.effects.get(id) : null;
    return effect?.update({disabled: !effect.disabled});
  }

  static async #onEffectDelete(event, target) {
    const id=target.closest("[data-effect-id]")?.dataset.effectId;
    const effect = id ? this.item.effects.get(id) : null;
    return effect && !isCarriedTransferredEffect(effect) ? effect.delete() : null;
  }

  static async #onApplyEffects() {
    return this.item.applyEffects();
  }

  static async #onInspectEquipmentStat(event, target) {
    return showEquipmentStatDetail(prepareEquipmentInspection(this.item), target.dataset.stat);
  }
}
