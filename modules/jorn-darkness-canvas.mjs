import {jornDarknessPenalty} from "./rules/jorn-darkness.mjs";
import {grantsPerfectSight,grantsTrueSight,hasPerfectSight} from "./rules/senses.mjs";

const scope = "trudvang-chronicles";
const darknessLight = object => (object?.document ?? object)?.flags?.[scope]?.spellZoneLight?.darkness;
const actorForSight = source => source?.actor ?? source?.object?.actor ?? source?.object?.document?.actor;

function darknessBlocksSight(object, observer) {
  const darkness = darknessLight(object);
  return darkness ? jornDarknessPenalty(observer, darkness) !== 0 : !hasPerfectSight(observer);
}

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

  if (canvasConfig.visionSourceClass) {
    canvasConfig.visionSourceClass = class extends canvasConfig.visionSourceClass {
      _updateVisionMode() {
        const observer = actorForSight(this);
        if (!observer) return super._updateVisionMode();
        const {blinded,origin,priority} = this;
        let darkness = blinded.darkness;
        // Foundry writes its point containment result here before picking the
        // blindness mode and building the view polygons. Filter just that cause.
        Object.defineProperty(blinded, "darkness", {
          configurable:true, enumerable:true,
          get:() => darkness,
          set:active => {
            darkness = active && canvas.effects.testInsideDarkness(origin, {
              condition:source => priority <= source.priority && darknessBlocksSight(source.object, observer)
            });
          }
        });
        try {
          return super._updateVisionMode();
        } finally {
          Object.defineProperty(blinded, "darkness", {value:darkness, writable:true, configurable:true, enumerable:true});
        }
      }
    };
  }

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
      const observer = actorForSight(this.config?.source);
      if (this.#nativeEdgeTypes && observer && edge.type === "darkness") {
        if (!darknessBlocksSight(edge.object, observer)) return false;
        if (darknessLight(edge.object)) return super._testEdgeInclusion(edge, edgeTypes);
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

  // An effect can change which obstacles apply with the same token sight mode
  // and range, in which case the token document itself is not updated.
  for (const hook of ["createActiveEffect","updateActiveEffect","deleteActiveEffect"]) {
    Hooks.on(hook, effect => {
      if (!globalThis.canvas?.ready || !(grantsPerfectSight(effect) || grantsTrueSight(effect))) return;
      canvas.perception.update({initializeVision:true});
    });
  }
}
