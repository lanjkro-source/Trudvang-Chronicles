import assert from "node:assert/strict";
import test from "node:test";
import {registerJornDarknessCanvas} from "../modules/jorn-darkness-canvas.mjs";

test("Jorn darkness adds exact boundaries and lets each observer use the appropriate sight",t=>{
 const original = {CONFIG:globalThis.CONFIG,PIXI:globalThis.PIXI,Hooks:globalThis.Hooks,canvas:globalThis.canvas};
 t.after(()=>Object.assign(globalThis,original));
 class NativeDarkness {
  _getPolygonConfiguration(){return {boundaryShapes:["native"]};}
  _couldShapesChange(){return false;}
 }
 class NativeSweep {
  constructor(actor){this.config={source:{object:{actor}}};}
  _determineEdgeTypes(){return {darkness:{mode:0,priority:0},wall:{mode:1,priority:0}};}
  _testEdgeInclusion(edge,edgeTypes){return edgeTypes[edge.type].mode>0;}
 }
 globalThis.CONFIG={Canvas:{darknessSourceClass:NativeDarkness,polygonBackends:{sight:NativeSweep}}};
 const hooks=new Map();
 globalThis.Hooks={on:(name,fn)=>hooks.set(name,fn)};
 globalThis.PIXI={Polygon:class {constructor(points){this.points=points;}}};
 registerJornDarknessCanvas();
 const wall={penalty:-3,nightPenalty:0,boundary:[0,0,20,0,20,5,0,5]};
 const curtain={penalty:-8,nightPenalty:-3,boundary:null};
 const coat={penalty:-15,nightPenalty:-8,boundary:null};
 const scope="trudvang-chronicles";
 const flags=darkness=>({[scope]:{spellZoneLight:{darkness}}});
 const ambient=darkness=>({document:{flags:flags(darkness)}});
 const edge=profile=>({type:"darkness",object:ambient(profile)});
 const source=new CONFIG.Canvas.darknessSourceClass();
 source.object=ambient(wall);
 assert.deepEqual(source._getPolygonConfiguration().boundaryShapes.map(p=>p.points??p),["native",wall.boundary]);
 assert.equal(source._couldShapesChange({}),false);
 wall.boundary=[0,0,5,0,5,20,0,20];
 assert.equal(source._couldShapesChange({}),true);
 source.object=ambient(curtain);
 assert.deepEqual(source._getPolygonConfiguration().boundaryShapes,["native"]);

 const Sweep=CONFIG.Canvas.polygonBackends.sight;
 for(const [type,expected] of [["normal",[true,true,true]],["night",[false,true,true]],["dark",[false,false,false]],["true",[false,false,false]],["perfect",[false,false,false]]]){
  const sweep=new Sweep({system:{senses:[{type}]}});
  const edgeTypes=sweep._determineEdgeTypes("sight",0,sweep.config);
  assert.deepEqual([wall,curtain,coat].map(profile=>sweep._testEdgeInclusion(edge(profile),edgeTypes)),expected);
  assert.equal(sweep._testEdgeInclusion({type:"darkness"},edgeTypes),false);
  assert.equal(sweep._testEdgeInclusion({type:"wall"},edgeTypes),true);
 }
 let sourceUpdates=0,visionUpdates=0;
 globalThis.canvas={ready:true,scene:{},perception:{update(changes){assert.equal(changes.initializeVision,true);visionUpdates++;}}};
 const light={parent:canvas.scene,object:{initializeLightSource(){sourceUpdates++;}}};
 hooks.get("updateAmbientLight")(light,{flags:flags(wall)});
 hooks.get("updateAmbientLight")(light,{flags:{}});
 assert.equal(sourceUpdates,1);
 assert.equal(visionUpdates,1);
 const effect={flags:{[scope]:{transformation:{sourceId:"vitner-power-of-vision:seeing:3"}}}};
 hooks.get("createActiveEffect")(effect);
 hooks.get("updateActiveEffect")(effect);
 hooks.get("deleteActiveEffect")(effect);
 hooks.get("updateActiveEffect")({});
 assert.equal(visionUpdates,4);
});

test("Foundry’s interior darkness blinding uses the same per-observer exceptions as its edges",t=>{
 const original={CONFIG:globalThis.CONFIG,Hooks:globalThis.Hooks,canvas:globalThis.canvas};
 t.after(()=>Object.assign(globalThis,original));
 let containing=[];
 globalThis.canvas={effects:{testInsideDarkness(point,{condition}){
  assert.deepEqual(point,{x:10,y:5,elevation:0});
  return containing.some(condition);
 }}};
 class NativeVision {
  constructor(type){
   this.object={actor:{system:{senses:[{type}]}}};
   this.origin={x:10,y:5,elevation:0};
   this.blinded={blind:false,burrow:false};
   this.priority=10;
  }
  _updateVisionMode(){
   this.blinded.darkness=canvas.effects.testInsideDarkness(this.origin,{condition:source=>this.priority<=source.priority});
   this.visionMode=Object.values(this.blinded).some(Boolean)?"blindness":"normal";
  }
 }
 globalThis.CONFIG={Canvas:{visionSourceClass:NativeVision,darknessSourceClass:class{},polygonBackends:{sight:class{}}}};
 globalThis.Hooks={on(){}};
 registerJornDarknessCanvas();
 const vision=type=>new CONFIG.Canvas.visionSourceClass(type);
 const light=(profile,priority=100)=>({priority,object:{flags:{"trudvang-chronicles":{spellZoneLight:{darkness:profile}}}}});
 const wall=light({penalty:-3,nightPenalty:0});
 const curtain=light({penalty:-8,nightPenalty:-3});
 const normal=vision("normal"),night=vision("night"),dark=vision("dark"),trueSight=vision("true"),perfect=vision("perfect");
 const readers=[normal,night,dark,trueSight,perfect];
 function check(sources,expected){
  containing=sources;
  for(const source of readers)source._updateVisionMode();
  assert.deepEqual(readers.map(source=>source.visionMode==="blindness"),expected);
 }
 check([wall],[true,false,false,false,false]);
 check([wall,curtain],[true,true,false,false,false]);
 check([wall,{priority:100}],[true,true,true,true,false]);
 check([wall,{priority:5}],[true,false,false,false,false]);
 check([],[false,false,false,false,false]);
 perfect.blinded.blind=true;
 check([wall],[true,false,false,false,true]);
 perfect.blinded.blind=false;
 night.blinded.burrow=true;
 check([wall],[true,true,false,false,false]);
 assert.equal(night.blinded.darkness,false);
 assert.equal(night.blinded.burrow,true);
 check([wall],[true,true,false,false,false]);
 night.blinded.burrow=false;
 check([wall],[true,false,false,false,false]);
});
