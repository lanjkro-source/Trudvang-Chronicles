"""Extract the local Trudvang PDF library into searchable Markdown files."""

from __future__ import annotations

import hashlib
import re
from datetime import date
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "game doc"
SOURCE_DIRS = [
    (PDF_DIR, PDF_DIR / "markdown"),
    (PDF_DIR / "fr", PDF_DIR / "markdown-fr"),
]


def normalize_text(text: str) -> str:
    replacements = {
        "\u0000": "",
        "\u00ad": "",
        "ﬁ": "fi",
        "ﬂ": "fl",
        "ﬀ": "ff",
        "ﬃ": "ffi",
        "ﬄ": "ffl",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip()


def title_from_stem(stem: str) -> str:
    return " ".join(part.capitalize() for part in stem.replace("-pdf-free", "").split("-"))


def extract_pdf(pdf_path: Path, output_dir: Path) -> dict[str, object]:
    reader = PdfReader(pdf_path)
    digest = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    title = title_from_stem(pdf_path.stem)
    output_path = output_dir / f"{pdf_path.stem}.md"
    sections = [
        f"# {title}",
        "",
        f"> Searchable text extraction of `{pdf_path.name}`.",
        f"> PDF pages: {len(reader.pages)}. Source SHA-256: `{digest}`.",
        "> Page numbers below are physical PDF pages; printed book page numbers may differ.",
        "",
    ]
    extracted_pages = 0
    character_count = 0
    for page_number, page in enumerate(reader.pages, start=1):
        text = normalize_text(page.extract_text() or "")
        sections.extend([f"## PDF page {page_number}", ""])
        if text:
            sections.extend([text, ""])
            extracted_pages += 1
            character_count += len(text)
        else:
            sections.extend(["_[No extractable text on this page.]_", ""])
    output_path.write_text("\n".join(sections).rstrip() + "\n", encoding="utf-8", newline="\n")
    return {
        "pdf": pdf_path.name,
        "markdown": output_path.name,
        "pages": len(reader.pages),
        "extracted_pages": extracted_pages,
        "characters": character_count,
        "sha256": digest,
    }


def write_index(output_dir: Path, records: list[dict[str, object]]) -> None:
    index = [
        "# Trudvang PDF text index",
        "",
        f"> Generated {date.today().isoformat()} by `tools/extract_pdf_rules.py`.",
        "> These Markdown files are searchable mirrors for rules research. Verify diagrams, tables, and ambiguous layouts against the source PDF.",
        "",
        "| Source PDF | Markdown | Pages | Pages with text | Characters |",
        "|---|---:|---:|---:|---:|",
    ]
    for record in records:
        index.append(
            f"| `{record['pdf']}` | [{record['markdown']}]({record['markdown']}) | "
            f"{record['pages']} | {record['extracted_pages']} | {record['characters']} |"
        )
    index.extend([
        "",
        "## Searching",
        "",
        "From the repository root:",
        "",
        "```powershell",
        f"rg -n -i -C 4 \"search terms\" \"{output_dir.relative_to(ROOT).as_posix()}\"",
        "```",
        "",
        "Regenerate the mirrors after replacing a PDF:",
        "",
        "```powershell",
        "python tools/extract_pdf_rules.py",
        "```",
    ])
    (output_dir / "README.md").write_text("\n".join(index) + "\n", encoding="utf-8", newline="\n")


def main() -> None:
    for source_dir, output_dir in SOURCE_DIRS:
        if not source_dir.is_dir():
            continue
        output_dir.mkdir(parents=True, exist_ok=True)
        pdfs = sorted(source_dir.glob("*.pdf"))
        records = [extract_pdf(path, output_dir) for path in pdfs]
        write_index(output_dir, records)
        print(f"Extracted {len(records)} PDFs to {output_dir}")
        for record in records:
            print(f"- {record['pdf']}: {record['pages']} pages, {record['characters']} characters")


if __name__ == "__main__":
    main()
