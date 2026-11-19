import {spellZoneRange} from "./rules/spell-zones.mjs";

/** Local, non-interactive overlay used only during native area placement. */
export function createSpellZoneRangeGuide(board) {
 const {Graphics, Text} = globalThis.PIXI ?? {};
 if (!Graphics || !Text || !board.interface?.addChild) return null;
 const palette = globalThis.getComputedStyle?.(globalThis.document?.documentElement);
 const color = (role, fallback) => {
  const value = palette?.getPropertyValue(`--trudvang-${role}`).trim();
  return /^#[\da-f]{6}$/i.test(value) ? value : fallback;
 };
 const ink = color("ink", "#2d211c");
 const paper = color("paper-light", "#f4ecd9");
 const warning = color("negative", "#733b2d");
 const tint = value => Number.parseInt(value.slice(1),16);
 const number = new Intl.NumberFormat(game.i18n.lang, {maximumFractionDigits:2});
 const line = new Graphics();
 const label = new Text("", {fontFamily:"sans-serif",fontWeight:"bold",fontSize:14,fill:paper,stroke:ink,strokeThickness:4});
 line.eventMode = label.eventMode = "none";
 line.zIndex = label.zIndex = Number.MAX_SAFE_INTEGER;
 label.anchor.set(.5,1);
 line.visible = label.visible = false;
 board.interface.addChild(line,label);

 let current;
 function redraw() {
  if (!current || line.destroyed || label.destroyed) return;
  const {origin,range,end,distance,valid} = current;
  const zoom = board.stage?.scale?.x || 1;
  const dx = end.x - origin.x, dy = end.y - origin.y;
  const screenLength = Math.hypot(dx,dy)*zoom;
  const dash = Math.max(12, screenLength/120);
  const stroke = valid ? paper : warning;
  line.clear();
  const drawDashes = (width,color) => {
   line.lineStyle(width/zoom,tint(color),1);
   for(let start=0; start<screenLength; start+=dash) {
    const a = start/screenLength, b = Math.min(start+.58*dash,screenLength)/screenLength;
    line.moveTo(origin.x+dx*a,origin.y+dy*a);
    line.lineTo(origin.x+dx*b,origin.y+dy*b);
   }
   if(!valid && screenLength>0) {
    const x=4*dy/screenLength, y=4*dx/screenLength;
    line.moveTo(end.x-x,end.y+y);
    line.lineTo(end.x+x,end.y-y);
   }
  };
  drawDashes(5,valid ? ink : paper);
  drawDashes(3,stroke);
  label.text = game.i18n.format("TRUDVANG.SpellZone.RangeGuideDistance", {
   distance:number.format(distance), max:number.format(range)
  });
  label.position.set(end.x,end.y-8/zoom);
  label.scale.set(1/zoom);
  line.visible = label.visible = true;
 }
 const panHook = Hooks.on("canvasPan", redraw);
 return {
  draw(limit, pointer, valid) {
   const measure = spellZoneRange(limit,pointer);
   if (!measure) {
    current = null;
    line.visible = label.visible = false;
    return;
   }
   current = {origin:limit.origin,range:limit.range,...measure,valid};
   redraw();
  },
  destroy() {
   Hooks.off("canvasPan",panHook);
   if (!label.destroyed) label.destroy();
   if (!line.destroyed) line.destroy();
  }
 };
}
