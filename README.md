# Trudvang Chronicles for Foundry VTT

This repository contains a bilingual (English/French) Foundry VTT game system for **Trudvang Chronicles**. It targets Foundry VTT 13 and 14 and is designed around compact, clickable character and NPC sheets. French terminology follows the official Black Book Éditions rulebook (« Livre des règles »).

## Features

- Tabbed character sheet: summary, skills, equipment, magic/faith, and notes.
- Compact three-tab NPC sheet intended for fast duplication and editing.
- Clickable 1d20 roll-under Skill and Situation rolls. A natural 1 always succeeds and a natural 20 always fails.
- Combat Point spending for attacks and parries, round reset, open initiative rolls, damage rolls with weapon-class open-roll thresholds, and automatic Strength modifiers.
- Derived Body Points, movement, damage-level penalties, fear penalties, equipped protection, and initiative modifiers.
- Creation-cost display plus rule-aware Adventure Point purchases for Skill Values, disciplines, specialties, and tablets.
- Drag-and-drop Item documents for weapons, armor, shields, gear, extracts, spells, tablets, divine feats, disciplines, specialties, and creature feats.
- An automatically installed starter library with 40+ detailed Items, the Fatal Magic and Fatal Failure Roll Tables, and 8 illustrated NPCs.
- Extracted Trudvang artwork for sheet decoration and eight ready-to-use creature tokens.
- Every user-facing string — interface labels, starter content, and the full tablet catalogue (names, themes, power summaries) — is centralized in `lang/en.json` and `lang/fr.json`, with French text taken from the official edition.
- Native `TypeDataModel` schemas are registered for every Actor and Item subtype; the deprecated `template.json` mechanism is not used.

## Installation for development

1. Place or link this directory at `Data/systems/trudvang-chronicles` in the Foundry user-data directory.
2. Restart Foundry VTT.
3. Create a world and select **Trudvang Chronicles** as its game system.
4. Enter the world as a GM. The starter Item, Roll Table, and NPC folders are installed once automatically.

Run the local validation suite with:

```powershell
npm run check
```

No build step or third-party JavaScript dependency is required.

## Playing

- Click a trait for a Situation roll (base 10 plus the trait modifier).
- Click a skill for a Skill roll. The dialog accepts the situational modifier before rolling.
- Click a discipline or specialty to include its level bonus in its parent Skill Value.
- Equip weapons, shields, and armor with the hand/shield button. Equipped initiative, movement, and Protection Value modifiers are derived automatically.
- Click a weapon name to attack, the shield icon to parry, or the burst icon to roll damage. The attack/parry dialog chooses how many Combat Points to spend.
- Click a spell or divine feat to roll and spend Vitner or Divinity Points. The cost can be raised for levels of power.
- Drag world Items into an Actor sheet, or duplicate any starter NPC and edit the copy.

## Content and art notice

Rules data and artwork were derived from the PDF books supplied in `game doc` (English books) and `game doc/fr` (official French edition from Black Book Éditions; the « Livre des règles » combines the Player's Handbook and Game Master's Guide). Searchable text mirrors live in `game doc/markdown/` and `game doc/markdown-fr/`; regenerate them with `tools/extract_pdf_rules.py` after any source PDF change. The original Trudvang text and art remain the property of their respective rights holders. Before publishing or redistributing this system or its extracted images, obtain the necessary permission or replace restricted content with licensed assets.

## Current boundary

This first playable release implements the core resolution, combat, damage, fear, equipment, magic-resource, progression, and sheet workflows. The starter library is representative rather than an exhaustive transcription of every spell, divine feat, item, and creature in the books. Its structured importer and localization scheme are intended to make further content additions straightforward.
