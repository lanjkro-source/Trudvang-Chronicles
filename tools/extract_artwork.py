"""Extract selected embedded Trudvang artwork and create token crops."""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
from pypdf import PdfReader


PYTHON_BOOK = Path("game doc/trudvang-chronicles-players-handbook.pdf")
BESTIARY_BOOK = Path("game doc/trudvang-chronicles-jorgis-bestiary.pdf")


def candidates(reader: PdfReader, page_number: int, excluded_areas: set[int]) -> list[Image.Image]:
    found: list[Image.Image] = []
    for item in reader.pages[page_number - 1].images:
        try:
            image = item.image.convert("RGB")
        except Exception:
            continue
        area = image.width * image.height
        if area < 80000 or area in excluded_areas or min(image.size) < 250:
            continue
        found.append(image)
    return sorted(found, key=lambda image: image.width * image.height, reverse=True)


def save_webp(image: Image.Image, path: Path, max_size: int = 1200) -> None:
    output = ImageOps.exif_transpose(image)
    output.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    output.save(path, "WEBP", quality=88, method=6)


def token_crop(image: Image.Image, path: Path, focus_y: float = 0.45) -> None:
    size = min(image.width, image.height)
    left = (image.width - size) // 2
    top = max(0, min(image.height - size, round((image.height - size) * focus_y)))
    token = image.crop((left, top, left + size, top + size)).resize((512, 512), Image.Resampling.LANCZOS)
    token = ImageEnhance.Contrast(token).enhance(1.06)
    token.save(path, "WEBP", quality=90, method=6)


def main() -> None:
    art_dir = Path("assets/art")
    token_dir = Path("assets/tokens")
    art_dir.mkdir(parents=True, exist_ok=True)
    token_dir.mkdir(parents=True, exist_ok=True)

    players = PdfReader(PYTHON_BOOK)
    player_exclusions = {561323, 852410, 853437}
    frame = candidates(players, 10, player_exclusions)[0]
    save_webp(frame, art_dir / "character-sheet-frame.webp")
    header = candidates(players, 9, player_exclusions)[0]
    save_webp(header, art_dir / "character-sheet-header.webp")

    bestiary = PdfReader(BESTIARY_BOOK)
    bestiary_exclusions = {1851930, 852410, 853437, 852212, 846848}
    creatures = {
        "galtir": (16, 0.35),
        "giant-snake": (18, 0.35),
        "giant-spider": (21, 0.3),
        "gryphon": (23, 0.35),
        "night-ulm": (25, 0.35),
        "thorn-beast": (28, 0.3),
        "troll-bull": (30, 0.4),
        "warg-beast": (32, 0.4),
    }
    for slug, (page, focus_y) in creatures.items():
        available = candidates(bestiary, page, bestiary_exclusions)
        if not available:
            raise RuntimeError(f"No artwork candidate found on bestiary page {page}")
        artwork = available[0]
        save_webp(artwork, art_dir / f"{slug}.webp")
        token_crop(artwork, token_dir / f"{slug}.webp", focus_y)


if __name__ == "__main__":
    main()
