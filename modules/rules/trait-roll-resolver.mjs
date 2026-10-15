/** Combine one or two configured trait modifiers for a resistance test. */
export function calculateTraitModifier(values, method = "first") {
  const numbers = (Array.isArray(values) ? values : [values]).map(value => Number(value) || 0);
  if (!numbers.length) return 0;
  if (method === "second") return numbers[1] ?? numbers[0];
  if (method === "average") return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  if (method === "sum") return numbers.reduce((sum, value) => sum + value, 0);
  if (method === "best") return Math.max(...numbers);
  return numbers[0];
}
