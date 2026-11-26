import {jornDarknessPenalty} from "./rules/jorn-darkness.mjs";
import {actorSenses,grantsPerfectSight,grantsTrueSight,hasPerfectSight} from "./rules/senses.mjs";

const scope = "trudvang-chronicles";
const nightVisionMode = "trudvangNightVision";
const lightDocument = object => object?.document ?? object;
const darknessLight = object => lightDocument(object)?.flags?.[scope]?.spellZoneLight?.darkness;
const isNegativeLight = object => {
  const document = lightDocument(object);
  return document?.config?.negative || document?.light?.negative;
};

function usesNightVision(observer) {
  const senses = actorSenses(observer).filter(sense => sense.enabled);
  return senses.some(sense => sense.type === "night") && !senses.some(sense => ["dark","true","perfect"].includes(sense.type));
}
const actorForSight = source => source?.actor ?? source?.object?.actor ?? source?.object?.document?.actor;

function darknessBlocksSight(object, observer) {
  const darkness = darknessLight(object);
  return darkness ? jornDarknessPenalty(observer, darkness) !== 0 : !hasPerfectSight(observer);
}

export function registerJornDarknessCanvas() {
  const canvasConfig = CONFIG.Canvas;
  if (!canvasConfig?.darknessSourceClass || !canvasConfig.polygonBackends?.sight) return;
  const visionModes = canvasConfig.visionModes;
  if (visionModes?.darkvision) {
    visionModes[nightVisionMode] = visionModes.darkvision.clone({
      id:nightVisionMode, label:"TRUDVANG.Senses.Types.night", tokenConfig:false,
      canvas:{uniforms:{exposure:-0.24}}
    });
  }

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
        const {blinded,origin,priority,data} = this;
        const configuredMode = data.visionMode;
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
          if (configuredMode === "darkvision" && visionModes?.[nightVisionMode] && usesNightVision(observer)) {
            data.visionMode = nightVisionMode;
          }
          return super._updateVisionMode();
        } finally {
          data.visionMode = configuredMode;
          Object.defineProperty(blinded, "darkness", {value:darkness, writable:true, configurable:true, enumerable:true});
        }
      }
    };
  }

  canvasConfig.polygonBackends.sight = class extends canvasConfig.polygonBackends.sight {
    _testEdgeInclusion(edge, edgeTypes) {
      const observer = actorForSight(this.config?.source);
      // Foundry V14 uses the same edge type for positive and negative light sources.
      if (observer && this.config.type === "sight" && edge.type === "source") {
        const darkness = darknessLight(edge.object);
        if (darkness) {
          if (jornDarknessPenalty(observer, darkness) === 0) return false;
          return super._testEdgeInclusion(edge, {...edgeTypes,source:{mode:1,priority:-Infinity}});
        }
        if (isNegativeLight(edge.object) && hasPerfectSight(observer)) return false;
      }
      return super._testEdgeInclusion(edge, edgeTypes);
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
