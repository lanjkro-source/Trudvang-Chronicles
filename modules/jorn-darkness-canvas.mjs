import {jornDarknessPenalty} from "./rules/jorn-darkness.mjs";

const scope = "trudvang-chronicles";
const darknessLight = object => (object?.document ?? object)?.flags?.[scope]?.spellZoneLight?.darkness;
const actorForSight = source => source?.actor ?? source?.object?.actor ?? source?.object?.document?.actor;

export function registerJornDarknessCanvas() {
  const canvasConfig = CONFIG.Canvas;
  if (!canvasConfig?.darknessSourceClass || !canvasConfig.polygonBackends?.sight) return;

  // Keep the native source (including its lighting/vision edges) and clip its
  // radial bounds to the footprint stored on the scene's Ambient Light.
  canvasConfig.darknessSourceClass = class extends canvasConfig.darknessSourceClass {
    #lastBoundary;

    _couldShapesChange(changes) {
      return super._couldShapesChange(changes) || darknessLight(this.object)?.boundary !== this.#lastBoundary;
    }

    _getPolygonConfiguration() {
      const config = super._getPolygonConfiguration();
      const boundary = this.#lastBoundary = darknessLight(this.object)?.boundary;
      if (boundary?.length) config.boundaryShapes = [...(config.boundaryShapes ?? []), new PIXI.Polygon(boundary)];
      return config;
    }
  };

  canvasConfig.polygonBackends.sight = class extends canvasConfig.polygonBackends.sight {
    #nativeEdgeTypes;

    _determineEdgeTypes(type, priority, config) {
      const native = super._determineEdgeTypes(type, priority, config);
      this.#nativeEdgeTypes = null;
      if (type !== "sight" || !actorForSight(config?.source ?? this.config?.source)) return native;
      // Ensure the candidate search includes Jorn's darkness even when generic
      // darkvision excludes darkness edges. Preserve the native filtering for
      // every edge unrelated to these powers.
      this.#nativeEdgeTypes = native;
      return {...native, darkness:{mode:1, priority:-Infinity}};
    }

    _testEdgeInclusion(edge, edgeTypes) {
      const darkness = this.#nativeEdgeTypes && darknessLight(edge.object);
      const observer = actorForSight(this.config?.source);
      if (darkness && observer) {
        if (jornDarknessPenalty(observer, darkness) === 0) return false;
        return super._testEdgeInclusion(edge, edgeTypes);
      }
      return super._testEdgeInclusion(edge, this.#nativeEdgeTypes ?? edgeTypes);
    }
  };

  // A same-size footprint can change only in the flags (for example two
  // different rectangles with the same diagonal). Rebuild the native source.
  Hooks.on("updateAmbientLight", (light, changes) => {
    if (!changes.flags?.[scope]?.spellZoneLight?.darkness || !globalThis.canvas?.ready || light.parent !== canvas.scene) return;
    light.object?.initializeLightSource();
    canvas.perception.update({initializeLighting:true, initializeVision:true, refreshLighting:true, refreshVision:true});
  });
}
