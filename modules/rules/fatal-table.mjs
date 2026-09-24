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
