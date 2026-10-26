import {resolveFearStatus} from "./fear-resolver.mjs";

const iconRoot = "systems/trudvang-chronicles/assets/icons/statuses";
const wounds = ["light", "injured", "serious", "critical", "dying"];
const fears = ["one", "two", "three", "four", "five", "mad"];

/** Visual markers only: resource preparation already applies the state penalties. */
export const ACTOR_STATE_STATUSES = [
  {id: "trudvang-surprised", name: "TRUDVANG.Status.Surprised", img: `${iconRoot}/surprised.svg`, hud: true, order: 121},
  {id: "trudvang-mounted", name: "TRUDVANG.Status.Mounted", img: `${iconRoot}/mounted.svg`, hud: true, order: 122},
  ...wounds.map((level, index) => ({
    id: `trudvang-wound-${level}`, name: `TRUDVANG.Damage.${level}`,
    img: `${iconRoot}/wound-${level}.svg`, hud: false, order: 100 + index
  })),
  ...fears.map((level, index) => ({
    id: `trudvang-fear-${level}`, name: `TRUDVANG.Status.FearState.${level}`,
    img: `${iconRoot}/fear-${level}.svg`, hud: false, order: 110 + index
  })),
  {id: "trudvang-sacrilege", name: "TRUDVANG.Status.Sacrilege",
    img: `${iconRoot}/sacrilege.svg`, hud: true, order: 120}
];

/** Resolve exactly the health/fear states shown on PC and NPC sheets. */
export function actorStateStatuses(actor) {
  if (!["character", "npc"].includes(actor?.type)) return [];
  const system = actor.system ?? {};
  const body = system.resources?.body;
  const fear = system.resources?.fear;
  const result = [];
  if (body) {
    const current = Number(body.current ?? body.value ?? 0);
    const level = current <= 0 ? (Number(system.survivalRounds ?? -1) === 0 ? "dead" : "dying")
      : system.damage?.level ?? "unhurt";
    if (level === "dead") result.push({group: "health", id: "dead"});
    else if (wounds.includes(level)) result.push({group: "health", id: `trudvang-wound-${level}`});
  }
  if (fear) {
    const {level} = resolveFearStatus({fear: fear.current ?? fear.value, insane: system.fearInsane});
    if (fears.includes(level)) result.push({group: "fear", id: `trudvang-fear-${level}`});
  }
  return result;
}
