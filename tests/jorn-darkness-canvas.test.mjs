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
 let refresh;
 globalThis.Hooks={on:(name,fn)=>{assert.equal(name,"updateAmbientLight");refresh=fn;}};
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
 for(const [type,expected] of [["normal",[true,true,true]],["night",[false,true,true]],["dark",[false,false,false]],["true",[false,false,false]]]){
  const sweep=new Sweep({system:{senses:[{type}]}});
  const edgeTypes=sweep._determineEdgeTypes("sight",0,sweep.config);
  assert.deepEqual([wall,curtain,coat].map(profile=>sweep._testEdgeInclusion(edge(profile),edgeTypes)),expected);
  assert.equal(sweep._testEdgeInclusion({type:"darkness"},edgeTypes),false);
  assert.equal(sweep._testEdgeInclusion({type:"wall"},edgeTypes),true);
 }
 let sourceUpdates=0,visionUpdates=0;
 globalThis.canvas={ready:true,scene:{},perception:{update(changes){assert.equal(changes.initializeVision,true);visionUpdates++;}}};
 const light={parent:canvas.scene,object:{initializeLightSource(){sourceUpdates++;}}};
 refresh(light,{flags:flags(wall)});
 refresh(light,{flags:{}});
 assert.equal(sourceUpdates,1);
 assert.equal(visionUpdates,1);
});
