import {test} from "node:test";
import assert from "node:assert/strict";

let values, cancelled = false, messages = [], renders = [], dice = [], dialogs = [], evaluated = [];
globalThis.document = {createElement: () => ({set textContent(v) {this.innerHTML = String(v);}})};
globalThis.foundry = {applications: {api: {DialogV2: class {
  static async wait(config) {
    dialogs.push(config);
    if (cancelled) return config.buttons[1].callback();
    const aliases={'damage-dice':'dice','damage-faces':'faces','damage-open-roll':'threshold','damage-modifier':'bonus','damage-title':'title','damage-origin':'delivery','damage-magical-weapon':'magical-weapon'};
    return config.buttons[0].callback(null, {form: {querySelector: selector => {const name=selector.match(/name=["']?([^\]"']+)/)?.[1],key=aliases[name]??name;return {value:values[key],checked:values[key]===true};}}}, null);
  }
}}, handlebars: {renderTemplate: async (path, data) => {renders.push({path, data}); return "card";}}},
documents: {Actor: class {}, ActiveEffect: class {}}, data: {fields: {}, ActiveEffectTypeDataModel: class {}}};
globalThis.game = {user: {name: "Player", targets: []}, i18n: {localize: key => key,format:key=>key}};
globalThis.ui = {notifications: {warn() {}}};
globalThis.Roll = class {
  constructor(formula) {this.formula = formula;}
  async evaluate() {evaluated.push(this.formula);this.total = dice.shift(); return this;}
};
globalThis.ChatMessage = {getSpeaker: () => ({}), create: async data => messages.push(data)};
const {rollGenericDamage, rollGenericFear} = await import("../modules/generic-rolls.mjs");

test("standalone dice chain on every result at or above the chosen JO and retain the custom title", async () => {
  values = {title: "Falling stones", dice: "1", faces: "3", threshold: "2", bonus: "2"};
  dice = [2, 3, 1];
  const roll = await rollGenericDamage();
  assert.equal(roll.total, 8);
  assert.deepEqual(messages.at(-1).rolls.map(r => r.formula), ["1d3", "1d3", "1d3"]);
  assert.equal(renders.at(-1).data.itemName, "Falling stones");
  assert.equal(renders.at(-1).data.total, 8);
  assert.ok(renders.some(r => r.path.endsWith("damage-targets.hbs")));
});

test("generic fear uses the normal actionable fear card, with bonus and custom title", async () => {
  values = {title: "Haunted house", dice: "2", faces: "5", threshold: "0", bonus: "-1"};
  dice = [4, 3];
  await rollGenericFear();
  assert.ok(renders.at(-1).path.endsWith("fear-card.hbs"));
  assert.equal(renders.at(-1).data.title, "Haunted house");
  assert.equal(renders.at(-1).data.total, 6);
});

test("cancel and invalid explosive thresholds never roll or post", async () => {
  const before = messages.length;
  cancelled = true;
  assert.equal(await rollGenericDamage(), null);
  cancelled = false;
  values.threshold = "1";
  assert.equal(await rollGenericFear(), null);
  assert.equal(messages.length, before);
});

test('magic fear prefills the confirmation and cancellation posts neither dice nor message',async()=>{
 const {rollMagicFear}=await import('../modules/magic-fear.mjs');
 const id='holy-gerbanis-wrath-of-tyrd:dark-visage:5',document={name:'Figure sinistre',system:{catalogId:id}};
 const oldWait=foundry.applications.api.DialogV2.wait;let content;
 foundry.applications.api.DialogV2.wait=async config=>{content=config.content;return false;};
 const before=messages.length;
 try{
  await rollMagicFear({document,actor:{isOwner:true},context:{sourceId:id,countsById:{[id+':2']:4}}});
  assert.match(content,/name="threshold"[^>]*value="6"/);assert.match(content,/Figure sinistre/);
  await rollMagicFear({document,actor:{isOwner:true},context:{sourceId:id,countsById:{[id+':2']:4}},baseOnly:true});
  assert.match(content,/name="threshold"[^>]*value="10"/);
  assert.equal(messages.length,before);
 }finally{foundry.applications.api.DialogV2.wait=oldWait;}
});

test('generic weapon damage preserves its delivery and magical nature for application',async()=>{
 values={title:'Magic arrow',dice:'1',faces:'10',threshold:'0',bonus:'0',delivery:'ranged','magical-weapon':true};dice=[8];
 await rollGenericDamage();
 assert.deepEqual(messages.at(-1).flags['trudvang-chronicles'].damageContext,{usage:'ranged',magicalWeapon:true});
});

test('fixed generic damage uses the shared window and posts its amount without evaluating dice',async()=>{
 values={title:'Chute fixe',dice:'0',faces:'5',threshold:'9',bonus:'17',delivery:'', 'magical-weapon':false};
 const before=evaluated.length;
 const result=await rollGenericDamage();
 assert.equal(result.total,17);assert.equal(evaluated.length,before);assert.deepEqual(messages.at(-1).rolls,[]);
 assert.equal(renders.at(-1).data.detail,'17');assert.equal(renders.at(-1).data.itemName,'Chute fixe');
 assert.ok(dialogs.at(-1).classes.includes('damage-roll-window'));
 assert.ok(renders.some(row=>row.path.endsWith('app/damage-roll-dialog.hbs')&&row.data.generic&&row.data.editableFaces&&row.data.minimumDice===0));
});
test('zero dice without a modifier, negative counts and cancellation cannot post damage',async()=>{
 const before=messages.length,rollsBefore=evaluated.length;
 values={title:'Invalid',dice:'0',faces:'10',threshold:'0',bonus:'0',delivery:''};
 assert.equal(await rollGenericDamage(),null);
 values.dice='-1';values.bonus='4';assert.equal(await rollGenericDamage(),null);
 values.dice='0';cancelled=true;assert.equal(await rollGenericDamage(),null);cancelled=false;
 assert.equal(messages.length,before);assert.equal(evaluated.length,rollsBefore);
});
test('every selectable damage die uses its actual face count',async()=>{
 for(const faces of [3,4,5,6,10]){values={title:'Damage',dice:'1',faces:String(faces),threshold:'0',bonus:'0',delivery:''};dice=[2];
  await rollGenericDamage();assert.equal(evaluated.at(-1),'1d'+faces);
 }
});
