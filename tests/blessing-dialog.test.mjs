import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.foundry={applications:{handlebars:{}}};
const {blessingDialog}=await import('../modules/blessing-dialog.mjs');
const source='holy-tenetnid-tablet-of-voices:kindred-s-bond:4';
const effect={id:'b',name:'Grace',flags:{'trudvang-chronicles':{transformation:{sourceId:source,input:'retrouver le trésor',ruleTestContext:{countsById:{[source+':3']:2}}}}}};
const actor={effects:[effect]};
globalThis.game={i18n:{format:(key,data)=>'contribue à '+data.goal}};
let checked=false;
const root={querySelector:()=>({checked})};
class Base {static async wait(config){return config.buttons[0].callback({}, {form:root},{element:root});}}
test('an integrated blessing is off by default and changes only the chosen result field',async()=>{
 for(const [mode,result,field] of [['modifier',{modifier:2},'modifier'],['magic',{target:12,situationalModifier:2},'target'],['concentration',{base:6,modifier:0},'modifier'],['trait',{mode:'situation',situationValue:10},'situationValue'],['trait',{mode:'open',bonus:0},'bonus']]){
  const Dialog=blessingDialog(Base,actor,mode);const config=()=>({buttons:[{action:'roll',callback:()=>({...result})}]});
  checked=false;assert.deepEqual(await Dialog.wait(config()),result);
  checked=true;const answer=await Dialog.wait(config());assert.equal(answer[field],result[field]+5);assert.equal(answer.blessing.value,5);assert.match(answer.blessing.label,/retrouver le trésor/);
 }
});
test('cancellation, expiry and dialogs without a blessing never receive a bonus',async()=>{
 checked=true;const Dialog=blessingDialog(Base,actor);
 assert.equal(await Dialog.wait({buttons:[{action:'cancel',callback:()=>false}]}),false);
 effect.disabled=true;assert.equal(blessingDialog(Base,actor),Base);
 assert.deepEqual(await Dialog.wait({buttons:[{action:'roll',callback:()=>({modifier:0})}]}),{modifier:0});
 delete effect.disabled;
});

test('the checkbox starts unchecked and refreshes the visible final target without changing manual fields',async()=>{
 const events={},output={textContent:'12',hidden:false,nextElementSibling:null,after(node){this.nextElementSibling=node;}};
 let label;
 const fakeRoot={querySelector:selector=>selector==='[data-nid-blessing]'?null:selector==='.roll-dialog'?{prepend(node){label=node;}}:output,querySelectorAll:()=>[output],addEventListener:(type,fn)=>{events[type]=fn;}};
 const box={checked:false};
 globalThis.document={createElement:type=>type==='label'?{querySelector:()=>box,set innerHTML(v){this.html=v;}}:{attrs:{},setAttribute(k,v){this.attrs[k]=v;},hasAttribute(k){return k in this.attrs;}}};
 // escapeHtml uses a detached element's textContent/innerHTML pair.
 const create=globalThis.document.createElement;
 globalThis.document.createElement=type=>{const n=create(type);let text='';Object.defineProperty(n,'textContent',{get:()=>text,set:v=>{text=String(v);}});if(type==='div')Object.defineProperty(n,'innerHTML',{get:()=>text});return n;};
 class RenderBase{_onRender(){}}
 const Dialog=blessingDialog(RenderBase,actor);const instance=new Dialog();instance.element=fakeRoot;instance._onRender({},{});
 assert.ok(!/checked/.test(label.html));assert.equal(box.checked,false);assert.equal(output.hidden,false);
 box.checked=true;events.change();await Promise.resolve();assert.equal(output.hidden,true);assert.equal(output.nextElementSibling.textContent,'17');
 output.textContent='14';events.input();await Promise.resolve();assert.equal(output.nextElementSibling.textContent,'19');
 box.checked=false;events.change();await Promise.resolve();assert.equal(output.hidden,false);assert.equal(output.textContent,'14');
});
