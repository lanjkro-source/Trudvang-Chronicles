/**
 * Color palettes for the Trudvang theme. Each palette maps the 8 CSS custom
 * properties (--trudvang-*) to concrete values. `default` is the original,
 * `autumn` (P2), `winter` (P3) and `spring` are the alternates.
 *
 * Spring is derived from #F8F4E9 (cream), #4C5D3F (dark olive), #F9D5E0 (pink)
 * and #A3C293 (sage):
 *   - ink      = #2B2B2B (neutral dark) — guarantees >7:1 contrast on cream
 *                paper (olive #4C5D3F alone only ~6.5:1), consistent with
 *                other palettes where ink is darkest.
 *   - muted    = #6B7A6B — lighter sage-gray.
 *   - red      = #A3C293 (sage) — more saturated warm accent; pink #F9D5E0
 *                too pale for titles/active.
 *   - gold     = #F9D5E0 (pink) — light warm accent for borders/focus.
 *   - green    = #4C5D3F (dark olive) — coldest source tone for cost pips.
 *   - paper    = #F8F4E9, paperLight = #FDF8ED, line = rgba(43,43,43,0.38).
 */
export const PALETTES = {
  default: {
    ink: "#2d211c",
    muted: "#69564b",
    red: "#733b2d",
    gold: "#a88243",
    green: "#334b3d",
    paper: "#e8dcc4",
    paperLight: "#f4ecd9",
    line: "rgba(72,48,35,0.38)"
  },
  autumn: {
    ink: "#1C1C1C",
    muted: "#5A4A3A",
    red: "#C8411D",
    gold: "#D4AF37",
    green: "#5C6B4A",
    paper: "#F5E8C8",
    paperLight: "#FDF6E3",
    line: "rgba(28,28,28,0.38)"
  },
  winter: {
    ink: "#2B2B2B",
    muted: "#6B5E6B",
    red: "#7A4E8F",
    gold: "#C4A882",
    green: "#6B7A6B",
    paper: "#F4EEE0",
    paperLight: "#FDF8ED",
    line: "rgba(43,43,43,0.38)"
  },
  spring: {
    ink: "#2B2B2B",
    muted: "#6B7A6B",
    red: "#A3C293",
    gold: "#F9D5E0",
    green: "#4C5D3F",
    paper: "#F8F4E9",
    paperLight: "#FDF8ED",
    line: "rgba(43,43,43,0.38)"
  }
};

/** Apply a palette to the document root by setting the --trudvang-* variables. */
export function applyPalette(paletteId) {
  const palette = PALETTES[paletteId] || PALETTES.default;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--trudvang-${key}`, value);
  }
}
