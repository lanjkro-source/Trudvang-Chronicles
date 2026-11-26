import {recordedRoll} from "../chat-roll-privacy.mjs";

const TABLE_IDS = new Map([
  ["fatal-magic-effects", "fatal-magic-effects"],
  ["fatal-failure-effects", "fatal-failure-effects"],
  ["TRUDVANG.Content.Table.FatalMagic", "fatal-magic-effects"],
  ["TRUDVANG.Content.Table.FatalFailure", "fatal-failure-effects"]
]);

export function fatalTableId(table) {
  const starterId = table.getFlag("trudvang-chronicles", "starterId");
  const tableKey = table.getFlag("trudvang-chronicles", "tableKey");
  return TABLE_IDS.get(starterId) ?? TABLE_IDS.get(tableKey) ?? null;
}

export function fatalRollFormula(threshold = 9, modifier = 0) {
  const jo = Math.max(2, Math.min(10, Math.trunc(Number(threshold) || 9)));
  const bonus = Math.trunc(Number(modifier) || 0);
  return `1d10x>=${jo}${bonus < 0 ? ` - ${-bonus}` : bonus > 0 ? ` + ${bonus}` : ""}`;
}

export function fatalTotalInRange(total, first, last) {
  return Number.isInteger(total) && total >= first && total <= last;
}

export function matchesFatalResult(message, result, rule) {
  return Boolean(result && rule && (fatalTotalInRange(recordedRoll(message)?.total, result.row, rule.last)
    || (result.forced === true && message.author?.isGM)));
}
