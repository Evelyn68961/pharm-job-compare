# CLAUDE.md

Project context for Claude Code sessions. Read [README.md](README.md) first for setup/architecture — this file adds non-obvious facts and guardrails.

## What this is

**藥師命運轉盤** — a seasonal Traditional Chinese site helping Taiwanese pharmacists discover hospital pharmacy jobs. One surface:

- `/` — a playful MBTI quiz → pillbox-maze "fortune" reveal flow ([SpinApp.tsx](app/components/spin/SpinApp.tsx)), ending on a scrollable result + alternatives page.

(There used to be a `/all` structured filter/compare tool — `JobsView` and friends — but it was removed per product decision. The Notion data layer it shared with the spin flow stays.)

Built by **pharmacists at 輔大附醫 (FJUH)**, not students. This shapes voice + scope decisions below.

## Hard scope (don't violate)

- **≤50 well-known hospitals.** Not a comprehensive Taiwan directory.
- Implications: don't propose pagination, virtualization, full-text search, autocomplete-over-thousands, or any feature that only makes sense at >100 entries.
- The bulk-import scripts in [scripts/](scripts/) (`parse-gov-eval-pdf.py`, `prepare-mc-import.py`, `hospitals-gov-bulk.json`) are legacy helpers from an earlier broader-scope plan — not the current data pipeline.

## Voice + copy

- **Traditional Chinese only.** No English UI, no i18n.
- **Never describe the site as a student project or 學生作品.** It's built by working pharmacists — voice should be practitioner insight, not classroom exercise. Current credit line is "輔大附醫藥劑部"; preserve that framing.
- Tone is playful for the spin flow; neutral-informative for the result/alternatives detail.

## Data sourcing (governing rule)

- **No scraping of 104.** Every job is hand-entered into the 藥師職缺資料庫 Notion database by a pharmacist, with a link back to the original 104 posting. Don't propose features that scrape, parse, or auto-ingest 104 listings.
- Notion is both the database AND the admin UI. New hospitals = new rows in Notion, not new files in this repo.

## Architecture guardrails

- **`/` (spin) is one client island** ([SpinApp.tsx](app/components/spin/SpinApp.tsx)) that orchestrates the `intro → quiz → maze → result` state machine. Sub-components (MBTIQuiz, PillboxMaze, ResultCard, AlternativesView) are also client components but driven by SpinApp state. The `result` stage is **one scrollable page**: SpinApp stacks `ResultCard` (the命運醫院 card) above `AlternativesView` (alternatives + 關於這個網站 + footer) inside a shared `max-w-2xl` wrapper — there is no separate `alternatives` stage or back/forward navigation between them. The rolling pill is always a two-tone capsule ([RollingPill](app/components/spin/RollingPill.tsx)); when it settles on the winning maze cell it cracks open in place (`opening` state — halves slide apart + powder burst + glow) and reveals the result directly. There is no separate gift-box step (the old `MysteryBox`/`box` stage was removed).
- **One real `/api`-ish route: [/og](app/og/route.tsx)** — Edge-runtime dynamic OG image via `next/og`. Server Components otherwise talk to Notion directly via [app/lib/notion.ts](app/lib/notion.ts); no other server routes.
- **Job ordering** is by hospital name (zh-Hant collation) via `sortJobs` in [app/lib/notion.ts](app/lib/notion.ts); the spin flow re-scores and weighted-samples downstream, so this ordering is mostly a stable baseline.

## Where to look

- [README.md](README.md) — setup + tech stack
- [plan/pharmacist-job-compare-plan-v4.md](plan/pharmacist-job-compare-plan-v4.md) — latest design rationale (v1–v3 also in [plan/](plan/) for history)
- [app/lib/types.ts](app/lib/types.ts) — `Job` data model + tag / region / tier enums
- [hospital-icons-guide.md](hospital-icons-guide.md) — icon system reference: 4-layer composition, archetype priority, `accentColor` tint contract, file map
- [app/components/spin/SpinApp.tsx](app/components/spin/SpinApp.tsx) — spin flow state machine entry point
- [app/lib/resolveAlternatives.ts](app/lib/resolveAlternatives.ts) — top-3 alternatives logic + FJUH lookup helper
- [app/og/route.tsx](app/og/route.tsx) — dynamic Open Graph image (Edge runtime + `next/og`)
- [data/hospitals-reference.md](data/hospitals-reference.md) — Taiwan medical center curation reference (read-only aid)

## Active context (update as it changes)

- **Icon system is fully built out, with a two-colour contract.** All 6 chibi character SVGs are hand-drawn in [archetypes/](app/components/spin/icons/archetypes/) (no Figma workflow). [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) feeds each character **two** colours: `accentColor` = `job.brandColor` (Notion `識別色`, the **primary**) drives the halo, the badge circle, and the neckerchief/collar; `secondaryColor` = `job.secondaryColor` (Notion `輔助色`, **falls back to primary** when blank/invalid via `safeBrandColor(...) ?? brandColor`) drives the held **accessory/prop** (clipboard / suitcase / mug / pill bottle / marker / seal). Accessory surfaces are tinted at `0.85` / `0.55` opacity; every tinted `fill`/`stroke` keeps an `|| '#hex'` fallback so a missing colour still renders. A `輔助色` of `—` (or any non-hex) is the convention for "intentionally single-colour" — it's ignored and falls back to primary.
- **Badge = per-archetype emblem, not initials.** [HospitalBadge](app/components/spin/icons/HospitalBadge.tsx) takes the resolved `archetype` and draws a white line-emblem in the brand-colour circle (graduation cap / train / open book / crescent+star / water lily / shield+star). `initials.ts` is now orphaned (no importers). NOTE: [hospital-icons-guide.md](hospital-icons-guide.md) predates the emblem badge + two-colour changes (it still describes the placeholder→Figma swap and initials badge) — treat it as historical until rewritten.
- **Icon scope has expanded beyond ResultCard.** Icons render in: [ResultCard](app/components/spin/ResultCard.tsx) at 96 px, [AlternativesView](app/components/spin/AlternativesView.tsx) at 56 px, and the [OG image](app/og/route.tsx). [PillboxMaze](app/components/spin/PillboxMaze.tsx) cells get faint per-archetype glyphs via the standalone [MazeEmblem](app/components/spin/MazeEmblem.tsx) (a deliberate copy of the badge glyphs — badge can evolve without touching the maze).
- **The result reveal and alternatives are one scrollable page** (no separate stage). [AlternativesView](app/components/spin/AlternativesView.tsx) renders directly below [ResultCard](app/components/spin/ResultCard.tsx) in the `result` stage: it shows up to 3 same-archetype hospitals (sorted by 薪資突出 first, fallback to other archetypes if fewer than 3 share the winner's archetype), then an FJUH-voice "關於這個網站" section with an embedded FJUH JobCard, then the shared footer (disclaimer + 再玩一次). The FJUH card looks for `輔大附醫` / `輔大附設` in `hospitalName` or `hospitalBriefName`; if not found, the section shows a placeholder. ResultCard is now presentational only (`job` + `archetype` props — no restart/continue); the footer + disclaimer live in AlternativesView.
- **Sharing flow uses dynamic OG images.** [ShareButton](app/components/spin/ShareButton.tsx) on the result card builds a URL `/?archetype=...&hospital=...&color=...`. The recipient lands on the game start (not the result), but [page.tsx](app/page.tsx)'s `generateMetadata` reads those params and points the OG image at the parameterized `/og?...` URL, so LINE/WhatsApp/IG link previews show a personalized image. Uses `navigator.share()` on mobile (native share sheet); falls back to clipboard copy on desktop.
- **Set `NEXT_PUBLIC_SITE_URL` in production** so OG image URLs resolve correctly when scraped by social platforms. Defaults to `http://localhost:3000` for dev (configured in [layout.tsx](app/layout.tsx) via `metadataBase`).
- Archetype lineup uses the naming convention **`{2-char}藥師`** for consistency: 學霸藥師 / 教魂藥師 / 北漂藥師 / 鐵腕藥師 / 夜貓藥師 / 佛系藥師. Preserve this pattern if proposing additions or renames.
- **Archetype priority order** (set in [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts)): tier-prestige > teaching > dormitory > public-sector > night-shift > chill. 醫學中心 hospitals will resolve to 學霸 even if they also have teaching tags. Reorder cautiously — changing priority shifts many existing hospitals' archetypes at once.
