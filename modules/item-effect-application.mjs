import {effectStackId} from "./rules/effect-stacking.mjs";
import {effectSource} from "./rules/effect-source.mjs";

// Serialize applications to the same item, including two clients applying at once
// through the GM's allocation queue.
const jobs = new WeakMap();

export async function applyItemTransformation(item, data) {
  const run = async () => {
    const prepared = foundry.utils.deepClone(effectSource(data));
    prepared.start = foundry.documents.ActiveEffect.implementation.getEffectStart();
    const stackId = effectStackId(prepared);
    const matches = stackId ? Array.from(item.effects ?? []).filter(effect =>
      ["effect", "base"].includes(effect.type) && !effect.duration?.expired && effectStackId(effect) === stackId) : [];
    const existing = matches[0];
    if (existing) {
      delete prepared._id;
      prepared.disabled ??= false;
      prepared.duration = {...(prepared.duration || existing._source.duration), expired: false};
      await existing.update(prepared);
      // Remove duplicates left by the earlier item-drop bug, keeping the
      // renewed document and its link to the maintained casting.
      for (const duplicate of matches.slice(1)) await duplicate.delete();
      return existing;
    }
    return (await item.createEmbeddedDocuments("ActiveEffect", [prepared]))[0];
  };
  const previous = jobs.get(item) ?? Promise.resolve();
  const job = previous.then(run, run).finally(() => { if (jobs.get(item) === job) jobs.delete(item); });
  jobs.set(item, job);
  return job;
}
