# Trudvang project instructions

- Before implementing or reviewing any game-rule behavior, search `game doc/markdown/` (English books) and `game doc/markdown-fr/` (official French edition; the « Livre des règles » combines the Player's Handbook and Game Masters Guide) for the relevant rule and page references. The French edition is the terminology authority.
- When text extraction is ambiguous, a diagram or table controls the interpretation, or an exact visual structure matters, inspect the corresponding source PDF with the PDF skill.
- Treat `game doc/markdown/` and `game doc/markdown-fr/` as generated reference material. Regenerate them with `tools/extract_pdf_rules.py` after any source PDF changes.
- Keep all user-facing strings in `lang/en.json` and `lang/fr.json`, including starter content and the tablet catalogue (`TRUDVANG.Content.*`: names, themes, power summaries). `modules/tablet-catalog.mjs` holds only structural data (ids, levels, costs, religions, pages) — never display text.
- Before adding or changing language entries, consult `lang/GLOSSARY.md` and preserve its established terminology. Update the glossary whenever translated terminology changes; regenerate it with `node tools/generate-glossary.mjs --write`. Power summaries (`TRUDVANG.Content.Power.*.Summary`) are rule quotations and are excluded from the glossary.
- Git layout: `origin` is the public repository, `backup` (Trudvang-Chronicles-Dev) mirrors the same commits — always push both. `game doc/` is a separate nested private repository; never commit its contents to the outer repository.
- After any non-trivial task, increase the minor version number. After large changes, prompt the user if you should increase the major version.
