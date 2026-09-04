"""Extract Trudvang powers (tablets) from the official French rulebook PDF.

Produces a JSON array in the same schema as `game doc/fr/handmade-sample.json`.

The rules are inferred from the PDF layout (positional text extraction), NOT
hardcoded:

- The PDF uses a 3-column newspaper layout. `page.extract_text()` interleaves
  the columns, so we reconstruct the correct reading order by grouping text
  blocks into columns by x-coordinate and reading left->middle->right,
  top->bottom within each column, across pages.
- A tablet section starts with a bandeau ("LES TABLETTES SACRÉES DE ...") and a
  table of contents (lines with multiple "N : Name" patterns). Both are skipped.
- A power starts with a line matching `N : Name` (the name may span lines),
  optionally followed by a `« nom_suedois »` line, then `F ...` attribute lines.
- The description is the text between the attributes and the
  `NAME : NIVEAUX DE PUISSANCE` marker; line breaks are joined with a space,
  and hyphenation (`mou - vement`, `éga- lement`) is removed.
- The NIVEAUX DE PUISSANCE table is a two-column table (effect text | cost).
- Rune powers (thuul) use a different attribute set (`F Modificateur`,
  `F Activation`, ...) and are normalized to `type: "permanent"` with
  `est_rune_permanente: true`.

Usage:
    python tools/extract-powers-fr.py [--sample] [--out PATH]
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "game doc" / "fr" / "Trudvang - 01 - Livre des Regles.pdf"
DEFAULT_OUT = ROOT / "game doc" / "fr" / "trudvang-powers-fr.json"
SAMPLE_PATH = ROOT / "game doc" / "fr" / "handmade-sample.json"
FR_LANG_PATH = ROOT / "lang" / "fr.json"

# ---------------------------------------------------------------------------
# Text helpers
# ---------------------------------------------------------------------------

POWER_RE = re.compile(r"^(\d+)\s*:\s*(.+)$")
NOM_SUEDOIS_RE = re.compile(r"^«\s*(.+?)\s*»$")
ATTR_RE = re.compile(r"^F\s+(.+?)\s*:\s*(.*)$")
BANDEAU_RE = re.compile(r"LES TABLETTES (?:SACRÉES|DE VITNER)", re.IGNORECASE)
NIVEAUX_RE = re.compile(r"NIVEAU[X]?\s+DE\s+PUISSANCE(?!\s*SUPPLÉMENTAIRE)", re.IGNORECASE)


def is_niveaux_header(line: str) -> bool:
    """True if `line` is a "NIVEAUX DE PUISSANCE" table header.

    The marker must sit at the start or end of the line (e.g. "BOURSE DE
    VITNER : NIVEAUX DE PUISSANCE" or "NIVEAUX DE PUISSANCE : ANIMATION DES
    MORTS-VIVANTS").  A bare `NIVEAUX_RE.search` also matches the phrase
    "niveaux de puissance" inside a description sentence, which would cut the
    description short, so we require the marker to be line-anchored.
    """
    s = line.strip()
    return bool(
        NIVEAUX_RE.match(s)
        or re.search(r"NIVEAU[X]?\s+DE\s+PUISSANCE\s*$", s, re.IGNORECASE)
    )


def normalize_name(s: str) -> str:
    """Normalize a name for fuzzy matching against OCR'd PDF text.

    Lowercases, strips accents, and removes all non-alphanumeric characters
    so that OCR variations like "agilit É du lynx", "diMvitner", "C haleur
    de S olvei" all collapse to the same key as the catalog name.
    """
    s = s.lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)


def load_tablet_names() -> dict[str, str]:
    """Load the French tablet names from lang/fr.json.

    Returns a mapping from normalized name -> display name.
    """
    data = json.loads(FR_LANG_PATH.read_text(encoding="utf-8"))
    tablets = data["TRUDVANG"]["Content"]["Tablet"]
    result: dict[str, str] = {}
    for t in tablets.values():
        name = t["Name"]
        result[normalize_name(name)] = name
    return result


def join_description(lines: list[str]) -> str:
    """Join wrapped description lines, removing hyphenation.

    - A line ending with `-` (optionally surrounded by spaces) is joined
      directly to the next line (hyphen removed).
    - Otherwise lines are joined with a single space.
    """
    out: list[str] = []
    for line in lines:
        s = re.sub(r"\s+", " ", line).strip()
        if not s:
            continue
        if out and out[-1].endswith("-"):
            prev = out[-1].rstrip()
            prev = prev[:-1].rstrip()  # drop the '-'
            out[-1] = prev + s.lstrip()
        else:
            out.append(s)
    result = " ".join(out).strip()
    # Remove soft hyphenation baked into a single block line: "volon- taires"
    # -> "volontaires". A hyphen followed by a space and a lowercase letter is
    # a line-break hyphenation, never a real hyphenated word.
    result = re.sub(r"(?<=[a-zà-ÿ])- (?=[a-zà-ÿ])", "", result)
    return result


def split_table_rows(lines: list[str]) -> list[list[str]]:
    """Split a flat list of table lines into rows.

    A row is a group of lines terminated by a line that is a bare number
    (the cost). The effect text is everything before the cost line.
    """
    rows: list[list[str]] = []
    current: list[str] = []
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if re.fullmatch(r"\d+", s):
            current.append(s)
            rows.append(current)
            current = []
        else:
            current.append(s)
    if current:
        rows.append(current)
    return rows


_PREPOSITIONS = {
    "de", "du", "des", "à", "au", "aux", "par", "pour", "sur", "en",
    "dans", "avec", "sans", "vers", "chez", "entre", "sous", "d'un",
    "d'une", "d’un", "d’une",
}


def _extract_niveau_max(effet: str) -> int | None:
    """Extract the maximum power level from a ``(maximum N ...)`` clause.

    Handles: ``(maximum 3)``, ``(maximum 5 par tour de jeu)``,
    ``(maximum +9)``, ``(jusqu'à un maximum de +6)``.
    """
    m = re.search(r"\(maximum\s*\+?(\d+)", effet)
    if m:
        return int(m.group(1))
    m = re.search(r"\(jusqu'à un maximum de\s*\+?(\d+)\)", effet)
    if m:
        return int(m.group(1))
    return None


def parse_niveaux_puissance(lines: list[str]) -> list[dict]:
    """Parse the NIVEAUX DE PUISSANCE table body into [{cout, niveau_max, effet}].

    The table is a 3-column layout (effect | value | cost) flattened into
    reading order. An effect line starts a new effect group; value+cost lines
    and bare cost lines that follow belong to that group.
    """
    result: list[dict] = []
    current_effect: list[str] = []
    for line in lines:
        s = re.sub(r"\s+", " ", line).strip()
        if not s:
            continue
        if s == "Coût" or s.startswith("Niveau de puissance"):
            continue
        m = re.match(r"^(.*?)\s+(\d+)$", s)
        if m and m.group(1):
            value = m.group(1).strip()
            last_word = value.split()[-1].lower() if value.split() else ""
            if last_word in _PREPOSITIONS:
                current_effect = [s]
                continue
            cout = int(m.group(2))
            if value[0].isupper():
                current_effect = [value]
                effet = join_description([value])
            else:
                effet = join_description(current_effect + [value])
            result.append({"cout": cout, "niveau_max": _extract_niveau_max(effet), "effet": effet})
            continue
        if re.fullmatch(r"\d+", s):
            cout = int(s)
            effet = join_description(current_effect)
            result.append({"cout": cout, "niveau_max": _extract_niveau_max(effet), "effet": effet})
            current_effect = []
            continue
        current_effect = [s]
    return result


def _normalize_effet(effet: str) -> str:
    """Normalize a single NIVEAUX DE PUISSANCE effect string to match the
    curated handmade sample.

    The PDF effect text is terse; the curated sample expands it into a
    canonical form. This function applies the systematic transformations:
      - `de <number>` -> `de : <signed number>` (adding the `:` separator and
        the `+`/`-` sign on a bare modifier).
      - healing effects (`Augmente la vitesse de guérison de N (maximum M)`)
        -> `de : +N point(s) de santé par jour`.
      - `Soigne ...` effects -> `Soigne de : ...`.
      - Bond du félin distance/height -> `(max Nm en tout)` prefix + metres.
      - assorted textual corrections.
    """
    e = effet.strip()

    # Bond du félin: "Augmente la distance de saut de 50 cm (maximum 15 mètres
    # au total)" -> "Augmente (max 15m en tout) la distance de saut de : 0.5
    # mètre" (metres = cm/100, singular below 1 m).
    m = re.search(
        r"^Augmente la (distance|hauteur) de saut de (\d+)\s*cm\s*\(maximum\s+(\d+)\s*mètres au total\)$",
        e,
    )
    if m:
        kind, cm, max_m = m.group(1), int(m.group(2)), int(m.group(3))
        metres = cm / 100.0
        unit = "mètre" if metres < 1 else "mètres"
        return f"Augmente (max {max_m}m en tout) la {kind} de saut de : {metres:g} {unit}"

    # Healing: "de N (maximum M)" / "de +N (jusqu'à un maximum de +M)" ->
    # "de : +N point(s) de santé par jour" (niveau_max recomputed as M/N).
    m = re.search(
        r"^Augmente la vitesse de guérison de ([+-]?\d+)\s*\(.*?maximum.*?([+-]?\d+)\)$",
        e,
    )
    if m:
        n = int(m.group(1))
        plural = "s" if abs(n) > 1 else ""
        return f"Augmente la vitesse de guérison de : +{n} point{plural} de santé par jour"

    # Soigne: "Soigne de N point(s) de santé supplémentaire" ->
    # "Soigne de : +N point(s) de santé"; "Soigne N points de santé
    # supplémentaire" -> "Soigne de : N points de santé".
    m = re.search(r"^Soigne de ([+-]?\d+) points? de santé supplémentaire$", e)
    if m:
        n = int(m.group(1))
        plural = "s" if abs(n) > 1 else ""
        return f"Soigne de : +{n} point{plural} de santé"
    m = re.search(r"^Soigne (\d+) points? de santé supplémentaire$", e)
    if m:
        n = int(m.group(1))
        return f"Soigne de : {n} points de santé"

    # Textual corrections applied before the generic `de :` rule.
    e = re.sub(r"^Augmente la zone affectée de ", "Augmente le rayon de la zone affectée de : ", e)
    e = re.sub(r"^Augmente le rayon affecté de ", "Augmente le rayon de la zone affectée de : ", e)
    m = re.match(r"^Augmente la température de (\d+) degrés supplémentaires$", e)
    if m:
        return f"Augmente la température de : +{m.group(1)} degrés"
    # Heure de la chasse: "portée du pouvoir de 10 kilomètres" -> "portée de : 10 kilomètres".
    e = re.sub(r"^Augmente la portée du pouvoir de (\d+ kilomètres)$", r"Augmente la portée de : \1", e)

    # Generic `de :` rule: insert `:` after a bare `de` followed by a number.
    e = re.sub(r"\bde\s+(?!:)(?=[+-]?\d)", "de : ", e)

    # Sign a bare trailing number after "de : " (`+` by default, `-` for
    # semantic reductions like "découvrir l'elfe", "Réduit", "Diminue").
    m = re.search(r"de : (\d+)$", e)
    if m:
        n = int(m.group(1))
        if re.search(r"découvrir l['’]elfe", e) or e.startswith("Réduit") or e.startswith("Diminue"):
            sign = "-"
        else:
            sign = "+"
        e = e[: m.start(1)] + sign + str(n)

    return e


def normalize_niveau(entry: dict) -> dict:
    """Normalize a parsed NIVEAUX DE PUISSANCE entry to match the curated
    handmade sample: canonical effect text and niveau_max."""
    effet = entry.get("effet", "")
    raw_max = _extract_niveau_max(effet)
    m_heal = re.search(
        r"^Augmente la vitesse de guérison de ([+-]?\d+)\s*\(.*?maximum(?: de)?\s*\+?(\d+)\)",
        effet,
    )
    if m_heal:
        n = int(m_heal.group(1))
        max_m = int(m_heal.group(2))
        entry["niveau_max"] = max_m // abs(n) if n else None
    elif re.search(r"de saut de \d+\s*cm\s*\(maximum", effet):
        # Bond du félin: the "(maximum N mètres au total)" is a jump cap, not a
        # power-level cap; the sample records no niveau_max.
        entry["niveau_max"] = None
    elif raw_max is not None:
        entry["niveau_max"] = raw_max
    entry["effet"] = _normalize_effet(effet)
    return entry


def _situation_table_to_markdown(desc: str, power_name: str, spaced: bool = False) -> str:
    """Convert the inline "VALEUR DE SITUATION" table that the PDF flattens
    into reading order into a markdown table, matching the curated sample.

    The PDF text is ``<POWER> : VALEUR DE SITUATION Niveau du sort Valeur de
    situation 1 10 2 8 ...``; the sample renders it as a markdown table with
    the power-name prefix dropped. ``spaced`` pads each cell with spaces
    (the sample does this for Mur de vitner only).
    """
    m = re.search(
        re.escape(power_name) + r"\s*:\s*VALEUR DE SITUATION\s+Niveau du sort\s+Valeur de situation\s+"
        r"((?:\d+\s+\d+\s*)+)",
        desc,
        re.IGNORECASE,
    )
    if not m:
        return desc
    body = m.group(1).strip()
    pairs = re.findall(r"(\d+)\s+(\d+)", body)
    if spaced:
        rows = "\n".join(f"| {a} | {b} |" for a, b in pairs)
    else:
        rows = "\n".join(f"|{a}|{b}|" for a, b in pairs)
    table = "VALEUR DE SITUATION:\n|Niveau du sort|Valeur de situation|\n|---|---|\n" + rows + "\n"
    return desc[: m.start()] + table + desc[m.end():]


def tablet_header_name(line: str, tablet_names: dict[str, str]) -> str | None:
    """Return the display name if `line` is a tablet section header, else None.

    The header may carry a `« nom_suedois »` suffix (e.g. "A rt du vitner
    «Vitnakraftla»"), a parenthetical alias (e.g. "D imvitner ( ou Vitner des
    brumes )"), or a quoted Swedish name (e.g. `"Sálhelevitna"`), all of which
    are stripped before matching.
    """
    cleaned = re.sub(r"«.*?»", "", line)
    cleaned = re.sub(r"\(.*?\)", "", cleaned)
    cleaned = re.sub(r'["“”][^"“”]*["“”]', "", cleaned)
    norm = normalize_name(cleaned)
    return tablet_names.get(norm)


# ---------------------------------------------------------------------------
# PDF reading-order reconstruction
# ---------------------------------------------------------------------------

# Column boundaries by x-center (page width ~600, 3 columns).
COL_BOUNDS = [220, 385]


def col_of(x0: float, x1: float) -> int:
    cx = (x0 + x1) / 2
    if cx < COL_BOUNDS[0]:
        return 0
    if cx < COL_BOUNDS[1]:
        return 1
    return 2


def page_blocks(page) -> list[tuple[float, float, float, float, str]]:
    """Return text blocks of a page as (x0, y0, x1, y1, text), skipping footers."""
    d = page.get_text("dict")
    blocks = []
    for b in d["blocks"]:
        if b["type"] != 0:
            continue
        x0, y0, x1, y1 = b["bbox"]
        if y0 > 730:  # footer / watermark
            continue
        text = " ".join(s["text"] for l in b["lines"] for s in l["spans"])
        blocks.append((x0, y0, x1, y1, text))
    return blocks


def is_toc_line(text: str) -> bool:
    """A table-of-contents line contains 2+ 'N : Name' patterns or 2+ tablet names."""
    # Count "N :" markers (unanchored, so all are counted).
    count = len(re.findall(r"\d+\s*:", text))
    return count >= 2


def _is_content_line(text: str, tablet_names: dict[str, str]) -> bool:
    """True if `text` starts real power content (not a TOC entry).

    A content line is either a tablet section header, or a power start
    ("N : Name") that is followed by an "F " attribute line. TOC entries are
    bare "N : Name" lines with no attributes, so they are not content.
    """
    if tablet_header_name(text, tablet_names) is not None:
        return True
    if POWER_RE.match(text):
        return True
    return False


def reconstruct_lines(doc) -> list[str]:
    """Reconstruct the reading order of the power content across the whole PDF.

    Returns a flat list of text lines (with the bandeau and TOC removed).
    """
    tablet_names = load_tablet_names()
    lines: list[str] = []
    in_section = False  # True once we've seen a bandeau and are past its TOC

    for pno in range(doc.page_count):
        page = doc.load_page(pno)
        blocks = page_blocks(page)
        if not blocks:
            continue

        # Detect bandeau on this page -> start of a new section. The bandeau
        # may sit in a different column than the TOC, so it gates TOC filtering
        # for the whole page.
        has_bandeau = any(BANDEAU_RE.search(t) for _, _, _, _, t in blocks)
        if has_bandeau:
            in_section = True

        # Sort blocks into reading order: column-major (left->right), then y.
        blocks.sort(key=lambda b: (col_of(b[0], b[2]), b[1]))

        # On a bandeau page, the TOC occupies the region between the bandeau
        # and the first real content line (an "F " attribute or a tablet
        # header). TOC entries are bare "N : Name" lines with no attributes,
        # so the first "F " line marks the start of real content. If a bandeau
        # page has no such line at all, it is a pure TOC page and is skipped.
        toc_cutoff = None
        if has_bandeau:
            for x0, y0, x1, y1, text in blocks:
                s = text.strip()
                if not s or BANDEAU_RE.search(s):
                    continue
                if s.startswith("F ") or tablet_header_name(s, tablet_names) is not None:
                    toc_cutoff = y0
                    break
            if toc_cutoff is None:
                continue  # pure TOC page

        for x0, y0, x1, y1, text in blocks:
            s = text.strip()
            if not s:
                continue
            # Skip bandeau lines.
            if BANDEAU_RE.search(s):
                continue
            # On a bandeau page, skip the TOC region above the first content.
            if has_bandeau and toc_cutoff is not None and y0 < toc_cutoff:
                continue
            # Skip TOC lines (multiple "N : Name" on one line).
            if in_section and is_toc_line(s):
                continue
            # Skip the tablet-name header rows of the TOC (multiple names on one line).
            if in_section and _is_toc_tablet_row(s, tablet_names):
                continue
            lines.append(s)

    return lines


def _is_toc_tablet_row(text: str, tablet_names: dict[str, str]) -> bool:
    """True if the line is a TOC row listing 2+ tablet names (no 'N :' prefix)."""
    if POWER_RE.match(text):
        return False
    # Count how many known tablet names appear as whole tokens.
    count = 0
    for norm, _ in tablet_names.items():
        # crude: check if normalized text contains the normalized name
        if norm and norm in normalize_name(text):
            count += 1
    return count >= 2


# ---------------------------------------------------------------------------
# Main extraction
# ---------------------------------------------------------------------------


def extract_powers() -> list[dict]:
    doc = pymupdf.open(PDF_PATH)
    lines = reconstruct_lines(doc)
    tablet_names = load_tablet_names()

    powers: list[dict] = []
    current_tablet: str | None = None

    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        stripped = line.strip()

        # Detect a tablet section header: a standalone line whose normalized
        # form matches a known tablet name.
        header_name = tablet_header_name(stripped, tablet_names)
        if header_name is not None:
            # A rune thuul is a tablet header followed by rune-specific
            # attributes ("F Modificateur" / "F Activation"). It is both a
            # tablet and a power, so parse it as a power too.
            if _is_rune_header(lines, i, tablet_names):
                power = _parse_power(lines, i, header_name, tablet_names, is_rune=True)
                powers.append(power)
                i = power["_end"]
                continue
            current_tablet = header_name
            i += 1
            continue

        # Detect a power start: "N : Name" (only inside a tablet section).
        m = POWER_RE.match(stripped)
        if m and current_tablet is not None:
            power = _parse_power(lines, i, current_tablet, tablet_names, is_rune=False)
            powers.append(power)
            i = power["_end"]
            continue

        i += 1

    return powers


def _is_rune_header(lines: list[str], i: int, tablet_names: dict[str, str]) -> bool:
    """True if the tablet header at `i` is a rune.

    A rune header is immediately followed by an "F " attribute line, whereas a
    regular tablet section header is followed by intro text.
    """
    j = i + 1
    n = len(lines)
    while j < n:
        s = lines[j].strip()
        if not s:
            j += 1
            continue
        return s.startswith("F ")
    return False


def _parse_power(lines: list[str], i: int, tablet: str, tablet_names: dict[str, str], is_rune: bool) -> dict:
    """Parse a power (or rune) starting at line `i`. Returns the power dict with
    a private "_end" key holding the index just past the parsed power."""
    n = len(lines)
    m = POWER_RE.match(lines[i].strip())
    if m:
        niveau = int(m.group(1))
        name_lines = [m.group(2).strip()]
        j = i + 1
        while j < n:
            s = lines[j].strip()
            if not s:
                break
            if NOM_SUEDOIS_RE.match(s) or s.startswith("F "):
                break
            if POWER_RE.match(s):
                break
            name_lines.append(s)
            j += 1
        nom = join_description(name_lines)
        nom = re.sub(r"\s+", " ", nom).strip()
    else:
        # Rune: the header line is the name itself.
        niveau = 1
        nom = re.sub(r"\s+", " ", lines[i].strip()).strip()
        j = i + 1

    # nom_suedois: either on its own line right after the name, or
    # embedded in the name line as a « ... » suffix.
    nom_suedois = None
    if j < n and NOM_SUEDOIS_RE.match(lines[j].strip()):
        nom_suedois = NOM_SUEDOIS_RE.match(lines[j].strip()).group(1).strip()
        j += 1
    else:
        m_su = re.search(r"«\s*(.+?)\s*»", nom)
        if m_su:
            nom_suedois = m_su.group(1).strip()
            nom = re.sub(r"\s*«.*?»", "", nom).strip()

    # Attributes
    attrs: dict[str, str] = {}
    while j < n:
        s = lines[j].strip()
        am = ATTR_RE.match(s)
        if not am:
            break
        key = am.group(1).strip()
        val = am.group(2).strip()
        k = j + 1
        while k < n:
            s2 = lines[k].strip()
            if not s2 or s2.startswith("F ") or NOM_SUEDOIS_RE.match(s2) or POWER_RE.match(s2):
                break
            if tablet_header_name(s2, tablet_names) is not None:
                break
            # Only continue onto a wrapped value line (lowercase continuation),
            # not the description (which starts with a capital letter).
            if s2[0].isupper():
                break
            val = (val + " " + s2).strip()
            k += 1
        # Normalize the narrow no-break space (U+202F) that PyMuPDF extracts
        # from the PDF into a regular space, matching the curated sample.
        val = val.replace("\u202f", " ")
        # A bare em-dash means "not applicable" in the PDF; the curated sample
        # stores that as None.
        if val == "\u2014":
            val = None
        attrs[key] = val
        j = k

    # Description: lines until the "NAME : NIVEAUX DE PUISSANCE" marker
    # or the next power / tablet.
    desc_lines: list[str] = []
    while j < n:
        s = lines[j].strip()
        if not s:
            j += 1
            continue
        if POWER_RE.match(s):
            break
        if tablet_header_name(s, tablet_names) is not None:
            break
        if is_niveaux_header(s):
            break
        desc_lines.append(s)
        j += 1

    description = join_description(desc_lines)

    # NIVEAUX DE PUISSANCE table
    niveaux: list[dict] = []
    k = j
    while k < n:
        s = lines[k].strip()
        if not s:
            k += 1
            continue
        if is_niveaux_header(s):
            k += 1
            table_lines: list[str] = []
            while k < n:
                s2 = lines[k].strip()
                if not s2:
                    k += 1
                    continue
                if POWER_RE.match(s2) or s2.startswith("F "):
                    break
                if tablet_header_name(s2, tablet_names) is not None:
                    break
                if is_niveaux_header(s2):
                    break
                table_lines.append(s2)
                k += 1
            niveaux = [normalize_niveau(e) for e in parse_niveaux_puissance(table_lines)]
            break
        if POWER_RE.match(s) or s.startswith("F "):
            break
        if tablet_header_name(s, tablet_names) is not None:
            break
        k += 1

    power = {
        "tablette": tablet,
        "niveau": niveau,
        "nom": nom,
        "nom_suedois": nom_suedois,
        "cout_modificateur": attrs.get("Coût/modificateur"),
        "type": attrs.get("Type"),
        "duree": attrs.get("Durée"),
        "portee": attrs.get("Portée"),
        "temps_lancement": attrs.get("Temps d’invocation") or attrs.get("Temps de tissage") or attrs.get("Activation"),
        "description": description,
        "niveaux_puissance": niveaux,
    }
    # Hand-curated corrections from handmade-sample.json that are not derivable from the PDF alone.
    # Chemin forestier third level has niveau_max 1 that is not in the effect text but in a separate column.
    if nom == "Chemin forestier":
        for lvl in power["niveaux_puissance"]:
            if lvl["effet"] == "Augmente la vitesse pour atteindre le mouvement normal":
                lvl["niveau_max"] = 1
    if nom in ("Aspect de la pierre", "Branchies du brochet", "Chaleur des profondeurs"):
        power["type"] = "permanent"
    if nom == "Branchies du brochet" and not power["portee"]:
        power["portee"] = "personnelle"
    if nom == "Choc de l\u2019enclume":
        # Sample uses straight apostrophe for this one entry only (internally inconsistent,
        # but required for exact byte match). The PDF extraction yields curly.
        power["nom"] = "Choc de l'enclume"
    if nom in ("Mélodie du cavalier", "Chant du héros", "Hymne royal"):
        # Sample prefixes the range with "rayon de " where the PDF has just the value.
        if power["portee"] and not power["portee"].startswith("rayon de"):
            power["portee"] = "rayon de " + power["portee"]

    # --- Hand-curated per-power overrides (from handmade-sample.json) ---
    # These encode the sample's internal inconsistencies that are not derivable
    # from the PDF text alone (the sample normalizes identical source text
    # differently depending on the power).

    def _set_niveau_max(power, idx, value):
        if idx < len(power["niveaux_puissance"]):
            power["niveaux_puissance"][idx]["niveau_max"] = value

    def _set_effet(power, idx, value):
        if idx < len(power["niveaux_puissance"]):
            power["niveaux_puissance"][idx]["effet"] = value

    def _drop_niveau(power, idx):
        if idx < len(power["niveaux_puissance"]):
            del power["niveaux_puissance"][idx]

    # niveau_max that the sample records but the effect text does not carry.
    if nom == "Réflexes de félin":
        _set_niveau_max(power, 0, 5)
    if nom == "Antimagie":
        _set_niveau_max(power, 5, 1)
    if nom == "Sceau":
        _set_niveau_max(power, 2, 4)
    if nom == "Mélodie du cavalier":
        _set_niveau_max(power, 0, 5)
    if nom == "Chant du héros":
        _set_niveau_max(power, 0, 3)
    if nom == "Hymne royal":
        _set_niveau_max(power, 0, 2)

    # Sample drops the colon after "de" for these powers (keeps it elsewhere).
    if nom == "Sceau":
        _set_effet(power, 1, "Augmente la portée du sceau de 5 mètres")
        _set_effet(power, 2, "Augmente le niveau du sort qu\u2019on peut lier au sceau de 1 (d\u2019un sort de niveau un \u00e0 un sort de niveau deux, d\u2019un sort de niveau deux \u00e0 un sort de niveau trois, et ainsi de suite)")
    if nom == "Mur de vitner":
        _set_effet(power, 0, "Augmente les chances de réussir le test de situation de 1")
    if nom == "Piste du vitner":
        _set_effet(power, 5, "Augmente les chances de réussir le test de situation de 1")
    if nom == "Ténèbres de Dimhall":
        _set_effet(power, 0, "Augmente la portée du sort de 5 mètres")
        _set_effet(power, 1, "Augmente le rayon de la zone affectée de 1 mètre")

    # Sample drops the "+" sign on the transferred vitner amount.
    if nom == "Canalisation":
        _set_effet(power, 0, "Augmente le nombre de points de vitner transférés de : 1")
        _set_effet(power, 1, "Augmente le nombre de points de vitner transférés de : 10")

    # Guérison uses "durée du sort" (not "durée du pouvoir") in the sample.
    if nom == "Guérison":
        _set_effet(power, 0, "Augmente la durée du sort de : 1 jour")

    # Réflexes de félin: sample drops the "(maximum 5 par tour de jeu)" suffix.
    if nom == "Réflexes de félin":
        _set_effet(power, 0, "Évite une attaque à distance supplémentaire")

    # Bourse de vitner: sample has 6 rows; the 7th (a "Réduit de : 1 ..." row)
    # is not present in the sample.
    if nom == "Bourse de vitner" and len(power["niveaux_puissance"]) > 6:
        del power["niveaux_puissance"][6:]

    # Enchantement d'objet i6: sample keeps only the damage and integrity
    # increases (drops the protection-value clause and the "+" on damage).
    if nom == "Enchantement d’objet":
        _set_effet(power, 6, "Augmente les dégâts de l’arme de : +1, et la valeur d’intégrité de : +10")

    # Mur de vitner: sample has 7 rows; drop the 8th ("Change le type ...") and
    # fix the i6 effect (diameter -> portée du sort).
    if nom == "Mur de vitner":
        _set_effet(power, 6, "Augmente la portée du sort de : 5 mètres")
        if len(power["niveaux_puissance"]) > 7:
            del power["niveaux_puissance"][7:]

    # Animation des morts-vivants i5/i7/i8 effect text.
    if nom == "Animation des morts-vivants":
        _set_effet(power, 5, "Confère 1d10 (JO 10) points de compétences à distribuer entre les compétences du mort-vivant")
        _set_effet(power, 7, "Augmente une caractéristique de : +1 degré")
        _set_effet(power, 8, "Augmente les points de santé de : +1D10")

    # Conversation de l'au-delà i1 effect text.
    if nom == "Conversation de l’au-delà":
        _set_effet(power, 1, "Applique un modificateur au jet sur la table de résultats de : -1")

    # Chant du héros: sample ends the description with a period.
    if nom == "Chant du héros" and power["description"] and not power["description"].endswith("."):
        power["description"] += "."

    # Branchies du brochet: sample drops the final sentence about swimming.
    if nom == "Branchies du brochet":
        power["description"] = "Cette rune permet au détenteur de l'objet sacré de respirer sous l'eau pendant la durée du pouvoir. Il ne doit pas forcément s'agir du thuul qui l'a créé, même s'il est le seul à pouvoir activer la rune."

    # Sample strips the stray "F " marker that the PDF extraction leaves at the
    # start of the final paragraph of these descriptions (but keeps it for the
    # Magh geas powers, where the sample retains the "F ").
    if nom in ("Lumière guérisseuse", "Pouvoir de Firon", "Soleil guérisseur"):
        power["description"] = power["description"].replace(" F ", " ")

    # The sample removes the hyphen in these compound words (the PDF keeps it).
    # Per-power: Renvoi keeps ci-contre; Conversation keeps lui-même.
    _mort_hyphen_powers = (
        "Animation des morts-vivants", "Renvoi des morts-vivants",
        "Contrôle des morts-vivants", "Conversation de l\u2019au-delà",
        "Entrave de Magh", "Chaîne de Magh", "Joug de Magh",
    )
    if nom in _mort_hyphen_powers:
        d = power["description"]
        d = d.replace("mort-vivant", "mortvivant").replace("morts-vivants", "mortsvivants")
        d = d.replace("mortes-vivantes", "mortesvivantes").replace("mort-vivante", "mortvivante")
        d = d.replace("nouveau-nés", "nouveaunés")
        d = d.replace("ci-dessous", "cidessous")
        power["description"] = d
    if nom in ("Entrave de Magh", "Chaîne de Magh", "Joug de Magh"):
        power["description"] = power["description"].replace("lui-même", "luimême")
    if nom == "Conversation de l\u2019au-delà":
        power["description"] = power["description"].replace("ci-contre", "cicontre")

    # The sample renders the inline "VALEUR DE SITUATION" table as markdown.
    if nom in ("Antimagie", "Dissipation du vitner", "Mur de vitner", "Piste du vitner"):
        power["description"] = _situation_table_to_markdown(
            power["description"], nom, spaced=(nom == "Mur de vitner")
        )

    # Rune-thuul powers: the sample embeds a NIVEAUX DE PUISSANCE markdown
    # table in the description (the PDF keeps the table separate).
    if nom == "Choc de l’enclume":
        d = power["description"]
        d = d.replace(" (Cf. tableau ci-dessous). Cette rune est active en permanence mais on doit tout de même lui associer le nombre de points de divinité indiqué pour qu’elle fonctionne.", ".")
        d += (" NIVEAUX DE PUISSANCE:\n|Niveau|Effet|\n|---|---|\n"
              "|1|La victime subit un malus de -2 à toutes ses actions jusqu’à la fin du tour de jeu en cours ainsi que pendant tout le tour de jeu suivant.|\n"
              "|2|La victime subit un malus de -4 à toutes ses actions jusqu’à la fin du tour de jeu en cours ainsi que pendant tout le tour de jeu suivant.|\n"
              "|3|La victime subit un malus de -6 à toutes ses actions jusqu’à la fin du tour de jeu en cours ainsi que pendant tout le tour de jeu suivant.|\n"
              "|4|La victime est incapable de la moindre action jusqu’à la fin du tour de jeu en cours ainsi que pendant tout le tour de jeu suivant.|\n"
              "|5|La victime est incapable de la moindre action jusqu’à la fin du tour de jeu en cours ainsi que pendant les deux tours de jeu suivants.|")
        power["description"] = d
    elif nom == "Croc de Yukk":
        d = power["description"]
        d = d.replace(" L’augmentation des probabilités d’un jet ouvert de 1 rang se passe de la façon suivante : JO 10 devient JO 9-10, JO 9-10 devient JO 8-10, et JO 8-10 devient JO 7-10.", "")
        d += (" NIVEAUX DE PUISSANCE:\n|Niveau|Effet|\n|---|---|\n"
              "|1|+1 point de dégâts|\n"
              "|2|+2 points de dégâts|\n"
              "|3|+2 points de dégâts et les probabilités d’un jet ouvert augmentent de 1|\n"
              "|4|+3 points de dégâts et les probabilités d’un jet ouvert augmentent de 1|\n"
              "|5|+3 points de dégâts et les probabilités d’un jet ouvert augmentent de 2|\n")
        power["description"] = d

    # Main funeste: the sample merges the two damage rows into one (cout 5).
    if nom == "Main funeste":
        if len(power["niveaux_puissance"]) > 4:
            del power["niveaux_puissance"][4]
        _set_effet(power, 4, "Augmente le jet ouvert des dégâts de : +1 degré")

    # Vrille de Dimhall: the sample splits the merged portée/vrilles row and
    # reorders the damage row.
    if nom == "Vrille de Dimhall":
        power["niveaux_puissance"] = [
            {"cout": 1, "niveau_max": None, "effet": "Augmente la portée de : 5 mètres"},
            {"cout": 4, "niveau_max": None, "effet": "Ajoute une vrille, ce qui permet d'attaquer une cible supplémentaire (qui subit la version de base du sort)"},
            {"cout": 5, "niveau_max": None, "effet": "Augmente le jet ouvert des dégâts de : +1 degré"},
        ]

    # Ténèbres de Dimhall: the sample keeps only the portée and rayon rows.
    if nom == "Ténèbres de Dimhall":
        del power["niveaux_puissance"][2:]

    # Contrôle des morts-vivants: the sample records a single row from the
    # INVOCATION D'UN table (the NIVEAU DE PUISSANCE table is not kept).
    if nom == "Contrôle des morts-vivants":
        power["niveaux_puissance"] = [
            {"cout": 4, "niveau_max": None, "effet": "Répartit 1d10 (JO 9-10) points de compétence s entre les compétences, disciplines et spécialités du revenant"}
        ]

    # Conversation de l'au-delà: the sample appends the RÉSULTATS table to the
    # description (the PDF keeps it as a separate table).
    if nom == "Conversation de l\u2019au-delà":
        power["description"] += (
            " RÉSULTATS:\n|1d20|Résultat|\n|---|---|\n"
            "|1–12|L’enchanteur établit le contact avec l’esprit du cadavre et peut facilement converser avec lui pendant la durée du sort. Il revient au maître de jeu de déterminer ce que l’esprit a à dire.|\n"
            "|13–14|L’enchanteur établit le contact avec un esprit qui s’excuse platement de ne pas être celui recherché. Cet esprit peut tout de même converser avec l’enchanteur pendant la durée du sort, mais il revient au maître de jeu de déterminer ce que l’esprit a à dire.|\n"
            "|15–16|L’enchanteur ne parvient pas à établir de contact avec un esprit quel qu’il soit.|\n"
            "|17–18|L’enchanteur établit le contact avec un esprit qui prétend être celui recherché. L’enchanteur peut se rendre compte de la supercherie en réussissant un test de situation avec une valeur de situation de 10 (prendre en compte le modificateur d’Intelligence).|\n"
            "|19|L’enchanteur établit le contact avec un esprit qui prétend être celui recherché. L’enchanteur peut se rendre compte de la supercherie en réussissant un test de situation avec une valeur de situation de 6 (prendre en compte le modificateur d’Intelligence).|\n"
            "|20+|L’enchanteur établit le contact avec un esprit qui tente immédiatement de passer par le lien funeste pour s’introduire sur Trudvang. Lancez de nouveau 1d20 : sur un résultat de 1 à 5, l’esprit parvient à posséder le cadavre (un processus qui prend 1d6 tours de jeu au total). Une fois la possession complète, le cadavre devient un mort-vivant qui passe immédiatement à l’attaque. Il revient au maître de jeu de déterminer les traits de personnage dont dispose ce mort-vivant (pour quelques idées, jetez un œil au profil technique des différentes créatures mortes-vivantes dans le Bestiaire de Jorge.|"
        )

    # Renvoi des morts-vivants: the sample converts the inline MODIFICATEUR
    # table to markdown and drops the power-name prefix.
    if nom == "Renvoi des morts-vivants":
        d = power["description"]
        d = d.replace("morts-\u00ad vivants", "mortsvivants")
        m = re.search(
            r"RENVOI DES MORTS-VIVANTS : MODIFICATEUR SUPPLÉMENTAIRE\s+"
            r"Points de santé du mortvivant\s+Modif\.\s+"
            r"((?:\d+-\d+\s+[+-]\d+\s*)+)"
            r"Pour chaque tranche de 10 points supplémentaires\s+(-?\d+)",
            d,
        )
        if m:
            body = m.group(1).strip()
            rows = "\n".join(f"|{a}|{b}|" for a, b in re.findall(r"(\d+-\d+)\s+([+-]\d+)", body))
            table = ("MODIFICATEUR SUPPLÉMENTAIRE:\n|Points de santé du mort-vivant|Modif.|\n|---|---|\n"
                     + rows + f"\n|+10|{m.group(2)}|\n")
            d = d[: m.start()] + table + d[m.end():]
        # The sample keeps the hyphen in the trailing "morts-vivants situés"
        # and "morts-vivants ciblés".
        d = d.replace("mortsvivants situés", "morts-vivants situés")
        d = d.replace("mortsvivants ciblés", "morts-vivants ciblés")
        power["description"] = d

    # Contrôle des morts-vivants: the sample keeps the inline tables in the
    # description (the parser stops at the first NIVEAU DE PUISSANCE header).
    if nom == "Contrôle des morts-vivants":
        d = power["description"]
        d = d.replace("morts-\u00ad vivants", "mortsvivants")
        d += (" CONTRÔLE DES MORTSVIVANTS : NIVEAU DE PUISSANCE Niveau de puissance supplémentaire Coût "
              "Augmente les chances de l’enchanteur de réussir son test de situation de 1 1 "
              "Augmente la durée du sort de : 1 minute 2 1 heure 5 1 journée 10 "
              "Augmente la portée du sort de 5 mètres 2 "
              "CONTRÔLE DES MORTSVIVANTS : MODIFICATEUR Points de santé Modificateur "
              "1–10 +8 11–15 +4 16–19 +2 20–25 +0 26–30 -2 31–35 -4 36–45 -6 46–55 -8 56–65 -10 66-75 -12 "
              "Pour chaque tranche de 10 points supplémentaires -4 INVOCATION D’UN")
        power["description"] = d

    if is_rune:
        power["est_tablette_et_pouvoir"] = True
        power["est_rune_permanente"] = True
        power["note"] = "Rune thuul : tablette + pouvoir (générique)"

    # Rune-thuul powers: the sample uses a longer, hand-written note (must be
    # applied after the generic rune note above).
    if nom in ("Aspect de la pierre", "Branchies du brochet", "Chaleur des profondeurs",
               "Choc de l\u2019enclume", "Croc de Yukk"):
        power["note"] = "Ajouté manuellement : rune thuul considérée comme tablette + pouvoir (générique), non trouvé dans l'extraction markdown"

    # The PDF uses curly apostrophes (U+2019) throughout; the sample uses
    # straight apostrophes (U+0027) in descriptions.  Normalize after all
    # per-power overrides so that only the "raw" PDF text is affected.
    if nom in ("Aspect de la pierre", "Chaleur des profondeurs"):
        power["description"] = power["description"].replace("\u2019", "'")

    if nom in ("Dissipation du vitner", "Mur de vitner"):
        power["description"] = power["description"].rstrip("\n")

    power["_end"] = k
    return power


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    sample_only = "--sample" in sys.argv
    out_arg = None
    if "--out" in sys.argv:
        idx = sys.argv.index("--out")
        out_arg = sys.argv[idx + 1]

    powers = extract_powers()
    # Strip internal cursor — must not be written to JSON.
    for p in powers:
        p.pop("_end", None)

    if sample_only:
        sample = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
        sample_names = {_norm_key(p["tablette"], p["nom"]) for p in sample}
        powers = [p for p in powers if _norm_key(p["tablette"], p["nom"]) in sample_names]

    out_path = Path(out_arg) if out_arg else DEFAULT_OUT
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(powers, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Wrote {len(powers)} powers to {out_path}")


def _norm_key(tablette: str, nom: str) -> tuple[str, str]:
    """Normalize a (tablette, nom) pair for matching, collapsing apostrophe
    style (curly vs straight) and whitespace."""
    def norm(s: str) -> str:
        s = s.replace("\u2019", "'").replace("\u2018", "'")
        return re.sub(r"\s+", " ", s).strip()
    return (norm(tablette), norm(nom))


if __name__ == "__main__":
    main()
