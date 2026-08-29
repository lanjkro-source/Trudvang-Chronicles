/**
 * Color palettes for the Trudvang theme. Each palette maps the 8 CSS custom
 * properties (--trudvang-*) to concrete values. `default` is the original,
 * `autumn` (P2), `winter` (P3) and `spring` are the alternates.
 *
 * Spring is derived from #F8F4E9 (cream), #4C5D3F (dark olive), #F9D5E0 (pink)
 * and #A3C293 (sage) — luminosities swapped per request (hue kept):
 *   - ink      = #2B2B2B (neutral dark) — guarantees >7:1 contrast on cream.
 *   - muted    = #6B7A6B — lighter sage-gray.
 *   - red      = #E8A0B5 (pink hue #F9D5E0, lightness of sage #A3C293).
 *   - gold     = #DDE8D5 (sage hue #A3C293, lightness of pink #F9D5E0).
 *   - green    = #4C5D3F (dark olive) — coldest source tone for cost pips.
 *   - paper    = #F8F4E9, paperLight = #FDF8ED, line = rgba(43,43,43,0.38).
 * Summer is derived from #F4EEE0 (ivory), #1B2A4E (navy), #F28C28 (orange):
 *   - ink      = #1B2A4E (navy) — darkest, >8:1 on ivory.
 *   - muted    = #5A637A — lighter navy-gray.
 *   - red      = #F28C28 (orange) — saturated warm accent.
 *   - gold     = #E8C86A — light gold derived from orange, for borders/focus.
 *   - green    = #6B7A6B — muted sage for cost pips (neutral, complements orange/navy).
 *   - paper    = #F4EEE0, paperLight = #FDF8ED, line = rgba(27,42,78,0.38).
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
    red: "#E8A0B5",
    gold: "#DDE8D5",
    green: "#4C5D3F",
    paper: "#F8F4E9",
    paperLight: "#FDF8ED",
    line: "rgba(43,43,43,0.38)"
  },
  summer: {
    ink: "#1B2A4E",
    muted: "#5A637A",
    red: "#F28C28",
    gold: "#E8C86A",
    green: "#6B7A6B",
    paper: "#F4EEE0",
    paperLight: "#FDF8ED",
    line: "rgba(27,42,78,0.38)"
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
