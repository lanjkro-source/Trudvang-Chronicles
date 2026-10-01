"""Convert the private map sources to full-resolution, high-quality system assets."""

from pathlib import Path
import re
import unicodedata

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "game doc/fr/images/cartes"
OUTPUT = ROOT / "assets/maps"


def main() -> None:
    sources = sorted(
        path for path in SOURCE.iterdir()
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    destinations: set[Path] = set()
    conversions: list[tuple[Path, Path]] = []
    for source in sources:
        stem = unicodedata.normalize("NFKD", source.stem).encode("ascii", "ignore").decode()
        stem = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
        if not stem:
            raise ValueError(f"No usable asset name for {source.name}")
        destination = OUTPUT / f"{stem}.webp"
        if destination in destinations:
            raise ValueError(f"Duplicate asset name: {destination.name}")
        destinations.add(destination)
        conversions.append((source, destination))

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source, destination in conversions:
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
            image.save(destination, "WEBP", quality=95, method=6)
            with Image.open(destination) as converted:
                converted.load()
                assert converted.format == "WEBP" and converted.size == image.size
            print(f"{destination.relative_to(ROOT)}: {image.width}x{image.height}, {destination.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
