"""Extract selected Trudvang rulebook pages for implementation research.

Page ranges use the printed PDF page numbers (1-based and inclusive).
"""

from pathlib import Path

from pypdf import PdfReader


BOOKS = {
    "players": ("trudvang-chronicles-players-handbook.pdf", [(8, 45), (78, 92), (150, 154)]),
    "gm": ("trudvang-chronicles-game-masters-guide.pdf", [(7, 12), (39, 94)]),
    "bestiary": ("trudvang-chronicles-jorgis-bestiary.pdf", [(7, 34)]),
}


def main() -> None:
    source = Path("game doc")
    target = Path("tmp/pdfs")
    target.mkdir(parents=True, exist_ok=True)
    for slug, (filename, ranges) in BOOKS.items():
        reader = PdfReader(source / filename)
        parts: list[str] = []
        for start, end in ranges:
            for page_number in range(start, end + 1):
                text = reader.pages[page_number - 1].extract_text() or ""
                parts.append(f"\n\n===== PDF PAGE {page_number} =====\n\n{text}")
        (target / f"{slug}-rules.txt").write_text("".join(parts), encoding="utf-8")


if __name__ == "__main__":
    main()
