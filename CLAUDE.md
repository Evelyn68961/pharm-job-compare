# CLAUDE.md

Project context for Claude Code sessions. Read [README.md](README.md) first for setup/architecture — this file adds non-obvious facts and guardrails.

## What this is

**藥師命運轉盤** — a seasonal Traditional Chinese site helping Taiwanese pharmacists discover and compare hospital pharmacy jobs. Two surfaces:

- `/` — a playful MBTI quiz → pillbox-maze "fortune" reveal flow ([SpinApp.tsx](app/components/spin/SpinApp.tsx))
- `/all` — a structured filter / compare tool ([JobsView.tsx](app/components/JobsView.tsx)) with three view modes (卡片 / 比較表 / 依欄位)

Built by **pharmacists at 輔大附醫 (FJUH)**, not students. This shapes voice + scope decisions below.

## Hard scope (don't violate)

- **≤50 well-known hospitals.** Not a comprehensive Taiwan directory.
- Implications: don't propose pagination, virtualization, full-text search, autocomplete-over-thousands, or any feature that only makes sense at >100 entries.
- The bulk-import scripts in [scripts/](scripts/) (`parse-gov-eval-pdf.py`, `prepare-mc-import.py`, `hospitals-gov-bulk.json`) are legacy helpers from an earlier broader-scope plan — not the current data pipeline.

## Voice + copy

- **Traditional Chinese only.** No English UI, no i18n.
- **Never describe the site as a student project or 學生作品.** It's built by working pharmacists — voice should be practitioner insight, not classroom exercise. Current credit line is "輔大附醫藥劑部"; preserve that framing.
- Tone is playful for the spin flow, neutral-informative for /all.

## Data sourcing (governing rule)

- **No scraping of 104.** Every job is hand-entered into the 藥師職缺資料庫 Notion database by a pharmacist, with a link back to the original 104 posting. Don't propose features that scrape, parse, or auto-ingest 104 listings.
- Notion is both the database AND the admin UI. New hospitals = new rows in Notion, not new files in this repo.

## Architecture guardrails

- **One client island only** ([JobsView.tsx](app/components/JobsView.tsx)). Other view files are server-importable; don't add `'use client'` to them without strong reason.
- **No `/api/*` routes.** Server Component talks to Notion directly via [app/lib/notion.ts](app/lib/notion.ts).
- **Default order** is 薪資 tier `突出` first, then Notion insertion order. No global sort UI; per-field sort exists only inside the 依欄位 view.
- **City ranking is geographic** (north → south, Taiwan-aware) via `rankCity` in [app/lib/styles.ts](app/lib/styles.ts), not alphabetic.

## Where to look

- [README.md](README.md) — setup + tech stack
- [plan/pharmacist-job-compare-plan-v4.md](plan/pharmacist-job-compare-plan-v4.md) — latest design rationale (v1–v3 also in [plan/](plan/) for history)
- [app/lib/types.ts](app/lib/types.ts) — `Job` data model + tag / region / tier enums
- [hospital-icons-guide.md](hospital-icons-guide.md) — per-hospital icon system + the Figma + OpenPeeps workflow for swapping in real character art
- [data/hospitals-reference.md](data/hospitals-reference.md) — Taiwan medical center curation reference (read-only aid)

## Active context (update as it changes)

- **Hospital icons in v1 build-out.** `<HospitalIcon>` is wired into [ResultCard](app/components/spin/ResultCard.tsx) with 6 placeholder dashed-circle SVGs. Real character art (OpenPeeps in Figma) is the next manual step — full guide in [hospital-icons-guide.md](hospital-icons-guide.md). v1 surface is **ResultCard only** — don't expand icons to JobCard or PillboxMaze cells until user opts in.
- Archetype lineup uses the naming convention **`{2-char}藥師`** for consistency: 北漂藥師 / 教魂藥師 / 夜貓藥師 / 佛系藥師 / 學霸藥師 / 鐵腕藥師. Preserve this pattern if proposing additions or renames.
